export type RetryCallbackProps = {
  attempt: number;
};

type callbackType<T = unknown> = (data: RetryCallbackProps) => Promise<T> | T;

async function* createAsyncIterable<T>(
  callback: callbackType<T>,
  retries: number,
  delay: number,
) {
  for (let i = 0; i < retries; i++) {
    const isLastAttempt = i === retries - 1;
    try {
      const data = await callback({ attempt: i });
      yield data;
      return;
    } catch (e: unknown) {
      if (isLastAttempt) {
        if (e instanceof Error) {
          yield e;
          return;
        }
        if (typeof e === "string") {
          yield new Error(e);
          return;
        }
        yield new Error("Retry callback failed with a non-Error value.");
        return;
      }

      yield null;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

export class Retry {
  constructor(
    private readonly maxRetries = 2,
    private readonly retryDelay = 1000,
  ) {}
  async fetch<T = unknown>(
    callback: callbackType<T>,
  ) {
    let lastError = null;
    for await (
      const callbackResult of createAsyncIterable<T>(
        callback,
        this.maxRetries,
        this.retryDelay,
      )
    ) {
      const isError = callbackResult instanceof Error;

      if (callbackResult && !isError) {
        return callbackResult as T;
      }

      if (isError) {
        lastError = callbackResult;
      }
    }

    throw new Error(`Max retries (${this.maxRetries}) exceeded.`, {
      cause: lastError,
    });
  }
}
