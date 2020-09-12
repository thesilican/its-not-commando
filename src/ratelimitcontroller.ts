export type RateLimitOptions = {
  seconds: number;
  max: number;
};

export class RateLimitController {
  windowMs: number;
  max: number;
  store: Map<string, number[]>;
  constructor(options: RateLimitOptions) {
    this.windowMs = options.seconds * 1000;
    this.max = options.max;
    this.store = new Map();
    if (options.max < 1) {
      throw new Error("Rate limit max amount must be greater or equal to 1");
    }
  }
  hit(id: string, timeMs: number): boolean {
    this.prune(timeMs);
    const requests = this.store.get(id);
    if (!requests) {
      this.store.set(id, [timeMs]);
      return true;
    }
    if (requests.length >= this.max) {
      return false;
    }
    requests.push(timeMs);
    return true;
  }
  prune(timeMs: number) {
    const minTime = timeMs - this.windowMs;
    for (const [id, requests] of this.store.entries()) {
      let splicePoint = requests.length;
      for (let i = 0; i < requests.length; i++) {
        if (requests[i] >= minTime) {
          splicePoint = i;
          break;
        }
      }
      console.log(timeMs, requests, splicePoint);
      requests.splice(0, splicePoint);
      if (requests.length === 0) {
        this.store.delete(id);
      }
    }
  }
  getMsRemaining(id: string, timeMs: number) {
    const requests = this.store.get(id);
    if (!requests || requests.length < this.max) {
      return 0;
    }
    return requests[0] + this.windowMs - timeMs;
  }
}
