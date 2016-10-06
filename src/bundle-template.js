import path from 'path';
import * as t from 'babel-types';
import template from 'babel-template';
import generate from 'babel-generator';
import {parse} from 'babylon';

function buildImport(replacements) {
  const modulePath = replacements.TYPE_MODULE_PATH.value;

  return template(`import TYPE_NAME_IDENTIFIER from "./${modulePath}";`, {sourceType: 'module'})(replacements);
}
const buildDeclaration = template('const BUNDLE_MODULE_NAME = {};');
const buildModuleAssignment = template('BUNDLE_MODULE_NAME[TYPE_NAME] = TYPE_NAME_IDENTIFIER;');
const buildExport = template('export default Object.freeze(BUNDLE_MODULE_NAME);', {sourceType: 'module'});

export default function bundleTemplate(types, bundleModuleName) {
  const BUNDLE_MODULE_NAME = t.identifier(bundleModuleName);

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
  const moduleExport = buildExport({BUNDLE_MODULE_NAME});

  return parse(`
    ${imports.map((ast) => generate(ast).code).join('\n')}
    ${generate(declaration).code}
    ${assignments.map((ast) => generate(ast).code).join('\n')}
    ${generate(moduleExport).code}
  `, {sourceType: 'module'});
}
