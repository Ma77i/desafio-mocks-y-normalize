const { Router } = require('express')
const path = require('path')
const auth = require('../middlewares/auth')
const router = new Router()

const controller = require("../controllers/products.js")
const Contenedor = require(path.join(__dirname, "../models/contenedor.js"));
const products = new Contenedor(path.join(__dirname, "../database/data.json"))


// renderizo la pagina principal desde handlebars
router.get('/', auth, (req, res) => {
    const { name } = req.session.user
    res.render('main', {name})
})

router.get('/login', (req, res) => res.render('login'))
router.post("/login", (req, res) => {
    const {username} = req.body

    req.session.user = {
        name: username
    }

    res.redirect("/")
})
router.get('/logout', auth, (req, res) => {
    const { name } = req.session.user
    req.session.destroy((err) => {
        if(err) {
            console.log(err);
            res.send(err)
            return
        }
        res.render('logout', {name})
    })
}) 

//guardo los datos agregados desde el formulario con method=post para mongo
router.post("", controller.post)

/* router.post('/', async (req, res) => {
    const save = await products.save(req.body)
    console.log(save)
    res.redirect("/")
}) */




module.exports = router