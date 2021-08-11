export const settings = () => {
  popUp(`Settings`, `<blockquote class="darken"><input class="settingsCheckbox" id="maskLocationBox" type="checkbox"></input>Mask and prevent SCiPNET from displaying details regarding your location</blockquote>`)
  //location masking function
  $('#maskLocationBox').change(function() {
    locationMasking(this.checked)
    //backup to cloud
    if (userLoggedIn && firebase.auth().currentUser.uid != null) {
      firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).set({
        Settings: {
          checkLocation: this.checked,
        },
      }, {
        merge: true
      })
      localStorage.setItem('checkLocation', this.checked);
    } else {
      localStorage.setItem('checkLocation', this.checked);
    }
  });
}
