$(document).ready(function() {
  //when key up, it count the words inside of textarea
  $(".new-tweet textarea").on("keyup", function() {
    const length = $(this).val().length;
    const counter = $(this).parent().children(".counter");
    //if the chars are over 140, the color changes to red
    if(length > 140) {
      counter.css("color", "red");
    } else {
      counter.css("color", "black");
    };
    counter.text(140-length);
  });
});