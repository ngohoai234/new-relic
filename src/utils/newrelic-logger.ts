import newrelic from "newrelic";

export class NewRelicLogger {
  /**
   * Log an info message to New Relic
   */
  static info(message: string, attributes?: Record<string, any>) {
    console.log(`[INFO] ${message}`, attributes);

    newrelic.recordCustomEvent("AppLog", {
      level: "info",
      message,
      timestamp: new Date().toISOString(),
      ...attributes,
    });
  }

  /**
   * Log an error to New Relic
   */
  static error(
    message: string,
    error?: Error,
    attributes?: Record<string, any>
  ) {
    console.error(`[ERROR] ${message}`, error, attributes);

    if (error) {
      newrelic.noticeError(error, {
        message,
        ...attributes,
      });
    }

    newrelic.recordCustomEvent("AppLog", {
      level: "error",
      message,
      error: error?.message || "",
      stack: error?.stack || "",
      timestamp: new Date().toISOString(),
      ...attributes,
    });
  }

  /**
   * Log a warning to New Relic
   */
  static warn(message: string, attributes?: Record<string, any>) {
    console.warn(`[WARN] ${message}`, attributes);

    newrelic.recordCustomEvent("AppLog", {
      level: "warn",
      message,
      timestamp: new Date().toISOString(),
      ...attributes,
    });
  }

  /**
   * Log custom metrics to New Relic
   */
  static recordMetric(name: string, value: number, unit?: string) {
    newrelic.recordMetric(name, value);

    newrelic.recordCustomEvent("CustomMetric", {
      metricName: name,
      value,
      unit: unit || "count",
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Add custom attributes to the current transaction
   */
  static addAttributes(attributes: Record<string, any>) {
    Object.entries(attributes).forEach(([key, value]) => {
      newrelic.addCustomAttribute(key, value);
    });
  }

  /**
   * Start a custom timing
   */
  static startTiming(name: string): () => void {
    const startTime = Date.now();

    return () => {
      const duration = Date.now() - startTime;
      this.recordMetric(`custom.timing.${name}`, duration, "milliseconds");
      this.info(`Timing completed: ${name}`, {
        duration: `${duration}ms`,
        operation: name,
      });
    };
  }

  /**
   * Log user activity
   */
  static logUserActivity(
    activity: string,
    userId?: string,
    additionalData?: Record<string, any>
  ) {
    this.info(`User activity: ${activity}`, {
      userId,
      activity,
      userAgent:
        typeof window !== "undefined" ? window.navigator.userAgent : "server",
      ...additionalData,
    });
  }

  /**
   * Log API calls
   */
  static logApiCall(
    endpoint: string,
    method: string,
    status: number,
    duration?: number
  ) {
    const isError = status >= 400;
    const logMethod = isError ? this.error : this.info;

    const message = `API Call: ${method} ${endpoint}`;
    const attributes = {
      endpoint,
      method,
      status,
      duration: duration ? `${duration}ms` : "unknown",
      success: !isError,
    };

    if (isError) {
      this.error(message, undefined, attributes);
    } else {
      this.info(message, attributes);
    }

    if (duration) {
      this.recordMetric(
        `api.response_time.${method.toLowerCase()}`,
        duration,
        "milliseconds"
      );
    }
  }
}
