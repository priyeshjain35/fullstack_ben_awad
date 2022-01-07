import { MikroORM } from "@mikro-orm/core";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import "reflect-metadata";
import { express_port, __prod__ } from "./constants";
import { ApolloServer } from "apollo-server-express";
import {buildSchema} from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

import * as redis from 'redis';
import session from 'express-session';
import connectRedis from "connect-redis";
import { MyContext } from "./types";

const RedisStore = connectRedis(session);
const redisClient = redis.createClient();

const main = async () => {
    const orm = await MikroORM.init(mikroConfig);

    // to run the migrations automatically.
    await orm.getMigrator().up();

    const app = express();

    app.use(
        session({
            name: 'qid',
            store: new RedisStore({ client: redisClient, disableTouch: true }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                httpOnly: true,
                secure: __prod__, //cookie only works in https
                sameSite: 'lax'
            },
            saveUninitialized: false,
            secret: 'some hidden key',
            resave: false,
        })
    )

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        context: ({req, res}): MyContext => ({
            em: orm.em, req, res
        })
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({ app });

    app.get("/", (_, res) => {
        res.send("Hello");
    });

    app.listen(express_port, () => {
        console.log("node is running on port: "+express_port);
    });

}

main().catch(err => {
    console.log(err);
});



console.log("Hello Priyesh!!");