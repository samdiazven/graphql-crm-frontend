import {
	SELECT_PRODUCT,
	SELECT_CLIENT,
	STOCK_PRODUCT,
	UPDATE_TOTAL,
	UPDATE_ORDERS_BY_STATUS,
	GET_ORDERS
} from '../../types';

export default (state, action) => {

	switch(action.type) {

		case SELECT_CLIENT: 
			return {
				...state,
				client: action.payload
			}
		case SELECT_PRODUCT:
			return {
				...state,
				products: action.payload
			}
		case STOCK_PRODUCT:
			return {
				...state,
				products: state.products.map( p => p.id === action.payload.id ? action.payload : p )
			}
		case UPDATE_TOTAL:
			return {
				...state,
				total: state.products.reduce((acc, el) => acc += el.price * el.quantity ,0)
			}

		case GET_ORDERS: 
			return {
				...state,
				ordersByStatus: state.ordersByStatus.map( x => x.id === action.payload.id ? action.payload : x)
			}
		case UPDATE_ORDERS_BY_STATUS: 
			return {
				...state,
				ordersByStatus: action.payload.filter(x => x.status === action.filter)
			}

		default:
			return state
	}
}
