export type FileDropZoneHandlers = {
	onHover: (isHovering: boolean) => void;
	onDrop: (files: File[]) => void;
};

export function fileDropZone(element: HTMLElement, handlers: FileDropZoneHandlers) {
	let hoverDepth = 0;

	function enter(event: DragEvent): void {
		event.preventDefault();
		hoverDepth += 1;
		handlers.onHover(true);
	}

	function over(event: DragEvent): void {
		event.preventDefault();
		if (event.dataTransfer !== null) event.dataTransfer.dropEffect = 'copy';
	}

	function leave(): void {
		hoverDepth = Math.max(0, hoverDepth - 1);
		if (hoverDepth === 0) handlers.onHover(false);
	}

	function drop(event: DragEvent): void {
		event.preventDefault();
		hoverDepth = 0;
		handlers.onHover(false);
		handlers.onDrop([...(event.dataTransfer?.files ?? [])]);
	}

	element.addEventListener('dragenter', enter);
	element.addEventListener('dragover', over);
	element.addEventListener('dragleave', leave);
	element.addEventListener('drop', drop);

	return {
		update(nextHandlers: FileDropZoneHandlers) {
			handlers = nextHandlers;
		},
		destroy() {
			element.removeEventListener('dragenter', enter);
			element.removeEventListener('dragover', over);
			element.removeEventListener('dragleave', leave);
			element.removeEventListener('drop', drop);
		}
	};
}
