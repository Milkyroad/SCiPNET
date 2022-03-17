import {
  appendError,
  appendWarn,
  appendNormal,
  cmdHide,
  cmdShow,
  btnShow,
  addDot,
} from './utils.js';

window.emailLog = "";
window.passLog = "";
window.keyLog = "";

//login user through firebase auth
export const loginProcess = (val) => {
  if (val.trim().toLowerCase() == "quit") {
    emailLog = "";
    passLog = "";
    keyLog = "";
    btnShow()
    appendNormal("Login process exited")
    loginState = 0
  } else {
    if (loginState == 1) {
      cmdHide()
      firebase.auth().fetchSignInMethodsForEmail(val)
        .then((signInMethods) => {
          if (signInMethods.length) {
            emailLog = val
            appendNormal(`The email address you have entered is:<span class='highlight'> ${val}</span><br><hr><small style='opacity:0.7'>Enter "Y" to continue or "N" to re-enter your email. You can exit the login process at any time by entering "Quit".</small>`)
            loginState = 2
          } else {
            appendError(`THIS EMAIL IS NOT REGISTERED. PLEASE ENTER ANOTHER EMAIL OR YOU CAN CHOOSE TO REGISTER <br><hr><small style='opacity:0.7'>If you wish to register, enter "Quit" to exit the login process. After that, enter "Register" to register.</small>`)
            loginState = 1
          }
          cmdShow()
        })
        .catch((error) => {
          cmdShow()
          appendError(`${String(error).toUpperCase()}<br><hr><small style='opacity:0.7'>PLEASE TRY AGAIN.</small>`)
          loginState = 1
        });
    } else if (loginState == 2) {
      if (val.trim().toLowerCase() == "y") {
        appendNormal("Please enter your password")
        loginState = 3
      } else if (val.trim().toLowerCase() == "n") {
        appendNormal("Please enter your email again")
        loginState = 1
      } else {
        appendError(`UNRECOGNISED INPUT, PLEASE ENTER "Y", "N" OR "Quit"`)
        loginState = 2
      }
    } else if (loginState == 3) {
      cmdHide()
      passLog = val
      $d.append('<blockquote id="waitingToAdd">Authenticating user...</blockquote>')
      addDot()
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          return firebase.auth().signInWithEmailAndPassword(emailLog, passLog)
            .then((userCredential) => {
              reloadInfo()
              if (clearance == 5 && keyphrase != "") {
                keyphraseLogin()
              } else {
                appendNormal(`Login successful - <span class="highlight">Welcome back, ${displayName}</span>`)
                cmdShow()
                btnShow()
                loginState = 0
              }
            })
            .catch((error) => {
              if (error.code == "auth/wrong-password") {
                appendError(`PASSWORD INVALID, PLEASE ENTER YOUR PASSWORD AGAIN`)
                loginState = 3
              } else {
                appendError(`${error.message.toUpperCase()}<br><hr><small style='opacity:0.7'>PLEASE ENTER YOUR EMAIL AGAIN OR YOU CAN CHOOSE TO EXIT BY ENTERING "Quit".</small>`)
                loginState = 1
              }
              cmdShow()
            });
        })
    } else if (loginState == 4) {
      if (val == keyLog) {
        $("#input").val("")
        cmdHide()
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
          .then(() => {
            return firebase.auth().signInWithEmailAndPassword(emailLog, passLog)
              .then((userCredential) => {
                reloadInfo()
                appendNormal(`Authentication accepted. <span class="highlight">Welcome back, ${displayName}</span>`)
                cmdShow()
                btnShow()
                loginState = 0
                keyLog = ""
              })
          })
      } else {
        if (val.toLowerCase().trim() == "answer") {
          appendNormal('Your personal authorization keyphrase is: "<span class="highlight">' + keyLog + '</span>"')
          $("#input").val(keyLog)
        } else {
          appendError(`INCORRECT AUTHENTICATION KEYPHRASE`)
        }
      }
    }
  }
}

//additional login auth function when user have Level 5 Security Clearance
function keyphraseLogin() {
  keyLog = keyphrase
  firebase.auth().signOut().then(() => {
    holder = defaultHolder
    appendWarn(`You are attempting to log into an account with a Level 5 Security Clearance. To safeguard the Foundation's internal confidential documents, SCiPNET has blocked your request. Please enter the corresponding personal authorization keyphrase to unlock and access your account.<br><hr><small style="opacity:0.7">Hack: Enter "Answer" to retrieve your personal authorization keyphrase.</small>`)
    cmdShow()
    loginState = 4
  })
}