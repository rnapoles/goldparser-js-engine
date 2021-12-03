/*
 * Grammar.DfaArray[].Edges[]
 */
class DfaEdge {
  constructor(targetState, charCount, characterSet) {
    this.targetState = targetState;
    this.charCount = charCount;
    this.characterSet = characterSet;
  }
}

module.exports = DfaEdge;
