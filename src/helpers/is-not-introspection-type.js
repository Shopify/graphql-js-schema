export default function isNotIntrospectionType(typeDescriptor) {
  return !typeDescriptor.name.match(/^__.+/);
}
