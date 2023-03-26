const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

app.post("/endpoint", (req, res) => {
  const data = req.body;
  console.log(`Received event: ${data.event}, data: ${data.data}`);
  res.status(200).json({ success: true });
});

function registerEndpoint() {
  const url = "http://localhost:3000/webhooks";
  const events = ["hotel_booking", "booking_cancellation"];
  const endpoint = "http://localhost:3001/endpoint";

  events.forEach((event) => {
    axios.post(url, null, { params: { event, endpoint } });
  });
}

registerEndpoint();
app.listen(3001);
