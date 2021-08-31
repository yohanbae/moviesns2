import { useAuth } from '../utils/use-auth'
import { Box, SimpleGrid } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Link from 'next/link'

const Navbar = () => {
	const auth = useAuth()
	const router = useRouter()

	return (
		<Box bg="blackAlpha.800" w="100%" py={2} px={10} color="white">
			<SimpleGrid columns={2} spacing={10}>
				<Box>
					<Link href="/movies">
						<a>Movie SNS</a>
					</Link>
				</Box>
				<Box textAlign="right">
					<Box
						display="inline"
						mr={5}
						onClick={() => router.push('/movies')}
						cursor="pointer"
					>
						Movies
					</Box>
					<Box
						display="inline"
						mr={5}
						onClick={() => router.push('/explore')}
						cursor="pointer"
					>
						Explore
					</Box>
					{auth.user ? (
						<>
							<Box
								display="inline"
								mr={5}
								onClick={() => router.push('/feed')}
								cursor="pointer"
							>
								Feed
							</Box>
							<Box
								display="inline"
								mr={5}
								onClick={() =>
									router.push(`/user/${auth.user.attributes.username}`)
								}
								cursor="pointer"
							>
								My Page
							</Box>
							<Box
								display="inline"
								onClick={() => auth.signout()}
								cursor="pointer"
							>
								Logout
							</Box>
						</>
					) : (
						<>
							<Box
								display="inline"
								mr={5}
								onClick={() => router.push('/login')}
								cursor="pointer"
							>
								Login
							</Box>
							<Box
								display="inline"
								onClick={() => router.push('/signup')}
								cursor="pointer"
							>
								Register
							</Box>
						</>
					)}
				</Box>
			</SimpleGrid>
		</Box>
	)
}
export default Navbar
