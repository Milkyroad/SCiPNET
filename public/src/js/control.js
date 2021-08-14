export const siteControl = () => {
  var displayTitle
  if (locationGet != false) {
    displayTitle = country
  } else {
    displayTitle = ""
  }
  jQuery.get("/src/ex_file/controldash.html", function(va) {
    popUp(`${displayTitle} Main Site Control Unit`, va)
  })
}
