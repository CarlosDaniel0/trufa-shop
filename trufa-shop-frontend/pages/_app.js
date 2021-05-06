import 'tailwindcss/tailwind.css'
import { CartProvider } from '../components/CartContext'

const App = ({ Component, pageProps }) => {
  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  )
}

export default App
