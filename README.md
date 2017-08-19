# Sandworm [![CircleCI](https://circleci.com/gh/ccarpita/sandworm.svg?style=svg)](https://circleci.com/gh/ccarpita/sandworm)

> The Worm is the Spice!  The Spice is the Worm!
> --Paul

Sandworm is a library for easily mapping WWW and local file sources into an observable stream of structured records, which can be transformed using RxJS-operators.  It supports depth-first website crawling, DOM node extraction, and CSV/TSV files.  The common use of RxJS Observable objects in the API allows straightforward integrations with custom data sources and sinks.

## Dependencies

The dependencies of Sandworm are rolled up into a single distribution file, which is integration-tested (TODO) in addition to the component-level unit tests (TODO).

| Name    | Version | Purpose |
| ------- | ------- | ------- |
| rxjs    | 5       | Used as the base library for Observable primitives which are extended with additional functionality (see: lib/rx-ext) |
| cheerio | 0.22.0  | Provides jQuery-style expressions for DOM extraction, powering the `.extract()` API. |


## Install

Yarn:
```
yarn add -D sandworm
```

NPM;
```
npm install -D sandworm
```


## Usage and API

The 'sandworm' module exports a set of Sources that can be used to collect data as an Observable sequence, and Sinks that conform to the Observer spec for transformed data collection.  Also the all-inclusive `Rx` module is exported to allow additional extensions of the `Observable` prototype

### Builder

Note that all Source and Sink objects will conform to an immutable builder pattern, in which the modules are callable to return a default implementation, or parameterized in a fluent manner.


### TsvSource

A Builder which generates an Observable sequence of structured records from a TSV File.

| Parameter | Description |
| --------  | ----------- |
| path | The path to a local TSV file.  If not specified, process.stdin will be used.
| schema | A comma-separated list of field names to use

Example:

```js

/* my_file.tsv */
01\tName1\n
02\tName2\n


/* my_source.js */
TsvSource.path('my_file.tsv').schema('id,name').read()
  .subscribe(record => console.log(record));

// Prints:
// {id: '01', name: 'Name1'}
// {id: '02', name: 'Name2'}
```


## Cookbook

### Crawl Wikipedia to create a TSV of dog names and descriptions

```js
import { WebSource, TsvSink } from 'sandworm';

WebSource.delay(1000)
  .open('https://en.wikipedia.org/wiki/List_of_dog_breeds')
  .find('table.wikitable tr td:first')
  .follow()
  .map(page => ({
    title: page.find('h1').text(),
    desc: page.find('.mw-parser-output > p:first').text(),
    image: page.find('.infobox > img')
  }))
  .subscribe(TsvSink())
```
