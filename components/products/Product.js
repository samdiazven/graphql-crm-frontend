import {useMutation, gql} from '@apollo/client'
import Swal from 'sweetalert2'
import Router from 'next/router'


const DELETE_PRODUCT = gql`
	mutation deleteProduct($id:ID!) {
	  deleteProduct(id: $id) 
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

const Product = ({product}) => {

	const {name, stock, id, price} = product;

	const [deleteProduct] = useMutation(DELETE_PRODUCT, {
		update(cache) {
			const {getProducts} = cache.readQuery({query: GET_PRODUCTS});

			cache.writeQuery({
				query: GET_PRODUCTS,
				data: {
					getProducts: getProducts.filter(x => x.id !== id)
				}
			})
		}
	})


	const deletAction =  id => {

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
		  		const {data} = await deleteProduct({
		  			variables: {
		  				id
		  			}
		  		})

		  		Swal.fire(
			      'Eliminado!',
			      `${data.deleteClient}`,
			      'success'
			    )
		  	}catch(error) {
		  		console.log(error);
		  	}
		    
		  }

		})
	}

	const editAction = id => {
		Router.push({
			pathname: "/editproduct/[id]",
			query: {id}
		})
	}

	return (
		<tr> 
			<td className="border px-4 py-2"> {name}</td>
			<td className="border px-4 py-2"> {price} </td>
			<td className="border px-4 py-2"> {stock} </td>
			<td className="border px-4 py-2">
				<button onClick={ () => deletAction(id) } className="bg-red-800 py-1 px-2 rounded text-white hover:bg-red-400 flex justify-center items-center w-full rounded text-sm uppercase">
				 Eliminar
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 ml-2">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				</button> 
			</td>
			<td className="border px-4 py-2">
				<button onClick={ () => editAction(id) } className="bg-green-800 py-1 px-2 rounded text-white hover:bg-green-400 flex justify-center items-center w-full rounded text-sm uppercase">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 ml-2">
	              		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
	               	</svg>
					Editar
				</button> 
			</td>
		</tr>

	)
}

export default Product