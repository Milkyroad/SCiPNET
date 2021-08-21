export const settings = () => {
  popUp(`Settings`, `
    <blockquote class="darken">
      <input class="settingsCheckbox" id="maskLocationBox" type="checkbox"></input>
        Mask and prevent SCiPNET from displaying details regarding your location
    </blockquote>
    <blockquote class="darken">
      <input class="settingsCheckbox" checked="${setting["audioStatus"]}" id="audioStatusBox" type="checkbox"></input>
        Terminal sound effect
    </blockquote>`)

  if (setting["audioStatus"] == true) {
    $("#audioStatusBox").prop('checked', true);
  } else {
    $("#audioStatusBox").prop('checked', false);
  }

  function backupSettings() {
    if (userLoggedIn && firebase.auth().currentUser.uid != null) {
      firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).set({
        Settings: {
          checkLocation: $('#maskLocationBox').is(':checked'),
          audioStatus: $('#audioStatusBox').is(':checked'),
        },
      }, {
        merge: true
      })
    }

    setting["checkLocation"] = $('#maskLocationBox').is(':checked')
    setting["audioStatus"] = $('#audioStatusBox').is(':checked')
    localStorage.setItem('checkLocation', $('#maskLocationBox').is(':checked'));
    localStorage.setItem('audioStatus', $('#audioStatusBox').is(':checked'));
  }

  //location masking function
  $('#maskLocationBox').change(function() {
    addEventLog(`Location masking set to: ${this.checked}`)
    locationMasking(this.checked)
  });

  $('#audioStatusBox').change(function() {
    addEventLog(`Audio set to: ${this.checked}`)
  });

  $('.settingsCheckbox').change(function() {
    backupSettings()
  })

}
