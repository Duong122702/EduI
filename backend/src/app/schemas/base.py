from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class AppBaseModel(BaseModel):
    model_config = ConfigDict(
        # 1. Tự động chuyển snake_case ở Python thành camelCase ở JSON
        alias_generator=to_camel,
        # 2. Cho phép nhận dữ liệu bằng BẤT KỲ tên nào (gửi camelCase hay snake_case backend cũng nhận hết)
        populate_by_name=True,
        from_attributes=True,
        extra="ignore",
    )
