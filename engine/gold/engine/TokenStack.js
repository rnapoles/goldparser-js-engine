/* FIFO (first in first out) stack of Tokens. */
class TokenStack {

    constructor(){
        this.token = null;
        this.lalrState = 0;       /* Index into Grammar.LalrArray[]. */
        this.nextToken = null; /* Pointer to next item. */
    }

}


module.exports = TokenStack;