$(function () {

    // ****************************************
    //  U T I L I T Y   F U N C T I O N S
    // ****************************************

    // Updates the form with data from the response
    function update_wishlist_data(res) {
        $("#wishlist_id").val(res.id);
        $("#wishlist_name").val(res.name);
        $("#wishlist_note").val(res.note);

        if (res.is_favorite == true) {
            $("#wishlist_favorite").val("true");
        } else {
            $("#wishlist_favorite").val("false");
        }
        $("#wishlist_update").val(res.updated_time);
    }

    // Clears all form fields
    function clear_wishlist_data() {
        $("#wishlist_name").val("");
        $("#customer_name").val("");
        $("#wishlist_favorite").val("");
        $("#wishlist_note").val("");
        $("#wishlist_update").val("");
    }

    // Updates the form with data from the response
    function update_item_data(res) {
        $("#item_id").val(res.id);
        $("#item_name").val(res.name);
        $("#item_category").val(res.category);
        $("#item_quantity").val(res.quantity);
        $("#item_price").val(res.price);

        $("#item_note").val(res.note);

        if (res.is_favorite == true) {
            $("#item_favorite").val("true");
        } else {
            $("#item_favorite").val("false");
        }
        $("#item_update").val(res.updated_time);
    }

    // Clear all form fields
    function clear_item_data() {
        $("#item_name").val("");
        $("#customer_name").val("");
        $("#item_favorite").val("");
        $("#item_note").val("");
        $("#item_update").val("");
        $("#item_category").val("");
        $("#item_price").val("");
        $("#item_quantity").val("");
    }
    
    // Update the flash message area
    function flash_message(message) {
        $("#flash_message").empty();
        $("#flash_message").append(message);
    }


    // WISHLIST //

    // Retrieve a Wishlist
    $("#wishlist_retrieve_btn").click(function () {

        let wishlist_id = $("#wishlist_id").val();

        $("#flash_message").empty();

        let ajax = $.ajax({
            type: "GET",
            url: `/wishlists/${wishlist_id}`,
            contentType: "application/json",
            data: ''
        })

        ajax.done(function(res) {
            //alert(res.toSource())
            update_wishlist_data(res)
            flash_message("Success")
        });

        ajax.fail(function(res){
            clear_wishlist_data()
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
            update_wishlist_data(res)
            flash_message("Success: Create a Wishlist")
        });

        ajax.fail(function(res){
            clear_wishlist_data()
            flash_message(res.responseJSON.message)
        });

    });

    // Update the Wishlist
    $("#wishlist_update_btn").click(function () {
        let wishlist_id = $("#wishlist_id").val();
        let name = $("#wishlist_name").val();
        let note = $("#wishlist_note").val();
        let update = $("#wishlist_update").val(); 
        let is_favorite = $("#item_favorite").prop("checked");


        
        
        $("#flash_message").empty();
        
        if (!wishlist_id) {
            alert("Wishlist ID is required to update the resource.");
            return;
        }
        
        let ajax = $.ajax({
            type: "PUT",
            url: `/wishlists/${wishlist_id}`,
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
            update_wishlist_data(res)
            flash_message("Success: Update the Wishlist")
        });

        ajax.fail(function(res){
            clear_wishlist_data()
            flash_message(res.responseJSON.message)
        });

    });

    // Clear the wishlist interface
    $("#wishlist_clear_int_btn").click(function () {
        $("#wishlist_id").val("");
        $("#flash_message").empty();
        clear_form_data();
    });

    // Search for a WL*
    // ****************************************

    $("#wishlist_search_btn").click(function () {

        let name = $("#wishlist_name").val();
        let category = $("#pet_category").val();
        let available = $("#pet_available").val() == "true";

        $("#flash_message").empty();

        let ajax = $.ajax({
            type: "GET",
            url: `/wishlists`,
            contentType: "application/json",
            data: ''
        })

        ajax.done(function(res){
            //alert(res.toSource())
            $("#search_results").empty();
            let table = '<table class="table table-striped" cellpadding="10">'
            table += '<thead><tr>'
            table += '<th class="col-md-2">ID</th>'
            table += '<th class="col-md-2">Name</th>'
            table += '<th class="col-md-2">Note</th>'
            table += '<th class="col-md-2">Favorite?</th>'
            table += '<th class="col-md-2">Updated Time</th>'
            table += '</tr></thead><tbody>'
            let firstWL = "";
            
            for(let i = 0; i < res.length; i++) {
                let WL = res[i];
                table +=  `<tr id="row_${i}"><td>${WL.id}</td><td>${WL.name}</td><td>${WL.note}</td><td>${WL.is_favorite}</td><td>${WL.updated_time}</td><td>`;
                if (i == 0) {
                    firstWL = WL;
                }
            }
            table += '</tbody></table>';
            $("#search_results").append(table);
            //flash_message(str(firstWL))
            // copy the first result to the form
            if (firstWL != "") {
                update_wishlist_data(firstWL)
            }

            flash_message("Success")
        });

        ajax.fail(function(res){
            flash_message(res.responseJSON.message)
        });

    });

    // ITEM //

    // Create an Item
    $("#item_create_btn").click(function () {
        let name = $("#item_name").val();
        let category = $("#item_category").val();
        let quantity = $("#item_quantity").val();
        let price = $("#item_price").val();
        let update = $("#item_update").val(); 
        let note = $("#item_note").val();
        let is_favorite = $("#item_favorite").prop("checked");
        let wishlist_id = $("#desired_item_wishlist").val();
    
        $("#flash_message").empty();
        
        let ajax = $.ajax({
            type: "POST",
            url: `/wishlists/${wishlist_id}/items`,
            contentType: "application/json",
            data: JSON.stringify({
                name: name,
                category: category,
                quantity: quantity,
                price: price,
                note: note,
                updated_time: update,
                is_favorite: is_favorite
            })
        });

        ajax.done(function(res){
            //alert(res.toSource())
            update_item_data(res)
            flash_message("Success: Create an Item")
        });

        ajax.fail(function(res){
            clear_item_data()
            flash_message(res.responseJSON.message)
        });

    });

    // Update an Item
    $("#item_update_btn").click(function () {
        let item_id = $("#item_id").val();
        let name = $("#item_name").val();
        let category = $("#item_category").val();
        let quantity = $("#item_quantity").val();
        let price = $("#item_price").val();
        let update = $("#item_update").val();
        let note = $("#item_note").val();
        let is_favorite = $("#item_favorite").prop("checked");
        let wishlist_id = $("#desired_item_wishlist").val();
    
        $("#flash_message").empty();
        
        let ajax = $.ajax({
            type: "PUT",
            url: `/wishlists/${wishlist_id}/items/${item_id}`,
            contentType: "application/json",
            data: JSON.stringify({
                name: name,
                category: category,
                quantity: quantity,
                price: price,
                note: note,
                updated_time: update,
                is_favorite: is_favorite
            })
        });

        ajax.done(function(res){
            //alert(res.toSource())
            update_item_data(res)
            flash_message("Success: Update an Item")
        });

        ajax.fail(function(res){
            clear_item_data()
            flash_message(res.responseJSON.message)
        });

    });
    //list items
    $("#item_search_btn").click(function () {

        let I_name = $("#item_name").val();
        let wish_id = $("#desired_item_wishlist").val();
        //let available = $("#pet_available").val() == "true";

        let queryString = ""

        //if (I_name) {
        queryString += 'search=' + I_name
        flash_message(queryString)
        //}
        /*
        if (category) {
            if (queryString.length > 0) {
                queryString += '&category=' + category
            } else {
                queryString += 'category=' + category
            }
        }
        if (available) {
            if (queryString.length > 0) {
                queryString += '&available=' + available
            } else {
                queryString += 'available=' + available
            }
        }
        */
        $("#flash_message").empty();

        let ajax = $.ajax({
            type: "GET",
            //url: `/pets?${queryString}`,
            url: `/wishlists/${wish_id}/items/name?${queryString}`,
            contentType: "application/json",
            data: ''
        })

        ajax.done(function(res){
            //alert(res.toSource())
            $("#search_results_items").empty();
            let table = '<table class="table table-striped" cellpadding="10">'
            table += '<thead><tr>'
            table += '<th class="col-md-2">ID</th>'
            table += '<th class="col-md-2">Wishlist</th>'
            table += '<th class="col-md-2">Category</th>'
            table += '<th class="col-md-2">Favorite?</th>'
            table += '<th class="col-md-2">Name</th>'
            table += '<th class="col-md-2">Note</th>'
            table += '<th class="col-md-2">Quantity</th>'
            table += '<th class="col-md-2">Price</th>'
            table += '</tr></thead><tbody>'
            $("#wishlist_note").val(res.note);
            update_item_data(res)
            let firstItm = "";
            //for(let i = 0; i < res.length; i++)
            //let itm = res[i];
                
            table +=  `<tr id="row_${i}"><td>${res.id}</td><td>${res.wishlist_id}</td><td>${res.category}</td><td>${res.is_favorite}</td><td>${res.name}</td><td>${res.note}</td></tr>${res.quantity}</td><td>${res.price}</td></tr>`;

            table += '</tbody></table>';
            $("#search_results_items").append(table);

            // copy the first result to the form
            /*
            if (firstPet != "") {
                update_form_data(firstPet)
            }
            */
            flash_message("Success")
        });

        ajax.fail(function(res){
            flash_message(res.responseJSON.message)
        });

    });

     // Clear the items interface
     $("#item_clear_int_btn").click(function () {
        $("#item_id").val("");
        $("#flash_message").empty();
        clear_form_data();
    });
})
