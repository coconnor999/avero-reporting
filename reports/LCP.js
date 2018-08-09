const get = require('./get');
const helper = require('./helper');
const Schema = require('./../schema.js');
const Check = Schema.Check;
const LaborEntry = Schema.LaborEntry;
const OrderedItem = Schema.OrderedItem;

// LABOR COST PERCENTAGE
async function LCP(params, res) {

    // load necessary documents into local database
    await get.orderedItems(params.business_id);
    await get.laborEntries(params.business_id);
    await get.checks(params.business_id);

    let report = {
        report: "LCP",
        timeInterval: params.timeInterval,
        data: []
    };

    let curr_start = params.start;
    let curr_end = helper.addTime(curr_start, params.timeInterval);

    // loop over each time interval
    while(curr_end <= params.end) {

        // get all labor entries that overlap the current
        // time interval
        const laborEntries = await LaborEntry.find(
            {
                business_id: params.business_id,
                $or: [
                    { clock_in: { $lte: curr_start },
                      clock_out: { $gt: curr_start } },
                    { clock_in: { $lte: curr_end },
                      clock_out: { $gt: curr_start } }
                ]},
            (err, data) => {
                return data;
            });


        // Find all the checks in the time interval
        const checks = await Check.find(
            {
                business_id: params.business_id,
                closed: true,
                closed_at: {
                    $lte: curr_end,
                    $gt: curr_start }
            },
            'id',
            (err, data) => {
                return data;
            });

        let orderedItems = [];

        // for every check, get associated orderedItems
        for(let i = 0; i < checks.length; ++i) {
            const check = checks[i];
            const items = await OrderedItem.find(
                { check_id: check.id, voided: false },
                'price',
                (err, data) => {
                    return data;
                });
            orderedItems = orderedItems.concat(items);
        };


        let labor = 0;
        let sales = 0;

        orderedItems.forEach(item => {
            sales += item.price;
        });

        // calculate labor cost by measuring clock time overlap with
        // time interval and multiplying by pay_rate
        laborEntries.forEach(entry => {
            let clock_in = entry.clock_in < curr_start ? curr_start : entry.clock_in;
            let clock_out = entry.clock_out < curr_end ? entry.clock_out : curr_end;
            let hours = helper.diffHours(clock_out, clock_in);
            labor += hours * entry.pay_rate;
        });

        report.data.push({
            timeFrame: {
                start: curr_start,
                end: curr_end
            },
            value: (labor / sales) * 100
        });

        // increment boundary timestamps
        curr_start = curr_end;
        curr_end = helper.addTime(curr_start, params.timeInterval);
    }
    res.send(report);
}


module.exports = LCP;
