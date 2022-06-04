import { ApolloLink } from "apollo-link";
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';

//configuraçao do link
const link = ApolloLink.from([
    onError((error) => {
        console.log('GraphQLError', error);
    }),
    setContext((_, { headers }) => {
        return {
            headers,
        }
    }),
    createHttpLink({
        uri: 'http://127.0.0.1:8000/graphql',
    }),
]);

export default link;