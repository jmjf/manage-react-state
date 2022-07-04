import { ICartItem } from 'models/CartItem';

type AddItemToCart = {
	type: 'AddItemToCart';
	itemId: number;
	itemSku: string;
};

type EmptyCart = {
	type: 'EmptyCart';
};

type UpdateItemQuantity = {
	type: 'UpdateItemQuantity';
};

export type CartReducerAction = AddItemToCart | EmptyCart | UpdateItemQuantity;

export function cartReducer(
	oldCart: ICartItem[],
	action: CartReducerAction
): ICartItem[] {
	switch (action.type) {
		case 'AddItemToCart':
			// do nothing if required data missing
			if (!action.itemId || !action.itemSku) return oldCart;

			const newCart = oldCart.map((cartItem) =>
				cartItem.sku === action.itemSku
					? { ...cartItem, quantity: cartItem.quantity + 1 }
					: cartItem
			);
			// If the item isn't found in the new cart
			if (!newCart.find((cartItem) => cartItem.sku === action.itemSku))
				newCart.push({
					id: action.itemId,
					sku: action.itemSku,
					quantity: 1,
				});
			return newCart;
			break;
		case 'EmptyCart':
			console.log('CartReducerAction EmptyCart action not implemented');
			return oldCart;
			break;
		case 'UpdateItemQuantity':
			console.log(
				'CartReducerAction UpdateItemQuantity action not implemented'
			);
			return oldCart;
			break;
	}
}
