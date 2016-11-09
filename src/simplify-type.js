import implementsNode from './helpers/implements-node';

function getBaseTypeName(type) {
  if (type.ofType) {
    return getBaseTypeName(type.ofType);
  } else {
    return type.name;
  }
}

function fieldBaseTypes(fields) {
  return fields.reduce((acc, field) => {
    acc[field.name] = getBaseTypeName(field.type);

    return acc;
  }, {});
}

function getInputBaseTypeName(type) {
  if (type.ofType) {
    if (type.kind === 'LIST') {
      return `[${getInputBaseTypeName(type.ofType)}]`;
    } else if (type.kind === 'NON_NULL') {
      return `${getInputBaseTypeName(type.ofType)}!`;
    } else {
      throw new Error(`Unknown type.kind ${type.kind}`);
    }
  } else {
    return type.name;
  }
}

function inputFieldBaseTypes(fields) {
  return fields.reduce((acc, field) => {
    acc[field.name] = getInputBaseTypeName(field.type);

    return acc;
  }, {});
}

function possibleTypes(interfaceType) {
  return interfaceType.possibleTypes.map((t) => t.name);
}

export default function simplifyType(type) {
  switch (type.kind) {
    case 'OBJECT':
      return ({
        name: type.name,
        kind: type.kind,
        fieldBaseTypes: fieldBaseTypes(type.fields),
        implementsNode: implementsNode(type)
      });
    case 'INPUT_OBJECT':
      return ({
        name: type.name,
        kind: type.kind,
        fieldBaseTypes: inputFieldBaseTypes(type.inputFields)
      });
    case 'INTERFACE':
      return ({
        name: type.name,
        kind: type.kind,
        fieldBaseTypes: fieldBaseTypes(type.fields),
        possibleTypes: possibleTypes(type)
      });
    default:
      return ({
        name: type.name,
        kind: type.kind
      });
  }
}
