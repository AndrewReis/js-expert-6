import { vi } from 'vitest';
import { Readable, Writable } from 'node:stream';

export default class TestUtil {
  static generateReadbleStream(data = []) {
    return new Readable({
      read() {
        for (const item of data) {
          this.push(item);
        }

        this.push(null);
      }
    });
  }

  static generateWritableStream(onData) {
    return new Writable({
      write(chunk, encoding, cb) {
        onData(chunk);

        cb(null, chunk);
      }
    });
  }

  static defaultHandleParams() {
    const requestStream = TestUtil.generateReadbleStream(['Body']);
    const responseStream = TestUtil.generateWritableStream(() => {});

    const data = {
      request: Object.assign(requestStream, {
        headers: {},
        method: '',
        url: ''
      }),
      response: Object.assign(responseStream, {
        writeHead: vi.fn(),
        end: vi.fn(),
      }),
    }

    return {
      values: () => Object.values(data),
      ...data
    }
  }
}