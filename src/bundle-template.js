import path from 'path';
import * as t from 'babel-types';
import template from 'babel-template';
import generate from 'babel-generator';
import {parse} from 'babylon';

function buildImport(replacements) {
  const modulePath = replacements.TYPE_MODULE_PATH.value;

  return template(`import TYPE_NAME_IDENTIFIER from "./${modulePath}";`, {sourceType: 'module'})(replacements);
}
const buildDeclaration = template('const BUNDLE_MODULE_NAME = {types: {}};');
const buildModuleAssignment = template('BUNDLE_MODULE_NAME.types[TYPE_NAME] = TYPE_NAME_IDENTIFIER;');
const buildRootLevelAssignment = template('BUNDLE_MODULE_NAME.PROPERTY_NAME = PROPERTY_VALUE;');
const buildTypesFreeze = template('Object.freeze(BUNDLE_MODULE_NAME.types);');
const buildExport = template('export default Object.freeze(BUNDLE_MODULE_NAME);', {sourceType: 'module'});

export default function bundleTemplate({queryType, mutationType, subscriptionType}, types, bundleModuleName) {
  const BUNDLE_MODULE_NAME = t.identifier(bundleModuleName);
  const QUERY_TYPE_NAME = queryType ? t.stringLiteral(queryType) : t.nullLiteral();
  const MUTATION_TYPE_NAME = mutationType ? t.stringLiteral(mutationType) : t.nullLiteral();
  const SUBSCRIPTION_TYPE_NAME = subscriptionType ? t.stringLiteral(subscriptionType) : t.nullLiteral();

  const typeConfigs = types.map((type) => {
    return {
      TYPE_NAME: t.stringLiteral(type.name),
      TYPE_NAME_IDENTIFIER: t.identifier(type.name),
      TYPE_MODULE_PATH: t.stringLiteral(path.join(type.path.replace(/\.js$/, ''))),
      BUNDLE_MODULE_NAME
    };
  });

  const imports = typeConfigs.map((typeConfig) => buildImport(typeConfig));
  const declaration = buildDeclaration({BUNDLE_MODULE_NAME});
  const assignments = typeConfigs.map((typeConfig) => buildModuleAssignment(typeConfig));
  const queryTypeAssignment = buildRootLevelAssignment({BUNDLE_MODULE_NAME, PROPERTY_NAME: t.identifier('queryType'), PROPERTY_VALUE: QUERY_TYPE_NAME});
  const mutationTypeAssignment = buildRootLevelAssignment({BUNDLE_MODULE_NAME, PROPERTY_NAME: t.identifier('mutationType'), PROPERTY_VALUE: MUTATION_TYPE_NAME});
  const subscriptionTypeAssignment = buildRootLevelAssignment({BUNDLE_MODULE_NAME, PROPERTY_NAME: t.identifier('subscriptionType'), PROPERTY_VALUE: SUBSCRIPTION_TYPE_NAME});
  const typesFreeze = buildTypesFreeze({BUNDLE_MODULE_NAME});
  const moduleExport = buildExport({BUNDLE_MODULE_NAME});

  return parse(`
    ${imports.map((ast) => generate(ast).code).join('\n')}
    ${generate(declaration).code}
    ${assignments.map((ast) => generate(ast).code).join('\n')}
    ${generate(queryTypeAssignment).code}
    ${generate(mutationTypeAssignment).code}
    ${generate(subscriptionTypeAssignment).code}
    ${generate(typesFreeze).code}
    ${generate(moduleExport).code}
  `, {sourceType: 'module'});
}
