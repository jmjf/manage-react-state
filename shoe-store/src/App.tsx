import { Route, Routes } from 'react-router';

import Footer from 'components/Footer';
import Header from 'components/Header';
import { Products } from 'components/Products';
import { ProductDetail } from 'components/ProductDetail';
import { Cart } from 'components/Cart';
import { Checkout } from 'components/CheckoutClass';

import './App.css';
import { useCartContext } from 'hooks/useCartContext';

export default function App() {
	const { dispatchCartItemsAction } = useCartContext();

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
							element={<ProductDetail />}
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
		</>
	);
}
