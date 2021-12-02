/* Grammar */
class Grammar { 

    constructor(){
        this.caseSensitive = false;      /* 'True' or 'False'. */
        this.initialSymbol = 0;      /* Index into Grammar.SymbolArray[]. */
        this.initialDfaState = 0;      /* Index into Grammar.DfaArray[]. */
        this.initialLalrState = 0;      /* Index into Grammar.LalrArray[]. */
        this.symbolCount = 0;       /* Number of items in Grammar.SymbolArray[]. */
        this.symbolArray = [];
        this.ruleCount = 0;       /* Number of items in Grammar.RuleArray[]. */
        this.ruleArray = [];
        this.dfaStateCount = 0;      /* Number of items in Grammar.DfaArray[]. */
        this.dfaArray = [];
        this.lalrStateCount = 0;      /* Number of items in Grammar.LalrArray[]. */
        this.lalrArray = [];
    }

}

module.exports = Grammar;