const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    userEmail: String,
    itemId: String,
    itemName: String,
    itemPrice: String,
    // itemUrl : String,
    quantity: Number,
});

const CartItem = mongoose.model('CartItem', cartItemSchema);
module.exports = CartItem;
