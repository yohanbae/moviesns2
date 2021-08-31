import AddPost from './AddPost'
import useSWRInfinite from 'swr/infinite'
import { useAuth } from '../../utils/use-auth'
import { Spinner, Spacer, Grid, Flex, Button } from '@chakra-ui/react'
import { Postfetcher } from '../../fetchers/postFetcher'
import Link from 'next/link'
import Post from './Post'
import Image from 'next/image'

const Posts = ({
	movieId = null,
	username = null,
	poster_path = null,
	feed = null,
}) => {
	const auth = useAuth()

	const getKey = (pageIndex, previousPageData) => {
		if (previousPageData && !previousPageData.length) return null // reached the end

		// Display by MovieID
		if (movieId) {
			return `${movieId}/movie/${pageIndex + 1}`
		}

		// Display by UserID
		if (username) {
			return `${username}/user/${pageIndex + 1}`
		}

		if (feed) {
			return `${feed}/feed/${pageIndex + 1}`
		}

		// Display All Recent = explore
		if (!movieId && !feed && !username) {
			return `nouser/explore/${pageIndex + 1}`
		}
	}
	const { data, size, setSize, isValidating, mutate } = useSWRInfinite(
		getKey,
		Postfetcher,
	)

	const onMore = () => {
		setSize(size + 1)
	}

	return (
		<>
			{auth.user ? (
				<AddPost
					movieId={movieId ? movieId : null}
					poster_path={poster_path ? poster_path : null}
				/>
			) : null}
			<Spacer mt={2} />
			{data?.map((page) =>
				page?.map((post) =>
					post.attributes.poster_path && !movieId ? (
						<Grid
							bgColor={'gray.100'}
							p={4}
							pr={1}
							pb={2}
							borderRadius="5px"
							mb={5}
							key={post.id}
							gridTemplateColumns="150px 1fr"
						>
							<Link href={`/movie/${post.attributes.movie_id}`}>
								<a>
									<Image
										src={`https://image.tmdb.org/t/p/w200/${post.attributes.poster_path}`}
										width={200}
										height={300}
										alt=""
									/>
								</a>
							</Link>
							<Post
								postId={post.id}
								attributes={post.attributes}
								mutate={mutate}
							/>
						</Grid>
					) : (
						<Post
							key={post.id}
							postId={post.id}
							attributes={post.attributes}
							mutate={mutate}
						/>
					),
				),
			)}
			{isValidating ? (
				<Flex justifyContent="center">
					<Spinner />
				</Flex>
			) : null}
			{data ? (
				data[data.length - 1].length === 0 ? null : (
					<Flex mt={10} mb={10} justifyContent="center" w="100%">
						<Button onClick={() => onMore()}>Load more</Button>
					</Flex>
				)
			) : null}
		</>
	)
}

export default Posts
