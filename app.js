const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const path = require('path');
const bodyParser = require('body-parser');

const configurations = {
	// Note: You may need sudo to run on port 443
	production: {ssl: true, port: 443, hostname: 'example.com'},
	development: {ssl: false, port: 3001, hostname: 'localhost'}
};
const environment = process.env.NODE_ENV || 'development';

const config = configurations[environment];

const app = express();

// models
const User = require('./models/User');
const ProductCategories = require('./models/ProductCategories');
const Products = require('./models/Products');

// routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
// graphQl

const { typeDefs } = require('./grapQl/typeDefs');
const { resolvers } = require('./grapQl/resolvers');
const apollo = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }) => ({
		User,
		ProductCategories,
		Products
	})
});
apollo.applyMiddleware({app});
// DB config
const db = require('./config/keys').mongolocal;
// app.use(async(req, res, next) => {
// 	const token = req.headers['authorization'];
// 	console.log(token, Date.now)
// 	if (token !== 'null') {
// 		try {
// 			req.currentUser = await jwt.verify(token, process.env.SECRET);
// 		}
// 		catch (e) {
// 			console.log(e);
// 		}
// 	}
// 	next();
// });

// connect to mongo DB
mongoose
	.connect(db)
	.then(() => console.log('MongoDB connected'))
	.catch(err => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

let server = http.createServer(app);
apollo.installSubscriptionHandlers(server);

server.listen({ port: config.port }, () => console.log(`http${config.ssl ? 's' : ''}://${config.hostname}:${config.port}${apollo.graphqlPath}`));
