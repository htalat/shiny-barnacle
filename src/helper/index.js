const rp = require('request-promise');

async function isStateValid(country, state){

    try {

        let opts = {
            uri: `${process.env.STATE_CHECK_URL}/state/get/${country}/${state}`,
            json: true
        };
        
        let response = await rp(opts);

        let {
            RestResponse: { result }
        } = response;

        return typeof result !== 'undefined' ? true : false;

    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = {
    isStateValid
}