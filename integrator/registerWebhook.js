const axios = require("axios");

const registerWebhook = async (eventType, url) => {
  try {
    await axios.post("http://localhost:3000/register", {
      event_type: eventType,
      url,
    });
    console.log("Webhook registered");
  } catch (error) {
    console.error("Failed to register webhook:", error.message);
  }
};

registerWebhook("hotel_booking", "http://localhost:3001/webhook");
