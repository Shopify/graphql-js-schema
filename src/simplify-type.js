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
