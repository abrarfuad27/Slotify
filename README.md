# Slotify
COMP 307 Final Project

# How to run the app:

## IF ON LOCAL:

* On **backend/src/server.js,** uncomment the comment with the localhost with your correct port (whichever port is not used by your computer).
* When running the backend, use the command `npm run dev`
* The webapp will be running on your default localhost after `npm start`

## IF ON SERVER (i.e. running from SOCS's MERN server)

* **Run McGill VPN if not on campus**
* Connect to SSH (e.g. on VSCode)
* On **backend/src/serverprod.js,** uncomment the comment with https://fall2024-comp307-group06.cs.mcgill.ca/api if it hasn't been already.
* When running the backend, use the command `npm run prod`
* The webapp will be running on **https://fall2024-comp307-group06.cs.mcgill.ca**, not on "localhost:3000"

N.B.: `npm start` on frontend should not be affected
