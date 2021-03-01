import {useState} from 'react'
import {Layout} from '../components/Layout'
import {useMutation, gql} from '@apollo/client'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import {useRouter} from 'next/router'


const NEW_PRODUCT = gql`
	mutation newProduct($input: productInput) {
		newProduct(input: $input) {
			price
			id
			name
			stock
			created
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

const NewProduct = () => {

	const [newProduct] = useMutation(NEW_PRODUCT, {
		update(cache, {data: {newProduct}}) {
			const {getProducts} = cache.readQuery({query: GET_PRODUCTS});

			cache.writeQuery({
				query: GET_PRODUCTS,
				data: {
					getProducts: [...getProducts, newProduct]
				}
			})
		}
	});

	const router = useRouter();

	const formik = useFormik({
		initialValues: {
			name: '',
			price: '',
			stock: ''
		},
		validationSchema: Yup.object({

			name: Yup.string().required('El Campo es obligatorio'),
			price: Yup.number().required('El campo es obligatorio').positive('Solo se aceptan cantidades positivas'),
			stock: Yup.number().required('El campo es obligatorio').integer('Debe ser un numero entero').positive('Solo se aceptan cantidades positivas')
		}),
		onSubmit: async values => {

			try {

				const {data} = await newProduct({
					variables: {
						input: values
					}
				});
				Swal.fire(
					'Agregado',
					'Producto agregado correctamente',
					'success'
				);
				router.push('/products');
				console.log(data.newProduct)
			}catch(error) {
				console.log(error)
			}

		}
	})

	return (
		<>
		<Layout>
	        <h1 className="text-2xl text-gray-800 font-light"> Productos </h1>
			<div className="flex justify-center items-center mt-7">
	        <div className="w-full max-w-lg">
	          <form className="bg-white shadow-md px-8 pt-6 pb-6 mb-4" onSubmit={formik.handleSubmit}>
	            <div className="pb-3">
	              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Nombre del Producto</label>
	              <input 
	                className="shadow appearance-none border rounded text-gray-700 w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
	                type="text"
	                id="name"
	                name="name"
	                placeholder="Nombre del Producto"
	                value={formik.values.name}
	                onChange={formik.handleChange}
	              />
	            </div>
	            {formik.errors.name && (
	              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
	                <p className="font-bold">ERROR</p>
	                <p> {formik.errors.name}</p>
	              </div>
	            )}
	            <div className="pb-3">
	              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastname">Precio del Producto</label>
	              <input 
	                className="shadow appearance-none border rounded text-gray-700 w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
	                type="number"
	                id="price"
	                name="price"
	                placeholder="Precio del Producto"
	                value={formik.values.price}
	                onChange={formik.handleChange}
	              />
	            </div>
	            {formik.errors.price && (
	              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
	                <p className="font-bold">ERROR</p>
	                <p> {formik.errors.price}</p>
	              </div>
	            )}
	            <div className="pb-3">
	              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock">Stock del Producto</label>
	              <input 
	                className="shadow appearance-none border rounded text-gray-700 w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
	                type="number"
	                id="stock"
	                name="stock"
	                placeholder="Stock del Producto"
	                value={formik.values.stock}
	                onChange={formik.handleChange}
	              />
	            </div>
	            {formik.errors.stock && (
	              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
	                <p className="font-bold">ERROR</p>
	                <p> {formik.errors.stock}</p>
	              </div>
	            )}
	            <input 
	              type="submit"
	              className="bg-gray-800 w-full p-2 mt-4 uppercase text-white hover:bg-gray-900"
	              value="Agregar Producto"
	              />
	          </form>
	        </div>
	      </div>
	    </Layout>
	    </>
	)
}

export default NewProduct