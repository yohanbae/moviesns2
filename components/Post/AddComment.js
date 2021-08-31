import useSwr from 'swr'
import { useAuth } from '../../utils/use-auth'
import Parse from 'parse/dist/parse.min.js'
import { CommentFetcher } from '../../fetchers/commentFetcher'
import { useState } from 'react'
import { Input } from '@chakra-ui/react'

const AddComment = ({ postId }) => {
	const auth = useAuth()

	const { data, mutate } = useSwr('comments', CommentFetcher)
	const [comment, setComment] = useState('')

	const onEnter = (e) => {
		if (e.keyCode === 13) submitComment()
	}
	const submitComment = async () => {
		const CommentData = new Parse.Object('Comments')
		CommentData.set('comment', comment)
		CommentData.set('postId', postId)
		CommentData.set('userId', auth.user.id)
		CommentData.set('username', auth.user.attributes.username)
		await CommentData.save()

		mutate()
		setComment('')
	}

	return (
		<>
			<Input
				type="text"
				size="xs"
				bgColor="white"
				className="myfield"
				placeholder="add comment"
				value={comment}
				onChange={(e) => setComment(e.target.value)}
				onKeyDown={onEnter}
			/>
		</>
	)
}

export default AddComment
