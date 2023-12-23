// import express from "express";
// import * as admin from "firebase-admin";
// import { initializeApp } from "firebase-admin/app";
// import credentials from "./key.json" assert { type: "json" };

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.get("/registration", async (req, res) => {
//   try {
//     auth
//       .listUsers(1000)
//       .then(function (listUsersResult) {
//         console.log(listUsersResult);
//         res.json(listUsersResult);
//       })
//       .catch(function (error) {
//         console.log("Error listing users:", error);
//       });
//   } catch (e) {
//     return res.sendStatus(401);
//   }
// });

app.get("/get", async (req, res) => {
  try {
    res.json("work!");
  } catch (e) {
    return res.sendStatus(401);
  }
});

app.post("/signup", (request, response) => {
  if (!request.body) return response.sendStatus(400);
  console.log(request.body);

  const code = Math.trunc(Math.random() * (99999 - 10000) + 10000);

  response.json(code);
});
const port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log("server is running");
});
