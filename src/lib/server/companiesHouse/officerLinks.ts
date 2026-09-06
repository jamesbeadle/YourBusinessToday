const appointmentsLinkPattern = /^\/officers\/([^/]+)\/appointments$/;

export function officerIdFromAppointmentsLink(link: string): string {
	const match = appointmentsLinkPattern.exec(link.trim());
	if (match === null) return '';
	return match[1];
}
