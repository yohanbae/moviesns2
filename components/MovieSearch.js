import React, { useState } from 'react'
import { Input, InputRightElement, InputGroup } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'

const MovieSearch = () => {
	const router = useRouter()
	const [search, setSearch] = useState('')

	const onSearchKey = (e) => setSearch(e.target.value)
	const onEnter = (e) => {
		if (e.keyCode === 13) {
			router.push(`/search/${search}`)
		}
	}

	return (
		<InputGroup>
			<Input
				placeholder="Movie Search"
				value={search}
				onChange={onSearchKey}
				onKeyDown={onEnter}
			/>
			{/* <InputRightElement children={<SearchIcon color="black.500"></SearchIcon>} /> */}
		</InputGroup>
	)
}

export default MovieSearch
