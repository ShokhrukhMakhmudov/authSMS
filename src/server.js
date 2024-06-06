const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const crypto = require("crypto");
const { supabase } = require("./supabase");
const FormData = require("form-data");

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

// app.get("/get", async (req, res) => {
//   try {
//     res.json("work!");
//   } catch (e) {
//     return res.sendStatus(401);
//   }
// });

app.post("/registration", async (request, response) => {
  if (!request.body) return response.sendStatus(400);
  if (!request.body?.code && !request.body?.phone_number)
    return response.sendStatus(400);

  console.log(request.body);

  const { code, phone_number } = request.body;

  const { data, error } = await supabase
    .from("registration")
    .insert([{ phone_number, code }])
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

  console.log(request.body);

  const code = String(Math.trunc(Math.random() * (99999 - 10000) + 10000));

  sendSMS(request.body.phone_number, code);

  response.json({
    hash: computeSHA256Hash(code),
    phone: request.body.phone,
    code,
  });
});

const api = "http://notify.eskiz.uz/api/message/sms/send";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjAyNTkzMzgsImlhdCI6MTcxNzY2NzMzOCwicm9sZSI6InRlc3QiLCJzaWduIjoiMThmNTQ0ZTc2NjE4MjIyMmRjMGU0YzM1OTdhNjY0ZDM4YjE5MWFmNDEwYWExODliNjUyZDA4NTY4MDRlMDlkZiIsInN1YiI6IjU5ODUifQ.WGmM-hR8YeFgePDvugYhOnjsvupghjKIuRaBDofZs0M";

const headers = {
  "Content-Type": "application/x-www-form-urlencoded",
  Authorization: `Bearer ${token}`,
};

async function sendSMS(phoneNumber, verificationCode) {
  let formData = {
    mobile_phone: phoneNumber,
    message: `Bu Eskiz dan test`,
    from: "Ansor Mall",
    callback_url: "http://0000.uz/test.php",
  };
  // new FormData();
  // formData.append("mobile_phone", phoneNumber);
  // formData.append("message", `${verificationCode} - your code`);
  // formData.append("from", "Ansor Malll");
  // formData.append("callback_url", "http://0000.uz/test.php");

  axios
    .post(api, formData, { headers })
    .then((response) => {
      console.log("Response:", response.data);
    })
    .catch((error) => {
      console.log(phoneNumber, verificationCode);
      console.error("Error:", error);
    });
}

const port = process.env.PORT || 8081;

app.listen(port, () => {
  console.log("server is running: ", port);
});
