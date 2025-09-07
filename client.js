const axios = require("axios");

async function submitRideRequest(source, destination, user_id) {
  try {
    const response = await axios.post("http://localhost:3000/ride-request", {
      source,
      destination,
      user_id,
    });
    const sanitizedData = JSON.stringify(response.data).replace(/[\r\n\t]/g, ' ');
    console.log("Server Response:", sanitizedData);
  } catch (err) {
    const errorMsg = (err.response?.data?.message || err.message || "").replace(/[\r\n\t]/g, " ");
    console.error("Error:", errorMsg);
  }
}

// Example usage
submitRideRequest("Bangalore", "Mysore", 101);
