var keyWord = process.argv[2];
var userInput = process.argv[3];

require("dotenv").config();
var axios = require("axios");
var fs = require("fs");
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

function searchItem (keyWord, userInput) {

  switch (keyWord) {

      case 'spotify-this-song':

            spotifySong(userInput);

          break;
  }

var artistName = function(artist) {
    return artist.name;
  };
  
var spotifySong = function(songName) {

  spotify.search({ type: 'track', query: songName }, function(err, data) {
    if (err) {
      console.log('Error occurred: ' + err);
      return;
    }

    var songs = data.tracks.items;

    for (var i = 0; i < songs.length; i++) {
      console.log({
        'artist(s)': songs[i].artists.map(artistName),
        'song name: ': songs[i].name,
        'preview song: ': songs[i].preview_url,
        'album: ': songs[i].album.name,
      });
    }
  });
};