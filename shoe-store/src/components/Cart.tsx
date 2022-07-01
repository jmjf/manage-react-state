import { ICartItem } from 'models/CartItem';

interface ICartProps {
	cart: ICartItem[];
}

export function Cart({ cart }: ICartProps) {
	return (
		<>
			{cart.map((cartItem) => (
				<p>
					id: {cartItem.id} sku: {cartItem.sku} qty: {cartItem.quantity}
				</p>
			))}
		</>
	);
}
