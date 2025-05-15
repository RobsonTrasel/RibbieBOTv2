export interface ISender {
  sendText(to: string, text: string): Promise<void>;
}
