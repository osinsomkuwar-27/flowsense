import { Router, Request, Response } from "express";
import { eventStore } from "../../events/eventStore";
import { nowUTC } from "../../utils/timestamp";

const router = Router();
const startTime = Date.now();

router.get("/", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "flowzint-backend",
    timestamp: nowUTC(),
    uptime: Math.floor((Date.now() - startTime) / 1000),
    eventsIngested: eventStore.count(),
  });
});

export default router;