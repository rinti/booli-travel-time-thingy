const _ = require("lodash")
const fetch = require("node-fetch")
const RSVP = require("rsvp")
const Booli = require("booli-api")

GOOGLE_KEY = ""
BOOLI_API_KEY = ""
BOOLI_CALLER_ID = ""
DESTINATION = ""

booli = new Booli(BOOLI_CALLER_ID, BOOLI_API_KEY)


const textToMinutes = (text) => {
  let hours = text.match(/(\d+) hour/)
  hours = hours ? hours[1] : 0
  const mins = text.match(/(\d+) min/)[1]
  return (parseInt(hours, 10) * 60) + parseInt(mins, 10)
}

const getDistanceAndTime = (lat, lng) => {
  var url = "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&mode=transit&origins="
    + encodeURIComponent(lat)
    + ","
    + encodeURIComponent(lng)
    + "&destinations="
    + encodeURIComponent(DESTINATION)
    + "&key=" + GOOGLE_KEY
  return fetch(url).then((resp) => { return resp.json() })
};

const search_params = {
  areaId: "35,143,1454,7300,115355,874645,874646,874647,874648,874651,874652,874654",
  isNewConstruction: 0,
  maxListPrice: 2400000,
  maxRent: 3000,
  minLivingArea: 25,
  limit: 500
}

booli.listings(search_params).then(res => res.json()).then((res) => {
  res.listings.forEach((item) => {
    let promise = getDistanceAndTime(item.location.position.latitude, item.location.position.longitude);
    promise.then((resp) => {
      if(item.listPrice < 2000000 && textToMinutes(resp.rows[0].elements[0].duration.text) < 30) {
        console.log(item.location.namedAreas[0])
        console.log(resp.rows[0].elements[0].duration.text)
        console.log(item.listPrice)
        console.log(item.url)
        console.log("------------------")
      }
    })
  })
})

