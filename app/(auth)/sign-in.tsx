import { Link } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

const SignIn = () => {
    return (
        <View>
            <Text>SignIn</Text>

            <Link href="/(auth)/sign-up" className="border rounded-full p-4 bg-accent">
                <Text className="text-xl font-bold text-white">
                    Sign Up
                </Text>
            </Link>
        </View>
    )
}

export default SignIn