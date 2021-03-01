import {useState, useContext, useEffect} from 'react' 
import {Layout } from '../components/Layout'
import Link from 'next/link'
import {useQuery, gql} from '@apollo/client'
import Order from '../components/Order'
import Loading from './loading'
import {useRouter} from 'next/router'
import OrderContext from '../context/orders/ContextOrders'

const ORDERS_BY_SELLER = gql`
    query getOrdersBySeller{
      getActualUser{
        id
        name
        lastname
        role
      }

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

      getOrders {
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


export default function OrderPage() {

  const router = useRouter()

  const {data, loading, error} = useQuery(ORDERS_BY_SELLER)

  const {getOrdersByStatus, ordersByStatus, updateOrders } = useContext(OrderContext)

  const [ordersStatus, setOrdersStatus] = useState([])
  const [filter, setFilter] = useState('')
  const [classes, setClasses] = useState('')

  useEffect(() => {
    getOrdersByStatus(ordersStatus, filter)
  }, [filter])

  if(loading) return <Loading />;

  const storage = localStorage.getItem('token')
  if(!storage) {
    router.push('/login')
  }
  
  const {getOrdersBySeller, getOrders, getActualUser} = data
  let arrData;

  if(getActualUser.role === 'ADMIN') {
    arrData = getOrders;
  }else {
    arrData = getOrdersBySeller;
  }

  const handleChange = filterSelect => { 
    setOrdersStatus(arrData)
    setFilter(filterSelect)
    setColor(filterSelect)
  }

  const setColor = status => {

    if(status === 'PENDIENTE') {

			setClasses('bg-yellow-500')
		}else if(status === 'CANCELADO') {

			setClasses('bg-red-800')

		}else if(status === 'COMPLETADO'){

			setClasses('bg-green-500')
		}else {
      setClasses('bg-white')
    }
  }

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light"> Pedidos </h1>
        <div className="flex justify-between">
        {getActualUser.role !== 'ADMIN' && (
        <Link href="/neworder">
          <a className="bg-blue-800 px-5 py-2 mt-2 text-white inline-block rounded text-sm hover:bg-gray-800"> Nuevo Pedido </a>
        </Link>
        )}
       <select className={`leading-tight focus:outline-none focus:shadow-outline rounded lg:px-5 lg:py-3  mr-5  uppercase sm:inline-block sm:px-2 sm:py-1 sm:pb-12 ${classes}`}
        onChange={ e => handleChange(e.target.value)}
        value={filter}
        >
          <option value=""> ----Seleccione una opcion----- </option>
          <option value="PENDIENTE"> PENDIENTE </option>
          <option value="CANCELADO"> CANCELADO </option>
          <option value="COMPLETADO"> COMPLETADO </option>
        </select>
        </div>
        {ordersByStatus.length === 0 ? (
            <p className="mt-5 text-center text-2xl py-2 "> Aun no hay registros con este status </p>
        ): 
          (
            ordersByStatus.map((order, idx) => (
                <Order key={idx} orders={order} filter={filter} handleChange={handleChange} />
           ))
        )

        }

      </Layout>
    </div>
  )
}
