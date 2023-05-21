const express = require('express');
const {
    // retrieve,
    // get_form_items,
    // submit,
    charts,
    chartBlob,
} = require('../../middlewares/tracerFormMiddlewares');

const router = express.Router();

// router.get('', retrieve);
// router.get('/items/', get_form_items);
// router.post('', submit);
router.get('/charts/', charts);
router.get('/charts/:chartID/', chartBlob);

module.exports = express.Router().use('/forms/', router);
