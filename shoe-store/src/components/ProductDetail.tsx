import React from 'react';

import { useFetch } from 'hooks/useFetch';
import { useNavigate, useParams } from 'react-router';

import { PageNotFound } from './PageNotFound';
import Spinner from './Spinner';

import { IProduct } from 'services/productService';

export function ProductDetail() {
	const { id } = useParams();
	const { data, isLoading, error } = useFetch<IProduct>(`products/${id}`);
	const navigate = useNavigate();

	if (isLoading) return <Spinner />;

	if (!data) return <PageNotFound />;
	const product = Array.isArray(data) ? data[0] : data;

	if (error) throw error;

	const onAddToCart = async (ev: React.MouseEvent<HTMLButtonElement>) => {
		ev.preventDefault();
		// await addProductToCart(id) // or do we need sku for size?
		navigate('/cart', { replace: true });
	};

	return (
		<div id="product-detail">
			<h1>{product.name}</h1>
			<p>{product.description}</p>
			<p id="price">${product.price}</p>
			<p>
				<button
					className="btn btn-primary"
					onClick={onAddToCart}
				>
					Add to cart
				</button>
			</p>
			<img
				src={`/images/${product.image}`}
				alt={product.category}
			/>
		</div>
	);
}
