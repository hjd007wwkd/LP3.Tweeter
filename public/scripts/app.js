/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

function time(mili){
  const time = new Date().getTime();
  const date = new Date(mili);
  return date.toString();
};

//take a array of data and render each
function renderTweets(tweets) {
  tweets.forEach(function(tweet) {
    const $tweet = createTweetElement(tweet);
    $('.tweets-container').prepend($tweet);
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
  const $time = $("<p>").addClass("time").text("10 days ago");
  let $NumLikes;
  if(tweet.like === "false") {
    $NumLikes = $("<p>").addClass("NumLikes").text("");
  } else {
    $NumLikes = $("<p>").addClass("NumLikes").text("1 likes");
  }

  const $like = $(`<img data-check=${tweet.like} src='/images/like.png'>`).addClass("like");
  const $retweet = $("<img src='/images/Retweet.png'>").addClass("retweet");
  const $flag = $("<img src='/images/flag.png'>").addClass("flag");

  $header.append($img).append($name).append($userHandle);
  $section.append($comment);
  $footer.append($time).append($like).append($retweet).append($flag).append($NumLikes);

  $article.append($header).append($section).append($footer);

  return $article;
};

//over 140 chars, empty and success alert when I input the textarea
function alertMessage(text, condition = null) {
  if(text === "fail" && condition === 140) {
    $(".alert").text("Your text cannot be over 140 characters!");
    $(".alert").removeClass("success");
    $(".alert").addClass("fail");
  } else if (text === "fail") {
    $(".alert").text("Type something!!");
    $(".alert").removeClass("success");
    $(".alert").addClass("fail");
  } else {
    $(".alert").text("You successfully update your message!!");
    $(".alert").removeClass("fail");
    $(".alert").addClass("success");
  };
};

$(document).ready(function(){
  //getting data from database
  function loadTweets () {
    $.get( "/tweets", function(data){
      renderTweets(data);
    });
  };

  $( "form" ).on( "submit", function(event) {
    //prevent refreshing browser
    event.preventDefault();

    //alert error or success message
    if($(".new-tweet textarea").val().length > 140){
      alertMessage("fail", 140);
    } else if ($(".new-tweet textarea").val().length === 0 || $(".new-tweet textarea").val() === null) {
      alertMessage("fail");
    } else {
      alertMessage("success");

      var text = $(this).serialize();

      //posting data from input
      $.post( "/tweets", text, function(){
        $(".new-tweet textarea").val("");
        $(".new-tweet .counter").text("140");
      })
      .done(function(data){
        //after posting data, get the data out to update site
        $.get( "/tweets", function(data){
          $addTweet = createTweetElement(data[data.length-1]);
          $('.tweets-container').prepend($addTweet);
        });
      });
    };
  });

  $(".tweets-container").on("click", ".like", function(event) {
    const id = $(event.target).parent().parent().data("id");
    const check = $(event.target).attr("data-check");
    $.ajax({
      url: "/tweets/"+id,
      type: "POST",
      data: {id: id, check: check}
    })
    .done(function(){
      if (check === "true") {
        $(event.target).attr("data-check", "false");
        $(event.target).parent().children(".NumLikes").text("");
      } else {
        $(event.target).attr("data-check", "true");
        $(event.target).parent().children(".NumLikes").text("1 likes");
      }
    })
    .fail(function(error) {
      console.log(error);
    })
  })

  //if show false, compose hidden. If show true, compose show
  let show = false;
  $(".compose").on("click", function() {
    $(".new-tweet").slideToggle( "slow", function(){
      if(show){
        $(".compose").removeClass("show");
      } else {
        $(".compose").addClass("show");
        $(".new-tweet textarea").focus();
      }
      show = !show;
    });
  });

  loadTweets();
})
