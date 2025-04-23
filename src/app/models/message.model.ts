export interface Message {
    id: number;
    content: string;
    chat: number;
    user: number;
    file?: number | null;
}