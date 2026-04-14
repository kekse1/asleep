<img src="https://kekse.biz/github.php?draw&override=github:zsleep" />

<br>

# `zsleep`

My own, better `sleep` replacement (see `man 1 sleep`).

Pure **Vanilla** JavaScript - with**out** any dependency (except the
[Node.js](https://nodejs.org/) JavaScript interpreter).

<br><br>

## News
* \[**2026-04-15**\] More improvements.. best version for now. v**2.2.10**;
* \[**2026-04-15**\] Improvements.. v**2.2.9**;
* \[**2026-04-15**\] See `DEFAULT_ANSI`, v**2.2.8**;
* \[**2026-04-14**\] See `DEFAULT_FIX`, v**2.2.7**;
* \[**2026-04-09**\] New parameter `-S / --string` (w/ `#` => `/`), v**2.2.6**;
* \[**2026-03-07**\] Appended `--no-warnings=MODULE_TYPELESS_PACKAGE_JSON` to the **Shebang**, v**2.2.5**;
* \[**2026-03-04**\] For compatibility I just changed default unit to seconds! v**2.2.4**.
* \[**2026-02-05**\] Last change: correct `SIGINT` handling!! v**2.2.3**;
* \[**2026-02-05**\] Another change: fixed the `Math.time.parse()`!
* \[**2026-02-04**\] Additionally a new **`--seconds`** parameter, and threw `.toLocaleString()` away; v**2.2.2**!
* \[**2026-02-04**\] BugFix for wrong second count in progress view, v**2.2.1**;
* \[**2026-01-11**\] Extended date/time functionality (but w/ more TODO), v**2.2.0**;
* \[**2026-01-06**\] **Really big improvements and BugFixes**! .. v**2.1.1**;
* \[**2025-12-27**\] A bit more documentation here. Plus new v**1.1.1**;
* \[**2025-12-21**\] Some bugs fixed, better structs, etc... v**1.1.0**;
* \[**2025-12-20**\] Now with splitted short arguments (e.g. `-Pp`); v**1.0.1**;

<br><br>

## Index
* [Example Screenshot](#example-screenshot)
* [Source Code](#source-code)
* [Usage](#usage)
    * [Units](#units)
* [Installation](#installation)
* [Exports and Extensions](#exports-and-extensions)
    * [My really tiny `getopt` interpretation](#my-really-tiny-getopt-interpretation)
* [You're welcome!](#youre-welcome)
* [Contact](#contact)
* [Copyright and License](#copyright-and-license)

<br><br><br><br>

## Example screenshot
This is an example screenshot (v**2.1.1**); which is **not** the newest version
(with more accurate Date/Time outputs and other improvements).

![Example Screenshot](./img/screenshot.png)

<br>

> [!NOTE]
> Running **with_out_** any [ANSI Escape Sequence](https://github.com/kekse1/ansi.js/),
> only using `\r` for the progress bar..

I decided **not** to use any ANSI escape sequence for more compatibility, etc..

If you **really** want some fancy colors and styles (maybe escpecially for the progress bar),
please extend it or [let me know](#contact), so I'll maybe add an **`--ansi`** parameter, etc.

<br>

\[**update**\] Now with enabled `DEFAULT_ANSI` I'm using ONLY the sequences to show and hide
your cursor. Totally optional (but enabled by default). If you do **not** want 'em, there's
nevertheless another fix which prevents that the cursor hides some output or so.

I'm also thinking about colored output (mostly for the progress bar), which looks nice, but
I'm also not sure about it... maybe in the **future**.

<br><br>

## Source Code
**ZERO** dependencies.

* [Version v**2.2.10**](src/zsleep.js) (updated **2026-04-15**);

<br><br>

## Usage
See **`--help / -? / -h`** (needs more description/syntax there).

Basically, call this script with one or multiple parameter(s) with time(s)
that'll get parsed (see `Math.time.parse()`). It just "waits" for the end.

Additionally you can also use `--print / -p` and/or `--progress / -P`.

If you abort the timeout via **`SIGINT`** (using `<Ctrl>+<c>`), it'll
return with exit code (1). Exit code (2) if time sum is negative. And
the other ones can be found in the source code..

> [!TIP]
> The time parser also accepts negative parts for **subtraction** (beneath
> floating points), e.g. `+4m-0.5m` (equals `210000` milliseconds, so
> `3 minutes, 30 seconds`).

<br>

### Units
As you can see in the script itself (look for the `Math.time.{parse,render}()` functions),
we're supporting here the following units and it's abbreviations (you can use after every
value (e.g. `5m-0.5m`)):

* **`ms`** **milliseconds**
* **`s`** **seconds** (the default unit, when no such suffix is set)
* **`m`** **minutes**
* **`h`** **hours**
* **`d`** **days**
* **`w`** **weeks**
* **`o`** **months**
* **`y`** **years**

> [!TIP]
> **YES**; you can use **floating point numbers**, e.g. `0.5m` for 30 seconds.

> [!TIP]
> **AND**: you can also use `-` and `+` for a bit of arithmetics, e.g. `1m-10s` for 50 seconds..

<br>

> [!NOTE]
> For best efficiency I'm using (at least one) `setTimeout()` (a big main loop would be worse);
> Since the maximum amount of time is limitted (see my `Math.time.MAX_TIMEOUT`, which is
> `(((2 ** 32) / 2) - 1)`), I also implemented kinda 'workaround' for it, so the theoretical
> limit is practically (much) higher.

<br>

## Installation
I assume you've got **root** access to your Linux machine?

You can install this script it in several ways. I'd recommend to do it this way.

* Copy the script iself to `/usr/local/bin/zsleep`.
* Add an alias like `alias sleep="zsleep -pP"`.

For the alias you could, for instance, just set the `alias` command in a file like
`/etc/profile.d/zsleep.sh`. It should (actually) automatically be called on login.

The `-pP` parameters in the alias above are **optional**. But I like it that way! :-)

<br>

If you only got user permissions on your Linux box, you can also use this script,
but you need to add the path to it to your local `$PATH` variable - wherever it is
(same for the alias).

<br><br>

#### [Node.js](https://nodejs.org/)
You only need to have an installed [Node.js](https://nodejs.org/) (the JavaScript interpreter,
for the server-side). So **maybe** you're also interested in my
[`make-nodejs.sh`](https://github.com/kekse1/scripts/#make-nodejssh)?

<br><br>

## Exports and Extensions
I'm exporting the maths from my `Math.time` extensions:

* `Math.time(_item)`
* `Math.time.parse(_value, _timeout)`
* `Math.time.render(_value, _millisec, _long, _sep)`
* `Math.time.MAX_TIMEOUT`

Additionally, since I needed 'em here, this `Math` extensions:

* `Math.round(_value, _prec)`
* `Math.int(_value, _prec, _inverse)`
* `Math.sign(_item, _string)`

Plus these ones:

* `console.width`
* `console.height`
* `console.ttyStream`

And this:

* `String.prototype.repeat(_count)`
* `Date.prototype.toString(_locale, _options)`
* `Date.currentLocale`

<br>

### My really tiny `getopt` interpretation
Because I really wanted to eliminate any dependency, I decided to use my own,
very **little** `getopt` interpretation (especially made for this script).
It's really limited, but supports everything we really need and wish,
including multiple short parameters (like `-pP`), plus the necessary
values for some less getopt-ions, and, of course, the mandatory `--`
parameter 'stop sign'.

<br><br>

## You're welcome!
Any feature idea is welcome! If you have one, please [contact](#contact) me!

<br><br><br>

# Contact

<img src="https://kekse.biz/github.php?override=github:zsleep&draw&text=zsleep@kekse.biz&angle=6&size=24px&fg=150,20,90&font=OpenSans&ro&readonly&h=64&v=16" />

# Copyright and License
The Copyright is [(c) Sebastian Kucharczyk](./COPYRIGHT.txt),
and it's licensed under the [MIT](./LICENSE.txt) (also known as 'X' or 'X11' license).

<a href="https://kekse.biz/">
<img src="favicon.png" alt="Favicon" />
</a>

