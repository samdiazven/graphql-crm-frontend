import Link from 'next/link'
import { useRouter } from 'next/router'

const Sidebar = ({data}) => {
	
	const router = useRouter();


	const {role} = data.getActualUser;

	return(
		<aside className="bg-gray-800 sm:w-1/3 xl:w-1/5 sm:min-h-screen p-5 ">
			<div >
				<p className="text-white text-2xl font-black"> Seven CRM </p>
			</div>
			<nav className="mt-5 list-none">
				<li className={router.pathname === "/clients" ? "bg-blue-800 p-2" : "p-2" }>
					<Link href="/clients">
						<a className="text-white block">
							Clientes
						</a>
					</Link>
				</li>
				<li  className={router.pathname === "/orders" ? "bg-blue-800 p-2" : "p-2" }>
					<Link href="/orders">
						<a className="text-white  block">
							Pedidos
						</a>
					</Link>
				</li>
				{data.getActualUser.role === 'ADMIN' && (
					<>
					<li  className={router.pathname === "/products" ? "bg-blue-800 p-2" : "p-2" }>
						<Link href="/products">
							<a className="text-white block">
								Productos
							</a>
						</Link>
						
					</li>
					<li  className={router.pathname === "/sellers" ? "bg-blue-800 p-2" : "p-2" }>
						<Link href="/sellers">
							<a className="text-white block">
								Vendedores
							</a>
						</Link>
					</li>
					</>
				)}
			</nav>
			<div className="sm: mt-10" >
				<p className="text-white text-2xl font-black"> Otras opciones </p>
			</div>
			<nav className="mt-5 list-none">
				<li className={router.pathname === "/bestsellers" ? "bg-blue-800 p-2" : "p-2" }>
					<Link href="/bestsellers">
						<a className="text-white block">
							Mejores Vendedores
						</a>
					</Link>
				</li>
				<li  className={router.pathname === "/bestclients" ? "bg-blue-800 p-2" : "p-2" }>
					<Link href="/bestclients">
						<a className="text-white  block">
							Mejores Clientes
						</a>
					</Link>
				</li>
			</nav>
		</aside>
	)
}

export default Sidebar
