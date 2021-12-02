const Action = require('./engine/Action');
const Context = require('./engine/Context');
const DfaEdge = require('./engine/DfaEdge');
const DfaState = require('./engine/DfaState');
const Grammar = require('./engine/Grammar');
const LalrState = require('./engine/LalrState');
const Rule = require('./engine/Rule');
const Symbol = require('./engine/Symbol');
const TokenStack = require('./engine/TokenStack');
const TokenType = require('./engine/TokenType'); 

class AbstractParser {

    constructor(inputBuf,trimReductions,debug){
        
        this.BUFSIZ = 512; 

        /* Return values of the parse() function. */
        this.PARSEACCEPT = 0; /* Input parsed, no errors. */
        this.PARSELEXICALERROR = 1;   /* Input could not be tokenized. */
        this.PARSETOKENERROR = 2; /* Input is an invalid token. */
        this.PARSESYNTAXERROR = 3;  /* Input does not match any rule. */
        this.PARSECOMMENTERROR = 4;   /* A comment was started but not finished. */
        this.PARSEMEMORYERROR = 5;  /* Insufficient memory. */

        /* Symbolclass types (defined by GOLD). */
        this.SYMBOLNONTERMINAL = 0;
        this.SYMBOLTERMINAL = 1;
        this.SYMBOLWHITESPACE = 2;
        this.SYMBOLEOF = 3;
        this.SYMBOLCOMMENTSTART = 4;
        this.SYMBOLCOMMENTEND = 5;
        this.SYMBOLCOMMENTLINE = 6;
        this.SYMBOLERROR = 7;

        /* Actionclass types (defined by GOLD). */
        this.ACTIONSHIFT = 1;
        this.ACTIONREDUCE = 2;
        this.ACTIONGOTO = 3;
        this.ACTIONACCEPT = 4;

        /* LALR state machine. Depending on the token.symbol the machine will
          change it's state and perform actions, such as reduce the tokenStack and
          iteratively call itself. */
        this.LALRMEMORYERROR = 0;
        this.LALRSYNTAXERROR = 1;
        this.LALRACCEPT = 2;
        this.LALRSHIFT = 3;
        this.LALRGOTO = 4;

        this.inputHere = 0;
        this.line = 0;
        this.column = 0;
        this.length = 0;

        this.lalrState = 0;
        this.tokenStack = null; 
        this.inputToken = ""; 
        this.debug = 0;

        this.grammar;
        this.ruleJumpTable = [];
        
        this.inputBuf = inputBuf; // Pointer to the input data. 
        this.inputSize = inputBuf.length; // Number of characters in the input. 
        this.trimReductions = trimReductions;
        this.debug = debug; 
        this.firstToken = null;
        this.initGrammar();
    }

    initGrammar(){
        
    };


    readString() {

        let inputStr = '';

        let length = this.length;
        
        /*
        console.log('this.inputBuf:',this.inputBuf);
        console.log('this.inputBuf[this.inputHere]:',this.inputBuf[this.inputHere]);
        console.log('this.inputSize:',this.inputSize);
        console.log('this.inputHere:',this.inputHere);
        console.log('length:',length);
        */
        
        for (let i = 0; i < length; i++) {
            
            if (this.inputHere < this.inputSize) {
                
                if (this.inputBuf[this.inputHere] == "\r") {
                    if ((this.inputHere + 1 < this.inputSize) &&
                            (this.inputBuf[this.inputHere + 1] != "")) {
                        this.line = this.line + 1;
                        this.column = 0;
                    }
                }
                
                if (this.inputBuf[this.inputHere] == "") {
                    this.line = this.line + 1;
                    this.column = 0;
                }
                                
                inputStr += this.inputBuf[this.inputHere];
                this.inputHere = this.inputHere + 1;
                this.column = this.column + 1;
            } else {
                inputStr[i] = "\0";
            }
        }
        
        /*let str = '';
        foreach(inputStr as c){
            str += c;
        }*/
        
        //console.log('---> inputStr:',inputStr,inputStr.length);
        
        return inputStr;
    }


    /* Search for a character in a characterset. Return 1 if found,
      0 if not found. */
    findChar(thisChar, characterSet, count) {
        
        
        //console.log(characterSet,count);
        //console.log('thisChar:',thisChar);
        thisChar = thisChar.charCodeAt(0);
        
        /*
        console.log('--------');
        console.log(arguments);
        console.log('--------');
        
        console.log('thisChar:',thisChar);
        */
        
        
        let here = 0;
        let interval = 0;

        let str = "";
        characterSet.forEach((c) => {
            str += String.fromCharCode(c);
        });
        //console.log('characterSet:',characterSet.join());
        //console.log('characterSet:',str);
        //console.log('str.indexOf(String.fromCharCode(thisChar)):',str.indexOf(String.fromCharCode(thisChar)));
        
     
        /* Use wcschr() for charactersets with a length of up to 11
          characters. */
        if (count < 11) {
            //if (wcschr(characterSet,thisChar) != null) return(1);
            if (str.indexOf(String.fromCharCode(thisChar)) != -1){
                //console.log('found x1',thisChar);
                return 1;
            }
            
            return 0;
        }

        /* Binary search the characterset for the character. This method is
          possible because GOLD always produces sorted charactersets.
          Measurements show that although the code is more complex, this
          binary search is faster than wcschr() for charactersets longer
          than 11 characters. At 100 characters it's 4 times faster. */
        interval = 32768;
        while (interval > count)
            interval = (interval >> 1);
        here = interval - 1;
        interval = (interval >> 1);
        while (interval > 0) {
            if (characterSet[here] == thisChar){
                //console.log('found x2',thisChar);
                return(1);
            }
            if (characterSet[here] > thisChar) {
                here = here - interval;
            } else {
                while (here + interval >= count) {
                    interval = (interval >> 1);
                    if (interval == 0)
                        return 0;
                }
                here = here + interval;
            }

            interval = (interval >> 1);
        }

        if (characterSet[here] == thisChar){
            //console.log('found x3',characterSet[here] == thisChar);
            return 1;
        }
        
        return 0;
    }



    retrieveToken() {

        let dfaIndex = 0;   /* Index into this.grammar.dfaArray[]. */
        this.length = 0;  /* Number of processed characters from Data.inputBuf. */
        let acceptIndex = 0;  /* Longest found symbol so far. */
        let acceptLength = 0; /* length of longest found symbol. */
        let i = 0;

        /* Sanity check (no input). */
        if (!this.inputBuf) {
            this.symbol = 0;
            return null;
        }

        /* If there are no more characters in the input then return this.SYMBOLEOF
          and null. */
        if (this.inputHere >= this.inputSize) {
            this.symbol = 0;
            return null;
        }

        /* Compare characters from the input with the DFA charactersets until
          not found. */
        dfaIndex = this.grammar.initialDfaState;
        acceptLength = 0;
        acceptIndex = -1;
        while (this.inputHere + this.length < this.inputSize) {
            
            //console.log('====>',this.length,dfaIndex,i);
            
            /* If this is a valid symbol-terminal then save it. We know the
              input matches the symbol, but there may be a longer symbol that
              matches so we have to keep scanning. */
            if (this.grammar.dfaArray[dfaIndex].acceptSymbol >= 0) {
                acceptIndex = dfaIndex;
                acceptLength = this.length;
            }

            /* Walk through the edges and scan the characterset of each edge for
              the current character. */
            for (i = 0; i < this.grammar.dfaArray[dfaIndex].edgeCount; i++) {
                //console.log('findChar:',this.inputBuf[this.inputHere + this.length],this.inputHere,this.length);
                if (this.findChar(this.inputBuf[this.inputHere + this.length], this.grammar.dfaArray[dfaIndex].edges[i].characterSet, this.grammar.dfaArray[dfaIndex].edges[i].charCount) == 1){
                    //console.log('!!! found');
                    this.characterSet = this.grammar.dfaArray[dfaIndex].edges[i].characterSet;
                    break;
                }
            }

            /* If not found then exit the loop. */
            if (i >= this.grammar.dfaArray[dfaIndex].edgeCount){
                //console.log('edgeCount:',this.grammar.dfaArray[dfaIndex].edgeCount)
                break;
            }

            /* Jump to the targetState, which points to another set of DFA edges
              describing the next character. */
            dfaIndex = this.grammar.dfaArray[dfaIndex].edges[i].targetState;
            //console.log('targetState:',dfaIndex);

            /* Increment the length, we have handled the character. */
            this.length++;
            //console.log('new length:',this.inputBuf.slice(0,this.length)+']',this.length);
        }

        /* If the DFA is a terminal then return the symbol, and length characters
          from the input. */
        if (this.grammar.dfaArray[dfaIndex].acceptSymbol >= 0) {
            this.symbol = this.grammar.dfaArray[dfaIndex].acceptSymbol;
            //console.log('this.symbol',this.symbol);
            return(this.readString());
        }

        /* If we found a shorter terminal before, then return that symbol, and
          it's characters. */
        if (acceptIndex >= 0) {
            //console.log('2-');
            this.symbol = this.grammar.dfaArray[acceptIndex].acceptSymbol;
            //console.log('this.symbol',this.symbol);
            this.length = acceptLength;
            return(this.readString());
        }

        /* Return this.SYMBOLERROR and a string with 1 character from the input. */
        this.symbol = 1;
        this.length = 1;
        
        //console.log('3-');

        return this.readString();
    }

    parseToken() {

        /* struct TokenStack* */ 
        let popToken = null;
        /* struct TokenStack* */ 
        let reduction = null;
        
        let action = 0;
        let rule = 0;

        /* Find the token.symbol in the LALR table. */
        action = 0;
        while (action < this.grammar.lalrArray[this.lalrState].actionCount) {
            if (this.grammar.lalrArray[this.lalrState].actions[action].entry == this.inputToken.token.symbol) {
                break;
            }
            action++;
        }

        /* If not found then exit with SYNTAXERROR. The token is not allowed in this
          context. */
        if (action >= this.grammar.lalrArray[this.lalrState].actionCount) {
            if (this.debug > 0) {
                console.log(`LALR Syntax error: symbol ${this.inputToken.token.symbol} not found in LALR table ${this.lalrState}.`);
            }
            return(this.LALRSYNTAXERROR);
        }

        /* this.ACTIONACCEPT: exit. We're finished parsing the input. */
        if (this.grammar.lalrArray[this.lalrState].actions[action].action == this.ACTIONACCEPT) {
            if (this.debug > 0) {
                console.log(`LALR Accept: Target=${this.grammar.lalrArray[this.lalrState].actions[action].target}`);
            }
            return(this.LALRACCEPT);
        }

        /* this.ACTIONSHIFT: switch the LALR state and return. We're ready to accept
          the next token. */
        if (this.grammar.lalrArray[this.lalrState].actions[action].action == this.ACTIONSHIFT) {
            this.lalrState = this.grammar.lalrArray[this.lalrState].actions[action].target;
            if (this.debug > 0) {
                console.log(`LALR Shift: Lalr=${this.lalrState}`);
            }
            return(this.LALRSHIFT);
        }

        /* this.ACTIONGOTO: switch the LALR state and return. We're ready to accept
          the next token.
          Note: In my implementation SHIFT and GOTO do the exact same thing. As far
          as I can tell GOTO only happens just after a reduction. Perhaps GOLD makes
          the difference to allow the program to perform special actions, which my
          implementation does not need. */
        if (this.grammar.lalrArray[this.lalrState].actions[action].action == this.ACTIONGOTO) {
            this.lalrState = this.grammar.lalrArray[this.lalrState].actions[action].target;
            if (this.debug > 0) {
                console.log(`LALR Goto: Lalr=${this.lalrState}`);
            }
            return(this.LALRGOTO);
        }

        /* this.ACTIONREDUCE:
          Create a new reduction according to the rule that is specified by the action.
          - Create a new reduction in the ReductionArray.
          - Pop tokens from the tokenStack and add them to the reduction.
          - Push a new token on the tokenStack for the reduction.
          - Iterate.
         */
        rule = this.grammar.lalrArray[this.lalrState].actions[action].target;
        if (this.debug > 0) {
            console.log(`LALR Reduce: Lalr=${this.lalrState} TargetRule=${this.grammar.symbolArray[this.grammar.ruleArray[rule].head].name}[${this.grammar.ruleArray[rule].head}] ==> ${this.grammar.ruleArray[rule].description}`);
        }

        /* If trimReductions is active, and the rule contains a single non-terminal,
          then eleminate the unneeded reduction by modifying the rule on the stack
          into this rule.
         */
        if ((this.trimReductions != 0) &&
                (this.grammar.ruleArray[rule].symbolsCount == 1) &&
                (this.grammar.symbolArray[this.grammar.ruleArray[rule].symbols[0]].kind == this.SYMBOLNONTERMINAL)) {

            if (this.debug > 0) {
                console.log("LALR TrimReduction.");
            }

            /* Pop the rule from the tokenStack. */
            popToken = this.tokenStack;
            this.tokenStack = popToken.nextToken;

            /* Rewind the LALR state. */
            this.lalrState = popToken.lalrState;

            /* Change the token into the rule. */
            popToken.token.symbol = this.grammar.ruleArray[rule].head;

            let oldInputToken = this.inputToken;
            this.inputToken = popToken;
            /* Feed the token to the LALR state machine. */
            this.parseToken();
            this.inputToken = oldInputToken;

            /* Push the modified token back onto the tokenStack. */
            popToken.nextToken = this.tokenStack;
            this.tokenStack = popToken;

            /* Save the new LALR state in the input token. */
            this.inputToken.lalrState = this.lalrState;

            /* Feed the input token to the LALR state machine and exit. */
            return(this.parseToken());
        }

        /* Allocate and initialize memory for the reduction. */
        //reduction = (struct TokenStack *)malloc(sizeof(struct TokenStack));
        
        reduction = new TokenStack();
        reduction.token = new TokenType();

        reduction.token.reductionRule = rule;
        reduction.token.tokens = [];

        reduction.token.symbol = this.grammar.ruleArray[rule].head;
        reduction.token.data = null;
        reduction.token.line = this.inputToken.token.line;
        reduction.token.column = this.inputToken.token.column;
        reduction.lalrState = this.lalrState;
        reduction.nextToken = null;

        /* Reduce tokens from the tokenStack by moving them to the reduction.
          The Lalr state will be rewound to the state it was for the first
          symbol of the rule. */
        for (let i = this.grammar.ruleArray[rule].symbolsCount; i > 0; i--) {
            popToken = this.tokenStack;
            this.tokenStack = popToken.nextToken;
            popToken.nextToken = null;
            if (this.debug > 0) {
                if (popToken.token.data != null) {
                    console.log(`  + symbol=${this.grammar.symbolArray[popToken.token.symbol].name}[${popToken.token.symbol}] RuleSymbol=${this.grammar.symbolArray[this.grammar.ruleArray[rule].symbols[i - 1]].name}[${this.grammar.ruleArray[rule].symbols[i - 1]}] Value='${popToken.token.data}' Lalr=${popToken.lalrState}`);
                } else {
                    console.log(`  + symbol=${this.grammar.symbolArray[popToken.token.symbol].name}[${popToken.token.symbol}] RuleSymbol=${this.grammar.symbolArray[this.grammar.ruleArray[rule].symbols[i - 1]].name}[${this.grammar.ruleArray[rule].symbols[i - 1]}] Lalr=${popToken.lalrState}`);
                }
            }
            reduction.token.tokens[i - 1] = popToken.token;
            this.lalrState = popToken.lalrState;
            reduction.lalrState = popToken.lalrState;
            reduction.token.line = popToken.token.line;
            reduction.token.column = popToken.token.column;

        }

        /* Call the LALR state machine with the symbol of the rule. */
        if (this.debug > 0) {
            console.log(`Calling Lalr 1: Lalr=${this.lalrState} symbol=${this.grammar.symbolArray[this.grammar.ruleArray[rule].head].name}[${this.grammar.ruleArray[rule].head}]`);
        }
        
        let oldInputToken = this.inputToken;
        this.inputToken = reduction;
        this.parseToken();
        this.inputToken = oldInputToken;

        /* Push new token on the tokenStack for the reduction. */
        reduction.nextToken = this.tokenStack;
        this.tokenStack = reduction;

        /* Save the current LALR state in the inputToken. We need this to be
          able to rewind the state when reducing. */
        this.inputToken.lalrState = this.lalrState;

        /* Call the LALR state machine with the inputToken. The state has
          changed because of the reduction, so we must accept the token
          again. */
        if (this.debug > 0) {
            console.log(`Calling Lalr 2: Lalr=${this.lalrState} symbol=${this.grammar.symbolArray[this.inputToken.token.symbol].name}[${this.inputToken.token.symbol}]`);
        }
        return(this.parseToken());
    }

    deleteTokens(token) {

        if (token == null){
            return;
        }
        
        if (token.data != null){
            delete token.data;
        }
        
        if (token.reductionRule >= 0) {
            for (let i = 0; i < this.grammar.ruleArray[token.reductionRule].symbolsCount; i++) {
                this.deleteTokens(token.tokens[i]);
            }

            delete token.tokens;
        }
    }

    parseCleanup(topToken,newToken) {

        let oldTop = null;

        this.firstToken = null;
        if (topToken != null) {
            this.firstToken = topToken.token;
            oldTop = topToken;
            topToken = topToken.nextToken;
            //delete oldTop;
        }

        if (newToken != null) {
            this.deleteTokens(this.firstToken);
            this.firstToken = newToken.token;
            //delete newToken;
        }

        while (topToken != null) {
            this.deleteTokens(topToken.token);
            oldTop = topToken;
            topToken = topToken.nextToken;
            //delete oldTop;
        }
    }

    /* Parse the input data.
      Returns a pointer to a ParserData struct, null if insufficient memory.
      The Data.result value will be one of these values:
      this.PARSEACCEPT            Input parsed, no errors.
      this.PARSELEXICALERROR          Input could not be tokenized.
      this.PARSETOKENERROR        Input is an invalid token.
      this.PARSESYNTAXERROR       Input does not match any rule.
      this.PARSECOMMENTERROR          A comment was started but not finished.
      this.PARSEMEMORYERROR       Insufficient memory.
     */

    parse() {

        /* Index into this.grammar.lalrArray[]. */
        this.lalrState = 0;          
        
        /* struct TokenStack* */ 
        this.tokenStack = null;   /* Stack of Tokens. */
        
        /* struct TokenStack* */ 
        let work = null;    /* Current token. */
        
        this.inputHere = 0;      /* Index into input. */
        this.line = 1;           /* line number. */
        this.column = 1;         /* column number. */
        let commentLevel = 0;    /* Used when skipping comments, nested comment count. */
        let result = 0;          /* result from parseToken(). */

        /* Initialize variables. */
        this.lalrState = this.grammar.initialLalrState;
        this.tokenStack = null;
        this.firstToken = null;

        /* Sanity check. */
        if ((this.inputBuf == null) || (this.inputSize == 0)) {
            return(this.PARSEACCEPT);
        }

        /* Accept tokens until finished. */
        while (1) {

            /* Create a new token. Exit if out of memory. */
            let work = new TokenStack();

            work.lalrState = this.lalrState;
            work.nextToken = null;
            work.token = new TokenType();

            work.token.reductionRule = -1;
            work.token.tokens = null;
            work.token.line = this.line;
            this.symbol = work.token.symbol;

            /* Call the DFA tokenizer and parse a token from the input. */
            work.token.data = this.retrieveToken();
            work.token.symbol = this.symbol;
            work.token.characterSet = this.characterSet;
            
            //console.log('token.data:',`[${work.token.data}]`,work.token.data ? work.token.data.length : 0);
            //console.log('token.symbol:',work.token.symbol);
            //console.log('token.characterSet:',this.characterSet);
            //console.log('rule:',this.grammar.ruleArray[work.token.symbol].description);
            
            if ((work.token.data == null) && (work.token.symbol != 0)) {
                this.parseCleanup(this.tokenStack, work);
                return(this.PARSEMEMORYERROR);
            }

            /* If we are inside a comment then ignore everything except the end
              of the comment, or the start of a nested comment. */
            if (commentLevel > 0) {
                /* Begin of nested comment: */
                if (this.grammar.symbolArray[work.token.symbol].kind == this.SYMBOLCOMMENTSTART) {
                    /* Push the token on the tokenStack to keep track of line+column. */
                    work.nextToken = this.tokenStack;
                    this.tokenStack = work;

                    commentLevel = commentLevel + 1;
                    continue;
                }

                /* End of comment: */
                if (this.grammar.symbolArray[work.token.symbol].kind == this.SYMBOLCOMMENTEND) {
                    /* Delete the token. */
                    /*if (work.token.data != null)
                        delete work.token.data;
                    delete work.token;
                    //delete work;
                    */

                    /* Pop the comment-start token from the tokenStack and delete
                      that as well. */
                    work = this.tokenStack;
                    this.tokenStack = work.nextToken;
                    /*
                    if (work.token.data != null)
                        delete work.token.data;
                    delete work.token;
                    //delete work;
                    */

                    commentLevel = commentLevel - 1;
                    continue;
                }

                /* End of file: Error exit. A comment was started but not finished. */
                if (this.grammar.symbolArray[work.token.symbol].kind == this.SYMBOLEOF) {
                    /*if (work.token.data != null)
                        delete work.token.data;
                    delete work.token;
                    //delete work;
                    let temp = null;
                    this.parseCleanup(this.tokenStack, temp);
                    */
                    return(this.PARSECOMMENTERROR);
                }

                /* Any other token: delete and loop. */
                /*
                if (work.token.data != null)
                    delete work.token.data;
                delete work.token;
                //delete work;
                */

                continue;
            }

            /* If the token is the start of a comment then increment the
              commentLevel and loop. The routine will keep reading tokens
              until the end of the comment. */
            if (this.grammar.symbolArray[work.token.symbol].kind == this.SYMBOLCOMMENTSTART) {
                if (this.debug > 0)
                    console.log("parse: skipping comment.");

                /* Push the token on the tokenStack to keep track of line+column. */
                work.nextToken = this.tokenStack;
                this.tokenStack = work;

                commentLevel = commentLevel + 1;
                continue;
            }

            /* If the token is the start of a linecomment then skip the rest
              of the line. */
            if (this.grammar.symbolArray[work.token.symbol].kind == this.SYMBOLCOMMENTLINE) {
                if (work.token.data != null)
                    delete work.token.data;
                delete work.token;
                //delete work;
                
                while ((this.inputHere < this.inputSize) &&
                (this.inputBuf[this.inputHere] != "\r") &&
                (this.inputBuf[this.inputHere] != "")) {
                    this.inputHere = this.inputHere + 1;
                }
                if ((this.inputHere < this.inputSize) &&
                        (this.inputBuf[this.inputHere] == "\r")) {
                    this.inputHere = this.inputHere + 1;
                }
                if ((this.inputHere < this.inputSize) &&
                        (this.inputBuf[this.inputHere] == "")) {
                    this.inputHere = this.inputHere + 1;
                }
                this.line = this.line + 1;
                this.column = 1;
                continue;
            }

            /* If parse error then exit. */
            if (this.grammar.symbolArray[work.token.symbol].kind == this.SYMBOLERROR) {
                console.log('this.SYMBOLERROR');
                this.parseCleanup(this.tokenStack, work);
                return(this.PARSELEXICALERROR);
            }

            /* Ignore whitespace. */
            if (this.grammar.symbolArray[work.token.symbol].kind == this.SYMBOLWHITESPACE) {
                if (work.token.data != null)
                    delete work.token.data;
                delete work.token;
                //delete work;
                continue;
            }

            /* The tokenizer should never return a non-terminal symbol. */
            if (this.grammar.symbolArray[work.token.symbol].kind == this.SYMBOLNONTERMINAL) {
                if (this.debug > 0) {
                    console.log(`Error: tokenizer returned this.SYMBOLNONTERMINAL '${work.token.data}'.`);
                }
                this.parseCleanup(this.tokenStack, work);
                return(this.PARSETOKENERROR);
            }

            if (this.debug > 0) {
                console.log(`token Read: Lalr=${this.lalrState} symbol=${this.grammar.symbolArray[work.token.symbol].name}[${work.token.symbol}] Value='${work.token.data}'`);
            }

            /* Feed the symbol to the LALR state machine. It can do several
              things, such as wind back and iteratively call itself. */
            this.inputToken = work;
            result = this.parseToken();

            /* If out of memory then exit. */
            if (result == this.LALRMEMORYERROR) {
                this.parseCleanup(this.tokenStack, work);
                return(this.PARSEMEMORYERROR);
            }

            /* If syntax error then exit. */
            if (result == this.LALRSYNTAXERROR) {
                /* Return LALR state in the token.symbol. */
                work.token.symbol = this.lalrState;
                this.parseCleanup(this.tokenStack, work);
                return(this.PARSESYNTAXERROR);
            }

            /* Exit if the LALR state machine says it has reached it's exit. */
            if (result == this.LALRACCEPT) {
                if (this.grammar.symbolArray[work.token.symbol].kind == this.SYMBOLEOF) {
                    if (work.token.data != null)
                        delete work.token.data;
                    delete work.token;
                    //delete work;
                }
                
                let temp = null;
                this.parseCleanup(this.tokenStack, temp);
                
                return(this.PARSEACCEPT);
            }

            /* Push the token onto the tokenStack. */
            work.nextToken = this.tokenStack;
            this.tokenStack = work;
        }

        /* Should never get here. */
    }

    /* Make a readable copy of a string. All characters outside 32...127 are
       displayed as a HEX number in square brackets, for example "[0A]". */
    readableString(input) {
      
        let s1 = '';
        let i1 = 0;
        let i2 = 0;
        
        let width = this.BUFSIZ;
        let output = [];
        
        /* Sanity check. */
        if (width < 1) return;
        
        output[0] = "\0";
        if (input == null) return;

        while ((i2 < width - 1) && (input[i1] != undefined)) {
            let cp = input.codePointAt(i1);
            if ((cp >= 32) && (cp <= 127)) {
                output[i2++] = input[i1];
            } else {
                if (width - i2 > 4) {
                    //sprintf(s1,"%02X",input[i1]);
                    output[i2++] = '[';
                    output[i2++] = '0x0';
                    output[i2++] = cp.toString(16);
                    output[i2++] = ']';
                }
            }
            i1++;
        }
      
      return output.join('');
    }

    showIndent(indent) {
        let str = " ".repeat(indent);
        /*for(let i = 0; i < indent; i++) {
            
        }*/
        console.log(str);
    }

    showErrorMessage(result) {

        let token = this.firstToken;
        let symbol = 0;
        let s1 = '';

        switch (result) {
            case this.PARSELEXICALERROR:
                console.log("Lexical error");
                break;
            case this.PARSECOMMENTERROR:
                console.log("Comment error");
                break;
            case this.PARSETOKENERROR:
                console.log("Tokenizer error");
                break;
            case this.PARSESYNTAXERROR:
                console.log("Syntax error");
                break;
            case this.PARSEMEMORYERROR:
                console.log("Out of memory");
                break;
        }

        if (token != null) console.log(` at line ${token.line} column ${token.column}`);
        console.log(".");

        if (result == this.PARSELEXICALERROR) {
            if (token.data != null) {
                s1 = this.readableString(token.data);
                console.log(`The grammar does not specify what to do with '${s1}'.`);
            } else {
                console.log("The grammar does not specify what to do.");
            }
        }
        if (result == this.PARSETOKENERROR) {
            console.log("The tokenizer returned a non-terminal.");
        }
        if (result == this.PARSECOMMENTERROR) {
            console.log("The comment has no end, it was started but not finished.");
        }
        if (result == this.PARSESYNTAXERROR) {
            if (token.data != null) {
                s1 = this.readableString(token.data);
                console.log(`Encountered '${s1}', but expected `);
            } else {
                console.log("Expected ");
            }
            for (let i = 0; i < this.grammar.lalrArray[token.symbol].actionCount; i++) {
                symbol = this.grammar.lalrArray[token.symbol].actions[i].entry;
                if (this.grammar.symbolArray[symbol].kind == this.SYMBOLTERMINAL) {
                    if (i > 0) {
                        console.log(", ");
                        if (i >= this.grammar.lalrArray[token.symbol].actionCount - 2) console.log("or ");
                    }
                    console.log(`'${this.grammar.symbolArray[symbol].name}'`);
                }
            }
            console.log(".");
        }
    }

}

module.exports = AbstractParser;
