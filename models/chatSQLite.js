const knex = require('knex')
const path = require('path')
const fs = require('fs/promises');

class ChatDB {
    constructor(){
        this.path = path.join(__dirname, '../database/chat.json')
        this.db = knex({
            client: "sqlite",
            connection: {
                filename: "./chat.sqlite"
            },
            useNullAsDefault: true,
        }) 
    }

    async loadData() {
        try {
            await this.db.schema.dropTableIfExists("chat")
            await this.db.schema.createTable("chat", (table)=>{
                table.increments("id")
                table.string("mail")
                table.integer("date")
                table.string("mensaje")
            })

            const raw = await fs.readFile(this.path, "utf8")
            const chats = JSON.parse(raw)

            for (const chat of chats) {
                //console.log(chat);
                await this.db("chat").insert(chat)
            }
        } catch (e) {
            console.log(e)
            throw e
        }
    }

    async getAll() {
        const msj = await this.db("chat")
        return msj
    }
    
    async getById(id) {
        const chat = await this.db("chat")
            .where({id})
            //.first()
        return chat
    }

    async update(id, body) {
        console.log(id, body)
        await this.db("chat")
            .where({ id })
            .update(body)
    }

    async create(body) {
        const rs = await this.db("chat").insert(body)
        return rs[0]
    }

    async delete(id) {
        const rs = await this.db("chat")
            .where({ id })
            .del()
        return rs
    }


}


module.exports = new ChatDB()