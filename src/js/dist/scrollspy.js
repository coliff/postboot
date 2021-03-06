'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ScrollSpy = function () {
  _createClass(ScrollSpy, null, [{
    key: 'KEY',
    get: function get() {
      return 'scrollSpy';
    }
  }, {
    key: 'EVENT_KEY',
    get: function get() {
      return 'ScrollSpy';
    }
  }, {
    key: 'ClassName',
    get: function get() {
      return Object.freeze({
        ACTIVE: 'active',
        DROPDOWN_ITEM: 'dropdown-item',
        DROPDOWN_MENU: 'dropdown-menu',
        NAV_LINK: 'nav-link',
        SHOW: 'show'
      });
    }
  }, {
    key: 'Default',
    get: function get() {
      return Object.freeze({
        offset: 10,
        method: 'auto',
        target: ''
      });
    }
  }, {
    key: 'Event',
    get: function get() {
      return Object.freeze({
        ACTIVATE: ScrollSpy.EVENT_KEY + 'Activate'
      });
    }
  }, {
    key: 'OffsetMethod',
    get: function get() {
      return Object.freeze({
        OFFSET: 'offset',
        POSITION: 'position'
      });
    }
  }, {
    key: 'Selector',
    get: function get() {
      return Object.freeze({
        ACTIVE: '.active',
        DATA_SPY: '[data-spy="scroll"]',
        DROPDOWN: '.dropdown',
        DROPDOWN_ITEM: '.dropdown-item',
        DROPDOWN_MENU: '.dropdown-menu',
        DROPDOWN_TOGGLE: '.dropdown-toggle',
        DROPDOWNS: '.dropup, .dropright, .dropdown, .dropleft',
        HIDE: '.hide',
        LIST_ITEM: '.list-group-item',
        NAV_ITEM: '.nav-item',
        NAV_LINK: '.nav-link',
        NAV_LIST_GROUP: '.nav, .list-group',
        SHOW: '.show'
      });
    }
  }]);

  function ScrollSpy(element, config) {
    var _this = this;

    _classCallCheck(this, ScrollSpy);

    this.element = element;
    this.scrollElement = element.tagName === 'BODY' ? window : element;
    this.config = this.getConfig(config);
    this.target = document.querySelector(this.config.target);
    this.selector = this.config.target + ' ' + ScrollSpy.Selector.NAV_LINK + ',' + (this.config.target + ' ' + ScrollSpy.Selector.LIST_ITEM + ',') + (this.config.target + ' ' + ScrollSpy.Selector.DROPDOWN_ITEM);
    this.offsets = [];
    this.targets = [];
    this.activeTarget = null;
    this.scrollHeight = 0;

    this.scrollElement.addEventListener('scroll', function (event) {
      return _this.process(event);
    });

    this.refresh();
    this.process();
  }

  _createClass(ScrollSpy, [{
    key: 'refresh',
    value: function refresh() {
      var _this2 = this;

      var autoMethod = this.scrollElement !== this.scrollElement.window ? ScrollSpy.OffsetMethod.POSITION : ScrollSpy.OffsetMethod.OFFSET;

      var offsetMethod = this.config.method === 'auto' ? autoMethod : this.config.method;

      var offsetBase = offsetMethod === ScrollSpy.OffsetMethod.POSITION ? this.getScrollTop() : 0;

      this.offsets = [];
      this.targets = [];

      this.scrollHeight = this.getScrollHeight();

      var targets = Array.prototype.slice.call(document.querySelectorAll(this.selector));

      targets.map(function (element) {
        var target = void 0;
        var targetSelector = Util.getSelector(element);

        if (targetSelector) {
          target = document.querySelector(targetSelector);
        }

        if (target) {
          var targetBCR = target.getBoundingClientRect();
          if (targetBCR.width || targetBCR.height) {
            // todo (fat): remove sketch reliance on jQuery position/offset
            return [target[offsetMethod]().top + offsetBase, targetSelector];
          }
        }
        return null;
      }).filter(function (item) {
        return item;
      }).sort(function (a, b) {
        return a[0] - b[0];
      }).forEach(function (item) {
        _this2.offsets.push(item[0]);
        _this2.targets.push(item[1]);
      });
    }
  }, {
    key: 'getConfig',
    value: function getConfig(config) {
      config = Object.assign({}, ScrollSpy.Default, config);
      return config;
    }
  }, {
    key: 'getScrollTop',
    value: function getScrollTop() {
      return this.scrollElement === window ? this.scrollElement.pageYOffset : this.scrollElement.scrollTop;
    }
  }, {
    key: 'getScrollHeight',
    value: function getScrollHeight() {
      return this.scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    }
  }, {
    key: 'getOffsetHeight',
    value: function getOffsetHeight() {
      return this.scrollElement === window ? window.innerHeight : this.scrollElement.getBoundingClientRect().height;
    }
  }, {
    key: 'process',
    value: function process() {
      var scrollTop = this.getScrollTop() + this.config.offset;
      var scrollHeight = this.getScrollHeight();
      var maxScroll = this.config.offset + scrollHeight - this.getOffsetHeight();

      if (this.scrollHeight !== scrollHeight) {
        this.refresh();
      }

      if (scrollTop >= maxScroll) {
        var target = this.targets[this.targets.length - 1];

        if (this.activeTarget !== target) {
          this.activate(target);
        }
        return;
      }

      if (this.activeTarget && scrollTop < this.offsets[0] && this.offsets[0] > 0) {
        this.activeTarget = null;
        this.clear();
        return;
      }

      for (var i = this.offsets.length; i--;) {
        var isActiveTarget = this.activeTarget !== this.targets[i] && scrollTop >= this.offsets[i] && (this.offsets[i + 1] === undefined || scrollTop < this.offsets[i + 1]);

        if (isActiveTarget) {
          this.activate(this.targets[i]);
        }
      }
    }
  }, {
    key: 'activate',
    value: function activate(target) {
      this.activeTarget = target;

      this.clear();

      var queries = this.selector.split(',');
      queries = queries.map(function (selector) {
        return selector + '[data-target="' + target + '"],' + (selector + '[href="' + target + '"]');
      });

      var link = this.target.querySelector(queries.join(','));

      if (link.classList.contains(ScrollSpy.ClassName.DROPDOWN_ITEM)) {
        var dropdowns = link.parentAll(ScrollSpy.Selector.DROPDOWNS + ', ' + ScrollSpy.Selector.DROPDOWN_MENU, this.config.target);
        if (dropdowns.length) {
          dropdowns.forEach(function (dropdown) {
            dropdown.classList.add(ScrollSpy.ClassName.SHOW);
          });
        }
      } else if (link.classList.contains(ScrollSpy.ClassName.NAV_LINK)) {
        var items = link.parentAll(ScrollSpy.Selector.NAV_ITEM, this.config.target);
        if (items.length) {
          items.forEach(function (item) {
            item.classList.add(ScrollSpy.ClassName.SHOW);
          });
        }
      } else {
        //$link.parents(ScrollSpy.Selector.NAV_LIST_GROUP).prev(`${ScrollSpy.Selector.NAV_LINK}, ${ScrollSpy.Selector.LIST_ITEM}`).addClass(ScrollSpy.ClassName.ACTIVE)
      }
      link.classList.add(ScrollSpy.ClassName.ACTIVE);

      var activateEvent = Util.createEvent(ScrollSpy.Event.ACTIVATE, { relatedTarget: target });
      this.scrollElement.dispatchEvent(activateEvent);
    }
  }, {
    key: 'clear',
    value: function clear() {
      var active = this.target.querySelector(ScrollSpy.Selector.ACTIVE);
      if (active) {
        active.classList.remove(ScrollSpy.ClassName.ACTIVE);
        if (active.classList.contains(ScrollSpy.ClassName.NAV_LINK) || active.classList.contains(ScrollSpy.ClassName.DROPDOWN_ITEM)) {
          var items = active.parentAll(ScrollSpy.Selector.SHOW, this.config.target);
          if (items.length) {
            items.forEach(function (item) {
              item.classList.remove(ScrollSpy.ClassName.SHOW);
            });
          }
        }
      }
    }
  }], [{
    key: 'init',
    value: function init(element, options) {
      var scrollspy = null;

      if (element.hasOwnProperty(ScrollSpy.KEY)) {
        scrollspy = element[ScrollSpy.KEY];
      }

      if (!scrollspy) {
        var config = (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' && options;
        scrollspy = new ScrollSpy(element, config);
        element[ScrollSpy.KEY] = scrollspy;
      }

      return scrollspy;
    }
  }]);

  return ScrollSpy;
}();

function scrollSpy(element, config) {
  return ScrollSpy.init(element, config);
}

if (typeof PostBoot === 'undefined' || PostBoot.Event.ScrollSpy !== false) {
  document.addEventListener('DOMContentLoaded', function () {
    window.addEventListener('load', function () {
      var scrollSpys = document.querySelectorAll(ScrollSpy.Selector.DATA_SPY);
      if (scrollSpys.length) {
        scrollSpys.forEach(function (element) {
          scrollSpy(element, element.dataset);
        });
      }
    });
  });
}
