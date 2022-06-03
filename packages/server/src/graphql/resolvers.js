import { resolvers as demandResolver } from "./Demand/Demand";

const resolvers = {
    ...demandResolver,

    Query: {
        ...demandResolver.Query,
    },
};

export default resolvers;