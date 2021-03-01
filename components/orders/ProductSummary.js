import {useEffect, useState, useContext} from 'react'
import OrderContext from '../../context/orders/ContextOrders'

const ProductSummary = ({product}) => {
	const {name, price} = product;
	const [quantity, setQuantity] = useState(0)
	const {updateStock, updateTotal} = useContext(OrderContext)

	useEffect(() => {
		actQuantity();
		updateTotal();
	}, [quantity])

	const actQuantity = () => {
		const newProduct = {...product, quantity: Number(quantity)}
		updateStock(newProduct)
	}
	return (
		<div className="md:flex md:justify-between md:items-center mt-5">
			<div className="md:w-2/4 mb-2 md:mb-0">
				<p className="text-sm"> {name} </p>
				<p > $ {price} </p>
			</div>

			<input 
				type="number"
				placeholder="Cantidad"
				className="shadow appearance-none border w-full rounded px-3 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline md:ml-4"
				onChange={e => setQuantity(e.target.value)}
				value={quantity}
			/>
			
		</div>
	)
}

export default ProductSummary