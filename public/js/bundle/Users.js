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

var isPure = false;

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

var isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
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

var anObject = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
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

// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
var f = descriptors ? $defineProperty : function defineProperty(O, P, Attributes) {
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

var shared = createCommonjsModule(function (module) {
(module.exports = function (key, value) {
  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.10.2',
  mode:  'global',
  copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
});
});

var hasOwnProperty = {}.hasOwnProperty;

var has = function (it, key) {
  return hasOwnProperty.call(it, key);
};

var id = 0;
var postfix = Math.random();

var uid = function (key) {
  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
};

var toString = {}.toString;

var classofRaw = function (it) {
  return toString.call(it).slice(8, -1);
};

var engineIsNode = classofRaw(global_1.process) == 'process';

var path = global_1;

var aFunction = function (variable) {
  return typeof variable == 'function' ? variable : undefined;
};

var getBuiltIn = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace])
    : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
};

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

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

var toStringTagSupport = String(test) === '[object z]';

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

var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
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
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$1)) == 'string' ? tag
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

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
var f$1 = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;

var objectPropertyIsEnumerable = {
	f: f$1
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

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
var f$2 = descriptors ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPrimitive(P, true);
  if (ie8DomDefine) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
};

var objectGetOwnPropertyDescriptor = {
	f: f$2
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

var nativePromiseConstructor = global_1.Promise;

var redefineAll = function (target, src, options) {
  for (var key in src) redefine(target, key, src[key], options);
  return target;
};

var defineProperty = objectDefineProperty.f;



var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');

var setToStringTag = function (it, TAG, STATIC) {
  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG$2)) {
    defineProperty(it, TO_STRING_TAG$2, { configurable: true, value: TAG });
  }
};

var SPECIES = wellKnownSymbol('species');

var setSpecies = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
  var defineProperty = objectDefineProperty.f;

  if (descriptors && Constructor && !Constructor[SPECIES]) {
    defineProperty(Constructor, SPECIES, {
      configurable: true,
      get: function () { return this; }
    });
  }
};

var aFunction$1 = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  } return it;
};

var anInstance = function (it, Constructor, name) {
  if (!(it instanceof Constructor)) {
    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
  } return it;
};

var iterators = {};

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
var isArrayIteratorMethod = function (it) {
  return it !== undefined && (iterators.Array === it || ArrayPrototype[ITERATOR] === it);
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

var ITERATOR$1 = wellKnownSymbol('iterator');

var getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR$1]
    || it['@@iterator']
    || iterators[classof(it)];
};

var iteratorClose = function (iterator) {
  var returnMethod = iterator['return'];
  if (returnMethod !== undefined) {
    return anObject(returnMethod.call(iterator)).value;
  }
};

var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

var iterate = function (iterable, unboundFunction, options) {
  var that = options && options.that;
  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
  var INTERRUPTED = !!(options && options.INTERRUPTED);
  var fn = functionBindContext(unboundFunction, that, 1 + AS_ENTRIES + INTERRUPTED);
  var iterator, iterFn, index, length, result, next, step;

  var stop = function (condition) {
    if (iterator) iteratorClose(iterator);
    return new Result(true, condition);
  };

  var callFn = function (value) {
    if (AS_ENTRIES) {
      anObject(value);
      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
    } return INTERRUPTED ? fn(value, stop) : fn(value);
  };

  if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = toLength(iterable.length); length > index; index++) {
        result = callFn(iterable[index]);
        if (result && result instanceof Result) return result;
      } return new Result(false);
    }
    iterator = iterFn.call(iterable);
  }

  next = iterator.next;
  while (!(step = next.call(iterator)).done) {
    try {
      result = callFn(step.value);
    } catch (error) {
      iteratorClose(iterator);
      throw error;
    }
    if (typeof result == 'object' && result && result instanceof Result) return result;
  } return new Result(false);
};

var ITERATOR$2 = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR$2] = function () {
    return this;
  };
  // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR$2] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};

var SPECIES$1 = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.es/ecma262/#sec-speciesconstructor
var speciesConstructor = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES$1]) == undefined ? defaultConstructor : aFunction$1(S);
};

var html = getBuiltIn('document', 'documentElement');

var engineIsIos = /(?:iphone|ipod|ipad).*applewebkit/i.test(engineUserAgent);

var location = global_1.location;
var set$1 = global_1.setImmediate;
var clear = global_1.clearImmediate;
var process$1 = global_1.process;
var MessageChannel = global_1.MessageChannel;
var Dispatch = global_1.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;

var run = function (id) {
  // eslint-disable-next-line no-prototype-builtins -- safe
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};

var runner = function (id) {
  return function () {
    run(id);
  };
};

var listener = function (event) {
  run(event.data);
};

var post = function (id) {
  // old engines have not location.origin
  global_1.postMessage(id + '', location.protocol + '//' + location.host);
};

// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!set$1 || !clear) {
  set$1 = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func -- spec requirement
      (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
    };
    defer(counter);
    return counter;
  };
  clear = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (engineIsNode) {
    defer = function (id) {
      process$1.nextTick(runner(id));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(runner(id));
    };
  // Browsers with MessageChannel, includes WebWorkers
  // except iOS - https://github.com/zloirock/core-js/issues/624
  } else if (MessageChannel && !engineIsIos) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = functionBindContext(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (
    global_1.addEventListener &&
    typeof postMessage == 'function' &&
    !global_1.importScripts &&
    location && location.protocol !== 'file:' &&
    !fails(post)
  ) {
    defer = post;
    global_1.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in documentCreateElement('script')) {
    defer = function (id) {
      html.appendChild(documentCreateElement('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(runner(id), 0);
    };
  }
}

var task = {
  set: set$1,
  clear: clear
};

var engineIsWebosWebkit = /web0s(?!.*chrome)/i.test(engineUserAgent);

var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;
var macrotask = task.set;




var MutationObserver = global_1.MutationObserver || global_1.WebKitMutationObserver;
var document$2 = global_1.document;
var process$2 = global_1.process;
var Promise$1 = global_1.Promise;
// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
var queueMicrotaskDescriptor = getOwnPropertyDescriptor$2(global_1, 'queueMicrotask');
var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

var flush, head, last, notify, toggle, node, promise, then;

// modern engines have queueMicrotask method
if (!queueMicrotask) {
  flush = function () {
    var parent, fn;
    if (engineIsNode && (parent = process$2.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (error) {
        if (head) notify();
        else last = undefined;
        throw error;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
  // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
  if (!engineIsIos && !engineIsNode && !engineIsWebosWebkit && MutationObserver && document$2) {
    toggle = true;
    node = document$2.createTextNode('');
    new MutationObserver(flush).observe(node, { characterData: true });
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise$1 && Promise$1.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    promise = Promise$1.resolve(undefined);
    then = promise.then;
    notify = function () {
      then.call(promise, flush);
    };
  // Node.js without promises
  } else if (engineIsNode) {
    notify = function () {
      process$2.nextTick(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global_1, flush);
    };
  }
}

var microtask = queueMicrotask || function (fn) {
  var task = { fn: fn, next: undefined };
  if (last) last.next = task;
  if (!head) {
    head = task;
    notify();
  } last = task;
};

var PromiseCapability = function (C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction$1(resolve);
  this.reject = aFunction$1(reject);
};

// 25.4.1.5 NewPromiseCapability(C)
var f$5 = function (C) {
  return new PromiseCapability(C);
};

var newPromiseCapability = {
	f: f$5
};

var promiseResolve = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

var hostReportErrors = function (a, b) {
  var console = global_1.console;
  if (console && console.error) {
    arguments.length === 1 ? console.error(a) : console.error(a, b);
  }
};

var perform = function (exec) {
  try {
    return { error: false, value: exec() };
  } catch (error) {
    return { error: true, value: error };
  }
};

var task$1 = task.set;











var SPECIES$2 = wellKnownSymbol('species');
var PROMISE = 'Promise';
var getInternalState = internalState.get;
var setInternalState = internalState.set;
var getInternalPromiseState = internalState.getterFor(PROMISE);
var PromiseConstructor = nativePromiseConstructor;
var TypeError$1 = global_1.TypeError;
var document$3 = global_1.document;
var process$3 = global_1.process;
var $fetch = getBuiltIn('fetch');
var newPromiseCapability$1 = newPromiseCapability.f;
var newGenericPromiseCapability = newPromiseCapability$1;
var DISPATCH_EVENT = !!(document$3 && document$3.createEvent && global_1.dispatchEvent);
var NATIVE_REJECTION_EVENT = typeof PromiseRejectionEvent == 'function';
var UNHANDLED_REJECTION = 'unhandledrejection';
var REJECTION_HANDLED = 'rejectionhandled';
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;
var HANDLED = 1;
var UNHANDLED = 2;
var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

var FORCED = isForced_1(PROMISE, function () {
  var GLOBAL_CORE_JS_PROMISE = inspectSource(PromiseConstructor) !== String(PromiseConstructor);
  if (!GLOBAL_CORE_JS_PROMISE) {
    // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
    // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
    // We can't detect it synchronously, so just check versions
    if (engineV8Version === 66) return true;
    // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    if (!engineIsNode && !NATIVE_REJECTION_EVENT) return true;
  }
  // We can't use @@species feature detection in V8 since it causes
  // deoptimization and performance degradation
  // https://github.com/zloirock/core-js/issues/679
  if (engineV8Version >= 51 && /native code/.test(PromiseConstructor)) return false;
  // Detect correctness of subclassing with @@species support
  var promise = PromiseConstructor.resolve(1);
  var FakePromise = function (exec) {
    exec(function () { /* empty */ }, function () { /* empty */ });
  };
  var constructor = promise.constructor = {};
  constructor[SPECIES$2] = FakePromise;
  return !(promise.then(function () { /* empty */ }) instanceof FakePromise);
});

var INCORRECT_ITERATION = FORCED || !checkCorrectnessOfIteration(function (iterable) {
  PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
});

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};

var notify$1 = function (state, isReject) {
  if (state.notified) return;
  state.notified = true;
  var chain = state.reactions;
  microtask(function () {
    var value = state.value;
    var ok = state.state == FULFILLED;
    var index = 0;
    // variable length - can't use forEach
    while (chain.length > index) {
      var reaction = chain[index++];
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (state.rejection === UNHANDLED) onHandleUnhandled(state);
            state.rejection = HANDLED;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // can throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError$1('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (error) {
        if (domain && !exited) domain.exit();
        reject(error);
      }
    }
    state.reactions = [];
    state.notified = false;
    if (isReject && !state.rejection) onUnhandled(state);
  });
};

var dispatchEvent = function (name, promise, reason) {
  var event, handler;
  if (DISPATCH_EVENT) {
    event = document$3.createEvent('Event');
    event.promise = promise;
    event.reason = reason;
    event.initEvent(name, false, true);
    global_1.dispatchEvent(event);
  } else event = { promise: promise, reason: reason };
  if (!NATIVE_REJECTION_EVENT && (handler = global_1['on' + name])) handler(event);
  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
};

var onUnhandled = function (state) {
  task$1.call(global_1, function () {
    var promise = state.facade;
    var value = state.value;
    var IS_UNHANDLED = isUnhandled(state);
    var result;
    if (IS_UNHANDLED) {
      result = perform(function () {
        if (engineIsNode) {
          process$3.emit('unhandledRejection', value, promise);
        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      state.rejection = engineIsNode || isUnhandled(state) ? UNHANDLED : HANDLED;
      if (result.error) throw result.value;
    }
  });
};

var isUnhandled = function (state) {
  return state.rejection !== HANDLED && !state.parent;
};

var onHandleUnhandled = function (state) {
  task$1.call(global_1, function () {
    var promise = state.facade;
    if (engineIsNode) {
      process$3.emit('rejectionHandled', promise);
    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
  });
};

var bind = function (fn, state, unwrap) {
  return function (value) {
    fn(state, value, unwrap);
  };
};

var internalReject = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  state.value = value;
  state.state = REJECTED;
  notify$1(state, true);
};

var internalResolve = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  try {
    if (state.facade === value) throw TypeError$1("Promise can't be resolved itself");
    var then = isThenable(value);
    if (then) {
      microtask(function () {
        var wrapper = { done: false };
        try {
          then.call(value,
            bind(internalResolve, wrapper, state),
            bind(internalReject, wrapper, state)
          );
        } catch (error) {
          internalReject(wrapper, error, state);
        }
      });
    } else {
      state.value = value;
      state.state = FULFILLED;
      notify$1(state, false);
    }
  } catch (error) {
    internalReject({ done: false }, error, state);
  }
};

// constructor polyfill
if (FORCED) {
  // 25.4.3.1 Promise(executor)
  PromiseConstructor = function Promise(executor) {
    anInstance(this, PromiseConstructor, PROMISE);
    aFunction$1(executor);
    Internal.call(this);
    var state = getInternalState(this);
    try {
      executor(bind(internalResolve, state), bind(internalReject, state));
    } catch (error) {
      internalReject(state, error);
    }
  };
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  Internal = function Promise(executor) {
    setInternalState(this, {
      type: PROMISE,
      done: false,
      notified: false,
      parent: false,
      reactions: [],
      rejection: false,
      state: PENDING,
      value: undefined
    });
  };
  Internal.prototype = redefineAll(PromiseConstructor.prototype, {
    // `Promise.prototype.then` method
    // https://tc39.es/ecma262/#sec-promise.prototype.then
    then: function then(onFulfilled, onRejected) {
      var state = getInternalPromiseState(this);
      var reaction = newPromiseCapability$1(speciesConstructor(this, PromiseConstructor));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = engineIsNode ? process$3.domain : undefined;
      state.parent = true;
      state.reactions.push(reaction);
      if (state.state != PENDING) notify$1(state, false);
      return reaction.promise;
    },
    // `Promise.prototype.catch` method
    // https://tc39.es/ecma262/#sec-promise.prototype.catch
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    var state = getInternalState(promise);
    this.promise = promise;
    this.resolve = bind(internalResolve, state);
    this.reject = bind(internalReject, state);
  };
  newPromiseCapability.f = newPromiseCapability$1 = function (C) {
    return C === PromiseConstructor || C === PromiseWrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };

  if ( typeof nativePromiseConstructor == 'function') {
    nativeThen = nativePromiseConstructor.prototype.then;

    // wrap native Promise#then for native async functions
    redefine(nativePromiseConstructor.prototype, 'then', function then(onFulfilled, onRejected) {
      var that = this;
      return new PromiseConstructor(function (resolve, reject) {
        nativeThen.call(that, resolve, reject);
      }).then(onFulfilled, onRejected);
    // https://github.com/zloirock/core-js/issues/640
    }, { unsafe: true });

    // wrap fetch result
    if (typeof $fetch == 'function') _export({ global: true, enumerable: true, forced: true }, {
      // eslint-disable-next-line no-unused-vars -- required for `.length`
      fetch: function fetch(input /* , init */) {
        return promiseResolve(PromiseConstructor, $fetch.apply(global_1, arguments));
      }
    });
  }
}

_export({ global: true, wrap: true, forced: FORCED }, {
  Promise: PromiseConstructor
});

setToStringTag(PromiseConstructor, PROMISE, false);
setSpecies(PROMISE);

PromiseWrapper = getBuiltIn(PROMISE);

// statics
_export({ target: PROMISE, stat: true, forced: FORCED }, {
  // `Promise.reject` method
  // https://tc39.es/ecma262/#sec-promise.reject
  reject: function reject(r) {
    var capability = newPromiseCapability$1(this);
    capability.reject.call(undefined, r);
    return capability.promise;
  }
});

_export({ target: PROMISE, stat: true, forced:  FORCED }, {
  // `Promise.resolve` method
  // https://tc39.es/ecma262/#sec-promise.resolve
  resolve: function resolve(x) {
    return promiseResolve( this, x);
  }
});

_export({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION }, {
  // `Promise.all` method
  // https://tc39.es/ecma262/#sec-promise.all
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability$1(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aFunction$1(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        $promiseResolve.call(C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  },
  // `Promise.race` method
  // https://tc39.es/ecma262/#sec-promise.race
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability$1(C);
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aFunction$1(C.resolve);
      iterate(iterable, function (promise) {
        $promiseResolve.call(C, promise).then(capability.resolve, reject);
      });
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});

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
var f$6 = function getOwnPropertyNames(it) {
  return windowNames && toString$1.call(it) == '[object Window]'
    ? getWindowNames(it)
    : $getOwnPropertyNames(toIndexedObject(it));
};

var objectGetOwnPropertyNamesExternal = {
	f: f$6
};

var f$7 = wellKnownSymbol;

var wellKnownSymbolWrapped = {
	f: f$7
};

var defineProperty$1 = objectDefineProperty.f;

var defineWellKnownSymbol = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {});
  if (!has(Symbol, NAME)) defineProperty$1(Symbol, NAME, {
    value: wellKnownSymbolWrapped.f(NAME)
  });
};

var SPECIES$3 = wellKnownSymbol('species');

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
var arraySpeciesCreate = function (originalArray, length) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES$3];
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
var setInternalState$1 = internalState.set;
var getInternalState$1 = internalState.getterFor(SYMBOL);
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
  setInternalState$1(symbol, {
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
    return getInternalState$1(this).tag;
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
        return getInternalState$1(this).description;
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

var SPECIES$4 = wellKnownSymbol('species');

var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return engineV8Version >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES$4] = function () {
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
var FORCED$1 = !descriptors || FAILS_ON_PRIMITIVES$1;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
_export({ target: 'Object', stat: true, forced: FORCED$1, sham: !descriptors }, {
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






var SPECIES$5 = wellKnownSymbol('species');

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
      re.constructor[SPECIES$5] = function () { return re; };
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

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype$1 = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype$1[UNSCOPABLES] == undefined) {
  objectDefineProperty.f(ArrayPrototype$1, UNSCOPABLES, {
    configurable: true,
    value: objectCreate(null)
  });
}

// add a key to Array.prototype[@@unscopables]
var addToUnscopables = function (key) {
  ArrayPrototype$1[UNSCOPABLES][key] = true;
};

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

var ITERATOR$3 = wellKnownSymbol('iterator');
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
  return IteratorPrototype[ITERATOR$3].call(test) !== test;
});

if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
if ( !has(IteratorPrototype, ITERATOR$3)) {
  createNonEnumerableProperty(IteratorPrototype, ITERATOR$3, returnThis);
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
var ITERATOR$4 = wellKnownSymbol('iterator');
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
  var nativeIterator = IterablePrototype[ITERATOR$4]
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
        } else if (typeof CurrentIteratorPrototype[ITERATOR$4] != 'function') {
          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR$4, returnThis$2);
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
  if ( IterablePrototype[ITERATOR$4] !== defaultIterator) {
    createNonEnumerableProperty(IterablePrototype, ITERATOR$4, defaultIterator);
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
var setInternalState$2 = internalState.set;
var getInternalState$2 = internalState.getterFor(ARRAY_ITERATOR);

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
  setInternalState$2(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState$2(this);
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



var STRING_ITERATOR = 'String Iterator';
var setInternalState$3 = internalState.set;
var getInternalState$3 = internalState.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState$3(this, {
    type: STRING_ITERATOR,
    string: String(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState$3(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = charAt(string, index);
  state.index += point.length;
  return { value: point, done: false };
});

var ITERATOR$5 = wellKnownSymbol('iterator');
var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
var ArrayValues = es_array_iterator.values;

for (var COLLECTION_NAME$1 in domIterables) {
  var Collection$1 = global_1[COLLECTION_NAME$1];
  var CollectionPrototype$1 = Collection$1 && Collection$1.prototype;
  if (CollectionPrototype$1) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype$1[ITERATOR$5] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype$1, ITERATOR$5, ArrayValues);
    } catch (error) {
      CollectionPrototype$1[ITERATOR$5] = ArrayValues;
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

var ITERATOR$6 = wellKnownSymbol('iterator');

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
    || !searchParams[ITERATOR$6]
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

var getIterator = function (it) {
  var iteratorMethod = getIteratorMethod(it);
  if (typeof iteratorMethod != 'function') {
    throw TypeError(String(it) + ' is not iterable');
  } return anObject(iteratorMethod.call(it));
};

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`





















var $fetch$1 = getBuiltIn('fetch');
var Headers = getBuiltIn('Headers');
var ITERATOR$7 = wellKnownSymbol('iterator');
var URL_SEARCH_PARAMS = 'URLSearchParams';
var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
var setInternalState$4 = internalState.set;
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
  setInternalState$4(this, {
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

  setInternalState$4(that, {
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
redefine(URLSearchParamsPrototype, ITERATOR$7, URLSearchParamsPrototype.entries);

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
if (!nativeUrl && typeof $fetch$1 == 'function' && typeof Headers == 'function') {
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
      } return $fetch$1.apply(this, args);
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
var setInternalState$5 = internalState.set;
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
  var state = setInternalState$5(that, { type: 'URL' });
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

var MATCH = wellKnownSymbol('match');

// `IsRegExp` abstract operation
// https://tc39.es/ecma262/#sec-isregexp
var isRegexp = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
};

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

var FORCED$3 = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.es/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
_export({ target: 'Array', proto: true, forced: FORCED$3 }, {
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

var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('slice');

var SPECIES$6 = wellKnownSymbol('species');
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
        Constructor = Constructor[SPECIES$6];
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

var $map = arrayIteration.map;


var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('map');

// `Array.prototype.map` method
// https://tc39.es/ecma262/#sec-array.prototype.map
// with adding support of @@species
_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 }, {
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

(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["Users"],{

/***/"./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/src/views/app/pages/people/users.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/src/views/app/pages/people/users.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/function node_modulesBabelLoaderLibIndexJsNode_modulesVueLoaderLibIndexJsResourcesSrcViewsAppPagesPeopleUsersVueVueTypeScriptLangJs(module,__webpack_exports__,__webpack_require__){
__webpack_require__.r(__webpack_exports__);
/* harmony import */var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(/*! @babel/runtime/regenerator */"./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */var vuex__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(/*! vuex */"./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */var nprogress__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(/*! nprogress */"./node_modules/nprogress/nprogress.js");
/* harmony import */var nprogress__WEBPACK_IMPORTED_MODULE_2___default=/*#__PURE__*/__webpack_require__.n(nprogress__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */var jspdf__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(/*! jspdf */"./node_modules/jspdf/dist/jspdf.es.min.js");
/* harmony import */var jspdf_autotable__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(/*! jspdf-autotable */"./node_modules/jspdf-autotable/dist/jspdf.plugin.autotable.js");


function asyncGeneratorStep(gen,resolve,reject,_next,_throw,key,arg){try{var info=gen[key](arg);var value=info.value;}catch(error){reject(error);return;}if(info.done){resolve(value);}else {Promise.resolve(value).then(_next,_throw);}}

function _asyncToGenerator(fn){return function(){var self=this,args=arguments;return new Promise(function(resolve,reject){var gen=fn.apply(self,args);function _next(value){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"next",value);}function _throw(err){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"throw",err);}_next(undefined);});};}

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




/* harmony default export */__webpack_exports__["default"]={
metaInfo:{
title:"Users"},

data:function data(){
return {
editmode:false,
isLoading:true,
email_exist:"",
serverParams:{
columnFilters:{},
sort:{
field:"id",
type:"desc"},

page:1,
perPage:10},

totalRows:"",
search:"",
limit:"10",
Filter_Name:"",
Filter_Email:"",
Filter_status:"",
Filter_Phone:"",
permissions:{},
users:[],
roles:[],
data:new FormData(),
user:{
firstname:"",
lastname:"",
username:"",
password:"",
NewPassword:null,
email:"",
phone:"",
statut:"",
role_id:"",
avatar:""}};


},
computed:_objectSpread(_objectSpread({},Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapGetters"])(["currentUserPermissions"])),{},{
columns:function columns(){
return [{
label:this.$t("Firstname"),
field:"firstname",
tdClass:"text-left",
thClass:"text-left"},
{
label:this.$t("lastname"),
field:"lastname",
tdClass:"text-left",
thClass:"text-left"},
{
label:this.$t("username"),
field:"username",
tdClass:"text-left",
thClass:"text-left"},
{
label:this.$t("Email"),
field:"email",
tdClass:"text-left",
thClass:"text-left"},
{
label:this.$t("Phone"),
field:"phone",
tdClass:"text-left",
thClass:"text-left"},
{
label:this.$t("Status"),
field:"statut",
html:true,
sortable:false,
tdClass:"text-center",
thClass:"text-center"},
{
label:this.$t("Action"),
field:"actions",
html:true,
tdClass:"text-right",
thClass:"text-right",
sortable:false}];

}}),

methods:{
//------------- Submit Validation Create & Edit User
Submit_User:function Submit_User(){
var _this=this;

this.$refs.Create_User.validate().then(function(success){
if(!success){
_this.makeToast("danger",_this.$t("Please_fill_the_form_correctly"),_this.$t("Failed"));
}else {
if(!_this.editmode){
_this.Create_User();
}else {
_this.Update_User();
}
}
});
},
//------ update Params Table
updateParams:function updateParams(newProps){
this.serverParams=Object.assign({},this.serverParams,newProps);
},
//---- Event Page Change
onPageChange:function onPageChange(_ref){
var currentPage=_ref.currentPage;

if(this.serverParams.page!==currentPage){
this.updateParams({
page:currentPage});

this.Get_Users(currentPage);
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

this.Get_Users(1);
}
},
//------ Event Sort Change
onSortChange:function onSortChange(params){
this.updateParams({
sort:{
type:params[0].type,
field:params[0].field}});


this.Get_Users(this.serverParams.page);
},
//------ Event Search
onSearch:function onSearch(value){
this.search=value.searchTerm;
this.Get_Users(this.serverParams.page);
},
//------ Event Validation State
getValidationState:function getValidationState(_ref3){
var dirty=_ref3.dirty,
validated=_ref3.validated,
_ref3$valid=_ref3.valid,
valid=_ref3$valid===void 0?null:_ref3$valid;
return dirty||validated?valid:null;
},
//------ Reset Filter
Reset_Filter:function Reset_Filter(){
this.search="";
this.Filter_Name="";
this.Filter_status="";
this.Filter_Phone="";
this.Filter_Email="";
this.Get_Users(this.serverParams.page);
},
//------ Toast
makeToast:function makeToast(variant,msg,title){
this.$root.$bvToast.toast(msg,{
title:title,
variant:variant,
solid:true});

},
//------ Checked Status User
isChecked:function isChecked(user){
var _this2=this;

axios.put("users/Activated/"+user.id,{
statut:user.statut,
id:user.id}).
then(function(response){
if(response.data.success){
if(user.statut){
user.statut=1;

_this2.makeToast("success",_this2.$t("ActivateUser"),_this2.$t("Success"));
}else {
user.statut=0;

_this2.makeToast("success",_this2.$t("DisActivateUser"),_this2.$t("Success"));
}
}else {
user.statut=1;

_this2.makeToast("warning",_this2.$t("Delete.Therewassomethingwronge"),_this2.$t("Warning"));
}
})["catch"](function(error){
user.statut=1;

_this2.makeToast("warning",_this2.$t("Delete.Therewassomethingwronge"),_this2.$t("Warning"));
});
},
//--------------------------- Users PDF ---------------------------\\
Users_PDF:function Users_PDF(){
var self=this;
var pdf=new jspdf__WEBPACK_IMPORTED_MODULE_3__["default"]("p","pt");
var columns=[{
title:"First Name",
dataKey:"firstname"},
{
title:"Last Name",
dataKey:"lastname"},
{
title:"Username",
dataKey:"username"},
{
title:"Email",
dataKey:"email"},
{
title:"Phone",
dataKey:"phone"}];

pdf.autoTable(columns,self.users);
pdf.text("User List",40,25);
pdf.save("User_List.pdf");
},
//------------------------ Users Excel ---------------------------\\
Users_Excel:function Users_Excel(){
// Start the progress bar.
nprogress__WEBPACK_IMPORTED_MODULE_2___default.a.start();
nprogress__WEBPACK_IMPORTED_MODULE_2___default.a.set(0.1);
axios.get("users/export/Excel",{
responseType:"blob",
// important
headers:{
"Content-Type":"application/json"}}).

then(function(response){
var url=window.URL.createObjectURL(new Blob([response.data]));
var link=document.createElement("a");
link.href=url;
link.setAttribute("download","List_Users.xlsx");
document.body.appendChild(link);
link.click();// Complete the animation of theprogress bar.

setTimeout(function(){
return nprogress__WEBPACK_IMPORTED_MODULE_2___default.a.done();
},500);
})["catch"](function(){
// Complete the animation of theprogress bar.
setTimeout(function(){
return nprogress__WEBPACK_IMPORTED_MODULE_2___default.a.done();
},500);
});
},
// Simply replaces null values with strings=''
setToStrings:function setToStrings(){
if(this.Filter_status===null){
this.Filter_status="";
}
},
//----------------------------------- Get All Users  ---------------------------\\
Get_Users:function Get_Users(page){
var _this3=this;

// Start the progress bar.
nprogress__WEBPACK_IMPORTED_MODULE_2___default.a.start();
nprogress__WEBPACK_IMPORTED_MODULE_2___default.a.set(0.1);
this.setToStrings();
axios.get("users?page="+page+"&name="+this.Filter_Name+"&statut="+this.Filter_status+"&phone="+this.Filter_Phone+"&email="+this.Filter_Email+"&SortField="+this.serverParams.sort.field+"&SortType="+this.serverParams.sort.type+"&search="+this.search+"&limit="+this.limit).then(function(response){
_this3.users=response.data.users;
_this3.roles=response.data.roles;
_this3.totalRows=response.data.totalRows;// Complete the animation of theprogress bar.

nprogress__WEBPACK_IMPORTED_MODULE_2___default.a.done();
_this3.isLoading=false;
})["catch"](function(response){
// Complete the animation of theprogress bar.
nprogress__WEBPACK_IMPORTED_MODULE_2___default.a.done();
setTimeout(function(){
_this3.isLoading=false;
},500);
});
},
//------------------------------ Show Modal (Create User) -------------------------------\\
New_User:function New_User(){
this.reset_Form();
this.editmode=false;
this.$bvModal.show("New_User");
},
//------------------------------ Show Modal (Update User) -------------------------------\\
Edit_User:function Edit_User(user){
this.Get_Users(this.serverParams.page);
this.reset_Form();
this.user=user;
this.user.NewPassword=null;
this.editmode=true;
this.$bvModal.show("New_User");
},
//------------------------------ Event Upload Avatar -------------------------------\\
onFileSelected:function onFileSelected(e){
var _this4=this;

return _asyncToGenerator(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(){
var _yield$_this4$$refs$A,valid;

return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context){
while(1){
switch(_context.prev=_context.next){
case 0:
_context.next=2;
return _this4.$refs.Avatar.validate(e);

case 2:
_yield$_this4$$refs$A=_context.sent;
valid=_yield$_this4$$refs$A.valid;

if(valid){
_this4.user.avatar=e.target.files[0];
}else {
_this4.user.avatar="";
}

case 5:
case"end":
return _context.stop();}

}
},_callee);
}))();
},
//------------------------ Create User ---------------------------\\
Create_User:function Create_User(){
var _this5=this;

var self=this;
self.data.append("firstname",self.user.firstname);
self.data.append("lastname",self.user.lastname);
self.data.append("username",self.user.username);
self.data.append("email",self.user.email);
self.data.append("password",self.user.password);
self.data.append("phone",self.user.phone);
self.data.append("role",self.user.role_id);
self.data.append("avatar",self.user.avatar);
axios.post("users",self.data).then(function(response){
Fire.$emit("Event_User");

_this5.makeToast("success",_this5.$t("Create.TitleUser"),_this5.$t("Success"));
})["catch"](function(error){
if(error.errors.email.length>0){
self.email_exist=error.errors.email[0];
}

_this5.makeToast("danger",_this5.$t("InvalidData"),_this5.$t("Failed"));
});
},
//----------------------- Update User ---------------------------\\
Update_User:function Update_User(){
var _this6=this;

var self=this;
self.data.append("firstname",self.user.firstname);
self.data.append("lastname",self.user.lastname);
self.data.append("username",self.user.username);
self.data.append("email",self.user.email);
self.data.append("NewPassword",self.user.NewPassword);
self.data.append("phone",self.user.phone);
self.data.append("role",self.user.role_id);
self.data.append("statut",self.user.statut);
self.data.append("avatar",self.user.avatar);
self.data.append("_method","put");
axios.post("users/"+this.user.id,self.data).then(function(response){
_this6.makeToast("success",_this6.$t("Update.TitleUser"),_this6.$t("Success"));

Fire.$emit("Event_User");
})["catch"](function(error){
if(error.errors.email.length>0){
self.email_exist=error.errors.email[0];
}

_this6.makeToast("danger",_this6.$t("InvalidData"),_this6.$t("Failed"));
});
},
//----------------------------- Reset Form ---------------------------\\
reset_Form:function reset_Form(){
this.user={
id:"",
firstname:"",
lastname:"",
username:"",
password:"",
NewPassword:null,
email:"",
phone:"",
statut:"",
role_id:"",
avatar:""};

this.email_exist="";
},
//--------------------------------- Remove User ---------------------------\\
Remove_User:function Remove_User(id){
var _this7=this;

this.$swal({
title:this.$t("Delete.Title"),
text:this.$t("Delete.Text"),
type:"warning",
showCancelButton:true,
confirmButtonColor:"#3085d6",
cancelButtonColor:"#d33",
cancelButtonText:this.$t("Delete.cancelButtonText"),
confirmButtonText:this.$t("Delete.confirmButtonText")}).
then(function(result){
if(result.value){
axios["delete"]("users/"+id).then(function(){
_this7.$swal(_this7.$t("Delete.Deleted"),_this7.$t("Delete.UserDeleted"),"success");

Fire.$emit("Delete_User");
})["catch"](function(){
_this7.$swal(_this7.$t("Delete.Failed"),"this User already linked with other operation","warning");
});
}
});
}},

// END METHODS
//----------------------------- Created function-------------------
created:function created(){
var _this8=this;

this.Get_Users(1);
Fire.$on("Event_User",function(){
setTimeout(function(){
_this8.Get_Users(_this8.serverParams.page);

_this8.$bvModal.hide("New_User");
},500);
});
Fire.$on("Delete_User",function(){
setTimeout(function(){
_this8.Get_Users(_this8.serverParams.page);
},500);
});
}};


/***/},

/***/"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/src/views/app/pages/people/users.vue?vue&type=template&id=7e1871e5&":
/*!*********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/src/views/app/pages/people/users.vue?vue&type=template&id=7e1871e5& ***!
  \*********************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/function node_modulesVueLoaderLibLoadersTemplateLoaderJsNode_modulesVueLoaderLibIndexJsResourcesSrcViewsAppPagesPeopleUsersVueVueTypeTemplateId7e1871e5(module,__webpack_exports__,__webpack_require__){
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
attrs:{page:_vm.$t("UserManagement"),folder:_vm.$t("Users")}}),

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
rows:_vm.users,
"search-options":{
enabled:true,
placeholder:_vm.$t("Search_this_table")},

"pagination-options":{
enabled:true,
mode:"records",
nextLabel:"next",
prevLabel:"prev"},

styleClass:"table-hover tableOne vgt-table"},

on:{
"on-page-change":_vm.onPageChange,
"on-per-page-change":_vm.onPerPageChange,
"on-sort-change":_vm.onSortChange,
"on-search":_vm.onSearch},

scopedSlots:_vm._u([
{
key:"table-row",
fn:function fn(props){
return [
props.column.field=="actions"?
_c("span",[
_vm.currentUserPermissions&&
_vm.currentUserPermissions.includes(
"users_edit")?

_c(
"a",
{
directives:[
{
name:"b-tooltip",
rawName:"v-b-tooltip.hover",
modifiers:{hover:true}}],


attrs:{title:"Edit"},
on:{
click:function click($event){
return _vm.Edit_User(props.row);
}}},


[
_c("i",{
staticClass:
"i-Edit text-25 text-success"})]):



_vm._e()]):

props.column.field=="statut"?
_c("div",[
_c(
"label",
{staticClass:"switch switch-primary mr-3"},
[
_c("input",{
directives:[
{
name:"model",
rawName:"v-model",
value:props.row.statut,
expression:"props.row.statut"}],


attrs:{type:"checkbox"},
domProps:{
checked:Array.isArray(props.row.statut)?
_vm._i(props.row.statut,null)>-1:
props.row.statut},

on:{
change:[
function($event){
var $$a=props.row.statut,
$$el=$event.target,
$$c=$$el.checked?true:false;
if(Array.isArray($$a)){
var $$v=null,
$$i=_vm._i($$a,$$v);
if($$el.checked){
$$i<0&&
_vm.$set(
props.row,
"statut",
$$a.concat([$$v]));

}else {
$$i>-1&&
_vm.$set(
props.row,
"statut",
$$a.
slice(0,$$i).
concat(
$$a.slice($$i+1)));


}
}else {
_vm.$set(props.row,"statut",$$c);
}
},
function($event){
return _vm.isChecked(props.row);
}]}}),



_vm._v(" "),
_c("span",{staticClass:"slider"})])]):



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


attrs:{variant:"outline-info m-1",size:"sm"}},

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
attrs:{size:"sm",variant:"outline-success m-1"},
on:{
click:function click($event){
return _vm.Users_PDF();
}}},


[
_c("i",{staticClass:"i-File-Copy"}),
_vm._v(" PDF\n        ")]),


_vm._v(" "),
_c(
"b-button",
{
attrs:{size:"sm",variant:"outline-danger m-1"},
on:{
click:function click($event){
return _vm.Users_Excel();
}}},


[
_c("i",{staticClass:"i-File-Excel"}),
_vm._v(" EXCEL\n        ")]),


_vm._v(" "),
_vm.currentUserPermissions&&
_vm.currentUserPermissions.includes("users_add")?
_c(
"b-button",
{
attrs:{
size:"sm",
variant:"btn btn-primary btn-icon m-1"},

on:{
click:function click($event){
return _vm.New_User();
}}},


[
_c("i",{staticClass:"i-Add"}),
_vm._v(
"\n          "+
_vm._s(_vm.$t("Add"))+
"\n        ")]):



_vm._e()],

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
{attrs:{label:_vm.$t("username")}},
[
_c("b-form-input",{
attrs:{
label:"Code",
placeholder:_vm.$t("username")},

model:{
value:_vm.Filter_Name,
callback:function callback($$v){
_vm.Filter_Name=$$v;
},
expression:"Filter_Name"}})],



1)],


1),

_vm._v(" "),
_c(
"b-col",
{attrs:{md:"12"}},
[
_c(
"b-form-group",
{attrs:{label:_vm.$t("Phone")}},
[
_c("b-form-input",{
attrs:{
label:"Phone",
placeholder:_vm.$t("SearchByPhone")},

model:{
value:_vm.Filter_Phone,
callback:function callback($$v){
_vm.Filter_Phone=$$v;
},
expression:"Filter_Phone"}})],



1)],


1),

_vm._v(" "),
_c(
"b-col",
{attrs:{md:"12"}},
[
_c(
"b-form-group",
{attrs:{label:_vm.$t("Email")}},
[
_c("b-form-input",{
attrs:{
label:"Email",
placeholder:_vm.$t("SearchByEmail")},

model:{
value:_vm.Filter_Email,
callback:function callback($$v){
_vm.Filter_Email=$$v;
},
expression:"Filter_Email"}})],



1)],


1),

_vm._v(" "),
_c(
"b-col",
{attrs:{md:"12"}},
[
_c(
"b-form-group",
{attrs:{label:_vm.$t("Status")}},
[
_c("v-select",{
attrs:{
reduce:function reduce(label){
return label.value;
},
placeholder:_vm.$t("Choose_Status"),
options:[
{label:"Actif",value:"1"},
{label:"Inactif",value:"0"}]},


model:{
value:_vm.Filter_status,
callback:function callback($$v){
_vm.Filter_status=$$v;
},
expression:"Filter_status"}})],



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
variant:"primary m-1",
size:"sm",
block:""},

on:{
click:function click($event){
return _vm.Get_Users(_vm.serverParams.page);
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
variant:"danger m-1",
size:"sm",
block:""},

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
"validation-observer",
{ref:"Create_User"},
[
_c(
"b-modal",
{
attrs:{
"hide-footer":"",
size:"lg",
id:"New_User",
title:_vm.editmode?_vm.$t("Edit"):_vm.$t("Add")}},


[
_c(
"b-form",
{
attrs:{enctype:"multipart/form-data"},
on:{
submit:function submit($event){
$event.preventDefault();
return _vm.Submit_User($event);
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
name:"Firstname",
rules:{required:true,min:4,max:20}},

scopedSlots:_vm._u([
{
key:"default",
fn:function fn(validationContext){
return [
_c(
"b-form-group",
{attrs:{label:_vm.$t("Firstname")}},
[
_c("b-form-input",{
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"Firstname-feedback",
label:"Firstname"},

model:{
value:_vm.user.firstname,
callback:function callback($$v){
_vm.$set(
_vm.user,
"firstname",
$$v);

},
expression:"user.firstname"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{id:"Firstname-feedback"}},

[
_vm._v(
_vm._s(
validationContext.errors[0]))])],





1)];


}}])})],




1),

_vm._v(" "),
_c(
"b-col",
{attrs:{md:"6",sm:"12"}},
[
_c("validation-provider",{
attrs:{
name:"lastname",
rules:{required:true,min:4,max:20}},

scopedSlots:_vm._u([
{
key:"default",
fn:function fn(validationContext){
return [
_c(
"b-form-group",
{attrs:{label:_vm.$t("lastname")}},
[
_c("b-form-input",{
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"lastname-feedback",
label:"lastname"},

model:{
value:_vm.user.lastname,
callback:function callback($$v){
_vm.$set(
_vm.user,
"lastname",
$$v);

},
expression:"user.lastname"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{id:"lastname-feedback"}},

[
_vm._v(
_vm._s(
validationContext.errors[0]))])],





1)];


}}])})],




1),

_vm._v(" "),
_c(
"b-col",
{attrs:{md:"6",sm:"12"}},
[
_c("validation-provider",{
attrs:{
name:"username",
rules:{required:true,min:4,max:20}},

scopedSlots:_vm._u([
{
key:"default",
fn:function fn(validationContext){
return [
_c(
"b-form-group",
{attrs:{label:_vm.$t("username")}},
[
_c("b-form-input",{
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"username-feedback",
label:"username"},

model:{
value:_vm.user.username,
callback:function callback($$v){
_vm.$set(
_vm.user,
"username",
$$v);

},
expression:"user.username"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{id:"username-feedback"}},

[
_vm._v(
_vm._s(
validationContext.errors[0]))])],





1)];


}}])})],




1),

_vm._v(" "),
_c(
"b-col",
{attrs:{md:"6",sm:"12"}},
[
_c("validation-provider",{
attrs:{name:"Phone",rules:{required:true}},
scopedSlots:_vm._u([
{
key:"default",
fn:function fn(validationContext){
return [
_c(
"b-form-group",
{attrs:{label:_vm.$t("Phone")}},
[
_c("b-form-input",{
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"Phone-feedback",
label:"Phone"},

model:{
value:_vm.user.phone,
callback:function callback($$v){
_vm.$set(_vm.user,"phone",$$v);
},
expression:"user.phone"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{attrs:{id:"Phone-feedback"}},
[
_vm._v(
_vm._s(
validationContext.errors[0]))])],





1)];


}}])})],




1),

_vm._v(" "),
_c(
"b-col",
{attrs:{md:"6",sm:"12"}},
[
_c("validation-provider",{
attrs:{name:"Email",rules:{required:true}},
scopedSlots:_vm._u([
{
key:"default",
fn:function fn(validationContext){
return [
_c(
"b-form-group",
{attrs:{label:_vm.$t("Email")}},
[
_c("b-form-input",{
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"Email-feedback",
label:"Email"},

model:{
value:_vm.user.email,
callback:function callback($$v){
_vm.$set(_vm.user,"email",$$v);
},
expression:"user.email"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{attrs:{id:"Email-feedback"}},
[
_vm._v(
_vm._s(
validationContext.errors[0]))]),




_vm._v(" "),
_vm.email_exist!=""?
_c(
"b-alert",
{
staticClass:"error mt-1",
attrs:{
show:"",
variant:"danger"}},


[_vm._v(_vm._s(_vm.email_exist))]):

_vm._e()],

1)];


}}])})],




1),

_vm._v(" "),
!_vm.editmode?
_c(
"b-col",
{attrs:{md:"6",sm:"12"}},
[
_c("validation-provider",{
attrs:{
name:"password",
rules:{required:true,min:6,max:14}},

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
label:_vm.$t("password")}},


[
_c("b-form-input",{
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"password-feedback",
label:"password",
type:"password"},

model:{
value:_vm.user.password,
callback:function callback($$v){
_vm.$set(
_vm.user,
"password",
$$v);

},
expression:"user.password"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{
id:"password-feedback"}},


[
_vm._v(
_vm._s(
validationContext.
errors[0]))])],





1)];


}}],


null,
false,
2321465681)})],



1):

_vm._e(),
_vm._v(" "),
_c(
"b-col",
{attrs:{md:"6",sm:"12"}},
[
_c("validation-provider",{
attrs:{name:"role",rules:{required:true}},
scopedSlots:_vm._u([
{
key:"default",
fn:function fn(ref){
var valid=ref.valid;
var errors=ref.errors;
return _c(
"b-form-group",
{attrs:{label:_vm.$t("RoleName")}},
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
reduce:function reduce(label){
return label.value;
},
placeholder:_vm.$t("PleaseSelect"),
options:_vm.roles.map(function(
roles)
{
return {
label:roles.name,
value:roles.id};

})},

model:{
value:_vm.user.role_id,
callback:function callback($$v){
_vm.$set(_vm.user,"role_id",$$v);
},
expression:"user.role_id"}}),


_vm._v(" "),
_c("b-form-invalid-feedback",[
_vm._v(_vm._s(errors[0]))])],


1);

}}])})],




1),

_vm._v(" "),
_c(
"b-col",
{attrs:{md:"6",sm:"12"}},
[
_c("validation-provider",{
ref:"Avatar",
attrs:{
name:"Avatar",
rules:"mimes:image/*|size:200"},

scopedSlots:_vm._u([
{
key:"default",
fn:function fn(ref){
var validate=ref.validate;
var valid=ref.valid;
var errors=ref.errors;
return _c(
"b-form-group",
{attrs:{label:_vm.$t("UserImage")}},
[
_c("input",{
class:{
"is-invalid":!!errors.length},

attrs:{
state:errors[0]?
false:
valid?
true:
null,
label:"Choose Avatar",
type:"file"},

on:{change:_vm.onFileSelected}}),

_vm._v(" "),
_c(
"b-form-invalid-feedback",
{attrs:{id:"Avatar-feedback"}},
[_vm._v(_vm._s(errors[0]))])],


1);

}}])})],




1),

_vm._v(" "),
_vm.editmode?
_c(
"b-col",
{attrs:{md:"6"}},
[
_c("validation-provider",{
attrs:{
name:"New password",
rules:{min:6,max:14}},

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
label:_vm.$t("Newpassword")}},


[
_c("b-form-input",{
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"Nawpassword-feedback",
placeholder:_vm.$t(
"LeaveBlank"),

label:"New password"},

model:{
value:_vm.user.NewPassword,
callback:function callback($$v){
_vm.$set(
_vm.user,
"NewPassword",
$$v);

},
expression:"user.NewPassword"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{
id:"Nawpassword-feedback"}},


[
_vm._v(
_vm._s(
validationContext.
errors[0]))])],





1)];


}}],


null,
false,
1010016937)})],



1):

_vm._e(),
_vm._v(" "),
_c(
"b-col",
{staticClass:"mt-3",attrs:{md:"12"}},
[
_c(
"b-button",
{attrs:{variant:"primary",type:"submit"}},
[_vm._v(_vm._s(_vm.$t("submit")))])],


1)],


1)],


1)],


1)],


1)],


1);

};
var staticRenderFns=[];
render._withStripped=true;



/***/},

/***/"./resources/src/views/app/pages/people/users.vue":
/*!********************************************************!*\
  !*** ./resources/src/views/app/pages/people/users.vue ***!
  \********************************************************/
/*! exports provided: default */
/***/function resourcesSrcViewsAppPagesPeopleUsersVue(module,__webpack_exports__,__webpack_require__){
__webpack_require__.r(__webpack_exports__);
/* harmony import */var _users_vue_vue_type_template_id_7e1871e5___WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(/*! ./users.vue?vue&type=template&id=7e1871e5& */"./resources/src/views/app/pages/people/users.vue?vue&type=template&id=7e1871e5&");
/* harmony import */var _users_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(/*! ./users.vue?vue&type=script&lang=js& */"./resources/src/views/app/pages/people/users.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony import */var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */"./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component=Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
_users_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
_users_vue_vue_type_template_id_7e1871e5___WEBPACK_IMPORTED_MODULE_0__["render"],
_users_vue_vue_type_template_id_7e1871e5___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
false,
null,
null,
null);
component.options.__file="resources/src/views/app/pages/people/users.vue";
/* harmony default export */__webpack_exports__["default"]=component.exports;

/***/},

/***/"./resources/src/views/app/pages/people/users.vue?vue&type=script&lang=js&":
/*!*********************************************************************************!*\
  !*** ./resources/src/views/app/pages/people/users.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/function resourcesSrcViewsAppPagesPeopleUsersVueVueTypeScriptLangJs(module,__webpack_exports__,__webpack_require__){
__webpack_require__.r(__webpack_exports__);
/* harmony import */var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_users_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./users.vue?vue&type=script&lang=js& */"./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/src/views/app/pages/people/users.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */__webpack_exports__["default"]=_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_users_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"];

/***/},

/***/"./resources/src/views/app/pages/people/users.vue?vue&type=template&id=7e1871e5&":
/*!***************************************************************************************!*\
  !*** ./resources/src/views/app/pages/people/users.vue?vue&type=template&id=7e1871e5& ***!
  \***************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/function resourcesSrcViewsAppPagesPeopleUsersVueVueTypeTemplateId7e1871e5(module,__webpack_exports__,__webpack_require__){
__webpack_require__.r(__webpack_exports__);
/* harmony import */var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_users_vue_vue_type_template_id_7e1871e5___WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(/*! -!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./users.vue?vue&type=template&id=7e1871e5& */"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/src/views/app/pages/people/users.vue?vue&type=template&id=7e1871e5&");
/* harmony reexport (safe) */__webpack_require__.d(__webpack_exports__,"render",function(){return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_users_vue_vue_type_template_id_7e1871e5___WEBPACK_IMPORTED_MODULE_0__["render"];});

/* harmony reexport (safe) */__webpack_require__.d(__webpack_exports__,"staticRenderFns",function(){return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_users_vue_vue_type_template_id_7e1871e5___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"];});



/***/}}]);

}());
=======
!function(){"use strict";var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function e(t,e){return t(e={exports:{}},e.exports),e.exports}var r=function(t){return t&&t.Math==Math&&t},n=r("object"==typeof globalThis&&globalThis)||r("object"==typeof window&&window)||r("object"==typeof self&&self)||r("object"==typeof t&&t)||function(){return this}()||Function("return this")(),a=function(t){try{return!!t()}catch(t){return!0}},o=!a((function(){return 7!=Object.defineProperty({},1,{get:function(){return 7}})[1]})),i={}.propertyIsEnumerable,s=Object.getOwnPropertyDescriptor,u={f:s&&!i.call({1:2},1)?function(t){var e=s(this,t);return!!e&&e.enumerable}:i},c=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}},l={}.toString,f=function(t){return l.call(t).slice(8,-1)},h="".split,p=a((function(){return!Object("z").propertyIsEnumerable(0)}))?function(t){return"String"==f(t)?h.call(t,""):Object(t)}:Object,d=function(t){if(null==t)throw TypeError("Can't call method on "+t);return t},v=function(t){return p(d(t))},m=function(t){return"object"==typeof t?null!==t:"function"==typeof t},g=function(t,e){if(!m(t))return t;var r,n;if(e&&"function"==typeof(r=t.toString)&&!m(n=r.call(t)))return n;if("function"==typeof(r=t.valueOf)&&!m(n=r.call(t)))return n;if(!e&&"function"==typeof(r=t.toString)&&!m(n=r.call(t)))return n;throw TypeError("Can't convert object to primitive value")},b={}.hasOwnProperty,y=function(t,e){return b.call(t,e)},w=n.document,_=m(w)&&m(w.createElement),S=function(t){return _?w.createElement(t):{}},x=!o&&!a((function(){return 7!=Object.defineProperty(S("div"),"a",{get:function(){return 7}}).a})),P=Object.getOwnPropertyDescriptor,k={f:o?P:function(t,e){if(t=v(t),e=g(e,!0),x)try{return P(t,e)}catch(t){}if(y(t,e))return c(!u.f.call(t,e),t[e])}},E=function(t){if(!m(t))throw TypeError(String(t)+" is not an object");return t},O=Object.defineProperty,U={f:o?O:function(t,e,r){if(E(t),e=g(e,!0),E(r),x)try{return O(t,e,r)}catch(t){}if("get"in r||"set"in r)throw TypeError("Accessors not supported");return"value"in r&&(t[e]=r.value),t}},j=o?function(t,e,r){return U.f(t,e,c(1,r))}:function(t,e,r){return t[e]=r,t},A=function(t,e){try{j(n,t,e)}catch(r){n[t]=e}return e},T=n["__core-js_shared__"]||A("__core-js_shared__",{}),R=Function.toString;"function"!=typeof T.inspectSource&&(T.inspectSource=function(t){return R.call(t)});var L,$,C,F=T.inspectSource,I=n.WeakMap,N="function"==typeof I&&/native code/.test(F(I)),D=e((function(t){(t.exports=function(t,e){return T[t]||(T[t]=void 0!==e?e:{})})("versions",[]).push({version:"3.10.2",mode:"global",copyright:"© 2021 Denis Pushkarev (zloirock.ru)"})})),B=0,q=Math.random(),M=function(t){return"Symbol("+String(void 0===t?"":t)+")_"+(++B+q).toString(36)},G=D("keys"),z=function(t){return G[t]||(G[t]=M(t))},V={},K=n.WeakMap;if(N){var W=T.state||(T.state=new K),H=W.get,J=W.has,Y=W.set;L=function(t,e){if(J.call(W,t))throw new TypeError("Object already initialized");return e.facade=t,Y.call(W,t,e),e},$=function(t){return H.call(W,t)||{}},C=function(t){return J.call(W,t)}}else{var X=z("state");V[X]=!0,L=function(t,e){if(y(t,X))throw new TypeError("Object already initialized");return e.facade=t,j(t,X,e),e},$=function(t){return y(t,X)?t[X]:{}},C=function(t){return y(t,X)}}var Z,Q,tt={set:L,get:$,has:C,enforce:function(t){return C(t)?$(t):L(t,{})},getterFor:function(t){return function(e){var r;if(!m(e)||(r=$(e)).type!==t)throw TypeError("Incompatible receiver, "+t+" required");return r}}},et=e((function(t){var e=tt.get,r=tt.enforce,a=String(String).split("String");(t.exports=function(t,e,o,i){var s,u=!!i&&!!i.unsafe,c=!!i&&!!i.enumerable,l=!!i&&!!i.noTargetGet;"function"==typeof o&&("string"!=typeof e||y(o,"name")||j(o,"name",e),(s=r(o)).source||(s.source=a.join("string"==typeof e?e:""))),t!==n?(u?!l&&t[e]&&(c=!0):delete t[e],c?t[e]=o:j(t,e,o)):c?t[e]=o:A(e,o)})(Function.prototype,"toString",(function(){return"function"==typeof this&&e(this).source||F(this)}))})),rt=n,nt=function(t){return"function"==typeof t?t:void 0},at=function(t,e){return arguments.length<2?nt(rt[t])||nt(n[t]):rt[t]&&rt[t][e]||n[t]&&n[t][e]},ot=Math.ceil,it=Math.floor,st=function(t){return isNaN(t=+t)?0:(t>0?it:ot)(t)},ut=Math.min,ct=function(t){return t>0?ut(st(t),9007199254740991):0},lt=Math.max,ft=Math.min,ht=function(t,e){var r=st(t);return r<0?lt(r+e,0):ft(r,e)},pt=function(t){return function(e,r,n){var a,o=v(e),i=ct(o.length),s=ht(n,i);if(t&&r!=r){for(;i>s;)if((a=o[s++])!=a)return!0}else for(;i>s;s++)if((t||s in o)&&o[s]===r)return t||s||0;return!t&&-1}},dt={includes:pt(!0),indexOf:pt(!1)},vt=dt.indexOf,mt=function(t,e){var r,n=v(t),a=0,o=[];for(r in n)!y(V,r)&&y(n,r)&&o.push(r);for(;e.length>a;)y(n,r=e[a++])&&(~vt(o,r)||o.push(r));return o},gt=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"],bt=gt.concat("length","prototype"),yt={f:Object.getOwnPropertyNames||function(t){return mt(t,bt)}},wt={f:Object.getOwnPropertySymbols},_t=at("Reflect","ownKeys")||function(t){var e=yt.f(E(t)),r=wt.f;return r?e.concat(r(t)):e},St=function(t,e){for(var r=_t(e),n=U.f,a=k.f,o=0;o<r.length;o++){var i=r[o];y(t,i)||n(t,i,a(e,i))}},xt=/#|\.prototype\./,Pt=function(t,e){var r=Et[kt(t)];return r==Ut||r!=Ot&&("function"==typeof e?a(e):!!e)},kt=Pt.normalize=function(t){return String(t).replace(xt,".").toLowerCase()},Et=Pt.data={},Ot=Pt.NATIVE="N",Ut=Pt.POLYFILL="P",jt=Pt,At=k.f,Tt=function(t,e){var r,a,o,i,s,u=t.target,c=t.global,l=t.stat;if(r=c?n:l?n[u]||A(u,{}):(n[u]||{}).prototype)for(a in e){if(i=e[a],o=t.noTargetGet?(s=At(r,a))&&s.value:r[a],!jt(c?a:u+(l?".":"#")+a,t.forced)&&void 0!==o){if(typeof i==typeof o)continue;St(i,o)}(t.sham||o&&o.sham)&&j(i,"sham",!0),et(r,a,i,t)}},Rt="process"==f(n.process),Lt=at("navigator","userAgent")||"",$t=n.process,Ct=$t&&$t.versions,Ft=Ct&&Ct.v8;Ft?Q=(Z=Ft.split("."))[0]+Z[1]:Lt&&(!(Z=Lt.match(/Edge\/(\d+)/))||Z[1]>=74)&&(Z=Lt.match(/Chrome\/(\d+)/))&&(Q=Z[1]);var It,Nt=Q&&+Q,Dt=!!Object.getOwnPropertySymbols&&!a((function(){return!Symbol.sham&&(Rt?38===Nt:Nt>37&&Nt<41)})),Bt=Dt&&!Symbol.sham&&"symbol"==typeof Symbol.iterator,qt=D("wks"),Mt=n.Symbol,Gt=Bt?Mt:Mt&&Mt.withoutSetter||M,zt=function(t){return y(qt,t)&&(Dt||"string"==typeof qt[t])||(Dt&&y(Mt,t)?qt[t]=Mt[t]:qt[t]=Gt("Symbol."+t)),qt[t]},Vt=Object.keys||function(t){return mt(t,gt)},Kt=o?Object.defineProperties:function(t,e){E(t);for(var r,n=Vt(e),a=n.length,o=0;a>o;)U.f(t,r=n[o++],e[r]);return t},Wt=at("document","documentElement"),Ht=z("IE_PROTO"),Jt=function(){},Yt=function(t){return"<script>"+t+"<\/script>"},Xt=function(){try{It=document.domain&&new ActiveXObject("htmlfile")}catch(t){}var t,e;Xt=It?function(t){t.write(Yt("")),t.close();var e=t.parentWindow.Object;return t=null,e}(It):((e=S("iframe")).style.display="none",Wt.appendChild(e),e.src=String("javascript:"),(t=e.contentWindow.document).open(),t.write(Yt("document.F=Object")),t.close(),t.F);for(var r=gt.length;r--;)delete Xt.prototype[gt[r]];return Xt()};V[Ht]=!0;var Zt=Object.create||function(t,e){var r;return null!==t?(Jt.prototype=E(t),r=new Jt,Jt.prototype=null,r[Ht]=t):r=Xt(),void 0===e?r:Kt(r,e)},Qt=zt("unscopables"),te=Array.prototype;null==te[Qt]&&U.f(te,Qt,{configurable:!0,value:Zt(null)});var ee=function(t){te[Qt][t]=!0},re=dt.includes;Tt({target:"Array",proto:!0},{includes:function(t){return re(this,t,arguments.length>1?arguments[1]:void 0)}}),ee("includes");var ne=zt("match"),ae=function(t){if(function(t){var e;return m(t)&&(void 0!==(e=t[ne])?!!e:"RegExp"==f(t))}(t))throw TypeError("The method doesn't accept regular expressions");return t},oe=zt("match");Tt({target:"String",proto:!0,forced:!function(t){var e=/./;try{"/./"[t](e)}catch(r){try{return e[oe]=!1,"/./"[t](e)}catch(t){}}return!1}("includes")},{includes:function(t){return!!~String(d(this)).indexOf(ae(t),arguments.length>1?arguments[1]:void 0)}});var ie=Array.isArray||function(t){return"Array"==f(t)},se=function(t){return Object(d(t))},ue=function(t,e,r){var n=g(e);n in t?U.f(t,n,c(0,r)):t[n]=r},ce=zt("species"),le=function(t,e){var r;return ie(t)&&("function"!=typeof(r=t.constructor)||r!==Array&&!ie(r.prototype)?m(r)&&null===(r=r[ce])&&(r=void 0):r=void 0),new(void 0===r?Array:r)(0===e?0:e)},fe=zt("species"),he=function(t){return Nt>=51||!a((function(){var e=[];return(e.constructor={})[fe]=function(){return{foo:1}},1!==e[t](Boolean).foo}))},pe=zt("isConcatSpreadable"),de=Nt>=51||!a((function(){var t=[];return t[pe]=!1,t.concat()[0]!==t})),ve=he("concat"),me=function(t){if(!m(t))return!1;var e=t[pe];return void 0!==e?!!e:ie(t)};Tt({target:"Array",proto:!0,forced:!de||!ve},{concat:function(t){var e,r,n,a,o,i=se(this),s=le(i,0),u=0;for(e=-1,n=arguments.length;e<n;e++)if(me(o=-1===e?i:arguments[e])){if(u+(a=ct(o.length))>9007199254740991)throw TypeError("Maximum allowed index exceeded");for(r=0;r<a;r++,u++)r in o&&ue(s,u,o[r])}else{if(u>=9007199254740991)throw TypeError("Maximum allowed index exceeded");ue(s,u++,o)}return s.length=u,s}});var ge=he("slice"),be=zt("species"),ye=[].slice,we=Math.max;Tt({target:"Array",proto:!0,forced:!ge},{slice:function(t,e){var r,n,a,o=v(this),i=ct(o.length),s=ht(t,i),u=ht(void 0===e?i:e,i);if(ie(o)&&("function"!=typeof(r=o.constructor)||r!==Array&&!ie(r.prototype)?m(r)&&null===(r=r[be])&&(r=void 0):r=void 0,r===Array||void 0===r))return ye.call(o,s,u);for(n=new(void 0===r?Array:r)(we(u-s,0)),a=0;s<u;s++,a++)s in o&&ue(n,a,o[s]);return n.length=a,n}});var _e=function(t){if("function"!=typeof t)throw TypeError(String(t)+" is not a function");return t},Se=function(t,e,r){if(_e(t),void 0===e)return t;switch(r){case 0:return function(){return t.call(e)};case 1:return function(r){return t.call(e,r)};case 2:return function(r,n){return t.call(e,r,n)};case 3:return function(r,n,a){return t.call(e,r,n,a)}}return function(){return t.apply(e,arguments)}},xe=[].push,Pe=function(t){var e=1==t,r=2==t,n=3==t,a=4==t,o=6==t,i=7==t,s=5==t||o;return function(u,c,l,f){for(var h,d,v=se(u),m=p(v),g=Se(c,l,3),b=ct(m.length),y=0,w=f||le,_=e?w(u,b):r||i?w(u,0):void 0;b>y;y++)if((s||y in m)&&(d=g(h=m[y],y,v),t))if(e)_[y]=d;else if(d)switch(t){case 3:return!0;case 5:return h;case 6:return y;case 2:xe.call(_,h)}else switch(t){case 4:return!1;case 7:xe.call(_,h)}return o?-1:n||a?a:_}},ke={forEach:Pe(0),map:Pe(1),filter:Pe(2),some:Pe(3),every:Pe(4),find:Pe(5),findIndex:Pe(6),filterOut:Pe(7)},Ee=ke.map,Oe=he("map");Tt({target:"Array",proto:!0,forced:!Oe},{map:function(t){return Ee(this,t,arguments.length>1?arguments[1]:void 0)}});var Ue=U.f,je=Function.prototype,Ae=je.toString,Te=/^\s*function ([^ (]*)/;o&&!("name"in je)&&Ue(je,"name",{configurable:!0,get:function(){try{return Ae.call(this).match(Te)[1]}catch(t){return""}}});var Re={};Re[zt("toStringTag")]="z";var Le="[object z]"===String(Re),$e=zt("toStringTag"),Ce="Arguments"==f(function(){return arguments}()),Fe=Le?f:function(t){var e,r,n;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(r=function(t,e){try{return t[e]}catch(t){}}(e=Object(t),$e))?r:Ce?f(e):"Object"==(n=f(e))&&"function"==typeof e.callee?"Arguments":n},Ie=Le?{}.toString:function(){return"[object "+Fe(this)+"]"};Le||et(Object.prototype,"toString",Ie,{unsafe:!0});var Ne=n.Promise,De=function(t,e,r){for(var n in e)et(t,n,e[n],r);return t},Be=U.f,qe=zt("toStringTag"),Me=function(t,e,r){t&&!y(t=r?t:t.prototype,qe)&&Be(t,qe,{configurable:!0,value:e})},Ge=zt("species"),ze=function(t,e,r){if(!(t instanceof e))throw TypeError("Incorrect "+(r?r+" ":"")+"invocation");return t},Ve={},Ke=zt("iterator"),We=Array.prototype,He=function(t){return void 0!==t&&(Ve.Array===t||We[Ke]===t)},Je=zt("iterator"),Ye=function(t){if(null!=t)return t[Je]||t["@@iterator"]||Ve[Fe(t)]},Xe=function(t){var e=t.return;if(void 0!==e)return E(e.call(t)).value},Ze=function(t,e){this.stopped=t,this.result=e},Qe=function(t,e,r){var n,a,o,i,s,u,c,l=r&&r.that,f=!(!r||!r.AS_ENTRIES),h=!(!r||!r.IS_ITERATOR),p=!(!r||!r.INTERRUPTED),d=Se(e,l,1+f+p),v=function(t){return n&&Xe(n),new Ze(!0,t)},m=function(t){return f?(E(t),p?d(t[0],t[1],v):d(t[0],t[1])):p?d(t,v):d(t)};if(h)n=t;else{if("function"!=typeof(a=Ye(t)))throw TypeError("Target is not iterable");if(He(a)){for(o=0,i=ct(t.length);i>o;o++)if((s=m(t[o]))&&s instanceof Ze)return s;return new Ze(!1)}n=a.call(t)}for(u=n.next;!(c=u.call(n)).done;){try{s=m(c.value)}catch(t){throw Xe(n),t}if("object"==typeof s&&s&&s instanceof Ze)return s}return new Ze(!1)},tr=zt("iterator"),er=!1;try{var rr=0,nr={next:function(){return{done:!!rr++}},return:function(){er=!0}};nr[tr]=function(){return this},Array.from(nr,(function(){throw 2}))}catch(t){}var ar,or,ir,sr=zt("species"),ur=/(?:iphone|ipod|ipad).*applewebkit/i.test(Lt),cr=n.location,lr=n.setImmediate,fr=n.clearImmediate,hr=n.process,pr=n.MessageChannel,dr=n.Dispatch,vr=0,mr={},gr=function(t){if(mr.hasOwnProperty(t)){var e=mr[t];delete mr[t],e()}},br=function(t){return function(){gr(t)}},yr=function(t){gr(t.data)},wr=function(t){n.postMessage(t+"",cr.protocol+"//"+cr.host)};lr&&fr||(lr=function(t){for(var e=[],r=1;arguments.length>r;)e.push(arguments[r++]);return mr[++vr]=function(){("function"==typeof t?t:Function(t)).apply(void 0,e)},ar(vr),vr},fr=function(t){delete mr[t]},Rt?ar=function(t){hr.nextTick(br(t))}:dr&&dr.now?ar=function(t){dr.now(br(t))}:pr&&!ur?(ir=(or=new pr).port2,or.port1.onmessage=yr,ar=Se(ir.postMessage,ir,1)):n.addEventListener&&"function"==typeof postMessage&&!n.importScripts&&cr&&"file:"!==cr.protocol&&!a(wr)?(ar=wr,n.addEventListener("message",yr,!1)):ar="onreadystatechange"in S("script")?function(t){Wt.appendChild(S("script")).onreadystatechange=function(){Wt.removeChild(this),gr(t)}}:function(t){setTimeout(br(t),0)});var _r,Sr,xr,Pr,kr,Er,Or,Ur,jr={set:lr,clear:fr},Ar=/web0s(?!.*chrome)/i.test(Lt),Tr=k.f,Rr=jr.set,Lr=n.MutationObserver||n.WebKitMutationObserver,$r=n.document,Cr=n.process,Fr=n.Promise,Ir=Tr(n,"queueMicrotask"),Nr=Ir&&Ir.value;Nr||(_r=function(){var t,e;for(Rt&&(t=Cr.domain)&&t.exit();Sr;){e=Sr.fn,Sr=Sr.next;try{e()}catch(t){throw Sr?Pr():xr=void 0,t}}xr=void 0,t&&t.enter()},ur||Rt||Ar||!Lr||!$r?Fr&&Fr.resolve?(Or=Fr.resolve(void 0),Ur=Or.then,Pr=function(){Ur.call(Or,_r)}):Pr=Rt?function(){Cr.nextTick(_r)}:function(){Rr.call(n,_r)}:(kr=!0,Er=$r.createTextNode(""),new Lr(_r).observe(Er,{characterData:!0}),Pr=function(){Er.data=kr=!kr}));var Dr,Br,qr,Mr,Gr=Nr||function(t){var e={fn:t,next:void 0};xr&&(xr.next=e),Sr||(Sr=e,Pr()),xr=e},zr=function(t){var e,r;this.promise=new t((function(t,n){if(void 0!==e||void 0!==r)throw TypeError("Bad Promise constructor");e=t,r=n})),this.resolve=_e(e),this.reject=_e(r)},Vr={f:function(t){return new zr(t)}},Kr=function(t,e){if(E(t),m(e)&&e.constructor===t)return e;var r=Vr.f(t);return(0,r.resolve)(e),r.promise},Wr=function(t){try{return{error:!1,value:t()}}catch(t){return{error:!0,value:t}}},Hr=jr.set,Jr=zt("species"),Yr="Promise",Xr=tt.get,Zr=tt.set,Qr=tt.getterFor(Yr),tn=Ne,en=n.TypeError,rn=n.document,nn=n.process,an=at("fetch"),on=Vr.f,sn=on,un=!!(rn&&rn.createEvent&&n.dispatchEvent),cn="function"==typeof PromiseRejectionEvent,ln=jt(Yr,(function(){if(!(F(tn)!==String(tn))){if(66===Nt)return!0;if(!Rt&&!cn)return!0}if(Nt>=51&&/native code/.test(tn))return!1;var t=tn.resolve(1),e=function(t){t((function(){}),(function(){}))};return(t.constructor={})[Jr]=e,!(t.then((function(){}))instanceof e)})),fn=ln||!function(t,e){if(!e&&!er)return!1;var r=!1;try{var n={};n[tr]=function(){return{next:function(){return{done:r=!0}}}},t(n)}catch(t){}return r}((function(t){tn.all(t).catch((function(){}))})),hn=function(t){var e;return!(!m(t)||"function"!=typeof(e=t.then))&&e},pn=function(t,e){if(!t.notified){t.notified=!0;var r=t.reactions;Gr((function(){for(var n=t.value,a=1==t.state,o=0;r.length>o;){var i,s,u,c=r[o++],l=a?c.ok:c.fail,f=c.resolve,h=c.reject,p=c.domain;try{l?(a||(2===t.rejection&&gn(t),t.rejection=1),!0===l?i=n:(p&&p.enter(),i=l(n),p&&(p.exit(),u=!0)),i===c.promise?h(en("Promise-chain cycle")):(s=hn(i))?s.call(i,f,h):f(i)):h(n)}catch(t){p&&!u&&p.exit(),h(t)}}t.reactions=[],t.notified=!1,e&&!t.rejection&&vn(t)}))}},dn=function(t,e,r){var a,o;un?((a=rn.createEvent("Event")).promise=e,a.reason=r,a.initEvent(t,!1,!0),n.dispatchEvent(a)):a={promise:e,reason:r},!cn&&(o=n["on"+t])?o(a):"unhandledrejection"===t&&function(t,e){var r=n.console;r&&r.error&&(1===arguments.length?r.error(t):r.error(t,e))}("Unhandled promise rejection",r)},vn=function(t){Hr.call(n,(function(){var e,r=t.facade,n=t.value;if(mn(t)&&(e=Wr((function(){Rt?nn.emit("unhandledRejection",n,r):dn("unhandledrejection",r,n)})),t.rejection=Rt||mn(t)?2:1,e.error))throw e.value}))},mn=function(t){return 1!==t.rejection&&!t.parent},gn=function(t){Hr.call(n,(function(){var e=t.facade;Rt?nn.emit("rejectionHandled",e):dn("rejectionhandled",e,t.value)}))},bn=function(t,e,r){return function(n){t(e,n,r)}},yn=function(t,e,r){t.done||(t.done=!0,r&&(t=r),t.value=e,t.state=2,pn(t,!0))},wn=function(t,e,r){if(!t.done){t.done=!0,r&&(t=r);try{if(t.facade===e)throw en("Promise can't be resolved itself");var n=hn(e);n?Gr((function(){var r={done:!1};try{n.call(e,bn(wn,r,t),bn(yn,r,t))}catch(e){yn(r,e,t)}})):(t.value=e,t.state=1,pn(t,!1))}catch(e){yn({done:!1},e,t)}}};ln&&(tn=function(t){ze(this,tn,Yr),_e(t),Dr.call(this);var e=Xr(this);try{t(bn(wn,e),bn(yn,e))}catch(t){yn(e,t)}},(Dr=function(t){Zr(this,{type:Yr,done:!1,notified:!1,parent:!1,reactions:[],rejection:!1,state:0,value:void 0})}).prototype=De(tn.prototype,{then:function(t,e){var r,n,a,o=Qr(this),i=on((r=tn,void 0===(a=E(this).constructor)||null==(n=E(a)[sr])?r:_e(n)));return i.ok="function"!=typeof t||t,i.fail="function"==typeof e&&e,i.domain=Rt?nn.domain:void 0,o.parent=!0,o.reactions.push(i),0!=o.state&&pn(o,!1),i.promise},catch:function(t){return this.then(void 0,t)}}),Br=function(){var t=new Dr,e=Xr(t);this.promise=t,this.resolve=bn(wn,e),this.reject=bn(yn,e)},Vr.f=on=function(t){return t===tn||t===qr?new Br(t):sn(t)},"function"==typeof Ne&&(Mr=Ne.prototype.then,et(Ne.prototype,"then",(function(t,e){var r=this;return new tn((function(t,e){Mr.call(r,t,e)})).then(t,e)}),{unsafe:!0}),"function"==typeof an&&Tt({global:!0,enumerable:!0,forced:!0},{fetch:function(t){return Kr(tn,an.apply(n,arguments))}}))),Tt({global:!0,wrap:!0,forced:ln},{Promise:tn}),Me(tn,Yr,!1),function(t){var e=at(t),r=U.f;o&&e&&!e[Ge]&&r(e,Ge,{configurable:!0,get:function(){return this}})}(Yr),qr=at(Yr),Tt({target:Yr,stat:!0,forced:ln},{reject:function(t){var e=on(this);return e.reject.call(void 0,t),e.promise}}),Tt({target:Yr,stat:!0,forced:ln},{resolve:function(t){return Kr(this,t)}}),Tt({target:Yr,stat:!0,forced:fn},{all:function(t){var e=this,r=on(e),n=r.resolve,a=r.reject,o=Wr((function(){var r=_e(e.resolve),o=[],i=0,s=1;Qe(t,(function(t){var u=i++,c=!1;o.push(void 0),s++,r.call(e,t).then((function(t){c||(c=!0,o[u]=t,--s||n(o))}),a)})),--s||n(o)}));return o.error&&a(o.value),r.promise},race:function(t){var e=this,r=on(e),n=r.reject,a=Wr((function(){var a=_e(e.resolve);Qe(t,(function(t){a.call(e,t).then(r.resolve,n)}))}));return a.error&&n(a.value),r.promise}});var _n=a((function(){Vt(1)}));Tt({target:"Object",stat:!0,forced:_n},{keys:function(t){return Vt(se(t))}});var Sn=yt.f,xn={}.toString,Pn="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],kn={f:function(t){return Pn&&"[object Window]"==xn.call(t)?function(t){try{return Sn(t)}catch(t){return Pn.slice()}}(t):Sn(v(t))}},En={f:zt},On=U.f,Un=ke.forEach,jn=z("hidden"),An=zt("toPrimitive"),Tn=tt.set,Rn=tt.getterFor("Symbol"),Ln=Object.prototype,$n=n.Symbol,Cn=at("JSON","stringify"),Fn=k.f,In=U.f,Nn=kn.f,Dn=u.f,Bn=D("symbols"),qn=D("op-symbols"),Mn=D("string-to-symbol-registry"),Gn=D("symbol-to-string-registry"),zn=D("wks"),Vn=n.QObject,Kn=!Vn||!Vn.prototype||!Vn.prototype.findChild,Wn=o&&a((function(){return 7!=Zt(In({},"a",{get:function(){return In(this,"a",{value:7}).a}})).a}))?function(t,e,r){var n=Fn(Ln,e);n&&delete Ln[e],In(t,e,r),n&&t!==Ln&&In(Ln,e,n)}:In,Hn=function(t,e){var r=Bn[t]=Zt($n.prototype);return Tn(r,{type:"Symbol",tag:t,description:e}),o||(r.description=e),r},Jn=Bt?function(t){return"symbol"==typeof t}:function(t){return Object(t)instanceof $n},Yn=function(t,e,r){t===Ln&&Yn(qn,e,r),E(t);var n=g(e,!0);return E(r),y(Bn,n)?(r.enumerable?(y(t,jn)&&t[jn][n]&&(t[jn][n]=!1),r=Zt(r,{enumerable:c(0,!1)})):(y(t,jn)||In(t,jn,c(1,{})),t[jn][n]=!0),Wn(t,n,r)):In(t,n,r)},Xn=function(t,e){E(t);var r=v(e),n=Vt(r).concat(ea(r));return Un(n,(function(e){o&&!Zn.call(r,e)||Yn(t,e,r[e])})),t},Zn=function(t){var e=g(t,!0),r=Dn.call(this,e);return!(this===Ln&&y(Bn,e)&&!y(qn,e))&&(!(r||!y(this,e)||!y(Bn,e)||y(this,jn)&&this[jn][e])||r)},Qn=function(t,e){var r=v(t),n=g(e,!0);if(r!==Ln||!y(Bn,n)||y(qn,n)){var a=Fn(r,n);return!a||!y(Bn,n)||y(r,jn)&&r[jn][n]||(a.enumerable=!0),a}},ta=function(t){var e=Nn(v(t)),r=[];return Un(e,(function(t){y(Bn,t)||y(V,t)||r.push(t)})),r},ea=function(t){var e=t===Ln,r=Nn(e?qn:v(t)),n=[];return Un(r,(function(t){!y(Bn,t)||e&&!y(Ln,t)||n.push(Bn[t])})),n};if(Dt||(et(($n=function(){if(this instanceof $n)throw TypeError("Symbol is not a constructor");var t=arguments.length&&void 0!==arguments[0]?String(arguments[0]):void 0,e=M(t),r=function(t){this===Ln&&r.call(qn,t),y(this,jn)&&y(this[jn],e)&&(this[jn][e]=!1),Wn(this,e,c(1,t))};return o&&Kn&&Wn(Ln,e,{configurable:!0,set:r}),Hn(e,t)}).prototype,"toString",(function(){return Rn(this).tag})),et($n,"withoutSetter",(function(t){return Hn(M(t),t)})),u.f=Zn,U.f=Yn,k.f=Qn,yt.f=kn.f=ta,wt.f=ea,En.f=function(t){return Hn(zt(t),t)},o&&(In($n.prototype,"description",{configurable:!0,get:function(){return Rn(this).description}}),et(Ln,"propertyIsEnumerable",Zn,{unsafe:!0}))),Tt({global:!0,wrap:!0,forced:!Dt,sham:!Dt},{Symbol:$n}),Un(Vt(zn),(function(t){!function(t){var e=rt.Symbol||(rt.Symbol={});y(e,t)||On(e,t,{value:En.f(t)})}(t)})),Tt({target:"Symbol",stat:!0,forced:!Dt},{for:function(t){var e=String(t);if(y(Mn,e))return Mn[e];var r=$n(e);return Mn[e]=r,Gn[r]=e,r},keyFor:function(t){if(!Jn(t))throw TypeError(t+" is not a symbol");if(y(Gn,t))return Gn[t]},useSetter:function(){Kn=!0},useSimple:function(){Kn=!1}}),Tt({target:"Object",stat:!0,forced:!Dt,sham:!o},{create:function(t,e){return void 0===e?Zt(t):Xn(Zt(t),e)},defineProperty:Yn,defineProperties:Xn,getOwnPropertyDescriptor:Qn}),Tt({target:"Object",stat:!0,forced:!Dt},{getOwnPropertyNames:ta,getOwnPropertySymbols:ea}),Tt({target:"Object",stat:!0,forced:a((function(){wt.f(1)}))},{getOwnPropertySymbols:function(t){return wt.f(se(t))}}),Cn){var ra=!Dt||a((function(){var t=$n();return"[null]"!=Cn([t])||"{}"!=Cn({a:t})||"{}"!=Cn(Object(t))}));Tt({target:"JSON",stat:!0,forced:ra},{stringify:function(t,e,r){for(var n,a=[t],o=1;arguments.length>o;)a.push(arguments[o++]);if(n=e,(m(e)||void 0!==t)&&!Jn(t))return ie(e)||(e=function(t,e){if("function"==typeof n&&(e=n.call(this,t,e)),!Jn(e))return e}),a[1]=e,Cn.apply(null,a)}})}$n.prototype[An]||j($n.prototype,An,$n.prototype.valueOf),Me($n,"Symbol"),V[jn]=!0;var na=ke.filter,aa=he("filter");Tt({target:"Array",proto:!0,forced:!aa},{filter:function(t){return na(this,t,arguments.length>1?arguments[1]:void 0)}});var oa=k.f,ia=a((function(){oa(1)}));Tt({target:"Object",stat:!0,forced:!o||ia,sham:!o},{getOwnPropertyDescriptor:function(t,e){return oa(v(t),e)}});var sa={CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0},ua=function(t,e){var r=[][t];return!!r&&a((function(){r.call(null,e||function(){throw 1},1)}))},ca=ke.forEach,la=ua("forEach")?[].forEach:function(t){return ca(this,t,arguments.length>1?arguments[1]:void 0)};for(var fa in sa){var ha=n[fa],pa=ha&&ha.prototype;if(pa&&pa.forEach!==la)try{j(pa,"forEach",la)}catch(t){pa.forEach=la}}Tt({target:"Object",stat:!0,sham:!o},{getOwnPropertyDescriptors:function(t){for(var e,r,n=v(t),a=k.f,o=_t(n),i={},s=0;o.length>s;)void 0!==(r=a(n,e=o[s++]))&&ue(i,e,r);return i}});var da=Object.assign,va=Object.defineProperty,ma=!da||a((function(){if(o&&1!==da({b:1},da(va({},"a",{enumerable:!0,get:function(){va(this,"b",{value:3,enumerable:!1})}}),{b:2})).b)return!0;var t={},e={},r=Symbol();return t[r]=7,"abcdefghijklmnopqrst".split("").forEach((function(t){e[t]=t})),7!=da({},t)[r]||"abcdefghijklmnopqrst"!=Vt(da({},e)).join("")}))?function(t,e){for(var r=se(t),n=arguments.length,a=1,i=wt.f,s=u.f;n>a;)for(var c,l=p(arguments[a++]),f=i?Vt(l).concat(i(l)):Vt(l),h=f.length,d=0;h>d;)c=f[d++],o&&!s.call(l,c)||(r[c]=l[c]);return r}:da;Tt({target:"Object",stat:!0,forced:Object.assign!==ma},{assign:ma});var ga=function(){var t=E(this),e="";return t.global&&(e+="g"),t.ignoreCase&&(e+="i"),t.multiline&&(e+="m"),t.dotAll&&(e+="s"),t.unicode&&(e+="u"),t.sticky&&(e+="y"),e};function ba(t,e){return RegExp(t,e)}var ya,wa,_a={UNSUPPORTED_Y:a((function(){var t=ba("a","y");return t.lastIndex=2,null!=t.exec("abcd")})),BROKEN_CARET:a((function(){var t=ba("^r","gy");return t.lastIndex=2,null!=t.exec("str")}))},Sa=RegExp.prototype.exec,xa=D("native-string-replace",String.prototype.replace),Pa=Sa,ka=(ya=/a/,wa=/b*/g,Sa.call(ya,"a"),Sa.call(wa,"a"),0!==ya.lastIndex||0!==wa.lastIndex),Ea=_a.UNSUPPORTED_Y||_a.BROKEN_CARET,Oa=void 0!==/()??/.exec("")[1];(ka||Oa||Ea)&&(Pa=function(t){var e,r,n,a,o=this,i=Ea&&o.sticky,s=ga.call(o),u=o.source,c=0,l=t;return i&&(-1===(s=s.replace("y","")).indexOf("g")&&(s+="g"),l=String(t).slice(o.lastIndex),o.lastIndex>0&&(!o.multiline||o.multiline&&"\n"!==t[o.lastIndex-1])&&(u="(?: "+u+")",l=" "+l,c++),r=new RegExp("^(?:"+u+")",s)),Oa&&(r=new RegExp("^"+u+"$(?!\\s)",s)),ka&&(e=o.lastIndex),n=Sa.call(i?r:o,l),i?n?(n.input=n.input.slice(c),n[0]=n[0].slice(c),n.index=o.lastIndex,o.lastIndex+=n[0].length):o.lastIndex=0:ka&&n&&(o.lastIndex=o.global?n.index+n[0].length:e),Oa&&n&&n.length>1&&xa.call(n[0],r,(function(){for(a=1;a<arguments.length-2;a++)void 0===arguments[a]&&(n[a]=void 0)})),n});var Ua=Pa;Tt({target:"RegExp",proto:!0,forced:/./.exec!==Ua},{exec:Ua});var ja=zt("species"),Aa=!a((function(){var t=/./;return t.exec=function(){var t=[];return t.groups={a:"7"},t},"7"!=="".replace(t,"$<a>")})),Ta="$0"==="a".replace(/./,"$0"),Ra=zt("replace"),La=!!/./[Ra]&&""===/./[Ra]("a","$0"),$a=!a((function(){var t=/(?:)/,e=t.exec;t.exec=function(){return e.apply(this,arguments)};var r="ab".split(t);return 2!==r.length||"a"!==r[0]||"b"!==r[1]})),Ca=Object.is||function(t,e){return t===e?0!==t||1/t==1/e:t!=t&&e!=e};!function(t,e,r,n){var o=zt(t),i=!a((function(){var e={};return e[o]=function(){return 7},7!=""[t](e)})),s=i&&!a((function(){var e=!1,r=/a/;return"split"===t&&((r={}).constructor={},r.constructor[ja]=function(){return r},r.flags="",r[o]=/./[o]),r.exec=function(){return e=!0,null},r[o](""),!e}));if(!i||!s||"replace"===t&&(!Aa||!Ta||La)||"split"===t&&!$a){var u=/./[o],c=r(o,""[t],(function(t,e,r,n,a){return e.exec===RegExp.prototype.exec?i&&!a?{done:!0,value:u.call(e,r,n)}:{done:!0,value:t.call(r,e,n)}:{done:!1}}),{REPLACE_KEEPS_$0:Ta,REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE:La}),l=c[0],f=c[1];et(String.prototype,t,l),et(RegExp.prototype,o,2==e?function(t,e){return f.call(t,this,e)}:function(t){return f.call(t,this)})}n&&j(RegExp.prototype[o],"sham",!0)}("search",1,(function(t,e,r){return[function(e){var r=d(this),n=null==e?void 0:e[t];return void 0!==n?n.call(e,r):new RegExp(e)[t](String(r))},function(t){var n=r(e,t,this);if(n.done)return n.value;var a=E(t),o=String(this),i=a.lastIndex;Ca(i,0)||(a.lastIndex=0);var s=function(t,e){var r=t.exec;if("function"==typeof r){var n=r.call(t,e);if("object"!=typeof n)throw TypeError("RegExp exec method returned something other than an Object or null");return n}if("RegExp"!==f(t))throw TypeError("RegExp#exec called on incompatible receiver");return Ua.call(t,e)}(a,o);return Ca(a.lastIndex,i)||(a.lastIndex=i),null===s?-1:s.index}]}));var Fa,Ia,Na,Da=!a((function(){function t(){}return t.prototype.constructor=null,Object.getPrototypeOf(new t)!==t.prototype})),Ba=z("IE_PROTO"),qa=Object.prototype,Ma=Da?Object.getPrototypeOf:function(t){return t=se(t),y(t,Ba)?t[Ba]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?qa:null},Ga=zt("iterator"),za=!1;[].keys&&("next"in(Na=[].keys())?(Ia=Ma(Ma(Na)))!==Object.prototype&&(Fa=Ia):za=!0),(null==Fa||a((function(){var t={};return Fa[Ga].call(t)!==t})))&&(Fa={}),y(Fa,Ga)||j(Fa,Ga,(function(){return this}));var Va={IteratorPrototype:Fa,BUGGY_SAFARI_ITERATORS:za},Ka=Va.IteratorPrototype,Wa=function(){return this},Ha=function(t,e,r){var n=e+" Iterator";return t.prototype=Zt(Ka,{next:c(1,r)}),Me(t,n,!1),Ve[n]=Wa,t},Ja=Object.setPrototypeOf||("__proto__"in{}?function(){var t,e=!1,r={};try{(t=Object.getOwnPropertyDescriptor(Object.prototype,"__proto__").set).call(r,[]),e=r instanceof Array}catch(t){}return function(r,n){return E(r),function(t){if(!m(t)&&null!==t)throw TypeError("Can't set "+String(t)+" as a prototype")}(n),e?t.call(r,n):r.__proto__=n,r}}():void 0),Ya=Va.IteratorPrototype,Xa=Va.BUGGY_SAFARI_ITERATORS,Za=zt("iterator"),Qa=function(){return this},to=function(t,e,r,n,a,o,i){Ha(r,e,n);var s,u,c,l=function(t){if(t===a&&v)return v;if(!Xa&&t in p)return p[t];switch(t){case"keys":case"values":case"entries":return function(){return new r(this,t)}}return function(){return new r(this)}},f=e+" Iterator",h=!1,p=t.prototype,d=p[Za]||p["@@iterator"]||a&&p[a],v=!Xa&&d||l(a),m="Array"==e&&p.entries||d;if(m&&(s=Ma(m.call(new t)),Ya!==Object.prototype&&s.next&&(Ma(s)!==Ya&&(Ja?Ja(s,Ya):"function"!=typeof s[Za]&&j(s,Za,Qa)),Me(s,f,!0))),"values"==a&&d&&"values"!==d.name&&(h=!0,v=function(){return d.call(this)}),p[Za]!==v&&j(p,Za,v),Ve[e]=v,a)if(u={values:l("values"),keys:o?v:l("keys"),entries:l("entries")},i)for(c in u)(Xa||h||!(c in p))&&et(p,c,u[c]);else Tt({target:e,proto:!0,forced:Xa||h},u);return u},eo=tt.set,ro=tt.getterFor("Array Iterator"),no=to(Array,"Array",(function(t,e){eo(this,{type:"Array Iterator",target:v(t),index:0,kind:e})}),(function(){var t=ro(this),e=t.target,r=t.kind,n=t.index++;return!e||n>=e.length?(t.target=void 0,{value:void 0,done:!0}):"keys"==r?{value:n,done:!1}:"values"==r?{value:e[n],done:!1}:{value:[n,e[n]],done:!1}}),"values");Ve.Arguments=Ve.Array,ee("keys"),ee("values"),ee("entries");var ao=function(t){return function(e,r){var n,a,o=String(d(e)),i=st(r),s=o.length;return i<0||i>=s?t?"":void 0:(n=o.charCodeAt(i))<55296||n>56319||i+1===s||(a=o.charCodeAt(i+1))<56320||a>57343?t?o.charAt(i):n:t?o.slice(i,i+2):a-56320+(n-55296<<10)+65536}},oo={codeAt:ao(!1),charAt:ao(!0)},io=oo.charAt,so=tt.set,uo=tt.getterFor("String Iterator");to(String,"String",(function(t){so(this,{type:"String Iterator",string:String(t),index:0})}),(function(){var t,e=uo(this),r=e.string,n=e.index;return n>=r.length?{value:void 0,done:!0}:(t=io(r,n),e.index+=t.length,{value:t,done:!1})}));var co=zt("iterator"),lo=zt("toStringTag"),fo=no.values;for(var ho in sa){var po=n[ho],vo=po&&po.prototype;if(vo){if(vo[co]!==fo)try{j(vo,co,fo)}catch(t){vo[co]=fo}if(vo[lo]||j(vo,lo,ho),sa[ho])for(var mo in no)if(vo[mo]!==no[mo])try{j(vo,mo,no[mo])}catch(t){vo[mo]=no[mo]}}}var go=zt("iterator"),bo=!a((function(){var t=new URL("b?a=1&b=2&c=3","http://a"),e=t.searchParams,r="";return t.pathname="c%20d",e.forEach((function(t,n){e.delete("b"),r+=n+t})),!e.sort||"http://a/c%20d?a=1&c=3"!==t.href||"3"!==e.get("c")||"a=1"!==String(new URLSearchParams("?a=1"))||!e[go]||"a"!==new URL("https://a@b").username||"b"!==new URLSearchParams(new URLSearchParams("a=b")).get("a")||"xn--e1aybc"!==new URL("http://тест").host||"#%D0%B1"!==new URL("http://a#б").hash||"a1c3"!==r||"x"!==new URL("http://x",void 0).host})),yo=function(t,e,r,n){try{return n?e(E(r)[0],r[1]):e(r)}catch(e){throw Xe(t),e}},wo=function(t){var e,r,n,a,o,i,s=se(t),u="function"==typeof this?this:Array,c=arguments.length,l=c>1?arguments[1]:void 0,f=void 0!==l,h=Ye(s),p=0;if(f&&(l=Se(l,c>2?arguments[2]:void 0,2)),null==h||u==Array&&He(h))for(r=new u(e=ct(s.length));e>p;p++)i=f?l(s[p],p):s[p],ue(r,p,i);else for(o=(a=h.call(s)).next,r=new u;!(n=o.call(a)).done;p++)i=f?yo(a,l,[n.value,p],!0):n.value,ue(r,p,i);return r.length=p,r},_o=/[^\0-\u007E]/,So=/[.\u3002\uFF0E\uFF61]/g,xo="Overflow: input needs wider integers to process",Po=Math.floor,ko=String.fromCharCode,Eo=function(t){return t+22+75*(t<26)},Oo=function(t,e,r){var n=0;for(t=r?Po(t/700):t>>1,t+=Po(t/e);t>455;n+=36)t=Po(t/35);return Po(n+36*t/(t+38))},Uo=function(t){var e,r,n=[],a=(t=function(t){for(var e=[],r=0,n=t.length;r<n;){var a=t.charCodeAt(r++);if(a>=55296&&a<=56319&&r<n){var o=t.charCodeAt(r++);56320==(64512&o)?e.push(((1023&a)<<10)+(1023&o)+65536):(e.push(a),r--)}else e.push(a)}return e}(t)).length,o=128,i=0,s=72;for(e=0;e<t.length;e++)(r=t[e])<128&&n.push(ko(r));var u=n.length,c=u;for(u&&n.push("-");c<a;){var l=2147483647;for(e=0;e<t.length;e++)(r=t[e])>=o&&r<l&&(l=r);var f=c+1;if(l-o>Po((2147483647-i)/f))throw RangeError(xo);for(i+=(l-o)*f,o=l,e=0;e<t.length;e++){if((r=t[e])<o&&++i>2147483647)throw RangeError(xo);if(r==o){for(var h=i,p=36;;p+=36){var d=p<=s?1:p>=s+26?26:p-s;if(h<d)break;var v=h-d,m=36-d;n.push(ko(Eo(d+v%m))),h=Po(v/m)}n.push(ko(Eo(h))),s=Oo(i,f,c==u),i=0,++c}}++i,++o}return n.join("")},jo=function(t){var e=Ye(t);if("function"!=typeof e)throw TypeError(String(t)+" is not iterable");return E(e.call(t))},Ao=at("fetch"),To=at("Headers"),Ro=zt("iterator"),Lo=tt.set,$o=tt.getterFor("URLSearchParams"),Co=tt.getterFor("URLSearchParamsIterator"),Fo=/\+/g,Io=Array(4),No=function(t){return Io[t-1]||(Io[t-1]=RegExp("((?:%[\\da-f]{2}){"+t+"})","gi"))},Do=function(t){try{return decodeURIComponent(t)}catch(e){return t}},Bo=function(t){var e=t.replace(Fo," "),r=4;try{return decodeURIComponent(e)}catch(t){for(;r;)e=e.replace(No(r--),Do);return e}},qo=/[!'()~]|%20/g,Mo={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+"},Go=function(t){return Mo[t]},zo=function(t){return encodeURIComponent(t).replace(qo,Go)},Vo=function(t,e){if(e)for(var r,n,a=e.split("&"),o=0;o<a.length;)(r=a[o++]).length&&(n=r.split("="),t.push({key:Bo(n.shift()),value:Bo(n.join("="))}))},Ko=function(t){this.entries.length=0,Vo(this.entries,t)},Wo=function(t,e){if(t<e)throw TypeError("Not enough arguments")},Ho=Ha((function(t,e){Lo(this,{type:"URLSearchParamsIterator",iterator:jo($o(t).entries),kind:e})}),"Iterator",(function(){var t=Co(this),e=t.kind,r=t.iterator.next(),n=r.value;return r.done||(r.value="keys"===e?n.key:"values"===e?n.value:[n.key,n.value]),r})),Jo=function(){ze(this,Jo,"URLSearchParams");var t,e,r,n,a,o,i,s,u,c=arguments.length>0?arguments[0]:void 0,l=this,f=[];if(Lo(l,{type:"URLSearchParams",entries:f,updateURL:function(){},updateSearchParams:Ko}),void 0!==c)if(m(c))if("function"==typeof(t=Ye(c)))for(r=(e=t.call(c)).next;!(n=r.call(e)).done;){if((i=(o=(a=jo(E(n.value))).next).call(a)).done||(s=o.call(a)).done||!o.call(a).done)throw TypeError("Expected sequence with length 2");f.push({key:i.value+"",value:s.value+""})}else for(u in c)y(c,u)&&f.push({key:u,value:c[u]+""});else Vo(f,"string"==typeof c?"?"===c.charAt(0)?c.slice(1):c:c+"")},Yo=Jo.prototype;De(Yo,{append:function(t,e){Wo(arguments.length,2);var r=$o(this);r.entries.push({key:t+"",value:e+""}),r.updateURL()},delete:function(t){Wo(arguments.length,1);for(var e=$o(this),r=e.entries,n=t+"",a=0;a<r.length;)r[a].key===n?r.splice(a,1):a++;e.updateURL()},get:function(t){Wo(arguments.length,1);for(var e=$o(this).entries,r=t+"",n=0;n<e.length;n++)if(e[n].key===r)return e[n].value;return null},getAll:function(t){Wo(arguments.length,1);for(var e=$o(this).entries,r=t+"",n=[],a=0;a<e.length;a++)e[a].key===r&&n.push(e[a].value);return n},has:function(t){Wo(arguments.length,1);for(var e=$o(this).entries,r=t+"",n=0;n<e.length;)if(e[n++].key===r)return!0;return!1},set:function(t,e){Wo(arguments.length,1);for(var r,n=$o(this),a=n.entries,o=!1,i=t+"",s=e+"",u=0;u<a.length;u++)(r=a[u]).key===i&&(o?a.splice(u--,1):(o=!0,r.value=s));o||a.push({key:i,value:s}),n.updateURL()},sort:function(){var t,e,r,n=$o(this),a=n.entries,o=a.slice();for(a.length=0,r=0;r<o.length;r++){for(t=o[r],e=0;e<r;e++)if(a[e].key>t.key){a.splice(e,0,t);break}e===r&&a.push(t)}n.updateURL()},forEach:function(t){for(var e,r=$o(this).entries,n=Se(t,arguments.length>1?arguments[1]:void 0,3),a=0;a<r.length;)n((e=r[a++]).value,e.key,this)},keys:function(){return new Ho(this,"keys")},values:function(){return new Ho(this,"values")},entries:function(){return new Ho(this,"entries")}},{enumerable:!0}),et(Yo,Ro,Yo.entries),et(Yo,"toString",(function(){for(var t,e=$o(this).entries,r=[],n=0;n<e.length;)t=e[n++],r.push(zo(t.key)+"="+zo(t.value));return r.join("&")}),{enumerable:!0}),Me(Jo,"URLSearchParams"),Tt({global:!0,forced:!bo},{URLSearchParams:Jo}),bo||"function"!=typeof Ao||"function"!=typeof To||Tt({global:!0,enumerable:!0,forced:!0},{fetch:function(t){var e,r,n,a=[t];return arguments.length>1&&(m(e=arguments[1])&&(r=e.body,"URLSearchParams"===Fe(r)&&((n=e.headers?new To(e.headers):new To).has("content-type")||n.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"),e=Zt(e,{body:c(0,String(r)),headers:c(0,n)}))),a.push(e)),Ao.apply(this,a)}});var Xo,Zo={URLSearchParams:Jo,getState:$o},Qo=oo.codeAt,ti=n.URL,ei=Zo.URLSearchParams,ri=Zo.getState,ni=tt.set,ai=tt.getterFor("URL"),oi=Math.floor,ii=Math.pow,si=/[A-Za-z]/,ui=/[\d+-.A-Za-z]/,ci=/\d/,li=/^(0x|0X)/,fi=/^[0-7]+$/,hi=/^\d+$/,pi=/^[\dA-Fa-f]+$/,di=/[\u0000\t\u000A\u000D #%/:?@[\\]]/,vi=/[\u0000\t\u000A\u000D #/:?@[\\]]/,mi=/^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g,gi=/[\t\u000A\u000D]/g,bi=function(t,e){var r,n,a;if("["==e.charAt(0)){if("]"!=e.charAt(e.length-1))return"Invalid host";if(!(r=wi(e.slice(1,-1))))return"Invalid host";t.host=r}else if(Ui(t)){if(e=function(t){var e,r,n=[],a=t.toLowerCase().replace(So,".").split(".");for(e=0;e<a.length;e++)r=a[e],n.push(_o.test(r)?"xn--"+Uo(r):r);return n.join(".")}(e),di.test(e))return"Invalid host";if(null===(r=yi(e)))return"Invalid host";t.host=r}else{if(vi.test(e))return"Invalid host";for(r="",n=wo(e),a=0;a<n.length;a++)r+=Ei(n[a],Si);t.host=r}},yi=function(t){var e,r,n,a,o,i,s,u=t.split(".");if(u.length&&""==u[u.length-1]&&u.pop(),(e=u.length)>4)return t;for(r=[],n=0;n<e;n++){if(""==(a=u[n]))return t;if(o=10,a.length>1&&"0"==a.charAt(0)&&(o=li.test(a)?16:8,a=a.slice(8==o?1:2)),""===a)i=0;else{if(!(10==o?hi:8==o?fi:pi).test(a))return t;i=parseInt(a,o)}r.push(i)}for(n=0;n<e;n++)if(i=r[n],n==e-1){if(i>=ii(256,5-e))return null}else if(i>255)return null;for(s=r.pop(),n=0;n<r.length;n++)s+=r[n]*ii(256,3-n);return s},wi=function(t){var e,r,n,a,o,i,s,u=[0,0,0,0,0,0,0,0],c=0,l=null,f=0,h=function(){return t.charAt(f)};if(":"==h()){if(":"!=t.charAt(1))return;f+=2,l=++c}for(;h();){if(8==c)return;if(":"!=h()){for(e=r=0;r<4&&pi.test(h());)e=16*e+parseInt(h(),16),f++,r++;if("."==h()){if(0==r)return;if(f-=r,c>6)return;for(n=0;h();){if(a=null,n>0){if(!("."==h()&&n<4))return;f++}if(!ci.test(h()))return;for(;ci.test(h());){if(o=parseInt(h(),10),null===a)a=o;else{if(0==a)return;a=10*a+o}if(a>255)return;f++}u[c]=256*u[c]+a,2!=++n&&4!=n||c++}if(4!=n)return;break}if(":"==h()){if(f++,!h())return}else if(h())return;u[c++]=e}else{if(null!==l)return;f++,l=++c}}if(null!==l)for(i=c-l,c=7;0!=c&&i>0;)s=u[c],u[c--]=u[l+i-1],u[l+--i]=s;else if(8!=c)return;return u},_i=function(t){var e,r,n,a;if("number"==typeof t){for(e=[],r=0;r<4;r++)e.unshift(t%256),t=oi(t/256);return e.join(".")}if("object"==typeof t){for(e="",n=function(t){for(var e=null,r=1,n=null,a=0,o=0;o<8;o++)0!==t[o]?(a>r&&(e=n,r=a),n=null,a=0):(null===n&&(n=o),++a);return a>r&&(e=n,r=a),e}(t),r=0;r<8;r++)a&&0===t[r]||(a&&(a=!1),n===r?(e+=r?":":"::",a=!0):(e+=t[r].toString(16),r<7&&(e+=":")));return"["+e+"]"}return t},Si={},xi=ma({},Si,{" ":1,'"':1,"<":1,">":1,"`":1}),Pi=ma({},xi,{"#":1,"?":1,"{":1,"}":1}),ki=ma({},Pi,{"/":1,":":1,";":1,"=":1,"@":1,"[":1,"\\":1,"]":1,"^":1,"|":1}),Ei=function(t,e){var r=Qo(t,0);return r>32&&r<127&&!y(e,t)?t:encodeURIComponent(t)},Oi={ftp:21,file:null,http:80,https:443,ws:80,wss:443},Ui=function(t){return y(Oi,t.scheme)},ji=function(t){return""!=t.username||""!=t.password},Ai=function(t){return!t.host||t.cannotBeABaseURL||"file"==t.scheme},Ti=function(t,e){var r;return 2==t.length&&si.test(t.charAt(0))&&(":"==(r=t.charAt(1))||!e&&"|"==r)},Ri=function(t){var e;return t.length>1&&Ti(t.slice(0,2))&&(2==t.length||"/"===(e=t.charAt(2))||"\\"===e||"?"===e||"#"===e)},Li=function(t){var e=t.path,r=e.length;!r||"file"==t.scheme&&1==r&&Ti(e[0],!0)||e.pop()},$i=function(t){return"."===t||"%2e"===t.toLowerCase()},Ci={},Fi={},Ii={},Ni={},Di={},Bi={},qi={},Mi={},Gi={},zi={},Vi={},Ki={},Wi={},Hi={},Ji={},Yi={},Xi={},Zi={},Qi={},ts={},es={},rs=function(t,e,r,n){var a,o,i,s,u,c=r||Ci,l=0,f="",h=!1,p=!1,d=!1;for(r||(t.scheme="",t.username="",t.password="",t.host=null,t.port=null,t.path=[],t.query=null,t.fragment=null,t.cannotBeABaseURL=!1,e=e.replace(mi,"")),e=e.replace(gi,""),a=wo(e);l<=a.length;){switch(o=a[l],c){case Ci:if(!o||!si.test(o)){if(r)return"Invalid scheme";c=Ii;continue}f+=o.toLowerCase(),c=Fi;break;case Fi:if(o&&(ui.test(o)||"+"==o||"-"==o||"."==o))f+=o.toLowerCase();else{if(":"!=o){if(r)return"Invalid scheme";f="",c=Ii,l=0;continue}if(r&&(Ui(t)!=y(Oi,f)||"file"==f&&(ji(t)||null!==t.port)||"file"==t.scheme&&!t.host))return;if(t.scheme=f,r)return void(Ui(t)&&Oi[t.scheme]==t.port&&(t.port=null));f="","file"==t.scheme?c=Hi:Ui(t)&&n&&n.scheme==t.scheme?c=Ni:Ui(t)?c=Mi:"/"==a[l+1]?(c=Di,l++):(t.cannotBeABaseURL=!0,t.path.push(""),c=Qi)}break;case Ii:if(!n||n.cannotBeABaseURL&&"#"!=o)return"Invalid scheme";if(n.cannotBeABaseURL&&"#"==o){t.scheme=n.scheme,t.path=n.path.slice(),t.query=n.query,t.fragment="",t.cannotBeABaseURL=!0,c=es;break}c="file"==n.scheme?Hi:Bi;continue;case Ni:if("/"!=o||"/"!=a[l+1]){c=Bi;continue}c=Gi,l++;break;case Di:if("/"==o){c=zi;break}c=Zi;continue;case Bi:if(t.scheme=n.scheme,o==Xo)t.username=n.username,t.password=n.password,t.host=n.host,t.port=n.port,t.path=n.path.slice(),t.query=n.query;else if("/"==o||"\\"==o&&Ui(t))c=qi;else if("?"==o)t.username=n.username,t.password=n.password,t.host=n.host,t.port=n.port,t.path=n.path.slice(),t.query="",c=ts;else{if("#"!=o){t.username=n.username,t.password=n.password,t.host=n.host,t.port=n.port,t.path=n.path.slice(),t.path.pop(),c=Zi;continue}t.username=n.username,t.password=n.password,t.host=n.host,t.port=n.port,t.path=n.path.slice(),t.query=n.query,t.fragment="",c=es}break;case qi:if(!Ui(t)||"/"!=o&&"\\"!=o){if("/"!=o){t.username=n.username,t.password=n.password,t.host=n.host,t.port=n.port,c=Zi;continue}c=zi}else c=Gi;break;case Mi:if(c=Gi,"/"!=o||"/"!=f.charAt(l+1))continue;l++;break;case Gi:if("/"!=o&&"\\"!=o){c=zi;continue}break;case zi:if("@"==o){h&&(f="%40"+f),h=!0,i=wo(f);for(var v=0;v<i.length;v++){var m=i[v];if(":"!=m||d){var g=Ei(m,ki);d?t.password+=g:t.username+=g}else d=!0}f=""}else if(o==Xo||"/"==o||"?"==o||"#"==o||"\\"==o&&Ui(t)){if(h&&""==f)return"Invalid authority";l-=wo(f).length+1,f="",c=Vi}else f+=o;break;case Vi:case Ki:if(r&&"file"==t.scheme){c=Yi;continue}if(":"!=o||p){if(o==Xo||"/"==o||"?"==o||"#"==o||"\\"==o&&Ui(t)){if(Ui(t)&&""==f)return"Invalid host";if(r&&""==f&&(ji(t)||null!==t.port))return;if(s=bi(t,f))return s;if(f="",c=Xi,r)return;continue}"["==o?p=!0:"]"==o&&(p=!1),f+=o}else{if(""==f)return"Invalid host";if(s=bi(t,f))return s;if(f="",c=Wi,r==Ki)return}break;case Wi:if(!ci.test(o)){if(o==Xo||"/"==o||"?"==o||"#"==o||"\\"==o&&Ui(t)||r){if(""!=f){var b=parseInt(f,10);if(b>65535)return"Invalid port";t.port=Ui(t)&&b===Oi[t.scheme]?null:b,f=""}if(r)return;c=Xi;continue}return"Invalid port"}f+=o;break;case Hi:if(t.scheme="file","/"==o||"\\"==o)c=Ji;else{if(!n||"file"!=n.scheme){c=Zi;continue}if(o==Xo)t.host=n.host,t.path=n.path.slice(),t.query=n.query;else if("?"==o)t.host=n.host,t.path=n.path.slice(),t.query="",c=ts;else{if("#"!=o){Ri(a.slice(l).join(""))||(t.host=n.host,t.path=n.path.slice(),Li(t)),c=Zi;continue}t.host=n.host,t.path=n.path.slice(),t.query=n.query,t.fragment="",c=es}}break;case Ji:if("/"==o||"\\"==o){c=Yi;break}n&&"file"==n.scheme&&!Ri(a.slice(l).join(""))&&(Ti(n.path[0],!0)?t.path.push(n.path[0]):t.host=n.host),c=Zi;continue;case Yi:if(o==Xo||"/"==o||"\\"==o||"?"==o||"#"==o){if(!r&&Ti(f))c=Zi;else if(""==f){if(t.host="",r)return;c=Xi}else{if(s=bi(t,f))return s;if("localhost"==t.host&&(t.host=""),r)return;f="",c=Xi}continue}f+=o;break;case Xi:if(Ui(t)){if(c=Zi,"/"!=o&&"\\"!=o)continue}else if(r||"?"!=o)if(r||"#"!=o){if(o!=Xo&&(c=Zi,"/"!=o))continue}else t.fragment="",c=es;else t.query="",c=ts;break;case Zi:if(o==Xo||"/"==o||"\\"==o&&Ui(t)||!r&&("?"==o||"#"==o)){if(".."===(u=(u=f).toLowerCase())||"%2e."===u||".%2e"===u||"%2e%2e"===u?(Li(t),"/"==o||"\\"==o&&Ui(t)||t.path.push("")):$i(f)?"/"==o||"\\"==o&&Ui(t)||t.path.push(""):("file"==t.scheme&&!t.path.length&&Ti(f)&&(t.host&&(t.host=""),f=f.charAt(0)+":"),t.path.push(f)),f="","file"==t.scheme&&(o==Xo||"?"==o||"#"==o))for(;t.path.length>1&&""===t.path[0];)t.path.shift();"?"==o?(t.query="",c=ts):"#"==o&&(t.fragment="",c=es)}else f+=Ei(o,Pi);break;case Qi:"?"==o?(t.query="",c=ts):"#"==o?(t.fragment="",c=es):o!=Xo&&(t.path[0]+=Ei(o,Si));break;case ts:r||"#"!=o?o!=Xo&&("'"==o&&Ui(t)?t.query+="%27":t.query+="#"==o?"%23":Ei(o,Si)):(t.fragment="",c=es);break;case es:o!=Xo&&(t.fragment+=Ei(o,xi))}l++}},ns=function(t){var e,r,n=ze(this,ns,"URL"),a=arguments.length>1?arguments[1]:void 0,i=String(t),s=ni(n,{type:"URL"});if(void 0!==a)if(a instanceof ns)e=ai(a);else if(r=rs(e={},String(a)))throw TypeError(r);if(r=rs(s,i,null,e))throw TypeError(r);var u=s.searchParams=new ei,c=ri(u);c.updateSearchParams(s.query),c.updateURL=function(){s.query=String(u)||null},o||(n.href=os.call(n),n.origin=is.call(n),n.protocol=ss.call(n),n.username=us.call(n),n.password=cs.call(n),n.host=ls.call(n),n.hostname=fs.call(n),n.port=hs.call(n),n.pathname=ps.call(n),n.search=ds.call(n),n.searchParams=vs.call(n),n.hash=ms.call(n))},as=ns.prototype,os=function(){var t=ai(this),e=t.scheme,r=t.username,n=t.password,a=t.host,o=t.port,i=t.path,s=t.query,u=t.fragment,c=e+":";return null!==a?(c+="//",ji(t)&&(c+=r+(n?":"+n:"")+"@"),c+=_i(a),null!==o&&(c+=":"+o)):"file"==e&&(c+="//"),c+=t.cannotBeABaseURL?i[0]:i.length?"/"+i.join("/"):"",null!==s&&(c+="?"+s),null!==u&&(c+="#"+u),c},is=function(){var t=ai(this),e=t.scheme,r=t.port;if("blob"==e)try{return new ns(e.path[0]).origin}catch(t){return"null"}return"file"!=e&&Ui(t)?e+"://"+_i(t.host)+(null!==r?":"+r:""):"null"},ss=function(){return ai(this).scheme+":"},us=function(){return ai(this).username},cs=function(){return ai(this).password},ls=function(){var t=ai(this),e=t.host,r=t.port;return null===e?"":null===r?_i(e):_i(e)+":"+r},fs=function(){var t=ai(this).host;return null===t?"":_i(t)},hs=function(){var t=ai(this).port;return null===t?"":String(t)},ps=function(){var t=ai(this),e=t.path;return t.cannotBeABaseURL?e[0]:e.length?"/"+e.join("/"):""},ds=function(){var t=ai(this).query;return t?"?"+t:""},vs=function(){return ai(this).searchParams},ms=function(){var t=ai(this).fragment;return t?"#"+t:""},gs=function(t,e){return{get:t,set:e,configurable:!0,enumerable:!0}};if(o&&Kt(as,{href:gs(os,(function(t){var e=ai(this),r=String(t),n=rs(e,r);if(n)throw TypeError(n);ri(e.searchParams).updateSearchParams(e.query)})),origin:gs(is),protocol:gs(ss,(function(t){var e=ai(this);rs(e,String(t)+":",Ci)})),username:gs(us,(function(t){var e=ai(this),r=wo(String(t));if(!Ai(e)){e.username="";for(var n=0;n<r.length;n++)e.username+=Ei(r[n],ki)}})),password:gs(cs,(function(t){var e=ai(this),r=wo(String(t));if(!Ai(e)){e.password="";for(var n=0;n<r.length;n++)e.password+=Ei(r[n],ki)}})),host:gs(ls,(function(t){var e=ai(this);e.cannotBeABaseURL||rs(e,String(t),Vi)})),hostname:gs(fs,(function(t){var e=ai(this);e.cannotBeABaseURL||rs(e,String(t),Ki)})),port:gs(hs,(function(t){var e=ai(this);Ai(e)||(""==(t=String(t))?e.port=null:rs(e,t,Wi))})),pathname:gs(ps,(function(t){var e=ai(this);e.cannotBeABaseURL||(e.path=[],rs(e,t+"",Xi))})),search:gs(ds,(function(t){var e=ai(this);""==(t=String(t))?e.query=null:("?"==t.charAt(0)&&(t=t.slice(1)),e.query="",rs(e,t,ts)),ri(e.searchParams).updateSearchParams(e.query)})),searchParams:gs(vs),hash:gs(ms,(function(t){var e=ai(this);""!=(t=String(t))?("#"==t.charAt(0)&&(t=t.slice(1)),e.fragment="",rs(e,t,es)):e.fragment=null}))}),et(as,"toJSON",(function(){return os.call(this)}),{enumerable:!0}),et(as,"toString",(function(){return os.call(this)}),{enumerable:!0}),ti){var bs=ti.createObjectURL,ys=ti.revokeObjectURL;bs&&et(ns,"createObjectURL",(function(t){return bs.apply(ti,arguments)})),ys&&et(ns,"revokeObjectURL",(function(t){return ys.apply(ti,arguments)}))}Me(ns,"URL"),Tt({global:!0,forced:!bo,sham:!o},{URL:ns});var ws=[],_s=ws.sort,Ss=a((function(){ws.sort(void 0)})),xs=a((function(){ws.sort(null)})),Ps=ua("sort");Tt({target:"Array",proto:!0,forced:Ss||!xs||!Ps},{sort:function(t){return void 0===t?_s.call(se(this)):_s.call(se(this),_e(t))}}),(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{1347:function(t,e,r){r.r(e);var n=r(13),a=r.n(n),o=r(4),i=r(0),s=r.n(i),u=r(14);r(23);function c(t,e,r,n,a,o,i){try{var s=t[o](i),u=s.value}catch(t){return void r(t)}s.done?e(u):Promise.resolve(u).then(n,a)}function l(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function f(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?l(Object(r),!0).forEach((function(e){h(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function h(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}var p={metaInfo:{title:"Users"},data:function(){return{editmode:!1,isLoading:!0,email_exist:"",serverParams:{columnFilters:{},sort:{field:"id",type:"desc"},page:1,perPage:10},totalRows:"",search:"",limit:"10",Filter_Name:"",Filter_Email:"",Filter_status:"",Filter_Phone:"",permissions:{},users:[],roles:[],data:new FormData,user:{firstname:"",lastname:"",username:"",password:"",NewPassword:null,email:"",phone:"",statut:"",role_id:"",avatar:""}}},computed:f(f({},Object(o.c)(["currentUserPermissions"])),{},{columns:function(){return[{label:this.$t("Firstname"),field:"firstname",tdClass:"text-left",thClass:"text-left"},{label:this.$t("lastname"),field:"lastname",tdClass:"text-left",thClass:"text-left"},{label:this.$t("username"),field:"username",tdClass:"text-left",thClass:"text-left"},{label:this.$t("Email"),field:"email",tdClass:"text-left",thClass:"text-left"},{label:this.$t("Phone"),field:"phone",tdClass:"text-left",thClass:"text-left"},{label:this.$t("Status"),field:"statut",html:!0,sortable:!1,tdClass:"text-center",thClass:"text-center"},{label:this.$t("Action"),field:"actions",html:!0,tdClass:"text-right",thClass:"text-right",sortable:!1}]}}),methods:{Submit_User:function(){var t=this;this.$refs.Create_User.validate().then((function(e){e?t.editmode?t.Update_User():t.Create_User():t.makeToast("danger",t.$t("Please_fill_the_form_correctly"),t.$t("Failed"))}))},updateParams:function(t){this.serverParams=Object.assign({},this.serverParams,t)},onPageChange:function(t){var e=t.currentPage;this.serverParams.page!==e&&(this.updateParams({page:e}),this.Get_Users(e))},onPerPageChange:function(t){var e=t.currentPerPage;this.limit!==e&&(this.limit=e,this.updateParams({page:1,perPage:e}),this.Get_Users(1))},onSortChange:function(t){this.updateParams({sort:{type:t[0].type,field:t[0].field}}),this.Get_Users(this.serverParams.page)},onSearch:function(t){this.search=t.searchTerm,this.Get_Users(this.serverParams.page)},getValidationState:function(t){var e=t.dirty,r=t.validated,n=t.valid;return e||r?void 0===n?null:n:null},Reset_Filter:function(){this.search="",this.Filter_Name="",this.Filter_status="",this.Filter_Phone="",this.Filter_Email="",this.Get_Users(this.serverParams.page)},makeToast:function(t,e,r){this.$root.$bvToast.toast(e,{title:r,variant:t,solid:!0})},isChecked:function(t){var e=this;axios.put("users/Activated/"+t.id,{statut:t.statut,id:t.id}).then((function(r){r.data.success?t.statut?(t.statut=1,e.makeToast("success",e.$t("ActivateUser"),e.$t("Success"))):(t.statut=0,e.makeToast("success",e.$t("DisActivateUser"),e.$t("Success"))):(t.statut=1,e.makeToast("warning",e.$t("Delete.Therewassomethingwronge"),e.$t("Warning")))})).catch((function(r){t.statut=1,e.makeToast("warning",e.$t("Delete.Therewassomethingwronge"),e.$t("Warning"))}))},Users_PDF:function(){var t=new u.default("p","pt");t.autoTable([{title:"First Name",dataKey:"firstname"},{title:"Last Name",dataKey:"lastname"},{title:"Username",dataKey:"username"},{title:"Email",dataKey:"email"},{title:"Phone",dataKey:"phone"}],this.users),t.text("User List",40,25),t.save("User_List.pdf")},Users_Excel:function(){s.a.start(),s.a.set(.1),axios.get("users/export/Excel",{responseType:"blob",headers:{"Content-Type":"application/json"}}).then((function(t){var e=window.URL.createObjectURL(new Blob([t.data])),r=document.createElement("a");r.href=e,r.setAttribute("download","List_Users.xlsx"),document.body.appendChild(r),r.click(),setTimeout((function(){return s.a.done()}),500)})).catch((function(){setTimeout((function(){return s.a.done()}),500)}))},setToStrings:function(){null===this.Filter_status&&(this.Filter_status="")},Get_Users:function(t){var e=this;s.a.start(),s.a.set(.1),this.setToStrings(),axios.get("users?page="+t+"&name="+this.Filter_Name+"&statut="+this.Filter_status+"&phone="+this.Filter_Phone+"&email="+this.Filter_Email+"&SortField="+this.serverParams.sort.field+"&SortType="+this.serverParams.sort.type+"&search="+this.search+"&limit="+this.limit).then((function(t){e.users=t.data.users,e.roles=t.data.roles,e.totalRows=t.data.totalRows,s.a.done(),e.isLoading=!1})).catch((function(t){s.a.done(),setTimeout((function(){e.isLoading=!1}),500)}))},New_User:function(){this.reset_Form(),this.editmode=!1,this.$bvModal.show("New_User")},Edit_User:function(t){this.Get_Users(this.serverParams.page),this.reset_Form(),this.user=t,this.user.NewPassword=null,this.editmode=!0,this.$bvModal.show("New_User")},onFileSelected:function(t){var e,r=this;return(e=a.a.mark((function e(){var n,o;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r.$refs.Avatar.validate(t);case 2:n=e.sent,o=n.valid,r.user.avatar=o?t.target.files[0]:"";case 5:case"end":return e.stop()}}),e)})),function(){var t=this,r=arguments;return new Promise((function(n,a){var o=e.apply(t,r);function i(t){c(o,n,a,i,s,"next",t)}function s(t){c(o,n,a,i,s,"throw",t)}i(void 0)}))})()},Create_User:function(){var t=this,e=this;e.data.append("firstname",e.user.firstname),e.data.append("lastname",e.user.lastname),e.data.append("username",e.user.username),e.data.append("email",e.user.email),e.data.append("password",e.user.password),e.data.append("phone",e.user.phone),e.data.append("role",e.user.role_id),e.data.append("avatar",e.user.avatar),axios.post("users",e.data).then((function(e){Fire.$emit("Event_User"),t.makeToast("success",t.$t("Create.TitleUser"),t.$t("Success"))})).catch((function(r){r.errors.email.length>0&&(e.email_exist=r.errors.email[0]),t.makeToast("danger",t.$t("InvalidData"),t.$t("Failed"))}))},Update_User:function(){var t=this,e=this;e.data.append("firstname",e.user.firstname),e.data.append("lastname",e.user.lastname),e.data.append("username",e.user.username),e.data.append("email",e.user.email),e.data.append("NewPassword",e.user.NewPassword),e.data.append("phone",e.user.phone),e.data.append("role",e.user.role_id),e.data.append("statut",e.user.statut),e.data.append("avatar",e.user.avatar),e.data.append("_method","put"),axios.post("users/"+this.user.id,e.data).then((function(e){t.makeToast("success",t.$t("Update.TitleUser"),t.$t("Success")),Fire.$emit("Event_User")})).catch((function(r){r.errors.email.length>0&&(e.email_exist=r.errors.email[0]),t.makeToast("danger",t.$t("InvalidData"),t.$t("Failed"))}))},reset_Form:function(){this.user={id:"",firstname:"",lastname:"",username:"",password:"",NewPassword:null,email:"",phone:"",statut:"",role_id:"",avatar:""},this.email_exist=""},Remove_User:function(t){var e=this;this.$swal({title:this.$t("Delete.Title"),text:this.$t("Delete.Text"),type:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",cancelButtonText:this.$t("Delete.cancelButtonText"),confirmButtonText:this.$t("Delete.confirmButtonText")}).then((function(r){r.value&&axios.delete("users/"+t).then((function(){e.$swal(e.$t("Delete.Deleted"),e.$t("Delete.UserDeleted"),"success"),Fire.$emit("Delete_User")})).catch((function(){e.$swal(e.$t("Delete.Failed"),"this User already linked with other operation","warning")}))}))}},created:function(){var t=this;this.Get_Users(1),Fire.$on("Event_User",(function(){setTimeout((function(){t.Get_Users(t.serverParams.page),t.$bvModal.hide("New_User")}),500)})),Fire.$on("Delete_User",(function(){setTimeout((function(){t.Get_Users(t.serverParams.page)}),500)}))}},d=r(2),v=Object(d.a)(p,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"main-content"},[r("breadcumb",{attrs:{page:t.$t("UserManagement"),folder:t.$t("Users")}}),t._v(" "),t.isLoading?r("div",{staticClass:"loading_page spinner spinner-primary mr-3"}):r("div",[r("vue-good-table",{attrs:{mode:"remote",columns:t.columns,totalRows:t.totalRows,rows:t.users,"search-options":{enabled:!0,placeholder:t.$t("Search_this_table")},"pagination-options":{enabled:!0,mode:"records",nextLabel:"next",prevLabel:"prev"},styleClass:"table-hover tableOne vgt-table"},on:{"on-page-change":t.onPageChange,"on-per-page-change":t.onPerPageChange,"on-sort-change":t.onSortChange,"on-search":t.onSearch},scopedSlots:t._u([{key:"table-row",fn:function(e){return["actions"==e.column.field?r("span",[t.currentUserPermissions&&t.currentUserPermissions.includes("users_edit")?r("a",{directives:[{name:"b-tooltip",rawName:"v-b-tooltip.hover",modifiers:{hover:!0}}],attrs:{title:"Edit"},on:{click:function(r){return t.Edit_User(e.row)}}},[r("i",{staticClass:"i-Edit text-25 text-success"})]):t._e()]):"statut"==e.column.field?r("div",[r("label",{staticClass:"switch switch-primary mr-3"},[r("input",{directives:[{name:"model",rawName:"v-model",value:e.row.statut,expression:"props.row.statut"}],attrs:{type:"checkbox"},domProps:{checked:Array.isArray(e.row.statut)?t._i(e.row.statut,null)>-1:e.row.statut},on:{change:[function(r){var n=e.row.statut,a=r.target,o=!!a.checked;if(Array.isArray(n)){var i=t._i(n,null);a.checked?i<0&&t.$set(e.row,"statut",n.concat([null])):i>-1&&t.$set(e.row,"statut",n.slice(0,i).concat(n.slice(i+1)))}else t.$set(e.row,"statut",o)},function(r){return t.isChecked(e.row)}]}}),t._v(" "),r("span",{staticClass:"slider"})])]):t._e()]}}])},[r("div",{staticClass:"mt-2 mb-3",attrs:{slot:"table-actions"},slot:"table-actions"},[r("b-button",{directives:[{name:"b-toggle",rawName:"v-b-toggle.sidebar-right",modifiers:{"sidebar-right":!0}}],attrs:{variant:"outline-info m-1",size:"sm"}},[r("i",{staticClass:"i-Filter-2"}),t._v("\n          "+t._s(t.$t("Filter"))+"\n        ")]),t._v(" "),r("b-button",{attrs:{size:"sm",variant:"outline-success m-1"},on:{click:function(e){return t.Users_PDF()}}},[r("i",{staticClass:"i-File-Copy"}),t._v(" PDF\n        ")]),t._v(" "),r("b-button",{attrs:{size:"sm",variant:"outline-danger m-1"},on:{click:function(e){return t.Users_Excel()}}},[r("i",{staticClass:"i-File-Excel"}),t._v(" EXCEL\n        ")]),t._v(" "),t.currentUserPermissions&&t.currentUserPermissions.includes("users_add")?r("b-button",{attrs:{size:"sm",variant:"btn btn-primary btn-icon m-1"},on:{click:function(e){return t.New_User()}}},[r("i",{staticClass:"i-Add"}),t._v("\n          "+t._s(t.$t("Add"))+"\n        ")]):t._e()],1)])],1),t._v(" "),r("b-sidebar",{attrs:{id:"sidebar-right",title:t.$t("Filter"),"bg-variant":"white",right:"",shadow:""}},[r("div",{staticClass:"px-3 py-2"},[r("b-row",[r("b-col",{attrs:{md:"12"}},[r("b-form-group",{attrs:{label:t.$t("username")}},[r("b-form-input",{attrs:{label:"Code",placeholder:t.$t("username")},model:{value:t.Filter_Name,callback:function(e){t.Filter_Name=e},expression:"Filter_Name"}})],1)],1),t._v(" "),r("b-col",{attrs:{md:"12"}},[r("b-form-group",{attrs:{label:t.$t("Phone")}},[r("b-form-input",{attrs:{label:"Phone",placeholder:t.$t("SearchByPhone")},model:{value:t.Filter_Phone,callback:function(e){t.Filter_Phone=e},expression:"Filter_Phone"}})],1)],1),t._v(" "),r("b-col",{attrs:{md:"12"}},[r("b-form-group",{attrs:{label:t.$t("Email")}},[r("b-form-input",{attrs:{label:"Email",placeholder:t.$t("SearchByEmail")},model:{value:t.Filter_Email,callback:function(e){t.Filter_Email=e},expression:"Filter_Email"}})],1)],1),t._v(" "),r("b-col",{attrs:{md:"12"}},[r("b-form-group",{attrs:{label:t.$t("Status")}},[r("v-select",{attrs:{reduce:function(t){return t.value},placeholder:t.$t("Choose_Status"),options:[{label:"Actif",value:"1"},{label:"Inactif",value:"0"}]},model:{value:t.Filter_status,callback:function(e){t.Filter_status=e},expression:"Filter_status"}})],1)],1),t._v(" "),r("b-col",{attrs:{md:"6",sm:"12"}},[r("b-button",{attrs:{variant:"primary m-1",size:"sm",block:""},on:{click:function(e){return t.Get_Users(t.serverParams.page)}}},[r("i",{staticClass:"i-Filter-2"}),t._v("\n            "+t._s(t.$t("Filter"))+"\n          ")])],1),t._v(" "),r("b-col",{attrs:{md:"6",sm:"12"}},[r("b-button",{attrs:{variant:"danger m-1",size:"sm",block:""},on:{click:function(e){return t.Reset_Filter()}}},[r("i",{staticClass:"i-Power-2"}),t._v("\n            "+t._s(t.$t("Reset"))+"\n          ")])],1)],1)],1)]),t._v(" "),r("validation-observer",{ref:"Create_User"},[r("b-modal",{attrs:{"hide-footer":"",size:"lg",id:"New_User",title:t.editmode?t.$t("Edit"):t.$t("Add")}},[r("b-form",{attrs:{enctype:"multipart/form-data"},on:{submit:function(e){return e.preventDefault(),t.Submit_User(e)}}},[r("b-row",[r("b-col",{attrs:{md:"6",sm:"12"}},[r("validation-provider",{attrs:{name:"Firstname",rules:{required:!0,min:4,max:20}},scopedSlots:t._u([{key:"default",fn:function(e){return[r("b-form-group",{attrs:{label:t.$t("Firstname")}},[r("b-form-input",{attrs:{state:t.getValidationState(e),"aria-describedby":"Firstname-feedback",label:"Firstname"},model:{value:t.user.firstname,callback:function(e){t.$set(t.user,"firstname",e)},expression:"user.firstname"}}),t._v(" "),r("b-form-invalid-feedback",{attrs:{id:"Firstname-feedback"}},[t._v(t._s(e.errors[0]))])],1)]}}])})],1),t._v(" "),r("b-col",{attrs:{md:"6",sm:"12"}},[r("validation-provider",{attrs:{name:"lastname",rules:{required:!0,min:4,max:20}},scopedSlots:t._u([{key:"default",fn:function(e){return[r("b-form-group",{attrs:{label:t.$t("lastname")}},[r("b-form-input",{attrs:{state:t.getValidationState(e),"aria-describedby":"lastname-feedback",label:"lastname"},model:{value:t.user.lastname,callback:function(e){t.$set(t.user,"lastname",e)},expression:"user.lastname"}}),t._v(" "),r("b-form-invalid-feedback",{attrs:{id:"lastname-feedback"}},[t._v(t._s(e.errors[0]))])],1)]}}])})],1),t._v(" "),r("b-col",{attrs:{md:"6",sm:"12"}},[r("validation-provider",{attrs:{name:"username",rules:{required:!0,min:4,max:20}},scopedSlots:t._u([{key:"default",fn:function(e){return[r("b-form-group",{attrs:{label:t.$t("username")}},[r("b-form-input",{attrs:{state:t.getValidationState(e),"aria-describedby":"username-feedback",label:"username"},model:{value:t.user.username,callback:function(e){t.$set(t.user,"username",e)},expression:"user.username"}}),t._v(" "),r("b-form-invalid-feedback",{attrs:{id:"username-feedback"}},[t._v(t._s(e.errors[0]))])],1)]}}])})],1),t._v(" "),r("b-col",{attrs:{md:"6",sm:"12"}},[r("validation-provider",{attrs:{name:"Phone",rules:{required:!0}},scopedSlots:t._u([{key:"default",fn:function(e){return[r("b-form-group",{attrs:{label:t.$t("Phone")}},[r("b-form-input",{attrs:{state:t.getValidationState(e),"aria-describedby":"Phone-feedback",label:"Phone"},model:{value:t.user.phone,callback:function(e){t.$set(t.user,"phone",e)},expression:"user.phone"}}),t._v(" "),r("b-form-invalid-feedback",{attrs:{id:"Phone-feedback"}},[t._v(t._s(e.errors[0]))])],1)]}}])})],1),t._v(" "),r("b-col",{attrs:{md:"6",sm:"12"}},[r("validation-provider",{attrs:{name:"Email",rules:{required:!0}},scopedSlots:t._u([{key:"default",fn:function(e){return[r("b-form-group",{attrs:{label:t.$t("Email")}},[r("b-form-input",{attrs:{state:t.getValidationState(e),"aria-describedby":"Email-feedback",label:"Email"},model:{value:t.user.email,callback:function(e){t.$set(t.user,"email",e)},expression:"user.email"}}),t._v(" "),r("b-form-invalid-feedback",{attrs:{id:"Email-feedback"}},[t._v(t._s(e.errors[0]))]),t._v(" "),""!=t.email_exist?r("b-alert",{staticClass:"error mt-1",attrs:{show:"",variant:"danger"}},[t._v(t._s(t.email_exist))]):t._e()],1)]}}])})],1),t._v(" "),t.editmode?t._e():r("b-col",{attrs:{md:"6",sm:"12"}},[r("validation-provider",{attrs:{name:"password",rules:{required:!0,min:6,max:14}},scopedSlots:t._u([{key:"default",fn:function(e){return[r("b-form-group",{attrs:{label:t.$t("password")}},[r("b-form-input",{attrs:{state:t.getValidationState(e),"aria-describedby":"password-feedback",label:"password",type:"password"},model:{value:t.user.password,callback:function(e){t.$set(t.user,"password",e)},expression:"user.password"}}),t._v(" "),r("b-form-invalid-feedback",{attrs:{id:"password-feedback"}},[t._v(t._s(e.errors[0]))])],1)]}}],null,!1,2321465681)})],1),t._v(" "),r("b-col",{attrs:{md:"6",sm:"12"}},[r("validation-provider",{attrs:{name:"role",rules:{required:!0}},scopedSlots:t._u([{key:"default",fn:function(e){var n=e.valid,a=e.errors;return r("b-form-group",{attrs:{label:t.$t("RoleName")}},[r("v-select",{class:{"is-invalid":!!a.length},attrs:{state:!a[0]&&(!!n||null),reduce:function(t){return t.value},placeholder:t.$t("PleaseSelect"),options:t.roles.map((function(t){return{label:t.name,value:t.id}}))},model:{value:t.user.role_id,callback:function(e){t.$set(t.user,"role_id",e)},expression:"user.role_id"}}),t._v(" "),r("b-form-invalid-feedback",[t._v(t._s(a[0]))])],1)}}])})],1),t._v(" "),r("b-col",{attrs:{md:"6",sm:"12"}},[r("validation-provider",{ref:"Avatar",attrs:{name:"Avatar",rules:"mimes:image/*|size:200"},scopedSlots:t._u([{key:"default",fn:function(e){e.validate;var n=e.valid,a=e.errors;return r("b-form-group",{attrs:{label:t.$t("UserImage")}},[r("input",{class:{"is-invalid":!!a.length},attrs:{state:!a[0]&&(!!n||null),label:"Choose Avatar",type:"file"},on:{change:t.onFileSelected}}),t._v(" "),r("b-form-invalid-feedback",{attrs:{id:"Avatar-feedback"}},[t._v(t._s(a[0]))])],1)}}])})],1),t._v(" "),t.editmode?r("b-col",{attrs:{md:"6"}},[r("validation-provider",{attrs:{name:"New password",rules:{min:6,max:14}},scopedSlots:t._u([{key:"default",fn:function(e){return[r("b-form-group",{attrs:{label:t.$t("Newpassword")}},[r("b-form-input",{attrs:{state:t.getValidationState(e),"aria-describedby":"Nawpassword-feedback",placeholder:t.$t("LeaveBlank"),label:"New password"},model:{value:t.user.NewPassword,callback:function(e){t.$set(t.user,"NewPassword",e)},expression:"user.NewPassword"}}),t._v(" "),r("b-form-invalid-feedback",{attrs:{id:"Nawpassword-feedback"}},[t._v(t._s(e.errors[0]))])],1)]}}],null,!1,1010016937)})],1):t._e(),t._v(" "),r("b-col",{staticClass:"mt-3",attrs:{md:"12"}},[r("b-button",{attrs:{variant:"primary",type:"submit"}},[t._v(t._s(t.$t("submit")))])],1)],1)],1)],1)],1)],1)}),[],!1,null,null,null);e.default=v.exports}}])}();
>>>>>>> f11b8c326380b962de568282db4cbb62e4ac9c9f
