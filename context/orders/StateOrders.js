import React, {useReducer} from 'react'
import Context from './ContextOrders'
import reducer from './ReducerOrders'
import {
	SELECT_PRODUCT,
	SELECT_CLIENT,
	STOCK_PRODUCT,
	UPDATE_TOTAL,
	UPDATE_ORDERS_BY_STATUS,
	GET_ORDERS
} from '../../types';


const StateOrders = ({children}) => {


const initialState = {
	client: {},
	products: [],
	total: 0,
	ordersByStatus: []
	
}
	const [state, dispatch] = useReducer(reducer, initialState);

	const getClient = client => {
		dispatch({
			type: SELECT_CLIENT,
			payload: client
		})
	}	

	const selectProducts = productsSelected => {

		let newState;

		if(state.products.length > 0) {
			newState = productsSelected.map( product => {
				const newObject = state.products.find(stateProduct => stateProduct.id === product.id)
				return {...product, ...newObject}
			})
		}else {
			newState = productsSelected;
		}

		dispatch({
			type: SELECT_PRODUCT,
			payload: newState
		})

		updateTotal();
	}
	
	const updateStock = product => {
		dispatch({
			type: STOCK_PRODUCT, payload: product
		})
	}

	const updateTotal = () => {
		dispatch({
			type: UPDATE_TOTAL
		})
	}

	const updateOrders = (order) => {
		dispatch({
			type: GET_ORDERS,
			payload: order
		})
	}

	const getOrdersByStatus = (orders, filter) => {
		dispatch({
			type: UPDATE_ORDERS_BY_STATUS,
			payload: orders,
			filter
		})
	}

	return (
		<Context.Provider 
		value={{
			client: state.client,
			products: state.products,
			total: state.total,
			ordersByStatus: state.ordersByStatus,
			getClient,
			selectProducts,
			updateStock,
			updateTotal,
			getOrdersByStatus,
			updateOrders

		}}>
			{children}
		</Context.Provider>
	)

}

export default StateOrders
