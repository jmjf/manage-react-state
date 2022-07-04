import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router';

import Footer from 'components/Footer';
import Header from 'components/Header';
import { Products } from 'components/Products';
import { ProductDetail } from 'components/ProductDetail';
import { Cart } from 'components/Cart';
import { Checkout } from 'components/Checkout';

import { ICartItem } from 'models/CartItem';

import './App.css';

// overkill for a single value, maybe
// it's used in more than one place, so this makes it easier to adjust
// if we end up with more keys, it's a wise move
const LOCAL_STORAGE_KEYS = {
	CART_ITEMS: 'cartItems',
};

export default function App() {
	const [cartItems, setCartItems] = useState(initializeCartItems);

	useEffect(() => {
		localStorage.setItem(
			LOCAL_STORAGE_KEYS.CART_ITEMS,
			JSON.stringify(cartItems)
		);
	}, [cartItems]);

	function initializeCartItems(): ICartItem[] {
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
	}

	function addToCart(id: number, sku: string): void {
		setCartItems((oldCart) => {
			// I need a copy of the cart so I can setState anyway, so first copy and try to update as we do
			const newCart = oldCart.map((cartItem) =>
				cartItem.sku === sku
					? { ...cartItem, quantity: cartItem.quantity + 1 }
					: cartItem
			);
			// If the item isn't found in the new cart
			if (!newCart.find((cartItem) => cartItem.sku === sku))
				newCart.push({ id, sku, quantity: 1 });
			return newCart;
		});
	}

	function updateQuantity(sku: string, newQuantity: number): void {
		setCartItems((oldCart) => {
			if (newQuantity === 0) {
				return oldCart.filter((cartItem) => cartItem.sku !== sku);
			} else {
				return oldCart.map((cartItem) =>
					cartItem.sku === sku
						? { ...cartItem, quantity: newQuantity }
						: cartItem
				);
			}
		});
	}

	function emptyCartItems(): void {
		setCartItems([] as ICartItem[]);
	}

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
									cartItems={cartItems}
									addToCart={addToCart}
								/>
							}
						/>
						<Route
							path="/cart"
							element={
								<Cart
									cartItems={cartItems}
									updateQuantity={updateQuantity}
								/>
							}
						/>
						<Route
							path="/checkout"
							element={
								<Checkout
									cartItems={cartItems}
									emptyCartItems={emptyCartItems}
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
