const cheerio = require('cheerio');
const opencc = require('node-opencc');
import {
  appendError,
  appendNormal,
  cmdHide,
  cmdShow,
  btnShow,
  scroll,
  loadFile
} from './utils.js';
var he = require('he');
export function access(accessNo, accessCl) {
  cmdHide()
  $d.append(`<blockquote id='fileSize'></blockquote>`)
  loadFile(`Downloading file`,`Decrypting document`)
  if (link == undefined) {
    btnShow()
    cmdShow()
    appendWarn("SCiPNET FAILED TO CONNECT WITH THE SCP FOUNDATION DATABASE.")
    showWarning("SCiPNET failed to connect with the SCP Foundation database, please reload the page or try again later.")
  } else {
    $.ajax({
      url: `${link}${linkLanguage}${accessNo}`,
      type: 'GET',
      success: function(data) {
        const $ = cheerio.load(data);
        if ($("#page-content").html() != null) {
          $(".class-text:contains('{$contain-class}')").parent(".contain-class").remove()
          $(".class-text:contains('{$secondary-class}')").parent(".second-class").remove()
          $(".class-text:contains('{$disruption-class}')").parent(".disrupt-class").remove()
          $(".class-text:contains('{$risk-class}')").parent(".risk-class").remove()
          $(".acs-text:contains('{$contain-class}')").parent(".acs-contain").remove()
          $(".acs-text:contains('{$secondary-class}')").parent(".acs-secondary").remove()
          $(".acs-text:contains('{$disruption-class}')").parent(".acs-disrupt").remove()
          $(".acs-text:contains('{$risk-class}')").parent(".acs-risk").remove()
          $('.mobile-display').remove();
          $('.folded > ul').remove();
          $('.mobile-exit').remove()
          $(".content-toc").remove()
          $(".bt").remove()
          $(".buttons").remove()
          $('.page-rate-widget-box').remove();
          $('.footer-wikiwalk-nav').remove();
          $('.licensebox22').remove();
          $(".creditRate").remove();
          $("#u-credit-view").remove();
          $(".acs-icon").remove();
          $(".btn-false").remove();
          $(".acs-lang-tr").remove()
          $(".small").remove()
          $("#toc-action-bar").remove()
          $(".heritage-rating-module").remove();
          $(".heritage-emblem").remove();
          $("#u-credit-otherwise").remove();
          $(".diamond-part").remove();
          $(".t_info").remove();
          $(".translation_block").remove();
          $(".u-faq").remove();
          $(".hl-main").remove();
          $(".class1image").remove();
          $(".rate_t2").remove();
          $(".lang-tr").remove();
          $(".desktop-only").remove();
          $(".comments-box").remove();
          $(".licensebox").remove();
          $("td").removeAttr("style");
          $("tr").removeAttr("style");
          $("th").removeAttr("style");
          $('h2:empty').remove();
          $('h3:empty').remove();
          if ($('.collapsible-block-content').is(':empty')) {
            $('.collapsible-block-content').removeClass("collapsible-block-content")
          }
          $(".scp-image-caption").removeAttr("style");
          $(".collapsible-block-unfolded").removeAttr("style")
          $(".collapsible-block-link").removeAttr("href")
          $(".code").each(function() {
            if ($(this).is(':empty') || $(this).text().trim() == "") {
              $(this).remove()
            }
          });
          $("div").each(function() {
            var $t = $(this);
            if ($(this).css("margin") != null) {
              $(this).css("margin", '15px auto');
            }
            if ($(this).find("img") != null && $(this).find("img").hasClass("emoji") == false) {
              $(this).find("img").css("margin", '15px auto');
            }
            if ($(this).css("max-width") != null) {
              $(this).find('*:not(img)').css("max-width", $(this).css("max-width"))
            }
            if ($t.attr('id') != undefined && $t.attr('id').includes("mailformdef")) {
              $t.remove()
            }
          });
          $(".yui-nav").each(function() {
            var counting = 0
            var nav = [];
            $(this).children("li").each(function() {
              nav.push($(this).children("a").children("em").text())
            });
            $(".yui-content div[id^='wiki-tab-']").css("display", "block")
            if (accessNo == "scp-2317") {
              $(`.yui-content div:not(#wiki-tab-0-${nav.findIndex(element => element.includes(accessCl))+1})`).remove()
            } else {
              $(this).next().children("div").each(function() {
                $(this).prepend('<h3>' + nav[counting] + '</h3>')
                counting += 1
              });
            }
          });
          $(".snapchat p, .snapchat-sender p").each(function() {
            $(this).css("font-family", "Prompt,Trebuchet MS, sans-serif")
            $(this).css("font-weight", '500')
          });
          $("div:not(.cdver2):not(.code):not(.orderwrapper):not(.discord):not(.discord *):not(.class-table-box):not(.snapchat):not(.top-left-box):not(.scp-image-block):not(.content-panel)").each(function() {
            var $t = $(this);
            if ($t.css("background-image") != undefined) {
              $t.attr("class", "specimage")
            } else {
              $t.addClass("borderChange");
              $t.css("background", "");
              $t.css("background-color", "");
              $t.css("color", "");
            }
          });
          $(".info-container").each(function() {
            $(this).find('.collapsible-block-link').text("ⓘ").css("font-size", "20px")
            $(this).find('.collapsible-block div').css("margin", "15px auto")
          })
          $(".scp-image-block").each(function() {
            $(this).css("background-color", "")
          })
          $(".yui-nav").remove()
          $(".anom-bar").each(function() {
            $(this).append('<div style="clear: both;"></div>')
          })
          $("span:not(.specimage)").each(function() {
            var $t = $(this);
            if ($t.css("background-color") == "black") {
              $t.addClass("bothChange")
            } else {
              $t.css("background", "");
              $t.css("background-color", "");
            }
            if ($t.css("color") == "#5b2f8e" || $t.css("color") == "purple") {
              $t.css("color", "#B68EE4")
            } else if ($t.css("color") == "blue") {
              $t.css("color", "#8392FF")
            } else if ($t.css("color") == "green") {
              $t.css("color", "#95FF83")
            } else if ($t.css("color") == "black") {
              $t.addClass("colorChange")
            };
          });
          $('span').each(function() {
            var $t = $(this);
            $t.css("border", "");
            $t.css("display", "");
          });
          $(":button").each(function() {
            var $t = $(this);
            if ($t.attr('class') != undefined) {
              $t.removeClass()
            }
            $t.attr('class', 'bt')
          });
          $("input[type=text]").each(function() {
            var $t = $(this);
            if ($t.attr('class') != undefined) {
              $t.removeClass()
            }
            $t.attr('class', 'colorblank')
          });
          $("p:not(.specimage)").each(function() {
            var $t = $(this);
            if ($t.css("background-color") == "rgba(0, 0, 0, 0)" && $t.css("color") == "rgba(0, 0, 0, 0)") {
              $t.css("color", "")
              $t.addClass("backgroundChange")
            } else if ($t.css("color") == "#5b2f8e" || $t.css("color") == "purple") {
              $t.css("color", "#B68EE4")
            } else if ($t.css("color") == "black") {
              $t.css("color", "")
            } else if ($t.css("color") == "blue") {
              $t.css("color", "#8392FF")
            } else if ($t.css("color") == "green") {
              $t.css("color", "#95FF83")
            };
          });
          $(".colmod-link-top").removeAttr("style");
          $(".colmod-block").each(function() {
            $(this).find("*").css('List-style', 'none');
            $(this).find(".foldable-list-container")
          });
          $('a[href^="/"]').each(function() {
            var oldUrl = $(this).attr("href"); // Get current url
            var newUrl = "http://www.scpwiki.com" + oldUrl; // Create new url
            $(this).attr("href", newUrl)
          });
          $(`#main-content iframe`).each(function() {
            if ($(this).attr("name") != "typeFrame") {
              var oldUrl = $(this).attr("src");
              if (oldUrl.charAt(0) == "/" && oldUrl.substring(0, 2) != "//") {
                var newUrl = "http://scp-wiki.wdfiles.com/local--html" + oldUrl.replace('/html', '') + "/scpwiki.com/"; // Create new url
                $(this).attr("class", newUrl)
              } else {
                $(this).attr("class", oldUrl)
              }
            }
            $(this).attr("src", '')
          });
          $(`.foldable-list-container a`).each(function() {
            $(this).removeAttr("href")
          })
          $('img').each(function() {
            var url = $(this).attr('src')
            if (url!=undefined) {
              $(this).attr('src',`//${new URL(url).host}${new URL(url).pathname}`)
            }
          });
          $('table').each(function() {
            $(this).css("margin", "");
          });
          $('.footnotes-footer').each(function() {
            $(this).before(`<div style="clear: both;"></div>`)
          });
          $('.content-panel').each(function() {
            $(this).css("border", "1.5px solid #525252");
            $(this).css("padding", "15px 9px");
            $(this).css("margin", "15px auto");
            $(this).css("border-radius", "6px");
            $(this).css("background", "none");
          });
          $('.pictures4mobile').each(function() {
            $(this).css("display", "none");
          });
          $('h1').each(function() {
            if ($(this).text() == ".") {
              $(this).remove()
            }
          });
          $('span').each(function() {
            if ($(this).attr("font-size") == "0%") {
              $(this).remove()
            }
          });
          $("a").each(function() {
            if ($(this).attr("href") != undefined && checkForAva($(this).attr("href"))) {
              $(this).replaceWith(`<ele-access data-link="${$(this).attr("href")}">${$(this).html()}</ele-access>`)
            } else if ($(this).attr("href") != undefined) {
              if ($(this).attr("href").charAt(0) == "#" || $(this).attr("href").includes("javascript:")) {
                $(this).removeAttr("href")
              } else {
                $(this).attr("onclick", `window.open('${$(this).attr("href")}', '_blank')`)
                $(this).removeAttr("href")
              }
            }
          })
          checkBarLoaded()

          function checkBarLoaded() {
            if (inBar == false) {
              btnShow()
              cmdShow()
              noscroll = true;
              var pageTitle = $('#page-title').text();
              if (pageTitle == "" || pageTitle == null) {
                pageTitle = "FILE"
              }
              var page = $('#page-content').html()
              if (isTrad) {
                pageTitle = opencc.simplifiedToHongKong(pageTitle)
                page = opencc.simplifiedToHongKong(page)
              }
              accessListing += 1
              if (userLoggedIn) {
                appendNormal(`<br><div class="infoCard"><blockquote><hr><br><img class="logo_heds" style="width:40px;height:40px;" src="/src/images/scp.svg"><br>USERNAME: <span class="highlight">${displayName}</span><br>TITLE: <span class="highlight">${title}</span>, <span class="highlight">${site}</span><br>DISPLAYING ${pageTitle}, CLEARANCE LEVEL <span class="highlight">${accessCl}</span> (CLASS <span class="highlight">${classification}</span> PERSONNEL)<hr></blockquote></div><br><div id="${accessListing}-list" class="accessPage">${page}</div><div style="clear: both;"></div>`)
                btnShow()
                cmdShow()
              } else {
                appendNormal(`<br><div id="${accessListing}-list" class="accessPage">${page}</div><div style="clear: both;"></div>`)
                btnShow()
                cmdShow()
              }
              AccessLink()
              getFrame()
              setImageWidth()
              chore()
              setTimeout(() => {
                foldDiv()
              }, 100);
              return;
            }
            window.setTimeout(checkBarLoaded, 100)
          }

        } else {
          checkLinkLoaded()

          function checkLinkLoaded() {
            if (inBar == false) {
              appendError("THE CORRESPONDING FILE WITH THE CURRENT LANGUAGE SETTING COULD NOT BE FOUND IN THE DATABASE")
              btnShow()
              cmdShow()
              return;
            }
            window.setTimeout(checkLinkLoaded, 100)
          }
        }
      },
      error: function(jqXHR, exception) {
        var msg = '';
        if (jqXHR.status === 0) {
          msg = 'SCiPNET IS NOT CONNECTED WITH THE INTERNET';
          $d.find("#fileSize").removeAttr("id", "fileSize")
        } else if (jqXHR.status == 404) {
          msg = 'THE CORRESPONDING FILE WITH THE CURRENT LANGUAGE SETTING COULD NOT BE FOUND IN THE DATABASE';
        } else if (jqXHR.status == 500) {
          msg = 'SCP FOUNDATION INTERNAL SERVER FAILURE. CODE:500';
        } else if (exception === 'timeout') {
          msg = 'REQUEST TIMEOUT, PLEASE TRY AGAIN';
        } else {
          msg = String(jqXHR.responseText).toUpperCase();
        }
        appendError(`${msg}`)
        btnShow()
        cmdShow()
      }
    });
  }
}

function foldDiv() {
  $d.find(".foldable-list-container a").unbind('click').bind('click', function() {
    $(this).parent().children().toggle()
    $(this).parent(".foldable-list-container").parent(".colmod-link-top").parent(".folded").find(".colmod-content:first").toggle()
  });
}

function AccessLink() { //check and clear the info
  $d.find("ele-access").add($d.find("iframe").contents().find("body").find("ele-access")).unbind('click').bind('click', function() {
    if ($("#input").attr('disabled') == undefined && loginState == 0 && registerState == 0 && editState == 0) {
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
}

function clickfind(res) { //pass the info to the main access function
  if (userLoggedIn) {
    $d.append(`access ${res[1]} ${clearance}`)
    access(res[1], clearance)
  } else {
    $d.append(`access ${res[1]}`)
    access(res[1], 0)
  }
}

function getFrame() {
  $d.find(`#${accessListing}-list iframe`).each(function() {
    if ($(this).css("display") == "none" || $(this).contents().prevObject[0].name) {
      $(this).remove()
    } else {
      var $s = $(this)
      var source = new URL($s.attr("class"), "https://scp-wiki.wdfiles.com/")
      $.ajax({
        url: `${link}${source.toString()}`,
        type: 'GET',
        success: function(data) {
          var domain = source.origin
          var $c = cheerio.load(data.replace(`window.open("//`, `window.open("http://`).replace(`window.open('//`, `window.open('http://`).replace(`window.open("/`, `window.open("${domain}/`).replace(`window.open('/`, `window.open('${domain}/`), {
            decodeEntities: false
          });
          $c("script").each(function() {
            var link = $c(this).attr("src")
            if (link != undefined) {
              $c(this).attr("src", new URL(link, domain).toString())
            }
          });
          $c('[onclick]').each(function() {
            $c(this).attr("onclick", $c(this).attr("onclick").replace(/"/g, "&#039;"))
          })
          $c("link").each(function() {
            var link = $c(this).attr("href")
            if (link != undefined) {
              $c(this).attr("href", new URL(link, domain).toString())
            }
          });
          $c("a").each(function() {
            var link = $c(this).attr("href")
            if (link != undefined) {
              $c(this).attr("href", new URL(link, domain).toString())
            }
            if ($c(this).attr("href") != undefined && checkForAva($c(this).attr("href"))) {
              $c(this).replaceWith(`<ele-access data-link="${$c(this).attr("href")}">${$c(this).html()}</ele-access>`)
            }
          });
          $c("img").each(function() {
            var link = $c(this).attr("src")
            if (link != undefined) {
              $c(this).attr("src", new URL(link, domain).toString())
            }
          });
          $c("source").each(function() {
            var link = $c(this).attr("src")
            if (link != undefined) {
              $c(this).attr("src", new URL(link, domain).toString())
            }
          });
          $c('*[src^="http://scp-wiki.wdfiles.com/"]').each(function() {
            $c(this).attr("src", $c(this).attr("src").replace(/^http:\/\//i, 'https://'))
          });
          $c('*[href^="http://scp-wiki.wdfiles.com/"]').each(function() {
              console.log($c(this).attr("href"));
          });
          $c('*[src^="http://www.scp-wiki.net/"]').each(function() {
            $c(this).attr("src", $c(this).attr("src").replace(/^http:\/\//i, 'https://'))
          });
          $c('script[src^="https://www.scp-wiki.net/"]').each(function() {
            var newUrl = `https://scp-wiki.wdfiles.com/local--files/${$c(this).attr("src").split('https://www.scp-wiki.net/local--files/')[1]}`;
            $c(this).attr("src", newUrl)
          });
          $c("head").append(`<script src="/src/ex_file/jquery-3.6.0.min.js"></script><link type="text/css" rel="stylesheet" href="/src/css/innerIframe.min.css" />`)
          var frameSrc = $c.html();
          if (isTrad) {
            frameSrc = he.decode(opencc.simplifiedToHongKong(frameSrc))
          }

          $s.attr("srcdoc", he.decode(frameSrc));
          $s.attr("class", "");
          $s.attr("onload", "resizeIframe(this)")
          $s.attr("scrolling", "no")
        }
      })
    }
  })
}

function checkForAva(linkforAccess) {
  var sitelist = ["scp-wiki.net/", "scp-wiki.wikidot.com/", "www.scpwiki.com/", "scp-wiki-cn.wikidot.com/", "scpfoundation.net/", "ko.scp-wiki.net/", "fondationscp.wikidot.com/", "scp-wiki.net.pl/", "lafundacionscp.wikidot.com/", "scp-th.wikidot.com/", "scp-jp.wikidot.com/", "scp-wiki-de.wikidot.com/", "fondazionescp.wikidot.com/", "scp-ukrainian.wikidot.com/", "scp-pt-br.wikidot.com/", "scp-cs.wikidot.com/"]
  var list = linkforAccess.split(".")
  if (linkforAccess != undefined && sitelist.some(v => linkforAccess.includes(v)) && linkforAccess != '/' && linkforAccess.includes('email-protection') == false && Object.keys($(this).children('img')).length > 2 == false && list.includes("jpg") == false && list.includes("mp3") == false && list.includes("png") == false && list.includes("jpeg") == false && list.includes("gif") == false && list.includes("ogg") == false && list.includes("wav") == false && list.includes("oga") == false && list.includes("webm") == false && list.includes("flac") == false) {
    return true;
  } else {
    return false;
  }
}

function setImageWidth() {
  $d.find(`#${accessListing}-list .scp-image-block`).each(function() {
    $(this).css("max-width", "80%")
  })
}

function chore() {
  $("#cmdIframe").contents().scrollTop($("#cmdIframe").contents().scrollTop() + 100)
  $d.find(`#${accessListing}-list iframe`).each(function(index) {
    $(this).on('load', function() {
      AccessLink()
      bubbleIframeMouseMove(this)
    });

  });
  $d.find(".footnoteref").unbind('click').bind('click', function() {
    //work
  });
}
