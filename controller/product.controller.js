const { Product, User, Order } = require('../models'); // Assuming you have Product and User models
const { validationResult } = require('express-validator'); // Validation imports
const { Sequelize } = require('sequelize');


// Create a new product
const createProduct = async (req, res) => {
  const { name, description, price, type, stock } = req.body;  // Extract fields from the request body
  const user_id = req.userId;  // Get the user ID from the JWT token (set by the middleware)

  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Fetch the user to associate with the product (createdBy)
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: `User with ID ${user_id} not found` });
    }

    // Create a new product
    const newProduct = await Product.create({
      name,
      description,
      price,
      stock,
      type,
      user_id,
      image: req.file ? req.file.filename : null 
    });

    // Return success response with the created product
    res.status(201).json({
      message: 'Product created successfully',
      data: newProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while creating the product' });
  }
};

// Get all products
const getProducts = async (req, res) => {
  const userId = req.userId;
  let { name, sort } = req.query;

  if (sort) {
    sort = sort.replace(/['"]+/g, '');
  }

  try {
    const currentUser = await User.findByPk(userId, {
      attributes: ['latitude', 'longitude']
    });

    let whereConditions = {};
    let attributes = [
      'id', 'name', 'description', 'price', 'type', 'image',
      [
        Sequelize.literal(`(
          SELECT COUNT(*)
          FROM "Orders"
          WHERE "Orders"."product_id" = "Product"."id"
        )`),
        'orderCount'
      ]
    ];

    if (name) {
      const cleanName = name.replace(/['"]+/g, '');
      whereConditions.name = {
        [Sequelize.Op.iLike]: `%${cleanName}%`
      };
    }

    if (sort === 'nearest' && currentUser.latitude && currentUser.longitude) {
      attributes.push([
        Sequelize.literal(`
          CASE WHEN "user"."latitude" IS NOT NULL AND "user"."longitude" IS NOT NULL
          THEN (
            6371 * acos(
              cos(radians(${currentUser.latitude})) * cos(radians("user"."latitude")) *
              cos(radians("user"."longitude") - radians(${currentUser.longitude})) +
              sin(radians(${currentUser.latitude})) * sin(radians("user"."latitude"))
            )
          )
          ELSE NULL END
        `),
        'distance'
      ]);
    }

    let products = await Product.findAll({
      attributes,
      where: whereConditions,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'latitude', 'longitude']
        }
      ]
    });

    if (sort) {
      switch(sort) {
        case 'price_asc':
          products = products.sort((a, b) => a.price - b.price);
          break;
        case 'most_ordered':
          products = products.sort((a, b) => b.dataValues.orderCount - a.dataValues.orderCount);
          break;
        case 'nearest':
          if (currentUser.latitude && currentUser.longitude) {
            products = products.sort((a, b) => a.dataValues.distance - b.dataValues.distance);
          }
          break;
      }
    }

    res.status(200).json({
      message: 'Products retrieved successfully',
      data: { products: products.length > 0 ? products : null }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching the products' });
  }
};



// Get a product by ID
const getProductById = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findOne({
      where: { id: productId },
      attributes: ['id', 'name', 'description', 'price', 'type','image',],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username'],
        },
      ]
    });

    if (!product) {
      return res.status(404).json({ message: `Product with ID ${productId} not found` });
    }

    res.status(200).json({
      message: 'Product retrieved successfully',
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching the product' });
  }
};

// Update a product by ID
const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const { name, description, price, type, stock } = req.body;  // Extract fields from request body
  const updatedBy = req.userId;  // Get the user ID from the JWT token (set by the middleware)

  try {
    const product = await Product.findOne({ where: { id: productId } });

    if (!product) {
      return res.status(404).json({ message: `Product with ID ${productId} not found` });
    }

    // Fetch the user to associate with the product (updatedBy)
    const user = await User.findByPk(updatedBy);
    if (!user) {
      return res.status(404).json({ message: `User with ID ${updatedBy} not found` });
    }

    // Update the product fields if they are provided
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.type = type || product.type;
    product.stock = stock || product.stock;

    if (req.file) { 
      product.image = req.file.filename;
    }



    // Save the updated product to the database
    await product.save();

    res.status(200).json({
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating the product' });
  }
};


  

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
};
