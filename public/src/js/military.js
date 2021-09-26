//3D Globe
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
var searchRecord = [];

function createGlobe() {
  d3.json('/src/ex_file/json/grid-mq.json', function(world) {
    const node = d3.select('#militaryDashEarth').node();
    globe = new t3_rs_geo.Globe(document.getElementById('militaryDashEarth').clientWidth, 600, {
      data: initialData,
      background: '#1e1e1e',
      tiles: world.tiles,
      globeColor: 'black',
      font: 'Barlow',
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
          if (false) {
            globe.addMarker(countrylong, countrylat, "LOCAL LAUNCH STATION");
          } else {
            globe.addMarker(17.9160, -33.6975, "NUCLEAR LAUNCH STATION");
          }
        }, 2000);

        // Handle window resize events
        window.addEventListener('resize',
          (onWindowResize) => globe.resize(node.clientWidth, node.clientHeight), false);

        globe.dayLength = 58000
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
  });
}
createGlobe()

var population = 7895488415

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
  var timer;

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function run() {
    var now = new Date().getTime();
    var remaining = Math.max((endTime - now) / duration, 0);
    var value = Math.round(end - (remaining * range));
    obj.innerHTML = numberWithCommas(value);
    if (value == end) {
      clearInterval(timer);
    }
  }

  timer = setInterval(run, stepTime);
  run();
}

animateValue("humanPopulation", 0, population, 4000);

$(".nuclearButton").unbind('click').bind('click', function() {
  $.when($(".militaryDash-left").fadeOut(500))
    .done(function() {
      globe.resize($("#militaryDashEarth").width(), $("#militaryDashEarth").height())
      $(".nuclearHide").fadeIn(500)
      $("#nuclearText").text("ACTIVATE LAUNCHING PROTOCOL")
      $("#targetSearch").unbind('click').bind('click', function() {
        var search = $("#nuclearSearch").val().trim()
        if (search != "") {
          $("#locationRes").text("LOCATION: LOCATING...")
          $.getJSON(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(search)}&format=json`, function(data) {
            if (data == '') {
              $("#locationRes").html(`LOCATION: <span class="redColour">INVALID LOCATION</span>`)
            } else {
              //add location text
              $("#locationRes").text(`LOCATION: ${data[0].lon}, ${data[0].lat}`)
              var fatalities;

              if (searchRecord.find(x => x.key == data[0].osm_id) != undefined) {
                var index = searchRecord.findIndex(function(pos) {
                  return pos.key == data[0].osm_id
                });
                fatalities = searchRecord[index].fatalities
              } else {
                //new search
                fatalities = Math.floor(Math.random() * 30000)
                searchRecord.push({
                  key: data[0].osm_id,
                  fatalities: fatalities
                });

                //position marker
                globe.addMarker(data[0].lat, data[0].lon, "TARGET", true);
              }
              animateValue("fatalities", 0, fatalities, 3000);
            }
          }).fail(function() {
            $("#locationRes").html(`LOCATION: <span class="redColour">FAILED TO FETCH LOCATION</span>`);
          })
        }
      })
    });
});

$("#eraseButton").unbind('click').bind('click', function() {
  globe.destroy(function() {
    $("#militaryDashEarth").html("")
    setTimeout(function () {
      createGlobe();
    }, 100);
  });
});
