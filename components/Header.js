import {useQuery, gql} from '@apollo/client'
import {useRouter} from 'next/router'


export default function Header({data}) {
	const router = useRouter();
	const signOut = () => {
		localStorage.removeItem('token');
		router.push('/login');
	}
	
	if(!data) return router.push('/login');

	return(
		<div className="sm:flex sm:justify-between mb-6">
			<p className="mr-2 mb-3 lg:mb-0"> Hola: {data.getActualUser.name} {data.getActualUser.lastname} </p>
			<p className="ml-2 mb-3 lg:mb-0 text-red-700 font-bold"> {data.getActualUser.role === 'ADMIN' ? 'ADMIN' : 'VENDEDOR'} </p>

			<button 
				onClick={signOut}
				className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md "
			>
			Cerrar Sesion </button>
		</div>
	)
}
