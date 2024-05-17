const { ConsoleSpanExporter, BatchSpanProcessor } = require( '@opentelemetry/sdk-trace-base');
const { WebTracerProvider } = require( '@opentelemetry/sdk-trace-web');
const { FetchInstrumentation } = require( '@opentelemetry/instrumentation-fetch');
const { ZoneContextManager } = require( '@opentelemetry/context-zone');
const { B3Propagator } = require( '@opentelemetry/propagator-b3');
const { registerInstrumentations } = require( '@opentelemetry/instrumentation');
const { diag, DiagConsoleLogger, DiagLogLevel } = require( '@opentelemetry/api');

const provider = new WebTracerProvider();

// Note: For production consider using the "BatchSpanProcessor" to reduce the number of requests
// to your exporter. Using the SimpleSpanProcessor here as it sends the spans immediately to the
// exporter without delay
provider.addSpanProcessor(new BatchSpanProcessor(new ConsoleSpanExporter()));
provider.register({
  contextManager: new ZoneContextManager(),
  propagator: new B3Propagator(),
});

registerInstrumentations({
  instrumentations: [
    new FetchInstrumentation({
      ignoreUrls: [/localhost:8090\/sockjs-node/],
      propagateTraceHeaderCorsUrls: [
        'https://cors-test.appspot.com/test',
        'https://httpbin.org/get',
      ],
      clearTimingResources: true,
    }),
  ],
});

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const getData = (url) => fetch(url, {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// example of keeping track of context between async operations
const prepareClickEvent = () => {
  const url = 'https://httpbin.org/get';

  const element0 = document.getElementById('button0');
  const element1 = document.getElementById('button1');
  const element2 = document.getElementById('button2');

  const callGet = async () => {
    console.log('fetch start', window.performance.now())
    await getData(url)
    console.log('fetch end', window.performance.now())
  };
  const callFlush = async () => {
    console.log('flush start', window.performance.now())
    await provider.forceFlush()
    console.log('flush end', window.performance.now())
  };
  const callRedirect = () => {
    console.log('window open start', performance.now())
    window.open('https://google.com', '_self')
    console.log('window open end', performance.now())
  };

  const getThenWaitThenFlushThenRedirect = async () => {
    await callGet()
    console.log('wait start', performance.now())
    await new Promise((resolve) => setTimeout(() => resolve(), 1000))
    console.log('wait end', performance.now())
    await callFlush();
    callRedirect();
  }

  const getThenFlushThenRedirect = async () => {
    await callGet()
    await callFlush()
    callRedirect();
  }

  element0.addEventListener('click', callGet);
  element1.addEventListener('click', getThenWaitThenFlushThenRedirect);
  element2.addEventListener('click', getThenFlushThenRedirect);
};

window.addEventListener('load', prepareClickEvent);
