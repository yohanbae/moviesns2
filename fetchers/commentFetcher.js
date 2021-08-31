import Parse from 'parse/dist/parse.min.js'

export const CommentFetcher = async (id) => {
	const query = new Parse.Query('Comments')
	query.descending('createdAt')
	const post = await query.find()
	return post
}
