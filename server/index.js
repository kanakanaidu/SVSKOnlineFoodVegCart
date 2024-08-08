const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());

// Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Endpoint to send WhatsApp message
app.post("/send-whatsapp", (req, res) => {
  const { to, message, media } = req.body;
  if (media) {
    client.messages
      .create({
        from: "whatsapp:+14155238886", // Twilio Sandbox WhatsApp number
        to: `whatsapp:${to}`,
        body: message,
        mediaUrl: [`${media}`],
        // media: [`data:image/png;base64,${media}`]
      })
      .then((message) => {
        console.log(`Invoice sent successfully ${message.sid}`);
        res.status(200).send({ success: true, messageSid: message.sid });
      })
      .catch((error) =>
        res.status(500).send({ success: false, error: error.message })
      );
  } else {
    client.messages
      .create({
        from: "whatsapp:+14155238886", // Twilio Sandbox WhatsApp number
        to: `whatsapp:${to}`,
        body: message,
        // mediaUrl: [`${media}`]
        // media: [`data:image/png;base64,${media}`]
      })
      .then((message) => {
        console.log(`Message sent successfully ${message.sid}`);
        res.status(200).send({ success: true, messageSid: message.sid });
      })
      .catch((error) =>
        res.status(500).send({ success: false, error: error.message })
      );
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get("/", (req, res) => res.json("My Twillio API running 😎"));
