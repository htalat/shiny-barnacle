const mongoose = require('mongoose');

const schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 3
    }
},   
{
    timestamps: true,
    toObject: {
        transform: (doc, ret) =>{
            delete ret.__v;
        }
    },
    toJSON: {
        transform: (doc, ret) =>{
            delete ret.__v;
        }
    }
})


const Address = mongoose.model('Address', schema);

module.exports = Address;