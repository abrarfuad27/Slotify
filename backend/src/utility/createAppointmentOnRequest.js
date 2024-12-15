//Salomon Lavy Perez
const db = require('./db');

/**
 * Creates an appointment in the database.
 * @param {Object} appointmentData - The appointment details.
 * @param {string} appointmentData.appointmentId - Unique ID for the appointment.
 * @param {string} appointmentData.mode - Mode of the appointment ('recurring' or 'one-time').
 * @param {string} appointmentData.creator - Email of the creator.
 * @param {string} appointmentData.startDate - Start date of the appointment.
 * @param {string} appointmentData.endDate - End date of the appointment.
 * @param {string} appointmentData.topic - Topic of the appointment.
 * @param {string} appointmentData.course - Related course (optional).
 * @param {string} appointmentData.appointmentURL - Unique URL for the appointment.
 * @returns {Promise<Object>} Resolves with success message or rejects with error.
 */
const createAppointmentOnRequest = async (appointmentData) => {
    const {
        appointmentId,
        mode,
        creator,
        startDate,
        endDate,
        topic,
        course,
        appointmentURL,
    } = appointmentData;
    console.log(appointmentData)

    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO Appointment (
                appointmentId, mode, creator, startDate, endDate, topic, course, appointmentURL
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [appointmentId, mode, creator, startDate, endDate, topic, course, appointmentURL],
            (err) => {
                if (err) {
                    reject("Database error: " + err.message);
                } else {
                    resolve({ message: "Appointment created successfully!" });
                }
            }
        );
    });
};

module.exports = { createAppointmentOnRequest };