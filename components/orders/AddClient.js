import {useState, useEffect, useContext} from 'react'
import {Layout} from '../Layout';
import {useQuery, gql} from '@apollo/client'
import Select from 'react-select'
import OrderContext from '../../context/orders/ContextOrders'


const CLIENTS_BY_SELLER = gql`
  query getClientsBySeller{
     getClientsBySeller{
       id
       name
       lastname
       seller
       email
       company
    }
  }
`;


const AddClient = () => {
	const [clients, setClients] = useState([]);
	const {data, loading, error} = useQuery(CLIENTS_BY_SELLER)

	const {getClient} = useContext(OrderContext);


	if(loading) return null;

	const {getClientsBySeller} = data;
	return (

		<>
			<p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">1.- Asigna un cliente al pedido. </p>
			<Select 
				className="mt-3"
				options={getClientsBySeller}
				onChange={opt => getClient(opt)}
				getOptionValue={opt => opt.id}
				getOptionLabel={opt => opt.name}
				placeholder="Seleccione un Cliente"
				noOptionsMessage={() => "No hay Resultados"}

			/>
		</>

	)
}

export default AddClient