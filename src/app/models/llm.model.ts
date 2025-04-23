export interface LlmRequest {
    prompt: string;
    chat_id: number
    file_url?: string;
  }
  
  export interface LlmResponse {
    response: string;
  }