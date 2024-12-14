var express = require('express');
var router = express.Router();
const controller = require('../controller/product.controller.js');
const authentication = require('../middleware/authentication.js');
const multer = require('multer');
const { format } = require('date-fns');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
      const now = new Date();
      const timestamp = format(now, 'yyyy-MM-dd-HHmmss');
      const uniqueSuffix = `${timestamp}-${file.originalname}`;
      cb(null, uniqueSuffix);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Hanya file JPG, JPEG, atau PNG yang diizinkan'), false);
    }
  };
  
  const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter 
  });
  

router.get('/products', authentication, controller.getProducts);
router.get('/products/:id', authentication, controller.getProductById);
router.put('/products/:id', authentication,upload.single('image'), controller.updateProduct); 
router.post('/products', authentication, upload.single('image'), controller.createProduct); 


module.exports = router;
