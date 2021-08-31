import { useState, useRef } from 'react'
import useSwr from 'swr'
import Parse from 'parse/dist/parse.min.js'

// import dynamic from 'next/dynamic'
import { CommentFetcher } from '../../fetchers/commentFetcher'

import ShowMoreText from 'react-show-more-text'
import Upvote from './Upvote'

import EditTextarea from './EditTextarea'
import UserDisplay from '../User/UserDisplay'


import {
	// Spinner,
	Box,
	Grid,
	Avatar,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Button,
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	Popover,
	PopoverTrigger,
	PopoverContent,
	Divider,
} from '@chakra-ui/react'
import { HamburgerIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useAuth } from '../../utils/use-auth'
import Comments from './Comments'

const Post = ({ postId, attributes, mutate }) => {
	const [isAlarmOpen, setIsAlarmOpen] = useState(false)
	const [pickPost, setPickPost] = useState()
	const { isOpen, onOpen, onClose } = useDisclosure()
	const cancelRef = useRef()
	const router = useRouter()
	const auth = useAuth()

	const fetcherUser = async () => {
		let query = new Parse.Query('User')
		const object = await query.find()
		return object
	}

	const { data } = useSwr(`users`, fetcherUser)

	const onEdit = (id) => {
		setPickPost(id)
		onOpen()
	}

	const onDelete = (id) => {
		setPickPost(id)
		setIsAlarmOpen(true)
	}

	const onDeleteConfirm = async () => {
		const query = new Parse.Query('MoviePost')
		try {
			// here you put the objectId that you want to delete
			const object = await query.get(pickPost)
			try {
				const response = await object.destroy()
				console.log('Post Deleted')
				mutate()
				setIsAlarmOpen(false)
			} catch (error) {
				console.error('Error while deleting ParseObject', error)
			}
		} catch (error) {
			console.error('Error while retrieving ParseObject', error)
		}
	}

	const onUpdate = async (newComment) => {
		try {
			const query = new Parse.Query('MoviePost')
			const object = await query.get(postId)
			object.set('comment', newComment)
			try {
				const response = await object.save()
				mutate()
				onClose()
			} catch (error) {
				console.error('Error while updating MoviePost', error)
			}
		} catch (error) {
			console.error('Error while retrieving object MoviePost', error)
		}
	}

	// const DynamicTextarea = dynamic(() => import('./EditTextarea').then((mod) => mod.Edittext), {loading: () => <Spinner />})
	// const DynamicUserDisplay = dynamic(() => import('../User/UserDisplay').then((mod) => mod.Userdisplay), {loading: () => <Spinner />})

	const CommentWrap = ({ postId, userData }) => {
		const [displayComment, setDisplayComment] = useState(false)
		const { data: comData } = useSwr('comments', CommentFetcher)

		return (
			<>
				{comData?.filter((v) => v.attributes.postId === postId).length > 0 ? (
					<Box pr={5} textAlign="right" onClick={() => setDisplayComment(true)}>
						{comData.filter((v) => v.attributes.postId === postId).length}{' '}
						comments
					</Box>
				) : auth?.user ? (
					<Box pr={5} textAlign="right" onClick={() => setDisplayComment(true)}>
						click to add comment
					</Box>
				) : (
					<Link href="/login">
						<a>Login to add comment</a>
					</Link>
				)}
				{displayComment ? (
					<Comments postId={postId} userData={userData} />
				) : null}
			</>
		)
	}

	return (
		<Box bgColor={'gray.100'} mb={5} pb={2}>
			<Grid p={4} borderRadius="5px" gridTemplateColumns="80px 1fr 30px">
				<div>
					<Popover>
						<PopoverTrigger>
							<Button>
								<Avatar
									src={
										data
											? data.find(
													(v) => v.attributes.username === attributes.username,
											  ).attributes.avatar?._url
											: null
									}
								/>
							</Button>
						</PopoverTrigger>
						<PopoverContent>
							<UserDisplay username={attributes.username} />
						</PopoverContent>
					</Popover>
					<Box mb={5} />
					<Upvote postId={postId} />
				</div>
				<div>
					<ShowMoreText
						lines={3}
						more="read full"
						less="close"
						className="expand-css"
						anchorClass="expand-anchor"
						expanded={false}
					>
						{attributes.comment}
					</ShowMoreText>
				</div>
				{auth.user ? (
					auth.user?.attributes.username === attributes.username ? (
						<Menu>
							<MenuButton as={Button} aria-label="Options" p={0} mt="-10px">
								<HamburgerIcon />
							</MenuButton>
							<MenuList>
								<MenuItem icon={<EditIcon />} onClick={() => onEdit(postId)}>
									Edit Post
								</MenuItem>
								<MenuItem
									icon={<DeleteIcon />}
									onClick={() => onDelete(postId)}
								>
									Delete Post
								</MenuItem>
							</MenuList>
						</Menu>
					) : (
						<div></div>
					)
				) : null}
			</Grid>
			<Box fontSize="12px" pl="30px">
				<Divider borderColor="lightgray" />
				<CommentWrap postId={postId} userData={data} />
			</Box>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Update Post</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<EditTextarea
							onUpdate={onUpdate}
							onClose={onClose}
							attributes={attributes}
						/>
					</ModalBody>
				</ModalContent>
			</Modal>

			<AlertDialog
				isOpen={isAlarmOpen}
				leastDestructiveRef={cancelRef}
				onClose={() => setIsAlarmOpen(false)}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize="lg" fontWeight="bold">
							Delete Post
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
		</Box>
	)
}

export default Post
