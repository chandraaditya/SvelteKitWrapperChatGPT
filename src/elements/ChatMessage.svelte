<script lang="ts">
    export let name: string;
    export let message: string;
    export let response: boolean;
    export let error: boolean;
</script>

{#if response && !error}
    <div class="flex flex-row py-2">
        <div class="h-min  px-4 py-2 border-2 border-black rounded-full">
            <h1>{name}</h1>
        </div>
        <div class="w-4"></div>
        <div class="h-min w-3/4 px-4 py-2 border-2 border-black rounded-3xl">
            <p>{message}</p>
        </div>
    </div>
{:else if !response && !error}
    <div class="flex flex-row py-2">
        <div class="flex-1"></div>
        <div class="h-min w-3/4 px-4 py-2 border-2 border-black rounded-3xl">
            <p>{message}</p>
        </div>
        <div class="w-4"></div>
        <div class="h-min  px-4 py-2 border-2 border-black rounded-full">
            <h1>{name}</h1>
        </div>
    </div>
{:else}
    <div class="flex flex-row py-2">
        <div class="h-min  px-4 py-2 border-2 border-red-500 text-red-500 rounded-full">
            <h1>Error</h1>
        </div>
        <div class="w-4"></div>
        <div class="h-min w-3/4 px-4 py-2 border-2 border-red-500 text-red-500 rounded-3xl">
            <p>An error occurred, please try again later.</p>
        </div>
    </div>
{/if}

