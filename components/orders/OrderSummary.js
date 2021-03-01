
import {useContext, useState} from 'react'
import OrderContext from '../../context/orders/ContextOrders'
import ProductSummary from './ProductSummary'

const OrderSummary = () => {

	const {products} = useContext(OrderContext);

	return (

		<>
			<p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">3.- Ajusta las cantidades del producto. </p>
			{products.length > 0 ? (
				<>
				{products.map( product => (
					<ProductSummary  product={product} key={product.id} />
				))}
				</>
			): (

				<p> Aun no hay productos </p>
			)
		}
		</>
	)
}

export default OrderSummary