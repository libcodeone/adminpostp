<<<<<<< HEAD
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

var isPure = false;

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

// eslint-disable-next-line es/no-object-assign -- safe
var $assign = Object.assign;
// eslint-disable-next-line es/no-object-defineproperty -- required for testing
var defineProperty$2 = Object.defineProperty;

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
var objectAssign = !$assign || fails(function () {
  // should have correct order of operations (Edge bug)
  if (descriptors && $assign({ b: 1 }, $assign(defineProperty$2({}, 'a', {
    enumerable: true,
    get: function () {
      defineProperty$2(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), { b: 2 })).b !== 1) return true;
  // should work with symbols and should have deterministic property order (V8 bug)
  var A = {};
  var B = {};
  // eslint-disable-next-line es/no-symbol -- safe
  var symbol = Symbol();
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return $assign({}, A)[symbol] != 7 || objectKeys($assign({}, B)).join('') != alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
  var propertyIsEnumerable = objectPropertyIsEnumerable.f;
  while (argumentsLength > index) {
    var S = indexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!descriptors || propertyIsEnumerable.call(S, key)) T[key] = S[key];
    }
  } return T;
} : $assign;

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
// eslint-disable-next-line es/no-object-assign -- required for testing
_export({ target: 'Object', stat: true, forced: Object.assign !== objectAssign }, {
  assign: objectAssign
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






var SPECIES$2 = wellKnownSymbol('species');

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
      re.constructor[SPECIES$2] = function () { return re; };
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

// `SameValue` abstract operation
// https://tc39.es/ecma262/#sec-samevalue
// eslint-disable-next-line es/no-object-is -- safe
var sameValue = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare -- NaN check
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
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

var MATCH = wellKnownSymbol('match');

// `IsRegExp` abstract operation
// https://tc39.es/ecma262/#sec-isregexp
var isRegexp = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
};

var SPECIES$3 = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.es/ecma262/#sec-speciesconstructor
var speciesConstructor = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES$3]) == undefined ? defaultConstructor : aFunction$1(S);
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

var iterators = {};

var correctPrototypeGetter = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});

var IE_PROTO$1 = sharedKey('IE_PROTO');
var ObjectPrototype$1 = Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO$1)) return O[IE_PROTO$1];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectPrototype$1 : null;
};

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

var returnThis = function () { return this; };

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

/* eslint-disable es/no-array-prototype-keys -- safe */
if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

var NEW_ITERATOR_PROTOTYPE = IteratorPrototype == undefined || fails(function () {
  var test = {};
  // FF44- legacy iterators case
  return IteratorPrototype[ITERATOR].call(test) !== test;
});

if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
if ( !has(IteratorPrototype, ITERATOR)) {
  createNonEnumerableProperty(IteratorPrototype, ITERATOR, returnThis);
}

var iteratorsCore = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};

var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





var returnThis$1 = function () { return this; };

var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(1, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
  iterators[TO_STRING_TAG] = returnThis$1;
  return IteratorConstructor;
};

var aPossiblePrototype = function (it) {
  if (!isObject(it) && it !== null) {
    throw TypeError("Can't set " + String(it) + ' as a prototype');
  } return it;
};

/* eslint-disable no-proto -- safe */



// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
    setter.call(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter.call(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);

var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR$1 = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis$2 = function () { return this; };

var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR$1]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
      if ( objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype$2) {
        if (objectSetPrototypeOf) {
          objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$2);
        } else if (typeof CurrentIteratorPrototype[ITERATOR$1] != 'function') {
          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR$1, returnThis$2);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
    }
  }

  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    INCORRECT_VALUES_NAME = true;
    defaultIterator = function values() { return nativeIterator.call(this); };
  }

  // define iterator
  if ( IterablePrototype[ITERATOR$1] !== defaultIterator) {
    createNonEnumerableProperty(IterablePrototype, ITERATOR$1, defaultIterator);
  }
  iterators[NAME] = defaultIterator;

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        redefine(IterablePrototype, KEY, methods[KEY]);
      }
    } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME }, methods);
  }

  return methods;
};

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState$1 = internalState.set;
var getInternalState$1 = internalState.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.es/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.es/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.es/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.es/ecma262/#sec-createarrayiterator
var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState$1(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState$1(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
// https://tc39.es/ecma262/#sec-createmappedargumentsobject
iterators.Arguments = iterators.Array;

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

var charAt$1 = stringMultibyte.charAt;



var STRING_ITERATOR = 'String Iterator';
var setInternalState$2 = internalState.set;
var getInternalState$2 = internalState.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState$2(this, {
    type: STRING_ITERATOR,
    string: String(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState$2(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = charAt$1(string, index);
  state.index += point.length;
  return { value: point, done: false };
});

var ITERATOR$2 = wellKnownSymbol('iterator');
var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
var ArrayValues = es_array_iterator.values;

for (var COLLECTION_NAME$1 in domIterables) {
  var Collection$1 = global_1[COLLECTION_NAME$1];
  var CollectionPrototype$1 = Collection$1 && Collection$1.prototype;
  if (CollectionPrototype$1) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype$1[ITERATOR$2] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype$1, ITERATOR$2, ArrayValues);
    } catch (error) {
      CollectionPrototype$1[ITERATOR$2] = ArrayValues;
    }
    if (!CollectionPrototype$1[TO_STRING_TAG$3]) {
      createNonEnumerableProperty(CollectionPrototype$1, TO_STRING_TAG$3, COLLECTION_NAME$1);
    }
    if (domIterables[COLLECTION_NAME$1]) for (var METHOD_NAME in es_array_iterator) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype$1[METHOD_NAME] !== es_array_iterator[METHOD_NAME]) try {
        createNonEnumerableProperty(CollectionPrototype$1, METHOD_NAME, es_array_iterator[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype$1[METHOD_NAME] = es_array_iterator[METHOD_NAME];
      }
    }
  }
}

var ITERATOR$3 = wellKnownSymbol('iterator');

var nativeUrl = !fails(function () {
  var url = new URL('b?a=1&b=2&c=3', 'http://a');
  var searchParams = url.searchParams;
  var result = '';
  url.pathname = 'c%20d';
  searchParams.forEach(function (value, key) {
    searchParams['delete']('b');
    result += key + value;
  });
  return (isPure && !url.toJSON)
    || !searchParams.sort
    || url.href !== 'http://a/c%20d?a=1&c=3'
    || searchParams.get('c') !== '3'
    || String(new URLSearchParams('?a=1')) !== 'a=1'
    || !searchParams[ITERATOR$3]
    // throws in Edge
    || new URL('https://a@b').username !== 'a'
    || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
    // not punycoded in Edge
    || new URL('http://тест').host !== 'xn--e1aybc'
    // not escaped in Chrome 62-
    || new URL('http://a#б').hash !== '#%D0%B1'
    // fails in Chrome 66-
    || result !== 'a1c3'
    // throws in Safari
    || new URL('http://x', undefined).host !== 'x';
});

var anInstance = function (it, Constructor, name) {
  if (!(it instanceof Constructor)) {
    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
  } return it;
};

var iteratorClose = function (iterator) {
  var returnMethod = iterator['return'];
  if (returnMethod !== undefined) {
    return anObject(returnMethod.call(iterator)).value;
  }
};

// call something on iterator step with safe closing on error
var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (error) {
    iteratorClose(iterator);
    throw error;
  }
};

var ITERATOR$4 = wellKnownSymbol('iterator');
var ArrayPrototype$1 = Array.prototype;

// check on default Array iterator
var isArrayIteratorMethod = function (it) {
  return it !== undefined && (iterators.Array === it || ArrayPrototype$1[ITERATOR$4] === it);
};

var ITERATOR$5 = wellKnownSymbol('iterator');

var getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR$5]
    || it['@@iterator']
    || iterators[classof(it)];
};

// `Array.from` method implementation
// https://tc39.es/ecma262/#sec-array.from
var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var O = toObject(arrayLike);
  var C = typeof this == 'function' ? this : Array;
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var iteratorMethod = getIteratorMethod(O);
  var index = 0;
  var length, result, step, iterator, next, value;
  if (mapping) mapfn = functionBindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
    iterator = iteratorMethod.call(O);
    next = iterator.next;
    result = new C();
    for (;!(step = next.call(iterator)).done; index++) {
      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
      createProperty(result, index, value);
    }
  } else {
    length = toLength(O.length);
    result = new C(length);
    for (;length > index; index++) {
      value = mapping ? mapfn(O[index], index) : O[index];
      createProperty(result, index, value);
    }
  }
  result.length = index;
  return result;
};

// based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js
var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
var base = 36;
var tMin = 1;
var tMax = 26;
var skew = 38;
var damp = 700;
var initialBias = 72;
var initialN = 128; // 0x80
var delimiter = '-'; // '\x2D'
var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars
var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
var baseMinusTMin = base - tMin;
var floor$1 = Math.floor;
var stringFromCharCode = String.fromCharCode;

/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 */
var ucs2decode = function (string) {
  var output = [];
  var counter = 0;
  var length = string.length;
  while (counter < length) {
    var value = string.charCodeAt(counter++);
    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
      // It's a high surrogate, and there is a next character.
      var extra = string.charCodeAt(counter++);
      if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
        output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
      } else {
        // It's an unmatched surrogate; only append this code unit, in case the
        // next code unit is the high surrogate of a surrogate pair.
        output.push(value);
        counter--;
      }
    } else {
      output.push(value);
    }
  }
  return output;
};

/**
 * Converts a digit/integer into a basic code point.
 */
var digitToBasic = function (digit) {
  //  0..25 map to ASCII a..z or A..Z
  // 26..35 map to ASCII 0..9
  return digit + 22 + 75 * (digit < 26);
};

/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 */
var adapt = function (delta, numPoints, firstTime) {
  var k = 0;
  delta = firstTime ? floor$1(delta / damp) : delta >> 1;
  delta += floor$1(delta / numPoints);
  for (; delta > baseMinusTMin * tMax >> 1; k += base) {
    delta = floor$1(delta / baseMinusTMin);
  }
  return floor$1(k + (baseMinusTMin + 1) * delta / (delta + skew));
};

/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 */
// eslint-disable-next-line max-statements -- TODO
var encode = function (input) {
  var output = [];

  // Convert the input in UCS-2 to an array of Unicode code points.
  input = ucs2decode(input);

  // Cache the length.
  var inputLength = input.length;

  // Initialize the state.
  var n = initialN;
  var delta = 0;
  var bias = initialBias;
  var i, currentValue;

  // Handle the basic code points.
  for (i = 0; i < input.length; i++) {
    currentValue = input[i];
    if (currentValue < 0x80) {
      output.push(stringFromCharCode(currentValue));
    }
  }

  var basicLength = output.length; // number of basic code points.
  var handledCPCount = basicLength; // number of code points that have been handled;

  // Finish the basic string with a delimiter unless it's empty.
  if (basicLength) {
    output.push(delimiter);
  }

  // Main encoding loop:
  while (handledCPCount < inputLength) {
    // All non-basic code points < n have been handled already. Find the next larger one:
    var m = maxInt;
    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue >= n && currentValue < m) {
        m = currentValue;
      }
    }

    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
    var handledCPCountPlusOne = handledCPCount + 1;
    if (m - n > floor$1((maxInt - delta) / handledCPCountPlusOne)) {
      throw RangeError(OVERFLOW_ERROR);
    }

    delta += (m - n) * handledCPCountPlusOne;
    n = m;

    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue < n && ++delta > maxInt) {
        throw RangeError(OVERFLOW_ERROR);
      }
      if (currentValue == n) {
        // Represent delta as a generalized variable-length integer.
        var q = delta;
        for (var k = base; /* no condition */; k += base) {
          var t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
          if (q < t) break;
          var qMinusT = q - t;
          var baseMinusT = base - t;
          output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
          q = floor$1(qMinusT / baseMinusT);
        }

        output.push(stringFromCharCode(digitToBasic(q)));
        bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
        delta = 0;
        ++handledCPCount;
      }
    }

    ++delta;
    ++n;
  }
  return output.join('');
};

var stringPunycodeToAscii = function (input) {
  var encoded = [];
  var labels = input.toLowerCase().replace(regexSeparators, '\u002E').split('.');
  var i, label;
  for (i = 0; i < labels.length; i++) {
    label = labels[i];
    encoded.push(regexNonASCII.test(label) ? 'xn--' + encode(label) : label);
  }
  return encoded.join('.');
};

var redefineAll = function (target, src, options) {
  for (var key in src) redefine(target, key, src[key], options);
  return target;
};

var getIterator = function (it) {
  var iteratorMethod = getIteratorMethod(it);
  if (typeof iteratorMethod != 'function') {
    throw TypeError(String(it) + ' is not iterable');
  } return anObject(iteratorMethod.call(it));
};

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`





















var $fetch = getBuiltIn('fetch');
var Headers = getBuiltIn('Headers');
var ITERATOR$6 = wellKnownSymbol('iterator');
var URL_SEARCH_PARAMS = 'URLSearchParams';
var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
var setInternalState$3 = internalState.set;
var getInternalParamsState = internalState.getterFor(URL_SEARCH_PARAMS);
var getInternalIteratorState = internalState.getterFor(URL_SEARCH_PARAMS_ITERATOR);

var plus = /\+/g;
var sequences = Array(4);

var percentSequence = function (bytes) {
  return sequences[bytes - 1] || (sequences[bytes - 1] = RegExp('((?:%[\\da-f]{2}){' + bytes + '})', 'gi'));
};

var percentDecode = function (sequence) {
  try {
    return decodeURIComponent(sequence);
  } catch (error) {
    return sequence;
  }
};

var deserialize = function (it) {
  var result = it.replace(plus, ' ');
  var bytes = 4;
  try {
    return decodeURIComponent(result);
  } catch (error) {
    while (bytes) {
      result = result.replace(percentSequence(bytes--), percentDecode);
    }
    return result;
  }
};

var find = /[!'()~]|%20/g;

var replace = {
  '!': '%21',
  "'": '%27',
  '(': '%28',
  ')': '%29',
  '~': '%7E',
  '%20': '+'
};

var replacer = function (match) {
  return replace[match];
};

var serialize = function (it) {
  return encodeURIComponent(it).replace(find, replacer);
};

var parseSearchParams = function (result, query) {
  if (query) {
    var attributes = query.split('&');
    var index = 0;
    var attribute, entry;
    while (index < attributes.length) {
      attribute = attributes[index++];
      if (attribute.length) {
        entry = attribute.split('=');
        result.push({
          key: deserialize(entry.shift()),
          value: deserialize(entry.join('='))
        });
      }
    }
  }
};

var updateSearchParams = function (query) {
  this.entries.length = 0;
  parseSearchParams(this.entries, query);
};

var validateArgumentsLength = function (passed, required) {
  if (passed < required) throw TypeError('Not enough arguments');
};

var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
  setInternalState$3(this, {
    type: URL_SEARCH_PARAMS_ITERATOR,
    iterator: getIterator(getInternalParamsState(params).entries),
    kind: kind
  });
}, 'Iterator', function next() {
  var state = getInternalIteratorState(this);
  var kind = state.kind;
  var step = state.iterator.next();
  var entry = step.value;
  if (!step.done) {
    step.value = kind === 'keys' ? entry.key : kind === 'values' ? entry.value : [entry.key, entry.value];
  } return step;
});

// `URLSearchParams` constructor
// https://url.spec.whatwg.org/#interface-urlsearchparams
var URLSearchParamsConstructor = function URLSearchParams(/* init */) {
  anInstance(this, URLSearchParamsConstructor, URL_SEARCH_PARAMS);
  var init = arguments.length > 0 ? arguments[0] : undefined;
  var that = this;
  var entries = [];
  var iteratorMethod, iterator, next, step, entryIterator, entryNext, first, second, key;

  setInternalState$3(that, {
    type: URL_SEARCH_PARAMS,
    entries: entries,
    updateURL: function () { /* empty */ },
    updateSearchParams: updateSearchParams
  });

  if (init !== undefined) {
    if (isObject(init)) {
      iteratorMethod = getIteratorMethod(init);
      if (typeof iteratorMethod === 'function') {
        iterator = iteratorMethod.call(init);
        next = iterator.next;
        while (!(step = next.call(iterator)).done) {
          entryIterator = getIterator(anObject(step.value));
          entryNext = entryIterator.next;
          if (
            (first = entryNext.call(entryIterator)).done ||
            (second = entryNext.call(entryIterator)).done ||
            !entryNext.call(entryIterator).done
          ) throw TypeError('Expected sequence with length 2');
          entries.push({ key: first.value + '', value: second.value + '' });
        }
      } else for (key in init) if (has(init, key)) entries.push({ key: key, value: init[key] + '' });
    } else {
      parseSearchParams(entries, typeof init === 'string' ? init.charAt(0) === '?' ? init.slice(1) : init : init + '');
    }
  }
};

var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;

redefineAll(URLSearchParamsPrototype, {
  // `URLSearchParams.prototype.append` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-append
  append: function append(name, value) {
    validateArgumentsLength(arguments.length, 2);
    var state = getInternalParamsState(this);
    state.entries.push({ key: name + '', value: value + '' });
    state.updateURL();
  },
  // `URLSearchParams.prototype.delete` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
  'delete': function (name) {
    validateArgumentsLength(arguments.length, 1);
    var state = getInternalParamsState(this);
    var entries = state.entries;
    var key = name + '';
    var index = 0;
    while (index < entries.length) {
      if (entries[index].key === key) entries.splice(index, 1);
      else index++;
    }
    state.updateURL();
  },
  // `URLSearchParams.prototype.get` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-get
  get: function get(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = name + '';
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) return entries[index].value;
    }
    return null;
  },
  // `URLSearchParams.prototype.getAll` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
  getAll: function getAll(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = name + '';
    var result = [];
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) result.push(entries[index].value);
    }
    return result;
  },
  // `URLSearchParams.prototype.has` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-has
  has: function has(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = name + '';
    var index = 0;
    while (index < entries.length) {
      if (entries[index++].key === key) return true;
    }
    return false;
  },
  // `URLSearchParams.prototype.set` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-set
  set: function set(name, value) {
    validateArgumentsLength(arguments.length, 1);
    var state = getInternalParamsState(this);
    var entries = state.entries;
    var found = false;
    var key = name + '';
    var val = value + '';
    var index = 0;
    var entry;
    for (; index < entries.length; index++) {
      entry = entries[index];
      if (entry.key === key) {
        if (found) entries.splice(index--, 1);
        else {
          found = true;
          entry.value = val;
        }
      }
    }
    if (!found) entries.push({ key: key, value: val });
    state.updateURL();
  },
  // `URLSearchParams.prototype.sort` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
  sort: function sort() {
    var state = getInternalParamsState(this);
    var entries = state.entries;
    // Array#sort is not stable in some engines
    var slice = entries.slice();
    var entry, entriesIndex, sliceIndex;
    entries.length = 0;
    for (sliceIndex = 0; sliceIndex < slice.length; sliceIndex++) {
      entry = slice[sliceIndex];
      for (entriesIndex = 0; entriesIndex < sliceIndex; entriesIndex++) {
        if (entries[entriesIndex].key > entry.key) {
          entries.splice(entriesIndex, 0, entry);
          break;
        }
      }
      if (entriesIndex === sliceIndex) entries.push(entry);
    }
    state.updateURL();
  },
  // `URLSearchParams.prototype.forEach` method
  forEach: function forEach(callback /* , thisArg */) {
    var entries = getInternalParamsState(this).entries;
    var boundFunction = functionBindContext(callback, arguments.length > 1 ? arguments[1] : undefined, 3);
    var index = 0;
    var entry;
    while (index < entries.length) {
      entry = entries[index++];
      boundFunction(entry.value, entry.key, this);
    }
  },
  // `URLSearchParams.prototype.keys` method
  keys: function keys() {
    return new URLSearchParamsIterator(this, 'keys');
  },
  // `URLSearchParams.prototype.values` method
  values: function values() {
    return new URLSearchParamsIterator(this, 'values');
  },
  // `URLSearchParams.prototype.entries` method
  entries: function entries() {
    return new URLSearchParamsIterator(this, 'entries');
  }
}, { enumerable: true });

// `URLSearchParams.prototype[@@iterator]` method
redefine(URLSearchParamsPrototype, ITERATOR$6, URLSearchParamsPrototype.entries);

// `URLSearchParams.prototype.toString` method
// https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
redefine(URLSearchParamsPrototype, 'toString', function toString() {
  var entries = getInternalParamsState(this).entries;
  var result = [];
  var index = 0;
  var entry;
  while (index < entries.length) {
    entry = entries[index++];
    result.push(serialize(entry.key) + '=' + serialize(entry.value));
  } return result.join('&');
}, { enumerable: true });

setToStringTag(URLSearchParamsConstructor, URL_SEARCH_PARAMS);

_export({ global: true, forced: !nativeUrl }, {
  URLSearchParams: URLSearchParamsConstructor
});

// Wrap `fetch` for correct work with polyfilled `URLSearchParams`
// https://github.com/zloirock/core-js/issues/674
if (!nativeUrl && typeof $fetch == 'function' && typeof Headers == 'function') {
  _export({ global: true, enumerable: true, forced: true }, {
    fetch: function fetch(input /* , init */) {
      var args = [input];
      var init, body, headers;
      if (arguments.length > 1) {
        init = arguments[1];
        if (isObject(init)) {
          body = init.body;
          if (classof(body) === URL_SEARCH_PARAMS) {
            headers = init.headers ? new Headers(init.headers) : new Headers();
            if (!headers.has('content-type')) {
              headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
            }
            init = objectCreate(init, {
              body: createPropertyDescriptor(0, String(body)),
              headers: createPropertyDescriptor(0, headers)
            });
          }
        }
        args.push(init);
      } return $fetch.apply(this, args);
    }
  });
}

var web_urlSearchParams = {
  URLSearchParams: URLSearchParamsConstructor,
  getState: getInternalParamsState
};

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`











var codeAt = stringMultibyte.codeAt;





var NativeURL = global_1.URL;
var URLSearchParams$1 = web_urlSearchParams.URLSearchParams;
var getInternalSearchParamsState = web_urlSearchParams.getState;
var setInternalState$4 = internalState.set;
var getInternalURLState = internalState.getterFor('URL');
var floor$2 = Math.floor;
var pow = Math.pow;

var INVALID_AUTHORITY = 'Invalid authority';
var INVALID_SCHEME = 'Invalid scheme';
var INVALID_HOST = 'Invalid host';
var INVALID_PORT = 'Invalid port';

var ALPHA = /[A-Za-z]/;
var ALPHANUMERIC = /[\d+-.A-Za-z]/;
var DIGIT = /\d/;
var HEX_START = /^(0x|0X)/;
var OCT = /^[0-7]+$/;
var DEC = /^\d+$/;
var HEX = /^[\dA-Fa-f]+$/;
/* eslint-disable no-control-regex -- safe */
var FORBIDDEN_HOST_CODE_POINT = /[\u0000\t\u000A\u000D #%/:?@[\\]]/;
var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\u0000\t\u000A\u000D #/:?@[\\]]/;
var LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE = /^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g;
var TAB_AND_NEW_LINE = /[\t\u000A\u000D]/g;
/* eslint-enable no-control-regex -- safe */
var EOF;

var parseHost = function (url, input) {
  var result, codePoints, index;
  if (input.charAt(0) == '[') {
    if (input.charAt(input.length - 1) != ']') return INVALID_HOST;
    result = parseIPv6(input.slice(1, -1));
    if (!result) return INVALID_HOST;
    url.host = result;
  // opaque host
  } else if (!isSpecial(url)) {
    if (FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT.test(input)) return INVALID_HOST;
    result = '';
    codePoints = arrayFrom(input);
    for (index = 0; index < codePoints.length; index++) {
      result += percentEncode(codePoints[index], C0ControlPercentEncodeSet);
    }
    url.host = result;
  } else {
    input = stringPunycodeToAscii(input);
    if (FORBIDDEN_HOST_CODE_POINT.test(input)) return INVALID_HOST;
    result = parseIPv4(input);
    if (result === null) return INVALID_HOST;
    url.host = result;
  }
};

var parseIPv4 = function (input) {
  var parts = input.split('.');
  var partsLength, numbers, index, part, radix, number, ipv4;
  if (parts.length && parts[parts.length - 1] == '') {
    parts.pop();
  }
  partsLength = parts.length;
  if (partsLength > 4) return input;
  numbers = [];
  for (index = 0; index < partsLength; index++) {
    part = parts[index];
    if (part == '') return input;
    radix = 10;
    if (part.length > 1 && part.charAt(0) == '0') {
      radix = HEX_START.test(part) ? 16 : 8;
      part = part.slice(radix == 8 ? 1 : 2);
    }
    if (part === '') {
      number = 0;
    } else {
      if (!(radix == 10 ? DEC : radix == 8 ? OCT : HEX).test(part)) return input;
      number = parseInt(part, radix);
    }
    numbers.push(number);
  }
  for (index = 0; index < partsLength; index++) {
    number = numbers[index];
    if (index == partsLength - 1) {
      if (number >= pow(256, 5 - partsLength)) return null;
    } else if (number > 255) return null;
  }
  ipv4 = numbers.pop();
  for (index = 0; index < numbers.length; index++) {
    ipv4 += numbers[index] * pow(256, 3 - index);
  }
  return ipv4;
};

// eslint-disable-next-line max-statements -- TODO
var parseIPv6 = function (input) {
  var address = [0, 0, 0, 0, 0, 0, 0, 0];
  var pieceIndex = 0;
  var compress = null;
  var pointer = 0;
  var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

  var char = function () {
    return input.charAt(pointer);
  };

  if (char() == ':') {
    if (input.charAt(1) != ':') return;
    pointer += 2;
    pieceIndex++;
    compress = pieceIndex;
  }
  while (char()) {
    if (pieceIndex == 8) return;
    if (char() == ':') {
      if (compress !== null) return;
      pointer++;
      pieceIndex++;
      compress = pieceIndex;
      continue;
    }
    value = length = 0;
    while (length < 4 && HEX.test(char())) {
      value = value * 16 + parseInt(char(), 16);
      pointer++;
      length++;
    }
    if (char() == '.') {
      if (length == 0) return;
      pointer -= length;
      if (pieceIndex > 6) return;
      numbersSeen = 0;
      while (char()) {
        ipv4Piece = null;
        if (numbersSeen > 0) {
          if (char() == '.' && numbersSeen < 4) pointer++;
          else return;
        }
        if (!DIGIT.test(char())) return;
        while (DIGIT.test(char())) {
          number = parseInt(char(), 10);
          if (ipv4Piece === null) ipv4Piece = number;
          else if (ipv4Piece == 0) return;
          else ipv4Piece = ipv4Piece * 10 + number;
          if (ipv4Piece > 255) return;
          pointer++;
        }
        address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
        numbersSeen++;
        if (numbersSeen == 2 || numbersSeen == 4) pieceIndex++;
      }
      if (numbersSeen != 4) return;
      break;
    } else if (char() == ':') {
      pointer++;
      if (!char()) return;
    } else if (char()) return;
    address[pieceIndex++] = value;
  }
  if (compress !== null) {
    swaps = pieceIndex - compress;
    pieceIndex = 7;
    while (pieceIndex != 0 && swaps > 0) {
      swap = address[pieceIndex];
      address[pieceIndex--] = address[compress + swaps - 1];
      address[compress + --swaps] = swap;
    }
  } else if (pieceIndex != 8) return;
  return address;
};

var findLongestZeroSequence = function (ipv6) {
  var maxIndex = null;
  var maxLength = 1;
  var currStart = null;
  var currLength = 0;
  var index = 0;
  for (; index < 8; index++) {
    if (ipv6[index] !== 0) {
      if (currLength > maxLength) {
        maxIndex = currStart;
        maxLength = currLength;
      }
      currStart = null;
      currLength = 0;
    } else {
      if (currStart === null) currStart = index;
      ++currLength;
    }
  }
  if (currLength > maxLength) {
    maxIndex = currStart;
    maxLength = currLength;
  }
  return maxIndex;
};

var serializeHost = function (host) {
  var result, index, compress, ignore0;
  // ipv4
  if (typeof host == 'number') {
    result = [];
    for (index = 0; index < 4; index++) {
      result.unshift(host % 256);
      host = floor$2(host / 256);
    } return result.join('.');
  // ipv6
  } else if (typeof host == 'object') {
    result = '';
    compress = findLongestZeroSequence(host);
    for (index = 0; index < 8; index++) {
      if (ignore0 && host[index] === 0) continue;
      if (ignore0) ignore0 = false;
      if (compress === index) {
        result += index ? ':' : '::';
        ignore0 = true;
      } else {
        result += host[index].toString(16);
        if (index < 7) result += ':';
      }
    }
    return '[' + result + ']';
  } return host;
};

var C0ControlPercentEncodeSet = {};
var fragmentPercentEncodeSet = objectAssign({}, C0ControlPercentEncodeSet, {
  ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1
});
var pathPercentEncodeSet = objectAssign({}, fragmentPercentEncodeSet, {
  '#': 1, '?': 1, '{': 1, '}': 1
});
var userinfoPercentEncodeSet = objectAssign({}, pathPercentEncodeSet, {
  '/': 1, ':': 1, ';': 1, '=': 1, '@': 1, '[': 1, '\\': 1, ']': 1, '^': 1, '|': 1
});

var percentEncode = function (char, set) {
  var code = codeAt(char, 0);
  return code > 0x20 && code < 0x7F && !has(set, char) ? char : encodeURIComponent(char);
};

var specialSchemes = {
  ftp: 21,
  file: null,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443
};

var isSpecial = function (url) {
  return has(specialSchemes, url.scheme);
};

var includesCredentials = function (url) {
  return url.username != '' || url.password != '';
};

var cannotHaveUsernamePasswordPort = function (url) {
  return !url.host || url.cannotBeABaseURL || url.scheme == 'file';
};

var isWindowsDriveLetter = function (string, normalized) {
  var second;
  return string.length == 2 && ALPHA.test(string.charAt(0))
    && ((second = string.charAt(1)) == ':' || (!normalized && second == '|'));
};

var startsWithWindowsDriveLetter = function (string) {
  var third;
  return string.length > 1 && isWindowsDriveLetter(string.slice(0, 2)) && (
    string.length == 2 ||
    ((third = string.charAt(2)) === '/' || third === '\\' || third === '?' || third === '#')
  );
};

var shortenURLsPath = function (url) {
  var path = url.path;
  var pathSize = path.length;
  if (pathSize && (url.scheme != 'file' || pathSize != 1 || !isWindowsDriveLetter(path[0], true))) {
    path.pop();
  }
};

var isSingleDot = function (segment) {
  return segment === '.' || segment.toLowerCase() === '%2e';
};

var isDoubleDot = function (segment) {
  segment = segment.toLowerCase();
  return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
};

// States:
var SCHEME_START = {};
var SCHEME = {};
var NO_SCHEME = {};
var SPECIAL_RELATIVE_OR_AUTHORITY = {};
var PATH_OR_AUTHORITY = {};
var RELATIVE = {};
var RELATIVE_SLASH = {};
var SPECIAL_AUTHORITY_SLASHES = {};
var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
var AUTHORITY = {};
var HOST = {};
var HOSTNAME = {};
var PORT = {};
var FILE = {};
var FILE_SLASH = {};
var FILE_HOST = {};
var PATH_START = {};
var PATH = {};
var CANNOT_BE_A_BASE_URL_PATH = {};
var QUERY = {};
var FRAGMENT = {};

// eslint-disable-next-line max-statements -- TODO
var parseURL = function (url, input, stateOverride, base) {
  var state = stateOverride || SCHEME_START;
  var pointer = 0;
  var buffer = '';
  var seenAt = false;
  var seenBracket = false;
  var seenPasswordToken = false;
  var codePoints, char, bufferCodePoints, failure;

  if (!stateOverride) {
    url.scheme = '';
    url.username = '';
    url.password = '';
    url.host = null;
    url.port = null;
    url.path = [];
    url.query = null;
    url.fragment = null;
    url.cannotBeABaseURL = false;
    input = input.replace(LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE, '');
  }

  input = input.replace(TAB_AND_NEW_LINE, '');

  codePoints = arrayFrom(input);

  while (pointer <= codePoints.length) {
    char = codePoints[pointer];
    switch (state) {
      case SCHEME_START:
        if (char && ALPHA.test(char)) {
          buffer += char.toLowerCase();
          state = SCHEME;
        } else if (!stateOverride) {
          state = NO_SCHEME;
          continue;
        } else return INVALID_SCHEME;
        break;

      case SCHEME:
        if (char && (ALPHANUMERIC.test(char) || char == '+' || char == '-' || char == '.')) {
          buffer += char.toLowerCase();
        } else if (char == ':') {
          if (stateOverride && (
            (isSpecial(url) != has(specialSchemes, buffer)) ||
            (buffer == 'file' && (includesCredentials(url) || url.port !== null)) ||
            (url.scheme == 'file' && !url.host)
          )) return;
          url.scheme = buffer;
          if (stateOverride) {
            if (isSpecial(url) && specialSchemes[url.scheme] == url.port) url.port = null;
            return;
          }
          buffer = '';
          if (url.scheme == 'file') {
            state = FILE;
          } else if (isSpecial(url) && base && base.scheme == url.scheme) {
            state = SPECIAL_RELATIVE_OR_AUTHORITY;
          } else if (isSpecial(url)) {
            state = SPECIAL_AUTHORITY_SLASHES;
          } else if (codePoints[pointer + 1] == '/') {
            state = PATH_OR_AUTHORITY;
            pointer++;
          } else {
            url.cannotBeABaseURL = true;
            url.path.push('');
            state = CANNOT_BE_A_BASE_URL_PATH;
          }
        } else if (!stateOverride) {
          buffer = '';
          state = NO_SCHEME;
          pointer = 0;
          continue;
        } else return INVALID_SCHEME;
        break;

      case NO_SCHEME:
        if (!base || (base.cannotBeABaseURL && char != '#')) return INVALID_SCHEME;
        if (base.cannotBeABaseURL && char == '#') {
          url.scheme = base.scheme;
          url.path = base.path.slice();
          url.query = base.query;
          url.fragment = '';
          url.cannotBeABaseURL = true;
          state = FRAGMENT;
          break;
        }
        state = base.scheme == 'file' ? FILE : RELATIVE;
        continue;

      case SPECIAL_RELATIVE_OR_AUTHORITY:
        if (char == '/' && codePoints[pointer + 1] == '/') {
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          pointer++;
        } else {
          state = RELATIVE;
          continue;
        } break;

      case PATH_OR_AUTHORITY:
        if (char == '/') {
          state = AUTHORITY;
          break;
        } else {
          state = PATH;
          continue;
        }

      case RELATIVE:
        url.scheme = base.scheme;
        if (char == EOF) {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = base.query;
        } else if (char == '/' || (char == '\\' && isSpecial(url))) {
          state = RELATIVE_SLASH;
        } else if (char == '?') {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = '';
          state = QUERY;
        } else if (char == '#') {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = base.query;
          url.fragment = '';
          state = FRAGMENT;
        } else {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.path.pop();
          state = PATH;
          continue;
        } break;

      case RELATIVE_SLASH:
        if (isSpecial(url) && (char == '/' || char == '\\')) {
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
        } else if (char == '/') {
          state = AUTHORITY;
        } else {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          state = PATH;
          continue;
        } break;

      case SPECIAL_AUTHORITY_SLASHES:
        state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
        if (char != '/' || buffer.charAt(pointer + 1) != '/') continue;
        pointer++;
        break;

      case SPECIAL_AUTHORITY_IGNORE_SLASHES:
        if (char != '/' && char != '\\') {
          state = AUTHORITY;
          continue;
        } break;

      case AUTHORITY:
        if (char == '@') {
          if (seenAt) buffer = '%40' + buffer;
          seenAt = true;
          bufferCodePoints = arrayFrom(buffer);
          for (var i = 0; i < bufferCodePoints.length; i++) {
            var codePoint = bufferCodePoints[i];
            if (codePoint == ':' && !seenPasswordToken) {
              seenPasswordToken = true;
              continue;
            }
            var encodedCodePoints = percentEncode(codePoint, userinfoPercentEncodeSet);
            if (seenPasswordToken) url.password += encodedCodePoints;
            else url.username += encodedCodePoints;
          }
          buffer = '';
        } else if (
          char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url))
        ) {
          if (seenAt && buffer == '') return INVALID_AUTHORITY;
          pointer -= arrayFrom(buffer).length + 1;
          buffer = '';
          state = HOST;
        } else buffer += char;
        break;

      case HOST:
      case HOSTNAME:
        if (stateOverride && url.scheme == 'file') {
          state = FILE_HOST;
          continue;
        } else if (char == ':' && !seenBracket) {
          if (buffer == '') return INVALID_HOST;
          failure = parseHost(url, buffer);
          if (failure) return failure;
          buffer = '';
          state = PORT;
          if (stateOverride == HOSTNAME) return;
        } else if (
          char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url))
        ) {
          if (isSpecial(url) && buffer == '') return INVALID_HOST;
          if (stateOverride && buffer == '' && (includesCredentials(url) || url.port !== null)) return;
          failure = parseHost(url, buffer);
          if (failure) return failure;
          buffer = '';
          state = PATH_START;
          if (stateOverride) return;
          continue;
        } else {
          if (char == '[') seenBracket = true;
          else if (char == ']') seenBracket = false;
          buffer += char;
        } break;

      case PORT:
        if (DIGIT.test(char)) {
          buffer += char;
        } else if (
          char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url)) ||
          stateOverride
        ) {
          if (buffer != '') {
            var port = parseInt(buffer, 10);
            if (port > 0xFFFF) return INVALID_PORT;
            url.port = (isSpecial(url) && port === specialSchemes[url.scheme]) ? null : port;
            buffer = '';
          }
          if (stateOverride) return;
          state = PATH_START;
          continue;
        } else return INVALID_PORT;
        break;

      case FILE:
        url.scheme = 'file';
        if (char == '/' || char == '\\') state = FILE_SLASH;
        else if (base && base.scheme == 'file') {
          if (char == EOF) {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = base.query;
          } else if (char == '?') {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = '';
            state = QUERY;
          } else if (char == '#') {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = base.query;
            url.fragment = '';
            state = FRAGMENT;
          } else {
            if (!startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
              url.host = base.host;
              url.path = base.path.slice();
              shortenURLsPath(url);
            }
            state = PATH;
            continue;
          }
        } else {
          state = PATH;
          continue;
        } break;

      case FILE_SLASH:
        if (char == '/' || char == '\\') {
          state = FILE_HOST;
          break;
        }
        if (base && base.scheme == 'file' && !startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
          if (isWindowsDriveLetter(base.path[0], true)) url.path.push(base.path[0]);
          else url.host = base.host;
        }
        state = PATH;
        continue;

      case FILE_HOST:
        if (char == EOF || char == '/' || char == '\\' || char == '?' || char == '#') {
          if (!stateOverride && isWindowsDriveLetter(buffer)) {
            state = PATH;
          } else if (buffer == '') {
            url.host = '';
            if (stateOverride) return;
            state = PATH_START;
          } else {
            failure = parseHost(url, buffer);
            if (failure) return failure;
            if (url.host == 'localhost') url.host = '';
            if (stateOverride) return;
            buffer = '';
            state = PATH_START;
          } continue;
        } else buffer += char;
        break;

      case PATH_START:
        if (isSpecial(url)) {
          state = PATH;
          if (char != '/' && char != '\\') continue;
        } else if (!stateOverride && char == '?') {
          url.query = '';
          state = QUERY;
        } else if (!stateOverride && char == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (char != EOF) {
          state = PATH;
          if (char != '/') continue;
        } break;

      case PATH:
        if (
          char == EOF || char == '/' ||
          (char == '\\' && isSpecial(url)) ||
          (!stateOverride && (char == '?' || char == '#'))
        ) {
          if (isDoubleDot(buffer)) {
            shortenURLsPath(url);
            if (char != '/' && !(char == '\\' && isSpecial(url))) {
              url.path.push('');
            }
          } else if (isSingleDot(buffer)) {
            if (char != '/' && !(char == '\\' && isSpecial(url))) {
              url.path.push('');
            }
          } else {
            if (url.scheme == 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
              if (url.host) url.host = '';
              buffer = buffer.charAt(0) + ':'; // normalize windows drive letter
            }
            url.path.push(buffer);
          }
          buffer = '';
          if (url.scheme == 'file' && (char == EOF || char == '?' || char == '#')) {
            while (url.path.length > 1 && url.path[0] === '') {
              url.path.shift();
            }
          }
          if (char == '?') {
            url.query = '';
            state = QUERY;
          } else if (char == '#') {
            url.fragment = '';
            state = FRAGMENT;
          }
        } else {
          buffer += percentEncode(char, pathPercentEncodeSet);
        } break;

      case CANNOT_BE_A_BASE_URL_PATH:
        if (char == '?') {
          url.query = '';
          state = QUERY;
        } else if (char == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (char != EOF) {
          url.path[0] += percentEncode(char, C0ControlPercentEncodeSet);
        } break;

      case QUERY:
        if (!stateOverride && char == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (char != EOF) {
          if (char == "'" && isSpecial(url)) url.query += '%27';
          else if (char == '#') url.query += '%23';
          else url.query += percentEncode(char, C0ControlPercentEncodeSet);
        } break;

      case FRAGMENT:
        if (char != EOF) url.fragment += percentEncode(char, fragmentPercentEncodeSet);
        break;
    }

    pointer++;
  }
};

// `URL` constructor
// https://url.spec.whatwg.org/#url-class
var URLConstructor = function URL(url /* , base */) {
  var that = anInstance(this, URLConstructor, 'URL');
  var base = arguments.length > 1 ? arguments[1] : undefined;
  var urlString = String(url);
  var state = setInternalState$4(that, { type: 'URL' });
  var baseState, failure;
  if (base !== undefined) {
    if (base instanceof URLConstructor) baseState = getInternalURLState(base);
    else {
      failure = parseURL(baseState = {}, String(base));
      if (failure) throw TypeError(failure);
    }
  }
  failure = parseURL(state, urlString, null, baseState);
  if (failure) throw TypeError(failure);
  var searchParams = state.searchParams = new URLSearchParams$1();
  var searchParamsState = getInternalSearchParamsState(searchParams);
  searchParamsState.updateSearchParams(state.query);
  searchParamsState.updateURL = function () {
    state.query = String(searchParams) || null;
  };
  if (!descriptors) {
    that.href = serializeURL.call(that);
    that.origin = getOrigin.call(that);
    that.protocol = getProtocol.call(that);
    that.username = getUsername.call(that);
    that.password = getPassword.call(that);
    that.host = getHost.call(that);
    that.hostname = getHostname.call(that);
    that.port = getPort.call(that);
    that.pathname = getPathname.call(that);
    that.search = getSearch.call(that);
    that.searchParams = getSearchParams.call(that);
    that.hash = getHash.call(that);
  }
};

var URLPrototype = URLConstructor.prototype;

var serializeURL = function () {
  var url = getInternalURLState(this);
  var scheme = url.scheme;
  var username = url.username;
  var password = url.password;
  var host = url.host;
  var port = url.port;
  var path = url.path;
  var query = url.query;
  var fragment = url.fragment;
  var output = scheme + ':';
  if (host !== null) {
    output += '//';
    if (includesCredentials(url)) {
      output += username + (password ? ':' + password : '') + '@';
    }
    output += serializeHost(host);
    if (port !== null) output += ':' + port;
  } else if (scheme == 'file') output += '//';
  output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
  if (query !== null) output += '?' + query;
  if (fragment !== null) output += '#' + fragment;
  return output;
};

var getOrigin = function () {
  var url = getInternalURLState(this);
  var scheme = url.scheme;
  var port = url.port;
  if (scheme == 'blob') try {
    return new URLConstructor(scheme.path[0]).origin;
  } catch (error) {
    return 'null';
  }
  if (scheme == 'file' || !isSpecial(url)) return 'null';
  return scheme + '://' + serializeHost(url.host) + (port !== null ? ':' + port : '');
};

var getProtocol = function () {
  return getInternalURLState(this).scheme + ':';
};

var getUsername = function () {
  return getInternalURLState(this).username;
};

var getPassword = function () {
  return getInternalURLState(this).password;
};

var getHost = function () {
  var url = getInternalURLState(this);
  var host = url.host;
  var port = url.port;
  return host === null ? ''
    : port === null ? serializeHost(host)
    : serializeHost(host) + ':' + port;
};

var getHostname = function () {
  var host = getInternalURLState(this).host;
  return host === null ? '' : serializeHost(host);
};

var getPort = function () {
  var port = getInternalURLState(this).port;
  return port === null ? '' : String(port);
};

var getPathname = function () {
  var url = getInternalURLState(this);
  var path = url.path;
  return url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
};

var getSearch = function () {
  var query = getInternalURLState(this).query;
  return query ? '?' + query : '';
};

var getSearchParams = function () {
  return getInternalURLState(this).searchParams;
};

var getHash = function () {
  var fragment = getInternalURLState(this).fragment;
  return fragment ? '#' + fragment : '';
};

var accessorDescriptor = function (getter, setter) {
  return { get: getter, set: setter, configurable: true, enumerable: true };
};

if (descriptors) {
  objectDefineProperties(URLPrototype, {
    // `URL.prototype.href` accessors pair
    // https://url.spec.whatwg.org/#dom-url-href
    href: accessorDescriptor(serializeURL, function (href) {
      var url = getInternalURLState(this);
      var urlString = String(href);
      var failure = parseURL(url, urlString);
      if (failure) throw TypeError(failure);
      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
    }),
    // `URL.prototype.origin` getter
    // https://url.spec.whatwg.org/#dom-url-origin
    origin: accessorDescriptor(getOrigin),
    // `URL.prototype.protocol` accessors pair
    // https://url.spec.whatwg.org/#dom-url-protocol
    protocol: accessorDescriptor(getProtocol, function (protocol) {
      var url = getInternalURLState(this);
      parseURL(url, String(protocol) + ':', SCHEME_START);
    }),
    // `URL.prototype.username` accessors pair
    // https://url.spec.whatwg.org/#dom-url-username
    username: accessorDescriptor(getUsername, function (username) {
      var url = getInternalURLState(this);
      var codePoints = arrayFrom(String(username));
      if (cannotHaveUsernamePasswordPort(url)) return;
      url.username = '';
      for (var i = 0; i < codePoints.length; i++) {
        url.username += percentEncode(codePoints[i], userinfoPercentEncodeSet);
      }
    }),
    // `URL.prototype.password` accessors pair
    // https://url.spec.whatwg.org/#dom-url-password
    password: accessorDescriptor(getPassword, function (password) {
      var url = getInternalURLState(this);
      var codePoints = arrayFrom(String(password));
      if (cannotHaveUsernamePasswordPort(url)) return;
      url.password = '';
      for (var i = 0; i < codePoints.length; i++) {
        url.password += percentEncode(codePoints[i], userinfoPercentEncodeSet);
      }
    }),
    // `URL.prototype.host` accessors pair
    // https://url.spec.whatwg.org/#dom-url-host
    host: accessorDescriptor(getHost, function (host) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      parseURL(url, String(host), HOST);
    }),
    // `URL.prototype.hostname` accessors pair
    // https://url.spec.whatwg.org/#dom-url-hostname
    hostname: accessorDescriptor(getHostname, function (hostname) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      parseURL(url, String(hostname), HOSTNAME);
    }),
    // `URL.prototype.port` accessors pair
    // https://url.spec.whatwg.org/#dom-url-port
    port: accessorDescriptor(getPort, function (port) {
      var url = getInternalURLState(this);
      if (cannotHaveUsernamePasswordPort(url)) return;
      port = String(port);
      if (port == '') url.port = null;
      else parseURL(url, port, PORT);
    }),
    // `URL.prototype.pathname` accessors pair
    // https://url.spec.whatwg.org/#dom-url-pathname
    pathname: accessorDescriptor(getPathname, function (pathname) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      url.path = [];
      parseURL(url, pathname + '', PATH_START);
    }),
    // `URL.prototype.search` accessors pair
    // https://url.spec.whatwg.org/#dom-url-search
    search: accessorDescriptor(getSearch, function (search) {
      var url = getInternalURLState(this);
      search = String(search);
      if (search == '') {
        url.query = null;
      } else {
        if ('?' == search.charAt(0)) search = search.slice(1);
        url.query = '';
        parseURL(url, search, QUERY);
      }
      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
    }),
    // `URL.prototype.searchParams` getter
    // https://url.spec.whatwg.org/#dom-url-searchparams
    searchParams: accessorDescriptor(getSearchParams),
    // `URL.prototype.hash` accessors pair
    // https://url.spec.whatwg.org/#dom-url-hash
    hash: accessorDescriptor(getHash, function (hash) {
      var url = getInternalURLState(this);
      hash = String(hash);
      if (hash == '') {
        url.fragment = null;
        return;
      }
      if ('#' == hash.charAt(0)) hash = hash.slice(1);
      url.fragment = '';
      parseURL(url, hash, FRAGMENT);
    })
  });
}

// `URL.prototype.toJSON` method
// https://url.spec.whatwg.org/#dom-url-tojson
redefine(URLPrototype, 'toJSON', function toJSON() {
  return serializeURL.call(this);
}, { enumerable: true });

// `URL.prototype.toString` method
// https://url.spec.whatwg.org/#URL-stringification-behavior
redefine(URLPrototype, 'toString', function toString() {
  return serializeURL.call(this);
}, { enumerable: true });

if (NativeURL) {
  var nativeCreateObjectURL = NativeURL.createObjectURL;
  var nativeRevokeObjectURL = NativeURL.revokeObjectURL;
  // `URL.createObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  if (nativeCreateObjectURL) redefine(URLConstructor, 'createObjectURL', function createObjectURL(blob) {
    return nativeCreateObjectURL.apply(NativeURL, arguments);
  });
  // `URL.revokeObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  if (nativeRevokeObjectURL) redefine(URLConstructor, 'revokeObjectURL', function revokeObjectURL(url) {
    return nativeRevokeObjectURL.apply(NativeURL, arguments);
  });
}

setToStringTag(URLConstructor, 'URL');

_export({ global: true, forced: !nativeUrl, sham: !descriptors }, {
  URL: URLConstructor
});

var test$1 = [];
var nativeSort = test$1.sort;

// IE8-
var FAILS_ON_UNDEFINED = fails(function () {
  test$1.sort(undefined);
});
// V8 bug
var FAILS_ON_NULL = fails(function () {
  test$1.sort(null);
});
// Old WebKit
var STRICT_METHOD$1 = arrayMethodIsStrict('sort');

var FORCED$2 = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD$1;

// `Array.prototype.sort` method
// https://tc39.es/ecma262/#sec-array.prototype.sort
_export({ target: 'Array', proto: true, forced: FORCED$2 }, {
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? nativeSort.call(toObject(this))
      : nativeSort.call(toObject(this), aFunction$1(comparefn));
  }
});

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


var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('map');

// `Array.prototype.map` method
// https://tc39.es/ecma262/#sec-array.prototype.map
// with adding support of @@species
_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 }, {
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var defineProperty$3 = objectDefineProperty.f;

var FunctionPrototype = Function.prototype;
var FunctionPrototypeToString = FunctionPrototype.toString;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// Function instances `.name` property
// https://tc39.es/ecma262/#sec-function-instances-name
if (descriptors && !(NAME in FunctionPrototype)) {
  defineProperty$3(FunctionPrototype, NAME, {
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

(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["index_sale_dispatcher"],{

/***/"./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/src/views/app/pages/sales/index_sale_dispatcher.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/src/views/app/pages/sales/index_sale_dispatcher.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/function node_modulesBabelLoaderLibIndexJsNode_modulesVueLoaderLibIndexJsResourcesSrcViewsAppPagesSalesIndex_sale_dispatcherVueVueTypeScriptLangJs(module,__webpack_exports__,__webpack_require__){
__webpack_require__.r(__webpack_exports__);
/* harmony import */var vuex__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(/*! vuex */"./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */var nprogress__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(/*! nprogress */"./node_modules/nprogress/nprogress.js");
/* harmony import */var nprogress__WEBPACK_IMPORTED_MODULE_1___default=/*#__PURE__*/__webpack_require__.n(nprogress__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */var jspdf__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(/*! jspdf */"./node_modules/jspdf/dist/jspdf.es.min.js");
/* harmony import */var jspdf_autotable__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(/*! jspdf-autotable */"./node_modules/jspdf-autotable/dist/jspdf.plugin.autotable.js");
/* harmony import */var vue_easy_print__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(/*! vue-easy-print */"./node_modules/vue-easy-print/src/index.js");
/* harmony import */var vue_barcode__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(/*! vue-barcode */"./node_modules/vue-barcode/index.js");
/* harmony import */var vue_barcode__WEBPACK_IMPORTED_MODULE_5___default=/*#__PURE__*/__webpack_require__.n(vue_barcode__WEBPACK_IMPORTED_MODULE_5__);
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






/* harmony default export */__webpack_exports__["default"]={
components:{
vueEasyPrint:vue_easy_print__WEBPACK_IMPORTED_MODULE_4__["default"],
barcode:vue_barcode__WEBPACK_IMPORTED_MODULE_5___default.a},

metaInfo:{
title:"Sales"},

data:function data(){
return {
cardElement:{},
paymentProcessing:false,
isLoading:true,
serverParams:{
sort:{
field:"id",
type:"desc"},

page:1,
perPage:10},

selectedIds:[],
search:"",
totalRows:"",
barcodeFormat:"CODE128",
showDropdown:false,
EditPaiementMode:false,
Filter_Client:"",
Filter_Ref:"",
Filter_date:"",
Filter_status:"pending",
Filter_Payment:"paid",
Filter_warehouse:"",
customers:[],
warehouses:[],
sales:[],
invoice_pos:{
sale:{
Ref:"",
client_name:"",
discount:"",
taxe:"",
tax_rate:"",
shipping:"",
GrandTotal:""},

details:[],
setting:{
logo:"",
CompanyName:"",
CompanyAdress:"",
email:"",
CompanyPhone:""}},


payments:[],
payment:{},
Sale_id:"",
limit:"10",
sale:{},
email:{
to:"",
subject:"",
message:"",
client_name:"",
Sale_Ref:""},

emailPayment:{
id:"",
to:"",
subject:"",
message:"",
client_name:"",
Ref:""}};


},
mounted:function mounted(){
var _this=this;

this.$root.$on("bv::dropdown::show",function(bvEvent){
_this.showDropdown=true;
});
this.$root.$on("bv::dropdown::hide",function(bvEvent){
_this.showDropdown=false;
});
},
computed:_objectSpread(_objectSpread({},Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapGetters"])(["currentUserPermissions","currentUser"])),{},{
columns:function columns(){
return [{
label:this.$t("Reference"),
field:"Ref",
tdClass:"text-left",
thClass:"text-left"},
{
label:this.$t("Customer"),
field:"client_name",
tdClass:"text-left",
thClass:"text-left"},
{
label:this.$t("warehouse"),
field:"warehouse_name",
tdClass:"text-left",
thClass:"text-left"},
{
label:this.$t("Status"),
field:"statut",
html:true,
tdClass:"text-left",
thClass:"text-left"},
{
label:this.$t("Total"),
field:"GrandTotal",
tdClass:"text-left",
thClass:"text-left"},
{
label:this.$t("Paid"),
field:"paid_amount",
tdClass:"text-left",
thClass:"text-left"},
{
label:this.$t("Due"),
field:"due",
tdClass:"text-left",
thClass:"text-left"},
{
label:this.$t("PaymentStatus"),
field:"payment_status",
html:true,
tdClass:"text-left",
thClass:"text-left"},
{
label:this.$t("Dispatcher"),
field:"dispatcher",
html:true,
tdClass:"text-right",
thClass:"text-right",
sortable:false}];

}}),

methods:{
//---- print Invoice
print_it:function print_it(){
this.$refs.Show_invoice.print();
},
//---- update Params Table
updateParams:function updateParams(newProps){
this.serverParams=Object.assign({},this.serverParams,newProps);
},
//---- Event Page Change
onPageChange:function onPageChange(_ref){
var currentPage=_ref.currentPage;

if(this.serverParams.page!==currentPage){
this.updateParams({
page:currentPage});

this.Get_Sales(currentPage);
}
},
//---- Event Per Page Change
onPerPageChange:function onPerPageChange(_ref2){
var currentPerPage=_ref2.currentPerPage;

if(this.limit!==currentPerPage){
this.limit=currentPerPage;
this.updateParams({
page:1,
perPage:currentPerPage});

this.Get_Sales(1);
}
},
//---- Event Select Rows
selectionChanged:function selectionChanged(_ref3){
var _this2=this;

var selectedRows=_ref3.selectedRows;
this.selectedIds=[];
selectedRows.forEach(function(row,index){
_this2.selectedIds.push(row.id);
});
},
//---- Event Sort change
onSortChange:function onSortChange(params){
var field="";

if(params[0].field=="client_name"){
field="client_id";
}else if(params[0].field=="warehouse_name"){
field="warehouse_id";
}else {
field=params[0].field;
}

this.updateParams({
sort:{
type:params[0].type,
field:field}});


this.Get_Sales(this.serverParams.page);
},
onSearch:function onSearch(value){
this.search=value.searchTerm;
this.Get_Sales(this.serverParams.page);
},
//---Validate State Fields
getValidationState:function getValidationState(_ref4){
var dirty=_ref4.dirty,
validated=_ref4.validated,
_ref4$valid=_ref4.valid,
valid=_ref4$valid===void 0?null:_ref4$valid;
return dirty||validated?valid:null;
},
//------ Toast
makeToast:function makeToast(variant,msg,title){
this.$root.$bvToast.toast(msg,{
title:title,
variant:variant,
solid:true});

},
//------ Reset Filter
Reset_Filter:function Reset_Filter(){
this.search="";
this.Filter_Client="";
this.Filter_status="pending";
this.Filter_Payment="paid";
this.Filter_Ref="";
this.Filter_date="";
this.Filter_warehouse="",this.Get_Sales(this.serverParams.page);
},
//------------------------------Formetted Numbers -------------------------\\
formatNumber:function formatNumber(number,dec){
var value=(typeof number==="string"?number:number.toString()).split(".");
if(dec<=0)return value[0];
var formated=value[1]||"";
if(formated.length>dec)return "".concat(value[0],".").concat(formated.substr(0,dec));

while(formated.length<dec){
formated+="0";
}

return "".concat(value[0],".").concat(formated);
},
//----------------------------------- Sales PDF ------------------------------\\
Sales_PDF:function Sales_PDF(){
var self=this;
var pdf=new jspdf__WEBPACK_IMPORTED_MODULE_2__["default"]("p","pt");
var columns=[{
title:"Ref",
dataKey:"Ref"},
{
title:"Client",
dataKey:"client_name"},
{
title:"Status",
dataKey:"statut"},
{
title:"Total",
dataKey:"GrandTotal"},
{
title:"Paid",
dataKey:"paid_amount"},
{
title:"Due",
dataKey:"due"},
{
title:"Status Payment",
dataKey:"payment_status"}];

pdf.autoTable(columns,self.sales);
pdf.text("Sale List",40,25);
pdf.save("Sale_List.pdf");
},
//-------------------------------- Invoice POS ------------------------------\\
Invoice_POS:function Invoice_POS(id){
var _this3=this;

// Start the progress bar.
nprogress__WEBPACK_IMPORTED_MODULE_1___default.a.start();
nprogress__WEBPACK_IMPORTED_MODULE_1___default.a.set(0.1);
axios.get("Sales/Print_Invoice/"+id).then(function(response){
_this3.invoice_pos=response.data;
setTimeout(function(){
// Complete the animation of the  progress bar.
nprogress__WEBPACK_IMPORTED_MODULE_1___default.a.done();

_this3.$bvModal.show("Show_invoice");
},500);
setTimeout(function(){
return _this3.print_it();
},1000);
})["catch"](function(){
// Complete the animation of the  progress bar.
setTimeout(function(){
return nprogress__WEBPACK_IMPORTED_MODULE_1___default.a.done();
},500);
});
},
//-----------------------------  Invoice PDF ------------------------------\\
Invoice_PDF:function Invoice_PDF(sale,id){
// Start the progress bar.
nprogress__WEBPACK_IMPORTED_MODULE_1___default.a.start();
nprogress__WEBPACK_IMPORTED_MODULE_1___default.a.set(0.1);
axios({
url:"Sale_PDF/"+id,
method:"GET",
responseType:"blob"// important
}).
then(function(response){
var url=window.URL.createObjectURL(new Blob([response.data]));
var link=document.createElement("a");
link.href=url;
link.setAttribute("download","Sale-"+sale.Ref+".pdf");
document.body.appendChild(link);
link.click();// Complete the animation of the  progress bar.

setTimeout(function(){
return nprogress__WEBPACK_IMPORTED_MODULE_1___default.a.done();
},500);
})["catch"](function(){
// Complete the animation of the  progress bar.
setTimeout(function(){
return nprogress__WEBPACK_IMPORTED_MODULE_1___default.a.done();
},500);
});
},
//---------------------------------------- Set To Strings-------------------------\\
setToStrings:function setToStrings(){
// Simply replaces null values with strings=''
if(this.Filter_Client===null){
this.Filter_Client="";
}else if(this.Filter_warehouse===null){
this.Filter_warehouse="";
}else if(this.Filter_status===null){
this.Filter_status="";
}else if(this.Filter_Payment===null){
this.Filter_Payment="";
}
},
//----------------------------------------- Get all Sales ------------------------------\\
Get_Sales:function Get_Sales(page){
var _this4=this;

// Start the progress bar.
nprogress__WEBPACK_IMPORTED_MODULE_1___default.a.start();
nprogress__WEBPACK_IMPORTED_MODULE_1___default.a.set(0.1);
this.setToStrings();
axios.get("sales?page="+page+"&Ref="+this.Filter_Ref+"&date="+this.Filter_date+"&client_id="+this.Filter_Client+"&statut="+this.Filter_status+"&warehouse_id="+this.Filter_warehouse+"&payment_statut="+this.Filter_Payment+"&SortField="+this.serverParams.sort.field+"&SortType="+this.serverParams.sort.type+"&search="+this.search+"&limit="+this.limit).then(function(response){
_this4.sales=response.data.sales;
_this4.customers=response.data.customers;
_this4.warehouses=response.data.warehouses;
_this4.totalRows=response.data.totalRows;// Complete the animation of theprogress bar.

nprogress__WEBPACK_IMPORTED_MODULE_1___default.a.done();
_this4.isLoading=false;
})["catch"](function(response){
// Complete the animation of theprogress bar.
nprogress__WEBPACK_IMPORTED_MODULE_1___default.a.done();
setTimeout(function(){
_this4.isLoading=false;
},500);
});
},
Number_Order_Payment:function Number_Order_Payment(){
var _this5=this;

axios.get("payment/sale/Number/Order").then(function(_ref5){
var data=_ref5.data;
return _this5.payment.Ref=data;
});
},
//----------------------------------- New Payment Sale ------------------------------\\
//-------------------------------Show All Payment with Sale ---------------------\\
Show_Payments:function Show_Payments(id,sale){
// Start the progress bar.
nprogress__WEBPACK_IMPORTED_MODULE_1___default.a.start();
nprogress__WEBPACK_IMPORTED_MODULE_1___default.a.set(0.1);
this.reset_form_payment();
this.Sale_id=id;
this.sale=sale;
this.Get_Payments(id);
}},

//----------------------------- Created function-------------------\\
created:function created(){
var _this6=this;

this.Get_Sales(1);
Fire.$on("Create_Facture_sale",function(){
setTimeout(function(){
_this6.Get_Sales(_this6.serverParams.page);// Complete the animation of the  progress bar.


nprogress__WEBPACK_IMPORTED_MODULE_1___default.a.done();

_this6.$bvModal.hide("Add_Payment");
},500);
});// Fire.$on("Update_Facture_sale", () => {
//   setTimeout(() => {
//     this.Get_Payments(this.Sale_id);
//     this.Get_Sales(this.serverParams.page);
//     // Complete the animation of the  progress bar.
//     NProgress.done();
//     this.$bvModal.hide("Add_Payment");
//   }, 500);
// });
// Fire.$on("Delete_Facture_sale", () => {
//   setTimeout(() => {
//     this.Get_Payments(this.Sale_id);
//     this.Get_Sales(this.serverParams.page);
//     // Complete the animation of the  progress bar.
//     NProgress.done();
//   }, 500);
// });
// Fire.$on("Delete_sale", () => {
//   setTimeout(() => {
//     this.Get_Sales(this.serverParams.page);
//     // Complete the animation of the  progress bar.
//     NProgress.done();
//   }, 500);
// });
}};


/***/},

/***/"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/src/views/app/pages/sales/index_sale_dispatcher.vue?vue&type=template&id=6ae6c1bc&":
/*!************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/src/views/app/pages/sales/index_sale_dispatcher.vue?vue&type=template&id=6ae6c1bc& ***!
  \************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/function node_modulesVueLoaderLibLoadersTemplateLoaderJsNode_modulesVueLoaderLibIndexJsResourcesSrcViewsAppPagesSalesIndex_sale_dispatcherVueVueTypeTemplateId6ae6c1bc(module,__webpack_exports__,__webpack_require__){
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"render",function(){return render;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"staticRenderFns",function(){return staticRenderFns;});
var render=function render(){
var _vm=this;
var _h=_vm.$createElement;
var _c=_vm._self._c||_h;
return _c(
"div",
{staticClass:"main-content"},
[
_c("breadcumb",{
attrs:{page:_vm.$t("ListSales"),folder:_vm.$t("Sales")}}),

_vm._v(" "),
_vm.isLoading?
_c("div",{
staticClass:"loading_page spinner spinner-primary mr-3"}):

_c(
"div",
[
_c(
"vue-good-table",
{
attrs:{
mode:"remote",
columns:_vm.columns,
totalRows:_vm.totalRows,
rows:_vm.sales,
"search-options":{
placeholder:_vm.$t("Search_this_table"),
enabled:true},

"select-options":{
enabled:true,
clearSelectionText:""},

"pagination-options":{
enabled:true,
mode:"records",
nextLabel:"next",
prevLabel:"prev"},

styleClass:_vm.showDropdown?
"tableOne table-hover vgt-table full-height":
"tableOne table-hover vgt-table non-height"},

on:{
"on-page-change":_vm.onPageChange,
"on-per-page-change":_vm.onPerPageChange,
"on-sort-change":_vm.onSortChange,
"on-search":_vm.onSearch,
"on-selected-rows-change":_vm.selectionChanged},

scopedSlots:_vm._u([
{
key:"table-row",
fn:function fn(props){
return [
props.column.field=="dispatcher"?
_c("span",[
_c(
"div",
[
_vm.currentUserPermissions&&
_vm.currentUserPermissions.includes(
"Sales_edit")?

_c(
"router-link",
{
staticClass:
"btn-sm btn btn-primary ripple btn-icon m-1",
attrs:{
to:{
name:"dispatcher_sale",
params:{id:props.row.id}}}},



[
_c(
"span",
{staticClass:"ul-btn__icon"},
[
_c("i",{
staticClass:"i-Edit"})]),



_vm._v(" "),
_c(
"span",
{
staticClass:"ul-btn__text ml-1"},

[
_vm._v(
_vm._s(_vm.$t("dispatcher")))])]):





_vm._e()],

1)]):


props.column.field=="statut"?
_c("div",[
props.row.statut=="completed"?
_c(
"span",
{
staticClass:
"badge badge-outline-success"},

[_vm._v(_vm._s(_vm.$t("complete")))]):

props.row.statut=="pending"?
_c(
"span",
{
staticClass:"badge badge-outline-info"},

[_vm._v(_vm._s(_vm.$t("Pending")))]):

_c(
"span",
{
staticClass:
"badge badge-outline-warning"},

[_vm._v(_vm._s(_vm.$t("Ordered")))])]):


props.column.field=="payment_status"?
_c("div",[
props.row.payment_status=="paid"?
_c(
"span",
{
staticClass:
"badge badge-outline-success"},

[_vm._v(_vm._s(_vm.$t("Paid")))]):

props.row.payment_status=="partial"?
_c(
"span",
{
staticClass:
"badge badge-outline-primary"},

[_vm._v(_vm._s(_vm.$t("partial")))]):

_c(
"span",
{
staticClass:
"badge badge-outline-warning"},

[_vm._v(_vm._s(_vm.$t("Unpaid")))])]):


_vm._e()];

}}])},



[
_c(
"div",
{
staticClass:"mt-2 mb-3",
attrs:{slot:"table-actions"},
slot:"table-actions"},

[
_c(
"b-button",
{
directives:[
{
name:"b-toggle",
rawName:"v-b-toggle.sidebar-right",
modifiers:{"sidebar-right":true}}],


attrs:{
variant:"outline-info ripple m-1",
size:"sm"}},


[
_c("i",{staticClass:"i-Filter-2"}),
_vm._v(
"\n          "+
_vm._s(_vm.$t("Filter"))+
"\n        ")]),



_vm._v(" "),
_c(
"b-button",
{
attrs:{
size:"sm",
variant:"outline-success ripple m-1"},

on:{
click:function click($event){
return _vm.Sales_PDF();
}}},


[
_c("i",{staticClass:"i-File-Copy"}),
_vm._v(" PDF\n        ")]),


_vm._v(" "),
_c(
"b-button",
{
attrs:{
size:"sm",
variant:"outline-danger ripple m-1"},

on:{
click:function click($event){
return _vm.Sales_Excel();
}}},


[
_c("i",{staticClass:"i-File-Excel"}),
_vm._v(" EXCEL\n        ")])],



1)])],




1),

_vm._v(" "),
_c(
"b-sidebar",
{
attrs:{
id:"sidebar-right",
title:_vm.$t("Filter"),
"bg-variant":"white",
right:"",
shadow:""}},


[
_c(
"div",
{staticClass:"px-3 py-2"},
[
_c(
"b-row",
[
_c(
"b-col",
{attrs:{md:"12"}},
[
_c(
"b-form-group",
{attrs:{label:_vm.$t("date")}},
[
_c("b-form-input",{
attrs:{type:"date"},
model:{
value:_vm.Filter_date,
callback:function callback($$v){
_vm.Filter_date=$$v;
},
expression:"Filter_date"}})],



1)],


1),

_vm._v(" "),
_c(
"b-col",
{attrs:{md:"12"}},
[
_c(
"b-form-group",
{attrs:{label:_vm.$t("Reference")}},
[
_c("b-form-input",{
attrs:{
label:"Reference",
placeholder:_vm.$t("Reference")},

model:{
value:_vm.Filter_Ref,
callback:function callback($$v){
_vm.Filter_Ref=$$v;
},
expression:"Filter_Ref"}})],



1)],


1),

_vm._v(" "),
_c(
"b-col",
{attrs:{md:"12"}},
[
_c(
"b-form-group",
{attrs:{label:_vm.$t("Customer")}},
[
_c("v-select",{
attrs:{
reduce:function reduce(label){
return label.value;
},
placeholder:_vm.$t("Choose_Customer"),
options:_vm.customers.map(function(customers){
return {
label:customers.name,
value:customers.id};

})},

model:{
value:_vm.Filter_Client,
callback:function callback($$v){
_vm.Filter_Client=$$v;
},
expression:"Filter_Client"}})],



1)],


1),

_vm._v(" "),
_c(
"b-col",
{attrs:{md:"12"}},
[
_c(
"b-form-group",
{attrs:{label:_vm.$t("warehouse")}},
[
_c("v-select",{
attrs:{
reduce:function reduce(label){
return label.value;
},
placeholder:_vm.$t("Choose_Warehouse"),
options:_vm.warehouses.map(function(warehouses){
return {
label:warehouses.name,
value:warehouses.id};

})},

model:{
value:_vm.Filter_warehouse,
callback:function callback($$v){
_vm.Filter_warehouse=$$v;
},
expression:"Filter_warehouse"}})],



1)],


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
variant:"primary btn-block ripple m-1",
size:"sm"},

on:{
click:function click($event){
return _vm.Get_Sales(_vm.serverParams.page);
}}},


[
_c("i",{staticClass:"i-Filter-2"}),
_vm._v(
"\n            "+
_vm._s(_vm.$t("Filter"))+
"\n          ")])],




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
variant:"danger ripple btn-block m-1",
size:"sm"},

on:{
click:function click($event){
return _vm.Reset_Filter();
}}},


[
_c("i",{staticClass:"i-Power-2"}),
_vm._v(
"\n            "+
_vm._s(_vm.$t("Reset"))+
"\n          ")])],




1)],


1)],


1)]),



_vm._v(" "),
_c(
"b-modal",
{
attrs:{
"hide-footer":"",
size:"lg",
id:"Show_payment",
title:_vm.$t("ShowPayment")}},


[
_c(
"b-row",
[
_c(
"b-col",
{
staticClass:"mt-3",
attrs:{lg:"12",md:"12",sm:"12"}},

[
_c("div",{staticClass:"table-responsive"},[
_c(
"table",
{
staticClass:"table table-hover table-bordered table-md"},

[
_c("thead",[
_c("tr",[
_c("th",{attrs:{scope:"col"}},[
_vm._v(_vm._s(_vm.$t("date")))]),

_vm._v(" "),
_c("th",{attrs:{scope:"col"}},[
_vm._v(_vm._s(_vm.$t("Reference")))]),

_vm._v(" "),
_c("th",{attrs:{scope:"col"}},[
_vm._v(_vm._s(_vm.$t("Amount")))]),

_vm._v(" "),
_c("th",{attrs:{scope:"col"}},[
_vm._v(_vm._s(_vm.$t("PayeBy")))])])]),



_vm._v(" "),
_c(
"tbody",
[
_vm.payments.length<=0?
_c("tr",[
_c("td",{attrs:{colspan:"5"}},[
_vm._v(_vm._s(_vm.$t("NodataAvailable")))])]):


_vm._e(),
_vm._v(" "),
_vm._l(_vm.payments,function(payment){
return _c("tr",[
_c("td",[_vm._v(_vm._s(payment.date))]),
_vm._v(" "),
_c("td",[_vm._v(_vm._s(payment.Ref))]),
_vm._v(" "),
_c("td",[
_vm._v(
_vm._s(
_vm.formatNumber(payment.montant,2))+

" "+
_vm._s(_vm.currentUser.currency))]),


_vm._v(" "),
_c("td",[_vm._v(_vm._s(payment.Reglement))])]);

})],

2)])])])],







1)],


1),

_vm._v(" "),
_c(
"b-modal",
{
attrs:{
"hide-footer":"",
size:"md",
scrollable:"",
id:"Show_invoice",
title:_vm.$t("Invoice_POS")}},


[
_c(
"vue-easy-print",
{ref:"Show_invoice",attrs:{"table-show":""}},
[
_c(
"div",
{attrs:{id:"invoice-POS"}},
[
_c("h6",{staticClass:"text-right"},[
_vm._v(
_vm._s(_vm.$t("date"))+
" : "+
_vm._s(_vm.invoice_pos.sale.date))]),


_vm._v(" "),
_c("center",{attrs:{id:"top"}},[
_c("div",{staticClass:"logo"},[
_c("img",{
attrs:{
src:"/images/"+_vm.invoice_pos.setting.logo}})]),



_vm._v(" "),
_c("div",{staticClass:"info"},[
_c("h3",[
_vm._v(_vm._s(_vm.invoice_pos.setting.CompanyName))])])]),



_vm._v(" "),
_c("div",{staticClass:"info"},[
_c("h6",[
_vm._v(
_vm._s(_vm.$t("Adress"))+
" : "+
_vm._s(_vm.invoice_pos.setting.CompanyAdress))]),


_vm._v(" "),
_c("h6",[
_vm._v(
_vm._s(_vm.$t("Email"))+
" : "+
_vm._s(_vm.invoice_pos.setting.email))]),


_vm._v(" "),
_c("h6",[
_vm._v(
_vm._s(_vm.$t("Phone"))+
" : "+
_vm._s(_vm.invoice_pos.setting.CompanyPhone))]),


_vm._v(" "),
_c("h6",[
_vm._v(
_vm._s(_vm.$t("Customer"))+
" : "+
_vm._s(_vm.invoice_pos.sale.client_name))])]),



_vm._v(" "),
_c("table",{staticClass:"mt-3 table-md"},[
_c("thead",[
_c("tr",[
_c("th",{attrs:{scope:"col"}},[
_vm._v(_vm._s(_vm.$t("ProductName")))]),

_vm._v(" "),
_c("th",{attrs:{scope:"col"}},[
_vm._v(_vm._s(_vm.$t("Qty")))]),

_vm._v(" "),
_c("th",{attrs:{scope:"col"}},[
_vm._v(_vm._s(_vm.$t("Total")))])])]),



_vm._v(" "),
_c(
"tbody",
[
_vm._l(_vm.invoice_pos.details,function(
detail_invoice)
{
return _c("tr",[
_c("td",[_vm._v(_vm._s(detail_invoice.name))]),
_vm._v(" "),
_c("td",[
_vm._v(
_vm._s(
_vm.formatNumber(detail_invoice.quantity,2))+

" "+
_vm._s(detail_invoice.unit_sale))]),


_vm._v(" "),
_c("td",[
_vm._v(
_vm._s(
_vm.formatNumber(detail_invoice.total,2))+

" "+
_vm._s(_vm.invoice_pos.symbol))])]);



}),
_vm._v(" "),
_c("tr",[
_c("th"),
_vm._v(" "),
_c("th",[_vm._v(_vm._s(_vm.$t("Tax")))]),
_vm._v(" "),
_c("td",[
_vm._v(
_vm._s(
_vm.formatNumber(_vm.invoice_pos.sale.taxe,2))+

" "+
_vm._s(_vm.invoice_pos.symbol)+
" ("+
_vm._s(
_vm.formatNumber(
_vm.invoice_pos.sale.tax_rate,
2))+


" %)")])]),



_vm._v(" "),
_c("tr",[
_c("th"),
_vm._v(" "),
_c("th",[_vm._v(_vm._s(_vm.$t("Discount")))]),
_vm._v(" "),
_c("td",[
_vm._v(
_vm._s(
_vm.formatNumber(
_vm.invoice_pos.sale.discount,
2))+


" "+
_vm._s(_vm.invoice_pos.symbol))])]),



_vm._v(" "),
_c("tr",[
_c("th"),
_vm._v(" "),
_c("th",[_vm._v(_vm._s(_vm.$t("Shipping")))]),
_vm._v(" "),
_c("td",[
_vm._v(
_vm._s(
_vm.formatNumber(
_vm.invoice_pos.sale.shipping,
2))+


" "+
_vm._s(_vm.invoice_pos.symbol))])])],




2)]),


_vm._v(" "),
_c("table",{staticClass:"mt-2",attrs:{id:"total"}},[
_c("tbody",[
_c("tr",[
_c("th",{staticClass:"p-1 w-75"},[
_vm._v(_vm._s(_vm.$t("SubTotal")))]),

_vm._v(" "),
_c("th",{staticClass:"p-1 w-25"},[
_vm._v(
_vm._s(
_vm.formatNumber(
_vm.invoice_pos.sale.GrandTotal,
2))+


" "+
_vm._s(_vm.invoice_pos.symbol))])])])]),





_vm._v(" "),
_c("div",{attrs:{id:"legalcopy"}},[
_c("p",{staticClass:"legal"},[
_c("strong",[
_vm._v(_vm._s(_vm.$t("Thank_you_for_your_business")))])]),


_vm._v(" "),
_c(
"div",
{attrs:{id:"bar"}},
[
_c("barcode",{
staticClass:"barcode",
attrs:{
format:_vm.barcodeFormat,
value:_vm.invoice_pos.sale.Ref,
textmargin:"0",
fontoptions:"bold",
height:"25"}})],



1)])],



1)]),



_vm._v(" "),
_c(
"button",
{
staticClass:"btn btn-outline-primary",
on:{
click:function click($event){
return _vm.print_it();
}}},


[
_c("i",{staticClass:"i-Billing"}),
_vm._v("\n      "+_vm._s(_vm.$t("print"))+"\n    ")])],



1)],


1);

};
var staticRenderFns=[];
render._withStripped=true;



/***/},

/***/"./resources/src/views/app/pages/sales/index_sale_dispatcher.vue":
/*!***********************************************************************!*\
  !*** ./resources/src/views/app/pages/sales/index_sale_dispatcher.vue ***!
  \***********************************************************************/
/*! exports provided: default */
/***/function resourcesSrcViewsAppPagesSalesIndex_sale_dispatcherVue(module,__webpack_exports__,__webpack_require__){
__webpack_require__.r(__webpack_exports__);
/* harmony import */var _index_sale_dispatcher_vue_vue_type_template_id_6ae6c1bc___WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(/*! ./index_sale_dispatcher.vue?vue&type=template&id=6ae6c1bc& */"./resources/src/views/app/pages/sales/index_sale_dispatcher.vue?vue&type=template&id=6ae6c1bc&");
/* harmony import */var _index_sale_dispatcher_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(/*! ./index_sale_dispatcher.vue?vue&type=script&lang=js& */"./resources/src/views/app/pages/sales/index_sale_dispatcher.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony import */var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */"./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component=Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
_index_sale_dispatcher_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
_index_sale_dispatcher_vue_vue_type_template_id_6ae6c1bc___WEBPACK_IMPORTED_MODULE_0__["render"],
_index_sale_dispatcher_vue_vue_type_template_id_6ae6c1bc___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
false,
null,
null,
null);
component.options.__file="resources/src/views/app/pages/sales/index_sale_dispatcher.vue";
/* harmony default export */__webpack_exports__["default"]=component.exports;

/***/},

/***/"./resources/src/views/app/pages/sales/index_sale_dispatcher.vue?vue&type=script&lang=js&":
/*!************************************************************************************************!*\
  !*** ./resources/src/views/app/pages/sales/index_sale_dispatcher.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************/
/*! exports provided: default */
/***/function resourcesSrcViewsAppPagesSalesIndex_sale_dispatcherVueVueTypeScriptLangJs(module,__webpack_exports__,__webpack_require__){
__webpack_require__.r(__webpack_exports__);
/* harmony import */var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_sale_dispatcher_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./index_sale_dispatcher.vue?vue&type=script&lang=js& */"./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/src/views/app/pages/sales/index_sale_dispatcher.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */__webpack_exports__["default"]=_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_sale_dispatcher_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"];

/***/},

/***/"./resources/src/views/app/pages/sales/index_sale_dispatcher.vue?vue&type=template&id=6ae6c1bc&":
/*!******************************************************************************************************!*\
  !*** ./resources/src/views/app/pages/sales/index_sale_dispatcher.vue?vue&type=template&id=6ae6c1bc& ***!
  \******************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/function resourcesSrcViewsAppPagesSalesIndex_sale_dispatcherVueVueTypeTemplateId6ae6c1bc(module,__webpack_exports__,__webpack_require__){
__webpack_require__.r(__webpack_exports__);
/* harmony import */var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_index_sale_dispatcher_vue_vue_type_template_id_6ae6c1bc___WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(/*! -!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./index_sale_dispatcher.vue?vue&type=template&id=6ae6c1bc& */"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/src/views/app/pages/sales/index_sale_dispatcher.vue?vue&type=template&id=6ae6c1bc&");
/* harmony reexport (safe) */__webpack_require__.d(__webpack_exports__,"render",function(){return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_index_sale_dispatcher_vue_vue_type_template_id_6ae6c1bc___WEBPACK_IMPORTED_MODULE_0__["render"];});

/* harmony reexport (safe) */__webpack_require__.d(__webpack_exports__,"staticRenderFns",function(){return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_index_sale_dispatcher_vue_vue_type_template_id_6ae6c1bc___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"];});



/***/}}]);

}());
=======
!function(){"use strict";var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function e(t,e){return t(e={exports:{}},e.exports),e.exports}var r=function(t){return t&&t.Math==Math&&t},n=r("object"==typeof globalThis&&globalThis)||r("object"==typeof window&&window)||r("object"==typeof self&&self)||r("object"==typeof t&&t)||function(){return this}()||Function("return this")(),i=function(t){try{return!!t()}catch(t){return!0}},a=!i((function(){return 7!=Object.defineProperty({},1,{get:function(){return 7}})[1]})),o={}.propertyIsEnumerable,s=Object.getOwnPropertyDescriptor,u={f:s&&!o.call({1:2},1)?function(t){var e=s(this,t);return!!e&&e.enumerable}:o},l=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}},c={}.toString,f=function(t){return c.call(t).slice(8,-1)},h="".split,p=i((function(){return!Object("z").propertyIsEnumerable(0)}))?function(t){return"String"==f(t)?h.call(t,""):Object(t)}:Object,d=function(t){if(null==t)throw TypeError("Can't call method on "+t);return t},v=function(t){return p(d(t))},g=function(t){return"object"==typeof t?null!==t:"function"==typeof t},m=function(t,e){if(!g(t))return t;var r,n;if(e&&"function"==typeof(r=t.toString)&&!g(n=r.call(t)))return n;if("function"==typeof(r=t.valueOf)&&!g(n=r.call(t)))return n;if(!e&&"function"==typeof(r=t.toString)&&!g(n=r.call(t)))return n;throw TypeError("Can't convert object to primitive value")},y={}.hasOwnProperty,b=function(t,e){return y.call(t,e)},_=n.document,w=g(_)&&g(_.createElement),S=function(t){return w?_.createElement(t):{}},P=!a&&!i((function(){return 7!=Object.defineProperty(S("div"),"a",{get:function(){return 7}}).a})),x=Object.getOwnPropertyDescriptor,C={f:a?x:function(t,e){if(t=v(t),e=m(e,!0),P)try{return x(t,e)}catch(t){}if(b(t,e))return l(!u.f.call(t,e),t[e])}},E=function(t){if(!g(t))throw TypeError(String(t)+" is not an object");return t},R=Object.defineProperty,O={f:a?R:function(t,e,r){if(E(t),e=m(e,!0),E(r),P)try{return R(t,e,r)}catch(t){}if("get"in r||"set"in r)throw TypeError("Accessors not supported");return"value"in r&&(t[e]=r.value),t}},A=a?function(t,e,r){return O.f(t,e,l(1,r))}:function(t,e,r){return t[e]=r,t},I=function(t,e){try{A(n,t,e)}catch(r){n[t]=e}return e},T=n["__core-js_shared__"]||I("__core-js_shared__",{}),L=Function.toString;"function"!=typeof T.inspectSource&&(T.inspectSource=function(t){return L.call(t)});var j,k,F,$=T.inspectSource,U=n.WeakMap,N="function"==typeof U&&/native code/.test($(U)),D=e((function(t){(t.exports=function(t,e){return T[t]||(T[t]=void 0!==e?e:{})})("versions",[]).push({version:"3.10.2",mode:"global",copyright:"© 2021 Denis Pushkarev (zloirock.ru)"})})),B=0,M=Math.random(),q=function(t){return"Symbol("+String(void 0===t?"":t)+")_"+(++B+M).toString(36)},G=D("keys"),z=function(t){return G[t]||(G[t]=q(t))},V={},K=n.WeakMap;if(N){var H=T.state||(T.state=new K),Y=H.get,W=H.has,X=H.set;j=function(t,e){if(W.call(H,t))throw new TypeError("Object already initialized");return e.facade=t,X.call(H,t,e),e},k=function(t){return Y.call(H,t)||{}},F=function(t){return W.call(H,t)}}else{var J=z("state");V[J]=!0,j=function(t,e){if(b(t,J))throw new TypeError("Object already initialized");return e.facade=t,A(t,J,e),e},k=function(t){return b(t,J)?t[J]:{}},F=function(t){return b(t,J)}}var Q,Z,tt={set:j,get:k,has:F,enforce:function(t){return F(t)?k(t):j(t,{})},getterFor:function(t){return function(e){var r;if(!g(e)||(r=k(e)).type!==t)throw TypeError("Incompatible receiver, "+t+" required");return r}}},et=e((function(t){var e=tt.get,r=tt.enforce,i=String(String).split("String");(t.exports=function(t,e,a,o){var s,u=!!o&&!!o.unsafe,l=!!o&&!!o.enumerable,c=!!o&&!!o.noTargetGet;"function"==typeof a&&("string"!=typeof e||b(a,"name")||A(a,"name",e),(s=r(a)).source||(s.source=i.join("string"==typeof e?e:""))),t!==n?(u?!c&&t[e]&&(l=!0):delete t[e],l?t[e]=a:A(t,e,a)):l?t[e]=a:I(e,a)})(Function.prototype,"toString",(function(){return"function"==typeof this&&e(this).source||$(this)}))})),rt=n,nt=function(t){return"function"==typeof t?t:void 0},it=function(t,e){return arguments.length<2?nt(rt[t])||nt(n[t]):rt[t]&&rt[t][e]||n[t]&&n[t][e]},at=Math.ceil,ot=Math.floor,st=function(t){return isNaN(t=+t)?0:(t>0?ot:at)(t)},ut=Math.min,lt=function(t){return t>0?ut(st(t),9007199254740991):0},ct=Math.max,ft=Math.min,ht=function(t){return function(e,r,n){var i,a=v(e),o=lt(a.length),s=function(t,e){var r=st(t);return r<0?ct(r+e,0):ft(r,e)}(n,o);if(t&&r!=r){for(;o>s;)if((i=a[s++])!=i)return!0}else for(;o>s;s++)if((t||s in a)&&a[s]===r)return t||s||0;return!t&&-1}},pt={includes:ht(!0),indexOf:ht(!1)},dt=pt.indexOf,vt=function(t,e){var r,n=v(t),i=0,a=[];for(r in n)!b(V,r)&&b(n,r)&&a.push(r);for(;e.length>i;)b(n,r=e[i++])&&(~dt(a,r)||a.push(r));return a},gt=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"],mt=gt.concat("length","prototype"),yt={f:Object.getOwnPropertyNames||function(t){return vt(t,mt)}},bt={f:Object.getOwnPropertySymbols},_t=it("Reflect","ownKeys")||function(t){var e=yt.f(E(t)),r=bt.f;return r?e.concat(r(t)):e},wt=function(t,e){for(var r=_t(e),n=O.f,i=C.f,a=0;a<r.length;a++){var o=r[a];b(t,o)||n(t,o,i(e,o))}},St=/#|\.prototype\./,Pt=function(t,e){var r=Ct[xt(t)];return r==Rt||r!=Et&&("function"==typeof e?i(e):!!e)},xt=Pt.normalize=function(t){return String(t).replace(St,".").toLowerCase()},Ct=Pt.data={},Et=Pt.NATIVE="N",Rt=Pt.POLYFILL="P",Ot=Pt,At=C.f,It=function(t,e){var r,i,a,o,s,u=t.target,l=t.global,c=t.stat;if(r=l?n:c?n[u]||I(u,{}):(n[u]||{}).prototype)for(i in e){if(o=e[i],a=t.noTargetGet?(s=At(r,i))&&s.value:r[i],!Ot(l?i:u+(c?".":"#")+i,t.forced)&&void 0!==a){if(typeof o==typeof a)continue;wt(o,a)}(t.sham||a&&a.sham)&&A(o,"sham",!0),et(r,i,o,t)}},Tt="process"==f(n.process),Lt=it("navigator","userAgent")||"",jt=n.process,kt=jt&&jt.versions,Ft=kt&&kt.v8;Ft?Z=(Q=Ft.split("."))[0]+Q[1]:Lt&&(!(Q=Lt.match(/Edge\/(\d+)/))||Q[1]>=74)&&(Q=Lt.match(/Chrome\/(\d+)/))&&(Z=Q[1]);var $t,Ut=Z&&+Z,Nt=!!Object.getOwnPropertySymbols&&!i((function(){return!Symbol.sham&&(Tt?38===Ut:Ut>37&&Ut<41)})),Dt=Nt&&!Symbol.sham&&"symbol"==typeof Symbol.iterator,Bt=D("wks"),Mt=n.Symbol,qt=Dt?Mt:Mt&&Mt.withoutSetter||q,Gt=function(t){return b(Bt,t)&&(Nt||"string"==typeof Bt[t])||(Nt&&b(Mt,t)?Bt[t]=Mt[t]:Bt[t]=qt("Symbol."+t)),Bt[t]},zt=Object.keys||function(t){return vt(t,gt)},Vt=a?Object.defineProperties:function(t,e){E(t);for(var r,n=zt(e),i=n.length,a=0;i>a;)O.f(t,r=n[a++],e[r]);return t},Kt=it("document","documentElement"),Ht=z("IE_PROTO"),Yt=function(){},Wt=function(t){return"<script>"+t+"<\/script>"},Xt=function(){try{$t=document.domain&&new ActiveXObject("htmlfile")}catch(t){}var t,e;Xt=$t?function(t){t.write(Wt("")),t.close();var e=t.parentWindow.Object;return t=null,e}($t):((e=S("iframe")).style.display="none",Kt.appendChild(e),e.src=String("javascript:"),(t=e.contentWindow.document).open(),t.write(Wt("document.F=Object")),t.close(),t.F);for(var r=gt.length;r--;)delete Xt.prototype[gt[r]];return Xt()};V[Ht]=!0;var Jt=Object.create||function(t,e){var r;return null!==t?(Yt.prototype=E(t),r=new Yt,Yt.prototype=null,r[Ht]=t):r=Xt(),void 0===e?r:Vt(r,e)},Qt=Gt("unscopables"),Zt=Array.prototype;null==Zt[Qt]&&O.f(Zt,Qt,{configurable:!0,value:Jt(null)});var te=function(t){Zt[Qt][t]=!0},ee=pt.includes;It({target:"Array",proto:!0},{includes:function(t){return ee(this,t,arguments.length>1?arguments[1]:void 0)}}),te("includes");var re=Gt("match"),ne=function(t){var e;return g(t)&&(void 0!==(e=t[re])?!!e:"RegExp"==f(t))},ie=function(t){if(ne(t))throw TypeError("The method doesn't accept regular expressions");return t},ae=Gt("match");It({target:"String",proto:!0,forced:!function(t){var e=/./;try{"/./"[t](e)}catch(r){try{return e[ae]=!1,"/./"[t](e)}catch(t){}}return!1}("includes")},{includes:function(t){return!!~String(d(this)).indexOf(ie(t),arguments.length>1?arguments[1]:void 0)}});var oe=function(t){if("function"!=typeof t)throw TypeError(String(t)+" is not a function");return t},se=function(t,e,r){if(oe(t),void 0===e)return t;switch(r){case 0:return function(){return t.call(e)};case 1:return function(r){return t.call(e,r)};case 2:return function(r,n){return t.call(e,r,n)};case 3:return function(r,n,i){return t.call(e,r,n,i)}}return function(){return t.apply(e,arguments)}},ue=function(t){return Object(d(t))},le=Array.isArray||function(t){return"Array"==f(t)},ce=Gt("species"),fe=function(t,e){var r;return le(t)&&("function"!=typeof(r=t.constructor)||r!==Array&&!le(r.prototype)?g(r)&&null===(r=r[ce])&&(r=void 0):r=void 0),new(void 0===r?Array:r)(0===e?0:e)},he=[].push,pe=function(t){var e=1==t,r=2==t,n=3==t,i=4==t,a=6==t,o=7==t,s=5==t||a;return function(u,l,c,f){for(var h,d,v=ue(u),g=p(v),m=se(l,c,3),y=lt(g.length),b=0,_=f||fe,w=e?_(u,y):r||o?_(u,0):void 0;y>b;b++)if((s||b in g)&&(d=m(h=g[b],b,v),t))if(e)w[b]=d;else if(d)switch(t){case 3:return!0;case 5:return h;case 6:return b;case 2:he.call(w,h)}else switch(t){case 4:return!1;case 7:he.call(w,h)}return a?-1:n||i?i:w}},de={forEach:pe(0),map:pe(1),filter:pe(2),some:pe(3),every:pe(4),find:pe(5),findIndex:pe(6),filterOut:pe(7)},ve=Gt("species"),ge=function(t){return Ut>=51||!i((function(){var e=[];return(e.constructor={})[ve]=function(){return{foo:1}},1!==e[t](Boolean).foo}))},me=de.map,ye=ge("map");It({target:"Array",proto:!0,forced:!ye},{map:function(t){return me(this,t,arguments.length>1?arguments[1]:void 0)}});var be=O.f,_e=Function.prototype,we=_e.toString,Se=/^\s*function ([^ (]*)/;a&&!("name"in _e)&&be(_e,"name",{configurable:!0,get:function(){try{return we.call(this).match(Se)[1]}catch(t){return""}}});var Pe=i((function(){zt(1)}));It({target:"Object",stat:!0,forced:Pe},{keys:function(t){return zt(ue(t))}});var xe=yt.f,Ce={}.toString,Ee="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],Re={f:function(t){return Ee&&"[object Window]"==Ce.call(t)?function(t){try{return xe(t)}catch(t){return Ee.slice()}}(t):xe(v(t))}},Oe={f:Gt},Ae=O.f,Ie=O.f,Te=Gt("toStringTag"),Le=function(t,e,r){t&&!b(t=r?t:t.prototype,Te)&&Ie(t,Te,{configurable:!0,value:e})},je=de.forEach,ke=z("hidden"),Fe=Gt("toPrimitive"),$e=tt.set,Ue=tt.getterFor("Symbol"),Ne=Object.prototype,De=n.Symbol,Be=it("JSON","stringify"),Me=C.f,qe=O.f,Ge=Re.f,ze=u.f,Ve=D("symbols"),Ke=D("op-symbols"),He=D("string-to-symbol-registry"),Ye=D("symbol-to-string-registry"),We=D("wks"),Xe=n.QObject,Je=!Xe||!Xe.prototype||!Xe.prototype.findChild,Qe=a&&i((function(){return 7!=Jt(qe({},"a",{get:function(){return qe(this,"a",{value:7}).a}})).a}))?function(t,e,r){var n=Me(Ne,e);n&&delete Ne[e],qe(t,e,r),n&&t!==Ne&&qe(Ne,e,n)}:qe,Ze=function(t,e){var r=Ve[t]=Jt(De.prototype);return $e(r,{type:"Symbol",tag:t,description:e}),a||(r.description=e),r},tr=Dt?function(t){return"symbol"==typeof t}:function(t){return Object(t)instanceof De},er=function(t,e,r){t===Ne&&er(Ke,e,r),E(t);var n=m(e,!0);return E(r),b(Ve,n)?(r.enumerable?(b(t,ke)&&t[ke][n]&&(t[ke][n]=!1),r=Jt(r,{enumerable:l(0,!1)})):(b(t,ke)||qe(t,ke,l(1,{})),t[ke][n]=!0),Qe(t,n,r)):qe(t,n,r)},rr=function(t,e){E(t);var r=v(e),n=zt(r).concat(or(r));return je(n,(function(e){a&&!nr.call(r,e)||er(t,e,r[e])})),t},nr=function(t){var e=m(t,!0),r=ze.call(this,e);return!(this===Ne&&b(Ve,e)&&!b(Ke,e))&&(!(r||!b(this,e)||!b(Ve,e)||b(this,ke)&&this[ke][e])||r)},ir=function(t,e){var r=v(t),n=m(e,!0);if(r!==Ne||!b(Ve,n)||b(Ke,n)){var i=Me(r,n);return!i||!b(Ve,n)||b(r,ke)&&r[ke][n]||(i.enumerable=!0),i}},ar=function(t){var e=Ge(v(t)),r=[];return je(e,(function(t){b(Ve,t)||b(V,t)||r.push(t)})),r},or=function(t){var e=t===Ne,r=Ge(e?Ke:v(t)),n=[];return je(r,(function(t){!b(Ve,t)||e&&!b(Ne,t)||n.push(Ve[t])})),n};if(Nt||(et((De=function(){if(this instanceof De)throw TypeError("Symbol is not a constructor");var t=arguments.length&&void 0!==arguments[0]?String(arguments[0]):void 0,e=q(t),r=function(t){this===Ne&&r.call(Ke,t),b(this,ke)&&b(this[ke],e)&&(this[ke][e]=!1),Qe(this,e,l(1,t))};return a&&Je&&Qe(Ne,e,{configurable:!0,set:r}),Ze(e,t)}).prototype,"toString",(function(){return Ue(this).tag})),et(De,"withoutSetter",(function(t){return Ze(q(t),t)})),u.f=nr,O.f=er,C.f=ir,yt.f=Re.f=ar,bt.f=or,Oe.f=function(t){return Ze(Gt(t),t)},a&&(qe(De.prototype,"description",{configurable:!0,get:function(){return Ue(this).description}}),et(Ne,"propertyIsEnumerable",nr,{unsafe:!0}))),It({global:!0,wrap:!0,forced:!Nt,sham:!Nt},{Symbol:De}),je(zt(We),(function(t){!function(t){var e=rt.Symbol||(rt.Symbol={});b(e,t)||Ae(e,t,{value:Oe.f(t)})}(t)})),It({target:"Symbol",stat:!0,forced:!Nt},{for:function(t){var e=String(t);if(b(He,e))return He[e];var r=De(e);return He[e]=r,Ye[r]=e,r},keyFor:function(t){if(!tr(t))throw TypeError(t+" is not a symbol");if(b(Ye,t))return Ye[t]},useSetter:function(){Je=!0},useSimple:function(){Je=!1}}),It({target:"Object",stat:!0,forced:!Nt,sham:!a},{create:function(t,e){return void 0===e?Jt(t):rr(Jt(t),e)},defineProperty:er,defineProperties:rr,getOwnPropertyDescriptor:ir}),It({target:"Object",stat:!0,forced:!Nt},{getOwnPropertyNames:ar,getOwnPropertySymbols:or}),It({target:"Object",stat:!0,forced:i((function(){bt.f(1)}))},{getOwnPropertySymbols:function(t){return bt.f(ue(t))}}),Be){var sr=!Nt||i((function(){var t=De();return"[null]"!=Be([t])||"{}"!=Be({a:t})||"{}"!=Be(Object(t))}));It({target:"JSON",stat:!0,forced:sr},{stringify:function(t,e,r){for(var n,i=[t],a=1;arguments.length>a;)i.push(arguments[a++]);if(n=e,(g(e)||void 0!==t)&&!tr(t))return le(e)||(e=function(t,e){if("function"==typeof n&&(e=n.call(this,t,e)),!tr(e))return e}),i[1]=e,Be.apply(null,i)}})}De.prototype[Fe]||A(De.prototype,Fe,De.prototype.valueOf),Le(De,"Symbol"),V[ke]=!0;var ur=de.filter,lr=ge("filter");It({target:"Array",proto:!0,forced:!lr},{filter:function(t){return ur(this,t,arguments.length>1?arguments[1]:void 0)}});var cr=C.f,fr=i((function(){cr(1)}));It({target:"Object",stat:!0,forced:!a||fr,sham:!a},{getOwnPropertyDescriptor:function(t,e){return cr(v(t),e)}});var hr={CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0},pr=function(t,e){var r=[][t];return!!r&&i((function(){r.call(null,e||function(){throw 1},1)}))},dr=de.forEach,vr=pr("forEach")?[].forEach:function(t){return dr(this,t,arguments.length>1?arguments[1]:void 0)};for(var gr in hr){var mr=n[gr],yr=mr&&mr.prototype;if(yr&&yr.forEach!==vr)try{A(yr,"forEach",vr)}catch(t){yr.forEach=vr}}var br=function(t,e,r){var n=m(e);n in t?O.f(t,n,l(0,r)):t[n]=r};It({target:"Object",stat:!0,sham:!a},{getOwnPropertyDescriptors:function(t){for(var e,r,n=v(t),i=C.f,a=_t(n),o={},s=0;a.length>s;)void 0!==(r=i(n,e=a[s++]))&&br(o,e,r);return o}});var _r=Object.assign,wr=Object.defineProperty,Sr=!_r||i((function(){if(a&&1!==_r({b:1},_r(wr({},"a",{enumerable:!0,get:function(){wr(this,"b",{value:3,enumerable:!1})}}),{b:2})).b)return!0;var t={},e={},r=Symbol();return t[r]=7,"abcdefghijklmnopqrst".split("").forEach((function(t){e[t]=t})),7!=_r({},t)[r]||"abcdefghijklmnopqrst"!=zt(_r({},e)).join("")}))?function(t,e){for(var r=ue(t),n=arguments.length,i=1,o=bt.f,s=u.f;n>i;)for(var l,c=p(arguments[i++]),f=o?zt(c).concat(o(c)):zt(c),h=f.length,d=0;h>d;)l=f[d++],a&&!s.call(c,l)||(r[l]=c[l]);return r}:_r;It({target:"Object",stat:!0,forced:Object.assign!==Sr},{assign:Sr});var Pr=function(){var t=E(this),e="";return t.global&&(e+="g"),t.ignoreCase&&(e+="i"),t.multiline&&(e+="m"),t.dotAll&&(e+="s"),t.unicode&&(e+="u"),t.sticky&&(e+="y"),e};function xr(t,e){return RegExp(t,e)}var Cr,Er,Rr={UNSUPPORTED_Y:i((function(){var t=xr("a","y");return t.lastIndex=2,null!=t.exec("abcd")})),BROKEN_CARET:i((function(){var t=xr("^r","gy");return t.lastIndex=2,null!=t.exec("str")}))},Or=RegExp.prototype.exec,Ar=D("native-string-replace",String.prototype.replace),Ir=Or,Tr=(Cr=/a/,Er=/b*/g,Or.call(Cr,"a"),Or.call(Er,"a"),0!==Cr.lastIndex||0!==Er.lastIndex),Lr=Rr.UNSUPPORTED_Y||Rr.BROKEN_CARET,jr=void 0!==/()??/.exec("")[1];(Tr||jr||Lr)&&(Ir=function(t){var e,r,n,i,a=this,o=Lr&&a.sticky,s=Pr.call(a),u=a.source,l=0,c=t;return o&&(-1===(s=s.replace("y","")).indexOf("g")&&(s+="g"),c=String(t).slice(a.lastIndex),a.lastIndex>0&&(!a.multiline||a.multiline&&"\n"!==t[a.lastIndex-1])&&(u="(?: "+u+")",c=" "+c,l++),r=new RegExp("^(?:"+u+")",s)),jr&&(r=new RegExp("^"+u+"$(?!\\s)",s)),Tr&&(e=a.lastIndex),n=Or.call(o?r:a,c),o?n?(n.input=n.input.slice(l),n[0]=n[0].slice(l),n.index=a.lastIndex,a.lastIndex+=n[0].length):a.lastIndex=0:Tr&&n&&(a.lastIndex=a.global?n.index+n[0].length:e),jr&&n&&n.length>1&&Ar.call(n[0],r,(function(){for(i=1;i<arguments.length-2;i++)void 0===arguments[i]&&(n[i]=void 0)})),n});var kr=Ir;It({target:"RegExp",proto:!0,forced:/./.exec!==kr},{exec:kr});var Fr=Gt("species"),$r=!i((function(){var t=/./;return t.exec=function(){var t=[];return t.groups={a:"7"},t},"7"!=="".replace(t,"$<a>")})),Ur="$0"==="a".replace(/./,"$0"),Nr=Gt("replace"),Dr=!!/./[Nr]&&""===/./[Nr]("a","$0"),Br=!i((function(){var t=/(?:)/,e=t.exec;t.exec=function(){return e.apply(this,arguments)};var r="ab".split(t);return 2!==r.length||"a"!==r[0]||"b"!==r[1]})),Mr=function(t,e,r,n){var a=Gt(t),o=!i((function(){var e={};return e[a]=function(){return 7},7!=""[t](e)})),s=o&&!i((function(){var e=!1,r=/a/;return"split"===t&&((r={}).constructor={},r.constructor[Fr]=function(){return r},r.flags="",r[a]=/./[a]),r.exec=function(){return e=!0,null},r[a](""),!e}));if(!o||!s||"replace"===t&&(!$r||!Ur||Dr)||"split"===t&&!Br){var u=/./[a],l=r(a,""[t],(function(t,e,r,n,i){return e.exec===RegExp.prototype.exec?o&&!i?{done:!0,value:u.call(e,r,n)}:{done:!0,value:t.call(r,e,n)}:{done:!1}}),{REPLACE_KEEPS_$0:Ur,REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE:Dr}),c=l[0],f=l[1];et(String.prototype,t,c),et(RegExp.prototype,a,2==e?function(t,e){return f.call(t,this,e)}:function(t){return f.call(t,this)})}n&&A(RegExp.prototype[a],"sham",!0)},qr=Object.is||function(t,e){return t===e?0!==t||1/t==1/e:t!=t&&e!=e},Gr=function(t,e){var r=t.exec;if("function"==typeof r){var n=r.call(t,e);if("object"!=typeof n)throw TypeError("RegExp exec method returned something other than an Object or null");return n}if("RegExp"!==f(t))throw TypeError("RegExp#exec called on incompatible receiver");return kr.call(t,e)};Mr("search",1,(function(t,e,r){return[function(e){var r=d(this),n=null==e?void 0:e[t];return void 0!==n?n.call(e,r):new RegExp(e)[t](String(r))},function(t){var n=r(e,t,this);if(n.done)return n.value;var i=E(t),a=String(this),o=i.lastIndex;qr(o,0)||(i.lastIndex=0);var s=Gr(i,a);return qr(i.lastIndex,o)||(i.lastIndex=o),null===s?-1:s.index}]}));var zr=Gt("species"),Vr=function(t){return function(e,r){var n,i,a=String(d(e)),o=st(r),s=a.length;return o<0||o>=s?t?"":void 0:(n=a.charCodeAt(o))<55296||n>56319||o+1===s||(i=a.charCodeAt(o+1))<56320||i>57343?t?a.charAt(o):n:t?a.slice(o,o+2):i-56320+(n-55296<<10)+65536}},Kr={codeAt:Vr(!1),charAt:Vr(!0)},Hr=Kr.charAt,Yr=function(t,e,r){return e+(r?Hr(t,e).length:1)},Wr=Rr.UNSUPPORTED_Y,Xr=[].push,Jr=Math.min;Mr("split",2,(function(t,e,r){var n;return n="c"=="abbc".split(/(b)*/)[1]||4!="test".split(/(?:)/,-1).length||2!="ab".split(/(?:ab)*/).length||4!=".".split(/(.?)(.?)/).length||".".split(/()()/).length>1||"".split(/.?/).length?function(t,r){var n=String(d(this)),i=void 0===r?4294967295:r>>>0;if(0===i)return[];if(void 0===t)return[n];if(!ne(t))return e.call(n,t,i);for(var a,o,s,u=[],l=(t.ignoreCase?"i":"")+(t.multiline?"m":"")+(t.unicode?"u":"")+(t.sticky?"y":""),c=0,f=new RegExp(t.source,l+"g");(a=kr.call(f,n))&&!((o=f.lastIndex)>c&&(u.push(n.slice(c,a.index)),a.length>1&&a.index<n.length&&Xr.apply(u,a.slice(1)),s=a[0].length,c=o,u.length>=i));)f.lastIndex===a.index&&f.lastIndex++;return c===n.length?!s&&f.test("")||u.push(""):u.push(n.slice(c)),u.length>i?u.slice(0,i):u}:"0".split(void 0,0).length?function(t,r){return void 0===t&&0===r?[]:e.call(this,t,r)}:e,[function(e,r){var i=d(this),a=null==e?void 0:e[t];return void 0!==a?a.call(e,i,r):n.call(String(i),e,r)},function(t,i){var a=r(n,t,this,i,n!==e);if(a.done)return a.value;var o=E(t),s=String(this),u=function(t,e){var r,n=E(t).constructor;return void 0===n||null==(r=E(n)[zr])?e:oe(r)}(o,RegExp),l=o.unicode,c=(o.ignoreCase?"i":"")+(o.multiline?"m":"")+(o.unicode?"u":"")+(Wr?"g":"y"),f=new u(Wr?"^(?:"+o.source+")":o,c),h=void 0===i?4294967295:i>>>0;if(0===h)return[];if(0===s.length)return null===Gr(f,s)?[s]:[];for(var p=0,d=0,v=[];d<s.length;){f.lastIndex=Wr?0:d;var g,m=Gr(f,Wr?s.slice(d):s);if(null===m||(g=Jr(lt(f.lastIndex+(Wr?d:0)),s.length))===p)d=Yr(s,d,l);else{if(v.push(s.slice(p,d)),v.length===h)return v;for(var y=1;y<=m.length-1;y++)if(v.push(m[y]),v.length===h)return v;d=p=g}}return v.push(s.slice(p)),v}]}),Wr);var Qr={};Qr[Gt("toStringTag")]="z";var Zr="[object z]"===String(Qr),tn=Gt("toStringTag"),en="Arguments"==f(function(){return arguments}()),rn=Zr?f:function(t){var e,r,n;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(r=function(t,e){try{return t[e]}catch(t){}}(e=Object(t),tn))?r:en?f(e):"Object"==(n=f(e))&&"function"==typeof e.callee?"Arguments":n},nn=Zr?{}.toString:function(){return"[object "+rn(this)+"]"};Zr||et(Object.prototype,"toString",nn,{unsafe:!0});var an=RegExp.prototype,on=an.toString,sn=i((function(){return"/a/b"!=on.call({source:"a",flags:"b"})})),un="toString"!=on.name;(sn||un)&&et(RegExp.prototype,"toString",(function(){var t=E(this),e=String(t.source),r=t.flags;return"/"+e+"/"+String(void 0===r&&t instanceof RegExp&&!("flags"in an)?Pr.call(t):r)}),{unsafe:!0});var ln=Gt("isConcatSpreadable"),cn=Ut>=51||!i((function(){var t=[];return t[ln]=!1,t.concat()[0]!==t})),fn=ge("concat"),hn=function(t){if(!g(t))return!1;var e=t[ln];return void 0!==e?!!e:le(t)};It({target:"Array",proto:!0,forced:!cn||!fn},{concat:function(t){var e,r,n,i,a,o=ue(this),s=fe(o,0),u=0;for(e=-1,n=arguments.length;e<n;e++)if(hn(a=-1===e?o:arguments[e])){if(u+(i=lt(a.length))>9007199254740991)throw TypeError("Maximum allowed index exceeded");for(r=0;r<i;r++,u++)r in a&&br(s,u,a[r])}else{if(u>=9007199254740991)throw TypeError("Maximum allowed index exceeded");br(s,u++,a)}return s.length=u,s}});var pn,dn,vn,gn={},mn=!i((function(){function t(){}return t.prototype.constructor=null,Object.getPrototypeOf(new t)!==t.prototype})),yn=z("IE_PROTO"),bn=Object.prototype,_n=mn?Object.getPrototypeOf:function(t){return t=ue(t),b(t,yn)?t[yn]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?bn:null},wn=Gt("iterator"),Sn=!1;[].keys&&("next"in(vn=[].keys())?(dn=_n(_n(vn)))!==Object.prototype&&(pn=dn):Sn=!0),(null==pn||i((function(){var t={};return pn[wn].call(t)!==t})))&&(pn={}),b(pn,wn)||A(pn,wn,(function(){return this}));var Pn={IteratorPrototype:pn,BUGGY_SAFARI_ITERATORS:Sn},xn=Pn.IteratorPrototype,Cn=function(){return this},En=function(t,e,r){var n=e+" Iterator";return t.prototype=Jt(xn,{next:l(1,r)}),Le(t,n,!1),gn[n]=Cn,t},Rn=Object.setPrototypeOf||("__proto__"in{}?function(){var t,e=!1,r={};try{(t=Object.getOwnPropertyDescriptor(Object.prototype,"__proto__").set).call(r,[]),e=r instanceof Array}catch(t){}return function(r,n){return E(r),function(t){if(!g(t)&&null!==t)throw TypeError("Can't set "+String(t)+" as a prototype")}(n),e?t.call(r,n):r.__proto__=n,r}}():void 0),On=Pn.IteratorPrototype,An=Pn.BUGGY_SAFARI_ITERATORS,In=Gt("iterator"),Tn=function(){return this},Ln=function(t,e,r,n,i,a,o){En(r,e,n);var s,u,l,c=function(t){if(t===i&&v)return v;if(!An&&t in p)return p[t];switch(t){case"keys":case"values":case"entries":return function(){return new r(this,t)}}return function(){return new r(this)}},f=e+" Iterator",h=!1,p=t.prototype,d=p[In]||p["@@iterator"]||i&&p[i],v=!An&&d||c(i),g="Array"==e&&p.entries||d;if(g&&(s=_n(g.call(new t)),On!==Object.prototype&&s.next&&(_n(s)!==On&&(Rn?Rn(s,On):"function"!=typeof s[In]&&A(s,In,Tn)),Le(s,f,!0))),"values"==i&&d&&"values"!==d.name&&(h=!0,v=function(){return d.call(this)}),p[In]!==v&&A(p,In,v),gn[e]=v,i)if(u={values:c("values"),keys:a?v:c("keys"),entries:c("entries")},o)for(l in u)(An||h||!(l in p))&&et(p,l,u[l]);else It({target:e,proto:!0,forced:An||h},u);return u},jn=tt.set,kn=tt.getterFor("Array Iterator"),Fn=Ln(Array,"Array",(function(t,e){jn(this,{type:"Array Iterator",target:v(t),index:0,kind:e})}),(function(){var t=kn(this),e=t.target,r=t.kind,n=t.index++;return!e||n>=e.length?(t.target=void 0,{value:void 0,done:!0}):"keys"==r?{value:n,done:!1}:"values"==r?{value:e[n],done:!1}:{value:[n,e[n]],done:!1}}),"values");gn.Arguments=gn.Array,te("keys"),te("values"),te("entries");var $n=Kr.charAt,Un=tt.set,Nn=tt.getterFor("String Iterator");Ln(String,"String",(function(t){Un(this,{type:"String Iterator",string:String(t),index:0})}),(function(){var t,e=Nn(this),r=e.string,n=e.index;return n>=r.length?{value:void 0,done:!0}:(t=$n(r,n),e.index+=t.length,{value:t,done:!1})}));var Dn=Gt("iterator"),Bn=Gt("toStringTag"),Mn=Fn.values;for(var qn in hr){var Gn=n[qn],zn=Gn&&Gn.prototype;if(zn){if(zn[Dn]!==Mn)try{A(zn,Dn,Mn)}catch(t){zn[Dn]=Mn}if(zn[Bn]||A(zn,Bn,qn),hr[qn])for(var Vn in Fn)if(zn[Vn]!==Fn[Vn])try{A(zn,Vn,Fn[Vn])}catch(t){zn[Vn]=Fn[Vn]}}}var Kn=Gt("iterator"),Hn=!i((function(){var t=new URL("b?a=1&b=2&c=3","http://a"),e=t.searchParams,r="";return t.pathname="c%20d",e.forEach((function(t,n){e.delete("b"),r+=n+t})),!e.sort||"http://a/c%20d?a=1&c=3"!==t.href||"3"!==e.get("c")||"a=1"!==String(new URLSearchParams("?a=1"))||!e[Kn]||"a"!==new URL("https://a@b").username||"b"!==new URLSearchParams(new URLSearchParams("a=b")).get("a")||"xn--e1aybc"!==new URL("http://тест").host||"#%D0%B1"!==new URL("http://a#б").hash||"a1c3"!==r||"x"!==new URL("http://x",void 0).host})),Yn=function(t,e,r){if(!(t instanceof e))throw TypeError("Incorrect "+(r?r+" ":"")+"invocation");return t},Wn=function(t,e,r,n){try{return n?e(E(r)[0],r[1]):e(r)}catch(e){throw function(t){var e=t.return;if(void 0!==e)E(e.call(t)).value}(t),e}},Xn=Gt("iterator"),Jn=Array.prototype,Qn=function(t){return void 0!==t&&(gn.Array===t||Jn[Xn]===t)},Zn=Gt("iterator"),ti=function(t){if(null!=t)return t[Zn]||t["@@iterator"]||gn[rn(t)]},ei=function(t){var e,r,n,i,a,o,s=ue(t),u="function"==typeof this?this:Array,l=arguments.length,c=l>1?arguments[1]:void 0,f=void 0!==c,h=ti(s),p=0;if(f&&(c=se(c,l>2?arguments[2]:void 0,2)),null==h||u==Array&&Qn(h))for(r=new u(e=lt(s.length));e>p;p++)o=f?c(s[p],p):s[p],br(r,p,o);else for(a=(i=h.call(s)).next,r=new u;!(n=a.call(i)).done;p++)o=f?Wn(i,c,[n.value,p],!0):n.value,br(r,p,o);return r.length=p,r},ri=/[^\0-\u007E]/,ni=/[.\u3002\uFF0E\uFF61]/g,ii="Overflow: input needs wider integers to process",ai=Math.floor,oi=String.fromCharCode,si=function(t){return t+22+75*(t<26)},ui=function(t,e,r){var n=0;for(t=r?ai(t/700):t>>1,t+=ai(t/e);t>455;n+=36)t=ai(t/35);return ai(n+36*t/(t+38))},li=function(t){var e,r,n=[],i=(t=function(t){for(var e=[],r=0,n=t.length;r<n;){var i=t.charCodeAt(r++);if(i>=55296&&i<=56319&&r<n){var a=t.charCodeAt(r++);56320==(64512&a)?e.push(((1023&i)<<10)+(1023&a)+65536):(e.push(i),r--)}else e.push(i)}return e}(t)).length,a=128,o=0,s=72;for(e=0;e<t.length;e++)(r=t[e])<128&&n.push(oi(r));var u=n.length,l=u;for(u&&n.push("-");l<i;){var c=2147483647;for(e=0;e<t.length;e++)(r=t[e])>=a&&r<c&&(c=r);var f=l+1;if(c-a>ai((2147483647-o)/f))throw RangeError(ii);for(o+=(c-a)*f,a=c,e=0;e<t.length;e++){if((r=t[e])<a&&++o>2147483647)throw RangeError(ii);if(r==a){for(var h=o,p=36;;p+=36){var d=p<=s?1:p>=s+26?26:p-s;if(h<d)break;var v=h-d,g=36-d;n.push(oi(si(d+v%g))),h=ai(v/g)}n.push(oi(si(h))),s=ui(o,f,l==u),o=0,++l}}++o,++a}return n.join("")},ci=function(t){var e=ti(t);if("function"!=typeof e)throw TypeError(String(t)+" is not iterable");return E(e.call(t))},fi=it("fetch"),hi=it("Headers"),pi=Gt("iterator"),di=tt.set,vi=tt.getterFor("URLSearchParams"),gi=tt.getterFor("URLSearchParamsIterator"),mi=/\+/g,yi=Array(4),bi=function(t){return yi[t-1]||(yi[t-1]=RegExp("((?:%[\\da-f]{2}){"+t+"})","gi"))},_i=function(t){try{return decodeURIComponent(t)}catch(e){return t}},wi=function(t){var e=t.replace(mi," "),r=4;try{return decodeURIComponent(e)}catch(t){for(;r;)e=e.replace(bi(r--),_i);return e}},Si=/[!'()~]|%20/g,Pi={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+"},xi=function(t){return Pi[t]},Ci=function(t){return encodeURIComponent(t).replace(Si,xi)},Ei=function(t,e){if(e)for(var r,n,i=e.split("&"),a=0;a<i.length;)(r=i[a++]).length&&(n=r.split("="),t.push({key:wi(n.shift()),value:wi(n.join("="))}))},Ri=function(t){this.entries.length=0,Ei(this.entries,t)},Oi=function(t,e){if(t<e)throw TypeError("Not enough arguments")},Ai=En((function(t,e){di(this,{type:"URLSearchParamsIterator",iterator:ci(vi(t).entries),kind:e})}),"Iterator",(function(){var t=gi(this),e=t.kind,r=t.iterator.next(),n=r.value;return r.done||(r.value="keys"===e?n.key:"values"===e?n.value:[n.key,n.value]),r})),Ii=function(){Yn(this,Ii,"URLSearchParams");var t,e,r,n,i,a,o,s,u,l=arguments.length>0?arguments[0]:void 0,c=this,f=[];if(di(c,{type:"URLSearchParams",entries:f,updateURL:function(){},updateSearchParams:Ri}),void 0!==l)if(g(l))if("function"==typeof(t=ti(l)))for(r=(e=t.call(l)).next;!(n=r.call(e)).done;){if((o=(a=(i=ci(E(n.value))).next).call(i)).done||(s=a.call(i)).done||!a.call(i).done)throw TypeError("Expected sequence with length 2");f.push({key:o.value+"",value:s.value+""})}else for(u in l)b(l,u)&&f.push({key:u,value:l[u]+""});else Ei(f,"string"==typeof l?"?"===l.charAt(0)?l.slice(1):l:l+"")},Ti=Ii.prototype;!function(t,e,r){for(var n in e)et(t,n,e[n],r)}(Ti,{append:function(t,e){Oi(arguments.length,2);var r=vi(this);r.entries.push({key:t+"",value:e+""}),r.updateURL()},delete:function(t){Oi(arguments.length,1);for(var e=vi(this),r=e.entries,n=t+"",i=0;i<r.length;)r[i].key===n?r.splice(i,1):i++;e.updateURL()},get:function(t){Oi(arguments.length,1);for(var e=vi(this).entries,r=t+"",n=0;n<e.length;n++)if(e[n].key===r)return e[n].value;return null},getAll:function(t){Oi(arguments.length,1);for(var e=vi(this).entries,r=t+"",n=[],i=0;i<e.length;i++)e[i].key===r&&n.push(e[i].value);return n},has:function(t){Oi(arguments.length,1);for(var e=vi(this).entries,r=t+"",n=0;n<e.length;)if(e[n++].key===r)return!0;return!1},set:function(t,e){Oi(arguments.length,1);for(var r,n=vi(this),i=n.entries,a=!1,o=t+"",s=e+"",u=0;u<i.length;u++)(r=i[u]).key===o&&(a?i.splice(u--,1):(a=!0,r.value=s));a||i.push({key:o,value:s}),n.updateURL()},sort:function(){var t,e,r,n=vi(this),i=n.entries,a=i.slice();for(i.length=0,r=0;r<a.length;r++){for(t=a[r],e=0;e<r;e++)if(i[e].key>t.key){i.splice(e,0,t);break}e===r&&i.push(t)}n.updateURL()},forEach:function(t){for(var e,r=vi(this).entries,n=se(t,arguments.length>1?arguments[1]:void 0,3),i=0;i<r.length;)n((e=r[i++]).value,e.key,this)},keys:function(){return new Ai(this,"keys")},values:function(){return new Ai(this,"values")},entries:function(){return new Ai(this,"entries")}},{enumerable:!0}),et(Ti,pi,Ti.entries),et(Ti,"toString",(function(){for(var t,e=vi(this).entries,r=[],n=0;n<e.length;)t=e[n++],r.push(Ci(t.key)+"="+Ci(t.value));return r.join("&")}),{enumerable:!0}),Le(Ii,"URLSearchParams"),It({global:!0,forced:!Hn},{URLSearchParams:Ii}),Hn||"function"!=typeof fi||"function"!=typeof hi||It({global:!0,enumerable:!0,forced:!0},{fetch:function(t){var e,r,n,i=[t];return arguments.length>1&&(g(e=arguments[1])&&(r=e.body,"URLSearchParams"===rn(r)&&((n=e.headers?new hi(e.headers):new hi).has("content-type")||n.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"),e=Jt(e,{body:l(0,String(r)),headers:l(0,n)}))),i.push(e)),fi.apply(this,i)}});var Li,ji={URLSearchParams:Ii,getState:vi},ki=Kr.codeAt,Fi=n.URL,$i=ji.URLSearchParams,Ui=ji.getState,Ni=tt.set,Di=tt.getterFor("URL"),Bi=Math.floor,Mi=Math.pow,qi=/[A-Za-z]/,Gi=/[\d+-.A-Za-z]/,zi=/\d/,Vi=/^(0x|0X)/,Ki=/^[0-7]+$/,Hi=/^\d+$/,Yi=/^[\dA-Fa-f]+$/,Wi=/[\u0000\t\u000A\u000D #%/:?@[\\]]/,Xi=/[\u0000\t\u000A\u000D #/:?@[\\]]/,Ji=/^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g,Qi=/[\t\u000A\u000D]/g,Zi=function(t,e){var r,n,i;if("["==e.charAt(0)){if("]"!=e.charAt(e.length-1))return"Invalid host";if(!(r=ea(e.slice(1,-1))))return"Invalid host";t.host=r}else if(la(t)){if(e=function(t){var e,r,n=[],i=t.toLowerCase().replace(ni,".").split(".");for(e=0;e<i.length;e++)r=i[e],n.push(ri.test(r)?"xn--"+li(r):r);return n.join(".")}(e),Wi.test(e))return"Invalid host";if(null===(r=ta(e)))return"Invalid host";t.host=r}else{if(Xi.test(e))return"Invalid host";for(r="",n=ei(e),i=0;i<n.length;i++)r+=sa(n[i],na);t.host=r}},ta=function(t){var e,r,n,i,a,o,s,u=t.split(".");if(u.length&&""==u[u.length-1]&&u.pop(),(e=u.length)>4)return t;for(r=[],n=0;n<e;n++){if(""==(i=u[n]))return t;if(a=10,i.length>1&&"0"==i.charAt(0)&&(a=Vi.test(i)?16:8,i=i.slice(8==a?1:2)),""===i)o=0;else{if(!(10==a?Hi:8==a?Ki:Yi).test(i))return t;o=parseInt(i,a)}r.push(o)}for(n=0;n<e;n++)if(o=r[n],n==e-1){if(o>=Mi(256,5-e))return null}else if(o>255)return null;for(s=r.pop(),n=0;n<r.length;n++)s+=r[n]*Mi(256,3-n);return s},ea=function(t){var e,r,n,i,a,o,s,u=[0,0,0,0,0,0,0,0],l=0,c=null,f=0,h=function(){return t.charAt(f)};if(":"==h()){if(":"!=t.charAt(1))return;f+=2,c=++l}for(;h();){if(8==l)return;if(":"!=h()){for(e=r=0;r<4&&Yi.test(h());)e=16*e+parseInt(h(),16),f++,r++;if("."==h()){if(0==r)return;if(f-=r,l>6)return;for(n=0;h();){if(i=null,n>0){if(!("."==h()&&n<4))return;f++}if(!zi.test(h()))return;for(;zi.test(h());){if(a=parseInt(h(),10),null===i)i=a;else{if(0==i)return;i=10*i+a}if(i>255)return;f++}u[l]=256*u[l]+i,2!=++n&&4!=n||l++}if(4!=n)return;break}if(":"==h()){if(f++,!h())return}else if(h())return;u[l++]=e}else{if(null!==c)return;f++,c=++l}}if(null!==c)for(o=l-c,l=7;0!=l&&o>0;)s=u[l],u[l--]=u[c+o-1],u[c+--o]=s;else if(8!=l)return;return u},ra=function(t){var e,r,n,i;if("number"==typeof t){for(e=[],r=0;r<4;r++)e.unshift(t%256),t=Bi(t/256);return e.join(".")}if("object"==typeof t){for(e="",n=function(t){for(var e=null,r=1,n=null,i=0,a=0;a<8;a++)0!==t[a]?(i>r&&(e=n,r=i),n=null,i=0):(null===n&&(n=a),++i);return i>r&&(e=n,r=i),e}(t),r=0;r<8;r++)i&&0===t[r]||(i&&(i=!1),n===r?(e+=r?":":"::",i=!0):(e+=t[r].toString(16),r<7&&(e+=":")));return"["+e+"]"}return t},na={},ia=Sr({},na,{" ":1,'"':1,"<":1,">":1,"`":1}),aa=Sr({},ia,{"#":1,"?":1,"{":1,"}":1}),oa=Sr({},aa,{"/":1,":":1,";":1,"=":1,"@":1,"[":1,"\\":1,"]":1,"^":1,"|":1}),sa=function(t,e){var r=ki(t,0);return r>32&&r<127&&!b(e,t)?t:encodeURIComponent(t)},ua={ftp:21,file:null,http:80,https:443,ws:80,wss:443},la=function(t){return b(ua,t.scheme)},ca=function(t){return""!=t.username||""!=t.password},fa=function(t){return!t.host||t.cannotBeABaseURL||"file"==t.scheme},ha=function(t,e){var r;return 2==t.length&&qi.test(t.charAt(0))&&(":"==(r=t.charAt(1))||!e&&"|"==r)},pa=function(t){var e;return t.length>1&&ha(t.slice(0,2))&&(2==t.length||"/"===(e=t.charAt(2))||"\\"===e||"?"===e||"#"===e)},da=function(t){var e=t.path,r=e.length;!r||"file"==t.scheme&&1==r&&ha(e[0],!0)||e.pop()},va=function(t){return"."===t||"%2e"===t.toLowerCase()},ga={},ma={},ya={},ba={},_a={},wa={},Sa={},Pa={},xa={},Ca={},Ea={},Ra={},Oa={},Aa={},Ia={},Ta={},La={},ja={},ka={},Fa={},$a={},Ua=function(t,e,r,n){var i,a,o,s,u,l=r||ga,c=0,f="",h=!1,p=!1,d=!1;for(r||(t.scheme="",t.username="",t.password="",t.host=null,t.port=null,t.path=[],t.query=null,t.fragment=null,t.cannotBeABaseURL=!1,e=e.replace(Ji,"")),e=e.replace(Qi,""),i=ei(e);c<=i.length;){switch(a=i[c],l){case ga:if(!a||!qi.test(a)){if(r)return"Invalid scheme";l=ya;continue}f+=a.toLowerCase(),l=ma;break;case ma:if(a&&(Gi.test(a)||"+"==a||"-"==a||"."==a))f+=a.toLowerCase();else{if(":"!=a){if(r)return"Invalid scheme";f="",l=ya,c=0;continue}if(r&&(la(t)!=b(ua,f)||"file"==f&&(ca(t)||null!==t.port)||"file"==t.scheme&&!t.host))return;if(t.scheme=f,r)return void(la(t)&&ua[t.scheme]==t.port&&(t.port=null));f="","file"==t.scheme?l=Aa:la(t)&&n&&n.scheme==t.scheme?l=ba:la(t)?l=Pa:"/"==i[c+1]?(l=_a,c++):(t.cannotBeABaseURL=!0,t.path.push(""),l=ka)}break;case ya:if(!n||n.cannotBeABaseURL&&"#"!=a)return"Invalid scheme";if(n.cannotBeABaseURL&&"#"==a){t.scheme=n.scheme,t.path=n.path.slice(),t.query=n.query,t.fragment="",t.cannotBeABaseURL=!0,l=$a;break}l="file"==n.scheme?Aa:wa;continue;case ba:if("/"!=a||"/"!=i[c+1]){l=wa;continue}l=xa,c++;break;case _a:if("/"==a){l=Ca;break}l=ja;continue;case wa:if(t.scheme=n.scheme,a==Li)t.username=n.username,t.password=n.password,t.host=n.host,t.port=n.port,t.path=n.path.slice(),t.query=n.query;else if("/"==a||"\\"==a&&la(t))l=Sa;else if("?"==a)t.username=n.username,t.password=n.password,t.host=n.host,t.port=n.port,t.path=n.path.slice(),t.query="",l=Fa;else{if("#"!=a){t.username=n.username,t.password=n.password,t.host=n.host,t.port=n.port,t.path=n.path.slice(),t.path.pop(),l=ja;continue}t.username=n.username,t.password=n.password,t.host=n.host,t.port=n.port,t.path=n.path.slice(),t.query=n.query,t.fragment="",l=$a}break;case Sa:if(!la(t)||"/"!=a&&"\\"!=a){if("/"!=a){t.username=n.username,t.password=n.password,t.host=n.host,t.port=n.port,l=ja;continue}l=Ca}else l=xa;break;case Pa:if(l=xa,"/"!=a||"/"!=f.charAt(c+1))continue;c++;break;case xa:if("/"!=a&&"\\"!=a){l=Ca;continue}break;case Ca:if("@"==a){h&&(f="%40"+f),h=!0,o=ei(f);for(var v=0;v<o.length;v++){var g=o[v];if(":"!=g||d){var m=sa(g,oa);d?t.password+=m:t.username+=m}else d=!0}f=""}else if(a==Li||"/"==a||"?"==a||"#"==a||"\\"==a&&la(t)){if(h&&""==f)return"Invalid authority";c-=ei(f).length+1,f="",l=Ea}else f+=a;break;case Ea:case Ra:if(r&&"file"==t.scheme){l=Ta;continue}if(":"!=a||p){if(a==Li||"/"==a||"?"==a||"#"==a||"\\"==a&&la(t)){if(la(t)&&""==f)return"Invalid host";if(r&&""==f&&(ca(t)||null!==t.port))return;if(s=Zi(t,f))return s;if(f="",l=La,r)return;continue}"["==a?p=!0:"]"==a&&(p=!1),f+=a}else{if(""==f)return"Invalid host";if(s=Zi(t,f))return s;if(f="",l=Oa,r==Ra)return}break;case Oa:if(!zi.test(a)){if(a==Li||"/"==a||"?"==a||"#"==a||"\\"==a&&la(t)||r){if(""!=f){var y=parseInt(f,10);if(y>65535)return"Invalid port";t.port=la(t)&&y===ua[t.scheme]?null:y,f=""}if(r)return;l=La;continue}return"Invalid port"}f+=a;break;case Aa:if(t.scheme="file","/"==a||"\\"==a)l=Ia;else{if(!n||"file"!=n.scheme){l=ja;continue}if(a==Li)t.host=n.host,t.path=n.path.slice(),t.query=n.query;else if("?"==a)t.host=n.host,t.path=n.path.slice(),t.query="",l=Fa;else{if("#"!=a){pa(i.slice(c).join(""))||(t.host=n.host,t.path=n.path.slice(),da(t)),l=ja;continue}t.host=n.host,t.path=n.path.slice(),t.query=n.query,t.fragment="",l=$a}}break;case Ia:if("/"==a||"\\"==a){l=Ta;break}n&&"file"==n.scheme&&!pa(i.slice(c).join(""))&&(ha(n.path[0],!0)?t.path.push(n.path[0]):t.host=n.host),l=ja;continue;case Ta:if(a==Li||"/"==a||"\\"==a||"?"==a||"#"==a){if(!r&&ha(f))l=ja;else if(""==f){if(t.host="",r)return;l=La}else{if(s=Zi(t,f))return s;if("localhost"==t.host&&(t.host=""),r)return;f="",l=La}continue}f+=a;break;case La:if(la(t)){if(l=ja,"/"!=a&&"\\"!=a)continue}else if(r||"?"!=a)if(r||"#"!=a){if(a!=Li&&(l=ja,"/"!=a))continue}else t.fragment="",l=$a;else t.query="",l=Fa;break;case ja:if(a==Li||"/"==a||"\\"==a&&la(t)||!r&&("?"==a||"#"==a)){if(".."===(u=(u=f).toLowerCase())||"%2e."===u||".%2e"===u||"%2e%2e"===u?(da(t),"/"==a||"\\"==a&&la(t)||t.path.push("")):va(f)?"/"==a||"\\"==a&&la(t)||t.path.push(""):("file"==t.scheme&&!t.path.length&&ha(f)&&(t.host&&(t.host=""),f=f.charAt(0)+":"),t.path.push(f)),f="","file"==t.scheme&&(a==Li||"?"==a||"#"==a))for(;t.path.length>1&&""===t.path[0];)t.path.shift();"?"==a?(t.query="",l=Fa):"#"==a&&(t.fragment="",l=$a)}else f+=sa(a,aa);break;case ka:"?"==a?(t.query="",l=Fa):"#"==a?(t.fragment="",l=$a):a!=Li&&(t.path[0]+=sa(a,na));break;case Fa:r||"#"!=a?a!=Li&&("'"==a&&la(t)?t.query+="%27":t.query+="#"==a?"%23":sa(a,na)):(t.fragment="",l=$a);break;case $a:a!=Li&&(t.fragment+=sa(a,ia))}c++}},Na=function(t){var e,r,n=Yn(this,Na,"URL"),i=arguments.length>1?arguments[1]:void 0,o=String(t),s=Ni(n,{type:"URL"});if(void 0!==i)if(i instanceof Na)e=Di(i);else if(r=Ua(e={},String(i)))throw TypeError(r);if(r=Ua(s,o,null,e))throw TypeError(r);var u=s.searchParams=new $i,l=Ui(u);l.updateSearchParams(s.query),l.updateURL=function(){s.query=String(u)||null},a||(n.href=Ba.call(n),n.origin=Ma.call(n),n.protocol=qa.call(n),n.username=Ga.call(n),n.password=za.call(n),n.host=Va.call(n),n.hostname=Ka.call(n),n.port=Ha.call(n),n.pathname=Ya.call(n),n.search=Wa.call(n),n.searchParams=Xa.call(n),n.hash=Ja.call(n))},Da=Na.prototype,Ba=function(){var t=Di(this),e=t.scheme,r=t.username,n=t.password,i=t.host,a=t.port,o=t.path,s=t.query,u=t.fragment,l=e+":";return null!==i?(l+="//",ca(t)&&(l+=r+(n?":"+n:"")+"@"),l+=ra(i),null!==a&&(l+=":"+a)):"file"==e&&(l+="//"),l+=t.cannotBeABaseURL?o[0]:o.length?"/"+o.join("/"):"",null!==s&&(l+="?"+s),null!==u&&(l+="#"+u),l},Ma=function(){var t=Di(this),e=t.scheme,r=t.port;if("blob"==e)try{return new Na(e.path[0]).origin}catch(t){return"null"}return"file"!=e&&la(t)?e+"://"+ra(t.host)+(null!==r?":"+r:""):"null"},qa=function(){return Di(this).scheme+":"},Ga=function(){return Di(this).username},za=function(){return Di(this).password},Va=function(){var t=Di(this),e=t.host,r=t.port;return null===e?"":null===r?ra(e):ra(e)+":"+r},Ka=function(){var t=Di(this).host;return null===t?"":ra(t)},Ha=function(){var t=Di(this).port;return null===t?"":String(t)},Ya=function(){var t=Di(this),e=t.path;return t.cannotBeABaseURL?e[0]:e.length?"/"+e.join("/"):""},Wa=function(){var t=Di(this).query;return t?"?"+t:""},Xa=function(){return Di(this).searchParams},Ja=function(){var t=Di(this).fragment;return t?"#"+t:""},Qa=function(t,e){return{get:t,set:e,configurable:!0,enumerable:!0}};if(a&&Vt(Da,{href:Qa(Ba,(function(t){var e=Di(this),r=String(t),n=Ua(e,r);if(n)throw TypeError(n);Ui(e.searchParams).updateSearchParams(e.query)})),origin:Qa(Ma),protocol:Qa(qa,(function(t){var e=Di(this);Ua(e,String(t)+":",ga)})),username:Qa(Ga,(function(t){var e=Di(this),r=ei(String(t));if(!fa(e)){e.username="";for(var n=0;n<r.length;n++)e.username+=sa(r[n],oa)}})),password:Qa(za,(function(t){var e=Di(this),r=ei(String(t));if(!fa(e)){e.password="";for(var n=0;n<r.length;n++)e.password+=sa(r[n],oa)}})),host:Qa(Va,(function(t){var e=Di(this);e.cannotBeABaseURL||Ua(e,String(t),Ea)})),hostname:Qa(Ka,(function(t){var e=Di(this);e.cannotBeABaseURL||Ua(e,String(t),Ra)})),port:Qa(Ha,(function(t){var e=Di(this);fa(e)||(""==(t=String(t))?e.port=null:Ua(e,t,Oa))})),pathname:Qa(Ya,(function(t){var e=Di(this);e.cannotBeABaseURL||(e.path=[],Ua(e,t+"",La))})),search:Qa(Wa,(function(t){var e=Di(this);""==(t=String(t))?e.query=null:("?"==t.charAt(0)&&(t=t.slice(1)),e.query="",Ua(e,t,Fa)),Ui(e.searchParams).updateSearchParams(e.query)})),searchParams:Qa(Xa),hash:Qa(Ja,(function(t){var e=Di(this);""!=(t=String(t))?("#"==t.charAt(0)&&(t=t.slice(1)),e.fragment="",Ua(e,t,$a)):e.fragment=null}))}),et(Da,"toJSON",(function(){return Ba.call(this)}),{enumerable:!0}),et(Da,"toString",(function(){return Ba.call(this)}),{enumerable:!0}),Fi){var Za=Fi.createObjectURL,to=Fi.revokeObjectURL;Za&&et(Na,"createObjectURL",(function(t){return Za.apply(Fi,arguments)})),to&&et(Na,"revokeObjectURL",(function(t){return to.apply(Fi,arguments)}))}Le(Na,"URL"),It({global:!0,forced:!Hn,sham:!a},{URL:Na});var eo=[],ro=eo.sort,no=i((function(){eo.sort(void 0)})),io=i((function(){eo.sort(null)})),ao=pr("sort");It({target:"Array",proto:!0,forced:no||!io||!ao},{sort:function(t){return void 0===t?ro.call(ue(this)):ro.call(ue(this),oe(t))}});var oo=function(t,e,r){var n,i;return Rn&&"function"==typeof(n=e.constructor)&&n!==r&&g(i=n.prototype)&&i!==r.prototype&&Rn(t,i),t},so="[\t\n\v\f\r                　\u2028\u2029\ufeff]",uo=RegExp("^"+so+so+"*"),lo=RegExp(so+so+"*$"),co=function(t){return function(e){var r=String(d(e));return 1&t&&(r=r.replace(uo,"")),2&t&&(r=r.replace(lo,"")),r}},fo={start:co(1),end:co(2),trim:co(3)},ho=yt.f,po=C.f,vo=O.f,go=fo.trim,mo=n.Number,yo=mo.prototype,bo="Number"==f(Jt(yo)),_o=function(t){var e,r,n,i,a,o,s,u,l=m(t,!1);if("string"==typeof l&&l.length>2)if(43===(e=(l=go(l)).charCodeAt(0))||45===e){if(88===(r=l.charCodeAt(2))||120===r)return NaN}else if(48===e){switch(l.charCodeAt(1)){case 66:case 98:n=2,i=49;break;case 79:case 111:n=8,i=55;break;default:return+l}for(o=(a=l.slice(2)).length,s=0;s<o;s++)if((u=a.charCodeAt(s))<48||u>i)return NaN;return parseInt(a,n)}return+l};if(Ot("Number",!mo(" 0o1")||!mo("0b1")||mo("+0x1"))){for(var wo,So=function(t){var e=arguments.length<1?0:t,r=this;return r instanceof So&&(bo?i((function(){yo.valueOf.call(r)})):"Number"!=f(r))?oo(new mo(_o(e)),r,So):_o(e)},Po=a?ho(mo):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger,fromString,range".split(","),xo=0;Po.length>xo;xo++)b(mo,wo=Po[xo])&&!b(So,wo)&&vo(So,wo,po(mo,wo));So.prototype=yo,yo.constructor=So,et(n,"Number",So)}Mr("match",1,(function(t,e,r){return[function(e){var r=d(this),n=null==e?void 0:e[t];return void 0!==n?n.call(e,r):new RegExp(e)[t](String(r))},function(t){var n=r(e,t,this);if(n.done)return n.value;var i=E(t),a=String(this);if(!i.global)return Gr(i,a);var o=i.unicode;i.lastIndex=0;for(var s,u=[],l=0;null!==(s=Gr(i,a));){var c=String(s[0]);u[l]=c,""===c&&(i.lastIndex=Yr(a,lt(i.lastIndex),o)),l++}return 0===l?null:u}]}));var Co=Math.floor,Eo="".replace,Ro=/\$([$&'`]|\d{1,2}|<[^>]*>)/g,Oo=/\$([$&'`]|\d{1,2})/g,Ao=function(t,e,r,n,i,a){var o=r+t.length,s=n.length,u=Oo;return void 0!==i&&(i=ue(i),u=Ro),Eo.call(a,u,(function(a,u){var l;switch(u.charAt(0)){case"$":return"$";case"&":return t;case"`":return e.slice(0,r);case"'":return e.slice(o);case"<":l=i[u.slice(1,-1)];break;default:var c=+u;if(0===c)return a;if(c>s){var f=Co(c/10);return 0===f?a:f<=s?void 0===n[f-1]?u.charAt(1):n[f-1]+u.charAt(1):a}l=n[c-1]}return void 0===l?"":l}))},Io=Math.max,To=Math.min;Mr("replace",2,(function(t,e,r,n){var i=n.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE,a=n.REPLACE_KEEPS_$0,o=i?"$":"$0";return[function(r,n){var i=d(this),a=null==r?void 0:r[t];return void 0!==a?a.call(r,i,n):e.call(String(i),r,n)},function(t,n){if(!i&&a||"string"==typeof n&&-1===n.indexOf(o)){var s=r(e,t,this,n);if(s.done)return s.value}var u=E(t),l=String(this),c="function"==typeof n;c||(n=String(n));var f=u.global;if(f){var h=u.unicode;u.lastIndex=0}for(var p=[];;){var d=Gr(u,l);if(null===d)break;if(p.push(d),!f)break;""===String(d[0])&&(u.lastIndex=Yr(l,lt(u.lastIndex),h))}for(var v,g="",m=0,y=0;y<p.length;y++){d=p[y];for(var b=String(d[0]),_=Io(To(st(d.index),l.length),0),w=[],S=1;S<d.length;S++)w.push(void 0===(v=d[S])?v:String(v));var P=d.groups;if(c){var x=[b].concat(w,_,l);void 0!==P&&x.push(P);var C=String(n.apply(void 0,x))}else C=Ao(b,l,_,w,P,n);_>=m&&(g+=l.slice(m,_)+C,m=_+b.length)}return g+l.slice(m)}]})),(window.webpackJsonp=window.webpackJsonp||[]).push([[51],{1331:function(t,e,r){r.r(e);var n=r(4),i=r(0),a=r.n(i),o=r(14),s=(r(23),r(65)),u=r(45),l=r.n(u);function c(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function f(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?c(Object(r),!0).forEach((function(e){h(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function h(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}var p={components:{vueEasyPrint:s.a,barcode:l.a},metaInfo:{title:"Sales"},data:function(){return{cardElement:{},paymentProcessing:!1,isLoading:!0,serverParams:{sort:{field:"id",type:"desc"},page:1,perPage:10},selectedIds:[],search:"",totalRows:"",barcodeFormat:"CODE128",showDropdown:!1,EditPaiementMode:!1,Filter_Client:"",Filter_Ref:"",Filter_date:"",Filter_status:"pending",Filter_Payment:"paid",Filter_warehouse:"",customers:[],warehouses:[],sales:[],invoice_pos:{sale:{Ref:"",client_name:"",discount:"",taxe:"",tax_rate:"",shipping:"",GrandTotal:""},details:[],setting:{logo:"",CompanyName:"",CompanyAdress:"",email:"",CompanyPhone:""}},payments:[],payment:{},Sale_id:"",limit:"10",sale:{},email:{to:"",subject:"",message:"",client_name:"",Sale_Ref:""},emailPayment:{id:"",to:"",subject:"",message:"",client_name:"",Ref:""}}},mounted:function(){var t=this;this.$root.$on("bv::dropdown::show",(function(e){t.showDropdown=!0})),this.$root.$on("bv::dropdown::hide",(function(e){t.showDropdown=!1}))},computed:f(f({},Object(n.c)(["currentUserPermissions","currentUser"])),{},{columns:function(){return[{label:this.$t("Reference"),field:"Ref",tdClass:"text-left",thClass:"text-left"},{label:this.$t("Customer"),field:"client_name",tdClass:"text-left",thClass:"text-left"},{label:this.$t("warehouse"),field:"warehouse_name",tdClass:"text-left",thClass:"text-left"},{label:this.$t("Status"),field:"statut",html:!0,tdClass:"text-left",thClass:"text-left"},{label:this.$t("Total"),field:"GrandTotal",tdClass:"text-left",thClass:"text-left"},{label:this.$t("Paid"),field:"paid_amount",tdClass:"text-left",thClass:"text-left"},{label:this.$t("Due"),field:"due",tdClass:"text-left",thClass:"text-left"},{label:this.$t("PaymentStatus"),field:"payment_status",html:!0,tdClass:"text-left",thClass:"text-left"},{label:this.$t("Dispatcher"),field:"dispatcher",html:!0,tdClass:"text-right",thClass:"text-right",sortable:!1}]}}),methods:{print_it:function(){this.$refs.Show_invoice.print()},updateParams:function(t){this.serverParams=Object.assign({},this.serverParams,t)},onPageChange:function(t){var e=t.currentPage;this.serverParams.page!==e&&(this.updateParams({page:e}),this.Get_Sales(e))},onPerPageChange:function(t){var e=t.currentPerPage;this.limit!==e&&(this.limit=e,this.updateParams({page:1,perPage:e}),this.Get_Sales(1))},selectionChanged:function(t){var e=this,r=t.selectedRows;this.selectedIds=[],r.forEach((function(t,r){e.selectedIds.push(t.id)}))},onSortChange:function(t){var e="";e="client_name"==t[0].field?"client_id":"warehouse_name"==t[0].field?"warehouse_id":t[0].field,this.updateParams({sort:{type:t[0].type,field:e}}),this.Get_Sales(this.serverParams.page)},onSearch:function(t){this.search=t.searchTerm,this.Get_Sales(this.serverParams.page)},getValidationState:function(t){var e=t.dirty,r=t.validated,n=t.valid;return e||r?void 0===n?null:n:null},makeToast:function(t,e,r){this.$root.$bvToast.toast(e,{title:r,variant:t,solid:!0})},Reset_Filter:function(){this.search="",this.Filter_Client="",this.Filter_status="pending",this.Filter_Payment="paid",this.Filter_Ref="",this.Filter_date="",this.Filter_warehouse="",this.Get_Sales(this.serverParams.page)},formatNumber:function(t,e){var r=("string"==typeof t?t:t.toString()).split(".");if(e<=0)return r[0];var n=r[1]||"";if(n.length>e)return"".concat(r[0],".").concat(n.substr(0,e));for(;n.length<e;)n+="0";return"".concat(r[0],".").concat(n)},Sales_PDF:function(){var t=new o.default("p","pt");t.autoTable([{title:"Ref",dataKey:"Ref"},{title:"Client",dataKey:"client_name"},{title:"Status",dataKey:"statut"},{title:"Total",dataKey:"GrandTotal"},{title:"Paid",dataKey:"paid_amount"},{title:"Due",dataKey:"due"},{title:"Status Payment",dataKey:"payment_status"}],this.sales),t.text("Sale List",40,25),t.save("Sale_List.pdf")},Invoice_POS:function(t){var e=this;a.a.start(),a.a.set(.1),axios.get("Sales/Print_Invoice/"+t).then((function(t){e.invoice_pos=t.data,setTimeout((function(){a.a.done(),e.$bvModal.show("Show_invoice")}),500),setTimeout((function(){return e.print_it()}),1e3)})).catch((function(){setTimeout((function(){return a.a.done()}),500)}))},Invoice_PDF:function(t,e){a.a.start(),a.a.set(.1),axios({url:"Sale_PDF/"+e,method:"GET",responseType:"blob"}).then((function(e){var r=window.URL.createObjectURL(new Blob([e.data])),n=document.createElement("a");n.href=r,n.setAttribute("download","Sale-"+t.Ref+".pdf"),document.body.appendChild(n),n.click(),setTimeout((function(){return a.a.done()}),500)})).catch((function(){setTimeout((function(){return a.a.done()}),500)}))},setToStrings:function(){null===this.Filter_Client?this.Filter_Client="":null===this.Filter_warehouse?this.Filter_warehouse="":null===this.Filter_status?this.Filter_status="":null===this.Filter_Payment&&(this.Filter_Payment="")},Get_Sales:function(t){var e=this;a.a.start(),a.a.set(.1),this.setToStrings(),axios.get("sales?page="+t+"&Ref="+this.Filter_Ref+"&date="+this.Filter_date+"&client_id="+this.Filter_Client+"&statut="+this.Filter_status+"&warehouse_id="+this.Filter_warehouse+"&payment_statut="+this.Filter_Payment+"&SortField="+this.serverParams.sort.field+"&SortType="+this.serverParams.sort.type+"&search="+this.search+"&limit="+this.limit).then((function(t){e.sales=t.data.sales,e.customers=t.data.customers,e.warehouses=t.data.warehouses,e.totalRows=t.data.totalRows,a.a.done(),e.isLoading=!1})).catch((function(t){a.a.done(),setTimeout((function(){e.isLoading=!1}),500)}))},Number_Order_Payment:function(){var t=this;axios.get("payment/sale/Number/Order").then((function(e){var r=e.data;return t.payment.Ref=r}))},Show_Payments:function(t,e){a.a.start(),a.a.set(.1),this.reset_form_payment(),this.Sale_id=t,this.sale=e,this.Get_Payments(t)}},created:function(){var t=this;this.Get_Sales(1),Fire.$on("Create_Facture_sale",(function(){setTimeout((function(){t.Get_Sales(t.serverParams.page),a.a.done(),t.$bvModal.hide("Add_Payment")}),500)}))}},d=r(2),v=Object(d.a)(p,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"main-content"},[r("breadcumb",{attrs:{page:t.$t("ListSales"),folder:t.$t("Sales")}}),t._v(" "),t.isLoading?r("div",{staticClass:"loading_page spinner spinner-primary mr-3"}):r("div",[r("vue-good-table",{attrs:{mode:"remote",columns:t.columns,totalRows:t.totalRows,rows:t.sales,"search-options":{placeholder:t.$t("Search_this_table"),enabled:!0},"select-options":{enabled:!0,clearSelectionText:""},"pagination-options":{enabled:!0,mode:"records",nextLabel:"next",prevLabel:"prev"},styleClass:t.showDropdown?"tableOne table-hover vgt-table full-height":"tableOne table-hover vgt-table non-height"},on:{"on-page-change":t.onPageChange,"on-per-page-change":t.onPerPageChange,"on-sort-change":t.onSortChange,"on-search":t.onSearch,"on-selected-rows-change":t.selectionChanged},scopedSlots:t._u([{key:"table-row",fn:function(e){return["dispatcher"==e.column.field?r("span",[r("div",[t.currentUserPermissions&&t.currentUserPermissions.includes("Sales_edit")?r("router-link",{staticClass:"btn-sm btn btn-primary ripple btn-icon m-1",attrs:{to:{name:"dispatcher_sale",params:{id:e.row.id}}}},[r("span",{staticClass:"ul-btn__icon"},[r("i",{staticClass:"i-Edit"})]),t._v(" "),r("span",{staticClass:"ul-btn__text ml-1"},[t._v(t._s(t.$t("dispatcher")))])]):t._e()],1)]):"statut"==e.column.field?r("div",["completed"==e.row.statut?r("span",{staticClass:"badge badge-outline-success"},[t._v(t._s(t.$t("complete")))]):"pending"==e.row.statut?r("span",{staticClass:"badge badge-outline-info"},[t._v(t._s(t.$t("Pending")))]):r("span",{staticClass:"badge badge-outline-warning"},[t._v(t._s(t.$t("Ordered")))])]):"payment_status"==e.column.field?r("div",["paid"==e.row.payment_status?r("span",{staticClass:"badge badge-outline-success"},[t._v(t._s(t.$t("Paid")))]):"partial"==e.row.payment_status?r("span",{staticClass:"badge badge-outline-primary"},[t._v(t._s(t.$t("partial")))]):r("span",{staticClass:"badge badge-outline-warning"},[t._v(t._s(t.$t("Unpaid")))])]):t._e()]}}])},[r("div",{staticClass:"mt-2 mb-3",attrs:{slot:"table-actions"},slot:"table-actions"},[r("b-button",{directives:[{name:"b-toggle",rawName:"v-b-toggle.sidebar-right",modifiers:{"sidebar-right":!0}}],attrs:{variant:"outline-info ripple m-1",size:"sm"}},[r("i",{staticClass:"i-Filter-2"}),t._v("\n          "+t._s(t.$t("Filter"))+"\n        ")]),t._v(" "),r("b-button",{attrs:{size:"sm",variant:"outline-success ripple m-1"},on:{click:function(e){return t.Sales_PDF()}}},[r("i",{staticClass:"i-File-Copy"}),t._v(" PDF\n        ")]),t._v(" "),r("b-button",{attrs:{size:"sm",variant:"outline-danger ripple m-1"},on:{click:function(e){return t.Sales_Excel()}}},[r("i",{staticClass:"i-File-Excel"}),t._v(" EXCEL\n        ")])],1)])],1),t._v(" "),r("b-sidebar",{attrs:{id:"sidebar-right",title:t.$t("Filter"),"bg-variant":"white",right:"",shadow:""}},[r("div",{staticClass:"px-3 py-2"},[r("b-row",[r("b-col",{attrs:{md:"12"}},[r("b-form-group",{attrs:{label:t.$t("date")}},[r("b-form-input",{attrs:{type:"date"},model:{value:t.Filter_date,callback:function(e){t.Filter_date=e},expression:"Filter_date"}})],1)],1),t._v(" "),r("b-col",{attrs:{md:"12"}},[r("b-form-group",{attrs:{label:t.$t("Reference")}},[r("b-form-input",{attrs:{label:"Reference",placeholder:t.$t("Reference")},model:{value:t.Filter_Ref,callback:function(e){t.Filter_Ref=e},expression:"Filter_Ref"}})],1)],1),t._v(" "),r("b-col",{attrs:{md:"12"}},[r("b-form-group",{attrs:{label:t.$t("Customer")}},[r("v-select",{attrs:{reduce:function(t){return t.value},placeholder:t.$t("Choose_Customer"),options:t.customers.map((function(t){return{label:t.name,value:t.id}}))},model:{value:t.Filter_Client,callback:function(e){t.Filter_Client=e},expression:"Filter_Client"}})],1)],1),t._v(" "),r("b-col",{attrs:{md:"12"}},[r("b-form-group",{attrs:{label:t.$t("warehouse")}},[r("v-select",{attrs:{reduce:function(t){return t.value},placeholder:t.$t("Choose_Warehouse"),options:t.warehouses.map((function(t){return{label:t.name,value:t.id}}))},model:{value:t.Filter_warehouse,callback:function(e){t.Filter_warehouse=e},expression:"Filter_warehouse"}})],1)],1),t._v(" "),r("b-col",{attrs:{md:"6",sm:"12"}},[r("b-button",{attrs:{variant:"primary btn-block ripple m-1",size:"sm"},on:{click:function(e){return t.Get_Sales(t.serverParams.page)}}},[r("i",{staticClass:"i-Filter-2"}),t._v("\n            "+t._s(t.$t("Filter"))+"\n          ")])],1),t._v(" "),r("b-col",{attrs:{md:"6",sm:"12"}},[r("b-button",{attrs:{variant:"danger ripple btn-block m-1",size:"sm"},on:{click:function(e){return t.Reset_Filter()}}},[r("i",{staticClass:"i-Power-2"}),t._v("\n            "+t._s(t.$t("Reset"))+"\n          ")])],1)],1)],1)]),t._v(" "),r("b-modal",{attrs:{"hide-footer":"",size:"lg",id:"Show_payment",title:t.$t("ShowPayment")}},[r("b-row",[r("b-col",{staticClass:"mt-3",attrs:{lg:"12",md:"12",sm:"12"}},[r("div",{staticClass:"table-responsive"},[r("table",{staticClass:"table table-hover table-bordered table-md"},[r("thead",[r("tr",[r("th",{attrs:{scope:"col"}},[t._v(t._s(t.$t("date")))]),t._v(" "),r("th",{attrs:{scope:"col"}},[t._v(t._s(t.$t("Reference")))]),t._v(" "),r("th",{attrs:{scope:"col"}},[t._v(t._s(t.$t("Amount")))]),t._v(" "),r("th",{attrs:{scope:"col"}},[t._v(t._s(t.$t("PayeBy")))])])]),t._v(" "),r("tbody",[t.payments.length<=0?r("tr",[r("td",{attrs:{colspan:"5"}},[t._v(t._s(t.$t("NodataAvailable")))])]):t._e(),t._v(" "),t._l(t.payments,(function(e){return r("tr",[r("td",[t._v(t._s(e.date))]),t._v(" "),r("td",[t._v(t._s(e.Ref))]),t._v(" "),r("td",[t._v(t._s(t.formatNumber(e.montant,2))+" "+t._s(t.currentUser.currency))]),t._v(" "),r("td",[t._v(t._s(e.Reglement))])])}))],2)])])])],1)],1),t._v(" "),r("b-modal",{attrs:{"hide-footer":"",size:"md",scrollable:"",id:"Show_invoice",title:t.$t("Invoice_POS")}},[r("vue-easy-print",{ref:"Show_invoice",attrs:{"table-show":""}},[r("div",{attrs:{id:"invoice-POS"}},[r("h6",{staticClass:"text-right"},[t._v(t._s(t.$t("date"))+" : "+t._s(t.invoice_pos.sale.date))]),t._v(" "),r("center",{attrs:{id:"top"}},[r("div",{staticClass:"logo"},[r("img",{attrs:{src:"/images/"+t.invoice_pos.setting.logo}})]),t._v(" "),r("div",{staticClass:"info"},[r("h3",[t._v(t._s(t.invoice_pos.setting.CompanyName))])])]),t._v(" "),r("div",{staticClass:"info"},[r("h6",[t._v(t._s(t.$t("Adress"))+" : "+t._s(t.invoice_pos.setting.CompanyAdress))]),t._v(" "),r("h6",[t._v(t._s(t.$t("Email"))+" : "+t._s(t.invoice_pos.setting.email))]),t._v(" "),r("h6",[t._v(t._s(t.$t("Phone"))+" : "+t._s(t.invoice_pos.setting.CompanyPhone))]),t._v(" "),r("h6",[t._v(t._s(t.$t("Customer"))+" : "+t._s(t.invoice_pos.sale.client_name))])]),t._v(" "),r("table",{staticClass:"mt-3 table-md"},[r("thead",[r("tr",[r("th",{attrs:{scope:"col"}},[t._v(t._s(t.$t("ProductName")))]),t._v(" "),r("th",{attrs:{scope:"col"}},[t._v(t._s(t.$t("Qty")))]),t._v(" "),r("th",{attrs:{scope:"col"}},[t._v(t._s(t.$t("Total")))])])]),t._v(" "),r("tbody",[t._l(t.invoice_pos.details,(function(e){return r("tr",[r("td",[t._v(t._s(e.name))]),t._v(" "),r("td",[t._v(t._s(t.formatNumber(e.quantity,2))+" "+t._s(e.unit_sale))]),t._v(" "),r("td",[t._v(t._s(t.formatNumber(e.total,2))+" "+t._s(t.invoice_pos.symbol))])])})),t._v(" "),r("tr",[r("th"),t._v(" "),r("th",[t._v(t._s(t.$t("Tax")))]),t._v(" "),r("td",[t._v(t._s(t.formatNumber(t.invoice_pos.sale.taxe,2))+" "+t._s(t.invoice_pos.symbol)+" ("+t._s(t.formatNumber(t.invoice_pos.sale.tax_rate,2))+" %)")])]),t._v(" "),r("tr",[r("th"),t._v(" "),r("th",[t._v(t._s(t.$t("Discount")))]),t._v(" "),r("td",[t._v(t._s(t.formatNumber(t.invoice_pos.sale.discount,2))+" "+t._s(t.invoice_pos.symbol))])]),t._v(" "),r("tr",[r("th"),t._v(" "),r("th",[t._v(t._s(t.$t("Shipping")))]),t._v(" "),r("td",[t._v(t._s(t.formatNumber(t.invoice_pos.sale.shipping,2))+" "+t._s(t.invoice_pos.symbol))])])],2)]),t._v(" "),r("table",{staticClass:"mt-2",attrs:{id:"total"}},[r("tbody",[r("tr",[r("th",{staticClass:"p-1 w-75"},[t._v(t._s(t.$t("SubTotal")))]),t._v(" "),r("th",{staticClass:"p-1 w-25"},[t._v(t._s(t.formatNumber(t.invoice_pos.sale.GrandTotal,2))+" "+t._s(t.invoice_pos.symbol))])])])]),t._v(" "),r("div",{attrs:{id:"legalcopy"}},[r("p",{staticClass:"legal"},[r("strong",[t._v(t._s(t.$t("Thank_you_for_your_business")))])]),t._v(" "),r("div",{attrs:{id:"bar"}},[r("barcode",{staticClass:"barcode",attrs:{format:t.barcodeFormat,value:t.invoice_pos.sale.Ref,textmargin:"0",fontoptions:"bold",height:"25"}})],1)])],1)]),t._v(" "),r("button",{staticClass:"btn btn-outline-primary",on:{click:function(e){return t.print_it()}}},[r("i",{staticClass:"i-Billing"}),t._v("\n      "+t._s(t.$t("print"))+"\n    ")])],1)],1)}),[],!1,null,null,null);e.default=v.exports},65:function(t,e,r){var n={name:"vue-easy-print",components:{},props:{spaceRow:{type:Boolean,default:!1},tableData:{type:Object,default:function(){}},tableShow:{type:Boolean,default:!1},buttonShow:{type:Boolean,default:!1},buttonClass:{type:String,default:"el-button el-button--default"},onePageRow:{type:Number,default:5},beforeCopy:Function,beforePrint:Function},data:function(){return{}},mounted:function(){this.init()},methods:{init:function(){var t=this,e=document.getElementById("easyPrintIframe");e?this.getStyle():((e=document.createElement("iframe")).id="easyPrintIframe",e.style.position="fixed",e.style.width="0",e.style.height="0",e.style.top="-100px",window.location.hostname!==document.domain&&navigator.userAgent.match(/msie/i)&&(e.src='javascript:document.write("<head><script>document.domain=\\"'+document.domain+'\\";<\/script></head><body></body>")'),e.onload=function(){t.getStyle()},document.body.appendChild(e))},print:function(){"function"==typeof this.beforeCopy&&this.beforeCopy();var t=document.getElementById("easyPrintIframe");t.contentDocument.body.innerHTML=this.$refs.template.innerHTML,"function"==typeof this.beforePrint&&this.beforePrint(),this.$nextTick((function(){setTimeout((function(){t.contentWindow.print()}),100)}))},getStyle:function(){for(var t=document.getElementById("easyPrintIframe"),e="",r=document.querySelectorAll("style"),n=0;n<r.length;n++)e+=r[n].outerHTML;t.contentDocument.head.innerHTML=e;for(var i=document.querySelectorAll("link"),a=0;a<i.length;a++){var o=document.createElement("link");o.setAttribute("rel","stylesheet"),i[a].type?o.setAttribute("type",i[a].type):o.setAttribute("type","text/css"),o.setAttribute("href",i[a].href),o.setAttribute("media","all"),t.contentDocument.head.appendChild(o)}},getChineseNumber:function(t){var e,r,n,i,a,o,s,u,l,c,f,h,p,d;if(void 0===t)return"";if(""==(t=t.toString()))return"";if(null!=t.match(/[^,.\d]/))return"";if(null==t.match(/^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/))return"";if(t=(t=t.replace(/,/g,"")).replace(/^0+/,""),Number(t)>99999999999.99)return alert("您输入的金额太大，请重新输入!"),"";if((i=t.split(".")).length>1?(e=i[0],r=(r=i[1]).substr(0,2)):(e=i[0],r=""),a=new Array("零","壹","贰","叁","肆","伍","陆","柒","捌","玖"),o=new Array("","拾","佰","仟"),s=new Array("","万","亿"),u=new Array("角","分"),n="",Number(e)>0){for(l=0,c=0;c<e.length;c++)p=(f=e.length-c-1)/4,d=f%4,"0"==(h=e.substr(c,1))?l++:(l>0&&(n+=a[0]),l=0,n+=a[Number(h)]+o[d]),0==d&&l<4&&(n+=s[p]);n+="元"}if(""!=r)for(c=0;c<r.length;c++)"0"!=(h=r.substr(c,1))&&(n+=a[Number(h)]+u[c]);return""==n&&(n="零元"),""==r&&(n+="整"),n=""+n}}},i=r(2),a=Object(i.a)(n,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",[r("div",{directives:[{name:"show",rawName:"v-show",value:t.tableShow,expression:"tableShow"}],ref:"template"},[t._t("default",[r("span",[t._v("编写你自己的打印区域组件，然后slot插入到vue-easy-print")])],{getChineseNumber:t.getChineseNumber})],2),t._v(" "),t.buttonShow?r("button",{class:t.buttonClass,attrs:{type:"button"},on:{click:t.print}},[r("span",[t._v("开始打印")])]):t._e()])}),[],!1,null,null,null).exports;e.a=a}}])}();
>>>>>>> f11b8c326380b962de568282db4cbb62e4ac9c9f
