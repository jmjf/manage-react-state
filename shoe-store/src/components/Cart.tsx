import { useFetchAll } from 'hooks/useFetchAll';
import { ICartItem } from 'models/CartItem';
import { IProduct, ISku } from 'models/Product';
import { arrayify } from 'utils';
import Spinner from './Spinner';

interface ICartProps {
	cartItems: ICartItem[];
	updateQuantity: (sku: string, newQuantity: number) => void;
}

export function Cart({ cartItems, updateQuantity }: ICartProps) {
	const urls = cartItems.map((cartItem) => `products/${cartItem.id}`);
	const { data, isLoading, error } = useFetchAll<IProduct>(urls);
	const products = arrayify<IProduct>(data);

	function renderItem(cartItem: ICartItem) {
		const { id, sku, quantity } = cartItem;
		const { name, price, image, skus } = products.find(
			(product) => product.id === id
		) as IProduct;

		const { size } = skus.find((skuItem) => skuItem.sku === sku) as ISku;

		return (
			<li
				key={sku}
				className="cart-item"
			>
				<img
					src={`/images/${image}`}
					alt={name}
				/>
				<div className="cart-item-detail">
					<h3>{name}</h3>
					<p>${price}</p>
					<p>Size: {size}</p>
					<p>
						<select
							aria-label={`Select quantity for ${name} size {size}`}
							onChange={(e) => {
								updateQuantity(sku, parseInt(e.target.value));
							}}
							value={quantity}
						>
							<option value="0">Remove</option>
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
						</select>
					</p>
				</div>
			</li>
		);
	}

	if (isLoading) return <Spinner />;
	// maybe should do something if no items???
	// else
	if (error) throw error;
	// else
	return (
		<section id="cart">
			<h1>Cart</h1>
			<ul>{cartItems.map(renderItem)}</ul>
		</section>
	);
}
