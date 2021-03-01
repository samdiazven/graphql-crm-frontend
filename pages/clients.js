import { Layout } from '../components/Layout';
import {useQuery, gql} from '@apollo/client'
import Link from 'next/link'
import Client from '../components/clients/Client'
import ClientAdmin from '../components/clients/ClientAdmin'
import Loading from './loading'

const CLIENTS_BY_SELLER = gql`
  query getClientsBySeller {
      getActualUser{
        id
        name
        lastname
        role
      }

    getClients {
      id
          name
          lastname
          seller {
            name
            lastname
          }
          email
          company
    }
      getClientsBySeller {
        id
            name
            lastname
            seller
            email
            company
    }
  }
`

const Index = () => {


  const {data, loading, error} = useQuery(CLIENTS_BY_SELLER)

  if(loading) return <Loading />;

  const storage = localStorage.getItem('token')
  
    if(!storage) {
    return window.location.href = '/login';
  }

  return (
    <div> 
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light"> Clientes </h1>
        {data.getActualUser.role !== 'ADMIN' && (
         <Link href="newclient">
          <a className="bg-blue-800 px-5 py-2 mt-2 text-white inline-block rounded text-sm hover:bg-gray-800 uppercase w-full lg:w-auto text-center md:w-auto"> Nuevo Cliente </a>
         </Link>
        )}
       
        <div className="overflow-x-scroll">
        <table className="table-auto shadow-md mt-10 w-full w-lg">
          <thead className="bg-gray-800">
            <tr className="text-white">
              <th className="w-1/5 py-2"> Nombre </th>
              <th className="w-1/5 py-2"> Empresa </th>
              <th className="w-1/5 py-2"> Email </th>
             {data.getActualUser.role === 'ADMIN' && ( 
              <th className="w-1/5 py-2"> Vendedor </th>
              )}
              <th className="w-1/5 py-2"> Eliminar 
              
              </th>
              <th className="w-1/5 py-2"> Editar 
                
               </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.getActualUser.role !== 'ADMIN' ? (
              data.getClientsBySeller.map( (client, idx) => (
                <Client  key={idx} client={client} />
              ))

            ) : (

              data.getClients.map( (client, idx) => (
                <ClientAdmin  key={idx} client={client} />
              ))
            )}
                      
          </tbody>
          

        </table>
        </div>
      </Layout>
    </div>
    
     
  )
}

export default Index
