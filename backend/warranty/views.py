from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from cms.permissions import IsAdminAuthenticated
from .models import VehicleWarranty
from .serializers import VehicleWarrantySerializer, PublicWarrantySerializer


class VehicleWarrantyViewSet(viewsets.ModelViewSet):
    """Admin CRUD for vehicle warranties after service."""
    queryset = VehicleWarranty.objects.all()
    serializer_class = VehicleWarrantySerializer
    permission_classes = [IsAdminAuthenticated]
    lookup_field = 'pk'


@api_view(['GET'])
@permission_classes([AllowAny])
def warranty_lookup(request, barcode: str):
    """Public warranty check — enter or scan barcode, no login."""
    code = (barcode or '').strip()
    if not code:
        return Response({'error': 'Barcode is required.'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        record = VehicleWarranty.objects.get(barcode__iexact=code)
    except VehicleWarranty.DoesNotExist:
        return Response(
            {'error': 'No warranty found for this barcode.'},
            status=status.HTTP_404_NOT_FOUND,
        )
    return Response(PublicWarrantySerializer(record).data)
