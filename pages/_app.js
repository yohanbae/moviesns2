// import './sass.css'
import Parse from 'parse/dist/parse.min.js'
import { ProvideAuth } from '../utils/use-auth.js'
import { ChakraProvider, Box } from '@chakra-ui/react'
import Navbar from '../components/Navbar'

// Parse: Back4App Setup
const PARSE_APPLICATION_ID = process.env.NEXT_PUBLIC_PARSE_APPLICATION_ID
const PARSE_HOST_URL = process.env.NEXT_PUBLIC_PARSE_HOST_URL
const PARSE_JAVASCRIPT_KEY = process.env.NEXT_PUBLIC_PARSE_JAVASCRIPT_KEY

if (typeof window !== 'undefined') {
	Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY)
	Parse.serverURL = PARSE_HOST_URL
}

function MyApp({ Component, pageProps }) {
	return (
		<ChakraProvider>
			<ProvideAuth>
				<Navbar />
				<Box p={10}>
					<Component {...pageProps} />
				</Box>
			</ProvideAuth>
		</ChakraProvider>
	)
}

export default MyApp
