//A smart contract that handle sudoku challenges and rewards
module barter::barter {

    use std::string;
    use std::vector;
    use std::signer;
    use std::option;
    use aptos_framework::account;
    use aptos_framework::account::SignerCapability;
    use aptos_framework::timestamp;
    use aptos_framework::event::emit;
    use aptos_token_objects::collection;

    const SEED: vector<u8> = b"BARTER";
    const BARTER_COLLECTION_URI: vector<u8> = b"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROOrr7Vr8r02QzPTp_xIp24YRvJKB75CjFKA&s";

    //error codes
    const EOPERATION_NOT_PERMITTED: u64 = 12;

    struct Challenge has key, store {

        name: string::String,
        difficulty: string::String,
        entry_fee: u64,
        prize_pool: u64,
        users: vector<address>
    }

    struct State has key {
        signer_capability: SignerCapability,
    }

    #[event]
    struct ChallengeCreated has store,drop{
        timestamp: u64,
        name: string::String,
        difficulty: string::String,
        entry_fee: u64,
    }

    #[event]
    struct UserJoinedchallenge {
        timestamp: u64,
        name: string::String,
        user: address
    }

    fun init_module(account: &signer) {
        let (resource_signer, signer_capability) = account::create_resource_account(
            account, SEED
        );
        collection::create_unlimited_collection(
            &resource_signer,
            string::utf8(b"Play Sudoku and win rewards"),
            string::utf8(b"barter"),
            option::none(),
            string::utf8(BARTER_COLLECTION_URI),

        );
        move_to(&resource_signer, State { signer_capability })
    }

    public entry fun create_weekly_challenges(
        admin: &signer, name: string::String, difficulty: string::String, entry_fee: u64
    ) {
        assert!(signer::address_of(admin) == @barter, EOPERATION_NOT_PERMITTED);
        let challenge = Challenge {
            name,
            difficulty,
            entry_fee,
            prize_pool: 0,
            users: vector::empty<address>(),
        };
        move_to(admin, challenge);
        emit(ChallengeCreated {
            timestamp: timestamp::now_seconds(),
            name,
            difficulty,
            entry_fee,
        });

    }
}
