const models = require("../models");
const { getInventoryItem } = require("./inventories");

const getOrders = async () =>  models.Order.find();
const getOrder = async ({ id }) => models.Order.findById(id);
const findOrderLineItem = async (query) => models.Order.find(query, { _id: 0, 'lineItems.$': 1 });
const updateOrder = async (query, set) => models.Order.updateOne(query, set);
const createOrder = async ({ params }) => models.Order.create(params);
const calculateTotal = async (lineItems) => {
  let total = 0;

  for (const item of lineItems) {
    const { price } = await getInventoryItem({ id: item._id });
    total += (price * item.quantity)
  }

  return total
};

module.exports = { getOrders, getOrder, createOrder, updateOrder, findOrderLineItem, calculateTotal };
