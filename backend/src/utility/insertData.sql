-- member table
INSERT INTO Member (email, encryptedPassword, firstName, lastName)
VALUES ('student@mcgill.ca', 'password123', 'Student', 'McGill');

INSERT INTO Member (email, encryptedPassword, firstName, lastName)
VALUES ('prof@mcgill.ca', 'password456', 'Prof', 'McGill');

-- appointment table
INSERT INTO Appointment (appointmentId, mode, creator, startDate, endDate, topic, appointmentURL)
VALUES ('appoint001', 'one-time', 'student@mcgill.ca', '2024-12-05', '2024-12-05', 'Thesis Discussion', 'https://example.com/appoint001');

INSERT INTO Appointment (appointmentId, mode, creator, startDate, endDate, topic, appointmentURL)
VALUES ('appoint002', 'recurring', 'prof@mcgill.ca', '2024-12-01', '2024-12-15', 'Weekly Meeting', 'https://example.com/appoint002');

-- timeslot table
INSERT INTO Timeslot (timeslotID, appointmentId, startTime, endTime, timeslotDate, appointee, isRequest, requestStatus)
VALUES ('timeslot001', 'appoint001', '10:00', '10:30', '2024-12-05', 'student@mcgill.ca', 0, 'approved');

INSERT INTO Timeslot (timeslotID, appointmentId, startTime, endTime, timeslotDate, appointee, isRequest, requestStatus)
VALUES ('timeslot002', 'appoint001', '13:00', '13:30', '2024-12-05', 'student@mcgill.ca', 1, 'pending');

INSERT INTO Timeslot (timeslotID, appointmentId, startTime, endTime, timeslotDate, appointee, isRequest, requestStatus)
VALUES ('timeslot003', 'appoint001', '14:00', '14:30', '2024-12-05', 'student@mcgill.ca', 0, NULL);
