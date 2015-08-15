var usernames = ["freecodecamp", "medrybw", "storbeck", "terakilobyte", "habathcx",
"RobotCaleb","comster404","thomasballinger","noobs2ninjas",];
var users = ["medrybw"];
var streamURL = 'https://api.twitch.tv/kraken/streams/';
var userURL   = 'https://api.twitch.tv/kraken/users/';
var channelURL = 'https://twitch.tv/';

function getData(usernamesArr){
	usernamesArr.forEach(function(username){
		getUsernameInfo(username);
	});
}
//GET functions
function getUsernameInfo(username){
	$.getJSON(
		userURL + username + '?callback=?', addUserInfo);
}

function appendUserInfo(username, htmlBlock){
	var newHtmlBlock = "";
	$.getJSON(
		streamURL + username + '?callback=?', function(streamJSON){
			var streamState = streamJSON.stream;
			var streamStatus = "";
			if (streamState)
				streamStatus = streamJSON.stream.channel.status.substr(0,44) + "...";
	    newHtmlBlock = addStreamStatus(streamState, streamStatus,  htmlBlock);
	    $('#people').append(newHtmlBlock);
	});
}

//callback functions
function addUserInfo(userJSON){
	var display = userJSON.display_name;
	var html =
	"<div class='stream' id='" + userJSON.name + "'>" +
	"<img src='" + checkForLogo(userJSON.logo) + "'>" +
	"<a href='" + channelURL + userJSON.name + "'>" + display + "</a>";
	appendUserInfo(userJSON.name, html);
}
//helper functions
function checkForLogo(logo){
	if (logo)
		return logo;
	return 'http://goo.gl/PyHkxg';
}

function addStreamStatus(streamState, streamStatus, htmlBlock){
	if (streamState){
		htmlBlock =
		[htmlBlock.slice(0, 18), " online'", htmlBlock.slice(19)].join('');
    return htmlBlock +
    "<span class='status glyphicon glyphicon-play'></span>" +
    "<p>" + streamStatus + "</p></div>";
	}
	htmlBlock =
		[htmlBlock.slice(0, 18), " offline'", htmlBlock.slice(19)].join('');
    return htmlBlock +
    "<span class='status glyphicon glyphicon-pause'></span></div>";
}
function searchFilter(queryStr){
	var usersWithQuery = [], usersWithoutQuery = [];
	usernames.forEach(function(username){
		if (username.toLowerCase().includes(queryStr))
			usersWithQuery.push(username.toLowerCase());
		else
			usersWithoutQuery.push(username.toLowerCase());
	});
	usersWithoutQuery.forEach(function(username){
		var userID = "#" + username;
		$(userID).addClass("filtered");
	});
	usersWithQuery.forEach(function(username){
		var userID = "#" + username;
		$(userID).removeClass("filtered");
	});
}

$(document).ready(function(){
	getData(usernames);
	$('input').on('keyup change', function(){
		searchFilter($(this).val());
	});
	$('#online').click(function(){
		$('.offline').addClass("hidden");
		$('.online').removeClass("hidden");
	});
	$('#offline').click(function(){
		$('.online').addClass("hidden");
		$('.offline').removeClass("hidden");

	});
	$('#all').click(function(){
		$('.stream').removeClass("hidden");
	});

});
