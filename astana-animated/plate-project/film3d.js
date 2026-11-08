(()=>{var Yu=0,kc=1,Zu=2;var oo=1,ka=2,Qs=3,Wi=0,cn=1,Ot=2,cs=0,er=1,ai=2,Vc=3,Wc=4,Ju=5;var hs=100,Ku=101,$u=102,ju=103,Qu=104,ed=200,td=201,nd=202,id=203,Xc=204,qc=205,sd=206,rd=207,od=208,ad=209,ld=210,cd=211,hd=212,ud=213,dd=214,oa=0,aa=1,la=2,Bs=3,ca=4,ha=5,ua=6,da=7,Yc=0,fd=1,pd=2,Bn=0,Zc=1,Jc=2,Kc=3,$c=4,jc=5,Qc=6,eh=7;var th=300,us=301,tr=302,Va=303,Wa=304,ei=1e3,Qn=1001,fa=1002,rn=1003,md=1004;var ao=1005;var $t=1006,Xa=1007;var Ln=1008;var bn=1009,nh=1010,ih=1011,nr=1012,qa=1013,Jn=1014,Tn=1015,hn=1016,Ya=1017,Za=1018,ds=1020,sh=35902,rh=35899,oh=1021,ah=1022,Dn=1023,yi=1026,wi=1027,Ja=1028,Ka=1029,Xi=1030,$a=1031;var ja=1033,lo=33776,co=33777,ho=33778,uo=33779,Qa=35840,el=35841,tl=35842,nl=35843,il=36196,sl=37492,rl=37496,ol=37488,al=37489,fo=37490,ll=37491,cl=37808,hl=37809,ul=37810,dl=37811,fl=37812,pl=37813,ml=37814,gl=37815,xl=37816,_l=37817,vl=37818,yl=37819,Ml=37820,Sl=37821,El=36492,bl=36494,Tl=36495,wl=36283,Al=36284,po=36285,Rl=36286;var wr=2300,pa=2301,sa=2302,Ic=2303,Pc=2400,Lc=2401,Dc=2402;var gd=3200;var Cl=0,xd=1,Ai="",Zt="srgb",rs="srgb-linear",Ar="linear",Mt="srgb";var ra=7680;var _d=519,vd=512,yd=513,Md=514,lh=515,Sd=516,Ed=517,ch=518,hh=519,uh=35044;var dh="300 es",On=2e3,zs=2001;function Zf(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Jf(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Rr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function bd(){let i=Rr("canvas");return i.style.display="block",i}var lu={},Hs=null;function Cr(...i){let e="THREE."+i.shift();Hs?Hs("log",e,...i):console.log(e,...i)}function Td(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Ge(...i){i=Td(i);let e="THREE."+i.shift();if(Hs)Hs("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function We(...i){i=Td(i);let e="THREE."+i.shift();if(Hs)Hs("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function Mr(...i){let e=i.join(" ");e in lu||(lu[e]=!0,Ge(...i))}function wd(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var Ad={[oa]:oa,[la]:ua,[ca]:ca,[Bs]:ha,[aa]:aa,[ua]:la,[da]:da,[ha]:Bs},ti=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},fn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],cu=1234567,Sr=Math.PI/180,Gs=180/Math.PI;function Ri(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(fn[i&255]+fn[i>>8&255]+fn[i>>16&255]+fn[i>>24&255]+"-"+fn[e&255]+fn[e>>8&255]+"-"+fn[e>>16&15|64]+fn[e>>24&255]+"-"+fn[t&63|128]+fn[t>>8&255]+"-"+fn[t>>16&255]+fn[t>>24&255]+fn[n&255]+fn[n>>8&255]+fn[n>>16&255]+fn[n>>24&255]).toLowerCase()}function nt(i,e,t){return Math.max(e,Math.min(t,i))}function fh(i,e){return(i%e+e)%e}function Kf(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function $f(i,e,t){return i!==e?(t-i)/(e-i):0}function Er(i,e,t){return(1-t)*i+t*e}function jf(i,e,t,n){return Er(i,e,1-Math.exp(-t*n))}function Qf(i,e=1){return e-Math.abs(fh(i,e*2)-e)}function e0(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function t0(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function n0(i,e){return i+Math.floor(Math.random()*(e-i+1))}function i0(i,e){return i+Math.random()*(e-i)}function s0(i){return i*(.5-Math.random())}function r0(i){i!==void 0&&(cu=i);let e=cu+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function o0(i){return i*Sr}function a0(i){return i*Gs}function l0(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function c0(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function ph(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function h0(i,e,t,n,s){let r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),h=o((e+n)/2),u=r((e-n)/2),d=o((e-n)/2),p=r((n-e)/2),f=o((n-e)/2);switch(s){case"XYX":i.set(a*h,l*u,l*d,a*c);break;case"YZY":i.set(l*d,a*h,l*u,a*c);break;case"ZXZ":i.set(l*u,l*d,a*h,a*c);break;case"XZX":i.set(a*h,l*f,l*p,a*c);break;case"YXY":i.set(l*p,a*h,l*f,a*c);break;case"ZYZ":i.set(l*f,l*p,a*h,a*c);break;default:Ge("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Il(i){switch(i.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function mh(i,e){if(e.constructor===Float32Array)return i;let t=Il(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(i/t,-1)}function gh(i,e){if(e.constructor===Float32Array)return i;let t=Il(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(i*t)}var Ci={DEG2RAD:Sr,RAD2DEG:Gs,generateUUID:Ri,clamp:nt,euclideanModulo:fh,mapLinear:Kf,inverseLerp:$f,lerp:Er,damp:jf,pingpong:Qf,smoothstep:e0,smootherstep:t0,randInt:n0,randFloat:i0,randFloatSpread:s0,seededRandom:r0,degToRad:o0,radToDeg:a0,isPowerOfTwo:l0,ceilPowerOfTwo:c0,floorPowerOfTwo:ph,setQuaternionFromProperEuler:h0,normalize:gh,denormalize:mh},ee=class{static{this.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=nt(this.x,e.x,t.x),this.y=nt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=nt(this.x,e,t),this.y=nt(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(nt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(nt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ft=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3],d=r[o+0],p=r[o+1],f=r[o+2],_=r[o+3];if(u!==_||l!==d||c!==p||h!==f){let m=l*d+c*p+h*f+u*_;m<0&&(d=-d,p=-p,f=-f,_=-_,m=-m);let g=1-a;if(m<.9995){let v=Math.acos(m),M=Math.sin(v);g=Math.sin(g*v)/M,a=Math.sin(a*v)/M,l=l*g+d*a,c=c*g+p*a,h=h*g+f*a,u=u*g+_*a}else{l=l*g+d*a,c=c*g+p*a,h=h*g+f*a,u=u*g+_*a;let v=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=v,c*=v,h*=v,u*=v}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[o],d=r[o+1],p=r[o+2],f=r[o+3];return e[t]=a*f+h*u+l*p-c*d,e[t+1]=l*f+h*d+c*u-a*p,e[t+2]=c*f+h*p+a*d-l*u,e[t+3]=h*f-a*u-l*d-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),u=a(r/2),d=l(n/2),p=l(s/2),f=l(r/2);switch(o){case"XYZ":this._x=d*h*u+c*p*f,this._y=c*p*u-d*h*f,this._z=c*h*f+d*p*u,this._w=c*h*u-d*p*f;break;case"YXZ":this._x=d*h*u+c*p*f,this._y=c*p*u-d*h*f,this._z=c*h*f-d*p*u,this._w=c*h*u+d*p*f;break;case"ZXY":this._x=d*h*u-c*p*f,this._y=c*p*u+d*h*f,this._z=c*h*f+d*p*u,this._w=c*h*u-d*p*f;break;case"ZYX":this._x=d*h*u-c*p*f,this._y=c*p*u+d*h*f,this._z=c*h*f-d*p*u,this._w=c*h*u+d*p*f;break;case"YZX":this._x=d*h*u+c*p*f,this._y=c*p*u+d*h*f,this._z=c*h*f-d*p*u,this._w=c*h*u-d*p*f;break;case"XZY":this._x=d*h*u-c*p*f,this._y=c*p*u-d*h*f,this._z=c*h*f+d*p*u,this._w=c*h*u+d*p*f;break;default:Ge("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+a+u;if(d>0){let p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(h-l)*p,this._y=(r-c)*p,this._z=(o-s)*p}else if(n>a&&n>u){let p=2*Math.sqrt(1+n-a-u);this._w=(h-l)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+c)/p}else if(a>u){let p=2*Math.sqrt(1+a-n-u);this._w=(r-c)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(l+h)/p}else{let p=2*Math.sqrt(1+u-n-a);this._w=(o-s)/p,this._x=(r+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(nt(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=this.dot(e);a<0&&(n=-n,s=-s,r=-r,o=-o,a=-a);let l=1-t;if(a<.9995){let c=Math.acos(a),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+o*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+o*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},C=class{static{this.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(hu.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(hu.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*n),h=2*(a*t-r*s),u=2*(r*n-o*t);return this.x=t+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=s+l*u+r*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=nt(this.x,e.x,t.x),this.y=nt(this.y,e.y,t.y),this.z=nt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=nt(this.x,e,t),this.y=nt(this.y,e,t),this.z=nt(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(nt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return rc.copy(this).projectOnVector(e),this.sub(rc)}reflect(e){return this.sub(rc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(nt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},rc=new C,hu=new Ft,Ye=class{static{this.prototype.isMatrix3=!0}constructor(e,t,n,s,r,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c)}set(e,t,n,s,r,o,a,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=a,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],p=n[5],f=n[8],_=s[0],m=s[3],g=s[6],v=s[1],M=s[4],y=s[7],w=s[2],b=s[5],x=s[8];return r[0]=o*_+a*v+l*w,r[3]=o*m+a*M+l*b,r[6]=o*g+a*y+l*x,r[1]=c*_+h*v+u*w,r[4]=c*m+h*M+u*b,r[7]=c*g+h*y+u*x,r[2]=d*_+p*v+f*w,r[5]=d*m+p*M+f*b,r[8]=d*g+p*y+f*x,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=h*o-a*c,d=a*l-h*r,p=c*r-o*l,f=t*u+n*d+s*p;if(f===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/f;return e[0]=u*_,e[1]=(s*c-h*n)*_,e[2]=(a*n-s*o)*_,e[3]=d*_,e[4]=(h*t-s*l)*_,e[5]=(s*r-a*t)*_,e[6]=p*_,e[7]=(n*l-c*t)*_,e[8]=(o*t-n*r)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return Mr("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(oc.makeScale(e,t)),this}rotate(e){return Mr("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(oc.makeRotation(-e)),this}translate(e,t){return Mr("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(oc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},oc=new Ye,uu=new Ye().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),du=new Ye().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function u0(){let i={enabled:!0,workingColorSpace:rs,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===Mt&&(s.r=vi(s.r),s.g=vi(s.g),s.b=vi(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Mt&&(s.r=Os(s.r),s.g=Os(s.g),s.b=Os(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Ai?Ar:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[o].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[rs]:{primaries:e,whitePoint:n,transfer:Ar,toXYZ:uu,fromXYZ:du,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Zt},outputColorSpaceConfig:{drawingBufferColorSpace:Zt}},[Zt]:{primaries:e,whitePoint:n,transfer:Mt,toXYZ:uu,fromXYZ:du,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Zt}}}),i}var ft=u0();function vi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Os(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var vs,ma=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{vs===void 0&&(vs=Rr("canvas")),vs.width=e.width,vs.height=e.height;let s=vs.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=vs}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Rr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=vi(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(vi(t[n]/255)*255):t[n]=vi(t[n]);return{data:t,width:e.width,height:e.height}}else return Ge("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},d0=0,ks=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:d0++}),this.uuid=Ri(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width||0,t.height||0,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(ac(s[o].image)):r.push(ac(s[o]))}else r=ac(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function ac(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?ma.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Ge("Texture: Unable to serialize Texture."),{})}var f0=0,lc=new C,yn=class i extends ti{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Qn,s=Qn,r=$t,o=Ln,a=Dn,l=bn,c=i.DEFAULT_ANISOTROPY,h=Ai){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:f0++}),this.uuid=Ri(),this.name="",this.source=new ks(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ee(0,0),this.repeat=new ee(1,1),this.center=new ee(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ye,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(lc).x}get height(){return this.source.getSize(lc).y}get depth(){return this.source.getSize(lc).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Ge(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Ge(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==th)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case ei:e.x=e.x-Math.floor(e.x);break;case Qn:e.x=e.x<0?0:1;break;case fa:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case ei:e.y=e.y-Math.floor(e.y);break;case Qn:e.y=e.y<0?0:1;break;case fa:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};yn.DEFAULT_IMAGE=null;yn.DEFAULT_MAPPING=th;yn.DEFAULT_ANISOTROPY=1;var Rt=class{static{this.prototype.isVector4=!0}constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],p=l[5],f=l[9],_=l[2],m=l[6],g=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(f-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(f+m)<.1&&Math.abs(c+p+g-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let M=(c+1)/2,y=(p+1)/2,w=(g+1)/2,b=(h+d)/4,x=(u+_)/4,E=(f+m)/4;return M>y&&M>w?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=b/n,r=x/n):y>w?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=b/s,r=E/s):w<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),n=x/r,s=E/r),this.set(n,s,r,t),this}let v=Math.sqrt((m-f)*(m-f)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(v)<.001&&(v=1),this.x=(m-f)/v,this.y=(u-_)/v,this.z=(d-h)/v,this.w=Math.acos((c+p+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=nt(this.x,e.x,t.x),this.y=nt(this.y,e.y,t.y),this.z=nt(this.z,e.z,t.z),this.w=nt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=nt(this.x,e,t),this.y=nt(this.y,e,t),this.z=nt(this.z,e,t),this.w=nt(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(nt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},ga=class extends ti{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:$t,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Rt(0,0,e,t),this.scissorTest=!1,this.viewport=new Rt(0,0,e,t),this.textures=[];let s=n.count;for(let r=0;r<s;r++)this.textures[r]=new yn({width:e,height:t,depth:n.depth}),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:$t,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new ks(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Gt=class extends ga{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Ir=class extends yn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=rn,this.minFilter=rn,this.wrapR=Qn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var xa=class extends yn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=rn,this.minFilter=rn,this.wrapR=Qn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var je=class i{static{this.prototype.isMatrix4=!0}constructor(e,t,n,s,r,o,a,l,c,h,u,d,p,f,_,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c,h,u,d,p,f,_,m)}set(e,t,n,s,r,o,a,l,c,h,u,d,p,f,_,m){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=s,g[1]=r,g[5]=o,g[9]=a,g[13]=l,g[2]=c,g[6]=h,g[10]=u,g[14]=d,g[3]=p,g[7]=f,g[11]=_,g[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,s=1/ys.setFromMatrixColumn(e,0).length(),r=1/ys.setFromMatrixColumn(e,1).length(),o=1/ys.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let d=o*h,p=o*u,f=a*h,_=a*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=p+f*c,t[5]=d-_*c,t[9]=-a*l,t[2]=_-d*c,t[6]=f+p*c,t[10]=o*l}else if(e.order==="YXZ"){let d=l*h,p=l*u,f=c*h,_=c*u;t[0]=d+_*a,t[4]=f*a-p,t[8]=o*c,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=p*a-f,t[6]=_+d*a,t[10]=o*l}else if(e.order==="ZXY"){let d=l*h,p=l*u,f=c*h,_=c*u;t[0]=d-_*a,t[4]=-o*u,t[8]=f+p*a,t[1]=p+f*a,t[5]=o*h,t[9]=_-d*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let d=o*h,p=o*u,f=a*h,_=a*u;t[0]=l*h,t[4]=f*c-p,t[8]=d*c+_,t[1]=l*u,t[5]=_*c+d,t[9]=p*c-f,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let d=o*l,p=o*c,f=a*l,_=a*c;t[0]=l*h,t[4]=_-d*u,t[8]=f*u+p,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=p*u+f,t[10]=d-_*u}else if(e.order==="XZY"){let d=o*l,p=o*c,f=a*l,_=a*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+_,t[5]=o*h,t[9]=p*u-f,t[2]=f*u-p,t[6]=a*h,t[10]=_*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(p0,e,m0)}lookAt(e,t,n){let s=this.elements;return Rn.subVectors(e,t),Rn.lengthSq()===0&&(Rn.z=1),Rn.normalize(),Ui.crossVectors(n,Rn),Ui.lengthSq()===0&&(Math.abs(n.z)===1?Rn.x+=1e-4:Rn.z+=1e-4,Rn.normalize(),Ui.crossVectors(n,Rn)),Ui.normalize(),Ro.crossVectors(Rn,Ui),s[0]=Ui.x,s[4]=Ro.x,s[8]=Rn.x,s[1]=Ui.y,s[5]=Ro.y,s[9]=Rn.y,s[2]=Ui.z,s[6]=Ro.z,s[10]=Rn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],p=n[13],f=n[2],_=n[6],m=n[10],g=n[14],v=n[3],M=n[7],y=n[11],w=n[15],b=s[0],x=s[4],E=s[8],P=s[12],A=s[1],I=s[5],N=s[9],O=s[13],L=s[2],G=s[6],X=s[10],k=s[14],ne=s[3],W=s[7],$=s[11],te=s[15];return r[0]=o*b+a*A+l*L+c*ne,r[4]=o*x+a*I+l*G+c*W,r[8]=o*E+a*N+l*X+c*$,r[12]=o*P+a*O+l*k+c*te,r[1]=h*b+u*A+d*L+p*ne,r[5]=h*x+u*I+d*G+p*W,r[9]=h*E+u*N+d*X+p*$,r[13]=h*P+u*O+d*k+p*te,r[2]=f*b+_*A+m*L+g*ne,r[6]=f*x+_*I+m*G+g*W,r[10]=f*E+_*N+m*X+g*$,r[14]=f*P+_*O+m*k+g*te,r[3]=v*b+M*A+y*L+w*ne,r[7]=v*x+M*I+y*G+w*W,r[11]=v*E+M*N+y*X+w*$,r[15]=v*P+M*O+y*k+w*te,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],p=e[14],f=e[3],_=e[7],m=e[11],g=e[15],v=l*p-c*d,M=a*p-c*u,y=a*d-l*u,w=o*p-c*h,b=o*d-l*h,x=o*u-a*h;return t*(_*v-m*M+g*y)-n*(f*v-m*w+g*b)+s*(f*M-_*w+g*x)-r*(f*y-_*b+m*x)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],o=e[5],a=e[9],l=e[2],c=e[6],h=e[10];return t*(o*h-a*c)-n*(r*h-a*l)+s*(r*c-o*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],p=e[11],f=e[12],_=e[13],m=e[14],g=e[15],v=t*a-n*o,M=t*l-s*o,y=t*c-r*o,w=n*l-s*a,b=n*c-r*a,x=s*c-r*l,E=h*_-u*f,P=h*m-d*f,A=h*g-p*f,I=u*m-d*_,N=u*g-p*_,O=d*g-p*m,L=v*O-M*N+y*I+w*A-b*P+x*E;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let G=1/L;return e[0]=(a*O-l*N+c*I)*G,e[1]=(s*N-n*O-r*I)*G,e[2]=(_*x-m*b+g*w)*G,e[3]=(d*b-u*x-p*w)*G,e[4]=(l*A-o*O-c*P)*G,e[5]=(t*O-s*A+r*P)*G,e[6]=(m*y-f*x-g*M)*G,e[7]=(h*x-d*y+p*M)*G,e[8]=(o*N-a*A+c*E)*G,e[9]=(n*A-t*N-r*E)*G,e[10]=(f*b-_*y+g*v)*G,e[11]=(u*y-h*b-p*v)*G,e[12]=(a*P-o*I-l*E)*G,e[13]=(t*I-n*P+s*E)*G,e[14]=(_*M-f*w-m*v)*G,e[15]=(h*w-u*M+d*v)*G,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,h=o+o,u=a+a,d=r*c,p=r*h,f=r*u,_=o*h,m=o*u,g=a*u,v=l*c,M=l*h,y=l*u,w=n.x,b=n.y,x=n.z;return s[0]=(1-(_+g))*w,s[1]=(p+y)*w,s[2]=(f-M)*w,s[3]=0,s[4]=(p-y)*b,s[5]=(1-(d+g))*b,s[6]=(m+v)*b,s[7]=0,s[8]=(f+M)*x,s[9]=(m-v)*x,s[10]=(1-(d+_))*x,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let o=ys.set(s[0],s[1],s[2]).length(),a=ys.set(s[4],s[5],s[6]).length(),l=ys.set(s[8],s[9],s[10]).length();r<0&&(o=-o),kn.copy(this);let c=1/o,h=1/a,u=1/l;return kn.elements[0]*=c,kn.elements[1]*=c,kn.elements[2]*=c,kn.elements[4]*=h,kn.elements[5]*=h,kn.elements[6]*=h,kn.elements[8]*=u,kn.elements[9]*=u,kn.elements[10]*=u,t.setFromRotationMatrix(kn),n.x=o,n.y=a,n.z=l,this}makePerspective(e,t,n,s,r,o,a=On,l=!1){let c=this.elements,h=2*r/(t-e),u=2*r/(n-s),d=(t+e)/(t-e),p=(n+s)/(n-s),f,_;if(l)f=r/(o-r),_=o*r/(o-r);else if(a===On)f=-(o+r)/(o-r),_=-2*o*r/(o-r);else if(a===zs)f=-o/(o-r),_=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=f,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=On,l=!1){let c=this.elements,h=2/(t-e),u=2/(n-s),d=-(t+e)/(t-e),p=-(n+s)/(n-s),f,_;if(l)f=1/(o-r),_=o/(o-r);else if(a===On)f=-2/(o-r),_=-(o+r)/(o-r);else if(a===zs)f=-1/(o-r),_=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=f,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},ys=new C,kn=new je,p0=new C(0,0,0),m0=new C(1,1,1),Ui=new C,Ro=new C,Rn=new C,fu=new je,pu=new Ft,qn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(nt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-nt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(nt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-nt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(nt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-nt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:Ge("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return fu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(fu,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return pu.setFromEuler(this),this.setFromQuaternion(pu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};qn.DEFAULT_ORDER="XYZ";var Pr=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},g0=0,mu=new C,Ms=new Ft,fi=new je,Co=new C,hr=new C,x0=new C,_0=new Ft,gu=new C(1,0,0),xu=new C(0,1,0),_u=new C(0,0,1),vu={type:"added"},v0={type:"removed"},Ss={type:"childadded",child:null},cc={type:"childremoved",child:null},jt=class i extends ti{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:g0++}),this.uuid=Ri(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new C,t=new qn,n=new Ft,s=new C(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new je},normalMatrix:{value:new Ye}}),this.matrix=new je,this.matrixWorld=new je,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Pr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ms.setFromAxisAngle(e,t),this.quaternion.multiply(Ms),this}rotateOnWorldAxis(e,t){return Ms.setFromAxisAngle(e,t),this.quaternion.premultiply(Ms),this}rotateX(e){return this.rotateOnAxis(gu,e)}rotateY(e){return this.rotateOnAxis(xu,e)}rotateZ(e){return this.rotateOnAxis(_u,e)}translateOnAxis(e,t){return mu.copy(e).applyQuaternion(this.quaternion),this.position.add(mu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(gu,e)}translateY(e){return this.translateOnAxis(xu,e)}translateZ(e){return this.translateOnAxis(_u,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(fi.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Co.copy(e):Co.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),hr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?fi.lookAt(hr,Co,this.up):fi.lookAt(Co,hr,this.up),this.quaternion.setFromRotationMatrix(fi),s&&(fi.extractRotation(s.matrixWorld),Ms.setFromRotationMatrix(fi),this.quaternion.premultiply(Ms.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(We("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(vu),Ss.child=e,this.dispatchEvent(Ss),Ss.child=null):We("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(v0),cc.child=e,this.dispatchEvent(cc),cc.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),fi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),fi.multiply(e.parent.matrixWorld)),e.applyMatrix4(fi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(vu),Ss.child=e,this.dispatchEvent(Ss),Ss.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(hr,e,x0),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(hr,_0,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),u=o(e.shapes),d=o(e.skeletons),p=o(e.animations),f=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),f.length>0&&(n.nodes=f)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};jt.DEFAULT_UP=new C(0,1,0);jt.DEFAULT_MATRIX_AUTO_UPDATE=!0;jt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Ve=class extends jt{constructor(){super(),this.isGroup=!0,this.type="Group"}},y0={type:"move"},Vs=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ve,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ve,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ve,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let _ of e.hand.values()){let m=t.getJointPose(_,n),g=this._getHandJoint(c,_);m!==null&&(g.matrix.fromArray(m.transform.matrix),g.matrix.decompose(g.position,g.quaternion,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=m.radius),g.visible=m!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),p=.02,f=.005;c.inputState.pinching&&d>p+f?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=p-f&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.quaternion,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.quaternion,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(y0)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Ve;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Rd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Fi={h:0,s:0,l:0},Io={h:0,s:0,l:0};function hc(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var Pe=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Zt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ft.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=ft.workingColorSpace){return this.r=e,this.g=t,this.b=n,ft.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=ft.workingColorSpace){if(e=fh(e,1),t=nt(t,0,1),n=nt(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=hc(o,r,e+1/3),this.g=hc(o,r,e),this.b=hc(o,r,e-1/3)}return ft.colorSpaceToWorking(this,s),this}setStyle(e,t=Zt){function n(r){r!==void 0&&parseFloat(r)<1&&Ge("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,t);break;case"hsl":case"hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ge("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);Ge("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Zt){let n=Rd[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Ge("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=vi(e.r),this.g=vi(e.g),this.b=vi(e.b),this}copyLinearToSRGB(e){return this.r=Os(e.r),this.g=Os(e.g),this.b=Os(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Zt){return ft.workingToColorSpace(pn.copy(this),e),Math.round(nt(pn.r*255,0,255))*65536+Math.round(nt(pn.g*255,0,255))*256+Math.round(nt(pn.b*255,0,255))}getHexString(e=Zt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ft.workingColorSpace){ft.workingToColorSpace(pn.copy(this),t);let n=pn.r,s=pn.g,r=pn.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=ft.workingColorSpace){return ft.workingToColorSpace(pn.copy(this),t),e.r=pn.r,e.g=pn.g,e.b=pn.b,e}getStyle(e=Zt){ft.workingToColorSpace(pn.copy(this),e);let t=pn.r,n=pn.g,s=pn.b;return e!==Zt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Fi),this.setHSL(Fi.h+e,Fi.s+t,Fi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Fi),e.getHSL(Io);let n=Er(Fi.h,Io.h,t),s=Er(Fi.s,Io.s,t),r=Er(Fi.l,Io.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},pn=new Pe;Pe.NAMES=Rd;var Lr=class i{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Pe(e),this.density=t}clone(){return new i(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var os=class extends jt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new qn,this.environmentIntensity=1,this.environmentRotation=new qn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background!==null?e.background.clone():null,this.environment=e.environment!==null?e.environment.clone():null,this.fog=e.fog!==null?e.fog.clone():null,this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial!==null?e.overrideMaterial.clone():null,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Vn=new C,pi=new C,uc=new C,mi=new C,Es=new C,bs=new C,yu=new C,dc=new C,fc=new C,pc=new C,mc=new Rt,gc=new Rt,xc=new Rt,_i=class i{constructor(e=new C,t=new C,n=new C){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Vn.subVectors(e,t),s.cross(Vn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Vn.subVectors(s,t),pi.subVectors(n,t),uc.subVectors(e,t);let o=Vn.dot(Vn),a=Vn.dot(pi),l=Vn.dot(uc),c=pi.dot(pi),h=pi.dot(uc),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;let d=1/u,p=(c*l-a*h)*d,f=(o*h-a*l)*d;return r.set(1-p-f,f,p)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,mi)===null?!1:mi.x>=0&&mi.y>=0&&mi.x+mi.y<=1}static getInterpolation(e,t,n,s,r,o,a,l){return this.getBarycoord(e,t,n,s,mi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,mi.x),l.addScaledVector(o,mi.y),l.addScaledVector(a,mi.z),l)}static getInterpolatedAttribute(e,t,n,s,r,o){return mc.setScalar(0),gc.setScalar(0),xc.setScalar(0),mc.fromBufferAttribute(e,t),gc.fromBufferAttribute(e,n),xc.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(mc,r.x),o.addScaledVector(gc,r.y),o.addScaledVector(xc,r.z),o}static isFrontFacing(e,t,n,s){return Vn.subVectors(n,t),pi.subVectors(e,t),Vn.cross(pi).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Vn.subVectors(this.c,this.b),pi.subVectors(this.a,this.b),Vn.cross(pi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,o,a;Es.subVectors(s,n),bs.subVectors(r,n),dc.subVectors(e,n);let l=Es.dot(dc),c=bs.dot(dc);if(l<=0&&c<=0)return t.copy(n);fc.subVectors(e,s);let h=Es.dot(fc),u=bs.dot(fc);if(h>=0&&u<=h)return t.copy(s);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0&&l-h>0)return o=l/(l-h),t.copy(n).addScaledVector(Es,o);pc.subVectors(e,r);let p=Es.dot(pc),f=bs.dot(pc);if(f>=0&&p<=f)return t.copy(r);let _=p*c-l*f;if(_<=0&&c>=0&&f<=0)return a=c/(c-f),t.copy(n).addScaledVector(bs,a);let m=h*f-p*u;if(m<=0&&u-h>=0&&p-f>=0)return yu.subVectors(r,s),a=(u-h)/(u-h+(p-f)),t.copy(s).addScaledVector(yu,a);let g=1/(m+_+d);return o=_*g,a=d*g,t.copy(n).addScaledVector(Es,o).addScaledVector(bs,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},ni=class{constructor(e=new C(1/0,1/0,1/0),t=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Wn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Wn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Wn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Wn):Wn.fromBufferAttribute(r,o),Wn.applyMatrix4(e.matrixWorld),this.expandByPoint(Wn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Po.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Po.copy(n.boundingBox)),Po.applyMatrix4(e.matrixWorld),this.union(Po)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Wn),Wn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ur),Lo.subVectors(this.max,ur),Ts.subVectors(e.a,ur),ws.subVectors(e.b,ur),As.subVectors(e.c,ur),Oi.subVectors(ws,Ts),Bi.subVectors(As,ws),es.subVectors(Ts,As);let t=[0,-Oi.z,Oi.y,0,-Bi.z,Bi.y,0,-es.z,es.y,Oi.z,0,-Oi.x,Bi.z,0,-Bi.x,es.z,0,-es.x,-Oi.y,Oi.x,0,-Bi.y,Bi.x,0,-es.y,es.x,0];return!_c(t,Ts,ws,As,Lo)||(t=[1,0,0,0,1,0,0,0,1],!_c(t,Ts,ws,As,Lo))?!1:(Do.crossVectors(Oi,Bi),t=[Do.x,Do.y,Do.z],_c(t,Ts,ws,As,Lo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Wn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Wn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(gi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),gi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),gi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),gi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),gi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),gi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),gi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),gi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(gi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},gi=[new C,new C,new C,new C,new C,new C,new C,new C],Wn=new C,Po=new ni,Ts=new C,ws=new C,As=new C,Oi=new C,Bi=new C,es=new C,ur=new C,Lo=new C,Do=new C,ts=new C;function _c(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){ts.fromArray(i,r);let a=s.x*Math.abs(ts.x)+s.y*Math.abs(ts.y)+s.z*Math.abs(ts.z),l=e.dot(ts),c=t.dot(ts),h=n.dot(ts);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var Yt=new C,No=new ee,M0=0,Lt=class extends ti{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:M0++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=uh,this.updateRanges=[],this.gpuType=Tn,this.version=0,this._normalizationScale=e!==void 0?Il(e):void 0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)No.fromBufferAttribute(this,t),No.applyMatrix3(e),this.setXY(t,No.x,No.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Yt.fromBufferAttribute(this,t),Yt.applyMatrix3(e),this.setXYZ(t,Yt.x,Yt.y,Yt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Yt.fromBufferAttribute(this,t),Yt.applyMatrix4(e),this.setXYZ(t,Yt.x,Yt.y,Yt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Yt.fromBufferAttribute(this,t),Yt.applyNormalMatrix(e),this.setXYZ(t,Yt.x,Yt.y,Yt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Yt.fromBufferAttribute(this,t),Yt.transformDirection(e),this.setXYZ(t,Yt.x,Yt.y,Yt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),s=this._normalize(s)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),s=this._normalize(s),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(e){let t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):mh(e,this.array)}_normalize(e){let t=this._normalizationScale;return t!==void 0?Math.round(e*t):gh(e,this.array)}};var Dr=class extends Lt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Nr=class extends Lt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var ze=class extends Lt{constructor(e,t,n){super(new Float32Array(e),t,n)}},S0=new ni,dr=new C,vc=new C,ii=class{constructor(e=new C,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):S0.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;dr.subVectors(e,this.center);let t=dr.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(dr,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(vc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(dr.copy(e.center).add(vc)),this.expandByPoint(dr.copy(e.center).sub(vc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},E0=0,Fn=new je,yc=new jt,Rs=new C,Cn=new ni,fr=new ni,sn=new C,xt=class i extends ti{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:E0++}),this.uuid=Ri(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Zf(e)?Nr:Dr)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Ye().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Fn.makeRotationFromQuaternion(e),this.applyMatrix4(Fn),this}rotateX(e){return Fn.makeRotationX(e),this.applyMatrix4(Fn),this}rotateY(e){return Fn.makeRotationY(e),this.applyMatrix4(Fn),this}rotateZ(e){return Fn.makeRotationZ(e),this.applyMatrix4(Fn),this}translate(e,t,n){return Fn.makeTranslation(e,t,n),this.applyMatrix4(Fn),this}scale(e,t,n){return Fn.makeScale(e,t,n),this.applyMatrix4(Fn),this}lookAt(e){return yc.lookAt(e),yc.updateMatrix(),this.applyMatrix4(yc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Rs).negate(),this.translate(Rs.x,Rs.y,Rs.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new ze(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Ge("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ni);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){We("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];Cn.setFromBufferAttribute(r),this.morphTargetsRelative?(sn.addVectors(this.boundingBox.min,Cn.min),this.boundingBox.expandByPoint(sn),sn.addVectors(this.boundingBox.max,Cn.max),this.boundingBox.expandByPoint(sn)):(this.boundingBox.expandByPoint(Cn.min),this.boundingBox.expandByPoint(Cn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&We('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ii);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){We("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(e){let n=this.boundingSphere.center;if(Cn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];fr.setFromBufferAttribute(a),this.morphTargetsRelative?(sn.addVectors(Cn.min,fr.min),Cn.expandByPoint(sn),sn.addVectors(Cn.max,fr.max),Cn.expandByPoint(sn)):(Cn.expandByPoint(fr.min),Cn.expandByPoint(fr.max))}Cn.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)sn.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(sn));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)sn.fromBufferAttribute(a,c),l&&(Rs.fromBufferAttribute(e,c),sn.add(Rs)),s=Math.max(s,n.distanceToSquared(sn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&We('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){We("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==n.count)&&(o=new Lt(new Float32Array(4*n.count),4),this.setAttribute("tangent",o));let a=[],l=[],c=new Uint8Array(n.count);for(let P=0;P<n.count;P++)a[P]=new C,l[P]=new C;let h=new C,u=new C,d=new C,p=new ee,f=new ee,_=new ee,m=new C,g=new C;function v(P,A,I){c[P]=c[A]=c[I]=1,h.fromBufferAttribute(n,P),u.fromBufferAttribute(n,A),d.fromBufferAttribute(n,I),p.fromBufferAttribute(r,P),f.fromBufferAttribute(r,A),_.fromBufferAttribute(r,I),u.sub(h),d.sub(h),f.sub(p),_.sub(p);let N=1/(f.x*_.y-_.x*f.y);isFinite(N)&&(m.copy(u).multiplyScalar(_.y).addScaledVector(d,-f.y).multiplyScalar(N),g.copy(d).multiplyScalar(f.x).addScaledVector(u,-_.x).multiplyScalar(N),a[P].add(m),a[A].add(m),a[I].add(m),l[P].add(g),l[A].add(g),l[I].add(g))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let P=0,A=M.length;P<A;++P){let I=M[P],N=I.start,O=I.count;for(let L=N,G=N+O;L<G;L+=3)v(e.getX(L+0),e.getX(L+1),e.getX(L+2))}let y=new C,w=new C,b=new C,x=new C;function E(P){b.fromBufferAttribute(s,P),x.copy(b);let A=a[P];y.copy(A),y.sub(b.multiplyScalar(b.dot(A))).normalize(),w.crossVectors(x,A);let N=w.dot(l[P])<0?-1:1;o.setXYZW(P,y.x,y.y,y.z,N)}for(let P=0,A=n.count;P<A;++P)c[P]&&E(P);this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Lt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);let s=new C,r=new C,o=new C,a=new C,l=new C,c=new C,h=new C,u=new C;if(e)for(let d=0,p=e.count;d<p;d+=3){let f=e.getX(d+0),_=e.getX(d+1),m=e.getX(d+2);s.fromBufferAttribute(t,f),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,f),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(f,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,p=t.count;d<p;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)sn.fromBufferAttribute(e,t),sn.normalize(),e.setXYZ(t,sn.x,sn.y,sn.z)}toNonIndexed(){function e(a,l){let c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h),p=0,f=0;for(let _=0,m=l.length;_<m;_++){a.isInterleavedBufferAttribute?p=l[_]*a.data.stride+a.offset:p=l[_]*h;for(let g=0;g<h;g++)d[f++]=c[p++]}return new Lt(d,h,u)}if(this.index===null)return Ge("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=e(l,n);t.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){let d=c[h],p=e(d,n);l.push(p)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let p=c[u];h.push(p.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],u=r[c];for(let d=0,p=u.length;d<p;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ur=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=uh,this.updateRanges=[],this.version=0,this.uuid=Ri()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});let t=Mu(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=this.array.slice(0).buffer);let n=new this.array.constructor(e.arrayBuffers[t]),s=new this.constructor(n,this.stride);return s.setUsage(this.usage),s}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});let t=Mu(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=Array.from(new Uint32Array(this.array.slice(0).buffer)));let n={uuid:this.uuid,buffer:t,type:this.array.constructor.name,stride:this.stride};return n.usage=this.usage,n}};function Mu(i){return i.buffer._uuid===void 0&&(i.buffer._uuid=Ri()),i.byteOffset===0&&i.byteLength===i.buffer.byteLength?i.buffer._uuid:i.buffer._uuid+":"+i.byteOffset+":"+i.byteLength}var vn=new C,Ws=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s,this._normalizationScale=e!==void 0?Il(e.array):void 0}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)vn.fromBufferAttribute(this,t),vn.applyMatrix4(e),this.setXYZ(t,vn.x,vn.y,vn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)vn.fromBufferAttribute(this,t),vn.applyNormalMatrix(e),this.setXYZ(t,vn.x,vn.y,vn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)vn.fromBufferAttribute(this,t),vn.transformDirection(e),this.setXYZ(t,vn.x,vn.y,vn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=this._denormalize(t)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=this._denormalize(t)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=this._denormalize(t)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=this._denormalize(t)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n),s=this._normalize(s)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n),s=this._normalize(s),r=this._normalize(r)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){Cr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Lt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Cr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}_denormalize(e){let t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):mh(e,this.data.array)}_normalize(e){let t=this._normalizationScale;return t!==void 0?Math.round(e*t):gh(e,this.data.array)}},Mc=new C,b0=new C,T0=new Ye,Xn=class{constructor(e=new C(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=Mc.subVectors(n,t).cross(b0.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let s=e.delta(Mc),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let o=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(o<0||o>1)?null:t.copy(e.start).addScaledVector(s,o)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||T0.getNormalMatrix(e),s=this.coplanarPoint(Mc).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},w0=0,Yn=class extends ti{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:w0++}),this.uuid=Ri(),this.name="",this.type="Material",this.blending=er,this.side=Wi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Xc,this.blendDst=qc,this.blendEquation=hs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Pe(0,0,0),this.blendAlpha=0,this.depthFunc=Bs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=_d,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ra,this.stencilZFail=ra,this.stencilZPass=ra,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Ge(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Ge(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(n.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(n.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Pe().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new Xn().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new ee().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ee().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},Xs=class extends Yn{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Pe(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Cs,pr=new C,Is=new C,Ps=new C,Ls=new ee,mr=new ee,Cd=new je,Uo=new C,gr=new C,Fo=new C,Su=new ee,Sc=new ee,Eu=new ee,Fr=class extends jt{constructor(e=new Xs){if(super(),this.isSprite=!0,this.type="Sprite",Cs===void 0){Cs=new xt;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Ur(t,5);Cs.setIndex([0,1,2,0,2,3]),Cs.setAttribute("position",new Ws(n,3,0,!1)),Cs.setAttribute("uv",new Ws(n,2,3,!1))}this.geometry=Cs,this.material=e,this.center=new ee(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&We('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Is.setFromMatrixScale(this.matrixWorld),Cd.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Ps.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Is.multiplyScalar(-Ps.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let o=this.center;Oo(Uo.set(-.5,-.5,0),Ps,o,Is,s,r),Oo(gr.set(.5,-.5,0),Ps,o,Is,s,r),Oo(Fo.set(.5,.5,0),Ps,o,Is,s,r),Su.set(0,0),Sc.set(1,0),Eu.set(1,1);let a=e.ray.intersectTriangle(Uo,gr,Fo,!1,pr);if(a===null&&(Oo(gr.set(-.5,.5,0),Ps,o,Is,s,r),Sc.set(0,1),a=e.ray.intersectTriangle(Uo,Fo,gr,!1,pr),a===null))return;let l=e.ray.origin.distanceTo(pr);l<e.near||l>e.far||t.push({distance:l,point:pr.clone(),uv:_i.getInterpolation(pr,Uo,gr,Fo,Su,Sc,Eu,new ee),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}toJSON(e){let t=super.toJSON(e);return t.object.center=this.center.toArray(),t}};function Oo(i,e,t,n,s,r){Ls.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(mr.x=r*Ls.x-s*Ls.y,mr.y=s*Ls.x+r*Ls.y):mr.copy(Ls),i.copy(e),i.x+=mr.x,i.y+=mr.y,i.applyMatrix4(Cd)}var xi=new C,Ec=new C,Bo=new C,zo=new C,qs=class{constructor(e=new C,t=new C(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,xi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=xi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(xi.copy(this.origin).addScaledVector(this.direction,t),xi.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Ec.copy(e).add(t).multiplyScalar(.5),Bo.copy(t).sub(e).normalize(),zo.copy(this.origin).sub(Ec);let r=e.distanceTo(t)*.5,o=-this.direction.dot(Bo),a=zo.dot(this.direction),l=-zo.dot(Bo),c=zo.lengthSq(),h=Math.abs(1-o*o),u,d,p,f;if(h>0)if(u=o*l-a,d=o*a-l,f=r*h,u>=0)if(d>=-f)if(d<=f){let _=1/h;u*=_,d*=_,p=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=r,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*l)+c;else d<=-f?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-l),r),p=-u*u+d*(d+2*l)+c):d<=f?(u=0,d=Math.min(Math.max(-r,-l),r),p=d*(d+2*l)+c):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-l),r),p=-u*u+d*(d+2*l)+c);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Ec).addScaledVector(Bo,d),p}intersectSphere(e,t){if(e.radius<0)return null;xi.subVectors(e.center,this.origin);let n=xi.dot(this.direction),s=xi.dot(xi)-n*n,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,o=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,o=(e.min.y-d.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(a=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,xi)!==null}intersectTriangle(e,t,n,s,r){let o=this.origin,a=this.direction,l=a.x,c=a.y,h=a.z,u=e.x-o.x,d=e.y-o.y,p=e.z-o.z,f=t.x-o.x,_=t.y-o.y,m=t.z-o.z,g=n.x-o.x,v=n.y-o.y,M=n.z-o.z,y=Math.abs(l),w=Math.abs(c),b=Math.abs(h),x,E,P,A,I,N,O,L,G,X,k,ne;if(y>=w&&y>=b?(P=l,N=u,G=f,ne=g,l>=0?(x=c,E=h,A=d,I=p,O=_,L=m,X=v,k=M):(x=h,E=c,A=p,I=d,O=m,L=_,X=M,k=v)):w>=b?(P=c,N=d,G=_,ne=v,c>=0?(x=h,E=l,A=p,I=u,O=m,L=f,X=M,k=g):(x=l,E=h,A=u,I=p,O=f,L=m,X=g,k=M)):(P=h,N=p,G=m,ne=M,h>=0?(x=l,E=c,A=u,I=d,O=f,L=_,X=g,k=v):(x=c,E=l,A=d,I=u,O=_,L=f,X=v,k=g)),P===0)return null;let W=x/P,$=E/P,te=1/P,Te=A-W*N,He=I-$*N,Y=O-W*G,_e=L-$*G,we=X-W*ne,Fe=k-$*ne,ve=we*_e-Fe*Y,Oe=Te*Fe-He*we,Ct=Y*He-_e*Te;if(s){if(ve<0||Oe<0||Ct<0)return null}else if((ve<0||Oe<0||Ct<0)&&(ve>0||Oe>0||Ct>0))return null;let ke=ve+Oe+Ct;if(ke===0)return null;let tt=te*(ve*N+Oe*G+Ct*ne);return(ke>0?tt<0:tt>0)?null:this.at(tt/ke,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Zn=class extends Yn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Pe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new qn,this.combine=Yc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},bu=new je,ns=new qs,Ho=new ii,Tu=new C,Go=new C,ko=new C,Vo=new C,bc=new C,Wo=new C,wu=new C,Xo=new C,ie=class extends jt{constructor(e=new xt,t=new Zn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){Wo.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],u=r[l];h!==0&&(bc.fromBufferAttribute(u,e),o?Wo.addScaledVector(bc,h):Wo.addScaledVector(bc.sub(t),h))}t.add(Wo)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ho.copy(n.boundingSphere),Ho.applyMatrix4(r),ns.copy(e.ray).recast(e.near),!(Ho.containsPoint(ns.origin)===!1&&(ns.intersectSphere(Ho,Tu)===null||ns.origin.distanceToSquared(Tu)>(e.far-e.near)**2))&&(bu.copy(r).invert(),ns.copy(e.ray).applyMatrix4(bu),!(n.boundingBox!==null&&ns.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,ns)))}_computeIntersections(e,t,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let f=0,_=d.length;f<_;f++){let m=d[f],g=o[m.materialIndex],v=Math.max(m.start,p.start),M=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let y=v,w=M;y<w;y+=3){let b=a.getX(y),x=a.getX(y+1),E=a.getX(y+2);s=qo(this,g,e,n,c,h,u,b,x,E),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let f=Math.max(0,p.start),_=Math.min(a.count,p.start+p.count);for(let m=f,g=_;m<g;m+=3){let v=a.getX(m),M=a.getX(m+1),y=a.getX(m+2);s=qo(this,o,e,n,c,h,u,v,M,y),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let f=0,_=d.length;f<_;f++){let m=d[f],g=o[m.materialIndex],v=Math.max(m.start,p.start),M=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let y=v,w=M;y<w;y+=3){let b=y,x=y+1,E=y+2;s=qo(this,g,e,n,c,h,u,b,x,E),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let f=Math.max(0,p.start),_=Math.min(l.count,p.start+p.count);for(let m=f,g=_;m<g;m+=3){let v=m,M=m+1,y=m+2;s=qo(this,o,e,n,c,h,u,v,M,y),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}};function A0(i,e,t,n,s,r,o,a){let l;if(e.side===cn?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,e.side===Wi,a),l===null)return null;Xo.copy(a),Xo.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(Xo);return c<t.near||c>t.far?null:{distance:c,point:Xo.clone(),object:i}}function qo(i,e,t,n,s,r,o,a,l,c){i.getVertexPosition(a,Go),i.getVertexPosition(l,ko),i.getVertexPosition(c,Vo);let h=A0(i,e,t,n,Go,ko,Vo,wu);if(h){let u=new C;_i.getBarycoord(wu,Go,ko,Vo,u),s&&(h.uv=_i.getInterpolatedAttribute(s,a,l,c,u,new ee)),r&&(h.uv1=_i.getInterpolatedAttribute(r,a,l,c,u,new ee)),o&&(h.normal=_i.getInterpolatedAttribute(o,a,l,c,u,new C),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:l,c,normal:new C,materialIndex:0};_i.getNormal(Go,ko,Vo,d.normal),h.face=d,h.barycoord=u}return h}var Mi=class extends yn{constructor(e=null,t=1,n=1,s,r,o,a,l,c=rn,h=rn,u,d){super(null,o,a,l,c,h,s,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Si=class extends Lt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Ds=new je,Au=new je,Yo=[],Ru=new ni,R0=new je,xr=new ie,_r=new ii,yt=class extends ie{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Si(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,R0)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new ni),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ds),Ru.copy(e.boundingBox).applyMatrix4(Ds),this.boundingBox.union(Ru)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new ii),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ds),_r.copy(e.boundingSphere).applyMatrix4(Ds),this.boundingSphere.union(_r)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),this.morphTexture=e.morphTexture!==null?e.morphTexture.clone():null,this.instanceColor=e.instanceColor!==null?e.instanceColor.clone():null,this.count=e.count,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(xr.geometry=this.geometry,xr.material=this.material,xr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),_r.copy(this.boundingSphere),_r.applyMatrix4(n),e.ray.intersectsSphere(_r)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ds),Au.multiplyMatrices(n,Ds),xr.matrixWorld=Au,xr.raycast(e,Yo);for(let o=0,a=Yo.length;o<a;o++){let l=Yo[o];l.instanceId=r,l.object=this,t.push(l)}Yo.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Si(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Mi(new Float32Array(s*this.count),s,this.count,Ja,Tn));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=s*e;return r[l]=a,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},is=new ii,C0=new ee(.5,.5),Zo=new C,Hi=class{constructor(e=new Xn,t=new Xn,n=new Xn,s=new Xn,r=new Xn,o=new Xn){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=On,n=!1){let s=this.planes,r=e.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],p=r[7],f=r[8],_=r[9],m=r[10],g=r[11],v=r[12],M=r[13],y=r[14],w=r[15];if(s[0].setComponents(c-o,p-h,g-f,w-v).normalize(),s[1].setComponents(c+o,p+h,g+f,w+v).normalize(),s[2].setComponents(c+a,p+u,g+_,w+M).normalize(),s[3].setComponents(c-a,p-u,g-_,w-M).normalize(),n)s[4].setComponents(l,d,m,y).normalize(),s[5].setComponents(c-l,p-d,g-m,w-y).normalize();else if(s[4].setComponents(c-l,p-d,g-m,w-y).normalize(),t===On)s[5].setComponents(c+l,p+d,g+m,w+y).normalize();else if(t===zs)s[5].setComponents(l,d,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),is.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),is.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(is)}intersectsSprite(e){is.center.set(0,0,0);let t=C0.distanceTo(e.center);return is.radius=.7071067811865476+t,is.applyMatrix4(e.matrixWorld),this.intersectsSphere(is)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(Zo.x=s.normal.x>0?e.max.x:e.min.x,Zo.y=s.normal.y>0?e.max.y:e.min.y,Zo.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Zo)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Cu=new je,_a=class i{constructor(){this.coordinateSystem=On,this._frustums=[],this._count=0}setFromArrayCamera(e){let t=e.cameras,n=this._frustums;for(let s=0;s<t.length;s++){let r=t[s];Cu.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[s]===void 0&&(n[s]=new Hi),n[s].setFromProjectionMatrix(Cu,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsObject(e))return!0;return!1}intersectsSprite(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSprite(e))return!0;return!1}intersectsSphere(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSphere(e))return!0;return!1}intersectsBox(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsBox(e))return!0;return!1}containsPoint(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;let t=this._frustums,n=e._frustums;for(let s=0;s<e._count;s++)t[s]===void 0&&(t[s]=new Hi),t[s].copy(n[s]);return this._count=e._count,this}clone(){return new i().copy(this)}};var va=class extends Yn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Pe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},ya=new C,Ma=new C,Iu=new je,vr=new qs,Jo=new ii,Tc=new C,Pu=new C,Or=class extends jt{constructor(e=new xt,t=new va){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)ya.fromBufferAttribute(t,s-1),Ma.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=ya.distanceTo(Ma);e.setAttribute("lineDistance",new ze(n,1))}else Ge("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Jo.copy(n.boundingSphere),Jo.applyMatrix4(s),Jo.radius+=r,e.ray.intersectsSphere(Jo)===!1)return;Iu.copy(s).invert(),vr.copy(e.ray).applyMatrix4(Iu);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){let p=Math.max(0,o.start),f=Math.min(h.count,o.start+o.count);for(let _=p,m=f-1;_<m;_+=c){let g=h.getX(_),v=h.getX(_+1),M=Ko(this,e,vr,l,g,v,_);M&&t.push(M)}if(this.isLineLoop){let _=h.getX(f-1),m=h.getX(p),g=Ko(this,e,vr,l,_,m,f-1);g&&t.push(g)}}else{let p=Math.max(0,o.start),f=Math.min(d.count,o.start+o.count);for(let _=p,m=f-1;_<m;_+=c){let g=Ko(this,e,vr,l,_,_+1,_);g&&t.push(g)}if(this.isLineLoop){let _=Ko(this,e,vr,l,f-1,p,f-1);_&&t.push(_)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Ko(i,e,t,n,s,r,o){let a=i.geometry.attributes.position;if(ya.fromBufferAttribute(a,s),Ma.fromBufferAttribute(a,r),t.distanceSqToSegment(ya,Ma,Tc,Pu)>n)return;Tc.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(Tc);if(!(c<e.near||c>e.far))return{distance:c,point:Pu.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}var Ys=class extends Yn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Pe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Lu=new je,Nc=new qs,$o=new ii,jo=new C,Br=class extends jt{constructor(e=new xt,t=new Ys){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),$o.copy(n.boundingSphere),$o.applyMatrix4(s),$o.radius+=r,e.ray.intersectsSphere($o)===!1)return;Lu.copy(s).invert(),Nc.copy(e.ray).applyMatrix4(Lu);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,u=n.attributes.position;if(c!==null){let d=Math.max(0,o.start),p=Math.min(c.count,o.start+o.count);for(let f=d,_=p;f<_;f++){let m=c.getX(f);jo.fromBufferAttribute(u,m),Du(jo,m,l,s,e,t,this)}}else{let d=Math.max(0,o.start),p=Math.min(u.count,o.start+o.count);for(let f=d,_=p;f<_;f++)jo.fromBufferAttribute(u,f),Du(jo,f,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Du(i,e,t,n,s,r,o){let a=Nc.distanceSqToPoint(i);if(a<t){let l=new C;Nc.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var zr=class extends yn{constructor(e=[],t=us,n,s,r,o,a,l,c,h){super(e,t,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},si=class extends yn{constructor(e,t,n,s,r,o,a,l,c){super(e,t,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Ei=class extends yn{constructor(e,t,n=Jn,s,r,o,a=rn,l=rn,c,h=yi,u=1){if(h!==yi&&h!==wi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:e,height:t,depth:u};super(d,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new ks(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Hr=class extends Ei{constructor(e,t=Jn,n=us,s,r,o=rn,a=rn,l,c=yi){let h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,n,s,r,o,a,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Gr=class extends yn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Xe=class i extends xt{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],u=[],d=0,p=0;f("z","y","x",-1,-1,n,t,e,o,r,0),f("z","y","x",1,-1,n,t,-e,o,r,1),f("x","z","y",1,1,e,n,t,s,o,2),f("x","z","y",1,-1,e,n,-t,s,o,3),f("x","y","z",1,-1,e,t,n,s,r,4),f("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new ze(c,3)),this.setAttribute("normal",new ze(h,3)),this.setAttribute("uv",new ze(u,2));function f(_,m,g,v,M,y,w,b,x,E,P){let A=y/x,I=w/E,N=y/2,O=w/2,L=b/2,G=x+1,X=E+1,k=0,ne=0,W=new C;for(let $=0;$<X;$++){let te=$*I-O;for(let Te=0;Te<G;Te++){let He=Te*A-N;W[_]=He*v,W[m]=te*M,W[g]=L,c.push(W.x,W.y,W.z),W[_]=0,W[m]=0,W[g]=b>0?1:-1,h.push(W.x,W.y,W.z),u.push(Te/x),u.push(1-$/E),k+=1}}for(let $=0;$<E;$++)for(let te=0;te<x;te++){let Te=d+te+G*$,He=d+te+G*($+1),Y=d+(te+1)+G*($+1),_e=d+(te+1)+G*$;l.push(Te,He,_e),l.push(He,Y,_e),ne+=6}a.addGroup(p,ne,P),p+=ne,d+=k}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}},Mn=class i extends xt{constructor(e=1,t=1,n=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:n,radialSegments:s,heightSegments:r},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));let o=[],a=[],l=[],c=[],h=t/2,u=Math.PI/2*e,d=t,p=2*u+d,f=n*2+r,_=s+1,m=new C,g=new C;for(let v=0;v<=f;v++){let M=0,y=0,w=0,b=0;if(v<=n){let P=v/n,A=P*Math.PI/2;y=-h-e*Math.cos(A),w=e*Math.sin(A),b=-e*Math.cos(A),M=P*u}else if(v<=n+r){let P=(v-n)/r;y=-h+P*t,w=e,b=0,M=u+P*d}else{let P=(v-n-r)/n,A=P*Math.PI/2;y=h+e*Math.sin(A),w=e*Math.cos(A),b=e*Math.sin(A),M=u+d+P*u}let x=Math.max(0,Math.min(1,M/p)),E=0;v===0?E=.5/s:v===f&&(E=-.5/s);for(let P=0;P<=s;P++){let A=P/s,I=A*Math.PI*2,N=Math.sin(I),O=Math.cos(I);g.x=-w*O,g.y=y,g.z=w*N,a.push(g.x,g.y,g.z),m.set(-w*O,b,w*N),m.normalize(),l.push(m.x,m.y,m.z),c.push(A+E,x)}if(v>0){let P=(v-1)*_;for(let A=0;A<s;A++){let I=P+A,N=P+A+1,O=v*_+A,L=v*_+A+1;o.push(I,N,O),o.push(N,L,O)}}}this.setIndex(o),this.setAttribute("position",new ze(a,3)),this.setAttribute("normal",new ze(l,3)),this.setAttribute("uv",new ze(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}},bi=class i extends xt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);let r=[],o=[],a=[],l=[],c=new C,h=new ee;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){let p=n+u/t*s;c.x=e*Math.cos(p),c.y=e*Math.sin(p),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[d]/e+1)/2,h.y=(o[d+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new ze(o,3)),this.setAttribute("normal",new ze(a,3)),this.setAttribute("uv",new ze(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.segments,e.thetaStart,e.thetaLength)}},Ue=class i extends xt{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],d=[],p=[],f=0,_=[],m=n/2,g=0;v(),o===!1&&(e>0&&M(!0),t>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new ze(u,3)),this.setAttribute("normal",new ze(d,3)),this.setAttribute("uv",new ze(p,2));function v(){let y=new C,w=new C,b=0,x=(t-e)/n;for(let E=0;E<=r;E++){let P=[],A=E/r,I=A*(t-e)+e;for(let N=0;N<=s;N++){let O=N/s,L=O*l+a,G=Math.sin(L),X=Math.cos(L);w.x=I*G,w.y=-A*n+m,w.z=I*X,u.push(w.x,w.y,w.z),y.set(G,x,X).normalize(),d.push(y.x,y.y,y.z),p.push(O,1-A),P.push(f++)}_.push(P)}for(let E=0;E<s;E++)for(let P=0;P<r;P++){let A=_[P][E],I=_[P+1][E],N=_[P+1][E+1],O=_[P][E+1];(e>0||P!==0)&&(h.push(A,I,O),b+=3),(t>0||P!==r-1)&&(h.push(I,N,O),b+=3)}c.addGroup(g,b,0),g+=b}function M(y){let w=f,b=new ee,x=new C,E=0,P=y===!0?e:t,A=y===!0?1:-1;for(let N=1;N<=s;N++)u.push(0,m*A,0),d.push(0,A,0),p.push(.5,.5),f++;let I=f;for(let N=0;N<=s;N++){let L=N/s*l+a,G=Math.cos(L),X=Math.sin(L);x.x=P*X,x.y=m*A,x.z=P*G,u.push(x.x,x.y,x.z),d.push(0,A,0),b.x=G*.5+.5,b.y=X*.5*A+.5,p.push(b.x,b.y),f++}for(let N=0;N<s;N++){let O=w+N,L=I+N;y===!0?h.push(L,L+1,O):h.push(L+1,L,O),E+=3}c.addGroup(g,E,y===!0?1:2),g+=E}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},En=class i extends Ue{constructor(e=1,t=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Sa=class i extends xt{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],o=[];a(s),c(n),h(),this.setAttribute("position",new ze(r,3)),this.setAttribute("normal",new ze(r.slice(),3)),this.setAttribute("uv",new ze(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(v){let M=new C,y=new C,w=new C;for(let b=0;b<t.length;b+=3)p(t[b+0],M),p(t[b+1],y),p(t[b+2],w),l(M,y,w,v)}function l(v,M,y,w){let b=w+1,x=[];for(let E=0;E<=b;E++){x[E]=[];let P=v.clone().lerp(y,E/b),A=M.clone().lerp(y,E/b),I=b-E;for(let N=0;N<=I;N++)N===0&&E===b?x[E][N]=P:x[E][N]=P.clone().lerp(A,N/I)}for(let E=0;E<b;E++)for(let P=0;P<2*(b-E)-1;P++){let A=Math.floor(P/2);P%2===0?(d(x[E][A+1]),d(x[E+1][A]),d(x[E][A])):(d(x[E][A+1]),d(x[E+1][A+1]),d(x[E+1][A]))}}function c(v){let M=new C;for(let y=0;y<r.length;y+=3)M.x=r[y+0],M.y=r[y+1],M.z=r[y+2],M.normalize().multiplyScalar(v),r[y+0]=M.x,r[y+1]=M.y,r[y+2]=M.z}function h(){let v=new C;for(let M=0;M<r.length;M+=3){v.x=r[M+0],v.y=r[M+1],v.z=r[M+2];let y=m(v)/2/Math.PI+.5,w=g(v)/Math.PI+.5;o.push(y,1-w)}f(),u()}function u(){for(let v=0;v<o.length;v+=6){let M=o[v+0],y=o[v+2],w=o[v+4],b=Math.max(M,y,w),x=Math.min(M,y,w);b>.9&&x<.1&&(M<.2&&(o[v+0]+=1),y<.2&&(o[v+2]+=1),w<.2&&(o[v+4]+=1))}}function d(v){r.push(v.x,v.y,v.z)}function p(v,M){let y=v*3;M.x=e[y+0],M.y=e[y+1],M.z=e[y+2]}function f(){let v=new C,M=new C,y=new C,w=new C,b=new ee,x=new ee,E=new ee;for(let P=0,A=0;P<r.length;P+=9,A+=6){v.set(r[P+0],r[P+1],r[P+2]),M.set(r[P+3],r[P+4],r[P+5]),y.set(r[P+6],r[P+7],r[P+8]),b.set(o[A+0],o[A+1]),x.set(o[A+2],o[A+3]),E.set(o[A+4],o[A+5]),w.copy(v).add(M).add(y).divideScalar(3);let I=m(w);_(b,A+0,v,I),_(x,A+2,M,I),_(E,A+4,y,I)}}function _(v,M,y,w){w<0&&v.x===1&&(o[M]=v.x-1),y.x===0&&y.z===0&&(o[M]=w/2/Math.PI+.5)}function m(v){return Math.atan2(v.z,-v.x)}function g(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.detail)}};var In=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Ge("Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,o;t?o=t:o=e*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);let h=n[s],d=n[s+1]-h,p=(o-h)/d;return(s+p)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),l=t||(o.isVector2?new ee:new C);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new C,s=[],r=[],o=[],a=new C,l=new je;for(let p=0;p<=e;p++){let f=p/e;s[p]=this.getTangentAt(f,new C)}r[0]=new C,o[0]=new C;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),o[p]=o[p-1].clone(),a.crossVectors(s[p-1],s[p]),a.length()>Number.EPSILON){a.normalize();let f=Math.acos(nt(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(l.makeRotationAxis(a,f))}o[p].crossVectors(s[p],r[p])}if(t===!0){let p=Math.acos(nt(r[0].dot(r[e]),-1,1));p/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(p=-p);for(let f=1;f<=e;f++)r[f].applyMatrix4(l.makeRotationAxis(s[f],p*f)),o[f].crossVectors(s[f],r[f])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}},Zs=class extends In{constructor(e=0,t=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new ee){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,p=c-this.aY;l=d*h-p*u+this.aX,c=d*u+p*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Ea=class extends Zs{constructor(e,t,n,s,r,o){super(e,t,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function xh(){let i=0,e=0,t=0,n=0;function s(r,o,a,l){i=r,e=a,t=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let d=(o-r)/c-(a-r)/(c+h)+(a-o)/h,p=(a-o)/h-(l-o)/(h+u)+(l-a)/u;d*=h,p*=h,s(o,a,d,p)},calc:function(r){let o=r*r,a=o*r;return i+e*r+t*o+n*a}}}var Nu=new C,Uu=new C,wc=new xh,Ac=new xh,Rc=new xh,ri=class extends In{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new C){let n=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(Uu.subVectors(s[0],s[1]).add(s[0]),c=Uu);let u=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(Nu.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Nu),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,f=Math.pow(c.distanceToSquared(u),p),_=Math.pow(u.distanceToSquared(d),p),m=Math.pow(d.distanceToSquared(h),p);_<1e-4&&(_=1),f<1e-4&&(f=_),m<1e-4&&(m=_),wc.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,f,_,m),Ac.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,f,_,m),Rc.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,f,_,m)}else this.curveType==="catmullrom"&&(wc.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),Ac.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),Rc.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(wc.calc(l),Ac.calc(l),Rc.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new C().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Fu(i,e,t,n,s){let r=(n-e)*.5,o=(s-t)*.5,a=i*i,l=i*a;return(2*t-2*n+r+o)*l+(-3*t+3*n-2*r-o)*a+r*i+t}function I0(i,e){let t=1-i;return t*t*e}function P0(i,e){return 2*(1-i)*i*e}function L0(i,e){return i*i*e}function br(i,e,t,n){return I0(i,e)+P0(i,t)+L0(i,n)}function D0(i,e){let t=1-i;return t*t*t*e}function N0(i,e){let t=1-i;return 3*t*t*i*e}function U0(i,e){return 3*(1-i)*i*i*e}function F0(i,e){return i*i*i*e}function Tr(i,e,t,n,s){return D0(i,e)+N0(i,t)+U0(i,n)+F0(i,s)}var kr=class extends In{constructor(e=new ee,t=new ee,n=new ee,s=new ee){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new ee){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Tr(e,s.x,r.x,o.x,a.x),Tr(e,s.y,r.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},ba=class extends In{constructor(e=new C,t=new C,n=new C,s=new C){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new C){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Tr(e,s.x,r.x,o.x,a.x),Tr(e,s.y,r.y,o.y,a.y),Tr(e,s.z,r.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Vr=class extends In{constructor(e=new ee,t=new ee){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ee){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ee){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ta=class extends In{constructor(e=new C,t=new C){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new C){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new C){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Wr=class extends In{constructor(e=new ee,t=new ee,n=new ee){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new ee){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(br(e,s.x,r.x,o.x),br(e,s.y,r.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},as=class extends In{constructor(e=new C,t=new C,n=new C){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new C){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(br(e,s.x,r.x,o.x),br(e,s.y,r.y,o.y),br(e,s.z,r.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Xr=class extends In{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ee){let n=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(Fu(a,l.x,c.x,h.x,u.x),Fu(a,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new ee().fromArray(s))}return this}},wa=Object.freeze({__proto__:null,ArcCurve:Ea,CatmullRomCurve3:ri,CubicBezierCurve:kr,CubicBezierCurve3:ba,EllipseCurve:Zs,LineCurve:Vr,LineCurve3:Ta,QuadraticBezierCurve:Wr,QuadraticBezierCurve3:as,SplineCurve:Xr}),Aa=class extends In{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1,this.cacheLengths=null}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new wa[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this.cacheLengths=null,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new wa[s.type]().fromJSON(s))}return this.cacheLengths=null,this}},qr=class extends Aa{constructor(e){super(),this.type="Path",this.currentPoint=new ee,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Vr(this.currentPoint.clone(),new ee(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new Wr(this.currentPoint.clone(),new ee(e,t),new ee(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,o){let a=new kr(this.currentPoint.clone(),new ee(e,t),new ee(n,s),new ee(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new Xr(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,n,s,r,o),this}absarc(e,t,n,s,r,o){return this.absellipse(e,t,n,n,s,r,o),this}ellipse(e,t,n,s,r,o,a,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,s,r,o,a,l),this}absellipse(e,t,n,s,r,o,a,l){let c=new Zs(e,t,n,s,r,o,a,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},Js=class extends qr{constructor(e){super(e),this.uuid=Ri(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new qr().fromJSON(s))}return this}};function O0(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=Id(i,0,s,t,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c;if(n&&(r=k0(i,e,r,t)),i.length>80*t){a=i[0],l=i[1];let h=a,u=l;for(let d=t;d<s;d+=t){let p=i[d],f=i[d+1];p<a&&(a=p),f<l&&(l=f),p>h&&(h=p),f>u&&(u=f)}c=Math.max(h-a,u-l),c=c!==0?32767/c:0}return Yr(r,o,t,a,l,c,0),o}function Id(i,e,t,n,s){let r;if(s===Q0(i,e,t,n)>0)for(let o=e;o<t;o+=n)r=Ou(o/n|0,i[o],i[o+1],r);else for(let o=t-n;o>=e;o-=n)r=Ou(o/n|0,i[o],i[o+1],r);return r&&Ks(r,r.next)&&(Jr(r),r=r.next),r}function ls(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(Ks(t,t.next)||Ut(t.prev,t,t.next)===0)){if(Jr(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Yr(i,e,t,n,s,r,o){if(!i)return;!o&&r&&Y0(i,n,s,r);let a=i;for(;i.prev!==i.next;){let l=i.prev,c=i.next;if(r?z0(i,n,s,r):B0(i)){e.push(l.i,i.i,c.i),Jr(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=H0(ls(i),e),Yr(i,e,t,n,s,r,2)):o===2&&G0(i,e,t,n,s,r):Yr(ls(i),e,t,n,s,r,1);break}}}function B0(i){let e=i.prev,t=i,n=i.next;if(Ut(e,t,n)>=0)return!1;let s=e.x,r=t.x,o=n.x,a=e.y,l=t.y,c=n.y,h=Math.min(s,r,o),u=Math.min(a,l,c),d=Math.max(s,r,o),p=Math.max(a,l,c),f=n.next;for(;f!==e;){if(f.x>=h&&f.x<=d&&f.y>=u&&f.y<=p&&yr(s,a,r,l,o,c,f.x,f.y)&&Ut(f.prev,f,f.next)>=0)return!1;f=f.next}return!0}function z0(i,e,t,n){let s=i.prev,r=i,o=i.next;if(Ut(s,r,o)>=0)return!1;let a=s.x,l=r.x,c=o.x,h=s.y,u=r.y,d=o.y,p=Math.min(a,l,c),f=Math.min(h,u,d),_=Math.max(a,l,c),m=Math.max(h,u,d),g=Uc(p,f,e,t,n),v=Uc(_,m,e,t,n),M=i.prevZ,y=i.nextZ;for(;M&&M.z>=g&&y&&y.z<=v;){if(M.x>=p&&M.x<=_&&M.y>=f&&M.y<=m&&M!==s&&M!==o&&yr(a,h,l,u,c,d,M.x,M.y)&&Ut(M.prev,M,M.next)>=0||(M=M.prevZ,y.x>=p&&y.x<=_&&y.y>=f&&y.y<=m&&y!==s&&y!==o&&yr(a,h,l,u,c,d,y.x,y.y)&&Ut(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;M&&M.z>=g;){if(M.x>=p&&M.x<=_&&M.y>=f&&M.y<=m&&M!==s&&M!==o&&yr(a,h,l,u,c,d,M.x,M.y)&&Ut(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;y&&y.z<=v;){if(y.x>=p&&y.x<=_&&y.y>=f&&y.y<=m&&y!==s&&y!==o&&yr(a,h,l,u,c,d,y.x,y.y)&&Ut(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function H0(i,e){let t=i;do{let n=t.prev,s=t.next.next;!Ks(n,s)&&Ld(n,t,t.next,s)&&Zr(n,s)&&Zr(s,n)&&(e.push(n.i,t.i,s.i),Jr(t),Jr(t.next),t=i=s),t=t.next}while(t!==i);return ls(t)}function G0(i,e,t,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&K0(o,a)){let l=Dd(o,a);o=ls(o,o.next),l=ls(l,l.next),Yr(o,e,t,n,s,r,0),Yr(l,e,t,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function k0(i,e,t,n){let s=[];for(let r=0,o=e.length;r<o;r++){let a=e[r]*n,l=r<o-1?e[r+1]*n:i.length,c=Id(i,a,l,n,!1);c===c.next&&(c.steiner=!0),s.push(J0(c))}s.sort(V0);for(let r=0;r<s.length;r++)t=W0(s[r],t);return t}function V0(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function W0(i,e){let t=X0(i,e);if(!t)return e;let n=Dd(t,i);return ls(n,n.next),ls(t,t.next)}function X0(i,e){let t=e,n=i.x,s=i.y,r=-1/0,o;if(Ks(i,t))return t;do{if(Ks(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){let u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>r&&(r=u,o=t.x<t.next.x?t:t.next,u===n))return o}t=t.next}while(t!==e);if(!o)return null;let a=o,l=o.x,c=o.y,h=1/0;t=o;do{if(n>=t.x&&t.x>=l&&n!==t.x&&Pd(s<c?n:r,s,l,c,s<c?r:n,s,t.x,t.y)){let u=Math.abs(s-t.y)/(n-t.x);Zr(t,i)&&(u<h||u===h&&(t.x>o.x||t.x===o.x&&q0(o,t)))&&(o=t,h=u)}t=t.next}while(t!==a);return o}function q0(i,e){return Ut(i.prev,i,e.prev)<0&&Ut(e.next,i,i.next)<0}function Y0(i,e,t,n){let s=i;do s.z===0&&(s.z=Uc(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Z0(s)}function Z0(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let o=n,a=0;for(let c=0;c<t&&(a++,o=o.nextZ,!!o);c++);let l=t;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||n.z<=o.z)?(s=n,n=n.nextZ,a--):(s=o,o=o.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=o}r.nextZ=null,t*=2}while(e>1);return i}function Uc(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function J0(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Pd(i,e,t,n,s,r,o,a){return(s-o)*(e-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(s-o)*(n-a)}function yr(i,e,t,n,s,r,o,a){return!(i===o&&e===a)&&Pd(i,e,t,n,s,r,o,a)}function K0(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!$0(i,e)&&(Zr(i,e)&&Zr(e,i)&&j0(i,e)&&(Ut(i.prev,i,e.prev)||Ut(i,e.prev,e))||Ks(i,e)&&Ut(i.prev,i,i.next)>0&&Ut(e.prev,e,e.next)>0)}function Ut(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function Ks(i,e){return i.x===e.x&&i.y===e.y}function Ld(i,e,t,n){let s=ea(Ut(i,e,t)),r=ea(Ut(i,e,n)),o=ea(Ut(t,n,i)),a=ea(Ut(t,n,e));return!!(s!==r&&o!==a||s===0&&Qo(i,t,e)||r===0&&Qo(i,n,e)||o===0&&Qo(t,i,n)||a===0&&Qo(t,e,n))}function Qo(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function ea(i){return i>0?1:i<0?-1:0}function $0(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&Ld(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function Zr(i,e){return Ut(i.prev,i,i.next)<0?Ut(i,e,i.next)>=0&&Ut(i,i.prev,e)>=0:Ut(i,e,i.prev)<0||Ut(i,i.next,e)<0}function j0(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Dd(i,e){let t=Fc(i.i,i.x,i.y),n=Fc(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Ou(i,e,t,n){let s=Fc(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Jr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Fc(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Q0(i,e,t,n){let s=0;for(let r=e,o=t-n;r<t;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}var Oc=class{static triangulate(e,t,n=2){return O0(e,t,n)}},ss=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];Bu(e),zu(n,e);let o=e.length;t.forEach(Bu);for(let l=0;l<t.length;l++)s.push(o),o+=t[l].length,zu(n,t[l]);let a=Oc.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function Bu(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function zu(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var Kr=class i extends xt{constructor(e=new Js([new ee(.5,.5),new ee(-.5,.5),new ee(-.5,-.5),new ee(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,s=[],r=[];for(let a=0,l=e.length;a<l;a++){let c=e[a];o(c)}this.setAttribute("position",new ze(s,3)),this.setAttribute("uv",new ze(r,2)),this.computeVertexNormals();function o(a){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,p=t.bevelThickness!==void 0?t.bevelThickness:.2,f=t.bevelSize!==void 0?t.bevelSize:p-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3,g=t.extrudePath,v=t.UVGenerator!==void 0?t.UVGenerator:ep,M,y=!1,w,b,x,E;if(g){M=g.getSpacedPoints(h),y=!0,d=!1;let Q=g.isCatmullRomCurve3?g.closed:!1;w=g.computeFrenetFrames(h,Q),b=new C,x=new C,E=new C}d||(m=0,p=0,f=0,_=0);let P=a.extractPoints(c),A=P.shape,I=P.holes;if(!ss.isClockWise(A)){A=A.reverse();for(let Q=0,he=I.length;Q<he;Q++){let ae=I[Q];ss.isClockWise(ae)&&(I[Q]=ae.reverse())}}function O(Q){let ae=10000000000000001e-36,be=Q[0];for(let xe=1;xe<=Q.length;xe++){let Ke=xe%Q.length,Le=Q[Ke],at=Le.x-be.x,ht=Le.y-be.y,_t=at*at+ht*ht,F=Math.max(Math.abs(Le.x),Math.abs(Le.y),Math.abs(be.x),Math.abs(be.y)),Xt=ae*F*F;if(_t<=Xt){Q.splice(Ke,1),xe--;continue}be=Le}}O(A),I.forEach(O);let L=I.length,G=A;for(let Q=0;Q<L;Q++){let he=I[Q];A=A.concat(he)}function X(Q,he,ae){return he||We("ExtrudeGeometry: vec does not exist"),Q.clone().addScaledVector(he,ae)}let k=A.length;function ne(Q,he,ae){let be,xe,Ke,Le=Q.x-he.x,at=Q.y-he.y,ht=ae.x-Q.x,_t=ae.y-Q.y,F=Le*Le+at*at,Xt=Le*_t-at*ht;if(Math.abs(Xt)>Number.EPSILON){let it=Math.sqrt(F),Tt=Math.sqrt(ht*ht+_t*_t),pe=he.x-at/it,zt=he.y+Le/it,Be=ae.x-_t/Tt,qe=ae.y+ht/Tt,R=((Be-pe)*_t-(qe-zt)*ht)/(Le*_t-at*ht);be=pe+Le*R-Q.x,xe=zt+at*R-Q.y;let S=be*be+xe*xe;if(S<=2)return new ee(be,xe);Ke=Math.sqrt(S/2)}else{let it=!1;Le>Number.EPSILON?ht>Number.EPSILON&&(it=!0):Le<-Number.EPSILON?ht<-Number.EPSILON&&(it=!0):Math.sign(at)===Math.sign(_t)&&(it=!0),it?(be=-at,xe=Le,Ke=Math.sqrt(F)):(be=Le,xe=at,Ke=Math.sqrt(F/2))}return new ee(be/Ke,xe/Ke)}let W=[];for(let Q=0,he=G.length,ae=he-1,be=Q+1;Q<he;Q++,ae++,be++)ae===he&&(ae=0),be===he&&(be=0),W[Q]=ne(G[Q],G[ae],G[be]);let $=[],te,Te=W.concat();for(let Q=0,he=L;Q<he;Q++){let ae=I[Q];te=[];for(let be=0,xe=ae.length,Ke=xe-1,Le=be+1;be<xe;be++,Ke++,Le++)Ke===xe&&(Ke=0),Le===xe&&(Le=0),te[be]=ne(ae[be],ae[Ke],ae[Le]);$.push(te),Te=Te.concat(te)}let He;if(m===0)He=ss.triangulateShape(G,I);else{let Q=[],he=[];for(let ae=0;ae<m;ae++){let be=ae/m,xe=p*Math.cos(be*Math.PI/2),Ke=f*Math.sin(be*Math.PI/2)+_;for(let Le=0,at=G.length;Le<at;Le++){let ht=X(G[Le],W[Le],Ke);Oe(ht.x,ht.y,-xe),be===0&&Q.push(ht)}for(let Le=0,at=L;Le<at;Le++){let ht=I[Le];te=$[Le];let _t=[];for(let F=0,Xt=ht.length;F<Xt;F++){let it=X(ht[F],te[F],Ke);Oe(it.x,it.y,-xe),be===0&&_t.push(it)}be===0&&he.push(_t)}}He=ss.triangulateShape(Q,he)}let Y=He.length,_e=f+_;for(let Q=0;Q<k;Q++){let he=d?X(A[Q],Te[Q],_e):A[Q];y?(x.copy(w.normals[0]).multiplyScalar(he.x),b.copy(w.binormals[0]).multiplyScalar(he.y),E.copy(M[0]).add(x).add(b),Oe(E.x,E.y,E.z)):Oe(he.x,he.y,0)}for(let Q=1;Q<=h;Q++)for(let he=0;he<k;he++){let ae=d?X(A[he],Te[he],_e):A[he];y?(x.copy(w.normals[Q]).multiplyScalar(ae.x),b.copy(w.binormals[Q]).multiplyScalar(ae.y),E.copy(M[Q]).add(x).add(b),Oe(E.x,E.y,E.z)):Oe(ae.x,ae.y,u/h*Q)}for(let Q=m-1;Q>=0;Q--){let he=Q/m,ae=p*Math.cos(he*Math.PI/2),be=f*Math.sin(he*Math.PI/2)+_;for(let xe=0,Ke=G.length;xe<Ke;xe++){let Le=X(G[xe],W[xe],be);Oe(Le.x,Le.y,u+ae)}for(let xe=0,Ke=I.length;xe<Ke;xe++){let Le=I[xe];te=$[xe];for(let at=0,ht=Le.length;at<ht;at++){let _t=X(Le[at],te[at],be);y?Oe(_t.x,_t.y+M[h-1].y,M[h-1].x+ae):Oe(_t.x,_t.y,u+ae)}}}we(),Fe();function we(){let Q=s.length/3;if(d){let he=0,ae=k*he;for(let be=0;be<Y;be++){let xe=He[be];Ct(xe[2]+ae,xe[1]+ae,xe[0]+ae)}he=h+m*2,ae=k*he;for(let be=0;be<Y;be++){let xe=He[be];Ct(xe[0]+ae,xe[1]+ae,xe[2]+ae)}}else{for(let he=0;he<Y;he++){let ae=He[he];Ct(ae[2],ae[1],ae[0])}for(let he=0;he<Y;he++){let ae=He[he];Ct(ae[0]+k*h,ae[1]+k*h,ae[2]+k*h)}}n.addGroup(Q,s.length/3-Q,0)}function Fe(){let Q=s.length/3,he=0;ve(G,he),he+=G.length;for(let ae=0,be=I.length;ae<be;ae++){let xe=I[ae];ve(xe,he),he+=xe.length}n.addGroup(Q,s.length/3-Q,1)}function ve(Q,he){let ae=Q.length;for(;--ae>=0;){let be=ae,xe=ae-1;xe<0&&(xe=Q.length-1);for(let Ke=0,Le=h+m*2;Ke<Le;Ke++){let at=k*Ke,ht=k*(Ke+1),_t=he+be+at,F=he+xe+at,Xt=he+xe+ht,it=he+be+ht;ke(_t,F,Xt,it)}}}function Oe(Q,he,ae){l.push(Q),l.push(he),l.push(ae)}function Ct(Q,he,ae){tt(Q),tt(he),tt(ae);let be=s.length/3,xe=v.generateTopUV(n,s,be-3,be-2,be-1);ot(xe[0]),ot(xe[1]),ot(xe[2])}function ke(Q,he,ae,be){tt(Q),tt(he),tt(be),tt(he),tt(ae),tt(be);let xe=s.length/3,Ke=v.generateSideWallUV(n,s,xe-6,xe-3,xe-2,xe-1);ot(Ke[0]),ot(Ke[1]),ot(Ke[3]),ot(Ke[1]),ot(Ke[2]),ot(Ke[3])}function tt(Q){s.push(l[Q*3+0]),s.push(l[Q*3+1]),s.push(l[Q*3+2])}function ot(Q){r.push(Q.x),r.push(Q.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return tp(t,n,e)}static fromJSON(e,t){let n=[];for(let r=0,o=e.shapes.length;r<o;r++){let a=t[e.shapes[r]];n.push(a)}let s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new wa[s.type]().fromJSON(s)),new i(n,e.options)}},ep={generateTopUV:function(i,e,t,n,s){let r=e[t*3],o=e[t*3+1],a=e[n*3],l=e[n*3+1],c=e[s*3],h=e[s*3+1];return[new ee(r,o),new ee(a,l),new ee(c,h)]},generateSideWallUV:function(i,e,t,n,s,r){let o=e[t*3],a=e[t*3+1],l=e[t*3+2],c=e[n*3],h=e[n*3+1],u=e[n*3+2],d=e[s*3],p=e[s*3+1],f=e[s*3+2],_=e[r*3],m=e[r*3+1],g=e[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new ee(o,1-l),new ee(c,1-u),new ee(d,1-f),new ee(_,1-g)]:[new ee(a,1-l),new ee(h,1-u),new ee(p,1-f),new ee(m,1-g)]}};function tp(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var $r=class i extends Sa{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}},jr=class i extends xt{constructor(e=[new ee(0,-.5),new ee(.5,0),new ee(0,.5)],t=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:s},t=Math.floor(t),s=nt(s,0,Math.PI*2);let r=[],o=[],a=[],l=[],c=[],h=1/t,u=new C,d=new ee,p=new C,f=new C,_=new C,m=0,g=0;for(let v=0;v<=e.length-1;v++)switch(v){case 0:m=e[v+1].x-e[v].x,g=e[v+1].y-e[v].y,p.x=g*1,p.y=-m,p.z=g*0,_.copy(p),p.normalize(),l.push(p.x,p.y,p.z);break;case e.length-1:_.normalize(),l.push(_.x,_.y,_.z);break;default:m=e[v+1].x-e[v].x,g=e[v+1].y-e[v].y,p.x=g*1,p.y=-m,p.z=g*0,f.copy(p),p.x+=_.x,p.y+=_.y,p.z+=_.z,p.normalize(),l.push(p.x,p.y,p.z),_.copy(f)}for(let v=0;v<=t;v++){let M=n+v*h*s,y=Math.sin(M),w=Math.cos(M);for(let b=0;b<=e.length-1;b++){u.x=e[b].x*y,u.y=e[b].y,u.z=e[b].x*w,o.push(u.x,u.y,u.z),d.x=v/t,d.y=b/(e.length-1),a.push(d.x,d.y);let x=l[3*b+0]*y,E=l[3*b+1],P=l[3*b+0]*w;c.push(x,E,P)}}for(let v=0;v<t;v++)for(let M=0;M<e.length-1;M++){let y=M+v*e.length,w=y,b=y+e.length,x=y+e.length+1,E=y+1;r.push(w,b,E),r.push(x,E,b)}this.setIndex(r),this.setAttribute("position",new ze(o,3)),this.setAttribute("uv",new ze(a,2)),this.setAttribute("normal",new ze(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.points,e.segments,e.phiStart,e.phiLength)}};var ln=class i extends xt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,u=e/a,d=t/l,p=[],f=[],_=[],m=[];for(let g=0;g<h;g++){let v=g*d-o;for(let M=0;M<c;M++){let y=M*u-r;f.push(y,-v,0),_.push(0,0,1),m.push(M/a),m.push(1-g/l)}}for(let g=0;g<l;g++)for(let v=0;v<a;v++){let M=v+c*g,y=v+c*(g+1),w=v+1+c*(g+1),b=v+1+c*g;p.push(M,y,b),p.push(y,w,b)}this.setIndex(p),this.setAttribute("position",new ze(f,3)),this.setAttribute("normal",new ze(_,3)),this.setAttribute("uv",new ze(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};var Pt=class i extends xt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],u=new C,d=new C,p=[],f=[],_=[],m=[];for(let g=0;g<=n;g++){let v=[],M=g/n,y=o+M*a,w=e*Math.cos(y),b=Math.sqrt(e*e-w*w),x=0;g===0&&o===0?x=.5/t:g===n&&l===Math.PI&&(x=-.5/t);for(let E=0;E<=t;E++){let P=E/t,A=s+P*r;u.x=-b*Math.cos(A),u.y=w,u.z=b*Math.sin(A),f.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),m.push(P+x,1-M),v.push(c++)}h.push(v)}for(let g=0;g<n;g++)for(let v=0;v<t;v++){let M=h[g][v+1],y=h[g][v],w=h[g+1][v],b=h[g+1][v+1];(g!==0||o>0)&&p.push(M,y,b),(g!==n-1||l<Math.PI)&&p.push(y,w,b)}this.setIndex(p),this.setAttribute("position",new ze(f,3)),this.setAttribute("normal",new ze(_,3)),this.setAttribute("uv",new ze(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var oi=class i extends xt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2,o=0,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r,thetaStart:o,thetaLength:a},n=Math.floor(n),s=Math.floor(s);let l=[],c=[],h=[],u=[],d=new C,p=new C,f=new C;for(let _=0;_<=n;_++){let m=o+_/n*a;for(let g=0;g<=s;g++){let v=g/s*r;p.x=(e+t*Math.cos(m))*Math.cos(v),p.y=(e+t*Math.cos(m))*Math.sin(v),p.z=t*Math.sin(m),c.push(p.x,p.y,p.z),d.x=e*Math.cos(v),d.y=e*Math.sin(v),f.subVectors(p,d).normalize(),h.push(f.x,f.y,f.z),u.push(g/s),u.push(_/n)}}for(let _=1;_<=n;_++)for(let m=1;m<=s;m++){let g=(s+1)*_+m-1,v=(s+1)*(_-1)+m-1,M=(s+1)*(_-1)+m,y=(s+1)*_+m;l.push(g,v,y),l.push(v,M,y)}this.setIndex(l),this.setAttribute("position",new ze(c,3)),this.setAttribute("normal",new ze(h,3)),this.setAttribute("uv",new ze(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}};var Qr=class i extends xt{constructor(e=new as(new C(-1,-1,0),new C(-1,1,0),new C(1,1,0)),t=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:s,closed:r};let o=e.computeFrenetFrames(t,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;let a=new C,l=new C,c=new ee,h=new C,u=[],d=[],p=[],f=[];_(),this.setIndex(f),this.setAttribute("position",new ze(u,3)),this.setAttribute("normal",new ze(d,3)),this.setAttribute("uv",new ze(p,2));function _(){for(let M=0;M<t;M++)m(M);m(r===!1?t:0),v(),g()}function m(M){h=e.getPointAt(M/t,h);let y=o.normals[M],w=o.binormals[M];for(let b=0;b<=s;b++){let x=b/s*Math.PI*2,E=Math.sin(x),P=-Math.cos(x);l.x=P*y.x+E*w.x,l.y=P*y.y+E*w.y,l.z=P*y.z+E*w.z,l.normalize(),d.push(l.x,l.y,l.z),a.x=h.x+n*l.x,a.y=h.y+n*l.y,a.z=h.z+n*l.z,u.push(a.x,a.y,a.z)}}function g(){for(let M=1;M<=t;M++)for(let y=1;y<=s;y++){let w=(s+1)*(M-1)+(y-1),b=(s+1)*M+(y-1),x=(s+1)*M+y,E=(s+1)*(M-1)+y;f.push(w,b,E),f.push(b,x,E)}}function v(){for(let M=0;M<=t;M++)for(let y=0;y<=s;y++)c.x=M/t,c.y=y/s,p.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new i(new wa[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}};function fs(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];if(Hu(s))s.isRenderTargetTexture?(Ge("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(Hu(s[0])){let r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function mn(i){let e={};for(let t=0;t<i.length;t++){let n=fs(i[t]);for(let s in n)e[s]=n[s]}return e}function Hu(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function np(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function _h(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ft.workingColorSpace}var ps={clone:fs,merge:mn},ip=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,sp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,kt=class extends Yn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ip,this.fragmentShader=sp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=fs(e.uniforms),this.uniformsGroups=np(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new Pe().setHex(s.value);break;case"v2":this.uniforms[n].value=new ee().fromArray(s.value);break;case"v3":this.uniforms[n].value=new C().fromArray(s.value);break;case"v4":this.uniforms[n].value=new Rt().fromArray(s.value);break;case"m3":this.uniforms[n].value=new Ye().fromArray(s.value);break;case"m4":this.uniforms[n].value=new je().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Ra=class extends kt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Ee=class extends Yn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Pe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Pe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Cl,this.normalScale=new ee(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new qn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};var Ca=class extends Yn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=gd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Ia=class extends Yn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Ns(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function ta(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}var Gi=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Pa=class extends Gi{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Pc,endingEnd:Pc}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Lc:r=e,a=2*t-n;break;case Dc:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Lc:o=e,l=2*n-t;break;case Dc:o=1,l=n+s[1]-s[0];break;default:o=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,p=this._weightNext,f=(n-t)/(s-t),_=f*f,m=_*f,g=-d*m+2*d*_-d*f,v=(1+d)*m+(-1.5-2*d)*_+(-.5+d)*f+1,M=(-1-p)*m+(1.5+p)*_+.5*f,y=p*m-p*_;for(let w=0;w!==a;++w)r[w]=g*o[h+w]+v*o[c+w]+M*o[l+w]+y*o[u+w];return r}},La=class extends Gi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=(n-t)/(s-t),u=1-h;for(let d=0;d!==a;++d)r[d]=o[c+d]*u+o[l+d]*h;return r}},Da=class extends Gi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},Na=class extends Gi{interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this.inTangents,u=this.outTangents;if(!h||!u){let f=(n-t)/(s-t),_=1-f;for(let m=0;m!==a;++m)r[m]=o[c+m]*_+o[l+m]*f;return r}let d=a*2,p=e-1;for(let f=0;f!==a;++f){let _=o[c+f],m=o[l+f],g=p*d+f*2,v=u[g],M=u[g+1],y=e*d+f*2,w=h[y],b=h[y+1],x=op(n,t,v,w,s);r[f]=Nd(x,_,M,b,m)}return r}};function Nd(i,e,t,n,s){let r=1-i;return r*r*r*e+3*r*r*i*t+3*r*i*i*n+i*i*i*s}function rp(i,e,t,n,s){let r=1-i;return 3*r*r*(t-e)+6*r*i*(n-t)+3*i*i*(s-n)}function op(i,e,t,n,s){let r=(i-e)/(s-e);for(let o=0;o<8;o++){let a=Nd(r,e,t,n,s)-i;if(Math.abs(a)<1e-10)break;let l=rp(r,e,t,n,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-a/l))}return r}var Pn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Ns(t,this.TimeBufferType),this.values=Ns(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Ns(e.times,Array),values:Ns(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s),ta(e.settings)&&(n.settings={inTangents:Ns(e.settings.inTangents,Array),outTangents:Ns(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Da(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new La(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Pa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Na(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case wr:t=this.InterpolantFactoryMethodDiscrete;break;case pa:t=this.InterpolantFactoryMethodLinear;break;case sa:t=this.InterpolantFactoryMethodSmooth;break;case Ic:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Ge("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return wr;case this.InterpolantFactoryMethodLinear:return pa;case this.InterpolantFactoryMethodSmooth:return sa;case this.InterpolantFactoryMethodBezier:return Ic}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e;ta(this.settings)&&(Gu(this.settings.inTangents,e),Gu(this.settings.outTangents,e))}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e;ta(this.settings)&&(ku(this.settings.inTangents,e),ku(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(We("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(We("KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){We("KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){We("KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(s!==void 0&&Jf(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){We("KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===sa,r=e.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=e[a],h=e[a+1];if(c!==h&&(a!==1||c!==e[0]))if(s)l=!0;else{let u=a*n,d=u-n,p=u+n;for(let f=0;f!==n;++f){let _=t[u+f];if(_!==t[d+f]||_!==t[p+f]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let u=a*n,d=o*n;for(let p=0;p!==n;++p)t[d+p]=t[u+p]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,ta(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function Gu(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]+=e}function ku(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]*=e}Pn.prototype.ValueTypeName="";Pn.prototype.TimeBufferType=Float32Array;Pn.prototype.ValueBufferType=Float32Array;Pn.prototype.DefaultInterpolation=pa;var ki=class extends Pn{constructor(e,t,n){super(e,t,n)}};ki.prototype.ValueTypeName="bool";ki.prototype.ValueBufferType=Array;ki.prototype.DefaultInterpolation=wr;ki.prototype.InterpolantFactoryMethodLinear=void 0;ki.prototype.InterpolantFactoryMethodSmooth=void 0;var Ua=class extends Pn{constructor(e,t,n,s){super(e,t,n,s)}};Ua.prototype.ValueTypeName="color";var Fa=class extends Pn{constructor(e,t,n,s){super(e,t,n,s)}};Fa.prototype.ValueTypeName="number";var Oa=class extends Gi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(s-t),c=e*a;for(let h=c+a;c!==h;c+=4)Ft.slerpFlat(r,0,o,c-a,o,c,l);return r}},eo=class extends Pn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new Oa(this.times,this.values,this.getValueSize(),e)}};eo.prototype.ValueTypeName="quaternion";eo.prototype.InterpolantFactoryMethodSmooth=void 0;var Vi=class extends Pn{constructor(e,t,n){super(e,t,n)}};Vi.prototype.ValueTypeName="string";Vi.prototype.ValueBufferType=Array;Vi.prototype.DefaultInterpolation=wr;Vi.prototype.InterpolantFactoryMethodLinear=void 0;Vi.prototype.InterpolantFactoryMethodSmooth=void 0;var Ba=class extends Pn{constructor(e,t,n,s){super(e,t,n,s)}};Ba.prototype.ValueTypeName="vector";var za=class{constructor(e,t,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let p=c[u],f=c[u+1];if(p.global&&(p.lastIndex=0),p.test(h))return f}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Ud=new za,Ha=class{constructor(e){this.manager=e!==void 0?e:Ud,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},this.priority="auto",this.cache="default",typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}setPriority(e){return this.priority=e,this}setCache(e){return this.cache=e,this}abort(){return this}};Ha.DEFAULT_MATERIAL_NAME="__DEFAULT";var $s=class extends jt{static registerNode(e){this.prototype._lightNode=e}constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Pe(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},to=class extends $s{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(jt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Pe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Cc=new je,Vu=new C,Wu=new C,no=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ee(512,512),this.mapType=bn,this.map=null,this.mapPass=null,this.matrix=new je,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Hi,this._frameExtents=new ee(1,1),this._viewportCount=1,this._viewports=[new Rt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Vu.setFromMatrixPosition(e.matrixWorld),t.position.copy(Vu),Wu.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Wu),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,s){Cc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Cc,e.coordinateSystem,e.reversedDepth);let r=this._frameExtents,o=s?s.z/r.x:1,a=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;e.coordinateSystem===zs||e.reversedDepth?t.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,1,0,0,0,0,1):t.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,.5,.5,0,0,0,1),t.multiply(Cc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.mapType=e.mapType,this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.mapType=this.mapType,e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},na=new C,ia=new Ft,jn=new C,io=class extends jt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new je,this.projectionMatrix=new je,this.projectionMatrixInverse=new je,this.coordinateSystem=On,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(na,ia,jn),jn.x===1&&jn.y===1&&jn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(na,ia,jn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(na,ia,jn),jn.x===1&&jn.y===1&&jn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(na,ia,jn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},zi=new C,Xu=new ee,qu=new ee,an=class extends io{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Gs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Sr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Gs*2*Math.atan(Math.tan(Sr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){zi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(zi.x,zi.y).multiplyScalar(-e/zi.z),zi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(zi.x,zi.y).multiplyScalar(-e/zi.z)}getViewSize(e,t){return this.getViewBounds(e,Xu,qu),t.subVectors(qu,Xu)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Sr*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}};var Bc=class extends no{constructor(){super(new an(90,1,.5,500)),this.isPointLightShadow=!0}},so=class extends $s{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Bc}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},Ti=class extends io{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,o=n+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},zc=class extends no{constructor(){super(new Ti(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},ro=class extends $s{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(jt.DEFAULT_UP),this.updateMatrix(),this.target=new jt,this.shadow=new zc}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}};var Us=-90,Fs=1,js=class extends jt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new an(Us,Fs,e,t);s.layers=this.layers,this.add(s);let r=new an(Us,Fs,e,t);r.layers=this.layers,this.add(r);let o=new an(Us,Fs,e,t);o.layers=this.layers,this.add(o);let a=new an(Us,Fs,e,t);a.layers=this.layers,this.add(a);let l=new an(Us,Fs,e,t);l.layers=this.layers,this.add(l);let c=new an(Us,Fs,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,l]=t;for(let c of t)this.remove(c);if(e===On)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===zs)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),f=e.xr.enabled;e.xr.enabled=!1;let _=n.texture.mipmapsAutoUpdate;n.texture.mipmapsAutoUpdate=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,2,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,3,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.mipmapsAutoUpdate=_,e.setRenderTarget(n,5,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(u,d,p),e.xr.enabled=f,n.texture.needsPMREMUpdate=!0}},Ga=class extends an{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}};var vh="\\[\\]\\.:\\/",ap=new RegExp("["+vh+"]","g"),yh="[^"+vh+"]",lp="[^"+vh.replace("\\.","")+"]",cp=/((?:WC+[\/:])*)/.source.replace("WC",yh),hp=/(WCOD+)?/.source.replace("WCOD",lp),up=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",yh),dp=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",yh),fp=new RegExp("^"+cp+hp+up+dp+"$"),pp=["material","materials","bones","map"],Hc=class{constructor(e,t,n){let s=n||It.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},It=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(ap,"")}static parseTrackName(e){let t=fp.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);pp.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let l=n(a.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ge("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){We("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){We("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){We("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){We("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){We("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){We("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){We("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[s];if(o===void 0){let c=t.nodeName;We("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){We("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){We("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};It.Composite=Hc;It.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};It.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};It.prototype.GetterByBindingType=[It.prototype._getValue_direct,It.prototype._getValue_array,It.prototype._getValue_arrayElement,It.prototype._getValue_toArray];It.prototype.SetterByBindingTypeAndVersioning=[[It.prototype._setValue_direct,It.prototype._setValue_direct_setNeedsUpdate,It.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[It.prototype._setValue_array,It.prototype._setValue_array_setNeedsUpdate,It.prototype._setValue_array_setMatrixWorldNeedsUpdate],[It.prototype._setValue_arrayElement,It.prototype._setValue_arrayElement_setNeedsUpdate,It.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[It.prototype._setValue_fromArray,It.prototype._setValue_fromArray_setNeedsUpdate,It.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var n1=new Float32Array(1);var Gc=class{static{this.prototype.isMatrix2=!0}constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}};function Mh(i,e,t,n){let s=mp(n);switch(t){case oh:return i*e;case Ja:return i*e/s.components*s.byteLength;case Ka:return i*e/s.components*s.byteLength;case Xi:return i*e*2/s.components*s.byteLength;case $a:return i*e*2/s.components*s.byteLength;case ah:return i*e*3/s.components*s.byteLength;case Dn:return i*e*4/s.components*s.byteLength;case ja:return i*e*4/s.components*s.byteLength;case lo:case co:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case ho:case uo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case el:case nl:return Math.max(i,16)*Math.max(e,8)/4;case Qa:case tl:return Math.max(i,8)*Math.max(e,8)/2;case il:case sl:case ol:case al:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case rl:case fo:case ll:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case cl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case hl:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case ul:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case dl:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case fl:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case pl:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case ml:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case gl:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case xl:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case _l:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case vl:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case yl:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Ml:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Sl:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case El:case bl:case Tl:return Math.ceil(i/4)*Math.ceil(e/4)*16;case wl:case Al:return Math.ceil(i/4)*Math.ceil(e/4)*8;case po:case Rl:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function mp(i){switch(i){case bn:case nh:return{byteLength:1,components:1};case nr:case ih:case hn:return{byteLength:2,components:1};case Ya:case Za:return{byteLength:2,components:4};case Jn:case qa:case Tn:return{byteLength:4,components:1};case sh:case rh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"187"}}));typeof window<"u"&&(window.__THREE__?Ge("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="187");function sf(){let i=null,e=!1,t=null,n=null;function s(r,o){n=i.requestAnimationFrame(s),t(r,o)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function yp(i){let e=new WeakMap;function t(a,l){let c=a.array,h=a.usage,u=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),a.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){let h=l.array,u=l.updateRanges;if(i.bindBuffer(c,a),u.length===0)i.bufferSubData(c,0,h);else{u.sort((p,f)=>p.start-f.start);let d=0;for(let p=1;p<u.length;p++){let f=u[d],_=u[p];_.start<=f.start+f.count+1?f.count=Math.max(f.count,_.start+_.count-f.start):(++d,u[d]=_)}u.length=d+1;for(let p=0,f=u.length;p<f;p++){let _=u[p];i.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(i.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var Mp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Sp=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Ep=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,bp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Tp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,wp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Ap=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Rp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Cp=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Ip=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Pp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Lp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Dp=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Np=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Up=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Fp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Op=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Bp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,zp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Hp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Gp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,kp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Vp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Wp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Xp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,qp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Yp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Zp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Jp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Kp="gl_FragColor = linearToOutputTexel( gl_FragColor );",$p=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,jp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Qp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,em=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,tm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,nm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,im=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,sm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,rm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,om=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,am=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,cm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,hm=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,um=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,dm=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,fm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,pm=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,mm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,gm=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,xm=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,_m=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,vm=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,ym=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Mm=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Sm=`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Em=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,bm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Tm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,wm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Am=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Rm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Cm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Im=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Pm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Lm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Dm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Nm=`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Um=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Fm=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Om=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Bm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,zm=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Hm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Gm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,km=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Vm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Wm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Xm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,qm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Ym=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Zm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Jm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Km=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,$m=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,jm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Qm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,eg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,tg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,ng=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,ig=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,sg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,rg=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,og=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ag=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,lg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,cg=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,hg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,ug=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,dg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,fg=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,pg=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,mg=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,gg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,xg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,_g=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,vg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,yg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Mg=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Sg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Eg=`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Tg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Ag=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Rg=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Cg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Ig=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Pg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Lg=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Dg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Ng=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Ug=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Fg=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Og=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Bg=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,zg=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Hg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Gg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,kg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Vg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Wg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Xg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qg=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Yg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Zg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Jg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Kg=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,$g=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,jg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Qg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,et={alphahash_fragment:Mp,alphahash_pars_fragment:Sp,alphamap_fragment:Ep,alphamap_pars_fragment:bp,alphatest_fragment:Tp,alphatest_pars_fragment:wp,aomap_fragment:Ap,aomap_pars_fragment:Rp,batching_pars_vertex:Cp,batching_vertex:Ip,begin_vertex:Pp,beginnormal_vertex:Lp,bsdfs:Dp,iridescence_fragment:Np,bumpmap_pars_fragment:Up,clipping_planes_fragment:Fp,clipping_planes_pars_fragment:Op,clipping_planes_pars_vertex:Bp,clipping_planes_vertex:zp,color_fragment:Hp,color_pars_fragment:Gp,color_pars_vertex:kp,color_vertex:Vp,common:Wp,defaultnormal_vertex:Xp,displacementmap_pars_vertex:qp,displacementmap_vertex:Yp,emissivemap_fragment:Zp,emissivemap_pars_fragment:Jp,colorspace_fragment:Kp,colorspace_pars_fragment:$p,envmap_fragment:jp,envmap_common_pars_fragment:Qp,envmap_pars_fragment:em,envmap_pars_vertex:tm,envmap_physical_pars_fragment:dm,envmap_vertex:nm,fog_vertex:im,fog_pars_vertex:sm,fog_fragment:rm,fog_pars_fragment:om,gradientmap_pars_fragment:am,lightmap_pars_fragment:lm,lights_lambert_fragment:cm,lights_lambert_pars_fragment:hm,lights_pars_begin:um,lights_toon_fragment:fm,lights_toon_pars_fragment:pm,lights_phong_fragment:mm,lights_phong_pars_fragment:gm,lights_physical_fragment:xm,lights_physical_pars_fragment:_m,lights_fragment_begin:vm,lights_fragment_maps:ym,lights_fragment_end:Mm,lightprobes_pars_fragment:Sm,logdepthbuf_fragment:Em,logdepthbuf_pars_fragment:bm,logdepthbuf_pars_vertex:Tm,logdepthbuf_vertex:wm,map_fragment:Am,map_pars_fragment:Rm,map_particle_fragment:Cm,map_particle_pars_fragment:Im,metalnessmap_fragment:Pm,metalnessmap_pars_fragment:Lm,morphinstance_vertex:Dm,morphcolor_vertex:Nm,morphnormal_vertex:Um,morphtarget_pars_vertex:Fm,morphtarget_vertex:Om,normal_fragment_begin:Bm,normal_fragment_maps:zm,normal_pars_fragment:Hm,normal_pars_vertex:Gm,normal_vertex:km,normalmap_pars_fragment:Vm,clearcoat_normal_fragment_begin:Wm,clearcoat_normal_fragment_maps:Xm,clearcoat_pars_fragment:qm,iridescence_pars_fragment:Ym,opaque_fragment:Zm,packing:Jm,premultiplied_alpha_fragment:Km,project_vertex:$m,dithering_fragment:jm,dithering_pars_fragment:Qm,roughnessmap_fragment:eg,roughnessmap_pars_fragment:tg,shadowmap_pars_fragment:ng,shadowmap_pars_vertex:ig,shadowmap_vertex:sg,shadowmask_pars_fragment:rg,skinbase_vertex:og,skinning_pars_vertex:ag,skinning_vertex:lg,skinnormal_vertex:cg,specularmap_fragment:hg,specularmap_pars_fragment:ug,tonemapping_fragment:dg,tonemapping_pars_fragment:fg,transmission_fragment:pg,transmission_pars_fragment:mg,uv_pars_fragment:gg,uv_pars_vertex:xg,uv_vertex:_g,worldpos_vertex:vg,background_vert:yg,background_frag:Mg,backgroundCube_vert:Sg,backgroundCube_frag:Eg,cube_vert:bg,cube_frag:Tg,depth_vert:wg,depth_frag:Ag,distance_vert:Rg,distance_frag:Cg,equirect_vert:Ig,equirect_frag:Pg,linedashed_vert:Lg,linedashed_frag:Dg,meshbasic_vert:Ng,meshbasic_frag:Ug,meshlambert_vert:Fg,meshlambert_frag:Og,meshmatcap_vert:Bg,meshmatcap_frag:zg,meshnormal_vert:Hg,meshnormal_frag:Gg,meshphong_vert:kg,meshphong_frag:Vg,meshphysical_vert:Wg,meshphysical_frag:Xg,meshtoon_vert:qg,meshtoon_frag:Yg,points_vert:Zg,points_frag:Jg,shadow_vert:Kg,shadow_frag:$g,sprite_vert:jg,sprite_frag:Qg},Me={common:{diffuse:{value:new Pe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ye}},envmap:{envMap:{value:null},envMapRotation:{value:new Ye},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ye}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ye}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ye},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ye},normalScale:{value:new ee(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ye},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ye}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ye}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ye}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Pe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new Pe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0},uvTransform:{value:new Ye}},sprite:{diffuse:{value:new Pe(16777215)},opacity:{value:1},center:{value:new ee(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}}},ci={basic:{uniforms:mn([Me.common,Me.specularmap,Me.envmap,Me.aomap,Me.lightmap,Me.fog]),vertexShader:et.meshbasic_vert,fragmentShader:et.meshbasic_frag},lambert:{uniforms:mn([Me.common,Me.specularmap,Me.envmap,Me.aomap,Me.lightmap,Me.emissivemap,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.fog,Me.lights,{emissive:{value:new Pe(0)},envMapIntensity:{value:1}}]),vertexShader:et.meshlambert_vert,fragmentShader:et.meshlambert_frag},phong:{uniforms:mn([Me.common,Me.specularmap,Me.envmap,Me.aomap,Me.lightmap,Me.emissivemap,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.fog,Me.lights,{emissive:{value:new Pe(0)},specular:{value:new Pe(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:et.meshphong_vert,fragmentShader:et.meshphong_frag},standard:{uniforms:mn([Me.common,Me.envmap,Me.aomap,Me.lightmap,Me.emissivemap,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.roughnessmap,Me.metalnessmap,Me.fog,Me.lights,{emissive:{value:new Pe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:et.meshphysical_vert,fragmentShader:et.meshphysical_frag},toon:{uniforms:mn([Me.common,Me.aomap,Me.lightmap,Me.emissivemap,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.gradientmap,Me.fog,Me.lights,{emissive:{value:new Pe(0)}}]),vertexShader:et.meshtoon_vert,fragmentShader:et.meshtoon_frag},matcap:{uniforms:mn([Me.common,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.fog,{matcap:{value:null}}]),vertexShader:et.meshmatcap_vert,fragmentShader:et.meshmatcap_frag},points:{uniforms:mn([Me.points,Me.fog]),vertexShader:et.points_vert,fragmentShader:et.points_frag},dashed:{uniforms:mn([Me.common,Me.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:et.linedashed_vert,fragmentShader:et.linedashed_frag},depth:{uniforms:mn([Me.common,Me.displacementmap]),vertexShader:et.depth_vert,fragmentShader:et.depth_frag},normal:{uniforms:mn([Me.common,Me.bumpmap,Me.normalmap,Me.displacementmap,{opacity:{value:1}}]),vertexShader:et.meshnormal_vert,fragmentShader:et.meshnormal_frag},sprite:{uniforms:mn([Me.sprite,Me.fog]),vertexShader:et.sprite_vert,fragmentShader:et.sprite_frag},background:{uniforms:{uvTransform:{value:new Ye},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:et.background_vert,fragmentShader:et.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ye}},vertexShader:et.backgroundCube_vert,fragmentShader:et.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:et.cube_vert,fragmentShader:et.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:et.equirect_vert,fragmentShader:et.equirect_frag},distance:{uniforms:mn([Me.common,Me.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:et.distance_vert,fragmentShader:et.distance_frag},shadow:{uniforms:mn([Me.lights,Me.fog,{color:{value:new Pe(0)},opacity:{value:1}}]),vertexShader:et.shadow_vert,fragmentShader:et.shadow_frag}};ci.physical={uniforms:mn([ci.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ye},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ye},clearcoatNormalScale:{value:new ee(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ye},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new Ye},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ye},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ye},sheen:{value:0},sheenColor:{value:new Pe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ye},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ye},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ye},transmissionSamplerSize:{value:new ee},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ye},attenuationDistance:{value:0},attenuationColor:{value:new Pe(0)},specularColor:{value:new Pe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ye},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ye},anisotropyVector:{value:new ee},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ye}}]),vertexShader:et.meshphysical_vert,fragmentShader:et.meshphysical_frag};var Pl={r:0,b:0,g:0},ex=new je,rf=new Ye;rf.set(-1,0,0,0,1,0,0,0,1);function tx(i,e,t,n,s,r){let o=new Pe(0),a=s===!0?0:1,l,c,h=null,u=0,d=null;function p(v){let M=v.isScene===!0?v.background:null;if(M&&M.isTexture){let y=v.backgroundBlurriness>0;M=e.get(M,y)}return M}function f(v){let M=!1,y=p(v);y===null?m(o,a):y&&y.isColor&&(m(y,1),M=!0);let w=i.xr.getEnvironmentBlendMode();w==="additive"?t.buffers.color.setClear(0,0,0,1,r):w==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||M)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function _(v,M){let y=p(M);y&&y.isCubeTexture?(c===void 0&&(c=new ie(new Xe(1,1,1),new kt({name:"BackgroundCubeMaterial",uniforms:fs(ci.backgroundCube.uniforms),vertexShader:ci.backgroundCube.vertexShader,fragmentShader:ci.backgroundCube.fragmentShader,side:cn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(w,b,x){this.matrixWorld.copyPosition(x.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=y,c.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(ex.makeRotationFromEuler(M.backgroundRotation)).transpose(),y.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(rf),c.material.toneMapped=ft.getTransfer(y.colorSpace)!==Mt,(h!==y||u!==y.version||d!==i.toneMapping)&&(c.material.needsUpdate=!0,h=y,u=y.version,d=i.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new ie(new ln(2,2),new kt({name:"BackgroundMaterial",uniforms:fs(ci.background.uniforms),vertexShader:ci.background.vertexShader,fragmentShader:ci.background.fragmentShader,side:Wi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=ft.getTransfer(y.colorSpace)!==Mt,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(h!==y||u!==y.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,h=y,u=y.version,d=i.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null))}function m(v,M){v.getRGB(Pl,_h(i)),t.buffers.color.setClear(Pl.r,Pl.g,Pl.b,M,r)}function g(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(v,M=1){o.set(v),a=M,m(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(v){a=v,m(o,a)},render:f,addToRenderList:_,dispose:g}}function nx(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null),r=s,o=!1;function a(I,N,O,L,G){let X=!1,k=u(I,L,O,N);r!==k&&(r=k,c(r.object)),X=p(I,L,O,G),X&&f(I,L,O,G),G!==null&&e.update(G,i.ELEMENT_ARRAY_BUFFER),(X||o)&&(o=!1,y(I,N,O,L),G!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(G).buffer))}function l(){return i.createVertexArray()}function c(I){return i.bindVertexArray(I)}function h(I){return i.deleteVertexArray(I)}function u(I,N,O,L){let G=L.wireframe===!0,X=n[N.id];X===void 0&&(X={},n[N.id]=X);let k=I.isInstancedMesh===!0?I.id:0,ne=X[k];ne===void 0&&(ne={},X[k]=ne);let W=ne[O.id];W===void 0&&(W={},ne[O.id]=W);let $=W[G];return $===void 0&&($=d(l()),W[G]=$),$}function d(I){let N=[],O=[],L=[];for(let G=0;G<t;G++)N[G]=0,O[G]=0,L[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:O,attributeDivisors:L,object:I,attributes:{},index:null}}function p(I,N,O,L){let G=r.attributes,X=N.attributes,k=0,ne=O.getAttributes();for(let W in ne)if(ne[W].location>=0){let te=G[W],Te=X[W];if(Te===void 0&&(W==="instanceMatrix"&&I.instanceMatrix&&(Te=I.instanceMatrix),W==="instanceColor"&&I.instanceColor&&(Te=I.instanceColor)),te===void 0||te.attribute!==Te||Te&&te.data!==Te.data)return!0;k++}return r.attributesNum!==k||r.index!==L}function f(I,N,O,L){let G={},X=N.attributes,k=0,ne=O.getAttributes();for(let W in ne)if(ne[W].location>=0){let te=X[W];te===void 0&&(W==="instanceMatrix"&&I.instanceMatrix&&(te=I.instanceMatrix),W==="instanceColor"&&I.instanceColor&&(te=I.instanceColor));let Te={};Te.attribute=te,te&&te.data&&(Te.data=te.data),G[W]=Te,k++}r.attributes=G,r.attributesNum=k,r.index=L}function _(){let I=r.newAttributes;for(let N=0,O=I.length;N<O;N++)I[N]=0}function m(I){g(I,0)}function g(I,N){let O=r.newAttributes,L=r.enabledAttributes,G=r.attributeDivisors;O[I]=1,L[I]===0&&(i.enableVertexAttribArray(I),L[I]=1),G[I]!==N&&(i.vertexAttribDivisor(I,N),G[I]=N)}function v(){let I=r.newAttributes,N=r.enabledAttributes;for(let O=0,L=N.length;O<L;O++)N[O]!==I[O]&&(i.disableVertexAttribArray(O),N[O]=0)}function M(I,N,O,L,G,X,k){k===!0?i.vertexAttribIPointer(I,N,O,G,X):i.vertexAttribPointer(I,N,O,L,G,X)}function y(I,N,O,L){_();let G=L.attributes,X=O.getAttributes(),k=N.defaultAttributeValues;for(let ne in X){let W=X[ne];if(W.location>=0){let $=G[ne];if($===void 0&&(ne==="instanceMatrix"&&I.instanceMatrix&&($=I.instanceMatrix),ne==="instanceColor"&&I.instanceColor&&($=I.instanceColor)),$!==void 0){let te=$.normalized,Te=$.itemSize,He=e.get($);if(He===void 0)continue;let Y=He.buffer,_e=He.type,we=He.bytesPerElement,Fe=_e===i.INT||_e===i.UNSIGNED_INT||$.gpuType===qa;if($.isInterleavedBufferAttribute){let ve=$.data,Oe=ve.isInterleavedBuffer===!0?ve.stride:ve.itemSize,Ct=$.offset;if(ve.isInstancedInterleavedBuffer||ve.isInstancedBufferAttribute){for(let ke=0;ke<W.locationSize;ke++)g(W.location+ke,ve.meshPerAttribute);I.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=ve.meshPerAttribute*ve.count)}else for(let ke=0;ke<W.locationSize;ke++)m(W.location+ke);i.bindBuffer(i.ARRAY_BUFFER,Y);for(let ke=0;ke<W.locationSize;ke++)M(W.location+ke,Te/W.locationSize,_e,te,Oe*we,(Ct+Te/W.locationSize*ke)*we,Fe)}else{if($.isInstancedBufferAttribute){for(let ve=0;ve<W.locationSize;ve++)g(W.location+ve,$.meshPerAttribute);I.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let ve=0;ve<W.locationSize;ve++)m(W.location+ve);i.bindBuffer(i.ARRAY_BUFFER,Y);for(let ve=0;ve<W.locationSize;ve++)M(W.location+ve,Te/W.locationSize,_e,te,Te*we,Te/W.locationSize*ve*we,Fe)}}else if(k!==void 0){let te=k[ne];if(te!==void 0)switch(te.length){case 2:i.vertexAttrib2fv(W.location,te);break;case 3:i.vertexAttrib3fv(W.location,te);break;case 4:i.vertexAttrib4fv(W.location,te);break;default:i.vertexAttrib1fv(W.location,te)}}}}v()}function w(){P();for(let I in n){let N=n[I];for(let O in N){let L=N[O];for(let G in L){let X=L[G];for(let k in X)h(X[k].object),delete X[k];delete L[G]}}delete n[I]}}function b(I){if(n[I.id]===void 0)return;let N=n[I.id];for(let O in N){let L=N[O];for(let G in L){let X=L[G];for(let k in X)h(X[k].object),delete X[k];delete L[G]}}delete n[I.id]}function x(I){for(let N in n){let O=n[N];for(let L in O){let G=O[L];if(G[I.id]===void 0)continue;let X=G[I.id];for(let k in X)h(X[k].object),delete X[k];delete G[I.id]}}}function E(I){for(let N in n){let O=n[N],L=I.isInstancedMesh===!0?I.id:0,G=O[L];if(G!==void 0){for(let X in G){let k=G[X];for(let ne in k)h(k[ne].object),delete k[ne];delete G[X]}delete O[L],Object.keys(O).length===0&&delete n[N]}}}function P(){A(),o=!0,r!==s&&(r=s,c(r.object))}function A(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:P,resetDefaultState:A,dispose:w,releaseStatesOfGeometry:b,releaseStatesOfObject:E,releaseStatesOfProgram:x,initAttributes:_,enableAttribute:m,disableUnusedAttributes:v}}function ix(i,e,t){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function o(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),t.update(c,n,h))}function a(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let d=0;for(let p=0;p<h;p++)d+=c[p];t.update(d,n,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function sx(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let x=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(x.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(x){return!(x!==Dn&&n.convert(x)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(x){let E=x===hn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(x!==bn&&x!==Tn&&!E&&n.convert(x)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(x){if(x==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";x="mediump"}return x==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(Ge("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),d=t.logarithmicDepthBuffer===!0&&u===!1;t.reversedDepthBuffer===!0&&u===!1&&Ge("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),t.logarithmicDepthBuffer===!0&&u===!0&&Ge("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");let p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),f=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),g=i.getParameter(i.MAX_VERTEX_ATTRIBS),v=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),w=i.getParameter(i.MAX_SAMPLES),b=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:p,maxVertexTextures:f,maxTextureSize:_,maxCubemapSize:m,maxAttributes:g,maxVertexUniforms:v,maxVaryings:M,maxFragmentUniforms:y,maxSamples:w,samples:b}}function rx(i){let e=this,t=null,n=0,s=!1,r=!1,o=new Xn,a=new Ye,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let p=u.length!==0||d||n!==0||s;return s=d,n=u.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,p){let f=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,g=i.get(u);if(!s||f===null||f.length===0||r&&!m)r?h(null):c();else{let v=r?0:n,M=v*4,y=g.clippingState||null;l.value=y,y=h(f,d,M,p);for(let w=0;w!==M;++w)y[w]=t[w];g.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,p,f){let _=u!==null?u.length:0,m=null;if(_!==0){if(m=l.value,f!==!0||m===null){let g=p+_*4,v=d.matrixWorldInverse;a.getNormalMatrix(v),(m===null||m.length<g)&&(m=new Float32Array(g));for(let M=0,y=p;M!==_;++M,y+=4)o.copy(u[M]).applyMatrix4(v,a),o.normal.toArray(m,y),m[y+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}var xo=class extends Gt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new zr(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Xe(5,5,5),r=new kt({name:"CubemapFromEquirect",uniforms:fs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:cn,blending:cs});r.uniforms.tEquirect.value=t;let o=new ie(s,r),a=t.minFilter;return t.minFilter===Ln&&(t.minFilter=$t),new js(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}},Fd=256,ox=3,ax=20,of=256,af=16,lx=3,cx=new C,hx=new Pe,sr=class i{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new js(1,10,null),this._boxMesh=new ie(new Xe(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){let{size:o=256,position:a=cx}=r,l=this._renderer;this._setSize(o);let c=this._allocateTarget(),h=this._getSourceTarget(!0);t>0&&(h.texture.mipmapsAutoUpdate=!1);let u=l.autoClear,d=l.autoClearColor,p=l.autoClearDepth,f=l.autoClearStencil,_=e.background;l.autoClear=!0,l.autoClearColor=!0,l.autoClearDepth=!0,l.autoClearStencil=!0,_===null&&(e.background=l.getClearColor(hx));let m=new js(n,s,h);return m.position.copy(a),m.update(l,e),l.autoClear=u,l.autoClearColor=d,l.autoClearDepth=p,l.autoClearStencil=f,e.background=_,t>0&&(h.texture.mipmapsAutoUpdate=!0,this._blur(c,t)),this._applyPMREM(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=zd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Bd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(Fd,ph(e))}_fromTexture(e,t){e.mapping===us||e.mapping===tr?this._setSize(e.image.length===0?Fd:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);let n=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(n),n}_allocateTarget(){let e=this._cubeSize,t=Od(e,!1,!1),n=Math.log2(e)-ox;for(let s=0;s<=n;s++)t.texture.mipmaps.push({width:e>>s,height:e>>s});return t.texture.name="PMREM",t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){let t=this._cubeSize,n=this._sourceTarget;return(n===null||n.width!==t||e&&n.depthBuffer===!1)&&(n!==null&&n.dispose(),this._sourceTarget=Od(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,n){let s=this._boxMesh,r=this._cubeCamera;s.material=n,r.renderTarget=e,r.activeMipmapLevel=t;let o=e.width>>t;e.viewport.set(0,0,o,o),r.update(this._renderer,s),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===us||e.mapping===tr?(this._cubemapMaterial===null&&(this._cubemapMaterial=zd()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=Bd()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(e){this._ggxMaterial===null&&(this._ggxMaterial=ux(),this._integrationMaterial=dx());let t=this._cubeSize,n=e.texture.mipmaps.length-1,s=this._ggxMaterial.uniforms;s.envMap.value=this._sourceTarget.texture;let r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(t/af);for(let o=0;o<=n;o++){let a=i.lodToRoughness(o,n);if(o>n-lx)r.roughness.value=a,this._renderCube(e,o,this._integrationMaterial);else{let l=a>0?Math.log2(t)+.5*Math.log2(6/(of*Math.pow(a,4)))+.5:0;s.roughness.value=a,s.lodBias.value=l,this._renderCube(e,o,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=fx());let n=this._blurMaterial,s=n.uniforms,r=this._sourceTarget;s.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,s.envMap.value=r.texture,this._renderCube(e,0,n),s.envMap.value=e.texture,this._renderCube(r,0,n)}};function Od(i,e,t){return new xo(i,{minFilter:Ln,generateMipmaps:e,type:hn,colorSpace:rs,depthBuffer:t})}function _o(i,e,t){return new kt({name:i,uniforms:e,vertexShader:et.cube_vert,fragmentShader:t,side:cn,blending:cs,depthTest:!1,depthWrite:!1})}function ux(){return _o("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${of}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function dx(){return _o("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:af}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function fx(){return _o("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${ax}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function Bd(){return _o("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function zd(){return _o("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function px(i){let e=new WeakMap,t=new WeakMap,n=null;function s(d,p=!1){return d==null?null:p?o(d):r(d)}function r(d){if(d&&d.isTexture){let p=d.mapping;if(p===Va||p===Wa)if(e.has(d)){let f=e.get(d).texture;return a(f,d.mapping)}else{let f=d.image;if(f&&f.height>0){let _=new xo(f.height);return _.fromEquirectangularTexture(i,d),e.set(d,_),d.addEventListener("dispose",c),a(_.texture,d.mapping)}else return null}}return d}function o(d){if(d&&d.isTexture&&d.isPMREMTexture!==!0){let p=d.mapping,f=p===Va||p===Wa,_=p===us||p===tr;if(f||_){let m=t.get(d),g=m!==void 0?m.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==g)return n===null&&(n=new sr(i)),m=f?n.fromEquirectangular(d,m):n.fromCubemap(d,m),m.texture.pmremVersion=d.pmremVersion,t.set(d,m),m.texture;if(m!==void 0)return m.texture;{let v=d.image;return f&&v&&v.height>0||_&&v&&l(v)?(n===null&&(n=new sr(i)),m=f?n.fromEquirectangular(d):n.fromCubemap(d),m.texture.pmremVersion=d.pmremVersion,t.set(d,m),d.addEventListener("dispose",h),m.texture):null}}}return d}function a(d,p){return p===Va?d.mapping=us:p===Wa&&(d.mapping=tr),d}function l(d){let p=0,f=6;for(let _=0;_<f;_++)d[_]!==void 0&&p++;return p===f}function c(d){let p=d.target;p.removeEventListener("dispose",c);let f=e.get(p);f!==void 0&&(e.delete(p),f.dispose())}function h(d){let p=d.target;p.removeEventListener("dispose",h);let f=t.get(p);f!==void 0&&(t.delete(p),f.dispose())}function u(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:u}}function mx(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&Mr("WebGLRenderer: "+n+" extension not supported."),s}}}function gx(i,e,t,n){let s={},r=new WeakMap,o=new FinalizationRegistry(f=>delete s[f]);function a(f){l(f.target)}function l(f){f.index!==null&&e.remove(f.index);for(let m in f.attributes)e.remove(f.attributes[m]);f.removeEventListener("dispose",a),delete s[f.id],o.unregister(f);let _=r.get(f);_&&(e.remove(_),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function c(f,_){return s[_.id]!==void 0||(_.addEventListener("dispose",a),s[_.id]=new WeakRef(_),o.register(_,_.id,_),t.memory.geometries++),_}function h(f){let _=f.attributes;for(let m in _)e.update(_[m],i.ARRAY_BUFFER)}function u(f){let _=f.index,m=f.attributes.position,g=0;if(m===void 0)return;let v=_!==null?_.array.length:m.array.length/3-1,M=m.count>=65535?Nr:Dr,y=new M(Math.ceil(v/3)*6,1),w=y.array;if(_!==null){let x=_.array;g=_.version;for(let E=0,P=0;E<v;E+=3){let A=x[E+0],I=x[E+1],N=x[E+2];w[P++]=A,w[P++]=I,w[P++]=I,w[P++]=N,w[P++]=N,w[P++]=A}}else{g=m.version;for(let x=0,E=0;x<v;x+=3){let P=x+0,A=x+1,I=x+2;w[E++]=P,w[E++]=A,w[E++]=A,w[E++]=I,w[E++]=I,w[E++]=P}}y.version=g;let b=r.get(f);b&&e.remove(b),r.set(f,y)}function d(f){let _=r.get(f);if(_){let m=f.index;m!==null&&_.version<m.version&&u(f)}else u(f);return r.get(f)}function p(){for(let f in s){let _=s[f].deref();_!==void 0&&l(_)}}return{get:c,update:h,getWireframeAttribute:d,dispose:p}}function xx(i,e,t){let n;function s(u){n=u}let r,o;function a(u){r=u.type,o=u.bytesPerElement}function l(u,d){i.drawElements(n,d,r,u*o),t.update(d,n,1)}function c(u,d,p){p!==0&&(i.drawElementsInstanced(n,d,r,u*o,p),t.update(d,n,p))}function h(u,d,p){if(p===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,u,0,p);let _=0;for(let m=0;m<p;m++)_+=d[m];t.update(_,n,1)}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function _x(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:We("WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function vx(i,e,t){let n=new WeakMap,s=new Rt;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(a);if(d===void 0||d.count!==u){let P=function(){x.dispose(),n.delete(a),a.removeEventListener("dispose",P)};d!==void 0&&d.texture.dispose();let p=a.morphAttributes.position!==void 0,f=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],g=a.morphAttributes.normal||[],v=a.morphAttributes.color||[],M=0;p===!0&&(M=1),f===!0&&(M=2),_===!0&&(M=3);let y=a.attributes.position.count*M,w=1;y>e.maxTextureSize&&(w=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);let b=new Float32Array(y*w*4*u),x=new Ir(b,y,w,u);x.type=Tn,x.needsUpdate=!0;let E=M*4;for(let A=0;A<u;A++){let I=m[A],N=g[A],O=v[A],L=y*w*4*A;for(let G=0;G<I.count;G++){let X=G*E;p===!0&&(s.fromBufferAttribute(I,G),b[L+X+0]=s.x,b[L+X+1]=s.y,b[L+X+2]=s.z,b[L+X+3]=0),f===!0&&(s.fromBufferAttribute(N,G),b[L+X+4]=s.x,b[L+X+5]=s.y,b[L+X+6]=s.z,b[L+X+7]=0),_===!0&&(s.fromBufferAttribute(O,G),b[L+X+8]=s.x,b[L+X+9]=s.y,b[L+X+10]=s.z,b[L+X+11]=O.itemSize===4?s.w:1)}}d={count:u,texture:x,size:new ee(y,w)},n.set(a,d),a.addEventListener("dispose",P)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let p=0;for(let _=0;_<c.length;_++)p+=c[_];let f=a.morphTargetsRelative?1:1-p;l.getUniforms().setValue(i,"morphTargetBaseInfluence",f),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function yx(i,e,t,n,s){let r=new WeakMap;function o(c){let h=s.render.frame,u=c.geometry,d=e.get(c,u);if(r.get(d)!==h&&(e.update(d),r.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let p=c.skeleton;r.get(p)!==h&&(p.update(),r.set(p,h))}return d}function a(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:o,dispose:a}}var Mx={[Zc]:"LINEAR_TONE_MAPPING",[Jc]:"REINHARD_TONE_MAPPING",[Kc]:"CINEON_TONE_MAPPING",[$c]:"ACES_FILMIC_TONE_MAPPING",[Qc]:"AGX_TONE_MAPPING",[eh]:"NEUTRAL_TONE_MAPPING",[jc]:"CUSTOM_TONE_MAPPING"};function Sx(i,e,t,n,s,r){let o=new Gt(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,l=null,c=null,h=new xt;h.setAttribute("position",new ze([-1,3,0,-1,-1,0,3,-1,0],3)),h.setAttribute("uv",new ze([0,2,0,0,2,0],2));let u=new Ra({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new ie(h,u),p=new Ti(-1,1,1,-1,0,1),f=null,_=null,m=!1,g,v=null,M=[],y=!1;this.setSize=function(w,b){o.setSize(w,b),a!==null&&a.setSize(w,b),l!==null&&l.setSize(w,b);for(let x=0;x<M.length;x++){let E=M[x];E.setSize&&E.setSize(w,b)}},this.setEffects=function(w){M=w,y=M.length>0&&M[0].isRenderPass===!0;let b=o.width,x=o.height;M.length>0&&a===null&&(a=new Gt(b,x,{type:hn,depthBuffer:!1,stencilBuffer:!1}),l=new Gt(b,x,{type:hn,depthBuffer:!1,stencilBuffer:!1}));let E=s===!0&&M.some(P=>P.needsDepthTexture===!0);E!==(o.depthTexture!==null)&&(E===!0&&c===null&&(c=new Ei(b,x),r===!0&&(c.format=wi,c.type=ds)),o.dispose(),o.depthTexture=E?c:null,o.resolveDepthBuffer=E,o.storeMultisampledDepthBuffer=E);for(let P=0;P<M.length;P++){let A=M[P];A.setSize&&A.setSize(b,x),E&&A.needsDepthTexture===!0&&A.setDepthTexture&&A.setDepthTexture(c)}},this.begin=function(w,b){if(m||w.toneMapping===Bn&&M.length===0)return!1;if(v=b,b!==null){let x=b.width,E=b.height;(o.width!==x||o.height!==E)&&this.setSize(x,E)}return y===!1&&w.setRenderTarget(o),g=w.toneMapping,w.toneMapping=Bn,!0},this.hasRenderPass=function(){return y},this.end=function(w,b){w.toneMapping=g,m=!0;let x=o,E=a;for(let P=0;P<M.length;P++){let A=M[P];A.enabled!==!1&&(A.render(w,E,x,b),A.needsSwap!==!1&&(x=E,E=E===a?l:a))}if(f!==w.outputColorSpace||_!==w.toneMapping){f=w.outputColorSpace,_=w.toneMapping,u.defines={},ft.getTransfer(f)===Mt&&(u.defines.SRGB_TRANSFER="");let P=Mx[_];P&&(u.defines[P]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=x.texture,w.setRenderTarget(v),w.render(d,p),v=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),h.dispose(),u.dispose()}}var lf=new yn,cf=new Ei(1,1),hf=new Hr(1),uf=new Ir,df=new xa,ff=new zr,Hd=[],Gd=[],kd=new Float32Array(16),Vd=new Float32Array(9),Wd=new Float32Array(4);function rr(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=Hd[s];if(r===void 0&&(r=new Float32Array(s),Hd[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function Qt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function en(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Nl(i,e){let t=Gd[e];t===void 0&&(t=new Int32Array(e),Gd[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Ex(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function bx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Qt(t,e))return;i.uniform2fv(this.addr,e),en(t,e)}}function Tx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Qt(t,e))return;i.uniform3fv(this.addr,e),en(t,e)}}function wx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Qt(t,e))return;i.uniform4fv(this.addr,e),en(t,e)}}function Ax(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Qt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),en(t,e)}else{if(Qt(t,n))return;Wd.set(n),i.uniformMatrix2fv(this.addr,!1,Wd),en(t,n)}}function Rx(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Qt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),en(t,e)}else{if(Qt(t,n))return;Vd.set(n),i.uniformMatrix3fv(this.addr,!1,Vd),en(t,n)}}function Cx(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Qt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),en(t,e)}else{if(Qt(t,n))return;kd.set(n),i.uniformMatrix4fv(this.addr,!1,kd),en(t,n)}}function Ix(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Px(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Qt(t,e))return;i.uniform2iv(this.addr,e),en(t,e)}}function Lx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Qt(t,e))return;i.uniform3iv(this.addr,e),en(t,e)}}function Dx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Qt(t,e))return;i.uniform4iv(this.addr,e),en(t,e)}}function Nx(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Ux(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Qt(t,e))return;i.uniform2uiv(this.addr,e),en(t,e)}}function Fx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Qt(t,e))return;i.uniform3uiv(this.addr,e),en(t,e)}}function Ox(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Qt(t,e))return;i.uniform4uiv(this.addr,e),en(t,e)}}function Ul(i){return i.version===0&&(i.compareFunction=hh,i.needsUpdate=!0),i}function Bx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?r=Ul(cf):r=lf,t.setTexture2D(e||r,s)}function zx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||df,s)}function Hx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_CUBE_SHADOW?r=Ul(hf):r=ff,t.setTextureCube(e||r,s)}function Gx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||uf,s)}function kx(i){switch(i){case 5126:return Ex;case 35664:return bx;case 35665:return Tx;case 35666:return wx;case 35674:return Ax;case 35675:return Rx;case 35676:return Cx;case 5124:case 35670:return Ix;case 35667:case 35671:return Px;case 35668:case 35672:return Lx;case 35669:case 35673:return Dx;case 5125:return Nx;case 36294:return Ux;case 36295:return Fx;case 36296:return Ox;case 35678:case 36198:case 36298:case 36306:case 35682:return Bx;case 35679:case 36299:case 36307:return zx;case 35680:case 36300:case 36308:case 36293:return Hx;case 36289:case 36303:case 36311:case 36292:return Gx}}function Vx(i,e){i.uniform1fv(this.addr,e)}function Wx(i,e){let t=rr(e,this.size,2);i.uniform2fv(this.addr,t)}function Xx(i,e){let t=rr(e,this.size,3);i.uniform3fv(this.addr,t)}function qx(i,e){let t=rr(e,this.size,4);i.uniform4fv(this.addr,t)}function Yx(i,e){let t=rr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Zx(i,e){let t=rr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Jx(i,e){let t=rr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Kx(i,e){i.uniform1iv(this.addr,e)}function $x(i,e){i.uniform2iv(this.addr,e)}function jx(i,e){i.uniform3iv(this.addr,e)}function Qx(i,e){i.uniform4iv(this.addr,e)}function e_(i,e){i.uniform1uiv(this.addr,e)}function t_(i,e){i.uniform2uiv(this.addr,e)}function n_(i,e){i.uniform3uiv(this.addr,e)}function i_(i,e){i.uniform4uiv(this.addr,e)}function s_(i,e,t){let n=this.cache,s=e.length,r=Nl(t,s);Qt(n,r)||(i.uniform1iv(this.addr,r),en(n,r));let o;this.type===i.SAMPLER_2D_SHADOW?o=Ul(cf):o=lf;for(let a=0;a!==s;++a)t.setTexture2D(e[a]||o,r[a])}function r_(i,e,t){let n=this.cache,s=e.length,r=Nl(t,s);Qt(n,r)||(i.uniform1iv(this.addr,r),en(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||df,r[o])}function o_(i,e,t){let n=this.cache,s=e.length,r=Nl(t,s);Qt(n,r)||(i.uniform1iv(this.addr,r),en(n,r));let o;this.type===i.SAMPLER_CUBE_SHADOW?o=Ul(hf):o=ff;for(let a=0;a!==s;++a)t.setTextureCube(e[a]||o,r[a])}function a_(i,e,t){let n=this.cache,s=e.length,r=Nl(t,s);Qt(n,r)||(i.uniform1iv(this.addr,r),en(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||uf,r[o])}function l_(i){switch(i){case 5126:return Vx;case 35664:return Wx;case 35665:return Xx;case 35666:return qx;case 35674:return Yx;case 35675:return Zx;case 35676:return Jx;case 5124:case 35670:return Kx;case 35667:case 35671:return $x;case 35668:case 35672:return jx;case 35669:case 35673:return Qx;case 5125:return e_;case 36294:return t_;case 36295:return n_;case 36296:return i_;case 35678:case 36198:case 36298:case 36306:case 35682:return s_;case 35679:case 36299:case 36307:return r_;case 35680:case 36300:case 36308:case 36293:return o_;case 36289:case 36303:case 36311:case 36292:return a_}}var bh=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=kx(t.type)}},Th=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=l_(t.type)}},wh=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],n)}}},Sh=/(\w+)(\])?(\[|\.)?/g;function Xd(i,e){i.seq.push(e),i.map[e.id]=e}function c_(i,e,t){let n=i.name,s=n.length;for(Sh.lastIndex=0;;){let r=Sh.exec(n),o=Sh.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Xd(t,c===void 0?new bh(a,i,e):new Th(a,i,e));break}else{let u=t.map[a];u===void 0&&(u=new wh(a),Xd(t,u)),t=u}}}var ir=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){let a=e.getActiveUniform(t,o),l=e.getUniformLocation(t,a.name);c_(a,l,this)}let s=[],r=[];for(let o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&n.push(o)}return n}};function qd(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var h_=37297,u_=0;function d_(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}var Yd=new Ye;function f_(i){ft._getMatrix(Yd,ft.workingColorSpace,i);let e=`mat3( ${Yd.elements.map(t=>t.toFixed(4))} )`;switch(ft.getTransfer(i)){case Ar:return[e,"LinearTransferOETF"];case Mt:return[e,"sRGBTransferOETF"];default:return Ge("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Zd(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+d_(i.getShaderSource(e),a)}else return r}function p_(i,e){let t=f_(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( ${t[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}var m_={[Zc]:"Linear",[Jc]:"Reinhard",[Kc]:"Cineon",[$c]:"ACESFilmic",[Qc]:"AgX",[eh]:"Neutral",[jc]:"Custom"};function g_(i,e){let t=m_[e];return t===void 0?(Ge("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Ll=new C;function x_(){ft.getLuminanceCoefficients(Ll);let i=Ll.x.toFixed(4),e=Ll.y.toFixed(4),t=Ll.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function __(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(go).join(`
`)}function v_(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function y_(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function go(i){return i!==""}function Jd(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,e.numLightProbeGrids)}function Kd(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var M_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ah(i){return i.replace(M_,S_)}function S_(i,e){let t=et[e];if(t===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">");return Ah(t)}var E_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function $d(i){return i.replace(E_,b_)}function b_(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function jd(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}var T_={[oo]:"SHADOWMAP_TYPE_PCF",[Qs]:"SHADOWMAP_TYPE_VSM"};function w_(i){return T_[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var A_={[tr]:"ENVMAP_MODE_REFRACTION"};function R_(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":A_[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var C_={[Yc]:"ENVMAP_BLENDING_MULTIPLY",[fd]:"ENVMAP_BLENDING_MIX",[pd]:"ENVMAP_BLENDING_ADD"};function I_(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":C_[i.combine]||"ENVMAP_BLENDING_NONE"}function P_(i,e,t,n){let s=i.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,l=w_(t),c=t.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",h=R_(t),u=I_(t),d=__(t),p=v_(r),f=s.createProgram(),_,m,g=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(_=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(go).join(`
`),_.length>0&&(_+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(go).join(`
`),m.length>0&&(m+=`
`)):(_=[jd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+t.diffuseRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(go).join(`
`),m=[jd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",t.envMapPMREM?"#define ENVMAP_MAX_LOD "+t.envMapMaxLod+".0":"",t.envMapPMREM?"#define ENVMAP_SIZE "+t.envMapSize+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Bn?"#define TONE_MAPPING":"",t.toneMapping!==Bn?et.tonemapping_pars_fragment:"",t.toneMapping!==Bn?g_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",et.colorspace_pars_fragment,p_("linearToOutputTexel",t.outputColorSpace),x_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(go).join(`
`)),o=Ah(o),o=Jd(o,t),o=Kd(o,t),a=Ah(a),a=Jd(a,t),a=Kd(a,t),o=$d(o),a=$d(a),t.isRawShaderMaterial!==!0&&(g=`#version 300 es
`,_=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+_,m=["#define varying in",t.glslVersion===dh?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===dh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);let v=g+_+o,M=g+m+a,y=qd(s,s.VERTEX_SHADER,v),w=qd(s,s.FRAGMENT_SHADER,M);s.attachShader(f,y),s.attachShader(f,w),t.index0AttributeName!==void 0?s.bindAttribLocation(f,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(f,0,"position"),s.linkProgram(f);function b(A){if(i.debug.checkShaderErrors){let I=s.getProgramInfoLog(f)||"",N=s.getShaderInfoLog(y)||"",O=s.getShaderInfoLog(w)||"",L=I.trim(),G=N.trim(),X=O.trim(),k=!0,ne=!0;if(s.getProgramParameter(f,s.LINK_STATUS)===!1)if(k=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,f,y,w);else{let W=Zd(s,y,"vertex"),$=Zd(s,w,"fragment");We("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(f,s.VALIDATE_STATUS)+`

Material Name: `+A.name+`
Material Type: `+A.type+`

Program Info Log: `+L+`
`+W+`
`+$)}else L!==""?Ge("WebGLProgram: Program Info Log:",L):(G===""||X==="")&&(ne=!1);ne&&(A.diagnostics={runnable:k,programLog:L,vertexShader:{log:G,prefix:_},fragmentShader:{log:X,prefix:m}})}s.deleteShader(y),s.deleteShader(w),x=new ir(s,f),E=y_(s,f)}let x;this.getUniforms=function(){return x===void 0&&b(this),x};let E;this.getAttributes=function(){return E===void 0&&b(this),E};let P=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return P===!1&&(P=s.getProgramParameter(f,h_)),P},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(f),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=u_++,this.cacheKey=e,this.usedTimes=1,this.program=f,this.vertexShader=y,this.fragmentShader=w,this}var L_=0,Rh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Ch(e),t.set(e,n)),n}},Ch=class{constructor(e){this.id=L_++,this.code=e,this.usedTimes=0}};function D_(i){return i===Xi||i===fo||i===po}function N_(i,e,t,n,s,r){let o=new Pr,a=new Rh,l=new Set,c=[],h=new Map,u=n.logarithmicDepthBuffer,d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(x){return l.add(x),x===0?"uv":`uv${x}`}function f(x,E,P,A,I,N){let O=A.fog,L=I.geometry,G=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?A.environment:null,X=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,k=e.get(x.envMap||G,X),ne=d[x.type],W=n.precision;x.precision!==null&&(W=n.getMaxPrecision(x.precision),W!==x.precision&&Ge("WebGLProgram.getParameters:",x.precision,"not supported, using",W,"instead."));let $=L.morphAttributes.position||L.morphAttributes.normal||L.morphAttributes.color,te=$!==void 0?$.length:0,Te=0;L.morphAttributes.position!==void 0&&(Te=1),L.morphAttributes.normal!==void 0&&(Te=2),L.morphAttributes.color!==void 0&&(Te=3);let He,Y,_e,we;if(ne){let ye=ci[ne];He=ye.vertexShader,Y=ye.fragmentShader}else{He=x.vertexShader,Y=x.fragmentShader;let ye=a.getVertexShaderStage(x),St=a.getFragmentShaderStage(x);a.update(x,ye,St),_e=ye.id,we=St.id}let Fe=i.getRenderTarget(),ve=i.state.buffers.depth.getReversed(),Oe=I.isInstancedMesh===!0,Ct=I.isBatchedMesh===!0,ke=!!x.map,tt=!!x.matcap,ot=!!k,Q=ot&&k.isPMREMTexture===!0,he=!!x.aoMap,ae=!!x.lightMap,be=!!x.bumpMap&&x.wireframe===!1,xe=!!x.normalMap,Ke=!!x.displacementMap,Le=!!x.emissiveMap,at=!!x.metalnessMap,ht=!!x.roughnessMap,_t=x.anisotropy>0,F=x.clearcoat>0,Xt=x.diffuseRoughness>0,it=x.dispersion>0,Tt=x.retroreflectivity>0,pe=x.iridescence>0,zt=x.sheen>0,Be=x.transmission>0,qe=_t&&!!x.anisotropyMap,R=F&&!!x.clearcoatMap,S=F&&!!x.clearcoatNormalMap,z=F&&!!x.clearcoatRoughnessMap,se=Xt&&!!x.diffuseRoughnessMap,j=pe&&!!x.iridescenceMap,le=pe&&!!x.iridescenceThicknessMap,me=zt&&!!x.sheenColorMap,Z=zt&&!!x.sheenRoughnessMap,J=!!x.specularMap,ue=!!x.specularColorMap,D=!!x.specularIntensityMap,K=Be&&!!x.transmissionMap,q=Be&&!!x.thicknessMap,de=!!x.gradientMap,oe=!!x.alphaMap,ce=x.alphaTest>0,De=!!x.alphaHash,Qe=!!x.extensions,re=Bn;x.toneMapped&&(Fe===null||Fe.isXRRenderTarget===!0)&&(re=i.toneMapping);let Ne=Q?k.isCompressedCubeTexture?k.image[0].mipmaps:k.mipmaps:null,$e={shaderID:ne,shaderType:x.type,shaderName:x.name,vertexShader:He,fragmentShader:Y,defines:x.defines,customVertexShaderID:_e,customFragmentShaderID:we,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:W,batching:Ct,batchingColor:Ct&&I._colorsTexture!==null,instancing:Oe,instancingColor:Oe&&I.instanceColor!==null,instancingMorph:Oe&&I.morphTexture!==null,outputColorSpace:Fe===null?i.outputColorSpace:Fe.isXRRenderTarget===!0?Fe.texture.colorSpace:ft.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:ke,matcap:tt,envMap:ot,envMapMode:ot&&k.mapping,envMapPMREM:Q,envMapMaxLod:Q?Ne.length-1:null,envMapSize:Q?Ne[0].width:null,aoMap:he,lightMap:ae,bumpMap:be,normalMap:xe,displacementMap:Ke,emissiveMap:Le,normalMapObjectSpace:xe&&x.normalMapType===xd,normalMapTangentSpace:xe&&x.normalMapType===Cl,packedNormalMap:xe&&x.normalMapType===Cl&&D_(x.normalMap.format),metalnessMap:at,roughnessMap:ht,anisotropy:_t,anisotropyMap:qe,clearcoat:F,clearcoatMap:R,clearcoatNormalMap:S,clearcoatRoughnessMap:z,diffuseRoughness:Xt,diffuseRoughnessMap:se,dispersion:it,retroreflection:Tt,iridescence:pe,iridescenceMap:j,iridescenceThicknessMap:le,sheen:zt,sheenColorMap:me,sheenRoughnessMap:Z,specularMap:J,specularColorMap:ue,specularIntensityMap:D,transmission:Be,transmissionMap:K,thicknessMap:q,gradientMap:de,opaque:x.transparent===!1&&x.blending===er&&x.alphaToCoverage===!1,alphaMap:oe,alphaTest:ce,alphaHash:De,combine:x.combine,mapUv:ke&&p(x.map.channel),aoMapUv:he&&p(x.aoMap.channel),lightMapUv:ae&&p(x.lightMap.channel),bumpMapUv:be&&p(x.bumpMap.channel),normalMapUv:xe&&p(x.normalMap.channel),displacementMapUv:Ke&&p(x.displacementMap.channel),emissiveMapUv:Le&&p(x.emissiveMap.channel),metalnessMapUv:at&&p(x.metalnessMap.channel),roughnessMapUv:ht&&p(x.roughnessMap.channel),anisotropyMapUv:qe&&p(x.anisotropyMap.channel),clearcoatMapUv:R&&p(x.clearcoatMap.channel),clearcoatNormalMapUv:S&&p(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:z&&p(x.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:se&&p(x.diffuseRoughnessMap.channel),iridescenceMapUv:j&&p(x.iridescenceMap.channel),iridescenceThicknessMapUv:le&&p(x.iridescenceThicknessMap.channel),sheenColorMapUv:me&&p(x.sheenColorMap.channel),sheenRoughnessMapUv:Z&&p(x.sheenRoughnessMap.channel),specularMapUv:J&&p(x.specularMap.channel),specularColorMapUv:ue&&p(x.specularColorMap.channel),specularIntensityMapUv:D&&p(x.specularIntensityMap.channel),transmissionMapUv:K&&p(x.transmissionMap.channel),thicknessMapUv:q&&p(x.thicknessMap.channel),alphaMapUv:oe&&p(x.alphaMap.channel),vertexTangents:!!L.attributes.tangent&&(xe||_t),vertexNormals:!!L.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!L.attributes.color&&L.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!L.attributes.uv&&(ke||oe),fog:!!O,useFog:x.fog===!0,fogExp2:!!O&&O.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||L.attributes.normal===void 0&&xe===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:ve,skinning:I.isSkinnedMesh===!0,hasPositionAttribute:L.attributes.position!==void 0,morphTargets:L.morphAttributes.position!==void 0,morphNormals:L.morphAttributes.normal!==void 0,morphColors:L.morphAttributes.color!==void 0,morphTargetsCount:te,morphTextureStride:Te,numSunLights:E.sun.length,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numSunLightShadows:E.sunShadowMap.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numLightProbeGrids:N.filter(ye=>ye.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:i.shadowMap.enabled&&P.length>0,shadowMapType:i.shadowMap.type,toneMapping:re,decodeVideoTexture:ke&&x.map.isVideoTexture===!0&&ft.getTransfer(x.map.colorSpace)===Mt,decodeVideoTextureEmissive:Le&&x.emissiveMap.isVideoTexture===!0&&ft.getTransfer(x.emissiveMap.colorSpace)===Mt,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===Ot,flipSided:x.side===cn,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:Qe&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Qe&&x.extensions.multiDraw===!0||Ct)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return $e.vertexUv1s=l.has(1),$e.vertexUv2s=l.has(2),$e.vertexUv3s=l.has(3),l.clear(),$e}function _(x){let E=[];if(x.shaderID?E.push(x.shaderID):(E.push(x.customVertexShaderID),E.push(x.customFragmentShaderID)),x.defines!==void 0)for(let P in x.defines)E.push(P),E.push(x.defines[P]);return x.isRawShaderMaterial===!1&&(m(E,x),g(E,x),E.push(i.outputColorSpace)),E.push(x.customProgramCacheKey),E.join()}function m(x,E){x.push(E.precision),x.push(E.outputColorSpace),x.push(E.envMapMode),x.push(E.envMapPMREM),x.push(E.envMapMaxLod),x.push(E.envMapSize),x.push(E.mapUv),x.push(E.alphaMapUv),x.push(E.lightMapUv),x.push(E.aoMapUv),x.push(E.bumpMapUv),x.push(E.normalMapUv),x.push(E.displacementMapUv),x.push(E.emissiveMapUv),x.push(E.metalnessMapUv),x.push(E.roughnessMapUv),x.push(E.anisotropyMapUv),x.push(E.clearcoatMapUv),x.push(E.clearcoatNormalMapUv),x.push(E.clearcoatRoughnessMapUv),x.push(E.diffuseRoughnessMapUv),x.push(E.iridescenceMapUv),x.push(E.iridescenceThicknessMapUv),x.push(E.sheenColorMapUv),x.push(E.sheenRoughnessMapUv),x.push(E.specularMapUv),x.push(E.specularColorMapUv),x.push(E.specularIntensityMapUv),x.push(E.transmissionMapUv),x.push(E.thicknessMapUv),x.push(E.combine),x.push(E.fogExp2),x.push(E.sizeAttenuation),x.push(E.morphTargetsCount),x.push(E.numSunLights),x.push(E.numDirLights),x.push(E.numPointLights),x.push(E.numSpotLights),x.push(E.numSpotLightMaps),x.push(E.numHemiLights),x.push(E.numRectAreaLights),x.push(E.numSunLightShadows),x.push(E.numDirLightShadows),x.push(E.numPointLightShadows),x.push(E.numSpotLightShadows),x.push(E.numSpotLightShadowsWithMaps),x.push(E.numLightProbes),x.push(E.numLightProbeGrids),x.push(E.shadowMapType),x.push(E.toneMapping),x.push(E.numClippingPlanes),x.push(E.numClipIntersection),x.push(E.depthPacking)}function g(x,E){o.disableAll(),E.instancing&&o.enable(0),E.instancingColor&&o.enable(1),E.instancingMorph&&o.enable(2),E.matcap&&o.enable(3),E.envMap&&o.enable(4),E.normalMapObjectSpace&&o.enable(5),E.normalMapTangentSpace&&o.enable(6),E.clearcoat&&o.enable(7),E.iridescence&&o.enable(8),E.alphaTest&&o.enable(9),E.vertexColors&&o.enable(10),E.vertexAlphas&&o.enable(11),E.vertexUv1s&&o.enable(12),E.vertexUv2s&&o.enable(13),E.vertexUv3s&&o.enable(14),E.vertexTangents&&o.enable(15),E.anisotropy&&o.enable(16),E.alphaHash&&o.enable(17),E.batching&&o.enable(18),E.dispersion&&o.enable(19),E.retroreflection&&o.enable(24),E.diffuseRoughness&&o.enable(25),E.batchingColor&&o.enable(20),E.gradientMap&&o.enable(21),E.packedNormalMap&&o.enable(22),E.vertexNormals&&o.enable(23),x.push(o.mask),o.disableAll(),E.fog&&o.enable(0),E.useFog&&o.enable(1),E.flatShading&&o.enable(2),E.logarithmicDepthBuffer&&o.enable(3),E.reversedDepthBuffer&&o.enable(4),E.skinning&&o.enable(5),E.morphTargets&&o.enable(6),E.morphNormals&&o.enable(7),E.morphColors&&o.enable(8),E.premultipliedAlpha&&o.enable(9),E.shadowMapEnabled&&o.enable(10),E.doubleSided&&o.enable(11),E.flipSided&&o.enable(12),E.useDepthPacking&&o.enable(13),E.dithering&&o.enable(14),E.transmission&&o.enable(15),E.sheen&&o.enable(16),E.opaque&&o.enable(17),E.pointsUvs&&o.enable(18),E.decodeVideoTexture&&o.enable(19),E.decodeVideoTextureEmissive&&o.enable(20),E.alphaToCoverage&&o.enable(21),E.numLightProbeGrids>0&&o.enable(22),E.hasPositionAttribute&&o.enable(23),x.push(o.mask)}function v(x){let E=d[x.type],P;if(E){let A=ci[E];P=ps.clone(A.uniforms)}else P=x.uniforms;return P}function M(x,E){let P=h.get(E);return P!==void 0?++P.usedTimes:(P=new P_(i,E,x,s),c.push(P),h.set(E,P)),P}function y(x){if(--x.usedTimes===0){let E=c.indexOf(x);c[E]=c[c.length-1],c.pop(),h.delete(x.cacheKey),x.destroy()}}function w(x){a.remove(x)}function b(){a.dispose()}return{getParameters:f,getProgramCacheKey:_,getUniforms:v,acquireProgram:M,releaseProgram:y,releaseShaderCache:w,programs:c,dispose:b}}function U_(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function F_(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function Qd(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function ef(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(d){let p=0;return d.isInstancedMesh&&(p+=2),d.isSkinnedMesh&&(p+=1),p}function a(d,p,f,_,m,g){let v=i[e];return v===void 0?(v={id:d.id,object:d,geometry:p,material:f,materialVariant:o(d),groupOrder:_,renderOrder:d.renderOrder,z:m,group:g},i[e]=v):(v.id=d.id,v.object=d,v.geometry=p,v.material=f,v.materialVariant=o(d),v.groupOrder=_,v.renderOrder=d.renderOrder,v.z=m,v.group=g),e++,v}function l(d,p,f,_,m,g,v){v.reversedDepth===!0&&(m=-m);let M=a(d,p,f,_,m,g);f.transmission>0?n.push(M):f.transparent===!0?s.push(M):t.push(M)}function c(d,p,f,_,m,g){let v=a(d,p,f,_,m,g);f.transmission>0?n.unshift(v):f.transparent===!0?s.unshift(v):t.unshift(v)}function h(d,p){t.length>1&&t.sort(d||F_),n.length>1&&n.sort(p||Qd),s.length>1&&s.sort(p||Qd)}function u(){for(let d=e,p=i.length;d<p;d++){let f=i[d];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:u,sort:h}}function O_(){let i=new WeakMap;function e(n,s){let r=i.get(n),o;return r===void 0?(o=new ef,i.set(n,[o])):s>=r.length?(o=new ef,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function B_(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new C,color:new Pe};break;case"SpotLight":t={position:new C,direction:new C,color:new Pe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new C,color:new Pe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new C,skyColor:new Pe,groundColor:new Pe};break;case"RectAreaLight":t={color:new Pe,position:new C,halfWidth:new C,halfHeight:new C};break}return i[e.id]=t,t}}}function z_(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ee};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ee};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ee,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var H_=0;function G_(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function k_(i){let e=new B_,t=z_(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new C);let s=new C,r=new je,o=new je;function a(c){let h=0,u=0,d=0;for(let N=0;N<9;N++)n.probe[N].set(0,0,0);let p=0,f=0,_=0,m=0,g=0,v=0,M=0,y=0,w=0,b=0,x=0,E=0,P=0,A=0;c.sort(G_);for(let N=0,O=c.length;N<O;N++){let L=c[N],G=L.color,X=L.intensity,k=L.distance,ne=null;if(L.shadow&&L.shadow.map&&(L.shadow.map.texture.format===Xi?ne=L.shadow.map.texture:ne=L.shadow.map.depthTexture||L.shadow.map.texture),L.isAmbientLight)h+=G.r*X,u+=G.g*X,d+=G.b*X;else if(L.isLightProbe){for(let W=0;W<9;W++)n.probe[W].addScaledVector(L.sh.coefficients[W],X);A++}else if(L.isSunLight){let W=e.get(L);if(W.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let $=L.shadow,te=t.get(L);te.shadowIntensity=$.intensity,te.shadowBias=$.bias,te.shadowNormalBias=$.normalBias,te.shadowRadius=$.radius,te.shadowMapSize.copy($.mapSize).multiply($.getFrameExtents()),n.sunShadow[f]=te,n.sunShadowMap[f]=ne;let Te=$.getViewportCount();for(let He=0;He<Te;He++)n.sunShadowMatrix[_+He]=$.getMatrix(He),n.sunShadowCascade[_+He]=$._cascadeData[He];_+=Te,f++}n.sun[p]=W,p++}else if(L.isDirectionalLight){let W=e.get(L);if(W.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let $=L.shadow,te=t.get(L);te.shadowIntensity=$.intensity,te.shadowBias=$.bias,te.shadowNormalBias=$.normalBias,te.shadowRadius=$.radius,te.shadowMapSize=$.mapSize,n.directionalShadow[m]=te,n.directionalShadowMap[m]=ne,n.directionalShadowMatrix[m]=L.shadow.matrix,w++}n.directional[m]=W,m++}else if(L.isSpotLight){let W=e.get(L);W.position.setFromMatrixPosition(L.matrixWorld),W.color.copy(G).multiplyScalar(X),W.distance=k,W.coneCos=Math.cos(L.angle),W.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),W.decay=L.decay,n.spot[v]=W;let $=L.shadow;if(L.map&&(n.spotLightMap[E]=L.map,E++,$.updateMatrices(L),L.castShadow&&P++),n.spotLightMatrix[v]=$.matrix,L.castShadow){let te=t.get(L);te.shadowIntensity=$.intensity,te.shadowBias=$.bias,te.shadowNormalBias=$.normalBias,te.shadowRadius=$.radius,te.shadowMapSize=$.mapSize,n.spotShadow[v]=te,n.spotShadowMap[v]=ne,x++}v++}else if(L.isRectAreaLight){let W=e.get(L);W.color.copy(G).multiplyScalar(X),W.halfWidth.set(L.width*.5,0,0),W.halfHeight.set(0,L.height*.5,0),n.rectArea[M]=W,M++}else if(L.isPointLight){let W=e.get(L);if(W.color.copy(L.color).multiplyScalar(L.intensity),W.distance=L.distance,W.decay=L.decay,L.castShadow){let $=L.shadow,te=t.get(L);te.shadowIntensity=$.intensity,te.shadowBias=$.bias,te.shadowNormalBias=$.normalBias,te.shadowRadius=$.radius,te.shadowMapSize=$.mapSize,te.shadowCameraNear=$.camera.near,te.shadowCameraFar=$.camera.far,n.pointShadow[g]=te,n.pointShadowMap[g]=ne,n.pointShadowMatrix[g]=L.shadow.matrix,b++}n.point[g]=W,g++}else if(L.isHemisphereLight){let W=e.get(L);W.skyColor.copy(L.color).multiplyScalar(X),W.groundColor.copy(L.groundColor).multiplyScalar(X),n.hemi[y]=W,y++}}M>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Me.LTC_FLOAT_1,n.rectAreaLTC2=Me.LTC_FLOAT_2):(n.rectAreaLTC1=Me.LTC_HALF_1,n.rectAreaLTC2=Me.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let I=n.hash;(I.sunLength!==p||I.directionalLength!==m||I.pointLength!==g||I.spotLength!==v||I.rectAreaLength!==M||I.hemiLength!==y||I.numSunShadows!==f||I.numDirectionalShadows!==w||I.numPointShadows!==b||I.numSpotShadows!==x||I.numSpotMaps!==E||I.numLightProbes!==A)&&(n.sun.length=p,n.directional.length=m,n.spot.length=v,n.rectArea.length=M,n.point.length=g,n.hemi.length=y,n.sunShadow.length=f,n.sunShadowMap.length=f,n.sunShadowMatrix.length=_,n.sunShadowCascade.length=_,n.directionalShadow.length=w,n.directionalShadowMap.length=w,n.directionalShadowMatrix.length=w,n.pointShadow.length=b,n.pointShadowMap.length=b,n.pointShadowMatrix.length=b,n.spotShadow.length=x,n.spotShadowMap.length=x,n.spotLightMatrix.length=x+E-P,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=P,n.numLightProbes=A,I.sunLength=p,I.directionalLength=m,I.pointLength=g,I.spotLength=v,I.rectAreaLength=M,I.hemiLength=y,I.numSunShadows=f,I.numDirectionalShadows=w,I.numPointShadows=b,I.numSpotShadows=x,I.numSpotMaps=E,I.numLightProbes=A,n.version=H_++)}function l(c,h){let u=0,d=0,p=0,f=0,_=0,m=0,g=h.matrixWorldInverse;for(let v=0,M=c.length;v<M;v++){let y=c[v];if(y.isSunLight){let w=n.sun[u];w.direction.setFromMatrixPosition(y.matrixWorld),w.direction.transformDirection(g),u++}else if(y.isDirectionalLight){let w=n.directional[d];w.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(g),d++}else if(y.isSpotLight){let w=n.spot[f];w.position.setFromMatrixPosition(y.matrixWorld),w.position.applyMatrix4(g),w.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(g),f++}else if(y.isRectAreaLight){let w=n.rectArea[_];w.position.setFromMatrixPosition(y.matrixWorld),w.position.applyMatrix4(g),o.identity(),r.copy(y.matrixWorld),r.premultiply(g),o.extractRotation(r),w.halfWidth.set(y.width*.5,0,0),w.halfHeight.set(0,y.height*.5,0),w.halfWidth.applyMatrix4(o),w.halfHeight.applyMatrix4(o),_++}else if(y.isPointLight){let w=n.point[p];w.position.setFromMatrixPosition(y.matrixWorld),w.position.applyMatrix4(g),p++}else if(y.isHemisphereLight){let w=n.hemi[m];w.direction.setFromMatrixPosition(y.matrixWorld),w.direction.transformDirection(g),m++}}}return{setup:a,setupView:l,state:n}}function tf(i){let e=new k_(i),t=[],n=[],s=[];function r(u){h.camera=u,t.length=0,n.length=0,s.length=0}function o(u){u.isLightProbeGrid?s.push(u):t.push(u)}function a(u){n.push(u)}function l(){e.setup(t),s.sort((u,d)=>u.priority-d.priority||u.id-d.id)}function c(u){e.setupView(t,u)}let h={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:h,setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function V_(i){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new tf(i),e.set(s,[a])):r>=o.length?(a=new tf(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}var W_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,X_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,q_=[new C(1,0,0),new C(-1,0,0),new C(0,1,0),new C(0,-1,0),new C(0,0,1),new C(0,0,-1)],Y_=[new C(0,-1,0),new C(0,-1,0),new C(0,0,1),new C(0,0,-1),new C(0,-1,0),new C(0,-1,0)],nf=new je,mo=new C,Eh=new C;function Z_(i,e,t){let n=new Hi,s=new ee,r=new ee,o=new Rt,a=new Ca,l=new Ia,c={},h=t.maxTextureSize,u={[Wi]:cn,[cn]:Wi,[Ot]:Ot},d=new kt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ee},radius:{value:4}},vertexShader:W_,fragmentShader:X_}),p=d.clone();p.defines.HORIZONTAL_PASS=1;let f=new xt;f.setAttribute("position",new Lt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new ie(f,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=oo;let g=this.type;this.render=function(b,x,E){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||b.length===0)return;this.type===ka&&(Ge("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=oo);let P=i.getRenderTarget(),A=i.getActiveCubeFace(),I=i.getActiveMipmapLevel(),N=i.state;N.setBlending(cs),N.buffers.depth.getReversed()===!0?N.buffers.color.setClear(0,0,0,0):N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);let O=g!==this.type;O&&x.traverse(function(L){L.material&&(Array.isArray(L.material)?L.material.forEach(G=>G.needsUpdate=!0):L.material.needsUpdate=!0)});for(let L=0,G=b.length;L<G;L++){let X=b[L],k=X.shadow;if(k===void 0){Ge("WebGLShadowMap:",X,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;s.copy(k.mapSize);let ne=k.getFrameExtents();s.multiply(ne),r.copy(k.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ne.x),s.x=r.x*ne.x,k.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ne.y),s.y=r.y*ne.y,k.mapSize.y=r.y));let W=i.state.buffers.depth.getReversed();if(k.camera._reversedDepth=W,k.map===null||O===!0){if(k.map!==null&&(k.map.depthTexture!==null&&(k.map.depthTexture.dispose(),k.map.depthTexture=null),k.map.dispose()),this.type===Qs){if(X.isPointLight){Ge("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}k.map=new Gt(s.x,s.y,{format:Xi,type:hn,minFilter:$t,magFilter:$t,generateMipmaps:!1}),k.map.texture.name=X.name+".shadowMap",k.map.depthTexture=new Ei(s.x,s.y,Tn),k.map.depthTexture.name=X.name+".shadowMapDepth",k.map.depthTexture.format=yi,k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=rn,k.map.depthTexture.magFilter=rn}else X.isPointLight?(k.map=new xo(s.x),k.map.depthTexture=new Hr(s.x,Jn)):(k.map=new Gt(s.x,s.y),k.map.depthTexture=new Ei(s.x,s.y,Jn)),k.map.depthTexture.name=X.name+".shadowMap",k.map.depthTexture.format=yi,this.type===oo?(k.map.depthTexture.compareFunction=W?ch:lh,k.map.depthTexture.minFilter=$t,k.map.depthTexture.magFilter=$t):(k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=rn,k.map.depthTexture.magFilter=rn);k.camera.updateProjectionMatrix()}k.map.isWebGLCubeRenderTarget!==!0&&(k.map.width!==s.x||k.map.height!==s.y)&&k.map.setSize(s.x,s.y);let $=k.map.isWebGLCubeRenderTarget?6:k.getViewportCount();X.isPointLight!==!0&&k.updateMatrices(X,E);let te=(k.camera.layers.mask&4294967294)!==0?k.camera.layers:E.layers;for(let Te=0;Te<$;Te++){let He=k.getCamera(Te);if(X.isPointLight){let Y=k.camera,_e=k.matrix,we=X.distance||Y.far;we!==Y.far&&(Y.far=we,Y.updateProjectionMatrix()),mo.setFromMatrixPosition(X.matrixWorld),Y.position.copy(mo),Eh.copy(Y.position),Eh.add(q_[Te]),Y.up.copy(Y_[Te]),Y.lookAt(Eh),Y.updateMatrixWorld(),_e.makeTranslation(-mo.x,-mo.y,-mo.z),nf.multiplyMatrices(Y.projectionMatrix,Y.matrixWorldInverse),k._frustum.setFromProjectionMatrix(nf,Y.coordinateSystem,Y.reversedDepth)}if(k.map.isWebGLCubeRenderTarget)i.setRenderTarget(k.map,Te),i.clear();else{Te===0&&(i.setRenderTarget(k.map),i.clear());let Y=k.getViewport(Te);o.set(r.x*Y.x,r.y*Y.y,r.x*Y.z,r.y*Y.w),N.viewport(o)}n=k.getFrustum(Te),y(x,E,He,X,te,this.type)}k.isPointLightShadow!==!0&&this.type===Qs&&v(k,E),k.needsUpdate=!1}g=this.type,m.needsUpdate=!1,i.setRenderTarget(P,A,I)};function v(b,x){let E=e.update(_);d.defines.VSM_SAMPLES!==b.blurSamples&&(d.defines.VSM_SAMPLES=b.blurSamples,p.defines.VSM_SAMPLES=b.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),b.mapPass===null?b.mapPass=new Gt(s.x,s.y,{format:Xi,type:hn}):(b.mapPass.width!==b.map.width||b.mapPass.height!==b.map.height)&&b.mapPass.setSize(b.map.width,b.map.height),d.uniforms.shadow_pass.value=b.map.depthTexture,d.uniforms.resolution.value.set(b.map.width,b.map.height),d.uniforms.radius.value=b.radius,i.setRenderTarget(b.mapPass),i.clear(),i.renderBufferDirect(x,null,E,d,_,null),p.uniforms.shadow_pass.value=b.mapPass.texture,p.uniforms.resolution.value.set(b.map.width,b.map.height),p.uniforms.radius.value=b.radius,i.setRenderTarget(b.map),i.clear(),i.renderBufferDirect(x,null,E,p,_,null)}function M(b,x,E,P){let A=null,I=E.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(I!==void 0)A=I;else if(A=E.isPointLight===!0?l:a,i.localClippingEnabled&&x.clipShadows===!0&&Array.isArray(x.clippingPlanes)&&x.clippingPlanes.length!==0||x.displacementMap&&x.displacementScale!==0||x.alphaMap&&x.alphaTest>0||x.map&&x.alphaTest>0||x.alphaToCoverage===!0){let N=A.uuid,O=x.uuid,L=c[N];L===void 0&&(L={},c[N]=L);let G=L[O];G===void 0&&(G=A.clone(),L[O]=G,x.addEventListener("dispose",w)),A=G}if(A.visible=x.visible,A.wireframe=x.wireframe,P===Qs?A.side=x.shadowSide!==null?x.shadowSide:x.side:A.side=x.shadowSide!==null?x.shadowSide:u[x.side],A.alphaMap=x.alphaMap,A.alphaTest=x.alphaToCoverage===!0?.5:x.alphaTest,A.map=x.map,A.clipShadows=x.clipShadows,A.clippingPlanes=x.clippingPlanes,A.clipIntersection=x.clipIntersection,A.displacementMap=x.displacementMap,A.displacementScale=x.displacementScale,A.displacementBias=x.displacementBias,A.wireframeLinewidth=x.wireframeLinewidth,A.linewidth=x.linewidth,E.isPointLight===!0&&A.isMeshDistanceMaterial===!0){let N=i.properties.get(A);N.light=E}return A}function y(b,x,E,P,A,I){if(b.visible===!1)return;if(b.layers.test(A)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&I===Qs)&&(!b.frustumCulled||b.intersectsFrustum(n))){b.modelViewMatrix.multiplyMatrices(E.matrixWorldInverse,b.matrixWorld);let L=e.update(b),G=b.material;if(Array.isArray(G)){let X=L.groups;for(let k=0,ne=X.length;k<ne;k++){let W=X[k],$=G[W.materialIndex];if($&&$.visible){let te=M(b,$,P,I);b.onBeforeShadow(i,b,x,E,L,te,W),i.renderBufferDirect(E,null,L,te,b,W),b.onAfterShadow(i,b,x,E,L,te,W)}}}else if(G.visible){let X=M(b,G,P,I);b.onBeforeShadow(i,b,x,E,L,X,null),i.renderBufferDirect(E,null,L,X,b,null),b.onAfterShadow(i,b,x,E,L,X,null)}}let O=b.children;for(let L=0,G=O.length;L<G;L++)y(O[L],x,E,P,A,I)}function w(b){b.target.removeEventListener("dispose",w);for(let E in c){let P=c[E],A=b.target.uuid;A in P&&(P[A].dispose(),delete P[A])}}}function J_(i,e){function t(){let D=!1,K=new Rt,q=null,de=new Rt(0,0,0,0);return{setMask:function(oe){q!==oe&&!D&&(i.colorMask(oe,oe,oe,oe),q=oe)},setLocked:function(oe){D=oe},setClear:function(oe,ce,De,Qe,re){re===!0&&(oe*=Qe,ce*=Qe,De*=Qe),K.set(oe,ce,De,Qe),de.equals(K)===!1&&(i.clearColor(oe,ce,De,Qe),de.copy(K))},reset:function(){D=!1,q=null,de.set(-1,0,0,0)}}}function n(){let D=!1,K=!1,q=null,de=null,oe=null;return{setReversed:function(ce){if(K!==ce){let De=e.get("EXT_clip_control");ce?De.clipControlEXT(De.LOWER_LEFT_EXT,De.ZERO_TO_ONE_EXT):De.clipControlEXT(De.LOWER_LEFT_EXT,De.NEGATIVE_ONE_TO_ONE_EXT),K=ce;let Qe=oe;oe=null,this.setClear(Qe)}},getReversed:function(){return K},setTest:function(ce){ce?ve(i.DEPTH_TEST):Oe(i.DEPTH_TEST)},setMask:function(ce){q!==ce&&!D&&(i.depthMask(ce),q=ce)},setFunc:function(ce){if(K&&(ce=Ad[ce]),de!==ce){switch(ce){case oa:i.depthFunc(i.NEVER);break;case aa:i.depthFunc(i.ALWAYS);break;case la:i.depthFunc(i.LESS);break;case Bs:i.depthFunc(i.LEQUAL);break;case ca:i.depthFunc(i.EQUAL);break;case ha:i.depthFunc(i.GEQUAL);break;case ua:i.depthFunc(i.GREATER);break;case da:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}de=ce}},setLocked:function(ce){D=ce},setClear:function(ce){oe!==ce&&(oe=ce,K&&(ce=1-ce),i.clearDepth(ce))},reset:function(){D=!1,q=null,de=null,oe=null,K=!1}}}function s(){let D=!1,K=null,q=null,de=null,oe=null,ce=null,De=null,Qe=null,re=null;return{setTest:function(Ne){D||(Ne?ve(i.STENCIL_TEST):Oe(i.STENCIL_TEST))},setMask:function(Ne){K!==Ne&&!D&&(i.stencilMask(Ne),K=Ne)},setFunc:function(Ne,$e,ye){(q!==Ne||de!==$e||oe!==ye)&&(i.stencilFunc(Ne,$e,ye),q=Ne,de=$e,oe=ye)},setOp:function(Ne,$e,ye){(ce!==Ne||De!==$e||Qe!==ye)&&(i.stencilOp(Ne,$e,ye),ce=Ne,De=$e,Qe=ye)},setLocked:function(Ne){D=Ne},setClear:function(Ne){re!==Ne&&(i.clearStencil(Ne),re=Ne)},reset:function(){D=!1,K=null,q=null,de=null,oe=null,ce=null,De=null,Qe=null,re=null}}}let r=new t,o=new n,a=new s,l={},c=new WeakMap,h={},u={},d={},p=new WeakMap,f=[],_=null,m=!1,g=null,v=null,M=null,y=null,w=null,b=null,x=null,E=new Pe(0,0,0),P=0,A=!1,I=null,N=null,O=null,L=null,G=null,X=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),k=!1,ne=0,W=i.getParameter(i.VERSION);W.indexOf("WebGL")!==-1?(ne=parseFloat(/^WebGL (\d)/.exec(W)[1]),k=ne>=1):W.indexOf("OpenGL ES")!==-1&&(ne=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),k=ne>=2);let $=null,te={},Te=i.getParameter(i.SCISSOR_BOX),He=i.getParameter(i.VIEWPORT),Y=new Rt().fromArray(Te),_e=new Rt().fromArray(He);function we(D,K,q,de){let oe=new Uint8Array(4),ce=i.createTexture();i.bindTexture(D,ce),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let De=0;De<q;De++)D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY?i.texImage3D(K,0,i.RGBA,1,1,de,0,i.RGBA,i.UNSIGNED_BYTE,oe):i.texImage2D(K+De,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,oe);return ce}let Fe={};Fe[i.TEXTURE_2D]=we(i.TEXTURE_2D,i.TEXTURE_2D,1),Fe[i.TEXTURE_CUBE_MAP]=we(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Fe[i.TEXTURE_2D_ARRAY]=we(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Fe[i.TEXTURE_3D]=we(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ve(i.DEPTH_TEST),o.setFunc(Bs),be(!1),xe(kc),ve(i.CULL_FACE),he(cs);function ve(D){h[D]!==!0&&(i.enable(D),h[D]=!0)}function Oe(D){h[D]!==!1&&(i.disable(D),h[D]=!1)}function Ct(D,K){return d[D]!==K?(i.bindFramebuffer(D,K),d[D]=K,D===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=K),D===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=K),!0):!1}function ke(D,K){let q=f,de=!1;if(D){q=p.get(K),q===void 0&&(q=[],p.set(K,q));let oe=D.textures;if(q.length!==oe.length||q[0]!==i.COLOR_ATTACHMENT0){for(let ce=0,De=oe.length;ce<De;ce++)q[ce]=i.COLOR_ATTACHMENT0+ce;q.length=oe.length,de=!0}}else q[0]!==i.BACK&&(q[0]=i.BACK,de=!0);de&&i.drawBuffers(q)}function tt(D){return _!==D?(i.useProgram(D),_=D,!0):!1}let ot={[hs]:i.FUNC_ADD,[Ku]:i.FUNC_SUBTRACT,[$u]:i.FUNC_REVERSE_SUBTRACT};ot[ju]=i.MIN,ot[Qu]=i.MAX;let Q={[ed]:i.ZERO,[td]:i.ONE,[nd]:i.SRC_COLOR,[Xc]:i.SRC_ALPHA,[ld]:i.SRC_ALPHA_SATURATE,[od]:i.DST_COLOR,[sd]:i.DST_ALPHA,[id]:i.ONE_MINUS_SRC_COLOR,[qc]:i.ONE_MINUS_SRC_ALPHA,[ad]:i.ONE_MINUS_DST_COLOR,[rd]:i.ONE_MINUS_DST_ALPHA,[cd]:i.CONSTANT_COLOR,[hd]:i.ONE_MINUS_CONSTANT_COLOR,[ud]:i.CONSTANT_ALPHA,[dd]:i.ONE_MINUS_CONSTANT_ALPHA};function he(D,K,q,de,oe,ce,De,Qe,re,Ne){if(D===cs){m===!0&&(Oe(i.BLEND),m=!1);return}if(m===!1&&(ve(i.BLEND),m=!0),D!==Ju){if(D!==g||Ne!==A){if((v!==hs||w!==hs)&&(i.blendEquation(i.FUNC_ADD),v=hs,w=hs),Ne)switch(D){case er:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ai:i.blendFunc(i.ONE,i.ONE);break;case Vc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Wc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:We("WebGLState: Invalid blending: ",D);break}else switch(D){case er:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ai:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Vc:We("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Wc:We("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:We("WebGLState: Invalid blending: ",D);break}M=null,y=null,b=null,x=null,E.set(0,0,0),P=0,g=D,A=Ne}return}oe=oe||K,ce=ce||q,De=De||de,(K!==v||oe!==w)&&(i.blendEquationSeparate(ot[K],ot[oe]),v=K,w=oe),(q!==M||de!==y||ce!==b||De!==x)&&(i.blendFuncSeparate(Q[q],Q[de],Q[ce],Q[De]),M=q,y=de,b=ce,x=De),(Qe.equals(E)===!1||re!==P)&&(i.blendColor(Qe.r,Qe.g,Qe.b,re),E.copy(Qe),P=re),g=D,A=!1}function ae(D,K){D.side===Ot?Oe(i.CULL_FACE):ve(i.CULL_FACE);let q=D.side===cn;K&&(q=!q),be(q),D.blending===er&&D.transparent===!1?he(cs):he(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),o.setFunc(D.depthFunc),o.setTest(D.depthTest),o.setMask(D.depthWrite),r.setMask(D.colorWrite);let de=D.stencilWrite;a.setTest(de),de&&(a.setMask(D.stencilWriteMask),a.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),a.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),Le(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?ve(i.SAMPLE_ALPHA_TO_COVERAGE):Oe(i.SAMPLE_ALPHA_TO_COVERAGE)}function be(D){I!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),I=D)}function xe(D){D!==Yu?(ve(i.CULL_FACE),D!==N&&(D===kc?i.cullFace(i.BACK):D===Zu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Oe(i.CULL_FACE),N=D}function Ke(D){D!==O&&(k&&i.lineWidth(D),O=D)}function Le(D,K,q){D?(ve(i.POLYGON_OFFSET_FILL),(L!==K||G!==q)&&(L=K,G=q,o.getReversed()&&(K=-K,q=-q),i.polygonOffset(K,q))):Oe(i.POLYGON_OFFSET_FILL)}function at(D){D?ve(i.SCISSOR_TEST):Oe(i.SCISSOR_TEST)}function ht(D){D===void 0&&(D=i.TEXTURE0+X-1),$!==D&&(i.activeTexture(D),$=D)}function _t(D,K,q){q===void 0&&($===null?q=i.TEXTURE0+X-1:q=$);let de=te[q];de===void 0&&(de={type:void 0,texture:void 0},te[q]=de),(de.type!==D||de.texture!==K)&&($!==q&&(i.activeTexture(q),$=q),i.bindTexture(D,K||Fe[D]),de.type=D,de.texture=K)}function F(){let D=te[$];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function Xt(){try{i.compressedTexImage2D(...arguments)}catch(D){We("WebGLState:",D)}}function it(){try{i.compressedTexImage3D(...arguments)}catch(D){We("WebGLState:",D)}}function Tt(){try{i.texSubImage2D(...arguments)}catch(D){We("WebGLState:",D)}}function pe(){try{i.texSubImage3D(...arguments)}catch(D){We("WebGLState:",D)}}function zt(){try{i.compressedTexSubImage2D(...arguments)}catch(D){We("WebGLState:",D)}}function Be(){try{i.compressedTexSubImage3D(...arguments)}catch(D){We("WebGLState:",D)}}function qe(){try{i.texStorage2D(...arguments)}catch(D){We("WebGLState:",D)}}function R(){try{i.texStorage3D(...arguments)}catch(D){We("WebGLState:",D)}}function S(){try{i.texImage2D(...arguments)}catch(D){We("WebGLState:",D)}}function z(){try{i.texImage3D(...arguments)}catch(D){We("WebGLState:",D)}}function se(D){return u[D]!==void 0?u[D]:i.getParameter(D)}function j(D,K){u[D]!==K&&(i.pixelStorei(D,K),u[D]=K)}function le(D){Y.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),Y.copy(D))}function me(D){_e.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),_e.copy(D))}function Z(D,K){let q=c.get(K);q===void 0&&(q=new WeakMap,c.set(K,q));let de=q.get(D);de===void 0&&(de=i.getUniformBlockIndex(K,D.name),i.uniformBlockBinding(K,de,de),q.set(D,de))}function J(D,K,q){let oe=c.get(K).get(D);l[oe]!==q&&(i.bindBufferBase(i.UNIFORM_BUFFER,oe,q),l[oe]=q)}function ue(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},u={},$=null,te={},d={},l={},p=new WeakMap,f=[],_=null,m=!1,g=null,v=null,M=null,y=null,w=null,b=null,x=null,E=new Pe(0,0,0),P=0,A=!1,I=null,N=null,O=null,L=null,G=null,Y.set(0,0,i.canvas.width,i.canvas.height),_e.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:ve,disable:Oe,bindFramebuffer:Ct,drawBuffers:ke,useProgram:tt,setBlending:he,setMaterial:ae,setFlipSided:be,setCullFace:xe,setLineWidth:Ke,setPolygonOffset:Le,setScissorTest:at,activeTexture:ht,bindTexture:_t,unbindTexture:F,compressedTexImage2D:Xt,compressedTexImage3D:it,texImage2D:S,texImage3D:z,pixelStorei:j,getParameter:se,updateUBOMapping:Z,uniformBlockBinding:J,texStorage2D:qe,texStorage3D:R,texSubImage2D:Tt,texSubImage3D:pe,compressedTexSubImage2D:zt,compressedTexSubImage3D:Be,scissor:le,viewport:me,reset:ue}}function K_(i,e,t,n,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ee,h=new WeakMap,u=new Set,d,p=new WeakMap,f=new Set,_=new FinalizationRegistry(R=>f.delete(R)),m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,S){return m?new OffscreenCanvas(R,S):Rr("canvas")}function v(R,S,z){let se=1,j=qe(R);if((j.width>z||j.height>z)&&(se=z/Math.max(j.width,j.height)),se<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let le=Math.floor(se*j.width),me=Math.floor(se*j.height);d===void 0&&(d=g(le,me));let Z=S?g(le,me):d;return Z.width=le,Z.height=me,Z.getContext("2d").drawImage(R,0,0,le,me),Ge("WebGLRenderer: Texture has been resized from ("+j.width+"x"+j.height+") to ("+le+"x"+me+")."),Z}else return"data"in R&&Ge("WebGLRenderer: Image in DataTexture is too big ("+j.width+"x"+j.height+")."),R;return R}function M(R){return R.generateMipmaps}function y(R){i.generateMipmap(R)}function w(R){return R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?i.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function b(R,S,z,se,j,le=!1){if(R!==null){if(i[R]!==void 0)return i[R];Ge("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let me;se&&(me=e.get("EXT_texture_norm16"),me||Ge("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Z=S;if(S===i.RED&&(z===i.FLOAT&&(Z=i.R32F),z===i.HALF_FLOAT&&(Z=i.R16F),z===i.UNSIGNED_BYTE&&(Z=i.R8),z===i.UNSIGNED_SHORT&&me&&(Z=me.R16_EXT),z===i.SHORT&&me&&(Z=me.R16_SNORM_EXT)),S===i.RED_INTEGER&&(z===i.UNSIGNED_BYTE&&(Z=i.R8UI),z===i.UNSIGNED_SHORT&&(Z=i.R16UI),z===i.UNSIGNED_INT&&(Z=i.R32UI),z===i.BYTE&&(Z=i.R8I),z===i.SHORT&&(Z=i.R16I),z===i.INT&&(Z=i.R32I)),S===i.RG&&(z===i.FLOAT&&(Z=i.RG32F),z===i.HALF_FLOAT&&(Z=i.RG16F),z===i.UNSIGNED_BYTE&&(Z=i.RG8),z===i.UNSIGNED_SHORT&&me&&(Z=me.RG16_EXT),z===i.SHORT&&me&&(Z=me.RG16_SNORM_EXT)),S===i.RG_INTEGER&&(z===i.UNSIGNED_BYTE&&(Z=i.RG8UI),z===i.UNSIGNED_SHORT&&(Z=i.RG16UI),z===i.UNSIGNED_INT&&(Z=i.RG32UI),z===i.BYTE&&(Z=i.RG8I),z===i.SHORT&&(Z=i.RG16I),z===i.INT&&(Z=i.RG32I)),S===i.RGB_INTEGER&&(z===i.UNSIGNED_BYTE&&(Z=i.RGB8UI),z===i.UNSIGNED_SHORT&&(Z=i.RGB16UI),z===i.UNSIGNED_INT&&(Z=i.RGB32UI),z===i.BYTE&&(Z=i.RGB8I),z===i.SHORT&&(Z=i.RGB16I),z===i.INT&&(Z=i.RGB32I)),S===i.RGBA_INTEGER&&(z===i.UNSIGNED_BYTE&&(Z=i.RGBA8UI),z===i.UNSIGNED_SHORT&&(Z=i.RGBA16UI),z===i.UNSIGNED_INT&&(Z=i.RGBA32UI),z===i.BYTE&&(Z=i.RGBA8I),z===i.SHORT&&(Z=i.RGBA16I),z===i.INT&&(Z=i.RGBA32I)),S===i.RGB&&(z===i.UNSIGNED_SHORT&&me&&(Z=me.RGB16_EXT),z===i.SHORT&&me&&(Z=me.RGB16_SNORM_EXT),z===i.UNSIGNED_INT_5_9_9_9_REV&&(Z=i.RGB9_E5),z===i.UNSIGNED_INT_10F_11F_11F_REV&&(Z=i.R11F_G11F_B10F)),S===i.RGBA){let J=le?Ar:ft.getTransfer(j);z===i.FLOAT&&(Z=i.RGBA32F),z===i.HALF_FLOAT&&(Z=i.RGBA16F),z===i.UNSIGNED_BYTE&&(Z=J===Mt?i.SRGB8_ALPHA8:i.RGBA8),z===i.UNSIGNED_SHORT&&me&&(Z=me.RGBA16_EXT),z===i.SHORT&&me&&(Z=me.RGBA16_SNORM_EXT),z===i.UNSIGNED_SHORT_4_4_4_4&&(Z=i.RGBA4),z===i.UNSIGNED_SHORT_5_5_5_1&&(Z=i.RGB5_A1)}return(Z===i.R16F||Z===i.R32F||Z===i.RG16F||Z===i.RG32F||Z===i.RGBA16F||Z===i.RGBA32F)&&e.get("EXT_color_buffer_float"),Z}function x(R,S){let z;return R?S===null||S===Jn||S===ds?z=i.DEPTH24_STENCIL8:S===Tn?z=i.DEPTH32F_STENCIL8:S===nr&&(z=i.DEPTH24_STENCIL8,Ge("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===Jn||S===ds?z=i.DEPTH_COMPONENT24:S===Tn?z=i.DEPTH_COMPONENT32F:S===nr&&(z=i.DEPTH_COMPONENT16),z}function E(R,S){return M(R)===!0||R.isFramebufferTexture&&R.minFilter!==rn&&R.minFilter!==$t?Math.log2(Math.max(S.width,S.height))+1:R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?S.mipmaps.length:1}function P(R){let S=new WeakRef(R);n.get(R).__ref=S,f.add(S),_.register(R,S,S)}function A(R){let S=n.get(R).__ref;S!==void 0&&(f.delete(S),_.unregister(S))}function I(R){O(R.target)}function N(R){L(R.target)}function O(R){R.removeEventListener("dispose",I),A(R),X(R),R.isVideoTexture&&h.delete(R),R.isHTMLTexture&&u.delete(R)}function L(R){R.removeEventListener("dispose",N),A(R),ne(R)}function G(){for(let R of f){let S=R.deref();S!==void 0&&(S.isRenderTarget===!0?L(S):O(S))}f.clear(),u.clear()}function X(R){let S=n.get(R);if(S.__webglInit===void 0)return;let z=R.source,se=p.get(z);if(se){let j=se[S.__cacheKey];j.usedTimes--,j.usedTimes===0&&k(R),Object.keys(se).length===0&&p.delete(z)}n.remove(R)}function k(R){let S=n.get(R);i.deleteTexture(S.__webglTexture);let z=R.source,se=p.get(z);delete se[S.__cacheKey],o.memory.textures--}function ne(R){let S=n.get(R);S.__depthDisposeCallback&&S.__depthDisposeCallback();let z=R.depthTexture;if(z&&z.renderTarget===R&&O(z),R.isWebGLCubeRenderTarget)for(let j=0;j<6;j++){if(Array.isArray(S.__webglFramebuffer[j]))for(let le=0;le<S.__webglFramebuffer[j].length;le++)i.deleteFramebuffer(S.__webglFramebuffer[j][le]);else i.deleteFramebuffer(S.__webglFramebuffer[j]);S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer[j])}else{if(Array.isArray(S.__webglFramebuffer))for(let j=0;j<S.__webglFramebuffer.length;j++)i.deleteFramebuffer(S.__webglFramebuffer[j]);else i.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&i.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let j=0;j<S.__webglColorRenderbuffer.length;j++)S.__webglColorRenderbuffer[j]&&i.deleteRenderbuffer(S.__webglColorRenderbuffer[j]);S.__webglDepthRenderbuffer&&i.deleteRenderbuffer(S.__webglDepthRenderbuffer)}let se=R.textures;for(let j=0,le=se.length;j<le;j++){let me=n.get(se[j]);me.__webglTexture&&(i.deleteTexture(me.__webglTexture),o.memory.textures--),n.remove(se[j])}n.remove(R)}let W=0;function $(){W=0}function te(){return W}function Te(R){W=R}function He(){let R=W;return R>=s.maxTextures&&Ge("WebGLTextures: Trying to use "+(R+1)+" texture units while this GPU supports only "+s.maxTextures),W+=1,R}function Y(R){let S=[];return S.push(R.wrapS),S.push(R.wrapT),S.push(R.wrapR||0),S.push(R.magFilter),S.push(R.minFilter),S.push(R.anisotropy),S.push(R.internalFormat),S.push(R.format),S.push(R.type),S.push(R.generateMipmaps),S.push(R.mipmapsAutoUpdate),S.push(R.premultiplyAlpha),S.push(R.flipY),S.push(R.unpackAlignment),S.push(R.colorSpace),S.join()}function _e(R,S){let z=n.get(R);if(R.isVideoTexture&&zt(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&z.__version!==R.version){let se=R.image;if(se===null)Ge("WebGLRenderer: Texture marked for update but no image data found.");else if(se.complete===!1)Ge("WebGLRenderer: Texture marked for update but image is incomplete");else{ae(z,R,S);return}}else R.isExternalTexture&&(z.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,z.__webglTexture,i.TEXTURE0+S)}function we(R,S){let z=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&z.__version!==R.version){ae(z,R,S);return}else R.isExternalTexture&&(z.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,z.__webglTexture,i.TEXTURE0+S)}function Fe(R,S){let z=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&z.__version!==R.version){ae(z,R,S);return}t.bindTexture(i.TEXTURE_3D,z.__webglTexture,i.TEXTURE0+S)}function ve(R,S){let z=n.get(R);if(R.version>0&&z.__version!==R.version){be(z,R,S);return}t.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture,i.TEXTURE0+S)}let Oe={[ei]:i.REPEAT,[Qn]:i.CLAMP_TO_EDGE,[fa]:i.MIRRORED_REPEAT},Ct={[rn]:i.NEAREST,[md]:i.NEAREST_MIPMAP_NEAREST,[ao]:i.NEAREST_MIPMAP_LINEAR,[$t]:i.LINEAR,[Xa]:i.LINEAR_MIPMAP_NEAREST,[Ln]:i.LINEAR_MIPMAP_LINEAR},ke={[vd]:i.NEVER,[hh]:i.ALWAYS,[yd]:i.LESS,[lh]:i.LEQUAL,[Md]:i.EQUAL,[ch]:i.GEQUAL,[Sd]:i.GREATER,[Ed]:i.NOTEQUAL};function tt(R,S){if(S.type===Tn&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===$t||S.magFilter===Xa||S.magFilter===ao||S.magFilter===Ln||S.minFilter===$t||S.minFilter===Xa||S.minFilter===ao||S.minFilter===Ln)&&Ge("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,Oe[S.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,Oe[S.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,Oe[S.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,Ct[S.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,Ct[S.minFilter]),S.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,ke[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===rn||S.minFilter!==ao&&S.minFilter!==Ln||S.type===Tn&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||n.get(S).__currentAnisotropy){let z=e.get("EXT_texture_filter_anisotropic");i.texParameterf(R,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy}}}function ot(R,S){let z=!1;R.__webglInit===void 0&&(R.__webglInit=!0,S.addEventListener("dispose",I),P(S));let se=S.source,j=p.get(se);j===void 0&&(j={},p.set(se,j));let le=Y(S);if(le!==R.__cacheKey){j[le]===void 0&&(j[le]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,z=!0),j[le].usedTimes++;let me=j[R.__cacheKey];me!==void 0&&(j[R.__cacheKey].usedTimes--,me.usedTimes===0&&k(S)),R.__cacheKey=le,R.__webglTexture=j[le].texture}return z}function Q(R,S,z){return Math.floor(Math.floor(R/z)/S)}function he(R,S,z,se){let le=R.updateRanges;if(le.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,S.width,S.height,z,se,S.data);else{le.sort((D,K)=>D.start-K.start);let me=0;for(let D=1;D<le.length;D++){let K=le[me],q=le[D],de=K.start+K.count,oe=Q(q.start,S.width,4),ce=Q(K.start,S.width,4);q.start<=de+1&&oe===ce&&Q(q.start+q.count-1,S.width,4)===oe?K.count=Math.max(K.count,q.start+q.count-K.start):(++me,le[me]=q)}le.length=me+1;let Z=t.getParameter(i.UNPACK_ROW_LENGTH),J=t.getParameter(i.UNPACK_SKIP_PIXELS),ue=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,S.width);for(let D=0,K=le.length;D<K;D++){let q=le[D],de=Math.floor(q.start/4),oe=Math.ceil(q.count/4),ce=de%S.width,De=Math.floor(de/S.width),Qe=oe,re=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,ce),t.pixelStorei(i.UNPACK_SKIP_ROWS,De),t.texSubImage2D(i.TEXTURE_2D,0,ce,De,Qe,re,z,se,S.data)}R.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,Z),t.pixelStorei(i.UNPACK_SKIP_PIXELS,J),t.pixelStorei(i.UNPACK_SKIP_ROWS,ue)}}function ae(R,S,z){let se=i.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(se=i.TEXTURE_2D_ARRAY),S.isData3DTexture&&(se=i.TEXTURE_3D);let j=ot(R,S),le=S.source;t.bindTexture(se,R.__webglTexture,i.TEXTURE0+z);let me=n.get(le);if(le.version!==me.__version||j===!0){if(t.activeTexture(i.TEXTURE0+z),(typeof ImageBitmap<"u"&&S.image instanceof ImageBitmap)===!1){let re=ft.getPrimaries(ft.workingColorSpace),Ne=S.colorSpace===Ai?null:ft.getPrimaries(S.colorSpace),$e=S.colorSpace===Ai||re===Ne?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,$e)}t.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment);let J=v(S.image,!1,s.maxTextureSize);J=Be(S,J);let ue=r.convert(S.format,S.colorSpace),D=r.convert(S.type),K=b(S.internalFormat,ue,D,S.normalized,S.colorSpace,S.isVideoTexture);tt(se,S);let q,de=S.mipmaps,oe=S.isVideoTexture!==!0,ce=me.__version===void 0||j===!0,De=le.dataReady,Qe=E(S,J);if(S.isDepthTexture)K=x(S.format===wi,S.type),ce&&(oe?t.texStorage2D(i.TEXTURE_2D,1,K,J.width,J.height):t.texImage2D(i.TEXTURE_2D,0,K,J.width,J.height,0,ue,D,null));else if(S.isDataTexture)if(de.length>0){oe&&ce&&t.texStorage2D(i.TEXTURE_2D,Qe,K,de[0].width,de[0].height);for(let re=0,Ne=de.length;re<Ne;re++)q=de[re],oe?De&&t.texSubImage2D(i.TEXTURE_2D,re,0,0,q.width,q.height,ue,D,q.data):t.texImage2D(i.TEXTURE_2D,re,K,q.width,q.height,0,ue,D,q.data);S.generateMipmaps=!1}else oe?(ce&&t.texStorage2D(i.TEXTURE_2D,Qe,K,J.width,J.height),De&&he(S,J,ue,D)):t.texImage2D(i.TEXTURE_2D,0,K,J.width,J.height,0,ue,D,J.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){oe&&ce&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Qe,K,de[0].width,de[0].height,J.depth);for(let re=0,Ne=de.length;re<Ne;re++)if(q=de[re],S.format!==Dn)if(ue!==null)if(oe){if(De)if(S.layerUpdates.size>0){let $e=Mh(q.width,q.height,S.format,S.type);for(let ye of S.layerUpdates){let St=q.data.subarray(ye*$e/q.data.BYTES_PER_ELEMENT,(ye+1)*$e/q.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,re,0,0,ye,q.width,q.height,1,ue,St)}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,re,0,0,0,q.width,q.height,J.depth,ue,q.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,re,K,q.width,q.height,J.depth,0,q.data,0,0);else Ge("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else oe?De&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,re,0,0,0,q.width,q.height,J.depth,ue,D,q.data):t.texImage3D(i.TEXTURE_2D_ARRAY,re,K,q.width,q.height,J.depth,0,ue,D,q.data);S.layerUpdates.size>0&&S.clearLayerUpdates()}else{oe&&ce&&t.texStorage2D(i.TEXTURE_2D,Qe,K,de[0].width,de[0].height);for(let re=0,Ne=de.length;re<Ne;re++)q=de[re],S.format!==Dn?ue!==null?oe?De&&t.compressedTexSubImage2D(i.TEXTURE_2D,re,0,0,q.width,q.height,ue,q.data):t.compressedTexImage2D(i.TEXTURE_2D,re,K,q.width,q.height,0,q.data):Ge("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):oe?De&&t.texSubImage2D(i.TEXTURE_2D,re,0,0,q.width,q.height,ue,D,q.data):t.texImage2D(i.TEXTURE_2D,re,K,q.width,q.height,0,ue,D,q.data)}else if(S.isDataArrayTexture)if(oe){if(ce&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Qe,K,J.width,J.height,J.depth),De)if(S.layerUpdates.size>0){let re=Mh(J.width,J.height,S.format,S.type);for(let Ne of S.layerUpdates){let $e=J.data.subarray(Ne*re/J.data.BYTES_PER_ELEMENT,(Ne+1)*re/J.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Ne,J.width,J.height,1,ue,D,$e)}S.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,J.width,J.height,J.depth,ue,D,J.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,K,J.width,J.height,J.depth,0,ue,D,J.data);else if(S.isData3DTexture)oe?(ce&&t.texStorage3D(i.TEXTURE_3D,Qe,K,J.width,J.height,J.depth),De&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,J.width,J.height,J.depth,ue,D,J.data)):t.texImage3D(i.TEXTURE_3D,0,K,J.width,J.height,J.depth,0,ue,D,J.data);else if(S.isFramebufferTexture){if(ce)if(oe)t.texStorage2D(i.TEXTURE_2D,Qe,K,J.width,J.height);else{let re=J.width,Ne=J.height;for(let $e=0;$e<Qe;$e++)t.texImage2D(i.TEXTURE_2D,$e,K,re,Ne,0,ue,D,null),re>>=1,Ne>>=1}}else if(S.isHTMLTexture){if("texElementImage2D"in i){let re=i.canvas;if(re.hasAttribute("layoutsubtree")||re.setAttribute("layoutsubtree","true"),J.parentNode!==re){re.appendChild(J),u.add(S),re.onpaint=Ne=>{let $e=Ne.changedElements;for(let ye of u)$e.includes(ye.image)&&(ye.needsUpdate=!0)},re.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,J);else{let $e=i.RGBA,ye=i.RGBA,St=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,$e,ye,St,J)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(de.length>0){if(oe&&ce){let re=qe(de[0]);t.texStorage2D(i.TEXTURE_2D,Qe,K,re.width,re.height)}for(let re=0,Ne=de.length;re<Ne;re++)q=de[re],oe?De&&t.texSubImage2D(i.TEXTURE_2D,re,0,0,ue,D,q):t.texImage2D(i.TEXTURE_2D,re,K,ue,D,q);S.generateMipmaps=!1}else if(oe){if(ce){let re=qe(J);t.texStorage2D(i.TEXTURE_2D,Qe,K,re.width,re.height)}De&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ue,D,J)}else t.texImage2D(i.TEXTURE_2D,0,K,ue,D,J);M(S)&&S.mipmapsAutoUpdate===!0&&y(se),me.__version=le.version,S.onUpdate&&S.onUpdate(S)}R.__version=S.version}function be(R,S,z){if(S.image.length!==6)return;let se=ot(R,S),j=S.source;t.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+z);let le=n.get(j);if(j.version!==le.__version||se===!0){t.activeTexture(i.TEXTURE0+z);let me=ft.getPrimaries(ft.workingColorSpace),Z=S.colorSpace===Ai?null:ft.getPrimaries(S.colorSpace),J=S.colorSpace===Ai||me===Z?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,J);let ue=S.isCompressedTexture||S.image[0].isCompressedTexture,D=S.image[0]&&S.image[0].isDataTexture,K=[];for(let ye=0;ye<6;ye++)!ue&&!D?K[ye]=v(S.image[ye],!0,s.maxCubemapSize):K[ye]=D?S.image[ye].image:S.image[ye],K[ye]=Be(S,K[ye]);let q=K[0],de=r.convert(S.format,S.colorSpace),oe=r.convert(S.type),ce=b(S.internalFormat,de,oe,S.normalized,S.colorSpace),De=S.isVideoTexture!==!0,Qe=le.__version===void 0||se===!0,re=j.dataReady,Ne=E(S,q);tt(i.TEXTURE_CUBE_MAP,S);let $e;if(S.isDepthTexture){if(ce=x(S.format===wi,S.type),Qe)if(De)t.texStorage2D(i.TEXTURE_CUBE_MAP,1,ce,q.width,q.height);else for(let ye=0;ye<6;ye++)t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,ce,q.width,q.height,0,de,oe,null)}else if(ue){De&&Qe&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Ne,ce,q.width,q.height);for(let ye=0;ye<6;ye++){$e=K[ye].mipmaps;for(let St=0;St<$e.length;St++){let tn=$e[St];S.format!==Dn?de!==null?De?re&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ye,St,0,0,tn.width,tn.height,de,tn.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ye,St,ce,tn.width,tn.height,0,tn.data):Ge("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):De?re&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ye,St,0,0,tn.width,tn.height,de,oe,tn.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ye,St,ce,tn.width,tn.height,0,de,oe,tn.data)}}}else{if($e=S.mipmaps,De&&Qe){$e.length>0&&Ne++;let ye=qe(K[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Ne,ce,ye.width,ye.height)}for(let ye=0;ye<6;ye++)if(D){De?re&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,0,0,K[ye].width,K[ye].height,de,oe,K[ye].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,ce,K[ye].width,K[ye].height,0,de,oe,K[ye].data);for(let St=0;St<$e.length;St++){let Di=$e[St].image[ye].image;De?re&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ye,St+1,0,0,Di.width,Di.height,de,oe,Di.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ye,St+1,ce,Di.width,Di.height,0,de,oe,Di.data)}}else{De?re&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,0,0,de,oe,K[ye]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,ce,de,oe,K[ye]);for(let St=0;St<$e.length;St++){let tn=$e[St];De?re&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ye,St+1,0,0,de,oe,tn.image[ye]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ye,St+1,ce,de,oe,tn.image[ye])}}}M(S)&&S.mipmapsAutoUpdate===!0&&y(i.TEXTURE_CUBE_MAP),le.__version=j.version,S.onUpdate&&S.onUpdate(S)}R.__version=S.version}function xe(R,S,z,se,j,le){let me=r.convert(z.format,z.colorSpace),Z=r.convert(z.type),J=b(z.internalFormat,me,Z,z.normalized,z.colorSpace),ue=n.get(S),D=n.get(z);if(D.__renderTarget=S,!ue.__hasExternalTextures){let K=Math.max(1,S.width>>le),q=Math.max(1,S.height>>le);j===i.TEXTURE_3D||j===i.TEXTURE_2D_ARRAY?t.texImage3D(j,le,J,K,q,S.depth,0,me,Z,null):t.texImage2D(j,le,J,K,q,0,me,Z,null)}t.bindFramebuffer(i.FRAMEBUFFER,R),pe(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,se,j,D.__webglTexture,0,Tt(S)):(j===i.TEXTURE_2D||j>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&j<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,se,j,D.__webglTexture,le),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ke(R,S,z){if(i.bindRenderbuffer(i.RENDERBUFFER,R),S.depthBuffer){let se=S.depthTexture,j=se&&se.isDepthTexture?se.type:null,le=x(S.stencilBuffer,j),me=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;pe(S)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Tt(S),le,S.width,S.height):z?i.renderbufferStorageMultisample(i.RENDERBUFFER,Tt(S),le,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,le,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,me,i.RENDERBUFFER,R)}else{let se=S.textures;for(let j=0;j<se.length;j++){let le=se[j],me=r.convert(le.format,le.colorSpace),Z=r.convert(le.type),J=b(le.internalFormat,me,Z,le.normalized,le.colorSpace);pe(S)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Tt(S),J,S.width,S.height):z?i.renderbufferStorageMultisample(i.RENDERBUFFER,Tt(S),J,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,J,S.width,S.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Le(R,S,z){let se=S.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,R),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let j=n.get(S.depthTexture);j.__renderTarget=S;let le=se?S.depthTexture.image[0]:S.depthTexture.image;(!j.__webglTexture||le.width!==S.width||le.height!==S.height)&&(le.width=S.width,le.height=S.height,S.depthTexture.needsUpdate=!0),se?ve(S.depthTexture,0):_e(S.depthTexture,0);let me=j.__webglTexture,Z=Tt(S),J=se?i.TEXTURE_CUBE_MAP_POSITIVE_X+z:i.TEXTURE_2D,ue=S.depthTexture.format===wi?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(S.depthTexture.format===yi)pe(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ue,J,me,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,ue,J,me,0);else if(S.depthTexture.format===wi)pe(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ue,J,me,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,ue,J,me,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function at(R){let S=n.get(R),z=R.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==R.depthTexture){let se=R.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),se){let j=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,se.removeEventListener("dispose",j)};se.addEventListener("dispose",j),S.__depthDisposeCallback=j}S.__boundDepthTexture=se}if(R.depthTexture&&!S.__autoAllocateDepthBuffer)if(z)for(let se=0;se<6;se++)Le(S.__webglFramebuffer[se],R,se);else R.texture.mipmaps.length>0?Le(S.__webglFramebuffer[0],R,0):Le(S.__webglFramebuffer,R,0);else if(z){S.__webglDepthbuffer=[];for(let se=0;se<6;se++)if(t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[se]),S.__webglDepthbuffer[se]===void 0)S.__webglDepthbuffer[se]=i.createRenderbuffer(),Ke(S.__webglDepthbuffer[se],R,!1);else{let j=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,le=S.__webglDepthbuffer[se];i.bindRenderbuffer(i.RENDERBUFFER,le),i.framebufferRenderbuffer(i.FRAMEBUFFER,j,i.RENDERBUFFER,le)}}else if(R.texture.mipmaps.length>0?t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=i.createRenderbuffer(),Ke(S.__webglDepthbuffer,R,!1);else{let j=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,le=S.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,le),i.framebufferRenderbuffer(i.FRAMEBUFFER,j,i.RENDERBUFFER,le)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function ht(R,S,z){let se=n.get(R);S!==void 0&&xe(se.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),z!==void 0&&at(R)}function _t(R){let S=R.texture,z=n.get(R),se=n.get(S);R.addEventListener("dispose",N),P(R);let j=R.textures,le=R.isWebGLCubeRenderTarget===!0,me=j.length>1;if(me||(se.__webglTexture===void 0&&(se.__webglTexture=i.createTexture()),se.__version=S.version,o.memory.textures++),le){z.__webglFramebuffer=[];for(let Z=0;Z<6;Z++)if(S.mipmaps.length>0){z.__webglFramebuffer[Z]=[];for(let J=0;J<S.mipmaps.length;J++)z.__webglFramebuffer[Z][J]=i.createFramebuffer()}else z.__webglFramebuffer[Z]=i.createFramebuffer()}else{if(S.mipmaps.length>0){z.__webglFramebuffer=[];for(let Z=0;Z<S.mipmaps.length;Z++)z.__webglFramebuffer[Z]=i.createFramebuffer()}else z.__webglFramebuffer=i.createFramebuffer();if(me)for(let Z=0,J=j.length;Z<J;Z++){let ue=n.get(j[Z]);ue.__webglTexture===void 0&&(ue.__webglTexture=i.createTexture(),o.memory.textures++)}if(R.samples>0&&pe(R)===!1){z.__webglMultisampledFramebuffer=i.createFramebuffer(),z.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let Z=0;Z<j.length;Z++){let J=j[Z];z.__webglColorRenderbuffer[Z]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,z.__webglColorRenderbuffer[Z]);let ue=r.convert(J.format,J.colorSpace),D=r.convert(J.type),K=b(J.internalFormat,ue,D,J.normalized,J.colorSpace,R.isXRRenderTarget===!0),q=Tt(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,q,K,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Z,i.RENDERBUFFER,z.__webglColorRenderbuffer[Z])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(z.__webglDepthRenderbuffer=i.createRenderbuffer(),Ke(z.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(le){t.bindTexture(i.TEXTURE_CUBE_MAP,se.__webglTexture),tt(i.TEXTURE_CUBE_MAP,S);for(let Z=0;Z<6;Z++)if(S.mipmaps.length>0)for(let J=0;J<S.mipmaps.length;J++)xe(z.__webglFramebuffer[Z][J],R,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,J);else xe(z.__webglFramebuffer[Z],R,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0);M(S)?y(i.TEXTURE_CUBE_MAP):S.mipmaps.length>0&&i.texParameteri(i.TEXTURE_CUBE_MAP,i.TEXTURE_MAX_LEVEL,S.mipmaps.length-1),t.unbindTexture()}else if(me){for(let Z=0,J=j.length;Z<J;Z++){let ue=j[Z],D=n.get(ue),K=i.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(K=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(K,D.__webglTexture),tt(K,ue),xe(z.__webglFramebuffer,R,ue,i.COLOR_ATTACHMENT0+Z,K,0),M(ue)&&y(K)}t.unbindTexture()}else{let Z=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(Z=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Z,se.__webglTexture),tt(Z,S),S.mipmaps.length>0)for(let J=0;J<S.mipmaps.length;J++)xe(z.__webglFramebuffer[J],R,S,i.COLOR_ATTACHMENT0,Z,J);else xe(z.__webglFramebuffer,R,S,i.COLOR_ATTACHMENT0,Z,0);M(S)?y(Z):S.mipmaps.length>0&&i.texParameteri(Z,i.TEXTURE_MAX_LEVEL,S.mipmaps.length-1),t.unbindTexture()}R.depthBuffer&&at(R)}function F(R){let S=R.textures;for(let z=0,se=S.length;z<se;z++){let j=S[z];if(M(j)&&j.mipmapsAutoUpdate===!0){let le=w(R),me=n.get(j).__webglTexture;t.bindTexture(le,me),y(le),t.unbindTexture()}}}let Xt=[];function it(R){if(R.samples>0){if(pe(R)===!1){let S=R.textures,z=R.width,se=R.height,j=i.COLOR_BUFFER_BIT,le=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,me=n.get(R),Z=S.length>1;if(Z)for(let ue=0;ue<S.length;ue++)t.bindFramebuffer(i.FRAMEBUFFER,me.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ue,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,me.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ue,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,me.__webglMultisampledFramebuffer),R.texture.mipmaps.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,me.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,me.__webglFramebuffer);for(let ue=0;ue<S.length;ue++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(j|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(j|=i.STENCIL_BUFFER_BIT)),Z){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,me.__webglColorRenderbuffer[ue]);let D=n.get(S[ue]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,D,0)}i.blitFramebuffer(0,0,z,se,0,0,z,se,j,i.NEAREST),l===!0&&(Xt.length=0,Xt.push(i.COLOR_ATTACHMENT0+ue),R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&Xt.push(le),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Xt))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Z)for(let ue=0;ue<S.length;ue++){t.bindFramebuffer(i.FRAMEBUFFER,me.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ue,i.RENDERBUFFER,me.__webglColorRenderbuffer[ue]);let D=n.get(S[ue]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,me.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ue,i.TEXTURE_2D,D,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,me.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&l){let S=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[S])}}}function Tt(R){return Math.min(s.maxSamples,R.samples)}function pe(R){let S=n.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function zt(R){let S=o.render.frame;h.get(R)!==S&&(h.set(R,S),R.update())}function Be(R,S){let z=R.colorSpace,se=R.format,j=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||z!==rs&&z!==Ai&&(ft.getTransfer(z)===Mt?(se!==Dn||j!==bn)&&Ge("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):We("WebGLTextures: Unsupported texture color space:",z)),S}function qe(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=He,this.resetTextureUnits=$,this.getTextureUnits=te,this.setTextureUnits=Te,this.setTexture2D=_e,this.setTexture2DArray=we,this.setTexture3D=Fe,this.setTextureCube=ve,this.rebindTextures=ht,this.setupRenderTarget=_t,this.updateRenderTargetMipmap=F,this.updateMultisampleRenderTarget=it,this.setupDepthRenderbuffer=at,this.setupFrameBufferTexture=xe,this.useMultisampledRTT=pe,this.dispose=G}function $_(i,e){function t(n,s=Ai){let r,o=ft.getTransfer(s);if(n===bn)return i.UNSIGNED_BYTE;if(n===Ya)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Za)return i.UNSIGNED_SHORT_5_5_5_1;if(n===sh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===rh)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===nh)return i.BYTE;if(n===ih)return i.SHORT;if(n===nr)return i.UNSIGNED_SHORT;if(n===qa)return i.INT;if(n===Jn)return i.UNSIGNED_INT;if(n===Tn)return i.FLOAT;if(n===hn)return i.HALF_FLOAT;if(n===oh)return i.ALPHA;if(n===ah)return i.RGB;if(n===Dn)return i.RGBA;if(n===yi)return i.DEPTH_COMPONENT;if(n===wi)return i.DEPTH_STENCIL;if(n===Ja)return i.RED;if(n===Ka)return i.RED_INTEGER;if(n===Xi)return i.RG;if(n===$a)return i.RG_INTEGER;if(n===ja)return i.RGBA_INTEGER;if(n===lo||n===co||n===ho||n===uo)if(o===Mt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===lo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===co)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ho)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===uo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===lo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===co)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ho)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===uo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Qa||n===el||n===tl||n===nl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Qa)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===el)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===tl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===nl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===il||n===sl||n===rl||n===ol||n===al||n===fo||n===ll)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===il||n===sl)return o===Mt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===rl)return o===Mt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===ol)return r.COMPRESSED_R11_EAC;if(n===al)return r.COMPRESSED_SIGNED_R11_EAC;if(n===fo)return r.COMPRESSED_RG11_EAC;if(n===ll)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===cl||n===hl||n===ul||n===dl||n===fl||n===pl||n===ml||n===gl||n===xl||n===_l||n===vl||n===yl||n===Ml||n===Sl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===cl)return o===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===hl)return o===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ul)return o===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===dl)return o===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===fl)return o===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===pl)return o===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ml)return o===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===gl)return o===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===xl)return o===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===_l)return o===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===vl)return o===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===yl)return o===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ml)return o===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Sl)return o===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===El||n===bl||n===Tl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===El)return o===Mt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===bl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Tl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===wl||n===Al||n===po||n===Rl)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===wl)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Al)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===po)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Rl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ds?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var j_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Q_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Ih=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Gr(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new kt({vertexShader:j_,fragmentShader:Q_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ie(new ln(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Ph=class extends ti{constructor(e,t){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,p=null,f=null,_=typeof XRWebGLBinding<"u",m=new Ih,g={},v=t.getContextAttributes(),M=null,y=null,w=[],b=[],x=new ee,E=null,P=null,A=new an;A.viewport=new Rt;let I=new an;I.viewport=new Rt;let N=[A,I],O=new Ga,L=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let _e=w[Y];return _e===void 0&&(_e=new Vs,w[Y]=_e),_e.getTargetRaySpace()},this.getControllerGrip=function(Y){let _e=w[Y];return _e===void 0&&(_e=new Vs,w[Y]=_e),_e.getGripSpace()},this.getHand=function(Y){let _e=w[Y];return _e===void 0&&(_e=new Vs,w[Y]=_e),_e.getHandSpace()};function X(Y){let _e=b.indexOf(Y.inputSource);if(_e===-1)return;let we=w[_e];we!==void 0&&(we.update(Y.inputSource,Y.frame,c||o),we.dispatchEvent({type:Y.type,data:Y.inputSource}))}function k(){s.removeEventListener("select",X),s.removeEventListener("selectstart",X),s.removeEventListener("selectend",X),s.removeEventListener("squeeze",X),s.removeEventListener("squeezestart",X),s.removeEventListener("squeezeend",X),s.removeEventListener("end",k),s.removeEventListener("inputsourceschange",ne);for(let Y=0;Y<w.length;Y++){let _e=b[Y];_e!==null&&(b[Y]=null,w[Y].disconnect(_e))}L=null,G=null,m.reset();for(let Y in g)delete g[Y];if(e.setRenderTarget(M),p=null,d=null,u=null,s=null,y=null,He.stop(),n.isPresenting=!1,e.setPixelRatio(E),e.setSize(x.width,x.height,!1),P!==null){let Y=P.camera;Y.fov=P.fov,Y.zoom=P.zoom,Y.updateProjectionMatrix(),P=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,n.isPresenting===!0&&Ge("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,n.isPresenting===!0&&Ge("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return f},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(M=e.getRenderTarget(),s.addEventListener("select",X),s.addEventListener("selectstart",X),s.addEventListener("selectend",X),s.addEventListener("squeeze",X),s.addEventListener("squeezestart",X),s.addEventListener("squeezeend",X),s.addEventListener("end",k),s.addEventListener("inputsourceschange",ne),v.xrCompatible!==!0&&await t.makeXRCompatible(),E=e.getPixelRatio(),e.getSize(x),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let we=null,Fe=null,ve=null;v.depth&&(ve=v.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,we=v.stencil?wi:yi,Fe=v.stencil?ds:Jn);let Oe={colorFormat:t.RGBA8,depthFormat:ve,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(Oe),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new Gt(d.textureWidth,d.textureHeight,{format:Dn,type:bn,depthTexture:new Ei(d.textureWidth,d.textureHeight,Fe,void 0,void 0,void 0,void 0,void 0,void 0,we),stencilBuffer:v.stencil,colorSpace:e.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let we={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,we),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),y=new Gt(p.framebufferWidth,p.framebufferHeight,{format:Dn,type:bn,colorSpace:e.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1,storeMultisampledDepthBuffer:p.ignoreDepthValues===!1,storeMultisampledStencilBuffer:p.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),He.setContext(s),He.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function ne(Y){for(let _e=0;_e<Y.removed.length;_e++){let we=Y.removed[_e],Fe=b.indexOf(we);Fe>=0&&(b[Fe]=null,w[Fe].disconnect(we))}for(let _e=0;_e<Y.added.length;_e++){let we=Y.added[_e],Fe=b.indexOf(we);if(Fe===-1){for(let Oe=0;Oe<w.length;Oe++)if(Oe>=b.length){b.push(we),Fe=Oe;break}else if(b[Oe]===null){b[Oe]=we,Fe=Oe;break}if(Fe===-1)break}let ve=w[Fe];ve&&ve.connect(we)}}function W(Y,_e){_e===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(_e.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let _e=Y.near,we=Y.far;m.texture!==null&&(m.depthNear>0&&(_e=m.depthNear),m.depthFar>0&&(we=m.depthFar)),O.near=I.near=A.near=_e,O.far=I.far=A.far=we,(L!==O.near||G!==O.far)&&(s.updateRenderState({depthNear:O.near,depthFar:O.far}),L=O.near,G=O.far),O.layers.mask=Y.layers.mask|6,A.layers.mask=O.layers.mask&-5,I.layers.mask=O.layers.mask&-3;let Fe=Y.parent,ve=O.cameras;W(O,Fe);for(let Oe=0;Oe<ve.length;Oe++)W(ve[Oe],Fe);O.projectionMatrix.copy(A.projectionMatrix),O.projectionMatrixInverse.copy(A.projectionMatrixInverse),P===null&&Y.isPerspectiveCamera&&(P={camera:Y,fov:Y.fov,zoom:Y.zoom}),$(Y,O,Fe)};function $(Y,_e,we){we===null?Y.matrix.copy(_e.matrixWorld):(Y.matrix.copy(we.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(_e.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(_e.projectionMatrix),Y.projectionMatrixInverse.copy(_e.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Gs*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(!(d===null&&p===null))return l},this.setFoveation=function(Y){l=Y,d!==null&&(d.fixedFoveation=Y),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Y)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(O)},this.getCameraTexture=function(Y){return g[Y]};let te=null;function Te(Y,_e){if(h=_e.getViewerPose(c||o),f=_e,h!==null){let we=h.views;p!==null&&(e.setRenderTargetFramebuffer(y,p.framebuffer),e.setRenderTarget(y));let Fe=!1;we.length!==O.cameras.length&&(O.cameras.length=0,Fe=!0);for(let ke=0;ke<we.length;ke++){let tt=we[ke],ot=null;if(p!==null)ot=p.getViewport(tt);else{let he=u.getViewSubImage(d,tt);ot=he.viewport,ke===0&&(e.setRenderTargetTextures(y,he.colorTexture,he.depthStencilTexture),e.setRenderTarget(y))}let Q=N[ke];Q===void 0&&(Q=new an,Q.layers.enable(ke),Q.viewport=new Rt,N[ke]=Q),Q.matrix.fromArray(tt.transform.matrix),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.projectionMatrix.fromArray(tt.projectionMatrix),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert(),Q.viewport.set(ot.x,ot.y,ot.width,ot.height),ke===0&&(O.matrix.copy(Q.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),Fe===!0&&O.cameras.push(Q)}let ve=s.enabledFeatures;if(ve&&ve.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){u=n.getBinding();let ke=u.getDepthInformation(we[0]);ke&&ke.isValid&&ke.texture&&m.init(ke,s.renderState)}if(ve&&ve.includes("camera-access")&&_){e.state.unbindTexture(),u=n.getBinding();for(let ke=0;ke<we.length;ke++){let tt=we[ke].camera;if(tt){let ot=g[tt];ot||(ot=new Gr,g[tt]=ot);let Q=u.getCameraImage(tt);ot.sourceTexture=Q}}}}for(let we=0;we<w.length;we++){let Fe=b[we],ve=w[we];Fe!==null&&ve!==void 0&&ve.update(Fe,_e,c||o)}te&&te(Y,_e),_e.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:_e}),f=null}let He=new sf;He.setAnimationLoop(Te),this.setAnimationLoop=function(Y){te=Y},this.dispose=function(){}}},ev=new je,pf=new Ye;pf.set(-1,0,0,0,1,0,0,0,1);function tv(i,e){function t(m,g){m.matrixAutoUpdate===!0&&m.updateMatrix(),g.value.copy(m.matrix)}function n(m,g){g.color.getRGB(m.fogColor.value,_h(i)),g.isFog?(m.fogNear.value=g.near,m.fogFar.value=g.far):g.isFogExp2&&(m.fogDensity.value=g.density)}function s(m,g,v,M,y){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?r(m,g):g.isMeshLambertMaterial?(r(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(r(m,g),u(m,g)):g.isMeshPhongMaterial?(r(m,g),h(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(r(m,g),d(m,g),g.isMeshPhysicalMaterial&&p(m,g,y)):g.isMeshMatcapMaterial?(r(m,g),f(m,g)):g.isMeshDepthMaterial?r(m,g):g.isMeshDistanceMaterial?(r(m,g),_(m,g)):g.isMeshNormalMaterial?r(m,g):g.isLineBasicMaterial?(o(m,g),g.isLineDashedMaterial&&a(m,g)):g.isPointsMaterial?l(m,g,v,M):g.isSpriteMaterial?c(m,g):g.isShadowMaterial?(m.color.value.copy(g.color),m.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(m,g){m.opacity.value=g.opacity,g.color&&m.diffuse.value.copy(g.color),g.emissive&&m.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(m.map.value=g.map,t(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,t(g.alphaMap,m.alphaMapTransform)),g.bumpMap&&(m.bumpMap.value=g.bumpMap,t(g.bumpMap,m.bumpMapTransform),m.bumpScale.value=g.bumpScale,g.side===cn&&(m.bumpScale.value*=-1)),g.normalMap&&(m.normalMap.value=g.normalMap,t(g.normalMap,m.normalMapTransform),m.normalScale.value.copy(g.normalScale),g.side===cn&&m.normalScale.value.negate()),g.displacementMap&&(m.displacementMap.value=g.displacementMap,t(g.displacementMap,m.displacementMapTransform),m.displacementScale.value=g.displacementScale,m.displacementBias.value=g.displacementBias),g.emissiveMap&&(m.emissiveMap.value=g.emissiveMap,t(g.emissiveMap,m.emissiveMapTransform)),g.specularMap&&(m.specularMap.value=g.specularMap,t(g.specularMap,m.specularMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest);let v=e.get(g),M=v.envMap,y=v.envMapRotation;M&&(m.envMap.value=M,m.envMapRotation.value.setFromMatrix4(ev.makeRotationFromEuler(y)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(pf),m.reflectivity.value=g.reflectivity,m.ior.value=g.ior,m.refractionRatio.value=g.refractionRatio),g.lightMap&&(m.lightMap.value=g.lightMap,m.lightMapIntensity.value=g.lightMapIntensity,t(g.lightMap,m.lightMapTransform)),g.aoMap&&(m.aoMap.value=g.aoMap,m.aoMapIntensity.value=g.aoMapIntensity,t(g.aoMap,m.aoMapTransform))}function o(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,g.map&&(m.map.value=g.map,t(g.map,m.mapTransform))}function a(m,g){m.dashSize.value=g.dashSize,m.totalSize.value=g.dashSize+g.gapSize,m.scale.value=g.scale}function l(m,g,v,M){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.size.value=g.size*v,m.scale.value=M*.5,g.map&&(m.map.value=g.map,t(g.map,m.uvTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,t(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function c(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.rotation.value=g.rotation,g.map&&(m.map.value=g.map,t(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,t(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function h(m,g){m.specular.value.copy(g.specular),m.shininess.value=Math.max(g.shininess,1e-4)}function u(m,g){g.gradientMap&&(m.gradientMap.value=g.gradientMap)}function d(m,g){m.metalness.value=g.metalness,g.metalnessMap&&(m.metalnessMap.value=g.metalnessMap,t(g.metalnessMap,m.metalnessMapTransform)),m.roughness.value=g.roughness,g.roughnessMap&&(m.roughnessMap.value=g.roughnessMap,t(g.roughnessMap,m.roughnessMapTransform)),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)}function p(m,g,v){m.ior.value=g.ior,g.diffuseRoughness>0&&(m.diffuseRoughness.value=g.diffuseRoughness,g.diffuseRoughnessMap&&(m.diffuseRoughnessMap.value=g.diffuseRoughnessMap,t(g.diffuseRoughnessMap,m.diffuseRoughnessMapTransform))),g.sheen>0&&(m.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),m.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(m.sheenColorMap.value=g.sheenColorMap,t(g.sheenColorMap,m.sheenColorMapTransform)),g.sheenRoughnessMap&&(m.sheenRoughnessMap.value=g.sheenRoughnessMap,t(g.sheenRoughnessMap,m.sheenRoughnessMapTransform))),g.clearcoat>0&&(m.clearcoat.value=g.clearcoat,m.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(m.clearcoatMap.value=g.clearcoatMap,t(g.clearcoatMap,m.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,t(g.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(m.clearcoatNormalMap.value=g.clearcoatNormalMap,t(g.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===cn&&m.clearcoatNormalScale.value.negate())),g.dispersion>0&&(m.dispersion.value=g.dispersion),g.retroreflectivity>0&&(m.retroreflectivity.value=g.retroreflectivity),g.iridescence>0&&(m.iridescence.value=g.iridescence,m.iridescenceIOR.value=g.iridescenceIOR,m.iridescenceThicknessMinimum.value=g.iridescenceThicknessMinimum,m.iridescenceThicknessMaximum.value=g.iridescenceThicknessMaximum,g.iridescenceMap&&(m.iridescenceMap.value=g.iridescenceMap,t(g.iridescenceMap,m.iridescenceMapTransform)),g.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=g.iridescenceThicknessMap,t(g.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),g.transmission>0&&(m.transmission.value=g.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),g.transmissionMap&&(m.transmissionMap.value=g.transmissionMap,t(g.transmissionMap,m.transmissionMapTransform)),m.thickness.value=g.thickness,g.thicknessMap&&(m.thicknessMap.value=g.thicknessMap,t(g.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=g.attenuationDistance,m.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(m.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(m.anisotropyMap.value=g.anisotropyMap,t(g.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=g.specularIntensity,m.specularColor.value.copy(g.specularColor),g.specularColorMap&&(m.specularColorMap.value=g.specularColorMap,t(g.specularColorMap,m.specularColorMapTransform)),g.specularIntensityMap&&(m.specularIntensityMap.value=g.specularIntensityMap,t(g.specularIntensityMap,m.specularIntensityMapTransform))}function f(m,g){g.matcap&&(m.matcap.value=g.matcap)}function _(m,g){let v=e.get(g).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function nv(i,e,t,n){let s={},r={};function o(v,M){let y=M.program;n.uniformBlockBinding(v,y,s[v.id])}function a(v,M){let y=s[v.id];y===void 0&&(f(v),y=l(v),s[v.id]=y,v.addEventListener("dispose",m));let w=M.program;n.updateUBOMapping(v,w);let b=e.render.frame;r[v.id]!==b&&(c(v),r[v.id]=b)}function l(v){let M=i.createBuffer(),y=v.__size,w=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,y,w),i.bindBuffer(i.UNIFORM_BUFFER,null),M}function c(v){let M=s[v.id],y=v.uniforms,w=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let b=0,x=y.length;b<x;b++){let E=y[b];if(Array.isArray(E))for(let P=0,A=E.length;P<A;P++)h(E[P],b,P,w);else h(E,b,0,w)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function h(v,M,y,w){if(d(v,M,y,w)===!0){let b=v.__offset,x=v.value;if(Array.isArray(x)){let E=0;for(let P=0;P<x.length;P++){let A=x[P],I=_(A,!0);u(A,v.__data,E),E+=I.storage/Float32Array.BYTES_PER_ELEMENT}}else u(x,v.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,b,v.__data)}}function u(v,M,y){typeof v=="number"||typeof v=="boolean"?M[y]=v:v.isMatrix3?(M[y]=v.elements[0],M[y+1]=v.elements[1],M[y+2]=v.elements[2],M[y+3]=0,M[y+4]=v.elements[3],M[y+5]=v.elements[4],M[y+6]=v.elements[5],M[y+7]=0,M[y+8]=v.elements[6],M[y+9]=v.elements[7],M[y+10]=v.elements[8],M[y+11]=0):ArrayBuffer.isView(v)?M.set(v.subarray(0,M.length-y),y):v.toArray(M,y)}function d(v,M,y,w){let b=v.value,x=M+"_"+y;if(Array.isArray(b)){w[x]===void 0&&(w[x]=[]);let E=w[x],P=!1;for(let A=0;A<b.length;A++)p(b[A],E,A)===!0&&(P=!0);return P}return p(b,w,x)}function p(v,M,y){if(M[y]===void 0)return typeof v=="number"||typeof v=="boolean"?M[y]=v:ArrayBuffer.isView(v)?M[y]=v.slice():M[y]=v.clone(),!0;{let w=M[y];if(typeof v=="number"||typeof v=="boolean"){if(w!==v)return M[y]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(w.equals(v)===!1)return w.copy(v),!0}}return!1}function f(v){let M=v.uniforms,y=0,w=16;for(let x=0,E=M.length;x<E;x++){let P=Array.isArray(M[x])?M[x]:[M[x]];for(let A=0,I=P.length;A<I;A++){let N=P[A],O=Array.isArray(N.value)?N.value:[N.value],L=Array.isArray(M[x])||Array.isArray(N.value),G=y;for(let k=0,ne=O.length;k<ne;k++){let W=O[k],$=_(W,L),te=y%w,Te=te%$.boundary,He=te+Te;y+=Te,He!==0&&w-He<$.storage&&(y+=w-He),k===0&&(G=y),y+=$.storage}let X=N.type==="int"?Int32Array:N.type==="uint"?Uint32Array:Float32Array;N.__data=new X((y-G)/Float32Array.BYTES_PER_ELEMENT),N.__offset=G}}let b=y%w;return b>0&&(y+=w-b),v.__size=y,v.__cache={},this}function _(v,M){let y={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(y.boundary=4,y.storage=4):v.isVector2?(y.boundary=8,y.storage=8):v.isVector3||v.isColor?(y.boundary=16,y.storage=12):v.isVector4?(y.boundary=16,y.storage=16):v.isMatrix3?(y.boundary=16,y.storage=48):v.isMatrix4?(y.boundary=16,y.storage=64):v.isTexture?Ge("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(y.boundary=16,y.storage=v.byteLength):Ge("WebGLRenderer: Unsupported uniform value type.",v),M===!0&&(y.boundary=16,y.storage=Math.ceil(y.storage/16)*16),y}function m(v){let M=v.target;M.removeEventListener("dispose",m),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function g(){for(let v in s)i.deleteBuffer(s[v]);s={},r={}}return{bind:o,update:a,dispose:g}}var iv=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),li=null;function sv(){return li===null&&(li=new Mi(iv,16,16,Xi,hn),li.name="DFG_LUT",li.minFilter=$t,li.magFilter=$t,li.wrapS=Qn,li.wrapT=Qn,li.generateMipmaps=!1,li.needsUpdate=!0),li}var Dl=class{constructor(e={}){let{canvas:t=bd(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:p=bn}=e;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;let _=p,m=new Set([ja,$a,Ka]),g=new Set([bn,Jn,nr,ds,Ya,Za]),v=new Uint32Array(4),M=new Int32Array(4),y={textures:[],min:[],max:[],resolution:[]},w=null,b=null,x=[],E=[],P=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Bn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let A=this,I=!1,N=null,O=null,L=null,G=null;this._outputColorSpace=Zt;let X=0,k=0,ne=null,W=-1,$=null,te=new Rt,Te=new Rt,He=null,Y=new Pe(0),_e=0,we=t.width,Fe=t.height,ve=1,Oe=null,Ct=null,ke=new Rt(0,0,we,Fe),tt=new Rt(0,0,we,Fe),ot=!1,Q=new Hi,he=new _a,ae=!1,be=!1,xe=new je,Ke=new C,Le=new Rt,at={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},ht=!1;function _t(){return ne===null?ve:1}let F=n;function Xt(T,U){return t.getContext(T,U)}let it,Tt,pe,zt,Be,qe,R,S,z,se,j,le,me,Z,J,ue,D,K,q,de,oe,ce,De;try{let T={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"187"}`),t.addEventListener("webglcontextlost",Ne,!1),t.addEventListener("webglcontextrestored",$e,!1),t.addEventListener("webglcontextcreationerror",ye,!1),F===null){let U="webgl2";if(F=Xt(U,T),F===null)throw Xt(U)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Qe()}catch(T){throw t.removeEventListener("webglcontextlost",Ne,!1),t.removeEventListener("webglcontextrestored",$e,!1),t.removeEventListener("webglcontextcreationerror",ye,!1),We("WebGLRenderer: "+T.message),T}function Qe(){it=new mx(F),it.init(),oe=new $_(F,it),Tt=new sx(F,it,e,oe),pe=new J_(F,it),Tt.reversedDepthBuffer&&d&&pe.buffers.depth.setReversed(!0),O=F.createFramebuffer(),L=F.createFramebuffer(),G=F.createFramebuffer(),zt=new _x(F),Be=new U_,qe=new K_(F,it,pe,Be,Tt,oe,zt),R=new px(A),S=new yp(F),ce=new nx(F,S),z=new gx(F,S,zt,ce),se=new yx(F,z,S,ce,zt),K=new vx(F,Tt,qe),J=new rx(Be),j=new N_(A,R,it,Tt,ce,J),le=new tv(A,Be),me=new O_,Z=new V_(it),D=new tx(A,R,pe,se,f,l),ue=new Z_(A,se,Tt),De=new nv(F,zt,Tt,pe),q=new ix(F,it,zt),de=new xx(F,it,zt),zt.programs=j.programs,A.capabilities=Tt,A.extensions=it,A.properties=Be,A.renderLists=me,A.shadowMap=ue,A.state=pe,A.info=zt}_!==bn&&(P=new Sx(_,t.width,t.height,a,s,r));let re=new Ph(A,F);this.xr=re,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){let T=it.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){let T=it.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return ve},this.setPixelRatio=function(T){T!==void 0&&(ve=T,this.setSize(we,Fe,!1))},this.getSize=function(T){return T.set(we,Fe)},this.setSize=function(T,U,V=!0){if(re.isPresenting){Ge("WebGLRenderer: Can't change size while VR device is presenting.");return}we=T,Fe=U,t.width=Math.floor(T*ve),t.height=Math.floor(U*ve),V===!0&&(t.style.width=T+"px",t.style.height=U+"px"),P!==null&&P.setSize(t.width,t.height),this.setViewport(0,0,T,U)},this.getDrawingBufferSize=function(T){return T.set(we*ve,Fe*ve).floor()},this.setDrawingBufferSize=function(T,U,V){we=T,Fe=U,ve=V,t.width=Math.floor(T*V),t.height=Math.floor(U*V),this.setViewport(0,0,T,U)},this.setEffects=function(T){if(_===bn){We("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(T){for(let U=0;U<T.length;U++)if(T[U].isOutputPass===!0){Ge("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}P.setEffects(T||[])},this.getCurrentViewport=function(T){return T.copy(te)},this.getViewport=function(T){return T.copy(ke)},this.setViewport=function(T,U,V,B){T.isVector4?ke.set(T.x,T.y,T.z,T.w):ke.set(T,U,V,B),pe.viewport(te.copy(ke).multiplyScalar(_t()).round())},this.getScissor=function(T){return T.copy(tt)},this.setScissor=function(T,U,V,B){T.isVector4?tt.set(T.x,T.y,T.z,T.w):tt.set(T,U,V,B),pe.scissor(Te.copy(tt).multiplyScalar(_t()).round())},this.getScissorTest=function(){return ot},this.setScissorTest=function(T){pe.setScissorTest(ot=T)},this.setOpaqueSort=function(T){Oe=T},this.setTransparentSort=function(T){Ct=T},this.getClearColor=function(T){return T.copy(D.getClearColor())},this.setClearColor=function(){D.setClearColor(...arguments)},this.getClearAlpha=function(){return D.getClearAlpha()},this.setClearAlpha=function(){D.setClearAlpha(...arguments)},this.clear=function(T=!0,U=!0,V=!0){let B=0;if(T){let H=!1;if(ne!==null){let ge=ne.texture.format;H=m.has(ge)}if(H){let ge=ne.texture.type,Ae=g.has(ge),fe=D.getClearColor(),Se=D.getClearAlpha(),Ie=fe.r,Je=fe.g,ut=fe.b;Ae?(v[0]=Ie,v[1]=Je,v[2]=ut,v[3]=Se,F.clearBufferuiv(F.COLOR,0,v)):(M[0]=Ie,M[1]=Je,M[2]=ut,M[3]=Se,F.clearBufferiv(F.COLOR,0,M))}else B|=F.COLOR_BUFFER_BIT}U&&(B|=F.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),V&&(B|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B!==0&&F.clear(B)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(T){T.setRenderer(this),N=T},this.dispose=function(){t.removeEventListener("webglcontextlost",Ne,!1),t.removeEventListener("webglcontextrestored",$e,!1),t.removeEventListener("webglcontextcreationerror",ye,!1),D.dispose(),me.dispose(),Z.dispose(),qe.dispose(),Be.dispose(),R.dispose(),se.dispose(),z.dispose(),ce.dispose(),De.dispose(),j.dispose(),re.dispose(),re.removeEventListener("sessionstart",jh),re.removeEventListener("sessionend",Qh),$i.stop()};function Ne(T){T.preventDefault(),Cr("WebGLRenderer: Context Lost."),I=!0}function $e(){Cr("WebGLRenderer: Context Restored."),I=!1;let T=zt.autoReset,U=ue.enabled,V=ue.autoUpdate,B=ue.needsUpdate,H=ue.type;Qe(),zt.autoReset=T,ue.enabled=U,ue.autoUpdate=V,ue.needsUpdate=B,ue.type=H}function ye(T){We("WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function St(T){let U=T.target;U.removeEventListener("dispose",St),tn(U)}function tn(T){Di(T),Be.remove(T)}function Di(T){let U=Be.get(T).programs;U!==void 0&&(U.forEach(function(V){j.releaseProgram(V)}),T.isShaderMaterial&&j.releaseShaderCache(T))}this.renderBufferDirect=function(T,U,V,B,H,ge){U===null&&(U=at);let Ae=H.isMesh&&H.matrixWorld.determinantAffine()<0,fe=Xf(T,U,V,B,H);pe.setMaterial(B,Ae);let Se=V.index,Ie=1;if(B.wireframe===!0){if(Se=z.getWireframeAttribute(V),Se===void 0)return;Ie=2}let Je=V.drawRange,ut=V.attributes.position,Re=Je.start*Ie,dt=(Je.start+Je.count)*Ie;ge!==null&&(Re=Math.max(Re,ge.start*Ie),dt=Math.min(dt,(ge.start+ge.count)*Ie)),Se!==null?(Re=Math.max(Re,0),dt=Math.min(dt,Se.count)):ut!=null&&(Re=Math.max(Re,0),dt=Math.min(dt,ut.count));let qt=dt-Re;if(qt<0||qt===1/0)return;ce.setup(H,B,fe,V,Se);let At,wt=q;if(Se!==null&&(At=S.get(Se),wt=de,wt.setIndex(At)),H.isMesh)B.wireframe===!0?(pe.setLineWidth(B.wireframeLinewidth*_t()),wt.setMode(F.LINES)):wt.setMode(F.TRIANGLES);else if(H.isLine){let un=B.linewidth;un===void 0&&(un=1),pe.setLineWidth(un*_t()),H.isLineSegments?wt.setMode(F.LINES):H.isLineLoop?wt.setMode(F.LINE_LOOP):wt.setMode(F.LINE_STRIP)}else H.isPoints?wt.setMode(F.POINTS):H.isSprite&&wt.setMode(F.TRIANGLES);if(H.isBatchedMesh)if(it.get("WEBGL_multi_draw"))wt.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{let un=H._multiDrawStarts,Ce=H._multiDrawCounts,_n=H._multiDrawCount,vt=Se?S.get(Se).bytesPerElement:1,ji=Be.get(B).currentProgram.getUniforms();for(let dn=0;dn<_n;dn++)ji.setValue(F,"_gl_DrawID",dn),wt.render(un[dn]/vt,Ce[dn])}else if(H.isInstancedMesh)wt.renderInstances(Re,qt,H.count);else if(V.isInstancedBufferGeometry){let un=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,Ce=Math.min(V.instanceCount,un);wt.renderInstances(Re,qt,Ce)}else wt.render(Re,qt)};function $h(T,U,V,B){N!==null&&T.isNodeMaterial&&N.setObject(B,T),ae===!0&&J.setState(T,V,!1),T.transparent===!0&&T.side===Ot&&T.forceSinglePass===!1?(T.side=cn,T.needsUpdate=!0,cr(T,U,B),T.side=Wi,T.needsUpdate=!0,cr(T,U,B),T.side=Ot):cr(T,U,B)}this.compile=function(T,U,V=null){V===null&&(V=T),N!==null&&N.renderStart(T,U,V),b=Z.get(V),b.init(U),E.push(b),V.traverseVisible(function(H){H.isLight&&H.layers.test(U.layers)&&(b.pushLight(H),H.castShadow&&b.pushShadow(H))}),T!==V&&T.traverseVisible(function(H){H.isLight&&H.layers.test(U.layers)&&(b.pushLight(H),H.castShadow&&b.pushShadow(H))}),b.setupLights(),N!==null&&N.updateLights(b.state.lightsArray),be=this.localClippingEnabled,ae=J.init(this.clippingPlanes,be),ae===!0&&J.setGlobalState(this.clippingPlanes,U),N!==null&&ue.render(b.state.shadowsArray,V,U);let B=new Set;return T.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;let ge=H.material;if(ge)if(Array.isArray(ge))for(let Ae=0;Ae<ge.length;Ae++){let fe=ge[Ae];$h(fe,V,U,H),B.add(fe)}else $h(ge,V,U,H),B.add(ge)}),b=E.pop(),N!==null&&N.renderEnd(),B},this.compileAsync=function(T,U,V=null){let B=this.compile(T,U,V);return new Promise(H=>{function ge(){if(B.forEach(function(Ae){let Se=Be.get(Ae).currentProgram;(Se===void 0||Se.isReady())&&B.delete(Ae)}),B.size===0){H(T);return}setTimeout(ge,10)}it.get("KHR_parallel_shader_compile")!==null?ge():setTimeout(ge,10)})};let ic=null;function Vf(T){ic&&ic(T)}function jh(){$i.stop()}function Qh(){$i.start()}let $i=new sf;$i.setAnimationLoop(Vf),typeof self<"u"&&$i.setContext(self),this.setAnimationLoop=function(T){ic=T,re.setAnimationLoop(T),T===null?$i.stop():$i.start()},re.addEventListener("sessionstart",jh),re.addEventListener("sessionend",Qh),this.render=function(T,U){if(U!==void 0&&U.isCamera!==!0){We("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;N!==null&&N.renderStart(T,U);let V=re.enabled===!0&&re.isPresenting===!0,B=P!==null&&(ne===null||V)&&P.begin(A,ne);if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),re.enabled===!0&&re.isPresenting===!0&&(P===null||P.isCompositing()===!1)&&(re.cameraAutoUpdate===!0&&re.updateCamera(U),U=re.getCamera()),T.isScene===!0&&T.onBeforeRender(A,T,U,ne),b=Z.get(T,E.length),b.init(U),b.state.textureUnits=qe.getTextureUnits(),E.push(b),xe.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),U.isArrayCamera?he.setFromArrayCamera(U):Q.setFromProjectionMatrix(xe,On,U.reversedDepth),be=this.localClippingEnabled,ae=J.init(this.clippingPlanes,be),w=me.get(T,x.length),w.init(),x.push(w),this.info.render.frame++,re.enabled===!0&&re.isPresenting===!0){let Ae=A.xr.getDepthSensingMesh();Ae!==null&&sc(Ae,U,-1/0,A.sortObjects)}sc(T,U,0,A.sortObjects),w.finish(),N!==null&&N.updateLights(b.state.lightsArray),A.sortObjects===!0&&w.sort(Oe,Ct),ht=re.enabled===!1||re.isPresenting===!1||re.hasDepthSensing()===!1,ht&&D.addToRenderList(w,T),this.info.autoReset===!0&&this.info.reset(),ae===!0&&J.beginShadows();let H=b.state.shadowsArray;if(ue.render(H,T,U),ae===!0&&J.endShadows(),(B&&P.hasRenderPass())===!1){let Ae=w.opaque,fe=w.transmissive;if(b.setupLights(),U.isArrayCamera){let Se=U.cameras;if(fe.length>0)for(let Ie=0,Je=Se.length;Ie<Je;Ie++){let ut=Se[Ie];tu(Ae,fe,T,ut)}ht&&D.render(T);for(let Ie=0,Je=Se.length;Ie<Je;Ie++){let ut=Se[Ie];eu(w,T,ut,ut.viewport)}}else fe.length>0&&tu(Ae,fe,T,U),ht&&D.render(T),eu(w,T,U)}ne!==null&&k===0&&(qe.updateMultisampleRenderTarget(ne),qe.updateRenderTargetMipmap(ne)),B&&P.end(A),T.isScene===!0&&T.onAfterRender(A,T,U),ce.resetDefaultState(),W=-1,$=null,E.pop(),E.length>0?(b=E[E.length-1],qe.setTextureUnits(b.state.textureUnits),ae===!0&&J.setGlobalState(A.clippingPlanes,b.state.camera)):b=null,x.pop(),x.length>0?w=x[x.length-1]:w=null,N!==null&&N.renderEnd()};function sc(T,U,V,B){if(T.visible===!1)return;if(T.layers.test(U.layers)){if(T.isGroup)V=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(U);else if(T.isLight)b.pushLight(T),T.castShadow&&b.pushShadow(T);else if(T.isSprite){let Ae=U.isArrayCamera?he:Q;if(!T.frustumCulled||T.intersectsFrustum(Ae)){B&&Le.setFromMatrixPosition(T.matrixWorld).applyMatrix4(xe);let fe=se.update(T),Se=T.material;Se.visible&&w.push(T,fe,Se,V,Le.z,null,U)}}else if(T.isMesh||T.isLine||T.isPoints){let Ae=U.isArrayCamera?he:Q;if(!T.frustumCulled||T.intersectsFrustum(Ae)){let fe=se.update(T),Se=T.material;if(B&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Le.copy(T.boundingSphere.center)):(fe.boundingSphere===null&&fe.computeBoundingSphere(),Le.copy(fe.boundingSphere.center)),Le.applyMatrix4(T.matrixWorld).applyMatrix4(xe)),Array.isArray(Se)){let Ie=fe.groups;for(let Je=0,ut=Ie.length;Je<ut;Je++){let Re=Ie[Je],dt=Se[Re.materialIndex];dt&&dt.visible&&w.push(T,fe,dt,V,Le.z,Re,U)}}else Se.visible&&w.push(T,fe,Se,V,Le.z,null,U)}}}let ge=T.children;for(let Ae=0,fe=ge.length;Ae<fe;Ae++)sc(ge[Ae],U,V,B)}function eu(T,U,V,B){let{opaque:H,transmissive:ge,transparent:Ae}=T;b.setupLightsView(V),ae===!0&&J.setGlobalState(A.clippingPlanes,V),B&&pe.viewport(te.copy(B)),H.length>0&&wo(H,U,V),ge.length>0&&wo(ge,U,V),Ae.length>0&&wo(Ae,U,V),pe.buffers.depth.setTest(!0),pe.buffers.depth.setMask(!0),pe.buffers.color.setMask(!0),pe.setPolygonOffset(!1)}function tu(T,U,V,B){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[B.id]===void 0){let Re=it.has("EXT_color_buffer_half_float")||it.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[B.id]=new Gt(1,1,{generateMipmaps:!0,type:Re?hn:bn,minFilter:Ln,samples:Math.max(4,Tt.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:ft.workingColorSpace})}let ge=b.state.transmissionRenderTarget[B.id],Ae=B.viewport||te;ge.setSize(Ae.z*A.transmissionResolutionScale,Ae.w*A.transmissionResolutionScale);let fe=A.getRenderTarget(),Se=A.getActiveCubeFace(),Ie=A.getActiveMipmapLevel();A.setRenderTarget(ge),A.getClearColor(Y),_e=A.getClearAlpha(),_e<1&&A.setClearColor(16777215,.5),A.clear(),ht&&D.render(V);let Je=A.toneMapping;A.toneMapping=Bn;let ut=B.viewport;if(B.viewport!==void 0&&(B.viewport=void 0),b.setupLightsView(B),ae===!0&&J.setGlobalState(A.clippingPlanes,B),wo(T,V,B),qe.updateMultisampleRenderTarget(ge),qe.updateRenderTargetMipmap(ge),it.has("WEBGL_multisampled_render_to_texture")===!1){let Re=!1;for(let dt=0,qt=U.length;dt<qt;dt++){let At=U[dt],{object:wt,geometry:un,material:Ce,group:_n}=At;if(Ce.side===Ot&&wt.layers.test(B.layers)){let vt=Ce.side;Ce.side=cn,Ce.needsUpdate=!0,nu(wt,V,B,un,Ce,_n),Ce.side=vt,Ce.needsUpdate=!0,Re=!0}}Re===!0&&(qe.updateMultisampleRenderTarget(ge),qe.updateRenderTargetMipmap(ge))}A.setRenderTarget(fe,Se,Ie),A.setClearColor(Y,_e),ut!==void 0&&(B.viewport=ut),A.toneMapping=Je}function wo(T,U,V){let B=U.isScene===!0?U.overrideMaterial:null;for(let H=0,ge=T.length;H<ge;H++){let Ae=T[H],{object:fe,geometry:Se,group:Ie}=Ae,Je=Ae.material;Je.allowOverride===!0&&B!==null&&(Je=B),fe.layers.test(V.layers)&&nu(fe,U,V,Se,Je,Ie)}}function nu(T,U,V,B,H,ge){N!==null&&H.isNodeMaterial&&N.setObject(T,H),T.onBeforeRender(A,U,V,B,H,ge),T.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),H.onBeforeRender(A,U,V,B,T,ge),H.transparent===!0&&H.side===Ot&&H.forceSinglePass===!1?(H.side=cn,H.needsUpdate=!0,A.renderBufferDirect(V,U,B,H,T,ge),H.side=Wi,H.needsUpdate=!0,A.renderBufferDirect(V,U,B,H,T,ge),H.side=Ot):A.renderBufferDirect(V,U,B,H,T,ge),T.onAfterRender(A,U,V,B,H,ge)}function iu(T){let U=0;for(let V of T)V.texture!==null&&U++;return U}function cr(T,U,V){U.isScene!==!0&&(U=at);let B=Be.get(T),H=b.state.lights,ge=b.state.shadowsArray,Ae=H.state.version,fe=j.getParameters(T,H.state,ge,U,V,b.state.lightProbeGridArray),Se=j.getProgramCacheKey(fe),Ie=B.programs;B.environment=T.isMeshStandardMaterial||T.isMeshLambertMaterial||T.isMeshPhongMaterial?U.environment:null,B.fog=U.fog;let Je=T.isMeshStandardMaterial||T.isMeshLambertMaterial&&!T.envMap||T.isMeshPhongMaterial&&!T.envMap;B.envMap=R.get(T.envMap||B.environment,Je),B.envMapRotation=B.environment!==null&&T.envMap===null?U.environmentRotation:T.envMapRotation,Ie===void 0&&(T.addEventListener("dispose",St),Ie=new Map,B.programs=Ie,B.programVariants=new Map);let ut=Ie.get(Se);if(ut!==void 0){if(B.currentProgram===ut&&B.lightsStateVersion===Ae)return ru(T,fe),ut}else fe.uniforms=j.getUniforms(T),N!==null&&T.isNodeMaterial&&N.build(T,V,fe),T.onBeforeCompile(fe,A),ut=j.acquireProgram(fe,Se),Ie.set(Se,ut),B.uniforms=fe.uniforms;let Re=B.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Re.clippingPlanes=J.uniform),ru(T,fe),B.needsLights=Yf(T),B.lightsStateVersion=Ae,B.needsLights&&(Re.ambientLightColor.value=H.state.ambient,Re.lightProbe.value=H.state.probe,Re.sunLights.value=H.state.sun,Re.sunLightShadows.value=H.state.sunShadow,Re.directionalLights.value=H.state.directional,Re.directionalLightShadows.value=H.state.directionalShadow,Re.spotLights.value=H.state.spot,Re.spotLightShadows.value=H.state.spotShadow,Re.rectAreaLights.value=H.state.rectArea,Re.ltc_1.value=H.state.rectAreaLTC1,Re.ltc_2.value=H.state.rectAreaLTC2,Re.pointLights.value=H.state.point,Re.pointLightShadows.value=H.state.pointShadow,Re.hemisphereLights.value=H.state.hemi,Re.sunShadowMatrix.value=H.state.sunShadowMatrix,Re.sunShadowCascade.value=H.state.sunShadowCascade,Re.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Re.spotLightMatrix.value=H.state.spotLightMatrix,Re.spotLightMap.value=H.state.spotLightMap,Re.pointShadowMatrix.value=H.state.pointShadowMatrix),B.numLightProbeGrids=iu(b.state.lightProbeGridArray),B.currentProgram=ut,B.uniformsList=null,ut}function Wf(T,U,V,B,H){let ge=Be.get(T),Ae=ge.currentProgram.id+","+B+","+H,fe=ge.programVariants.get(Ae);return fe===void 0?(fe=cr(T,U,V),ge.programVariants.set(Ae,fe)):(ge.currentProgram=fe,ge.uniformsList=null,ge.outputColorSpace=B,ge.toneMapping=H),fe}function su(T){if(T.uniformsList===null){let U=T.currentProgram.getUniforms();T.uniformsList=ir.seqWithValue(U.seq,T.uniforms)}return T.uniformsList}function ru(T,U){let V=Be.get(T);V.outputColorSpace=U.outputColorSpace,V.batching=U.batching,V.batchingColor=U.batchingColor,V.instancing=U.instancing,V.instancingColor=U.instancingColor,V.instancingMorph=U.instancingMorph,V.skinning=U.skinning,V.morphTargets=U.morphTargets,V.morphNormals=U.morphNormals,V.morphColors=U.morphColors,V.morphTargetsCount=U.morphTargetsCount,V.numClippingPlanes=U.numClippingPlanes,V.numIntersection=U.numClipIntersection,V.vertexAlphas=U.vertexAlphas,V.vertexTangents=U.vertexTangents,V.toneMapping=U.toneMapping}function Xf(T,U,V,B,H){U.isScene!==!0&&(U=at),qe.resetTextureUnits();let ge=U.fog,Ae=B.isMeshStandardMaterial||B.isMeshLambertMaterial||B.isMeshPhongMaterial?U.environment:null,fe=ne===null?A.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:ft.workingColorSpace,Se=B.isMeshStandardMaterial||B.isMeshLambertMaterial&&!B.envMap||B.isMeshPhongMaterial&&!B.envMap,Ie=R.get(B.envMap||Ae,Se),Je=B.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,ut=!!V.attributes.tangent&&(!!B.normalMap||B.anisotropy>0),Re=!!V.morphAttributes.position,dt=!!V.morphAttributes.normal,qt=!!V.morphAttributes.color,At=Bn;B.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(At=A.toneMapping);let wt=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,un=wt!==void 0?wt.length:0,Ce=Be.get(B),_n=b.state.lights;if(ae===!0&&(be===!0||T!==$)){let Nt=T===$&&B.id===W;J.setState(B,T,Nt)}let vt=!1,ji=!1;B.version===Ce.__version?Ce.needsLights&&Ce.lightsStateVersion!==_n.state.version||H.isBatchedMesh&&Ce.batching===!1||!H.isBatchedMesh&&Ce.batching===!0||H.isBatchedMesh&&Ce.batchingColor===!0&&H._colorsTexture===null||H.isBatchedMesh&&Ce.batchingColor===!1&&H._colorsTexture!==null||H.isInstancedMesh&&Ce.instancing===!1||!H.isInstancedMesh&&Ce.instancing===!0||H.isSkinnedMesh&&Ce.skinning===!1||!H.isSkinnedMesh&&Ce.skinning===!0||H.isInstancedMesh&&Ce.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Ce.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&Ce.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&Ce.instancingMorph===!1&&H.morphTexture!==null||Ce.envMap!==Ie||B.fog===!0&&Ce.fog!==ge||Ce.numClippingPlanes!==void 0&&(Ce.numClippingPlanes!==J.numPlanes||Ce.numIntersection!==J.numIntersection)||Ce.vertexAlphas!==Je||Ce.vertexTangents!==ut||Ce.morphTargets!==Re||Ce.morphNormals!==dt||Ce.morphColors!==qt||Ce.morphTargetsCount!==un||Ce.numLightProbeGrids!==iu(b.state.lightProbeGridArray)?vt=!0:(Ce.outputColorSpace!==fe||Ce.toneMapping!==At)&&(ji=!0):(vt=!0,Ce.__version=B.version);let dn=Ce.currentProgram;(vt===!0||ji===!0)&&(dn=ji===!0?Wf(B,U,H,fe,At):cr(B,U,H),N&&B.isNodeMaterial&&N.onUpdateProgram(B,dn,Ce));let Ao=!1,Ni=!1,Qi=!1,gt=dn.getUniforms(),on=Ce.uniforms;if(pe.useProgram(dn.program)&&(Ao=!0,Ni=!0,Qi=!0),B.id!==W&&(W=B.id,Ni=!0),Ao||$!==T){pe.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),gt.setValue(F,"projectionMatrix",T.projectionMatrix),gt.setValue(F,"viewMatrix",T.matrixWorldInverse);let nn=gt.map.cameraPosition;nn!==void 0&&nn.setValue(F,Ke.setFromMatrixPosition(T.matrixWorld)),Tt.logarithmicDepthBuffer&&gt.setValue(F,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(B.isMeshPhongMaterial||B.isMeshToonMaterial||B.isMeshLambertMaterial||B.isMeshBasicMaterial||B.isMeshStandardMaterial||B.isShaderMaterial)&&gt.setValue(F,"isOrthographic",T.isOrthographicCamera===!0),$!==T&&($=T,Ni=!0,Qi=!0)}if(Ce.needsLights&&(_n.state.sunShadowMap.length>0&&gt.setValue(F,"sunShadowMap",_n.state.sunShadowMap,qe),_n.state.directionalShadowMap.length>0&&gt.setValue(F,"directionalShadowMap",_n.state.directionalShadowMap,qe),_n.state.spotShadowMap.length>0&&gt.setValue(F,"spotShadowMap",_n.state.spotShadowMap,qe),_n.state.pointShadowMap.length>0&&gt.setValue(F,"pointShadowMap",_n.state.pointShadowMap,qe)),H.isSkinnedMesh){gt.setOptional(F,H,"bindMatrix"),gt.setOptional(F,H,"bindMatrixInverse");let Nt=H.skeleton;Nt&&(Nt.boneTexture===null&&Nt.computeBoneTexture(),gt.setValue(F,"boneTexture",Nt.boneTexture,qe))}H.isBatchedMesh&&(gt.setOptional(F,H,"batchingTexture"),gt.setValue(F,"batchingTexture",H._matricesTexture,qe),gt.setOptional(F,H,"batchingIdTexture"),gt.setValue(F,"batchingIdTexture",H._indirectTexture,qe),gt.setOptional(F,H,"batchingColorTexture"),H._colorsTexture!==null&&gt.setValue(F,"batchingColorTexture",H._colorsTexture,qe));let Gn=V.morphAttributes;if((Gn.position!==void 0||Gn.normal!==void 0||Gn.color!==void 0)&&K.update(H,V,dn),(Ni||Ce.receiveShadow!==H.receiveShadow)&&(Ce.receiveShadow=H.receiveShadow,gt.setValue(F,"receiveShadow",H.receiveShadow)),(B.isMeshStandardMaterial||B.isMeshLambertMaterial||B.isMeshPhongMaterial)&&B.envMap===null&&U.environment!==null&&(on.envMapIntensity.value=U.environmentIntensity),on.dfgLUT!==void 0&&(on.dfgLUT.value=sv()),Ni){if(gt.setValue(F,"toneMappingExposure",A.toneMappingExposure),Ce.needsLights&&qf(on,Qi),ge&&B.fog===!0&&le.refreshFogUniforms(on,ge),le.refreshMaterialUniforms(on,B,ve,Fe,b.state.transmissionRenderTarget[T.id]),Ce.needsLights&&Ce.numLightProbeGrids>0){let Nt=y,nn=0;for(let di of b.state.lightProbeGridArray)di.texture!==null&&(Nt.textures[nn]=di.texture,Nt.min[nn]=di.boundingBox.min,Nt.max[nn]=di.boundingBox.max,Nt.resolution[nn]=di.resolution,nn++);for(let di in Nt)Nt[di].length=nn;on.probesSH.value=Nt.textures,on.probesMin.value=Nt.min,on.probesMax.value=Nt.max,on.probesResolution.value=Nt.resolution}ir.upload(F,su(Ce),on,qe)}if(B.isShaderMaterial&&B.uniformsNeedUpdate===!0&&(ir.upload(F,su(Ce),on,qe),B.uniformsNeedUpdate=!1),B.isSpriteMaterial&&gt.setValue(F,"center",H.center),gt.setValue(F,"modelViewMatrix",H.modelViewMatrix),gt.setValue(F,"normalMatrix",H.normalMatrix),gt.setValue(F,"modelMatrix",H.matrixWorld),B.uniformsGroups!==void 0){let Nt=B.uniformsGroups;for(let nn=0,di=Nt.length;nn<di;nn++){let au=Nt[nn];De.update(au,dn),De.bind(au,dn)}}return dn}function qf(T,U){T.ambientLightColor.needsUpdate=U,T.lightProbe.needsUpdate=U,T.sunLights.needsUpdate=U,T.sunLightShadows.needsUpdate=U,T.directionalLights.needsUpdate=U,T.directionalLightShadows.needsUpdate=U,T.pointLights.needsUpdate=U,T.pointLightShadows.needsUpdate=U,T.spotLights.needsUpdate=U,T.spotLightShadows.needsUpdate=U,T.rectAreaLights.needsUpdate=U,T.hemisphereLights.needsUpdate=U}function Yf(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return X},this.getActiveMipmapLevel=function(){return k},this.getRenderTarget=function(){return ne},this.setRenderTargetTextures=function(T,U,V){let B=Be.get(T);B.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,B.__autoAllocateDepthBuffer===!1&&(B.__useRenderToTexture=!1),Be.get(T.texture).__webglTexture=U,Be.get(T.depthTexture).__webglTexture=B.__autoAllocateDepthBuffer?void 0:V,B.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,U){let V=Be.get(T);V.__webglFramebuffer=U,V.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(T,U=0,V=0){ne=T,X=U,k=V;let B=null,H=!1,ge=!1;if(T){let fe=Be.get(T);if(fe.__useDefaultFramebuffer!==void 0){pe.bindFramebuffer(F.FRAMEBUFFER,fe.__webglFramebuffer),te.copy(T.viewport),Te.copy(T.scissor),He=T.scissorTest,pe.viewport(te),pe.scissor(Te),pe.setScissorTest(He),W=-1;return}else if(fe.__webglFramebuffer===void 0)qe.setupRenderTarget(T);else if(fe.__hasExternalTextures)qe.rebindTextures(T,Be.get(T.texture).__webglTexture,Be.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){let Je=T.depthTexture;if(fe.__boundDepthTexture!==Je){if(Je!==null&&Be.has(Je)&&(T.width!==Je.image.width||T.height!==Je.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");qe.setupDepthRenderbuffer(T)}}let Se=T.texture;(Se.isData3DTexture||Se.isDataArrayTexture||Se.isCompressedArrayTexture)&&(ge=!0);let Ie=Be.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Ie[U])?B=Ie[U][V]:B=Ie[U],H=!0):T.samples>0&&qe.useMultisampledRTT(T)===!1?B=Be.get(T).__webglMultisampledFramebuffer:Array.isArray(Ie)?B=Ie[V]:B=Ie,te.copy(T.viewport),Te.copy(T.scissor),He=T.scissorTest}else te.copy(ke).multiplyScalar(ve).floor(),Te.copy(tt).multiplyScalar(ve).floor(),He=ot;if(V!==0&&(B=O),pe.bindFramebuffer(F.FRAMEBUFFER,B)&&pe.drawBuffers(T,B),pe.viewport(te),pe.scissor(Te),pe.setScissorTest(He),H){let fe=Be.get(T.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+U,fe.__webglTexture,V)}else if(ge){let fe=U;for(let Se=0;Se<T.textures.length;Se++){let Ie=Be.get(T.textures[Se]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+Se,Ie.__webglTexture,V,fe)}}else if(T!==null&&V!==0){let fe=Be.get(T.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,fe.__webglTexture,V)}W=-1};function ou(T){let U=Be.get(T);return(U.__readFormat!==T.format||U.__readType!==T.type)&&(U.__readFormat=T.format,U.__readType=T.type,U.__formatReadable=Tt.textureFormatReadable(T.format),U.__typeReadable=Tt.textureTypeReadable(T.type)),U}this.readRenderTargetPixels=function(T,U,V,B,H,ge,Ae,fe=0){if(!(T&&T.isWebGLRenderTarget)){We("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Se=Be.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Ae!==void 0&&(Se=Se[Ae],Array.isArray(Se)&&(Se=Se[0])),Se){pe.bindFramebuffer(F.FRAMEBUFFER,Se);try{let Ie=T.textures[fe],Je=Ie.format,ut=Ie.type;T.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+fe);let Re=ou(Ie);if(Re.__formatReadable===!1){We("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Re.__typeReadable===!1){We("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=T.width-B&&V>=0&&V<=T.height-H&&F.readPixels(U,V,B,H,oe.convert(Je),oe.convert(ut),ge)}finally{let Ie=ne!==null?Be.get(ne).__webglFramebuffer:null;pe.bindFramebuffer(F.FRAMEBUFFER,Ie)}}},this.readRenderTargetPixelsAsync=async function(T,U,V,B,H,ge,Ae,fe=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Se=Be.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Ae!==void 0&&(Se=Se[Ae],Array.isArray(Se)&&(Se=Se[0])),Se)if(U>=0&&U<=T.width-B&&V>=0&&V<=T.height-H){pe.bindFramebuffer(F.FRAMEBUFFER,Se);let Ie=T.textures[fe],Je=Ie.format,ut=Ie.type;T.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+fe);let Re=ou(Ie);if(Re.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Re.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let dt=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,dt),F.bufferData(F.PIXEL_PACK_BUFFER,ge.byteLength,F.STREAM_READ),F.readPixels(U,V,B,H,oe.convert(Je),oe.convert(ut),0),F.bindBuffer(F.PIXEL_PACK_BUFFER,null);let qt=ne!==null?Be.get(ne).__webglFramebuffer:null;pe.bindFramebuffer(F.FRAMEBUFFER,qt);let At=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await wd(F,At,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,dt),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,ge),F.bindBuffer(F.PIXEL_PACK_BUFFER,null),F.deleteBuffer(dt),F.deleteSync(At),ge}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,U=null,V=0){let B=Math.pow(2,-V),H=Math.floor(T.image.width*B),ge=Math.floor(T.image.height*B),Ae=U!==null?U.x:0,fe=U!==null?U.y:0;qe.setTexture2D(T,0),F.copyTexSubImage2D(F.TEXTURE_2D,V,0,0,Ae,fe,H,ge),pe.unbindTexture()},this.copyTextureToTexture=function(T,U,V=null,B=null,H=0,ge=0){let Ae,fe,Se,Ie,Je,ut,Re,dt,qt,At=T.isCompressedTexture?T.mipmaps[ge]:T.image;if(V!==null)Ae=V.max.x-V.min.x,fe=V.max.y-V.min.y,Se=V.isBox3?V.max.z-V.min.z:1,Ie=V.min.x,Je=V.min.y,ut=V.isBox3?V.min.z:0;else{let gt=Math.pow(2,-H);Ae=Math.floor(At.width*gt),fe=Math.floor(At.height*gt),T.isDataArrayTexture?Se=At.depth:T.isData3DTexture?Se=Math.floor(At.depth*gt):Se=1,Ie=0,Je=0,ut=0}B!==null?(Re=B.x,dt=B.y,qt=B.z):(Re=0,dt=0,qt=0);let wt=oe.convert(U.format),un=oe.convert(U.type),Ce;U.isData3DTexture?(qe.setTexture3D(U,0),Ce=F.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(qe.setTexture2DArray(U,0),Ce=F.TEXTURE_2D_ARRAY):(qe.setTexture2D(U,0),Ce=F.TEXTURE_2D),pe.activeTexture(F.TEXTURE0),pe.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,U.flipY),pe.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),pe.pixelStorei(F.UNPACK_ALIGNMENT,U.unpackAlignment);let _n=pe.getParameter(F.UNPACK_ROW_LENGTH),vt=pe.getParameter(F.UNPACK_IMAGE_HEIGHT),ji=pe.getParameter(F.UNPACK_SKIP_PIXELS),dn=pe.getParameter(F.UNPACK_SKIP_ROWS),Ao=pe.getParameter(F.UNPACK_SKIP_IMAGES);pe.pixelStorei(F.UNPACK_ROW_LENGTH,At.width),pe.pixelStorei(F.UNPACK_IMAGE_HEIGHT,At.height),pe.pixelStorei(F.UNPACK_SKIP_PIXELS,Ie),pe.pixelStorei(F.UNPACK_SKIP_ROWS,Je),pe.pixelStorei(F.UNPACK_SKIP_IMAGES,ut);let Ni=T.isDataArrayTexture||T.isData3DTexture,Qi=U.isDataArrayTexture||U.isData3DTexture;if(T.isDepthTexture){let gt=Be.get(T),on=Be.get(U),Gn=Be.get(gt.__renderTarget),Nt=Be.get(on.__renderTarget);pe.bindFramebuffer(F.READ_FRAMEBUFFER,Gn.__webglFramebuffer),pe.bindFramebuffer(F.DRAW_FRAMEBUFFER,Nt.__webglFramebuffer);for(let nn=0;nn<Se;nn++)Ni&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Be.get(T).__webglTexture,H,ut+nn),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Be.get(U).__webglTexture,ge,qt+nn)),F.blitFramebuffer(Ie,Je,Ie+Ae,Je+fe,Re,dt,Re+Ae,dt+fe,F.DEPTH_BUFFER_BIT,F.NEAREST);pe.bindFramebuffer(F.READ_FRAMEBUFFER,null),pe.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(H!==0||T.isRenderTargetTexture||Be.has(T)){let gt=Be.get(T),on=Be.get(U);pe.bindFramebuffer(F.READ_FRAMEBUFFER,L),pe.bindFramebuffer(F.DRAW_FRAMEBUFFER,G);for(let Gn=0;Gn<Se;Gn++)Ni?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,gt.__webglTexture,H,ut+Gn):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,gt.__webglTexture,H),Qi?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,on.__webglTexture,ge,qt+Gn):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,on.__webglTexture,ge),H!==0?F.blitFramebuffer(Ie,Je,Ie+Ae,Je+fe,Re,dt,Re+Ae,dt+fe,F.COLOR_BUFFER_BIT,F.NEAREST):Qi?F.copyTexSubImage3D(Ce,ge,Re,dt,qt+Gn,Ie,Je,Ae,fe):F.copyTexSubImage2D(Ce,ge,Re,dt,Ie,Je,Ae,fe);pe.bindFramebuffer(F.READ_FRAMEBUFFER,null),pe.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else Qi?T.isDataTexture||T.isData3DTexture?F.texSubImage3D(Ce,ge,Re,dt,qt,Ae,fe,Se,wt,un,At.data):U.isCompressedArrayTexture?F.compressedTexSubImage3D(Ce,ge,Re,dt,qt,Ae,fe,Se,wt,At.data):F.texSubImage3D(Ce,ge,Re,dt,qt,Ae,fe,Se,wt,un,At):T.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,ge,Re,dt,Ae,fe,wt,un,At.data):T.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,ge,Re,dt,At.width,At.height,wt,At.data):F.texSubImage2D(F.TEXTURE_2D,ge,Re,dt,Ae,fe,wt,un,At);pe.pixelStorei(F.UNPACK_ROW_LENGTH,_n),pe.pixelStorei(F.UNPACK_IMAGE_HEIGHT,vt),pe.pixelStorei(F.UNPACK_SKIP_PIXELS,ji),pe.pixelStorei(F.UNPACK_SKIP_ROWS,dn),pe.pixelStorei(F.UNPACK_SKIP_IMAGES,Ao),ge===0&&U.generateMipmaps===!0&&U.mipmapsAutoUpdate===!0&&F.generateMipmap(Ce),pe.unbindTexture()},this.initRenderTarget=function(T){Be.get(T).__webglFramebuffer===void 0&&qe.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?qe.setTextureCube(T,0):T.isData3DTexture?qe.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?qe.setTexture2DArray(T,0):qe.setTexture2D(T,0),pe.unbindTexture()},this.resetState=function(){X=0,k=0,ne=null,pe.reset(),ce.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return On}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=ft._getDrawingBufferColorSpace(e),t.unpackColorSpace=ft._getUnpackColorSpace()}};var vo=class i extends ie{constructor(){let e=i.SkyShader,t=new kt({name:e.name,uniforms:ps.clone(e.uniforms),vertexShader:e.vertexShader,fragmentShader:e.fragmentShader,side:cn,depthWrite:!1});super(new Xe(1,1,1),t),this.isSky=!0}};vo.SkyShader={name:"SkyShader",uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new C},cloudScale:{value:2e-4},cloudSpeed:{value:2e-5},cloudCoverage:{value:.4},cloudDensity:{value:.4},cloudElevation:{value:.5},showSunDisc:{value:1},time:{value:0}},vertexShader:`
		uniform vec3 sunPosition;
		uniform float rayleigh;
		uniform float turbidity;
		uniform float mieCoefficient;

		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		// constants for atmospheric scattering
		const float e = 2.71828182845904523536028747135266249775724709369995957;
		const float pi = 3.141592653589793238462643383279502884197169;

		// wavelength of used primaries, according to preetham
		const vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );
		// this pre-calculation replaces older TotalRayleigh(vec3 lambda) function:
		// (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn))
		const vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );

		// mie stuff
		// K coefficient for the primaries
		const float v = 4.0;
		const vec3 K = vec3( 0.686, 0.678, 0.666 );
		// MieConst = pi * pow( ( 2.0 * pi ) / lambda, vec3( v - 2.0 ) ) * K
		const vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );

		// earth shadow hack
		// cutoffAngle = pi / 1.95;
		const float cutoffAngle = 1.6110731556870734;
		const float steepness = 1.5;
		const float EE = 1000.0;

		float sunIntensity( float zenithAngleCos ) {
			zenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );
			return EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );
		}

		vec3 totalMie( float T ) {
			float c = ( 0.2 * T ) * 10E-18;
			return 0.434 * c * MieConst;
		}

		void main() {

			vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
			vWorldPosition = worldPosition.xyz;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			gl_Position.z = gl_Position.w; // set z to camera.far

			vSunDirection = normalize( sunPosition );

			vSunE = sunIntensity( vSunDirection.y );

			vSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );

			float rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );

			// extinction (absorption + out scattering)
			// rayleigh coefficients
			vBetaR = totalRayleigh * rayleighCoefficient;

			// mie coefficients
			vBetaM = totalMie( turbidity ) * mieCoefficient;

		}`,fragmentShader:`
		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		uniform float mieDirectionalG;
		uniform float cloudScale;
		uniform float cloudSpeed;
		uniform float cloudCoverage;
		uniform float cloudDensity;
		uniform float cloudElevation;
		uniform float showSunDisc;
		uniform float time;

		// gradient at a lattice corner; sinless hash so every GPU produces the same clouds
		vec2 gradient( vec2 i ) {
			vec3 p = fract( i.xyx * vec3( 0.1031, 0.1030, 0.0973 ) );
			p += dot( p, p.yzx + 33.33 );
			return fract( ( p.xx + p.yz ) * p.zy ) * 2.0 - 1.0;
		}

		// 2D gradient noise: isotropic lobes like Perlin at value-noise cost
		float noise( vec2 p ) {
			vec2 i = floor( p );
			vec2 f = fract( p );
			vec2 u = f * f * f * ( f * ( f * 6.0 - 15.0 ) + 10.0 ); // quintic fade
			float a = dot( gradient( i ), f );
			float b = dot( gradient( i + vec2( 1.0, 0.0 ) ), f - vec2( 1.0, 0.0 ) );
			float c = dot( gradient( i + vec2( 0.0, 1.0 ) ), f - vec2( 0.0, 1.0 ) );
			float d = dot( gradient( i + vec2( 1.0, 1.0 ) ), f - vec2( 1.0, 1.0 ) );
			return mix( mix( a, b, u.x ), mix( c, d, u.x ), u.y ) * 1.6; // ~[-1,1]
		}

		// fbm; per-octave drift makes clouds billow instead of scrolling as a rigid stamp
		float fbm( vec2 p, float drift ) {
			float result = 0.0;
			float amplitude = 1.0;
			for ( int i = 0; i < 4; i ++ ) {
				result += amplitude * noise( p );
				amplitude *= 0.5;
				p = p * 2.0 + drift;
			}
			return result;
		}

		// constants for atmospheric scattering
		const float pi = 3.141592653589793238462643383279502884197169;

		const float n = 1.0003; // refractive index of air
		const float N = 2.545E25; // number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)

		// optical length at zenith for molecules
		const float rayleighZenithLength = 8.4E3;
		const float mieZenithLength = 1.25E3;
		// 66 arc seconds -> degrees, and the cosine of that
		const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;

		// 3.0 / ( 16.0 * pi )
		const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
		// 1.0 / ( 4.0 * pi )
		const float ONE_OVER_FOURPI = 0.07957747154594767;

		float rayleighPhase( float cosTheta ) {
			return THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );
		}

		float hgPhase( float cosTheta, float g ) {
			float g2 = pow( g, 2.0 );
			float inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );
			return ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );
		}

		void main() {

			vec3 direction = normalize( vWorldPosition - cameraPosition );

			// optical length
			// cutoff angle at 90 to avoid singularity in next formula.
			float zenithAngle = acos( max( 0.0, direction.y ) );
			float inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );
			float sR = rayleighZenithLength * inverse;
			float sM = mieZenithLength * inverse;

			// combined extinction factor
			vec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );

			// in scattering
			float cosTheta = dot( direction, vSunDirection );

			float rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );
			vec3 betaRTheta = vBetaR * rPhase;

			float mPhase = hgPhase( cosTheta, mieDirectionalG );
			vec3 betaMTheta = vBetaM * mPhase;

			vec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );
			Lin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - vSunDirection.y, 5.0 ), 0.0, 1.0 ) );

			// nightsky
			float theta = acos( direction.y ); // elevation --> y-axis, [-pi/2, pi/2]
			float phi = atan( direction.z, direction.x ); // azimuth --> x-axis [-pi/2, pi/2]
			vec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );
			vec3 L0 = vec3( 0.1 ) * Fex;

			// composition + solar disc
			float sundisc = clamp( ( cosTheta - sunAngularDiameterCos ) * 50000.0, 0.0, 1.0 ) * showSunDisc;
			vec3 sundiscColor = ( 760.0 * sundisc ) * min( vSunE * Fex, 80.0 );

			vec3 texColor = ( Lin + L0 ) * 0.04 + sundiscColor + vec3( 0.0, 0.0003, 0.00075 );

			// Clouds
			if ( direction.y > 0.0 && cloudCoverage > 0.0 ) {

				// Project to cloud plane (higher elevation = clouds appear lower/closer)
				float elevation = mix( 1.0, 0.1, cloudElevation );
				vec2 cloudUV = direction.xz / ( direction.y * elevation );
				cloudUV *= cloudScale;
				cloudUV += time * cloudSpeed;

				// Cloud density field
				float evolve = time * cloudSpeed * 300.0;
				float cloudNoise = clamp( fbm( cloudUV * 1000.0, evolve ) * 0.7 + 0.5, 0.0, 1.0 );

				// Large-scale coverage variation: clear gaps next to dense banks
				float region = noise( cloudUV * 300.0 ) * 0.37 + 0.5;
				float cov = clamp( cloudCoverage + ( region - 0.5 ) * 0.6, 0.0, 1.0 );

				// Carve clouds where noise rises above the coverage level
				float threshold = 1.0 - cov;
				float cloudMask = smoothstep( threshold, threshold + 0.3, cloudNoise );

				// Fade clouds near horizon (adjusted by elevation)
				float horizonFade = smoothstep( 0.0, 0.03 + 0.06 * cloudElevation, direction.y );
				cloudMask *= horizonFade;

				// Cloud lighting from the sky's own radiance
				float dayFactor = smoothstep( -0.08, 0.3, vSunDirection.y );
				vec3 sunColor = vSunE * Fex * 0.22 * 0.04; // 0.22 ~ albedo/pi, 0.04 = exposure; the aerial composite adds the eye-leg extinction
				vec3 skyAmbient = Lin * 0.04 + vec3( 0.0, 0.0003, 0.00075 );

				// Beer-powder self-shadow from the sampled density
				float depth = max( 0.0, cloudNoise - threshold );
				float beer = exp( depth * -4.0 );
				float powder = 1.0 - beer * beer; // beer*beer == exp(-8*depth)
				float shade = mix( 0.45, 1.0, clamp( beer * powder * 2.6, 0.0, 1.0 ) ); // 2.6 = 1/0.385, normalizes beer*powder peak to 1

				// Henyey-Greenstein forward lobe ( g = 0.7 ): silver lining on rims toward the sun
				float silver = clamp( 0.51 / pow( 1.49 - cosTheta * 1.4, 1.5 ), 0.0, 3.0 ); // 0.51=1-g^2, 1.49=1+g^2, 1.4=2g
				float edge = cloudMask * ( 1.0 - cloudMask ) * 4.0;

				vec3 cloudColor = skyAmbient + sunColor * shade;
				cloudColor += sunColor * silver * edge * 0.6;
				cloudColor *= max( dayFactor, 0.03 );

				// Cloud opacity via Beer's law: density sets how solid the clouds get
				float alpha = ( 1.0 - exp( depth * cloudDensity * -12.0 ) ) * horizonFade;

				// Occlude the sun disc/glow behind opaque cloud
				texColor -= L0 * 0.04 * alpha;

				// Composite through the atmosphere so distant clouds dissolve into haze
				vec3 cloudAerial = mix( texColor, cloudColor, Fex );
				texColor = mix( texColor, cloudAerial, alpha );

			}

			gl_FragColor = vec4( texColor, 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};var Fl=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},rv=new Ti(-1,1,1,-1,0,1),Lh=class extends xt{constructor(){super(),this.setAttribute("position",new ze([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ze([0,2,0,0,2,0],2))}},ov=new Lh,Ol=class{constructor(e){this._mesh=new ie(ov,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,rv)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};var Bl={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};var mf={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Pe(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};var or=class i extends Fl{constructor(e,t=1,n,s){super(),this.strength=t,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new ee(e.x,e.y):new ee(256,256),this.clearColor=new Pe(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new Gt(r,o,{type:hn,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){let u=new Gt(r,o,{type:hn,depthBuffer:!1});u.texture.name="UnrealBloomPass.h"+h,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);let d=new Gt(r,o,{type:hn,depthBuffer:!1});d.texture.name="UnrealBloomPass.v"+h,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),r=Math.round(r/2),o=Math.round(o/2)}let a=mf;this.highPassUniforms=ps.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new kt({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];let l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new ee(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new C(1,1,1),new C(1,1,1),new C(1,1,1),new C(1,1,1),new C(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=ps.clone(Bl.uniforms),this.blendMaterial=new kt({uniforms:this.copyUniforms,vertexShader:Bl.vertexShader,fragmentShader:Bl.fragmentShader,premultipliedAlpha:!0,blending:ai,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Pe,this._oldClearAlpha=1,this._basic=new Zn,this._fsQuad=new Ol(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new ee(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();let o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),a=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let o=0;o<e;o++)t.push(.39894*Math.exp(-.5*o*o/(n*n))/n);let s=[],r=[];for(let o=1;o<e;o+=2){let a=t[o],l=o+1<e?t[o+1]:0,c=a+l;s.push((o*a+(o+1)*l)/c),r.push(c)}return new kt({defines:{KERNEL_PAIRS:s.length},uniforms:{colorTexture:{value:null},invSize:{value:new ee(.5,.5)},direction:{value:new ee(.5,.5)},centerWeight:{value:t[0]},gaussianOffsets:{value:s},gaussianWeights:{value:r}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new kt({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};or.BlurDirectionX=new ee(1,0);or.BlurDirectionY=new ee(0,1);function Nn(i){let e=i>>>0;return function(){e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}var Sn=(i,e=0,t=1)=>Math.min(t,Math.max(e,i)),pt=(i,e,t)=>i+(e-i)*t,st=(i,e,t)=>{let n=Sn((t-i)/(e-i));return n*n*(3-2*n)},gf=i=>i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2,Dh=i=>1-Math.pow(1-i,3);var yo=i=>-(Math.cos(Math.PI*i)-1)/2;function zl(i,e){let t=i*374761393+e*668265263;return t=(t^t>>>13)*1274126177,((t^t>>>16)>>>0)/4294967295}function av(i,e){let t=Math.floor(i),n=Math.floor(e),s=i-t,r=e-n,o=s*s*(3-2*s),a=r*r*(3-2*r),l=zl(t,n),c=zl(t+1,n),h=zl(t,n+1),u=zl(t+1,n+1);return l+(c-l)*o+(h-l)*a+(l-c-h+u)*o*a}function Nh(i,e,t=4){let n=0,s=.5,r=1;for(let o=0;o<t;o++)n+=s*av(i*r,e*r),r*=2.03,s*=.5;return n}function xf(i,e){if(e<=i[0][0])return i[0][1];for(let t=0;t<i.length-1;t++){let[n,s]=i[t],[r,o]=i[t+1];if(e<=r)return pt(s,o,(e-n)/(r-n))}return i[i.length-1][1]}var lv=`
  {
    float up = max(direction.y, 0.0);
    vec3 nightCol = mix(vec3(0.010, 0.022, 0.060), vec3(0.0015, 0.004, 0.014), pow(up, 0.55));
    nightCol += vec3(0.11, 0.06, 0.025) * cityGlow * pow(1.0 - up, 14.0);
    vec2 sp = floor(direction.xz / (direction.y + 0.35) * 420.0);
    float h = fract(sin(dot(sp, vec2(12.9898, 78.233))) * 43758.5453);
    float star = step(0.9982, h) * smoothstep(0.04, 0.35, direction.y) * (0.4 + 0.6 * fract(h * 91.7));
    nightCol += vec3(star) * 0.55;
    texColor = mix(texColor, nightCol, nightMix);
  }
  vec3 skyC = texColor * skyGain;
  float pk = max(max(skyC.r, skyC.g), skyC.b);
  skyC *= (1.0 + pk / 9.0) / (1.0 + pk / 1.4);
  gl_FragColor = vec4( skyC, 1.0 );`;function _f(){let i=new vo,e=i.material;return e.uniforms.nightMix={value:0},e.uniforms.cityGlow={value:0},e.uniforms.skyGain={value:1},e.fragmentShader=e.fragmentShader.replace("uniform float time;",`uniform float time;
uniform float nightMix;
uniform float cityGlow;
uniform float skyGain;`).replace("gl_FragColor = vec4( texColor, 1.0 );",lv),i.scale.setScalar(45e3),i.frustumCulled=!1,i}var cv=`
precision highp float;
uniform sampler2D tA; uniform sampler2D tB; uniform float mixB;
uniform float exposure, contrast, saturation, temp, sepia, vignette, grain, time, fade, chroma, lift;
uniform vec3 shadowTint, highTint; uniform vec2 res;
varying vec2 vUv;
vec3 aces(vec3 x){ const float a=2.51,b=0.03,c=2.43,d=0.59,e=0.14; return clamp((x*(a*x+b))/(x*(c*x+d)+e),0.0,1.0);}
float hash(vec2 p){ p = fract(p*vec2(443.897,441.423)); p += dot(p, p.yx+19.19); return fract((p.x+p.y)*p.x); }
vec3 sampleCA(sampler2D t, vec2 uv, vec2 dc, float ca){
  return vec3(texture2D(t, uv - dc*ca).r, texture2D(t, uv).g, texture2D(t, uv + dc*ca).b);
}
void main(){
  vec2 uv = vUv; vec2 dc = uv - 0.5;
  float ca = chroma * dot(dc, dc);
  vec3 col = sampleCA(tA, uv, dc, ca);
  if (mixB > 0.0) col = mix(col, sampleCA(tB, uv, dc, ca), mixB);
  col *= exposure;
  col *= vec3(1.0 + temp*0.12, 1.0 + temp*0.02, 1.0 - temp*0.12);
  col = aces(col);
  col = pow(col, vec3(1.0/2.2));
  float l = dot(col, vec3(0.2126,0.7152,0.0722));
  col = mix(vec3(l), col, saturation);
  col = (col - 0.5) * contrast + 0.5 + lift;
  l = dot(col, vec3(0.2126,0.7152,0.0722));
  col += shadowTint * (1.0 - smoothstep(0.0, 0.55, l)) * 0.10 + highTint * smoothstep(0.45, 1.0, l) * 0.10;
  vec3 sep = vec3(dot(col, vec3(.393,.769,.189)), dot(col, vec3(.349,.686,.168)), dot(col, vec3(.272,.534,.131)));
  col = mix(col, sep * vec3(1.0, 0.97, 0.9), sepia);
  float vg = smoothstep(1.05, 0.25, length(dc * vec2(1.0, 0.78)));
  col *= mix(1.0, vg, vignette);
  float g = hash(uv * res + fract(time * 7.13) * 100.0) - 0.5;
  col += g * grain * (0.6 + 0.4 * (1.0 - l));
  col *= (1.0 - fade);
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`,Uh=.36,Mo={exposure:.62,contrast:1.06,saturation:1.05,temp:0,sepia:0,vignette:.55,grain:.035,fade:0,chroma:.006,lift:0,shadowTint:[0,.15,.3],highTint:[.35,.22,0],bloom:.55,bloomRadius:.55,bloomThreshold:2.4},Fh={sunElev:25,sunAzim:200,turbidity:4,rayleigh:1.4,mie:.006,mieG:.82,sunIntensity:3.2,sunColor:[1,.93,.82],hemiIntensity:.55,hemiSky:[.62,.74,1],hemiGround:[.42,.36,.28],envIntensity:.9,fogColor:[.62,.72,.86],fogDensity:12e-5,night:0,cityGlow:0,clouds:.35,cloudDensity:.45,skyGain:1,cloudTime:0,shadowCenter:[0,1200],shadowSize:1500},Hl=class{constructor(e,t,n){this.W=t,this.H=n;let s=this.renderer=new Dl({canvas:e,antialias:!1,preserveDrawingBuffer:!0,powerPreference:"high-performance"});s.setPixelRatio(1),s.setSize(t,n,!1),s.toneMapping=Bn,s.outputColorSpace=rs,s.shadowMap.enabled=!0,s.shadowMap.type=ka,this.scene=new os,this.sky=_f(),this.scene.add(this.sky),this.sun=new ro(16777215,3),this.sun.castShadow=!0,this.sun.shadow.mapSize.set(2048,2048),this.sun.shadow.bias=-4e-4,this.sun.shadow.normalBias=.6,this.scene.add(this.sun,this.sun.target),this.hemi=new to(12375295,5588019,.5),this.scene.add(this.hemi),this.scene.fog=new Lr(10466252,12e-5),this.envScene=new os,this.envSky=_f(),this.envSky.material.uniforms=this.sky.material.uniforms,this.envScene.add(this.envSky),this.pmrem=new sr(s),this.envCache=new Map;let r={type:hn,samples:4,depthBuffer:!0};this.rtA=new Gt(t,n,r),this.rtB=new Gt(t,n,r),this.bloom=new or(new ee(t/2,n/2),.5,.5,.9),this.gradeMat=new kt({uniforms:{tA:{value:this.rtA.texture},tB:{value:this.rtB.texture},mixB:{value:0},exposure:{value:1},contrast:{value:1},saturation:{value:1},temp:{value:0},sepia:{value:0},vignette:{value:.5},grain:{value:.03},time:{value:0},fade:{value:0},chroma:{value:.005},lift:{value:0},shadowTint:{value:new C},highTint:{value:new C},res:{value:new ee(t,n)}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:cv,depthTest:!1,depthWrite:!1}),this.quad=new ie(new ln(2,2),this.gradeMat),this.quad.frustumCulled=!1,this.postScene=new os,this.postScene.add(this.quad),this.postCam=new Ti(-1,1,1,-1,0,1),this.camera=new an(40,t/n,2,6e4),this.fogRT=new Gt(8,4,{type:Tn}),this.fogCam=new an(40,2,1,1e5),this.fogBuf=new Float32Array(128),this.components=[],this.lookListeners=[]}add(e){return this.components.push(e),e.object&&this.scene.add(e.object),e}sunDir(e){let t=Ci.degToRad(e.sunElev),n=Ci.degToRad(e.sunAzim);return new C(Math.sin(n)*Math.cos(t),Math.sin(t),-Math.cos(n)*Math.cos(t))}applyLook(e){let t={...Fh,...e},n=this.sky.material.uniforms,s=this.sunDir(t);n.sunPosition.value.copy(s),n.turbidity.value=t.turbidity,n.rayleigh.value=t.rayleigh,n.mieCoefficient.value=t.mie,n.mieDirectionalG.value=t.mieG,n.cloudCoverage.value=t.clouds,n.cloudDensity.value=t.cloudDensity,n.time.value=t.cloudTime,n.nightMix.value=t.night,n.cityGlow.value=t.cityGlow,n.skyGain.value=t.skyGain,n.cloudScale&&(n.cloudScale.value=25e-5);let r=[Math.round(t.sunElev*2),Math.round(t.sunAzim/3),Math.round(t.turbidity),Math.round(t.night*20),Math.round(t.clouds*10),Math.round(t.skyGain*10)].join(":"),o=this.envCache.get(r);if(!o){n.showSunDisc.value=0;let d=n.time.value;n.time.value=0,o=this.pmrem.fromScene(this.envScene,0,1,1e5).texture,n.time.value=d,n.showSunDisc.value=1,this.envCache.set(r,o)}this.scene.environment=o,this.scene.environmentIntensity=t.envIntensity*Uh;let[a,l]=t.shadowCenter;this.sun.target.position.set(a,0,l),this.sun.position.set(a+s.x*6e3,Math.max(s.y,.03)*6e3,l+s.z*6e3);let c=t.shadowSize,h=this.sun.shadow.camera;h.left=-c,h.right=c,h.top=c,h.bottom=-c,h.near=10,h.far=14e3,h.updateProjectionMatrix();let u=Ci.smoothstep(t.sunElev,-4,3);this.sun.intensity=t.sunIntensity*u*Uh,this.sun.color.setRGB(...t.sunColor),this.hemi.intensity=t.hemiIntensity*Uh,this.hemi.color.setRGB(...t.hemiSky),this.hemi.groundColor.setRGB(...t.hemiGround),this.scene.fog.color.setRGB(...t.fogColor),this.scene.fog.density=t.fogDensity,this.look=t;for(let d of this.components)d.onLook&&d.onLook(t,s)}renderShot(e,t){this.applyLook(e.look);let n=this.camera;n.fov=e.fov||40,n.near=e.near||2,n.far=6e4,n.position.copy(e.pos),e.up?n.up.copy(e.up):n.up.set(0,1,0),n.lookAt(e.target),e.roll&&n.rotateZ(e.roll),n.updateProjectionMatrix();for(let s of this.components)s.beforeRender&&s.beforeRender(n,e);if(this.sky.position.copy(n.position),!e.look.fixedFog){let s=new C;n.getWorldDirection(s),s.y=0,s.normalize(),this.fogCam.position.set(0,0,0),this.fogCam.lookAt(s.x,Math.tan(Ci.degToRad(3)),s.z),this.envSky.position.set(0,0,0),this.renderer.setRenderTarget(this.fogRT),this.renderer.render(this.envScene,this.fogCam),this.renderer.readRenderTargetPixels(this.fogRT,0,0,8,4,this.fogBuf);let r=0,o=0,a=0;for(let c=0;c<32;c++)r+=this.fogBuf[c*4],o+=this.fogBuf[c*4+1],a+=this.fogBuf[c*4+2];let l=(this.look.fogMul??.75)/32;this.scene.fog.color.setRGB(r*l,o*l,a*l)}this.renderer.setRenderTarget(t),this.renderer.clear(),this.renderer.render(this.scene,n)}render(e){let[t,n]=e.shots,s=n?e.mix:0;this.renderShot(t,this.rtA),n&&s>.001&&this.renderShot(n,this.rtB);let r={...Mo,...e.grade,...window.__gradeOverride||{}};window.__expScale&&(r.exposure*=window.__expScale),this.bloom.strength=r.bloom,this.bloom.radius=r.bloomRadius,this.bloom.threshold=r.bloomThreshold,r.bloom>0&&(this.bloom.render(this.renderer,null,this.rtA),n&&s>.001&&this.bloom.render(this.renderer,null,this.rtB));let o=this.gradeMat.uniforms;o.mixB.value=n&&s>.001?s:0;for(let a of["exposure","contrast","saturation","temp","sepia","vignette","grain","fade","chroma","lift"])o[a].value=r[a];o.shadowTint.value.set(...r.shadowTint),o.highTint.value.set(...r.highTint),o.time.value=e.t,this.renderer.setRenderTarget(null),this.renderer.render(this.postScene,this.postCam)}};function vf(i,e,t){let n={...Mo,...i},s={...Mo,...e},r={};for(let o of Object.keys(n))r[o]=Array.isArray(n[o])?n[o].map((a,l)=>pt(a,s[o][l],t)):pt(n[o],s[o],t);return r}var Un={uNight:{value:0},uTime:{value:0},uMap:{value:0},uSepia:{value:0}},yf=`
varying vec3 vWPos; varying vec3 vWNorm; varying vec4 vFac;
uniform float uNight; uniform float uMap; uniform float uTime;
float hfh(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
`;function ms(i={}){let e=new Ee({color:16777215,roughness:.7,metalness:0,...i});return e.onBeforeCompile=t=>{t.uniforms.uNight=Un.uNight,t.uniforms.uMap=Un.uMap,t.uniforms.uTime=Un.uTime,t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
attribute vec4 aFac;
`+yf).replace("#include <worldpos_vertex>",`#include <worldpos_vertex>
        vec4 hfW = vec4(transformed, 1.0);
        vec3 hfN = objectNormal;
        #ifdef USE_INSTANCING
          hfW = instanceMatrix * hfW;
          hfN = mat3(instanceMatrix) * hfN;
        #endif
        vWPos = (modelMatrix * hfW).xyz;
        vWNorm = normalize(mat3(modelMatrix) * hfN);
        vFac = aFac;`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
`+yf).replace("#include <color_fragment>",`#include <color_fragment>
        float st = vFac.x; float seed = vFac.y;
        vec3 nW = normalize(vWNorm);
        float wall = 1.0 - step(0.55, abs(nW.y));
        vec3 tg = normalize(vec3(-nW.z, 0.0, nW.x) + 1e-5);
        float fu = dot(vWPos.xz, tg.xz);
        float fv = vWPos.y;
        float floorH = 3.2, bayW = 2.8, winW = 0.6, winH = 0.55, glassAll = 0.0;
        vec3 glassCol = vec3(0.045, 0.06, 0.075);
        if (st < 0.5) { floorH = 3.9; bayW = 1.55; winW = 0.92; winH = 0.80; glassAll = 1.0; glassCol = diffuseColor.rgb * 0.55; }
        else if (st < 1.5) { floorH = 3.0; bayW = 3.1; winW = 0.52; winH = 0.56; }
        else if (st < 2.5) { floorH = 2.8; bayW = 3.3; winW = 0.42; winH = 0.46; glassCol = vec3(0.07,0.075,0.08); }
        else if (st < 3.5) { floorH = 4.0; bayW = 1.5; winW = 0.5; winH = 0.78; }
        else if (st < 4.5) { floorH = 3.0; bayW = 4.2; winW = 0.22; winH = 0.36; glassCol = vec3(0.03,0.025,0.02); }
        else if (st < 5.5) { floorH = 5.0; bayW = 4.0; winW = 0.34; winH = 0.6; glassCol = vec3(0.06,0.07,0.09); }
        else { floorH = 3.9; bayW = 1.6; winW = 0.9; winH = 0.8; glassAll = 1.0; glassCol = vec3(0.55, 0.36, 0.1); }
        vec2 fc = vec2(fu / bayW + seed * 7.0, fv / floorH);
        vec2 fid = floor(fc); vec2 ff = fract(fc);
        vec2 fw = max(fwidth(fc), vec2(1e-4));
        float mx = smoothstep(0.5 - winW*0.5 - fw.x, 0.5 - winW*0.5 + fw.x, ff.x) * (1.0 - smoothstep(0.5 + winW*0.5 - fw.x, 0.5 + winW*0.5 + fw.x, ff.x));
        float my = smoothstep(0.5 - winH*0.5 - fw.y, 0.5 - winH*0.5 + fw.y, ff.y) * (1.0 - smoothstep(0.5 + winH*0.5 - fw.y, 0.5 + winH*0.5 + fw.y, ff.y));
        float detail = 1.0 - smoothstep(0.3, 0.85, max(fw.x, fw.y));
        float win = mix(winW * winH, mx * my, detail) * wall;
        float rnd = hfh(fid + seed * 13.1);
        float rnd2 = hfh(fid.yx * 1.7 + seed * 3.3);
        float hfLit = step(rnd, vFac.z * 0.55) * win;
        float baseAO = mix(0.55, 1.0, smoothstep(0.0, 14.0, fv));
        vec3 wallCol = diffuseColor.rgb * baseAO * (0.92 + 0.16 * rnd2 * (1.0 - glassAll));
        vec3 roofCol = vec3(0.23, 0.235, 0.24) * (0.8 + 0.4 * hfh(floor(vWPos.xz / 9.0)));
        // glass varies per pane (reflection breakup)
        vec3 paneCol = glassCol * (0.75 + 0.5 * rnd2);
        vec3 facade = mix(wallCol, paneCol, win);
        if (glassAll > 0.5) {
          float slab = (1.0 - smoothstep(0.0, 0.10 + fw.y, ff.y)) * detail;
          facade = mix(paneCol, diffuseColor.rgb * 0.35, slab * wall);
          win = wall * (1.0 - slab);
        }
        diffuseColor.rgb = mix(roofCol, facade, wall);
        // stylised map mode: clean white-blue blocks
        diffuseColor.rgb = mix(diffuseColor.rgb, mix(vec3(0.32, 0.4, 0.55), vec3(0.6,0.68,0.8), smoothstep(0.0, 120.0, fv)), uMap);
      `).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
        roughnessFactor = mix(mix(0.82, 0.55, glassAll), 0.13 + 0.1 * rnd2, win);
        roughnessFactor = mix(roughnessFactor, 0.5, uMap);`).replace("#include <metalnessmap_fragment>",`#include <metalnessmap_fragment>
        metalnessFactor = mix(mix(0.0, 0.5, glassAll), 0.85, win) * (1.0 - uMap);`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        {
          vec3 warm = mix(vec3(1.0, 0.62, 0.30), vec3(0.85, 0.9, 1.0), step(0.82, rnd2));
          float band = glassAll * step(0.72, hfh(vec2(fid.y, seed)));
          float lit = max(hfLit, band * win * 0.7);
          totalEmissiveRadiance += warm * lit * uNight * (0.35 + 0.6 * rnd2) * (1.0 - uMap);
          // street-level shop glow
          totalEmissiveRadiance += vec3(1.0, 0.7, 0.4) * wall * (1.0 - smoothstep(3.0, 5.5, fv)) * uNight * 0.15 * (1.0 - uMap);
          totalEmissiveRadiance += vec3(0.25, 0.55, 1.0) * uMap * 0.05 * smoothstep(0.0, 200.0, fv);
        }`)},e.customProgramCacheKey=()=>"facade-v1",e}function Mf(i,e){let t={tCity:{value:i},uBounds:{value:new Rt(e.x0,e.z0,e.x1-e.x0,e.z1-e.z0)},uModern:{value:0},uSoviet:{value:0},uDirt:{value:1},uNight:Un.uNight,uMap:Un.uMap,uTime:Un.uTime,uSnow:{value:0}},n=new Ee({color:16777215,roughness:.95,metalness:0});return n.userData.uni=t,n.onBeforeCompile=s=>{Object.assign(s.uniforms,t),s.vertexShader=s.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vGW;`).replace("#include <worldpos_vertex>",`#include <worldpos_vertex>
vGW = (modelMatrix * vec4(transformed, 1.0)).xyz;`),s.fragmentShader=s.fragmentShader.replace("#include <common>",`#include <common>
        varying vec3 vGW; uniform sampler2D tCity; uniform vec4 uBounds;
        uniform float uModern, uSoviet, uDirt, uNight, uMap, uTime, uSnow;
        float gh(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float gn(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
          return mix(mix(gh(i), gh(i+vec2(1,0)), u.x), mix(gh(i+vec2(0,1)), gh(i+vec2(1,1)), u.x), u.y); }
        float gf(vec2 p){ return gn(p)*0.5 + gn(p*2.03)*0.25 + gn(p*4.1)*0.125 + gn(p*8.3)*0.0625; }
        float hfRoad = 0.0; float hfPark = 0.0;`).replace("#include <color_fragment>",`#include <color_fragment>
        {
          vec2 p = vGW.xz;
          float n1 = gf(p * 0.0012), n2 = gf(p * 0.011), n3 = gn(p * 0.09);
          // late-summer steppe: straw gold with sage patches
          vec3 straw = vec3(0.55, 0.50, 0.28), sage = vec3(0.33, 0.42, 0.20), dry = vec3(0.62, 0.57, 0.36);
          vec3 g = mix(straw, sage, smoothstep(0.35, 0.65, n1));
          g = mix(g, dry, smoothstep(0.55, 0.8, n2) * 0.6);
          g *= 0.86 + 0.28 * n3;
          vec2 uv = (p - uBounds.xy) / uBounds.zw;
          vec4 cm = vec4(0.0);
          if (uv.x > 0.0 && uv.x < 1.0 && uv.y > 0.0 && uv.y < 1.0) cm = texture2D(tCity, uv);
          float reveal = gn(p * 0.004) * 0.6 + gn(p * 0.02) * 0.4;
          float dirt = cm.a * uDirt;
          float sov = cm.g * smoothstep(reveal - 0.08, reveal + 0.08, uSoviet * 1.15 - 0.05);
          float mod_ = cm.r * smoothstep(reveal - 0.08, reveal + 0.08, uModern * 1.15 - 0.05);
          float park = cm.b * smoothstep(reveal - 0.08, reveal + 0.08, uModern * 1.15 - 0.05);
          g = mix(g, vec3(0.45, 0.38, 0.28) * (0.9 + 0.2 * n3), dirt * 0.85);
          vec3 urban = vec3(0.42, 0.40, 0.37) * (0.9 + 0.15 * n2);      // paved city ground
          float urbanMask = max(sov, mod_) ;
          g = mix(g, urban, smoothstep(0.0, 0.25, urbanMask) * 0.55);
          vec3 asphalt = vec3(0.13, 0.135, 0.14) * (0.9 + 0.2 * n3);
          float road = smoothstep(0.45, 0.75, max(sov, mod_));
          g = mix(g, asphalt, road);
          g = mix(g, vec3(0.20, 0.34, 0.12) * (0.85 + 0.3 * n2), park * 0.9);
          hfRoad = road; hfPark = park;
          // map mode: dark navy ground, glowing roads
          vec3 mapCol = mix(vec3(0.018, 0.035, 0.07), vec3(0.03, 0.06, 0.11), urbanMask);
          mapCol = mix(mapCol, vec3(0.06, 0.12, 0.2), road);
          g = mix(g, mapCol, uMap);
          diffuseColor.rgb = g;
        }`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        {
          // street lights read as warm sodium/LED lines at night
          float flick = 0.75 + 0.25 * gn(vGW.xz * 0.15);
          totalEmissiveRadiance += vec3(1.0, 0.62, 0.28) * hfRoad * uNight * 0.16 * flick * (1.0 - uMap);
          totalEmissiveRadiance += vec3(0.15, 0.55, 1.0) * hfRoad * uMap * 0.12;
        }`)},n.customProgramCacheKey=()=>"ground-v1",n}function hv(i=256){let e=new Uint8Array(i*i*4),t=(s,r)=>Nh(s/14,r/14,4)*.7+Nh(s/5+31,r/5,3)*.3;for(let s=0;s<i;s++)for(let r=0;r<i;r++){let o=t((r+1)%i,s)-t((r-1+i)%i,s),a=t(r,(s+1)%i)-t(r,(s-1+i)%i),l=new C(-o*6,-a*6,1).normalize(),c=(s*i+r)*4;e[c]=(l.x*.5+.5)*255,e[c+1]=(l.y*.5+.5)*255,e[c+2]=(l.z*.5+.5)*255,e[c+3]=255}let n=new Mi(e,i,i);return n.wrapS=n.wrapT=ei,n.generateMipmaps=!0,n.minFilter=Ln,n.magFilter=$t,n.needsUpdate=!0,n}function Sf(){let i=hv();i.repeat.set(1,1);let e=new Ee({color:663849,roughness:.04,metalness:0,normalMap:i,normalScale:new ee(.14,.14),envMapIntensity:1.3});return e.onBeforeCompile=t=>{t.uniforms.uTime=Un.uTime,t.uniforms.uMap=Un.uMap,t.uniforms.uNight=Un.uNight,t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vWW;`).replace("#include <worldpos_vertex>",`#include <worldpos_vertex>
vWW = (modelMatrix * vec4(transformed, 1.0)).xyz;`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vWW; uniform float uTime; uniform float uMap; uniform float uNight;`).replace("#include <normal_fragment_maps>",`
        vec3 mapN1 = texture2D(normalMap, vWW.xz / 38.0 + vec2(uTime * 0.012, uTime * 0.004)).xyz * 2.0 - 1.0;
        vec3 mapN2 = texture2D(normalMap, vWW.xz / 13.0 - vec2(uTime * 0.02, -uTime * 0.011)).xyz * 2.0 - 1.0;
        vec3 mapN = normalize(vec3((mapN1.xy + mapN2.xy) * normalScale, 1.0));
        normal = normalize(tbn * mapN);`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        totalEmissiveRadiance += vec3(0.1, 0.75, 1.0) * uMap * 0.35;
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.0), uMap);`)},e.customProgramCacheKey=()=>"water-v1",e}var uv=[[-11e3,700],[-8e3,600],[-6e3,500],[-4e3,250],[-2600,-60],[-1500,-330],[-500,-430],[400,-310],[1100,40],[1500,440],[1760,900],[1960,1350],[2300,1760],[2900,2060],[4e3,2260],[6e3,2400],[8500,2500],[11e3,2650]],gs=140,dv=new ri(uv.map(([i,e])=>new C(i,0,e)),!1,"centripetal"),Ii=dv.getSpacedPoints(1400).map(i=>[i.x,i.z]);function hi(i,e){let t=1e9;for(let n=0;n<Ii.length-1;n++){let[s,r]=Ii[n],[o,a]=Ii[n+1],l=o-s,c=a-r,h=Math.max(0,Math.min(1,((i-s)*l+(e-r)*c)/(l*l+c*c))),u=s+l*h-i,d=r+c*h-e,p=u*u+d*d;p<t&&(t=p)}return Math.sqrt(t)}function wn(i){for(let e=0;e<Ii.length-1;e++){let[t,n]=Ii[e],[s,r]=Ii[e+1];if(i>=t&&i<=s||i<=t&&i>=s)return n+(r-n)*((i-t)/(s-t||1))}return 0}var Dt=1200,bt={baiterek:[0,Dt],khanShatyr:[-1800,Dt],akOrda:[1640,Dt],goldTowers:[1080,Dt],nurAlem:[-900,2750],museum:[2480,1250],pyramid:[2520,620],mosque:[2850,180],abuDhabi:[720,-820],emerald:[260,-760],triumph:[-1150,250],fortress:[-640,-760],flag:[2280,1080],opera:[1150,620],viewpoint:[-2350,1240]},fv=[[...bt.baiterek,160],[...bt.khanShatyr,260],[...bt.akOrda,220],[...bt.goldTowers,150],[...bt.nurAlem,300],[...bt.museum,200],[...bt.pyramid,170],[...bt.mosque,160],[...bt.abuDhabi,130],[...bt.emerald,130],[...bt.triumph,110],[...bt.flag,120],[...bt.opera,260],[...bt.viewpoint,260]];function So(i,e,t=0){for(let[n,s,r]of fv)if((i-n)**2+(e-s)**2<(r+t)**2)return!0;return Math.abs(e-Dt)<95+t&&i>-1750&&i<1600||Math.abs(e-2060)<80+t&&i>-3300&&i<3500}var qi={x0:-5e3,x1:5600,z0:-5e3,z1:5e3};var Kn=4096,Ze=Nn(1997),Yi=i=>i[Math.floor(Ze()*i.length)],pv=[{name:"old",ox:-600,oz:-1500,a:-.14,sx:230,sz:190,test:(i,e)=>i>-3900&&i<1900&&e>-4300&&e<wn(i)-95,kind:"old"},{name:"left",ox:0,oz:Dt,a:0,sx:255,sz:230,test:(i,e)=>i>-3900&&i<2150&&e>wn(i)+95&&e<4300,kind:"left"},{name:"east",ox:2400,oz:900,a:.32,sx:240,sz:220,test:(i,e)=>i>1950&&i<5400&&e>-2400&&e<wn(i)-95,kind:"east"},{name:"southeast",ox:3200,oz:3e3,a:.08,sx:260,sz:240,test:(i,e)=>i>2150&&i<5400&&e>wn(i)+95&&e<4300,kind:"left"}],mv=[{x0:-350,x1:900,z0:1420,z1:2250},{x0:-1500,x1:-350,z0:2300,z1:3300},{x0:300,x1:1300,z0:-1300,z1:-500}],gv=(i,e)=>mv.some(t=>i>t.x0&&i<t.x1&&e>t.z0&&e<t.z1);function Gl(i,e,t){let n=Math.cos(i.a),s=Math.sin(i.a),r=e*i.sx,o=t*i.sz;return[i.ox+r*n-o*s,i.oz+r*s+o*n]}var xs={res:[15984335,15782580,15251866,16446438,14258031,13623510,12375014,15914383,15123401,14279353],sov:[14208957,13222062,14734524,13619919,15128248],glass:[5214143,4161448,6989775,5152678,8828118,3828374,10274524],stone:[15262163,14274493,13157046]};function xv(){let i={modern:[],soviet:[],dirt:[],park:[]},e=[],t=[];for(let r of pv)for(let a=-26;a<=26;a++)for(let l=-26;l<=26;l++){let[c,h]=Gl(r,a,l),[u,d]=Gl(r,a+1,l),[p,f]=Gl(r,a,l+1),_=a%4===0||l%3===0,m=_?34:18,g=r.kind==="old"?"soviet":"modern";for(let[w,b]of[[u,d],[p,f]]){let x=(c+w)/2,E=(h+b)/2;r.test(c,h)&&r.test(w,b)&&hi(x,E)>100&&(i[g].push([c,h,w,b,m]),_&&t.push([c,h,w,b]))}let[v,M]=Gl(r,a+.5,l+.5);if(!r.test(v,M)||hi(v,M)<170||So(v,M,40))continue;let y=Math.hypot(v-0,M-600);y>5600||_v(e,i,r,v,M,y)}i.park.push([-1700,Dt,1560,Dt,150]),i.modern.push([-1750,Dt-88,1600,Dt-88,26],[-1750,Dt+88,1600,Dt+88,26]),t.push([-1750,Dt-88,1600,Dt-88],[1600,Dt+88,-1750,Dt+88]);let[n,s]=bt.fortress;return i.dirt.push([n-2600,s-900,n-120,s-20,9],[n+120,s+30,n+2400,s-300,9],[n,s-120,n+300,s-2600,8],[n-60,s+120,n-200,s+420,7]),{roads:i,buildings:e,carLanes:t}}function _v(i,e,t,n,s,r){let o=-t.a,a=t.sx-70,l=t.sz-70,c=Ze(),h=st(3600,5200,r);if(t.kind==="old"){let f=2+Math.floor(Ze()*3);for(let _=0;_<f;_++){let m=Ze()<.5,g=55+Ze()*70,v=12+Ze()*3,M=Yi([5,5,5,9,9,4,12]),y=(_/Math.max(1,f-1)-.5)*(m?l-20:a-20),w=m?0:y,b=m?y:0,[x,E]=Eo(w,b,-o,n,s);if(hi(x,E)<150||So(x,E,20))continue;let P=Ze()<.18&&r<3500,A=P?2002+Ze()*22:1958+Ze()*30,I=P?(12+Math.floor(Ze()*14))*3:M*2.8+.8;i.push({boxes:[{x,z:E,w:m?g:v,d:m?v:g,y0:0,h:I,rot:o}],style:P?1:2,color:Yi(P?xs.res:xs.sov),year:A,lit:.45+Ze()*.3,kind:P?"modern":"soviet"})}Ze()<.25&&e.park.push([n-30,s,n+30,s,60]);return}let u=gv(n,s),p=(t.kind==="east"?2003:1999)+Sn((r-600)/3800)*19;if(u){let f=1+Math.floor(Ze()*3);for(let _=0;_<f;_++){let m=(Ze()-.5)*(a-50),g=(Ze()-.5)*(l-50),[v,M]=Eo(m,g,-o,n,s);if(So(v,M,30))continue;let y=90+Ze()*150,w=28+Ze()*18,b=28+Ze()*18,x=Ze()<.7?0:Ze()<.5?3:6,E=x===0?Yi(xs.glass):x===3?Yi(xs.stone):13214282,P=14+Ze()*8,A=[{x:v,z:M,w:w*1.8,d:b*1.6,y0:0,h:P,rot:o},{x:v,z:M,w,d:b,y0:P,h:y*.72-P,rot:o},{x:v,z:M,w:w*.82,d:b*.82,y0:y*.72,h:y*.2,rot:o},{x:v,z:M,w:w*.6,d:b*.6,y0:y*.92,h:y*.08,rot:o}];i.push({boxes:A,style:x,color:E,year:2005+Ze()*19,lit:.5,kind:"tower",top:Ze()<.4?{x:v,z:M,w:w*.6,h:18+Ze()*25,y,rot:o}:null})}return}if(h>.6&&Ze()<.6){for(let f=0;f<6;f++){let _=(Ze()-.5)*a,m=(Ze()-.5)*l,[g,v]=Eo(_,m,-o,n,s);hi(g,v)<160||i.push({boxes:[{x:g,z:v,w:10+Ze()*6,d:9+Ze()*5,y0:0,h:4+Ze()*4,rot:o}],style:1,color:Yi(xs.res),year:1975+Ze()*45,lit:.5,kind:"house"})}return}if(c<.55){let _=Math.round(9+Ze()*12*(1-h*.6))*3,m=15,g=Yi(xs.res),v=p+Ze()*5,M=[[0,-l/2+m/2,a,m],[0,l/2-m/2,a,m],[-a/2+m/2,0,m,l-2*m],[a/2-m/2,0,m,l-2*m]],y=[];M.forEach(([w,b,x,E],P)=>{if(Ze()<.15)return;let[A,I]=Eo(w,b,-o,n,s),N=_*(P===0||Ze()<.3?1+Ze()*.5:.75+Ze()*.25);y.push({x:A,z:I,w:x,d:E,y0:0,h:N,rot:o})}),y.length&&i.push({boxes:y,style:1,color:g,year:v,lit:.55+Ze()*.25,kind:"modern"}),e.park.push([n-20,s,n+20,s,45])}else{let f=2+Math.floor(Ze()*3),_=Yi(xs.res);for(let m=0;m<f;m++){let g=(m%2-.5)*a*.5+(Ze()-.5)*20,v=(Math.floor(m/2)-.5)*l*.5+(Ze()-.5)*20,[M,y]=Eo(g,v,-o,n,s);if(So(M,y,20)||hi(M,y)<160)continue;let w=Math.round(12+Ze()*16*(1-h)),b=24+Ze()*10,x=22+Ze()*10;i.push({boxes:[{x:M,z:y,w:b,d:x,y0:0,h:w*3,rot:o},{x:M,z:y,w:b*.7,d:x*.6,y0:w*3,h:4,rot:o}],style:1,color:_,year:p+Ze()*6,lit:.5+Ze()*.3,kind:"modern"})}}}function Eo(i,e,t,n,s){let r=Math.cos(t),o=Math.sin(t);return[n+i*r+e*o,s-i*o+e*r]}function vv(i){let e=document.createElement("canvas");e.width=e.height=Kn;let t=e.getContext("2d"),n=Kn/(qi.x1-qi.x0),s=Kn/(qi.z1-qi.z0),r=(c,h)=>[(c-qi.x0)*n,(h-qi.z0)*s],o=new Uint8Array(Kn*Kn*4),a=[["modern",0],["soviet",1],["park",2],["dirt",3]];for(let[c,h]of a){t.fillStyle="#000",t.fillRect(0,0,Kn,Kn),t.strokeStyle="#fff",t.lineCap=c==="park"?"round":"square";for(let[d,p,f,_,m]of i[c])t.lineWidth=Math.max(1.5,m*n),t.beginPath(),t.moveTo(...r(d,p)),t.lineTo(...r(f,_)),t.stroke();if(c==="modern"){t.globalAlpha=.35;for(let[d,p,f,_,m]of i.modern)t.lineWidth=Math.max(2,(m+120)*n),t.beginPath(),t.moveTo(...r(d,p)),t.lineTo(...r(f,_)),t.stroke();t.globalAlpha=1}if(c==="soviet"){t.globalAlpha=.35;for(let[d,p,f,_,m]of i.soviet)t.lineWidth=Math.max(2,(m+110)*n),t.beginPath(),t.moveTo(...r(d,p)),t.lineTo(...r(f,_)),t.stroke();t.globalAlpha=1;for(let[d,p,f,_,m]of i.soviet)t.lineWidth=Math.max(1.5,m*n),t.beginPath(),t.moveTo(...r(d,p)),t.lineTo(...r(f,_)),t.stroke()}if(c==="modern")for(let[d,p,f,_,m]of i.modern)t.lineWidth=Math.max(1.5,m*n),t.beginPath(),t.moveTo(...r(d,p)),t.lineTo(...r(f,_)),t.stroke();let u=t.getImageData(0,0,Kn,Kn).data;for(let d=0,p=h;d<u.length;d+=4,p+=4)o[p]=u[d]}let l=new Mi(o,Kn,Kn,Dn);return l.flipY=!1,l.generateMipmaps=!0,l.minFilter=Ln,l.magFilter=$t,l.anisotropy=8,l.needsUpdate=!0,l}var kl=class{constructor(){let{roads:e,buildings:t,carLanes:n}=xv();{let f=Nn(2026);t.forEach(_=>{_.kind==="modern"&&_.year>2019&&f()<.12&&(_.year=2025+f()*.7)})}this.roads=e,this.buildings=t,this.carLanes=n,this.object=new Ve,this.mat=ms();let s=vv(e);this.groundMat=Mf(s,qi);let r=new ln(9e4,9e4,1,1);r.rotateX(-Math.PI/2),this.ground=new ie(r,this.groundMat),this.ground.receiveShadow=!0,this.object.add(this.ground);let o=[];t.forEach((f,_)=>f.boxes.forEach(m=>o.push({...m,b:f,bi:_}))),this.boxes=o;let a=new Xe(1,1,1);a.translate(0,.5,0);let l=this.im=new yt(a,this.mat,o.length),c=new Float32Array(o.length*4),h=new Pe;o.forEach((f,_)=>{c.set([f.b.style,f.bi*.6180339%1,f.b.lit,0],_*4),l.setColorAt(_,h.setHex(f.b.color))}),a.setAttribute("aFac",new Si(c,4)),l.castShadow=!0,l.receiveShadow=!0,l.frustumCulled=!1,this.object.add(l);let u=t.filter(f=>f.top);this.tops=u;let d=new En(.5,1,4,1);d.rotateY(Math.PI/4),d.translate(0,.5,0);let p=new Float32Array(u.length*4);u.forEach((f,_)=>p.set([f.style,_*.37%1,.3,0],_*4)),d.setAttribute("aFac",new Si(p,4)),this.topIM=new yt(d,this.mat,Math.max(1,u.length)),u.forEach((f,_)=>this.topIM.setColorAt(_,h.setHex(f.color))),this.topIM.castShadow=!0,this.topIM.frustumCulled=!1,this.object.add(this.topIM),this.buildCranes(),this.buildTrees(),this.buildCars(),this.buildBridges(),this.year=-1,this.m4=new je,this.q=new Ft,this.e=new qn}buildCranes(){let t=new Ee({color:15249948,roughness:.6,metalness:.2}),n=new Xe(2.2,1,2.2);n.translate(0,.5,0);let s=new Xe(60,1.6,1.6);s.translate(16,0,0),this.craneMast=new yt(n,t,70),this.craneJib=new yt(s,t,70);for(let r of[this.craneMast,this.craneJib])r.castShadow=!0,r.frustumCulled=!1,this.object.add(r)}buildTrees(){let e=Nn(77),t=[];for(let l=-1480;l<1500;l+=14)for(let c of[-70,-50,50,70])Math.abs(l)>120&&Math.abs(l-1080)>90&&t.push([l+e()*4,Dt+c+e()*4,2003+e()*6]);for(let[l,c,h,u,d]of this.roads.park){let p=Math.min(60,Math.floor((Math.hypot(h-l,u-c)+d)*d/900));for(let f=0;f<p;f++){let _=e(),m=l+(h-l)*_+(e()-.5)*d*.8,g=c+(u-c)*_+(e()-.5)*d*.8;Math.abs(g-Dt)<40&&Math.abs(m)<1600||t.push([m,g,2e3+e()*20])}}for(let l=-3500;l<3800;l+=22){let c=wn(l);for(let h of[-1,1])e()<.7&&t.push([l+e()*8,c+h*(95+e()*25),2001+e()*15])}let[n,s]=bt.khanShatyr;this.treePts=t.filter(([l,c])=>Math.hypot(l-n,c-s)>420);let r=new $r(1,1);r.scale(1,1.15,1),r.translate(0,1.55,0);let o=new Ue(.06,.09,1,5);o.translate(0,.5,0),t=this.treePts,this.treeTop=new yt(r,new Ee({color:16777215,roughness:.9,flatShading:!1}),t.length),this.treeTrunk=new yt(o,new Ee({color:4864812,roughness:1}),t.length);let a=new Pe;t.forEach((l,c)=>this.treeTop.setColorAt(c,a.setHSL(.22+e()*.08,.45+e()*.2,.2+e()*.08)));for(let l of[this.treeTop,this.treeTrunk])l.castShadow=!0,l.receiveShadow=!0,l.frustumCulled=!1,this.object.add(l)}buildCars(){let e=this.carLanes.filter(()=>!0),t=Nn(5),n=1800;this.cars=[];for(let l=0;l<n;l++){let c=e[Math.floor(t()*e.length)];this.cars.push({L:c,off:t(),speed:(.04+t()*.05)*(t()<.5?1:-1),side:t()<.5?-1:1,hue:t()})}let s=new Xe(4.4,1.4,1.9);s.translate(0,.9,0),this.carIM=new yt(s,new Ee({color:16777215,roughness:.25,metalness:.6}),n);let r=new Pe,o=[15921906,1710618,9080726,12106946,2306634,7020319,14605008];this.cars.forEach((l,c)=>this.carIM.setColorAt(c,r.setHex(o[Math.floor(l.hue*o.length)]))),this.carIM.frustumCulled=!1,this.carIM.castShadow=!1;let a=new ln(1,1);a.rotateX(-Math.PI/2),this.lightMat=new Zn({color:16777215,transparent:!0,opacity:.9,blending:ai,depthWrite:!1,fog:!0}),this.lightIM=new yt(a,this.lightMat,n),this.cars.forEach((l,c)=>this.lightIM.setColorAt(c,r.setRGB(...l.speed>0?[1.4,1.05,.7]:[1.4,.18,.1]))),this.lightIM.frustumCulled=!1,this.object.add(this.carIM,this.lightIM)}buildBridges(){let e=new Ee({color:13617858,roughness:.7});this.bridges=new Ve;let t=[[-2650,1999],[-1050,2003],[560,2008],[2250,2005],[3300,2013],[-300,2016]];for(let[n,s]of t){let r=wn(n),o=wn(n+20)-wn(n-20),a=Math.atan2(o,40),l=new ie(new Xe(32,3,260),e);if(l.position.set(n,7,r),l.rotation.y=-a,l.castShadow=l.receiveShadow=!0,l.userData.year=s,this.bridges.add(l),s===2013){let c=new ie(new Ue(1.6,2.4,70,8),e);c.position.set(n,42,r),c.userData.year=s,c.castShadow=!0,this.bridges.add(c);let h=new Zn({color:15658734});for(let u=-6;u<=6;u++){if(!u)continue;let d=Math.hypot(u*18,60),p=new ie(new Ue(.15,.15,d,3),h);p.position.set(n,39,r+u*9),p.rotation.x=Math.atan2(u*18,60),p.userData.year=s,this.bridges.add(p)}}}this.object.add(this.bridges)}update(e){let t=e.year,n=this.m4,s=this.q,r=this.e,o=new C,a=new C,l=[],c=this.buildings.map(f=>{let _=st(f.year,f.year+1.4,t),m=Math.max(...f.boxes.map(g=>g.y0+g.h));return _>.02&&_<.98&&f.kind!=="house"&&l.push([f,_,m]),[_,m]});this.boxes.forEach((f,_)=>{let[m,g]=c[f.bi],v=g*m,M=Sn(v-f.y0,0,f.h);if(M<.05){n.makeScale(0,0,0),this.im.setMatrixAt(_,n);return}r.set(0,f.rot,0),s.setFromEuler(r),o.set(f.x,f.y0,f.z),a.set(f.w,M,f.d),n.compose(o,s,a),this.im.setMatrixAt(_,n)}),this.im.instanceMatrix.needsUpdate=!0,this.tops.forEach((f,_)=>{let m=st(f.year+1.3,f.year+1.6,t),g=f.top;m<.01?n.makeScale(0,0,0):(r.set(0,g.rot,0),s.setFromEuler(r),n.compose(o.set(g.x,g.y,g.z),s,a.set(g.w,g.h*m,g.w))),this.topIM.setMatrixAt(_,n)}),this.topIM.instanceMatrix.needsUpdate=!0,l.sort((f,_)=>_[2]-f[2]);for(let f=0;f<this.craneMast.count;f++){let _=l[f];if(!_||!e.cranes){n.makeScale(0,0,0),this.craneMast.setMatrixAt(f,n),this.craneJib.setMatrixAt(f,n);continue}let[m,g,v]=_,M=m.boxes[0],y=v*g+18,w=M.x+Math.cos(M.rot)*(M.w/2+6),b=M.z-Math.sin(M.rot)*(M.w/2+6);n.compose(o.set(w,0,b),s.identity(),a.set(1,y,1)),this.craneMast.setMatrixAt(f,n),r.set(0,(m.year*7.3+e.t*.25)%(Math.PI*2),0),s.setFromEuler(r),n.compose(o.set(w,y,b),s,a.set(1,1,1)),this.craneJib.setMatrixAt(f,n)}this.craneMast.instanceMatrix.needsUpdate=!0,this.craneJib.instanceMatrix.needsUpdate=!0;let h=1;this.treePts.forEach(([f,_,m],g)=>{let v=st(m,m+2,t)*h,M=(4+g*.618%1*3)*v;M<.05?n.makeScale(0,0,0):n.compose(o.set(f,0,_),s.identity(),a.set(M,M*1.1,M)),this.treeTop.setMatrixAt(g,n),M>=.05&&n.compose(o.set(f,0,_),s.identity(),a.set(M*2,M*1.7,M*2)),this.treeTrunk.setMatrixAt(g,n)}),this.treeTop.instanceMatrix.needsUpdate=!0,this.treeTrunk.instanceMatrix.needsUpdate=!0;let u=e.carMode==="trails",d=st(1999,2003,t)*(e.cars===!1?0:1);this.cars.forEach((f,_)=>{let[m,g,v,M]=f.L,y=Math.hypot(v-m,M-g),w=((f.off+e.t*f.speed*(u?6:1)*30/y)%1+1)%1,b=(v-m)/y,x=(M-g)/y,E=-x*4*f.side,P=b*4*f.side,A=m+(v-m)*w+E,I=g+(M-g)*w+P,N=Math.atan2(-x,b)+(f.speed<0?Math.PI:0);r.set(0,N,0),s.setFromEuler(r),d<.5||u?n.makeScale(0,0,0):n.compose(o.set(A,0,I),s,a.set(1,1,1)),this.carIM.setMatrixAt(_,n);let O=u?60:5;d>.5&&(e.night>.2||u)?n.compose(o.set(A-b*O*.5*Math.sign(f.speed),1.2,I-x*O*.5*Math.sign(f.speed)),s,a.set(O,1,u?1.2:1.6)):n.makeScale(0,0,0),this.lightIM.setMatrixAt(_,n)}),this.carIM.instanceMatrix.needsUpdate=!0,this.lightIM.instanceMatrix.needsUpdate=!0,this.lightMat.opacity=u?.85:.8*Sn(e.night*1.5),this.bridges.children.forEach(f=>{f.visible=t>=f.userData.year});let p=this.groundMat.userData.uni;p.uSoviet.value=st(1956,1975,t),p.uModern.value=st(1998,2022,t),p.uDirt.value=1-st(1960,1990,t)*.8}};function Ef(i,e,t=1){let n=Ii.filter((h,u)=>u%t===0),s=[],r=[],o=[],a=0;for(let h=0;h<n.length;h++){let[u,d]=n[h],[p,f]=n[Math.max(0,h-1)],[_,m]=n[Math.min(n.length-1,h+1)],g=_-p,v=m-f,M=Math.hypot(g,v)||1;g/=M,v/=M;let y=i*(1+.12*Math.sin(h*.05));if(h>0&&(a+=Math.hypot(u-n[h-1][0],d-n[h-1][1])),s.push(u-v*y/2,e,d+g*y/2,u+v*y/2,e,d-g*y/2),r.push(a/50,0,a/50,y/50),h>0){let w=(h-1)*2;o.push(w,w+1,w+2,w+1,w+3,w+2)}}let l=new xt;l.setAttribute("position",new ze(s,3)),l.setAttribute("uv",new ze(r,2)),l.setIndex(o),l.computeVertexNormals();let c=l.attributes.normal;for(let h=0;h<c.count;h++)c.setXYZ(h,0,1,0);return l}function bf(i,e,t){let n=Ii,s=[],r=[];for(let l of[-1,1]){let c=s.length/3;for(let h=0;h<n.length;h++){let[u,d]=n[h],[p,f]=n[Math.max(0,h-1)],[_,m]=n[Math.min(n.length-1,h+1)],g=_-p,v=m-f,M=Math.hypot(g,v)||1;g/=M,v/=M;let y=1+.12*Math.sin(h*.05);if(s.push(u-v*i*y*l,t,d+g*i*y*l,u-v*e*y*l,t,d+g*e*y*l),h>0){let w=c+(h-1)*2;r.push(w,w+1,w+2,w+1,w+3,w+2)}}}let o=new xt;o.setAttribute("position",new ze(s,3)),o.setIndex(r);let a=new Float32Array(s.length);for(let l=1;l<a.length;l+=3)a[l]=1;return o.setAttribute("normal",new Lt(a,3)),o}var Vl=class{constructor(){this.object=new Ve,this.water=new ie(Ef(gs,.9),Sf()),this.water.receiveShadow=!0,this.water.material.side=Ot;let e=new Ee({color:8090448,roughness:1});this.bank=new ie(Ef(gs+46,.35),e),this.bank.receiveShadow=!0,e.side=Ot;let t=new Ee({color:12169894,roughness:.75});this.emb=new ie(bf(gs/2-2,gs/2+9,1.8),t),this.emb.material.side=Ot,this.emb.receiveShadow=!0,this.prom=new ie(bf(gs/2+9,gs/2+34,.7),new Ee({color:10328722,roughness:.8})),this.prom.receiveShadow=!0,this.prom.material.side=Ot,this.object.add(this.bank,this.prom,this.emb,this.water),this.water.renderOrder=2}update(e){let t=st(1999,2006,e.year);this.emb.visible=t>.5,this.prom.visible=t>.5,this.bank.visible=t<=.5}};var bo=()=>new Ee({color:15987180,roughness:.32,metalness:.05}),yv=()=>new Ee({color:14722110,roughness:.1,metalness:1,emissive:16753978,emissiveIntensity:0});function Mv(i,e,t=.5,n=.3){let s=i.attributes.position.count,r=new Float32Array(s*4);for(let o=0;o<s;o++)r.set([e,n,t,0],o*4);return i.setAttribute("aFac",new Lt(r,4)),i}function gn(i,e,t,n=.5,s=.3){let r=new ie(Mv(i,e,n,s),ms({color:t}));return r.castShadow=r.receiveShadow=!0,r}function lt(i){return i.castShadow=!0,i.receiveShadow=!0,i}function Oh(i,e,t,n=[1,1]){let s=document.createElement("canvas");s.width=i,s.height=e,t(s.getContext("2d"),i,e);let r=new si(s);return r.wrapS=r.wrapT=ei,r.repeat.set(...n),r.colorSpace=Zt,r.anisotropy=8,r}function Sv(){let i=new Ve,e=bo(),t=new Ee({color:14078148,roughness:.6});for(let g=0;g<3;g++){let v=lt(new ie(new Ue(70-g*14,70-g*14,.6,64),t));v.position.y=.3+g*.6,i.add(v)}let n=lt(new ie(new Ue(10,11,7,32),e));n.position.y=5,i.add(n);let s=lt(new ie(new Ue(3,3.6,62,16),e));s.position.y=33,i.add(s);let r=22,o=6,a=63,l=6.5,c=7.5,h=1.9,u=new Ue(.42,.42,1,6);u.translate(0,.5,0);let d=new C(0,1,0);for(let g of[1,-1])for(let v=0;v<r;v++){let M=v/r*Math.PI*2,y=new C(Math.cos(M)*l,o,Math.sin(M)*l),w=new C(Math.cos(M+h*g)*c,a,Math.sin(M+h*g)*c),b=lt(new ie(u,e)),x=w.clone().sub(y);b.position.copy(y),b.scale.set(1,x.length(),1),b.quaternion.setFromUnitVectors(d,x.normalize()),i.add(b)}for(let g of[6,63]){let v=lt(new ie(new oi(g<10?l:c,.6,6,40),e));v.rotation.x=Math.PI/2,v.position.y=g,i.add(v)}let p=86,f=11,_=24;for(let g=0;g<_;g++){let v=g/_*Math.PI*2,M=.55,y=(b,x,E)=>new C(Math.cos(v+M*E)*b,x,Math.sin(v+M*E)*b),w=new ri([y(7,62,0),y(10.5,70,.2),y(14.5,78,.45),y(15,86,.7),y(13.2,93,.9),y(9.5,98,1)]);i.add(lt(new ie(new Qr(w,28,.5,5),e)))}let m=new ie(new Pt(f,64,40),yv());return m.position.y=p,lt(m),i.add(m),i.userData.glow=[m.material],i.userData.lit=[e],i}function Ev(){let i=new Ve,e=150,t=98,n=84,s=1.55,r=96,o=60,a=[],l=[],c=[];for(let m=0;m<=o;m++){let g=m/o,v=Math.pow(1-g,s),M=18*g*g;for(let y=0;y<=r;y++){let w=y/r*Math.PI*2;a.push(Math.cos(w)*t*v+M,e*g,Math.sin(w)*n*v),l.push(y/r,g)}}for(let m=0;m<o;m++)for(let g=0;g<r;g++){let v=m*(r+1)+g;c.push(v,v+r+1,v+1,v+1,v+r+1,v+r+2)}let h=new xt;h.setAttribute("position",new ze(a,3)),h.setAttribute("uv",new ze(l,2)),h.setIndex(c),h.computeVertexNormals();let u=Oh(1024,512,(m,g,v)=>{let M=m.createLinearGradient(0,0,0,v);M.addColorStop(0,"#f6efdc"),M.addColorStop(1,"#e9dcc0"),m.fillStyle=M,m.fillRect(0,0,g,v),m.strokeStyle="rgba(120,110,90,0.55)",m.lineWidth=2;for(let y=-40;y<80;y++)m.beginPath(),m.moveTo(y*24,v),m.lineTo(y*24+300,0),m.stroke(),m.beginPath(),m.moveTo(y*24,v),m.lineTo(y*24-300,0),m.stroke();m.strokeStyle="rgba(90,80,60,0.35)",m.lineWidth=3;for(let y=0;y<v;y+=28)m.beginPath(),m.moveTo(0,y),m.lineTo(g,y),m.stroke()}),d=new Ee({map:u,color:16777215,roughness:.45,metalness:0,emissive:16765578,emissiveMap:u,emissiveIntensity:0,side:Ot}),p=lt(new ie(h,d));i.add(p);let f=lt(new ie(new Ue(.6,1.4,34,8),bo()));f.position.set(20,e+10,0),f.rotation.z=-.12,i.add(f);let _=lt(new ie(new Ue(112,116,3,64),new Ee({color:12433066,roughness:.7})));return _.scale.z=.88,_.position.y=1.5,i.add(_),i.userData.glow=[d],i}function bv(){let i=new Ve,e=Oh(1024,512,(a,l,c)=>{a.fillStyle="#0d1a2a",a.fillRect(0,0,l,c),a.strokeStyle="#9fb7cc",a.lineWidth=3;for(let h=0;h<=l;h+=16)a.beginPath(),a.moveTo(h,0),a.lineTo(h,c),a.stroke();for(let h=0;h<=c;h+=16)a.beginPath(),a.moveTo(0,h),a.lineTo(l,h),a.stroke()}),t=Oh(1024,512,(a,l,c)=>{a.fillStyle="#000",a.fillRect(0,0,l,c),a.strokeStyle="#6fc8ff",a.lineWidth=2;for(let h=0;h<=c;h+=32)a.beginPath(),a.moveTo(0,h),a.lineTo(l,h),a.stroke();a.fillStyle="rgba(120,200,255,0.25)",a.fillRect(0,c*.45,l,c*.1)}),n=new Ee({map:e,roughness:.08,metalness:.92,color:12572394,emissive:16777215,emissiveMap:t,emissiveIntensity:0}),s=lt(new ie(new Pt(40,72,48),n));s.position.y=60,i.add(s);let r=lt(new ie(new Ue(22,30,22,40),bo()));r.position.y=11,i.add(r);for(let a=0;a<14;a++){let l=a/14*Math.PI*2,c=175+a%2*25,h=gn(new Xe(70,1,34).translate(0,.5,0),0,7313336,.4,a*.13);h.scale.y=18+a%3*6,h.position.set(Math.cos(l)*c,0,Math.sin(l)*c),h.rotation.y=-l+Math.PI/2,i.add(h)}let o=new ie(new Ue(150,150,.5,64),new Ee({color:13617857,roughness:.6}));return o.receiveShadow=!0,o.position.y=.25,i.add(o),i.userData.glow=[n],i}function Tv(){let i=new Ve,e=15855076,t=gn(new Xe(64,1,150).translate(0,.5,0),5,e,.6,.21);t.scale.y=30,i.add(t);let n=gn(new Xe(50,1,46).translate(0,.5,0),5,e,.6,.31);n.scale.y=22,n.position.set(-4,0,-98),i.add(n);let s=n.clone();s.position.z=98,i.add(s);let r=gn(new Xe(14,1,60).translate(0,.5,0),5,e,.6,.41);r.scale.y=26,r.position.set(-38,0,0),i.add(r);let o=new Ue(1.1,1.2,22,12);o.translate(0,11,0);let a=bo();for(let m=-9;m<=9;m++){let g=lt(new ie(o,a));g.position.set(-46,2,m*3.2),i.add(g)}let l=lt(new ie(new Xe(18,3,64),a));l.position.set(-40,27.5,0),i.add(l);let c=lt(new ie(new Ue(17,17,12,48),a));c.position.y=36,i.add(c);let h=new Ee({color:3110080,roughness:.25,metalness:.55}),u=lt(new ie(new Pt(17,48,24,0,Math.PI*2,0,Math.PI/2),h));u.scale.y=1.35,u.position.y=42,i.add(u);let d=new Ee({color:14856266,roughness:.2,metalness:1});for(let m=0;m<16;m++){let g=new ie(new oi(17.1,.25,4,24,Math.PI/2),d);g.rotation.set(0,m/16*Math.PI*2,Math.PI/2),g.scale.set(1.35,1,1),g.position.y=42,i.add(g)}let p=lt(new ie(new En(2.2,34,12),d));p.position.y=42+17*1.35+15,i.add(p);let f=new ie(new Pt(2.2,16,12),d);f.position.y=67,i.add(f);let _=new ie(new Xe(140,.5,220),new Ee({color:14209734,roughness:.55}));return _.position.set(-80,.25,0),_.receiveShadow=!0,i.add(_),i.userData.lit=[a],i}function wv(){let i=new Ve;for(let t of[-1,1]){let n=gn(new Ue(17,17,1,40).translate(0,.5,0),6,13935687,.45,.5+t*.1);n.scale.y=112,n.position.z=t*118,i.add(n);let s=lt(new ie(new Ue(12,17,6,40),new Ee({color:13146168,metalness:1,roughness:.2})));s.position.set(0,115,t*118),i.add(s)}let e=gn(new Xe(60,1,150).translate(0,.5,0),3,14998991,.55,.77);return e.scale.y=40,e.position.x=120,i.add(e),i}function Av(){let i=new Ve;[[0,0,70,70,20,5,15328474],[-60,40,50,60,28,0,6000575],[-20,90,46,50,36,0,5211320],[30,120,42,44,44,0,4882357],[60,30,40,50,26,5,15328474],[90,-40,60,40,18,5,15328474]].forEach(([n,s,r,o,a,l,c],h)=>{let u=gn(new Xe(r,1,o).translate(0,.5,0),l,c,.5,.11*h);u.scale.y=a,u.position.set(n,0,s),i.add(u)});let t=lt(new ie(new Pt(16,32,16,0,Math.PI*2,0,Math.PI/2),new Ee({color:9418456,roughness:.15,metalness:.8})));return t.position.set(0,20,0),i.add(t),i}function Rv(){let i=new Ve,e=62,t=62/Math.SQRT2,n=new Ee({color:14275527,roughness:.5,metalness:.05}),s=lt(new ie(new Ue(t*.28,t,e*.72,4,1),n));s.rotation.y=Math.PI/4,s.position.y=e*.36,i.add(s);let r=new Ee({color:15848058,roughness:.1,metalness:.6,emissive:16761690,emissiveIntensity:0}),o=lt(new ie(new En(t*.28,e*.28,4),r));o.rotation.y=Math.PI/4,o.position.y=e*.72+e*.14,i.add(o);let a=new ie(new Ue(70,95,6,4),new Ee({color:6257210,roughness:1}));return a.rotation.y=Math.PI/4,a.position.y=0,a.receiveShadow=!0,i.add(a),i.position.y=3,i.userData.glow=[r],i}function Cv(){let i=new Ve,e=bo(),t=gn(new Xe(80,1,80).translate(0,.5,0),5,16052974,.6,.66);t.scale.y=22,i.add(t);let n=lt(new ie(new Ue(15,15,10,40),e));n.position.y=27,i.add(n);let s=new Ee({color:16119282,roughness:.3,metalness:.1}),r=lt(new ie(new Pt(15,40,20,0,Math.PI*2,0,Math.PI/2),s));r.scale.y=1.25,r.position.y=32,i.add(r);let o=new Ee({color:14856266,roughness:.2,metalness:1}),a=new ie(new En(.8,7,8),o);a.position.y=54,i.add(a);for(let[l,c]of[[-44,-44],[44,-44],[-44,44],[44,44]]){let h=lt(new ie(new Ue(2,2.6,72,16),e));h.position.set(l,36,c),i.add(h);let u=new ie(new En(2.3,8,16),o);u.position.set(l,76,c),i.add(u);for(let d of[40,58]){let p=new ie(new Ue(3.2,3.2,1.2,16),e);p.position.set(l,d,c),i.add(p)}}return i.userData.lit=[e],i}function Iv(){let i=new Ve,e=gn(new Ue(15,27,1,8).translate(0,.5,0),0,8363960,.5,.91);e.scale.y=282,i.add(e);let t=lt(new ie(new Ue(4,15,26,8),new Ee({color:11188420,metalness:.9,roughness:.2})));t.position.y=295,i.add(t);let n=new ie(new Ue(.5,1.5,22,6),new Ee({color:14540253,metalness:1,roughness:.3}));n.position.y=318,i.add(n);for(let[s,r,o,a]of[[70,40,150,7179944],[-60,60,170,6193049],[10,-75,130,9086651]]){let l=gn(new Xe(34,1,30).translate(0,.5,0),0,a,.5,s*.01);l.scale.y=o,l.position.set(s,0,r),i.add(l)}return i}function Pv(){let i=new Ve;for(let[e,t,n]of[[0,0,205],[62,40,168],[-55,50,150]]){let s=gn(new Xe(32,1,32).translate(0,.5,0),0,4029803,.5,e*.02+.3);s.scale.y=n,s.position.set(e,0,t),i.add(s);let r=gn(new En(22.6,30,4).rotateY(Math.PI/4).translate(0,15,0),0,4889218,.3,.7);r.position.set(e,n,t),i.add(r)}return i}function Lv(){let i=new Ve,e=14273714;for(let[n,s,r]of[[54,0,42],[36,42,48],[24,90,26],[14,116,10]]){let o=gn(new Xe(n,1,n).translate(0,.5,0),5,e,.6,n*.01);o.scale.y=r,o.position.y=s,i.add(o)}let t=new ie(new En(2.4,26,8),new Ee({color:14856266,metalness:1,roughness:.25}));return t.position.y=139,i.add(t),i}function Dv(){let i=new Ve,e=15721679,t=gn(new Xe(110,1,170).translate(0,.5,0),5,e,.55,.37);t.scale.y=30,i.add(t);let n=gn(new Xe(60,1,90).translate(0,.5,0),5,e,.5,.47);n.scale.y=42,n.position.x=30,i.add(n);let s=new Ee({color:16183522,roughness:.4}),r=new Ue(1.6,1.8,26,16);r.translate(0,13,0);for(let f=0;f<8;f++){let _=lt(new ie(r,s));_.position.set(-66,2,-31.5+f*9),i.add(_)}let o=lt(new ie(new Xe(22,2,84),s));o.position.set(-64,1,0),i.add(o);let a=lt(new ie(new Xe(16,5,80),s));a.position.set(-64,30.5,0),i.add(a);let l=new Js;l.moveTo(-40,0),l.lineTo(40,0),l.lineTo(0,12),l.closePath();let c=new Kr(l,{depth:14,bevelEnabled:!1});c.rotateY(Math.PI/2),c.translate(-71,33,0),i.add(lt(new ie(c,s)));let h=new Ee({color:13935680,metalness:.75,roughness:.35}),u=lt(new ie(new Ue(2.2,2.6,3.2,12),h));u.position.set(-63,46,0),i.add(u);let d=lt(new ie(new Mn(.8,2.6,4,8),h));d.position.set(-63,49.5,0),i.add(d);for(let f=-1.5;f<=1.5;f++){let _=lt(new ie(new Mn(.75,2.2,4,10),h));_.rotation.z=Math.PI/2+.55,_.position.set(-67.5,46.5,f*2),i.add(_);let m=lt(new ie(new Mn(.42,1.4,4,8),h));m.rotation.z=.35,m.position.set(-68.6,48.6,f*2),i.add(m);for(let g of[-.7,.7]){let v=lt(new ie(new Ue(.18,.15,2.4,6),h));v.position.set(-66.5+g,45.2,f*2),i.add(v)}}let p=lt(new ie(new Pt(22,40,20,0,Math.PI*2,0,Math.PI/2),new Ee({color:10926512,roughness:.35,metalness:.5})));return p.scale.y=.55,p.position.set(10,30,0),i.add(p),i.userData.lit=[s],i}function Nv(){let i=new Ve,e=gn(new Ue(15,18,1,24).translate(0,.5,0),0,8366532,.55,.12);e.scale.y=44,i.add(e);let t=lt(new ie(new Ue(19,19,1.2,40),new Ee({color:13221029,roughness:.7})));t.position.y=44.6,i.add(t);let n=new ie(new Ue(19,19,1.1,40,1,!0),new Ee({color:12575728,roughness:.6,metalness:0,transparent:!0,opacity:.25,side:Ot}));n.position.y=45.75,i.add(n);let s=lt(new ie(new oi(19,.08,6,60),new Ee({color:13685976,metalness:.9,roughness:.3})));return s.rotation.x=Math.PI/2,s.position.y=46.3,i.add(s),i}var Uv=[["baiterek",Sv,2002],["akOrda",Tv,2004],["goldTowers",wv,2004],["pyramid",Rv,2006],["triumph",Lv,2006],["khanShatyr",Ev,2010],["emerald",Pv,2011],["mosque",Cv,2012],["museum",Av,2014],["nurAlem",bv,2017],["abuDhabi",Iv,2018],["opera",Dv,2013],["viewpoint",Nv,2015]],Wl=class{constructor(){this.object=new Ve,this.items={};for(let[e,t,n]of Uv){let s=t(),[r,o]=bt[e];s.position.x=r,s.position.z=o,e==="akOrda"&&(s.rotation.y=0),s.userData.year=n,this.items[e]=s,this.object.add(s)}}update(e){let t=e.year;for(let s of Object.values(this.items)){let r=st(s.userData.year-1.6,s.userData.year,t);s.visible=r>.01,s.scale.y=Math.max(.001,r);for(let o of s.userData.glow||[])o.emissiveIntensity=(o.map&&o.emissiveMap?.45:.7)*e.night;for(let o of s.userData.lit||[])o.emissive=o.emissive||new Pe,o.emissive.setRGB(1,.92,.8),o.emissiveIntensity=.08*e.night}let n=this.items.baiterek.userData.glow[0];n.emissiveIntensity=.05+.8*e.night+(e.baiterekGlow||0)*.3}};function To(i,e=!1){let t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,l=new xt;l.morphTargetsRelative=a;let c=0;for(let h=0;h<i.length;++h){let u=i[h],d=0,p=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in u.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(u.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in u.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;if(u.morphAttributes[f].length!==i[0].morphAttributes[f].length)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have the same number of morph targets for the "'+f+'" morph attribute.'),null;o[f]===void 0&&(o[f]=[]),o[f].push(u.morphAttributes[f]),p++}if(p!==s.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of morph attributes."),null;if(e){let f;if(t)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,f,h),c+=f}}if(t){let h=0,u=[];for(let d=0;d<i.length;++d){let p=i[d].index;for(let f=0;f<p.count;++f)u.push(p.getX(f)+h);h+=i[d].attributes.position.count}l.setIndex(u)}for(let h in r){let u=Tf(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(let h in o){let u=o[h][0].length;if(u!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let d=0;d<u;++d){let p=[];for(let _=0;_<o[h].length;++_)p.push(o[h][_][d]);let f=Tf(p);if(!f)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(f)}}}return l}function Tf(i){let e,t,n,s=-1,r=0;for(let c=0;c<i.length;++c){let h=i[c];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}let o=new e(r),a=new Lt(o,t,n),l=0;for(let c=0;c<i.length;++c){let h=i[c];if(h.isInterleavedBufferAttribute){let u=l/t;for(let d=0,p=h.count;d<p;d++)for(let f=0;f<t;f++){let _=h.getComponent(d,f);a.setComponent(d+u,f,_)}}else o.set(h.array,l);l+=h.count*t}return s!==void 0&&(a.gpuType=s),a}var Et=Nn(1830);function wf(i,e,t=.4){let n=i.attributes.position.count,s=new Float32Array(n*4);for(let r=0;r<n;r++)s.set([e,t,.6,0],r*4);return i.setAttribute("aFac",new Lt(s,4)),i}function Fv(){let i=[],e=new Mn(.42,1.25,4,8);e.rotateZ(Math.PI/2),e.translate(0,1.35,0),i.push(e);let t=new Ue(.17,.27,.95,6);t.rotateZ(-.75),t.translate(.95,1.75,0),i.push(t);let n=new Xe(.62,.26,.24);n.rotateZ(-.35),n.translate(1.38,2,0),i.push(n);for(let[a,l]of[[.55,.2],[.55,-.2],[-.6,.2],[-.6,-.2]]){let c=new Ue(.07,.06,1.05,5);c.translate(a,.53,l),i.push(c)}let s=new Ue(.05,.12,.8,5);s.rotateZ(.6),s.translate(-1.15,1.25,0),i.push(s);let r=new Ue(.2,.26,.75,6);r.translate(-.05,2.2,0),i.push(r);let o=new Pt(.15,8,6);return o.translate(-.05,2.72,0),i.push(o),To(i.map(a=>a.toNonIndexed()))}function Ov(){let i=[],e=new Xe(2.6,.6,1.5);e.translate(-2.2,1,0),i.push(e);let t=new Xe(2.3,.7,1.3);t.translate(-2.2,1.6,0),i.push(t);for(let s of[.85,-.85]){let r=new Ue(.62,.62,.12,12);r.rotateX(Math.PI/2),r.translate(-2.2,.62,s),i.push(r)}let n=new Xe(2,.08,.08);return n.translate(-.4,1,.45),i.push(n),To(i.map(s=>s.toNonIndexed()))}var Xl=class{constructor(){this.object=new Ve;let[e,t]=bt.fortress;this.center=[e,t];let n=new Ee({color:6967864,roughness:.95}),s=new Ee({color:4931638,roughness:.9});this.items=[];let r=100,o=26,a=[],l=[[-r,-r],[r,-r],[r,r],[-r,r]];for(let A=0;A<4;A++){let[I,N]=l[A],[O,L]=l[(A+1)%4],G=Math.sign(I),X=Math.sign(N);a.push([I-G*0+(O-I)*0,N],[I+G*o,N+X*o]),a.push([I+(O-I)*.12,N+(L-N)*.12]),a.push([I+(O-I)*.88,N+(L-N)*.88])}let c=[];for(let A=0;A<a.length;A++){let[I,N]=a[A],[O,L]=a[(A+1)%a.length],G=Math.hypot(O-I,L-N),X=Math.floor(G/.55);for(let k=0;k<X;k++){let ne=k/X,W=I+(O-I)*ne,$=N+(L-N)*ne;Math.abs($-r)<1&&Math.abs(W)<6||c.push([e+W,t+$,3.8+Et()*.8])}}let h=new Ue(.19,.21,1,6);h.translate(0,.5,0),this.posts=new yt(h,n,c.length);let u=new je;c.forEach(([A,I,N],O)=>this.posts.setMatrixAt(O,u.compose(new C(A,0,I),new Ft,new C(1,N,1)))),this.posts.castShadow=this.posts.receiveShadow=!0,this.object.add(this.posts),this.items.push({obj:this.posts,from:1829,to:1878});let d=[[-r-o,-r-o],[r+o,-r-o],[r+o,r+o],[-r-o,r+o],[0,r+3]];for(let[A,I]of d){let N=new Ve,O=new ie(wf(new Xe(6,9,6).translate(0,4.5,0),4,.2),ms({color:7362104})),L=new ie(new En(5.2,4,4).rotateY(Math.PI/4).translate(0,11,0),s);O.castShadow=L.castShadow=!0,O.receiveShadow=!0,N.add(O,L),N.position.set(e+A,0,t+I),this.object.add(N),this.items.push({obj:N,from:1829,to:1878})}let p=[];for(let A=0;A<22;A++)p.push([e+(Et()-.5)*150,t+(Et()-.5)*150,1830+Et()*6,1958+Et()*14,Et()<.15?1.5:1]);for(let A=0;A<230;A++){let I=Et()*Math.PI*2,N=140+Math.pow(Et(),.7)*750,O=e+Math.cos(I)*N*1.3,L=t+Math.sin(I)*N*.8-120;hi(O,L)<120||p.push([O,L,1836+N/900*60+Et()*12,1955+Et()*20,Et()<.12?1.6:1])}this.houses=p;let f=wf(new Xe(1,1,1).translate(0,.5,0),4,.5);this.houseIM=new yt(f,ms({color:7230777}),p.length);let _=new Ue(.5,.5,1,3,1);_.rotateZ(Math.PI/2),_.rotateX(-Math.PI/2),_.translate(0,.25,0),_.scale(1,1,1),this.roofIM=new yt(_,s,p.length);let m=new Pe;p.forEach((A,I)=>this.houseIM.setColorAt(I,m.setHSL(.08,.3+Et()*.15,.24+Et()*.1)));for(let A of[this.houseIM,this.roofIM])A.castShadow=A.receiveShadow=!0,A.frustumCulled=!1,this.object.add(A);this.houseRot=p.map(()=>(Et()<.5?0:Math.PI/2)+(Et()-.5)*.1),this.houseSize=p.map(A=>[8+Et()*5,6+Et()*2,(3+Et()*.8)*A[4]]);let g=[],v=[[e-520,t+260],[e+480,t+180],[e-260,t-420],[e+760,t-260],[e-900,t-120]];for(let[A,I]of v)for(let N=0;N<9;N++){let O=A+(Et()-.5)*120,L=I+(Et()-.5)*90;hi(O,L)<95||g.push([O,L,2.8+Et()*.9])}this.yurts=g;let M=new Ue(1,1,1,18);M.translate(0,.5,0);let y=new Pt(1,18,8,0,Math.PI*2,0,Math.PI/2),w=new Ee({color:15130575,roughness:.95});this.yWall=new yt(M,w,g.length),this.yDome=new yt(y,w,g.length),g.forEach(([A,I,N],O)=>{this.yWall.setMatrixAt(O,u.compose(new C(A,0,I),new Ft,new C(N,1.7,N))),this.yDome.setMatrixAt(O,u.compose(new C(A,1.7,I),new Ft,new C(N,1.5,N)))});for(let A of[this.yWall,this.yDome])A.castShadow=A.receiveShadow=!0,this.object.add(A),this.items.push({obj:A,from:1700,to:1935});let b=[];for(let[A,I]of v)for(let N=0;N<70;N++){let O=A+120+(Et()-.5)*260,L=I+140+(Et()-.5)*200;hi(O,L)<90||b.push([O,L,Et()*6.28])}let x=new Pt(.55,6,4);x.scale(1.4,.8,.8),x.translate(0,.6,0),this.herd=new yt(x,new Ee({color:14209213,roughness:1}),b.length),b.forEach(([A,I,N],O)=>this.herd.setMatrixAt(O,u.compose(new C(A,0,I),new Ft().setFromAxisAngle(new C(0,1,0),N),new C(1,1,1)))),this.herd.castShadow=!0,this.object.add(this.herd),this.items.push({obj:this.herd,from:1700,to:1935});let E=[[[e-2600,t-900],[e-120,t-20]],[[e+120,t+30],[e+2400,t-300]],[[e,t-120],[e+300,t-2600]]];this.movers=[];for(let A=0;A<26;A++)this.movers.push({tr:E[A%3],off:Et(),sp:(.006+Et()*.006)*(Et()<.5?1:-1),cart:Et()<.45,lat:(Et()-.5)*4});let P=new Ee({color:4863014,roughness:.9});this.horseIM=new yt(Fv(),P,this.movers.length),this.cartIM=new yt(Ov(),new Ee({color:8020552,roughness:.95}),this.movers.length);for(let A of[this.horseIM,this.cartIM])A.castShadow=!0,A.frustumCulled=!1,this.object.add(A);this.tmp={m4:u,q:new Ft,p:new C,s:new C,up:new C(0,1,0)}}update(e){let{year:t,t:n}=e,{m4:s,q:r,p:o,s:a,up:l}=this.tmp;for(let h of this.items){let u=st(h.from,h.from+1,t)*(1-st(h.to-4,h.to,t));h.obj.visible=u>.02,h.obj.isGroup&&(h.obj.scale.y=Math.max(.01,u))}this.houses.forEach(([h,u,d,p],f)=>{let _=st(d,d+2,t)*(1-st(p-3,p,t)),[m,g,v]=this.houseSize[f];if(_<.02){s.makeScale(0,0,0),this.houseIM.setMatrixAt(f,s),this.roofIM.setMatrixAt(f,s);return}r.setFromAxisAngle(l,this.houseRot[f]),this.houseIM.setMatrixAt(f,s.compose(o.set(h,0,u),r,a.set(m,v*_,g))),this.roofIM.setMatrixAt(f,s.compose(o.set(h,v*_,u),r,a.set(m*1.08,2.6*_,g*1.12)))}),this.houseIM.instanceMatrix.needsUpdate=!0,this.roofIM.instanceMatrix.needsUpdate=!0;let c=1-st(1925,1950,t);this.horseIM.visible=this.cartIM.visible=c>.01,this.movers.forEach((h,u)=>{let[[d,p],[f,_]]=h.tr,m=((h.off+n*h.sp)%1+1)%1,g=f-d,v=_-p,M=Math.hypot(g,v),y=d+g*m-v/M*h.lat,w=p+v*m+g/M*h.lat,b=Math.atan2(-v,g)+(h.sp<0?Math.PI:0);r.setFromAxisAngle(l,b);let x=Math.abs(Math.sin(n*9+u))*.08;this.horseIM.setMatrixAt(u,s.compose(o.set(y,x,w),r,a.set(1,1,1))),h.cart?this.cartIM.setMatrixAt(u,s.compose(o.set(y,0,w),r,a.set(1,1,1))):this.cartIM.setMatrixAt(u,s.makeScale(0,0,0))}),this.horseIM.instanceMatrix.needsUpdate=!0,this.cartIM.instanceMatrix.needsUpdate=!0}};function Bv(){let i=new Mn(.2,.52,4,8);i.translate(0,1.2,0);let e=new Pt(.115,10,8);e.translate(0,1.66,0);let t=new Mn(.06,.5,3,6);t.translate(.26,1.18,0);let n=t.clone();return n.translate(-.52,0,0),To([i,e,t,n].map(s=>s.toNonIndexed()))}function Af(){let i=new Mn(.075,.72,3,6);return i.translate(0,-.42,0),i}var ql=class{constructor(e,t=3){let n=Nn(t);this.people=[];for(let c of e)for(let h=0;h<c.n;h++){let u=n()<(c.kids||.12),d=n()<(c.photo||0),p=c.dir?Math.atan2(c.dir[1],c.dir[0])+(n()<.5?Math.PI:0)+(n()-.5)*.25:n()*Math.PI*2;this.people.push({sp:c,x:(n()-.5)*c.w,z:(n()-.5)*c.d,ang:p,speed:d?0:(c.speed||1.3)*(.75+n()*.5)*(u?.9:1),h:u?.6+n()*.1:.94+n()*.12,phase:n()*6.28,stand:d,hue:n(),light:n(),phoneFace:d?n()*Math.PI*2:0})}let s=this.people.length,r=new Ee({color:16777215,roughness:.85});this.body=new yt(Bv(),r,s),this.legL=new yt(Af(),new Ee({color:2369068,roughness:.9}),s),this.legR=new yt(Af(),this.legL.material,s);let o=new ln(.075,.14);this.phone=new yt(o,new Zn({color:new Pe(2.5,2.7,3),side:Ot}),s);let a=new Pe,l=[14275786,1910067,7222324,3822704,11046755,4609866,2500394,15263457,5591134,10119758,3159357,9145224];this.people.forEach((c,h)=>this.body.setColorAt(h,a.setHex(l[Math.floor(c.hue*l.length)]))),this.object=new Ve;for(let c of[this.body,this.legL,this.legR,this.phone])c.castShadow=c!==this.phone,c.frustumCulled=!1,this.object.add(c);this.tmp={m4:new je,q:new Ft,q2:new Ft,p:new C,s:new C,up:new C(0,1,0),x:new C(1,0,0)}}update(e){let{m4:t,q:n,q2:s,p:r,s:o,up:a,x:l}=this.tmp,c=e.t;if(this.object.visible=e.year>2e3,!!this.object.visible){this.people.forEach((h,u)=>{let d=h.sp,p=Math.cos(h.ang),f=-Math.sin(h.ang),_=h.x+p*h.speed*c,m=h.z+f*h.speed*c;_=((_+d.w/2)%d.w+d.w)%d.w-d.w/2,m=((m+d.d/2)%d.d+d.d)%d.d-d.d/2;let g=d.x+_,v=d.z+m,M=h.stand?h.phoneFace:h.ang;n.setFromAxisAngle(a,M+Math.PI/2);let y=h.h*(d.scale||1),w=c*h.speed*2.4+h.phase,b=h.speed>0?Math.abs(Math.sin(w))*.04:0;this.body.setMatrixAt(u,t.compose(r.set(g,b,v),n,o.set(y,y,y)));let x=h.speed>0?Math.sin(w)*.45:0;for(let[E,P,A]of[[this.legL,1,.1],[this.legR,-1,-.1]]){s.setFromAxisAngle(l,x*P);let I=n.clone().multiply(s),N=new C(A*y,.86*y+b,0).applyQuaternion(n);E.setMatrixAt(u,t.compose(r.set(g+N.x,N.y,v+N.z),I,o.set(y,y,y)))}if(h.stand){let E=new C(0,0,.42*y).applyQuaternion(n);this.phone.setMatrixAt(u,t.compose(r.set(g+E.x,1.62*y,v+E.z),n,o.set(y*1.4,y*1.4,y)))}else this.phone.setMatrixAt(u,t.makeScale(0,0,0))});for(let h of[this.body,this.legL,this.legR,this.phone])h.instanceMatrix.needsUpdate=!0}}};function zv(){let t=document.createElement("canvas");t.width=1024,t.height=512;let n=t.getContext("2d");n.fillStyle="#00afca",n.fillRect(0,0,1024,512);let s="#fec50c";n.fillStyle=s,n.strokeStyle=s;let r=1024*.5,o=512*.4,a=512*.135;n.beginPath(),n.arc(r,o,a,0,Math.PI*2),n.fill();for(let u=0;u<32;u++){let d=u/32*Math.PI*2,p=d-.045,f=d+.045;n.beginPath(),n.moveTo(r+Math.cos(p)*a*1.17,o+Math.sin(p)*a*1.17),n.lineTo(r+Math.cos(d)*a*1.62,o+Math.sin(d)*a*1.62),n.lineTo(r+Math.cos(f)*a*1.17,o+Math.sin(f)*a*1.17),n.closePath(),n.fill()}n.save(),n.translate(r,512*.69),n.scale(1024/1024,512/512),n.beginPath(),n.moveTo(0,-28),n.bezierCurveTo(30,-40,90,-38,175,-22),n.bezierCurveTo(150,-14,160,-6,132,-2),n.bezierCurveTo(150,2,128,8,104,8),n.bezierCurveTo(118,14,92,18,64,14),n.bezierCurveTo(46,16,30,18,16,22),n.lineTo(22,44),n.lineTo(8,36),n.lineTo(0,50),n.lineTo(-8,36),n.lineTo(-22,44),n.lineTo(-16,22),n.bezierCurveTo(-30,18,-46,16,-64,14),n.bezierCurveTo(-92,18,-118,14,-104,8),n.bezierCurveTo(-128,8,-150,2,-132,-2),n.bezierCurveTo(-160,-6,-150,-14,-175,-22),n.bezierCurveTo(-90,-38,-30,-40,0,-28),n.closePath(),n.fill(),n.beginPath(),n.ellipse(0,-30,9,11,0,0,Math.PI*2),n.fill(),n.restore(),n.lineWidth=7,n.lineCap="round";let l=1024*.075,c=512/7;for(let u=0;u<7;u++){let d=c*(u+.5);for(let p of[-1,1])n.beginPath(),n.moveTo(l,d-c*.32),n.bezierCurveTo(l+p*30,d-c*.32,l+p*34,d+2,l+p*14,d+6),n.bezierCurveTo(l+p*2,d+8,l+p*4,d-10,l+p*14,d-6),n.stroke(),n.beginPath(),n.moveTo(l,d+c*.32),n.bezierCurveTo(l+p*22,d+c*.3,l+p*26,d+c*.12,l+p*12,d+c*.1),n.stroke();n.beginPath(),n.moveTo(l,d-c*.36),n.lineTo(l,d+c*.36),n.stroke()}let h=new si(t);return h.colorSpace=Zt,h.anisotropy=8,h}var Yl=class{constructor(e,t,n=52,s=26){this.object=new Ve;let r=s/2,o=new ie(new Ue(.28,.45,n,16),new Ee({color:14672872,metalness:.9,roughness:.25}));o.position.set(0,n/2,0),o.castShadow=!0;let a=new ie(new Pt(.7,16,12),new Ee({color:14856266,metalness:1,roughness:.2}));a.position.y=n+.5;let l=new ln(s,r,80,40);l.translate(s/2,0,0),this.uni={uT:{value:0},uW:{value:s}};let c=zv(),h=new Ee({map:c,emissiveMap:c,emissive:16777215,emissiveIntensity:.22,side:Ot,roughness:.6,metalness:0});h.onBeforeCompile=p=>{Object.assign(p.uniforms,this.uni);let f=`
        float fx = position.x / uW;
        float ph = position.x * 0.32 - uT * 4.2 + position.y * 0.08;
        float amp = fx * (1.6 + 0.6 * sin(uT * 0.9));
        float dz = sin(ph) * amp + sin(ph * 2.1 + 1.3) * amp * 0.25;
        float dzdx = cos(ph) * 0.32 * amp + cos(ph * 2.1 + 1.3) * 0.32 * 2.1 * amp * 0.25;`;p.vertexShader=p.vertexShader.replace("#include <common>",`#include <common>
uniform float uT; uniform float uW;`).replace("#include <beginnormal_vertex>",`${f}
vec3 objectNormal = normalize(vec3(-dzdx, 0.0, 1.0));
#ifdef USE_TANGENT
vec3 objectTangent = vec3( tangent.xyz );
#endif`).replace("#include <begin_vertex>","vec3 transformed = vec3(position.x - abs(dz) * 0.15, position.y - fx * fx * 1.2, dz);")};let u=new ie(l,h);u.position.set(.3,n-r/2-.4,0),u.castShadow=!0,this.object.add(o,a,u),this.object.position.set(e,0,t);let d=new ie(new Ue(4,5,1.2,24),new Ee({color:13617340,roughness:.6}));d.position.y=.6,d.receiveShadow=!0,this.object.add(d)}update(e){this.uni.uT.value=e.t,this.object.visible=e.year>=1992}},Zl=class{constructor(e=2060,t=-3200,n=3400,s=13){this.object=new Ve,this.z=e,this.x0=t,this.x1=n,this.y=s;let r=new Ee({color:13815753,roughness:.7}),o=new ie(new Xe(n-t,2.2,11),r);o.position.set((t+n)/2,s-1.1,e),o.castShadow=o.receiveShadow=!0,this.object.add(o);let a=new Ue(1.3,1.6,s-2.2,10);a.translate(0,(s-2.2)/2,0);let l=Math.floor((n-t)/36),c=new yt(a,r,l),h=new je;for(let f=0;f<l;f++)c.setMatrixAt(f,h.makeTranslation(t+18+f*36,0,e));c.castShadow=!0,this.object.add(c);let u=new Xe(24,3.6,3);u.translate(0,1.9,0);let d=new Ee({color:16054008,roughness:.25,metalness:.3}),p=new Ee({color:729136,roughness:.05,metalness:.9,emissive:10474751,emissiveIntensity:0});this.train=new Ve;for(let f=0;f<4;f++){let _=new ie(u,d);_.position.x=-f*25,_.castShadow=!0;let m=new ie(new Xe(23,1.1,3.05),p);m.position.set(-f*25,2.6,0);let g=new ie(new Xe(23.5,.35,3.06),new Ee({color:41924,emissive:41924,emissiveIntensity:.4}));g.position.set(-f*25,1.3,0),this.train.add(_,m,g)}this.band=p,this.object.add(this.train)}update(e){this.object.visible=e.year>=2023;let t=this.x0+200+e.t*22%(this.x1-this.x0-400);this.train.position.set(t,this.y,this.z),this.band.emissiveIntensity=.1+.5*e.night}};var Jl=class{constructor(){this.object=new Ve;let e=document.createElement("canvas");e.width=e.height=512;let t=e.getContext("2d");t.fillStyle="#cfc7b9",t.fillRect(0,0,512,512);for(let u=0;u<512;u+=32)for(let d=0;d<512;d+=64){let p=u/32%2?32:0,f=190+Math.floor((d*7+u*13)%37-18);t.fillStyle=`rgb(${f+8},${f+2},${f-8})`,t.fillRect(d+p+1,u+1,62,30)}let n=new si(e);n.wrapS=n.wrapT=ei,n.repeat.set(3300/12,140/12),n.colorSpace=Zt,n.anisotropy=8;let s=new ie(new ln(3300,140),new Ee({map:n,roughness:.55,metalness:0}));s.rotation.x=-Math.PI/2,s.position.set(-75,.25,Dt),s.receiveShadow=!0;let r=new Ee({color:5077554,roughness:.95});for(let u of[-40,40]){let d=new ie(new ln(3300,22),r);d.rotation.x=-Math.PI/2,d.position.set(-75,.32,Dt+u),d.receiveShadow=!0,this.object.add(d)}let o=new ie(new ln(2900,6),new Ee({color:993846,roughness:.04,metalness:.2,envMapIntensity:1.8}));o.rotation.x=-Math.PI/2,o.position.set(-75,.34,Dt+24),o.receiveShadow=!0,this.object.add(s,o);let a=[];for(let u=-1640;u<1520;u+=30)for(let d of[-26,26])Math.abs(u)>80&&a.push([u,Dt+d]);let l=new Ue(.09,.13,7,6);l.translate(0,3.5,0);let c=new Pt(.32,10,8);c.translate(0,7.1,0),this.poles=new yt(l,new Ee({color:2764081,metalness:.6,roughness:.4}),a.length),this.lampMat=new Ee({color:16777215,emissive:16767392,emissiveIntensity:0}),this.lamps=new yt(c,this.lampMat,a.length);let h=new je;a.forEach(([u,d],p)=>{h.makeTranslation(u,0,d),this.poles.setMatrixAt(p,h),this.lamps.setMatrixAt(p,h)}),this.poles.castShadow=!0,this.object.add(this.poles,this.lamps)}update(e){this.object.visible=e.year>=2003,this.lampMat.emissiveIntensity=2.2*e.night}};function Rf(i,e,t="#ffffff"){let n=document.createElement("canvas");n.width=1024,n.height=256;let s=n.getContext("2d");s.textAlign="center",s.textBaseline="middle",s.shadowColor="rgba(0,10,30,0.9)",s.shadowBlur=18,s.fillStyle=t,s.font="600 74px Montserrat, Inter, sans-serif",s.fillText(i,512,e?100:128),e&&(s.font="500 44px Montserrat, Inter, sans-serif",s.fillStyle="rgba(200,225,255,0.9)",s.fillText(e,512,182));let r=new si(n);r.colorSpace=Zt;let o=new Fr(new Xs({map:r,transparent:!0,depthTest:!1,depthWrite:!1,fog:!1}));return o.renderOrder=10,o}var Kl=class{constructor(e){this.object=new Ve;let t=[["\u0415\u0421\u0406\u041B","\u0430\u0443\u0434\u0430\u043D\u044B",-300,2350],["\u041D\u04B0\u0420\u0410","\u0430\u0443\u0434\u0430\u043D\u044B",-2300,3700],["\u0421\u0410\u0420\u042B\u0410\u0420\u049A\u0410","\u0430\u0443\u0434\u0430\u043D\u044B",-2500,-2300],["\u0411\u0410\u0419\u049A\u041E\u04A2\u042B\u0420","\u0430\u0443\u0434\u0430\u043D\u044B",200,-2700],["\u0410\u041B\u041C\u0410\u0422\u042B","\u0430\u0443\u0434\u0430\u043D\u044B",3200,-700]];this.labels=t.map(([c,h,u,d])=>{let p=Rf(c,h);return p.position.set(u,500,d),p.scale.set(1500,375,1),p});let n=Rf("\u0415\u0421\u0406\u041B \u04E8\u0417\u0415\u041D\u0406",null,"#8fe3ff");n.position.set(-3e3,300,wn(-3e3)-250),n.scale.set(1300,325,1),this.labels.push(n),this.labels.forEach(c=>this.object.add(c));let s=Nn(1538),r=e.filter(c=>c.boxes.length&&(c.kind==="modern"||c.kind==="soviet"||c.kind==="tower")),o=6e3,a=new Float32Array(o*3);for(let c=0;c<o;c++){let h=r[Math.floor(s()*r.length)].boxes[0];a[c*3]=h.x+(s()-.5)*h.w,a[c*3+1]=5+s()*(h.h+20),a[c*3+2]=h.z+(s()-.5)*h.d}let l=new xt;l.setAttribute("position",new Lt(a,3)),this.dotMat=new Ys({color:new Pe(1,.75,.35),size:2.2*(window.PLATE?.scale||.75)/.5,sizeAttenuation:!1,transparent:!0,opacity:.9,blending:ai,depthWrite:!1,fog:!1}),this.dots=new Br(l,this.dotMat),this.N=o,this.object.add(this.dots)}update(e){let t=e.map||0;this.object.visible=t>.01,this.labels.forEach((s,r)=>{s.material.opacity=st(.4+r*.08,.8+r*.08,t)*(e.labels??1)});let n=e.pop||0;this.dots.geometry.setDrawRange(0,Math.floor(this.N*Sn(n/1.6))),this.dotMat.opacity=.55*t}},$l=class{constructor(e){this.object=new Ve;let t=Nn(18),s=e.filter(a=>a.kind==="tower"||a.kind==="modern"&&a.boxes[0].h>50).map(a=>{let l=a.boxes[a.boxes.length-1];return[l.x,l.y0+l.h,l.z]});this.uni={uT:{value:0},uAmt:{value:0}};let r=new kt({uniforms:this.uni,transparent:!0,depthWrite:!1,blending:ai,vertexShader:"attribute float aU; attribute float aSeed; varying float vU; varying float vS; void main(){ vU = aU; vS = aSeed; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uT; uniform float uAmt; varying float vU; varying float vS;
        void main(){ float head = fract(uT * 0.35 + vS); float d = vU - head; float pulse = exp(-abs(d) * 18.0);
          float grow = step(vU, uAmt * 1.2 - vS * 0.2);
          vec3 c = mix(vec3(0.2, 0.7, 1.0), vec3(1.0, 0.8, 0.35), step(0.5, fract(vS * 7.0)));
          gl_FragColor = vec4(c * (0.35 + 2.5 * pulse), (0.25 + pulse) * grow); }`}),o=90;for(let a=0;a<o&&s.length>2;a++){let l=s[Math.floor(t()*s.length)],c=s[Math.floor(t()*s.length)],h=Math.hypot(l[0]-c[0],l[2]-c[2]);if(h<300||h>3e3)continue;let u=[(l[0]+c[0])/2,Math.max(l[1],c[1])+h*.25,(l[2]+c[2])/2],p=new as(new C(...l),new C(...u),new C(...c)).getPoints(64),f=new xt().setFromPoints(p),_=new Float32Array(p.length).map((m,g)=>g/(p.length-1));f.setAttribute("aU",new Lt(_,1)),f.setAttribute("aSeed",new Lt(new Float32Array(p.length).fill(t()),1)),this.object.add(new Or(f,r))}}update(e){this.uni.uT.value=e.t,this.uni.uAmt.value=e.data||0,this.object.visible=(e.data||0)>.01}},jl=class{constructor(e,t,n,s,r=6e4){let o=Nn(77),a=[];for(let f=0;f<3;f++){let _=f/3*Math.PI+.3,m=.06,g=1,v=Math.cos(_)*.05,M=Math.sin(_)*.05;a.push(v-Math.sin(_)*m,0,M+Math.cos(_)*m,v+Math.sin(_)*m,0,M-Math.cos(_)*m,v*3,g,M*3)}let l=new xt;l.setAttribute("position",new ze(a,3)),l.setAttribute("normal",new ze(new Array(a.length/3).fill([0,1,0]).flat(),3)),this.uni={uT:{value:0}};let c=new Ee({color:16777215,roughness:.85,side:Ot});c.onBeforeCompile=f=>{f.uniforms.uT=this.uni.uT,f.vertexShader=f.vertexShader.replace("#include <common>",`#include <common>
uniform float uT;`).replace("#include <begin_vertex>",`vec3 transformed = vec3(position);
          vec4 ip = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
          float k = position.y * position.y;
          float gust = sin(uT * 1.7 + ip.x * 0.045 + ip.z * 0.02) * 0.5 + 0.5;
          float wv = sin(uT * 3.1 + ip.x * 0.35 + ip.z * 0.21);
          transformed.x += k * (0.22 + 0.25 * gust + 0.08 * wv);
          transformed.z += k * 0.06 * wv;
          transformed.y -= k * 0.08 * gust;`)},c.customProgramCacheKey=()=>"grass-v1",this.im=new yt(l,c,r);let h=new je,u=new Ft,d=new C(0,1,0),p=new Pe;for(let f=0;f<r;f++){let _=e+o()*(t-e),m=n+o()*(s-n),g=.45+o()*.65;u.setFromAxisAngle(d,o()*Math.PI*2),h.compose(new C(_,0,m),u,new C(1+o(),g,1+o())),this.im.setMatrixAt(f,h),this.im.setColorAt(f,p.setHSL(.15+o()*.09,.5+o()*.2,.36+o()*.14))}this.im.castShadow=!1,this.im.receiveShadow=!0,this.im.frustumCulled=!1,this.object=this.im}update(e){this.uni.uT.value=e.t,this.im.visible=!!e.grass}};var Ql={fps:30,v:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,.05,.34,.8,1,1,.96,.92,.96,1,1,.97,.85,.8,.91,1,.99,.98,.99,.99,.94,.91,.96,1,1,.98,.95,.97,1,1,.93,.74,.68,.88,1,.8,.49,.52,.7,.8,.93,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,.99,.97,.98,1,1,1,1,.99,.99,.99,1,.99,.96,.94,.97,1,.85,.6,.63,.89,1,.96,.91,.88,.63,.35,.55,.9,1,1,1,.99,.91,.85,.93,.99,.95,.86,.83,.9,.89,.75,.53,.24,.04,0,0,0,0,0,0,0,0,0,0,.01,.28,.76,1,1,1,.97,.94,.97,.99,.95,.92,.96,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,.96,.92,.96,1,1,1,1,.98,.95,.98,1,1,1,1,1,1,.99,.92,.87,.93,.99,1,1,1,1,1,1,1,1,1,1,.86,.61,.63,.86,.98,1,.94,.83,.82,.81,.64,.57,.81,.99,.99,.95,.91,.94,.99,1,.85,.45,.1,.16,.55,.88,.99,1,1,.97,.75,.42,.37,.57,.58,.33,.08,0,0,0,0,0,0,0,0,0,0,0,.18,.58,.87,.97,1,1,1,.93,.6,.18,0,0,0,.22,.68,.93,.93,.95,.99,.94,.86,.86,.87,.92,.99,1,1,1,1,1,.98,.91,.89,.95,.99,.98,.99,1,1,.95,.86,.88,.97,1,1,.94,.65,.23,.02,0,0,.25,.75,.95,.9,.93,.99,.91,.67,.63,.86,1,1,1,1,1,.88,.56,.21,.04,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,.23,.7,.98,.99,.95,.74,.59,.81,1,1,1,1,1,1,1,.9,.79,.9,1,1,1,1,.98,.89,.77,.8,.94,1,.93,.77,.75,.91,1,1,1,1,1,.97,.93,.9,.9,.96,1,.99,.93,.89,.95,.98,.95,.98,.96,.83,.79,.92,1,1,.96,.83,.71,.76,.9,.98,.97,.87,.75,.79,.94,.99,.91,.86,.93,.99,1,.97,.79,.41,.09,0,.17,.59,.92,1,.98,.94,.94,.98,1,.98,.95,.95,.98,1,1,1,.98,.93,.81,.77,.91,.97,.94,.97,1,.93,.62,.18,0,0,.24,.73,.92,.73,.52,.58,.86,1,1,1,1,1,.95,.91,.96,.95,.78,.72,.89,1,1,.97,.89,.82,.88,.97,.99,.96,.92,.86,.84,.93,1,1,1,.99,1,1,1,1,1,1,1,1,.97,.94,.97,.94,.87,.81,.67,.65,.87,.99,.94,.79,.58,.62,.72,.53,.21,.04,0,0,0,0,0,0,0,0,0,0,.15,.55,.9,1,1,1,1,1,1,1,.99,.94,.9,.95,1,1,.95,.9,.95,1,1,1,.91,.65,.31,.32,.75,1,.96,.73,.51,.65,.88,.97,1,.85,.62,.69,.92,.95,.86,.86,.96,.98,.91,.89,.95,1,1,.99,.82,.44,.1,.19,.59,.88,.97,1,1,1,1,1,1,1,.98,.81,.57,.63,.86,.95,.97,.97,.92,.85,.83,.93,1,1,1,.99,.94,.73,.58,.73,.82,.6,.3,.08,0,0,0,0,0,0,0,0,0,0,.12,.42,.74,.93,1,1,1,1,1,1,.87,.73,.84,.97,.99,1,1,1,1,1,1,1,.97,.93,.97,1,1,.96,.78,.7,.87,.9,.66,.62,.86,1,.99,.96,.85,.8,.86,.76,.49,.21,.04,0,0,0,0,0,0,0,0,0,0,.22,.69,.97,1,1,.98,.95,.98,1,1,1,1,1,.99,.87,.75,.88,1,1,1,1,.99,.98,.99,.85,.54,.54,.79,.81,.78,.92,1,.99,.96,.94,.96,.81,.62,.77,.92,.87,.88,.96,1,.93,.85,.89,.97,.99,.98,.84,.46,.12,0,0,0,0,0,0,.08,.4,.82,.99,.98,.99,.94,.85,.7,.6,.82,1,1,1,1,.98,.95,.98,.97,.92,.87,.73,.68,.87,1,1,1,.97,.91,.87,.87,.95,.91,.58,.17,.01,0,.24,.73,.99,.97,.92,.92,.94,.8,.66,.79,.96,1,1,.97,.94,.97,.99,.77,.46,.59,.9,.92,.79,.8,.92,.93,.86,.9,.98,.79,.41,.17,.06,0,0,0,0,.14,.53,.89,1,1,1,1,.82,.56,.66,.92,1,1,1,.99,.99,.99,.95,.74,.61,.81,.86,.69,.74,.93,1,.97,.87,.84,.94,1,1,1,1,.98,.92,.91,.97,1,.96,.92,.96,1,1,1,1,1,1,1,.95,.91,.95,1,.99,.81,.41,.1,.01,0,0,.16,.58,.88,.91,.89,.77,.65,.84,1,1,1,1,1,1,.89,.67,.68,.89,1,1,1,1,.99,.9,.83,.92,1,1,.91,.82,.9,.94,.78,.68,.76,.69,.44,.2,.05,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,.12,.41,.73,.93,.99,.98,.99,1,1,1,1,1,1,1,1,1,.89,.53,.31,.52,.78,.93,1,1,1,1,.98,.81,.62,.7,.92,1,.97,.95,.97,1,1,.97,.91,.9,.96,1,.98,.89,.62,.52,.8,1,1,1,1,1,.96,.85,.66,.43,.49,.81,.99,.93,.72,.42,.32,.56,.73,.55,.23,.04,0,0,0,0,0,0,0,0,0,.08,.41,.81,.96,.98,1,1,1,1,1,1,.83,.59,.69,.93,.97,.92,.9,.91,.97,1,1,1,1,.96,.86,.67,.35,.08,.16,.56,.91,1,.97,.74,.56,.76,.93,.87,.9,.98,1,1,.98,.9,.68,.35,.08,0,0,0,0,.15,.55,.9,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,.96,.94,.97,1,1,1,1,1,1,1,1,1,1,1,1,1,1,.95,.85,.84,.94,1,1,1,1,1,1,.98,.75,.31,.04,.25,.75,.99,.98,.95,.86,.84,.94,1,1,.99,.88,.75,.84,.93,.78,.59,.66,.9,.97,.82,.6,.47,.56,.76,.71,.44,.18,.04,0,0,0,0,0,0,0,0,0,0,.16,.53,.82,.95,.99,.99,.99,1,1,1,1,1,1,.97,.77,.62,.83,1,1,1,1,1,1,.94,.87,.86,.87,.94,1,1,.99,.99,.99,1,.86,.63,.68,.91,.98,.91,.86,.91,.98,1,1,1,1,.99,.84,.69,.82,.97,.99,.99,.96,.81,.47,.13,.14,.47,.77,.94,1,.98,.94,.91,.9,.96,1,1,1,1,1,.96,.92,.96,1,1,1,1,.84,.44,.26,.59,.92,1,1,.99,.96,.96,.98,.81,.45,.21,.27,.65,.95,1,1,.92,.59,.17,.19,.58,.82,.9,.98,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,.93,.85,.93,1,.87,.5,.26,.53,.89,.99,.93,.85,.81,.73,.68,.76,.82,.72,.45,.13,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,.25,.75,.97,.95,.97,.84,.7,.85,1,1,1,1,.99,.99,.99,1,1,1,1,.97,.93,.97,1,1,1,1,1,1,.99,.99,.99,1,1,1,1,1,1,1,1,1,.94,.75,.67,.86,1,.93,.73,.65,.82,.97,1,1,1,1,1,1,1,1,1,1,1,1,.96,.89,.92,.98,1,1,1,.95,.81,.73,.81,.94,.99,.98,.9,.71,.58,.7,.91,.91,.59,.29,.47,.74,.6,.26,.04,0,0,0,0,0,0,0,0,0,0,.22,.69,.97,1,.99,.87,.77,.89,1,1,1,1,1,1,1,1,.98,.95,.98,1,.85,.61,.66,.9,.97,.94,.96,.99,1,.98,.94,.95,.98,.99,1,.98,.74,.29,.16,.44,.74,.93,1,1,1,.99,.89,.74,.75,.9,.99,1,1,.87,.55,.42,.67,.93,.95,.83,.79,.9,.99,1,1,1,1,1,1,1,1,1,1,1,1,1,.96,.93,.96,1,.94,.84,.84,.93,.95,.73,.32,.06,0,.09,.42,.82,.91,.67,.35,.09,0,0,0,0,0,0,0,0,0,0,.14,.53,.89,1,1,1,1,.99,.97,.98,1,1,.99,.79,.53,.66,.92,1,1,1,1,.97,.94,.97,1,1,1,1,1,1,.87,.63,.65,.89,.96,.88,.88,.96,1,.98,.95,.98,.93,.84,.87,.97,1,.93,.87,.92,.97,.97,.98,.95,.85,.8,.83,.88,.66,.35,.51,.87,1,.88,.56,.47,.74,.97,1,1,.96,.92,.96,1,.98,.97,.98,1,.92,.84,.92,1,1,.95,.88,.85,.88,.95,.99,.96,.92,.82,.76,.9,1,1,1,.95,.84,.82,.94,1,1,.91,.58,.16,.15,.56,.9,.99,.98,.95,.85,.79,.82,.88,.95,.92,.75,.45,.13,0,0,.12,.5,.87,1,1,1,1,1,1,1,.98,.9,.81,.84,.95,1,.95,.91,.95,1,1,.91,.76,.71,.79,.92,.99,1,1,1,1,1,1,.99,.98,.99,1,1,1,.95,.83,.83,.94,1,.99,.73,.4,.55,.87,.91,.86,.92,.93,.81,.79,.92,1,1,1,1,1,1,1,1,1,1,1,1,.96,.9,.76,.65,.8,.98,1,1,1,1,1,.93,.88,.94,1,1,.95,.68,.46,.67,.91,.96,.99,.96,.83,.62,.47,.41,.25,.06,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,.24,.73,.99,.99,.98,.93,.74,.66,.86,1,1,1,1,1,1,.98,.96,.95,.94,.97,1,1,1,1,.97,.94,.96,.97,.98,1,1,1,1,1,.98,.8,.54,.59,.87,1,1,.96,.69,.26,.21,.61,.93,1,1,1,1,1,1,1,1,.93,.83,.83,.83,.62,.25,.03,0,0,0,0,0,.03,.3,.78,1,1,1,1,1,1,.96,.83,.76,.9,1,1,1,1,1,1,1,1,.85,.61,.67,.91,1,1,.96,.82,.75,.89,1,1,.91,.59,.37,.61,.92,1,.98,.94,.73,.35,.07,0,0,0,0,0,0,0,0,0,0,0,0,.25,.75,1,1,1,1,.99,1,.99,.99,.99,.99,1,1,1,1,.94,.89,.94,1,1,.96,.71,.28,.23,.62,.92,.99,1,1,1,1,1,.98,.95,.92,.81,.52,.15,0,.16,.54,.82,.91,.91,.9,.94,.99,1,.97,.8,.44,.28,.6,.92,.97,.9,.87,.92,.98,.97,.71,.47,.66,.86,.72,.39,.1,0,.12,.39,.68,.9,1,1,1,1,.93,.8,.75,.84,.96,1,1,1,1,.91,.58,.37,.65,.95,.99,.97,.97,.9,.57,.16,.1,.46,.85,.97,.94,.97,.95,.74,.37,.29,.66,.96,1,1,1,.89,.53,.26,.48,.86,.97,.95,.92,.7,.3,.05,0,0,0,0,0,0,0,0,0,0,0,.23,.71,.98,1,.91,.76,.77,.93,1,1,1,1,.99,.96,.95,.98,1,1,1,1,1,.97,.95,.97,.99,.96,.93,.97,.96,.9,.88,.89,.96,.99,.92,.89,.95,1,1,1,.97,.76,.37,.07,.2,.65,.95,1,1,1,1,1,1,1,1,1,.96,.93,.96,1,1,1,.93,.64,.36,.56,.89,1,1,1,1,1,1,1,1,1,1,1,1,1,.96,.93,.97,1,1,1,1,1,1,1,1,1,.88,.52,.13,0,0,.24,.73,.99,1,1,.98,.96,.96,.97,.99,1,1,.99,.95,.88,.86,.82,.53,.45,.79,1,1,1,1,1,1,1,1,1,1,.96,.72,.51,.69,.94,1,1,1,1,.99,.96,.84,.51,.21,.38,.82,1,1,1,.99,.97,.97,.99,1,1,.97,.84,.69,.73,.92,1,.97,.94,.97,.97,.9,.87,.95,.98,.93,.9,.93,.97,.85,.49,.13,0,0,.19,.62,.86,.69,.35,.09,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,.12,.45,.78,.95,1,1,1,1,.98,.95,.98,1,1,1,1,1,1,1,.99,.95,.93,.92,.91,.96,1,.99,.95,.93,.97,1,.92,.83,.88,.98,.99,.79,.36,.2,.52,.89,1,1,1,1,1,1,1,1,1,.95,.82,.54,.43,.74,.92,.69,.33,.08,0,0,0,0,0,0,0,0,0,.11,.47,.86,1,.99,.85,.74,.87,1,1,1,1,1,.98,.95,.98,1,1,1,1,.99,.97,.99,1,.98,.96,.98,.97,.92,.91,.95,.99,.96,.92,.96,1,.97,.94,.97,.99,.93,.89,.95,1,.85,.54,.34,.47,.79,.97,.9,.81,.91,1,.98,.78,.36,.31,.75,.97,.92,.82,.59,.56,.83,1,1,1,.96,.92,.96,.99,.9,.78,.8,.93,1,.86,.53,.42,.68,.93,1,.95,.83,.76,.83,.92,.95,.96,.96,.96,.96,.95,.96,.93,.91,.91,.91,.96,1,1,1,1,1,1,1,1,1,1,.97,.84,.73,.82,.96,1,.99,.82,.41,.24,.58,.89,.95,.97,1,1,1,1,1,1,.98,.75,.33,.05,.24,.73,.99,1,1,1,.78,.47,.58,.87,.93,.93,.97,.96,.84,.52,.34,.63,.94,1,.97,.91,.81,.75,.82,.95,.97,.72,.46,.63,.92,1,1,1,1,.99,.99,.99,1,1,.9,.56,.15,.12,.48,.86,1,1,.95,.9,.95,.93,.87,.92,.99,.98,.86,.6,.48,.7,.83,.6,.26,.05,0,0,0,0,0,0,0,0,0,0,.13,.47,.8,.96,1,.99,.86,.64,.66,.87,.98,1,1,1,.99,.98,.99,1,.88,.59,.3,.27,.6,.9,.99,1,1,1,1,1,1,1,1,.88,.52,.36,.7,.98,1,.98,.89,.81,.89,.99,1,.95,.69,.38,.46,.8,.96,.97,.99,1,1,1,1,1,1,1,1,.92,.62,.25,.13,.14,.09,.02,0,.17,.59,.92,1,1,1,1,1,1,1,.94,.88,.8,.46,.28,.55,.76,.8,.88,.97,1,.93,.64,.23,.17,.55,.9,1,.99,.99,1,.97,.91,.92,.98,1,1,1,.82,.55,.64,.91,.98,.97,.99,1,.96,.92,.96,1,1,1,1,.99,1,1,1,.88,.59,.46,.62,.82,.95,.99,.96,.9,.83,.83,.92,.97,.88,.7,.65,.8,.95,1,1,.97,.91,.81,.74,.83,.96,1,1,.95,.9,.92,.95,.95,.86,.75,.82,.96,.97,.92,.92,.87,.67,.59,.8,.93,.78,.47,.14,.01,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,.25,.75,.98,.97,.96,.8,.67,.85,1,1,1,.88,.66,.65,.84,.97,1,1,.99,.96,.83,.58,.57,.85,1,.93,.81,.84,.94,.88,.83,.92,.92,.59,.3,.48,.8,.86,.8,.75,.59,.3,.17,.45,.84,.97,.97,.92,.72,.48,.32,.14,.02,0,0,0,0,0,0,0,0,0,0,.11,.46,.86,1,1,1,1,1,1,1,.97,.94,.97,1,1,1,1,1,.81,.56,.69,.94,1,1,.98,.97,.98,1,1,.96,.93,.96,1,.99,.98,.98,.94,.86,.87,.96,1,1,.98,.85,.76,.86,.98,1,1,1,1,1,1,1,.98,.94,.94,.98,.96,.93,.96,.95,.75,.46,.19,.04,0,0,.07,.37,.8,.99,1,.9,.71,.72,.91,1,1,1,1,1,.88,.54,.28,.46,.8,.97,.96,.94,.97,.98,.96,.98,1,1,1,1,1,1,1,1,1,1,1,.97,.91,.91,.97,1,1,1,1,1,1,1,1,1,1,1,.98,.85,.74,.83,.97,1,1,1,1,1,.96,.89,.67,.42,.55,.85,.98,1,.94,.82,.68,.57,.51,.34,.11,.24,.7,.97,.92,.83,.82,.82,.88,.94,.86,.62,.26,.04,0,0,0,0,0,0,0,0,0,0,0,0,.25,.75,1,.94,.79,.77,.92,1,1,1,1,.99,.98,.99,1,1,1,1,.97,.95,.97,.99,.95,.93,.97,.97,.9,.91,.97,1,.97,.93,.97,1,1,1,.98,.83,.46,.21,.45,.85,1,1,1,1,1,.99,.92,.87,.94,1,.99,.99,.99,1,.94,.81,.69,.69,.88,1,1,1,1,1,1,1,1,1,1,1,.83,.45,.38,.77,1,1,1,.9,.67,.61,.77,.87,.88,.9,.88,.62,.28,.28,.63,.92,1,.82,.43,.38,.78,1,1,1,1,1,1,1,1,1,1,.99,.96,.9,.86,.89,.97,1,1,1,.97,.93,.94,.98,1,1,.96,.9,.91,.97,.98,.93,.79,.68,.74,.72,.48,.22,.06,0,0,0,0,0,0,0,0,0,0,0,.25,.75,1,1,1,1,1,.96,.81,.74,.89,.99,.98,.96,.94,.97,1,.98,.94,.92,.92,.93,.85,.85,.93,.97,.98,1,1,1,1,1,1,1,1,1,1,1,1,1,.99,.98,.91,.73,.71,.89,1,1,1,1,.98,.77,.34,.05,0,.2,.64,.94,.99,.96,.83,.77,.9,1,.98,.92,.9,.8,.43,.09,.15,.54,.88,.97,.94,.93,.88,.82,.86,.88,.64,.24,.03,0,0,0,0,0,0,0,0,0,0,0,0,0,.14,.47,.79,.95,1,1,1,1,1,.98,.96,.98,1,1,.94,.85,.88,.9,.7,.58,.82,1,1,1,1,1,1,.96,.7,.4,.5,.79,.95,1,.99,.98,.99,.97,.88,.75,.76,.91,.89,.65,.59,.72,.83,.94,.98,.95,.98,.97,.91,.83,.64,.33,.08,.21,.66,.96,1,.99,.78,.58,.77,.98,1,.95,.89,.95,.94,.89,.94,1,1,1,1,1,1,1,1,.96,.77,.41,.1,0,0,0,0,.14,.53,.89,1,1,1,1,1,1,1,.97,.71,.27,.21,.62,.94,.96,.79,.68,.85,.99,1,.8,.51,.61,.9,1,.97,.94,.96,.99,1,.98,.87,.72,.74,.88,.97,1,1,.99,.93,.81,.55,.2,.02,0,0,0,0,0,0,0,0,0,0,.25,.75,1,1,1,1,1,1,.99,.97,.97,.99,1,1,1,1,1,1,1,1,1,1,1,.97,.8,.6,.7,.92,1,1,1,1,.98,.93,.92,.97,1,1,1,.97,.94,.97,.97,.9,.87,.91,.94,.84,.69,.71,.9,.94,.63,.31,.49,.8,.67,.28,.05,0,0,0,0,0,0,0,0,0,0,0,.25,.75,1,1,1,1,.99,.96,.96,.99,1,.97,.75,.49,.59,.89,1,1,.99,.97,.99,1,.82,.64,.81,.96,.9,.89,.86,.65,.57,.82,1,1,1,1,1,1,1,1,.97,.92,.93,.97,.98,.99,1,.97,.91,.93,.98,.98,.92,.66,.26,.29,.75,1,.91,.64,.3,.14,.38,.78,.92,.91,.88,.93,.96,.76,.42,.39,.67,.9,.98,.96,.69,.26,.13,.47,.86,.95,.87,.82,.61,.48,.73,.92,.93,.91,.78,.51,.22,.05,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]};var xn=(i,e=.6,t={})=>new Ee({color:i,roughness:e,metalness:0,...t}),Zi=xn(13802098,.5,{emissive:4200972,emissiveIntensity:.06}),Gv=xn(12880484,.55),ar=xn(1708816,.5),ec=xn(2902652,.6),Cf=xn(2309222,.6),If=xn(15987178,.8),Bh=xn(13021319,.8),Pf=xn(16185075,.45),kv=xn(9277331,.7),jS=xn(2759186,.4),zh=xn(16777215,.2),Vv=xn(4860952,.25),Wv=xn(722951,.3),Xv=xn(8010542,.5),qv=xn(3872273,.7),Yv=new Ee({color:14725194,metalness:1,roughness:.25}),Zv=xn(1382171,.3);function rt(i,e,t=[0,0,0],n=[1,1,1],s=[0,0,0]){let r=new ie(i,e);return r.position.set(...t),r.scale.set(...n),r.rotation.set(...s),r.castShadow=!0,r.receiveShadow=!0,r}var An=(i,e=32,t=24)=>new Pt(i,e,t),lr=(i,e)=>new Mn(i,e,8,16),tc=class{constructor(){let e=this.object=new Ve;this.rig={};let t=this.rig.hips=new Ve;t.position.y=.86,e.add(t),t.add(rt(An(.16),Bh,[0,.02,0],[1.05,.7,.75]));let n=this.rig.chest=new Ve;n.position.y=.08,t.add(n);let s=[[.001,0],[.165,0],[.178,.07],[.182,.18],[.2,.3],[.212,.38],[.2,.43],[.16,.475],[.09,.5],[.001,.505]].map(([o,a])=>new ee(o,a));n.add(rt(new jr(s,36),ec,[0,0,0],[1,1,.68])),n.add(rt(new Ue(.42,.42,.4,24,1,!0,-.15,.3),If,[0,.28,-.268],[1,1,1]));for(let o of[-1,1])n.add(rt(new Xe(.035,.36,.02),Cf,[o*.075,.27,.132],[1,1,1],[.08,o*.35,0]));n.add(rt(new oi(.068,.018,8,24),Cf,[0,.49,-.005],[1.1,1,.85],[Math.PI/2+.25,0,0])),n.add(rt(new bi(.011,16),Yv,[-.115,.37,.124],[1,1,1],[0,-.55,0])),n.add(rt(new Ue(.06,.066,.1,16),Zi,[0,.52,.005]));let r=this.rig.head=new Ve;r.position.y=.535,r.scale.setScalar(1.22),n.add(r),r.add(rt(An(.142),Zi,[0,.15,0],[.92,1.04,.97])),r.add(rt(An(.105),Zi,[0,.095,.018],[1,.88,.92])),r.add(rt(An(.045),Zi,[0,.05,.075],[1.1,.7,.8]));for(let o of[-1,1])r.add(rt(An(.03,16,12),Zi,[o*.128,.135,-.01],[.42,1,.75]));r.add(rt(new Pt(.148,36,20,0,Math.PI*2,0,Math.PI*.43),ar,[0,.166,-.02],[.97,1,1],[-.32,0,0])),r.add(rt(new Pt(.146,36,12,Math.PI*.85,Math.PI*1.3,Math.PI*.26,Math.PI*.17),ar,[0,.152,-.006],[.965,1,1])),r.add(rt(An(.09,28,18),ar,[.018,.268,.055],[1.28,.52,.9],[.42,.1,-.2])),r.add(rt(An(.07,24,16),ar,[-.05,.262,.035],[1.1,.48,1],[.25,0,.25])),r.add(rt(An(.05,20,14),ar,[.07,.25,.085],[1.1,.5,.8],[.6,0,-.5])),this.lids=[];for(let o of[-1,1]){let a=new Ve;a.position.set(o*.05,.148,.112),r.add(a),a.add(rt(An(.028,24,18),zh,[0,0,0],[1,.9,.55])),a.add(rt(new bi(.0175,28),Vv,[0,-.002,.0156])),a.add(rt(new bi(.009,24),Wv,[0,-.002,.0158])),a.add(rt(new bi(.0042,12),zh,[.006,.005,.016])),a.add(rt(new bi(.002,8),zh,[-.005,-.006,.016]));let l=rt(new Pt(.0295,24,12,0,Math.PI*2,0,Math.PI/2),Gv,[0,0,0],[1.03,.2,.6]);a.add(l),this.lids.push(l),r.add(rt(lr(.0095,.042),ar,[o*.052,.193,.118],[1,1,.6],[0,0,Math.PI/2+o*.16]))}r.add(rt(An(.022,16,12),Zi,[0,.112,.138],[.95,.9,1])),this.mouth=rt(An(.017,16,12),qv,[0,.064,.118],[1.15,.05,.4]),r.add(this.mouth),r.add(rt(new oi(.022,.0032,6,24,Math.PI*.7),Xv,[0,.072,.121],[1,.55,1],[0,0,Math.PI*1.15])),this.arms=[];for(let o of[-1,1]){let a=new Ve;a.position.set(o*.205,.405,0),n.add(a),a.add(rt(An(.056),ec,[0,-.01,0],[1,.9,.9])),a.add(rt(lr(.056,.22),ec,[0,-.14,0]));let l=new Ve;l.position.y=-.29,a.add(l),l.add(rt(lr(.05,.2),ec,[0,-.12,0])),l.add(rt(new Ue(.052,.052,.03,16),If,[0,-.235,0]));let c=new Ve;c.position.y=-.27,l.add(c),c.add(rt(An(.045,20,16),Zi,[0,-.035,0],[.75,1.05,.55])),c.add(rt(lr(.015,.03),Zi,[o*-.03,-.03,.02],[1,1,1],[0,0,o*.6])),this.arms.push({sh:a,el:l,hand:c,s:o})}this.phone=rt(new Xe(.075,.15,.009),Zv,[0,-.08,.035]),this.phone.visible=!1,this.arms[1].hand.add(this.phone),this.legs=[];for(let o of[-1,1]){let a=new Ve;a.position.set(o*.095,-.02,0),t.add(a),a.add(rt(lr(.08,.3),Bh,[0,-.19,0]));let l=new Ve;l.position.y=-.4,a.add(l),l.add(rt(lr(.07,.29),Bh,[0,-.18,0]));let c=new Ve;c.position.y=-.39,l.add(c),c.add(rt(new Xe(.11,.07,.26),Pf,[0,-.02,.045])),c.add(rt(new Xe(.115,.025,.27),kv,[0,-.058,.045])),c.add(rt(An(.055,16,12),Pf,[0,-.02,.16],[1,.62,.8])),this.legs.push({hip:a,kn:l,ft:c,s:o})}e.visible=!1}update(e,t){let n=e.guide;if(this.object.visible=!!n,!n)return;let s=e.t,r=this.rig,o=n.action==="walk",a=n.speed??1.2,l=s*a*4.6+(n.phase||0),[c,h,u]=n.pos;this.object.position.set(c,h,u),this.object.rotation.y=n.yaw||0;let d=Math.sin(s*2.1)*.006;r.hips.position.y=.86+(o?Math.abs(Math.cos(l))*.035-.02:0),r.hips.rotation.y=o?Math.sin(l)*.08:Math.sin(s*.7)*.02,r.chest.rotation.y=o?-Math.sin(l)*.12:0,r.chest.rotation.x=.03+d,r.chest.scale.setScalar(1+d*.6),this.legs.forEach(({hip:b,kn:x,ft:E,s:P})=>{if(o){let A=Math.sin(l+(P>0?Math.PI:0));b.rotation.x=-A*.42,x.rotation.x=Math.max(0,Math.sin(l+(P>0?Math.PI:0)+1.3))*.75,E.rotation.x=-.15*A}else b.rotation.x=P>0?-.04:.02,x.rotation.x=.03,E.rotation.x=0,b.rotation.z=P*.035});let[p,f]=this.arms,_=(b,x,E,P,A=0,I=0)=>{b.sh.rotation.set(x,0,E),b.el.rotation.set(P,0,A),b.hand.rotation.set(0,0,I)},m=o?Math.sin(l)*.45:0;_(p,m,-.12+Math.sin(s*1.3)*.015,-.25-(o?Math.max(0,m)*.4:.05)),_(f,-m,.12-Math.sin(s*1.3)*.015,-.25-(o?Math.max(0,-m)*.4:.05)),this.phone.visible=!1;let g=n.blend??1;if(n.action==="wave"){let b=st(n.t0??0,(n.t0??0)+.45,s)*g;f.sh.rotation.set(-.25*b,0,.12+2.55*b),f.el.rotation.set(0,0,b*(.35+Math.sin(s*9)*.38))}else if(n.action==="point"){let b=st(n.t0??0,(n.t0??0)+.5,s)*g;f.sh.rotation.set(-1.25*b,0,.12+.35*b),f.el.rotation.set(-.15*b,0,0)}else if(n.action==="present"){let b=(.6+.4*Math.sin(s*1.6))*g;for(let x of this.arms)x.sh.rotation.set(-.55*b,0,x.s*(.12+.45*b)),x.el.rotation.set(-.6*b,0,0)}else n.action==="selfie"&&(f.sh.rotation.set(-1.45,0,.55),f.el.rotation.set(-.35,0,.25),f.hand.rotation.set(0,Math.PI,0),this.phone.visible=!0,p.sh.rotation.set(0,0,-.25),p.el.rotation.set(-.3,0,0));let v=n.lookAt||(t?[t.position.x,t.position.y,t.position.z]:null);if(v){let b=new C;r.head.getWorldPosition(b);let x=new C(v[0]-b.x,v[1]-b.y-.12,v[2]-b.z),E=Math.atan2(x.x,x.z)-(n.yaw||0)-r.hips.rotation.y-r.chest.rotation.y,P=Math.atan2(Math.sin(E),Math.cos(E));r.head.rotation.y=Sn(P,-.9,.9),r.head.rotation.x=Sn(-Math.atan2(x.y,Math.hypot(x.x,x.z)),-.35,.35)}n.action==="selfie"?r.head.rotation.z=.12:r.head.rotation.z=Math.sin(s*.9)*.03;let M=(s*.3+(n.phase||0))%1,y=M<.045?Math.sin(M/.045*Math.PI):0;for(let b of this.lids)b.scale.y=.2+.8*y,b.rotation.x=-.35*(1-y);let w=n.talk?Ql.v[Math.min(Ql.v.length-1,Math.max(0,Math.round(s*Ql.fps)))]:0;this.mouth.scale.y=.05+.45*w,r.head.rotation.x+=w*.05}};var $n={scenes:[0,12,30,45,60,77,92,107,120],title1:9.85,years:{"1830":12.104,"1862":17.175,"1961":20.772,"1997":22.249,"1998":26.669},newCapital:30.512,fastGrowth:33.137,pop2017:48.762,popCount:52.262,popFinal:58.875,grp:72.175,budget:82.406,budgetFlow:85.68,tourCuts:[94.098,95.301,96.262,97.547,99.66],tourists:101.685,foreign:104.693,title8:112.725,finalChord:115.062};var Ht=i=>new C(...i),Jt=(i,e,t=gf)=>new ri(i.map(s=>Ht(s)),!1,"centripetal").getPoint(Sn(t(Sn(e))));var Ji=(i,e,t,n,s,r)=>{let o=Ci.degToRad(pt(n,s,r));return Ht([i[0]+Math.cos(o)*e,t,i[2]+Math.sin(o)*e])},[Vt,Wt]=bt.fortress,[Hh,Gh]=bt.baiterek,oE=$n.landmarkCuts,mt={predawn:{fogMul:.9,sunElev:-3.2,sunAzim:112,turbidity:3,rayleigh:2.6,mie:.003,mieG:.75,sunIntensity:0,hemiIntensity:1,hemiSky:[.4,.5,.8],hemiGround:[.14,.13,.15],envIntensity:1.2,fogColor:[.12,.16,.26],fogDensity:9e-5,night:.25,cityGlow:.8,clouds:.25,skyGain:7},sunrise:{sunElev:3.5,sunAzim:118,turbidity:4,rayleigh:2.4,mie:.004,mieG:.76,sunIntensity:3,sunColor:[1,.62,.32],hemiIntensity:.45,hemiSky:[.55,.6,.85],hemiGround:[.3,.22,.16],envIntensity:.8,fogColor:[.62,.52,.48],fogDensity:65e-6,night:.12,cityGlow:.2,clouds:.3},history:{sunElev:17,sunAzim:235,turbidity:5,rayleigh:1.2,mie:.005,mieG:.8,sunIntensity:3.4,sunColor:[1,.86,.66],hemiIntensity:.6,hemiSky:[.7,.72,.8],hemiGround:[.45,.38,.28],envIntensity:.6,fogColor:[.74,.7,.62],fogDensity:11e-5,clouds:.45,cloudDensity:.55},day:{sunElev:38,sunAzim:200,turbidity:2.6,rayleigh:1.2,mie:.003,mieG:.78,sunIntensity:3.4,sunColor:[1,.95,.88],hemiIntensity:.65,envIntensity:1,fogColor:[.66,.76,.9],fogDensity:45e-6,clouds:.38},golden:{sunElev:8,sunAzim:255,turbidity:3.5,rayleigh:1.8,mie:.004,mieG:.76,sunIntensity:3.6,sunColor:[1,.72,.42],hemiIntensity:.5,hemiSky:[.6,.66,.9],hemiGround:[.4,.3,.2],envIntensity:.9,fogColor:[.85,.7,.55],fogDensity:55e-6,clouds:.32},blueHour:{sunElev:-4.5,sunAzim:260,turbidity:3,rayleigh:2.5,mie:.004,sunIntensity:0,hemiIntensity:.22,hemiSky:[.3,.42,.75],hemiGround:[.08,.08,.1],envIntensity:.7,fogColor:[.07,.11,.2],fogDensity:6e-5,night:.85,cityGlow:1,clouds:.2,skyGain:1.7},night:{sunElev:-12,sunAzim:260,turbidity:2,rayleigh:2,sunIntensity:0,hemiIntensity:.12,hemiSky:[.25,.32,.6],hemiGround:[.05,.05,.06],envIntensity:.5,fogColor:[.03,.05,.1],fogDensity:55e-6,night:1,cityGlow:1,clouds:.1,skyGain:1},map:{sunElev:-8,sunAzim:200,sunIntensity:0,hemiIntensity:.9,hemiSky:[.5,.65,1],hemiGround:[.1,.12,.2],envIntensity:.6,fogColor:[.02,.04,.09],fogDensity:15e-6,night:1,cityGlow:.4,clouds:0,skyGain:.5},finale:{sunElev:4.5,sunAzim:93,turbidity:4,rayleigh:2.4,mie:.0045,mieG:.78,sunIntensity:3.4,sunColor:[1,.66,.36],hemiIntensity:.5,hemiSky:[.6,.62,.85],hemiGround:[.32,.24,.18],envIntensity:.9,fogColor:[.75,.58,.48],fogDensity:6e-5,night:.05,clouds:.36}};mt.morning={...mt.sunrise,fogMul:.7,sunColor:[1,.78,.55],sunElev:7,sunAzim:62,sunIntensity:3.2,hemiIntensity:.85,envIntensity:1,clouds:.45,cloudDensity:.4};mt.sunny={...mt.day,sunElev:30,sunAzim:215,hemiIntensity:.9,envIntensity:1.1,clouds:.5,cloudDensity:.4};mt.warm={...mt.golden,sunElev:16,sunAzim:238,hemiIntensity:.85,envIntensity:1,clouds:.45};var ct={cold:{exposure:.85,temp:-.55,saturation:.85,contrast:1.12,vignette:.85,bloom:.8,bloomThreshold:1.2,shadowTint:[0,.12,.35],highTint:[.1,.1,.2]},warm:{temp:.35,saturation:1.1,contrast:1.08,vignette:.6,bloom:.75,bloomThreshold:2},archive:{temp:.25,saturation:.55,contrast:1.12,sepia:.62,grain:.075,vignette:.95,lift:.02,chroma:.012,bloom:.35},soviet:{temp:-.1,saturation:.6,contrast:1.08,sepia:.22,grain:.06,vignette:.8,lift:.025,bloom:.35},modern:{temp:.12,saturation:1.08,contrast:1.07,vignette:.6,bloom:.5},night:{exposure:.75,temp:-.15,saturation:1.15,contrast:1.12,vignette:.7,bloom:.55,bloomThreshold:.9,bloomRadius:.5,shadowTint:[0,.18,.35],highTint:[.45,.25,0]},map:{temp:-.2,saturation:1.1,contrast:1.1,vignette:.75,bloom:.6,bloomThreshold:.8,grain:.02},vivid:{temp:.08,saturation:1.14,contrast:1.08,vignette:.5,bloom:.45},golden:{temp:.45,saturation:1.12,contrast:1.07,vignette:.6,bloom:.8,bloomThreshold:2,highTint:[.45,.25,0]}},nc={saturation:1.2,contrast:1,temp:.22,vignette:.4,grain:.012,chroma:.003,bloom:.55,bloomThreshold:1.8,lift:.015,shadowTint:[.05,.12,.3],highTint:[.35,.22,.05]};ct.story=nc;ct.storyWarm={...nc,temp:.4,saturation:1.22};ct.storyDawn={...nc,temp:.18,saturation:1.12,bloom:.5,bloomThreshold:2.2};ct.vintage={...nc,saturation:.82,temp:.4,sepia:.22,grain:.03,vignette:.7,lift:.025};ct.storyNight={...ct.night,saturation:1.2,grain:.012,vignette:.45,bloom:.6,bloomThreshold:1.3};ct.storyMap={...ct.map,grain:.01};var Kv={...Fh,...Mo},Pi=(i,e,t)=>{let n={...i};for(let s of Object.keys(e)){let r=i[s]??Kv[s]??e[s];Array.isArray(e[s])?n[s]=r.map((o,a)=>pt(o,e[s][a],t)):typeof e[s]=="number"&&(n[s]=pt(r,e[s],t))}return n},Lf={s1:[[0,1830],[5.6,1830],[7.9,2026]],s2:[[0,1830],[16.9,1838],[17.3,1862],[20.4,1905],[20.9,1961],[22,1992],[22.4,1997],[26.6,1998.1],[31,2000.2]],s3:[[0,2000.2],[30.4,2000.4],[33.8,2002.2],[39,2014],[43,2025.5],[50,2026]]},Of=(i,e)=>Lf[e]?xf(Lf[e],i):2026;var Df=(i,e)=>Math.atan2(e[0]-i[0],e[2]-i[2]),[kh,Vh]=bt.khanShatyr,[Wh,Xh]=bt.opera,[qh,Yh]=bt.mosque,[Bf,zf]=bt.viewpoint,ui=$n.tourCuts,Nf=[-238,.3,1209.5],Hn=[Vt-30,0,Wt+215],_s=[150,.7,wn(150)+93],Li=[Bf+12,45.2,zf],Zh=i=>-470+1.25*(i-44.5),Jh=i=>118+1.3*(i-59.5),Uf=[{id:"s1a",t0:0,t1:5,look:i=>({...mt.morning,sunElev:pt(4.5,6.5,i)}),grade:()=>ct.storyDawn,state:{grass:!0},shadow:[-7250,700,220],near:.2,cam:i=>({pos:Jt([[-7420,2.3,702],[-7330,2.9,699],[-7240,4.4,696]],i,e=>e),target:Jt([[-7300,-6,699],[-7200,-4.5,697],[-7100,-2,694]],i,e=>e),fov:52})},{id:"s1b",t0:4.4,t1:8.8,dissolve:.6,look:i=>({...mt.morning,sunElev:pt(9,13,i)}),grade:()=>ct.storyDawn,state:{cranes:!0},shadow:i=>[pt(Vt,-300,i),pt(Wt,600,i),pt(700,2400,i)],cam:i=>({pos:Jt([[Vt-330,110,Wt-300],[Vt-260,190,Wt-260],[Vt-180,300,Wt-220]],i),target:Jt([[Vt+120,0,Wt+260],[Vt+420,10,Wt+1100],[0,40,1250]],i),fov:46})},{id:"s1c",t0:8.2,t1:12.6,dissolve:.5,look:()=>mt.warm,grade:()=>ct.storyWarm,shadow:[-230,1210,120],near:.2,state:(i,e)=>({guide:{pos:Nf,yaw:Df(Nf,[-262,0,1213]),action:e>$n.title1-.7?"wave":"idle",t0:$n.title1-.7,talk:!0}}),cam:i=>({pos:Jt([[-242.7,1.5,1211.2],[-242.1,1.48,1211]],i,e=>e),target:Jt([[-200,17,1203.5],[-200,18,1203.5]],i,e=>e),fov:46})},{id:"s2a",t0:11.5,t1:17.3,look:()=>({...mt.history,sunElev:24,sunAzim:200,hemiIntensity:.8}),grade:()=>ct.vintage,shadow:[Vt-60,Wt+120,260],near:.2,state:(i,e)=>({guide:{pos:Hn,yaw:Df(Hn,[Hn[0]+.6,0,Hn[2]+5]),action:"present",talk:!0,phase:1.3}}),cam:i=>({pos:Jt([[Hn[0]+.5,1.55,Hn[2]+5],[Hn[0]+1.1,1.65,Hn[2]+4.4]],i,e=>e),target:Jt([[Hn[0]-6,9,Hn[2]-110],[Hn[0]-4,10,Hn[2]-110]],i,e=>e),fov:46})},{id:"s2b",t0:16.8,t1:20.8,dissolve:.5,look:()=>mt.history,grade:()=>ct.vintage,shadow:[Vt+100,Wt-100,700],cam:i=>({pos:Jt([[Vt-380,70,Wt+300],[Vt-100,95,Wt+260],[Vt+220,120,Wt+200]],i),target:Jt([[Vt,0,Wt],[Vt+100,0,Wt-100],[Vt+250,0,Wt-200]],i),fov:42})},{id:"s2c",t0:20.2,t1:30.6,dissolve:.6,look:i=>({...Pi(mt.history,mt.golden,st(.25,.9,i)),sunElev:pt(24,30,i),sunAzim:240}),grade:(i,e)=>Pi(ct.vintage,ct.story,st(21,27,e)),shadow:i=>[pt(Vt,0,i),pt(Wt,800,i),pt(900,2600,i)],cam:i=>({pos:Jt([[Vt+180,140,Wt-640],[Vt+360,300,Wt-1100],[Vt+560,560,Wt-1650]],i),target:Jt([[Vt,0,Wt],[Vt+260,0,Wt+600],[0,40,1300]],i),fov:pt(40,44,i)})},{id:"s3a",t0:29.4,t1:34.6,look:(i,e)=>({...mt.sunny,cloudTime:e*600}),grade:()=>ct.story,shadow:[0,1200,220],state:{cranes:!0},cam:i=>({pos:Ji([0,0,1200],pt(170,140,i),pt(30,55,i),200,232,i),target:Ht([0,pt(40,62,i),1200]),fov:46})},{id:"s3b",t0:34,t1:39.6,dissolve:.6,look:(i,e)=>({...mt.sunny,sunElev:pt(28,16,i),sunAzim:pt(215,245,i),cloudTime:e*900}),grade:()=>ct.story,state:{cranes:!0,carMode:"trails"},shadow:[-700,1200,1300],cam:i=>({pos:Jt([[-1950,170,1300],[-1250,150,1260],[-560,125,1230]],i,e=>e),target:Jt([[-900,40,1200],[-150,50,1200],[600,60,1200]],i,e=>e),fov:46})},{id:"s3c",t0:39,t1:45.6,dissolve:.6,look:(i,e)=>({...mt.golden,sunElev:pt(10,4.5,i),sunAzim:262,cloudTime:e*400}),grade:i=>Pi(ct.storyWarm,ct.storyNight,st(.8,1,i)*.5),state:{cranes:!0},shadow:[0,1e3,2800],cam:i=>({pos:Jt([[600,80,2700],[700,300,3300],[800,640,3950]],i),target:Jt([[0,110,1300],[0,80,1100],[0,40,900]],i),fov:42})},{id:"s4a",t0:44.5,t1:52.4,look:()=>({...mt.warm,sunElev:18,sunAzim:235}),grade:()=>ct.storyWarm,near:.2,shadow:(i,e)=>[Zh(e),1215,90],state:(i,e)=>({crowd:"family",guide:{pos:[Zh(e),.3,1218],yaw:Math.PI/2,action:"walk",speed:1.25,talk:!0}}),cam:(i,e)=>{let t=Zh(e);return{pos:Ht([t+1.6,1.45,1218+4.6]),target:Ht([t+.25,1.15,1218]),fov:40}}},{id:"s4b",t0:51.8,t1:60.6,dissolve:.7,look:i=>Pi(mt.golden,mt.map,st(0,.15,i)),grade:i=>Pi(ct.storyWarm,ct.storyMap,st(0,.15,i)),state:(i,e)=>({map:st(52,53.2,e),pop:$v(e),cars:!1}),shadow:[0,600,4e3],cam:i=>({pos:Ji([300,0,900],4300,pt(3900,3300,i),pt(102,80,yo(i)),pt(102,80,yo(i)),0),target:Ht([200,0,500]),fov:46})},{id:"s5a",t0:59.5,t1:64.7,look:()=>({...mt.warm,sunElev:22,sunAzim:225}),grade:()=>ct.storyWarm,near:.2,shadow:(i,e)=>[Jh(e),1868,160],state:(i,e)=>({guide:{pos:[Jh(e),.3,1868],yaw:Math.PI/2,action:"walk",speed:1.3,talk:!0,phase:2}}),cam:(i,e)=>{let t=Jh(e);return{pos:Ht([t+5.2,.85,1868+2.6]),target:Ht([t-.6,3.2,1866.6]),fov:52}}},{id:"s5b",t0:64.1,t1:69.6,dissolve:.6,look:()=>({...mt.sunny,sunElev:24,sunAzim:230}),grade:()=>ct.story,state:{cranes:!0},shadow:[-1600,3e3,1600],cam:i=>({pos:Ji([-1600,0,3e3],1100,pt(420,360,i),70,95,i),target:Ht([-1600,20,3e3]),fov:44})},{id:"s5c",t0:69,t1:77.6,dissolve:.6,look:()=>({...mt.golden,sunElev:10,sunAzim:250}),grade:()=>ct.storyWarm,shadow:[250,1850,900],cam:i=>({pos:Ji([250,0,1850],560,pt(240,300,i),120,165,i),target:Ht([250,110,1850]),fov:46})},{id:"s6a",t0:76.5,t1:81.6,look:()=>mt.warm,grade:()=>ct.storyWarm,shadow:[-300,1250,1100],cam:i=>({pos:Jt([[-950,260,1650],[-750,245,1620],[-520,235,1590]],i,e=>e),target:Ht([0,0,1200]),fov:44})},{id:"s6b",t0:81,t1:86.6,dissolve:.6,look:()=>({...mt.golden,sunElev:12}),grade:()=>ct.storyWarm,shadow:(i,e)=>[Ff(e),2060,300],cam:(i,e)=>{let t=Ff(e);return{pos:Ht([t+60-30*i,18+4*i,2100]),target:Ht([t-25,14,2058]),fov:48}}},{id:"s6c",t0:86,t1:92.6,dissolve:.6,look:()=>({...mt.warm,sunElev:12,sunAzim:250}),grade:()=>ct.storyWarm,shadow:[1700,800,1e3],cam:i=>({pos:Jt([[1250,190,250],[1380,175,330],[1500,165,420]],i,e=>e),target:Ht([1850,0,950]),fov:44})},{id:"s7a",t0:91.5,t1:ui[0],look:()=>mt.sunny,grade:()=>ct.story,shadow:[Hh,Gh,250],near:.5,cam:i=>({pos:Ji([Hh,0,Gh],78,3.5,150,175,i),target:Ht([Hh,pt(55,84,Dh(i)),Gh]),fov:54})},{id:"s7b",t0:ui[0],t1:ui[1],look:()=>({...mt.sunny,sunAzim:215}),grade:()=>ct.story,shadow:[kh,Vh,350],cam:i=>({pos:Ji([kh,0,Vh],330,30+12*i,30,46,i),target:Ht([kh+10,70,Vh]),fov:46})},{id:"s7c",t0:ui[1],t1:ui[2],look:()=>({...mt.warm,sunAzim:255,sunElev:20}),grade:()=>ct.storyWarm,shadow:[Wh-40,Xh,260],cam:i=>({pos:Ht([Wh-175+18*i,16+3*i,Xh-55+12*i]),target:Ht([Wh-40,24,Xh]),fov:44})},{id:"s7d",t0:ui[2],t1:ui[3],look:()=>({...mt.sunny,sunAzim:200}),grade:()=>ct.story,shadow:[qh,Yh,260],cam:i=>({pos:Ji([qh,0,Yh],210,26+6*i,100,115,i),target:Ht([qh,38,Yh]),fov:44})},{id:"s7e",t0:ui[3],t1:ui[4],look:()=>({...mt.sunny,sunAzim:165,sunElev:34}),grade:()=>ct.story,near:.2,shadow:[_s[0],_s[2],120],state:{crowd:"river",guide:{pos:_s,yaw:.25,action:"selfie",talk:!1,phase:.6}},cam:i=>({pos:Ht([_s[0]-.7-.25*i,1.75,_s[2]+3.4-.25*i]),target:Ht([_s[0]-.45,1.95,_s[2]-4]),fov:46})},{id:"s7f",t0:ui[4],t1:107.6,look:i=>({...Pi(mt.golden,mt.blueHour,st(.55,1,i)*.8),sunElev:pt(7,2.5,i),sunAzim:262,cityGlow:.8}),grade:i=>Pi(ct.storyWarm,ct.storyNight,st(.5,1,i)),shadow:[400,0,2e3],cam:i=>({pos:Ji([500,0,300],1500,pt(330,420,i),140,115,i),target:Ht([300,60,500]),fov:42})},{id:"s8a",t0:106.5,t1:120.5,look:(i,e)=>({...Pi(mt.golden,mt.night,st(110,117.5,e)),sunElev:pt(7,-7,st(107,117.5,e)),sunAzim:264,cityGlow:1}),grade:(i,e)=>Pi(ct.storyWarm,ct.storyNight,st(110,117,e)),near:.15,shadow:[Bf+12,zf,70],state:(i,e)=>({guide:{pos:Li,yaw:Math.PI/2,action:e<112?"present":"idle",talk:!0,lookAt:e<109.5?null:[-1500,70,1200],phase:.4}}),cam:i=>({pos:Jt([[Li[0]-2.9,47.2,Li[2]+.35],[Li[0]-8.5,49,Li[2]+.8],[Li[0]-26,58,Li[2]+2.2]],i,yo),target:Jt([[Li[0]+40,46.4,Li[2]+3.5],[-1500,47,1210],[-1e3,38,1205]],i,yo),fov:pt(42,46,i)})}];function $v(i){return i<$n.pop2017?.85*st(52,$n.pop2017+3.5,i):i<$n.popCount?1:pt(1,1.700385,Dh(Sn((i-$n.popCount)/($n.popFinal-$n.popCount))))}function Ff(i){return-3e3+i*22%6200+25}var Hf={family:{x:-430,z:1212,w:240,d:60,n:190,dir:[1,0],speed:1.1,kids:.3,photo:.04},river:{x:150,z:wn(150)+92,w:260,d:14,n:120,dir:[1,.12],speed:1.1,photo:.3}};function Gf(i,e){let t=e?Uf.filter(u=>u.id.startsWith(e)):Uf,n=t.filter(u=>i>=u.t0&&i<u.t1);n.length||n.push(i<t[0].t0?t[0]:t[t.length-1]);let s=u=>{let d=Sn((i-u.t0)/(u.t1-u.t0)),p=u.cam(d,i),f=typeof u.state=="function"?u.state(d,i):u.state||{},_=typeof u.shadow=="function"?u.shadow(d,i):u.shadow,m={...u.look(d,i)};return _&&(m.shadowCenter=[_[0],_[1]],m.shadowSize=_[2]),{id:u.id,pos:p.pos,target:p.target,fov:p.fov,near:u.near,look:m,grade:u.grade(d,i),state:f}};if(n.length===1){let u=s(n[0]);return{t:i,shots:[u],mix:0,grade:u.grade}}n.sort((u,d)=>u.t0-d.t0);let[r,o]=n.slice(-2),a=o.dissolve||0,l=a?st(o.t0,o.t0+a,i):1;if(l>=1){let u=s(o);return{t:i,shots:[u],mix:0,grade:u.grade}}let c=s(r),h=s(o);return{t:i,shots:[c,h],mix:l,grade:vf(c.grade,h.grade,l)}}var Ki=Object.assign({scene:null,t0:0,scale:.75},window.PLATE||{}),jv=Math.round(1080*Ki.scale/2)*2,Qv=Math.round(1920*Ki.scale/2)*2,Bt,Kt;async function e1(){try{await Promise.all(["600 74px Montserrat","500 44px Montserrat"].map(n=>document.fonts.load(n)))}catch{}let i=document.getElementById("gl");Bt=new Hl(i,jv,Qv);let e=Bt.add(new kl);Kt={city:e,river:Bt.add(new Vl),landmarks:Bt.add(new Wl),fortress:Bt.add(new Xl),boulevard:Bt.add(new Jl),map:Bt.add(new Kl(e.buildings)),arcs:Bt.add(new $l(e.buildings)),flag:Bt.add(new Yl(-2331,1236.5,6,2.8)),guide:Bt.add(new tc),grass:Bt.add(new jl(-7470,-7020,640,760,7e4)),transit:Bt.add(new Zl),crowds:Object.fromEntries(Object.entries(Hf).map(([n,s],r)=>[n,Bt.add(new ql([s],11+r))]))},Kt.plazaLight=new so(16762250,0,160,1.6),Bt.scene.add(Kt.plazaLight);let t=Bt.renderShot.bind(Bt);Bt.renderShot=(n,s)=>(t1(n,Bt.__t),t(n,s)),window.__plateReady=!0,window.__engine=Bt}function t1(i,e){let t=i.state||{},n=Of(e,Ki.scene),s=i.look.night||0,r={...t,t:e,year:n,night:s};Un.uTime.value=e,Un.uNight.value=s,Un.uMap.value=t.map||0,Kt.city.update(r),Kt.river.update(r),Kt.landmarks.update(r),Kt.fortress.update(r),Kt.boulevard.update(r),Kt.map.update(r),Kt.arcs.update(r),Kt.flag.update(r),Kt.flag.object.position.y=45.2,Kt.flag.object.rotation.y=Math.PI/2,Kt.guide.update(r,{position:i.pos}),Kt.grass.update(r),Kt.transit.update(r),t.crowd==="khan"?(Kt.plazaLight.position.set(-1500,9,1204),Kt.plazaLight.intensity=35):Kt.plazaLight.intensity=0;for(let[o,a]of Object.entries(Kt.crowds))t.crowd===o&&a.update(r),a.object.visible=t.crowd===o&&n>2e3}function Kh(i){let e=Ki.t0+i;if(Ki.auto){let n=[0,12,30,45,60,77,92,107,999];Ki.scene="s"+n.findIndex((s,r)=>e>=s&&e<n[r+1]),Ki.scene="s"+(n.findIndex((s,r)=>e>=s&&e<n[r+1])+1)}Bt.__t=e;let t=Gf(e,Ki.scene);if(window.__debugCam){let n=window.__debugCam;t.shots=[t.shots[t.shots.length-1]],t.mix=0,Object.assign(t.shots[0],{pos:new C(...n.pos),target:new C(...n.target),fov:n.fov||30}),t.grade=t.shots[0].grade}Bt.render(t)}var kf=e1();window.__renderAt=i=>kf.then(()=>Kh(i));window.__debugLum=()=>{let i=Bt.renderer,e=Bt.rtA,t=new Uint16Array(256);return i.readRenderTargetPixels(e,e.width/2|0,e.height/2|0,8,8,t),t};window.addEventListener("hf-seek",i=>{let e=i.detail.time;window.__plateReady?Kh(e):i.detail.waitUntil(kf.then(()=>Kh(e)))});})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
