moment.tz.load(tzAlls);

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
		evaluation.text("There Will Be Some Clouds Tonight");
		results.find('.top-bar').css("background-color", "#f49e13");
	}
	else {
		evaluation.text("Too Cloudy for Stargazing Tonight");
		results.find('.top-bar').css({
			"background-color": "#c41c13",
			"color": "#fff"
		});		
	}

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

function getData(zip) {
	$(".results").html("");

	var url = 'https://api.wunderground.com/api/621abd6600ba2b68/features/hourly10day/geolookup/forecast10day/astronomy/q/';
	// Gets weather data from wunderground API
	$.getJSON(url + zip + ".json", function(response) {	
		var simpleDay = response.forecast.simpleforecast.forecastday
		$.each(simpleDay, function(index, value) {
			var day = populateTemplate(value);
			$('.results').append(day);
		});

		var aeris = "https://api.aerisapi.com/sunmoon/" + zip + "?client_id=apw9Hpj2miQJSaaY3GFi4&client_secret=hNzOez3RbdF3DWZgkM0vRzA8F4FKw35ge8naGaZX&from=now&to=+10days&limit=10";
		//Gets sunset and moon data and applies them to corresponding date in the html
		$.getJSON(aeris, function(item) {
			$.each(item.response, function(index, value) {
				timestamp = value.sun.setISO;
				var time = moment(timestamp);
				var timezone = value.profile.tz;
				var time = time.tz(timezone).format('h:mm a z');
				var date = new Date(timestamp);
				var dateNumber = date.getDate();
				dateNumber = ' ' + dateNumber;

				var percentIllum = value.moon.phase.illum;

				for (var i = 0; i < 11; i++) {					
					var dateText = $('.t-style .date').eq(i).text();
					if (dateText.indexOf(dateNumber) >= 0) {
						$('.t-style .date').eq(i).siblings('.sunset').text("Sunset: " + time);
						$('.t-style .date').eq(i).siblings('.moon').text("Moon Illumination: " + percentIllum + " Percent");
					};
				}

			});
		});

     	state = response.location.state;
     	city = response.location.city;

     	state = abbrState(state, 'name');
     	city = city.replace(' ', '_');

     	stationLocation(state, city);
     	city = city.replace('_', ' ');
     	state = state.replace('_', ' ');
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

$( document ).ready(function() { 
	$('.js-search-form').on("submit", function(e) {
		e.preventDefault();
        $("body").css("background", "url('https://www.toptal.com/designers/subtlepatterns/patterns/cork-wallet.png')");
        $("h1, h2").css("color", "#111")
		var zip = ($('.js-query').val());
		if (zip.trim().length == 5)
			getData(zip);
		else
			alert("Enter a valid zipcode");

	});
});
