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

async function FCP(params, res) {

    await get.orderedItems(params.business_id);
    await get.checks(params.business_id);

    let report = {
        report: "FCP",
        timeInterval: params.timeInterval,
        data: []
    };

    let curr_start = params.start;
    let curr_end = helper.addTime(curr_start, params.timeInterval);

        
    while(curr_end <= params.end) {
        const checks = await Check.find(
            {
                business_id: params.business_id,
                closed: true,
                closed_at: {
                    $lte: curr_end,
                    $gt: curr_start
                }
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
                'price cost',
                (err, data) => {
                    return data;
                });
            orderedItems = orderedItems.concat(items);
        };
        
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

        curr_start = curr_end;
        curr_end = helper.addTime(curr_start, params.timeInterval);
    }
    res.send(report);
}


module.exports = FCP;
