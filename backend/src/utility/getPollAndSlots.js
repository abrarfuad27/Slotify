/* Name: Samuel Lin */

const db = require('./db');

const getPollAndSlots = async (query) => {
  try{
    const { pollId } = query;
    if (!pollId) {
      throw new Error('Poll ID is required.');
    }

    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM Polling WHERE pollId = ?', [pollId], (err, poll) => {
        if (err) {
          reject('Database error while fetching poll: ' + err.message);
        } else if (!poll) {
          reject('Poll not found.');
        } else {
          db.all('SELECT * FROM PollingSlot WHERE pollId = ?', [poll.pollId], (err, slots) => {
            if (err) {
              reject('Database error while fetching slots: ' + err.message);
            } else {
              resolve({ ...poll, slots });
            }
          });
        }
      });
    });
  } catch(err){
    throw new Error('Could not get poll detail :' + err);
  }
  
};

module.exports = { getPollAndSlots };
