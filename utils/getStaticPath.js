const folderNames = {
	jpg: 'img',
	gif: 'gif'
};

module.exports = ({ fileExt, fileName }) => `/static/${folderNames[fileExt]}/${fileName}.${fileExt}`;
