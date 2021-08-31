import axios from 'axios'
import useSwr from 'swr'
import Posts from '../../components/Post/Posts'
import { Grid, Box } from '@chakra-ui/react'
import FavMovie from '../../components/FavMovie'
import Head from 'next/head'
import Image from 'next/image'
import { useAuth } from '../../utils/use-auth'

const Movie = ({ id }) => {
	const auth = useAuth()

	const fetcher = async (url) => {
		const res = await axios.get(url)
		return res.data
	}
	const { data, isValidating } = useSwr(
		`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_MB_API}`,
		fetcher,
	)

	return (
		<>
			<Head>
				<title>MOVIE SNS</title>
				<meta name="description" content="MOVIE SNS" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{isValidating ? <div>Loading</div> : null}
			{data ? (
				<Grid gridTemplateColumns="1fr 1fr" gap={10}>
					<Box>
						<Image
							alt="mv"
							src={`https://image.tmdb.org/t/p/original/${data.poster_path}`}
							width={400}
							height={500}
						/>
						{auth?.user ? (
							<FavMovie
								movieId={id}
								title={data.title}
								poster_path={data.poster_path}
							/>
						) : null}
						<Box fontSize="20px">{data.title}</Box>
						<Box my={5}>{data.overview}</Box>
					</Box>
					<Box>
						<Posts movieId={id} poster_path={data.poster_path} />
					</Box>
				</Grid>
			) : null}
		</>
	)
}

export const getServerSideProps = async (context) => {
	return {
		props: { id: context.params.id },
	}
}

export default Movie
