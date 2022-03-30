const express = require('express')
const { Router } = express;


const controller = require('../controllers/products')

const router = Router()


//GET PRODUCTS
router.get("", controller.get)

//SAVE PRODUCT
router.post("", controller.post)

//UPDATE PRODUCT
router.put("/:id", controller.put)

//GET PRODUCT BY ID
router.get("/:id", controller.getById) 

// DELETE PRODUCT BY ID
router.delete("/:id", controller.deleteProd)

//DELETE ALL 
router.delete("", controller.deleteAll)


module.exports = router