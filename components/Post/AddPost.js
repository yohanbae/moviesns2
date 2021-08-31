import { Field, Form, Formik, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Box, Button, Grid } from '@chakra-ui/react'
import useSwr, { useSWRInfinite, trigger } from 'swr'
import { useAuth } from '../../utils/use-auth'
import Parse from 'parse/dist/parse.min.js'
import { Postfetcher } from '../../fetchers/postFetcher'

const AddPost = ({ movieId, poster_path }) => {
	const auth = useAuth()

	const getKey = (pageIndex, previousPageData) => {
		if (previousPageData && !previousPageData.length) return null // reached the end

		// Display by MovieID
		if (movieId) {
			return `${movieId}/movie/${pageIndex + 1}`
		} else {
			return `${auth.user.id}/user/${pageIndex + 1}`
		}
	}

	const { data, mutate } = useSWRInfinite(getKey, Postfetcher)

	const submitPost = async (comment) => {
		const Post = new Parse.Object('MoviePost')
		Post.set('comment', comment)
		Post.set('movie_id', movieId)
		Post.set('user_id', auth.user.id)
		Post.set('username', auth.user.attributes.username)
		Post.set('poster_path', poster_path)
		await Post.save()

		mutate(data, false)
		mutate()
	}

	const SignupSchema = Yup.object().shape({
		comment: Yup.string().min(20, 'Too Short!').required('Required'),
	})

	return (
		<Formik
			initialValues={{ comment: '' }}
			validationSchema={SignupSchema}
			s
			onSubmit={async ({ comment }, { resetForm }) => {
				await submitPost(comment)
				resetForm()
			}}
		>
			{({ errors, touched, isSubmitting }) => (
				<Form>
					<Grid gridTemplateColumns="1fr 100px">
						<Box h="100%">
							<Field
								h="100%"
								as="textarea"
								className="mytextarea"
								id="comment"
								name="comment"
								placeholder="Your thoughts on the movie"
							/>
						</Box>
						<Button
							colorScheme="teal"
							type="submit"
							h="50px"
							mt="12px"
							size="xs"
							isLoading={isSubmitting}
						>
							Submit
						</Button>
					</Grid>
					<ErrorMessage
						name="comment"
						render={(msg) => <div className="error-msg">{msg}</div>}
					/>
				</Form>
			)}
		</Formik>
	)
}

export default AddPost
