var mongoose = require('mongoose');

let Schema = mongoose.Schema;

const itemSchema = new Schema({
  seconds: Number,
  meters: Number,
  interested: { type: Boolean, default: true },
  showings: [Date],
  item: {
    booliId: Number,
    listPrice: Number,
    published: Date,
    source: {
      name: String,
      url: String,
      type: { type: String }
    },
    location: {
      namedAreas: [String],
      region: {
        muncipalityName: String,
        countyName: String
      },
      address: {
        streetAddress: String
      },
      position: {
        latitude: Number,
        longitude: Number
      }
    },
    objectType: String,
    rooms: Number,
    livingArea: Number,
    rent: Number,
    floor: Number,
    url: String
  }
});

module.exports = itemSchema;
