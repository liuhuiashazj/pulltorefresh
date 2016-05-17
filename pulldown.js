//import './pulldown.less'

function getDom(selector, parent) {
    parent = parent || document;
    var obj = parent.querySelector(selector);
    return obj;
}
const scrollCls = 'scroll',
    pullDownCls = 'pullDown',
    pullDownLabelCls = 'pullDownLabel',
    pullUpCls = "pullUp",
    pullUpLabelCls = 'pullUpLabel';
/*pulldown 下拉 pullup 上拉*/
const lableUp = {
    initial: '上拉加载更多',
    suspend: '松开加载更多',
    loading: '加载中',
    complete: '加载完成'
};
const lableDown = {
    initial: '下拉刷新',
    suspend: '松开刷新',
    loading: '刷新中',
    complete: '加载'
};

function PullToRefresh(options) {
    var el, self = this;
    self.options = options;
    el = getDom(options.el);
    self.parent = el;
    this.init();
    this.bindEvents();
    return;
}
PullToRefresh.prototype = {
    init: function() {
        var self=this,
        options=this.options,
        el=this.parent;
        self.scrollObj = getDom('.' + scrollCls, el);
        if (options.down) {
            self.pullDownEl = getDom('.' + pullDownCls, el);
            self.pullDownLabel = getDom('.' + pullDownLabelCls, el);
            self.pullDownLabel.innerHTML=lableDown.initial;
            self.pullDownIcon = getDom('.pullDownIcon', el);

        }
        if (options.up) {
            self.pullUpEl = getDom('.' + pullUpCls, el);
            self.pullUpLabel = getDom('.' + pullUpLabelCls, el);
            self.pullUpLabel.innerHTML=lableUp.initial;
            self.pullUpIcon = getDom('.pullUpIcon', el);

        }

    },
    bindEvents: function() {
        var self=this,el = self.parent;
        el.addEventListener("touchstart", function(ev) {
            self.touchstart(ev);
        });
        el.addEventListener("touchmove", function(ev) {
            self.touchmove(ev);
        });
        el.addEventListener("touchend", function(ev) {
            self.touchend(ev);
        });

    },
    touchstart: function(ev) {
        var self = this;
        var touch = ev.touches[0];
        var scrollObj = self.scrollObj;
        self.pullFlag = 0;
        if (self.options.down) {
            self.pullDownEl.style.webkitTransitionDuration = "0s";
            self.pullDownEl.setAttribute("class", pullDownCls);
            self.pullDownLabel.innerHTML = lableDown.initial;

        }
        if (self.options.up) {
            self.pullUpEl.style.webkitTransitionDuration = "0s";

        }
        self.startY = touch.screenY;
        self.startPageY = scrollObj.scrollTop;
        self.maxY = scrollObj.scrollHeight - scrollObj.clientHeight;
    },
    touchmove: function(ev) {
        var self = this,
        len=this.options.pulldownLength||80,
        offsetDefault=this.options.pullupOffset||60;
        var offsetY, touch;
        touch = ev.touches[0];
        offsetY = (touch.screenY - self.startY) / 2;
        if (self.options.down && self.startPageY == 0 && offsetY > 0) {
            ev.preventDefault();
            if (offsetY > len) {
                offsetY = len;
                self.pullDownLabel.innerHTML = lableDown.suspend;
                self.pullDownEl.setAttribute("class", "pullDown flip");
                self.pullFlag = 1;
            }
            self.pullDownEl.style.height = offsetY + "px";

        } else if (self.options.up && self.startPageY >= (self.maxY - offsetDefault) && offsetY < 0) {
            ev.preventDefault();
            self.pullFlag = 2;
            self.pullUpEl.setAttribute("class", "pullUp flip");
            self.pullUpLabel.innerHTML = lableUp.suspend;


        }

    },
    touchend: function(ev) {
        var self = this;
        if (self.noMore) return;
        if (self.options.down && self.pullFlag == 1) {
            self.pullDownEl.setAttribute("class", "pullDown loading");
            self.pullDownLabel.innerHTML = lableDown.loading;
            self.options.addNew().then(function() {
                self.pullDownEl.style.webkitTransitionDuration = "0.5s";
                self.pullDownEl.style.height = 0;
                self.pullDownEl.setAttribute("class", "pullDown ok");
                self.pullDownLabel.innerHTML = lableDown.complete;
            });
        } else if (self.options.up && self.pullFlag == 2) {
            self.pullUpEl.setAttribute("class", "pullUp loading");
            self.pullUpLabel.innerHTML = lableUp.loading;
            self.options.addMore().then(function() {
                self.pullUpEl.setAttribute("class", "pullUp");
                self.pullUpLabel.innerHTML = lableUp.initial;
            });
        } else if (self.options.down) {
            self.pullDownEl.style.webkitTransitionDuration = "0.5s";
            self.pullDownEl.style.height = 0;
        }

    }
};






//export default PullToRefresh
