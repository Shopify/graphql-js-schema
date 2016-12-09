import path from 'path';
import dasherize from 'lodash.kebabcase';
import generate from 'babel-generator';
import simplifyType from './simplify-type';
import typeTemplate from './type-template';
import bundleTemplate from './bundle-template';

function yieldTypes(schema) {
  return schema.data.__schema.types;
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

function injectBundle(rootTypeNames, bundleName) {
  return function(typeFileMaps) {
    const bundleAst = bundleTemplate(rootTypeNames, typeFileMaps, bundleName.replace(' ', ''));
    const bundle = generate(bundleAst).code;

    typeFileMaps.push({
      body: bundle,
      path: `${dasherize(bundleName)}.js`
    });

    return typeFileMaps;
  };
}

function extractRootTypeNames({queryType, mutationType, subscriptionType}) {
  return ({
    queryTypeName: (queryType ? queryType.name : null),
    mutationTypeName: (mutationType ? mutationType.name : null),
    subscriptionTypeName: (subscriptionType ? subscriptionType.name : null)
  });
}


function flow(arg, functions) {
  return functions.reduce(((acc, fn) => fn(acc)), arg);
}

export default function generateSchemaModules(schema, bundleName) {
  return flow(schema, [
    yieldTypes,
    simplifyTypes,
    mapTypesToFiles,
    injectBundle(extractRootTypeNames(schema), bundleName)
  ]);
}
