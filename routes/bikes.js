const { Router } = require("express")
const Bikes = require("../models/bikes")
const router = Router()

router.get("/", async (req, res) => {
    const bikes = await Bikes.getAll()
    res.send(bikes)
})

router.get("/", async (req, res) => {
    const { name } = req.query
    console.log(name);
    const bikes = await Bikes.getByName(name)
    res.send(bikes)
})

router.get("/:id", async (req, res) => {
    const {
        id
    } = req.params
    const bikesById = await Bikes.getById(id)
    res.send(bikesById)
})

router.put("/:id", async (req, res) => {
    const {
        id
    } = req.params
    const {
        body
    } = req

    await Bikes.update(id, body)

    res.sendStatus(200)
})

router.post("/", async (req, res) => {
    const { body } = req

    const id = await Bikes.create(body)
    res.status(201).send({ id })

})
router.delete("/:id", async (req, res) => {
    const { id } = req.params
    const del = await Bikes.delete(id)
    console.log(del);
    res.sendStatus(200)
})

module.exports = router