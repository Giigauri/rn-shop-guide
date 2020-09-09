import * as Font from 'expo-font'

export async function bootstrap() {
    try {
        await Font.loadAsync({
            'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
            'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
        })

    } catch (error) {
        console.log('Error: ', error)
    }
}