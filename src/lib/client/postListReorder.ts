import { deserialize } from '$app/forms';
import { invalidateAll } from '$app/navigation';
import { pendingSaves } from '$lib/client/pendingSaves.svelte';

/**
 * Submit a drop-reorder to a page action outside any <form>, with the same
 * global saving overlay as form submissions, then refetch the page data so
 * the list settles into its saved order.
 */
export async function postListReorder(
	action: string,
	fields: Record<string, string>
): Promise<void> {
	pendingSaves.begin();
	try {
		const response = await fetch(action, {
			method: 'POST',
			body: toFormData(fields),
			headers: { 'x-sveltekit-action': 'true' }
		});
		const result = deserialize(await response.text());
		if (result.type === 'success') await invalidateAll();
	} finally {
		pendingSaves.end();
	}
}

function toFormData(fields: Record<string, string>): FormData {
	const formData = new FormData();
	for (const [fieldName, fieldValue] of Object.entries(fields)) {
		formData.append(fieldName, fieldValue);
	}
	return formData;
}
