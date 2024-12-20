import { createSymmetricCryptor } from "@hugoalh/symmetric-crypto";
const data = { a: "qwertyuiop" };
const cryptor = await createSymmetricCryptor("<PassWord123456>!!");
const encrypted = await cryptor.encrypt(data);
console.log(encrypted);
// "lST)L-9$J[MPqk)3Pe1qa(;,i)Wi]"4oD9+OE(Hc"
const decrypted = await cryptor.decrypt(encrypted);
console.log(decrypted);
