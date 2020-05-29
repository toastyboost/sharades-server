const {
  createStore,
  createEffect,
  createEvent,
  forward,
  guard,
  sample,
  merge
} = require("effector");

const wait = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

const createCountdown = (
  name,
  {
    start,
    pause = createEvent(`${name}Reset`),
    restart = createEvent(`${name}ReStart`),
    timeout = 1000
  }
) => {
  const tick = createEvent(`${name}Tick`);
  const timer = createEffect(`${name}Timer`).use(() => wait(timeout));

  const $working = createStore(true, { name: `${name}Working` });

  $working
    .on(timer, (_, seconds) => seconds > 0)
    .on(pause, () => false)
    .on(start, () => true);

  guard({
    source: start,
    filter: timer.pending.map(is => !is),
    target: tick
  });

  forward({
    from: tick,
    to: timer
  });

  guard({
    source: timer.done.map(({ params }) => params - 1),
    filter: $working,
    target: tick
  });

  return { tick };
};

module.exports = {
  createCountdown
};
