import * as Bluebird from 'bluebird';
import {
  ChildProcess,
  fork,
} from 'child_process';
import * as path from 'path';
import {
  PATH_ROOT,
} from '../../../config';
import { createPromise } from '../../../utils/create-promise';

// Extend promise and send cp with it
export interface IWebpackCompilePromise<T> extends Bluebird<T> {
  readonly cp: ChildProcess;
}

export const webpackCompile = ({ cfgPath }: { cfgPath: string }) => {
  let childProcess: ChildProcess;
  const killChild = () => {
    childProcess.kill('SIGTERM');
  };
  const { promise, resolve, reject } = createPromise<any>();
  promise.finally(() => {
    // Kill it success or fail
    killChild();
  });

  const handleErrorsCb = (code: number, signal: string | null) => {
    if (code === 0) {
      resolve();
    } else {
      reject(new Error(
        `child process exited with code ${code}` +
          signal === null ? '' : ` and was killed with signal: ${signal}`,
      ));
    }
  };

  process.stdin.setEncoding('utf8');
  const webpackBin = path.join(PATH_ROOT, 'node_modules/webpack/bin/webpack.js');
  childProcess = fork(
    `${webpackBin}`,
    [
      '--config', cfgPath,
    ],
    {
      stdio: 'inherit',
    } as any,
  );
  childProcess.once('error', handleErrorsCb);
  childProcess.once('exit', handleErrorsCb);
  childProcess.once('disconnect', () => { resolve('disconnected'); });

  // If process exits, child follows
  process.once('exit', killChild);
  // catches ctrl+c
  process.once('SIGINT', killChild);
  process.once('uncaughtException', killChild);

  // Attach cp to promise and return that also
  (promise as any).cp = childProcess;

  return promise as IWebpackCompilePromise<any>;
};
