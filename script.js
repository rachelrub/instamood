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
  handleSentiment(response);
  //gets in here!

  //SHOW PICTURES
  var results = response.data;
  for (var i = 0; i<results.length; i++) {
    var res = results[i].images.standard_resolution.url; //link to the picture
    var theDiv = $("<div></div>");
    theDiv.attr("class", "pic-" + i);
    var image = $("<img>");
    image.attr("src", res);
    $(theDiv).append(image);
    if (results[i].caption === null) {
       $(theDiv).append("<div></div>");
    }
    else {
      var cap = results[i].caption.text;
      $(theDiv).append("<div>" + cap + "</div>");
    }
    $("#list").append(theDiv);
  

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
  var egopercent = egoCounter/(results.length);


  } //end of for loop
  
  $("#ego").append(egopercent + "%");
  // /Self Likes 
 // var selflikes=0;
 // for (var i=0; i<response.data.length; i++) {
 //   if (response.data[i].user_has_liked === true) {
 //     selflikes++;
 //   }
 // };
 // var selflikespercent = selflikes/response.data.length;
 // $("#stats").append("<div>" + "Ego Percentage: " + selflikespercent + "%" + "</div>");


// POPULARITY SCORE
// add all "object -> likes -> count"
// divide total count by total number of pictures to find the average


  var popularityCounter = 0;
  for (var i = 0; i < results.length; i++) {
    popularityCounter += results[i].likes.count
  }

  var popularityScore = popularityCounter/results.length;
  $("#pop").append(popularityScore);

// ACTIVE DAYS (most common day of the week to post a picture)
// run for loop through all the pictures to find the day it was posted
// add up the number of pictures posted on each day of the week
// append whichever day has the highest number of pictures posted
  var days = [0, 0, 0, 0, 0, 0, 0];
  var week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  for (var i = 0; i < results.length; i++) {
   var time = parseInt(results[i].created_time);
    var date = new Date(time * 1000);
    days[date.getDay()]++;
   }
  var mostActiveDay = week[(Math.max.apply(Math, days))];

// var date = new Date(results[0].created_time);
// var month = date.getDay();

// return month;

  $("#days").append(mostActiveDay);

//BREVITY (average caption length)
// run a for loop through the captions of each picture
// add up the number of characters in each picture
// divide the total number of characters by the total number of captions
// append the averge result


  var captionLength = 0;
  for (var i = 0; i < results.length; i++) {
      if (results[i].caption ==! null) {
        captionLength += results[i].caption.text.length;
      }
  }

  var avg = (captionLength/results.length);

  $("#brevity").append(avg);

// THIRST (average hastags per caption)
// for loop through all captions to search for a "#"
// add ++ to counter for every "#"
// divide total counter by total number of captions
// append the final result to thirst
  var thirst = 0;
  for (var i = 0; i < results.length; i++) {
    if (results[i].caption ==! null){
      thirst += results[i].caption.text.split("#").length - 1;
    }
  }
  $("#thirst").append(thirst);

} //end of handleResponse


  // add stuff here!


function handleSentiment (response) {
  $.each(response.data, function(i, val) {
    if (val.caption != null)
      var caption = val.caption.text; 
    else 
      var caption = "";
    // Make call to the sentiment API
    var sentURL = "https://twinword-sentiment-analysis.p.mashape.com/analyze/"
    $.ajax({
      method: "POST",
      url: sentURL,
      headers: { "X-Mashape-Key": "vRCyNb1GSDmshH1wdJ4YRG5QM8oVp10uWfwjsnzere3HiJYfCq" },
      data: { text : caption},
      success: function (response) {

        sentimentAnalysis(response, i);
      },
      error: function(response) {
        alert("there has been an error...");
      }
    });
    // var picURL = val.images.standard_resolution.url;
    // picURL = picURL.split("?");
    // var cUrl = "https://api.clarifai.com/v1/tag?url="+ picURL[0] + "&access_token=VmVOmxjG2GnCtk6IS0chKePkTJMuQN";
    
    // $.ajax({
    //   url: cUrl, // The URL you are requesting
    //   method: "GET",
    //   success: function (response) {
    //     handleTag(response, i) // A function that is run when the request is complete
    //   },
    //   error: function(error) {
    //     alert("there has been an error...");
    //   }
    // });
  });
}

function sentimentAnalysis(data, index) {
  console.log(data);
  var all_scores = [];
  var newScore = $("<div class=sent></div>").html("Sentiment Score: " + data.score);
  if (data.score > 0) 
    $(newScore).css("color", "green");
  else if (data.score < 0) 
    $(newScore).css("color", "red");
  console.log(newScore);
  $("#pic-" + index).append(newScore);
  all_scores.push(newScore);
  addSentiment(data.score);
}

function addSentiment(score) {
  // caption_count++;
  // var total_sentiment = 1;
  // total_sentiment = (total_sentiment * caption_count) + score;
  // total_sentiment /= caption_count;
  // console.log(total_sentiment);
  $("#sentiment").html(score);
  // if (total_sentiment > 0) $("#sentiment").css("color", "green");
  // else if (total_sentiment < 0) $("#sentiment").css("color", "red");
}

function handleTag(response, index) {
  var tags = $("<div class=tags></div>").html("Tags: ");
  for (var i=0; i<5; i++) {
    $(tags).append(response.results[0].result.tag.classes[i] + ", ");
  }
  $("#pic-" + index).append(tags);
}