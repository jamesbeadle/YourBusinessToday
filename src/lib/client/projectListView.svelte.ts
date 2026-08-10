import type { ProjectStatus } from '$lib/data/projectStatus';
import type { ProjectSummary } from '$lib/server/projects/getProjectList';

const projectsPerPage = 10;

/**
 * Client-side view state for the projects list: search and status filtering
 * with instant results, paged into fixed-size chunks. Changing a filter
 * returns to the first page; the page number always stays within range.
 */
export class ProjectListView {
	#searchText = $state('');
	#selectedStatus = $state<ProjectStatus | 'all'>('all');
	#pageNumber = $state(1);
	#allProjects: () => ProjectSummary[];

	constructor(allProjects: () => ProjectSummary[]) {
		this.#allProjects = allProjects;
	}

	get searchText(): string {
		return this.#searchText;
	}

	set searchText(value: string) {
		this.#searchText = value;
		this.#pageNumber = 1;
	}

	get selectedStatus(): ProjectStatus | 'all' {
		return this.#selectedStatus;
	}

	set selectedStatus(value: ProjectStatus | 'all') {
		this.#selectedStatus = value;
		this.#pageNumber = 1;
	}

	get pageNumber(): number {
		return Math.min(this.#pageNumber, this.pageCount);
	}

	set pageNumber(value: number) {
		this.#pageNumber = Math.max(1, Math.min(value, this.pageCount));
	}

	get filteredProjects(): ProjectSummary[] {
		return this.#allProjects().filter((project) => this.#matchesFilters(project));
	}

	get pageCount(): number {
		return Math.max(1, Math.ceil(this.filteredProjects.length / projectsPerPage));
	}

	get firstPositionNumber(): number {
		return (this.pageNumber - 1) * projectsPerPage + 1;
	}

	get pagedProjects(): ProjectSummary[] {
		const firstProjectIndex = this.firstPositionNumber - 1;
		return this.filteredProjects.slice(firstProjectIndex, firstProjectIndex + projectsPerPage);
	}

	get countLabel(): string {
		const totalCount = this.#allProjects().length;
		const filteredCount = this.filteredProjects.length;
		const noun = totalCount === 1 ? 'project' : 'projects';
		if (filteredCount === totalCount) return `${totalCount} ${noun}`;
		return `${filteredCount} of ${totalCount} ${noun}`;
	}

	#matchesFilters(project: ProjectSummary): boolean {
		const matchesStatus =
			this.#selectedStatus === 'all' || project.status === this.#selectedStatus;
		const matchesSearch = project.name
			.toLowerCase()
			.includes(this.#searchText.trim().toLowerCase());
		return matchesStatus && matchesSearch;
	}
}
