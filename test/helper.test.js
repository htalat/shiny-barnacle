const chai = require('chai');
const nock = require('nock');

const expect = chai.expect;
const helper = require('../src/helper');

describe('Helper functions test', () =>{

    it('should return true', async ()=>{

        const country = 'USA';
        const state = 'CA';

        nock(`${process.env.STATE_CHECK_URL}`)
        .get(`/state/get/${country}/${state}`)
        .reply(200, {
            "RestResponse" : {
                "messages" : [ "State found matching code [CA]." ],
                "result" : {
                  "id" : 5,
                  "country" : "USAAA",
                  "name" : "California",
                  "abbr" : "CA",
                  "area" : "423967SKM",
                  "largest_city" : "Los Angeles",
                  "capital" : "Sacramento"
                }
            }
        });

        let response = await helper.isStateValid(country, state);

        expect(response).to.equal(true);

    })

    it('should return false', async ()=>{

        const country = 'usa';
        const state = 'ca';

        nock(`${process.env.STATE_CHECK_URL}`)
        .get(`/state/get/${country}/${state}`)
        .reply(200, {
            "RestResponse" : {
                "messages" : [ "No matching state found for requested code [usa->ca]." ]
            }
        });

        let response = await helper.isStateValid(country, state);

        expect(response).to.equal(false);

    })
})