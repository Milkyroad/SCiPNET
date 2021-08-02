export function loginConvert(url, name) {
  var string;
  var file;
  if (url == null) {
    string = name.split('|');
    file = {
      title: string[0],
      site: string[1],
      name: string[2],
      clearance: string[3],
      key: "",
      classification: "Not yet registered"
    }
    return file
  } else {
    if (url.includes('|-|')) {
      string = url.split('|-|');
      if (string[4] != undefined) {
        file = {
          clearance: string[0],
          title: string[1],
          classification: string[2],
          site: string[3],
          key: string[4],
          name: name
        }
      } else {
        file = {
          clearance: string[0],
          title: string[1],
          classification: string[2],
          site: string[3],
          key: "",
          name: name
        }
      }
      return file
    } else {
      string = name.split('|');
      file = {
        title: string[0],
        site: string[1],
        name: string[2],
        clearance: string[3],
        key: url,
        classification: "Not yet registered"
      }
      return file
    }
  }
}
