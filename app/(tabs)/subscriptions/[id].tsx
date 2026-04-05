import { Link, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'


const SubscriptionDetail = () => {
    const { id } = useLocalSearchParams()

    return (
        <View>
            <Text>SubscriptionDetail</Text>

            <Link href="/(tabs)/subscriptions" className="border rounded-full p-4 bg-accent">
                <Text className="text-xl font-bold text-white">
                    Back to Subscriptions
                </Text>
            </Link>

            <Text>{id}</Text>
        </View>
    )
}

export default SubscriptionDetail