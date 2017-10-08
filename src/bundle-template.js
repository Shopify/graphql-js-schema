import path from 'path';
import * as t from 'babel-types';
import template from 'babel-template';
import generate from 'babel-generator';
import {parse} from 'babylon';

function buildImport(replacements, commonjs) {
  const modulePath = replacements.TYPE_MODULE_PATH.value;

  if (commonjs) {
    return template(`const TYPE_NAME_IDENTIFIER = require("./${modulePath}");`, {sourceType: 'module'})(replacements);
  }

  return template(`import TYPE_NAME_IDENTIFIER from "./${modulePath}";`, {sourceType: 'module'})(replacements);
}

function buildExport(replacements, commonjs) {
  if (commonjs) {
    return template('module.exports = recursivelyFreezeObject(BUNDLE_MODULE_NAME);', {sourceType: 'module'})(replacements);
  }

  return template('export default recursivelyFreezeObject(BUNDLE_MODULE_NAME);', {sourceType: 'module'})(replacements);
}

const buildDeclaration = template('const BUNDLE_MODULE_NAME = {types: {}};');
const buildModuleAssignment = template('BUNDLE_MODULE_NAME.types[TYPE_NAME] = TYPE_NAME_IDENTIFIER;');
const buildRootLevelAssignment = template('BUNDLE_MODULE_NAME.PROPERTY_NAME = PROPERTY_VALUE;');

export default function bundleTemplate({queryTypeName, mutationTypeName, subscriptionTypeName}, types, bundleModuleName, commonjs) {
  const BUNDLE_MODULE_NAME = t.identifier(bundleModuleName);
  const QUERY_TYPE_NAME = queryTypeName ? t.stringLiteral(queryTypeName) : t.nullLiteral();
  const MUTATION_TYPE_NAME = mutationTypeName ? t.stringLiteral(mutationTypeName) : t.nullLiteral();
  const SUBSCRIPTION_TYPE_NAME = subscriptionTypeName ? t.stringLiteral(subscriptionTypeName) : t.nullLiteral();

  const typeConfigs = types.map((type) => {
    return {
      TYPE_NAME: t.stringLiteral(type.name),
      TYPE_NAME_IDENTIFIER: t.identifier(type.name),
      TYPE_MODULE_PATH: t.stringLiteral(path.join(type.path.replace(/\.js$/, ''))),
      BUNDLE_MODULE_NAME
    };
  });

  const imports = typeConfigs.map((typeConfig) => buildImport(typeConfig, commonjs));
  const declaration = buildDeclaration({BUNDLE_MODULE_NAME});
  const assignments = typeConfigs.map((typeConfig) => buildModuleAssignment(typeConfig));
  const queryTypeAssignment = buildRootLevelAssignment({BUNDLE_MODULE_NAME, PROPERTY_NAME: t.identifier('queryType'), PROPERTY_VALUE: QUERY_TYPE_NAME});
  const mutationTypeAssignment = buildRootLevelAssignment({BUNDLE_MODULE_NAME, PROPERTY_NAME: t.identifier('mutationType'), PROPERTY_VALUE: MUTATION_TYPE_NAME});
  const subscriptionTypeAssignment = buildRootLevelAssignment({BUNDLE_MODULE_NAME, PROPERTY_NAME: t.identifier('subscriptionType'), PROPERTY_VALUE: SUBSCRIPTION_TYPE_NAME});
  const moduleExport = buildExport({BUNDLE_MODULE_NAME}, commonjs);

  return parse(`
    ${imports.map((ast) => generate(ast).code).join('\n')}
    ${generate(declaration).code}
    ${assignments.map((ast) => generate(ast).code).join('\n')}
    ${generate(queryTypeAssignment).code}
    ${generate(mutationTypeAssignment).code}
    ${generate(subscriptionTypeAssignment).code}

    function recursivelyFreezeObject(structure) {
      Object.getOwnPropertyNames(structure).forEach((key) => {
        const value = structure[key];
        if (value && typeof value === 'object') {
          recursivelyFreezeObject(value);
        }
      });
      Object.freeze(structure);
      return structure;
    }

    ${generate(moduleExport).code}
  `, {sourceType: 'module'});
}
