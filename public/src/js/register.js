import {
  appendError,
  appendNormal,
  cmdHide,
  cmdShow,
  btnHide,
  btnShow,
  addDot,
} from './utils.js';

//authentication variables
window.userReg = "";
window.clrReg = "";
window.classReg = "";
window.titleReg = "";
window.emailReg = "";
window.siteReg = "";
window.passReg = "";
window.keyReg = "";

export const registerProcess = (val) => {
  //register user through firebase auth
  var valCase = val;
  val = val.toLowerCase().trim()
  if (val == "quit") {
    btnShow()
    appendNormal("Registration process exited")
    registerState = 0
    userReg = "";
    clrReg = "";
    titleReg = "";
    emailReg = "";
    passReg = "";
    classReg = "";
    siteReg = "";
    keyReg = ""
  } else {
    if (val.includes("|-|") || val.includes("/")) {
      appendError('INPUT CONTAINS ILLEGAL STRING "|-|" or "/", PLEASE AVOID INCLUDING THIS STRING IN YOUR INPUT AND TRY AGAIN')
    } else {
      if (registerState == 1) {
        if (val == "y") {
          appendNormal(`<span style="color:#98FB98">[✓] </span>Registration confirmed<br>Please enter your username as your identity in the Foundation's database`)
          registerState = 2
        } else if (val == "n") {
          appendNormal("Registration aborted, request for registration has been discarded")
          btnShow()
          registerState = 0
        } else {
          appendError(`UNRECOGNISED INPUT, PLEASE ENTER "Y", "N" OR "Quit"`)
        }
      } else if (registerState == 2) {
        if (valCase.length < 101) {
          userReg = valCase
          appendNormal("Please enter your email address you wish to register with")
          registerState = 2.5
        } else {
          appendError("USERNAME TOO LONG, PLEASE CHOOSE ANOTHER ONE.")
          registerState = 2
        }
      } else if (registerState == 2.5) {
        cmdHide()
        firebase.auth().fetchSignInMethodsForEmail(valCase)
          .then((signInMethods) => {
            if (signInMethods.length) {
              cmdShow()
              registerState = 2.5
              appendError('WE ALREADY HAVE AN USER WITH A CORRESPONDING EMAIL ADDRESS IN OUR DATABASE. PLEASE USE ANOTHER EMAIL OR TRY LOGGING IN<br><hr><small style="opacity:0.7">If you wish to login, enter "Quit" to exit the registration process. After that, enter "Login" to login yourself.</small>')
            } else {
              emailReg = val
              registerState = 3
              registerProcess("clearance")
            }
          })
          .catch((error) => {
            cmdShow()
            appendError(`${String(error).toUpperCase()}<br><hr> <small style='opacity:0.7'>PLEASE TRY AGAIN.</small>`)
            registerState = 2.5
          });
      } else if (registerState == 3) {
        appendNormal("Please click and select your Foundation security clearance (Available Security Clearance Level is 0 - 5)<br><ul id='clearanceList' class='listClass'><li>Level 0 (For Official Use Only)</li><li>Level 1 (Confidential)</li><li>Level 2 (Restricted)</li><li>Level 3 (Secret)</li><li>Level 4 (Top Secret)</li><li style='color:red'>Level 5 (Thaumiel)</li></ul><hr><small style='opacity:0.7'>Foundation security clearances granted to personnel represent the highest level or type of information to which they can be granted access. </small>")
        $d.find("#clearanceList li").unbind('click').bind('click', function() {
          $(this).parent("#clearanceList").find("li").unbind("click") //disable all clicking
          $(this).parent("#clearanceList").attr("id", "") //remove the id so it won't cause error
          $(this).parent("ul").attr("class", "") //fade the option
          $(this).addClass("disabledList") //fade the option
          if ($(this).index() > 5 || $(this).index() < 0) {
            appendError("ERROR OCCURED, PLEASE TRY AGAIN")
            registerState = 3
            registerProcess("error")
          } else {
            clrReg = $(this).index()
            $d.append($(this).text())
            appendNormal(`Foundation security clearance selected: <span class="highlight">Level ${$(this).index()}</span><br><br><hr>Please click and select your personnel classification<br><ul id='personnelList' class='listClass'><li>Class A (Deemed essential to Foundation strategic operations)</li><li>Class B (Deemed essential to local Foundation operations)</li><li>Class C (Personnel with direct access to most anomalies not deemed strictly hostile or dangerous)</li><li>Class D (expendable personnel used to handle extremely hazardous anomalies)</li><li>Class E (Provisional classification applied to field agents and containment personnel)</li></ul><hr><small style='opacity:0.7'>Classifications are assigned to personnel based on their proximity to potentially dangerous anomalous objects, entities, or phenomena. </small>`)
            personnellistClick()
          }
        });
      } else if (registerState == 4) {
        if (valCase.length < 101) {
          titleReg = valCase;
          appendNormal("Please enter your working site<br><hr><small style='opacity:0.7'>The location where you work. (e.g. Site-103, Site-56)</small>")
          registerState = 5
        } else {
          appendError("INPUTTED STAFF TITLE TOO LONG, PLEASE CHOOSE ANOTHER ONE.")
          registerState = 4
        }
      } else if (registerState == 5) {
        if (valCase.length < 101) {
          siteReg = valCase;
          appendNormal("Please now enter a password for your new account")
          registerState = 6
        } else {
          appendError("INPUTTED WORKING SITE TOO LONG, PLEASE CHOOSE ANOTHER ONE.")
          registerState = 5
        }
      } else if (registerState == 6) {
        if (valCase.length < 6) {
          appendError("ERROR: PASSWORD SHOULD BE AT LEAST 6 CHARACTERS")
        } else {
          cmdHide()
          passReg = valCase;
          $d.append(`<blockquote id="waitingToAdd">Registering and encrypting user's information...</blockquote>`)
          addDot()
          if (clrReg == 5) {
            errorEffect()
            registerState = 7
          } else {
            registerUserWithInfo()
          }
        }
      } else if (registerState == 7) {
        keyReg = valCase;
        if (keyReg.length > 500) {
          appendError("KEYPHRASE MUST NOT EXCEED 500 CHARACTERS, PLEASE CHOOSE ANOTHER ONE.")
          registerState = 7
        } else {
          cmdHide()
          $d.append(`<blockquote id="waitingToAdd">Keyphrase received, now registering and encrypting user's information...</blockquote>`)
          addDot()
          registerUserWithInfo()
        }
      } else if (registerState == 8) {
        emailReg = valCase;
        registerUserWithInfo()
      }
    }
  }
}

//register user with local auth variables
function registerUserWithInfo() {
  cmdHide()
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
      return firebase.auth().createUserWithEmailAndPassword(emailReg, passReg)
        .then(function() {
          firebase.auth().currentUser.updateProfile({
              displayName: userReg,
              photoURL: `${clrReg}|-|${titleReg}|-|${classReg}|-|${siteReg}|-|${keyReg}`
            })
            .then(function() {
              UserTag = `${userReg}#${Math.ceil(Math.random()*10000)}`
              checkUsernameAva("normal", function() {
                "check"
              })
            }, function(error) {
              appendError(`${String(error).toUpperCase()}<br><hr> <small style="opacity:0.7">Please enter your password again or you can enter "Quit" to exit the registration process.</small>`)
              cmdShow()
              if (keyReg == "") {
                registerState = 6
              } else {
                registerState = 7
              }
            })
        })
        .catch(function(error) {
          cmdShow()
          if (error.code == "auth/invalid-email") {
            appendError(`PLEASE ENTER A VALID EMAIL (The email you have entered: <span class="highlight">${emailReg}</span>)<br><hr> <small style="opacity:0.7">Please enter your email again or you can enter "Quit" to exit the registration process.</small>`)
            registerState = 8
          } else if (error.code == "auth/email-already-in-use") {
            appendError(`THE PROVIDED EMAIL IS ALREADY IN USE BY AN EXISTING USER (The email you have entered: <span class="highlight">${emailReg}</span>)<br><hr> <small style="opacity:0.7">Please enter your email again or you can enter "Quit" to exit the registration process.</small>`)
            registerState = 8
          } else {
            appendError(`${String(error).toUpperCase()}<br><hr> <small style="opacity:0.7">Please enter your password again or you can enter "Quit" to exit the registration process.</small>`)
            registerState = 6
          }
        });
    })
}

//setup listener for the personnel login or register menu
function personnellistClick() {
  $d.find("#personnelList li").unbind('click').bind('click', function() {
    $(this).parent("#personnelList").find("li").unbind("click") //disable all clicking
    $(this).parent("#personnelList").attr("id", "") //remove the id so it won't cause error
    $(this).parent("ul").attr("class", "") //fade the option
    $(this).addClass("disabledList") //fade the option
    if (/^[A-E]$/i.test($(this).text().charAt(6))) {
      classReg = $(this).text().charAt(6)
      $d.append($(this).text())
      appendNormal(`Personnel classification selected: <span class="highlight">${$(this).text()}</span><br><br><hr>Please now enter your staff title</span><hr><small style='opacity:0.7'>General occupational titles that are typically used in the Foundation. (e.g. Containment Specialist, Researcher)</small>`)
      cmdShow()
      registerState = 4
    } else {
      appendError("ERROR OCCURED, PLEASE TRY AGAIN")
      appendNormal(`Please click and select your personnel classifications<br><ul id='personnelList' class='listClass'><li>Class A (Deemed essential to Foundation strategic operations)</li><li>Class B (Deemed essential to local Foundation operations)</li><li>Class C (Personnel with direct access to most anomalies not deemed strictly hostile or dangerous)</li><li>Class D (expendable personnel used to handle extremely hazardous anomalies)</li><li>Class E (Provisional classification applied to field agents and containment personnel)</li></ul><hr><small style='opacity:0.7'>Classifications are assigned to personnel based on their proximity to potentially dangerous anomalous objects, entities, or phenomena. </small>`)
      personnellistClick()
    }
  });
}
