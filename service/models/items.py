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
Persistent Base class for database CRUD functions
"""

import logging
from .persistent_base import db, PersistentBase, DataValidationError

logger = logging.getLogger("flask.app")


######################################################################
#  I T E M S   M O D E L
######################################################################
class Items(db.Model, PersistentBase):
    """
    Class that represents an Address
    """

    # Table Schema
    __tablename__ = "items"

    id = db.Column(db.Integer, primary_key=True)  # id of each item
    wishlist_id = db.Column(
        db.Integer, db.ForeignKey("wishlist.id", ondelete="CASCADE"), nullable=False
    )
    name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    note = db.Column(db.String(1000), nullable=True)
    category = db.Column(db.String(100), nullable=False)

    def serialize(self):
        """
        Serializes an Item into a dictionary
        """
        return {
            "id": self.id,
            "name": self.name,
            "note": self.note,
            "category": self.category,
            "quantity": self.quantity,
            "wishlist_id": self.wishlist_id,
        }

    def deserialize(self, data):
        """
        Deserializes an Item from a dictionary
        """
        try:
            self.name = data["name"]
            self.quantity = data["quantity"]
            self.category = data["category"]
            self.note = data.get("note", "")

        except KeyError as error:
            raise DataValidationError(
                "Invalid Address: missing " + error.args[0]
            ) from error
        except TypeError as error:
            raise DataValidationError(
                "Invalid Address: body of request contained bad or no data "
                + str(error)
            ) from error

        return self
