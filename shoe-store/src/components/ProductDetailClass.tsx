import React from 'react';

import { Fetch } from 'hooks/useFetch';
import { NavigateFunction, useNavigate, useParams } from 'react-router';

import { PageNotFound } from './PageNotFound';
import Spinner from './Spinner';

import { IProduct } from 'models/Product';
import { CartContext } from 'hooks/useCartContext';

interface IProductDetailState {
	selectedSku: string;
}

interface IProductDetailProps {
	id: string;
	// dispatchCartItemsAction: Dispatch<CartReducerAction>;
	navigate: NavigateFunction;
}

class ProductDetail extends React.Component<
	IProductDetailProps,
	IProductDetailState
> {
	state = {
		selectedSku: '',
	};

	static contextType = CartContext;

	render() {
		const { id, navigate } = this.props;
		const { dispatchCartItemsAction } = this.context as React.ContextType<
			typeof CartContext
		>;

		return (
			<Fetch url={`products/${id}`}>
				{(data: IProduct | IProduct[], isLoading: boolean, error: any) => {
					if (isLoading) return <Spinner />;
					if (!data) return <PageNotFound />;
					if (error) throw error;

					const onAddToCart = async (
						ev: React.MouseEvent<HTMLButtonElement>
					) => {
						ev.preventDefault();
						dispatchCartItemsAction({
							type: 'AddItemToCart',
							id: product.id,
							sku: this.state.selectedSku,
						});
						navigate('/cart', { replace: true });
					};
					const product = Array.isArray(data) ? data[0] : data;

					return (
						<div id="product-detail">
							<h1>{product.name}</h1>
							<p>{product.description}</p>
							<p id="price">${product.price}</p>
							<select
								id="size"
								value={this.state.selectedSku}
								onChange={(e) => {
									this.setState({ selectedSku: e.target.value });
								}}
							>
								<option value="">What size?</option>
								{product.skus.map((sku) => {
									return (
										<option
											key={sku.sku}
											value={sku.sku}
										>
											{sku.size}
										</option>
									);
								})}
							</select>
							<p>
								<button
									className="btn btn-primary"
									disabled={this.state.selectedSku.length === 0}
									onClick={onAddToCart}
								>
									Add to cart
								</button>
							</p>
							<img
								src={`/images/${product.image}`}
								alt={product.category}
							/>
						</div>
					);
				}}
			</Fetch>
		);
	}
}

export function ProductDetailWrapper() {
	const { id } = useParams();

	return (
		<ProductDetail
			id={id || ''}
			navigate={useNavigate()}
		/>
	);
}
