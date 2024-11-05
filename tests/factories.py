"""
Test Factory to make fake objects for testing
"""

import random
from faker import Faker as FK
from factory import Factory, SubFactory, Sequence, Faker, LazyAttribute
from service.models import Wishlist, Items


test = FK()


class WishlistFactory(Factory):
    """Creates fake pets that you don't have to feed"""

    class Meta:  # pylint: disable=too-few-public-methods
        """Maps factory to data model"""

        model = Wishlist

    id = Sequence(lambda n: n)
    name = Faker("word")
    is_favorite = Faker("pybool")
    updated_time = LazyAttribute(
        lambda _: test.date_time_between(start_date="-5y", end_date="now")
    )
    note = Faker("sentence", nb_words=10)


class ItemsFactory(Factory):
    """Creates fake pets that you don't have to feed"""

    class Meta:  # pylint: disable=too-few-public-methods
        """Maps factory to data model"""

        model = Items

    id = Sequence(lambda n: n)
    name = Faker("word")
    quantity = LazyAttribute(lambda _: test.random_int(min=1, max=100))
    category = Faker("word")  # category
    note = Faker("sentence", nb_words=10)
    is_favorite = Faker("pybool")
    wishlist = SubFactory(WishlistFactory)
    price = LazyAttribute(lambda _: round(random.uniform(10.0, 100.0), 2))
