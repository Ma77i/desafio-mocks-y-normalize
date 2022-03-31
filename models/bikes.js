const knex = require('knex')
const path = require('path')
const fs = require('fs/promises');

class Bikes {
    constructor(){
        this.path = path.join(__dirname, '../database/data.json')
        this.db = knex({
            client: "mysql",
            connection: {
                host: "localhost",
                port: 3306,
                user: "root",
                password: "tangerine07",
                database: "bikes_db",
            }
        })
        this.dbMsj = knex({
            client: "sqlite",
            connection: {
                filename: "./bikes.sqlite"
            },
            useNullAsDefault: true,
        }) 
    }

    async loadData() {
        try {
            await this.db.schema.dropTableIfExists("bikes")
            await this.db.schema.createTable("bikes", (table)=>{
                table.increments("id")
                table.string("title")
                table.integer("price")
                table.string("thumbnail")
            })

            const raw = await fs.readFile(this.path, "utf8")
            const bikes = JSON.parse(raw)

            for (const bike of bikes) {
                await this.db("bikes").insert(bike)
            }
        } catch (e) {
            console.log(e)
            throw e
        }
    }

    async getAll() {
        const movies = await this.db("bikes")
        return movies
    }
    
    // async getByName(name = " ") {
    //     const movies = await this.db("movies").whereILike("name", `%${name}%`).orderBy("name")
    //     return movies
    // }

    async getById(id) {
        const bike = await this.db("bikes")
            .where({id})
            //.first()
        return bike
    }

    async update(id, body) {
        console.log(id, body)
        await this.db("bikes")
            .where({ id })
            .update(body)
    }

    async create(body) {
        const rs = await this.db("bikes").insert(body)
        return rs[0]
    }

    async delete(id) {
        const rs = await this.db("bikes")
            .where({ id })
            .del()
        return rs
    }


}


module.exports = new Bikes()