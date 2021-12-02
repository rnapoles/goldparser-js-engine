/*
 *Grammar.LalrArray[] 
*/
class LalrState { 

    constructor(actionCount,actions) {
        this.actionCount = actionCount;   /* Number of items in actions[] array. */
        this.actions = actions;           /* Array of Actionclass. */
    }

}

module.exports = LalrState;