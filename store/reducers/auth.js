import { AUTHENTICATE, LOGOUT } from "../actions/auth"

// AsyncStorage
import { AsyncStorage } from 'react-native'

const initialState = {
    token: null,
    userId: null
}


const userHandler = async () => {
    const userData = await AsyncStorage.getItem('userData')

    const transformedData = JSON.parse(userData)
    
    const { token, userId } = transformedData

    if (token && userId) {
        initialState.token = token
        initialState.userId = userId
    }
}

userHandler()


export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTHENTICATE:
            return {
                token: action.token,
                userId: action.userId
            }
        case LOGOUT:
            return initialState
        // case SIGNUP:
        //     return {
        //         token: action.token,
        //         userId: action.userId
        //     }
        default:
            return state
    }
}