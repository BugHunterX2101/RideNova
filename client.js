const axios = require("axios");

async function submitRideRequest(source, destination, user_id) {
  try {
    const response = await axios.post("http://localhost:3000/ride-request", {
      source,
      destination,
      user_id,
    });
    console.log("Server Response:", response.data);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

// Example usage
submitRideRequest("Bangalore", "Mysore", 101);
