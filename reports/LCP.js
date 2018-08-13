const get = require('./get');
const find = require('./find');
const helper = require('./helper');


// LABOR COST PERCENTAGE
async function LCP(params, res) {

    // load necessary documents into local database
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

    // loop over each time interval
    while(curr_end <= params.end) {

        let laborEntries, orderedItems;

        [laborEntries, orderedItems] = await Promise.all([
            find.laborEntries(params.business_id,
                              curr_start,
                              curr_end),
            find.orderedItems(params.business_id,
                              curr_start,
                              curr_end)]);

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
