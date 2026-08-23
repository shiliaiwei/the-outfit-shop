export type AppErrorCode =
  | "UNKNOWN"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION"
  | "RATELIMITED"
  | "NETWORK"
  | "SERVER";

export class AppError extends Error {
  public readonly code: AppErrorCode;
  public readonly status?: number;
  public readonly fieldErrors?: Record<string, string[]>;

  constructor(code: AppErrorCode, message: string, meta?: {
    status?: number;
    fieldErrors?: Record<string, string[]>;
    cause?: unknown;
  }) {
    super(message);
    this.name        = "AppError";
    this.code        = code;
    this.status      = meta?.status;
    this.fieldErrors = meta?.fieldErrors;
    if (meta?.cause) (this as any).cause = meta.cause;
  }
}
