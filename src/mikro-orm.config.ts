import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { User } from "./entities/User";

export default {
    migrations: {
        path: path.join(__dirname, './migrations'), // path to the folder with migrations
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [Post, User],
    dbName: 'lireddit',
    type: 'postgresql',
    debug: !__prod__,
    user: 'postgres',
    password: 'postgres'
} as Parameters<typeof MikroORM.init>[0];

// ----------------------Another Optional way----------------------------------
// import { Options } from "@mikro-orm/core";
// const mikroConfig: Options =  {
//     entities: [Post],
//     dbName: 'lireddit',
//     type: 'postgresql',
//     debug: !__prod__,
//     user: 'postgres',
//     password: 'postgres'
// };

// export default mikroConfig;