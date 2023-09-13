import {ArcLayer} from '@deck.gl/layers';

class ArcBrushingLayer extends ArcLayer {
  // custom shader with step function to create opacity gradient with colorA and colorB
  // More at https://thebookofshaders.com/05/
  getShaders() {
    return Object.assign({}, super.getShaders(), {
      inject: {
        'vs:#decl': `
         uniform float coef;
        `,
        'vs:#main-end': `
        if (coef > 0.0) {
          vec4 pct = vec4(segmentRatio);
          pct.a = step(coef, segmentRatio);
          vec4 colorA = instanceSourceColors;
          vec4 colorB = vec4(instanceTargetColors.r, instanceTargetColors.g, instanceTargetColors.b, 0.0);
          vec4 color = mix(colorA, colorB, pct);
          vColor = color;
        }
                    `,
        'fs:#main-start': `
        if (vColor.a == 0.0) discard;
                    `,
      },
    });
  }

  // overwrite draw function
  draw(opts) {
    const { coef } = this.props;
    // add uniforms
    const uniforms = Object.assign({}, opts.uniforms, { coef });
    super.draw(Object.assign({}, opts, {uniforms}));
  }
}

ArcBrushingLayer.layerName = 'ArcBrushingLayer';

export default ArcBrushingLayer
