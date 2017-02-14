const load = require('loadware');

// Pass an array of modern middleware and return a single modern middleware
module.exports = (...middles) => ctx => load(middles).reduce((prev, next) => {

  const handler = err => {
    ctx.error = err;
    if (next.error && next instanceof Function) next.error(ctx);
  };

  // Make sure that we pass the original context to the next promise
  // Catched errors should not be passed to the next thing
  return prev.catch(handler).then(fake => ctx).then(next).then(fake => ctx);

// Get it started with the right context
}, Promise.resolve(ctx));
