// Initialize Parse app
Parse.initialize('njJAclkNheZu7lDJTbvCqvqPX0n4KGdoTPEDT0R5', 'C88cKJ2Lms975Xx59oRTq5ULOtbrKhemDtFUrhCS');

// Create a new sub-class of the Parse.Object, with name "Multiverse"
var Multiverse = Parse.Object.extend('Multiverse');

// Click event when form is submitted
$('form').submit(function() {

    // Create a new instance of your Multiverse class 
    var plane = new Multiverse();

    // For each input element, set a property of your new instance equal to the input's value
    
    $(this).find('input').each(function(){
        plane.set($(this).attr('id'), $(this).val());
        $(this).val('');
    });

    $(this).find('textarea').each(function() {

        plane.set($(this).attr('id'), $(this).val());
        $(this).val('');
    });

    // After setting each property, save your new instance back to your database
    plane.save(null, {
        success:getData
    });
    return false;
})

// Write a function to get data
var getData = function() {

    // Set up a new query for our Music class
    var query = new Parse.Query(Multiverse)

    // Set a parameter for your query -- where the website property isn't missing
    query.notEqualTo('plane', '')

    /* Execute the query using ".find".  When successful:
        - Pass the returned data into your buildList function
    */
    query.find({
        success:function(results) {
            buildList(results)
        } 
    })
}

// A function to build your list
var buildList = function(data) {
    // Empty out your ordered list
    $('ol').empty()

    // Loop through your data, and pass each element to the addItem function
    data.forEach(function(d){
        addItem(d);
    })
}

// This function takes in an item, adds it to the screen
var addItem = function(item) {
    // Get parameters (color, plane, hotspot) from the data item passed to the function
    var color = item.get('color');
    var plane = item.get('plane');
    var hotspot = item.get('hotspot');
    var comment = item.get('comment');
    // Append li that includes text from the data item
    var li = $('<li>Check out ' + plane + '! Their most famous tourist attractions is ' + hotspot + '. Here is what people have said: ' + comment + '</li>')
    
    // Create a button with a <span> element (using bootstrap class to show the X)
    var button = $('<button class="btn-danger btn-xs"><span class="glyphicon glyphicon-remove"></span></button>')
    
    // Click function on the button to destroy the item, then re-call getData
    button.click(function() {
        item.destroy({
            success:getData
        })
    })

    // Append the button to the li, then the li to the ol
    li.append(button);
    $('ol').append(li)
    
}

// Call your getData function when the page loads
getData();
