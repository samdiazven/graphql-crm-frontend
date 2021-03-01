import {gql, useQuery} from '@apollo/client'
import { Layout } from '../components/Layout';
import Link from 'next/link'
import Client from '../components/clients/Client'
import Loading from './loading'

const CLIENTS_ADMIN = gql`
	query getClients {
		getClients {
			id
	        name
	        lastname
	        seller
	        email
	        company
		}
	}
`


const ClientsAdmin = () => { 
const {data, loading, error} = useQuery(CLIENTS_ADMIN);
  
  if(loading) return <Loading />;
  
  if( error || !data.getClients) {
    return window.location.href = '/login';
  }
return (
    <div> 
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light"> Clientes </h1>
        <Link href="newclient">
          <a className="bg-blue-800 px-5 py-2 mt-2 text-white inline-block rounded text-sm hover:bg-gray-800 uppercase w-full lg:w-auto text-center md:w-auto"> Nuevo Cliente </a>
        </Link>
        <div className="overflow-x-scroll">
        <table className="table-auto shadow-md mt-10 w-full w-lg">
          <thead className="bg-gray-800">
            <tr className="text-white">
              <th className="w-1/5 py-2"> Nombre </th>
              <th className="w-1/5 py-2"> Empresa </th>
              <th className="w-1/5 py-2"> Email </th>
              <th className="w-1/5 py-2"> Eliminar 
              
              </th>
              <th className="w-1/5 py-2"> Editar </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.getClients.map( (client, idx) => (
              <Client  key={idx} client={client} />
            ))}          
          </tbody>
          

        </table>
        </div>
      </Layout>
    </div>
    
     
  )

}

export default ClientsAdmin