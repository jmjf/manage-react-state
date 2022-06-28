import React, { useState } from 'react';

import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import Spinner from 'components/Spinner';

import { useProducts } from 'hooks/useProducts';
import { IProduct } from 'services/productService';

export default function App() {
	const [selectedSize, setSelectedSize] = useState('');
	const { products, error, isLoading } = useProducts();

	function renderProduct(p: IProduct) {
		return (
			<div
				key={p.id}
				className="product"
			>
				<a href="/">
					<img
						src={`/images/${p.image}`}
						alt={p.name}
					/>
					<h3>{p.name}</h3>
					<p>${p.price}</p>
				</a>
			</div>
		);
	}

	const filteredProducts =
		selectedSize !== ''
			? products.filter((product) =>
					product.skus.some(
						(sku) =>
							selectedSize === '' || sku.size.toString() === selectedSize
					)
			  )
			: products;

	if (error) throw error;

	if (isLoading) return <Spinner />;
	// else
	return (
		<>
			<div className="content">
				<Header />
				<main>
					<section id="filters">
						<label htmlFor="size">Filter by Size:</label>{' '}
						<select
							id="size"
							value={selectedSize}
							onChange={(e) => {
								setSelectedSize(e.target.value);
							}}
						>
							<option value="">All sizes</option>
							<option value="7">7</option>
							<option value="8">8</option>
							<option value="9">9</option>
						</select>
						<p>{filteredProducts.length} items found</p>
					</section>
					<section id="products">
						{filteredProducts.map(renderProduct)}
					</section>
				</main>
			</div>
			<Footer />
		</>
	);
}
