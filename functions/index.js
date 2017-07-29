
//bringing in required modules
const functions = require('firebase-functions');
const Speech = require('@google-cloud/speech');
const fs = require('fs');

//this one's going to allow us to record from a microphone later
const record = require('node-record-lpcm16');

//Initializing instance of Speech on our project
const projectId = 'bosa-e0956';
const speech = Speech({
  projectId: projectId
});

//starting the function
exports.helloBosa = functions.https.onRequest((request, response) => {

  //this is a remote file saved in my own firebase. Probably won't work here, but if you feel like playing with it, do so here. Currently this is working with a local file, not this remote file, but you got you a function that can do both. 
const fileNameUrl = 'gs://bosa-beta.appspot.com/audio-file.flac';

//thse are the audio parameters you need to pass the speech function. Some are optional
const options = {
        "encoding":"LINEAR16",
        "sampleRateHertz": 44100,
        "languageCode": "en-US"
    };

    //if you want to try another file, put the audio parameters here and just put options2 in the 'req' variable below instead of 'options'
    const options2 = {
        
    };

    //passing the remote audio filename as an object
    const audiofile = {
      uri: fileNameUrl
    }

    //declaring the local filename instead of the remote one. 
    const audiofile2 = {content: fs.readFileSync('./something.mp3').toString('base64')};

    //the actual request being passed to google speech: the audio file parameters defined above AND the audio filename object. 
    var req = {
      config: options,
      audio: audiofile2
    }

  //passing the above req object to google speech
  speech.recognize(req).then((results) => {


    //sets the variable 'transcription' to be a stringified version of the JSON data that is passed back. Currently includes the transcription and the certainty.
    const transcription = JSON.stringify(results[0].results[0].alternatives[0]);
    
    //I'm console logging the whole results json object just in case. you'll see it in the firebase logs
    console.log(JSON.stringify(results[0]));
    
    //sends the transcription to the screen in the most basic form. In a later iteration of this project, this will be sent to a particular element or something. Currently there are no styles or anything. 
    response.send(transcription);

    //if there's an error, it will appear in the console. 
  }).catch((err) => {
    console.log(err);
  });
});

