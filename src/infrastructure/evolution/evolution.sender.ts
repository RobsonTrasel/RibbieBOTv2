import axios from 'axios';

export class EvolutionSender {
    private readonly baseURL: string;
    private readonly token: string;

    constructor() {
        this.baseURL = process.env.EVOLUTION_API_URL || 'http://localhost:8080';
        this.token = 'E0AC6A14EAA9-47E5-BF04-C56A145AC715';
    }

    public async sendText(to: string, text: string): Promise<void> {
        console.log(to)
        console.log(text)
        await axios.post(
            `${this.baseURL}/message/sendText/${process.env.EVOLUTION_INSTANCE}`,
            {
                number: to,
                text: text
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': this.token
                }
            }
        );
    }
}
