function drawOscilloscope(mediaStream, id) {
  let canvasElement = document.getElementById(id);
  let canvasContext = canvasElement.getContext("2d");

  let audioContext = new AudioContext();
  let analyserNode = audioContext.createAnalyser();
  let bufferLength = analyserNode.frequencyBinCount;
  let dataArray = new Uint8Array(bufferLength);

  mediaStreamSource = audioContext.createMediaStreamSource(mediaStream);
  mediaStreamSource.connect(analyserNode);

  draw();

  function draw() {
    requestAnimationFrame(draw);
    analyserNode.getByteTimeDomainData(dataArray);

    canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasContext.lineWidth = 2;
    canvasContext.strokeStyle = "white";
    canvasContext.beginPath();
    canvasContext.moveTo(0, canvasElement.height / 2);

    let x = 0;
    let sliceWidth = canvasElement.width / bufferLength;
    for (let i = 0; i < bufferLength; i++) {
      let v = dataArray[i] / 128;
      let y = canvasElement.height / 2 * v;
      canvasContext.lineTo(x, y);
      x += sliceWidth;
    }

    canvasContext.lineTo(canvasElement.width, canvasElement.height / 2);
    canvasContext.stroke();
  }
}

//variables
var pc;
var ava;
var localStream;
var remoteStream;
var firestore = firebase.firestore()
var servers = {
  iceServers: [{
      urls: 'stun:stun.l.google.com:19302'
    },
    {
      urls: 'stun:global.stun.twilio.com:3478?transport=udp'
    },
    {
      urls: 'stun:stun.services.mozilla.com'
    },
    {
      urls: 'turn:numb.viagenie.ca',
      credential: '123456',
      username: config.VC_USER
    },
    {
      urls: ['turn:74.125.247.128:3478?transport=udp', 'turn:[2001:4860:4864:4:8000::]:3478?transport=udp', 'turn:74.125.247.128:3478?transport=tcp', 'turn:[2001:4860:4864:4:8000::]:3478?transport=tcp'],
      username: 'CJGX/YYGEgahgQIvk24YqvGggqMKIICjBTAK',
      credential: 'Q2PEtg4UN+HT4UXTfP7tpTRfsxs='
    },
    {
      urls: 'turn:192.158.29.39:3478?transport=udp',
      credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      username: '28224511:1379330808'
    },
    {
      urls: 'turn:192.158.29.39:3478?transport=tcp',
      credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      username: '28224511:1379330808'
    },
    {
      urls: 'turn:turn.bistri.com:80',
      credential: 'homeo',
      username: 'homeo'
    },
    {
      urls: 'turn:turn.anyfirewall.com:443?transport=tcp',
      credential: 'webrtc',
      username: 'webrtc'
    },
  ],
  iceCandidatePoolSize: 10,
};


window.recieve = async (dom) => {
  pc = new RTCPeerConnection(servers);
  localStream = null;
  remoteStream = null;
  $(".close").hide()
  $(dom).parent().parent().html(`
    <div id="csPrompt">
          <div class="videos">
          <span class='twoOuter'>
            <h3>Local Signal</h3>
            <div class="outerFrame">
            <div>
            <div style="border:none">
            <canvas id="localOscilloscope"></canvas>
            </div>
            </div>
            </div>
          </span>
          <span class='twoOuter'>
            <h3>Remote Signal</h3>
            <div class="outerFrame">
            <div>
            <div style="border:none">
            <canvas id="remoteOscilloscope"></canvas>
            <audio id="remoteAudio" src="" playsinline></audio>
            </div>
            </div>
            </div>
          </span>
          <br>
        </div>
        <p style="text-align: center;">Your User ID: <span id="roomCode" class="highlight">${tag}</span></p>
        <p style="text-align: center;"><small class="connectionStatus">Waiting for connection...</small></p>
        <div style="text-align:center;margin:50px">
          <span class='applicationBtn' id='hangupButton' style='font-size:14px' onclick='hang(this)'>HANG UP</span>
        </div>
        </div>
      `)
  var ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf('safari') != -1) {
    if (ua.indexOf('chrome') > -1) {
      console.log("chrome");
    } else {
      $("#csPrompt").append(`<br><span style="color:#e04f4f"><span style="font-weight:bold">ⓘ</span> SCiPNET has detected that you are using a Safari user agent. Please note that the communication function may not work properly on Safari browser and you may experience unstable connection or loss of connection.</span>`)
    }
  }
  let remoteAudio = document.getElementById('remoteAudio')
  //local stream
  localStream = await navigator.mediaDevices.getUserMedia({
    audio: true
  }).catch(function() {
    ava = false
    $("#localOscilloscope").parent().text("Unable to access your microphone. The communication system requires your microphone permission to operate")
    $("#remoteOscilloscope").parent().text("Unable to access your microphone. The communication system requires your microphone permission to operate.")
  })
  if (ava != false) {
    window.onbeforeunload = function(e) {
      hang()
      e = e || window.event;

      // For IE and Firefox prior to version 4
      if (e) {
        e.returnValue = 'Sure?';
      }

      // For Safari
      return 'Sure?';
    }
    drawOscilloscope(localStream, 'localOscilloscope')
    // Push tracks from local stream to peer connection
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });
    //remote stream
    remoteStream = new MediaStream();
    // Pull tracks from remote stream, add to audio stream
    pc.ontrack = event => {
      event.streams[0].getTracks().forEach(track => {
        remoteStream.addTrack(track);
      });
    };
    remoteAudio.srcObject = remoteStream;
    remoteAudio.play();
    checkaudioLoaded()

    function checkaudioLoaded() {
      if (remoteStream.active) {
        firestore.doc(`calls/${tag}`).get().then(doc => {
          checkTagLoaded()

          function checkTagLoaded() {
            if (doc.data() != undefined) {
              $(".connectionStatus").html(`<span class="highlight">${doc.data().caller.tag}</span> joined your call, connection established`)
              return;
            }
            window.setTimeout(checkTagLoaded, 100);
          }
        })
        drawOscilloscope(remoteStream, 'remoteOscilloscope')
        return;
      }
      window.setTimeout(checkaudioLoaded, 100);
    }

    //offline check
    pc.oniceconnectionstatechange = function() {
      if (pc.iceConnectionState == 'disconnected') {
        hang()
      }
    }
    //reference
    var callDoc = firestore.collection('calls').doc(tag);
    var offerCandidates = callDoc.collection('offerCandidates');
    var answerCandidates = callDoc.collection('answerCandidates');
    //ice
    pc.onicecandidate = event => {
      event.candidate && offerCandidates.add(event.candidate.toJSON());
    };
    // Create offer
    var offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);
    var offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };
    await callDoc.set({
      offer
    });
    //listen for answer
    callDoc.onSnapshot((snapshot) => {
      var data = snapshot.data();
      if (!pc.currentRemoteDescription && data?.answer) {
        var answerDescription = new RTCSessionDescription(data.answer);
        pc.setRemoteDescription(answerDescription);
      }
    });
    //listen for remote ICE candidates
    answerCandidates.onSnapshot(snapshot => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          var candidate = new RTCIceCandidate(change.doc.data());
          pc.addIceCandidate(candidate);
        }
      });
    });
  }
}

window.call = async (dom) => {
  pc = new RTCPeerConnection(servers);
  localStream = null;
  remoteStream = null;
  if ($("#callID").val() != "" && $("#callID").val().includes("#")) {
    $("#callBtn").css("opacity", "0.7")
    $("#callBtn").css("pointer-events", "none")
    var callID = $("#callID").val()
    //variables
    var callDoc = firestore.collection('calls').doc(callID);
    var offerCandidates = callDoc.collection('offerCandidates');
    var answerCandidates = callDoc.collection('answerCandidates');
    // Fetch data, then set the offer & answer
    var callData = (await callDoc.get()).data();
    if (callData != undefined && callData.caller == undefined && callID != tag) {
      $(".close").hide()
      $("#callBtn").css("opacity", "")
      $("#callBtn").css("pointer-events", "auto")
      $(dom).parent().parent().html(`
        <div id="csPrompt">
              <div class="videos">
              <span class='twoOuter'>
                <h3>Local Signal</h3>
                <div class="outerFrame">
                <div>
                <div style="border:none">
                <canvas id="localOscilloscope"></canvas>
                </div>
                </div>
                </div>
              </span>
              <span class='twoOuter'>
                <h3>Remote Signal</h3>
                <div class="outerFrame">
                <div>
                <div style="border:none">
                <canvas id="remoteOscilloscope"></canvas>
                <audio id="remoteAudio" src="" playsinline></audio>
                </div>
                </div>
                </div>
              </span>
              <br>
            </div>
            <p style="text-align: center;">You are now calling: <span id="roomCode" class="highlight">${callID}</span></p>
            <p style="text-align: center;"><small class="connectionStatus">Loading...</small></p>
            <div style="text-align:center;margin:50px">
              <div id="video-out"></div>
              <span class='applicationBtn' id='hangupButton' style='font-size:14px' onclick='hang(this)'>HANG UP</span>
            </div>
            </div>
          `)
      var ua = navigator.userAgent.toLowerCase();
      if (ua.indexOf('safari') != -1) {
        if (ua.indexOf('chrome') > -1) {
          console.log("chrome");
        } else {
          $("#csPrompt").append(`<br><span style="color:#e04f4f"><span style="font-weight:bold">ⓘ</span> SCiPNET has detected that you are using a Safari user agent. Please note that the communication function may not work properly on Safari browser and you may experience unstable connection or loss of connection.</span>`)
        }
      }
      let remoteAudio = document.getElementById('remoteAudio')
      //local stream
      localStream = await navigator.mediaDevices.getUserMedia({
        audio: true
      }).catch(function() {
        ava = false
        $("#localOscilloscope").parent().text("Unable to access your microphone. The communication system requires your microphone permission to operate")
        $("#remoteOscilloscope").parent().text("Unable to access your microphone. The communication system requires your microphone permission to operate.")
      })
      if (ava != false) {
        window.onbeforeunload = function(e) {
          hang()
          e = e || window.event;

          // For IE and Firefox prior to version 4
          if (e) {
            e.returnValue = 'Sure?';
          }

          // For Safari
          return 'Sure?';
        }
        // Push tracks from local stream to peer connection
        localStream.getTracks().forEach((track) => {
          pc.addTrack(track, localStream);
        });
        drawOscilloscope(localStream, 'localOscilloscope')
        //remote stream
        remoteStream = new MediaStream();
        // Pull tracks from remote stream, add to audio stream
        pc.ontrack = event => {
          event.streams[0].getTracks().forEach(track => {
            remoteStream.addTrack(track);
          });
        };
        remoteAudio.srcObject = remoteStream;
        remoteAudio.muted = 0;
        remoteAudio.play();
        checkaudioLoaded()

        function checkaudioLoaded() {
          if (remoteStream.active) {
            console.log(remoteStream);
            $(".connectionStatus").html(`Connection with <span class="highlight">${callID}</span> established`)
            drawOscilloscope(remoteStream, 'remoteOscilloscope')
            return;
          }
          window.setTimeout(checkaudioLoaded, 100);
        }
        //offline check
        pc.oniceconnectionstatechange = function() {
          if (pc.iceConnectionState == 'disconnected') {
            hang()
          }
        }
        //ice
        pc.onicecandidate = event => {
          event.candidate && answerCandidates.add(event.candidate.toJSON());
        };
        var offerDescription = callData.offer;
        await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));
        var answerDescription = await pc.createAnswer();
        await pc.setLocalDescription(answerDescription);
        var answer = {
          type: answerDescription.type,
          sdp: answerDescription.sdp,
        };
        var caller = {
          tag: tag
        }
        await callDoc.update({
          answer,
          caller
        });
      }
    } else if (callID == tag) {
      $("#callBtn").css("opacity", "")
      $("#callBtn").css("pointer-events", "auto")
      $("#callID").css("border", "1px solid #e04f4f")
      $("#callIndicator").text("You cannot call yourself")
    } else {
      $("#callBtn").css("opacity", "")
      $("#callBtn").css("pointer-events", "auto")
      $("#callID").css("border", "1px solid #e04f4f")
      $("#callIndicator").text("Calling user is not in receiving mode, user does not exist or user already in a call, please check for correct capitalisation, spelling and spaces")
    }
    //listen to offer
    offerCandidates.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          let data = change.doc.data();
          pc.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  } else {
    $("#callID").css("border", "1px solid #e04f4f")
    $("#callIndicator").text("Please enter a username with a 3-4 digit # tag")
  }




}

window.hang = (dom) => {
  pc.close();
  pc1 = null;
  $(".close").show()
  $(".connectionStatus").html("Signal loss").css("color", "#e04f4f")
  $(".videos").html("Communication ended, click the Close button in the top right corner to close this pop-up window.")
  $("#hangupButton").remove()
  localStream.getTracks().forEach((track) => {
    track.stop();
  });
  if (ava != false) {
    var docToRemove
    if (typeof callID == 'undefined') {
      docToRemove = tag
    } else {
      docToRemove = callID
    }
    firestore.collection(`calls/${docToRemove}/answerCandidates`).get().then(querySnapshot => {
      querySnapshot.docs.forEach(snapshot => {
        snapshot.ref.delete();
      })
    })
    firestore.collection(`calls/${docToRemove}/offerCandidates`).get().then(querySnapshot => {
      querySnapshot.docs.forEach(snapshot => {
        snapshot.ref.delete();
      })
    })
    firestore.doc(`calls/${docToRemove}`).delete()
    window.onbeforeunload = null
  }
}
