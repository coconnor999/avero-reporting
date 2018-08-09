const LCP = require('./reports/LCP');
const FCP = require('./reports/FCP');
const EGS = require('./reports/EGS');

function reporting(req, res) {
    let params = {};

    // get params or set defaults
    params.report = req.query['report'];
    params.timeInterval = req.query['timeInterval'];
    params.start = new Date(req.query['start']);
    params.end = new Date(req.query['end']);
    params.business_id = req.query['business_id'];

    if(!(params.report &&
         params.timeInterval &&
         params.start &&
         params.end &&
         params.business_id)) {
        res.status(400);
        res.send('Must include all query parameters for a valid search');
    } else {
        handleReporting(params, req, res);
    }
}

function handleReporting(params, req, res) {

    switch(params.report) {
    case 'LCP':
        LCP(params, res);
        break;
    case 'FCP':
        FCP(params, res);
        break;
    case 'EGS':
        EGS(params, res);
        break;
    default:
        res.status(400);
        res.send('Report type not found');
        break;
    }
}

module.exports = reporting;
