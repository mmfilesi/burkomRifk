'use strict';

/* TODO:
	delete
	update
	getAuthor
*/

const Q 		= require('../../node_modules/Q');
const mongoose 	= require('../../node_modules/mongoose');
const Schema 	= mongoose.Schema;

const pAuthorsSchema = new Schema({
  	name: {
  		type: String,
  		unique:true
  	},
  	created: {
  		type: Date, 
  		default: Date.now 
  	}
});

const Authors = mongoose.model('Authors', pAuthorsSchema);

const modAuthors = (function() {

	const module  	= {};
 	const self    	= module;

 	module.getAuthor = function(idAuthor) {
		var deferred = Q.defer();

 		if ( !idAuthor ) {
 			return deferred.reject('no id');
 		}

		Authors.findById(idAuthor, function (err, author) {
		 	if ( err ) {
		 		return deferred.reject('not found');
		 	}
		  	return deferred.resolve(author);
		});

		return deferred.promise;		
 	}; 

 	module.getAuthors = function() {
		var deferred = Q.defer();

		Authors.find(function (err, authors) {
		 	if ( err ) {
		 		return deferred.reject(err);
		 	}
		  	return deferred.resolve(authors);
		});

		return deferred.promise;		
 	};

 	module.deleteAuthor = function(idAuthor) {
 		var deferred 	= Q.defer();

 		if ( !idAuthor ) {
 			return deferred.reject('no id author');
 		}

		Authors.findByIdAndRemove(idAuthor, function (err, authors) {
		 	if ( err ) {
		 		return deferred.reject(err);
		 	}
		  	return deferred.resolve();
		});

 		return deferred.promise;
 	};

 	module.addAuthor = function(authorName) {
		var deferred = Q.defer();
		var author 	 = new Authors({
			name: authorName 
		});

		if ( !authorName ) {
			return deferred.reject('no author');
		}

		author.save(function (err) {
		 	if ( err ) {
		 		return deferred.reject(err);
		 	}
		  	return deferred.resolve();
		});

		return deferred.promise;		
 	};

	return {
    	addAuthor: 		module.addAuthor,
    	getAuthors: 	module.getAuthors,
		getAuthor: 		module.getAuthor,
		deleteAuthor: 	module.deleteAuthor
	};

} )();

module.exports = modAuthors;