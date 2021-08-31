import { useAuth } from '../utils/use-auth.js'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Posts from '../components/Post/Posts.js'
import Head from 'next/head'

// Shows every recent posts
const Explore = () => {
	const router = useRouter()
	const auth = useAuth()

	return (
		<>
			<Head>
				<title>MOVIE SNS</title>
				<meta name="description" content="MOVIE SNS" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Posts />
		</>
	)
}

export default Explore
