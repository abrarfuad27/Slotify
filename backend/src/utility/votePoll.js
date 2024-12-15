/* Name: Samuel Lin */

const db = require("./db");

const votePoll = async (pollSlotId) => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT isActive FROM Polling WHERE pollId = (SELECT pollId FROM PollingSlot WHERE pollSlotId = ?)",
      [pollSlotId],
      (err, row) => {
        if (err) {
          return reject("Failed to verify poll status: " + err.message);
        }
    
        if (!row) {
          return reject("No matching poll found.");
        }
    
        if (row.isActive === 0) {
          return reject("Poll is closed and no longer accepting votes.");
        }
    
        // If poll is active, proceed to update the vote count
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
      }
    );
  });
};

module.exports = { votePoll };
