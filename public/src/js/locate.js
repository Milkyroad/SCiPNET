import {
  appendNormal,
  cmdShow,
  loadFile
} from './utils.js';

export const locate = () => {
  $d.append(`<blockquote id='fileSize'></blockquote>`)
  loadFile(`Fetching local information from the SCiPNET database`, `Decoding...`)
  checkLinkLoaded()
  function checkLinkLoaded() {
    if (inBar == false) {
      $.getJSON(`https://en.wikipedia.org/api/rest_v1/page/summary/${country.replace(/ /g, '_')}`, function(recieveData) {
        window.countryDescription = recieveData.extract_html || "N/A"
        cmdShow()
        noscroll = true
        appendNormal(`<blockquote class="location">
            <h1 class="locationHead">SCiPNET GEOLOCATION DATABASE</h1>
            <div style="float:left;max-width:305px">
              <locationtag>Your Current Location:</locationtag>
              <locationdata style="font-size: 25px;margin: 5px 5px 15px 0px;line-height: 1;display: flex;align-items: center;"">${countryOfficalName} (${countryCode})<img src="/src/images/UN.svg" class="isUN"></img></locationdata>
              <locationtag>Located City/Region:</locationtag>
              <locationdata>${countryRegion}</locationdata>
              <locationtag>Possible Located City (Approximation):</locationtag>
              <locationdata>${countryCity}</locationdata>
              <locationtag>Timezone:</locationtag>
              <locationdata>${countryTimezone} (${countryUtc})</locationdata>
              <locationtag>Capital/Major Area:</locationtag>
              <locationdata>${countryCapital}</locationdata>
              <locationtag>Continent, Sub Region:</locationtag>
              <locationdata>${countryCon}, ${countrySubRe}</locationdata>
              <locationtag>Border:</locationtag>
              <locationdata>${countryBorder}</locationdata>
              <locationtag>Country Status:</locationtag>
              <locationdata>${countryStatus}</locationdata>
              <img src="https://cache.ip-api.com/${countrylong},${countrylat},10" width="250px" onerror="this.style.display='none'" class="countryMap" style="margin: 20px 0 70px 0;height:268px">
              <img src="/src/images/scp.svg" width="50px" class="smallSCPLogo">
            </div>
            <div class="locationInfo">
              <img src="${countryFlag}" class="flag" width="200px" onerror="this.style.display='none'">
              <hr>
              <locationtag>Common Name:</locationtag>
              <locationdata>${countryCommonName}</locationdata>
              <locationtag>Population:</locationtag>
              <locationdata>${countryPopulation}</locationdata>
              <locationtag>Area (km²):</locationtag>
              <locationdata>${countryArea}</locationdata>
              <locationtag>Currency:</locationtag>
              <locationdata>${countryCurrency}</locationdata>
              <locationtag>IDD Country Code:</locationtag>
              <locationdata>${countryCallingCode}</locationdata>
              <locationtag>Popular Language(s):</locationtag>
              <locationdata>${countryLanguages.toUpperCase()}</locationdata>
              <locationtag>Demonym:</locationtag>
              <locationdata>${countryDemonym}</locationdata>
              <locationtag>Description:</locationtag>
              <locationdata class="description" style="font-size: 10px;">${countryDescription}</locationdata>
            </div>
            </blockquote>`)
        if (countryisUN) {
          $d.find(".isUN").show()
        } else {
          $d.find(".isUN").hide()
        }
      })
      return;
    }
    window.setTimeout(checkLinkLoaded, 100)
  }
}
