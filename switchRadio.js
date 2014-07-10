var closestByTag = function(el, tagName) {
    while (el && el != document) {
        var p = el.parentNode;
        if (p.tagName.toLowerCase() === tagName.toLowerCase())
            return p;
        else
            el = p;
    }
    return null;
};

var getStyleProperty = function(propName) {
    var docElemStyle, i, len, prefixed, prefixes;
    prefixes = "Webkit Moz ms Ms O".split(" ");
    docElemStyle = document.documentElement.style;
    if (!propName) {
        return;
    }
    if (typeof docElemStyle[propName] === "string") {
        return propName;
    }
    propName = propName.charAt(0).toUpperCase() + propName.slice(1);
    prefixed = void 0;
    i = 0;
    len = prefixes.length;
    while (i < len) {
        prefixed = prefixes[i] + propName;
        if (typeof docElemStyle[prefixed] === "string") {
            return prefixed;
        }
        i++;
    }
};

var transformProperty = getStyleProperty('transform');

Polymer('switch-radio', {
    valueOn: 1,
    valueOff: 0,
    publish: {
        checked: {
            value: false,
            reflect: true
        },
        disabled: {
            value: false,
            reflect: true
        },
        currentValue: ''
    },
    domReady: function() {
        var f;
        if (this.currentName) {
            this.input = document.createElement("input");
            this.input.type = 'hidden';
            this.input.name = this.currentName;
            this.input.value = this.checked ? this.valueOn : this.valueOff;

            f = closestByTag(this, 'form');
            if (f !== null)
                f.appendChild(this.input);
        }
    },
    ready: function() {
        var sr = this.$.switchRadio.style,
            sf = this.$.switchRadioFlex.style,
            sc = this.$.switchRadioChecked.style,
            su = this.$.switchRadioUnChecked.style,
            knobSize = this.$.switchRadioKnob.clientWidth,
            styleSheet,
            rules;

        this.size = Math.max(this.$.switchRadioChecked.clientWidth, this.$.switchRadioUnChecked.clientWidth);

        sc.width = su.width = this.size + 'px';
        sf.width = ((this.size * 2) + knobSize) + 'px';
        sr.width = this.size + this.$.switchRadioKnob.clientWidth + 'px';

        styleSheet = this.shadowRoot.querySelector('#switchStyle').sheet;
        rules = [
            '-webkit-transform: translate3d(' + -this.size + 'px, 0, 0)',
            'transform: translate3d(' + -this.size + 'px, 0, 0)'
        ];
        styleSheet.insertRule('.switchRadio__flex[checked] { ' + rules.join(';') + ' }', styleSheet.cssRules.length);
    },
    toogle: function() {
        this.checked = !this.checked;
    },
    trackStart: function(e) {
        e.preventTap();
    },
    track: function(e) {
        var $el = this.$.switchRadioFlex;

        this.position = Math.min(0, Math.max(-this.size, this.checked ? -this.size + e.dx : e.dx));

        $el.classList.add('dragging');
        $el.style[transformProperty] = 'translate3d(' + this.position + 'px, 0, 0)';
    },
    trackEnd: function() {
        var $switchRadioFlex = this.$.switchRadioFlex;

        this.checked = Boolean(Math.abs(this.position) > this.size / 2);

        $switchRadioFlex.classList.remove('dragging');
        $switchRadioFlex.style[transformProperty] = null;
    },
    checkedChanged: function() {
        this.currentValue = this.checked ? this.valueOn : this.valueOff;
        if (this.input)
            this.input.value = this.currentValue;
        this.setAttribute('aria-value', this.currentValue);
        this.setAttribute('aria-checked', this.checked);
        this.fire('change');
    }
});