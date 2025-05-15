import { CommandMiddleware } from "./middleware-pipeline";
import { ISender } from "../../infrastructure/contracts/sender.interface";

type Timestamp = number;
const attempts = new Map<string, Timestamp[]>();

const defaultRule = {
  max: 5,
  interval: 10_000,
};

const formatInterval = (ms: number): string => {
  const sec = Math.ceil(ms / 1000);
  return `${sec}s`;
};

export const createRateLimitMiddleware = (
  sender: ISender
): CommandMiddleware => {
  return async ({ message, metadata, command }, next) => {
    const key = `${message.chatId}:${message.sender}`;
    const now = Date.now();

    const rule = metadata?.rateLimit || defaultRule;

    const history = attempts.get(key) || [];
    const recent = history.filter((ts) => now - ts < rule.interval);

    if (recent.length >= rule.max) {
      const retryAfter = rule.interval - (now - recent[0]);

      await sender.sendText(
        message.chatId,
        `Calma aí! Você está usando *${command}* rápido demais.\nTente novamente em ${formatInterval(
          retryAfter
        )}.`
      );

      console.warn(`[RateLimit] ${key} bloqueado no comando "${command}"`);
      return;
    }

    attempts.set(key, [...recent, now]);

    await next();
  };
};
