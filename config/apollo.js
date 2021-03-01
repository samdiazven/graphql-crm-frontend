import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import fetch from 'node-fetch'
import {setContext} from 'apollo-link-context'

const httpLink = createHttpLink({
		uri: 'https://mighty-badlands-31870.herokuapp.com/',
		fetch
});

const authLink = setContext((_, {headers}) => {
	const token = localStorage.getItem('token');
	return {
		headers: {
			...headers,
			authorization: token ? token : ''
		}
	}
});

const client = new ApolloClient({
	connectToDevTools: true,
	cache: new InMemoryCache({addTypename: false}),
	link: authLink.concat( httpLink )
});

export default client;
