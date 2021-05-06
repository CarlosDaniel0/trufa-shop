import React from 'react'
import prismic from 'prismic-javascript'
import Header from '../components/Header'
import Product from '../components/Product'
import { useCart } from '../components/CartContext'
import Head from 'next/head'

const Index = (props) => {
  const cart = useCart()
  const { products } = props
  //const products = [1, 2, 3, 4, 5, 6]
  //console.log(props.products)
  return (
    <React.Fragment>
      <Head>
        <title>Trufa Shop</title>
      </Head>
      <Header />
      <div className=''>
        <main className='grid grid-flow-col grid-cols-3 mt-4'>
          {products.map((product) => {
            return <Product product={product} />
          })}
        </main>
      </div>
    </React.Fragment>
  )
}

export async function getServerSideProps({ res }) {
  const client = prismic.client('https://trufashop2.cdn.prismic.io/api/v2')
  const products = await client.query(
    prismic.Predicates.at('document.type', 'product')
  )
  return { props: { date: Date.now(), products: products.results } }
}

export default Index
