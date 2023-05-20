const express = require('express');
const {
    lists,
} = require('../../middlewares/jobsMiddlewares');

const router = express.Router();

router.get('/', lists);

module.exports = express.Router().use('/jobs/', router);