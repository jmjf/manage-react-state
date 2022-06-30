import { useState } from 'react';

import Spinner from './Spinner';

import { useFetch } from 'hooks/useFetch';

import { IProduct } from 'services/productService';
import { useParams } from 'react-router';
import { PageNotFound } from './PageNotFound';

export function Products() {
	const [selectedSize, setSelectedSize] = useState('');
	const { category } = useParams();

	const { data, error, isLoading } = useFetch<IProduct>(
		`products?category=${category}`
	);

	const products = Array.isArray(data) ? data : Array.of(data);

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
	if (products.length === 0) return <PageNotFound />;
	// else
	return (
		<>
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
			<section id="products">{filteredProducts.map(renderProduct)}</section>
		</>
	);
}
