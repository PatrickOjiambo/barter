export interface PortalParams {
    id: string,
    page?: `${number}`,
    user_address?: string,
    back?: string,
    status_message?: string,
    status_message_type?: 'success' | 'error' | 'info'
}