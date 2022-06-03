import { gql } from 'apollo-server-express';
import createRepository from '../../io/Database/createRepository';
import { ListSortmentEnum } from '../List/List';

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
}