const fs = require('fs').promises;


class Contenedor {
    constructor(path) {
        this.path = path
        this.list = []
    }


    //: Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
    async save(prod) {
        const txt = await fs.readFile(this.path, 'utf-8');
        const data = JSON.parse(txt);
        const last = data[data.length - 1]
        data.push({
            id: last.id +1,
            ...prod
        })

        await fs.writeFile(this.path, JSON.stringify(data, null, 2), "utf8")
        return last + 1
    }

    
    //: Object - Recibe un id y devuelve el objeto con ese id, o null si no está.
    async getById(id) {
        const prods = await this.getAll()
        const result = prods.find(item=>item.id == id)
        //console.log(result);
        return result
    }


    //: Object[] - Devuelve un array con los objetos presentes en el archivo.
    async getAll() {
        const products = await fs.readFile(this.path, 'utf-8')
        const allProds = JSON.parse(products)
        //console.log(allProds);
        this.list.push(allProds)
        return this.list[0]
    }


    async updateById(id, obj){

        const prod = await this.getAll();
        const index = prod.findIndex(p => p.id == id);
        prod[index].title = obj.title;
        prod[index].price = obj.price;
        prod[index].thumbnail = obj.thumbnail;

        await fs.writeFile(this.path, JSON.stringify(prod, null, 2), "utf8")
        
    }


    //: void - Elimina del archivo el objeto con el id buscado.
    async deleteById(id) {
        const p = await this.getAll()
        const r = p.filter(i => i.id != id);
        console.log(r);
        await fs.writeFile(this.path, JSON.stringify(r, null, 2))
        return r
    }


    //: void - Elimina todos los objetos presentes en el archivo.
    async deleteAll(){

        const p = await this.getAll()
        const r = []
        await fs.writeFile(this.path, JSON.stringify(r, null, 2))
        return r
    }
}












module.exports = Contenedor
