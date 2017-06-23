'use strict';

const Hapi = require('hapi');

var mongoose = require('mongoose')
const booliSchema = require('./schema')
mongoose.connect('mongodb://localhost/test')

var booliItem = mongoose.model('Booli', booliSchema)

const server = new Hapi.Server();
server.connection({ port: 3333, routes: { cors: true }});

server.route({
    method: 'PUT',
    path: '/items/toggleInterest/',
    handler: function (request, reply) {
      booliItem.findById(request.query.id, function(err, item) {
          if(err) { reply('Boo!') }

          item.interested = !item.interested;
          item.save(function(err, updatedItem) {
              if(err) { reply('Boohoo!') }
              reply(updatedItem)
          })
      })
    }
});

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
