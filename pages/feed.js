import { useAuth } from '../utils/use-auth.js'
import { useRouter } from 'next/router'
import Posts from '../components/Post/Posts.js'
import { useEffect } from 'react'
import Head from 'next/head'

// This page shows User's subscribition
const Myfeed = () => {
	const router = useRouter()
	const auth = useAuth()

	useEffect(() => {
		if (auth) {
			if (!auth.user) router.push('/login')
		}
	}, [auth, router])

	return (
		<>
			<Head>
				<title>MOVIE SNS</title>
				<meta name="description" content="MOVIE SNS EXPLORE" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{auth.user ? (
				<Posts feed={auth?.user.attributes.username} />
			) : (
				<div>Login Required</div>
			)}
		</>
	)
}

export default Myfeed
