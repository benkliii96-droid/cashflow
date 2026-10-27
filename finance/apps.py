from django.apps import AppConfig


class FinanceConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'finance'

    def ready(self):
        from django.db.models.signals import post_migrate

        from .signals import seed_categories

        post_migrate.connect(seed_categories, sender=self)
