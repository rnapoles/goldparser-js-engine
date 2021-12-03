﻿
/*
Name             : Calc
Version          : 0.01
Author           : GOLD Parser Builder and Nick Sabalausky
About            : Basic Calculator Grammar
Case Sensitive   : 
Start Symbol     : 

Character Set     : Unicode
Character Mapping : Windows-1252
Generated By      : GOLD Parser Builder 5.2.0.
Generated Date    : 2021-12-02 19:11

Output File      :  
Output File Base :  


This file was generated by the Gold Parser.
The template is Javascript OO Engine

*/

//const printf = require('../lib/printf');
const Calc = require('./Calc');
const input = '2+2*-2';
const parser = new Calc(input,0,0);

parser.debug = 2;
parser.run();

console.log(parser.output.join(''));
