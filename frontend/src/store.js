import { createStore } from "redux"
import { composeWithDevTools } from "@redux-devtools/extension"

function reducer(state = { cart: [] }, action) {
  if (action.type === "ADD_TO_CART") {
    return { ...state, cart: state.cart.concat(action.payload) }
  } else {
    return state
  }
}

export default createStore(reducer, composeWithDevTools())
