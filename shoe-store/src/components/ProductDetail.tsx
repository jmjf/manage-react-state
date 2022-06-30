import { useFetch } from 'hooks/useFetch';
import { useParams } from 'react-router';
import { IProduct } from 'services/productService';
import { PageNotFound } from './PageNotFound';
import Spinner from './Spinner';

export function ProductDetail() {
	const { id } = useParams();

	const { data, isLoading, error } = useFetch<IProduct>(`products/${id}`);

	const products = data && Array.isArray(data) ? data : Array.of(data);

	if (error) throw error;

	if (isLoading) return <Spinner />;

	if (products.length === 0) return <PageNotFound />;

	const product = products[0];

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
