$(function () {

    // ****************************************
    //  U T I L I T Y   F U N C T I O N S
    // ****************************************

    // Updates the form with data from the response
    function update_form_data(res) {
        $("#wishlist_id").val(res.id);
        $("#wishlist_name").val(res.name);
        $("#wishlist_category").val(res.items[0].category);

        $("#wishlist_note").val(res.note);

        if (res.is_favorite == true) {
            $("#wishlist_favorite").val("true");
        } else {
            $("#wishlist_favorite").val("false");
        }
        $("#wishlist_update").val(res.updated_time);
    }

    /// Clears all form fields
    function clear_form_data() {
        $("#wishlist_name").val("");
        $("#customer_name").val("");
        $("#wishlist_category").val("");
        $("#wishlist_favorite").val("");
        $("#wishlist_note").val("");
        $("#wishlist_update").val("");
    }

    // Updates the flash message area
    function flash_message(message) {
        $("#flash_message").empty();
        $("#flash_message").append(message);
    }

    $("#clear-btn").click(function () {
        $("#wishlist_id").val("");
        $("#flash_message").empty();
        clear_form_data()
    });

    // Retrieve a Wishlist
    $("#retrieve-btn").click(function () {

        let wishlist_id = $("#wishlist_id").val();

        $("#flash_message").empty();

        let ajax = $.ajax({
            type: "GET",
            url: `/wishlists/${wishlist_id}`,
            contentType: "application/json",
            data: ''
        })

        ajax.done(function(res){
            //alert(res.toSource())
            update_form_data(res)
            flash_message("Success")
        });

        ajax.fail(function(res){
            clear_form_data()
            flash_message(res.responseJSON.message)
        });

    });

    // Create a Wishlist
    $("#wishlist_create_btn").click(function () {
        let name = $("#wishlist_name").val();
        let note = $("#wishlist_note").val();
        let update = $("#wishlist_update").val(); 
        let is_favorite = $("#wishlist_favorite").prop("checked");
        
    
        $("#flash_message").empty();
    
        let ajax = $.ajax({
            type: "POST",
            url: "/wishlists",
            contentType: "application/json",
            data: JSON.stringify({
                name: name,
                note: note,
                updated_time: update,
                items: [],
                is_favorite: is_favorite
            })
        });

        ajax.done(function(res){
            //alert(res.toSource())
            update_form_data(res)
            flash_message("Success: Create a Wishlist")
        });

        ajax.fail(function(res){
            clear_form_data()
            flash_message(res.responseJSON.message)
        });

    });


    // Create an Item
    $("#item_create_btn").click(function () {
        let name = $("#item_name").val();
        let category = $("#item_category").val();
        let update = $("#item_update").val(); 
        let note = $("#item_note").val();
        let is_favorite = $("#item_favorite").prop("checked");
        let wishlist_name = $("#desired_item_wishlist").val();
    
        $("#flash_message").empty();
        
        if (!wishlist_name) {
            flash_message("Error: Wishlist name is required to add an item.");
            return;
        }
    
        $.ajax({
            type: "GET",
            url: `/wishlists?name=${encodeURIComponent(wishlist_name)}`, 
            contentType: "application/json"
        }).done(function (res) {
            if (res.length === 0) {
                flash_message("Error: Wishlist not found.");
                return;
            }

            let wishlist_id = res[0].id; 
            console.log("Wishlist ID:", wishlist_id); 
            $.ajax({
                type: "POST",
                url: `/wishlists/${wishlist_id}/items`, 
                contentType: "application/json",
                data: JSON.stringify({
                    name: name,
                    note: note,
                    updated_time: update,
                    items: [],
                    is_favorite: is_favorite
                })
            }).done(function (res) {
                update_form_data(res);
                flash_message("Success: Item created and added to the wishlist.");
            }).fail(function (res) {
                clear_form_data();
                console.error("Error 1")
                flash_message(`Error: ${res.responseJSON.message}`);
            });
        }).fail(function (res) {
            console.error("Error 2")
            flash_message(`Error: ${res.responseJSON.message}`);
        });

    });
})
