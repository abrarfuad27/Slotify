# Slotify
COMP 307 Final Project

## How to run the app:

### IF ON LOCAL:

* In **backend/src/constants.js**, change the following: 
    * backendPort: uncomment whichever port is available, and comment the other one.
    * frontendUrl: uncomment the *localhost* URL, and comment the `fall2024` one.
* In **frontend/src/constants.js**, change the following:
    * publicUrl: uncomment whichever port is available, and comment all other lines.
* CTRL-C the backend and frontend if it already was running.
* When running the backend, use the command `npm run dev` in the `Slotify/backend` directory.
* After running `npm start` in `Slotify/frontend`, the webapp will be running on your default localhost with the *frontendPort* in **frontend/src/constants.js** (most likely port 3000).

### IF ON SERVER (i.e. running from SOCS's MERN server)

* **Run McGill VPN if not on campus**
* Connect to SSH (e.g. on VSCode)
* In **backend/src/constants.js**, change the following:
    * backendPort: uncomment `backendPort 5000`, and comment the other one.
    * frontendUrl: uncomment the `fall2024` URL line, and comment the `localhost` one.
* In **frontend/src/constants.js**, change the following:
    * publicUrl: uncomment the `fall2024[...]/api` URL line, and comment all other lines.
* CTRL-C the backend and frontend if it already was running.
* When running the backend, use the command `npm run prod` in the `Slotify/backend` directory.
* After running `npm start` in `Slotify/frontend`, the webapp will be running on **https://fall2024-comp307-group06.cs.mcgill.ca**, not on your localhost.

N.B.: `npm start` on frontend should not be affected, but restart with CTRL-C just in case.
