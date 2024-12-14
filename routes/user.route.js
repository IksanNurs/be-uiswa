var express = require('express');
var router = express.Router();
const controller = require('../controller/user.controller.js');
const authentication = require('../middleware/authentication.js');

router.get('/users', authentication, controller.getUsers);
router.get('/users/self', authentication, controller.getUserSelf);
router.put('/users', authentication, controller.updateUser); 


module.exports = router;
