# src/app/services/ai_agents/chains.py
import asyncio
import json
import re
from typing import Any, cast

from google import genai
from google.genai import types

from src.app.core.config import settings
from src.app.services.ai_agents import prompts

client = genai.Client(api_key=settings.GEMINI_API_KEY)


def _clean_and_parse_json(text: str | None) -> Any:
    if not text:
        return {}
    clean_str = text.strip()
    match = re.search(r"(\[.*\]|\{.*\})", clean_str, re.DOTALL)
    if match:
        clean_str = match.group(0)
    try:
        return json.loads(clean_str)
    except json.JSONDecodeError:
        return {}


async def call_gemini_with_retry(
    model: str, contents: str, max_retries: int = 3
) -> Any:
    """Hàm gọi Gemini an toàn, tự động backoff nếu chạm Rate Limit"""
    for attempt in range(max_retries):
        try:
            # Chạy hàm sync SDK trong worker thread để không block async loop
            response = await asyncio.to_thread(
                client.models.generate_content,
                model=model,
                contents=contents,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json", temperature=0.1
                ),
            )
            return _clean_and_parse_json(response.text)
        except Exception as e:
            if "429" in str(e) and attempt < max_retries - 1:
                await asyncio.sleep(4 * (attempt + 1))  # Exponential backoff
                continue
            raise e


async def run_chain_1_router(raw_text: str) -> dict[str, Any]:
    prompt = f"{prompts.PROMPT_CHAIN_1}\n\nVĂN BẢN ĐỀ THI:\n{raw_text}"
    return await call_gemini_with_retry(model="gemini-1.5-flash", contents=prompt)


async def run_chain_2_parser(
    section: dict[str, Any], exam_meta: dict[str, Any]
) -> list[dict[str, Any]]:
    group = exam_meta.get("routing_group", "KHTN")
    if group == "KHXH":
        base_prompt = prompts.PROMPT_CHAIN_2_KHXH
    elif group == "Ngoại ngữ":
        base_prompt = prompts.PROMPT_CHAIN_2_ENGLISH
    else:
        base_prompt = prompts.PROMPT_CHAIN_2_KHTN

    prompt = base_prompt.format(
        subject=exam_meta.get("subject", "Chung"),
        exam_name=exam_meta.get("exam_name", "Đề thi"),
        question_type=section.get("question_type", "Trắc nghiệm"),
    )
    full_prompt = f"{prompt}\n\nVĂN BẢN CẦN XỬ LÝ:\n{section.get('raw_content', '')}"
    return await call_gemini_with_retry(model="gemini-1.5-flash", contents=full_prompt)


async def run_chain_3_evaluator(
    questions_batch: list[dict[str, Any]], subject: str
) -> list[dict[str, Any]]:
    prompt = prompts.PROMPT_CHAIN_3_REASONING.format(subject=subject)
    full_prompt = f"{prompt}\n\nDANH SÁCH CÂU HỎI:\n{json.dumps(questions_batch, ensure_ascii=False)}"
    result = await call_gemini_with_retry(model="gemini-1.5-pro", contents=full_prompt)

    if isinstance(result, list):
        return cast(list[dict[str, Any]], result)
    return questions_batch
