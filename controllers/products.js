const productModel = require('../models/mongoProd')

module.exports = {
  
  
  get: async (req, res) => {
    const { orderBy, search } = req.query
    try {
      const products = await productModel.getAll(orderBy, search)
      res.status(201).send(products)
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  },
  
  getById: async(req, res) => {
    const { id } = req.params
    console.log("objectID: ", id);
    try {
      const getId = await productModel.getById(id)
      res.status(200).send(getId)
      
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  },
  
  put: async (req, res) => {
    const { body } = req
    const { id } = req.params
    console.log(id, body);
    try {
      const up = await productModel.updateById(id, body)
      res.status(201).send(up)
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  },
  
  post: async (req, res) => {
    const {body} = req
    try {
      const product = await productModel.create(body)
      res.status(201).send(product)
      res.redirect('/')
    } catch (error) {
      console.log(error)
    }
  },
  
  deleteProd: async(req, res) => {
    const { id } = req.params
    try {
      const dlt = await productModel.deleteById(id)
      res.status(200).send("Product deleted")
  
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  },
  
  deleteAll: async(req, res) => {
    const delAll = await productModel.deleteAll()
    res.status(200).send(delAll)
  }
}