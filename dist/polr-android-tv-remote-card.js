/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const G = globalThis, ut = G.ShadowRoot && (G.ShadyCSS === void 0 || G.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, mt = Symbol(), Et = /* @__PURE__ */ new WeakMap();
let te = class {
  constructor(t, o, i) {
    if (this._$cssResult$ = !0, i !== mt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = o;
  }
  get styleSheet() {
    let t = this.o;
    const o = this.t;
    if (ut && t === void 0) {
      const i = o !== void 0 && o.length === 1;
      i && (t = Et.get(o)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && Et.set(o, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const ge = (e) => new te(typeof e == "string" ? e : e + "", void 0, mt), vt = (e, ...t) => {
  const o = e.length === 1 ? e[0] : t.reduce((i, r, a) => i + ((s) => {
    if (s._$cssResult$ === !0) return s.cssText;
    if (typeof s == "number") return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[a + 1], e[0]);
  return new te(o, e, mt);
}, be = (e, t) => {
  if (ut) e.adoptedStyleSheets = t.map((o) => o instanceof CSSStyleSheet ? o : o.styleSheet);
  else for (const o of t) {
    const i = document.createElement("style"), r = G.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = o.cssText, e.appendChild(i);
  }
}, St = ut ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let o = "";
  for (const i of t.cssRules) o += i.cssText;
  return ge(o);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ye, defineProperty: we, getOwnPropertyDescriptor: $e, getOwnPropertyNames: xe, getOwnPropertySymbols: Ae, getPrototypeOf: ke } = Object, et = globalThis, Tt = et.trustedTypes, Ee = Tt ? Tt.emptyScript : "", Se = et.reactiveElementPolyfillSupport, F = (e, t) => e, J = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Ee : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let o = e;
  switch (t) {
    case Boolean:
      o = e !== null;
      break;
    case Number:
      o = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        o = JSON.parse(e);
      } catch {
        o = null;
      }
  }
  return o;
} }, _t = (e, t) => !ye(e, t), Pt = { attribute: !0, type: String, converter: J, reflect: !1, useDefault: !1, hasChanged: _t };
Symbol.metadata ??= Symbol("metadata"), et.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let U = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, o = Pt) {
    if (o.state && (o.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((o = Object.create(o)).wrapped = !0), this.elementProperties.set(t, o), !o.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(t, i, o);
      r !== void 0 && we(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, o, i) {
    const { get: r, set: a } = $e(this.prototype, t) ?? { get() {
      return this[o];
    }, set(s) {
      this[o] = s;
    } };
    return { get: r, set(s) {
      const c = r?.call(this);
      a?.call(this, s), this.requestUpdate(t, c, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Pt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(F("elementProperties"))) return;
    const t = ke(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(F("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(F("properties"))) {
      const o = this.properties, i = [...xe(o), ...Ae(o)];
      for (const r of i) this.createProperty(r, o[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const o = litPropertyMetadata.get(t);
      if (o !== void 0) for (const [i, r] of o) this.elementProperties.set(i, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [o, i] of this.elementProperties) {
      const r = this._$Eu(o, i);
      r !== void 0 && this._$Eh.set(r, o);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const o = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const r of i) o.unshift(St(r));
    } else t !== void 0 && o.push(St(t));
    return o;
  }
  static _$Eu(t, o) {
    const i = o.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
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
    const t = /* @__PURE__ */ new Map(), o = this.constructor.elementProperties;
    for (const i of o.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return be(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, o, i) {
    this._$AK(t, i);
  }
  _$ET(t, o) {
    const i = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, i);
    if (r !== void 0 && i.reflect === !0) {
      const a = (i.converter?.toAttribute !== void 0 ? i.converter : J).toAttribute(o, i.type);
      this._$Em = t, a == null ? this.removeAttribute(r) : this.setAttribute(r, a), this._$Em = null;
    }
  }
  _$AK(t, o) {
    const i = this.constructor, r = i._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const a = i.getPropertyOptions(r), s = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : J;
      this._$Em = r;
      const c = s.fromAttribute(o, a.type);
      this[r] = c ?? this._$Ej?.get(r) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, o, i, r = !1, a) {
    if (t !== void 0) {
      const s = this.constructor;
      if (r === !1 && (a = this[t]), i ??= s.getPropertyOptions(t), !((i.hasChanged ?? _t)(a, o) || i.useDefault && i.reflect && a === this._$Ej?.get(t) && !this.hasAttribute(s._$Eu(t, i)))) return;
      this.C(t, o, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, o, { useDefault: i, reflect: r, wrapped: a }, s) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, s ?? o ?? this[t]), a !== !0 || s !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (o = void 0), this._$AL.set(t, o)), r === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (o) {
      Promise.reject(o);
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
        for (const [r, a] of this._$Ep) this[r] = a;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [r, a] of i) {
        const { wrapped: s } = a, c = this[r];
        s !== !0 || this._$AL.has(r) || c === void 0 || this.C(r, void 0, a, c);
      }
    }
    let t = !1;
    const o = this._$AL;
    try {
      t = this.shouldUpdate(o), t ? (this.willUpdate(o), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(o)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(o);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((o) => o.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
    this._$Eq &&= this._$Eq.forEach((o) => this._$ET(o, this[o])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
U.elementStyles = [], U.shadowRootOptions = { mode: "open" }, U[F("elementProperties")] = /* @__PURE__ */ new Map(), U[F("finalized")] = /* @__PURE__ */ new Map(), Se?.({ ReactiveElement: U }), (et.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ft = globalThis, Ct = (e) => e, Q = ft.trustedTypes, Ot = Q ? Q.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ee = "$lit$", A = `lit$${Math.random().toFixed(9).slice(2)}$`, oe = "?" + A, Te = `<${oe}>`, O = document, Y = () => O.createComment(""), X = (e) => e === null || typeof e != "object" && typeof e != "function", gt = Array.isArray, Pe = (e) => gt(e) || typeof e?.[Symbol.iterator] == "function", nt = `[ 	
\f\r]`, j = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, zt = /-->/g, Mt = />/g, k = RegExp(`>|${nt}(?:([^\\s"'>=/]+)(${nt}*=${nt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Rt = /'/g, Ut = /"/g, ie = /^(?:script|style|textarea|title)$/i, re = (e) => (t, ...o) => ({ _$litType$: e, strings: t, values: o }), p = re(1), Ce = re(2), w = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), Dt = /* @__PURE__ */ new WeakMap(), P = O.createTreeWalker(O, 129);
function ae(e, t) {
  if (!gt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ot !== void 0 ? Ot.createHTML(t) : t;
}
const Oe = (e, t) => {
  const o = e.length - 1, i = [];
  let r, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", s = j;
  for (let c = 0; c < o; c++) {
    const n = e[c];
    let m, _, l = -1, h = 0;
    for (; h < n.length && (s.lastIndex = h, _ = s.exec(n), _ !== null); ) h = s.lastIndex, s === j ? _[1] === "!--" ? s = zt : _[1] !== void 0 ? s = Mt : _[2] !== void 0 ? (ie.test(_[2]) && (r = RegExp("</" + _[2], "g")), s = k) : _[3] !== void 0 && (s = k) : s === k ? _[0] === ">" ? (s = r ?? j, l = -1) : _[1] === void 0 ? l = -2 : (l = s.lastIndex - _[2].length, m = _[1], s = _[3] === void 0 ? k : _[3] === '"' ? Ut : Rt) : s === Ut || s === Rt ? s = k : s === zt || s === Mt ? s = j : (s = k, r = void 0);
    const u = s === k && e[c + 1].startsWith("/>") ? " " : "";
    a += s === j ? n + Te : l >= 0 ? (i.push(m), n.slice(0, l) + ee + n.slice(l) + A + u) : n + A + (l === -2 ? c : u);
  }
  return [ae(e, a + (e[o] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class q {
  constructor({ strings: t, _$litType$: o }, i) {
    let r;
    this.parts = [];
    let a = 0, s = 0;
    const c = t.length - 1, n = this.parts, [m, _] = Oe(t, o);
    if (this.el = q.createElement(m, i), P.currentNode = this.el.content, o === 2 || o === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (r = P.nextNode()) !== null && n.length < c; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const l of r.getAttributeNames()) if (l.endsWith(ee)) {
          const h = _[s++], u = r.getAttribute(l).split(A), v = /([.?@])?(.*)/.exec(h);
          n.push({ type: 1, index: a, name: v[2], strings: u, ctor: v[1] === "." ? Me : v[1] === "?" ? Re : v[1] === "@" ? Ue : ot }), r.removeAttribute(l);
        } else l.startsWith(A) && (n.push({ type: 6, index: a }), r.removeAttribute(l));
        if (ie.test(r.tagName)) {
          const l = r.textContent.split(A), h = l.length - 1;
          if (h > 0) {
            r.textContent = Q ? Q.emptyScript : "";
            for (let u = 0; u < h; u++) r.append(l[u], Y()), P.nextNode(), n.push({ type: 2, index: ++a });
            r.append(l[h], Y());
          }
        }
      } else if (r.nodeType === 8) if (r.data === oe) n.push({ type: 2, index: a });
      else {
        let l = -1;
        for (; (l = r.data.indexOf(A, l + 1)) !== -1; ) n.push({ type: 7, index: a }), l += A.length - 1;
      }
      a++;
    }
  }
  static createElement(t, o) {
    const i = O.createElement("template");
    return i.innerHTML = t, i;
  }
}
function H(e, t, o = e, i) {
  if (t === w) return t;
  let r = i !== void 0 ? o._$Co?.[i] : o._$Cl;
  const a = X(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== a && (r?._$AO?.(!1), a === void 0 ? r = void 0 : (r = new a(e), r._$AT(e, o, i)), i !== void 0 ? (o._$Co ??= [])[i] = r : o._$Cl = r), r !== void 0 && (t = H(e, r._$AS(e, t.values), r, i)), t;
}
class ze {
  constructor(t, o) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = o;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: o }, parts: i } = this._$AD, r = (t?.creationScope ?? O).importNode(o, !0);
    P.currentNode = r;
    let a = P.nextNode(), s = 0, c = 0, n = i[0];
    for (; n !== void 0; ) {
      if (s === n.index) {
        let m;
        n.type === 2 ? m = new I(a, a.nextSibling, this, t) : n.type === 1 ? m = new n.ctor(a, n.name, n.strings, this, t) : n.type === 6 && (m = new De(a, this, t)), this._$AV.push(m), n = i[++c];
      }
      s !== n?.index && (a = P.nextNode(), s++);
    }
    return P.currentNode = O, r;
  }
  p(t) {
    let o = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, o), o += i.strings.length - 2) : i._$AI(t[o])), o++;
  }
}
class I {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, o, i, r) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = o, this._$AM = i, this.options = r, this._$Cv = r?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const o = this._$AM;
    return o !== void 0 && t?.nodeType === 11 && (t = o.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, o = this) {
    t = H(this, t, o), X(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== w && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Pe(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && X(this._$AH) ? this._$AA.nextSibling.data = t : this.T(O.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: o, _$litType$: i } = t, r = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = q.createElement(ae(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === r) this._$AH.p(o);
    else {
      const a = new ze(r, this), s = a.u(this.options);
      a.p(o), this.T(s), this._$AH = a;
    }
  }
  _$AC(t) {
    let o = Dt.get(t.strings);
    return o === void 0 && Dt.set(t.strings, o = new q(t)), o;
  }
  k(t) {
    gt(this._$AH) || (this._$AH = [], this._$AR());
    const o = this._$AH;
    let i, r = 0;
    for (const a of t) r === o.length ? o.push(i = new I(this.O(Y()), this.O(Y()), this, this.options)) : i = o[r], i._$AI(a), r++;
    r < o.length && (this._$AR(i && i._$AB.nextSibling, r), o.length = r);
  }
  _$AR(t = this._$AA.nextSibling, o) {
    for (this._$AP?.(!1, !0, o); t !== this._$AB; ) {
      const i = Ct(t).nextSibling;
      Ct(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class ot {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, o, i, r, a) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = o, this._$AM = r, this.options = a, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = d;
  }
  _$AI(t, o = this, i, r) {
    const a = this.strings;
    let s = !1;
    if (a === void 0) t = H(this, t, o, 0), s = !X(t) || t !== this._$AH && t !== w, s && (this._$AH = t);
    else {
      const c = t;
      let n, m;
      for (t = a[0], n = 0; n < a.length - 1; n++) m = H(this, c[i + n], o, n), m === w && (m = this._$AH[n]), s ||= !X(m) || m !== this._$AH[n], m === d ? t = d : t !== d && (t += (m ?? "") + a[n + 1]), this._$AH[n] = m;
    }
    s && !r && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Me extends ot {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class Re extends ot {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class Ue extends ot {
  constructor(t, o, i, r, a) {
    super(t, o, i, r, a), this.type = 5;
  }
  _$AI(t, o = this) {
    if ((t = H(this, t, o, 0) ?? d) === w) return;
    const i = this._$AH, r = t === d && i !== d || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, a = t !== d && (i === d || r);
    r && this.element.removeEventListener(this.name, this, i), a && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class De {
  constructor(t, o, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = o, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    H(this, t);
  }
}
const Ne = { I }, He = ft.litHtmlPolyfillSupport;
He?.(q, I), (ft.litHtmlVersions ??= []).push("3.3.3");
const Ie = (e, t, o) => {
  const i = o?.renderBefore ?? t;
  let r = i._$litPart$;
  if (r === void 0) {
    const a = o?.renderBefore ?? null;
    i._$litPart$ = r = new I(t.insertBefore(Y(), a), a, void 0, o ?? {});
  }
  return r._$AI(e), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const bt = globalThis;
let C = class extends U {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const o = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ie(o, this.renderRoot, this.renderOptions);
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
C._$litElement$ = !0, C.finalized = !0, bt.litElementHydrateSupport?.({ LitElement: C });
const Le = bt.litElementPolyfillSupport;
Le?.({ LitElement: C });
(bt.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const yt = (e) => (t, o) => {
  o !== void 0 ? o.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ve = { attribute: !0, type: String, converter: J, reflect: !1, hasChanged: _t }, je = (e = Ve, t, o) => {
  const { kind: i, metadata: r } = o;
  let a = globalThis.litPropertyMetadata.get(r);
  if (a === void 0 && globalThis.litPropertyMetadata.set(r, a = /* @__PURE__ */ new Map()), i === "setter" && ((e = Object.create(e)).wrapped = !0), a.set(o.name, e), i === "accessor") {
    const { name: s } = o;
    return { set(c) {
      const n = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(s, n, e, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(s, void 0, e, c), c;
    } };
  }
  if (i === "setter") {
    const { name: s } = o;
    return function(c) {
      const n = this[s];
      t.call(this, c), this.requestUpdate(s, n, e, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function L(e) {
  return (t, o) => typeof o == "object" ? je(e, t, o) : ((i, r, a) => {
    const s = r.hasOwnProperty(a);
    return r.constructor.createProperty(a, i), s ? Object.getOwnPropertyDescriptor(r, a) : void 0;
  })(e, t, o);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function V(e) {
  return L({ ...e, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Be = (e, t, o) => (o.configurable = !0, o.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, o), o);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function se(e, t) {
  return (o, i, r) => {
    const a = (s) => s.renderRoot?.querySelector(e) ?? null;
    return Be(o, i, { get() {
      return a(this);
    } });
  };
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const wt = { CHILD: 2, ELEMENT: 6 }, ne = (e) => (...t) => ({ _$litDirective$: e, values: t });
let ce = class {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, o, i) {
    this._$Ct = t, this._$AM = o, this._$Ci = i;
  }
  _$AS(t, o) {
    return this.update(t, o);
  }
  update(t, o) {
    return this.render(...o);
  }
};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { I: Ke } = Ne, Nt = (e) => e, Fe = (e) => e.strings === void 0, Ht = () => document.createComment(""), B = (e, t, o) => {
  const i = e._$AA.parentNode, r = t === void 0 ? e._$AB : t._$AA;
  if (o === void 0) {
    const a = i.insertBefore(Ht(), r), s = i.insertBefore(Ht(), r);
    o = new Ke(a, s, e, e.options);
  } else {
    const a = o._$AB.nextSibling, s = o._$AM, c = s !== e;
    if (c) {
      let n;
      o._$AQ?.(e), o._$AM = e, o._$AP !== void 0 && (n = e._$AU) !== s._$AU && o._$AP(n);
    }
    if (a !== r || c) {
      let n = o._$AA;
      for (; n !== a; ) {
        const m = Nt(n).nextSibling;
        Nt(i).insertBefore(n, r), n = m;
      }
    }
  }
  return o;
}, E = (e, t, o = e) => (e._$AI(t, o), e), We = {}, Ye = (e, t = We) => e._$AH = t, Xe = (e) => e._$AH, ct = (e) => {
  e._$AR(), e._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const It = (e, t, o) => {
  const i = /* @__PURE__ */ new Map();
  for (let r = t; r <= o; r++) i.set(e[r], r);
  return i;
}, qe = ne(class extends ce {
  constructor(e) {
    if (super(e), e.type !== wt.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(e, t, o) {
    let i;
    o === void 0 ? o = t : t !== void 0 && (i = t);
    const r = [], a = [];
    let s = 0;
    for (const c of e) r[s] = i ? i(c, s) : s, a[s] = o(c, s), s++;
    return { values: a, keys: r };
  }
  render(e, t, o) {
    return this.dt(e, t, o).values;
  }
  update(e, [t, o, i]) {
    const r = Xe(e), { values: a, keys: s } = this.dt(t, o, i);
    if (!Array.isArray(r)) return this.ut = s, a;
    const c = this.ut ??= [], n = [];
    let m, _, l = 0, h = r.length - 1, u = 0, v = a.length - 1;
    for (; l <= h && u <= v; ) if (r[l] === null) l++;
    else if (r[h] === null) h--;
    else if (c[l] === s[u]) n[u] = E(r[l], a[u]), l++, u++;
    else if (c[h] === s[v]) n[v] = E(r[h], a[v]), h--, v--;
    else if (c[l] === s[v]) n[v] = E(r[l], a[v]), B(e, n[v + 1], r[l]), l++, v--;
    else if (c[h] === s[u]) n[u] = E(r[h], a[u]), B(e, r[l], r[h]), h--, u++;
    else if (m === void 0 && (m = It(s, u, v), _ = It(c, l, h)), m.has(c[l])) if (m.has(c[h])) {
      const b = _.get(s[u]), st = b !== void 0 ? r[b] : null;
      if (st === null) {
        const kt = B(e, r[l]);
        E(kt, a[u]), n[u] = kt;
      } else n[u] = E(st, a[u]), B(e, r[l], st), r[b] = null;
      u++;
    } else ct(r[h]), h--;
    else ct(r[l]), l++;
    for (; u <= v; ) {
      const b = B(e, n[v + 1]);
      E(b, a[u]), n[u++] = b;
    }
    for (; l <= h; ) {
      const b = r[l++];
      b !== null && ct(b);
    }
    return this.ut = s, Ye(e, n), w;
  }
}), it = (e, t, o) => {
  e.dispatchEvent(
    new CustomEvent(t, { detail: o, bubbles: !0, composed: !0 })
  );
}, Ze = (e, t) => it(e, "hass-more-info", { entityId: t }), Ge = (e, t, o = "var(--state-inactive-color, #9e9e9e)") => t === "unavailable" || t === "unknown" ? "var(--state-unavailable-color, var(--disabled-color))" : `var(--state-${e}-${t}-color, var(--state-icon-color, ${o}))`, Je = (e) => typeof e == "object" && e !== null && !Array.isArray(e), K = (e) => Je(e) && typeof e.action == "string", pt = (e) => e !== void 0 && e.action !== "none", $t = (e) => {
  const t = (e ?? "").split(".");
  if (t.length !== 2) return null;
  const [o, i] = t;
  return !o || !i ? null : [o, i];
}, Lt = (e, t, o) => ({
  action: "perform-action",
  perform_action: e,
  ...t ? { data: t } : {},
  ...o ? { target: o } : {}
}), le = (e, t, o, i) => {
  switch (o.action) {
    case "none":
      return Promise.resolve();
    case "more-info": {
      const r = o.entity ?? i;
      return r && e && Ze(e, r), Promise.resolve();
    }
    case "toggle": {
      const r = i;
      return r ? t.callService("homeassistant", "toggle", { entity_id: r }) : Promise.resolve();
    }
    case "navigate":
      return history.pushState(null, "", o.navigation_path), window.dispatchEvent(
        new CustomEvent("location-changed", { detail: { replace: !1 } })
      ), Promise.resolve();
    case "url":
      return window.open(o.url_path, "_blank", "noreferrer"), Promise.resolve();
    case "perform-action":
    case "call-service": {
      const r = o.action === "perform-action" ? o.perform_action : o.service, a = $t(r);
      if (!a)
        return Promise.reject(
          new Error(`polr-android-tv-remote-card: invalid action "${r}"`)
        );
      const [s, c] = a, n = o.action === "perform-action" ? o.data : o.data ?? o.service_data;
      return t.callService(s, c, n ?? {}, o.target);
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
}, Qe = {
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
}, to = "text:", pe = (e, t) => {
  const o = e.entities?.[t.entity]?.device_id;
  if (!o) return null;
  for (const i of Object.values(e.entities ?? {}))
    if (i.device_id === o && i.entity_id.startsWith("media_player."))
      return i.entity_id;
  return null;
}, lt = (e) => e === void 0 || e.state === "unavailable" || e.state === "unknown", eo = (e, t) => {
  const o = e.states?.[t.entity], i = pe(e, t), r = i ? e.states?.[i] : void 0, a = r?.attributes ?? {}, s = o?.attributes ?? {}, c = t.volume_entity ?? i, m = (t.volume_entity && t.volume_entity !== i ? e.states?.[t.volume_entity] : r)?.attributes ?? {}, _ = r && !lt(r) ? r.state !== "off" : o?.state === "on";
  return {
    remoteId: t.entity,
    playerId: i,
    remote: o,
    player: r,
    found: o !== void 0,
    available: !lt(o) && (r === void 0 || !lt(r)),
    on: _,
    name: t.name ?? s.friendly_name ?? t.entity,
    // app_name is all the integration provides. It never sets media_title or
    // entity_picture, so there is no now-playing text or artwork to read.
    appName: a.app_name ?? s.current_activity,
    appId: a.app_id,
    playing: r?.state === "playing",
    features: a.supported_features ?? 0,
    volumeId: c,
    volumeFeatures: m.supported_features ?? 0,
    volume: typeof m.volume_level == "number" ? m.volume_level : void 0,
    muted: typeof m.is_volume_muted == "boolean" ? m.is_volume_muted : void 0
  };
}, D = (e, t) => (e.features & t) !== 0, Vt = (e, t) => (e.volumeFeatures & t) !== 0, jt = (e) => e.volume !== void 0, oo = (e, t) => {
  const o = $t(t.service);
  return o ? e.callService(o[0], o[1], t.data ?? {}, t.target) : Promise.reject(
    new Error(`polr-android-tv-remote-card: invalid service "${t.service}"`)
  );
}, xt = (e, t, o) => e.callService("remote", "send_command", {
  entity_id: t.remoteId,
  command: o
}), io = (e, t, o) => xt(e, t, `${to}${o}`), ro = (e, t, o, i, r) => {
  const a = t.overrides[i]?.tap_action;
  if (pt(a))
    return le(r, e, a, o.remoteId);
  if (a && a.action === "none") return Promise.resolve();
  const s = o.playerId;
  switch (i) {
    case "power":
      return s && D(o, o.on ? y.TURN_OFF : y.TURN_ON) ? e.callService(
        "media_player",
        o.on ? "turn_off" : "turn_on",
        { entity_id: s }
      ) : e.callService("remote", o.on ? "turn_off" : "turn_on", {
        entity_id: o.remoteId
      });
    case "play_pause":
      if (s && D(o, y.PAUSE))
        return e.callService("media_player", "media_play_pause", {
          entity_id: s
        });
      break;
    case "next":
      if (s && D(o, y.NEXT_TRACK))
        return e.callService("media_player", "media_next_track", {
          entity_id: s
        });
      break;
    case "previous":
      if (s && D(o, y.PREVIOUS_TRACK))
        return e.callService("media_player", "media_previous_track", {
          entity_id: s
        });
      break;
    case "volume_up":
    case "volume_down":
      if (o.volumeId && Vt(o, y.VOLUME_STEP))
        return e.callService(
          "media_player",
          i === "volume_up" ? "volume_up" : "volume_down",
          { entity_id: o.volumeId }
        );
      break;
    case "volume_mute":
      if (o.volumeId && o.muted !== void 0 && Vt(o, y.VOLUME_MUTE))
        return e.callService("media_player", "volume_mute", {
          entity_id: o.volumeId,
          is_volume_muted: !o.muted
        });
      break;
  }
  const c = Qe[i];
  return c ? xt(e, o, c) : Promise.resolve();
}, ao = (e, t, o) => {
  switch (o.action) {
    case "activity":
      return e.callService("remote", "turn_on", {
        entity_id: t.remoteId,
        activity: o.activity
      });
    case "app":
      return t.playerId ? e.callService("media_player", "play_media", {
        entity_id: t.playerId,
        media_content_type: "app",
        media_content_id: o.app_id
      }) : Promise.reject(
        new Error(
          "polr-android-tv-remote-card: launching by app id needs the device's media_player, which was not found"
        )
      );
    case "key":
      return xt(e, t, o.key);
    case "service":
      return oo(e, o);
  }
}, so = (e) => {
  switch (e.action) {
    case "activity":
      return `Launch ${e.activity}`;
    case "app":
      return `Open app ${e.app_id}`;
    case "key":
      return `Send ${e.key}`;
    case "service":
      return `Call ${e.service}`;
  }
}, no = ["buttons", "dpad", "touchpad"], co = {
  button: "press",
  input_button: "press",
  scene: "turn_on",
  script: "turn_on",
  automation: "trigger"
}, lo = (e) => {
  const t = $t(e);
  if (!t) return null;
  const o = co[t[0]];
  return o ? { service: `${t[0]}.${o}`, target: { entity_id: e } } : null;
}, f = {
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
}, S = {
  disneyplus: { label: "Disney+", activity: "https://www.disneyplus.com" },
  hbomax: { label: "HBO Max", activity: "https://play.hbomax.com" },
  hulu: { label: "Hulu", activity: "HULU" },
  netflix: { label: "Netflix", activity: "https://www.netflix.com/title" },
  prime: { label: "Prime Video", activity: "https://app.primevideo.com" },
  youtube: { label: "YouTube", activity: "https://www.youtube.com" }
}, dt = Object.keys(S), de = (e) => {
  if (!e) return;
  const t = e.toLowerCase().replace(/[^a-z]/g, "");
  if (t)
    return dt.find((o) => t.includes(o) || o.includes(t));
}, he = {
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
}, ue = {
  showRemote: "show_nav",
  showApps: "show_apps",
  showVolume: "show_volume",
  showMedia: "show_transport",
  showURLSearch: "show_text_input"
}, po = {
  default: "buttons",
  touch: "touchpad",
  dpad: "dpad"
}, g = (e) => typeof e == "object" && e !== null && !Array.isArray(e), me = (e) => g(e) && typeof e.service == "string", Bt = (e, t) => {
  if (typeof e == "string") {
    const o = lo(e);
    if (o)
      return { tap_action: Lt(o.service, void 0, o.target) };
    N(
      `override "${t}" points at ${e}, which cannot simply be pressed. Use an action config instead.`
    );
    return;
  }
  if (!g(e)) {
    e !== void 0 && N(`override "${t}" is not an entity id or an action config`);
    return;
  }
  if (K(e.tap_action) || K(e.hold_action) || K(e.double_tap_action)) {
    const o = {};
    for (const i of ["tap_action", "hold_action", "double_tap_action"]) {
      const r = e[i];
      K(r) && (o[i] = r);
    }
    return o;
  }
  if (me(e))
    return {
      tap_action: Lt(
        e.service,
        g(e.data) ? e.data : void 0,
        g(e.target) ? e.target : void 0
      )
    };
  N(`override "${t}" is not an entity id or an action config`);
};
let Kt = /* @__PURE__ */ new Set();
const N = (e) => {
  Kt.has(e) || (Kt.add(e), console.warn(`polr-android-tv-remote-card: ${e}`));
}, ho = (e) => {
  if (typeof e == "string") {
    const r = S[e];
    return r ? {
      name: r.label,
      icon: `brand:${e}`,
      action: { action: "activity", activity: r.activity }
    } : (N(
      `unknown app "${e}" — treating it as an activity. Use an object with an icon and action instead.`
    ), {
      name: e,
      icon: "mdi:application",
      action: { action: "activity", activity: e }
    });
  }
  if (!g(e)) return null;
  if (g(e.action))
    return e;
  const t = typeof e.icon == "string" ? e.icon : void 0, o = typeof e.name == "string" ? e.name : void 0, i = typeof e.color == "string" ? e.color : void 0;
  return me(e) ? {
    ...o ? { name: o } : {},
    ...t ? { icon: t } : {},
    ...i ? { color: i } : {},
    action: {
      action: "service",
      service: e.service,
      ...g(e.data) ? { data: e.data } : {},
      ...g(e.target) ? { target: e.target } : {}
    }
  } : typeof e.url == "string" ? {
    ...o ? { name: o } : {},
    ...t ? { icon: t } : {},
    ...i ? { color: i } : {},
    action: { action: "activity", activity: e.url }
  } : (N(`app entry has no action, url or service and was skipped: ${JSON.stringify(e)}`), null);
}, ve = (e) => {
  if (!g(e))
    throw new Error("polr-android-tv-remote-card: invalid configuration");
  const t = typeof e.entity == "string" ? e.entity : typeof e.entity_id == "string" ? e.entity_id : void 0;
  if (!t)
    throw new Error("polr-android-tv-remote-card: 'entity' is required");
  const o = typeof e.remote == "string" ? po[e.remote] : void 0;
  typeof e.remote == "string" && !o && N(`unknown remote style "${e.remote}" — falling back to ${f.pad}`);
  const i = no.includes(e.pad) ? e.pad : o ?? f.pad, r = typeof e.volume == "boolean" ? e.volume : void 0, a = {};
  if (g(e.overrides))
    for (const [h, u] of Object.entries(e.overrides)) {
      const v = Bt(u, h);
      v && (a[h] = v);
    }
  for (const [h, u] of Object.entries(he)) {
    if (a[u]) continue;
    const v = Bt(e[h], h);
    v && (a[u] = v);
  }
  const s = {};
  for (const [h, u] of Object.entries(ue))
    typeof e[h] == "boolean" && (s[u] = e[h]);
  const c = Array.isArray(e.transport_buttons) ? e.transport_buttons : Array.isArray(e.media_controls) ? e.media_controls : void 0, n = c ? c.filter(
    (h) => typeof h == "string" && f.transport_buttons.includes(h)
  ) : f.transport_buttons, _ = (Array.isArray(e.apps) ? e.apps : []).map(ho).filter((h) => h !== null), l = (h, u) => h === void 0 ? u : h;
  return {
    ...e,
    type: e.type,
    entity: t,
    ...typeof e.volume_entity == "string" ? { volume_entity: e.volume_entity } : {},
    ...typeof e.name == "string" ? { name: e.name } : {},
    show_header: l(e.show_header, f.show_header),
    show_power: l(e.show_power, f.show_power),
    show_nav: l(e.show_nav, s.show_nav ?? f.show_nav),
    pad: i,
    show_transport: l(e.show_transport, s.show_transport ?? f.show_transport),
    transport_buttons: n,
    show_volume: l(e.show_volume, s.show_volume ?? r ?? f.show_volume),
    show_text_input: l(
      e.show_text_input,
      s.show_text_input ?? f.show_text_input
    ),
    show_apps: l(e.show_apps, s.show_apps ?? f.show_apps),
    show_section_labels: l(e.show_section_labels, f.show_section_labels),
    // v1 always drew a favourite button on the default pad, and threw when it
    // had no override to call. Draw it only when it does something.
    show_favorite: a.favorite !== void 0,
    apps: _,
    // "auto" was the v2-beta spelling, before the tiles became fixed-width.
    app_columns: typeof e.app_columns == "number" && e.app_columns > 0 ? e.app_columns : f.app_columns,
    hold_repeat: l(e.hold_repeat, f.hold_repeat),
    haptics: l(e.haptics, f.haptics),
    overrides: a
  };
}, uo = (e) => {
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
    ...Object.keys(ue),
    ...Object.keys(he)
  ]), o = {};
  for (const [i, r] of Object.entries(e))
    t.has(i) || (o[i] = r);
  return o;
}, R = (e) => Ce`
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="${e}" />
  </svg>
`, ht = {
  disneyplus: R(
    "M2.056 6.834C1.572 6.834 1 6.77 1 6.483c0-2.023 3.562-2.11 5.08-2.11 1.978 0 4.506.614 6.66 1.384 3.277 1.188 9.917 5.145 9.917 9.674 0 4.001-4.31 5.914-8.311 5.914a22.376 22.376 0 0 1-3.21-.33c-.066.243-.11.418-.264.924-.253.052-.511.081-.77.087l-.505-.043c-.33-.396-.44-1.033-.572-1.715-2-1.165-3.298-2.155-3.891-2.836-.506-.528-1.078-1.232-1.078-1.913 0-.351.22-.66.726-1.01 1.034-.77 2.352-1.188 4.507-1.563l.044-.9c.022-.22.242-2.573.748-3.013.813.66.901 1.341.967 2.353.022.44.044.901.11 1.385h.308c1.539 0 6.244.395 6.244 2.616 0 .528-.77 1.517-1.518 1.517a1.9 1.9 0 0 1-.966-.285c.329-.375.813-.704.945-.99-.44-.528-2.814-1.143-4.551-1.143a4.043 4.043 0 0 0-.572.022l.022 4.815c.703.44 1.561.483 2.11.483 2.42 0 7.431-.417 7.431-4.331 0-3.87-4.946-6.86-8.64-8.266a21.394 21.394 0 0 0-7.937-1.496 7.22 7.22 0 0 0-1.803.198c-.373.088-.505.176-.505.264 0 .153.747.242.836.286a.221.221 0 0 1 .11.175.26.26 0 0 1-.088.176c-.089 0-.286.022-.528.022zM9.2 14.551c-2.176.177-4.595.397-4.595 1.166 0 .594 1.012 1.32 1.627 1.781a7.052 7.052 0 0 0 2.77 1.319zm11.155-9.85c-.02.428-.042.942-.042 1.723 0 .3 0 .642.01 1.027-.042.193-.32.214-.46.278a1.148 1.148 0 0 1-.256-.192V4.83c0-.29.01-.588.01-1.038 0-.225 0-.482-.01-.792 0-.192.032-.374.15-.802a.342.342 0 0 1 .3-.224c.245.064.491.17.577.374-.257.76-.235 1.594-.279 2.353zm-.384-.085c.428.021.941.042 1.722.042.3 0 .643 0 1.027-.01.193.041.215.32.279.459-.052.094-.116.18-.193.257H20.1c-.289 0-.589-.01-1.037-.01-.225 0-.482 0-.792.01-.193.002-.375-.03-.803-.149a.346.346 0 0 1-.225-.299c.064-.246.172-.492.374-.578.76.257 1.595.235 2.355.278z"
  ),
  hbomax: R(
    "M8.844 4.249h3.205a2.013 2.013 0 0 1 1.848 1.876c1.607-3.368 6.667-2.217 6.658 1.515.045 3.744-5.026 4.939-6.658 1.568a2.077 2.077 0 0 1-2.07 1.947H8.845Zm-5.395 0h1.92v2.58h1.213V4.253H8.46v6.902H6.586V8.48H5.373v2.676H3.449ZM9.872 19.83h-.576a.603.603 0 0 1-.6-.57c0-.013-.007-.023-.007-.035v-3.667a1.192 1.192 0 0 0-1.279-1.21 1.192 1.192 0 0 0-1.279 1.211v4.167a.103.103 0 0 1-.102.103h-.575a.61.61 0 0 1-.61-.611v-3.666a1.319 1.319 0 0 0-.066-.296 1.176 1.176 0 0 0-1.213-.913 1.19 1.19 0 0 0-1.183.817c-.05.131-.079.267-.087.406v4.17a.104.104 0 0 1-.104.102h-.579a.61.61 0 0 1-.61-.61V15.56a2.322 2.322 0 0 1 1.68-2.32c.285-.088.584-.133.883-.133a2.584 2.584 0 0 1 1.92.752 2.588 2.588 0 0 1 1.921-.752 2.608 2.608 0 0 1 1.872.715c.451.465.7 1.09.692 1.738v4.171a.103.103 0 0 1-.098.103zm.428-3.35a3.76 3.76 0 0 1 .568-2.102c.133-.2.29-.38.47-.539a2.958 2.958 0 0 1 2.013-.744 3.014 3.014 0 0 1 1.845.59.61.61 0 0 1 .597-.48h.574a.107.107 0 0 1 .105.103v6.427a.104.104 0 0 1-.104.103h-.573a.61.61 0 0 1-.612-.553c-2.16 1.55-5.14-.164-4.887-2.811Zm12.623 3.35h-.977a.813.813 0 0 1-.675-.357l-1.079-1.6a.356.356 0 0 0-.588 0l-1.08 1.6a.825.825 0 0 1-.245.22.803.803 0 0 1-.43.137h-.978a.075.075 0 0 1-.063-.121l1.18-1.752.744-1.1a.61.61 0 0 0 0-.682l-.05-.075-1.872-2.773a.077.077 0 0 1 .062-.121h.978a.813.813 0 0 1 .674.36l.826 1.221.254.376a.355.355 0 0 0 .59 0l1.08-1.597a.82.82 0 0 1 .673-.36h.978a.077.077 0 0 1 .06.122l-1.925 2.855a.61.61 0 0 0 0 .682l1.929 2.853a.076.076 0 0 1-.066.116zM17.068 9.403c1.567.002 2.356-1.89 1.25-3-1.103-1.11-3-.33-3.003 1.237A1.756 1.756 0 0 0 17.068 9.4zm0-3.14c1.23.003 1.843 1.493.97 2.36-.872.866-2.358.246-2.354-.983a1.38 1.38 0 0 1 1.38-1.378zm-3.719 8.1a1.77 1.77 0 0 0-1.783 1.63 3.15 3.15 0 0 0-.037.489 1.867 1.867 0 0 0 1.82 2.123 1.696 1.696 0 0 0 1.455-.764c.253-.407.381-.88.367-1.36a1.867 1.867 0 0 0-1.822-2.118zm.227-6.191a2.976 2.976 0 0 1 0-.954 1.475 1.475 0 0 1-.723.422c.29.096.544.283.722.533zm-1.486.785a.548.548 0 0 0-.5-.577h-.954v1.17h.954a.553.553 0 0 0 .5-.593zm0-2.595a.55.55 0 0 0-.5-.577h-.954V6.94h.954a.548.548 0 0 0 .5-.578z"
  ),
  hulu: R(
    "m 14.248,8.7019997 h 1.59 V 15.298 h -1.59 z M 5.143,10.764 H 4.124 a 1.4,1.4 0 0 0 -0.36,0.037 C 3.673,10.826 3.615,10.843 3.59,10.851 V 8.7 H 2 v 6.6 h 1.59 v -2.66 a 0.428,0.428 0 0 1 0.124,-0.3 0.4,0.4 0 0 1 0.3,-0.13 h 0.92 a 0.446,0.446 0 0 1 0.435,0.435 V 15.3 h 1.575 v -2.871 a 1.53,1.53 0 0 0 -0.5,-1.261 2,2 0 0 0 -1.301,-0.404 z m 15.267,0 v 2.658 a 0.423,0.423 0 0 1 -0.422,0.423 h -0.932 a 0.423,0.423 0 0 1 -0.422,-0.423 v -2.658 h -1.59 v 2.783 a 1.679,1.679 0 0 0 0.49,1.3 1.874,1.874 0 0 0 1.323,0.453 H 20.41 A 1.47,1.47 0 0 0 21.571,14.816 1.842,1.842 0 0 0 22,13.547 v -2.783 z m -8.957,2.658 a 0.4,0.4 0 0 1 -0.13,0.3 0.43,0.43 0 0 1 -0.3,0.124 H 10.1 A 0.423,0.423 0 0 1 9.678,13.423 V 10.764 H 8.087 v 2.783 a 1.676,1.676 0 0 0 0.491,1.3 1.855,1.855 0 0 0 1.31,0.453 h 1.565 a 1.473,1.473 0 0 0 1.162,-0.484 1.842,1.842 0 0 0 0.429,-1.267 v -2.785 h -1.591 z"
  ),
  netflix: R(
    "M5.94 1v10.994c0 6.045.006 10.996.014 11.004.01.01.382-.029.834-.078a73.701 73.701 0 0 1 1.383-.139 80.63 80.628 0 0 1 2.06-.133c.05 0 .052-.246.058-4.655l.01-4.645.34.964c1.406 3.979 1.77 5.004 2.166 6.117v.002l.206.581.575 1.624c.003.003.292.02.642.038a48.332 48.33 0 0 1 3.37.29c.12.014.227.024.307.03.038.002.044 0 .067 0 .023 0 .062.003.067 0h.006c.003 0 .003-.967.005-1.382l.002-.435c.007-1.783.01-4.836.007-9.181l-.01-10.979h-4.311L13.73 5.88l-.01 4.859v.003l-.398-1.13V9.61v.002l-2.04-5.765v-.013l-.177-.501c-.422-1.195-.781-2.205-.795-2.251L10.28 1H8.107Z"
  ),
  prime: R(
    "M20.182 5.404a4.05 4.05 0 0 0 .625.05 1.116 1.116 0 0 0 .342-.03.474.474 0 0 0 .404-.306.605.605 0 0 0 .015-.276.4.4 0 0 0-.243-.334.88.88 0 0 0-.281-.064.791.791 0 0 0-.833.499 1.438 1.438 0 0 0-.102.367c-.006.088-.006.088.073.094zm-1.074-.4a1.808 1.808 0 0 1 1.633-1.359 2.38 2.38 0 0 1 1.057.102c.655.224 1.009.932.794 1.59a.986.986 0 0 1-.489.588 1.986 1.986 0 0 1-.66.211 3.534 3.534 0 0 1-1.207-.016 1.221 1.221 0 0 0-.146-.023.88.88 0 0 0 .716.954 2.58 2.58 0 0 0 .995 0c.154-.033.302-.065.456-.102.154-.036.218.012.218.17v.392a.242.242 0 0 1-.18.26 3.082 3.082 0 0 1-.626.17 3.247 3.247 0 0 1-1.214-.01 1.663 1.663 0 0 1-1.36-1.272 2.935 2.935 0 0 1 .016-1.656zm.317 6.367a2.588 2.588 0 0 1 1.012.039 1.936 1.936 0 0 1 1.41 1.635v.011h-.014v.1a.078.078 0 0 0 .024.08v-.021l.007.01v.61l-.012.021v-.01c-.03.02-.02.047-.02.08V14c-.048.9-.747 1.63-1.644 1.717a2.627 2.627 0 0 1-.998-.052 1.694 1.694 0 0 1-1.246-1.114 2.825 2.825 0 0 1 0-2.005c.219-.65.8-1.11 1.482-1.175zM12 3.946c0-.043.006-.086.016-.127a.156.156 0 0 1 .147-.102h.67a.19.19 0 0 1 .184.147c.028.075.044.147.07.223.053 0 .086-.036.122-.057a2.743 2.743 0 0 1 .946-.398 1.962 1.962 0 0 1 .795 0c.25.054.47.202.615.413a.25.25 0 0 0 .03.038v.014c.132-.079.271-.164.415-.237a2.382 2.382 0 0 1 1.203-.266 1.061 1.061 0 0 1 1.095 1.027v2.964c0 .238-.03.27-.27.27h-.647a.906.906 0 0 1-.126 0 .147.147 0 0 1-.128-.122.994.994 0 0 1-.01-.175V5.101a.944.944 0 0 0-.033-.293.4.4 0 0 0-.36-.294 1.861 1.861 0 0 0-.912.176.087.087 0 0 0-.063.096v2.788a.774.774 0 0 1-.01.155c0 .07-.058.127-.128.127h-.81c-.197 0-.24-.047-.24-.243V5.1a1.24 1.24 0 0 0-.026-.276.4.4 0 0 0-.371-.318 1.874 1.874 0 0 0-.928.18.085.085 0 0 0-.059.103v2.833c0 .195-.044.236-.239.236h-.704c-.188 0-.235-.053-.235-.232zm2.71 9.92a.178.178 0 0 0-.074-.011 2 2 0 0 0 .057.324c.08.337.358.59.7.636a2.664 2.664 0 0 0 1.088-.037c.117-.026.229-.053.345-.085.154-.037.223.023.223.17v.385a.235.235 0 0 1-.19.271 3.36 3.36 0 0 1-1.141.217 2.901 2.901 0 0 1-.796-.079 1.63 1.63 0 0 1-1.215-1.136 2.946 2.946 0 0 1-.02-1.776 1.848 1.848 0 0 1 1.838-1.363c.268-.012.535.023.792.101.44.123.775.48.868.928a1.468 1.468 0 0 1 0 .587.983.983 0 0 1-.535.704 2.166 2.166 0 0 1-.891.23 4.15 4.15 0 0 1-1.055-.067zm-3.133-2.202c.027-.037.012-.075.012-.112V9.847c0-.202.037-.238.238-.238h.734c.161.006.207.044.207.208v5.586c0 .147-.049.201-.196.201h-.69a.19.19 0 0 1-.186-.146.82.82 0 0 0-.057-.185c-.048.008-.069.045-.107.067a1.714 1.714 0 0 1-1.615.276 1.526 1.526 0 0 1-.917-.812 2.495 2.495 0 0 1-.266-1.13 2.999 2.999 0 0 1 .187-1.225 1.66 1.66 0 0 1 .826-.945c.552-.263 1.2-.22 1.713.111a.294.294 0 0 0 .117.059zm-.797-3.817h-.733a.32.32 0 0 1-.075 0 .147.147 0 0 1-.147-.137V3.893c0-.127.054-.176.18-.18a19.455 19.455 0 0 1 .828 0c.122 0 .159.037.17.158v3.67a.982.982 0 0 1-.01.176.134.134 0 0 1-.128.12.456.456 0 0 1-.089 0zm-1.045-5.45a.616.616 0 0 1 .642-.586h.064a.649.649 0 0 1 .248.036.6.6 0 0 1 .411.67.587.587 0 0 1-.506.534.963.963 0 0 1-.355 0 .587.587 0 0 1-.504-.66Zm-3.092 5.2V3.983c0-.244.026-.27.27-.27h.51a.211.211 0 0 1 .238.179c.037.132.07.264.1.408a.161.161 0 0 0 .091-.065 3.514 3.514 0 0 1 .303-.27 1.41 1.41 0 0 1 .964-.293c.138 0 .186.048.197.18.01.18 0 .367 0 .546a.985.985 0 0 1-.012.22.147.147 0 0 1-.147.146 1.812 1.812 0 0 1-.22 0 2.523 2.523 0 0 0-1.027.147c-.074.026-.074.079-.074.138v2.678a.13.13 0 0 1-.128.122.992.992 0 0 1-.132 0v.01h-.69a.784.784 0 0 1-.117 0 .147.147 0 0 1-.126-.132zm.904 3.228a.604.604 0 0 1-.192 0 .998.998 0 0 1-.176-.02.6.6 0 0 1-.466-.7.587.587 0 0 1 .567-.536.473.473 0 0 1 .111 0 .638.638 0 0 1 .313.054c.208.078.35.272.361.494a.624.624 0 0 1-.518.716zm.44.855v3.764a.147.147 0 0 1-.133.159h-.88a.147.147 0 0 1-.162-.128v-.026a.567.567 0 0 1 0-.1v-3.67c0-.164.045-.21.21-.21h.751c.164.007.211.054.211.218zm-1.711.047-.317.844-1.067 2.774c-.01.032-.027.063-.037.095a.261.261 0 0 1-.265.175h-.702a.294.294 0 0 1-.318-.218c-.133-.349-.27-.704-.403-1.055-.318-.832-.641-1.666-.96-2.504a.928.928 0 0 1-.069-.207c-.016-.105.021-.158.128-.158h.901c.128 0 .185.085.218.196.058.201.117.408.18.61.217.733.43 1.479.646 2.217h.01l.096-.308.733-2.46.031-.095a.214.214 0 0 1 .213-.147h.812c.2-.003.243.054.176.245zM1.786 3.82a.377.377 0 0 1 .318-.107h.488a.21.21 0 0 1 .234.18c.01.053.02.106.037.16a.022.022 0 0 0 .02.015.429.429 0 0 0 .11-.08 1.87 1.87 0 0 1 1.586-.354c.48.115.874.454 1.061.91a2.451 2.451 0 0 1 .205.798h-.008c.051.444.011.893-.118 1.321a1.942 1.942 0 0 1-.55.88c-.34.306-.795.448-1.248.388A1.776 1.776 0 0 1 3 7.564c-.039.033-.022.074-.022.113v1.506c0 .329 0 .329-.334.329h-.572a.294.294 0 0 1-.294-.126Zm19.37 15.225a.587.587 0 0 1-.176.2 11.64 11.64 0 0 1-1.962 1.247 15.499 15.499 0 0 1-4.152 1.406 18.226 18.226 0 0 1-2.51.27v.022h-.649v-.018c-.293-.014-.578-.026-.868-.047a15.349 15.349 0 0 1-2.296-.352 15.558 15.558 0 0 1-6.885-3.59c-.185-.164-.36-.333-.54-.503a.405.405 0 0 1-.101-.146.195.195 0 0 1 .098-.256.2.2 0 0 1 .147 0 1.21 1.21 0 0 1 .138.069 20.566 20.566 0 0 0 6.164 2.546 22.087 22.087 0 0 0 2.212.398 20.441 20.441 0 0 0 3.213.146 16.97 16.97 0 0 0 1.724-.146 20.908 20.908 0 0 0 3.935-.896 18.627 18.627 0 0 0 1.973-.776.44.44 0 0 1 .318-.043.33.33 0 0 1 .24.398.578.578 0 0 1-.022.066zm1.028 1.488a3.547 3.547 0 0 1-.615.757.432.432 0 0 1-.17.107.123.123 0 0 1-.169-.124.608.608 0 0 1 .038-.162c.185-.496.366-.99.51-1.504a5.346 5.346 0 0 0 .18-.859 1.65 1.65 0 0 0 0-.318.412.412 0 0 0-.294-.388 2.068 2.068 0 0 0-.509-.095 8.356 8.356 0 0 0-1.459.064l-.641.08c-.07 0-.132 0-.17-.065a.18.18 0 0 1 .014-.19.546.546 0 0 1 .162-.148 3.67 3.67 0 0 1 1.299-.562 6.412 6.412 0 0 1 1.097-.121c.346.001.691.042 1.028.121a1.515 1.515 0 0 1 .276.102c.121.05.206.162.219.293a2.157 2.157 0 0 1 .014.455 5.856 5.856 0 0 1-.806 2.55zm-2.55-5.72a.995.995 0 0 0 .301.01.691.691 0 0 0 .505-.293 1.01 1.01 0 0 0 .147-.308l-.009.014a1.924 1.924 0 0 0 .074-.678 2.449 2.449 0 0 0 0-.293 1.64 1.64 0 0 0-.147-.6.685.685 0 0 0-.483-.376.908.908 0 0 0-.302-.01.694.694 0 0 0-.542.328 1.163 1.163 0 0 0-.147.35 2.89 2.89 0 0 0-.042.933 1.494 1.494 0 0 0 .147.525c.09.207.276.355.497.397zm-3.523-1.96a.473.473 0 0 0-.394-.64c-.026 0-.047-.01-.073-.01a.797.797 0 0 0-.775.302 1.321 1.321 0 0 0-.211.578c-.015.047.01.069.058.073a4.705 4.705 0 0 0 .642.053c.11.006.22-.003.328-.026a.465.465 0 0 0 .425-.33zm-5.981-.255a1.174 1.174 0 0 0-.106.26 2.683 2.683 0 0 0-.065.997 1.48 1.48 0 0 0 .147.536.734.734 0 0 0 .568.391 1.306 1.306 0 0 0 .832-.158.147.147 0 0 0 .086-.147v-.966h.007c0-.323-.01-.641 0-.968a.147.147 0 0 0-.096-.156 1.614 1.614 0 0 0-.817-.147.678.678 0 0 0-.556.358zM3.855 7.051a.747.747 0 0 0 .488-.188.807.807 0 0 0 .243-.425 2.654 2.654 0 0 0 .065-1.002 1.505 1.505 0 0 0-.135-.54.653.653 0 0 0-.505-.382 1.44 1.44 0 0 0-.912.137.16.16 0 0 0-.105.164v1.917a.147.147 0 0 0 .09.147 1.468 1.468 0 0 0 .771.17"
  ),
  youtube: R(
    "M18.43 4.216H5.57A4.57 4.57 0 0 0 1 8.786v6.429a4.57 4.57 0 0 0 4.57 4.569h12.86a4.57 4.57 0 0 0 4.57-4.57V8.786a4.57 4.57 0 0 0-4.57-4.569zm-3.09 8.097-6.015 2.869a.241.241 0 0 1-.346-.218V9.046c0-.18.19-.297.351-.215l6.016 3.048a.242.242 0 0 1-.005.434z"
  )
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const W = (e, t) => {
  const o = e._$AN;
  if (o === void 0) return !1;
  for (const i of o) i._$AO?.(t, !1), W(i, t);
  return !0;
}, tt = (e) => {
  let t, o;
  do {
    if ((t = e._$AM) === void 0) break;
    o = t._$AN, o.delete(e), e = t;
  } while (o?.size === 0);
}, _e = (e) => {
  for (let t; t = e._$AM; e = t) {
    let o = t._$AN;
    if (o === void 0) t._$AN = o = /* @__PURE__ */ new Set();
    else if (o.has(e)) break;
    o.add(e), _o(t);
  }
};
function mo(e) {
  this._$AN !== void 0 ? (tt(this), this._$AM = e, _e(this)) : this._$AM = e;
}
function vo(e, t = !1, o = 0) {
  const i = this._$AH, r = this._$AN;
  if (r !== void 0 && r.size !== 0) if (t) if (Array.isArray(i)) for (let a = o; a < i.length; a++) W(i[a], !1), tt(i[a]);
  else i != null && (W(i, !1), tt(i));
  else W(this, e);
}
const _o = (e) => {
  e.type == wt.CHILD && (e._$AP ??= vo, e._$AQ ??= mo);
};
class fo extends ce {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(t, o, i) {
    super._$AT(t, o, i), _e(this), this.isConnected = t._$AU;
  }
  _$AO(t, o = !0) {
    t !== this.isConnected && (this.isConnected = t, t ? this.reconnected?.() : this.disconnected?.()), o && (W(this, t), tt(this));
  }
  setValue(t) {
    if (Fe(this._$Ct)) this._$Ct._$AI(t, this);
    else {
      const o = [...this._$Ct._$AH];
      o[this._$Ci] = t, this._$Ct._$AI(o, this, 0);
    }
  }
  disconnected() {
  }
  reconnected() {
  }
}
const Ft = 500, Wt = 220, Yt = 40, Xt = 500, go = 250, qt = 12;
class bo extends fo {
  constructor(t) {
    if (super(t), this._repeats = 0, this._inFlight = !1, this._bound = !1, this._active = !1, this._resolved = !1, this._startX = 0, this._startY = 0, this._awaitingSecondTap = !1, this._onPointerDown = (o) => {
      if (o.button !== 0) return;
      const i = this._options;
      if (!(!i || i.disabled)) {
        if (this._active = !0, this._resolved = !1, this._startX = o.clientX, this._startY = o.clientY, this._element?.classList.add("pressed"), i.onHold) {
          this._holdTimer = window.setTimeout(() => {
            this._active && (this._resolved = !0, this._fire(i.onHold, "medium"));
          }, Xt);
          return;
        }
        i.repeat && (this._repeats = 0, this._repeatTimer = window.setTimeout(() => {
          this._active && (this._resolved = !0, this._fire(i.onPress), this._repeatTimer = window.setInterval(() => {
            if (!this._active || this._repeats >= Yt) {
              this._reset();
              return;
            }
            this._repeats += 1, this._fire(i.onPress);
          }, Wt));
        }, Ft));
      }
    }, this._onPointerMove = (o) => {
      if (!this._active) return;
      const i = o.clientX - this._startX, r = o.clientY - this._startY;
      i * i + r * r > qt * qt && this._abort();
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
          }, Xt);
          return;
        }
        i.repeat && (this._repeats = 0, this._repeatTimer = window.setTimeout(() => {
          this._repeatTimer = window.setInterval(() => {
            if (!this._active || this._repeats >= Yt) {
              this._reset();
              return;
            }
            this._repeats += 1, this._fire(i.onPress);
          }, Wt);
        }, Ft));
      }
    }, this._onKeyUp = () => {
      this._reset();
    }, this._abort = () => {
      this._reset();
    }, t.type !== wt.ELEMENT)
      throw new Error("press() can only be used on an element");
  }
  render(t) {
    return w;
  }
  update(t, [o]) {
    if (this._element = t.element, this._options = o, !this._bound) {
      this._bound = !0;
      const i = this._element;
      i.addEventListener("pointerdown", this._onPointerDown), i.addEventListener("pointermove", this._onPointerMove), i.addEventListener("pointerup", this._onPointerUp), i.addEventListener("pointercancel", this._abort), i.addEventListener("pointerleave", this._abort), i.addEventListener("keydown", this._onKeyDown), i.addEventListener("keyup", this._onKeyUp), i.addEventListener("blur", this._abort), i.addEventListener("contextmenu", (r) => r.preventDefault());
    }
    return w;
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
      }, go);
    }
  }
  _fire(t, o = "light") {
    const i = this._options;
    i && (this._inFlight || (this._inFlight = !0, Promise.resolve().then(() => {
      this._inFlight = !1;
    }), i.haptics !== !1 && this._element && it(this._element, "haptic", o), t()));
  }
  _reset() {
    this._active = !1, this._resolved = !1, this._repeats = 0, this._element?.classList.remove("pressed"), this._repeatTimer !== void 0 && (window.clearTimeout(this._repeatTimer), window.clearInterval(this._repeatTimer), this._repeatTimer = void 0), this._holdTimer !== void 0 && (window.clearTimeout(this._holdTimer), this._holdTimer = void 0);
  }
  disconnected() {
    this._reset(), this._tapTimer !== void 0 && (window.clearTimeout(this._tapTimer), this._tapTimer = void 0), this._awaitingSecondTap = !1;
  }
}
const T = ne(bo), fe = vt`
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

  /* ----------------------------------------------------------- volume bar -- */
  .volume-bar {
    height: 3px;
    margin: 0 var(--ha-space-3, 12px) var(--ha-space-3, 12px);
    border-radius: var(--radius-pill);
    background-color: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.1);
    overflow: hidden;
  }
  .volume-bar > span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background-color: var(--tile-color);
    transition: width var(--duration) ease-in-out;
  }
  /* Read-only by design: androidtv_remote supports VOLUME_STEP but not
     VOLUME_SET, so there is nothing to drag to. */
  .volume-bar.muted > span {
    filter: grayscale(1);
    opacity: 0.4;
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
    .volume-bar > span {
      transition: none;
    }
  }
`, At = vt`
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
var yo = Object.defineProperty, wo = Object.getOwnPropertyDescriptor, M = (e, t, o, i) => {
  for (var r = i > 1 ? void 0 : i ? wo(t, o) : t, a = e.length - 1, s; a >= 0; a--)
    (s = e[a]) && (r = (i ? s(t, o, r) : s(r)) || r);
  return i && r && yo(t, o, r), r;
};
const Zt = 0.06, $o = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  Enter: "center",
  " ": "center"
};
let $ = class extends C {
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
      const o = t.getBoundingClientRect(), i = (e.clientX - this._startX) / o.width, r = (e.clientY - this._startY) / o.height;
      if (Math.abs(i) < Zt && Math.abs(r) < Zt) {
        this._emit("center");
        return;
      }
      Math.abs(i) >= Math.abs(r) ? this._emit(i < 0 ? "left" : "right") : this._emit(r < 0 ? "up" : "down");
    }, this._onPointerCancel = () => {
      this._tracking = !1;
    }, this._onKeyDown = (e) => {
      const t = $o[e.key];
      t && (e.preventDefault(), this._emit(t));
    };
  }
  _emit(e) {
    it(this, "atv-nav", { direction: e });
  }
  _key(e, t, o, i = "") {
    return p`
      <button
        class="pad-key ${i}"
        type="button"
        aria-label=${o}
        ${T({
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
    return p`<span class="pad-key blank" aria-hidden="true"></span>`;
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
    return p`
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
    return p`
      <div class="dpad" role="group" aria-label="Directional pad">
        ${this._key("up", "mdi:chevron-up", "Up", "up")}
        ${this._key("left", "mdi:chevron-left", "Left", "left")}
        <button
          class="pad-key ok"
          type="button"
          aria-label="Select"
          ${T({ onPress: () => this._emit("center"), haptics: this.haptics })}
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
    return p`
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
    const t = this._touchpad, o = this._dot;
    if (!t || !o) return;
    const i = t.getBoundingClientRect();
    o.style.transform = `translate(${e.clientX - i.left}px, ${e.clientY - i.top}px)`;
  }
  render() {
    return p`
      <div class="pad">
        ${this.pad === "touchpad" ? this._renderTouchpad() : this.pad === "dpad" ? this._renderDpad() : this._renderButtons()}
      </div>
    `;
  }
};
$.styles = [At, fe];
M([
  L({ type: String })
], $.prototype, "pad", 2);
M([
  L({ type: Boolean })
], $.prototype, "repeat", 2);
M([
  L({ type: Boolean })
], $.prototype, "haptics", 2);
M([
  se(".touchpad")
], $.prototype, "_touchpad", 2);
M([
  se(".touchpad-dot")
], $.prototype, "_dot", 2);
M([
  V()
], $.prototype, "_tracking", 2);
$ = M([
  yt("polr-atv-nav-pad")
], $);
var xo = Object.defineProperty, Ao = Object.getOwnPropertyDescriptor, rt = (e, t, o, i) => {
  for (var r = i > 1 ? void 0 : i ? Ao(t, o) : t, a = e.length - 1, s; a >= 0; a--)
    (s = e[a]) && (r = (i ? s(t, o, r) : s(r)) || r);
  return i && r && xo(t, o, r), r;
};
const Gt = [
  { value: "activity", label: "Launch app or link", hint: "App name from the integration, or a deep link such as https://www.netflix.com/title" },
  { value: "app", label: "Open app id", hint: "Android package id, e.g. com.netflix.ninja. Needs a paired media player." },
  { value: "key", label: "Send a key", hint: "Android key code, e.g. GUIDE or MEDIA_REWIND" },
  { value: "service", label: "Call an action", hint: "domain.service, e.g. script.movie_night" }
], ko = (e) => [
  { name: "show_apps", selector: { boolean: {} } },
  ...e.show_apps ? [{ name: "app_columns", selector: { number: { min: 1, max: 8, mode: "box" } } }] : []
], Eo = [
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
], So = (e) => [
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
      ...e.show_nav ? [
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
      ...e.show_transport ? [
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
      ...["volume_up", "volume_down", "volume_mute"].map((t) => ({
        name: `${t}_action`,
        selector: { ui_action: {} }
      }))
    ]
  }
], To = {
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
}, Po = {
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
    super(...arguments), this._editing = null, this._computeLabel = (e) => To[e.name] ?? e.name, this._computeHelper = (e) => Po[e.name];
  }
  setConfig(e) {
    this._config = ve(e);
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
    for (const t of x.ACTION_BUTTONS)
      e[`${t}_action`] = this._config.overrides[t]?.tap_action;
    return e;
  }
  /** Emit a full v2 config. This is what upgrades stored v1 YAML. */
  _emit(e) {
    it(this, "config-changed", { config: uo(e) });
  }
  _formChanged(e) {
    e.stopPropagation();
    const t = { ...e.detail.value }, o = { ...this._config.overrides };
    for (const i of x.ACTION_BUTTONS) {
      const r = `${i}_action`;
      if (!(r in t)) continue;
      const a = t[r];
      delete t[r];
      const s = { ...this._config.overrides[i] ?? {} };
      K(a) && a.action !== "none" ? o[i] = { ...s, tap_action: a } : (delete s.tap_action, Object.keys(s).length ? o[i] = s : delete o[i]);
    }
    this._emit({
      ...this._config,
      ...t,
      overrides: o,
      apps: this._config.apps
    });
  }
  _setApps(e) {
    this._emit({ ...this._config, apps: e });
  }
  _addApp(e) {
    const t = [...this._config.apps, e];
    this._setApps(t), this._editing = t.length - 1;
  }
  _updateApp(e, t) {
    const o = this._config.apps.map(
      (i, r) => r === e ? { ...i, ...t } : i
    );
    this._setApps(o);
  }
  _removeApp(e) {
    this._setApps(this._config.apps.filter((t, o) => o !== e)), this._editing = null;
  }
  _moveApp(e, t) {
    const o = [...this._config.apps], i = e + t;
    i < 0 || i >= o.length || ([o[e], o[i]] = [o[i], o[e]], this._setApps(o), this._editing === e && (this._editing = i));
  }
  /** Change the action kind, carrying the old value across where it makes sense. */
  _setActionKind(e, t) {
    const o = this._config.apps[e].action, i = Jt(o);
    this._updateApp(e, { action: Qt(t, i) });
  }
  _setActionValue(e, t) {
    const o = this._config.apps[e].action;
    this._updateApp(e, { action: Qt(o.action, t) });
  }
  _renderIcon(e) {
    const t = e.icon ?? "mdi:application";
    if (t.startsWith("brand:")) {
      const o = ht[t.slice(6)];
      if (o) return p`<span class="brand">${o}</span>`;
    }
    return t.startsWith("/") || t.startsWith("http") ? p`<img class="brand" src=${t} alt="" />` : p`<ha-icon .icon=${t}></ha-icon>`;
  }
  /**
   * One list row.
   *
   * The inline edit form is a *sibling* `<li>`, appended by the caller rather
   * than returned from here. A single template emitting two `<li>` elements
   * gets mis-parsed — the second ends up nested inside the first, and the form
   * renders half-width, floating out of the row.
   */
  _renderAppRow(e, t, o) {
    const i = this._editing === t;
    return p`
      <li class="row">
        <div class="tile-icon">${this._renderIcon(e)}</div>
        <div class="tile-info">
          <div class="primary"><span>${e.name ?? "Untitled app"}</span></div>
          <div class="secondary"><span>${so(e.action)}</span></div>
        </div>
        <button
          class="icon-button"
          title="Move up"
          .disabled=${t === 0}
          @click=${() => this._moveApp(t, -1)}
        >
          <ha-icon icon="mdi:arrow-up"></ha-icon>
        </button>
        <button
          class="icon-button"
          title="Move down"
          .disabled=${t === o - 1}
          @click=${() => this._moveApp(t, 1)}
        >
          <ha-icon icon="mdi:arrow-down"></ha-icon>
        </button>
        <button
          class="icon-button"
          title=${i ? "Done" : "Edit"}
          @click=${() => {
      this._editing = i ? null : t;
    }}
        >
          <ha-icon icon=${i ? "mdi:check" : "mdi:pencil"}></ha-icon>
        </button>
        <button class="icon-button danger" title="Remove" @click=${() => this._removeApp(t)}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </li>
    `;
  }
  _renderAppForm(e, t) {
    const o = e.action.action, i = Gt.find((r) => r.value === o);
    return p`
      <li class="form-host">
        <div class="form">
          <div class="fields">
            <label class="field">
              <span>Name</span>
              <input
                type="text"
                .value=${e.name ?? ""}
                @change=${(r) => this._updateApp(t, {
      name: r.target.value || void 0
    })}
              />
            </label>

            <label class="field">
              <span>Icon</span>
              <input
                type="text"
                placeholder="mdi:netflix, brand:netflix, or an image URL"
                .value=${e.icon ?? ""}
                @change=${(r) => this._updateApp(t, {
      icon: r.target.value || void 0
    })}
              />
            </label>

            <div class="chips">
              ${dt.map(
      (r) => p`
                  <button
                    class="chip ${e.icon === `brand:${r}` ? "accent" : ""}"
                    title=${`Use the ${S[r].label} logo`}
                    @click=${() => this._updateApp(t, { icon: `brand:${r}` })}
                  >
                    ${S[r].label}
                  </button>
                `
    )}
            </div>

            <label class="field">
              <span>Does what</span>
              <select
                .value=${o}
                @change=${(r) => this._setActionKind(t, r.target.value)}
              >
                ${Gt.map(
      (r) => p`
                    <option value=${r.value} ?selected=${r.value === o}>
                      ${r.label}
                    </option>
                  `
    )}
              </select>
            </label>

            <label class="field wide">
              <span>${i.label}</span>
              <input
                type="text"
                .value=${Jt(e.action)}
                @change=${(r) => this._setActionValue(t, r.target.value)}
              />
            </label>
            <div class="hint">${i.hint}</div>

            ${o === "service" ? p`<div class="hint">
                  Extra service data can only be set in YAML — switch to the code editor.
                </div>` : d}
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
    const e = this._config, t = pe(this.hass, e), o = t ? this.hass.states?.[t] : void 0, i = o?.attributes?.app_id, r = o?.attributes?.app_name;
    if (!i) return d;
    const a = e.apps.some(
      (s) => s.action.action === "app" && s.action.app_id === i
    );
    return p`
      <div class="section-head"><span class="grow">Playing right now</span></div>
      ${a ? p`<div class="hint">${r ?? i} is already in the list.</div>` : p`
            <div class="chips">
              <button
                class="chip accent"
                @click=${() => this._addApp({
      name: r ?? i,
      icon: Co(r ?? i),
      action: { action: "app", app_id: i }
    })}
              >
                <ha-icon icon="mdi:plus"></ha-icon>${r ?? i}
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
    if (!this.hass || !this._config) return d;
    const e = this._config, t = e.apps;
    return p`
      <ha-form
        .hass=${this.hass}
        .data=${this._formData}
        .schema=${So(e)}
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
          .schema=${ko(e)}
          .computeLabel=${this._computeLabel}
          .computeHelper=${this._computeHelper}
          @value-changed=${this._formChanged}
        ></ha-form>

        ${e.show_apps ? p`
              <div class="section-head">
                <span class="grow">Apps</span>
                <span class="count">${t.length}</span>
              </div>

              ${t.length ? p`<ul class="list">
                    ${t.flatMap(
      (o, i) => this._editing === i ? [
        this._renderAppRow(o, i, t.length),
        this._renderAppForm(o, i)
      ] : [this._renderAppRow(o, i, t.length)]
    )}
                  </ul>` : p`<div class="empty-state">No apps yet — add one below.</div>`}

              <div class="section-head"><span class="grow">Add a known app</span></div>
              <div class="chips">
                ${dt.map(
      (o) => p`
                    <button
                      class="chip"
                      @click=${() => this._addApp({
        name: S[o].label,
        icon: `brand:${o}`,
        action: { action: "activity", activity: S[o].activity }
      })}
                    >
                      <ha-icon icon="mdi:plus"></ha-icon>${S[o].label}
                    </button>
                  `
    )}
              </div>

              ${this._renderCurrentApp()}

              <div class="form-actions">
                <button
                  class="control-button wide"
                  @click=${() => this._addApp({
      name: "New app",
      icon: "mdi:application",
      action: { action: "activity", activity: "" }
    })}
                >
                  <ha-icon icon="mdi:plus"></ha-icon><span>Custom app</span>
                </button>
              </div>
            ` : d}
        </div>
      </ha-expansion-panel>

      <ha-form
        .hass=${this.hass}
        .data=${this._formData}
        .schema=${Eo}
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
  At,
  vt`
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
      /* The kit lays .fields out as a two-column grid, which is right for pairs
         of short inputs but shreds a chip row or a paragraph of help text. */
      .fields > .chips,
      .fields > .hint,
      .fields > .field.wide {
        grid-column: 1 / -1;
        padding: 0;
      }
    `
];
rt([
  L({ attribute: !1 })
], x.prototype, "hass", 2);
rt([
  V()
], x.prototype, "_config", 2);
rt([
  V()
], x.prototype, "_editing", 2);
x = rt([
  yt("polr-android-tv-remote-card-editor")
], x);
const Jt = (e) => {
  switch (e.action) {
    case "activity":
      return e.activity;
    case "app":
      return e.app_id;
    case "key":
      return e.key;
    case "service":
      return e.service;
  }
}, Qt = (e, t) => {
  switch (e) {
    case "activity":
      return { action: "activity", activity: t };
    case "app":
      return { action: "app", app_id: t };
    case "key":
      return { action: "key", key: t };
    case "service":
      return { action: "service", service: t };
  }
}, Co = (e) => {
  const t = de(e);
  return t ? `brand:${t}` : "mdi:application";
};
var Oo = Object.defineProperty, zo = Object.getOwnPropertyDescriptor, Z = (e, t, o, i) => {
  for (var r = i > 1 ? void 0 : i ? zo(t, o) : t, a = e.length - 1, s; a >= 0; a--)
    (s = e[a]) && (r = (i ? s(t, o, r) : s(r)) || r);
  return i && r && Oo(t, o, r), r;
};
const Mo = "2.0.0-beta.11", at = "polr-android-tv-remote-card";
let z = class extends C {
  constructor() {
    super(...arguments), this._text = "", this._sending = !1;
  }
  static getConfigElement() {
    return document.createElement(`${at}-editor`);
  }
  /**
   * Pick a real remote off the user's system.
   *
   * v1 used the old zero-argument signature and hardcoded `remote.atvremote`,
   * so adding the card from the picker produced a card pointing at an entity
   * that almost certainly did not exist.
   */
  static getStubConfig(e) {
    return { entity: Object.keys(e?.states ?? {}).find((o) => o.startsWith("remote.")) ?? "remote.android_tv", pad: "buttons" };
  }
  setConfig(e) {
    this._config = ve(e);
  }
  getCardSize() {
    const e = this._config;
    if (!e) return 6;
    let t = e.show_header ? 2 : 0;
    return e.show_nav && (t += e.pad === "buttons" ? 5 : 6), t += 1, e.show_transport && (t += 1), e.show_volume && (t += 1), e.show_text_input && (t += 1), e.show_apps && e.apps.length && (t += 2), Math.max(t, 3);
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
      return eo(this.hass, this._config);
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
    !this.hass || !this._config || !t || this._run(ro(this.hass, this._config, t, e, this));
  }
  /**
   * Press options for a button, folding in any configured interactions.
   *
   * Hold and double-tap handlers are wired only when configured: a double-tap
   * handler forces every tap to wait out the double-tap window, and a hold
   * handler replaces hold-to-repeat, so neither should exist by default.
   */
  _pressOptions(e, t = {}) {
    const o = this._config, i = o.overrides[e], r = i?.hold_action, a = i?.double_tap_action, s = (c) => () => {
      this.hass && this._run(le(this, this.hass, c, o.entity));
    };
    return {
      onPress: () => this._press(e),
      ...pt(r) ? { onHold: s(r) } : {},
      ...pt(a) ? { onDoubleTap: s(a) } : {},
      repeat: t.repeat && o.hold_repeat,
      haptics: o.haptics
    };
  }
  _navigate(e) {
    this._press(e.detail.direction);
  }
  _launch(e) {
    const t = this._device;
    !this.hass || !t || this._run(ao(this.hass, t, e.action));
  }
  async _sendText() {
    const e = this._device, t = this._text.trim();
    if (!(!this.hass || !e || !t)) {
      this._sending = !0;
      try {
        await io(this.hass, e, t), this._text = "";
      } finally {
        this._sending = !1;
      }
    }
  }
  /* ------------------------------------------------------------- header -- */
  _renderHeader(e) {
    const t = this._config, o = e.available ? e.on ? e.appName ?? "On" : "Off" : "Unavailable", i = e.on && e.available ? de(e.appName) : void 0;
    return p`
      <div class="tile">
        <!-- Not interactive: the icon shows what is playing, and tapping it
             opened a more-info dialog nobody wanted from a remote. -->
        <div class="tile-icon">
          ${i ? p`<span class="brand-mark">${ht[i]}</span>` : p`<ha-icon icon="mdi:television"></ha-icon>`}
        </div>
        <div class="tile-info">
          <div class="primary"><span>${e.name}</span></div>
          <div class="secondary" aria-live="polite"><span>${o}</span></div>
        </div>
        ${t.show_power ? p`
              <button
                class="icon-button"
                type="button"
                aria-label=${e.on ? "Turn off" : "Turn on"}
                ${T(this._pressOptions("power"))}
              >
                <ha-icon icon="mdi:power"></ha-icon>
              </button>
            ` : d}
      </div>
      ${this._renderChips(e)}
    `;
  }
  _renderChips(e) {
    if (!e.on || !e.available) return d;
    const t = [];
    return e.muted === !0 ? t.push(p`<span class="chip warn"><ha-icon icon="mdi:volume-off"></ha-icon>Muted</span>`) : jt(e) && t.push(p`<span class="chip accent">${Math.round(e.volume * 100)}%</span>`), t.length ? p`<div class="tile" style="padding-top:0;min-height:0">
      <div class="chips">${t}</div>
    </div>` : d;
  }
  /* -------------------------------------------------------------- rows -- */
  _button(e, t, o, i = {}) {
    return p`
      <button
        class="control-button"
        type="button"
        aria-label=${o}
        title=${o}
        ${T(this._pressOptions(e, i))}
      >
        <ha-icon icon=${t}></ha-icon>
      </button>
    `;
  }
  _renderNavigationRow() {
    const e = this._config, t = e.show_power && !e.show_header;
    return p`
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
    const t = e.playerId === null, o = t || D(e, y.PREVIOUS_TRACK), i = t || D(e, y.NEXT_TRACK), r = new Set(this._config.transport_buttons), a = [
      r.has("previous") && o ? this._button("previous", "mdi:skip-previous", "Previous") : d,
      r.has("rewind") ? this._button("rewind", "mdi:rewind", "Rewind", { repeat: !0 }) : d,
      r.has("play_pause") ? this._button(
        "play_pause",
        e.playing ? "mdi:pause" : "mdi:play",
        e.playing ? "Pause" : "Play"
      ) : d,
      r.has("fast_forward") ? this._button("fast_forward", "mdi:fast-forward", "Fast forward", { repeat: !0 }) : d,
      r.has("next") && i ? this._button("next", "mdi:skip-next", "Next") : d
    ];
    return p`<div class="features">${a}</div>`;
  }
  /**
   * Volume.
   *
   * The buttons always work -- worst case they send key codes. The *state* is
   * another matter: androidtv_remote only reports a level when the TV itself
   * handles audio. Hand the sound to a soundbar over ARC and there is no level
   * and no mute flag, so the bar, the percentage chip and the muted icon would
   * all be invented. When that is the case the row is just three buttons.
   */
  _renderVolume(e) {
    const t = jt(e), o = e.muted === !0;
    return p`
      <div class="features">
        ${this._button("volume_down", "mdi:volume-minus", "Volume down", { repeat: !0 })}
        <button
          class="control-button"
          type="button"
          aria-label=${o ? "Unmute" : "Mute"}
          aria-pressed=${e.muted === void 0 ? "undefined" : o ? "true" : "false"}
          ${T(this._pressOptions("volume_mute"))}
        >
          <ha-icon icon=${o ? "mdi:volume-off" : "mdi:volume-high"}></ha-icon>
        </button>
        ${this._button("volume_up", "mdi:volume-plus", "Volume up", { repeat: !0 })}
      </div>
      ${t ? p`
            <div class="volume-bar ${o ? "muted" : ""}">
              <span style="width:${Math.round(e.volume * 100)}%"></span>
            </div>
          ` : d}
    `;
  }
  _renderTextInput() {
    return p`
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
      const o = ht[t.slice(6)];
      if (o) return p`${o}`;
    }
    return t.startsWith("/") || t.startsWith("http") ? p`<img src=${t} alt="" />` : p`<ha-icon icon=${t}></ha-icon>`;
  }
  _renderApps() {
    const e = this._config;
    return e.apps.length ? p`
      ${e.show_section_labels ? p`<div class="section-head">
            Apps<span class="grow"></span><span class="count">${e.apps.length}</span>
          </div>` : d}
      <div class="app-grid" style="--app-per-row: ${e.app_columns}">
        ${qe(
      e.apps,
      (t, o) => `${o}:${t.icon ?? ""}`,
      (t) => p`
            <button
              class="app-tile"
              type="button"
              aria-label=${t.name ?? "Launch app"}
              title=${t.name ?? ""}
              style=${t.color ? `--app-color:${t.color}` : ""}
              ${T({ onPress: () => this._launch(t), haptics: e.haptics })}
            >
              ${this._renderAppIcon(t)}
            </button>
          `
    )}
      </div>
    ` : d;
  }
  /* ------------------------------------------------------------ render -- */
  render() {
    if (!this.hass || !this._config) return d;
    const e = this._config, t = this._device;
    if (!t.found)
      return p`
        <ha-card>
          <div class="notice error">
            <ha-icon icon="mdi:alert-circle"></ha-icon>
            <span class="grow">Entity ${e.entity} not found.</span>
          </div>
        </ha-card>
      `;
    const o = Ge("media_player", t.on ? "on" : "off"), i = t.available;
    return p`
      <ha-card class=${e.show_header ? "" : "headerless"} style="--tile-color:${o}">
        ${e.show_header ? this._renderHeader(t) : d}
        ${e.show_header && t.playerId === null ? p`<div class="notice warn">
              <ha-icon icon="mdi:information-outline"></ha-icon>
              <span class="grow">
                This device has no media player, so power state, transport and
                volume level are unavailable.
              </span>
            </div>` : d}
        ${i ? t.on ? p`
                ${e.show_nav ? p`<polr-atv-nav-pad
                      .pad=${e.pad}
                      .repeat=${e.hold_repeat}
                      .haptics=${e.haptics}
                      @atv-nav=${this._navigate}
                    ></polr-atv-nav-pad>` : d}
                ${this._renderNavigationRow()}
                ${e.show_transport ? this._renderTransport(t) : d}
                ${e.show_volume ? this._renderVolume(t) : d}
                ${e.show_text_input ? this._renderTextInput() : d}
                ${e.show_apps ? this._renderApps() : d}
              ` : p`
                <!-- No "the TV is off" line: the header secondary already says
                     Off, and the button says Turn on. -->
                <div class="features">
                  <button
                    class="control-button accent wide"
                    type="button"
                    ${T(this._pressOptions("power"))}
                  >
                    <ha-icon icon="mdi:power"></ha-icon><span>Turn on</span>
                  </button>
                </div>
                ${e.show_apps ? this._renderApps() : d}
              ` : p`<div class="empty-state">This device is unavailable.</div>`}
      </ha-card>
    `;
  }
};
z.styles = [At, fe];
Z([
  L({ attribute: !1 })
], z.prototype, "hass", 2);
Z([
  V()
], z.prototype, "_config", 2);
Z([
  V()
], z.prototype, "_text", 2);
Z([
  V()
], z.prototype, "_sending", 2);
z = Z([
  yt(at)
], z);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: at,
  name: "PoLR Android TV Remote",
  description: "A remote for the Android TV Remote integration, with live state and an app launcher.",
  preview: !0,
  documentationURL: "https://github.com/pathofleastresistor/polr-android-tv-remote-card"
});
console.info(`%c ${at} %c ${Mo} `, "background:#555;color:#fff", "background:#3f51b5;color:#fff");
export {
  Mo as CARD_VERSION,
  z as PolrAndroidTvRemoteCard
};
//# sourceMappingURL=polr-android-tv-remote-card.js.map
