(function() {

    var sticky = function() {

        function StickyHeader(element, options) {

            this.element = element;
            this.offsetTop = options.offsetTop || 0;
            this.isFixed = false;
            this.observers = {
                'on-top': [],
                'on-origin': [],
                init: []
            }

            var _origOffsetLeft = this.element.offsetLeft;
            var _origOffsetTop = this.element.offsetTop;

            var _replacementItem = this.element.cloneNode(true);
            _replacementItem.textContent = '';


            this.on('init', (function(sticky) {
                _extendElementStyles(this.element, _replacementItem);
                _replacementItem.style.display = 'none';
                _replacementItem.style.opacity = 0;
                this.element.parentNode.insertBefore(_replacementItem, this.element);
            }).bind(this));

            this.on('on-top', (function(sticky) {
                this.element.style.position = 'fixed';
                this.element.style.zIndex = 9999;
                this.element.style.top = this.offsetTop + 'px';
                this.element.style.left = _origOffsetLeft + 'px';

                _replacementItem.style.display = 'block';
            }).bind(this));

            this.on('on-origin', (function(sticky) {
                _extendElementPosition(_replacementItem, this.element);
                _replacementItem.style.display = 'none';
            }).bind(this));


            this._emmit('init');


            window.addEventListener('scroll', _onWindowScroll.bind(this));
            window.addEventListener('resize', _onWindowResize.bind(this));
            window.addEventListener('orientationchange', _onWindowResize.bind(this));



            function _extendElementStyles(from, to) {
                _extendElementPosition(from, to);
                _extendElementSize(from, to);
            }

            function _extendElementPosition(from, to) {
                var styles = _getElementStyles(from);
                to.style.zIndex = styles.zIndex;
                to.style.position = styles.position;
                to.style.left = styles.left;
                to.style.top = styles.top;
            }

            function _extendElementSize(from, to) {
                var styles = _getElementStyles(from);
                to.style.width = styles.width;
                to.style.height = styles.height;
            }

            function _getElementStyles(elem) {
                return window.getComputedStyle ? getComputedStyle(elem, null) : elem.currentStyle;
            }

            function _onWindowScroll(event) {
                var isScrolledOriginPosition = (_origOffsetTop - this.offsetTop) < window.scrollY;
                if(!this.isFixed && isScrolledOriginPosition) {
                    this.isFixed = true;
                    this._emmit('on-top');
                } else if(this.isFixed && !isScrolledOriginPosition) {
                    this.isFixed = false;
                    this._emmit('on-origin');
                }
            }

            function _onWindowResize() {
                if(this.isFixed) {
                    _origOffsetLeft = _replacementItem.offsetLeft;
                    this.element.style.left = _origOffsetLeft + 'px';
                } else if(!this.isFixed) {
                    _origOffsetLeft = this.element.offsetLeft;
                    _origOffsetTop = this.element.offsetTop;
                }
            }
        }

        StickyHeader.prototype.setOffsetTop = function(offsetTop) {
            this.offsetTop = offsetTop;
        }

        StickyHeader.prototype.on = function(even, callback) {
            if(!this.observers[even] || typeof callback !== 'function') {
                throw new Error('Please set correct parameters');
            }
            this.observers[even].push(callback);
        };

        StickyHeader.prototype._emmit = function(event) {
            var sticky = this;
            this.observers[event].map(function(observer) {
                observer(sticky);
            })
        }

        return StickyHeader;

    };

    if (typeof module != 'undefined' && module.exports) {
        module.exports = sticky();
    } else if (typeof define == 'function') {
        define(sticky);
    } else {
        this.StickyHeader = sticky();
    }

}());
