export interface ISku {
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
