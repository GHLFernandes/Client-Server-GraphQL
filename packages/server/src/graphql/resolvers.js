import { resolvers as demandResolvers } from "./Demand/Demand";
import { resolvers as clientResolvers } from "./Client/Client";
import { resolvers as nodeResolvers } from "./Node/Node";

const resolvers = {
    ...nodeResolvers,
    ...clientResolvers,
    ...demandResolvers,

    Query: {
        ...clientResolvers.Query,
        ...demandResolvers.Query,
    },
};

export default resolvers;