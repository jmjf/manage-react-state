import { useEffect, useReducer } from 'react';
import { Route, Routes } from 'react-router';

import Footer from 'components/Footer';
import Header from 'components/Header';
import { Products } from 'components/Products';
import { ProductDetail } from 'components/ProductDetail';
import { Cart } from 'components/Cart';
import { Checkout } from 'components/Checkout';

import './App.css';
import { CartContextProvider } from 'contexts/CartContext';

export default function App() {
	return (
		<CartContextProvider>
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
							element={<Cart />}
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
		</CartContextProvider>
	);
}
