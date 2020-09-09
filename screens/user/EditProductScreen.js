import React, { useState, useEffect, useCallback, useReducer } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, ScrollView, Platform, Alert, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

// UI Patern
import { CustomHeaderButton } from '../../components/UI/HeaderButton'
import { Input } from '../../components/UI/Input'

// Actions
import * as productActions from '../../store/actions/products'

import { COLORS } from '../../constants/Colors'

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE'

const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        }

        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        }

        let updatedFormIsValid = true


        return {
            formIsValid: updatedFormIsValid,
            inputValidities: updatedValidities,
            inputValues: updatedValues
        }
    }

    return state
}

export const EditProductScreen = props => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()

    const prodId = props.navigation.getParam('productId')

    const editedProduct = useSelector(state =>
        state.products.userProducts.find(prod => prod.id === prodId)    
    )

    const dispatch = useDispatch()

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: editedProduct ? editedProduct.title : '',
            imageUrl: editedProduct ? editedProduct.imageUrl : '',
            description: editedProduct ? editedProduct.description : '',
            price: ''
        },
        inputValidities: {
            title: editedProduct ? true : false,
            imageUrl: editedProduct ? true : false,
            description: editedProduct ? true : false,
            price: editedProduct ? true : false
        },
        formIsValid: editedProduct ? true : false
    })

    useEffect(() => {
        if (error) {
            Alert.alert('An error occurred!', error, [{ text: 'Okay' }])
        }
    }, [error])

    const submitHandler = useCallback(async () => {
        if (!formState.formIsValid) {
            Alert.alert('Wrong input!', 'Please check the errors in the form.', [
                { text: 'Okay' }
            ])
            return
        }

        setError(null)
        setIsLoading(true)

        try {
            if (editedProduct) {
                await dispatch(
                    productActions.updateProduct(
                        prodId,
                        formState.inputValues.title,
                        formState.inputValues.description,
                        formState.inputValues.imageUrl
                    )
                )
        } else {
            await dispatch(
                productActions.createProduct(
                    formState.inputValues.title,
                    formState.inputValues.description,
                    formState.inputValues.imageUrl,
                    +formState.inputValues.price
                )
            )
        } 

          props.navigation.goBack()
        } catch (error) {
          setError(error.message)
        }
    
        setIsLoading(false)
        
    }, [dispatch, prodId, formState])

    useEffect(() => {
        props.navigation.setParams({ submit: submitHandler })
    }, [submitHandler])

    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({ 
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
        })
    }, [dispatchFormState])

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size='large' color={COLORS.PRIMARY_COLOR} />
            </View>
        )
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={100}>
            <ScrollView>
                <View style={{ margin: 20 }}>
                    <Input
                        id="title"
                        label="Title"
                        errorText="Please enter a valid title!"
                        keyboardType="default"
                        autoCapitalize="sentences"
                        autoCorrect
                        returnKeyType="next"
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.title : ''}
                        initiallyValid={!!editedProduct}
                        required
                    />
                    <Input
                        id="imageUrl"
                        label="Image Url"
                        errorText="Please enter a valid image url!"
                        keyboardType="default"
                        returnKeyType="next"
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.imageUrl : ''}
                        initiallyValid={!!editedProduct}
                        required
                    />
                    {editedProduct ? null : (
                    <Input
                        id="price"
                        label="Price"
                        errorText="Please enter a valid price!"
                        keyboardType="decimal-pad"
                        returnKeyType="next"
                        onInputChange={inputChangeHandler}
                        required
                        min={0.1}
                        />
                    )}
                    <Input
                        id="description"
                        label="Description"
                        errorText="Please enter a valid description!"
                        keyboardType="default"
                        autoCapitalize="sentences"
                        autoCorrect
                        multiline
                        numberOfLines={3}
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.description : ''}
                        initiallyValid={!!editedProduct}
                        required
                        minLength={5}
                    />
                </View> 
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

EditProductScreen.navigationOptions = navData => {
    const submitFn = navData.navigation.getParam('submit')

    return {
        headerTitle: navData.navigation.getParam('productId')
            ? 'Edit Product'
            : 'Add Product',
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item
                    title="Save"
                    iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
                    onPress={submitFn}
                />
            </HeaderButtons>
        )
    }
}