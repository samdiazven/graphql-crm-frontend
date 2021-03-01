import { Layout } from '../components/Layout';
import {useQuery, gql} from '@apollo/client'
import Link from 'next/link'
import Loading from './loading'
import Seller from '../components/Seller'


const SELLERS = gql`
  query {
    getUsers {
      id
      name
      lastname
      email
      role
    }
  }
  
`;


const Sellers = () => {

  const {data, loading, error} = useQuery(SELLERS)

  if(loading) return <Loading />;

  const storage = localStorage.getItem('token')
    if(!storage) {
    return window.location.href = '/login';
  }
  return (
    <div> 
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light"> Vendedores </h1>
         <Link href="/signin">
          <a className="bg-blue-800 px-5 py-2 mt-2 text-white inline-block rounded text-sm hover:bg-gray-800 uppercase w-full lg:w-auto text-center md:w-auto">Nuevo Usuario</a>
         </Link>
        <div className="overflow-x-scroll">
        <table className="table-auto shadow-md mt-10 w-full w-lg">
          <thead className="bg-gray-800">
            <tr className="text-white">
              <th className="w-1/5 py-2"> Nombre </th>
              <th className="w-1/5 py-2"> Apellido </th>
              <th className="w-1/5 py-2"> Email </th>
              <th className="w-1/5 py-2"> Eliminar </th>
              <th className="w-1/5 py-2"> Editar </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.getUsers.map(x => (
              <Seller key={x.id} user={x} />
            ))}
          </tbody>
        </table>
        </div>
      </Layout>
    </div>
     
  )

}

export default Sellers
