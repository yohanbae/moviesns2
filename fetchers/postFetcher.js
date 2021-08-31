import Parse from 'parse/dist/parse.min.js'

export const Postfetcher = async (theinfo) => {
	let movieId = theinfo.split('/')[0] // movieId OR username
	let mode = theinfo.split('/')[1]
	let page = theinfo.split('/')[2]

	let limit = 10
	let skip = page * limit - limit

	let query = new Parse.Query('MoviePost')

	if (mode === 'movie') {
		query.equalTo('movie_id', movieId)
	}
	if (mode === 'user') {
		query.equalTo('username', movieId)
	}

	if (mode === 'feed') {
		// Receive Following List from USER
		const subQuery = new Parse.Query('Follow')
		subQuery.equalTo('following_username', movieId)
		const subRes = await subQuery.find()
		const mysub = subRes.map((v) => v.attributes.username)

		// Get Posts of Following List
		const query1 = new Parse.Query('MoviePost')
		query1.containedIn('username', mysub)

		// Get Posts of Favorite Movies
		const queryFavMovie = new Parse.Query('FavMovie')
		queryFavMovie.equalTo('username', movieId)
		const result = await queryFavMovie.find()
		let mymovies = result.map((v) => v.attributes.movieId)

		const query2 = new Parse.Query('MoviePost')
		query2.containedIn('movie_id', mymovies)

		query = Parse.Query.or(query1, query2)
	}
	query.descending('createdAt')
	query.limit(limit)
	query.skip(skip)
	const post = await query.find()
	return post
}
