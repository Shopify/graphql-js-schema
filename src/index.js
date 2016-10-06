import path from 'path';
import dasherize from 'lodash.kebabcase';
import isObject from './helpers/is-object';
import isNotIntrospectionType from './helpers/is-not-introspection-type';
import simplifyType from './simplify-type';
import generate from 'babel-generator';
import typeTemplate from './type-template';
import bundleTemplate from './bundle-template';

function exportTypesToFiles(types) {
  return rest.map(typeToFile('types')).concat(typeToFile('.')(queryRoot));
}

function reportError(error) {
  console.trace(error.stack);

  process.exit(1);
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

function mapTypesToFiles(types) {
  return types.map((type) => {
    return {
      name: type.name,
      body: generate(typeTemplate(type)).code,
      path: filenameForType(type),
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
  }
}

export default function generateSchemaModules(schema, bundleName) {
  return Promise.resolve(schema)
                .then(yieldTypes)
                .then(filterTypes)
                .then(simplifyTypes)
                .then(mapTypesToFiles)
                .then(injectBundle(bundleName))
                .catch(reportError);
}
