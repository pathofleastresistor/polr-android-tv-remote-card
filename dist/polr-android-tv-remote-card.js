/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const G = globalThis, vt = G.ShadowRoot && (G.ShadyCSS === void 0 || G.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, _t = Symbol(), Pt = /* @__PURE__ */ new WeakMap();
let ie = class {
  constructor(e, o, i) {
    if (this._$cssResult$ = !0, i !== _t) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = o;
  }
  get styleSheet() {
    let e = this.o;
    const o = this.t;
    if (vt && e === void 0) {
      const i = o !== void 0 && o.length === 1;
      i && (e = Pt.get(o)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && Pt.set(o, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const ye = (t) => new ie(typeof t == "string" ? t : t + "", void 0, _t), ft = (t, ...e) => {
  const o = t.length === 1 ? t[0] : e.reduce((i, n, s) => i + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + t[s + 1], t[0]);
  return new ie(o, t, _t);
}, we = (t, e) => {
  if (vt) t.adoptedStyleSheets = e.map((o) => o instanceof CSSStyleSheet ? o : o.styleSheet);
  else for (const o of e) {
    const i = document.createElement("style"), n = G.litNonce;
    n !== void 0 && i.setAttribute("nonce", n), i.textContent = o.cssText, t.appendChild(i);
  }
}, Ct = vt ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let o = "";
  for (const i of e.cssRules) o += i.cssText;
  return ye(o);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: $e, defineProperty: xe, getOwnPropertyDescriptor: Ae, getOwnPropertyNames: ke, getOwnPropertySymbols: Ee, getPrototypeOf: Te } = Object, ot = globalThis, Ot = ot.trustedTypes, Se = Ot ? Ot.emptyScript : "", Pe = ot.reactiveElementPolyfillSupport, W = (t, e) => t, J = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? Se : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, e) {
  let o = t;
  switch (e) {
    case Boolean:
      o = t !== null;
      break;
    case Number:
      o = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        o = JSON.parse(t);
      } catch {
        o = null;
      }
  }
  return o;
} }, gt = (t, e) => !$e(t, e), Mt = { attribute: !0, type: String, converter: J, reflect: !1, useDefault: !1, hasChanged: gt };
Symbol.metadata ??= Symbol("metadata"), ot.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let D = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, o = Mt) {
    if (o.state && (o.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((o = Object.create(o)).wrapped = !0), this.elementProperties.set(e, o), !o.noAccessor) {
      const i = Symbol(), n = this.getPropertyDescriptor(e, i, o);
      n !== void 0 && xe(this.prototype, e, n);
    }
  }
  static getPropertyDescriptor(e, o, i) {
    const { get: n, set: s } = Ae(this.prototype, e) ?? { get() {
      return this[o];
    }, set(a) {
      this[o] = a;
    } };
    return { get: n, set(a) {
      const c = n?.call(this);
      s?.call(this, a), this.requestUpdate(e, c, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Mt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(W("elementProperties"))) return;
    const e = Te(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(W("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(W("properties"))) {
      const o = this.properties, i = [...ke(o), ...Ee(o)];
      for (const n of i) this.createProperty(n, o[n]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const o = litPropertyMetadata.get(e);
      if (o !== void 0) for (const [i, n] of o) this.elementProperties.set(i, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [o, i] of this.elementProperties) {
      const n = this._$Eu(o, i);
      n !== void 0 && this._$Eh.set(n, o);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const o = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const n of i) o.unshift(Ct(n));
    } else e !== void 0 && o.push(Ct(e));
    return o;
  }
  static _$Eu(e, o) {
    const i = o.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
  }
  addController(e) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), o = this.constructor.elementProperties;
    for (const i of o.keys()) this.hasOwnProperty(i) && (e.set(i, this[i]), delete this[i]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return we(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, o, i) {
    this._$AK(e, i);
  }
  _$ET(e, o) {
    const i = this.constructor.elementProperties.get(e), n = this.constructor._$Eu(e, i);
    if (n !== void 0 && i.reflect === !0) {
      const s = (i.converter?.toAttribute !== void 0 ? i.converter : J).toAttribute(o, i.type);
      this._$Em = e, s == null ? this.removeAttribute(n) : this.setAttribute(n, s), this._$Em = null;
    }
  }
  _$AK(e, o) {
    const i = this.constructor, n = i._$Eh.get(e);
    if (n !== void 0 && this._$Em !== n) {
      const s = i.getPropertyOptions(n), a = typeof s.converter == "function" ? { fromAttribute: s.converter } : s.converter?.fromAttribute !== void 0 ? s.converter : J;
      this._$Em = n;
      const c = a.fromAttribute(o, s.type);
      this[n] = c ?? this._$Ej?.get(n) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, o, i, n = !1, s) {
    if (e !== void 0) {
      const a = this.constructor;
      if (n === !1 && (s = this[e]), i ??= a.getPropertyOptions(e), !((i.hasChanged ?? gt)(s, o) || i.useDefault && i.reflect && s === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, i)))) return;
      this.C(e, o, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, o, { useDefault: i, reflect: n, wrapped: s }, a) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? o ?? this[e]), s !== !0 || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (o = void 0), this._$AL.set(e, o)), n === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (o) {
      Promise.reject(o);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [n, s] of this._$Ep) this[n] = s;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [n, s] of i) {
        const { wrapped: a } = s, c = this[n];
        a !== !0 || this._$AL.has(n) || c === void 0 || this.C(n, void 0, s, c);
      }
    }
    let e = !1;
    const o = this._$AL;
    try {
      e = this.shouldUpdate(o), e ? (this.willUpdate(o), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(o)) : this._$EM();
    } catch (i) {
      throw e = !1, this._$EM(), i;
    }
    e && this._$AE(o);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((o) => o.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq &&= this._$Eq.forEach((o) => this._$ET(o, this[o])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
D.elementStyles = [], D.shadowRootOptions = { mode: "open" }, D[W("elementProperties")] = /* @__PURE__ */ new Map(), D[W("finalized")] = /* @__PURE__ */ new Map(), Pe?.({ ReactiveElement: D }), (ot.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const bt = globalThis, zt = (t) => t, Q = bt.trustedTypes, Rt = Q ? Q.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, ne = "$lit$", A = `lit$${Math.random().toFixed(9).slice(2)}$`, ae = "?" + A, Ce = `<${ae}>`, M = document, Y = () => M.createComment(""), X = (t) => t === null || typeof t != "object" && typeof t != "function", yt = Array.isArray, Oe = (t) => yt(t) || typeof t?.[Symbol.iterator] == "function", ct = `[ 	
\f\r]`, B = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ut = /-->/g, Dt = />/g, k = RegExp(`>|${ct}(?:([^\\s"'>=/]+)(${ct}*=${ct}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Nt = /'/g, It = /"/g, se = /^(?:script|style|textarea|title)$/i, re = (t) => (e, ...o) => ({ _$litType$: t, strings: e, values: o }), d = re(1), Me = re(2), w = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), Ht = /* @__PURE__ */ new WeakMap(), P = M.createTreeWalker(M, 129);
function ce(t, e) {
  if (!yt(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Rt !== void 0 ? Rt.createHTML(e) : e;
}
const ze = (t, e) => {
  const o = t.length - 1, i = [];
  let n, s = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = B;
  for (let c = 0; c < o; c++) {
    const r = t[c];
    let m, _, p = -1, u = 0;
    for (; u < r.length && (a.lastIndex = u, _ = a.exec(r), _ !== null); ) u = a.lastIndex, a === B ? _[1] === "!--" ? a = Ut : _[1] !== void 0 ? a = Dt : _[2] !== void 0 ? (se.test(_[2]) && (n = RegExp("</" + _[2], "g")), a = k) : _[3] !== void 0 && (a = k) : a === k ? _[0] === ">" ? (a = n ?? B, p = -1) : _[1] === void 0 ? p = -2 : (p = a.lastIndex - _[2].length, m = _[1], a = _[3] === void 0 ? k : _[3] === '"' ? It : Nt) : a === It || a === Nt ? a = k : a === Ut || a === Dt ? a = B : (a = k, n = void 0);
    const l = a === k && t[c + 1].startsWith("/>") ? " " : "";
    s += a === B ? r + Ce : p >= 0 ? (i.push(m), r.slice(0, p) + ne + r.slice(p) + A + l) : r + A + (p === -2 ? c : l);
  }
  return [ce(t, s + (t[o] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class q {
  constructor({ strings: e, _$litType$: o }, i) {
    let n;
    this.parts = [];
    let s = 0, a = 0;
    const c = e.length - 1, r = this.parts, [m, _] = ze(e, o);
    if (this.el = q.createElement(m, i), P.currentNode = this.el.content, o === 2 || o === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (n = P.nextNode()) !== null && r.length < c; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const p of n.getAttributeNames()) if (p.endsWith(ne)) {
          const u = _[a++], l = n.getAttribute(p).split(A), v = /([.?@])?(.*)/.exec(u);
          r.push({ type: 1, index: s, name: v[2], strings: l, ctor: v[1] === "." ? Ue : v[1] === "?" ? De : v[1] === "@" ? Ne : it }), n.removeAttribute(p);
        } else p.startsWith(A) && (r.push({ type: 6, index: s }), n.removeAttribute(p));
        if (se.test(n.tagName)) {
          const p = n.textContent.split(A), u = p.length - 1;
          if (u > 0) {
            n.textContent = Q ? Q.emptyScript : "";
            for (let l = 0; l < u; l++) n.append(p[l], Y()), P.nextNode(), r.push({ type: 2, index: ++s });
            n.append(p[u], Y());
          }
        }
      } else if (n.nodeType === 8) if (n.data === ae) r.push({ type: 2, index: s });
      else {
        let p = -1;
        for (; (p = n.data.indexOf(A, p + 1)) !== -1; ) r.push({ type: 7, index: s }), p += A.length - 1;
      }
      s++;
    }
  }
  static createElement(e, o) {
    const i = M.createElement("template");
    return i.innerHTML = e, i;
  }
}
function H(t, e, o = t, i) {
  if (e === w) return e;
  let n = i !== void 0 ? o._$Co?.[i] : o._$Cl;
  const s = X(e) ? void 0 : e._$litDirective$;
  return n?.constructor !== s && (n?._$AO?.(!1), s === void 0 ? n = void 0 : (n = new s(t), n._$AT(t, o, i)), i !== void 0 ? (o._$Co ??= [])[i] = n : o._$Cl = n), n !== void 0 && (e = H(t, n._$AS(t, e.values), n, i)), e;
}
class Re {
  constructor(e, o) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = o;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: o }, parts: i } = this._$AD, n = (e?.creationScope ?? M).importNode(o, !0);
    P.currentNode = n;
    let s = P.nextNode(), a = 0, c = 0, r = i[0];
    for (; r !== void 0; ) {
      if (a === r.index) {
        let m;
        r.type === 2 ? m = new L(s, s.nextSibling, this, e) : r.type === 1 ? m = new r.ctor(s, r.name, r.strings, this, e) : r.type === 6 && (m = new Ie(s, this, e)), this._$AV.push(m), r = i[++c];
      }
      a !== r?.index && (s = P.nextNode(), a++);
    }
    return P.currentNode = M, n;
  }
  p(e) {
    let o = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, o), o += i.strings.length - 2) : i._$AI(e[o])), o++;
  }
}
class L {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, o, i, n) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = e, this._$AB = o, this._$AM = i, this.options = n, this._$Cv = n?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const o = this._$AM;
    return o !== void 0 && e?.nodeType === 11 && (e = o.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, o = this) {
    e = H(this, e, o), X(e) ? e === h || e == null || e === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : e !== this._$AH && e !== w && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Oe(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== h && X(this._$AH) ? this._$AA.nextSibling.data = e : this.T(M.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: o, _$litType$: i } = e, n = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = q.createElement(ce(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === n) this._$AH.p(o);
    else {
      const s = new Re(n, this), a = s.u(this.options);
      s.p(o), this.T(a), this._$AH = s;
    }
  }
  _$AC(e) {
    let o = Ht.get(e.strings);
    return o === void 0 && Ht.set(e.strings, o = new q(e)), o;
  }
  k(e) {
    yt(this._$AH) || (this._$AH = [], this._$AR());
    const o = this._$AH;
    let i, n = 0;
    for (const s of e) n === o.length ? o.push(i = new L(this.O(Y()), this.O(Y()), this, this.options)) : i = o[n], i._$AI(s), n++;
    n < o.length && (this._$AR(i && i._$AB.nextSibling, n), o.length = n);
  }
  _$AR(e = this._$AA.nextSibling, o) {
    for (this._$AP?.(!1, !0, o); e !== this._$AB; ) {
      const i = zt(e).nextSibling;
      zt(e).remove(), e = i;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class it {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, o, i, n, s) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = e, this.name = o, this._$AM = n, this.options = s, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = h;
  }
  _$AI(e, o = this, i, n) {
    const s = this.strings;
    let a = !1;
    if (s === void 0) e = H(this, e, o, 0), a = !X(e) || e !== this._$AH && e !== w, a && (this._$AH = e);
    else {
      const c = e;
      let r, m;
      for (e = s[0], r = 0; r < s.length - 1; r++) m = H(this, c[i + r], o, r), m === w && (m = this._$AH[r]), a ||= !X(m) || m !== this._$AH[r], m === h ? e = h : e !== h && (e += (m ?? "") + s[r + 1]), this._$AH[r] = m;
    }
    a && !n && this.j(e);
  }
  j(e) {
    e === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Ue extends it {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === h ? void 0 : e;
  }
}
class De extends it {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== h);
  }
}
class Ne extends it {
  constructor(e, o, i, n, s) {
    super(e, o, i, n, s), this.type = 5;
  }
  _$AI(e, o = this) {
    if ((e = H(this, e, o, 0) ?? h) === w) return;
    const i = this._$AH, n = e === h && i !== h || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, s = e !== h && (i === h || n);
    n && this.element.removeEventListener(this.name, this, i), s && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Ie {
  constructor(e, o, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = o, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    H(this, e);
  }
}
const He = { I: L }, Le = bt.litHtmlPolyfillSupport;
Le?.(q, L), (bt.litHtmlVersions ??= []).push("3.3.3");
const Ve = (t, e, o) => {
  const i = o?.renderBefore ?? e;
  let n = i._$litPart$;
  if (n === void 0) {
    const s = o?.renderBefore ?? null;
    i._$litPart$ = n = new L(e.insertBefore(Y(), s), s, void 0, o ?? {});
  }
  return n._$AI(t), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const wt = globalThis;
let C = class extends D {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const o = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ve(o, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return w;
  }
};
C._$litElement$ = !0, C.finalized = !0, wt.litElementHydrateSupport?.({ LitElement: C });
const je = wt.litElementPolyfillSupport;
je?.({ LitElement: C });
(wt.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $t = (t) => (e, o) => {
  o !== void 0 ? o.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Be = { attribute: !0, type: String, converter: J, reflect: !1, hasChanged: gt }, Ke = (t = Be, e, o) => {
  const { kind: i, metadata: n } = o;
  let s = globalThis.litPropertyMetadata.get(n);
  if (s === void 0 && globalThis.litPropertyMetadata.set(n, s = /* @__PURE__ */ new Map()), i === "setter" && ((t = Object.create(t)).wrapped = !0), s.set(o.name, t), i === "accessor") {
    const { name: a } = o;
    return { set(c) {
      const r = e.get.call(this);
      e.set.call(this, c), this.requestUpdate(a, r, t, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(a, void 0, t, c), c;
    } };
  }
  if (i === "setter") {
    const { name: a } = o;
    return function(c) {
      const r = this[a];
      e.call(this, c), this.requestUpdate(a, r, t, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function V(t) {
  return (e, o) => typeof o == "object" ? Ke(t, e, o) : ((i, n, s) => {
    const a = n.hasOwnProperty(s);
    return n.constructor.createProperty(s, i), a ? Object.getOwnPropertyDescriptor(n, s) : void 0;
  })(t, e, o);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function j(t) {
  return V({ ...t, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const We = (t, e, o) => (o.configurable = !0, o.enumerable = !0, Reflect.decorate && typeof e != "object" && Object.defineProperty(t, e, o), o);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function le(t, e) {
  return (o, i, n) => {
    const s = (a) => a.renderRoot?.querySelector(t) ?? null;
    return We(o, i, { get() {
      return s(this);
    } });
  };
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const xt = { CHILD: 2, ELEMENT: 6 }, de = (t) => (...e) => ({ _$litDirective$: t, values: e });
let he = class {
  constructor(e) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, o, i) {
    this._$Ct = e, this._$AM = o, this._$Ci = i;
  }
  _$AS(e, o) {
    return this.update(e, o);
  }
  update(e, o) {
    return this.render(...o);
  }
};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { I: Fe } = He, Lt = (t) => t, Ye = (t) => t.strings === void 0, Vt = () => document.createComment(""), K = (t, e, o) => {
  const i = t._$AA.parentNode, n = e === void 0 ? t._$AB : e._$AA;
  if (o === void 0) {
    const s = i.insertBefore(Vt(), n), a = i.insertBefore(Vt(), n);
    o = new Fe(s, a, t, t.options);
  } else {
    const s = o._$AB.nextSibling, a = o._$AM, c = a !== t;
    if (c) {
      let r;
      o._$AQ?.(t), o._$AM = t, o._$AP !== void 0 && (r = t._$AU) !== a._$AU && o._$AP(r);
    }
    if (s !== n || c) {
      let r = o._$AA;
      for (; r !== s; ) {
        const m = Lt(r).nextSibling;
        Lt(i).insertBefore(r, n), r = m;
      }
    }
  }
  return o;
}, E = (t, e, o = t) => (t._$AI(e, o), t), Xe = {}, qe = (t, e = Xe) => t._$AH = e, Ze = (t) => t._$AH, lt = (t) => {
  t._$AR(), t._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const jt = (t, e, o) => {
  const i = /* @__PURE__ */ new Map();
  for (let n = e; n <= o; n++) i.set(t[n], n);
  return i;
}, Ge = de(class extends he {
  constructor(t) {
    if (super(t), t.type !== xt.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(t, e, o) {
    let i;
    o === void 0 ? o = e : e !== void 0 && (i = e);
    const n = [], s = [];
    let a = 0;
    for (const c of t) n[a] = i ? i(c, a) : a, s[a] = o(c, a), a++;
    return { values: s, keys: n };
  }
  render(t, e, o) {
    return this.dt(t, e, o).values;
  }
  update(t, [e, o, i]) {
    const n = Ze(t), { values: s, keys: a } = this.dt(e, o, i);
    if (!Array.isArray(n)) return this.ut = a, s;
    const c = this.ut ??= [], r = [];
    let m, _, p = 0, u = n.length - 1, l = 0, v = s.length - 1;
    for (; p <= u && l <= v; ) if (n[p] === null) p++;
    else if (n[u] === null) u--;
    else if (c[p] === a[l]) r[l] = E(n[p], s[l]), p++, l++;
    else if (c[u] === a[v]) r[v] = E(n[u], s[v]), u--, v--;
    else if (c[p] === a[v]) r[v] = E(n[p], s[v]), K(t, r[v + 1], n[p]), p++, v--;
    else if (c[u] === a[l]) r[l] = E(n[u], s[l]), K(t, n[p], n[u]), u--, l++;
    else if (m === void 0 && (m = jt(a, l, v), _ = jt(c, p, u)), m.has(c[p])) if (m.has(c[u])) {
      const f = _.get(a[l]), rt = f !== void 0 ? n[f] : null;
      if (rt === null) {
        const St = K(t, n[p]);
        E(St, s[l]), r[l] = St;
      } else r[l] = E(rt, s[l]), K(t, n[p], rt), n[f] = null;
      l++;
    } else lt(n[u]), u--;
    else lt(n[p]), p++;
    for (; l <= v; ) {
      const f = K(t, r[v + 1]);
      E(f, s[l]), r[l++] = f;
    }
    for (; p <= u; ) {
      const f = n[p++];
      f !== null && lt(f);
    }
    return this.ut = a, qe(t, r), w;
  }
}), nt = (t, e, o) => {
  t.dispatchEvent(
    new CustomEvent(e, { detail: o, bubbles: !0, composed: !0 })
  );
}, Je = (t, e) => nt(t, "hass-more-info", { entityId: e }), Qe = (t, e, o = "var(--state-inactive-color, #9e9e9e)") => e === "unavailable" || e === "unknown" ? "var(--state-unavailable-color, var(--disabled-color))" : `var(--state-${t}-${e}-color, var(--state-icon-color, ${o}))`, to = (t) => typeof t == "object" && t !== null && !Array.isArray(t), N = (t) => to(t) && typeof t.action == "string", tt = (t) => t !== void 0 && t.action !== "none", At = (t) => {
  const e = (t ?? "").split(".");
  if (e.length !== 2) return null;
  const [o, i] = e;
  return !o || !i ? null : [o, i];
}, ht = (t, e, o) => ({
  action: "perform-action",
  perform_action: t,
  ...e ? { data: e } : {},
  ...o ? { target: o } : {}
}), kt = (t, e, o, i) => {
  switch (o.action) {
    case "none":
      return Promise.resolve();
    case "more-info": {
      const n = o.entity ?? i;
      return n && t && Je(t, n), Promise.resolve();
    }
    case "toggle": {
      const n = i;
      return n ? e.callService("homeassistant", "toggle", { entity_id: n }) : Promise.resolve();
    }
    case "navigate":
      return history.pushState(null, "", o.navigation_path), window.dispatchEvent(
        new CustomEvent("location-changed", { detail: { replace: !1 } })
      ), Promise.resolve();
    case "url":
      return window.open(o.url_path, "_blank", "noreferrer"), Promise.resolve();
    case "perform-action":
    case "call-service": {
      const n = o.action === "perform-action" ? o.perform_action : o.service, s = At(n);
      if (!s)
        return Promise.reject(
          new Error(`polr-android-tv-remote-card: invalid action "${n}"`)
        );
      const [a, c] = s, r = o.action === "perform-action" ? o.data : o.data ?? o.service_data;
      return e.callService(a, c, r ?? {}, o.target);
    }
  }
}, y = {
  PAUSE: 1,
  VOLUME_MUTE: 8,
  PREVIOUS_TRACK: 16,
  NEXT_TRACK: 32,
  TURN_ON: 128,
  TURN_OFF: 256,
  VOLUME_STEP: 1024
}, eo = {
  up: "DPAD_UP",
  down: "DPAD_DOWN",
  left: "DPAD_LEFT",
  right: "DPAD_RIGHT",
  center: "DPAD_CENTER",
  home: "HOME",
  back: "BACK",
  menu: "MENU",
  power: "POWER",
  // v1 sent MUTE, not VOLUME_MUTE. Keep it.
  volume_mute: "MUTE",
  volume_up: "VOLUME_UP",
  volume_down: "VOLUME_DOWN",
  play_pause: "MEDIA_PLAY_PAUSE",
  next: "MEDIA_NEXT",
  previous: "MEDIA_PREVIOUS",
  // No media_player equivalent: its only seek service takes an absolute
  // position, which a TV cannot report. These are always key codes.
  rewind: "MEDIA_REWIND",
  fast_forward: "MEDIA_FAST_FORWARD"
}, oo = "text:", pe = (t, e) => {
  const o = t.entities?.[e.entity]?.device_id;
  if (!o) return null;
  for (const i of Object.values(t.entities ?? {}))
    if (i.device_id === o && i.entity_id.startsWith("media_player."))
      return i.entity_id;
  return null;
}, dt = (t) => t === void 0 || t.state === "unavailable" || t.state === "unknown", io = (t, e) => {
  const o = t.states?.[e.entity], i = pe(t, e), n = i ? t.states?.[i] : void 0, s = n?.attributes ?? {}, a = o?.attributes ?? {}, c = e.volume_entity ?? i, m = (e.volume_entity && e.volume_entity !== i ? t.states?.[e.volume_entity] : n)?.attributes ?? {}, _ = n && !dt(n) ? n.state !== "off" : o?.state === "on";
  return {
    remoteId: e.entity,
    playerId: i,
    remote: o,
    player: n,
    found: o !== void 0,
    available: !dt(o) && (n === void 0 || !dt(n)),
    on: _,
    name: e.name ?? a.friendly_name ?? e.entity,
    // app_name is all the integration provides. It never sets media_title or
    // entity_picture, so there is no now-playing text or artwork to read.
    appName: s.app_name ?? a.current_activity,
    appId: s.app_id,
    playing: n?.state === "playing",
    features: s.supported_features ?? 0,
    volumeId: c,
    volumeFeatures: m.supported_features ?? 0,
    volume: typeof m.volume_level == "number" ? m.volume_level : void 0,
    muted: typeof m.is_volume_muted == "boolean" ? m.is_volume_muted : void 0
  };
}, no = /* @__PURE__ */ new Set([
  "off",
  "unavailable",
  "unknown",
  "idle",
  "standby",
  "none"
]), ao = (t, e) => {
  if (!e) return !1;
  const o = t.states?.[e]?.state;
  return o === void 0 ? !1 : !no.has(o.toLowerCase());
}, I = (t, e) => (t.features & e) !== 0, Bt = (t, e) => (t.volumeFeatures & e) !== 0, Kt = (t) => t.volume !== void 0, so = ["volume_up", "volume_down", "volume_mute"], ro = (t, e) => t.volume_entity !== void 0 && t.volume_entity !== e.playerId || so.some((o) => tt(t.overrides[o]?.tap_action)), co = (t, e) => {
  const o = At(e.service);
  return o ? t.callService(o[0], o[1], e.data ?? {}, e.target) : Promise.reject(
    new Error(`polr-android-tv-remote-card: invalid service "${e.service}"`)
  );
}, Et = (t, e, o) => t.callService("remote", "send_command", {
  entity_id: e.remoteId,
  command: o
}), lo = (t, e, o) => Et(t, e, `${oo}${o}`), ho = (t, e, o, i, n) => {
  const s = e.overrides[i]?.tap_action;
  if (tt(s))
    return kt(n, t, s, o.remoteId);
  if (s && s.action === "none") return Promise.resolve();
  const a = o.playerId;
  switch (i) {
    case "power":
      return a && I(o, o.on ? y.TURN_OFF : y.TURN_ON) ? t.callService(
        "media_player",
        o.on ? "turn_off" : "turn_on",
        { entity_id: a }
      ) : t.callService("remote", o.on ? "turn_off" : "turn_on", {
        entity_id: o.remoteId
      });
    case "play_pause":
      if (a && I(o, y.PAUSE))
        return t.callService("media_player", "media_play_pause", {
          entity_id: a
        });
      break;
    case "next":
      if (a && I(o, y.NEXT_TRACK))
        return t.callService("media_player", "media_next_track", {
          entity_id: a
        });
      break;
    case "previous":
      if (a && I(o, y.PREVIOUS_TRACK))
        return t.callService("media_player", "media_previous_track", {
          entity_id: a
        });
      break;
    case "volume_up":
    case "volume_down":
      if (o.volumeId && Bt(o, y.VOLUME_STEP))
        return t.callService(
          "media_player",
          i === "volume_up" ? "volume_up" : "volume_down",
          { entity_id: o.volumeId }
        );
      break;
    case "volume_mute":
      if (o.volumeId && o.muted !== void 0 && Bt(o, y.VOLUME_MUTE))
        return t.callService("media_player", "volume_mute", {
          entity_id: o.volumeId,
          is_volume_muted: !o.muted
        });
      break;
  }
  const c = eo[i];
  return c ? Et(t, o, c) : Promise.resolve();
}, po = (t, e, o, i) => {
  switch (o.action) {
    case "activity":
      return t.callService("remote", "turn_on", {
        entity_id: e.remoteId,
        activity: o.activity
      });
    case "app":
      return e.playerId ? t.callService("media_player", "play_media", {
        entity_id: e.playerId,
        media_content_type: "app",
        media_content_id: o.app_id
      }) : Promise.reject(
        new Error(
          "polr-android-tv-remote-card: launching by app id needs the device's media_player, which was not found"
        )
      );
    case "key":
      return Et(t, e, o.key);
    // v1's shape.
    case "service":
      return co(t, o);
    // Everything else is a Home Assistant action, run exactly as an override
    // would run it.
    default:
      return kt(i, t, o, e.remoteId);
  }
}, uo = (t) => {
  switch (t.action) {
    case "activity":
      return `Launch ${t.activity}`;
    case "app":
      return `Open app ${t.app_id}`;
    case "key":
      return `Send ${t.key}`;
    case "service":
      return `Call ${t.service}`;
    case "perform-action":
      return `Call ${t.perform_action}`;
    case "call-service":
      return `Call ${t.service}`;
    case "navigate":
      return `Go to ${t.navigation_path}`;
    case "url":
      return `Open ${t.url_path}`;
    case "toggle":
      return "Toggle the TV";
    case "more-info":
      return "Show more info";
    case "none":
      return "Do nothing";
  }
}, mo = ["buttons", "dpad", "touchpad"], vo = {
  button: "press",
  input_button: "press",
  scene: "turn_on",
  script: "turn_on",
  automation: "trigger"
}, _o = (t) => {
  const e = At(t);
  if (!e) return null;
  const o = vo[e[0]];
  return o ? { service: `${e[0]}.${o}`, target: { entity_id: t } } : null;
}, g = {
  show_header: !0,
  show_power: !0,
  show_nav: !0,
  pad: "buttons",
  show_transport: !0,
  transport_buttons: ["previous", "rewind", "play_pause", "fast_forward", "next"],
  show_volume: !0,
  // Off by default: sending text needs a focused input on the TV *and*
  // `enable_ime` on the config entry, neither of which the card can detect.
  show_text_input: !1,
  show_apps: !0,
  show_section_labels: !1,
  app_columns: 5,
  hold_repeat: !0,
  haptics: !0
}, T = {
  disneyplus: { label: "Disney+", activity: "https://www.disneyplus.com" },
  hbomax: { label: "HBO Max", activity: "https://play.hbomax.com" },
  hulu: { label: "Hulu", activity: "HULU" },
  netflix: { label: "Netflix", activity: "https://www.netflix.com/title" },
  prime: { label: "Prime Video", activity: "https://app.primevideo.com" },
  youtube: { label: "YouTube", activity: "https://www.youtube.com" }
}, pt = Object.keys(T), ue = (t) => {
  if (!t) return;
  const e = t.toLowerCase().replace(/[^a-z]/g, "");
  if (e)
    return pt.find((o) => e.includes(o) || o.includes(e));
}, me = {
  up: "up",
  down: "down",
  left: "left",
  right: "right",
  center: "center",
  power: "power",
  home: "home",
  back: "back",
  favorite: "favorite",
  volumeup: "volume_up",
  volumedown: "volume_down",
  volumemute: "volume_mute"
}, ve = {
  showRemote: "show_nav",
  showApps: "show_apps",
  showVolume: "show_volume",
  showMedia: "show_transport",
  showURLSearch: "show_text_input"
}, fo = {
  default: "buttons",
  touch: "touchpad",
  dpad: "dpad"
}, b = (t) => typeof t == "object" && t !== null && !Array.isArray(t), _e = (t) => b(t) && typeof t.service == "string", Wt = (t, e) => {
  if (typeof t == "string") {
    const o = _o(t);
    if (o)
      return { tap_action: ht(o.service, void 0, o.target) };
    O(
      `override "${e}" points at ${t}, which cannot simply be pressed. Use an action config instead.`
    );
    return;
  }
  if (!b(t)) {
    t !== void 0 && O(`override "${e}" is not an entity id or an action config`);
    return;
  }
  if (N(t.tap_action) || N(t.hold_action) || N(t.double_tap_action)) {
    const o = {};
    for (const i of ["tap_action", "hold_action", "double_tap_action"]) {
      const n = t[i];
      N(n) && (o[i] = n);
    }
    return o;
  }
  if (_e(t))
    return {
      tap_action: ht(
        t.service,
        b(t.data) ? t.data : void 0,
        b(t.target) ? t.target : void 0
      )
    };
  O(`override "${e}" is not an entity id or an action config`);
};
let Ft = /* @__PURE__ */ new Set();
const O = (t) => {
  Ft.has(t) || (Ft.add(t), console.warn(`polr-android-tv-remote-card: ${t}`));
}, Yt = (t) => {
  if (typeof t == "string") {
    const s = T[t];
    return s ? {
      name: s.label,
      icon: `brand:${t}`,
      action: { action: "activity", activity: s.activity }
    } : (O(
      `unknown app "${t}" — treating it as an activity. Use an object with an icon and action instead.`
    ), {
      name: t,
      icon: "mdi:application",
      action: { action: "activity", activity: t }
    });
  }
  if (!b(t)) return null;
  if (b(t.action))
    return t;
  const e = typeof t.icon == "string" ? t.icon : void 0, o = typeof t.name == "string" ? t.name : void 0, i = typeof t.color == "string" ? t.color : void 0, n = typeof t.entity == "string" ? t.entity : void 0;
  return _e(t) ? {
    ...o ? { name: o } : {},
    ...e ? { icon: e } : {},
    ...i ? { color: i } : {},
    ...n ? { entity: n } : {},
    action: {
      action: "service",
      service: t.service,
      ...b(t.data) ? { data: t.data } : {},
      ...b(t.target) ? { target: t.target } : {}
    }
  } : typeof t.url == "string" ? {
    ...o ? { name: o } : {},
    ...e ? { icon: e } : {},
    ...i ? { color: i } : {},
    ...n ? { entity: n } : {},
    action: { action: "activity", activity: t.url }
  } : (O(`app entry has no action, url or service and was skipped: ${JSON.stringify(t)}`), null);
}, fe = (t) => {
  if (!b(t))
    throw new Error("polr-android-tv-remote-card: invalid configuration");
  const e = typeof t.entity == "string" ? t.entity : typeof t.entity_id == "string" ? t.entity_id : void 0;
  if (!e)
    throw new Error("polr-android-tv-remote-card: 'entity' is required");
  const o = typeof t.remote == "string" ? fo[t.remote] : void 0;
  typeof t.remote == "string" && !o && O(`unknown remote style "${t.remote}" — falling back to ${g.pad}`);
  const i = mo.includes(t.pad) ? t.pad : o ?? g.pad, n = typeof t.volume == "boolean" ? t.volume : void 0, s = {};
  if (b(t.overrides))
    for (const [l, v] of Object.entries(t.overrides)) {
      const f = Wt(v, l);
      f && (s[l] = f);
    }
  for (const [l, v] of Object.entries(me)) {
    if (s[v]) continue;
    const f = Wt(t[l], l);
    f && (s[v] = f);
  }
  const a = {};
  for (const [l, v] of Object.entries(ve))
    typeof t[l] == "boolean" && (a[v] = t[l]);
  const c = Array.isArray(t.transport_buttons) ? t.transport_buttons : Array.isArray(t.media_controls) ? t.media_controls : void 0, r = c ? c.filter(
    (l) => typeof l == "string" && g.transport_buttons.includes(l)
  ) : g.transport_buttons, m = (Array.isArray(t.sections) ? t.sections : []).map((l) => {
    if (!b(l))
      return O(`section is not an object and was skipped: ${JSON.stringify(l)}`), null;
    const v = (Array.isArray(l.buttons) ? l.buttons : []).map(Yt).filter((f) => f !== null);
    return {
      ...typeof l.name == "string" ? { name: l.name } : {},
      ...typeof l.columns == "number" && l.columns > 0 ? { columns: l.columns } : {},
      buttons: v
    };
  }).filter((l) => l !== null), p = (Array.isArray(t.apps) ? t.apps : []).map(Yt).filter((l) => l !== null), u = (l, v) => l === void 0 ? v : l;
  return {
    ...t,
    type: t.type,
    entity: e,
    ...typeof t.volume_entity == "string" ? { volume_entity: t.volume_entity } : {},
    ...typeof t.name == "string" ? { name: t.name } : {},
    show_header: u(t.show_header, g.show_header),
    show_power: u(t.show_power, g.show_power),
    show_nav: u(t.show_nav, a.show_nav ?? g.show_nav),
    pad: i,
    show_transport: u(t.show_transport, a.show_transport ?? g.show_transport),
    transport_buttons: r,
    show_volume: u(t.show_volume, a.show_volume ?? n ?? g.show_volume),
    show_text_input: u(
      t.show_text_input,
      a.show_text_input ?? g.show_text_input
    ),
    show_apps: u(t.show_apps, a.show_apps ?? g.show_apps),
    show_section_labels: u(t.show_section_labels, g.show_section_labels),
    // v1 always drew a favourite button on the default pad, and threw when it
    // had no override to call. Draw it only when it does something.
    show_favorite: s.favorite !== void 0,
    apps: p,
    sections: m,
    // "auto" was the v2-beta spelling, before the tiles became fixed-width.
    app_columns: typeof t.app_columns == "number" && t.app_columns > 0 ? t.app_columns : g.app_columns,
    hold_repeat: u(t.hold_repeat, g.hold_repeat),
    haptics: u(t.haptics, g.haptics),
    overrides: s
  };
}, go = (t) => {
  const e = /* @__PURE__ */ new Set([
    "entity_id",
    "remote",
    "volume",
    "show_favorite",
    // Removed in v2: back/home/menu is always there.
    "show_navigation_row",
    // Removed: the player is always the one on the remote's own device.
    "media_player_entity",
    "showBasic",
    "media_controls",
    ...Object.keys(ve),
    ...Object.keys(me)
  ]), o = {};
  for (const [i, n] of Object.entries(t))
    e.has(i) || (o[i] = n);
  return o;
}, U = (t) => Me`
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="${t}" />
  </svg>
`, ut = {
  disneyplus: U(
    "M2.056 6.834C1.572 6.834 1 6.77 1 6.483c0-2.023 3.562-2.11 5.08-2.11 1.978 0 4.506.614 6.66 1.384 3.277 1.188 9.917 5.145 9.917 9.674 0 4.001-4.31 5.914-8.311 5.914a22.376 22.376 0 0 1-3.21-.33c-.066.243-.11.418-.264.924-.253.052-.511.081-.77.087l-.505-.043c-.33-.396-.44-1.033-.572-1.715-2-1.165-3.298-2.155-3.891-2.836-.506-.528-1.078-1.232-1.078-1.913 0-.351.22-.66.726-1.01 1.034-.77 2.352-1.188 4.507-1.563l.044-.9c.022-.22.242-2.573.748-3.013.813.66.901 1.341.967 2.353.022.44.044.901.11 1.385h.308c1.539 0 6.244.395 6.244 2.616 0 .528-.77 1.517-1.518 1.517a1.9 1.9 0 0 1-.966-.285c.329-.375.813-.704.945-.99-.44-.528-2.814-1.143-4.551-1.143a4.043 4.043 0 0 0-.572.022l.022 4.815c.703.44 1.561.483 2.11.483 2.42 0 7.431-.417 7.431-4.331 0-3.87-4.946-6.86-8.64-8.266a21.394 21.394 0 0 0-7.937-1.496 7.22 7.22 0 0 0-1.803.198c-.373.088-.505.176-.505.264 0 .153.747.242.836.286a.221.221 0 0 1 .11.175.26.26 0 0 1-.088.176c-.089 0-.286.022-.528.022zM9.2 14.551c-2.176.177-4.595.397-4.595 1.166 0 .594 1.012 1.32 1.627 1.781a7.052 7.052 0 0 0 2.77 1.319zm11.155-9.85c-.02.428-.042.942-.042 1.723 0 .3 0 .642.01 1.027-.042.193-.32.214-.46.278a1.148 1.148 0 0 1-.256-.192V4.83c0-.29.01-.588.01-1.038 0-.225 0-.482-.01-.792 0-.192.032-.374.15-.802a.342.342 0 0 1 .3-.224c.245.064.491.17.577.374-.257.76-.235 1.594-.279 2.353zm-.384-.085c.428.021.941.042 1.722.042.3 0 .643 0 1.027-.01.193.041.215.32.279.459-.052.094-.116.18-.193.257H20.1c-.289 0-.589-.01-1.037-.01-.225 0-.482 0-.792.01-.193.002-.375-.03-.803-.149a.346.346 0 0 1-.225-.299c.064-.246.172-.492.374-.578.76.257 1.595.235 2.355.278z"
  ),
  hbomax: U(
    "M8.844 4.249h3.205a2.013 2.013 0 0 1 1.848 1.876c1.607-3.368 6.667-2.217 6.658 1.515.045 3.744-5.026 4.939-6.658 1.568a2.077 2.077 0 0 1-2.07 1.947H8.845Zm-5.395 0h1.92v2.58h1.213V4.253H8.46v6.902H6.586V8.48H5.373v2.676H3.449ZM9.872 19.83h-.576a.603.603 0 0 1-.6-.57c0-.013-.007-.023-.007-.035v-3.667a1.192 1.192 0 0 0-1.279-1.21 1.192 1.192 0 0 0-1.279 1.211v4.167a.103.103 0 0 1-.102.103h-.575a.61.61 0 0 1-.61-.611v-3.666a1.319 1.319 0 0 0-.066-.296 1.176 1.176 0 0 0-1.213-.913 1.19 1.19 0 0 0-1.183.817c-.05.131-.079.267-.087.406v4.17a.104.104 0 0 1-.104.102h-.579a.61.61 0 0 1-.61-.61V15.56a2.322 2.322 0 0 1 1.68-2.32c.285-.088.584-.133.883-.133a2.584 2.584 0 0 1 1.92.752 2.588 2.588 0 0 1 1.921-.752 2.608 2.608 0 0 1 1.872.715c.451.465.7 1.09.692 1.738v4.171a.103.103 0 0 1-.098.103zm.428-3.35a3.76 3.76 0 0 1 .568-2.102c.133-.2.29-.38.47-.539a2.958 2.958 0 0 1 2.013-.744 3.014 3.014 0 0 1 1.845.59.61.61 0 0 1 .597-.48h.574a.107.107 0 0 1 .105.103v6.427a.104.104 0 0 1-.104.103h-.573a.61.61 0 0 1-.612-.553c-2.16 1.55-5.14-.164-4.887-2.811Zm12.623 3.35h-.977a.813.813 0 0 1-.675-.357l-1.079-1.6a.356.356 0 0 0-.588 0l-1.08 1.6a.825.825 0 0 1-.245.22.803.803 0 0 1-.43.137h-.978a.075.075 0 0 1-.063-.121l1.18-1.752.744-1.1a.61.61 0 0 0 0-.682l-.05-.075-1.872-2.773a.077.077 0 0 1 .062-.121h.978a.813.813 0 0 1 .674.36l.826 1.221.254.376a.355.355 0 0 0 .59 0l1.08-1.597a.82.82 0 0 1 .673-.36h.978a.077.077 0 0 1 .06.122l-1.925 2.855a.61.61 0 0 0 0 .682l1.929 2.853a.076.076 0 0 1-.066.116zM17.068 9.403c1.567.002 2.356-1.89 1.25-3-1.103-1.11-3-.33-3.003 1.237A1.756 1.756 0 0 0 17.068 9.4zm0-3.14c1.23.003 1.843 1.493.97 2.36-.872.866-2.358.246-2.354-.983a1.38 1.38 0 0 1 1.38-1.378zm-3.719 8.1a1.77 1.77 0 0 0-1.783 1.63 3.15 3.15 0 0 0-.037.489 1.867 1.867 0 0 0 1.82 2.123 1.696 1.696 0 0 0 1.455-.764c.253-.407.381-.88.367-1.36a1.867 1.867 0 0 0-1.822-2.118zm.227-6.191a2.976 2.976 0 0 1 0-.954 1.475 1.475 0 0 1-.723.422c.29.096.544.283.722.533zm-1.486.785a.548.548 0 0 0-.5-.577h-.954v1.17h.954a.553.553 0 0 0 .5-.593zm0-2.595a.55.55 0 0 0-.5-.577h-.954V6.94h.954a.548.548 0 0 0 .5-.578z"
  ),
  hulu: U(
    "m 14.248,8.7019997 h 1.59 V 15.298 h -1.59 z M 5.143,10.764 H 4.124 a 1.4,1.4 0 0 0 -0.36,0.037 C 3.673,10.826 3.615,10.843 3.59,10.851 V 8.7 H 2 v 6.6 h 1.59 v -2.66 a 0.428,0.428 0 0 1 0.124,-0.3 0.4,0.4 0 0 1 0.3,-0.13 h 0.92 a 0.446,0.446 0 0 1 0.435,0.435 V 15.3 h 1.575 v -2.871 a 1.53,1.53 0 0 0 -0.5,-1.261 2,2 0 0 0 -1.301,-0.404 z m 15.267,0 v 2.658 a 0.423,0.423 0 0 1 -0.422,0.423 h -0.932 a 0.423,0.423 0 0 1 -0.422,-0.423 v -2.658 h -1.59 v 2.783 a 1.679,1.679 0 0 0 0.49,1.3 1.874,1.874 0 0 0 1.323,0.453 H 20.41 A 1.47,1.47 0 0 0 21.571,14.816 1.842,1.842 0 0 0 22,13.547 v -2.783 z m -8.957,2.658 a 0.4,0.4 0 0 1 -0.13,0.3 0.43,0.43 0 0 1 -0.3,0.124 H 10.1 A 0.423,0.423 0 0 1 9.678,13.423 V 10.764 H 8.087 v 2.783 a 1.676,1.676 0 0 0 0.491,1.3 1.855,1.855 0 0 0 1.31,0.453 h 1.565 a 1.473,1.473 0 0 0 1.162,-0.484 1.842,1.842 0 0 0 0.429,-1.267 v -2.785 h -1.591 z"
  ),
  netflix: U(
    "M5.94 1v10.994c0 6.045.006 10.996.014 11.004.01.01.382-.029.834-.078a73.701 73.701 0 0 1 1.383-.139 80.63 80.628 0 0 1 2.06-.133c.05 0 .052-.246.058-4.655l.01-4.645.34.964c1.406 3.979 1.77 5.004 2.166 6.117v.002l.206.581.575 1.624c.003.003.292.02.642.038a48.332 48.33 0 0 1 3.37.29c.12.014.227.024.307.03.038.002.044 0 .067 0 .023 0 .062.003.067 0h.006c.003 0 .003-.967.005-1.382l.002-.435c.007-1.783.01-4.836.007-9.181l-.01-10.979h-4.311L13.73 5.88l-.01 4.859v.003l-.398-1.13V9.61v.002l-2.04-5.765v-.013l-.177-.501c-.422-1.195-.781-2.205-.795-2.251L10.28 1H8.107Z"
  ),
  prime: U(
    "M20.182 5.404a4.05 4.05 0 0 0 .625.05 1.116 1.116 0 0 0 .342-.03.474.474 0 0 0 .404-.306.605.605 0 0 0 .015-.276.4.4 0 0 0-.243-.334.88.88 0 0 0-.281-.064.791.791 0 0 0-.833.499 1.438 1.438 0 0 0-.102.367c-.006.088-.006.088.073.094zm-1.074-.4a1.808 1.808 0 0 1 1.633-1.359 2.38 2.38 0 0 1 1.057.102c.655.224 1.009.932.794 1.59a.986.986 0 0 1-.489.588 1.986 1.986 0 0 1-.66.211 3.534 3.534 0 0 1-1.207-.016 1.221 1.221 0 0 0-.146-.023.88.88 0 0 0 .716.954 2.58 2.58 0 0 0 .995 0c.154-.033.302-.065.456-.102.154-.036.218.012.218.17v.392a.242.242 0 0 1-.18.26 3.082 3.082 0 0 1-.626.17 3.247 3.247 0 0 1-1.214-.01 1.663 1.663 0 0 1-1.36-1.272 2.935 2.935 0 0 1 .016-1.656zm.317 6.367a2.588 2.588 0 0 1 1.012.039 1.936 1.936 0 0 1 1.41 1.635v.011h-.014v.1a.078.078 0 0 0 .024.08v-.021l.007.01v.61l-.012.021v-.01c-.03.02-.02.047-.02.08V14c-.048.9-.747 1.63-1.644 1.717a2.627 2.627 0 0 1-.998-.052 1.694 1.694 0 0 1-1.246-1.114 2.825 2.825 0 0 1 0-2.005c.219-.65.8-1.11 1.482-1.175zM12 3.946c0-.043.006-.086.016-.127a.156.156 0 0 1 .147-.102h.67a.19.19 0 0 1 .184.147c.028.075.044.147.07.223.053 0 .086-.036.122-.057a2.743 2.743 0 0 1 .946-.398 1.962 1.962 0 0 1 .795 0c.25.054.47.202.615.413a.25.25 0 0 0 .03.038v.014c.132-.079.271-.164.415-.237a2.382 2.382 0 0 1 1.203-.266 1.061 1.061 0 0 1 1.095 1.027v2.964c0 .238-.03.27-.27.27h-.647a.906.906 0 0 1-.126 0 .147.147 0 0 1-.128-.122.994.994 0 0 1-.01-.175V5.101a.944.944 0 0 0-.033-.293.4.4 0 0 0-.36-.294 1.861 1.861 0 0 0-.912.176.087.087 0 0 0-.063.096v2.788a.774.774 0 0 1-.01.155c0 .07-.058.127-.128.127h-.81c-.197 0-.24-.047-.24-.243V5.1a1.24 1.24 0 0 0-.026-.276.4.4 0 0 0-.371-.318 1.874 1.874 0 0 0-.928.18.085.085 0 0 0-.059.103v2.833c0 .195-.044.236-.239.236h-.704c-.188 0-.235-.053-.235-.232zm2.71 9.92a.178.178 0 0 0-.074-.011 2 2 0 0 0 .057.324c.08.337.358.59.7.636a2.664 2.664 0 0 0 1.088-.037c.117-.026.229-.053.345-.085.154-.037.223.023.223.17v.385a.235.235 0 0 1-.19.271 3.36 3.36 0 0 1-1.141.217 2.901 2.901 0 0 1-.796-.079 1.63 1.63 0 0 1-1.215-1.136 2.946 2.946 0 0 1-.02-1.776 1.848 1.848 0 0 1 1.838-1.363c.268-.012.535.023.792.101.44.123.775.48.868.928a1.468 1.468 0 0 1 0 .587.983.983 0 0 1-.535.704 2.166 2.166 0 0 1-.891.23 4.15 4.15 0 0 1-1.055-.067zm-3.133-2.202c.027-.037.012-.075.012-.112V9.847c0-.202.037-.238.238-.238h.734c.161.006.207.044.207.208v5.586c0 .147-.049.201-.196.201h-.69a.19.19 0 0 1-.186-.146.82.82 0 0 0-.057-.185c-.048.008-.069.045-.107.067a1.714 1.714 0 0 1-1.615.276 1.526 1.526 0 0 1-.917-.812 2.495 2.495 0 0 1-.266-1.13 2.999 2.999 0 0 1 .187-1.225 1.66 1.66 0 0 1 .826-.945c.552-.263 1.2-.22 1.713.111a.294.294 0 0 0 .117.059zm-.797-3.817h-.733a.32.32 0 0 1-.075 0 .147.147 0 0 1-.147-.137V3.893c0-.127.054-.176.18-.18a19.455 19.455 0 0 1 .828 0c.122 0 .159.037.17.158v3.67a.982.982 0 0 1-.01.176.134.134 0 0 1-.128.12.456.456 0 0 1-.089 0zm-1.045-5.45a.616.616 0 0 1 .642-.586h.064a.649.649 0 0 1 .248.036.6.6 0 0 1 .411.67.587.587 0 0 1-.506.534.963.963 0 0 1-.355 0 .587.587 0 0 1-.504-.66Zm-3.092 5.2V3.983c0-.244.026-.27.27-.27h.51a.211.211 0 0 1 .238.179c.037.132.07.264.1.408a.161.161 0 0 0 .091-.065 3.514 3.514 0 0 1 .303-.27 1.41 1.41 0 0 1 .964-.293c.138 0 .186.048.197.18.01.18 0 .367 0 .546a.985.985 0 0 1-.012.22.147.147 0 0 1-.147.146 1.812 1.812 0 0 1-.22 0 2.523 2.523 0 0 0-1.027.147c-.074.026-.074.079-.074.138v2.678a.13.13 0 0 1-.128.122.992.992 0 0 1-.132 0v.01h-.69a.784.784 0 0 1-.117 0 .147.147 0 0 1-.126-.132zm.904 3.228a.604.604 0 0 1-.192 0 .998.998 0 0 1-.176-.02.6.6 0 0 1-.466-.7.587.587 0 0 1 .567-.536.473.473 0 0 1 .111 0 .638.638 0 0 1 .313.054c.208.078.35.272.361.494a.624.624 0 0 1-.518.716zm.44.855v3.764a.147.147 0 0 1-.133.159h-.88a.147.147 0 0 1-.162-.128v-.026a.567.567 0 0 1 0-.1v-3.67c0-.164.045-.21.21-.21h.751c.164.007.211.054.211.218zm-1.711.047-.317.844-1.067 2.774c-.01.032-.027.063-.037.095a.261.261 0 0 1-.265.175h-.702a.294.294 0 0 1-.318-.218c-.133-.349-.27-.704-.403-1.055-.318-.832-.641-1.666-.96-2.504a.928.928 0 0 1-.069-.207c-.016-.105.021-.158.128-.158h.901c.128 0 .185.085.218.196.058.201.117.408.18.61.217.733.43 1.479.646 2.217h.01l.096-.308.733-2.46.031-.095a.214.214 0 0 1 .213-.147h.812c.2-.003.243.054.176.245zM1.786 3.82a.377.377 0 0 1 .318-.107h.488a.21.21 0 0 1 .234.18c.01.053.02.106.037.16a.022.022 0 0 0 .02.015.429.429 0 0 0 .11-.08 1.87 1.87 0 0 1 1.586-.354c.48.115.874.454 1.061.91a2.451 2.451 0 0 1 .205.798h-.008c.051.444.011.893-.118 1.321a1.942 1.942 0 0 1-.55.88c-.34.306-.795.448-1.248.388A1.776 1.776 0 0 1 3 7.564c-.039.033-.022.074-.022.113v1.506c0 .329 0 .329-.334.329h-.572a.294.294 0 0 1-.294-.126Zm19.37 15.225a.587.587 0 0 1-.176.2 11.64 11.64 0 0 1-1.962 1.247 15.499 15.499 0 0 1-4.152 1.406 18.226 18.226 0 0 1-2.51.27v.022h-.649v-.018c-.293-.014-.578-.026-.868-.047a15.349 15.349 0 0 1-2.296-.352 15.558 15.558 0 0 1-6.885-3.59c-.185-.164-.36-.333-.54-.503a.405.405 0 0 1-.101-.146.195.195 0 0 1 .098-.256.2.2 0 0 1 .147 0 1.21 1.21 0 0 1 .138.069 20.566 20.566 0 0 0 6.164 2.546 22.087 22.087 0 0 0 2.212.398 20.441 20.441 0 0 0 3.213.146 16.97 16.97 0 0 0 1.724-.146 20.908 20.908 0 0 0 3.935-.896 18.627 18.627 0 0 0 1.973-.776.44.44 0 0 1 .318-.043.33.33 0 0 1 .24.398.578.578 0 0 1-.022.066zm1.028 1.488a3.547 3.547 0 0 1-.615.757.432.432 0 0 1-.17.107.123.123 0 0 1-.169-.124.608.608 0 0 1 .038-.162c.185-.496.366-.99.51-1.504a5.346 5.346 0 0 0 .18-.859 1.65 1.65 0 0 0 0-.318.412.412 0 0 0-.294-.388 2.068 2.068 0 0 0-.509-.095 8.356 8.356 0 0 0-1.459.064l-.641.08c-.07 0-.132 0-.17-.065a.18.18 0 0 1 .014-.19.546.546 0 0 1 .162-.148 3.67 3.67 0 0 1 1.299-.562 6.412 6.412 0 0 1 1.097-.121c.346.001.691.042 1.028.121a1.515 1.515 0 0 1 .276.102c.121.05.206.162.219.293a2.157 2.157 0 0 1 .014.455 5.856 5.856 0 0 1-.806 2.55zm-2.55-5.72a.995.995 0 0 0 .301.01.691.691 0 0 0 .505-.293 1.01 1.01 0 0 0 .147-.308l-.009.014a1.924 1.924 0 0 0 .074-.678 2.449 2.449 0 0 0 0-.293 1.64 1.64 0 0 0-.147-.6.685.685 0 0 0-.483-.376.908.908 0 0 0-.302-.01.694.694 0 0 0-.542.328 1.163 1.163 0 0 0-.147.35 2.89 2.89 0 0 0-.042.933 1.494 1.494 0 0 0 .147.525c.09.207.276.355.497.397zm-3.523-1.96a.473.473 0 0 0-.394-.64c-.026 0-.047-.01-.073-.01a.797.797 0 0 0-.775.302 1.321 1.321 0 0 0-.211.578c-.015.047.01.069.058.073a4.705 4.705 0 0 0 .642.053c.11.006.22-.003.328-.026a.465.465 0 0 0 .425-.33zm-5.981-.255a1.174 1.174 0 0 0-.106.26 2.683 2.683 0 0 0-.065.997 1.48 1.48 0 0 0 .147.536.734.734 0 0 0 .568.391 1.306 1.306 0 0 0 .832-.158.147.147 0 0 0 .086-.147v-.966h.007c0-.323-.01-.641 0-.968a.147.147 0 0 0-.096-.156 1.614 1.614 0 0 0-.817-.147.678.678 0 0 0-.556.358zM3.855 7.051a.747.747 0 0 0 .488-.188.807.807 0 0 0 .243-.425 2.654 2.654 0 0 0 .065-1.002 1.505 1.505 0 0 0-.135-.54.653.653 0 0 0-.505-.382 1.44 1.44 0 0 0-.912.137.16.16 0 0 0-.105.164v1.917a.147.147 0 0 0 .09.147 1.468 1.468 0 0 0 .771.17"
  ),
  youtube: U(
    "M18.43 4.216H5.57A4.57 4.57 0 0 0 1 8.786v6.429a4.57 4.57 0 0 0 4.57 4.569h12.86a4.57 4.57 0 0 0 4.57-4.57V8.786a4.57 4.57 0 0 0-4.57-4.569zm-3.09 8.097-6.015 2.869a.241.241 0 0 1-.346-.218V9.046c0-.18.19-.297.351-.215l6.016 3.048a.242.242 0 0 1-.005.434z"
  )
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const F = (t, e) => {
  const o = t._$AN;
  if (o === void 0) return !1;
  for (const i of o) i._$AO?.(e, !1), F(i, e);
  return !0;
}, et = (t) => {
  let e, o;
  do {
    if ((e = t._$AM) === void 0) break;
    o = e._$AN, o.delete(t), t = e;
  } while (o?.size === 0);
}, ge = (t) => {
  for (let e; e = t._$AM; t = e) {
    let o = e._$AN;
    if (o === void 0) e._$AN = o = /* @__PURE__ */ new Set();
    else if (o.has(t)) break;
    o.add(t), wo(e);
  }
};
function bo(t) {
  this._$AN !== void 0 ? (et(this), this._$AM = t, ge(this)) : this._$AM = t;
}
function yo(t, e = !1, o = 0) {
  const i = this._$AH, n = this._$AN;
  if (n !== void 0 && n.size !== 0) if (e) if (Array.isArray(i)) for (let s = o; s < i.length; s++) F(i[s], !1), et(i[s]);
  else i != null && (F(i, !1), et(i));
  else F(this, t);
}
const wo = (t) => {
  t.type == xt.CHILD && (t._$AP ??= yo, t._$AQ ??= bo);
};
class $o extends he {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(e, o, i) {
    super._$AT(e, o, i), ge(this), this.isConnected = e._$AU;
  }
  _$AO(e, o = !0) {
    e !== this.isConnected && (this.isConnected = e, e ? this.reconnected?.() : this.disconnected?.()), o && (F(this, e), et(this));
  }
  setValue(e) {
    if (Ye(this._$Ct)) this._$Ct._$AI(e, this);
    else {
      const o = [...this._$Ct._$AH];
      o[this._$Ci] = e, this._$Ct._$AI(o, this, 0);
    }
  }
  disconnected() {
  }
  reconnected() {
  }
}
const Xt = 500, qt = 220, Zt = 40, Gt = 500, xo = 250, Jt = 12;
class Ao extends $o {
  constructor(e) {
    if (super(e), this._repeats = 0, this._inFlight = !1, this._bound = !1, this._active = !1, this._resolved = !1, this._startX = 0, this._startY = 0, this._awaitingSecondTap = !1, this._onPointerDown = (o) => {
      if (o.button !== 0) return;
      const i = this._options;
      if (!(!i || i.disabled)) {
        if (this._active = !0, this._resolved = !1, this._startX = o.clientX, this._startY = o.clientY, this._element?.classList.add("pressed"), i.onHold) {
          this._holdTimer = window.setTimeout(() => {
            this._active && (this._resolved = !0, this._fire(i.onHold, "medium"));
          }, Gt);
          return;
        }
        i.repeat && (this._repeats = 0, this._repeatTimer = window.setTimeout(() => {
          this._active && (this._resolved = !0, this._fire(i.onPress), this._repeatTimer = window.setInterval(() => {
            if (!this._active || this._repeats >= Zt) {
              this._reset();
              return;
            }
            this._repeats += 1, this._fire(i.onPress);
          }, qt));
        }, Xt));
      }
    }, this._onPointerMove = (o) => {
      if (!this._active) return;
      const i = o.clientX - this._startX, n = o.clientY - this._startY;
      i * i + n * n > Jt * Jt && this._abort();
    }, this._onPointerUp = () => {
      if (!this._active) return;
      const o = this._resolved;
      this._reset(), o || this._tap();
    }, this._onKeyDown = (o) => {
      if (o.key !== "Enter" && o.key !== " " || (o.preventDefault(), o.repeat || this._active)) return;
      const i = this._options;
      if (!(!i || i.disabled)) {
        if (this._active = !0, this._resolved = !0, this._startX = 0, this._startY = 0, this._element?.classList.add("pressed"), this._tap(), i.onHold) {
          this._holdTimer = window.setTimeout(() => {
            this._active && this._fire(i.onHold, "medium");
          }, Gt);
          return;
        }
        i.repeat && (this._repeats = 0, this._repeatTimer = window.setTimeout(() => {
          this._repeatTimer = window.setInterval(() => {
            if (!this._active || this._repeats >= Zt) {
              this._reset();
              return;
            }
            this._repeats += 1, this._fire(i.onPress);
          }, qt);
        }, Xt));
      }
    }, this._onKeyUp = () => {
      this._reset();
    }, this._abort = () => {
      this._reset();
    }, e.type !== xt.ELEMENT)
      throw new Error("press() can only be used on an element");
  }
  render(e) {
    return w;
  }
  update(e, [o]) {
    if (this._element = e.element, this._options = o, !this._bound) {
      this._bound = !0;
      const i = this._element;
      i.addEventListener("pointerdown", this._onPointerDown), i.addEventListener("pointermove", this._onPointerMove), i.addEventListener("pointerup", this._onPointerUp), i.addEventListener("pointercancel", this._abort), i.addEventListener("pointerleave", this._abort), i.addEventListener("keydown", this._onKeyDown), i.addEventListener("keyup", this._onKeyUp), i.addEventListener("blur", this._abort), i.addEventListener("contextmenu", (n) => n.preventDefault());
    }
    return w;
  }
  /* ------------------------------------------------------------------ firing */
  /** A tap, resolving single vs double first when that distinction exists. */
  _tap() {
    const e = this._options;
    if (e) {
      if (!e.onDoubleTap) {
        this._fire(e.onPress);
        return;
      }
      if (this._awaitingSecondTap) {
        window.clearTimeout(this._tapTimer), this._awaitingSecondTap = !1, this._fire(e.onDoubleTap);
        return;
      }
      this._awaitingSecondTap = !0, this._tapTimer = window.setTimeout(() => {
        this._awaitingSecondTap = !1, this._fire(e.onPress);
      }, xo);
    }
  }
  _fire(e, o = "light") {
    const i = this._options;
    i && (this._inFlight || (this._inFlight = !0, Promise.resolve().then(() => {
      this._inFlight = !1;
    }), i.haptics !== !1 && this._element && nt(this._element, "haptic", o), e()));
  }
  _reset() {
    this._active = !1, this._resolved = !1, this._repeats = 0, this._element?.classList.remove("pressed"), this._repeatTimer !== void 0 && (window.clearTimeout(this._repeatTimer), window.clearInterval(this._repeatTimer), this._repeatTimer = void 0), this._holdTimer !== void 0 && (window.clearTimeout(this._holdTimer), this._holdTimer = void 0);
  }
  disconnected() {
    this._reset(), this._tapTimer !== void 0 && (window.clearTimeout(this._tapTimer), this._tapTimer = void 0), this._awaitingSecondTap = !1;
  }
}
const S = de(Ao), be = ft`
  /*
   * Every section pads its own bottom and relies on the header for the top.
   * With the header hidden the first row sat flush against the card edge, so
   * the card supplies the padding itself in that case.
   */
  ha-card.headerless > *:first-child {
    padding-top: var(--ha-space-3, 12px);
  }

  /* --------------------------------------------------------- now playing -- */
  /* Brand logos are square art; match the kit's 24px --mdc-icon-size. */
  .tile-icon svg {
    width: 22px;
    height: 22px;
    fill: currentColor;
  }
  /*
   * The pill stays tinted by state -- colour when on, grey when off, the same
   * language as every other tile card -- but the logo inside it does not. A
   * brand mark recoloured to Home Assistant's media-player purple reads as a
   * rendering bug, and the tinted pill already carries the state.
   */
  .tile-icon .brand-mark {
    display: flex;
    color: var(--primary-text-color);
  }

  /* ---------------------------------------------------------- nav region -- */
  .pad {
    /* Container queries, so the pad tracks the card and not the viewport. */
    container-type: inline-size;
    padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px) var(--ha-space-3, 12px);
  }

  /*
   * The plus-shaped button pad.
   *
   * Keys are wide and short rather than square. A square key in a 3-column grid
   * is as tall as a third of the card is wide -- around 90px against the 40px
   * control buttons below it, which made the pad tower over everything else.
   * 52px is generous for a thumb, comfortably past the 44px touch-target
   * minimum, without that.
   *
   * Columns stretch to fill the card, so the pad lines up with the navigation,
   * transport, volume and app rows instead of floating in a centred 320px box.
   */
  .button-pad {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  .button-pad .pad-key {
    height: 52px;
  }
  .pad-key {
    position: relative;
    overflow: hidden;
    display: grid;
    place-items: center;
    margin: 0;
    padding: 0;
    border: none;
    border-radius: var(--radius-md);
    background: none;
    outline: none;
    cursor: pointer;
    color: var(--primary-text-color);
    --mdc-icon-size: 24px;
    transition:
      box-shadow var(--duration) ease-in-out,
      transform var(--duration) ease-in-out;
  }
  /* Same tint recipe as the kit's .control-button, without its fixed 40px. */
  .pad-key::before {
    content: "";
    position: absolute;
    inset: 0;
    background-color: var(--disabled-color, #9e9e9e);
    opacity: 0.2;
    transition:
      background-color var(--duration) ease-in-out,
      opacity var(--duration) ease-in-out;
  }
  .pad-key > * {
    position: relative;
  }
  .pad-key:hover::before {
    opacity: 0.3;
  }
  .pad-key:focus-visible {
    box-shadow: 0 0 0 2px var(--tile-color);
  }
  .pad-key.ok {
    border-radius: var(--radius-pill);
    color: var(--tile-color);
  }
  .pad-key.ok::before {
    background-color: var(--tile-color);
  }
  .pad-key.blank {
    visibility: hidden;
  }

  /* Circular d-pad. A CSS grid clipped to a circle rather than v1's rotated,
     skewed pie slices — those could not be focused, hit-tested unreliably at
     the seams, and carried a hardcoded #222222 puck invisible in light themes. */
  .dpad {
    position: relative;
    display: grid;
    grid-template-areas:
      ".    up    .    "
      "left ok    right"
      ".    down  .    ";
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    aspect-ratio: 1;
    width: min(100%, 260px);
    margin: 0 auto;
    border-radius: var(--radius-pill);
    overflow: hidden;
    background-color: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.06);
  }
  .dpad .pad-key {
    height: 100%;
    border-radius: 0;
  }
  .dpad .pad-key::before {
    opacity: 0;
  }
  .dpad .pad-key:hover::before,
  .dpad .pad-key.pressed::before {
    opacity: 0.18;
  }
  .dpad .pad-key:focus-visible {
    box-shadow: inset 0 0 0 2px var(--tile-color);
  }
  .dpad .up {
    grid-area: up;
  }
  .dpad .down {
    grid-area: down;
  }
  .dpad .left {
    grid-area: left;
  }
  .dpad .right {
    grid-area: right;
  }
  .dpad .ok {
    grid-area: ok;
    place-self: center;
    width: 100%;
    height: 100%;
    border-radius: var(--radius-pill);
    background-color: var(--card-background-color, var(--ha-card-background, #fff));
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    font-size: var(--ha-font-size-s, 12px);
    font-weight: var(--ha-font-weight-medium, 500);
    letter-spacing: 0.4px;
  }
  .dpad .ok::before {
    background-color: var(--tile-color);
    opacity: 0;
  }
  .dpad .ok:hover::before,
  .dpad .ok.pressed::before {
    opacity: 0.2;
  }

  /* ------------------------------------------------------------ touchpad -- */
  /*
   * A swipe surface has to claim the gesture, so touch-action: none is
   * unavoidable -- every comparable card does the same. What it costs is page
   * scrolling: wherever the pad covers, a thumb drag moves the pointer instead
   * of the page.
   *
   * Softened two ways rather than surrendering up/down swipes to the browser:
   * the pad is shorter, and it leaves a gutter down each side. Together with
   * taps resolving on release -- which makes every button row draggable -- the
   * card is now scrollable from most of its area. The buttons pad avoids the
   * trade-off entirely for anyone who wants that.
   */
  .touchpad {
    position: relative;
    touch-action: none;
    aspect-ratio: 1 / 0.55;
    width: auto;
    margin: 0 var(--ha-space-5, 20px);
    border: none;
    padding: 0;
    border-radius: var(--radius-lg);
    background-color: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.06);
    overflow: hidden;
    cursor: pointer;
    outline: none;
  }
  .touchpad:focus-visible {
    box-shadow: 0 0 0 2px var(--tile-color);
  }
  /* Keeps the pad from reading as an empty grey hole before it is touched. */
  .touchpad-mark {
    position: absolute;
    inset: 0;
    margin: auto;
    width: 40px;
    height: 40px;
    --mdc-icon-size: 40px;
    color: var(--secondary-text-color);
    opacity: 0.25;
    pointer-events: none;
    transition: opacity var(--duration) ease-in-out;
  }
  .touchpad:hover .touchpad-mark {
    opacity: 0.35;
  }
  .touchpad-dot {
    position: absolute;
    top: 0;
    left: 0;
    width: 44px;
    height: 44px;
    margin: -22px 0 0 -22px;
    border-radius: var(--radius-pill);
    background-color: var(--tile-color);
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--duration) ease-in-out;
  }
  .touchpad-dot.visible {
    opacity: 0.35;
  }
  .touchpad-hint {
    position: absolute;
    inset: auto 0 var(--ha-space-3, 12px) 0;
    text-align: center;
    font-size: var(--ha-font-size-xs, 10px);
    letter-spacing: 0.4px;
    color: var(--secondary-text-color);
    pointer-events: none;
  }

  /* -------------------------------------------------------------- volume -- */
  /*
   * The mute toggle is also the level readout: the bar is drawn inside the
   * button rather than under the row, and the percentage sits next to the
   * icon. One control says what the volume is, whether it is muted, and
   * changes it -- where three separate pieces of UI used to.
   *
   * It takes twice the width of a step button so the number has room and the
   * eye lands on the state rather than on the two arrows either side.
   */
  .volume-level {
    flex: 2 1 0;
  }
  /* Beats the kit's .control-button > * rule on specificity, so the fill can
     sit behind the icon and the number instead of in line with them. */
  .volume-level .level {
    position: absolute;
    inset: 0 auto 0 0;
    background-color: var(--tile-color);
    opacity: 0.35;
    transition:
      width var(--duration) ease-in-out,
      opacity var(--duration) ease-in-out;
  }
  .volume-level .value {
    /* Digits of one width: the number is under a repeating button, and
       proportional digits made the label twitch on the way from 9% to 100%. */
    font-variant-numeric: tabular-nums;
  }
  .volume-level.muted {
    color: var(--secondary-text-color);
  }
  .volume-level.muted .level {
    filter: grayscale(1);
    opacity: 0.2;
  }

  /* ------------------------------------------------------------ app grid -- */
  /*
   * A fixed number of columns, so a button is the same width whether there are
   * two apps or ten, and a sixth app wraps onto a second row aligned with the
   * first. Buttons stretch to fill the card like every other control row.
   *
   * The earlier failure this avoids: sizing columns to the app *count* made two
   * apps into two half-card-wide logos.
   */
  .app-grid {
    display: grid;
    grid-template-columns: repeat(var(--app-per-row, 5), 1fr);
    /* Matches the kit's .features gap, so the app row lines up with the
       navigation, transport and volume rows above it. */
    gap: 12px;
    padding: 0 var(--ha-space-3, 12px) var(--ha-space-3, 12px);
  }
  .app-tile {
    /* Same 40px height as every other control row, rather than a big square.
       Square tiles scale their logo with the card, so two apps in a wide card
       became two enormous logos; a fixed size keeps the app row reading as a
       row of buttons, which is what it is. */
    width: 100%;
    position: relative;
    overflow: hidden;
    display: grid;
    place-items: center;
    height: 40px;
    margin: 0;
    padding: 8px;
    border: none;
    border-radius: var(--radius-md);
    background: none;
    outline: none;
    cursor: pointer;
    color: var(--primary-text-color);
    --mdc-icon-size: 24px;
    transition:
      box-shadow var(--duration) ease-in-out,
      transform var(--duration) ease-in-out;
  }
  .app-tile::before {
    content: "";
    position: absolute;
    inset: 0;
    background-color: var(--app-color, var(--disabled-color, #9e9e9e));
    opacity: 0.2;
    transition: opacity var(--duration) ease-in-out;
  }
  .app-tile:hover::before {
    opacity: 0.32;
  }
  /*
   * A tile bound to an entity that is on, tinted like the header pill so that
   * "this is on" reads the same everywhere on the card. Tiles with no entity
   * never get this class.
   */
  .app-tile.active {
    color: var(--app-color, var(--tile-color));
  }
  .app-tile.active::before {
    background-color: var(--app-color, var(--tile-color));
    opacity: 0.25;
  }
  .app-tile.active:hover::before {
    opacity: 0.35;
  }

  .app-tile:focus-visible {
    box-shadow: 0 0 0 2px var(--app-color, var(--tile-color));
  }
  .app-tile > * {
    position: relative;
  }
  /* Logos are square art in a wider button, so height is the constraint. */
  .app-tile svg,
  .app-tile img {
    width: auto;
    height: 100%;
    max-width: 100%;
    max-height: 24px;
    object-fit: contain;
  }
  .app-tile svg {
    fill: currentColor;
  }

  /* ---------------------------------------------------------- text input -- */
  .text-row {
    display: flex;
    align-items: center;
    gap: var(--ha-space-2, 8px);
    padding: 0 var(--ha-space-3, 12px) var(--ha-space-3, 12px);
  }
  .text-row input {
    flex: 1 1 auto;
    min-width: 0;
    height: 40px;
    padding: 0 var(--ha-space-3, 12px);
    border: none;
    border-radius: var(--radius-md);
    background-color: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.08);
    color: var(--primary-text-color);
    font: inherit;
    font-size: var(--ha-font-size-m, 14px);
    outline: none;
  }
  .text-row input:focus-visible {
    box-shadow: 0 0 0 2px var(--tile-color);
  }
  .text-row .control-button {
    flex: 0 0 auto;
    width: 40px;
    padding: 0;
  }

  /* --------------------------------------------------------- press state -- */
  .pressed {
    transform: scale(0.94);
  }
  .pad-key.pressed::before,
  .app-tile.pressed::before {
    opacity: 0.4;
  }

  @media (prefers-reduced-motion: reduce) {
    .pressed {
      transform: none;
    }
    .pad-key,
    .app-tile,
    .touchpad-dot,
    .volume-level .level {
      transition: none;
    }
  }
`, Tt = ft`
  :host {
    /* Mirrors hui-tile-card: inactive by default, state colour when active. */
    --tile-color: var(--state-inactive-color, #9e9e9e);

    --ha-space-1: var(--ha-space-1, 4px);
    --radius-md: var(--ha-border-radius-md, 8px);
    --radius-lg: var(--ha-border-radius-lg, 12px);
    --radius-pill: var(--ha-border-radius-pill, 9999px);
    --duration: 180ms;
  }

  ha-card {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* ----------------------------------------------------- tile content row -- */
  .tile {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 10px;
    min-height: 56px;
    gap: 10px;
    box-sizing: border-box;
  }

  .tile-icon {
    position: relative;
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: var(--radius-pill);
    overflow: hidden;
    color: var(--tile-color);
    --mdc-icon-size: 24px;
    transition:
      transform var(--duration) ease-in-out,
      color var(--duration) ease-in-out;
  }
  .tile-icon::before {
    content: "";
    position: absolute;
    inset: 0;
    background-color: var(--tile-color);
    opacity: 0.2;
    transition:
      background-color var(--duration) ease-in-out,
      opacity var(--duration) ease-in-out;
  }
  .tile-icon ha-icon {
    position: relative;
    display: flex;
  }
  .tile-icon.interactive {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .tile-icon.interactive:hover::before {
    opacity: 0.35;
  }
  .tile-icon.interactive:active {
    transform: scale(1.2);
  }
  .tile-icon:focus {
    outline: none;
  }
  .tile-icon:focus-visible {
    box-shadow: 0 0 0 2px var(--tile-color);
  }
  /* hui-tile-card pulses the icon for lock.jammed. */
  .tile-icon.pulse {
    animation: pulse 1s infinite;
  }
  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .tile-icon.pulse {
      animation: none;
    }
    .spin {
      animation: none;
    }
  }

  .tile-info {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }
  /* ha-tile-info makes these flex rows and puts the ellipsis on an inner span;
     centring the line box this way avoids the half-pixel drift you get from
     relying on line-height alone. */
  .primary,
  .secondary {
    display: flex;
    align-items: center;
    width: 100%;
    min-width: 0;
  }
  .primary > span,
  .secondary > span {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .primary {
    font-size: var(--ha-font-size-m, 14px);
    font-weight: var(--ha-font-weight-medium, 500);
    line-height: var(--ha-line-height-normal, 1.6);
    letter-spacing: 0.1px;
    color: var(--primary-text-color);
  }
  .secondary {
    font-size: var(--ha-font-size-s, 12px);
    font-weight: var(--ha-font-weight-normal, 400);
    line-height: var(--ha-line-height-condensed, 1.2);
    letter-spacing: 0.4px;
    color: var(--secondary-text-color);
  }
  .primary.muted {
    color: var(--secondary-text-color);
    font-style: italic;
  }
  .primary.code {
    font-family: var(--ha-font-family-code, ui-monospace, SFMono-Regular, monospace);
    letter-spacing: 0.18em;
  }
  .strike {
    text-decoration: line-through;
    opacity: 0.6;
  }

  /* ------------------------------------------------- control buttons ------- */
  .features {
    display: flex;
    flex-direction: row;
    gap: 12px;
    padding: 0 var(--ha-space-3, 12px) var(--ha-space-3, 12px);
  }
  .control-button {
    position: relative;
    overflow: hidden;
    flex: 1 1 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 40px;
    padding: 8px;
    margin: 0;
    border: none;
    border-radius: var(--radius-md);
    background: none;
    outline: none;
    box-sizing: border-box;
    cursor: pointer;
    font: inherit;
    font-size: var(--ha-font-size-m, 14px);
    font-weight: var(--ha-font-weight-medium, 500);
    color: var(--primary-text-color);
    --mdc-icon-size: 20px;
    transition:
      box-shadow var(--duration) ease-in-out,
      color var(--duration) ease-in-out;
  }
  .control-button::before {
    content: "";
    position: absolute;
    inset: 0;
    background-color: var(--disabled-color, #9e9e9e);
    opacity: 0.2;
    transition:
      background-color var(--duration) ease-in-out,
      opacity var(--duration) ease-in-out;
  }
  .control-button > * {
    position: relative;
  }
  .control-button:hover:not(:disabled)::before {
    opacity: 0.3;
  }
  .control-button:focus-visible {
    box-shadow: 0 0 0 2px var(--tile-color);
  }
  .control-button:disabled {
    cursor: not-allowed;
    color: var(--disabled-text-color);
  }
  .control-button:disabled::before {
    opacity: 0.1;
  }
  .control-button.accent {
    color: var(--primary-color);
  }
  .control-button.accent::before {
    background-color: var(--primary-color);
  }
  .control-button.destructive {
    color: var(--error-color, #db4437);
  }
  .control-button.destructive::before {
    background-color: var(--error-color, #db4437);
  }
  .control-button.wide {
    width: 100%;
  }

  /* Square icon-only variant of a control button. */
  .icon-button {
    position: relative;
    overflow: hidden;
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 8px;
    border: none;
    border-radius: var(--radius-md);
    background: none;
    outline: none;
    box-sizing: border-box;
    cursor: pointer;
    color: var(--secondary-text-color);
    --mdc-icon-size: 22px;
    transition:
      box-shadow var(--duration) ease-in-out,
      color var(--duration) ease-in-out;
  }
  .icon-button::before {
    content: "";
    position: absolute;
    inset: 0;
    background-color: var(--disabled-color, #9e9e9e);
    opacity: 0;
    transition: opacity var(--duration) ease-in-out;
  }
  .icon-button ha-icon {
    position: relative;
  }
  .icon-button:hover:not(:disabled) {
    color: var(--primary-text-color);
  }
  .icon-button:hover:not(:disabled)::before {
    opacity: 0.2;
  }
  .icon-button:focus-visible {
    box-shadow: 0 0 0 2px var(--tile-color);
  }
  .icon-button:disabled {
    cursor: not-allowed;
    color: var(--disabled-text-color);
  }
  .icon-button.danger:hover:not(:disabled) {
    color: var(--error-color, #db4437);
  }
  .spin {
    animation: spin 900ms linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* ------------------------------------------------------------ sections -- */
  .section-head {
    display: flex;
    align-items: center;
    min-height: 40px;
    gap: var(--ha-space-2, 8px);
    padding: 0 var(--ha-space-3, 12px);
    font-size: var(--ha-font-size-s, 12px);
    font-weight: var(--ha-font-weight-medium, 500);
    line-height: var(--ha-line-height-condensed, 1.2);
    letter-spacing: 0.4px;
    text-transform: uppercase;
    color: var(--secondary-text-color);
  }
  .section-head .count {
    text-transform: none;
    letter-spacing: 0.4px;
    font-weight: var(--ha-font-weight-normal, 400);
  }
  .section-head .grow {
    flex: 1 1 auto;
  }
  .section-head .icon-button {
    width: 32px;
    height: 32px;
    --mdc-icon-size: 20px;
  }

  ul.list {
    list-style: none;
    margin: 0;
    padding: 0 var(--ha-space-2, 8px);
    display: flex;
    flex-direction: column;
    gap: var(--ha-space-1, 4px);
  }
  li.row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    min-height: 56px;
    padding: 0 var(--ha-space-1, 4px) 0 10px;
    border-radius: var(--radius-lg);
    box-sizing: border-box;
    /* Neutral surface on purpose: --tile-color signals entity state, and a list
       row is not the entity. Tinting every row swamps the card. */
    background-color: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.04);
  }
  li.row.inactive .primary {
    text-decoration: line-through;
    opacity: 0.6;
  }
  li.row.empty {
    background-color: transparent;
    border: 1px dashed rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.14);
  }

  /* Slot/user number, styled as a tile icon. */
  .slot-badge {
    position: relative;
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    min-width: 36px;
    height: 36px;
    padding: 0 var(--ha-space-2, 8px);
    border-radius: var(--radius-pill);
    overflow: hidden;
    box-sizing: border-box;
    font-size: var(--ha-font-size-s, 12px);
    font-weight: var(--ha-font-weight-medium, 500);
    font-variant-numeric: tabular-nums;
    color: var(--secondary-text-color);
  }
  .slot-badge::before {
    content: "";
    position: absolute;
    inset: 0;
    background-color: var(--disabled-color, #9e9e9e);
    opacity: 0.2;
  }
  /* Opt in to state colour where a badge really does represent the entity. */
  .slot-badge.accent {
    color: var(--tile-color);
  }
  .slot-badge.accent::before {
    background-color: var(--tile-color);
  }
  .slot-badge span {
    position: relative;
  }

  /*
   * .tile-icon and .chip were written for a div and a span, but both have
   * interactive variants and so get rendered as <button>. Neither resets the
   * UA's button chrome, which shows through as a 2px outset border and a
   * ButtonFace background — and with a pill radius plus overflow: hidden, that
   * border becomes a partial ring around the icon.
   *
   * .control-button and .icon-button already reset their own; these are the two
   * that were missed.
   */
  button.tile-icon,
  button.chip {
    margin: 0;
    border: none;
    font: inherit;
    cursor: pointer;
    outline: none;
  }
  button.tile-icon {
    padding: 0;
    background: none;
  }

  /* ---------------------------------------------------------------- chips -- */
  .chips {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--ha-space-1, 4px);
    margin-top: 2px;
  }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    height: 20px;
    padding: 0 var(--ha-space-2, 8px);
    border-radius: var(--radius-pill);
    font-size: var(--ha-font-size-xs, 10px);
    font-weight: var(--ha-font-weight-medium, 500);
    letter-spacing: 0.4px;
    color: var(--secondary-text-color);
    background-color: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.08);
    --mdc-icon-size: 13px;
  }
  .chip.accent {
    color: var(--primary-color);
    background-color: rgba(var(--rgb-primary-color, 33, 150, 243), 0.16);
  }
  .chip.warn {
    color: var(--error-color, #db4437);
    background-color: rgba(219, 68, 55, 0.16);
  }
  .chip button {
    display: grid;
    place-items: center;
    margin: 0 -3px 0 1px;
    padding: 0;
    border: none;
    background: none;
    color: inherit;
    cursor: pointer;
    --mdc-icon-size: 13px;
  }

  /* ----------------------------------------------------------------- form -- */
  /* A form rendered inline inside a list, directly under its row. */
  li.form-host {
    list-style: none;
    display: block;
  }
  li.form-host .form {
    margin: 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    gap: var(--ha-space-3, 12px);
    margin: 0 var(--ha-space-2, 8px);
    padding: var(--ha-space-3, 12px);
    border-radius: var(--radius-lg);
    background-color: rgba(var(--rgb-primary-color, 33, 150, 243), 0.08);
  }
  .form-title {
    font-size: var(--ha-font-size-m, 14px);
    font-weight: var(--ha-font-weight-medium, 500);
    line-height: var(--ha-line-height-normal, 1.6);
    letter-spacing: 0.1px;
    color: var(--primary-text-color);
  }
  .fields {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: var(--ha-space-3, 12px);
  }
  label.field {
    display: flex;
    flex-direction: column;
    gap: var(--ha-space-1, 4px);
    font-size: var(--ha-font-size-s, 12px);
    letter-spacing: 0.4px;
    color: var(--secondary-text-color);
  }
  label.field input,
  label.field select {
    font: inherit;
    font-size: var(--ha-font-size-m, 14px);
    height: 40px;
    padding: 0 10px;
    border-radius: var(--radius-md);
    box-sizing: border-box;
    color: var(--primary-text-color);
    background-color: var(--card-background-color, #fff);
    border: 1px solid rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.2);
    transition: box-shadow var(--duration) ease-in-out;
  }
  label.field input:focus,
  label.field select:focus {
    outline: none;
    border-color: transparent;
    box-shadow: 0 0 0 2px var(--primary-color);
  }
  label.check {
    flex-direction: row;
    align-items: center;
    gap: var(--ha-space-2, 8px);
    align-self: end;
    height: 40px;
    font-size: var(--ha-font-size-m, 14px);
    color: var(--primary-text-color);
  }
  .form-actions {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 12px;
  }
  .form-actions .control-button {
    flex: 0 0 auto;
    min-width: 88px;
  }
  .hint {
    font-size: var(--ha-font-size-s, 12px);
    line-height: var(--ha-line-height-condensed, 1.2);
    letter-spacing: 0.4px;
    color: var(--secondary-text-color);
  }

  /* -------------------------------------------------------------- notices -- */
  .notice {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: var(--ha-space-2, 8px);
    margin: 0 var(--ha-space-2, 8px);
    padding: 10px var(--ha-space-3, 12px);
    border-radius: var(--radius-lg);
    font-size: var(--ha-font-size-s, 12px);
    line-height: var(--ha-line-height-condensed, 1.2);
    letter-spacing: 0.4px;
    --mdc-icon-size: 18px;
  }
  .notice.error {
    color: var(--error-color, #db4437);
    background-color: rgba(219, 68, 55, 0.12);
  }
  .notice.warn {
    color: var(--warning-color, #ff9800);
    background-color: rgba(255, 152, 0, 0.12);
  }
  .notice ha-icon {
    flex: 0 0 auto;
  }
  .notice .grow {
    flex: 1 1 auto;
    min-width: 0;
    overflow-wrap: anywhere;
  }
  .empty-state {
    padding: var(--ha-space-4, 16px) var(--ha-space-3, 12px);
    text-align: center;
    font-size: var(--ha-font-size-m, 14px);
    line-height: var(--ha-line-height-normal, 1.6);
    letter-spacing: 0.1px;
    color: var(--secondary-text-color);
  }

  /* Whichever element ends the card supplies the bottom breathing room. */
  .tail,
  ul.list:last-child,
  .empty-state:last-child,
  .form:last-child,
  .notice:last-child {
    margin-bottom: var(--ha-space-3, 12px);
  }

  .skeleton {
    height: 56px;
    border-radius: var(--radius-lg);
    background: linear-gradient(
      90deg,
      rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.05) 25%,
      rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.1) 37%,
      rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.05) 63%
    );
    background-size: 400% 100%;
    animation: shimmer 1.3s ease infinite;
  }
  @keyframes shimmer {
    0% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0 50%;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .skeleton {
      animation: none;
    }
  }
`;
var ko = Object.defineProperty, Eo = Object.getOwnPropertyDescriptor, R = (t, e, o, i) => {
  for (var n = i > 1 ? void 0 : i ? Eo(e, o) : e, s = t.length - 1, a; s >= 0; s--)
    (a = t[s]) && (n = (i ? a(e, o, n) : a(n)) || n);
  return i && n && ko(e, o, n), n;
};
const Qt = 0.06, To = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  Enter: "center",
  " ": "center"
};
let $ = class extends C {
  constructor() {
    super(...arguments), this.pad = "buttons", this.repeat = !0, this.haptics = !0, this._tracking = !1, this._startX = 0, this._startY = 0, this._onPointerDown = (t) => {
      t.button === 0 && (t.preventDefault(), this._touchpad?.setPointerCapture(t.pointerId), this._startX = t.clientX, this._startY = t.clientY, this._tracking = !0, this._moveDot(t));
    }, this._onPointerMove = (t) => {
      this._tracking && (t.preventDefault(), this._moveDot(t));
    }, this._onPointerUp = (t) => {
      if (!this._tracking) return;
      this._tracking = !1;
      const e = this._touchpad;
      if (!e) return;
      const o = e.getBoundingClientRect(), i = (t.clientX - this._startX) / o.width, n = (t.clientY - this._startY) / o.height;
      if (Math.abs(i) < Qt && Math.abs(n) < Qt) {
        this._emit("center");
        return;
      }
      Math.abs(i) >= Math.abs(n) ? this._emit(i < 0 ? "left" : "right") : this._emit(n < 0 ? "up" : "down");
    }, this._onPointerCancel = () => {
      this._tracking = !1;
    }, this._onKeyDown = (t) => {
      const e = To[t.key];
      e && (t.preventDefault(), this._emit(e));
    };
  }
  _emit(t) {
    nt(this, "atv-nav", { direction: t });
  }
  _key(t, e, o, i = "") {
    return d`
      <button
        class="pad-key ${i}"
        type="button"
        aria-label=${o}
        ${S({
      onPress: () => this._emit(t),
      repeat: this.repeat && t !== "center",
      haptics: this.haptics
    })}
      >
        <ha-icon icon=${e}></ha-icon>
      </button>
    `;
  }
  _blank() {
    return d`<span class="pad-key blank" aria-hidden="true"></span>`;
  }
  /**
   * A plus-shaped button pad.
   *
   * v1 packed power, home, back and favourite into the four corners of this
   * grid, which is why it had to suppress the separate navigation row. Keeping
   * the pad purely directional means one obvious home for each control, and no
   * setting to reconcile the two.
   */
  _renderButtons() {
    return d`
      <div class="button-pad" role="group" aria-label="Directional pad">
        ${this._blank()} ${this._key("up", "mdi:chevron-up", "Up")} ${this._blank()}
        ${this._key("left", "mdi:chevron-left", "Left")}
        ${this._key("center", "mdi:circle", "Select", "ok")}
        ${this._key("right", "mdi:chevron-right", "Right")}
        ${this._blank()} ${this._key("down", "mdi:chevron-down", "Down")} ${this._blank()}
      </div>
    `;
  }
  _renderDpad() {
    return d`
      <div class="dpad" role="group" aria-label="Directional pad">
        ${this._key("up", "mdi:chevron-up", "Up", "up")}
        ${this._key("left", "mdi:chevron-left", "Left", "left")}
        <button
          class="pad-key ok"
          type="button"
          aria-label="Select"
          ${S({ onPress: () => this._emit("center"), haptics: this.haptics })}
        >
          <span>OK</span>
        </button>
        ${this._key("right", "mdi:chevron-right", "Right", "right")}
        ${this._key("down", "mdi:chevron-down", "Down", "down")}
      </div>
    `;
  }
  /**
   * Swipe to move, tap to select.
   *
   * `role="application"` plus arrow-key handling, because a swipe surface is
   * otherwise completely unusable from a keyboard — which is what v1 shipped.
   */
  _renderTouchpad() {
    return d`
      <div
        class="touchpad"
        role="application"
        tabindex="0"
        aria-label="Touchpad: swipe to move, tap to select, or use the arrow keys"
        @pointerdown=${this._onPointerDown}
        @pointermove=${this._onPointerMove}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerCancel}
        @keydown=${this._onKeyDown}
      >
        <ha-icon class="touchpad-mark" icon="mdi:gesture-swipe"></ha-icon>
        <span class="touchpad-dot ${this._tracking ? "visible" : ""}"></span>
        <span class="touchpad-hint">swipe to move · tap to select</span>
      </div>
    `;
  }
  _moveDot(t) {
    const e = this._touchpad, o = this._dot;
    if (!e || !o) return;
    const i = e.getBoundingClientRect();
    o.style.transform = `translate(${t.clientX - i.left}px, ${t.clientY - i.top}px)`;
  }
  render() {
    return d`
      <div class="pad">
        ${this.pad === "touchpad" ? this._renderTouchpad() : this.pad === "dpad" ? this._renderDpad() : this._renderButtons()}
      </div>
    `;
  }
};
$.styles = [Tt, be];
R([
  V({ type: String })
], $.prototype, "pad", 2);
R([
  V({ type: Boolean })
], $.prototype, "repeat", 2);
R([
  V({ type: Boolean })
], $.prototype, "haptics", 2);
R([
  le(".touchpad")
], $.prototype, "_touchpad", 2);
R([
  le(".touchpad-dot")
], $.prototype, "_dot", 2);
R([
  j()
], $.prototype, "_tracking", 2);
$ = R([
  $t("polr-atv-nav-pad")
], $);
var So = Object.defineProperty, Po = Object.getOwnPropertyDescriptor, at = (t, e, o, i) => {
  for (var n = i > 1 ? void 0 : i ? Po(e, o) : e, s = t.length - 1, a; s >= 0; s--)
    (a = t[s]) && (n = (i ? a(e, o, n) : a(n)) || n);
  return i && n && So(e, o, n), n;
};
const te = [
  { value: "activity", label: "Launch app or link", hint: "App name from the integration, or a deep link such as https://www.netflix.com/title" },
  { value: "app", label: "Open app id", hint: "Android package id, e.g. com.netflix.ninja. Needs a paired media player." },
  { value: "key", label: "Send a key", hint: "Android key code, e.g. GUIDE or MEDIA_REWIND" },
  { value: "action", label: "Call an action", hint: "" }
], Co = (t) => [
  { name: "show_apps", selector: { boolean: {} } },
  ...t.show_apps ? [{ name: "app_columns", selector: { number: { min: 1, max: 8, mode: "box" } } }] : []
], Oo = [
  {
    type: "expandable",
    name: "",
    title: "Text input",
    icon: "mdi:keyboard",
    schema: [{ name: "show_text_input", selector: { boolean: {} } }]
  },
  {
    type: "expandable",
    name: "",
    title: "Advanced",
    icon: "mdi:tune",
    schema: [
      { name: "hold_repeat", selector: { boolean: {} } },
      { name: "haptics", selector: { boolean: {} } },
      { name: "show_section_labels", selector: { boolean: {} } }
    ]
  }
], Mo = (t) => [
  {
    name: "entity",
    required: !0,
    selector: {
      entity: {
        // Narrow to the integration this card is built for, but still allow
        // any remote — plenty of people point it at something else.
        filter: [
          { integration: "androidtv_remote", domain: "remote" },
          { domain: "remote" }
        ]
      }
    }
  },
  { name: "name", selector: { text: {} } },
  {
    type: "expandable",
    name: "",
    title: "Header",
    icon: "mdi:television",
    schema: [
      { name: "show_header", selector: { boolean: {} } },
      { name: "show_power", selector: { boolean: {} } },
      { name: "power_action", selector: { ui_action: {} } }
    ]
  },
  {
    type: "expandable",
    name: "",
    title: "Pad",
    icon: "mdi:gesture-tap-button",
    schema: [
      { name: "show_nav", selector: { boolean: {} } },
      ...t.show_nav ? [
        {
          name: "pad",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: "buttons", label: "Buttons" },
                { value: "dpad", label: "D-pad" },
                { value: "touchpad", label: "Touchpad" }
              ]
            }
          }
        }
      ] : []
    ]
  },
  {
    type: "expandable",
    name: "",
    title: "Playback",
    icon: "mdi:play-pause",
    schema: [
      { name: "show_transport", selector: { boolean: {} } },
      ...t.show_transport ? [
        {
          name: "transport_buttons",
          selector: {
            select: {
              multiple: !0,
              mode: "list",
              options: [
                { value: "previous", label: "Previous" },
                { value: "rewind", label: "Rewind" },
                { value: "play_pause", label: "Play / pause" },
                { value: "fast_forward", label: "Fast forward" },
                { value: "next", label: "Next" }
              ]
            }
          }
        }
      ] : []
    ]
  },
  {
    type: "expandable",
    name: "",
    title: "Volume",
    icon: "mdi:volume-high",
    schema: [
      { name: "show_volume", selector: { boolean: {} } },
      {
        name: "volume_entity",
        selector: { entity: { filter: [{ domain: "media_player" }] } }
      },
      // HA's own interactions editor: tap, hold and double tap, with the
      // full action vocabulary. IR bridges expose one pressable entity per
      // command rather than a media_player, so this is how those get wired.
      ...["volume_up", "volume_down", "volume_mute"].map((e) => ({
        name: `${e}_action`,
        selector: { ui_action: {} }
      }))
    ]
  }
], zo = [
  { name: "action", selector: { ui_action: {} } }
], Ro = {
  entity: "Remote entity",
  volume_entity: "Volume on another media player",
  power_action: "Power",
  volume_up_action: "Volume up",
  volume_down_action: "Volume down",
  volume_mute_action: "Mute",
  name: "Title",
  pad: "Pad style",
  show_header: "Show header",
  show_power: "Show power",
  show_nav: "Show pad",
  show_transport: "Transport controls",
  show_volume: "Volume controls",
  show_apps: "App launcher",
  transport_buttons: "Buttons",
  app_columns: "Buttons per row",
  show_text_input: "Text input",
  hold_repeat: "Hold to repeat",
  haptics: "Haptic feedback",
  show_section_labels: "Section labels"
}, Uo = {
  show_power: "In the header, or in the back / home / menu row when the header is hidden.",
  volume_entity: "Point this at a soundbar or receiver that exposes a media player. A TV passing audio through reports no volume level, so the card shows no level bar for it.",
  power_action: "Leave empty to toggle the TV itself. Set it when something else does the switching — an IR or RF blaster, or a script that also powers a receiver.",
  volume_up_action: "Leave empty to control the TV or the media player above. Set it for IR bridges and the like, which expose one pressable entity per command instead of a media player.",
  // Kept short: ha-form runs a boolean's helper up against its toggle, and a
  // long one wraps into it. The full caveats are in the README.
  show_text_input: "Needs a focused search field on the TV, and Enable IME."
};
let x = class extends C {
  constructor() {
    super(...arguments), this._editing = null, this._computeLabel = (t) => Ro[t.name] ?? t.name, this._computeHelper = (t) => Uo[t.name];
  }
  setConfig(t) {
    this._config = fe(t);
  }
  /**
   * ha-form data, with the editable tap actions flattened.
   *
   * ha-form has no vocabulary for a nested map, so `overrides.power` is
   * surfaced as `power_action` and folded back in `_formChanged`. Hold and
   * double-tap actions are preserved untouched; the selector only edits the tap.
   */
  get _formData() {
    const t = { ...this._config };
    for (const e of x.ACTION_BUTTONS)
      t[`${e}_action`] = this._config.overrides[e]?.tap_action;
    return t;
  }
  /** Emit a full v2 config. This is what upgrades stored v1 YAML. */
  _emit(t) {
    nt(this, "config-changed", { config: go(t) });
  }
  _formChanged(t) {
    t.stopPropagation();
    const e = { ...t.detail.value }, o = { ...this._config.overrides };
    for (const i of x.ACTION_BUTTONS) {
      const n = `${i}_action`;
      if (!(n in e)) continue;
      const s = e[n];
      delete e[n];
      const a = { ...this._config.overrides[i] ?? {} };
      N(s) && s.action !== "none" ? o[i] = { ...a, tap_action: s } : (delete a.tap_action, Object.keys(a).length ? o[i] = a : delete o[i]);
    }
    this._emit({
      ...this._config,
      ...e,
      overrides: o,
      apps: this._config.apps
    });
  }
  /* --------------------------------------------------------- tile lists -- */
  /*
   * Apps and every custom section are the same list of tiles, so the list
   * machinery is addressed by path rather than duplicated per list. `"apps"` is
   * the built-in launcher; a number is an index into `sections`.
   */
  _tiles(t) {
    return t === "apps" ? this._config.apps : this._config.sections[t]?.buttons ?? [];
  }
  _setTiles(t, e) {
    if (t === "apps") {
      this._emit({ ...this._config, apps: e });
      return;
    }
    const o = this._config.sections.map(
      (i, n) => n === t ? { ...i, buttons: e } : i
    );
    this._emit({ ...this._config, sections: o });
  }
  _addTile(t, e) {
    const o = [...this._tiles(t), e];
    this._setTiles(t, o), this._editing = { path: t, index: o.length - 1 };
  }
  _updateTile(t, e, o) {
    this._setTiles(
      t,
      this._tiles(t).map((i, n) => n === e ? { ...i, ...o } : i)
    );
  }
  _removeTile(t, e) {
    this._setTiles(
      t,
      this._tiles(t).filter((o, i) => i !== e)
    ), this._editing = null;
  }
  _moveTile(t, e, o) {
    const i = [...this._tiles(t)], n = e + o;
    n < 0 || n >= i.length || ([i[e], i[n]] = [i[n], i[e]], this._setTiles(t, i), this._isEditing(t, e) && (this._editing = { path: t, index: n }));
  }
  _isEditing(t, e) {
    return this._editing?.path === t && this._editing.index === e;
  }
  /** Change the action kind, carrying the old value across where it makes sense. */
  _setActionKind(t, e, o) {
    const i = this._tiles(t)[e].action;
    this._updateTile(t, e, {
      action: oe(o, ee(i))
    });
  }
  _setActionValue(t, e, o) {
    const i = this._tiles(t)[e].action;
    this._updateTile(t, e, { action: oe(mt(i), o) });
  }
  /* ---------------------------------------------------------- sections -- */
  _setSections(t) {
    this._emit({ ...this._config, sections: t });
  }
  _addSection() {
    this._setSections([
      ...this._config.sections,
      { name: "New section", buttons: [] }
    ]);
  }
  _renameSection(t, e) {
    this._setSections(
      this._config.sections.map(
        (o, i) => i === t ? { ...o, name: e } : o
      )
    );
  }
  _removeSection(t) {
    this._setSections(this._config.sections.filter((e, o) => o !== t)), this._editing = null;
  }
  _renderIcon(t) {
    const e = t.icon ?? "mdi:application";
    if (e.startsWith("brand:")) {
      const o = ut[e.slice(6)];
      if (o) return d`<span class="brand">${o}</span>`;
    }
    return e.startsWith("/") || e.startsWith("http") ? d`<img class="brand" src=${e} alt="" />` : d`<ha-icon .icon=${e}></ha-icon>`;
  }
  /**
   * One list row.
   *
   * The inline edit form is a *sibling* `<li>`, appended by the caller rather
   * than returned from here. A single template emitting two `<li>` elements
   * gets mis-parsed — the second ends up nested inside the first, and the form
   * renders half-width, floating out of the row.
   */
  /**
   * A tile list, with the open row's form appended after it.
   *
   * The form is a *sibling* `<li>`, which is why rows and forms are flattened
   * here rather than returned together — see _renderAppRow.
   */
  _renderTileList(t, e, o) {
    return e.length ? d`<ul class="list">
      ${e.flatMap(
      (i, n) => this._isEditing(t, n) ? [
        this._renderAppRow(t, i, n, e.length),
        this._renderAppForm(t, i, n)
      ] : [this._renderAppRow(t, i, n, e.length)]
    )}
    </ul>` : d`<div class="empty-state">${o}</div>`;
  }
  _renderAppRow(t, e, o, i) {
    const n = this._isEditing(t, o);
    return d`
      <li class="row">
        <div class="tile-icon">${this._renderIcon(e)}</div>
        <div class="tile-info">
          <div class="primary"><span>${e.name ?? "Untitled app"}</span></div>
          <div class="secondary"><span>${uo(e.action)}</span></div>
        </div>
        <button
          class="icon-button"
          title="Move up"
          .disabled=${o === 0}
          @click=${() => this._moveTile(t, o, -1)}
        >
          <ha-icon icon="mdi:arrow-up"></ha-icon>
        </button>
        <button
          class="icon-button"
          title="Move down"
          .disabled=${o === i - 1}
          @click=${() => this._moveTile(t, o, 1)}
        >
          <ha-icon icon="mdi:arrow-down"></ha-icon>
        </button>
        <button
          class="icon-button"
          title=${n ? "Done" : "Edit"}
          @click=${() => {
      this._editing = n ? null : { path: t, index: o };
    }}
        >
          <ha-icon icon=${n ? "mdi:check" : "mdi:pencil"}></ha-icon>
        </button>
        <button class="icon-button danger" title="Remove" @click=${() => this._removeTile(t, o)}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </li>
    `;
  }
  _renderAppForm(t, e, o) {
    const i = mt(e.action), n = te.find((a) => a.value === i), s = Do(e.action);
    return d`
      <li class="form-host">
        <div class="form">
          <div class="fields">
            <label class="field">
              <span>Name</span>
              <input
                type="text"
                .value=${e.name ?? ""}
                @change=${(a) => this._updateTile(t, o, {
      name: a.target.value || void 0
    })}
              />
            </label>

            <!--
              HA's own picker, so icons are searchable and previewed the way
              they are everywhere else. It emits value-changed with the icon in
              event.detail.value, matching how HA's helper dialogs consume it.
            -->
            <ha-icon-picker
              .hass=${this.hass}
              .value=${e.icon ?? ""}
              label="Icon"
              @value-changed=${(a) => {
      const c = a.detail?.value;
      !c && e.icon && !e.icon.startsWith("mdi:") || this._updateTile(t, o, { icon: c || void 0 });
    }}
            ></ha-icon-picker>

            ${t !== "apps" ? d`
                  <ha-entity-picker
                    .hass=${this.hass}
                    .value=${e.entity ?? ""}
                    label="Lights up when this entity is on"
                    allow-custom-entity
                    @value-changed=${(a) => this._updateTile(t, o, {
      entity: a.detail?.value || void 0
    })}
                  ></ha-entity-picker>
                ` : h}

            <!-- Streaming logos are app suggestions; a section button is a
                 projector or a receiver, so they are only offered for apps. -->
            ${t === "apps" ? d`
                  <div class="chips">
                    ${pt.map(
      (a) => d`
                        <button
                          class="chip ${e.icon === `brand:${a}` ? "accent" : ""}"
                          title=${`Use the ${T[a].label} logo`}
                          @click=${() => this._updateTile(t, o, { icon: `brand:${a}` })}
                        >
                          ${T[a].label}
                        </button>
                      `
    )}
                  </div>
                ` : h}

            <label class="field">
              <span>Does what</span>
              <select
                .value=${i}
                @change=${(a) => this._setActionKind(t, o, a.target.value)}
              >
                ${te.map(
      (a) => d`
                    <option value=${a.value} ?selected=${a.value === i}>
                      ${a.label}
                    </option>
                  `
    )}
              </select>
            </label>

            ${i === "action" ? d`
                  <!--
                    HA's own interactions editor, the same control the button
                    overrides use. It carries a service picker, a target and
                    data, which the old free-text box could not — hence the
                    note telling people to go and edit YAML instead.
                  -->
                  <ha-form
                    .hass=${this.hass}
                    .data=${{ action: s }}
                    .schema=${zo}
                    .computeLabel=${() => "Action"}
                    @value-changed=${(a) => {
      a.stopPropagation();
      const c = a.detail?.value?.action;
      N(c) && this._updateTile(t, o, { action: c });
    }}
                  ></ha-form>
                ` : d`
                  <label class="field wide">
                    <span>${n.label}</span>
                    <input
                      type="text"
                      .value=${ee(e.action)}
                      @change=${(a) => this._setActionValue(t, o, a.target.value)}
                    />
                  </label>
                  <div class="hint">${n.hint}</div>
                `}
          </div>
        </div>
      </li>
    `;
  }
  /**
   * The app running on the TV right now.
   *
   * Nothing in the integration can enumerate what is installed on the TV, and
   * the card does not pretend otherwise. `app_id` reports whatever is on
   * screen, though — so opening an app and clicking here captures its real
   * package id, which is otherwise tedious to find.
   */
  _renderCurrentApp() {
    const t = this._config, e = pe(this.hass, t), o = e ? this.hass.states?.[e] : void 0, i = o?.attributes?.app_id, n = o?.attributes?.app_name;
    if (!i) return h;
    const s = t.apps.some(
      (a) => a.action.action === "app" && a.action.app_id === i
    );
    return d`
      <div class="section-head"><span class="grow">Playing right now</span></div>
      ${s ? d`<div class="hint">${n ?? i} is already in the list.</div>` : d`
            <div class="chips">
              <button
                class="chip accent"
                @click=${() => this._addTile("apps", {
      name: n ?? i,
      icon: No(n ?? i),
      action: { action: "app", app_id: i }
    })}
              >
                <ha-icon icon="mdi:plus"></ha-icon>${n ?? i}
              </button>
            </div>
            <div class="hint">
              Open an app on the TV and it appears here, which is the easiest way
              to capture its package id (${i}).
            </div>
          `}
    `;
  }
  render() {
    if (!this.hass || !this._config) return h;
    const t = this._config, e = t.apps;
    return d`
      <ha-form
        .hass=${this.hass}
        .data=${this._formData}
        .schema=${Mo(t)}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._formChanged}
      ></ha-form>

      <!--
        Apps get a hand-rolled panel rather than an ha-form expandable: the
        list, its ordering and the inline action editor cannot be expressed as
        a schema, and leaving them outside meant the settings that govern the
        list sat in a different section from the list itself.
      -->
      <ha-expansion-panel outlined>
        <ha-icon slot="leading-icon" icon="mdi:apps"></ha-icon>
        <div slot="header" role="heading" aria-level="3">Apps</div>

        <div class="content">
        <ha-form
          .hass=${this.hass}
          .data=${this._formData}
          .schema=${Co(t)}
          .computeLabel=${this._computeLabel}
          .computeHelper=${this._computeHelper}
          @value-changed=${this._formChanged}
        ></ha-form>

        ${t.show_apps ? d`
              <div class="section-head">
                <span class="grow">Apps</span>
                <span class="count">${e.length}</span>
              </div>

              ${this._renderTileList("apps", e, "No apps yet — add one below.")}

              <div class="section-head"><span class="grow">Add a known app</span></div>
              <div class="chips">
                ${pt.map(
      (o) => d`
                    <button
                      class="chip"
                      @click=${() => this._addTile("apps", {
        name: T[o].label,
        icon: `brand:${o}`,
        action: { action: "activity", activity: T[o].activity }
      })}
                    >
                      <ha-icon icon="mdi:plus"></ha-icon>${T[o].label}
                    </button>
                  `
    )}
              </div>

              ${this._renderCurrentApp()}

              <div class="form-actions">
                <button
                  class="control-button wide"
                  @click=${() => this._addTile("apps", {
      name: "New app",
      icon: "mdi:application",
      action: { action: "activity", activity: "" }
    })}
                >
                  <ha-icon icon="mdi:plus"></ha-icon><span>Custom app</span>
                </button>
              </div>
            ` : h}
        </div>
      </ha-expansion-panel>

      <ha-expansion-panel outlined>
        <ha-icon slot="leading-icon" icon="mdi:view-dashboard-outline"></ha-icon>
        <div slot="header" role="heading" aria-level="3">Sections</div>

        <div class="content">
          <div class="hint">
            Extra rows of buttons, drawn above the app launcher. Names show only
            when “Section labels” is on, under Advanced.
          </div>

          ${t.sections.map(
      (o, i) => d`
              <div class="section-block">
              <div class="section-head">
                <!--
                  A plain input, like every other field in this editor.
                  ha-textfield is not a component this frontend defines, so it
                  rendered as an inert unknown element and the name could not be
                  typed at all.
                -->
                <label class="field grow">
                  <span>Section name</span>
                  <input
                    type="text"
                    .value=${o.name ?? ""}
                    @change=${(n) => this._renameSection(i, n.target.value)}
                  />
                </label>
                <button
                  class="icon-button"
                  title="Remove section"
                  @click=${() => this._removeSection(i)}
                >
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>
              </div>

              ${this._renderTileList(i, o.buttons, "No buttons yet.")}

              <div class="form-actions">
                <button
                  class="control-button wide"
                  @click=${() => this._addTile(i, {
        name: "New button",
        icon: "mdi:power",
        action: { action: "service", service: "" }
      })}
                >
                  <ha-icon icon="mdi:plus"></ha-icon><span>Add button</span>
                </button>
              </div>
              </div>
            `
    )}

          <div class="form-actions add-section">
            <button class="control-button wide" @click=${() => this._addSection()}>
              <ha-icon icon="mdi:plus"></ha-icon><span>Add section</span>
            </button>
          </div>
        </div>
      </ha-expansion-panel>

      <ha-form
        .hass=${this.hass}
        .data=${this._formData}
        .schema=${Oo}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._formChanged}
      ></ha-form>
    `;
  }
};
x.ACTION_BUTTONS = [
  "power",
  "volume_up",
  "volume_down",
  "volume_mute"
];
x.styles = [
  Tt,
  ft`
      :host {
        display: block;
      }
      ha-form {
        display: block;
      }
      ul.list {
        padding: 0;
      }
      /*
       * Copied from HA's own ha-form-expandable so the Apps panel is
       * indistinguishable from the ones ha-form renders: the icon goes in the
       * leading-icon slot rather than inside the header (which is what was
       * indenting the label differently), the content gets its own 12px
       * padding, and the 24px gap matches ha-form's spacing between rows —
       * this panel sits between two ha-forms and would otherwise sit tighter
       * than its neighbours.
       */
      ha-expansion-panel {
        display: block;
        /*
         * The gap on BOTH sides, not just below. ha-form gives its rows
         * margin-bottom: 24px but explicitly skips the last one, so the space
         * above this panel is whatever it supplies itself — previously nothing,
         * plus an 8px margin of my own on ha-form, which is exactly why this
         * one section sat tighter than the rest.
         */
        margin: 24px 0;
        border-radius: var(--ha-border-radius-md);
        --ha-card-border-radius: var(--ha-border-radius-md);
        --expansion-panel-content-padding: 0;
      }
      ha-expansion-panel > ha-icon[slot="leading-icon"] {
        color: var(--secondary-text-color);
      }
      ha-expansion-panel .content {
        padding: 12px;
      }
      /*
       * A section owns its name, its buttons and its "Add button" control, so
       * they are grouped on a tinted surface. Without it "Add button" and "Add
       * section" sat flush against each other and read as one pair of controls
       * at the same level, which they are not.
       */
      ha-icon-picker,
      ha-entity-picker {
        display: block;
      }
      .section-block {
        padding: var(--ha-space-3, 12px);
        margin-bottom: var(--ha-space-3, 12px);
        border-radius: var(--radius-md);
        background-color: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.04);
      }
      .section-block .section-head {
        margin-top: 0;
      }
      .form-actions.add-section {
        margin-top: var(--ha-space-4, 16px);
      }
      ha-expansion-panel .content ha-form {
        display: block;
        margin-bottom: 0;
      }
      /* The kit sizes icon buttons for a card; an editor row is tighter. */
      .icon-button {
        width: 36px;
        height: 36px;
        --mdc-icon-size: 20px;
      }
      .chip {
        cursor: pointer;
        border: none;
        height: 26px;
        font-family: inherit;
      }
      .brand {
        display: block;
        width: 22px;
        height: 22px;
      }
      .brand svg {
        width: 100%;
        height: 100%;
        fill: currentColor;
      }
      .field select,
      .field input {
        width: 100%;
        box-sizing: border-box;
        height: 36px;
        padding: 0 var(--ha-space-2, 8px);
        border: none;
        border-radius: var(--radius-md);
        background-color: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.08);
        color: var(--primary-text-color);
        font: inherit;
        font-size: var(--ha-font-size-m, 14px);
      }
      .chips {
        padding: 0 var(--ha-space-3, 12px) var(--ha-space-2, 8px);
      }
      .hint {
        padding: 0 var(--ha-space-3, 12px) var(--ha-space-2, 8px);
      }
      /*
       * One control per row. The kit lays .fields out as a responsive
       * multi-column grid, which suits pairs of short inputs — but these are a
       * name, an icon picker, an entity picker and an action, and pairing them
       * up inside the narrow editor panel made the form read as a cramped
       * table with truncated values.
       */
      .fields {
        grid-template-columns: 1fr;
      }
      .fields > .chips,
      .fields > .hint {
        padding: 0;
      }
    `
];
at([
  V({ attribute: !1 })
], x.prototype, "hass", 2);
at([
  j()
], x.prototype, "_config", 2);
at([
  j()
], x.prototype, "_editing", 2);
x = at([
  $t("polr-android-tv-remote-card-editor")
], x);
const mt = (t) => t.action === "activity" || t.action === "app" || t.action === "key" ? t.action : "action", ee = (t) => {
  switch (t.action) {
    case "activity":
      return t.activity;
    case "app":
      return t.app_id;
    case "key":
      return t.key;
    default:
      return "";
  }
}, Do = (t) => t.action === "service" ? ht(t.service, t.data, t.target) : mt(t) === "action" ? t : void 0, oe = (t, e) => {
  switch (t) {
    case "activity":
      return { action: "activity", activity: e };
    case "app":
      return { action: "app", app_id: e };
    case "key":
      return { action: "key", key: e };
    case "action":
      return { action: "perform-action", perform_action: e };
  }
}, No = (t) => {
  const e = ue(t);
  return e ? `brand:${e}` : "mdi:application";
};
var Io = Object.defineProperty, Ho = Object.getOwnPropertyDescriptor, Z = (t, e, o, i) => {
  for (var n = i > 1 ? void 0 : i ? Ho(e, o) : e, s = t.length - 1, a; s >= 0; s--)
    (a = t[s]) && (n = (i ? a(e, o, n) : a(n)) || n);
  return i && n && Io(e, o, n), n;
};
const Lo = "2.1.1-beta.3", st = "polr-android-tv-remote-card";
let z = class extends C {
  constructor() {
    super(...arguments), this._text = "", this._sending = !1;
  }
  static getConfigElement() {
    return document.createElement(`${st}-editor`);
  }
  /**
   * Pick a real remote off the user's system.
   *
   * v1 used the old zero-argument signature and hardcoded `remote.atvremote`,
   * so adding the card from the picker produced a card pointing at an entity
   * that almost certainly did not exist.
   */
  static getStubConfig(t) {
    return { entity: Object.keys(t?.states ?? {}).find((o) => o.startsWith("remote.")) ?? "remote.android_tv", pad: "buttons" };
  }
  setConfig(t) {
    this._config = fe(t);
  }
  getCardSize() {
    const t = this._config;
    if (!t) return 6;
    let e = t.show_header ? 2 : 0;
    return t.show_nav && (e += t.pad === "buttons" ? 5 : 6), e += 1, t.show_transport && (e += 1), t.show_volume && (e += 1), t.show_text_input && (e += 1), t.show_apps && t.apps.length && (e += 2), Math.max(e, 3);
  }
  /**
   * Sections view sizing.
   *
   * `rows: "auto"` rather than a count, because this card's height genuinely
   * depends on its width: the touchpad and the button pad are sized by
   * aspect-ratio, so any fixed number of rows is wrong at every width but one.
   * Reporting a count over-allocated the grid slot and left a band of empty
   * space under the card. HA's own graph card does the same thing.
   *
   * min_rows still applies if a user turns auto height off in the layout editor.
   */
  getGridOptions() {
    return {
      columns: 12,
      min_columns: 6,
      rows: "auto",
      min_rows: this._config?.show_nav ? 6 : 2
    };
  }
  get _device() {
    if (!(!this.hass || !this._config))
      return io(this.hass, this._config);
  }
  /**
   * Run a card action, reporting failures instead of dropping them.
   *
   * Every interaction here is fire-and-forget, so without this a rejected
   * service call -- a typo'd override, an entity that has gone away -- becomes
   * an unhandled promise rejection and the console shows nothing useful.
   */
  _run(t) {
    t.catch((e) => {
      console.error("polr-android-tv-remote-card:", e);
    });
  }
  _press(t) {
    const e = this._device;
    !this.hass || !this._config || !e || this._run(ho(this.hass, this._config, e, t, this));
  }
  /**
   * Press options for a button, folding in any configured interactions.
   *
   * Hold and double-tap handlers are wired only when configured: a double-tap
   * handler forces every tap to wait out the double-tap window, and a hold
   * handler replaces hold-to-repeat, so neither should exist by default.
   */
  _pressOptions(t, e = {}) {
    const o = this._config, i = o.overrides[t], n = i?.hold_action, s = i?.double_tap_action, a = (c) => () => {
      this.hass && this._run(kt(this, this.hass, c, o.entity));
    };
    return {
      onPress: () => this._press(t),
      ...tt(n) ? { onHold: a(n) } : {},
      ...tt(s) ? { onDoubleTap: a(s) } : {},
      repeat: e.repeat && o.hold_repeat,
      haptics: o.haptics
    };
  }
  _navigate(t) {
    this._press(t.detail.direction);
  }
  _launch(t) {
    const e = this._device;
    !this.hass || !e || this._run(po(this.hass, e, t.action, this));
  }
  async _sendText() {
    const t = this._device, e = this._text.trim();
    if (!(!this.hass || !t || !e)) {
      this._sending = !0;
      try {
        await lo(this.hass, t, e), this._text = "";
      } finally {
        this._sending = !1;
      }
    }
  }
  /* ------------------------------------------------------------- header -- */
  _renderHeader(t) {
    const e = this._config, o = t.available ? t.on ? t.appName ?? "On" : "Off" : "Unavailable", i = t.on && t.available ? ue(t.appName) : void 0;
    return d`
      <div class="tile">
        <!-- Not interactive: the icon shows what is playing, and tapping it
             opened a more-info dialog nobody wanted from a remote. -->
        <div class="tile-icon">
          ${i ? d`<span class="brand-mark">${ut[i]}</span>` : d`<ha-icon icon="mdi:television"></ha-icon>`}
        </div>
        <div class="tile-info">
          <div class="primary"><span>${t.name}</span></div>
          <div class="secondary" aria-live="polite"><span>${o}</span></div>
        </div>
        ${e.show_power ? d`
              <button
                class="icon-button"
                type="button"
                aria-label=${t.on ? "Turn off" : "Turn on"}
                ${S(this._pressOptions("power"))}
              >
                <ha-icon icon="mdi:power"></ha-icon>
              </button>
            ` : h}
      </div>
      ${this._renderChips(t)}
    `;
  }
  /**
   * Volume state under the header -- only when there is no volume row.
   *
   * The row itself now carries the level and the mute state, so repeating them
   * here put one number in two places and cost a whole band of the card for a
   * single small pill. With the row switched off this is the only place left
   * that can say it, so it comes back.
   */
  _renderChips(t) {
    if (!t.on || !t.available || this._config.show_volume) return h;
    const e = [];
    return t.muted === !0 ? e.push(d`<span class="chip warn"><ha-icon icon="mdi:volume-off"></ha-icon>Muted</span>`) : Kt(t) && e.push(d`<span class="chip accent">${Math.round(t.volume * 100)}%</span>`), e.length ? d`<div class="tile" style="padding-top:0;min-height:0">
      <div class="chips">${e}</div>
    </div>` : h;
  }
  /* -------------------------------------------------------------- rows -- */
  _button(t, e, o, i = {}) {
    return d`
      <button
        class="control-button"
        type="button"
        aria-label=${o}
        title=${o}
        ${S(this._pressOptions(t, i))}
      >
        <ha-icon icon=${e}></ha-icon>
      </button>
    `;
  }
  _renderNavigationRow() {
    const t = this._config, e = t.show_power && !t.show_header;
    return d`
      <div class="features">
        ${e ? this._button("power", "mdi:power", "Power") : h}
        ${this._button("back", "mdi:arrow-u-left-top", "Back")}
        ${this._button("home", "mdi:home", "Home")}
        ${this._button("menu", "mdi:menu", "Menu")}
        ${this._config.show_favorite ? this._button("favorite", "mdi:star", "Favourite") : h}
      </div>
    `;
  }
  /**
   * Transport row, masked by what the player actually advertises.
   *
   * Buttons are shown when there is no paired player at all, because the key
   * codes work regardless — it is only the *player* route that needs the bit.
   */
  _renderTransport(t) {
    const e = t.playerId === null, o = e || I(t, y.PREVIOUS_TRACK), i = e || I(t, y.NEXT_TRACK), n = new Set(this._config.transport_buttons), s = [
      n.has("previous") && o ? this._button("previous", "mdi:skip-previous", "Previous") : h,
      n.has("rewind") ? this._button("rewind", "mdi:rewind", "Rewind", { repeat: !0 }) : h,
      n.has("play_pause") ? this._button(
        "play_pause",
        t.playing ? "mdi:pause" : "mdi:play",
        t.playing ? "Pause" : "Play"
      ) : h,
      n.has("fast_forward") ? this._button("fast_forward", "mdi:fast-forward", "Fast forward", { repeat: !0 }) : h,
      n.has("next") && i ? this._button("next", "mdi:skip-next", "Next") : h
    ];
    return d`<div class="features">${s}</div>`;
  }
  /**
   * Volume: one control, not three.
   *
   * The level used to be stated in three places -- a percentage chip under the
   * header, a mute icon in the middle button, and a bar floating under the row
   * -- so the one thing the user cares about was scattered across three bands
   * of the card. It is now a single control: the mute toggle *is* the readout,
   * filled to the current level, flanked by the two steps that change it.
   *
   * The buttons always work -- worst case they send key codes. The *state* is
   * another matter: androidtv_remote only reports a level when the TV itself
   * handles audio. Hand the sound to a soundbar over ARC and there is no level
   * and no mute flag, so the fill and the percentage would both be invented.
   * When that is the case the control is just its icon.
   */
  _renderVolume(t) {
    const e = t.on || t.volumeId !== t.playerId, o = e && t.muted === !0, i = e && t.muted !== void 0, n = e && Kt(t) ? Math.round(t.volume * 100) : void 0;
    return d`
      <div class="features">
        ${this._button("volume_down", "mdi:volume-minus", "Volume down", { repeat: !0 })}
        <button
          class="control-button volume-level ${o ? "muted" : ""}"
          type="button"
          aria-label=${o ? "Unmute" : "Mute"}
          aria-pressed=${i ? o ? "true" : "false" : "undefined"}
          ${S(this._pressOptions("volume_mute"))}
        >
          <!-- Read-only by design: androidtv_remote supports VOLUME_STEP but
               not VOLUME_SET, so there is nothing to drag to. -->
          ${n === void 0 ? h : d`<span class="level" style="width:${n}%"></span>`}
          <ha-icon icon=${o ? "mdi:volume-off" : "mdi:volume-high"}></ha-icon>
          ${o ? d`<span class="value">Muted</span>` : n === void 0 ? h : d`<span class="value">${n}%</span>`}
        </button>
        ${this._button("volume_up", "mdi:volume-plus", "Volume up", { repeat: !0 })}
      </div>
    `;
  }
  _renderTextInput() {
    return d`
      <div class="text-row">
        <input
          type="text"
          .value=${this._text}
          placeholder="Type on the TV…"
          aria-label="Text to send to the TV"
          @input=${(t) => {
      this._text = t.target.value;
    }}
          @keydown=${(t) => {
      t.key === "Enter" && this._run(this._sendText());
    }}
        />
        <button
          class="control-button accent"
          type="button"
          aria-label="Send text"
          ?disabled=${!this._text.trim() || this._sending}
          @click=${() => this._run(this._sendText())}
        >
          <ha-icon class=${this._sending ? "spin" : ""} icon="mdi:send"></ha-icon>
        </button>
      </div>
    `;
  }
  /* -------------------------------------------------------------- apps -- */
  _renderAppIcon(t) {
    const e = t.icon ?? "mdi:application";
    if (e.startsWith("brand:")) {
      const o = ut[e.slice(6)];
      if (o) return d`${o}`;
    }
    return e.startsWith("/") || e.startsWith("http") ? d`<img src=${e} alt="" />` : d`<ha-icon icon=${e}></ha-icon>`;
  }
  /**
   * One row of tiles.
   *
   * The app launcher is the built-in caller; user-defined sections are the same
   * grid with their own name. Labels gate on `show_section_labels`, so a custom
   * section is indistinguishable from a native one.
   */
  _renderSection(t, e, o, i) {
    const n = this._config;
    return t.length ? d`
      ${n.show_section_labels && e ? d`<div class="section-head">
            ${e}<span class="grow"></span><span class="count">${t.length}</span>
          </div>` : h}
      <div class="app-grid" style="--app-per-row: ${o}">
        ${Ge(
      t,
      (s, a) => `${i}:${a}:${s.icon ?? ""}`,
      (s) => {
        const a = this.hass ? ao(this.hass, s.entity) : !1;
        return d`
              <button
                class="app-tile ${a ? "active" : ""}"
                type="button"
                aria-label=${s.name ?? "Launch app"}
                title=${s.name ?? ""}
                aria-pressed=${s.entity ? String(a) : h}
                style=${s.color ? `--app-color:${s.color}` : ""}
                ${S({ onPress: () => this._launch(s), haptics: n.haptics })}
              >
                ${this._renderAppIcon(s)}
              </button>
            `;
      }
    )}
      </div>
    ` : h;
  }
  _renderApps() {
    const t = this._config;
    return this._renderSection(t.apps, "Apps", t.app_columns, "apps");
  }
  /** User-defined rows, in declared order, ahead of the app launcher. */
  _renderCustomSections() {
    const t = this._config;
    return t.sections.length ? d`
      ${t.sections.map(
      (e, o) => this._renderSection(
        e.buttons,
        e.name ?? "",
        e.columns ?? t.app_columns,
        `s${o}`
      )
    )}
    ` : h;
  }
  /* ------------------------------------------------------------ render -- */
  render() {
    if (!this.hass || !this._config) return h;
    const t = this._config, e = this._device;
    if (!e.found)
      return d`
        <ha-card>
          <div class="notice error">
            <ha-icon icon="mdi:alert-circle"></ha-icon>
            <span class="grow">Entity ${t.entity} not found.</span>
          </div>
        </ha-card>
      `;
    const o = Qe("media_player", e.on ? "on" : "off"), i = e.available;
    return d`
      <ha-card class=${t.show_header ? "" : "headerless"} style="--tile-color:${o}">
        ${t.show_header ? this._renderHeader(e) : h}
        ${t.show_header && e.playerId === null ? d`<div class="notice warn">
              <ha-icon icon="mdi:information-outline"></ha-icon>
              <span class="grow">
                This device has no media player, so power state, transport and
                volume level are unavailable.
              </span>
            </div>` : h}
        ${i ? e.on ? d`
                ${t.show_nav ? d`<polr-atv-nav-pad
                      .pad=${t.pad}
                      .repeat=${t.hold_repeat}
                      .haptics=${t.haptics}
                      @atv-nav=${this._navigate}
                    ></polr-atv-nav-pad>` : h}
                ${this._renderNavigationRow()}
                ${t.show_transport ? this._renderTransport(e) : h}
                ${t.show_volume ? this._renderVolume(e) : h}
                ${t.show_text_input ? this._renderTextInput() : h}
                ${this._renderCustomSections()}
                ${t.show_apps ? this._renderApps() : h}
              ` : d`
                <!-- No "the TV is off" line: the header secondary already says
                     Off, and the button says Turn on. -->
                <div class="features">
                  <button
                    class="control-button accent wide"
                    type="button"
                    ${S(this._pressOptions("power"))}
                  >
                    <ha-icon icon="mdi:power"></ha-icon><span>Turn on</span>
                  </button>
                </div>
                <!-- A soundbar does not go to sleep with the TV: when volume is
                     routed to one, the row is the only way to turn down music
                     playing through it, so it outlives the set's power state. -->
                ${t.show_volume && ro(t, e) ? this._renderVolume(e) : h}
                ${this._renderCustomSections()}
                ${t.show_apps ? this._renderApps() : h}
              ` : d`<div class="empty-state">This device is unavailable.</div>`}
      </ha-card>
    `;
  }
};
z.styles = [Tt, be];
Z([
  V({ attribute: !1 })
], z.prototype, "hass", 2);
Z([
  j()
], z.prototype, "_config", 2);
Z([
  j()
], z.prototype, "_text", 2);
Z([
  j()
], z.prototype, "_sending", 2);
z = Z([
  $t(st)
], z);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: st,
  name: "PoLR Android TV Remote",
  description: "A remote for the Android TV Remote integration, with live state and an app launcher.",
  preview: !0,
  documentationURL: "https://github.com/pathofleastresistor/polr-android-tv-remote-card"
});
console.info(`%c ${st} %c ${Lo} `, "background:#555;color:#fff", "background:#3f51b5;color:#fff");
export {
  Lo as CARD_VERSION,
  z as PolrAndroidTvRemoteCard
};
//# sourceMappingURL=polr-android-tv-remote-card.js.map
