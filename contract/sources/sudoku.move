//A smart contract that handle sudoku challenges and rewards
module sudoku::sudoku {
    use std::string;
    use std::vector;
    use std::signer;
    use std::option;
    use aptos_framework::account;
    use aptos_framework::account::SignerCapability;
    use aptos_framework::timestamp;
    use aptos_framework::event::emit;
    use aptos_token_objects::collection;
    #[test_only]
    use kade::accounts::{get_current_username, delegate_get_owner};
    #[test_only]
    use aptos_framework::event::emitted_events;
     #[test_only]
    use aptos_std::debug;
    const SEED: vector<u8> = b"sudoku";
    const SUDOKU_COLLECTION_URI: vector<u8> = b"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROOrr7Vr8r02QzPTp_xIp24YRvJKB75CjFKA&s";

    //error codes
    const EOPERATION_NOT_PERMITTED: u64 = 12;
    const ECHALLENGE_NOT_FOUND: u64 = 13;
    const EUSER_NOT_FOUND: u64 = 14;
    struct Challenge has drop, store, copy {
        id: u64,
        name: string::String,
        difficulty: string::String,
        entry_fee: u64,
        prize_pool: u64,
        users: vector<User>
    }

    struct User has drop, store, copy {
        user_address: address,
        points: u64
    }

    struct ChallengeManager has key, copy {
        challenges: vector<Challenge>,
        next_id: u64
    }

    struct State has key {
        signer_capability: SignerCapability,
    }

    #[event]
    struct ChallengeCreated has store, drop {
        id: u64,
        timestamp: u64,
        name: string::String,
        difficulty: string::String,
        entry_fee: u64,
    }

    #[event]
    struct UserJoinedchallenge has store, drop {
        timestamp: u64,
        name: string::String,
        
    }
    #[event]
    struct PointsUpdated has store, drop {
        timestamp: u64,
        name: string::String,
        difficulty: string::String,
        user: User,
        points: u64
    }

    fun init_module(account: &signer) {
        let (resource_signer, signer_capability) = account::create_resource_account(
            account, SEED
        );
        collection::create_unlimited_collection(
            &resource_signer,
            string::utf8(b"Play Sudoku and win rewards"),
            string::utf8(b"sudoku"),
            option::none(),
            string::utf8(SUDOKU_COLLECTION_URI),

        );
        move_to(&resource_signer, State { signer_capability });
        let challenge_manager = ChallengeManager {
            challenges: vector::empty<Challenge>(),
            next_id: 0
        };
        move_to(&resource_signer, challenge_manager);
    }

    public entry fun create_weekly_challenges(
        admin: &signer, name: string::String, difficulty: string::String, entry_fee: u64
    ) acquires ChallengeManager {
        assert!(signer::address_of(admin) == @sudoku, EOPERATION_NOT_PERMITTED);
        let resource_address = account::create_resource_address(&@sudoku, SEED);
        let manager = borrow_global_mut<ChallengeManager>(resource_address);
        let id = manager.next_id;
        let challenge = Challenge {
            id,
            name,
            difficulty,
            entry_fee,
            prize_pool: 0,
            users: vector::empty<User>()

        };

        vector::push_back(&mut manager.challenges, challenge);
        manager.next_id = id + 1;
        emit(
            ChallengeCreated {
                id,
                timestamp: timestamp::now_seconds(),
                name,
                difficulty,
                entry_fee,
            },
        );

    }

    public entry fun join_challenge(
        user: &signer, name: string::String, difficulty: string::String
    ) acquires ChallengeManager {
        let user_address = signer::address_of(user);
       
        let resource_address = account::create_resource_address(&@sudoku, SEED);
        let manager = borrow_global_mut<ChallengeManager>(resource_address);
        let challenges = manager.challenges;
        for (i in 0..vector::length(&challenges)) {
            let challenge = vector::borrow_mut(&mut challenges, i);
            if (challenge.name == name && challenge.difficulty == difficulty) {
                vector::push_back(
                    &mut challenge.users,
                    User { user_address, points: 0 },
                );
                
            };
            emit(
                    UserJoinedchallenge {
                        timestamp: timestamp::now_seconds(),
                        name,
                        
                    },
                );
        }
    }

    public entry fun update_points(
        name: string::String, difficulty: string::String, user_address: address, points: u64
    ) acquires ChallengeManager{
        let resource_address = account::create_resource_address(&@sudoku, SEED);
        let manager = borrow_global_mut<ChallengeManager>(resource_address);
        let challenges = manager.challenges;
        let (found, index) = vector::find(
            &challenges,
            |_challenge| {
                let challenge: &Challenge = _challenge;
                challenge.name == name && challenge.difficulty == difficulty
            },
        );
        assert!(found, ECHALLENGE_NOT_FOUND);
        let challenge = vector::borrow_mut(&mut challenges, index);
        let users = challenge.users;
        let (found, index) = vector::find(
            &users,
            |_user| {
                let user: &User = _user;
                user.user_address == user_address
            },
        );
        assert!(found, EUSER_NOT_FOUND);
        let user = vector::borrow_mut(&mut users, index);
        user.points = user.points + points;

    }
    #[test]
    fun test_create_weekly_challenge() acquires ChallengeManager
    {
        let admin = account::create_account_for_test(@sudoku);
        let challenge_creator = account::create_account_for_test(@0x3333);
        let aptos = account::create_account_for_test(@0x1);
        timestamp::set_time_has_started_for_testing(&aptos);
        init_module(&admin);
        create_weekly_challenges(&admin, string::utf8(b"Week_1"), string::utf8(b"Easy"), 10);
        let challenges = emitted_events<ChallengeCreated>();
        debug::print<vector<ChallengeCreated>>(&challenges);
     
    }
    #[test]
    fun test_join_challenge() acquires ChallengeManager
    {
        let admin = account::create_account_for_test(@sudoku);
        let user = account::create_account_for_test(@0x3333);
        let aptos = account::create_account_for_test(@0x1);
        timestamp::set_time_has_started_for_testing(&aptos);
        init_module(&admin);
        join_challenge(&user, string::utf8(b"Week_1"), string::utf8(b"Easy"));
        let joins = emitted_events<UserJoinedchallenge>();
        debug::print<vector<UserJoinedchallenge>>(&joins);
        
    }
    #[test]
    fun test_update_points() acquires ChallengeManager{
        let admin = account::create_account_for_test(@sudoku);
        let user = account::create_account_for_test(@0x3333);
        let aptos = account::create_account_for_test(@0x1);
        timestamp::set_time_has_started_for_testing(&aptos);
        init_module(&admin);
        update_points(string::utf8(b"Week_1"), string::utf8(b"Easy"), signer::address_of(&user), 10);
        let points = emitted_events<PointsUpdated>();
        debug::print<vector<PointsUpdated>>(&points);
    }

}
