import implementsNode from './helpers/implements-node';

function getBaseTypeName(type) {
  if (type.ofType) {
    return getBaseTypeName(type.ofType);
  } else {
    return type.name;
  }
}

function getBaseTypeKind(type) {
  if (type.ofType) {
    return getBaseTypeKind(type.ofType);
  } else {
    return type.kind;
  }
}

function fieldBaseTypes(fields, whiteList) {
  let assign;

  if (whiteList) {
    assign = function(acc, field) {
      const baseTypeName = getBaseTypeName(field.type);

      if (whiteList.includes(baseTypeName)) {
        acc[field.name] = baseTypeName;
      }
    };
  } else {
    assign = function(acc, field) {
      acc[field.name] = getBaseTypeName(field.type);
    };
  }

  return fields.reduce((acc, field) => {
    assign(acc, field);

    return acc;
  }, {});
}

function relayInputObjectBaseTypes(fields) {
  return fields.reduce((acc, field) => {
    const inputArg = field.args.find(isInputArg);

    if (inputArg) {
      acc[field.name] = getBaseTypeName(inputArg.type);
    }

    return acc;
  }, {});
}

function isInputArg(arg) {
  return arg.name === 'input' && getBaseTypeKind(arg.type) === 'INPUT_OBJECT';
}

function possibleTypes(interfaceType) {
  return interfaceType.possibleTypes.map((t) => t.name);
}

export default function simplifyType(type, whiteList = false) {
  const simplifiedType = {
    name: type.name,
    kind: type.kind
  };

  switch (type.kind) {
    case 'OBJECT':
      simplifiedType.fieldBaseTypes = fieldBaseTypes(type.fields, whiteList);
      simplifiedType.implementsNode = implementsNode(type);

      if (type.name === 'Mutation') {
        simplifiedType.relayInputObjectBaseTypes = relayInputObjectBaseTypes(type.fields);
      }

      return simplifiedType;
    case 'INTERFACE':
      simplifiedType.fieldBaseTypes = fieldBaseTypes(type.fields);
      simplifiedType.possibleTypes = possibleTypes(type);

      return simplifiedType;
    case 'INPUT_OBJECT':
      simplifiedType.inputFieldBaseTypes = fieldBaseTypes(type.inputFields);

      return simplifiedType;
    default:
      return simplifiedType;
  }
}
