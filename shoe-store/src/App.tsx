import { Route, Routes } from 'react-router';

import Footer from 'components/Footer';
import Header from 'components/Header';
import { Products } from 'components/Products';
import { Cart } from 'components/Cart';
import { Checkout } from 'components/CheckoutClass';

import './App.css';
import { useCartContext } from 'hooks/useCartContext';
import { ProductDetailWrapper } from 'components/ProductDetailClass';

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
							element={<ProductDetailWrapper />}
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
