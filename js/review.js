// Initialize Parse app
Parse.initialize('njJAclkNheZu7lDJTbvCqvqPX0n4KGdoTPEDT0R5', 'C88cKJ2Lms975Xx59oRTq5ULOtbrKhemDtFUrhCS');

var totalRatingsCount = 0;

// Create a new sub-class of the Parse.Object, with name "Multiverse"
var Multiverse = Parse.Object.extend('Multiverse');

$('#star').raty({ 
    hints: ['"Pale Moon"', '"Shelkin Brownie"', '"Thoughtseize"', '"Jace the Mind-Sculptor"', '"Ancestral Recall"'],
    cancel: true,
    cancelOff: 'fa fa-fw fa-minus-square-o',
    cancelOn: 'fa fa-fw fa-minus-square',
    score: 0,
});

// Click event when form is submitted
$('form').submit(function() {

    // Create a new instance of your Multiverse class 
    var plane = new Multiverse();

    // For each input element, set a property of your new instance equal to the input's value
  
    plane.set('plane', $('#plane').val());
    plane.set('hotspot', $('#hotspot').val());
    plane.set('color', $('#color').val());
    plane.set('comment', $('#comment').val());

    plane.set('helpful', 0);
    
    plane.set('ratings', $('#star').raty('score'));
    
    $(this).find('input').each(function(){
        $(this).val('');
    })

    $(this).find('textarea').each(function() {
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

    // Calculating on average, how good a place the Multiverse is to live in
    var count = 0;
    var denom = data.length;
    for(var i = 0; i < denom; i++) {
        count += data[i].get('ratings');
    }
    count /= denom;
    $('#starAverage').raty({readOnly: true, score: count});

    // Loop through your data, and pass each element to the addItem function
    data.forEach(function(d){
        addItem(d, denom);
    })
}

// This function takes in an item, adds it to the screen
var addItem = function(item, parseSize) {
    // Get parameters (color, plane, hotspot) from the data item passed to the function
    var div = $('<div class= "well"></div>')
    var color = item.get('color');
    var plane = item.get('plane');
    var hotspot = item.get('hotspot');
    var comment = item.get('comment');
    var ratings = (ratings !== undefined) ? parseInt(item.get('ratings')) : 0;  
    var helpful = item.get('helpful');
    
    var commentProtect = $('<p id="commentSpace">').text(comment);

    // Append li that includes text from the data item
    var li = $('<div class="well">').html('<h3>Check out ' + '<b id="findPlane">' + '!</b></h3>' + '<p><h4>Their most famous tourist attractions is <em id= "findHotspot">' + 
        '</em>. </h4></p><h3> Here is what people have said: </h3>');
    var starRev = $('<div></div>');
    
    li.append(commentProtect);

    starRev.raty({readOnly: true, score: ratings});
    

    div.append(starRev);
    div.append(li);

    li.find('#findPlane').text(plane);
    li.find('#findHotspot').text(hotspot);
    li.find('#findComment').text(comment);



    // Creates buttons with a <span> element (using bootstrap class to show the X)
    var buttonClose = $('<button class="btn-danger btn-xs"><span class="glyphicon glyphicon-remove-sign"></span></button>');
    var buttonUp = $('<div></div><button class="btn-primary btn-xs"> <span class="glyphicon glyphicon-thumbs-up"></span></button>');
    var buttonDown = $('<button id="thumbdn" class="btn-primary btn-xs"><span class="glyphicon glyphicon-thumbs-down"></span></button>');
    var othrLi = $('<p>' + helpful + ' out of ' + parseSize+ ' found this review helpful</p>')

    // Click function on the button to destroy the item, then re-call getData
    buttonClose.click(function() {
        item.destroy({
            success:getData
        })
    })

   buttonUp.click(function() {
        item.increment('helpful');
        item.save();        
        getData();
    })

    buttonDown.click(function() {
        (parseInt(item.get('helpful')) > 0) ? item.increment('helpful', -1) : alert("Can't be negative!");
        item.save();
        getData();
    }) 

    // Append the button to the li, then the li to the ol
    li.append(buttonClose);
    li.append(buttonUp);
    li.append(buttonDown);
    li.append(othrLi);
    $('ol').append(li);
}

// Call your getData function when the page loads
getData();