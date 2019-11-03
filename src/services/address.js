const Model = require('../models/Address');

async function create(obj){

    try {
        
        let doc = new Model(obj);

        let savedDoc = await doc.save();

        return savedDoc;

    } catch (error) {
        return null;
    }

}

async function get(id){

    try {

        let query = {_id: id};

        let doc = await Model.findOne(query).lean();

        return doc;

    } catch (error) {
        return null;
    }
}

async function update(id, toUpdate){

    try {

        let q = { _id: id };
        let u = {
            $set: {
                ...toUpdate
            }
        }
    
        let updatedDoc = await Model.updateOne(q, u);    
        
        return updatedDoc;
        
    } catch (error) {
        return null;
    }

}

async function remove(id){

    try {

        let q = { _id: id };

        await Model.deleteOne(q);

        return true;
        
    } catch (error) {
        return false;
    }
}

async function fetch(all, country, state){

    let query;

    if(all){
        query = {};
    }else{
        query = { state, country };
    }

    try {

        let addresses = await Model.find(query);

        return addresses;

    } catch (error) {
        return null;
    }
}

module.exports = {
    create,
    get,
    update,
    remove,
    fetch
}