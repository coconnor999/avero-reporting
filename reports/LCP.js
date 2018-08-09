const get = require('./get');
const helper = require('./helper');
const Schema = require('./../schema.js');
const Business = Schema.Business;
const MenuItem = Schema.MenuItem;
const Check = Schema.Check;
const Employee = Schema.Employee;
const LaborEntry = Schema.LaborEntry;
const OrderedItem = Schema.OrderedItem;
const Query = Schema.Query;



async function LCP(params, res) {

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

        
    while(curr_end <= params.end) {
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
        console.log(curr_start);

        curr_start = curr_end;
        curr_end = helper.addTime(curr_start, params.timeInterval);
    }
    res.send(report);
}


module.exports = LCP;
