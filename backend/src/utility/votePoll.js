const db = require("./db");

const votePoll = async (pollSlotId) => {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE PollingSlot SET voteCount = voteCount + 1 WHERE pollSlotId = ?",
      [pollSlotId],
      function (err) {
        if (err) {
          return reject("Failed to update vote count: " + err.message);
        }

        // Check if the vote was successfully updated
        if (this.changes > 0) {
          resolve("Vote submitted successfully!");
        } else {
          reject("No matching polling slot found.");
        }
      }
    );
  });
};

module.exports = { votePoll };
