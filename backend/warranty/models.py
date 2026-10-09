from django.db import models
from datetime import timedelta
from decimal import Decimal


class VehicleWarranty(models.Model):
    barcode = models.CharField(
        max_length=64,
        unique=True,
        db_index=True,
        help_text='Unique barcode provided to the customer',
    )
    vehicle_number = models.CharField(max_length=64)
    customer_name = models.CharField(max_length=160)
    phone = models.CharField(max_length=40)
    email = models.EmailField()
    service_name = models.CharField(max_length=160, blank=True, default='')
    amount_paid = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    service_done_date = models.DateField()
    warranty_available = models.BooleanField(default=True)
    warranty_expiry_date = models.DateField(blank=True, null=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-service_done_date', '-created_at']
        verbose_name = 'Vehicle Warranty'
        verbose_name_plural = 'Vehicle Warranties'

    def __str__(self):
        return f'{self.barcode} — {self.vehicle_number}'

    def save(self, *args, **kwargs):
        if self.warranty_available:
            if not self.warranty_expiry_date and self.service_done_date:
                self.warranty_expiry_date = self.service_done_date + timedelta(days=365)
        else:
            self.warranty_expiry_date = None
        super().save(*args, **kwargs)

    @property
    def is_active(self):
        from django.utils import timezone
        if not self.warranty_available or not self.warranty_expiry_date:
            return False
        return self.warranty_expiry_date >= timezone.localdate()
