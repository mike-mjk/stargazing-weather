var url = 'https://api.wunderground.com/api/621abd6600ba2b68/features/hourly10day/geolookup/forecast10day/astronomy/q/';


var populateTemplate = function(array) {
	
	var results = $('.template').clone();
	results.removeClass("template hidden");	

	var date = results.find('.date');
	date.text(array.date.weekday + " " + array.date.monthname_short + " " + array.date.day);

	var clouds = results.find('.clouds');
	clouds.text("Cloud Cover: " + array.conditions);

	var temp = results.find('.temperature');
	temp.html("Night Time Low: " + array.low.fahrenheit + "&deg;F")

	var evaluation = results.find('.evaluation');
	if (array.conditions == "Clear") {
		evaluation.text("Great Night for Stargazing"); 
		results.find('.top-bar').css("background-color", "#15a7d8");

	}
	else if (array.conditions == "Partly Cloudy") {
		evaluation.text("There will be some clouds tonight");
		results.find('.top-bar').css("background-color", "#f49e13");
	}
	else {
		evaluation.text("Too Cloudy for Stargazing Tonight");
		results.find('.top-bar').css({
			"background-color": "#c41c13",
			"color": "#fff"
		});		
	}

	//console.log(results);
	
	return results;
}

function forecastFill(state, city) {
	$('.forecast').text("Stargazing forecast for " + city + ", " + state);
	$('.forecast').removeClass('hidden');
}

function stationLocation(state, city) {
	$('.iss-widget').find("iframe").attr("src", src="https://spotthestation.nasa.gov/widget/widget.cfm?country=United_States&region=" + state + "&city=" + city + "&theme=2");
	$('.iss-widget, h2').removeClass('hidden');
}
//formats latitude and longitude into format needed for lightpollutionmap.info

function formatLatLon(latLon) {
			if (latLon >=100) {
			latLon = latLon.toString();
			latLon = latLon.replace(/\./g,'');
			latLon = latLon.slice(0,8);
		}
		else if (latLon >= 0) {
			latLon = latLon.toString();
			latLon = latLon.replace(/\./g,'');
			latLon = latLon.slice(0,7);
		}
		else if (latLon < -100) {
			latLon = latLon.toString();
			latLon = latLon.replace(/\./g,'');
			latLon = latLon.slice(0,9);
		}
		else {
			latLon = latLon.toString();
			latLon = latLon.replace(/\./g,'');
			latLon = latLon.slice(0,8);
		}
		return latLon;
}
function getData(zip) {
	$(".results").html("");
	$.getJSON(url + zip + ".json", function(response) {
		
		var simpleDay = response.forecast.simpleforecast.forecastday
		$.each(simpleDay, function(index, value) {
			var day = populateTemplate(value);
			$('.results').append(day);
		});

		var aeris = "https://api.aerisapi.com/sunmoon/" + zip + "?client_id=apw9Hpj2miQJSaaY3GFi4&client_secret=hNzOez3RbdF3DWZgkM0vRzA8F4FKw35ge8naGaZX&from=now&to=+10days&limit=10";
		$.getJSON(aeris, function(item) {
			$.each(item.response, function(index, value) {
				timestamp = value.sun.setISO;
				console.log(timestamp);
				var date = new Date(timestamp);
				var hours = date.getUTCHours();
				console.log(hours);
				var minutes = "0" + date.getMinutes();
				var dateNumber = date.getDate();
				dateNumber = ' ' + dateNumber;
				var militaryTime = hours + ':' + minutes.substr(-2);

				var percentIllum = value.moon.phase.illum;

				for (var i = 0; i < 11; i++) {					
					var dateText = $('.tStyle .date').eq(i).text();
					// console.log(dateNumber);
					// console.log(dateText);
					// console.log(dateText.indexOf(dateNumber));
					if (dateText.indexOf(dateNumber) >= 0) {
						//console.log(dateText);
						//console.log(dateNumber);
						$('.tStyle .date').eq(i).siblings('.sunset').text("Sunset: " + militaryTime);
						$('.tStyle .date').eq(i).siblings('.moon').text("Moon Percent Illuminated: " + percentIllum);
					};
				}
				//console.log($('.tStyle').find('.date')[0].innerText);
				//console.log(dateText);

			});
			//console.log(item.response[0]);
		});


		// var lat = response.location.lat;
		// var lon = response.location.lon;
		// lon = lon * 1.1109
		// lat = lat * 1.182
		// lat = formatLatLon(lat);
		// lon = formatLatLon(lon);
		// var mapUrl = "https://www.lightpollutionmap.info/#zoom=10&lat=" + lat +"&lon=" + lon + "&layers=B0TFFFFF";
		// $('.map').append("<a href ='" + mapUrl +"'>Light Map</a>");
		// console.log(mapUrl);


     	state = response.location.state;
     	city = response.location.city;

     	state = abbrState(state, 'name');
     	city = city.replace(' ', '_');

     	console.log(state);
     	console.log(city);

     	stationLocation(state, city);
     	city = city.replace('_', ' ');
     	forecastFill(state, city);
	});
	$('.map-header').removeClass('hidden');


};

// USAGE:
// abbrState('ny', 'name');
// --> 'New York'
// abbrState('New York', 'abbr');
// --> 'NY'

function abbrState(input, to){
    
    var states = [
        ['Arizona', 'AZ'],
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['Arizona', 'AZ'],
        ['Arkansas', 'AR'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New_Hampshire', 'NH'],
        ['New_Jersey', 'NJ'],
        ['New_Mexico', 'NM'],
        ['New_York', 'NY'],
        ['North_Carolina', 'NC'],
        ['North_Dakota', 'ND'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Rhode_Island', 'RI'],
        ['South_Carolina', 'SC'],
        ['South_Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West_Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ];

    if (to == 'abbr'){
        input = input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        for(i = 0; i < states.length; i++){
            if(states[i][0] == input){
                return(states[i][1]);
            }
        }    
    } else if (to == 'name'){
        input = input.toUpperCase();
        for(i = 0; i < states.length; i++){
            if(states[i][1] == input){
                return(states[i][0]);
            }
        }    
    }
}


// $( document ).ready( getZip );
$( document ).ready(function() { 
	$('.js-button').on("click", function(e) {
		e.preventDefault();
		var zip = ($('.js-query').val());
		console.log("this is " + zip);
		if (zip.trim().length > 0)
			getData(zip);
		else
			alert("Enter a zip");

	});
});


// The following is going to be based off of the thinkful OMDB api code

// function getDataFromApi(location, callback) {
// 	$.getJSON(url, location, callback);
// }

// function displayData(data) {
// 	// this will need to be fleshed out but as a placeholder:
// 	console.log(data);
// }

// function watchSubmit() {
// 	$('.js-search-form').submit(function(e) {
// 		e.preventDefault();
// 		var location = $(this).find('.js-query').val();
// 		location = location + ".json"
// 		getDataFromApi(location, displayData);
// 	});
// }

// $(function(){watchSubmit();});