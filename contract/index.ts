const MODULE_ADDRESS = "0x6a402b2171d5dbaf9e6ab7fd67dcde225c7bbec42adf10e4036ae54a0091aa8b" as const

const MODULE_NAME = `${MODULE_ADDRESS}::sudoku` as const

export const MODULE_ENTRY_FUNCTIONS = {
    create_weekly_challenges: `${MODULE_NAME}::create_weekly_challenges`,
    join_challenge: `${MODULE_NAME}::join_challenge`,
    update_points: `${MODULE_NAME}::update_points`,
} as const