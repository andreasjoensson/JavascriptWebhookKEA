const express = require("express");
const app = express();
const port = 3001;

app.use(express.json());

app.post("/webhook", (req, res) => {
  console.log("Received event:", req.body);
  res.status(200).send("Event received");
});

app.listen(port, () => {
  console.log(`Integrator server listening at http://localhost:${port}`);
});
