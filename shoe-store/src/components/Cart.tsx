import { useContext } from 'react';
import { useNavigate } from 'react-router';

import { ICartItem } from 'models/CartItem';
import { IProduct, ISku } from 'models/Product';

import { CartContext } from 'contexts/CartContext';
import { useFetchAll } from 'hooks/useFetchAll';
import { CartItemsDispatcher } from 'reducers/cartReducer';

import { arrayify } from 'utils';

import Spinner from './Spinner';

interface ICartProps {
	cartItems: ICartItem[];
	dispatchCartItemsAction: CartItemsDispatcher;
}

export function Cart() {
	const { cartItems, dispatchCartItemsAction } = useContext(CartContext);
	const urls = cartItems.map((cartItem) => `products/${cartItem.id}`);
	const { data, isLoading, error } = useFetchAll<IProduct>(urls);
	const products = arrayify<IProduct>(data);
	const navigate = useNavigate();

	const { quantity: cartItemCount } = cartItems.reduce(
		(acc, curr) => {
			acc.quantity += curr.quantity;
			return acc;
		},
		{ quantity: 0 } as unknown as ICartItem
	);

	function cartTotalAmount() {
		let totalAmount = 0.0;
		for (let cartItem of cartItems) {
			const { price } = getProductForId(cartItem.id);
			totalAmount += price * cartItem.quantity;
		}
		return Math.round(totalAmount * 100) / 100;
	}

	function getProductForId(id: number): IProduct {
		return products.find((product) => product.id === id) as IProduct;
	}

	function renderItem(cartItem: ICartItem) {
		const { id, sku, quantity } = cartItem;
		const { name, price, image, skus } = getProductForId(id);

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
								dispatchCartItemsAction({
									type: 'UpdateItemQuantity',
									sku,
									newQuantity: parseInt(e.target.value),
								});
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
			<h2>
				{cartItemCount === 0
					? 'Cart is empty'
					: `${cartItemCount} item${
							cartItemCount > 1 ? 's' : ''
					  } in the cart -- Total cost $${cartTotalAmount().toFixed(2)}`}
			</h2>{' '}
			<ul>{cartItems.map(renderItem)}</ul>
			{cartItemCount > 0 ? (
				<button
					className="btn btn-primary"
					onClick={(e) => navigate('/checkout')}
				>
					Checkout
				</button>
			) : null}
		</section>
	);
}
