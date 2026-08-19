import resend
from app.core.config import settings

class NotificationAdapter:
    def __init__(self):
        if settings.RESEND_API_KEY:
            resend.api_key = settings.RESEND_API_KEY

    async def send_email(self, to_email: str, subject: str, html_body: str) -> bool:
        if not settings.RESEND_API_KEY:
            print(f"[STAGING NOTIFICATION EMAIL] To: {to_email} | Subject: {subject}\n{html_body}\n")
            return True
        try:
            params = {
                "from": settings.EMAIL_FROM,
                "to": [to_email],
                "subject": subject,
                "html": html_body,
            }
            resend.Emails.send(params)
            return True
        except Exception as e:
            print(f"Error sending email via Resend: {str(e)}")
            return False

notification_service = NotificationAdapter()
