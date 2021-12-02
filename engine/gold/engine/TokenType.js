class TokenType {

    constructor(){
        this.reductionRule = 0;      /* Index into Grammar.RuleArray[]. */
        this.tokens = [];  /* Array of reduction Tokens. */
        this.symbol = 0;        /* Index into Grammar.SymbolArray[]. */
        this.data = "";       /* String with data from the input. */
        this.value = 0;       /* String with data from the input. */
        this.line = 0;        /* Line number in the input. */
        this.column = 0;        /* Column in the input. */
    }

}


module.exports = TokenType;