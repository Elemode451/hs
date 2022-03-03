
const axios = require("axios");
const cheerio = require("cheerio");
const request = require("request-promise");
const fetch = require("node-fetch");
const fs = require("fs")
var url = "https://prt.wostreaming.net/prt/nowplaying/2/20/6312/nowplaying.json";

class Song{ // Song class - creates a song object
    constructor(name, artist, duration, coverurl = null){
        this.name = name;
        this.artist = artist;
        this.duration = duration;
        this.coverurl = coverurl;
    }
    
}

class Station{ // Station class: creates a radio station
    constructor(name, adress){
        this.name = name;
        this.adress = adress;
    }
    addSong(song){ // Add song method which creates an entry in songsPlayed with the date the song was played as the key and the song as the value. 
        let date = new Date();
        sleep(200);
        this.songsPlayed[date] = song;
    }
    
    songsPlayed = { // Object literal containing what songs have been played correspondant to the date they were played at.

    }
    countPlays(song) { // Counts plays for a specific song that was played. 
        let counter = 0;
        let temp = this.songsPlayed;
        for(const dates in temp){
            console.log(`${dates} and also ${temp[dates]}`);
            if(temp[dates]===song){
                counter++;
            }
        }
        return counter;
    } 
}


function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

Station.prototype.toString = function(){
    return this.name + " " + this.adress;
}
Song.prototype.toString = function(){
    return this.name + " " + this.artist;
}

async function fetchHTML(url) {
  const { data } = await axios.get(url);
  const chippy = cheerio.load(data);
  console.log(chippy);
  return chippy;

}

fetch(url)
    .then(result => result.json())
    .then((output) => {
        console.log("Writing...");
        fs.writeFile("songsdata.json", JSON.stringify(output), placeholder);

          
}).catch(err => console.error(err));

fetch(url);
const placeholder = function(){
    console.log("Written.");
    
}
