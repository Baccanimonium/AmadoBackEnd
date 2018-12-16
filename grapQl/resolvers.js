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

		getProducts: async (root, { categoryId, ...qParams }, { Products, ProductCategories }) => {
			const { q, a} = Object.entries(qParams).reduce((accum, [key, val]) => {
				switch (key) {
					case 'price':
						accum.q[key] = { $gte: val[0], $lte: val[1] };
						break;

					case 'skip':
					case 'limit':
						accum.a[key] = val;
						break;
					case 'lastPurchase':
						accum.a.sort = { [key]: val };
						break;
					default:
						accum.q[key] = { $in: val };
				}
				return accum
			}, { q: {}, a: {}});
			if (categoryId) {
				const { id } = await ProductCategories.findOne({name: categoryId}).exec();
				q.categoryId = id
			}
			return await Products.find(q, null, a).exec();
		},

		getProduct: async (root, { id }, { Products }) => {
			return await Products.findById(id)
		},

		searchProducts: async (root, { name }, { Products }) => {
			if (!name) return [];
			return await Products.find(
				{ $text: { $search: name, $caseSensitive: false } },
				{ score: { $meta: "textScore" } },
				{ limit: 10 }
			).exec()
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
