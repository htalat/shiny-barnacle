const chai = require('chai');
const request  = require('supertest');

const app = require('../src/app');
const expect = chai.expect;

describe('Base API test', () =>{

    it('should return hello world', async () =>{

        const res = await request(app)
        .get('/')
        .expect(200);
 
        expect(res.body.status).equal(true);
        expect(res.body.message).equal('hello world');
    });


    it('should return not found', async () =>{

        const res = await request(app)
        .get('/random')
        .expect(404);

        expect(res.body.status).equal(false);
        expect(res.body.message).equal('not found');
    });
})