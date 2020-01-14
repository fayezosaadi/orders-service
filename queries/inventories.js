const models = require("../models");

const getInventoryItems = async () =>  models.Inventory.find();
const getInventoryItem = async ({ id }) => models.Inventory.findById(id);
const createInventoryItem = async ({ params }) => models.Inventory.create(params);
const updateInventoryItem = async ({ id, params }) => models.Inventory.findByIdAndUpdate(id, params);
const deleteInventoryItem = async ({ id }) => models.Inventory.findByIdAndDelete(id);
const updateInventoryItems = async (lineItems, type = "deduct") => {
  for (const item of lineItems) {
    await updateInventoryItem({ id: item._id, params: { $inc: { quantity: type === "add" ? item.quantity : -item.quantity} } })
  }
};
const checkInventoryLevels = async (lineItems) => {
  for (const item of lineItems) {
    const inventory = await getInventoryItem({ id: item._id });
    if (item.quantity > inventory.quantity) throw new Error(`Not Enough Inventory for ${inventory.name}`)
  }
};

module.exports = {
  getInventoryItems,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  checkInventoryLevels,
  updateInventoryItems
};
