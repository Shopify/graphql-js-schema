import * as t from 'babel-types';
import template from 'babel-template';
import generate from 'babel-generator';
import {parse} from 'babylon';

function buildDeclaration(replacements) {
  const object = replacements.TYPE_HASH;

  return template(`const TYPE_NAME_IDENTIFIER = ${JSON.stringify(object, null, 2)};`)(replacements);
}
const buildExport = template(`export default Object.freeze(TYPE_NAME_IDENTIFIER);`, {sourceType: 'module'});

export default function typeTemplate(type) {
  const replacements = {
    TYPE_NAME_IDENTIFIER: t.identifier(type.name),
    TYPE_HASH: type
  };

  const declaration = buildDeclaration(replacements);
  const moduleExport = buildExport(replacements);

  return parse(`
      ${generate(declaration).code}
      ${generate(moduleExport).code}
  `, {sourceType: 'module'});
}
