import React from 'react'
import Cart from '../icons/Cart'
import { useCart } from '../CartContext'

const Product = ({ product }) => {
  const cart = useCart()
  const add = (product) => () => {
    cart.addToCart(product)
  }
  return (
    <section class='m-1 flex flex-col md:flex-row py-10 px-5 bg-white rounded-md shadow-lg'>
      <div class='text-indigo-500 flex flex-col justify-between'>
        <img src={product.data.image.url} alt='' />
        <div></div>
      </div>
      <div class='text-indigo-500'>
        <small class='uppercase'>TRUFADOS</small>
        <h3 class='uppercase text-black text-2xl font-medium'>
          {product.data.name}
        </h3>
        <h3 class='text-2xl font-semibold mb-7'>{product.data.price}</h3>
        <div class='flex gap-0.5 mt-4'>
          <button
            id='addToCartButton'
            class='bg-indigo-600 hover:bg-indigo-500 focus:outline-none transition text-white uppercase px-8 py-3'
            onClick={add(product)}
          >
            <Cart />
          </button>
        </div>
      </div>
    </section>
  )
}

export default Product
