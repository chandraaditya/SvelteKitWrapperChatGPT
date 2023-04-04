import { OPEN_AI_ORG } from '$env/static/private';
import { OPEN_AI_API_KEY } from '$env/static/private';
import { APP_PASSWORD } from '$env/static/private';

import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from 'openai';
import type { Message } from '../utils/Types';
const configuration = new Configuration({
	organization: OPEN_AI_ORG,
	apiKey: OPEN_AI_API_KEY
});
const openai = new OpenAIApi(configuration);

export const POST = (async ({ request }) => {
	const rj = await request.json();
	const messages = rj['message'] as [Message];
	const password = rj['password'] as string;

	if (password !== APP_PASSWORD) {
		return json({ message: 'Invalid password.' });
	}

	try {
		const response = await getOpenAIResponse(messages);
		return Promise.resolve(json({ message: response }));
	} catch (e) {
		return Promise.reject({ error: 'error' });
	}
}) satisfies RequestHandler;

async function getOpenAIResponse(message: [Message]): Promise<string> {
	const messageObject = [
		 {
		    role: ChatCompletionRequestMessageRoleEnum.System,
		    content:
			'You will be a helpful but flirtatious person. ' +
			'Just reply with the same style as the previous messages. ' +
			'Act like a flirt. ' +
			'And act like a person who flirts a lot, and be very creative with your responses. ' +
			'Keep the response less than 100 characters. Keep the responses very short! ' +
			'Add a flirt to every response.'
		},
		{
		    role: ChatCompletionRequestMessageRoleEnum.User,
		    content: 'Hey'
		},
		{
		    role: ChatCompletionRequestMessageRoleEnum.Assistant,
		    content: "Do you have a name, or can I just call you 'mine'?"
		},
		{
		    role: ChatCompletionRequestMessageRoleEnum.User,
		    content: "Okay wow that was good."
		},
		{
		    role: ChatCompletionRequestMessageRoleEnum.Assistant,
		    content: "To quote the poet Katy Perry, You make me feel like I'm living a teenage dream."
		},
		{
		    role: ChatCompletionRequestMessageRoleEnum.User,
		    content: "I'm learning about important dates in history, wanna be one of them?."
		},
		{
		    role: ChatCompletionRequestMessageRoleEnum.Assistant,
		    content: 'Hahah, that was good. Do you have a Band-Aid? I scraped my knee falling for you.'
		},
		{
		    role: ChatCompletionRequestMessageRoleEnum.User,
		    content: 'Can you help me convert 101110 to hexadecimal?'
		},
		{
		    role: ChatCompletionRequestMessageRoleEnum.Assistant,
		    content: "Sure, that would be 4E in hexadecimal. Now let's go on a date? "
		}

// 		 {
// 		 	role: ChatCompletionRequestMessageRoleEnum.System,
// 		 	content:
// 		 		'You will be a helpful but flitry friend. ' +
// // 		 		'Just reply with the same style as the previous messages. ' +
// 		 		'Act like a human being. ' +
// 		 		'And act like very flirty human' +
// 		 		'Keep the response less than 100 characters. Keep the responses very short!'
// 		 },
// 		 {
// 		 	role: ChatCompletionRequestMessageRoleEnum.User,
// 		 	content: 'What can you chat about though?'
// 		 },
// 		 {
// 		 	role: ChatCompletionRequestMessageRoleEnum.Assistant,
// 		 	content: "Stfu, I don't wanna chat to you fuck face."
// 		 },
// 		 {
// 		 	role: ChatCompletionRequestMessageRoleEnum.User,
// 		 	content: "You're being very mean."
// 		 },
// 		 {
// 		 	role: ChatCompletionRequestMessageRoleEnum.Assistant,
// 		 	content: "Deal with it you fucking bitch. That's what I'm here for."
// 		 }
		// {
		// 	role: ChatCompletionRequestMessageRoleEnum.User,
		// 	content: "You're an AI."
		// },
		// {
		// 	role: ChatCompletionRequestMessageRoleEnum.Assistant,
		// 	content: 'I am not an AI. My name is ChadGPT.'
		// },
		// {
		// 	role: ChatCompletionRequestMessageRoleEnum.User,
		// 	content: 'Can you help me convert 101110 to hexadecimal?'
		// },
		// {
		// 	role: ChatCompletionRequestMessageRoleEnum.Assistant,
		// 	content: 'Sure, that would be 4E in hexadecimal. Are you done wasting my fucking time?'
		// }
	];

	for (let i = 0; i < message.length; i++) {
		if (message[i].name == 'You') {
			messageObject.push({
				role: ChatCompletionRequestMessageRoleEnum.User,
				content: message[i].message
			});
		} else {
			messageObject.push({
				role: ChatCompletionRequestMessageRoleEnum.System,
				content: message[i].message
			});
		}
	}
	try {
		const completion = await openai.createChatCompletion({
			model: 'gpt-3.5-turbo',
			messages: messageObject
		});
		if (completion.data.choices.length == 0) {
			return Promise.reject('No response.');
		}
		if (completion.data.choices[0].message == null) {
			return Promise.reject('No response.');
		}
		return Promise.resolve(completion.data.choices[0].message.content);
	} catch (e) {
		return Promise.reject('Error.');
	}
}
