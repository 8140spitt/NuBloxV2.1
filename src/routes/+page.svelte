<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { DatabaseDefinition } from '$lib/sql/ddl/types';

	const dispatch = createEventDispatcher();

	let name = '';
	let ifNotExists = true;
	let charset = 'utf8mb4';
	let collation = 'utf8mb4_general_ci';

	function submit() {
		const def: DatabaseDefinition = {
			name,
			ifNotExists,
			charset,
			collation
		};
		dispatch('submit', { definition: def });
	}
</script>

<div class="space-y-4 p-4">
	<h2 class="text-xl font-semibold">Create Database</h2>

	<label class="block">
		<span class="text-sm font-medium">Database Name</span>
		<input class="w-full p-2 border rounded" bind:value={name} placeholder="my_database" />
	</label>

	<label class="block">
		<span class="text-sm font-medium">Character Set</span>
		<input class="w-full p-2 border rounded" bind:value={charset} placeholder="utf8mb4" />
	</label>

	<label class="block">
		<span class="text-sm font-medium">Collation</span>
		<input
			class="w-full p-2 border rounded"
			bind:value={collation}
			placeholder="utf8mb4_general_ci"
		/>
	</label>

	<label class="inline-flex items-center">
		<input type="checkbox" bind:checked={ifNotExists} />
		<span class="ml-2 text-sm">IF NOT EXISTS</span>
	</label>

	<button class="mt-4 px-4 py-2 bg-blue-600 text-white rounded" on:click={submit}>
		Generate SQL
	</button>
</div>
