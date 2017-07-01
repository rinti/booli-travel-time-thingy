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

const GOOGLE_API_BASE_URL = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&mode=transit'

booli = new Booli(BOOLI_CALLER_ID, BOOLI_API_KEY)

var getDistanceAndTime = async function(lat, lng) {
  lat = encodeURIComponent(lat)
  lng = encodeURIComponent(lng)
  const dest = encodeURIComponent(DESTINATION)
  const url = `${GOOGLE_API_BASE_URL}&origins=${lat},${lng}&destinations=${DESTINATION}&key=${GOOGLE_KEY}`

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
  limit: 25 
}

const fetchData = async function() {
  const listings = await booli.listings(search_params)
  const res = await listings.json()
  let items = [];

  for (var i = 0; i < res.listings.length; i++) {
    const item = res.listings[i];

    let itemExists = Boolean(
      await booliItem.findOne({'item.booliId': item.booliId})
    )
    if(itemExists) {
      console.log('Skipping..')
      continue;
    }

    let dist = await getDistanceAndTime(item.location.position.latitude, item.location.position.longitude)
    let d = dist.rows[0].elements[0]
    obj = {
      meters: d.distance.value,
      seconds: d.duration.value,
      item
    }
    items.push(obj)
  }

  return items
}

fetchData().then(async function(items) {
  await items.forEach((item) => {
    var i = new booliItem(item);
    i.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('saved item');
      }
    });
  })

  mongoose.disconnect()
})

