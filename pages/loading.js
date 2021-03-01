import Loader from 'react-loader-spinner'

export default () => { 

	return (
		<>
			<div className="sm:w-full min-h-screen bg-gray-500 flex items-center justify-center"> 

				<div>
					<Loader 
						type="ThreeDots"
				        color="#00BFFF"
				        height={100}
				        width={100}
						timeout={10000}
					/>
				</div>
			</div>
		
		</>
	)
}