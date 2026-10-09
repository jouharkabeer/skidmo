from rest_framework import authentication, exceptions
from django.utils import timezone
from .models import AdminSession


class AdminTokenAuthentication(authentication.BaseAuthentication):
    keyword = 'Bearer'

    def authenticate(self, request):
        header = authentication.get_authorization_header(request).decode('utf-8')
        if not header:
            return None
        parts = header.split()
        if len(parts) != 2 or parts[0] != self.keyword:
            return None
        token = parts[1]
        try:
            session = AdminSession.objects.get(token=token, expires_at__gt=timezone.now())
        except AdminSession.DoesNotExist:
            raise exceptions.AuthenticationFailed('Invalid or expired admin token')
        return (session, token)
