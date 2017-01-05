# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## 1.2.8 - 2017-01-05
### Added
- Polish (`pl`) translation added from PR #133 by @kniziol.
### Changed
- Replaced deprecated `.bind()`, `.unbind()`, `.delegate()` and `.undelegate()`
functions by `.on()` and `.off()` for jQuery 3.0.0 compatibility.
- Documented jQueryUI 1.12.0+ requirement for jQuery 3.0.0+.

## 1.2.7 - 2016-12-24
### Added
- Ukranian (`uk`) translation added from PR #131 by @ashep.

## 1.2.6 - 2016-10-28
### Fixed
- Allow focussing and keyboard support on the "map" and "bar" parts.

## 1.2.5 - 2016-10-28
### Fixed
- The "None" and "Transparent" radiobuttons didn't always refresh in certain
color states.
