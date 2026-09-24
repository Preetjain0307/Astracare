interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

// Clean up expired entries every 10 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitMap.entries()) {
    if (entry.resetAt <= now) {
      rateLimitMap.delete(key)
    }
  }
}, 10 * 60 * 1000)

/**
 * Basic in-memory rate limiter for serverless/Next.js API routes
 * Limits key requests to maxRequests per windowMs
 */
export function checkRateLimit(
  key: string,
  maxRequests: number = 5,
  windowMs: number = 15 * 60 * 1000
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now()
  const entry = rateLimitMap.get(key)

  if (!entry || entry.resetAt <= now) {
    rateLimitMap.set(key, {
      count: 1,
      resetAt: now + windowMs,
    })
    return { allowed: true, remaining: maxRequests - 1, retryAfterSeconds: 0 }
  }

  if (entry.count >= maxRequests) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000)
    return { allowed: false, remaining: 0, retryAfterSeconds }
  }

  entry.count += 1
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    retryAfterSeconds: 0,
  }
}
