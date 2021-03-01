
import {useContext} from 'react'
import OrderContext from '../../context/orders/ContextOrders'


const Total = () => {

	const {total} = useContext(OrderContext)

	return (
		<div className="flex items-center justify-between mt-5 bg-white p-3 border-solid border-2 "> 
			<h2 className="text-gray-800 text-lg"> Total a pagar: </h2>
			<p className="text-gray-800 mt-0"> {total} </p>

		</div>
	)
}

export default Total