const router = require('express').Router();

const AddressService = require('../services/address');
const helper = require('../helper');

router.get('/', async(req, res) =>{

    try {

        let {
            state,
            country
        } = req.query;
    
        let fetchAll = false;
    
        if(typeof state === 'undefined' || typeof country === 'undefined'){
            fetchAll = true;
        }
    
        let addresses = await AddressService.fetch(fetchAll, country, state);

        let response = {
            status: true, 
            message: 'Found addresses', 
            data: { addresses }
        }

        return res.status(200).json(response);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: false, message: 'Something went wrong'});       
    }

})

router.post('/', async(req, res) =>{

    try {

        let {
            state,
            country
        } = req.body;

        let paramsToCheck = ['name', 'street', 'city', 'state', 'country'];

        let keyCheck = Object.keys(req.body).filter(k => paramsToCheck.includes(k));

        if(keyCheck.length !== paramsToCheck.length){
            return res.status(400).json({status: false, message: 'Incorrect or missing parameters'});
        }

        let stateCheck = await helper.isStateValid(country, state);

        if(!stateCheck){
            return res.status(400).json({status: false, message: 'Incorrect country or state'});
        }

        let createdAddress = await AddressService.create(req.body);

        let response = {
            status: true,
            message: 'Created new address',
            data: {
                address: createdAddress
            }
        }

        return res.status(201).json(response);

    } catch (error) {
        console.log(error);
        return res.status(500).json({status: false, message: 'Something went wrong'});
    }

})

router.get('/:id', async(req, res) =>{

    try {

        let { id } = req.params;

        let foundAddress = await AddressService.get(id);

        if(foundAddress === null){

            let response = {
                status: false,
                message: 'Not found'
            }

            return res.status(404).json(response);
        }

        let response = {
            status: true,
            message: 'Found Address',
            data: {
                address: foundAddress
            }
        }

        return res.status(200).json(response);

    } catch (error) {
        console.log(error);
        return res.status(500).json({status: false, message: 'Something went wrong'});
    }

})

router.put('/:id', async(req, res) =>{

    try {

        let { id } = req.params;

        let foundAddress = await AddressService.get(id);

        if(foundAddress === null){

            let response = {
                status: false, 
                message: 'Not found',
            }
            
            return res.status(404).json(response);
        }

        let keysToCheck = ['country', 'state'];

        let n = Object.keys(req.body).filter(k => keysToCheck.includes(k)).length;

        if(n === 1){

            let response = {
                status: false,
                message: 'Can not have either state or country field. Need both'
            }

            return res.status(400).json(response);
        }

        if(n === 2){

            let {
                country,
                state
            } = req.body;
    
            let stateCheck = await helper.isStateValid(country, state);

            if(!stateCheck){

                let response = {
                    status: false,
                    message: 'Incorrect country or state'
                }

                return res.status(400).json(response);
            }
        }

        let updatedAddress = await AddressService.update(id, req.body);

        let response = {
            status: true, 
            message: 'Updated Address'
        }
        
        return res.status(200).json(response);

    } catch (error) {
        console.log(error);
        return res.status(500).json({status: false, message: 'Something went wrong'});
    }

})

router.delete('/:id', async(req, res) =>{

    try {

        let { id } = req.params;

        await AddressService.remove(id);

        return res.status(204).send();
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: false, message: 'Something went wrong'});        
    }
})

module.exports = router;