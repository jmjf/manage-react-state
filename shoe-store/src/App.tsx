import { useEffect, useReducer } from 'react';
import { Route, Routes } from 'react-router';

import Footer from 'components/Footer';
import Header from 'components/Header';
import { Products } from 'components/Products';
import { ProductDetail } from 'components/ProductDetail';
import { Cart } from 'components/Cart';
import { Checkout } from 'components/Checkout';

import { ICartItem } from 'models/CartItem';

import './App.css';
import { cartReducer } from 'reducers/cartReducer';

// overkill for a single value, maybe
// it's used in more than one place, so this makes it easier to adjust
// if we end up with more keys, it's a wise move
const LOCAL_STORAGE_KEYS = {
	CART_ITEMS: 'cartItems',
};

// IIFE to set up inital cart items
const initialCartItems = ((): ICartItem[] => {
	const getItemResult = localStorage.getItem(LOCAL_STORAGE_KEYS.CART_ITEMS);
	if (
		getItemResult === null ||
		getItemResult === undefined ||
		getItemResult === ''
	)
		return [];

	try {
		const cartItems = JSON.parse(getItemResult);
		if (!Array.isArray(cartItems)) return [];
		return cartItems;
	} catch (e) {
		console.log('ERROR: failed reading cart data; returning empty cart');
		return [];
	}
})();

export default function App() {
	const [cartItems, dispatchCartItemsAction] = useReducer(
		cartReducer,
		initialCartItems
	);

	useEffect(() => {
		localStorage.setItem(
			LOCAL_STORAGE_KEYS.CART_ITEMS,
			JSON.stringify(cartItems)
		);
	}, [cartItems]);

	return (
		<>
			<div className="content">
				<Header />
				<main>
					<Routes>
						<Route
							path="/"
							element={<h1>Welcome to Carved Rock Fitness</h1>}
						/>
						<Route
							path="/:category"
							element={<Products />}
						/>
						<Route
							path="/:category/:id"
							element={
								<ProductDetail
									dispatchCartItemsAction={dispatchCartItemsAction}
								/>
							}
						/>
						<Route
							path="/cart"
							element={
								<Cart
									cartItems={cartItems}
									dispatchCartItemsAction={dispatchCartItemsAction}
								/>
							}
						/>
						<Route
							path="/checkout"
							element={
								<Checkout
									dispatchCartItemsAction={dispatchCartItemsAction}
								/>
							}
						/>
					</Routes>
				</main>
			</div>
			<Footer />
		</>
	);
}
