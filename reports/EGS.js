const get = require('./get');
const find = require('./find');
const helper = require('./helper');
const Schema = require('./../schema.js');
const Check = Schema.Check;
const LaborEntry = Schema.LaborEntry;
const OrderedItem = Schema.OrderedItem;

// EMPLOYEE GROSS SALES
async function EGS(params, res) {

    // ensure relevant documents are loaded in the
    // local database
    await Promise.all([
        get.orderedItems(params.business_id),
        get.laborEntries(params.business_id),
        get.checks(params.business_id)]);

    let report = {
        report: "LCP",
        timeInterval: params.timeInterval,
        data: []
    };

    let curr_start = params.start;
    let curr_end = helper.addTime(curr_start, params.timeInterval);

    // loop over time intervals and calculate EGS
    while(curr_end <= params.end) {

        // find all labor entries that overlap with
        // this time interval
        const laborEntries = await find.laborEntries(params.business_id,
                                                     curr_start,
                                                     curr_end);

        // for every laborEntry, get all checks associated
        // with the employee
        for(let i = 0; i < laborEntries.length; ++i) {
            const labor = laborEntries[i];
            const orderedItems = await find.employeeOrderedItems(params.business_id,
                                                                 labor.employee_id,
                                                                 curr_start,
                                                                 curr_end);

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

        // increment timestamp boundaries
        curr_start = curr_end;
        curr_end = helper.addTime(curr_start, params.timeInterval);
    }
    res.send(report);
}


module.exports = EGS;
