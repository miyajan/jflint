#!/usr/bin/env node

'use strict';

const CommandLine = require('../lib/cli');
const cli = new CommandLine(process, console);
cli.execute();
