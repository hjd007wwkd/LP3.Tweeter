"use strict";

const userHelper    = require("../lib/util/user-helper");

const express       = require('express');
const tweetsRoutes  = express.Router();
const cookieSession = require('cookie-session');

module.exports = function(DataHelpers) {

  tweetsRoutes.get("/", function(req, res) {
    const username = req.session.user_id;

    //getting data from database
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        //send the data back to ajax to use.
        res.send([tweets, username]);
      };
    });
  });

  tweetsRoutes.post("/", function(req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    };

    const username = req.session.user_id;
    const text = req.body.text;
    const name = req.session.name;

    //if there is userlogin, use login id and name
    const user = username ? userHelper.generateUser(name, username) : userHelper.generateRandomUser();
    const tweet = {
      user: user,
      content: {
        text: text
      },
      like: [],
      created_at: Date.now()
    };

    //insert into database
    DataHelpers.saveTweet(tweet, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        //when it success, send back with status code
        res.status(201).send();
      };
    });
  });

  //updata likes routes
  tweetsRoutes.post("/:id", function(req, res) {
    const updateId = req.params.id;
    const username = req.body.username;
    DataHelpers.updateTweet(updateId, username, (err, likes) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        //send back a likes list to count how many people in there
        res.status(201).send(likes);
      };
    });
  });

  //delete a post routes
  tweetsRoutes.post("/:id/delete", function(req, res) {
    const deleteId = req.params.id;
    DataHelpers.deleteTweet(deleteId, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
      };
    });
  });

  return tweetsRoutes;

};
