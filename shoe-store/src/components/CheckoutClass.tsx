import React, { BaseSyntheticEvent, PropsWithChildren, useState } from 'react';

import { saveShippingAddress } from 'services/shippingService';

import {
	IAddress,
	emptyAddress,
	countries,
	ICountryState,
	countryStates,
} from 'models/Location';
import { useCartContext } from 'hooks/useCartContext';

// I want to filter the list of states by country

const CHECKOUT_STATUS = {
	NOT_SUBMITTED: 'NOT_SUBMITTED',
	IS_SUBMITTING: 'IS_SUBMITTING',
	FAILED_SUBMIT: 'FAILED_SUBMITTED',
	SUCCESSFUL_SUBMIT: 'SUCCESSFUL_SUBMIT',
};

const emptyTouchedFields = Object.fromEntries(
	Object.keys(emptyAddress).map((key) => [key, false])
);

export class Checkout extends React.Component {
	state = {
		address: emptyAddress,
		checkoutStatus: CHECKOUT_STATUS.NOT_SUBMITTED,
		saveError: null as unknown as Error,
		touchedFields: emptyTouchedFields,
	};

	// derived state
	private isFormValid() {
		return Object.values(this.getErrors(this.state.address)).every(
			(error) => error.length === 0
		);
	}

	private getErrors(address: IAddress): IAddress {
		return {
			shipToName:
				address.shipToName.length > 0 ? '' : 'Ship to name is required',
			addressLine1Text:
				address.addressLine1Text.length > 0
					? ''
					: 'Address line 1 is required',
			addressLine2Text: '',
			cityName: address.cityName.length > 0 ? '' : 'City name is required',
			stateCode: this.getValidStatesForCountry().find(
				(state) => address.stateCode === state.stateCode
			)
				? ''
				: 'State code is required',
			postalCode:
				address.postalCode.length > 0 ? '' : 'Postal/ZIP code is required',
			countryCode: countries.find(
				(country) => address.countryCode === country.countryCode
			)
				? ''
				: 'Country code is required',
		};
	}

	private handleChange(ev: BaseSyntheticEvent) {
		ev.preventDefault();

		setAddress((oldAddress) => {
			const newAddress = { ...oldAddress, [ev.target.id]: ev.target.value };
			if (ev.target.id === 'countryCode') {
				newAddress.stateCode = '';
			}
			return newAddress as IAddress;
		});
	}
	private handleBlur(ev: BaseSyntheticEvent) {
		setTouchedFields((oldTouchedFields) => {
			return { ...oldTouchedFields, [ev.target.id]: true };
		});
		//TODO
	}
	private async handleSubmit(ev: BaseSyntheticEvent) {
		ev.preventDefault();
		setCheckoutStatus(CHECKOUT_STATUS.IS_SUBMITTING);
		if (!isFormValid) {
			setCheckoutStatus(CHECKOUT_STATUS.FAILED_SUBMIT);
			return;
		}
		try {
			const saveResult = await saveShippingAddress(address);

			if (saveResult.ok) {
				setCheckoutStatus(CHECKOUT_STATUS.SUCCESSFUL_SUBMIT);
				this.props.dispatchCartItemsAction({ type: 'EmptyCart' });
			} else {
				setCheckoutStatus(CHECKOUT_STATUS.FAILED_SUBMIT);
			}
		} catch (err) {
			console.log('ERROR: saveError', err);
			setSaveError(err as Error);
			// will throw an error, so don't need to set status
		}
	}

	private getValidStatesForCountry(): ICountryState[] {
		return (
			countryStates.filter(
				(countryState) => countryState.countryCode === address.countryCode
			) ?? ([] as unknown as ICountryState[])
		);
	}

	render() {
		if (this.state.saveError) throw saveError;
		if (this.state.checkoutStatus === CHECKOUT_STATUS.SUCCESSFUL_SUBMIT) {
			return <h1>Order submitted</h1>;
		}

		return (
			<>
				<h1>Shipping Information</h1>
				{!this.isFormValid &&
					this.state.checkoutStatus === CHECKOUT_STATUS.FAILED_SUBMIT && (
						<div role="alert">
							<p>Please fix these errors:</p>
							<ul>
								{Object.entries(errors).map(([key, value]) => {
									return value.length > 0 ? (
										<li key={key}>{value}</li>
									) : null;
								})}
							</ul>
						</div>
					)}
				<form onSubmit={this.handleSubmit}>
					<div>
						<label htmlFor="shipToName">Ship To</label>
						<br />
						<input
							id="shipToName"
							type="text"
							value={this.state.address.shipToName}
							onBlur={this.handleBlur}
							onChange={this.handleChange}
						/>
						<p role="alert">
							{(this.state.touchedFields.shipToName ||
								this.state.checkoutStatus ===
									CHECKOUT_STATUS.FAILED_SUBMIT) &&
								errors.shipToName}
						</p>
					</div>
					<div>
						<label htmlFor="addressLine1Text">Address Line 1</label>
						<br />
						<input
							id="addressLine1Text"
							type="text"
							value={this.state.address.addressLine1Text}
							onBlur={this.handleBlur}
							onChange={this.handleChange}
						/>
						<p role="alert">
							{(this.state.touchedFields.addressLine1Text ||
								this.state.checkoutStatus ===
									CHECKOUT_STATUS.FAILED_SUBMIT) &&
								errors.addressLine1Text}
						</p>
					</div>
					<div>
						<label htmlFor="addressLine2Text">Address Line 2</label>
						<br />
						<input
							id="addressLine2Text"
							type="text"
							value={this.state.address.addressLine2Text}
							onBlur={this.handleBlur}
							onChange={this.handleChange}
						/>
					</div>
					<div>
						<label htmlFor="cityName">City</label>
						<br />
						<input
							id="cityName"
							type="text"
							value={this.state.address.cityName}
							onBlur={this.handleBlur}
							onChange={this.handleChange}
						/>
						<p role="alert">
							{(this.state.touchedFields.cityName ||
								this.state.checkoutStatus ===
									CHECKOUT_STATUS.FAILED_SUBMIT) &&
								errors.cityName}
						</p>
					</div>
					<div>
						<label htmlFor="postalCode">Postal/ZIP code</label>
						<br />
						<input
							id="postalCode"
							type="text"
							value={this.state.address.postalCode}
							onBlur={this.handleBlur}
							onChange={this.handleChange}
						/>
						<p role="alert">
							{(this.state.touchedFields.postalCode ||
								this.state.checkoutStatus ===
									CHECKOUT_STATUS.FAILED_SUBMIT) &&
								errors.postalCode}
						</p>
					</div>
					<div>
						<label htmlFor="countryCode">Country</label>
						<br />
						<select
							id="countryCode"
							value={this.state.address.countryCode}
							onBlur={this.handleBlur}
							onChange={this.handleChange}
						>
							<option
								key=""
								value=""
							>
								Select Country
							</option>
							{countries.map((country) => (
								<option
									key={country.countryCode}
									value={country.countryCode}
								>
									{country.countryName}
								</option>
							))}
						</select>
						<p role="alert">
							{(this.state.touchedFields.countryCode ||
								this.state.checkoutStatus ===
									CHECKOUT_STATUS.FAILED_SUBMIT) &&
								errors.countryCode}
						</p>
					</div>
					<div>
						<label htmlFor="stateCode">State/Province</label>
						<br />
						<select
							id="stateCode"
							value={this.state.address.stateCode}
							onBlur={this.handleBlur}
							onChange={this.handleChange}
							disabled={this.state.address.countryCode === ''}
						>
							<option
								key=""
								value=""
							>
								Select State/Province
							</option>
							{this.getValidStatesForCountry().map((countryState) => (
								<option
									key={countryState.stateCode}
									value={countryState.stateCode}
								>
									{countryState.stateName}
								</option>
							))}
						</select>
						<p role="alert">
							{(this.state.touchedFields.stateCode ||
								this.state.checkoutStatus ===
									CHECKOUT_STATUS.FAILED_SUBMIT) &&
								errors.stateCode}
						</p>
					</div>
					<div>
						<input
							type="submit"
							className="btn btn-primary"
							value="Save shipping info"
							disabled={
								this.state.checkoutStatus ===
								CHECKOUT_STATUS.IS_SUBMITTING
							}
						/>
					</div>
				</form>
			</>
		);
	}
}
