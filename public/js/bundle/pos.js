(function () {
'use strict';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global_1 =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();

var fails = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

// Detect IE8's incomplete defineProperty implementation
var descriptors = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;

var objectPropertyIsEnumerable = {
	f: f
};

var createPropertyDescriptor = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var toString = {}.toString;

var classofRaw = function (it) {
  return toString.call(it).slice(8, -1);
};

var split = ''.split;

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var indexedObject = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
} : Object;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
var requireObjectCoercible = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};

// toObject with fallback for non-array-like ES3 strings



var toIndexedObject = function (it) {
  return indexedObject(requireObjectCoercible(it));
};

var isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var toPrimitive = function (input, PREFERRED_STRING) {
  if (!isObject(input)) return input;
  var fn, val;
  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var hasOwnProperty = {}.hasOwnProperty;

var has = function (it, key) {
  return hasOwnProperty.call(it, key);
};

var document$1 = global_1.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document$1) && isObject(document$1.createElement);

var documentCreateElement = function (it) {
  return EXISTS ? document$1.createElement(it) : {};
};

// Thank's IE8 for his funny defineProperty
var ie8DomDefine = !descriptors && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- requied for testing
  return Object.defineProperty(documentCreateElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
var f$1 = descriptors ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPrimitive(P, true);
  if (ie8DomDefine) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
};

var objectGetOwnPropertyDescriptor = {
	f: f$1
};

var anObject = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};

// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
var f$2 = descriptors ? $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (ie8DomDefine) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var objectDefineProperty = {
	f: f$2
};

var createNonEnumerableProperty = descriptors ? function (object, key, value) {
  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var setGlobal = function (key, value) {
  try {
    createNonEnumerableProperty(global_1, key, value);
  } catch (error) {
    global_1[key] = value;
  } return value;
};

var SHARED = '__core-js_shared__';
var store = global_1[SHARED] || setGlobal(SHARED, {});

var sharedStore = store;

var functionToString = Function.toString;

// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
if (typeof sharedStore.inspectSource != 'function') {
  sharedStore.inspectSource = function (it) {
    return functionToString.call(it);
  };
}

var inspectSource = sharedStore.inspectSource;

var WeakMap = global_1.WeakMap;

var nativeWeakMap = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

var shared = createCommonjsModule(function (module) {
(module.exports = function (key, value) {
  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.10.2',
  mode:  'global',
  copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
});
});

var id = 0;
var postfix = Math.random();

var uid = function (key) {
  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
};

var keys = shared('keys');

var sharedKey = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

var hiddenKeys = {};

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var WeakMap$1 = global_1.WeakMap;
var set, get, has$1;

var enforce = function (it) {
  return has$1(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (nativeWeakMap) {
  var store$1 = sharedStore.state || (sharedStore.state = new WeakMap$1());
  var wmget = store$1.get;
  var wmhas = store$1.has;
  var wmset = store$1.set;
  set = function (it, metadata) {
    if (wmhas.call(store$1, it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    wmset.call(store$1, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget.call(store$1, it) || {};
  };
  has$1 = function (it) {
    return wmhas.call(store$1, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (has(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return has(it, STATE) ? it[STATE] : {};
  };
  has$1 = function (it) {
    return has(it, STATE);
  };
}

var internalState = {
  set: set,
  get: get,
  has: has$1,
  enforce: enforce,
  getterFor: getterFor
};

var redefine = createCommonjsModule(function (module) {
var getInternalState = internalState.get;
var enforceInternalState = internalState.enforce;
var TEMPLATE = String(String).split('String');

(module.exports = function (O, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var noTargetGet = options ? !!options.noTargetGet : false;
  var state;
  if (typeof value == 'function') {
    if (typeof key == 'string' && !has(value, 'name')) {
      createNonEnumerableProperty(value, 'name', key);
    }
    state = enforceInternalState(value);
    if (!state.source) {
      state.source = TEMPLATE.join(typeof key == 'string' ? key : '');
    }
  }
  if (O === global_1) {
    if (simple) O[key] = value;
    else setGlobal(key, value);
    return;
  } else if (!unsafe) {
    delete O[key];
  } else if (!noTargetGet && O[key]) {
    simple = true;
  }
  if (simple) O[key] = value;
  else createNonEnumerableProperty(O, key, value);
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, 'toString', function toString() {
  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
});
});

var path = global_1;

var aFunction = function (variable) {
  return typeof variable == 'function' ? variable : undefined;
};

var getBuiltIn = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace])
    : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
};

var ceil = Math.ceil;
var floor = Math.floor;

// `ToInteger` abstract operation
// https://tc39.es/ecma262/#sec-tointeger
var toInteger = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
};

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
var toLength = function (argument) {
  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

var max = Math.max;
var min$1 = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
var toAbsoluteIndex = function (index, length) {
  var integer = toInteger(index);
  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
};

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var arrayIncludes = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};

var indexOf = arrayIncludes.indexOf;


var objectKeysInternal = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~indexOf(result, key) || result.push(key);
  }
  return result;
};

// IE8- don't enum bug keys
var enumBugKeys = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];

var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return objectKeysInternal(O, hiddenKeys$1);
};

var objectGetOwnPropertyNames = {
	f: f$3
};

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
var f$4 = Object.getOwnPropertySymbols;

var objectGetOwnPropertySymbols = {
	f: f$4
};

// all object keys, includes non-enumerable and symbols
var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = objectGetOwnPropertyNames.f(anObject(it));
  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
};

var copyConstructorProperties = function (target, source) {
  var keys = ownKeys(source);
  var defineProperty = objectDefineProperty.f;
  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
  }
};

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : typeof detection == 'function' ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

var isForced_1 = isForced;

var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/
var _export = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global_1;
  } else if (STATIC) {
    target = global_1[TARGET] || setGlobal(TARGET, {});
  } else {
    target = (global_1[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor$1(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty === typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    // extend global
    redefine(target, key, sourceProperty, options);
  }
};

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
var toObject = function (argument) {
  return Object(requireObjectCoercible(argument));
};

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
var objectKeys = Object.keys || function keys(O) {
  return objectKeysInternal(O, enumBugKeys);
};

var FAILS_ON_PRIMITIVES = fails(function () { objectKeys(1); });

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
  keys: function keys(it) {
    return objectKeys(toObject(it));
  }
});

var engineIsNode = classofRaw(global_1.process) == 'process';

var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

var process = global_1.process;
var versions = process && process.versions;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  version = match[0] + match[1];
} else if (engineUserAgent) {
  match = engineUserAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = engineUserAgent.match(/Chrome\/(\d+)/);
    if (match) version = match[1];
  }
}

var engineV8Version = version && +version;

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
  // eslint-disable-next-line es/no-symbol -- required for testing
  return !Symbol.sham &&
    // Chrome 38 Symbol has incorrect toString conversion
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    (engineIsNode ? engineV8Version === 38 : engineV8Version > 37 && engineV8Version < 41);
});

/* eslint-disable es/no-symbol -- required for testing */


var useSymbolAsUid = nativeSymbol
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
var isArray = Array.isArray || function isArray(arg) {
  return classofRaw(arg) == 'Array';
};

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);
  return O;
};

var html = getBuiltIn('document', 'documentElement');

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    /* global ActiveXObject -- old IE */
    activeXDocument = document.domain && new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
var objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : objectDefineProperties(result, Properties);
};

/* eslint-disable es/no-object-getownpropertynames -- safe */

var $getOwnPropertyNames = objectGetOwnPropertyNames.f;

var toString$1 = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return $getOwnPropertyNames(it);
  } catch (error) {
    return windowNames.slice();
  }
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var f$5 = function getOwnPropertyNames(it) {
  return windowNames && toString$1.call(it) == '[object Window]'
    ? getWindowNames(it)
    : $getOwnPropertyNames(toIndexedObject(it));
};

var objectGetOwnPropertyNamesExternal = {
	f: f$5
};

var WellKnownSymbolsStore = shared('wks');
var Symbol$1 = global_1.Symbol;
var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

var wellKnownSymbol = function (name) {
  if (!has(WellKnownSymbolsStore, name) || !(nativeSymbol || typeof WellKnownSymbolsStore[name] == 'string')) {
    if (nativeSymbol && has(Symbol$1, name)) {
      WellKnownSymbolsStore[name] = Symbol$1[name];
    } else {
      WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
    }
  } return WellKnownSymbolsStore[name];
};

var f$6 = wellKnownSymbol;

var wellKnownSymbolWrapped = {
	f: f$6
};

var defineProperty = objectDefineProperty.f;

var defineWellKnownSymbol = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {});
  if (!has(Symbol, NAME)) defineProperty(Symbol, NAME, {
    value: wellKnownSymbolWrapped.f(NAME)
  });
};

var defineProperty$1 = objectDefineProperty.f;



var TO_STRING_TAG = wellKnownSymbol('toStringTag');

var setToStringTag = function (it, TAG, STATIC) {
  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
    defineProperty$1(it, TO_STRING_TAG, { configurable: true, value: TAG });
  }
};

var aFunction$1 = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  } return it;
};

// optional / simple context binding
var functionBindContext = function (fn, that, length) {
  aFunction$1(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 0: return function () {
      return fn.call(that);
    };
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var SPECIES = wellKnownSymbol('species');

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
var arraySpeciesCreate = function (originalArray, length) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
};

var push = [].push;

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterOut }` methods implementation
var createMethod$1 = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var IS_FILTER_OUT = TYPE == 7;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = indexedObject(O);
    var boundFunction = functionBindContext(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_OUT ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push.call(target, value); // filter
        } else switch (TYPE) {
          case 4: return false;             // every
          case 7: push.call(target, value); // filterOut
        }
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

var arrayIteration = {
  // `Array.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  forEach: createMethod$1(0),
  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  map: createMethod$1(1),
  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  filter: createMethod$1(2),
  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  some: createMethod$1(3),
  // `Array.prototype.every` method
  // https://tc39.es/ecma262/#sec-array.prototype.every
  every: createMethod$1(4),
  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  find: createMethod$1(5),
  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod$1(6),
  // `Array.prototype.filterOut` method
  // https://github.com/tc39/proposal-array-filtering
  filterOut: createMethod$1(7)
};

var $forEach = arrayIteration.forEach;

var HIDDEN = sharedKey('hidden');
var SYMBOL = 'Symbol';
var PROTOTYPE$1 = 'prototype';
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
var setInternalState = internalState.set;
var getInternalState = internalState.getterFor(SYMBOL);
var ObjectPrototype = Object[PROTOTYPE$1];
var $Symbol = global_1.Symbol;
var $stringify = getBuiltIn('JSON', 'stringify');
var nativeGetOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
var nativeDefineProperty = objectDefineProperty.f;
var nativeGetOwnPropertyNames = objectGetOwnPropertyNamesExternal.f;
var nativePropertyIsEnumerable = objectPropertyIsEnumerable.f;
var AllSymbols = shared('symbols');
var ObjectPrototypeSymbols = shared('op-symbols');
var StringToSymbolRegistry = shared('string-to-symbol-registry');
var SymbolToStringRegistry = shared('symbol-to-string-registry');
var WellKnownSymbolsStore$1 = shared('wks');
var QObject = global_1.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var USE_SETTER = !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDescriptor = descriptors && fails(function () {
  return objectCreate(nativeDefineProperty({}, 'a', {
    get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (O, P, Attributes) {
  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P);
  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
  nativeDefineProperty(O, P, Attributes);
  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
    nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor);
  }
} : nativeDefineProperty;

var wrap = function (tag, description) {
  var symbol = AllSymbols[tag] = objectCreate($Symbol[PROTOTYPE$1]);
  setInternalState(symbol, {
    type: SYMBOL,
    tag: tag,
    description: description
  });
  if (!descriptors) symbol.description = description;
  return symbol;
};

var isSymbol = useSymbolAsUid ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return Object(it) instanceof $Symbol;
};

var $defineProperty$1 = function defineProperty(O, P, Attributes) {
  if (O === ObjectPrototype) $defineProperty$1(ObjectPrototypeSymbols, P, Attributes);
  anObject(O);
  var key = toPrimitive(P, true);
  anObject(Attributes);
  if (has(AllSymbols, key)) {
    if (!Attributes.enumerable) {
      if (!has(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}));
      O[HIDDEN][key] = true;
    } else {
      if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
      Attributes = objectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
    } return setSymbolDescriptor(O, key, Attributes);
  } return nativeDefineProperty(O, key, Attributes);
};

var $defineProperties = function defineProperties(O, Properties) {
  anObject(O);
  var properties = toIndexedObject(Properties);
  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
  $forEach(keys, function (key) {
    if (!descriptors || $propertyIsEnumerable$1.call(properties, key)) $defineProperty$1(O, key, properties[key]);
  });
  return O;
};

var $create = function create(O, Properties) {
  return Properties === undefined ? objectCreate(O) : $defineProperties(objectCreate(O), Properties);
};

var $propertyIsEnumerable$1 = function propertyIsEnumerable(V) {
  var P = toPrimitive(V, true);
  var enumerable = nativePropertyIsEnumerable.call(this, P);
  if (this === ObjectPrototype && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
  return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
};

var $getOwnPropertyDescriptor$1 = function getOwnPropertyDescriptor(O, P) {
  var it = toIndexedObject(O);
  var key = toPrimitive(P, true);
  if (it === ObjectPrototype && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
  var descriptor = nativeGetOwnPropertyDescriptor(it, key);
  if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
    descriptor.enumerable = true;
  }
  return descriptor;
};

var $getOwnPropertyNames$1 = function getOwnPropertyNames(O) {
  var names = nativeGetOwnPropertyNames(toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
  });
  return result;
};

var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype, key))) {
      result.push(AllSymbols[key]);
    }
  });
  return result;
};

// `Symbol` constructor
// https://tc39.es/ecma262/#sec-symbol-constructor
if (!nativeSymbol) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
    var description = !arguments.length || arguments[0] === undefined ? undefined : String(arguments[0]);
    var tag = uid(description);
    var setter = function (value) {
      if (this === ObjectPrototype) setter.call(ObjectPrototypeSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
    };
    if (descriptors && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
    return wrap(tag, description);
  };

  redefine($Symbol[PROTOTYPE$1], 'toString', function toString() {
    return getInternalState(this).tag;
  });

  redefine($Symbol, 'withoutSetter', function (description) {
    return wrap(uid(description), description);
  });

  objectPropertyIsEnumerable.f = $propertyIsEnumerable$1;
  objectDefineProperty.f = $defineProperty$1;
  objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor$1;
  objectGetOwnPropertyNames.f = objectGetOwnPropertyNamesExternal.f = $getOwnPropertyNames$1;
  objectGetOwnPropertySymbols.f = $getOwnPropertySymbols;

  wellKnownSymbolWrapped.f = function (name) {
    return wrap(wellKnownSymbol(name), name);
  };

  if (descriptors) {
    // https://github.com/tc39/proposal-Symbol-description
    nativeDefineProperty($Symbol[PROTOTYPE$1], 'description', {
      configurable: true,
      get: function description() {
        return getInternalState(this).description;
      }
    });
    {
      redefine(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable$1, { unsafe: true });
    }
  }
}

_export({ global: true, wrap: true, forced: !nativeSymbol, sham: !nativeSymbol }, {
  Symbol: $Symbol
});

$forEach(objectKeys(WellKnownSymbolsStore$1), function (name) {
  defineWellKnownSymbol(name);
});

_export({ target: SYMBOL, stat: true, forced: !nativeSymbol }, {
  // `Symbol.for` method
  // https://tc39.es/ecma262/#sec-symbol.for
  'for': function (key) {
    var string = String(key);
    if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
    var symbol = $Symbol(string);
    StringToSymbolRegistry[string] = symbol;
    SymbolToStringRegistry[symbol] = string;
    return symbol;
  },
  // `Symbol.keyFor` method
  // https://tc39.es/ecma262/#sec-symbol.keyfor
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
    if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
  },
  useSetter: function () { USE_SETTER = true; },
  useSimple: function () { USE_SETTER = false; }
});

_export({ target: 'Object', stat: true, forced: !nativeSymbol, sham: !descriptors }, {
  // `Object.create` method
  // https://tc39.es/ecma262/#sec-object.create
  create: $create,
  // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty
  defineProperty: $defineProperty$1,
  // `Object.defineProperties` method
  // https://tc39.es/ecma262/#sec-object.defineproperties
  defineProperties: $defineProperties,
  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor$1
});

_export({ target: 'Object', stat: true, forced: !nativeSymbol }, {
  // `Object.getOwnPropertyNames` method
  // https://tc39.es/ecma262/#sec-object.getownpropertynames
  getOwnPropertyNames: $getOwnPropertyNames$1,
  // `Object.getOwnPropertySymbols` method
  // https://tc39.es/ecma262/#sec-object.getownpropertysymbols
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
_export({ target: 'Object', stat: true, forced: fails(function () { objectGetOwnPropertySymbols.f(1); }) }, {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    return objectGetOwnPropertySymbols.f(toObject(it));
  }
});

// `JSON.stringify` method behavior with symbols
// https://tc39.es/ecma262/#sec-json.stringify
if ($stringify) {
  var FORCED_JSON_STRINGIFY = !nativeSymbol || fails(function () {
    var symbol = $Symbol();
    // MS Edge converts symbol values to JSON as {}
    return $stringify([symbol]) != '[null]'
      // WebKit converts symbol values to JSON as null
      || $stringify({ a: symbol }) != '{}'
      // V8 throws on boxed symbols
      || $stringify(Object(symbol)) != '{}';
  });

  _export({ target: 'JSON', stat: true, forced: FORCED_JSON_STRINGIFY }, {
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    stringify: function stringify(it, replacer, space) {
      var args = [it];
      var index = 1;
      var $replacer;
      while (arguments.length > index) args.push(arguments[index++]);
      $replacer = replacer;
      if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
      if (!isArray(replacer)) replacer = function (key, value) {
        if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
        if (!isSymbol(value)) return value;
      };
      args[1] = replacer;
      return $stringify.apply(null, args);
    }
  });
}

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
if (!$Symbol[PROTOTYPE$1][TO_PRIMITIVE]) {
  createNonEnumerableProperty($Symbol[PROTOTYPE$1], TO_PRIMITIVE, $Symbol[PROTOTYPE$1].valueOf);
}
// `Symbol.prototype[@@toStringTag]` property
// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag($Symbol, SYMBOL);

hiddenKeys[HIDDEN] = true;

var SPECIES$1 = wellKnownSymbol('species');

var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return engineV8Version >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES$1] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};

var $filter = arrayIteration.filter;


var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');

// `Array.prototype.filter` method
// https://tc39.es/ecma262/#sec-array.prototype.filter
// with adding support of @@species
_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var nativeGetOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;


var FAILS_ON_PRIMITIVES$1 = fails(function () { nativeGetOwnPropertyDescriptor$1(1); });
var FORCED = !descriptors || FAILS_ON_PRIMITIVES$1;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
_export({ target: 'Object', stat: true, forced: FORCED, sham: !descriptors }, {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
    return nativeGetOwnPropertyDescriptor$1(toIndexedObject(it), key);
  }
});

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
var domIterables = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};

var arrayMethodIsStrict = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call,no-throw-literal -- required for testing
    method.call(null, argument || function () { throw 1; }, 1);
  });
};

var $forEach$1 = arrayIteration.forEach;


var STRICT_METHOD = arrayMethodIsStrict('forEach');

// `Array.prototype.forEach` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.foreach
var arrayForEach = !STRICT_METHOD ? function forEach(callbackfn /* , thisArg */) {
  return $forEach$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
// eslint-disable-next-line es/no-array-prototype-foreach -- safe
} : [].forEach;

for (var COLLECTION_NAME in domIterables) {
  var Collection = global_1[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  // some Chrome versions have non-configurable methods on DOMTokenList
  if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach) try {
    createNonEnumerableProperty(CollectionPrototype, 'forEach', arrayForEach);
  } catch (error) {
    CollectionPrototype.forEach = arrayForEach;
  }
}

var createProperty = function (object, key, value) {
  var propertyKey = toPrimitive(key);
  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};

// `Object.getOwnPropertyDescriptors` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
_export({ target: 'Object', stat: true, sham: !descriptors }, {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIndexedObject(object);
    var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
    var keys = ownKeys(O);
    var result = {};
    var index = 0;
    var key, descriptor;
    while (keys.length > index) {
      descriptor = getOwnPropertyDescriptor(O, key = keys[index++]);
      if (descriptor !== undefined) createProperty(result, key, descriptor);
    }
    return result;
  }
});

var defineProperty$2 = objectDefineProperty.f;

var FunctionPrototype = Function.prototype;
var FunctionPrototypeToString = FunctionPrototype.toString;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// Function instances `.name` property
// https://tc39.es/ecma262/#sec-function-instances-name
if (descriptors && !(NAME in FunctionPrototype)) {
  defineProperty$2(FunctionPrototype, NAME, {
    configurable: true,
    get: function () {
      try {
        return FunctionPrototypeToString.call(this).match(nameRE)[1];
      } catch (error) {
        return '';
      }
    }
  });
}

var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('slice');

var SPECIES$2 = wellKnownSymbol('species');
var nativeSlice = [].slice;
var max$1 = Math.max;

// `Array.prototype.slice` method
// https://tc39.es/ecma262/#sec-array.prototype.slice
// fallback for not array-like ES3 strings and DOM objects
_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 }, {
  slice: function slice(start, end) {
    var O = toIndexedObject(this);
    var length = toLength(O.length);
    var k = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
    var Constructor, result, n;
    if (isArray(O)) {
      Constructor = O.constructor;
      // cross-realm fallback
      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
        Constructor = undefined;
      } else if (isObject(Constructor)) {
        Constructor = Constructor[SPECIES$2];
        if (Constructor === null) Constructor = undefined;
      }
      if (Constructor === Array || Constructor === undefined) {
        return nativeSlice.call(O, k, fin);
      }
    }
    result = new (Constructor === undefined ? Array : Constructor)(max$1(fin - k, 0));
    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
    result.length = n;
    return result;
  }
});

// `RegExp.prototype.flags` getter implementation
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
var regexpFlags = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

// babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
// so we use an intermediate function.
function RE(s, f) {
  return RegExp(s, f);
}

var UNSUPPORTED_Y = fails(function () {
  // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
  var re = RE('a', 'y');
  re.lastIndex = 2;
  return re.exec('abcd') != null;
});

var BROKEN_CARET = fails(function () {
  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
  var re = RE('^r', 'gy');
  re.lastIndex = 2;
  return re.exec('str') != null;
});

var regexpStickyHelpers = {
	UNSUPPORTED_Y: UNSUPPORTED_Y,
	BROKEN_CARET: BROKEN_CARET
};

var nativeExec = RegExp.prototype.exec;
var nativeReplace = shared('native-string-replace', String.prototype.replace);

var patchedExec = nativeExec;

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y || regexpStickyHelpers.BROKEN_CARET;

// nonparticipating capturing group, copied from es5-shim's String#split patch.
// eslint-disable-next-line regexp/no-assertion-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;
    var sticky = UNSUPPORTED_Y$1 && re.sticky;
    var flags = regexpFlags.call(re);
    var source = re.source;
    var charsAdded = 0;
    var strCopy = str;

    if (sticky) {
      flags = flags.replace('y', '');
      if (flags.indexOf('g') === -1) {
        flags += 'g';
      }

      strCopy = String(str).slice(re.lastIndex);
      // Support anchored sticky behavior.
      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
        source = '(?: ' + source + ')';
        strCopy = ' ' + strCopy;
        charsAdded++;
      }
      // ^(? + rx + ) is needed, in combination with some str slicing, to
      // simulate the 'y' flag.
      reCopy = new RegExp('^(?:' + source + ')', flags);
    }

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    match = nativeExec.call(sticky ? reCopy : re, strCopy);

    if (sticky) {
      if (match) {
        match.input = match.input.slice(charsAdded);
        match[0] = match[0].slice(charsAdded);
        match.index = re.lastIndex;
        re.lastIndex += match[0].length;
      } else re.lastIndex = 0;
    } else if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

var regexpExec = patchedExec;

// `RegExp.prototype.exec` method
// https://tc39.es/ecma262/#sec-regexp.prototype.exec
_export({ target: 'RegExp', proto: true, forced: /./.exec !== regexpExec }, {
  exec: regexpExec
});

// TODO: Remove from `core-js@4` since it's moved to entry points






var SPECIES$3 = wellKnownSymbol('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

// IE <= 11 replaces $0 with the whole match, as if it was $&
// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
var REPLACE_KEEPS_$0 = (function () {
  // eslint-disable-next-line regexp/prefer-escape-replacement-dollar-char -- required for testing
  return 'a'.replace(/./, '$0') === '$0';
})();

var REPLACE = wellKnownSymbol('replace');
// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
  if (/./[REPLACE]) {
    return /./[REPLACE]('a', '$0') === '';
  }
  return false;
})();

// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
// Weex JS has frozen built-in prototypes, so use try / catch wrapper
var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
  // eslint-disable-next-line regexp/no-empty-group -- required for testing
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
});

var fixRegexpWellKnownSymbolLogic = function (KEY, length, exec, sham) {
  var SYMBOL = wellKnownSymbol(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;

    if (KEY === 'split') {
      // We can't use real regex here since it causes deoptimization
      // and serious performance degradation in V8
      // https://github.com/zloirock/core-js/issues/306
      re = {};
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES$3] = function () { return re; };
      re.flags = '';
      re[SYMBOL] = /./[SYMBOL];
    }

    re.exec = function () { execCalled = true; return null; };

    re[SYMBOL]('');
    return !execCalled;
  });

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !(
      REPLACE_SUPPORTS_NAMED_GROUPS &&
      REPLACE_KEEPS_$0 &&
      !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
    )) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      if (regexp.exec === RegExp.prototype.exec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
        }
        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
      }
      return { done: false };
    }, {
      REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
      REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
    });
    var stringMethod = methods[0];
    var regexMethod = methods[1];

    redefine(String.prototype, KEY, stringMethod);
    redefine(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return regexMethod.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return regexMethod.call(string, this); }
    );
  }

  if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
};

var MATCH = wellKnownSymbol('match');

// `IsRegExp` abstract operation
// https://tc39.es/ecma262/#sec-isregexp
var isRegexp = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
};

var SPECIES$4 = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.es/ecma262/#sec-speciesconstructor
var speciesConstructor = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES$4]) == undefined ? defaultConstructor : aFunction$1(S);
};

// `String.prototype.{ codePointAt, at }` methods implementation
var createMethod$2 = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = String(requireObjectCoercible($this));
    var position = toInteger(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = S.charCodeAt(position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING ? S.charAt(position) : first
        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

var stringMultibyte = {
  // `String.prototype.codePointAt` method
  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod$2(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod$2(true)
};

var charAt = stringMultibyte.charAt;

// `AdvanceStringIndex` abstract operation
// https://tc39.es/ecma262/#sec-advancestringindex
var advanceStringIndex = function (S, index, unicode) {
  return index + (unicode ? charAt(S, index).length : 1);
};

// `RegExpExec` abstract operation
// https://tc39.es/ecma262/#sec-regexpexec
var regexpExecAbstract = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }

  if (classofRaw(R) !== 'RegExp') {
    throw TypeError('RegExp#exec called on incompatible receiver');
  }

  return regexpExec.call(R, S);
};

var UNSUPPORTED_Y$2 = regexpStickyHelpers.UNSUPPORTED_Y;
var arrayPush = [].push;
var min$2 = Math.min;
var MAX_UINT32 = 0xFFFFFFFF;

// @@split logic
fixRegexpWellKnownSymbolLogic('split', 2, function (SPLIT, nativeSplit, maybeCallNative) {
  var internalSplit;
  if (
    'abbc'.split(/(b)*/)[1] == 'c' ||
    // eslint-disable-next-line regexp/no-empty-group -- required for testing
    'test'.split(/(?:)/, -1).length != 4 ||
    'ab'.split(/(?:ab)*/).length != 2 ||
    '.'.split(/(.?)(.?)/).length != 4 ||
    // eslint-disable-next-line regexp/no-assertion-capturing-group, regexp/no-empty-group -- required for testing
    '.'.split(/()()/).length > 1 ||
    ''.split(/.?/).length
  ) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function (separator, limit) {
      var string = String(requireObjectCoercible(this));
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (separator === undefined) return [string];
      // If `separator` is not a regex, use native split
      if (!isRegexp(separator)) {
        return nativeSplit.call(string, separator, lim);
      }
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;
      while (match = regexpExec.call(separatorCopy, string)) {
        lastIndex = separatorCopy.lastIndex;
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
          lastLength = match[0].length;
          lastLastIndex = lastIndex;
          if (output.length >= lim) break;
        }
        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
      }
      if (lastLastIndex === string.length) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output.length > lim ? output.slice(0, lim) : output;
    };
  // Chakra, V8
  } else if ('0'.split(undefined, 0).length) {
    internalSplit = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
    };
  } else internalSplit = nativeSplit;

  return [
    // `String.prototype.split` method
    // https://tc39.es/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = requireObjectCoercible(this);
      var splitter = separator == undefined ? undefined : separator[SPLIT];
      return splitter !== undefined
        ? splitter.call(separator, O, limit)
        : internalSplit.call(String(O), separator, limit);
    },
    // `RegExp.prototype[@@split]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (regexp, limit) {
      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== nativeSplit);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var C = speciesConstructor(rx, RegExp);

      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') +
                  (rx.multiline ? 'm' : '') +
                  (rx.unicode ? 'u' : '') +
                  (UNSUPPORTED_Y$2 ? 'g' : 'y');

      // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.
      var splitter = new C(UNSUPPORTED_Y$2 ? '^(?:' + rx.source + ')' : rx, flags);
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return regexpExecAbstract(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = UNSUPPORTED_Y$2 ? 0 : q;
        var z = regexpExecAbstract(splitter, UNSUPPORTED_Y$2 ? S.slice(q) : S);
        var e;
        if (
          z === null ||
          (e = min$2(toLength(splitter.lastIndex + (UNSUPPORTED_Y$2 ? q : 0)), S.length)) === p
        ) {
          q = advanceStringIndex(S, q, unicodeMatching);
        } else {
          A.push(S.slice(p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            A.push(z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      A.push(S.slice(p));
      return A;
    }
  ];
}, UNSUPPORTED_Y$2);

var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG$1] = 'z';

var toStringTagSupport = String(test) === '[object z]';

var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');
// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
var classof = toStringTagSupport ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$2)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
};

// `Object.prototype.toString` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.tostring
var objectToString = toStringTagSupport ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};

// `Object.prototype.toString` method
// https://tc39.es/ecma262/#sec-object.prototype.tostring
if (!toStringTagSupport) {
  redefine(Object.prototype, 'toString', objectToString, { unsafe: true });
}

var TO_STRING = 'toString';
var RegExpPrototype = RegExp.prototype;
var nativeToString = RegExpPrototype[TO_STRING];

var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
// FF44- RegExp#toString has a wrong name
var INCORRECT_NAME = nativeToString.name != TO_STRING;

// `RegExp.prototype.toString` method
// https://tc39.es/ecma262/#sec-regexp.prototype.tostring
if (NOT_GENERIC || INCORRECT_NAME) {
  redefine(RegExp.prototype, TO_STRING, function toString() {
    var R = anObject(this);
    var p = String(R.source);
    var rf = R.flags;
    var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype) ? regexpFlags.call(R) : rf);
    return '/' + p + '/' + f;
  }, { unsafe: true });
}

var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

// We can't use this feature detection in V8 since it causes
// deoptimization and serious performance degradation
// https://github.com/zloirock/core-js/issues/679
var IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version >= 51 || !fails(function () {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});

var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

var isConcatSpreadable = function (O) {
  if (!isObject(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== undefined ? !!spreadable : isArray(O);
};

var FORCED$1 = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.es/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
_export({ target: 'Array', proto: true, forced: FORCED$1 }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  concat: function concat(arg) {
    var O = toObject(this);
    var A = arraySpeciesCreate(O, 0);
    var n = 0;
    var i, k, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O : arguments[i];
      if (isConcatSpreadable(E)) {
        len = toLength(E.length);
        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
      } else {
        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        createProperty(A, n++, E);
      }
    }
    A.length = n;
    return A;
  }
});

var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('splice');

var max$2 = Math.max;
var min$3 = Math.min;
var MAX_SAFE_INTEGER$1 = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

// `Array.prototype.splice` method
// https://tc39.es/ecma262/#sec-array.prototype.splice
// with adding support of @@species
_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 }, {
  splice: function splice(start, deleteCount /* , ...items */) {
    var O = toObject(this);
    var len = toLength(O.length);
    var actualStart = toAbsoluteIndex(start, len);
    var argumentsLength = arguments.length;
    var insertCount, actualDeleteCount, A, k, from, to;
    if (argumentsLength === 0) {
      insertCount = actualDeleteCount = 0;
    } else if (argumentsLength === 1) {
      insertCount = 0;
      actualDeleteCount = len - actualStart;
    } else {
      insertCount = argumentsLength - 2;
      actualDeleteCount = min$3(max$2(toInteger(deleteCount), 0), len - actualStart);
    }
    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER$1) {
      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
    }
    A = arraySpeciesCreate(O, actualDeleteCount);
    for (k = 0; k < actualDeleteCount; k++) {
      from = actualStart + k;
      if (from in O) createProperty(A, k, O[from]);
    }
    A.length = actualDeleteCount;
    if (insertCount < actualDeleteCount) {
      for (k = actualStart; k < len - actualDeleteCount; k++) {
        from = k + actualDeleteCount;
        to = k + insertCount;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
    } else if (insertCount > actualDeleteCount) {
      for (k = len - actualDeleteCount; k > actualStart; k--) {
        from = k + actualDeleteCount - 1;
        to = k + insertCount - 1;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
    }
    for (k = 0; k < insertCount; k++) {
      O[k + actualStart] = arguments[k + 2];
    }
    O.length = len - actualDeleteCount + insertCount;
    return A;
  }
});

// `SameValue` abstract operation
// https://tc39.es/ecma262/#sec-samevalue
// eslint-disable-next-line es/no-object-is -- safe
var sameValue = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare -- NaN check
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};

// @@search logic
fixRegexpWellKnownSymbolLogic('search', 1, function (SEARCH, nativeSearch, maybeCallNative) {
  return [
    // `String.prototype.search` method
    // https://tc39.es/ecma262/#sec-string.prototype.search
    function search(regexp) {
      var O = requireObjectCoercible(this);
      var searcher = regexp == undefined ? undefined : regexp[SEARCH];
      return searcher !== undefined ? searcher.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
    },
    // `RegExp.prototype[@@search]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@search
    function (regexp) {
      var res = maybeCallNative(nativeSearch, regexp, this);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);

      var previousLastIndex = rx.lastIndex;
      if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
      var result = regexpExecAbstract(rx, S);
      if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
      return result === null ? -1 : result.index;
    }
  ];
});

var defineProperty$3 = objectDefineProperty.f;


var NativeSymbol = global_1.Symbol;

if (descriptors && typeof NativeSymbol == 'function' && (!('description' in NativeSymbol.prototype) ||
  // Safari 12 bug
  NativeSymbol().description !== undefined
)) {
  var EmptyStringDescriptionStore = {};
  // wrap Symbol constructor for correct work with undefined description
  var SymbolWrapper = function Symbol() {
    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : String(arguments[0]);
    var result = this instanceof SymbolWrapper
      ? new NativeSymbol(description)
      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
      : description === undefined ? NativeSymbol() : NativeSymbol(description);
    if (description === '') EmptyStringDescriptionStore[result] = true;
    return result;
  };
  copyConstructorProperties(SymbolWrapper, NativeSymbol);
  var symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype;
  symbolPrototype.constructor = SymbolWrapper;

  var symbolToString = symbolPrototype.toString;
  var native = String(NativeSymbol('test')) == 'Symbol(test)';
  var regexp = /^Symbol\((.*)\)[^)]+$/;
  defineProperty$3(symbolPrototype, 'description', {
    configurable: true,
    get: function description() {
      var symbol = isObject(this) ? this.valueOf() : this;
      var string = symbolToString.call(symbol);
      if (has(EmptyStringDescriptionStore, symbol)) return '';
      var desc = native ? string.slice(7, -1) : string.replace(regexp, '$1');
      return desc === '' ? undefined : desc;
    }
  });

  _export({ global: true, forced: true }, {
    Symbol: SymbolWrapper
  });
}

// `Symbol.toStringTag` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.tostringtag
defineWellKnownSymbol('toStringTag');

// JSON[@@toStringTag] property
// https://tc39.es/ecma262/#sec-json-@@tostringtag
setToStringTag(global_1.JSON, 'JSON', true);

// Math[@@toStringTag] property
// https://tc39.es/ecma262/#sec-math-@@tostringtag
setToStringTag(Math, 'Math', true);

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  objectDefineProperty.f(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: objectCreate(null)
  });
}

// add a key to Array.prototype[@@unscopables]
var addToUnscopables = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};

var $includes = arrayIncludes.includes;


// `Array.prototype.includes` method
// https://tc39.es/ecma262/#sec-array.prototype.includes
_export({ target: 'Array', proto: true }, {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('includes');

var notARegexp = function (it) {
  if (isRegexp(it)) {
    throw TypeError("The method doesn't accept regular expressions");
  } return it;
};

var MATCH$1 = wellKnownSymbol('match');

var correctIsRegexpLogic = function (METHOD_NAME) {
  var regexp = /./;
  try {
    '/./'[METHOD_NAME](regexp);
  } catch (error1) {
    try {
      regexp[MATCH$1] = false;
      return '/./'[METHOD_NAME](regexp);
    } catch (error2) { /* empty */ }
  } return false;
};

// `String.prototype.includes` method
// https://tc39.es/ecma262/#sec-string.prototype.includes
_export({ target: 'String', proto: true, forced: !correctIsRegexpLogic('includes') }, {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~String(requireObjectCoercible(this))
      .indexOf(notARegexp(searchString), arguments.length > 1 ? arguments[1] : undefined);
  }
});

var $map = arrayIteration.map;


var HAS_SPECIES_SUPPORT$3 = arrayMethodHasSpeciesSupport('map');

// `Array.prototype.map` method
// https://tc39.es/ecma262/#sec-array.prototype.map
// with adding support of @@species
_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$3 }, {
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pos"],{

/***/"./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/src/views/app/pages/pos.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/src/views/app/pages/pos.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/function node_modulesBabelLoaderLibIndexJsNode_modulesVueLoaderLibIndexJsResourcesSrcViewsAppPagesPosVueVueTypeScriptLangJs(module,__webpack_exports__,__webpack_require__){
__webpack_require__.r(__webpack_exports__);
/* harmony import */var nprogress__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(/*! nprogress */"./node_modules/nprogress/nprogress.js");
/* harmony import */var nprogress__WEBPACK_IMPORTED_MODULE_0___default=/*#__PURE__*/__webpack_require__.n(nprogress__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */var vuex__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(/*! vuex */"./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */var vue_flag_icon__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(/*! vue-flag-icon */"./node_modules/vue-flag-icon/index.js");
/* harmony import */var _utils__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(/*! ../../../utils */"./resources/src/utils/index.js");
/* harmony import */var vue__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(/*! vue */"./node_modules/vue/dist/vue.common.js");
/* harmony import */var vue__WEBPACK_IMPORTED_MODULE_4___default=/*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */var vue_autofocus_directive__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(/*! vue-autofocus-directive */"./node_modules/vue-autofocus-directive/dist/vue-autofocus-directive.js");
/* harmony import */var vue_autofocus_directive__WEBPACK_IMPORTED_MODULE_5___default=/*#__PURE__*/__webpack_require__.n(vue_autofocus_directive__WEBPACK_IMPORTED_MODULE_5__);
var _objectSpread2;

function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);if(enumerableOnly)symbols=symbols.filter(function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable;});keys.push.apply(keys,symbols);}return keys;}

function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=arguments[i]!=null?arguments[i]:{};if(i%2){ownKeys(Object(source),true).forEach(function(key){_defineProperty(target,key,source[key]);});}else if(Object.getOwnPropertyDescriptors){Object.defineProperties(target,Object.getOwnPropertyDescriptors(source));}else {ownKeys(Object(source)).forEach(function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key));});}}return target;}

function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true});}else {obj[key]=value;}return obj;}

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






vue__WEBPACK_IMPORTED_MODULE_4___default.a.directive("autofocus",vue_autofocus_directive__WEBPACK_IMPORTED_MODULE_5___default.a);
/* harmony default export */__webpack_exports__["default"]={
components:{
FlagIcon:vue_flag_icon__WEBPACK_IMPORTED_MODULE_2__["default"]},

metaInfo:{
title:"POS"},

data:function data(){
return {
langs:["es","en"],
cardElement:{},
paymentProcessing:false,
payment:{
amount:"",
Reglement:"",
notes:"",
cash:0,
change:0},

isLoading:true,
focusSearchProduct:true,
showSidebarBrands:false,
showSidebarCategorys:false,
focusSearchBrand:true,
focusSearchCategory:true,
variant:'dark',
BillingMethod:0,
GrandTotal:0,
GrandTotalText:"",
total:0,
Ref:"",
search:"",
SearchProduct:"",
search_category:"",
search_brand:"",
clients:[],
warehouses:[],
products:[],
details:[],
detail:{},
categories:[],
brands:[],
product_currentPage:1,
paginated_Products:"",
product_perPage:8,
product_totalRows:"",
paginated_Brands:"",
brand_currentPage:1,
brand_perPage:3,
paginated_Category:"",
category_currentPage:1,
category_perPage:3,
barcodeFormat:"CODE128",
invoice_pos:{
sale:{
Ref:"",
client_name:"",
discount:"",
taxe:"",
date:"",
tax_rate:0,
shipping:"",
GrandTotal:""},

details:[],
setting:{
logo:"",
CompanyName:"",
CompanyAdress:"",
email:"",
CompanyPhone:""}},


sale:{
warehouse_id:"",
client_id:"",
client_name:"",
tax_rate:0,
shipping:0,
discount:0,
TaxNet:0},

client:{
id:"",
name:"",
code:"",
email:"",
phone:"",
country:"",
city:"",
adresse:"",
NIT:"",
NRC:"",
giro:"",
final_consumer:1,
big_consumer:0},

category_id:"",
brand_id:"",
product:{
id:"",
code:"",
current:"",
quantity:"",
check_qty:"",
discount:"",
DiscountNet:"",
discount_Method:"",
name:"",
unitSale:"",
Net_price:"",
Unit_price:"",
Total_price:"",
subtotal:"",
product_id:"",
detail_id:"",
taxe:"",
tax_percent:"",
tax_method:"",
product_variant_id:""},

sound:"/audio/Beep.wav",
audio:new Audio("/audio/Beep.wav")};

},
computed:_objectSpread(_objectSpread({},Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapGetters"])(["currentUser","currentUserPermissions"])),{},{
brand_totalRows:function brand_totalRows(){
return this.brands.length;
},
category_totalRows:function category_totalRows(){
return this.categories.length;
}}),

mounted:function mounted(){
this.changeSidebarProperties();
this.paginate_products(this.product_perPage,0);
},
methods:_objectSpread(_objectSpread(_objectSpread({},Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapActions"])(["changeSidebarProperties","changeThemeMode","logout"])),Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapGetters"])(["currentUser"])),{},(_objectSpread2={
logoutUser:function logoutUser(){
this.$store.dispatch("logout");
},
getResultValueClient:function getResultValueClient(result){
return result.name;
},
SearchClient:function SearchClient(result){
this.sale.client_id=result.id;
this.sale.client_name=result.name;
this.$refs.autocompletec.value="";
},
//focus for search product
Get_Categories:function Get_Categories(){
var _this=this;

// Start the progress bar.
nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.start();
nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.set(0.1);
axios.get("categoriespos?page="+1+"&SortField="+"id"+"&SortType="+"desc"+"&search="+this.search_category+"&limit="+10).then(function(response){
_this.categories=response.data.categories;

_this.paginate_Category(_this.category_perPage,0);// Complete the animation of theprogress bar.


nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.done();
_this.isLoading=false;
})["catch"](function(response){
// Complete the animation of theprogress bar.
nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.done();
setTimeout(function(){
_this.isLoading=false;
},500);
});
},
//---------------------------------------- Get All brands-----------------\\
Get_Brands:function Get_Brands(){
var _this2=this;

// Start the progress bar.
nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.start();
nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.set(0.1);
axios.get("brandspos?page="+1+"&SortField="+"id"+"&SortType="+"desc"+"&search="+this.search_brand+"&limit="+10).then(function(response){
_this2.brands=response.data.brands;

_this2.paginate_Brands(_this2.brand_perPage,0);// Complete the animation of theprogress bar.


nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.done();
_this2.isLoading=false;
})["catch"](function(response){
// Complete the animation of theprogress bar.
nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.done();
setTimeout(function(){
_this2.isLoading=false;
},500);
});
},
//---------------------- Event Select Payment Method ------------------------------\\
Selected_PaymentMethod:function Selected_PaymentMethod(value){
if(value=="credit card"){
setTimeout(function(){// this.loadStripe_payment();
},500);
}
},
SetLocal:function SetLocal(locale){
this.$i18n.locale=locale;
this.$store.dispatch("language/setLanguage",locale);
Fire.$emit("ChangeLanguage");
},
handleFullScreen:function handleFullScreen(){
_utils__WEBPACK_IMPORTED_MODULE_3__["default"].toggleFullScreen();
}},
_defineProperty(_objectSpread2,"logoutUser",function logoutUser(){
this.logout();
}),_defineProperty(_objectSpread2,"Product_paginatePerPage",function Product_paginatePerPage(){
this.paginate_products(this.product_perPage,0);
}),_defineProperty(_objectSpread2,"paginate_products",function paginate_products(pageSize,pageNumber){
var itemsToParse=this.products;
this.paginated_Products=itemsToParse.slice(pageNumber*pageSize,(pageNumber+1)*pageSize);
}),_defineProperty(_objectSpread2,"Product_onPageChanged",function Product_onPageChanged(page){
this.paginate_products(this.product_perPage,page-1);
this.getProducts(page);
}),_defineProperty(_objectSpread2,"BrandpaginatePerPage",function BrandpaginatePerPage(){
this.paginate_Brands(this.brand_perPage,0);
}),_defineProperty(_objectSpread2,"showSidebarBrand",function showSidebarBrand(){
this.$refs.searchBrand.focus();
}),_defineProperty(_objectSpread2,"hiddenSidebarBrand",function hiddenSidebarBrand(){
this.$refs.SearchProducts.focus();
}),_defineProperty(_objectSpread2,"showSidebarCategory",function showSidebarCategory(){
this.$refs.searchCategory.focus();
}),_defineProperty(_objectSpread2,"hiddenSidebarCategory",function hiddenSidebarCategory(){
this.$refs.SearchProducts.focus();
}),_defineProperty(_objectSpread2,"paginate_Brands",function paginate_Brands(pageSize,pageNumber){
var itemsToParse=this.brands;
this.paginated_Brands=itemsToParse.slice(pageNumber*pageSize,(pageNumber+1)*pageSize);
}),_defineProperty(_objectSpread2,"BrandonPageChanged",function BrandonPageChanged(page){
this.paginate_Brands(this.brand_perPage,page-1);
}),_defineProperty(_objectSpread2,"Category_paginatePerPage",function Category_paginatePerPage(){
this.paginate_Category(this.category_perPage,0);
}),_defineProperty(_objectSpread2,"paginate_Category",function paginate_Category(pageSize,pageNumber){
var itemsToParse=this.categories;
this.paginated_Category=itemsToParse.slice(pageNumber*pageSize,(pageNumber+1)*pageSize);
}),_defineProperty(_objectSpread2,"Category_onPageChanged",function Category_onPageChanged(page){
this.paginate_Category(this.category_perPage,page-1);
}),_defineProperty(_objectSpread2,"Submit_Pos",function Submit_Pos(){
var _this3=this;

// Start the progress bar.
nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.start();
nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.set(0.1);
this.$refs.create_pos.validate().then(function(success){
if(!success){
nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.done();

if(_this3.sale.client_id==""||_this3.sale.client_id===null){
_this3.makeToast("danger",_this3.$t("Choose_Customer"),_this3.$t("Failed"));
}else if(_this3.sale.warehouse_id==""||_this3.sale.warehouse_id===null){
_this3.makeToast("danger",_this3.$t("Choose_Warehouse"),_this3.$t("Failed"));
}else {
_this3.makeToast("danger",_this3.$t("Please_fill_the_form_correctly"),_this3.$t("Failed"));
}
}else {
if(_this3.verifiedForm()){
Fire.$emit("pay_now");
}else {
nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.done();
}
}
});
}),_defineProperty(_objectSpread2,"submit_Update_Detail",function submit_Update_Detail(){
var _this4=this;

this.$refs.Update_Detail.validate().then(function(success){
if(!success){
return;
}else {
_this4.Update_Detail();
}
});
}),_defineProperty(_objectSpread2,"Submit_Customer",function Submit_Customer(){
var _this5=this;

// Start the progress bar.
nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.start();
nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.set(0.1);
this.$refs.Create_Customer.validate().then(function(success){
if(!success){
nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.done();

_this5.makeToast("danger",_this5.$t("Please_fill_the_form_correctly"),_this5.$t("Failed"));
}else {
_this5.Create_Client();
}
});
}),_defineProperty(_objectSpread2,"Create_Client",function Create_Client(){
var _this6=this;

axios.post("clients/pos",{
name:this.client.name,
email:this.client.email,
phone:this.client.phone,
country:this.client.country,
city:this.client.city,
adresse:this.client.adresse,
NIT:this.client.NIT,
NRC:this.client.NRC,
giro:this.client.giro,
final_consumer:this.client.final_consumer,
big_consumer:this.client.big_consumer}).
then(function(response){
nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.done();

_this6.makeToast("success",_this6.$t("Create.TitleCustomer"),_this6.$t("Success"));

_this6.Get_Client_Without_Paginate();

_this6.sale.client_id=response.data.id_client;

_this6.$bvModal.hide("New_Customer");
})["catch"](function(error){
nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.done();

_this6.makeToast("danger",_this6.$t("InvalidData"),_this6.$t("Failed"));
});
}),_defineProperty(_objectSpread2,"New_Client",function New_Client(){
this.reset_Form_client();
this.$bvModal.show("New_Customer");
}),_defineProperty(_objectSpread2,"reset_Form_client",function reset_Form_client(){
this.client={
id:"",
name:"",
email:"",
phone:"",
country:"",
city:"",
adresse:"",
NIT:"",
giro:"",
NRC:"",
final_consumer:1,
big_consumer:0};

}),_defineProperty(_objectSpread2,"Get_Client_Without_Paginate",function Get_Client_Without_Paginate(){
var _this7=this;

axios.get("Get_Clients_Without_Paginate").then(function(_ref){
var data=_ref.data;
return _this7.clients=data;
});
console.log(this.clients);
}),_defineProperty(_objectSpread2,"getValidationState",function getValidationState(_ref2){
var dirty=_ref2.dirty,
validated=_ref2.validated,
_ref2$valid=_ref2.valid,
valid=_ref2$valid===void 0?null:_ref2$valid;
return dirty||validated?valid:null;
}),_defineProperty(_objectSpread2,"makeToast",function makeToast(variant,msg,title){
this.$root.$bvToast.toast(msg,{
title:title,
variant:variant,
solid:true});

}),_defineProperty(_objectSpread2,"Selected_Warehouse",function Selected_Warehouse(value){
this.Get_Products_By_Warehouse(value);
}),_defineProperty(_objectSpread2,"Get_Products_By_Warehouse",function Get_Products_By_Warehouse(id){
var _this8=this;

axios.get("Products/Warehouse/"+id+"?stock="+1).then(function(_ref3){
var data=_ref3.data;
return _this8.products=data;
});
}),_defineProperty(_objectSpread2,"add_product",function add_product(code){
if(this.details.some(function(detail){
return detail.code===code;
})){
this.makeToast("warning",this.$t("AlreadyAdd"),this.$t("Warning"));// Complete the animation of theprogress bar.

nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.done();
}else {
if(this.details.length<13){
if(this.details.length>0){
this.order_detail_id();
}else if(this.details.length===0){
this.product.detail_id=1;
}

this.details.push(this.product);
}else {
this.makeToast("warning",this.$t("max13"),this.$t("Warning"));
nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.done();
}
}

this.$refs.SearchProducts.focus();
}),_defineProperty(_objectSpread2,"order_detail_id",function order_detail_id(){
this.product.detail_id=0;
var len=this.details.length;
this.product.detail_id=this.details[len-1].detail_id+1;
}),_defineProperty(_objectSpread2,"Modal_Update_Detail",function Modal_Update_Detail(detail){
this.detail={};
this.detail.name=detail.name;
this.detail.detail_id=detail.detail_id;
this.detail.Unit_price=detail.Unit_price;
this.detail.tax_method=detail.tax_method;
this.detail.discount_Method=detail.discount_Method;
this.detail.discount=detail.discount;
this.detail.quantity=detail.quantity;
this.detail.tax_percent=detail.tax_percent;
this.detail.taxe=detail.taxe;
this.$bvModal.show("form_Update_Detail");
}),_defineProperty(_objectSpread2,"Update_Detail",function Update_Detail(){
for(var i=0;i<this.details.length;i++){
if(this.details[i].detail_id===this.detail.detail_id){
this.details[i].tax_percent=this.detail.tax_percent;
this.details[i].Unit_price=this.detail.Unit_price;
this.details[i].quantity=this.detail.quantity;
this.details[i].tax_method=this.detail.tax_method;
this.details[i].discount_Method=this.detail.discount_Method;
this.details[i].discount=this.detail.discount;

if(this.details[i].discount_Method=="2"){
//Fixed
this.details[i].DiscountNet=this.detail.discount;
}else {
//Percentage %
this.details[i].DiscountNet=parseFloat(this.detail.Unit_price*this.details[i].discount/100);
}

if(this.details[i].tax_method=="1"){
//Exclusive
this.details[i].Net_price=parseFloat(this.detail.Unit_price-this.details[i].DiscountNet);
this.details[i].taxe=parseFloat(this.detail.tax_percent*(this.detail.Unit_price-this.details[i].DiscountNet)/100);
this.details[i].Total_price=parseFloat(this.details[i].Net_price+this.details[i].taxe);
}else {
//Inclusive
this.details[i].Net_price=parseFloat((this.detail.Unit_price-this.details[i].DiscountNet)/(this.detail.tax_percent/100+1));
this.details[i].taxe=parseFloat(this.detail.Unit_price-this.details[i].Net_price-this.details[i].DiscountNet);
this.details[i].Total_price=parseFloat(this.details[i].Net_price+this.details[i].taxe);
}

this.$forceUpdate();
}
}

this.CaclulTotal();
this.$bvModal.hide("form_Update_Detail");
}),_defineProperty(_objectSpread2,"verifiedForm",function verifiedForm(){
if(this.details.length<=0){
this.makeToast("warning",this.$t("AddProductToList"),this.$t("Warning"));
return false;
}else {
var count=0;

for(var i=0;i<this.details.length;i++){
if(this.details[i].quantity==""||this.details[i].quantity===0){
count+=1;
}
}

if(count>0){
this.makeToast("warning",this.$t("AddQuantity"),this.$t("Warning"));
return false;
}else {
return true;
}
}
}),_defineProperty(_objectSpread2,"CreatePOS",function CreatePOS(){
var _this9=this;

nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.start();
nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.set(0.1);
axios.post("pos/CreatePOS",{
client_id:this.sale.client_id,
warehouse_id:this.sale.warehouse_id,
tax_rate:this.sale.tax_rate,
TaxNet:this.sale.TaxNet,
discount:this.sale.discount,
shipping:this.sale.shipping,
details:this.details,
GrandTotal:this.GrandTotal,
payment:this.payment}).
then(function(response){
if(response.data.success===true){
// Complete the animation of theprogress bar.
nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.done();

_this9.Reset_Pos();

_this9.makeToast("success",_this9.$t("sendtocheckin"),_this9.$t("Success"));
}
})["catch"](function(error){
// Complete the animation of theprogress bar.
nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.done();

_this9.makeToast("danger",_this9.$t("InvalidData"),_this9.$t("Failed"));
});
this.$refs.SearchProducts.focus();
}),_defineProperty(_objectSpread2,"formatNumber",function formatNumber(number,dec){
var value=(typeof number==="string"?number:number.toString()).split(".");
if(dec<=0)return value[0];
var formated=value[1]||"";
if(formated.length>dec)return "".concat(value[0],".").concat(formated.substr(0,dec));

while(formated.length<dec){
formated+="0";
}

return "".concat(value[0],".").concat(formated);
}),_defineProperty(_objectSpread2,"Get_Product_Details",function Get_Product_Details(product,product_id){
var _this10=this;

axios.get("Products/"+product_id).then(function(response){
_this10.product.discount=0;
_this10.product.DiscountNet=0;
_this10.product.discount_Method="2";
_this10.product.product_id=response.data.id;
_this10.product.name=response.data.name;
_this10.product.Net_price=response.data.Net_price;
_this10.product.Total_price=response.data.Total_price;
_this10.product.Unit_price=response.data.Unit_price;
_this10.product.taxe=response.data.tax_price;
_this10.product.tax_method=response.data.tax_method;
_this10.product.tax_percent=response.data.tax_percent;
_this10.product.unitSale=response.data.unitSale;
_this10.product.product_variant_id=product.product_variant_id;
_this10.product.code=product.code;

_this10.add_product(product.code);

_this10.CaclulTotal();// Complete the animation of theprogress bar.


nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.done();
});
}),_defineProperty(_objectSpread2,"CaclulTotal",function CaclulTotal(){
this.total=0;

for(var i=0;i<this.details.length;i++){
var tax=this.details[i].taxe*this.details[i].quantity;
this.details[i].subtotal=parseFloat(this.details[i].quantity*this.details[i].Net_price+tax);
this.total=parseFloat(this.total+this.details[i].subtotal);
}

var total_without_discount=parseFloat(this.total-this.sale.discount);
this.sale.TaxNet=parseFloat(total_without_discount*this.sale.tax_rate/100);
this.GrandTotal=parseFloat(total_without_discount+this.sale.TaxNet+this.sale.shipping);
}),_defineProperty(_objectSpread2,"Verified_Qty",function Verified_Qty(detail,id){
for(var i=0;i<this.details.length;i++){
if(this.details[i].detail_id===id){
if(isNaN(detail.quantity)){
this.details[i].quantity=detail.current;
}

if(detail.quantity>detail.current){
this.makeToast("warning",this.$t("LowStock"),this.$t("Warning"));
this.details[i].quantity=detail.current;
}else {
this.details[i].quantity=detail.quantity;
}
}
}

this.$forceUpdate();
this.CaclulTotal();
}),_defineProperty(_objectSpread2,"increment",function increment(detail,id){
for(var i=0;i<this.details.length;i++){
if(this.details[i].detail_id==id){
if(this.details[i].quantity+1>this.details[i].current){
this.makeToast("warning",this.$t("LowStock"),this.$t("Warning"));
}else {
this.details[i].quantity++;
}
}
}

this.CaclulTotal();
this.$forceUpdate();
this.$refs.SearchProducts.focus();
}),_defineProperty(_objectSpread2,"decrement",function decrement(detail,id){
for(var i=0;i<this.details.length;i++){
if(this.details[i].detail_id==id){
if(detail.quantity-1>detail.current||detail.quantity-1<1){
this.makeToast("warning",this.$t("LowStock"),this.$t("Warning"));
}else {
this.details[i].quantity--;
}
}
}

this.CaclulTotal();
this.$forceUpdate();
}),_defineProperty(_objectSpread2,"keyup_OrderTax",function keyup_OrderTax(){
if(isNaN(this.sale.tax_rate)){
this.sale.tax_rate=0;
}else {
this.CaclulTotal();
}
}),_defineProperty(_objectSpread2,"keyup_Discount",function keyup_Discount(){
if(isNaN(this.sale.discount)){
this.sale.discount=0;
}else {
this.CaclulTotal();
}
}),_defineProperty(_objectSpread2,"keyup_Price_Product",function keyup_Price_Product(detail,id){
for(var i=0;i<this.details.length;i++){
if(this.details[i].detail_id==id){
this.details[i].Net_price=detail.Net_price;
}
}

this.CaclulTotal();
this.$forceUpdate();
}),_defineProperty(_objectSpread2,"keyup_Shipping",function keyup_Shipping(){
if(isNaN(this.sale.shipping)){
this.sale.shipping=0;
}else {
this.CaclulTotal();
}
}),_defineProperty(_objectSpread2,"keyup_Cash",function keyup_Cash(){
if(isNaN(this.payment.cash)){
this.payment.cash=0;
}
}),_defineProperty(_objectSpread2,"keyup_Change",function keyup_Change(){
this.payment.change=this.formatNumber(this.payment.cash-this.payment.amount,2);
this.$forceUpdate();// if (isNaN(this.payment.cash)) {
//   this.payment.change = 0;
// }else{
//   this.payment.change = payment.amount-payment.cash;
// }
}),_defineProperty(_objectSpread2,"delete_Product_Detail",function delete_Product_Detail(id){
for(var i=0;i<this.details.length;i++){
if(id===this.details[i].detail_id){
this.details.splice(i,1);
this.CaclulTotal();
}
}

this.$refs.SearchProducts.focus();
}),_defineProperty(_objectSpread2,"Reset_Pos",function Reset_Pos(){
this.details=[];
this.product={};
this.sale.client_id="";
this.sale.tax_rate=0;
this.sale.TaxNet=0;
this.sale.shipping=0;
this.sale.discount=0;
this.sale.warehouse_id=this.currentUser.warehouse_id;
this.GrandTotal=0;
this.total=0;
this.category_id="";
this.brand_id="";
this.search="";
this.getProducts(1);
this.$refs.SearchProducts.focus();
}),_defineProperty(_objectSpread2,"Check_Product_Exist",function Check_Product_Exist(product,id){
this.audio.play();// Start the progress bar.

nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.start();
nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.set(0.1);
this.product={};
this.product.current=product.qte_sale;

if(product.qte_sale<1){
this.product.quantity=product.qte_sale;
}else {
this.product.quantity=1;
}

this.Get_Product_Details(product,id);
nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.done();
}),_defineProperty(_objectSpread2,"Products_by_Category",function Products_by_Category(id){
this.category_id=id;
this.getProducts(1);
this.$refs.sidebar_category.hide();
}),_defineProperty(_objectSpread2,"Products_by_Brands",function Products_by_Brands(id){
this.brand_id=id;
this.getProducts(1);
this.$refs.sidebar_brand.hide();
}),_defineProperty(_objectSpread2,"getAllCategory",function getAllCategory(){
this.category_id="";
this.getProducts(1);
this.$refs.sidebar_category.hide();
}),_defineProperty(_objectSpread2,"GetAllBrands",function GetAllBrands(){
this.brand_id="";
this.getProducts(1);
this.$refs.sidebar_brand.hide();
}),_defineProperty(_objectSpread2,"getResultValue",function getResultValue(result){
return result.code+" "+"("+result.name+")";
}),_defineProperty(_objectSpread2,"SearchProduct",function SearchProduct(result){
this.product={};

if(this.details.length>0&&this.details.some(function(detail){
return detail.code===result.code;
})){
this.makeToast("warning",this.$t("AlreadyAdd"),this.$t("Warning"));
}else {
this.product.code=result.code;
this.product.stock=result.qte_sale;

if(result.qte_sale<1){
this.product.quantity=result.qte_sale;
}else {
this.product.quantity=1;
}

this.product.product_variant_id=result.product_variant_id;
this.Get_Product_Details(result.id);
}

this.$refs.autocomplete.value="";
}),_defineProperty(_objectSpread2,"getProducts",function getProducts(){
var _this11=this;

var page=arguments.length>0&&arguments[0]!==undefined?arguments[0]:1;
// Start the progress bar.
nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.start();
nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.set(0.1);
axios.get("GetProductsByParametre?page="+page+"&category_id="+this.category_id+"&brand_id="+this.brand_id+"&warehouse_id="+this.sale.warehouse_id+"&search="+this.SearchProduct+"&stock="+1).then(function(response){
// this.products = [];
_this11.products=response.data.products;
_this11.product_totalRows=response.data.totalRows;

_this11.Product_paginatePerPage();// Complete the animation of theprogress bar.


nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.done();
})["catch"](function(response){
// Complete the animation of theprogress bar.
nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.done();
});
}),_defineProperty(_objectSpread2,"GetElementsPos",function GetElementsPos(){
var _this12=this;

axios.get("pos/GetELementPos").then(function(response){
console.log(_this12.currentUser);
_this12.clients=response.data.clients;
_this12.warehouses=response.data.warehouses;
_this12.categories=response.data.categories;
_this12.brands=response.data.brands;
_this12.sale.warehouse_id=_this12.currentUser.warehouse_id;
_this12.sale.client_id=response.data.defaultClient;

_this12.getProducts();

_this12.paginate_Brands(_this12.brand_perPage,0);

_this12.paginate_Category(_this12.category_perPage,0);

_this12.stripe_key=response.data.stripe_key;
_this12.isLoading=false;

_this12.$refs.SearchProducts.focus();
})["catch"](function(response){
_this12.isLoading=false;
});
}),_objectSpread2)),
//-------------------- Created Function -----\\
created:function created(){
var _this13=this;

this.GetElementsPos();
Fire.$on("pay_now",function(){
setTimeout(function(){
_this13.payment.amount=_this13.formatNumber(_this13.GrandTotal,2);
_this13.payment.cash=_this13.formatNumber(_this13.GrandTotal,2);
_this13.payment.Reglement="Cash";// this.$bvModal.show("Add_Payment");

_this13.CreatePOS();// Complete the animation of theprogress bar.


nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.done();
},500);
});
this.$refs.SearchProducts.focus();
}};


/***/},

/***/"./node_modules/vue-autofocus-directive/dist/vue-autofocus-directive.js":
/*!******************************************************************************!*\
  !*** ./node_modules/vue-autofocus-directive/dist/vue-autofocus-directive.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/function node_modulesVueAutofocusDirectiveDistVueAutofocusDirectiveJs(module,exports,__webpack_require__){

!function(e,t){module.exports=t();}("undefined"!=typeof self?self:this,function(){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports;}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o});},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0});},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e){n.d(o,r,function(t){return e[t];}.bind(null,r));}return o;},n.n=function(e){var t=e&&e.__esModule?function(){return e.default;}:function(){return e;};return n.d(t,"a",t),t;},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t);},n.p="",n(n.s=0);}([function(e,t,n){n.r(t);var o={inserted:function inserted(e,t){(void 0===t.value||t.value)&&e.focus();}};t.default=o;}]);});

/***/},

/***/"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/src/views/app/pages/pos.vue?vue&type=template&id=4cc49487&":
/*!************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/src/views/app/pages/pos.vue?vue&type=template&id=4cc49487& ***!
  \************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/function node_modulesVueLoaderLibLoadersTemplateLoaderJsNode_modulesVueLoaderLibIndexJsResourcesSrcViewsAppPagesPosVueVueTypeTemplateId4cc49487(module,__webpack_exports__,__webpack_require__){
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"render",function(){return render;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"staticRenderFns",function(){return staticRenderFns;});
var render=function render(){
var _vm=this;
var _h=_vm.$createElement;
var _c=_vm._self._c||_h;
return _c("div",{staticClass:"pos_page"},[
_c(
"div",
{
staticClass:
"container-fluid p-0 app-admin-wrap layout-sidebar-large clearfix",
attrs:{id:"pos"}},

[
_vm.isLoading?
_c("div",{
staticClass:"loading_page spinner spinner-primary mr-3"}):

_vm._e(),
_vm._v(" "),
!_vm.isLoading?
_c(
"b-row",
[
_c(
"b-col",
{attrs:{md:"5"}},
[
_c(
"b-card",
{staticClass:"card-order",attrs:{"no-body":""}},
[
_c("div",{staticClass:"main-header"},[
_c(
"div",
{
directives:[
{
name:"show",
rawName:"v-show",
value:
_vm.currentUserPermissions&&
_vm.currentUserPermissions.includes(
"dashboard"),

expression:
"currentUserPermissions && (currentUserPermissions.includes('dashboard'))"}],


staticClass:"logo"},

[
_c(
"router-link",
{attrs:{to:"/app/dashboard"}},
[
_c("img",{
attrs:{
src:"/images/"+_vm.currentUser.logo,
alt:"",
width:"60",
height:"60"}})])],





1),

_vm._v(" "),
_c("div",{staticClass:"mx-auto"}),
_vm._v(" "),
_c("div",{staticClass:"header-part-right"},[
_c("i",{
staticClass:
"i-Full-Screen header-icon d-none d-sm-inline-block",
on:{click:_vm.handleFullScreen}}),

_vm._v(" "),
_c(
"div",
{staticClass:"dropdown"},
[
_c(
"b-dropdown",
{
staticClass:"m-md-2",
attrs:{
id:"dropdown",
text:"Dropdown Button",
"toggle-class":"text-decoration-none",
"no-caret":"",
right:"",
variant:"link"}},


[
_c("template",{slot:"button-content"},[
_c("i",{
staticClass:
"i-Globe text-muted header-icon",
attrs:{
role:"button",
id:"dropdownMenuButton",
"data-toggle":"dropdown",
"aria-haspopup":"true",
"aria-expanded":"false"}})]),



_vm._v(" "),
_c(
"vue-perfect-scrollbar",
{
ref:"myData",
staticClass:
"dropdown-menu-left rtl-ps-none notification-dropdown ps scroll",
attrs:{
settings:{
suppressScrollX:true,
wheelPropagation:false}}},



[
_c(
"div",
{staticClass:"menu-icon-grid"},
[
_c(
"a",
{
on:{
click:function click($event){
return _vm.SetLocal("es");
}}},


[
_c("i",{
staticClass:
"flag-icon flag-icon-squared flag-icon-es",
attrs:{title:"es"}}),

_vm._v(" "),
_c(
"span",
{staticClass:"title-lang"},
[_vm._v("Español")])]),



_vm._v(" "),
_c(
"a",
{
on:{
click:function click($event){
return _vm.SetLocal("en");
}}},


[
_c("i",{
staticClass:
"flag-icon flag-icon-squared flag-icon-gb",
attrs:{title:"en"}}),

_vm._v(
" English\n                      ")])])])],








2)],


1),

_vm._v(" "),
_c(
"div",
{staticClass:"dropdown"},
[
_c(
"b-dropdown",
{
staticClass:
"m-md-2 user col align-self-end",
attrs:{
id:"dropdown-1",
text:"Dropdown Button",
"toggle-class":"text-decoration-none",
"no-caret":"",
variant:"link",
right:""}},


[
_c("template",{slot:"button-content"},[
_c("img",{
attrs:{
src:
"/images/avatar/"+
_vm.currentUser.avatar,
id:"userDropdown",
alt:"",
"data-toggle":"dropdown",
"aria-haspopup":"true",
"aria-expanded":"false"}})]),



_vm._v(" "),
_c(
"div",
{
staticClass:"dropdown-menu-left",
attrs:{
"aria-labelledby":"userDropdown"}},


[
_c(
"div",
{staticClass:"dropdown-header"},
[
_c("i",{
staticClass:"i-Lock-User mr-1"}),

_vm._v(" "),
_c("span",[
_vm._v(
_vm._s(_vm.currentUser.username))])]),




_vm._v(" "),
_vm.currentUserPermissions&&
_vm.currentUserPermissions.includes(
"setting_system")?

_c(
"router-link",
{
staticClass:"dropdown-item",
attrs:{
to:
"/app/settings/System_settings"}},


[
_vm._v(
_vm._s(_vm.$t("Settings")))]):



_vm._e(),
_vm._v(" "),
_c(
"a",
{
staticClass:"dropdown-item",
attrs:{href:"#"},
on:{
click:function click($event){
$event.preventDefault();
return _vm.logoutUser($event);
}}},


[_vm._v(_vm._s(_vm.$t("logout")))])],


1)],


2)],


1)])]),



_vm._v(" "),
_c(
"validation-observer",
{ref:"create_pos"},
[
_c(
"b-form",
{
on:{
submit:function submit($event){
$event.preventDefault();
return _vm.Submit_Pos($event);
}}},


[
_c(
"b-card-body",
[
_c(
"b-row",
[
_c(
"b-col",
{
attrs:{
lg:"12",
md:"12",
sm:"12"}},


[
_c("validation-provider",{
attrs:{
name:"Customer",
rules:{required:true}},

scopedSlots:_vm._u(
[
{
key:"default",
fn:function fn(ref){
var valid=ref.valid;
var errors=ref.errors;
return _c(
"b-input-group",
{
staticClass:
"input-customer"},

[
_c("v-select",{
staticClass:
"w-100",
class:{
"is-invalid":!!errors.length},

attrs:{
state:errors[0]?
false:
valid?
true:
null,
reduce:function reduce(
label)
{
return label.value;
},
placeholder:_vm.$t(
"Choose_Customer"),

options:_vm.clients.map(
function(
clients)
{
return {
label:
clients.name+
"-"+
clients.final_consumer+
" ("+
clients.phone+
")",
value:
clients.id};

})},


model:{
value:
_vm.sale.
client_id,
callback:function callback(
$$v)
{
_vm.$set(
_vm.sale,
"client_id",
$$v);

},
expression:
"sale.client_id"}}),


_vm._v(" "),
_c(
"b-input-group-append",
[
_c(
"b-button",
{
attrs:{
variant:
"primary"},

on:{
click:function click(
$event)
{
return _vm.New_Client();
}}},


[
_c("span",[
_c("i",{
staticClass:
"i-Add-User"})])])],





1)],


1);

}}],


null,
false,
1903441574)})],



1),

_vm._v(" "),
_c(
"b-col",
{
attrs:{
lg:"12",
md:"12",
sm:"12"}},


[
_c("validation-provider",{
attrs:{
name:"warehouse",
rules:{required:true}},

scopedSlots:_vm._u(
[
{
key:"default",
fn:function fn(ref){
var valid=ref.valid;
var errors=ref.errors;
return _c(
"b-form-group",
{staticClass:"mt-2"},
[
_c("v-select",{
class:{
"is-invalid":!!errors.length},

attrs:{
state:errors[0]?
false:
valid?
true:
null,
disabled:
_vm.details.
length>0,
reduce:function reduce(
label)
{
return label.value;
},
placeholder:_vm.$t(
"Choose_Warehouse"),

options:_vm.warehouses.map(
function(
warehouses)
{
return {
label:
warehouses.name,
value:
warehouses.id};

})},


on:{
input:
_vm.Selected_Warehouse},

model:{
value:
_vm.sale.
warehouse_id,
callback:function callback(
$$v)
{
_vm.$set(
_vm.sale,
"warehouse_id",
$$v);

},
expression:
"sale.warehouse_id"}})],



1);

}}],


null,
false,
1940612659)})],



1),

_vm._v(" "),
_c(
"b-col",
{
staticClass:"mt-2",
attrs:{md:"12"}},

[
_c(
"div",
{staticClass:"pos-detail"},
[
_c(
"div",
{
staticClass:
"table-responsive"},

[
_c(
"table",
{
staticClass:
"table table-striped"},

[
_c("thead",[
_c("tr",[
_c(
"th",
{
attrs:{
scope:"col"}},


[
_vm._v(
_vm._s(
_vm.$t(
"ProductName")))]),





_vm._v(" "),
_c(
"th",
{
attrs:{
scope:"col"}},


[
_vm._v(
_vm._s(
_vm.$t(
"Price")))]),





_vm._v(" "),
_c(
"th",
{
staticClass:
"text-center",
attrs:{
scope:"col"}},


[
_vm._v(
_vm._s(
_vm.$t(
"Qty")))]),





_vm._v(" "),
_c(
"th",
{
staticClass:
"text-center",
attrs:{
scope:"col"}},


[
_vm._v(
_vm._s(
_vm.$t(
"SubTotal")))]),





_vm._v(" "),
_c(
"th",
{
staticClass:
"text-center",
attrs:{
scope:"col"}},


[
_c("i",{
staticClass:
"fa fa-trash"})])])]),





_vm._v(" "),
_c(
"tbody",
[
_vm.details.
length<=0?
_c("tr",[
_c(
"td",
{
attrs:{
colspan:
"5"}},


[
_vm._v(
_vm._s(
_vm.$t(
"NodataAvailable")))])]):






_vm._e(),
_vm._v(" "),
_vm._l(
_vm.details,
function(
detail,
index)
{
return _c(
"tr",
{
key:index},

[
_c("td",[
_c(
"span",
[
_vm._v(
_vm._s(
detail.code))]),




_vm._v(
" "),

_c("br"),
_vm._v(
" "),

_c(
"span",
{
staticClass:
"badge badge-success"},

[
_vm._v(
_vm._s(
detail.name))]),




_vm._v(
" "),

_c("i",{
staticClass:
"i-Edit",
on:{
click:function click(
$event)
{
return _vm.Modal_Update_Detail(
detail);

}}})]),



_vm._v(" "),
_c("td",[
_c(
"div",
{
staticClass:
"price"},

[
_c(
"input",
{
directives:[
{
name:
"model",
rawName:
"v-model.number",
value:
detail.Net_price,
expression:
"detail.Net_price",
modifiers:{
number:true}}],



staticClass:
"form-control",
domProps:{
value:
detail.Net_price},

on:{
keyup:function keyup(
$event)
{
return _vm.keyup_Price_Product(
detail,
detail.detail_id);

},
input:function input(
$event)
{
if(
$event.
target.
composing)
{
return;
}
_vm.$set(
detail,
"Net_price",
_vm._n(
$event.
target.
value));


},
blur:function blur(
$event)
{
return _vm.$forceUpdate();
}}})])]),






_vm._v(" "),
_c("td",[
_c(
"div",
{
staticClass:
"quantity"},

[
_c(
"b-input-group",
[
_c(
"b-input-group-prepend",
[
_c(
"span",
{
staticClass:
"btn btn-primary btn-sm",
on:{
click:function click(
$event)
{
return _vm.decrement(
detail,
detail.detail_id);

}}},


[
_vm._v(
"-")])]),





_vm._v(
" "),

_c(
"input",
{
directives:[
{
name:
"model",
rawName:
"v-model.number",
value:
detail.quantity,
expression:
"detail.quantity",
modifiers:{
number:true}}],



staticClass:
"form-control",
domProps:{
value:
detail.quantity},

on:{
keyup:function keyup(
$event)
{
return _vm.Verified_Qty(
detail,
detail.detail_id);

},
input:function input(
$event)
{
if(
$event.
target.
composing)
{
return;
}
_vm.$set(
detail,
"quantity",
_vm._n(
$event.
target.
value));


},
blur:function blur(
$event)
{
return _vm.$forceUpdate();
}}}),



_vm._v(
" "),

_c(
"b-input-group-append",
[
_c(
"span",
{
staticClass:
"btn btn-primary btn-sm",
on:{
click:function click(
$event)
{
return _vm.increment(
detail,
detail.detail_id);

}}},


[
_vm._v(
"+")])])],






1)],


1)]),


_vm._v(" "),
_c(
"td",
{
staticClass:
"text-center"},

[
_vm._v(
_vm._s(
_vm.formatNumber(
detail.subtotal,
2))+


" "+
_vm._s(
_vm.
currentUser.
currency))]),




_vm._v(" "),
_c("td",[
_c(
"a",
{
attrs:{
title:
"Delete"},

on:{
click:function click(
$event)
{
return _vm.delete_Product_Detail(
detail.detail_id);

}}},


[
_c(
"i",
{
staticClass:
"i-Close-Window text-25 text-danger"})])])]);







})],


2)])])])])],










1),

_vm._v(" "),
_c(
"div",
{staticClass:"footer_panel"},
[
_c(
"b-row",
[
_c(
"b-col",
{attrs:{md:"12"}},
[
_c(
"div",
{staticClass:"grandtotal"},
[
_c("span",[
_vm._v(
_vm._s(
_vm.$t("Total"))+

" : "+
_vm._s(
_vm.formatNumber(
_vm.GrandTotal,
2))+


" "+
_vm._s(
_vm.currentUser.
currency))])])]),







_vm._v(" "),
_c(
"b-col",
{
attrs:{
lg:"4",
md:"4",
sm:"12"}},


[
_c("validation-provider",{
attrs:{
name:"Discount",
rules:{
regex:/^\d*\.?\d*$/}},


scopedSlots:_vm._u(
[
{
key:"default",
fn:function fn(
validationContext)
{
return [
_c(
"b-form-group",
{
attrs:{
label:_vm.$t(
"Discount"),

append:"%"}},


[
_c(
"b-input-group",
{
attrs:{
append:
"$"}},


[
_c(
"b-form-input",
{
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"Discount-feedback",
label:
"Discount"},

on:{
keyup:function keyup(
$event)
{
return _vm.keyup_Discount();
}},

model:{
value:
_vm.
sale.
discount,
callback:function callback(
$$v)
{
_vm.$set(
_vm.sale,
"discount",
_vm._n(
$$v));


},
expression:
"sale.discount"}})],




1),

_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{
id:
"Discount-feedback"}},


[
_vm._v(
_vm._s(
validationContext.
errors[0]))])],





1)];


}}],


null,
false,
3937756813)})],



1),

_vm._v(" "),
_c(
"b-col",
{
attrs:{
lg:"4",
md:"4",
sm:"12"}},


[
_c("validation-provider",{
attrs:{
name:"Shipping",
rules:{
regex:/^\d*\.?\d*$/}},


scopedSlots:_vm._u(
[
{
key:"default",
fn:function fn(
validationContext)
{
return [
_c(
"b-form-group",
{
attrs:{
label:_vm.$t(
"Shipping")}},



[
_c(
"b-input-group",
{
attrs:{
append:
"$"}},


[
_c(
"b-form-input",
{
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"Shipping-feedback",
label:
"Shipping"},

on:{
keyup:function keyup(
$event)
{
return _vm.keyup_Shipping();
}},

model:{
value:
_vm.
sale.
shipping,
callback:function callback(
$$v)
{
_vm.$set(
_vm.sale,
"shipping",
_vm._n(
$$v));


},
expression:
"sale.shipping"}})],




1),

_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{
id:
"Shipping-feedback"}},


[
_vm._v(
_vm._s(
validationContext.
errors[0]))])],





1)];


}}],


null,
false,
2969562416)})],



1),

_vm._v(" "),
_c(
"b-col",
{attrs:{md:"6",sm:"12"}},
[
_c(
"b-button",
{
attrs:{
variant:
"danger ripple btn-rounded btn-block mt-1"},

on:{
click:function click($event){
return _vm.Reset_Pos();
}}},


[
_c("i",{
staticClass:"i-Power-2"}),

_vm._v(
"\n                        "+
_vm._s(
_vm.$t("Reset"))+

"\n                      ")])],




1),

_vm._v(" "),
_c(
"b-col",
{attrs:{md:"6",sm:"12"}},
[
_c(
"b-button",
{
attrs:{
type:"submit",
variant:
"primary ripple mt-1 btn-rounded btn-block"}},


[
_c("i",{
staticClass:"i-Checkout"}),

_vm._v(
"\n                        "+
_vm._s(
_vm.$t("sendtobox"))+

"\n                      ")])],




1)],


1)],


1)],


1)],


1)],


1),

_vm._v(" "),
_c(
"validation-observer",
{ref:"Update_Detail"},
[
_c(
"b-modal",
{
attrs:{
"hide-footer":"",
size:"md",
id:"form_Update_Detail",
title:_vm.detail.name}},


[
_c(
"b-form",
{
on:{
submit:function submit($event){
$event.preventDefault();
return _vm.submit_Update_Detail($event);
}}},


[
_c(
"b-row",
[
_c(
"b-col",
{
attrs:{
lg:"12",
md:"12",
sm:"12"}},


[
_c("validation-provider",{
attrs:{
name:"Product Price",
rules:{
required:true,
regex:/^\d*\.?\d*$/}},


scopedSlots:_vm._u(
[
{
key:"default",
fn:function fn(
validationContext)
{
return [
_c(
"b-form-group",
{
attrs:{
label:_vm.$t(
"ProductPrice"),

id:"Price-input"}},


[
_c("b-form-input",{
attrs:{
label:
"Product Price",
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"Price-feedback"},

model:{
value:
_vm.detail.
Unit_price,
callback:function callback(
$$v)
{
_vm.$set(
_vm.detail,
"Unit_price",
$$v);

},
expression:
"detail.Unit_price"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{
id:
"Price-feedback"}},


[
_vm._v(
_vm._s(
validationContext.
errors[0]))])],





1)];


}}],


null,
false,
2344671014)})],



1),

_vm._v(" "),
_c(
"b-col",
{
attrs:{
lg:"12",
md:"12",
sm:"12"}},


[
_c("validation-provider",{
attrs:{
name:"Tax Method",
rules:{required:true}},

scopedSlots:_vm._u(
[
{
key:"default",
fn:function fn(ref){
var valid=ref.valid;
var errors=ref.errors;
return _c(
"b-form-group",
{
attrs:{
label:_vm.$t(
"TaxMethod")}},



[
_c("v-select",{
class:{
"is-invalid":!!errors.length},

attrs:{
state:errors[0]?
false:
valid?
true:
null,
reduce:function reduce(
label)
{
return label.value;
},
placeholder:_vm.$t(
"Choose_Method"),

options:[
{
label:
"Exclusive",
value:"1"},

{
label:
"Inclusive",
value:"2"}]},



model:{
value:
_vm.detail.
tax_method,
callback:function callback(
$$v)
{
_vm.$set(
_vm.detail,
"tax_method",
$$v);

},
expression:
"detail.tax_method"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
[
_vm._v(
_vm._s(
errors[0]))])],





1);

}}],


null,
false,
3596778309)})],



1),

_vm._v(" "),
_c(
"b-col",
{
attrs:{
lg:"12",
md:"12",
sm:"12"}},


[
_c("validation-provider",{
attrs:{
name:"Tax",
rules:{
required:true,
regex:/^\d*\.?\d*$/}},


scopedSlots:_vm._u(
[
{
key:"default",
fn:function fn(
validationContext)
{
return [
_c(
"b-form-group",
{
attrs:{
label:_vm.$t(
"Tax")}},



[
_c(
"b-input-group",
{
attrs:{
append:"%"}},


[
_c(
"b-form-input",
{
attrs:{
label:
"Tax",
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"Tax-feedback"},

model:{
value:
_vm.
detail.
tax_percent,
callback:function callback(
$$v)
{
_vm.$set(
_vm.detail,
"tax_percent",
$$v);

},
expression:
"detail.tax_percent"}})],




1),

_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{
id:
"Tax-feedback"}},


[
_vm._v(
_vm._s(
validationContext.
errors[0]))])],





1)];


}}],


null,
false,
3195841040)})],



1),

_vm._v(" "),
_c(
"b-col",
{
attrs:{
lg:"12",
md:"12",
sm:"12"}},


[
_c("validation-provider",{
attrs:{
name:"Discount Method",
rules:{required:true}},

scopedSlots:_vm._u(
[
{
key:"default",
fn:function fn(ref){
var valid=ref.valid;
var errors=ref.errors;
return _c(
"b-form-group",
{
attrs:{
label:_vm.$t(
"Discount_Method")}},



[
_c("v-select",{
class:{
"is-invalid":!!errors.length},

attrs:{
reduce:function reduce(
label)
{
return label.value;
},
placeholder:_vm.$t(
"Choose_Method"),

state:errors[0]?
false:
valid?
true:
null,
options:[
{
label:
"Percent %",
value:"1"},

{
label:
"Fixed",
value:"2"}]},



model:{
value:
_vm.detail.
discount_Method,
callback:function callback(
$$v)
{
_vm.$set(
_vm.detail,
"discount_Method",
$$v);

},
expression:
"detail.discount_Method"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
[
_vm._v(
_vm._s(
errors[0]))])],





1);

}}],


null,
false,
1993049096)})],



1),

_vm._v(" "),
_c(
"b-col",
{
attrs:{
lg:"12",
md:"12",
sm:"12"}},


[
_c("validation-provider",{
attrs:{
name:"Discount Rate",
rules:{
required:true,
regex:/^\d*\.?\d*$/}},


scopedSlots:_vm._u(
[
{
key:"default",
fn:function fn(
validationContext)
{
return [
_c(
"b-form-group",
{
attrs:{
label:_vm.$t(
"Discount")}},



[
_c("b-form-input",{
attrs:{
label:
"Discount",
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"Discount-feedback"},

model:{
value:
_vm.detail.
discount,
callback:function callback(
$$v)
{
_vm.$set(
_vm.detail,
"discount",
$$v);

},
expression:
"detail.discount"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{
id:
"Discount-feedback"}},


[
_vm._v(
_vm._s(
validationContext.
errors[0]))])],





1)];


}}],


null,
false,
1756200962)})],



1),

_vm._v(" "),
_c(
"b-col",
{attrs:{md:"12"}},
[
_c(
"b-form-group",
[
_c(
"b-button",
{
attrs:{
variant:"primary",
type:"submit"}},


[
_vm._v(
_vm._s(_vm.$t("submit")))])],




1)],


1)],


1)],


1)],


1)],


1)],


1)],


1),

_vm._v(" "),
_c(
"b-col",
{attrs:{md:"7"}},
[
_c(
"b-card",
{staticClass:"list-grid"},
[
_c(
"b-row",
[
_c("b-col",{attrs:{md:"6"}},[
_c(
"button",
{
directives:[
{
name:"b-toggle",
rawName:"v-b-toggle.sidebar-category",
modifiers:{"sidebar-category":true}}],


staticClass:
"btn btn-outline-info mt-1 btn-block"},

[
_c("i",{staticClass:"i-Two-Windows"}),
_vm._v(
"\n                "+
_vm._s(_vm.$t("ListofCategory"))+
"\n              ")])]),




_vm._v(" "),
_c("b-col",{attrs:{md:"6"}},[
_c(
"button",
{
directives:[
{
name:"b-toggle",
rawName:"v-b-toggle.sidebar-brand",
modifiers:{"sidebar-brand":true}}],


staticClass:
"btn btn-outline-info mt-1 btn-block"},

[
_c("i",{staticClass:"i-Library"}),
_vm._v(
"\n                "+
_vm._s(_vm.$t("ListofBrand"))+
"\n              ")])]),




_vm._v(" "),
_c("b-col",{attrs:{md:"12 mt-2"}},[
_c("div",{staticClass:"input-group"},[
_c("input",{
directives:[
{
name:"autofocus",
rawName:"v-autofocus",
value:_vm.focusSearchProduct,
expression:"focusSearchProduct"},

{
name:"model",
rawName:"v-model",
value:_vm.SearchProduct,
expression:"SearchProduct"}],


ref:"SearchProducts",
staticClass:"form-control",
attrs:{
type:"text",
placeholder:_vm.$t(
"Search_Product_by_Code_Name")},


domProps:{value:_vm.SearchProduct},
on:{
keyup:function keyup($event){
return _vm.getProducts();
},
input:function input($event){
if($event.target.composing){
return;
}
_vm.SearchProduct=$event.target.value;
}}}),


_vm._v(" "),
_c(
"div",
{staticClass:"input-group-append"},
[
_c(
"span",
{staticClass:"input-group-text"},
[_c("i",{staticClass:"i-Bar-Code"})])])])]),





_vm._v(" "),
_c(
"div",
{
staticClass:
"col-md-12 d-flex flex-row flex-wrap bd-highlight list-item mt-2"},

_vm._l(_vm.products,function(product){
return _c(
"div",
{
staticClass:"card col-3",
on:{
click:function click($event){
return _vm.Check_Product_Exist(
product,
product.id);

}}},


[
_c("img",{
staticClass:"card-img-top",
attrs:{
alt:"",
src:"/images/products/"+product.image}}),


_vm._v(" "),
_c("div",{staticClass:"card-body"},[
_c("h5",{staticClass:"card-title"},[
_vm._v(
_vm._s(product.category)+
" -  "+
_vm._s(product.name))]),


_vm._v(" "),
_c(
"p",
{
staticClass:
"card-text text-muted text-small"},

[_vm._v(_vm._s(product.code))]),

_vm._v(" "),
_c(
"span",
{
staticClass:
"badge badge-primary w-15 w-sm-100 mb-2"},

[
_vm._v(
_vm._s(
_vm.formatNumber(
product.Net_price,
2))+


" "+
_vm._s(_vm.currentUser.currency))]),



_vm._v(" "),
_c(
"p",
{
staticClass:
"m-0 text-muted text-small w-15 w-sm-100 d-none d-lg-block item-badges"},

[
_c(
"span",
{staticClass:"badge badge-info"},
[
_vm._v(
_vm._s(
_vm.formatNumber(
product.qte_sale,
2))+


" "+
_vm._s(product.unitSale))])])])]);








}),
0)],


1),

_vm._v(" "),
_c(
"b-row",
[
_c(
"b-col",
{staticClass:"mt-4",attrs:{md:"12"}},
[
_c(
"b-pagination",
{
staticClass:
"my-0 gull-pagination align-items-center",
attrs:{
"total-rows":_vm.product_totalRows,
"per-page":_vm.product_perPage,
align:"center",
"first-text":"",
"last-text":""},

on:{change:_vm.Product_onPageChanged},
model:{
value:_vm.product_currentPage,
callback:function callback($$v){
_vm.product_currentPage=$$v;
},
expression:"product_currentPage"}},


[
_c(
"p",
{
staticClass:"list-arrow m-0",
attrs:{slot:"prev-text"},
slot:"prev-text"},

[
_c("i",{
staticClass:"i-Arrow-Left text-40"})]),



_vm._v(" "),
_c(
"p",
{
staticClass:"list-arrow m-0",
attrs:{slot:"next-text"},
slot:"next-text"},

[
_c("i",{
staticClass:"i-Arrow-Right text-40"})])])],






1)],


1)],


1)],


1),

_vm._v(" "),
_c(
"b-sidebar",
{
ref:"sidebar_brand",
attrs:{
id:"sidebar-brand",
title:_vm.$t("ListofBrand"),
"bg-variant":"white",
"backdrop-variant":_vm.variant,
right:"",
shadow:"",
backdrop:"",
visible:_vm.showSidebarBrands},

on:{
shown:_vm.showSidebarBrand,
hidden:_vm.hiddenSidebarBrand}},


[
_c(
"div",
{staticClass:"px-3 py-2"},
[
_c(
"b-row",
[
_c("b-col",{attrs:{md:"12 mt-2"}},[
_c("div",{staticClass:"input-group"},[
_c("input",{
directives:[
{
name:"model",
rawName:"v-model",
value:_vm.search_brand,
expression:"search_brand"}],


ref:"searchBrand",
staticClass:"form-control",
attrs:{
autofocus:"",
type:"text",
placeholder:_vm.$t("Search_this_table"),
id:"searchBrand"},

domProps:{value:_vm.search_brand},
on:{
keyup:function keyup($event){
return _vm.Get_Brands();
},
input:function input($event){
if($event.target.composing){
return;
}
_vm.search_brand=$event.target.value;
}}})])])],





1),

_vm._v(" "),
_c("b-row",[
_c(
"div",
{
staticClass:
"col-md-12 d-flex flex-row flex-wrap bd-highlight list-item mt-2"},

[
_c(
"div",
{
staticClass:"card o-hidden bd-highlight m-1",
class:{"brand-Active":_vm.brand_id==""},
on:{
click:function click($event){
return _vm.GetAllBrands();
}}},


[
_c(
"div",
{staticClass:"list-thumb d-flex"},
[
_c("img",{
attrs:{
alt:"",
src:"/images/no-image.png"}})]),




_vm._v(" "),
_c(
"div",
{staticClass:"flex-grow-1 d-bock"},
[
_c(
"div",
{
staticClass:
"card-body align-self-center d-flex flex-column justify-content-between align-items-lg-center"},

[
_c(
"div",
{staticClass:"item-title"},
[
_vm._v(
_vm._s(_vm.$t("All_Brand")))])])])]),









_vm._v(" "),
_vm._l(_vm.paginated_Brands,function(brand){
return _c(
"div",
{
key:brand.id,
staticClass:
"card o-hidden bd-highlight m-1",
class:{
"brand-Active":brand.id===_vm.brand_id},

on:{
click:function click($event){
return _vm.Products_by_Brands(brand.id);
}}},


[
_c("img",{
attrs:{
alt:"",
src:"/images/brands/"+brand.image}}),


_vm._v(" "),
_c(
"div",
{staticClass:"flex-grow-1 d-bock"},
[
_c(
"div",
{
staticClass:
"card-body align-self-center d-flex flex-column justify-content-between align-items-lg-center"},

[
_c(
"div",
{staticClass:"item-title"},
[_vm._v(_vm._s(brand.name))])])])]);







})],

2)]),


_vm._v(" "),
_c(
"b-row",
[
_c(
"b-col",
{staticClass:"mt-4",attrs:{md:"12"}},
[
_c(
"b-pagination",
{
staticClass:
"my-0 gull-pagination align-items-center",
attrs:{
"total-rows":_vm.brand_totalRows,
"per-page":_vm.brand_perPage,
align:"center",
"first-text":"",
"last-text":""},

on:{change:_vm.BrandonPageChanged},
model:{
value:_vm.brand_currentPage,
callback:function callback($$v){
_vm.brand_currentPage=$$v;
},
expression:"brand_currentPage"}},


[
_c(
"p",
{
staticClass:"list-arrow m-0",
attrs:{slot:"prev-text"},
slot:"prev-text"},

[
_c("i",{
staticClass:"i-Arrow-Left text-40"})]),



_vm._v(" "),
_c(
"p",
{
staticClass:"list-arrow m-0",
attrs:{slot:"next-text"},
slot:"next-text"},

[
_c("i",{
staticClass:"i-Arrow-Right text-40"})])])],






1)],


1)],


1)]),



_vm._v(" "),
_c(
"b-sidebar",
{
ref:"sidebar_category",
attrs:{
id:"sidebar-category",
title:_vm.$t("ListofCategory"),
visible:_vm.showSidebarCategorys,
backdrop:"",
"bg-variant":"white",
right:"",
shadow:""},

on:{
shown:_vm.showSidebarCategory,
hidden:_vm.hiddenSidebarCategory}},


[
_c(
"div",
{staticClass:"px-3 py-2"},
[
_c(
"b-row",
[
_c("b-col",{attrs:{md:"12 mt-2"}},[
_c("div",{staticClass:"input-group"},[
_c("input",{
directives:[
{
name:"autofocus",
rawName:"v-autofocus",
value:_vm.focusSearchCategory,
expression:"focusSearchCategory"},

{
name:"model",
rawName:"v-model",
value:_vm.search_category,
expression:"search_category"}],


ref:"searchCategory",
staticClass:"form-control",
attrs:{
type:"text",
placeholder:_vm.$t("Search_this_table")},

domProps:{value:_vm.search_category},
on:{
keyup:function keyup($event){
return _vm.Get_Categories();
},
input:function input($event){
if($event.target.composing){
return;
}
_vm.search_category=$event.target.value;
}}})])])],





1),

_vm._v(" "),
_c("b-row",[
_c(
"div",
{
staticClass:
"col-md-12 d-flex flex-row flex-wrap bd-highlight list-item mt-2"},

[
_c(
"div",
{
staticClass:"card o-hidden bd-highlight m-1",
class:{
"brand-Active":_vm.category_id==""},

on:{
click:function click($event){
return _vm.getAllCategory();
}}},


[
_c(
"div",
{staticClass:"list-thumb d-flex"},
[
_c("img",{
attrs:{
alt:"",
src:"/images/no-image.png"}})]),




_vm._v(" "),
_c(
"div",
{staticClass:"flex-grow-1 d-bock"},
[
_c(
"div",
{
staticClass:
"card-body align-self-center d-flex flex-column justify-content-between align-items-lg-center"},

[
_c(
"div",
{staticClass:"item-title"},
[
_vm._v(
_vm._s(_vm.$t("All_Category")))])])])]),









_vm._v(" "),
_vm._l(_vm.paginated_Category,function(
category)
{
return _c(
"div",
{
key:category.id,
staticClass:
"card o-hidden bd-highlight m-1",
class:{
"brand-Active":
category.id===_vm.category_id},

staticStyle:{height:"300px !important"},
on:{
click:function click($event){
return _vm.Products_by_Category(
category.id);

}}},


[
_c("img",{
attrs:{
alt:"",
src:
"/images/categorys/"+category.image}}),


_vm._v(" "),
_c(
"div",
{staticClass:"flex-grow-1 d-bock"},
[
_c(
"div",
{
staticClass:
"card-body align-self-center d-flex flex-column justify-content-between align-items-lg-center"},

[
_c(
"div",
{staticClass:"item-title"},
[_vm._v(_vm._s(category.name))])])])]);







})],

2)]),


_vm._v(" "),
_c(
"b-row",
[
_c(
"b-col",
{staticClass:"mt-4",attrs:{md:"12"}},
[
_c(
"b-pagination",
{
staticClass:
"my-0 gull-pagination align-items-center",
attrs:{
"total-rows":_vm.category_totalRows,
"per-page":_vm.category_perPage,
align:"center",
"first-text":"",
"last-text":""},

on:{change:_vm.Category_onPageChanged},
model:{
value:_vm.category_currentPage,
callback:function callback($$v){
_vm.category_currentPage=$$v;
},
expression:"category_currentPage"}},


[
_c(
"p",
{
staticClass:"list-arrow m-0",
attrs:{slot:"prev-text"},
slot:"prev-text"},

[
_c("i",{
staticClass:"i-Arrow-Left text-40"})]),



_vm._v(" "),
_c(
"p",
{
staticClass:"list-arrow m-0",
attrs:{slot:"next-text"},
slot:"next-text"},

[
_c("i",{
staticClass:"i-Arrow-Right text-40"})])])],






1)],


1)],


1)]),



_vm._v(" "),
_c(
"validation-observer",
{ref:"Create_Customer"},
[
_c(
"b-modal",
{
attrs:{
"hide-footer":"",
size:"lg",
id:"New_Customer",
title:_vm.$t("Add")}},


[
_c(
"b-form",
{
on:{
submit:function submit($event){
$event.preventDefault();
return _vm.Submit_Customer($event);
}}},


[
_c(
"b-row",
[
_c(
"b-col",
{attrs:{md:"6",sm:"12"}},
[
_c("validation-provider",{
attrs:{
name:"Name Customer",
rules:{required:true}},

scopedSlots:_vm._u(
[
{
key:"default",
fn:function fn(validationContext){
return [
_c(
"b-form-group",
{
attrs:{
label:_vm.$t(
"CustomerName")}},



[
_c("b-form-input",{
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"name-feedback",
label:"name"},

model:{
value:_vm.client.name,
callback:function callback(
$$v)
{
_vm.$set(
_vm.client,
"name",
$$v);

},
expression:
"client.name"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{
id:"name-feedback"}},


[
_vm._v(
_vm._s(
validationContext.
errors[0]))])],





1)];


}}],


null,
false,
2169107604)})],



1),

_vm._v(" "),
_c(
"b-col",
{attrs:{md:"6",sm:"12"}},
[
_c("validation-provider",{
attrs:{
name:"Email customer",
rules:{required:false}},

scopedSlots:_vm._u(
[
{
key:"default",
fn:function fn(validationContext){
return [
_c(
"b-form-group",
{
attrs:{
label:_vm.$t("Email")}},


[
_c("b-form-input",{
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"Email-feedback",
label:"Email"},

model:{
value:_vm.client.email,
callback:function callback(
$$v)
{
_vm.$set(
_vm.client,
"email",
$$v);

},
expression:
"client.email"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{
id:"Email-feedback"}},


[
_vm._v(
_vm._s(
validationContext.
errors[0]))])],





1)];


}}],


null,
false,
4213647611)})],



1),

_vm._v(" "),
_c(
"b-col",
{attrs:{md:"6",sm:"12"}},
[
_c("validation-provider",{
attrs:{
name:"Phone Customer",
rules:{required:true}},

scopedSlots:_vm._u(
[
{
key:"default",
fn:function fn(validationContext){
return [
_c(
"b-form-group",
{
attrs:{
label:_vm.$t("Phone")}},


[
_c("b-form-input",{
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"Phone-feedback",
label:"Phone"},

model:{
value:_vm.client.phone,
callback:function callback(
$$v)
{
_vm.$set(
_vm.client,
"phone",
$$v);

},
expression:
"client.phone"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{
id:"Phone-feedback"}},


[
_vm._v(
_vm._s(
validationContext.
errors[0]))])],





1)];


}}],


null,
false,
314120427)})],



1),

_vm._v(" "),
_c(
"b-col",
{attrs:{md:"6",sm:"12"}},
[
_c("validation-provider",{
attrs:{
name:"Country customer",
rules:{required:false}},

scopedSlots:_vm._u(
[
{
key:"default",
fn:function fn(validationContext){
return [
_c(
"b-form-group",
{
attrs:{
label:_vm.$t("Country")}},


[
_c("b-form-input",{
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"Country-feedback",
label:"Country"},

model:{
value:
_vm.client.country,
callback:function callback(
$$v)
{
_vm.$set(
_vm.client,
"country",
$$v);

},
expression:
"client.country"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{
id:"Country-feedback"}},


[
_vm._v(
_vm._s(
validationContext.
errors[0]))])],





1)];


}}],


null,
false,
2049988063)})],



1),

_vm._v(" "),
_c(
"b-col",
{attrs:{md:"6",sm:"12"}},
[
_c("validation-provider",{
attrs:{
name:"City Customer",
rules:{required:false}},

scopedSlots:_vm._u(
[
{
key:"default",
fn:function fn(validationContext){
return [
_c(
"b-form-group",
{
attrs:{
label:_vm.$t("City")}},


[
_c("b-form-input",{
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"City-feedback",
label:"City"},

model:{
value:_vm.client.city,
callback:function callback(
$$v)
{
_vm.$set(
_vm.client,
"city",
$$v);

},
expression:
"client.city"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{
id:"City-feedback"}},


[
_vm._v(
_vm._s(
validationContext.
errors[0]))])],





1)];


}}],


null,
false,
1625404240)})],



1),

_vm._v(" "),
_c(
"b-col",
{attrs:{md:"6",sm:"12"}},
[
_c("validation-provider",{
attrs:{
name:"Adress customer",
rules:{required:false}},

scopedSlots:_vm._u(
[
{
key:"default",
fn:function fn(validationContext){
return [
_c(
"b-form-group",
{
attrs:{
label:_vm.$t("Adress")}},


[
_c("b-form-input",{
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"Adress-feedback",
label:"Adress"},

model:{
value:
_vm.client.adresse,
callback:function callback(
$$v)
{
_vm.$set(
_vm.client,
"adresse",
$$v);

},
expression:
"client.adresse"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{
id:"Adress-feedback"}},


[
_vm._v(
_vm._s(
validationContext.
errors[0]))])],





1)];


}}],


null,
false,
3943535328)})],



1),

_vm._v(" "),
_vm.client.final_consumer==0?
_c(
"b-col",
{attrs:{md:"6",sm:"12"}},
[
_c("validation-provider",{
attrs:{
name:"NIT",
rules:{required:false}},

scopedSlots:_vm._u(
[
{
key:"default",
fn:function fn(
validationContext)
{
return [
_c(
"b-form-group",
{
attrs:{
label:_vm.$t("NIT")}},


[
_c("b-form-input",{
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"NIT-feedback",
label:"NIT"},

model:{
value:
_vm.client.NIT,
callback:function callback(
$$v)
{
_vm.$set(
_vm.client,
"NIT",
$$v);

},
expression:
"client.NIT"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{
id:"NIT-feedback"}},


[
_vm._v(
_vm._s(
validationContext.
errors[0]))])],





1)];


}}],


null,
false,
674790180)})],



1):

_vm._e(),
_vm._v(" "),
_vm.client.final_consumer==0?
_c(
"b-col",
{attrs:{md:"6",sm:"12"}},
[
_c("validation-provider",{
attrs:{
name:"NRC",
rules:{required:false}},

scopedSlots:_vm._u(
[
{
key:"default",
fn:function fn(
validationContext)
{
return [
_c(
"b-form-group",
{
attrs:{
label:_vm.$t("NRC")}},


[
_c("b-form-input",{
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"NRC-feedback",
label:"NRC"},

model:{
value:
_vm.client.NRC,
callback:function callback(
$$v)
{
_vm.$set(
_vm.client,
"NRC",
$$v);

},
expression:
"client.NRC"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{
id:"NRC-feedback"}},


[
_vm._v(
_vm._s(
validationContext.
errors[0]))])],





1)];


}}],


null,
false,
3154983368)})],



1):

_vm._e(),
_vm._v(" "),
_vm.client.final_consumer==0?
_c(
"b-col",
{attrs:{md:"6",sm:"12"}},
[
_c("validation-provider",{
attrs:{
name:"giro",
rules:{required:false}},

scopedSlots:_vm._u(
[
{
key:"default",
fn:function fn(
validationContext)
{
return [
_c(
"b-form-group",
{
attrs:{
label:_vm.$t("Giro")}},


[
_c("b-form-input",{
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"giro-feedback",
label:"giro"},

model:{
value:
_vm.client.giro,
callback:function callback(
$$v)
{
_vm.$set(
_vm.client,
"giro",
$$v);

},
expression:
"client.giro"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{
id:
"giro-feedback"}},


[
_vm._v(
_vm._s(
validationContext.
errors[0]))])],





1)];


}}],


null,
false,
3587835428)})],



1):

_vm._e(),
_vm._v(" "),
_c(
"b-col",
{
staticClass:"mt-2",
attrs:{md:"6",sm:"12"}},

[
_c("b-form-group",{
attrs:{label:_vm.$t("TypeClient")},
scopedSlots:_vm._u(
[
{
key:"default",
fn:function fn(ref){
var ariaDescribedby=
ref.ariaDescribedby;
return [
_c(
"b-form-radio",
{
attrs:{
"aria-describedby":ariaDescribedby,
name:"FinalConsumer",
value:"1"},

model:{
value:
_vm.client.
final_consumer,
callback:function callback($$v){
_vm.$set(
_vm.client,
"final_consumer",
$$v);

},
expression:
"client.final_consumer"}},


[
_vm._v(
_vm._s(
_vm.$t("FinalConsumer")))]),




_vm._v(" "),
_c(
"b-form-radio",
{
attrs:{
"aria-describedby":ariaDescribedby,
name:"FiscalCredit",
value:"0"},

model:{
value:
_vm.client.
final_consumer,
callback:function callback($$v){
_vm.$set(
_vm.client,
"final_consumer",
$$v);

},
expression:
"client.final_consumer"}},


[
_vm._v(
_vm._s(
_vm.$t("FiscalCredit")))])];





}}],


null,
false,
157667540)})],



1),

_vm._v(" "),
_vm.client.final_consumer==0?
_c(
"b-col",
{
staticClass:"mt-2",
attrs:{md:"6",sm:"12"}},

[
_c("b-form-group",{
attrs:{
label:_vm.$t("BigContributor")},

scopedSlots:_vm._u(
[
{
key:"default",
fn:function fn(ref){
var ariaDescribedby=
ref.ariaDescribedby;
return [
_c(
"b-form-radio",
{
attrs:{
"aria-describedby":ariaDescribedby,
name:"Si",
value:"1"},

model:{
value:
_vm.client.
big_consumer,
callback:function callback(
$$v)
{
_vm.$set(
_vm.client,
"big_consumer",
$$v);

},
expression:
"client.big_consumer"}},


[
_vm._v(
_vm._s(_vm.$t("Yes")))]),



_vm._v(" "),
_c(
"b-form-radio",
{
attrs:{
"aria-describedby":ariaDescribedby,
name:"No",
value:"0"},

model:{
value:
_vm.client.
big_consumer,
callback:function callback(
$$v)
{
_vm.$set(
_vm.client,
"big_consumer",
$$v);

},
expression:
"client.big_consumer"}},


[_vm._v("No")])];


}}],


null,
false,
672882077)})],



1):

_vm._e(),
_vm._v(" "),
_c(
"b-col",
{staticClass:"mt-3",attrs:{md:"12"}},
[
_c(
"b-button",
{
attrs:{
variant:"primary",
type:"submit"}},


[_vm._v(_vm._s(_vm.$t("submit")))])],


1)],


1)],


1)],


1)],


1)],


1):

_vm._e()],

1)]);


};
var staticRenderFns=[];
render._withStripped=true;



/***/},

/***/"./resources/src/utils/index.js":
/*!**************************************!*\
  !*** ./resources/src/utils/index.js ***!
  \**************************************/
/*! exports provided: default */
/***/function resourcesSrcUtilsIndexJs(module,__webpack_exports__,__webpack_require__){
__webpack_require__.r(__webpack_exports__);
var toggleFullScreen=function toggleFullScreen(){
var doc=window.document;
var docEl=doc.documentElement;
var requestFullScreen=docEl.requestFullscreen||docEl.mozRequestFullScreen||docEl.webkitRequestFullScreen||docEl.msRequestFullscreen;
var cancelFullScreen=doc.exitFullscreen||doc.mozCancelFullScreen||doc.webkitExitFullscreen||doc.msExitFullscreen;

if(!doc.fullscreenElement&&!doc.mozFullScreenElement&&!doc.webkitFullscreenElement&&!doc.msFullscreenElement){
requestFullScreen.call(docEl);
}else {
cancelFullScreen.call(doc);
}
};

var numeroALetras=function(){
function Unidades(num){
switch(num){
case 1:
return 'UN';

case 2:
return 'DOS';

case 3:
return 'TRES';

case 4:
return 'CUATRO';

case 5:
return 'CINCO';

case 6:
return 'SEIS';

case 7:
return 'SIETE';

case 8:
return 'OCHO';

case 9:
return 'NUEVE';}


return '';
}//Unidades()


function Decenas(num){
var decena=Math.floor(num/10);
var unidad=num-decena*10;

switch(decena){
case 1:
switch(unidad){
case 0:
return 'DIEZ';

case 1:
return 'ONCE';

case 2:
return 'DOCE';

case 3:
return 'TRECE';

case 4:
return 'CATORCE';

case 5:
return 'QUINCE';

default:
return 'DIECI'+Unidades(unidad);}


case 2:
switch(unidad){
case 0:
return 'VEINTE';

default:
return 'VEINTI'+Unidades(unidad);}


case 3:
return DecenasY('TREINTA',unidad);

case 4:
return DecenasY('CUARENTA',unidad);

case 5:
return DecenasY('CINCUENTA',unidad);

case 6:
return DecenasY('SESENTA',unidad);

case 7:
return DecenasY('SETENTA',unidad);

case 8:
return DecenasY('OCHENTA',unidad);

case 9:
return DecenasY('NOVENTA',unidad);

case 0:
return Unidades(unidad);}

}//Unidades()


function DecenasY(strSin,numUnidades){
if(numUnidades>0)return strSin+' Y '+Unidades(numUnidades);
return strSin;
}//DecenasY()


function Centenas(num){
var centenas=Math.floor(num/100);
var decenas=num-centenas*100;

switch(centenas){
case 1:
if(decenas>0)return 'CIENTO '+Decenas(decenas);
return 'CIEN';

case 2:
return 'DOSCIENTOS '+Decenas(decenas);

case 3:
return 'TRESCIENTOS '+Decenas(decenas);

case 4:
return 'CUATROCIENTOS '+Decenas(decenas);

case 5:
return 'QUINIENTOS '+Decenas(decenas);

case 6:
return 'SEISCIENTOS '+Decenas(decenas);

case 7:
return 'SETECIENTOS '+Decenas(decenas);

case 8:
return 'OCHOCIENTOS '+Decenas(decenas);

case 9:
return 'NOVECIENTOS '+Decenas(decenas);}


return Decenas(decenas);
}//Centenas()


function Seccion(num,divisor,strSingular,strPlural){
var cientos=Math.floor(num/divisor);
var resto=num-cientos*divisor;
var letras='';
if(cientos>0)if(cientos>1)letras=Centenas(cientos)+' '+strPlural;else letras=strSingular;
if(resto>0)letras+='';
return letras;
}//Seccion()


function Miles(num){
var divisor=1000;
var cientos=Math.floor(num/divisor);
var resto=num-cientos*divisor;
var strMiles=Seccion(num,divisor,'UN MIL','MIL');
var strCentenas=Centenas(resto);
if(strMiles=='')return strCentenas;
return strMiles+' '+strCentenas;
}//Miles()


function Millones(num){
var divisor=1000000;
var cientos=Math.floor(num/divisor);
var resto=num-cientos*divisor;
var strMillones=Seccion(num,divisor,'UN MILLON DE','MILLONES DE');
var strMiles=Miles(resto);
if(strMillones=='')return strMiles;
return strMillones+' '+strMiles;
}//Millones()


return function NumeroALetras(num,currency){
currency=currency||{};
var data={
numero:num,
enteros:Math.floor(num),
centavos:Math.round(num*100)-Math.floor(num)*100,
letrasCentavos:'',
letrasMonedaPlural:currency.plural||'DOLARES',
letrasMonedaSingular:currency.singular||'DOLAR',
letrasMonedaCentavoPlural:currency.centPlural||'CENTAVOS',
letrasMonedaCentavoSingular:currency.centSingular||'CENTAVO'};


if(data.centavos>0){
data.letrasCentavos='CON '+function(){
if(data.centavos==1)return Millones(data.centavos)+' '+data.letrasMonedaCentavoSingular;else return Millones(data.centavos)+' '+data.letrasMonedaCentavoPlural;
}();
}
if(data.enteros==0)return 'CERO '+data.letrasMonedaPlural+' '+data.letrasCentavos;
if(data.enteros==1)return Millones(data.enteros)+' '+data.letrasMonedaSingular+' '+data.letrasCentavos;else return Millones(data.enteros)+' '+data.letrasMonedaPlural+' '+data.letrasCentavos;
};
}();

/* harmony default export */__webpack_exports__["default"]={
toggleFullScreen:toggleFullScreen,
numeroALetras:numeroALetras};


/***/},

/***/"./resources/src/views/app/pages/pos.vue":
/*!***********************************************!*\
  !*** ./resources/src/views/app/pages/pos.vue ***!
  \***********************************************/
/*! exports provided: default */
/***/function resourcesSrcViewsAppPagesPosVue(module,__webpack_exports__,__webpack_require__){
__webpack_require__.r(__webpack_exports__);
/* harmony import */var _pos_vue_vue_type_template_id_4cc49487___WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(/*! ./pos.vue?vue&type=template&id=4cc49487& */"./resources/src/views/app/pages/pos.vue?vue&type=template&id=4cc49487&");
/* harmony import */var _pos_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(/*! ./pos.vue?vue&type=script&lang=js& */"./resources/src/views/app/pages/pos.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony import */var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */"./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component=Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
_pos_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
_pos_vue_vue_type_template_id_4cc49487___WEBPACK_IMPORTED_MODULE_0__["render"],
_pos_vue_vue_type_template_id_4cc49487___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
false,
null,
null,
null);
component.options.__file="resources/src/views/app/pages/pos.vue";
/* harmony default export */__webpack_exports__["default"]=component.exports;

/***/},

/***/"./resources/src/views/app/pages/pos.vue?vue&type=script&lang=js&":
/*!************************************************************************!*\
  !*** ./resources/src/views/app/pages/pos.vue?vue&type=script&lang=js& ***!
  \************************************************************************/
/*! exports provided: default */
/***/function resourcesSrcViewsAppPagesPosVueVueTypeScriptLangJs(module,__webpack_exports__,__webpack_require__){
__webpack_require__.r(__webpack_exports__);
/* harmony import */var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_pos_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./pos.vue?vue&type=script&lang=js& */"./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/src/views/app/pages/pos.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */__webpack_exports__["default"]=_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_pos_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"];

/***/},

/***/"./resources/src/views/app/pages/pos.vue?vue&type=template&id=4cc49487&":
/*!******************************************************************************!*\
  !*** ./resources/src/views/app/pages/pos.vue?vue&type=template&id=4cc49487& ***!
  \******************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/function resourcesSrcViewsAppPagesPosVueVueTypeTemplateId4cc49487(module,__webpack_exports__,__webpack_require__){
__webpack_require__.r(__webpack_exports__);
/* harmony import */var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_pos_vue_vue_type_template_id_4cc49487___WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./pos.vue?vue&type=template&id=4cc49487& */"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/src/views/app/pages/pos.vue?vue&type=template&id=4cc49487&");
/* harmony reexport (safe) */__webpack_require__.d(__webpack_exports__,"render",function(){return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_pos_vue_vue_type_template_id_4cc49487___WEBPACK_IMPORTED_MODULE_0__["render"];});

/* harmony reexport (safe) */__webpack_require__.d(__webpack_exports__,"staticRenderFns",function(){return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_pos_vue_vue_type_template_id_4cc49487___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"];});



/***/}}]);

}());
