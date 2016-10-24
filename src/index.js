import path from 'path';
import dasherize from 'lodash.kebabcase';
import generate from 'babel-generator';
import isObject from './helpers/is-object';
import isInterface from './helpers/is-interface';
import isNotIntrospectionType from './helpers/is-not-introspection-type';
import simplifyType from './simplify-type';
import typeTemplate from './type-template';
import bundleTemplate from './bundle-template';

function isObjectOrInterface(type) {
  return isObject(type) || isInterface(type);
}

function reportError(error) {
  throw error;
}

function yieldTypes(schema) {
  return schema.data.__schema.types;
}

function filterSupportedTypes(types) {
  return types.filter(isObjectOrInterface).filter(isNotIntrospectionType);
}

function simplifyTypes(types) {
  return types.map(simplifyType);
}

function filenameForType(type) {
  return path.join('types', `${dasherize(type.name)}.js`);
}

function mapTypesToFiles(simplifiedTypes) {
  return simplifiedTypes.map((simplifiedType) => {
    return {
      name: simplifiedType.name,
      body: generate(typeTemplate(simplifiedType)).code,
      path: filenameForType(simplifiedType)
    };
  });
}

function injectBundle(bundleName) {
  return function(typeFileMaps) {
    const bundleAst = bundleTemplate(typeFileMaps, bundleName.replace(' ', ''));
    const bundle = generate(bundleAst).code;

    typeFileMaps.push({
      body: bundle,
      path: `${dasherize(bundleName)}.js`
    });

    return typeFileMaps;
  };
}

export default function generateSchemaModules(schema, bundleName) {
  return Promise
    .resolve(schema)
    .then(yieldTypes)
    .then(filterSupportedTypes)
    .then(simplifyTypes)
    .then(mapTypesToFiles)
    .then(injectBundle(bundleName))
    .catch(reportError);
}
