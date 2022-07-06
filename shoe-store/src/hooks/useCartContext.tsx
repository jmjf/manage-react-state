import {
	createContext,
	Dispatch,
	PropsWithChildren,
	useContext,
	useEffect,
	useReducer,
} from 'react';

import { cartReducer, CartReducerAction } from 'reducers/cartReducer';

import { ICartItem } from 'models/CartItem';

// context and other values these exports used are below them
// they're at the top of the file because they're the important things here

export function useCartContext() {
	const context = useContext(CartContext);
	return context;
}

export function CartContextProvider(props: PropsWithChildren) {
	const [cartItems, dispatchCartItemsAction] = useReducer(
		cartReducer,
		initialCartItems
	);

	useEffect(() => {
		localStorage.setItem(
			LOCAL_STORAGE_KEYS.CART_ITEMS,
			JSON.stringify(cartItems)
		);
	}, [cartItems]);

	const contextValue = { cartItems, dispatchCartItemsAction };

	return (
		<CartContext.Provider value={contextValue}>
			{props.children}
		</CartContext.Provider>
	);
}

// overkill for a single value, maybe
// it's used in more than one place, so this makes it easier to adjust
// if we end up with more keys, it's a wise move
const LOCAL_STORAGE_KEYS = {
	CART_ITEMS: 'cartItems',
};

// IIFE to set up inital cart items
const initialCartItems = ((): ICartItem[] => {
	const getItemResult = localStorage.getItem(LOCAL_STORAGE_KEYS.CART_ITEMS);
	if (
		getItemResult === null ||
		getItemResult === undefined ||
		getItemResult === ''
	)
		return [];

	try {
		const cartItems = JSON.parse(getItemResult);
		if (!Array.isArray(cartItems)) return [];
		return cartItems;
	} catch (e) {
		console.log('ERROR: failed reading cart data; returning empty cart');
		return [];
	}
})();

interface ICartContextState {
	cartItems: ICartItem[];
	dispatchCartItemsAction: Dispatch<CartReducerAction>;
}

const CartContext = createContext<ICartContextState>(
	{} as unknown as ICartContextState
);
