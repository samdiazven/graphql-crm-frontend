import {useEffect, useState, useContext} from 'react'
import {useMutation, gql} from '@apollo/client'
import Swal from 'sweetalert2'
import OrderContext from '../context/orders/ContextOrders'
import moment from 'moment'

const UPDATE_ORDER = gql`
	
	mutation updateOrder($id: ID!, $input: OrderInput) {
		updateOrder(id: $id, input: $input) {
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

const DELETE_ORDER = gql`
	mutation deleteOrder($id: ID!) {
		deleteOrder(id: $id)
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
			getOrders{
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

const Order = ({orders, handleChange}) => {
	const {total, order, seller, status, client, id, created} = orders
	const {name, lastname,  tlf, email} = client
	const [statusOrder, setStatusOrder] = useState(status)
	const [classes, setClasses] = useState('')

	const momentDate = moment().unix(created)

	const date = new Date(momentDate * 1000)


	const fullDate = `${date.getDay()} - ${date.getMonth() + 1} - ${date.getFullYear()}`

	const [updateOrder] = useMutation(UPDATE_ORDER, {
		update(cache, {data: {updateOrder}}) {
			const {getOrdersBySeller} = cache.readQuery({query: ORDERS_BY_SELLER})
			const {getOrders} = cache.readQuery({query: ORDERS_BY_SELLER})

			cache.writeQuery({
				query: ORDERS_BY_SELLER,
				data: {
					getOrdersBySeller: getOrdersBySeller.map(x => x.id === updateOrder.id ? updateOrder : x),
					getOrders: getOrders.map(x => x.id === updateOrder.id ? updateOrder : x)
				}
			})
		}
	})
	const [deleteOrder] = useMutation(DELETE_ORDER, {
		update(cache) {
			const {getOrdersBySeller} = cache.readQuery({query: ORDERS_BY_SELLER})
			cache.writeQuery({
				query: ORDERS_BY_SELLER,
				data: {
					getOrdersBySeller: getOrdersBySeller.filter(x => x.id !== id)

				}
			})
		}
	})

	useEffect(() => {
		setStatusOrder(status);
		classOrder(status);
	}, [status])

	const classOrder = (status) => { 
		if(status === 'PENDIENTE') {

			setClasses('border-yellow-500')
		}else if(status === 'CANCELADO') {

			setClasses('border-red-800')

		}else {

			setClasses('border-green-500')
		}
	}

	const changeStatus = async value => {

		try {
			const {data} = await updateOrder({
				variables: {
					id,
					input: {
						status: value,
						client: client.id,
					}
				}
			})
			 setStatusOrder(data.updateOrder.status);
			 classOrder(data.updateOrder.status);
		}catch(error) {
			console.log(error)
		}

	}

	const actionDelete =  id => {

		Swal.fire({
		  title: 'Estas Seguro?',
		  text: "No se podra revertir esta accion!",
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Si, Estoy Seguro!'
		}).then( async (result) => 	{
		  if (result.isConfirmed) {

		  	try {
		  		const {data} = await deleteOrder({
		  			variables: {
		  				id
		  			}
		  		})

		  		Swal.fire(
			      'Eliminado!',
			      `${data.deleteOrder}`,
			      'success'
			    )
		  	}catch(error) {
		  		console.log(error);
		  	}
		    
		  }

		})
	}


	return (

		<>
			<div className={` mt-4  border-t-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg ${classes}`}>
				<div> 
					<p className="font-bold text-gray-800">Cliente: {name} {lastname} </p>

					{email && (
						<p className="flex items-center my-2">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-2">
						  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
						  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
						</svg>
						 {email} 
						</p>
					)}
					{tlf && (

						<p className="flex items-center my-2">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 mr-2">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
							</svg>
							 {tlf} 
						</p>	
					)}
						<p className="flex items-center my-2">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 mr-2">
						  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
						 {fullDate} 
						</p>
					<h2 className="mt-10 text-gray-800 font-bold">Estado: {statusOrder} </h2>

					<select 
						className="mt-2 appearance-none bg-blue-600 border border-blue-600 text-white p-2 text-center rounded leading-tight focus:outline-none focus:bg-blue-600 focus-border-blue-500 uppercase text-xs"
						value={statusOrder}
						onChange={e => changeStatus(e.target.value) }
					>
						<option value="COMPLETADO"> COMPLETADO </option>
						<option value="PENDIENTE"> PENDIENTE </option>
						<option value="CANCELADO"> CANCELADO </option>
					</select>
				</div>

				<div>
					<h2 className="text-gray-800 font-bold mt-2" > Resumen del Pedido</h2>
					{order.map((article, idx) => (
						<div className="mt-4" key={idx} > 
							<p className="text-sm text-gray-600"> Producto: {article.name} </p>
							<p className="text-sm text-gray-600"> Cantidad: {article.quantity} </p>
						</div>
					) )}
					<p className="text-gray-800 mt-3 font-bold"> 
					Total a Pagar: <span className="font-light"> ${total} </span>

					</p>
					<button className="flex items-center inline-block text-white rounded leading-tight bg-red-800 mt-4 px-5 py-2 uppercase text-xs font-bold hover:bg-red-600" 
							onClick={() => actionDelete(id)}
					> 
						Eliminar Pedido
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 ml-2">
						  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</button>
				</div>

			</div>
		</>

	)

}

export default Order
