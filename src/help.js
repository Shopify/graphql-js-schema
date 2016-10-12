export default `
usage: graphql-js-schema --schema-file ./schema.json --outdir graph --schema-bundle-name

Fetch the json representation of a GraphQL Schema from a live server.

arguments:
 --help               Print this message
 --schema-file        The relative or absolute path to the schema file (in json)
 --outdir             The directory where all your GraphQL type modules will be generated
 --schema-bundle-name The name of the bundled schema module (default: "Schema")
`;
