const Schema = require('./../schema.js');
const Check = Schema.Check;
const LaborEntry = Schema.LaborEntry;
const OrderedItem = Schema.OrderedItem;

// FIND ALL THE DATA IN THE DATABASE

async function laborEntries(business_id, start, end) {
    return LaborEntry.find(
            {
                business_id: business_id,
                $or: [
                    { clock_in: { $lte: start },
                      clock_out: { $gt: start } },
                    { clock_in: { $lte: end },
                      clock_out: { $gt: start } }
                ]},
            (err, data) => {
                return data;
            });
}

async function employeeOrderedItems(business_id, employee_id, start, end) {
    const checks = await Check.find(
        {
            business_id: business_id,
            employee_id: employee_id,
            closed: true,
            closed_at: {
                $lte: end,
                $gt: start }
        },
        'id',
        (err, data) => {
            return data;
        });

    const items = await orderedItemsHelper(checks);
    return items;
}

async function orderedItems(business_id, start, end) {
    const checks = await Check.find(
        {
            business_id: business_id,
            closed: true,
            closed_at: {
                $lte: end,
                $gt: start }
        },
        'id',
        (err, data) => {
            return data;
        });

    const items = await orderedItemsHelper(checks);
    console.log(items);
    return items;
}

async function orderedItemsHelper(checks) {
    let orderedItems = [];

    // for every check, get associated orderedItems
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

    return orderedItems;
}


module.exports = {
    laborEntries,
    orderedItems,
    employeeOrderedItems
};
