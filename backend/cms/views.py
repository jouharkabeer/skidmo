import json
import secrets
from datetime import timedelta

from django.conf import settings
from django.core.files.storage import default_storage
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    AdminSession,
    GalleryImage,
    Offer,
    Testimonial,
    FAQ,
    CompanyInfo,
    HomeStats,
    HomeHero,
    SiteSettings,
)
from .permissions import IsAdminAuthenticated
from .serializers import (
    AdminLoginSerializer,
    GalleryImageSerializer,
    OfferSerializer,
    TestimonialSerializer,
    FAQSerializer,
    CompanyInfoSerializer,
    HomeStatsSerializer,
    HomeHeroSerializer,
    SiteSettingsSerializer,
)


@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    serializer = AdminLoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    expected = settings.ADMIN_API_PASSWORD
    if not expected:
        return Response(
            {'error': 'Admin password is not configured on the server.'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )
    if serializer.validated_data['password'] != expected:
        return Response({'error': 'Incorrect password.'}, status=status.HTTP_401_UNAUTHORIZED)

    token = secrets.token_urlsafe(32)
    AdminSession.objects.create(
        token=token,
        expires_at=timezone.now() + timedelta(hours=12),
    )
    return Response({'token': token, 'expiresInHours': 12})


@api_view(['POST'])
@permission_classes([IsAdminAuthenticated])
def admin_logout(request):
    AdminSession.objects.filter(token=request.auth).delete()
    return Response({'success': True})


@api_view(['POST'])
@permission_classes([AllowAny])
def contact(request):
    """Public contact form — sends email via SMTP (used in Docker / VPS deploy)."""
    from django.core.mail import send_mail

    data = request.data if isinstance(request.data, dict) else {}
    name = str(data.get('name', '')).strip()
    email = str(data.get('email', '')).strip()
    phone = str(data.get('phone', '')).strip()
    service = str(data.get('service', '')).strip()
    message = str(data.get('message', '')).strip()

    if not name or not email or not message:
        return Response(
            {'error': 'Name, email, and message are required.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    to_addr = getattr(settings, 'CONTACT_TO_EMAIL', '') or settings.DEFAULT_FROM_EMAIL
    if not to_addr:
        return Response(
            {'error': 'Contact email is not configured on the server.'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    body = (
        f'Name: {name}\n'
        f'Email: {email}\n'
        f'Phone: {phone}\n'
        f'Service: {service}\n\n'
        f'Message:\n{message}\n'
    )
    try:
        send_mail(
            subject=f'SKIDMO inquiry — {name}',
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[to_addr],
            fail_silently=False,
        )
    except Exception:
        return Response(
            {'error': 'Failed to send message. Please try again or call us directly.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    return Response({'success': True})


class PublicReadAdminWriteViewSet(viewsets.ModelViewSet):
    """List/retrieve public; create/update/destroy require admin token."""

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [AllowAny()]
        return [IsAdminAuthenticated()]


class GalleryViewSet(PublicReadAdminWriteViewSet):
    queryset = GalleryImage.objects.all()
    serializer_class = GalleryImageSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    @action(detail=False, methods=['get'], permission_classes=[AllowAny], url_path='categories')
    def categories(self, request):
        cats = (
            GalleryImage.objects.exclude(category='')
            .values_list('category', flat=True)
            .distinct()
        )
        return Response(['All', *sorted(set(cats))])


class OfferViewSet(PublicReadAdminWriteViewSet):
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        qs = super().get_queryset()
        if self.request.auth:
            return qs
        return qs.filter(status='active')


class TestimonialViewSet(PublicReadAdminWriteViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class FAQViewSet(PublicReadAdminWriteViewSet):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer


class CompanyInfoView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminAuthenticated()]

    def get(self, request):
        obj = CompanyInfo.objects.first()
        if not obj:
            return Response(None)
        return Response(CompanyInfoSerializer(obj, context={'request': request}).data)

    def put(self, request):
        obj = CompanyInfo.objects.first()
        if obj:
            serializer = CompanyInfoSerializer(obj, data=request.data, partial=True)
        else:
            serializer = CompanyInfoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class HomeStatsView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminAuthenticated()]

    def get(self, request):
        obj = HomeStats.objects.first()
        if not obj:
            return Response({'stats': []})
        return Response(HomeStatsSerializer(obj).data)

    def put(self, request):
        obj = HomeStats.objects.first()
        data = {'stats': request.data.get('stats', request.data)}
        if obj:
            serializer = HomeStatsSerializer(obj, data=data)
        else:
            serializer = HomeStatsSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class HomeHeroView(APIView):
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminAuthenticated()]

    def get(self, request):
        obj = HomeHero.objects.first()
        if not obj:
            return Response(None)
        return Response(HomeHeroSerializer(obj).data)

    def put(self, request):
        obj = HomeHero.objects.first() or HomeHero()
        payload = request.data.copy()
        slides_raw = payload.get('slides')
        if isinstance(slides_raw, str):
            payload['slides'] = json.loads(slides_raw)

        slides = list(payload.get('slides') or obj.slides or [])
        for i in range(len(slides)):
            uploaded = request.FILES.get(f'slideImage{i}')
            if uploaded:
                path = default_storage.save(f'hero/{uploaded.name}', uploaded)
                url = request.build_absolute_uri(settings.MEDIA_URL + path)
                slides[i] = {**slides[i], 'imageUrl': url, 'image': None}
        payload['slides'] = slides

        serializer = HomeHeroSerializer(obj, data=payload, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class SiteSettingsView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminAuthenticated()]

    def get(self, request):
        obj = SiteSettings.objects.first()
        if not obj:
            return Response(None)
        return Response(SiteSettingsSerializer(obj).data)

    def put(self, request):
        obj = SiteSettings.objects.first()
        if obj:
            serializer = SiteSettingsSerializer(obj, data=request.data, partial=True)
        else:
            serializer = SiteSettingsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
