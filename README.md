<img src="https://kekse.biz/github.php?draw&override=github:zsleep" />

<br>

# `zsleep`

My own, better `sleep` replacement.

Pure **Vanilla** JavaScript, \[so\] **without** any dependency.

<br>

> [!NOTE]
> This (Markdown) documentation is still much **TODO**.
> The script itself is **not**, it's ready to be used.

<br><br>

## News
* \[**2026-01-04**\] **Really big improvements and BugFixes**! .. v**2.0.0**;
* \[**2025-12-27**\] A bit more documentation here. Plus new v**1.1.1**;
* \[**2025-12-21**\] Some bugs fixed, better structs, etc... v**1.1.0**;
* \[**2025-12-20**\] Now with splitted short arguments (e.g. `-Pp`); v**1.0.1**;

<br><br>

## Example screenshot
This is an **older**(!) example screenshot, with the status output and the progress bar.

![Example Screenshot](./img/screenshot.png)

<br>

> [!NOTE]
> Running **with_out_** any [ANSI Escape Sequence](https://github.com/kekse1/ansi.js/),
> only using `\r` for the progress bar..

I decided **not** to use any ANSI escape sequence for more compatibility, etc..

If you **really** want some fancy colors and styles (maybe escpecially for the progress bar),
please extend it or [let me know](#contact), so I'll maybe add an **`--ansi`** parameter, etc.

<br><br>

## Source Code
**ZERO** dependencies.

* [Version v**2.0.0**](src/zsleep.js)

<br><br>

## Usage
See `--help / -? / -h` (needs more description/syntax there).

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

* **`ms`** **milliseconds** (the default if no unit string is used)
* **`s`** **seconds**
* **`m`** **minutes**
* **`h`** **hours**
* **`d`** **days**
* **`w`** **weeks**
* **`M`** **months** (upper case!)
* **`y`** **years**

<br>

> [!TIP]
> For best efficiency I'm using (at least one) `setTimeout()` (a big main loop would be worse);
> Since the maximum amount of time is limitted (see my `Math.time.MAX_TIMEOUT`, which is
> (((2 ** 32) / 2) - 1)`), I also implemented kinda 'workaround' for it, so the theoretical
> limit is practically (much) higher.

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

