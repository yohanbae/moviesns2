import Head from 'next/head'
import Posts from '../../components/Post/Posts'
import UserDisplay from '../../components/User/UserDisplay'

const UserPage = ({ username }) => {
	return (
		<>
			<Head>
				<title>MOVIE SNS</title>
				<meta name="description" content="MOVIE SNS" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<UserDisplay username={username} small={false} />
			<Posts username={username} />
		</>
	)
}

export default UserPage

export async function getServerSideProps(context) {
	const username = context.params.username
	return {
		props: {
			username,
		},
	}
}
