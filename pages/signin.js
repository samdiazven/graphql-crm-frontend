import {useState} from 'react'
import {useRouter} from 'next/router'
import { Layout } from '../components/Layout'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import {useMutation, gql} from '@apollo/client'

const NEW_USER = gql`
  mutation newUser($input: userInput ) {
    newUser(input: $input) {
        id
        name
        lastname
        email
        created
    }
  }
`;

export default function SignIn() {
  const [message, setMessage] = useState(null);
  const [newUser] = useMutation(NEW_USER);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: '',
      lastname: '',
      email: '',
      password: '',
      role: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('El nombre es obligatorio'),
      lastname: Yup.string().required('El Apellido es obligatorio'),
      email: Yup.string().email('El email no es valido').required('El email es obligatorio'),
      password: Yup.string().required('El password es obligatorio').min(6, 'El password debe ser al menos de 6 caracteres'),
      role: Yup.string().required('El Rol es obligatorio')
    }),
    onSubmit: async (values) => {
      /*console(log(values);*/
      setMessage('Enviando Datos');
      try {
       const {data} = await newUser({
          variables: {
            input: values
          }
        })
        setMessage(`Se creo correctamente el usuario ${data.newUser.name} ${data.newUser.lastname}`)
        setTimeout(() => {
          setMessage(null)
          router.push("/login");
        }, 2000);
      } catch(error) {
        setMessage(error.message)
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      }
    }
  });

  const showMessage = () => {
    return(
      <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto"> 
          <p className="font-bold"> {message} </p>
      </div>
    )
  }

  return(
    <>
      <Layout>
        {message && showMessage()}

        <h1 className="text-center text-2xl  font-light"> Nuevo Usuario </h1>

        <div className="flex justify-center mt-5">
          <div className="w-full max-w-sm ">
            <form 
              className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
              onSubmit={formik.handleSubmit}
            >
              <div className="pb-3">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Nombre</label>
                <input 
                  className="shadow appearance-none border rounded text-gray-700 w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Nombre de Usuario"
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
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastname">Apellido</label>
                <input 
                  className="shadow appearance-none border rounded text-gray-700 w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"type="text"
                  id="lastname"
                  name="lastname"
                  placeholder="Apellido de Usuario"
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
                  placeholder="Email Usuario"
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
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">Rol del Usuario</label>
                <select
                  className="shadow appearance-none border rounded text-gray-700 w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-white"
                  id="role"
                  name="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                > 
                  <option> ----Seleccione una Opcion ---- </option>
                  <option value="SELLER"> Vendedor </option>
                  <option value="ADMIN" > Administrador </option>
                </select>
              </div>
              {formik.errors.role && (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">ERROR</p>
                  <p> {formik.errors.role}</p>
                </div>
              )}
              <div className="pb-3">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                <input 
                  className="shadow appearance-none border rounded text-gray-700 w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password Usuario"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
              </div>
              {formik.errors.password && (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">ERROR</p>
                  <p> {formik.errors.password}</p>
                </div>
              )}
              <input 
                type="submit"
                className="bg-gray-800 w-full p-2 mt-4 uppercase text-white hover:bg-gray-900"
                value="Crear Cuenta"
              />
            </form>
          </div>
        </div>
      </Layout>
    </>
  )
}
