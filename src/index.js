import path from 'path';
import dasherize from 'lodash.kebabcase';
import generate from 'babel-generator';
import tmp from 'tmp';
import mkdirp from 'mkdirp';
import {rollup} from 'rollup';
import simplifyType from './simplify-type';
import typeTemplate from './type-template';
import bundleTemplate from './bundle-template';
import {writeFiles} from './writers';

function yieldTypes(schema) {
  return schema.types;
}

function filterTypes(whitelistConfig) {
  return function(types) {
    if (!whitelistConfig) {
      return types;
    }

    const whitelistTypes = Object.keys(whitelistConfig);

    return types.filter((simplifiedType) => {
      return whitelistTypes.includes(simplifiedType.name);
    });
  };
}

function simplifyTypes(whitelistConfig) {
  return function(types) {
    return types.map((type) => simplifyType(type, whitelistConfig));
  };
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

export default function generateSchemaModules(introspectionResponse, bundleName, whitelistConfig) {
  const schema = introspectionResponse.data.__schema;

  return flow(schema, [
    yieldTypes,
    filterTypes(whitelistConfig),
    simplifyTypes(whitelistConfig),
    mapTypesToFiles,
    injectBundle(extractRootTypeNames(schema), bundleName)
  ]);
}

export function generateSchemaBundle(introspectionResponse, bundleName, whitelistConfig) {
  const files = generateSchemaModules(introspectionResponse, bundleName, whitelistConfig);

  tmp.setGracefulCleanup();
  const tmpDir = tmp.dirSync();

  mkdirp.sync(path.join(tmpDir.name, 'types'));

  const entryFilename = `${dasherize(bundleName)}.js`;
  const entryFilePath = path.join(tmpDir.name, entryFilename);

  return writeFiles(tmpDir.name, files, true).then(() => {
    return rollup({
      entry: entryFilePath
    });
  }).then((bundle) => {
    return bundle.generate({format: 'es'});
  }).then((result) => {
    return {
      body: result.code,
      path: entryFilename
    };
  });
}
