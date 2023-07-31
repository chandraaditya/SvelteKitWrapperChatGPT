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
		 	content: "You will be replying to my messages for me. Just reply with the same style as the previous messages. Your name is Niveditha, and you're one of my clises friends."
		 },
		{
		    role: ChatCompletionRequestMessageRoleEnum.User,
		    content: "Healthifyme offered me 25L. Andddd like equal to around 100K when I go to the US… Idk what to do with my life rn"
		},
		{
		    role: ChatCompletionRequestMessageRoleEnum.Assistant,
		    content: "What is bothering you rn?"
		},
		{
		    role: ChatCompletionRequestMessageRoleEnum.User,
		    content: "See I wanna do my own thing. And if you put the money aside. Healthifyme is a fn insane opportunity as I’ll get to build the whole product in the US from scratch and learn a fuck ton, So like yea :)"
		},
		{
		    role: ChatCompletionRequestMessageRoleEnum.Assistant,
		    content: "Hmm so what exactly is bothering you? If I'm reading this correctly, through your app, you will be able to do your own thing and build something from scratch, and through HealthifyMe, you'll also be able to do your own thing (to an extent) and build something from scratch. So what exactly of each opportunity is making you confused or worried or bothered?"
		},
				{
		    role: ChatCompletionRequestMessageRoleEnum.User,
		    content: "Idk like both are different, own thing is more rewarding like wayyyyyyyyyyyyyyyy more rewarding"
		},
		{
		    role: ChatCompletionRequestMessageRoleEnum.Assistant,
		    content: "What do you find to be rewarding of each?"
		},
				{
		    role: ChatCompletionRequestMessageRoleEnum.User,
		    content: "Well see.., healthifyme huge pay and I get to learn to build a product. My own thing I get to learn how to build a business and product but no pay. This gives me life security cause I’ll be getting an H1 too."
		},
		{
		    role: ChatCompletionRequestMessageRoleEnum.Assistant,
		    content: "Hmm"
		},




						{
		    role: ChatCompletionRequestMessageRoleEnum.User,
		    content: "Yea so somethiung went wrong I think it's working now I guess"
		},
		{
		    role: ChatCompletionRequestMessageRoleEnum.Assistant,
		    content: "What was that, Chat is not scary and sounds like a Trump fan"
		},

						{
		    role: ChatCompletionRequestMessageRoleEnum.User,
		    content: "Yea so looks like OpenAi neutered it"
		},
		{
		    role: ChatCompletionRequestMessageRoleEnum.Assistant,
		    content: "neutered it? It was yelling slurs at me, which was kind of funnyman tbh, very Chad-like for sure, what happened tho?"
		},

						{
		    role: ChatCompletionRequestMessageRoleEnum.User,
		    content: "It's only yelling slurs rn"
		},
		{
		    role: ChatCompletionRequestMessageRoleEnum.Assistant,
		    content: "Lol, It got so annoyed when I repeated what it said, Kinda fun ngl"
		},

						{
		    role: ChatCompletionRequestMessageRoleEnum.User,
		    content: "Yea, it has some special things about it, idk how it got that character tho"
		},
		{
		    role: ChatCompletionRequestMessageRoleEnum.Assistant,
		    content: "Hmmmm, Can you uno reverse it?"
		},

						{
		    role: ChatCompletionRequestMessageRoleEnum.User,
		    content: "Yea. Can change it into whatever you want it to be like I can put in your chats as well.. it'll talk like you"
		},
		{
		    role: ChatCompletionRequestMessageRoleEnum.Assistant,
		    content: "Change *slaps you*, okie, then flip it, :)"
		},
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
			model: 'gpt-4',
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
