export class Message {
    constructor(
        public readonly chatId: string,
        public readonly sender: string,
        public readonly body: string,
        public readonly timestamp: Date,
        public readonly raw: any
    ) {}

    isFromGroup(): boolean {
        return this.chatId.endsWith('@g.us');
    }

    isEmpty(): boolean {
        return !this.body || this.body.trim().length === 0;
    }
}
