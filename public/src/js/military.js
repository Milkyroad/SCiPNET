var initialData = [{
    lat: 48.724812,
    lng: 7.084500,
    label: "Site-06-3"
  },
  {
    lat: 44.314842,
    lng: -85.602364,
    label: "Site-11"
  },
  {
    lat: 34.0536909,
    lng: -118.242766,
    label: "Site-15"
  },
  {
    lat: 22.3511148,
    lng: 78.6677428,
    label: "Site-36"
  },
  {
    lat: -30.633644109268698,
    lng: 113.92668306425966,
    label: "Site-45"
  },
  {
    lat: 51.3406321,
    lng: 12.3747329,
    label: "Site-54"
  }
];
var globe;
//record fatalities for each search
var searchRecord = [];
var init = false;
var worldData;
var initalPopulation = 7895488415;
var population = 7895488415
var fatalities = 0;
var preInput = "";
var faTimer;
var popTimer;
var speed = 10;
var mapProvider = 1;
//record location and coordinates
var targetList = [];

function addLaunch() {
  // TODO: add location detection variable
  if (false) {
    globe.addMarker(countrylong, countrylat, "LOCAL LAUNCH STATION");
  } else {
    globe.addMarker(17.9160, -33.6975, "NUCLEAR LAUNCH STATION");
  }
}

function createGlobe() {
  if (init == false) {
    d3.json('/src/ex_file/json/grid-mq.json', function(world) {
      worldData = world
      readyGlobe()
    });
  } else {
    readyGlobe()
  }


  function readyGlobe() {
    const node = d3.select('#militaryDashEarth').node();
    globe = new t3_rs_geo.Globe(document.getElementById('militaryDashEarth').clientWidth, 600, {
      data: initialData,
      background: '#1e1e1e',
      tiles: worldData.tiles,
      globeColor: 'black',
      schemeColor: d3.interpolateRainbow,
    });

    node.append(globe.domElement);

    globe.ready
      .then(() => {
        // we are ready
        (function tick() {
          globe.tick();
          requestAnimationFrame(tick);
        })();
        // Satellite
        var constellation = [];
        var opts = {
          numWaves: parseInt(5)
        };
        var alt = parseFloat(1.1);
        for (var i = 0; i < 5; i++) {
          for (var j = 0; j < 3; j++) {
            constellation.push({
              lat: 50 * i - 30 + 15 * Math.random(),
              lon: 120 * j - 120 + 30 * i,
              altitude: alt
            });
          }
        }
        /* add pins at random locations */
        for (var i = 0; i < 10; i++) {
          var lat = Math.random() * 180 - 90,
            lon = Math.random() * 360 - 180,
            name = ''
          globe.addPin(lat, lon, name);
        }
        globe.addConstellation(constellation, opts);
        setTimeout(function() {
          addLaunch()
        }, 2000);
        // Handle window resize events
        window.addEventListener('resize',
          (onWindowResize) => globe.resize(node.clientWidth, node.clientHeight), false);

        let autoRotate;
        let autoDayLength = globe.dayLength
        // Handle dragging
        d3.selectAll('#militaryDashEarth > canvas')
          .call(d3.drag()
            .on('start', () => {
              // stop the auto-rotation
              clearTimeout(autoRotate);
              globe.dayLength = 0;
              // stop the trails
            })
            .on('drag', () => {
              globe.cameraAngle += (d3.event.dx * 0.001); //TODO: ratio
              let newA = globe.viewAngle + (d3.event.dy * 0.001);
              globe.viewAngle = Math.max(Math.min(newA, Math.PI / 2.0), -Math.PI / 2.0);
            })
            .on('end', () => {
              // Start spinning again after 3 seconds
              autoRotate = setTimeout(() => {
                globe.dayLength = autoDayLength;
                globe.smoke(true);
              }, 100);
            })
          )
          .call(d3.zoom()
            .scaleExtent([0.77, 2])
            .on('zoom', () => {
              globe.setScale(d3.event.transform.k);
            })
          );
      })
      .catch(e => console.error(e));
  }
}
createGlobe()

function type(id, txt, callback) {
  var i = 0;
  typeWriter(id, txt, function() {
    callback()
  })

  function typeWriter(id, txt, callback) {
    if (i < txt.length) {
      let text = txt.charAt(i);
      document.getElementById(id).innerHTML += text === "\n" ? "<br/>" : text;
      i++;
      setTimeout(function() {
        typeWriter(id, txt, callback)
      }, speed);
    } else {
      callback()
    }
  }
}

function animateValue(id, start, end, duration) {
  // assumes integer values for start and end
  var obj = document.getElementById(id);
  var range = end - start;
  // no timer shorter than 50ms (not really visible any way)
  var minTimer = 50;
  // calc step time to show all interediate values
  var stepTime = Math.abs(Math.floor(duration / range));

  // never go below minTimer
  stepTime = Math.max(stepTime, minTimer);

  // get current time and calculate desired end time
  var startTime = new Date().getTime();
  var endTime = startTime + duration;

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function run() {
    var now = new Date().getTime();
    var remaining = Math.max((endTime - now) / duration, 0);
    var value = Math.round(end - (remaining * range));
    obj.innerHTML = numberWithCommas(value);
    if (value == end) {
      if (id == "humanPopulation") {
        clearInterval(popTimer);
      } else if (id == "fatalities") {
        clearInterval(faTimer);
      }
    }
  }
  if (id == "humanPopulation") {
    clearInterval(popTimer);
    popTimer = setInterval(run, stepTime);
  } else if (id == "fatalities") {
    clearInterval(faTimer);
    faTimer = setInterval(run, stepTime);
  }
  run();
}

animateValue("humanPopulation", 0, initalPopulation, 4000);

//nuclear button event handlers
function deploymentButtonFun() {
  $(".nuclearButton:not(#nuclearCancel)").on('click.deploy', function() {
    $("#nuclearWarningOuter, .nuclearHide").fadeIn(500)
    //typing function
    type("deploymentTitle", "NUCLEAR DEPLOYMENT PROTOCOL INITIATED (CODE: 38D42 RED)", function() {
      // TODO: Add username
      // TODO: Add sound effect
      type("deploymentContent", `validating action.....Success - Code: 38D42 RED initiated from SCiPNET Local Portal\nunLocking DX-SCP Nuclear Protection System.....Success\nRemoving local cache.....Success\nChecking nuclear weapon status.....all values normal\nConfirming satellites signal.....Success, 15 signal found\n.\n.\n.\n.\n.\nOpening Nuclear Planning Dashboard.....`, function() {
        setTimeout(function() {
          $("#nuclearWarningOuter").fadeOut(500)
          $(".nuclearBannerContent").text("")
        }, 1000);
      });
    });
    $("#showDash").hide()
    $("#hiddenDash").show()
    globe.resize($("#militaryDashEarth").width(), $("#militaryDashEarth").height())
    //setup new launching button
    $("#nuclearText").text("ACTIVATE LAUNCHING PROTOCOL")
    $(".nuclearButton:not(#nuclearCancel)").attr("id", "launchBtn")
    //remove previous clicking handler
    $('.nuclearButton').off('click.deploy');
    $("#targetSearch").unbind('click').bind('click', function() {
      var search = $("#nuclearSearch").val().trim()
      if (search != "") {
        $("#locationRes").text("LOCATION: LOCATING...")
        $.getJSON(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(search)}&format=json&accept-language=en-US`, function(data) {
          searchMarker(data)
        }).fail(function() {
          $.getJSON(`https://api.mapbox.com/geocoding/v5/mapbox.pladces/${encodeURIComponent(search)}.json?access_token=${config.MAPBOX}&cachebuster=1633085782227&autocomplete=false&limit=1`, function(data) {
            mapProvider = 2
            searchMarker(data)
          }).fail(function() {
            $("#locationRes").html(`LOCATION: <span class="redColour">FAILED TO FETCH LOCATION</span>`);
          })
        })
      }
    })
  });
}

function launchButtonFun() {

}

function searchMarker(data) {
  if (data == '' || data == null) {
    $("#locationRes").html(`LOCATION: <span class="redColour">INVALID LOCATION</span>`)
  } else {
    //add location text
    var id = "";
    var long = "";
    var lat = "";
    var locationName = "";
    if (mapProvider == 2) {
      var root = data.features[0]
      id = root.id
      lat = root.center[1]
      long = root.center[0]
      locationName = root.place_name
    } else {
      id = data[0].osm_id
      lat = data[0].lat
      long = data[0].lon
      locationName = data[0].display_name
    }
    if (preInput != id) {
      preInput = id
      $("#locationRes").text(`LOCATION: ${lat}, ${long}`)
      if (searchRecord.find(x => x.key == id) != undefined) {
        var index = searchRecord.findIndex(function(pos) {
          return pos.key == id
        });
        fatalities += searchRecord[index].fatalities
        population -= searchRecord[index].fatalities
      } else {
        //new search
        var generatedFat = Math.floor(Math.random() * 30000)
        searchRecord.push({
          key: id,
          fatalities: generatedFat
        });
        fatalities += generatedFat
        population -= generatedFat
      }

      //position marker
      markerFun(id, long, lat, locationName)
    } else {
      $("#locationRes").text("LOCATION: PREVIOUS LOCATION")
    }
  }
}

function markerFun(id, long, lat, locationName) {
  globe.addMarker(lat, long, "TARGET", true);
  targetList.push({
    name: locationName,
    location: `LAT:${lat}, LON:${long}`
  });
  $("#locationBorder ol").append(`
              <li>
                <div>
                  <div class="targetsLabel">${locationName}
                  <hr>
                  <small>LAT:${lat}<br>LON:${long}</small>
                  </div>
                </div>
              </li>`)
  $('#locationBorder ol').scrollTop($('#locationBorder ol')[0].scrollHeight);
  animateValue("fatalities", Number($("#fatalities").text().replace(/,/g, '')), fatalities, 3000);
  animateValue("humanPopulation", Number($("#humanPopulation").text().replace(/,/g, '')), population, 3000)
}

function cancelButtonFun() {
  $("#nuclearCancel").on('click.cancel', function() {
    // TODO: add sound effect
    $(".nuclearHide").fadeOut(500)
    $("#hiddenDash").hide()
    $("#showDash").fadeIn(500)
    $("#nuclearText").text("NUCLEAR WARHEAD DEPLOYMENT")
    $(".nuclearButton:not(#nuclearCancel)").attr("id", "")
    deploymentButtonFun()
    resetMarkers()
  })
}
cancelButtonFun()
deploymentButtonFun()

function resetMarkers() {
  globe.setMaxMarkers(0)
  globe.setMaxMarkers(900)
  $("#locationBorder ol").html("")
  animateValue("humanPopulation", Number($("#humanPopulation").text().replace(/,/g, '')), initalPopulation, 2000);
  animateValue("fatalities", Number($("#fatalities").text().replace(/,/g, '')), 0, 2000);
  targetList = []
  population = 7895488415
  fatalities = 0;
  preInput = "";
  addLaunch()
}
$("#eraseButton").unbind('click').bind('click', function() {
  resetMarkers()
});
$("#selfButton").unbind('click').bind('click', function() {
  // TODO: add location detection
  if (false) {

  }
  markerFun([])
});
