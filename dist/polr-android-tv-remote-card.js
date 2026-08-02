/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const q = globalThis, dt = q.ShadowRoot && (q.ShadyCSS === void 0 || q.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ht = Symbol(), At = /* @__PURE__ */ new WeakMap();
let Bt = class {
  constructor(t, i, o) {
    if (this._$cssResult$ = !0, o !== ht) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (dt && t === void 0) {
      const o = i !== void 0 && i.length === 1;
      o && (t = At.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), o && At.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const re = (e) => new Bt(typeof e == "string" ? e : e + "", void 0, ht), ut = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((o, r, a) => o + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[a + 1], e[0]);
  return new Bt(i, e, ht);
}, ae = (e, t) => {
  if (dt) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const o = document.createElement("style"), r = q.litNonce;
    r !== void 0 && o.setAttribute("nonce", r), o.textContent = i.cssText, e.appendChild(o);
  }
}, kt = dt ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const o of t.cssRules) i += o.cssText;
  return re(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ne, defineProperty: se, getOwnPropertyDescriptor: ce, getOwnPropertyNames: le, getOwnPropertySymbols: pe, getPrototypeOf: de } = Object, tt = globalThis, Et = tt.trustedTypes, he = Et ? Et.emptyScript : "", ue = tt.reactiveElementPolyfillSupport, j = (e, t) => e, Z = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? he : null;
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
} }, vt = (e, t) => !ne(e, t), St = { attribute: !0, type: String, converter: Z, reflect: !1, useDefault: !1, hasChanged: vt };
Symbol.metadata ??= Symbol("metadata"), tt.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let U = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = St) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const o = Symbol(), r = this.getPropertyDescriptor(t, o, i);
      r !== void 0 && se(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, i, o) {
    const { get: r, set: a } = ce(this.prototype, t) ?? { get() {
      return this[i];
    }, set(n) {
      this[i] = n;
    } };
    return { get: r, set(n) {
      const p = r?.call(this);
      a?.call(this, n), this.requestUpdate(t, p, o);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? St;
  }
  static _$Ei() {
    if (this.hasOwnProperty(j("elementProperties"))) return;
    const t = de(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(j("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(j("properties"))) {
      const i = this.properties, o = [...le(i), ...pe(i)];
      for (const r of o) this.createProperty(r, i[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const i = litPropertyMetadata.get(t);
      if (i !== void 0) for (const [o, r] of i) this.elementProperties.set(o, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, o] of this.elementProperties) {
      const r = this._$Eu(i, o);
      r !== void 0 && this._$Eh.set(r, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const i = [];
    if (Array.isArray(t)) {
      const o = new Set(t.flat(1 / 0).reverse());
      for (const r of o) i.unshift(kt(r));
    } else t !== void 0 && i.push(kt(t));
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
    return ae(t, this.constructor.elementStyles), t;
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
    const o = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, o);
    if (r !== void 0 && o.reflect === !0) {
      const a = (o.converter?.toAttribute !== void 0 ? o.converter : Z).toAttribute(i, o.type);
      this._$Em = t, a == null ? this.removeAttribute(r) : this.setAttribute(r, a), this._$Em = null;
    }
  }
  _$AK(t, i) {
    const o = this.constructor, r = o._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const a = o.getPropertyOptions(r), n = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : Z;
      this._$Em = r;
      const p = n.fromAttribute(i, a.type);
      this[r] = p ?? this._$Ej?.get(r) ?? p, this._$Em = null;
    }
  }
  requestUpdate(t, i, o, r = !1, a) {
    if (t !== void 0) {
      const n = this.constructor;
      if (r === !1 && (a = this[t]), o ??= n.getPropertyOptions(t), !((o.hasChanged ?? vt)(a, i) || o.useDefault && o.reflect && a === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, o)))) return;
      this.C(t, i, o);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: o, reflect: r, wrapped: a }, n) {
    o && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, n ?? i ?? this[t]), a !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || o || (i = void 0), this._$AL.set(t, i)), r === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [r, a] of this._$Ep) this[r] = a;
        this._$Ep = void 0;
      }
      const o = this.constructor.elementProperties;
      if (o.size > 0) for (const [r, a] of o) {
        const { wrapped: n } = a, p = this[r];
        n !== !0 || this._$AL.has(r) || p === void 0 || this.C(r, void 0, a, p);
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
U.elementStyles = [], U.shadowRootOptions = { mode: "open" }, U[j("elementProperties")] = /* @__PURE__ */ new Map(), U[j("finalized")] = /* @__PURE__ */ new Map(), ue?.({ ReactiveElement: U }), (tt.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const mt = globalThis, Pt = (e) => e, G = mt.trustedTypes, Tt = G ? G.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Ft = "$lit$", k = `lit$${Math.random().toFixed(9).slice(2)}$`, Kt = "?" + k, ve = `<${Kt}>`, M = document, F = () => M.createComment(""), K = (e) => e === null || typeof e != "object" && typeof e != "function", ft = Array.isArray, me = (e) => ft(e) || typeof e?.[Symbol.iterator] == "function", at = `[ 	
\f\r]`, I = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ct = /-->/g, zt = />/g, P = RegExp(`>|${at}(?:([^\\s"'>=/]+)(${at}*=${at}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Mt = /'/g, Ot = /"/g, Wt = /^(?:script|style|textarea|title)$/i, Yt = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), l = Yt(1), fe = Yt(2), x = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), Rt = /* @__PURE__ */ new WeakMap(), C = M.createTreeWalker(M, 129);
function Xt(e, t) {
  if (!ft(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Tt !== void 0 ? Tt.createHTML(t) : t;
}
const _e = (e, t) => {
  const i = e.length - 1, o = [];
  let r, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = I;
  for (let p = 0; p < i; p++) {
    const s = e[p];
    let h, m, c = -1, v = 0;
    for (; v < s.length && (n.lastIndex = v, m = n.exec(s), m !== null); ) v = n.lastIndex, n === I ? m[1] === "!--" ? n = Ct : m[1] !== void 0 ? n = zt : m[2] !== void 0 ? (Wt.test(m[2]) && (r = RegExp("</" + m[2], "g")), n = P) : m[3] !== void 0 && (n = P) : n === P ? m[0] === ">" ? (n = r ?? I, c = -1) : m[1] === void 0 ? c = -2 : (c = n.lastIndex - m[2].length, h = m[1], n = m[3] === void 0 ? P : m[3] === '"' ? Ot : Mt) : n === Ot || n === Mt ? n = P : n === Ct || n === zt ? n = I : (n = P, r = void 0);
    const u = n === P && e[p + 1].startsWith("/>") ? " " : "";
    a += n === I ? s + ve : c >= 0 ? (o.push(h), s.slice(0, c) + Ft + s.slice(c) + k + u) : s + k + (c === -2 ? p : u);
  }
  return [Xt(e, a + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), o];
};
class W {
  constructor({ strings: t, _$litType$: i }, o) {
    let r;
    this.parts = [];
    let a = 0, n = 0;
    const p = t.length - 1, s = this.parts, [h, m] = _e(t, i);
    if (this.el = W.createElement(h, o), C.currentNode = this.el.content, i === 2 || i === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (r = C.nextNode()) !== null && s.length < p; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const c of r.getAttributeNames()) if (c.endsWith(Ft)) {
          const v = m[n++], u = r.getAttribute(c).split(k), f = /([.?@])?(.*)/.exec(v);
          s.push({ type: 1, index: a, name: f[2], strings: u, ctor: f[1] === "." ? be : f[1] === "?" ? ye : f[1] === "@" ? $e : et }), r.removeAttribute(c);
        } else c.startsWith(k) && (s.push({ type: 6, index: a }), r.removeAttribute(c));
        if (Wt.test(r.tagName)) {
          const c = r.textContent.split(k), v = c.length - 1;
          if (v > 0) {
            r.textContent = G ? G.emptyScript : "";
            for (let u = 0; u < v; u++) r.append(c[u], F()), C.nextNode(), s.push({ type: 2, index: ++a });
            r.append(c[v], F());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Kt) s.push({ type: 2, index: a });
      else {
        let c = -1;
        for (; (c = r.data.indexOf(k, c + 1)) !== -1; ) s.push({ type: 7, index: a }), c += k.length - 1;
      }
      a++;
    }
  }
  static createElement(t, i) {
    const o = M.createElement("template");
    return o.innerHTML = t, o;
  }
}
function D(e, t, i = e, o) {
  if (t === x) return t;
  let r = o !== void 0 ? i._$Co?.[o] : i._$Cl;
  const a = K(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== a && (r?._$AO?.(!1), a === void 0 ? r = void 0 : (r = new a(e), r._$AT(e, i, o)), o !== void 0 ? (i._$Co ??= [])[o] = r : i._$Cl = r), r !== void 0 && (t = D(e, r._$AS(e, t.values), r, o)), t;
}
class ge {
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
    const { el: { content: i }, parts: o } = this._$AD, r = (t?.creationScope ?? M).importNode(i, !0);
    C.currentNode = r;
    let a = C.nextNode(), n = 0, p = 0, s = o[0];
    for (; s !== void 0; ) {
      if (n === s.index) {
        let h;
        s.type === 2 ? h = new H(a, a.nextSibling, this, t) : s.type === 1 ? h = new s.ctor(a, s.name, s.strings, this, t) : s.type === 6 && (h = new we(a, this, t)), this._$AV.push(h), s = o[++p];
      }
      n !== s?.index && (a = C.nextNode(), n++);
    }
    return C.currentNode = M, r;
  }
  p(t) {
    let i = 0;
    for (const o of this._$AV) o !== void 0 && (o.strings !== void 0 ? (o._$AI(t, o, i), i += o.strings.length - 2) : o._$AI(t[i])), i++;
  }
}
class H {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, i, o, r) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = o, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
    t = D(this, t, i), K(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== x && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : me(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && K(this._$AH) ? this._$AA.nextSibling.data = t : this.T(M.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: i, _$litType$: o } = t, r = typeof o == "number" ? this._$AC(t) : (o.el === void 0 && (o.el = W.createElement(Xt(o.h, o.h[0]), this.options)), o);
    if (this._$AH?._$AD === r) this._$AH.p(i);
    else {
      const a = new ge(r, this), n = a.u(this.options);
      a.p(i), this.T(n), this._$AH = a;
    }
  }
  _$AC(t) {
    let i = Rt.get(t.strings);
    return i === void 0 && Rt.set(t.strings, i = new W(t)), i;
  }
  k(t) {
    ft(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let o, r = 0;
    for (const a of t) r === i.length ? i.push(o = new H(this.O(F()), this.O(F()), this, this.options)) : o = i[r], o._$AI(a), r++;
    r < i.length && (this._$AR(o && o._$AB.nextSibling, r), i.length = r);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); t !== this._$AB; ) {
      const o = Pt(t).nextSibling;
      Pt(t).remove(), t = o;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class et {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, o, r, a) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = i, this._$AM = r, this.options = a, o.length > 2 || o[0] !== "" || o[1] !== "" ? (this._$AH = Array(o.length - 1).fill(new String()), this.strings = o) : this._$AH = d;
  }
  _$AI(t, i = this, o, r) {
    const a = this.strings;
    let n = !1;
    if (a === void 0) t = D(this, t, i, 0), n = !K(t) || t !== this._$AH && t !== x, n && (this._$AH = t);
    else {
      const p = t;
      let s, h;
      for (t = a[0], s = 0; s < a.length - 1; s++) h = D(this, p[o + s], i, s), h === x && (h = this._$AH[s]), n ||= !K(h) || h !== this._$AH[s], h === d ? t = d : t !== d && (t += (h ?? "") + a[s + 1]), this._$AH[s] = h;
    }
    n && !r && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class be extends et {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class ye extends et {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class $e extends et {
  constructor(t, i, o, r, a) {
    super(t, i, o, r, a), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = D(this, t, i, 0) ?? d) === x) return;
    const o = this._$AH, r = t === d && o !== d || t.capture !== o.capture || t.once !== o.once || t.passive !== o.passive, a = t !== d && (o === d || r);
    r && this.element.removeEventListener(this.name, this, o), a && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class we {
  constructor(t, i, o) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = o;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    D(this, t);
  }
}
const xe = { I: H }, Ae = mt.litHtmlPolyfillSupport;
Ae?.(W, H), (mt.litHtmlVersions ??= []).push("3.3.3");
const ke = (e, t, i) => {
  const o = i?.renderBefore ?? t;
  let r = o._$litPart$;
  if (r === void 0) {
    const a = i?.renderBefore ?? null;
    o._$litPart$ = r = new H(t.insertBefore(F(), a), a, void 0, i ?? {});
  }
  return r._$AI(e), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _t = globalThis;
let z = class extends U {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ke(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return x;
  }
};
z._$litElement$ = !0, z.finalized = !0, _t.litElementHydrateSupport?.({ LitElement: z });
const Ee = _t.litElementPolyfillSupport;
Ee?.({ LitElement: z });
(_t.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const gt = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Se = { attribute: !0, type: String, converter: Z, reflect: !1, hasChanged: vt }, Pe = (e = Se, t, i) => {
  const { kind: o, metadata: r } = i;
  let a = globalThis.litPropertyMetadata.get(r);
  if (a === void 0 && globalThis.litPropertyMetadata.set(r, a = /* @__PURE__ */ new Map()), o === "setter" && ((e = Object.create(e)).wrapped = !0), a.set(i.name, e), o === "accessor") {
    const { name: n } = i;
    return { set(p) {
      const s = t.get.call(this);
      t.set.call(this, p), this.requestUpdate(n, s, e, !0, p);
    }, init(p) {
      return p !== void 0 && this.C(n, void 0, e, p), p;
    } };
  }
  if (o === "setter") {
    const { name: n } = i;
    return function(p) {
      const s = this[n];
      t.call(this, p), this.requestUpdate(n, s, e, !0, p);
    };
  }
  throw Error("Unsupported decorator location: " + o);
};
function S(e) {
  return (t, i) => typeof i == "object" ? Pe(e, t, i) : ((o, r, a) => {
    const n = r.hasOwnProperty(a);
    return r.constructor.createProperty(a, o), n ? Object.getOwnPropertyDescriptor(r, a) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function L(e) {
  return S({ ...e, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Te = (e, t, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, i), i);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function qt(e, t) {
  return (i, o, r) => {
    const a = (n) => n.renderRoot?.querySelector(e) ?? null;
    return Te(i, o, { get() {
      return a(this);
    } });
  };
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const bt = { CHILD: 2, ELEMENT: 6 }, Zt = (e) => (...t) => ({ _$litDirective$: e, values: t });
let Gt = class {
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
const { I: Ce } = xe, Ut = (e) => e, ze = (e) => e.strings === void 0, Dt = () => document.createComment(""), V = (e, t, i) => {
  const o = e._$AA.parentNode, r = t === void 0 ? e._$AB : t._$AA;
  if (i === void 0) {
    const a = o.insertBefore(Dt(), r), n = o.insertBefore(Dt(), r);
    i = new Ce(a, n, e, e.options);
  } else {
    const a = i._$AB.nextSibling, n = i._$AM, p = n !== e;
    if (p) {
      let s;
      i._$AQ?.(e), i._$AM = e, i._$AP !== void 0 && (s = e._$AU) !== n._$AU && i._$AP(s);
    }
    if (a !== r || p) {
      let s = i._$AA;
      for (; s !== a; ) {
        const h = Ut(s).nextSibling;
        Ut(o).insertBefore(s, r), s = h;
      }
    }
  }
  return i;
}, T = (e, t, i = e) => (e._$AI(t, i), e), Me = {}, Oe = (e, t = Me) => e._$AH = t, Re = (e) => e._$AH, nt = (e) => {
  e._$AR(), e._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Nt = (e, t, i) => {
  const o = /* @__PURE__ */ new Map();
  for (let r = t; r <= i; r++) o.set(e[r], r);
  return o;
}, Ue = Zt(class extends Gt {
  constructor(e) {
    if (super(e), e.type !== bt.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(e, t, i) {
    let o;
    i === void 0 ? i = t : t !== void 0 && (o = t);
    const r = [], a = [];
    let n = 0;
    for (const p of e) r[n] = o ? o(p, n) : n, a[n] = i(p, n), n++;
    return { values: a, keys: r };
  }
  render(e, t, i) {
    return this.dt(e, t, i).values;
  }
  update(e, [t, i, o]) {
    const r = Re(e), { values: a, keys: n } = this.dt(t, i, o);
    if (!Array.isArray(r)) return this.ut = n, a;
    const p = this.ut ??= [], s = [];
    let h, m, c = 0, v = r.length - 1, u = 0, f = a.length - 1;
    for (; c <= v && u <= f; ) if (r[c] === null) c++;
    else if (r[v] === null) v--;
    else if (p[c] === n[u]) s[u] = T(r[c], a[u]), c++, u++;
    else if (p[v] === n[f]) s[f] = T(r[v], a[f]), v--, f--;
    else if (p[c] === n[f]) s[f] = T(r[c], a[f]), V(e, s[f + 1], r[c]), c++, f--;
    else if (p[v] === n[u]) s[u] = T(r[v], a[u]), V(e, r[c], r[v]), v--, u++;
    else if (h === void 0 && (h = Nt(n, u, f), m = Nt(p, c, v)), h.has(p[c])) if (h.has(p[v])) {
      const y = m.get(n[u]), rt = y !== void 0 ? r[y] : null;
      if (rt === null) {
        const xt = V(e, r[c]);
        T(xt, a[u]), s[u] = xt;
      } else s[u] = T(rt, a[u]), V(e, r[c], rt), r[y] = null;
      u++;
    } else nt(r[v]), v--;
    else nt(r[c]), c++;
    for (; u <= f; ) {
      const y = V(e, s[f + 1]);
      T(y, a[u]), s[u++] = y;
    }
    for (; c <= v; ) {
      const y = r[c++];
      y !== null && nt(y);
    }
    return this.ut = n, Oe(e, s), x;
  }
}), b = {
  PAUSE: 1,
  VOLUME_MUTE: 8,
  PREVIOUS_TRACK: 16,
  NEXT_TRACK: 32,
  TURN_ON: 128,
  TURN_OFF: 256,
  VOLUME_STEP: 1024
}, De = {
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
  previous: "MEDIA_PREVIOUS"
}, Ne = "text:", He = (e, t) => {
  if (t.media_player_entity) return t.media_player_entity;
  const i = e.entities?.[t.entity]?.device_id;
  if (!i) return null;
  for (const o of Object.values(e.entities ?? {}))
    if (o.device_id === i && o.entity_id.startsWith("media_player."))
      return o.entity_id;
  return null;
}, st = (e) => e === void 0 || e.state === "unavailable" || e.state === "unknown", Le = (e, t) => {
  const i = e.states?.[t.entity], o = He(e, t), r = o ? e.states?.[o] : void 0, a = r?.attributes ?? {}, n = i?.attributes ?? {}, p = r && !st(r) ? r.state !== "off" : i?.state === "on";
  return {
    remoteId: t.entity,
    playerId: o,
    remote: i,
    player: r,
    found: i !== void 0,
    available: !st(i) && (r === void 0 || !st(r)),
    on: p,
    name: t.name ?? n.friendly_name ?? t.entity,
    // app_name is all the real integration provides; `source` covers a player
    // from another integration pointed at by media_player_entity.
    appName: a.app_name ?? a.source ?? n.current_activity,
    // Never set by androidtv_remote. Present only for other players.
    mediaTitle: a.media_title,
    picture: a.entity_picture,
    volume: typeof a.volume_level == "number" ? a.volume_level : void 0,
    muted: a.is_volume_muted === !0,
    playing: r?.state === "playing",
    features: a.supported_features ?? 0,
    activities: Array.isArray(n.activity_list) ? n.activity_list : []
  };
}, $ = (e, t) => (e.features & t) !== 0, Jt = (e, t) => {
  const [i, o] = t.service.split(".");
  return !i || !o ? Promise.reject(
    new Error(`polr-android-tv-remote-card: invalid service "${t.service}"`)
  ) : e.callService(i, o, t.data ?? {}, t.target);
}, yt = (e, t, i) => e.callService("remote", "send_command", {
  entity_id: t.remoteId,
  command: i
}), Ie = (e, t, i) => yt(e, t, `${Ne}${i}`), Ve = (e, t, i, o) => {
  const r = t.overrides[o];
  if (r) return Jt(e, r);
  const a = i.playerId;
  switch (o) {
    case "power":
      return a && $(i, i.on ? b.TURN_OFF : b.TURN_ON) ? e.callService(
        "media_player",
        i.on ? "turn_off" : "turn_on",
        { entity_id: a }
      ) : e.callService("remote", i.on ? "turn_off" : "turn_on", {
        entity_id: i.remoteId
      });
    case "play_pause":
      if (a && $(i, b.PAUSE))
        return e.callService("media_player", "media_play_pause", {
          entity_id: a
        });
      break;
    case "next":
      if (a && $(i, b.NEXT_TRACK))
        return e.callService("media_player", "media_next_track", {
          entity_id: a
        });
      break;
    case "previous":
      if (a && $(i, b.PREVIOUS_TRACK))
        return e.callService("media_player", "media_previous_track", {
          entity_id: a
        });
      break;
    case "volume_up":
    case "volume_down":
      if (a && $(i, b.VOLUME_STEP))
        return e.callService(
          "media_player",
          o === "volume_up" ? "volume_up" : "volume_down",
          { entity_id: a }
        );
      break;
    case "volume_mute":
      if (a && $(i, b.VOLUME_MUTE))
        return e.callService("media_player", "volume_mute", {
          entity_id: a,
          is_volume_muted: !i.muted
        });
      break;
  }
  const n = De[o];
  return n ? yt(e, i, n) : Promise.resolve();
}, je = (e, t, i) => {
  switch (i.action) {
    case "activity":
      return e.callService("remote", "turn_on", {
        entity_id: t.remoteId,
        activity: i.activity
      });
    case "app":
      return t.playerId ? e.callService("media_player", "play_media", {
        entity_id: t.playerId,
        media_content_type: "app",
        media_content_id: i.app_id
      }) : Promise.reject(
        new Error(
          "polr-android-tv-remote-card: launching by app id needs a media_player; set media_player_entity"
        )
      );
    case "key":
      return yt(e, t, i.key);
    case "service":
      return Jt(e, i);
  }
}, Be = (e) => {
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
}, Fe = ["buttons", "dpad", "touchpad"], _ = {
  show_header: !0,
  show_power: !0,
  show_nav: !0,
  pad: "buttons",
  show_navigation_row: !0,
  show_transport: !0,
  show_volume: !0,
  // Off by default: sending text needs a focused input on the TV *and*
  // `enable_ime` on the config entry, neither of which the card can detect.
  show_text_input: !1,
  show_apps: !0,
  show_section_labels: !1,
  app_columns: "auto",
  hold_repeat: !0,
  haptics: !0
}, lt = {
  disneyplus: { label: "Disney+", activity: "https://www.disneyplus.com" },
  hbomax: { label: "HBO Max", activity: "https://play.hbomax.com" },
  hulu: { label: "Hulu", activity: "HULU" },
  netflix: { label: "Netflix", activity: "https://www.netflix.com/title" },
  prime: { label: "Prime Video", activity: "https://app.primevideo.com" },
  youtube: { label: "YouTube", activity: "https://www.youtube.com" }
}, Qt = {
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
}, Ke = {
  // v1's default pad inlined power/home/back/favorite into the 3x3 grid, so a
  // separate navigation row would duplicate them.
  default: { pad: "buttons", navigation_row: !1 },
  touch: { pad: "touchpad", navigation_row: !0 },
  dpad: { pad: "dpad", navigation_row: !0 }
}, w = (e) => typeof e == "object" && e !== null && !Array.isArray(e), te = (e) => w(e) && typeof e.service == "string";
let Ht = /* @__PURE__ */ new Set();
const J = (e) => {
  Ht.has(e) || (Ht.add(e), console.warn(`polr-android-tv-remote-card: ${e}`));
}, We = (e) => {
  if (typeof e == "string") {
    const r = lt[e];
    return r ? {
      name: r.label,
      icon: `brand:${e}`,
      action: { action: "activity", activity: r.activity }
    } : (J(
      `unknown app "${e}" — treating it as an activity. Use an object with an icon and action instead.`
    ), {
      name: e,
      icon: "mdi:application",
      action: { action: "activity", activity: e }
    });
  }
  if (!w(e)) return null;
  if (w(e.action))
    return e;
  const t = typeof e.icon == "string" ? e.icon : void 0, i = typeof e.name == "string" ? e.name : void 0, o = typeof e.color == "string" ? e.color : void 0;
  return te(e) ? {
    ...i ? { name: i } : {},
    ...t ? { icon: t } : {},
    ...o ? { color: o } : {},
    action: {
      action: "service",
      service: e.service,
      ...w(e.data) ? { data: e.data } : {},
      ...w(e.target) ? { target: e.target } : {}
    }
  } : typeof e.url == "string" ? {
    ...i ? { name: i } : {},
    ...t ? { icon: t } : {},
    ...o ? { color: o } : {},
    action: { action: "activity", activity: e.url }
  } : (J(`app entry has no action, url or service and was skipped: ${JSON.stringify(e)}`), null);
}, ee = (e) => {
  if (!w(e))
    throw new Error("polr-android-tv-remote-card: invalid configuration");
  const t = typeof e.entity == "string" ? e.entity : typeof e.entity_id == "string" ? e.entity_id : void 0;
  if (!t)
    throw new Error("polr-android-tv-remote-card: 'entity' is required");
  const i = typeof e.remote == "string" ? Ke[e.remote] : void 0;
  typeof e.remote == "string" && !i && J(`unknown remote style "${e.remote}" — falling back to ${_.pad}`);
  const o = Fe.includes(e.pad) ? e.pad : i?.pad ?? _.pad, r = typeof e.volume == "boolean" ? e.volume : void 0, a = {
    ...w(e.overrides) ? e.overrides : {}
  };
  for (const [h, m] of Object.entries(Qt)) {
    if (a[m]) continue;
    const c = e[h];
    te(c) ? a[m] = {
      service: c.service,
      ...w(c.data) ? { data: c.data } : {},
      ...w(c.target) ? { target: c.target } : {}
    } : c !== void 0 && J(`override "${h}" is not a {service, data} object and was ignored`);
  }
  const p = (Array.isArray(e.apps) ? e.apps : []).map(We).filter((h) => h !== null), s = (h, m) => h === void 0 ? m : h;
  return {
    ...e,
    type: e.type,
    entity: t,
    ...typeof e.media_player_entity == "string" ? { media_player_entity: e.media_player_entity } : {},
    ...typeof e.name == "string" ? { name: e.name } : {},
    show_header: s(e.show_header, _.show_header),
    show_power: s(e.show_power, _.show_power),
    show_nav: s(e.show_nav, _.show_nav),
    pad: o,
    show_navigation_row: s(
      e.show_navigation_row,
      i ? i.navigation_row : _.show_navigation_row
    ),
    show_transport: s(e.show_transport, _.show_transport),
    show_volume: s(e.show_volume, r ?? _.show_volume),
    show_text_input: s(e.show_text_input, _.show_text_input),
    show_apps: s(e.show_apps, _.show_apps),
    show_section_labels: s(e.show_section_labels, _.show_section_labels),
    // v1 always drew a favourite button on the default pad, and threw when it
    // had no override to call. Draw it only when it does something.
    show_favorite: a.favorite !== void 0,
    apps: p,
    app_columns: s(e.app_columns, _.app_columns),
    hold_repeat: s(e.hold_repeat, _.hold_repeat),
    haptics: s(e.haptics, _.haptics),
    overrides: a
  };
}, Ye = 5, Xe = (e) => {
  if (e <= 1) return 1;
  const t = Math.ceil(e / Ye);
  return Math.ceil(e / t);
}, qe = (e) => {
  const t = /* @__PURE__ */ new Set([
    "entity_id",
    "remote",
    "volume",
    "show_favorite",
    ...Object.keys(Qt)
  ]), i = {};
  for (const [o, r] of Object.entries(e))
    t.has(o) || (i[o] = r);
  return i;
}, R = (e) => fe`
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="${e}" />
  </svg>
`, $t = {
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
}, pt = Object.keys($t), ct = {
  disneyplus: "Disney+",
  hbomax: "HBO Max",
  hulu: "Hulu",
  netflix: "Netflix",
  prime: "Prime Video",
  youtube: "YouTube"
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const B = (e, t) => {
  const i = e._$AN;
  if (i === void 0) return !1;
  for (const o of i) o._$AO?.(t, !1), B(o, t);
  return !0;
}, Q = (e) => {
  let t, i;
  do {
    if ((t = e._$AM) === void 0) break;
    i = t._$AN, i.delete(e), e = t;
  } while (i?.size === 0);
}, ie = (e) => {
  for (let t; t = e._$AM; e = t) {
    let i = t._$AN;
    if (i === void 0) t._$AN = i = /* @__PURE__ */ new Set();
    else if (i.has(e)) break;
    i.add(e), Je(t);
  }
};
function Ze(e) {
  this._$AN !== void 0 ? (Q(this), this._$AM = e, ie(this)) : this._$AM = e;
}
function Ge(e, t = !1, i = 0) {
  const o = this._$AH, r = this._$AN;
  if (r !== void 0 && r.size !== 0) if (t) if (Array.isArray(o)) for (let a = i; a < o.length; a++) B(o[a], !1), Q(o[a]);
  else o != null && (B(o, !1), Q(o));
  else B(this, e);
}
const Je = (e) => {
  e.type == bt.CHILD && (e._$AP ??= Ge, e._$AQ ??= Ze);
};
class Qe extends Gt {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(t, i, o) {
    super._$AT(t, i, o), ie(this), this.isConnected = t._$AU;
  }
  _$AO(t, i = !0) {
    t !== this.isConnected && (this.isConnected = t, t ? this.reconnected?.() : this.disconnected?.()), i && (B(this, t), Q(this));
  }
  setValue(t) {
    if (ze(this._$Ct)) this._$Ct._$AI(t, this);
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
const Y = (e, t, i) => {
  e.dispatchEvent(
    new CustomEvent(t, { detail: i, bubbles: !0, composed: !0 })
  );
}, ti = (e, t) => Y(e, "hass-more-info", { entityId: t }), ei = (e, t, i = "var(--state-inactive-color, #9e9e9e)") => t === "unavailable" || t === "unknown" ? "var(--state-unavailable-color, var(--disabled-color))" : `var(--state-${e}-${t}-color, var(--state-icon-color, ${i}))`, ii = 500, oi = 220, ri = 40;
class ai extends Qe {
  constructor(t) {
    if (super(t), this._repeats = 0, this._inFlight = !1, this._bound = !1, this._onPointerDown = (i) => {
      i.button === 0 && (i.preventDefault(), this._element?.setPointerCapture?.(i.pointerId), this._start());
    }, this._onKeyDown = (i) => {
      i.key !== "Enter" && i.key !== " " || (i.preventDefault(), !i.repeat && this._start());
    }, this._onRelease = () => {
      this._stop();
    }, t.type !== bt.ELEMENT)
      throw new Error("press() can only be used on an element");
  }
  render(t) {
    return x;
  }
  update(t, [i]) {
    if (this._element = t.element, this._options = i, !this._bound) {
      this._bound = !0;
      const o = this._element;
      o.addEventListener("pointerdown", this._onPointerDown), o.addEventListener("pointerup", this._onRelease), o.addEventListener("pointercancel", this._onRelease), o.addEventListener("pointerleave", this._onRelease), o.addEventListener("keydown", this._onKeyDown), o.addEventListener("keyup", this._onRelease), o.addEventListener("blur", this._onRelease), o.addEventListener("contextmenu", (r) => r.preventDefault());
    }
    return x;
  }
  _start() {
    const t = this._options;
    !t || t.disabled || (this._element?.classList.add("pressed"), this._fire(), t.repeat && (this._repeats = 0, this._timer = window.setTimeout(() => {
      this._timer = window.setInterval(() => {
        if (this._repeats >= ri) {
          this._stop();
          return;
        }
        this._repeats += 1, this._fire();
      }, oi);
    }, ii)));
  }
  _fire() {
    const t = this._options;
    t && (this._inFlight || (this._inFlight = !0, Promise.resolve().then(() => {
      this._inFlight = !1;
    }), t.haptics !== !1 && this._element && Y(this._element, "haptic", "light"), t.onPress()));
  }
  _stop() {
    this._element?.classList.remove("pressed"), this._timer !== void 0 && (window.clearTimeout(this._timer), window.clearInterval(this._timer), this._timer = void 0), this._repeats = 0;
  }
  disconnected() {
    this._stop();
  }
}
const E = Zt(ai), oe = ut`
  /* --------------------------------------------------------- now playing -- */
  .now-playing-art {
    flex: 0 0 auto;
    width: 40px;
    height: 40px;
    border-radius: var(--radius-md);
    object-fit: cover;
    background-color: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.08);
  }

  /* ---------------------------------------------------------- nav region -- */
  .pad {
    /* Container queries, so the pad tracks the card and not the viewport. */
    container-type: inline-size;
    padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px) var(--ha-space-3, 12px);
  }

  /* 3x3 button grid — v1's "default" layout, rebuilt as real buttons. */
  .button-pad {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--ha-space-2, 8px);
    max-width: 320px;
    margin: 0 auto;
  }
  .pad-key {
    position: relative;
    overflow: hidden;
    display: grid;
    place-items: center;
    aspect-ratio: 1;
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
    aspect-ratio: auto;
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
  .touchpad {
    position: relative;
    /* Scoped to the pad, never the card: touch-action on a whole custom card
       eats dashboard scrolling on mobile. */
    touch-action: none;
    aspect-ratio: 1 / 0.8;
    width: 100%;
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
  .app-grid {
    display: grid;
    gap: var(--ha-space-2, 8px);
    padding: 0 var(--ha-space-3, 12px) var(--ha-space-3, 12px);
    justify-items: center;
  }
  .app-tile {
    /* Capped so two apps do not become two enormous logos filling the card.
       v1 had the opposite failure: a hardcoded repeat(4, 1fr) that stranded
       app five on a row of its own. */
    width: 100%;
    max-width: 88px;
    position: relative;
    overflow: hidden;
    display: grid;
    place-items: center;
    aspect-ratio: 1;
    margin: 0;
    padding: 18%;
    border: none;
    border-radius: var(--radius-lg);
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
  .app-tile svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
  .app-tile img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: var(--radius-md);
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
`, wt = ut`
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
var ni = Object.defineProperty, si = Object.getOwnPropertyDescriptor, A = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? si(t, i) : t, a = e.length - 1, n; a >= 0; a--)
    (n = e[a]) && (r = (o ? n(t, i, r) : n(r)) || r);
  return o && r && ni(t, i, r), r;
};
const Lt = 0.06, ci = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  Enter: "center",
  " ": "center"
};
let g = class extends z {
  constructor() {
    super(...arguments), this.pad = "buttons", this.repeat = !0, this.haptics = !0, this.inlineExtras = !1, this.showFavorite = !1, this._tracking = !1, this._startX = 0, this._startY = 0, this._onPointerDown = (e) => {
      e.button === 0 && (e.preventDefault(), this._touchpad?.setPointerCapture(e.pointerId), this._startX = e.clientX, this._startY = e.clientY, this._tracking = !0, this._moveDot(e));
    }, this._onPointerMove = (e) => {
      this._tracking && (e.preventDefault(), this._moveDot(e));
    }, this._onPointerUp = (e) => {
      if (!this._tracking) return;
      this._tracking = !1;
      const t = this._touchpad;
      if (!t) return;
      const i = t.getBoundingClientRect(), o = (e.clientX - this._startX) / i.width, r = (e.clientY - this._startY) / i.height;
      if (Math.abs(o) < Lt && Math.abs(r) < Lt) {
        this._emit("center");
        return;
      }
      Math.abs(o) >= Math.abs(r) ? this._emit(o < 0 ? "left" : "right") : this._emit(r < 0 ? "up" : "down");
    }, this._onPointerCancel = () => {
      this._tracking = !1;
    }, this._onKeyDown = (e) => {
      const t = ci[e.key];
      t && (e.preventDefault(), this._emit(t));
    };
  }
  _emit(e) {
    Y(this, "atv-nav", { direction: e });
  }
  _emitButton(e) {
    Y(this, "atv-button", { button: e });
  }
  _key(e, t, i, o = "") {
    return l`
      <button
        class="pad-key ${o}"
        type="button"
        aria-label=${i}
        ${E({
      onPress: () => this._emit(e),
      repeat: this.repeat && e !== "center",
      haptics: this.haptics
    })}
      >
        <ha-icon icon=${t}></ha-icon>
      </button>
    `;
  }
  _extra(e, t, i) {
    return l`
      <button
        class="pad-key"
        type="button"
        aria-label=${i}
        ${E({ onPress: () => this._emitButton(e), haptics: this.haptics })}
      >
        <ha-icon icon=${t}></ha-icon>
      </button>
    `;
  }
  _blank() {
    return l`<span class="pad-key blank" aria-hidden="true"></span>`;
  }
  /** v1's "default" 3x3 grid. */
  _renderButtons() {
    return l`
      <div class="button-pad" role="group" aria-label="Directional pad">
        ${this.inlineExtras ? this._extra("power", "mdi:power", "Power") : this._blank()}
        ${this._key("up", "mdi:chevron-up", "Up")}
        ${this.inlineExtras ? this._extra("home", "mdi:home", "Home") : this._blank()}
        ${this._key("left", "mdi:chevron-left", "Left")}
        ${this._key("center", "mdi:circle", "Select", "ok")}
        ${this._key("right", "mdi:chevron-right", "Right")}
        ${this.inlineExtras ? this._extra("back", "mdi:arrow-u-left-top", "Back") : this._blank()}
        ${this._key("down", "mdi:chevron-down", "Down")}
        ${this.inlineExtras && this.showFavorite ? this._extra("favorite", "mdi:star", "Favourite") : this._blank()}
      </div>
    `;
  }
  _renderDpad() {
    return l`
      <div class="dpad" role="group" aria-label="Directional pad">
        ${this._key("up", "mdi:chevron-up", "Up", "up")}
        ${this._key("left", "mdi:chevron-left", "Left", "left")}
        <button
          class="pad-key ok"
          type="button"
          aria-label="Select"
          ${E({ onPress: () => this._emit("center"), haptics: this.haptics })}
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
    return l`
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
    return l`
      <div class="pad">
        ${this.pad === "touchpad" ? this._renderTouchpad() : this.pad === "dpad" ? this._renderDpad() : this._renderButtons()}
      </div>
    `;
  }
};
g.styles = [wt, oe];
A([
  S({ type: String })
], g.prototype, "pad", 2);
A([
  S({ type: Boolean })
], g.prototype, "repeat", 2);
A([
  S({ type: Boolean })
], g.prototype, "haptics", 2);
A([
  S({ type: Boolean, attribute: "inline-extras" })
], g.prototype, "inlineExtras", 2);
A([
  S({ type: Boolean })
], g.prototype, "showFavorite", 2);
A([
  qt(".touchpad")
], g.prototype, "_touchpad", 2);
A([
  qt(".touchpad-dot")
], g.prototype, "_dot", 2);
A([
  L()
], g.prototype, "_tracking", 2);
g = A([
  gt("polr-atv-nav-pad")
], g);
var li = Object.defineProperty, pi = Object.getOwnPropertyDescriptor, it = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? pi(t, i) : t, a = e.length - 1, n; a >= 0; a--)
    (n = e[a]) && (r = (o ? n(t, i, r) : n(r)) || r);
  return o && r && li(t, i, r), r;
};
const It = [
  { value: "activity", label: "Launch app or link", hint: "App name from the integration, or a deep link such as https://www.netflix.com/title" },
  { value: "app", label: "Open app id", hint: "Android package id, e.g. com.netflix.ninja. Needs a paired media player." },
  { value: "key", label: "Send a key", hint: "Android key code, e.g. GUIDE or MEDIA_REWIND" },
  { value: "service", label: "Call an action", hint: "domain.service, e.g. script.movie_night" }
], di = (e) => [
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
    type: "grid",
    name: "",
    schema: [
      { name: "show_header", selector: { boolean: {} } },
      { name: "show_power", selector: { boolean: {} } },
      { name: "show_nav", selector: { boolean: {} } },
      { name: "show_navigation_row", selector: { boolean: {} } },
      { name: "show_transport", selector: { boolean: {} } },
      { name: "show_volume", selector: { boolean: {} } },
      { name: "show_apps", selector: { boolean: {} } },
      { name: "show_text_input", selector: { boolean: {} } }
    ]
  },
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
  ] : [],
  {
    type: "expandable",
    name: "",
    title: "Advanced",
    schema: [
      {
        name: "media_player_entity",
        selector: { entity: { filter: [{ domain: "media_player" }] } }
      },
      { name: "hold_repeat", selector: { boolean: {} } },
      { name: "haptics", selector: { boolean: {} } },
      { name: "show_section_labels", selector: { boolean: {} } }
    ]
  }
], hi = {
  entity: "Remote entity",
  media_player_entity: "Paired media player (auto-detected)",
  name: "Title",
  pad: "Pad style",
  show_header: "Show header",
  show_power: "Show power",
  show_nav: "Show pad",
  show_navigation_row: "Back / home / menu row",
  show_transport: "Transport controls",
  show_volume: "Volume controls",
  show_apps: "App launcher",
  show_text_input: "Text input",
  hold_repeat: "Hold to repeat",
  haptics: "Haptic feedback",
  show_section_labels: "Section labels"
}, ui = {
  media_player_entity: "Only needed if the card cannot find the player itself, or to point it at a different player on the same TV.",
  show_text_input: "Sends typed text to the TV. Only lands while a search field is focused, and needs “Enable IME” on the integration."
};
let N = class extends z {
  constructor() {
    super(...arguments), this._editing = null, this._computeLabel = (e) => hi[e.name] ?? e.name, this._computeHelper = (e) => ui[e.name];
  }
  setConfig(e) {
    this._config = ee(e);
  }
  /** Emit a full v2 config. This is what upgrades stored v1 YAML. */
  _emit(e) {
    Y(this, "config-changed", { config: qe(e) });
  }
  _formChanged(e) {
    e.stopPropagation(), this._emit({ ...this._config, ...e.detail.value, apps: this._config.apps });
  }
  _setApps(e) {
    this._emit({ ...this._config, apps: e });
  }
  _addApp(e) {
    const t = [...this._config.apps, e];
    this._setApps(t), this._editing = t.length - 1;
  }
  _updateApp(e, t) {
    const i = this._config.apps.map(
      (o, r) => r === e ? { ...o, ...t } : o
    );
    this._setApps(i);
  }
  _removeApp(e) {
    this._setApps(this._config.apps.filter((t, i) => i !== e)), this._editing = null;
  }
  _moveApp(e, t) {
    const i = [...this._config.apps], o = e + t;
    o < 0 || o >= i.length || ([i[e], i[o]] = [i[o], i[e]], this._setApps(i), this._editing === e && (this._editing = o));
  }
  /** Change the action kind, carrying the old value across where it makes sense. */
  _setActionKind(e, t) {
    const i = this._config.apps[e].action, o = Vt(i);
    this._updateApp(e, { action: jt(t, o) });
  }
  _setActionValue(e, t) {
    const i = this._config.apps[e].action;
    this._updateApp(e, { action: jt(i.action, t) });
  }
  _renderIcon(e) {
    const t = e.icon ?? "mdi:application";
    if (t.startsWith("brand:")) {
      const i = $t[t.slice(6)];
      if (i) return l`<span class="brand">${i}</span>`;
    }
    return t.startsWith("/") || t.startsWith("http") ? l`<img class="brand" src=${t} alt="" />` : l`<ha-icon .icon=${t}></ha-icon>`;
  }
  /**
   * One list row.
   *
   * The inline edit form is a *sibling* `<li>`, appended by the caller rather
   * than returned from here. A single template emitting two `<li>` elements
   * gets mis-parsed — the second ends up nested inside the first, and the form
   * renders half-width, floating out of the row.
   */
  _renderAppRow(e, t, i) {
    const o = this._editing === t;
    return l`
      <li class="row">
        <div class="tile-icon">${this._renderIcon(e)}</div>
        <div class="tile-info">
          <div class="primary"><span>${e.name ?? "Untitled app"}</span></div>
          <div class="secondary"><span>${Be(e.action)}</span></div>
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
          .disabled=${t === i - 1}
          @click=${() => this._moveApp(t, 1)}
        >
          <ha-icon icon="mdi:arrow-down"></ha-icon>
        </button>
        <button
          class="icon-button"
          title=${o ? "Done" : "Edit"}
          @click=${() => {
      this._editing = o ? null : t;
    }}
        >
          <ha-icon icon=${o ? "mdi:check" : "mdi:pencil"}></ha-icon>
        </button>
        <button class="icon-button danger" title="Remove" @click=${() => this._removeApp(t)}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </li>
    `;
  }
  _renderAppForm(e, t) {
    const i = e.action.action, o = It.find((r) => r.value === i);
    return l`
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
              ${pt.map(
      (r) => l`
                  <button
                    class="chip ${e.icon === `brand:${r}` ? "accent" : ""}"
                    title=${`Use the ${ct[r]} logo`}
                    @click=${() => this._updateApp(t, { icon: `brand:${r}` })}
                  >
                    ${ct[r]}
                  </button>
                `
    )}
            </div>

            <label class="field">
              <span>Does what</span>
              <select
                .value=${i}
                @change=${(r) => this._setActionKind(t, r.target.value)}
              >
                ${It.map(
      (r) => l`
                    <option value=${r.value} ?selected=${r.value === i}>
                      ${r.label}
                    </option>
                  `
    )}
              </select>
            </label>

            <label class="field wide">
              <span>${o.label}</span>
              <input
                type="text"
                .value=${Vt(e.action)}
                @change=${(r) => this._setActionValue(t, r.target.value)}
              />
            </label>
            <div class="hint">${o.hint}</div>

            ${i === "service" ? l`<div class="hint">
                  Extra service data can only be set in YAML — switch to the code editor.
                </div>` : d}
          </div>
        </div>
      </li>
    `;
  }
  /**
   * Apps the TV itself knows about.
   *
   * `activity_list` is populated from the integration's own "configure apps"
   * options. It is empty until the user sets those up, which is worth saying
   * out loud rather than showing a blank space.
   */
  _renderFromTv() {
    const t = this.hass?.states?.[this._config.entity]?.attributes?.activity_list ?? [], i = new Set(
      this._config.apps.map(
        (r) => r.action.action === "activity" ? r.action.activity : ""
      )
    ), o = t.filter((r) => !i.has(r));
    return t.length ? o.length ? l`
      <div class="chips">
        ${o.map(
      (r) => l`
            <button
              class="chip"
              @click=${() => this._addApp({
        name: r,
        icon: vi(r),
        action: { action: "activity", activity: r }
      })}
            >
              <ha-icon icon="mdi:plus"></ha-icon>${r}
            </button>
          `
    )}
      </div>
    ` : l`<div class="hint">Every app this TV reports has been added.</div>` : l`<div class="hint">
        This TV reports no configured apps. Add them under Settings → Devices &
        Services → Android TV Remote → Configure, and they will appear here.
      </div>`;
  }
  render() {
    if (!this.hass || !this._config) return d;
    const e = this._config, t = e.apps;
    return l`
      <ha-form
        .hass=${this.hass}
        .data=${e}
        .schema=${di(e)}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._formChanged}
      ></ha-form>

      ${e.show_apps ? l`
            <div class="section-head">
              <span class="grow">Apps</span>
              <span class="count">${t.length}</span>
            </div>

            ${t.length ? l`<ul class="list">
                  ${t.flatMap(
      (i, o) => this._editing === o ? [
        this._renderAppRow(i, o, t.length),
        this._renderAppForm(i, o)
      ] : [this._renderAppRow(i, o, t.length)]
    )}
                </ul>` : l`<div class="empty-state">No apps yet — add one below.</div>`}

            <div class="section-head"><span class="grow">Add a known app</span></div>
            <div class="chips">
              ${pt.map(
      (i) => l`
                  <button
                    class="chip"
                    @click=${() => this._addApp({
        name: lt[i].label,
        icon: `brand:${i}`,
        action: { action: "activity", activity: lt[i].activity }
      })}
                  >
                    <ha-icon icon="mdi:plus"></ha-icon>${ct[i]}
                  </button>
                `
    )}
            </div>

            <div class="section-head"><span class="grow">Add from this TV</span></div>
            ${this._renderFromTv()}

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
    `;
  }
};
N.styles = [
  wt,
  ut`
      :host {
        display: block;
      }
      ha-form {
        display: block;
        margin-bottom: var(--ha-space-2, 8px);
      }
      ul.list {
        padding: 0;
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
it([
  S({ attribute: !1 })
], N.prototype, "hass", 2);
it([
  L()
], N.prototype, "_config", 2);
it([
  L()
], N.prototype, "_editing", 2);
N = it([
  gt("polr-android-tv-remote-card-editor")
], N);
const Vt = (e) => {
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
}, jt = (e, t) => {
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
}, vi = (e) => {
  const t = e.toLowerCase().replace(/[^a-z]/g, ""), i = pt.find((o) => t.includes(o) || o.includes(t));
  return i ? `brand:${i}` : "mdi:application";
};
var mi = Object.defineProperty, fi = Object.getOwnPropertyDescriptor, X = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? fi(t, i) : t, a = e.length - 1, n; a >= 0; a--)
    (n = e[a]) && (r = (o ? n(t, i, r) : n(r)) || r);
  return o && r && mi(t, i, r), r;
};
const _i = "2.0.0", ot = "polr-android-tv-remote-card";
let O = class extends z {
  constructor() {
    super(...arguments), this._text = "", this._sending = !1;
  }
  static getConfigElement() {
    return document.createElement(`${ot}-editor`);
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
    this._config = ee(e);
  }
  getCardSize() {
    const e = this._config;
    if (!e) return 6;
    let t = e.show_header ? 2 : 0;
    return e.show_nav && (t += e.pad === "buttons" ? 5 : 6), e.show_navigation_row && (t += 1), e.show_transport && (t += 1), e.show_volume && (t += 1), e.show_text_input && (t += 1), e.show_apps && e.apps.length && (t += 2), Math.max(t, 3);
  }
  /** Sections view sizing. Without this HA guesses, usually badly. */
  getGridOptions() {
    const e = this._config;
    return {
      columns: 12,
      min_columns: 6,
      rows: Math.max(this.getCardSize(), 4),
      min_rows: e?.show_nav ? 6 : 2
    };
  }
  get _device() {
    if (!(!this.hass || !this._config))
      return Le(this.hass, this._config);
  }
  _press(e) {
    const t = this._device;
    !this.hass || !this._config || !t || Ve(this.hass, this._config, t, e);
  }
  _navigate(e) {
    this._press(e.detail.direction);
  }
  _navButton(e) {
    this._press(e.detail.button);
  }
  _launch(e) {
    const t = this._device;
    !this.hass || !t || je(this.hass, t, e.action).catch((i) => {
      console.error(i);
    });
  }
  async _sendText() {
    const e = this._device, t = this._text.trim();
    if (!(!this.hass || !e || !t)) {
      this._sending = !0;
      try {
        await Ie(this.hass, e, t), this._text = "";
      } finally {
        this._sending = !1;
      }
    }
  }
  /* ------------------------------------------------------------- header -- */
  _renderHeader(e) {
    const t = this._config, i = e.available ? e.on ? [e.appName, e.mediaTitle].filter(Boolean).join(" · ") || "On" : "Off" : "Unavailable";
    return l`
      <div class="tile">
        ${e.picture ? l`<img class="now-playing-art" src=${e.picture} alt="" />` : l`
              <button
                class="tile-icon interactive"
                type="button"
                aria-label="More information"
                @click=${() => ti(this, e.playerId ?? e.remoteId)}
              >
                <ha-icon icon=${e.on ? "mdi:television-play" : "mdi:television"}></ha-icon>
              </button>
            `}
        <div class="tile-info">
          <div class="primary"><span>${e.name}</span></div>
          <div class="secondary" aria-live="polite"><span>${i}</span></div>
        </div>
        ${t.show_power ? l`
              <button
                class="icon-button"
                type="button"
                aria-label=${e.on ? "Turn off" : "Turn on"}
                ${E({ onPress: () => this._press("power"), haptics: t.haptics })}
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
    return e.muted ? t.push(l`<span class="chip warn"><ha-icon icon="mdi:volume-off"></ha-icon>Muted</span>`) : e.volume !== void 0 && t.push(l`<span class="chip accent">${Math.round(e.volume * 100)}%</span>`), t.length ? l`<div class="tile" style="padding-top:0;min-height:0">
      <div class="chips">${t}</div>
    </div>` : d;
  }
  /* -------------------------------------------------------------- rows -- */
  _button(e, t, i, o = {}) {
    const r = this._config;
    return l`
      <button
        class="control-button"
        type="button"
        aria-label=${i}
        title=${i}
        ${E({
      onPress: () => this._press(e),
      repeat: o.repeat && r.hold_repeat,
      haptics: r.haptics
    })}
      >
        <ha-icon icon=${t}></ha-icon>
      </button>
    `;
  }
  _renderNavigationRow() {
    const e = this._config;
    return l`
      <div class="features">
        ${this._button("back", "mdi:arrow-u-left-top", "Back")}
        ${this._button("home", "mdi:home", "Home")}
        ${this._button("menu", "mdi:menu", "Menu")}
        ${e.show_favorite ? this._button("favorite", "mdi:star", "Favourite") : d}
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
    const t = e.playerId === null, i = t || $(e, b.PREVIOUS_TRACK), o = t || $(e, b.NEXT_TRACK);
    return !i && !o && !t && !$(e, b.PAUSE) ? d : l`
      <div class="features">
        ${i ? this._button("previous", "mdi:skip-previous", "Previous") : d}
        ${this._button(
      "play_pause",
      e.playing ? "mdi:pause" : "mdi:play",
      e.playing ? "Pause" : "Play"
    )}
        ${o ? this._button("next", "mdi:skip-next", "Next") : d}
      </div>
    `;
  }
  _renderVolume(e) {
    return l`
      <div class="features">
        ${this._button("volume_down", "mdi:volume-minus", "Volume down", { repeat: !0 })}
        <button
          class="control-button"
          type="button"
          aria-label=${e.muted ? "Unmute" : "Mute"}
          aria-pressed=${e.muted ? "true" : "false"}
          ${E({
      onPress: () => this._press("volume_mute"),
      haptics: this._config.haptics
    })}
        >
          <ha-icon icon=${e.muted ? "mdi:volume-off" : "mdi:volume-high"}></ha-icon>
        </button>
        ${this._button("volume_up", "mdi:volume-plus", "Volume up", { repeat: !0 })}
      </div>
      ${e.volume !== void 0 ? l`
            <div class="volume-bar ${e.muted ? "muted" : ""}">
              <span style="width:${Math.round(e.volume * 100)}%"></span>
            </div>
          ` : d}
    `;
  }
  _renderTextInput() {
    return l`
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
      e.key === "Enter" && this._sendText();
    }}
        />
        <button
          class="control-button accent"
          type="button"
          aria-label="Send text"
          ?disabled=${!this._text.trim() || this._sending}
          @click=${() => void this._sendText()}
        >
          <ha-icon class=${this._sending ? "spin" : ""} icon="mdi:send"></ha-icon>
        </button>
      </div>
      <div class="hint">
        Text only lands while a search or input field is focused on the TV, and
        needs “Enable IME” on the Android TV Remote config entry.
      </div>
    `;
  }
  /* -------------------------------------------------------------- apps -- */
  _renderAppIcon(e) {
    const t = e.icon ?? "mdi:application";
    if (t.startsWith("brand:")) {
      const i = $t[t.slice(6)];
      if (i) return l`${i}`;
    }
    return t.startsWith("/") || t.startsWith("http") ? l`<img src=${t} alt="" />` : l`<ha-icon icon=${t}></ha-icon>`;
  }
  _renderApps() {
    const e = this._config;
    if (!e.apps.length) return d;
    const t = e.app_columns === "auto" ? Xe(e.apps.length) : e.app_columns;
    return l`
      ${e.show_section_labels ? l`<div class="section-head">
            Apps<span class="grow"></span><span class="count">${e.apps.length}</span>
          </div>` : d}
      <div class="app-grid" style="grid-template-columns: repeat(${t}, 1fr)">
        ${Ue(
      e.apps,
      (i, o) => `${o}:${i.icon ?? ""}`,
      (i) => l`
            <button
              class="app-tile"
              type="button"
              aria-label=${i.name ?? "Launch app"}
              title=${i.name ?? ""}
              style=${i.color ? `--app-color:${i.color}` : ""}
              ${E({ onPress: () => this._launch(i), haptics: e.haptics })}
            >
              ${this._renderAppIcon(i)}
            </button>
          `
    )}
      </div>
    `;
  }
  /* ------------------------------------------------------------ render -- */
  render() {
    if (!this.hass || !this._config) return d;
    const e = this._config, t = this._device;
    if (!t.found)
      return l`
        <ha-card>
          <div class="notice error">
            <ha-icon icon="mdi:alert-circle"></ha-icon>
            <span class="grow">Entity ${e.entity} not found.</span>
          </div>
        </ha-card>
      `;
    const i = ei("media_player", t.on ? "on" : "off"), o = t.available;
    return l`
      <ha-card style="--tile-color:${i}">
        ${e.show_header ? this._renderHeader(t) : d}
        ${e.show_header && t.playerId === null ? l`<div class="notice warn">
              <ha-icon icon="mdi:information-outline"></ha-icon>
              <span class="grow">
                No paired media player, so state, transport and volume level are
                unavailable. Set media_player_entity to fix it.
              </span>
            </div>` : d}
        ${o ? t.on ? l`
                ${e.show_nav ? l`<polr-atv-nav-pad
                      .pad=${e.pad}
                      .repeat=${e.hold_repeat}
                      .haptics=${e.haptics}
                      .inlineExtras=${!e.show_navigation_row}
                      .showFavorite=${e.show_favorite}
                      @atv-nav=${this._navigate}
                      @atv-button=${this._navButton}
                    ></polr-atv-nav-pad>` : d}
                ${e.show_navigation_row ? this._renderNavigationRow() : d}
                ${e.show_transport ? this._renderTransport(t) : d}
                ${e.show_volume ? this._renderVolume(t) : d}
                ${e.show_text_input ? this._renderTextInput() : d}
                ${e.show_apps ? this._renderApps() : d}
              ` : l`
                <div class="empty-state">The TV is off.</div>
                <div class="features">
                  <button
                    class="control-button accent wide"
                    type="button"
                    ${E({
      onPress: () => this._press("power"),
      haptics: e.haptics
    })}
                  >
                    <ha-icon icon="mdi:power"></ha-icon><span>Turn on</span>
                  </button>
                </div>
                ${e.show_apps ? this._renderApps() : d}
              ` : l`<div class="empty-state">This device is unavailable.</div>`}
      </ha-card>
    `;
  }
};
O.styles = [wt, oe];
X([
  S({ attribute: !1 })
], O.prototype, "hass", 2);
X([
  L()
], O.prototype, "_config", 2);
X([
  L()
], O.prototype, "_text", 2);
X([
  L()
], O.prototype, "_sending", 2);
O = X([
  gt(ot)
], O);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: ot,
  name: "Android TV Remote",
  description: "A remote for the Android TV Remote integration, with live state and an app launcher.",
  preview: !0,
  documentationURL: "https://github.com/pathofleastresistor/polr-android-tv-remote-card"
});
console.info(`%c ${ot} %c ${_i} `, "background:#555;color:#fff", "background:#3f51b5;color:#fff");
export {
  _i as CARD_VERSION,
  O as PolrAndroidTvRemoteCard
};
//# sourceMappingURL=polr-android-tv-remote-card.js.map
