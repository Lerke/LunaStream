"use strict";
var VERSIONID = '1.0.0';

/*
 * Modules
 */

var express = require('express');
var http = require('http');
var fs = require('fs');
var _ = require('underscore');
var path = require('path');
var xml2js = require('xml2js');
var StreamController = new StreamHost();
/**
 * PORT NUMBER
 * Default is 9003
 */
var portnum;
var hostname;
var statpath;
var cachepath;
var serverprefix;

var xmlparser = new xml2js.Parser();

InitVariables();

/** Routing */
var app = express();
var server = http.Server(app).listen(portnum);

console.log("Started listening (" + portnum + " )");

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function (request, response) {
	response.render('streamlist.ejs', {Host: JSON.stringify(StreamController), servername: hostname, cache: cachepath, prefix: serverprefix});
});

app.get('/streams/:stream', function (request, response) {
	response.render('stream.ejs');
});

setInterval(UpdateStreams, 5000);

/** FUNCTIONS **/
function InitVariables() {
	var optionVars = JSON.parse(fs.readFileSync('options.json'));
	portnum = optionVars["port"];
	hostname = optionVars["hostname"];
	statpath = optionVars["path"];
	cachepath = optionVars["cache"];
	serverprefix = optionVars["prefix"];
	UpdateStreams();
}

function UpdateStreams() {
	var options = {
		hostname: hostname,
		path: statpath
	}
	http.get(options, function (response) {
		var cresponse = "";
		response.on('data', function (e) {
			cresponse += e;
		});
		response.on('end', function () {
			//update our streams list here.
			xmlparser.parseString(cresponse, function (err, data) {

				var streamdata = data["rtmp"]["server"][0]["application"][0]["live"][0];
				var Streams = [];
				for (var stream in streamdata["stream"]) {
						var videoData = new Video(
							streamdata["stream"][stream]["meta"][0]["video"][0]["width"][0],
							streamdata["stream"][stream]["meta"][0]["video"][0]["height"][0],
							streamdata["stream"][stream]["meta"][0]["video"][0]["frame_rate"][0],
							streamdata["stream"][stream]["meta"][0]["video"][0]["codec"][0]
							);
						var audioData = new Audio(
							streamdata["stream"][stream]["meta"][0]["audio"][0]["codec"][0],
							streamdata["stream"][stream]["meta"][0]["audio"][0]["channels"][0],
							streamdata["stream"][stream]["meta"][0]["audio"][0]["sample_rate"][0]
							)
						var newStream = new Stream(
							streamdata["stream"][stream]["name"],
							streamdata["stream"][stream]["time"],
							videoData,
							audioData,
							streamdata["stream"][stream]["nclients"]
							);
						Streams.push(newStream);
				}
				StreamController.streams = Streams;
				StreamController.clients = streamdata.nclients;
			});
		});
	});
}

function StreamHost() {
	this.streams = [];
	this.clients = 0;
}

/** TYPE DEFINITIONS **/
function Stream(_name, _time, _video, _audio, _viewers) {
	this.name = _name;
	this.time = _time;
	this.viewers = _viewers;
	this.video = _video;
	this.audio = _audio;
}

function Video(_width, _height, _framerate, _codec) {
	this.width = _width;
	this.height = _height;
	this.framerate = _framerate;
	this.codec = _codec;
}

function Audio(_codec, _channels, _samplerate) {
	this.codec = _codec;
	this.channels = _channels;
	this.samplerate = _samplerate;
}