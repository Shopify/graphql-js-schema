export default function isConnection(typeDescriptor) {
  return Boolean(typeDescriptor.name.endsWith('Connection'));
}
