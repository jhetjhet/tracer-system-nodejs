const express = require('express');
const {
    create,
    login,
    retrieve,
    refresh,
    verify,
    logout,
} = require('../../middlewares/authenticationMiddlewares');

const router = express.Router();

router.post('/register/', create);
router.post('/login/', login);
router.post('/refresh/', refresh);
router.post('/logout/', logout);
router.post('/verify/', verify);
router.get('/user/', retrieve);

module.exports = express.Router().use('/auth/', router);
