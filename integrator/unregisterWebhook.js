const axios = require("axios");

const unregisterWebhook = async (eventType, url) => {
  try {
    await axios.post("http://localhost:3000/unregister", {
      event_type: eventType,
      url,
    });
    console.log("Webhook unregistered");
  } catch (error) {
    console.error("Failed to unregister webhook:", error.message);
  }
};

unregisterWebhook("hotel_booking", "http://localhost:3001/webhook");
