import Head from 'next/head'
import Sidebar from './Sidebar';
import Header from './Header';
import {useRouter} from 'next/router'
import {useQuery, gql} from '@apollo/client'
import Loading from '../pages/loading'

const ACTUAL_USER = gql`
	query getActualUser{
		getActualUser{
			id
			name
			lastname
			role
		}
	}
`;


export const Layout = ({children}) => {
	const router = useRouter();

	const {data, loading, error} = useQuery(ACTUAL_USER)

	if(loading) return <Loading />; 

	return(
		<>
			<Head>
				<title> CRM-Administracion de Clientes</title>
				<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w==" crossorigin="anonymous" />
			</Head>

			{router.pathname === "/login" ?(
				<div className="bg-gray-800 min-h-screen flex flex-col justify-center">
					{children}
				</div>
			):(
				<div className=" bg-gray-200 min-h-screen">
					<div className="sm:flex min-h-screen">
						<Sidebar data={data} />
						<main className="sm:w-2/3 xl:w-4/5 sm:min-h-screen p-5">
							<Header data={data} />
							{children}
						</main>
					</div>
				</div>

			)}


		</>
	)
}
