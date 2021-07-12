//@ts-ignore
import { LogglyTracker } from 'loggly-jslogger';
import { __PROD__ } from 'utils/constants';

/**
 * Wrapper class for Loggly object.
 */
class Logger {
  private logger: LogglyTracker;
  private tag: string;

  constructor() {
    this.logger = new LogglyTracker();
    this.tag = __PROD__ ? 'production' : 'development';
    this.push({
      logglyKey: process.env.REACT_APP_LOGGLY_CUSTOMER_TOKEN,
      tag: this.tag,
    });
  }

  push(log: any) {
    this.logger.push(log);
  }
}

const useLogger = () => {
  const logger = new Logger();
  return logger;
};

export default useLogger;
