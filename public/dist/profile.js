"use strict";(self.webpackChunkscipnet_terminal=self.webpackChunkscipnet_terminal||[]).push([[138],{3225:(l,t,e)=>{e.r(t),e.d(t,{whoami:()=>i});var a=e(7025);function i(){$d.append(`<br><br><div class="profile editPhoto" data-uid="${firebase.auth().getUid()}">\n            <h3 style="text-align: center;"><strong>${displayName}'S PROFILE</strong></h3>\n            <div id="profileChange"></div>\n            <div class="profileData" style="float: left;max-width: 250px;"><small style="text-align: left;">USERNAME:</small>\n            <p class="highlight" style="text-align: left;">${displayName}<span style="color: rgba(159, 159, 159, 0.64);">#${tagNo}</span></p>\n            <hr /><small style="text-align: left;">SECURITY CLEARANCE LEVEL:</small>\n            <p class="highlight" style="text-align: left;">${clearance}</p>\n            <hr /><small>PERSONNEL CLASSIFICATION:</small>\n            <p class="highlight">${classification}</p>\n            <hr /><small style="text-align: left;">STAFF TITLE:</small>\n            <p class="highlight" style="text-align: left;">${title}</p>\n            <hr /><small style="text-align: left;">WORKING SITE:</small>\n            <p class="highlight" style="text-align: left;">${site}</p>\n            <hr />\n            <p style="text-align: left;">&nbsp;</p>\n            </div>\n            <div style="clear: both;">&nbsp;</div>\n            <h3 style="text-align: center;"><strong>CONFIDENTIAL INFORMATION</strong></h3>\n            <small style="text-align: left;">EMAIL ADDRESS:</small>\n            <p class="highlight" style="text-align: left;">${firebase.auth().currentUser.email}</p>\n            <hr />\n            <small style="text-align: left;">USER ID:</small>\n            <p class="highlight" style="text-align: left;">${tag}</p>\n            <hr />\n            <small style="text-align: left;">DATE OF JOINING THE FOUNDATION:</small>\n            <p class="highlight" style="text-align: left;">${new Date(firebase.auth().currentUser.metadata.creationTime).toLocaleDateString("en-US")}</p>\n            <hr />\n            <small style="text-align: left;">LAST LOGIN TIME:</small>\n            <p class="highlight" style="text-align: left;">${new Date(firebase.auth().currentUser.metadata.lastSignInTime).toLocaleString("en-US")}</p>\n            <hr />\n            </div><br>`),firebase.storage().ref(`user/${firebase.auth().getUid()}/pfp/pfp.jpg`).getDownloadURL().then((l=>{console.log(l),$d.find("#profileChange").replaceWith(`<img class="profilePic" id="${profileListing}-profile" style="float: right; position: relative; width: 200px; height: 228px;" src="${l}" />`),$d.find(`#${profileListing}-profile`).on("load",(function(){0==$(this).parent(".editPhoto").is(":visible")&&($(this).parent(".editPhoto").show(),$d.append(`${holder} `),(0,a.GV)(),(0,a.oG)(),$("#cmdIframe").contents().scrollTop($("#cmdIframe").contents().scrollTop()+100))}))})).catch((l=>{"storage/object-not-found"==l.code&&$d.find("#profileChange").replaceWith('<div class="upload" style="float: right;position: relative;">Click to add a profile picture<br><b>+</b><br><small>File should not exceed 20 MB</small><input class="file_upload" type="file" accept="image/*" onchange="parent.uploadfile(this)" onclick="this.value=null;" /></div>'),$d.find(".profile").show(),$d.append(`${holder} `),(0,a.GV)(),(0,a.oG)(),$("#cmdIframe").contents().scrollTop($("#cmdIframe").contents().scrollTop()+100)}))}}}]);