/*
 * Grammar.RuleArray[] 
*/
class Rule { 

    constructor(head, symbolsCount, symbols, description) {
        this.head = head;                   /* Index into Grammar.SymbolArray[]. */
        this.symbolsCount = symbolsCount;   /* Number of items in symbols[] array. */
        this.symbols = symbols;             /* Array of indexes into Grammar.SymbolArray[]. */
        this.description = description;     /* String with BNF of the rule. */
    }

}

module.exports = Rule;
