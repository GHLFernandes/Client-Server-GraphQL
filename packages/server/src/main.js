import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express'
import { typeDefs } from './graphql/typeDefs';
import resolvers from './graphql/resolvers';

const app = express();

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

server.start().then(res => {
    server
        .applyMiddleware({
            app,
            csrfPrevention: true,
            cors: {
                origin: ["http://localhost:3000", "https://studio.apollographql.com"]
            },
            bodyParserConfig: true,
        });
});

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8000;
const HOSTNAME = process.env.HOSTNAME || '127.0.0.1';

app.listen(PORT, HOSTNAME, () => {
    console.log(`Server is listening at http://${HOSTNAME}:${PORT}`);
})