import {
  cmdShow,
  btnShow,
} from './utils.js';

export function whoami() {
  $d.append(`<br><br><div class="profile editPhoto" data-uid="${firebase.auth().getUid()}">
            <h3 style="text-align: center;"><strong>${displayName}'S PROFILE</strong></h3>
            <div id="profileChange"></div>
            <div class="profileData" style="float: left;max-width: 250px;"><small style="text-align: left;">USERNAME:</small>
            <p class="highlight" style="text-align: left;">${displayName}<span style="color: rgba(159, 159, 159, 0.64);">#${tagNo}</span></p>
            <hr /><small style="text-align: left;">SECURITY CLEARANCE LEVEL:</small>
            <p class="highlight" style="text-align: left;">${clearance}</p>
            <hr /><small>PERSONNEL CLASSIFICATION:</small>
            <p class="highlight">${classification}</p>
            <hr /><small style="text-align: left;">STAFF TITLE:</small>
            <p class="highlight" style="text-align: left;">${title}</p>
            <hr /><small style="text-align: left;">WORKING SITE:</small>
            <p class="highlight" style="text-align: left;">${site}</p>
            <hr />
            <p style="text-align: left;">&nbsp;</p>
            </div>
            <div style="clear: both;">&nbsp;</div>
            <h3 style="text-align: center;"><strong>CONFIDENTIAL INFORMATION</strong></h3>
            <small style="text-align: left;">EMAIL ADDRESS:</small>
            <p class="highlight" style="text-align: left;">${firebase.auth().currentUser.email}</p>
            <hr />
            <small style="text-align: left;">USER ID:</small>
            <p class="highlight" style="text-align: left;">${tag}</p>
            <hr />
            <small style="text-align: left;">DATE OF JOINING THE FOUNDATION:</small>
            <p class="highlight" style="text-align: left;">${new Date(firebase.auth().currentUser.metadata.creationTime).toLocaleDateString("en-US")}</p>
            <hr />
            <small style="text-align: left;">LAST LOGIN TIME:</small>
            <p class="highlight" style="text-align: left;">${new Date(firebase.auth().currentUser.metadata.lastSignInTime).toLocaleString('en-US')}</p>
            <hr />
            </div><br>`)
  var storageRef = firebase.storage()
  storageRef.ref(`user/${firebase.auth().getUid()}/pfp/pfp.jpg`).getDownloadURL().then((url) => {
    console.log(url);
    $d.find("#profileChange").replaceWith(`<img class="profilePic" id="${profileListing}-profile" style="float: right; position: relative; width: 200px; height: 228px;" src="${url}" />`)
    $d.find(`#${profileListing}-profile`).on('load', function() {
      if ($(this).parent(".editPhoto").is(":visible") == false) {
        $(this).parent(".editPhoto").show()
        $d.append(`${holder} `)
        cmdShow()
        btnShow()
        $("#cmdIframe").contents().scrollTop($("#cmdIframe").contents().scrollTop() + 100)
      }
    });
  }).catch((error) => {
    if (error.code == "storage/object-not-found") {
      $d.find("#profileChange").replaceWith(`<div class="upload" style="float: right;position: relative;">Click to add a profile picture<br><b>+</b><br><small>File should not exceed 20 MB</small><input class="file_upload" type="file" accept="image/*" onchange="parent.uploadfile(this)" onclick="this.value=null;" /></div>`)
    }
    $d.find(".profile").show()
    $d.append(`${holder} `)
    cmdShow()
    btnShow()
    $("#cmdIframe").contents().scrollTop($("#cmdIframe").contents().scrollTop() + 100)
  })
}
