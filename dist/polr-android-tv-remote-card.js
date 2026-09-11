/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Q = globalThis, fe = Q.ShadowRoot && (Q.ShadyCSS === void 0 || Q.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ve = Symbol(), Ce = /* @__PURE__ */ new WeakMap();
let nt = class {
  constructor(t, i, o) {
    if (this._$cssResult$ = !0, o !== ve) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (fe && t === void 0) {
      const o = i !== void 0 && i.length === 1;
      o && (t = Ce.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), o && Ce.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const xt = (e) => new nt(typeof e == "string" ? e : e + "", void 0, ve), _e = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((o, n, a) => o + ((s) => {
    if (s._$cssResult$ === !0) return s.cssText;
    if (typeof s == "number") return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + e[a + 1], e[0]);
  return new nt(i, e, ve);
}, At = (e, t) => {
  if (fe) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const o = document.createElement("style"), n = Q.litNonce;
    n !== void 0 && o.setAttribute("nonce", n), o.textContent = i.cssText, e.appendChild(o);
  }
}, Oe = fe ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const o of t.cssRules) i += o.cssText;
  return xt(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: kt, defineProperty: Tt, getOwnPropertyDescriptor: St, getOwnPropertyNames: Et, getOwnPropertySymbols: Pt, getPrototypeOf: Ct } = Object, ne = globalThis, Me = ne.trustedTypes, Ot = Me ? Me.emptyScript : "", Mt = ne.reactiveElementPolyfillSupport, F = (e, t) => e, ee = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Ot : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let i = e;
  switch (t) {
    case Boolean:
      i = e !== null;
      break;
    case Number:
      i = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(e);
      } catch {
        i = null;
      }
  }
  return i;
} }, ge = (e, t) => !kt(e, t), ze = { attribute: !0, type: String, converter: ee, reflect: !1, useDefault: !1, hasChanged: ge };
Symbol.metadata ??= Symbol("metadata"), ne.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let N = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = ze) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const o = Symbol(), n = this.getPropertyDescriptor(t, o, i);
      n !== void 0 && Tt(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, i, o) {
    const { get: n, set: a } = St(this.prototype, t) ?? { get() {
      return this[i];
    }, set(s) {
      this[i] = s;
    } };
    return { get: n, set(s) {
      const r = n?.call(this);
      a?.call(this, s), this.requestUpdate(t, r, o);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? ze;
  }
  static _$Ei() {
    if (this.hasOwnProperty(F("elementProperties"))) return;
    const t = Ct(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(F("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(F("properties"))) {
      const i = this.properties, o = [...Et(i), ...Pt(i)];
      for (const n of o) this.createProperty(n, i[n]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const i = litPropertyMetadata.get(t);
      if (i !== void 0) for (const [o, n] of i) this.elementProperties.set(o, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, o] of this.elementProperties) {
      const n = this._$Eu(i, o);
      n !== void 0 && this._$Eh.set(n, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const i = [];
    if (Array.isArray(t)) {
      const o = new Set(t.flat(1 / 0).reverse());
      for (const n of o) i.unshift(Oe(n));
    } else t !== void 0 && i.push(Oe(t));
    return i;
  }
  static _$Eu(t, i) {
    const o = i.attribute;
    return o === !1 ? void 0 : typeof o == "string" ? o : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const o of i.keys()) this.hasOwnProperty(o) && (t.set(o, this[o]), delete this[o]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return At(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, i, o) {
    this._$AK(t, o);
  }
  _$ET(t, i) {
    const o = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, o);
    if (n !== void 0 && o.reflect === !0) {
      const a = (o.converter?.toAttribute !== void 0 ? o.converter : ee).toAttribute(i, o.type);
      this._$Em = t, a == null ? this.removeAttribute(n) : this.setAttribute(n, a), this._$Em = null;
    }
  }
  _$AK(t, i) {
    const o = this.constructor, n = o._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const a = o.getPropertyOptions(n), s = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : ee;
      this._$Em = n;
      const r = s.fromAttribute(i, a.type);
      this[n] = r ?? this._$Ej?.get(n) ?? r, this._$Em = null;
    }
  }
  requestUpdate(t, i, o, n = !1, a) {
    if (t !== void 0) {
      const s = this.constructor;
      if (n === !1 && (a = this[t]), o ??= s.getPropertyOptions(t), !((o.hasChanged ?? ge)(a, i) || o.useDefault && o.reflect && a === this._$Ej?.get(t) && !this.hasAttribute(s._$Eu(t, o)))) return;
      this.C(t, i, o);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: o, reflect: n, wrapped: a }, s) {
    o && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, s ?? i ?? this[t]), a !== !0 || s !== void 0) || (this._$AL.has(t) || (this.hasUpdated || o || (i = void 0), this._$AL.set(t, i)), n === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [n, a] of this._$Ep) this[n] = a;
        this._$Ep = void 0;
      }
      const o = this.constructor.elementProperties;
      if (o.size > 0) for (const [n, a] of o) {
        const { wrapped: s } = a, r = this[n];
        s !== !0 || this._$AL.has(n) || r === void 0 || this.C(n, void 0, a, r);
      }
    }
    let t = !1;
    const i = this._$AL;
    try {
      t = this.shouldUpdate(i), t ? (this.willUpdate(i), this._$EO?.forEach((o) => o.hostUpdate?.()), this.update(i)) : this._$EM();
    } catch (o) {
      throw t = !1, this._$EM(), o;
    }
    t && this._$AE(i);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((i) => i.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((i) => this._$ET(i, this[i])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
N.elementStyles = [], N.shadowRootOptions = { mode: "open" }, N[F("elementProperties")] = /* @__PURE__ */ new Map(), N[F("finalized")] = /* @__PURE__ */ new Map(), Mt?.({ ReactiveElement: N }), (ne.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const be = globalThis, Le = (e) => e, te = be.trustedTypes, Re = te ? te.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, at = "$lit$", S = `lit$${Math.random().toFixed(9).slice(2)}$`, st = "?" + S, zt = `<${st}>`, L = document, q = () => L.createComment(""), X = (e) => e === null || typeof e != "object" && typeof e != "function", ye = Array.isArray, Lt = (e) => ye(e) || typeof e?.[Symbol.iterator] == "function", ce = `[ 	
\f\r]`, K = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, He = /-->/g, De = />/g, P = RegExp(`>|${ce}(?:([^\\s"'>=/]+)(${ce}*=${ce}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ne = /'/g, Ue = /"/g, rt = /^(?:script|style|textarea|title)$/i, ct = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), c = ct(1), Rt = ct(2), A = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), Ie = /* @__PURE__ */ new WeakMap(), M = L.createTreeWalker(L, 129);
function lt(e, t) {
  if (!ye(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Re !== void 0 ? Re.createHTML(t) : t;
}
const Ht = (e, t) => {
  const i = e.length - 1, o = [];
  let n, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", s = K;
  for (let r = 0; r < i; r++) {
    const l = e[r];
    let m, v, h = -1, u = 0;
    for (; u < l.length && (s.lastIndex = u, v = s.exec(l), v !== null); ) u = s.lastIndex, s === K ? v[1] === "!--" ? s = He : v[1] !== void 0 ? s = De : v[2] !== void 0 ? (rt.test(v[2]) && (n = RegExp("</" + v[2], "g")), s = P) : v[3] !== void 0 && (s = P) : s === P ? v[0] === ">" ? (s = n ?? K, h = -1) : v[1] === void 0 ? h = -2 : (h = s.lastIndex - v[2].length, m = v[1], s = v[3] === void 0 ? P : v[3] === '"' ? Ue : Ne) : s === Ue || s === Ne ? s = P : s === He || s === De ? s = K : (s = P, n = void 0);
    const f = s === P && e[r + 1].startsWith("/>") ? " " : "";
    a += s === K ? l + zt : h >= 0 ? (o.push(m), l.slice(0, h) + at + l.slice(h) + S + f) : l + S + (h === -2 ? r : f);
  }
  return [lt(e, a + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), o];
};
class Z {
  constructor({ strings: t, _$litType$: i }, o) {
    let n;
    this.parts = [];
    let a = 0, s = 0;
    const r = t.length - 1, l = this.parts, [m, v] = Ht(t, i);
    if (this.el = Z.createElement(m, o), M.currentNode = this.el.content, i === 2 || i === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (n = M.nextNode()) !== null && l.length < r; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const h of n.getAttributeNames()) if (h.endsWith(at)) {
          const u = v[s++], f = n.getAttribute(h).split(S), p = /([.?@])?(.*)/.exec(u);
          l.push({ type: 1, index: a, name: p[2], strings: f, ctor: p[1] === "." ? Nt : p[1] === "?" ? Ut : p[1] === "@" ? It : ae }), n.removeAttribute(h);
        } else h.startsWith(S) && (l.push({ type: 6, index: a }), n.removeAttribute(h));
        if (rt.test(n.tagName)) {
          const h = n.textContent.split(S), u = h.length - 1;
          if (u > 0) {
            n.textContent = te ? te.emptyScript : "";
            for (let f = 0; f < u; f++) n.append(h[f], q()), M.nextNode(), l.push({ type: 2, index: ++a });
            n.append(h[u], q());
          }
        }
      } else if (n.nodeType === 8) if (n.data === st) l.push({ type: 2, index: a });
      else {
        let h = -1;
        for (; (h = n.data.indexOf(S, h + 1)) !== -1; ) l.push({ type: 7, index: a }), h += S.length - 1;
      }
      a++;
    }
  }
  static createElement(t, i) {
    const o = L.createElement("template");
    return o.innerHTML = t, o;
  }
}
function V(e, t, i = e, o) {
  if (t === A) return t;
  let n = o !== void 0 ? i._$Co?.[o] : i._$Cl;
  const a = X(t) ? void 0 : t._$litDirective$;
  return n?.constructor !== a && (n?._$AO?.(!1), a === void 0 ? n = void 0 : (n = new a(e), n._$AT(e, i, o)), o !== void 0 ? (i._$Co ??= [])[o] = n : i._$Cl = n), n !== void 0 && (t = V(e, n._$AS(e, t.values), n, o)), t;
}
class Dt {
  constructor(t, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: i }, parts: o } = this._$AD, n = (t?.creationScope ?? L).importNode(i, !0);
    M.currentNode = n;
    let a = M.nextNode(), s = 0, r = 0, l = o[0];
    for (; l !== void 0; ) {
      if (s === l.index) {
        let m;
        l.type === 2 ? m = new B(a, a.nextSibling, this, t) : l.type === 1 ? m = new l.ctor(a, l.name, l.strings, this, t) : l.type === 6 && (m = new Vt(a, this, t)), this._$AV.push(m), l = o[++r];
      }
      s !== l?.index && (a = M.nextNode(), s++);
    }
    return M.currentNode = L, n;
  }
  p(t) {
    let i = 0;
    for (const o of this._$AV) o !== void 0 && (o.strings !== void 0 ? (o._$AI(t, o, i), i += o.strings.length - 2) : o._$AI(t[i])), i++;
  }
}
class B {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, i, o, n) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = o, this.options = n, this._$Cv = n?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && t?.nodeType === 11 && (t = i.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, i = this) {
    t = V(this, t, i), X(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== A && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Lt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && X(this._$AH) ? this._$AA.nextSibling.data = t : this.T(L.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: i, _$litType$: o } = t, n = typeof o == "number" ? this._$AC(t) : (o.el === void 0 && (o.el = Z.createElement(lt(o.h, o.h[0]), this.options)), o);
    if (this._$AH?._$AD === n) this._$AH.p(i);
    else {
      const a = new Dt(n, this), s = a.u(this.options);
      a.p(i), this.T(s), this._$AH = a;
    }
  }
  _$AC(t) {
    let i = Ie.get(t.strings);
    return i === void 0 && Ie.set(t.strings, i = new Z(t)), i;
  }
  k(t) {
    ye(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let o, n = 0;
    for (const a of t) n === i.length ? i.push(o = new B(this.O(q()), this.O(q()), this, this.options)) : o = i[n], o._$AI(a), n++;
    n < i.length && (this._$AR(o && o._$AB.nextSibling, n), i.length = n);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); t !== this._$AB; ) {
      const o = Le(t).nextSibling;
      Le(t).remove(), t = o;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class ae {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, o, n, a) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = i, this._$AM = n, this.options = a, o.length > 2 || o[0] !== "" || o[1] !== "" ? (this._$AH = Array(o.length - 1).fill(new String()), this.strings = o) : this._$AH = d;
  }
  _$AI(t, i = this, o, n) {
    const a = this.strings;
    let s = !1;
    if (a === void 0) t = V(this, t, i, 0), s = !X(t) || t !== this._$AH && t !== A, s && (this._$AH = t);
    else {
      const r = t;
      let l, m;
      for (t = a[0], l = 0; l < a.length - 1; l++) m = V(this, r[o + l], i, l), m === A && (m = this._$AH[l]), s ||= !X(m) || m !== this._$AH[l], m === d ? t = d : t !== d && (t += (m ?? "") + a[l + 1]), this._$AH[l] = m;
    }
    s && !n && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Nt extends ae {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class Ut extends ae {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class It extends ae {
  constructor(t, i, o, n, a) {
    super(t, i, o, n, a), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = V(this, t, i, 0) ?? d) === A) return;
    const o = this._$AH, n = t === d && o !== d || t.capture !== o.capture || t.once !== o.once || t.passive !== o.passive, a = t !== d && (o === d || n);
    n && this.element.removeEventListener(this.name, this, o), a && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Vt {
  constructor(t, i, o) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = o;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    V(this, t);
  }
}
const Bt = { I: B }, jt = be.litHtmlPolyfillSupport;
jt?.(Z, B), (be.litHtmlVersions ??= []).push("3.3.3");
const Kt = (e, t, i) => {
  const o = i?.renderBefore ?? t;
  let n = o._$litPart$;
  if (n === void 0) {
    const a = i?.renderBefore ?? null;
    o._$litPart$ = n = new B(t.insertBefore(q(), a), a, void 0, i ?? {});
  }
  return n._$AI(e), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const we = globalThis;
let z = class extends N {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Kt(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return A;
  }
};
z._$litElement$ = !0, z.finalized = !0, we.litElementHydrateSupport?.({ LitElement: z });
const Wt = we.litElementPolyfillSupport;
Wt?.({ LitElement: z });
(we.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $e = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ft = { attribute: !0, type: String, converter: ee, reflect: !1, hasChanged: ge }, Yt = (e = Ft, t, i) => {
  const { kind: o, metadata: n } = i;
  let a = globalThis.litPropertyMetadata.get(n);
  if (a === void 0 && globalThis.litPropertyMetadata.set(n, a = /* @__PURE__ */ new Map()), o === "setter" && ((e = Object.create(e)).wrapped = !0), a.set(i.name, e), o === "accessor") {
    const { name: s } = i;
    return { set(r) {
      const l = t.get.call(this);
      t.set.call(this, r), this.requestUpdate(s, l, e, !0, r);
    }, init(r) {
      return r !== void 0 && this.C(s, void 0, e, r), r;
    } };
  }
  if (o === "setter") {
    const { name: s } = i;
    return function(r) {
      const l = this[s];
      t.call(this, r), this.requestUpdate(s, l, e, !0, r);
    };
  }
  throw Error("Unsupported decorator location: " + o);
};
function j(e) {
  return (t, i) => typeof i == "object" ? Yt(e, t, i) : ((o, n, a) => {
    const s = n.hasOwnProperty(a);
    return n.constructor.createProperty(a, o), s ? Object.getOwnPropertyDescriptor(n, a) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function R(e) {
  return j({ ...e, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const qt = (e, t, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, i), i);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function dt(e, t) {
  return (i, o, n) => {
    const a = (s) => s.renderRoot?.querySelector(e) ?? null;
    return qt(i, o, { get() {
      return a(this);
    } });
  };
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const xe = { CHILD: 2, ELEMENT: 6 }, ht = (e) => (...t) => ({ _$litDirective$: e, values: t });
let pt = class {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, i, o) {
    this._$Ct = t, this._$AM = i, this._$Ci = o;
  }
  _$AS(t, i) {
    return this.update(t, i);
  }
  update(t, i) {
    return this.render(...i);
  }
};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { I: Xt } = Bt, Ve = (e) => e, Zt = (e) => e.strings === void 0, Be = () => document.createComment(""), W = (e, t, i) => {
  const o = e._$AA.parentNode, n = t === void 0 ? e._$AB : t._$AA;
  if (i === void 0) {
    const a = o.insertBefore(Be(), n), s = o.insertBefore(Be(), n);
    i = new Xt(a, s, e, e.options);
  } else {
    const a = i._$AB.nextSibling, s = i._$AM, r = s !== e;
    if (r) {
      let l;
      i._$AQ?.(e), i._$AM = e, i._$AP !== void 0 && (l = e._$AU) !== s._$AU && i._$AP(l);
    }
    if (a !== n || r) {
      let l = i._$AA;
      for (; l !== a; ) {
        const m = Ve(l).nextSibling;
        Ve(o).insertBefore(l, n), l = m;
      }
    }
  }
  return i;
}, C = (e, t, i = e) => (e._$AI(t, i), e), Gt = {}, Jt = (e, t = Gt) => e._$AH = t, Qt = (e) => e._$AH, le = (e) => {
  e._$AR(), e._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const je = (e, t, i) => {
  const o = /* @__PURE__ */ new Map();
  for (let n = t; n <= i; n++) o.set(e[n], n);
  return o;
}, ei = ht(class extends pt {
  constructor(e) {
    if (super(e), e.type !== xe.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(e, t, i) {
    let o;
    i === void 0 ? i = t : t !== void 0 && (o = t);
    const n = [], a = [];
    let s = 0;
    for (const r of e) n[s] = o ? o(r, s) : s, a[s] = i(r, s), s++;
    return { values: a, keys: n };
  }
  render(e, t, i) {
    return this.dt(e, t, i).values;
  }
  update(e, [t, i, o]) {
    const n = Qt(e), { values: a, keys: s } = this.dt(t, i, o);
    if (!Array.isArray(n)) return this.ut = s, a;
    const r = this.ut ??= [], l = [];
    let m, v, h = 0, u = n.length - 1, f = 0, p = a.length - 1;
    for (; h <= u && f <= p; ) if (n[h] === null) h++;
    else if (n[u] === null) u--;
    else if (r[h] === s[f]) l[f] = C(n[h], a[f]), h++, f++;
    else if (r[u] === s[p]) l[p] = C(n[u], a[p]), u--, p--;
    else if (r[h] === s[p]) l[p] = C(n[h], a[p]), W(e, l[p + 1], n[h]), h++, p--;
    else if (r[u] === s[f]) l[f] = C(n[u], a[f]), W(e, n[h], n[u]), u--, f++;
    else if (m === void 0 && (m = je(s, f, p), v = je(r, h, u)), m.has(r[h])) if (m.has(r[u])) {
      const _ = v.get(s[f]), $ = _ !== void 0 ? n[_] : null;
      if ($ === null) {
        const Pe = W(e, n[h]);
        C(Pe, a[f]), l[f] = Pe;
      } else l[f] = C($, a[f]), W(e, n[h], $), n[_] = null;
      f++;
    } else le(n[u]), u--;
    else le(n[h]), h++;
    for (; f <= p; ) {
      const _ = W(e, l[p + 1]);
      C(_, a[f]), l[f++] = _;
    }
    for (; h <= u; ) {
      const _ = n[h++];
      _ !== null && le(_);
    }
    return this.ut = s, Jt(e, l), A;
  }
}), se = (e, t, i) => {
  e.dispatchEvent(
    new CustomEvent(t, { detail: i, bubbles: !0, composed: !0 })
  );
}, ti = (e, t) => se(e, "hass-more-info", { entityId: t }), ii = (e, t, i = "var(--state-inactive-color, #9e9e9e)") => t === "unavailable" || t === "unknown" ? "var(--state-unavailable-color, var(--disabled-color))" : `var(--state-${e}-${t}-color, var(--state-icon-color, ${i}))`, oi = (e) => typeof e == "object" && e !== null && !Array.isArray(e), U = (e) => oi(e) && typeof e.action == "string", ie = (e) => e !== void 0 && e.action !== "none", Ae = (e) => {
  const t = (e ?? "").split(".");
  if (t.length !== 2) return null;
  const [i, o] = t;
  return !i || !o ? null : [i, o];
}, he = (e, t, i) => ({
  action: "perform-action",
  perform_action: e,
  ...t ? { data: t } : {},
  ...i ? { target: i } : {}
}), ke = (e, t, i, o) => {
  switch (i.action) {
    case "none":
      return Promise.resolve();
    case "more-info": {
      const n = i.entity ?? o;
      return n && e && ti(e, n), Promise.resolve();
    }
    case "toggle": {
      const n = o;
      return n ? t.callService("homeassistant", "toggle", { entity_id: n }) : Promise.resolve();
    }
    case "navigate":
      return history.pushState(null, "", i.navigation_path), window.dispatchEvent(
        new CustomEvent("location-changed", { detail: { replace: !1 } })
      ), Promise.resolve();
    case "url":
      return window.open(i.url_path, "_blank", "noreferrer"), Promise.resolve();
    case "perform-action":
    case "call-service": {
      const n = i.action === "perform-action" ? i.perform_action : i.service, a = Ae(n);
      if (!a)
        return Promise.reject(
          new Error(`polr-android-tv-remote-card: invalid action "${n}"`)
        );
      const [s, r] = a, l = i.action === "perform-action" ? i.data : i.data ?? i.service_data;
      return t.callService(s, r, l ?? {}, i.target);
    }
  }
}, ni = ["buttons", "dpad", "touchpad"], ai = {
  button: "press",
  input_button: "press",
  scene: "turn_on",
  script: "turn_on",
  automation: "trigger"
}, si = (e) => {
  const t = Ae(e);
  if (!t) return null;
  const i = ai[t[0]];
  return i ? { service: `${t[0]}.${i}`, target: { entity_id: e } } : null;
}, ut = [
  "pad",
  "navigation",
  "transport",
  "volume",
  "text",
  "apps"
], g = {
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
}, E = {
  disneyplus: { label: "Disney+", activity: "https://www.disneyplus.com" },
  hbomax: { label: "HBO Max", activity: "https://play.hbomax.com" },
  hulu: { label: "Hulu", activity: "HULU" },
  netflix: { label: "Netflix", activity: "https://www.netflix.com/title" },
  prime: { label: "Prime Video", activity: "https://app.primevideo.com" },
  youtube: { label: "YouTube", activity: "https://www.youtube.com" }
}, pe = Object.keys(E), ri = {
  "com.netflix.ninja": "Netflix",
  "com.disney.disneyplus": "Disney+",
  "com.hulu.plus": "Hulu",
  "com.amazon.amazonvideo.livingroom": "Prime Video",
  "com.hbo.hbonow": "Max",
  "com.wbd.stream": "Max",
  "com.peacocktv.peacockandroid": "Peacock",
  "com.google.android.youtube.tv": "YouTube",
  "com.google.android.youtube.tvunplugged": "YouTube TV",
  "com.google.android.youtube.tvmusic": "YouTube Music",
  "com.apple.atve.androidtv.appletv": "Apple TV",
  "com.plexapp.android": "Plex",
  "com.spotify.tv.android": "Spotify",
  "tv.twitch.android.app": "Twitch",
  "com.espn.score_center": "ESPN",
  "com.cbs.ott": "Paramount+",
  "com.nba.game": "NBA",
  "com.google.android.tv.remote.service": "Home screen",
  // Both launchers Google ships, because "on the home screen" is a state
  // people look at the header to learn.
  "com.google.android.tvlauncher": "Home screen",
  "com.google.android.apps.tv.launcherx": "Home screen"
}, ci = (e) => /^[a-z][\w]*(\.[\w]+)+$/.test(e), li = (e) => {
  if (!e || !ci(e)) return e;
  const t = ri[e];
  if (t) return t;
  const i = Te(e);
  return i ? E[i].label : e;
}, Te = (e) => {
  if (!e) return;
  const t = e.toLowerCase().replace(/[^a-z]/g, "");
  if (t)
    return pe.find((i) => t.includes(i) || i.includes(t));
}, mt = {
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
}, ft = {
  showRemote: "show_nav",
  showApps: "show_apps",
  showVolume: "show_volume",
  showMedia: "show_transport",
  showURLSearch: "show_text_input"
}, di = {
  default: "buttons",
  touch: "touchpad",
  dpad: "dpad"
}, b = (e) => typeof e == "object" && e !== null && !Array.isArray(e), vt = (e) => b(e) && typeof e.service == "string", Ke = (e, t) => {
  if (typeof e == "string") {
    const i = si(e);
    if (i)
      return { tap_action: he(i.service, void 0, i.target) };
    y(
      `override "${t}" points at ${e}, which cannot simply be pressed. Use an action config instead.`
    );
    return;
  }
  if (!b(e)) {
    e !== void 0 && y(`override "${t}" is not an entity id or an action config`);
    return;
  }
  if (U(e.tap_action) || U(e.hold_action) || U(e.double_tap_action)) {
    const i = {};
    for (const o of ["tap_action", "hold_action", "double_tap_action"]) {
      const n = e[o];
      U(n) && (i[o] = n);
    }
    return i;
  }
  if (vt(e))
    return {
      tap_action: he(
        e.service,
        b(e.data) ? e.data : void 0,
        b(e.target) ? e.target : void 0
      )
    };
  y(`override "${t}" is not an entity id or an action config`);
};
let We = /* @__PURE__ */ new Set();
const y = (e) => {
  We.has(e) || (We.add(e), console.warn(`polr-android-tv-remote-card: ${e}`));
}, _t = (e) => {
  if (!b(e))
    return y(`section is not an object and was skipped: ${JSON.stringify(e)}`), null;
  const t = (Array.isArray(e.buttons) ? e.buttons : []).map(gt).filter((i) => i !== null);
  return {
    ...typeof e.name == "string" ? { name: e.name } : {},
    ...typeof e.columns == "number" && e.columns > 0 ? { columns: e.columns } : {},
    buttons: t
  };
}, Fe = (e) => typeof e == "string" && ut.includes(e), hi = (e) => {
  if (Fe(e)) return { type: e };
  if (!b(e))
    return y(`layout entry is not a block and was skipped: ${JSON.stringify(e)}`), null;
  const t = e.hidden === !0 ? { hidden: !0 } : {}, i = [e.name, e.title].find(
    (a) => typeof a == "string" && a !== ""
  ), o = i ? { name: i } : {}, n = e.type;
  if (Fe(n)) return { type: n, ...t, ...o };
  if (n === "section" || Array.isArray(e.buttons)) {
    const a = _t(e);
    return a ? { type: "section", ...t, ...a, ...o } : null;
  }
  return y(`unknown layout block ${JSON.stringify(e)} was skipped`), null;
}, pi = (e, t, i) => {
  const o = Array.isArray(e.layout) ? e.layout.map(hi).filter((r) => r !== null) : [
    { type: "pad", ...i.pad ? {} : { hidden: !0 } },
    { type: "navigation" },
    { type: "transport", ...i.transport ? {} : { hidden: !0 } },
    { type: "volume", ...i.volume ? {} : { hidden: !0 } },
    { type: "text", ...i.text ? {} : { hidden: !0 } },
    ...t.map((r) => ({ type: "section", ...r })),
    { type: "apps", ...i.apps ? {} : { hidden: !0 } }
  ], n = new Set(o.map((r) => r.type)), a = ut.filter((r) => !n.has(r)).map(
    (r) => ({ type: r, hidden: !0 })
  ), s = /* @__PURE__ */ new Set();
  return [...o, ...a].filter((r) => r.type === "section" ? !0 : s.has(r.type) ? (y(`layout lists ${r.type} more than once; only the first is drawn`), !1) : (s.add(r.type), !0));
}, gt = (e) => {
  if (typeof e == "string") {
    const a = E[e];
    return a ? {
      name: a.label,
      icon: `brand:${e}`,
      action: { action: "activity", activity: a.activity }
    } : (y(
      `unknown app "${e}" — treating it as an activity. Use an object with an icon and action instead.`
    ), {
      name: e,
      icon: "mdi:application",
      action: { action: "activity", activity: e }
    });
  }
  if (!b(e)) return null;
  if (b(e.action))
    return e;
  const t = typeof e.icon == "string" ? e.icon : void 0, i = typeof e.name == "string" ? e.name : void 0, o = typeof e.color == "string" ? e.color : void 0, n = typeof e.entity == "string" ? e.entity : void 0;
  return vt(e) ? {
    ...i ? { name: i } : {},
    ...t ? { icon: t } : {},
    ...o ? { color: o } : {},
    ...n ? { entity: n } : {},
    action: {
      action: "service",
      service: e.service,
      ...b(e.data) ? { data: e.data } : {},
      ...b(e.target) ? { target: e.target } : {}
    }
  } : typeof e.url == "string" ? {
    ...i ? { name: i } : {},
    ...t ? { icon: t } : {},
    ...o ? { color: o } : {},
    ...n ? { entity: n } : {},
    action: { action: "activity", activity: e.url }
  } : (y(`app entry has no action, url or service and was skipped: ${JSON.stringify(e)}`), null);
}, bt = (e) => {
  if (!b(e))
    throw new Error("polr-android-tv-remote-card: invalid configuration");
  const t = typeof e.entity == "string" ? e.entity : typeof e.entity_id == "string" ? e.entity_id : void 0;
  if (!t)
    throw new Error("polr-android-tv-remote-card: 'entity' is required");
  const i = typeof e.remote == "string" ? di[e.remote] : void 0;
  typeof e.remote == "string" && !i && y(`unknown remote style "${e.remote}" — falling back to ${g.pad}`);
  const o = ni.includes(e.pad) ? e.pad : i ?? g.pad, n = typeof e.volume == "boolean" ? e.volume : void 0, a = {};
  if (b(e.overrides))
    for (const [p, _] of Object.entries(e.overrides)) {
      const $ = Ke(_, p);
      $ && (a[p] = $);
    }
  for (const [p, _] of Object.entries(mt)) {
    if (a[_]) continue;
    const $ = Ke(e[p], p);
    $ && (a[_] = $);
  }
  const s = {};
  for (const [p, _] of Object.entries(ft))
    typeof e[p] == "boolean" && (s[_] = e[p]);
  const r = Array.isArray(e.transport_buttons) ? e.transport_buttons : Array.isArray(e.media_controls) ? e.media_controls : void 0, l = r ? r.filter(
    (p) => typeof p == "string" && g.transport_buttons.includes(p)
  ) : g.transport_buttons, m = (Array.isArray(e.sections) ? e.sections : []).map(_t).filter((p) => p !== null), h = (Array.isArray(e.apps) ? e.apps : []).map(gt).filter((p) => p !== null), u = (p, _) => p === void 0 ? _ : p, f = {
    ...e,
    type: e.type,
    entity: t,
    ...typeof e.volume_entity == "string" ? { volume_entity: e.volume_entity } : {},
    ...typeof e.name == "string" ? { name: e.name } : {},
    show_header: u(e.show_header, g.show_header),
    show_power: u(e.show_power, g.show_power),
    pad: o,
    transport_buttons: l,
    show_section_labels: u(e.show_section_labels, g.show_section_labels),
    // v1 always drew a favourite button on the default pad, and threw when it
    // had no override to call. Draw it only when it does something.
    show_favorite: a.favorite !== void 0,
    apps: h,
    layout: pi(e, m, {
      pad: u(e.show_nav, s.show_nav ?? g.show_nav),
      transport: u(
        e.show_transport,
        s.show_transport ?? g.show_transport
      ),
      volume: u(
        e.show_volume,
        s.show_volume ?? n ?? g.show_volume
      ),
      text: u(e.show_text_input, s.show_text_input ?? g.show_text_input),
      apps: u(e.show_apps, s.show_apps ?? g.show_apps)
    }),
    // "auto" was the v2-beta spelling, before the tiles became fixed-width.
    app_columns: typeof e.app_columns == "number" && e.app_columns > 0 ? e.app_columns : g.app_columns,
    hold_repeat: u(e.hold_repeat, g.hold_repeat),
    haptics: u(e.haptics, g.haptics),
    overrides: a
  };
  for (const p of ui) delete f[p];
  return f;
}, ui = [
  "show_nav",
  "show_transport",
  "show_volume",
  "show_text_input",
  "show_apps",
  "sections"
], mi = (e) => {
  const t = /* @__PURE__ */ new Set([
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
    ...Object.keys(ft),
    ...Object.keys(mt)
  ]), i = {};
  for (const [o, n] of Object.entries(e))
    t.has(o) || (i[o] = n);
  return i;
}, x = {
  PAUSE: 1,
  VOLUME_MUTE: 8,
  PREVIOUS_TRACK: 16,
  NEXT_TRACK: 32,
  TURN_ON: 128,
  TURN_OFF: 256,
  VOLUME_STEP: 1024
}, fi = {
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
}, vi = "text:", yt = (e, t) => {
  const i = e.entities?.[t.entity]?.device_id;
  if (!i) return null;
  for (const o of Object.values(e.entities ?? {}))
    if (o.device_id === i && o.entity_id.startsWith("media_player."))
      return o.entity_id;
  return null;
}, de = (e) => e === void 0 || e.state === "unavailable" || e.state === "unknown", _i = (e, t) => {
  const i = e.states?.[t.entity], o = yt(e, t), n = o ? e.states?.[o] : void 0, a = n?.attributes ?? {}, s = i?.attributes ?? {}, r = t.volume_entity ?? o, m = (t.volume_entity && t.volume_entity !== o ? e.states?.[t.volume_entity] : n)?.attributes ?? {}, v = n && !de(n) ? n.state !== "off" : i?.state === "on";
  return {
    remoteId: t.entity,
    playerId: o,
    remote: i,
    player: n,
    found: i !== void 0,
    available: !de(i) && (n === void 0 || !de(n)),
    on: v,
    name: t.name ?? s.friendly_name ?? t.entity,
    // app_name is all the integration provides. It never sets media_title or
    // entity_picture, so there is no now-playing text or artwork to read -- and
    // it is a package id unless the app was named in the integration's options,
    // which appLabel is what stands between the header and "com.netflix.ninja".
    appName: li(
      a.app_name ?? s.current_activity
    ),
    appId: a.app_id,
    playing: n?.state === "playing",
    features: a.supported_features ?? 0,
    volumeId: r,
    volumeFeatures: m.supported_features ?? 0,
    volume: typeof m.volume_level == "number" ? m.volume_level : void 0,
    muted: typeof m.is_volume_muted == "boolean" ? m.is_volume_muted : void 0
  };
}, gi = /* @__PURE__ */ new Set([
  "off",
  "unavailable",
  "unknown",
  "idle",
  "standby",
  "none"
]), bi = (e, t) => {
  if (!t) return !1;
  const i = e.states?.[t]?.state;
  return i === void 0 ? !1 : !gi.has(i.toLowerCase());
}, yi = (e, t) => {
  if (!t.entity) return !1;
  if (t.active_when === void 0) return bi(e, t.entity);
  const i = e.states?.[t.entity];
  if (!i) return !1;
  const o = t.attribute ? i.attributes?.[t.attribute] : i.state;
  if (typeof o != "string") return !1;
  const n = Array.isArray(t.active_when) ? t.active_when : [t.active_when], a = o.trim().toLowerCase();
  return n.some((s) => s.trim().toLowerCase() === a);
}, I = (e, t) => (e.features & t) !== 0, Ye = (e, t) => (e.volumeFeatures & t) !== 0, qe = (e) => e.volume !== void 0, wi = ["volume_up", "volume_down", "volume_mute"], $i = (e, t) => e.volume_entity !== void 0 && e.volume_entity !== t.playerId || wi.some((i) => ie(e.overrides[i]?.tap_action)), xi = (e, t) => {
  const i = Ae(t.service);
  return i ? e.callService(i[0], i[1], t.data ?? {}, t.target) : Promise.reject(
    new Error(`polr-android-tv-remote-card: invalid service "${t.service}"`)
  );
}, Se = (e, t, i) => e.callService("remote", "send_command", {
  entity_id: t.remoteId,
  command: i
}), Ai = (e, t, i) => Se(e, t, `${vi}${i}`), ki = (e, t, i, o, n) => {
  const a = t.overrides[o]?.tap_action;
  if (ie(a))
    return ke(n, e, a, i.remoteId);
  if (a && a.action === "none") return Promise.resolve();
  const s = i.playerId;
  switch (o) {
    case "power":
      return s && I(i, i.on ? x.TURN_OFF : x.TURN_ON) ? e.callService(
        "media_player",
        i.on ? "turn_off" : "turn_on",
        { entity_id: s }
      ) : e.callService("remote", i.on ? "turn_off" : "turn_on", {
        entity_id: i.remoteId
      });
    case "play_pause":
      if (s && I(i, x.PAUSE))
        return e.callService("media_player", "media_play_pause", {
          entity_id: s
        });
      break;
    case "next":
      if (s && I(i, x.NEXT_TRACK))
        return e.callService("media_player", "media_next_track", {
          entity_id: s
        });
      break;
    case "previous":
      if (s && I(i, x.PREVIOUS_TRACK))
        return e.callService("media_player", "media_previous_track", {
          entity_id: s
        });
      break;
    case "volume_up":
    case "volume_down":
      if (i.volumeId && Ye(i, x.VOLUME_STEP))
        return e.callService(
          "media_player",
          o === "volume_up" ? "volume_up" : "volume_down",
          { entity_id: i.volumeId }
        );
      break;
    case "volume_mute":
      if (i.volumeId && i.muted !== void 0 && Ye(i, x.VOLUME_MUTE))
        return e.callService("media_player", "volume_mute", {
          entity_id: i.volumeId,
          is_volume_muted: !i.muted
        });
      break;
  }
  const r = fi[o];
  return r ? Se(e, i, r) : Promise.resolve();
}, Ti = (e, t, i, o) => {
  const n = i.action;
  switch (n.action) {
    case "activity":
      return e.callService("remote", "turn_on", {
        entity_id: t.remoteId,
        activity: n.activity
      });
    case "app":
      return t.playerId ? e.callService("media_player", "play_media", {
        entity_id: t.playerId,
        media_content_type: "app",
        media_content_id: n.app_id
      }) : Promise.reject(
        new Error(
          "polr-android-tv-remote-card: launching by app id needs the device's media_player, which was not found"
        )
      );
    case "key":
      return Se(e, t, n.key);
    // v1's shape.
    case "service":
      return xi(e, n);
    /*
     * Everything else is a Home Assistant action, run exactly as an override
     * would run it -- except for which entity a bare one lands on.
     *
     * A section button names the thing it is about: the receiver it lights up
     * for, the projector it toggles. "More info" on that button means that
     * receiver, and HA's own action editor has no field to say so -- it has
     * never had one, because in HA's cards the answer is always the card's
     * entity. Here the card's entity is a remote, so the dialog it opened was
     * the one thing the button was certainly not about.
     *
     * So the tile's entity stands in first, the card's remains the last
     * resort, and an explicit `entity:` on the action still beats both.
     */
    default:
      return ke(
        o,
        e,
        n,
        i.entity ?? t.remoteId
      );
  }
}, Si = (e, t) => {
  switch (e.action) {
    case "activity":
      return `Launch ${e.activity}`;
    case "app":
      return `Open app ${e.app_id}`;
    case "key":
      return `Send ${e.key}`;
    case "service":
      return `Call ${e.service}`;
    case "perform-action":
      return `Call ${e.perform_action}`;
    case "call-service":
      return `Call ${e.service}`;
    case "navigate":
      return `Go to ${e.navigation_path}`;
    case "url":
      return `Open ${e.url_path}`;
    case "toggle":
      return t ? `Toggle ${t}` : "Toggle the TV";
    case "more-info": {
      const i = e.entity ?? t;
      return i ? `Show ${i}` : "Show more info";
    }
    case "none":
      return "Do nothing";
  }
}, D = (e) => Rt`
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="${e}" />
  </svg>
`, ue = {
  disneyplus: D(
    "M2.056 6.834C1.572 6.834 1 6.77 1 6.483c0-2.023 3.562-2.11 5.08-2.11 1.978 0 4.506.614 6.66 1.384 3.277 1.188 9.917 5.145 9.917 9.674 0 4.001-4.31 5.914-8.311 5.914a22.376 22.376 0 0 1-3.21-.33c-.066.243-.11.418-.264.924-.253.052-.511.081-.77.087l-.505-.043c-.33-.396-.44-1.033-.572-1.715-2-1.165-3.298-2.155-3.891-2.836-.506-.528-1.078-1.232-1.078-1.913 0-.351.22-.66.726-1.01 1.034-.77 2.352-1.188 4.507-1.563l.044-.9c.022-.22.242-2.573.748-3.013.813.66.901 1.341.967 2.353.022.44.044.901.11 1.385h.308c1.539 0 6.244.395 6.244 2.616 0 .528-.77 1.517-1.518 1.517a1.9 1.9 0 0 1-.966-.285c.329-.375.813-.704.945-.99-.44-.528-2.814-1.143-4.551-1.143a4.043 4.043 0 0 0-.572.022l.022 4.815c.703.44 1.561.483 2.11.483 2.42 0 7.431-.417 7.431-4.331 0-3.87-4.946-6.86-8.64-8.266a21.394 21.394 0 0 0-7.937-1.496 7.22 7.22 0 0 0-1.803.198c-.373.088-.505.176-.505.264 0 .153.747.242.836.286a.221.221 0 0 1 .11.175.26.26 0 0 1-.088.176c-.089 0-.286.022-.528.022zM9.2 14.551c-2.176.177-4.595.397-4.595 1.166 0 .594 1.012 1.32 1.627 1.781a7.052 7.052 0 0 0 2.77 1.319zm11.155-9.85c-.02.428-.042.942-.042 1.723 0 .3 0 .642.01 1.027-.042.193-.32.214-.46.278a1.148 1.148 0 0 1-.256-.192V4.83c0-.29.01-.588.01-1.038 0-.225 0-.482-.01-.792 0-.192.032-.374.15-.802a.342.342 0 0 1 .3-.224c.245.064.491.17.577.374-.257.76-.235 1.594-.279 2.353zm-.384-.085c.428.021.941.042 1.722.042.3 0 .643 0 1.027-.01.193.041.215.32.279.459-.052.094-.116.18-.193.257H20.1c-.289 0-.589-.01-1.037-.01-.225 0-.482 0-.792.01-.193.002-.375-.03-.803-.149a.346.346 0 0 1-.225-.299c.064-.246.172-.492.374-.578.76.257 1.595.235 2.355.278z"
  ),
  hbomax: D(
    "M8.844 4.249h3.205a2.013 2.013 0 0 1 1.848 1.876c1.607-3.368 6.667-2.217 6.658 1.515.045 3.744-5.026 4.939-6.658 1.568a2.077 2.077 0 0 1-2.07 1.947H8.845Zm-5.395 0h1.92v2.58h1.213V4.253H8.46v6.902H6.586V8.48H5.373v2.676H3.449ZM9.872 19.83h-.576a.603.603 0 0 1-.6-.57c0-.013-.007-.023-.007-.035v-3.667a1.192 1.192 0 0 0-1.279-1.21 1.192 1.192 0 0 0-1.279 1.211v4.167a.103.103 0 0 1-.102.103h-.575a.61.61 0 0 1-.61-.611v-3.666a1.319 1.319 0 0 0-.066-.296 1.176 1.176 0 0 0-1.213-.913 1.19 1.19 0 0 0-1.183.817c-.05.131-.079.267-.087.406v4.17a.104.104 0 0 1-.104.102h-.579a.61.61 0 0 1-.61-.61V15.56a2.322 2.322 0 0 1 1.68-2.32c.285-.088.584-.133.883-.133a2.584 2.584 0 0 1 1.92.752 2.588 2.588 0 0 1 1.921-.752 2.608 2.608 0 0 1 1.872.715c.451.465.7 1.09.692 1.738v4.171a.103.103 0 0 1-.098.103zm.428-3.35a3.76 3.76 0 0 1 .568-2.102c.133-.2.29-.38.47-.539a2.958 2.958 0 0 1 2.013-.744 3.014 3.014 0 0 1 1.845.59.61.61 0 0 1 .597-.48h.574a.107.107 0 0 1 .105.103v6.427a.104.104 0 0 1-.104.103h-.573a.61.61 0 0 1-.612-.553c-2.16 1.55-5.14-.164-4.887-2.811Zm12.623 3.35h-.977a.813.813 0 0 1-.675-.357l-1.079-1.6a.356.356 0 0 0-.588 0l-1.08 1.6a.825.825 0 0 1-.245.22.803.803 0 0 1-.43.137h-.978a.075.075 0 0 1-.063-.121l1.18-1.752.744-1.1a.61.61 0 0 0 0-.682l-.05-.075-1.872-2.773a.077.077 0 0 1 .062-.121h.978a.813.813 0 0 1 .674.36l.826 1.221.254.376a.355.355 0 0 0 .59 0l1.08-1.597a.82.82 0 0 1 .673-.36h.978a.077.077 0 0 1 .06.122l-1.925 2.855a.61.61 0 0 0 0 .682l1.929 2.853a.076.076 0 0 1-.066.116zM17.068 9.403c1.567.002 2.356-1.89 1.25-3-1.103-1.11-3-.33-3.003 1.237A1.756 1.756 0 0 0 17.068 9.4zm0-3.14c1.23.003 1.843 1.493.97 2.36-.872.866-2.358.246-2.354-.983a1.38 1.38 0 0 1 1.38-1.378zm-3.719 8.1a1.77 1.77 0 0 0-1.783 1.63 3.15 3.15 0 0 0-.037.489 1.867 1.867 0 0 0 1.82 2.123 1.696 1.696 0 0 0 1.455-.764c.253-.407.381-.88.367-1.36a1.867 1.867 0 0 0-1.822-2.118zm.227-6.191a2.976 2.976 0 0 1 0-.954 1.475 1.475 0 0 1-.723.422c.29.096.544.283.722.533zm-1.486.785a.548.548 0 0 0-.5-.577h-.954v1.17h.954a.553.553 0 0 0 .5-.593zm0-2.595a.55.55 0 0 0-.5-.577h-.954V6.94h.954a.548.548 0 0 0 .5-.578z"
  ),
  hulu: D(
    "m 14.248,8.7019997 h 1.59 V 15.298 h -1.59 z M 5.143,10.764 H 4.124 a 1.4,1.4 0 0 0 -0.36,0.037 C 3.673,10.826 3.615,10.843 3.59,10.851 V 8.7 H 2 v 6.6 h 1.59 v -2.66 a 0.428,0.428 0 0 1 0.124,-0.3 0.4,0.4 0 0 1 0.3,-0.13 h 0.92 a 0.446,0.446 0 0 1 0.435,0.435 V 15.3 h 1.575 v -2.871 a 1.53,1.53 0 0 0 -0.5,-1.261 2,2 0 0 0 -1.301,-0.404 z m 15.267,0 v 2.658 a 0.423,0.423 0 0 1 -0.422,0.423 h -0.932 a 0.423,0.423 0 0 1 -0.422,-0.423 v -2.658 h -1.59 v 2.783 a 1.679,1.679 0 0 0 0.49,1.3 1.874,1.874 0 0 0 1.323,0.453 H 20.41 A 1.47,1.47 0 0 0 21.571,14.816 1.842,1.842 0 0 0 22,13.547 v -2.783 z m -8.957,2.658 a 0.4,0.4 0 0 1 -0.13,0.3 0.43,0.43 0 0 1 -0.3,0.124 H 10.1 A 0.423,0.423 0 0 1 9.678,13.423 V 10.764 H 8.087 v 2.783 a 1.676,1.676 0 0 0 0.491,1.3 1.855,1.855 0 0 0 1.31,0.453 h 1.565 a 1.473,1.473 0 0 0 1.162,-0.484 1.842,1.842 0 0 0 0.429,-1.267 v -2.785 h -1.591 z"
  ),
  netflix: D(
    "M5.94 1v10.994c0 6.045.006 10.996.014 11.004.01.01.382-.029.834-.078a73.701 73.701 0 0 1 1.383-.139 80.63 80.628 0 0 1 2.06-.133c.05 0 .052-.246.058-4.655l.01-4.645.34.964c1.406 3.979 1.77 5.004 2.166 6.117v.002l.206.581.575 1.624c.003.003.292.02.642.038a48.332 48.33 0 0 1 3.37.29c.12.014.227.024.307.03.038.002.044 0 .067 0 .023 0 .062.003.067 0h.006c.003 0 .003-.967.005-1.382l.002-.435c.007-1.783.01-4.836.007-9.181l-.01-10.979h-4.311L13.73 5.88l-.01 4.859v.003l-.398-1.13V9.61v.002l-2.04-5.765v-.013l-.177-.501c-.422-1.195-.781-2.205-.795-2.251L10.28 1H8.107Z"
  ),
  prime: D(
    "M20.182 5.404a4.05 4.05 0 0 0 .625.05 1.116 1.116 0 0 0 .342-.03.474.474 0 0 0 .404-.306.605.605 0 0 0 .015-.276.4.4 0 0 0-.243-.334.88.88 0 0 0-.281-.064.791.791 0 0 0-.833.499 1.438 1.438 0 0 0-.102.367c-.006.088-.006.088.073.094zm-1.074-.4a1.808 1.808 0 0 1 1.633-1.359 2.38 2.38 0 0 1 1.057.102c.655.224 1.009.932.794 1.59a.986.986 0 0 1-.489.588 1.986 1.986 0 0 1-.66.211 3.534 3.534 0 0 1-1.207-.016 1.221 1.221 0 0 0-.146-.023.88.88 0 0 0 .716.954 2.58 2.58 0 0 0 .995 0c.154-.033.302-.065.456-.102.154-.036.218.012.218.17v.392a.242.242 0 0 1-.18.26 3.082 3.082 0 0 1-.626.17 3.247 3.247 0 0 1-1.214-.01 1.663 1.663 0 0 1-1.36-1.272 2.935 2.935 0 0 1 .016-1.656zm.317 6.367a2.588 2.588 0 0 1 1.012.039 1.936 1.936 0 0 1 1.41 1.635v.011h-.014v.1a.078.078 0 0 0 .024.08v-.021l.007.01v.61l-.012.021v-.01c-.03.02-.02.047-.02.08V14c-.048.9-.747 1.63-1.644 1.717a2.627 2.627 0 0 1-.998-.052 1.694 1.694 0 0 1-1.246-1.114 2.825 2.825 0 0 1 0-2.005c.219-.65.8-1.11 1.482-1.175zM12 3.946c0-.043.006-.086.016-.127a.156.156 0 0 1 .147-.102h.67a.19.19 0 0 1 .184.147c.028.075.044.147.07.223.053 0 .086-.036.122-.057a2.743 2.743 0 0 1 .946-.398 1.962 1.962 0 0 1 .795 0c.25.054.47.202.615.413a.25.25 0 0 0 .03.038v.014c.132-.079.271-.164.415-.237a2.382 2.382 0 0 1 1.203-.266 1.061 1.061 0 0 1 1.095 1.027v2.964c0 .238-.03.27-.27.27h-.647a.906.906 0 0 1-.126 0 .147.147 0 0 1-.128-.122.994.994 0 0 1-.01-.175V5.101a.944.944 0 0 0-.033-.293.4.4 0 0 0-.36-.294 1.861 1.861 0 0 0-.912.176.087.087 0 0 0-.063.096v2.788a.774.774 0 0 1-.01.155c0 .07-.058.127-.128.127h-.81c-.197 0-.24-.047-.24-.243V5.1a1.24 1.24 0 0 0-.026-.276.4.4 0 0 0-.371-.318 1.874 1.874 0 0 0-.928.18.085.085 0 0 0-.059.103v2.833c0 .195-.044.236-.239.236h-.704c-.188 0-.235-.053-.235-.232zm2.71 9.92a.178.178 0 0 0-.074-.011 2 2 0 0 0 .057.324c.08.337.358.59.7.636a2.664 2.664 0 0 0 1.088-.037c.117-.026.229-.053.345-.085.154-.037.223.023.223.17v.385a.235.235 0 0 1-.19.271 3.36 3.36 0 0 1-1.141.217 2.901 2.901 0 0 1-.796-.079 1.63 1.63 0 0 1-1.215-1.136 2.946 2.946 0 0 1-.02-1.776 1.848 1.848 0 0 1 1.838-1.363c.268-.012.535.023.792.101.44.123.775.48.868.928a1.468 1.468 0 0 1 0 .587.983.983 0 0 1-.535.704 2.166 2.166 0 0 1-.891.23 4.15 4.15 0 0 1-1.055-.067zm-3.133-2.202c.027-.037.012-.075.012-.112V9.847c0-.202.037-.238.238-.238h.734c.161.006.207.044.207.208v5.586c0 .147-.049.201-.196.201h-.69a.19.19 0 0 1-.186-.146.82.82 0 0 0-.057-.185c-.048.008-.069.045-.107.067a1.714 1.714 0 0 1-1.615.276 1.526 1.526 0 0 1-.917-.812 2.495 2.495 0 0 1-.266-1.13 2.999 2.999 0 0 1 .187-1.225 1.66 1.66 0 0 1 .826-.945c.552-.263 1.2-.22 1.713.111a.294.294 0 0 0 .117.059zm-.797-3.817h-.733a.32.32 0 0 1-.075 0 .147.147 0 0 1-.147-.137V3.893c0-.127.054-.176.18-.18a19.455 19.455 0 0 1 .828 0c.122 0 .159.037.17.158v3.67a.982.982 0 0 1-.01.176.134.134 0 0 1-.128.12.456.456 0 0 1-.089 0zm-1.045-5.45a.616.616 0 0 1 .642-.586h.064a.649.649 0 0 1 .248.036.6.6 0 0 1 .411.67.587.587 0 0 1-.506.534.963.963 0 0 1-.355 0 .587.587 0 0 1-.504-.66Zm-3.092 5.2V3.983c0-.244.026-.27.27-.27h.51a.211.211 0 0 1 .238.179c.037.132.07.264.1.408a.161.161 0 0 0 .091-.065 3.514 3.514 0 0 1 .303-.27 1.41 1.41 0 0 1 .964-.293c.138 0 .186.048.197.18.01.18 0 .367 0 .546a.985.985 0 0 1-.012.22.147.147 0 0 1-.147.146 1.812 1.812 0 0 1-.22 0 2.523 2.523 0 0 0-1.027.147c-.074.026-.074.079-.074.138v2.678a.13.13 0 0 1-.128.122.992.992 0 0 1-.132 0v.01h-.69a.784.784 0 0 1-.117 0 .147.147 0 0 1-.126-.132zm.904 3.228a.604.604 0 0 1-.192 0 .998.998 0 0 1-.176-.02.6.6 0 0 1-.466-.7.587.587 0 0 1 .567-.536.473.473 0 0 1 .111 0 .638.638 0 0 1 .313.054c.208.078.35.272.361.494a.624.624 0 0 1-.518.716zm.44.855v3.764a.147.147 0 0 1-.133.159h-.88a.147.147 0 0 1-.162-.128v-.026a.567.567 0 0 1 0-.1v-3.67c0-.164.045-.21.21-.21h.751c.164.007.211.054.211.218zm-1.711.047-.317.844-1.067 2.774c-.01.032-.027.063-.037.095a.261.261 0 0 1-.265.175h-.702a.294.294 0 0 1-.318-.218c-.133-.349-.27-.704-.403-1.055-.318-.832-.641-1.666-.96-2.504a.928.928 0 0 1-.069-.207c-.016-.105.021-.158.128-.158h.901c.128 0 .185.085.218.196.058.201.117.408.18.61.217.733.43 1.479.646 2.217h.01l.096-.308.733-2.46.031-.095a.214.214 0 0 1 .213-.147h.812c.2-.003.243.054.176.245zM1.786 3.82a.377.377 0 0 1 .318-.107h.488a.21.21 0 0 1 .234.18c.01.053.02.106.037.16a.022.022 0 0 0 .02.015.429.429 0 0 0 .11-.08 1.87 1.87 0 0 1 1.586-.354c.48.115.874.454 1.061.91a2.451 2.451 0 0 1 .205.798h-.008c.051.444.011.893-.118 1.321a1.942 1.942 0 0 1-.55.88c-.34.306-.795.448-1.248.388A1.776 1.776 0 0 1 3 7.564c-.039.033-.022.074-.022.113v1.506c0 .329 0 .329-.334.329h-.572a.294.294 0 0 1-.294-.126Zm19.37 15.225a.587.587 0 0 1-.176.2 11.64 11.64 0 0 1-1.962 1.247 15.499 15.499 0 0 1-4.152 1.406 18.226 18.226 0 0 1-2.51.27v.022h-.649v-.018c-.293-.014-.578-.026-.868-.047a15.349 15.349 0 0 1-2.296-.352 15.558 15.558 0 0 1-6.885-3.59c-.185-.164-.36-.333-.54-.503a.405.405 0 0 1-.101-.146.195.195 0 0 1 .098-.256.2.2 0 0 1 .147 0 1.21 1.21 0 0 1 .138.069 20.566 20.566 0 0 0 6.164 2.546 22.087 22.087 0 0 0 2.212.398 20.441 20.441 0 0 0 3.213.146 16.97 16.97 0 0 0 1.724-.146 20.908 20.908 0 0 0 3.935-.896 18.627 18.627 0 0 0 1.973-.776.44.44 0 0 1 .318-.043.33.33 0 0 1 .24.398.578.578 0 0 1-.022.066zm1.028 1.488a3.547 3.547 0 0 1-.615.757.432.432 0 0 1-.17.107.123.123 0 0 1-.169-.124.608.608 0 0 1 .038-.162c.185-.496.366-.99.51-1.504a5.346 5.346 0 0 0 .18-.859 1.65 1.65 0 0 0 0-.318.412.412 0 0 0-.294-.388 2.068 2.068 0 0 0-.509-.095 8.356 8.356 0 0 0-1.459.064l-.641.08c-.07 0-.132 0-.17-.065a.18.18 0 0 1 .014-.19.546.546 0 0 1 .162-.148 3.67 3.67 0 0 1 1.299-.562 6.412 6.412 0 0 1 1.097-.121c.346.001.691.042 1.028.121a1.515 1.515 0 0 1 .276.102c.121.05.206.162.219.293a2.157 2.157 0 0 1 .014.455 5.856 5.856 0 0 1-.806 2.55zm-2.55-5.72a.995.995 0 0 0 .301.01.691.691 0 0 0 .505-.293 1.01 1.01 0 0 0 .147-.308l-.009.014a1.924 1.924 0 0 0 .074-.678 2.449 2.449 0 0 0 0-.293 1.64 1.64 0 0 0-.147-.6.685.685 0 0 0-.483-.376.908.908 0 0 0-.302-.01.694.694 0 0 0-.542.328 1.163 1.163 0 0 0-.147.35 2.89 2.89 0 0 0-.042.933 1.494 1.494 0 0 0 .147.525c.09.207.276.355.497.397zm-3.523-1.96a.473.473 0 0 0-.394-.64c-.026 0-.047-.01-.073-.01a.797.797 0 0 0-.775.302 1.321 1.321 0 0 0-.211.578c-.015.047.01.069.058.073a4.705 4.705 0 0 0 .642.053c.11.006.22-.003.328-.026a.465.465 0 0 0 .425-.33zm-5.981-.255a1.174 1.174 0 0 0-.106.26 2.683 2.683 0 0 0-.065.997 1.48 1.48 0 0 0 .147.536.734.734 0 0 0 .568.391 1.306 1.306 0 0 0 .832-.158.147.147 0 0 0 .086-.147v-.966h.007c0-.323-.01-.641 0-.968a.147.147 0 0 0-.096-.156 1.614 1.614 0 0 0-.817-.147.678.678 0 0 0-.556.358zM3.855 7.051a.747.747 0 0 0 .488-.188.807.807 0 0 0 .243-.425 2.654 2.654 0 0 0 .065-1.002 1.505 1.505 0 0 0-.135-.54.653.653 0 0 0-.505-.382 1.44 1.44 0 0 0-.912.137.16.16 0 0 0-.105.164v1.917a.147.147 0 0 0 .09.147 1.468 1.468 0 0 0 .771.17"
  ),
  youtube: D(
    "M18.43 4.216H5.57A4.57 4.57 0 0 0 1 8.786v6.429a4.57 4.57 0 0 0 4.57 4.569h12.86a4.57 4.57 0 0 0 4.57-4.57V8.786a4.57 4.57 0 0 0-4.57-4.569zm-3.09 8.097-6.015 2.869a.241.241 0 0 1-.346-.218V9.046c0-.18.19-.297.351-.215l6.016 3.048a.242.242 0 0 1-.005.434z"
  )
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Y = (e, t) => {
  const i = e._$AN;
  if (i === void 0) return !1;
  for (const o of i) o._$AO?.(t, !1), Y(o, t);
  return !0;
}, oe = (e) => {
  let t, i;
  do {
    if ((t = e._$AM) === void 0) break;
    i = t._$AN, i.delete(e), e = t;
  } while (i?.size === 0);
}, wt = (e) => {
  for (let t; t = e._$AM; e = t) {
    let i = t._$AN;
    if (i === void 0) t._$AN = i = /* @__PURE__ */ new Set();
    else if (i.has(e)) break;
    i.add(e), Ci(t);
  }
};
function Ei(e) {
  this._$AN !== void 0 ? (oe(this), this._$AM = e, wt(this)) : this._$AM = e;
}
function Pi(e, t = !1, i = 0) {
  const o = this._$AH, n = this._$AN;
  if (n !== void 0 && n.size !== 0) if (t) if (Array.isArray(o)) for (let a = i; a < o.length; a++) Y(o[a], !1), oe(o[a]);
  else o != null && (Y(o, !1), oe(o));
  else Y(this, e);
}
const Ci = (e) => {
  e.type == xe.CHILD && (e._$AP ??= Pi, e._$AQ ??= Ei);
};
class Oi extends pt {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(t, i, o) {
    super._$AT(t, i, o), wt(this), this.isConnected = t._$AU;
  }
  _$AO(t, i = !0) {
    t !== this.isConnected && (this.isConnected = t, t ? this.reconnected?.() : this.disconnected?.()), i && (Y(this, t), oe(this));
  }
  setValue(t) {
    if (Zt(this._$Ct)) this._$Ct._$AI(t, this);
    else {
      const i = [...this._$Ct._$AH];
      i[this._$Ci] = t, this._$Ct._$AI(i, this, 0);
    }
  }
  disconnected() {
  }
  reconnected() {
  }
}
const Xe = 500, Ze = 220, Ge = 40, Je = 500, Mi = 250, Qe = 12;
class zi extends Oi {
  constructor(t) {
    if (super(t), this._repeats = 0, this._inFlight = !1, this._bound = !1, this._active = !1, this._resolved = !1, this._startX = 0, this._startY = 0, this._awaitingSecondTap = !1, this._onPointerDown = (i) => {
      if (i.button !== 0) return;
      const o = this._options;
      if (!(!o || o.disabled)) {
        if (this._active = !0, this._resolved = !1, this._startX = i.clientX, this._startY = i.clientY, this._element?.classList.add("pressed"), o.onHold) {
          this._holdTimer = window.setTimeout(() => {
            this._active && (this._resolved = !0, this._fire(o.onHold, "medium"));
          }, Je);
          return;
        }
        o.repeat && (this._repeats = 0, this._repeatTimer = window.setTimeout(() => {
          this._active && (this._resolved = !0, this._fire(o.onPress), this._repeatTimer = window.setInterval(() => {
            if (!this._active || this._repeats >= Ge) {
              this._reset();
              return;
            }
            this._repeats += 1, this._fire(o.onPress);
          }, Ze));
        }, Xe));
      }
    }, this._onPointerMove = (i) => {
      if (!this._active) return;
      const o = i.clientX - this._startX, n = i.clientY - this._startY;
      o * o + n * n > Qe * Qe && this._abort();
    }, this._onPointerUp = () => {
      if (!this._active) return;
      const i = this._resolved;
      this._reset(), i || this._tap();
    }, this._onKeyDown = (i) => {
      if (i.key !== "Enter" && i.key !== " " || (i.preventDefault(), i.repeat || this._active)) return;
      const o = this._options;
      if (!(!o || o.disabled)) {
        if (this._active = !0, this._resolved = !0, this._startX = 0, this._startY = 0, this._element?.classList.add("pressed"), this._tap(), o.onHold) {
          this._holdTimer = window.setTimeout(() => {
            this._active && this._fire(o.onHold, "medium");
          }, Je);
          return;
        }
        o.repeat && (this._repeats = 0, this._repeatTimer = window.setTimeout(() => {
          this._repeatTimer = window.setInterval(() => {
            if (!this._active || this._repeats >= Ge) {
              this._reset();
              return;
            }
            this._repeats += 1, this._fire(o.onPress);
          }, Ze);
        }, Xe));
      }
    }, this._onKeyUp = () => {
      this._reset();
    }, this._abort = () => {
      this._reset();
    }, t.type !== xe.ELEMENT)
      throw new Error("press() can only be used on an element");
  }
  render(t) {
    return A;
  }
  update(t, [i]) {
    if (this._element = t.element, this._options = i, !this._bound) {
      this._bound = !0;
      const o = this._element;
      o.addEventListener("pointerdown", this._onPointerDown), o.addEventListener("pointermove", this._onPointerMove), o.addEventListener("pointerup", this._onPointerUp), o.addEventListener("pointercancel", this._abort), o.addEventListener("pointerleave", this._abort), o.addEventListener("keydown", this._onKeyDown), o.addEventListener("keyup", this._onKeyUp), o.addEventListener("blur", this._abort), o.addEventListener("contextmenu", (n) => n.preventDefault());
    }
    return A;
  }
  /* ------------------------------------------------------------------ firing */
  /** A tap, resolving single vs double first when that distinction exists. */
  _tap() {
    const t = this._options;
    if (t) {
      if (!t.onDoubleTap) {
        this._fire(t.onPress);
        return;
      }
      if (this._awaitingSecondTap) {
        window.clearTimeout(this._tapTimer), this._awaitingSecondTap = !1, this._fire(t.onDoubleTap);
        return;
      }
      this._awaitingSecondTap = !0, this._tapTimer = window.setTimeout(() => {
        this._awaitingSecondTap = !1, this._fire(t.onPress);
      }, Mi);
    }
  }
  _fire(t, i = "light") {
    const o = this._options;
    o && (this._inFlight || (this._inFlight = !0, Promise.resolve().then(() => {
      this._inFlight = !1;
    }), o.haptics !== !1 && this._element && se(this._element, "haptic", i), t()));
  }
  _reset() {
    this._active = !1, this._resolved = !1, this._repeats = 0, this._element?.classList.remove("pressed"), this._repeatTimer !== void 0 && (window.clearTimeout(this._repeatTimer), window.clearInterval(this._repeatTimer), this._repeatTimer = void 0), this._holdTimer !== void 0 && (window.clearTimeout(this._holdTimer), this._holdTimer = void 0);
  }
  disconnected() {
    this._reset(), this._tapTimer !== void 0 && (window.clearTimeout(this._tapTimer), this._tapTimer = void 0), this._awaitingSecondTap = !1;
  }
}
const O = ht(zi), $t = _e`
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
`, Ee = _e`
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
var Li = Object.defineProperty, Ri = Object.getOwnPropertyDescriptor, H = (e, t, i, o) => {
  for (var n = o > 1 ? void 0 : o ? Ri(t, i) : t, a = e.length - 1, s; a >= 0; a--)
    (s = e[a]) && (n = (o ? s(t, i, n) : s(n)) || n);
  return o && n && Li(t, i, n), n;
};
const et = 0.06, Hi = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  Enter: "center",
  " ": "center"
};
let k = class extends z {
  constructor() {
    super(...arguments), this.pad = "buttons", this.repeat = !0, this.haptics = !0, this._tracking = !1, this._startX = 0, this._startY = 0, this._onPointerDown = (e) => {
      e.button === 0 && (e.preventDefault(), this._touchpad?.setPointerCapture(e.pointerId), this._startX = e.clientX, this._startY = e.clientY, this._tracking = !0, this._moveDot(e));
    }, this._onPointerMove = (e) => {
      this._tracking && (e.preventDefault(), this._moveDot(e));
    }, this._onPointerUp = (e) => {
      if (!this._tracking) return;
      this._tracking = !1;
      const t = this._touchpad;
      if (!t) return;
      const i = t.getBoundingClientRect(), o = (e.clientX - this._startX) / i.width, n = (e.clientY - this._startY) / i.height;
      if (Math.abs(o) < et && Math.abs(n) < et) {
        this._emit("center");
        return;
      }
      Math.abs(o) >= Math.abs(n) ? this._emit(o < 0 ? "left" : "right") : this._emit(n < 0 ? "up" : "down");
    }, this._onPointerCancel = () => {
      this._tracking = !1;
    }, this._onKeyDown = (e) => {
      const t = Hi[e.key];
      t && (e.preventDefault(), this._emit(t));
    };
  }
  _emit(e) {
    se(this, "atv-nav", { direction: e });
  }
  _key(e, t, i, o = "") {
    return c`
      <button
        class="pad-key ${o}"
        type="button"
        aria-label=${i}
        ${O({
      onPress: () => this._emit(e),
      repeat: this.repeat && e !== "center",
      haptics: this.haptics
    })}
      >
        <ha-icon icon=${t}></ha-icon>
      </button>
    `;
  }
  _blank() {
    return c`<span class="pad-key blank" aria-hidden="true"></span>`;
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
    return c`
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
    return c`
      <div class="dpad" role="group" aria-label="Directional pad">
        ${this._key("up", "mdi:chevron-up", "Up", "up")}
        ${this._key("left", "mdi:chevron-left", "Left", "left")}
        <button
          class="pad-key ok"
          type="button"
          aria-label="Select"
          ${O({ onPress: () => this._emit("center"), haptics: this.haptics })}
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
    return c`
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
  _moveDot(e) {
    const t = this._touchpad, i = this._dot;
    if (!t || !i) return;
    const o = t.getBoundingClientRect();
    i.style.transform = `translate(${e.clientX - o.left}px, ${e.clientY - o.top}px)`;
  }
  render() {
    return c`
      <div class="pad">
        ${this.pad === "touchpad" ? this._renderTouchpad() : this.pad === "dpad" ? this._renderDpad() : this._renderButtons()}
      </div>
    `;
  }
};
k.styles = [Ee, $t];
H([
  j({ type: String })
], k.prototype, "pad", 2);
H([
  j({ type: Boolean })
], k.prototype, "repeat", 2);
H([
  j({ type: Boolean })
], k.prototype, "haptics", 2);
H([
  dt(".touchpad")
], k.prototype, "_touchpad", 2);
H([
  dt(".touchpad-dot")
], k.prototype, "_dot", 2);
H([
  R()
], k.prototype, "_tracking", 2);
k = H([
  $e("polr-atv-nav-pad")
], k);
var Di = Object.defineProperty, Ni = Object.getOwnPropertyDescriptor, G = (e, t, i, o) => {
  for (var n = o > 1 ? void 0 : o ? Ni(t, i) : t, a = e.length - 1, s; a >= 0; a--)
    (s = e[a]) && (n = (o ? s(t, i, n) : s(n)) || n);
  return o && n && Di(t, i, n), n;
};
const Ui = {
  pad: { label: "Remote pad", icon: "mdi:gesture-tap-button", settings: "Pad" },
  navigation: { label: "Back / home / menu", icon: "mdi:arrow-u-left-top" },
  transport: { label: "Playback", icon: "mdi:play-pause", settings: "Playback" },
  volume: { label: "Volume", icon: "mdi:volume-high", settings: "Volume" },
  text: { label: "Text input", icon: "mdi:keyboard" },
  apps: { label: "App launcher", icon: "mdi:apps", settings: "Apps" }
}, tt = [
  { value: "activity", label: "Launch app or link", hint: "App name from the integration, or a deep link such as https://www.netflix.com/title" },
  { value: "app", label: "Open app id", hint: "Android package id, e.g. com.netflix.ninja. Needs a paired media player." },
  { value: "key", label: "Send a key", hint: "Android key code, e.g. GUIDE or MEDIA_REWIND" },
  { value: "action", label: "Call an action", hint: "" }
], Ii = [
  { name: "app_columns", selector: { number: { min: 1, max: 8, mode: "box" } } }
], Vi = [
  {
    type: "expandable",
    name: "",
    title: "Advanced",
    icon: "mdi:tune",
    schema: [
      { name: "hold_repeat", selector: { boolean: {} } },
      { name: "haptics", selector: { boolean: {} } }
    ]
  }
], Bi = () => [
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
    ]
  },
  {
    type: "expandable",
    name: "",
    title: "Playback",
    icon: "mdi:play-pause",
    schema: [
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
    ]
  },
  {
    type: "expandable",
    name: "",
    title: "Volume",
    icon: "mdi:volume-high",
    schema: [
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
], ji = [
  { name: "action", selector: { ui_action: {} } }
], Ki = {
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
  transport_buttons: "Buttons",
  app_columns: "Buttons per row",
  hold_repeat: "Hold to repeat",
  haptics: "Haptic feedback"
}, Wi = {
  show_power: "In the header, or in the back / home / menu row when the header is hidden — that row then has to be in the layout for it to have anywhere to go. Off also drops the big Turn on button an off TV shows.",
  volume_entity: "Point this at a soundbar or receiver that exposes a media player. A TV passing audio through reports no volume level, so the card shows no level bar for it.",
  power_action: "Leave empty to toggle the TV itself. Set it when something else does the switching — an IR or RF blaster, or a script that also powers a receiver.",
  volume_up_action: "Leave empty to control the TV or the media player above. Set it for IR bridges and the like, which expose one pressable entity per command instead of a media player."
};
let w = class extends z {
  constructor() {
    super(...arguments), this._editing = null, this._openSection = null, this._computeLabel = (e) => Ki[e.name] ?? e.name, this._computeHelper = (e) => Wi[e.name];
  }
  setConfig(e) {
    this._config = bt(e);
  }
  /**
   * ha-form data, with the editable tap actions flattened.
   *
   * ha-form has no vocabulary for a nested map, so `overrides.power` is
   * surfaced as `power_action` and folded back in `_formChanged`. Hold and
   * double-tap actions are preserved untouched; the selector only edits the tap.
   */
  get _formData() {
    const e = { ...this._config };
    for (const t of w.ACTION_BUTTONS)
      e[`${t}_action`] = this._config.overrides[t]?.tap_action;
    return e;
  }
  /** Emit a full v2 config. This is what upgrades stored v1 YAML. */
  _emit(e) {
    se(this, "config-changed", { config: mi(e) });
  }
  _formChanged(e) {
    e.stopPropagation();
    const t = { ...e.detail.value }, i = { ...this._config.overrides };
    for (const o of w.ACTION_BUTTONS) {
      const n = `${o}_action`;
      if (!(n in t)) continue;
      const a = t[n];
      delete t[n];
      const s = { ...this._config.overrides[o] ?? {} };
      U(a) && a.action !== "none" ? i[o] = { ...s, tap_action: a } : (delete s.tap_action, Object.keys(s).length ? i[o] = s : delete i[o]);
    }
    this._emit({
      ...this._config,
      ...t,
      overrides: i,
      apps: this._config.apps
    });
  }
  /* --------------------------------------------------------- tile lists -- */
  /*
   * Apps and every custom section are the same list of tiles, so the list
   * machinery is addressed by path rather than duplicated per list. `"apps"` is
   * the built-in launcher; a number is an index into `sections`.
   */
  _tiles(e) {
    if (e === "apps") return this._config.apps;
    const t = this._config.layout[e];
    return t?.type === "section" ? t.buttons : [];
  }
  _setTiles(e, t) {
    if (e === "apps") {
      this._emit({ ...this._config, apps: t });
      return;
    }
    this._setLayout(
      this._config.layout.map(
        (i, o) => o === e && i.type === "section" ? { ...i, buttons: t } : i
      )
    );
  }
  _addTile(e, t) {
    const i = [...this._tiles(e), t];
    this._setTiles(e, i), this._editing = { path: e, index: i.length - 1 };
  }
  _updateTile(e, t, i) {
    this._setTiles(
      e,
      this._tiles(e).map((o, n) => n === t ? { ...o, ...i } : o)
    );
  }
  _removeTile(e, t) {
    this._setTiles(
      e,
      this._tiles(e).filter((i, o) => o !== t)
    ), this._editing = null;
  }
  _moveTile(e, t, i) {
    const o = [...this._tiles(e)], n = t + i;
    n < 0 || n >= o.length || ([o[t], o[n]] = [o[n], o[t]], this._setTiles(e, o), this._isEditing(e, t) && (this._editing = { path: e, index: n }));
  }
  _isEditing(e, t) {
    return this._editing?.path === e && this._editing.index === t;
  }
  /**
   * The reading that lights this tile, as typed.
   *
   * A comma separates several, because a box that takes one name and a box that
   * takes a list are the same box to everyone who is not writing YAML.
   */
  _setActiveWhen(e, t, i) {
    const o = i.split(",").map((n) => n.trim()).filter(Boolean);
    this._updateTile(e, t, {
      active_when: o.length === 0 ? void 0 : o.length === 1 ? o[0] : o
    });
  }
  /** Change the action kind, carrying the old value across where it makes sense. */
  _setActionKind(e, t, i) {
    const o = this._tiles(e)[t].action;
    this._updateTile(e, t, {
      action: ot(i, it(o))
    });
  }
  _setActionValue(e, t, i) {
    const o = this._tiles(e)[t].action;
    this._updateTile(e, t, { action: ot(me(o), i) });
  }
  /* ------------------------------------------------------------ layout -- */
  /**
   * Write the layout, and with it the keys it replaces.
   *
   * `sections` and the five `show_*` flags say the same things a layout says,
   * and a config carrying both is a config where two places disagree the moment
   * either is edited. Writing a layout therefore retires them from the stored
   * YAML; the card still reads them, so a hand-written config that never meets
   * this editor is untouched.
   */
  _setLayout(e) {
    const t = { ...this._config, layout: e };
    for (const i of [
      "sections",
      "show_nav",
      "show_transport",
      "show_volume",
      "show_text_input",
      "show_apps"
    ])
      delete t[i];
    this._emit(t);
  }
  _moveBlock(e, t) {
    const i = [...this._config.layout], o = e + t;
    if (o < 0 || o >= i.length) return;
    [i[e], i[o]] = [i[o], i[e]], this._setLayout(i);
    const n = (a) => a === e ? o : a === o ? e : a;
    this._openSection = n(this._openSection), typeof this._editing?.path == "number" && (this._editing = { ...this._editing, path: n(this._editing.path) });
  }
  _toggleBlock(e) {
    this._setLayout(
      this._config.layout.map((t, i) => {
        if (i !== e) return t;
        const { hidden: o, ...n } = t;
        return t.hidden ? n : { ...n, hidden: !0 };
      })
    );
  }
  _addSection() {
    const e = this._config.layout;
    this._setLayout([
      ...e,
      { type: "section", name: "New section", buttons: [] }
    ]), this._openSection = e.length, this._editing = null;
  }
  /**
   * What a block is called, or nothing when the field is emptied.
   *
   * One key: sections have always had `name`, the betas briefly grew a `title`
   * beside it, and two fields for what a block is called is one too many. The
   * older spelling is the one with configs behind it, so it is the one kept.
   */
  _setName(e, t) {
    this._setLayout(
      this._config.layout.map((i, o) => {
        if (o !== e) return i;
        const { name: n, ...a } = i;
        return t ? { ...a, name: t } : a;
      })
    );
  }
  _setLabelled(e) {
    this._emit({ ...this._config, show_section_labels: e });
  }
  _removeSection(e) {
    this._setLayout(this._config.layout.filter((t, i) => i !== e)), this._openSection = null, this._editing = null;
  }
  _renderIcon(e) {
    const t = e.icon ?? "mdi:application";
    if (t.startsWith("brand:")) {
      const i = ue[t.slice(6)];
      if (i) return c`<span class="brand">${i}</span>`;
    }
    return t.startsWith("/") || t.startsWith("http") ? c`<img class="brand" src=${t} alt="" />` : c`<ha-icon .icon=${t}></ha-icon>`;
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
  _renderTileList(e, t, i) {
    return t.length ? c`<ul class="list">
      ${t.flatMap(
      (o, n) => this._isEditing(e, n) ? [
        this._renderAppRow(e, o, n, t.length),
        this._renderAppForm(e, o, n)
      ] : [this._renderAppRow(e, o, n, t.length)]
    )}
    </ul>` : c`<div class="empty-state">${i}</div>`;
  }
  _renderAppRow(e, t, i, o) {
    const n = this._isEditing(e, i);
    return c`
      <li class="row">
        <div class="tile-icon">${this._renderIcon(t)}</div>
        <div class="tile-info">
          <div class="primary"><span>${t.name ?? "Untitled app"}</span></div>
          <div class="secondary"><span>${Si(t.action, t.entity)}</span></div>
        </div>
        <button
          class="icon-button"
          title="Move up"
          .disabled=${i === 0}
          @click=${() => this._moveTile(e, i, -1)}
        >
          <ha-icon icon="mdi:arrow-up"></ha-icon>
        </button>
        <button
          class="icon-button"
          title="Move down"
          .disabled=${i === o - 1}
          @click=${() => this._moveTile(e, i, 1)}
        >
          <ha-icon icon="mdi:arrow-down"></ha-icon>
        </button>
        <button
          class="icon-button"
          title=${n ? "Done" : "Edit"}
          @click=${() => {
      this._editing = n ? null : { path: e, index: i };
    }}
        >
          <ha-icon icon=${n ? "mdi:check" : "mdi:pencil"}></ha-icon>
        </button>
        <button class="icon-button danger" title="Remove" @click=${() => this._removeTile(e, i)}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </li>
    `;
  }
  _renderAppForm(e, t, i) {
    const o = me(t.action), n = tt.find((s) => s.value === o), a = Yi(t.action);
    return c`
      <li class="form-host">
        <div class="form">
          <div class="fields">
            <label class="field">
              <span>Name</span>
              <input
                type="text"
                .value=${t.name ?? ""}
                @change=${(s) => this._updateTile(e, i, {
      name: s.target.value || void 0
    })}
              />
            </label>

            <!--
              HA's own picker, so icons are searchable and previewed the way
              they are everywhere else. It emits value-changed with the icon in
              event.detail.value, matching how HA's helper dialogs consume it.
            -->
            <!--
              Captioned by the label around it rather than by its own, so it
              is not the one field in the form wearing its name inside the box.
            -->
            <label class="field">
              <span>Icon</span>
              <ha-icon-picker
                .hass=${this.hass}
                .value=${t.icon ?? ""}
                @value-changed=${(s) => {
      const r = s.detail?.value;
      !r && t.icon && !t.icon.startsWith("mdi:") || this._updateTile(e, i, { icon: r || void 0 });
    }}
              ></ha-icon-picker>
            </label>

            ${e !== "apps" ? c`
                  <label class="field">
                    <span>Lights up with this entity</span>
                    <ha-entity-picker
                      .hass=${this.hass}
                      .value=${t.entity ?? ""}
                      allow-custom-entity
                      @value-changed=${(s) => this._updateTile(e, i, {
      entity: s.detail?.value || void 0
    })}
                    ></ha-entity-picker>
                  </label>

                  <!--
                    Only once there is an entity to read: these two say how to
                    read it, and mean nothing on their own.
                  -->
                  ${t.entity ? c`
                        <label class="field">
                          <span>Lit when it reads</span>
                          <input
                            type="text"
                            .value=${Fi(t)}
                            @change=${(s) => this._setActiveWhen(
      e,
      i,
      s.target.value
    )}
                          />
                        </label>
                        <label class="field">
                          <span>Read from</span>
                          <input
                            type="text"
                            .value=${t.attribute ?? ""}
                            placeholder="state"
                            @change=${(s) => this._updateTile(e, i, {
      attribute: s.target.value.trim() || void 0
    })}
                          />
                        </label>
                        <div class="hint">
                          Leave the reading empty to light whenever the entity is
                          on. For one button per receiver input, put the input's
                          name in it and <code>source</code> in “Read from”;
                          for a hub activity, the activity's name and nothing
                          else. Separate several with a comma.
                        </div>
                      ` : d}
                ` : d}

            <!-- Streaming logos are app suggestions; a section button is a
                 projector or a receiver, so they are only offered for apps. -->
            ${e === "apps" ? c`
                  <div class="chips">
                    ${pe.map(
      (s) => c`
                        <button
                          class="chip ${t.icon === `brand:${s}` ? "accent" : ""}"
                          title=${`Use the ${E[s].label} logo`}
                          @click=${() => this._updateTile(e, i, { icon: `brand:${s}` })}
                        >
                          ${E[s].label}
                        </button>
                      `
    )}
                  </div>
                ` : d}

            <label class="field">
              <span>Does what</span>
              <select
                .value=${o}
                @change=${(s) => this._setActionKind(e, i, s.target.value)}
              >
                ${tt.map(
      (s) => c`
                    <option value=${s.value} ?selected=${s.value === o}>
                      ${s.label}
                    </option>
                  `
    )}
              </select>
            </label>

            ${o === "action" ? c`
                  <!--
                    HA's own interactions editor, the same control the button
                    overrides use. It carries a service picker, a target and
                    data, which the old free-text box could not — hence the
                    note telling people to go and edit YAML instead.
                  -->
                  <ha-form
                    .hass=${this.hass}
                    .data=${{ action: a }}
                    .schema=${ji}
                    .computeLabel=${() => "Action"}
                    @value-changed=${(s) => {
      s.stopPropagation();
      const r = s.detail?.value?.action;
      U(r) && this._updateTile(e, i, { action: r });
    }}
                  ></ha-form>

                  <!--
                    HA's interactions editor has no entity field for "more
                    info" -- in HA's own cards the dialog is always the card's
                    entity, and there was nothing to choose. Here the card's
                    entity is a remote, so without this the one dialog the
                    button could open was the one it was not about.
                  -->
                  ${a?.action === "more-info" ? c`
                        <label class="field">
                          <span>Dialog to open</span>
                          <ha-entity-picker
                            .hass=${this.hass}
                            .value=${a.entity ?? ""}
                            allow-custom-entity
                            @value-changed=${(s) => this._updateTile(e, i, {
      action: {
        action: "more-info",
        ...s.detail?.value ? { entity: s.detail.value } : {}
      }
    })}
                          ></ha-entity-picker>
                        </label>
                        <div class="hint">
                          ${t.entity ? c`Leave empty to open ${t.entity}, the entity
                              this button lights up for.` : c`Leave empty and it opens the card's remote,
                              which is rarely what a button is about.`}
                        </div>
                      ` : d}
                ` : c`
                  <label class="field wide">
                    <span>${n.label}</span>
                    <input
                      type="text"
                      .value=${it(t.action)}
                      @change=${(s) => this._setActionValue(e, i, s.target.value)}
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
    const e = this._config, t = yt(this.hass, e), i = t ? this.hass.states?.[t] : void 0, o = i?.attributes?.app_id, n = i?.attributes?.app_name;
    if (!o) return d;
    const a = e.apps.some(
      (s) => s.action.action === "app" && s.action.app_id === o
    );
    return c`
      <div class="section-head"><span class="grow">Playing right now</span></div>
      ${a ? c`<div class="hint">${n ?? o} is already in the list.</div>` : c`
            <div class="chips">
              <button
                class="chip accent"
                @click=${() => this._addTile("apps", {
      name: n ?? o,
      icon: qi(n ?? o),
      action: { action: "app", app_id: o }
    })}
              >
                <ha-icon icon="mdi:plus"></ha-icon>${n ?? o}
              </button>
            </div>
            <div class="hint">
              Open an app on the TV and it appears here, which is the easiest way
              to capture its package id (${o}).
            </div>
          `}
    `;
  }
  /* ------------------------------------------------------------ layout -- */
  /**
   * The card's blocks, in order, every one of them.
   *
   * Hidden blocks are listed too, struck through. A list of only what is on
   * cannot offer to turn anything back on, and a block dropped from the list
   * loses the place it should return to.
   */
  _renderLayoutList() {
    const e = this._config.layout;
    return c`<ul class="list">
      ${e.flatMap((t, i) => {
      const o = this._openSection === i;
      return [
        this._renderLayoutRow(t, i, e.length, o),
        this._renderBlockBody(t, i)
      ];
    })}
    </ul>`;
  }
  _renderLayoutRow(e, t, i, o) {
    const n = e.type === "section" ? e : void 0, a = e.type === "section" ? void 0 : Ui[e.type], s = n?.buttons.length ?? 0, r = e.hidden ? "Hidden" : n ? `${s} ${s === 1 ? "button" : "buttons"}` : "";
    return c`
      <li class="row ${e.hidden ? "inactive" : ""}">
        <div class="tile-icon">
          <ha-icon icon=${n ? "mdi:view-grid-outline" : a.icon}></ha-icon>
        </div>
        <div class="tile-info">
          <div class="primary">
            <span>
              ${e.name || (n ? "Untitled section" : a.label)}
            </span>
          </div>
          ${r ? c`<div class="secondary"><span>${r}</span></div>` : d}
        </div>
        <button
          class="icon-button"
          title="Move up"
          .disabled=${t === 0}
          @click=${() => this._moveBlock(t, -1)}
        >
          <ha-icon icon="mdi:arrow-up"></ha-icon>
        </button>
        <button
          class="icon-button"
          title="Move down"
          .disabled=${t === i - 1}
          @click=${() => this._moveBlock(t, 1)}
        >
          <ha-icon icon="mdi:arrow-down"></ha-icon>
        </button>
        <button
          class="icon-button"
          title=${e.hidden ? "Show" : "Hide"}
          aria-pressed=${e.hidden ? "true" : "false"}
          @click=${() => this._toggleBlock(t)}
        >
          <ha-icon icon=${e.hidden ? "mdi:eye-off" : "mdi:eye"}></ha-icon>
        </button>
        <button
          class="icon-button"
          title=${o ? "Done" : "Edit"}
          @click=${() => {
      this._openSection = o ? null : t, o || (this._editing = null);
    }}
        >
          <ha-icon icon=${o ? "mdi:check" : "mdi:pencil"}></ha-icon>
        </button>
      </li>
    `;
  }
  /**
   * A block's own editor: a title for any of them, and for a section its name,
   * its buttons, and the way to be rid of it.
   */
  _renderBlockBody(e, t) {
    if (this._openSection !== t) return d;
    const i = e.type === "section" ? e : void 0;
    return c`
      <li class="form-host">
        <div class="form">
          <div class="fields">
            <!--
              A plain input, like every other field in this editor. ha-textfield
              is not a component this frontend defines, so it rendered as an
              inert unknown element and could not be typed in at all.
            -->
            <label class="field">
              <span>Name</span>
              <input
                type="text"
                .value=${e.name ?? ""}
                @change=${(o) => this._setName(t, o.target.value.trim())}
              />
            </label>
            <div class="hint">
              What this row is called here, and the heading above it on the card
              while “Show names” is on.
            </div>
          </div>

          ${i ? c`
                ${this._renderTileList(t, i.buttons, "No buttons yet.")}

                <div class="form-actions">
                  <button
                    class="control-button destructive"
                    @click=${() => this._removeSection(t)}
                  >
                    <ha-icon icon="mdi:delete"></ha-icon><span>Remove</span>
                  </button>
                  <button
                    class="control-button"
                    @click=${() => this._addTile(t, {
      name: "New button",
      icon: "mdi:power",
      action: { action: "service", service: "" }
    })}
                  >
                    <ha-icon icon="mdi:plus"></ha-icon><span>Add button</span>
                  </button>
                </div>
              ` : d}
        </div>
      </li>
    `;
  }
  render() {
    if (!this.hass || !this._config) return d;
    const e = this._config, t = e.apps;
    return c`
      <ha-form
        .hass=${this.hass}
        .data=${this._formData}
        .schema=${Bi()}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._formChanged}
      ></ha-form>

      <ha-expansion-panel outlined>
        <ha-icon slot="leading-icon" icon="mdi:view-dashboard-outline"></ha-icon>
        <div slot="header" role="heading" aria-level="3">Layout</div>

        <div class="content">
          <div class="hint">
            Everything on the card, in the order it is drawn, under the header.
            Move a row to move the block; hide one and it keeps its place for
            when you bring it back. Open a row to name it.
          </div>

          <!--
            The switch that draws those names, beside them rather than under
            Advanced: a field whose effect is decided two panels away is a field
            that reads as broken.
          -->
          <label class="check">
            <input
              type="checkbox"
              .checked=${e.show_section_labels}
              @change=${(i) => this._setLabelled(i.target.checked)}
            />
            <span>Show names as headings on the card</span>
          </label>

          ${this._renderLayoutList()}

          <div class="form-actions add-section">
            <button class="control-button wide" @click=${() => this._addSection()}>
              <ha-icon icon="mdi:plus"></ha-icon><span>Add section</span>
            </button>
          </div>
        </div>
      </ha-expansion-panel>

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
          .schema=${Ii}
          .computeLabel=${this._computeLabel}
          .computeHelper=${this._computeHelper}
          @value-changed=${this._formChanged}
        ></ha-form>


              <div class="section-head">
                <span class="grow">Apps</span>
                <span class="count">${t.length}</span>
              </div>

              ${this._renderTileList("apps", t, "No apps yet — add one below.")}

              <div class="section-head"><span class="grow">Add a known app</span></div>
              <div class="chips">
                ${pe.map(
      (i) => c`
                    <button
                      class="chip"
                      @click=${() => this._addTile("apps", {
        name: E[i].label,
        icon: `brand:${i}`,
        action: { action: "activity", activity: E[i].activity }
      })}
                    >
                      <ha-icon icon="mdi:plus"></ha-icon>${E[i].label}
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
        </div>
      </ha-expansion-panel>

      <ha-form
        .hass=${this.hass}
        .data=${this._formData}
        .schema=${Vi}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._formChanged}
      ></ha-form>
    `;
  }
};
w.ACTION_BUTTONS = [
  "power",
  "volume_up",
  "volume_down",
  "volume_mute"
];
w.styles = [
  Ee,
  _e`
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
      ha-icon-picker,
      ha-entity-picker {
        display: block;
      }

      /* ------------------------------------------------------- rhythm -- */
      /*
       * One vertical rhythm for the whole editor.
       *
       * Every part of these panels comes from the card kit, where an element
       * pads itself because it sits straight on a card. Stacked inside a panel
       * that already pads its content, those paddings disagreed: a section head
       * inset 12px, the list under it 8px, a form 8px again -- so a section's
       * name, the rows beneath it and the button below them each started at a
       * different x. Vertically it was worse, because nothing owned the gaps at
       * all: a name field sat flush against its first row, and the last row
       * flush against "Add button".
       *
       * The rule is now: the panel owns the inset, the stack owns the gaps, and
       * the parts own neither. One 4 / 8 / 16 scale -- rows within a list, parts
       * within a section, blocks within the panel.
       */
      ha-expansion-panel .content {
        display: flex;
        flex-direction: column;
        gap: var(--ha-space-4, 16px);
        padding: var(--ha-space-3, 12px);
      }
      ha-expansion-panel .content ha-form {
        display: block;
        margin-bottom: 0;
      }
      /*
       * The parts stop insetting themselves; the panel and the block do it.
       *
       * Deliberately not the inline edit form: it is a surface of its own, like
       * a section block, so it keeps its 12px all the way round and only gives
       * up the outer margin -- which li.form-host .form has already zeroed.
       * Stripping its padding along with everyone else's put every field hard
       * against the tinted edge.
       */
      ha-expansion-panel .content .section-head,
      ha-expansion-panel .content ul.list,
      ha-expansion-panel .content .chips,
      ha-expansion-panel .content .hint,
      ha-expansion-panel .content .empty-state {
        margin-left: 0;
        margin-right: 0;
        padding-left: 0;
        padding-right: 0;
      }
      /* The kit gives whatever ends a card its breathing room; here the panel
         padding already is that room, and the two stacked to 24px. */
      ha-expansion-panel .content .chips,
      ha-expansion-panel .content .hint,
      ha-expansion-panel .content ul.list,
      ha-expansion-panel .content .empty-state {
        margin-bottom: 0;
        padding-bottom: 0;
      }
      ha-expansion-panel .content .form {
        margin: 0;
      }
      /*
       * The kit's checkbox aligns itself to the end of its row, where it sits
       * beside a field in a two-column grid. This panel is a stack, so that put
       * its left edge somewhere nothing else in the panel starts -- which the
       * spacing check caught before anyone had to look at it.
       */
      ha-expansion-panel .content > label.check {
        align-self: stretch;
      }
      /*
       * A heading belongs to what follows it, so it sits nearer that than the
       * block above -- otherwise "Apps" floated equidistant between its own
       * list and the settings above, attached to neither. Direct children only:
       * inside a section block the gap is already 8px.
       */
      ha-expansion-panel .content > .section-head + * {
        margin-top: calc(-1 * var(--ha-space-2, 8px));
      }
      /*
       * A section owns its name, its buttons and its "Add button" control, so
       * they are grouped on a tinted surface. Without it "Add button" and "Add
       * section" sat flush against each other and read as one pair of controls
       * at the same level, which they are not.
       */
      .section-block {
        display: flex;
        flex-direction: column;
        gap: var(--ha-space-2, 8px);
        padding: var(--ha-space-3, 12px);
        border-radius: var(--radius-md);
        background-color: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.04);
      }
      /*
       * This head holds the name field rather than a label, so its button lines
       * up with the input and not with the caption above it, and it drops the
       * 40px floor that would otherwise pad a two-line control.
       */
      .section-block .section-head {
        align-items: flex-end;
        min-height: 0;
      }
      /*
       * A row's name wraps rather than eliding. The kit ellipsises because a
       * card row is one line of a tile; here the name is the row's whole point,
       * and "Back / home / …" beside a generic icon told you nothing.
       */
      ul.list li.row .primary span {
        white-space: normal;
        overflow-wrap: anywhere;
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
      /* ------------------------------------------------------- fields -- */
      /*
       * The card's own inputs, dressed as the text fields Home Assistant puts
       * beside them.
       *
       * Half this form is HA's -- the icon picker, the entity pickers, the
       * interactions selector -- and half is hand-rolled, because ha-textfield
       * is not a component this frontend defines and rendered as an inert
       * unknown element when tried. So the two halves disagreed: an outlined
       * 40px box with a caption above it, next to a filled 56px one with its
       * label inside.
       *
       * Convergence goes this way round on purpose. Restyling HA's components
       * means reaching past their shadow boundary into internals that have
       * already moved once (ha-textfield to ha-generic-picker), and a version
       * that ignored the attempt would leave a filled box inside a border of
       * mine -- worse than the mismatch. Dressing my own inputs is entirely
       * this stylesheet's business, and it reads from HA's own theme variables,
       * so a theme that restyles its text fields restyles these with them.
       *
       * Note the selectors: the kit's label.field input outranks a bare
       * .field input, so the filled treatment this panel already asked for
       * never applied. It does now.
       */
      label.field input,
      label.field select {
        width: 100%;
        box-sizing: border-box;
        height: 56px;
        padding: 0 var(--ha-space-4, 16px);
        border: none;
        border-bottom: 1px solid var(--mdc-text-field-idle-line-color, rgba(0, 0, 0, 0.42));
        border-radius: var(--ha-border-radius-sm, 4px) var(--ha-border-radius-sm, 4px) 0 0;
        background-color: var(--mdc-text-field-fill-color, whitesmoke);
        color: var(--primary-text-color);
        font: inherit;
        font-size: var(--ha-font-size-m, 14px);
      }
      /* The 2px underline HA's fields grow when focused, rather than the kit's
         ring -- which would be the one control in the form wearing one. */
      label.field input:focus,
      label.field select:focus {
        outline: none;
        box-shadow: none;
        border-bottom: 2px solid var(--mdc-theme-primary, var(--primary-color));
        padding-bottom: 0;
      }
      /*
       * A picker's own label is switched off in the template, so every field in
       * the form is captioned the same way: above the box, in the same type.
       * HA has moved that label in and out of the box across versions -- the
       * entity picker already puts it on top in some -- and this is the one
       * arrangement that looks deliberate on all of them.
       */
      label.field ha-icon-picker,
      label.field ha-entity-picker {
        display: block;
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
G([
  j({ attribute: !1 })
], w.prototype, "hass", 2);
G([
  R()
], w.prototype, "_config", 2);
G([
  R()
], w.prototype, "_editing", 2);
G([
  R()
], w.prototype, "_openSection", 2);
w = G([
  $e("polr-android-tv-remote-card-editor")
], w);
const me = (e) => e.action === "activity" || e.action === "app" || e.action === "key" ? e.action : "action", Fi = (e) => {
  const t = e.active_when;
  return t === void 0 ? "" : Array.isArray(t) ? t.join(", ") : t;
}, it = (e) => {
  switch (e.action) {
    case "activity":
      return e.activity;
    case "app":
      return e.app_id;
    case "key":
      return e.key;
    default:
      return "";
  }
}, Yi = (e) => e.action === "service" ? he(e.service, e.data, e.target) : me(e) === "action" ? e : void 0, ot = (e, t) => {
  switch (e) {
    case "activity":
      return { action: "activity", activity: t };
    case "app":
      return { action: "app", app_id: t };
    case "key":
      return { action: "key", key: t };
    case "action":
      return { action: "perform-action", perform_action: t };
  }
}, qi = (e) => {
  const t = Te(e);
  return t ? `brand:${t}` : "mdi:application";
};
var Xi = Object.defineProperty, Zi = Object.getOwnPropertyDescriptor, J = (e, t, i, o) => {
  for (var n = o > 1 ? void 0 : o ? Zi(t, i) : t, a = e.length - 1, s; a >= 0; a--)
    (s = e[a]) && (n = (o ? s(t, i, n) : s(n)) || n);
  return o && n && Xi(t, i, n), n;
};
const Gi = "2.1.1-beta.11", re = "polr-android-tv-remote-card";
let T = class extends z {
  constructor() {
    super(...arguments), this._text = "", this._sending = !1;
  }
  static getConfigElement() {
    return document.createElement(`${re}-editor`);
  }
  /**
   * Pick a real remote off the user's system.
   *
   * v1 used the old zero-argument signature and hardcoded `remote.atvremote`,
   * so adding the card from the picker produced a card pointing at an entity
   * that almost certainly did not exist.
   */
  static getStubConfig(e) {
    return { entity: Object.keys(e?.states ?? {}).find((i) => i.startsWith("remote.")) ?? "remote.android_tv", pad: "buttons" };
  }
  setConfig(e) {
    this._config = bt(e);
  }
  getCardSize() {
    const e = this._config;
    if (!e) return 6;
    let t = e.show_header ? 2 : 0;
    for (const i of e.layout)
      i.hidden || (i.type === "pad" ? t += e.pad === "buttons" ? 5 : 6 : i.type === "apps" ? t += e.apps.length ? 2 : 0 : t += T.BLOCK_ROWS[i.type]);
    return Math.max(t, 3);
  }
  /** Is this block on the card at all? */
  _shows(e) {
    return (this._config?.layout ?? []).some(
      (t) => t.type === e && !t.hidden
    );
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
      min_rows: this._shows("pad") ? 6 : 2
    };
  }
  get _device() {
    if (!(!this.hass || !this._config))
      return _i(this.hass, this._config);
  }
  /**
   * Run a card action, reporting failures instead of dropping them.
   *
   * Every interaction here is fire-and-forget, so without this a rejected
   * service call -- a typo'd override, an entity that has gone away -- becomes
   * an unhandled promise rejection and the console shows nothing useful.
   */
  _run(e) {
    e.catch((t) => {
      console.error("polr-android-tv-remote-card:", t);
    });
  }
  _press(e) {
    const t = this._device;
    !this.hass || !this._config || !t || this._run(ki(this.hass, this._config, t, e, this));
  }
  /**
   * Press options for a button, folding in any configured interactions.
   *
   * Hold and double-tap handlers are wired only when configured: a double-tap
   * handler forces every tap to wait out the double-tap window, and a hold
   * handler replaces hold-to-repeat, so neither should exist by default.
   */
  _pressOptions(e, t = {}) {
    const i = this._config, o = i.overrides[e], n = o?.hold_action, a = o?.double_tap_action, s = (r) => () => {
      this.hass && this._run(ke(this, this.hass, r, i.entity));
    };
    return {
      onPress: () => this._press(e),
      ...ie(n) ? { onHold: s(n) } : {},
      ...ie(a) ? { onDoubleTap: s(a) } : {},
      repeat: t.repeat && i.hold_repeat,
      haptics: i.haptics
    };
  }
  _navigate(e) {
    this._press(e.detail.direction);
  }
  _launch(e) {
    const t = this._device;
    !this.hass || !t || this._run(Ti(this.hass, t, e, this));
  }
  async _sendText() {
    const e = this._device, t = this._text.trim();
    if (!(!this.hass || !e || !t)) {
      this._sending = !0;
      try {
        await Ai(this.hass, e, t), this._text = "";
      } finally {
        this._sending = !1;
      }
    }
  }
  /* ------------------------------------------------------------- header -- */
  _renderHeader(e) {
    const t = this._config, i = e.available ? e.on ? e.appName ?? "On" : "Off" : "Unavailable", o = e.on && e.available ? Te(e.appName) : void 0;
    return c`
      <div class="tile">
        <!-- Not interactive: the icon shows what is playing, and tapping it
             opened a more-info dialog nobody wanted from a remote. -->
        <div class="tile-icon">
          ${o ? c`<span class="brand-mark">${ue[o]}</span>` : c`<ha-icon icon="mdi:television"></ha-icon>`}
        </div>
        <div class="tile-info">
          <div class="primary"><span>${e.name}</span></div>
          <div class="secondary" aria-live="polite"><span>${i}</span></div>
        </div>
        ${t.show_power ? c`
              <button
                class="icon-button"
                type="button"
                aria-label=${e.on ? "Turn off" : "Turn on"}
                ${O(this._pressOptions("power"))}
              >
                <ha-icon icon="mdi:power"></ha-icon>
              </button>
            ` : d}
      </div>
      ${this._renderChips(e)}
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
  _renderChips(e) {
    if (!e.on || !e.available || this._shows("volume")) return d;
    const t = [];
    return e.muted === !0 ? t.push(c`<span class="chip warn"><ha-icon icon="mdi:volume-off"></ha-icon>Muted</span>`) : qe(e) && t.push(c`<span class="chip accent">${Math.round(e.volume * 100)}%</span>`), t.length ? c`<div class="tile" style="padding-top:0;min-height:0">
      <div class="chips">${t}</div>
    </div>` : d;
  }
  /* -------------------------------------------------------------- rows -- */
  _button(e, t, i, o = {}) {
    return c`
      <button
        class="control-button"
        type="button"
        aria-label=${i}
        title=${i}
        ${O(this._pressOptions(e, o))}
      >
        <ha-icon icon=${t}></ha-icon>
      </button>
    `;
  }
  _renderNavigationRow() {
    const e = this._config, t = e.show_power && !e.show_header;
    return c`
      <div class="features">
        ${t ? this._button("power", "mdi:power", "Power") : d}
        ${this._button("back", "mdi:arrow-u-left-top", "Back")}
        ${this._button("home", "mdi:home", "Home")}
        ${this._button("menu", "mdi:menu", "Menu")}
        ${this._config.show_favorite ? this._button("favorite", "mdi:star", "Favourite") : d}
      </div>
    `;
  }
  /**
   * Transport row, masked by what the player actually advertises.
   *
   * Buttons are shown when there is no paired player at all, because the key
   * codes work regardless — it is only the *player* route that needs the bit.
   */
  _renderTransport(e) {
    const t = e.playerId === null, i = t || I(e, x.PREVIOUS_TRACK), o = t || I(e, x.NEXT_TRACK), n = new Set(this._config.transport_buttons), a = [
      n.has("previous") && i ? this._button("previous", "mdi:skip-previous", "Previous") : d,
      n.has("rewind") ? this._button("rewind", "mdi:rewind", "Rewind", { repeat: !0 }) : d,
      n.has("play_pause") ? this._button(
        "play_pause",
        e.playing ? "mdi:pause" : "mdi:play",
        e.playing ? "Pause" : "Play"
      ) : d,
      n.has("fast_forward") ? this._button("fast_forward", "mdi:fast-forward", "Fast forward", { repeat: !0 }) : d,
      n.has("next") && o ? this._button("next", "mdi:skip-next", "Next") : d
    ];
    return c`<div class="features">${a}</div>`;
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
  _renderVolume(e) {
    const t = e.on || e.volumeId !== e.playerId, i = t && e.muted === !0, o = t && e.muted !== void 0, n = t && qe(e) ? Math.round(e.volume * 100) : void 0;
    return c`
      <div class="features">
        ${this._button("volume_down", "mdi:volume-minus", "Volume down", { repeat: !0 })}
        <button
          class="control-button volume-level ${i ? "muted" : ""}"
          type="button"
          aria-label=${i ? "Unmute" : "Mute"}
          aria-pressed=${o ? i ? "true" : "false" : "undefined"}
          ${O(this._pressOptions("volume_mute"))}
        >
          <!-- Read-only by design: androidtv_remote supports VOLUME_STEP but
               not VOLUME_SET, so there is nothing to drag to. -->
          ${n === void 0 ? d : c`<span class="level" style="width:${n}%"></span>`}
          <ha-icon icon=${i ? "mdi:volume-off" : "mdi:volume-high"}></ha-icon>
          ${i ? c`<span class="value">Muted</span>` : n === void 0 ? d : c`<span class="value">${n}%</span>`}
        </button>
        ${this._button("volume_up", "mdi:volume-plus", "Volume up", { repeat: !0 })}
      </div>
    `;
  }
  _renderTextInput() {
    return c`
      <div class="text-row">
        <input
          type="text"
          .value=${this._text}
          placeholder="Type on the TV…"
          aria-label="Text to send to the TV"
          @input=${(e) => {
      this._text = e.target.value;
    }}
          @keydown=${(e) => {
      e.key === "Enter" && this._run(this._sendText());
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
  _renderAppIcon(e) {
    const t = e.icon ?? "mdi:application";
    if (t.startsWith("brand:")) {
      const i = ue[t.slice(6)];
      if (i) return c`${i}`;
    }
    return t.startsWith("/") || t.startsWith("http") ? c`<img src=${t} alt="" />` : c`<ha-icon icon=${t}></ha-icon>`;
  }
  /**
   * One row of tiles.
   *
   * The app launcher is the built-in caller; user-defined sections are the same
   * grid. Their heading, if any, is drawn by the layout rather than here, so a
   * custom section is indistinguishable from a native one.
   */
  _renderSection(e, t, i) {
    if (!e.length) return d;
    const o = this._config;
    return c`
      <div class="app-grid" style="--app-per-row: ${t}">
        ${ei(
      e,
      (n, a) => `${i}:${a}:${n.icon ?? ""}`,
      (n) => {
        const a = this.hass ? yi(this.hass, n) : !1;
        return c`
              <button
                class="app-tile ${a ? "active" : ""}"
                type="button"
                aria-label=${n.name ?? "Launch app"}
                title=${n.name ?? ""}
                aria-pressed=${n.entity ? String(a) : d}
                style=${n.color ? `--app-color:${n.color}` : ""}
                ${O({ onPress: () => this._launch(n), haptics: o.haptics })}
              >
                ${this._renderAppIcon(n)}
              </button>
            `;
      }
    )}
      </div>
    `;
  }
  /**
   * One block of the layout.
   *
   * Every block is drawn here and nowhere else, so the order on screen is the
   * order of the list and nothing can quietly re-sort it -- which is what the
   * old fixed template did: sections came after the remote because that is
   * where they were typed, not because anyone chose it.
   */
  _renderBlock(e, t, i) {
    const o = this._config;
    switch (e.type) {
      case "pad":
        return c`<polr-atv-nav-pad
          .pad=${o.pad}
          .repeat=${o.hold_repeat}
          .haptics=${o.haptics}
          @atv-nav=${this._navigate}
        ></polr-atv-nav-pad>`;
      case "navigation":
        return this._renderNavigationRow();
      case "transport":
        return this._renderTransport(i);
      case "volume":
        return this._renderVolume(i);
      case "text":
        return this._renderTextInput();
      case "apps":
        return this._renderSection(o.apps, o.app_columns, "apps");
      case "section":
        return this._renderSection(
          e.buttons,
          e.columns ?? o.app_columns,
          `s${t}`
        );
    }
  }
  /**
   * The heading above a block, if it is showing them.
   *
   * One name per block and one switch over all of them. Section labels used to
   * govern sections and the launcher alone, because they were the only blocks
   * with a name; now that any block can be called something, it governs any
   * block that is.
   *
   * The count belongs to lists of tiles. "Sound 1" would be counting nothing.
   */
  _renderHeading(e) {
    const t = this._config;
    if (!t.show_section_labels) return d;
    const i = e.type === "section" ? e.buttons : e.type === "apps" ? t.apps : void 0, o = e.name ?? (e.type === "apps" ? "Apps" : void 0);
    return o ? c`<div class="section-head">
      ${o}<span class="grow"></span>
      ${i ? c`<span class="count">${i.length}</span>` : d}
    </div>` : d;
  }
  /**
   * The layout, minus what this device state cannot support.
   *
   * A pad, a transport row and a text field all talk to a TV that is awake, so
   * an off TV drops them -- but only them, and the rest keep their order. The
   * volume row stays when the sound is not the TV's, which is the same rule it
   * follows when the card is on.
   */
  _renderLayout(e) {
    const t = this._config, i = e.on, o = (n) => n.hidden ? !1 : i || n.type === "section" || n.type === "apps" ? !0 : n.type === "volume" && $i(t, e);
    return c`
      ${t.layout.map((n, a) => {
      if (!o(n)) return d;
      const s = this._renderBlock(n, a, e);
      return s === d ? d : c`${this._renderHeading(n)}${s}`;
    })}
    `;
  }
  /* ------------------------------------------------------------ render -- */
  render() {
    if (!this.hass || !this._config) return d;
    const e = this._config, t = this._device;
    if (!t.found)
      return c`
        <ha-card>
          <div class="notice error">
            <ha-icon icon="mdi:alert-circle"></ha-icon>
            <span class="grow">Entity ${e.entity} not found.</span>
          </div>
        </ha-card>
      `;
    const i = ii("media_player", t.on ? "on" : "off"), o = t.available;
    return c`
      <ha-card class=${e.show_header ? "" : "headerless"} style="--tile-color:${i}">
        ${e.show_header ? this._renderHeader(t) : d}
        ${e.show_header && t.playerId === null ? c`<div class="notice warn">
              <ha-icon icon="mdi:information-outline"></ha-icon>
              <span class="grow">
                This device has no media player, so power state, transport and
                volume level are unavailable.
              </span>
            </div>` : d}
        ${o ? c`
              <!--
                The one control an off TV can use, and only when the card is
                showing power at all: "show power" off means something else
                does the switching -- a receiver, an activity, an IR blaster --
                and a card told not to offer power should not go on offering it
                in the one state where it is the only thing on screen.

                No "the TV is off" line to go with it: the header secondary
                already says Off, and the button says Turn on.
              -->
              ${t.on || !e.show_power ? d : c`
                    <div class="features">
                      <button
                        class="control-button accent wide"
                        type="button"
                        ${O(this._pressOptions("power"))}
                      >
                        <ha-icon icon="mdi:power"></ha-icon><span>Turn on</span>
                      </button>
                    </div>
                  `}
              ${this._renderLayout(t)}
            ` : c`<div class="empty-state">This device is unavailable.</div>`}
      </ha-card>
    `;
  }
};
T.styles = [Ee, $t];
T.BLOCK_ROWS = {
  navigation: 1,
  transport: 1,
  volume: 1,
  text: 1,
  apps: 2,
  section: 2
};
J([
  j({ attribute: !1 })
], T.prototype, "hass", 2);
J([
  R()
], T.prototype, "_config", 2);
J([
  R()
], T.prototype, "_text", 2);
J([
  R()
], T.prototype, "_sending", 2);
T = J([
  $e(re)
], T);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: re,
  name: "PoLR Android TV Remote",
  description: "A remote for the Android TV Remote integration, with live state and an app launcher.",
  preview: !0,
  documentationURL: "https://github.com/pathofleastresistor/polr-android-tv-remote-card"
});
console.info(`%c ${re} %c ${Gi} `, "background:#555;color:#fff", "background:#3f51b5;color:#fff");
export {
  Gi as CARD_VERSION,
  T as PolrAndroidTvRemoteCard
};
//# sourceMappingURL=polr-android-tv-remote-card.js.map
