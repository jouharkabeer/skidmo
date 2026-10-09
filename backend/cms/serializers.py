from rest_framework import serializers
from .models import (
    GalleryImage,
    Offer,
    Testimonial,
    FAQ,
    CompanyInfo,
    HomeStats,
    HomeHero,
    SiteSettings,
)


def absolute_media_url(request, file_field):
    if not file_field:
        return None
    url = file_field.url
    if request:
        return request.build_absolute_uri(url)
    return url


class GalleryImageSerializer(serializers.ModelSerializer):
    imageUrl = serializers.SerializerMethodField()
    altText = serializers.CharField(source='alt_text', required=False, allow_blank=True)

    class Meta:
        model = GalleryImage
        fields = ['id', 'title', 'image', 'imageUrl', 'category', 'description', 'altText', 'created_at']
        read_only_fields = ['id', 'imageUrl', 'created_at']
        extra_kwargs = {'image': {'write_only': True, 'required': False}}

    def get_imageUrl(self, obj):
        return absolute_media_url(self.context.get('request'), obj.image)


class OfferSerializer(serializers.ModelSerializer):
    bannerWebUrl = serializers.SerializerMethodField()
    bannerMobileUrl = serializers.SerializerMethodField()
    startDate = serializers.DateField(source='start_date')
    expiryDate = serializers.DateField(source='expiry_date')
    buttonText = serializers.CharField(source='button_text')
    buttonLink = serializers.CharField(source='button_link')

    class Meta:
        model = Offer
        fields = [
            'id', 'title', 'description',
            'banner_web', 'banner_mobile', 'bannerWebUrl', 'bannerMobileUrl',
            'startDate', 'expiryDate', 'buttonText', 'buttonLink',
            'status', 'priority', 'created_at',
        ]
        read_only_fields = ['id', 'bannerWebUrl', 'bannerMobileUrl', 'created_at']
        extra_kwargs = {
            'banner_web': {'write_only': True, 'required': False},
            'banner_mobile': {'write_only': True, 'required': False},
        }

    def get_bannerWebUrl(self, obj):
        return absolute_media_url(self.context.get('request'), obj.banner_web)

    def get_bannerMobileUrl(self, obj):
        return absolute_media_url(self.context.get('request'), obj.banner_mobile)


class TestimonialSerializer(serializers.ModelSerializer):
    avatarUrl = serializers.SerializerMethodField()

    class Meta:
        model = Testimonial
        fields = [
            'id', 'name', 'role', 'content', 'rating',
            'avatar', 'avatarUrl', 'date', 'source', 'created_at',
        ]
        read_only_fields = ['id', 'avatarUrl', 'created_at']
        extra_kwargs = {'avatar': {'write_only': True, 'required': False}}

    def get_avatarUrl(self, obj):
        return absolute_media_url(self.context.get('request'), obj.avatar)


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ['id', 'question', 'answer', 'category', 'order']


class CompanyInfoSerializer(serializers.ModelSerializer):
    workshopImages = serializers.JSONField(source='workshop_images', required=False)

    class Meta:
        model = CompanyInfo
        fields = [
            'id', 'name', 'tagline', 'about', 'mission', 'vision',
            'values', 'workshopImages',
        ]


class HomeStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeStats
        fields = ['id', 'stats']


class HomeHeroSerializer(serializers.ModelSerializer):
    titleBefore = serializers.CharField(source='title_before', required=False, allow_blank=True)
    titleAccent = serializers.CharField(source='title_accent', required=False, allow_blank=True)
    titleAfter = serializers.CharField(source='title_after', required=False, allow_blank=True)

    class Meta:
        model = HomeHero
        fields = [
            'id', 'badge', 'titleBefore', 'titleAccent', 'titleAfter', 'slides',
        ]


class SiteSettingsSerializer(serializers.ModelSerializer):
    siteName = serializers.CharField(source='site_name', required=False)
    elfsightWidgetId = serializers.CharField(source='elfsight_widget_id', required=False, allow_blank=True)
    elfsightEmbedCode = serializers.CharField(source='elfsight_embed_code', required=False, allow_blank=True)
    socialLinks = serializers.JSONField(source='social_links', required=False)

    class Meta:
        model = SiteSettings
        fields = [
            'id', 'siteName', 'elfsightWidgetId', 'elfsightEmbedCode', 'socialLinks',
        ]


class AdminLoginSerializer(serializers.Serializer):
    password = serializers.CharField()
