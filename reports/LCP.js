const get = require('./get');

async function LCP(params, res) {
    const data = await get.businesses();

    res.send(JSON.stringify(data));
}


module.exports = LCP;
