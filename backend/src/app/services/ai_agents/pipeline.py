import asyncio
import logging

from src.app.services.ai_agents.chains import (
    run_chain_1_router,
    run_chain_2_parser,
    run_chain_3_evaluator,
)

logger = logging.getLogger("fastapi_logger")


async def execute_exam_agent_pipeline(raw_text: str) -> tuple[dict, list[dict]]:
    """
    Điều phối luồng 3-Chain AI Agent
    """
    # 1. CHAIN 1: Routing & Phân tích vĩ mô
    logger.info(">>> Đang chạy Chain 1: Routing & Phân tách phần thi...")
    macro_data = await run_chain_1_router(raw_text)
    exam_meta = macro_data.get("exam_metadata", {})
    sections = macro_data.get("sections", [])

    # 2. CHAIN 2: Bóc tách chi tiết từng phần
    logger.info(f">>> Đang chạy Chain 2: Parser cho môn {exam_meta.get('subject')}...")
    all_raw_questions = []
    for sec in sections:
        sec_questions = await run_chain_2_parser(sec, exam_meta)
        if isinstance(sec_questions, list):
            all_raw_questions.extend(sec_questions)

    # 3. CHAIN 3: Đánh giá độ khó & Giải chi tiết theo lô (Micro-batching 5 câu/lượt)
    logger.info(
        f">>> Đang chạy Chain 3: Reasoning cho tổng cộng {len(all_raw_questions)} câu..."
    )
    final_evaluated_questions = []
    batch_size = 5

    for i in range(0, len(all_raw_questions), batch_size):
        batch = all_raw_questions[i : i + batch_size]
        try:
            evaluated_batch = await run_chain_3_evaluator(
                batch, exam_meta.get("subject", "")
            )
            final_evaluated_questions.extend(evaluated_batch)
        except Exception as e:
            logger.error(f"Lỗi khi đánh giá batch {i}-{i + batch_size}: {e}")
            # Fallback: Giữ nguyên batch nếu Chain 3 lỗi
            final_evaluated_questions.extend(batch)

        # Throttling để tránh dính Rate Limit 15 RPM của gói Free
        await asyncio.sleep(4)

    return exam_meta, final_evaluated_questions
