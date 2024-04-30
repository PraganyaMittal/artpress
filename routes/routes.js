const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/authenticate')
const CartItem = require('../models/cart.js')




router.get('/signup', (req, res) => {
    res.render('signup', { session: req.session });
})

// Routes
router.get('/', isLoggedIn, (req, res) => {
    res.render('index', { session: req.session });
});

router.get('/shop/:pageId', isLoggedIn, (req, res) => {
    const pageId = parseInt(req.params.pageId);

    let pagePath;
    switch (pageId) {
        case 1:
            pagePath = 'shop1';
            break;
        case 2:
            pagePath = 'shop2';
            break;
        case 3:
            pagePath = 'shop3';
            break;
        case 4:
            pagePath = 'shop4';
        default:
            return res.status(404).send("404 Not Found");
    }

    res.render(pagePath, { session: req.session });
});

router.get('/login', (req, res) => {
    res.render('login', { session: req.session });
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.redirect('/login');
        }
    });
});

router.get('/cart', isLoggedIn, async (req, res) => {
    try {
        // Query MongoDB to get all cart items
        const cartItems = await CartItem.find();
        res.render('cart', { cartItems, session: req.session });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching cart items');
    }
});

router.post('/book/:orderId', isLoggedIn, (req, res) => {
    const orderId = req.params.orderId;
    // Respond with a success message
    res.status(200).json({ message: 'Payment received and order updated successfully' });
  });

router.get('/book/:uniqueId', isLoggedIn, (req, res) => {
    const uniqueId = req.params.uniqueId;
    // Here you can use the uniqueId to process the request, such as saving it to a database, etc.
    res.render('book', {session: req.session, uniqueId: uniqueId})
    console.log('Received POST request for uniqueId:', uniqueId);
    // Respond with a success message
    res.status(200).json({ message: 'Received POST request for uniqueId' });
  });

router.post('/update-cart/:itemId', isLoggedIn, (req, res) => {
    const itemId = req.params.itemId;
    const { quantity } = req.body;


    CartItem.findByIdAndUpdate(itemId, { quantity: quantity }, { new: true })
        .then(updatedItem => {
            // If the item was not found
            if (!updatedItem) {
                return res.status(404).json({ error: 'Item not found' });
            }
            // Send the updated item as a response
            res.json(updatedItem);
        })
        .catch(error => {
            // Handle any errors that occur during the update process
            console.error('Error updating cart item:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

router.post('/add-to-cart', isLoggedIn, async (req, res) => {
    const { userEmail, itemId, itemName, itemPrice, quantity } = req.body;

    try {
        let existingCartItem = await CartItem.findOne({ itemId });
        if (existingCartItem) {
            existingCartItem.quantity += parseInt(quantity);
            await existingCartItem.save();
        } else {
            await CartItem.create({ userEmail, itemId, itemName, itemPrice, quantity });
        }
        res.send('Item added to cart successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding item to cart');
    }
});

module.exports = router;
