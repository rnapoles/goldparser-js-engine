﻿/*
Name             : Calc
Version          : 0.01
Author           : GOLD Parser Builder and Nick Sabalausky
About            : Basic Calculator Grammar
Case Sensitive   : 
Start Symbol     : 

Character Set     : Unicode
Character Mapping : Windows-1252
Generated By      : GOLD Parser Builder 5.2.0.
Generated Date    : 2021-12-15 15:01

Output File      : Calc.js 
Output File Base : Calc 


This file was generated by the Gold Parser.
The template is Javascript OO Engine

*/

const BaseCalc = require('./BaseCalc');

class Calc extends BaseCalc {

  /***** Rule subroutines *****************************************************/

  /* 
    
    Symbol Count: 3
    0 <Add Exp> ::= <Add Exp> '+' <Mult Exp> 
    TokenType token
    Context ctx
  */
  rule_AddExp_Plus(token,ctx) {
  
    if (ctx.debug > 1) {
      this.log("Calling rule_AddExp_Plus\n");
    }
    
    /*
    //^ <Add Exp> ::= <Add Exp> '+' <Mult Exp>
    */
    this.debugRule(token,ctx); //Replace with your code
  }

  /* 
    
    Symbol Count: 3
    1 <Add Exp> ::= <Add Exp> '-' <Mult Exp> 
    TokenType token
    Context ctx
  */
  rule_AddExp_Minus(token,ctx) {
  
    if (ctx.debug > 1) {
      this.log("Calling rule_AddExp_Minus\n");
    }
    
    /*
    //^ <Add Exp> ::= <Add Exp> '-' <Mult Exp>
    */
    this.debugRule(token,ctx); //Replace with your code
  }

  /* 
    
    Symbol Count: 1
    2 <Add Exp> ::= <Mult Exp> 
    TokenType token
    Context ctx
  */
  rule_AddExp(token,ctx) {
  
    if (ctx.debug > 1) {
      this.log("Calling rule_AddExp\n");
    }
    
    /*
    //^ <Add Exp> ::= <Mult Exp>
    */
    this.debugRule(token,ctx); //Replace with your code
  }

  /* 
    
    Symbol Count: 3
    3 <Mult Exp> ::= <Mult Exp> '*' <Negate Exp> 
    TokenType token
    Context ctx
  */
  rule_MultExp_Times(token,ctx) {
  
    if (ctx.debug > 1) {
      this.log("Calling rule_MultExp_Times\n");
    }
    
    /*
    //^ <Mult Exp> ::= <Mult Exp> '*' <Negate Exp>
    */
    this.debugRule(token,ctx); //Replace with your code
  }

  /* 
    
    Symbol Count: 3
    4 <Mult Exp> ::= <Mult Exp> '/' <Negate Exp> 
    TokenType token
    Context ctx
  */
  rule_MultExp_Div(token,ctx) {
  
    if (ctx.debug > 1) {
      this.log("Calling rule_MultExp_Div\n");
    }
    
    /*
    //^ <Mult Exp> ::= <Mult Exp> '/' <Negate Exp>
    */
    this.debugRule(token,ctx); //Replace with your code
  }

  /* 
    
    Symbol Count: 1
    5 <Mult Exp> ::= <Negate Exp> 
    TokenType token
    Context ctx
  */
  rule_MultExp(token,ctx) {
  
    if (ctx.debug > 1) {
      this.log("Calling rule_MultExp\n");
    }
    
    /*
    //^ <Mult Exp> ::= <Negate Exp>
    */
    this.debugRule(token,ctx); //Replace with your code
  }

  /* 
    
    Symbol Count: 2
    6 <Negate Exp> ::= '-' <Value> 
    TokenType token
    Context ctx
  */
  rule_NegateExp_Minus(token,ctx) {
  
    if (ctx.debug > 1) {
      this.log("Calling rule_NegateExp_Minus\n");
    }
    
    /*
    //^ <Negate Exp> ::= '-' <Value>
    */
    this.debugRule(token,ctx); //Replace with your code
  }

  /* 
    
    Symbol Count: 1
    7 <Negate Exp> ::= <Value> 
    TokenType token
    Context ctx
  */
  rule_NegateExp(token,ctx) {
  
    if (ctx.debug > 1) {
      this.log("Calling rule_NegateExp\n");
    }
    
    /*
    //^ <Negate Exp> ::= <Value>
    */
    this.debugRule(token,ctx); //Replace with your code
  }

  /* 
    
    Symbol Count: 1
    8 <Value> ::= Number 
    TokenType token
    Context ctx
  */
  rule_Value_Number(token,ctx) {
  
    if (ctx.debug > 1) {
      this.log("Calling rule_Value_Number\n");
    }
    
    /*
    //^ <Value> ::= Number
    */
    this.debugRule(token,ctx); //Replace with your code
  }

  /* 
    
    Symbol Count: 3
    9 <Value> ::= '(' <Add Exp> ')' 
    TokenType token
    Context ctx
  */
  rule_Value_LParen_RParen(token,ctx) {
  
    if (ctx.debug > 1) {
      this.log("Calling rule_Value_LParen_RParen\n");
    }
    
    /*
    //^ <Value> ::= '(' <Add Exp> ')'
    */
    this.debugRule(token,ctx); //Replace with your code
  }


  callRule(index,token,ctx)
  {
    switch (index)
    {
      case 0:
        //<Add Exp> ::= <Add Exp> '+' <Mult Exp>
        this.rule_AddExp_Plus(token,ctx);
      break;
      case 1:
        //<Add Exp> ::= <Add Exp> '-' <Mult Exp>
        this.rule_AddExp_Minus(token,ctx);
      break;
      case 2:
        //<Add Exp> ::= <Mult Exp>
        this.rule_AddExp(token,ctx);
      break;
      case 3:
        //<Mult Exp> ::= <Mult Exp> '*' <Negate Exp>
        this.rule_MultExp_Times(token,ctx);
      break;
      case 4:
        //<Mult Exp> ::= <Mult Exp> '/' <Negate Exp>
        this.rule_MultExp_Div(token,ctx);
      break;
      case 5:
        //<Mult Exp> ::= <Negate Exp>
        this.rule_MultExp(token,ctx);
      break;
      case 6:
        //<Negate Exp> ::= '-' <Value>
        this.rule_NegateExp_Minus(token,ctx);
      break;
      case 7:
        //<Negate Exp> ::= <Value>
        this.rule_NegateExp(token,ctx);
      break;
      case 8:
        //<Value> ::= Number
        this.rule_Value_Number(token,ctx);
      break;
      case 9:
        //<Value> ::= '(' <Add Exp> ')'
        this.rule_Value_LParen_RParen(token,ctx);
      break;
      default:
        throw new Error("Unknown rule");
    }
  }

}


module.exports = Calc;
