export default `
usage: graphql-js-schema --schema-file ./schema.json
                         --outdir graph
                         [--schema-bundle-name "Schema"]
                         [--bundle-only]

Transform the json representation of a GraphQL Schema into es6 modules

arguments:

 --help               Print this message

 --schema-file        The relative or absolute path to the schema file (in json)

 --outdir             The directory where all your GraphQL type modules will be
                      generated.

 --schema-bundle-name The name of the bundled schema module (default: "Schema")

 --bundle-only        Only output the top level bundle as an es module. This is
                      a shortcut to running rollup on the top level bundle file.
                      The default behaviour is to output separate files for each
                      type, and expose a top-level module that can be imported
                      as a single module.
`;
