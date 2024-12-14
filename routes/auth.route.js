var express = require('express');
var router = express.Router();
const controller = require('../controller/auth.controller.js');

router.post('/auth/login', controller.login);
router.post('/auth/register', controller.register);


module.exports = router;
