import {useEffect} from 'react'
import {useQuery, gql} from '@apollo/client'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {Layout} from '../components/Layout'
import Loading from './loading'

const BEST_CLIENTS = gql`
	query bestClients {
		bestClients {
			total
			client {
				name
				lastname
				email
				tlf
				id
			}
		}
	}
`;


const BestClients = () => { 

	const {data, loading, error, startPolling, stopPolling} = useQuery(BEST_CLIENTS)

	useEffect(() => {

		startPolling(1000);

		return () => {
			stopPolling();
		}

	}, [startPolling, startPolling])

	  if(loading) return <Loading />;

	console.log(data)

	const { bestClients } = data

	const graphicClient = []

	bestClients.map((client, idx) => {
		graphicClient[idx] = {
			...client.client[0],
			total: client.total
		}
	})

	return(
		<Layout>
	        <h1 className="text-2xl text-gray-800 font-light"> Mejores Vendedores </h1>
	        <ResponsiveContainer width={'99%'} height={550}>
                <BarChart
                 className="mt-8"
                 width={500}
                 height={300}
                 data={graphicClient}
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

export default BestClients
