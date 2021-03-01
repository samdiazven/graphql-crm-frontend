import {useState} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import { Layout } from '../components/Layout'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import {useMutation, gql} from '@apollo/client'

const AUTHENTICATE_USER = gql`
  mutation loginUser($input: loginInput){
    loginUser(input: $input) {
        token
    }
  }
`;

export default function Login() {
  const [message, setMessage] = useState(null);
  const [loginUser] = useMutation(AUTHENTICATE_USER);
  
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().required('El email es obligatorio').email('Email no valido'),
      password: Yup.string().required('El password es obligatorio').min(6, 'El password debe tener al menos 6 caracteres')
    }),
    onSubmit: async values => {
      setMessage('Autenticando');
      try {
       const {data} = await loginUser({
        variables: {
          input: values
        }
       });
       setTimeout(() => {
         const {token} = data.loginUser;
         localStorage.setItem('token', token);
       }, 1000)

       setTimeout(() => {
        setMessage(null)
        router.push('/clients');
       }, 2000)
       
      }catch(error) {
        setMessage(error.message);
        setTimeout(() => setMessage(null), 3000);
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
        <h1 className="text-center text-2xl text-white font-light"> Login </h1>

        <div className="flex justify-center mt-5">
          <div className="w-full max-w-sm ">
            <form 
              className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
              onSubmit={formik.handleSubmit}
            >
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
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                <input 
                  className="shadow appearance-none border rounded text-gray-700 w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  type="password"
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}                  
                  placeholder="Password Usuario"
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
                value="Iniciar Sesion"
              />
            </form>

            <Link href="/">
              <a className="px-2 py-3 text-white uppercase text-center hover:text-blue-800"> Volver a la Pagina Principal </a>
            </Link>

          </div>
        </div>
      </Layout>
    </>
  )
  
}
