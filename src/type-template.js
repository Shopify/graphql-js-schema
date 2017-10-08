import * as t from 'babel-types';
import template from 'babel-template';
import generate from 'babel-generator';
import {parse} from 'babylon';

function buildDeclaration(replacements) {
  const object = replacements.TYPE_HASH;

  return template(`const TYPE_NAME_IDENTIFIER = ${JSON.stringify(object, null, 2)};`)(replacements);
}

function buildExport(replacements, commonjs) {
  if (commonjs) {
    return template('module.exports = TYPE_NAME_IDENTIFIER;', {sourceType: 'module'})(replacements);
  }

  return template('export default TYPE_NAME_IDENTIFIER;', {sourceType: 'module'})(replacements);
}

export default function typeTemplate(type, commonjs) {
  const replacements = {
    TYPE_NAME_IDENTIFIER: t.identifier(type.name),
    TYPE_HASH: type
  };

  const declaration = buildDeclaration(replacements);
  const moduleExport = buildExport(replacements, commonjs);

  switch (type.kind) {
    case 'OBJECT':
      if (type.name === 'Mutation') {
        return parse(`
            ${generate(declaration).code}
            ${generate(moduleExport).code}
        `, {sourceType: 'module'});
      } else {
        return parse(`
            ${generate(declaration).code}
            ${generate(moduleExport).code}
        `, {sourceType: 'module'});
      }
    case 'INTERFACE':
      return parse(`
          ${generate(declaration).code}
          ${generate(moduleExport).code}
      `, {sourceType: 'module'});
    case 'INPUT_OBJECT':
      return parse(`
          ${generate(declaration).code}
          ${generate(moduleExport).code}
      `, {sourceType: 'module'});
    default:
      return parse(`
          ${generate(declaration).code}
          ${generate(moduleExport).code}
      `, {sourceType: 'module'});
  }
}
