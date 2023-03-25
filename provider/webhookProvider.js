const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

app.use(express.json());

app.post("/register", (req, res) => {
  const eventType = req.body.event_type;
  const url = req.body.url;
  const webhookEntry = { event_type: eventType, url };

  fs.appendFileSync("webhooks.txt", JSON.stringify(webhookEntry) + "\n");
  res.status(201).send("Webhook registered");
});

app.post("/unregister", (req, res) => {
  const eventType = req.body.event_type;
  const url = req.body.url;
  let webhooks = fs
    .readFileSync("webhooks.txt", "utf-8")
    .split("\n")
    .filter(Boolean);
  webhooks = webhooks
    .map(JSON.parse)
    .filter(
      (webhook) => webhook.event_type !== eventType || webhook.url !== url
    );
  fs.writeFileSync(
    "webhooks.txt",
    webhooks.map(JSON.stringify).join("\n") + "\n"
  );
  res.status(200).send("Webhook unregistered");
});

app.post("/trigger/:event_type", (req, res) => {
  const eventType = req.params.event_type;
  const webhooks = fs
    .readFileSync("webhooks.txt", "utf-8")
    .split("\n")
    .filter(Boolean)
    .map(JSON.parse);
  const relevantWebhooks = webhooks.filter(
    (webhook) => webhook.event_type === eventType
  );

  relevantWebhooks.forEach((webhook) => {
    // Send the request to the webhook URL (use your favorite HTTP request library, e.g., axios or node-fetch)
  });

  res.status(200).send("Event triggered");
});

app.listen(port, () => {
  console.log(`Webhook provider listening at http://localhost:${port}`);
});
