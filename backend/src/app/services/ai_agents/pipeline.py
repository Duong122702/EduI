import asyncio
import logging

from src.app.services.ai_agents.chains import (
    run_chain_1_router,
    run_chain_2_parser,
    run_chain_3_evaluator,
)

logger = logging.getLogger("fastapi_logger")


async def execute_exam_agent_pipeline(raw_text: str) -> tuple[dict, list[dict]]:
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

    # 3. CHAIN 3: Đánh giá độ khó & Giải chi tiết
    logger.info(">>> Đang chạy Chain 3: Chuẩn bị dữ liệu xử lý...")

    # Bóc tách Đoạn văn (Passage) và Câu hỏi (Question)
    passages_map = {
        item["temp_id"]: item
        for item in all_raw_questions
        if item.get("is_passage") is True
    }
    questions_to_evaluate = [
        item for item in all_raw_questions if item.get("is_passage") is False
    ]

    # Khởi tạo mảng kết quả cuối cùng. Bỏ luôn các Đoạn văn vào vì không cần giải.
    final_evaluated_items = list(passages_map.values())
    batch_size = 5

    logger.info(
        f">>> Có {len(questions_to_evaluate)} câu hỏi cần giải và {len(passages_map)} đoạn văn làm ngữ cảnh."
    )

    for i in range(0, len(questions_to_evaluate), batch_size):
        batch = questions_to_evaluate[i : i + batch_size]

        # Tiêm đoạn văn Cha vào batch để AI có ngữ cảnh đọc hiểu
        payload_batch = []
        parents_in_this_batch = set()

        for q in batch:
            p_id = q.get("temp_parent_id")
            if p_id and p_id in passages_map and p_id not in parents_in_this_batch:
                payload_batch.append(passages_map[p_id])
                parents_in_this_batch.add(p_id)
            payload_batch.append(q)

        try:
            evaluated_batch = await run_chain_3_evaluator(
                payload_batch, exam_meta.get("subject", "")
            )
            # Chỉ lấy các câu hỏi đã giải đưa vào list cuối cùng, bỏ qua đoạn văn cha bị AI trả về thừa
            for evaluated_item in evaluated_batch:
                if not evaluated_item.get("is_passage"):
                    final_evaluated_items.append(evaluated_item)

        except Exception as e:
            logger.error(f"Lỗi khi đánh giá batch {i}-{i + batch_size}: {e}")
            final_evaluated_items.extend(batch)

        await asyncio.sleep(4)  # Throttling

    return exam_meta, final_evaluated_items
