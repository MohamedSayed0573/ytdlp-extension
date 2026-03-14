import { z } from "zod/v4";

const healthSchema = z.object({
    status: z.literal("ok"),
    uptime: z.string(),
    timestamp: z.string(),
    redisStatus: z.enum(["ready", "connecting", "closed"]),
    ytdlpVersion: z.string(),
});

export default healthSchema;
