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

// `String.prototype.{ codePointAt, at }` methods implementation
var createMethod$1 = function (CONVERT_TO_STRING) {
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
  codeAt: createMethod$1(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod$1(true)
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

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
var isArray = Array.isArray || function isArray(arg) {
  return classofRaw(arg) == 'Array';
};

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
var toObject = function (argument) {
  return Object(requireObjectCoercible(argument));
};

var createProperty = function (object, key, value) {
  var propertyKey = toPrimitive(key);
  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};

var SPECIES$4 = wellKnownSymbol('species');

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
var arraySpeciesCreate = function (originalArray, length) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES$4];
      if (C === null) C = undefined;
    }
  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
};

var SPECIES$5 = wellKnownSymbol('species');

var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return engineV8Version >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES$5] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};

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

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
var objectKeys = Object.keys || function keys(O) {
  return objectKeysInternal(O, enumBugKeys);
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
var ObjectPrototype = Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO$1)) return O[IE_PROTO$1];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectPrototype : null;
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

var ITERATOR$5 = wellKnownSymbol('iterator');
var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
var ArrayValues = es_array_iterator.values;

for (var COLLECTION_NAME in domIterables) {
  var Collection = global_1[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR$5] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype, ITERATOR$5, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR$5] = ArrayValues;
    }
    if (!CollectionPrototype[TO_STRING_TAG$3]) {
      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG$3, COLLECTION_NAME);
    }
    if (domIterables[COLLECTION_NAME]) for (var METHOD_NAME in es_array_iterator) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[METHOD_NAME] !== es_array_iterator[METHOD_NAME]) try {
        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, es_array_iterator[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = es_array_iterator[METHOD_NAME];
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

// eslint-disable-next-line es/no-object-assign -- safe
var $assign = Object.assign;
// eslint-disable-next-line es/no-object-defineproperty -- required for testing
var defineProperty$1 = Object.defineProperty;

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
var objectAssign = !$assign || fails(function () {
  // should have correct order of operations (Edge bug)
  if (descriptors && $assign({ b: 1 }, $assign(defineProperty$1({}, 'a', {
    enumerable: true,
    get: function () {
      defineProperty$1(this, 'b', {
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

(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["detail_sale"],{

/***/"./node_modules/@stripe/stripe-js/dist/stripe.esm.js":
/*!***********************************************************!*\
  !*** ./node_modules/@stripe/stripe-js/dist/stripe.esm.js ***!
  \***********************************************************/
/*! exports provided: loadStripe */
/***/function node_modulesStripeStripeJsDistStripeEsmJs(module,__webpack_exports__,__webpack_require__){
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"loadStripe",function(){return loadStripe;});
var V3_URL='https://js.stripe.com/v3';
var V3_URL_REGEX=/^https:\/\/js\.stripe\.com\/v3\/?(\?.*)?$/;
var EXISTING_SCRIPT_MESSAGE='loadStripe.setLoadParameters was called but an existing Stripe.js script already exists in the document; existing script parameters will be used';
var findScript=function findScript(){
var scripts=document.querySelectorAll("script[src^=\"".concat(V3_URL,"\"]"));

for(var i=0;i<scripts.length;i++){
var script=scripts[i];

if(!V3_URL_REGEX.test(script.src)){
continue;
}

return script;
}

return null;
};

var injectScript=function injectScript(params){
var queryString=params&&!params.advancedFraudSignals?'?advancedFraudSignals=false':'';
var script=document.createElement('script');
script.src="".concat(V3_URL).concat(queryString);
var headOrBody=document.head||document.body;

if(!headOrBody){
throw new Error('Expected document.body not to be null. Stripe.js requires a <body> element.');
}

headOrBody.appendChild(script);
return script;
};

var registerWrapper=function registerWrapper(stripe,startTime){
if(!stripe||!stripe._registerWrapper){
return;
}

stripe._registerWrapper({
name:'stripe-js',
version:"1.13.2",
startTime:startTime});

};

var stripePromise=null;
var loadScript=function loadScript(params){
// Ensure that we only attempt to load Stripe.js at most once
if(stripePromise!==null){
return stripePromise;
}

stripePromise=new Promise(function(resolve,reject){
if(typeof window==='undefined'){
// Resolve to null when imported server side. This makes the module
// safe to import in an isomorphic code base.
resolve(null);
return;
}

if(window.Stripe&&params){
console.warn(EXISTING_SCRIPT_MESSAGE);
}

if(window.Stripe){
resolve(window.Stripe);
return;
}

try{
var script=findScript();

if(script&&params){
console.warn(EXISTING_SCRIPT_MESSAGE);
}else if(!script){
script=injectScript(params);
}

script.addEventListener('load',function(){
if(window.Stripe){
resolve(window.Stripe);
}else {
reject(new Error('Stripe.js not available'));
}
});
script.addEventListener('error',function(){
reject(new Error('Failed to load Stripe.js'));
});
}catch(error){
reject(error);
return;
}
});
return stripePromise;
};
var initStripe=function initStripe(maybeStripe,args,startTime){
if(maybeStripe===null){
return null;
}

var stripe=maybeStripe.apply(undefined,args);
registerWrapper(stripe,startTime);
return stripe;
};

// own script injection.

var stripePromise$1=Promise.resolve().then(function(){
return loadScript(null);
});
var loadCalled=false;
stripePromise$1["catch"](function(err){
if(!loadCalled){
console.warn(err);
}
});
var loadStripe=function loadStripe(){
for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){
args[_key]=arguments[_key];
}

loadCalled=true;
var startTime=Date.now();
return stripePromise$1.then(function(maybeStripe){
return initStripe(maybeStripe,args,startTime);
});
};




/***/},

/***/"./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/src/views/app/pages/sales/detail_sale.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/src/views/app/pages/sales/detail_sale.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/function node_modulesBabelLoaderLibIndexJsNode_modulesVueLoaderLibIndexJsResourcesSrcViewsAppPagesSalesDetail_saleVueVueTypeScriptLangJs(module,__webpack_exports__,__webpack_require__){
__webpack_require__.r(__webpack_exports__);
/* harmony import */var vuex__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(/*! vuex */"./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */var nprogress__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(/*! nprogress */"./node_modules/nprogress/nprogress.js");
/* harmony import */var nprogress__WEBPACK_IMPORTED_MODULE_1___default=/*#__PURE__*/__webpack_require__.n(nprogress__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */var _utils__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(/*! ../../../../utils */"./resources/src/utils/index.js");
/* harmony import */var vue_easy_print__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(/*! vue-easy-print */"./node_modules/vue-easy-print/src/index.js");
/* harmony import */var jspdf__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(/*! jspdf */"./node_modules/jspdf/dist/jspdf.es.min.js");
/* harmony import */var jspdf_autotable__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(/*! jspdf-autotable */"./node_modules/jspdf-autotable/dist/jspdf.plugin.autotable.js");
/* harmony import */var vue_barcode__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__(/*! vue-barcode */"./node_modules/vue-barcode/index.js");
/* harmony import */var vue_barcode__WEBPACK_IMPORTED_MODULE_6___default=/*#__PURE__*/__webpack_require__.n(vue_barcode__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */var _stripe_stripe_js__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__(/*! @stripe/stripe-js */"./node_modules/@stripe/stripe-js/dist/stripe.esm.js");
var _methods;

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








/* harmony default export */__webpack_exports__["default"]={
computed:Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapGetters"])(["currentUserPermissions","currentUser"]),
metaInfo:{
title:"Detail Sale"},

components:{
vueEasyPrint:vue_easy_print__WEBPACK_IMPORTED_MODULE_3__["default"],
barcode:vue_barcode__WEBPACK_IMPORTED_MODULE_6___default.a},

data:function data(){
return {
isLoading:true,
sale:{},
is_return:false,
sale_less_return:0,
details:[],
variants:[],
company:{},
invoice_pos:{
symbol:"",
sale:{
Ref:"",
client_name:"",
client_adresse:"",
client_country:"",
client_city:"",
final_consumer:"",
big_consumer:"",
discount:"",
taxe:"",
date:"",
tax_rate:13,
TaxWithheld:"",
shipping:"",
GrandTotal:"",
RefTransfer:"",
RefCreditCard:"",
type_invoice:"",
refInvoice:"",
Reglement:""}},


email:{
to:"",
subject:"",
message:"",
client_name:"",
Sale_Ref:""},

GrandTotalText:""};

},
methods:(_methods={
//------------------------------ Print -------------------------\\
print:function print(){
var divContents=document.getElementById("print_Invoice").innerHTML;
var a=window.open("","","height=500, width=500");
a.document.write('<link rel="stylesheet" href="/setup/css/bootstrap.css"><html>');
a.document.write("<body >");
a.document.write(divContents);
a.document.write("</body></html>");
a.document.close();
a.print();
},
//-------------------------------- Invoice POS ------------------------------\\
Invoice_POS:function Invoice_POS(id){
var _this=this;

// Start the progress bar.
nprogress__WEBPACK_IMPORTED_MODULE_1___default.a.start();
nprogress__WEBPACK_IMPORTED_MODULE_1___default.a.set(0.1);
axios.get("Sales/Print_Invoice/"+id).then(function(response){
console.log('respuesta');
_this.invoice_pos=response.data;
console.log(_this.invoice_pos);
_this.GrandTotalText=_utils__WEBPACK_IMPORTED_MODULE_2__["default"].numeroALetras(_this.formatNumber(_this.invoice_pos.sale.GrandTotal,2));
console.log('respuesta2');
setTimeout(function(){
// Complete the animation of the  progress bar.
nprogress__WEBPACK_IMPORTED_MODULE_1___default.a.done();

_this.$bvModal.show("Show_invoiceF");

if(_this.invoice_pos.sale.type_invoice=="CF"){
_this.$bvModal.show("Show_invoiceF");
}else {
_this.$bvModal.show("Show_invoiceCCF");
}
},500);
setTimeout(function(){
return _this.print_pos();
},1000);
})["catch"](function(){
// Complete the animation of the  progress bar.
setTimeout(function(){
return nprogress__WEBPACK_IMPORTED_MODULE_1___default.a.done();
},500);
});
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
print_pos:function print_pos(){
if(this.invoice_pos.sale.type_invoice=="CF"){
this.$refs.Show_invoiceF.print();
}else {
this.$refs.Show_invoiceCCF.print();
}
},
//----------------------------------- Invoice Sale PDF  -------------------------\\
Sale_PDF:function Sale_PDF(){
var _this2=this;

// Start the progress bar.
nprogress__WEBPACK_IMPORTED_MODULE_1___default.a.start();
nprogress__WEBPACK_IMPORTED_MODULE_1___default.a.set(0.1);
var id=this.$route.params.id;
axios({
url:"Sale_PDF/".concat(id),
method:"GET",
responseType:"blob"// important
}).
then(function(response){
var url=window.URL.createObjectURL(new Blob([response.data]));
var link=document.createElement("a");
link.href=url;
link.setAttribute("download","Sale_"+_this2.sale.Ref+".pdf");
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
//------ Toast
makeToast:function makeToast(variant,msg,title){
this.$root.$bvToast.toast(msg,{
title:title,
variant:variant,
solid:true});

}},
_defineProperty(_methods,"formatNumber",function formatNumber(number,dec){
var value=(typeof number==="string"?number:number.toString()).split(".");
if(dec<=0)return value[0];
var formated=value[1]||"";
if(formated.length>dec)return "".concat(value[0],".").concat(formated.substr(0,dec));

while(formated.length<dec){
formated+="0";
}

return "".concat(value[0],".").concat(formated);
}),_defineProperty(_methods,"Sale_Email",function Sale_Email(){
this.email.to=this.sale.client_email;
this.email.Sale_Ref=this.sale.Ref;
this.email.client_name=this.sale.client_name;
this.Send_Email();
}),_defineProperty(_methods,"Send_Email",function Send_Email(){
var _this3=this;

// Start the progress bar.
nprogress__WEBPACK_IMPORTED_MODULE_1___default.a.start();
nprogress__WEBPACK_IMPORTED_MODULE_1___default.a.set(0.1);
var id=this.$route.params.id;
axios.post("sales/send/email",{
id:id,
to:this.email.to,
client_name:this.email.client_name,
Ref:this.email.Sale_Ref}).
then(function(response){
// Complete the animation of the  progress bar.
setTimeout(function(){
return nprogress__WEBPACK_IMPORTED_MODULE_1___default.a.done();
},500);

_this3.makeToast("success",_this3.$t("Send.TitleEmail"),_this3.$t("Success"));
})["catch"](function(error){
// Complete the animation of the  progress bar.
setTimeout(function(){
return nprogress__WEBPACK_IMPORTED_MODULE_1___default.a.done();
},500);

_this3.makeToast("danger",_this3.$t("SMTPIncorrect"),_this3.$t("Failed"));
});
}),_defineProperty(_methods,"Sale_SMS",function Sale_SMS(){
var _this4=this;

// Start the progress bar.
nprogress__WEBPACK_IMPORTED_MODULE_1___default.a.start();
nprogress__WEBPACK_IMPORTED_MODULE_1___default.a.set(0.1);
var id=this.$route.params.id;
axios.post("sales/send/sms",{
id:id}).
then(function(response){
// Complete the animation of the  progress bar.
setTimeout(function(){
return nprogress__WEBPACK_IMPORTED_MODULE_1___default.a.done();
},500);

_this4.makeToast("success",_this4.$t("Send_SMS"),_this4.$t("Success"));
})["catch"](function(error){
// Complete the animation of the  progress bar.
setTimeout(function(){
return nprogress__WEBPACK_IMPORTED_MODULE_1___default.a.done();
},500);

_this4.makeToast("danger",_this4.$t("sms_config_invalid"),_this4.$t("Failed"));
});
}),_defineProperty(_methods,"Get_Details_Less_returns",function Get_Details_Less_returns(){
var _this5=this;

var id=this.$route.params.id;
axios.get("sales/less-returns/".concat(id)).then(function(response){
_this5.sale=response.data.sale;
_this5.details=response.data.details;
_this5.company=response.data.company;
_this5.is_return=true;
_this5.isLoading=false;
})["catch"](function(response){
setTimeout(function(){
_this5.isLoading=false;
},500);
});
}),_defineProperty(_methods,"Get_Details",function Get_Details(){
var _this6=this;

var id=this.$route.params.id;
axios.get("sales/".concat(id)).then(function(response){
_this6.sale=response.data.sale;
_this6.details=response.data.details;
_this6.company=response.data.company;
_this6.isLoading=false;
})["catch"](function(response){
setTimeout(function(){
_this6.isLoading=false;
},500);
});
}),_defineProperty(_methods,"Get_Detailss",function Get_Detailss(id){
var _this7=this;

axios.get("sales/".concat(id)).then(function(response){
_this7.sale=response.data.sale;
_this7.details=response.data.details;
_this7.company=response.data.company;
_this7.isLoading=false;
})["catch"](function(response){
setTimeout(function(){
_this7.isLoading=false;
},500);
});
}),_defineProperty(_methods,"Check_in",function Check_in(){
var _this8=this;

var id=this.$route.params.id;
axios.get("sales/save/less_Return/".concat(id)).then(function(response){
_this8.sale_less_return=response.data.newId;

_this8.Invoice_POS(_this8.sale_less_return);

_this8.Get_Detailss(_this8.sale_less_return);

_this8.isLoading=false;
})["catch"](function(response){
setTimeout(function(){
_this8.isLoading=false;
},500);
});
}),_defineProperty(_methods,"Delete_Sale",function Delete_Sale(){
var _this9=this;

var id=this.$route.params.id;
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
axios["delete"]("sales/"+id).then(function(){
_this9.$swal(_this9.$t("Delete.Deleted"),_this9.$t("Delete.SaleDeleted"),"success");

_this9.$router.push({
name:"index_sales"});

})["catch"](function(){
_this9.$swal(_this9.$t("Delete.Failed"),_this9.$t("Delete.Therewassomethingwronge"),"warning");
});
}
});
}),_methods),
//end Methods
//----------------------------- Created function-------------------
created:function created(){
this.Get_Details();
}};


/***/},

/***/"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/src/views/app/pages/sales/detail_sale.vue?vue&type=template&id=9b055236&":
/*!**************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/src/views/app/pages/sales/detail_sale.vue?vue&type=template&id=9b055236& ***!
  \**************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/function node_modulesVueLoaderLibLoadersTemplateLoaderJsNode_modulesVueLoaderLibIndexJsResourcesSrcViewsAppPagesSalesDetail_saleVueVueTypeTemplateId9b055236(module,__webpack_exports__,__webpack_require__){
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
attrs:{page:_vm.$t("SaleDetail"),folder:_vm.$t("Sales")}}),

_vm._v(" "),
_vm.isLoading?
_c("div",{
staticClass:"loading_page spinner spinner-primary mr-3"}):

_vm._e(),
_vm._v(" "),
!_vm.isLoading?
_c(
"b-card",
[
_c(
"b-row",
[
_c(
"b-col",
{staticClass:"mb-5",attrs:{md:"12"}},
[
_vm.currentUserPermissions&&
_vm.currentUserPermissions.includes("Sales_edit")?
_c(
"router-link",
{
staticClass:
"btn btn-success btn-icon ripple btn-sm",
attrs:{
title:"Edit",
to:{
name:"edit_sale",
params:{id:_vm.$route.params.id}}}},



[
_c("i",{staticClass:"i-Edit"}),
_vm._v(" "),
_c("span",[_vm._v(_vm._s(_vm.$t("EditSale")))])]):


_vm._e(),
_vm._v(" "),
_c(
"button",
{
staticClass:"btn btn-info btn-icon ripple btn-sm",
on:{
click:function click($event){
return _vm.Sale_Email();
}}},


[
_c("i",{staticClass:"i-Envelope-2"}),
_vm._v(
"\n          "+
_vm._s(_vm.$t("Email"))+
"\n        ")]),



_vm._v(" "),
_c(
"button",
{
staticClass:
"btn btn-secondary btn-icon ripple btn-sm",
on:{
click:function click($event){
return _vm.Sale_SMS();
}}},


[
_c("i",{staticClass:"i-Speach-Bubble-3"}),
_vm._v("\n          SMS\n        ")]),


_vm._v(" "),
_c(
"button",
{
staticClass:"btn btn-primary btn-icon ripple btn-sm",
on:{
click:function click($event){
return _vm.Sale_PDF();
}}},


[
_c("i",{staticClass:"i-File-TXT"}),
_vm._v("\n          PDF\n        ")]),


_vm._v(" "),
_c(
"button",
{
staticClass:"btn btn-warning btn-icon ripple btn-sm",
on:{
click:function click($event){
return _vm.print();
}}},


[
_c("i",{staticClass:"i-Billing"}),
_vm._v(
"\n          "+
_vm._s(_vm.$t("print"))+
"\n        ")]),



_vm._v(" "),
_c(
"button",
{
staticClass:"btn btn-info btn-icon ripple btn-sm",
on:{
click:function click($event){
return _vm.Get_Details_Less_returns();
}}},


[
_c("i",{staticClass:"i-Envelope-2"}),
_vm._v(
"\n          "+
_vm._s(_vm.$t("LessReturns"))+
"\n        ")]),



_vm._v(" "),
_vm.is_return?
_c(
"button",
{
staticClass:
"btn btn-success btn-icon ripple btn-sm",
on:{
click:function click($event){
return _vm.Check_in();
}}},


[
_vm._v(
"\n          "+
_vm._s(_vm.$t("Checkin"))+
"\n        ")]):



_vm._e(),
_vm._v(" "),
_vm.currentUserPermissions&&
_vm.currentUserPermissions.includes("Sales_delete")?
_c(
"button",
{
staticClass:
"btn btn-danger btn-icon ripple btn-sm",
on:{
click:function click($event){
return _vm.Delete_Sale();
}}},


[
_c("i",{staticClass:"i-Close-Window"}),
_vm._v(
"\n          "+
_vm._s(_vm.$t("Del"))+
"\n        ")]):



_vm._e()],

1)],


1),

_vm._v(" "),
_c(
"div",
{staticClass:"invoice",attrs:{id:"print_Invoice"}},
[
_c(
"div",
{staticClass:"invoice-print"},
[
_c(
"b-row",
{staticClass:"justify-content-md-center"},
[
_c("h4",{staticClass:"font-weight-bold"},[
_vm._v(
_vm._s(_vm.$t("SaleDetail"))+
" : "+
_vm._s(_vm.sale.Ref))])]),




_vm._v(" "),
_c("hr"),
_vm._v(" "),
_c(
"b-row",
{staticClass:"mt-5"},
[
_c(
"b-col",
{
staticClass:"mb-4",
attrs:{lg:"4",md:"4",sm:"12"}},

[
_c("h5",{staticClass:"font-weight-bold"},[
_vm._v(_vm._s(_vm.$t("Customer_Info")))]),

_vm._v(" "),
_c("div",[_vm._v(_vm._s(_vm.sale.client_name))]),
_vm._v(" "),
_c("div",[
_vm._v(_vm._s(_vm.sale.client_email))]),

_vm._v(" "),
_c("div",[
_vm._v(_vm._s(_vm.sale.client_phone))]),

_vm._v(" "),
_c("div",[_vm._v(_vm._s(_vm.sale.client_adr))]),
_vm._v(" "),
_c("div",[_vm._v(_vm._s(_vm.sale.client_NIT))]),
_vm._v(" "),
_c("div",[_vm._v(_vm._s(_vm.sale.client_NRC))]),
_vm._v(" "),
_c("div",[_vm._v(_vm._s(_vm.sale.client_giro))])]),


_vm._v(" "),
_c(
"b-col",
{
staticClass:"mb-4",
attrs:{lg:"4",md:"4",sm:"12"}},

[
_c("h5",{staticClass:"font-weight-bold"},[
_vm._v(_vm._s(_vm.$t("Company_Info")))]),

_vm._v(" "),
_c("div",[
_vm._v(_vm._s(_vm.company.CompanyName))]),

_vm._v(" "),
_c("div",[_vm._v(_vm._s(_vm.company.email))]),
_vm._v(" "),
_c("div",[
_vm._v(_vm._s(_vm.company.CompanyPhone))]),

_vm._v(" "),
_c("div",[
_vm._v(_vm._s(_vm.company.CompanyAdress))])]),



_vm._v(" "),
_c(
"b-col",
{
staticClass:"mb-4",
attrs:{lg:"4",md:"4",sm:"12"}},

[
_c("h5",{staticClass:"font-weight-bold"},[
_vm._v(_vm._s(_vm.$t("Invoice_Info")))]),

_vm._v(" "),
_c("div",[
_vm._v(
_vm._s(_vm.$t("Reference"))+
" : "+
_vm._s(_vm.sale.Ref))]),


_vm._v(" "),
_c("div",[
_vm._v(
"\n              "+
_vm._s(_vm.$t("PaymentStatus"))+
" :\n              "),

_vm.sale.payment_status=="paid"?
_c(
"span",
{
staticClass:
"badge badge-outline-success"},

[_vm._v(_vm._s(_vm.$t("Paid")))]):

_vm.sale.payment_status=="partial"?
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

[_vm._v(_vm._s(_vm.$t("Unpaid")))])]),


_vm._v(" "),
_c("div",[
_vm._v(
_vm._s(_vm.$t("warehouse"))+
" : "+
_vm._s(_vm.sale.warehouse))]),


_vm._v(" "),
_c("div",[
_vm._v(
"\n              "+
_vm._s(_vm.$t("Status"))+
" :\n              "),

_vm.sale.statut=="completed"?
_c(
"span",
{
staticClass:
"badge badge-outline-success"},

[_vm._v(_vm._s(_vm.$t("complete")))]):

_vm.sale.statut=="pending"?
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

[_vm._v(_vm._s(_vm.$t("Ordered")))])]),


_vm._v(" "),
_c("div",[
_vm._v(
"Fecha y hora: "+_vm._s(_vm.sale.created_at))])])],





1),

_vm._v(" "),
_c(
"b-row",
{staticClass:"mt-3"},
[
_c("b-col",{attrs:{md:"12"}},[
_c("h5",{staticClass:"font-weight-bold"},[
_vm._v(_vm._s(_vm.$t("Order_Summary")))]),

_vm._v(" "),
_c("div",{staticClass:"table-responsive"},[
_c(
"table",
{staticClass:"table table-hover table-md"},
[
_c("thead",{staticClass:"bg-gray-300"},[
_c("tr",[
_c("th",{attrs:{scope:"col"}},[
_vm._v(_vm._s(_vm.$t("ProductName")))]),

_vm._v(" "),
_c("th",{attrs:{scope:"col"}},[
_vm._v(_vm._s(_vm.$t("Net_Unit_Price")))]),

_vm._v(" "),
_c("th",{attrs:{scope:"col"}},[
_vm._v(_vm._s(_vm.$t("Quantity")))]),

_vm._v(" "),
_c("th",{attrs:{scope:"col"}},[
_vm._v(_vm._s(_vm.$t("UnitPrice")))]),

_vm._v(" "),
_c("th",{attrs:{scope:"col"}},[
_vm._v(_vm._s(_vm.$t("Discount")))]),

_vm._v(" "),
_c("th",{attrs:{scope:"col"}},[
_vm._v(_vm._s(_vm.$t("Tax")))]),

_vm._v(" "),
_c("th",{attrs:{scope:"col"}},[
_vm._v(_vm._s(_vm.$t("SubTotal")))])])]),



_vm._v(" "),
_c(
"tbody",
_vm._l(_vm.details,function(detail){
return _c("tr",{key:detail},[
_c("td",[
_vm._v(
_vm._s(detail.code)+
" ("+
_vm._s(detail.name)+
")")]),


_vm._v(" "),
_c("td",[
_vm._v(
_vm._s(
_vm.formatNumber(
detail.Net_price,
2))+


" "+
_vm._s(_vm.currentUser.currency))]),


_vm._v(" "),
_c("td",[
_vm._v(
_vm._s(detail.quantity)+
" "+
_vm._s(detail.unit_sale))]),


_vm._v(" "),
_c("td",[
_vm._v(
_vm._s(
_vm.formatNumber(detail.price,2))+

" "+
_vm._s(_vm.currentUser.currency))]),


_vm._v(" "),
_c("td",[
_vm._v(
_vm._s(
_vm.formatNumber(
detail.DiscountNet,
2))+


" "+
_vm._s(_vm.currentUser.currency))]),


_vm._v(" "),
_c("td",[
_vm._v(
_vm._s(
_vm.formatNumber(detail.taxe,2))+

" "+
_vm._s(_vm.currentUser.currency))]),


_vm._v(" "),
_c("td",[
_vm._v(
_vm._s(
_vm.formatNumber(detail.total,2))+

" "+
_vm._s(_vm.currentUser.currency))])]);



}),
0)])])]),





_vm._v(" "),
_c(
"b-modal",
{
attrs:{
"hide-footer":"",
size:"lg",
scrollable:"",
id:"Show_invoiceF",
title:_vm.$t("Invoice")}},


[
_c(
"vue-easy-print",
{
ref:"Show_invoiceF",
attrs:{"table-show":""}},

[
_c("div",{attrs:{id:"invoice-POSF"}},[
_c(
"div",
{
staticClass:"container",
staticStyle:{height:"671px"}},

[
_c(
"div",
{
staticClass:"row",
staticStyle:{height:"180px"}},

[
_c(
"div",
{staticClass:"col-9"},
[
_c(
"div",
{staticClass:"row"},
[
_c(
"div",
{staticClass:"info"},
[_c("h3")])]),



_vm._v(" "),
_c("div",{
staticClass:"row"}),

_vm._v(" "),
_c(
"div",
{staticClass:"row"},
[
_c("div",{
staticClass:"col-3"}),

_vm._v(" "),
_c("div",{
staticClass:"col-3"}),

_vm._v(" "),
_c("div",{
staticClass:"col-3"}),

_vm._v(" "),
_c("div",{
staticClass:"col-3"})])]),





_vm._v(" "),
_c(
"div",
{staticClass:"col-3 rounded"},
[_c("span")])]),



_vm._v(" "),
_c(
"div",
{
staticClass:"row",
staticStyle:{height:"105px"}},

[
_c(
"div",
{staticClass:"col-8"},
[
_c(
"div",
{staticClass:"row"},
[
_c(
"div",
{
staticClass:
"col-12 padding-top padding-bottom"},

[
_c(
"span",
{
staticClass:
"h5 text-uppercase"},

[
_vm._v(
"\n                    "+
_vm._s(
_vm.
invoice_pos.
sale.
client_name)+

".\n                    ")])])]),







_vm._v(" "),
_c(
"div",
{staticClass:"row"},
[
_c(
"div",
{
staticClass:
"col-12 padding-top padding-bottom"},

[
_c(
"span",
{
staticClass:
"h5 text-uppercase"},

[
_vm._v(
"\n                    "+
_vm._s(
_vm.
invoice_pos.
sale.
client_adresse)+

".\n                    ")])])]),







_vm._v(" "),
_c(
"div",
{staticClass:"row"},
[
_c(
"div",
{
staticClass:
"col-12 padding-top padding-bottom"},

[
_c(
"span",
{
staticClass:
"h5 text-uppercase"},

[
_vm._v(
"\n                    "+
_vm._s(
_vm.
invoice_pos.
sale.
client_NIT)+

".\n                    ")])])])]),









_vm._v(" "),
_c(
"div",
{staticClass:"col-4"},
[
_c(
"div",
{staticClass:"row"},
[
_c("div",{
staticClass:"col-2"}),

_vm._v(" "),
_c(
"div",
{staticClass:"col-6"},
[
_c("span",[
_vm._v(
"\n                    "+
_vm._s(
_vm.invoice_pos.
sale.date)+

".\n                    ")])]),




_vm._v(" "),
_c(
"div",
{staticClass:"col-4"},
[
_c("span",[
_vm._v(
"\n                    "+
_vm._s(
_vm.invoice_pos.
sale.
Reglement)+

".\n                    ")])])]),






_vm._v(" "),
_c(
"div",
{staticClass:"row"},
[
_c("div",{
staticClass:"col-2"}),

_vm._v(" "),
_c(
"div",
{staticClass:"col-6"},
[_c("span")])]),



_vm._v(" "),
_c(
"div",
{
staticClass:"row",
staticStyle:{
"margin-top":"30px",
"margin-left":"55px"}},


[
_c("div",{
staticClass:"col-2"}),

_vm._v(" "),
_c(
"div",
{staticClass:"col-6"},
[
_c("span",[
_vm._v(
"\n                    "+
_vm._s(
_vm.invoice_pos.
sale.seller)+

".\n                    ")])])])])]),










_vm._v(" "),
_c(
"div",
{
staticClass:"row",
staticStyle:{height:"40px"}},

[
_c("div",{staticClass:"col-1"}),
_vm._v(" "),
_c("div",{staticClass:"col-2"}),
_vm._v(" "),
_c("div",{staticClass:"col-5"}),
_vm._v(" "),
_c("div",{staticClass:"col-1"}),
_vm._v(" "),
_c("div",{staticClass:"col-1"}),
_vm._v(" "),
_c("div",{staticClass:"col-1"}),
_vm._v(" "),
_c("div",{staticClass:"col-1"})]),


_vm._v(" "),
_c(
"div",
{staticStyle:{height:"360px"}},
_vm._l(
_vm.invoice_pos.details,
function(detail_invoice){
return _c(
"div",
{
key:detail_invoice,
staticClass:"row"},

[
_c(
"div",
{staticClass:"col-1"},
[
_c(
"span",
{
staticClass:
"h5 text-uppercase"},

[
_vm._v(
"\n                 "+
_vm._s(
detail_invoice.quantity)+

"\n               \n                    ")])]),





_vm._v(" "),
_c(
"div",
{staticClass:"col-7"},
[
_c(
"span",
{
staticClass:
"h5 text-uppercase"},

[
_vm._v(
"\n                "+
_vm._s(
detail_invoice.code)+

"\n                    ")]),



_vm._v(
" -\n                "),

_c(
"span",
{
staticClass:
"h5 text-uppercase"},

[
_vm._v(
"\n                "+
_vm._s(
detail_invoice.name)+

"\n                    ")])]),





_vm._v(" "),
_c(
"div",
{staticClass:"col-1"},
[
_c(
"div",
{staticClass:"row"},
[
_c("div",{
staticClass:"col-4"}),

_vm._v(" "),
_c(
"div",
{
staticClass:
"col-6"},

[
_c(
"span",
{
staticClass:
"h5 text-uppercase"},

[
_vm._v(
"\n                    "+
_vm._s(
_vm.formatNumber(
detail_invoice.Net_price,
2))+


"\n                    ")])])])]),









_vm._v(" "),
_c("div",{
staticClass:"col-1"}),

_vm._v(" "),
_c("div",{
staticClass:"col-1"}),

_vm._v(" "),
_c(
"div",
{staticClass:"col-1"},
[
_c(
"span",
{
staticClass:
"h5 text-uppercase"},

[
_vm._v(
"\n                "+
_vm._s(
_vm.formatNumber(
detail_invoice.total,
2))+


"\n                    ")])])]);







}),

0),

_vm._v(" "),
_c("div",{staticClass:"row"},[
_c("div",{staticClass:"col-10"},[
_c(
"div",
{staticClass:"row rounded"},
[
_c(
"span",
{
staticClass:
"h5 text-uppercase"},

[
_vm._v(
"\n                  "+
_vm._s(
_vm.GrandTotalText)+

"\n                    ")])])]),






_vm._v(" "),
_c("div",{staticClass:"col-2"},[
_c(
"div",
{
staticClass:
"row align-items-start"},

[
_c("div",{
staticClass:"col-6"}),

_vm._v(" "),
_c(
"div",
{staticClass:"col-6"},
[
_c(
"span",
{
staticClass:
"h5 text-uppercase"},

[
_vm._v(
"\n                    "+
_vm._s(
_vm.formatNumber(
_vm.invoice_pos.
sale.
GrandTotal,
2))+


"\n                    ")])])]),







_vm._v(" "),
_c(
"div",
{
staticClass:
"row align-items-start"},

[
_c("div",{
staticClass:"col-6"}),

_vm._v(" "),
_c(
"div",
{staticClass:"col-6"},
[
_c("span",{
staticClass:
"h5 text-uppercase"})])]),





_vm._v(" "),
_c(
"div",
{
staticClass:
"row align-items-start"},

[
_c("div",{
staticClass:"col-6"}),

_vm._v(" "),
_c(
"div",
{staticClass:"col-6"},
[
_c("span",{
staticClass:
"h5 text-uppercase"})])]),





_vm._v(" "),
_c(
"div",
{
staticClass:
"row align-items-start"},

[
_c("div",{
staticClass:"col-6"}),

_vm._v(" "),
_c("div",{
staticClass:"col-6"})]),



_vm._v(" "),
_c(
"div",
{
staticClass:
"row align-items-start"},

[
_c("div",{
staticClass:"col-6"}),

_vm._v(" "),
_c("div",{
staticClass:"col-6"})]),



_vm._v(" "),
_c(
"div",
{
staticClass:
"row align-items-start"},

[
_c("div",{
staticClass:"col-6"}),

_vm._v(" "),
_c("div",{
staticClass:"col-6"})]),



_vm._v(" "),
_c(
"div",
{
staticClass:
"row align-items-end ",
staticStyle:{height:"120px"}},

[
_c("div",{
staticClass:"col-6"}),

_vm._v(" "),
_c(
"div",
{staticClass:"col-6"},
[
_c(
"span",
{
staticClass:
"h5 text-uppercase"},

[
_vm._v(
"\n                    "+
_vm._s(
_vm.formatNumber(
_vm.invoice_pos.
sale.
GrandTotal,
2))+


"\n                    ")])])])])])])])]),














_vm._v(" "),
_c(
"button",
{
staticClass:"btn btn-outline-primary",
on:{
click:function click($event){
return _vm.print_pos();
}}},


[
_c("i",{staticClass:"i-Billing"}),
_vm._v(
"\n        "+
_vm._s(_vm.$t("print"))+
"\n      ")])],




1),

_vm._v(" "),
_c(
"b-modal",
{
attrs:{
"hide-footer":"",
size:"lg",
scrollable:"",
id:"Show_invoiceCCF",
title:_vm.$t("Invoice")}},


[
_c(
"vue-easy-print",
{
ref:"Show_invoiceCCF",
attrs:{"table-show":""}},

[
_c(
"div",
{attrs:{id:"invoice-POSCCF"}},
[
_c(
"div",
{
staticClass:"container",
staticStyle:{height:"671px"}},

[
_c(
"div",
{
staticClass:"row",
staticStyle:{height:"150px"}},

[
_c(
"div",
{staticClass:"col-9"},
[
_c(
"div",
{staticClass:"row"},
[
_c(
"div",
{staticClass:"info"},
[_c("h3")])]),



_vm._v(" "),
_c("div",{
staticClass:"row"}),

_vm._v(" "),
_c(
"div",
{staticClass:"row"},
[
_c("div",{
staticClass:"col-3"}),

_vm._v(" "),
_c("div",{
staticClass:"col-3"}),

_vm._v(" "),
_c("div",{
staticClass:"col-3"}),

_vm._v(" "),
_c("div",{
staticClass:"col-3"})])]),





_vm._v(" "),
_c(
"div",
{
staticClass:"col-3 rounded"},

[_c("span")])]),



_vm._v(" "),
_c(
"div",
{
staticClass:"row",
staticStyle:{height:"105px"}},

[
_c(
"div",
{staticClass:"col-8"},
[
_c(
"div",
{staticClass:"row"},
[
_c(
"div",
{
staticClass:
"col-12 padding-top padding-bottom"},

[
_c(
"span",
{
staticClass:
"h5 text-uppercase"},

[
_vm._v(
"\n                    "+
_vm._s(
_vm.
invoice_pos.
sale.
client_name)+

".\n                    ")])])]),







_vm._v(" "),
_c(
"div",
{staticClass:"row"},
[
_c(
"div",
{
staticClass:
"col-12 padding-top padding-bottom"},

[
_c(
"span",
{
staticClass:
"h5 text-uppercase",
staticStyle:{
"margin-top":
"15px",
"margin-left":
"10px"}},


[
_vm._v(
"\n                    "+
_vm._s(
_vm.
invoice_pos.
sale.
client_adresse)+

".\n                    ")])])]),







_vm._v(" "),
_c(
"div",
{
staticClass:"row",
staticStyle:{
"margin-top":"8px",
"margin-left":"10px"}},


[
_c(
"div",
{
staticClass:
"col-6 padding-top padding-bottom"},

[
_c(
"span",
{
staticClass:
"h5 text-uppercase"},

[
_vm._v(
"\n                    "+
_vm._s(
_vm.
invoice_pos.
sale.
client_city)+

".\n                    ")])]),





_vm._v(" "),
_c(
"div",
{
staticClass:
"col-6 padding-top padding-bottom"},

[
_c(
"span",
{
staticClass:
"h5 text-uppercase"},

[
_vm._v(
"\n                    "+
_vm._s(
_vm.
invoice_pos.
sale.
client_country)+

".\n                    ")])])]),







_vm._v(" "),
_c(
"div",
{staticClass:"row"},
[
_c(
"div",
{
staticClass:
"col-12 padding-top padding-bottom"},

[
_c("span",{
staticClass:
"h5 text-uppercase",
staticStyle:{
"margin-top":
"10px",
"margin-left":
"10px"}})])]),






_vm._v(" "),
_c(
"div",
{staticClass:"row"},
[
_c(
"div",
{
staticClass:
"col-12 padding-top padding-bottom"},

[
_c("span",{
staticClass:
"h5 text-uppercase",
staticStyle:{
"margin-top":
"10px",
"margin-left":
"10px"}})])]),






_vm._v(" "),
_c(
"div",
{
staticClass:"row",
staticStyle:{
height:"75px"}},


[
_c(
"div",
{
staticClass:
"col-12 padding-top padding-bottom"},

[
_c(
"span",
{
staticClass:
"h5 text-uppercase",
staticStyle:{
"margin-left":
"60px",
"margin-top":
"50px"}},


[
_vm._v(
"\n                    "+
_vm._s(
_vm.
invoice_pos.
sale.
seller)+

".\n                    ")])])])]),









_vm._v(" "),
_c(
"div",
{staticClass:"col-4"},
[
_c(
"div",
{staticClass:"row"},
[
_c("div",{
staticClass:"col-4"}),

_vm._v(" "),
_c("div",{
staticClass:"col-4"}),

_vm._v(" "),
_c("div",{
staticClass:"col-4"})]),



_vm._v(" "),
_c(
"div",
{
staticClass:"row",
staticStyle:{
"margin-top":"-10px"}},


[
_c("div",{
staticClass:"col-4"}),

_vm._v(" "),
_c(
"div",
{
staticClass:"col-4"},

[
_c("span",[
_vm._v(
"\n                    "+
_vm._s(
_vm.
invoice_pos.
sale.date)+

".\n                    ")])]),




_vm._v(" "),
_c(
"div",
{
staticClass:"col-4"},

[
_c("span",[
_vm._v(
"\n                    "+
_vm._s(
_vm.
invoice_pos.
sale.
Reglement)+

".\n                    ")])])]),






_vm._v(" "),
_c(
"div",
{staticClass:"row"},
[
_c("div",{
staticClass:"col-6"}),

_vm._v(" "),
_c(
"div",
{
staticClass:"col-6"},

[
_c(
"span",
{
staticClass:
"h5 text-uppercase",
staticStyle:{
"margin-top":
"45px",
height:"40px"}},


[
_vm._v(
"\n                    "+
_vm._s(
_vm.
invoice_pos.
sale.
client_NRC)+

".\n                    ")])])]),







_vm._v(" "),
_c(
"div",
{staticClass:"row"},
[
_c("div",{
staticClass:"col-6"}),

_vm._v(" "),
_c(
"div",
{
staticClass:"col-6"},

[
_c(
"span",
{
staticClass:
"h5 text-uppercase",
staticStyle:{
"margin-top":
"45px",
height:"40px"}},


[
_vm._v(
"\n                    "+
_vm._s(
_vm.
invoice_pos.
sale.
client_NIT)+

".\n                    ")])])]),







_vm._v(" "),
_c(
"div",
{staticClass:"row"},
[
_c("div",{
staticClass:"col-6"}),

_vm._v(" "),
_c(
"div",
{
staticClass:"col-6"},

[
_c(
"span",
{
staticClass:
"h5 text-uppercase ml-1"},

[
_vm._v(
"\n\n                    Giro: "+
_vm._s(
_vm.
invoice_pos.
sale.
client_giro)+

"\n                    ")])])])])]),











_vm._v(" "),
_c(
"div",
{
staticClass:"row",
staticStyle:{height:"80px"}},

[
_c("div",{
staticClass:"col-1"}),

_vm._v(" "),
_c("div",{
staticClass:"col-2"}),

_vm._v(" "),
_c("div",{
staticClass:"col-5"}),

_vm._v(" "),
_c("div",{
staticClass:"col-1"}),

_vm._v(" "),
_c("div",{
staticClass:"col-1"}),

_vm._v(" "),
_c("div",{
staticClass:"col-1"}),

_vm._v(" "),
_c("div",{
staticClass:"col-1"})]),



_vm._v(" "),
_c(
"div",
{
staticStyle:{height:"400px"}},

_vm._l(
_vm.invoice_pos.details,
function(detail_invoice){
return _c(
"div",
{
key:detail_invoice,
staticClass:"row"},

[
_c(
"div",
{staticClass:"col-1"},
[
_c(
"span",
{
staticClass:
"h5 text-uppercase"},

[
_vm._v(
"\n                  "+
_vm._s(
detail_invoice.quantity)+

"\n                    ")])]),





_vm._v(" "),
_c(
"div",
{staticClass:"col-7"},
[
_c(
"span",
{
staticClass:
"h5 text-uppercase"},

[
_vm._v(
"\n                "+
_vm._s(
detail_invoice.code)+

"\n                    ")]),



_vm._v(
" -\n                "),

_c(
"span",
{
staticClass:
"h5 text-uppercase"},

[
_vm._v(
"\n                "+
_vm._s(
detail_invoice.name)+

"\n                    ")])]),





_vm._v(" "),
_c(
"div",
{staticClass:"col-1"},
[
_c(
"div",
{
staticClass:"row"},

[
_c("div",{
staticClass:
"col-4"}),

_vm._v(" "),
_c(
"div",
{
staticClass:
"col-6"},

[
_c(
"span",
{
staticClass:
"h5 text-uppercase",
staticStyle:{
"margin-let":
"-20px"}},


[
_vm._v(
"\n                    "+
_vm._s(
_vm.formatNumber(
detail_invoice.Net_price,
2))+


"\n                    ")])])])]),









_vm._v(" "),
_c("div",{
staticClass:"col-1"}),

_vm._v(" "),
_c("div",{
staticClass:"col-1"}),

_vm._v(" "),
_c(
"div",
{staticClass:"col-1"},
[
_c(
"span",
{
staticClass:
"h5 text-uppercase"},

[
_vm._v(
"\n                "+
_vm._s(
_vm.formatNumber(
detail_invoice.total-
detail_invoice.TaxNet,
2))+


"\n                    ")])])]);







}),

0),

_vm._v(" "),
_c(
"div",
{
staticClass:"row",
staticStyle:{
"margin-top":"-107px"}},


[
_c(
"div",
{staticClass:"col-9"},
[
_c(
"div",
{
staticClass:"row rounded"},

[
_c(
"span",
{
staticClass:
"h5 text-uppercase"},

[
_vm._v(
"\n                  "+
_vm._s(
_vm.GrandTotalText)+

"\n                    ")])])]),







_vm._v(" "),
_c(
"div",
{staticClass:"col-3"},
[
_c(
"div",
{staticClass:"row"},
[
_c("div",{
staticClass:"col-8"}),

_vm._v(" "),
_c(
"div",
{
staticClass:"col-4"},

[
_c(
"span",
{
staticClass:
"h5 text-uppercase"},

[
_vm._v(
"\n                    "+
_vm._s(
_vm.formatNumber(
_vm.
invoice_pos.
sale.
GrandTotal+
_vm.
invoice_pos.
sale.
TaxWithheld-
_vm.
invoice_pos.
sale.
taxe,
2))+


"\n                    ")])])]),







_vm._v(" "),
_c(
"div",
{staticClass:"row"},
[
_c("div",{
staticClass:"col-8"}),

_vm._v(" "),
_c(
"div",
{
staticClass:"col-4"},

[
_c(
"span",
{
staticClass:
"h5 text-uppercase",
staticStyle:{
"margin-top":
"14px"}},


[
_vm._v(
"\n                    "+
_vm._s(
_vm.formatNumber(
_vm.
invoice_pos.
sale.
taxe,
2))+


"\n                    ")])])]),







_vm._v(" "),
_c(
"div",
{staticClass:"row"},
[
_c("div",{
staticClass:"col-8"}),

_vm._v(" "),
_c(
"div",
{
staticClass:"col-4"},

[
_c(
"span",
{
staticClass:
"h5 text-uppercase",
staticStyle:{
"margin-top":
"15px"}},


[
_vm._v(
"\n                     "+
_vm._s(
_vm.formatNumber(
_vm.
invoice_pos.
sale.
GrandTotal+
_vm.
invoice_pos.
sale.
TaxWithheld,
2))+


"\n                    ")])])]),







_vm._v(" "),
_c(
"div",
{
staticClass:"row",
staticStyle:{
height:"70px",
"margin-top":"35px"}},


[
_c("div",{
staticClass:"col-8"}),

_vm._v(" "),
_c(
"div",
{
staticClass:"col-4"},

[
_vm.sale.
big_consumer==1?
_c(
"span",
{
staticClass:
"h5 text-uppercase"},

[
_vm._v(
"\n                    "+
_vm._s(
_vm.formatNumber(
_vm.
invoice_pos.
sale.
TaxWithheld,
2))+


"\n                    ")]):



_vm._e()])]),




_vm._v(" "),
_c(
"div",
{staticClass:"row"},
[
_c("div",{
staticClass:"col-8"}),

_vm._v(" "),
_c("div",{
staticClass:"col-4"})]),



_vm._v(" "),
_c(
"div",
{staticClass:"row"},
[
_c("div",{
staticClass:"col-8"}),

_vm._v(" "),
_c("div",{
staticClass:"col-4"})]),



_vm._v(" "),
_c(
"div",
{
staticClass:
"row align-items-end",
staticStyle:{
height:"50px",
"margin-top":"-25px"}},


[
_c("div",{
staticClass:"col-8"}),

_vm._v(" "),
_c(
"div",
{
staticClass:"col-4"},

[
_c(
"span",
{
staticClass:
"h5 text-uppercase"},

[
_vm._v(
"\n                    "+
_vm._s(
_vm.formatNumber(
_vm.
invoice_pos.
sale.
GrandTotal,
2))+


"\n                    ")])])])])])])])]),

















_vm._v(" "),
_c(
"button",
{
staticClass:"btn btn-outline-primary",
on:{
click:function click($event){
return _vm.print_pos();
}}},


[
_c("i",{staticClass:"i-Billing"}),
_vm._v(
"\n        "+
_vm._s(_vm.$t("print"))+
"\n      ")])],




1),

_vm._v(" "),
_c(
"div",
{staticClass:"offset-md-9 col-md-3 mt-4"},
[
_c(
"table",
{staticClass:"table table-striped table-sm"},
[
_c("tbody",[
_c("tr",[
_c("td",[
_vm._v(_vm._s(_vm.$t("OrderTax")))]),

_vm._v(" "),
_c("td",[
_c("span",[
_vm._v(
_vm._s(
_vm.formatNumber(
_vm.sale.TaxNet,
2))+


" "+
_vm._s(_vm.currentUser.currency)+
" ("+
_vm._s(
_vm.formatNumber(
_vm.sale.tax_rate,
2))+


" %)")])])]),




_vm._v(" "),
_c("tr"),
_vm.sale.big_consumer==1?
_c("tr",[
_c("td",[
_vm._v(
"(-) "+
_vm._s(_vm.$t("IVAwithholding")))]),


_vm._v(" "),
_c("td",[
_c("span",[
_vm._v(
"\n                       "+
_vm._s(
_vm.formatNumber(
_vm.sale.TaxWithheld,
2))+


"\n                       "+
_vm._s(
_vm.currentUser.currency)+

"\n                       ( 1.00% )\n                    ")])])]):




_vm._e(),
_vm._v(" "),
_c("tr",[
_c("td",[
_vm._v(_vm._s(_vm.$t("Discount")))]),

_vm._v(" "),
_c("td",[
_vm._v(
_vm._s(
_vm.formatNumber(
_vm.sale.discount,
2))+


" "+
_vm._s(_vm.currentUser.currency))])]),



_vm._v(" "),
_c("tr",[
_c("td",[
_vm._v(_vm._s(_vm.$t("Shipping")))]),

_vm._v(" "),
_c("td",[
_vm._v(
_vm._s(
_vm.formatNumber(
_vm.sale.shipping,
2))+


" "+
_vm._s(_vm.currentUser.currency))])]),



_vm._v(" "),
_c("tr",[
_c("td",[
_c(
"span",
{staticClass:"font-weight-bold"},
[_vm._v(_vm._s(_vm.$t("Total")))])]),


_vm._v(" "),
_c("td",[
_c(
"span",
{staticClass:"font-weight-bold"},
[
_vm._v(
_vm._s(
_vm.formatNumber(
_vm.sale.GrandTotal,
2))+


" "+
_vm._s(_vm.currentUser.currency))])])]),





_vm._v(" "),
_c("tr",[
_c("td",[
_c(
"span",
{staticClass:"font-weight-bold"},
[_vm._v(_vm._s(_vm.$t("Paid")))])]),


_vm._v(" "),
_c("td",[
_c(
"span",
{staticClass:"font-weight-bold"},
[
_vm._v(
_vm._s(
_vm.formatNumber(
_vm.sale.paid_amount,
2))+


" "+
_vm._s(_vm.currentUser.currency))])])]),





_vm._v(" "),
_c("tr",[
_c("td",[
_c(
"span",
{staticClass:"font-weight-bold"},
[_vm._v(_vm._s(_vm.$t("Due")))])]),


_vm._v(" "),
_c("td",[
_c(
"span",
{staticClass:"font-weight-bold"},
[
_vm._v(
_vm._s(
_vm.formatNumber(
_vm.sale.due,
2))+


" "+
_vm._s(_vm.currentUser.currency))])])])])])])],











1)],


1)])],




1):

_vm._e()],

1);

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

/***/"./resources/src/views/app/pages/sales/detail_sale.vue":
/*!*************************************************************!*\
  !*** ./resources/src/views/app/pages/sales/detail_sale.vue ***!
  \*************************************************************/
/*! exports provided: default */
/***/function resourcesSrcViewsAppPagesSalesDetail_saleVue(module,__webpack_exports__,__webpack_require__){
__webpack_require__.r(__webpack_exports__);
/* harmony import */var _detail_sale_vue_vue_type_template_id_9b055236___WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(/*! ./detail_sale.vue?vue&type=template&id=9b055236& */"./resources/src/views/app/pages/sales/detail_sale.vue?vue&type=template&id=9b055236&");
/* harmony import */var _detail_sale_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(/*! ./detail_sale.vue?vue&type=script&lang=js& */"./resources/src/views/app/pages/sales/detail_sale.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony import */var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */"./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component=Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
_detail_sale_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
_detail_sale_vue_vue_type_template_id_9b055236___WEBPACK_IMPORTED_MODULE_0__["render"],
_detail_sale_vue_vue_type_template_id_9b055236___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
false,
null,
null,
null);
component.options.__file="resources/src/views/app/pages/sales/detail_sale.vue";
/* harmony default export */__webpack_exports__["default"]=component.exports;

/***/},

/***/"./resources/src/views/app/pages/sales/detail_sale.vue?vue&type=script&lang=js&":
/*!**************************************************************************************!*\
  !*** ./resources/src/views/app/pages/sales/detail_sale.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************/
/*! exports provided: default */
/***/function resourcesSrcViewsAppPagesSalesDetail_saleVueVueTypeScriptLangJs(module,__webpack_exports__,__webpack_require__){
__webpack_require__.r(__webpack_exports__);
/* harmony import */var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_detail_sale_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./detail_sale.vue?vue&type=script&lang=js& */"./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/src/views/app/pages/sales/detail_sale.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */__webpack_exports__["default"]=_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_detail_sale_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"];

/***/},

/***/"./resources/src/views/app/pages/sales/detail_sale.vue?vue&type=template&id=9b055236&":
/*!********************************************************************************************!*\
  !*** ./resources/src/views/app/pages/sales/detail_sale.vue?vue&type=template&id=9b055236& ***!
  \********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/function resourcesSrcViewsAppPagesSalesDetail_saleVueVueTypeTemplateId9b055236(module,__webpack_exports__,__webpack_require__){
__webpack_require__.r(__webpack_exports__);
/* harmony import */var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_detail_sale_vue_vue_type_template_id_9b055236___WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(/*! -!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./detail_sale.vue?vue&type=template&id=9b055236& */"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/src/views/app/pages/sales/detail_sale.vue?vue&type=template&id=9b055236&");
/* harmony reexport (safe) */__webpack_require__.d(__webpack_exports__,"render",function(){return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_detail_sale_vue_vue_type_template_id_9b055236___WEBPACK_IMPORTED_MODULE_0__["render"];});

/* harmony reexport (safe) */__webpack_require__.d(__webpack_exports__,"staticRenderFns",function(){return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_detail_sale_vue_vue_type_template_id_9b055236___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"];});



/***/}}]);

}());
