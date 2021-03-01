import {useState} from 'react'
import {Layout} from '../../components/Layout'
import {useQuery, gql, useMutation} from '@apollo/client'
import { useRouter } from 'next/router'
import {Formik} from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import Loading from '../loading'


const GET_USER = gql`
	query getUser($id: ID!){
    getUser(id: $id) { 
      id
      name
      lastname
      email
			role
    }
  }
`

const EDIT_USER = gql`
	mutation updateUser($id: ID!, $input: userInput) { 
		updateUser(id: $id, input: $input) {
			id
			name
			lastname
			email
			role
		}
	}
`

const EditUser = () => {
	const router = useRouter();
	const {query: {id}} = router;

	const [message, setMessage] = useState(null)

	const {data, loading, error} = useQuery(GET_USER, {
		variables: {
			id
		}
	});

	const [updateUser] = useMutation(EDIT_USER);

	const schemaValidation = Yup.object({
      name: Yup.string().required('El nombre del cliente es obligatorio'),
      lastname: Yup.string().required('El apellido del cliente es obligatorio'),
      email: Yup.string().email('El formato no es el correcto').required('El email es obligatorio'),
			role: Yup.string().required('El rol es obligatorio')
      
    });

	console.log(data, loading, error)

	if(loading) return <Loading />;

	console.log(data, loading, error)
	const {getUser} = data;

	const handleUpdate = async values => {
		const {name, lastname, email, role} = values
		try {
			const {data} = await updateUser({
				variables: {
					id,
					input: {
						name,
						lastname,
						role,
						email
					}
				}
			})
			Swal.fire(
				'Actualizado',
				'El cliente se actualizo correctamente',
				'success'
			)
			router.push('/sellers');
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
      <h1 className="text-2xl text-gray-800 font-light"> Editar Vendedor </h1>
      {message && showMessage()}
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
        <Formik
        	validationSchema={ schemaValidation }
        	enableReinitialize
        	initialValues= {getUser}
        	onSubmit={(values) => {
        		handleUpdate(values)
        	}}
        >
        {props => {
        	return (

        		<form className="bg-white shadow-md px-8 pt-6 pb-6 mb-4" onSubmit={props.handleSubmit} >
		            <div className="pb-3">
		              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Nombre del Vendedor</label>
		              <input 
		                className="shadow appearance-none border rounded text-gray-700 w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
		                type="text"
		                id="name"
		                name="name"
		                placeholder="Nombre del Vendedor"
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
		              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastname">Apellido del Vendedor</label>
		              <input 
		                className="shadow appearance-none border rounded text-gray-700 w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
		                type="text"
		                id="lastname"
		                name="lastname"
		                placeholder="Apellido del Vendedor"
		                onChange={props.handleChange}
		                value = {props.values.lastname}
		              />
		            </div>
                {props.errors.lastname && (
	              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
	                <p className="font-bold">ERROR</p>
	                <p> {props.errors.lastname}</p>
	              </div>
	            )}
		            <div className="pb-3">
		              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
		              <input 
		                className="shadow appearance-none border rounded text-gray-700 w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
		                type="email"
		                id="email"
		                name="email"
		                placeholder="Email del Vendedor"
		                value={props.values.email}
		                onChange={props.handleChange}
		              />
		            </div>
		            {props.errors.email && (
		              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
		                <p className="font-bold">ERROR</p>
		                <p> {props.errors.email}</p>
		              </div>
		            )}
								<div className="pb-3">
									<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">Rol del Usuario</label>
									<select
										className="shadow appearance-none border rounded text-gray-700 w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-white"
										id="role"
										name="role"
										value={props.values.role}
										onChange={props.handleChange}
									> 
										<option> ----Seleccione una Opcion ---- </option>
										<option value="SELLER"> Vendedor </option>
										<option value="ADMIN" > Administrador </option>
									</select>
								</div>
              {props.errors.role && (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">ERROR</p>
                  <p> {props.errors.role}</p>
                </div>
              )}
		            <input 
		              type="submit"
		              className="bg-gray-800 w-full p-2 mt-4 uppercase text-white hover:bg-gray-900"
		              value="Editar Cliente"
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

export default EditUser
