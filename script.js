var API_DOMAIN = "https://api.instagram.com/v1";
var RECENT_MEDIA_PATH = "/users/self/media/recent";
// what do you think a variable in all caps means?

$(document).ready(function() {
  var token = window.location.hash;
  if (!token) {
    window.location.replace("./login.html");
  }
  token = token.replace("#", "?"); // Prepare for query parameter
  var mediaUrl = API_DOMAIN + RECENT_MEDIA_PATH + token;

  $.ajax({
    method: "GET",
    url: mediaUrl,
    dataType: "jsonp",
    success: handleResponse,
    error: function() {
      alert("there has been an error...")
    }
  })
});

function handleResponse(response) {
  console.log("response:", response);
  var results = response.data;
  console.log("results", results);
  for (var i = 0; i<results.length; i++) {
    var res = results[i].images.standard_resolution.url; //link to the picture
    console.log("res", res);
    var image = $("<img>");
    image.attr("src", res);
    $("#list").append(image);
    // $("#list").append("<span></span");
    var cap = results[i].caption.text; //link to the picture
    console.log("cap", cap);
    var caption = $("<div></div>");
    $("#list").append("<div>" + cap + "</div>");
  } 

// EGO SCORE
// create coutner that increments by one 
// every time it sees a "true" for "user_has_liked" 
// in a for loop
// divide the final count by total number of pictures to get the percent
// append the percent to the "user stats" section

var egoCounter = 0;
if (results[i].user_has_liked === true) {
egoCounter ++;
}
var egopercent = egoCounter/results.length;
$("#list").append("<div>" + egopercent + "%" + "</div>");


// /Self Likes 
 var selflikes=0;
 for (var i=0; i<response.data.length; i++) {
   if (response.data[i].user_has_liked === true) {
     selflikes++;
   }
 };
 var selflikespercent = selflikes/response.data.length;
 $("#stats").append("<div>" + "Ego Percentage: " + selflikespercent + "%" + "</div>");
 

// POPULARITY SCORE
// add all "object -> likes -> count"
// divide total count by total number of pictures to find the average

// ACTIVE DAYS


  
  // add stuff here!
 }
