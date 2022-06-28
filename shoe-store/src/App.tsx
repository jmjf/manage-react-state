import React, { useEffect, useState } from 'react';
import './App.css';
import Footer from './Footer';
import Header from './Header';

import { getProducts, IProduct } from 'services/productService';
import Spinner from 'Spinner';

export default function App() {
	const [selectedSize, setSelectedSize] = useState('');
	const [products, setProducts] = useState([] as IProduct[]);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		getProducts('shoes')
			.then((res) => {
				setProducts(res);
			})
			.catch((err) => setError(err))
			.finally(() => {
				setIsLoading(false);
			});
	}, []);

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
