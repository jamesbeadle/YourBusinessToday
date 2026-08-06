import type { SubmitFunction } from '@sveltejs/kit';

const fallbackErrorMessage = 'Something went wrong — please try again.';

/**
 * Per-form save state: exposes isSaving while a submission is in flight,
 * blocks double submits, and captures the server's fail() message (or a
 * fallback) into errorMessage for inline display.
 */
export class FormTracker {
	isSaving = $state(false);
	errorMessage = $state<string | null>(null);

	/** Clear any lingering error, e.g. when the form's modal closes. */
	reset(): void {
		this.errorMessage = null;
	}

	/** Build the use:enhance submit function. onSuccess runs after a successful save or redirect. */
	submit(onSuccess?: () => void): SubmitFunction {
		return ({ cancel }) => {
			if (this.isSaving) {
				cancel();
				return;
			}
			this.isSaving = true;
			this.errorMessage = null;
			return async ({ update, result }) => {
				await update();
				this.isSaving = false;
				if (result.type === 'failure') {
					const failureData = result.data as { message?: unknown } | undefined;
					this.errorMessage =
						typeof failureData?.message === 'string' ? failureData.message : fallbackErrorMessage;
				} else if (result.type === 'error') {
					this.errorMessage = fallbackErrorMessage;
				} else {
					onSuccess?.();
				}
			};
		};
	}
}
