export default function isNotIntrospectionType(typeDescriptor) {
  return !typeDescriptor.name.startsWith('__');
}
