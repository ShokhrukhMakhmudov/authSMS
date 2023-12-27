const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const crypto = require("crypto");
const { supabase } = require("./supabase");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

function computeSHA256Hash(data) {
  const hash = crypto.createHash("sha256");
  hash.update(data);
  return hash.digest("hex");
}

const formData = {
  from: "Table Booker",
  callback_url: "http://0000.uz/test.php",
};

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

app.post("/signup", async (request, response) => {
  if (!request.body) return response.sendStatus(400);
  if (!request.body?.username && !request.body?.phone_number)
    return response.sendStatus(400);

  console.log(request.body);

  const { username, phone_number } = request.body;

  const { data, error } = await supabase
    .from("users")
    .insert({ username, phone_number })
    .select();

  if (!data) {
    response.json(error);
    return;
  }

  response.json(data);
});

app.post("/auth", (request, response) => {
  if (!request.body) return response.sendStatus(400);
  if (!request.body?.phone_number) return response.sendStatus(400);
  if (!request.body?.phone_number) return response.sendStatus(400);

  console.log(request.body);

  const code = String(Math.trunc(Math.random() * (99999 - 10000) + 10000));

  formData.mobile_phone = `${request.body.phone_number}`;
  formData.message = `${code} - Код для подтверждения в Table Booker`;

  sendSMS();

  response.json({
    hash: computeSHA256Hash(code),
    phone: request.body.phone,
    code,
  });
});

const api = "http://notify.eskiz.uz/api/message/sms/send";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDYxMTc0NTAsImlhdCI6MTcwMzUyNTQ1MCwicm9sZSI6InRlc3QiLCJzdWIiOiI1OTg1In0.C-3yul3PWMj0qLVZSWIWjZXD57U6TJYIO04V55FSsVg";

const headers = {
  "Content-Type": "application/x-www-form-urlencoded", // adjust the content type if needed
  Authorization: `Bearer ${token}`,
};

async function sendSMS() {
  axios
    .post(api, formData, { headers })
    .then((response) => {
      console.log("Response:", response.data);
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });

  console.log(1);
}

const port = process.env.PORT || 8081;

app.listen(port, () => {
  console.log("server is running");
});
