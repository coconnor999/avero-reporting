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

async function alreadyFetched(model, business_id, employee_id) {
    return await Query.find({
        $and: [
            { model: model },
            { $or: [{ business_id: business_id }, { business_id: null }] },
            { $or: [{ employee_id: employee_id }, { employee_id: null }] }
        ]}, function(err, data) {
            if(data.length > 0) {
                return true;
            } else {
                return false;
            }
        });
              
}

async function fetch(options) {
    return new Promise((resolve, reject) => {
        https.get(options, (resp) => {
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

async function businesses() {
    if(!(await alreadyFetched("Business", null, null))) {
        const options = Object.assign(opts, {
            path: '/businesses'
        });
        
        const data = await fetch(options, 'businesses');
        await Business.insertMany(data);
        await Query.insertOne({ model: "Business" });         
    }
}

async function menuItems(business_id) {
    if(!(await alreadyFetched("MenuItem", business_id, null))) {
        const options = Object.assign(opts, {
            path: `/menuItems?business_id=${business_id}`
        });
        
        const data = await fetch(options);
        await MenuItem.insertMany(data);
        await Query.insertOne({ model: "MenuItem", business_id: business_id });
    }
}

async function checks(business_id) {
    if(!(await alreadyFetched("Check", business_id, null))) {
        const options = Object.assign(opts, {
            path: `/checks?business_id=${business_id}`
        });

        const data = await fetch(options);
        await Check.insertMany(data);
        await Query.insertOne({ model: "Check", business_id: business_id });
    }
}

async function orderedItems(business_id) {
    if(!(await alreadyFetched("OrderedItem", business_id, null))) {
        const options = Object.assign(opts, {
            path: `/orderedItems?business_id=${business_id}`
        });

        const data = await fetch(options);
        await OrderedItem.insertMany(data);
        await Query.insertOne({ model: "OrderedItem", business_id: business_id });
    }
}

async function employees(business_id) {
    if(!(await alreadyFetched("Employee", business_id, null))) {
        const options = Object.assign(opts, {
            path: `/employees?business_id=${business_id}`
        });

        const data = await fetch(options);
        await Employee.insertMany(data);
        await Query.insertOne({ model: "OrderedItem", business_id: business_id });
    }
}

async function laborEntries(business_id, employee_id) {
    if(!(await alreadyFetched("LaborEntry", business_id, employee_id))) {
        let laborPath = '/laborEntries?';
        if(business_id) {
            laborPath += `business_id=${business_id}`;
        }
        if(business_id && employee_id) {
            laborPath += '&';
        }
        if(employee_id) {
            laborPath += `employee_id=${employee_id}`;
        }
        const options = Object.assign(opts, {
            path: laborPath
        });

        const data = await fetch(options);
        await LaborEntry.insertMany(data);
        await Query.insertOne({
            model: "LaborEntry",
            business_id: business_id,
            employee_id: employee_id
        });
    }
}

module.exports = {
    businesses,
    menuItems,
    checks,
    orderedItems,
    employees
};


