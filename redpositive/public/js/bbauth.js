const base32 = '0123456789bcdefghjkmnpqrstuvwxyz'; 

class Geohash {

    /**
     * Encodes latitude/longitude to geohash, either to specified precision or to automatically
     * evaluated precision.
     *
     * @param   {number} lat - Latitude in degrees.
     * @param   {number} lon - Longitude in degrees.
     * @param   {number} [precision] - Number of characters in resulting geohash.
     * @returns {string} Geohash of supplied latitude/longitude.
     * @throws  Invalid geohash.
     *
     * @example
     *     const geohash = Geohash.encode(52.205, 0.119, 7); // => 'u120fxw'
     */
    static encode(lat, lon, precision) {
        // infer precision?
        if (typeof precision == 'undefined') {
            // refine geohash until it matches precision of supplied lat/lon
            for (let p=1; p<=12; p++) {
                const hash = Geohash.encode(lat, lon, p);
                const posn = Geohash.decode(hash);
                if (posn.lat==lat && posn.lon==lon) return hash;
            }
            precision = 12; // set to maximum
        }

        lat = Number(lat);
        lon = Number(lon);
        precision = Number(precision);

        if (isNaN(lat) || isNaN(lon) || isNaN(precision)) throw new Error('Invalid geohash');

        let idx = 0; // index into base32 map
        let bit = 0; // each char holds 5 bits
        let evenBit = true;
        let geohash = '';

        let latMin =  -90, latMax =  90;
        let lonMin = -180, lonMax = 180;

        while (geohash.length < precision) {
            if (evenBit) {
                // bisect E-W longitude
                const lonMid = (lonMin + lonMax) / 2;
                if (lon >= lonMid) {
                    idx = idx*2 + 1;
                    lonMin = lonMid;
                } else {
                    idx = idx*2;
                    lonMax = lonMid;
                }
            } else {
                // bisect N-S latitude
                const latMid = (latMin + latMax) / 2;
                if (lat >= latMid) {
                    idx = idx*2 + 1;
                    latMin = latMid;
                } else {
                    idx = idx*2;
                    latMax = latMid;
                }
            }
            evenBit = !evenBit;

            if (++bit == 5) {
                // 5 bits gives us a character: append it and start over
                geohash += base32.charAt(idx);
                bit = 0;
                idx = 0;
            }
        }

        return geohash;
    }


    /**
     * Decode geohash to latitude/longitude (location is approximate centre of geohash cell,
     *     to reasonable precision).
     *
     * @param   {string} geohash - Geohash string to be converted to latitude/longitude.
     * @returns {{lat:number, lon:number}} (Center of) geohashed location.
     * @throws  Invalid geohash.
     *
     * @example
     *     const latlon = Geohash.decode('u120fxw'); // => { lat: 52.205, lon: 0.1188 }
     */
    static decode(geohash) {

        const bounds = Geohash.bounds(geohash); // <-- the hard work
        // now just determine the centre of the cell...

        const latMin = bounds.sw.lat, lonMin = bounds.sw.lon;
        const latMax = bounds.ne.lat, lonMax = bounds.ne.lon;

        // cell centre
        let lat = (latMin + latMax)/2;
        let lon = (lonMin + lonMax)/2;

        // round to close to centre without excessive precision: ⌊2-log10(Δ°)⌋ decimal places
        lat = lat.toFixed(Math.floor(2-Math.log(latMax-latMin)/Math.LN10));
        lon = lon.toFixed(Math.floor(2-Math.log(lonMax-lonMin)/Math.LN10));

        return { lat: Number(lat), lon: Number(lon) };
    }


    /**
     * Returns SW/NE latitude/longitude bounds of specified geohash.
     *
     * @param   {string} geohash - Cell that bounds are required of.
     * @returns {{sw: {lat: number, lon: number}, ne: {lat: number, lon: number}}}
     * @throws  Invalid geohash.
     */
    static bounds(geohash) {
        if (geohash.length == 0) throw new Error('Invalid geohash');

        geohash = geohash.toLowerCase();

        let evenBit = true;
        let latMin =  -90, latMax =  90;
        let lonMin = -180, lonMax = 180;

        for (let i=0; i<geohash.length; i++) {
            const chr = geohash.charAt(i);
            const idx = base32.indexOf(chr);
            if (idx == -1) throw new Error('Invalid geohash');

            for (let n=4; n>=0; n--) {
                const bitN = idx >> n & 1;
                if (evenBit) {
                    // longitude
                    const lonMid = (lonMin+lonMax) / 2;
                    if (bitN == 1) {
                        lonMin = lonMid;
                    } else {
                        lonMax = lonMid;
                    }
                } else {
                    // latitude
                    const latMid = (latMin+latMax) / 2;
                    if (bitN == 1) {
                        latMin = latMid;
                    } else {
                        latMax = latMid;
                    }
                }
                evenBit = !evenBit;
            }
        }

        const bounds = {
            sw: { lat: latMin, lon: lonMin },
            ne: { lat: latMax, lon: lonMax },
        };

        return bounds;
    }


    /**
     * Determines adjacent cell in given direction.
     *
     * @param   geohash - Cell to which adjacent cell is required.
     * @param   direction - Direction from geohash (N/S/E/W).
     * @returns {string} Geocode of adjacent cell.
     * @throws  Invalid geohash.
     */
    static adjacent(geohash, direction) {
        // based on github.com/davetroy/geohash-js

        geohash = geohash.toLowerCase();
        direction = direction.toLowerCase();

        if (geohash.length == 0) throw new Error('Invalid geohash');
        if ('nsew'.indexOf(direction) == -1) throw new Error('Invalid direction');

        const neighbour = {
            n: [ 'p0r21436x8zb9dcf5h7kjnmqesgutwvy', 'bc01fg45238967deuvhjyznpkmstqrwx' ],
            s: [ '14365h7k9dcfesgujnmqp0r2twvyx8zb', '238967debc01fg45kmstqrwxuvhjyznp' ],
            e: [ 'bc01fg45238967deuvhjyznpkmstqrwx', 'p0r21436x8zb9dcf5h7kjnmqesgutwvy' ],
            w: [ '238967debc01fg45kmstqrwxuvhjyznp', '14365h7k9dcfesgujnmqp0r2twvyx8zb' ],
        };
        const border = {
            n: [ 'prxz',     'bcfguvyz' ],
            s: [ '028b',     '0145hjnp' ],
            e: [ 'bcfguvyz', 'prxz'     ],
            w: [ '0145hjnp', '028b'     ],
        };

        const lastCh = geohash.slice(-1);    // last character of hash
        let parent = geohash.slice(0, -1); // hash without last character

        const type = geohash.length % 2;

        // check for edge-cases which don't share common prefix
        if (border[direction][type].indexOf(lastCh) != -1 && parent != '') {
            parent = Geohash.adjacent(parent, direction);
        }

        // append letter for direction to parent
        return parent + base32.charAt(neighbour[direction][type].indexOf(lastCh));
    }


    /**
     * Returns all 8 adjacent cells to specified geohash.
     *
     * @param   {string} geohash - Geohash neighbours are required of.
     * @returns {{n,ne,e,se,s,sw,w,nw: string}}
     * @throws  Invalid geohash.
     */
    static neighbours(geohash) {
        return {
            'n':  Geohash.adjacent(geohash, 'n'),
            'ne': Geohash.adjacent(Geohash.adjacent(geohash, 'n'), 'e'),
            'e':  Geohash.adjacent(geohash, 'e'),
            'se': Geohash.adjacent(Geohash.adjacent(geohash, 's'), 'e'),
            's':  Geohash.adjacent(geohash, 's'),
            'sw': Geohash.adjacent(Geohash.adjacent(geohash, 's'), 'w'),
            'w':  Geohash.adjacent(geohash, 'w'),
            'nw': Geohash.adjacent(Geohash.adjacent(geohash, 'n'), 'w'),
        };
    }

}



// ==========================================================================================================================================

const db = firebase.firestore();

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);

var currentUser = null;
var currentLat = '';
var currentLng = '';
var geohash = '';
var components;

$(function() {
    $('#bbcomponents').change(function(e) {
        components = $(e.target).val();
    }); 
});



/* Captcha Checker */

function DrawCaptcha()
{
    var alpha = new Array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z');
    var i;
    for (i=0;i<7;i++){
      var a = alpha[Math.floor(Math.random() * alpha.length)];
      var b = alpha[Math.floor(Math.random() * alpha.length)];
      var c = alpha[Math.floor(Math.random() * alpha.length)];
      var d = alpha[Math.floor(Math.random() * alpha.length)];
      var e = alpha[Math.floor(Math.random() * alpha.length)];
      var f = alpha[Math.floor(Math.random() * alpha.length)];
      var g = alpha[Math.floor(Math.random() * alpha.length)];
     }
    var code = a + ' ' +  b + ' ' + c + ' ' +  d + ' ' + e + f + ' ' + g;
    document.getElementById("txtCaptcha").value = code;
}

function ValidCaptcha(){
    var str1 = removeSpaces(document.getElementById('txtCaptcha').value);
    var str2 = removeSpaces(document.getElementById('txtInput').value);
    if (str1 === str2) 
        return true;
    return false;  
}

function removeSpaces(string)
{
    return string.split(' ').join('');
}	  


"use strict";

let map;
			
function initMap() {
  var central = {
	  lat: 27.8913,
	  lng: 78.0792
  }
  map = new google.maps.Map(document.getElementById("map"), {
	center: central,
    zoom: 5,
    disableDoubleClickZoom: true
  });



  map.addListener('click', function(mapsMouseEvent) {
    const marker = new google.maps.Marker({
        position: {
            lat: mapsMouseEvent.latLng.lat(),
            lng: mapsMouseEvent.latLng.lng()
        },
        map: map,
      });
    currentLat = mapsMouseEvent.latLng.lat();
    currentLng = mapsMouseEvent.latLng.lng();
    geohash = Geohash.encode(currentLat, currentLng, 6);
  });
}   

document.getElementById('signup')
    .addEventListener('click', function(e) {
        e.preventDefault();
        var signupEmail = document.getElementById("signupEmail").value;
        var signupPassword = document.getElementById("signupPassword").value;
        var confirmPassword = document.getElementById("confirmpassword").value;
    
        var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{10,})");
        var mediumRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{10,})");
        var weakRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.{10,})");
        var capitalWeak = new RegExp("^(?=.*[A-Z])(?=.{10,})");
        var smallWeak = new RegExp("^(?=.*[a-z])(?=.{10,})");
     

        if(ValidCaptcha()){
            if(signupPassword.length < 10){
                return window.alert("Password length too short!");
            } else if(signupPassword.length >= 10){
                if(!strongRegex.test(signupPassword)){
                    if(mediumRegex.test(signupPassword)){
                        return window.alert("Password strength is medium!");
                    } else if(weakRegex.test(signupPassword) || smallWeak.test(signupPassword) || capitalWeak.test(signupPassword)){
                        return window.alert("Password strength is weak!");
                    } 
                }
            }
        } else {
            return window.alert("Incorrect Captcha!");
        }
    
        if(signupPassword != confirmPassword){
            return window.alert("Passwords do not match!");
        }
    
        firebase
            .auth()
                .createUserWithEmailAndPassword(signupEmail, signupPassword)
                .then(({user}) => {
                    currentUser = user;
                    return user.getIdToken().then((idToken) => {
                        return fetch("/bloodbank/sessionLogin", {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                "Content-Type": "application/json",
                                "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                            },
                            body: JSON.stringify({idToken})
                        });
                    });
                })
                .then(() => {
                    return firebase.auth().signOut()
                })
                .then(() => {
                    signupDataStore();
                    const key = currentUser.uid.slice(0,15);
                    return fetch("/bloodbank/sendEmail", {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            "Content-Type": "application/json",
                            "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                        },
                        body: JSON.stringify({signupEmail, key})
                    });
                })
                .then(() => {
                    window.location.assign("/bloodbank/bloodbankhome/" + currentUser.uid);
                })
                return false;
    })

function signupDataStore(){
    var signupName = document.getElementById("bbname").value;
    var reg = document.getElementById("bbreg").value;
    var contact = document.getElementById("bbnum").value;
    var iso = document.getElementById("bbiso").value;
    var managerName = document.getElementById("bbmanager").value;
    var address = document.getElementById("bbaddress").value;
    
    db.collection('bloodbank').doc(currentUser.uid).set({
        key: currentUser.uid.slice(0,15),
        name: signupName,
        contact: contact,
        regNum: reg,
        iso:  iso,
        components: components,
        managerName: managerName,
        address: address,
        latitude: currentLat,
        longitude: currentLng,
        geohash: geohash
    })
    .then(function(){
        console.log("Data should be saved!");
    })
    .catch(function(err){
        console.log(err.message);
    })
}
