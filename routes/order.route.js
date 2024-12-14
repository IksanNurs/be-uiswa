var express = require('express');
var router = express.Router();
const controller = require('../controller/order.controller.js');
const authentication = require('../middleware/authentication.js');

router.get('/orders', authentication, controller.getOrders);
router.get('/orders/:id', authentication, controller.getOrderById);
router.put('/orders/:id', authentication, controller.updateOrder); 
router.post('/orders', authentication, controller.createOrder); 


module.exports = router;
