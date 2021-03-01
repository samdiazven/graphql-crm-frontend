import {useContext, useState} from 'react'
import {useMutation, gql} from '@apollo/client'
import {Layout } from '../components/Layout'
import AddClient from '../components/orders/AddClient';
import AddProducts from '../components/orders/AddProducts';
import OrderSummary from '../components/orders/OrderSummary';
import Total from '../components/orders/Total';
import OrderContext from '../context/orders/ContextOrders'
import Swal from 'sweetalert2'
import {useRouter} from 'next/router'

const NEW_ORDER = gql`
	mutation newOrder($input: OrderInput) {
	  newOrder(input: $input) {
        id
        created
        client {
          id
          name
          lastname
          tlf
          email
        }
        status
        seller
        order {
          price
          id
          quantity
          name
        }
        total
	  }
	}
`;

const GET_PRODUCTS = gql`
	query getProducts {
		getProducts {
			name
			id
			price
			stock
		}
	}
`;
const ORDERS_BY_SELLER = gql`
    
    query getOrdersBySeller {
      getOrdersBySeller {
        id
        created
        client {
          id
          name
          lastname
          tlf
          email
        }
        status
        seller
        order {
          price
          id
          quantity
          name
        }
        total
      }
    }

`;
export default function NewOrder() {

	const [message, setMessage] = useState(null)
	const router = useRouter()

	const {total, products, client} = useContext(OrderContext)


	const [newOrder] = useMutation(NEW_ORDER, {
		update(cache, {data:{newOrder}}) {
			const {getOrdersBySeller} = cache.readQuery({query: ORDERS_BY_SELLER})


			cache.writeQuery({
				query: ORDERS_BY_SELLER,
				data: {
					getOrdersBySeller: [...getOrdersBySeller, newOrder]
				}
			})
		}
	});

	const validateOrder = () => {

		let classname;

		if(products.every(p => p.quantity === 0) || total === 0  || Object.entries(client).length === 0)  {

			classname = "opacity-50 cursor-not-allowed "
		}else {
			classname = ""
		}
		return classname

	}

	const createOrder = async () => {

		const order = products.map( ({__typename, stock, ...product}) => product);

		try {

			const {data} = await newOrder({
				variables: {
					input: {
						client: client.id,
						total,
						order 
					}

				}
			})

			Swal.fire(
				"EXITO",
				"Pedido guardado correctamente",
				"success"
			)
			console.log(data)

			router.push('/orders')

		}catch(error) {

			setMessage(error.message)

			setTimeout(() => setMessage(null), 3000)

			console.log(error)
		}

	}
	const showMessage = () => {
	    return(
	      <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto"> 
	          <p className="font-bold"> {message} </p>
	      </div>
	    )
    }
  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light"> Crear Nuevo Pedido </h1>

        {message && showMessage()}
        <div className="flex justify-center mt-5">
        	<div className="w-full max-w-lg">
	        	<AddClient />
		        <AddProducts />
		        <OrderSummary />
		        <Total />
		        <button className={`bg-gray-800 w-full p-2 mt-5 text-white hover:bg-gray-900 uppercase font-bold ${validateOrder()}`} onClick={() => createOrder()}>
		        	Agregar Pedido
		        </button>
        	</div>
        </div>
      </Layout>
    </div>
  )
}