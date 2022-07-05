import { ICartItem } from 'models/CartItem';
import { Dispatch } from 'react';

type AddItemToCart = {
	type: 'AddItemToCart';
	id: number;
	sku: string;
};

type EmptyCart = {
	type: 'EmptyCart';
};

type UpdateItemQuantity = {
	type: 'UpdateItemQuantity';
	newQuantity: number;
	sku: string;
};

export type CartReducerAction = AddItemToCart | EmptyCart | UpdateItemQuantity;

export type CartItemsDispatcher = Dispatch<CartReducerAction>;

export function cartReducer(
	oldCartItems: ICartItem[],
	action: CartReducerAction
): ICartItem[] {
	switch (action.type) {
		case 'AddItemToCart': {
			const { id, sku } = action;
			// do nothing if required data missing
			if (!id || !sku) return oldCartItems;

			const newCart = oldCartItems.map((cartItem) =>
				cartItem.sku === sku
					? { ...cartItem, quantity: cartItem.quantity + 1 }
					: cartItem
			);
			// If the item isn't found in the new cart
			if (!newCart.find((cartItem) => cartItem.sku === sku))
				newCart.push({
					id: id,
					sku: sku,
					quantity: 1,
				});
			return newCart;
		}
		// break by return
		case 'EmptyCart':
			return [];
		// break by return
		case 'UpdateItemQuantity': {
			const { newQuantity, sku } = action;

			if (newQuantity === undefined || newQuantity === null || !sku)
				return oldCartItems;

			if (newQuantity === 0) {
				return oldCartItems.filter((cartItem) => cartItem.sku !== sku);
			} else {
				return oldCartItems.map((cartItem) =>
					cartItem.sku === sku
						? { ...cartItem, quantity: newQuantity }
						: cartItem
				);
			}
		}
		// break by return
	}
}
