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
    .update({ phone_number, status: true })
    .eq("id", code)
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

  const code = String(Math.trunc(Math.random() * (999999 - 100000) + 100000));

  sendSMS(request.body.phone_number, code);

  response.json({
    hash: computeSHA256Hash(code),
    phone: request.body.phone,
  });
});

const api = "http://notify.eskiz.uz/api/message/sms/send";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjEwMjgxODMsImlhdCI6MTcxODQzNjE4Mywicm9sZSI6InVzZXIiLCJzaWduIjoiYjlkNTY5NmZhYzU5ZjI3YmI4NWI1NzRhNWEwMTA4NGE0MGY2NzI3OWU3ZTU0ZWQxYjBmZTZlMDI5Zjg4MzQ4MyIsInN1YiI6Ijc1ODEifQ.u5Z2tQnnbJXqZCGWVog2b2tK89f9U4cP60Xqn3jad04";

const headers = {
  "Content-Type": "application/x-www-form-urlencoded",
  Authorization: `Bearer ${token}`,
};

async function sendSMS(phoneNumber, verificationCode) {
  let formData = {
    mobile_phone: phoneNumber,

    template: `Ansor Mall (ansormall.uz) konkurs dasturida ishtirok etish uchun tasdiqlash kodi: ${verificationCode}. Konkurs to'g'risida ma'lumot konkurs.ansormall.uz da.`,
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
