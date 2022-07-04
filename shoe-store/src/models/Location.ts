export interface ICountryState {
	countryCode: string;
	stateCode: string;
	stateName: string;
}

export const countryStates = [
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

export interface ICountry {
	countryCode: string;
	countryName: string;
}

export const countries = [
	{ countryCode: 'US', countryName: 'United States' },
	{ countryCode: 'CA', countryName: 'Canada' },
	{ countryCode: 'JP', countryName: 'Japan' },
];

export interface IAddress {
	shipToName: string;
	addressLine1Text: string;
	addressLine2Text: string;
	cityName: string;
	stateCode: string; // or any other second level division of a country
	postalCode: string;
	countryCode: string;
}

export const emptyAddress: IAddress = Object.freeze({
	shipToName: '',
	addressLine1Text: '',
	addressLine2Text: '',
	cityName: '',
	stateCode: '',
	postalCode: '',
	countryCode: '',
});
