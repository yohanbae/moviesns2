import { useAuth } from '../utils/use-auth.js'
import { useRouter } from 'next/router'
import { Field, Form, Formik, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Box, Button, Flex, Heading, Alert, AlertIcon } from '@chakra-ui/react'
import { useState } from 'react'
import Head from 'next/head'

const Signup = () => {
	const router = useRouter()
	const auth = useAuth()

	if (auth.user) router.push('/')

	const [errorMsg, setErrorMsg] = useState('')
	const [isAlert, setIsAlert] = useState(false)

	const SignupSchema = Yup.object().shape({
		username: Yup.string()
			.min(2, 'Too Short!')
			.max(70, 'Too Long!')
			.required('Required'),
		email: Yup.string().required('Required').email('Invalid email'),
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
							initialValues={{ username: '', email: '', password: '' }}
							validationSchema={SignupSchema}
							onSubmit={async ({ username, email, password }) => {
								try {
									let res = await auth.signup(username, email, password)
									if (res.success) {
										router.push('/login')
									} else {
										setIsAlert(true)
										setErrorMsg(res.error)
									}
								} catch (e) {
									console.log(e.message)
									setErrorMsg(`Something wrong: ${e.message}`)
								}
							}}
						>
							{({ errors, touched }) => (
								<Form>
									<Heading as="h3" size="lg" mb="5" color="tomato">
										Singup
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
											id="email"
											name="email"
											placeholder="Email"
										/>
										<ErrorMessage
											name="email"
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

									<Box>
										<Button mt={4} colorScheme="teal" type="submit">
											Submit
										</Button>
										{isAlert ? (
											<Alert status="warning">
												<AlertIcon />
												Wrong {errorMsg}
											</Alert>
										) : null}
									</Box>
								</Form>
							)}
						</Formik>
					</Box>
				) : (
					<div>You are already logged In</div>
				)}
			</Flex>
		</>
	)
}
export default Signup
