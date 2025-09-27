const { Redis } = require('ioredis');

// Use an in-memory mock when running tests to avoid touching production Redis
if (process.env.NODE_ENV === 'test' || process.env.REDIS_MOCK === 'true') {
  const store = new Map();
  const timers = new Map();

  const redisMock = {
    set: (key, value, ...args) => {
      // support signature like set(key, value, 'EX', seconds)
      if (args.length >= 2 && String(args[0]).toUpperCase() === 'EX') {
        const seconds = Number(args[1]) || 0;
        store.set(key, value);
        if (timers.has(key)) clearTimeout(timers.get(key));
        const t = setTimeout(() => {
          store.delete(key);
          timers.delete(key);
        }, seconds * 1000);
        // ensure the timer won't keep the event loop open during tests
        if (typeof t.unref === 'function') t.unref();
        timers.set(key, t);
      } else {
        store.set(key, value);
      }
      return Promise.resolve('OK');
    },
    get: (key) => Promise.resolve(store.has(key) ? store.get(key) : null),
    del: (key) => {
      const existed = store.delete(key);
      if (timers.has(key)) {
        clearTimeout(timers.get(key));
        timers.delete(key);
      }
      return Promise.resolve(existed ? 1 : 0);
    },
    on: () => {},
    quit: () => {
      // clear all pending timers to avoid open handles
      for (const [, t] of timers) {
        try { clearTimeout(t); } catch (e) {}
      }
      timers.clear();
      store.clear();
      return Promise.resolve();
    },
    disconnect: () => {
      for (const [, t] of timers) {
        try { clearTimeout(t); } catch (e) {}
      }
      timers.clear();
      store.clear();
      return Promise.resolve();
    },
  };

  module.exports = redisMock;
} else {
  const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  });

  redis.on('connect', () => {
    console.log('Connected to Redis');
  });

  module.exports = redis;
}