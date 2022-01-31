/* eslint-disable camelcase */
import {expect} from "chai";
import {hexToBytes} from "@noble/hashes/utils";

import {deriveChildSK, deriveMasterSK} from "../src/";
import testVectorsJson from "./vectors/test-vectors.json";

interface IKdfTestVector {
  seed: string;
  master_SK: string;
  child_index: number;
  child_SK: string;
}

describe("key derivation", function () {
  const testVectors: IKdfTestVector[] = testVectorsJson.kdf_tests;

  describe("master key derivation", function () {

    testVectors.forEach((testVector, index) => {
      it(`test vector #${index}`, function () {
        const seed = hexToBytes(testVector.seed.replace("0x", ""));
        const expectedMasterSK = hexToBytes(BigInt(testVector.master_SK).toString(16).padStart(64, "0"));
        const masterSK = deriveMasterSK(seed);
        expect(masterSK).to.be.deep.equal(expectedMasterSK);
      });
    });

  });

  describe("child key derivation", function () {

    testVectors.forEach((testVector, index) => {
      it(`test vector #${index}`, function () {
        const parentSK = hexToBytes(BigInt(testVector.master_SK).toString(16).padStart(64, "0"));
        const index = testVector.child_index;
        const expectedChildSK = hexToBytes(BigInt(testVector.child_SK).toString(16).padStart(64, "0"));
        const childSK = deriveChildSK(parentSK, index);
        expect(childSK).to.be.deep.equal(expectedChildSK);
      });
    });

  });

});
