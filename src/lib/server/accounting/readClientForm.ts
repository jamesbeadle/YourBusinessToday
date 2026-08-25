import type { ClientInput } from './manageClients';
import { readRequiredText, readText } from './readFormValues';

export function readClientForm(formData: FormData): ClientInput {
	return {
		name: readRequiredText(formData, 'name', 'Client name'),
		contactName: readText(formData, 'contactName'),
		email: readText(formData, 'email'),
		address: readText(formData, 'address')
	};
}
