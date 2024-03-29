export function sideBarFun() {
  function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function change(hold, tag, min, max, unit) {
    $(hold + tag).text(randomInteger(min, max) + unit)
  }
  var span = document.getElementById('time');

  window.bubbleIframeMouseMove = (iframe) => {
    // Save any previous onmousemove handler
    var existingOnMouseMove = iframe.contentWindow.onmousemove;

    // Attach a new onmousemove listener
    iframe.contentWindow.onmousemove = function(e) {
      // Fire any existing onmousemove listener
      if (existingOnMouseMove) existingOnMouseMove(e);

      // Create a new event for the this window
      var evt = document.createEvent("MouseEvents");

      // We'll need this to offset the mouse move appropriately
      var boundingClientRect = iframe.getBoundingClientRect();

      // Initialize the event, copying exiting event values
      // for the most part
      evt.initMouseEvent(
        "mousemove",
        true, // bubbles
        false, // not cancelable
        window,
        e.detail,
        e.screenX,
        e.screenY,
        e.clientX + boundingClientRect.left,
        e.clientY + boundingClientRect.top,
        e.ctrlKey,
        e.altKey,
        e.shiftKey,
        e.metaKey,
        e.button,
        null // no related element
      );

      // Dispatch the mousemove event on the iframe element
      iframe.dispatchEvent(evt);
    };
  }

  window.onload = function() {
    $(document).on("mousemove", function(event) {
      $("#mousepo").text(`X:${Math.round(event.pageX)} Y:${Math.round(event.pageY)}`);
    });
    bubbleIframeMouseMove(document.getElementById("cmdIframe"))
  };

  function time() {
    var d = new Date();
    var s = d.getSeconds();
    var m = d.getMinutes();
    var h = d.getHours();
    span.textContent =
      ("0" + h).substr(-2) + ":" + ("0" + m).substr(-2) + ":" + ("0" + s).substr(-2);
  }
  setInterval(time, 1000);
  setInterval(function() {
    change('#', 'usage', 60, 70, "%")
  }, randomInteger(500, 700));
  setInterval(function() {
    change('#', 'temperature', 55, 65, "°C")
  }, randomInteger(500, 900));


  $.getJSON("https://ipapi.co/json", function(data) {
      var unavaText = "[DATA UNAVAILABLE]"
      window.place = `${data.country_name}, ${data.region}`
      window.countryCity = data.city || unavaText
      window.country = data.country_name || unavaText
      window.countryRegion = data.region || unavaText
      window.countryTimezone = data.timezone || unavaText
      window.countryUtc = data.utc_offset || unavaText
      window.countryCallingCode = data.country_calling_code || unavaText
      window.countryLanguages = data.languages.replace(/,/g, ', ') || unavaText
      if (data.longitude == "Sign up to access" || data.longitude == null) {
        $.getJSON(`https://geocode.xyz/${countryRegion}?geoit=json`, function(data) {
          window.countrylong = data.longt
          window.countrylat = data.latt
        })
      } else {
        window.countrylong = data.longitude
        window.countrylat = data.latitude
      }
      window.ip = data.ip
      window.tele = data.org
      window.displayLoc = place.toUpperCase()
      $.getJSON(`https://restcountries.com/v3/alpha/${data.country_code_iso3}`, function(recieveData) {
          data = recieveData[0]
          window.countryPopulation = data.population || unavaText
          window.countryOfficalName = data.name.official || unavaText
          window.countryCommonName = data.name.common || unavaText
          window.countryCode = data.cca2 || unavaText
          window.countryArea = data.area || unavaText
          window.countryFlag = data.flags[0] || unavaText
          window.countryCon = data.region || unavaText
          window.countrySubRe = data.subregion || unavaText
          window.countryCapital = data.capital.join(', ') || unavaText
          window.countrySubregion = data.subregion || unavaText
          window.countryBorder = data.borders.join(', ')
          //demonyms handling
          if (data.demonyms.eng.m != data.demonyms.eng.f) {
            window.countryDemonym = `${data.demonyms.eng.m || unavaText}/${data.demonyms.eng.f || unavaText}`
          } else {
            window.countryDemonym = `${data.demonyms.eng.m}` || unavaText
          }
          //currency handling
          var currencyData = data.currencies;
          var currencyValue = Object.values(currencyData)
          var currencyKey = Object.keys(currencyData)
          if (currencyKey[1]) {
            var currencyList = ``
            for (var i = 0; i < currencyKey.length; i++) {
              currencyList += `<li>${currencyValue[i].name || unavaText}, ${currencyKey[i] || unavaText} (${currencyValue[i].symbol || unavaText})</li>`
            }
            window.countryCurrency = `<ul>${currencyList}</ul>`
          } else {
            window.countryCurrency = `${currencyValue[0].name || unavaText}, ${currencyKey[0] || unavaText} (${currencyValue[0].symbol || unavaText})<br>`
          }
          //country status
          var dependence = ""
          var landlocked = ""
          var un = ""
          if (data.independent) {
            dependence = "An independent"
          } else {
            dependence = "A non-independent"
          }
          if (data.landlocked) {
            landlocked = "landlocked"
          } else {
            landlocked = "non-landlocked"
          }
          if (data.unMember) {
            un = "is"
          }
          else {
            un = "is not"
          }
          window.countryisUN = data.unMember
          window.countryStatus = `${dependence} and ${landlocked} territory, currently ${un} a United Nations Member State`
        })
        .fail(function(data) {
          failedLocation()
        })
    })
    .fail(function(data) {
      failedLocation()
    })

  function failedLocation() {
    locationGet = false
    $("#ip, #location, #tel").html('<span style="color:#EA3546"><span style="font-weight:bold">ⓘ</span> [REQUEST REFUSED]</span>')
    window.place = "";
    window.displayLoc = ""
    window.country = "";
  }

  function testConnectionSpeed() {
    $("#connection").text(`${randomInteger(70, 100)}.${randomInteger(0, 9)} MB/s`)
  }
  setInterval(testConnectionSpeed, randomInteger(1000, 1200))

  function getOS() {
    var userAgent = window.navigator.userAgent,
      platform = window.navigator.platform,
      macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
      iosPlatforms = ['iPhone', 'iPad', 'iPod'],
      os = null;

    if (macosPlatforms.indexOf(platform) !== -1) {
      os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = 'Windows';
    } else if (/Android/.test(userAgent)) {
      os = 'Android';
    } else if (/Linux/.test(platform)) {
      os = 'Linux';
    }

    return os;
  }
  $("#device").text(getOS())

}
