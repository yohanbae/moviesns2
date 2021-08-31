import React, { useState, useEffect, useContext, createContext } from 'react'
import Parse from 'parse/dist/parse.min.js'

const authContext = createContext()

export function ProvideAuth({ children }) {
	const auth = useProvideAuth()
	return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
	return useContext(authContext)
}

function useProvideAuth() {
	const [user, setUser] =
		useState()
		// {
		// id:"zWiegTNzcJ",
		// attributes: {
		// username:  "yuri"
		// }}

	const signin = async (email, password) => {
		try {
			let user = await Parse.User.logIn(email, password)
			console.log('Logged in user', user)
			const currentUser = Parse.User.current()
			setUser(currentUser)
			return currentUser
		} catch (error) {
			console.error('Error while logging in user', error)
			return 'Error'
		}
	}
	const signup = async (username, email, password) => {
		const user = new Parse.User()
		user.set('username', username)
		user.set('email', email)
		user.set('password', password)
		user.set('avatar', null)

		try {
			let userResult = await user.signUp()
			console.log('User signed up', userResult)
			return { success: true, error: null }
		} catch (error) {
			return { success: false, error: error.message }
		}
	}
	const signout = async () => {
		await Parse.User.logOut()
		setUser(false)
	}

	const sendPasswordResetEmail = async (email) => {
		try {
			let result = await Parse.User.requestPasswordReset(email)
			console.log('Reset password email sent successfully')
			return { success: true, error: null }
		} catch (error) {
			console.error(
				'Error while creating request to reset user password',
				error,
			)
			return { success: false, error: error.message }
		}
	}

	useEffect(() => {
		const unsubscribe = Parse.User.current((user) => {
			if (user) {
				setUser(user)
			} else {
				setUser(false)
			}
		})
		return () => unsubscribe()
	}, [])

	return {
		user,
		signin,
		signup,
		signout,
		sendPasswordResetEmail,
	}
}
