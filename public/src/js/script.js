import {
  loginConvert
} from './login.js';
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
$("#version").text("V. 01-9-0.21")
//script variables
var access
var vcLoaded = false;
var fsLoaded = false;
var init = false;
var defaultTheme;
//change theme according to local storage
var localbackgroundColor = localStorage.getItem('backgroundColor');
var localcolor = localStorage.getItem('color');
var localtextColor = localStorage.getItem('textColor');
var localtextContrastColor = localStorage.getItem('textContrastColor');

//check if user on mobile
if (/Mobi|Android/i.test(navigator.userAgent)) {
  popUp("NOTICE", "Browsing SCiPNET via desktop is recommended for the best experience")
}

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
            settings["checkLocation"] = doc.data().Settings.checkLocation
            locationMasking(settings["checkLocation"])
          }
        }
        checkIframeLoaded()
      }
    })
    reloadInfo()

    userLoggedIn = true
    holder = `<span class="highlight">root@${displayName}</span>:<span style="color:#6495ED">~</span>$ `
  } else {
    userLoggedIn = false
    holder = defaultHolder
    checkIframeLoaded()
    checkLocalStorageAndChange()
    locationMasking(localStorage.getItem('checkLocation'))
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
    timeout: 10000
  });
}

//check the available proxy server and find the one that can be used
function checkall(callback) {
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

//check the availability of the current server every 300 seconds
checkall()

//main control unit that identify the user input and allocate command
function reply(val) {
  val = val.toLowerCase().trim()
  //check the user input
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
      break;
    case "login":
      if (userLoggedIn) {
        appendError("YOU HAVE ALREADY LOGGED IN.")
      } else {
        btnHide()
        cmdHide()
        $d.append("<blockquote id='waitingToAdd'>Sending request to the database...</blockquote>")
        addDot()
        setTimeout(function() {
          cmdShow();
          appendNormal(`<span style="color:#98FB98">[✓] </span>Authentication request accepted at <span class="highlight">${new Date().toLocaleString('en-US')}</span><br><hr><small style='opacity:0.7'>Please enter your email address, you can always enter "Quit" to exit the login process</small>`)
        }, 1000);
        loginState = 1
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
      popUp(`${displayTitle} Main Site Control Unit`, "LOADING...")
      import( /*webpackChunkName:'control'*/ './control.js').then((module) => {
        module.siteControl()
      })
      break;
    case "settings":
      appendNormal("Opening settings...")
      popUp(`Settings`, `<blockquote class="darken">LOADING...</blockquote>`)
      import( /*webpackChunkName:'settings'*/ './settings.js').then((module) => {
        module.settings()
        if (settings["checkLocation"] == true) {
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
        appendNormal(`<h3>List of available commands</h3><blockquote>You can use the following commands by entering in the text box below<p><u>General</u></p><ul class="helpList"><li><strong>Access:</strong> Displays the Special Containment Procedures synopsis for a given artifact <br /><small style="opacity: 0.7;">&nbsp; Example: access 173 5</small></li><li><strong>List:</strong> Lists out all the accessible artifacts</li><li><strong>Language:</strong> Provides options to select the language of the SCP file you wish to access</li><li><strong>Fullscreen:</strong> Opens fullscreen</li><li><strong>Fullquit:</strong> Exits fullscreen</li><li><strong>Clear:</strong> Clears the output of the terminal</li><li><strong>Theme:</strong> Provides options to change the theme of the terminal</li><li><strong>Lockout:</strong> Initiates the emergency lockout protocol, securing all documents and preventing any access from the specified endpoint</li><li><strong>Locate:</strong> Locates user's location and reports details relating to the local area</li><li><strong>Bgm:</strong> Provides options to play music in the background</li><li><strong>Settings:</strong> Opens the settings window</li><li><strong>Help:</strong> Displays this message</li></ul><p><span style="text-decoration: underline;">Authentication</span></p><ul class="helpList"><li><strong>Login:</strong> Authenticates and login user</li><li><strong>Register:</strong> Logs and stores your information into the database</li><li><strong>Whoami:</strong> Displays user's information</li><li><strong>Edit:</strong> Edits user's information</li><li><strong>Resetpass:</strong> Reset user's password</li><li><strong>Logout:</strong> Logout user</li></ul><hr>Join our community here on<a onclick="window.open('https://discord.gg/rKsT8eEGXz', '_blank')">Discord</a>or support us on<a onclick="window.open('https://www.patreon.com/scipnet', '_blank')">Patreon</a>!<br><hr><small>Read more about our licensing & policies<a onclick="window.open('/src/html/license.html', '_blank')">Here</a>.</small></blockquote>`)
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
      }
      break;
    default:
      appendError("INCORRECT FORMAT OR UNKNOWN COMMAND")
  }
}

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

//append when user haven't logged in
function appendNoLogin() {
  appendError("CURRENT USER IS NOT AUTHENTICATED, PLEASE LOGIN OR REGISTER FIRST TO ACCESS THIS COMMAND.")
}

//sidebar function
sideBarFun()

//command function
window.locationMasking = (con) => {
  if (JSON.parse(con) == true) {
    //set the location mask setting to true
    settings["checkLocation"] = true
    //variable for indicating no location available
    locationGet = false
    window.displayLoc = ""
    $("#ip, #location, #tel").html('<span style="color:#EA3546"><span style="font-weight:bold">ⓘ</span> [REQUEST REFUSED]</span>')
  } else {
    settings["checkLocation"] = false
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

var elem = document.documentElement;

$(".close").unbind('click').bind('click', function() {
  close()
})

function close() {
  if ($.isFunction($.fn.croppie)) {
    $("#previewBox").croppie('destroy');
  }
  if (typeof textRandom !== 'undefined') {
    clearInterval(textRandom);
    clearInterval(dataRandom);
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
      $("#cmdIframe").contents().find("body").add($("body")).add($("#comIframe").contents().find("body")).css({
        '--defaultTheme': color,
        '--defaultThemeRGB': hex2rgb(color),
        '--defaultText': textColor,
        '--defaultTextRGB': hex2rgb(textColor),
        '--defaultContrast': textContrastColor,
        '--defaultBackground': backgroundColor
      });
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
function loadCroppie(callback) {
  if (isProfileLoaded == false) {
    $.getScript("/__/firebase/8.6.3/firebase-storage.js", function() {
      if (isProfileLoaded == true) {
        callback()
      } else {
        isProfileLoaded = true
      }
    });
    $.getScript("/__/firebase/8.8.0/firebase-app-check.js", function() {
      //appCheck setup
      const appCheck = firebase.appCheck();
      appCheck.activate('6Lch95QbAAAAAKydxDgt3zyqBGtAt9WWQ2-qafVi');
      if (isProfileLoaded == true) {
        callback()
      } else {
        isProfileLoaded = true
      }
    });
    $('head').append('<link rel="stylesheet" href="/src/ex_file/croppie.min.css" />');
    $('head').append('<script src="/src/ex_file/croppie.min.js"></script>');
  } else {
    callback()
  }
}

//load and import the access component at the inital access
function accessLoad(a, b) {
  if (init == false) {
    $d.append(`<blockquote id="waitingToAdd">Initializing connection...`)
    addDot()
    setTimeout(function() {
      var verifyLinkLoaded = false
      $('#cmdIframe').contents().find("head").append('<link rel="stylesheet" href="/src/ex_file/discord.min.css" />');
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

//reload and refresh the user information
function reloadInfo() {
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

//authentication variables
var userReg;
var clrReg;
var classReg;
var titleReg;
var emailReg;
var siteReg;
var passReg;
var keyReg = "";

var emailLog;
var passLog;
var keyLog;

//register user through firebase auth
function registerProcess(val) {
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

//login user through firebase auth
function loginProcess(val) {
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
          appendNormal(`Your personal authorization keyphrase is: <span class="highlight">${keyLog}</span>`)
          $("#input").val(keyLog)
        } else {
          appendError(`INCORRECT AUTHENTICATION KEYPHRASE`)
        }
      }
    }
  }
}

//send the updated user information to the server through firebase auth
function updateUsersInfo() {
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

var passLock;

function lockoutProcessFun(val) {
  import( /*webpackChunkName:'lockout'*/ './lockout.js').then((module) => {
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

//open and set menu for editing user information
function editProcess(val) {
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

//function to check if username exist in the firestore database
async function checkUsernameAva(con, callback) {
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

//error effect during Level 5 registration
function errorEffect() {
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
    jQuery.get("/src/ex_file/codeText.html", function(va) {
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
