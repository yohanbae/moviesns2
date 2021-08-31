import { Avatar, Grid, Box, Button, Input } from '@chakra-ui/react'
import useSwr from 'swr'
import Parse from 'parse/dist/parse.min.js'
import { useAuth } from '../../utils/use-auth'
import Link from 'next/link'
import { Follower, Following } from './Follower'
import { useState } from 'react'
import FavMovieList from './FavMovieList'

const UserDisplay = ({ username, small = true }) => {
	const auth = useAuth()
	const [isEditShow, setIsEditShow] = useState(false)
	const [file, setFile] = useState()

	const fetcherFollow = async () => {
		let queryFollower = new Parse.Query('Follow')
		let queryFollowing = new Parse.Query('Follow')
		let followerRes = await queryFollower.find()
		let followingRes = await queryFollowing.find()
		return {
			follower: followerRes, // 이 유저를 following하고 있는 목록
			following: followingRes, // 이 유저가 following하고 있는 목록
		}
	}

	const fetcherUser = async () => {
		let query = new Parse.Query('User')
		const object = await query.find()
		return object
	}

	const fetcherMovie = async () => {
		let queryFavMovie = new Parse.Query('FavMovie')
		let result = await queryFavMovie.find()
		return result
	}

	const { data, mutate } = useSwr(`users`, fetcherUser)
	const {
		data: followData,
		isValidating: followIsValidating,
		mutate: followMutate,
	} = useSwr(`follows`, fetcherFollow)
	const {
		data: favData,
		isValidating: favIsValidating,
		mutate: favMutate,
	} = useSwr(`fav`, fetcherMovie)

	const onSubscribe = async () => {
		const Sub = new Parse.Object('Follow')
		Sub.set('username', username)
		Sub.set('following_username', auth.user.attributes.username)
		await Sub.save()
		followMutate()
	}

	const onUnsubscribe = async () => {
		const id = followData.follower
			.filter((v) => v.attributes.username === username)
			.find(
				(v) =>
					v.attributes.following_username === auth.user.attributes.username,
			).id
		const query = new Parse.Query('Follow')

		try {
			// here you put the objectId that you want to delete
			const object = await query.get(id)
			try {
				const response = await object.destroy()
				followMutate()
			} catch (error) {
				console.error('Error while deleting ParseObject', error)
			}
		} catch (error) {
			console.error('Error while retrieving ParseObject', error)
		}
	}

	const onFileChange = (e) => {
		setFile(e.target.files[0])
	}
	const onFileUpload = async () => {
		const parseFile = new Parse.File(file.name, file)
		let query = new Parse.Query('User')
		try {
			const object = await query.get(auth.user.id)
			object.set('avatar', parseFile)
			await object.save()
			mutate()
		} catch (error) {
			console.error('Error while updating ', error)
		}
	}

	return (
		<div>
			<Grid
				gridTemplateColumns={small ? '50px 1fr' : '150px 1fr'}
				columnGap={5}
				alignItems="center"
				mt={(small &&= 5)}
				mb={5}
				p={(small &&= 2)}
			>
				<Link href={`/user/${username}`}>
					<a>
						<Avatar
							w={small ? '50px' : '120px'}
							h={small ? '50px' : '120px'}
							src={
								data
									? data.find((v) => v.attributes.username === username)
											.attributes.avatar?._url
									: null
							}
						/>
					</a>
				</Link>
				<div>
					<Box fontSize={(small &&= '12px')} mb={5} textAlign="center">
						{username.toUpperCase()}
					</Box>
					<Grid gridTemplateColumns="1fr 1fr 1fr" columnGap={10}>
						{followIsValidating ? null : small ? (
							<Box textAlign="center" fontSize="10px">
								{
									followData?.follower.filter(
										(v) => v.attributes.username === username,
									).length
								}{' '}
								follower
							</Box>
						) : (
							<Follower
								data={followData.follower.filter(
									(v) => v.attributes.username === username,
								)}
							/>
						)}
						{followIsValidating ? null : small ? (
							<Box textAlign="center" fontSize="10px">
								{
									followData?.following.filter(
										(v) => v.attributes.following_username === username,
									).length
								}{' '}
								following
							</Box>
						) : (
							<Following
								data={followData.following.filter(
									(v) => v.attributes.following_username === username,
								)}
							/>
						)}
						{favIsValidating ? null : small ? (
							<Box textAlign="center" fontSize="10px">
								{
									favData?.filter((v) => v.attributes.username === username)
										.length
								}{' '}
								movie
							</Box>
						) : (
							<FavMovieList
								data={favData.filter((v) => v.attributes.username === username)}
							/>
						)}
					</Grid>
				</div>
			</Grid>

			<div>
				{!small ? (
					auth.user ? (
						followIsValidating ? null : username ===
						  auth.user.attributes.username ? null : followData?.follower
								.filter((v) => v.attributes.username === username)
								.find(
									(v) =>
										v.attributes.following_username ===
										auth.user.attributes.username,
								) ? (
							<Button onClick={() => onUnsubscribe()} size="sm">
								UNSUBSCRIBE
							</Button>
						) : (
							<Button onClick={() => onSubscribe()} size="sm">
								SUBSCRIBE
							</Button>
						)
					) : null
				) : null}
			</div>
			<div>
				{auth.user ? (
					auth.user.attributes.username === username ? (
						<Button onClick={() => setIsEditShow(!isEditShow)} size="xs">
							Edit Avatar
						</Button>
					) : null
				) : null}
				{isEditShow ? (
					<Grid gridTemplateColumns="1fr 1fr" w="500px" gap={5} mt={3}>
						<Input type="file" onChange={onFileChange} size="xs" />
						<Button onClick={onFileUpload} size="xs">
							Upload
						</Button>
					</Grid>
				) : null}
			</div>
		</div>
	)
}

export default UserDisplay
