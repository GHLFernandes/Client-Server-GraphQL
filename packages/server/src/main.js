import express from 'express';
//import cors from 'cors';
import micro_cors from 'micro-cors';
import { ApolloServer, gql } from 'apollo-server-express'
import { typeDefs } from './graphql/typeDefs';
import resolvers from './graphql/resolvers';

const app = express();

const server = new ApolloServer({
    //declaraçao de graphos (entidades ou pequenos dominios da app)
    // ! siginifica obrigatoriedade
    typeDefs,
    resolvers,
});

server.start().then(res => {
    server
        .applyMiddleware({
            app,
            csrfPrevention: true, // see below for more about this
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