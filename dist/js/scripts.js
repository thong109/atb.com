(() => {
  const mobileBreak = 767.98;
  const mobileXSBreak = 375;
  const tabletBreak = 1024;
  const pageOffsetX = window.scrollX;
  let pageOffsetY = window.scrollY;
  let isWindowFrozen = false;
  const isHeaderActive = false;

  // Base functions

  function detectBrowsers() {
    const html = $('html');
    const ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('mac') >= 0) {
      html.addClass('is-mac');
    }
    if (ua.indexOf('safari') !== -1) {
      if (ua.indexOf('chrome') > -1) {
        html.addClass('is-chrome');
      } else {
        html.addClass('is-safari');
      }
    }
    if (ua.indexOf('msie ') > -1 || ua.indexOf('trident/') > -1) {
      html.addClass('is-ie');
    }
    if (ua.indexOf('firefox') > -1) {
      html.addClass('is-firefox');
    }
    if (ua.indexOf('android') > -1) {
      html.addClass('is-android');
    }
    if (ua.match(/(iphone|ipod|ipad)/)) {
      html.addClass('is-ios');
    }
    if (ua.indexOf('edg/') > -1) {
      html.removeClass('is-chrome');
      html.addClass('is-chromium');
    }
  }

  function detectDevice() {
    const html = $('html');
    function init() {
      const viewport = $('html head meta[name="viewport"]')[0];
      const userAgent = navigator.userAgent.toLowerCase();
      const orientation = window.matchMedia('(orientation: portrait)').matches;

      // System
      if (userAgent.indexOf('mac') > -1) {
        html.addClass('is-mac is-macos');
      } else {
        html.removeClass('is-mac is-macos');
      }
      if (userAgent.match(/(iphone|ipod|ipad)/)) {
        if (userAgent.match(/iphone/)) {
          if (window.screen.width < mobileBreak && window.screen.width >= 390) {
            html.addClass('is-iphone-12');
          } else {
            html.removeClass('is-iphone-12');
          }
          if (window.screen.width < mobileBreak && window.screen.width < 390) {
            html.addClass('is-iphone-10');
          } else {
            html.removeClass('is-iphone-10');
          }
          if (window.screen.width < mobileBreak && window.screen.width < 375) {
            html.addClass('is-iphone-5');
          } else {
            html.removeClass('is-iphone-5');
          }
          html.addClass('is-iphone');
        } else {
          html.removeClass('is-iphone-12 is-iphone-10 is-iphone-5 is-iphone');
        }
        if (userAgent.match(/ipod/)) {
          html.addClass('is-ipod');
        } else {
          html.removeClass('is-ipod');
        }
        if (userAgent.match(/ipad/)) {
          html.addClass('is-ipad');
        } else {
          html.removeClass('is-ipad');
        }
        html.addClass('is-ios');
      } else {
        html.removeClass('is-phone is-ipod is-ipad is-ios');
      }
      if (userAgent.indexOf('android') > -1) {
        html.addClass('is-android');
      } else {
        html.removeClass('is-android');
      }

      // Type
      if (
        navigator.maxTouchPoints === 1 &&
        userAgent.indexOf('Mobile') === -1
      ) {
        $('html').addClass('is-emulation');
      } else {
        $('html').removeClass('is-emulation');
      }
      if (
        (html.hasClass('is-mac') ||
          html.hasClass('is-ios') ||
          html.hasClass('is-android')) &&
        navigator.maxTouchPoints &&
        navigator.maxTouchPoints >= 1
      ) {
        $('html').addClass('is-touchable');
        $('html').removeClass('is-untouchable');
      } else {
        $('html').removeClass('is-touchable');
        $('html').addClass('is-untouchable');
      }

      // Media
      if ($(window).width() < mobileBreak) {
        if (window.screen.width < mobileXSBreak) {
          viewport.setAttribute(
            'content',
            'width=' + mobileXSBreak + ', user-scalable=0'
          );
        } else {
          viewport.setAttribute(
            'content',
            'width=device-width, initial-scale=1'
          );
        }
        $('html').removeClass('is-desktop is-tablet');
        $('html').addClass('is-mobile');
      } else {
        $('html').addClass('is-desktop');
        if (
          (window.screen.width >= mobileBreak &&
            window.screen.width <= tabletBreak) ||
          (window.screen.width < mobileBreak &&
            window.screen.height >= mobileBreak &&
            !orientation)
        ) {
          $('html').addClass('is-tablet');
        } else {
          $('html').removeClass('is-tablet');
        }
        viewport.setAttribute(
          'content',
          'width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=0'
        );
        $('html').removeClass('is-mobile');
      }
    }
    $(window).on('load resize', () => {
      init();
    });
    init();
  }

  // Helper functions

  const isMobile = () => {
    return window.matchMedia(`(max-width: ${mobileBreak}px)`).matches;
  };

  const isTouchable = () => {
    return $('html').hasClass('is-touchable');
  };

  const isOutside = (event, target) => {
    const container = $(target);
    if (
      !container.is(event.target) &&
      container.has(event.target).length === 0
    ) {
      return true;
    }
    return false;
  };

  const smoothScroll = () => {
    const anchors = $('a[href*="#"]:not([href="#"])');
    const headerHeight = 0;
    const speed = 500;
    let timeout = 0;
    let position = 0;
    const triggerScroll = (context) => {
      const href =
        typeof context === 'string' ?
          context :
          '#' + $(context).attr('href').split('#')[1];
      if (!$(context).hasClass('no-scroll') && $(href).length) {
        position = $(href).offset().top - headerHeight;
        $('body, html').animate({ scrollTop: position }, speed, 'swing');
        return false;
      }
      return true;
    };
    setTimeout(() => {
      window.scroll(0, 0);
      $('html').removeClass('is-loading').addClass('is-visible');
    }, 1);
    if (window.location.hash) {
      window.scroll(0, 0);
      if (
        navigator.userAgent.indexOf('MSIE ') > -1 ||
        navigator.userAgent.indexOf('Trident/') > -1
      ) {
        timeout = 0;
      } else {
        timeout = 500;
      }
      setTimeout(() => {
        triggerScroll(window.location.hash);
      }, timeout);
    }
    anchors.on('click', (e) => triggerScroll(e.target));
  };

  // Advance functions

  window.WebFontConfig = {
    custom: {
      families: [ 'Inter:n4,n5,n6,n7' ],
      urls: [
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
      ]
    }
  };

  (() => {
    const wf = document.createElement('script');
    wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  })();

  $(() => {
    detectBrowsers();
    detectDevice();
    smoothScroll();
  });
})();
