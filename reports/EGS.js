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

async function EGS(params, res) {
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
        
        for(let i = 0; i < laborEntries.length; ++i) {
            const labor = laborEntries[i];

            const checks = await Check.find(
                {
                    business_id: params.business_id,
                    employee_id: labor.employee_id,
                    closed: true,
                    closed_at: {
                        $lte: curr_end,
                        $gt: curr_start }
                },
                'id',
                (err, data) => {
                    return data;
                });
            console.log(`Checks: ${checks.length}`);
            let orderedItems = [];

            for(let j = 0; j < checks.length; ++j) {
                const check = checks[j];
                const items = await OrderedItem.find(
                    { check_id: check.id, voided: false },
                    'price',
                    (err, data) => {
                        return data;
                    });
                orderedItems = orderedItems.concat(items);
            };
            console.log(`Items: ${orderedItems.length}`);

            let sales = 0;
            orderedItems.forEach(item => {
                sales += item.price;
            });

            report.data.push({
                timeFrame: {
                    start: curr_start,
                    end: curr_end
                },
                employee: labor.name,
                value: sales
            });
        }
        
        curr_start = curr_end;
        curr_end = helper.addTime(curr_start, params.timeInterval);
    }
    res.send(report);
}


module.exports = EGS;
