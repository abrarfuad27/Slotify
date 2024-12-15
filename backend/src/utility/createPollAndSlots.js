/* Name: Samuel Lin */
const db = require("./db");

const createPollAndSlots = async (userData, res) => {
  const { pollData, slots } = userData;
  const { pollId, pollName, pollQuestion, creator, isActive, pollUrl } = pollData;

  return new Promise((resolve, reject) => {
    try {
      db.run(
        `INSERT INTO Polling (pollId, pollName, pollQuestion, creator, isActive, pollUrl)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [pollId, pollName, pollQuestion, creator, isActive, pollUrl],
        function (err) {
          if (err) {
            return reject("Failed to insert poll data: " + err.message);
          }

          const insertPollingSlots = () => {
            slots.forEach(({ pollSlotId, startTime, endTime, pollingSlotDate }) => {
              db.run(
                `INSERT INTO PollingSlot (pollSlotId, pollId, voteCount, startTime, endTime, pollingSlotDate)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [pollSlotId, pollId, 0, startTime, endTime, pollingSlotDate],
                function (err) {
                  if (err) {
                    return reject("Failed to insert polling slot data: " + err.message);
                  }
                }
              );
            });
          };

          insertPollingSlots();
          resolve("Poll and slots created successfully!");
        }
      );
    } catch (error) {
      reject("Failed to create poll and polling slots: " + error.message);
    }
  });
};

module.exports = { createPollAndSlots };