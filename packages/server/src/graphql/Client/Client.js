import { gql } from 'apollo-server-express';
import createRepository from '../../io/Database/createRepository';
import { ListSortmentEnum } from '../List/List';
import * as uuid from 'uuid';

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

    input ClientListFilter {
        name: String
        email: String
        disabled: Boolean
    }

    input ClientListOptions {
        take: Int
        skip: Int
        filter: ClientListFilter
        sort: ListSort
    }

    extend type Query {
        client(id: ID!): Client
        clients(options: ClientListOptions): ClientList
    }

    input CreateClientInput {
        name: String!
        email: String!
    }

    input UpdateClientInput {
        id: ID!
        name: String!
        email: String!
    }

    extend type Mutation {
        createClient(input: CreateClientInput!): Client!
        updateClient(input: UpdateClientInput!): Client!
        deleteClient(id: ID!): Client!
        enableClient(id: ID!): Client!
        disableClient(id: ID!): Client!
    }
`;

export const resolvers = {
    Query: {
        client: async(_, { id }) => {
            const clients = await clientRespository.read();

            return clients.find((client) => client.id === id);
        },

        clients: async(_, args) => {
            const {
                skip = 0,
                    take = 10,
                    sort, filter
            } = args.options || {};

            const clients = await clientRespository.read();

            if (sort) {
                clients.sort((clientA, clientB) => {
                    if (!['name', 'email', 'disabled'].includes(sort.sorter)) {
                        throw new Error(`Invalid sort field "${sort.sorter}"`);
                    }

                    const fieldA = clientA[sort.sorter];
                    const fieldB = clientB[sort.sorter];

                    if (typeof fieldA === 'string') {
                        if (sort.sortment === ListSortmentEnum.ASC) {
                            return fieldA.localeCompare(fieldB);
                        } else {
                            return fieldB.localeCompare(fieldA);
                        }
                    }

                    if (sort.sortment === ListSortmentEnum.ASC) {
                        return Number(fieldA) - Number(fieldB);
                    } else {
                        return Number(fieldB) - Number(fieldA);
                    }
                });
            }

            const filteredClients = clients.filter((client) => {
                if (!filter || Object.keys(filter).length === 0) {
                    return true;
                }

                return Object.entries(filter).every(([field, value]) => {
                    if (client[field] === null || client[field] === undefined) {
                        return false;
                    }

                    if (typeof value === 'string') {
                        if (value.startsWith('%') && value.endsWith('%')) {
                            return client[field].includes(value.substring(1, value.length - 1));
                        } else
                        if (value.startsWith('%')) {
                            return client[field].endsWith(value.substring(1));
                        } else
                        if (value.endsWith('%')) {
                            return client[field].startsWith(value.substring(0, value.length - 1));
                        } else {
                            return client[field] === value;
                        }
                    }
                    return client[field] === value;
                })
            })

            return {
                items: filteredClients.slice(skip, skip + take),
                totalItems: filteredClients.length,
            };
        },
    },

    Mutation: {
        createClient: async(_, { input }) => {
            const clients = await clientRespository.read();

            const client = {
                id: uuid.v4(),
                name: input.name,
                email: input.email,
                disabled: false,
            }

            await clientRespository.write([...clients, client]);

            return client;
        },

        updateClient: async(_, { input }) => {
            const clients = await clientRespository.read();

            const currentClient = clients.find((client) => client.id === input.id);

            if (!currentClient) {
                throw new Error(`No client found with this ${id}`);
            }

            const updateClient = {
                ...currentClient,
                name: input.name,
                email: input.email
            };

            const updateClients = clients.map((client) => {
                if (client.id === updateClient.id) {
                    return updateClient;
                } else {
                    return client;
                }
            });

            await clientRespository.write(updateClients);

            return updateClient;
        },

        deleteClient: async(_, { id }) => {
            const clients = await clientRespository.read();

            const client = clients.find((client) => client.id === id);

            if (!client) {
                throw new Error(`Can't delete client whit id "${id}"`);
            }

            const updateClients = clients.filter((client) => client.id !== id);

            await clientRespository.write(updateClients);

            return client;
        },

        enableClient: async(_, { id }) => {
            const clients = await clientRespository.read();

            const currentClient = clients.find((client) => client.id === id);

            if (!currentClient) {
                throw new Error(`No client found with this ${id}`);
            }

            if (!currentClient.disabled) {
                throw new Error(`Client "${id}" is alredy enabled`);
            }

            const updateClient = {
                ...currentClient,
                disabled: false
            };

            const updateClients = clients.map((client) => {
                if (client.id === updateClient.id) {
                    return updateClient;
                } else {
                    return client;
                }
            });

            await clientRespository.write(updateClients);

            return updateClient;
        },

        disableClient: async(_, { id }) => {
            const clients = await clientRespository.read();

            const currentClient = clients.find((client) => client.id === id);

            if (!currentClient) {
                throw new Error(`No client found with this ${id}`);
            }

            if (currentClient.disabled) {
                throw new Error(`Client "${id}" is alredy disabled`);
            }

            const updateClient = {
                ...currentClient,
                disabled: true
            };

            const updateClients = clients.map((client) => {
                if (client.id === updateClient.id) {
                    return updateClient;
                } else {
                    return client;
                }
            });

            await clientRespository.write(updateClients);

            return updateClient;
        },

    }
};