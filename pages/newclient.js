import {useState} from 'react'
import {useRouter} from 'next/router'
import {useMutation, gql} from '@apollo/client'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import { Layout } from '../components/Layout'


const NEW_CLIENT = gql`
  mutation newClient($input: clientInput ){
    newClient(input: $input){
      id
      name
      lastname
      email
      tlf
      seller
      company
    }
  }
  
`;

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

    getClients {
      id
       name
       lastname
       seller
       email
       company 
    }
  }
`;

const NewClient = () => {
  const [message, setMessage] = useState(null);
  const [newClient] = useMutation(NEW_CLIENT, {
    update(cache, {data: { newClient }}) {
      const {getClientsBySeller} = cache.readQuery({query: CLIENTS_BY_SELLER}) 
      const {getClients} = cache.readQuery({query: CLIENTS_BY_SELLER}) 

      //Rewrite cache
      cache.writeQuery({
        query: CLIENTS_BY_SELLER,
        data: {
          getClientsBySeller: [
            ...getClientsBySeller, newClient
          ],
          getClients: [...getClients, newClient]
        }
      })
    }
  });

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: '',
      lastname: '',
      company: '',
      email: '',
      tlf: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('El nombre del cliente es obligatorio'),
      lastname: Yup.string().required('El apellido del cliente es obligatorio'),
      tlf: Yup.string().required('El telefono es obligatorio'),
      company: Yup.string().required('La empresa es obligatoria'),
      email: Yup.string().email('El formato no es el correcto').required('El email es obligatorio')
      
    }),
    onSubmit: async values => {
      setMessage('Guardando');

      try {
        await newClient({
          variables: {
            input: values
          }
        })
        setMessage('Guardado sastifactoriamente');
        setTimeout(() => {
          setMessage(null);
          router.push('/clients');
        } ,2000)
      }catch(error) {
        setMessage(error.message);
        setTimeout(() => setMessage(null), 3000)
      }
      
    }
  })

  const showMessage = () => {
    return(
      <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto"> 
          <p className="font-bold"> {message} </p>
      </div>
    )
  }
  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light "> Nuevo Cliente </h1>
      {message && showMessage()}
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <form className="bg-white shadow-md px-8 pt-6 pb-6 mb-4" onSubmit={formik.handleSubmit}>
            <div className="pb-3">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Nombre del Cliente</label>
              <input 
                className="shadow appearance-none border rounded text-gray-700 w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="name"
                name="name"
                placeholder="Nombre del Cliente"
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
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastname">Apellido del Cliente</label>
              <input 
                className="shadow appearance-none border rounded text-gray-700 w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="lastname"
                name="lastname"
                placeholder="Apellido del Cliente"
                value={formik.values.lastname}
                onChange={formik.handleChange}
              />
            </div>
            {formik.errors.lastname && (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">ERROR</p>
                <p> {formik.errors.lastname}</p>
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
                value={formik.values.email}
                onChange={formik.handleChange}
              />
            </div>
            {formik.errors.email && (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">ERROR</p>
                <p> {formik.errors.email}</p>
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
                value={formik.values.company}
                onChange={formik.handleChange}
              />
            </div>
            {formik.errors.company && (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">ERROR</p>
                <p> {formik.errors.company}</p>
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
                value={formik.values.tlf}
                onChange={formik.handleChange}
              />
            </div>
            {formik.errors.tlf && (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">ERROR</p>
                <p> {formik.errors.tlf}</p>
              </div>
            )}
            <input 
              type="submit"
              className="bg-gray-800 w-full p-2 mt-4 uppercase text-white hover:bg-gray-900"
              value="Agregar Cliente"
              />
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default NewClient
