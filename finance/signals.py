DEFAULT_CATEGORIES = [
    ('Зарплата', 'income'),
    ('Фриланс', 'income'),
    ('Продукты', 'expense'),
    ('Транспорт', 'expense'),
    ('Жильё', 'expense'),
    ('Развлечения', 'expense'),
]


def seed_categories(sender, **kwargs):
    from .models import Category

    for name, kind in DEFAULT_CATEGORIES:
        Category.objects.get_or_create(name=name, kind=kind)
