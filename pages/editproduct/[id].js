import {useState} from 'react'
import {useRouter} from 'next/router'
import {useQuery, gql, useMutation} from '@apollo/client'
import {Layout} from '../../components/Layout'
import {Formik} from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import Loading from '../loading'


const GET_PRODUCT = gql`
	query getProduct($id: ID!) {
		getProduct(id: $id) {
			name
			stock
			price
			created
		}
	}
`;

const UPDATE_PRODUCT = gql`
	mutation updateProduct($id: ID!, $input: productInput) {
		updateProduct(id: $id, input: $input) {
			id
			name
			stock
			price
			created
		}
	}
`;

const EditProduct = () => {
	const router = useRouter();
	const [message, setMessage] = useState(null);

	const {query: {id}} = router;

	const {data, loading, error} = useQuery(GET_PRODUCT, {
		variables: {
			id
		}
	});

	const [updateProduct] = useMutation(UPDATE_PRODUCT);

	if(loading) return <Loading />;

	const {getProduct} = data;

	const schemaValidation = Yup.object({
		name: Yup.string().required('El Campo es obligatorio'),
		price: Yup.number().required('El campo es obligatorio').positive('Solo se aceptan cantidades positivas'),
		stock: Yup.number().required('El campo es obligatorio').integer('Debe ser un numero entero').positive('Solo se aceptan cantidades positivas')
	});


	const handleUpdate = async values => {
		setMessage('Enviando Datos');
		const {name, price, stock } = values
		try {
			const {data} = await updateProduct({
				variables: {
					id,
					input: {
						name,
						price,
						stock,
					}
				}
			})
			Swal.fire(
				'Actualizado',
				'El Producto se actualizo correctamente',
				'success'
			)
			router.push('/products');
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
		<Layout>
	      <h1 className="text-2xl text-gray-800 font-light"> Editar Cliente </h1>
	      {message && showMessage()}
	      <div className="flex justify-center mt-5">
	        <div className="w-full max-w-lg">
	        <Formik
	        	validationSchema={ schemaValidation }
	        	enableReinitialize
	        	initialValues= {getProduct}
	        	onSubmit={(values) => {
	        		handleUpdate(values)
	        	}}
	        >
	        {props => {
	        	return (

	        		<form className="bg-white shadow-md px-8 pt-6 pb-6 mb-4" onSubmit={props.handleSubmit} >
			            <div className="pb-3">
			              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Nombre del Producto</label>
			              <input 
			                className="shadow appearance-none border rounded text-gray-700 w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
			                type="text"
			                id="name"
			                name="name"
			                placeholder="Nombre del Cliente"
			                value={props.values.name}
			                onChange={props.handleChange}
			              />
			            </div>
			       	{props.errors.name && (
		              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
		                <p className="font-bold">ERROR</p>
		                <p> {props.errors.name}</p>
		              </div>
		            )}
			           <div className="pb-3">
			              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastname">Stock</label>
			              <input 
			                className="shadow appearance-none border rounded text-gray-700 w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
			                type="number"
			                id="stock"
			                name="stock"
			                placeholder="Stock del producto"
			                onChange={props.handleChange}
			                value = {props.values.stock}
			              />
			            </div>
	                {props.errors.stock && (
		              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
		                <p className="font-bold">ERROR</p>
		                <p> {props.errors.stock}</p>
		              </div>
		            )}
			            <div className="pb-3">
			              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Precio</label>
			              <input 
			                className="shadow appearance-none border rounded text-gray-700 w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
			                type="number"
			                id="price"
			                name="price"
			                placeholder="Precio del Producto"
			                value={props.values.price}
			                onChange={props.handleChange}
			              />
			            </div>
			            {props.errors.price && (
			              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
			                <p className="font-bold">ERROR</p>
			                <p> {props.errors.price}</p>
			              </div>
			            )}
			            
			            <input 
			              type="submit"
			              className="bg-gray-800 w-full p-2 mt-4 uppercase text-white hover:bg-gray-900"
			              value="Editar Producto"
			              />
		          </form>
	        	)
	        }}
	           
	         </Formik>
	        </div>
	      </div>
    </Layout>
 	)
}

export default EditProduct