/* Grammar.DfaArray[] */
class DfaState {
  constructor(acceptSymbol, edgeCount, edges) {
    this.acceptSymbol =
      acceptSymbol; /* -1 (Terminal), or index into Grammar.SymbolArray[]. */
    this.edgeCount = edgeCount; /* Number of items in edges[] array. */
    this.edges = edges; /* Array of DfaEdgeclass. */
  }
}

module.exports = DfaState;
