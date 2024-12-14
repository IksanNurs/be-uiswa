'use strict';
const { Order, Product, User } = require('../models');  // Assuming Order, Product, and User models
const { validationResult } = require('express-validator');  // Validation imports
const axios = require('axios');





// Create a new order
const createOrder = async (req, res) => {
    const { product_id, quantity, loan_date } = req.body;  // Only product_id is now required in the request body
    const userId = req.userId;  // Get the user ID from the JWT token (set by the middleware)
  
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {
      // Fetch the user to associate with the order
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: `User with ID ${userId} not found` });
      }
  
      // Fetch the product associated with the given product_id
      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${product_id} not found` });
      }
  
      // Fetch the price for the product
      const price = product.price;
  
      // Create a new order entry in the database
      const newOrder = await Order.create({
        user_id: userId,
        product_id,  // Use snake_case for product_id field
        amount: price,
        loan_date,
        quantity
      });
  
  
      // Return success response with the payment URL and the created order
      res.status(201).json({
        message: 'Order created successfully',
        data: {
          order: newOrder,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while creating the order' });
    }
  };
  
// Get all orders
const getOrders = async (req, res) => {
  try {
    const userId = req.userId;

    // Basic attributes to retrieve from the orders table
    const orderAttributes = [
      'user_id', 'product_id', 'amount', 'status', 'rate', 'return_date', 'loan_date', 'quantity'
    ];

    // Start the query
    const queryOptions = {
      where: {
        user_id: userId
      },
      attributes: orderAttributes,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username'],
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'image'],
        },
      ],
    };

 

  // Fetch orders based on the query options
  const orders = await Order.findAndCountAll(queryOptions);


  // Return the response
  res.status(200).json({
    message: 'Orders retrieved successfully',
    data: orders.rows,
  });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching the orders' });
  }
};
  

// Get an order by ID
const getOrderById = async (req, res) => {
    const orderId = req.params.id;
  
    try {
      const order = await Order.findOne({
        where: { id: orderId },
        attributes: [
          'user_id',
          'product_id',
          'amount',
          'status',
          'rate',
          'quantity',
          'return_date',
          'loan_date',
        ],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username'],
          },
          {
            model: Product,
            as: 'product',  // Sesuaikan alias dengan asosiasi
            attributes: ['id', 'name', 'price', 'image'],
          },
       
        ],
      });
  
      if (!order) {
        return res.status(404).json({ message: `Order with ID ${orderId} not found` });
      }
  
      res.status(200).json({
        message: 'Order retrieved successfully',
        data: order,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while fetching the order' });
    }
  };
  

// Update an order by ID
const updateOrder = async (req, res) => {
    const orderId = req.params.id;
    const {
      product_id,
      amount,
      rate,
      status,
      return_date,
      loan_date,
    } = req.body;
  
    const updatedBy = req.userId;  // Ambil user ID dari JWT token (set oleh middleware)
  
    try {
      // Cari order berdasarkan ID
      const order = await Order.findOne({ where: { id: orderId } });
  
      if (!order) {
        return res.status(404).json({ message: `Order with ID ${orderId} not found` });
      }
  
      // Fetch user untuk mengasosiasikan dengan field updated_by
      const user = await User.findByPk(updatedBy);
      if (!user) {
        return res.status(404).json({ message: `User with ID ${updatedBy} not found` });
      }
  
      // Fetch product untuk mengasosiasikan dengan field product_id
      if (product_id) {
        const product = await Product.findByPk(product_id);
        if (!product) {
          return res.status(404).json({ message: `Product with ID ${product_id} not found` });
        }
      }
  
      // Update atribut order
      order.product_id = product_id !== undefined ? product_id : order.product_id;
      order.amount = amount !== undefined ? amount : order.amount;
      order.rate = rate !== undefined ? rate : order.rate;
      order.status = status !== undefined ? status : order.status;
      order.return_date = return_date !== undefined ? return_date : order.return_date;
      order.loan_date = loan_date !== undefined ? loan_date : order.loan_date;
  
      // Simpan perubahan ke database
      await order.save();
  
      res.status(200).json({
        message: 'Order updated successfully',
        data: order,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while updating the order' });
    }
  };
  

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
};
