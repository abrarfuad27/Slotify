const db = require("./db");

const getPollAndSlots = async (query) => {
  const { url } = query;

  if (!url) {
    throw new Error("Poll URL is required.");
  }

  return new Promise((resolve, reject) => {
    // Fetch poll data
    db.get("SELECT * FROM Polling WHERE pollUrl = ?", [url], async (err, poll) => {
      if (err) {
        reject("Database error while fetching poll: " + err.message);
      } else if (!poll) {
        reject("Poll not found.");
      } else {
        // Fetch slots data for the poll
        db.all("SELECT * FROM PollingSlot WHERE pollId = ?", [poll.pollId], (err, slots) => {
          if (err) {
            reject("Database error while fetching slots: " + err.message);
          } else {
            resolve({ ...poll, slots });
          }
        });
      }
    });
  });
};

module.exports = { getPollAndSlots };
