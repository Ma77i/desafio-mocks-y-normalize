const faker = require("faker");
const moment = require('moment');
const mongoose = require('mongoose');
const { create } = require('./chatSQLite');
const { schema, nomalizr } = require('normalizr')

class Chatmg {
    constructor() {
        const chatSchema = new mongoose.Schema({
            author: {
                mail: String,
                name: { type: String, default: faker.name.findName()},                
                surname: {type: String, default: faker.name.lastName()},
                age: {type: Number, default: faker.datatype.number()},
                alias: {type: String, default: faker.internet.userName()},
                avatar: {type: String, default: faker.image.avatar()}
            },
            date: { type: String, default: moment().format('dddd, MMMM Do YYYY, h:mm:ss') },
            text: String
        })
        this.model = mongoose.model("chats", chatSchema)
    }

// CREAR CHAT
    async create (msg) {
        await this.model.create(msg)
    }

// OBTENER CHAT
    async getAll() {
        //const author = new schema.Entity("authors", {}, { idAttribute: email })
        return await this.model.find()
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
            await this.model.deleteOne({ _id: id, });
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

module.exports = new Chatmg