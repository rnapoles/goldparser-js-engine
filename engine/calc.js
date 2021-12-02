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
Generated Date    : 2020-04-10 01:27


Output File      : calc.js 
Output File Base : calc 

This file was generated by the Gold Parser.
The template is Javascript OO Engine

*/

const Action = require('./gold/engine/Action');
const Context = require('./gold/engine/Context');
const DfaEdge = require('./gold/engine/DfaEdge');
const DfaState = require('./gold/engine/DfaState');
const Grammar = require('./gold/engine/Grammar');
const LalrState = require('./gold/engine/LalrState');
const Rule = require('./gold/engine/Rule');
const Symbol = require('./gold/engine/Symbol');
const TokenStack = require('./gold/engine/TokenStack');
const TokenType = require('./gold/engine/TokenType');
const AbstractParser = require('./gold/AbstractParser');

class Calc extends AbstractParser {

    run() {

        let ctx = new Context();
        let result = this.parse();

        /* Interpret the results. */
        if (result != this.PARSEACCEPT) {
          this.showErrorMessage(result);
        } else {

            /* Initialize the Context. */
            ctx.debug = this.debug;
            ctx.indent = 0;
            ctx.returnValue = null;

            /* Start execution by calling the subroutine of the first Token on
             the TokenStack. It's the "Start Symbol" that is defined in the
             grammar. 
            */
            let fn = this.ruleJumpTable[this.firstToken.reductionRule];
            console.log('-->',this.firstToken.reductionRule)
            console.log(fn)
            this[fn](this.firstToken,ctx);
            console.log(ctx);
        }

    }

    /**
    * TokenType token
    * Context ctx
    */
    ruleTemplate(token,ctx) {
        
        /* Debugging: show the description of the rule. */
        if (ctx.debug > 0) {
            this.showIndent(ctx.indent);
            printf("Executing rule: %s\n",this.grammar.ruleArray[token.reductionRule].description);
        }

        /* For all the sub-Tokens. */
        for (let i = 0; i < this.grammar.ruleArray[token.reductionRule].symbolsCount; i++) {
            
            /* See if the Token is a Symbol or a Rule. */
            if (token.tokens[i].reductionRule < 0) {

                /* It's a Symbol. Make a copy of the Data. Most symbols are grammar,
                     for example '+', 'function', 'while', and such, and you won't
                     need to look at the Data. Other symbols are literals from the input
                     script, for example numbers, strings, variable names, and such. */
                if(ctx.returnValue != null){
                    delete ctx.returnValue;
                }
                
                ctx.returnValue = token.tokens[i].data;
                //echo ctx.returnValue."\n";
                /* Debugging: show a description of the Symbol, and it's value. */
                if (ctx.debug > 0) {
                    this.showIndent(ctx.indent + 1);
                    printf("Token[%u] = Symbol('%s') = '%s'\n",i, this.grammar.symbolArray[token.tokens[i].symbol].name,ctx.returnValue);
                }

            } else {

                /* It's a rule. */

                /* Debugging: show a description of the rule. */
                if (ctx.debug > 0) {
                    this.showIndent(ctx.indent + 1);
                    printf("Token[%u] = Rule = %s\n",i,this.grammar.ruleArray[token.tokens[i].reductionRule].description);
                }

                /* Call the rule's subroutine via the ruleJumpTable. */
                ctx.indent = ctx.indent + 1;
                let fn = this.ruleJumpTable[token.tokens[i].reductionRule];
                this[fn](token.tokens[i],ctx);
                ctx.indent = ctx.indent - 1;

                /* At this point you will probably want to save the Context.returnValue
                     somewhere. */

                /* Debugging: show the value that was returned by the rule's subroutine. */
                if (ctx.debug > 0) {
                    this.showIndent(ctx.indent + 2);
                    printf("Result value = %s\n",ctx.returnValue);
                }
            }
        }

    }

    /***** Rule subroutines *****************************************************/

    /* 
        Symbol Count: 3
        <Add Exp> ::= <Add Exp> '+' <Mult Exp> 
        TokenType token
        Context ctx
    */
    rule_AddExp_Plus(token,ctx) {
    
        if (ctx.debug > 0) {   
            console.log("Calling rule_AddExp_Plus");
        }
        
        /*
        //^ <Add Exp> ::= <Add Exp> '+' <Mult Exp>
        */

        let fn = this.ruleJumpTable[token.tokens[0].reductionRule];
        console.log('[--    ',fn,'<Add Exp>')
        this[fn](token.tokens[0],ctx);
        let r1 = ctx.xresult;

        fn = this.ruleJumpTable[token.tokens[2].reductionRule];
        console.log('[--    ',fn,'<Mult Exp>')
        this[fn](token.tokens[2],ctx);
        let r2 = ctx.xresult;
        
        ctx.xresult = parseFloat(r1) + parseFloat(r2);
        //console.log(ctx.xresult);
        
    }

    /* 
        Symbol Count: 3
        <Add Exp> ::= <Add Exp> '-' <Mult Exp> 
        TokenType token
        Context ctx
    */
    rule_AddExp_Minus(token,ctx) {
    
        if (ctx.debug > 0) {   
            console.log("Calling rule_AddExp_Minus");
        }
        
        /*
        //^ <Add Exp> ::= <Add Exp> '-' <Mult Exp>
        */
        let fn = this.ruleJumpTable[token.tokens[0].reductionRule];
        console.log('[--    ',fn,'<Add Exp>')
        this[fn](token.tokens[0],ctx);
        let r1 = ctx.xresult;
        
        fn = this.ruleJumpTable[token.tokens[2].reductionRule];
        console.log('[--    ',fn,'<Mult Exp>')
        this[fn](token.tokens[2],ctx);
        let r2 = ctx.xresult;
        
        ctx.xresult = r1 - r2;
        
        
    }

    /* 
        Symbol Count: 1
        <Add Exp> ::= <Mult Exp> 
        TokenType token
        Context ctx
    */
    rule_AddExp(token,ctx) {
    
        if (ctx.debug > 0) {   
            console.log("Calling rule_AddExp");
        }
        
        /*
        //^ <Add Exp> ::= <Mult Exp>
        */
        
        let fn = this.ruleJumpTable[token.tokens[0].reductionRule];
        console.log('[--    ',fn,'<Mult Exp>')
        this[fn](token.tokens[0],ctx);
        
    }

    /* 
        Symbol Count: 3
        <Mult Exp> ::= <Mult Exp> '*' <Negate Exp> 
        TokenType token
        Context ctx
    */
    rule_MultExp_Times(token,ctx) {
    
        if (ctx.debug > 0) {   
            console.log("Calling rule_MultExp_Times");
        }
        
        /*
        //^ <Mult Exp> ::= <Mult Exp> '*' <Negate Exp>
        */
        let fn = this.ruleJumpTable[token.tokens[0].reductionRule];
        console.log('[--    ',fn,'<Mult Exp>')
        this[fn](token.tokens[0],ctx);
        let r1 = ctx.xresult;
        
        fn = this.ruleJumpTable[token.tokens[2].reductionRule];
        console.log('[--    ',fn,'<Negate Exp>')
        this[fn](token.tokens[2],ctx);
        let r2 = ctx.xresult;
        
        ctx.xresult = r1 * r2;        
        
    }

    /* 
        Symbol Count: 3
        <Mult Exp> ::= <Mult Exp> '/' <Negate Exp> 
        TokenType token
        Context ctx
    */
    rule_MultExp_Div(token,ctx) {
    
        if (ctx.debug > 0) {   
            console.log("Calling rule_MultExp_Div");
        }
        
        /*
        //^ <Mult Exp> ::= <Mult Exp> '/' <Negate Exp>
        */
        let fn = this.ruleJumpTable[token.tokens[0].reductionRule];
        console.log('[--    ',fn,'<Mult Exp>')
        this[fn](token.tokens[0],ctx);
        let r1 = ctx.xresult;
        
        fn = this.ruleJumpTable[token.tokens[2].reductionRule];
        console.log('[--    ',fn,'<Negate Exp>')
        this[fn](token.tokens[2],ctx);
        let r2 = ctx.xresult;
        
        ctx.xresult = r1 / r2;        
        
    }

    /* 
        Symbol Count: 1
        <Mult Exp> ::= <Negate Exp> 
        TokenType token
        Context ctx
    */
    rule_MultExp(token,ctx) {
    
        if (ctx.debug > 0) {   
            console.log("Calling rule_MultExp");
        }
        
        /*
        //^ <Mult Exp> ::= <Negate Exp>
        */
        let fn = this.ruleJumpTable[token.tokens[0].reductionRule];
        console.log('[--    ',fn,'<Negate Exp>')
        this[fn](token.tokens[0],ctx);      
        
    }

    /* 
        Symbol Count: 2
        <Negate Exp> ::= '-' <Value> 
        TokenType token
        Context ctx
    */
    rule_NegateExp_Minus(token,ctx) {
    
        if (ctx.debug > 0) {   
            console.log("Calling rule_NegateExp_Minus");
        }
        
        /*
        //^ <Negate Exp> ::= '-' <Value>
        */
        let fn = this.ruleJumpTable[token.tokens[0].reductionRule];
        console.log('[--    ',fn,'<Value>')
        this[fn](token.tokens[1],ctx);
        let r1 = ctx.xresult;
        
        ctx.xresult = r1 * -1;
        
    }

    /* 
        Symbol Count: 1
        <Negate Exp> ::= <Value> 
        TokenType token
        Context ctx
    */
    rule_NegateExp(token,ctx) {
    
        if (ctx.debug > 0) {   
            console.log("Calling rule_NegateExp");
        }
        
        /*
        //^ <Negate Exp> ::= <Value>
        */
        let fn = this.ruleJumpTable[token.tokens[0].reductionRule];
        console.log('[--    ',fn,'<Value>')
        this[fn](token.tokens[0],ctx);
        let r1 = ctx.xresult;
        
        ctx.xresult = r1;
        
    }

    /* 
        Symbol Count: 1
        <Value> ::= Number 
        TokenType token
        Context ctx
    */
    rule_Value_Number(token,ctx) {
    
        if (ctx.debug > 0) {   
            console.log("Calling rule_Value_Number");
        }
        
        //let fn = this.ruleJumpTable[token.tokens[0].reductionRule];
        //this[fn](token.tokens[0],ctx);
        //let r1 = ctx.xresult;
        
        ctx.xresult = token.tokens[0].data;
        
        
    }

    /* 
        Symbol Count: 3
        <Value> ::= '(' <Add Exp> ')' 
        TokenType token
        Context ctx
    */
    rule_Value_LParen_RParen(token,ctx) {
    
        if (ctx.debug > 0) {   
            console.log("Calling rule_Value_LParen_RParen");
        }
        
        /*
        //^ <Value> ::= '(' <Add Exp> ')'
        */
        let fn = this.ruleJumpTable[token.tokens[1].reductionRule];
        console.log('[--    ',fn,"'(' <Add Exp> ')'")
        this[fn](token.tokens[1],ctx);        
        
    }


    initGrammar(){

        let grammarCharset0CharCount = 7;
        let grammarCharset0 = [
            9,
            10,
            11,
            12,
            13,
            32,
            160,
            0
        ];

        let grammarCharset1CharCount = 1;
        let grammarCharset1 = [
            40,
            0
        ];

        let grammarCharset2CharCount = 1;
        let grammarCharset2 = [
            41,
            0
        ];

        let grammarCharset3CharCount = 1;
        let grammarCharset3 = [
            42,
            0
        ];

        let grammarCharset4CharCount = 1;
        let grammarCharset4 = [
            43,
            0
        ];

        let grammarCharset5CharCount = 1;
        let grammarCharset5 = [
            45,
            0
        ];

        let grammarCharset6CharCount = 1;
        let grammarCharset6 = [
            47,
            0
        ];

        let grammarCharset7CharCount = 10;
        let grammarCharset7 = [
            48,
            49,
            50,
            51,
            52,
            53,
            54,
            55,
            56,
            57,
            0
        ];


        let grammarDfaEdgeArray0 = [
            new DfaEdge(1,grammarCharset0CharCount,grammarCharset0),
            new DfaEdge(2,grammarCharset1CharCount,grammarCharset1),
            new DfaEdge(3,grammarCharset2CharCount,grammarCharset2),
            new DfaEdge(4,grammarCharset3CharCount,grammarCharset3),
            new DfaEdge(5,grammarCharset4CharCount,grammarCharset4),
            new DfaEdge(6,grammarCharset5CharCount,grammarCharset5),
            new DfaEdge(7,grammarCharset6CharCount,grammarCharset6),
            new DfaEdge(8,grammarCharset7CharCount,grammarCharset7),
            new DfaEdge(-1,0,null)
        ];

        let grammarDfaEdgeArray1 = [
            new DfaEdge(1,grammarCharset0CharCount,grammarCharset0),
            new DfaEdge(-1,0,null)
        ];

        let grammarDfaEdgeArray2 = [
            new DfaEdge(-1,0,null)
        ];

        let grammarDfaEdgeArray3 = [
            new DfaEdge(-1,0,null)
        ];

        let grammarDfaEdgeArray4 = [
            new DfaEdge(-1,0,null)
        ];

        let grammarDfaEdgeArray5 = [
            new DfaEdge(-1,0,null)
        ];

        let grammarDfaEdgeArray6 = [
            new DfaEdge(-1,0,null)
        ];

        let grammarDfaEdgeArray7 = [
            new DfaEdge(-1,0,null)
        ];

        let grammarDfaEdgeArray8 = [
            new DfaEdge(8,grammarCharset7CharCount,grammarCharset7),
            new DfaEdge(-1,0,null)
        ];


        let grammarRulesymbolArray0 = [
            10,
            6,
            11,
            -1
        ];

        let grammarRulesymbolArray1 = [
            10,
            7,
            11,
            -1
        ];

        let grammarRulesymbolArray2 = [
            11,
            -1
        ];

        let grammarRulesymbolArray3 = [
            11,
            5,
            12,
            -1
        ];

        let grammarRulesymbolArray4 = [
            11,
            8,
            12,
            -1
        ];

        let grammarRulesymbolArray5 = [
            12,
            -1
        ];

        let grammarRulesymbolArray6 = [
            7,
            13,
            -1
        ];

        let grammarRulesymbolArray7 = [
            13,
            -1
        ];

        let grammarRulesymbolArray8 = [
            9,
            -1
        ];

        let grammarRulesymbolArray9 = [
            3,
            10,
            4,
            -1
        ];


        let grammarLalrActionArray0 = [
            new Action(3,1,1),
            new Action(7,1,2),
            new Action(9,1,3),
            new Action(10,3,4),
            new Action(11,3,5),
            new Action(12,3,6),
            new Action(13,3,7),
            new Action(-1,-1,-1)
        ];
        let grammarLalrActionArray1 = [
            new Action(3,1,1),
            new Action(7,1,2),
            new Action(9,1,3),
            new Action(10,3,8),
            new Action(11,3,5),
            new Action(12,3,6),
            new Action(13,3,7),
            new Action(-1,-1,-1)
        ];
        let grammarLalrActionArray2 = [
            new Action(3,1,1),
            new Action(9,1,3),
            new Action(13,3,9),
            new Action(-1,-1,-1)
        ];
        let grammarLalrActionArray3 = [
            new Action(0,2,8),
            new Action(4,2,8),
            new Action(5,2,8),
            new Action(6,2,8),
            new Action(7,2,8),
            new Action(8,2,8),
            new Action(-1,-1,-1)
        ];
        let grammarLalrActionArray4 = [
            new Action(0,4,0),
            new Action(6,1,10),
            new Action(7,1,11),
            new Action(-1,-1,-1)
        ];
        let grammarLalrActionArray5 = [
            new Action(5,1,12),
            new Action(8,1,13),
            new Action(0,2,2),
            new Action(4,2,2),
            new Action(6,2,2),
            new Action(7,2,2),
            new Action(-1,-1,-1)
        ];
        let grammarLalrActionArray6 = [
            new Action(0,2,5),
            new Action(4,2,5),
            new Action(5,2,5),
            new Action(6,2,5),
            new Action(7,2,5),
            new Action(8,2,5),
            new Action(-1,-1,-1)
        ];
        let grammarLalrActionArray7 = [
            new Action(0,2,7),
            new Action(4,2,7),
            new Action(5,2,7),
            new Action(6,2,7),
            new Action(7,2,7),
            new Action(8,2,7),
            new Action(-1,-1,-1)
        ];
        let grammarLalrActionArray8 = [
            new Action(4,1,14),
            new Action(6,1,10),
            new Action(7,1,11),
            new Action(-1,-1,-1)
        ];
        let grammarLalrActionArray9 = [
            new Action(0,2,6),
            new Action(4,2,6),
            new Action(5,2,6),
            new Action(6,2,6),
            new Action(7,2,6),
            new Action(8,2,6),
            new Action(-1,-1,-1)
        ];
        let grammarLalrActionArray10 = [
            new Action(3,1,1),
            new Action(7,1,2),
            new Action(9,1,3),
            new Action(11,3,15),
            new Action(12,3,6),
            new Action(13,3,7),
            new Action(-1,-1,-1)
        ];
        let grammarLalrActionArray11 = [
            new Action(3,1,1),
            new Action(7,1,2),
            new Action(9,1,3),
            new Action(11,3,16),
            new Action(12,3,6),
            new Action(13,3,7),
            new Action(-1,-1,-1)
        ];
        let grammarLalrActionArray12 = [
            new Action(3,1,1),
            new Action(7,1,2),
            new Action(9,1,3),
            new Action(12,3,17),
            new Action(13,3,7),
            new Action(-1,-1,-1)
        ];
        let grammarLalrActionArray13 = [
            new Action(3,1,1),
            new Action(7,1,2),
            new Action(9,1,3),
            new Action(12,3,18),
            new Action(13,3,7),
            new Action(-1,-1,-1)
        ];
        let grammarLalrActionArray14 = [
            new Action(0,2,9),
            new Action(4,2,9),
            new Action(5,2,9),
            new Action(6,2,9),
            new Action(7,2,9),
            new Action(8,2,9),
            new Action(-1,-1,-1)
        ];
        let grammarLalrActionArray15 = [
            new Action(5,1,12),
            new Action(8,1,13),
            new Action(0,2,0),
            new Action(4,2,0),
            new Action(6,2,0),
            new Action(7,2,0),
            new Action(-1,-1,-1)
        ];
        let grammarLalrActionArray16 = [
            new Action(5,1,12),
            new Action(8,1,13),
            new Action(0,2,1),
            new Action(4,2,1),
            new Action(6,2,1),
            new Action(7,2,1),
            new Action(-1,-1,-1)
        ];
        let grammarLalrActionArray17 = [
            new Action(0,2,3),
            new Action(4,2,3),
            new Action(5,2,3),
            new Action(6,2,3),
            new Action(7,2,3),
            new Action(8,2,3),
            new Action(-1,-1,-1)
        ];
        let grammarLalrActionArray18 = [
            new Action(0,2,4),
            new Action(4,2,4),
            new Action(5,2,4),
            new Action(6,2,4),
            new Action(7,2,4),
            new Action(8,2,4),
            new Action(-1,-1,-1)
        ];

        let grammarSymbolArray = [
            /*  0 */   
            new Symbol(3,"EOF"),
            /*  1 */   
            new Symbol(7,"Error"),
            /*  2 */   
            new Symbol(2,"Whitespace"),
            /*  3 */   
            new Symbol(1,"("),
            /*  4 */   
            new Symbol(1,")"),
            /*  5 */   
            new Symbol(1,"*"),
            /*  6 */   
            new Symbol(1,"+"),
            /*  7 */   
            new Symbol(1,"-"),
            /*  8 */   
            new Symbol(1,"/"),
            /*  9 */   
            new Symbol(1,"Number"),
            /* 10 */   
            new Symbol(0,"Add Exp"),
            /* 11 */   
            new Symbol(0,"Mult Exp"),
            /* 12 */   
            new Symbol(0,"Negate Exp"),
            /* 13 */   
            new Symbol(0,"Value") 
        ];

        let grammarDfaStateArray = [
            /* 0 */    
            new DfaState(-1,8,grammarDfaEdgeArray0),
            /* 1 */    
            new DfaState(2,1,grammarDfaEdgeArray1),
            /* 2 */    
            new DfaState(3,0,grammarDfaEdgeArray2),
            /* 3 */    
            new DfaState(4,0,grammarDfaEdgeArray3),
            /* 4 */    
            new DfaState(5,0,grammarDfaEdgeArray4),
            /* 5 */    
            new DfaState(6,0,grammarDfaEdgeArray5),
            /* 6 */    
            new DfaState(7,0,grammarDfaEdgeArray6),
            /* 7 */    
            new DfaState(8,0,grammarDfaEdgeArray7),
            /* 8 */    
            new DfaState(9,1,grammarDfaEdgeArray8),
            new DfaState(-1,-1,null)
        ];

        let grammarRuleArray = [
            /*  0 */
            new Rule(10,3,grammarRulesymbolArray0,"<Add Exp> ::= <Add Exp> '+' <Mult Exp>"),
            /*  1 */
            new Rule(10,3,grammarRulesymbolArray1,"<Add Exp> ::= <Add Exp> '-' <Mult Exp>"),
            /*  2 */
            new Rule(10,1,grammarRulesymbolArray2,"<Add Exp> ::= <Mult Exp>"),
            /*  3 */
            new Rule(11,3,grammarRulesymbolArray3,"<Mult Exp> ::= <Mult Exp> '*' <Negate Exp>"),
            /*  4 */
            new Rule(11,3,grammarRulesymbolArray4,"<Mult Exp> ::= <Mult Exp> '/' <Negate Exp>"),
            /*  5 */
            new Rule(11,1,grammarRulesymbolArray5,"<Mult Exp> ::= <Negate Exp>"),
            /*  6 */
            new Rule(12,2,grammarRulesymbolArray6,"<Negate Exp> ::= '-' <Value>"),
            /*  7 */
            new Rule(12,1,grammarRulesymbolArray7,"<Negate Exp> ::= <Value>"),
            /*  8 */
            new Rule(13,1,grammarRulesymbolArray8,"<Value> ::= Number"),
            /*  9 */
            new Rule(13,3,grammarRulesymbolArray9,"<Value> ::= '(' <Add Exp> ')'") 
        ];

        let grammarLalrStateArray = [
            /* 0 */
            new LalrState(7,grammarLalrActionArray0),
            /* 1 */
            new LalrState(7,grammarLalrActionArray1),
            /* 2 */
            new LalrState(3,grammarLalrActionArray2),
            /* 3 */
            new LalrState(6,grammarLalrActionArray3),
            /* 4 */
            new LalrState(3,grammarLalrActionArray4),
            /* 5 */
            new LalrState(6,grammarLalrActionArray5),
            /* 6 */
            new LalrState(6,grammarLalrActionArray6),
            /* 7 */
            new LalrState(6,grammarLalrActionArray7),
            /* 8 */
            new LalrState(3,grammarLalrActionArray8),
            /* 9 */
            new LalrState(6,grammarLalrActionArray9),
            /* 10 */
            new LalrState(6,grammarLalrActionArray10),
            /* 11 */
            new LalrState(6,grammarLalrActionArray11),
            /* 12 */
            new LalrState(5,grammarLalrActionArray12),
            /* 13 */
            new LalrState(5,grammarLalrActionArray13),
            /* 14 */
            new LalrState(6,grammarLalrActionArray14),
            /* 15 */
            new LalrState(6,grammarLalrActionArray15),
            /* 16 */
            new LalrState(6,grammarLalrActionArray16),
            /* 17 */
            new LalrState(6,grammarLalrActionArray17),
            /* 18 */
            new LalrState(6,grammarLalrActionArray18),
            new LalrState(-1,null)
        ];

        this.grammar = new Grammar();

        /* CaseSensitive */      
        //this.grammar.caseSensitive = ;
        /* InitialSymbol */
        //this.grammar.initialSymbol = ;
        /* InitialDfaState */
        this.grammar.initialDfaState = 0;
        /* InitialLalrState */
        this.grammar.initialLalrState = 0;
        /* SymbolCount */        
        this.grammar.symbolCount = 14;
        /* symbolArray */        
        this.grammar.symbolArray = grammarSymbolArray;
        /* RuleCount */          
        this.grammar.ruleCount = 10;
        /* ruleArray */          
        this.grammar.ruleArray = grammarRuleArray;
        /* DfaStateCount */      
        this.grammar.dfaStateCount = 9;
        /* DfaArray */           
        this.grammar.dfaArray = grammarDfaStateArray;
        /* LalrStateCount */     
        this.grammar.lalrStateCount = 19;
        /* LalrArray */          
        this.grammar.lalrArray = grammarLalrStateArray;

        this.ruleJumpTable = [
            /* 0. <Add Exp> ::= <Add Exp> '+' <Mult Exp> */
            'rule_AddExp_Plus',
            /* 1. <Add Exp> ::= <Add Exp> '-' <Mult Exp> */
            'rule_AddExp_Minus',
            /* 2. <Add Exp> ::= <Mult Exp> */
            'rule_AddExp',
            /* 3. <Mult Exp> ::= <Mult Exp> '*' <Negate Exp> */
            'rule_MultExp_Times',
            /* 4. <Mult Exp> ::= <Mult Exp> '/' <Negate Exp> */
            'rule_MultExp_Div',
            /* 5. <Mult Exp> ::= <Negate Exp> */
            'rule_MultExp',
            /* 6. <Negate Exp> ::= '-' <Value> */
            'rule_NegateExp_Minus',
            /* 7. <Negate Exp> ::= <Value> */
            'rule_NegateExp',
            /* 8. <Value> ::= Number */
            'rule_Value_Number',
            /* 9. <Value> ::= '(' <Add Exp> ')' */
            'rule_Value_LParen_RParen' 
        ];

    }

}

function sprintf() {
  //  discuss at: http://phpjs.org/functions/sprintf/
  // original by: Ash Searle (http://hexmen.com/blog/)
  // improved by: Michael White (http://getsprink.com)
  // improved by: Jack
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Dj
  // improved by: Allidylls
  //    input by: Paulo Freitas
  //    input by: Brett Zamir (http://brett-zamir.me)
  //   example 1: sprintf("%01.2f", 123.1);
  //   returns 1: 123.10
  //   example 2: sprintf("[%10s]", 'monkey');
  //   returns 2: '[    monkey]'
  //   example 3: sprintf("[%'#10s]", 'monkey');
  //   returns 3: '[####monkey]'
  //   example 4: sprintf("%d", 123456789012345);
  //   returns 4: '123456789012345'
  //   example 5: sprintf('%-03s', 'E');
  //   returns 5: 'E00'

  var regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g;
  var a = arguments;
  var i = 0;
  var format = a[i++];

  // pad()
  var pad = function(str, len, chr, leftJustify) {
    if (!chr) {
      chr = ' ';
    }
    var padding = (str.length >= len) ? '' : new Array(1 + len - str.length >>> 0)
      .join(chr);
    return leftJustify ? str + padding : padding + str;
  };

  // justify()
  var justify = function(value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
    var diff = minWidth - value.length;
    if (diff > 0) {
      if (leftJustify || !zeroPad) {
        value = pad(value, minWidth, customPadChar, leftJustify);
      } else {
        value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
      }
    }
    return value;
  };

  // formatBaseX()
  var formatBaseX = function(value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
    // Note: casts negative numbers to positive ones
    var number = value >>> 0;
    prefix = prefix && number && {
      '2': '0b',
      '8': '0',
      '16': '0x'
    }[base] || '';
    value = prefix + pad(number.toString(base), precision || 0, '0', false);
    return justify(value, prefix, leftJustify, minWidth, zeroPad);
  };

  // formatString()
  var formatString = function(value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
    if (precision != null) {
      value = value.slice(0, precision);
    }
    return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
  };

  // doFormat()
  var doFormat = function(substring, valueIndex, flags, minWidth, _, precision, type) {
    var number, prefix, method, textTransform, value;

    if (substring === '%%') {
      return '%';
    }

    // parse flags
    var leftJustify = false;
    var positivePrefix = '';
    var zeroPad = false;
    var prefixBaseX = false;
    var customPadChar = ' ';
    var flagsl = flags.length;
    for (var j = 0; flags && j < flagsl; j++) {
      switch (flags.charAt(j)) {
        case ' ':
          positivePrefix = ' ';
          break;
        case '+':
          positivePrefix = '+';
          break;
        case '-':
          leftJustify = true;
          break;
        case "'":
          customPadChar = flags.charAt(j + 1);
          break;
        case '0':
          zeroPad = true;
          customPadChar = '0';
          break;
        case '#':
          prefixBaseX = true;
          break;
      }
    }

    // parameters may be null, undefined, empty-string or real valued
    // we want to ignore null, undefined and empty-string values
    if (!minWidth) {
      minWidth = 0;
    } else if (minWidth === '*') {
      minWidth = +a[i++];
    } else if (minWidth.charAt(0) == '*') {
      minWidth = +a[minWidth.slice(1, -1)];
    } else {
      minWidth = +minWidth;
    }

    // Note: undocumented perl feature:
    if (minWidth < 0) {
      minWidth = -minWidth;
      leftJustify = true;
    }

    if (!isFinite(minWidth)) {
      throw new Error('sprintf: (minimum-)width must be finite');
    }

    if (!precision) {
      precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type === 'd') ? 0 : undefined;
    } else if (precision === '*') {
      precision = +a[i++];
    } else if (precision.charAt(0) == '*') {
      precision = +a[precision.slice(1, -1)];
    } else {
      precision = +precision;
    }

    // grab value using valueIndex if required?
    value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];

    switch (type) {
      case 's':
        return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);
      case 'c':
        return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
      case 'b':
        return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
      case 'o':
        return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
      case 'x':
        return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
      case 'X':
        return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad)
          .toUpperCase();
      case 'u':
        return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
      case 'i':
      case 'd':
        number = +value || 0;
        number = Math.round(number - number % 1); // Plain Math.round doesn't just truncate
        prefix = number < 0 ? '-' : positivePrefix;
        value = prefix + pad(String(Math.abs(number)), precision, '0', false);
        return justify(value, prefix, leftJustify, minWidth, zeroPad);
      case 'e':
      case 'E':
      case 'f': // Should handle locales (as per setlocale)
      case 'F':
      case 'g':
      case 'G':
        number = +value;
        prefix = number < 0 ? '-' : positivePrefix;
        method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
        textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
        value = prefix + Math.abs(number)[method](precision);
        return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
      default:
        return substring;
    }
  };

  return format.replace(regex, doFormat);
}

function printf() {
  ret = sprintf.apply(this, arguments);
  console.log(ret);
  
  return ret.length;
}

let inputBuf = '(1+2)*3';

console.log(inputBuf);

p = new Calc(inputBuf,0,0);
p.debug = 0;
p.run();

