/*
 * Author: Emanuel Ramirez Alsina
 * Date: 07/14/2020
 */

document.addEventListener('DOMContentLoaded', main)

function main(){
    //API KEY
    var apiKey = '21a8f12138eee97e95ebe19229ad5710';
    var openWeather_url = 'https://api.openweathermap.org/data/2.5/weather?q=';

    document.getElementById('submitGet').addEventListener("click", function(event){
        console.log('Listener Created');

        var req = new XMLHttpRequest();
        var city = document.getElementById('city').value;
        var country = document.getElementById('country').value;
        var request = openWeather_url + city + ',' + country + '&appid=' + apiKey;

        console.log('city: ' + city);
        console.log('country: ' + country);
        console.log(request);
        document.getElementById('form1.0').reset();
        req.open('GET', request, false);
        req.addEventListener('load', function(){
            console.log("Adding Event listener");
            if(req.status >= 200 && req.status < 400){
                var response = JSON.parse(req.responseText);
                document.getElementById('json').innerHTML = JSON.stringify(response, undefined, 2);
                console.log("Request Received: Success!");
                console.log(response);

            }else{
                console.log("Error Status: " + req.statusText);
                consoel.log("Request Received: Failed.");
            }
        });
        event.preventDefault();
        console.log("sending request");
        req.send(null);
    })

    document.getElementById('submitGet2').addEventListener('click', function(event){
        var req = new XMLHttpRequest();
        var zip = document.getElementById('zipcode').value;
        var request = openWeather_url + zip + '&appid=' + apiKey;
        console.log(request);
        document.getElementById('form1.1').reset();
        req.open('GET', request, false);
        req.addEventListener('load', function(){

            if(req.status >= 200 && req.status < 400){
                var response = JSON.parse(req.responseText);
                document.getElementById('json').innerHTML = JSON.stringify(response, undefined, 2);
                console.log("Request Received: Success!");
                console.log(response);

            }else{
                console.log("Error Status: " + req.statusText);
                consoel.log("Request Received: Failed.");
            }
        });
        event.preventDefault();
        console.log("sending request");
        req.send(null);
    })

    document.getElementById('submitPost').addEventListener('click', function(){
        var req = new XMLHttpRequest();
        var payload = {queryString:null};

        payload.queryString = document.getElementById('query').value;

        req.open('POST', 'http://httpbin.org/post', true);
        req.setRequestHeader('Content-Type', 'application/json');
        document.getElementById('form2').reset();
        req.addEventListener('load', function(){

            if(req.status >= 200 && req.status < 400){
                var response = JSON.parse(req.responseText);
                console.log(response);
                document.getElementById('json').innerHTML = JSON.stringify(response, undefined, 2);
            }else{
                console.log("Error Status: " + req.statusText);
            }
        });
        req.send(JSON.stringify(payload));
        event.preventDefault();
    })
}
