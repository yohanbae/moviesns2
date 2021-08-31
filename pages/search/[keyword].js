import useSWRInfinite from 'swr/infinite'
import Link from 'next/link'
import axios from 'axios'
import { Flex, Grid, Box, Spinner, Button } from '@chakra-ui/react'
import MovieSearch from '../../components/MovieSearch'
import Head from 'next/head'
import Image from 'next/image'

const Search = ({ keyword }) => {
	const fetcher = async (url) => {
		let movies = await axios.get(url)
		return movies.data.results
	}

	const getKey = (pageIndex, previousPageData) => {
		if (previousPageData && !previousPageData.length) return null // if the scroll reached the end
		return `https://api.themoviedb.org/3/search/movie?api_key=${
			process.env.NEXT_PUBLIC_MB_API
		}&query=${keyword}&page=${pageIndex + 1}`
	}

	const { data, size, setSize, isValidating } = useSWRInfinite(getKey, fetcher)

	return (
		<>
			<Head>
				<title>MOVIE SNS</title>
				<meta name="description" content="MOVIE SNS" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<MovieSearch />
			<Grid
				templateColumns="repeat(5, 1fr)"
				gap={6}
				rowGap={10}
				paddingTop={10}
			>
				{data?.map((page) =>
					page?.map((movie) => (
						<Box key={movie.id}>
							<Link href={`/movie/${movie.id}`}>
								<a>
									<Image
										alt=""
										src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
										width={200}
										height={300}
									/>
									{movie.title}
								</a>
							</Link>
						</Box>
					)),
				)}
			</Grid>
			{isValidating ? (
				<Flex justifyContent="center">
					<Spinner />
				</Flex>
			) : null}

			<Flex mt={10} mb={10} justifyContent="center" w="100%">
				<Button onClick={() => setSize(size + 1)}>Load more</Button>
			</Flex>
		</>
	)
}

export default Search

export async function getServerSideProps(context) {
	const keyword = context.params.keyword
	return {
		props: {
			keyword,
		},
	}
}
