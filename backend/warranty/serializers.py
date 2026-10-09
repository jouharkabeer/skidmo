from rest_framework import serializers
from .models import VehicleWarranty


class VehicleWarrantySerializer(serializers.ModelSerializer):
    barcode = serializers.CharField()
    vehicleNumber = serializers.CharField(source='vehicle_number')
    customerName = serializers.CharField(source='customer_name')
    phone = serializers.CharField()
    email = serializers.EmailField()
    serviceName = serializers.CharField(source='service_name', required=False, allow_blank=True)
    amountPaid = serializers.DecimalField(
        source='amount_paid', max_digits=12, decimal_places=2, required=False
    )
    serviceDoneDate = serializers.DateField(source='service_done_date')
    warrantyAvailable = serializers.BooleanField(source='warranty_available', required=False, default=True)
    warrantyExpiryDate = serializers.DateField(
        source='warranty_expiry_date', required=False, allow_null=True
    )
    isActive = serializers.BooleanField(source='is_active', read_only=True)
    notes = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = VehicleWarranty
        fields = [
            'id',
            'barcode',
            'vehicleNumber',
            'customerName',
            'phone',
            'email',
            'serviceName',
            'amountPaid',
            'serviceDoneDate',
            'warrantyAvailable',
            'warrantyExpiryDate',
            'isActive',
            'notes',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'isActive', 'created_at', 'updated_at']

    def validate(self, attrs):
        available = attrs.get(
            'warranty_available',
            getattr(self.instance, 'warranty_available', True),
        )
        expiry = attrs.get('warranty_expiry_date', getattr(self.instance, 'warranty_expiry_date', None))
        service_date = attrs.get(
            'service_done_date',
            getattr(self.instance, 'service_done_date', None),
        )
        if available and not expiry and service_date:
            from datetime import timedelta
            attrs['warranty_expiry_date'] = service_date + timedelta(days=365)
        if not available:
            attrs['warranty_expiry_date'] = None
        return attrs


class PublicWarrantySerializer(serializers.ModelSerializer):
    """Public barcode lookup — contact details masked."""
    barcode = serializers.CharField()
    vehicleNumber = serializers.CharField(source='vehicle_number')
    customerName = serializers.CharField(source='customer_name')
    phone = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    serviceName = serializers.CharField(source='service_name')
    amountPaid = serializers.DecimalField(source='amount_paid', max_digits=12, decimal_places=2)
    serviceDoneDate = serializers.DateField(source='service_done_date')
    warrantyAvailable = serializers.BooleanField(source='warranty_available')
    warrantyExpiryDate = serializers.DateField(source='warranty_expiry_date', allow_null=True)
    isActive = serializers.BooleanField(source='is_active', read_only=True)

    class Meta:
        model = VehicleWarranty
        fields = [
            'barcode',
            'vehicleNumber',
            'customerName',
            'phone',
            'email',
            'serviceName',
            'amountPaid',
            'serviceDoneDate',
            'warrantyAvailable',
            'warrantyExpiryDate',
            'isActive',
        ]

    def get_phone(self, obj):
        p = obj.phone or ''
        if len(p) <= 4:
            return p
        return f"{'*' * (len(p) - 4)}{p[-4:]}"

    def get_email(self, obj):
        email = obj.email or ''
        if '@' not in email:
            return email
        name, domain = email.split('@', 1)
        if len(name) <= 2:
            masked = '*' * len(name)
        else:
            masked = name[0] + '*' * (len(name) - 2) + name[-1]
        return f'{masked}@{domain}'
