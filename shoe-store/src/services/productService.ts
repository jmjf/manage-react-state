import { IProduct } from 'models/Product';

const baseUrl = process.env.REACT_APP_API_BASE_URL;

export async function getProducts(category: string): Promise<IProduct[]> {
	const response = await fetch(baseUrl + 'products?category=' + category);
	if (response.ok) return response.json();
	throw response;
}

export async function getProduct(id: number): Promise<IProduct> {
	const response = await fetch(baseUrl + 'products/' + id);
	if (response.ok) return response.json();
	throw response;
}
