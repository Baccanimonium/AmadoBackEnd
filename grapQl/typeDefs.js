const { gql } = require('apollo-server');

exports.typeDefs = gql`
	type File {
		filename: String!
		mimetype: String!
		encoding: String!
	}
	type Users {
         id: ID
         name: String!
         password: String!
         email: String!
         avatar: String
         date: String
    }
    type Comments {
        id: ID
        body: String!
    }
    type Products {
        id: ID
        name: String!
        description: String!
        price: String!
        image: [String]!
        quantity: String!
        comments: [Comments]
    }
    type ProductCategories {
         id: ID
         name: String!
         products: [Products]
    }
	
    type Token {
        token: String!
    } 
    
	type Query {
        getCurrentUser: Users
        getUser: [Users]
        getCategories: [ProductCategories]
    }
    
    type Mutation {
    
        singleUpload(file: Upload!): File!
        
        addUser(
            name: String!,
            email: String!,
            password: String!,
        ): Users
        
        addProductCategory(
            name: String!,
            products: [String!],
        ): ProductCategories
        
        addProducts(
            categoryId: ID
	        name: String!
	        description: String!
	        price: String!
	        image: [Upload]
	        quantity: String!
        ):Products
    }
`;
