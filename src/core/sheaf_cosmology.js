import { Q16_ONE, q16Mul, q16Clamp } from './q16.js';

export const ALIGN = {
  CHATTURGHA: 0, // Matter / Flesh (Red)    -> Dominates Xel'lotath
  ULYAOTH: 1,    // Magick / Plane (Blue)   -> Dominates Chattur'gha
  XELLOTATH: 2,  // Sanity / Mind (Green)   -> Dominates Ulyaoth
  MANTOROK: 3    // Corpse-God / Binding    -> Tikhonov Regularizer
};

export const MANTOROK_LAMBDA_Q16 = 98;

export function computeEdgeFrustration(stalkU, stalkV, edgeWeightQ16 = Q16_ONE) {
  const cU = stalkU.at(0), uU = stalkU.at(1), xU = stalkU.at(2), mU = stalkU.at(3);
  const cV = stalkV.at(0), uV = stalkV.at(1), xV = stalkV.at(2), mV = stalkV.at(3);

  const raw =
    q16Mul(cU, xV) + q16Mul(xU, cV) +
    q16Mul(xU, uV) + q16Mul(uU, xV) +
    q16Mul(uU, cV) + q16Mul(cU, uV);

  const mantorokBinding = ((mU + mV) >> 1) + MANTOROK_LAMBDA_Q16;
  const damping = q16Clamp(Q16_ONE - (mantorokBinding >> 2), 8192, Q16_ONE);
  return q16Mul(q16Mul(raw, damping), edgeWeightQ16);
}

export class CosmologySheaf {
  constructor(nodeCount) {
    this.nodeCount = nodeCount;
    this.stalks = Array.from({ length: nodeCount }, () => new Int32Array(4));
    this.edges = [];
    this.sanityQ16 = Q16_ONE;
    this.dirichletEnergyQ16 = 0;
  }

  setNodeAlignment(nodeIdx, alignment, powerQ16 = Q16_ONE) {
    const s = this.stalks.at(nodeIdx);
    s[alignment] = q16Clamp(s[alignment] + powerQ16, 0, Q16_ONE * 4);
  }

  addEdge(u, v, weightQ16 = Q16_ONE) {
    this.edges.push({ u, v, weightQ16 });
  }

  step() {
    let totalFrustration = 0;
    let totalMantorok = 0;
    for (let i = 0; i < this.nodeCount; i++) totalMantorok += this.stalks.at(i).at(ALIGN.MANTOROK);

    for (const edge of this.edges) {
      totalFrustration += computeEdgeFrustration(
        this.stalks.at(edge.u),
        this.stalks.at(edge.v),
        edge.weightQ16
      );
    }

    this.dirichletEnergyQ16 = totalFrustration;
    const drain = totalFrustration >> 6;
    const recovery = (totalMantorok >> 8) + (MANTOROK_LAMBDA_Q16 >> 3);
    this.sanityQ16 = q16Clamp(this.sanityQ16 - drain + recovery, 0, Q16_ONE);

    return { dirichletEnergyQ16: this.dirichletEnergyQ16, sanityQ16: this.sanityQ16 };
  }
}
