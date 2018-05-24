/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

//import custom alert function
import alertMessage from "./alert.js";

//convert milisecond to data
function postDate(mili){
  const myDate = new Date(mili);
  return (myDate.getMonth()+1) + "/" + myDate.getDate() + '/' +  myDate.getFullYear() + " - " + myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds();
}

//take a array of data and render each
function renderTweets(tweets) {
  tweets.forEach(function(tweet) {
    const $tweet = createTweetElement(tweet);
    $('.tweets_container').prepend($tweet);
  });
};

//formatting to HTML with single data
function createTweetElement (tweet) {
  const $article = $(`<article data-id=${tweet._id}>`).addClass('tweet');

  const $header = $('<header>');
  const $img = $(`<img src="${tweet.user.avatars.small}">`).addClass("avatar");
  const $name = $("<span>").addClass("name").text(tweet.user.name);
  const $userHandle = $("<span>").addClass("user_handle").text(tweet.user.handle);

  const $section = $("<section>").addClass("comment");
  const $comment = $("<p>").text(tweet.content.text);

  const $footer = $("<footer>");
  const postTime = postDate(tweet.created_at);
  const $time = $("<p>").addClass("time").text(postTime);
  let $numLikes;
  if(tweet.like.length === 0) {
    $numLikes = $("<p>").addClass("num_likes").text("");
  } else {
    $numLikes = $("<p>").addClass("num_likes").text(tweet.like.length+" likes");
  }

  const $like = $(`<img src='/images/like.png'>`).addClass("like");
  const $trash = $("<img src='/images/trash_can.png'>").addClass("trash");

  $header.append($img).append($name).append($userHandle);
  $section.append($comment);
  $footer.append($time).append($trash).append($like).append($numLikes);

  $article.append($header).append($section).append($footer);
  return $article;
};

//effect for showing page of compose
let clickEffect = false;
function showCompose() {
  $(".compose").on("click", function() {
    $(".new_tweet").slideToggle( "slow", function(){
      if(clickEffect){
        $(".compose").removeClass("clickEffect");
      } else {
        $(".compose").addClass("clickEffect");
        $(".new_tweet textarea").focus();
      }
      clickEffect = !clickEffect;
    });
  });
}


//getting data from database
function loadTweets () {
  $.get( "/tweets", function(data){
    renderTweets(data[0]);
    if(data[1]){
      $(".user_id").text(data[1]);
      $(".compose, .logout_btn, .user_id").css("display", "inline")
      $(".login_btn, .register_btn").css("display", "none");
      $(".like, .trash").addClass("showIcons");
    }
  })
  .fail(function(error) {
    console.log(error);
  });
};

$(document).ready(function(){

  //compose submit
  $( ".new_tweet_form" ).on( "submit", function(event) {
    //prevent refreshing browser
    event.preventDefault();

    //alert error or success message
    if($(".new_tweet textarea").val().length > 140){
      //when text over 140
      alertMessage("0");
    } else if ($(".new_tweet textarea").val().length === 0 || $(".new_tweet textarea").val() === null) {
      //when text is empty
      alertMessage("1");
    } else {
      const text = $(this).serialize()

      //posting data from input
      $.post( "/tweets", text)
      .fail(function(error) {
        console.log(error);
      })
      .done(function(data){
        //change textarea empty, counter back to 140, and successful message
        $(".new_tweet textarea").val("");
        $(".new_tweet .counter").text("140");
        $(".new_tweet").slideToggle("slow")
        $(".compose").removeClass("clickEffect");
        clickEffect = false;
        alertMessage("2");

        //after posting data, get the data out to update site
        $.get( "/tweets", function(data){
          const $addTweet = createTweetElement(data[0][data[0].length-1]);
          $('.tweets_container').prepend($addTweet);
          $(".like, .trash").addClass("showIcons");
        });
      });
    };
  });

  //when click like button
  $(".tweets_container").on("click", ".like", function(event) {
    //get the id to find proper post
    const id = $(event.target).parent().parent().attr("data-id");
    const user_handle = $(event.target).parent().parent().children().children(".user_handle").text().slice(1);
    const username = $("nav .user_id").text()
    //check if the owner of the post, owner cannot like their own post
    if(user_handle === username) {
      alertMessage("9");
    } else {
      //update the like status
      $.post("/tweets/"+id, {username: username})
      .done(function(data){
        //if empty like array, does not show anything to client
        const numberLikes = $(event.target).parent().children(".num_likes")
        if(data.length === 0) {
          numberLikes.text("");
        //if there is, show clients how many likes each have
        } else {
          numberLikes.text(data.length+" likes");
        }
      })
      .fail(function(error) {
        console.log(error);
      })
    }
  })

  //delete post when you click trash icon
  $(".tweets_container").on("click", ".trash", function(event) {
    const id = $(event.target).parent().parent().attr("data-id");
    const user_handle = $(event.target).parent().parent().children().children(".user_handle").text().slice(1);
    const username = $("nav .user_id").text()
    //check if user is ownere
    if(user_handle !== username) {
      alertMessage("10");
    } else {
      $.post("/tweets/"+id+"/delete")
      .done(function(data){
        //successfully deleted message
        alertMessage("11");
        //remove html element from html
        $(event.target).parent().parent().remove();
      })
      .fail(function(error) {
        console.log(error);
      })
    }
  })

  showCompose();
  loadTweets();
})
