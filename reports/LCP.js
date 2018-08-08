const get = require('./get');
const Schema = require('./../schema.js');
const Business = Schema.Business;
const MenuItem = Schema.MenuItem;
const Check = Schema.Check;
const Employee = Schema.Employee;
const LaborEntry = Schema.LaborEntry;
const OrderedItem = Schema.OrderedItem;
const Query = Schema.Query;

async function LCP(params, req, res) {
    await get.businesses();
    Business.find({}, function(err, data) {
        res.send(data);
    });
}


module.exports = LCP;
