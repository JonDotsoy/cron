# Changelog

## [0.6.2](https://github.com/JonDotsoy/cron/compare/cron-v0.6.1...cron-v0.6.2) (2025-11-17)


### Bug Fixes

* **cron-format:** add non-null assertions for type safety ([d371e25](https://github.com/JonDotsoy/cron/commit/d371e2528804f0e9008ce0fe33c1801fc671a8ef))

## [0.6.1](https://github.com/JonDotsoy/cron/compare/cron-v0.6.0...cron-v0.6.1) (2025-11-17)


### Bug Fixes

* **cron-format:** enhance step expression formatting for complex cron patterns ([bff7253](https://github.com/JonDotsoy/cron/commit/bff7253af3a2afd6bc7fb101234fe6acabbdaf65))
* **cron-format:** migrate hardcoded strings to locale templates ([ee82490](https://github.com/JonDotsoy/cron/commit/ee8249017fdac7b6056b59a027b21de3645a484a))
* **locales:** add comprehensive hour-step expressions for cron formatting ([56b4179](https://github.com/JonDotsoy/cron/commit/56b41793a71f9f49a5bc95fbdd9ee386525cf03e))

## [0.6.0](https://github.com/JonDotsoy/cron/compare/cron-v0.5.0...cron-v0.6.0) (2025-11-17)


### Features

* **cron:** add Cron.fromSpec() static method for spec-based construction ([66ead84](https://github.com/JonDotsoy/cron/commit/66ead847aa6a8c7fa2157b22f45f673543a0ca3a))
* **cron:** add private fields and getters for cron rule components ([15a45a4](https://github.com/JonDotsoy/cron/commit/15a45a45c897038592826ddf6ff35699309c6e31))
* **cron:** add static take() method to collect next occurrences ([126a1ae](https://github.com/JonDotsoy/cron/commit/126a1ae453125cb1376793e7e67d4a88ba66db8d))
* **utils:** add utility functions for random cron spec generation ([9702932](https://github.com/JonDotsoy/cron/commit/970293229efaa2418a39d6e72e4eb39978df78b4))

## [0.5.0](https://github.com/JonDotsoy/cron/compare/cron-v0.4.0...cron-v0.5.0) (2025-11-17)


### Features

* **colloquial-idioms:** add support for inverted ranges and step expressions in day-of-week ([bb8180f](https://github.com/JonDotsoy/cron/commit/bb8180f24f4dee7780ff428f2c4616343f75a56b))
* **localization:** add minute step expression templates for multiple locales ([ab60cd8](https://github.com/JonDotsoy/cron/commit/ab60cd8e9501d0ed2bc8a9737219adc9be0814e3))

## [0.4.0](https://github.com/JonDotsoy/cron/compare/cron-v0.3.6...cron-v0.4.0) (2025-11-17)


### Features

* **cron-format:** add support for minute step expressions with specific hours ([9101e62](https://github.com/JonDotsoy/cron/commit/9101e6258754e17f43455eedba882f5043ab1665))
* **cron-format:** add support for step expressions in day-of-week and minute fields ([c2da6be](https://github.com/JonDotsoy/cron/commit/c2da6be031936159c71933f5ea959ae24e818f22))
* **idioms:** add support for colloquial language variants in cron formatting ([6835da5](https://github.com/JonDotsoy/cron/commit/6835da53efd883c466fa4b37958852478514c729))
* **year-field:** add support for year field in cron expressions ([b2c9ed8](https://github.com/JonDotsoy/cron/commit/b2c9ed84035687f0b0021879ddbbafb371707ca2))

## [0.3.6](https://github.com/JonDotsoy/cron/compare/cron-v0.3.0...cron-v0.3.6) (2025-11-16)


### Miscellaneous Chores

* release 0.3.6 ([1fe071a](https://github.com/JonDotsoy/cron/commit/1fe071a42420a1f4587757733037c26767a18c1b))

## [0.3.0](https://github.com/JonDotsoy/cron/compare/cron-v0.2.3...cron-v0.3.0) (2025-11-16)


### Features

* **cron-format:** add formatToParts method and Intl.Locale support ([4ccc83a](https://github.com/JonDotsoy/cron/commit/4ccc83ae2a109e688ede429de9243523fef14b1d))
* **cron-format:** add Spanish locale support and improve formatToParts parsing ([6faa6e9](https://github.com/JonDotsoy/cron/commit/6faa6e93c95efb47fadf26dfa2be70966d046c17))

## [0.2.3](https://github.com/JonDotsoy/cron/compare/cron-v0.2.2...cron-v0.2.3) (2025-11-15)


### Miscellaneous Chores

* release 0.2.3 ([95b0b9e](https://github.com/JonDotsoy/cron/commit/95b0b9e70190ee6f5a12bd4be7bfcd1fc5d4ed40))

## [0.2.2](https://github.com/JonDotsoy/cron/compare/cron-v0.2.1...cron-v0.2.2) (2025-11-15)


### Miscellaneous Chores

* release 0.2.2 ([8006609](https://github.com/JonDotsoy/cron/commit/8006609e9226d7082dc2f18665686f83ec5c5fcd))

## [0.2.1](https://github.com/JonDotsoy/cron/compare/cron-v0.2.0...cron-v0.2.1) (2025-11-15)


### Miscellaneous Chores

* release 0.2.1 ([47a4bdf](https://github.com/JonDotsoy/cron/commit/47a4bdf5a4d7e980a2c5274f6da807419ef4e698))

## [0.2.0](https://github.com/JonDotsoy/cron/compare/cron-v0.1.0...cron-v0.2.0) (2025-11-15)


### Features

* **cron:** add Disposable and AsyncDisposable protocol support ([7c7526a](https://github.com/JonDotsoy/cron/commit/7c7526a388e12615ee6f4bdb0e0ccef41a91d390))
* initialize cron project with core implementation ([41f013d](https://github.com/JonDotsoy/cron/commit/41f013d4410be0d3538e91d8394a5d4ed19c58e7))
