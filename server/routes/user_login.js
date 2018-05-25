const express       = require('express');
const userRoutes  = express.Router();
const bcrypt        = require('bcrypt');
const cookieSession = require('cookie-session');

module.exports = function(db) {
  userRoutes.post("/register", function(req, res){
    const password = req.body.password;
    const username = req.body.username;
    const name = req.body.name;

    if(password.length === 0 || username.length === 0 || name.length === 0) {
      //cannot be empty input
      return res.send("12")
    }

    const user = {
      username: username,
      password: bcrypt.hashSync(req.body.password, 10),
      name: name
    };

    //find if existing username on the database
    db.collection("users").findOne({username: username}, function(err, data){
      if(err){
        res.status(500).json({ error: err.message });
      } else {
        if(data != null){
          //the code for there is existing username
          res.send("6");
        } else {
          //if there isn't, save into the database
          db.collection("users").save(user, function(err){
            if(err){
              res.status(500).json({ error: err.message });
            } else {
              req.session.user_id = username;
              req.session.name = name;
              //code for successfully posted
              res.status(201).send(["7", username]);
            }
          })
        }
      }
    })
  })

  userRoutes.post("/login", function(req, res){
    const password = req.body.password;
    const username = req.body.username;

    if(password.length === 0 || username.length === 0) {
      //cannot be empty input
      return res.send("12")
    }

    db.collection("users").findOne({username: username}, function(err, data){
      if(err){
        res.status(500).json({ error: err.message });
      } else {
        if(data != null){
          if(username===data.username && bcrypt.compareSync(password, data.password)){
            req.session.user_id = username;
            req.session.name = data.name;
            //code for successfully login
            res.status(201).send(["3", username]);
          } else {
            //code for incorrect password
            res.send("5");
          }
        } else {
          //code for there is no matching username
          res.send("4");
        }
      }
    })
  })

  userRoutes.post("/logout", function(req, res){
    req.session.user_id = "";
    req.session.name = "";
    //code for successfully logout
    res.send("8");
  })

  return userRoutes;
}