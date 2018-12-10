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
        categoryId: String!
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
    
    type Story {
        id: ID!
        author: Person!
        title: String!
    }
    
    type Person {
        id: ID!
		name: String!
		stories: [Story]
    }
    
	type Query {
        getCurrentUser: Users
        getUser: [Users]
        getCategories: [ProductCategories]
        getProducts(_id: ID, categoryId: ID):[Products]
        
        getPerson(_id: ID!): Person
        getStory(_id: ID!): Story
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
            categoryId: ID!
	        name: String!
	        description: String!
	        price: String!
	        image: [Upload]
	        colors: [String!]!
	        quantity: String!
        ):Products
        
        addPerson(name: String!):Person
        addStory(author: ID!, title: String!):Story
    }
`;
