export function arrayify<T>(data: T | T[]) {
	return Array.isArray(data) ? data : Array.of(data);
}
