import { SetStateAction, useEffect, useState } from 'react';
import { getProducts, IProduct } from 'services/productService';

interface IUseProductsResult {
	products: IProduct[];
	error: any;
	isLoading: boolean;
}

export function useProducts(): IUseProductsResult {
	const [products, setProducts] = useState([] as IProduct[]);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	async function loadProducts() {
		setIsLoading(true);
		try {
			const products = await getProducts('shoes');
			setProducts(products);
		} catch (err) {
			setError(err as SetStateAction<any>);
		}
		setIsLoading(false);
	}

	useEffect(() => {
		loadProducts();
	}, []);

	return { products, error, isLoading };
}
