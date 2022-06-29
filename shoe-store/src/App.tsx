import { Route, Routes } from 'react-router';

import Footer from 'components/Footer';
import Header from 'components/Header';
import { Products } from 'components/Products';
import { ProductDetail } from 'components/ProductDetail';
import { Cart } from 'components/Cart';

import './App.css';

export default function App() {
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
							path="/product-detail"
							element={<ProductDetail />}
						/>
						<Route
							path="/cart"
							element={<Cart />}
						/>
					</Routes>
				</main>
			</div>
			<Footer />
		</>
	);
}
