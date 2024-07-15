import { AccountAuthenticator, AnyRawTransaction, Deserializer, RawTransaction, Serializer } from "@aptos-labs/ts-sdk"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


interface serializeAuthenticatorArgs {
  authenticator: AccountAuthenticator
}

export async function serializeAuthenticator(args: serializeAuthenticatorArgs) {
  const serializer = new Serializer()
  args.authenticator.serialize(serializer)
  const sig_u8 = serializer.toUint8Array()
  const data = Array.from(sig_u8)

  return data
}

interface serializeTransactionArgs {
  transaction: AnyRawTransaction
}

export async function serializeTransaction(args: serializeTransactionArgs) {
  const serializer = new Serializer()
  args.transaction.serialize(serializer)
  const sig_u8 = serializer.toUint8Array()
  const data = Array.from(sig_u8)

  return data
}

interface deserializeAuthenticatorArgs {
  data: Array<number>
}

export async function deserializeAuthenticator(args: deserializeAuthenticatorArgs) {
  const deserializer = new Deserializer(new Uint8Array(args.data))
  const authenticator = AccountAuthenticator.deserialize(deserializer)
  return authenticator
}

interface deserializeTransactionArgs {
  data: Array<number>
}

export async function deserializeTransaction(args: deserializeTransactionArgs) {
  const deserializer = new Deserializer(new Uint8Array(args.data))
  const transaction = RawTransaction.deserialize(deserializer)
  return transaction
}