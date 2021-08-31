import { useAuth } from '../utils/use-auth.js'
import { useRouter } from 'next/router'
import { Field, Form, Formik, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Box, Button, Flex, Heading, Spacer } from '@chakra-ui/react'
import Link from 'next/link'
import { useEffect } from 'react'
import Head from 'next/head'

const Login = () => {
	const router = useRouter()
	const auth = useAuth()

	useEffect(() => {
		if (auth.user) router.push('/')
	}, [auth, router])

	const SignupSchema = Yup.object().shape({
		username: Yup.string()
			.min(2, 'Too Short!')
			.max(70, 'Too Long!')
			.required('Required'),
		password: Yup.string().required('Required'),
	})

	return (
		<>
			<Head>
				<title>MOVIE SNS</title>
				<meta name="description" content="MOVIE SNS" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Flex w="100%" justifyContent="center" pt={10}>
				{!auth.user ? (
					<Box w="50%">
						<Formik
							initialValues={{ username: '', password: '' }}
							validationSchema={SignupSchema}
							onSubmit={async ({ username, password }) => {
								auth.signin(username, password)
							}}
						>
							{({ errors, touched }) => (
								<Form>
									<Heading as="h3" size="lg" mb="5" color="tomato">
										Login
									</Heading>
									<Box>
										<Field
											className="myfield"
											id="username"
											name="username"
											placeholder="Username"
										/>
										<ErrorMessage
											name="username"
											render={(msg) => <div className="error-msg">{msg}</div>}
										/>
									</Box>

									<Box>
										<Field
											className="myfield"
											id="password"
											name="password"
											placeholder="Password"
											type="password"
										/>
										<ErrorMessage
											name="password"
											render={(msg) => <div className="error-msg">{msg}</div>}
										/>
									</Box>

									<Flex alignItems="center">
										<Button mt={4} colorScheme="teal" type="submit">
											Submit
										</Button>
										<Spacer />
										<Link size="10" href="/forgot">
											Forgot my password
										</Link>
									</Flex>
								</Form>
							)}
						</Formik>
					</Box>
				) : null}
			</Flex>
		</>
	)
}
export default Login
