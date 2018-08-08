const https = require('https');

const host = 'secret-lake-26389.herokuapp.com';
const auth = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MzM2NTEwNzUsImV4cCI6MTUzNjI0MzA3NX0.t3kaYtlrIjatbu-pMLr1pEaluR2Az5Hk9sl0ceyOK3w';

async function businesses() {
  
    const opts = {
        protocol: "https:",
        host: host,
        path: '/businesses',
        headers: { Authorization: auth }
    };
    
    return new Promise((resolve, reject) => {
        https.get(opts, (resp) => {
            let data = '';
            
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });
            
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                data = JSON.parse(data);
                resolve(data.data);
            });
            
        }).on("error", (err) => {
            reject("Error: " + err.message);
        });
    });
}

function menuItems(business_id) {

}

function checks(business_id) {
    
}

function orderedItems(business_id) {

}

function employees(business_id) {

}

module.exports = {
    businesses,
    menuItems,
    checks,
    orderedItems,
    employees
};


