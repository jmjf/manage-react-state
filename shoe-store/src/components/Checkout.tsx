import { BaseSyntheticEvent, useState } from 'react';

// I want to filter the list of states by country
const countryStates = [
	{ countryCode: 'US', stateCode: 'CA', stateName: 'California' },
	{ countryCode: 'US', stateCode: 'FL', stateName: 'Florida' },
	{ countryCode: 'US', stateCode: 'NC', stateName: 'North Carolina' },
	{ countryCode: 'CA', stateCode: 'ON', stateName: 'Ontario' },
	{
		countryCode: 'CA',
		stateCode: 'NL',
		stateName: 'Newfoundland and Labrador',
	},
	{ countryCode: 'CA', stateCode: 'BC', stateName: 'British Columbia' },
	{ countryCode: 'JP', stateCode: 'Aichi', stateName: 'Aichi' },
	{ countryCode: 'JP', stateCode: 'Saitama', stateName: 'Saitama' },
	{ countryCode: 'JP', stateCode: 'Aomori', stateName: 'Aomori' },
];

const countries = [
	{ countryCode: 'US', countryName: 'United States' },
	{ countryCode: 'CA', countryName: 'Canada' },
	{ countryCode: 'JP', countryName: 'Japan' },
];
interface IAddress {
	shipToName: string;
	addressLine1Text: string;
	addressLine2Text: string;
	cityName: string;
	stateCode: string; // or any other second level division of a country
	postalCode: string;
	countryCode: string;
}

const emptyAddress: IAddress = {
	shipToName: '',
	addressLine1Text: '',
	addressLine2Text: '',
	cityName: '',
	stateCode: '',
	postalCode: '',
	countryCode: '',
};

export function Checkout() {
	const [address, setAddress] = useState(emptyAddress);

	function handleChange(e: BaseSyntheticEvent) {
		e.preventDefault();

		setAddress((oldAddress) => {
			const newAddress: { [key: string]: any } = { ...oldAddress };
			if (e.target.id === 'countryCode') {
				newAddress.stateCode = '';
			}
			newAddress[e.target.id] = e.target.value;
			return newAddress as IAddress;
		});
		console.log(e);
		//TODO
	}
	function handleBlur(e: any) {
		//TODO
	}
	function handleSubmit(e: any) {
		//TODO
	}

	return (
		<>
			<div>
				<label htmlFor="countryCode">Country</label>
				<br />
				<select
					id="countryCode"
					value={address.countryCode}
					onBlur={handleBlur}
					onChange={handleChange}
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
			</div>
			<div>
				<label htmlFor="stateCode">State/Province</label>
				<br />
				<select
					id="stateCode"
					value={address.stateCode}
					onBlur={handleBlur}
					onChange={handleChange}
					disabled={address.countryCode === ''}
				>
					<option
						key=""
						value=""
					>
						Select State/Province
					</option>
					{countryStates
						.filter(
							(countryState) =>
								countryState.countryCode === address.countryCode
						)
						.map((countryState) => (
							<option
								key={countryState.stateCode}
								value={countryState.stateCode}
							>
								{countryState.stateName}
							</option>
						))}
				</select>
			</div>{' '}
		</>
	);
}
