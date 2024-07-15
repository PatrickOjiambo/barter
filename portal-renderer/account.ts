import { Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";
console.log("Private key::", process.env.NEXT_PUBLIC_TEST_PRIVATE_KEY)

export const account = Account.fromPrivateKey({
    privateKey: new Ed25519PrivateKey(process.env.NEXT_PUBLIC_TEST_PRIVATE_KEY!)
})