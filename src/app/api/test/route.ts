import { NextRequest, NextResponse } from "next/server";
import { NewRelicLogger } from "@/utils/newrelic-logger";

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    NewRelicLogger.info("API route accessed", {
      path: "/api/test",
      method: "GET",
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    // Simulate some processing time
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Log a custom metric
    NewRelicLogger.recordMetric("api.test.calls", 1);

    // Add custom attributes to the transaction
    NewRelicLogger.addAttributes({
      customAttribute: "test-value",
      requestId: Math.random().toString(36).substring(7),
    });

    const duration = Date.now() - startTime;
    NewRelicLogger.logApiCall("/api/test", "GET", 200, duration);

    return NextResponse.json({
      message: "API test successful",
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    NewRelicLogger.error("API route error", error as Error, {
      path: "/api/test",
      method: "GET",
    });

    NewRelicLogger.logApiCall("/api/test", "GET", 500, duration);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();

    NewRelicLogger.info("POST request received", {
      path: "/api/test",
      method: "POST",
      bodyKeys: Object.keys(body).join(", "),
    });

    // Simulate different outcomes based on input
    if (body.shouldError) {
      throw new Error("Simulated error for testing");
    }

    const duration = Date.now() - startTime;
    NewRelicLogger.logApiCall("/api/test", "POST", 200, duration);

    return NextResponse.json({
      message: "POST request processed",
      received: body,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    NewRelicLogger.error("POST API route error", error as Error, {
      path: "/api/test",
      method: "POST",
    });

    NewRelicLogger.logApiCall("/api/test", "POST", 500, duration);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
