# Avero Reporting API
An API built on top of a POS API for restaurant data that delivers the following reports:
* Employee gross sales (EGS)
* Labor Cost Percentage (LCP)
* Food Cost Percentage (FCP)
This API is built with **Node** using the **Express** library for the server and the **Mongoose** library to manage the **MongoDB** database that is hosted on mLab.

## File Structure

File      | Purpose
----------|-----------
*app.js*  | Connects to the remote database and runs the server
*reporting.js* | Quasi-controller that is responsible for handling requests and delegating reporting tasks
*schema.js* | Contains the **mongoose** schemas used to structure the MongoDB database.
*reports/LCP.js* | LCP reporting function
*reports/EGS.js* | EGS reporting function
*reports/FCP.js* | FCP reporting function
*reports/get.js* | http get methods for the POS API
*reports/find.js* | query methods for the local database
*reports/helper.js* | Helper functions for time manipulation

## Running
* Clone it: ```git clone https://github.com/malcolmsgroves/avero-reporting.git```
* Get in the repo: ```cd avero-reporting```
* Install node modules: ```npm i```
* Run it! ```node app```. The API is live at *localhost:3000/*

## Some fun requests
Report | URL
-------|--------
EGS    | localhost:3000/reporting?business_id=f21c2579-b95e-4a5b-aead-a3cf9d60d43b&report=EGS&timeInterval=hour&start=2018-07-28T14:00:00.000Z&end=2018-07-28T19:00:00.000Z
LCP    | localhost:3000/reporting?business_id=f21c2579-b95e-4a5b-aead-a3cf9d60d43b&report=LCP&timeInterval=hour&start=2018-07-28T14:00:00.000Z&end=2018-07-28T19:00:00.000Z
FCP    | localhost:3000/reporting?business_id=f21c2579-b95e-4a5b-aead-a3cf9d60d43b&report=FCP&timeInterval=hour&start=2018-07-28T14:00:00.000Z&end=2018-07-28T19:00:00.000Z

## Notes
* I waffled on the best database schema for the data. I went with a normalized structure (document references), but I think a case could be made for an embedded structure. However, I think document duplication would be necessary given the various report types.
* Related to the above point, this is *really* slow for large time intervals. A better database design might improve this?
* Some testing would be good, but this was a big undertaking without tests.
* There could be some code / file restructuring to make the data fetching from the POS API look cleaner.
