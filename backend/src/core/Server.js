import express from 'express';
import passport from 'passport';

import bodyParser from 'body-parser';
import CC from './CommonClass';

class Server extends CC {
    constructor(params) {
        super();
        this.params = params;
    }

    start(params) {
        const {
            port = 9000,
            host = 'localhost',
            routers = [],
            middlewares = [],
            strategies = [],
        } = this.params;

        if (routers.length === 0) {
            throw new Error(`\'routers'\ shoud be an array with non-zero length`)
        }

        if (middlewares.length === 0) {
            throw new Error(`\'middlewares'\ shoud be an array with non-zero length`)
        }

        return new Promise((res, rej) => {

            const app = express();

            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({ extended: false }));
            app.use(passport.initialize());
            app.use(passport.session());

            for (const strategy of strategies) {
                passport.use(strategy)
            }

            passport.serializeUser(function(user, done) {
                done(null, user);
            });

            passport.deserializeUser(function(id, done) {
                done(null, user)
            });

          for (const middleware of middlewares) {
            console.log('Add middleware', middleware.handler)
            app.use(middleware.handler())
          }

            for (const item of routers) {
                app.use(item.router)
            }


            return app.listen(port, host, () => res({port, host}))
        })
    }

    successCb(params) {
        console.log(`Server successful start at ${params.host}:${params.port}`)
    }

    errorCb(err) {
        console.log(`Server can't start at with error ${err}`)
    }
}

export default Server;
