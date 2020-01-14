const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schemaFields = {
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
};

const inventorySchema = new Schema(schemaFields, { timestamps: true });

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = { Inventory };
