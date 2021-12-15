cls
set gram=Simple2
::call GOLDbuild -export %gram%.grm %gram%.egt %gram%.log
call GOLDbuild -export calc.grm calc.egt %gram%.log
::call GOLDprog %gram%.egt ../egt/JavascriptEngine.pgt %gram%.js
::call GOLDprog %gram%.egt "C - Kessels - Engine grammar.h.pgt" %gram%.h
::call GOLDprog %gram%.egt "C - Kessels - Engine grammar.c.pgt" %gram%.c
::call GOLDprog %gram%.egt PHPEngine.pgt %gram%.php
::call GOLDprog grm.cgt ../cgt/JavascriptEngine.pgt grm.js
call GOLDprog calc.egt ../templates/egt/BaseJSEngine.pgt BaseCalc.js
call GOLDprog calc.egt ../templates/egt/ImpJSEngine.pgt  Calc.js
call GOLDprog calc.egt ../templates/egt/TestJSEngine.pgt TestCalc.js
