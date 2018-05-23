"use strict";

const ObjectId = require("mongodb").ObjectId;

// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require("./util/simulate-delay");

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      simulateDelay(() => {
        //save a data to database
        db.collection("tweets").save(newTweet, (err, result) => {
          if (err) {
            return callback(err);
          };
          callback(null, true);
        });
      });
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
      simulateDelay(() => {
        //find the data from database and make that a array
        db.collection("tweets").find().toArray((err, tweets) => {
          if (err) {
            return callback(err);
          };
          const sortNewestFirst = (a, b) => a.created_at - b.created_at;
          callback(null, tweets.sort(sortNewestFirst));
        });
      });
    },

    updateTweet: function(updateTweet, data, callback) {
      simulateDelay(() => {
        updateTweet = {_id: ObjectId(updateTweet)};
        data={$set: data}
        db.collection("tweets").update(updateTweet, data, (err) => {
          if(err) {
            return callback(err);
          }
          callback(null);
        });
      });
    }
}};
