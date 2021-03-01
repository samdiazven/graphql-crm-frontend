import {useEffect} from 'react'
import {Layout} from '../components/Layout'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {useQuery, gql} from '@apollo/client'
import Loading from './loading'

const BEST_SELLERS = gql`
	query bestSellers {
		bestSellers {
			seller {
				name
				id
				lastname
				email
			}
			total
		}
	}
`;

const BestSellers = () => {

	const {data, loading, error, startPolling, stopPolling} = useQuery(BEST_SELLERS)

	useEffect(() => {

		startPolling(1000);

		return () => {
			stopPolling();
		}
	}, [stopPolling, startPolling])


	if(loading) return <Loading />;

	const {bestSellers} = data

	const graphicSeller = []

	bestSellers.map((seller, idx) => {
		graphicSeller[idx] = {
			...seller.seller[0],
			total: seller.total 
		}
	})


	return (
		<Layout>
	        <h1 className="text-2xl text-gray-800 font-light"> Mejores Vendedores </h1>
	        <ResponsiveContainer width={'99%'} height={550}>
                <BarChart
                 className="mt-8"
                 width={600}
                 height={500}
                 data={graphicSeller}
                 margin={{
                   top: 5,
                   right: 30,
                   left: 20,
                   bottom: 5,
                 }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                 <XAxis dataKey="name" />
                 <YAxis />
                 <Tooltip />
                 <Legend />
                 <Bar dataKey="total" fill="#2510a3" />
                </BarChart>
	        </ResponsiveContainer>
		</Layout>
	)

}
export default BestSellers
