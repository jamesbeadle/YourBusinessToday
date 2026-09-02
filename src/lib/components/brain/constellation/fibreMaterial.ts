import { Color, ShaderMaterial, type IUniform } from 'three';
import { fogUniforms, type SharedCellUniforms } from './cellShading';
import { FIBRE_FRAGMENT_SHADER, FIBRE_VERTEX_SHADER } from './fibreShaders';

export type FibreTints = { root: number; span: number; tip: number };

export type FibreAnchoring = 'rootedInSoma' | 'anchoredAtBothEnds';

export type FibreEnd = 'root' | 'tip';

export class FibreMaterial extends ShaderMaterial {
	constructor(
		tints: FibreTints,
		anchoring: FibreAnchoring,
		shared: SharedCellUniforms,
		dimShare: IUniform<number>
	) {
		super({
			uniforms: {
				...fogUniforms(),
				timeSeconds: shared.timeSeconds,
				viewportHeightPixels: shared.viewportHeightPixels,
				dimShare,
				growthShare: { value: 1 },
				growthOrigin: { value: 0 },
				anchoredAtBothEnds: { value: anchoring === 'anchoredAtBothEnds' ? 1 : 0 },
				rootColour: { value: new Color(tints.root) },
				spanColour: { value: new Color(tints.span) },
				tipColour: { value: new Color(tints.tip) }
			},
			vertexShader: FIBRE_VERTEX_SHADER,
			fragmentShader: FIBRE_FRAGMENT_SHADER,
			fog: true
		});
	}

	setGrowth(share: number): void {
		this.uniforms.growthShare.value = share;
	}

	growFrom(end: FibreEnd): void {
		this.uniforms.growthOrigin.value = end === 'tip' ? 1 : 0;
	}
}
