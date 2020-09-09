import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, FlatList, Platform, ActivityIndicator, Text } from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

// UI Patern
import { CustomHeaderButton } from '../../components/UI/HeaderButton'
import { OrderItem } from '../../components/shop/OrderItem'

import * as orderActions from '../../store/actions/orders'

import { COLORS } from '../../constants/Colors'

export const OrdersScreen = props => {
    const [isLoading, setIsLoading] = useState(false)

    const orders = useSelector(state => state.orders.orders)
    const dispatch = useDispatch()

    useEffect(() => {
        setIsLoading(true)

        dispatch(orderActions.fetchOrders()).then(() => {
            setIsLoading(false)
        })
    }, [dispatch])

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.PRIMARY_COLOR} />
            </View>
        )
    }

    if (orders.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>No order found, maybe start ordering some?</Text>
            </View>
        )
    }

    return (
        <FlatList 
            data={orders}
            keyExtractor={item => item.id}
            renderItem={itemData => (
                <OrderItem 
                    amount={itemData.item.totalAmount}
                    date={itemData.item.readableDate}
                    items={itemData.item.items}
                />
            )}
        />
    )
}

OrdersScreen.navigationOptions = navData => {

    return {
        headerTitle: 'Your Orders',
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item 
                    title='Menu'
                    iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                    onPress={() => {
                        navData.navigation.toggleDrawer()
                    }}
                />
            </HeaderButtons>
        )
    }
}