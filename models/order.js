const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schemaFields = {
  email: { type: String, required: true },
  status: { type: String, required: true, default: "pending" },
  lineItems: [ { _id: { type: Schema.Types.ObjectId, ref: 'Inventory', required: true }, quantity: { type: Number, required: true } } ],
  total: { type: Number, required: true }
};

const orderSchema = new Schema(schemaFields, { timestamps: true });

orderSchema.path('lineItems').validate(async (lineItems) => lineItems.length !== 0, 'Order needs to have at least one item');

const Order = mongoose.model('Order', orderSchema);

module.exports = { Order };
