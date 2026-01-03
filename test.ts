import { keccak256 } from "./src/concrete/keccak256";
import { sha_3, keccak_c } from "./src/keccak.js";

const sha3_256 = sha_3(keccak_c, 512, 0b10, 2);

{
    console.log(keccak256(new Uint8Array()).toHex());
    // c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470

    const encoder = new TextEncoder();
    console.log(keccak256(encoder.encode("hello world")).toHex());
    // 47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad

    // good edge case which can handle rate/capacity/width boundary-crossing due to pre-sponge padding
    const testhex = await Bun.file("testhex.hex").text();
    const testbytes = Uint8Array.fromHex(testhex);
    console.log(keccak256(testbytes).toHex());
    // 4ee967fecb4ba47fa31991baad5ca21b5a40698b53b267c470b66009b3c70823
}


{
    console.log(sha3_256(new Uint8Array()).toHex());
    // a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a

    const encoder = new TextEncoder();
    console.log(sha3_256(encoder.encode("hello world")).toHex());
    // 644bcc7e564373040999aac89e7622f3ca71fba1d972fd94a31c3bfbf24e3938

    // good edge case which can handle rate/capacity/width boundary-crossing due to pre-sponge padding
    const testhex = await Bun.file("testhex.hex").text();
    const testbytes = Uint8Array.fromHex(testhex);
    console.log(sha3_256(testbytes).toHex());
    // 192a3197b4c9200787eeba29997f24240dfd5e3a483ae940a97e9fca9eaa061b
}