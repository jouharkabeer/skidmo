from django.db import models


class GalleryImage(models.Model):
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='gallery/')
    category = models.CharField(max_length=80, default='PPF')
    description = models.TextField(blank=True)
    alt_text = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Offer(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('draft', 'Draft'),
        ('expired', 'Expired'),
    ]
    title = models.CharField(max_length=200)
    description = models.TextField()
    banner_web = models.ImageField(upload_to='offers/')
    banner_mobile = models.ImageField(upload_to='offers/')
    start_date = models.DateField()
    expiry_date = models.DateField()
    button_text = models.CharField(max_length=80, default='Claim Offer')
    button_link = models.CharField(max_length=255, default='/contact#quote-form')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    priority = models.PositiveIntegerField(default=5)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-priority', 'expiry_date']

    def __str__(self):
        return self.title


class Testimonial(models.Model):
    name = models.CharField(max_length=120)
    role = models.CharField(max_length=160, blank=True)
    content = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5)
    avatar = models.ImageField(upload_to='testimonials/', blank=True, null=True)
    date = models.DateField(blank=True, null=True)
    source = models.CharField(max_length=40, default='Direct')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return self.name


class FAQ(models.Model):
    question = models.CharField(max_length=400)
    answer = models.TextField()
    category = models.CharField(max_length=80, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'FAQ'
        verbose_name_plural = 'FAQs'

    def __str__(self):
        return self.question[:80]


class CompanyInfo(models.Model):
    name = models.CharField(max_length=120, default='SKIDMO')
    tagline = models.CharField(max_length=255, blank=True)
    about = models.TextField(blank=True)
    mission = models.TextField(blank=True)
    vision = models.TextField(blank=True)
    values = models.JSONField(default=list, blank=True)
    workshop_images = models.JSONField(default=list, blank=True)

    class Meta:
        verbose_name = 'Company Info'
        verbose_name_plural = 'Company Info'

    def __str__(self):
        return self.name


class HomeStats(models.Model):
    stats = models.JSONField(default=list)

    class Meta:
        verbose_name = 'Homepage Stats'
        verbose_name_plural = 'Homepage Stats'

    def __str__(self):
        return 'Homepage Stats'


class HomeHero(models.Model):
    badge = models.CharField(max_length=120, blank=True)
    title_before = models.CharField(max_length=120, blank=True)
    title_accent = models.CharField(max_length=120, blank=True)
    title_after = models.CharField(max_length=120, blank=True)
    slides = models.JSONField(default=list, blank=True)

    class Meta:
        verbose_name = 'Homepage Hero'
        verbose_name_plural = 'Homepage Hero'

    def __str__(self):
        return 'Homepage Hero'


class SiteSettings(models.Model):
    site_name = models.CharField(max_length=120, default='SKIDMO')
    elfsight_widget_id = models.CharField(max_length=200, blank=True)
    elfsight_embed_code = models.TextField(blank=True)
    social_links = models.JSONField(default=dict, blank=True)

    class Meta:
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'

    def __str__(self):
        return self.site_name


class AdminSession(models.Model):
    token = models.CharField(max_length=64, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def __str__(self):
        return self.token[:12]
