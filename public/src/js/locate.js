import {
  appendNormal,
  cmdShow,
  loadFile
} from './utils.js';

export const locate = () => {
  setTimeout(function() {
    $d.append(`<blockquote id='fileSize'></blockquote>`)
    loadFile(`Fetching local information from the SCiPNET database`, `Decoding...`)
  }, 1000);
  setTimeout(function() {
    cmdShow()
    appendNormal(`<blockquote class="location">
      <h1 class="locationHead">SCiPNET GEOLOCATION DATABASE</h1>
      <div style="float:left;max-width:305px">
        <locationtag>Your Current Location:</locationtag>
        <locationdata style="font-size:30px;margin: 5px 5px 15px 0px;line-height: 1;">${country.toUpperCase()} (${countryCode})</locationdata>
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
        <img src="https://cache.ip-api.com/${countrylong},${countrylat},10" width="250px" onerror="this.style.display='none'" class="countryMap" style="margin: 20px 0 70px 0;height:268px">
        <img src="/src/images/scp.svg" width="50px" class="smallSCPLogo">
      </div>
      <div style="float:right;max-width:305px;margin: 15px;">
        <img src="${countryFlag}" width="200px" style="margin: 20px 0 20px 0;" onerror="this.style.display='none'">
        <locationtag>Native Name:</locationtag>
        <locationdata>${countryNativeName}</locationdata>
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
        <locationtag>Gini Index:</locationtag>
        <locationdata>${countryGini}</locationdata>
      </div>
      </blockquote>`)
  }, 1500);
}
