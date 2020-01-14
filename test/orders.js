const chai = require("chai");
const server = require("../app.js");
const { expect } = require("chai");
const chaiHttp = require("chai-http");
const { Order, Inventory } = require("../models");
const { getOrder } = require("../queries/orders");
const { createInventoryItem, getInventoryItems, getInventoryItem } = require("../queries/inventories");
const mongoose = require("mongoose");

chai.should();
chai.use(chaiHttp);

const inventoryPayload = { name: "item-1", description: "item description", quantity: 3, price: 10 };
let inventoryId;
let orderId;

describe("Orders", () => {
  before(async () => {
    await createInventoryItem({ params: inventoryPayload });
    const [{ _id }] = await getInventoryItems();
    inventoryId = _id
  });

  after(async () => {
    await Inventory.collection.drop();
    await Order.collection.drop();
  });

  describe("/POST orders", () => {
    it("it should not CREATE order if not enough inventory", done => {
      payload = { email: "user@treez.com", lineItems: [{ "_id": inventoryId, quantity: 10 }] };
      chai
        .request(server)
        .post("/orders")
        .send(payload)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

    it("it should CREATE an order and update inventory", done => {
      const payload = { email: "user@treez.com", quantity: 3, lineItems: [{ "_id": inventoryId, "quantity": 2 }] };
      chai
        .request(server)
        .post("/orders")
        .send(payload)
        .end(async (err, res) => {
          res.should.have.status(201);
          const inventoryItem = await getInventoryItem({ id: inventoryId });
          expect(inventoryItem.quantity).to.eq(1);
          done();
        });
    });
  });

  describe("/GET orders", () => {
    it("it should GET all the orders", () => {
      chai
        .request(server)
        .get("/orders")
        .end((err, res) => {
          const orders = res.body;
          res.should.have.status(200);
          orderId = orders[0]._id;
          orders.should.be.a("array");
          expect(orders[0].email).to.eq(payload.email);
          expect(mongoose.Types.ObjectId(orders[0].lineItems[0]._id)).to.deep.eq(mongoose.Types.ObjectId(inventoryId));
          expect(orders[0].lineItems[0].quantity).to.eq(2);
          expect(orders[0].status).to.eq("pending");
          expect(orders[0].total).to.eq(inventoryPayload.price * orders[0].lineItems[0].quantity);
        });
    });
  });

  describe("/PUT orders", () => {
    it("it should not UPDATE order if not enough inventory", () => {
      const payload = { _id: inventoryId, quantity: 4 };
      chai
        .request(server)
        .put(`/orders/${orderId}`)
        .send(payload)
        .end((err, res) => {
          res.should.have.status(400);
        });
    });

    it("it should UPDATE order and inventory", done => {
      const payload = { _id: inventoryId, quantity: 3 };
      chai
        .request(server)
        .put(`/orders/${orderId}`)
        .send(payload)
        .end(async (err, res) => {
          res.should.have.status(200);
          const inventoryItem = await getInventoryItem({ id: inventoryId });
          expect(inventoryItem.quantity).to.eq(0);
          done();
        });
    });
  });

  describe("/GET order", () => {
    it("it should GET a single order", done => {
      chai
        .request(server)
        .get(`/orders/${orderId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("_id").eq(orderId);
          res.body.should.have.property("email").eq("user@treez.com");
          res.body.should.have.property("status").eq("pending");
          expect(res.body.lineItems[0].quantity).to.eq(3);
          expect(mongoose.Types.ObjectId(res.body.lineItems[0]._id)).to.deep.eq(mongoose.Types.ObjectId(inventoryId));
          res.body.should.have.property("total").eq(inventoryPayload.price * res.body.lineItems[0].quantity);
          done();
        });
    });
  });

  describe("/DELETE orders", () => {
    it("it should DELETE order", done => {
      chai
        .request(server)
        .delete(`/orders/${orderId}`)
        .end(async (err, res) => {
          res.should.have.status(200);
          const order = await getOrder({ id: orderId });
          expect(order.status).to.eq("cancelled");
          done();
        });
    });
  });
});
