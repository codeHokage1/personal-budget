# Personal Budget API
The API allows maintaining of a personal budgeting application. It employs the [Envelope Budgeting](https://www.thebalancemoney.com/what-is-envelope-budgeting-1293682) to help applications and users to manage money properly.
It responds to all CRUD operations to be carried out on envelopes.

This API is a task in line with the completion of the [Codecademy](https://www.codecademy.com/) Backend Engineering track.

## Features & Endpoints:
- A dummy database of users and their info: **models/Envelopes.js**
- Routes to carry out tasks:
  ```
  // To get all envelopes
  GET /envelopes

  // To get and delete a specific envelope by id
  GET or DELETE /envelopes/:id

  // To update envelope details by id
  PUT /envelopes/:id
  {
    "name": "ChangedName",
    "amountSpent": 1500
  }
  N:B - all paramters in the body used to create an envelope are also eligible as params for the update. An additional paramter is the "amountSpent": used to update the amount spent and calculate the remaing balance in the envelope

  // Create a new envelope
  POST /envelopes
  {
    "name": "School Expenses",
    "description": "For fees, transportation and stationeries",
    "amount": 20000
  }

  // Transfer money from one envelope to another
  POST /envelopes/transfer?from=<envelopeId>&to=<envelopeId>
  {
    "transferAmount": 20000
  }
  ```
    

## How to use:
- Fork, clone or download the repo
- Open your terminal in the project folder, run the code below to install all the node modules used:
  ```
  npm install
  ```
- Start the server:
  ```
  npm start
  ```
- Download the *Thunder Client* VS Code extension, if you don't already have
- As an alternative to Thunder Client, you can use *Postman*, *Rest Client extension* or any other tech
- Create a new request and send accordingly with base url as: http://localhost:3000

## Tech/Tools Used:
- NodeJS and NPM
- ExpressJS
- Nodemon
- Git & GitHub
- Thunder Client