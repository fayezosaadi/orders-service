const express = require("express");
const router = express.Router();
const { checkInventoryLevels, updateInventoryItems, updateInventoryItem } = require("../queries/inventories");
const { getOrders, getOrder, createOrder, updateOrder, findOrderLineItem, calculateTotal } = require("../queries/orders");

/**
 * list all orders items
 */
router.get("/", async (req, res) => {
  try {
    const orders = await getOrders();
    res.status(200).send(orders);
  } catch ({ message }) {
    res.status(404).send(message);
  }
});

/**
 * get single order item
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const order = await getOrder({ id });
    res.status(200).send(order);
  } catch({ message }) {
    res.status(404).send(message);
  }
});

/**
 * create order item
 */
router.post("/", async (req, res) => {
  try {
    await checkInventoryLevels(req.body.lineItems);
    const total = await calculateTotal(req.body.lineItems);
    await createOrder({ params: { ...req.body, total } });
    await updateInventoryItems(req.body.lineItems, "deduct");

    res.status(201).send();
  } catch ({ message }) {
    return res.status(400).send(message);
  }
});

/**
 * update order item
 */
router.put("/:id", async (req, res) => {
  try {
    const [lineItems] = await findOrderLineItem({ _id: req.params.id, "lineItems._id": req.body._id });
    const { lineItems: [lineItem] } = lineItems;
    const delta = req.body.quantity - lineItem.quantity;

    if (delta > 0) await checkInventoryLevels([ { _id: lineItem._id, quantity: delta } ]);

    // update the order
    const query = { _id: req.params.id, "lineItems._id": req.body._id };
    const set = { $set: { "lineItems.$.quantity": req.body.quantity } };
    await updateOrder(query, set);

    // update the inventory
    await updateInventoryItem({ id: req.body._id, params: { $inc: { quantity: -delta } } });

    // update the order total
    const { lineItems: updatedLineItems } = await getOrder({ id: req.params.id });
    const total = await calculateTotal(updatedLineItems);
    await updateOrder({ _id: req.params.id }, { $set: { total } });

    return res.status(200).send();
  } catch ({ message }) {
    return res.status(400).send(message);
  }
});

/**
 * delete order item
 */
router.delete("/:id", async (req, res) => {
  try {
    await updateOrder({ _id: req.params.id }, { $set: { status: "cancelled" } });
    const { lineItems } = await getOrder({ id: req.params.id });
    await updateInventoryItems(lineItems, "add");

    res.status(200).send();
  } catch ({ message }) {
    res.status(400).send({ message });
  }
});

module.exports = router;
