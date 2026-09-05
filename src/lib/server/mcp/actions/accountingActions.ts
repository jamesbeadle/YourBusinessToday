import { clientBalanceActions } from './clientBalanceActions';
import { costCentreActions } from './costCentreActions';
import { expenseReadActions } from './expenseReadActions';
import { expenseWriteActions } from './expenseWriteActions';
import { invoiceDraftActions } from './invoiceDraftActions';
import { invoiceLineActions } from './invoiceLineActions';
import { invoicePostingActions } from './invoicePostingActions';
import { invoiceReadActions } from './invoiceReadActions';
import { journalReadActions } from './journalReadActions';
import { journalWriteActions } from './journalWriteActions';
import { ledgerAccountActions } from './ledgerAccountActions';
import { overviewActions } from './overviewActions';
import { periodEndActions } from './periodEndActions';
import { reportActions } from './reportActions';
import { settingsActions } from './settingsActions';
import type { McpAction } from '../actionTypes';

export const accountingActions: McpAction[] = [
	...overviewActions,
	...invoiceReadActions,
	...invoiceDraftActions,
	...invoiceLineActions,
	...invoicePostingActions,
	...expenseReadActions,
	...expenseWriteActions,
	...clientBalanceActions,
	...ledgerAccountActions,
	...costCentreActions,
	...journalReadActions,
	...journalWriteActions,
	...periodEndActions,
	...reportActions,
	...settingsActions
];
