import { formatMoney } from '$lib/data/accounting/money';
import type { CostCentre } from '$lib/server/accounting/getCostCentres';
import type { InvoiceLine } from '$lib/server/accounting/getInvoice';
import type { LedgerAccount } from '$lib/server/accounting/getLedgerAccounts';

const unknownAccount = 'unknown account';

export function describeInvoiceLines(
	lines: InvoiceLine[],
	accounts: LedgerAccount[],
	costCentres: CostCentre[]
): string[] {
	if (lines.length === 0) return ['None yet.'];
	return lines.map((line) => describeLine(line, accounts, costCentres));
}

function describeLine(line: InvoiceLine, accounts: LedgerAccount[], costCentres: CostCentre[]): string {
	const workings = `${line.quantity} × ${formatMoney(line.unitPrice)} = ${formatMoney(line.amount)}`;
	const account = nameOfAccount(accounts, line.incomeAccountId);
	const costCentre = nameOfCostCentre(costCentres, line.costCentreId);
	return `${line.description} — ${workings} — ${account}${costCentre} (line id: ${line.id})`;
}

function nameOfAccount(accounts: LedgerAccount[], accountId: string): string {
	const account = accounts.find((candidate) => candidate.id === accountId);
	if (account === undefined) return unknownAccount;
	return `${account.code} ${account.name}`;
}

function nameOfCostCentre(costCentres: CostCentre[], costCentreId: string | null): string {
	if (costCentreId === null) return '';
	const costCentre = costCentres.find((candidate) => candidate.id === costCentreId);
	if (costCentre === undefined) return '';
	return ` — ${costCentre.name}`;
}
