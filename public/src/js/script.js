import {
  loginConvert
} from './loginConvert.js';
import {
  sideBarFun
} from './sideBar.js';
import {
  appendError,
  appendWarn,
  appendNormal,
  scroll,
  cmdHide,
  cmdShow,
  btnHide,
  btnShow,
  addDot,
} from './utils.js';
const {
  Generator
} = require('contrast-color-generator');
let generator = new Generator(180, {
  minimumRatio: 3.1
});
//update version
function updateVersionText() {
  $("#version").text("V. 01-17-0.21")
}
updateVersionText()
$(window).resize(function() {
  matchHeight()
  updateVersionText()
});
//script variables
var access
var vcLoaded = false;
var fsLoaded = false;
var init = false;
var defaultTheme;
window.eventLogArray = []
//change theme according to local storage
var localbackgroundColor = localStorage.getItem('backgroundColor');
var localcolor = localStorage.getItem('color');
var localtextColor = localStorage.getItem('textColor');
var localtextContrastColor = localStorage.getItem('textContrastColor');

//check if user on mobile
if (/Mobi|Android/i.test(navigator.userAgent)) {
  popUp("NOTICE", "Browsing SCiPNET via desktop is recommended for the best experience")
}

//global functions
window.addEventLog = (text, warn) => {
  if (warn == true) {
    eventLogArray.push(`<span class='warning'>${text}<br><br><small>${new Date().toLocaleTimeString('en-US')}</small></span>`);
  } else {
    eventLogArray.push(`${text}<br><br><small>${new Date().toLocaleTimeString('en-US')}</small>`);
  }
}
window.playSound = (link) => {
  if (setting["audioStatus"] == true) {
    var audio = new Audio(link);
    audio.play();
  }
}
window.appendNoLogin = () => {
  appendError("CURRENT USER IS NOT AUTHENTICATED, PLEASE LOGIN OR REGISTER FIRST TO ACCESS THIS COMMAND.")
}
window.reloadInfo = () => {
  if (firebase.auth().currentUser != null) {
    userLoggedIn = true
    firebase.firestore().doc(`users/${firebase.auth().currentUser.uid}`).get().then((doc) => {
      if (doc.exists) {
        tag = doc.data().Tag
        tagNo = tag.slice(tag.lastIndexOf('#') + 1);
      } else {
        tag = "Not yet registered"
        tagNo = "N/A"
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
    var user = firebase.auth().currentUser
    var parts = loginConvert(user.photoURL, user.displayName);
    displayName = parts.name;
    classification = parts.classification;
    clearance = parts.clearance;
    title = parts.title;
    site = parts.site;
    keyphrase = parts.key;
    holder = `<span class="highlight">root@${displayName}</span>:<span style="color:#6495ED">~</span>$ `
  } else {
    userLoggedIn = false
    displayName = ""
    classification = ""
    clearance = ""
    title = ""
    site = ""
    keyphrase = ""
  }
}
//global define the function to pop up an error modal window
window.showWarning = (text) => {
  $("#WarningModalId .modalText").html(text)
  $("#WarningModalId").show()
}
//send the updated user information to the server through firebase auth
window.updateUsersInfo = () => {
  firebase.auth().currentUser.updateProfile({
      displayName: displayName,
      photoURL: `${clearance}|-|${title}|-|${classification}|-|${site}|-|${keyphrase}`
    })
    .then(function() {
      reloadInfo()
      appendNormal(`<span style="color:#98FB98">[✓] </span>Updated successfully`)
      editState = 0
      cmdShow()
      btnShow()
    }, function(error) {
      appendError(`${error.message.toUpperCase()}, EDITING PROCESS EXCITED.`)
      editState = 0
      cmdShow()
      btnShow()
    })
}
//function to check if username exist in the firestore database
window.checkUsernameAva = async (con, callback) => {
  var userNameDoc = await firebase.firestore().collection("users").where("Tag", "==", UserTag).get()
  if (!userNameDoc.empty) {
    UserTag = `${userReg}#${Math.ceil(Math.random()*10000)}`
    checkUsernameAva("normal", function() {
      console.log("loop")
    })
  } else {
    firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).set({
        Tag: UserTag,
      }, {
        merge: true
      })

      .then(() => {
        if (con == "normal") {
          reloadInfo()
          cmdShow()
          btnShow()
          registerState = 0
          appendNormal(`<span style="color:#98FB98">[✓] </span>Procedure completed. <span class="highlight">Welcome, ${displayName}</span>`)
        } else {
          $d.append(`<blockquote id='waitingToAdd'>Your unique User ID was successfully generated, now updating your information...</blockquote>`)
          addDot()
        }
        callback()
      })
      .catch(function(error) {
        callback()
        reloadInfo()
        appendError(`ERROR OCCURED: ${String(error).toUpperCase()} YOUR ACCOUNT WAS SUCCESSFULLY CREATED OR UPDATED, BUT WE WERE UNABLE TO GENERATE A UNIQUE USERNAME FOR YOU. PLEASE TRY AGAIN LATER BY EDITING YOUR USERNAME.`)
        cmdShow()
        btnShow()
        registerState = 0
      })
  }
}
//error effect during Level 5 registration
window.errorEffect = () => {
  addEventLog("Level 5 Security Warning: An anomaly was detected, internal system crash may have occurred.", true)
  cmdHide()
  setTimeout(function() {
    $d.append(`<div class="errorCmd"><span style="background:black">EEEEERRRRRR::::::::::</span> [DATA EXPUUUGGGEEEEED]</div>`)
    scroll()
  }, 1000);
  setTimeout(function() {
    $d.append(`<div class="errorCmd">SCiPNET detected a fatal error..;d;;sdl23D34&^#&87ui</div>`)
    $d.append(`<div class="errorCmd">INTERNAL DATA CRASHED..:::::::::: SCiPNET V.01 OS HAS STOPPED WORKINGG::::::</div>`)
    scroll()
    $("#ok").css('color', '#EA3546')
    $("#ok").text('INSECURE')
  }, 1300);
  setTimeout(function() {
    $d.css({
      overflow: 'hidden',
    });
    jQuery.get("/src/ex_file/html/codeText.html", function(va) {
      $d.append(`<div style="display:none">${va}</div>`)
      $d.append(`<div id="codePage" class="codePageStyle"></div>`)
      var lines = va.split("\n");
      var displayLine = function() {
        var nextLine = lines.shift();
        if (nextLine) {
          var newLine = $('<li>' + nextLine + '</li>');
          $d.find('#codePage').append(newLine);
          newLine.show()
          scroll()
          setTimeout(displayLine, 70);
        } else {
          $("#ok").css('color', '')
          $("#ok").text('OK (Abnormal conditions detected)')
          appendNormal(`<h3>O-5 Council Registration Panel (unlockedddddddddd)</h3><blockquote><blockquote>SYSTEM INFO:<br><br>It is strictly forbidden to register for Level 5 Security Clearance without the consenting permission of the full O-5 Council. Please confirm that you have received approval before proceeding as failure to comply may result in summary execution. (INFO CODE 4855)</blockquote>As you have selected Level 5 Security Clearance (Highest Level), you are required to set up a personal authorization keyphrase for security purpose and the confidentiality of our confidential information.<br><br><span><div style="background-color:#000000; color:#ff0000">FINAL WARNING: You should not see this message without the permission of the O-5 Council. If you have successfully accessed this page without proper permission, you must report this to The Recordkeeping and Information Security Administration (RAISA) immediately. Failure to comply will result in immediate revocation and termination of all positions in the Foundation and the cancellation of all educational, medical, retirement and mortality benefits from your regional government, and the Foundation.</div></span><hr><small style='opacity:0.7'>The personal authorization keyphrase is an additional login credential to gain account access. (e.g. Now is the time for all good men to come to the aid of their party.)<br>You can choose the content of your personal authorization keyphrase as you wish.</small></blockquote>`)
          $d.css({
            overflow: 'auto',
          });
          $d.find("#codePage").attr("id", "")
          scroll()
          cmdShow()
        }
      }
      setTimeout(displayLine, 70);
    });
  }, 1400);
}

//change values according to storage items
function checkLocalStorageAndChange() {
  if (localbackgroundColor && localcolor && localtextColor && localtextContrastColor) {
    backgroundColor = localbackgroundColor;
    color = localcolor;
    textColor = localtextColor;
    textContrastColor = localtextContrastColor;
    changeAll()
    defaultTheme = false
  } else {
    defaultTheme = true
  }
}

function checkAudioSetting() {
  if (JSON.parse(localStorage.getItem('audioStatus')) == false) {
    setting["audioStatus"] = false
  } else {
    setting["audioStatus"] = true
  }
}

//monitor the login state of user
firebase.auth().onAuthStateChanged(function(user) {
  checkLocalStorageAndChange()
  if (user) {
    firebase.firestore().doc(`users/${firebase.auth().currentUser.uid}`).get().then((doc) => {
      if (doc.exists) {
        if (doc.data().Theme) {
          $(".close").hide()
          colorArray = String(doc.data().Theme).split("|")
          if (lockout == false) {
            if (defaultTheme != true && (localbackgroundColor != colorArray[0] || localcolor != colorArray[1] || localtextColor != colorArray[2] || localtextContrastColor != colorArray[3])) {
              popUp("NOTICE", `<blockquote>SCiPNET detected two theme versions, which one would you like to use?<br><div><span class="applicationBtn" id="option1">Local Version</span><span class="applicationBtn" id="option2">Server Version</span></div></blockquote>`)
              $("#option1").attr("style", `outline:1.5px ${localcolor} solid;`)
              $("#option2").attr("style", `outline:1.5px ${colorArray[1]} solid;`)
              $("#option1").off('click').bind('click', function() {
                checkLocalStorageAndChange()
                close()
                $(".close").show()
                firebase.firestore().doc(`users/${firebase.auth().currentUser.uid}`).update({
                  Theme: firebase.firestore.FieldValue.delete()
                });
              })
              $("#option2").off('click').bind('click', function() {
                backgroundColor = colorArray[0];
                color = colorArray[1];
                textColor = colorArray[2];
                textContrastColor = colorArray[3];
                localStorage.removeItem('backgroundColor');
                localStorage.removeItem('color');
                localStorage.removeItem('textColor');
                localStorage.removeItem('textContrastColor');
                changeAll()
                close()
                $(".close").show()
              })
            } else {
              backgroundColor = colorArray[0];
              color = colorArray[1];
              textColor = colorArray[2];
              textContrastColor = colorArray[3];
              changeAll()
              $(".close").show()
            }
          }
        } else {
          checkLocalStorageAndChange()
        }
        if (doc.data().Settings) {
          //check the presence settings
          if (doc.data().Settings.checkLocation != undefined) {
            setting["checkLocation"] = doc.data().Settings.checkLocation
            locationMasking(setting["checkLocation"])
          } else {
            locationMasking(localStorage.getItem('checkLocation'))
          }
          if (doc.data().Settings.audioStatus != undefined) {
            setting["audioStatus"] = doc.data().Settings.audioStatus
          } else {
            checkAudioSetting()
          }
        } else {
          locationMasking(localStorage.getItem('checkLocation'))
          checkAudioSetting()
        }
        checkIframeLoaded()
      }
    })
    reloadInfo()

    userLoggedIn = true
    holder = `<span class="highlight">root@${displayName}</span>:<span style="color:#6495ED">~</span>$ `
    addEventLog(`${displayName} authenticated, unlocking system's encryption algorithm`)
    addEventLog(`Encryption algorithm unlocked`)
  } else {
    userLoggedIn = false
    holder = defaultHolder
    checkIframeLoaded()
    checkLocalStorageAndChange()
    checkAudioSetting()
    locationMasking(localStorage.getItem('checkLocation'))
    addEventLog(`Accessing database in Guest mode`)
    addEventLog(`Successfully cancelled user credentials`)
  }
  //ready the cmd by changing the placeholder in inital start
  function checkIframeLoaded() {
    if ($d != undefined) {
      $d.find("#defaultHolder").replaceWith(holder);
      $("#input").attr("placeholder", "Enter Command...")
      cmdShow()
      return;
    }
    window.setTimeout(checkIframeLoaded, 100);
  }
});

//cookie function
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
//check if the language is set to chinese and determine traditional or simplified chinese by getting cookie
if (getCookie('language') != null) {
  linkLanguage = getCookie('language')
  if (getCookie('trad') != null && getCookie('trad') != "false" && linkLanguage == "http://scp-wiki-cn.wikidot.com/") {
    isTrad = true;
  }
}

//fetch and update visitor count with firestore
function fetchVisitorCount() {
  firebase.firestore().collection('general').doc('count').get().then((doc) => {
    $('#visitors').text(doc.data().count);
  }).catch((error) => {
    $('#visitors').text(error).css('color', '#EA3546');
  });
}
if (localStorage.getItem('count') == null) {
  firebase.firestore().collection('general').doc('count').update({
    count: firebase.firestore.FieldValue.increment(1)
  }).then(function() {
    fetchVisitorCount()
  })
  localStorage.setItem('count', "logged");
} else {
  fetchVisitorCount()
}

//check if the proxy server up
function statusCheck(url, callback) {
  return $.ajax({
    type: "GET",
    url: url,
    dataType: "jsonp",
    success: function(data, textStatus, xhr) {
      callback(true);
    },
    error: function(data, textStatus, xhr) {
      if (data.status === 200) {
        callback(true);
      } else {
        callback(false);
      }
    },
    timeout: 5000
  });
}
//check the available proxy server and find the one that can be used
window.checkall = (callback) => {
  statusCheck("https://api.allorigins.win/raw?url=", function(data) {
    if (data == true) {
      link = "https://api.allorigins.win/raw?url="
      callback()
    } else {
      statusCheck("https://cors.scipnet.workers.dev/", function(data) {
        if (data == true) {
          link = "https://cors.scipnet.workers.dev/?u="
          callback()
        } else {
          statusCheck("https://cors.ryanking13.workers.dev/", function(data) {
            if (data == true) {
              link = "https://cors.ryanking13.workers.dev/?u="
              callback()
            } else {
              statusCheck("https://api.codetabs.com/", function(data) {
                if (data == true) {
                  link = "https://api.codetabs.com/v1/proxy/?quest="
                  callback()
                } else {
                  showWarning("SCiPNET failed to connect with the SCP Foundation database, please reload the page or try again later.")
                  appendWarn("SCiPNET FAILED TO CONNECT WITH THE SCP FOUNDATION DATABASE.")
                  callback()
                  cmdShow()
                  btnShow()
                }
              });
            }
          });
        }
      });
    }
  });
}

//check the availability of the current server
checkall()

//main control unit that identify the user input and allocate command
function reply(val) {
  val = val.toLowerCase().trim()
  //check the user input
  addEventLog(`Command -${splitValue(val)[0]}- accessed`)
  switch (splitValue(val)[0]) {
    case "access":
      cmdHide()
      var accessNo = splitValue(val)[1];
      var accessCl = splitValue(val)[2];
      if (accessNo != undefined && accessCl != undefined) {
        if (accessCl > 5 || accessCl < 0 || isNumber(accessCl) == false) {
          cmdShow()
          btnShow()
          appendWarn(`INVALID SECURITY CLEARANCE LEVEL. PLEASE ACCESS ANOTHER CLEARANCE LEVEL VERSION OF THE FILE. (Available Security Clearance Level is 0 - 5)`)
        } else {
          if (isNumber(accessNo) == true) {
            accessNo = Number(accessNo).toLocaleString('en-US', {
              minimumIntegerDigits: 3,
              useGrouping: false
            })
            accessNo = 'scp-' + accessNo
          }
          if (userLoggedIn) {
            if (clearance < accessCl) {
              cmdShow()
              btnShow()
              appendWarn(`INSUFFICIENT SECURITY CLEARANCE. PLEASE ACCESS ANOTHER CLEARANCE LEVEL VERSION OF THE FILE. (Your current security clearance level is ${clearance}, however, you are trying to access a level ${accessCl} document)`)
            } else {
              accessLoad(accessNo, accessCl)
            }
          } else {
            accessLoad(accessNo, 0)
          }
        }
      } else {
        cmdShow()
        btnShow()
        appendWarn("PLEASE ENTER THE SCP NUMBER AND THE CLEARANCE LEVEL VERSION OF THE DOCUMENT YOU WISH TO CONSULT<br><hr><small style='opacity:0.7'> Example: access 173 5</small>")
      }
      break;
    case "language":
      appendNormal("<div>Please click and select the language of the SCP documentation you wish to access below:<ol class='languageSelect listClass'><li>Traditional Chinese</li><li>Simplified Chinese</li><li>Russian</li><li>Korean</li><li>French</li><li>Polish</li><li>Spanish</li><li>Thai</li><li>Japanese</li><li>German</li><li>Italian</li><li>Ukrainian</li><li>Portuguese</li><li>Czech</li><li>English</li></ol></div>")
      $d.find(".languageSelect li").unbind('click').bind('click', function() {
        var no = $(this).index() + 1
        $d.append($(this).text())
        appendNormal(`Target language selected: ${$(this).text()}`)
        if (no == 1) {
          linkLanguage = "http://scp-wiki-cn.wikidot.com/"
          setCookie('trad', "true", 365);
          isTrad = true
        } else if (no == 2) {
          linkLanguage = "http://scp-wiki-cn.wikidot.com/"
          setCookie('trad', "false", 365);
          isTrad = false
        } else if (no == 3) {
          linkLanguage = "http://scpfoundation.net/"
        } else if (no == 4) {
          linkLanguage = "http://ko.scp-wiki.net/"
        } else if (no == 5) {
          linkLanguage = "http://fondationscp.wikidot.com/"
        } else if (no == 6) {
          linkLanguage = "http://scp-wiki.net.pl/"
        } else if (no == 7) {
          linkLanguage = "http://lafundacionscp.wikidot.com/"
        } else if (no == 8) {
          linkLanguage = "http://scp-th.wikidot.com/"
        } else if (no == 9) {
          linkLanguage = "http://scp-jp.wikidot.com/"
        } else if (no == 10) {
          linkLanguage = "http://scp-wiki-de.wikidot.com/"
        } else if (no == 11) {
          linkLanguage = "http://fondazionescp.wikidot.com/"
        } else if (no == 12) {
          linkLanguage = "http://scp-ukrainian.wikidot.com/"
        } else if (no == 13) {
          linkLanguage = "http://scp-pt-br.wikidot.com/"
        } else if (no == 14) {
          linkLanguage = "http://scp-cs.wikidot.com/"
        } else if (no == 15) {
          linkLanguage = "http://www.scpwiki.com/"
        }
        setCookie('language', linkLanguage, 365);
      });
      break;
    case "fullscreen":
      openFullscreen()
      appendNormal("Fullscreen mode activated")
      break;
    case "fullquit":
      closeFullscreen()
      appendNormal("Fullscreen mode disabled")
      break;
    case "edit":
      cmdHide()
      import( /*webpackChunkName:'edit'*/ './edit.js').then((module) => {
        cmdShow()
        btnShow()
        module.edit()
        window.editProcess = module.editProcess
      })
      break;
    case "login":
      if (userLoggedIn) {
        appendError("YOU HAVE ALREADY LOGGED IN.")
      } else {
        btnHide()
        cmdHide()
        $d.append("<blockquote id='waitingToAdd'>Sending request to the database...</blockquote>")
        addDot()
        import( /*webpackChunkName:'login'*/ './login.js').then((module) => {
          loginState = 1
          cmdShow();
          appendNormal(`<span style="color:#98FB98">[✓] </span>Authentication request accepted at <span class="highlight">${new Date().toLocaleString('en-US')}</span><br><hr><small style='opacity:0.7'>Please enter your email address, you can always enter "Quit" to exit the login process</small>`)
          window.loginProcess = module.loginProcess
        })
      }
      break;
    case "bgm":
      var audio = document.getElementById("bgm");

      function playAudio(link) {
        if (audio.src != link) {
          audio.volume = 0.2;
          audio.src = link
          audio.play();
        }
      }
      appendNormal("Please click and select the type of background music you wish to play below:<ol class='bgmList listClass'><li>Ambience</li><li>Music</li><li>Turn off bgm</li></ol>")
      $d.find(".bgmList li").unbind('click').bind('click', function() {
        var no = $(this).index() + 1
        $d.append($(this).text())
        appendNormal(`Target bgm selected: ${$(this).text()}`)
        if (no == 1) {
          playAudio("https://drive.google.com/uc?export=download&id=1JoxpLuxQbhZ6bJNLosCmeBx4BEDQsmiE")
        } else if (no == 2) {
          playAudio("https://drive.google.com/uc?export=download&id=1nFS7yZbGoXQHGpbapBwdMHtc16JrZjpd")
        } else {
          audio.src = ""
        }
      })
      break;
    case "control":
      appendNormal("Opening site control dashboard...")
      window.displayTitle = ""
      if (locationGet != false) {
        displayTitle = country
      }
      popUp(`${displayTitle} Main Site Control Unit`, "<div class='pulse'></div><div class='loadText'>Loading Dashboard...<br><small>This might take a while depending on your internet speed</small></div>")
      import( /*webpackChunkName:'control'*/ './control.js').then((module) => {
        module.siteControl()
      })
      break;
    case "settings":
      appendNormal("Opening settings...")
      popUp(`Settings`, `<div class='pulse'></div><div class='loadText'>Loading Settings...</div>`)
      import( /*webpackChunkName:'settings'*/ './settings.js').then((module) => {
        module.settings()
        if (setting["checkLocation"] == true) {
          $("#maskLocationBox").prop('checked', true);
        }
      })
      break;
    case "help":
      if (splitValue(val)[1] != undefined) {
        var helpVal = splitValue(val)[1]
        var helpMess = ""
        var helpSyn = ""
        if (helpVal == "access") {
          helpMess = "Displays the Special Containment Procedures synopsis for a given artifact."
          helpSyn = "ACCESS <u>SCP Number</u> <u>Clearance Level</u>"
        } else if (helpVal == "list") {
          helpMess = "Lists out all the accessible artifacts."
          helpSyn = "LIST"
        } else if (helpVal == "language") {
          helpMess = "Provides options to select the language of the SCP file you wish to access."
          helpSyn = "LANGUAGE"
        } else if (helpVal == "fullscreen") {
          helpMess = "Opens fullscreen."
          helpSyn = "FULLSCREEN"
        } else if (helpVal == "fullquit") {
          helpMess = "Exits fullscreen."
          helpSyn = "FULLQUIT"
        } else if (helpVal == "clear") {
          helpMess = "Clears the output of the terminal."
          helpSyn = "CLEAR"
        } else if (helpVal == "help") {
          helpMess = "Displays the Help menu."
          helpSyn = "HELP"
        } else if (helpVal == "login") {
          helpMess = "Authenticates and login user."
          helpSyn = "LOGIN"
        } else if (helpVal == "register") {
          helpMess = "Logs and stores your information into the database."
          helpSyn = "REGISTER"
        } else if (helpVal == "whoami") {
          helpMess = "Displays user's information."
          helpSyn = "WHOAMI"
        } else if (helpVal == "edit") {
          helpMess = "Edits user's information."
          helpSyn = "EDIT"
        } else if (helpVal == "resetpass") {
          helpMess = "Reset user's password."
          helpSyn = "RESETPASS"
        } else if (helpVal == "theme") {
          helpMess = "Provides options to change the theme of the terminal."
          helpSyn = "THEME"
        } else if (helpVal == "logout") {
          helpMess = "Logout user."
          helpSyn = "LOGOUT"
        } else if (helpVal == "lockout") {
          helpMess = "Initiates the emergency lockout protocol, securing all documents and preventing any access from the specified endpoint. You will be required to enter a passcode for unlocking the terminal and all system values will be logged and reported to The Recordkeeping and Information Security Administration (RAISA)."
          helpSyn = "LOCKOUT"
        } else if (helpVal == "locate") {
          helpMess = "Locates user's location and reports details relating to the local area."
          helpSyn = "LOCKOUT"
        } else if (helpVal == "bgm") {
          helpMess = "Provides options to play music in the background."
          helpSyn = "BGM"
        } else if (helpVal == "settings") {
          helpMess = "Opens the settings window"
          helpSyn = "SETTINGS"
        } else {
          helpMess = "Undefined command"
          helpSyn = "N/A"
        }
        appendNormal(`<div class="code"><b>${String(helpVal).toUpperCase()}: </b>${helpMess}<br><hr>Syntax: ${helpSyn}</div>`)
      } else {
        appendNormal(`<h3>List of available commands</h3><blockquote>You can use the following commands by entering in the text box below<p><u>General</u></p><ul class="helpList"><li><strong>Access:</strong> Displays the Special Containment Procedures synopsis for a given artifact <br /><small style="opacity: 0.7;">&nbsp; Example: access 173 5</small></li><li><strong>List:</strong> Lists out all the accessible artifacts</li><li><strong>Language:</strong> Provides options to select the language of the SCP file you wish to access</li><li><strong>Fullscreen:</strong> Opens fullscreen</li><li><strong>Fullquit:</strong> Exits fullscreen</li><li><strong>Clear:</strong> Clears the output of the terminal</li><li><strong>Theme:</strong> Provides options to change the theme of the terminal</li><li><strong>Lockout:</strong> Initiates the emergency lockout protocol, securing all documents and preventing any access from the specified endpoint</li><li><strong>Locate:</strong> Locates user's location and reports details relating to the local area</li><li><strong>Bgm:</strong> Provides options to play music in the background</li><li><strong>Settings:</strong> Opens the settings window</li><li><strong>Help:</strong> Displays this message</li></ul><p><span style="text-decoration: underline;">Authentication</span></p><ul class="helpList"><li><strong>Login:</strong> Authenticates and login user</li><li><strong>Register:</strong> Logs and stores your information into the database</li><li><strong>Whoami:</strong> Displays user's information</li><li><strong>Edit:</strong> Edits user's information</li><li><strong>Resetpass:</strong> Reset user's password</li><li><strong>Logout:</strong> Logout user</li></ul><hr>Join our community here on<a onclick="window.open('https://discord.gg/rKsT8eEGXz', '_blank')">Discord</a>or support us on<a onclick="window.open('https://www.patreon.com/scipnet', '_blank')">Patreon</a>/<a onclick="window.open('https://ko-fi.com/scipnet', '_blank')">Ko-fi</a>!<br><hr><small>Read more about our licensing & policies<a onclick="window.open('/src/html/license.html', '_blank')">Here</a>.</small></blockquote>`)
      }
      break;
    case "clear":
      $d.html(`${holder} `)
      break;
    case "theme":
      appendNormal(`<div class="code"><h1>Theme Picker<sub style="font-size:15px">Beta</sub></h1><blockquote style="background:none;margin-bottom: 0;">Please select your theme colour:<br><input type="color" class="colorPicker themePicker" name="colorPicker" onchange="parent.changeColor(this.value);" value="${color}">Please select your contrast colour:<br><input type="color" class="colorPicker contrastPicker" name="colorPicker" onchange="parent.changeContrastColor(this.value);" value="${textContrastColor}">Please select your terminal text colour:<br><input type="color" class="colorPicker textPicker" name="colorPicker " onchange="parent.changeTerminalTextColor(this.value);" value="${textColor}">Please select your background colour:<br><input type="color" class="colorPicker backgroundPicker" name="colorPicker" onchange="parent.changeBackgroundColor(this.value);" value="${backgroundColor}"><span class="applicationBtn resetTheme">Reset</span><span class="applicationBtn saveCloudTheme">Save to Server</span></blockquote></div>`)
      $d.find(".resetTheme").off('click').bind('click', function() {
        backgroundColor = "#1e1e1e"
        color = "#f5d546"
        textColor = "#ffffff"
        textContrastColor = "#111111"
        changeAll()
      })
      $d.find(".saveCloudTheme").off('click').bind('click', function() {
        if (userLoggedIn && firebase.auth().currentUser.uid != null) {
          $d.find(".saveCloudTheme").css("opacity", "0.7")
          $d.find(".saveCloudTheme").css("pointer-events", "none")
          firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).set({
              Theme: `${backgroundColor}|${color}|${textColor}|${textContrastColor}`,
            }, {
              merge: true
            })
            .then(() => {
              $d.find(".saveCloudTheme").css("opacity", "")
              $d.find(".saveCloudTheme").css("pointer-events", "")
              popUp("notice", "Settings saved.")
            })
            .catch(function(error) {
              showWarning(error)
            })
        } else {
          showWarning("You must be logged in before you can use this function.")
        }
      })
      break;
    case "list":
      appendNormal(`<h3>List of accessible documents</h3><blockquote><p><span style="text-decoration: underline;">SCP by Series</span></p><ul style="list-style-type: none; padding: 0 10px;"><li><strong>I:</strong> <ele-access data-link="http://www.scpwiki.com/scp-series">001-999</ele-access></li><li><strong>II:</strong> <ele-access data-link="http://www.scpwiki.com/scp-series-2">1000-1999</ele-access></li><li><strong>III:</strong> <ele-access data-link="http://www.scpwiki.com/scp-series-3">2000-2999</ele-access></li><li><strong>IV:</strong> <ele-access data-link="http://www.scpwiki.com/scp-series-4">3000-3999</ele-access></li><li><strong>V:</strong> <ele-access data-link="http://www.scpwiki.com/scp-series-5">4000-4999</ele-access></li><li><strong>VI:</strong> <ele-access data-link="http://www.scpwiki.com/scp-series-6">5000-5999</ele-access></li><li><strong>VII:</strong> <ele-access data-link="http://www.scpwiki.com/scp-series-7">6000-6999</ele-access></li></ul><p><span style="text-decoration: underline;">SCP Tales by Series</span></p><ul style="list-style-type: none; padding: 0 10px;"><li><strong>I:</strong> <ele-access data-link="http://www.scpwiki.com/scp-series-1-tales-edition">001-999</ele-access></li><li><strong>II:</strong> <ele-access data-link="http://www.scpwiki.com/scp-series-2-tales-edition">1000-1999</ele-access></li><li><strong>III:</strong> <ele-access data-link="http://www.scpwiki.com/scp-series-3-tales-edition">2000-2999</ele-access></li><li><strong>IV:</strong> <ele-access data-link="http://www.scpwiki.com/scp-series-4-tales-edition">3000-3999</ele-access></li><li><strong>V:</strong> <ele-access data-link="http://www.scpwiki.com/scp-series-5-tales-edition">4000-4999</ele-access></li></ul><p><span style="text-decoration: underline;">Other Useful Resources</span></p><ul style="list-style-type: none; padding: 0 10px;"><li><ele-access data-link="http://www.scpwiki.com/about-the-scp-foundation">About the Foundation</ele-access></li><li><ele-access data-link="http://www.scpwiki.com/object-classes">Object Classes</ele-access></li><li><ele-access data-link="http://www.scpwiki.com/personnel-and-character-dossier/noredirect/true">Personnel Dossier</ele-access></li><li><ele-access data-link="http://www.scpwiki.com/security-clearance-levels">Security &amp; Clearance</ele-access></li><li><ele-access data-link="http://www.scpwiki.com/secure-facilities-locations/noredirect/true">Secure Facilities</ele-access></li><li><ele-access data-link="http://www.scpwiki.com/task-forces/noredirect/true">Task Forces</ele-access></li><li><ele-access data-link="http://www.scpwiki.com/k-class-complete-list">K-Class Scenarios</ele-access></li></ul></blockquote>`)
      AccessLink()
      break;
    case "resetpass":
      if (userLoggedIn) {
        resetPassword(firebase.auth().currentUser.email)
        cmdHide()
      } else {
        appendNormal(`Please enter the email address you wish to reset your password`)
        resetState = 1
      }
      break;
    case "lockout":
      if (userLoggedIn) {
        if (clearance < 2) {
          appendWarn("YOU DO NOT HAVE SUFFICIENT CLEARANCE TO INSTRUCT A LOCKOUT PROTOCOL, A MINIMUM OF LEVEL 2 CLEARANCE IS REQUIRED")
        } else {
          appendNormal("Instruction received, please enter a passcode for unlocking the terminal")
          btnHide()
          lockoutProcess = 1;
        }
      } else {
        appendNoLogin()
      }
      break;
    case "locate":
      if (locationGet != false) {
        import( /*webpackChunkName:'locate'*/ './locate.js').then((module) => {
          module.locate()
        })
        cmdHide()
        $d.append(`<blockquote id="waitingToAdd">Locating SCiPNET Portal (${ip})...</blockquote>`)
        addDot()
      } else {
        appendError(`FAILED TO FETCH YOUR LOCATION, REQUEST REFUSED`)
      }

      break;
    case "whoami":
      profileListing += 1
      if (userLoggedIn) {
        cmdHide()
        $d.append(`<blockquote id="waitingToAdd">Accessing your profile...</blockquote>`)
        addDot()
        import( /*webpackChunkName:'profile'*/ './profile.js').then((module) => {
          loadCroppie(function() {
            module.whoami()
          })
        })
      } else {
        appendNoLogin()
      }
      break;
    case "logout":
      if (userLoggedIn) {
        $d.append('<blockquote>Logging you out...</blockquote>')
        firebase.auth().signOut().then(() => {
          holder = defaultHolder
          appendNormal(`You are now logged out, thank you.`)
          btnShow()
        }).catch((error) => {
          // An error happened.
        });
      } else {
        appendNoLogin()
      }
      break;
    case "register":
      if (userLoggedIn) {
        appendError("YOU HAVE ALREADY LOGGED IN.")
      } else {
        appendNormal(`Your request to register with our foundation (SCP Foundation) via the SCiPNET terminal at <span class="highlight">${new Date().toLocaleString('en-US')}</span> has been approved. We hereby grant you the right to select positions within the foundation. However, you must undertake to maintain the highest level of confidentiality with respect to our foundation's internal documents and commit not to disclose the foundation's documents in any form.<br><hr> <small style='opacity:0.7'>Enter "Y" to continue and indicate that you agree to our<a onclick="window.open('/src/html/license.html', '_blank')">licensing & policies</a>or "N" to abort, you can always enter "Quit" to exit the registration process.</small>`)
        registerState = 1
        btnHide()
        cmdHide()
        import( /*webpackChunkName:'register'*/ './register.js').then((module) => {
          cmdShow()
          window.registerProcess = module.registerProcess
        })
      }
      break;
    default:
      addEventLog(`Undefined command -${splitValue(val)[0]}-`, true)
      appendError("INCORRECT FORMAT OR UNKNOWN COMMAND")
  }
}

//distrube the input according to the variables
$("#input").on('keyup', function(e) {
  if (e.key === 'Enter' || e.keyCode === 13) {
    if ($("#input").val() != "") {
      inputVal = $("#input").val();
      if (tab == 0) {
        if ([3, 4].includes(loginState) || [6, 7].includes(registerState) || lockoutProcess != 0 || editState == 2) {
          $d.append(`**-[SENSITIVE INFO - AUTO MASKED]-**<br>`)
        } else {
          $d.append(`${$("#input").val()}<br>`)
        }
        if (registerState == 0 && loginState == 0 && editState == 0 && resetState == 0 && lockoutProcess == 0) {
          reply(inputVal)
        } else if (registerState != 0) {
          registerProcess(inputVal)
        } else if (loginState != 0) {
          loginProcess(inputVal)
        } else if (editState != 0) {
          editProcess(inputVal)
        } else if (resetState != 0) {
          cmdHide()
          resetPassword(inputVal)
        } else {
          lockoutProcessFun(inputVal)
        }
        scroll()
        $("#input").val('')
      }
    }
  }
});

//values handling
//function to split user input by spaces
function splitValue(val) {
  return val.split(" ");
}
//check is the string a number
function isNumber(n) {
  return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
}

//switching tabs
var refreshHide;
$("#chat").off('click').bind('click', function() {
  if (tab == 0) {
    if (vcLoaded == false) {
      $("#comIframe").attr('src', '/src/html/comframe.html')
      $("#comIframe").on('load', function() {
        bubbleIframeMouseMove(document.getElementById("comIframe"))
      })
      $.getScript('src/js/vc.js')
      vcLoaded = true
    }
    refreshHide = setInterval(function() {
      $("#input").css("opacity", "0.5")
      $("#input").attr('disabled', 'disabled')
    }, 100);
    setTimeout(function() {
      clearInterval(refreshHide);
    }, 2000);
    $("#input").css("opacity", "0.5")
    $("#input").attr('disabled', 'disabled')
    $(".close").css("opacity", "")
    $(".close").css("pointer-events", "auto")
    tab = 1
    $(this).removeClass("offTab")
    $("#cmdBtn").addClass("offTab")
    $("#comIframe").css("z-index", "2")
    $("#cmdIframe").css("z-index", "1")
  }
})
$("#cmdBtn").off('click').bind('click', function() {
  if (tab == 1) {
    clearInterval(refreshHide);
    tab = 0
    if (isHide == true) {
      cmdHide()
    } else {
      cmdShow()
    }
    if (isBtnHide == true) {
      btnHide()
    }
    $(this).removeClass("offTab")
    $("#chat").addClass("offTab")
    $("#cmdIframe").css("z-index", "2")
    $("#comIframe").css("z-index", "1")
  }
})

//sidebar function
sideBarFun()

//location masking function
window.locationMasking = (con) => {
  if (JSON.parse(con) == true) {
    //set the location mask setting to true
    setting["checkLocation"] = true
    //variable for indicating no location available
    locationGet = false
    window.displayLoc = ""
    $("#ip, #location, #tel").html('<span style="color:#EA3546"><span style="font-weight:bold">ⓘ</span> [REQUEST REFUSED]</span>')
  } else {
    setting["checkLocation"] = false
    checkPlaceLoaded()

    function checkPlaceLoaded() {
      if (typeof place !== 'undefined') {
        if (place != "") {
          $("#location").text(place)
          $("#ip").html(`${ip}`)
          $("#tel").text(`${tele}`)
          locationGet = true
          window.displayLoc = place.toUpperCase()
        }
        return;
      }
      window.setTimeout(checkPlaceLoaded, 100)
    }
  }
}

//close button
$(".close").off('click').bind('click', function() {
  close()
})

function close() {
  if ($.isFunction($.fn.croppie)) {
    $("#previewBox").croppie('destroy');
  }
  if (typeof textRandom !== 'undefined') {
    clearInterval(textRandom);
    clearInterval(dataRandom);
    clearInterval(dnaRandom);
  }
  $(".modal").hide()
  $("#previewBox").html('<img id="previewBox" />')
  $(".modalText:not(#previewText)").html('')
  $(".modal-content").addClass("tem")
  $(".tem").removeClass("modal-content")
  setTimeout(function() {
    $(".tem").addClass("modal-content")
    $(".modal-content").removeClass("tem")
  }, 10);
}

//functions for open and close fullscreen
var elem = document.documentElement;

function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE11 */
    elem.msRequestFullscreen();
  }
}

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE11 */
    document.msExitFullscreen();
  }
}

//theme functions
window.hex2rgb = (hex) => {
  return ['0x' + hex[1] + hex[2] | 0, '0x' + hex[3] + hex[4] | 0, '0x' + hex[5] + hex[6] | 0];
}
window.changeAll = (condition) => {
  if (lockout == false) {
    function changeCssVar() {
      var $d = $("#cmdIframe").contents().find("body")
      $("#cmdIframe").contents().find("body").add($("body")).add($("#comIframe").contents().find("body")).css({
        '--defaultTheme': color,
        '--defaultThemeRGB': hex2rgb(color),
        '--defaultText': textColor,
        '--defaultTextRGB': hex2rgb(textColor),
        '--defaultContrast': textContrastColor,
        '--defaultBackground': backgroundColor
      });
      $d.find(".textPicker").each(function() {
        $(this).val(textColor)
      })
      $d.find(".contrastPicker").each(function() {
        $(this).val(textContrastColor)
      })
      $d.find(".themePicker").each(function() {
        $(this).val(color)
      })
      $d.find(".backgroundPicker").each(function() {
        $(this).val(backgroundColor)
      })
    }
    if ($d == undefined || $m == undefined) {
      $("#cmdIframe").add($("#comIframe")).on('load', function() {
        changeCssVar()
      })
    }
    changeCssVar()

    if (condition != true) {
      localStorage.setItem('backgroundColor', backgroundColor);
      localStorage.setItem('color', color);
      localStorage.setItem('textColor', textColor);
      localStorage.setItem('textContrastColor', textContrastColor);
      localbackgroundColor = localStorage.getItem('backgroundColor');
      localcolor = localStorage.getItem('color');
      localtextColor = localStorage.getItem('textColor');
      localtextContrastColor = localStorage.getItem('textContrastColor');
    } else {
      defaultTheme = false
    }
  } else {
    storedColor = [backgroundColor, color, textColor, textContrastColor]
  }
}
window.changeColor = (value) => {
  color = value
  textContrastColor = generator.generate(value).hexStr
  changeAll()
}
window.changeContrastColor = (value) => {
  textContrastColor = value
  changeAll()
}
window.changeTerminalTextColor = (value) => {
  textColor = value
  changeAll()
}
window.changeBackgroundColor = (value) => {
  backgroundColor = value
  changeAll()
}

//load the extension croppie and firebase storage for the profile picture function
window.loadCroppie = (callback) => {
  if (isProfileLoaded == false) {
    $.when(
      $.getScript("/__/firebase/8.6.3/firebase-storage.js"),
      $.getScript("/__/firebase/8.8.0/firebase-app-check.js"),
      $.getScript("/src/js/upload.js"),
      $.Deferred(function(deferred) {
        $(deferred.resolve);
      })
    ).done(function() {
      //appCheck setup
      const appCheck = firebase.appCheck();
      appCheck.activate('6Lch95QbAAAAAKydxDgt3zyqBGtAt9WWQ2-qafVi');
      callback()
      isProfileLoaded = true
    });
    $('head').append('<link rel="stylesheet" href="/src/ex_file/css/croppie.min.css" />');
    $('head').append('<script src="/src/ex_file/scripts/croppie.min.js"></script>');
  } else {
    callback()
  }
}

//load and import the access component on inital access
function accessLoad(a, b) {
  if (init == false) {
    $d.append(`<blockquote id="waitingToAdd">Initializing connection...`)
    addDot()
    setTimeout(function() {
      var verifyLinkLoaded = false
      $('#cmdIframe').contents().find("head").append('<link rel="stylesheet" href="/src/ex_file/css/discord.min.css" />');
      checkall(function() {
        verifyLinkLoaded = true
      })
      import( /*webpackChunkName:'access'*/ './access.js')
        .then(module => {
          access = module.access
          checkLinkLoaded()

          function checkLinkLoaded() {
            if (verifyLinkLoaded) {
              init = true
              access(a, b)
              return;
            }
            window.setTimeout(checkLinkLoaded, 100)
          }
        })
    }, 100);
  } else {
    access(a, b)
  }
}

//setup a listener for access button click
function AccessLink() {
  $d.find("ele-access").off('click').bind('click', function() {
    if ($("#input").attr('disabled') == undefined && loginState == 0 && registerState == 0 && editState == 0 && resetState == 0) {
      $("#input").css("opacity", "0.5")
      $("#input").attr('disabled', 'disabled')
      scroll()
      var linkforAccess = $(this).attr("data-link")
      var res = []
      if (linkforAccess.includes('.com')) {
        res = linkforAccess.split(".com/");
        clickfind(res)
      } else if (linkforAccess.includes('.pl')) {
        res = linkforAccess.split(".pl/");
        clickfind(res)
      } else if (linkforAccess.includes('.net')) {
        res = linkforAccess.split(".net/");
        clickfind(res)
      }
    }
  })

  //pass the info to the main access function
  function clickfind(res) {
    if (userLoggedIn) {
      $d.append(`access ${res[1]} ${clearance}`)
      accessLoad(res[1], clearance)
    } else {
      $d.append(`access ${res[1]}`)
      accessLoad(res[1], 0)
    }
  }
}

//lockout function loading
var passLock;

function lockoutProcessFun(val) {
  $d.append("<blockquote>Validating credentials...</blockquote>")
  cmdHide()
  import( /*webpackChunkName:'lockout'*/ './lockout.js').then((module) => {
    cmdShow()
    btnShow()
    if (lockoutProcess == 1) {
      passLock = val
      storedColor = [backgroundColor, color, textColor, textContrastColor]
      backgroundColor = "#1e1e1e"
      color = "#e7192d"
      textColor = "#ffffff"
      textContrastColor = "#000000"
      changeAll(true)
      lockout = true
      $('#dimmer').fadeIn("fast")
      $('.banners').fadeIn("fast")
      module.lock()
      lockoutProcess = 2
    } else {
      if (passLock == val) {
        lockout = false
        backgroundColor = storedColor[0]
        color = storedColor[1]
        textColor = storedColor[2]
        textContrastColor = storedColor[3]
        changeAll()
        $(".modal-content").attr("style", "")
        close()
        $('#dimmer').fadeOut("fast")
        $('.banners').fadeOut("fast")
        module.unlock()
        appendNormal(`Terminal unlocked, authorized by ${displayName} at <span class="highlight">${new Date().toLocaleString('en-US')} via SCiPNET ${displayLoc} SCP FOUNDATION PORTAL</span> [event no. ${Math.random().toString(36).slice(2).toUpperCase()}]`)
        lockoutProcess = 0
      } else {
        appendError("INCORRECT UNLOCK PASSCODE")
      }
    }
  })
}

//function to reset password
function resetPassword(emailAddress) {
  firebase.auth().sendPasswordResetEmail(emailAddress).then(function() {
    appendNormal(`<span style="color:#98FB98">[✓] </span>The email to reset your password has been sent to your email inbox`)
    resetState = 0
    cmdShow()
    btnShow()
  }).catch(function(error) {
    appendError(`${String(error).toUpperCase()} PROCESS EXITED.`)
    resetState = 0
    cmdShow()
    btnShow()
  });
}
