import type { Logger } from 'pino';

/** Install last-resort process-level handlers so a stray async error is logged rather than
 *  silently fatal. On an uncaught exception the process state is unknown, so we log and exit
 *  non-zero to let a supervisor restart a clean instance. */
export function installProcessErrorHandlers(logger: Logger): void {
  process.on('unhandledRejection', (reason) => {
    logger.error({ reason }, 'Unhandled promise rejection');
  });
  process.on('uncaughtException', (err) => {
    logger.error(err, 'Uncaught exception, exiting');
    process.exit(1);
  });
}
