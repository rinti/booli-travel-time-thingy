require('dotenv').config()

const _ = require("lodash")
const fetch = require("node-fetch")
const Booli = require("booli-api")

var mongoose = require('mongoose')
const booliSchema = require('./schema')
mongoose.connect('mongodb://localhost/test')
mongoose.Promise = global.Promise

var booliItem = mongoose.model('Booli', booliSchema)

const GOOGLE_KEY = process.env.GOOGLE_API_KEY
const BOOLI_API_KEY = process.env.BOOLI_API_KEY
const BOOLI_CALLER_ID = process.env.BOOLI_CALLER_ID
const DESTINATION = process.env.DESTINATION

booli = new Booli(BOOLI_CALLER_ID, BOOLI_API_KEY)

var getDistanceAndTime = async function(lat, lng) {
  var url = "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&mode=transit&origins="
    + encodeURIComponent(lat)
    + ","
    + encodeURIComponent(lng)
    + "&destinations="
    + encodeURIComponent(DESTINATION)
    + "&key=" + GOOGLE_KEY
  try {
    let response = await fetch(url)
    return await response.json()
  } catch(err) {
    console.log("ERROR: ", err)
  }
}

const search_params = {
  areaId: "35,143,1454,7300,115355,874645,874646,874647,874648,874651,874652,874654",
  isNewConstruction: 0,
  maxListPrice: 2400000,
  maxRent: 3000,
  minLivingArea: 25,
  limit: 3
}

var getDataz = async function() {
  let listings = await booli.listings(search_params)
  let res = await listings.json()
  let counter = 0
  let items = await res.listings.map(async function(item) {
    let dist = await getDistanceAndTime(item.location.position.latitude, item.location.position.longitude)
    console.log("----------------------------")
    console.log(dist)
    let d = dist.rows[0].elements[0]
    return {
      meters: d.distance.value,
      seconds: d.duration.value,
      item
    }
  })
  return items
}

getDataz().then((items) => {
  items.forEach((item) => {
    var i = new booliItem(item);
    i.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('saved item');
      }
    });
  })
  booliItem.find(function(err, items) {
    console.log(err, items)
  })
  // items = _.orderBy(items, (i) => i.seconds, 'desc')
  // console.log(items)
})
