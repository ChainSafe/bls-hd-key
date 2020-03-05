import assert from "assert";
import SHA256 from "bcrypto/lib/sha256";
import BN from "bn.js";
import {Buffer} from "buffer";

import {getHkdf} from "./crypto";

export function deriveMasterSK(ikm: Buffer): Buffer {
  const okm = getHkdf(ikm, 48, Buffer.from("BLS-SIG-KEYGEN-SALT-", "utf-8"));
  const okmBN = new BN(okm, "hex", "be");
  const r = new BN("52435875175126190479447740508185965837690552500527637822603658699938581184513");
  return Buffer.from(okmBN.mod(r).toArray("be", 32));
}

export function deriveChildSK(parentSK: Buffer, index: number): Buffer {
  assert(index >= 0 && index < 4294967296, "index must be 0 <= i < 2**32");
  const compressedLamportPK = parentSKToLamportPK(parentSK, index);
  return deriveMasterSK(compressedLamportPK);
}

function parentSKToLamportPK(parentSK: Buffer, index: number): Buffer {
  const salt = (new BN(index)).toArrayLike(Buffer, "be", 4);
  const ikm = Buffer.from(parentSK);
  const lamport0 = ikmToLamportSK(ikm, salt);
  const notIkm = Buffer.from(ikm.map((value) => ~value));
  const lamport1 = ikmToLamportSK(notIkm, salt);
  const lamportSK = lamport0.concat(lamport1);
  const lamportPK = lamportSK.map((value) => SHA256.digest(value));
  return SHA256.digest(Buffer.concat(lamportPK));
}

function ikmToLamportSK(ikm: Buffer, salt: Buffer): Buffer[] {
  const okm: Buffer = getHkdf(ikm, 8160, salt);
  return Array.from({length: 255}, (_, i) => okm.slice(i*32, (i+1)*32));
}

export function deriveChildSKMultiple(parentSK: Buffer, indices: number[]): Buffer {
  let key = parentSK;
  indices.forEach(i => key = deriveChildSK(key, i));
  return key;
}
