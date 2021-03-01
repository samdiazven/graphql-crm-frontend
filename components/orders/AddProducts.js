import {useContext} from 'react'
import {gql, useQuery} from '@apollo/client'
import OrderContext from '../../context/orders/ContextOrders'
import Select from 'react-select'

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

const AddProducts = () => {

	const {selectProducts} = useContext(OrderContext);
	const {data, loading, error} = useQuery(GET_PRODUCTS);

	if(loading) return null;

	const {getProducts} = data;

	return (

		<>
			<p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">2.- Selecciona los productos para el pedido. </p>
			<Select 
				className="mt-3"
				options={getProducts}
				onChange={opt => selectProducts(opt)}
				getOptionValue={opt => opt.id}
				getOptionLabel={opt => `${opt.name} - ${opt.stock} Disponibles`}
				isMulti={true}
				placeholder="Seleccione los Productos"
				noOptionsMessage={() => "No hay Resultados"}

			/>
		</>
	)
}

export default AddProducts