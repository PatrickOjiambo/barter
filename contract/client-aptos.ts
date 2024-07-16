import { AptosConfig, Aptos, Network, Account, Ed25519PrivateKey } from '@aptos-labs/ts-sdk'

const NETWORK = process.env.NEXT_PUBLIC_NETWORK! as Network

const aptosConfig = new AptosConfig({ network: NETWORK ?? Network.TESTNET });
export const clientAptos = new Aptos(aptosConfig);