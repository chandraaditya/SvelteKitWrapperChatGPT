import type { Message } from './Types';

export const Err = 'Err.902384023984023';

const MaxMessageLength = 5;

export async function GetChadGPTResponse(message: [Message], password: string): Promise<string> {
	const resp = await fetch('/', {
		method: 'POST',
		body: JSON.stringify({
			password: password,
			message: message.slice(0, MaxMessageLength).reverse()
		})
	});
	const js = await resp.json();
	if (resp.ok) {
		return Promise.resolve(<string>js['message']);
	}
	return Promise.reject(Err);
}
