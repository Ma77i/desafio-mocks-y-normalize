const faker = require("faker");
const moment = require("moment");
const mongoose = require("mongoose");
const { print } = require("../util");
const { schema, normalize, denormalize } = require("normalizr");

class Chatmg {
  constructor() {
    const chatSchema = new mongoose.Schema({
      author: {
        mail: String,
        name: String,
        surname: String,
        age: Number,
        alias: String,
        avatar: { type: String, default: faker.image.avatar() },
      },
      date: { type: String, default: moment().format("dddd, MMMM Do YYYY, h:mm:ss") },
      text: String,
    });
    this.model = mongoose.model("chats", chatSchema);
  }

  // CREAR CHAT
  async create(msg) {
    await this.model.create(msg);
  }

  // OBTENER CHAT
  async getAll() {
    return await this.model.find({});
  }

  async getNorm() {
    const author = new schema.Entity("authors", {}, { idAttribute: "mail" });
    const chat = new schema.Entity("chats", {
      author: author
    });

    const data = new schema.Entity("data", {
      chats: [chat]
    });

    const chatDB = await this.model.find({});

    const normalizedData = normalize({
        id: "chats",
        mensajes: chatDB.map((d)=>{
            return {
                author: d.author,
                text: d.text,
                date: d.date,
                id: d._id.toString(),
            }
        }),
      },
      data
    );
    //print(normalizedData);
    return normalizedData;
  }

  // OBTENER UN MENSAJE
  async getById(id) {
    let doc = await this.model.findOne({ _id: id });
    if (!doc) {
      throw new Error(`id ${id} no encontrado`);
    }
    return doc;
  }

  // BORRAR UN MENSAJE
  async deleteById(id) {
    try {
      await this.model.deleteOne({ _id: id });
      console.log("Mensaje borrado con exito");
    } catch {
      (err) => console.log(err);
    }
  }

  // BORRAR CHAT
  async deleteAll() {
    try {
      await this.model.deleteMany({});
      console.log("Se eliminaron todos los mensajes");
    } catch {
      (err) => console.log(err);
    }
  }
}

module.exports = new Chatmg();
