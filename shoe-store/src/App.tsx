import Footer from 'components/Footer';
import Header from 'components/Header';
import { Products } from 'components/Products';
import React from 'react';

import './App.css';

export default function App() {
	return (
		<>
			<div className="content">
				<Header />
				<main>
					<Products />
				</main>
			</div>
			<Footer />
		</>
	);
}
