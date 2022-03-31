const { Router } = require('express')
const path = require('path')

const router = new Router()

const controller = require("../controllers/products.js")
const Contenedor = require(path.join(__dirname, "../models/contenedor.js"));
const products = new Contenedor(path.join(__dirname, "../database/data.json"))

// renderizo los productos en una tabla

/* router.get('/', async (req, res) => {
    const list = await products.getAll()
    res.render('main', {list})
}) */

// renderizo la pagina principal desde handlebars
router.get('/', (req, res) => {res.render('main')})


//guardo los datos agregados desde el formulario con method=post para mongo
router.post("", controller.post)

/* router.post('/', async (req, res) => {
    const save = await products.save(req.body)
    console.log(save)
    res.redirect("/")
}) */




module.exports = router