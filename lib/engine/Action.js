/*
 *Grammar.LalrArray[].actions[]
 */
class Action {
  /* If action=REDUCE then index into Grammar.RuleArray[]. */
  /* If action=GOTO then index into Grammar.LalrArray[]. */

  constructor(entry, action, target) {
    this.entry = entry; /* Index into Grammar.SymbolArray[]. */
    this.action = action; /* 1...4, see Action defines. */
    this.target =
      target; /* If action=SHIFT then index into Grammar.LalrArray[]. */
  }
}

module.exports = Action;
