"use strict";(self.webpackChunkscipnet_terminal=self.webpackChunkscipnet_terminal||[]).push([[690],{6553:(e,a,t)=>{t.r(a),t.d(a,{lock:()=>n,unlock:()=>r});var s,l=t(7025);const n=()=>{1==setting.audioStatus&&((s=new Audio("/src/ex_file/audio/alert.mp3")).addEventListener("ended",(function(){this.currentTime=0,this.play()}),!1),s.play()),$(".close").hide(),popUp("TERMINAL LOCKOUT",`<div style='text-align:center'>EMERGENCY LOCKOUT PROTOCOL INITIATED<br>.<br>.<br><span style="opacity:0.7;font-size:10px">INSTRUCTED BY ${String(displayName).toUpperCase()}, LEVEL ${clearance} CLEARANCE ORDER</span><br><span style="opacity:0.7;font-size:10px">Assigned via SCiPNET ${displayLoc} SCP FOUNDATION PORTAL</span></div>`),$("#NormalModalId").css("background","none"),$(".modal-content").attr("style","background-color:transparent!important"),$("#NormalModalId h1").css("text-align","center"),$(".modal").css("z-index","4"),(0,l.s8)(`TERMINAL LOCKOUT - SYSTEM VALUE LOGGED<br><small>INSTRUCTED BY ${String(displayName).toUpperCase()}, LEVEL ${clearance} CLEARANCE ORDER</small>`),$("#input").attr("placeholder","EMERGENCY LOCKOUT PROTOCOL INITIATED, ENTER PASSCODE TO UNLOCK =>"),$("#ok").text("FILE SECURED, TERMINAL LOCKOUT"),$("#alarm").text("STANDBY MODE"),$("smallres").css("color","#e7192d")},r=()=>{1==setting.audioStatus&&(s.pause(),s.currentTime=0),$(".close").show(),$("#NormalModalId").css("background",""),$("#NormalModalId h1").css("text-align",""),$(".modal").css("z-index",""),$("#input").attr("placeholder","Enter Command..."),$("#ok").text("OK"),$("#alarm").text("NORMAL"),$("smallres").css("color","")}}}]);