const express = require('express');
const http = require('http')
const mongoose = require('mongoose');
const path = require('path')
const { Server } = require('socket.io')

const app = express();
const server = http.createServer(app)
const io = new Server(server)


// const Bikes = require("./model/bikes")
// const ChatDB = require("./model/chatSQLite")

const { HOSTNAME, SCHEMA, OPTIONS, DATABASE, USER, PASSWORD} = require('./config')
const chatModel = require("./models/mongoChat")

const Contenedor = require(path.join(__dirname, "/models/contenedor.js"));
const products = new Contenedor(path.join(__dirname, "/database/data.json"))

const Chat = require(path.join(__dirname, "/models/chat.js"));
const chats = new Chat(path.join(__dirname, "/database/chat.json"))

/* 
try {
    Bikes.loadData()
    ChatDB.loadData()
    console.log("se creo la tabla");
} catch (e) {
    console.log(e)
    console.log("could not start servers")
}
 */
mongoose.connect(`${SCHEMA}://${USER}:${PASSWORD}@${HOSTNAME}/${DATABASE}?${OPTIONS}`).then(()=>{
    console.log("Connected to mongoose");

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use("/static", express.static(path.join(__dirname, "public")))
    
    
    const bikeRouter = require("./routes/bikes")
    const chatRouter = require("./routes/chat")
    const homeRouter = require('./routes/home')
    const prodTestRouter = require("./routes/product-test")
    
    app.use("/api/bikes", bikeRouter)
    app.use("/api/chat", chatRouter)
    app.use("/", homeRouter)
    app.use("/api/product-test", prodTestRouter)
    
    
    //---------SOCKET
    io.on('connection', async (socket) => {
        console.log((`an user connected ${socket.id}`))

        //obtengo los productos y los envio por socket emit
        const list = await products.getAll()
        socket.emit("prods", list)
        
        //leo el mensaje nuevo y lo guardo en la base de datos
        socket.on("newMsj", async data => {
            const msj = await chatModel.create(data)
            return msj
        })
        
        //obtengo los mensajes y los envio por socket emit
        const msjs = await chatModel.getAll()
        io.sockets.emit("msjs", msjs)

        //obtengo los mensajes normalizados 
        const norm = await chatModel.getNorm()
        socket.emit("msNorm", norm)
        



        // socket.on("newMsj", async data => {
        //     const msj = await chats.save(data)
        //     console.log(msj)
        // })

        //const msjs = await chats.getAll()
        //io.sockets.emit("msjs", msjs)
    })
    
    
    
    
    
    //-------- HANDLEBARS
    
    //engine
    const { engine } = require('express-handlebars')
    
    app.engine("handlebars", engine({
        layoutsDir: path.join(__dirname, "views/layout"),
        defaultLayout: 'index'
    }))
    app.set("view engine", "handlebars")
    
    
    server.listen(8080, () => console.log(`Server running on http://localhost:8080`))
    server.on('err', (err) => console.log(`Error: ${err}`))
})
.catch((err)=>console.log("Error on mongo: ", err))