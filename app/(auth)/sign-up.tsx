import { Link } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

const SignUp = () => {
    return (
        <View>
            <Text>Create an account</Text>

            <Link href="/(auth)/sign-in" className="border rounded-full p-4 bg-accent">
                <Text className="text-xl font-bold text-white">
                    Sign In
                </Text>
            </Link>
        </View>
    )
}

export default SignUp