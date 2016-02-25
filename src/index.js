/*globals require, exports */

'use strict';

var check, espree, walker, escomplex;

check = require('check-types');
espree = require('espree');
walker = require('escomplex-ast-moz');
escomplex = require('escomplex');

exports.analyse = analyse;
exports.ecmaFeatures = {
    arrowFunctions: true, // enable parsing of arrow functions
    binaryLiterals: true, // enable parsing of binary literals
    blockBindings: true, // enable parsing of let/const
    classes: true, // enable parsing classes
    defaultParams: true, // enable parsing of default parameters
    destructuring: true, // enable parsing of destructured arrays and objects
    experimentalObjectRestSpread: true, // allow experimental object rest/spread
    experimentalSpreadProperty: true, // allow experimental spread property
    newTarget: true,
    forOf: true, // enable parsing of for-of statement
    generators: true, // enable parsing of generators/yield
    globalReturn: true, // enable return in global scope
    jsx: true, // enable React JSX parsing
    modules: true, // enable parsing of modules
    objectLiteralComputedProperties: true, // enable parsing computed object literal properties
    objectLiteralDuplicateProperties: true, // Allow duplicate object literal properties (except '__proto__')
    objectLiteralShorthandMethods: true, // enable parsing of shorthand object literal methods
    objectLiteralShorthandProperties: true, // enable parsing of shorthand object literal properties
    octalLiterals: true, // enable parsing of ES6 octal literals
    regexUFlag: true, // enable parsing of regular expression u flag
    regexYFlag: true, // enable parsing of regular expression y flag
    restParams: true, // enable parsing of rest parameters
    spread: true, // enable parsing spread operator
    superInFunctions: true,
    templateStrings: true, // enable parsing of template strings
    unicodeCodePointEscapes: true, // enable parsing unicode code point escape sequences
    allowReserved: true,
    experimentalAsyncAwait: true // enable async await support when it's added to espree
};

function analyse (source, options) {
    if (check.array(source)) {
        return analyseSources(source, options);
    }

    return analyseSource(source, options);
}

function analyseSources (sources, options) {
    return performAnalysis(sources.map(function (source) {
        try {
            return {
                path: source.path,
                ast: getSyntaxTree(source.code)
            };
        } catch (error) {
            error.message = source.path + ': ' + error.message;
            throw error;
        }
    }), options);
}

function getSyntaxTree (source) {
    return espree.parse(source, {
      loc: true,
      ecmaVersion: 6,
      allowReserved: true,
      sourceType: "module",
      ecmaFeatures: exports.ecmaFeatures
    });
}

function performAnalysis (ast, options) {
    return escomplex.analyse(ast, walker, options);
}

function analyseSource (source, options) {
    return performAnalysis(getSyntaxTree(source), options);
}
