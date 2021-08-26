import {
  appendError,
  appendNormal,
  cmdHide,
  cmdShow,
  btnHide,
  btnShow,
} from './utils.js';

export const edit = () => {
  if (userLoggedIn) {
    appendNormal(`Please click and select one of the following editing actions<ul class='editList listClass'><li>Username</li><li>Security Clearance Level</li><li>Personnel Classification</li><li>Staff Title</li><li>Working Site</li><li>Profile Picture</li></ul>`)
    $d.find(".editList li").unbind('click').bind('click', function() {
      if (userLoggedIn) {
        btnHide()
        editState = $(this).index() + 1
        $d.append($(this).text())
        if (editState != 2 && editState != 3 && editState != 6) {
          appendNormal(`Please enter your new ${$(this).text().toLowerCase()}`)
        } else {
          if (editState == 2) {
            cmdHide()
            var clearanceText = "Please click and select your Foundation security clearance (Available Security Clearance Level is 0 - 5)<br><ul id='clearanceEditList' class='listClass'><li>Level 0 (For Official Use Only)</li><li>Level 1 (Confidential)</li><li>Level 2 (Restricted)</li><li>Level 3 (Secret)</li><li>Level 4 (Top Secret)</li><li style='color:red'>Level 5 (Thaumiel)</li></ul><hr><small style='opacity:0.7'>Foundation security clearances granted to personnel represent the highest level or type of information to which they can be granted access. </small>"
            appendNormal(clearanceText)
            clearanceEditListClick()

            function clearanceEditListClick() {
              $d.find("#clearanceEditList li").unbind('click').bind('click', function() {
                $(this).parent("#clearanceEditList").find("li").unbind("click") //disable all clicking
                $(this).parent("#clearanceEditList").attr("id", "") //remove the id so it won't cause error
                $(this).parent("ul").attr("class", "") //fade the option
                $(this).addClass("disabledList") //fade the option
                if ($(this).index() > 5 || $(this).index() < 0) {
                  appendError("ERROR OCCURED, PLEASE TRY AGAIN")
                  appendNormal(clearanceText)
                  clearanceEditListClick()
                } else {
                  clearance = $(this).index()
                  if (clearance == 5) {
                    errorEffect()
                  } else {
                    keyphrase = ""
                    $d.append(`Foundation security clearance selected: <span class="highlight">Level ${clearance}</span>`)
                    updateUsersInfo()
                  }
                }
              });
            }
          } else if (editState == 3) {
            cmdHide()
            var classText = `Please click and select your personnel classifications<br><ul id='personnelEditList' class='listClass'><li>Class A (Deemed essential to Foundation strategic operations)</li><li>Class B (Deemed essential to local Foundation operations)</li><li>Class C (Personnel with direct access to most anomalies not deemed strictly hostile or dangerous)</li><li>Class D (expendable personnel used to handle extremely hazardous anomalies)</li><li>Class E (Provisional classification applied to field agents and containment personnel)</li></ul><hr><small style='opacity:0.7'>Classifications are assigned to personnel based on their proximity to potentially dangerous anomalous objects, entities, or phenomena. </small>`
            appendNormal(classText)
            personnellistEditClick()
          } else {
            if (firebase.auth().getUid() != null) {
              loadCroppie(function() {
                console.log("loaded")
              })
              appendNormal(`<blockquote class="editingPfp editPhoto" data-uid="${firebase.auth().getUid()}"><div class="upload" style="margin:0">Click to add a profile picture<br><b>+</b><br><small>File should not exceed 20 MB</small><input class="file_upload" type="file" accept="image/*" onchange="parent.uploadfile(this)" onclick="this.value=null;" /></div></blockquote>`)
            } else {
              appendError("PLEASE LOGIN FIRST AND CHECK YOUR INTERNET CONNECTION")
            }
            cmdShow()
            btnShow()
            editState = 0
          }
        }
      } else {
        appendNoLogin()
      }
    });
  } else {
    appendNoLogin()
  }
}
export const editProcess = (val) => {
  if (val.length < 501) {
    if (editState != 2 && val.length > 100) {
      appendError("INPUT MUST NOT EXCEED 100 CHARACTERS, PLEASE TRY AGAIN.")
    } else {
      cmdHide()
      if (editState == 1) {
        displayName = val
        UserTag = `${displayName}#${Math.ceil(Math.random()*10000)}`
        checkUsernameAva("edit", function() {
          updateUsersInfo()
        })
      }
      if (editState == 2) {
        keyphrase = val
        updateUsersInfo()
      } else if (editState == 4) {
        title = val
        updateUsersInfo()
      } else if (editState == 5) {
        site = val
        updateUsersInfo()
      }
    }
  } else {
    appendError("INPUT TOO LONG, PLEASE TRY AGAIN.")
  }
}
//setup listener for the personnel edit menu
function personnellistEditClick() {
  $d.find("#personnelEditList li").unbind('click').bind('click', function() {
    $(this).parent("#personnelEditList").find("li").unbind("click") //disable all clicking
    $(this).parent("#personnelEditList").attr("id", "") //remove the id so it won't cause error
    $(this).parent("ul").attr("class", "") //fade the option
    $(this).addClass("disabledList") //fade the option
    if (/^[A-E]$/i.test($(this).text().charAt(6))) {
      classification = $(this).text().charAt(6)
      $d.append(`Personnel classification selected: <span class="highlight">${$(this).text()}</span>`)
      updateUsersInfo()
    } else {
      appendError("ERROR OCCURED, PLEASE TRY AGAIN")
      appendNormal(classText)
      personnellistEditClick()
    }
  });
}
