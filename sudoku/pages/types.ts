export interface PortalParams {
    id: string,
    page?: `${number}`,
    user_address?: string,
    back?: string,
    status_message?: string,
    status_message_type?: 'success' | 'error' | 'info',
    position: string,
    sudoku: Array<Array<number>>,
}
export interface SudokuGrid {
    value: number[][];
    solution: number[][];
    difficulty: string;
}

export interface SudokuResponse {
    newboard: {
        grids: SudokuGrid[];
        results: number;
        message: string;
    };
}
