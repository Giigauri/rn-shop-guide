import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, FlatList, Platform, Button, ActivityIndicator, Text } from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

// Actions
import * as cartActions from '../../store/actions/cart'
import * as productActions from '../../store/actions/products'

// UI Patern
import { ProductItem } from '../../components/shop/ProductItem'
import { CustomHeaderButton } from '../../components/UI/HeaderButton'

import { COLORS } from '../../constants/Colors'

export const ProductsOverviewScreen = props => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()
    const [isRefreshing, setIsRefreshing] = useState(false)
    
    const products = useSelector(state => state.products.availableProducts)
    
    const dispatch = useDispatch()

    const loadProducts = useCallback(async () => {
        setError(null)
        setIsRefreshing(true)

        try {
            await dispatch(productActions.fetchProducts())
        } catch (error) {
            setError(error.message)
        }

        setIsRefreshing(false)
    }, [dispatch, setIsLoading, setError])

    useEffect(() => {
        const willFocusSub = props.navigation.addListener(
            'willFocus',
            loadProducts
        )

        return () => {
            willFocusSub.remove()
        }
    }, [loadProducts])

    useEffect(() => {
        setIsLoading(true)

        loadProducts().then(() => {
            setIsLoading(false)
        })
    }, [dispatch, loadProducts])

    const selectItemHandler = (id, title) => {
        props.navigation.navigate('ProductDetail', {
            productId: id,
            productTitle: title
        })
    }

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.PRIMARY_COLOR} />
            </View>
        )
    }

    if (!isLoading && products.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>No products found. Maybe start adding some!</Text>
            </View>
        )
    }

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>An error occurred!</Text>
                <Button title='Try again' onPress={loadProducts} color={COLORS.PRIMARY_COLOR} />
            </View>
        )
    }

    return (
        <FlatList
            onRefresh={loadProducts}
            refreshing={isRefreshing}
            data={products}
            keyExtractor={item => item.id}
            renderItem={itemData => (
                <ProductItem
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onSelect={() => {
                        selectItemHandler(itemData.item.id, itemData.item.title);
                    }}
                >
                    <Button
                        color={COLORS.PRIMARY_COLOR}
                        title="View Details"
                        onPress={() => {
                            selectItemHandler(itemData.item.id, itemData.item.title);
                        }}
                    />
                    <Button
                        color={COLORS.PRIMARY_COLOR}
                        title="To Cart"
                        onPress={() => {
                            dispatch(cartActions.addToCart(itemData.item));
                        }}
                    />
                </ProductItem>
            )}
        />
    )
}

ProductsOverviewScreen.navigationOptions = navData => {
    return {
        headerTitle: 'All Proucts',
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item
                    title="Menu"
                    iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                    onPress={() => {
                        navData.navigation.toggleDrawer();
                    }}
                />
            </HeaderButtons>
        ),
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item 
                    title='Cart'
                    iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                    onPress={() => {
                        navData.navigation.navigate('Cart')
                    }}
                />
            </HeaderButtons>
        )
    }
}