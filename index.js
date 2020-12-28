const express = require("express");
const PORT = 8000;
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
    input ProductInput {
        name: String
        price: Int
        description : String
    }
    type Product {
        id: ID!
        name: String
        price: Int
        description : String
    }
    type Query {
        getProduct ( id: ID! ): Product
        getAllProduct : [Product]
    }
    type Mutation {
        addProduct(input: ProductInput): Product
        updateProduct( id: ID! , input: ProductInput! ): Product
        deleteProduct( id: ID! ) : String
    }
`);

const products = [
  {
    id: 1,
    name: "첫번째 제품",
    price: 1000,
    description: "하나",
  },
  {
    id: 2,
    name: "두번째 제품",
    price: 2000,
    description: "둘",
  },
];

const root = {
  getProduct: ({ id }) =>
    products.find((product) => product.id === parseInt(id)),
  getAllProduct: () => products,
  addProduct: ({ input }) => {
    input.id = parseInt(products.length + 1);
    products.push(input);
    return root.getProduct({ id: input.id });
  },
  updateProduct: ({ id, input }) => {
    const index = products.findIndex((product) => product.id === parseInt(id));
    products[index] = {
      id: parseInt(id),
      ...input,
    };
    return products[index];
  },
  deleteProduct: ({ id }) => {
    const index = products.findIndex((product) => product.id === parseInt(id));
    products.splice(index, 1);
    return "delete success";
  },
};

const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.use("/", express.static("public"));

app.listen(PORT, () => {
  console.log(`Running a GraphQL API server at localhost:${PORT}/graphql`);
});
