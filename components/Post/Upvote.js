import { Box } from '@chakra-ui/layout'
import Parse from 'parse/dist/parse.min.js'
import useSwr from 'swr'
import { useAuth } from '../../utils/use-auth'
import { TriangleUpIcon } from '@chakra-ui/icons'

const Upvote = ({ postId }) => {
	const auth = useAuth()
	const fetcher = async (id) => {
		const query = new Parse.Query('Upvote')
		const post = await query.find()
		return post
	}

	const { data, isValidating, mutate } = useSwr(`upvotes`, fetcher)

	const onUpvote = async (id) => {
		const filterData = data.filter((v) => v.attributes.post_id === postId)
		const findData = filterData.find(
			(v) => v.attributes.user_id === auth.user.id,
		)

		if (findData) {
			const queryForDel = new Parse.Query('Upvote')
			try {
				// here you put the objectId that you want to delete
				const object = await queryForDel.get(findData.id)
				try {
					await object.destroy()
					mutate()
				} catch (error) {
					console.error('Error while deleting ParseObject', error)
				}
			} catch (error) {
				console.error('Error while retrieving ParseObject', error)
			}
			return false
		}

		const query = new Parse.Object('Upvote')
		query.set('post_id', id)
		query.set('user_id', auth.user.id)
		await query.save()
		mutate()
	}

	return (
		<Box fontSize="10px" textAlign="center">
			{
				<>
					{auth?.user ? (
						<div onClick={() => onUpvote(postId)}>
							<TriangleUpIcon
								fontSize="15px"
								cursor="pointer"
								color={
									data
										?.filter((v) => v.attributes.post_id === postId)
										.find((v) => v.attributes.user_id === auth.user.id)
										? 'black'
										: 'gray'
								}
							/>
						</div>
					) : (
						<TriangleUpIcon fontSize="15px" cursor="pointer" color="gray" />
					)}
					<div>
						{isValidating ? (
							<div></div>
						) : (
							<span>
								{data
									? data.filter((v) => v.attributes.post_id === postId).length
									: 0}
							</span>
						)}
					</div>
				</>
			}
		</Box>
	)
}

export default Upvote
