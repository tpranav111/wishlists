######################################################################
# Copyright 2016, 2024 John J. Rofrano. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
######################################################################

"""
TestWishlist API Service Test Suite
"""

# pylint: disable=duplicate-code
import os
import logging
from unittest import TestCase
from wsgi import app
from service.common import status
from service.models import db, Wishlist
from .factories import WishlistFactory, ItemsFactory
from datetime import datetime

DATABASE_URI = os.getenv(
    "DATABASE_URI", "postgresql+psycopg://postgres:postgres@localhost:5432/testdb"
)
BASE_URL = "/wishlists"


######################################################################
#  T E S T   C A S E S
######################################################################
# pylint: disable=too-many-public-methods
class TestWishlistService(TestCase):
    """REST API Server Tests"""

    @classmethod
    def setUpClass(cls):
        """Run once before all tests"""
        app.config["TESTING"] = True
        app.config["DEBUG"] = False
        # Set up the test database
        app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URI
        app.logger.setLevel(logging.CRITICAL)
        app.app_context().push()

    @classmethod
    def tearDownClass(cls):
        """Run once after all tests"""
        db.session.close()

    def setUp(self):
        """Runs before each test"""
        self.client = app.test_client()
        db.session.query(Wishlist).delete()  # clean up the last tests
        db.session.commit()

    def tearDown(self):
        """This runs after each test"""
        db.session.remove()

    ######################################################################
    #  H E L P E R   M E T H O D S
    ######################################################################

    def _create_wishlists(self, count):
        """Factory method to create wishlists in bulk"""
        wishlists = []
        for _ in range(count):
            wishlist = WishlistFactory()
            resp = self.client.post(BASE_URL, json=wishlist.serialize())
            self.assertEqual(
                resp.status_code,
                status.HTTP_201_CREATED,
                "Could not create test Wishlist",
            )
            new_wishlist = resp.get_json()
            wishlist.id = new_wishlist["id"]
            wishlists.append(wishlist)
        return wishlists

    ######################################################################
    #  P L A C E   T E S T   C A S E S   H E R E
    ######################################################################

    def test_index(self):
        """It should call the home page"""
        resp = self.client.get("/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_create_wishlist(self):
        """It should Create a new Wishlist"""
        test_wishlist = WishlistFactory()
        logging.debug("Test Wishlist: %s", test_wishlist.serialize())
        response = self.client.post(BASE_URL, json=test_wishlist.serialize())
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Make sure location header is set
        location = response.headers.get("Location", None)
        self.assertIsNotNone(location)

        # Check the data is correct
        new_wishlist = response.get_json()
        updated_time_from_response = datetime.strptime(
            new_wishlist["updated_time"], "%a, %d %b %Y %H:%M:%S GMT"
        )

        # Note !
        test_wishlist.id = new_wishlist["id"]

        self.assertEqual(new_wishlist["id"], test_wishlist.id)
        self.assertEqual(new_wishlist["name"], test_wishlist.name)
        self.assertEqual(
            updated_time_from_response.replace(microsecond=0),
            test_wishlist.updated_time.replace(microsecond=0),
        )
        self.assertEqual(new_wishlist["note"], test_wishlist.note)
        # Todo: Uncomment this code when get_wishlists is implemented
        # Check that the location header was correct
        # response = self.client.get(location)
        # self.assertEqual(response.status_code, status.HTTP_200_OK)
        # new_wishlist = response.get_json()
        # self.assertEqual(new_wishlist["name"], test_wishlist.name)
        # self.assertEqual(new_wishlist["id"], test_wishlist.id)
        # self.assertEqual(new_wishlist["item_id"], test_wishlist.item_id)
        # self.assertEqual(new_wishlist["item_name"], test_wishlist.item_name)
        # self.assertEqual(new_wishlist["quantity"], test_wishlist.quantity)
        # self.assertEqual(new_wishlist["updated_time"], test_wishlist.updated_time)
        # self.assertEqual(new_wishlist["note"], test_wishlist.note)

    def test_create_items(self):
        """It should Add an item to an wishlist"""
        wishlist = self._create_wishlists(1)[0]
        item = ItemsFactory()
        resp = self.client.post(
            f"{BASE_URL}/{wishlist.id}/items",
            json=item.serialize(),
            content_type="application/json",
        )
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

        # Make sure location header is set
        location = resp.headers.get("Location", None)
        self.assertIsNotNone(location)

        data = resp.get_json()
        logging.debug(data)

        # The database assign data id automatically, since it is a primary key,
        # so the item response does not match
        item.id = data["id"]

        self.assertEqual(data["name"], item.name)
        self.assertEqual(data["id"], item.id)
        self.assertEqual(data["wishlist_id"], wishlist.id)
        self.assertEqual(data["quantity"], item.quantity)
        self.assertEqual(data["note"], item.note)

        # Check that the location header was correct by getting it
        resp = self.client.get(location, content_type="application/json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        new_item = resp.get_json()
        self.assertEqual(new_item["name"], item.name, "Address name does not match")

    def test_delete_items(self):
        """It should Delete an Items"""
        wishlist = self._create_wishlists(1)[0]
        item = ItemsFactory()
        response = self.client.post(
            f"{BASE_URL}/{wishlist.id}/items",
            json=item.serialize(),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        item_id = response.get_json()["id"]

        # delete the item and confirm the deletion
        delete_resp = self.client.delete(f"{BASE_URL}/{wishlist.id}/items/{item_id}")
        self.assertEqual(delete_resp.status_code, status.HTTP_204_NO_CONTENT)

        get_resp = self.client.get(f"{BASE_URL}/{wishlist.id}/items/{item_id}")
        self.assertEqual(get_resp.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_wishlist(self):
        """It should Update an existing Wishlist"""
        # create a wishlist to update
        test_wishlist = WishlistFactory()
        response = self.client.post(BASE_URL, json=test_wishlist.serialize())
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # update the wishlist
        new_wishlist = response.get_json()
        logging.debug(new_wishlist)
        new_wishlist["name"] = "Updated"
        new_wishlist_id = new_wishlist["id"]
        response = self.client.put(f"{BASE_URL}/{new_wishlist_id}", json=new_wishlist)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_wishlist = response.get_json()
        self.assertEqual(updated_wishlist["name"], "Updated")

    def test_delete_wishlist(self):
        """It should Delete a Wishlist"""
        test_wishlist = self._create_wishlists(1)[0]
        response = self.client.delete(f"{BASE_URL}/{test_wishlist.id}")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(len(response.data), 0)
        # make sure they are deleted
        response = self.client.get(f"{BASE_URL}/{test_wishlist.id}")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # READ a wishlist
    def test_get_wishlist(self):
        """It should Read a single wishlist"""
        # get the id of an wishlist
        wishlist = self._create_wishlists(1)[0]
        resp = self.client.get(
            f"{BASE_URL}/{wishlist.id}", content_type="application/json"
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        data = resp.get_json()
        self.assertEqual(data["name"], wishlist.name)

    def test_get_wishlist_not_found(self):
        """It should not Read an wishlist that is not found"""
        resp = self.client.get(f"{BASE_URL}/0")
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)
