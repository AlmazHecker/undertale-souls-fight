import{P as m,r as J,E as w,T as L,U as Q,a as ee,w as y,e as z,C as Z}from"./index-CeTt1p1Q.js";import"./webworkerAll-WCeBBAKY.js";import"./colorToUniform-BA55LrOn.js";import"./getBatchSamplersUniformGroup-B1sAQZLT.js";class M{constructor(e){this.bubbles=!0,this.cancelBubble=!0,this.cancelable=!1,this.composed=!1,this.defaultPrevented=!1,this.eventPhase=M.prototype.NONE,this.propagationStopped=!1,this.propagationImmediatelyStopped=!1,this.layer=new m,this.page=new m,this.NONE=0,this.CAPTURING_PHASE=1,this.AT_TARGET=2,this.BUBBLING_PHASE=3,this.manager=e}get layerX(){return this.layer.x}get layerY(){return this.layer.y}get pageX(){return this.page.x}get pageY(){return this.page.y}get data(){return this}composedPath(){return this.manager&&(!this.path||this.path[this.path.length-1]!==this.target)&&(this.path=this.target?this.manager.propagationPath(this.target):[]),this.path}initEvent(e,t,i){throw new Error("initEvent() is a legacy DOM API. It is not implemented in the Federated Events API.")}initUIEvent(e,t,i,n,s){throw new Error("initUIEvent() is a legacy DOM API. It is not implemented in the Federated Events API.")}preventDefault(){this.nativeEvent instanceof Event&&this.nativeEvent.cancelable&&this.nativeEvent.preventDefault(),this.defaultPrevented=!0}stopImmediatePropagation(){this.propagationImmediatelyStopped=!0}stopPropagation(){this.propagationStopped=!0}}var O=/iPhone/i,C=/iPod/i,S=/iPad/i,U=/\biOS-universal(?:.+)Mac\b/i,k=/\bAndroid(?:.+)Mobile\b/i,H=/Android/i,b=/(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i,A=/Silk/i,g=/Windows Phone/i,X=/\bWindows(?:.+)ARM\b/i,R=/BlackBerry/i,F=/BB10/i,Y=/Opera Mini/i,K=/\b(CriOS|Chrome)(?:.+)Mobile/i,$=/Mobile(?:.+)Firefox\b/i,G=function(r){return typeof r<"u"&&r.platform==="MacIntel"&&typeof r.maxTouchPoints=="number"&&r.maxTouchPoints>1&&typeof MSStream>"u"};function te(r){return function(e){return e.test(r)}}function W(r){var e={userAgent:"",platform:"",maxTouchPoints:0};!r&&typeof navigator<"u"?e={userAgent:navigator.userAgent,platform:navigator.platform,maxTouchPoints:navigator.maxTouchPoints||0}:typeof r=="string"?e.userAgent=r:r&&r.userAgent&&(e={userAgent:r.userAgent,platform:r.platform,maxTouchPoints:r.maxTouchPoints||0});var t=e.userAgent,i=t.split("[FBAN");typeof i[1]<"u"&&(t=i[0]),i=t.split("Twitter"),typeof i[1]<"u"&&(t=i[0]);var n=te(t),s={apple:{phone:n(O)&&!n(g),ipod:n(C),tablet:!n(O)&&(n(S)||G(e))&&!n(g),universal:n(U),device:(n(O)||n(C)||n(S)||n(U)||G(e))&&!n(g)},amazon:{phone:n(b),tablet:!n(b)&&n(A),device:n(b)||n(A)},android:{phone:!n(g)&&n(b)||!n(g)&&n(k),tablet:!n(g)&&!n(b)&&!n(k)&&(n(A)||n(H)),device:!n(g)&&(n(b)||n(A)||n(k)||n(H))||n(/\bokhttp\b/i)},windows:{phone:n(g),tablet:n(X),device:n(g)||n(X)},other:{blackberry:n(R),blackberry10:n(F),opera:n(Y),firefox:n($),chrome:n(K),device:n(R)||n(F)||n(Y)||n($)||n(K)},any:!1,phone:!1,tablet:!1};return s.any=s.apple.device||s.android.device||s.windows.device||s.other.device,s.phone=s.apple.phone||s.android.phone||s.windows.phone,s.tablet=s.apple.tablet||s.android.tablet||s.windows.tablet,s}const ie=W.default??W,ne=ie(globalThis.navigator),se=9,I=100,oe=0,re=0,j=2,N=1,ae=-1e3,he=-1e3,le=2;class V{constructor(e,t=ne){this._mobileInfo=t,this.debug=!1,this._isActive=!1,this._isMobileAccessibility=!1,this._pool=[],this._renderId=0,this._children=[],this._androidUpdateCount=0,this._androidUpdateFrequency=500,this._hookDiv=null,(t.tablet||t.phone)&&this._createTouchHook();const i=document.createElement("div");i.style.width=`${I}px`,i.style.height=`${I}px`,i.style.position="absolute",i.style.top=`${oe}px`,i.style.left=`${re}px`,i.style.zIndex=j.toString(),this._div=i,this._renderer=e,this._onKeyDown=this._onKeyDown.bind(this),this._onMouseMove=this._onMouseMove.bind(this),globalThis.addEventListener("keydown",this._onKeyDown,!1)}get isActive(){return this._isActive}get isMobileAccessibility(){return this._isMobileAccessibility}get hookDiv(){return this._hookDiv}_createTouchHook(){const e=document.createElement("button");e.style.width=`${N}px`,e.style.height=`${N}px`,e.style.position="absolute",e.style.top=`${ae}px`,e.style.left=`${he}px`,e.style.zIndex=le.toString(),e.style.backgroundColor="#FF0000",e.title="select to enable accessibility for this content",e.addEventListener("focus",()=>{this._isMobileAccessibility=!0,this._activate(),this._destroyTouchHook()}),document.body.appendChild(e),this._hookDiv=e}_destroyTouchHook(){this._hookDiv&&(document.body.removeChild(this._hookDiv),this._hookDiv=null)}_activate(){var e;this._isActive||(this._isActive=!0,globalThis.document.addEventListener("mousemove",this._onMouseMove,!0),globalThis.removeEventListener("keydown",this._onKeyDown,!1),this._renderer.runners.postrender.add(this),(e=this._renderer.view.canvas.parentNode)==null||e.appendChild(this._div))}_deactivate(){var e;!this._isActive||this._isMobileAccessibility||(this._isActive=!1,globalThis.document.removeEventListener("mousemove",this._onMouseMove,!0),globalThis.addEventListener("keydown",this._onKeyDown,!1),this._renderer.runners.postrender.remove(this),(e=this._div.parentNode)==null||e.removeChild(this._div))}_updateAccessibleObjects(e){if(!e.visible||!e.accessibleChildren)return;e.accessible&&e.isInteractive()&&(e._accessibleActive||this._addChild(e),e._renderId=this._renderId);const t=e.children;if(t)for(let i=0;i<t.length;i++)this._updateAccessibleObjects(t[i])}init(e){this.debug=(e==null?void 0:e.debug)??this.debug,this._renderer.runners.postrender.remove(this)}postrender(){const e=performance.now();if(this._mobileInfo.android.device&&e<this._androidUpdateCount||(this._androidUpdateCount=e+this._androidUpdateFrequency,!this._renderer.renderingToScreen||!this._renderer.view.canvas))return;this._renderer.lastObjectRendered&&this._updateAccessibleObjects(this._renderer.lastObjectRendered);const{x:t,y:i,width:n,height:s}=this._renderer.view.canvas.getBoundingClientRect(),{width:o,height:a,resolution:c}=this._renderer,p=n/o*c,v=s/a*c;let h=this._div;h.style.left=`${t}px`,h.style.top=`${i}px`,h.style.width=`${o}px`,h.style.height=`${a}px`;for(let l=0;l<this._children.length;l++){const u=this._children[l];if(u._renderId!==this._renderId)u._accessibleActive=!1,J(this._children,l,1),this._div.removeChild(u._accessibleDiv),this._pool.push(u._accessibleDiv),u._accessibleDiv=null,l--;else{h=u._accessibleDiv;let d=u.hitArea;const _=u.worldTransform;u.hitArea?(h.style.left=`${(_.tx+d.x*_.a)*p}px`,h.style.top=`${(_.ty+d.y*_.d)*v}px`,h.style.width=`${d.width*_.a*p}px`,h.style.height=`${d.height*_.d*v}px`):(d=u.getBounds().rectangle,this._capHitArea(d),h.style.left=`${d.x*p}px`,h.style.top=`${d.y*v}px`,h.style.width=`${d.width*p}px`,h.style.height=`${d.height*v}px`,h.title!==u.accessibleTitle&&u.accessibleTitle!==null&&(h.title=u.accessibleTitle||""),h.getAttribute("aria-label")!==u.accessibleHint&&u.accessibleHint!==null&&h.setAttribute("aria-label",u.accessibleHint||"")),(u.accessibleTitle!==h.title||u.tabIndex!==h.tabIndex)&&(h.title=u.accessibleTitle||"",h.tabIndex=u.tabIndex,this.debug&&this._updateDebugHTML(h))}}this._renderId++}_updateDebugHTML(e){e.innerHTML=`type: ${e.type}</br> title : ${e.title}</br> tabIndex: ${e.tabIndex}`}_capHitArea(e){e.x<0&&(e.width+=e.x,e.x=0),e.y<0&&(e.height+=e.y,e.y=0);const{width:t,height:i}=this._renderer;e.x+e.width>t&&(e.width=t-e.x),e.y+e.height>i&&(e.height=i-e.y)}_addChild(e){let t=this._pool.pop();t||(t=document.createElement("button"),t.style.width=`${I}px`,t.style.height=`${I}px`,t.style.backgroundColor=this.debug?"rgba(255,255,255,0.5)":"transparent",t.style.position="absolute",t.style.zIndex=j.toString(),t.style.borderStyle="none",navigator.userAgent.toLowerCase().includes("chrome")?t.setAttribute("aria-live","off"):t.setAttribute("aria-live","polite"),navigator.userAgent.match(/rv:.*Gecko\//)?t.setAttribute("aria-relevant","additions"):t.setAttribute("aria-relevant","text"),t.addEventListener("click",this._onClick.bind(this)),t.addEventListener("focus",this._onFocus.bind(this)),t.addEventListener("focusout",this._onFocusOut.bind(this))),t.style.pointerEvents=e.accessiblePointerEvents,t.type=e.accessibleType,e.accessibleTitle&&e.accessibleTitle!==null?t.title=e.accessibleTitle:(!e.accessibleHint||e.accessibleHint===null)&&(t.title=`container ${e.tabIndex}`),e.accessibleHint&&e.accessibleHint!==null&&t.setAttribute("aria-label",e.accessibleHint),this.debug&&this._updateDebugHTML(t),e._accessibleActive=!0,e._accessibleDiv=t,t.container=e,this._children.push(e),this._div.appendChild(e._accessibleDiv),e._accessibleDiv.tabIndex=e.tabIndex}_dispatchEvent(e,t){const{container:i}=e.target,n=this._renderer.events.rootBoundary,s=Object.assign(new M(n),{target:i});n.rootTarget=this._renderer.lastObjectRendered,t.forEach(o=>n.dispatchEvent(s,o))}_onClick(e){this._dispatchEvent(e,["click","pointertap","tap"])}_onFocus(e){e.target.getAttribute("aria-live")||e.target.setAttribute("aria-live","assertive"),this._dispatchEvent(e,["mouseover"])}_onFocusOut(e){e.target.getAttribute("aria-live")||e.target.setAttribute("aria-live","polite"),this._dispatchEvent(e,["mouseout"])}_onKeyDown(e){e.keyCode===se&&this._activate()}_onMouseMove(e){e.movementX===0&&e.movementY===0||this._deactivate()}destroy(){this._destroyTouchHook(),this._div=null,globalThis.document.removeEventListener("mousemove",this._onMouseMove,!0),globalThis.removeEventListener("keydown",this._onKeyDown),this._pool=null,this._children=null,this._renderer=null}}V.extension={type:[w.WebGLSystem,w.WebGPUSystem],name:"accessibility"};const ue={accessible:!1,accessibleTitle:null,accessibleHint:null,tabIndex:0,_accessibleActive:!1,_accessibleDiv:null,accessibleType:"button",accessiblePointerEvents:"auto",accessibleChildren:!0,_renderId:-1};class de{constructor(){this.interactionFrequency=10,this._deltaTime=0,this._didMove=!1,this._tickerAdded=!1,this._pauseUpdate=!0}init(e){this.removeTickerListener(),this.events=e,this.interactionFrequency=10,this._deltaTime=0,this._didMove=!1,this._tickerAdded=!1,this._pauseUpdate=!0}get pauseUpdate(){return this._pauseUpdate}set pauseUpdate(e){this._pauseUpdate=e}addTickerListener(){this._tickerAdded||!this.domElement||(L.system.add(this._tickerUpdate,this,Q.INTERACTION),this._tickerAdded=!0)}removeTickerListener(){this._tickerAdded&&(L.system.remove(this._tickerUpdate,this),this._tickerAdded=!1)}pointerMoved(){this._didMove=!0}_update(){if(!this.domElement||this._pauseUpdate)return;if(this._didMove){this._didMove=!1;return}const e=this.events._rootPointerEvent;this.events.supportsTouchEvents&&e.pointerType==="touch"||globalThis.document.dispatchEvent(new PointerEvent("pointermove",{clientX:e.clientX,clientY:e.clientY,pointerType:e.pointerType,pointerId:e.pointerId}))}_tickerUpdate(e){this._deltaTime+=e.deltaTime,!(this._deltaTime<this.interactionFrequency)&&(this._deltaTime=0,this._update())}}const E=new de;class D extends M{constructor(){super(...arguments),this.client=new m,this.movement=new m,this.offset=new m,this.global=new m,this.screen=new m}get clientX(){return this.client.x}get clientY(){return this.client.y}get x(){return this.clientX}get y(){return this.clientY}get movementX(){return this.movement.x}get movementY(){return this.movement.y}get offsetX(){return this.offset.x}get offsetY(){return this.offset.y}get globalX(){return this.global.x}get globalY(){return this.global.y}get screenX(){return this.screen.x}get screenY(){return this.screen.y}getLocalPosition(e,t,i){return e.worldTransform.applyInverse(i||this.global,t)}getModifierState(e){return"getModifierState"in this.nativeEvent&&this.nativeEvent.getModifierState(e)}initMouseEvent(e,t,i,n,s,o,a,c,p,v,h,l,u,d,_){throw new Error("Method not implemented.")}}class f extends D{constructor(){super(...arguments),this.width=0,this.height=0,this.isPrimary=!1}getCoalescedEvents(){return this.type==="pointermove"||this.type==="mousemove"||this.type==="touchmove"?[this]:[]}getPredictedEvents(){throw new Error("getPredictedEvents is not supported!")}}class T extends D{constructor(){super(...arguments),this.DOM_DELTA_PIXEL=0,this.DOM_DELTA_LINE=1,this.DOM_DELTA_PAGE=2}}T.DOM_DELTA_PIXEL=0;T.DOM_DELTA_LINE=1;T.DOM_DELTA_PAGE=2;const ce=2048,pe=new m,P=new m;class ve{constructor(e){this.dispatch=new ee,this.moveOnAll=!1,this.enableGlobalMoveEvents=!0,this.mappingState={trackingData:{}},this.eventPool=new Map,this._allInteractiveElements=[],this._hitElements=[],this._isPointerMoveEvent=!1,this.rootTarget=e,this.hitPruneFn=this.hitPruneFn.bind(this),this.hitTestFn=this.hitTestFn.bind(this),this.mapPointerDown=this.mapPointerDown.bind(this),this.mapPointerMove=this.mapPointerMove.bind(this),this.mapPointerOut=this.mapPointerOut.bind(this),this.mapPointerOver=this.mapPointerOver.bind(this),this.mapPointerUp=this.mapPointerUp.bind(this),this.mapPointerUpOutside=this.mapPointerUpOutside.bind(this),this.mapWheel=this.mapWheel.bind(this),this.mappingTable={},this.addEventMapping("pointerdown",this.mapPointerDown),this.addEventMapping("pointermove",this.mapPointerMove),this.addEventMapping("pointerout",this.mapPointerOut),this.addEventMapping("pointerleave",this.mapPointerOut),this.addEventMapping("pointerover",this.mapPointerOver),this.addEventMapping("pointerup",this.mapPointerUp),this.addEventMapping("pointerupoutside",this.mapPointerUpOutside),this.addEventMapping("wheel",this.mapWheel)}addEventMapping(e,t){this.mappingTable[e]||(this.mappingTable[e]=[]),this.mappingTable[e].push({fn:t,priority:0}),this.mappingTable[e].sort((i,n)=>i.priority-n.priority)}dispatchEvent(e,t){e.propagationStopped=!1,e.propagationImmediatelyStopped=!1,this.propagate(e,t),this.dispatch.emit(t||e.type,e)}mapEvent(e){if(!this.rootTarget)return;const t=this.mappingTable[e.type];if(t)for(let i=0,n=t.length;i<n;i++)t[i].fn(e);else y(`[EventBoundary]: Event mapping not defined for ${e.type}`)}hitTest(e,t){E.pauseUpdate=!0;const n=this._isPointerMoveEvent&&this.enableGlobalMoveEvents?"hitTestMoveRecursive":"hitTestRecursive",s=this[n](this.rootTarget,this.rootTarget.eventMode,pe.set(e,t),this.hitTestFn,this.hitPruneFn);return s&&s[0]}propagate(e,t){if(!e.target)return;const i=e.composedPath();e.eventPhase=e.CAPTURING_PHASE;for(let n=0,s=i.length-1;n<s;n++)if(e.currentTarget=i[n],this.notifyTarget(e,t),e.propagationStopped||e.propagationImmediatelyStopped)return;if(e.eventPhase=e.AT_TARGET,e.currentTarget=e.target,this.notifyTarget(e,t),!(e.propagationStopped||e.propagationImmediatelyStopped)){e.eventPhase=e.BUBBLING_PHASE;for(let n=i.length-2;n>=0;n--)if(e.currentTarget=i[n],this.notifyTarget(e,t),e.propagationStopped||e.propagationImmediatelyStopped)return}}all(e,t,i=this._allInteractiveElements){if(i.length===0)return;e.eventPhase=e.BUBBLING_PHASE;const n=Array.isArray(t)?t:[t];for(let s=i.length-1;s>=0;s--)n.forEach(o=>{e.currentTarget=i[s],this.notifyTarget(e,o)})}propagationPath(e){const t=[e];for(let i=0;i<ce&&e!==this.rootTarget&&e.parent;i++){if(!e.parent)throw new Error("Cannot find propagation path to disconnected target");t.push(e.parent),e=e.parent}return t.reverse(),t}hitTestMoveRecursive(e,t,i,n,s,o=!1){let a=!1;if(this._interactivePrune(e))return null;if((e.eventMode==="dynamic"||t==="dynamic")&&(E.pauseUpdate=!1),e.interactiveChildren&&e.children){const v=e.children;for(let h=v.length-1;h>=0;h--){const l=v[h],u=this.hitTestMoveRecursive(l,this._isInteractive(t)?t:l.eventMode,i,n,s,o||s(e,i));if(u){if(u.length>0&&!u[u.length-1].parent)continue;const d=e.isInteractive();(u.length>0||d)&&(d&&this._allInteractiveElements.push(e),u.push(e)),this._hitElements.length===0&&(this._hitElements=u),a=!0}}}const c=this._isInteractive(t),p=e.isInteractive();return p&&p&&this._allInteractiveElements.push(e),o||this._hitElements.length>0?null:a?this._hitElements:c&&!s(e,i)&&n(e,i)?p?[e]:[]:null}hitTestRecursive(e,t,i,n,s){if(this._interactivePrune(e)||s(e,i))return null;if((e.eventMode==="dynamic"||t==="dynamic")&&(E.pauseUpdate=!1),e.interactiveChildren&&e.children){const c=e.children,p=i;for(let v=c.length-1;v>=0;v--){const h=c[v],l=this.hitTestRecursive(h,this._isInteractive(t)?t:h.eventMode,p,n,s);if(l){if(l.length>0&&!l[l.length-1].parent)continue;const u=e.isInteractive();return(l.length>0||u)&&l.push(e),l}}}const o=this._isInteractive(t),a=e.isInteractive();return o&&n(e,i)?a?[e]:[]:null}_isInteractive(e){return e==="static"||e==="dynamic"}_interactivePrune(e){return!e||!e.visible||!e.renderable||!e.includeInBuild||!e.measurable||e.eventMode==="none"||e.eventMode==="passive"&&!e.interactiveChildren}hitPruneFn(e,t){if(e.hitArea&&(e.worldTransform.applyInverse(t,P),!e.hitArea.contains(P.x,P.y)))return!0;if(e.effects&&e.effects.length)for(let i=0;i<e.effects.length;i++){const n=e.effects[i];if(n.containsPoint&&!n.containsPoint(t,this.hitTestFn))return!0}return!1}hitTestFn(e,t){return e.hitArea?!0:e!=null&&e.containsPoint?(e.worldTransform.applyInverse(t,P),e.containsPoint(P)):!1}notifyTarget(e,t){var s,o;if(!e.currentTarget.isInteractive())return;t=t??e.type;const i=`on${t}`;(o=(s=e.currentTarget)[i])==null||o.call(s,e);const n=e.eventPhase===e.CAPTURING_PHASE||e.eventPhase===e.AT_TARGET?`${t}capture`:t;this._notifyListeners(e,n),e.eventPhase===e.AT_TARGET&&this._notifyListeners(e,t)}mapPointerDown(e){if(!(e instanceof f)){y("EventBoundary cannot map a non-pointer event as a pointer event");return}const t=this.createPointerEvent(e);if(this.dispatchEvent(t,"pointerdown"),t.pointerType==="touch")this.dispatchEvent(t,"touchstart");else if(t.pointerType==="mouse"||t.pointerType==="pen"){const n=t.button===2;this.dispatchEvent(t,n?"rightdown":"mousedown")}const i=this.trackingData(e.pointerId);i.pressTargetsByButton[e.button]=t.composedPath(),this.freeEvent(t)}mapPointerMove(e){var c,p;if(!(e instanceof f)){y("EventBoundary cannot map a non-pointer event as a pointer event");return}this._allInteractiveElements.length=0,this._hitElements.length=0,this._isPointerMoveEvent=!0;const t=this.createPointerEvent(e);this._isPointerMoveEvent=!1;const i=t.pointerType==="mouse"||t.pointerType==="pen",n=this.trackingData(e.pointerId),s=this.findMountedTarget(n.overTargets);if(((c=n.overTargets)==null?void 0:c.length)>0&&s!==t.target){const v=e.type==="mousemove"?"mouseout":"pointerout",h=this.createPointerEvent(e,v,s);if(this.dispatchEvent(h,"pointerout"),i&&this.dispatchEvent(h,"mouseout"),!t.composedPath().includes(s)){const l=this.createPointerEvent(e,"pointerleave",s);for(l.eventPhase=l.AT_TARGET;l.target&&!t.composedPath().includes(l.target);)l.currentTarget=l.target,this.notifyTarget(l),i&&this.notifyTarget(l,"mouseleave"),l.target=l.target.parent;this.freeEvent(l)}this.freeEvent(h)}if(s!==t.target){const v=e.type==="mousemove"?"mouseover":"pointerover",h=this.clonePointerEvent(t,v);this.dispatchEvent(h,"pointerover"),i&&this.dispatchEvent(h,"mouseover");let l=s==null?void 0:s.parent;for(;l&&l!==this.rootTarget.parent&&l!==t.target;)l=l.parent;if(!l||l===this.rootTarget.parent){const d=this.clonePointerEvent(t,"pointerenter");for(d.eventPhase=d.AT_TARGET;d.target&&d.target!==s&&d.target!==this.rootTarget.parent;)d.currentTarget=d.target,this.notifyTarget(d),i&&this.notifyTarget(d,"mouseenter"),d.target=d.target.parent;this.freeEvent(d)}this.freeEvent(h)}const o=[],a=this.enableGlobalMoveEvents??!0;this.moveOnAll?o.push("pointermove"):this.dispatchEvent(t,"pointermove"),a&&o.push("globalpointermove"),t.pointerType==="touch"&&(this.moveOnAll?o.splice(1,0,"touchmove"):this.dispatchEvent(t,"touchmove"),a&&o.push("globaltouchmove")),i&&(this.moveOnAll?o.splice(1,0,"mousemove"):this.dispatchEvent(t,"mousemove"),a&&o.push("globalmousemove"),this.cursor=(p=t.target)==null?void 0:p.cursor),o.length>0&&this.all(t,o),this._allInteractiveElements.length=0,this._hitElements.length=0,n.overTargets=t.composedPath(),this.freeEvent(t)}mapPointerOver(e){var o;if(!(e instanceof f)){y("EventBoundary cannot map a non-pointer event as a pointer event");return}const t=this.trackingData(e.pointerId),i=this.createPointerEvent(e),n=i.pointerType==="mouse"||i.pointerType==="pen";this.dispatchEvent(i,"pointerover"),n&&this.dispatchEvent(i,"mouseover"),i.pointerType==="mouse"&&(this.cursor=(o=i.target)==null?void 0:o.cursor);const s=this.clonePointerEvent(i,"pointerenter");for(s.eventPhase=s.AT_TARGET;s.target&&s.target!==this.rootTarget.parent;)s.currentTarget=s.target,this.notifyTarget(s),n&&this.notifyTarget(s,"mouseenter"),s.target=s.target.parent;t.overTargets=i.composedPath(),this.freeEvent(i),this.freeEvent(s)}mapPointerOut(e){if(!(e instanceof f)){y("EventBoundary cannot map a non-pointer event as a pointer event");return}const t=this.trackingData(e.pointerId);if(t.overTargets){const i=e.pointerType==="mouse"||e.pointerType==="pen",n=this.findMountedTarget(t.overTargets),s=this.createPointerEvent(e,"pointerout",n);this.dispatchEvent(s),i&&this.dispatchEvent(s,"mouseout");const o=this.createPointerEvent(e,"pointerleave",n);for(o.eventPhase=o.AT_TARGET;o.target&&o.target!==this.rootTarget.parent;)o.currentTarget=o.target,this.notifyTarget(o),i&&this.notifyTarget(o,"mouseleave"),o.target=o.target.parent;t.overTargets=null,this.freeEvent(s),this.freeEvent(o)}this.cursor=null}mapPointerUp(e){if(!(e instanceof f)){y("EventBoundary cannot map a non-pointer event as a pointer event");return}const t=performance.now(),i=this.createPointerEvent(e);if(this.dispatchEvent(i,"pointerup"),i.pointerType==="touch")this.dispatchEvent(i,"touchend");else if(i.pointerType==="mouse"||i.pointerType==="pen"){const a=i.button===2;this.dispatchEvent(i,a?"rightup":"mouseup")}const n=this.trackingData(e.pointerId),s=this.findMountedTarget(n.pressTargetsByButton[e.button]);let o=s;if(s&&!i.composedPath().includes(s)){let a=s;for(;a&&!i.composedPath().includes(a);){if(i.currentTarget=a,this.notifyTarget(i,"pointerupoutside"),i.pointerType==="touch")this.notifyTarget(i,"touchendoutside");else if(i.pointerType==="mouse"||i.pointerType==="pen"){const c=i.button===2;this.notifyTarget(i,c?"rightupoutside":"mouseupoutside")}a=a.parent}delete n.pressTargetsByButton[e.button],o=a}if(o){const a=this.clonePointerEvent(i,"click");a.target=o,a.path=null,n.clicksByButton[e.button]||(n.clicksByButton[e.button]={clickCount:0,target:a.target,timeStamp:t});const c=n.clicksByButton[e.button];if(c.target===a.target&&t-c.timeStamp<200?++c.clickCount:c.clickCount=1,c.target=a.target,c.timeStamp=t,a.detail=c.clickCount,a.pointerType==="mouse"){const p=a.button===2;this.dispatchEvent(a,p?"rightclick":"click")}else a.pointerType==="touch"&&this.dispatchEvent(a,"tap");this.dispatchEvent(a,"pointertap"),this.freeEvent(a)}this.freeEvent(i)}mapPointerUpOutside(e){if(!(e instanceof f)){y("EventBoundary cannot map a non-pointer event as a pointer event");return}const t=this.trackingData(e.pointerId),i=this.findMountedTarget(t.pressTargetsByButton[e.button]),n=this.createPointerEvent(e);if(i){let s=i;for(;s;)n.currentTarget=s,this.notifyTarget(n,"pointerupoutside"),n.pointerType==="touch"?this.notifyTarget(n,"touchendoutside"):(n.pointerType==="mouse"||n.pointerType==="pen")&&this.notifyTarget(n,n.button===2?"rightupoutside":"mouseupoutside"),s=s.parent;delete t.pressTargetsByButton[e.button]}this.freeEvent(n)}mapWheel(e){if(!(e instanceof T)){y("EventBoundary cannot map a non-wheel event as a wheel event");return}const t=this.createWheelEvent(e);this.dispatchEvent(t),this.freeEvent(t)}findMountedTarget(e){if(!e)return null;let t=e[0];for(let i=1;i<e.length&&e[i].parent===t;i++)t=e[i];return t}createPointerEvent(e,t,i){const n=this.allocateEvent(f);return this.copyPointerData(e,n),this.copyMouseData(e,n),this.copyData(e,n),n.nativeEvent=e.nativeEvent,n.originalEvent=e,n.target=i??this.hitTest(n.global.x,n.global.y)??this._hitElements[0],typeof t=="string"&&(n.type=t),n}createWheelEvent(e){const t=this.allocateEvent(T);return this.copyWheelData(e,t),this.copyMouseData(e,t),this.copyData(e,t),t.nativeEvent=e.nativeEvent,t.originalEvent=e,t.target=this.hitTest(t.global.x,t.global.y),t}clonePointerEvent(e,t){const i=this.allocateEvent(f);return i.nativeEvent=e.nativeEvent,i.originalEvent=e.originalEvent,this.copyPointerData(e,i),this.copyMouseData(e,i),this.copyData(e,i),i.target=e.target,i.path=e.composedPath().slice(),i.type=t??i.type,i}copyWheelData(e,t){t.deltaMode=e.deltaMode,t.deltaX=e.deltaX,t.deltaY=e.deltaY,t.deltaZ=e.deltaZ}copyPointerData(e,t){e instanceof f&&t instanceof f&&(t.pointerId=e.pointerId,t.width=e.width,t.height=e.height,t.isPrimary=e.isPrimary,t.pointerType=e.pointerType,t.pressure=e.pressure,t.tangentialPressure=e.tangentialPressure,t.tiltX=e.tiltX,t.tiltY=e.tiltY,t.twist=e.twist)}copyMouseData(e,t){e instanceof D&&t instanceof D&&(t.altKey=e.altKey,t.button=e.button,t.buttons=e.buttons,t.client.copyFrom(e.client),t.ctrlKey=e.ctrlKey,t.metaKey=e.metaKey,t.movement.copyFrom(e.movement),t.screen.copyFrom(e.screen),t.shiftKey=e.shiftKey,t.global.copyFrom(e.global))}copyData(e,t){t.isTrusted=e.isTrusted,t.srcElement=e.srcElement,t.timeStamp=performance.now(),t.type=e.type,t.detail=e.detail,t.view=e.view,t.which=e.which,t.layer.copyFrom(e.layer),t.page.copyFrom(e.page)}trackingData(e){return this.mappingState.trackingData[e]||(this.mappingState.trackingData[e]={pressTargetsByButton:{},clicksByButton:{},overTarget:null}),this.mappingState.trackingData[e]}allocateEvent(e){this.eventPool.has(e)||this.eventPool.set(e,[]);const t=this.eventPool.get(e).pop()||new e(this);return t.eventPhase=t.NONE,t.currentTarget=null,t.path=null,t.target=null,t}freeEvent(e){if(e.manager!==this)throw new Error("It is illegal to free an event not managed by this EventBoundary!");const t=e.constructor;this.eventPool.has(t)||this.eventPool.set(t,[]),this.eventPool.get(t).push(e)}_notifyListeners(e,t){const i=e.currentTarget._events[t];if(i)if("fn"in i)i.once&&e.currentTarget.removeListener(t,i.fn,void 0,!0),i.fn.call(i.context,e);else for(let n=0,s=i.length;n<s&&!e.propagationImmediatelyStopped;n++)i[n].once&&e.currentTarget.removeListener(t,i[n].fn,void 0,!0),i[n].fn.call(i[n].context,e)}}const fe=1,ge={touchstart:"pointerdown",touchend:"pointerup",touchendoutside:"pointerupoutside",touchmove:"pointermove",touchcancel:"pointercancel"},B=class x{constructor(e){this.supportsTouchEvents="ontouchstart"in globalThis,this.supportsPointerEvents=!!globalThis.PointerEvent,this.domElement=null,this.resolution=1,this.renderer=e,this.rootBoundary=new ve(null),E.init(this),this.autoPreventDefault=!0,this._eventsAdded=!1,this._rootPointerEvent=new f(null),this._rootWheelEvent=new T(null),this.cursorStyles={default:"inherit",pointer:"pointer"},this.features=new Proxy({...x.defaultEventFeatures},{set:(t,i,n)=>(i==="globalMove"&&(this.rootBoundary.enableGlobalMoveEvents=n),t[i]=n,!0)}),this._onPointerDown=this._onPointerDown.bind(this),this._onPointerMove=this._onPointerMove.bind(this),this._onPointerUp=this._onPointerUp.bind(this),this._onPointerOverOut=this._onPointerOverOut.bind(this),this.onWheel=this.onWheel.bind(this)}static get defaultEventMode(){return this._defaultEventMode}init(e){const{canvas:t,resolution:i}=this.renderer;this.setTargetElement(t),this.resolution=i,x._defaultEventMode=e.eventMode??"passive",Object.assign(this.features,e.eventFeatures??{}),this.rootBoundary.enableGlobalMoveEvents=this.features.globalMove}resolutionChange(e){this.resolution=e}destroy(){this.setTargetElement(null),this.renderer=null,this._currentCursor=null}setCursor(e){e=e||"default";let t=!0;if(globalThis.OffscreenCanvas&&this.domElement instanceof OffscreenCanvas&&(t=!1),this._currentCursor===e)return;this._currentCursor=e;const i=this.cursorStyles[e];if(i)switch(typeof i){case"string":t&&(this.domElement.style.cursor=i);break;case"function":i(e);break;case"object":t&&Object.assign(this.domElement.style,i);break}else t&&typeof e=="string"&&!Object.prototype.hasOwnProperty.call(this.cursorStyles,e)&&(this.domElement.style.cursor=e)}get pointer(){return this._rootPointerEvent}_onPointerDown(e){if(!this.features.click)return;this.rootBoundary.rootTarget=this.renderer.lastObjectRendered;const t=this._normalizeToPointerData(e);this.autoPreventDefault&&t[0].isNormalized&&(e.cancelable||!("cancelable"in e))&&e.preventDefault();for(let i=0,n=t.length;i<n;i++){const s=t[i],o=this._bootstrapEvent(this._rootPointerEvent,s);this.rootBoundary.mapEvent(o)}this.setCursor(this.rootBoundary.cursor)}_onPointerMove(e){if(!this.features.move)return;this.rootBoundary.rootTarget=this.renderer.lastObjectRendered,E.pointerMoved();const t=this._normalizeToPointerData(e);for(let i=0,n=t.length;i<n;i++){const s=this._bootstrapEvent(this._rootPointerEvent,t[i]);this.rootBoundary.mapEvent(s)}this.setCursor(this.rootBoundary.cursor)}_onPointerUp(e){if(!this.features.click)return;this.rootBoundary.rootTarget=this.renderer.lastObjectRendered;let t=e.target;e.composedPath&&e.composedPath().length>0&&(t=e.composedPath()[0]);const i=t!==this.domElement?"outside":"",n=this._normalizeToPointerData(e);for(let s=0,o=n.length;s<o;s++){const a=this._bootstrapEvent(this._rootPointerEvent,n[s]);a.type+=i,this.rootBoundary.mapEvent(a)}this.setCursor(this.rootBoundary.cursor)}_onPointerOverOut(e){if(!this.features.click)return;this.rootBoundary.rootTarget=this.renderer.lastObjectRendered;const t=this._normalizeToPointerData(e);for(let i=0,n=t.length;i<n;i++){const s=this._bootstrapEvent(this._rootPointerEvent,t[i]);this.rootBoundary.mapEvent(s)}this.setCursor(this.rootBoundary.cursor)}onWheel(e){if(!this.features.wheel)return;const t=this.normalizeWheelEvent(e);this.rootBoundary.rootTarget=this.renderer.lastObjectRendered,this.rootBoundary.mapEvent(t)}setTargetElement(e){this._removeEvents(),this.domElement=e,E.domElement=e,this._addEvents()}_addEvents(){if(this._eventsAdded||!this.domElement)return;E.addTickerListener();const e=this.domElement.style;e&&(globalThis.navigator.msPointerEnabled?(e.msContentZooming="none",e.msTouchAction="none"):this.supportsPointerEvents&&(e.touchAction="none")),this.supportsPointerEvents?(globalThis.document.addEventListener("pointermove",this._onPointerMove,!0),this.domElement.addEventListener("pointerdown",this._onPointerDown,!0),this.domElement.addEventListener("pointerleave",this._onPointerOverOut,!0),this.domElement.addEventListener("pointerover",this._onPointerOverOut,!0),globalThis.addEventListener("pointerup",this._onPointerUp,!0)):(globalThis.document.addEventListener("mousemove",this._onPointerMove,!0),this.domElement.addEventListener("mousedown",this._onPointerDown,!0),this.domElement.addEventListener("mouseout",this._onPointerOverOut,!0),this.domElement.addEventListener("mouseover",this._onPointerOverOut,!0),globalThis.addEventListener("mouseup",this._onPointerUp,!0),this.supportsTouchEvents&&(this.domElement.addEventListener("touchstart",this._onPointerDown,!0),this.domElement.addEventListener("touchend",this._onPointerUp,!0),this.domElement.addEventListener("touchmove",this._onPointerMove,!0))),this.domElement.addEventListener("wheel",this.onWheel,{passive:!0,capture:!0}),this._eventsAdded=!0}_removeEvents(){if(!this._eventsAdded||!this.domElement)return;E.removeTickerListener();const e=this.domElement.style;e&&(globalThis.navigator.msPointerEnabled?(e.msContentZooming="",e.msTouchAction=""):this.supportsPointerEvents&&(e.touchAction="")),this.supportsPointerEvents?(globalThis.document.removeEventListener("pointermove",this._onPointerMove,!0),this.domElement.removeEventListener("pointerdown",this._onPointerDown,!0),this.domElement.removeEventListener("pointerleave",this._onPointerOverOut,!0),this.domElement.removeEventListener("pointerover",this._onPointerOverOut,!0),globalThis.removeEventListener("pointerup",this._onPointerUp,!0)):(globalThis.document.removeEventListener("mousemove",this._onPointerMove,!0),this.domElement.removeEventListener("mousedown",this._onPointerDown,!0),this.domElement.removeEventListener("mouseout",this._onPointerOverOut,!0),this.domElement.removeEventListener("mouseover",this._onPointerOverOut,!0),globalThis.removeEventListener("mouseup",this._onPointerUp,!0),this.supportsTouchEvents&&(this.domElement.removeEventListener("touchstart",this._onPointerDown,!0),this.domElement.removeEventListener("touchend",this._onPointerUp,!0),this.domElement.removeEventListener("touchmove",this._onPointerMove,!0))),this.domElement.removeEventListener("wheel",this.onWheel,!0),this.domElement=null,this._eventsAdded=!1}mapPositionToPoint(e,t,i){const n=this.domElement.isConnected?this.domElement.getBoundingClientRect():{x:0,y:0,width:this.domElement.width,height:this.domElement.height,left:0,top:0},s=1/this.resolution;e.x=(t-n.left)*(this.domElement.width/n.width)*s,e.y=(i-n.top)*(this.domElement.height/n.height)*s}_normalizeToPointerData(e){const t=[];if(this.supportsTouchEvents&&e instanceof TouchEvent)for(let i=0,n=e.changedTouches.length;i<n;i++){const s=e.changedTouches[i];typeof s.button>"u"&&(s.button=0),typeof s.buttons>"u"&&(s.buttons=1),typeof s.isPrimary>"u"&&(s.isPrimary=e.touches.length===1&&e.type==="touchstart"),typeof s.width>"u"&&(s.width=s.radiusX||1),typeof s.height>"u"&&(s.height=s.radiusY||1),typeof s.tiltX>"u"&&(s.tiltX=0),typeof s.tiltY>"u"&&(s.tiltY=0),typeof s.pointerType>"u"&&(s.pointerType="touch"),typeof s.pointerId>"u"&&(s.pointerId=s.identifier||0),typeof s.pressure>"u"&&(s.pressure=s.force||.5),typeof s.twist>"u"&&(s.twist=0),typeof s.tangentialPressure>"u"&&(s.tangentialPressure=0),typeof s.layerX>"u"&&(s.layerX=s.offsetX=s.clientX),typeof s.layerY>"u"&&(s.layerY=s.offsetY=s.clientY),s.isNormalized=!0,s.type=e.type,t.push(s)}else if(!globalThis.MouseEvent||e instanceof MouseEvent&&(!this.supportsPointerEvents||!(e instanceof globalThis.PointerEvent))){const i=e;typeof i.isPrimary>"u"&&(i.isPrimary=!0),typeof i.width>"u"&&(i.width=1),typeof i.height>"u"&&(i.height=1),typeof i.tiltX>"u"&&(i.tiltX=0),typeof i.tiltY>"u"&&(i.tiltY=0),typeof i.pointerType>"u"&&(i.pointerType="mouse"),typeof i.pointerId>"u"&&(i.pointerId=fe),typeof i.pressure>"u"&&(i.pressure=.5),typeof i.twist>"u"&&(i.twist=0),typeof i.tangentialPressure>"u"&&(i.tangentialPressure=0),i.isNormalized=!0,t.push(i)}else t.push(e);return t}normalizeWheelEvent(e){const t=this._rootWheelEvent;return this._transferMouseData(t,e),t.deltaX=e.deltaX,t.deltaY=e.deltaY,t.deltaZ=e.deltaZ,t.deltaMode=e.deltaMode,this.mapPositionToPoint(t.screen,e.clientX,e.clientY),t.global.copyFrom(t.screen),t.offset.copyFrom(t.screen),t.nativeEvent=e,t.type=e.type,t}_bootstrapEvent(e,t){return e.originalEvent=null,e.nativeEvent=t,e.pointerId=t.pointerId,e.width=t.width,e.height=t.height,e.isPrimary=t.isPrimary,e.pointerType=t.pointerType,e.pressure=t.pressure,e.tangentialPressure=t.tangentialPressure,e.tiltX=t.tiltX,e.tiltY=t.tiltY,e.twist=t.twist,this._transferMouseData(e,t),this.mapPositionToPoint(e.screen,t.clientX,t.clientY),e.global.copyFrom(e.screen),e.offset.copyFrom(e.screen),e.isTrusted=t.isTrusted,e.type==="pointerleave"&&(e.type="pointerout"),e.type.startsWith("mouse")&&(e.type=e.type.replace("mouse","pointer")),e.type.startsWith("touch")&&(e.type=ge[e.type]||e.type),e}_transferMouseData(e,t){e.isTrusted=t.isTrusted,e.srcElement=t.srcElement,e.timeStamp=performance.now(),e.type=t.type,e.altKey=t.altKey,e.button=t.button,e.buttons=t.buttons,e.client.x=t.clientX,e.client.y=t.clientY,e.ctrlKey=t.ctrlKey,e.metaKey=t.metaKey,e.movement.x=t.movementX,e.movement.y=t.movementY,e.page.x=t.pageX,e.page.y=t.pageY,e.relatedTarget=null,e.shiftKey=t.shiftKey}};B.extension={name:"events",type:[w.WebGLSystem,w.CanvasSystem,w.WebGPUSystem],priority:-1};B.defaultEventFeatures={move:!0,globalMove:!0,click:!0,wheel:!0};let q=B;const me={onclick:null,onmousedown:null,onmouseenter:null,onmouseleave:null,onmousemove:null,onglobalmousemove:null,onmouseout:null,onmouseover:null,onmouseup:null,onmouseupoutside:null,onpointercancel:null,onpointerdown:null,onpointerenter:null,onpointerleave:null,onpointermove:null,onglobalpointermove:null,onpointerout:null,onpointerover:null,onpointertap:null,onpointerup:null,onpointerupoutside:null,onrightclick:null,onrightdown:null,onrightup:null,onrightupoutside:null,ontap:null,ontouchcancel:null,ontouchend:null,ontouchendoutside:null,ontouchmove:null,onglobaltouchmove:null,ontouchstart:null,onwheel:null,get interactive(){return this.eventMode==="dynamic"||this.eventMode==="static"},set interactive(r){this.eventMode=r?"static":"passive"},_internalEventMode:void 0,get eventMode(){return this._internalEventMode??q.defaultEventMode},set eventMode(r){this._internalEventMode=r},isInteractive(){return this.eventMode==="static"||this.eventMode==="dynamic"},interactiveChildren:!0,hitArea:null,addEventListener(r,e,t){const i=typeof t=="boolean"&&t||typeof t=="object"&&t.capture,n=typeof t=="object"?t.signal:void 0,s=typeof t=="object"?t.once===!0:!1,o=typeof e=="function"?void 0:e;r=i?`${r}capture`:r;const a=typeof e=="function"?e:e.handleEvent,c=this;n&&n.addEventListener("abort",()=>{c.off(r,a,o)}),s?c.once(r,a,o):c.on(r,a,o)},removeEventListener(r,e,t){const i=typeof t=="boolean"&&t||typeof t=="object"&&t.capture,n=typeof e=="function"?void 0:e;r=i?`${r}capture`:r,e=typeof e=="function"?e:e.handleEvent,this.off(r,e,n)},dispatchEvent(r){if(!(r instanceof M))throw new Error("Container cannot propagate events outside of the Federated Events API");return r.defaultPrevented=!1,r.path=null,r.target=this,r.manager.dispatchEvent(r),!r.defaultPrevented}};z.add(V);Z.mixin(ue);z.add(q);Z.mixin(me);
