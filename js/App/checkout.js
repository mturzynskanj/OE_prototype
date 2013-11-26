/**
 * Created by mturzynska on 11/26/13.
 */
window.$P = function() {
};
Package("apple");
apple.ComplexFormatter = Class.create(coherent.Formatter, {requiredMessage: _("error.required_value"),numbers: "0123456789",extraValidations: null,constructor: function(a) {
    this.base(a);
    this.required = this.required || false;
    if (this.invalidRegex && "exec" in this.invalidRegex) {
        this.invalidRegex = [this.invalidRegex]
    }
    if (this.validRegex && "exec" in this.validRegex) {
        this.validRegex = [this.validRegex]
    }
},valueForString: function(a) {
    if (a === "") {
        return a
    }
    if (this.numeric && this.clampValues) {
        var b = Number(a) || 0;
        if ("minValue" in this && b < this.minValue) {
            return String(this.minValue)
        }
        if ("maxValue" in this && b > this.maxValue) {
            return String(this.maxValue)
        }
    }
    return a
},isStringValid: function(g) {
    var f, h, c, k, d, a = true, m = this.invalidValueMessage, b;
    if (!g) {
        return this.required || this.numeric ? new coherent.Error({description: this.requiredMessage}) : true
    } else {
        if (this.minLength || this.maxSize) {
            h = g.length;
            c = this.minLength || 0;
            k = this.maxSize || h;
            if (h < c || h > k) {
                a = false
            }
        }
        if (a && this.numeric) {
            b = Number(g);
            if (isNaN(b) || ("minValue" in this && b < this.minValue) || ("maxValue" in this && b > this.maxValue)) {
                a = false
            }
        }
        if (a && this.invalidRegex.length) {
            d = this.invalidRegex;
            for (f = 0, h = d.length; f < h; ++f) {
                if (d[f].test(g)) {
                    a = false;
                    break
                }
            }
        }
        if (a && this.validRegex.length) {
            a = false;
            d = this.validRegex;
            for (f = 0, h = d.length; f < h; ++f) {
                if (d[f].test(g)) {
                    a = true;
                    break
                }
            }
        }
    }
    if (a) {
        return true
    }
    return new coherent.Error({description: m})
},isValidInputCharacter: function(b) {
    var a = true;
    if (this.numeric && this.numbers.indexOf(b) < 0) {
        a = false
    }
    if (this.extraValidations && this.extraValidations.indexOf(b) < 0) {
        a = false
    }
    return a
},truncateExtraBytes: function(c) {
    var f, b, d, a;
    f = $(c.id).value;
    b = f.length;
    d = this.minLength || 0;
    a = this.maxSize || b;
    if (b < d || b > a) {
        f = f.substring(0, a)
    }
    return f
}});
Package("apple");
apple.CreditCardFormatter = Class.create(coherent.Bindable, {exposedBindings: ["paymentType", "implicitPaymentType"],invalidValueMessage: _("error.invalid_value"),requiredMessage: _("error.invalid_value"),numbers: "0123456789",constructor: function(a) {
    this.base(a);
    Object.extend(this, a)
},stringForValue: function(a) {
    if (null === a || "undefined" === typeof (a)) {
        return ""
    }
    return String(a)
},valueForString: function(a) {
    return a
},isStringValid: function(b) {
    var g = true, h, f;
    if (this.originalValue && b == this.originalValue) {
        return true
    }
    if (/\D/.test(b)) {
        return new coherent.Error({description: this.invalidValueMessage})
    }
    if (!this.paymentTypes) {
        return true
    }
    if (this.bindings.paymentType && this.bindings.paymentType.value()) {
        f = this.bindings.paymentType.value();
        h = this._validatePaymentType(b, f);
        g = h.range && h.length
    } else {
        if (this.bindings.implicitPaymentType) {
            var d = this.paymentTypes.mutableKeys(), a = d.length, k = false;
            for (var c = 0; c < a; c++) {
                h = this._validatePaymentType(b, d[c]);
                if (h.range) {
                    if (h.length) {
                        g = true
                    }
                    f = d[c];
                    this.bindings.implicitPaymentType.setValue(f);
                    k = true;
                    break
                }
            }
            if (!k) {
                this.bindings.implicitPaymentType.setValue(null);
                g = false
            }
        }
    }
    if (g) {
        if (b) {
            g = f ? this._performLuhnTest(b) : true
        } else {
            g = !this.required
        }
    }
    return g ? true : new coherent.Error({description: b ? this.invalidValueMessage : this.requiredMessage})
},isValidInputCharacter: function(a) {
    return this.numbers.indexOf(a) >= 0
},_validatePaymentType: function(a, c) {
    var b = this.paymentTypes, d = {range: true,length: true}, f = c && b[c] ? b[c].cardNumber : null;
    if (!f) {
        return d
    }
    if (f.validRanges) {
        d.range = f.validRanges.reduce(function(h, g) {
            return h || a.indexOf(g) === 0
        }, false)
    }
    if (f.validLengths) {
        d.length = f.validLengths.reduce(function(h, g) {
            return h || a.length === g
        }, false)
    }
    return d
},_performLuhnTest: function(d) {
    d = d.replace(/\D/g, "");
    var a = d.length;
    var f = a % 2;
    var c = 0;
    for (var b = 0, g; b < a; b++) {
        g = d.charAt(b);
        if (b % 2 === f) {
            g = g * 2;
            if (g > 9) {
                g = g - 9
            }
        }
        c = c + parseInt(g, 10)
    }
    return (c % 10 === 0)
}});
Package("apple");
apple.LoanNumberFormatter = Class.create(coherent.Bindable, {invalidValueMessage: _("error.invalid_value"),requiredMessage: _("error.invalid_value"),numbers: "cC0123456789",constructor: function(a) {
    this.base(a);
    Object.extend(this, a)
},stringForValue: function(a) {
    if (null === a || "undefined" === typeof (a)) {
        return ""
    }
    return String(a)
},valueForString: function(a) {
    return a
},isStringValid: function(a) {
    var c = true, d, b;
    if (this.originalValue && a == this.originalValue) {
        return true
    }
    if (/\W/.test(a)) {
        return new coherent.Error({description: this.invalidValueMessage})
    }
    if (c) {
        if (a) {
            a = a.substring(1);
            c = this._performLuhnTest(a)
        } else {
            c = !this.required
        }
    }
    return c ? true : new coherent.Error({description: a ? this.invalidValueMessage : this.requiredMessage})
},isValidInputCharacter: function(a) {
    return this.numbers.indexOf(a) >= 0
},_performLuhnTest: function(d) {
    d = d.replace(/\D/g, "");
    var a = d.length;
    var f = a % 2;
    var c = 0;
    for (var b = 0, g; b < a; b++) {
        g = d.charAt(b);
        if (b % 2 === f) {
            g = g * 2;
            if (g > 9) {
                g = g - 9
            }
        }
        c = c + parseInt(g, 10)
    }
    return (c % 10 === 0)
}});
Package("apple");
apple.SecurityCodeFormatter = Class.create(coherent.Bindable, {exposedBindings: ["paymentType", "implicitPaymentType"],invalidValueMessage: _("error.invalid_value"),requiredMessage: _("error.invalid_value"),numbers: "0123456789",constructor: function(a) {
    this.base(a);
    Object.extend(this, a)
},stringForValue: function(a) {
    if (null === a || "undefined" === typeof (a)) {
        return ""
    }
    return String(a)
},valueForString: function(a) {
    return a
},isStringValid: function(a) {
    var c = false;
    if (this.originalValue && a == this.originalValue) {
        return true
    }
    if (!this.paymentTypes || !this.paymentType) {
        c = true
    } else {
        var b = this.paymentType;
        if (b in this.paymentTypes) {
            c = this._validatePaymentType(a, b)
        }
    }
    if (this.required && !a) {
        c = false
    }
    if (c) {
        return true
    }
    return new coherent.Error({description: a ? this.invalidValueMessage : this.requiredMessage})
},isValidInputCharacter: function(a) {
    return this.numbers.indexOf(a) >= 0
},_validatePaymentType: function(a, b) {
    var c = this.paymentTypes[b].securityCode;
    if (!c) {
        return true
    }
    if (a.length) {
        if ("minLength" in c && a.length < c.minLength) {
            return false
        }
        if ("maxSize" in c && a.length > c.maxSize) {
            return false
        }
    } else {
        return !c.required
    }
    return true
}});
Package("apple");
apple.CompareFieldFormatter = Class.create(coherent.Bindable, {requiredMessage: _("error.requiredMessage"),constructor: function(a) {
    this.base(a);
    Object.extend(this, a);
    this.compareThisNode = $(String(this.compareThis));
    this.compareWithNode = $(String(this.compareWith));
    this.comparisonErrorMessage = $(String(this.comparisonErrorMessage));
    this.isEdited = false;
    Event.observe(this.compareWithNode, "blur", this.observeCompareWithNode.bindAsEventListener(this));
    Event.observe(this.compareThisNode, "change", this.observeCompareThisNode.bind(this))
},stringForValue: function(a) {
    if (null === a || "undefined" === typeof (a)) {
        return ""
    }
    return String(a)
},valueForString: function(a) {
    return a
},isStringValid: function(b) {
    var a = this.compareWithNode.value;
    if ((this.compareWithNode && (compareWithNodeView = coherent.View.fromNode(this.compareWithNode)) && compareWithNodeView.validationError !== null) || a == "" || (!this.compareString(a, b))) {
        return new coherent.Error({description: b ? this.comparisonErrorMessage : this.requiredMessage})
    } else {
        return true
    }
},compareString: function(a, b) {
    if (b !== a) {
        return false
    } else {
        return true
    }
},observeCompareWithNode: function() {
    if (this.isEdited) {
        var a = coherent.View.fromNode(this.compareThisNode);
        a.validate()
    }
},observeCompareThisNode: function() {
    this.isEdited = true
},isValidInputCharacter: function(a) {
    return true
}});
Package("apple");
apple.CurrencyFormatter = Class.create(coherent.Formatter, {requiredMessage: _("error.required_value"),numbers: "0123456789",extraValidations: null,constructor: function(a) {
    this.base(a);
    this.required = this.required || false;
    if (this.invalidRegex && "exec" in this.invalidRegex) {
        this.invalidRegex = [this.invalidRegex]
    }
    if (this.validRegex && "exec" in this.validRegex) {
        this.validRegex = [this.validRegex]
    }
    this.numbers += a.validCharacters
},valueForString: function(a) {
    if (a === "") {
        return a
    }
    if (this.numeric && this.clampValues) {
        var b = Number(a) || 0;
        if ("minValue" in this && b < this.minValue) {
            return String(this.minValue)
        }
        if ("maxValue" in this && b > this.maxValue) {
            return String(this.maxValue)
        }
    }
    return a
},isStringValid: function(h) {
    var g, k, d, m, f, b = true, n = this.invalidValueMessage, c;
    if (!h) {
        return this.required || this.numeric ? new coherent.Error({description: this.requiredMessage}) : true
    } else {
        if (this.minLength || this.maxSize) {
            k = h.length;
            d = this.minLength || 0;
            m = this.maxSize || k;
            if (k < d || k > m) {
                b = false
            }
        }
        if (b && this.numeric) {
            var c = h, a;
            if (h && "unitSeparator" in this && "decimalSeparator" in this) {
                a = h.split(this.unitSeparator).join("");
                a = a.split(this.decimalSeparator).join(".");
                c = Number(a)
            }
            if (isNaN(c)) {
                b = false
            }
            if ("minValue" in this && c < this.minValue) {
                b = false;
                if ("minValueMessage" in this && this.minValueMessage) {
                    n = this.minValueMessage
                }
            }
            if ("maxValue" in this && c > this.maxValue) {
                b = false;
                if ("maxValueMessage" in this && this.maxValueMessage) {
                    n = this.maxValueMessage
                }
            }
        }
        if (b && this.invalidRegex.length) {
            f = this.invalidRegex;
            for (g = 0, k = f.length; g < k; ++g) {
                if (f[g].test(h)) {
                    b = false;
                    break
                }
            }
        }
        if (b && this.validRegex.length) {
            b = false;
            f = this.validRegex;
            for (g = 0, k = f.length; g < k; ++g) {
                if (f[g].test(h)) {
                    b = true;
                    break
                }
            }
        }
    }
    if (b) {
        return true
    }
    return new coherent.Error({description: n})
},isValidInputCharacter: function(b) {
    var a = true;
    if (this.numeric && this.numbers.indexOf(b) < 0) {
        a = false
    }
    if (this.extraValidations && this.extraValidations.indexOf(b) < 0) {
        a = false
    }
    return a
},truncateExtraBytes: function(c) {
    var f, b, d, a;
    f = $(c.id).value;
    b = f.length;
    d = this.minLength || 0;
    a = this.maxSize || b;
    if (b < d || b > a) {
        f = f.substring(0, a)
    }
    return f
}});
Package("apple.transaction");
apple.transaction.ActionField = Class.create(coherent.Responder, {exposedBindings: ["value"],validate: function() {
    var c = this.value, a;
    if (this.formatter) {
        var b = this.formatter.isStringValid(c);
        if (b !== true) {
            a = b
        }
    }
    return a || c
}});
Package("apple.transaction");
apple.transaction.TextBox = Class.create(coherent.TextField, {validate: function() {
    var a = this.viewElement();
    var d = a.value;
    var c;
    if (!a.disabled) {
        if (this.formatter) {
            var g = !!window.chrome;
            if (g && "truncateExtraBytes" in this.formatter && typeof (this.formatter.truncateExtraBytes) === "function") {
                var d = this.formatter.truncateExtraBytes(a)
            }
            var f = this.formatter.isStringValid(d);
            if (f !== true) {
                c = f;
                this.presentError(c)
            }
            var b = d;
            d = this.formatter.valueForString(d);
            if (d != a.value) {
                a.value = d
            }
        }
        if (this.bindings.value) {
            d = this.bindings.value.validateProposedValue(d);
            if (d instanceof coherent.Error) {
                c = d;
                this.presentError(d)
            }
            if (d != this.bindings.value.value()) {
                this.bindings.value.setValue(d)
            }
        }
        this.clearErrorsIfNecessary(c)
    }
    return c || d
},acceptsFirstResponder: function() {
    var a = this.viewElement(), c = this.validationError, b = "coherent_bubble_node";
    this.initialValue = a.value;
    if (c) {
        a.setAttribute("aria-invalid", "true");
        this.addAttributeValue(a, "aria-describedby", b)
    } else {
        a.setAttribute("aria-invalid", "false");
        this.removeAttributeValue(a, "aria-describedby", b)
    }
    return this.base()
},hasAttributeValue: function(c, a, b) {
    return c.getAttribute(a) && c.getAttribute(a).match(new RegExp("(\\s|^)" + b + "(\\s|$)"))
},addAttributeValue: function(d, a, c) {
    if (!this.hasAttributeValue(d, a, c)) {
        var b = d.getAttribute(a);
        if (b && b.length) {
            c = b + " " + c
        }
        d.setAttribute(a, c)
    }
},removeAttributeValue: function(d, a, c) {
    var b = new RegExp("(\\s|^)" + c + "(\\s|$)");
    var f = d.getAttribute(a);
    if (f && f.match(b)) {
        d.setAttribute(a, f.replace(b, " "));
        if (!d.getAttribute(a).length) {
            d.removeAttribute(a)
        }
    }
},observeValueChange: function(d, a, c) {
    var b = this.hasFocus;
    this.initialValue = d.newValue;
    this.hasFocus = false;
    this.base(d, a, c);
    this.clearAllErrors();
    this.hasFocus = b
},resignFirstResponder: function(b) {
    var a = this.viewElement();
    if (a && a.nodeName != "INPUT" && a.nodeName != "TEXTAREA") {
        return null
    }
    if (this.initialValue != a.value) {
        this.validate()
    }
    return this.base(b)
},valueChanged: function(a) {
    if (this.updateTimer) {
        window.clearTimeout(this.updateTimer);
        this.updateTimer = null
    }
    if (this.markerValue) {
        return
    }
    this.validate()
},willPresentError: function(b) {
    var a = this.viewElement();
    if (Element.hasClassName(a, "error-below")) {
        b.position = "below"
    }
},clearErrorsIfNecessary: function(b) {
    if (b && (b instanceof coherent.Error)) {
        return
    }
    var a = this.bindings.errorMessage;
    if (a && a.value()) {
        this.bindings.errorMessage.setValue(null)
    }
    if (this.validationError) {
        this.clearAllErrors()
    }
}});
Package("apple.transaction");
apple.transaction.CardNumber = Class.create(apple.transaction.TextBox, {__viewClassName__: "CardNumberField",exposedBindings: ["paymentType"],creditTypes: null,fieldName: "cardNumber",keypressUpdateTimeout: 0,init: function() {
    this.base();
    var a = this.viewElement(), b = this.selectAllText.bind(this), c = Event.observe;
    this.originalMaxLength = a.maxLength || null;
    c(a, "mousedown", b);
    c(a, "mouseup", b);
    c(a, "click", b);
    c(a, "focus", b);
    c(a, "keydown", b);
    c(a, "paste", this.onpaste.bind(this))
},onpaste: function(g) {
    var c = g || window.event, b = this.viewElement(), h = "maxlength", f = b.maxLength, d = /[^0-9]/g;
    function a() {
        b.value = b.value.replace(d, "").substr(0, f);
        b.maxLength = f;
        b.setAttribute(h, f);
        b.style.color = ""
    }
    b.style.color = "transparent";
    b.maxLength = 100000;
    b.removeAttribute(h);
    a.delay(10)
},observePaymentTypeChange: function(g, f, c) {
    var d = g.newValue, a = this.viewElement(), b = this.creditTypes;
    if (d && b[d]) {
        if (b[d][this.fieldName] && (b[d][this.fieldName].maxSize || b[d][this.fieldName].maximumLength)) {
            a.maxLength = b[d][this.fieldName].maxSize || b[d][this.fieldName].maximumLength
        } else {
            a.maxLength = this.originalMaxLength;
            if (!this.originalMaxLength) {
                a.removeAttribute("maxLength")
            }
        }
        if (this.fieldName != "cardNumber" && typeof (this.__oldValue) != "undefined" && this.__oldValue != d) {
            this.setMarkerValue("nullPlaceholder");
            this.clearAllErrors()
        } else {
            if (this.__oldValue && a.value) {
                this.validate.bindAndDelay(this, 0);
                this.clearAllErrors()
            }
        }
    }
    this.__oldValue = d
},selectAllText: function(c) {
    var b = c || window.event, a = this.viewElement(), f = Event, d = b.keyCode || null;
    if (/^\D/.test(a.value)) {
        switch (d) {
            case null:
            case f.KEY_UP:
            case f.KEY_DOWN:
            case f.KEY_LEFT:
            case f.KEY_RIGHT:
            case f.KEY_HOME:
            case f.KEY_END:
            case f.KEY_PAGEUP:
            case f.KEY_PAGEDOWN:
                f.stop(b);
                a.select();
                a.focus();
                break;
            default:
                break
        }
    }
}});
Package("apple.transaction");
apple.transaction.CardTypeDetector = Class.create(coherent.View, {exposedBindings: ["cardType"],__viewClassName__: "CardTypeDetector",_baseClassName: "",init: function() {
},observeCardTypeChange: function(k, h, f) {
    var g = Element.queryAll(this.viewElement(), ".card"), b, a, d = "selected", c;
    if (k.newValue) {
        a = Element.query(this.viewElement(), ".card." + k.newValue)
    }
    g.forEach(function(m) {
        Element.removeClassName(m, d)
    });
    if (a) {
        Element.addClassName(this.viewElement(), d);
        Element.addClassName(a, d)
    } else {
        Element.removeClassName(this.viewElement(), d)
    }
}});
Package("apple.transaction");
apple.transaction.CardTypeSelector = Class.create(coherent.View, {cardTypes: PartList("label"),exposedBindings: ["cardType", "errorMessage"],__viewClassName__: "CardTypeSelector",onclick: function(b) {
    var c = b.target || b.srcElement;
    var a = c.id;
    if (c.tagName !== "INPUT") {
        c = Element.locateAncestor(c, function(d) {
            return d.tagName === "LABEL"
        }, this.viewElement());
        if (!c) {
            return
        }
        c = $(c.getAttribute("for"))
    }
    if (c && this.bindings.cardType) {
        this.bindings.cardType.setValue(c.getAttribute("value"));
        this.updateBindings()
    }
},observeCardTypeChange: function(h, o, c) {
    var k = this.viewElement(), b = h.newValue, d = this.cardTypes(), a, q = "selected", n, m;
    if (this.bindings.errorMessage) {
        this.bindings.errorMessage.setValue(null)
    }
    this.clearAllErrors();
    for (var f = 0, g = d.length; f < g; f++) {
        a = d[f];
        m = $(a.getAttribute("for"));
        n = m.getAttribute("value");
        if (b == n) {
            Element.addClassName(a, q)
        } else {
            Element.removeClassName(a, q)
        }
    }
},validate: function() {
    var c, a = this.bindings.cardType ? this.bindings.cardType.value() : null, b = this.viewElement();
    if (!a && this.validations.required) {
        c = new coherent.Error({description: this.validations.requiredError})
    }
    if (c) {
        this.presentError(c);
        b.setAttribute("tabindex", -1);
        b.setAttribute("aria-describedby", this.bubble.id)
    }
    return c || a
},observeErrorMessageChange: function(b) {
    if (!b.newValue) {
        this.clearAllErrors();
        return
    }
    var a = new coherent.Error({description: b.newValue});
    this.presentError(a)
},presentError: function(a) {
    this.validationError = a;
    Element.addClassName(this.viewElement(), coherent.Style.kInvalidValueClass);
    this.showErrorBubble()
},clearAllErrors: function() {
    this.validationError = null;
    Element.removeClassName(this.viewElement(), coherent.Style.kInvalidValueClass);
    this.hideErrorBubble()
},hideErrorBubble: function() {
    var b = this.viewElement(), a = this.bubble;
    if (a && a.parentNode) {
        coherent.Animator.addClassName(a, "invisible", {callback: function() {
            b.removeChild(a)
        },easing: coherent.easing.easeInOut(250),duration: 250})
    }
},showErrorBubble: function() {
    var d = this.viewElement(), a, c, f;
    if (!this.bubble) {
        a = this.bubble = document.createElement("div");
        a.className = "bubble inline-bubble invisible";
        c = document.createElement("div");
        c.className = "container";
        f = this.bubbleContent = document.createElement("div");
        f.className = "content";
        c.appendChild(f);
        a.appendChild(c)
    }
    d.insertBefore(this.bubble, d.firstChild);
    this.bubbleContent.innerHTML = this.validationError.description;
    coherent.Animator.removeClassName(this.bubble, "invisible", {easing: coherent.easing.easeInOut(250),duration: 250})
}});
Package("apple.transaction");
apple.transaction.LoanNumber = Class.create(apple.transaction.TextBox, {__viewClassName__: "LoanNumberField",fieldName: "loanNumber",keypressUpdateTimeout: 0,init: function() {
    this.base();
    var a = this.viewElement(), b = this.selectAllText.bind(this), c = Event.observe;
    this.originalMaxLength = a.maxLength || null;
    c(a, "mousedown", b);
    c(a, "mouseup", b);
    c(a, "click", b);
    c(a, "focus", b);
    c(a, "keydown", b);
    c(a, "paste", this.onpaste.bind(this))
},onpaste: function(g) {
    var c = g || window.event, b = this.viewElement(), h = "maxlength", f = b.maxLength, d = /[^0-9Cc]/g;
    function a() {
        b.value = b.value.replace(d, "").substr(0, f);
        b.maxLength = f;
        b.setAttribute(h, f);
        b.style.color = ""
    }
    b.style.color = "transparent";
    b.maxLength = 100000;
    b.removeAttribute(h);
    a.delay(10)
},selectAllText: function(c) {
    var b = c || window.event, a = this.viewElement(), f = Event, d = b.keyCode || null;
    if (/^\D/.test(a.value)) {
        switch (d) {
            case null:
            case f.KEY_UP:
            case f.KEY_DOWN:
            case f.KEY_LEFT:
            case f.KEY_RIGHT:
            case f.KEY_HOME:
            case f.KEY_END:
            case f.KEY_PAGEUP:
            case f.KEY_PAGEDOWN:
                f.stop(b);
                a.select();
                a.focus();
                break;
            default:
                break
        }
    }
}});
Package("apple.transaction");
apple.transaction.SelectBox = Class.create(coherent.SelectField, {init: function() {
    this.resetOnDisable = this.resetOnDisable === undefined ? true : this.resetOnDisable;
    Event.observe(this.viewElement(), "change", this.onclick.bind(this));
    this.base()
},observeSelectedValueChange: function(g, k, b) {
    if (this.bindings.content && !this.bindings.content.value()) {
        return
    }
    var h = this.viewElement();
    var m = h.options;
    var f = m.length;
    var a = g.newValue;
    h.disabled = "undefined" === typeof (a) || coherent.Markers.MultipleValues === a || coherent.Markers.NoSelection === a;
    var d = [];
    a = a || (m[0] && m[0].value) || "";
    for (var c = 0; c < f; ++c) {
        if (m[c].value == a) {
            d = [c];
            break
        }
    }
    if (d.length === 0) {
        d = [0]
    }
    this.setSelectionIndexes(d)
},observeSelectedObjectChange: function(f) {
    var d = f.newValue;
    var c = this.__content || [];
    var a = c.indexOf(d);
    var b = (-1 === a ? [0] : [a]);
    this.setSelectionIndexes(b)
},observeEnabledChange: function(b) {
    if (this.resetOnDisable) {
        var a = this.bindings.selectedValue;
        if (b.newValue) {
            if (a && this.lastSelectedValue) {
                a.object.setValueForKeyPath(this.lastSelectedValue, a.keyPath)
            }
        } else {
            if (a) {
                this.lastSelectedValue = a.value()
            }
            this.clearAllErrors();
            if (this.viewElement().options && this.viewElement().options.length > 0) {
                this.setSelectionIndexes([0])
            }
        }
    }
    this.base(b)
},validate: function() {
    if (!this.validations) {
        return true
    }
    var a = this.viewElement();
    if (this.validations.required && (a.value === "" || a.value === "WONoSelectionString")) {
        var b = new coherent.Error({description: this.validations.requiredError});
        this.presentError(b);
        return b
    }
    return true
},onmousedown: function(a) {
    coherent.Bubble.hide({target: this.viewElement()})
},acceptsFirstResponder: function() {
    var a = this.viewElement(), c = this.validationError, b = "coherent_bubble_node";
    this.initialValue = a.value;
    if (c) {
        a.setAttribute("aria-invalid", "true");
        a.setAttribute("aria-describedby", b)
    } else {
        a.setAttribute("aria-invalid", "false");
        a.removeAttribute("aria-describedby")
    }
    return this.base()
},onclick: function(a) {
    if (this.validationError && this.validate() === true) {
        if (this.bindings.errorMessage) {
            this.bindings.errorMessage.setValue(null);
            this.bindings.errorMessage.update()
        }
    }
}});
Package("apple.transaction");
apple.transaction.LocalityLookupSelectBox = Class.create(apple.transaction.SelectBox, {observeSelectedValueChange: function(h, m, b) {
    var k = this.viewElement(), n = k.options, g = n.length, f = [], a = h.newValue || (n[0] && n[0].value) || "", c = this.bindings.content, d;
    if (c && !c.value()) {
        return
    }
    for (d = 0; d < g; ++d) {
        if (n[d].value === a) {
            f = [d];
            break
        }
    }
    if (f.length === 0) {
        f = [0]
    }
    this.setSelectionIndexes(f)
},observeContentChange: function(h, g, c) {
    var d = h.newValue, a = this.viewElement(), f = Math.max(a.selectedIndex, 0), b = a.options && a.options[f] && a.options[f].value;
    this.base(h, g, c);
    this.bindings.selectedValue.update();
    if (d && d[f] && d[f].value !== b) {
        this.setSelectionIndexes([0])
    }
    a.disabled = !!(d && d.length === 1)
}});
Package("apple.transaction");
apple.transaction.QuantityTextBox = (function createCartQuantityTextField() {
    var f = window.coherent, c = f.Style, b = Element, d = b.addClassName, g = "__quantityBubbleTimeout", a;
    return Class.create(f.TextField, {keypressUpdateTimeout: 0,observeValueChange: function(k) {
        var h = this.hasFocus;
        this.hasFocus = false;
        this.base(k);
        this.hasFocus = h
    },validate: function() {
        var h = this.viewElement(), m = h.value, k;
        if (this.formatter) {
            k = this.formatter.isStringValid(m);
            if (k !== true) {
                this.presentError(k);
                return k
            }
            m = this.formatter.valueForString(m)
        }
        if (!(this.bindings.errorMessage && this.bindings.errorMessage.value())) {
            this.clearAllErrors()
        }
        if (this.bindings.value) {
            m = this.bindings.value.validateProposedValue(m);
            if (m instanceof f.Error) {
                this.presentError(m);
                return m
            }
            if (m != this.bindings.value.value()) {
                if (this.updateBindingTimer) {
                    window.clearTimeout(this.updateBindingTimer)
                }
                this.updateBindingTimer = (function() {
                    this.bindings.value.setValue(m)
                }).bindAndDelay(this, 500)
            }
        }
        return m
    },observeMaxLengthChange: function(n) {
        this.base(n);
        var k = parseInt(n.newValue, 10), m = 0.66, h = this.viewElement();
        if (h.nodeName == "INPUT") {
            Element.setStyle(h, "width", (m * k) + "em")
        }
    },clearAllErrors: function() {
        this.base();
        f.Bubble.hide();
        window.clearTimeout(this[g]);
        delete this[g]
    },becomeFirstResponder: function() {
        this.validate();
        return this.base()
    },resignFirstResponder: function(k) {
        var h = this.viewElement();
        if (h.value === "") {
            this.bindings.value.update()
        }
        return this.base(k)
    },presentError: function(h) {
        var m = this;
        function k() {
            var n = m.viewElement();
            d(n, c.kInvalidValueClass);
            n.setAttribute("aria-invalid", "true");
            n.setAttribute("aria-describedby", "coherent_bubble_node");
            f.Bubble.display({target: h.field.viewElement(),dimensions: {width: 200,height: 40},error: h,classname: "box bubble"});
            delete m[g]
        }
        m.willPresentError(h);
        if (!("field" in h)) {
            h.field = m
        }
        if (m.validationError && !(m.validationError.description.toString() === h.description.toString() && a === m.viewElement())) {
            m.clearAllErrors()
        }
        a = m.viewElement();
        m.validationError = h;
        if (m.viewElement().value !== "" && typeof m[g] === "undefined") {
            m[g] = k.delay(200)
        }
    },willPresentError: function(h) {
        var m = this.viewElement().value;
        if (h && h.description && m !== "0") {
            return
        }
        h.description = _("transaction.cart.error_quantity");
        h.recoveryOptions = [_("transaction.link.remove"), _("transaction.link.cancel")];
        var k = this;
        h.recoveryAttempter = function(o, n) {
            switch (n) {
                case 0:
                    o.field.sendActionToView("removeItemViaQuantity", FIRST_RESPONDER);
                    break;
                default:
                    o.field.bindings.value.update();
                    break
            }
            o.field.clearAllErrors()
        }
    }})
})();
Package("apple");
apple.RadioGroup = Class.create(coherent.Responder, {exposedBindings: ["selection", "errorMessage"],actsLikeView: true,constructor: function(b, a) {
    var c = b.item, g = c.id, f = Element.queryAll('input[id^="' + g + '"][type="radio"]'), d;
    if (f.length) {
        this.radioParent = f[0].parentNode
    }
    this.id = g;
    this.alertId = c.alertId;
    this.validations = c.validations || {};
    this.radios = f.map(function(h) {
        return new coherent.ToggleButton(h, a, {selectionBinding: b.selectionBinding})
    }, this);
    coherent.View.viewLookup[g] = this;
    this.base(b)
},presentError: function(a) {
    var c = this.alertId, b;
    a = a ? a.description : "";
    if (c && (b = $(c))) {
        b.innerHTML = '<div class="error-content clearfix"><p class="alert">' + a + "</p></div>";
        b.style.display = ""
    } else {
        this.base(a)
    }
},clearAllErrors: function() {
    var b = this.alertId, a;
    if (b && (a = $(b))) {
        a.innerHTML = "";
        a.style.display = "none"
    }
},validate: function() {
    var b = this.validations.required;
    if (b && !this._selection) {
        var a = new coherent.Error({description: this.validations.requiredError});
        this.presentError(a);
        return a
    } else {
        return this._selection
    }
},observeSelectionChange: function(b) {
    var a = this._selection = b.newValue;
    if (a) {
        this.clearAllErrors()
    }
},observeErrorMessageChange: function(c) {
    var b = c.newValue;
    if (!b) {
        this.clearAllErrors();
        return
    }
    var a = new coherent.Error({description: c.newValue});
    this.presentError(a)
},superview: function() {
    var b = $(this.id) || this.radioParent;
    if (!b) {
        return null
    }
    var a = null;
    while (b && !a) {
        b = b.parentNode;
        if (!b) {
            return null
        }
        if (document == b) {
            return coherent.page
        }
        a = coherent.View.fromNode(b);
        if (a == this) {
            a = null
        }
    }
    return a
},teardown: function() {
    delete coherent.View.viewLookup[this.id];
    this.radios.forEach(function(a) {
        a.teardown()
    });
    this.radios = null
}});
Package("apple.transaction");
apple.transaction.SecurityCode = Class.create(apple.transaction.CardNumber, {__viewClassName__: "SecurityCodeField",fieldName: "securityCode"});
Package("apple.transaction");
apple.transaction.TextFieldMasker = Class.create(apple.transaction.CardNumber, {__viewClassName__: "TextFieldMasker",maskClassName: "input-mask",maskFullyIn: 2000,init: function(c) {
    var d = document.createElement("SPAN"), b = document.createElement("SPAN"), a = this.viewElement();
    this.base(c);
    this.maskId = Element.assignId(b);
    d.className = this.maskClassName;
    a = a.parentNode.replaceChild(d, a);
    d.appendChild(a);
    d.appendChild(b)
},observeValueChange: function(c, a, b) {
    this.base(c, a, b);
    document.getElementById(this.maskId).innerHTML = c.newValue
},onkeyup: function(a) {
    this.base(a);
    Element.addClassName($(this.maskId), coherent.Style.kEditingClass);
    this.__mask()
},onkeypress: function(a) {
    this.base(a);
    this.__mask()
},endEditing: function() {
    this.base();
    Element.removeClassName($(this.maskId), coherent.Style.kEditingClass)
},__mask: function() {
    var f = this, c = f.viewElement(), d = document.getElementById(f.maskId), a = function a(k) {
        var m = c.value || "", h = m.length, o = k > 0 ? k : (h + k), n = o > 0 ? "•".times(o) + m.slice(o, h) : m;
        d.innerHTML = n
    }, b = function b() {
        if (f.maskTimeout) {
            window.clearTimeout(f.maskTimeout);
            delete f.maskTimeout
        }
    }, g;
    b();
    a(-1);
    f.maskTimeout = a.delay(f.maskFullyIn, 0)
},presentError: function(a) {
    Element.addClassName($(this.maskId), coherent.Style.kInvalidValueClass);
    return this.base.apply(this, arguments)
},clearAllErrors: function() {
    Element.removeClassName($(this.maskId), coherent.Style.kInvalidValueClass);
    return this.base.apply(this, arguments)
}});
Package("apple.transaction");
apple.transaction.TextFieldMatcher = Class.create(apple.transaction.TextBox, {exposedBindings: ["matcherData", "selectedValue"],__viewClassName__: "TextFieldMatcher",matcherListClassName: "type-ahead",selectedClassName: "selected",valueShowMinLength: 0,showDelay: 200,closeDelay: 500,loading: false,matcherUrl: "",matcherParams: {},parentId: null,templateString: '<table><tr class="t"><td class="l"></td><td class="m"></td><td class="r"></td></tr><tr class="m"><td class="l"></td><td class="msg"><ul></ul></td><td class="r"></td></tr><tr class="b"><td class="l"></td><td class="m"></td><td class="r"></td></tr></table>',init: function(a) {
    this.base(a);
    this._setup.bindAndDelay(this, 0)
},_setup: function() {
    var c = document.createElement("DIV"), b = $(this.parentId) || document.body, a = this.viewElement(), d;
    this.matcherContainerId = Element.assignId(c);
    c.className = this.matcherListClassName;
    Element.setStyle(c, "display", "none");
    c.innerHTML = this.templateString;
    d = c.getElementsByTagName("UL")[0];
    this.matcherListId = Element.assignId(d);
    Event.observe(d, "click", this.__selectOnClick.bindAsEventListener(this));
    Event.onLoad(function() {
        b.appendChild(c)
    })
},onkeypress: function(a) {
    var b = a.keyCode;
    if (b === Event.KEY_RETURN && this.__showing) {
        Event.stop(a)
    } else {
        this.base(a)
    }
},onkeyup: function(d) {
    var g = Event, h = d.keyCode, b = d.shiftKey, a = this.viewElement(), f = a.value || "", c = false;
    if (this.hasFocus) {
        switch (h) {
            case g.KEY_UP:
            case g.KEY_DOWN:
            case g.KEY_ESC:
            case g.KEY_RETURN:
                if (this.__showing) {
                    switch (h) {
                        case g.KEY_UP:
                            this.__activatePrev();
                            break;
                        case g.KEY_DOWN:
                            this.__activateNext();
                            break;
                        case g.KEY_ESC:
                            this.__close();
                            break;
                        case g.KEY_RETURN:
                            this.__select();
                            break;
                        default:
                            break
                    }
                    Event.stop(d)
                }
                break;
            default:
                if (!Event.isMetaKey(d)) {
                    this.__close();
                    c = true
                }
                break
        }
        if (c) {
            this.__show(f)
        }
    }
    this.base(d)
},resignFirstResponder: function(a) {
    this.__clearCloseTimeout();
    this.__doCloseTimeout = this.__close.bindAndDelay(this, this.closeDelay);
    return this.base(a)
},becomeFirstResponder: function() {
    this.__clearCloseTimeout();
    return this.base()
},observeMatcherDataChange: function(c, b, a) {
    this.__changeMatcherData(c.newValue)
},observeSelectedValueChange: function(c, b, a) {
    this.__changeSelectedIndex(c.newValue)
},query: function(c) {
    var f = false;
    function b(g) {
        if (g.matches && !(g.matches.length == 1 && g.matches[0].toLowerCase() == c.toLowerCase())) {
            this.__changeMatcherData(g.matches)
        }
        this.__xhrInProcess = null
    }
    var a = this.viewElement(), d = this.matcherParams;
    d.value = c;
    this.__xhrInProcess = JSONRPC.get(this.matcherUrl, d);
    this.__xhrInProcess.addCallback(b.bind(this))
},__changeMatcherData: function(g) {
    var q = g || [], d = $(this.matcherListId), f = $(this.matcherContainerId), a = $(this.parentId) || document.body, c = Element.getRect(a), h = 0, n = "", o = this.viewElement(), m = Element.getRect(o), t = (m.left - (a !== document.body ? c.left : 0)) + "px", b = (m.bottom - (a !== document.body ? c.top : 0)) + "px", k = (m.width - 3) + "px", r = (o.value || "").length;
    d.innerHTML = "";
    if (q.length > 0) {
        for (h = 0; h < q.length; h++) {
            n += '<li><span style="display: none;">' + q[h] + "</span><strong>" + q[h].substr(0, r) + "</strong>" + q[h].substr(r, q[h].length - r) + "</li>"
        }
        d.innerHTML = n;
        for (h = 0; h < d.childNodes.length; h++) {
            Event.observe(d.childNodes[h], "mouseover", this.__changeSelectedIndex.bind(this, h))
        }
        this.__changeSelectedIndex(null);
        Element.setStyle(d, "width", k);
        Element.setStyles(f, {top: b,left: t,display: ""});
        this.__showing = true
    }
},__changeSelectedIndex: function(b) {
    var h = $(this.matcherListId), g = h.childNodes, c = (b !== null && !isNaN(b) && b < 0) ? g.length - 1 : b, f = this.__selectedIndex, a = this.selectedClassName, d = Element;
    if (f !== null && !isNaN(f)) {
        d.removeClassName(g[f], a)
    }
    if (c !== null && !isNaN(c)) {
        d.addClassName(g[c % g.length], a);
        this.__selectedIndex = (c % g.length)
    } else {
        this.__selectedIndex = c
    }
},__activatePrev: function() {
    var a = this.__selectedIndex;
    if (a === null || isNaN(a)) {
        a = 1
    }
    this.__changeSelectedIndex(a - 1)
},__activateNext: function() {
    var a = this.__selectedIndex;
    if (a === null || isNaN(a)) {
        a = -1
    }
    this.__changeSelectedIndex(a + 1)
},__select: function() {
    var a = this.__selectedIndex, c = $(this.matcherListId), b = this.viewElement();
    b.value = c.childNodes[a].firstChild.innerHTML;
    this.__close();
    this.valueChanged();
    b.focus()
},__selectOnClick: function(a) {
    Event.stop(a);
    this.__select()
},__close: function() {
    var a = $(this.matcherContainerId);
    Element.setStyle(a, "display", "none");
    this.__showing = false
},__show: function(a) {
    this.__close();
    this.__clearValueChangeTimeout();
    if (a.length > this.valueShowMinLength) {
        this.__doQueryTimeout = this.__query.bindAndDelay(this, this.showDelay, a)
    }
},__query: function(a) {
    this.query(a);
    this.__doQueryTimeout = null
},__clearValueChangeTimeout: function() {
    if (this.__doQueryTimeout) {
        window.clearTimeout(this.__doQueryTimeout)
    }
    this.__xhrInProcess = null;
    this.__doQueryTimeout = null
},__clearCloseTimeout: function() {
    if (this.__doCloseTimeout) {
        window.clearTimeout(this.__doCloseTimeout)
    }
    this._doCloseTimeout = null
}});
Package("apple.transaction");
(function createToggleGroupView() {
    var k = window.coherent, d = window.Element, r = d.query, o = d.addClassName, v = d.locateAncestor, t = window.Event, h = apple.transaction, b = "data-index-" + (new Date()).valueOf(), g = "isDelegateBusy", m = "address-list-busy", f = "didSelectToggleGroupItem", u;
    function n(w) {
        return parseInt(w, 10)
    }
    function a(w) {
        return typeof w === "number"
    }
    function q(w) {
        return typeof w !== "undefined" && w !== null
    }
    function c(w) {
        return d.hasAttribute(w, b)
    }
    h.ToggleGroup = u = Class.create(k.View, {itemSelectedClassName: "selected",itemTemplateSelector: "li",itemTemplateAspectTagName: "span",exposedBindings: ["content", "selectedIndex"],init: function() {
        var w = this.viewElement(), x = this.itemTemplateElem = w.removeChild(r(w, this.itemTemplateSelector)), y = /recentlyUsedMatch/.test(this.bindings && this.bindings.content && this.bindings.content.keyPath || "");
        this.__resetListView();
        t.observe(w, "onkeydown", this.onkeydown.bind(this));
        if (y) {
            this.delegate = this.__relativeSource
        }
    },sendToDelegate: function(x) {
        var w = this.viewElement();
        if (this.delegate) {
            this[g] = true;
            d.addClassName(w, m)
        }
        this.base(x)
    },observeContentChange: function(G, K, x) {
        var L = this.viewElement(), w = G.newValue, D = w && w.length, C, I, H, F, E, J, B, A, z, y;
        this.__resetListView(D);
        if (D) {
            E = document.createDocumentFragment();
            A = this.itemTemplateElem;
            for (z = 0; z < D; z++) {
                C = w[z] && w[z].mutableKeys && w[z].mutableKeys() || null;
                I = C && C.length;
                if (I) {
                    J = E.appendChild(A.cloneNode(false));
                    J.innerHTML = A.innerHTML;
                    J.setAttribute(b, z);
                    o(J, z % 2 ? "odd" : "even");
                    if (z === D - 1) {
                        o(J, "last")
                    }
                    this.__items[z] = d.assignId(J);
                    for (y = 0; y < I; y++) {
                        H = C[y];
                        F = w[z][H];
                        if ((B = r(J, this.itemTemplateAspectTagName + "." + H)) && q(F)) {
                            B.innerHTML = w[z][H]
                        }
                    }
                }
            }
            L.appendChild(E)
        }
    },setSelectedIndex: function(x) {
        var y = this.__items.length, w = "tabindex", A, z;
        this.selectedIndex = x = n(x);
        if (a(x)) {
            for (z = 0; z < y; z++) {
                if ((A = $(this.__items[z]))) {
                    if (z === x) {
                        o(A, this.itemSelectedClassName);
                        this.setValueForKey(A.childNodes[0].innerHTML, "selectedText");
                        try {
                            A.focus()
                        } catch (B) {
                        }
                    } else {
                        d.removeClassName(A, this.itemSelectedClassName)
                    }
                }
            }
        }
    },onkeydown: function(z) {
        var B = this.bindings && this.bindings.selectedIndex, x, y = this.selectedIndex, A, w;
        if (!this[g]) {
            switch (z.keyCode) {
                case t.KEY_UP:
                case t.KEY_DOWN:
                    A = this.__items.length;
                    switch (z.keyCode) {
                        case t.KEY_UP:
                            x = a(y) ? y > 0 ? y - 1 : y : w;
                            break;
                        case t.KEY_DOWN:
                            x = a(y) ? y < A - 1 ? y + 1 : y : 0;
                            break;
                        default:
                            break
                    }
                    this.setSelectedIndex(x);
                    break;
                case t.KEY_RETURN:
                    if (a(y)) {
                        this.sendToDelegate(f);
                        B.setValue(y);
                        B.update()
                    }
                    break;
                default:
                    break
            }
        }
    },onclick: function(w) {
        var y = !this[g] && v(w.target || w.srcElement, c, this.viewElement()), x = this.bindings && this.bindings.selectedIndex;
        if (y && x) {
            this.setSelectedIndex(y.getAttribute(b));
            this.sendToDelegate(f);
            x.setValue(this.selectedIndex);
            x.update()
        }
    },__resetListView: function(x) {
        var w = this.viewElement(), y = this.bindings && this.bindings.selectedIndex;
        if (this.delegate) {
            d.removeClassName(w, m);
            this[g] = false
        }
        w.innerHTML = "";
        this.__items = a(x) && x > 0 ? new Array(x) : [];
        if (y) {
            y.setValue(0);
            y.update()
        }
    }})
})();
Package("apple.transaction");
apple.transaction.ZipLookupSelectBox = Class.create(apple.transaction.SelectBox, {observeContentChange: function(h, a, d) {
    var b = 0, f = h.newValue;
    if (f && this.cityKeyPath) {
        var g = this.__relativeSource.valueForKeyPath(this.cityKeyPath), c = f.length;
        while (c--) {
            if (f[c].city && f[c].city === g) {
                b = c;
                break
            }
        }
    }
    this.base(h, a, d);
    this.setSelectionIndexes([b])
},setSelectionIndexes: function(d) {
    this.base(d);
    var f = this.bindings.content.value(), c = d[0], a = this.__relativeSource, b;
    if (!(f && c >= 0)) {
        return
    }
    b = f[c];
    if (c == f.length - 1 && f.length > 1) {
        a.setValueForKeyPath("cityStateFields", this.modeKeyPath);
        a.setValueForKeyPath("", this.cityKeyPath);
        a.setValueForKeyPath("", this.stateKeyPath)
    } else {
        a.setValueForKeyPath(b.city, this.cityKeyPath);
        a.setValueForKeyPath(b.state, this.stateKeyPath)
    }
}});
Package("apple.transaction");
apple.transaction.CompareField = Class.create(apple.transaction.TextBox, {init: function() {
    this.base();
    var a = this.viewElement(), b = Event.observe;
    b(a, "paste", this.onpaste.bind(this))
},onpaste: function(c) {
    var b = c || window.event, a = coherent.View.fromNode(this.viewElement());
    Event.stop(b);
    a.validate()
}});
apple.transaction.truncateEmail = Class.create(coherent.ValueTransformer, {constructor: function(a, b) {
    this.max = a;
    this.width = b
},transformedValue: function(d) {
    if (!d && 0 !== d) {
        return d
    }
    if (d.length <= this.max) {
        return d
    }
    if (d.indexOf("@") == -1) {
        return d
    }
    var c = new Array();
    c = d.split("@");
    var b = document.createElement("div");
    b.innerHTML = c[0];
    document.body.appendChild(b);
    apple.util.addOverflowEllipsis(b, this.width);
    var a = b.innerHTML;
    document.body.removeChild(b);
    return a + "<br />@" + c[1]
}});
coherent.registerTransformerWithName(new apple.transaction.truncateEmail(28, 200), "truncateEmail");
coherent.registerTransformerWithName(new apple.transaction.truncateEmail(25, 180), "truncatePhotoEmail");
Package("apple");
apple.GenericTabController = Class.create(coherent.Bindable, {SELECTED_TAB_CLASSNAME: "selected",exposedBindings: ["selectedTab", "enabled"],actsLikeView: true,constructor: function(b, a) {
    b.prefix = b.prefix ? b.prefix + "-" : "";
    this.base(b);
    this.clickObserver = this.onclick.bind(this);
    Event.observe(document, "click", this.clickObserver)
},observeSelectedTabChange: function(c, a, b) {
    this.activateTab(c.newValue)
},observeEnabledChange: function(c, a, b) {
    this.enabled = c.newValue
},onclick: function(b) {
    if (this.enabled === false) {
        return
    }
    var c = b.target || b.srcElement, a = this.tabs.map(function(f) {
        return this.prefix + f + "-button"
    }, this), d = Element.locateAncestor(c, function(f) {
        return a.indexOf(f.id) >= 0
    });
    if (d) {
        Event.stop(b);
        this.activateTab(d.id.replace(new RegExp("^" + this.prefix + "(.+?)-button$"), "$1"))
    }
},activateTab: function(g) {
    var c = this.SELECTED_TAB_CLASSNAME, f = this.selectedTab, d = this.prefix, b = this.aliases;
    if (this.bindings.selectedTab) {
        this.bindings.selectedTab.setValue(g)
    }
    this.selectedTab = g;
    function a(h) {
        return function(m) {
            var o = (m in b) ? b[m] : m;
            var k = $(d + o + "-button"), n = $(d + o + "-content");
            if (k) {
                h ? Element.addClassName(k, c) : Element.removeClassName(k, c)
            }
            if (n) {
                h ? n.style.display = "" : n.style.display = "none"
            }
        }
    }
    this.tabs.forEach(a(false));
    a(true)(g)
},teardown: function() {
    Event.stopObserving(document, "click", this.clickObserver)
}});
Package("apple");
apple.AccessibleTabController = Class.create(apple.GenericTabController, {__postConstruct: function() {
    this.base.apply(this, arguments);
    Event.onDomReady(this.__init.bind(this))
},__init: function() {
    this.ariaInit()
},findCommonAncestor: function(h) {
    var f = h.shift(), b = h.length, c, g, k = true, a = function(n, m) {
        return n.compareDocumentPosition ? n.compareDocumentPosition(m) : n.contains ? (n !== m && n.contains(m) && 16) + (n !== m && m.contains(n) && 8) + (n.sourceIndex >= 0 && m.sourceIndex >= 0 ? (n.sourceIndex < m.sourceIndex && 4) + (n.sourceIndex > m.sourceIndex && 2) : 1) + 0 : 0
    }, d = function(n, m) {
        return n.contains ? n !== m && n.contains(m) : !!(a(n, m) & 16)
    };
    while (f && f.parentNode && f !== document.body && (f = f.parentNode)) {
        for (c = 0; c < b; c++) {
            k = d(f, h[c]);
            if (!k) {
                break
            }
        }
        if (k) {
            break
        }
    }
    return f
},ariaInit: function() {
    var a = [];
    this.onkeydown = this.onkeydown.bindAsEventListener(this);
    this.tabs.forEach(function(d) {
        var b = this.prefix + d + "-button", g = this.prefix + d + "-content", f, c;
        if ((f = $(b))) {
            f.setAttribute("role", "tab");
            f.setAttribute("aria-controls", g);
            a.push(f);
            Event.observe(f, "onkeydown", this.onkeydown)
        }
        if ((c = $(g))) {
            c.setAttribute("role", "tabpanel");
            c.setAttribute("aria-labelledby", b)
        }
    }, this);
    this.tabWrapper = this.findCommonAncestor(a);
    if (this.tabWrapper) {
        this.tabWrapper.setAttribute("role", "tablist")
    }
},onkeydown: function(a) {
    if (this.enabled === false) {
        return
    }
    var b;
    if (a.keyCode === Event.KEY_DOWN || a.keyCode === Event.KEY_RIGHT) {
        b = this.tabs[this.tabs.indexOf(this.selectedTab) + 1]
    }
    if (a.keyCode === Event.KEY_UP || a.keyCode === Event.KEY_LEFT) {
        b = this.tabs[this.tabs.indexOf(this.selectedTab) - 1]
    }
    if (b) {
        Event.stop(a);
        this.activateTab(b)
    }
},activateTab: function(g) {
    var c = this.SELECTED_TAB_CLASSNAME, f = this.selectedTab, d = this.prefix, b = this.aliases;
    if (this.bindings.selectedTab) {
        this.bindings.selectedTab.setValue(g)
    }
    this.selectedTab = g;
    function a(h) {
        return function(m) {
            var o = (m in b) ? b[m] : m;
            var k = $(d + o + "-button"), n = $(d + o + "-content");
            if (k) {
                k.setAttribute("aria-selected", !!h);
                k.setAttribute("tabindex", h ? 0 : -1);
                if (h) {
                    Element.addClassName(k, c);
                    window.setTimeout(function() {
                        k.focus()
                    }, 0)
                } else {
                    Element.removeClassName(k, c)
                }
            }
            if (n) {
                n.setAttribute("aria-hidden", !h);
                n.setAttribute("aria-expanded", !!h);
                n.style.display = h ? "" : "none"
            }
        }
    }
    this.tabs.forEach(a(false));
    a(true)(g)
},teardown: function() {
    if (this.tabWrapper) {
        Event.observe(this.tabWrapper, "onkeydown", this.onkeydown)
    }
    this.base.apply(this, arguments)
}});
Package("apple.transaction");
apple.transaction.LocalityLookupDistrictView = (function() {
    var f = window.coherent, d = f.View, b = Element, g = b.query, a = "display", c = "other";
    return Class.create(d, {exposedBindings: ["source", "status"],getDistrictOtherView: function() {
        var h = this.viewElement(), k = this.districtOtherViewId, m = d.fromNode((k && $(k)) || g(h, ".districtOther-field input"));
        if (!k && m) {
            this.districtOtherViewId = Element.assignId(m.viewElement())
        }
        return m
    },observeSourceChange: function(q, o, m) {
        var n = q.newValue, k = this.bindings.status, h = n === c;
        if (this.initSourceChangeDone && k) {
            this.statusCameFromTarget = true;
            k.setValue(h);
            k.update();
            this.statusCameFromTarget = false
        }
        if (!this.initSourceChangeDone) {
            this.initSourceChangeDone = true
        }
    },observeStatusChange: function(r, q, m) {
        var h = this.viewElement(), o = this.getDistrictOtherView(), k = "none", n = r.newValue;
        if (n) {
            k = "";
            if (this.statusCameFromTarget) {
                if (o && o.bindings.value) {
                    o.bindings.value.setValue("");
                    o.bindings.value.update()
                }
            }
        } else {
            o && o.clearAllErrors()
        }
        b.setStyle(h, a, k)
    }})
})();
Package("apple");
apple.SingleActiveTabGroup = Class.create(apple.GenericTabController, {tabNames: [],currentTab: null,previousTab: null,tabFieldsSelector: "input, select",observeSelectedTabChange: function(k, h, d) {
    this.base(k, h, d);
    this.previousTab = this.currentTab;
    this.currentTab = k.newValue;
    if (!this.previousTab) {
        return
    }
    var g = this.getViewsForTabContent(this.previousTab);
    for (var c = 0; c < g.length; c++) {
        var f = g[c];
        if (!f) {
            continue
        }
        var a = f.bindings.errorMessage, b = f.bindings.value || f.bindings.selectedValue;
        if (b) {
            b.setValue("");
            b.update()
        }
        if (a && a.value()) {
            a.setValue(null);
            f.clearAllErrors()
        }
    }
},getViewsForTabContent: function(d) {
    if (!this.isValidTab(d)) {
        return []
    }
    var h = this.prefix, b = this.aliases, g = (d in b) ? b[d] : d, f = $(h + g + "-content"), a = [], c = null;
    if (f) {
        c = Element.queryAll(f, this.tabFieldsSelector);
        c.forEach(function(k) {
            a.push(coherent.View.fromNode(k))
        })
    }
    return a
},isValidTab: function(d) {
    if (!d) {
        return false
    }
    var b = false, c = this.tabNames;
    for (var a in c) {
        if (d.indexOf(c[a])) {
            b = true;
            break
        }
    }
    return b
}});
Package("apple.transaction");
apple.transaction.TabNavigation = Class.create(coherent.View, {exposedBindings: ["selectedTab"],init: function() {
    this.buttons = Array.from(this.viewElement().getElementsByTagName("button"));
    if (this.bindings.selectedTab && !this.bindings.selectedTab.hasValue()) {
        var a = this.buttons[0].id.replace("-tab", "");
        apple.transaction.TabNavigation.selectedTabs[this.id] = a;
        this.bindings.selectedTab.setValue(a)
    }
},onclick: function(d) {
    Event.stop(d);
    if (apple.transaction.TabNavigation.disableClicks[this.id]) {
        return
    }
    var f = d.target || d.srcElement, c = this.buttons, b, a;
    b = Element.locateAncestor(f, function(g) {
        return c.indexOf(g) >= 0
    }, this.viewElement());
    if (!b) {
        return
    }
    a = b.id.replace("-tab", "");
    if (a != apple.transaction.TabNavigation.selectedTabs[this.id]) {
        apple.transaction.TabNavigation.disableClicks[this.id] = true;
        this.setClassNames(a);
        if (this.bindings.selectedTab) {
            this.bindings.selectedTab.setValue(a)
        }
    }
},observeSelectedTabChange: function(c, a, b) {
    this.setClassNames(c.newValue || "");
    this.update.bindAndDelay(this, 50, c.newValue)
},setClassNames: function(a) {
    this.buttons.forEach(function(b) {
        if (b.id == a + "-tab") {
            Element.addClassName(b, "current")
        } else {
            Element.removeClassName(b, "current")
        }
    }, this)
},update: function(c) {
    var b = this.id, m = apple.transaction.TabNavigation.selectedTabs, g = coherent.Style.kFadingClass, h = $(m[b]), k = $(c);
    m[b] = c;
    if (k && h && k != h) {
        function n() {
            coherent.Animator.addClassName(h, g, {ignore: new Set([h.id]),duration: 250,callback: function() {
                h.style.display = "none";
                Element.removeClassName(h, g);
                d()
            }})
        }
        function d() {
            if (k.style.display !== "") {
                Element.addClassName(k, g);
                k.style.display = ""
            }
            coherent.Animator.removeClassName(k, g, {ignore: new Set([k.id]),duration: 250,callback: function() {
                apple.transaction.TabNavigation.disableClicks[b] = false
            }})
        }
        h.style.display = "none";
        k.style.display = "";
        var f = k.parentNode, a;
        f.style.overflow = "";
        a = Element.getStyle(f, "height");
        f.style.overflow = "hidden";
        h.style.display = "";
        k.style.display = "none";
        coherent.Animator.setStyles(f, {height: a}, {cleanup: true,duration: 500,curve: coherent.easing.inOutSine});
        n()
    } else {
        if (k) {
            this.buttons.forEach(function(o) {
                o = $(o.id.replace("-tab", ""));
                o.style.display = (k == o) ? "" : "none"
            }, this)
        }
    }
}});
apple.transaction.TabNavigation.selectedTabs = {};
apple.transaction.TabNavigation.disableClicks = {};
Package("apple.transaction");
apple.transaction.ZipLookupView = Class.create(coherent.View, {exposedBindings: ["mode"],init: function() {
    var a = this.viewElement();
    this.__relativeSource.addObserverForKeyPath(this, this.observePostalCodeChange, this.zipKeyPath);
    this.fields = Element.query(a, "span.fields");
    this.select = Element.query(a, "span.select");
    this.prompt = Element.query(a, "span.prompt")
},observeModeChange: function(f, b, d) {
    var c = Element.hide, a = Element.show;
    switch (f.newValue) {
        case "prompt":
            c(this.fields);
            c(this.select);
            a(this.prompt);
            break;
        case "cityStateOptions":
            c(this.fields);
            a(this.select);
            c(this.prompt);
            break;
        case "cityStateFields":
            a(this.fields);
            c(this.select);
            c(this.prompt);
            break;
        default:
            break
    }
},updateMode: function(a) {
    if (this.bindings.mode) {
        this.bindings.mode.setValue(a);
        this.bindings.mode.update()
    }
},observePostalCodeChange: function(d, a, b) {
    var c = coherent.View.fromNode($(this.viewId));
    if (c && c.validate() instanceof coherent.Error) {
        this.updateMode("prompt")
    }
},presentError: function(b) {
    if (b.field.bindings.value.keyPath != this.zipKeyPath) {
        this.updateMode("cityStateFields")
    }
    var a = this.nextResponder();
    if (a) {
        return a.presentError(b)
    }
    return false
},teardown: function() {
    this.__relativeSource.removeObserverForKeyPath(this, this.zipKeyPath);
    this.base()
}});
Package("apple.transaction");
apple.transaction.FieldFactories = (function createFactories() {
    var a = window.apple, c = window.coherent, d = false;
    function b(g, h) {
        return h ? (g + h) : null
    }
    function f(g) {
        return g.replace(/\./g, "_")
    }
    return {createTabNav: function(h, k, g, m) {
        return new a.transaction.TabNavigation(h, this, {selectedTabBinding: g + k.key})
    },createTabGroup: function(h, g, k) {
        return new a.GenericTabController({tabs: h.tabs,aliases: h.aliases || {},prefix: h.prefix,selectedTabBinding: g + h.key}, this)
    },createAccessibleTabGroup: function(h, g, k) {
        return new a.AccessibleTabController({tabs: h.tabs,aliases: h.aliases || {},prefix: h.prefix,selectedTabBinding: g + h.key}, this)
    },createButton: function(h, k, g, m) {
        var n = {};
        if (k && k.enabledBinding) {
            n.enabledBinding = g + k.enabledBinding
        }
        if (k && k.actionBinding) {
            n.action = this.performAction.bind(this, k.actionBinding)
        }
        return new c.Button(h, this, n)
    },createCardAuxFieldTabGroup: function(h, g, k) {
        return new a.SingleActiveTabGroup({tabs: h.tabs,tabNames: ["start-date", "issue-number"],aliases: h.aliases || {},prefix: h.prefix,selectedTabBinding: g + h.key}, this)
    },_createFormatterForValidations: function(n) {
        function g(o, q) {
            var r;
            if (q) {
                r = new String("^(" + q.map(RegExp.escape).join("|") + ")$");
                r.valueList = true;
                o.push(r)
            }
            return o.map(function(u) {
                var t = new RegExp(u, "i");
                t.valueList = u.valueList;
                return t
            })
        }
        var m = {}, k, h = ["valid", "invalid"];
        for (k = 0; k < h.length; k++) {
            m[h[k] + "Regex"] = g(n[h[k] + "Regexes"] || [], n[h[k] + "Values"])
        }
        m.invalidValueMessage = n.invalidValueError;
        m.requiredMessage = n.requiredError;
        m.required = n.required || false;
        m.numeric = n.numeric;
        m.clampValues = n.clampValues;
        m.minValue = n.minValue;
        m.maxValue = n.maxValue;
        m.minValueMessage = n.minValueError;
        m.maxValueMessage = n.maxValueError;
        m.minLength = n.minLength;
        m.maxSize = n.maxSize;
        m.extraValidations = n.extraValidations;
        return new a.ComplexFormatter(m)
    },_createCurrencyFormatter: function(n) {
        function g(o, q) {
            var r;
            if (q) {
                r = new String("^(" + q.map(RegExp.escape).join("|") + ")$");
                r.valueList = true;
                o.push(r)
            }
            return o.map(function(u) {
                var t = new RegExp(u, "i");
                t.valueList = u.valueList;
                return t
            })
        }
        var m = {}, k, h = ["valid", "invalid"];
        for (k = 0; k < h.length; k++) {
            m[h[k] + "Regex"] = g(n[h[k] + "Regexes"] || [], n[h[k] + "Values"])
        }
        m.invalidValueMessage = n.invalidValueError;
        m.requiredMessage = n.requiredError;
        m.required = n.required || false;
        m.numeric = n.numeric;
        m.decimalSeparator = n.decimalSeparator;
        m.unitSeparator = n.unitSeparator;
        m.clampValues = n.clampValues;
        m.minValue = n.minValue;
        m.maxValue = n.maxValue;
        m.minValueMessage = n.minValueError;
        m.maxValueMessage = n.maxValueError;
        m.minLength = n.minLength;
        m.maxSize = n.maxSize;
        m.extraValidations = n.extraValidations;
        m.validCharacters = n.allowedCharacters;
        return new a.CurrencyFormatter(m)
    },createSelectionList: function(k, m, g, n) {
        var h = g + m.key;
        return new a.transaction.ToggleGroup(k, this, {contentBinding: h + "_content",selectedIndexBinding: h,item: m})
    },createList: function(n, o, h, q) {
        var m = h + o.key;
        var g = this.valueForKeyPath(m);
        var k = new c.ListView(n, this, {contentBinding: m + "_content",selectedIndexBinding: m});
        this.setValueForKeyPath(g, m);
        return k
    },createTextField: function(k, m, g, n) {
        var o = a.transaction.FieldFactories._createFormatterForValidations, h = {valueBinding: g + m.key,errorMessageBinding: n + f(m.key),formatter: (m.validations ? o(m.validations) : null),enabledBinding: (m.enabledKey ? g + m.enabledKey : g + m.key + "Enabled")};
        if (m.visible) {
            h.visibleBinding = m.visible
        }
        if (m.validations && m.validations.maxSize) {
            k.maxLength = m.validations.maxSize
        }
        if (m.events && m.events[0].delay) {
            h.keypressUpdateTimeout = m.events[0].delay
        }
        return new a.transaction.TextBox(k, this, h)
    },createActionField: function(h, g, k) {
        var m = a.transaction.FieldFactories._createFormatterForValidations;
        return new a.transaction.ActionField({valueBinding: g + h.key,formatter: (h.validations ? m(h.validations) : null)}, this)
    },createNumeric: function(h, k, g, m) {
        k.validations = k.validations || {};
        k.validations.numeric = true;
        k.validations.clampValues = true;
        return a.transaction.FieldFactories.createTextField.call(this, h, k, g, m)
    },createNumericNonZero: function(h, k, g, m) {
        k.validations = k.validations || {};
        k.validations.numeric = true;
        var n = a.transaction.FieldFactories._createFormatterForValidations;
        if (k.validations && k.validations.maxSize) {
            h.maxLength = k.validations.maxSize
        }
        return new a.transaction.QuantityTextBox(h, this, {valueBinding: g + k.key,errorMessageBinding: m + k.key.replace(/\./g, "_"),formatter: (k.validations ? n(k.validations) : null)})
    },createDecimal: function(h, k, g, m) {
        var n = a.transaction.FieldFactories._createFormatterForValidations;
        k.validations = k.validations || {};
        k.validations.decimal = true;
        k.validations.extraValidations = "01234567890" + k.decimalSeparator + k.thousandsSeparator;
        if (k.validations && k.validations.maxSize) {
            h.maxLength = k.validations.maxSize
        }
        return new a.transaction.TextBox(h, this, {valueBinding: g + k.key,errorMessageBinding: m + k.key.replace(/\./g, "_"),formatter: (k.validations ? n(k.validations) : null)})
    },createTypeAhead: function(n, u, h, v) {
        var m = a.transaction.FieldFactories._createFormatterForValidations, g = "", t, q = {name: u.name}, k = this.valueForKeyPath(h + u.action), o = this, r;
        switch (typeof k) {
            case "string":
                g = k;
                break;
            case "object":
                g = k.url;
                t = this.valueForKeyPath(h + k.form);
                if (t) {
                    t.fields.forEach(function(x, w) {
                        q[x.name || x.id] = o.valueForKeyPath(h + x.key)
                    })
                }
                break;
            default:
                break
        }
        r = new a.transaction.TextFieldMatcher(n, this, {nameBinding: (u.name || u.id),matcherDataBinding: null,matcherUrl: g,parentId: "checkout-wrapper",valueBinding: h + u.key,errorMessageBinding: v + f(u.key),formatter: (u.validations ? m(u.validations) : null),enabledBinding: (u.enabledKey ? h + u.enabledKey : h + u.key + "Enabled")});
        r.matcherParams = q;
        return r
    },createSecurityCodeField: function(k, m, g, o) {
        if (m.validations && m.validations.maxSize) {
            k.maxLength = m.validations.maxSize
        }
        var n = {toString: (function() {
            return this.content.valueForKeyPath("creditTypes.messages.invalidValueError")
        }).bind(this)};
        var h = {toString: (function() {
            return this.content.valueForKeyPath("creditTypes.messages.requiredError")
        }).bind(this)};
        var q = new a.SecurityCodeFormatter({paymentTypeBinding: g + m.paymentType,paymentTypes: this.creditTypes,invalidValueMessage: n,requiredMessage: h,required: m.validations.required});
        q.originalValue = this.valueForKeyPath(g + m.key);
        this.addObserverForKeyPath(this, function(r) {
            q.originalValue = r.newValue ? r.newValue.securityCode : ""
        }, g + m.key.replace(/^(.+)\..+$/, "$1"));
        return new a.transaction.SecurityCode(k, this, {nameBinding: (m.name || m.id),valueBinding: g + m.key,paymentTypeBinding: g + m.paymentType,errorMessageBinding: o + f(m.key),formatter: q,creditTypes: this.creditTypes})
    },createCustomerIdField: function(m, n, h, q) {
        if (n.validations && n.validations.maxSize) {
            m.maxLength = n.validations.maxSize
        }
        var o = {toString: (function() {
            return this.content.valueForKeyPath("creditTypes.messages.invalidValueError")
        }).bind(this)};
        var k = {toString: (function() {
            return this.content.valueForKeyPath("creditTypes.messages.requiredError")
        }).bind(this)};
        var g = new a.CustomerIdCardNumberFormatter({paymentTypeBinding: h + n.paymentType,paymentTypes: this.creditTypes,invalidValueMessage: o,requiredMessage: k,required: n.validations.required});
        g.originalValue = this.valueForKeyPath(h + n.key);
        this.addObserverForKeyPath(this, function(r) {
            g.originalValue = r.newValue ? r.newValue.customerIdCardNumber : ""
        }, h + n.key.replace(/^(.+)\..+$/, "$1"));
        return new a.transaction.CustomerIdCardNumber(m, this, {nameBinding: (n.name || n.id),valueBinding: h + n.key,paymentTypeBinding: h + n.paymentType,errorMessageBinding: q + f(n.key),formatter: g,creditTypes: this.creditTypes})
    },createCurrency: function(m, n, h, o) {
        var g = a.transaction.FieldFactories._createCurrencyFormatter, k = {valueBinding: h + n.key,errorMessageBinding: o + f(n.key),formatter: (n.validations ? g(n.validations) : null),enabledBinding: (n.enabledKey ? h + n.enabledKey : null)};
        if (n.visible) {
            k.visibleBinding = n.visible
        }
        if (n.validations && n.validations.maxSize) {
            m.maxLength = n.validations.maxSize
        }
        if (n.events && n.events[0].delay) {
            k.keypressUpdateTimeout = n.events[0].delay
        }
        return new a.transaction.TextBox(m, this, k)
    },createCardNumber: function(k, n, g, o) {
        var m = a.transaction.FieldFactories._createCardFormatter, h = m.call(this, n, g);
        if (n.validations && n.validations.maxSize) {
            k.maxLength = n.validations.maxSize
        }
        return new a.transaction.CardNumber(k, this, {valueBinding: g + n.key,paymentTypeBinding: g + n.paymentType,errorMessageBinding: o + f(n.key),formatter: h,creditTypes: this.creditTypes})
    },createLoanNumber: function(m, n, g, o) {
        var k = a.transaction.FieldFactories._createLoanNumberFormatter, h = k.call(this, n, g);
        if (n.validations && n.validations.maxSize) {
            m.maxLength = n.validations.maxSize
        }
        return new a.transaction.LoanNumber(m, this, {valueBinding: g + n.key,errorMessageBinding: o + f(n.key),formatter: h})
    },_createLoanNumberFormatter: function(n, g) {
        var o = {toString: (function() {
            return this.content.valueForKeyPath("billing._forms.billingLoanForm.fields.validations.invalidValueError")[0]
        }).bind(this)};
        var h = {toString: (function() {
            return this.content.valueForKeyPath("billing._forms.billingLoanForm.fields.validations.requiredError")[0]
        }).bind(this)};
        var m = {invalidValueMessage: o,requiredMessage: h,required: n.validations.required};
        var k = new a.LoanNumberFormatter(m);
        k.originalValue = this.valueForKeyPath(g + n.key);
        this.addObserverForKeyPath(this, function(q) {
            k.originalValue = q.newValue ? q.newValue.loanNumber : ""
        }, g + n.key.replace(/^(.+)\..+$/, "$1"));
        return k
    },createLoanNumberMasker: function(m, n, g, o) {
        var k = a.transaction.FieldFactories._createLoanNumberFormatter, h = k.call(this, n, g);
        if (n.validations && n.validations.maxSize) {
            m.maxLength = n.validations.maxSize
        }
        return new a.transaction.TextFieldMasker(m, this, {valueBinding: g + n.key,errorMessageBinding: o + f(n.key),formatter: LoanNumberFormatter})
    },_createSelectField: function(k, h, o) {
        var m = h || {}, r = m.selectedValueBinding, n = this.valueForKeyPath(r), g = o || a.transaction.SelectBox, q = new g(k, this, m);
        this.setValueForKeyPath(n, r);
        return q
    },createSelect: function(h, k, g, n) {
        var m = k.key;
        return a.transaction.FieldFactories._createSelectField.call(this, h, {validations: k.validations,resetOnDisable: k.resetOnDisable,selectedValueBinding: b(g, m),errorMessageBinding: n + f(m),contentBinding: b(g, k.optionsKey),contentValuesBinding: b(g, k.optionsValueKey),displayValuesBinding: b(g, k.optionsDisplayKey)})
    },createLocalitySelect: function(h, k, g, n) {
        var m = k.key;
        return a.transaction.FieldFactories._createSelectField.call(this, h, {validations: k.validations,resetOnDisable: k.resetOnDisable,selectedValueBinding: b(g, m),errorMessageBinding: n + f(m),contentBinding: b(g, k.optionsKey),contentValuesBinding: b(g, k.optionsValueKey),displayValuesBinding: b(g, k.optionsDisplayKey)}, a.transaction.LocalityLookupSelectBox)
    },createLocalityOther: function(h, k, g, m) {
        return new a.transaction.LocalityLookupDistrictView(h, this, {sourceBinding: b(g, k.key),statusBinding: b(g, k.useAlternateKey)})
    },createCheckbox: function(h, k, g, m) {
        return new c.ToggleButton(h, this, {checkedBinding: g + k.key,errorMessageBinding: m + f(k.key)})
    },createRadio: function(h, g, k) {
        return new a.RadioGroup({item: h,selectionBinding: g + h.key,errorMessageBinding: k + f(h.key)}, this)
    },createPaymentTypeSelector: function(h, k, g, m) {
        return new a.transaction.CardTypeSelector(h, this, {cardTypeBinding: g + k.key,validations: k.validations,errorMessageBinding: m + k.key.replace(/\./g, "_")})
    },createPaymentTypeDetector: function(h, k, g, m) {
        return new a.transaction.CardTypeDetector(h, this, {cardTypeBinding: g + k.key})
    },createCreditCardMasker: function(k, n, g, o) {
        var m = a.transaction.FieldFactories._createCardFormatter, h = m.call(this, n, g);
        if (n.validations && n.validations.maxSize) {
            k.maxLength = n.validations.maxSize
        }
        return new a.transaction.TextFieldMasker(k, this, {valueBinding: g + n.key,paymentTypeBinding: g + n.paymentType,errorMessageBinding: o + f(n.key),formatter: h,creditTypes: this.creditTypes})
    },createExpirationMonth: function(h, k, g, m) {
        return a.transaction.FieldFactories.createDateMonth.call(this, h, k, g, m)
    },createStartDateMonth: function(h, k, g, m) {
        return a.transaction.FieldFactories.createDateMonth.call(this, h, k, g, m)
    },createDateMonth: function(h, k, g, m) {
        var n = k.key;
        return a.transaction.FieldFactories._createSelectField.call(this, h, {validations: k.validations,resetOnDisable: k.resetOnDisable,selectedValueBinding: g + n,errorMessageBinding: m + f(n).replace("Month", "")})
    },createExpirationYear: function(h, k, g, m) {
        return a.transaction.FieldFactories.createDateYear.call(this, h, k, g, m)
    },createStartDateYear: function(h, k, g, m) {
        return a.transaction.FieldFactories.createDateYear.call(this, h, k, g, m)
    },createDateYear: function(h, k, g, m) {
        var n = k.key;
        return a.transaction.FieldFactories._createSelectField.call(this, h, {validations: k.validations,resetOnDisable: k.resetOnDisable,selectedValueBinding: g + n,errorMessageBinding: m + f(n).replace("Year", "")})
    },createZipLookup: function(h, k, g, m) {
        return new a.transaction.ZipLookupView(h, this, {keyPathPrefix: g,modeBinding: g + k.key,zipKeyPath: g + k.zipKey,viewId: k.viewId})
    },createZipLookupOptions: function(h, k, g, m) {
        return new a.transaction.ZipLookupSelectBox(h, this, {contentBinding: g + k.key,selectedObjectBinding: g + k.key + "_object",displayValuesBinding: g + k.key + ".display",cityKeyPath: g + k.cityKey,stateKeyPath: g + k.stateKey,modeKeyPath: g + k.modeKey})
    },createOrderSummary: function(h, m, g, n) {
        var k = new a.cart.SummaryView(h, this, {summaryBinding: g + m.key,summaryType: m.summaryType,loadingBinding: g + "loading",checkoutVisibleBinding: "checkoutVisible",currentStepBinding: "currentStep"});
        switch (m.summaryType) {
            case "sidebar":
                if (!d) {
                    new a.widget.SlidingTrackView($("slider-track"));
                    d = true
                }
                break;
            default:
                break
        }
        return k
    },_createCardFormatter: function(o, g) {
        var q = {toString: (function() {
            return this.content.valueForKeyPath("creditTypes.messages.invalidValueError")
        }).bind(this)};
        var h = {toString: (function() {
            return this.content.valueForKeyPath("creditTypes.messages.requiredError")
        }).bind(this)};
        var n = {paymentTypes: this.creditTypes,invalidValueMessage: q,requiredMessage: h,required: o.validations.required};
        var m = o.explicitType ? "paymentTypeBinding" : "implicitPaymentTypeBinding";
        n[m] = g + o.paymentType;
        var k = new a.CreditCardFormatter(n);
        k.originalValue = this.valueForKeyPath(g + o.key);
        this.addObserverForKeyPath(this, function(r) {
            k.originalValue = r.newValue ? r.newValue.cardNumber : ""
        }, g + o.key.replace(/^(.+)\..+$/, "$1"));
        return k
    },createCompareField: function(k, n, g, o) {
        var h = a.transaction.FieldFactories._createCompareFieldFormatter, m = h.call(this, n, g);
        if (n.validations && n.validations.maxSize) {
            k.maxLength = n.validations.maxSize
        }
        return new a.transaction.CompareField(k, this, {valueBinding: g + n.key,errorMessageBinding: o + f(n.key),formatter: m})
    },_createCompareFieldFormatter: function(q, h) {
        var r = {toString: (function() {
            return q.validations.comparisonError
        })};
        var k = {toString: (function() {
            return q.validations.requiredError
        })};
        var m = {toString: (function() {
            return q.id
        })};
        var g = {toString: (function() {
            return q.compareWith
        })};
        var n = {comparisonErrorMessage: r,requiredMessage: k,required: q.validations.required,compareThis: m,compareWith: g};
        var o = new a.CompareFieldFormatter(n);
        o.originalValue = this.valueForKeyPath(h + q.key);
        return o
    },createCopy: function(g, k) {
        var h = k.sourceId && $(k.sourceId);
        g.innerHTML = h.innerHTML;
        return c.View(g, this, {})
    }}
})();
Package("apple.transaction");
apple.transaction.OverlayOptionsFactories = {DEFAULT_OPTIONS: {displayCloseWidget: false,sourceId: "overlay-content"},createOverlay: function(b) {
    var a = apple.transaction.OverlayOptionsFactories.DEFAULT_OPTIONS;
    if (b.dialog) {
        a.dialog = b.dialog
    }
    return a
},createFinancing: function(a) {
    return Object.applyDefaults({dialog: true}, apple.transaction.OverlayOptionsFactories.DEFAULT_OPTIONS)
},createStorelocator: function() {
    return {displayCloseWidget: false,sourceId: "store-locator",classname: "overlay store-locator",dialog: true}
},createUsEducationEstimatePaymentOverlay: function() {
    return {displayCloseWidget: true,sourceId: "overlay-content",classname: "overlay store-locator"}
},createCloseWidgetFinancing: function() {
    return Object.applyDefaults({displayCloseWidget: true}, apple.transaction.OverlayOptionsFactories.DEFAULT_OPTIONS)
},createAcknowledgement: function(a) {
    return {displayCloseWidget: false,header: a.header,html: a.html,actions: a.actions,classname: "overlay acknowledgement"}
},createAckRefresh: function(a) {
    return {displayCloseWidget: false,canClickClose: false,header: a.header,html: a.html,actions: a.actions,classname: "overlay acknowledgement"}
}};
Package("apple.transaction");
coherent.View.createViewsForNodeTree = function(c, a, b) {
};
apple.transaction.ViewController = Class.create(coherent.ViewController, {LOADING_INDICATOR_DELAY: 500,__customViews__: {},__lastFirstResponder__: null,modules: Set(),formModules: Set(),forms: {},events: {},idAlerts: {},keyToActivationsMap: {},activationKeyToItemMap: {},content: DeferredJSON({actionKey: "_a",extractContent: "extractContent",extractUpdates: "extractUpdates",setCallback: "contentSetCallback"}),getFieldFactories: function() {
    return apple.transaction.FieldFactories || {}
},getOverlayOptionsFactories: function() {
    return apple.transaction.OverlayOptionsFactories || {}
},getOverlayDelegate: function() {
    return null
},init: function() {
    this.boundHandleEvent = this._handleEvent.bind(this);
    Event.observe(document, "click", this.boundHandleEvent);
    this.addObserverForKeyPath(this, this.loadingChanged, "content.loading");
    this.loadingCallbacks = [];
    if (apple.A11yAlert) {
        this.ariaAlert = new apple.A11yAlert()
    }
},supportsProcessStatement: function() {
    var a = this.content.version();
    a = !a ? 0 : parseFloat(a);
    if (a >= 2) {
        return true
    }
},loadingChanged: function(c) {
    var b, a;
    if (c.newValue === false) {
        while ((b = this.loadingCallbacks.pop())) {
            b()
        }
    } else {
        a = coherent.page.firstResponder;
        this.__lastFirstResponder__ = a ? a.viewElement().id : (document.activeElement ? document.activeElement.id : null)
    }
},extractUpdates: function(a) {
    this.processIncomingHTML(a.htmls || []);
    if (a.htmls) {
        delete a.htmls
    }
    return a
},extractContent: function(f) {
    this.ignoreEvents = true;
    if (f.mutableKeys().length > 0) {
        function a(k) {
            var m, h = coherent.View.viewLookup;
            for (m in k._viewCache) {
                if (h[m]) {
                    h[m].teardown()
                }
            }
        }
        for (var d in this.forms) {
            var c = d.substring(0, d.indexOf("."));
            if (!f[c]) {
                continue
            }
            a(this.forms[d]);
            delete this.forms[d]
        }
        for (c in this.events) {
            var b = this.events[c].change;
            for (var g in b) {
                this.content.removeObserverForKeyPath(this, g)
            }
        }
        for (g in this.keyToActivationsMap) {
            this.content.removeObserverForKeyPath(this, g)
        }
        this._oldEvents = {};
        f.mutableKeys().forEach(function(h) {
            this._oldEvents[h] = this.events[h];
            this.events[h] = {click: {},change: {},submit: {}};
            if (h in this.idAlerts) {
                this.idAlerts[h].forEach(this.clearIdError, this)
            }
            this.idAlerts[h] = []
        }, this);
        this.setValueForKey(new coherent.KVO(), "errors")
    }
    return f
},contentSetCallback: function(d) {
    this.ignoreEvents = false;
    if (d.mutableKeys().length > 0) {
        var b = Set.toArray(this.content.keys());
        var a = b.filter(function(f) {
            return coherent.typeOf(this.content[f]) === "object"
        }, this);
        var c = b.filter(function(f) {
            return coherent.typeOf(this.content[f]) === "object" && this.content[f]["_operation"] === "process"
        }, this);
        this.modules = Set.union(this.modules, Set(a));
        this.formModules = Set.union(this.formModules, Set(c));
        this.processIncomingForms(d);
        this.processIncomingOverlay(d);
        this.processEvents();
        this.updateActiveKeys()
    }
    this.endLoadingState();
    if (!("focusFirstResponder" in d && d.focusFirstResponder === false)) {
        this.focusPreviousFirstResponder.bindAndDelay(this, 50)
    }
},endLoadingState: function() {
    Element.queryAll(".button.loading,.text-action.loading").forEach(function(a) {
        Element.removeClassName(a, "loading")
    })
},highlightFirstErrorInForm: function(f) {
    var c = this._collectFieldsForForm(f).map(function(k) {
        var h, g;
        if (k && (h = $(k.id)) && (g = coherent.View.fromNode(h))) {
            return g
        }
    }, this);
    var a = c.length, b;
    for (var d = 0; d < a; d++) {
        b = c[d];
        if (b && b.validationError && b.focus) {
            Event.onLoad(function() {
                try {
                    b.focus()
                } catch (g) {
                }
            });
            break
        }
    }
},processIncomingHTML: function(a) {
    a.forEach(this.processIncomingHTMLItem, this)
},processIncomingHTMLItem: function(b) {
    var a = $(b.id);
    if (a) {
        Element.setInnerHTML(a, b.value || b.html || "");
        this.setHtmlCallback(a)
    }
},setHtmlCallback: function(a) {
    var b = (a && a.viewElement) ? a.viewElement() : a;
    Element.setStyle(b, "display", "")
},processIncomingForms: function(o) {
    var a = [];
    var r = {};
    var h = this.keyToActivationsMap = {};
    var q = this.activationKeyToItemMap = {};
    var g = {};
    function m(v) {
        var u = v.key, f = u.substring(0, u.indexOf("."));
        v = v.form;
        this.forms[u] = v;
        v._viewCache = {};
        v._keyPath = u;
        v.active = true;
        if (v.activations) {
            v.activations.forEach(d(v, null, o), this)
        }
        if (v.views) {
            v.views.forEach(b(v, false, f, o), this)
        }
        if (v.fields) {
            v.fields.forEach(b(v, true, f, o), this)
        }
        if (v.events) {
            this.gatherEvents(v, v.events, f)
        }
        if (v._events) {
            this.gatherEvents(v, v._events, f)
        }
        if (v.subForms) {
            v.subForms.forEach(function(x) {
                var w = o.valueForKeyPath(x);
                if (w) {
                    m.call(this, {key: x,form: w})
                } else {
                    if (!this.valueForKeyPath("content." + x)) {
                        if (window.console && typeof (window.console.warn) == "function") {
                            console.warn("subform " + x + " does not have a matching reference. Ignoring.")
                        }
                    }
                }
            }, this)
        }
    }
    function d(u, v, f) {
        return function(x) {
            if (!x.validations) {
                return
            }
            var y = this.getFieldFactories()._createFormatterForValidations, w = v || u;
            x._formatter = y(x.validations);
            if (q[x.key]) {
                q[x.key].push(w)
            } else {
                q[x.key] = [w]
            }
            if (h[x.key]) {
                h[x.key].push(x)
            } else {
                this.content.addObserverForKeyPath(this, this.observeActivationValueChange, x.key);
                h[x.key] = [x]
            }
            this.validateActivation(x, f)
        }
    }
    function b(v, w, f, u) {
        return function(x) {
            x._form = v;
            this.createView(v, x, w);
            if (x.activations) {
                x.activations.forEach(d(v, x, u), this)
            }
            if (x.events) {
                this.gatherEvents(x, x.events, f, v)
            }
            if (x._events) {
                this.gatherEvents(x, x._events, f, v)
            }
            if (x.alerts) {
                this.processAlerts(x, x.alerts, f)
            }
        }
    }
    var c = this.supportsProcessStatement() ? this.formModules : this.modules;
    Set.forEach(Set.intersect(c, Set(o.mutableKeys())), function(u) {
        var f = o.valueForKeyPath(u + "._forms");
        if (f) {
            f.mutableKeys().forEach(function(w) {
                var y = u + "._forms." + w;
                var x = f[w];
                var v = {key: y,form: x};
                a.push(v);
                if (x.subForms) {
                    x.subForms.forEach(function(z) {
                        r[z] = y
                    })
                }
            })
        }
    }, this);
    Set.forEach(Set.intersect(this.modules, Set(o.mutableKeys())), function(u) {
        var f = o.valueForKeyPath(u + "._events");
        if (f) {
            this.gatherEvents({}, f, u)
        }
        var v = o.valueForKeyPath(u + "._alerts");
        if (v) {
            v.forEach(function(x) {
                var y;
                var w = {};
                if (x.value) {
                    w = [].concat({value: x.value,type: "normal",level: x.level})
                } else {
                    if (x.errors) {
                        w = [].concat({value: x.errors,type: "normal",level: "error"})
                    } else {
                        if (x.infos) {
                            w = [].concat({value: x.infos,type: "normal",level: "info"})
                        }
                    }
                }
                this.processAlerts({key: x.key || u,id: ""}, w, u, "<br>")
            }, this)
        }
    }, this);
    for (var k = a.length - 1; k >= 0; k--) {
        var n = a[k];
        if (r[n.key]) {
            a.splice(k, 1)
        }
    }
    var t = coherent.dataModel;
    coherent.dataModel = this;
    a.forEach(m, this);
    coherent.dataModel = t
},updateActiveKeys: function() {
    for (var a in this.forms) {
        var b = this.forms[a];
        this.updateActiveKey(b);
        if (b.fields) {
            b.fields.forEach(this.updateActiveKey)
        }
        if (b.views) {
            b.views.forEach(this.updateActiveKey)
        }
    }
},updateActiveKey: function(d) {
    if (d && d.activations) {
        var f = d._keyPath !== undefined, k = (d._keyPath || d.key), c = d.active;
        var h = d.activations.reduce(function(m, n) {
            return m && n.valid
        }, true);
        if (h != c) {
            d.setValueForKey(h, "active");
            if (f) {
                for (var a in d._viewCache) {
                    if (a) {
                        var b = d._viewCache[a];
                        if (b.observeEnabledChange) {
                            b.observeEnabledChange({newValue: h})
                        }
                    }
                }
            } else {
                var g = (d._form.active == undefined || d._form.active);
                if (g) {
                    d.disabled = !h;
                    d._form._viewCache[d.id].observeEnabledChange({newValue: h})
                }
            }
        }
    }
},validateActivation: function(d, b) {
    var c = b.valueForKeyPath(d.key), a = true;
    a = d._formatter.isStringValid(c);
    a = (a && !(a instanceof coherent.Error));
    d.valid = a;
    return a
},observeActivationValueChange: function(d, a) {
    var b = this.keyToActivationsMap[a], c = this.activationKeyToItemMap[a];
    b.forEach(function(f) {
        this.validateActivation(f, this.content)
    }, this);
    c.forEach(function(f) {
        this.updateActiveKey(f)
    }, this)
},createView: function(c, t, m) {
    if (!t) {
        return
    }
    var o = t.id, u = t.name, k = t.type || "", v = coherent.View.viewLookup, q = this.getFieldFactories(), d = "content.", g = "errors.", h = o && $(o), a = k ? q["create" + k.titleCase()] : null, r, n;
    if (a) {
        if (a.length == 3) {
            n = a.call(this, t, d, g)
        } else {
            if (!h) {
                return
            }
            n = a.call(this, h, t, d, g)
        }
        c._viewCache[o || "__view-" + n.__uid] = n;
        b(n)
    } else {
        if (h) {
            if (m && k !== "view") {
                a = (h.nodeName == "SELECT") ? q.createSelect : q.createTextField;
                n = a.call(this, h, t, d, g);
                if (a == q.createTextField && c.action) {
                    n.action = this.performDefaultFormAction.bind(this, c._keyPath);
                    n.target = this;
                    n.sendsActionOnEndEditing = false
                }
                c._viewCache[o] = n;
                b(n)
            } else {
                r = this.__customViews__[o];
                if (r) {
                    n = r.call(this, h, t, d, g)
                } else {
                    if (t.html) {
                        this.processIncomingHTML([t])
                    } else {
                        if (t.keys) {
                            t.value = t.keys.map(function(w) {
                                return this.content.valueForKeyPath(w)
                            }, this).join("\n");
                            this.processIncomingHTML([t])
                        } else {
                            if (t.key) {
                                n = new this.ReplaceView(h, this, {htmlBinding: d + t.key,visibleBinding: d + t.key,target: this})
                            } else {
                                if (c.activations) {
                                    n = new coherent.View(h, this)
                                }
                            }
                        }
                    }
                }
                if (n) {
                    c._viewCache[o] = n;
                    b(n)
                }
            }
        } else {
            if (u) {
                a = q.createActionField;
                n = a.call(this, t, d, g);
                if (n) {
                    c._viewCache[u] = n
                }
            }
        }
    }
    function f(x, w) {
        Element.setInnerHTML(x, w);
        x.style.display = ""
    }
    function b(w) {
        var x = c.active && (!c.disabled && !(t && t.disabled));
        if (!x) {
            w.observeEnabledChange({newValue: x})
        }
    }
},gatherEvents: function(m, o, b) {
    b = this.events[b];
    var a, k, c, h, n = b.click, g = b.change, d = b.submit, f = (m._keyPath || m.key) + ".active";
    o.forEach(function(q) {
        q._element = m;
        switch (q.event) {
            case "submit":
                a = m.id || q.id;
                c = d[a] = d[a] || [];
                c.push(q);
                break;
            case "click":
                a = m.id || q.id;
                c = n[a] = n[a] || [];
                c.push(q);
                break;
            case "change":
                k = m.key || q.key;
                h = g[k] = g[k] || [];
                h.push(q);
                break;
            case "valid":
            case "invalid":
                q.key = k = m.key || q.key;
                if (m.validKey) {
                    q.validKey = m.validKey;
                    this.content.addObserverForKeyPath(this, this.handleValidationEvent, k, q);
                    this.updateValidKey(q);
                    k = m.validKey;
                    h = g[k] = g[k] || [];
                    h.push(q)
                } else {
                    h = g[k] = g[k] || [];
                    h.push(q)
                }
                break;
            case "active":
            case "inactive":
                if (m.activations) {
                    q.activeKey = f;
                    h = g[f] = g[f] || [];
                    h.push(q)
                }
                break;
            case "load":
                this.performEvent.bindAndDelay(this, q.delay || 0, q, null);
                break;
            default:
                break
        }
    }, this)
},processEvents: function() {
    var a = {click: {},change: {},submit: {}};
    Set.forEach(this.modules, function(g) {
        var d, o, q = this._oldEvents[g] || a, c = this.events[g] || a, b = q.click, m = q.change, k = q.submit, h = c.click, f = c.change, n = c.submit;
        for (d in k) {
            if (!(d in n)) {
                this.disableSubmitTarget(d)
            }
        }
        for (d in n) {
            if (!(d in k)) {
                this.enableSubmitTarget(d)
            }
        }
        for (d in b) {
            if (!(d in h)) {
                this.disableClickTarget(d)
            }
        }
        for (d in h) {
            if (!(d in b)) {
                this.enableClickTarget(d)
            }
        }
        for (o in f) {
            this.content.addObserverForKeyPath(this, this.handleChangeEvent, o)
        }
    }, this)
},processAlerts: function(o, g, c, h) {
    var f = {}, k = {}, n = o.key, b = o.id, m = "", d = "", a;
    if ((o._form && o._form.active != undefined && !o._form.active) || (o.active != undefined && !o.active)) {
        return
    }
    g.forEach(function(q) {
        if (!q.type) {
            q.type = "normal"
        }
        if (!f[q.type]) {
            f[q.type] = []
        }
        if (!k[q.level]) {
            k[q.level] = []
        }
        f[q.type].push(q.value);
        k[q.level].push(q.value)
    });
    if (f.normal) {
        if (b && !n) {
            this.idAlerts[c] = this.idAlerts[c] || [];
            this.idAlerts[c].push(b);
            d = k.info ? "info" : "error";
            this.presentIdError(b, f.normal.join("<br>"), d)
        } else {
            d = k.info ? "step-error" : "step-error text-alert";
            this.errors.setValueForKeyPath(d, n.replace(/\./g, "_") + "_alert");
            this.errors.setValueForKeyPath(f.normal.join(h || " "), n.replace(/\./g, "_"))
        }
        if ($(o.key)) {
            if (o.key.indexOf(".") < 0) {
                coherent.Animator.scrollTo.delay(this.LOADING_INDICATOR_DELAY, o.key)
            }
        }
    }
    if (f.acknowledgement || f.ackRefresh) {
        a = $(b);
        if (a) {
            a.parentNode.style.display = "none"
        }
    }
    if (f.acknowledgement) {
        this.processIncomingOverlay({overlay: {type: "acknowledgement",header: $("bopis-title").innerHTML,html: f.acknowledgement.join("<br>"),actions: $("overlay-continue").innerHTML}})
    }
    if (f.ackRefresh) {
        this.processIncomingOverlay({overlay: {type: "acknowledgement",header: $("bopis-title").innerHTML,html: f.ackRefresh.join("<br>"),actions: $("overlay-continue").innerHTML}})
    }
},processIncomingOverlay: function(d) {
    var f = this.getOverlayOptionsFactories(), a = f.DEFAULT_OPTIONS, b;
    if ("overlay" in d) {
        if (!d.overlay) {
            if (this.overlayView) {
                this.overlayView.teardown();
                this.overlayView = null
            }
            if (this.overlay && this.overlay.visible) {
                this.overlay.hide();
                this.overlay.visible = false
            }
        } else {
            b = d.overlay.type || "overlay";
            if (b) {
                var c = "create" + b.titleCase();
                if (f[c]) {
                    a = f[c].call(this, d.overlay)
                }
            }
            this.renderOverlay(d, a)
        }
    }
},renderOverlay: function(c, a) {
    var b = c.using || c.overlay.type || "overlay";
    Event.onLoad(function() {
        if (b !== (this.overlay && this.overlay.type)) {
            if (this.overlay) {
                this.overlay.hide()
            }
            this.createOverlay(a, c);
            this.overlay.type = b
        }
        this.overlay.setDelegate(this.getOverlayDelegate(c));
        this.overlay.display(a);
        this.overlay.visible = true
    }.bind(this, []))
},createOverlay: function(a, b) {
    var c = document.createElement("div");
    c.className = "overlay";
    document.body.appendChild(c);
    if (a.ctr) {
        this.overlay = new a.ctr(c)
    } else {
        this.overlay = new apple.CompoundOverlay(c)
    }
},presentIdError: function(d, a, c) {
    var b = $(d);
    if (b) {
        b.style.display = "";
        b.innerHTML = a;
        if (c === "info") {
            Element.removeClassName(b, "text-alert")
        } else {
            if (c === "error") {
                Element.addClassName(b, "text-alert");
                if (this.ariaAlert) {
                    this.ariaAlert.say(a)
                }
            }
        }
    }
},clearIdError: function(b) {
    var a = $(b);
    if (a) {
        a.style.display = "none";
        a.innerHTML = ""
    }
},enableClickTarget: function(b) {
    var a = $(b);
    if (a) {
        Element.removeClassName(a, "disabled")
    }
},disableClickTarget: function(b) {
    var a = $(b);
    if (a) {
        Element.addClassName(a, "disabled")
    }
},enableSubmitTarget: function(b) {
    var a = $(b);
    if (a) {
        Event.observe(a, "submit", this.boundHandleEvent)
    }
},disableSubmitTarget: function(b) {
    var a = $(b);
    if (a) {
        Event.stopObserving(a, "submit", this.boundHandleEvent)
    }
},handleValidationEvent: function(g, a, c) {
    var b, d, f;
    d = c.startPoint;
    f = c.endPoint;
    b = c._element && c._element.validKey;
    if (b) {
        this.updateValidKey(c, g)
    }
    if (g.oldValue && g.newValue && g.oldValue.length >= (f - d + 1)) {
        if (g.oldValue.slice(d, f) != g.newValue.slice(d, f)) {
            this.performEvent(c)
        }
    }
},updateValidKey: function(g, h) {
    if (this.ignoreEvents) {
        return
    }
    var b, f, c, d;
    b = this.obtainViewForEvent(g);
    f = g._element && g._element.validKey;
    if (f) {
        c = (b && b.validate() instanceof coherent.Error) ? false : true;
        d = this.content.valueForKeyPath(f);
        this.content.setValueForKeyPath(c, f);
        if (h && (d === c)) {
            var a = this.__rangeModified(h.oldValue, h.newValue, g.startPoint, g.endPoint);
            if (a && h.oldValue.length >= (g.endPoint - g.startPoint + 1)) {
                this.performEvent(g)
            }
        }
    }
},__rangeModified: function(a, b, c, k) {
    var f = false;
    if (a && c >= 0 && k >= 0 && (c < k)) {
        var d = a.length, h = b.length;
        if (d < c && h < c) {
            return f
        }
        if (d < c) {
            if (h >= c) {
                f = true
            }
        } else {
            if (h < c) {
                f = true
            }
        }
        if (!f) {
            var m = c;
            var g = (d < k) ? d : (k + 1);
            a = a.slice(m, g);
            g = (h < k) ? h : (k + 1);
            b = b.slice(m, g);
            if (b !== a) {
                f = true
            }
        }
    }
    return f
},handleChangeEvent: function(g, c) {
    if (this.ignoreEvents) {
        return
    }
    var f, b, a, d;
    Set.forEach(this.modules, function(h) {
        f = Object.extend(f, this.events[h].change)
    }, this);
    b = f[c];
    if (b) {
        b.forEach(function(h) {
            switch (h.event) {
                case "valid":
                    a = this.obtainViewForEvent(h);
                    if (!a || a.validate() instanceof coherent.Error) {
                        return
                    }
                    d = h._element && h._element.validKey;
                    if (d && this.content.valueForKeyPath(d) === false) {
                        return
                    }
                    break;
                case "invalid":
                    a = this.obtainViewForEvent(h);
                    if (a && !(a.validate() instanceof coherent.Error)) {
                        return
                    }
                    d = h._element && h._element.validKey;
                    if (d && this.content.valueForKeyPath(d) === true) {
                        return
                    }
                    break;
                case "active":
                    if (!this.content.valueForKeyPath(h.activeKey)) {
                        return
                    }
                    break;
                case "inactive":
                    if (this.content.valueForKeyPath(h.activeKey)) {
                        return
                    }
                    break;
                default:
                    break
            }
            this.performEvent(h)
        }, this)
    }
},performDefaultFormAction: function(a) {
    this.performAction(a + ".action")
},_handleEvent: function(a) {
    if (this.ignoreEvents) {
        return
    }
    var m = a.target || a.srcElement, f, d, k = Object.clone(this.staticEvents), h, b, c, g;
    if (this.overlay) {
        g = this.overlay.viewElement()
    }
    d = Element.locateAncestor(m, function(n) {
        return n == g
    }) || this.viewElement();
    Set.forEach(this.modules, function(n) {
        h = Object.extend(h, this.events[n][a.type])
    }, this);
    for (b in h) {
        if (k[b]) {
            k[b] = k[b].concat(h[b])
        } else {
            k[b] = h[b]
        }
    }
    do {
        if (m.nodeName === "A" && m.disabled) {
            Event.stop(a)
        } else {
            c = k[m.id];
            if (c && !m.disabled) {
                if (!Element.isVoidElement(m)) {
                    Event.stop(a)
                }
                f = m;
                c.forEach.bindAndDelay(c, 50, function(n) {
                    this.performEvent(n, f)
                }, this)
            }
        }
    } while (m != d && (m = m.parentNode))
},eventToOverlayOptions: function(a) {
    var b = {sourceId: a.target,displayCloseWidget: a.hasCloseButton};
    if (a.classname) {
        b.classname = a.classname
    }
    if (a.dialog) {
        b.dialog = true
    }
    return b
},_getOmniturePageName: function(c) {
    var b, a;
    if (c && c.indexOf("omniture") !== -1) {
        b = c.replace(/omniture\.(.*?)$/i, "omniture");
        b = b ? this.content.valueForKeyPath(b) : "";
        a = b ? b.pageName : ""
    }
    return a
},performEvent: function(n, b) {
    var d, a, m, c, h = Element.addClassName, k = Element.removeClassName;
    if (n.event !== "active" && n.event !== "inactive" && n._element && (n._element.active != undefined) && !n._element.active) {
        return
    }
    if (n.omniture) {
        m = n.omniture;
        c = m.pageName;
        if (typeof (m) == "string") {
            c = this._getOmniturePageName(m);
            m = this.content.valueForKeyPath(m)
        }
        if (m) {
            apple.metrics.fireEventCollection(m, c)
        }
    }
    switch (n.perform) {
        case "action":
            if (this.validateAction(n.target)) {
                d = $(n.defaultButtonId || n._element.defaultButtonId || n.id || n._element.id);
                if (d) {
                    d.disabled = true;
                    a = this.setLoadingMode.bindAndDelay(this, this.LOADING_INDICATOR_DELAY, d);
                    this.loadingCallbacks.push(function() {
                        window.clearTimeout(a);
                        d.disabled = false;
                        k(d, "loading")
                    })
                }
                this.performAction(n.target)
            }
            break;
        case "method":
            if (this[n.target] && "function" == typeof (this[n.target])) {
                this[n.target](n, b)
            } else {
                throw new Error("Method not found for event handler: " + n.target)
            }
            break;
        case "set":
            this.content.setValueForKeyPath(n.value, n.target);
            break;
        case "show":
            switch (n.using) {
                case "overlay":
                    this.renderOverlay(n, this.eventToOverlayOptions(n));
                    break;
                default:
                    d = $(n.target);
                    if (d) {
                        Element.show(d)
                    }
                    break
            }
            break;
        case "hide":
            d = $(n.target);
            if (d) {
                Element.hide(d)
            }
            break;
        case "focus":
            d = $(n.target);
            var g = 10;
            if (d) {
                var f = (function(o) {
                    if (Element.visible(o)) {
                        o.focus()
                    } else {
                        g-- && window.setTimeout(f, 50)
                    }
                }).bind(this, d);
                window.setTimeout(f, 0)
            }
            break;
        case "redirect":
            window.location.href = n.target;
            break;
        default:
            break
    }
},performAction: function(c, h) {
    if (this.__request) {
        try {
            this.__request.cancel()
        } catch (k) {
        }
    }
    var g = this.content.valueForKeyPath(c);
    if (!g) {
        throw new Error("Action not found at provided keypath: " + c)
    }
    var b, f, m, n, a;
    if ("string" == typeof g) {
        b = g;
        f = h
    } else {
        if (g.omniture) {
            var o = g.omniture, d = o.pageName;
            if (typeof (o) == "string") {
                d = this._getOmniturePageName(o);
                o = this.content.valueForKeyPath(o)
            }
            if (o) {
                apple.metrics.fireEventCollection(o, d)
            }
        }
        b = g.url;
        m = this;
        f = this.collectAndReduceFormFields(g.form, h)
    }
    if (!b) {
        throw new Error("Action URL not found at provided keypath: " + c)
    }
    this.lastActionPerformed = g;
    this.__request = this.content.sendRequest(b, f)
},collectAndReduceFormFields: function(a, b) {
    var c = this;
    return this._collectFieldsForForm(a).reduce(function(h, g) {
        g = c._augmentFieldBeforePerformAction(g);
        var f;
        if (g.value) {
            f = g.value
        } else {
            if (g.key) {
                f = c.valueForKeyPath("content." + g.key)
            }
        }
        var d = g.name || g.id;
        h[d] = h[d] || f;
        return h
    }, b || {})
},validateAction: function(b) {
    var f = this.content.valueForKeyPath(b);
    if (!f) {
        throw new Error("Action not found at provided keypath: " + b)
    }
    var d = f.form;
    if (!f.form || ("validate" in f && f.validate === false)) {
        return true
    }
    var a = this._collectFieldsForForm(d).map(function(k) {
        var h, g;
        if (k && (h = $(k.id)) && (g = coherent.View.fromNode(h))) {
            return g
        } else {
            return {validate: function() {
                return true
            }}
        }
    }, this);
    var c = a.reduce(function(k, h) {
        if (h && h.validate) {
            var g = (h.validate() instanceof coherent.Error) || h.validationError;
            if (g && k) {
                k = false;
                if (h.focus) {
                    h.blur();
                    (function() {
                        h.focus()
                    }).delay(100)
                }
            }
        }
        return k
    }, true);
    return c
},focusPreviousFirstResponder: function() {
    if (this.__lastFirstResponder__) {
        var a = $(this.__lastFirstResponder__);
        if (a && a.focus) {
            try {
                a.focus()
            } catch (b) {
            }
        }
    }
    this.__lastFirstResponder__ = null
},obtainViewForEvent: function(m) {
    var a = this.forms, d = m._element && (m._element.id || m._element.name), n, b, g, k, h, c;
    for (n in a) {
        b = a[n];
        if (!b.fields) {
            continue
        }
        g = b.fields;
        c = g.length;
        for (h = 0; h < c; h++) {
            k = g[h];
            if (k.key == m.key) {
                if (d && d != (k.id || k.name)) {
                    continue
                }
                return b._viewCache[k.id || k.name]
            }
        }
    }
    return null
},setLoadingMode: function(a) {
    if (!Element.isVoidElement(a)) {
        var b = Element.query(a, "b.spinner");
        if (!b) {
            b = document.createElement("b");
            b.setAttribute("class", "spinner");
            a.appendChild(b)
        }
        Element.addClassName(a, "loading")
    }
},_augmentFieldBeforePerformAction: function(a) {
    return a
},_collectFieldsForForm: function(b, a) {
    if (arguments.length === 1) {
        a = b;
        b = []
    }
    var c = this.valueForKeyPath("content." + a);
    if (c && (c.active || c.active == undefined)) {
        if (c.fields) {
            c.fields.forEach(function(d) {
                if (d && !d.disabled) {
                    b.push(d)
                }
            })
        }
        if (c.subForms) {
            c.subForms.forEach(this._collectFieldsForForm.bind(this, b))
        }
    }
    return b
},reBuildActivations: function() {
    var d = this.keyToActivationsMap = {}, k = this.activationKeyToItemMap = {}, g = "shipping._forms.shippingAddressForm", a = "billing._forms.billingAddressForm", b, h, m;
    if (this.content.valueForKeyPath(g)) {
        b = g;
        h = g + ".fields"
    } else {
        if (this.content.valueForKeyPath(a)) {
            b = a;
            h = a + ".fields"
        }
    }
    if (this.content.valueForKeyPath(b) && this.content.valueForKeyPath(h)) {
        for (var f = 0; f < this.content.valueForKeyPath(h).length; f++) {
            m = this.content.valueForKeyPath(h)[f];
            if (m.activations) {
                m.activations.forEach(c(this.content.valueForKeyPath(b), m, this.content), this)
            }
        }
    }
    function c(o, q, n) {
        return function(t) {
            if (!t.validations) {
                return
            }
            var u = this.getFieldFactories()._createFormatterForValidations, r = q || o;
            t._formatter = u(t.validations);
            if (k[t.key]) {
                k[t.key].push(r)
            } else {
                k[t.key] = [r]
            }
            if (d[t.key]) {
                d[t.key].push(t)
            } else {
                this.content.addObserverForKeyPath(this, this.observeActivationValueChange, t.key);
                d[t.key] = [t]
            }
            this.validateActivation(t, n)
        }
    }
},ReplaceView: Class.create(coherent.View, {observeHtmlChange: function(c, b, a) {
    this.base(c, b, a);
    this.sendActionToView("setHtmlCallback")
}})});
Package("apple");
(function(c, d) {
    var a = c.apple, f = Class.create(a.transaction.ViewController, {init: function() {
        var g = this;
        setTimeout(function() {
            var h = Element.query(g.viewElement(), "#sorry-message-content #button1");
            if (h) {
                Event.observe(h, "click", g.fireContinueEvent.bind(g))
            }
        }, 50)
    },fireContinueEvent: function(k) {
        Event.stop(k);
        var g = this.getAnchor(k.target), h = (g.dataset && g.dataset.evar6) || g.getAttribute("data-evar6");
        if (h) {
            var m = h.split("|");
            a.metrics.fireMicroEvent({eVar: "eVar6",page: m[0],feature: m[2],action: m[3]})
        }
        setTimeout(function() {
            window.location = g.href
        }, 50)
    },getAnchor: function(h) {
        var g;
        Element.locateAncestor(h, function(k) {
            if (k.id === "button1") {
                g = k
            }
        });
        return g
    }});
    function b(g) {
        return new f(g)
    }
    f.create = b;
    a.SorryViewController = f;
    $P(f, "create", "Initialize")
})(this, coherent);
apple.transaction.TransactionButton = Class.create(coherent.Button, {exposedBindings: ["busy"],__viewClassName__: "TransactionButton",init: function() {
    this.base();
    this.spinner = this.createSpinnerNode()
},createSpinnerNode: function() {
    var a = document.createElement("b");
    a.setAttribute("class", "spinner");
    this.viewElement().appendChild(a);
    return a
},observeBusyChange: function(c, b, a) {
    this.busyChange(c.newValue)
},busyChange: function(c) {
    var d = Element.addClassName, f = Element.removeClassName, b = Element.hasClassName, a = this.viewElement(), h = this.spinner, g = "busy";
    if (!c) {
        f(a, g);
        f(h, g)
    } else {
        if (!b(a, g)) {
            d(a, g)
        }
        if (!b(h, g)) {
            d(h, g)
        }
    }
    this.disabled = a.disabled = !!c
}});
(function() {
    var a = apple.transaction.ViewController.prototype.contentSetCallback;
    apple.transaction.ViewController.creditType;
    apple.transaction.ViewController.prototype.contentSetCallback = function(b) {
        if (b.creditTypes) {
            this.processIncomingCreditTypes(b.creditTypes)
        }
        a.call(this, b)
    };
    apple.transaction.ViewController.prototype.processIncomingCreditTypes = function(c) {
        c = c._forms || c;
        var b = new coherent.KVO(), d = c.mutableKeys(), f, g, h;
        d.forEach(function(k) {
            if (!c[k].fields) {
                return
            }
            b[k] = g = new coherent.KVO();
            c[k].fields.forEach(function(m) {
                h = m.key.split(".").pop();
                g[h] = m.validations
            })
        });
        this.creditTypes = b
    }
})();
Package("apple");
apple.SessionExtensionController = Class.create(coherent.Controller, {exposedBindings: ["extensionUrl", "extensionConfirmationUrl", "sessionExpiredUrl", "sessionAlertTimer", "canBeExtended", "sessionAutoRenewTimer", "sessionLength"],ticking: false,sessionTimerMargin: 10000,sessionExpiresTime: 0,checkSessionRenewFailures: 0,checkSessionRenewMaxFailures: 3,ineractionEvents: ["mousedown", "touchstart", "scroll", "keydown"],isAutomaticExtension: false,userIsActive: false,constructor: function(b, a) {
    this.__relativeSource = a;
    this.base(b, a);
    this.renewSession = this.renewSession.bind(this);
    this.ineractionListener = this.ineractionListener.bindAsEventListener(this);
    this.addObserverForKeyPath(this, this.sessionLengthChange.bind(this), "sessionLength");
    this.addObserverForKeyPath(this, this.sessionExpiredListener.bind(this), "sessionLength");
    this.addObserverForKeyPath(this, this.autoRenewListener.bind(this), "sessionLength");
    this.addObserverForKeyPath(this, this.sessionExtensionListener.bind(this), "sessionLength")
},autoRenewListener: function(a) {
    if ((a.newValue - this.sessionTimerMargin) > this.sessionAutoRenewTimer) {
        return
    }
    if (!this.interactionListenerEnabled && !this.userIsActive) {
        this.enableInteractionListener()
    }
},sessionExtensionListener: function(b) {
    if (!this.canBeExtended || this.ignoreActions) {
        return
    }
    if ((b.newValue - this.sessionTimerMargin) > this.sessionAlertTimer) {
        return
    }
    if (this.userIsActive) {
        this.isAutomaticExtension = true;
        this.renewSession()
    } else {
        if (!this.userIsActive) {
            var a = this;
            this.checkSessionRenew(function(c) {
                a.alertCallback(a.renewSession, c)
            })
        }
    }
},sessionExpiredListener: function(a) {
    if (a.newValue <= 0) {
        this.sessionExpiredAction()
    }
},ineractionListener: function(a) {
    this.userIsActive = true;
    this.disableInteractionListener()
},enableInteractionListener: function() {
    this.ineractionEvents.forEach(function(a) {
        Event.observe(window, a, this.ineractionListener)
    }, this);
    this.interactionListenerEnabled = true
},disableInteractionListener: function() {
    this.ineractionEvents.forEach(function(a) {
        Event.stopObserving(window, a, this.ineractionListener)
    }, this);
    this.interactionListenerEnabled = false
},checkSessionRenew: function(c, a) {
    var b = this;
    this.ignoreActions = true;
    this.pendingCheckSessionRenew = JSONRPC.get(this.extensionConfirmationUrl).addMethods(function(f) {
        if (!f.sto) {
            return
        }
        var d = f.sto.params;
        if (d.sessionLength >= b.sessionLength + b.sessionTimerMargin) {
            b.updateSessionData(d)
        } else {
            if (d.sessionLength <= 0) {
                b.sessionExpiredAction()
            } else {
                if (d.sessionCanBeExtended) {
                    c && c(f)
                } else {
                    if (!d.sessionCanBeExtended) {
                        a && a(f)
                    }
                }
            }
        }
        b.checkSessionRenewFailures = 0
    }, function() {
        b.checkSessionRenewFailures++;
        if (b.checkSessionRenewFailures < b.checkSessionRenewMaxFailures) {
            b.checkSessionRenew(c, a)
        }
    })
},sessionLengthChange: function(a) {
    if (typeof a.newValue !== "number") {
        return
    }
    if (a.newValue > a.oldValue || a.newValue <= (a.oldValue - 10000)) {
        this.resetSessionCounter()
    }
},resetSessionCounter: function() {
    if (this.interactionListenerEnabled) {
        this.disableInteractionListener()
    }
    this.userIsActive = false;
    this.isAutomaticExtension = false;
    this.ignoreActions = false;
    this.setSessionCounter()
},updateSessionData: function(a) {
    this.setValueForKey(a.sessionLength, "sessionLength");
    this.setValueForKey(a.sessionCanBeExtended, "canBeExtended")
},renewSession: function() {
    var a = this;
    this.ignoreActions = true;
    apple.metrics.fireMicroEvent({eVar: "eVar21",slot: "Accessibility",feature: "Session Extension",action: this.isAutomaticExtension ? "Automatic" : "Manual"});
    this.pendingSessionRenew = JSONRPC.get(this.extensionUrl).addMethods(function(c) {
        a.ignoreActions = false;
        if (!c.sto) {
            return
        }
        var b = c.sto.params;
        if (b.sessionLength <= 0) {
            a.sessionExpiredAction()
        } else {
            a.updateSessionData(b)
        }
    })
},sessionExpiredAction: function() {
    window.location.href = this.sessionExpiredUrl;
    this.teardown()
},alertCallback: function(a) {
},decreaseSessionLength: function() {
    this.setValueForKey(this.sessionExpiresTime - new Date().getTime(), "sessionLength")
},setSessionCounter: function() {
    this.sessionExpiresTime = new Date().getTime() + this.valueForKey("sessionLength");
    if (!this.tick) {
        this.ticking = true;
        this.tick = window.setInterval(this.decreaseSessionLength.bind(this), 1000)
    }
},teardown: function() {
    window.clearInterval(this.tick);
    this.disableInteractionListener();
    this.userIsActive = false;
    this.ignoreActions = false
}});
Package("apple.widget");
apple.widget.AccessibleWhatsThis = Class.create(coherent.View, {isDisplayed: false,init: function() {
    var b = this.viewElement(), a = Element.query(b, ".toggle"), c = Element.query(b, ".info"), g = Element.assignId(c), f = a && a.innerHTML, d = document.createElement("a");
    d.href = "#";
    d.className = "toggle";
    d.innerHTML = f;
    d.setAttribute("aria-describedby", g);
    a.parentNode.replaceChild(d, a);
    c.setAttribute("aria-hidden", "true");
    c.setAttribute("role", "tooltip");
    this.toggleEl = d;
    this.contentEl = c;
    this.touchstartEvent = this.touchstartEventHandler.bindAsEventListener(this);
    coherent.page.addTrackingInfo(this.viewElement().id, {owner: this,onmouseenter: this.showTooltip,onmouseleave: this.hideTooltip});
    Event.observe(this.toggleEl, "focus", this.showTooltip.bindAsEventListener(this));
    Event.observe(this.toggleEl, "blur", this.hideTooltip.bindAsEventListener(this));
    Event.observe(this.toggleEl, "click", this.clickEventHandler.bindAsEventListener(this));
    Event.observe(this.toggleEl, "keyup", this.keyupEventHandler.bindAsEventListener(this));
    Event.observe(document, "touchend", this.touchstartEvent);
    Event.observe(document, "touchstart", this.touchstartEvent)
},showTooltip: function() {
    this.contentEl.setAttribute("aria-hidden", "false");
    Element.addClassName(this.viewElement(), "showTooltip");
    this.isDisplayed = true
},hideTooltip: function() {
    this.contentEl.setAttribute("aria-hidden", "true");
    Element.removeClassName(this.viewElement(), "showTooltip");
    this.isDisplayed = false
},clickEventHandler: function(a) {
    this.showTooltip();
    Event.stop(a)
},keyupEventHandler: function(a) {
    if (a.which === 27) {
        this.hideTooltip();
        return false
    }
},touchstartEventHandler: function(a) {
    var c = a.target, b = this.viewElement(), d = false;
    while (c && c !== document.documentElement) {
        if (c == b) {
            d = true;
            break
        }
        c = c.parentNode
    }
    if (this.isDisplayed && !d) {
        this.hideTooltip()
    } else {
        if (d) {
            this.showTooltip()
        }
    }
},teardown: function() {
    Event.stopObserving(document, "touchstart", this.touchstartEvent);
    delete coherent.page.__hoverTrackingIds[this.viewElement().id];
    this.base()
}});
apple.widget.AccessibleWhatsThis.loadAll = function(f, k) {
    if (arguments.length < 2) {
        k = f;
        f = document
    }
    var m = Element.queryAll(f, k), c, d, b, a, n;
    for (var g = 0, h = m.length; g < h, c = m[g]; g++) {
        d = Element.query(c, ".toggle");
        b = Element.query(c, ".info");
        a = c.getAttribute("rel");
        relEl = a ? Element.query("#" + a) : null;
        if (!(/infobubble|info-bubble-link|bubble-link/.test(c.className)) && d && b && !relEl) {
            var o = coherent.View.fromNode(c);
            if (o) {
                o.teardown()
            }
            new apple.widget.AccessibleWhatsThis(c)
        }
    }
};
(function() {
    var a = apple.transaction.ViewController.prototype, b = a.setHtmlCallback;
    a.setHtmlCallback = function(d) {
        var c = d.viewElement ? d.viewElement() : d;
        b(c);
        apple.widget.HelpMessage.loadAll.delay(0, c, ".whats-this");
        if (apple.widget.AccessibleWhatsThis) {
            apple.widget.AccessibleWhatsThis.loadAll.delay(0, c, ".whats-this")
        }
    }
})();
Event.onLoad(function() {
    apple.widget.HelpMessage.loadAll(document, ".cc-promo");
    if (apple.widget.AccessibleWhatsThis) {
        apple.widget.AccessibleWhatsThis.loadAll(document, ".whats-this")
    }
});
Package("apple.transaction");
apple.transaction.InfoBubble = Class.create(apple.widget.HelpMessage, {helpClassName: "infobubble",container: Part(".container"),content: Part(".content"),target: Part(".target"),table: Part(".infobubble"),innerHTML: '<div class="container"><table class="infobubble"><tr class=""><td class="top-left-corner"><span></span></td><td class="top-center"><span></span></td><td class="top-right-corner"><span></span></td></tr><tr class=""><td class="left-center"></td><td class="center-center"><div class="content"></div></td><td class="right-center"></td></tr><tr class=""><td class="bottom-left-corner"></td><td class="bottom-center"></td><td class="bottom-right-corner"></td></tr></table><span class="target"></span></div>',init: function() {
    this.base();
    this.setPointerClass();
    this.setContentClass()
},setPointerClass: function() {
    var c = this.getSrcElement(), b = this.getHorizontalParam(c), g = this.getVerticalParam(c), d = (g === "bottom") ? "top" : "bottom", a = (b === "left") ? "right" : "left", f = (g !== "") ? d : a;
    Element.addClassName(this.table(), "point-" + f)
},setContentClass: function() {
    var c = this.content(), a = "data-content-class", b = this.getSrcElement().getAttribute(a);
    if (b) {
        Element.addClassName(c, b)
    }
},setContentWidth: function() {
    var a = document.getElementById(this.srcElementId), b = document.getElementById(a.getAttribute("rel")), c = b.style.width;
    if (!c) {
        c = Element.getStyle(b, "width");
        if (c == "0px") {
            c = ""
        }
    }
    if (c) {
        Element.setStyle(this.content(), "width", c)
    }
},__position: function() {
    var f = this.viewElement(), n = this.container(), b = Element.getRect(n), g = document.getElementById(this.srcElementId), a = Element.getRect(g), m = this.getHorizontalParam(g), c = this.getVerticalParam(g), k = this.table(), h, d;
    if (c === "top") {
        d = (a.left + (a.width / 2)) - (b.width / 2);
        h = a.top - b.height + 16
    } else {
        if (c === "bottom") {
            d = (a.left + (a.width / 2)) - (b.width / 2);
            h = a.bottom
        } else {
            if (m == "left") {
                h = (a.top + (a.height / 2)) - (b.height / 2);
                d = a.left - b.width + 7
            } else {
                if (m == "right") {
                    h = (a.top + (a.height / 2)) - (b.height / 2);
                    d = a.right - 7
                }
            }
        }
    }
    Element.setStyles(f, {top: h + "px",left: d + "px"})
},getHorizontalParam: function(a) {
    return (Element.hasClassName(a, "left")) ? "left" : (Element.hasClassName(a, "right")) ? "right" : ""
},getVerticalParam: function(a) {
    return (Element.hasClassName(a, "top")) ? "top" : (Element.hasClassName(a, "bottom")) ? "bottom" : ""
}});
apple.transaction.InfoBubble.loadAll = function(f, g) {
    var c = f ? Element.queryAll(f, g) : Element.queryAll(f), b = c.length, a, d;
    for (d = 0; d < b; d++) {
        a = coherent.View.fromNode(c[d]);
        if (a) {
            a.teardown()
        }
        new apple.transaction.InfoBubble(c[d])
    }
};
(function() {
    var b = apple.transaction.ViewController.prototype, a = b.processIncomingHTMLItem, c = b.init;
    b.init = function() {
        c.call(this);
        apple.transaction.InfoBubble.loadAll(this.viewElement(), ".info-bubble-link, .bubble-link")
    };
    b.processIncomingHTMLItem = function(d) {
        a.call(this, d);
        apple.transaction.InfoBubble.loadAll($(d.id), ".info-bubble-link, .bubble-link")
    }
})();
(function() {
    apple.transaction.ViewController.prototype.didSelectToggleGroupItem = function(c) {
        var d = c && c.item && c.item.valueForKeyPath("key");
        switch (d) {
            case "recentAddress.address.recentlyUsedMatch":
                this.performAction("recentAddress._actions.selectAddress", {selectedIndex: c.selectedIndex});
                break;
            case "recentAddress.address.recentlyUsedMatchOverlay":
                if (window.addEventListener) {
                    window.addEventListener("click", function() {
                        c.isDelegateBusy = false
                    }, false)
                } else {
                    var b = window.attachEvent ? "onclick" : "click";
                    var a = function(f) {
                        c.isDelegateBusy = false
                    };
                    document.attachEvent(b, a)
                }
                break;
            default:
                break
        }
    }
})();
(function() {
    apple.transaction.ViewController.prototype.setIsento = function(a) {
        var g = this.content, c = a.chkIsentoKeyPath ? a.chkIsentoKeyPath : "shipping.address.metadata-isento", h = a.isentoValKeyPath ? a.isentoValKeyPath : "shipping.address.isentotxt", f = a.isentoFieldKeyPath ? a.isentoFieldKeyPath : "shipping.address.metadata-ie", d = g.valueForKeyPath(c), b = g.valueForKeyPath(h);
        if (d) {
            g.setValueForKeyPath(b, f)
        } else {
            g.setValueForKeyPath("", f)
        }
    }
})();
Package("apple.transaction");
apple.transaction.FAQView = Class.create(coherent.View, {exposedBindings: ["step"],baseFaqClass: "",init: function() {
    this.baseFaqClass = this.viewElement().className.split(/\s/)[0]
},onclick: function(a) {
    var b = a.target || a.srcElement;
    if (b.tagName.toLowerCase() == "a") {
        Event.stop(a);
        window.open(b.getAttribute("href"), "_blank", "width=526,height=440")
    }
},observeStepChange: function(f, d, c) {
    if (f.newValue) {
        var a = this.viewElement(), b = this.baseFaqClass + " " + f.newValue;
        a.className = b
    }
}});
apple.CompoundOverlay = Class.create(coherent.Overlay, {innerHTML: '<div class="container"><div class="header h1" style="display: none;"></div><div class="content"></div><div class="actions" style="display: none;"></div></div><a href="#" class="close">close</a>',header: Part(".header"),actions: Part(".actions"),minHeight: 110,init: function() {
    this.viewElement().setAttribute("tabindex", -1);
    this.base.apply(this, arguments)
},display: function(a) {
    if (a.header) {
        this.displayHeader(a)
    }
    if (a.actions) {
        this.displayActions(a)
    }
    this.base(a)
},displayHeader: function(a) {
    var b = this.header();
    b.style.display = "block";
    b.innerHTML = a.header
},displayActions: function(a) {
    var b = this.actions();
    b.style.display = "block";
    b.innerHTML = a.actions
},getDisplayDimensions: function(a) {
    var b = this.base(a);
    b.height = Element.getDimensions(this.viewElement()).height;
    return b
},__show: function(d) {
    var b = d.dimensions.width, v = d.dimensions.height, a = this.container(), r = this.viewElement(), t = "px", k = Element.getViewport(), h = Element.setStyle, q = Element.setStyles, g = coherent.Animator.setStyles, o = Math.max(v / 2 + 15, Math.round(k.height / 2 + k.top)) + t, m = {display: "",position: "absolute",left: "50%",top: o}, f = {opacity: 1}, n = this;
    this.__grow = d.grow;
    if (this.__grow) {
        m.width = this.minWidth + t;
        m.height = this.minHeight + t;
        m.marginLeft = (-this.minWidth / 2) + t;
        m.marginTop = (-this.minHeight / 2) + t;
        f.width = b + t;
        f.height = v + t;
        f.marginLeft = (-b / 2) + t;
        f.marginTop = (-v / 2) + t
    } else {
        m.width = b + t;
        m.marginLeft = (-b / 2) + t;
        m.marginTop = (-v / 2) + t
    }
    if (d.dialog || d.alertDialog) {
        this.__enableDialog("alertdialog")
    }
    if (d.obscurePage) {
        this.__obscurePage()
    }
    function u() {
        if (d.scripts) {
            coherent.Scripts.install(d.scripts)
        }
        d.scripts = null
    }
    q(r, m);
    function c() {
        n.sendToDelegate("willShowOverlay");
        g(r, f, {duration: 250,callback: function() {
            u();
            n.setValueForKey(true, "visible");
            n.sendToDelegate("didShowOverlay");
            n.enableTabHandler()
        }})
    }
    coherent.Overlay.__currentOverlay = this;
    c.delay(100)
}});
Package("apple.cart");
apple.cart.SummaryView = Class.create(coherent.View, (function() {
    var a = {subtotal: {"#cart-summary-subtotal": coherent.View({htmlBinding: "summary.subtotal"})},cart: {".line-subtotal": coherent.View({visibleBinding: "summary.cart-subtotal-enabled"}),"#cart-summary-subtotal": coherent.View({htmlBinding: "summary.subtotal"}),".line-shipping": coherent.View({visibleBinding: "summary.shipping.enabled"}),"#shipping-label-free": coherent.View({visibleBinding: "summary.shipping.free"}),"#shipping-label-notfree": coherent.View({visibleBinding: "summary.shipping.free(NOT)"}),"#sidebar-summary-shipping-upsell": coherent.View({visibleBinding: "summary.addForFreeShipping",animated: true,htmlBinding: "summary.addForFreeShipping"}),"#cart-summary-shipping-cost": coherent.View({htmlBinding: "summary.shipping.cost",classBinding: "shippingClassName"}),".line-savings": coherent.View({visibleBinding: "summary.savings"}),"#cart-summary-savings-amount": coherent.View({htmlBinding: "summary.savings",animated: true,preUpdateAnimationDuration: 100,postUpdateAnimationDuration: 500,postUpdateAnimationDelay: 1000}),".line-tax": coherent.View({visibleBinding: "summary.tax"}),".tax-edit": coherent.View({visibleBinding: "summary.tax-edit"}),"#cart-summary-tax-amount": coherent.View({htmlBinding: "summary.tax"}),"#cart-summary-order-total": coherent.View({visibleBinding: "summary.total"}),"#cart-summary-order-total-value": coherent.View({htmlBinding: "summary.total",animated: true,preUpdateAnimationDuration: 100,postUpdateAnimationDuration: 500,postUpdateAnimationDelay: 1000}),"#cart-summary-amount-paid-withPoints": coherent.View({visibleBinding: "summary.amount-paid-withPoints-enabled"}),"#cart-summary-amount-paid-withCard": coherent.View({visibleBinding: "summary.amount-paid-withPoints-enabled"}),"#cart-summary-amount-paid-withPoints-value": coherent.View({htmlBinding: "summary.amount-paid-withPoints",animated: true,preUpdateAnimationDuration: 100,postUpdateAnimationDuration: 500,postUpdateAnimationDelay: 1000}),"#cart-summary-amount-paid-withCard-value": coherent.View({htmlBinding: "summary.amount-paid-withCard",animated: true,preUpdateAnimationDuration: 100,postUpdateAnimationDuration: 500,postUpdateAnimationDelay: 1000}),".line-total-savings": coherent.View({visibleBinding: "summary.totalSavings"}),"#cart-summary-total-savings-value": coherent.View({htmlBinding: "summary.totalSavings"}),".line-bank-transfer-savings": coherent.View({visibleBinding: "summary.bank-transfer-savings"}),"#cart-summary-bank-transfer-savings-value": coherent.View({htmlBinding: "summary.bank-transfer-savings"}),".line-taxexclusive-subtotal": coherent.View({visibleBinding: "summary.taxExclusiveSubtotal"}),"#cart-summary-taxexclusive-subtotal-value": coherent.View({htmlBinding: "summary.taxExclusiveSubtotal"}),".line-taxexclusive-tax": coherent.View({visibleBinding: "summary.taxExclusiveTax"}),"#cart-summary-taxexclusive-tax-value": coherent.View({htmlBinding: "summary.taxExclusiveTax"}),"#cart-summary-order-total-without-installment": coherent.View({visibleBinding: "summary.totalWithoutInstallmentCost"}),"#cart-summary-order-total-without-installment-value": coherent.View({htmlBinding: "summary.totalWithoutInstallmentCost"}),"#cart-summary-installment": coherent.View({visibleBinding: "summary.installmentsSummaryAmount"}),"#cart-summary-installment-term": coherent.View({htmlBinding: "summary.installmentsSummaryTerm"}),"#cart-summary-installment-value": coherent.View({htmlBinding: "summary.installmentsSummaryAmount"}),"#cart-summary-installment-order-total": coherent.View({visibleBinding: "summary.totalWithInstallmentCost"}),"#cart-summary-installment-order-total-value": coherent.View({htmlBinding: "summary.totalWithInstallmentCost"}),"#cart-summary-installment-details": coherent.View({visibleBinding: "summary.installmentsSummary"}),"#cart-summary-installment-details-value": coherent.View({htmlBinding: "summary.installmentsSummary"}),"#add-all-to-cart button": coherent.Button({enabledBinding: "loading(not)",action: "addAllToCart",target: FIRST_RESPONDER}),".line-codfee": coherent.View({visibleBinding: "summary.fees.cod"}),"#cart-summary-codfee-amount": coherent.View({htmlBinding: "summary.fees.cod",animated: true,preUpdateAnimationDuration: 100,postUpdateAnimationDuration: 500,postUpdateAnimationDelay: 1000}),"#cart-summary-loanterms": coherent.View({visibleBinding: "summary.loanterms",htmlBinding: "summary.loanterms"}),"#cart-summary-financing-promo": coherent.View({visibleBinding: "summary.loanCalculation",htmlBinding: "summary.loanCalculation"}),"#cart-summary-estimate-payment": coherent.View({visibleBinding: "summary.loancalculation",htmlBinding: "summary.loancalculation"}),"#cart-summary-finance-charges": coherent.View({visibleBinding: "summary.loanterms",htmlBinding: "summary.loanterms"}),"#cart-summary-loancalculation": coherent.View({visibleBinding: "summary.loancalculation",htmlBinding: "summary.loancalculation"})},message: {"#cart-financing-message": coherent.View({visibleBinding: "summary.financingOffer",htmlBinding: "summary.financingOffer"}),"#cart-installment": coherent.View({visibleBinding: "summary.installmentOffer"}),"#cart-installment-message": coherent.View({htmlBinding: "summary.installmentOffer"}),"#cart-bank-transfer": coherent.View({visibleBinding: "summary.bankTransferPrice"}),"#cart-bank-transfer-message": coherent.View({htmlBinding: "summary.bankTransferPrice"}),"#cart-financing-link": coherent.View({visibleBinding: "summary.financeCalculator",htmlBinding: "summary.financeCalculator"}),"#cart-shipping-message": coherent.View({visibleBinding: "summary.shipQuote",htmlBinding: "summary.shipQuote"})},placeorder: {"#place-order-now-button-container": coherent.View({htmlBinding: "summary.placeOrderButton",animated: true,updateAnimationDuration: {valueOf: function() {
        return Event.shiftKey ? 4000 : 500
    }}}),"#prompt-passive-terms": coherent.View({visibleBinding: "summary.placeOrderTerms",htmlBinding: "summary.placeOrderTerms"})},sidebar: {"#sidebar-summary-estimate-payment": coherent.View({visibleBinding: "summary.loancalculation",htmlBinding: "summary.loancalculation"}),"#sidebar-summary-finance-charges": coherent.View({visibleBinding: "summary.loanterms",htmlBinding: "summary.loanterms"}),"#sidebar-summary-free-shipping": coherent.View({visibleBinding: "summary.shipping.free",animated: true}),"#sidebar-summary-financing": coherent.View({visibleBinding: "summary.financingOffer",htmlBinding: "summary.financingOffer"}),"#sidebar-summary-total-without-installment": coherent.View({visibleBinding: "summary.totalWithoutInstallmentCost"}),"#sidebar-summary-total-value-without-installment": coherent.View({htmlBinding: "summary.totalWithoutInstallmentCost"}),"#sidebar-summary-installment": coherent.View({visibleBinding: "summary.installmentsSummaryAmount"}),"#sidebar-summary-installment-term": coherent.View({htmlBinding: "summary.installmentsSummaryTerm"}),"#sidebar-summary-installment-value": coherent.View({htmlBinding: "summary.installmentsSummaryAmount"}),"#sidebar-summary-installment-order-total": coherent.View({visibleBinding: "summary.totalWithInstallmentCost"}),"#sidebar-summary-installment-order-total-value": coherent.View({htmlBinding: "summary.totalWithInstallmentCost"}),"#sidebar-summary-installment-details": coherent.View({visibleBinding: "summary.installmentsSummary"}),"#sidebar-summary-installment-details-value": coherent.View({htmlBinding: "summary.installmentsSummary"}),"#sidebar-summary-total": coherent.View({visibleBinding: "summary.total"}),"#sidebar-summary-total-value": coherent.View({htmlBinding: "summary.total",animated: true,preUpdateAnimationDuration: 100,postUpdateAnimationDuration: 500,postUpdateAnimationDelay: 1000}),"#sidebar-summary-total-savings": coherent.View({visibleBinding: "summary.totalSavings"}),"#sidebar-summary-total-savings-amount": coherent.View({htmlBinding: "summary.totalSavings"}),"#print-cart": coherent.Anchor({action: "printCart",target: FIRST_RESPONDER}),"#save-cart": coherent.Anchor({action: "saveCart",target: FIRST_RESPONDER}),"#checkout-now": coherent.Button({enabledBinding: "loading(not)",action: "checkout",target: FIRST_RESPONDER}),"#checkout-1click": coherent.Anchor({enabledBinding: "loading(not)"}),"#sidebar-summary-subtotal-value": coherent.View({htmlBinding: "summary.subtotal"}),"#sidebar-summary-shipping": coherent.View({visibleBinding: "summary.shipping.enabled",classBinding: "shippingClassName",animated: true}),"#sidebar-shipping-label-free": coherent.View({visibleBinding: "summary.shipping.free"}),"#sidebar-shipping-label-notfree": coherent.View({visibleBinding: "summary.shipping.free(NOT)"}),"#sidebar-summary-shipping-cost": coherent.View({htmlBinding: "summary.shipping.cost"}),"#sidebar-summary-savings": coherent.View({visibleBinding: "summary.savings"}),"#sidebar-summary-savings-amount": coherent.View({htmlBinding: "summary.savings"}),"#sidebar-summary-tax": coherent.View({visibleBinding: "summary.tax"}),"#sidebar-summary-tax-amount": coherent.View({htmlBinding: "summary.tax"}),"#sidebar-summary-codfee": coherent.View({visibleBinding: "summary.fees.cod",animated: true}),"#sidebar-summary-codfee-amount": coherent.View({htmlBinding: "summary.fees.cod"}),"#sidebar-summary-checkout": coherent.View({htmlBinding: "summary.placeOrderButton",animated: true,updateAnimationDuration: {valueOf: function() {
        return Event.shiftKey ? 4000 : 500
    }}}),"#checkout": coherent.Button({action: "checkout",target: FIRST_RESPONDER}),"#step-faqs": apple.transaction.FAQView({stepBinding: "currentStep",animated: true}),"#sidebar-summary-loanterms": coherent.View({visibleBinding: "summary.loanterms",htmlBinding: "summary.loanterms"}),"#sidebar-summary-loancalculation": coherent.View({visibleBinding: "summary.loancalculation",htmlBinding: "summary.loancalculation"}),"#passive-terms-prompt": coherent.View({visibleBinding: "summary.placeOrderTerms",htmlBinding: "summary.placeOrderTerms"})}};
    return {structure: function() {
        this.summaryType = this.summaryType || "cart";
        return a[this.summaryType]
    },exposedBindings: ["summary", "loading", "checkoutVisible", "currentStep"],init: function() {
        this.addObserverForKeyPath(this, function() {
            this.forceChangeNotificationForKey("shippingClassName");
            this.updateFrame.bindAndDelay(this, 300)
        }, "summary.shipping.free");
        if (this.summaryType == "sidebar") {
            var b = $("checkout-1click");
            if (b) {
                b.clicked = false;
                Event.stopObserving(b, "click", this.clickOneClickCheckout);
                Event.observe(b, "click", this.clickOneClickCheckout)
            }
        }
    },clickOneClickCheckout: function(c) {
        var b = $("checkout-1click");
        if (b.clicked) {
            Event.stop(c);
            return
        }
        Element.addClassName(b, "disabled");
        b.clicked = true
    },updateFrame: function() {
        this.setValueForKeyPath(Element.getRect(this.viewElement(), true), "frame")
    },getShippingClassName: function() {
        if (this.summary && this.summary.shipping) {
            if (!this._shippingClassName) {
                this._shippingClassName = new Set([])
            }
            if (this.summary.shipping.free) {
                Set.add(this._shippingClassName, "text-alert")
            } else {
                Set.remove(this._shippingClassName, "text-alert")
            }
        }
        return this._shippingClassName ? Set.join(this._shippingClassName, " ") : this._shippingClassName
    },setShippingClassName: function(b) {
        var c = new Set(b.split(/\s+/));
        Set.remove(c, "alert");
        this._shippingClassName = c
    },teardown: function() {
        this.base();
        coherent.View.teardownViewsForNodeTree(this.viewElement())
    }}
})());
Package("apple.checkout");
apple.checkout.AccountStepView = Class.create(coherent.Fieldset, {__structure__: {form: coherent.Form({action: "completeAccountStep"}),"#account-form": coherent.Fieldset(),"#account-continue-as-guest": coherent.Button({visibleBinding: "showContinueAsGuest"}),"#account-create-account": coherent.Button({visibleBinding: "showCreateAccount"}),"#account-sign-in": coherent.Button({visibleBinding: "showSignIn"})},exposedBindings: ["accountData"],keyDependencies: {showContinueAsGuest: ["accountData", "dataEntered"],showCreateAccount: ["accountData", "dataEntered"],showSignIn: ["accountData", "dataEntered"]},init: function() {
    this.setValueForKey(false, "dataEntered");
    this.addObserverForKeyPath(this, this.dataChanged, "accountData.appleId");
    this.addObserverForKeyPath(this, this.dataChanged, "accountData.password");
    this.addObserverForKeyPath(this, this.dataChanged, "accountData.passwordAgain");
    this.addObserverForKeyPath(this, this.showGuestPrompt, "showCreateAccount")
},dataChanged: function(d) {
    var b = this.valueForKeyPath("accountData.appleId");
    var a = this.valueForKeyPath("accountData.password");
    var c = this.valueForKeyPath("accountData.passwordAgain");
    this.setValueForKey(b || a || c ? true : false, "dataEntered")
},observeAccountDataChange: function(c, b, a) {
    this.setValueForKey(c.newValue, "accountData")
},showContinueAsGuest: function() {
    if (this.accountData) {
        return this.accountData.valueForKeyPath("_actions.continue") && this.accountData.state == "accountCreate" && this.dataEntered === false
    }
},showCreateAccount: function() {
    if (this.accountData) {
        return this.accountData.state == "accountCreate" && (this.dataEntered === true || !this.accountData.valueForKeyPath("_actions.continue"))
    }
},showGuestPrompt: function() {
    var a = $("account-guest-prompt");
    if (!a) {
        return
    }
    if (a.style.display == "none") {
        Element.setOpacity(a, 0);
        a.style.display = ""
    }
    if (this.showCreateAccount() === true && (this.accountData && this.accountData.valueForKeyPath("_actions.continue"))) {
        coherent.Animator.setStyles(a, {opacity: 1}, {duration: 250})
    } else {
        coherent.Animator.setStyles(a, {opacity: 0}, {duration: 250})
    }
},showSignIn: function() {
    if (this.accountData) {
        return this.accountData.state == "accountFound"
    }
},completeAccountStep: function(a) {
    if (!this.accountData) {
        return
    }
    var b;
    if (this.accountData.state == "accountCreate") {
        b = this.dataEntered === true ? "createAccount" : "continueAsGuest"
    } else {
        if (this.accountData.state == "accountFound") {
            b = "signIn"
        }
    }
    if (b) {
        this.sendActionToView(b, FIRST_RESPONDER)
    }
}});
Package("apple.checkout");
apple.checkout.CartItemView = Class.create(coherent.View, {__structure__: {".product-container": coherent.View({htmlBinding: "*.html"})}});
Package("apple");
apple.CheckoutStatusPoller = Class.create(apple.transaction.ViewController, {});
apple.CheckoutStatusPoller.create = function(a) {
    return new apple.CheckoutStatusPoller(a)
};
$P(apple.CheckoutStatusPoller, "create", "Initialize");
Package("apple.checkout");
apple.checkout.CheckoutSummaryView = Class.create(coherent.View, {exposedBindings: ["html", "title"],observeTitleChange: function(c) {
    var b = c.newValue, a = this.viewElement();
    if ((b || "").length > a.innerHTML.length) {
        a.setAttribute("title", b)
    }
}});
Package("apple.checkout");
apple.checkout.CheckoutViewController = Class.create(apple.transaction.ViewController, {__customViews__: {"payment-summary-user-address-emailAddress": function(c, d, a, b) {
    return new apple.checkout.CheckoutSummaryView(c, this, {htmlBinding: a + d.key + "(truncateEmail)",titleBinding: a + d.key})
},"pickup-summary-user-emailAddress": function(c, d, a, b) {
    return new apple.checkout.CheckoutSummaryView(c, this, {htmlBinding: a + d.key + "(truncateEmail)",titleBinding: a + d.key})
},"payment-bank-phone-options": function(c, d, a, b) {
    return new coherent.Fieldset(c, this, {})
},"payment-other-options": function(c, d, a, b) {
    return new coherent.Fieldset(c, this, {})
},"shippingOptions-search-user-address": function(c, d, a, b) {
    return new coherent.Fieldset(c, this, {})
}},__structure__: {"#checkout-wrapper": coherent.Fieldset(),"#pickup-box": coherent.View({visibleBinding: "content.pickup.enabled"}),"#pickup-user-third-party": coherent.Fieldset(),"#pickup-user-contact-data": coherent.Fieldset(),"#pickup-error": coherent.View({visibleBinding: "errors.pickup",htmlBinding: "errors.pickup",classBinding: "errors.pickup_alert"}),"#pickup-edit-button": coherent.Button({enabledBinding: "content.pickup.editable"}),"#edit-pickupcart-link": coherent.Button({enabledBinding: "content.pickupCart.editable",action: "showEditCartWarning"}),"#edit-deliveryandpickup-link": coherent.Button({enabledBinding: "content.cart.editable",visibleBinding: "content.cart.enabled"}),"#payment-edit-button": coherent.Button({enabledBinding: "content.billing.editable",visibleBinding: "content.billing.enabled"}),"#cart": coherent.View({visibleBinding: "content.cart.enabled"}),"#storelocator-search-bar": coherent.Fieldset(),"#email-delivery-box": coherent.View({visibleBinding: "content.emailCart.enabled"}),"#shipping-box": coherent.View({visibleBinding: "content.shipping.enabled"}),"#shipping-edit-button": coherent.Button({enabledBinding: "content.shipping.editable",visibleBinding: "content.shipping.editable"}),"#shipping": coherent.View({visibleBinding: "content.shipping.enabled"}),"#shipMethod": coherent.View({visibleBinding: "content.shipMethod"}),"#shipmethod-edit-button": coherent.Button({enabledBinding: "content.shipMethod.editable"}),"#shipping-contact-form": coherent.Fieldset({visibleBinding: "content.shipping.enabled"}),"#shipping-box-title": coherent.View({visibleBinding: "content.shipping.enabled"}),"#account-box": coherent.View({visibleBinding: "content.account.enabled"}),"#payment-account-module-title": coherent.View({visibleBinding: "content.account.enabled"}),"#payment-module-title": coherent.View({visibleBinding: "content.billing.enabled"}),"#payment-box": coherent.View({visibleBinding: "content.cart.enabled"}),"#billing": coherent.View({visibleBinding: "content.billing.enabled"}),"#payment-summary": coherent.Fieldset(),"#payment-method-form": coherent.Fieldset({visibleBinding: "content.billing.enabled"}),"#payment-step-title": coherent.View({visibleBinding: "content.billing.enabled"}),"#payment-error": coherent.View({visibleBinding: "errors.billing",htmlBinding: "errors.billing",classBinding: "errors.billing_alert"}),"#payment-continue-button": coherent.Button({visibleBinding: "content.billing._actions.continue"}),"#shipping-mode": coherent.View({visibleBinding: "content.cart.enabled"}),"#payment-bml-errors": coherent.View({visibleBinding: "content.billing.bml.validateBmlError"}),"#invoice-box": coherent.View({visibleBinding: "content.invoice.enabled"}),"#invoice": coherent.View({visibleBinding: "content.invoice.enabled"}),"#invoice-step-title": coherent.View({visibleBinding: "content.invoice.enabled"}),"#invoice form": coherent.Form({action: "completeInvoiceStep"}),"#invoice-user": coherent.Fieldset(),"#invoice-next-step": coherent.Button({action: "completeInvoiceStep"}),"#edit-invoice-step": coherent.Button({enabledBinding: "content.invoice.editable",action: "editInvoiceStep"}),"#invoice-error": coherent.View({visibleBinding: "errors.invoice",htmlBinding: "errors.invoice",classBinding: "errors.invoice_alert"}),"#account": apple.checkout.AccountStepView({visibleBinding: "content.account.enabled",accountDataBinding: "content.account"}),"#account-step-title": coherent.View({visibleBinding: "content.account.enabled"}),"#edit-account-step": coherent.Button({visibleBinding: "content.account.editable",action: "editAccountStep"}),"#account-error": coherent.View({visibleBinding: "errors.account",htmlBinding: "errors.account",classBinding: "errors.account_alert"}),"#terms": coherent.View({visibleBinding: "content.terms.enabled"}),"#terms-box": coherent.View({visibleBinding: "content.terms.enabled"}),"#terms-edit-button": coherent.Button({enabledBinding: "content.terms.editable",action: "editTermsStep"}),"#terms-error": coherent.View({visibleBinding: "errors.terms",htmlBinding: "errors.terms",classBinding: "errors.terms_alert"}),"#edit-cart-link": coherent.Button({enabledBinding: "content.cart.editable",action: "showEditCartWarning"}),"#cart-back-button": coherent.Button({action: "handleBackCartClick"}),".price-edit-variant": coherent.Fieldset(),"#admin-toolbar": coherent.View({visibleBinding: "content.testdata"}),"#question-form-nav button": coherent.View({action: "showCommonQuestions"}),"#cart-continue-button": coherent.Button({enabledBinding: "content.cart.canContinue"}),"#recent-address-address-list": coherent.Button({})},staticEvents: {"financing-promo-payment": [{perform: "method",target: "showFinancingPromoOverlay"}],"address-verification-cancel": [{perform: "method",target: "addressVerificationCancel"}],"financing-promo-applynow": [{perform: "method",target: "trackFinancingPromoApplication"}]},init: function() {
    Event.onLoad(this._setupEvents.bind(this));
    Event.onLoad(this.dealCloser.bind(this));
    Event.observe(document, "keydown", this.closeOverlay.bindAsEventListener(this));
    this.ariaAlert = new apple.A11yAlert();
    this.addObserverForKeyPath(this, this.observeStoreLocatorActivation, "$content.storelocator.enableSelectStore.$content.storelocator.currentRetailId$");
    this.addObserverForKeyPath(this, this.observeStoreLocatorIndexChange, "content.storelocator.currentRetailId");
    this.addObserverForKeyPath(this, this.observeSessionExtensionChange, "content.sessionExtension");
    this.sessionController = new apple.SessionExtensionController({extensionUrlBinding: "*.sessionExtension._actions.sto.sessionExtension",extensionConfirmationUrlBinding: "*.sessionExtension._actions.sto.sessionExtensionConfirm",sessionAlertTimerBinding: "*.sessionExtension.sto.params.sessionAlertDiff",sessionAutoRenewTimerBinding: "*.sessionExtension.sto.params.sessionAutoAlertDiff",sessionLengthBinding: "*.sessionExtension.sto.params.sessionLength",sessionExpiredUrlBinding: "*.sessionExtension.sto.params.sessionExpiredURL",canBeExtendedBinding: "*.sessionExtension.sto.params.sessionCanBeExtended",alertCallback: this.showSessionTimeoutOverlay.bind(this)}, this.content);
    this.sessionTimeoutOverlayEventListener = this.sessionTimeoutOverlayEventListener.bindAsEventListener(this);
    this.base()
},setLoadingMode: function(a) {
    this.a11yJSONContinueAlert();
    this.base(a)
},a11yJSONContinueAlert: function() {
    var a = this.content.valueForKeyPath("cart.a11y-message");
    if (a) {
        this.ariaAlert.say(a)
    }
},observeSessionExtensionChange: function() {
    this.content.sessionExtension.forceChangeNotificationForKey("sto")
},showCommonQuestions: function(f) {
    var c = $(f.id), h = Element.query($("faqs"), ".current"), d = c.id.replace("-tab", ""), b = h.id.replace("-tab", ""), g = $(d), a = $(b);
    if (c != h) {
        Element.removeClassName(h, "current");
        Element.addClassName(c, "current");
        this.showCurrentQuestionTab(a, g)
    }
},showCurrentQuestionTab: function(a, b) {
    Element.addClassName(a, "hidden");
    Element.removeClassName(b, "hidden")
},showSectionDisabled: function() {
    var d = Element.queryAll(".step");
    for (var c = 0; c < d.length; c++) {
        if (d[c].parentNode) {
            var b = d[c].id;
            var g = this.content.valueForKeyPath(b + ".mode");
            if (g) {
                if (g != null && g === "blank") {
                    for (var a = 0; a < d[c].parentNode.childNodes.length; a++) {
                        var f = d[c].parentNode.childNodes[a].style;
                        if (f) {
                            f.opacity = "0.4"
                        }
                    }
                } else {
                    for (var a = 0; a < d[c].parentNode.childNodes.length; a++) {
                        var f = d[c].parentNode.childNodes[a].style;
                        if (f) {
                            f.opacity = "1"
                        }
                    }
                }
            }
        }
    }
},dealCloser: function() {
    var b = $("dealcloser-edit-button");
    var a = Element.query($("cart-product-list"), ".price-edit-variant");
    if (b && Element.hasClassName(b, "disabled")) {
        a.style.background = "none"
    }
},localbankmethod: function() {
    if ($("payment-localbank-options-content").style.display != "none") {
        Element.queryAll($("payment-form-options"), ".wdgt-mdl").forEach(function(a) {
            a.style.height = "400px"
        }.bind(this))
    }
},showdetails: function(c) {
    var d = Element.queryAll(".show-more-banks-class");
    d[0].style.display = "none";
    var b = Element.queryAll(".show-more-bank-content-class");
    b[0].style.display = "inline";
    var a = Element.query(".show-more-bank-content-class input")
},setBankMethod: function(a) {
    this.bankmethod.bindAndDelay(this, 1000)
},setSpinnerMode: function(a) {
    if (!Element.isVoidElement(a)) {
        var b = Element.query(a, "b.spinner");
        if (!b) {
            b = document.createElement("span");
            b.setAttribute("class", "spinner");
            a.appendChild(b)
        }
    }
},installmentsLookupPointsProgram: function(b) {
    var g = $("payment-credit-method-cc0-security-code").value;
    var f = $("payment-credit-method-cc0-cardNumber").value;
    var c = $("payment-credit-method-cc0-expirationMonth").value;
    var a = $("payment-credit-method-cc0-expirationYear").value;
    var h = Element.query(".points-program");
    var d = this.content.valueForKeyPath("billingMethodCc0FormInstallments._actions.installmentsLookupPointsProgram");
    if (g != null && g != "" && f != "" && f != null && c != "WONoSelectionString" && a != "WONoSelectionString" && d != null) {
        b.target = "billingMethodCc0FormInstallments._actions.installmentsLookupPointsProgram";
        b.perform = "action";
        if (this.validateAction(b.target)) {
            element = $("waitSpinner");
            if (element) {
                element.disabled = true;
                timer = this.setSpinnerMode.bindAndDelay(this, this.LOADING_INDICATOR_DELAY, element);
                this.loadingCallbacks.push(function() {
                    window.clearTimeout(timer);
                    element.disabled = false;
                    Element.removeClassName(element, "loading")
                });
                Element.setStyle(element, "display", "inline-block");
                if (h) {
                    Element.setStyle(h, "display", "none")
                }
            }
            this.performAction(b.target)
        }
    } else {
        if (h) {
            Element.setStyle(h, "display", "none")
        }
    }
},pointsProgramAssociated: function(c) {
    var b = "selected";
    var a;
    var d = this.content.valueForKeyPath("billingMethodCc0FormInstallments.points-program-associated");
    a = Element.query(this.viewElement(), ".points." + d + ".psr");
    if (a) {
        Element.addClassName(this.viewElement(), b);
        Element.addClassName(a, b)
    }
},installmentLumpSumOption: function(c) {
    var d = $("payment-credit-method-cc1-installments-installment1");
    var b = $("payment-credit-method-cc0-installments-installment0").value;
    var a = $("payment-credit-method-cc1-installments-lumpSum-content");
    if (d) {
        if (b === "1") {
            Element.setStyle(d, "display", "none");
            Element.setStyle(a, "display", "inline-block")
        } else {
            Element.setStyle(d, "display", "inline-block");
            Element.setStyle(a, "display", "none")
        }
    }
},localbankSectionCheck: function(c, b) {
    var a, d;
    if (b) {
        Element.setStyle(b, "display", "block");
        d = b.offsetHeight;
        Element.setStyle(b, "display", "none")
    }
    if (c) {
        Element.setStyle(c, "height", d + "px");
        if (coherent.Browser.IE === 7) {
            a = c.offsetTop + c.parentNode.parentNode.parentNode.offsetTop + 35
        } else {
            a = c.offsetTop
        }
        Element.setStyles(b, {top: a + "px",left: 0 + "px",display: "block"})
    } else {
        if (b) {
            Element.setStyle(b, "display", "none")
        }
    }
},bankmethod: function(d) {
    var c = "", b = "", f = Element.queryAll(".bank-phone")[0], g = "", a = Element.queryAll(".bank-phone-msg")[0];
    Element.queryAll($("payment-form-options"), '[name = "payment-form-options-bankOption"]').forEach(function(h) {
        if (h.checked === true) {
            c = h
        }
    });
    Element.queryAll($("payment-form-options"), ".beak").forEach(function(h) {
        if (Element.hasClassName(c, "inst-bank-option") && h.parentNode.id === "payment-form-options-installments-content" && d) {
            h.style.visibility = "hidden"
        } else {
            if (h.parentNode.id === "payment-form-options-installments-content") {
                h.style.visibility = "visible"
            }
        }
        if (coherent.Browser.IE === 7) {
            Element.setStyle(h, "marginLeft", (c.offsetParent.offsetLeft) + "px")
        } else {
            Element.setStyle(h, "marginLeft", (c.offsetLeft - 10) + "px")
        }
        if (Element.hasClassName(c, "inst-bank-option") && h.parentNode.id === "payment-form-options-installments-content" && !d) {
            h.style.visibility = "visible"
        }
    }.bind(this));
    Element.queryAll($("payment-form-options"), ".bankPhoneRow").forEach(function(h) {
        if (h.style.display !== "none") {
            b = h
        }
    });
    Element.queryAll($("payment-form-options"), ".bankOnlineRow").forEach(function(h) {
        if (h.style.display !== "none") {
            g = h
        }
    });
    if (d && d.type === "localBank") {
        this.content.setValueForKeyPath("ONLINE", "billing.external.local")
    }
    this.localbankSectionCheck(b, f);
    this.localbankSectionCheck(g, a);
    if (this.content && !Element.hasClassName(c, "card-type")) {
        if (this.content.valueForKeyPath("billing._forms.billingMethodCcForm")) {
            this.content.valueForKeyPath("billing._forms.billingMethodCcForm").activations[0].valid = false;
            this.updateActiveKey(this.forms["billing._forms.billingMethodCcForm"])
        }
        if (this.content.valueForKeyPath("billing._forms.billingAddressForm")) {
            this.content.valueForKeyPath("billing._forms.billingAddressForm").activations[0].valid = false;
            this.updateActiveKey(this.forms["billing._forms.billingAddressForm"])
        }
        if (this.content.valueForKeyPath("billing._forms.paymentParentForm")) {
            this.content.valueForKeyPath("billing._forms.paymentParentForm").activations[0].valid = false;
            this.updateActiveKey(this.forms["billing._forms.paymentParentForm"])
        }
    } else {
        if (this.content && Element.hasClassName(c, "card-type")) {
            if (this.content.valueForKeyPath("billing._forms.billingMethodCcForm")) {
                this.content.valueForKeyPath("billing._forms.billingMethodCcForm").activations[0].valid = true;
                this.updateActiveKey(this.forms["billing._forms.billingMethodCcForm"])
            }
            if (this.content.valueForKeyPath("billing._forms.billingAddressForm")) {
                this.content.valueForKeyPath("billing._forms.billingAddressForm").activations[0].valid = true;
                this.updateActiveKey(this.forms["billing._forms.billingAddressForm"])
            }
            if (this.content.valueForKeyPath("billing._forms.paymentParentForm")) {
                this.content.valueForKeyPath("billing._forms.paymentParentForm").activations[0].valid = true;
                this.updateActiveKey(this.forms["billing._forms.paymentParentForm"])
            }
        }
    }
    if (this.content && b && this.content.valueForKeyPath("billing.external.local") === "PHONE") {
        if (this.content.valueForKeyPath("billing._forms.billingLocalPaymentForm")) {
            this.content.valueForKeyPath("billing._forms.billingLocalPaymentForm").activations[0].valid = true;
            this.updateActiveKey(this.forms["billing._forms.billingLocalPaymentForm"])
        }
        if (this.content.valueForKeyPath("billing._forms.billingPhonePaymentForm")) {
            this.content.valueForKeyPath("billing._forms.billingPhonePaymentForm").activations[0].valid = true;
            this.updateActiveKey(this.forms["billing._forms.billingPhonePaymentForm"])
        }
    } else {
        if (this.content && this.content.valueForKeyPath("billing.external.bankOption") === "WIRE_TRANSFER") {
            if (this.content.valueForKeyPath("billing._forms.billingTransferPaymentForm")) {
                this.content.valueForKeyPath("billing._forms.billingTransferPaymentForm").activations[0].valid = true;
                this.updateActiveKey(this.forms["billing._forms.billingTransferPaymentForm"])
            }
        } else {
            if (this.content) {
                if (this.content.valueForKeyPath("billing._forms.billingPhonePaymentForm")) {
                    this.content.valueForKeyPath("billing._forms.billingPhonePaymentForm").activations[0].valid = false;
                    this.updateActiveKey(this.forms["billing._forms.billingPhonePaymentForm"])
                }
                if (this.content.valueForKeyPath("billing._forms.billingTransferPaymentForm")) {
                    this.content.valueForKeyPath("billing._forms.billingTransferPaymentForm").activations[0].valid = false;
                    this.updateActiveKey(this.forms["billing._forms.billingTransferPaymentForm"])
                }
            }
        }
    }
},_setupEvents: function() {
    if ($("shipping-box")) {
        Event.observe($("shipping-box"), "click", function(a) {
            this.metricsLearnMore(a, "shipping-box")
        }.bind(this))
    }
    if ($("delivery-box")) {
        Event.observe($("delivery-box"), "click", function(a) {
            this.metricsLearnMore(a, "delivery-box")
        }.bind(this))
    }
    Event.observe($("u_cart"), "click", function(a) {
        Event.stop(a);
        this.showEditCartWarning()
    }.bind(this));
    this.addObserverForKeyPath(this, "checkStepNumber", "content.cart");
    this.addObserverForKeyPath(this, "showSectionDisabled", "content.cart");
    this.showSectionDisabled();
    this.checkStepNumber()
},metricsLearnMore: function(b, c) {
    var d = b.target || b.srcElement, a = Element.locateAncestor(d, function(f) {
        return f.tagName === "A"
    }, $(c));
    if (a && Element.hasClassName(a, "metrics-link")) {
        if (c === "shipping-box") {
            this.httpLinkTrack(a, "prop37")
        } else {
            if (c === "delivery-box") {
                this.httpLinkTrack(a, "prop37", "Checkout: Delivery Multi-Address: Learn more")
            }
        }
    }
},contentSetCallback: function(b) {
    var a = this._currentStep();
    Element.removeClassName(this.viewElement(), "page-loading");
    this.base(b);
    this.setValueForKey(a, "currentStep");
    this.setStepMode();
    this.checkForCurrentStepError();
    this.setCustomA11y()
},setStepMode: function() {
    var b = Element.queryAll(".step"), c = ["summary", "edit", "blank"], a = 400, d = 4000, g = Event.shiftKey ? d : a, f = 0;
    b.forEach(function(n) {
        var o = this.valueForKeyPath("content." + n.id + ".mode"), k = "", m = "switching";
        c.forEach(function(r) {
            if (Element.hasClassName(n, r)) {
                k = r
            }
        });
        if (k != o && o) {
            Element.addClassName(n, m);
            var q = Element.locateAncestor(n, function(r) {
                return Element.hasClassName(r, "box")
            }, this.viewElement());
            q.setAttribute("aria-hidden", o == "blank");
            coherent.Animator.replaceClassName(n, k, o, {duration: g,only: ["height"],callback: function() {
                Element.removeClassName(n, m)
            }});
            this.currentStep = n;
            this.newMode = o;
            var h = this.currentStep.parentNode.id;
            if (h !== "delivery-box" && this.newMode == "edit") {
                this.setFocusTo = (function() {
                    var r = {duration: 950};
                    coherent.Animator.scrollTo($(h), r)
                }).bindAndDelay(this, 700)
            }
        }
    }, this);
    this.showTermsText()
},setCustomA11y: function() {
    var a = Element.queryAll("#shipping-user-address_section fieldset.BR.user-form-fieldset");
    if (a.length) {
        var c = Element.query(a[0], "span.metadata-contact-footer-field span");
        var b = $("shipping-user-postalCode");
        if (b) {
            b.setAttribute("aria-describedby", c.id)
        }
    }
},setFocusTo: function() {
    var a = {duration: 950};
    coherent.Animator.scrollTo($(this.targetFocus), a)
},showTermsText: function() {
    var b = this._currentStep(), c = $("step-prompt"), a = $("verify-prompt")
},checkForCurrentStepError: function() {
    if (!this.content.valueForKey("ignoreHighlightFirstErrorInCurrentStep")) {
        this.highlightFirstErrorInCurrentStep()
    }
},highlightPromoCodeError: function() {
    var b = $("promo-code-edit-field-input"), a;
    if (b) {
        a = coherent.View.fromNode(b);
        if (a && a.validationError && a.focus) {
            Event.onLoad(function() {
                try {
                    a.focus()
                } catch (c) {
                }
            });
            return true
        }
    }
    return false
},_currentStep: function() {
    var a = Element.queryAll(".step");
    for (var b = 0, d = a.length, c; b < d; b++) {
        c = a[b].id;
        if (this.valueForKeyPath("content." + c + ".mode") == "edit") {
            return c
        }
    }
    return "verify"
},clearStepNumber: function() {
    var c = Element.queryAll(".step"), d = Element.queryAll(".step-header");
    for (counter = 0; counter < c.length; counter++) {
        var a = Element.query(c[counter].parentNode, ".step-header");
        Element.removeClassName(a, "is-stepped");
        for (i = 0; i < d.length; i++) {
            var b = "stepnumber" + (i + 1);
            Element.removeClassName(a, b)
        }
    }
},checkStepNumber: function(h) {
    this.clearStepNumber();
    var k = Element.queryAll(".step"), n = 1, b, m, o, a, c, g;
    for (var d = 0, f = k.length; d < f; d++) {
        if (this.content.valueForKeyPath(k[d].id + ".enabled")) {
            b = k[d].parentNode;
            o = Element.query(b, ".step-header");
            if (m) {
                a = Element.query(m, "button.transactional span.label");
                g = Element.query(b, "h2.heading");
                if (a && g) {
                    c = Element.query(a, "span.a11y");
                    if (c) {
                        Element.innerHTML(c, "")
                    }
                    Element.innerHTML(a, (a.textContent || a.innerText).replace(/^\s+|\s+$/g, "") + ' <span class="a11y">(' + (g.lastChild.textContent || g.lastChild.nodeValue) + ")</span>")
                }
            }
            m = b;
            if (!Element.hasClassName(o, "is-stepped")) {
                Element.addClassName(o, "is-stepped stepnumber" + n);
                Element.innerHTML(o, '<span class="a11y">' + n + "</span>");
                n++
            }
        }
    }
},closeRecentAddressOverlay: function(a) {
    if (this.overlay && this.overlay.type == "overlay") {
        this.overlay.hide()
    }
},closeOverlay: function(a) {
    if (a.keyCode === Event.KEY_ESC) {
        if (this.overlay && this.overlay.type == "overlay") {
            this.overlay.hide();
            return
        }
        if (this.cartWarningOverlay && this.cartWarningOverlay.visible) {
            this.cartWarningOverlay.hide();
            return
        }
    }
},highlightFirstErrorInCurrentStep: function() {
    if (this.highlightPromoCodeError()) {
        return
    }
    var b = this._currentStep();
    if (!b) {
        return
    }
    var a = b + "._actions.continue";
    var c = this.content.valueForKeyPath(a);
    if (!c) {
        return
    }
    this.highlightFirstErrorInForm(c.form)
},observeStoreLocatorIndexChange: function(b, a) {
    this.updateStoreLocatorTabIndex()
},updateStoreLocatorTabIndex: function() {
    if (!this.content.storelocator.enableSelectStore || !(this.forms["storelocator._forms.main"] && this.forms["storelocator._forms.main"]._viewCache["storelocator-listView"] && this.forms["storelocator._forms.main"]._viewCache["storelocator-listView"].tabs)) {
        return
    }
    var d = this.forms["storelocator._forms.main"]._viewCache["storelocator-listView"].tabs, f = d.length, g = 4, b = f / g, c = d.indexOf(this.valueForKeyPath("content.storelocator.currentRetailId")), a = Math.floor((c) / b);
    this.setValueForKey(a, "content.storelocator.currentPageIndex")
},observeStoreLocatorActivation: function(g, a) {
    var c = this.valueForKeyPath(a), b = c ? Element.removeClassName : Element.addClassName, d = "disabled", f = $("storelocator-select-store-button");
    if (f) {
        b(f, d)
    }
},closeStoreLocator: function() {
    if (this.overlay && this.overlay.type == "storelocator") {
        this.overlay.hide()
    }
},showStoreLocatorZipError: function() {
    var a = coherent.strings["transaction.co.accessibility.personal_pickup.zip_code"];
    var b = this.forms["storelocator._forms.storeLocatorSearchForm"]._viewCache["storelocator-search-postalCode"];
    b.presentError(new coherent.Error({description: a}))
},observeModeChange: function(b, a) {
    this.setValueForKeyPath(b.oldValue, a.replace(".mode", ".oldMode"))
},placeOrder: function(c, b) {
    var a = "common._actions.placeOrder";
    if (this.validateAction(a)) {
        Element.addClassName(b, "disabled");
        b.disabled = true;
        coherent.Animator.setStyles(b, {opacity: 0.5});
        this.loadingCallbacks.push(function() {
            b.disabled = false;
            Element.setOpacity(b, 1)
        })
    }
},handleBackCartClick: function() {
    this.showEditCartWarning();
    s.prop37 = "Checkout: Delivery: Back to CART";
    apple.metrics.fireMicroEvent({action: "selected",feature: "edit cart",prop: "prop37"})
},httpLinkTrack: function(d, c, f) {
    var b, a, g = c ? ("data-" + c) : "";
    b = f || (d ? (d.getAttribute(g) || "") : "");
    b = b ? b.split(" | ") : [];
    a = b.length <= 4 ? b.join() : b.slice(4).join(" | ");
    if (a) {
        apple.metrics.fireMicroEvent({action: a,feature: "AOS: Checkout",eVar: c})
    }
},redirect: function(a) {
    window.location = a.href
},showEditCartWarning: function() {
    if (!this.cartWarningOverlay) {
        var a = document.createElement("div");
        a.className = "overlay";
        document.body.appendChild(a);
        this.cartWarningOverlay = new apple.CompoundOverlay(a)
    }
    this.cartWarningOverlay.display({displayCloseWidget: false,header: $("edit-cart-header").innerHTML,sourceId: "edit-cart-warning",actions: $("edit-cart-actions").innerHTML,classname: "overlay",canClose: true,dialog: true});
    apple.metrics.fireMicroEvent({eVar: "eVar21",action: "selected",slot: "edit cart",page: "checkout",feature: "edit cart"});
    Event.observe($("edit-cart-cancel"), "click", function() {
        this.locationRedirected = false;
        apple.metrics.fireMicroEvent({eVar: "eVar21",slot: "edit cart",action: "cancel",page: "checkout",feature: "overlay"})
    }.bind(this));
    if (this.surveyData && !this.surveyCodeRan) {
        var b = window.apple.survey;
        b.surveyButton(this);
        this.surveyCodeRan = true
    }
},showFinancingPromoOverlay: function(a, b) {
    if (!this.financingOverlay) {
        var c = document.createElement("div");
        c.className = "overlay";
        document.body.appendChild(c);
        this.financingOverlay = new apple.CompoundOverlay(c)
    }
    apple.metrics.fireMicroEvent({slot: "link",feature: "financing",action: "selected",eVar: "eVar21"});
    this.financingOverlay.display({displayCloseWidget: true,url: a.url || "finance/overlay_financing_promo",classname: "overlay finance-offer",dialog: true})
},trackFinancingPromoApplication: function(a, b) {
    apple.metrics.fireMicroEvent({feature: "Instant Credit Application",part: "Barclays Finance",action: "continue",eVar: "eVar21"});
    window.location = b.href
},addressVerificationCancel: function() {
    apple.metrics.fireMicroEvent({eVar: "eVar21",action: "selected try again",feature: "address verification"})
},completeInvoiceStep: function(c) {
    var a = "invoice._actions.continue", b, d, f = Element.removeClassName;
    if (this.validateAction(a)) {
        b = $(c.id);
        if (b) {
            b.disabled = true;
            d = this.setLoadingMode.bindAndDelay(this, this.LOADING_INDICATOR_DELAY, b);
            this.loadingCallbacks.push(function() {
                window.clearTimeout(d);
                b.disabled = false;
                f(b, "loading")
            })
        }
        this.performAction(a, null, true)
    }
},editAccountStep: function(a) {
    var b = "account._actions.edit";
    if (this.validateAction(b)) {
        this.loadingTimeout = (function() {
            Element.addClassName($("edit-account-step"), "loading")
        }).delay(this.LOADING_INDICATOR_DELAY)
    }
},editInvoiceStep: function(b) {
    var f = "invoice._actions.edit", a, c, d = Element.removeClassName;
    if (this.validateAction(f)) {
        a = $(b.id);
        if (a) {
            a.disabled = true;
            c = this.setLoadingMode.bindAndDelay(this, this.LOADING_INDICATOR_DELAY, a);
            this.loadingCallbacks.push(function() {
                window.clearTimeout(c);
                a.disabled = false;
                d(a, "loading")
            })
        }
        this.performAction(f, null, true)
    }
},trackDelayedPaymentMsg: function(m) {
    var c, f, b, g, d, k, a = [], h = ["billing._forms.billingExternalInstallmentsPaymentForm", "billing._forms.billingLocalPaymentForm", "billing._forms.billingLocalPaymentFormWithMsg", "billing._forms.billingAlipayForm", "billing._forms.billingTransferPaymentForm"];
    f = this.content.valueForKeyPath("billing.external.bankOption");
    if (f) {
        for (c = 0; c < h.length; c++) {
            b = this.content.valueForKeyPath(h[c]);
            if (b) {
                g = b.activations;
                if (g && g[0].validations) {
                    a = g[0].validations.validValues || g[0].validations.validRegexes || [];
                    if (a.containsObject(f)) {
                        d = g[0].omniture;
                        if (d) {
                            k = this.content.valueForKeyPath(d);
                            apple.metrics.fireEventCollection(k);
                            break
                        }
                    }
                }
            }
        }
    }
},continueAsGuest: function(b) {
    var a = "account._actions.continue";
    if (this.validateAction(a)) {
        this.loadingTimeout = (function() {
            Element.addClassName($("account-next-step"), "loading")
        }).delay(this.LOADING_INDICATOR_DELAY);
        this.performAction(a)
    }
},createAccount: function(b) {
    var a = "account._actions.createAccount";
    if (this.validateAction(a)) {
        this.loadingTimeout = (function() {
            Element.addClassName($("account-next-step"), "loading")
        }).delay(this.LOADING_INDICATOR_DELAY);
        this.performAction(a)
    }
},accountTryDifferentEmail: function() {
    var a = $("account-appleId");
    a.value = "";
    a.focus()
},signIn: function(a) {
    var b = "account._actions.signIn";
    if (this.validateAction(b)) {
        this.loadingTimeout = (function() {
            Element.addClassName($("account-next-step"), "loading")
        }).delay(this.LOADING_INDICATOR_DELAY);
        this.performAction(b)
    }
},scrollDivBottom: function(d) {
    var f = d.replace("-button", "-footer");
    viewport = Element.getViewport();
    var c = Element.getRect($(f));
    viewPortHeight = viewport.height;
    placeOrderFooterHeight = c.top;
    var b = {duration: 1450};
    if (viewPortHeight > placeOrderFooterHeight) {
        scrollDest = [0, 0];
        coherent.Animator.scrollTo(scrollDest, b)
    } else {
        var a = (placeOrderFooterHeight - viewPortHeight) + $(f).offsetHeight;
        scrollDest = [0, a];
        coherent.Animator.scrollTo(scrollDest, b)
    }
},enableClickTarget: function(b) {
    if (b == "payment-continue-button") {
        return
    }
    this.base(b);
    if (b == "place-order-button") {
        this.setValueForKey(true, "checkoutVisible");
        var a = b;
        this.scrollDivTo = (function() {
            this.scrollDivBottom(a)
        }).bindAndDelay(this, 700)
    }
},disableClickTarget: function(a) {
    if (a == "payment-continue-button") {
        return
    }
    this.base(a);
    if (a == "place-order-button") {
        this.setValueForKey(false, "checkoutVisible")
    }
},smoothScrollToShipping: function() {
    this.smoothScrollTo("shipping")
},smoothScrollTo: function(a) {
    coherent.Animator.scrollTo(a)
},focusPreviousFirstResponder: function() {
},getSurveyData: function() {
    this.surveyData.cartActualValue = this.valueForKeyPath("content.cart.summary.total");
    return this.surveyData
},surveyFeature: function() {
    return "Checkout Survey"
},surveyEVar: function() {
    return "eVar21"
},surveyElement: function() {
    var b = document.createElement("div");
    var a = this.surveyData;
    var f = unescape(a.surveyURL);
    var d = window.s;
    function g(k) {
        k += "=";
        var h = document.cookie.split(";");
        for (var m = 0; m < h.length; m++) {
            var n = h[m];
            while (n.charAt(0) === " ") {
                n = n.substring(1, n.length)
            }
            if (n.indexOf(k) === 0) {
                return n.substring(k.length, n.length)
            }
        }
        return null
    }
    var c = new Date();
    f += (f.indexOf("?") === -1 ? "?" : "&") + "Pagename=" + escape(d.pageName) + "&visitorID=" + escape(g("s_vi")) + "&hit_time_gmt=" + escape(c.toGMTString()) + "&OS=" + escape(d.n.oscpu);
    Element.setInnerHTML(b, '<a target="_blank" href="' + f + '"><span>' + a.checkoutSurveyText + "</span></a>");
    Element.setStyles(b, {position: "absolute",bottom: "10px",left: "10px"});
    this.surveyElementId = Element.assignId(b);
    return b
},surveyCallback: function(b) {
    var a = $("edit-cart-warning");
    if (a && b) {
        a = Element.query($("edit-cart-warning"), ".content");
        a.appendChild(b);
        apple.metrics.fireMicroEvent({feature: "Checkout Survey",action: "displayed"})
    }
},surveyCallbackHide: function(b) {
    b.alreadyShown = false;
    var a = $(this.surveyElementId);
    if (a) {
        coherent.Animator.setStyles(a, {opacity: 0}, {callback: function() {
            Element.setStyle(a, "display", "none")
        }})
    }
},_augmentFieldBeforePerformAction: function(a) {
    if (a.type == "deviceID") {
        a.key = null;
        a.value = DeviceID.validate()
    }
    return a
},toggleShippingInfo: function() {
    Element.queryAll(".instr-ctrls, .instr-content").forEach(function(a) {
        if (Element.hasClassName(a, "hide-content")) {
            Element.addClassName(a, "show-content");
            Element.removeClassName(a, "hide-content")
        } else {
            Element.removeClassName(a, "show-content");
            Element.addClassName(a, "hide-content")
        }
    })
},toggleProductDetails: function(f) {
    var h, g, c, d, a, b = Element.locateAncestor($(f.id), function(k) {
        return Element.hasClassName(k, "product-info")
    });
    h = Element.query(b, ".hideproduct-link");
    g = Element.query(b, ".product-link");
    c = Element.query(b, ".product-details-content");
    if (h.style.display === "inline") {
        h.style.display = "none";
        g.style.display = "inline";
        d = Element.query(g, "button");
        d.focus()
    } else {
        h.style.display = "inline";
        g.style.display = "none";
        a = Element.query(h, "button");
        a.focus()
    }
    c.style.display === "inline" ? c.style.display = "none" : c.style.display = "inline"
},showSessionTimeoutOverlay: function(c) {
    if (!this.sessionTimeoutOverlay) {
        var b = document.createElement("div");
        b.className = "overlay";
        document.body.appendChild(b);
        this.sessionTimeoutOverlay = new apple.CompoundOverlay(b)
    }
    this.sessionTimeoutCallback = c;
    this.sessionTimeoutOverlay.display({displayCloseWidget: false,header: $("session-timeout-header").innerHTML,sourceId: "session-timeout-warning",actions: $("session-timeout-actions").innerHTML,classname: "overlay session-timeout-overlay",dialog: true});
    var a = $("session-timeout-warning");
    this.ariaAlert.say(a.innerText || a.textContent);
    Event.observe(document, "click", this.sessionTimeoutOverlayEventListener);
    Event.observe(document, "touchstart", this.sessionTimeoutOverlayEventListener);
    Event.observe(document, "keydown", this.sessionTimeoutOverlayEventListener)
},sessionTimeoutOverlayEventListener: function(a) {
    this.sessionTimeoutCallback && this.sessionTimeoutCallback();
    Event.stopObserving(document, "click", this.sessionTimeoutOverlayEventListener);
    Event.stopObserving(document, "touchstart", this.sessionTimeoutOverlayEventListener);
    Event.stopObserving(document, "keydown", this.sessionTimeoutOverlayEventListener);
    this.sessionTimeoutOverlay.hide()
},showEducationLoanWarning: function() {
    if (!this.cartWarningOverlay) {
        var b = document.createElement("div");
        b.className = "overlay";
        document.body.appendChild(b);
        this.cartWarningOverlay = new apple.CompoundOverlay(b)
    }
    this.cartWarningOverlay.display({displayCloseWidget: false,header: $("edit-overlay-header").innerHTML,sourceId: "edit-overlay-warning",actions: $("edit-overlay-actions").innerHTML,classname: "overlay",dialog: true});
    if ($("educationloan-learn-more")) {
        var a = s.eVar21;
        s.eVar21 = "Checkout | Education Finance | Learn More";
        apple.metrics.fireMicroEvent({feature: "Education Financing",action: "Learn More"});
        s.eVar21 = a
    }
},toggleApplyButton: function() {
    var a = $(this.id);
    var b = Element.queryAll("#payment-giftcard-method-gc-0-redeem");
    if (Element.hasClassName(a, "invalid")) {
        Element.addClassName(b[0], "disabled");
        b[0].setAttribute("disabled", "disabled")
    } else {
        if (!Element.hasClassName(a, "invalid")) {
            Element.removeClassName(b[0], "disabled");
            b[0].removeAttribute("disabled")
        }
    }
},giftCardApplyButton: function(a) {
    Event.observe($(a.id), "change", this.toggleApplyButton)
},hidePickupPolicyAgreement: function(a, b) {
    Element.hide($("pickupPolicyAgreement"))
},showPickupPolicyAgreement: function(a, b) {
    Element.show($("pickupPolicyAgreement"))
},showOrHidePickupPolicyAgreement: function() {
    if (this.content.pickup && this.content.pickup.user.pickupKey == "thirdParty") {
        Element.show($("pickupPolicyAgreement"))
    } else {
        Element.hide($("pickupPolicyAgreement"))
    }
},copyAddressPhone: function(c, d) {
    var b = this.content.shipping.address.__keys, a = $(c._element.id);
    if (a.checked || d.nodeName === "BUTTON") {
        if ("mobilePhoneAreaCode" in b) {
            this.content.shipping.address.setValueForKey(this.content.shipping.address.valueForKey("daytimePhone") || "", "mobilePhone");
            this.content.shipping.address.setValueForKey(this.content.shipping.address.valueForKey("daytimePhoneAreaCode") || "", "mobilePhoneAreaCode")
        } else {
            this.content.shipping.address.setValueForKey((this.content.shipping.address.valueForKey("daytimePhoneAreaCode") || "") + (this.content.shipping.address.valueForKey("daytimePhone") || ""), "mobilePhone")
        }
    }
    return c
},copyAddressPhoneMultiFlow: function(c, d) {
    var b = this.content.valueForKeyPath(c.key).address.__keys;
    var a = $(c.id);
    if (a.checked || d.nodeName === "BUTTON") {
        if ("mobilePhoneAreaCode" in b) {
            this.content.valueForKeyPath(c.key).address.setValueForKey(this.content.valueForKeyPath(c.key).address.valueForKey("daytimePhone") || "", "mobilePhone");
            this.content.valueForKeyPath(c.key).address.setValueForKey(this.content.valueForKeyPath(c.key).address.valueForKey("daytimePhoneAreaCode") || "", "mobilePhoneAreaCode")
        } else {
            this.content.valueForKeyPath(c.key).address.setValueForKey((this.content.valueForKeyPath(c.key).address.valueForKey("daytimePhoneAreaCode") || "") + (this.content.valueForKeyPath(c.key).address.valueForKey("daytimePhone") || ""), "mobilePhone")
        }
    }
    return c
},handleValidationEvent: function(c, a, b) {
    if (c && c.newValue && c.newValue.indexOf("•") >= 0) {
        return
    }
    this.base(c, a, b)
},addObserverForPinNumberField: function() {
    var a = Element.query($("payment-giftcard-method-gc"), "input");
    Event.observe(a, "paste", this.onpaste.bind(this))
},onpaste: function(g) {
    var c = g || window.event, b = Element.query($("payment-giftcard-method-gc"), "input"), h = "maxlength", f = b.maxLength, d = /[^0-9A-Z]/g;
    function a() {
        b.value = b.value.replace(d, "").substr(0, f);
        b.maxLength = f;
        b.setAttribute(h, f);
        b.style.color = ""
    }
    b.style.color = "transparent";
    b.maxLength = 100000;
    b.removeAttribute(h);
    a.delay(10)
},toggleToolbar: function(c) {
    var b = $("admin-data");
    var d = $("toggle-toolbar-link");
    var a = Element.query(".admin-toolbar-links");
    if (Element.hasClassName(d, "maximized")) {
        a.style.display = "none";
        b.style.display = "none";
        d.innerHTML = "&#8593";
        Element.removeClassName(d, "maximized");
        Element.addClassName(d, "minimized")
    } else {
        if (Element.hasClassName(d, "minimized")) {
            a.style.display = "block";
            b.style.display = "block";
            d.innerHTML = "&#8595";
            Element.removeClassName(d, "minimized");
            Element.addClassName(d, "maximized")
        }
    }
},customDropdownBlurObserver: function(a) {
    if (!~this.listItems.indexOf(document.activeElement)) {
        this.trackCustomDropdown(a)
    }
},showShippingDropdown: function(f, d) {
    this.prevFocus = document.activeElement;
    var k = Element.query(".select-overlay"), h = Element.query(".custom-select button"), a = Element.query(".custom-select button .label"), m = Element.queryAll(".tick"), g = Element.queryAll(".select-overlay li");
    this.customSelect = k;
    this.customSelectButton = h;
    this.currentItemLabel = a;
    this.keyDownObserver = this.trackCustomDropdown.bindAsEventListener(this);
    this.customSelect.removeAttribute("aria-hidden");
    for (var b = 0; b < m.length; b++) {
        if (g[b].getAttribute("value") == h.getAttribute("value")) {
            m[b].style.visibility = "visible"
        } else {
            m[b].style.visibility = "hidden"
        }
    }
    var c = Element.queryAll(this.customSelect, "li");
    if ((this.listItems && this.listItems[0]) !== c[0]) {
        this.listItems = c;
        this.listItems.forEach(function(n) {
            Event.observe(n, "blur", window.setTimeout.bind(null, this.customDropdownBlurObserver.bind(this), 0))
        }, this);
        Event.observe(k, "keydown", this.shippingOptionsKeypressHander.bind(this))
    }
    setTimeout(function() {
        c[0].focus()
    }, 0);
    Element.removeClassName(this.customSelect, "hide");
    Event.observe(document, "click", this.keyDownObserver)
},focusPrevItem: function() {
    var a = this.listItems.indexOf(document.activeElement);
    if (a - 1 >= 0) {
        this.listItems[a - 1].focus()
    } else {
        this.listItems[this.listItems.length - 1].focus()
    }
},focusNextItem: function() {
    var a = this.listItems.indexOf(document.activeElement);
    if (a + 1 <= this.listItems.length - 1) {
        this.listItems[a + 1].focus()
    } else {
        this.listItems[0].focus()
    }
},shippingOptionsKeypressHander: function(b) {
    var a = b.keyCode;
    if (a === Event.KEY_ESC) {
        this.trackCustomDropdown(b)
    }
    if (a === Event.KEY_DOWN || a === Event.KEY_RIGHT) {
        this.focusNextItem();
        Event.stop(b)
    }
    if (a === Event.KEY_UP || a === Event.KEY_LEFT) {
        this.focusPrevItem();
        Event.stop(b)
    }
    if (a === Event.KEY_RETURN) {
        this.trackCustomDropdown(b)
    }
},trackCustomDropdown: function(b) {
    var d = b.target || b.srcElement;
    var m = b.type === "keydown";
    if (m && !~[Event.KEY_RETURN, 32, Event.KEY_ESC].indexOf(b.keyCode)) {
        return
    }
    var h = d.id, k = Element.locateAncestor(d, function g(o) {
        return Element.hasClassName(o, "custom-select-input")
    }, h);
    menuDisplayed = Element.locateAncestor(d, function g(o) {
        return Element.hasClassName(o, "select-overlay-item")
    }, h);
    if (k) {
        Element.removeClassName(this.customSelect, "hide")
    } else {
        if (menuDisplayed && b.keyCode !== Event.KEY_ESC && b.type !== "blur") {
            if (!Element.hasClassName(menuDisplayed, "inactive")) {
                this.clearSelectedItem();
                var f = menuDisplayed.childNodes;
                for (var a = 0; a < f.length; a++) {
                    if (Element.hasClassName(f[a], "tick")) {
                        f[a].style.visibility = "visible"
                    } else {
                        if (Element.hasClassName(f[a], "shipping-type-title")) {
                            var c = f[a].innerHTML
                        }
                    }
                }
                if (m || b.type === "touchend") {
                    Event.sendMouseEvent(d, "click", true, true)
                }
                this.customSelectButton.setAttribute("value", c);
                this.currentItemLabel.innerHTML = c;
                Element.addClassName(this.customSelect, "hide");
                Event.stopObserving(document, "click", this.keyDownObserver);
                Element.query(".select-overlay").setAttribute("aria-hidden", true);
                this.prevFocus.focus()
            }
        } else {
            Element.addClassName(this.customSelect, "hide");
            Event.stopObserving(document, "click", this.keyDownObserver);
            Element.query(".select-overlay").setAttribute("aria-hidden", true);
            this.prevFocus.focus()
        }
    }
    Event.stop(b)
},clearSelectedItem: function() {
    var b = Element.queryAll(".tick");
    for (var a = 0; a < b.length; a++) {
        b[a].style.visibility = "hidden"
    }
},shippingOptionsOverlay: function() {
    var c = Element.queryAll(".shipping-options table fieldset input");
    for (var b = 0; b < c.length; b++) {
        Event.observe(c[b], "click", function(g) {
            var f = g.target || g.srcElement;
            f.focus()
        }.bind(this))
    }
    var d = Element.query(".user-form-fieldset");
    if (d == null) {
        var a = $("shippingOptions-search-postalCode");
        if (a && a.nodeName === "SPAN") {
            a.disabled = true
        }
    }
},navigatePageLocation: function(c) {
    var a = c.id, b = $("delivery-box"), d = c.key;
    coherent.Animator.scrollTo($(b));
    this.performAction(d)
},getLineItems: function(c) {
    var f = Element.queryAll("#cart-product-list li.cart-product"), d = c.id, a = 0;
    for (var b = 0; b < f.length; b++) {
        a++;
        if (f[b] == c) {
            break
        }
    }
    switch (a) {
        case 1:
            return "first";
            break;
        case f.length:
            return "last";
            break;
        default:
            return "inBetween";
            break
    }
},showAddressForm: function(o) {
    var d = o.id.replace("shipping-user-form-content", "lineItemAddress"), a = o.id.replace("shipping-user-form-content", "select-recent-addresses"), b = $(d), q = $(a), c = Element.getStyle(b, "height"), g = $(o.id), h, f, n = this.viewElement(), m = 0;
    this.addressForm = b;
    this.addressFormHeight = c;
    this.selectRecentLink = q;
    if (q) {
        q.style.display = "none"
    }
    b.style.height = 0 + "px";
    b.style.overflow = "hidden";
    h = Element.locateAncestor(g, function k(r) {
        return Element.hasClassName(r, "cart-product")
    }, n);
    f = this.getLineItems(h);
    if (f == "first") {
        this.setFocusTo = (function() {
            var r = {duration: 950};
            coherent.Animator.scrollTo($(h), r)
        }).bindAndDelay(this, 100);
        this.animateAddressForm.bindAndDelay(this, 950)
    } else {
        this.setFocusTo = (function() {
            var r = {duration: 950};
            coherent.Animator.scrollTo($(h), r)
        }).bindAndDelay(this, 900);
        this.animateAddressForm.bindAndDelay(this, 2000)
    }
},showEditAddressView: function(f) {
    this.closeRecentAddressOverlay();
    if (f.key) {
        var d = Element.query("#" + f.key), a = Element.locateAncestor(d, function c(k) {
            return Element.hasClassName(k, "product-shipping")
        }, this.viewElement);
        Element.queryAll(Element.query(".cart-product"), ".fade").forEach(function(k) {
            Element.removeClassName(k, "fade")
        }.bind(this));
        var b = $("shipping-select-recent-address");
        if (b) {
            b.style.display = "block"
        }
        var g = Element.locateAncestor(d, function c(k) {
            return Element.hasClassName(k, "shipping-product-admin")
        }, this.viewElement);
        Element.removeClassName(g, "fade");
        var h = Element.locateAncestor(d, function c(k) {
            return Element.hasClassName(k, "line-item-address")
        }, this.viewElement);
        this.fadeOutModule = (function() {
            Element.removeClassName(h.parentNode, "fade");
            coherent.Animator.setStyles(h, {height: this.addressFormHeight + "px",opacity: 1}, {duration: 100})
        }).bindAndDelay(this, 250);
        a.style.opacity = 1;
        this.setFocusTo = (function() {
            var k = {duration: 950};
            coherent.Animator.scrollTo($(a), k)
        }).bindAndDelay(this, 100);
        this.animateAddressForm.bindAndDelay(this, 950)
    }
},animateAddressForm: function() {
    if (this.addressForm) {
        coherent.Animator.setStyles(this.addressForm, {height: this.addressFormHeight + "px",opacity: 1}, {duration: 700})
    }
    var b;
    this.resetAddressForm = (function() {
        this.addressForm.style.height = "auto"
    }).bindAndDelay(this, 1800);
    var a = (function() {
        if (this.selectRecentLink) {
            this.selectRecentLink.style.display = "block"
        }
    }).bindAndDelay(this, 50)
},processCurrentModule: function(g) {
    var a = this.viewElement(), f, d = $(g.id);
    f = Element.locateAncestor(d, function c(k) {
        return Element.hasClassName(k, "line-item-address")
    }, a);
    this.saveLineItemAction = g.key;
    if (this.validateAction(this.saveLineItemAction)) {
        f.style.overflow = "hidden";
        f.style.height = f.offsetHeight + "px";
        coherent.Animator.setStyles(f, {height: 0 + "px",opacity: 0}, {duration: 500});
        var b = $("shipping-select-recent-address");
        if (b) {
            b.style.display = "none"
        }
        var h = Element.locateAncestor(d, function c(k) {
            return Element.hasClassName(k, "product-shipping")
        }, a);
        this.fadeOutModule = (function() {
            Element.addClassName(h.parentNode, "fade");
            coherent.Animator.setStyles(h, {opacity: 0}, {duration: 500})
        }).bindAndDelay(this, 950);
        this.saveLineItem = (function() {
            this.performAction(this.saveLineItemAction)
        }).bindAndDelay(this, 500)
    }
},fadeInModule: function(v) {
    var f = $(v.id), n = this.viewElement(), g = Element.getViewport(), r, d, m, t, c, q, b, o = Element.locateAncestor(f, function k(x) {
        return Element.hasClassName(x, "product-shipping")
    }, n), h = 0;
    o.style.opacity = 0;
    coherent.Animator.setStyles(o, {opacity: 1}, {duration: 500});
    d = $("cart-continue-button");
    r = Element.locateAncestor(d, function k(x) {
        return Element.hasClassName(x, "step-continue")
    }, n);
    m = Element.getRect(r);
    c = g.height;
    q = m.top;
    b = Element.queryAll("#cart-product-list .line-item-address");
    for (var a = 0; a < b.length; a++) {
        if (b[a].hasChildNodes()) {
            h = 1;
            break
        }
    }
    if (h == 0) {
        var w = {duration: 1150};
        if (c > q) {
            t = [0, 0];
            coherent.Animator.scrollTo(t, w)
        } else {
            var u = (q - c) + r.offsetHeight;
            t = [0, u];
            coherent.Animator.scrollTo(t, w)
        }
    }
},a11yJsonAlert: function(b) {
    var c = this.content.valueForKeyPath("availability.a11y-message");
    if (c) {
        var a = document.createElement("DIV");
        a.innerHTML = c;
        plainMessage = a.innerText || a.textContent;
        this.ariaAlert.say(plainMessage)
    }
},enablePaymentContinueButton: function() {
    var a = $("payment-continue-button");
    if (a) {
        a.disabled = false;
        Element.removeClassName(a, "disabled");
        a.removeAttribute("disabled")
    }
},disablePaymentContinueButton: function() {
    var a = $("payment-continue-button");
    if (a) {
        a.disabled = true;
        Element.addClassName(a, "disabled");
        a.setAttribute("disabled", "disabled")
    }
}});
apple.checkout.CheckoutViewController.create = function(c, b) {
    var a = new apple.checkout.BopisCheckoutViewController(c);
    if (b) {
        a.surveyData = b
    }
    return a
};
$P(apple.checkout.CheckoutViewController, "create", "Initialize");
apple.checkout.BopisCheckoutViewController = apple.checkout.CheckoutViewController;
apple.checkout.BopisCheckoutViewController.create = apple.checkout.CheckoutViewController.create;
function getPGIOresult() {
    if (document.PGIOForm.elements.replycode.value.length > 0) {
        document.PGIOForm.submit()
    }
}
Package("apple.checkout");
apple.checkout.StoreLocatorViewController = Class.create(apple.transaction.ViewController, {});
apple.checkout.StoreLocatorViewController.create = function(a) {
    return new apple.checkout.StoreLocatorViewController(a)
};
$P(apple.checkout.StoreLocatorViewController, "create", "Initialize");
Package("apple.checkout");
apple.checkout.ThankyouCartsList = Class.create(coherent.View, {__structure__: {}});
apple.checkout.ThankyouViewController = Class.create(apple.transaction.ViewController, {__structure__: {"#pickup": coherent.View({visibleBinding: "content.pickup.enabled"}),"#shipping": coherent.View({visibleBinding: "content.summary.shipping.esd||content.shipping.enabled"}),"#email": coherent.View({visibleBinding: "content.emailCart.enabled"}),"#shipping-box-title": coherent.View({visibleBinding: "content.shipping.enabled"}),"#esd-box-title": coherent.View({visibleBinding: "content.summary.shipping.esd"}),"#user-message-text": coherent.View({htmlBinding: "content.userMessageText.html"}),"#order-instructions": coherent.ListView({visibleBinding: "content.instructions.activationKeys",contentBinding: "content.instructions.activationKeys",template: coherent.View({htmlBinding: "*.html"})}),"#download-instructions": coherent.View({visibleBinding: "content.instructions.showStaticDownloadInstructions"}),"#action-print": coherent.Anchor({action: "printCart"}),"#adc-jv-o2o": coherent.View({visibleBinding: "content.summary.shipping.membershipEnabled"})},init: function() {
    this.base();
    if (this.surveyData) {
        var b = window.apple.survey;
        b.surveyButton(this)
    }
    var a = this;
    window.setTimeout(function() {
        a.initSocialSharingURL()
    }, 0)
},getSurveyData: function() {
    return this.surveyData
},surveyFeature: function() {
    return "Survey"
},surveyEVar: function() {
    return "eVar5"
},surveyElement: function() {
    var a = this.surveyData;
    var f = unescape(a.surveyURL);
    var d = window.s;
    function g(k) {
        k += "=";
        var h = document.cookie.split(";");
        for (var m = 0; m < h.length; m++) {
            var n = h[m];
            while (n.charAt(0) === " ") {
                n = n.substring(1, n.length)
            }
            if (n.indexOf(k) === 0) {
                return n.substring(k.length, n.length)
            }
        }
        return null
    }
    var b = new Date();
    f += (f.indexOf("?") === -1 ? "?" : "&") + "Pagename=" + escape(d.pageName) + "&visitorID=" + escape(g("s_vi")) + "&hit_time_gmt=" + escape(b.toGMTString()) + "&OS=" + escape(d.n.oscpu);
    var c = document.createElement("li");
    Element.setInnerHTML(c, '<a target="_blank" href="' + f + '"><span>' + a.surveyButtonText + "</span></a>");
    Element.setStyle(c, "opacity", 0);
    this.surveyElementId = Element.assignId(c);
    return c
},surveyCallback: function(d) {
    if (d) {
        var a = $(this.surveyElementId);
        var c = Element.query(document.body, "#user_nav ul, #guide_wrap ul");
        if (c) {
            if (!(this.surveyElementId && a)) {
                var b = c.getElementsByTagName("li")[0];
                b.parentNode.insertBefore(d, b);
                a = $(this.surveyElementId)
            }
            Element.setStyle(a, "display", "inline");
            coherent.Animator.setStyles(a, {opacity: 1});
            apple.metrics.fireMicroEvent({feature: "Survey",action: "displayed"})
        }
    }
},surveyCallbackHide: function(b) {
    b.alreadyShown = false;
    var a = $(this.surveyElementId);
    if (a) {
        coherent.Animator.setStyles(a, {opacity: 0}, {callback: function() {
            Element.setStyle(a, "display", "none")
        }})
    }
},__customViews__: {"shipping-summary-user-emailAddress": function(b, c, a, d) {
    return new apple.checkout.CheckoutSummaryView(b, this, {htmlBinding: a + c.key + "(truncateEmail)",titleBinding: a + c.key})
},"payment-summary-user-address-emailAddress": function(b, c, a, d) {
    return new apple.checkout.CheckoutSummaryView(b, this, {htmlBinding: a + c.key + "(truncateEmail)",titleBinding: a + c.key})
}},printCart: function() {
    window.print()
},popupShare: function(b) {
    var a;
    if (b.url) {
        a = window.open(b.url, "sharer", "location=0,toolbar=0,status=0,height=351,width=640,scrollbars=yes,resizable=yes,top=300,left=550")
    }
    if (coherent.Browser.IE) {
        (function() {
            if (a) {
                a.focus()
            }
        }).bindAndDelay(this, 0)
    }
},initSocialSharingURL: function() {
    Element.queryAll("#socialSharingDisplay a[target]").forEach(function(b) {
        if (b) {
            var c = b.href;
            var a = c.match(/\?vid2\=|&vid2\=/i);
            if (a === null) {
                if (c.indexOf("?") > -1) {
                    c = /&$/.test(c) ? c + "vid2=" : c + "&vid2="
                } else {
                    c = c + "?vid2="
                }
                b.href = c + apple.cookie("dssid2")
            }
        }
    })
},contentSetCallback: function(c) {
    this.base(c);
    var a = Element, b, d;
    a.removeClassName($("thankyou-wrapper"), "hide-load");
    if (c.autoESDDownload) {
        if (c.autoESDDownload.triggerESDAutoDownload === true) {
            if ((b = a.query("p.download-now a")) && b.href) {
                d = document.createElement("iframe");
                d.setAttribute("frameborder", 0);
                d.setAttribute("height", "0px");
                d.setAttribute("width", "0px");
                d.setAttribute("scrolling", "no");
                d.setAttribute("src", b.href);
                document.body.appendChild(d)
            }
        }
    }
}});
apple.checkout.ThankyouViewController.create = function(c, b) {
    var a = new apple.checkout.ThankyouViewController(c, {surveyData: b});
    return a
};
$P(apple.checkout.ThankyouViewController, "create", "Initialize");
var lastFieldValue = null;
var baseURL = null;
var estimatedTaxFade = null;
var estimatedTotalFade = null;
var calculated = false;
function updateTaxAndTotal(b) {
    var a;
    if (baseURL === null) {
        baseURL = $("taxupdateurl").innerHTML
    }
    a = baseURL + "&zipcode=" + b;
    var c = XHR.get(a);
    c.addMethods(updateLoaded)
}
function formatNumber(g, h, k) {
    var b = g.toString();
    var d;
    var a;
    var f;
    var m;
    var c;
    f = b.lastIndexOf(k);
    if (f == -1 || f == (b.length - 1)) {
        d = "";
        f = b.length
    } else {
        d = b.substring((f + 1))
    }
    if (d.length > 2) {
        d = d.substring(0, 2)
    } else {
        while (d.length < 2) {
            d += "0"
        }
    }
    a = b.substring(0, f);
    m = Math.floor(a.length / 3);
    c = a.length % 3;
    if (m > 0 && c === 0) {
        m--
    }
    if (m > 0) {
        if (c === 0) {
            c = 3
        }
        f = c;
        b = a.substring(0, c);
        while (m > 0) {
            b += h + a.substring(f, f + 3);
            f += 3;
            m--
        }
    } else {
        b = a
    }
    b += k + d;
    return b
}
function updateLoaded(g) {
    var k = Number(g);
    var n = Number($("subtotalstring").innerHTML) * 100;
    var d = Number($("shippingcoststring").innerHTML) * 100;
    var b = $("estimatedtaxelement");
    var f = $("taxline");
    var h = $("estimatedtotal");
    var a;
    var c;
    if (k == -2) {
        f.style.visibility = "hidden";
        a = (n + d) / 100;
        c = formatNumber(a, ",", ".");
        if (h.innerHTML != c) {
            h.innerHTML = c;
            restartFade()
        }
    } else {
        if (k == -1) {
            f.style.visibility = "visible";
            b.innerHTML = $("unknowntaxrate").innerHTML;
            a = (n + d) / 100;
            c = formatNumber(a, ",", ".");
            if (h.innerHTML != c) {
                h.innerHTML = c;
                restartFade()
            }
        } else {
            var m = $("currencysymbol").innerHTML + formatNumber(k, ",", ".");
            a = ((k * 100) + n + d) / 100;
            if (m != b.innerHTML || f.style.visibility != "visible") {
                b.innerHTML = m;
                $("estimatedtotal").innerHTML = formatNumber(a, ",", ".");
                f.style.visibility = "visible";
                restartFade()
            }
        }
    }
}
function checkZipCode(a) {
    var b = a.value;
    if (b == lastFieldValue) {
        return
    } else {
        if (lastFieldValue === null) {
            lastFieldValue = b;
            return
        }
    }
    lastFieldValue = b;
    if (b === null || b.length === 0 || b.match(/^\d{5}$/)) {
        updateTaxAndTotal(b)
    } else {
        updateLoaded(null, "-2", null)
    }
}
function validateKeyPress(b) {
    var a;
    if (!b) {
        b = window.event
    }
    if (b.metaKey || b.ctrlKey || b.altKey) {
        return true
    }
    a = (b.charCode) ? b.charCode : ((b.keyCode) ? b.keyCode : ((b.which) ? b.which : 0));
    if ((a >= 48 && a <= 57) || a < 32 || a > 126 || (a >= 37 && a <= 40 && !b.shiftKey)) {
        return true
    }
    return false
}
function restartFade() {
    var a = $("estimatedtaxelement");
    a.style.backgroundColor = "#a2c9ef";
    coherent.Animator.setStyles(a, {backgroundColor: coherent.Browser.IE ? "#fff" : "rgba(255,255,255,0)"}, {duration: 3000,easing: coherent.easing.inSine,cleanup: true});
    var b = $("estimatedtotalelement");
    b.style.backgroundColor = "#a2c9ef";
    coherent.Animator.setStyles(b, {backgroundColor: coherent.Browser.IE ? "#fff" : "rgba(255,255,255,0)"}, {duration: 3000,easing: coherent.easing.inSine,cleanup: true})
}
var DeviceID = {winterTimezoneOffset: new Date(2005, 0, 15).getTimezoneOffset(),summerTimezoneOffset: new Date(2005, 6, 15).getTimezoneOffset(),plugins: [],activeX: {Flash: ["ShockwaveFlash.ShockwaveFlash", function(a) {
    return a.getVariable("$version")
}],Director: ["SWCtl.SWCtl", function(a) {
    return a.ShockwaveVersion("")
}]},comp: null,getDocumentElement: function(d) {
    var c = null;
    try {
        c = document.getElementById(d)
    } catch (f) {
    }
    if (c === null || typeof (c) == "undefined") {
        try {
            c = document.getElementsByName(d)[0]
        } catch (f) {
        }
    }
    if (c === null || typeof (c) == "undefined") {
        for (var b = 0; b < document.forms.length; b++) {
            var a = document.forms[b];
            for (var h = 0; h < a.elements.length; h++) {
                var g = a[h];
                if (g.name == d || g.id == d) {
                    return g
                }
            }
        }
    }
    return c
},getCompVer: function(d) {
    var b = "";
    try {
        if (typeof (this.comp.getComponentVersion) != "undefined") {
            b = this.comp.getComponentVersion(d, "ComponentID")
        }
    } catch (c) {
        var a = c.message.length;
        a = Math.min(40, a);
        b = escape(c.message.substr(0, a))
    }
    return b
},findVariable: function(possibles) {
    for (var i = 0; i < possibles.length; i++) {
        try {
            var val = eval(possibles[i]);
            if (val) {
                return val
            }
        } catch (e) {
        }
    }
    return ""
},getPluginVersion: function(d) {
    var a = "";
    try {
        if (navigator.plugins && navigator.plugins.length) {
            var f = new RegExp(d + ".* ([0-9._]+)");
            for (var c = 0; c < navigator.plugins.length; c++) {
                var b = f.exec(navigator.plugins[c].name);
                if (b === null) {
                    b = f.exec(navigator.plugins[c].description)
                }
                if (b) {
                    a = b[1]
                }
            }
        } else {
            if (window.ActiveXObject && DeviceID.activeX[d]) {
                try {
                    var g = new ActiveXObject(DeviceID.activeX[d][0]);
                    a = DeviceID.activeX[d][1](g)
                } catch (h) {
                    a = ""
                }
            }
        }
    } catch (h) {
        a = h.message
    }
    return a
},getPluginVersions: function() {
    var a = ["Acrobat", "Flash", "QuickTime", "Java Plug-in", "Director", "Office"];
    for (var c = 0; c < a.length; c++) {
        var b = a[c];
        DeviceID.plugins[b] = DeviceID.getPluginVersion(b)
    }
},getDSTOffset: function() {
    return Math.abs(this.winterTimezoneOffset - this.summerTimezoneOffset)
},isDSTSupported: function() {
    return (this.getDSTOffset() !== 0)
},isDSTActive: function(a) {
    var b = Math.min(this.winterTimezoneOffset, this.summerTimezoneOffset);
    return (this.isDSTSupported() && a.getTimezoneOffset() == b)
},getTimezoneOffsetInHours: function(c) {
    var b = 0;
    var a = 0;
    if (this.isDSTActive(c)) {
        a = this.getDSTOffset()
    }
    b = -(c.getTimezoneOffset() + a) / 60;
    return b
},replaceString: function(g, d, c, h) {
    if (typeof (h) != "boolean") {
        h = false
    }
    var k = true;
    var f;
    while ((f = g.indexOf(d)) >= 0 && (h || k)) {
        g = g.substr(0, f) + c + g.substr(f + d.length);
        k = false
    }
    return g
},getLocalPastDate: function() {
    return new Date(2005, 5, 7, 21, 33, 44, 888).toLocaleString()
},userPrefs: function(debug) {
    this.debug = debug;
    var dateTimeValue = new Date();
    var attributesToRead = ['"TF1"', '"015"', "ScriptEngineMajorVersion()", "ScriptEngineMinorVersion()", "ScriptEngineBuildVersion()", "DeviceID.getCompVer('{7790769C-0471-11D2-AF11-00C04FA35D02}')", "DeviceID.getCompVer('{89820200-ECBD-11CF-8B85-00AA005B4340}')", "DeviceID.getCompVer('{283807B5-2C60-11D0-A31D-00AA00B92C03}')", "DeviceID.getCompVer('{4F216970-C90C-11D1-B5C7-0000F8051515}')", "DeviceID.getCompVer('{44BBA848-CC51-11CF-AAFA-00AA00B6015C}')", "DeviceID.getCompVer('{9381D8F2-0288-11D0-9501-00AA00B911A5}')", "DeviceID.getCompVer('{4F216970-C90C-11D1-B5C7-0000F8051515}')", "DeviceID.getCompVer('{5A8D6EE0-3E18-11D0-821E-444553540000}')", "DeviceID.getCompVer('{89820200-ECBD-11CF-8B85-00AA005B4383}')", "DeviceID.getCompVer('{08B0E5C0-4FCB-11CF-AAA5-00401C608555}')", "DeviceID.getCompVer('{45EA75A0-A269-11D1-B5BF-0000F8051515}')", "DeviceID.getCompVer('{DE5AED00-A4BF-11D1-9948-00C04F98BBC9}')", "DeviceID.getCompVer('{22D6F312-B0F6-11D0-94AB-0080C74C7E95}')", "DeviceID.getCompVer('{44BBA842-CC51-11CF-AAFA-00AA00B6015B}')", "DeviceID.getCompVer('{3AF36230-A269-11D1-B5BF-0000F8051515}')", "DeviceID.getCompVer('{44BBA840-CC51-11CF-AAFA-00AA00B6015C}')", "DeviceID.getCompVer('{CC2A9BA0-3BDD-11D0-821E-444553540000}')", "DeviceID.getCompVer('{08B0E5C0-4FCB-11CF-AAA5-00401C608500}')", "navigator.appCodeName", "navigator.appName", "navigator.appVersion", "DeviceID.findVariable(['navigator.productSub','navigator.appMinorVersion'])", "navigator.browserLanguage", "navigator.cookieEnabled", "DeviceID.findVariable(['navigator.oscpu','navigator.cpuClass'])", "navigator.onLine", "navigator.platform", "navigator.systemLanguage", "navigator.userAgent", "DeviceID.findVariable(['navigator.language','navigator.userLanguage'])", "document.defaultCharset", "document.domain", "screen.deviceXDPI", "screen.deviceYDPI", "screen.fontSmoothingEnabled", "screen.updateInterval", "DeviceID.isDSTSupported()", "DeviceID.isDSTActive(dateTimeValue)", "'@UTC@'", "DeviceID.getTimezoneOffsetInHours(dateTimeValue)", "DeviceID.getLocalPastDate()", "screen.width", "screen.height", "DeviceID.plugins['Acrobat']", "DeviceID.plugins['Flash']", "DeviceID.plugins['QuickTime']", "DeviceID.plugins['Java Plug-in']", "DeviceID.plugins['Director']", "DeviceID.plugins['Office']", "(new Date().getTime()) - str.getTime()", "DeviceID.winterTimezoneOffset", "DeviceID.summerTimezoneOffset", "dateTimeValue.toLocaleString()", "screen.colorDepth", "window.screen.availWidth", "window.screen.availHeight", "window.screen.availLeft", "window.screen.availTop", "DeviceID.getPluginName('Acrobat')", "DeviceID.getPluginName('Adobe SVG')", "DeviceID.getPluginName('Authorware')", "DeviceID.getPluginName('Citrix ICA')", "DeviceID.getPluginName('Director')", "DeviceID.getPluginName('Flash')", "DeviceID.getPluginName('MapGuide')", "DeviceID.getPluginName('MetaStream')", "DeviceID.getPluginName('PDFViewer')", "DeviceID.getPluginName('QuickTime')", "DeviceID.getPluginName('RealOne')", "DeviceID.getPluginName('RealPlayer Enterprise')", "DeviceID.getPluginName('RealPlayer Plugin')", "DeviceID.getPluginName('Seagate Software Report')", "DeviceID.getPluginName('Silverlight')", "DeviceID.getPluginName('Windows Media')", "DeviceID.getPluginName('iPIX')", "DeviceID.getPluginName('nppdf.so')", "DeviceID.getFontHeight()"];
    DeviceID.getPluginVersions();
    this.rslt = "";
    for (var i = 0; i < attributesToRead.length; i++) {
        if (this.debug) {
            this.rslt += DeviceID.replaceString(attributesToRead[i], '"', "'", true);
            this.rslt += "="
        }
        var evaluatedResult = null;
        try {
            evaluatedResult = eval(attributesToRead[i])
        } catch (e) {
            evaluatedResult = ""
        }
        this.rslt += (this.debug ? evaluatedResult : escape(evaluatedResult));
        this.rslt += ";";
        if (this.debug) {
            this.rslt += "\\n"
        }
    }
    this.rslt = DeviceID.replaceString(this.rslt, escape("@UTC@"), new Date().getTime());
    this.encodeData = new Function("return '" + this.rslt + "'")
},validateWithField: function(a) {
    try {
        var b = null;
        b = this.getDocumentElement(a);
        if (b === null) {
            return
        }
        b.value = DeviceID.validate()
    } catch (c) {
    }
},validate: function() {
    try {
        var a = new this.userPrefs();
        return a.encodeData()
    } catch (b) {
        return escape(b.message)
    }
},getPluginName: function(a) {
    try {
        if (navigator.plugins && navigator.plugins.length) {
            for (var b = 0; b < navigator.plugins.length; b++) {
                var c = navigator.plugins[b];
                if (c.name.indexOf(a) >= 0) {
                    return c.name + ((c.description) ? "|" + c.description : "")
                }
            }
        }
    } catch (d) {
    }
    return ""
},getFontHeight: function() {
    var b = document.createElement("span");
    b.innerHTML = "&nbsp;";
    b.style.position = "absolute";
    b.style.left = "-9999px";
    document.body.appendChild(b);
    var a = b.offsetHeight;
    document.body.removeChild(b);
    return a
}};
try {
    DeviceID.comp = document.createElement("span");
    if (typeof (DeviceID.comp.addBehavior) != "undefined") {
        DeviceID.comp.addBehavior("#default#clientCaps")
    }
} catch (e) {
}
Package("apple.checkout");
apple.checkout.ReserveYourOrderController = Class.create(apple.checkout.CheckoutViewController, {__structure__: {"#reserve-order-creation-wrapper": coherent.Fieldset()},init: function() {
    this.base();
    Event.observe($("u_cart"), "click", function(a) {
        window.location.href = a.target.href
    });
    this.addObserverForKeyPath(this, this.observeItemsChange, "content.cart.items")
},reserveMyOrder: function(a) {
    if (this.validateAction(a.action)) {
        this.performAction(a.action)
    }
},_handleEvent: function(a) {
    var b = a.target || a.srcElement;
    if (Element.hasClassName(b, "product-remove")) {
        this.removeItem(b, "removed")
    }
    this.base(a)
},removeItem: function(b, g) {
    var a = this.viewElement(), f = Element.query(document, "section.box"), d = this.valueForKeyPath("content.cart.items").mutableKeys().length, c = Element.locateAncestor(b, function(h) {
        return Element.hasClassName(h, "cart-product")
    }, this.viewElement());
    coherent.Animator.addClassName(c, g, {callback: function() {
        if (d < 2) {
            coherent.Animator.addClassName(f, "empty-cart", {delay: 500,only: ["height", "margin", "padding", "opacity", "display"],discreteTransitionPoint: 1});
            a.style.background = "none"
        }
    }})
},observeItemsChange: function(g, f, c) {
    var a = this.viewElement(), d = Element.query(document, "section.box"), b = {only: ["height", "margin", "padding", "opacity", "display"],discreteTransitionPoint: 0,cleanup: true};
    if (!g.newValue || g.newValue.mutableKeys().length === 0) {
        coherent.Animator.addClassName(d, "empty-cart", b);
        a.style.background = "none"
    }
}});
function DCHelper() {
    this.setData = function(g) {
        var f = a(g);
        if (typeof f === "undefined" || f === null) {
            return
        }
        f.value = this.getData()
    };
    this.getData = function() {
        var f = {};
        f.U = navigator.userAgent;
        f.L = b();
        f.Z = c();
        f.V = "1.0";
        return encodeURIComponent(JSON.stringify(f))
    };
    function b() {
        if (window.navigator.language) {
            return window.navigator.language
        } else {
            if (navigator.browserLanguage) {
                return navigator.browserLanguage
            }
        }
        return ""
    }
    function c() {
        var f = new Date();
        return d(f.getTimezoneOffset())
    }
    function d(n) {
        if (typeof n !== "number" || n === null) {
            return ""
        }
        var f = Math.abs(parseInt(n / 60, 10));
        var h = Math.abs(n % 60);
        var m = (f < 10) ? "0" + f : f;
        var g = (h < 10) ? "0" + h : h;
        var k = n > 0 ? "-" : "+";
        return "GMT" + k + m + ":" + g
    }
    function a(t) {
        var o = document.getElementById(t);
        if (typeof o === "undefined" || o === null) {
            var m = document.getElementsByName(t);
            if (typeof m !== "undefined" && m !== null && m.length > 0) {
                o = m[0]
            }
        }
        if (typeof o === "undefined" || o === null) {
            for (var r = 0, n = document.forms.length; r < n; r++) {
                for (var q = 0, k = document.forms[r], g = k.elements.length; q < g; q++) {
                    var h = k[q];
                    if (h.name === t) {
                        return h
                    }
                }
            }
        }
        return o
    }
}
window.dcHelper = new DCHelper();
Package("apple.transaction");
apple.transaction.SocialShareViewController = Class.create(apple.transaction.ViewController, {__structure__: {},init: function() {
    this.base();
    var a = this;
    if ((coherent.Browser.IE === 8) || (coherent.Browser.MobileSafari)) {
        setTimeout(function() {
            Element.queryAll(".product").forEach(function(b) {
                Event.observe(b, "click", a.imageClicked)
            })
        }, 300)
    }
},imageClicked: function(a) {
    var b = a.srcElement.parentElement.parentElement;
    Element.query(b, "input[type=radio]").checked = true
},shareProductDetails: function(a, d) {
    var f = "";
    var c = "";
    if (this.content.valueForKey("sharing") && this.content.valueForKey("sharing").selectedURL) {
        f = this.content.valueForKey("sharing").selectedProduct;
        c = this.content.valueForKey("sharing").selectedNetwork + " post";
        apple.metrics.fireMicroEvent({eVar: "eVar6",feature: "Sharing",page: "AOS: Checkout/Sharing",action: c,part: f});
        var b = this;
        window.setTimeout(function() {
            window.location.href = b.content.valueForKey("sharing").selectedURL
        }, 500)
    }
}});
apple.transaction.SocialShareViewController.create = function(c, b) {
    var a = new apple.transaction.SocialShareViewController(c, {sharingData: b});
    return a
};
$P(apple.transaction.SocialShareViewController, "create", "Initialize");
