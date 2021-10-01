function appendError(text) {
  $d.append(`<blockquote>↳bash: <span style="color:red">ERROR: </span>${text}</blockquote>${holder} `)
  scroll()
  foldTable()
}

function appendWarn(text) {
  $d.append(`<blockquote>↳bash: <span style="color:yellow">WARNING: </span>${text}</blockquote>${holder} `)
  scroll()
  foldTable()
}

function appendNormal(text) {
  $d.append(`<blockquote>${text}</blockquote>${holder} `)
  if (noscroll == false) {
    scroll()
  } else {
    noscroll = false
  }
  foldTable()
}

function scroll() {
  var $contents = $('#cmdIframe').contents();
  $contents.scrollTop($contents.height());
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) == false) {
    document.getElementById("input").focus();
  }
}

function cmdHide() {
  $("#input").css("opacity", "0.5")
  $("#input").attr('disabled', 'disabled')
  btnHide()
  isHide = true
}

function cmdShow() {
  $("#input").css("opacity", "1")
  $("#input").removeAttr("disabled")
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) == false) {
    document.getElementById("input").focus();
  }
  isHide = false
}

function btnHide() {
  $d.find(".listClass li").css("opacity", "0.7")
  $d.find(".listClass li").css("pointer-events", "none")
  isBtnHide = true
}

function btnShow() {
  $d.find(".listClass li").css("opacity", "")
  $d.find(".listClass li").css("pointer-events", "auto")
  isBtnHide = false
}

function addDot() {
  var dot = 0;
  var dotTimer = window.setInterval(
    function() {
      if ($d.find("#waitingToAdd").next().html() == undefined || $d.find("#waitingToAdd").next().is(":visible") == false) {
        if (dot < 7) {
          dot = dot + 1;
          $d.find("#waitingToAdd").append(".")
        } else {
          $d.find("#waitingToAdd").text($d.find("#waitingToAdd").text().slice(0, -7))
          dot = 0;
        }
      } else {
        clearInterval(dotTimer)
        $d.find("#waitingToAdd").removeAttr("id", "waitingToAdd")
      }
    }, 300);
}

function foldTable() {
  $d.find(".collapsible-block-folded").unbind('click').bind('click', function() {
    $(this).parent().children().toggle()
  });
  $d.find(".collapsible-block-unfolded-link").unbind('click').bind('click', function() {
    $(this).parent(".collapsible-block-unfolded").hide()
    $(this).parent(".collapsible-block-unfolded").prev().show()
  });
}

function loadFile(quote1, quote2, callback) {
  inBar = true
  scroll()
  var progressNo = 0;
  var percentage = 0;
  var chunks;
  var progress = `█---------------`;
  var loadProgress = window.setInterval(
    function() {
      if (progressNo != 16) {
        progressNo += 1
        progress = `█${progress.slice(0, -1)}`
        percentage = progressNo / 16 * 100
        chunks = Math.round((percentage / 100) * 600)
        $d.find("#fileSize").replaceWith(`<blockquote id='fileSize'>${quote1}: |<span style="font-family:monospace">${progress}</span>| ${percentage}% || ${chunks}/600 chunks loaded </blockquote>`)
      } else {
        clearInterval(loadProgress)
        $d.find("#fileSize").after(`<blockquote id="waitingToAdd">${quote2}...</blockquote>`);
        addDot()
        scroll()
        $d.find("#fileSize").removeAttr("id", "fileSize")
        inBar = false
        callback()
      }
    }, 30);
}
export {
  appendError,
  appendWarn,
  appendNormal,
  scroll,
  cmdHide,
  cmdShow,
  btnHide,
  btnShow,
  addDot,
  loadFile
}
