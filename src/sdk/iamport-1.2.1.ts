import jQuery from "jquery";

window.IMP || (function (window) {
  var api_server = "https://service.iamport.kr";
  var payportFrontDomain = "https://payport-front.iamport.co";
  var requestIdForPayport = "requestIdForPayport";
  var cssText = "body.imp-payment-progress {position: static}\n" +
      "body.imp-payment-progress > :not(.imp-dialog) {display: none}\n" +
      ".imp-dialog {display : none; position : fixed; top : 0; bottom : 0;left : 0; right : 0; width : 100%; height: 100%; z-index:99999;}\n" +
      ".imp-dialog .imp-frame-pc.imp-frame-danal, .imp-dialog .imp-frame-pc.imp-frame-danal_tpay { left:50% !important; margin-left:-345px; width:720px !important; height:700px !important; margin-top: 50px;}\n" +
      ".imp-dialog .imp-frame-pc.imp-frame-tosspayments { width: 650px !important; height: 650px !important; left: 50% !important; top: 50% !important; margin-left: -325px; margin-top: -325px; background: white;}\n" +
      ".imp-dialog.payment-uplus.pc {background: rgba(0,0,0,0.5);}\n" +
      ".imp-dialog .imp-frame-pc.imp-frame-uplus {width: 650px !important; height: 650px !important; left: 50% !important; top: 50% !important; margin-left:-325px !important;margin-top: -325px !important;}\n" +
      ".imp-dialog .imp-frame-pc.imp-frame-mobilians { left:50% !important; margin-left:-410px; width:820px !important; height:700px !important; margin-top: 50px;}\n" +
      ".imp-dialog .imp-header {display:none; background:transparent; position:absolute; top:0; left:0; right:0; height:25px;}\n" +
      ".imp-dialog .imp-close {text-decoration : none; position : absolute; top : 10px; right : 10px; cursor : pointer; background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KTMInWQAAAV1JREFUOBHNkz1Ow0AQhWMHioggUSFEyRGAggp6KqDhDHAFOioU/loQoqDlGhyAgmtQ0gEO31jz1iPbcZyOlUY7fvvem9mdZDD472vY0mDegrVBGaBF54qELuPYSNQkc4FjkHNCAu2JSLLkHxvsZ+Gg9FAXUw4M+CI+8zy/cuIvezQ1sx9iDOeS/YOwZT7m0VgqcITgOpwars5WOXvke9vPY8EgqVIJTxDeVXCZWWdPZLuOL9fOZ35G03tnjbyznS4zDaPNWe91iNE+hGlRFK/s74R19k0stNJ1six7w/QlqPXWAepOdWUbwDPULeKAPL7p3GGohMzqA7DzY0xvRWSfayrCCsIHBHGaKmTTr/+kQo0q1busuZl+Z+ktocrUOr2ppM3/tKY9hDiBuOfkaCa9TE8BLhyUXpxUYQSy7qiun0gh0W02wWbyYhUJgkcj7cMpRb2JsBfhNjrqBfwBsGIgzBGH3EgAAAAASUVORK5CYII=');}" +
      ".imp-dialog.popup .imp-frame-danal-certification {background:transparent !important;}\n" +
      ".imp-dialog.pc .imp-frame-danal-certification {width:410px !important;height:660px !important;margin:10px auto;background: #fff;}\n" +
      ".imp-dialog.pc.certification-danal {background: rgb(255, 255, 255);background: rgba(0,0,0,0.5);}\n" +
      ".imp-dialog.pc.certification-danal .imp-header {display:block; width: 410px;margin:0 auto;}\n" +
      ".imp-dialog.pc.certification-danal.popup .imp-header {display:none;}\n" +
      ".imp-dialog.pc.certification-danal .imp-header .imp-close {top:18px; right:25px; width:19px; height:19px;}\n" +
      ".imp-dialog.mobile.ios {position:absolute;}\n" +
      ".imp-dialog.mobile.certification-danal .imp-header {display:block;}\n" +
      ".imp-dialog.mobile.certification-danal.popup .imp-header {display:none;}\n" +
      ".imp-dialog.mobile.certification-danal .imp-header .imp-close {top:6px; right:10px; width:19px; height:19px;}\n" +
      ".imp-dialog.pc.payment-settle_firm {background: rgb(221, 221, 221);background: rgba(0,0,0,0.5);}\n" +
      ".imp-dialog.pc .imp-frame-settle_firm.layer {width:410px !important;height:700px !important;margin:10px auto;background: #fff;}\n" +
      ".imp-dialog.pc.payment-kakaopay {background: rgb(221, 221, 221);background: rgba(0,0,0,0.5);}\n" +
      ".imp-dialog.pc.payment-kakaopay .imp-frame-kakaopay {width: 426px !important; height: 550px !important; left: 50% !important; top: 50% !important; margin-left:-213px !important;margin-top: -275px !important;}",
    head = document.head || document.getElementsByTagName("head")[0],
    style = document.createElement("style");

  //create style tag
  style.type = "text/css";
  if (style.styleSheet) {
    style.styleSheet.cssText = cssText;
  } else {
    style.appendChild(document.createTextNode(cssText));
  }

  head.appendChild(style);

  var externalInterface = window.IMP = {};

  var Util = (function () {
    return {
      injectQuery: function (url, query) {
        var anchor = document.createElement("a");
        anchor.href = url;

        // anchor.protocol; // => "http:"
        // anchor.hostname; // => "example.com"
        // anchor.port;     // => "3000"
        // anchor.pathname; // => "/pathname/"
        // anchor.search;   // => "?search=test"
        // anchor.hash;     // => "#hash"
        // anchor.host;     // => "example.com:3000"

        var q = [];
        for (var property in query) {
          if (query.hasOwnProperty(property)) {
            q.push([property, query[property]].join("="));
          }
        }

        var search = anchor.search,
          s = q.join("&");
        if (search) {
          if (search.lastIndexOf("&") > -1) {
            search += s;
          } else {
            search += "&" + s;
          }
        } else {
          search = "?" + s;
        }

        return anchor.protocol + "//" + anchor.host + anchor.pathname + search +
          anchor.hash;
      },
    };
  })();

  var UserAgent = (function () {
    var _populated = false;
    var _ie, _firefox, _opera, _webkit, _chrome;
    var _ie_real_version;
    var _osx, _windows, _linux, _android;
    var _win64;
    var _iphone, _ipad, _native;
    var _mobile;

    function _populate() {
      if (_populated) {
        return;
      }

      _populated = true;

      // To work around buggy JS libraries that can't handle multi-digit
      // version numbers, Opera 10's user agent string claims it's Opera

      var uas = navigator.userAgent;
      var agent =
        /(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso|Iceweasel).(\d+\.\d+))|(?:Opera(?:.+Version.|.)(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))|(?:Trident\/\d+\.\d+.*rv:(\d+\.\d+))/
          .exec(uas);
      var os = /(Mac OS X)|(Windows)|(Linux)/.exec(uas);

      _iphone = /\b(iPhone|iP[ao]d)/.exec(uas);
      _ipad = /\b(iP[ao]d)/.exec(uas);
      _android = /Android/i.exec(uas);
      _native = /FBAN\/\w+;/i.exec(uas);
      _mobile = /Mobile/i.exec(uas);

      // for 'Win64; x64'. But MSDN then reveals that you can actually be
      // coming

      // as in indicator of whether you're in 64-bit IE. 32-bit IE on 64-bit
      // Windows will send 'WOW64' instead.
      _win64 = !!(/Win64/.exec(uas));

      if (agent) {
        _ie = agent[1]
          ? parseFloat(agent[1])
          : (agent[5] ? parseFloat(agent[5]) : NaN);

        if (_ie && document && document.documentMode) {
          _ie = document.documentMode;
        }
        // grab the "true" ie version from the trident token if available
        var trident = /(?:Trident\/(\d+.\d+))/.exec(uas);
        _ie_real_version = trident ? parseFloat(trident[1]) + 4 : _ie;

        _firefox = agent[2] ? parseFloat(agent[2]) : NaN;
        _opera = agent[3] ? parseFloat(agent[3]) : NaN;
        _webkit = agent[4] ? parseFloat(agent[4]) : NaN;
        if (_webkit) {
          // match 'safari' only since 'AppleWebKit' appears before
          // 'Chrome' in

          agent = /(?:Chrome\/(\d+\.\d+))/.exec(uas);
          _chrome = agent && agent[1] ? parseFloat(agent[1]) : NaN;
        } else {
          _chrome = NaN;
        }
      } else {
        _ie =
          _firefox =
          _opera =
          _chrome =
          _webkit =
            NaN;
      }

      if (os) {
        if (os[1]) {
          var ver = /(?:Mac OS X (\d+(?:[._]\d+)?))/.exec(uas);

          _osx = ver ? parseFloat(ver[1].replace("_", ".")) : true;
        } else {
          _osx = false;
        }
        _windows = !!os[2];
        _linux = !!os[3];
      } else {
        _osx = _windows = _linux = false;
      }
    }

    var UserAgent = {
      ie: function () {
        return _populate() || _ie;
      },

      ieCompatibilityMode: function () {
        return _populate() || (_ie_real_version > _ie);
      },

      ie64: function () {
        return UserAgent.ie() && _win64;
      },

      firefox: function () {
        return _populate() || _firefox;
      },

      opera: function () {
        return _populate() || _opera;
      },

      webkit: function () {
        return _populate() || _webkit;
      },

      safari: function () {
        return UserAgent.webkit();
      },

      chrome: function () {
        return _populate() || _chrome;
      },

      windows: function () {
        return _populate() || _windows;
      },

      osx: function () {
        return _populate() || _osx;
      },

      linux: function () {
        return _populate() || _linux;
      },

      iphone: function () {
        return _populate() || _iphone;
      },

      mobile: function () {
        return _populate() || (_iphone || _ipad || _android || _mobile);
      },

      nativeApp: function () {
        return _populate() || _native;
      },

      android: function () {
        return _populate() || _android;
      },

      ipad: function () {
        return _populate() || _ipad;
      },
    };

    return UserAgent;
  }).call({});

  function getAlertMessageOfPopupBlocker(defaultLang = "ko") {
    var defaultKoMessage = "팝업차단을 해제해주셔야 결제창이 나타납니다.";
    var defaultEnMessage =
      'To enable the Paypal payment window, please disable "Block pop-ups" in browser settings';
    var defaultMessage = defaultLang === "ko"
      ? defaultKoMessage
      : defaultEnMessage;
    var lang = navigator.language || navigator.userLanguage;
    if (lang) {
      lang = lang.toLowerCase().substring(0, 2);
      switch (lang) {
        case "ja":
          return "ポップアップブロックを解除すると、決済画面が表示されます";
        case "ko":
          return defaultKoMessage;
        case "en":
          return defaultEnMessage;
        default:
          return defaultMessage;
      }
    }
    return defaultMessage;
  }

  var SHINHAN = (function () {
    /* Shinhan PG */
    function ShinhanPG(frame) {
      this.frame = frame;
      this.targetName = "X_PAY_POP";
      this.monitoring = false;
      this.popup = null;
    }

    ShinhanPG.prototype.submit = function (proxyData) {
      var container = document.createElement("div"),
        form = document.createElement("form");

      form.acceptCharset = "euc-kr";
      if (form.canHaveHTML) { // detect IE
        try {
          document.charset = form.acceptCharset;
        } catch (e) {} //IE11
      }
      form.name = form.id = "shinhanFormProxy";
      form.action = proxyData.submitUrl;

      for (var key in proxyData.frmData) {
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = proxyData.frmData[key];
        form.appendChild(input);
      }

      container.appendChild(form);
      this.frame.dialog.append(container);

      form.target = this.targetName;
      form.submit();

      jQuery(container).remove();
    };

    ShinhanPG.prototype.open = function (request_id, merchant_uid) {
      this.popup = window.open(
        "about:blank",
        this.targetName,
        "height=400,width=640,location=no,status=yes,dependent=no,scrollbars=yes,resizable=yes",
      );
      if (this.popup) {
        this.monitoring = true;
        var that = this;

        function detectSelfClosed(popup) {
          if (!that.monitoring) return;

          if (popup.closed !== false) { // Opera compatibility
            that.frame.communicate({
              request_id: request_id,
              merchant_uid: merchant_uid,
              result: "proxy.closed",
            });

            return null; //break infinite setTimeout
          }

          return setTimeout(function () {
            detectSelfClosed(popup);
          }, 100);
        }

        detectSelfClosed(this.popup);
      }
    };

    ShinhanPG.prototype.close = function () {
      this.monitoring = false;
      this.popup.close();
    };
    /* //Shinhan PG */

    var _instance = null;

    return {
      init: function (frame) {
        if (_instance) return _instance;

        _instance = new ShinhanPG(frame);

        return _instance;
      },
      instance: function () {
        return _instance;
      },
    };
  })();

  /* NAVER CHECKOUT */
  var NAVERCO = (function () {
    /* Naver Checkout */
    function NaverCheckout(frame) {
      this.frame = frame;
      this.popup = null;
      this.popupMode = false;
    }

    NaverCheckout.prototype.open = function (
      request_id,
      merchant_uid,
      popupMode,
    ) {
      this.popupMode = popupMode;

      if (popupMode) {
        this.popup = window.open("about:blank");
        if (!this.popup) {
          alert(getAlertMessageOfPopupBlocker());
        }
      }
    };

    NaverCheckout.prototype.payRedirect = function (proxyData) {
      if (this.popupMode) {
        this.popup.location.href = proxyData.payUrl;
      } else {
        window.location.href = proxyData.payUrl;
      }
    };

    var _instance = null;

    return {
      init: function (frame) {
        if (_instance) return _instance;

        _instance = new NaverCheckout(frame);

        return _instance;
      },
      instance: function () {
        return _instance;
      },
    };
  })();

  /* NAVERPAY */
  var NAVERPAY = (function () {
    /* Naver Checkout */
    function NaverPay(frame) {
      this.frame = frame;
      this.popup = null;
      this.impUid = null;
      this.npay = null;
      this.npayProxy = null;
    }

    NaverPay.prototype.open = function (requestId, merchantUid, popupMode, v2) {
      if (v2 || !popupMode) return;

      this.popup = window.open(
        "about:blank",
        "IMP_NAVERPAY",
        "height=900,width=760,location=no,status=yes,dependent=no,scrollbars=yes,resizable=yes",
      );
      if (this.popup) {
        var that = this;

        function detectSelfClosed(popup) {
          if (popup.closed !== false) { // Opera compatibility
            that.frame.communicate({
              request_id: requestId,
              merchant_uid: merchantUid,
              imp_uid: that.impUid,
              result: "check.closing",
            });

            return null; //break infinite setTimeout
          }

          return setTimeout(function () {
            detectSelfClosed(popup);
          }, 50);
        }

        detectSelfClosed(this.popup);
      } else {
        alert(getAlertMessageOfPopupBlocker());
      }
    };

    NaverPay.prototype.close = function () {
      if (this.popup) {
        this.popup.close();
      }
    };

    NaverPay.prototype.payRedirect = function (proxyData) {
      if (proxyData.popupMode) {
        if (this.popup) {
          this.impUid = proxyData.impUid; //closing에 사용됨
          this.popup.location.href = proxyData.payUrl;
        } else { //팝업차단됨
          this.frame.close();
        }
      } else {
        this.frame.close();

        top.location.href = proxyData.payUrl;
      }
    };

    NaverPay.prototype.openLayer = function (proxyData) {
      //SDK결제창을 열었다 닫았다하여 반복적으로 호출될 때 Npay.create를 한 번만 하도록
      var self = this;

      function _open(_proxyData) {
        this.npayProxy = _proxyData;

        var npayParam = { // Pay Reserve Parameters
          "merchantPayKey": _proxyData.impUid,
          "productName": _proxyData.productName,
          "totalPayAmount": _proxyData.totalPayAmount,
          "taxScopeAmount": _proxyData.taxScopeAmount,
          "taxExScopeAmount": _proxyData.taxExScopeAmount,
          "returnUrl": _proxyData.returnUrl,
          "productCount": _proxyData.productCount,
          "productItems": _proxyData.productItems,
        };

        if (typeof _proxyData.extraDeduction == "boolean") {
          npayParam.extraDeduction = _proxyData.extraDeduction;
        }
        if (_proxyData.useCfmYmdt) npayParam.useCfmYmdt = _proxyData.useCfmYmdt;

        if (UserAgent.mobile()) this.frame.close();

        this.npay.open(npayParam);
      }

      if (self.npay) {
        _open.call(self, proxyData);
      } else {
        jQuery.getScript(
          "https://nsp.pay.naver.com/sdk/js/naverpay.min.js",
          function () {
            self.npay = Naver.Pay
              .create({ //SDK Parameters
                "mode": proxyData.mode,
                "clientId": proxyData.clientId,
                "openType": proxyData.openType,
                "payType": proxyData.payType,
                "onAuthorize": function (oData) {
                  // X버튼으로 결제창을 닫았다 열었다할 때 requestId, impUid 가 계속 바뀌므로 returnUrl 등 모두 갱신된다.
                  self.frame.communicate({
                    authData: oData,
                    return_url: self.npayProxy.returnUrl,
                    request_id: self.npayProxy.requestId,
                    imp_uid: self.npayProxy.impUid,
                    result: "request.approve",
                  });
                },
              });

            _open.call(self, proxyData);
          },
        );
      }
    };

    var _instance = null;

    return {
      init: function (frame) {
        if (_instance) return _instance;

        _instance = new NaverPay(frame);

        return _instance;
      },
      instance: function () {
        return _instance;
      },
    };
  })();

  /* PAYCO */
  var PAYCO = (function () {
    /* payco */
    function Payco(frame) {
      this.frame = frame;
      this.popup = null;
      this.impUid = null;
    }

    Payco.prototype.open = function (requestId, merchantUid) {
      this.popup = window.open(
        "",
        "IMP_PAYCO",
        "top=100, left=300, width=727px, height=512px, resizble=no, scrollbars=yes",
      );
      if (this.popup) {
        var that = this;

        function detectSelfClosed(popup) {
          if (popup.closed !== false) { // Opera compatibility
            that.frame.communicate({
              request_id: requestId,
              merchant_uid: merchantUid,
              imp_uid: that.impUid,
              result: "check.closing",
            });

            return null; //break infinite setTimeout
          }

          return setTimeout(function () {
            detectSelfClosed(popup);
          }, 50);
        }

        detectSelfClosed(this.popup);
      } else {
        alert(getAlertMessageOfPopupBlocker());
      }
    };

    Payco.prototype.close = function () {
      if (this.popup) {
        this.popup.close();
      }
    };

    Payco.prototype.payRedirect = function (proxyData) {
      this.impUid = proxyData.impUid; //closing에 사용됨
      this.popup.location.href = proxyData.orderUrl;
    };

    var _instance = null;

    return {
      init: function (frame) {
        if (_instance) return _instance;

        _instance = new Payco(frame);

        return _instance;
      },
      instance: function () {
        return _instance;
      },
    };
  })();

  /* DANALCERT */
  var DANALCERT = (function () {
    /* 다날 SMS인증 */
    function DanalCert(frame) {
      this.frame = frame;
      this.popup = null;
      this.imp_uid = null;
      this.cancel_url = null; //layer에서 close시 callback trigger 용
      this.targetName = "IMP_DANAL_CERT";
      this.monitoring = false;
    }

    DanalCert.prototype.open = function (request_id, merchant_uid, popupMode) {
      if (!popupMode) return;

      this.popup = window.open(
        "about:blank",
        this.targetName,
        "height=800,width=440,location=no,status=yes,dependent=no,scrollbars=yes,resizable=yes",
      );

      if (this.popup) {
        var that = this;

        function detectSelfClosed(popup) {
          if (that.monitoring) {
            if (popup.closed !== false) { // Opera compatibility
              that.frame.communicate({
                request_id: request_id,
                merchant_uid: merchant_uid,
                imp_uid: that.imp_uid,
                result: "check.closing",
              });

              return null; //break infinite setTimeout
            }

            return setTimeout(function () {
              detectSelfClosed(popup);
            }, 50);
          }
        }

        that.monitoring = true;
        detectSelfClosed(this.popup);
      } else {
        alert("팝업차단을 해제해주셔야 인증창이 나타납니다.");
      }
    };

    DanalCert.prototype.close = function () {
      if (this.popup) {
        this.monitoring = false; //postMessage가 도달한 경우에는 아임포트에 의한 종료(사용자에 의한 강제종료만 check.closing되도록)
        this.popup.close();
      } else {
        this.frame.redirect(this.cancel_url);
      }
    };

    DanalCert.prototype.submitToPopup = function (proxyData) {
      this.imp_uid = proxyData.imp_uid; //closing에 사용됨

      var container = document.createElement("div"),
        form = document.createElement("form");

      form.name = form.id = "danalCertProxy";
      form.method = "post";
      form.action = proxyData.form.action;
      form.target = this.popup ? this.targetName : "_top";

      for (var key in proxyData.form.data) {
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = proxyData.form.data[key];
        form.appendChild(input);
      }

      container.appendChild(form);
      this.frame.dialog.append(container);

      form.addEventListener("submit", function () {
        jQuery(container).remove();
      });
      form.submit();
    };

    DanalCert.prototype.checkLayer = function (data) {
      this.cancel_url = data.cancel_url; //X버튼 close에 사용됨
    };

    var _instance = null;

    return {
      init: function (frame) {
        if (_instance) return _instance;

        _instance = new DanalCert(frame);

        return _instance;
      },
      instance: function () {
        return _instance;
      },
    };
  })();

  /* INICISCERT */
  var INICISCERT = (function () {
    /* 이니시스 신용카드 본인인증 */
    function InicisCert(frame) {
      this.frame = frame;
      this.popup = null;
      this.imp_uid = null;
      this.targetName = "IMP_INICIS_CERT";
      this.monitoring = false;
    }

    InicisCert.prototype.open = function (request_id, merchant_uid, popupMode) {
      if (UserAgent.mobile() && !popupMode) return;

      this.popup = window.open(
        "about:blank",
        this.targetName,
        "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=450,height=750,top=100,left=100",
      );

      if (this.popup) {
        var that = this;

        function detectSelfClosed(popup) {
          if (that.monitoring) {
            if (popup.closed !== false) { // Opera compatibility
              that.frame.communicate({
                request_id: request_id,
                merchant_uid: merchant_uid,
                imp_uid: that.imp_uid,
                result: "check.closing",
              });

              return null; //break infinite setTimeout
            }

            return setTimeout(function () {
              detectSelfClosed(popup);
            }, 50);
          }
        }

        that.monitoring = true;
        detectSelfClosed(this.popup);
      } else {
        alert("팝업차단을 해제해주셔야 인증창이 나타납니다.");
      }
    };

    InicisCert.prototype.close = function () {
      if (this.popup) {
        this.monitoring = false; //postMessage가 도달한 경우에는 아임포트에 의한 종료(사용자에 의한 강제종료만 check.closing되도록)
        this.popup.close();
      }
    };

    InicisCert.prototype.submitToPopup = function (proxyData) {
      this.imp_uid = proxyData.impUid; //closing에 사용됨

      var container = document.createElement("div"),
        form = document.createElement("form");

      form.name = form.id = proxyData.formId;
      form.method = proxyData.method;
      form.action = proxyData.action;
      form.target = proxyData.popup ? this.targetName : "_self";

      for (var key in proxyData.param) {
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = proxyData.param[key];
        form.appendChild(input);
      }

      container.appendChild(form);
      this.frame.dialog.append(container);

      form.addEventListener("submit", function () {
        jQuery(container).remove();
      });
      form.submit();
    };

    var _instance = null;

    return {
      init: function (frame) {
        if (_instance) return _instance;

        _instance = new InicisCert(frame);

        return _instance;
      },
      instance: function () {
        return _instance;
      },
    };
  })();

  /* INICISUNIFIEDCERT */
  var INICISUNIFIEDCERT = (function () {
    /* 이니시스 신용카드 본인인증 */
    function InicisUnifiedCert(frame) {
      this.frame = frame;
      this.popup = null;
      this.imp_uid = null;
      this.targetName = "IMP_INICIS_UNIFIED_CERT";
      this.monitoring = false;
    }

    InicisUnifiedCert.prototype.open = function (
      request_id,
      merchant_uid,
      popupMode,
    ) {
      if (UserAgent.mobile() && !popupMode) return;

      this.popup = window.open(
        "about:blank",
        this.targetName,
        "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=450,height=750,top=100,left=100",
      );

      if (this.popup) {
        var that = this;

        function detectSelfClosed(popup) {
          if (that.monitoring) {
            if (popup.closed !== false) { // Opera compatibility
              that.frame.communicate({
                request_id: request_id,
                merchant_uid: merchant_uid,
                imp_uid: that.imp_uid,
                result: "check.closing",
              });

              return null; //break infinite setTimeout
            }

            return setTimeout(function () {
              detectSelfClosed(popup);
            }, 50);
          }
        }

        that.monitoring = true;
        detectSelfClosed(this.popup);
      } else {
        alert("팝업차단을 해제해주셔야 인증창이 나타납니다.");
      }
    };

    InicisUnifiedCert.prototype.close = function () {
      if (this.popup) {
        this.monitoring = false; //postMessage가 도달한 경우에는 아임포트에 의한 종료(사용자에 의한 강제종료만 check.closing되도록)
        this.popup.close();
      }
    };

    InicisUnifiedCert.prototype.submitToPopup = function (proxyData) {
      this.imp_uid = proxyData.impUid; //closing에 사용됨

      var container = document.createElement("div"),
        form = document.createElement("form");

      form.name = form.id = proxyData.formId;
      form.method = proxyData.method;
      form.action = proxyData.action;
      form.target = proxyData.popup ? this.targetName : "_self";

      for (var key in proxyData.param) {
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = proxyData.param[key];
        form.appendChild(input);
      }

      container.appendChild(form);
      this.frame.dialog.append(container);

      form.addEventListener("submit", function () {
        jQuery(container).remove();
      });
      form.submit();
    };

    var _instance = null;

    return {
      init: function (frame) {
        if (_instance) return _instance;

        _instance = new InicisUnifiedCert(frame);

        return _instance;
      },
      instance: function () {
        return _instance;
      },
    };
  })();

  /* SettleFirm */
  var SettleFirm = (function () {
    function SettleFirm(frame) {
      this.frame = frame;
      this.popup = null;
      this.impUid = null;
    }

    SettleFirm.prototype.open = function (
      requestId,
      merchantUid,
      popupMode,
      _currentIframe,
    ) {
      if (!popupMode) {
        jQuery(_currentIframe.iframe).addClass("layer");
        return;
      }

      this.popup = window.open(
        "",
        "IMP_SETTLE_FIRM",
        "top=100, left=300, width=480px, height=770px, resizble=no, scrollbars=yes",
      );
      if (this.popup) {
        var that = this;

        function detectSelfClosed(popup) {
          if (popup.closed !== false) { // Opera compatibility
            that.frame.communicate({
              request_id: requestId,
              merchant_uid: merchantUid,
              imp_uid: that.impUid,
              result: "check.closing",
            });

            return null; //break infinite setTimeout
          }

          return setTimeout(function () {
            detectSelfClosed(popup);
          }, 50);
        }

        detectSelfClosed(this.popup);
      } else {
        alert(getAlertMessageOfPopupBlocker());
      }
    };

    SettleFirm.prototype.proxyRequest = function (proxyData) {
      if (proxyData.uiMode == "popup") {
        if (!this.popup) {
          return this.frame.close();
        }
      }

      this.impUid = proxyData.impUid; //closing에 사용됨

      var container = document.createElement("div"),
        form = document.createElement("form");

      form.name = form.id = proxyData.formId;
      form.method = proxyData.method;
      form.action = proxyData.action;
      form.target = proxyData.uiMode == "popup" ? "IMP_SETTLE_FIRM" : "_top";

      form.acceptCharset = proxyData.charset;
      if (form.canHaveHTML) { // detect IE
        try {
          document.charset = form.acceptCharset;
        } catch (e) {} //IE11
      }

      for (var key in proxyData.param) {
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = proxyData.param[key];
        form.appendChild(input);
      }

      container.appendChild(form);
      this.frame.dialog.append(container);

      form.addEventListener("submit", function () {
        jQuery(container).remove();
      });
      form.submit();
    };

    var _instance = null;

    return {
      init: function (frame) {
        if (_instance) return _instance;

        _instance = new SettleFirm(frame);

        return _instance;
      },
      instance: function () {
        return _instance;
      },
    };
  })();

  /* inicis-ios */
  function InicisIos(frame) {
    this.frame = frame;
  }

  InicisIos.prototype.submit = function (proxyData) {
    var container = document.createElement("div"),
      form = document.createElement("form");

    form.acceptCharset = "euc-kr";
    if (form.canHaveHTML) { // detect IE
      try {
        document.charset = form.acceptCharset;
      } catch (e) {} //IE11
    }
    form.name = form.id = "ini";
    form.action = proxyData.action;
    form.method = "post";
    form.target = "_top";

    for (var key in proxyData.formData) {
      var input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = proxyData.formData[key];
      form.appendChild(input);
    }

    container.appendChild(form);
    this.frame.dialog.append(container);

    form.addEventListener("submit", function () {
      jQuery(container).remove();
    });
    form.submit();
  };

  /* NAVER ZZIM */
  var NAVERZZIM = (function () {
    /* Naver Zzim */
    function NaverZzim(frame) {
      this.frame = frame;
      this.popup = null;
    }

    NaverZzim.prototype.open = function (request_id, merchant_uid) {
      if (UserAgent.mobile()) return;

      this.popup = window.open(
        "about:blank",
        "IMP_NAVER_ZZIM",
        "height=600,width=480,location=no,status=yes,dependent=no,scrollbars=yes,resizable=yes",
      );
    };

    NaverZzim.prototype.zzimRedirect = function (proxyData) {
      if (UserAgent.mobile()) {
        window.location.href = proxyData.redirectUrl;
      } else {
        this.popup.location.href = proxyData.redirectUrl;
      }
    };

    var _instance = null;

    return {
      init: function (frame) {
        if (_instance) return _instance;

        _instance = new NaverZzim(frame);

        return _instance;
      },
      instance: function () {
        return _instance;
      },
    };
  })();

  /* PAYPAL */
  var PAYPALMODAL = (function () {
    /* PAYPAL */
    function PAYPALMODAL(frame) {
      this.frame = frame;
      this.popup = null;
      this.mode = null;
      this.impUid = null;
    }

    PAYPALMODAL.prototype.open = function (requestId, merchantUid, mode) {
      this.mode = mode;
      if (this.mode === true) {
        this.popup = window.open(
          "about:blank",
          "IMP_PAYPAL_MODAL",
          "top=100, left=300, width=440px, height=700px, resizble=no, scrollbars=yes",
        );
        if (this.popup) {
          var that = this;

          function detectSelfClosed(popup) {
            if (popup.closed !== false) { // Opera compatibility
              that.frame.communicate({
                request_id: requestId,
                merchant_uid: merchantUid,
                imp_uid: that.impUid,
                result: "check.closing",
              });

              return null; //break infinite setTimeout
            }

            return setTimeout(function () {
              detectSelfClosed(popup);
            }, 50);
          }

          detectSelfClosed(this.popup);
        } else {
          // alert(getAlertMessageOfPopupBlocker('en'));
        }
      }
    };

    PAYPALMODAL.prototype.payRedirect = function (proxyData) {
      if (this.mode === true) {
        if (this.popup) {
          this.impUid = proxyData.impUid; //closing에 사용됨
          this.popup.location.href = proxyData.redirectUrl;
        } else {
          this.frame.close();
          alert(getAlertMessageOfPopupBlocker("en"));
        }
      } else {
        this.frame.close();
        location.href = proxyData.redirectUrl;
      }
    };

    var _instance = null;

    return {
      init: function (frame) {
        if (_instance) return _instance;

        _instance = new PAYPALMODAL(frame);

        return _instance;
      },
      instance: function () {
        return _instance;
      },
    };
  })();

  /* SETTLE */
  var SETTLEBANK = (function () {
    /* SETTLE */
    function SETTLEBANK(frame) {
      this.frame = frame;
      this.popup = null;
      this.impUid = null;
      this.monitoring = false;
      this.targetName = "STPG_WALLET";
    }

    SETTLEBANK.prototype.open = function (request_id, merchant_uid) {
      var width = 720;
      var height = 630;

      var xpos = (screen.width - width) / 2;
      var ypos = (screen.width - height) / 6;
      var position = "top=" + ypos + ",left=" + xpos;
      var features = position + ", width=" + width + ", height=" + height +
        ",toolbar=no, location=no";

      this.popup = window.open("about:blank", this.targetName, features);
      if (this.popup) {
        this.monitoring = true;
        var that = this;

        function detectSelfClosed(popup) {
          if (!that.monitoring) return;

          if (popup.closed !== false) { // Opera compatibility
            that.frame.communicate({
              request_id: request_id,
              merchant_uid: merchant_uid,
              imp_uid: that.impUid,
              result: "check.closing",
            });

            return null; //break infinite setTimeout
          }

          return setTimeout(function () {
            detectSelfClosed(popup);
          }, 100);
        }

        detectSelfClosed(this.popup);
      } else {
        alert(getAlertMessageOfPopupBlocker());
      }
    };

    SETTLEBANK.prototype.pay = function (proxyData) {
      this.impUid = proxyData.impUid; //closing에 사용됨

      var container = document.createElement("div"),
        form = document.createElement("form");

      form.name = form.id = "settleOrderForm";
      form.action = proxyData.submitUrl;

      for (var key in proxyData.frmData) {
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = proxyData.frmData[key];
        form.appendChild(input);
      }

      container.appendChild(form);
      this.frame.dialog.append(container);

      form.target = this.targetName;

      form.addEventListener("submit", function () {
        jQuery(container).remove();
      });
      form.submit();
    };

    var _instance = null;

    return {
      init: function (frame) {
        if (_instance) return _instance;

        _instance = new SETTLEBANK(frame);

        return _instance;
      },
      instance: function () {
        return _instance;
      },
    };
  })();

  /* Eximbay */
  var EXIMBAY = (function () {
    /* Eximbay PG */
    function EximbayPG(frame) {
      this.frame = frame;
      this.targetName = "payment2";
      this.monitoring = false;
      this.popup = null;
      this.impUid = null;
      this.popupMode = true; //iframe 중단되면서 popup 방식을 기본으로 적용(callbackFunc 살리기 위해)
    }

    EximbayPG.prototype.submit = function (proxyData) {
      if (this.popupMode && !this.popup) {
        this.frame.close(); //dimmed div 닫아주기
        return; //popup 모드인데 popup이 null 이면 popup-blocked 이므로 아무것도 하지 않음.
      }

      this.impUid = proxyData.impUid; //closing에 사용됨

      var container = document.createElement("div"),
        form = document.createElement("form");

      form.name = form.id = "eximbayFormProxy";
      form.action = proxyData.action;
      form.method = "post";

      for (var key in proxyData.formData) {
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = proxyData.formData[key];
        form.appendChild(input);
      }

      container.appendChild(form);
      this.frame.dialog.append(container);

      form.target = this.popup ? this.targetName : "_self"; //page redirection 모드에서는 self

      form.addEventListener("submit", function () {
        jQuery(container).remove();
      });
      form.submit();
    };

    EximbayPG.prototype.open = function (request_id, merchant_uid, popup_mode) {
      if (popup_mode === false) {
        this.popupMode = false;
        return; //기본값은 true로 간주하여, legacy를 고려해 false일 때에만 막음
      }

      this.popup = window.open(
        "about:blank",
        this.targetName,
        "top=100,left=400,height=400,width=640,location=no,status=yes,dependent=no,scrollbars=yes,resizable=yes",
      );
      if (this.popup) {
        this.monitoring = true;
        var that = this;

        function detectSelfClosed(popup) {
          if (!that.monitoring) return;

          if (popup.closed !== false) { // Opera compatibility
            that.frame.communicate({
              request_id: request_id,
              merchant_uid: merchant_uid,
              imp_uid: that.impUid,
              result: "proxy.closed",
            });

            return null; //break infinite setTimeout
          }

          return setTimeout(function () {
            detectSelfClosed(popup);
          }, 100);
        }

        detectSelfClosed(this.popup);
      } else {
        alert(getAlertMessageOfPopupBlocker());
      }
    };

    EximbayPG.prototype.close = function () {
      this.monitoring = false;
      this.popup.close();
    };
    /* //Eximbay PG */

    var _instance = null;

    return {
      init: function (frame) {
        if (_instance) return _instance;

        _instance = new EximbayPG(frame);

        return _instance;
      },
      instance: function () {
        return _instance;
      },
    };
  })();

  /* ChaiPay */
  var ChaiPay = (function () {
    /* Chai */
    function ChaiPay(frame) {
      this.frame = frame;
      this.targetName = "chaiIamportModal";
      this.monitoring = false;
      this.popup = null;
      this.impUid = null;
      this.popupMode = false;
    }

    ChaiPay.prototype.open = function (requestId, merchantUid, popupMode) {
      if (popupMode !== true) {
        return; //popup 모드가 나중에 생김
      }

      this.popup = window.open(
        "about:blank",
        this.targetName,
        "top=100,left=400,height=740,width=540,location=no,status=yes,dependent=no,scrollbars=yes,resizable=yes",
      );
      if (this.popup) {
        this.monitoring = true;
        var that = this;

        function detectSelfClosed(popup) {
          if (!that.monitoring) return;

          if (popup.closed !== false) { // Opera compatibility
            that.frame.communicate({
              request_id: requestId,
              merchant_uid: merchantUid,
              imp_uid: that.impUid,
              result: "check.closing",
            });

            return null; //break infinite setTimeout
          }

          return setTimeout(function () {
            detectSelfClosed(popup);
          }, 100);
        }

        detectSelfClosed(this.popup);
      } else {
        this.frame.close();
        alert(getAlertMessageOfPopupBlocker());
      }
    };

    var _instance = null;

    return {
      init: function (frame) {
        if (_instance) return _instance;

        _instance = new ChaiPay(frame);

        return _instance;
      },
      instance: function () {
        return _instance;
      },
    };
  })();

  /* Smartro */
  var Smartro = (function () {
    /* Smartro */
    function Smartro(frame) {
      this.frame = frame;
      this.targetName = "payWindow";
      this.monitoring = false;
      this.popup = null;
      this.impUid = null;
    }

    Smartro.prototype.open = function (requestId, merchantUid) {
      this.popup = window.open(
        "about:blank",
        this.targetName,
        "width=620,height=405,left=150,top=150,toolbar=no,location=no,directories=no,status=yes,menubar=no,status=yes,menubar=no,scrollbars=no,resizable=yes",
      );
      if (this.popup) {
        this.monitoring = true;
        var that = this;

        function detectSelfClosed(popup) {
          if (!that.monitoring) return;

          if (popup.closed !== false) { // Opera compatibility
            that.frame.communicate({
              request_id: requestId,
              merchant_uid: merchantUid,
              imp_uid: that.impUid,
              result: "check.closing",
            });

            return null; //break infinite setTimeout
          }

          return setTimeout(function () {
            detectSelfClosed(popup);
          }, 100);
        }

        detectSelfClosed(this.popup);
      } else {
        this.frame.close();
        alert(getAlertMessageOfPopupBlocker());
      }
    };

    var _instance = null;

    return {
      init: function (frame) {
        if (_instance) return _instance;

        _instance = new Smartro(frame);

        return _instance;
      },
      instance: function () {
        return _instance;
      },
    };
  })();

  /* Tosspay */
  var Tosspay = (function () {
    /* Tosspay */
    function Tosspay(frame) {
      this.frame = frame;
      this.targetName = "tosspayPopup";
      this.monitoring = false;
      this.popup = null;
      this.impUid = null;
    }

    Tosspay.prototype.open = function (requestId, merchantUid) {
      this.popup = window.open(
        "about:blank",
        this.targetName,
        "width=460,height=670,left=150,top=150,toolbar=no,location=no,directories=no,status=yes,menubar=no,status=yes,menubar=no,scrollbars=no,resizable=yes",
      );
      if (this.popup) {
        this.monitoring = true;
        var that = this;

        function detectSelfClosed(popup) {
          if (!that.monitoring) return;

          if (popup.closed !== false) { // Opera compatibility
            that.frame.communicate({
              request_id: requestId,
              merchant_uid: merchantUid,
              imp_uid: that.impUid,
              result: "check.closing",
            });

            return null; //break infinite setTimeout
          }

          return setTimeout(function () {
            detectSelfClosed(popup);
          }, 100);
        }

        detectSelfClosed(this.popup);
      } else {
        this.frame.close();
        alert(getAlertMessageOfPopupBlocker());
      }
    };

    Tosspay.prototype.close = function () {
      if (this.popup) {
        this.popup.close();
      }
    };

    var _instance = null;

    return {
      init: function (frame) {
        if (_instance) return _instance;

        _instance = new Tosspay(frame);

        return _instance;
      },
      instance: function () {
        return _instance;
      },
    };
  })();

  /* KcpQuick */
  var KcpQuick = (function () {
    /* KcpQuick */
    function KcpQuick(frame) {
      this.frame = frame;
      this.targetName = "kcpQuick"; //proxyRequest 의 target name 과 맞춰야 한다.
      this.monitoring = false;
      this.popup = null;
      this.impUid = null;
    }

    KcpQuick.prototype.open = function (requestId, merchantUid) {
      this.popup = window.open(
        "about:blank",
        this.targetName,
        "width=480,height=720,left=150,top=150,toolbar=no,location=no,directories=no,status=yes,menubar=no,status=yes,menubar=no,scrollbars=no,resizable=yes",
      );
      if (this.popup) {
        this.monitoring = true;
        var that = this;

        function detectSelfClosed(popup) {
          if (!that.monitoring) return;

          if (popup.closed !== false) { // Opera compatibility
            that.frame.communicate({
              request_id: requestId,
              merchant_uid: merchantUid,
              imp_uid: that.impUid,
              result: "check.closing",
            });

            return null; //break infinite setTimeout
          }

          return setTimeout(function () {
            detectSelfClosed(popup);
          }, 100);
        }

        detectSelfClosed(this.popup);
      } else {
        this.frame.close();
        alert(getAlertMessageOfPopupBlocker());
      }
    };

    KcpQuick.prototype.close = function () {
      if (this.popup) {
        this.popup.close();
      }
    };

    var _instance = null;

    return {
      init: function (frame) {
        if (_instance) return _instance;

        _instance = new KcpQuick(frame);

        return _instance;
      },
      instance: function () {
        return _instance;
      },
    };
  })();

  /* Daou */
  var Daou = (function () {
    /* Daou */
    function Daou(frame) {
      this.frame = frame;
      this.targetName = "daou";
      this.monitoring = false;
      this.popup = null;
      this.impUid = null;
    }

    Daou.prototype.open = function (requestId, merchantUid) {
      this.popup = window.open(
        "about:blank",
        this.targetName,
        "width=480,height=720,left=150,top=150,toolbar=no,location=no,directories=no,status=yes,menubar=no,status=yes,menubar=no,scrollbars=no,resizable=yes",
      );
      if (this.popup) {
        this.monitoring = true;
        var that = this;

        function detectSelfClosed(popup) {
          if (!that.monitoring) return;

          if (popup.closed !== false) { // Opera compatibility
            that.frame.communicate({
              request_id: requestId,
              merchant_uid: merchantUid,
              imp_uid: that.imp_uid,
              result: "check.closing",
            });

            return null; //break infinite setTimeout
          }

          return setTimeout(function () {
            detectSelfClosed(popup);
          }, 50);
        }

        detectSelfClosed(this.popup);
      } else {
        this.frame.close();
        alert(getAlertMessageOfPopupBlocker());
      }
    };

    Daou.prototype.close = function () {
      if (this.popup) {
        this.popup.close();
      }
    };

    Daou.prototype.submitToPopup = function (proxyData) {
      this.imp_uid = proxyData.impUid; //closing에 사용됨

      var container = document.createElement("div"),
        form = document.createElement("form");

      form.acceptCharset = "euc-kr";
      form.name = form.id = proxyData.formId;
      form.method = proxyData.method;
      form.action = proxyData.action;
      form.target = proxyData.popup ? this.targetName : "_self";

      for (var key in proxyData.param) {
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = proxyData.param[key];
        form.appendChild(input);
      }

      container.appendChild(form);
      this.frame.dialog.append(container);

      form.addEventListener("submit", function () {
        jQuery(container).remove();
      });
      form.submit();
    };

    var _instance = null;

    return {
      init: function (frame) {
        if (_instance) return _instance;

        _instance = new Daou(frame);

        return _instance;
      },
      instance: function () {
        return _instance;
      },
    };
  })();

  var XDM = (function (window) {
    var document = window.document;
    var reserved_request = null; //마지막 1가지만 저장한다. 괜히 request를 반복으로 보내봐야 cross domain error날 확률만 높임
    var sent_queue = [];
    var DEFAULT_KEY = "default";

    var getFrameInst = (function () {
      var instance;

      function init() { //jQuery.ready가 된 상태에서 호출되어야 함
        var $dialog = jQuery('<div class="imp-dialog customizable"></div>');
        jQuery(document.body).append($dialog);

        var frm = new Frames($dialog);

        if (window.addEventListener) { // all browsers except IE before version 9
          window.addEventListener("message", on_message, false);
        } else {
          if (window.attachEvent) { // IE before version 9
            window.attachEvent("onmessage", on_message);
          }
        }

        function on_message(e) {
          var obj = {},
            action = null,
            data = null,
            request_id = null,
            from = null,
            paymentResult = {};
          var source = e.source;
          var origin = e.origin;

          if (origin !== api_server && origin !== payportFrontDomain) {
            return false;
          }

          try {
            obj = JSON.parse(e.data);
            action = obj.action;
            data = obj.data || {};
            request_id = data.request_id;
            from = obj.from;
            paymentResult = obj.paymentResult;
          } catch (e) {}
          //intercept
          if (action === "kakao.dlp") { //mobile ios전용
            var proxyData = data;
            var scripts = proxyData.scripts,
              styles = proxyData.styles;

            var getAsyncTask = function (src) {
              return function () {
                return jQuery.getScript(src);
              };
            };

            //load styles
            for (var i = 0, len = styles.length; i < len; i++) {
              loadStyle(styles[i]);
            }

            //load scripts
            var d = jQuery.Deferred().resolve();
            for (var i = 0, len = scripts.length; i < len; i++) {
              d = d.then(getAsyncTask(scripts[i]));
            }

            d.then(function () {
              var documentFragment = document.createDocumentFragment(),
                form = document.createElement("form"),
                layer = document.createElement("div");

              form.acceptCharset = "UTF-8";
              form.name = form.id = "kakaoPayFormProxy";

              layer.id = "kakaopay_layer";

              for (var key in proxyData.formData) {
                var input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = proxyData.formData[key];
                form.appendChild(input);
              }

              documentFragment.appendChild(form);
              documentFragment.appendChild(layer);
              $dialog.append(documentFragment);

              kakaopayDlp.setTxnId(proxyData.txnId);
              kakaopayDlp.setChannelType(
                proxyData.channel.key,
                proxyData.channel.value,
              );
              kakaopayDlp.addRequestParams(proxyData.param); // 초기값 세팅

              if (proxyData.returnUrl) {
                kakaopayDlp.setReturnUrl(proxyData.returnUrl);
              }
              if (proxyData.cancelUrl) {
                kakaopayDlp.setCancelUrl(proxyData.cancelUrl);
              }

              kakaopayDlp.callDlp(
                "kakaopay_layer",
                document.forms["kakaoPayFormProxy"],
                function (data) {
                  frm.communicate({
                    request_id: request_id,
                    imp_uid: proxyData.imp_uid, //전달해줘야 callback에 전달 가능
                    merchant_uid: proxyData.merchant_uid, //전달해줘야 callback에 전달 가능
                    result: "proxy.auth",
                    auth: data,
                    formData: formToJson(document.forms["kakaoPayFormProxy"]),
                  });
                },
              );
            });

            return; //중요함
          } else if (action == "inicis.mobile") {
            var inicis = new InicisIos(frm);
            inicis.submit(data);

            if (UserAgent.mobile()) {
              frm.close();
            }

            return; //break;
          } else if (action === "payco.modal") {
            var payco = PAYCO.instance();
            payco.payRedirect(data);

            return; //break;
          } else if (action === "payco.modal.error") {
            var payco = PAYCO.instance();
            payco.close(data); //break 하지 않아야 함
          } else if (action === "shinhan.modal") {
            var shinhan = SHINHAN.instance();
            shinhan.submit(data);

            return; //break;
          } else if (action === "done" && data.pg_provider == "shinhan") {
            var shinhan = SHINHAN.instance();
            shinhan.close();
          } else if (action === "naverco.modal") {
            var naverco = NAVERCO.instance();
            naverco.payRedirect(data);

            frm.close();

            return; //break;
          } else if (action === "naverco.zzim.modal") {
            var naverZzim = NAVERZZIM.instance();
            naverZzim.zzimRedirect(data);

            frm.close();

            return; //break;
          } else if (action === "naverpay.modal") {
            var naverpay = NAVERPAY.instance();
            naverpay.payRedirect(data);

            return; //break;
          } else if (action === "naverpay.modal.close") {
            var naverpay = NAVERPAY.instance();
            naverpay.close(); //break 하지 않아야 함
          } else if (action === "naverpay.modal.v2") {
            var naverpay = NAVERPAY.instance();
            naverpay.openLayer(data);

            return; //break;
          } else if (action === "danal.cert.modal") {
            var danalCert = DANALCERT.instance();
            danalCert.submitToPopup(data);

            return; //break;
          } else if (action === "danal.cert.layer") {
            var danalCert = DANALCERT.instance();
            danalCert.checkLayer(data);

            return; //break;
          } else if (action === "paypal.modal") {
            var paypalModal = PAYPALMODAL.instance();
            paypalModal.payRedirect(data);

            return; //break;
          } else if (action === "settle.modal") {
            var settleModal = SETTLEBANK.instance();
            settleModal.pay(data);

            return; //break;
          } else if (action === "done" && data.pg_type == "certification") {
            if (data.pg_provider == "danal") {
              var danalCert = DANALCERT.instance();
              danalCert.close();
            } else if (data.pg_provider == "inicis") {
              var inicisCert = INICISCERT.instance();
              inicisCert.close();
            } else if (data.pg_provider == "inicis_unified") {
              var inicisUnifiedCert = INICISUNIFIEDCERT.instance();
              inicisUnifiedCert.close();
            }
          } else if (action === "eximbay.modal") {
            var eximbay = EXIMBAY.instance();
            eximbay.submit(data);

            return; //break;
          } else if (action === "done" && data.pg_provider == "eximbay") {
            var eximbay = EXIMBAY.instance();
            eximbay.close();
          } else if (action === "kcp_quick.modal.close") {
            var kcpQuick = KcpQuick.instance();
            kcpQuick.close(); //break 하지 않아야 함
          } else if (action === "daou.modal") {
            var daou = Daou.instance();
            daou.submitToPopup(data);

            return; //break
          } else if (action === "daou.modal.close") {
            var daou = Daou.instance();
            daou.close();
          } else if (action === "proxy.post") {
            if (data.pgProvider == "settle_firm") {
              var settleFirm = SettleFirm.instance();
              settleFirm.proxyRequest(data);
            } else {
              proxyRequest(frm, data);
            }

            return; //break;
          } else if (action === "inicis.cert.modal") {
            var inicisCert = INICISCERT.instance();
            inicisCert.submitToPopup(data);

            return; //break
          } else if (action === "inicis_unified.cert.modal") {
            var inicisUnifiedCert = INICISUNIFIEDCERT.instance();
            inicisUnifiedCert.submitToPopup(data);

            return; //break
          } else if (action === "tosspay.modal.close") {
            setTimeout(function () {
              var tosspay = Tosspay.instance();
              tosspay.close();
            }, 0); //callback trigger 먼저하고 닫히게 한다.
          } else if (e.data.from === "payport") {
            request_id = requestIdForPayport;
            data = e.data.paymentResult;
            $.extend(data, { request_id: request_id });
          }

          var len = sent_queue.length;
          for (var i = len - 1; i >= 0; i--) {
            if (sent_queue[i].request_id === request_id) {
              try {
                //POST data process
                delete data.request_id;

                sent_queue[i].callback.call({}, data); //callback에는 function만 들어와 있다. 에러가 발생하더라도 close()로직에 영향주지않도록
              } catch (e) {
                if (window.console && typeof console.log === "function") {
                  console.log(e);
                }
              } finally {
                sent_queue.splice(i, 1);
                break;
              }
            }
          }

          frm.close();
          frm.reload(); // frm.refresh();
        }

        return frm;
      }

      function _getter() {
        if (!instance) instance = init();

        return instance;
      }

      function loadStyle(style) {
        //IE를 위해서는 createStyleSheet를 써야하지만 ios전용이므로 고려하지 않음
        jQuery("<link>")
          .appendTo("head")
          .attr({
            type: "text/css",
            rel: "stylesheet",
            href: style,
          });
      }

      function formToJson(frm) {
        var arr = jQuery(frm).serializeArray(),
          obj = {};

        jQuery.each(arr, function () {
          obj[this.name] = this.value;
        });

        return obj;
      }

      function proxyRequest(frame, proxyData) {
        var container = document.createElement("div"),
          form = document.createElement("form");

        form.name = form.id = proxyData.formId;
        form.method = proxyData.method;
        form.action = proxyData.action;
        form.target = proxyData.target;

        form.acceptCharset = proxyData.charset;
        if (form.canHaveHTML) { // detect IE
          try {
            document.charset = form.acceptCharset;
          } catch (e) {} //IE11
        }

        for (var key in proxyData.param) {
          var input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = proxyData.param[key];
          form.appendChild(input);
        }

        container.appendChild(form);
        frame.dialog.append(container);

        //submit
        if (proxyData.pgProvider === "uplus") {
          jQuery.getScript(proxyData.custom.sdk, function () {
            https_flag = true;

            form.addEventListener("submit", function () {
              jQuery(container).remove();
            });
            open_paymentwindow(form, proxyData.custom.mode, "submit");

            //Safari 뒤로가기로 재진입했을 때 div 가 살아있어 흰화면으로 보이는 증상 제거(safari가 DOM 복원을 하므로 frame.close() 후에 결제프로세스를 진행시켜야 함)
            if (
              UserAgent.mobile() &&
              (proxyData.target == "_top" || proxyData.target == "_self")
            ) {
              frame.close();
            }
          });
        } else if (proxyData.pgProvider === "kicc") {
          jQuery.getScript(proxyData.custom.sdk, function () {
            form.addEventListener("submit", function () {
              jQuery(container).remove();
            });
            easypay_card_webpay(
              form,
              proxyData.custom.bridge,
              "_top",
              "0",
              "0",
              "submit",
              30,
            );
          });
        } else if (proxyData.pgProvider === "payple") {
          jQuery.getScript(proxyData.custom.sdk, function () {
            PaypleCpayAuthCheck(proxyData.param);
          });
        } else if (proxyData.pgProvider === "mobilians") {
          jQuery.getScript(proxyData.custom.sdk, function () {
            form.addEventListener("submit", function () {
              jQuery(container).remove();
            });
            MCASH_PAYMENT(form);
          });
        } else if (proxyData.pgProvider === "chai") {
          var chaiPay = ChaiPay.instance();
          if (chaiPay.popup) { //팝업창이 아직 열려있다면
            form.target = chaiPay.targetName;
            chaiPay.impUid = proxyData.param.impUid;

            form.addEventListener("submit", function () {
              jQuery(container).remove();
            });
            form.submit();
          } else {
            jQuery.getScript(proxyData.custom.sdk, function () {
              if (proxyData.param.isSbcr) {
                ChaiPayment.subscribe(proxyData.param);
              } else {
                ChaiPayment.checkout(proxyData.param);
              }
            });
          }
        } else if (proxyData.pgProvider === "smilepay") {
          jQuery.getScript(proxyData.custom.sdk, function () {
            smilepay_L.domain = "https://pg.cnspay.co.kr"; //lazy load 상황에서 lgcns script 버그 회피

            if (
              proxyData.custom.channel == "mobile" && !proxyData.custom.popup
            ) {
              smilepay_L.movePage(proxyData.param.txnId);
            } else {
              smilepay_L.callPopup(proxyData.param.txnId, function () {
                alert("사용자가 결제를 취소하였습니다.");
                frame.close();
              });
            }
            return;
          });
        } else if (proxyData.pgProvider === "settle_acc") {
          jQuery.getScript(proxyData.custom.sdk, function () {
            SettlePay.execute(form);

            var popup = window.open("", form.name),
              requestId = proxyData.custom.requestId,
              merchantUid = proxyData.custom.merchantUid,
              impUid = proxyData.custom.impUid;

            function detectSelfClosed(popup) {
              if (popup.closed !== false) { // Opera compatibility
                frame.communicate({
                  request_id: requestId,
                  merchant_uid: merchantUid,
                  imp_uid: impUid,
                  result: "check.closing",
                });

                return null; //break infinite setTimeout
              }

              return setTimeout(function () {
                detectSelfClosed(popup);
              }, 50);
            }

            detectSelfClosed(popup);
          });
        } else if (proxyData.pgProvider === "smartro") {
          var smartro = Smartro.instance();
          smartro.impUid = proxyData.param.impUid;

          form.submit();
        } else if (proxyData.pgProvider === "tosspay") {
          var tosspay = Tosspay.instance();
          if (tosspay) { //popup open 오픈으로 객체가 생성된 경우에만
            tosspay.impUid = proxyData.param.impUid;
          }

          form.submit();

          //Safari 뒤로가기로 재진입했을 때 div 가 살아있어 흰화면으로 보이는 증상 제거(safari가 DOM 복원을 하므로 frame.close() 후에 결제프로세스를 진행시켜야 함)
          if (
            UserAgent.mobile() &&
            (proxyData.target == "_top" || proxyData.target == "_self")
          ) {
            frame.close();
          }
        } else if (proxyData.pgProvider === "kcp_quick") {
          var kcpQuick = KcpQuick.instance();

          if (UserAgent.mobile()) {
            jQuery.getScript(proxyData.custom.sdk, function () {
              KCP_QPay_Execute(form);
            });
          } else {
            kcpQuick.impUid = proxyData.param.ordr_idxx;

            form.submit();
          }
        } else if (proxyData.pgProvider === "tosspayments") {
          var script = document.createElement("script");
          frame.dialog.append(script);
          script.onload = function () {
            var tossPayments = TossPayments(proxyData.pgExtKey);
            if (proxyData.action == "ACTION_ISSUE_BILLKEY") {
              // 빌링키 발급
              tossPayments
                .requestBillingAuth(proxyData.payMethod, proxyData.params)
                .catch(function (error) {
                  var failReason =
                    "토스페이먼츠 창 렌더링에 실패하였습니다. [" +
                    error.code +
                    "] " +
                    error.message;
                  frame.communicate({
                    result: "failRedirect",
                    paymentId: proxyData.paymentId,
                    impUid: proxyData.impUid,
                    failReason: failReason,
                  });
                });
            }
          };
          script.src = "https://js.tosspayments.com/v1";
        } else {
          form.addEventListener("submit", function () {
            jQuery(container).remove();
          });
          form.submit();

          //Safari 뒤로가기로 재진입했을 때 div 가 살아있어 흰화면으로 보이는 증상 제거(safari가 DOM 복원을 하므로 frame.close() 후에 결제프로세스를 진행시켜야 함)
          if (
            UserAgent.mobile() &&
            (proxyData.target == "_top" || proxyData.target == "_self")
          ) {
            frame.close();
          }
        }
      }

      return _getter;
    })();

    //Frames 정의
    function Frames(dialog) {
      this.dialog = dialog;
      this.frames = {};
      this.modalPopup = null;
    }

    Frames.prototype.setting = function (options) {
      this.user_type = options.user_type;
      this.user_code = options.user_code;
      this.tier_code = options.tier_code;
    };

    Frames.prototype.create = function (setting, callback) {
      // provider, pg_id, callback, is_default

      function remove(key) {
        var f = this.frames[key];
        if (!f) return;

        jQuery(f.iframe).remove(); //detached from DOM
        delete this.frames[key];
      }

      function classes(setting) {
        // is_default, provider
        var cls = ["imp-frame"];

        if (UserAgent.mobile()) {
          cls.push("imp-frame-mobile");
        } else {
          cls.push("imp-frame-pc");
        }

        if (setting.is_default) {
          cls.push("imp-frame-default");
        }

        if (setting.provider) {
          if (setting.type == "payment") {
            cls.push("imp-frame-" + setting.provider);
          } else {
            cls.push("imp-frame-" + setting.provider + "-certification");
          }
        }

        return cls;
      }

      var key = setting.is_default
        ? DEFAULT_KEY
        : this._key(setting.provider, setting.pg_id, setting.type);
      if (this.frames[key]) remove.call(this, key);

      var that = this,
        $iframe = jQuery(
          '<iframe src="about:blank" width="100%" height="100%" frameborder="0"/>',
        ).css({
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          width: "100%",
          height: "100%", //width, height:auto가 기본 css인 곳에가면 full-size로 보이지 않음(2017-06-27)
        }), //INICIS에서 name 속성을 주면 flash 결제가 안됨
        path = this.path(setting);

      //css 적용
      $iframe.addClass(classes(setting).join(" "));

      this.frames[key] = {
        iframe: $iframe[0],
        loaded: false,
        key: key,
        provider: setting.provider,
        pg_id: setting.pg_id,
        type: setting.type,
        path: path,
      };

      //attach & set url
      this.dialog.append($iframe);
      $iframe
        .bind("load", function () {
          that.frames[key].loaded = true;

          if (UserAgent.mobile()) {
            function syncHeight() {
              if (that.dialog.attr("data-height-sync") === "yes") return false;

              if (that.dialog.height() < $iframe.height()) {
                that.dialog.css({
                  "overflow-y": "scroll",
                  "-webkit-overflow-scrolling": "touch",
                }).attr("data-height-sync", "yes");

                $iframe.css("min-height", $iframe.height());
              }

              setTimeout(syncHeight, 200);
            }

            syncHeight();
          }

          //trigger callback
          if (typeof callback == "function") callback.call(XDM, key);
        })
        .attr("src", path);

      return this.frames[key];
    };

    Frames.prototype.createCloseBtn = function () {
      var that = this;
      var close = jQuery('<span class="imp-close"></span>').click(function () {
        var danalCert = DANALCERT.instance();
        danalCert.close();
      });

      this.dialog.append(
        jQuery('<div class="imp-header"></div>').append(close),
      );
    };

    Frames.prototype.find = function (provider_with_id, action_pre) {
      function match(f, provider, pg_id, action) {
        return f.provider === provider && (!pg_id || f.pg_id === pg_id) &&
          f.type == action;
      }

      var provider = provider_with_id,
        pg_id = null,
        action = action_pre;
      if (provider_with_id) {
        var idx = provider_with_id.indexOf(".");
        if (idx > 0) {
          provider = provider_with_id.substring(0, idx);
          pg_id = provider_with_id.substring(idx + 1);
        }
      }

      // 네이버페이 주문형 찜인 경우엔 action이 payment인 dialog를 사용함
      if (action == "zzim") {
        action = "payment";
      }

      var f = this.frames[this._key(provider, pg_id, action)];
      if (f && f.type == action) return f;

      // 1.1.2(bugfix from 1.1.1) default의 정보를 우선적으로 비교한다.
      f = this.frames[DEFAULT_KEY];
      if (match(f, provider, pg_id, action)) return f;

      //[since 1.1.1] pg_id는 null일 수 있어서 key에 정확히 매치되지 않은 경우 provider가 같은 것을 한 번 더 찾는다.
      for (var k in this.frames) {
        f = this.frames[k];
        if (match(f, provider, pg_id, action)) return f;
      }

      //fallback mode 시작
      //type만 같으면 반환. 그래도 default에 우선순위를 두고 반환
      if (this.frames[DEFAULT_KEY].type == action) {
        return this.frames[DEFAULT_KEY];
      }

      //type만 같은지 체크
      for (var k in this.frames) {
        f = this.frames[k];
        if (f.type == action) return f;
      }

      return this.frames[DEFAULT_KEY]; //default는 반드시 존재해야함
    };

    Frames.prototype._key = function (provider, pg_id, action) {
      if (!provider) return DEFAULT_KEY;

      var key = action + "." + provider;
      if (pg_id) return key + "." + pg_id;

      return key; //provider값이 inicis.INIpayTest와 같을 수도 있음
    };

    Frames.prototype.path = function (setting) {
      // provider, pg_id, is_default
      var segment = setting.type === "certification"
        ? "/certificates/ready/"
        : "/payments/ready/";
      var path = api_server + segment + this.user_code;

      if (!setting.is_default && setting.provider) {
        path = path + "/" + setting.provider;

        if (setting.pg_id) path = path + "/" + setting.pg_id;
      }

      if (this.isAgency()) path = path + "?tier=" + this.tier_code;

      return path;
    };

    Frames.prototype.focus = function (frm) {
      for (var k in this.frames) {
        var $ifr = jQuery(this.frames[k].iframe);
        if (this.frames[k] == frm) {
          $ifr.show();
        } else {
          $ifr.hide();
        }
      }
    };

    Frames.prototype.open = function (frm, data) {
      //mobile에서 iframe이 아니라 redirect되는 방식이라 하더라도 어차피 unload되므로 $dialog.show()가 PC/모바일 모두 보여져도 괜찮다.
      var uaClass = UserAgent.mobile() ? "mobile" : "pc";
      this.dialog.show();
      this.dialog.removeClass().addClass("imp-dialog customizable").addClass(
        frm.type + "-" + frm.provider,
      ).addClass(uaClass);

      if (!!data.popup && frm.type == "certification") {
        this.dialog.addClass("popup"); //다날 본인인증 popup 모드면 하얀 바탕 보여주지 않도록(TODO : Frames.communicate()가 visible iframe을 기반으로 처리하고 있어서 문제가 있음)
      }

      //ios scroll patch(android에서도 fixed가 튕기는 것 방지)
      if (UserAgent.mobile()) {
        jQuery(document.body).addClass("imp-payment-progress");

        //1.1.6 : iOS position fixed 문제
        if (UserAgent.iphone() || UserAgent.ipad()) this.dialog.addClass("ios");

        this.dialog.css({
          "overflow-y": "",
          "-webkit-overflow-scrolling": "",
        }).removeAttr("data-height-sync");

        jQuery(frm).css("min-height", "");
      }
    };

    Frames.prototype.close = function () {
      //hide dialog
      this.dialog.hide();

      //ios scroll patch
      if (UserAgent.mobile()) {
        jQuery(document.body).removeClass("imp-payment-progress");

        this.dialog.css({
          "overflow-y": "",
          "-webkit-overflow-scrolling": "",
        }).removeAttr("data-height-sync");

        for (var k in this.frames) {
          var $ifr = jQuery(this.frames[k].iframe);
          $ifr.css("min-height", "");
        }
      }
    };

    Frames.prototype.communicate = function (message) {
      for (var k in this.frames) {
        var $ifr = jQuery(this.frames[k].iframe);
        if ($ifr.is(":visible")) { //TODO : visible만으로 통신할 대상으로 판단하는 것은 위험하다
          var msg = {
              action: "communicate",
              data: message,
              from: "iamport-sdk",
              version: "1.2.0",
            },
            obj = JSON.stringify(msg); //받는 쪽에서 parse하므로 string이라도 stringify해서 넘김

          if (UserAgent.ie() == 8 || UserAgent.ieCompatibilityMode()) {
            (function (_ifr) {
              setTimeout(function () {
                _ifr[0].contentWindow.postMessage(obj, api_server);
              }, 0);
            })($ifr);
          } else {
            $ifr[0].contentWindow.postMessage(obj, api_server);
          }
        }
      }
    };

    //Iframe을 강제로 redirect시키는 용도
    Frames.prototype.redirect = function (url) {
      for (var k in this.frames) {
        var $ifr = jQuery(this.frames[k].iframe);
        if ($ifr.is(":visible")) { //TODO : visible만으로 통신할 대상으로 판단하는 것은 위험하다
          $ifr.attr("src", url);
        }
      }
    };

    Frames.prototype.refresh = function () {
      reserved_request = null;
      for (var k in this.frames) {
        var f = this.frames[k];
        f.loaded = false;
        jQuery(f.iframe).show().attr("src", f.path);
      }
    };

    Frames.prototype.reload = function () {
      var settings = {
        "user_type": this.user_type,
        "user_code": this.user_code,
      };
      if (this.tier_code) settings.tier_code = this.tier_code;

      _XDM.init(settings);
    };

    Frames.prototype.load = function (callback) {
      var that = this,
        path = "/users/pg/" + this.user_code + "?callback=?";

      if (this.isAgency()) path = path + "&tier=" + this.tier_code;

      /**
       * BUGFIX(2016-07-13) : Frames.prototype.initialized()가 frame이 하나라도 있으면 true를 반환하도록 설계됨.
       * getJSON 응답이 늦어지는 경우 default frame이 먼저 IMP.request_pay()에 반응을 한 상태인데,
       * 뒤늦게 getJSON응답으로 overwrite해버리면 하얀화면만 나타나는 버그가 있을 수 있음.
       *
       * //getJSON에 실패할 수도 있으니까 default를 미리 하나 넣어둠. getJSON에 성공하면 overwrite되도록 변경
       * that.create(settings, callback);
       */

      jQuery.ajax({
        type: "GET",
        url: api_server + path,
        dataType: "json",
        async: false, //inicis디자인 수정 후 isp안열리는 버그 수정
        success: function (r) {
          if (r.code == 0 && r.data.length > 0) { //has pg info. 정상적인 경우면 length > 0
            jQuery.each(r.data, function (idx, obj) {
              that.create({
                provider: obj.pg_provider,
                pg_id: obj.pg_id,
                type: obj.type,
                is_default: idx == 0,
              }, callback); //0번째가 default
            });
          } else {
            that.create({
              provider: null,
              pg_id: null,
              type: "payment",
              is_default: true,
            }, callback);
          }

          //close button
          that.createCloseBtn();
        },
      });

      // jQuery.getJSON(api_server + path, function(r) { //getJSON이 끝나야 initialize가 된것으로 본다. getJSON에서 시간이 오래 걸리면 항상 default만 불릴 수 있다.
      // 	if ( r.code == 0 && r.data.length > 0 ) { //has pg info. 정상적인 경우면 length > 0
      // 		jQuery.each(r.data, function(idx, obj) {
      // 			that.create({
      // 				provider: obj.pg_provider,
      // 				pg_id: obj.pg_id,
      // 				type: obj.type,
      // 				is_default: idx==0
      // 			}, callback); //0번째가 default
      // 		});
      // 	} else {
      // 		that.create({
      // 			provider: null,
      // 			pg_id: null,
      // 			type: 'payment',
      // 			is_default: true
      // 		}, callback);
      // 	}

      // 	//close button
      // 	that.createCloseBtn();
      // });
    };

    Frames.prototype.clear = function () {
      //IMP.init이 새로 호출되면 기존 것들을 모두 clear해줘야한다.
      for (var k in this.frames) {
        jQuery(this.frames[k].iframe).remove(); //detach from DOM and clear load event handler
      }
      //혹시 모르니 한 번더 삭제...
      this.dialog.empty();

      this.frames = {};
    };

    Frames.prototype.initialized = function () {
      //모든 frame이 생성된 시점이어야 한다.(frames가 빈 객체가 아니면 true)
      for (var prop in this.frames) {
        if (this.frames.hasOwnProperty(prop)) return true;
      }

      return false;
    };

    Frames.prototype.isAgency = function () {
      return this.user_type === "agency" && typeof this.tier_code == "string";
    };

    var _XDM = {
      init: function (param) {
        jQuery(document).ready(function ($) { //dom ready상태가 되기 전에 init이 호출된 경우도 있을 수 있다.
          var frm = getFrameInst();

          frm.clear();
          frm.setting(param);
          frm.load(function (pg_key) { //load될 때마다 계속 불려짐
            if (reserved_request) {
              var req_provider = reserved_request.data.pg,
                f = frm.find(req_provider, reserved_request.action);

              if (f.key == pg_key) {
                this.request(
                  reserved_request.action,
                  reserved_request.data,
                  reserved_request.callback,
                );
              }
            }
          });
        });
      },
      request: function (action, data, callback) {
        jQuery(document).ready(function ($) { //dom ready상태가 되기 전에 호출된 경우도 있을 수 있다. ready handler를 차례대로 등록해 실행 순서를 보장
          try {
            var frm = getFrameInst();
            if (!frm.user_code) {
              return alert(
                "판매자 코드가 설정되지 않았습니다. IMP.init()함수를 먼저 호출하세요.",
              );
            }

            //since 1.1.5 : default callback
            //모바일 결제 시 callback등록하지 않으면 m_redirect_url로 보냄
            if (UserAgent.mobile() && typeof callback != "function") {
              defaultCallback = function (rsp) {
                if (!rsp.success) {
                  if (data.m_redirect_url) {
                    var q = {
                      imp_uid: rsp.imp_uid,
                      merchant_uid: rsp.merchant_uid,
                      imp_success: "false",
                      error_msg: rsp.error_msg,
                    };

                    location.href = encodeURI(
                      Util.injectQuery(data.m_redirect_url, q),
                    );
                  } else {
                    var q = {
                      imp_uid: rsp.imp_uid,
                      success: "false",
                      error_msg: rsp.error_msg,
                    };

                    location.href = encodeURI(
                      Util.injectQuery(api_server + "/payments/fail", q),
                    );
                  }
                }
              };

              callback = defaultCallback;
            }

            if (!frm.initialized()) {
              return reserved_request = {
                action: action,
                data: data,
                callback: callback,
              };
            }

            var req_provider = data.pg;

            var f = frm.find(req_provider, action); //항상 결과가 있다(없으면 default를 보내줌)

            // 네이버페이 주문형 찜은 payment type의 frame을 사용하므로 검사에서 제외
            if (action !== "zzim" && action !== f.type) {
              // [2021-12-06] 등록 된 PG모듈 정보와 호출하려는 PG모듈 정보가 일치하지 않을때 return만 하고 아무런 동작도 하지 않는 이슈 해결
              reserved_request = null;
              frm.close();
              frm.reload();

              var error_msg =
                "등록되지 않은 PG모듈 정보입니다. 아임포트 관리자페이지에서 PG모듈 정보를 설정하신 후 다시 시도해주세요.";
              if (typeof callback == "function") {
                callback({
                  imp_success: false,
                  imp_uid: null,
                  merchant_uid: data.merchant_uid,
                  error_coe: "F1001",
                  error_msg: error_msg,
                });
              } else {
                alert(error_msg);
              }
              return; //[2019-09-25]find함수 내부에서 match되는 것을 찾는데 실패했을 때, default 를 반환하게 되는데 not null임을 강조하기 위해 type이 맞지 않는 것을 줄 수도 있다.
            }

            if (f.loaded) {
              reserved_request = null;

              //focus ( 여러 개의 iframe이 겹쳐져서 보여진다. )
              frm.focus(f);

              //default
              if (!data.merchant_uid) {
                data.merchant_uid = "nobody_" + new Date().getTime();
              }

              if (!data.pay_method) {
                data.pay_method = "card";
              }

              var request_id = "req_" + new Date().getTime();
              data.request_id = request_id;

              if (typeof callback == "function") {
                sent_queue.push({ request_id: request_id, callback: callback });
              }

              //tier setting
              data.tier_code = frm.tier_code;

              if (action == "certification") {
                if (f.provider == "danal") {
                  var danalCert = DANALCERT.init(frm);
                  danalCert.open(
                    data.request_id,
                    data.merchant_uid,
                    data.popup,
                  );
                } else if (f.provider == "inicis") {
                  var inicisCert = INICISCERT.init(frm);
                  inicisCert.open(
                    data.request_id,
                    data.merchant_uid,
                    data.popup,
                  );
                } else if (f.provider == "inicis_unified") {
                  var inicisUnifiedCert = INICISUNIFIEDCERT.init(frm);
                  inicisUnifiedCert.open(
                    data.request_id,
                    data.merchant_uid,
                    data.popup,
                  );
                }
              } else if (action == "zzim") {
                if (f.provider == "naverco") {
                  var naverZzim = NAVERZZIM.init(frm);
                  naverZzim.open(data.request_id, data.merchant_uid);
                } else {
                  alert("네이버페이 주문형으로 다시 시도해주세요.");
                  frm.close();
                  frm.reload();
                  return;
                }
              } else { //payment
                //payco 팝업 블럭 회피
                if (f.provider === "payco" && !UserAgent.mobile()) {
                  var payco = PAYCO.init(frm);
                  payco.open(data.request_id, data.merchant_uid);
                } else if (f.provider == "shinhan" && !UserAgent.mobile()) {
                  //shinhan 팝업 블럭 회피
                  var shinhan = SHINHAN.init(frm);
                  shinhan.open(data.request_id, data.merchant_uid);
                } else if (f.provider == "kcp" && UserAgent.mobile()) {
                  self.name = "tar_opener";
                } else if (f.provider == "naverco") {
                  var naverco = NAVERCO.init(frm);
                  naverco.open(data.request_id, data.merchant_uid, data.popup);
                } else if (f.provider == "naverpay") {
                  //IE8이면 SDK모드로 진입하지 못하도록
                  if (UserAgent.ie() == 8) data.naverV2 = false;

                  var naverpay = NAVERPAY.init(frm);
                  naverpay.open(
                    data.request_id,
                    data.merchant_uid,
                    data.naverPopupMode,
                    data.naverV2,
                  );
                } else if (f.provider == "paypal") {
                  var paypalModal = PAYPALMODAL.init(frm);
                  paypalModal.open(
                    data.request_id,
                    data.merchant_uid,
                    data.popup,
                  );
                } else if (f.provider == "settle" && !UserAgent.mobile()) {
                  var settleModal = SETTLEBANK.init(frm);
                  settleModal.open(data.request_id, data.merchant_uid);
                } else if (f.provider == "eximbay") {
                  //eximbay 팝업 블럭 회피
                  var eximbay = EXIMBAY.init(frm);
                  eximbay.open(data.request_id, data.merchant_uid, data.popup);
                } else if (f.provider == "settle_firm") {
                  var settleFirm = SettleFirm.init(frm);
                  settleFirm.open(
                    data.request_id,
                    data.merchant_uid,
                    data.popup,
                    f,
                  );
                } else if (f.provider == "chai") {
                  var chaiPay = ChaiPay.init(frm);
                  chaiPay.open(data.request_id, data.merchant_uid, data.popup);
                } else if (f.provider == "smartro" && !UserAgent.mobile()) {
                  var smartro = Smartro.init(frm);
                  smartro.open(data.request_id, data.merchant_uid, data.popup);
                } else if (f.provider == "tosspay" && !UserAgent.mobile()) {
                  var tosspay = Tosspay.init(frm);
                  tosspay.open(data.request_id, data.merchant_uid);
                } else if (f.provider == "kcp_quick" && !UserAgent.mobile()) {
                  var kcpQuick = KcpQuick.init(frm);
                  kcpQuick.open(data.request_id, data.merchant_uid);
                } else if (f.provider == "daou") {
                  var daou = Daou.init(frm);
                  if (!UserAgent.mobile()) {
                    daou.open(data.request_id, data.merchant_uid);
                  }
                }
              }

              //var origin = window.location.protocol + '//' + window.location.host;
              var msg = {
                action: action,
                data: data,
                origin: location.href,
                from: "iamport-sdk",
                version: "1.2.0",
              };
              var obj = JSON.stringify(msg); //받는 쪽에서 parse하므로 string이라도 stringify해서 넘김

              if (UserAgent.ie() == 8 || UserAgent.ieCompatibilityMode()) {
                setTimeout(function () {
                  f.iframe.contentWindow.postMessage(obj, api_server);
                }, 0);
              } else {
                f.iframe.contentWindow.postMessage(obj, api_server);
              }

              frm.open(f, data);
            } else {
              reserved_request = {
                action: action,
                data: data,
                callback: callback,
              };
            }
          } catch (e) {
            alert(
              "결제모듈 구동 중에 오류가 발생하였습니다. 페이지 새로고침 후 다시 시도해주세요.\n" +
                e.description,
            );
            frm.close();
            frm.reload(); // frm.refresh();
          }
        });
      },
      communicate: function (message) {
        jQuery(document).ready(function ($) {
          var frm = getFrameInst();
          if (!frm.initialized()) return;

          frm.communicate(message);
        });
      },
      close: function () {
        jQuery(document).ready(function ($) {
          var frm = getFrameInst();
          if (!frm.initialized()) return;

          // 팝업 형식의 PG사 close
          var frames = frm.frames;
          for (var k in frames) {
            var $ifr = jQuery(frames[k].iframe);
            if ($ifr.is(":visible")) {
              var classLists = $ifr[0].classList.value;

              if (classLists.indexOf("naverpay") !== -1) {
                NAVERPAY.instance().close();
              } else if (classLists.indexOf("payco") !== -1) {
                PAYCO.instance().close();
              } else {
                frm.close();
                frm.reload();
              }
            }
          }
        });
      },
      payport: function (data, callback) {
        jQuery(document).ready(function ($) {
          var frm = getFrameInst();

          // IMP.payport 파라미터 유효성 검사
          function checkParameters(props) {
            var action = props.action;
            var authData = props.authData;
            var paymentData = props.paymentData;
            // authData
            if (authData === undefined) {
              return {
                isValid: false,
                errorMsg: "인증 데이터(authData)는 필수 입력입니다",
              };
            }
            var userCode = authData.userCode;
            var uid = authData.uid;
            var usecret = authData.usecret;
            if (!userCode || !uid || !usecret) {
              return {
                isValid: false,
                errorMsg:
                  "가맹점 식별코드(userCode), 구매자 아이디(uid), 구매자 시크릿(usecret)은 필수 입력입니다",
              };
            }
            // paymentData
            if (action !== "manage") {
              if (paymentData === undefined) {
                return {
                  isValid: false,
                  errorMsg: "결제 데이터(paymentData)는 필수 입력입니다",
                };
              }
              var amount = paymentData.amount;
              var merchantUid = paymentData.merchantUid;
              var orderName = paymentData.orderName;
              var buyerEmail = paymentData.buyerEmail;
              var buyerTel = paymentData.buyerTel;
              if (!amount) {
                return {
                  isValid: false,
                  errorMsg: "결제 금액(amount)은 필수 입력입니다",
                };
              }
              if (!merchantUid) {
                return {
                  isValid: false,
                  errorMsg: "주문 번호(merchantUid)는 필수 입력입니다",
                };
              }
              if (!orderName) {
                return {
                  isValid: false,
                  errorMsg: "주문명(orderName)은 필수 입력입니다",
                };
              }
              if (!buyerEmail || !buyerTel) {
                return {
                  isValid: false,
                  errorMsg:
                    "구매자 이메일(buyerEmail), 구매자 연락처(buyerTel)는 필수 입력입니다",
                };
              }
            }
            return { isValid: true, errorMsg: "" };
          }

          //payport 전용 iframe 생성
          var payportIframeWrapper = document.createElement("div");
          payportIframeWrapper.id = "payport-iframe-wrapper";
          payportIframeWrapper.style.position = "fixed";
          payportIframeWrapper.style.top = "0";
          payportIframeWrapper.style.bottom = "0";
          payportIframeWrapper.style.left = "0";
          payportIframeWrapper.style.right = "0";
          payportIframeWrapper.style.width = "100%";
          payportIframeWrapper.style.height = "100%";
          payportIframeWrapper.style.zIndex = "99999";
          payportIframeWrapper.style.background = "rgba(0, 0, 0, 0.3)";
          payportIframeWrapper.style.display = "none";

          var payportIframe = document.createElement("iframe");
          payportIframe.id = "payport-iframe";
          payportIframe.frameBorder = "0";

          if (UserAgent.mobile()) {
            payportIframe.width = "100%";
            payportIframe.height = "100%";
            payportIframe.style.position = "absolute";
            payportIframe.style.left = "0";
            payportIframe.style.top = "0";
            payportIframe.style.right = "0";
            payportIframe.style.bottom = "0";
          } else {
            payportIframe.width = "800px";
            payportIframe.height = "600px";
            payportIframe.style.position = "absolute";
            payportIframe.style.left = "50%";
            payportIframe.style.marginLeft = "-400px";
            payportIframe.style.top = "50%";
            payportIframe.style.marginTop = "-300px";
            payportIframe.style.borderRadius = "5px";
          }

          // 파라미터 유효성 검사
          var validInfo = checkParameters(data);
          var isValid = validInfo.isValid;
          var errorMsg = validInfo.errorMsg;
          if (!isValid) {
            if (typeof callback == "function") {
              callback.call({}, { impSuccess: false, errorMsg: errorMsg });
            }
            return;
          }
          // push callback function into sent_queue
          if (typeof callback == "function") {
            sent_queue.push({
              request_id: requestIdForPayport,
              callback: callback,
            });
          }

          // 유효성 검사에 통과한 경우
          payportIframeWrapper.style.display = "block";

          jQuery(payportIframe).bind("load", function () {
            // payport로 postMessage 전송
            var payload = JSON.stringify({
              action: data.action,
              authData: data.authData,
              paymentData: data.paymentData,
              from: "iamport-sdk",
            });
            payportIframe.contentWindow.postMessage(
              payload,
              payportFrontDomain,
            );
          }).attr("src", payportFrontDomain);

          payportIframeWrapper.appendChild(payportIframe);
          frm.dialog.append(payportIframeWrapper);

          frm.dialog.show();
        });
      },
    };

    return _XDM;
  }).call({}, window);

  externalInterface.init = function (user_code) {
    XDM.init({
      "user_type": "normal",
      "user_code": user_code,
    });
  };

  externalInterface.agency = function (user_code, tier_code) {
    XDM.init({
      "user_type": "agency",
      "user_code": user_code,
      "tier_code": tier_code,
    });
  };

  externalInterface.request_pay = function (data, callback) {
    if (typeof data == "undefined") {
      alert("결제요청 파라메터가 누락되었습니다.");
      return false;
    }

    XDM.request("payment", data, callback);
  };

  externalInterface.communicate = function (message) {
    XDM.communicate(message);
  };

  externalInterface.close = function () {
    XDM.close();
  };

  externalInterface.payport = function (data, callback) {
    XDM.payport(data, callback);
  };

  externalInterface.certification = function (data, callback) {
    if (typeof data == "undefined") {
      alert("결제요청 파라메터가 누락되었습니다.");
      return false;
    }

    XDM.request("certification", data, callback);
  };

  externalInterface.naver_zzim = function (data) {
    data.pg = data.pg || "naverco"; //naverco를 2개 이상 쓰는 경우는 직접 파라메터로 지정하게끔
    XDM.request("zzim", data);
  };
}).call({}, window);
