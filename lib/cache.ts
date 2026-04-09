import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

type TokenCache = {
  getToken: (key: string) => Promise<string | null>
  saveToken: (key: string, value: string) => Promise<void>
}

const createTokenCache = (): TokenCache => {
  return {
    async getToken(key: string) {
      try {
        const item = await SecureStore.getItemAsync(key)
        if (item) {
          console.log(`${key} was used 🔐 \n`)
        } else {
          console.log('No values stored under key: ' + key)
        }
        return item
      } catch (error) {
        console.error('SecureStore get item error: ', error)
        await SecureStore.deleteItemAsync(key)
        return null
      }
    },
    async saveToken(key: string, value: string) {
      try {
        return SecureStore.setItemAsync(key, value)
      } catch (err) {
        return
      }
    },
  }
}

// SecureStore is not supported on the web
export const tokenCache = Platform.OS !== 'web' ? createTokenCache() : undefined
