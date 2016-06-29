'use strict';

const ctrlResponses = require('../controllers/c-responses');
const pAuthors 	    = require('../models/pinterest-authors');

const restPinterest = ( ()=> {

	var module 	= {};
	var self 	= module;

	module.addAuthor = (req, res)=> {

		if ( !req.body.author ) {
			ctrlResponses.sendErrorBadReq(res, 'no author');
			return;
		}

 		pAuthors.addAuthor(req.body.author).then(
			(data)=>{
				ctrlResponses.sendSuccess(res);
			},
			(error)=>{
				if ( error.hasOwnProperty('code') && error.code === 11000 || error.code === 11001) {
					ctrlResponses.sendSuccess(res, 'author duplicate');
				} else {			
					ctrlResponses.sendErrorServer(res);
				}
			});
	};

	module.getAuthors = (req, res)=> {

		if ( req.query.id ) {
			pAuthors.getAuthor(req.query.id).then(
				(data)=>{
					ctrlResponses.sendSuccess(res, data);
				},
				(error)=>{
					ctrlResponses.sendErrorNotFound(res);
				});
		} else {
			pAuthors.getAuthors().then(
				(data)=>{
					ctrlResponses.sendSuccess(res, data);
				},
				(error)=>{
					ctrlResponses.sendErrorServer(res);
				});
		}
	};

	return {
		addAuthor: module.addAuthor,
		getAuthors: module.getAuthors
	};

} )();

module.exports = restPinterest;