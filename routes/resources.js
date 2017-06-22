"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

router.get("/", (req, res) => {
  console.log('inside the resources route');
    knex
      .select("*")
      .from("resources")
      .then((results) => {
        res.json(results);
    });
  });

  return router;

// VIEW USER RESOURCES = GET /user/:id/fetch
// VIEW SPECIFIC RESOURCE = /GET /user/:id/fetch/:id
// ADD RESOURCE = POST /user/:id/fetch/:id
// DELETE RESOURCE = DELETE /user/:id/fetch/:id
// EDIT RESOURCE = POST /user/:id/fetch/:id

// RATE RESOURCE = POST /user/:id/fetch/:id/rate, DELETE /user/:id/fetch/:id/rate
// COMMENT ON RESOURCE = POST /user/:id/fetch/:id/comment, DELETE /user/:id/fetch/:id/comment

}