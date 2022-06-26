import React, { useState } from 'react';
import './App.css';
import Footer from './Footer';
import Header from './Header';

interface ISku {
	sku: string;
	size: number;
}
interface IProduct {
	id: number;
	category: string;
	image: string;
	name: string;
	price: number;
	skus: ISku[];
	description: string;
}

const products: IProduct[] = [
	{
		id: 1,
		category: 'shoes',
		image: 'shoe1.jpg',
		name: 'Hiker',
		price: 94.95,
		skus: [
			{ sku: '17', size: 7 },
			{ sku: '18', size: 8 },
		],
		description: 'This rugged boot will get you up the mountain safely.',
	},
	{
		id: 2,
		category: 'shoes',
		image: 'shoe2.jpg',
		name: 'Climber',
		price: 78.99,
		skus: [
			{ sku: '28', size: 8 },
			{ sku: '29', size: 9 },
		],
		description: 'Sure-footed traction in slippery conditions.',
	},
	{
		id: 3,
		category: 'shoes',
		image: 'shoe3.jpg',
		name: 'Explorer',
		price: 145.95,
		skus: [
			{ sku: '37', size: 7 },
			{ sku: '38', size: 8 },
			{ sku: '39', size: 9 },
		],
		description: 'Look stylish while stomping in the mud.',
	},
];

export default function App() {
	const [selectedSize, setSelectedSize] = useState('');

	function renderProduct(p: IProduct) {
		return (
			<div key={p.id} className="product">
				<a href="/">
					<img src={`/images/${p.image}`} alt={p.name} />
					<h3>{p.name}</h3>
					<p>${p.price}</p>
				</a>
			</div>
		);
	}

	const filteredProducts =
		selectedSize !== ''
			? products.filter((product) =>
					product.skus.some((sku) => selectedSize === '' || sku.size.toString() === selectedSize)
			  )
			: products;

	return (
		<>
			<div className="content">
				<Header />
				<main>
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
				</main>
			</div>
			<Footer />
		</>
	);
}
