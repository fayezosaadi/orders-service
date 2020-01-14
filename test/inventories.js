const chai = require("chai");
const server = require("../app.js");
const { expect } = require("chai");
const chaiHttp = require("chai-http");
const { Inventory } = require("../models");

chai.should();
chai.use(chaiHttp);

const payload = { name: "item-1", quantity: 3, description: "item description", price: 10 };
const payloadUpdate = { price: 20, quantity: 5 };
let inventoryId;

describe("Inventories", () => {
  after(() => Inventory.collection.drop());

  describe("/POST inventories", () => {
    it("it should not CREATE an inventory with bad name field", done => {
      chai
        .request(server)
        .post("/inventories")
        .send({ ...payload, name: ""})
        .end((err, res) => {
          res.should.have.status(400);
          res.text.should.equal("Inventory validation failed: name: Path `name` is required.");
          done();
        });
    });

    it("it should CREATE an inventory", done => {
      chai
        .request(server)
        .post("/inventories")
        .send(payload)
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
    });
  });

  describe("/GET inventories", () => {
    it("it should GET all the inventories", done => {
      chai
        .request(server)
        .get("/inventories")
        .end((err, res) => {
          const inventories = res.body;
          inventoryId = inventories[0]._id;
          res.should.have.status(200);
          inventories.should.be.a("array");
          expect(inventories[0].name).to.eq(payload.name);
          expect(inventories[0].description).to.eq(payload.description);
          expect(inventories[0].price).to.eq(payload.price);
          expect(inventories[0].quantity).to.eq(payload.quantity);
          done();
        });
    });
  });

  describe("/PUT inventories", () => {
    it("it should UPDATE an inventory", done => {
      chai
        .request(server)
        .put(`/inventories/${inventoryId}`)
        .send(payloadUpdate)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe("/GET inventory", () => {
    it("it should GET a single inventory", done => {
      chai
        .request(server)
        .get(`/inventories/${inventoryId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("price").eq(payloadUpdate.price);
          res.body.should.have.property("quantity").eq(payloadUpdate.quantity);
          done();
        });
    });
  });

  describe("/DELETE inventories", () => {
    it("it should DELETE inventory", done => {
      chai
        .request(server)
        .delete(`/inventories/${inventoryId}`)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

});
