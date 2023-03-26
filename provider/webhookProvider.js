const express = require("express");
const fs = require("fs");
const axios = require("axios");
const app = express();
app.use(express.json());

const webhooksFile = "webhooks.json";

function readWebhooks() {
  if (!fs.existsSync(webhooksFile)) {
    return {};
  }
  const data = fs.readFileSync(webhooksFile, "utf-8");
  return JSON.parse(data);
}

function writeWebhooks(webhooks) {
  fs.writeFileSync(webhooksFile, JSON.stringify(webhooks));
}

function initWebhooks() {
  if (!fs.existsSync(webhooksFile)) {
    writeWebhooks({});
  }
}

app.post("/webhooks", (req, res) => {
  const eventType = req.query.event;
  const endpoint = req.query.endpoint;

  const webhooks = readWebhooks();
  if (!webhooks[eventType]) {
    webhooks[eventType] = [];
  }
  webhooks[eventType].push(endpoint);
  writeWebhooks(webhooks);

  axios.post(endpoint, { event: "ping" });
  res.status(201).json({ success: true });
});

app.delete("/webhooks", (req, res) => {
  const eventType = req.query.event;
  const endpoint = req.query.endpoint;

  const webhooks = readWebhooks();
  if (webhooks[eventType] && webhooks[eventType].includes(endpoint)) {
    webhooks[eventType] = webhooks[eventType].filter((e) => e !== endpoint);
    writeWebhooks(webhooks);
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ success: false, message: "Invalid request" });
  }
});

function triggerEvent(eventType, payload) {
  const webhooks = readWebhooks();
  if (webhooks[eventType]) {
    webhooks[eventType].forEach((endpoint) => {
      axios.post(endpoint, payload);
    });
  }
}

function randomTrigger() {
  setInterval(() => {
    const event =
      Math.random() < 0.5 ? "hotel_booking" : "booking_cancellation";
    const payload = { event, data: "Dummy data" };
    triggerEvent(event, payload);
  }, Math.random() * 20000 + 10000);
}

initWebhooks();
randomTrigger();
app.listen(3000);
