var keyWord = process.argv[2];
var userInput = process.argv.slice(3).join("+");

require("dotenv").config();
var axios = require("axios");
var request = require("request");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var fs = require("fs");
var moment = require("moment");
var spotify = new Spotify(keys.spotify);

var textFile = "log.txt";
commandSwitch(keyWord, userInput);
function commandSwitch(keyWord, userInput) {
  switch (keyWord) {
    case 'concert-this':
      concertThis(userInput);
      break;
    case 'spotify-this-song':
      spotifyThis(userInput);
      break;
    case 'movie-this':
      movieThis(userInput);
      break;
    case 'do-what-it-says':
      doWhatItSays();
      break;
    default:
      console.log("Please use a valid command.")
      return;
  }
}

function concertThis(userInput) {
  var artist = userInput;
  var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp&tracker_count=10";
  request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      body = JSON.parse(body);
      for (var event in body) {
        display("Venue: ", body[event].venue.name);
        display("Location: ", body[event].venue.city + ", " + body[event].venue.region + ", " + body[event].venue.country);
        var m = moment(body[event].datetime).format('MM/DD/YYYY, h:mm a').split(", ");
        display("Date: ", m[0]);
        display("Time: ", m[1]);
        contentAdded();
      }
    }
  });
}

function spotifyThis(userInput) {
  var song = userInput;
  if (!song) {
    song = "Pizza";
    console.log(song);
  }
  spotify.search({
    type: 'track', query: song
  }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    data = data.tracks.items[0];

    display("Artist(s) Name: ", data.artists[0].name);
    display("Track Name: ", data.name);
    display("Preview URL: ", data.preview_url);
    display("Album: ", data.album.name);
    contentAdded();
  });
}

function movieThis(userInput) {
  var movieName = userInput;
  if (!movieName) {
    movieName = "Fight+Club"
  };
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
  request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      body = JSON.parse(body);
      display("Title: ", body.Title);
      display("Year: ", body.Year);
      display("IMDB Rating: ", body.imdbRating);
      if (body.Ratings[2]) {
        display("Rotten Tomatoes Score: ", body.Ratings[2].Value);
      }
      display("Country: ", body.Country);
      display("Language: ", body.Language);
      display("Plot: ", body.Plot);
      display("Actors: ", body.Actors);
      contentAdded();
    }
  });
}

function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }
    var dataArr = data.replace(/(\r\n|\n|\r)/gm, "").split(",");
    for (var i = 0; i < dataArr.length; i += 2) {
      var keyWord = dataArr[i];
      var userInput = dataArr[i + 1].replace(/['"]+/g, '').split(' ').join("+");
      commandSwitch(keyWord, userInput);
    }
  });
}

function display(description, data) {
  console.log(description + data);
  appendFile(description + data + "\n");
}

function contentAdded() {
  console.log("");
  console.log("Content Added!");
  console.log("-----------------------------------\n");
  appendFile("-----------------------------------\n");
}

function appendFile(userInput) {
  fs.appendFile(textFile, userInput, function(err) {
    if (err) {
      console.log(err);
    } else {}
  });
}