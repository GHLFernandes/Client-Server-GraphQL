import { typeDefs as clientTypeDefs } from "./Client/Client";
import { typeDefs as demandTypeDefs } from "./Demand/Demand";
import { typeDefs as nodeTypeDefs } from "./Node/Node";
import { gql } from 'apollo-server-express';

export const typeDefs = gql `
    type Query{
        _root: String
    }

    ${clientTypeDefs}
    ${demandTypeDefs}
    ${nodeTypeDefs} 
`;