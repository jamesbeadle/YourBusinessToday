export type ExperienceMode = 'face' | 'divingIn' | 'inside' | 'divingOut';

export type ExperienceListeners = {
	onModeChange: (mode: ExperienceMode) => void;
	onFade: (opacity: number) => void;
};
