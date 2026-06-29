import morgan from "morgan";
import { logger } from "../../logger";
import { StreamOptions } from "morgan";

const stream: StreamOptions = {
  write: (message: string) => logger.http(message.trim()),
};

export const requestLogger = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  { stream }
);