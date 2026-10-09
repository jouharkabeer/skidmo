from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'gallery', views.GalleryViewSet, basename='gallery')
router.register(r'offers', views.OfferViewSet, basename='offers')
router.register(r'testimonials', views.TestimonialViewSet, basename='testimonials')
router.register(r'faqs', views.FAQViewSet, basename='faqs')

urlpatterns = [
    path('admin/login/', views.admin_login, name='admin-login'),
    path('admin/logout/', views.admin_logout, name='admin-logout'),
    path('contact', views.contact, name='contact'),
    path('contact/', views.contact, name='contact-slash'),
    path('company/', views.CompanyInfoView.as_view(), name='company-info'),
    path('home-stats/', views.HomeStatsView.as_view(), name='home-stats'),
    path('home-hero/', views.HomeHeroView.as_view(), name='home-hero'),
    path('site-settings/', views.SiteSettingsView.as_view(), name='site-settings'),
    path('', include(router.urls)),
]
