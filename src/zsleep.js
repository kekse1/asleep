#!/usr/bin/env node

/*
 *
 * Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
 * https://kekse.biz/  https://github.com/kekse1/zsleep/
 *
 */

//
const	VERSION = '2.1.1';

//
const
	DEFAULT_MILLISEC = true,
	DEFAULT_PRECISION = 2,
	DEFAULT_LONG = true,
	DEFAULT_SEP = ', ';

//
const GETOPT = [
	'print',
	'progress',
	'',
	'precision',
	'offset',
	'',
	'info',
	'',
	'copyright',
	'version',
	'',
	'help'
];

const SHORT = {
	'p': 'print',
	'P': 'progress',
	'n': 'precision',
	'o': 'offset',
	'i': 'info',
	'c': 'copyright',
	'v': 'version',
	'?': 'help',
	'h': 'help'
};

const VALUES = [
	'offset',
	'precision'
];

//
var PRECISION =
	DEFAULT_PRECISION;

//
const time = Math.time = (_value) => {
	if(typeof _value === 'string')
	{
		return Math.time.parse(_value);
	}

	return Math.time.render(_value);
};

Reflect.defineProperty(Math.time, 'MAX_TIMEOUT', { get: () => (((2 ** 32) / 2) - 1) });

(() => {
	Math.time.unit = [
		[ 1000, 'milliseconds', 'ms' ],
		[ 60, 'seconds', 's' ],
		[ 60, 'minutes', 'm' ],
		[ 24, 'hours', 'h' ],
		[ 7, 'days', 'd' ],
		[ 4, 'weeks', 'w' ],
		[ 12, 'months', 'M' ],
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
		if(!_value) _value = 0;
		else _value = Number(_value);
		
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
			result += _value;
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
			if(value && !add(value, unit))
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
				else if(!add(value, unit))
				{
					return null;
				}
				else
				{
					unit = '';
					value = '-';
				}
			}
			else
			{
				value = '-';
			}
		}
		else if(_value[i] === '.' && !unit && !value.includes('.'))
		{
			value += '.';
		}
		else if(isNaN(_value[i]))
		{
			unit += _value[i];
		}
		else if(!unit)
		{
			value += _value[i];
		}
		else if(!add(value, unit))
		{
			return null;
		}
		else
		{
			value += _value[i];
		}
	}
	
	if(value && !add(value, unit))
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
			var secs; if(orig >= 1000 && !_millisec) {
				if(index === 0) return;
				if(index > 1) return;
				if(_millisec === null)
					secs = true;
				else	secs = false} else secs = false;
			var res; if(secs) res = Math.round(_value, PRECISION).
				toFixed(PRECISION); else res = Math.int(_value).toString();
			return (result = (res + _unit + _sep) + result);
		};
	
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
const getPercentStringLength =
	(_prec = PRECISION, _sign = false) => (3 + (_prec ? 1 : 0) + _prec + (_sign ? 1 : 0));

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
		
		if(!VALUES.includes(_key))
		{
			return true;
		}
		
		var temp = argv[_index + 1];

		if(typeof temp !== 'string' || temp.length === 0 || temp[0] === '-')
		{
			err = new Error('Missing value for parameter');
			err.param = '--' + _key;
			if(long.get(_key).length)
				err.param += ' / ' +
					long.get(_key).join('/');
			if(_exit) err.exit = _exit;
			throw err;
		}

		if(isNaN(temp))
		{
			if((temp = Math.time.parse(temp)) === null)
			{
				err = new Error('Invalid value for parameter');
				err.param = '--' + _key;
				if(long.get(_key).length)
					err.param += ' / ' +
						long.get(_key).join('/');
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
	if(_param.info)
	{
		info();
		return process.exit();
	}
	
	if(_param.version)
	{
		version();
	}

	if(_param.copyright)
	{
		copyright();
	}
	
	if(_param.copyright || _param.version)
	{
		return process.exit();
	}
	
	if(_param.help)
	{
		help();
		return process.exit();
	}
	
	if(typeof _param.print === 'undefined')
	{
		_param.print = false;
	}

	if(typeof _param.progress === 'undefined')
	{
		_param.progress = false;
	}

	if('offset' in _param)
	{
		_param.offset = Math.max(0,
			Math.int(_param.offset));
	}
	else
	{
		_param.offset = 0;
	}

	if('precision' in _param)	
	{
		_param.precision = PRECISION =
			Math.abs(Math.int(_param.precision));
	}
	else
	{
		_param.precision = PRECISION =
			DEFAULT_PRECISION;
	}

	return _param;
};

getParameter.getMaps = () => {
	const long = new Map();
	const short = new Map();
	
	for(const item of GETOPT)
	{
		if(!item) continue;
		long.set(item, []);
	}
	
	for(const idx in SHORT)
	{
		long.get(SHORT[idx]).push(idx);
		short.set(idx, SHORT[idx]);
	}

	return { long, short };
};

//
const help = () => {
	const { long, short } =
		getParameter.getMaps();
	info(); console.log();

	var max = 0; long.forEach((_value, _key) => {
		if(_value.length > max)
			max = _value.length;
	}); max = ((max * 5) - 3);

	const getShorts = (_long) => (('-' +
		long.get(_long).join(' / -')).
			padStart(max, ' '));

	for(const item of GETOPT)
	{
		if(!item)
		{
			console.log();
			continue;
		}
		
		console.log('  \t' + getShorts(item) +
			' / ' + '--' + item + (VALUES.includes(item) ?
				'\t  <param>' : ''));
	}

	console.log();
};

const info = () => { copyright(); console.log(); version(); };
const copyright = () => console.log('Copyright (c) ' +
	'Sebastian Kucharczyk <kuchen@kekse.biz>\n' +
	'https://kekse.biz/  https://github.com/kekse1/zsleep/');
const version = () => console.log('`zsleep` v' + VERSION);

//
import readline from 'node:readline';

//
const startTimeout = (_millisec, _param) => {
	const	max_timeout = Math.time.MAX_TIMEOUT;
	var	runtime = _param.offset, timeout,
		last = Date.now(), now, progress,
		rest = (_millisec - _param.offset),
		ended = false, progressCount = 0;

	const	percentLength = getPercentStringLength(
			PRECISION, false);
	var	progressRuntime = _param.offset,
		progressWidth,
		progressLast,
		progressNow;

	const draw = (_value = 1) => {
		if(!(progressWidth = _param.stream.columns))
		{
			return false;
		}

		if(!ended)
		{
			if(!timeout)
			{
				return false;
			}
			
			if(_value < 0)
			{
				_value = 0;
			}
			else if(_value > 1)
			{
				_value = 1;
			}
		}
		else
		{
			_value = 1;
		}
		
		if(_value === 1)
		{
			progressRuntime = _millisec;
		}

		var line = Math.round(_value * 100, 2).toFixed(PRECISION).padStart(
			percentLength, ' ') + '%   ' + Math.time.render(
				progressRuntime, null, false) + '   ';

		progressWidth -= (line.length + 2);

		var done = Math._round(_value * progressWidth);
		var todo = (progressWidth - done);

		line += '[' + '#'.repeat(done) + '-'.repeat(todo) + ']';
		line = line.substr(0, _param.stream.columns);
		
		if(progressCount++)
		{
			_param.stream.write('\r');
		}
		else if(_param.print)
		{
			_param.stream.write('\n');
		}
		
		_param.stream.write(line);
		return !ended;
	};

	const endProgress = (_fin = null) => {
		ended = true;
		
		if(timeout)
		{
			clearTimeout(timeout);
			timeout = null;
		}

		if(_fin)
		{
			runtime = _millisec;
		}
		else
		{
			runtime += (Date.now() - last);
		}

		if(_param.progress)
		{
			process.stdin.setRawMode(false);
			
			if(_fin)
			{
				draw(1);
			}
					
			if(progress)
			{
				clearTimeout(progress);
				progress = null;
			}
		}
		
		if(_param.print && _param.progress)
		{
			console.log();
		}

		setTimeout(() => end(_fin !== false, runtime, _millisec, _param));
	};

	const time = () => Math.min(
		Math.time.MAX_TIMEOUT, rest);
	
	const handler = (_time) => {
		if((rest -= _time) <= 0)
		{
			endProgress(true); return end(true,
				runtime, _millisec, _param);
		}
		
		now = Date.now();
		runtime += (now - last);
		last = now;
		
		timeout = setTimeout(
			() => handler(time()),
				time());
	};

	timeout = setTimeout(
		() => handler(time()),
			time());
	
	if(_param.progress && _param.stream)
	{
		const onKeypress = (_str, _key) => {
			if(_key.ctrl && _key.name === 'c')
			{
				process.stdin.off('keypress', onKeypress);
				process.stdin.setRawMode(false);
				endProgress(false);
			}
		};

		readline.emitKeypressEvents(process.stdin);
		process.stdin.on('keypress', onKeypress);
		process.stdin.setRawMode(true);
		
		const interval = () => {
			progressNow = Date.now();
			progressRuntime += (progressNow - progressLast);
			progressLast = progressNow;
			
			if(draw(Math.min(1, (progressRuntime / _millisec))))
			{
				setTimeout(interval, 1000);
			}
			else
			{
				endProgress(false);
			}
		};

		progressLast = Date.now(); interval();
	}
	else
	{
		process.once('SIGINT', () => endProgress(false));
	}
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

	if(param.progress)
	{
		if(result < 1000)
		{
			param.progress = false;
		}
		else if(param.progress)
		{
			if(!(param.stream = console.ttyStream))
			{
				param.progress = false;
			}
		}
		
		if(!param.progress)
		{
			param.stream = null;
		}
	}

	if(param.print)
	{
		console.info('   Milliseconds: ' + result.toLocaleString());
		console.info('        Seconds: ' + Math.round(
			result / 1000, PRECISION).toFixed(PRECISION));
		console.info('           Time: ' + Math.time.render(result));
		
		const real = (result - param.offset);
		console.log();
		console.debug('          Start: ' + new Date().toGMTString());
		const end = (Date.now() + real);
		console.debug('            End: ' + new Date(end).toGMTString());

		if(param.offset > 0)
		{
			console.log();
			console.info('         Offset: ' + param.offset.toLocaleString());
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

const end = (_fin, _runtime, _millisec, _param) => {
	if(!_fin)
	{
		const diff = Math.max(0, (_millisec - _runtime));
		if(_param.print) console.error(
			'\n(aborted by SIGINT)\n       Real End: ' + new Date().toGMTString() +
			'\n        Runtime: ' + Math.time.render(_runtime) + '\n     Difference: ' +
			Math.time.render(diff) + '\n   Milliseconds: ' + diff.toLocaleString() +
			'\n        Seconds: ' + Math.round(diff / 1000, PRECISION).toFixed(PRECISION));
		process.exit(1);
	}

	process.exit(0);
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

