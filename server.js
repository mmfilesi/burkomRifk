'use strict';

// TODOS: delete author

/* ============================================
	load modules
============================================= */

const express 			= require('express');
const bodyParser  		= require('body-parser');
const methodOverride 	= require('method-override');
const mongoose 			= require('mongoose');
const Q 				= require('Q');

const app 				= express();
const router 			= express.Router();

const restPinterest 	= require('./server-modules/rest/pinterest');

const msg				= require('./burkom-modules/br-messages');

const dbPath 			= 'mongodb://localhost:27017/br';

/* ============================================
	Server config
============================================= */

const server = ( ()=> {

	var module 	= {};
	var self 	= module;

	module.configStatic = {
		index: 'index.html',
		dotfiles: 'deny',
		etags: true,
		lasModified: true
	};

	module.configServer = ()=> {
		app.use(bodyParser.urlencoded({ extended: false }));
		app.use(bodyParser.json());  
		app.use(methodOverride());
	};

	module.configRoutes = ()=> {

		/* rest */
		var endpoints = express.Router();

		endpoints.route('/authors')  
  			.get(restPinterest.getAuthors)
  			.post(restPinterest.addAuthor);

		app.use('/rest', endpoints);

		/* static files */
		app.get('/', (req, res)=> {
			res.sendFile(__dirname + '/public/index.html');
		} );

		app.use( express.static('public', self.configStatic) );

		/* error responses */
		app.use( (req, res)=> {
			res.status(404).send('404: ahí no hay ná de ná', 404);
		} );

		app.use( (err, req, res, next)=> {
			res.status(500).send('500: Sa roto!');
		} );
	};

	module.init = ()=> {
		self.configServer();
		self.configRoutes();
		app.use(router);
	};

	return {
		init: module.init
	};

} )();

/* ============================================
	Init
============================================= */

const bootstrap = ( ()=> {
	var module 	= {};
	var self 	= module;

	module.initConnection = ()=> {
		var deferred = Q.defer();

		mongoose.connect(dbPath, (err, res)=> {  
			if (err) {
		    	msg.showError('ERROR: connecting to Database. ' + err);
				return deferred.reject(err);
		  	}
		  	msg.showSuccess('conected with Database');
		  	return deferred.resolve();
		});

		return deferred.promise;
	};

	module.init = ()=> {
		server.init();
		self.initConnection().then(function() {
		 	app.listen(3000, function() {
		    	console.log("Node server running on http://localhost:3000");
		  	});
		});
	};

	return {
		init: module.init
	};

} )();

bootstrap.init();