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
CLI Command Extensions for Flask
"""

# pylint: disable=duplicate-code
import os
from unittest import TestCase
from unittest.mock import patch, MagicMock
from click.testing import CliRunner

# pylint: disable=unused-import
from wsgi import app  # noqa: F401
from service.common.cli_commands import (
    db_create,
    drop_tables_with_cascade,
)  # noqa: E402


class TestFlaskCLI(TestCase):
    """Flask CLI Command Tests"""

    def setUp(self):
        self.runner = CliRunner()

    @patch("service.common.cli_commands.db")
    def test_db_create(self, db_mock):
        """It should call the db-create command"""
        db_mock.return_value = MagicMock()
        with patch.dict(os.environ, {"FLASK_APP": "wsgi:app"}, clear=True):
            result = self.runner.invoke(db_create)
            self.assertEqual(result.exit_code, 0)

    @patch("service.common.cli_commands.db")
    def test_db_drop(self, db_mock):
        """It should call the db-drop command"""
        db_mock.session.execute = MagicMock()
        db_mock.session.commit = MagicMock()
        with patch.dict(os.environ, {"FLASK_APP": "wsgi:app"}, clear=True):
            result = self.runner.invoke(drop_tables_with_cascade)
            self.assertEqual(result.exit_code, 0)
