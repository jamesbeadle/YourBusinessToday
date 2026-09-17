<script lang="ts">
	import TeamProjectTile from './TeamProjectTile.svelte';
	import { projectTileGridClasses } from './projectTileStyles';
	import type { TeamProject } from '$lib/server/members/getTeamProjects';

	let { projects }: { projects: TeamProject[] } = $props();
</script>

<ul class={projectTileGridClasses}>
	{#each projects as project (project.id)}
		<TeamProjectTile {project} />
	{/each}
</ul>
