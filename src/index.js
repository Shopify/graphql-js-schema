import path from 'path';
import dasherize from 'lodash.kebabcase';
import generate from 'babel-generator';
import isObject from './helpers/is-object';
import isNotIntrospectionType from './helpers/is-not-introspection-type';
import simplifyType from './simplify-type';
import typeTemplate from './type-template';
import bundleTemplate from './bundle-template';

function reportError(error) {
  throw error;
}

function yieldTypes(schema) {
  return schema.data.__schema.types;
}

function filterTypes(types) {
  return types.filter(isObject).filter(isNotIntrospectionType);
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
    const bundleAst = bundleTemplate(typeFileMaps, bundleName);
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
    .then(filterTypes)
    .then(simplifyTypes)
    .then(mapTypesToFiles)
    .then(injectBundle(bundleName))
    .catch(reportError);
}
