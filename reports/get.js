const https = require('https');
const Schema = require('./../schema.js');
const Business = Schema.Business;
const MenuItem = Schema.MenuItem;
const Check = Schema.Check;
const Employee = Schema.Employee;
const LaborEntry = Schema.LaborEntry;
const OrderedItem = Schema.OrderedItem;
const Query = Schema.Query;

// These should be environmental variables, but I kept them here
// to make it easier to run the repo locally
const host = 'secret-lake-26389.herokuapp.com';
const auth = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MzM2NTEwNzUsImV4cCI6MTUzNjI0MzA3NX0.t3kaYtlrIjatbu-pMLr1pEaluR2Az5Hk9sl0ceyOK3w';

const opts = {
    host: host,
    headers: { Authorization: auth }
};

// Check the Query collection to see if a GET request
// has already been made to the POS API for a given
// model and business_id
async function alreadyFetched(model, business_id) {
    return new Promise((resolve, reject) => {
        Query.find({
            model: model,
            business_id: business_id
            }, function(err, data) {
                if(data.length > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
    });
}

// Fetch data from the POS API. This is done recursively
// so that all the data is taken from a given request (increments
// offset). 
async function fetch(options, offset) {
    let opts = Object.assign({}, options);
    opts.path = `${opts.path}&offset=${offset}`;
    console.log(opts.path);
    return new Promise((resolve, reject) => {
        https.get(opts, (resp) => {
            let data = '';
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });
            
            // The whole response has been received. Return the result
            resp.on('end', async () => {
                data = JSON.parse(data);
                let entries = data.data;
                if(data.count > offset + 500) {
                    // if we are not at the end of the data,
                    // increment offset and make another request
                    const next = await fetch(options, offset + 500);
                    entries = entries.concat(next);
                }
                resolve(entries);
            });
            
        }).on("error", (err) => {
            reject("Error: " + err.message);
        });
    });
}

// These functions use the fetch function to GET
// from different POS API routes and store the data
// locally


async function businesses() {
    if(!(await alreadyFetched("Business", null))) {
        const options = Object.assign(opts, {
            path: '/businesses?limit=500'
        });
        
        const data = await fetch(options, 0);
        await Business.insertMany(data);
        await Query.create({ model: "Business" });         
    }
}

async function menuItems(business_id) {
    if(!(await alreadyFetched("MenuItem", business_id))) {
        const menuPath = `/menuItems?limit=500&business_id=${business_id}`;
        const options = Object.assign(opts, {
            path: menuPath
        });
        
        const data = await fetch(options, 0);
        await MenuItem.insertMany(data);
        await Query.create({ model: "MenuItem", business_id: business_id });
    }
}

async function checks(business_id) {
    if(!(await alreadyFetched("Check", business_id))) {
        const checkPath = `/checks?limit=500&business_id=${business_id}`;
        const options = Object.assign(opts, {
            path: checkPath
        });

        const data = await fetch(options, 0);
        await Check.insertMany(data);
        await Query.create({ model: "Check", business_id: business_id });
    }
}

async function orderedItems(business_id) {
    if(!(await alreadyFetched("OrderedItem", business_id))) {
        const orderPath = `/orderedItems?limit=500&business_id=${business_id}`;
        const options = Object.assign(opts, {
            path: orderPath
        });

        const data = await fetch(options, 0);
        await OrderedItem.insertMany(data);
        await Query.create({ model: "OrderedItem", business_id: business_id });
    }
}

async function employees(business_id) {
    if(!(await alreadyFetched("Employee", business_id))) {
        const employeePath = `/employees?limit=500&business_id=${business_id}`;
        const options = Object.assign(opts, {
            path: employeePath
        });

        const data = await fetch(options, 0);
        await Employee.insertMany(data);
        await Query.create({ model: "OrderedItem", business_id: business_id });
    }
}

async function laborEntries(business_id) {
    const fetched = await alreadyFetched("LaborEntry", business_id);

    if(!fetched) {
        const laborPath = `/laborEntries?limit=500&business_id=${business_id}`;
        const options = Object.assign(opts, {
            path: laborPath
        });

        const data = await fetch(options, 0);
        await LaborEntry.insertMany(data);
        await Query.create({
            model: "LaborEntry",
            business_id: business_id
        });
    }
}

module.exports = {
    businesses,
    menuItems,
    checks,
    orderedItems,
    employees,
    laborEntries
};


