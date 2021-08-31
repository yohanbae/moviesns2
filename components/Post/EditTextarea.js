import { Textarea, Grid, Button } from '@chakra-ui/react'
import { useState } from 'react'

const EditTextarea = ({ onUpdate, onClose, attributes }) => {
	const [newComment, setNewComment] = useState(attributes.comment)

	return (
		<div>
			<>
				<Textarea
					value={newComment}
					onChange={(e) => setNewComment(e.target.value)}
				></Textarea>
				<Grid my={5} gridTemplateColumns="1fr 1fr" gap={5}>
					<Button size="sm" onClick={() => onUpdate(newComment)}>
						Update
					</Button>
					<Button size="sm" onClick={onClose}>
						Close
					</Button>
				</Grid>
			</>
		</div>
	)
}
export default EditTextarea
