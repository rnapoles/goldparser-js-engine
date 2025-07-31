cls
set gram=Simple2
::call GOLDbuild -export Calc/%gram%.grm Calc/%gram%.egt Calc/%gram%.log
call GOLDbuild -export Calc/calc.grm Calc/calc.egt Calc/%gram%.log
::call GOLDprog %gram%.egt ../egt/JavascriptEngine.pgt Calc/%gram%.js
::call GOLDprog %gram%.egt "C - Kessels - Engine grammar.h.pgt" Calc/%gram%.h
::call GOLDprog %gram%.egt "C - Kessels - Engine grammar.c.pgt" Calc/%gram%.c
::call GOLDprog %gram%.egt PHPEngine.pgt Calc/%gram%.php
::call GOLDprog grm.cgt ../cgt/JavascriptEngine.pgt Calc/grm.js
call GOLDprog Calc/calc.egt ../templates/egt/BaseJSEngine.pgt Calc/BaseCalc.js
call GOLDprog Calc/calc.egt ../templates/egt/ImpJSEngineWithSwitch.pgt Calc/Calc.js
call GOLDprog Calc/calc.egt ../templates/egt/TestJSEngine.pgt Calc/TestCalc.js
