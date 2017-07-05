/**
 * SPA
 */
import * as gulp from 'gulp';
import * as path from 'path';
import {
  PATH_INTERNALS,
} from '../../config';
import { webpackCompile } from './utils/webpack-compile';

gulp.task('build:web', () => {
  return webpackCompile({
    cfgPath: path.join(PATH_INTERNALS, 'webpack/build/spa.ts'),
  });
});
