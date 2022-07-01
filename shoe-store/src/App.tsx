import { useState } from 'react';
import { Route, Routes } from 'react-router';

import Footer from 'components/Footer';
import Header from 'components/Header';
import { Products } from 'components/Products';
import { ProductDetail } from 'components/ProductDetail';
import { Cart } from 'components/Cart';

import { ICartItem } from 'models/CartItem';

import './App.css';

export default function App() {
	const [cartItems, setCartItems] = useState([] as ICartItem[]);

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
			const newCart = oldCart.map((cartItem) =>
				cartItem.sku === sku
					? { ...cartItem, quantity: newQuantity }
					: cartItem
			);
			return newCart;
		});
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
					</Routes>
				</main>
			</div>
			<Footer />
		</>
	);
}
