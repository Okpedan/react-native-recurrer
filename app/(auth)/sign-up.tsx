import { useSignUp } from '@clerk/expo'
import { Link, useRouter } from 'expo-router'
import { styled } from 'nativewind'
import React, { useState } from 'react'
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context'

const SafeAreaView = styled(RNSafeAreaView)

const SignUp = () => {
    const { signUp } = useSignUp()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')
    const [code, setCode] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [loading, setLoading] = useState(false)

    const onSignUpPress = async () => {
        if (!signUp) return
        setLoading(true)
        setErrorMsg('')

        try {
            await signUp.password({ emailAddress, password })

            if (
                signUp.status === 'missing_requirements' &&
                signUp.unverifiedFields.includes('email_address')
            ) {
                await signUp.verifications.sendEmailCode()
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2))
            setErrorMsg(err.errors?.[0]?.message || 'An error occurred during sign up.')
        } finally {
            setLoading(false)
        }
    }

    const onPressVerify = async () => {
        if (!signUp) return
        setLoading(true)
        setErrorMsg('')

        try {
            await signUp.verifications.verifyEmailCode({ code })

            if (signUp.status === 'complete') {
                await signUp.finalize({
                    navigate: () => router.replace('/(tabs)'),
                })
            } else {
                console.error(JSON.stringify(signUp, null, 2))
                setErrorMsg('Verification failed. Please check the code and try again.')
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2))
            setErrorMsg(err.errors?.[0]?.message || 'Invalid verification code.')
        } finally {
            setLoading(false)
        }
    }

    const isPendingVerification =
        signUp?.status === 'missing_requirements' &&
        signUp.unverifiedFields.includes('email_address')

    return (
        <SafeAreaView className="auth-safe-area">
            <ScrollView className="auth-scroll" showsVerticalScrollIndicator={false}>
                <View className="auth-content">
                    <View className="auth-brand-block">
                        <View className="auth-logo-wrap">
                            <Image
                                source={require('@/assets/icons/logo.png')}
                                style={{ width: 64, height: 64 }}
                                resizeMode="contain"
                            />
                        </View>
                        <Text className="auth-title">Create an account</Text>
                        <Text className="auth-subtitle">
                            {isPendingVerification
                                ? 'Enter the verification code sent to your email'
                                : 'Sign up to start managing your subscriptions'}
                        </Text>
                    </View>

                    <View className="auth-card">
                        <View className="auth-form">
                            {errorMsg ? <Text className="auth-error">{errorMsg}</Text> : null}

                            {!isPendingVerification ? (
                                <>
                                    <View className="auth-field">
                                        <Text className="auth-label">Email</Text>
                                        <TextInput
                                            autoCapitalize="none"
                                            value={emailAddress}
                                            placeholder="Enter your email"
                                            placeholderTextColor="rgba(0,0,0,0.4)"
                                            className="auth-input"
                                            onChangeText={setEmailAddress}
                                        />
                                    </View>

                                    <View className="auth-field">
                                        <Text className="auth-label">Password</Text>
                                        <TextInput
                                            value={password}
                                            placeholder="Enter your password"
                                            placeholderTextColor="rgba(0,0,0,0.4)"
                                            secureTextEntry={true}
                                            className="auth-input"
                                            onChangeText={setPassword}
                                        />
                                    </View>

                                    <TouchableOpacity
                                        className={`auth-button ${loading ? 'auth-button-disabled' : ''}`}
                                        onPress={onSignUpPress}
                                        disabled={loading}
                                    >
                                        <Text className="auth-button-text">
                                            {loading ? 'Creating...' : 'Sign up'}
                                        </Text>
                                    </TouchableOpacity>

                                    <View nativeID="clerk-captcha" />
                                </>
                            ) : (
                                <>
                                    <View className="auth-field">
                                        <Text className="auth-label">Verification Code</Text>
                                        <TextInput
                                            value={code}
                                            placeholder="Enter code"
                                            placeholderTextColor="rgba(0,0,0,0.4)"
                                            className="auth-input"
                                            onChangeText={setCode}
                                        />
                                    </View>

                                    <TouchableOpacity
                                        className={`auth-button ${loading ? 'auth-button-disabled' : ''}`}
                                        onPress={onPressVerify}
                                        disabled={loading}
                                    >
                                        <Text className="auth-button-text">
                                            {loading ? 'Verifying...' : 'Verify'}
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>

                        {!isPendingVerification && (
                            <View className="auth-link-row">
                                <Text className="auth-link-copy">Already have an account?</Text>
                                <Link href="/(auth)/sign-in" asChild>
                                    <TouchableOpacity>
                                        <Text className="auth-link">Sign in</Text>
                                    </TouchableOpacity>
                                </Link>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SignUp