export default function hasNonNullType(typeDescriptor) {
  if (typeDescriptor.kind === 'NON_NULL') {
    return true;
  } else if (typeDescriptor.ofType) {
    return hasNonNullType(typeDescriptor.ofType);
  }

  return false;
}
