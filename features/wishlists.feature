Feature: The wishlists service back-end
    As a Wishlists eCommerce Manager
    I need a RESTful catalog service
    So that I can keep track of all my customer's wishlists.

    Background:
        Given the following wishlists
            | name  | updated_time | note | is_favorite |
            | James | 2019-11-18   | wl1  | False       |
            | Eric  | 2020-11-28   | wl2  | True        |
            | Bob   | 2023-11-08   | wl3  | False       |
            | Tom   | 2024-01-28   | wl4  | False       |

    Scenario: The server is running
        When I visit the "Home Page"
        Then I should see "Wishlist RESTful Service" in the title
        And I should not see "404 Not Found"

    Scenario: Clear the form
        When I visit the "Home Page"
        And I set the "Name" to "Alice"
        And I set the "Note" to "wl5"
        And I select "True" in the "Favorite" dropdown
        And I set the "Update" to "2022-09-19"
        And I press the "Wishlist_Clear" button
        #Then I should see the message "Success"
        Then the "ID" field should be empty
        And the "Name" field should be empty
        And the "Note" field should be empty
        And the "Favorite" field should be empty
        And the "Update" field should be empty

    Scenario: Query a Wishlist by name
        When I visit the "Home Page"
        And I press the "Wishlist_Clear" button
        And I set the "Name" to "James"
        And I press the "Wishlist_Search" button
        Then I should see the message "Success"
        When I copy the "ID" field
        And I press the "Wishlist_Clear" button
        Then the "ID" field should be empty
        And the "Name" field should be empty
        And the "Note" field should be empty
        When I paste the "ID" field
        And I press the "Wishlist_Retrieve" button
        Then I should see the message "Success"
        And I should see "James" in the "Name" field
        And I should see "wl1" in the "Note" field
        And I should see "False" in the "Favorite" dropdown
        And I should see "2019-11-18" in the "Update" field

    Scenario: List all Wishlists
        When I visit the "Home Page"
        And I press the "Wishlist_Clear" button
        And I press the "Wishlist_Search" button
        Then I should see the message "Success"
        And I should see "wl1" in the results
        And I should see "wl2" in the results
        And I should see "wl3" in the results
        And I should see "wl4" in the results
        And I should not see "wl5" in the results

    Scenario: Search by Name
        When I visit the "Home Page"
        And I press the "Wishlist_Clear" button
        And I set the "Name" to "Eric"
        And I press the "Wishlist_Search" button
        Then I should see the message "Success"
        And I should see "wl2" in the results
        And I should not see "wl1" in the results
        
    Scenario: Create a Wishlist
        When I visit the "Home Page"
        And I press the "Wishlist_Clear" button
        And I set the "Name" to "Alice"
        And I set the "Note" to "wl5"
        And I select "True" in the "Favorite" dropdown
        And I set the "Update" to "2022-09-19"
        And I press the "Wishlist_Create" button
        Then I should see the message "Success"
        When I press the "Wishlist_Clear" button
        And I press the "Wishlist_Search" button
        Then I should see the message "Success"
        And I should see "Alice" in the results
        And I should see "wl5" in the results
        And I should see "true" in the results
        And I should see "2022-09-19" in the results

    Scenario: Update a Wishlist
        When I visit the "Home Page"
        And I press the "Wishlist_Clear" button
        And I set the "Name" to "James"
        And I press the "Wishlist_Search" button
        Then I should see the message "Success"
        And I should see "James" in the "Name" field
        And I should see "wl1" in the "Note" field
        And I should see "False" in the "Favorite" dropdown
        And I should see "2019-11-18" in the "Update" field
        When I change "Note" to "Updated Note"
        And I press the "Wishlist_Update" button
        Then I should see the message "Success"
        When I copy the "ID" field
        And I press the "Wishlist_Clear" button
        And I paste the "ID" field
        And I press the "Wishlist_Retrieve" button
        Then I should see the message "Success"
        And I should see "Updated Note" in the "Note" field
        When I press the "Wishlist_Clear" button
        And I press the "Wishlist_Search" button
        Then I should see the message "Success"
        And I should see "Updated Note" in the results
        And I should not see "wl1" in the results

    Scenario: Delete a Wishlist
        When I visit the "Home Page"
        And I press the "Wishlist_Clear" button
        And I set the "Name" to "James"
        And I press the "Wishlist_Search" button
        Then I should see the message "Success"
        And I should see "James" in the "Name" field
        And I should see "wl1" in the "Note" field
        And I should see "False" in the "Favorite" dropdown
        And I should see "2019-11-18" in the "Update" field
        When I copy the "ID" field
        And I press the "Wishlist_Delete" button
        #Then I should see the message "Success"
        When I paste the "ID" field
        And I press the "Wishlist_Retrieve" button
        Then I should see the message "404 Not Found"

