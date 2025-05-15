import { ISender } from "../../infrastructure/contracts/sender.interface";
import { CommandMiddleware } from "./middleware-pipeline";

const BOT_JID = "554588064377".replace(/\D/g, "") + "@s.whatsapp.net";

export const createAuthMiddleware = (sender: ISender): CommandMiddleware => {
  return async ({ message, metadata, command }, next) => {
    const isAdminRequired = metadata?.admin === true;
    const replyTarget = message.isFromGroup() ? message.chatId : message.sender;

    if (isAdminRequired && message.sender !== BOT_JID) {
      await sender.sendText(
        replyTarget,
        `Você não tem permissão para usar o comando: *${command}*`
      );

      console.warn(
        `[Auth] Comando "${command}" bloqueado para: ${message.sender}`
      );
      return;
    }

    await next();
  };
};
