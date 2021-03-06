"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/", (request, response) => {
    knex
    .select("*")
    .from("resources")
    .orderBy('created_at', 'asc')
    .then((results) => {
      response.json(results);
    });
  });

//---------------------------------------------------------------- filtering index categories
  router.get("/:filter", (request, response) => {
    const categoryFilter = request.params.filter;
    knex
    .select("*")
    .from("resources")
    .where({category_id: categoryFilter})
    .then((results) => {
      response.json(results);
    });
  });

//---------------------------------------------------------------- filtering user categories
  router.get("/user/:filter", (request, response) => {
    const categoryFilter = request.params.filter;
    knex
    .select("*")
    .from("resources")
    .where({category_id: categoryFilter})
    .andWhere({user_id: request.session.userId})
    .then((results) => {
      response.json(results);
    });
  });

//---------------------------------------------------------------- filtering user likes
  router.get("/user/likes/:filter", (request, response) => {
    const likesFilter = request.params.filter;
    knex
    .select('*')
    .from('resources')
    .innerJoin('ratings', 'ratings.resource_id', 'resources.id')
    .where('ratings.user_id', request.session.userId)
    .andWhere('ratings.rating', 't')
    .orderBy('ratings.created_at', 'des')
    .then((results) => {
      console.log("USER FILTERRRRR!", results);
      response.json(results);
    });
  });

//---------------------------------------------------------------- add card
  router.post("/create", (request, response) => {
    const cardUrl = request.body.cardUrl;
    const cardTitle = request.body.cardTitle;
    const cardImage = request.body.cardImage;
    const cardDescription = request.body.cardDescription;
    const cardCategory = request.body.cardCategory;
    const cardUserId = request.session.userId;

    knex('resources')
      .insert({url: cardUrl, 
              image: cardImage, 
              title: cardTitle, 
              description: cardDescription,
              category_id: cardCategory,
              user_id: cardUserId})
      .then((results) => {
        response.json(results);
    });
  });

//---------------------------------------------------------------- update card
  router.post("/:resource_id", (request, response) => {
    const resource_id = request.params.resource_id;
    const cardUrl = request.body.cardUrl;
    const cardTitle = request.body.cardTitle;
    const cardImage = request.body.cardImage;
    const cardDescription = request.body.cardDescription;
    const cardCategory = request.body.cardCategory;
    const cardUserId = request.session.userId;

    knex('resources')
      .where({id: resource_id})
      .update({url: cardUrl, 
              image: cardImage, 
              title: cardTitle, 
              description: cardDescription,
              user_id: cardUserId,
              category_id: cardCategory})
      .then((results) => {
        response.json(results);
    });
  });

  // Adding to removing a rating ("like/heart/favourite") from a resource

  router.get("/:resource_id/rating", (request, response) => {
    const user = request.session.userId;
    const resource = request.params.resource_id;
      knex
      .select("rating")
      .from("ratings")
      .where({user_id: user})
      .andWhere({resource_id: resource})
      .then((results) => {
        response.json(results);
      });
  });

  function searchRating(resource_id, user_id){
    return knex('ratings')
      .where({
        resource_id,
        user_id
      })
      .limit(1)
      .select('*')
      .then(results => results.length)
  }

  function createRating(resource_id, user_id, rating){
    return knex('ratings')
      .insert({
        resource_id, user_id, rating
      });
  }
  
  function updateRating(resource_id, user_id, rating){
    return knex('ratings')
      .where({
        resource_id, user_id
      })
      .update({
        rating
      });
  }

  function createOrUpdateRating(resource, user, rating){
    return searchRating(resource, user)
      .then(rowCount => {
        if(rowCount === 0){
          return createRating(resource, user, rating);
        } else {
          return updateRating(resource, user, rating);
        }
      });
  }
  router.post("/:resource_id/inc", (request, response) => {
    const resource = request.params.resource_id;
    const user = request.session.userId;

    createOrUpdateRating(resource, user, 't')
      .then((results) => {
        console.log("success!");
        response.json(results);
      });
  });

  router.post("/:resource_id/dec", (request, response) => {
    const resource = request.params.resource_id;
    const user = request.session.userId;
    console.log(resource, user);

    createOrUpdateRating(resource, user, 'f')
      .then((results) => {
        console.log("success!");
        response.json(results);
      });
   });

  return router;

}