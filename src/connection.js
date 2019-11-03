const mongoose = require('mongoose');

async function setup(){

    let opts = {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true
    }
    
    mongoose.Promise = global.Promise;

    try {
        
        await mongoose.connect(process.env.MONGO_CONNECTION, opts)

        if(process.env.NODE_ENV !== 'test'){
            console.log('connected to mongoose');
        }

        const db = mongoose.connection;
        db.on('error', err => console.error('MongoDB connection error:', err));

    } catch (error) {
        console.log(error);
        process.exit(1);
    }

}

module.exports = {
    setup
}