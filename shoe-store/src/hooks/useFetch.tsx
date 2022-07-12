import { SetStateAction, useEffect, useRef, useState } from 'react';

export interface IUseFetchResult<DataType> {
	data: DataType | DataType[];
	error: any;
	isLoading: boolean;
}

const baseUrl = process.env.REACT_APP_API_BASE_URL;

export function useFetch<DataType>(url: string): IUseFetchResult<DataType> {
	const isMountedRef = useRef(false);
	const [data, setData] = useState(null as unknown as DataType[]);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		isMountedRef.current = true;
		async function loadData() {
			setIsLoading(true);

			try {
				const response = await fetch(baseUrl + url);
				if (response.ok) {
					const json = await response.json();
					if (isMountedRef.current) {
						setData(json);
					}
				} else {
					// HTTP error statuses go to the catch
					throw response;
				}
			} catch (err) {
				// network errors
				if (isMountedRef.current) {
					setError(err as SetStateAction<any>);
				}
			}

			if (isMountedRef.current) {
				setIsLoading(false);
			}
		}

		loadData();
		// cleanup function to flag dismount
		return () => {
			isMountedRef.current = false;
		};
	}, [url]);

	return { data, error, isLoading };
}

interface IFetchProps {
	url: string;
	children: any;
}

export function Fetch({ url, children }: IFetchProps) {
	const { data, isLoading, error } = useFetch(url);
	return children(data, isLoading, error);
}
