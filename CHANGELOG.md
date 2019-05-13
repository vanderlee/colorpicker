# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## 1.2.18 - 2019-05-13
### Added
- Merged PR #159 by @NicolasCARPi; Added `cancelOnExit` option in response to #158.

## 1.2.17 - 2018-07-15
### Fixed
- Merged PR #148 by @teambuktu; Input event for ui-colorpicker-number.

## 1.2.16 - 2018-02-19
### Fixed
- Merged PR #145 by @gentoo90; accept numpad keys on hex inputs.

## 1.2.15 - 2018-02-12
### Fixed
- Fix #144 by @Backslider23; memory part doesn't enable OK button correctly.
- Fixed black initialization issue in rgbslider part.

## 1.2.14 - 2017-12-10
### Added
- PR #143 by @zaeder; `ready` event at end of widget creation.

## 1.2.13 - 2017-05-02
### Fixed
- Fix #137 by @larsinsd; Typing in hex input does not enable OK button.
- Fix #139 by @s1738berger; Colorpicker cannot get disabled with option
	'buttonImageOnly'
- Fix #130 by @actionpark; Return `css` and `hex` color in all events.

## 1.2.12 - 2017-03-29
### Fixed
- Fixed #136 by @mateuszf; Cannot disable animation.

## 1.2.11 - 2017-03-29
### Fixed
- Fixed #134 by @larsinsd and @justzuhri; `Ctrl+V` not working on Mac OS-X.

## 1.2.10 - 2017-03-29
### Added
- Added Copic color swatches.
- Added Prismacolor color swatches.
- Added DIN 6164 color swatches.
- Added ISCC-NBS color swatches.

## 1.2.9 - 2017-01-21
### Fixed
- Implemented fix #135 by @cosmicnet; replaced `.attr()` calls with `.prop()`.

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
