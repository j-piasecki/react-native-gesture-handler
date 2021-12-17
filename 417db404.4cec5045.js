(window.webpackJsonp=window.webpackJsonp||[]).push([[37],{126:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return c})),n.d(t,"metadata",(function(){return o})),n.d(t,"rightToc",(function(){return s})),n.d(t,"default",(function(){return p}));var r=n(2),a=n(6),i=(n(0),n(218)),c={id:"pinch-gh",title:"PinchGestureHandler",sidebar_label:"Pinch"},o={unversionedId:"gesture-handlers/api/pinch-gh",id:"version-2.0.0/gesture-handlers/api/pinch-gh",isDocsHomePage:!1,title:"PinchGestureHandler",description:"A continuous gesture handler that recognizes pinch gesture. It allows for tracking the distance between two fingers and use that information to scale or zoom your content.",source:"@site/versioned_docs/version-2.0.0/gesture-handlers/api/pinch-gh.md",slug:"/gesture-handlers/api/pinch-gh",permalink:"/react-native-gesture-handler/docs/gesture-handlers/api/pinch-gh",editUrl:"https://github.com/software-mansion/react-native-gesture-handler/tree/main/docs/versioned_docs/version-2.0.0/gesture-handlers/api/pinch-gh.md",version:"2.0.0",sidebar_label:"Pinch",sidebar:"version-2.0.0/docs",previous:{title:"FlingGestureHandler",permalink:"/react-native-gesture-handler/docs/gesture-handlers/api/fling-gh"},next:{title:"ForceTouchGestureHandler (iOS only)",permalink:"/react-native-gesture-handler/docs/gesture-handlers/api/force-gh"}},s=[{value:"Properties",id:"properties",children:[]},{value:"Event data",id:"event-data",children:[{value:"<code>scale</code>",id:"scale",children:[]},{value:"<code>velocity</code>",id:"velocity",children:[]},{value:"<code>focalX</code>",id:"focalx",children:[]},{value:"<code>focalY</code>",id:"focaly",children:[]}]},{value:"Example",id:"example",children:[]}],l={rightToc:s};function p(e){var t=e.components,n=Object(a.a)(e,["components"]);return Object(i.b)("wrapper",Object(r.a)({},l,n,{components:t,mdxType:"MDXLayout"}),Object(i.b)("p",null,"A continuous gesture handler that recognizes pinch gesture. It allows for tracking the distance between two fingers and use that information to scale or zoom your content.\nThe handler ",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"/react-native-gesture-handler/docs/gesture-handlers/basics/state#active"}),"activates")," when fingers are placed on the screen and change their position.\nGesture callback can be used for continuous tracking of the pinch gesture. It provides information about velocity, anchor (focal) point of gesture and scale."),Object(i.b)("p",null,"The distance between the fingers is reported as a scale factor. At the beginning of the gesture, the scale factor is 1.0. As the distance between the two fingers increases, the scale factor increases proportionally.\nSimilarly, the scale factor decreases as the distance between the fingers decreases.\nPinch gestures are used most commonly to change the size of objects or content onscreen.\nFor example, map views use pinch gestures to change the zoom level of the map."),Object(i.b)("p",null,"The handler is implemented using ",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"https://developer.apple.com/documentation/uikit/uipinchgesturerecognizer"}),"UIPinchGestureRecognizer")," on iOS and from scratch on Android."),Object(i.b)("h2",{id:"properties"},"Properties"),Object(i.b)("p",null,"Properties provided to ",Object(i.b)("inlineCode",{parentName:"p"},"PinchGestureHandler")," do not extend ",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"/react-native-gesture-handler/docs/gesture-handlers/api/common-gh#properties"}),"common set of properties from base handler class"),"."),Object(i.b)("h2",{id:"event-data"},"Event data"),Object(i.b)("p",null,"See ",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"/react-native-gesture-handler/docs/gesture-handlers/api/common-gh#event-data"}),"set of event attributes from base handler class"),". Below is a list of gesture event attributes specific to ",Object(i.b)("inlineCode",{parentName:"p"},"PinchGestureHandler"),":"),Object(i.b)("h3",{id:"scale"},Object(i.b)("inlineCode",{parentName:"h3"},"scale")),Object(i.b)("p",null,"The scale factor relative to the points of the two touches in screen coordinates."),Object(i.b)("h3",{id:"velocity"},Object(i.b)("inlineCode",{parentName:"h3"},"velocity")),Object(i.b)("p",null,"Velocity of the pan gesture the current moment. The value is expressed in point units per second."),Object(i.b)("h3",{id:"focalx"},Object(i.b)("inlineCode",{parentName:"h3"},"focalX")),Object(i.b)("p",null,"Position expressed in points along X axis of center anchor point of gesture"),Object(i.b)("h3",{id:"focaly"},Object(i.b)("inlineCode",{parentName:"h3"},"focalY")),Object(i.b)("p",null,"Position expressed in points along Y axis of center anchor point of gesture"),Object(i.b)("h2",{id:"example"},"Example"),Object(i.b)("p",null,"See the ",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"hhttps://github.com/software-mansion/react-native-gesture-handler/blob/main/example/src/recipes/scaleAndRotate/index.tsx"}),"scale and rotation example")," from ",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"../../example"}),"GestureHandler Example App"),"."),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-js"}),"export class PinchableBox extends React.Component {\n  _baseScale = new Animated.Value(1);\n  _pinchScale = new Animated.Value(1);\n  _scale = Animated.multiply(this._baseScale, this._pinchScale);\n  _lastScale = 1;\n  _onPinchGestureEvent = Animated.event(\n    [{ nativeEvent: { scale: this._pinchScale } }],\n    { useNativeDriver: USE_NATIVE_DRIVER }\n  );\n\n  _onPinchHandlerStateChange = (event) => {\n    if (event.nativeEvent.oldState === State.ACTIVE) {\n      this._lastScale *= event.nativeEvent.scale;\n      this._baseScale.setValue(this._lastScale);\n      this._pinchScale.setValue(1);\n    }\n  };\n\n  render() {\n    return (\n      <PinchGestureHandler\n        onGestureEvent={this._onPinchGestureEvent}\n        onHandlerStateChange={this._onPinchHandlerStateChange}>\n        <View style={styles.container} collapsable={false}>\n          <Animated.Image\n            style={[\n              styles.pinchableImage,\n              {\n                transform: [{ perspective: 200 }, { scale: this._scale }],\n              },\n            ]}\n          />\n        </View>\n      </PinchGestureHandler>\n    );\n  }\n}\n")))}p.isMDXComponent=!0},218:function(e,t,n){"use strict";n.d(t,"a",(function(){return d})),n.d(t,"b",(function(){return b}));var r=n(0),a=n.n(r);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=a.a.createContext({}),p=function(e){var t=a.a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},d=function(e){var t=p(e.components);return a.a.createElement(l.Provider,{value:t},e.children)},h={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},u=a.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,c=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),d=p(n),u=r,b=d["".concat(c,".").concat(u)]||d[u]||h[u]||i;return n?a.a.createElement(b,o(o({ref:t},l),{},{components:n})):a.a.createElement(b,o({ref:t},l))}));function b(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,c=new Array(i);c[0]=u;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o.mdxType="string"==typeof e?e:r,c[1]=o;for(var l=2;l<i;l++)c[l]=n[l];return a.a.createElement.apply(null,c)}return a.a.createElement.apply(null,n)}u.displayName="MDXCreateElement"}}]);