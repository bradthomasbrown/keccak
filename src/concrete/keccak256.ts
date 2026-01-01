import { sha_3, keccak_c } from "../keccak.js";

const keccak256 = sha_3(keccak_c, 512, 0b0, 0);

export { keccak256 };