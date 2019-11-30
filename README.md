# BLS KDF & HD Key Utilities

![npm (tag)](https://img.shields.io/npm/v/bls-hd-key/latest)
[![Discord](https://img.shields.io/discord/593655374469660673.svg?label=Discord&logo=discord)](https://discord.gg/aMxzVcr)
![GitHub](https://img.shields.io/github/license/chainsafe/bls-hd-key)

Utility functions for BLS key derivation and managing deterministic account heirarchies.

Implementation is following EIPS: [EIP-2334](https://github.com/ethereum/EIPs/pull/2334), [EIP-2333](https://github.com/ethereum/EIPs/pull/2333)

For common use-cases / higher-level interface, see [@chainsafe/bls-keygen](https://github.com/chainsafe/bls-keygen).

### Example
```typescript

import {deriveMasterSK, deriveChildSK, deriveChildSKMultiple, pathToIndices} from "bls-hd-key";

// Create master private key (according to EIP-2333)

const entropy: Buffer = Buffer.from(...);
const masterKey: Buffer = deriveMasterSK(entropy);

// Create child private key one level deep

const childIndex: number = ...;
const childKey: Buffer = deriveChildSK(masterKey, childIndex);

// Create a child private key `childIndices.length` levels deep

const childIndices: number[] = [...];
const childKey = deriveChildSKMultiple(masterKey, childIndices);

// Convert a "path" into an array of indices (using validation rules of EIP-2334)

cont path = "m/12381/60/0/0";
const childIndices: number[] = pathToIndices(path);

```

### Contrubuting?

Requirements:
- nodejs
- yarn

```bash
    yarn install
    yarn run test
```

### License

Apache-2.0
