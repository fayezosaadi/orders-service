const express = require("express");
const router = express.Router();
const {
  getInventoryItems,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} = require("../queries/inventories");

/**
 * list all inventory items
 */
router.get("/", async (req, res) => {
  try {
    const items = await getInventoryItems();
    res.status(200).send(items);
  } catch ({ message }) {
    res.status(404).send(message);
  }
});

/**
 * get single inventory item
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const item = await getInventoryItem({ id });
    res.status(200).send(item);
  } catch({ message }) {
    res.status(404).send(message);
  }
});

/**
 * create inventory item
 */
router.post("/", async (req, res) => {
  try {
    await createInventoryItem({ params: req.body });
    res.status(201).send();
  } catch ({ message }) {
    return res.status(400).send(message);
  }
});

/**
 * update inventory item
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await updateInventoryItem({ id, params: req.body });
    return res.status(200).send();
  } catch ({ message }) {
    return res.status(400).send(message);
  }
});

/**
 * delete inventory item
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await deleteInventoryItem({ id });
    res.status(200).send();
  } catch ({ message }) {
    res.status(400).send(message);
  }
});

module.exports = router;
