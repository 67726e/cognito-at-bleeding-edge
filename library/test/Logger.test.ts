
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals'

import { DefaultLogger, Logger } from '../src/Logger';

describe('DefaultLogger', () => {
    let logger: Logger;
    let consoleDebug: any;
    let consoleError: any;
    let consoleInfo: any;

    beforeEach(() => {
        consoleDebug = global.console.debug;
        consoleError = global.console.error;
        consoleInfo = global.console.info;
        
        global.console.debug = jest.fn();
        global.console.error = jest.fn();
        global.console.info = jest.fn();

        logger = new DefaultLogger();
    });

    afterEach(() => {
        // @ts-ignore
        global.console.debug = consoleDebug;
        // @ts-ignore
        global.console.error = consoleError;
        // @ts-ignore
        global.console.info = consoleInfo;
    });

    test('debug', () => {
        logger.debug('this', 'is', 'a', 'debug', {}, 'message');

        expect(global.console.debug).toHaveBeenCalled();
    });

    test('error', () => {
        logger.error('this', 'is', 'an', 'error', {}, 'message');

        expect(global.console.error).toHaveBeenCalled();
    });

    test('info', () => {
        logger.info('this', 'is', 'an', 'info', {}, 'message');

        expect(global.console.info).toHaveBeenCalled();
    });
});
