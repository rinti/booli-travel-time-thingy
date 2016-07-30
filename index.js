const _ = require("lodash")
const cheerio = require("cheerio")
const fetch = require("node-fetch")
const RSVP = require("rsvp")

// config
const GOOGLE_KEY = "" // need a valid google distance matrix key
const DESTINATION = "Stockholm Centralstation" // where you want to go
const FILTER_URL = "https://www.booli.se/solna,stockholms+innerstad,gamla+enskede,bromma,johanneshov,grondal,enskede,enskede+gard,enskededalen,hammarbyhojden,liljeholmen/35,143,1454,115355,874645,874646,874647,874648,874651,874652,874654/?direction=asc&isNewConstruction=0&maxListPrice=2400000&maxRent=3000&minLivingArea=25&sort=listSqmPrice" // any filtered booli url you want, this was what I was searching for.


let origins = []

const promise = fetch(FILTER_URL).then(resp => resp.text()).then((resp) => {
  let $ = cheerio.load(resp)
  $(".search-list__row.search-list__row--bold.search-list__row--address").each((i, item) => {
    origins.push($(item).text())
  });
});


const textToMinutes = (text) => {
  let hours = text.match(/(\d+) hour/)
  hours = hours ? hours[1] : 0
  const mins = text.match(/(\d+) min/)[1]
  return (parseInt(hours, 10) * 60) + parseInt(mins, 10)
}

const getDistanceAndTime = (origin) => {
  origin = origin + ', Stockholm' // failsafe if the address is available in another city
  var url = "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&mode=transit&origins="
    + encodeURIComponent(origin)
    + "&destinations="
    + encodeURIComponent(DESTINATION)
    + "&key=" + GOOGLE_KEY

  return fetch(url).then(resp => resp.json())
};


promise.then(() => {
  origins = origins.map(dest => getDistanceAndTime(dest))
  RSVP.all(origins).then((items) => {
    items = items
      .map((item) => {
        return {
          from: item.origin_addresses[0],
          verbose: item.rows[0].elements[0].duration.text,
          time: textToMinutes(item.rows[0].elements[0].duration.text)
        }
      })
    items = _.sortBy(items, "time")
    console.log(items.reverse())
  })
})
