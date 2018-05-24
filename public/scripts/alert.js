function addOrRemoveClass(condition) {
  if(condition === "fail"){
    $(".alert").removeClass("success");
    $(".alert").addClass("fail");
  } else {
    $(".alert").removeClass("fail");
    $(".alert").addClass("success");
  }
};


export default function(text) {
  if(text === "0") {
    $(".alert").text("Your text cannot be over 140 characters!");
    addOrRemoveClass("fail");
  } else if (text === "1") {
    $(".alert").text("Type something!!");
    addOrRemoveClass("fail");
  } else if (text === "2") {
    $(".alert").text("You successfully update your message!!");
    addOrRemoveClass("success");
  } else if(text === "3") {
    $(".alert").text("Welcome to Tweeter!");
    addOrRemoveClass("success");
  } else if (text === "4") {
    $(".alert").text("Your username does not exist!");
    addOrRemoveClass("fail");
  } else if (text === "5") {
    $(".alert").text("Your password does not match!");
    addOrRemoveClass("fail");
  } else if (text === "6") {
    $(".alert").text("Username is currently existing!");
    addOrRemoveClass("fail");
  } else if (text === "7") {
    $(".alert").text("Successfully registered!!");
    addOrRemoveClass("success");
  } else if (text === "8") {
    $(".alert").text("Please come back!");
    addOrRemoveClass("success");
  } else if (text === "9") {
    $(".alert").text("You cannot like on your own post!");
    addOrRemoveClass("fail");
  } else if (text === "10") {
    $(".alert").text("You are not authorized to delete this post!");
    addOrRemoveClass("fail");
  } else if (text === "11") {
    $(".alert").text("You successfully deleted the post!");
    addOrRemoveClass("success");
  }
};

