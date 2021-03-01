import {useState} from 'react'
import {Layout} from '../../components/Layout'
import {useQuery, gql, useMutation} from '@apollo/client'
import { useRouter } from 'next/router'
import {Formik} from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import Loading from '../loading'

const UPDATE_CLIENT = gql `
	mutation updateClient($id: ID!, $input: clientInput) {
		updateClient(id: $id, input: $input) {
			id
			name
			lastname
			email
			tlf
			company
		}
	}
`;

const GET_CLIENT = gql`

	query getCLient($id: ID!) {
	  getClient(id: $id) {
	    name
	    email
	    lastname
	    seller
	    company
	    tlf
	  }
	}
`;



const EditClient = () => {
	const router = useRouter();
	const {query: {id}} = router;
	const [message, setMessage] = useState(null)
	const {data, loading, error} = useQuery(GET_CLIENT, {
		variables: {
			id
		}
	});

	const [updateClient] = useMutation(UPDATE_CLIENT);

	const schemaValidation = Yup.object({
      name: Yup.string().required('El nombre del cliente es obligatorio'),
      lastname: Yup.string().required('El apellido del cliente es obligatorio'),
      tlf: Yup.string().required('El telefono es obligatorio'),
      company: Yup.string().required('La empresa es obligatoria'),
      email: Yup.string().email('El formato no es el correcto').required('El email es obligatorio')
      
    });

	if(loading) return <Loading />;

	const {getClient} = data;

	const handleUpdate = async values => {
		const {name, lastname, email, company, tlf} = values
		try {
			const {data} = await updateClient({
				variables: {
					id,
					input: {
						name,
						lastname,
						tlf,
						company,
						email
					}
				}
			})
			Swal.fire(
				'Actualizado',
				'El cliente se actualizo correctamente',
				'success'
			)
			router.push('/clients');
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
        	initialValues= {getClient}
        	onSubmit={(values) => {
        		handleUpdate(values)
        	}}
        >
        {props => {
        	return (

        		<form className="bg-white shadow-md px-8 pt-6 pb-6 mb-4" onSubmit={props.handleSubmit} >
		            <div className="pb-3">
		              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Nombre del Cliente</label>
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
		              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastname">Apellido del Cliente</label>
		              <input 
		                className="shadow appearance-none border rounded text-gray-700 w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
		                type="text"
		                id="lastname"
		                name="lastname"
		                placeholder="Apellido del Cliente"
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
		                placeholder="Email del Cliente"
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
		              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="company">Empresa</label>
		              <input 
		                className="shadow appearance-none border rounded text-gray-700 w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
		                type="text"
		                id="company"
		                name="company"
		                placeholder="Empresa del Cliente"
		                value={props.values.company}
		                onChange={props.handleChange}
		              />
		            </div>
		            {props.errors.company && (
		              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
		                <p className="font-bold">ERROR</p>
		                <p> {props.errors.company}</p>
		              </div>
		            )}
		            <div className="pb-3">
		              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tlf">Telefono</label>
		              <input 
		                className="shadow appearance-none border rounded text-gray-700 w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
		                type="text"
		                id="tlf"
		                name="tlf"
		                placeholder="Telefono del Cliente"
		                value={props.values.tlf}
		                onChange={props.handleChange}
		              />
		            </div>
		            {props.errors.tlf && (
		              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
		                <p className="font-bold">ERROR</p>
		                <p> {props.errors.tlf}</p>
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

export default EditClient