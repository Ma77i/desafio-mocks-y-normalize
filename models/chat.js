const fs = require('fs').promises;

class Chat {
    constructor(path) {
        this.path = path
        this.list = []
    }

    async save(msj) {
        const txt = await fs.readFile(this.path, 'utf-8');
        const chat = JSON.parse(txt);
        chat.push({
            ...msj
        })

        await fs.writeFile(this.path, JSON.stringify(chat, null, 2), "utf8")
    }

    async getAll() {
        const chat = await fs.readFile(this.path, 'utf-8')
        const allChats = JSON.parse(chat)
        //console.log(allProds);
        this.list.push(allChats)
        return this.list[0]
    }
}

module.exports = Chat