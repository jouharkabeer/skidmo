from django.contrib import admin
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

admin.site.register(GalleryImage)
admin.site.register(Offer)
admin.site.register(Testimonial)
admin.site.register(FAQ)
admin.site.register(CompanyInfo)
admin.site.register(HomeStats)
admin.site.register(HomeHero)
admin.site.register(SiteSettings)
