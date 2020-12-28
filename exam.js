const { graphql, buildSchema } = require("graphql");

const schema = buildSchema(`
  type Query {
    name : String,
    age : Int
  }
`);

const root = {
  name: () => "Hello world!",
  age: () => 20,
};

graphql(schema, "{ name }", root).then((response) => {
  console.log(response);
});
