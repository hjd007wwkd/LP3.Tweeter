import alertMessage from "./alert.js";

let loginPage = false;
let registerPage = false;
//login and register toggle page
function LRPage() {
  //login fadetoggle.
  $(".login_btn").on("click", function(){
    if(loginPage) {
      $(".login_page").fadeOut();
      $(".overlay").css("display", "none");
      $(".login_btn").removeClass("clickEffect");
    } else {
      registerPage = false;
      $(".register_btn").removeClass("clickEffect");
      $(".overlay").css("display", "inline");
      $(".register_page").css("display", "none");
      $(".login_page").fadeIn();
      $(".login_btn").addClass("clickEffect");
    }
    loginPage = !loginPage;
  })

  //register fade toggle
  $(".register_btn").on("click", function(){
    if(registerPage) {
      $(".register_page").fadeOut();
      $(".overlay").css("display", "none");
      $(".register_btn").removeClass("clickEffect");
    } else {
      loginPage = false;
      $(".login_btn").removeClass("clickEffect");
      $(".overlay").css("display", "inline");
      $(".login_page").css("display", "none");
      $(".register_page").fadeIn();
      $(".register_btn").addClass("clickEffect");
    }
    registerPage = !registerPage;
  })
}

//when successfully login or register, fadeout and delete all the text from box
function backToNormal(text) {
  if(text === "login") {
    $(".login_page").fadeOut();
    $(".overlay").css("display", "none");
    $(".login_form .username, .login_form .password").val('');
    $(".login_btn").removeClass("clickEffect");
    loginPage = false;
  } else {
    $(".register_page").fadeOut();
    $(".overlay").css("display", "none");
    $(".register_form .username, .register_form .password, .register_form .name_tweet").val('');
    $(".register_btn").removeClass("clickEffect");
    registerPage = false;
  }
}

//when user login, username shows, hide login and register button
//compose, logout show up,
//user can see like and trash button on each post now
function login(username){
  $(".user_id").text(username);
  $(".compose, .logout_btn, .user_id").css("display", "inline");
  $(".login_btn, .register_btn").css("display", "none");
  $(".like, .trash").addClass("showIcons");
}

//when user logout, show login and register button
//username, compose, logout hidden,
//user cannot see like and trash button on each post
function logout(){
  $(".username").text("");
  $(".compose, .logout_btn, .user_id").css("display", "none");
  $(".login_btn, .register_btn").css("display", "inline");
  $(".like, .trash").removeClass("showIcons");
}

$(document).ready(function(){
  LRPage();

  //register form submission
  $( ".register_form" ).submit(function(event) {
    event.preventDefault();

    const data = $(this).serialize();

    $.post("/register", data)
    .success(function(data){
      //show each message on different situation
      alertMessage(data[0]);
      //let user login right away
      if(data[0] === "7"){
        backToNormal("register");
        login(data[1]);
      }
    })
    .fail(function(error) {
      console.log(error);
    });
  });

  //login form submission
  $( ".login_form" ).submit(function(event) {
    event.preventDefault();

    const data = $(this).serialize();

    $.post("/login", data)
    .success(function(data){
      //show each message on different situation
      alertMessage(data[0]);
      //user now login
      if(data[0] === "3"){
        backToNormal("login");
        login(data[1]);
      }
    })
    .fail(function(error) {
      console.log(error);
    });
  })

  //logout
  $( ".logout_btn" ).on("click", function(){
    $.post("/logout")
    .success(function(data){
      //successfully log out message
      alertMessage(data);
      logout();
    })
    .fail(function(error) {
      console.log(error);
    });
  })
})