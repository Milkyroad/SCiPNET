window.uploadfile = (doc) => {
  //make the close button available
  $(".close").css("opacity", "1")
  $(".close").css("pointer-events", "auto")
  //make the status color available in case of prior upload
  $("#uploadStatusText").css('color', 'white')
  $("#uploadStatusText").text("")
  if (firebase.auth().currentUser != null) {
    var FileSize = doc.files[0].size / 1024 / 1024; // in MB
    if ($(doc).parent(".upload").parent(".editPhoto").attr("data-uid") != firebase.auth().getUid()) {
      $("#WarningModalId .modalText").text("Please login to your corresponding account to upload your profile picture.")
      $("#WarningModalId").show()
    } else if (FileSize > 20) {
      $("#WarningModalId .modalText").text("File size exceeds 20 MB, please choose another image.")
      $("#WarningModalId").show()
    } else {
      //display the modal
      $("#previewImageId").show()
      //make the upload button available
      $("#uploadBtn").css("opacity", "1")
      $("#uploadBtn").css("pointer-events", "auto")
      document.getElementById('previewBox').src = URL.createObjectURL(doc.files[0])
      document.getElementById('previewBox').src.onload = function() {
        URL.revokeObjectURL(document.getElementById('previewBox').src) // free memory
      }
      var basic = $('#previewBox').croppie({
        enableExif: true,
        viewport: {
          width: 200,
          height: 228,
        },
        boundary: {
          width: 500,
          height: 500
        }
      })
      $("#uploadBtn").unbind('click').bind('click', function() {
        basic.croppie('result', {
          type: "canvas",
          size: "original",
          format: "jpeg",
          quality: 0.5
        }).then(function(resp) {
          //
          var path = firebase.storage().ref(`user/${firebase.auth().getUid()}/pfp/pfp.jpg`);
          var uploadTask = path.putString(resp, 'data_url', {
            contentType: 'image/jpg'
          })
          $(".close").css("opacity", "0.7")
          $(".close").css("pointer-events", "none")
          $("#uploadBtn").css("opacity", "0.7")
          $("#uploadBtn").css("pointer-events", "none")
          uploadTask.on('state_changed',
            (snapshot) => {
              var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              $("#uploadStatusText").text(`Upload process: ${progress.toFixed(2)}%`)
            },
            (error) => {
              $("#uploadStatusText").text(`${error}: Upload failed, please try again.`)
              $("#uploadStatusText").css('color', 'red')
              $("#previewBox").hide()
              $("#previewBox").croppie('destroy');
              $(".close").css("opacity", "1")
              $(".close").css("pointer-events", "auto")
            },
            () => {
              uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                $("#uploadStatusText").text(`Upload successful, you can close this pop-up box now`)
                $("#uploadStatusText").css('color', '#98FB98')
                //remove croppie
                $("#previewBox").croppie('destroy');
                $("#previewBox").hide()
                $(".close").css("opacity", "1")
                $(".close").css("pointer-events", "auto")
                //replace and update profile pic holder
                $('#cmdIframe').contents().find("body").find(".editPhoto").each(function() {
                  if ($(this).attr("data-uid") == firebase.auth().getUid()) {
                    $(this).find(".profilePic").attr("src", downloadURL)
                    $(this).find(".upload").replaceWith(`<img class="profilePic" src="${downloadURL}"></img>`)
                    if ($(this).hasClass("editingPfp") && $(this).find("div").length == 0) {
                      $(this).append("<div style='text-align:center;color:#98FB98;display:block;margin-left:auto;margin-right:auto;'>Updated Successfully</div>")
                    }
                  }
                })
              });
            }
          );
          //
        });
      });
    }
  } else {
    $("#WarningModalId .modalText").text("Please login first.")
    $("#WarningModalId").show()
  }
}
