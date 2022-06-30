import { useFetch } from 'hooks/useFetch';
import { useParams } from 'react-router';

import { PageNotFound } from './PageNotFound';
import Spinner from './Spinner';

import { IProduct } from 'services/productService';

export function ProductDetail() {
	const { id } = useParams();
	const { data, isLoading, error } = useFetch<IProduct>(`products/${id}`);

	if (isLoading) return <Spinner />;

	if (!data) return <PageNotFound />;
	const product = Array.isArray(data) ? data[0] : data;

	if (error) throw error;

	return (
		<div id="product-detail">
			<h1>{product.name}</h1>
			<p>{product.description}</p>
			<p id="price">${product.price}</p>
			<img
				src={`/images/${product.image}`}
				alt={product.category}
			/>
		</div>
	);
}
