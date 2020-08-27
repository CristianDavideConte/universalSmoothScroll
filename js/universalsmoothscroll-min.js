const DEFAULTSCROLLSTEPX=50*window.innerWidth/1920,DEFAULTSCROLLSTEPY=50*window.innerHeight/937,DEFAULTMINANIMATIONFRAMES=5;var universalSmoothScroll={_xMapContainerAnimationID:new Map,_yMapContainerAnimationID:new Map,_scrollStepX:DEFAULTSCROLLSTEPX,_scrollStepY:DEFAULTSCROLLSTEPY,_minAnimationFrame:5,isXscrolling:function(n=window){const t=universalSmoothScroll._xMapContainerAnimationID.get(n);return void 0===t&&t===[]},isYscrolling:function(n=window){const t=universalSmoothScroll._xMapContainerAnimationID.get(n);return void 0===t&&t===[]},getScrollStepX:function(){return this._scrollStepX},getScrollStepY:function(){return this._scrollStepY},getMinAnimationFrame:function(){return this._minAnimationFrame},setScrollStepX:function(n){typeof n==typeof this._scrollStepX&&n>0&&(this._scrollStepX=n)},setScrollStepY:function(n){typeof n==typeof this._scrollStepY&&n>0&&(this._scrollStepY=n)},setMinAnimationFrame:function(n){typeof n==typeof this._minAnimationFrame&&n>0&&(this._minAnimationFrame=n)},calcStepXLenght:function(n){return n>=(this._minAnimationFrame-1)*this._scrollStepX?this._scrollStepX:Math.round(n/this._minAnimationFrame)},calcStepYLenght:function(n){return n>=(this._minAnimationFrame-1)*this._scrollStepY?this._scrollStepY:Math.round(n/this._minAnimationFrame)},containerScrollingXFunction:function(n){return n instanceof HTMLElement?()=>n.scrollLeft:()=>n.scrollX},containerScrollingYFunction:function(n){return n instanceof HTMLElement?()=>n.scrollTop:()=>n.scrollY},containerMaxScrollX:function(n){let t=document.body,o=document.documentElement;return n instanceof HTMLElement?n.scrollWidth-n.offsetWidth:Math.max(t.scrollWidth,t.offsetWidth,t.clientWidth,o.clientWidth,o.scrollWidth,o.offsetWidth)-window.innerWidth},containerMaxScrollY:function(n){let t=document.body,o=document.documentElement;return n instanceof HTMLElement?n.scrollHeight-n.offsetHeight:Math.max(t.scrollHeight,t.offsetHeight,t.clientHeight,o.clientHeight,o.scrollHeight,o.offsetHeight)-window.innerHeight},scrollXto:function(n,t=window,o=(()=>{}),i=!1){if(void 0===n)return;let e=this.containerMaxScrollX(t);n<0?n=0:n>e&&(n=e);const l=this.containerScrollingXFunction(t),r=this.containerScrollingYFunction(t);let c=n-l();const a=Math.sign(c);if((c*=a)<=0)return void("function"==typeof o&&window.requestAnimationFrame(o));const s=this.calcStepXLenght(c);let m=universalSmoothScroll._xMapContainerAnimationID.get(t);void 0!==m&&m.length>0&&!1===i&&(universalSmoothScroll.stopScrollingX(t),m=[]),void 0===m&&(m=[]),m.push(window.requestAnimationFrame(function i(){m=universalSmoothScroll._xMapContainerAnimationID.get(t);c=Math.abs(n-l());if(c<s)return t.scroll(l()+c*a,r()),void("function"==typeof o&&window.requestAnimationFrame(o));t.scroll(l()+s*a,r());m.shift();m.push(window.requestAnimationFrame(i));universalSmoothScroll._xMapContainerAnimationID.set(t,m)})),universalSmoothScroll._xMapContainerAnimationID.set(t,m)},scrollYto:function(n,t=window,o=(()=>{}),i=!1){if(void 0===n)return;let e=this.containerMaxScrollY(t);n<0?n=0:n>e&&(n=e);const l=this.containerScrollingXFunction(t),r=this.containerScrollingYFunction(t);let c=n-r();const a=Math.sign(c);if((c*=a)<=0)return void("function"==typeof o&&window.requestAnimationFrame(o));const s=this.calcStepYLenght(c);let m=universalSmoothScroll._yMapContainerAnimationID.get(t);void 0!==m&&m.length>0&&!1===i&&(universalSmoothScroll.stopScrollingY(t),m=[]),void 0===m&&(m=[]),m.push(window.requestAnimationFrame(function i(){m=universalSmoothScroll._yMapContainerAnimationID.get(t);c=Math.abs(n-r());if(c<s)return t.scroll(l(),r()+c*a),void("function"==typeof o&&window.requestAnimationFrame(o));t.scroll(l(),r()+s*a);m.shift();m.push(window.requestAnimationFrame(i));universalSmoothScroll._yMapContainerAnimationID.set(t,m)})),universalSmoothScroll._yMapContainerAnimationID.set(t,m)},scrollXby:function(n,t=window,o=(()=>{}),i=!1){if(void 0===n)return;const e=this.containerScrollingXFunction(t);this.scrollXto(e()+n,t,o,i)},scrollYby:function(n,t=window,o=(()=>{}),i=!1){if(void 0===n)return;const e=this.containerScrollingYFunction(t);this.scrollYto(e()+n,t,o,i)},scrollTo:function(n,t,o=window,i=window,e=(()=>{}),l=(()=>{}),r=!1,c=!1,a=(()=>{}),s=(()=>{})){setTimeout(()=>this.scrollXto(n,o,e,r,a),0),setTimeout(()=>this.scrollYto(t,i,l,c,s),0)},scrollBy:function(n,t,o=window,i=window,e=(()=>{}),l=(()=>{}),r=!1,c=!1,a=(()=>{}),s=(()=>{})){setTimeout(()=>this.scrollXby(n,o,e,r,a),0),setTimeout(()=>this.scrollYby(t,i,l,c,s),0)},stopScrollingX:function(n=window,t=(()=>{})){let o=universalSmoothScroll._xMapContainerAnimationID.get(n);void 0!==o&&o!==[]&&(o.forEach(n=>window.cancelAnimationFrame(n)),universalSmoothScroll._xMapContainerAnimationID.set(n,[]),"function"==typeof t&&window.requestAnimationFrame(t))},stopScrollingY:function(n=window,t=(()=>{})){let o=universalSmoothScroll._yMapContainerAnimationID.get(n);void 0!==o&&o!==[]&&(o.forEach(n=>window.cancelAnimationFrame(n)),universalSmoothScroll._yMapContainerAnimationID.set(n,[]),"function"==typeof t&&window.requestAnimationFrame(t))},hrefSetup:function(){const n=document.getElementsByTagName("a");for(pageLink of n){const n=document.getElementById(pageLink.href.split("#")[1]);n instanceof HTMLElement&&pageLink.addEventListener("click",t=>{t.preventDefault(),universalSmoothScroll.scrollYto(n.offsetTop,window,null,!1)},{passive:!1})}}};