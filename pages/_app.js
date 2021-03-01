import "tailwindcss/tailwind.css";
import { ApolloProvider } from '@apollo/client'
import OrdersProvider from '../context/orders/StateOrders'
import client from '../config/apollo'

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
    	<OrdersProvider>
		    <Component {...pageProps} />
		</OrdersProvider>
    </ApolloProvider>
  )
}

export default MyApp
