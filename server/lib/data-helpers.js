"use strict";

const ObjectId = require("mongodb").ObjectId;

// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require("./util/simulate-delay");

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      //save a data to database
      db.collection("tweets").save(newTweet, (err, result) => {
        if (err) {
          return callback(err);
        };
        callback(null, true);
      });
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
      //find the data from database and make that a array
      db.collection("tweets").find().toArray((err, tweets) => {
        if (err) {
          return callback(err);
        };
        const sortNewestFirst = (a, b) => a.created_at - b.created_at;
        callback(null, tweets.sort(sortNewestFirst));
      });
    },

    //update likes status
    updateTweet: function(updateId, username, callback) {
      //find the post element by id
      updateId = {_id: ObjectId(updateId)};

      db.collection("tweets").findOne(updateId, (err, data) => {
        if(err) {
          return callback(err);
        }
        //likes array that contains all the usernames
        let likes = data.like;
        if(likes.includes(username)){
          //if it has the username, treat as a unlike
          var index = likes.indexOf(username);
          likes.splice(index, 1);
        } else {
          //if it does not have it, the add the username
          likes.push(username);
        }

        //update database
        const newlikes={$set: {like: likes}};
        db.collection("tweets").update(updateId, newlikes, (err) => {
          if(err) {
            return callback(err);
          }
          callback(null, likes);
        });
      })
    },

    //delete a post by id
    deleteTweet: function(deleteId, callback){
      deleteId = {_id: ObjectId(deleteId)};
      db.collection("tweets").deleteOne(deleteId, (err) => {
        if(err) {
          return callback(err);
        }
        callback(null);
      })
    }
}};
