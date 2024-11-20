Feature: The wishlists service back-end
    As a Wishlists eCommerce Manager
    I need a RESTful catalog service
    So that I can keep track of all my customer's wishlists.

    Background:
        Given the following wishlists
            | customer_name |
            | James         |
            | Bob           |
        And the following items
            | customer_name | name  | note           | category | price | quantity | is_favorite |
            | James         | jeans | jeans clothing | clothing | 30.45 | 1        | False       |
            | James         | pant  | pant clothing  | clothing | 10.50 | 2        | True        |
            | Bob           | shirt | shirt clothing | clothing | 20.99 | 23       | False       |

    Scenario: Background test