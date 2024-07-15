import { Account, AccountAddress, Aptos, Ed25519PublicKey, PublicKey, SimpleTransaction, UserTransactionResponse, WriteSetChange } from "@aptos-labs/ts-sdk"
import { Effect } from "effect"
import { TransactionBuildError, TransactionFailedError, TransactionSimulationError, TransactionSubmissionError } from "./errors"
import { FunctionParameter } from "@kade-net/portals-parser"
import { concat } from "lodash"
import { account } from "./account"
const WITHDRAW_EVENT_TYPE = "0x1::coin::WithdrawEvent"
const DEPOSIT_EVENT_TYPE = "0x1::coin::DepositEvent"
const FUNGIBLE_ASSET_METADATA = "0x1::fungible_asset::Metadata"
const MINT_EVENT = '0x4::collection::MintEvent'

interface AcquiredAsset {
    type: 'nft' | 'fungible_asset' | 'none'
    amount: number
    metadata?: {
        image: string
        name: string
    }
}

export interface AccountChanges {
    gas_used: number
    withdrawn_amount: number
    total_amount: number
    acquired_assets: AcquiredAsset[]
    changes?: Array<WriteSetChange>
}



export interface buildPortalTransactionArgs {
    module_function: string,
    module_arguments: string
    type_arguments?: string
    user_address: string
}

export function buildPortalTransaction(aptos: Aptos, args: buildPortalTransactionArgs) {
    const { module_arguments, module_function, type_arguments, user_address } = args
    console.log("Args::", args)

    const task = Effect.tryPromise({
        try: async () => {
            const functionArguments = FunctionParameter.prepareForSubmission(FunctionParameter.deserializeAll(module_arguments))
            const transaction = await aptos.transaction.build.simple({
                sender: AccountAddress.from(user_address),
                data: {
                    function: module_function as any,
                    functionArguments,
                    typeArguments: type_arguments ? type_arguments?.split(",") : []
                },
                options: {
                    expireTimestamp: Date.now() + 1000 * 60 * 60 * 24,
                    maxGasAmount: 100000,
                }
            })

            return transaction

        },
        catch(error) {
            console.log("First Error::", error)

            return new TransactionBuildError({
                originalError: error
            })
        },
    })

    return task
}


interface getSimulationResultArgs {
    transaction: SimpleTransaction
    user_public_key: string
}



export function submitPortalTransaction(aptos: Aptos, transaction: SimpleTransaction) {
    // return Effect.sleep(3000).pipe(
    //     Effect.flatMap(() => Effect.succeed(null))
    // )
    const task = Effect.tryPromise({
        try: async () => {
            // transaction.rawTransaction.payload
            const commitedTxn = await aptos.transaction.signAndSubmitTransaction({
                signer: account!,
                transaction
            })

            console.log("CommitedTxn::", commitedTxn)

            return commitedTxn
        },
        catch(error) {
            console.log("Error::", error)
            return new TransactionSubmissionError({ originalError: error })
        }
    }).pipe(
        Effect.flatMap((commitedTxn) => {
            return Effect.tryPromise({
                try: async () => {
                    const status = await aptos.transaction.waitForTransaction({
                        transactionHash: commitedTxn.hash
                    })

                    if (!status.success) throw new Error("Unable to submit transaction")

                    return commitedTxn.hash
                },
                catch(error) {
                    console.log("Error::", error)
                    return new TransactionFailedError({ originalError: error })
                },
            })
        })
    )

    return task
}
