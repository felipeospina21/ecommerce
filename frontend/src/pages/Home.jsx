import React, { useEffect, useState } from "react"
import Navbar from "react-bootstrap/Navbar"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Product from "../components/Product"
import Col from "react-bootstrap/Col"
import Cart from "../components/Cart"

function Home() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    async function loadProducts() {
      const result = await fetch(`${import.meta.env.VITE_BASE_URL}/products`)
      const data = await result.json()
      setProducts(data)
    }
    loadProducts()
  }, [])

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">E-Commerce</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
        </Container>
      </Navbar>
      <Container className="mt-5">
        <Row>
          <Col sm={8}>
            <Row>
              <p>Productos</p>
              {products.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </Row>
          </Col>
          <Col sm={4}>
            <Cart />
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Home
