import {
  appendNormal,
} from './utils.js';

var audio;

export const lock = () => {
  audio = new Audio('/src/ex_file/alert.mp3');
  audio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
  }, false);
  audio.play();


  $(".close").hide()
  popUp("TERMINAL LOCKOUT", `<div style='text-align:center'>EMERGENCY LOCKOUT PROTOCOL INITIATED<br>.<br>.<br><span style="opacity:0.7;font-size:10px">INSTRUCTED BY ${String(displayName).toUpperCase()}, LEVEL ${clearance} CLEARANCE ORDER</span><br><span style="opacity:0.7;font-size:10px">Assigned via SCiPNET ${place.toUpperCase()} SCP FOUNDATION PORTAL</span></div>`)
  $("#NormalModalId").css("background", "none")
  $(".modal-content").attr("style","background-color:transparent!important")
  $("#NormalModalId h1").css("text-align", "center")
  $(".modal").css("z-index", "4")
  appendNormal(`TERMINAL LOCKOUT - SYSTEM VALUE LOGGED<br><small>INSTRUCTED BY ${String(displayName).toUpperCase()}, LEVEL ${clearance} CLEARANCE ORDER</small>`)
  $("#input").attr("placeholder", "EMERGENCY LOCKOUT PROTOCOL INITIATED, ENTER PASSCODE TO UNLOCK =>")
  $("#ok").text("FILE SECURED, TERMINAL LOCKOUT")
  $("#alarm").text("STANDBY MODE")
  $("smallres").css("color", "#e7192d")

};

export const unlock = () => {
  audio.pause();
  audio.currentTime = 0;
  $(".close").show()
  $("#NormalModalId").css("background", "")
  $("#NormalModalId h1").css("text-align", "")
  $(".modal").css("z-index", "")
  $("#input").attr("placeholder", "Enter Command...")
  $("#ok").text("OK")
  $("#alarm").text("NORMAL")
  $("smallres").css("color", "")
};
