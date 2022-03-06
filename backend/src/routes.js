import express from "express"
import mongoose from "mongoose"
import Product from "./models/product.js"
import Order from "./models/order.js"
import mercadopago from "mercadopago"

mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_SAMPLE_ACCESS_TOKEN,
})

const router = express.Router()

router.get("/products", async (req, res, next) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (e) {
    next(e)
  }
})

router.post("/products", async (req, res, next) => {
  try {
    const { name, description, price, image } = req.body
    const product = await Product.create({ name, description, price, image })
    res.json(product)
  } catch (e) {
    next(e)
  }
})

router.post("/orders", async (req, res) => {
  const products = req.body
  try {
    for (let i = 0; i < products.length; i++) {
      products[i] = await Product.findById(new mongoose.Types.ObjectId(products[i])).lean()
    }
    const order = await Order.create({ products })
    const items = products.map((p) => ({ title: p.name, unit_price: p.price, quantity: 1 }))

    const preference = {
      items,
      back_urls: {
        success: "http://localhost:3000/mercadopago/success",
        failure: "http://localhost:3000/mercadopago/failure",
        pending: "http://localhost:3000/mercadopago/pending",
      },
      external_reference: order._id.toString(),
    }

    // crear la preferencia de MercadoPago
    const { response } = await mercadopago.preferences.create(preference)
    res.status(200).json({ preferenceId: response.id })
  } catch (e) {
    console.log(e)
    res.json(e)
  }
})

router.get("/orders", async (req, res) => {
  try {
    const result = await Order.find()
    res.status(200).json(result)
  } catch (error) {
    res.status(400).json({ error })
  }
})

export default router
