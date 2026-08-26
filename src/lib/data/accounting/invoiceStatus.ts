export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'void';

export const invoiceStatusLabels: Record<InvoiceStatus, string> = {
	draft: 'Draft',
	issued: 'Issued',
	paid: 'Paid',
	void: 'Void'
};

export const invoiceStatusClasses: Record<InvoiceStatus, string> = {
	draft: 'bg-chalk/10 text-chalk/70',
	issued: 'bg-caution/15 text-caution',
	paid: 'bg-go/15 text-go',
	void: 'bg-signal/15 text-signal'
};

export function isInvoiceOutstanding(status: InvoiceStatus): boolean {
	return status === 'issued';
}

export function canEditInvoice(status: InvoiceStatus): boolean {
	return status === 'draft';
}

export function canDeleteInvoice(status: InvoiceStatus): boolean {
	return status === 'draft' || status === 'void';
}
