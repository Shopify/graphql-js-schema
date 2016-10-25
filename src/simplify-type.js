import isScalar from './helpers/is-scalar';
import isObject from './helpers/is-object';
import isInterface from './helpers/is-interface';
import isConnection from './helpers/is-connection';
import getBaseType from './helpers/get-base-type';
import hasNonNullType from './helpers/has-non-null-type';
import hasListType from './helpers/has-list-type';
import implementsNode from './helpers/implements-node';

function transformField(field) {
  return {
    type: field.baseType.name,
    kind: field.baseType.kind,
    fieldName: field.name,
    isList: hasListType(field.type),
    args: (field.args || []).map(transformArgument)
  };
}

function transformArgument(arg) {
  const typeFromSchema = getBaseType(arg.type);
  const argTransformed = {
    name: arg.name,
    isNonNull: hasNonNullType(arg),
    isList: hasListType(arg),
    type: typeFromSchema.name,
    kind: typeFromSchema.kind
  };

  if (isInterface(typeFromSchema)) {
    argTransformed.possibleTypes = typeFromSchema.possibleTypes.map((possibleType) => {
      return possibleType.name;
    });
  }

  return argTransformed;
}

function objectifyField(acc, field) {
  const descriptor = Object.keys(field).filter((key) => {
    return (key !== 'fieldName');
  }).reduce((descriptorAcc, key) => {
    descriptorAcc[key] = field[key];

    return descriptorAcc;
  }, {});

  acc[field.fieldName] = descriptor;

  return acc;
}

export default function simplifyType(typeFromSchema) {
  if (isScalar(typeFromSchema)) {
    return {
      name: typeFromSchema.name,
      kind: typeFromSchema.kind,
      scalars: [],
      objects: [],
      connections: [],
      implementsNode: implementsNode(typeFromSchema)
    };
  }

  const fieldsWithBaseTypes = typeFromSchema.fields.map((field) => {
    return Object.assign({baseType: getBaseType(field.type)}, field);
  });

  const scalars = fieldsWithBaseTypes.filter((field) => {
    return isScalar(field.baseType);
  });

  const objects = fieldsWithBaseTypes.filter((field) => {
    return isObject(field.baseType) && !isConnection(field.baseType);
  });

  const connections = fieldsWithBaseTypes.filter((field) => {
    return isConnection(field.baseType);
  });

  const simplifiedType = {
    name: typeFromSchema.name,
    kind: typeFromSchema.kind,
    scalars: scalars.map(transformField).reduce(objectifyField, {}),
    objects: objects.map(transformField).reduce(objectifyField, {}),
    connections: connections.map(transformField).reduce(objectifyField, {}),
    implementsNode: implementsNode(typeFromSchema)
  };

  if (isInterface(typeFromSchema)) {
    simplifiedType.possibleTypes = typeFromSchema.possibleTypes.map((possibleType) => {
      return possibleType.name;
    });
  }

  return simplifiedType;
}
