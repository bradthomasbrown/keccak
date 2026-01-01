import { keccak256 } from "@bradthomasbrown/keccak/keccak256";

console.log(keccak256(new Uint8Array()).toHex());
// c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470

const encoder = new TextEncoder();
console.log(keccak256(encoder.encode("hello world")).toHex());
// 47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad