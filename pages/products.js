import { Layout } from '../components/Layout'
import {useQuery, gql} from '@apollo/client'
import Product from '../components/products/Product'
import  Link  from 'next/link'
import Loading from './loading'


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

export default function Products() {

	const {data, loading, error} = useQuery(GET_PRODUCTS);
	if(loading) return <Loading />;
	return(
	    <div>
		    <Layout>
		        <h1 className="text-2xl text-gray-800 font-light"> Productos </h1>
		        <Link href="newproduct">
		          <a className="bg-blue-800 px-5 py-2 mt-2 text-white inline-block rounded text-sm hover:bg-gray-800"> Nuevo Producto </a>
		        </Link>
		        <div className="overflow-x-scroll">
		        <table className="table-auto shadow-md mt-10 w-full w-lg">
		            <thead className="bg-gray-800">
			            <tr className="text-white">
			              <th className="w-1/5 py-2"> Nombre </th>
			              <th className="w-1/5 py-2"> Precio </th>
			              <th className="w-1/5 py-2"> Stock </th>
			              <th className="w-1/5 py-2"> Eliminar </th>
			              <th className="w-1/5 py-2"> Editar </th>
			            </tr>
		            </thead>
		            <tbody className="bg-white">
			        	{data.getProducts.map(p => (
			        		<Product  key={p.id} product={p} />
			        	))} 
		            </tbody>

		        </table>
		        </div>
		    </Layout>
	    </div>
	)
}
