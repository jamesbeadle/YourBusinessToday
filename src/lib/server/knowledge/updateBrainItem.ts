import type { SupabaseClient } from '@supabase/supabase-js';

type BrainItemChanges = {
	title?: string;
	body?: string;
	data?: Record<string, unknown>;
	parentItemId?: string | null;
	position?: number;
	occurredAt?: string | null;
	validFrom?: string | null;
	validTo?: string | null;
};

export async function updateBrainItem(
	supabase: SupabaseClient,
	itemId: string,
	changes: BrainItemChanges
): Promise<void> {
	const { error } = await supabase
		.from('kb_brain_items')
		.update({
			...(changes.title === undefined ? {} : { title: changes.title }),
			...(changes.body === undefined ? {} : { body: changes.body }),
			...(changes.data === undefined ? {} : { data: changes.data }),
			...(changes.parentItemId === undefined ? {} : { parent_item_id: changes.parentItemId }),
			...(changes.position === undefined ? {} : { position: changes.position }),
			...(changes.occurredAt === undefined ? {} : { occurred_at: changes.occurredAt }),
			...(changes.validFrom === undefined ? {} : { valid_from: changes.validFrom }),
			...(changes.validTo === undefined ? {} : { valid_to: changes.validTo }),
			updated_at: new Date().toISOString()
		})
		.eq('id', itemId);
	if (error !== null) throw error;
}
