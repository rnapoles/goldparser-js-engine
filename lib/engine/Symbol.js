/* Grammar table and sub-tables. */
/* Grammar.SymbolArray[] */
class Symbol {
  constructor(kind, name) {
    this.kind = kind; /* 0...7, See SYMBOL defines. */
    this.name = name; /* String with name of symbol. */
  }
}

module.exports = Symbol;
