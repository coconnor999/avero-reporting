const get = require('./get');
const find = require('./find');
const helper = require('./helper');
const Schema = require('./../schema.js');
const Check = Schema.Check;
const LaborEntry = Schema.LaborEntry;
const OrderedItem = Schema.OrderedItem;

// FOOD COST PERCENTAGE
async function FCP(params, res) {

    // ensure that the necessary documents are
    // loaded in the local database
    await Promise.all([
        get.orderedItems(params.business_id),
        get.checks(params.business_id)]);

    let report = {
        report: "FCP",
        timeInterval: params.timeInterval,
        data: []
    };

    let curr_start = params.start;
    let curr_end = helper.addTime(curr_start, params.timeInterval);

    // loop over each time interval and calculate FCP
    while(curr_end <= params.end) {

        // get all relevant checks
        const orderedItems = await find.orderedItems(params.business_id,
                                                     curr_start,
                                                     curr_end);
        
        let cost = 0;
        let sales = 0;

        orderedItems.forEach(item => {
            sales += item.price;
            cost += item.cost;
        });

        report.data.push({
            timeFrame: {
                start: curr_start,
                end: curr_end
            },
            value: (cost / sales) * 100
        });

        // increment the date boundaries
        curr_start = curr_end;
        curr_end = helper.addTime(curr_start, params.timeInterval);
    }
    res.send(report);
}


module.exports = FCP;
