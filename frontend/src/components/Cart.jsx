import { Button } from "react-bootstrap"
import Card from "react-bootstrap/Card"
import ListGroup from "react-bootstrap/ListGroup"
import { useSelector } from "react-redux"
import { useMercadopago } from "react-sdk-mercadopago"

function Cart() {
  const mercadopago = useMercadopago.v2("TEST-b56a824b-5778-430f-914a-6ea5907420f4", {
    locale: "es-CO",
  })
  const products = useSelector((state) => state.cart)
  const total = products.reduce((sum, p) => sum + p.price, 0)

  async function pay() {
    const response = fetch(`${import.meta.env.VITE_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(products.map((p) => p._id)),
    })
      .then((res) => res.json())
      .then((data) => {
        const checkout = mercadopago.checkout({
          preference: {
            id: data.preferenceId,
          },
          autoOpen: true,
        })
      })

    alert("Orden creada!")
  }

  return (
    <Card style={{ width: "18rem" }}>
      <Card.Header>Carro de Compras</Card.Header>
      <ListGroup variant="flush">
        {products.map((product) => (
          <ListGroup.Item key={`cart-${product._id}`} className="d-flex justify-content-between">
            {product.name}
            <span>${product.price}</span>
          </ListGroup.Item>
        ))}
        <ListGroup.Item>
          <div className="d-flex justify-content-between fw-bold">
            Total: <span>${total}</span>
          </div>
          {total > 0 ? (
            <div className="text-center mt-3">
              <Button variant="primary" onClick={pay}>
                Ir a Pagar
              </Button>
            </div>
          ) : null}
        </ListGroup.Item>
      </ListGroup>
    </Card>
  )
}

export default Cart
