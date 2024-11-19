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

    // Retrieve a Wishlist*
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
})
