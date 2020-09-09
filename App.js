import React, { useState } from 'react'
import { AppLoading } from 'expo'
import { Provider } from 'react-redux'

import { NavigationContainer } from './navigation/NavigationContainer'
import { bootstrap } from './bootstrap'
import store from './store'

export default function App() {
    const [fontLoaded, setFontLoaded] = useState(false)

    if (!fontLoaded) {
        return (
            <AppLoading 
                startAsync={bootstrap}
                onFinish={() => setFontLoaded(true)}
                onError={error => console.log(error)}
            />
        )
    }

    return (
        <Provider store={store}>
            <NavigationContainer />
        </Provider>
    )
}