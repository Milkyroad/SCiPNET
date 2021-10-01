var loaded = false //check if weather loaded
var htmlLoaded = false //check if html headings loaded
var valueList = {} //defined for graphs to fetch data
window.temperature = "27"
export const siteControl = () => {

  //generate data
  function randomVa(max, min) {
    return Math.random() * (max - min) + min
  }
  window.dataRandom = setInterval(function() {
    valueList = {
      "Reactor Core": randomVa(70, 27),
      "Signal (dBm)": randomVa(-30, -67),
      "Radiation Level (μSv/h)": randomVa(0.15, 0.1),
      "Temperature": randomVa(temperature, temperature - 2),
      "Stability": randomVa(100, 90)
    }
  }, 1000);

  //append modules
  jQuery.get("/src/ex_file/html/controldash.html", function(va) { //get control html code
    if (htmlLoaded == false) {
      htmlLoaded = true
      $("head").append(`
        <link rel="stylesheet" href="/src/css/controlStyle.min.css">
        <script src="/src/ex_file/scripts/chart.js"></script>
        <script src="/src/ex_file/scripts/luxon.js"></script>
        <script src="/src/ex_file/scripts/chartjs-adapter-luxon.js"></script>
        <script src="/src/ex_file/scripts/chartjs-plugin-streaming.js"></script>`)
      $.getScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/109/three.min.js", function () {
        $.getScript("https://unpkg.com/three@0.85.0/examples/js/controls/OrbitControls.js", function () {
          popUp(`${displayTitle} Main Site Control Unit`, va)
          $("head").append('<script src="/src/ex_file/scripts/dna.min.js"></script>')
          runDNA()
          mainHTMLFun()
        })
      })
    }
    else {
      popUp(`${displayTitle} Main Site Control Unit`, va)
      runDNA()
      mainHTMLFun()
    }
  })
  function mainHTMLFun() {
    playSound('/src/ex_file/audio/dashEntrance.mp3')
    playSound('/src/ex_file/audio/dashNormal.mp3')
    //get local temperature if location masking is disabled
    if (loaded == false && locationGet != false) {
      $.getJSON("https://api.openweathermap.org/data/2.5/weather", {
        lat: countrylat,
        lon: countrylong,
        units: 'metric',
        APPID: config.WEATHER_KEY
      }).done(function(weather) {
        loaded = true //log for second time loading
        temperature = weather.main.temp || "27"
        $('#feedTemp').text(`${temperature} °C`)
      })
    } else {
      if (locationGet == false) {
        $('#feedTemp').text(`27 °C`) //location disabled, if user enables location in the second time, it will pass to the api again
      } else {
        $('#feedTemp').text(`${temperature} °C`) //second time loading
      }
    }

    //config
    function configLine(title, max, min, show) {
      return {
        type: 'line',
        data: {
          datasets: [{
            backgroundColor: `rgba(${hex2rgb(color)}, 0.2)`,
            borderColor: `${color}`,
            cubicInterpolationMode: 'monotone',
            fill: true,
            data: []
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: show,
              text: title,
              font: {
                weight: 'regular'
              }
            },
            legend: {
              display: false
            }
          },
          elements: {
            point: {
              radius: 0
            },
            line: {
              borderWidth: 1
            }
          },
          scales: {
            x: {
              type: 'realtime',
              realtime: {
                delay: 2000,
                onRefresh: chart => {
                  chart.data.datasets.forEach(dataset => {
                    dataset.data.push({
                      x: Date.now(),
                      y: valueList[title]
                    });
                  });
                }
              },
              grid: {
                display: false
              },
              ticks: {
                display: false
              },
            },
            y: {
              suggestedMin: min,
              suggestedMax: max,
              grid: {
                display: show,
                drawBorder: false,
                color: 'gray',
              },
              ticks: {
                display: show,
                maxTicksLimit: 6,
                color: "gray",
              },
            },
          }
        }
      };
    }
    var radarOption = {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        r: {
          grid: {
            color: 'white'
          },
          angleLines: {
            color: 'gray'
          },
          ticks: {
            display: false,
            maxTicksLimit: 4
          },
          max: 100,
          min: 0
        }
      },
      elements: {
        point: {
          radius: 0
        },
        line: {
          borderWidth: 1
        }
      },
    }
    var humeData = {
      labels: ["", "", "", "", "", ""],
      datasets: [{
        backgroundColor: `rgba(${hex2rgb(color)}, 0.2)`,
        borderColor: color,
        data: [65, 75, 70, 80, 60, 80]
      }]
    };
    var HumeConfig = {
      type: 'radar',
      data: humeData,
      options: radarOption
    }
    var FacData = {
      labels: ["A", "B", "C", "D", "E", "F"],
      datasets: [{
        backgroundColor: `rgba(${hex2rgb(color)}, 0.2)`,
        borderColor: color,
        data: [28, 75, 58, 80, 60, 18]
      }]
    };
    var FacConfig = {
      type: 'radar',
      data: FacData,
      options: radarOption
    }

    //generate graphs
    new Chart(
      document.getElementById('reactorChart'),
      configLine("Reactor Core", 80, 0, true)
    );
    new Chart(
      document.getElementById('signalChart'),
      configLine("Signal (dBm)", 0, -100, true)
    );
    new Chart(
      document.getElementById('radChart'),
      configLine("Radiation Level (μSv/h)", 5, 0, true)
    );
    new Chart(
      document.getElementById('tempChart'),
      configLine("Temperature", 50, 0, false)
    )
    new Chart(
      document.getElementById('eleChart'),
      configLine("Stability", 100, 70, false)
    )
    var humeChart = new Chart(
      document.getElementById("humeChart"),
      HumeConfig
    );
    var facChart = new Chart(
      document.getElementById("facChart"),
      FacConfig
    );
    Chart.defaults.font.family = "'Barlow'";

    //random value
    function DNAStrand(dna) {
      let sequence = {
        "A": "T",
        "T": "A",
        "G": "C",
        "C": "G"
      }
      return dna.replace(/A|T|G|C/g, function(matched) {
        return sequence[matched];
      });
    }
    function generateDNA() {
      var result = '';
      var characters = 'ATGC';
      for (var i = 0; i < 15; i++) {
        result += characters.charAt(Math.floor(Math.random() *
          4));
      }
      return result;
    }
    window.textRandom = setInterval(function() {
      $("#feedfac").text(`${randomVa(99.7,99.65).toFixed(2)}%`)
      for (var i = 0; i < humeChart.data.datasets[0].data.length; i++) {
        humeChart.data.datasets[0].data[i] = randomVa(0, 100);
        facChart.data.datasets[0].data[i] = randomVa(0, 100);
      }
      humeChart.update();
      facChart.update();
    }, 1000);
    window.dnaRandom = setInterval(function() {
      var data = generateDNA()
      $("#dnaData").html(`DECODED TEST SUBJECT DNA SEGMENT: ${data}:${DNAStrand(data)}`)
    }, 10);
    //event log
    for (var i = 0; i < eventLogArray.length; i++) {
      $("#eventLog ul").append(`<li>${eventLogArray[i]}</li>`)
      $("#eventLog").scrollTop($("#eventLog")[0].scrollHeight);
    }
  }
}
