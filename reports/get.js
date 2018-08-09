const https = require('https');
const Schema = require('./../schema.js');
const Business = Schema.Business;
const MenuItem = Schema.MenuItem;
const Check = Schema.Check;
const Employee = Schema.Employee;
const LaborEntry = Schema.LaborEntry;
const OrderedItem = Schema.OrderedItem;
const Query = Schema.Query;

const host = 'secret-lake-26389.herokuapp.com';
const auth = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MzM2NTEwNzUsImV4cCI6MTUzNjI0MzA3NX0.t3kaYtlrIjatbu-pMLr1pEaluR2Az5Hk9sl0ceyOK3w';

const opts = {
    host: host,
    headers: { Authorization: auth }
};

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

async function fetch(options, offset) {
    let opts = Object.assign({}, options);
    opts.path = `${opts.path}&offset=${offset}`;

    return new Promise((resolve, reject) => {
        https.get(opts, (resp) => {
            let data = '';
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });
            
            // The whole response has been received. Print out the result.
            resp.on('end', async () => {
                data = JSON.parse(data);
                let entries = data.data;
                if(data.count > offset + 500) {
                    const next = await fetch(options, offset + 500);
                    entries = entries.concat(next);
                }
                console.log(entries.length);
                resolve(entries);
            });
            
        }).on("error", (err) => {
            reject("Error: " + err.message);
        });
    });
}

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


