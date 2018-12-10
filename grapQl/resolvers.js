const shortid = require('shortid');
const fs = require('fs');
const path = require('path');
const StoryModel = require('../models/Story');
const getPathForStatic = require('../utils/getStaticPath');

const storeUpload = async ({ stream, filePath }) => {

	const writePath = path.resolve(__dirname, `..${filePath}`);
	const writeStream = fs.createWriteStream(writePath);
	return new Promise((resolve, reject) => stream
		.pipe(writeStream)
		.on("finish", () => resolve({writePath}))
		.on("error", reject)
	);
};
const processUpload = async (upload) => {
	const { stream, filename, mimetype, encoding } = await upload;
	const [ fileExt ] = filename.split('.').reverse();
	const id = shortid.generate();

	const filePath = getPathForStatic({ fileExt, fileName: id });
	await storeUpload({stream, filePath});
	return filePath;
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
			return await ProductCategories.find();
		},

		getProducts: async (root, { categoryId }, { Products, ProductCategories }) => {
			const { id } = await ProductCategories.findOne({name: categoryId }).exec();
			return await Products.find({ categoryId: id });
		},

		getPerson: async (root, { _id }, { Person }) => {
			return await Person.findOne({ _id });
		},
		getStory: async (root, { _id }, { Story }) => {
			return await Story.findOne({ _id });
		},
	},
	Users: {
		avatar (root, args, ...a) {
			console.log(root, args, a)
			return 'Hello World';
		}
	},
	Person: {
		async stories ({_id}) {
			return await StoryModel.find({ author : _id });
		}
	},
	Story: {
		async author (root) {
			const { author } = await root.populate('author').execPopulate();
			return author;
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
		addProducts: async (root, { image, ...args }, { Products, }) => {
			let finalResult = [];
			const images = Object.values(image).map(async (file) => await processUpload(file));
			for (const result of images) {
				finalResult.push(await result);
			}
			return await new Products({
				image: finalResult,
				...args
			}).save();
		},

		singleUpload: async (parent, { file }) => {
			// 1. Validate file metadata.

			// 2. Stream file contents into cloud storage:
			// https://nodejs.org/api/stream.html

			// 3. Record the file upload in your DB.
			// const id = await recordFile( … )

			return await processUpload(file);
		},
		addPerson: async (root, { name }, { Person }) => {
			return await new Person({name}).save();
		},
		addStory: async (root, { title, author }, { Story }) => {
			return await new Story({title, author}).save();
		}
	}
};
