const ETH2_COIN_TYPE = 3600;

/**
 * Convert a derivation path to an array of indices,
 * verifying that the path conforms to [EIP-2334](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2334.md)
 * @param coinType - set to null to disable coin type verification
 */
export function pathToIndices(path: string, coinType: number | null = ETH2_COIN_TYPE): number[] {
  if (path.indexOf("'") !== -1) throw new Error("path should not contain \"'\" - hardened keys not supported");
  const components = path.split("/");
  if (components.length < 5) throw new Error("path should contain at least 5 levels separated by '/'");
  if (components[0] !== "m") throw new Error("root should be \"m\" - root of tree");
  // remove "m"
  components.shift();
  // parse levels
  const indices = components.map((level) => Number.parseInt(level));
  if (indices.some(Number.isNaN)) throw new Error("every level must be a number (except the master node)");
  if (!indices.every((i) => i >= 0 && i < 4294967296))
    throw new Error("every level must be within bounds 0 <= i < 2**32");
  if (indices[0] !== 12381) throw new Error("purpose should be '12381' - bls12-381");
  if (coinType) {
    if (indices[1] !== coinType) throw new Error("coin type should match");
  }
  return indices;
}
