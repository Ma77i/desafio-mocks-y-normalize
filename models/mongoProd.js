const faker = require("faker");
const mongoose = require("mongoose");

class Product {
  constructor() {
      const schema = new mongoose.Schema({
          title: { type: String, default: faker.vehicle.bicycle() },
          description: { type: String, default: faker.commerce.productDescription() },
          price: { type: Number, default: faker.commerce.price(100, 5000) },
          stock: { type: Number, default: 0,},
          code: { type: String, default: faker.vehicle.vin()},
          thumbnail: { type: String, default: faker.image.sports()},
          timestamp: { type: Number, default: Date.now(),
          },
      });

      this.model = mongoose.model("productos2", schema);
  }

  // CREAR UN PRODUCTO
  async create(obj) {
      try {
          await this.model.create(obj);
          console.log("Producto creado con exito");
      } catch {
          (err) => console.log(err);
      }
  }

  // OBTENER TODOS LOS PRODUCTOS
  async getAll(orderBy = "", search = "") {
      let products = [];
      let find = search ?
          {
              title: {
                  $regex: search,
                  $options: "i",
              },
          } :
          {};
      if (orderBy) {
          const ord = {};
          ord[orderBy] = 1;
          products = await this.model.find(find).sort(ord);
      } else {
          products = await this.model.find(find);
      }
      //console.log(products)
      return products;
  }

  // OBTENER UN PRODUCTO
  async getById(id) {
      let doc = await this.model.findOne({ _id: id });
      console.log("object", doc);
      if (!doc) {
          throw new Error(`id ${id} no encontrado`);
      }
      return doc;
  }

  // ACTUALIZAR UN PRODUCTO
  async updateById(id, obj) {
      try {
          await this.model.updateOne({ _id: id, }, { $set: obj, });
          console.log("Producto actualizado con exito");
      } catch {
          (err) => console.log(err);
      }
  }

  // BORRAR UN PRODUCTO
  async deleteById(id) {
      try {
          await this.model.deleteOne({ _id: id, });
          console.log("Producto borrado con exito");
      } catch {
          (err) => console.log(err);
      }
  }

  // BORRAR TODO
  async deleteAll() {
      try {
          await this.model.deleteMany({});
          console.log("Se eliminaron todos los objetos");
      } catch {
          (err) => console.log(err);
      }
  }
}

module.exports = new Product();