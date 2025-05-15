import axios from "axios";
import { ISender } from "../contracts/sender.interface";

export class EvolutionSender implements ISender {
  private readonly baseURL: string;
  private readonly token: string;

  constructor() {
    this.baseURL = process.env.EVOLUTION_API_URL || "http://localhost:8080";
    this.token = "E0AC6A14EAA9-47E5-BF04-C56A145AC715";
  }

  public async sendText(to: string, text: string): Promise<void> {
    const number = to.trim();

    try {
      await axios.post(
        `${this.baseURL}/message/sendText/${process.env.EVOLUTION_INSTANCE}`,
        {
          number,
          text,
        },
        {
          headers: {
            "Content-Type": "application/json",
            apikey: this.token,
          },
        }
      );
    } catch (error: any) {
      if (error.response) {
        console.error(
          `[SENDTEXT] Erro ao enviar mensagem | Status: ${error.response.status}`
        );
        console.error(`[SENDTEXT] Corpo do erro:`, error.response.data);
      } else if (error.request) {
        console.error(
          `[SENDTEXT] Sem resposta da API Evolution`,
          error.request
        );
      } else {
        console.error(`[SENDTEXT] Erro inesperado:`, error.message);
      }
    }
  }
}
