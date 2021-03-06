/* globals require  */

const config = require('./server/config/'),
    app = require('./server/config/application'),
    data = require('./server/data')(config),
    passport = require('passport'),
    controllers = require('./server/controllers')({ data, passport });

require('./server/config/passport')(app, data, passport);
require('./server/routers')({ app, data, controllers, passport });

app.listen(config.port);

console.log(`Server is running on port: ${config.port}`);
