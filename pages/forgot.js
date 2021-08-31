import Parse from 'parse/dist/parse.min.js'
import { useState } from 'react'
import { Field, Form, Formik, ErrorMessage } from 'formik'
import { useAuth } from '../utils/use-auth'
import * as Yup from 'yup'
import { Box, Flex, Heading, Button } from '@chakra-ui/react'
import router from 'next/router'
import Head from 'next/head'

const Forgot = () => {
	const auth = useAuth()

	const formSchema = Yup.object().shape({
		email: Yup.string().email('Invalid email').required('Required'),
	})

	return (
		<>
			<Head>
				<title>MOVIE SNS</title>
				<meta name="description" content="MOVIE SNS" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Formik
				initialValues={{ email: '' }}
				validationSchema={formSchema}
				onSubmit={async ({ email }) => {
					console.log('processing', email)
					let res = await auth.sendPasswordResetEmail(email)
					if (res.success) {
						alert('Reset password email sent successfully')
						router.push('/login')
					} else {
						console.log('something wrong', res.error)
					}
				}}
			>
				{({ errors, touched }) => (
					<Form>
						<Heading as="h3" size="lg" mb="5" color="tomato">
							Reset Password
						</Heading>
						<Box>
							<Field
								className="myfield"
								id="email"
								name="email"
								placeholder="Enter your email address to reset password"
							/>
							<ErrorMessage
								name="email"
								render={(msg) => <div className="error-msg">{msg}</div>}
							/>
						</Box>

						<Flex alignItems="center">
							<Button mt={4} colorScheme="teal" type="submit">
								Submit
							</Button>
						</Flex>
					</Form>
				)}
			</Formik>
		</>
	)
}
export default Forgot
