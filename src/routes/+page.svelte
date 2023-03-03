<script lang="ts">
    import Send from "svelte-material-icons/Send.svelte";
    import ChatMessage from "../elements/ChatMessage.svelte";
    import { GetChadGPTResponse } from "../utils/GetChadGPTResponse";
    import type { Message } from "../utils/Types";


    let chatBox: HTMLInputElement;
    let sendButton: HTMLButtonElement;
    let passwordBox: HTMLButtonElement;

    let currentMessages: Message[] = [];

    let password = "";

    export let showError = false;

    async function getResponse() {
        sendButton.disabled = true;
        chatBox.disabled = true;

        let message = (<string>chatBox.value)
        if (message.length <= 0) {
            sendButton.disabled = false;
            chatBox.disabled = false;
            chatBox.focus();
            return;
        }
        if (currentMessages.length > 0) {
            let lastMessage = currentMessages[0];
            if (lastMessage.error) {
                currentMessages.shift()
                currentMessages = [...currentMessages];
            }
        }

        let newMessage: Message

        currentMessages.unshift({
            name: "You",
            message: message,
            error: false,
        })

        try {
            let resp: string = await GetChadGPTResponse(currentMessages, password);
            newMessage = {
                name: "ChadGPT",
                message: resp,
                error: false,
            }
        } catch (e) {
            showError = true;
            newMessage = {
                name: "ChadGPT",
                message: "An error occurred. Please try again later.",
                error: true,
            }
            currentMessages.shift()
            currentMessages.unshift(newMessage)
            currentMessages = [...currentMessages];

            sendButton.disabled = false;
            chatBox.disabled = false;
            chatBox.focus();
            return;
        }

        currentMessages.unshift(newMessage);

        currentMessages = [...currentMessages];

        sendButton.disabled = false;
        chatBox.value = "";
        chatBox.disabled = false;
        chatBox.focus();
        return;
    }

    function setPassword() {
        if (passwordBox.value.length <= 0) {
            return;
        }
        password = passwordBox.value;
    }
</script>
<div class="container mx-auto">
    {#if password === ""}
        <div class="h-screen p-4 grid grid-cols-1 content-center">
            <form on:submit|preventDefault={setPassword}>
                <div class="flex flex-row">
                    <input name="password_box" placeholder="Password" bind:this={passwordBox} type="text" class="flex-1 px-4 py-2 border-2 outline-0 border-gray-500 focus:border-black rounded-full">
                    <div class="w-4"></div>
                    <button class="flex-none px-3 py-2 border-2 enabled:border-black border-gray-500 rounded-full hover:text-white disabled:hover:bg-gray-500 hover:bg-black transition-all" type="submit"><Send></Send></button>
                </div>
            </form>
        </div>
    {:else }
        <div class="flex flex-col h-screen">
            <div class="flex-1 flex flex-col overflow-y-auto px-4 pb-2 ">
                <div class="flex-none flex flex-col space-y-2 items-center justify-center p-4">
                    <div class="w-min px-4 py-2 border-2 border-black rounded-full">
                        <h1>ChadGPT</h1>
                    </div>
                    <div class="px-4 py-2 border-2 border-black rounded-full">
                        <h1>An abusive AI.</h1>
                    </div>
                </div>
                <div class="flex-1 flex flex-col-reverse overflow-y-auto px-4 py-2 border-2 border-black rounded-3xl">
                    {#each currentMessages as message}
                        <ChatMessage name={message.name} response={message.name === "ChadGPT"} message={message.message} error={message.error}></ChatMessage>
                    {/each}
                </div>
            </div>
            <div class="flex-none">
                <form class="p-4" on:submit|preventDefault={getResponse}>
                    <div class="flex flex-row">
                        <input name="chat_box" bind:this={chatBox} type="text" class="flex-1 px-4 py-2 border-2 outline-0 border-gray-500 focus:border-black rounded-full">
                        <div class="w-4"></div>
                        <button bind:this={sendButton} class="flex-none px-3 py-2 border-2 enabled:border-black border-gray-500 rounded-full hover:text-white disabled:hover:bg-gray-500 hover:bg-black transition-all" type="submit"><Send></Send></button>
                    </div>
                </form>
            </div>
        </div>
    {/if}
</div>
