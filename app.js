const express = require('express');
const http = require('http')
const mongoose = require('mongoose');
const path = require('path')
const { Server } = require('socket.io')

const cookieParser = require('cookie-parser')
const session = require('express-session')


// session store
const MongoStore = require("connect-mongo")
const { mongoConfig } = require("./config")
//const FileStore = require('session-file-store')


// websocket
const app = express();
const server = http.createServer(app)
const io = new Server(server)

const { HOSTNAME, SCHEMA, OPTIONS, DATABASE, USER, PASSWORD} = mongoConfig

// Models
const chatModel = require("./models/mongoChat")
const prodModel = require("./models/mongoProd")


// Mongoose connection
mongoose.connect(`${SCHEMA}://${USER}:${PASSWORD}@${HOSTNAME}/${DATABASE}?${OPTIONS}`).then(()=>{
    console.log("Connected to mongoose");

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use("/static", express.static(path.join(__dirname, "public")))
    app.use(cookieParser("This is a secret"))
    app.use(session({
        secret: "secret",
        resave: true,
        saveUninitialized: true,
        
        store: new MongoStore({
            mongoUrl: `${SCHEMA}://${USER}:${PASSWORD}@${HOSTNAME}/${DATABASE}?${OPTIONS}`,
            ttl: 1 * 60,
            expire: 1000 * 1 * 60,
            autoRemove: "native"
        })
        //     store: new FileStore({
        //     path: path.join(__dirname, "./session"),
        //     ttl: 60,
        //     reapInterval: 60,
        //     retires: 0
        // })
    }))
    
    
    
    // Socket connection
    io.on('connection', async (socket) => {
        console.log((`an user connected ${socket.id}`))
        
        //obtengo los productos y los envio por socket emit
        const list = await prodModel.getAll()
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
        
        })
        
        
        // routers
        const bikeRouter = require("./routes/bikes")
        const chatRouter = require("./routes/chat")
        const homeRouter = require('./routes/home')
        const prodTestRouter = require("./routes/product-test")
        
        app.use("/api/bikes", bikeRouter)
        app.use("/api/chat", chatRouter)
        app.use("/", homeRouter)
        app.use("/api/product-test", prodTestRouter)
        
        
    
    
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