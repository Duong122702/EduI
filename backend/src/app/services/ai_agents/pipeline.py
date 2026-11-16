import logging
from typing import Any

from src.app.services.ai_agents.chains import (
    run_chain_1_router,
    run_chain_2_parser,
)

logger = logging.getLogger("fastapi_logger")


async def extract_exam_from_text(raw_text: str) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    logger.info(">>> Chain 1: Routing & Phân tách phần thi...")
    macro_data = await run_chain_1_router(raw_text)
    exam_meta = macro_data.get("exam_metadata", {})
    sections = macro_data.get("sections", [])

    logger.info(f">>> Chain 2: Parser cho môn {exam_meta.get('subject')}...")
    all_questions: list[dict[str, Any]] = []
    for sec in sections:
        sec_questions = await run_chain_2_parser(sec, exam_meta)
        if isinstance(sec_questions, list):
            all_questions.extend(sec_questions)

    logger.info(f">>> Trích xuất xong: {len(all_questions)} câu hỏi.")
    return exam_meta, all_questions
