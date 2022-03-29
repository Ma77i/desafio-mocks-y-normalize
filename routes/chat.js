const { Router } = require("express")

const controller = require("../controllers/chat")
//const ChatDB = require("../models/chatSQLite")
const router = Router()


// MONGO
router.get("", controller.get)
router.post("", controller.post)
router.get("/:id", controller.getById)
router.delete("/:id", controller.deleteById)
router.delete("", controller.deleteAll)


















/* 
router.get("/", async (req, res) => {
    const chat = await ChatDB.getAll()
    res.send(chat)
})


router.get("/:id", async (req, res) => {
    const { id } = req.params
    const byId = await ChatDB.getById(id)
    res.send(byId)
})

router.put("/:id", async (req, res) => {
    const { id } = req.params
    const { body } = req

    await ChatDB.update(id, body)
    res.sendStatus(200)
})

router.post("/", async (req, res) => {
    const { body } = req
    const id = await ChatDB.create(body)
    res.status(201).send({ id })

})


router.delete("/:id", async (req, res) => {
    const { id } = req.params
    const del = await Bikes.delete(id)
    console.log(del);
    res.sendStatus(200)
}) */

module.exports = router