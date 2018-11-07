const shortid = require('shortid');
const fs = require('fs');
const path = require('path');


const storeUpload = async ({ stream }) => {
	const id = shortid.generate();

	const writePath = path.resolve(__dirname, `../assets/img/${id}.jpg`);
	const writeStream = fs.createWriteStream(writePath);
	return new Promise((resolve, reject) => stream
		.pipe(writeStream)
		.on("finish", () => resolve({id, writePath}))
		.on("error", reject)
	);
};
const processUpload = async (upload) => {
	const { stream, filename, mimetype, encoding } = await upload;

	const { id } = await storeUpload({stream, filename});
	return id;
};
exports.resolvers = {
	Query: {
		getCurrentUser: async (root, args, { currentUser, User }) => {
			if (!currentUser) {
				return null;
			}
			return await User.findOne({ name: currentUser.name })
		},

		getUser: async (root, args, { User }) => {
			return await User.find();
		},

		getCategories: async (root, args, { ProductCategories }) => {
			return await ProductCategories.find().populate({ path: 'products', model: 'products'});
		}
	},
	Mutation: {
		addUser: async (root, { name, email, password }, { User }) => {
			return await new User({
				name,
				email,
				password,
			}).save();
		},

		addProductCategory: async (root, { name }, { ProductCategories }) => {
			return await new ProductCategories({
				name
			}).save();
		},
		addProducts: async (root, { categoryId, name, description, price, image, quantity }, { Products, ProductCategories }) => {
			let finalResult = [];
			const images = Object.values(image).map(async (file) => await processUpload(file));
			for (const result of images) {
				finalResult.push(await result);
			}
			const newProduct = await new Products({
				name,
				description,
				price,
				image: finalResult,
				quantity,
			}).save();
			await ProductCategories.findByIdAndUpdate({_id: categoryId}, {$push: {products: newProduct._id}});
			return newProduct;
		},

		singleUpload: async (parent, { file }) => {
			// 1. Validate file metadata.

			// 2. Stream file contents into cloud storage:
			// https://nodejs.org/api/stream.html

			// 3. Record the file upload in your DB.
			// const id = await recordFile( … )

			return await processUpload(file);
		}
	}
};
