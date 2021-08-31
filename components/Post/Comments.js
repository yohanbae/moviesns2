import {
	Grid,
	Avatar,
	Text,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	IconButton,
	Button,
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
} from '@chakra-ui/react'
import { HamburgerIcon, DeleteIcon } from '@chakra-ui/icons'

import useSwr from 'swr'
import { CommentFetcher } from '../../fetchers/commentFetcher'
import { useAuth } from '../../utils/use-auth'
import AddComment from './AddComment'
import { useState, useRef } from 'react'
import Parse from 'parse/dist/parse.min.js'
import Link from 'next/link'

const Comments = ({ postId, userData }) => {
	const auth = useAuth()
	const { data, isValidating, mutate } = useSwr('comments', CommentFetcher)

	const [isAlarmOpen, setIsAlarmOpen] = useState(false)
	const cancelRef = useRef()
	const [pickComment, setPickComment] = useState()

	const onDelete = (id) => {
		setPickComment(id)
		setIsAlarmOpen(true)
	}

	const onDeleteConfirm = async () => {
		const query = new Parse.Query('Comments')
		try {
			// here you put the objectId that you want to delete
			const object = await query.get(pickComment)
			try {
				const response = await object.destroy()
				console.log('Deleted ParseObject', response)
				mutate()
				setIsAlarmOpen(false)
			} catch (error) {
				console.error('Error while deleting ParseObject', error)
			}
		} catch (error) {
			console.error('Error while retrieving ParseObject', error)
		}
	}
    
	return (
		<>
			{data
				?.filter((v) => v.attributes.postId === postId)
				.map((com) => (
					<Grid
						key={com.id}
						bgColor={'gray.100'}
						p={2}
						borderRadius="5px"
						gridTemplateColumns="20px 1fr 20px"
					>
						<Link href={`/user/${com.attributes.username}`}>
							<a>
								<Avatar
									src={
										userData?.find(
											(v) => v.attributes.username === com.attributes.username,
										).attributes.avatar?._url
									}
									w="20px"
									h="20px"
								/>
							</a>
						</Link>
						<Text pl={5}>
							{com.attributes.comment} by {com.attributes.username}
						</Text>
						<div>
							{auth.user?.attributes.username === com.attributes.username ? (
								<Menu>
									<MenuButton
										as={Button}
										aria-label="Options"
										p={0}
										size="xs"
										mt="-10px"
										fontSize="10px"
									>
										<HamburgerIcon />
									</MenuButton>
									<MenuList>
										<MenuItem
											icon={<DeleteIcon />}
											onClick={() => onDelete(com.id)}
										>
											Delete Comment
										</MenuItem>
									</MenuList>
								</Menu>
							) : null}
						</div>
					</Grid>
				))}
			{auth.user ? <AddComment postId={postId} /> : null}
			<AlertDialog
				isOpen={isAlarmOpen}
				leastDestructiveRef={cancelRef}
				onClose={() => setIsAlarmOpen(false)}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize="lg" fontWeight="bold">
							Delete Comment
						</AlertDialogHeader>

						<AlertDialogBody>
							Are you sure? You can&apos;t undo this action afterwards.
						</AlertDialogBody>

						<AlertDialogFooter>
							<Button ref={cancelRef} onClick={() => setIsAlarmOpen(false)}>
								Cancel
							</Button>
							<Button
								colorScheme="red"
								onClick={() => onDeleteConfirm()}
								ml={3}
							>
								Delete
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	)
}

export default Comments
