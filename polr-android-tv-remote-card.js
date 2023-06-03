function t(t,e,i,s){var r,o=arguments.length,n=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(n=(o<3?r(n):o>3?r(e,i,n):r(e,i))||n);return o>3&&n&&Object.defineProperty(e,i,n),n}const e=window,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(e,t))}return t}toString(){return this.cssText}};const n=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t;var a;const l=window,d=l.trustedTypes,c=d?d.emptyScript:"",h=l.reactiveElementPolyfillSupport,v={toAttribute(t,e){switch(e){case Boolean:t=t?c:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},u=(t,e)=>e!==t&&(e==e||t==t),p={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:u},_="finalized";let m=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,i)=>{const s=this._$Ep(i,e);void 0!==s&&(this._$Ev.set(s,i),t.push(s))})),t}static createProperty(t,e=p){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,s=this.getPropertyDescriptor(t,i,e);void 0!==s&&Object.defineProperty(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){const r=this[t];this[e]=s,this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||p}static finalize(){if(this.hasOwnProperty(_))return!1;this[_]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])}))}createRenderRoot(){var t;const s=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{i?t.adoptedStyleSheets=s.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):s.forEach((i=>{const s=document.createElement("style"),r=e.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=i.cssText,t.appendChild(s)}))})(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)}))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=p){var s;const r=this.constructor._$Ep(t,i);if(void 0!==r&&!0===i.reflect){const o=(void 0!==(null===(s=i.converter)||void 0===s?void 0:s.toAttribute)?i.converter:v).toAttribute(e,i.type);this._$El=t,null==o?this.removeAttribute(r):this.setAttribute(r,o),this._$El=null}}_$AK(t,e){var i;const s=this.constructor,r=s._$Ev.get(t);if(void 0!==r&&this._$El!==r){const t=s.getPropertyOptions(r),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:v;this._$El=r,this[r]=o.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let s=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||u)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):s=!1),!this.isUpdatePending&&s&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,e)=>this[e]=t)),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)})),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach((t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,e)=>this._$EO(e,this[e],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};var g;m[_]=!0,m.elementProperties=new Map,m.elementStyles=[],m.shadowRootOptions={mode:"open"},null==h||h({ReactiveElement:m}),(null!==(a=l.reactiveElementVersions)&&void 0!==a?a:l.reactiveElementVersions=[]).push("1.6.2");const $=window,f=$.trustedTypes,w=f?f.createPolicy("lit-html",{createHTML:t=>t}):void 0,A="$lit$",y=`lit$${(Math.random()+"").slice(9)}$`,b="?"+y,x=`<${b}>`,E=document,H=()=>E.createComment(""),S=t=>null===t||"object"!=typeof t&&"function"!=typeof t,C=Array.isArray,k=t=>C(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]),L="[ \t\n\f\r]",M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,P=/-->/g,V=/>/g,U=RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,z=/"/g,T=/^(?:script|style|textarea|title)$/i,O=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),R=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),N=new WeakMap,j=E.createTreeWalker(E,129,null,!1),I=(t,e)=>{const i=t.length-1,s=[];let r,o=2===e?"<svg>":"",n=M;for(let e=0;e<i;e++){const i=t[e];let a,l,d=-1,c=0;for(;c<i.length&&(n.lastIndex=c,l=n.exec(i),null!==l);)c=n.lastIndex,n===M?"!--"===l[1]?n=P:void 0!==l[1]?n=V:void 0!==l[2]?(T.test(l[2])&&(r=RegExp("</"+l[2],"g")),n=U):void 0!==l[3]&&(n=U):n===U?">"===l[0]?(n=null!=r?r:M,d=-1):void 0===l[1]?d=-2:(d=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?U:'"'===l[3]?z:D):n===z||n===D?n=U:n===P||n===V?n=M:(n=U,r=void 0);const h=n===U&&t[e+1].startsWith("/>")?" ":"";o+=n===M?i+x:d>=0?(s.push(a),i.slice(0,d)+A+i.slice(d)+y+h):i+y+(-2===d?(s.push(void 0),e):h)}const a=o+(t[i]||"<?>")+(2===e?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==w?w.createHTML(a):a,s]};class Z{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,o=0;const n=t.length-1,a=this.parts,[l,d]=I(t,e);if(this.el=Z.createElement(l,i),j.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(s=j.nextNode())&&a.length<n;){if(1===s.nodeType){if(s.hasAttributes()){const t=[];for(const e of s.getAttributeNames())if(e.endsWith(A)||e.startsWith(y)){const i=d[o++];if(t.push(e),void 0!==i){const t=s.getAttribute(i.toLowerCase()+A).split(y),e=/([.?@])?(.*)/.exec(i);a.push({type:1,index:r,name:e[2],strings:t,ctor:"."===e[1]?K:"?"===e[1]?G:"@"===e[1]?J:q})}else a.push({type:6,index:r})}for(const e of t)s.removeAttribute(e)}if(T.test(s.tagName)){const t=s.textContent.split(y),e=t.length-1;if(e>0){s.textContent=f?f.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],H()),j.nextNode(),a.push({type:2,index:++r});s.append(t[e],H())}}}else if(8===s.nodeType)if(s.data===b)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(y,t+1));)a.push({type:7,index:r}),t+=y.length-1}r++}}static createElement(t,e){const i=E.createElement("template");return i.innerHTML=t,i}}function Y(t,e,i=t,s){var r,o,n,a;if(e===R)return e;let l=void 0!==s?null===(r=i._$Co)||void 0===r?void 0:r[s]:i._$Cl;const d=S(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==d&&(null===(o=null==l?void 0:l._$AO)||void 0===o||o.call(l,!1),void 0===d?l=void 0:(l=new d(t),l._$AT(t,i,s)),void 0!==s?(null!==(n=(a=i)._$Co)&&void 0!==n?n:a._$Co=[])[s]=l:i._$Cl=l),void 0!==l&&(e=Y(t,l._$AS(t,e.values),l,s)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:i},parts:s}=this._$AD,r=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:E).importNode(i,!0);j.currentNode=r;let o=j.nextNode(),n=0,a=0,l=s[0];for(;void 0!==l;){if(n===l.index){let e;2===l.type?e=new W(o,o.nextSibling,this,t):1===l.type?e=new l.ctor(o,l.name,l.strings,this,t):6===l.type&&(e=new Q(o,this,t)),this._$AV.push(e),l=s[++a]}n!==(null==l?void 0:l.index)&&(o=j.nextNode(),n++)}return j.currentNode=E,r}v(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class W{constructor(t,e,i,s){var r;this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cp=null===(r=null==s?void 0:s.isConnected)||void 0===r||r}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Y(this,t,e),S(t)?t===B||null==t||""===t?(this._$AH!==B&&this._$AR(),this._$AH=B):t!==this._$AH&&t!==R&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):k(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==B&&S(this._$AH)?this._$AA.nextSibling.data=t:this.$(E.createTextNode(t)),this._$AH=t}g(t){var e;const{values:i,_$litType$:s}=t,r="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=Z.createElement(s.h,this.options)),s);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===r)this._$AH.v(i);else{const t=new X(r,this),e=t.u(this.options);t.v(i),this.$(e),this._$AH=t}}_$AC(t){let e=N.get(t.strings);return void 0===e&&N.set(t.strings,e=new Z(t)),e}T(t){C(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new W(this.k(H()),this.k(H()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cp=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class q{constructor(t,e,i,s,r){this.type=1,this._$AH=B,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=B}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,s){const r=this.strings;let o=!1;if(void 0===r)t=Y(this,t,e,0),o=!S(t)||t!==this._$AH&&t!==R,o&&(this._$AH=t);else{const s=t;let n,a;for(t=r[0],n=0;n<r.length-1;n++)a=Y(this,s[i+n],e,n),a===R&&(a=this._$AH[n]),o||(o=!S(a)||a!==this._$AH[n]),a===B?t=B:t!==B&&(t+=(null!=a?a:"")+r[n+1]),this._$AH[n]=a}o&&!s&&this.j(t)}j(t){t===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class K extends q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===B?void 0:t}}const F=f?f.emptyScript:"";class G extends q{constructor(){super(...arguments),this.type=4}j(t){t&&t!==B?this.element.setAttribute(this.name,F):this.element.removeAttribute(this.name)}}class J extends q{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=Y(this,t,e,0))&&void 0!==i?i:B)===R)return;const s=this._$AH,r=t===B&&s!==B||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==B&&(s===B||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class Q{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Y(this,t)}}const tt={O:A,P:y,A:b,C:1,M:I,L:X,D:k,R:Y,I:W,V:q,H:G,N:J,U:K,F:Q},et=$.litHtmlPolyfillSupport;null==et||et(Z,W),(null!==(g=$.litHtmlVersions)&&void 0!==g?g:$.litHtmlVersions=[]).push("2.7.4");var it,st;let rt=class extends m{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{var s,r;const o=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:e;let n=o._$litPart$;if(void 0===n){const t=null!==(r=null==i?void 0:i.renderBefore)&&void 0!==r?r:null;o._$litPart$=n=new W(e.insertBefore(H(),t),t,void 0,null!=i?i:{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return R}};rt.finalized=!0,rt._$litElement$=!0,null===(it=globalThis.litElementHydrateSupport)||void 0===it||it.call(globalThis,{LitElement:rt});const ot=globalThis.litElementPolyfillSupport;null==ot||ot({LitElement:rt}),(null!==(st=globalThis.litElementVersions)&&void 0!==st?st:globalThis.litElementVersions=[]).push("3.3.2");const nt=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(i){i.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(i){i.createProperty(e.key,t)}};function at(t){return(e,i)=>void 0!==i?((t,e,i)=>{e.constructor.createProperty(i,t)})(t,e,i):nt(t,e)}var lt;null===(lt=window.HTMLSlotElement)||void 0===lt||lt.prototype.assignedElements;const dt=(t,e,i)=>{for(const i of e)if(i[0]===t)return(0,i[1])();return null==i?void 0:i()},ct=2;class ht{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}const{I:vt}=tt,ut=()=>document.createComment(""),pt=(t,e,i)=>{var s;const r=t._$AA.parentNode,o=void 0===e?t._$AB:e._$AA;if(void 0===i){const e=r.insertBefore(ut(),o),s=r.insertBefore(ut(),o);i=new vt(e,s,t,t.options)}else{const e=i._$AB.nextSibling,n=i._$AM,a=n!==t;if(a){let e;null===(s=i._$AQ)||void 0===s||s.call(i,t),i._$AM=t,void 0!==i._$AP&&(e=t._$AU)!==n._$AU&&i._$AP(e)}if(e!==o||a){let t=i._$AA;for(;t!==e;){const e=t.nextSibling;r.insertBefore(t,o),t=e}}}return i},_t=(t,e,i=t)=>(t._$AI(e,i),t),mt={},gt=t=>{var e;null===(e=t._$AP)||void 0===e||e.call(t,!1,!0);let i=t._$AA;const s=t._$AB.nextSibling;for(;i!==s;){const t=i.nextSibling;i.remove(),i=t}},$t=(t,e,i)=>{const s=new Map;for(let r=e;r<=i;r++)s.set(t[r],r);return s},ft=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends ht{constructor(t){if(super(t),t.type!==ct)throw Error("repeat() can only be used in text expressions")}dt(t,e,i){let s;void 0===i?i=e:void 0!==e&&(s=e);const r=[],o=[];let n=0;for(const e of t)r[n]=s?s(e,n):n,o[n]=i(e,n),n++;return{values:o,keys:r}}render(t,e,i){return this.dt(t,e,i).values}update(t,[e,i,s]){var r;const o=(t=>t._$AH)(t),{values:n,keys:a}=this.dt(e,i,s);if(!Array.isArray(o))return this.ht=a,n;const l=null!==(r=this.ht)&&void 0!==r?r:this.ht=[],d=[];let c,h,v=0,u=o.length-1,p=0,_=n.length-1;for(;v<=u&&p<=_;)if(null===o[v])v++;else if(null===o[u])u--;else if(l[v]===a[p])d[p]=_t(o[v],n[p]),v++,p++;else if(l[u]===a[_])d[_]=_t(o[u],n[_]),u--,_--;else if(l[v]===a[_])d[_]=_t(o[v],n[_]),pt(t,d[_+1],o[v]),v++,_--;else if(l[u]===a[p])d[p]=_t(o[u],n[p]),pt(t,o[v],o[u]),u--,p++;else if(void 0===c&&(c=$t(a,p,_),h=$t(l,v,u)),c.has(l[v]))if(c.has(l[u])){const e=h.get(a[p]),i=void 0!==e?o[e]:null;if(null===i){const e=pt(t,o[v]);_t(e,n[p]),d[p]=e}else d[p]=_t(i,n[p]),pt(t,o[v],i),o[e]=null;p++}else gt(o[u]),u--;else gt(o[v]),v++;for(;p<=_;){const e=pt(t,d[_+1]);_t(e,n[p]),d[p++]=e}for(;v<=u;){const t=o[v++];null!==t&&gt(t)}return this.ht=a,((t,e=mt)=>{t._$AH=e})(t,d),R}});class wt extends rt{constructor(){super(...arguments),this.active=!1,this.currentX=0,this.currentY=0,this.initialX=0,this.initialY=0}static getConfigElement(){return document.createElement("polr-atv-remote-card-editor")}static getStubConfig(){return{entity_id:"remote.atvremote",apps:["disneyplus"],remote:"touch"}}static get properties(){return{_hass:{},_config:{}}}setConfig(t){if(!t.entity_id)throw new Error("entity_id must be specified");this._config=t}set hass(t){this._hass=t}firstUpdated(){this._touchpad=this.renderRoot.querySelector("#touchpad"),this._dragItem=this.renderRoot.querySelector("#nub")}render(){return O`
      <div class="card-content">
        <div class="grid card-grid">
          ${dt(this._config.remote,[["default",()=>this._render_defaultpad()],["touch",()=>this._render_touchpad()],["dpad",()=>this._render_dpad()]])}
          ${this._render_apps()}
          ${this._render_volume()}
        </div>
      </div>
    `}_render_volume(){return O`
      <div class="grid volume-grid">
        <div @click=${this._send_command("VOLUME_DOWN")} class="remote-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
          >
            <title>volume-minus</title>
            <path d="M3,9H7L12,4V20L7,15H3V9M14,11H22V13H14V11Z" />
          </svg>
        </div>
        <div @click=${this._send_command("MUTE")} class="remote-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
          >
            <title>volume-mute</title>
            <path
              d="M3,9H7L12,4V20L7,15H3V9M16.59,12L14,9.41L15.41,8L18,10.59L20.59,8L22,9.41L19.41,12L22,14.59L20.59,16L18,13.41L15.41,16L14,14.59L16.59,12Z"
            />
          </svg>
        </div>
        <div @click=${this._send_command("VOLUME_UP")} class="remote-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
          >
            <title>volume-plus</title>
            <path
              d="M3,9H7L12,4V20L7,15H3V9M14,11H17V8H19V11H22V13H19V16H17V13H14V11Z"
            />
          </svg>
        </div>
      </div>
    `}_render_dpad(){return O`
      ${this._render_power()}
      <div class="pie">
        <div class="slice">
          <div id="top" class="slice-contents" @click=${this._send_command("DPAD_UP")}>
            top button
          </div>
        </div>
        <div class="slice">
          <div id="right" class="slice-contents" @click=${this._send_command("DPAD_RIGHT")}>
            click 2
          </div>
        </div>
        <div class="slice">
          <div id="down" class="slice-contents" @click=${this._send_command("DPAD_DOWN")}>
            click 3
          </div>
        </div>
        <div class="slice">
          <div id="left" class="slice-contents" @click=${this._send_command("DPAD_LEFT")}>
            click 4
          </div>
        </div>
        <div id="center" class="inner-pie" @click=${this._send_command("DPAD_CENTER")}></div>
      </div>
      ${this._render_basic_buttons()}
    `}_render_touchpad(){return O`
      ${this._render_power()}
      <div id="touchpad">
        <div
          @mousedown=${this._dragStart}
          @mousemove=${this._drag}
          @mouseup=${this._dragEnd}
          @touchstart=${this._dragStart}
          @touchmove=${this._drag}
          @touchend=${this._dragEnd}
          id="nub"
        ></div>
      </div>
      ${this._render_basic_buttons()}
    `}_render_defaultpad(){return O`
      <div class="grid remote-grid">
        <div @click=${this._press_power} class="remote-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
          >
            <path
              d="M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13"
            />
          </svg>
        </div>
        <div @click=${this._send_command("DPAD_UP")} class="remote-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
          >
            <path d="M7,15L12,10L17,15H7Z" />
          </svg>
        </div>
        <div @click=${this._send_command("HOME")} class="remote-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
          >
            <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
          </svg>
        </div>
        <div @click=${this._send_command("DPAD_LEFT")} class="remote-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
          >
            <path d="M14,7L9,12L14,17V7Z" />
          </svg>
        </div>
        <div @click=${this._send_command("DPAD_CENTER")} class="center remote-button"></div>
        <div @click=${this._send_command("DPAD_RIGHT")} class="remote-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
          >
            <path d="M10,17L15,12L10,7V17Z" />
          </svg>
        </div>
        <div @click=${this._send_command("BACK")} class="remote-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
          >
            <path
              d="M13.5 21H6V17H13.5C15.43 17 17 15.43 17 13.5S15.43 10 13.5 10H11V14L4 8L11 2V6H13.5C17.64 6 21 9.36 21 13.5S17.64 21 13.5 21Z"
            />
          </svg>
        </div>
        <div @click=${this._send_command("DPAD_DOWN")} class="remote-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
          >
            <path d="M7,10L12,15L17,10H7Z" />
          </svg>
        </div>
        <div @click=${this._press_favorite_2} class="remote-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
          >
            <path
              d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
            />
          </svg>
        </div>
      </div>
    `}_render_power(){return O`
      <div class="power-grid">
        <div @click=${this._press_power} class="remote-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
          >
            <path
              d="M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13"
            />
          </svg>
        </div>
      </div>
    `}_render_basic_buttons(){return O`
      <div class="grid basic-grid">
        <div @click=${this._send_command("HOME")} class="remote-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
          >
            <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
          </svg>
        </div>
        <div @click=${this._send_command("BACK")} class="remote-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
          >
            <path
              d="M13.5 21H6V17H13.5C15.43 17 17 15.43 17 13.5S15.43 10 13.5 10H11V14L4 8L11 2V6H13.5C17.64 6 21 9.36 21 13.5S17.64 21 13.5 21Z"
            />
          </svg>
        </div>
      </div>
    `}_render_apps(){return this._config.apps?O`
      <div class="grid app-grid">
      ${ft(this._config.apps,(t=>t),((t,e)=>O`
        ${dt(t,[["disneyplus",()=>this._render_disneyplus()],["hbomax",()=>this._render_hbomax()],["hulu",()=>this._render_hulu()],["netflix",()=>this._render_netflix()],["prime",()=>this._render_prime()],["youtube",()=>this._render_youtube()]],(()=>this._render_custom(t)))}
      `))}
    </div>
    `:O``}_render_disneyplus(){return O`
      <div @click=${this._turn_on("https://www.disneyplus.com")} class="remote-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
        >
          <path
            d="M2.056 6.834C1.572 6.834 1 6.77 1 6.483c0-2.023 3.562-2.11 5.08-2.11 1.978 0 4.506.614 6.66 1.384 3.277 1.188 9.917 5.145 9.917 9.674 0 4.001-4.31 5.914-8.311 5.914a22.376 22.376 0 0 1-3.21-.33c-.066.243-.11.418-.264.924-.253.052-.511.081-.77.087l-.505-.043c-.33-.396-.44-1.033-.572-1.715-2-1.165-3.298-2.155-3.891-2.836-.506-.528-1.078-1.232-1.078-1.913 0-.351.22-.66.726-1.01 1.034-.77 2.352-1.188 4.507-1.563l.044-.9c.022-.22.242-2.573.748-3.013.813.66.901 1.341.967 2.353.022.44.044.901.11 1.385h.308c1.539 0 6.244.395 6.244 2.616 0 .528-.77 1.517-1.518 1.517a1.9 1.9 0 0 1-.966-.285c.329-.375.813-.704.945-.99-.44-.528-2.814-1.143-4.551-1.143a4.043 4.043 0 0 0-.572.022l.022 4.815c.703.44 1.561.483 2.11.483 2.42 0 7.431-.417 7.431-4.331 0-3.87-4.946-6.86-8.64-8.266a21.394 21.394 0 0 0-7.937-1.496 7.22 7.22 0 0 0-1.803.198c-.373.088-.505.176-.505.264 0 .153.747.242.836.286a.221.221 0 0 1 .11.175.26.26 0 0 1-.088.176c-.089 0-.286.022-.528.022zM9.2 14.551c-2.176.177-4.595.397-4.595 1.166 0 .594 1.012 1.32 1.627 1.781a7.052 7.052 0 0 0 2.77 1.319zm11.155-9.85c-.02.428-.042.942-.042 1.723 0 .3 0 .642.01 1.027-.042.193-.32.214-.46.278a1.148 1.148 0 0 1-.256-.192V4.83c0-.29.01-.588.01-1.038 0-.225 0-.482-.01-.792 0-.192.032-.374.15-.802a.342.342 0 0 1 .3-.224c.245.064.491.17.577.374-.257.76-.235 1.594-.279 2.353zm-.384-.085c.428.021.941.042 1.722.042.3 0 .643 0 1.027-.01.193.041.215.32.279.459-.052.094-.116.18-.193.257H20.1c-.289 0-.589-.01-1.037-.01-.225 0-.482 0-.792.01-.193.002-.375-.03-.803-.149a.346.346 0 0 1-.225-.299c.064-.246.172-.492.374-.578.76.257 1.595.235 2.355.278z"
          />
        </svg>
      </div>
    `}_render_hbomax(){return O`
      <div @click=${this._turn_on("https://play.hbomax.com")} class="remote-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
        >
          <path
            d="M8.844 4.249h3.205a2.013 2.013 0 0 1 1.848 1.876c1.607-3.368 6.667-2.217 6.658 1.515.045 3.744-5.026 4.939-6.658 1.568a2.077 2.077 0 0 1-2.07 1.947H8.845Zm-5.395 0h1.92v2.58h1.213V4.253H8.46v6.902H6.586V8.48H5.373v2.676H3.449ZM9.872 19.83h-.576a.603.603 0 0 1-.6-.57c0-.013-.007-.023-.007-.035v-3.667a1.192 1.192 0 0 0-1.279-1.21 1.192 1.192 0 0 0-1.279 1.211v4.167a.103.103 0 0 1-.102.103h-.575a.61.61 0 0 1-.61-.611v-3.666a1.319 1.319 0 0 0-.066-.296 1.176 1.176 0 0 0-1.213-.913 1.19 1.19 0 0 0-1.183.817c-.05.131-.079.267-.087.406v4.17a.104.104 0 0 1-.104.102h-.579a.61.61 0 0 1-.61-.61V15.56a2.322 2.322 0 0 1 1.68-2.32c.285-.088.584-.133.883-.133a2.584 2.584 0 0 1 1.92.752 2.588 2.588 0 0 1 1.921-.752 2.608 2.608 0 0 1 1.872.715c.451.465.7 1.09.692 1.738v4.171a.103.103 0 0 1-.098.103zm.428-3.35a3.76 3.76 0 0 1 .568-2.102c.133-.2.29-.38.47-.539a2.958 2.958 0 0 1 2.013-.744 3.014 3.014 0 0 1 1.845.59.61.61 0 0 1 .597-.48h.574a.107.107 0 0 1 .105.103v6.427a.104.104 0 0 1-.104.103h-.573a.61.61 0 0 1-.612-.553c-2.16 1.55-5.14-.164-4.887-2.811Zm12.623 3.35h-.977a.813.813 0 0 1-.675-.357l-1.079-1.6a.356.356 0 0 0-.588 0l-1.08 1.6a.825.825 0 0 1-.245.22.803.803 0 0 1-.43.137h-.978a.075.075 0 0 1-.063-.121l1.18-1.752.744-1.1a.61.61 0 0 0 0-.682l-.05-.075-1.872-2.773a.077.077 0 0 1 .062-.121h.978a.813.813 0 0 1 .674.36l.826 1.221.254.376a.355.355 0 0 0 .59 0l1.08-1.597a.82.82 0 0 1 .673-.36h.978a.077.077 0 0 1 .06.122l-1.925 2.855a.61.61 0 0 0 0 .682l1.929 2.853a.076.076 0 0 1-.066.116zM17.068 9.403c1.567.002 2.356-1.89 1.25-3-1.103-1.11-3-.33-3.003 1.237A1.756 1.756 0 0 0 17.068 9.4zm0-3.14c1.23.003 1.843 1.493.97 2.36-.872.866-2.358.246-2.354-.983a1.38 1.38 0 0 1 1.38-1.378zm-3.719 8.1a1.77 1.77 0 0 0-1.783 1.63 3.15 3.15 0 0 0-.037.489 1.867 1.867 0 0 0 1.82 2.123 1.696 1.696 0 0 0 1.455-.764c.253-.407.381-.88.367-1.36a1.867 1.867 0 0 0-1.822-2.118zm.227-6.191a2.976 2.976 0 0 1 0-.954 1.475 1.475 0 0 1-.723.422c.29.096.544.283.722.533zm-1.486.785a.548.548 0 0 0-.5-.577h-.954v1.17h.954a.553.553 0 0 0 .5-.593zm0-2.595a.55.55 0 0 0-.5-.577h-.954V6.94h.954a.548.548 0 0 0 .5-.578z"
          />
        </svg>
      </div>
    `}_render_hulu(){return O`
      <div @click=${this._turn_on("HULU")} class="remote-button">
        <svg
          width="48px"
          height="48px"
          viewBox="0 0 24 24"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <path
            d="m 14.248,8.7019997 h 1.59 V 15.298 h -1.59 z M 5.143,10.764 H 4.124 a 1.4,1.4 0 0 0 -0.36,0.037 C 3.673,10.826 3.615,10.843 3.59,10.851 V 8.7 H 2 v 6.6 h 1.59 v -2.66 a 0.428,0.428 0 0 1 0.124,-0.3 0.4,0.4 0 0 1 0.3,-0.13 h 0.92 a 0.446,0.446 0 0 1 0.435,0.435 V 15.3 h 1.575 v -2.871 a 1.53,1.53 0 0 0 -0.5,-1.261 2,2 0 0 0 -1.301,-0.404 z m 15.267,0 v 2.658 a 0.423,0.423 0 0 1 -0.422,0.423 h -0.932 a 0.423,0.423 0 0 1 -0.422,-0.423 v -2.658 h -1.59 v 2.783 a 1.679,1.679 0 0 0 0.49,1.3 1.874,1.874 0 0 0 1.323,0.453 H 20.41 A 1.47,1.47 0 0 0 21.571,14.816 1.842,1.842 0 0 0 22,13.547 v -2.783 z m -8.957,2.658 a 0.4,0.4 0 0 1 -0.13,0.3 0.43,0.43 0 0 1 -0.3,0.124 H 10.1 A 0.423,0.423 0 0 1 9.678,13.423 V 10.764 H 8.087 v 2.783 a 1.676,1.676 0 0 0 0.491,1.3 1.855,1.855 0 0 0 1.31,0.453 h 1.565 a 1.473,1.473 0 0 0 1.162,-0.484 1.842,1.842 0 0 0 0.429,-1.267 v -2.785 h -1.591 z"
          />
        </svg>
      </div>
    `}_render_netflix(){return O`
      <div @click=${this._turn_on("https://www.netflix.com/title")} class="remote-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xml:space="preserve"
          width="48"
          height="48"
          version="1.0"
          viewBox="0 0 24 24"
        >
          <path
            d="M5.94 1v10.994c0 6.045.006 10.996.014 11.004.01.01.382-.029.834-.078a73.701 73.701 0 0 1 1.383-.139 80.63 80.628 0 0 1 2.06-.133c.05 0 .052-.246.058-4.655l.01-4.645.34.964c1.406 3.979 1.77 5.004 2.166 6.117v.002l.206.581.575 1.624c.003.003.292.02.642.038a48.332 48.33 0 0 1 3.37.29c.12.014.227.024.307.03.038.002.044 0 .067 0 .023 0 .062.003.067 0h.006c.003 0 .003-.967.005-1.382l.002-.435c.007-1.783.01-4.836.007-9.181l-.01-10.979h-4.311L13.73 5.88l-.01 4.859v.003l-.398-1.13V9.61v.002l-2.04-5.765v-.013l-.177-.501c-.422-1.195-.781-2.205-.795-2.251L10.28 1H8.107Z"
          />
        </svg>
      </div>
    `}_render_prime(){return O`
      <div @click=${this._turn_on("https://app.primevideo.com")} class="remote-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
        >
          <path
            d="M20.182 5.404a4.05 4.05 0 0 0 .625.05 1.116 1.116 0 0 0 .342-.03.474.474 0 0 0 .404-.306.605.605 0 0 0 .015-.276.4.4 0 0 0-.243-.334.88.88 0 0 0-.281-.064.791.791 0 0 0-.833.499 1.438 1.438 0 0 0-.102.367c-.006.088-.006.088.073.094zm-1.074-.4a1.808 1.808 0 0 1 1.633-1.359 2.38 2.38 0 0 1 1.057.102c.655.224 1.009.932.794 1.59a.986.986 0 0 1-.489.588 1.986 1.986 0 0 1-.66.211 3.534 3.534 0 0 1-1.207-.016 1.221 1.221 0 0 0-.146-.023.88.88 0 0 0 .716.954 2.58 2.58 0 0 0 .995 0c.154-.033.302-.065.456-.102.154-.036.218.012.218.17v.392a.242.242 0 0 1-.18.26 3.082 3.082 0 0 1-.626.17 3.247 3.247 0 0 1-1.214-.01 1.663 1.663 0 0 1-1.36-1.272 2.935 2.935 0 0 1 .016-1.656zm.317 6.367a2.588 2.588 0 0 1 1.012.039 1.936 1.936 0 0 1 1.41 1.635v.011h-.014v.1a.078.078 0 0 0 .024.08v-.021l.007.01v.61l-.012.021v-.01c-.03.02-.02.047-.02.08V14c-.048.9-.747 1.63-1.644 1.717a2.627 2.627 0 0 1-.998-.052 1.694 1.694 0 0 1-1.246-1.114 2.825 2.825 0 0 1 0-2.005c.219-.65.8-1.11 1.482-1.175zM12 3.946c0-.043.006-.086.016-.127a.156.156 0 0 1 .147-.102h.67a.19.19 0 0 1 .184.147c.028.075.044.147.07.223.053 0 .086-.036.122-.057a2.743 2.743 0 0 1 .946-.398 1.962 1.962 0 0 1 .795 0c.25.054.47.202.615.413a.25.25 0 0 0 .03.038v.014c.132-.079.271-.164.415-.237a2.382 2.382 0 0 1 1.203-.266 1.061 1.061 0 0 1 1.095 1.027v2.964c0 .238-.03.27-.27.27h-.647a.906.906 0 0 1-.126 0 .147.147 0 0 1-.128-.122.994.994 0 0 1-.01-.175V5.101a.944.944 0 0 0-.033-.293.4.4 0 0 0-.36-.294 1.861 1.861 0 0 0-.912.176.087.087 0 0 0-.063.096v2.788a.774.774 0 0 1-.01.155c0 .07-.058.127-.128.127h-.81c-.197 0-.24-.047-.24-.243V5.1a1.24 1.24 0 0 0-.026-.276.4.4 0 0 0-.371-.318 1.874 1.874 0 0 0-.928.18.085.085 0 0 0-.059.103v2.833c0 .195-.044.236-.239.236h-.704c-.188 0-.235-.053-.235-.232zm2.71 9.92a.178.178 0 0 0-.074-.011 2 2 0 0 0 .057.324c.08.337.358.59.7.636a2.664 2.664 0 0 0 1.088-.037c.117-.026.229-.053.345-.085.154-.037.223.023.223.17v.385a.235.235 0 0 1-.19.271 3.36 3.36 0 0 1-1.141.217 2.901 2.901 0 0 1-.796-.079 1.63 1.63 0 0 1-1.215-1.136 2.946 2.946 0 0 1-.02-1.776 1.848 1.848 0 0 1 1.838-1.363c.268-.012.535.023.792.101.44.123.775.48.868.928a1.468 1.468 0 0 1 0 .587.983.983 0 0 1-.535.704 2.166 2.166 0 0 1-.891.23 4.15 4.15 0 0 1-1.055-.067zm-3.133-2.202c.027-.037.012-.075.012-.112V9.847c0-.202.037-.238.238-.238h.734c.161.006.207.044.207.208v5.586c0 .147-.049.201-.196.201h-.69a.19.19 0 0 1-.186-.146.82.82 0 0 0-.057-.185c-.048.008-.069.045-.107.067a1.714 1.714 0 0 1-1.615.276 1.526 1.526 0 0 1-.917-.812 2.495 2.495 0 0 1-.266-1.13 2.999 2.999 0 0 1 .187-1.225 1.66 1.66 0 0 1 .826-.945c.552-.263 1.2-.22 1.713.111a.294.294 0 0 0 .117.059zm-.797-3.817h-.733a.32.32 0 0 1-.075 0 .147.147 0 0 1-.147-.137V3.893c0-.127.054-.176.18-.18a19.455 19.455 0 0 1 .828 0c.122 0 .159.037.17.158v3.67a.982.982 0 0 1-.01.176.134.134 0 0 1-.128.12.456.456 0 0 1-.089 0zm-1.045-5.45a.616.616 0 0 1 .642-.586h.064a.649.649 0 0 1 .248.036.6.6 0 0 1 .411.67.587.587 0 0 1-.506.534.963.963 0 0 1-.355 0 .587.587 0 0 1-.504-.66Zm-3.092 5.2V3.983c0-.244.026-.27.27-.27h.51a.211.211 0 0 1 .238.179c.037.132.07.264.1.408a.161.161 0 0 0 .091-.065 3.514 3.514 0 0 1 .303-.27 1.41 1.41 0 0 1 .964-.293c.138 0 .186.048.197.18.01.18 0 .367 0 .546a.985.985 0 0 1-.012.22.147.147 0 0 1-.147.146 1.812 1.812 0 0 1-.22 0 2.523 2.523 0 0 0-1.027.147c-.074.026-.074.079-.074.138v2.678a.13.13 0 0 1-.128.122.992.992 0 0 1-.132 0v.01h-.69a.784.784 0 0 1-.117 0 .147.147 0 0 1-.126-.132zm.904 3.228a.604.604 0 0 1-.192 0 .998.998 0 0 1-.176-.02.6.6 0 0 1-.466-.7.587.587 0 0 1 .567-.536.473.473 0 0 1 .111 0 .638.638 0 0 1 .313.054c.208.078.35.272.361.494a.624.624 0 0 1-.518.716zm.44.855v3.764a.147.147 0 0 1-.133.159h-.88a.147.147 0 0 1-.162-.128v-.026a.567.567 0 0 1 0-.1v-3.67c0-.164.045-.21.21-.21h.751c.164.007.211.054.211.218zm-1.711.047-.317.844-1.067 2.774c-.01.032-.027.063-.037.095a.261.261 0 0 1-.265.175h-.702a.294.294 0 0 1-.318-.218c-.133-.349-.27-.704-.403-1.055-.318-.832-.641-1.666-.96-2.504a.928.928 0 0 1-.069-.207c-.016-.105.021-.158.128-.158h.901c.128 0 .185.085.218.196.058.201.117.408.18.61.217.733.43 1.479.646 2.217h.01l.096-.308.733-2.46.031-.095a.214.214 0 0 1 .213-.147h.812c.2-.003.243.054.176.245zM1.786 3.82a.377.377 0 0 1 .318-.107h.488a.21.21 0 0 1 .234.18c.01.053.02.106.037.16a.022.022 0 0 0 .02.015.429.429 0 0 0 .11-.08 1.87 1.87 0 0 1 1.586-.354c.48.115.874.454 1.061.91a2.451 2.451 0 0 1 .205.798h-.008c.051.444.011.893-.118 1.321a1.942 1.942 0 0 1-.55.88c-.34.306-.795.448-1.248.388A1.776 1.776 0 0 1 3 7.564c-.039.033-.022.074-.022.113v1.506c0 .329 0 .329-.334.329h-.572a.294.294 0 0 1-.294-.126Zm19.37 15.225a.587.587 0 0 1-.176.2 11.64 11.64 0 0 1-1.962 1.247 15.499 15.499 0 0 1-4.152 1.406 18.226 18.226 0 0 1-2.51.27v.022h-.649v-.018c-.293-.014-.578-.026-.868-.047a15.349 15.349 0 0 1-2.296-.352 15.558 15.558 0 0 1-6.885-3.59c-.185-.164-.36-.333-.54-.503a.405.405 0 0 1-.101-.146.195.195 0 0 1 .098-.256.2.2 0 0 1 .147 0 1.21 1.21 0 0 1 .138.069 20.566 20.566 0 0 0 6.164 2.546 22.087 22.087 0 0 0 2.212.398 20.441 20.441 0 0 0 3.213.146 16.97 16.97 0 0 0 1.724-.146 20.908 20.908 0 0 0 3.935-.896 18.627 18.627 0 0 0 1.973-.776.44.44 0 0 1 .318-.043.33.33 0 0 1 .24.398.578.578 0 0 1-.022.066zm1.028 1.488a3.547 3.547 0 0 1-.615.757.432.432 0 0 1-.17.107.123.123 0 0 1-.169-.124.608.608 0 0 1 .038-.162c.185-.496.366-.99.51-1.504a5.346 5.346 0 0 0 .18-.859 1.65 1.65 0 0 0 0-.318.412.412 0 0 0-.294-.388 2.068 2.068 0 0 0-.509-.095 8.356 8.356 0 0 0-1.459.064l-.641.08c-.07 0-.132 0-.17-.065a.18.18 0 0 1 .014-.19.546.546 0 0 1 .162-.148 3.67 3.67 0 0 1 1.299-.562 6.412 6.412 0 0 1 1.097-.121c.346.001.691.042 1.028.121a1.515 1.515 0 0 1 .276.102c.121.05.206.162.219.293a2.157 2.157 0 0 1 .014.455 5.856 5.856 0 0 1-.806 2.55zm-2.55-5.72a.995.995 0 0 0 .301.01.691.691 0 0 0 .505-.293 1.01 1.01 0 0 0 .147-.308l-.009.014a1.924 1.924 0 0 0 .074-.678 2.449 2.449 0 0 0 0-.293 1.64 1.64 0 0 0-.147-.6.685.685 0 0 0-.483-.376.908.908 0 0 0-.302-.01.694.694 0 0 0-.542.328 1.163 1.163 0 0 0-.147.35 2.89 2.89 0 0 0-.042.933 1.494 1.494 0 0 0 .147.525c.09.207.276.355.497.397zm-3.523-1.96a.473.473 0 0 0-.394-.64c-.026 0-.047-.01-.073-.01a.797.797 0 0 0-.775.302 1.321 1.321 0 0 0-.211.578c-.015.047.01.069.058.073a4.705 4.705 0 0 0 .642.053c.11.006.22-.003.328-.026a.465.465 0 0 0 .425-.33zm-5.981-.255a1.174 1.174 0 0 0-.106.26 2.683 2.683 0 0 0-.065.997 1.48 1.48 0 0 0 .147.536.734.734 0 0 0 .568.391 1.306 1.306 0 0 0 .832-.158.147.147 0 0 0 .086-.147v-.966h.007c0-.323-.01-.641 0-.968a.147.147 0 0 0-.096-.156 1.614 1.614 0 0 0-.817-.147.678.678 0 0 0-.556.358zM3.855 7.051a.747.747 0 0 0 .488-.188.807.807 0 0 0 .243-.425 2.654 2.654 0 0 0 .065-1.002 1.505 1.505 0 0 0-.135-.54.653.653 0 0 0-.505-.382 1.44 1.44 0 0 0-.912.137.16.16 0 0 0-.105.164v1.917a.147.147 0 0 0 .09.147 1.468 1.468 0 0 0 .771.17"
          />
        </svg>
      </div>
    `}_render_youtube(){return O`
      <div @click=${this._turn_on("https://www.youtube.com")} class="remote-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xml:space="preserve"
          width="48"
          height="48"
          version="1.0"
          viewBox="0 0 24 24"
        >
          <path
            d="M18.43 4.216H5.57A4.57 4.57 0 0 0 1 8.786v6.429a4.57 4.57 0 0 0 4.57 4.569h12.86a4.57 4.57 0 0 0 4.57-4.57V8.786a4.57 4.57 0 0 0-4.57-4.569zm-3.09 8.097-6.015 2.869a.241.241 0 0 1-.346-.218V9.046c0-.18.19-.297.351-.215l6.016 3.048a.242.242 0 0 1-.005.434z"
          />
        </svg>
      </div>
    `}_render_custom(t){return O`
      <div @click=${this._turn_on(t.url)} class="remote-button">
        <ha-icon icon="${t.icon}"></ha-icon>
      </div>
    `}_send_command(t){this._hass.callService("remote","send_command",{entity_id:this._config.entity_id,command:t}),console.log(`${t} was called`)}_turn_on(t){this._hass.callService("remote","turn_on",{entity_id:this._config.entity_id,activity:t}),console.log(`${t} was called`)}_press_power(){this._hass.callService("remote","toggle",{entity_id:this._config.entity_id})}_press_favorite_2(){}_dragStart(t){t.preventDefault(),"touchstart"===t.type?(this.initialX=t.touches[0].clientX,this.initialY=t.touches[0].clientY):(this.initialX=t.clientX,this.initialY=t.clientY),t.target===this._dragItem&&(this.active=!0)}_dragEnd(t){let e=this.currentX/this._touchpad.offsetWidth,i=this.currentY/this._touchpad.offsetHeight;Math.abs(e)<.01&&Math.abs(i)<.01?this._send_command("DPAD_CENTER"):Math.abs(e)>=Math.abs(i)?e<0?this._send_command("DPAD_LEFT"):this._send_command("DPAD_RIGHT"):i<0?this._send_command("DPAD_UP"):this._send_command("DPAD_DOWN"),this._setTranslate(0,0,this._dragItem,"0.5s"),this.active=!1,this.currentX=0,this.currentY=0}_drag(t){this.active&&(t.preventDefault(),"touchmove"===t.type?(this.currentX=t.touches[0].clientX-this.initialX,this.currentY=t.touches[0].clientY-this.initialY):(this.currentX=t.clientX-this.initialX,this.currentY=t.clientY-this.initialY),this._setTranslate(this.currentX,this.currentY,this._dragItem,"0s"))}_setTranslate(t,e,i,s){i.style.transform="translate3d("+t+"px, "+e+"px, 0)",i.style.transitionDuration=s}}wt.styles=((t,...e)=>{const i=1===t.length?t[0]:e.reduce(((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1]),t[0]);return new o(i,t,s)})`
    .card-content {
      margin: auto;
      background-color: var(
        --ha-card-background,
        var(--card-background-color, #fff)
      );
      border: 1px var(--ha-card-border-color, var(--divider-color, #e0e0e0))
        solid;
      padding: 15px;
      border-radius: 25px;
    }

    .grid {
      display: grid;
      align-items: center;
      justify-content: center;
      justify-items: center;
      width: 90%;
      gap: 10px;
      padding: 15px;
    }

    .card-grid {
      grid-template-columns: repeat(1, 1fr);
      border: none;
      background: none;
      width: 100%;
      padding: 0;
    }

    .remote-grid {
      grid-template-columns: repeat(3, 1fr);
    }

    .basic-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .basic-grid > .remote-button {
      padding: 20px;
    }

    .app-grid {
      grid-template-columns: repeat(4, 1fr);
    }

    .volume-grid {
      grid-template-columns: repeat(3, 1fr);
    }

    .remote-button {
      display: flex;
      align-items: center;
      justify-content: center;
      justify-items: center;
      fill: var(--primary-text-color);
      border-radius: 25%;
      background-color: var(
        --ha-card-border-color,
        var(--divider-color, #e0e0e0)
      );
      cursor: pointer;
      width: 30px;
      height: 30px;
    }

    .remote-grid > .remote-button {
      padding: 20px;
    }

    .center {
      border-radius: 50%;
      background-color: none;
      border: 1px var(--ha-card-border-color, var(--divider-color, #e0e0e0))
        solid;
    }

    .volume-grid > .remote-button {
      padding: 15px;
    }

    .app-grid > .remote-button {
      padding: 10px;
    }

    /** power **/
    .power-grid {
      display: flex;
      justify-content: start;
      padding: 10px 0 10px 0 ;
      margin: auto;
      width: 90%;
    }

    .power-grid > .remote-button {
      padding: 5px;
    }

    /** touchpad **/
    #touchpad {
      width: 80%;
      height: 300px;
      background-color: #333;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border-radius: 15px;
      touch-action: none;
    }

    #nub {
      width: 50px;
      height: 50px;
      background-color: rgb(255, 255, 255);
      border-radius: 50%;
      touch-action: none;
      user-select: none;
    }

    #nub:hover {
      cursor: pointer;
    }

    /** dpad **/

    .center {
      border-radius: 50%;
      background-color: none;
      border: 1px var(--ha-card-border-color, var(--divider-color, #e0e0e0))
        solid;
    }

    .pie {
      position: relative;
      margin: 1em auto;
      border: 4px var(--ha-card-border-color, var(--divider-color, #e0e0e0)) solid;
      padding: 0;
      width: 15em;
      height: 15em;
      border-radius: 50%;
      overflow: hidden;
    }

    .slice {
      overflow: hidden;
      position: absolute;
      top: 0;
      right: 0;
      width: 50%;
      height: 50%;
      transform-origin: 0% 100%;
      border: 2px var(--ha-card-border-color, var(--divider-color, #e0e0e0)) solid;
      box-sizing: border-box;
    }

    .slice-contents {
      position: absolute;
      left: -100%;
      width: 200%;
      height: 200%;
      border-radius: 50%;
    }

    .slice:nth-child(1) {
      transform: rotate(-45deg) scale(1.2);
    }
    .slice:nth-child(2) {
      transform: rotate(45deg) scale(1.2);
    }
    .slice:nth-child(3) {
      transform: rotate(135deg) scale(1.2);
    }
    .slice:nth-child(4) {
      transform: rotate(225deg) scale(1.2);
    }

    .slice:nth-child(1) .slice-contents,
    .slice:nth-child(2) .slice-contents,
    .slice:nth-child(3) .slice-contents,
      transform: skewY(-30deg);
      // background-color: #222222;
    }

    .slice:nth-child(4) .slice-contents {
      transform: skewY(-30deg);
      // background-color: #222222;
    }

    .inner-pie {
      position: absolute;
      width: 6em;
      height: 6em;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      border: 4px var(--ha-card-border-color, var(--divider-color, #e0e0e0)) solid;
      background-color: #222222;
    }
  `,t([at()],wt.prototype,"_config",void 0),t([at()],wt.prototype,"_hass",void 0),t([at()],wt.prototype,"active",void 0),t([at()],wt.prototype,"currentX",void 0),t([at()],wt.prototype,"currentY",void 0),t([at()],wt.prototype,"initialX",void 0),t([at()],wt.prototype,"initialY",void 0),t([at()],wt.prototype,"_touchpad",void 0),t([at()],wt.prototype,"_dragItem",void 0),customElements.define("polr-atv-remote-card",wt),window.customCards=window.customCards||[],window.customCards.push({type:"polr-atv-remote-card",name:"PoLR Android TV Remote Card",description:"Control your Android TV"});
