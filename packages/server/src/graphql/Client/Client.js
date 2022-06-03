import { gql } from 'apollo-server-express';
import createRepository from '../../io/Database/createRepository';

const clientRespository = createRepository('client');

export const typeDefs = gql `
    type Client implements Node {
        id: ID!
        name: String!
        email: String!
        disabled: Boolean!
    }

    type ClientList implements List {
        items: [Client!]!
        totalItems: Int!
    }

    extend type Query {
        client(id: ID!): Client
        clients: ClientList
    }
`;

export const resolvers = {
    Query: {
        client: async(_, { id }) => {
            const clients = await clientRespository.read();
            //console.log(clients.find((client) => client.id === id));

            return clients.find((client) => client.id === id);
        },

        clients: async() => {
            const clients = await clientRespository.read();
            const list = {
                items: clients,
                totalItems: clients.length
            }

            return list;
        },
    },
}