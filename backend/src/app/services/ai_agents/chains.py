# src/app/services/ai_agents/chains.py
import asyncio
import json
import re
from typing import Any

import anthropic

from src.app.core.config import settings
from src.app.services.ai_agents import prompts

client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)


async def call_claude_with_retry(
    model: str, contents: str, max_retries: int = 3
) -> Any:
    """Hàm gọi Claude an toàn, tự động backoff nếu chạm Rate Limit"""
    for attempt in range(max_retries):
        try:
            # Chạy hàm sync SDK trong worker thread để không block async loop
            response = await client.messages.create(
                model=model,
                max_tokens=4096,
                messages=[{"role": "user", "content": contents}],
            )
            # Lấy nội dung text từ response của Claude
            text_response = "".join(
                block.text
                for block in getattr(response, "content", [])
                if getattr(block, "type", "") == "text"
            )
            if not text_response.strip():
                raise ValueError("Empty response from Claude")
            clean_str = text_response.strip()
            match = re.search(r"(\[.*\]|\{.*\})", clean_str, re.DOTALL)
            if match:
                clean_str = match.group(0)
            return json.loads(clean_str)
        except Exception as e:
            is_retriable = any(err in str(e) for err in ["429", "529"]) or isinstance(
                e, (json.JSONDecodeError, ValueError)
            )
            if is_retriable and attempt < max_retries - 1:
                await asyncio.sleep(4 * (attempt + 1))  # Exponential backoff
                continue
            raise e


async def run_chain_1_router(raw_text: str) -> dict[str, Any]:
    prompt = f"{prompts.PROMPT_CHAIN_1}\n\nVĂN BẢN ĐỀ THI:\n{raw_text}"
    return await call_claude_with_retry(
        model="claude-3-haiku-20240307", contents=prompt
    )


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
    return await call_claude_with_retry(
        model="claude-3-haiku-20240307", contents=full_prompt
    )


