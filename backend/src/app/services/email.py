import resend

from app.core.config import settings  # type: ignore

resend.api_key = settings.RESEND_API_KEY


class EmailService:
    @staticmethod
    def send_activation_email(
        to_email: str, fullname: str, activation_token: str
    ) -> None:
        activation_link = f"{settings.DOMAIN}/verify_email/{activation_token}"
        html_content = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
            <h2 style="color: #333;">Chào mừng {fullname}!</h2>
            <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng kích hoạt tài khoản của bạn bằng cách nhấn vào nút bên dưới:</p>
            <p style="text-align: center; margin: 30px 0;">
                <a href="{activation_link}"
                   style="background-color: #000000; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
                   Kích hoạt tài khoản
                </a>
            </p>
            <p style="color: #666; font-size: 13px;">Nếu nút trên không hoạt động, bạn có thể copy và dán liên kết này vào trình duyệt:</p>
            <p style="color: #0066cc; font-size: 13px; word-break: break-all;">{activation_link}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;" />
            <p style="color: #999; font-size: 12px;">Đây là email tự động, vui lòng không trả lời email này.</p>
        </div>
        """
        try:
            # Gọi SDK Resend để gửi đi
            resend.Emails.send(
                {
                    "from": settings.FROM_EMAIL,
                    "to": to_email,
                    "subject": "Xác nhận kích hoạt tài khoản",
                    "html": html_content,
                }
            )
        except Exception as e:
            # Trong thực tế, bạn nên sử dụng thư viện logging của Python để ghi log lỗi
            print(f"Lỗi hệ thống khi gửi email đến {to_email}: {str(e)}")
