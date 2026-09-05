import { accountingAdminAction } from './accountingAdminAction';
import { formatMoney, sumMoney } from '$lib/data/accounting/money';
import { getClients } from '$lib/server/accounting/getClients';
import { getInvoiceList } from '$lib/server/accounting/getInvoiceList';
import { isInvoiceOutstanding } from '$lib/data/accounting/invoiceStatus';
import { objectSchema } from '../actionTypes';
import { outstandingOn } from './describeInvoice';
import type { Client } from '$lib/server/accounting/getClients';
import type { McpAction } from '../actionTypes';
import type { SupabaseClient } from '@supabase/supabase-js';

export const clientBalanceActions: McpAction[] = [
	accountingAdminAction({
		name: 'list_client_balances',
		isWrite: false,
		summary: 'list the clients an invoice can be raised to, with what each still owes',
		inputSchema: objectSchema({
			shouldIncludeArchived: { type: 'boolean', description: 'Include archived clients' }
		}),
		run: async (caller, input) => {
			const clients = await getClients(caller.supabase);
			const shown = input.shouldIncludeArchived === true ? clients : activeOnly(clients);
			if (shown.length === 0) return 'No clients yet.';
			const lines = await Promise.all(
				shown.map((client) => describeClientBalance(caller.supabase, client))
			);
			return lines.join('\n');
		}
	})
];

function activeOnly(clients: Client[]): Client[] {
	return clients.filter((client) => !client.isArchived);
}

async function describeClientBalance(supabase: SupabaseClient, client: Client): Promise<string> {
	const invoices = await getInvoiceList(supabase, client.id);
	const outstanding = invoices.filter((invoice) => isInvoiceOutstanding(invoice.status));
	const owed = formatMoney(sumMoney(outstanding.map(outstandingOn)));
	const archived = client.isArchived ? ' — archived' : '';
	const balance = `${invoices.length} invoice(s), ${owed} outstanding on ${outstanding.length}`;
	return `${client.name}${archived} — ${balance} (id: ${client.id})`;
}
