const LCP = require('./reports/LCP');
const FCP = require('./reports/FCP');
const EGS = require('./reports/EGS');

function reporting(req, res) {
    let params = {};

    // get params or set defaults
    params.report = req.query['report'] || 'LCP';
    params.timeInterval = req.query['timeInterval'] || 'hour';
    params.start = new Date(req.query['start']) || new Date(0);
    params.end = new Date(req.query['end']) || Date.now();
    params.business_id = req.query['business_id'] || null;
    return handleReporting(params, res);
}

function handleReporting(params, res) {

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