'use strict';

const ctrlResponses = ( ()=> {

	var module 	= {};
	var self 	= module;

	module.sendErrorServer = (res, error)=> {
		var msg = {};

		msg.code = 500;
		msg.description = error || 'server error';
		res.status(500).jsonp(msg);
	};

	module.sendErrorNotFound = (res, error)=> {
		var msg = {};

		msg.code = 404;
		msg.description = error || 'not found';
		res.status(404).jsonp(msg);
	};

	module.sendErrorBadReq = (res, error)=> {
		var msg = {};

		msg.code = 400;
		msg.description = error || 'bad request';
		res.status(400).jsonp(msg);
	};

	module.sendSuccess = (res, data)=> {
		var msg = {};

		msg.code = 200;
		msg.data = data || 'done';
		res.status(200).jsonp(msg);
	};

	return {
		sendErrorServer: module.sendErrorServer,
		sendErrorNotFound: module.sendErrorNotFound,
        sendErrorBadReq: module. sendErrorBadReq,
        sendSuccess: module. sendSuccess
	};

} )();

module.exports = ctrlResponses;