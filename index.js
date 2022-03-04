
const axios = require("axios");
const cheerio = require("cheerio");
const request = require("request-promise");
const fetch = require("node-fetch");
const fs = require("fs");
const { defaultMaxListeners } = require("events");

class Song{ // Song class - creates a song object
    constructor(name, artist, coverurl, time){
        this.name = name;
        this.artist = artist;
        this.coverurl = coverurl;
        this.time = time;
    }

}

class Station{ // Station class: creates a radio station
    constructor(name, adress, url, json,){
        this.name = name;
        this.adress = adress;
        this.url = url;
        if(json){
            startScrapeJSON(url, this);
        } 
    }
    addSong(song){ // Add song method which creates an entry in songsPlayed with the date the song was played as the key and the song as the value. 
        let date = song.time;
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
  console.log(chippy.toJSON());
  return chippy;

}
let startScrapeJSON = function(url, station){
    fetch(url)
        .then(result => result.json())
        .then((output) => {
            console.log("Writing...");
            fs.writeFile([station]+".json", JSON.stringify(output), getData);
            for(let i = 0; i < output.performances.length; i++){
                let songNumber = output.performances[i];
                let songTitle = songNumber.title;
                let songArtist = songNumber.artist;
                let coverUrl = songNumber.largeImage;
                let time = songNumber.time;
                if(typeof globalThis[songTitle] === "undefined"){
                    globalThis[songTitle] = new Song(songTitle, songArtist, coverUrl, time);
                    station.addSong(globalThis[songTitle]);
                    console.log(station.songsPlayed);
                } 
                
                
            }

            
    }).catch(err => console.error(err));
}
const getData = function(){
    console.log("Written.");
}


const startScrapeHTML = function(url, station){
    
}
// fetchHTML("https://api.tunegenie.com/api/v2/brand/nowplaying/?apiid=m2g_bar&b=kplz&count=50&format=json");
let kafe = new Station("Kafe", "104.1", "https://api.tunegenie.com/v2/brand/nowplaying/?apiid=m2g_bar&b=kplz&count=10", false);
// let star = new Station("Star", "101.5", "https://api.tunegenie.com/api/v2/brand/nowplaying/?apiid=m2g_bar&b=kplz&count=10", true)
