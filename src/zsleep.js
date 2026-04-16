#!/usr/bin/env -S node --no-warnings=MODULE_TYPELESS_PACKAGE_JSON

/*
 * Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
 * https://kekse.biz/  https://github.com/kekse1/zsleep/
 */

//
const
	VERSION = '2.4.7';

//
const
	DEFAULT_SECONDS = false,
	DEFAULT_MILLISEC = true,
	DEFAULT_PRECISION = 2,
	DEFAULT_LONG = true,
	DEFAULT_SEP = ', ',
	DEFAULT_STRING = '/',
	DEFAULT_FIX = true,
	DEFAULT_CURSOR = true,
	DEFAULT_COLOR = true,
	DEFAULT_REFRESH = 1000,
	DEFAULT_COMMENT = false;

//
const COLOR = { 'bracket': [ 220, 255, 0 ], bold: true,
	done: { fg: [ 230, 200, 60 ], bg: null },
	todo: { fg: [ 90, 160, 170 ], bg: null } };

//
const
	MAX_TIME = (((2 ** 32) / 2) - 1); // please do not change.. it's the javascript default maximum for `set{Timeout,Interval}()`;

//
const GETOPT_LONG = [
	'verbose',
	'',
	'print',
	'progress',
	'',
	'refresh',
	'',
	'seconds',
	'',
	'precision',
	'offset',
	'',
	'string',
	'color',
	'',
	'info',
	'',
	'copyright',
	'version',
	'',
	'help'
];

const GETOPT_SHORT = {
	'v': 'verbose',
	'p': 'print',
	'P': 'progress',
	'r': 'refresh',
	's': 'seconds',
	'n': 'precision',
	'o': 'offset',
	'S': 'string',
	'c': 'color',
	'I': 'info',
	'C': 'copyright',
	'V': 'version',
	'?': 'help',
	'h': 'help'
};

const GETOPT_VALUES = [
	'precision',
	'refresh',
	'offset',
	'string'
];

const GETOPT_HELP = {
	'verbose': 'Combinated `-pP` (otherwise all invisible)',
	'print': 'Show time counting infos',
	'progress': 'Show progress bar',
	'refresh': 'Refresh rate [ 0 .. ' + MAX_TIME + ' ] milliseconds',
	'seconds': 'Plain seconds left to the progress bar',
	'precision': 'Rounding precision [ 0 .. ]',
	'offset': 'If you\'d like another starting point',
	'string': 'Progress bar string (e.g. `#` or `/\\`)',
	'color': 'Progress bar colors (w/ ANSI Escape Sequences)',
	'info': 'Short info about this application',
	'copyright': '',//'FYI'
	'version': '',//Your current version of this tool',
	'help': 'Print out this help page'
};

//
var PRECISION =
	DEFAULT_PRECISION;

//
Reflect.defineProperty(global, 'MAX_TIME',
	{ get: () => MAX_TIME });

const time = Math.time = (_value) => {
	if(typeof _value === 'string')
	{
		return Math.time.parse(_value);
	}

	return Math.time.render(_value);
};

(() => {
	Math.time.unit = [
		[ 1000, 'milliseconds', 'ms' ],
		[ 60, 'seconds', 's' ],
		[ 60, 'minutes', 'm' ],
		[ 24, 'hours', 'h' ],
		[ 7, 'days', 'd' ],
		[ 4, 'weeks', 'w' ],
		[ 12, 'months', 'o' ],
		[ 0, 'years', 'y' ]
	];

	Math.time.units = {};
	var _sum = 1;

	for(var i = 0; i < Math.time.unit.length; ++i)
	{
		Math.time.units[Math.time.unit[i][2]] = _sum;
		_sum *= Math.time.unit[i][0];
	}
})();

Reflect.defineProperty(Math.time, 'parse', { value: (_value) => {
	if(typeof _value !== 'string')
	{
		return null;
	}
	
	if(_value.length === 0)
	{
		return 0;
	}
	
	var	result = 0,
		value = '',
		unit = '',
		byte;
	const	units = Math.time.units;
	
	const	add = (_value, _unit) => {
		if(!_value)
		{
			if(!_unit)
			{
				return true;
			}
			
			_value = '1';
		}
		
		while(_value[_value.length - 1] === '.')
		{
			_value = _value.slice(0, -1);
		}

		if(_value[0] === '.')
		{
			do
			{
				_value = _value.substr(1);
			}
			while(_value[0] === '.');

			_value = '0.' + _value;
		}

		if(Number.isNaN(_value = Number(_value)))
		{
			return false;
		}
		
		if(_unit)
		{
			if(_unit in units)
			{
				result += (_value * units[_unit]);
			}
			else
			{
				return false;
			}
		}
		else
		{
			result += (_value * 1000);
		}
		
		return true;
	};
	
	for(var i = 0; i < _value.length; ++i)
	{
		if((byte = _value.charCodeAt(i)) <= 32 || byte === 127)
		{
			continue;
		}
		
		if(_value[i] === '+' || _value[i] === ',')
		{
			if(!add(value, unit))
			{
				return null;
			}
			
			value = unit = '';
		}
		else if(_value[i] === '-')
		{
			if(value)
			{
				if(value === '-')
				{
					value = '';
				}
				else if(add(value, unit))
				{
					unit = '';
					value = '-';
				}
				else
				{
					return null;
				}
			}
			else
			{
				value = '-';
			}
		}
		else if(_value[i] === '.')
		{
			if(unit)
			{
				if(!add(value, unit))
				{
					return null;
				}

				unit = '';
				value = '0.';
			}
			else if(!value.includes('.'))
			{
				value += '.';
			}
			else
			{
				return null;
			}
		}
		else if(unit)
		{
			if(isNaN(_value[i]))
			{
				unit += _value[i];
			}
			else if(add(value, unit))
			{
				value = _value[i];
				unit = '';
			}
			else
			{
				return null;
			}
		}
		else if(!isNaN(_value[i]))
		{
			value += _value[i];
		}
		else
		{
			unit += _value[i];
		}
	}

	if((value || unit) && !add(value, unit))
	{
		return null;
	}
	
	return result;
}});

Reflect.defineProperty(Math.time, 'render', { value: (_value, _millisec = DEFAULT_MILLISEC, _long = DEFAULT_LONG, _sep = DEFAULT_SEP) => {
	if(typeof _value === 'bigint')
	{
		_value = Number(_value / 1000000n);
	}
	else if(typeof _value !== 'number')
	{
		return '-/-';
	}
	
	_value = Math.abs(_value);

	const orig = _value,
		append = (_value, _unit) => {
			if(_value < 1) return;
			if(_long && (_value = Math.int(_value)) === 1 &&
				_unit[_unit.length - 1] === 's') _unit = _unit.slice(0, -1);
			if(index === 0 && orig >= 1000 && !_millisec) return;
			var res = Math.int(_value).toString();
			return (result = (res + _unit + _sep) + result); };
	
	const	unit = Math.time.unit;
	var	result = '', index = -1,
		u, v;

	if(_value < 1)
	{
		return '0';
	}
	else while(_value >= 1)
	{
		if(!(u = unit[++index]))
		{
			break;
		}
		
		v = _value;
		if(u[0] > 1) v %= u[0];
		append(v, (_long ? ' ' + u[1] : u[2]));
		if(u[0] > 0) _value /= u[0];
		else break;
	}
	
	return result.slice(0, -_sep.length).trim();
}});

//
Reflect.defineProperty(Math, '_round', { value: Math.round });
Reflect.defineProperty(Math, 'round', { value: (_value, _prec = DEFAULT_PRECISION) => {
	if(_prec <= 0) return (Math._round(_value) || 0);
	const coefficient = Math.pow(10, _prec);
	return ((Math._round(_value * coefficient) / coefficient) || 0);
}});

Reflect.defineProperty(Math, 'int', { value: (_value, _prec = 0, _inverse = false) => {
	const a = (_value < 0); const b = (!!_inverse);
	return (((((a&&b)||!(a||b)) ? Math.floor : Math.ceil)(_value, _prec)) || 0);
}});

Reflect.defineProperty(Math, 'sign', { value: (_item, _string = false) => {
	if(typeof _item === 'number')
	{
		return (_item < 0 ? '-' : '+');
	}
	
	if(typeof _item !== 'string' || _item.length === 0)
	{
		return '';
	}
	
	_item = _item.trim();

	var negative = false, i = 0;
	
	for(; i < _item.length; ++i)
	{
		if(_item[i] === '-')
		{
			negative = !negative;
		}
		else if(_item[i] !== '+')
		{
			break;
		}
	}
	
	if(_string)
	{
		return ((negative ? '-' : '+') +
			_item.substr(i));
	}
	
	return (negative ? '-' : '+');
}});

//
export default time;

//
Reflect.defineProperty(console, 'width', {
	get: () => (process.stdout.columns || process.stderr.columns || 0) });

Reflect.defineProperty(console, 'height', {
	get: () => (process.stdout.rows || process.stderr.rows || 0) });

Reflect.defineProperty(console, 'ttyStream', { get: () => {
	if(process.stdout.isTTY)
	{
		return process.stdout;
	}
	
	if(process.stderr.isTTY)
	{
		return process.stderr;
	}
	
	return null;
}});

Reflect.defineProperty(String.prototype, 'repeat', { value: function(_count = 2)
{
	var result = '';
	
	if(_count <= 0)
	{
		return result;
	}
	
	while(--_count >= 0)
	{
		result += this.valueOf();
	}
	
	return result;
}});

//
//TODO/getopt parameter(s)s for locale w/ date-time-format(s), etc..!1
//
Reflect.defineProperty(Date, 'currentLocale', { get: () => Intl.
	DateTimeFormat().resolvedOptions().locale });

const _toString = Date.prototype.toString;
Reflect.defineProperty(Date.prototype, '_toString', { value: _toString });
Reflect.defineProperty(Date.prototype, 'toString', { value: function(... _args)
{
	if(_args.length === 0 || !_args[0])
	{
		return _toString.call(this);
	}

	const params = new Array(2);

	if(typeof _args[0] === 'string' && _args[0].length > 0)
	{
		params[0] = _args.shift();
	}
	else
	{
		params[0] = Date.currentLocale;
	}

	const opts = {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit' };

	params[1] = Object.assign(opts, _args.shift());
	return this.toLocaleString(... params);
}});

//
const getParameter = () => {
	const	{ long, short } = getParameter.getMaps(),
		argv = [ ... process.argv.slice(2) ],
		parameter = {};
	var	result = '',
		stop = false,
		done = false,
		err;

	const getValue = (_key, _index, _exit) => {
		if(_key.length === 1)
		{
			_key = short.get(_key);
		}
		
		var temp = argv[_index + 1];
		
		if(typeof temp === 'string')
		{
			temp = temp.trim();
		}
		else
		{
			temp = null;
		}
		
		if(!GETOPT_VALUES.includes(_key))
		{
			if(temp !== null && temp.length > 0) switch(temp.toLowerCase())
			{
				case 'on': case 'yes': case 'true':
					argv.splice(_index + 1, 1);
					return true;
				case 'off': case 'no': case 'false':
					argv.splice(_index + 1, 1);
					return false;
			}
			
			return true;
		}
		
		if(temp === null || temp.length === 0 || temp[0] === '-')
		{
			err = new Error('Missing value for parameter');
			err.param = '--' + _key;
			if(long.get(_key).length)
				err.param += ' / ' + ('-' +
					long.get(_key).
					join(' / -'));
			if(_exit) err.exit = _exit;
			throw err;
		}

		const localError = isNaN(temp);
		
		switch(_key)
		{
			case 'string':
				return temp;
			case 'offset':
				if(!localError)
				{
					temp *= 1000;
				}
				else if(temp[temp.length - 1] === '%' && !isNaN(temp.slice(0, -1)))
				{
					return temp;
				}
				break;
			case 'refresh':
				if(!localError)
				{
					return temp;
				}
				break;
		}
		
		if(localError)
		{
			if(temp === null || ((temp = Math.time.parse(temp)) === null))
			{
				err = new Error('Invalid value for parameter');
				err.param = '--' + _key;
				if(long.get(_key).length)
					err.param += ' / ' + ('-' +
						long.get(_key).
						join(' / -'));
				err.value = temp;
				if(_exit) err.exit = _exit;
				throw err;
			}
		}
		else
		{
			temp = Number(temp);
		}
		
		return temp;
	};
	
	for(var i = 0; i < argv.length; ++i)
	{
		if(!(argv[i] = argv[i].trim()))
		{
			continue;
		}

		if(argv[i] === '--')
		{
			stop = true;
			continue;
		}
		
		if(!stop && argv[i][0] === '-')
		{
			argv[i] = argv[i].substr(1);

			if(argv[i][0] === '-')
			{
				argv[i] = argv[i].substr(1);
				
				if(long.has(argv[i]))
				{
					if((parameter[argv[i]] = getValue(argv[i], i, 102)) !== true)
					{
						++i;
					}
				}
				else
				{
					err = new Error('Unknown long parameter');
					err.param = '--' + argv[i];
					err.exit = 100;
					throw err;
				}
			}
			else
			{
				argv[i] = argv[i].split('');

				for(const arg of argv[i])
				{
					//
					//TODO/.. offensichtlich. oder?? => werte!!
					//
					if(short.has(arg))
					{
						if((parameter[short.get(arg)] = getValue(
							arg, i, 103)) !== true)
						{
							++i;
						}
					}
					else
					{
						err = new Error('Unknown short parameter');
						err.param = '-' + arg;
						err.exit = 101;
						throw err;
					}
				}
			}
			
			continue;
		}
		
		if(done)
		{
			continue;
		}

		if(argv[i][0] === '=' && !isNaN(argv[i] = argv[i].substr(1)))
		{
			result = Number(argv[i]);
			done = true;
		}
		
		if(argv[i][0] === '+' || argv[i][0] === '-')
		{
			result += Math.sign(argv[i], true);
		}
		else
		{
			result += '+' + argv[i];
		}
	}
	
	return getParameter.apply(
		Object.assign(parameter, { result }));
}

getParameter.apply = (_param) => {
	//
	if(typeof _param.print === 'undefined')
	{
		_param.print = false;
	}

	if(typeof _param.progress === 'undefined')
	{
		_param.progress = false;
	}
	
	if(typeof _param.verbose === 'boolean')
	{
		_param.print = _param.progress = _param.verbose;
	}

	if(_param.progress)
	{
		if(!('refresh' in _param))
		{
			_param.refresh = DEFAULT_REFRESH;
		}
		
		_param.refresh = Math.min(Math.max(
			0, _param.refresh), MAX_TIME);

		if(typeof _param.string !== 'string' || _param.string.length === 0)
		{
			_param.string = DEFAULT_STRING;
		}
	}
	else
	{
		_param.refresh = 0;
		_param.string = '';
	}
	
	if(!(_param.stream = console.ttyStream))
	{
		_param.progress = false;
	}

	_param.cursor = false;

	if(_param.stream && DEFAULT_CURSOR)
	{
		_param.cursor = !!(_param.progress || _param.print);
	}

	if(!('offset' in _param))
	{
		_param.offset = 0;
	}

	if('precision' in _param)	
	{
		_param.precision = Math.abs(
			Math.int(_param.precision));
	}
	else
	{
		_param.precision = DEFAULT_PRECISION;
	}
	
	PRECISION = _param.precision;
	
	if(typeof _param.seconds !== 'boolean')
	{
		_param.seconds = DEFAULT_SECONDS;
	}
	
	if(!_param.stream)
	{
		_param.color = false;
	}
	else if(typeof _param.color !== 'boolean')
	{
		_param.color = DEFAULT_COLOR;
	}

	//
	if(_param.info)
	{
		info(_param);
		return process.exit();
	}
	
	if(_param.version)
	{
		version(_param);
	}

	if(_param.copyright)
	{
		copyright(_param);
	}
	
	if(_param.copyright || _param.version)
	{
		return process.exit();
	}
	
	if(_param.help)
	{
		help(_param, true);
		return process.exit();
	}

	//	
	return _param;
};

getParameter.getMaps = () => {
	const long = new Map();
	const short = new Map();
	
	for(const item of GETOPT_LONG)
	{
		if(!item) continue;
		long.set(item, []);
	}
	
	for(const idx in GETOPT_SHORT)
	{
		long.get(GETOPT_SHORT[idx]).push(idx);
		short.set(idx, GETOPT_SHORT[idx]);
	}

	return { long, short };
};

//
const HELP_SPACE = 1;

const help = (_param, _print = true) => {
	const { long, short } = getParameter.getMaps();
	
	if(_print)
	{
		info(_param);
		console.log();
	}

	const getShorts = (_long) => ('-' + long.get(_long).join(' / -'));
	const helpSpace = ' '.repeat(HELP_SPACE);
	const paramString = '< param > ';
	const paramSpace = ' '.repeat(paramString.length);
	const consoleWidth = (_param.stream ? _param.stream.columns : 0);

	const	max = { long: 0, short: 0, text: 0, start: 0 },
		longs = {}, shorts = {}, params = {}, texts = {};
	var	len, str;
	
	for(const item of GETOPT_LONG)
	{
		if(!item)
		{
			continue;
		}
		
		if((len = item.length) > max.long)
		{
			max.long = len;
		}

		if((len = (str = getShorts(item)).length) > max.short)
		{
			max.short = len;
		}
		
		longs[item] = item;
		shorts[item] = str;

		if(GETOPT_HELP[item] && (len = (str = GETOPT_HELP[item]).length + 2) > max.text)
		{
			max.text = len;
		}
		
		texts[item] = (str || '');
	}

	const	start = {}, text = {};
	var	str;

	for(const item of GETOPT_LONG)
	{
		if(item)
		{
			str = helpSpace + shorts[item].padStart(max.short) +
				helpSpace + '--' + item.padEnd(max.long);
			
			if(GETOPT_VALUES.includes(item))
			{
				str += helpSpace + paramString;
			}
			else
			{
				str += helpSpace + paramSpace;
			}
			
			if((len = str.length) > max.start)
			{
				max.start = len;
			}
			
			start[item] = str;
			
			if(text[item] = (GETOPT_HELP[item] || ''))
			{
				text[item] = ' ' + text[item] + ' ';
			}
		}
		else
		{
			start[item] = '';
			text[item] = '';
		}
	}

	const	lines = []; var lineIndex = 0;
	const	diff = ((consoleWidth - max.start - HELP_SPACE) - max.text);
	const	withAdditional = (diff >= 0);
	var	addMore = '';

	if(DEFAULT_COMMENT)
	{
		if(diff >= 3)
		{
			addMore = '// ';
		}
		else if(diff >= 2)
		{
			addMore = '//';
		}
	}

	if((diff - addMore.length) >= 2)
	{
		addMore += '..';
	}

	for(const item of GETOPT_LONG)
	{
		if(item)
		{
			str = start[item];
			
			if(withAdditional && text[item])
			{
				str += helpSpace + addMore + text[item].
					padStart(max.text, '.');
			}
		}
		else
		{
			str = '';
		}
		
		lines[lineIndex++] = str;
	}

	if(!withAdditional && consoleWidth > 0)
	{
		lines.push('', 'Additional help information available..',
			'Your terminal is too small (w/ ' + consoleWidth +
			' cols)', 'Needs at least (' + (-diff) + ') columns more!');
	}

	const result = lines.join('\n');
	
	if(_print)
	{
		console.log(result);
	}
	
	return result;
};

//
const info = (_param) => {
	copyright(_param); console.log(); version(_param); };
const copyright = (_param) => console.log('Copyright (c) ' +
	'Sebastian Kucharczyk <kuchen@kekse.biz>\n' +
	'https://kekse.biz/  https://github.com/kekse1/zsleep/');
const version = (_param) => console.log('`zsleep` v' + VERSION);

//
import readline from 'node:readline';

//
const ESCAPE = String.fromCodePoint(27);
const showCursor = () => (ESCAPE + '[?25h');
const hideCursor = () => (ESCAPE + '[?25l');
const none = () => (ESCAPE + '[0m');
const bold = () => (ESCAPE + '[1m');
const bg = (_r, _g, _b) => (ESCAPE + `[48;2;${_r};${_g};${_b}m`);
const fg = (_r, _g, _b) => (ESCAPE + `[38;2;${_r};${_g};${_b}m`);


//
const getPercentStringLength =
	(_prec = PRECISION, _sign = false) => (3 +
		(_prec ? 1 : 0) + _prec + (_sign ? 1 : 0));

const startTimeout = (_millisec, _param) => {
	const	maxTime = MAX_TIME;
	const	offset = _param.offset;
	var	rest = (_millisec - offset), time = offset, last, now,
		timeout = null, interval = null,
		value = 0, percentString,
		start = null, runtime = offset,
		width, line;
	const	getTime = () => Math.min(rest, maxTime);
	const	getValue = (_time = getRuntime()) => Math.min(1, _time / _millisec);
	const	getPercent = (_value = getValue()) => Math.round(_value * 100, PRECISION);
	const	percentStringLength = getPercentStringLength(PRECISION, false);
	const	getPercentString = (_value = getPercent()) => (_value.toFixed(PRECISION).
			padStart(percentStringLength, ' ') + '%');
	const	getRuntime = () => (Date.now() - start);

	//
	const startProgressTimeout = () => {
		if(interval !== null) return interval;
		return interval = setTimeout(() => {
			interval = null; setImmediate(
				() => drawProgress(false));
		}, _param.refresh); };
	
	const update = () => (percentString = getPercentString((
		value = getValue(runtime = getRuntime())) * 100));

	const drawProgress = (_finish = false) => {
		line = ' ';
		update();
		
		if(_param.seconds)
		{
			line += percentString + '   ' + (runtime / 1000).toFixed(PRECISION) + 's   ';
		}
		else
		{
			line += percentString + '   ' + Math.time.render(runtime, false, false, ' ') + '   ';
		}
		
		line = line.substr(0, _param.stream.columns);

		var txt;
		
		if((width = (_param.stream.columns - line.length - 2)) >= 4)
		{
			txt = '(';
			
			if(_param.color)
			{
				if(COLOR.bracket)
				{
					txt = fg(... COLOR.bracket) + txt;
				}
				
				if(COLOR.bold)
				{
					txt = bold() + txt;
				}
				
				txt += none();
			}
			
			line += txt;
			
			var done = Math._round(value * width);
			var todo = (width - done);

			txt = ''; for(var i = 0, j = line.length; i < done; ++i, ++j)
			{
				txt += _param.string[
					((DEFAULT_FIX ? j : i) %
						_param.string.length)];
			}
			
			if(_param.color)
			{
				if(COLOR.done.bg)
				{
					txt = bg(... COLOR.done.bg) + txt;
				}
				
				if(COLOR.done.fg)
				{
					txt = fg(... COLOR.done.fg) + txt;
				}
				
				txt += none();
			}
			
			line += txt;
			txt = '-'.repeat(todo);

			if(_param.color)
			{
				if(COLOR.todo.bg)
				{
					txt = bg(... COLOR.todo.bg) + txt;
				}
				
				if(COLOR.todo.fg)
				{
					txt = fg(... COLOR.todo.fg) + txt;
				}

				txt += none();
			}

			line += txt;
			txt = ')';
			
			if(_param.color)
			{
				if(COLOR.bracket)
				{
					txt = fg(... COLOR.bracket) + txt;
				}
				
				if(COLOR.bold)
				{
					txt = bold() + txt;
				}
				
				txt += none();
			}
			
			line += txt;
		}

		_param.stream.write(line + '\r');
		
		if(!_finish)
		{
			startProgressTimeout();
		}
	};

	//
	const finish = (_fin, _sigInt = !!SIGINT) => {
		last = now = null;
		
		if(_fin)
		{
			rest = 0; value = 1;
			time = runtime = _millisec;
		}
		else
		{
			update();
		}
		
		if(_param.progress)
		{
			drawProgress(true);
		}
	
		if(timeout !== null)
		{
			clearTimeout(timeout);
			timeout = null;
		}
		
		if(interval !== null)
		{
			clearTimeout(interval);
			interval = null;
		}
		
		setImmediate(() => end(_fin !== false,
			runtime, _millisec, _param));
	};

	const startLocalTimeout = (_time = getTime()) => {
		if(timeout !== null) return timeout;
		return timeout = setTimeout(() => {
			timeout = null;
			handler(_time); }, _time); };
	
	const handler = (_time = 0) => {
		now = Date.now();
		time += (now - last);
		last = now;
		
		if((rest -= _time) <= 0)
		{
			finish(true, !!SIGINT);
		}
		else
		{
			startLocalTimeout(getTime());
		}
	};
	
	const realStart = Date.now();
	last = start = (Date.now() - offset);
	startLocalTimeout(getTime());

	if(_param.cursor)
	{
		_param.stream.write(hideCursor());
	}

	if(_param.progress)
	{
		const onKeypress = (_str, _key) => {
			if(_key.ctrl && _key.name && _key.name === 'c')
			{
				process.kill(process.pid, 'SIGINT');
			}
		};
		
		readline.emitKeypressEvents(process.stdin);
		process.stdin.on('keypress', onKeypress);
		process.stdin.setRawMode(true);

		if(_param.print)
		{
			_param.stream.write('\n');
		}
		
		drawProgress(false);
	}

	process.once('SIGINT', () => finish(
		false, SIGINT = true));
};

const start = () => {
	var	result;
	const	param = getParameter();

	if(typeof param.result === 'number')
	{
		result = param.result;
		param.print = !(param.sleep = false);
		param.progress = false;
		param.stream = null;
	}
	else if((result = Math.time.parse(param.result)) === null)
	{
		const error = new Error('Unable to parse your argument.');
		error.param = param.result;
		error.exit = 1;
		throw error;
	}
	else
	{
		param.sleep = true;
	}

	if(typeof param.offset === 'string')
	{
		param.offset = Math.int(result * Number(
			param.offset.slice(0, -1)) / 100);
	}
	
	if(typeof param.offset === 'number')
	{
		param.offset = Math.max(0,
			Math.min(
				param.offset,
				result));
	}

	if(param.progress && result < 1000)
	{
		param.progress = false;
	}

	if(param.print)
	{
		console.info('         String: ' + param.result);
		console.info('   Milliseconds: ' + result.toString());//.toLocaleString());
		console.info('        Seconds: ' + (result / 1000).toFixed(PRECISION));
		console.info('           Time: ' + Math.time.render(result));
		
		const real = (result - param.offset);
		console.log();
		console.debug('          Start: ' + new Date().toString(true));
		const end = (Date.now() + real);
		console.debug('            End: ' + new Date(end).toString(true));

		if(param.offset > 0)
		{
			console.log();
			console.info('         Offset: ' + param.offset.toString());//toLocaleString());
			console.info('    Offset time: ' + Math.time.render(param.offset));
			console.info(' Effective time: ' + Math.time.render(real));
		}
	}

	if(result > 0 && param.sleep)
	{
		startTimeout(result, param);
	}
	else if(result < 0)
	{
		if(param.print)
		{
			console.error('\nYou can\'t travel back in time (negative time)..');
		}

		process.exit(2);
	}
};

var SIGINT = false; const end = (_fin, _runtime, _millisec, _param) => {
	const stop = () => {
		if(SIGINT)
		{
			return process.kill(process.pid, 'SIGINT');
		}
		
		if(_fin)
		{
			return process.exit(0);
		}
		
		return process.exit(1);
	};
	
	if(_param.progress)
	{
		process.stdin.removeAllListeners('keypress');
		process.stdin.setRawMode(false);
	}
	
	if(_param.cursor)
	{
		_param.stream.write(showCursor());
	}
	
	if(_param.progress && !SIGINT)
	{
		console.log();
	}

	if(_fin === false)
	{
		const diff = Math.max(0, (_millisec - _runtime));

		if(_param.print)
		{
			if(_param.progress)
			{
				console.log();
			}
			
			console.error(
				'\n(aborted by SIGINT)\n        Runtime: ' + Math.time.render(_runtime) +
				'\n       Real End: ' + new Date().toString(true) + '\n    DIFFERENCEs: ' +
				Math.time.render(diff) + '\n   Milliseconds: ' + diff.toString() +//toLocaleString() +
				'\n        Seconds: ' + (diff / 1000).toFixed(PRECISION) +
				'\n        Percent: ' + (_runtime / _millisec * 100).toFixed(PRECISION) + '%');
		}
	}
	
	if(_fin !== null)
	{
		return stop();
	}
};

//
try
{
	start();
}
catch(_err)
{
	if('exit' in _err)
	{
		console.error(_err.message);
		if(_err.param) console.info(
			'\n\t' + _err.param + (_err.value ?
				' `' + _err.value + '`' : '') + '\n');
		process.exit(_err.exit || 255);
	}

	console.error(_err);
}

//

