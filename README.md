# keccak
This is a simple, minimal implementation of the Keccak paper in TypeScript/JavaScript. 

## Why?
There is surprisingly little information on all aspects of the "cryptographic stack" in JavaScript and elsewhere that is simple and minimal. This repository is part of a series of repositories that builds up this stack from first principles, including:
- [Finite field arithmetic](https://github.com/bradthomasbrown/finite-field)
- [Elliptic curves over finite fields](https://github.com/bradthomasbrown/finite-curve)
- Sponge constructions and Keccak (this repository)
- The concrete instances of secp256k1, Keccak-256, and more as well as how these are made from the above concepts
- ECDSA
- Interacting with EVM nodes
- And potentially more

## Installation
```sh
npm i @bradthomasbrown/keccak
```

## Usage
```js
import { keccak_c, sha_3, sha_3_xof } from "@bradthomasbrown/keccak";

const sha3_224 = sha_3(keccak_c, 448, 0b10, 2);
const sha3_256 = sha_3(keccak_c, 512, 0b10, 2);
const shake_128 = sha_3_xof(keccak_c, 256, 0b1111, 4);
const shake_256 = sha_3_xof(keccak_c, 512, 0b1111, 4);
const keccak_256 = sha_3(keccak_c, 512, 0b0, 0);

console.log(sha3_224(new Uint8Array()).toHex());
// 6b4e03423667dbb73b6e15454f0eb1abd4597f9a1b078e3f5b5a6bc7

console.log(sha3_224(new Uint8Array([1])).toHex());
// 488286d9d32716e5881ea1ee51f36d3660d70f0db03b3f612ce9eda4

console.log(sha3_256(new Uint8Array()).toHex());
// a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a

console.log(sha3_256(new Uint8Array([1])).toHex());
// c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470

console.log(shake_128(new Uint8Array(), 48).toHex());
// 7f9c2ba4e88f827d616045507605853ed73b8093f6efbc88eb1a6eacfa66ef263cb1eea988004b93103cfb0aeefd2a68

console.log(shake_128(new Uint8Array([1]), 48).toHex());
// 44b9b48dabe99470cabbdcd4a155cf1bcd86452388b0a6d5b67e86833677c0824f4cfe95c60638f27cc87663f299f909

console.log(shake_256(new Uint8Array(), 72).toHex());
// 46b9dd2b0ba88d13233b3feb743eeb243fcd52ea62b81b82b50c27646ed5762fd75dc4ddd8c0f200cb05019d67b592f6fc821c49479ab48640292eacb3b7c4be141e96616fb13957

console.log(shake_256(new Uint8Array([1]), 72).toHex());
// 94da6280b240ea6a2ab2cfdf0fb301fd77153d5b748baf796190856803d977ba5cc356e16eea587f2c74c5480c41fea01b45f55abc9722853f30d2a34e7fcdef062e69d6d26c6431

console.log(keccak_256(new Uint8Array()).toHex());
// c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470

console.log(keccak_256(new Uint8Array([1])).toHex());
// 5fe7f977e71dba2ea1a68e21057beebb9be2ac30c6410aa38d4f3fbe41dcffd2
```