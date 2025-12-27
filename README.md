<img src="https://kekse.biz/github.php?draw&override=github:zsleep" />

<br>

# `zsleep`

My own, better `sleep` replacement. Vanilla JavaScript, **without** any dependency.

> [!NOTE]
> This Documentation is **maximum TODO**!

The script already works well. Even though I'll extend it a bit, s00n.

<br><br>

## News
* \[**2025-12-27**\] A bit more documentation here. Plus new v**1.1.1**;
* \[**2025-12-21**\] Some bugs fixed, better structs, etc... v**1.1.0**;
* \[**2025-12-20**\] Now with splitted short arguments (e.g. `-Pp`); v**1.0.1**;

<br><br>

## Example screenshot
There's more. Also a 'silent' mode without any output (which is the default config).
But this is my example now.

![Example Screenshot](./img/screenshot.png)

<br>

> [!NOTE]
> This time **without** any [ANSI Escape Sequence](https://github.com/kekse1/ansi.js/),
> only using `\r` for the progress bar..

<br><br>

## Source Code
**ZERO** dependencies.

* [Version v**1.1.1**](src/zsleep.js)

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
> floating points), e.g. `+4m-0.5m`.

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

