import React, { useRef } from 'react';

import { useFetch } from 'hooks/useFetch';
import { useNavigate, useParams } from 'react-router';

import { PageNotFound } from './PageNotFound';
import Spinner from './Spinner';

import { IProduct } from 'models/Product';
import { ICartItem } from 'models/CartItem';

interface IProductDetailProps {
	cartItems: ICartItem[];
	addToCart: (id: number, sku: string) => void;
}

export function ProductDetailRefs({
	cartItems,
	addToCart,
}: IProductDetailProps) {
	const { id } = useParams();
	const skuSelectRef = useRef<HTMLSelectElement>(null);
	const { data, isLoading, error } = useFetch<IProduct>(`products/${id}`);
	const navigate = useNavigate();

	if (isLoading) return <Spinner />;
	if (!data) return <PageNotFound />;
	if (error) throw error;

	const onAddToCart = async (ev: React.MouseEvent<HTMLButtonElement>) => {
		ev.preventDefault();
		if (
			skuSelectRef?.current?.value &&
			skuSelectRef.current.value.length !== 0
		) {
			addToCart(product.id, skuSelectRef?.current?.value || '');
			navigate('/cart', { replace: true });
		} else {
			return alert('Please select a size.');
		}
	};

	const product = Array.isArray(data) ? data[0] : data;

	return (
		<div id="product-detail">
			<h1>{product.name}</h1>
			<p>{product.description}</p>
			<p id="price">${product.price}</p>
			<select
				id="size"
				ref={skuSelectRef}
			>
				<option value="">What size?</option>
				{product.skus.map((sku) => {
					return (
						<option
							key={sku.sku}
							value={sku.sku}
						>
							{sku.size}
						</option>
					);
				})}
			</select>
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
