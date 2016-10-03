export default function implementsNode(typeFromSchema) {
  const interfaces = typeFromSchema.interfaces || [];

  return interfaces.some((graphInterface) => {
    graphInterface.name === 'Node';
  });
}
