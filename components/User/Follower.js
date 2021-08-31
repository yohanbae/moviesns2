import {
	Avatar,
	Box,
	Popover,
	PopoverTrigger,
	PopoverContent,
	Button,
	Grid,
} from '@chakra-ui/react'
import Link from 'next/link'
import useSwr from 'swr'
import Parse from 'parse/dist/parse.min.js'

const fetcherUser = async () => {
	let query = new Parse.Query('User')
	const object = await query.find()
	return object
}

export const Follower = ({ data }) => {
	const { data: userData, isValidating } = useSwr(`users`, fetcherUser)

	return (
		<Popover>
			<PopoverTrigger>
				<Button size="xs">{data?.length} follower</Button>
			</PopoverTrigger>
			<PopoverContent p={2}>
				{data?.map((v) => (
					<div key={v.id}>
						<Link
							href={`/user/${v.attributes.following_username}`}
							className="user-pick"
						>
							<a>
								<Grid
									gridTemplateColumns="30px 1fr"
									gap={2}
									mb="5px"
									alignItems="center"
								>
									{isValidating ? null : (
										<Avatar
											w="30px"
											h="30px"
											src={
												userData?.find(
													(y) =>
														y.attributes.username ===
														v.attributes.following_username,
												).attributes.avatar?._url
											}
										/>
									)}
									<Box fontSize="10px">{v.attributes.following_username}</Box>
								</Grid>
							</a>
						</Link>
					</div>
				))}
			</PopoverContent>
		</Popover>
	)
}

export const Following = ({ data }) => {
	const { data: userData, isValidating, mutate } = useSwr(`users`, fetcherUser)

	return (
		<Popover>
			<PopoverTrigger>
				<Button size="xs">{data?.length} following</Button>
			</PopoverTrigger>
			<PopoverContent p={2}>
				{data?.map((v) => (
					<div key={v.id}>
						<Link href={`/user/${v.attributes.username}`}>
							<a>
								<Grid
									gridTemplateColumns="30px 1fr"
									gap={2}
									mb="5px"
									alignItems="center"
								>
									{isValidating ? null : (
										<Avatar
											w="30px"
											h="30px"
											src={
												userData?.find(
													(y) =>
														y.attributes.username === v.attributes.username,
												).attributes.avatar?._url
											}
										/>
									)}
									<Box fontSize="10px">{v.attributes.username}</Box>
								</Grid>
							</a>
						</Link>
					</div>
				))}
			</PopoverContent>
		</Popover>
	)
}
