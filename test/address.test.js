const chai = require('chai');
const spies = require('chai-spies');

const mongoose = require('mongoose');
const request  = require('supertest');

const app = require('../src/app');
const helper = require('../src/helper');

const expect = chai.expect;
chai.use(spies);

let mockAddress = {
    "_id" : mongoose.Types.ObjectId("5dbee9e382f644515a7e047e"),
    "name" : "work",
    "street" : "highland avenue",
    "city" : "needham",
    "state" : "MA",
    "country" : "USA",
    "createdAt" : "2019-11-03T14:53:23.406Z",
    "updatedAt" : "2019-11-03T14:53:23.406Z",
    "__v" : 0
}

let mockAddress2 = {
    "_id" : mongoose.Types.ObjectId("5dbee9e382f644515a7e047a"),
    "name" : "second work",
    "street" : "mission street",
    "city" : "San Francisco",
    "state" : "CA",
    "country" : "USA",
    "createdAt" : "2019-11-03T14:53:23.406Z",
    "updatedAt" : "2019-11-03T14:53:23.406Z",
    "__v" : 0
}

describe('Address API test', () =>{

    let server;

    before(async ()=>{
        server = app.listen(process.env.PORT);
        await mongoose.connection.collection('addresses').insertMany([mockAddress, mockAddress2]);
    })
    
    after(async ()=>{
        await mongoose.connection.db.dropDatabase();
        server.close();
    })

    afterEach(async function() {
        chai.spy.restore(helper, 'isStateValid');
    })

    describe('POST /address', () =>{

        it('should create an address', async () =>{

            chai.spy.on(helper, 'isStateValid', returns => true);
    
            let obj = {
                name: "home",
                street: "avenue",
                city: "needham",
                state: "MA",
                country: "USA"
            }
    
            let res = await request(app)
            .post('/address')
            .send(obj)
            .expect(201);
    
            let { status, message, data: { address } } = res.body;
    
            expect(status).equal(true);
            expect(message).to.equal('Created new address');
            expect(address.name).to.equal('home');
            expect(address.street).to.equal('avenue');
            expect(address.city).to.equal('needham');
            expect(address.state).to.equal('MA');
            expect(address.country).to.equal('USA');
            expect(address).to.contain.keys(['_id', 'createdAt', 'updatedAt']);
        })
    
        it('should return an error - Incorrect country or state', async () =>{
    
            chai.spy.on(helper, 'isStateValid', returns => false);
    
            let obj = {
                name: "home",
                street: "avenue",
                city: "needham",
                state: "MA",
                country: "USA"
            }
    
            let res = await request(app)
            .post('/address')
            .send(obj)
            .expect(400);
    
            let { status, message} = res.body;
    
            expect(status).equal(false);
            expect(message).to.equal('Incorrect country or state');
    
        })
    
        it('should return an error - Incorrect or missing parameters', async () =>{
    
            chai.spy.on(helper, 'isStateValid', returns => true);
    
            let obj = {
                street: "avenue",
                city: "needham",
                state: "MA",
                country: "USA"
            }
    
            let res = await request(app)
            .post('/address')
            .send(obj)
            .expect(400);
    
            let { status, message} = res.body;
    
            expect(status).equal(false);
            expect(message).to.equal('Incorrect or missing parameters');
    
        })
    })

    describe('GET /address/:id', ()=>{

        it('should return an address', async () =>{

            let res = await request(app)
            .get(`/address/${mockAddress._id.toHexString()}`)
            .expect(200);

            let { status, message, data: { address } } = res.body;
    
            expect(status).equal(true);
            expect(message).to.equal('Found Address');
            expect(address.name).to.equal(mockAddress.name);
            expect(address.street).to.equal(mockAddress.street);
            expect(address.city).to.equal(mockAddress.city);
            expect(address.state).to.equal(mockAddress.state);
            expect(address.country).to.equal(mockAddress.country);
            expect(address).to.contain.keys(['_id', 'createdAt', 'updatedAt']);
    
        })
    
        it('should not return an address', async () =>{
    
            let res = await request(app)
            .get(`/address/5dbee9e382f644515a7e047f}`)
            .expect(404);
    
            let { status, message } = res.body;
    
            expect(status).equal(false);
            expect(message).to.equal('Not found');
    
        })
    })

    describe('PUT /address/:id', () =>{

        it('should update an addresses', async () =>{

            let obj = {
                name: "WORK"
            }
    
            await request(app)
            .put(`/address/${mockAddress._id.toHexString()}`)
            .send(obj)
            .expect(200);
    
            let res = await request(app)
            .get(`/address/${mockAddress._id.toHexString()}`)
            .expect(200);
    
            let { status, message, data: { address } } = res.body;
            expect(status).equal(true);
            expect(message).to.equal('Found Address');
            expect(address.name).to.equal(obj.name);
        })

        
        it('should not update an addresses - bad id', async () =>{

            let obj = {
                name: "WORK"
            }
    
            let res = await request(app)
            .put(`/address/5dbee9e382f644515a7e047c`)
            .send(obj)
            .expect(404);
    
            let { status, message } = res.body;
            expect(status).equal(false);
            expect(message).to.equal('Not found');
        })

        it('should not update an addresses - invalid country / state', async () =>{
    
            chai.spy.on(helper, 'isStateValid', returns => false);
    
            let obj = {
                name: "WORK",
                country: "USA",
                state: "ss"
            }
    
            let res = await request(app)
            .put(`/address/${mockAddress._id.toHexString()}`)
            .send(obj)
            .expect(400);
    
            let { status, message } = res.body;
            expect(status).to.equal(false);
            expect(message).to.equal('Incorrect country or state');
        })
    
        it('should not update an addresses - Can not have either state or country field', async () =>{
    
            chai.spy.on(helper, 'isStateValid', returns => false);
    
            let obj = {
                name: "WORK",
                country: "USA"
            }
    
            let res = await request(app)
            .put(`/address/${mockAddress._id.toHexString()}`)
            .send(obj)
            .expect(400);
    
            let { status, message } = res.body;
            expect(status).to.equal(false);
            expect(message).to.equal('Can not have either state or country field. Need both');
        })
    
        it('should not update an addresses - Can not have either state or country field', async () =>{
    
            chai.spy.on(helper, 'isStateValid', returns => false);
    
            let obj = {
                name: "WORK",
                state: 'CA'
            }
    
            let res = await request(app)
            .put(`/address/${mockAddress._id.toHexString()}`)
            .send(obj)
            .expect(400);
    
            let { status, message } = res.body;
            expect(status).to.equal(false);
            expect(message).to.equal('Can not have either state or country field. Need both');
        })
        
        it('should update state of an address', async () =>{
    
            chai.spy.on(helper, 'isStateValid', returns => true);
    
            let obj = {
                state: 'NH',
                country: 'USA'
            }
    
            await request(app)
            .put(`/address/${mockAddress._id.toHexString()}`)
            .send(obj)
            .expect(200);
    
            let res = await request(app)
            .get(`/address/${mockAddress._id.toHexString()}`)
            .expect(200);
    
            let { status, message, data: { address } } = res.body;
            expect(status).equal(true);
            expect(message).to.equal('Found Address');
            expect(address.state).to.equal(obj.state);
        })
    })

    describe('DELETE /address/:id', () =>{

        it('should remove an address', async () =>{

            await request(app)
            .delete(`/address/${mockAddress._id.toHexString()}`)
            .expect(204);
    
            let res = await request(app)
            .get(`/address/${mockAddress._id.toHexString()}`)
    
            let { status, message } = res.body;
    
            expect(status).equal(false);
            expect(message).to.equal('Not found');
    
        })       
    })

    describe('GET /address', () =>{
        it('should return all addresses', async () =>{

            let res = await request(app)
            .get('/address')
            .expect(200);
    
            let { status, message, data: { addresses } } = res.body;
            expect(status).equal(true);
            expect(message).to.equal('Found addresses');
            expect(addresses).to.be.an('Array');
        })
    
        it('should return only CA addresses', async () =>{
    
            let res = await request(app)
            .get('/address?state=CA&country=USA')
            .expect(200);
    
            let { status, message, data: { addresses } } = res.body;
            expect(status).equal(true);
            expect(message).to.equal('Found addresses');
            expect(addresses).to.be.an('Array');
            expect(addresses.length).to.equal(1);
            expect(addresses[0].state).to.equal('CA');
            expect(addresses[0].country).to.equal('USA');
        })
    
        it('should return no addresses', async () =>{
    
            let res = await request(app)
            .get('/address?state=NY&country=USA')
            .expect(200);
    
            let { status, message, data: { addresses } } = res.body;
            expect(status).equal(true);
            expect(message).to.equal('Found addresses');
            expect(addresses).to.be.an('Array');
            expect(addresses.length).to.equal(0);
        })
    })
});