import { AptosConfig, Aptos, Network, Account, Ed25519PrivateKey } from '@aptos-labs/ts-sdk'

const NETWORK = process.env.NEXT_PUBLIC_NETWORK! as Network

const aptosConfig = new AptosConfig({ network: NETWORK ?? Network.TESTNET });
export const aptos = new Aptos(aptosConfig);

export const sudokuAdmin = Account.fromPrivateKey({
    privateKey: new Ed25519PrivateKey(process.env.SUDOKU_ADMIN_PRIVATE_KEY_DO_NOT_EXPOSE!)
})