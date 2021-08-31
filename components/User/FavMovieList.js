import {
	Popover,
	PopoverTrigger,
	PopoverContent,
	Button,
	Grid,
} from '@chakra-ui/react'
import Link from 'next/link'
import Image from 'next/image'

export const FavMovieList = ({ data }) => (
	<Popover>
		<PopoverTrigger>
			<Button size="xs">{data?.length} movie</Button>
		</PopoverTrigger>
		<PopoverContent>
			{data?.map((v) => (
				<Grid
					key={v.id}
					gridTemplateColumns="50px 1fr"
					columnGap={5}
					alignItems="center"
					fontSize="10px"
				>
					<Image
						width={50}
						height={50}
						alt=""
						src={`https://image.tmdb.org/t/p/w200/${v.attributes.poster_path}`}
					/>
					<Link href={`/movie/${v.attributes.movieId}`}>
						<a>{v.attributes.title}</a>
					</Link>
				</Grid>
			))}
		</PopoverContent>
	</Popover>
)

export default FavMovieList
