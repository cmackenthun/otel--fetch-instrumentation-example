# Overview

This example shows how to
use [@opentelemetry/sdk-trace-web](https://github.com/open-telemetry/opentelemetry-js/tree/main/packages/opentelemetry-sdk-trace-web)
with different plugins and setup to instrument your JavaScript code running in the browser.

## Installation

```sh
# from this directory
npm install
```

## Run the Application

```sh
# from this directory
npm start
```

By default, the application will run on port `8090`.

### Fetch

This example shows how to use the Fetch Instrumentation with the OTLP (`http/json`) Trace exporter and with the B3
Propagator.

Included Components

- FetchInstrumentation
- ZoneContextManager
- OTLPTraceExporter
- WebTracerProvider
- B3Propagator

To see the results, open the browser at <http://localhost:8090/fetch/> and make sure you have the browser console open.
The application is using the `ConsoleSpanExporter` and will post the created spans to the browser console.

## Useful links

- For more information on OpenTelemetry, visit: <https://opentelemetry.io/>
- For more information on web tracing,
  visit: <https://github.com/open-telemetry/opentelemetry-js/tree/main/packages/opentelemetry-sdk-trace-web>

## LICENSE

Apache License 2.0
