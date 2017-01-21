'use strict';

const Hapi = require('hapi');

var mongoose = require('mongoose')
const booliSchema = require('./schema')
mongoose.connect('mongodb://localhost/test')

var booliItem = mongoose.model('Booli', booliSchema)

const server = new Hapi.Server();
server.connection({ port: 3333, routes: { cors: true }});

server.route({
    method: 'GET',
    path: '/items/',
    handler: function (request, reply) {
      booliItem.find(function(err, items) {
        reply(items);
      })
    }
});

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});
