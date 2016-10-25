import implementsNode from './helpers/implements-node';

function getBaseTypeName(type) {
  if (type.ofType) {
    return getBaseTypeName(type.ofType);
  } else {
    return type.name;
  }
}

function fieldBaseTypesReducer(fieldBaseTypesIndex, field) {
  fieldBaseTypesIndex[field.name] = getBaseTypeName(field.type);

  return fieldBaseTypesIndex;
}

function fieldBaseTypes(type) {
  if (type.fields) {
    return type.fields.reduce(fieldBaseTypesReducer, {});
  } else {
    return {};
  }
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
        fieldBaseTypes: fieldBaseTypes(type),
        implementsNode: implementsNode(type)
      });
    case 'INTERFACE':
      return ({
        name: type.name,
        kind: type.kind,
        fieldBaseTypes: fieldBaseTypes(type),
        possibleTypes: possibleTypes(type)
      });
    default:
      return ({
        name: type.name,
        kind: type.kind
      });
  }
}
