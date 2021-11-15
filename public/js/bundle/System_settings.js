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

var FORCED$2 = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.es/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
_export({ target: 'Array', proto: true, forced: FORCED$2 }, {
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

var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('slice');

var SPECIES$5 = wellKnownSymbol('species');
var nativeSlice = [].slice;
var max$1 = Math.max;

// `Array.prototype.slice` method
// https://tc39.es/ecma262/#sec-array.prototype.slice
// fallback for not array-like ES3 strings and DOM objects
_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 }, {
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
        Constructor = Constructor[SPECIES$5];
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

(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["System_settings"],{

/***/"./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/src/views/app/pages/settings/system_settings.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/src/views/app/pages/settings/system_settings.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/function node_modulesBabelLoaderLibIndexJsNode_modulesVueLoaderLibIndexJsResourcesSrcViewsAppPagesSettingsSystem_settingsVueVueTypeScriptLangJs(module,__webpack_exports__,__webpack_require__){
__webpack_require__.r(__webpack_exports__);
/* harmony import */var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(/*! @babel/runtime/regenerator */"./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */var vuex__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(/*! vuex */"./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */var nprogress__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(/*! nprogress */"./node_modules/nprogress/nprogress.js");
/* harmony import */var nprogress__WEBPACK_IMPORTED_MODULE_2___default=/*#__PURE__*/__webpack_require__.n(nprogress__WEBPACK_IMPORTED_MODULE_2__);


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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
title:"System Settings"},

data:function data(){
return {
isLoading:true,
data:new FormData(),
settings:[],
currencies:[],
clients:[],
warehouses:[],
setting:{
currency_id:"",
client_id:"",
warehouse_id:"",
email:"",
logo:"",
CompanyName:"",
CompanyPhone:"",
CompanyAdress:"",
footer:"",
developed_by:"",
initial_invoiceCF:"",
current_invoiceCF:"",
initial_invoiceCCF:"",
current_invoiceCCF:""},

gateway:{
stripe_key:"",
stripe_secret:"",
deleted:false},

sms:{
gateway:'Twilio',
TWILIO_SID:'',
TWILIO_TOKEN:'',
TWILIO_FROM:''},

server:{
host:"",
port:"",
username:"",
password:"",
encryption:""}};


},
methods:_objectSpread(_objectSpread({},Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapActions"])(["refreshUserPermissions"])),{},{
//------------- Submit Validation Setting
Submit_Setting:function Submit_Setting(){
var _this=this;

this.$refs.form_setting.validate().then(function(success){
if(!success){
_this.makeToast("danger",_this.$t("Please_fill_the_form_correctly"),_this.$t("Failed"));
}else {
_this.Update_Settings();
}
});
},
//------------- Submit Validation SMTP
Submit_SMTP:function Submit_SMTP(){
var _this2=this;

this.$refs.form_smtp.validate().then(function(success){
if(!success){
_this2.makeToast("danger",_this2.$t("Please_fill_the_form_correctly"),_this2.$t("Failed"));
}else {
_this2.Update_Smtp();
}
});
},
//------------- Submit Validation Payment
Submit_Payment:function Submit_Payment(){
var _this3=this;

this.$refs.form_payment.validate().then(function(success){
if(!success){
_this3.makeToast("danger",_this3.$t("Please_fill_the_form_correctly"),_this3.$t("Failed"));
}else {
_this3.Update_Payment();
}
});
},
//------------- Submit Validation SMS
Submit_sms:function Submit_sms(){
var _this4=this;

this.$refs.form_sms.validate().then(function(success){
if(!success){
_this4.makeToast("danger",_this4.$t("Please_fill_the_form_correctly"),_this4.$t("Failed"));
}else {
_this4.Update_SMS();
}
});
},
//------ Toast
makeToast:function makeToast(variant,msg,title){
this.$root.$bvToast.toast(msg,{
title:title,
variant:variant,
solid:true});

},
getValidationState:function getValidationState(_ref){
var dirty=_ref.dirty,
validated=_ref.validated,
_ref$valid=_ref.valid,
valid=_ref$valid===void 0?null:_ref$valid;
return dirty||validated?valid:null;
},
//-------------------------------------- Get All currencies----------------------\\
// Get_Currencies() {
//   axios
//     .get("Get_Currencies/All")
//     .then(response => {
//       this.currencies = response.data;
//     })
//     .catch(response => {});
// },
//------------------------------ Event Upload Logo -------------------------------\\
onFileSelected:function onFileSelected(e){
var _this5=this;

return _asyncToGenerator(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(){
var _yield$_this5$$refs$L,valid;

return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context){
while(1){
switch(_context.prev=_context.next){
case 0:
_context.next=2;
return _this5.$refs.Logo.validate(e);

case 2:
_yield$_this5$$refs$L=_context.sent;
valid=_yield$_this5$$refs$L.valid;

if(valid){
_this5.setting.logo=e.target.files[0];
}else {
_this5.setting.logo="";
}

case 5:
case"end":
return _context.stop();}

}
},_callee);
}))();
},
//---------------------------------- Update Settings ----------------\\
Update_Settings:function Update_Settings(){
var _this6=this;

nprogress__WEBPACK_IMPORTED_MODULE_2___default.a.start();
nprogress__WEBPACK_IMPORTED_MODULE_2___default.a.set(0.1);
var self=this;
self.data.append("currency",self.setting.currency_id);
self.data.append("client",self.setting.client_id);
self.data.append("warehouse",self.setting.warehouse_id);
self.data.append("email",self.setting.email);
self.data.append("logo",self.setting.logo);
self.data.append("CompanyName",self.setting.CompanyName);
self.data.append("CompanyPhone",self.setting.CompanyPhone);
self.data.append("CompanyAdress",self.setting.CompanyAdress);
self.data.append("footer",self.setting.footer);
self.data.append("initial_invoiceCF",self.setting.initial_invoiceCF);
self.data.append("current_invoiceCF",self.setting.current_invoiceCF);
self.data.append("initial_invoiceCCF",self.setting.initial_invoiceCCF);
self.data.append("current_invoiceCCF",self.setting.current_invoiceCCF);
self.data.append("developed_by",self.setting.developed_by);
self.data.append("_method","put");
axios.post("settings/"+self.setting.id,self.data).then(function(response){
Fire.$emit("Event_Setting");

_this6.makeToast("success",_this6.$t("Successfully_Updated"),_this6.$t("Success"));

_this6.refreshUserPermissions();

nprogress__WEBPACK_IMPORTED_MODULE_2___default.a.done();
})["catch"](function(error){
_this6.makeToast("danger",_this6.$t("InvalidData"),_this6.$t("Failed"));

nprogress__WEBPACK_IMPORTED_MODULE_2___default.a.done();
});
},
//---------------------------------- Update SMTP ----------------\\
Update_Smtp:function Update_Smtp(){
var _this7=this;

nprogress__WEBPACK_IMPORTED_MODULE_2___default.a.start();
nprogress__WEBPACK_IMPORTED_MODULE_2___default.a.set(0.1);
axios.put("SMTP/"+this.server.id,{
host:this.server.host,
port:this.server.port,
username:this.server.username,
password:this.server.password,
encryption:this.server.encryption}).
then(function(response){
Fire.$emit("Event_Smtp");

_this7.makeToast("success",_this7.$t("Successfully_Updated"),_this7.$t("Success"));

nprogress__WEBPACK_IMPORTED_MODULE_2___default.a.done();
})["catch"](function(error){
nprogress__WEBPACK_IMPORTED_MODULE_2___default.a.done();

_this7.makeToast("danger",_this7.$t("InvalidData"),_this7.$t("Failed"));
});
},
//---------------------------------- Update Payment Gateway ----------------\\
Update_Payment:function Update_Payment(){
var _this8=this;

nprogress__WEBPACK_IMPORTED_MODULE_2___default.a.start();
nprogress__WEBPACK_IMPORTED_MODULE_2___default.a.set(0.1);
axios.post("payment_gateway",{
stripe_key:this.gateway.stripe_key,
stripe_secret:this.gateway.stripe_secret,
deleted:this.gateway.deleted}).
then(function(response){
Fire.$emit("Event_payment");

_this8.makeToast("success",_this8.$t("Successfully_Updated"),_this8.$t("Success"));

nprogress__WEBPACK_IMPORTED_MODULE_2___default.a.done();
})["catch"](function(error){
nprogress__WEBPACK_IMPORTED_MODULE_2___default.a.done();

_this8.makeToast("danger",_this8.$t("InvalidData"),_this8.$t("Failed"));
});
},
//---------------------------------- Update sms ----------------\\
Update_SMS:function Update_SMS(){
var _this9=this;

nprogress__WEBPACK_IMPORTED_MODULE_2___default.a.start();
nprogress__WEBPACK_IMPORTED_MODULE_2___default.a.set(0.1);
axios.post("sms_config",{
TWILIO_SID:this.sms.TWILIO_SID,
TWILIO_TOKEN:this.sms.TWILIO_TOKEN,
TWILIO_FROM:this.sms.TWILIO_FROM}).
then(function(response){
Fire.$emit("Event_sms");

_this9.makeToast("success",_this9.$t("Successfully_Updated"),_this9.$t("Success"));

nprogress__WEBPACK_IMPORTED_MODULE_2___default.a.done();
})["catch"](function(error){
nprogress__WEBPACK_IMPORTED_MODULE_2___default.a.done();

_this9.makeToast("danger",_this9.$t("InvalidData"),_this9.$t("Failed"));
});
},
//---------------------------------- get_sms_config ----------------\\
get_sms_config:function get_sms_config(){
var _this10=this;

axios.get("get_sms_config").then(function(response){
_this10.sms=response.data.sms;
})["catch"](function(error){});
},
//---------------------------------- GET Payment_Gateway ----------------\\
Get_Payment_Gateway:function Get_Payment_Gateway(){
var _this11=this;

axios.get("Get_payment_gateway").then(function(response){
_this11.gateway=response.data.gateway;
})["catch"](function(error){});
},
//---------------------------------- Get SETTINGS ----------------\\
Get_Settings:function Get_Settings(){
var _this12=this;

axios.get("getSettings").then(function(response){
_this12.setting=response.data.settings;
_this12.currencies=response.data.currencies;
_this12.clients=response.data.clients;
_this12.warehouses=response.data.warehouses;

_this12.Get_SMTP();// this.Get_Currencies();


_this12.Get_Payment_Gateway();

_this12.get_sms_config();

_this12.isLoading=false;
})["catch"](function(error){
setTimeout(function(){
_this12.isLoading=false;
},500);
});
},
//---------------------------------- GET SMTP ----------------\\ 
Get_SMTP:function Get_SMTP(){
var _this13=this;

axios.get("getSMTP").then(function(response){
_this13.server=response.data.server;
})["catch"](function(error){});
}}),

//end Methods
//----------------------------- Created function-------------------
created:function created(){
var _this14=this;

this.Get_Settings();
Fire.$on("Event_Smtp",function(){
_this14.Get_SMTP();
});
Fire.$on("Event_payment",function(){
_this14.Get_Payment_Gateway();
});
Fire.$on("Event_Setting",function(){
_this14.Get_Settings();
});
Fire.$on("Event_sms",function(){
_this14.get_sms_config();
});
}};


/***/},

/***/"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/src/views/app/pages/settings/system_settings.vue?vue&type=template&id=7bd1aea4&":
/*!*********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/src/views/app/pages/settings/system_settings.vue?vue&type=template&id=7bd1aea4& ***!
  \*********************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/function node_modulesVueLoaderLibLoadersTemplateLoaderJsNode_modulesVueLoaderLibIndexJsResourcesSrcViewsAppPagesSettingsSystem_settingsVueVueTypeTemplateId7bd1aea4(module,__webpack_exports__,__webpack_require__){
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
attrs:{page:_vm.$t("SystemSettings"),folder:_vm.$t("Settings")}}),

_vm._v(" "),
_vm.isLoading?
_c("div",{
staticClass:"loading_page spinner spinner-primary mr-3"}):

_vm._e(),
_vm._v(" "),
!_vm.isLoading?
_c(
"validation-observer",
{ref:"form_setting"},
[
_c(
"b-form",
{
on:{
submit:function submit($event){
$event.preventDefault();
return _vm.Submit_Setting($event);
}}},


[
_c(
"b-row",
[
_c(
"b-col",
{attrs:{lg:"12",md:"12",sm:"12"}},
[
_c(
"b-card",
{
attrs:{
"no-body":"",
header:_vm.$t("SystemSettings")}},


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
attrs:{lg:"4",md:"4",sm:"12"}},

[
_c(
"b-form-group",
{
attrs:{
label:_vm.$t("DefaultCurrency")}},


[
_c("v-select",{
attrs:{
reduce:function reduce(label){
return label.value;
},
placeholder:_vm.$t(
"Choose_Currency"),

options:_vm.currencies.map(
function(currencies){
return {
label:currencies.name,
value:currencies.id};

})},


model:{
value:
_vm.setting.currency_id,
callback:function callback($$v){
_vm.$set(
_vm.setting,
"currency_id",
$$v);

},
expression:
"setting.currency_id"}})],



1)],


1),

_vm._v(" "),
_c(
"b-col",
{
attrs:{lg:"4",md:"4",sm:"12"}},

[
_c("validation-provider",{
attrs:{
name:"Email",
rules:{required:true}},

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
"DefaultEmail")}},



[
_c("b-form-input",{
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"Email-feedback",
label:"Email",
placeholder:_vm.$t(
"DefaultEmail")},


model:{
value:
_vm.setting.
email,
callback:function callback(
$$v)
{
_vm.$set(
_vm.setting,
"email",
$$v);

},
expression:
"setting.email"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{
id:
"Email-feedback"}},


[
_vm._v(
_vm._s(
validationContext.
errors[0]))])],





1)];


}}],


null,
false,
2739386684)})],



1),

_vm._v(" "),
_c(
"b-col",
{
attrs:{lg:"4",md:"4",sm:"12"}},

[
_c("validation-provider",{
ref:"Logo",
attrs:{
name:"Logo",
rules:"mimes:image/*|size:200"},

scopedSlots:_vm._u(
[
{
key:"default",
fn:function fn(ref){
var validate=ref.validate;
var valid=ref.valid;
var errors=ref.errors;
return _c(
"b-form-group",
{
attrs:{
label:_vm.$t(
"ChangeLogo")}},



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
label:
"Choose Logo",
type:"file"},

on:{
change:
_vm.onFileSelected}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{
id:
"Logo-feedback"}},


[
_vm._v(
_vm._s(errors[0]))])],




1);

}}],


null,
false,
3189141354)})],



1),

_vm._v(" "),
_c(
"b-col",
{
attrs:{lg:"4",md:"4",sm:"12"}},

[
_c("validation-provider",{
attrs:{
name:"Company Name",
rules:{required:true}},

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
"CompanyName")}},



[
_c("b-form-input",{
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"Company-feedback",
label:
"Company Name",
placeholder:_vm.$t(
"CompanyName")},


model:{
value:
_vm.setting.
CompanyName,
callback:function callback(
$$v)
{
_vm.$set(
_vm.setting,
"CompanyName",
$$v);

},
expression:
"setting.CompanyName"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{
id:
"Company-feedback"}},


[
_vm._v(
_vm._s(
validationContext.
errors[0]))])],





1)];


}}],


null,
false,
2474740188)})],



1),

_vm._v(" "),
_c(
"b-col",
{
attrs:{lg:"4",md:"4",sm:"12"}},

[
_c("validation-provider",{
attrs:{
name:"Company Phone",
rules:{required:true}},

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
"CompanyPhone")}},



[
_c("b-form-input",{
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"Phone-feedback",
label:
"Company Phone",
placeholder:_vm.$t(
"CompanyPhone")},


model:{
value:
_vm.setting.
CompanyPhone,
callback:function callback(
$$v)
{
_vm.$set(
_vm.setting,
"CompanyPhone",
$$v);

},
expression:
"setting.CompanyPhone"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{
id:
"Phone-feedback"}},


[
_vm._v(
_vm._s(
validationContext.
errors[0]))])],





1)];


}}],


null,
false,
1732497948)})],



1),

_vm._v(" "),
_c(
"b-col",
{
attrs:{lg:"4",md:"4",sm:"12"}},

[
_c("validation-provider",{
attrs:{
name:"developed by",
rules:{required:true}},

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
"developed_by")}},



[
_c("b-form-input",{
staticClass:
"form-control",
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"developed_by-feedback"},

model:{
value:
_vm.setting.
developed_by,
callback:function callback(
$$v)
{
_vm.$set(
_vm.setting,
"developed_by",
$$v);

},
expression:
"setting.developed_by"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{
id:
"developed_by-feedback"}},


[
_vm._v(
_vm._s(
validationContext.
errors[0]))])],





1)];


}}],


null,
false,
442954484)})],



1),

_vm._v(" "),
_c(
"b-col",
{
attrs:{lg:"4",md:"4",sm:"12"}},

[
_c("validation-provider",{
attrs:{
name:"footer",
rules:{required:true}},

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
"footer")}},



[
_c("b-form-input",{
staticClass:
"form-control",
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"footer-feedback"},

model:{
value:
_vm.setting.
footer,
callback:function callback(
$$v)
{
_vm.$set(
_vm.setting,
"footer",
$$v);

},
expression:
"setting.footer"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{
id:
"footer-feedback"}},


[
_vm._v(
_vm._s(
validationContext.
errors[0]))])],





1)];


}}],


null,
false,
3442615380)})],



1),

_vm._v(" "),
_c(
"b-col",
{
attrs:{lg:"4",md:"4",sm:"12"}},

[
_c(
"b-form-group",
{
attrs:{
label:_vm.$t("DefaultCustomer")}},


[
_c("v-select",{
attrs:{
reduce:function reduce(label){
return label.value;
},
placeholder:_vm.$t(
"Choose_Customer"),

options:_vm.clients.map(
function(clients){
return {
label:clients.name,
value:clients.id};

})},


model:{
value:_vm.setting.client_id,
callback:function callback($$v){
_vm.$set(
_vm.setting,
"client_id",
$$v);

},
expression:
"setting.client_id"}})],



1)],


1),

_vm._v(" "),
_c(
"b-col",
{
attrs:{lg:"4",md:"4",sm:"12"}},

[
_c(
"b-form-group",
{
attrs:{
label:_vm.$t(
"DefaultWarehouse")}},



[
_c("v-select",{
attrs:{
reduce:function reduce(label){
return label.value;
},
placeholder:_vm.$t(
"Choose_Warehouse"),

options:_vm.warehouses.map(
function(warehouses){
return {
label:warehouses.name,
value:warehouses.id};

})},


model:{
value:
_vm.setting.warehouse_id,
callback:function callback($$v){
_vm.$set(
_vm.setting,
"warehouse_id",
$$v);

},
expression:
"setting.warehouse_id"}})],



1)],


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
name:"Adress",
rules:{required:true}},

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
"Adress")}},



[
_c("textarea",{
directives:[
{
name:"model",
rawName:
"v-model",
value:
_vm.setting.
CompanyAdress,
expression:
"setting.CompanyAdress"}],


staticClass:
"form-control",
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"Adress-feedback",
placeholder:_vm.$t(
"Afewwords")},


domProps:{
value:
_vm.setting.
CompanyAdress},

on:{
input:function input(
$event)
{
if(
$event.target.
composing)
{
return;
}
_vm.$set(
_vm.setting,
"CompanyAdress",
$event.target.
value);

}}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{
id:
"Adress-feedback"}},


[
_vm._v(
_vm._s(
validationContext.
errors[0]))])],





1)];


}}],


null,
false,
3471601747)})],



1),

_vm._v(" "),
_c(
"b-col",
{
attrs:{lg:"4",md:"4",sm:"12"}},

[
_c("validation-provider",{
attrs:{
name:"initial_invoiceCF",
rules:{required:true}},

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
"initial_invoiceCF")}},



[
_c("b-form-input",{
staticClass:
"form-control",
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"initial_invoiceCF-feedback"},

model:{
value:
_vm.setting.
initial_invoiceCF,
callback:function callback(
$$v)
{
_vm.$set(
_vm.setting,
"initial_invoiceCF",
$$v);

},
expression:
"setting.initial_invoiceCF"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{
id:
"initial_invoiceCF-feedback"}},


[
_vm._v(
_vm._s(
validationContext.
errors[0]))])],





1)];


}}],


null,
false,
1497294452)})],



1),

_vm._v(" "),
_c(
"b-col",
{
attrs:{lg:"4",md:"4",sm:"12"}},

[
_c("validation-provider",{
attrs:{
name:"current_invoiceCF",
rules:{required:true}},

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
"current_invoiceCF")}},



[
_c("b-form-input",{
staticClass:
"form-control",
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"current_invoiceCF-feedback"},

model:{
value:
_vm.setting.
current_invoiceCF,
callback:function callback(
$$v)
{
_vm.$set(
_vm.setting,
"current_invoiceCF",
$$v);

},
expression:
"setting.current_invoiceCF"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{
id:
"current_invoiceCF-feedback"}},


[
_vm._v(
_vm._s(
validationContext.
errors[0]))])],





1)];


}}],


null,
false,
960587764)})],



1),

_vm._v(" "),
_c(
"b-col",
{
attrs:{lg:"4",md:"4",sm:"12"}},

[
_c("validation-provider",{
attrs:{
name:"initial_invoiceCCF",
rules:{required:true}},

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
"initial_invoiceCCF")}},



[
_c("b-form-input",{
staticClass:
"form-control",
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"initial_invoiceCCF-feedback"},

model:{
value:
_vm.setting.
initial_invoiceCCF,
callback:function callback(
$$v)
{
_vm.$set(
_vm.setting,
"initial_invoiceCCF",
$$v);

},
expression:
"setting.initial_invoiceCCF"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{
id:
"initial_invoiceCCF-feedback"}},


[
_vm._v(
_vm._s(
validationContext.
errors[0]))])],





1)];


}}],


null,
false,
2519956084)})],



1),

_vm._v(" "),
_c(
"b-col",
{
attrs:{lg:"4",md:"4",sm:"12"}},

[
_c("validation-provider",{
attrs:{
name:"current_invoiceCCF",
rules:{required:true}},

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
"current_invoiceCCF")}},



[
_c("b-form-input",{
staticClass:
"form-control",
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"current_invoiceCCF-feedback"},

model:{
value:
_vm.setting.
current_invoiceCCF,
callback:function callback(
$$v)
{
_vm.$set(
_vm.setting,
"current_invoiceCCF",
$$v);

},
expression:
"setting.current_invoiceCCF"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{
id:
"current_invoiceCCF-feedback"}},


[
_vm._v(
_vm._s(
validationContext.
errors[0]))])],





1)];


}}],


null,
false,
3409778068)})],



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


1)],


1):

_vm._e(),
_vm._v(" "),
!_vm.isLoading?
_c(
"validation-observer",
{ref:"form_payment"},
[
_c(
"b-form",
{
on:{
submit:function submit($event){
$event.preventDefault();
return _vm.Submit_Payment($event);
}}},


[
_c(
"b-row",
{staticClass:"mt-5"},
[
_c(
"b-col",
{attrs:{lg:"12",md:"12",sm:"12"}},
[
_c(
"b-card",
{
attrs:{
"no-body":"",
header:_vm.$t("Payment_Gateway")}},


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
attrs:{lg:"6",md:"6",sm:"12"}},

[
_c(
"b-form-group",
{attrs:{label:"STRIPE_KEY"}},
[
_c("b-form-input",{
attrs:{
type:"password",
placeholder:_vm.$t(
"LeaveBlank")},


model:{
value:_vm.gateway.stripe_key,
callback:function callback($$v){
_vm.$set(
_vm.gateway,
"stripe_key",
$$v);

},
expression:
"gateway.stripe_key"}})],



1)],


1),

_vm._v(" "),
_c(
"b-col",
{
attrs:{lg:"6",md:"6",sm:"12"}},

[
_c(
"b-form-group",
{
attrs:{label:"STRIPE_SECRET"}},

[
_c("b-form-input",{
attrs:{
type:"password",
placeholder:_vm.$t(
"LeaveBlank")},


model:{
value:
_vm.gateway.stripe_secret,
callback:function callback($$v){
_vm.$set(
_vm.gateway,
"stripe_secret",
$$v);

},
expression:
"gateway.stripe_secret"}})],



1)],


1),

_vm._v(" "),
_c(
"b-col",
{
staticClass:"mt-3 mb-3",
attrs:{md:"6"}},

[
_c(
"label",
{
staticClass:
"switch switch-primary mr-3"},

[
_vm._v(
"\n                       "+
_vm._s(
_vm.$t(
"Remove_Stripe_Key_Secret"))+


"\n                        "),

_c("input",{
directives:[
{
name:"model",
rawName:"v-model",
value:_vm.gateway.deleted,
expression:
"gateway.deleted"}],


attrs:{type:"checkbox"},
domProps:{
checked:Array.isArray(
_vm.gateway.deleted)?

_vm._i(
_vm.gateway.deleted,
null)>
-1:
_vm.gateway.deleted},

on:{
change:function change($event){
var $$a=
_vm.gateway.deleted,
$$el=$event.target,
$$c=$$el.checked?
true:
false;
if(Array.isArray($$a)){
var $$v=null,
$$i=_vm._i($$a,$$v);
if($$el.checked){
$$i<0&&
_vm.$set(
_vm.gateway,
"deleted",
$$a.concat([$$v]));

}else {
$$i>-1&&
_vm.$set(
_vm.gateway,
"deleted",
$$a.
slice(0,$$i).
concat(
$$a.slice(
$$i+1)));



}
}else {
_vm.$set(
_vm.gateway,
"deleted",
$$c);

}
}}}),


_vm._v(" "),
_c("span",{
staticClass:"slider"})])]),





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


1)],


1):

_vm._e(),
_vm._v(" "),
!_vm.isLoading?
_c(
"validation-observer",
{ref:"form_sms"},
[
_c(
"b-form",
{
on:{
submit:function submit($event){
$event.preventDefault();
return _vm.Submit_sms($event);
}}},


[
_c(
"b-row",
{staticClass:"mt-5"},
[
_c(
"b-col",
{attrs:{lg:"12",md:"12",sm:"12"}},
[
_c(
"b-card",
{
attrs:{
"no-body":"",
header:_vm.$t("SMS_Configuration")}},


[
_c(
"b-card-body",
[
_c(
"b-row",
[
_c(
"b-col",
{attrs:{md:"6"}},
[
_c(
"validation-provider",
{attrs:{name:"Gateway"}},
[
_c(
"b-form-group",
{
attrs:{
label:_vm.$t("Gateway")}},


[
_c("v-select",{
attrs:{
reduce:function reduce(label){
return label.value;
},
placeholder:_vm.$t(
"Choose_Gateway"),

options:[
{
label:"Twilio",
value:"Twilio"}]},



model:{
value:_vm.sms.gateway,
callback:function callback($$v){
_vm.$set(
_vm.sms,
"gateway",
$$v);

},
expression:"sms.gateway"}})],



1)],


1)],


1),

_vm._v(" "),
_c(
"b-col",
{
attrs:{lg:"6",md:"6",sm:"12"}},

[
_c("validation-provider",{
attrs:{
name:"TWILIO_SID",
rules:{required:true}},

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
label:"TWILIO_SID"}},


[
_c("b-form-input",{
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"TWILIO_SID-feedback",
label:
"TWILIO_SID"},

model:{
value:
_vm.sms.
TWILIO_SID,
callback:function callback(
$$v)
{
_vm.$set(
_vm.sms,
"TWILIO_SID",
$$v);

},
expression:
"sms.TWILIO_SID"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{
id:
"TWILIO_SID-feedback"}},


[
_vm._v(
_vm._s(
validationContext.
errors[0]))])],





1)];


}}],


null,
false,
3763386067)})],



1),

_vm._v(" "),
_c(
"b-col",
{
attrs:{lg:"6",md:"6",sm:"12"}},

[
_c(
"b-form-group",
{
attrs:{label:"TWILIO_TOKEN"}},

[
_c("b-form-input",{
attrs:{
label:"TWILIO_TOKEN",
placeholder:_vm.$t(
"LeaveBlank")},


model:{
value:_vm.sms.TWILIO_TOKEN,
callback:function callback($$v){
_vm.$set(
_vm.sms,
"TWILIO_TOKEN",
$$v);

},
expression:"sms.TWILIO_TOKEN"}})],



1)],


1),

_vm._v(" "),
_c(
"b-col",
{
attrs:{lg:"6",md:"6",sm:"12"}},

[
_c("validation-provider",{
attrs:{
name:"TWILIO_FROM",
rules:{required:true}},

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
label:"TWILIO_FROM"}},


[
_c("b-form-input",{
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"TWILIO_FROM-feedback",
label:
"TWILIO_FROM"},

model:{
value:
_vm.sms.
TWILIO_FROM,
callback:function callback(
$$v)
{
_vm.$set(
_vm.sms,
"TWILIO_FROM",
$$v);

},
expression:
"sms.TWILIO_FROM"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{
id:
"TWILIO_FROM-feedback"}},


[
_vm._v(
_vm._s(
validationContext.
errors[0]))])],





1)];


}}],


null,
false,
3199732955)})],



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


1)],


1):

_vm._e(),
_vm._v(" "),
!_vm.isLoading?
_c(
"validation-observer",
{ref:"form_smtp"},
[
_c(
"b-form",
{
on:{
submit:function submit($event){
$event.preventDefault();
return _vm.Submit_SMTP($event);
}}},


[
_c(
"b-row",
{staticClass:"mt-5"},
[
_c(
"b-col",
{attrs:{lg:"12",md:"12",sm:"12"}},
[
_c(
"b-card",
{
attrs:{
"no-body":"",
header:_vm.$t("SMTPConfiguration")}},


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
attrs:{lg:"4",md:"4",sm:"12"}},

[
_c("validation-provider",{
attrs:{
name:"HOST",
rules:{required:true}},

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
"HOST")}},



[
_c("b-form-input",{
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"HOST-feedback",
label:"HOST",
placeholder:_vm.$t(
"HOST")},


model:{
value:
_vm.server.host,
callback:function callback(
$$v)
{
_vm.$set(
_vm.server,
"host",
$$v);

},
expression:
"server.host"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{
id:
"HOST-feedback"}},


[
_vm._v(
_vm._s(
validationContext.
errors[0]))])],





1)];


}}],


null,
false,
593553647)})],



1),

_vm._v(" "),
_c(
"b-col",
{
attrs:{lg:"4",md:"4",sm:"12"}},

[
_c("validation-provider",{
attrs:{
name:"PORT",
rules:{required:true}},

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
"PORT")}},



[
_c("b-form-input",{
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"PORT-feedback",
label:"PORT",
placeholder:_vm.$t(
"PORT")},


model:{
value:
_vm.server.port,
callback:function callback(
$$v)
{
_vm.$set(
_vm.server,
"port",
$$v);

},
expression:
"server.port"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{
id:
"PORT-feedback"}},


[
_vm._v(
_vm._s(
validationContext.
errors[0]))])],





1)];


}}],


null,
false,
1686597967)})],



1),

_vm._v(" "),
_c(
"b-col",
{
attrs:{lg:"4",md:"4",sm:"12"}},

[
_c("validation-provider",{
attrs:{
name:"Username",
rules:{required:true}},

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
"username")}},



[
_c("b-form-input",{
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"Username-feedback",
label:"Username",
placeholder:_vm.$t(
"username")},


model:{
value:
_vm.server.
username,
callback:function callback(
$$v)
{
_vm.$set(
_vm.server,
"username",
$$v);

},
expression:
"server.username"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{
id:
"Username-feedback"}},


[
_vm._v(
_vm._s(
validationContext.
errors[0]))])],





1)];


}}],


null,
false,
1793296271)})],



1),

_vm._v(" "),
_c(
"b-col",
{
attrs:{lg:"4",md:"4",sm:"12"}},

[
_c("validation-provider",{
attrs:{
name:"Password",
rules:{required:true}},

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
"password")}},



[
_c("b-form-input",{
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"Password-feedback",
label:"Password",
placeholder:_vm.$t(
"password")},


model:{
value:
_vm.server.
password,
callback:function callback(
$$v)
{
_vm.$set(
_vm.server,
"password",
$$v);

},
expression:
"server.password"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{
id:
"Password-feedback"}},


[
_vm._v(
_vm._s(
validationContext.
errors[0]))])],





1)];


}}],


null,
false,
4152382255)})],



1),

_vm._v(" "),
_c(
"b-col",
{
attrs:{lg:"4",md:"4",sm:"12"}},

[
_c("validation-provider",{
attrs:{
name:"encryption",
rules:{required:true}},

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
"encryption")}},



[
_c("b-form-input",{
attrs:{
state:_vm.getValidationState(
validationContext),

"aria-describedby":
"encryption-feedback",
label:
"encryption",
placeholder:_vm.$t(
"encryption")},


model:{
value:
_vm.server.
encryption,
callback:function callback(
$$v)
{
_vm.$set(
_vm.server,
"encryption",
$$v);

},
expression:
"server.encryption"}}),


_vm._v(" "),
_c(
"b-form-invalid-feedback",
{
attrs:{
id:
"encryption-feedback"}},


[
_vm._v(
_vm._s(
validationContext.
errors[0]))])],





1)];


}}],


null,
false,
3692260559)})],



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


1)],


1):

_vm._e()],

1);

};
var staticRenderFns=[];
render._withStripped=true;



/***/},

/***/"./resources/src/views/app/pages/settings/system_settings.vue":
/*!********************************************************************!*\
  !*** ./resources/src/views/app/pages/settings/system_settings.vue ***!
  \********************************************************************/
/*! exports provided: default */
/***/function resourcesSrcViewsAppPagesSettingsSystem_settingsVue(module,__webpack_exports__,__webpack_require__){
__webpack_require__.r(__webpack_exports__);
/* harmony import */var _system_settings_vue_vue_type_template_id_7bd1aea4___WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(/*! ./system_settings.vue?vue&type=template&id=7bd1aea4& */"./resources/src/views/app/pages/settings/system_settings.vue?vue&type=template&id=7bd1aea4&");
/* harmony import */var _system_settings_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(/*! ./system_settings.vue?vue&type=script&lang=js& */"./resources/src/views/app/pages/settings/system_settings.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony import */var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */"./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component=Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
_system_settings_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
_system_settings_vue_vue_type_template_id_7bd1aea4___WEBPACK_IMPORTED_MODULE_0__["render"],
_system_settings_vue_vue_type_template_id_7bd1aea4___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
false,
null,
null,
null);
component.options.__file="resources/src/views/app/pages/settings/system_settings.vue";
/* harmony default export */__webpack_exports__["default"]=component.exports;

/***/},

/***/"./resources/src/views/app/pages/settings/system_settings.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************!*\
  !*** ./resources/src/views/app/pages/settings/system_settings.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************/
/*! exports provided: default */
/***/function resourcesSrcViewsAppPagesSettingsSystem_settingsVueVueTypeScriptLangJs(module,__webpack_exports__,__webpack_require__){
__webpack_require__.r(__webpack_exports__);
/* harmony import */var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_system_settings_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./system_settings.vue?vue&type=script&lang=js& */"./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/src/views/app/pages/settings/system_settings.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */__webpack_exports__["default"]=_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_system_settings_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"];

/***/},

/***/"./resources/src/views/app/pages/settings/system_settings.vue?vue&type=template&id=7bd1aea4&":
/*!***************************************************************************************************!*\
  !*** ./resources/src/views/app/pages/settings/system_settings.vue?vue&type=template&id=7bd1aea4& ***!
  \***************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/function resourcesSrcViewsAppPagesSettingsSystem_settingsVueVueTypeTemplateId7bd1aea4(module,__webpack_exports__,__webpack_require__){
__webpack_require__.r(__webpack_exports__);
/* harmony import */var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_system_settings_vue_vue_type_template_id_7bd1aea4___WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(/*! -!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./system_settings.vue?vue&type=template&id=7bd1aea4& */"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/src/views/app/pages/settings/system_settings.vue?vue&type=template&id=7bd1aea4&");
/* harmony reexport (safe) */__webpack_require__.d(__webpack_exports__,"render",function(){return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_system_settings_vue_vue_type_template_id_7bd1aea4___WEBPACK_IMPORTED_MODULE_0__["render"];});

/* harmony reexport (safe) */__webpack_require__.d(__webpack_exports__,"staticRenderFns",function(){return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_system_settings_vue_vue_type_template_id_7bd1aea4___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"];});



/***/}}]);

}());
=======
!function(){"use strict";var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function e(t,e){return t(e={exports:{}},e.exports),e.exports}var r=function(t){return t&&t.Math==Math&&t},n=r("object"==typeof globalThis&&globalThis)||r("object"==typeof window&&window)||r("object"==typeof self&&self)||r("object"==typeof t&&t)||function(){return this}()||Function("return this")(),o=function(t){try{return!!t()}catch(t){return!0}},i=!o((function(){return 7!=Object.defineProperty({},1,{get:function(){return 7}})[1]})),a={}.propertyIsEnumerable,s=Object.getOwnPropertyDescriptor,c={f:s&&!a.call({1:2},1)?function(t){var e=s(this,t);return!!e&&e.enumerable}:a},u=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}},l={}.toString,f=function(t){return l.call(t).slice(8,-1)},d="".split,p=o((function(){return!Object("z").propertyIsEnumerable(0)}))?function(t){return"String"==f(t)?d.call(t,""):Object(t)}:Object,v=function(t){if(null==t)throw TypeError("Can't call method on "+t);return t},m=function(t){return p(v(t))},b=function(t){return"object"==typeof t?null!==t:"function"==typeof t},y=function(t,e){if(!b(t))return t;var r,n;if(e&&"function"==typeof(r=t.toString)&&!b(n=r.call(t)))return n;if("function"==typeof(r=t.valueOf)&&!b(n=r.call(t)))return n;if(!e&&"function"==typeof(r=t.toString)&&!b(n=r.call(t)))return n;throw TypeError("Can't convert object to primitive value")},g={}.hasOwnProperty,h=function(t,e){return g.call(t,e)},_=n.document,S=b(_)&&b(_.createElement),w=function(t){return S?_.createElement(t):{}},O=!i&&!o((function(){return 7!=Object.defineProperty(w("div"),"a",{get:function(){return 7}}).a})),k=Object.getOwnPropertyDescriptor,C={f:i?k:function(t,e){if(t=m(t),e=y(e,!0),O)try{return k(t,e)}catch(t){}if(h(t,e))return u(!c.f.call(t,e),t[e])}},T=function(t){if(!b(t))throw TypeError(String(t)+" is not an object");return t},$=Object.defineProperty,P={f:i?$:function(t,e,r){if(T(t),e=y(e,!0),T(r),O)try{return $(t,e,r)}catch(t){}if("get"in r||"set"in r)throw TypeError("Accessors not supported");return"value"in r&&(t[e]=r.value),t}},I=i?function(t,e,r){return P.f(t,e,u(1,r))}:function(t,e,r){return t[e]=r,t},j=function(t,e){try{I(n,t,e)}catch(r){n[t]=e}return e},F=n["__core-js_shared__"]||j("__core-js_shared__",{}),L=Function.toString;"function"!=typeof F.inspectSource&&(F.inspectSource=function(t){return L.call(t)});var E,x,M,D=F.inspectSource,A=n.WeakMap,N="function"==typeof A&&/native code/.test(D(A)),W=e((function(t){(t.exports=function(t,e){return F[t]||(F[t]=void 0!==e?e:{})})("versions",[]).push({version:"3.10.2",mode:"global",copyright:"© 2021 Denis Pushkarev (zloirock.ru)"})})),R=0,V=Math.random(),G=function(t){return"Symbol("+String(void 0===t?"":t)+")_"+(++R+V).toString(36)},U=W("keys"),q=function(t){return U[t]||(U[t]=G(t))},K={},H=n.WeakMap;if(N){var z=F.state||(F.state=new H),B=z.get,J=z.has,Y=z.set;E=function(t,e){if(J.call(z,t))throw new TypeError("Object already initialized");return e.facade=t,Y.call(z,t,e),e},x=function(t){return B.call(z,t)||{}},M=function(t){return J.call(z,t)}}else{var Q=q("state");K[Q]=!0,E=function(t,e){if(h(t,Q))throw new TypeError("Object already initialized");return e.facade=t,I(t,Q,e),e},x=function(t){return h(t,Q)?t[Q]:{}},M=function(t){return h(t,Q)}}var X,Z,tt={set:E,get:x,has:M,enforce:function(t){return M(t)?x(t):E(t,{})},getterFor:function(t){return function(e){var r;if(!b(e)||(r=x(e)).type!==t)throw TypeError("Incompatible receiver, "+t+" required");return r}}},et=e((function(t){var e=tt.get,r=tt.enforce,o=String(String).split("String");(t.exports=function(t,e,i,a){var s,c=!!a&&!!a.unsafe,u=!!a&&!!a.enumerable,l=!!a&&!!a.noTargetGet;"function"==typeof i&&("string"!=typeof e||h(i,"name")||I(i,"name",e),(s=r(i)).source||(s.source=o.join("string"==typeof e?e:""))),t!==n?(c?!l&&t[e]&&(u=!0):delete t[e],u?t[e]=i:I(t,e,i)):u?t[e]=i:j(e,i)})(Function.prototype,"toString",(function(){return"function"==typeof this&&e(this).source||D(this)}))})),rt=n,nt=function(t){return"function"==typeof t?t:void 0},ot=function(t,e){return arguments.length<2?nt(rt[t])||nt(n[t]):rt[t]&&rt[t][e]||n[t]&&n[t][e]},it=Math.ceil,at=Math.floor,st=function(t){return isNaN(t=+t)?0:(t>0?at:it)(t)},ct=Math.min,ut=function(t){return t>0?ct(st(t),9007199254740991):0},lt=Math.max,ft=Math.min,dt=function(t,e){var r=st(t);return r<0?lt(r+e,0):ft(r,e)},pt=function(t){return function(e,r,n){var o,i=m(e),a=ut(i.length),s=dt(n,a);if(t&&r!=r){for(;a>s;)if((o=i[s++])!=o)return!0}else for(;a>s;s++)if((t||s in i)&&i[s]===r)return t||s||0;return!t&&-1}},vt={includes:pt(!0),indexOf:pt(!1)}.indexOf,mt=function(t,e){var r,n=m(t),o=0,i=[];for(r in n)!h(K,r)&&h(n,r)&&i.push(r);for(;e.length>o;)h(n,r=e[o++])&&(~vt(i,r)||i.push(r));return i},bt=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"],yt=bt.concat("length","prototype"),gt={f:Object.getOwnPropertyNames||function(t){return mt(t,yt)}},ht={f:Object.getOwnPropertySymbols},_t=ot("Reflect","ownKeys")||function(t){var e=gt.f(T(t)),r=ht.f;return r?e.concat(r(t)):e},St=function(t,e){for(var r=_t(e),n=P.f,o=C.f,i=0;i<r.length;i++){var a=r[i];h(t,a)||n(t,a,o(e,a))}},wt=/#|\.prototype\./,Ot=function(t,e){var r=Ct[kt(t)];return r==$t||r!=Tt&&("function"==typeof e?o(e):!!e)},kt=Ot.normalize=function(t){return String(t).replace(wt,".").toLowerCase()},Ct=Ot.data={},Tt=Ot.NATIVE="N",$t=Ot.POLYFILL="P",Pt=Ot,It=C.f,jt=function(t,e){var r,o,i,a,s,c=t.target,u=t.global,l=t.stat;if(r=u?n:l?n[c]||j(c,{}):(n[c]||{}).prototype)for(o in e){if(a=e[o],i=t.noTargetGet?(s=It(r,o))&&s.value:r[o],!Pt(u?o:c+(l?".":"#")+o,t.forced)&&void 0!==i){if(typeof a==typeof i)continue;St(a,i)}(t.sham||i&&i.sham)&&I(a,"sham",!0),et(r,o,a,t)}},Ft=function(t){if("function"!=typeof t)throw TypeError(String(t)+" is not a function");return t},Lt=function(t,e,r){if(Ft(t),void 0===e)return t;switch(r){case 0:return function(){return t.call(e)};case 1:return function(r){return t.call(e,r)};case 2:return function(r,n){return t.call(e,r,n)};case 3:return function(r,n,o){return t.call(e,r,n,o)}}return function(){return t.apply(e,arguments)}},Et=function(t){return Object(v(t))},xt=Array.isArray||function(t){return"Array"==f(t)},Mt="process"==f(n.process),Dt=ot("navigator","userAgent")||"",At=n.process,Nt=At&&At.versions,Wt=Nt&&Nt.v8;Wt?Z=(X=Wt.split("."))[0]+X[1]:Dt&&(!(X=Dt.match(/Edge\/(\d+)/))||X[1]>=74)&&(X=Dt.match(/Chrome\/(\d+)/))&&(Z=X[1]);var Rt=Z&&+Z,Vt=!!Object.getOwnPropertySymbols&&!o((function(){return!Symbol.sham&&(Mt?38===Rt:Rt>37&&Rt<41)})),Gt=Vt&&!Symbol.sham&&"symbol"==typeof Symbol.iterator,Ut=W("wks"),qt=n.Symbol,Kt=Gt?qt:qt&&qt.withoutSetter||G,Ht=function(t){return h(Ut,t)&&(Vt||"string"==typeof Ut[t])||(Vt&&h(qt,t)?Ut[t]=qt[t]:Ut[t]=Kt("Symbol."+t)),Ut[t]},zt=Ht("species"),Bt=function(t,e){var r;return xt(t)&&("function"!=typeof(r=t.constructor)||r!==Array&&!xt(r.prototype)?b(r)&&null===(r=r[zt])&&(r=void 0):r=void 0),new(void 0===r?Array:r)(0===e?0:e)},Jt=[].push,Yt=function(t){var e=1==t,r=2==t,n=3==t,o=4==t,i=6==t,a=7==t,s=5==t||i;return function(c,u,l,f){for(var d,v,m=Et(c),b=p(m),y=Lt(u,l,3),g=ut(b.length),h=0,_=f||Bt,S=e?_(c,g):r||a?_(c,0):void 0;g>h;h++)if((s||h in b)&&(v=y(d=b[h],h,m),t))if(e)S[h]=v;else if(v)switch(t){case 3:return!0;case 5:return d;case 6:return h;case 2:Jt.call(S,d)}else switch(t){case 4:return!1;case 7:Jt.call(S,d)}return i?-1:n||o?o:S}},Qt={forEach:Yt(0),map:Yt(1),filter:Yt(2),some:Yt(3),every:Yt(4),find:Yt(5),findIndex:Yt(6),filterOut:Yt(7)},Xt=Ht("species"),Zt=function(t){return Rt>=51||!o((function(){var e=[];return(e.constructor={})[Xt]=function(){return{foo:1}},1!==e[t](Boolean).foo}))},te=Qt.map;jt({target:"Array",proto:!0,forced:!Zt("map")},{map:function(t){return te(this,t,arguments.length>1?arguments[1]:void 0)}});var ee=P.f,re=Function.prototype,ne=re.toString,oe=/^\s*function ([^ (]*)/;i&&!("name"in re)&&ee(re,"name",{configurable:!0,get:function(){try{return ne.call(this).match(oe)[1]}catch(t){return""}}});var ie=function(t,e,r){var n=y(e);n in t?P.f(t,n,u(0,r)):t[n]=r},ae=Ht("isConcatSpreadable"),se=Rt>=51||!o((function(){var t=[];return t[ae]=!1,t.concat()[0]!==t})),ce=Zt("concat"),ue=function(t){if(!b(t))return!1;var e=t[ae];return void 0!==e?!!e:xt(t)};jt({target:"Array",proto:!0,forced:!se||!ce},{concat:function(t){var e,r,n,o,i,a=Et(this),s=Bt(a,0),c=0;for(e=-1,n=arguments.length;e<n;e++)if(ue(i=-1===e?a:arguments[e])){if(c+(o=ut(i.length))>9007199254740991)throw TypeError("Maximum allowed index exceeded");for(r=0;r<o;r++,c++)r in i&&ie(s,c,i[r])}else{if(c>=9007199254740991)throw TypeError("Maximum allowed index exceeded");ie(s,c++,i)}return s.length=c,s}});var le=Zt("slice"),fe=Ht("species"),de=[].slice,pe=Math.max;jt({target:"Array",proto:!0,forced:!le},{slice:function(t,e){var r,n,o,i=m(this),a=ut(i.length),s=dt(t,a),c=dt(void 0===e?a:e,a);if(xt(i)&&("function"!=typeof(r=i.constructor)||r!==Array&&!xt(r.prototype)?b(r)&&null===(r=r[fe])&&(r=void 0):r=void 0,r===Array||void 0===r))return de.call(i,s,c);for(n=new(void 0===r?Array:r)(pe(c-s,0)),o=0;s<c;s++,o++)s in i&&ie(n,o,i[s]);return n.length=o,n}});var ve={};ve[Ht("toStringTag")]="z";var me="[object z]"===String(ve),be=Ht("toStringTag"),ye="Arguments"==f(function(){return arguments}()),ge=me?f:function(t){var e,r,n;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(r=function(t,e){try{return t[e]}catch(t){}}(e=Object(t),be))?r:ye?f(e):"Object"==(n=f(e))&&"function"==typeof e.callee?"Arguments":n},he=me?{}.toString:function(){return"[object "+ge(this)+"]"};me||et(Object.prototype,"toString",he,{unsafe:!0});var _e=n.Promise,Se=P.f,we=Ht("toStringTag"),Oe=function(t,e,r){t&&!h(t=r?t:t.prototype,we)&&Se(t,we,{configurable:!0,value:e})},ke=Ht("species"),Ce={},Te=Ht("iterator"),$e=Array.prototype,Pe=Ht("iterator"),Ie=function(t){var e=t.return;if(void 0!==e)return T(e.call(t)).value},je=function(t,e){this.stopped=t,this.result=e},Fe=function(t,e,r){var n,o,i,a,s,c,u,l,f=r&&r.that,d=!(!r||!r.AS_ENTRIES),p=!(!r||!r.IS_ITERATOR),v=!(!r||!r.INTERRUPTED),m=Lt(e,f,1+d+v),b=function(t){return n&&Ie(n),new je(!0,t)},y=function(t){return d?(T(t),v?m(t[0],t[1],b):m(t[0],t[1])):v?m(t,b):m(t)};if(p)n=t;else{if("function"!=typeof(o=function(t){if(null!=t)return t[Pe]||t["@@iterator"]||Ce[ge(t)]}(t)))throw TypeError("Target is not iterable");if(void 0!==(l=o)&&(Ce.Array===l||$e[Te]===l)){for(i=0,a=ut(t.length);a>i;i++)if((s=y(t[i]))&&s instanceof je)return s;return new je(!1)}n=o.call(t)}for(c=n.next;!(u=c.call(n)).done;){try{s=y(u.value)}catch(t){throw Ie(n),t}if("object"==typeof s&&s&&s instanceof je)return s}return new je(!1)},Le=Ht("iterator"),Ee=!1;try{var xe=0,Me={next:function(){return{done:!!xe++}},return:function(){Ee=!0}};Me[Le]=function(){return this},Array.from(Me,(function(){throw 2}))}catch(t){}var De,Ae,Ne,We=Ht("species"),Re=ot("document","documentElement"),Ve=/(?:iphone|ipod|ipad).*applewebkit/i.test(Dt),Ge=n.location,Ue=n.setImmediate,qe=n.clearImmediate,Ke=n.process,He=n.MessageChannel,ze=n.Dispatch,Be=0,Je={},Ye=function(t){if(Je.hasOwnProperty(t)){var e=Je[t];delete Je[t],e()}},Qe=function(t){return function(){Ye(t)}},Xe=function(t){Ye(t.data)},Ze=function(t){n.postMessage(t+"",Ge.protocol+"//"+Ge.host)};Ue&&qe||(Ue=function(t){for(var e=[],r=1;arguments.length>r;)e.push(arguments[r++]);return Je[++Be]=function(){("function"==typeof t?t:Function(t)).apply(void 0,e)},De(Be),Be},qe=function(t){delete Je[t]},Mt?De=function(t){Ke.nextTick(Qe(t))}:ze&&ze.now?De=function(t){ze.now(Qe(t))}:He&&!Ve?(Ne=(Ae=new He).port2,Ae.port1.onmessage=Xe,De=Lt(Ne.postMessage,Ne,1)):n.addEventListener&&"function"==typeof postMessage&&!n.importScripts&&Ge&&"file:"!==Ge.protocol&&!o(Ze)?(De=Ze,n.addEventListener("message",Xe,!1)):De="onreadystatechange"in w("script")?function(t){Re.appendChild(w("script")).onreadystatechange=function(){Re.removeChild(this),Ye(t)}}:function(t){setTimeout(Qe(t),0)});var tr,er,rr,nr,or,ir,ar,sr,cr={set:Ue,clear:qe},ur=/web0s(?!.*chrome)/i.test(Dt),lr=C.f,fr=cr.set,dr=n.MutationObserver||n.WebKitMutationObserver,pr=n.document,vr=n.process,mr=n.Promise,br=lr(n,"queueMicrotask"),yr=br&&br.value;yr||(tr=function(){var t,e;for(Mt&&(t=vr.domain)&&t.exit();er;){e=er.fn,er=er.next;try{e()}catch(t){throw er?nr():rr=void 0,t}}rr=void 0,t&&t.enter()},Ve||Mt||ur||!dr||!pr?mr&&mr.resolve?(ar=mr.resolve(void 0),sr=ar.then,nr=function(){sr.call(ar,tr)}):nr=Mt?function(){vr.nextTick(tr)}:function(){fr.call(n,tr)}:(or=!0,ir=pr.createTextNode(""),new dr(tr).observe(ir,{characterData:!0}),nr=function(){ir.data=or=!or}));var gr,hr,_r,Sr,wr=yr||function(t){var e={fn:t,next:void 0};rr&&(rr.next=e),er||(er=e,nr()),rr=e},Or=function(t){var e,r;this.promise=new t((function(t,n){if(void 0!==e||void 0!==r)throw TypeError("Bad Promise constructor");e=t,r=n})),this.resolve=Ft(e),this.reject=Ft(r)},kr={f:function(t){return new Or(t)}},Cr=function(t,e){if(T(t),b(e)&&e.constructor===t)return e;var r=kr.f(t);return(0,r.resolve)(e),r.promise},Tr=function(t){try{return{error:!1,value:t()}}catch(t){return{error:!0,value:t}}},$r=cr.set,Pr=Ht("species"),Ir="Promise",jr=tt.get,Fr=tt.set,Lr=tt.getterFor(Ir),Er=_e,xr=n.TypeError,Mr=n.document,Dr=n.process,Ar=ot("fetch"),Nr=kr.f,Wr=Nr,Rr=!!(Mr&&Mr.createEvent&&n.dispatchEvent),Vr="function"==typeof PromiseRejectionEvent,Gr=Pt(Ir,(function(){if(!(D(Er)!==String(Er))){if(66===Rt)return!0;if(!Mt&&!Vr)return!0}if(Rt>=51&&/native code/.test(Er))return!1;var t=Er.resolve(1),e=function(t){t((function(){}),(function(){}))};return(t.constructor={})[Pr]=e,!(t.then((function(){}))instanceof e)})),Ur=Gr||!function(t,e){if(!e&&!Ee)return!1;var r=!1;try{var n={};n[Le]=function(){return{next:function(){return{done:r=!0}}}},t(n)}catch(t){}return r}((function(t){Er.all(t).catch((function(){}))})),qr=function(t){var e;return!(!b(t)||"function"!=typeof(e=t.then))&&e},Kr=function(t,e){if(!t.notified){t.notified=!0;var r=t.reactions;wr((function(){for(var n=t.value,o=1==t.state,i=0;r.length>i;){var a,s,c,u=r[i++],l=o?u.ok:u.fail,f=u.resolve,d=u.reject,p=u.domain;try{l?(o||(2===t.rejection&&Jr(t),t.rejection=1),!0===l?a=n:(p&&p.enter(),a=l(n),p&&(p.exit(),c=!0)),a===u.promise?d(xr("Promise-chain cycle")):(s=qr(a))?s.call(a,f,d):f(a)):d(n)}catch(t){p&&!c&&p.exit(),d(t)}}t.reactions=[],t.notified=!1,e&&!t.rejection&&zr(t)}))}},Hr=function(t,e,r){var o,i;Rr?((o=Mr.createEvent("Event")).promise=e,o.reason=r,o.initEvent(t,!1,!0),n.dispatchEvent(o)):o={promise:e,reason:r},!Vr&&(i=n["on"+t])?i(o):"unhandledrejection"===t&&function(t,e){var r=n.console;r&&r.error&&(1===arguments.length?r.error(t):r.error(t,e))}("Unhandled promise rejection",r)},zr=function(t){$r.call(n,(function(){var e,r=t.facade,n=t.value;if(Br(t)&&(e=Tr((function(){Mt?Dr.emit("unhandledRejection",n,r):Hr("unhandledrejection",r,n)})),t.rejection=Mt||Br(t)?2:1,e.error))throw e.value}))},Br=function(t){return 1!==t.rejection&&!t.parent},Jr=function(t){$r.call(n,(function(){var e=t.facade;Mt?Dr.emit("rejectionHandled",e):Hr("rejectionhandled",e,t.value)}))},Yr=function(t,e,r){return function(n){t(e,n,r)}},Qr=function(t,e,r){t.done||(t.done=!0,r&&(t=r),t.value=e,t.state=2,Kr(t,!0))},Xr=function(t,e,r){if(!t.done){t.done=!0,r&&(t=r);try{if(t.facade===e)throw xr("Promise can't be resolved itself");var n=qr(e);n?wr((function(){var r={done:!1};try{n.call(e,Yr(Xr,r,t),Yr(Qr,r,t))}catch(e){Qr(r,e,t)}})):(t.value=e,t.state=1,Kr(t,!1))}catch(e){Qr({done:!1},e,t)}}};Gr&&(Er=function(t){!function(t,e,r){if(!(t instanceof e))throw TypeError("Incorrect "+(r?r+" ":"")+"invocation")}(this,Er,Ir),Ft(t),gr.call(this);var e=jr(this);try{t(Yr(Xr,e),Yr(Qr,e))}catch(t){Qr(e,t)}},(gr=function(t){Fr(this,{type:Ir,done:!1,notified:!1,parent:!1,reactions:[],rejection:!1,state:0,value:void 0})}).prototype=function(t,e,r){for(var n in e)et(t,n,e[n],r);return t}(Er.prototype,{then:function(t,e){var r,n,o,i=Lr(this),a=Nr((r=Er,void 0===(o=T(this).constructor)||null==(n=T(o)[We])?r:Ft(n)));return a.ok="function"!=typeof t||t,a.fail="function"==typeof e&&e,a.domain=Mt?Dr.domain:void 0,i.parent=!0,i.reactions.push(a),0!=i.state&&Kr(i,!1),a.promise},catch:function(t){return this.then(void 0,t)}}),hr=function(){var t=new gr,e=jr(t);this.promise=t,this.resolve=Yr(Xr,e),this.reject=Yr(Qr,e)},kr.f=Nr=function(t){return t===Er||t===_r?new hr(t):Wr(t)},"function"==typeof _e&&(Sr=_e.prototype.then,et(_e.prototype,"then",(function(t,e){var r=this;return new Er((function(t,e){Sr.call(r,t,e)})).then(t,e)}),{unsafe:!0}),"function"==typeof Ar&&jt({global:!0,enumerable:!0,forced:!0},{fetch:function(t){return Cr(Er,Ar.apply(n,arguments))}}))),jt({global:!0,wrap:!0,forced:Gr},{Promise:Er}),Oe(Er,Ir,!1),function(t){var e=ot(t),r=P.f;i&&e&&!e[ke]&&r(e,ke,{configurable:!0,get:function(){return this}})}(Ir),_r=ot(Ir),jt({target:Ir,stat:!0,forced:Gr},{reject:function(t){var e=Nr(this);return e.reject.call(void 0,t),e.promise}}),jt({target:Ir,stat:!0,forced:Gr},{resolve:function(t){return Cr(this,t)}}),jt({target:Ir,stat:!0,forced:Ur},{all:function(t){var e=this,r=Nr(e),n=r.resolve,o=r.reject,i=Tr((function(){var r=Ft(e.resolve),i=[],a=0,s=1;Fe(t,(function(t){var c=a++,u=!1;i.push(void 0),s++,r.call(e,t).then((function(t){u||(u=!0,i[c]=t,--s||n(i))}),o)})),--s||n(i)}));return i.error&&o(i.value),r.promise},race:function(t){var e=this,r=Nr(e),n=r.reject,o=Tr((function(){var o=Ft(e.resolve);Fe(t,(function(t){o.call(e,t).then(r.resolve,n)}))}));return o.error&&n(o.value),r.promise}});var Zr=Object.keys||function(t){return mt(t,bt)};jt({target:"Object",stat:!0,forced:o((function(){Zr(1)}))},{keys:function(t){return Zr(Et(t))}});var tn,en=i?Object.defineProperties:function(t,e){T(t);for(var r,n=Zr(e),o=n.length,i=0;o>i;)P.f(t,r=n[i++],e[r]);return t},rn=q("IE_PROTO"),nn=function(){},on=function(t){return"<script>"+t+"<\/script>"},an=function(){try{tn=document.domain&&new ActiveXObject("htmlfile")}catch(t){}var t,e;an=tn?function(t){t.write(on("")),t.close();var e=t.parentWindow.Object;return t=null,e}(tn):((e=w("iframe")).style.display="none",Re.appendChild(e),e.src=String("javascript:"),(t=e.contentWindow.document).open(),t.write(on("document.F=Object")),t.close(),t.F);for(var r=bt.length;r--;)delete an.prototype[bt[r]];return an()};K[rn]=!0;var sn=Object.create||function(t,e){var r;return null!==t?(nn.prototype=T(t),r=new nn,nn.prototype=null,r[rn]=t):r=an(),void 0===e?r:en(r,e)},cn=gt.f,un={}.toString,ln="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],fn={f:function(t){return ln&&"[object Window]"==un.call(t)?function(t){try{return cn(t)}catch(t){return ln.slice()}}(t):cn(m(t))}},dn={f:Ht},pn=P.f,vn=Qt.forEach,mn=q("hidden"),bn=Ht("toPrimitive"),yn=tt.set,gn=tt.getterFor("Symbol"),hn=Object.prototype,_n=n.Symbol,Sn=ot("JSON","stringify"),wn=C.f,On=P.f,kn=fn.f,Cn=c.f,Tn=W("symbols"),$n=W("op-symbols"),Pn=W("string-to-symbol-registry"),In=W("symbol-to-string-registry"),jn=W("wks"),Fn=n.QObject,Ln=!Fn||!Fn.prototype||!Fn.prototype.findChild,En=i&&o((function(){return 7!=sn(On({},"a",{get:function(){return On(this,"a",{value:7}).a}})).a}))?function(t,e,r){var n=wn(hn,e);n&&delete hn[e],On(t,e,r),n&&t!==hn&&On(hn,e,n)}:On,xn=function(t,e){var r=Tn[t]=sn(_n.prototype);return yn(r,{type:"Symbol",tag:t,description:e}),i||(r.description=e),r},Mn=Gt?function(t){return"symbol"==typeof t}:function(t){return Object(t)instanceof _n},Dn=function(t,e,r){t===hn&&Dn($n,e,r),T(t);var n=y(e,!0);return T(r),h(Tn,n)?(r.enumerable?(h(t,mn)&&t[mn][n]&&(t[mn][n]=!1),r=sn(r,{enumerable:u(0,!1)})):(h(t,mn)||On(t,mn,u(1,{})),t[mn][n]=!0),En(t,n,r)):On(t,n,r)},An=function(t,e){T(t);var r=m(e),n=Zr(r).concat(Vn(r));return vn(n,(function(e){i&&!Nn.call(r,e)||Dn(t,e,r[e])})),t},Nn=function(t){var e=y(t,!0),r=Cn.call(this,e);return!(this===hn&&h(Tn,e)&&!h($n,e))&&(!(r||!h(this,e)||!h(Tn,e)||h(this,mn)&&this[mn][e])||r)},Wn=function(t,e){var r=m(t),n=y(e,!0);if(r!==hn||!h(Tn,n)||h($n,n)){var o=wn(r,n);return!o||!h(Tn,n)||h(r,mn)&&r[mn][n]||(o.enumerable=!0),o}},Rn=function(t){var e=kn(m(t)),r=[];return vn(e,(function(t){h(Tn,t)||h(K,t)||r.push(t)})),r},Vn=function(t){var e=t===hn,r=kn(e?$n:m(t)),n=[];return vn(r,(function(t){!h(Tn,t)||e&&!h(hn,t)||n.push(Tn[t])})),n};(Vt||(et((_n=function(){if(this instanceof _n)throw TypeError("Symbol is not a constructor");var t=arguments.length&&void 0!==arguments[0]?String(arguments[0]):void 0,e=G(t),r=function(t){this===hn&&r.call($n,t),h(this,mn)&&h(this[mn],e)&&(this[mn][e]=!1),En(this,e,u(1,t))};return i&&Ln&&En(hn,e,{configurable:!0,set:r}),xn(e,t)}).prototype,"toString",(function(){return gn(this).tag})),et(_n,"withoutSetter",(function(t){return xn(G(t),t)})),c.f=Nn,P.f=Dn,C.f=Wn,gt.f=fn.f=Rn,ht.f=Vn,dn.f=function(t){return xn(Ht(t),t)},i&&(On(_n.prototype,"description",{configurable:!0,get:function(){return gn(this).description}}),et(hn,"propertyIsEnumerable",Nn,{unsafe:!0}))),jt({global:!0,wrap:!0,forced:!Vt,sham:!Vt},{Symbol:_n}),vn(Zr(jn),(function(t){!function(t){var e=rt.Symbol||(rt.Symbol={});h(e,t)||pn(e,t,{value:dn.f(t)})}(t)})),jt({target:"Symbol",stat:!0,forced:!Vt},{for:function(t){var e=String(t);if(h(Pn,e))return Pn[e];var r=_n(e);return Pn[e]=r,In[r]=e,r},keyFor:function(t){if(!Mn(t))throw TypeError(t+" is not a symbol");if(h(In,t))return In[t]},useSetter:function(){Ln=!0},useSimple:function(){Ln=!1}}),jt({target:"Object",stat:!0,forced:!Vt,sham:!i},{create:function(t,e){return void 0===e?sn(t):An(sn(t),e)},defineProperty:Dn,defineProperties:An,getOwnPropertyDescriptor:Wn}),jt({target:"Object",stat:!0,forced:!Vt},{getOwnPropertyNames:Rn,getOwnPropertySymbols:Vn}),jt({target:"Object",stat:!0,forced:o((function(){ht.f(1)}))},{getOwnPropertySymbols:function(t){return ht.f(Et(t))}}),Sn)&&jt({target:"JSON",stat:!0,forced:!Vt||o((function(){var t=_n();return"[null]"!=Sn([t])||"{}"!=Sn({a:t})||"{}"!=Sn(Object(t))}))},{stringify:function(t,e,r){for(var n,o=[t],i=1;arguments.length>i;)o.push(arguments[i++]);if(n=e,(b(e)||void 0!==t)&&!Mn(t))return xt(e)||(e=function(t,e){if("function"==typeof n&&(e=n.call(this,t,e)),!Mn(e))return e}),o[1]=e,Sn.apply(null,o)}});_n.prototype[bn]||I(_n.prototype,bn,_n.prototype.valueOf),Oe(_n,"Symbol"),K[mn]=!0;var Gn=Qt.filter;jt({target:"Array",proto:!0,forced:!Zt("filter")},{filter:function(t){return Gn(this,t,arguments.length>1?arguments[1]:void 0)}});var Un=C.f,qn=o((function(){Un(1)}));jt({target:"Object",stat:!0,forced:!i||qn,sham:!i},{getOwnPropertyDescriptor:function(t,e){return Un(m(t),e)}});var Kn,Hn,zn=Qt.forEach,Bn=!!(Hn=[]["forEach"])&&o((function(){Hn.call(null,Kn||function(){throw 1},1)}))?[].forEach:function(t){return zn(this,t,arguments.length>1?arguments[1]:void 0)};for(var Jn in{CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0}){var Yn=n[Jn],Qn=Yn&&Yn.prototype;if(Qn&&Qn.forEach!==Bn)try{I(Qn,"forEach",Bn)}catch(t){Qn.forEach=Bn}}jt({target:"Object",stat:!0,sham:!i},{getOwnPropertyDescriptors:function(t){for(var e,r,n=m(t),o=C.f,i=_t(n),a={},s=0;i.length>s;)void 0!==(r=o(n,e=i[s++]))&&ie(a,e,r);return a}}),(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{1357:function(t,e,r){r.r(e);var n=r(13),o=r.n(n),i=r(4),a=r(0),s=r.n(a);function c(t,e,r,n,o,i,a){try{var s=t[i](a),c=s.value}catch(t){return void r(t)}s.done?e(c):Promise.resolve(c).then(n,o)}function u(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function l(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?u(Object(r),!0).forEach((function(e){f(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):u(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function f(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}var d={metaInfo:{title:"System Settings"},data:function(){return{isLoading:!0,data:new FormData,settings:[],currencies:[],clients:[],warehouses:[],setting:{currency_id:"",client_id:"",warehouse_id:"",email:"",logo:"",CompanyName:"",CompanyPhone:"",CompanyAdress:"",footer:"",developed_by:"",initial_invoiceCF:"",current_invoiceCF:"",initial_invoiceCCF:"",current_invoiceCCF:""},gateway:{stripe_key:"",stripe_secret:"",deleted:!1},sms:{gateway:"Twilio",TWILIO_SID:"",TWILIO_TOKEN:"",TWILIO_FROM:""},server:{host:"",port:"",username:"",password:"",encryption:""}}},methods:l(l({},Object(i.b)(["refreshUserPermissions"])),{},{Submit_Setting:function(){var t=this;this.$refs.form_setting.validate().then((function(e){e?t.Update_Settings():t.makeToast("danger",t.$t("Please_fill_the_form_correctly"),t.$t("Failed"))}))},Submit_SMTP:function(){var t=this;this.$refs.form_smtp.validate().then((function(e){e?t.Update_Smtp():t.makeToast("danger",t.$t("Please_fill_the_form_correctly"),t.$t("Failed"))}))},Submit_Payment:function(){var t=this;this.$refs.form_payment.validate().then((function(e){e?t.Update_Payment():t.makeToast("danger",t.$t("Please_fill_the_form_correctly"),t.$t("Failed"))}))},Submit_sms:function(){var t=this;this.$refs.form_sms.validate().then((function(e){e?t.Update_SMS():t.makeToast("danger",t.$t("Please_fill_the_form_correctly"),t.$t("Failed"))}))},makeToast:function(t,e,r){this.$root.$bvToast.toast(e,{title:r,variant:t,solid:!0})},getValidationState:function(t){var e=t.dirty,r=t.validated,n=t.valid;return e||r?void 0===n?null:n:null},onFileSelected:function(t){var e,r=this;return(e=o.a.mark((function e(){var n,i;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r.$refs.Logo.validate(t);case 2:n=e.sent,i=n.valid,r.setting.logo=i?t.target.files[0]:"";case 5:case"end":return e.stop()}}),e)})),function(){var t=this,r=arguments;return new Promise((function(n,o){var i=e.apply(t,r);function a(t){c(i,n,o,a,s,"next",t)}function s(t){c(i,n,o,a,s,"throw",t)}a(void 0)}))})()},Update_Settings:function(){var t=this;s.a.start(),s.a.set(.1);this.data.append("currency",this.setting.currency_id),this.data.append("client",this.setting.client_id),this.data.append("warehouse",this.setting.warehouse_id),this.data.append("email",this.setting.email),this.data.append("logo",this.setting.logo),this.data.append("CompanyName",this.setting.CompanyName),this.data.append("CompanyPhone",this.setting.CompanyPhone),this.data.append("CompanyAdress",this.setting.CompanyAdress),this.data.append("footer",this.setting.footer),this.data.append("initial_invoiceCF",this.setting.initial_invoiceCF),this.data.append("current_invoiceCF",this.setting.current_invoiceCF),this.data.append("initial_invoiceCCF",this.setting.initial_invoiceCCF),this.data.append("current_invoiceCCF",this.setting.current_invoiceCCF),this.data.append("developed_by",this.setting.developed_by),this.data.append("_method","put"),axios.post("settings/"+this.setting.id,this.data).then((function(e){Fire.$emit("Event_Setting"),t.makeToast("success",t.$t("Successfully_Updated"),t.$t("Success")),t.refreshUserPermissions(),s.a.done()})).catch((function(e){t.makeToast("danger",t.$t("InvalidData"),t.$t("Failed")),s.a.done()}))},Update_Smtp:function(){var t=this;s.a.start(),s.a.set(.1),axios.put("SMTP/"+this.server.id,{host:this.server.host,port:this.server.port,username:this.server.username,password:this.server.password,encryption:this.server.encryption}).then((function(e){Fire.$emit("Event_Smtp"),t.makeToast("success",t.$t("Successfully_Updated"),t.$t("Success")),s.a.done()})).catch((function(e){s.a.done(),t.makeToast("danger",t.$t("InvalidData"),t.$t("Failed"))}))},Update_Payment:function(){var t=this;s.a.start(),s.a.set(.1),axios.post("payment_gateway",{stripe_key:this.gateway.stripe_key,stripe_secret:this.gateway.stripe_secret,deleted:this.gateway.deleted}).then((function(e){Fire.$emit("Event_payment"),t.makeToast("success",t.$t("Successfully_Updated"),t.$t("Success")),s.a.done()})).catch((function(e){s.a.done(),t.makeToast("danger",t.$t("InvalidData"),t.$t("Failed"))}))},Update_SMS:function(){var t=this;s.a.start(),s.a.set(.1),axios.post("sms_config",{TWILIO_SID:this.sms.TWILIO_SID,TWILIO_TOKEN:this.sms.TWILIO_TOKEN,TWILIO_FROM:this.sms.TWILIO_FROM}).then((function(e){Fire.$emit("Event_sms"),t.makeToast("success",t.$t("Successfully_Updated"),t.$t("Success")),s.a.done()})).catch((function(e){s.a.done(),t.makeToast("danger",t.$t("InvalidData"),t.$t("Failed"))}))},get_sms_config:function(){var t=this;axios.get("get_sms_config").then((function(e){t.sms=e.data.sms})).catch((function(t){}))},Get_Payment_Gateway:function(){var t=this;axios.get("Get_payment_gateway").then((function(e){t.gateway=e.data.gateway})).catch((function(t){}))},Get_Settings:function(){var t=this;axios.get("getSettings").then((function(e){t.setting=e.data.settings,t.currencies=e.data.currencies,t.clients=e.data.clients,t.warehouses=e.data.warehouses,t.Get_SMTP(),t.Get_Payment_Gateway(),t.get_sms_config(),t.isLoading=!1})).catch((function(e){setTimeout((function(){t.isLoading=!1}),500)}))},Get_SMTP:function(){var t=this;axios.get("getSMTP").then((function(e){t.server=e.data.server})).catch((function(t){}))}}),created:function(){var t=this;this.Get_Settings(),Fire.$on("Event_Smtp",(function(){t.Get_SMTP()})),Fire.$on("Event_payment",(function(){t.Get_Payment_Gateway()})),Fire.$on("Event_Setting",(function(){t.Get_Settings()})),Fire.$on("Event_sms",(function(){t.get_sms_config()}))}},p=r(2),v=Object(p.a)(d,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"main-content"},[r("breadcumb",{attrs:{page:t.$t("SystemSettings"),folder:t.$t("Settings")}}),t._v(" "),t.isLoading?r("div",{staticClass:"loading_page spinner spinner-primary mr-3"}):t._e(),t._v(" "),t.isLoading?t._e():r("validation-observer",{ref:"form_setting"},[r("b-form",{on:{submit:function(e){return e.preventDefault(),t.Submit_Setting(e)}}},[r("b-row",[r("b-col",{attrs:{lg:"12",md:"12",sm:"12"}},[r("b-card",{attrs:{"no-body":"",header:t.$t("SystemSettings")}},[r("b-card-body",[r("b-row",[r("b-col",{attrs:{lg:"4",md:"4",sm:"12"}},[r("b-form-group",{attrs:{label:t.$t("DefaultCurrency")}},[r("v-select",{attrs:{reduce:function(t){return t.value},placeholder:t.$t("Choose_Currency"),options:t.currencies.map((function(t){return{label:t.name,value:t.id}}))},model:{value:t.setting.currency_id,callback:function(e){t.$set(t.setting,"currency_id",e)},expression:"setting.currency_id"}})],1)],1),t._v(" "),r("b-col",{attrs:{lg:"4",md:"4",sm:"12"}},[r("validation-provider",{attrs:{name:"Email",rules:{required:!0}},scopedSlots:t._u([{key:"default",fn:function(e){return[r("b-form-group",{attrs:{label:t.$t("DefaultEmail")}},[r("b-form-input",{attrs:{state:t.getValidationState(e),"aria-describedby":"Email-feedback",label:"Email",placeholder:t.$t("DefaultEmail")},model:{value:t.setting.email,callback:function(e){t.$set(t.setting,"email",e)},expression:"setting.email"}}),t._v(" "),r("b-form-invalid-feedback",{attrs:{id:"Email-feedback"}},[t._v(t._s(e.errors[0]))])],1)]}}],null,!1,2739386684)})],1),t._v(" "),r("b-col",{attrs:{lg:"4",md:"4",sm:"12"}},[r("validation-provider",{ref:"Logo",attrs:{name:"Logo",rules:"mimes:image/*|size:200"},scopedSlots:t._u([{key:"default",fn:function(e){e.validate;var n=e.valid,o=e.errors;return r("b-form-group",{attrs:{label:t.$t("ChangeLogo")}},[r("input",{class:{"is-invalid":!!o.length},attrs:{state:!o[0]&&(!!n||null),label:"Choose Logo",type:"file"},on:{change:t.onFileSelected}}),t._v(" "),r("b-form-invalid-feedback",{attrs:{id:"Logo-feedback"}},[t._v(t._s(o[0]))])],1)}}],null,!1,3189141354)})],1),t._v(" "),r("b-col",{attrs:{lg:"4",md:"4",sm:"12"}},[r("validation-provider",{attrs:{name:"Company Name",rules:{required:!0}},scopedSlots:t._u([{key:"default",fn:function(e){return[r("b-form-group",{attrs:{label:t.$t("CompanyName")}},[r("b-form-input",{attrs:{state:t.getValidationState(e),"aria-describedby":"Company-feedback",label:"Company Name",placeholder:t.$t("CompanyName")},model:{value:t.setting.CompanyName,callback:function(e){t.$set(t.setting,"CompanyName",e)},expression:"setting.CompanyName"}}),t._v(" "),r("b-form-invalid-feedback",{attrs:{id:"Company-feedback"}},[t._v(t._s(e.errors[0]))])],1)]}}],null,!1,2474740188)})],1),t._v(" "),r("b-col",{attrs:{lg:"4",md:"4",sm:"12"}},[r("validation-provider",{attrs:{name:"Company Phone",rules:{required:!0}},scopedSlots:t._u([{key:"default",fn:function(e){return[r("b-form-group",{attrs:{label:t.$t("CompanyPhone")}},[r("b-form-input",{attrs:{state:t.getValidationState(e),"aria-describedby":"Phone-feedback",label:"Company Phone",placeholder:t.$t("CompanyPhone")},model:{value:t.setting.CompanyPhone,callback:function(e){t.$set(t.setting,"CompanyPhone",e)},expression:"setting.CompanyPhone"}}),t._v(" "),r("b-form-invalid-feedback",{attrs:{id:"Phone-feedback"}},[t._v(t._s(e.errors[0]))])],1)]}}],null,!1,1732497948)})],1),t._v(" "),r("b-col",{attrs:{lg:"4",md:"4",sm:"12"}},[r("validation-provider",{attrs:{name:"developed by",rules:{required:!0}},scopedSlots:t._u([{key:"default",fn:function(e){return[r("b-form-group",{attrs:{label:t.$t("developed_by")}},[r("b-form-input",{staticClass:"form-control",attrs:{state:t.getValidationState(e),"aria-describedby":"developed_by-feedback"},model:{value:t.setting.developed_by,callback:function(e){t.$set(t.setting,"developed_by",e)},expression:"setting.developed_by"}}),t._v(" "),r("b-form-invalid-feedback",{attrs:{id:"developed_by-feedback"}},[t._v(t._s(e.errors[0]))])],1)]}}],null,!1,442954484)})],1),t._v(" "),r("b-col",{attrs:{lg:"4",md:"4",sm:"12"}},[r("validation-provider",{attrs:{name:"footer",rules:{required:!0}},scopedSlots:t._u([{key:"default",fn:function(e){return[r("b-form-group",{attrs:{label:t.$t("footer")}},[r("b-form-input",{staticClass:"form-control",attrs:{state:t.getValidationState(e),"aria-describedby":"footer-feedback"},model:{value:t.setting.footer,callback:function(e){t.$set(t.setting,"footer",e)},expression:"setting.footer"}}),t._v(" "),r("b-form-invalid-feedback",{attrs:{id:"footer-feedback"}},[t._v(t._s(e.errors[0]))])],1)]}}],null,!1,3442615380)})],1),t._v(" "),r("b-col",{attrs:{lg:"4",md:"4",sm:"12"}},[r("b-form-group",{attrs:{label:t.$t("DefaultCustomer")}},[r("v-select",{attrs:{reduce:function(t){return t.value},placeholder:t.$t("Choose_Customer"),options:t.clients.map((function(t){return{label:t.name,value:t.id}}))},model:{value:t.setting.client_id,callback:function(e){t.$set(t.setting,"client_id",e)},expression:"setting.client_id"}})],1)],1),t._v(" "),r("b-col",{attrs:{lg:"4",md:"4",sm:"12"}},[r("b-form-group",{attrs:{label:t.$t("DefaultWarehouse")}},[r("v-select",{attrs:{reduce:function(t){return t.value},placeholder:t.$t("Choose_Warehouse"),options:t.warehouses.map((function(t){return{label:t.name,value:t.id}}))},model:{value:t.setting.warehouse_id,callback:function(e){t.$set(t.setting,"warehouse_id",e)},expression:"setting.warehouse_id"}})],1)],1),t._v(" "),r("b-col",{attrs:{lg:"12",md:"12",sm:"12"}},[r("validation-provider",{attrs:{name:"Adress",rules:{required:!0}},scopedSlots:t._u([{key:"default",fn:function(e){return[r("b-form-group",{attrs:{label:t.$t("Adress")}},[r("textarea",{directives:[{name:"model",rawName:"v-model",value:t.setting.CompanyAdress,expression:"setting.CompanyAdress"}],staticClass:"form-control",attrs:{state:t.getValidationState(e),"aria-describedby":"Adress-feedback",placeholder:t.$t("Afewwords")},domProps:{value:t.setting.CompanyAdress},on:{input:function(e){e.target.composing||t.$set(t.setting,"CompanyAdress",e.target.value)}}}),t._v(" "),r("b-form-invalid-feedback",{attrs:{id:"Adress-feedback"}},[t._v(t._s(e.errors[0]))])],1)]}}],null,!1,3471601747)})],1),t._v(" "),r("b-col",{attrs:{lg:"4",md:"4",sm:"12"}},[r("validation-provider",{attrs:{name:"initial_invoiceCF",rules:{required:!0}},scopedSlots:t._u([{key:"default",fn:function(e){return[r("b-form-group",{attrs:{label:t.$t("initial_invoiceCF")}},[r("b-form-input",{staticClass:"form-control",attrs:{state:t.getValidationState(e),"aria-describedby":"initial_invoiceCF-feedback"},model:{value:t.setting.initial_invoiceCF,callback:function(e){t.$set(t.setting,"initial_invoiceCF",e)},expression:"setting.initial_invoiceCF"}}),t._v(" "),r("b-form-invalid-feedback",{attrs:{id:"initial_invoiceCF-feedback"}},[t._v(t._s(e.errors[0]))])],1)]}}],null,!1,1497294452)})],1),t._v(" "),r("b-col",{attrs:{lg:"4",md:"4",sm:"12"}},[r("validation-provider",{attrs:{name:"current_invoiceCF",rules:{required:!0}},scopedSlots:t._u([{key:"default",fn:function(e){return[r("b-form-group",{attrs:{label:t.$t("current_invoiceCF")}},[r("b-form-input",{staticClass:"form-control",attrs:{state:t.getValidationState(e),"aria-describedby":"current_invoiceCF-feedback"},model:{value:t.setting.current_invoiceCF,callback:function(e){t.$set(t.setting,"current_invoiceCF",e)},expression:"setting.current_invoiceCF"}}),t._v(" "),r("b-form-invalid-feedback",{attrs:{id:"current_invoiceCF-feedback"}},[t._v(t._s(e.errors[0]))])],1)]}}],null,!1,960587764)})],1),t._v(" "),r("b-col",{attrs:{lg:"4",md:"4",sm:"12"}},[r("validation-provider",{attrs:{name:"initial_invoiceCCF",rules:{required:!0}},scopedSlots:t._u([{key:"default",fn:function(e){return[r("b-form-group",{attrs:{label:t.$t("initial_invoiceCCF")}},[r("b-form-input",{staticClass:"form-control",attrs:{state:t.getValidationState(e),"aria-describedby":"initial_invoiceCCF-feedback"},model:{value:t.setting.initial_invoiceCCF,callback:function(e){t.$set(t.setting,"initial_invoiceCCF",e)},expression:"setting.initial_invoiceCCF"}}),t._v(" "),r("b-form-invalid-feedback",{attrs:{id:"initial_invoiceCCF-feedback"}},[t._v(t._s(e.errors[0]))])],1)]}}],null,!1,2519956084)})],1),t._v(" "),r("b-col",{attrs:{lg:"4",md:"4",sm:"12"}},[r("validation-provider",{attrs:{name:"current_invoiceCCF",rules:{required:!0}},scopedSlots:t._u([{key:"default",fn:function(e){return[r("b-form-group",{attrs:{label:t.$t("current_invoiceCCF")}},[r("b-form-input",{staticClass:"form-control",attrs:{state:t.getValidationState(e),"aria-describedby":"current_invoiceCCF-feedback"},model:{value:t.setting.current_invoiceCCF,callback:function(e){t.$set(t.setting,"current_invoiceCCF",e)},expression:"setting.current_invoiceCCF"}}),t._v(" "),r("b-form-invalid-feedback",{attrs:{id:"current_invoiceCCF-feedback"}},[t._v(t._s(e.errors[0]))])],1)]}}],null,!1,3409778068)})],1),t._v(" "),r("b-col",{attrs:{md:"12"}},[r("b-form-group",[r("b-button",{attrs:{variant:"primary",type:"submit"}},[t._v(t._s(t.$t("submit")))])],1)],1)],1)],1)],1)],1)],1)],1)],1),t._v(" "),t.isLoading?t._e():r("validation-observer",{ref:"form_payment"},[r("b-form",{on:{submit:function(e){return e.preventDefault(),t.Submit_Payment(e)}}},[r("b-row",{staticClass:"mt-5"},[r("b-col",{attrs:{lg:"12",md:"12",sm:"12"}},[r("b-card",{attrs:{"no-body":"",header:t.$t("Payment_Gateway")}},[r("b-card-body",[r("b-row",[r("b-col",{attrs:{lg:"6",md:"6",sm:"12"}},[r("b-form-group",{attrs:{label:"STRIPE_KEY"}},[r("b-form-input",{attrs:{type:"password",placeholder:t.$t("LeaveBlank")},model:{value:t.gateway.stripe_key,callback:function(e){t.$set(t.gateway,"stripe_key",e)},expression:"gateway.stripe_key"}})],1)],1),t._v(" "),r("b-col",{attrs:{lg:"6",md:"6",sm:"12"}},[r("b-form-group",{attrs:{label:"STRIPE_SECRET"}},[r("b-form-input",{attrs:{type:"password",placeholder:t.$t("LeaveBlank")},model:{value:t.gateway.stripe_secret,callback:function(e){t.$set(t.gateway,"stripe_secret",e)},expression:"gateway.stripe_secret"}})],1)],1),t._v(" "),r("b-col",{staticClass:"mt-3 mb-3",attrs:{md:"6"}},[r("label",{staticClass:"switch switch-primary mr-3"},[t._v("\n                       "+t._s(t.$t("Remove_Stripe_Key_Secret"))+"\n                        "),r("input",{directives:[{name:"model",rawName:"v-model",value:t.gateway.deleted,expression:"gateway.deleted"}],attrs:{type:"checkbox"},domProps:{checked:Array.isArray(t.gateway.deleted)?t._i(t.gateway.deleted,null)>-1:t.gateway.deleted},on:{change:function(e){var r=t.gateway.deleted,n=e.target,o=!!n.checked;if(Array.isArray(r)){var i=t._i(r,null);n.checked?i<0&&t.$set(t.gateway,"deleted",r.concat([null])):i>-1&&t.$set(t.gateway,"deleted",r.slice(0,i).concat(r.slice(i+1)))}else t.$set(t.gateway,"deleted",o)}}}),t._v(" "),r("span",{staticClass:"slider"})])]),t._v(" "),r("b-col",{attrs:{md:"12"}},[r("b-form-group",[r("b-button",{attrs:{variant:"primary",type:"submit"}},[t._v(t._s(t.$t("submit")))])],1)],1)],1)],1)],1)],1)],1)],1)],1),t._v(" "),t.isLoading?t._e():r("validation-observer",{ref:"form_sms"},[r("b-form",{on:{submit:function(e){return e.preventDefault(),t.Submit_sms(e)}}},[r("b-row",{staticClass:"mt-5"},[r("b-col",{attrs:{lg:"12",md:"12",sm:"12"}},[r("b-card",{attrs:{"no-body":"",header:t.$t("SMS_Configuration")}},[r("b-card-body",[r("b-row",[r("b-col",{attrs:{md:"6"}},[r("validation-provider",{attrs:{name:"Gateway"}},[r("b-form-group",{attrs:{label:t.$t("Gateway")}},[r("v-select",{attrs:{reduce:function(t){return t.value},placeholder:t.$t("Choose_Gateway"),options:[{label:"Twilio",value:"Twilio"}]},model:{value:t.sms.gateway,callback:function(e){t.$set(t.sms,"gateway",e)},expression:"sms.gateway"}})],1)],1)],1),t._v(" "),r("b-col",{attrs:{lg:"6",md:"6",sm:"12"}},[r("validation-provider",{attrs:{name:"TWILIO_SID",rules:{required:!0}},scopedSlots:t._u([{key:"default",fn:function(e){return[r("b-form-group",{attrs:{label:"TWILIO_SID"}},[r("b-form-input",{attrs:{state:t.getValidationState(e),"aria-describedby":"TWILIO_SID-feedback",label:"TWILIO_SID"},model:{value:t.sms.TWILIO_SID,callback:function(e){t.$set(t.sms,"TWILIO_SID",e)},expression:"sms.TWILIO_SID"}}),t._v(" "),r("b-form-invalid-feedback",{attrs:{id:"TWILIO_SID-feedback"}},[t._v(t._s(e.errors[0]))])],1)]}}],null,!1,3763386067)})],1),t._v(" "),r("b-col",{attrs:{lg:"6",md:"6",sm:"12"}},[r("b-form-group",{attrs:{label:"TWILIO_TOKEN"}},[r("b-form-input",{attrs:{label:"TWILIO_TOKEN",placeholder:t.$t("LeaveBlank")},model:{value:t.sms.TWILIO_TOKEN,callback:function(e){t.$set(t.sms,"TWILIO_TOKEN",e)},expression:"sms.TWILIO_TOKEN"}})],1)],1),t._v(" "),r("b-col",{attrs:{lg:"6",md:"6",sm:"12"}},[r("validation-provider",{attrs:{name:"TWILIO_FROM",rules:{required:!0}},scopedSlots:t._u([{key:"default",fn:function(e){return[r("b-form-group",{attrs:{label:"TWILIO_FROM"}},[r("b-form-input",{attrs:{state:t.getValidationState(e),"aria-describedby":"TWILIO_FROM-feedback",label:"TWILIO_FROM"},model:{value:t.sms.TWILIO_FROM,callback:function(e){t.$set(t.sms,"TWILIO_FROM",e)},expression:"sms.TWILIO_FROM"}}),t._v(" "),r("b-form-invalid-feedback",{attrs:{id:"TWILIO_FROM-feedback"}},[t._v(t._s(e.errors[0]))])],1)]}}],null,!1,3199732955)})],1),t._v(" "),r("b-col",{attrs:{md:"12"}},[r("b-form-group",[r("b-button",{attrs:{variant:"primary",type:"submit"}},[t._v(t._s(t.$t("submit")))])],1)],1)],1)],1)],1)],1)],1)],1)],1),t._v(" "),t.isLoading?t._e():r("validation-observer",{ref:"form_smtp"},[r("b-form",{on:{submit:function(e){return e.preventDefault(),t.Submit_SMTP(e)}}},[r("b-row",{staticClass:"mt-5"},[r("b-col",{attrs:{lg:"12",md:"12",sm:"12"}},[r("b-card",{attrs:{"no-body":"",header:t.$t("SMTPConfiguration")}},[r("b-card-body",[r("b-row",[r("b-col",{attrs:{lg:"4",md:"4",sm:"12"}},[r("validation-provider",{attrs:{name:"HOST",rules:{required:!0}},scopedSlots:t._u([{key:"default",fn:function(e){return[r("b-form-group",{attrs:{label:t.$t("HOST")}},[r("b-form-input",{attrs:{state:t.getValidationState(e),"aria-describedby":"HOST-feedback",label:"HOST",placeholder:t.$t("HOST")},model:{value:t.server.host,callback:function(e){t.$set(t.server,"host",e)},expression:"server.host"}}),t._v(" "),r("b-form-invalid-feedback",{attrs:{id:"HOST-feedback"}},[t._v(t._s(e.errors[0]))])],1)]}}],null,!1,593553647)})],1),t._v(" "),r("b-col",{attrs:{lg:"4",md:"4",sm:"12"}},[r("validation-provider",{attrs:{name:"PORT",rules:{required:!0}},scopedSlots:t._u([{key:"default",fn:function(e){return[r("b-form-group",{attrs:{label:t.$t("PORT")}},[r("b-form-input",{attrs:{state:t.getValidationState(e),"aria-describedby":"PORT-feedback",label:"PORT",placeholder:t.$t("PORT")},model:{value:t.server.port,callback:function(e){t.$set(t.server,"port",e)},expression:"server.port"}}),t._v(" "),r("b-form-invalid-feedback",{attrs:{id:"PORT-feedback"}},[t._v(t._s(e.errors[0]))])],1)]}}],null,!1,1686597967)})],1),t._v(" "),r("b-col",{attrs:{lg:"4",md:"4",sm:"12"}},[r("validation-provider",{attrs:{name:"Username",rules:{required:!0}},scopedSlots:t._u([{key:"default",fn:function(e){return[r("b-form-group",{attrs:{label:t.$t("username")}},[r("b-form-input",{attrs:{state:t.getValidationState(e),"aria-describedby":"Username-feedback",label:"Username",placeholder:t.$t("username")},model:{value:t.server.username,callback:function(e){t.$set(t.server,"username",e)},expression:"server.username"}}),t._v(" "),r("b-form-invalid-feedback",{attrs:{id:"Username-feedback"}},[t._v(t._s(e.errors[0]))])],1)]}}],null,!1,1793296271)})],1),t._v(" "),r("b-col",{attrs:{lg:"4",md:"4",sm:"12"}},[r("validation-provider",{attrs:{name:"Password",rules:{required:!0}},scopedSlots:t._u([{key:"default",fn:function(e){return[r("b-form-group",{attrs:{label:t.$t("password")}},[r("b-form-input",{attrs:{state:t.getValidationState(e),"aria-describedby":"Password-feedback",label:"Password",placeholder:t.$t("password")},model:{value:t.server.password,callback:function(e){t.$set(t.server,"password",e)},expression:"server.password"}}),t._v(" "),r("b-form-invalid-feedback",{attrs:{id:"Password-feedback"}},[t._v(t._s(e.errors[0]))])],1)]}}],null,!1,4152382255)})],1),t._v(" "),r("b-col",{attrs:{lg:"4",md:"4",sm:"12"}},[r("validation-provider",{attrs:{name:"encryption",rules:{required:!0}},scopedSlots:t._u([{key:"default",fn:function(e){return[r("b-form-group",{attrs:{label:t.$t("encryption")}},[r("b-form-input",{attrs:{state:t.getValidationState(e),"aria-describedby":"encryption-feedback",label:"encryption",placeholder:t.$t("encryption")},model:{value:t.server.encryption,callback:function(e){t.$set(t.server,"encryption",e)},expression:"server.encryption"}}),t._v(" "),r("b-form-invalid-feedback",{attrs:{id:"encryption-feedback"}},[t._v(t._s(e.errors[0]))])],1)]}}],null,!1,3692260559)})],1),t._v(" "),r("b-col",{attrs:{md:"12"}},[r("b-form-group",[r("b-button",{attrs:{variant:"primary",type:"submit"}},[t._v(t._s(t.$t("submit")))])],1)],1)],1)],1)],1)],1)],1)],1)],1)],1)}),[],!1,null,null,null);e.default=v.exports}}])}();
>>>>>>> f11b8c326380b962de568282db4cbb62e4ac9c9f
