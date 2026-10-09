from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'admin/vehicles', views.VehicleWarrantyViewSet, basename='vehicles')

urlpatterns = [
    path('warranty/<str:barcode>/', views.warranty_lookup, name='warranty-lookup'),
    path('', include(router.urls)),
]
