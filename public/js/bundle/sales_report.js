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

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
var objectKeys = Object.keys || function keys(O) {
  return objectKeysInternal(O, enumBugKeys);
};

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
var toObject = function (argument) {
  return Object(requireObjectCoercible(argument));
};

// eslint-disable-next-line es/no-object-assign -- safe
var $assign = Object.assign;
// eslint-disable-next-line es/no-object-defineproperty -- required for testing
var defineProperty = Object.defineProperty;

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
var objectAssign = !$assign || fails(function () {
  // should have correct order of operations (Edge bug)
  if (descriptors && $assign({ b: 1 }, $assign(defineProperty({}, 'a', {
    enumerable: true,
    get: function () {
      defineProperty(this, 'b', {
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

// TODO: Remove from `core-js@4` since it's moved to entry points






var SPECIES = wellKnownSymbol('species');

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
      re.constructor[SPECIES] = function () { return re; };
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

var aFunction$1 = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  } return it;
};

var SPECIES$1 = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.es/ecma262/#sec-speciesconstructor
var speciesConstructor = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES$1]) == undefined ? defaultConstructor : aFunction$1(S);
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

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

var toStringTagSupport = String(test) === '[object z]';

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

var createProperty = function (object, key, value) {
  var propertyKey = toPrimitive(key);
  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};

var SPECIES$2 = wellKnownSymbol('species');

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
var arraySpeciesCreate = function (originalArray, length) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES$2];
      if (C === null) C = undefined;
    }
  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
};

var SPECIES$3 = wellKnownSymbol('species');

var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return engineV8Version >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES$3] = function () {
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

var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.es/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
_export({ target: 'Array', proto: true, forced: FORCED }, {
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

var defineProperty$1 = objectDefineProperty.f;



var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');

var setToStringTag = function (it, TAG, STATIC) {
  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG$2)) {
    defineProperty$1(it, TO_STRING_TAG$2, { configurable: true, value: TAG });
  }
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
var setInternalState = internalState.set;
var getInternalState = internalState.getterFor(ARRAY_ITERATOR);

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
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
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
var setInternalState$1 = internalState.set;
var getInternalState$1 = internalState.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState$1(this, {
    type: STRING_ITERATOR,
    string: String(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState$1(this);
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

var ITERATOR$2 = wellKnownSymbol('iterator');
var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
var ArrayValues = es_array_iterator.values;

for (var COLLECTION_NAME in domIterables) {
  var Collection = global_1[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR$2] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype, ITERATOR$2, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR$2] = ArrayValues;
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
var setInternalState$2 = internalState.set;
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
  setInternalState$2(this, {
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

  setInternalState$2(that, {
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
var setInternalState$3 = internalState.set;
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
  var state = setInternalState$3(that, { type: 'URL' });
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

var arrayMethodIsStrict = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call,no-throw-literal -- required for testing
    method.call(null, argument || function () { throw 1; }, 1);
  });
};

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
var STRICT_METHOD = arrayMethodIsStrict('sort');

var FORCED$1 = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD;

// `Array.prototype.sort` method
// https://tc39.es/ecma262/#sec-array.prototype.sort
_export({ target: 'Array', proto: true, forced: FORCED$1 }, {
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? nativeSort.call(toObject(this))
      : nativeSort.call(toObject(this), aFunction$1(comparefn));
  }
});

var push = [].push;

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterOut }` methods implementation
var createMethod$2 = function (TYPE) {
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
  forEach: createMethod$2(0),
  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  map: createMethod$2(1),
  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  filter: createMethod$2(2),
  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  some: createMethod$2(3),
  // `Array.prototype.every` method
  // https://tc39.es/ecma262/#sec-array.prototype.every
  every: createMethod$2(4),
  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  find: createMethod$2(5),
  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod$2(6),
  // `Array.prototype.filterOut` method
  // https://github.com/tc39/proposal-array-filtering
  filterOut: createMethod$2(7)
};

var $map = arrayIteration.map;


var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map');

// `Array.prototype.map` method
// https://tc39.es/ecma262/#sec-array.prototype.map
// with adding support of @@species
_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
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

var $filter = arrayIteration.filter;


var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('filter');

// `Array.prototype.filter` method
// https://tc39.es/ecma262/#sec-array.prototype.filter
// with adding support of @@species
_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 }, {
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["sales_report"],{

/***/"./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/src/views/app/pages/reports/sales_report.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/src/views/app/pages/reports/sales_report.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/function node_modulesBabelLoaderLibIndexJsNode_modulesVueLoaderLibIndexJsResourcesSrcViewsAppPagesReportsSales_reportVueVueTypeScriptLangJs(module,__webpack_exports__,__webpack_require__){
__webpack_require__.r(__webpack_exports__);
/* harmony import */var nprogress__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(/*! nprogress */"./node_modules/nprogress/nprogress.js");
/* harmony import */var nprogress__WEBPACK_IMPORTED_MODULE_0___default=/*#__PURE__*/__webpack_require__.n(nprogress__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */var jspdf__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(/*! jspdf */"./node_modules/jspdf/dist/jspdf.es.min.js");
/* harmony import */var jspdf_autotable__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(/*! jspdf-autotable */"./node_modules/jspdf-autotable/dist/jspdf.plugin.autotable.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
title:"Report Sales"},

data:function data(){
return {
isLoading:true,
serverParams:{
sort:{
field:"id",
type:"desc"},

page:1,
perPage:10},

limit:"10",
search:"",
totalRows:"",
Filter_Client:"",
Filter_Ref:"",
Filter_date:"",
Filter_status:"",
Filter_Payment:"",
customers:[],
sales:[]};

},
computed:{
columns:function columns(){
return [{
label:this.$t("date"),
field:"date",
tdClass:"text-left",
thClass:"text-left"},
{
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
label:this.$t("Status"),
field:"statut",
html:true,
tdClass:"text-left",
thClass:"text-left"},
{
label:this.$t("Total"),
field:"GrandTotal",
type:"decimal",
tdClass:"text-left",
thClass:"text-left"},
{
label:this.$t("Paid"),
field:"paid_amount",
type:"decimal",
tdClass:"text-left",
thClass:"text-left"},
{
label:this.$t("Due"),
field:"due",
type:"decimal",
tdClass:"text-left",
thClass:"text-left"},
{
label:this.$t("PaymentStatus"),
field:"payment_status",
html:true,
tdClass:"text-left",
thClass:"text-left"}];

}},

methods:{
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
//---- Event on Sort Change
onSortChange:function onSortChange(params){
var field="";

if(params[0].field=="client_name"){
field="client_id";
}else {
field=params[0].field;
}

this.updateParams({
sort:{
type:params[0].type,
field:field}});


this.Get_Sales(this.serverParams.page);
},
//---- Event on Search
onSearch:function onSearch(value){
this.search=value.searchTerm;
this.Get_Sales(this.serverParams.page);
},
//------ Reset Filter
Reset_Filter:function Reset_Filter(){
this.search="";
this.Filter_Client="";
this.Filter_status="";
this.Filter_Payment="";
this.Filter_Ref="";
this.Filter_date="";
this.Get_Sales(this.serverParams.page);
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
var pdf=new jspdf__WEBPACK_IMPORTED_MODULE_1__["default"]("p","pt");
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
pdf.text("Sales report",40,25);
pdf.save("Sales_report.pdf");
},
//-------------------------------- Sales Excel ------------------------------\\
Sales_Excel:function Sales_Excel(){
// Start the progress bar.
nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.start();
nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.set(0.1);
axios.get("sales/export/Excel",{
responseType:"blob",
// important
headers:{
"Content-Type":"application/json"}}).

then(function(response){
var url=window.URL.createObjectURL(new Blob([response.data]));
var link=document.createElement("a");
link.href=url;
link.setAttribute("download","List_Sales.xlsx");
document.body.appendChild(link);
link.click();// Complete the animation of the  progress bar.

nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.done();
})["catch"](function(){
// Complete the animation of the  progress bar.
nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.done();
});
},
//---------------------------------------- Set To Strings-------------------------\\
setToStrings:function setToStrings(){
// Simply replaces null values with strings=''
if(this.Filter_Client===null){
this.Filter_Client="";
}
},
//----------------------------------------- Get all Sales ------------------------------\\
Get_Sales:function Get_Sales(page){
var _this=this;

// Start the progress bar.
nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.start();
nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.set(0.1);
this.setToStrings();
axios.get("/report/Sales?page="+page+"&Ref="+this.Filter_Ref+"&date="+this.Filter_date+"&client_id="+this.Filter_Client+"&statut="+this.Filter_status+"&payment_statut="+this.Filter_Payment+"&SortField="+this.serverParams.sort.field+"&SortType="+this.serverParams.sort.type+"&search="+this.search+"&limit="+this.limit).then(function(response){
_this.sales=response.data.sales;
_this.customers=response.data.customers;
_this.totalRows=response.data.totalRows;// Complete the animation of theprogress bar.

nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.done();
_this.isLoading=false;
})["catch"](function(response){
// Complete the animation of theprogress bar.
nprogress__WEBPACK_IMPORTED_MODULE_0___default.a.done();
setTimeout(function(){
_this.isLoading=false;
},500);
});
}},

//----------------------------- Created function-------------------\\
created:function created(){
this.Get_Sales(1);
}};


/***/},

/***/"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/src/views/app/pages/reports/sales_report.vue?vue&type=template&id=145a50f4&":
/*!*****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/src/views/app/pages/reports/sales_report.vue?vue&type=template&id=145a50f4& ***!
  \*****************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/function node_modulesVueLoaderLibLoadersTemplateLoaderJsNode_modulesVueLoaderLibIndexJsResourcesSrcViewsAppPagesReportsSales_reportVueVueTypeTemplateId145a50f4(module,__webpack_exports__,__webpack_require__){
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
attrs:{page:_vm.$t("SalesReport"),folder:_vm.$t("Reports")}}),

_vm._v(" "),
_vm.isLoading?
_c("div",{
staticClass:"loading_page spinner spinner-primary mr-3"}):

_vm._e(),
_vm._v(" "),
!_vm.isLoading?
_c(
"b-card",
{staticClass:"wrapper"},
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

"pagination-options":{
enabled:true,
mode:"records",
nextLabel:"next",
prevLabel:"prev"},

styleClass:"order-table vgt-table"},

on:{
"on-page-change":_vm.onPageChange,
"on-per-page-change":_vm.onPerPageChange,
"on-sort-change":_vm.onSortChange,
"on-search":_vm.onSearch},

scopedSlots:_vm._u(
[
{
key:"table-row",
fn:function fn(props){
return [
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
staticClass:
"badge badge-outline-info"},

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

}}],


null,
false,
2617766521)},


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




1):

_vm._e(),
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
{attrs:{label:_vm.$t("Status")}},
[
_c(
"select",
{
directives:[
{
name:"model",
rawName:"v-model",
value:_vm.Filter_status,
expression:"Filter_status"}],


staticClass:"form-control",
attrs:{type:"text"},
on:{
change:function change($event){
var $$selectedVal=Array.prototype.filter.
call($event.target.options,function(o){
return o.selected;
}).
map(function(o){
var val=
"_value"in o?o._value:o.value;
return val;
});
_vm.Filter_status=$event.target.multiple?
$$selectedVal:
$$selectedVal[0];
}}},


[
_c(
"option",
{attrs:{value:"",selected:""}},
[_vm._v("All")]),

_vm._v(" "),
_c("option",{attrs:{value:"completed"}},[
_vm._v("Completed")]),

_vm._v(" "),
_c("option",{attrs:{value:"pending"}},[
_vm._v("Pending")]),

_vm._v(" "),
_c("option",{attrs:{value:"ordered"}},[
_vm._v("Ordered")])])])],






1),

_vm._v(" "),
_c(
"b-col",
{attrs:{md:"12"}},
[
_c(
"b-form-group",
{attrs:{label:_vm.$t("PaymentStatus")}},
[
_c(
"select",
{
directives:[
{
name:"model",
rawName:"v-model",
value:_vm.Filter_Payment,
expression:"Filter_Payment"}],


staticClass:"form-control",
attrs:{type:"text"},
on:{
change:function change($event){
var $$selectedVal=Array.prototype.filter.
call($event.target.options,function(o){
return o.selected;
}).
map(function(o){
var val=
"_value"in o?o._value:o.value;
return val;
});
_vm.Filter_Payment=$event.target.multiple?
$$selectedVal:
$$selectedVal[0];
}}},


[
_c(
"option",
{attrs:{value:"",selected:""}},
[_vm._v("All")]),

_vm._v(" "),
_c("option",{attrs:{value:"paid"}},[
_vm._v("Paid")]),

_vm._v(" "),
_c("option",{attrs:{value:"partial"}},[
_vm._v("partial")]),

_vm._v(" "),
_c("option",{attrs:{value:"unpaid"}},[
_vm._v("UnPaid")])])])],






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
variant:"primary ripple m-1",
size:"sm",
block:""},

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
variant:"danger ripple m-1",
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


1)])],




1);

};
var staticRenderFns=[];
render._withStripped=true;



/***/},

/***/"./resources/src/views/app/pages/reports/sales_report.vue":
/*!****************************************************************!*\
  !*** ./resources/src/views/app/pages/reports/sales_report.vue ***!
  \****************************************************************/
/*! exports provided: default */
/***/function resourcesSrcViewsAppPagesReportsSales_reportVue(module,__webpack_exports__,__webpack_require__){
__webpack_require__.r(__webpack_exports__);
/* harmony import */var _sales_report_vue_vue_type_template_id_145a50f4___WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(/*! ./sales_report.vue?vue&type=template&id=145a50f4& */"./resources/src/views/app/pages/reports/sales_report.vue?vue&type=template&id=145a50f4&");
/* harmony import */var _sales_report_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(/*! ./sales_report.vue?vue&type=script&lang=js& */"./resources/src/views/app/pages/reports/sales_report.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony import */var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */"./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component=Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
_sales_report_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
_sales_report_vue_vue_type_template_id_145a50f4___WEBPACK_IMPORTED_MODULE_0__["render"],
_sales_report_vue_vue_type_template_id_145a50f4___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
false,
null,
null,
null);
component.options.__file="resources/src/views/app/pages/reports/sales_report.vue";
/* harmony default export */__webpack_exports__["default"]=component.exports;

/***/},

/***/"./resources/src/views/app/pages/reports/sales_report.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************!*\
  !*** ./resources/src/views/app/pages/reports/sales_report.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************/
/*! exports provided: default */
/***/function resourcesSrcViewsAppPagesReportsSales_reportVueVueTypeScriptLangJs(module,__webpack_exports__,__webpack_require__){
__webpack_require__.r(__webpack_exports__);
/* harmony import */var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_sales_report_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./sales_report.vue?vue&type=script&lang=js& */"./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/src/views/app/pages/reports/sales_report.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */__webpack_exports__["default"]=_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_sales_report_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"];

/***/},

/***/"./resources/src/views/app/pages/reports/sales_report.vue?vue&type=template&id=145a50f4&":
/*!***********************************************************************************************!*\
  !*** ./resources/src/views/app/pages/reports/sales_report.vue?vue&type=template&id=145a50f4& ***!
  \***********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/function resourcesSrcViewsAppPagesReportsSales_reportVueVueTypeTemplateId145a50f4(module,__webpack_exports__,__webpack_require__){
__webpack_require__.r(__webpack_exports__);
/* harmony import */var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_sales_report_vue_vue_type_template_id_145a50f4___WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(/*! -!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./sales_report.vue?vue&type=template&id=145a50f4& */"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/src/views/app/pages/reports/sales_report.vue?vue&type=template&id=145a50f4&");
/* harmony reexport (safe) */__webpack_require__.d(__webpack_exports__,"render",function(){return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_sales_report_vue_vue_type_template_id_145a50f4___WEBPACK_IMPORTED_MODULE_0__["render"];});

/* harmony reexport (safe) */__webpack_require__.d(__webpack_exports__,"staticRenderFns",function(){return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_sales_report_vue_vue_type_template_id_145a50f4___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"];});



/***/}}]);

}());
=======
!function(){"use strict";var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function e(t,e){return t(e={exports:{}},e.exports),e.exports}var r=function(t){return t&&t.Math==Math&&t},n=r("object"==typeof globalThis&&globalThis)||r("object"==typeof window&&window)||r("object"==typeof self&&self)||r("object"==typeof t&&t)||function(){return this}()||Function("return this")(),a=function(t){try{return!!t()}catch(t){return!0}},i=!a((function(){return 7!=Object.defineProperty({},1,{get:function(){return 7}})[1]})),o={}.propertyIsEnumerable,s=Object.getOwnPropertyDescriptor,l={f:s&&!o.call({1:2},1)?function(t){var e=s(this,t);return!!e&&e.enumerable}:o},u=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}},c={}.toString,f=function(t){return c.call(t).slice(8,-1)},h="".split,p=a((function(){return!Object("z").propertyIsEnumerable(0)}))?function(t){return"String"==f(t)?h.call(t,""):Object(t)}:Object,d=function(t){if(null==t)throw TypeError("Can't call method on "+t);return t},v=function(t){return p(d(t))},g=function(t){return"object"==typeof t?null!==t:"function"==typeof t},m=function(t,e){if(!g(t))return t;var r,n;if(e&&"function"==typeof(r=t.toString)&&!g(n=r.call(t)))return n;if("function"==typeof(r=t.valueOf)&&!g(n=r.call(t)))return n;if(!e&&"function"==typeof(r=t.toString)&&!g(n=r.call(t)))return n;throw TypeError("Can't convert object to primitive value")},y={}.hasOwnProperty,b=function(t,e){return y.call(t,e)},S=n.document,_=g(S)&&g(S.createElement),w=function(t){return _?S.createElement(t):{}},x=!i&&!a((function(){return 7!=Object.defineProperty(w("div"),"a",{get:function(){return 7}}).a})),R=Object.getOwnPropertyDescriptor,P={f:i?R:function(t,e){if(t=v(t),e=m(e,!0),x)try{return R(t,e)}catch(t){}if(b(t,e))return u(!l.f.call(t,e),t[e])}},C=function(t){if(!g(t))throw TypeError(String(t)+" is not an object");return t},L=Object.defineProperty,A={f:i?L:function(t,e,r){if(C(t),e=m(e,!0),C(r),x)try{return L(t,e,r)}catch(t){}if("get"in r||"set"in r)throw TypeError("Accessors not supported");return"value"in r&&(t[e]=r.value),t}},E=i?function(t,e,r){return A.f(t,e,u(1,r))}:function(t,e,r){return t[e]=r,t},k=function(t,e){try{E(n,t,e)}catch(r){n[t]=e}return e},O=n["__core-js_shared__"]||k("__core-js_shared__",{}),j=Function.toString;"function"!=typeof O.inspectSource&&(O.inspectSource=function(t){return j.call(t)});var I,T,F,U=O.inspectSource,$=n.WeakMap,q="function"==typeof $&&/native code/.test(U($)),B=e((function(t){(t.exports=function(t,e){return O[t]||(O[t]=void 0!==e?e:{})})("versions",[]).push({version:"3.10.2",mode:"global",copyright:"© 2021 Denis Pushkarev (zloirock.ru)"})})),M=0,D=Math.random(),G=function(t){return"Symbol("+String(void 0===t?"":t)+")_"+(++M+D).toString(36)},N=B("keys"),z=function(t){return N[t]||(N[t]=G(t))},K={},V=n.WeakMap;if(q){var Y=O.state||(O.state=new V),H=Y.get,W=Y.has,X=Y.set;I=function(t,e){if(W.call(Y,t))throw new TypeError("Object already initialized");return e.facade=t,X.call(Y,t,e),e},T=function(t){return H.call(Y,t)||{}},F=function(t){return W.call(Y,t)}}else{var J=z("state");K[J]=!0,I=function(t,e){if(b(t,J))throw new TypeError("Object already initialized");return e.facade=t,E(t,J,e),e},T=function(t){return b(t,J)?t[J]:{}},F=function(t){return b(t,J)}}var Z,Q,tt={set:I,get:T,has:F,enforce:function(t){return F(t)?T(t):I(t,{})},getterFor:function(t){return function(e){var r;if(!g(e)||(r=T(e)).type!==t)throw TypeError("Incompatible receiver, "+t+" required");return r}}},et=e((function(t){var e=tt.get,r=tt.enforce,a=String(String).split("String");(t.exports=function(t,e,i,o){var s,l=!!o&&!!o.unsafe,u=!!o&&!!o.enumerable,c=!!o&&!!o.noTargetGet;"function"==typeof i&&("string"!=typeof e||b(i,"name")||E(i,"name",e),(s=r(i)).source||(s.source=a.join("string"==typeof e?e:""))),t!==n?(l?!c&&t[e]&&(u=!0):delete t[e],u?t[e]=i:E(t,e,i)):u?t[e]=i:k(e,i)})(Function.prototype,"toString",(function(){return"function"==typeof this&&e(this).source||U(this)}))})),rt=n,nt=function(t){return"function"==typeof t?t:void 0},at=function(t,e){return arguments.length<2?nt(rt[t])||nt(n[t]):rt[t]&&rt[t][e]||n[t]&&n[t][e]},it=Math.ceil,ot=Math.floor,st=function(t){return isNaN(t=+t)?0:(t>0?ot:it)(t)},lt=Math.min,ut=function(t){return t>0?lt(st(t),9007199254740991):0},ct=Math.max,ft=Math.min,ht=function(t){return function(e,r,n){var a,i=v(e),o=ut(i.length),s=function(t,e){var r=st(t);return r<0?ct(r+e,0):ft(r,e)}(n,o);if(t&&r!=r){for(;o>s;)if((a=i[s++])!=a)return!0}else for(;o>s;s++)if((t||s in i)&&i[s]===r)return t||s||0;return!t&&-1}},pt={includes:ht(!0),indexOf:ht(!1)}.indexOf,dt=function(t,e){var r,n=v(t),a=0,i=[];for(r in n)!b(K,r)&&b(n,r)&&i.push(r);for(;e.length>a;)b(n,r=e[a++])&&(~pt(i,r)||i.push(r));return i},vt=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"],gt=vt.concat("length","prototype"),mt={f:Object.getOwnPropertyNames||function(t){return dt(t,gt)}},yt={f:Object.getOwnPropertySymbols},bt=at("Reflect","ownKeys")||function(t){var e=mt.f(C(t)),r=yt.f;return r?e.concat(r(t)):e},St=function(t,e){for(var r=bt(e),n=A.f,a=P.f,i=0;i<r.length;i++){var o=r[i];b(t,o)||n(t,o,a(e,o))}},_t=/#|\.prototype\./,wt=function(t,e){var r=Rt[xt(t)];return r==Ct||r!=Pt&&("function"==typeof e?a(e):!!e)},xt=wt.normalize=function(t){return String(t).replace(_t,".").toLowerCase()},Rt=wt.data={},Pt=wt.NATIVE="N",Ct=wt.POLYFILL="P",Lt=wt,At=P.f,Et=function(t,e){var r,a,i,o,s,l=t.target,u=t.global,c=t.stat;if(r=u?n:c?n[l]||k(l,{}):(n[l]||{}).prototype)for(a in e){if(o=e[a],i=t.noTargetGet?(s=At(r,a))&&s.value:r[a],!Lt(u?a:l+(c?".":"#")+a,t.forced)&&void 0!==i){if(typeof o==typeof i)continue;St(o,i)}(t.sham||i&&i.sham)&&E(o,"sham",!0),et(r,a,o,t)}},kt=function(t){if("function"!=typeof t)throw TypeError(String(t)+" is not a function");return t},Ot=function(t,e,r){if(kt(t),void 0===e)return t;switch(r){case 0:return function(){return t.call(e)};case 1:return function(r){return t.call(e,r)};case 2:return function(r,n){return t.call(e,r,n)};case 3:return function(r,n,a){return t.call(e,r,n,a)}}return function(){return t.apply(e,arguments)}},jt=function(t){return Object(d(t))},It=Array.isArray||function(t){return"Array"==f(t)},Tt="process"==f(n.process),Ft=at("navigator","userAgent")||"",Ut=n.process,$t=Ut&&Ut.versions,qt=$t&&$t.v8;qt?Q=(Z=qt.split("."))[0]+Z[1]:Ft&&(!(Z=Ft.match(/Edge\/(\d+)/))||Z[1]>=74)&&(Z=Ft.match(/Chrome\/(\d+)/))&&(Q=Z[1]);var Bt=Q&&+Q,Mt=!!Object.getOwnPropertySymbols&&!a((function(){return!Symbol.sham&&(Tt?38===Bt:Bt>37&&Bt<41)})),Dt=Mt&&!Symbol.sham&&"symbol"==typeof Symbol.iterator,Gt=B("wks"),Nt=n.Symbol,zt=Dt?Nt:Nt&&Nt.withoutSetter||G,Kt=function(t){return b(Gt,t)&&(Mt||"string"==typeof Gt[t])||(Mt&&b(Nt,t)?Gt[t]=Nt[t]:Gt[t]=zt("Symbol."+t)),Gt[t]},Vt=Kt("species"),Yt=function(t,e){var r;return It(t)&&("function"!=typeof(r=t.constructor)||r!==Array&&!It(r.prototype)?g(r)&&null===(r=r[Vt])&&(r=void 0):r=void 0),new(void 0===r?Array:r)(0===e?0:e)},Ht=[].push,Wt=function(t){var e=1==t,r=2==t,n=3==t,a=4==t,i=6==t,o=7==t,s=5==t||i;return function(l,u,c,f){for(var h,d,v=jt(l),g=p(v),m=Ot(u,c,3),y=ut(g.length),b=0,S=f||Yt,_=e?S(l,y):r||o?S(l,0):void 0;y>b;b++)if((s||b in g)&&(d=m(h=g[b],b,v),t))if(e)_[b]=d;else if(d)switch(t){case 3:return!0;case 5:return h;case 6:return b;case 2:Ht.call(_,h)}else switch(t){case 4:return!1;case 7:Ht.call(_,h)}return i?-1:n||a?a:_}},Xt={forEach:Wt(0),map:Wt(1),filter:Wt(2),some:Wt(3),every:Wt(4),find:Wt(5),findIndex:Wt(6),filterOut:Wt(7)},Jt=Kt("species"),Zt=function(t){return Bt>=51||!a((function(){var e=[];return(e.constructor={})[Jt]=function(){return{foo:1}},1!==e[t](Boolean).foo}))},Qt=Xt.map,te=Zt("map");Et({target:"Array",proto:!0,forced:!te},{map:function(t){return Qt(this,t,arguments.length>1?arguments[1]:void 0)}});var ee=A.f,re=Function.prototype,ne=re.toString,ae=/^\s*function ([^ (]*)/;i&&!("name"in re)&&ee(re,"name",{configurable:!0,get:function(){try{return ne.call(this).match(ae)[1]}catch(t){return""}}});var ie=Xt.filter,oe=Zt("filter");Et({target:"Array",proto:!0,forced:!oe},{filter:function(t){return ie(this,t,arguments.length>1?arguments[1]:void 0)}});var se=Object.keys||function(t){return dt(t,vt)},le=Object.assign,ue=Object.defineProperty,ce=!le||a((function(){if(i&&1!==le({b:1},le(ue({},"a",{enumerable:!0,get:function(){ue(this,"b",{value:3,enumerable:!1})}}),{b:2})).b)return!0;var t={},e={},r=Symbol();return t[r]=7,"abcdefghijklmnopqrst".split("").forEach((function(t){e[t]=t})),7!=le({},t)[r]||"abcdefghijklmnopqrst"!=se(le({},e)).join("")}))?function(t,e){for(var r=jt(t),n=arguments.length,a=1,o=yt.f,s=l.f;n>a;)for(var u,c=p(arguments[a++]),f=o?se(c).concat(o(c)):se(c),h=f.length,d=0;h>d;)u=f[d++],i&&!s.call(c,u)||(r[u]=c[u]);return r}:le;Et({target:"Object",stat:!0,forced:Object.assign!==ce},{assign:ce});var fe=function(){var t=C(this),e="";return t.global&&(e+="g"),t.ignoreCase&&(e+="i"),t.multiline&&(e+="m"),t.dotAll&&(e+="s"),t.unicode&&(e+="u"),t.sticky&&(e+="y"),e};function he(t,e){return RegExp(t,e)}var pe,de,ve={UNSUPPORTED_Y:a((function(){var t=he("a","y");return t.lastIndex=2,null!=t.exec("abcd")})),BROKEN_CARET:a((function(){var t=he("^r","gy");return t.lastIndex=2,null!=t.exec("str")}))},ge=RegExp.prototype.exec,me=B("native-string-replace",String.prototype.replace),ye=ge,be=(pe=/a/,de=/b*/g,ge.call(pe,"a"),ge.call(de,"a"),0!==pe.lastIndex||0!==de.lastIndex),Se=ve.UNSUPPORTED_Y||ve.BROKEN_CARET,_e=void 0!==/()??/.exec("")[1];(be||_e||Se)&&(ye=function(t){var e,r,n,a,i=this,o=Se&&i.sticky,s=fe.call(i),l=i.source,u=0,c=t;return o&&(-1===(s=s.replace("y","")).indexOf("g")&&(s+="g"),c=String(t).slice(i.lastIndex),i.lastIndex>0&&(!i.multiline||i.multiline&&"\n"!==t[i.lastIndex-1])&&(l="(?: "+l+")",c=" "+c,u++),r=new RegExp("^(?:"+l+")",s)),_e&&(r=new RegExp("^"+l+"$(?!\\s)",s)),be&&(e=i.lastIndex),n=ge.call(o?r:i,c),o?n?(n.input=n.input.slice(u),n[0]=n[0].slice(u),n.index=i.lastIndex,i.lastIndex+=n[0].length):i.lastIndex=0:be&&n&&(i.lastIndex=i.global?n.index+n[0].length:e),_e&&n&&n.length>1&&me.call(n[0],r,(function(){for(a=1;a<arguments.length-2;a++)void 0===arguments[a]&&(n[a]=void 0)})),n});var we=ye;Et({target:"RegExp",proto:!0,forced:/./.exec!==we},{exec:we});var xe=Kt("species"),Re=!a((function(){var t=/./;return t.exec=function(){var t=[];return t.groups={a:"7"},t},"7"!=="".replace(t,"$<a>")})),Pe="$0"==="a".replace(/./,"$0"),Ce=Kt("replace"),Le=!!/./[Ce]&&""===/./[Ce]("a","$0"),Ae=!a((function(){var t=/(?:)/,e=t.exec;t.exec=function(){return e.apply(this,arguments)};var r="ab".split(t);return 2!==r.length||"a"!==r[0]||"b"!==r[1]})),Ee=function(t,e,r,n){var i=Kt(t),o=!a((function(){var e={};return e[i]=function(){return 7},7!=""[t](e)})),s=o&&!a((function(){var e=!1,r=/a/;return"split"===t&&((r={}).constructor={},r.constructor[xe]=function(){return r},r.flags="",r[i]=/./[i]),r.exec=function(){return e=!0,null},r[i](""),!e}));if(!o||!s||"replace"===t&&(!Re||!Pe||Le)||"split"===t&&!Ae){var l=/./[i],u=r(i,""[t],(function(t,e,r,n,a){return e.exec===RegExp.prototype.exec?o&&!a?{done:!0,value:l.call(e,r,n)}:{done:!0,value:t.call(r,e,n)}:{done:!1}}),{REPLACE_KEEPS_$0:Pe,REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE:Le}),c=u[0],f=u[1];et(String.prototype,t,c),et(RegExp.prototype,i,2==e?function(t,e){return f.call(t,this,e)}:function(t){return f.call(t,this)})}n&&E(RegExp.prototype[i],"sham",!0)},ke=Object.is||function(t,e){return t===e?0!==t||1/t==1/e:t!=t&&e!=e},Oe=function(t,e){var r=t.exec;if("function"==typeof r){var n=r.call(t,e);if("object"!=typeof n)throw TypeError("RegExp exec method returned something other than an Object or null");return n}if("RegExp"!==f(t))throw TypeError("RegExp#exec called on incompatible receiver");return we.call(t,e)};Ee("search",1,(function(t,e,r){return[function(e){var r=d(this),n=null==e?void 0:e[t];return void 0!==n?n.call(e,r):new RegExp(e)[t](String(r))},function(t){var n=r(e,t,this);if(n.done)return n.value;var a=C(t),i=String(this),o=a.lastIndex;ke(o,0)||(a.lastIndex=0);var s=Oe(a,i);return ke(a.lastIndex,o)||(a.lastIndex=o),null===s?-1:s.index}]}));var je=Kt("match"),Ie=Kt("species"),Te=function(t){return function(e,r){var n,a,i=String(d(e)),o=st(r),s=i.length;return o<0||o>=s?t?"":void 0:(n=i.charCodeAt(o))<55296||n>56319||o+1===s||(a=i.charCodeAt(o+1))<56320||a>57343?t?i.charAt(o):n:t?i.slice(o,o+2):a-56320+(n-55296<<10)+65536}},Fe={codeAt:Te(!1),charAt:Te(!0)},Ue=Fe.charAt,$e=function(t,e,r){return e+(r?Ue(t,e).length:1)},qe=ve.UNSUPPORTED_Y,Be=[].push,Me=Math.min;Ee("split",2,(function(t,e,r){var n;return n="c"=="abbc".split(/(b)*/)[1]||4!="test".split(/(?:)/,-1).length||2!="ab".split(/(?:ab)*/).length||4!=".".split(/(.?)(.?)/).length||".".split(/()()/).length>1||"".split(/.?/).length?function(t,r){var n,a,i=String(d(this)),o=void 0===r?4294967295:r>>>0;if(0===o)return[];if(void 0===t)return[i];if(!g(n=t)||!(void 0!==(a=n[je])?a:"RegExp"==f(n)))return e.call(i,t,o);for(var s,l,u,c=[],h=(t.ignoreCase?"i":"")+(t.multiline?"m":"")+(t.unicode?"u":"")+(t.sticky?"y":""),p=0,v=new RegExp(t.source,h+"g");(s=we.call(v,i))&&!((l=v.lastIndex)>p&&(c.push(i.slice(p,s.index)),s.length>1&&s.index<i.length&&Be.apply(c,s.slice(1)),u=s[0].length,p=l,c.length>=o));)v.lastIndex===s.index&&v.lastIndex++;return p===i.length?!u&&v.test("")||c.push(""):c.push(i.slice(p)),c.length>o?c.slice(0,o):c}:"0".split(void 0,0).length?function(t,r){return void 0===t&&0===r?[]:e.call(this,t,r)}:e,[function(e,r){var a=d(this),i=null==e?void 0:e[t];return void 0!==i?i.call(e,a,r):n.call(String(a),e,r)},function(t,a){var i=r(n,t,this,a,n!==e);if(i.done)return i.value;var o=C(t),s=String(this),l=function(t,e){var r,n=C(t).constructor;return void 0===n||null==(r=C(n)[Ie])?e:kt(r)}(o,RegExp),u=o.unicode,c=(o.ignoreCase?"i":"")+(o.multiline?"m":"")+(o.unicode?"u":"")+(qe?"g":"y"),f=new l(qe?"^(?:"+o.source+")":o,c),h=void 0===a?4294967295:a>>>0;if(0===h)return[];if(0===s.length)return null===Oe(f,s)?[s]:[];for(var p=0,d=0,v=[];d<s.length;){f.lastIndex=qe?0:d;var g,m=Oe(f,qe?s.slice(d):s);if(null===m||(g=Me(ut(f.lastIndex+(qe?d:0)),s.length))===p)d=$e(s,d,u);else{if(v.push(s.slice(p,d)),v.length===h)return v;for(var y=1;y<=m.length-1;y++)if(v.push(m[y]),v.length===h)return v;d=p=g}}return v.push(s.slice(p)),v}]}),qe);var De={};De[Kt("toStringTag")]="z";var Ge="[object z]"===String(De),Ne=Kt("toStringTag"),ze="Arguments"==f(function(){return arguments}()),Ke=Ge?f:function(t){var e,r,n;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(r=function(t,e){try{return t[e]}catch(t){}}(e=Object(t),Ne))?r:ze?f(e):"Object"==(n=f(e))&&"function"==typeof e.callee?"Arguments":n},Ve=Ge?{}.toString:function(){return"[object "+Ke(this)+"]"};Ge||et(Object.prototype,"toString",Ve,{unsafe:!0});var Ye=RegExp.prototype,He=Ye.toString,We=a((function(){return"/a/b"!=He.call({source:"a",flags:"b"})})),Xe="toString"!=He.name;(We||Xe)&&et(RegExp.prototype,"toString",(function(){var t=C(this),e=String(t.source),r=t.flags;return"/"+e+"/"+String(void 0===r&&t instanceof RegExp&&!("flags"in Ye)?fe.call(t):r)}),{unsafe:!0});var Je=function(t,e,r){var n=m(e);n in t?A.f(t,n,u(0,r)):t[n]=r},Ze=Kt("isConcatSpreadable"),Qe=Bt>=51||!a((function(){var t=[];return t[Ze]=!1,t.concat()[0]!==t})),tr=Zt("concat"),er=function(t){if(!g(t))return!1;var e=t[Ze];return void 0!==e?!!e:It(t)};Et({target:"Array",proto:!0,forced:!Qe||!tr},{concat:function(t){var e,r,n,a,i,o=jt(this),s=Yt(o,0),l=0;for(e=-1,n=arguments.length;e<n;e++)if(er(i=-1===e?o:arguments[e])){if(l+(a=ut(i.length))>9007199254740991)throw TypeError("Maximum allowed index exceeded");for(r=0;r<a;r++,l++)r in i&&Je(s,l,i[r])}else{if(l>=9007199254740991)throw TypeError("Maximum allowed index exceeded");Je(s,l++,i)}return s.length=l,s}});var rr,nr=i?Object.defineProperties:function(t,e){C(t);for(var r,n=se(e),a=n.length,i=0;a>i;)A.f(t,r=n[i++],e[r]);return t},ar=at("document","documentElement"),ir=z("IE_PROTO"),or=function(){},sr=function(t){return"<script>"+t+"<\/script>"},lr=function(){try{rr=document.domain&&new ActiveXObject("htmlfile")}catch(t){}var t,e;lr=rr?function(t){t.write(sr("")),t.close();var e=t.parentWindow.Object;return t=null,e}(rr):((e=w("iframe")).style.display="none",ar.appendChild(e),e.src=String("javascript:"),(t=e.contentWindow.document).open(),t.write(sr("document.F=Object")),t.close(),t.F);for(var r=vt.length;r--;)delete lr.prototype[vt[r]];return lr()};K[ir]=!0;var ur=Object.create||function(t,e){var r;return null!==t?(or.prototype=C(t),r=new or,or.prototype=null,r[ir]=t):r=lr(),void 0===e?r:nr(r,e)},cr=Kt("unscopables"),fr=Array.prototype;null==fr[cr]&&A.f(fr,cr,{configurable:!0,value:ur(null)});var hr,pr,dr,vr=function(t){fr[cr][t]=!0},gr={},mr=!a((function(){function t(){}return t.prototype.constructor=null,Object.getPrototypeOf(new t)!==t.prototype})),yr=z("IE_PROTO"),br=Object.prototype,Sr=mr?Object.getPrototypeOf:function(t){return t=jt(t),b(t,yr)?t[yr]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?br:null},_r=Kt("iterator"),wr=!1;[].keys&&("next"in(dr=[].keys())?(pr=Sr(Sr(dr)))!==Object.prototype&&(hr=pr):wr=!0),(null==hr||a((function(){var t={};return hr[_r].call(t)!==t})))&&(hr={}),b(hr,_r)||E(hr,_r,(function(){return this}));var xr={IteratorPrototype:hr,BUGGY_SAFARI_ITERATORS:wr},Rr=A.f,Pr=Kt("toStringTag"),Cr=function(t,e,r){t&&!b(t=r?t:t.prototype,Pr)&&Rr(t,Pr,{configurable:!0,value:e})},Lr=xr.IteratorPrototype,Ar=function(){return this},Er=function(t,e,r){var n=e+" Iterator";return t.prototype=ur(Lr,{next:u(1,r)}),Cr(t,n,!1),gr[n]=Ar,t},kr=Object.setPrototypeOf||("__proto__"in{}?function(){var t,e=!1,r={};try{(t=Object.getOwnPropertyDescriptor(Object.prototype,"__proto__").set).call(r,[]),e=r instanceof Array}catch(t){}return function(r,n){return C(r),function(t){if(!g(t)&&null!==t)throw TypeError("Can't set "+String(t)+" as a prototype")}(n),e?t.call(r,n):r.__proto__=n,r}}():void 0),Or=xr.IteratorPrototype,jr=xr.BUGGY_SAFARI_ITERATORS,Ir=Kt("iterator"),Tr=function(){return this},Fr=function(t,e,r,n,a,i,o){Er(r,e,n);var s,l,u,c=function(t){if(t===a&&v)return v;if(!jr&&t in p)return p[t];switch(t){case"keys":case"values":case"entries":return function(){return new r(this,t)}}return function(){return new r(this)}},f=e+" Iterator",h=!1,p=t.prototype,d=p[Ir]||p["@@iterator"]||a&&p[a],v=!jr&&d||c(a),g="Array"==e&&p.entries||d;if(g&&(s=Sr(g.call(new t)),Or!==Object.prototype&&s.next&&(Sr(s)!==Or&&(kr?kr(s,Or):"function"!=typeof s[Ir]&&E(s,Ir,Tr)),Cr(s,f,!0))),"values"==a&&d&&"values"!==d.name&&(h=!0,v=function(){return d.call(this)}),p[Ir]!==v&&E(p,Ir,v),gr[e]=v,a)if(l={values:c("values"),keys:i?v:c("keys"),entries:c("entries")},o)for(u in l)(jr||h||!(u in p))&&et(p,u,l[u]);else Et({target:e,proto:!0,forced:jr||h},l);return l},Ur=tt.set,$r=tt.getterFor("Array Iterator"),qr=Fr(Array,"Array",(function(t,e){Ur(this,{type:"Array Iterator",target:v(t),index:0,kind:e})}),(function(){var t=$r(this),e=t.target,r=t.kind,n=t.index++;return!e||n>=e.length?(t.target=void 0,{value:void 0,done:!0}):"keys"==r?{value:n,done:!1}:"values"==r?{value:e[n],done:!1}:{value:[n,e[n]],done:!1}}),"values");gr.Arguments=gr.Array,vr("keys"),vr("values"),vr("entries");var Br=Fe.charAt,Mr=tt.set,Dr=tt.getterFor("String Iterator");Fr(String,"String",(function(t){Mr(this,{type:"String Iterator",string:String(t),index:0})}),(function(){var t,e=Dr(this),r=e.string,n=e.index;return n>=r.length?{value:void 0,done:!0}:(t=Br(r,n),e.index+=t.length,{value:t,done:!1})}));var Gr={CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0},Nr=Kt("iterator"),zr=Kt("toStringTag"),Kr=qr.values;for(var Vr in Gr){var Yr=n[Vr],Hr=Yr&&Yr.prototype;if(Hr){if(Hr[Nr]!==Kr)try{E(Hr,Nr,Kr)}catch(t){Hr[Nr]=Kr}if(Hr[zr]||E(Hr,zr,Vr),Gr[Vr])for(var Wr in qr)if(Hr[Wr]!==qr[Wr])try{E(Hr,Wr,qr[Wr])}catch(t){Hr[Wr]=qr[Wr]}}}var Xr=Kt("iterator"),Jr=!a((function(){var t=new URL("b?a=1&b=2&c=3","http://a"),e=t.searchParams,r="";return t.pathname="c%20d",e.forEach((function(t,n){e.delete("b"),r+=n+t})),!e.sort||"http://a/c%20d?a=1&c=3"!==t.href||"3"!==e.get("c")||"a=1"!==String(new URLSearchParams("?a=1"))||!e[Xr]||"a"!==new URL("https://a@b").username||"b"!==new URLSearchParams(new URLSearchParams("a=b")).get("a")||"xn--e1aybc"!==new URL("http://тест").host||"#%D0%B1"!==new URL("http://a#б").hash||"a1c3"!==r||"x"!==new URL("http://x",void 0).host})),Zr=function(t,e,r){if(!(t instanceof e))throw TypeError("Incorrect "+(r?r+" ":"")+"invocation");return t},Qr=function(t,e,r,n){try{return n?e(C(r)[0],r[1]):e(r)}catch(e){throw function(t){var e=t.return;if(void 0!==e)C(e.call(t)).value}(t),e}},tn=Kt("iterator"),en=Array.prototype,rn=function(t){return void 0!==t&&(gr.Array===t||en[tn]===t)},nn=Kt("iterator"),an=function(t){if(null!=t)return t[nn]||t["@@iterator"]||gr[Ke(t)]},on=function(t){var e,r,n,a,i,o,s=jt(t),l="function"==typeof this?this:Array,u=arguments.length,c=u>1?arguments[1]:void 0,f=void 0!==c,h=an(s),p=0;if(f&&(c=Ot(c,u>2?arguments[2]:void 0,2)),null==h||l==Array&&rn(h))for(r=new l(e=ut(s.length));e>p;p++)o=f?c(s[p],p):s[p],Je(r,p,o);else for(i=(a=h.call(s)).next,r=new l;!(n=i.call(a)).done;p++)o=f?Qr(a,c,[n.value,p],!0):n.value,Je(r,p,o);return r.length=p,r},sn=/[^\0-\u007E]/,ln=/[.\u3002\uFF0E\uFF61]/g,un="Overflow: input needs wider integers to process",cn=Math.floor,fn=String.fromCharCode,hn=function(t){return t+22+75*(t<26)},pn=function(t,e,r){var n=0;for(t=r?cn(t/700):t>>1,t+=cn(t/e);t>455;n+=36)t=cn(t/35);return cn(n+36*t/(t+38))},dn=function(t){var e,r,n=[],a=(t=function(t){for(var e=[],r=0,n=t.length;r<n;){var a=t.charCodeAt(r++);if(a>=55296&&a<=56319&&r<n){var i=t.charCodeAt(r++);56320==(64512&i)?e.push(((1023&a)<<10)+(1023&i)+65536):(e.push(a),r--)}else e.push(a)}return e}(t)).length,i=128,o=0,s=72;for(e=0;e<t.length;e++)(r=t[e])<128&&n.push(fn(r));var l=n.length,u=l;for(l&&n.push("-");u<a;){var c=2147483647;for(e=0;e<t.length;e++)(r=t[e])>=i&&r<c&&(c=r);var f=u+1;if(c-i>cn((2147483647-o)/f))throw RangeError(un);for(o+=(c-i)*f,i=c,e=0;e<t.length;e++){if((r=t[e])<i&&++o>2147483647)throw RangeError(un);if(r==i){for(var h=o,p=36;;p+=36){var d=p<=s?1:p>=s+26?26:p-s;if(h<d)break;var v=h-d,g=36-d;n.push(fn(hn(d+v%g))),h=cn(v/g)}n.push(fn(hn(h))),s=pn(o,f,u==l),o=0,++u}}++o,++i}return n.join("")},vn=function(t){var e=an(t);if("function"!=typeof e)throw TypeError(String(t)+" is not iterable");return C(e.call(t))},gn=at("fetch"),mn=at("Headers"),yn=Kt("iterator"),bn=tt.set,Sn=tt.getterFor("URLSearchParams"),_n=tt.getterFor("URLSearchParamsIterator"),wn=/\+/g,xn=Array(4),Rn=function(t){return xn[t-1]||(xn[t-1]=RegExp("((?:%[\\da-f]{2}){"+t+"})","gi"))},Pn=function(t){try{return decodeURIComponent(t)}catch(e){return t}},Cn=function(t){var e=t.replace(wn," "),r=4;try{return decodeURIComponent(e)}catch(t){for(;r;)e=e.replace(Rn(r--),Pn);return e}},Ln=/[!'()~]|%20/g,An={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+"},En=function(t){return An[t]},kn=function(t){return encodeURIComponent(t).replace(Ln,En)},On=function(t,e){if(e)for(var r,n,a=e.split("&"),i=0;i<a.length;)(r=a[i++]).length&&(n=r.split("="),t.push({key:Cn(n.shift()),value:Cn(n.join("="))}))},jn=function(t){this.entries.length=0,On(this.entries,t)},In=function(t,e){if(t<e)throw TypeError("Not enough arguments")},Tn=Er((function(t,e){bn(this,{type:"URLSearchParamsIterator",iterator:vn(Sn(t).entries),kind:e})}),"Iterator",(function(){var t=_n(this),e=t.kind,r=t.iterator.next(),n=r.value;return r.done||(r.value="keys"===e?n.key:"values"===e?n.value:[n.key,n.value]),r})),Fn=function(){Zr(this,Fn,"URLSearchParams");var t,e,r,n,a,i,o,s,l,u=arguments.length>0?arguments[0]:void 0,c=this,f=[];if(bn(c,{type:"URLSearchParams",entries:f,updateURL:function(){},updateSearchParams:jn}),void 0!==u)if(g(u))if("function"==typeof(t=an(u)))for(r=(e=t.call(u)).next;!(n=r.call(e)).done;){if((o=(i=(a=vn(C(n.value))).next).call(a)).done||(s=i.call(a)).done||!i.call(a).done)throw TypeError("Expected sequence with length 2");f.push({key:o.value+"",value:s.value+""})}else for(l in u)b(u,l)&&f.push({key:l,value:u[l]+""});else On(f,"string"==typeof u?"?"===u.charAt(0)?u.slice(1):u:u+"")},Un=Fn.prototype;!function(t,e,r){for(var n in e)et(t,n,e[n],r)}(Un,{append:function(t,e){In(arguments.length,2);var r=Sn(this);r.entries.push({key:t+"",value:e+""}),r.updateURL()},delete:function(t){In(arguments.length,1);for(var e=Sn(this),r=e.entries,n=t+"",a=0;a<r.length;)r[a].key===n?r.splice(a,1):a++;e.updateURL()},get:function(t){In(arguments.length,1);for(var e=Sn(this).entries,r=t+"",n=0;n<e.length;n++)if(e[n].key===r)return e[n].value;return null},getAll:function(t){In(arguments.length,1);for(var e=Sn(this).entries,r=t+"",n=[],a=0;a<e.length;a++)e[a].key===r&&n.push(e[a].value);return n},has:function(t){In(arguments.length,1);for(var e=Sn(this).entries,r=t+"",n=0;n<e.length;)if(e[n++].key===r)return!0;return!1},set:function(t,e){In(arguments.length,1);for(var r,n=Sn(this),a=n.entries,i=!1,o=t+"",s=e+"",l=0;l<a.length;l++)(r=a[l]).key===o&&(i?a.splice(l--,1):(i=!0,r.value=s));i||a.push({key:o,value:s}),n.updateURL()},sort:function(){var t,e,r,n=Sn(this),a=n.entries,i=a.slice();for(a.length=0,r=0;r<i.length;r++){for(t=i[r],e=0;e<r;e++)if(a[e].key>t.key){a.splice(e,0,t);break}e===r&&a.push(t)}n.updateURL()},forEach:function(t){for(var e,r=Sn(this).entries,n=Ot(t,arguments.length>1?arguments[1]:void 0,3),a=0;a<r.length;)n((e=r[a++]).value,e.key,this)},keys:function(){return new Tn(this,"keys")},values:function(){return new Tn(this,"values")},entries:function(){return new Tn(this,"entries")}},{enumerable:!0}),et(Un,yn,Un.entries),et(Un,"toString",(function(){for(var t,e=Sn(this).entries,r=[],n=0;n<e.length;)t=e[n++],r.push(kn(t.key)+"="+kn(t.value));return r.join("&")}),{enumerable:!0}),Cr(Fn,"URLSearchParams"),Et({global:!0,forced:!Jr},{URLSearchParams:Fn}),Jr||"function"!=typeof gn||"function"!=typeof mn||Et({global:!0,enumerable:!0,forced:!0},{fetch:function(t){var e,r,n,a=[t];return arguments.length>1&&(g(e=arguments[1])&&(r=e.body,"URLSearchParams"===Ke(r)&&((n=e.headers?new mn(e.headers):new mn).has("content-type")||n.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"),e=ur(e,{body:u(0,String(r)),headers:u(0,n)}))),a.push(e)),gn.apply(this,a)}});var $n,qn={URLSearchParams:Fn,getState:Sn},Bn=Fe.codeAt,Mn=n.URL,Dn=qn.URLSearchParams,Gn=qn.getState,Nn=tt.set,zn=tt.getterFor("URL"),Kn=Math.floor,Vn=Math.pow,Yn=/[A-Za-z]/,Hn=/[\d+-.A-Za-z]/,Wn=/\d/,Xn=/^(0x|0X)/,Jn=/^[0-7]+$/,Zn=/^\d+$/,Qn=/^[\dA-Fa-f]+$/,ta=/[\u0000\t\u000A\u000D #%/:?@[\\]]/,ea=/[\u0000\t\u000A\u000D #/:?@[\\]]/,ra=/^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g,na=/[\t\u000A\u000D]/g,aa=function(t,e){var r,n,a;if("["==e.charAt(0)){if("]"!=e.charAt(e.length-1))return"Invalid host";if(!(r=oa(e.slice(1,-1))))return"Invalid host";t.host=r}else if(da(t)){if(e=function(t){var e,r,n=[],a=t.toLowerCase().replace(ln,".").split(".");for(e=0;e<a.length;e++)r=a[e],n.push(sn.test(r)?"xn--"+dn(r):r);return n.join(".")}(e),ta.test(e))return"Invalid host";if(null===(r=ia(e)))return"Invalid host";t.host=r}else{if(ea.test(e))return"Invalid host";for(r="",n=on(e),a=0;a<n.length;a++)r+=ha(n[a],la);t.host=r}},ia=function(t){var e,r,n,a,i,o,s,l=t.split(".");if(l.length&&""==l[l.length-1]&&l.pop(),(e=l.length)>4)return t;for(r=[],n=0;n<e;n++){if(""==(a=l[n]))return t;if(i=10,a.length>1&&"0"==a.charAt(0)&&(i=Xn.test(a)?16:8,a=a.slice(8==i?1:2)),""===a)o=0;else{if(!(10==i?Zn:8==i?Jn:Qn).test(a))return t;o=parseInt(a,i)}r.push(o)}for(n=0;n<e;n++)if(o=r[n],n==e-1){if(o>=Vn(256,5-e))return null}else if(o>255)return null;for(s=r.pop(),n=0;n<r.length;n++)s+=r[n]*Vn(256,3-n);return s},oa=function(t){var e,r,n,a,i,o,s,l=[0,0,0,0,0,0,0,0],u=0,c=null,f=0,h=function(){return t.charAt(f)};if(":"==h()){if(":"!=t.charAt(1))return;f+=2,c=++u}for(;h();){if(8==u)return;if(":"!=h()){for(e=r=0;r<4&&Qn.test(h());)e=16*e+parseInt(h(),16),f++,r++;if("."==h()){if(0==r)return;if(f-=r,u>6)return;for(n=0;h();){if(a=null,n>0){if(!("."==h()&&n<4))return;f++}if(!Wn.test(h()))return;for(;Wn.test(h());){if(i=parseInt(h(),10),null===a)a=i;else{if(0==a)return;a=10*a+i}if(a>255)return;f++}l[u]=256*l[u]+a,2!=++n&&4!=n||u++}if(4!=n)return;break}if(":"==h()){if(f++,!h())return}else if(h())return;l[u++]=e}else{if(null!==c)return;f++,c=++u}}if(null!==c)for(o=u-c,u=7;0!=u&&o>0;)s=l[u],l[u--]=l[c+o-1],l[c+--o]=s;else if(8!=u)return;return l},sa=function(t){var e,r,n,a;if("number"==typeof t){for(e=[],r=0;r<4;r++)e.unshift(t%256),t=Kn(t/256);return e.join(".")}if("object"==typeof t){for(e="",n=function(t){for(var e=null,r=1,n=null,a=0,i=0;i<8;i++)0!==t[i]?(a>r&&(e=n,r=a),n=null,a=0):(null===n&&(n=i),++a);return a>r&&(e=n,r=a),e}(t),r=0;r<8;r++)a&&0===t[r]||(a&&(a=!1),n===r?(e+=r?":":"::",a=!0):(e+=t[r].toString(16),r<7&&(e+=":")));return"["+e+"]"}return t},la={},ua=ce({},la,{" ":1,'"':1,"<":1,">":1,"`":1}),ca=ce({},ua,{"#":1,"?":1,"{":1,"}":1}),fa=ce({},ca,{"/":1,":":1,";":1,"=":1,"@":1,"[":1,"\\":1,"]":1,"^":1,"|":1}),ha=function(t,e){var r=Bn(t,0);return r>32&&r<127&&!b(e,t)?t:encodeURIComponent(t)},pa={ftp:21,file:null,http:80,https:443,ws:80,wss:443},da=function(t){return b(pa,t.scheme)},va=function(t){return""!=t.username||""!=t.password},ga=function(t){return!t.host||t.cannotBeABaseURL||"file"==t.scheme},ma=function(t,e){var r;return 2==t.length&&Yn.test(t.charAt(0))&&(":"==(r=t.charAt(1))||!e&&"|"==r)},ya=function(t){var e;return t.length>1&&ma(t.slice(0,2))&&(2==t.length||"/"===(e=t.charAt(2))||"\\"===e||"?"===e||"#"===e)},ba=function(t){var e=t.path,r=e.length;!r||"file"==t.scheme&&1==r&&ma(e[0],!0)||e.pop()},Sa=function(t){return"."===t||"%2e"===t.toLowerCase()},_a={},wa={},xa={},Ra={},Pa={},Ca={},La={},Aa={},Ea={},ka={},Oa={},ja={},Ia={},Ta={},Fa={},Ua={},$a={},qa={},Ba={},Ma={},Da={},Ga=function(t,e,r,n){var a,i,o,s,l,u=r||_a,c=0,f="",h=!1,p=!1,d=!1;for(r||(t.scheme="",t.username="",t.password="",t.host=null,t.port=null,t.path=[],t.query=null,t.fragment=null,t.cannotBeABaseURL=!1,e=e.replace(ra,"")),e=e.replace(na,""),a=on(e);c<=a.length;){switch(i=a[c],u){case _a:if(!i||!Yn.test(i)){if(r)return"Invalid scheme";u=xa;continue}f+=i.toLowerCase(),u=wa;break;case wa:if(i&&(Hn.test(i)||"+"==i||"-"==i||"."==i))f+=i.toLowerCase();else{if(":"!=i){if(r)return"Invalid scheme";f="",u=xa,c=0;continue}if(r&&(da(t)!=b(pa,f)||"file"==f&&(va(t)||null!==t.port)||"file"==t.scheme&&!t.host))return;if(t.scheme=f,r)return void(da(t)&&pa[t.scheme]==t.port&&(t.port=null));f="","file"==t.scheme?u=Ta:da(t)&&n&&n.scheme==t.scheme?u=Ra:da(t)?u=Aa:"/"==a[c+1]?(u=Pa,c++):(t.cannotBeABaseURL=!0,t.path.push(""),u=Ba)}break;case xa:if(!n||n.cannotBeABaseURL&&"#"!=i)return"Invalid scheme";if(n.cannotBeABaseURL&&"#"==i){t.scheme=n.scheme,t.path=n.path.slice(),t.query=n.query,t.fragment="",t.cannotBeABaseURL=!0,u=Da;break}u="file"==n.scheme?Ta:Ca;continue;case Ra:if("/"!=i||"/"!=a[c+1]){u=Ca;continue}u=Ea,c++;break;case Pa:if("/"==i){u=ka;break}u=qa;continue;case Ca:if(t.scheme=n.scheme,i==$n)t.username=n.username,t.password=n.password,t.host=n.host,t.port=n.port,t.path=n.path.slice(),t.query=n.query;else if("/"==i||"\\"==i&&da(t))u=La;else if("?"==i)t.username=n.username,t.password=n.password,t.host=n.host,t.port=n.port,t.path=n.path.slice(),t.query="",u=Ma;else{if("#"!=i){t.username=n.username,t.password=n.password,t.host=n.host,t.port=n.port,t.path=n.path.slice(),t.path.pop(),u=qa;continue}t.username=n.username,t.password=n.password,t.host=n.host,t.port=n.port,t.path=n.path.slice(),t.query=n.query,t.fragment="",u=Da}break;case La:if(!da(t)||"/"!=i&&"\\"!=i){if("/"!=i){t.username=n.username,t.password=n.password,t.host=n.host,t.port=n.port,u=qa;continue}u=ka}else u=Ea;break;case Aa:if(u=Ea,"/"!=i||"/"!=f.charAt(c+1))continue;c++;break;case Ea:if("/"!=i&&"\\"!=i){u=ka;continue}break;case ka:if("@"==i){h&&(f="%40"+f),h=!0,o=on(f);for(var v=0;v<o.length;v++){var g=o[v];if(":"!=g||d){var m=ha(g,fa);d?t.password+=m:t.username+=m}else d=!0}f=""}else if(i==$n||"/"==i||"?"==i||"#"==i||"\\"==i&&da(t)){if(h&&""==f)return"Invalid authority";c-=on(f).length+1,f="",u=Oa}else f+=i;break;case Oa:case ja:if(r&&"file"==t.scheme){u=Ua;continue}if(":"!=i||p){if(i==$n||"/"==i||"?"==i||"#"==i||"\\"==i&&da(t)){if(da(t)&&""==f)return"Invalid host";if(r&&""==f&&(va(t)||null!==t.port))return;if(s=aa(t,f))return s;if(f="",u=$a,r)return;continue}"["==i?p=!0:"]"==i&&(p=!1),f+=i}else{if(""==f)return"Invalid host";if(s=aa(t,f))return s;if(f="",u=Ia,r==ja)return}break;case Ia:if(!Wn.test(i)){if(i==$n||"/"==i||"?"==i||"#"==i||"\\"==i&&da(t)||r){if(""!=f){var y=parseInt(f,10);if(y>65535)return"Invalid port";t.port=da(t)&&y===pa[t.scheme]?null:y,f=""}if(r)return;u=$a;continue}return"Invalid port"}f+=i;break;case Ta:if(t.scheme="file","/"==i||"\\"==i)u=Fa;else{if(!n||"file"!=n.scheme){u=qa;continue}if(i==$n)t.host=n.host,t.path=n.path.slice(),t.query=n.query;else if("?"==i)t.host=n.host,t.path=n.path.slice(),t.query="",u=Ma;else{if("#"!=i){ya(a.slice(c).join(""))||(t.host=n.host,t.path=n.path.slice(),ba(t)),u=qa;continue}t.host=n.host,t.path=n.path.slice(),t.query=n.query,t.fragment="",u=Da}}break;case Fa:if("/"==i||"\\"==i){u=Ua;break}n&&"file"==n.scheme&&!ya(a.slice(c).join(""))&&(ma(n.path[0],!0)?t.path.push(n.path[0]):t.host=n.host),u=qa;continue;case Ua:if(i==$n||"/"==i||"\\"==i||"?"==i||"#"==i){if(!r&&ma(f))u=qa;else if(""==f){if(t.host="",r)return;u=$a}else{if(s=aa(t,f))return s;if("localhost"==t.host&&(t.host=""),r)return;f="",u=$a}continue}f+=i;break;case $a:if(da(t)){if(u=qa,"/"!=i&&"\\"!=i)continue}else if(r||"?"!=i)if(r||"#"!=i){if(i!=$n&&(u=qa,"/"!=i))continue}else t.fragment="",u=Da;else t.query="",u=Ma;break;case qa:if(i==$n||"/"==i||"\\"==i&&da(t)||!r&&("?"==i||"#"==i)){if(".."===(l=(l=f).toLowerCase())||"%2e."===l||".%2e"===l||"%2e%2e"===l?(ba(t),"/"==i||"\\"==i&&da(t)||t.path.push("")):Sa(f)?"/"==i||"\\"==i&&da(t)||t.path.push(""):("file"==t.scheme&&!t.path.length&&ma(f)&&(t.host&&(t.host=""),f=f.charAt(0)+":"),t.path.push(f)),f="","file"==t.scheme&&(i==$n||"?"==i||"#"==i))for(;t.path.length>1&&""===t.path[0];)t.path.shift();"?"==i?(t.query="",u=Ma):"#"==i&&(t.fragment="",u=Da)}else f+=ha(i,ca);break;case Ba:"?"==i?(t.query="",u=Ma):"#"==i?(t.fragment="",u=Da):i!=$n&&(t.path[0]+=ha(i,la));break;case Ma:r||"#"!=i?i!=$n&&("'"==i&&da(t)?t.query+="%27":t.query+="#"==i?"%23":ha(i,la)):(t.fragment="",u=Da);break;case Da:i!=$n&&(t.fragment+=ha(i,ua))}c++}},Na=function(t){var e,r,n=Zr(this,Na,"URL"),a=arguments.length>1?arguments[1]:void 0,o=String(t),s=Nn(n,{type:"URL"});if(void 0!==a)if(a instanceof Na)e=zn(a);else if(r=Ga(e={},String(a)))throw TypeError(r);if(r=Ga(s,o,null,e))throw TypeError(r);var l=s.searchParams=new Dn,u=Gn(l);u.updateSearchParams(s.query),u.updateURL=function(){s.query=String(l)||null},i||(n.href=Ka.call(n),n.origin=Va.call(n),n.protocol=Ya.call(n),n.username=Ha.call(n),n.password=Wa.call(n),n.host=Xa.call(n),n.hostname=Ja.call(n),n.port=Za.call(n),n.pathname=Qa.call(n),n.search=ti.call(n),n.searchParams=ei.call(n),n.hash=ri.call(n))},za=Na.prototype,Ka=function(){var t=zn(this),e=t.scheme,r=t.username,n=t.password,a=t.host,i=t.port,o=t.path,s=t.query,l=t.fragment,u=e+":";return null!==a?(u+="//",va(t)&&(u+=r+(n?":"+n:"")+"@"),u+=sa(a),null!==i&&(u+=":"+i)):"file"==e&&(u+="//"),u+=t.cannotBeABaseURL?o[0]:o.length?"/"+o.join("/"):"",null!==s&&(u+="?"+s),null!==l&&(u+="#"+l),u},Va=function(){var t=zn(this),e=t.scheme,r=t.port;if("blob"==e)try{return new Na(e.path[0]).origin}catch(t){return"null"}return"file"!=e&&da(t)?e+"://"+sa(t.host)+(null!==r?":"+r:""):"null"},Ya=function(){return zn(this).scheme+":"},Ha=function(){return zn(this).username},Wa=function(){return zn(this).password},Xa=function(){var t=zn(this),e=t.host,r=t.port;return null===e?"":null===r?sa(e):sa(e)+":"+r},Ja=function(){var t=zn(this).host;return null===t?"":sa(t)},Za=function(){var t=zn(this).port;return null===t?"":String(t)},Qa=function(){var t=zn(this),e=t.path;return t.cannotBeABaseURL?e[0]:e.length?"/"+e.join("/"):""},ti=function(){var t=zn(this).query;return t?"?"+t:""},ei=function(){return zn(this).searchParams},ri=function(){var t=zn(this).fragment;return t?"#"+t:""},ni=function(t,e){return{get:t,set:e,configurable:!0,enumerable:!0}};if(i&&nr(za,{href:ni(Ka,(function(t){var e=zn(this),r=String(t),n=Ga(e,r);if(n)throw TypeError(n);Gn(e.searchParams).updateSearchParams(e.query)})),origin:ni(Va),protocol:ni(Ya,(function(t){var e=zn(this);Ga(e,String(t)+":",_a)})),username:ni(Ha,(function(t){var e=zn(this),r=on(String(t));if(!ga(e)){e.username="";for(var n=0;n<r.length;n++)e.username+=ha(r[n],fa)}})),password:ni(Wa,(function(t){var e=zn(this),r=on(String(t));if(!ga(e)){e.password="";for(var n=0;n<r.length;n++)e.password+=ha(r[n],fa)}})),host:ni(Xa,(function(t){var e=zn(this);e.cannotBeABaseURL||Ga(e,String(t),Oa)})),hostname:ni(Ja,(function(t){var e=zn(this);e.cannotBeABaseURL||Ga(e,String(t),ja)})),port:ni(Za,(function(t){var e=zn(this);ga(e)||(""==(t=String(t))?e.port=null:Ga(e,t,Ia))})),pathname:ni(Qa,(function(t){var e=zn(this);e.cannotBeABaseURL||(e.path=[],Ga(e,t+"",$a))})),search:ni(ti,(function(t){var e=zn(this);""==(t=String(t))?e.query=null:("?"==t.charAt(0)&&(t=t.slice(1)),e.query="",Ga(e,t,Ma)),Gn(e.searchParams).updateSearchParams(e.query)})),searchParams:ni(ei),hash:ni(ri,(function(t){var e=zn(this);""!=(t=String(t))?("#"==t.charAt(0)&&(t=t.slice(1)),e.fragment="",Ga(e,t,Da)):e.fragment=null}))}),et(za,"toJSON",(function(){return Ka.call(this)}),{enumerable:!0}),et(za,"toString",(function(){return Ka.call(this)}),{enumerable:!0}),Mn){var ai=Mn.createObjectURL,ii=Mn.revokeObjectURL;ai&&et(Na,"createObjectURL",(function(t){return ai.apply(Mn,arguments)})),ii&&et(Na,"revokeObjectURL",(function(t){return ii.apply(Mn,arguments)}))}Cr(Na,"URL"),Et({global:!0,forced:!Jr,sham:!i},{URL:Na});var oi=[],si=oi.sort,li=a((function(){oi.sort(void 0)})),ui=a((function(){oi.sort(null)})),ci=function(t,e){var r=[][t];return!!r&&a((function(){r.call(null,e||function(){throw 1},1)}))}("sort");Et({target:"Array",proto:!0,forced:li||!ui||!ci},{sort:function(t){return void 0===t?si.call(jt(this)):si.call(jt(this),kt(t))}}),(window.webpackJsonp=window.webpackJsonp||[]).push([[76],{1365:function(t,e,r){r.r(e);var n=r(0),a=r.n(n),i=r(14),o=(r(23),{metaInfo:{title:"Report Sales"},data:function(){return{isLoading:!0,serverParams:{sort:{field:"id",type:"desc"},page:1,perPage:10},limit:"10",search:"",totalRows:"",Filter_Client:"",Filter_Ref:"",Filter_date:"",Filter_status:"",Filter_Payment:"",customers:[],sales:[]}},computed:{columns:function(){return[{label:this.$t("date"),field:"date",tdClass:"text-left",thClass:"text-left"},{label:this.$t("Reference"),field:"Ref",tdClass:"text-left",thClass:"text-left"},{label:this.$t("Customer"),field:"client_name",tdClass:"text-left",thClass:"text-left"},{label:this.$t("Status"),field:"statut",html:!0,tdClass:"text-left",thClass:"text-left"},{label:this.$t("Total"),field:"GrandTotal",type:"decimal",tdClass:"text-left",thClass:"text-left"},{label:this.$t("Paid"),field:"paid_amount",type:"decimal",tdClass:"text-left",thClass:"text-left"},{label:this.$t("Due"),field:"due",type:"decimal",tdClass:"text-left",thClass:"text-left"},{label:this.$t("PaymentStatus"),field:"payment_status",html:!0,tdClass:"text-left",thClass:"text-left"}]}},methods:{updateParams:function(t){this.serverParams=Object.assign({},this.serverParams,t)},onPageChange:function(t){var e=t.currentPage;this.serverParams.page!==e&&(this.updateParams({page:e}),this.Get_Sales(e))},onPerPageChange:function(t){var e=t.currentPerPage;this.limit!==e&&(this.limit=e,this.updateParams({page:1,perPage:e}),this.Get_Sales(1))},onSortChange:function(t){var e="";e="client_name"==t[0].field?"client_id":t[0].field,this.updateParams({sort:{type:t[0].type,field:e}}),this.Get_Sales(this.serverParams.page)},onSearch:function(t){this.search=t.searchTerm,this.Get_Sales(this.serverParams.page)},Reset_Filter:function(){this.search="",this.Filter_Client="",this.Filter_status="",this.Filter_Payment="",this.Filter_Ref="",this.Filter_date="",this.Get_Sales(this.serverParams.page)},formatNumber:function(t,e){var r=("string"==typeof t?t:t.toString()).split(".");if(e<=0)return r[0];var n=r[1]||"";if(n.length>e)return"".concat(r[0],".").concat(n.substr(0,e));for(;n.length<e;)n+="0";return"".concat(r[0],".").concat(n)},Sales_PDF:function(){var t=new i.default("p","pt");t.autoTable([{title:"Ref",dataKey:"Ref"},{title:"Client",dataKey:"client_name"},{title:"Status",dataKey:"statut"},{title:"Total",dataKey:"GrandTotal"},{title:"Paid",dataKey:"paid_amount"},{title:"Due",dataKey:"due"},{title:"Status Payment",dataKey:"payment_status"}],this.sales),t.text("Sales report",40,25),t.save("Sales_report.pdf")},Sales_Excel:function(){a.a.start(),a.a.set(.1),axios.get("sales/export/Excel",{responseType:"blob",headers:{"Content-Type":"application/json"}}).then((function(t){var e=window.URL.createObjectURL(new Blob([t.data])),r=document.createElement("a");r.href=e,r.setAttribute("download","List_Sales.xlsx"),document.body.appendChild(r),r.click(),a.a.done()})).catch((function(){a.a.done()}))},setToStrings:function(){null===this.Filter_Client&&(this.Filter_Client="")},Get_Sales:function(t){var e=this;a.a.start(),a.a.set(.1),this.setToStrings(),axios.get("/report/Sales?page="+t+"&Ref="+this.Filter_Ref+"&date="+this.Filter_date+"&client_id="+this.Filter_Client+"&statut="+this.Filter_status+"&payment_statut="+this.Filter_Payment+"&SortField="+this.serverParams.sort.field+"&SortType="+this.serverParams.sort.type+"&search="+this.search+"&limit="+this.limit).then((function(t){e.sales=t.data.sales,e.customers=t.data.customers,e.totalRows=t.data.totalRows,a.a.done(),e.isLoading=!1})).catch((function(t){a.a.done(),setTimeout((function(){e.isLoading=!1}),500)}))}},created:function(){this.Get_Sales(1)}}),s=r(2),l=Object(s.a)(o,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"main-content"},[r("breadcumb",{attrs:{page:t.$t("SalesReport"),folder:t.$t("Reports")}}),t._v(" "),t.isLoading?r("div",{staticClass:"loading_page spinner spinner-primary mr-3"}):t._e(),t._v(" "),t.isLoading?t._e():r("b-card",{staticClass:"wrapper"},[r("vue-good-table",{attrs:{mode:"remote",columns:t.columns,totalRows:t.totalRows,rows:t.sales,"search-options":{placeholder:t.$t("Search_this_table"),enabled:!0},"pagination-options":{enabled:!0,mode:"records",nextLabel:"next",prevLabel:"prev"},styleClass:"order-table vgt-table"},on:{"on-page-change":t.onPageChange,"on-per-page-change":t.onPerPageChange,"on-sort-change":t.onSortChange,"on-search":t.onSearch},scopedSlots:t._u([{key:"table-row",fn:function(e){return["statut"==e.column.field?r("div",["completed"==e.row.statut?r("span",{staticClass:"badge badge-outline-success"},[t._v(t._s(t.$t("complete")))]):"pending"==e.row.statut?r("span",{staticClass:"badge badge-outline-info"},[t._v(t._s(t.$t("Pending")))]):r("span",{staticClass:"badge badge-outline-warning"},[t._v(t._s(t.$t("Ordered")))])]):"payment_status"==e.column.field?r("div",["paid"==e.row.payment_status?r("span",{staticClass:"badge badge-outline-success"},[t._v(t._s(t.$t("Paid")))]):"partial"==e.row.payment_status?r("span",{staticClass:"badge badge-outline-primary"},[t._v(t._s(t.$t("partial")))]):r("span",{staticClass:"badge badge-outline-warning"},[t._v(t._s(t.$t("Unpaid")))])]):t._e()]}}],null,!1,2617766521)},[r("div",{staticClass:"mt-2 mb-3",attrs:{slot:"table-actions"},slot:"table-actions"},[r("b-button",{directives:[{name:"b-toggle",rawName:"v-b-toggle.sidebar-right",modifiers:{"sidebar-right":!0}}],attrs:{variant:"outline-info ripple m-1",size:"sm"}},[r("i",{staticClass:"i-Filter-2"}),t._v("\n          "+t._s(t.$t("Filter"))+"\n        ")]),t._v(" "),r("b-button",{attrs:{size:"sm",variant:"outline-success ripple m-1"},on:{click:function(e){return t.Sales_PDF()}}},[r("i",{staticClass:"i-File-Copy"}),t._v(" PDF\n        ")]),t._v(" "),r("b-button",{attrs:{size:"sm",variant:"outline-danger ripple m-1"},on:{click:function(e){return t.Sales_Excel()}}},[r("i",{staticClass:"i-File-Excel"}),t._v(" EXCEL\n        ")])],1)])],1),t._v(" "),r("b-sidebar",{attrs:{id:"sidebar-right",title:t.$t("Filter"),"bg-variant":"white",right:"",shadow:""}},[r("div",{staticClass:"px-3 py-2"},[r("b-row",[r("b-col",{attrs:{md:"12"}},[r("b-form-group",{attrs:{label:t.$t("date")}},[r("b-form-input",{attrs:{type:"date"},model:{value:t.Filter_date,callback:function(e){t.Filter_date=e},expression:"Filter_date"}})],1)],1),t._v(" "),r("b-col",{attrs:{md:"12"}},[r("b-form-group",{attrs:{label:t.$t("Reference")}},[r("b-form-input",{attrs:{label:"Reference",placeholder:t.$t("Reference")},model:{value:t.Filter_Ref,callback:function(e){t.Filter_Ref=e},expression:"Filter_Ref"}})],1)],1),t._v(" "),r("b-col",{attrs:{md:"12"}},[r("b-form-group",{attrs:{label:t.$t("Customer")}},[r("v-select",{attrs:{reduce:function(t){return t.value},placeholder:t.$t("Choose_Customer"),options:t.customers.map((function(t){return{label:t.name,value:t.id}}))},model:{value:t.Filter_Client,callback:function(e){t.Filter_Client=e},expression:"Filter_Client"}})],1)],1),t._v(" "),r("b-col",{attrs:{md:"12"}},[r("b-form-group",{attrs:{label:t.$t("Status")}},[r("select",{directives:[{name:"model",rawName:"v-model",value:t.Filter_status,expression:"Filter_status"}],staticClass:"form-control",attrs:{type:"text"},on:{change:function(e){var r=Array.prototype.filter.call(e.target.options,(function(t){return t.selected})).map((function(t){return"_value"in t?t._value:t.value}));t.Filter_status=e.target.multiple?r:r[0]}}},[r("option",{attrs:{value:"",selected:""}},[t._v("All")]),t._v(" "),r("option",{attrs:{value:"completed"}},[t._v("Completed")]),t._v(" "),r("option",{attrs:{value:"pending"}},[t._v("Pending")]),t._v(" "),r("option",{attrs:{value:"ordered"}},[t._v("Ordered")])])])],1),t._v(" "),r("b-col",{attrs:{md:"12"}},[r("b-form-group",{attrs:{label:t.$t("PaymentStatus")}},[r("select",{directives:[{name:"model",rawName:"v-model",value:t.Filter_Payment,expression:"Filter_Payment"}],staticClass:"form-control",attrs:{type:"text"},on:{change:function(e){var r=Array.prototype.filter.call(e.target.options,(function(t){return t.selected})).map((function(t){return"_value"in t?t._value:t.value}));t.Filter_Payment=e.target.multiple?r:r[0]}}},[r("option",{attrs:{value:"",selected:""}},[t._v("All")]),t._v(" "),r("option",{attrs:{value:"paid"}},[t._v("Paid")]),t._v(" "),r("option",{attrs:{value:"partial"}},[t._v("partial")]),t._v(" "),r("option",{attrs:{value:"unpaid"}},[t._v("UnPaid")])])])],1),t._v(" "),r("b-col",{attrs:{md:"6",sm:"12"}},[r("b-button",{attrs:{variant:"primary ripple m-1",size:"sm",block:""},on:{click:function(e){return t.Get_Sales(t.serverParams.page)}}},[r("i",{staticClass:"i-Filter-2"}),t._v("\n            "+t._s(t.$t("Filter"))+"\n          ")])],1),t._v(" "),r("b-col",{attrs:{md:"6",sm:"12"}},[r("b-button",{attrs:{variant:"danger ripple m-1",size:"sm",block:""},on:{click:function(e){return t.Reset_Filter()}}},[r("i",{staticClass:"i-Power-2"}),t._v("\n            "+t._s(t.$t("Reset"))+"\n          ")])],1)],1)],1)])],1)}),[],!1,null,null,null);e.default=l.exports}}])}();
>>>>>>> f11b8c326380b962de568282db4cbb62e4ac9c9f
