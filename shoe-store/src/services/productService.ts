const baseUrl = process.env.REACT_APP_API_BASE_URL;

interface ISku {
	sku: string;
	size: number;
}

export interface IProduct {
	id: number;
	category: string;
	image: string;
	name: string;
	price: number;
	skus: ISku[];
	description: string;
}

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
