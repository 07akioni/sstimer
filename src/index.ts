export type Timer = {
  invalidate(): void;
  start(): void;
  stop(): void;
  active: boolean;
};

export type TimerOptions = {
  /**
   * Timer duration in millisecond
   */
  duration: number;
};

export function createTimer(
  callback: () => void,
  options: TimerOptions
): Timer {
  let isFinished = false;
  let isInvalidated = false;
  function guardCommand(message: string): boolean {
    if (isInvalidated) {
      console.warn("Timer is invalidated, " + message);
      return true;
    }
    if (isFinished) {
      console.warn("Timer is finished, " + message);
      return true;
    }
    return false;
  }

  let { duration } = options;
  let activeTimerId: number | null = null;
  let startTime: number = 0;
  return {
    invalidate() {
      isInvalidated = true;
      if (activeTimerId !== null) {
        clearTimeout(activeTimerId);
        activeTimerId = null;
      }
    },
    start() {
      if (guardCommand("calling start won't have any effect.")) {
        return;
      }
      if (activeTimerId) {
        console.warn("Timer has already been started.");
        return;
      }
      startTime = Date.now();
      activeTimerId = setTimeout(() => {
        activeTimerId = null;
        isFinished = true;
        callback();
      }, duration);
    },
    stop() {
      if (guardCommand("calling stop won't have any effect.")) {
        return;
      }
      if (activeTimerId) {
        clearTimeout(activeTimerId);
        activeTimerId = null;
        duration -= Date.now() - startTime;
        if (duration <= 0) {
          callback();
          isFinished = true;
        }
      }
    },
    get active () {
      return activeTimerId !== null
    }
  };
}
