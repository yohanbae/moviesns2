import {
	Avatar,
	Grid,
	Spinner,
	Button,
	Popover,
	PopoverTrigger,
	PopoverContent,
} from '@chakra-ui/react'
import useSwr from 'swr'
import Parse from 'parse/dist/parse.min.js'
import { useAuth } from '../utils/use-auth'

const FavMovie = ({ movieId, title, poster_path }) => {
	const auth = useAuth()

	const fetcherFav = async () => {
		let query = new Parse.Query('FavMovie')
		query.equalTo('username', auth.user.attributes.username)
		const object = await query.find()
		return object
	}
	const { data, mutate } = useSwr(
		`/fav/${auth.user.attributes.username}`,
		fetcherFav,
	)

	const onAdd = async () => {
		const Fav = new Parse.Object('FavMovie')
		Fav.set('username', auth.user.attributes.username)
		Fav.set('movieId', movieId)
		Fav.set('title', title)
		Fav.set('poster_path', poster_path)
		await Fav.save()
		mutate()
	}

	const onRemove = async () => {
		const theId = data.find((v) => v.attributes.movieId === movieId).id

		const query = new Parse.Query('FavMovie')
		const object = await query.get(theId)
		try {
			const response = await object.destroy()
			mutate()
		} catch (e) {
			console.log(e)
		}
	}

	return (
		<>
			{auth.user ? (
				data?.find((v) => v.attributes.movieId === movieId) ? (
					<div onClick={() => onRemove()}>REMOVE</div>
				) : (
					<div onClick={() => onAdd()}>ADD</div>
				)
			) : null}
		</>
	)
}
export default FavMovie
