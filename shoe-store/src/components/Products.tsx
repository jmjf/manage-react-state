import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useFetch } from 'hooks/useFetch';
import { useParams } from 'react-router';

import Spinner from './Spinner';
import { PageNotFound } from './PageNotFound';

import { IProduct } from 'models/Product';
import { arrayify } from 'utils';

export function Products() {
	const [selectedSize, setSelectedSize] = useState('');
	const { category } = useParams();

	const { data, error, isLoading } = useFetch<IProduct>(
		`products?category=${category}`
	);

	const products = arrayify<IProduct>(data);

	function renderProduct(p: IProduct) {
		return (
			<div
				key={p.id}
				className="product"
			>
				<Link to={`${p.id}`}>
					<img
						src={`/images/${p.image}`}
						alt={p.name}
					/>
					<h3>{p.name}</h3>
					<p>${p.price}</p>
				</Link>
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

	if (isLoading) return <Spinner />;
	// else
	if (products.length === 0) return <PageNotFound />;
	// else
	if (error) throw error;
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
