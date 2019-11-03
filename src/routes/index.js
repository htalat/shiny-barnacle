const router = require('express').Router();

const addressRoutes = require('./address');

router.get('/', (req, res) => res.status(200).json({status: true, message: 'hello world'}));

router.use('/address', addressRoutes);

router.use((req, res) => res.status(404).send({status: false, message: 'not found'}));

module.exports = router;