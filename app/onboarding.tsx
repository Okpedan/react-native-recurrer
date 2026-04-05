import { Link } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

const Onboarding = () => {
    return (
        <View className="flex-1 items-center justify-center bg-background">
            <Text className="text-xl font-bold text-primary">
                Welcome to Onboarding!
            </Text>

            <Link href={"/" as any} className="border rounded-full p-4 bg-accent">
                <Text className="text-xl font-bold text-white">
                    Go to Home
                </Text>
            </Link>
        </View>
    )
}

export default Onboarding