class Postfixer {
  #operandPattern = /^\d+\.*\d*$/

  #operators = [
    { token: '+', precedence: 1, associativity: 'lr' },
    { token: '-', precedence: 1, associativity: 'lr' },
    { token: '*', precedence: 2, associativity: 'lr' },
    { token: '/', precedence: 2, associativity: 'lr' },
    { token: '^', precedence: 3, associativity: 'rl' }
  ]

  #tokenSeparator = ' '

  /**
   *
   * @param {{
   * operandPattern: RegExp,
   * operators: { token: string, precedence: number, associativity: 'lr'|'rl' }[],
   * tokenSeparator: string
   * }} options
   */
  constructor ({
    operandPattern = this.#operandPattern,
    operators = this.#operators,
    tokenSeparator = this.#tokenSeparator
  } = {}) {
    if (operandPattern) this.#operandPattern = operandPattern
    if (operators) this.#operators = operators
    if (tokenSeparator) this.#tokenSeparator = tokenSeparator
  }

  get (expression) {
    let postfix = ''
    const stack = []

    for (let i = 0; i < expression.length; i += 1) {
      const token = expression[i]

      if (token === '\n' || token === '\r') {
        continue
      }

      if (this.#operandPattern.test(token)) {
        postfix += token

        continue
      }

      if (token === '(') {
        stack.push(token)

        continue
      }

      if (token === ')') {
        let popped = ''

        while (stack.length > 0) {
          popped = stack.pop()
          if (popped === '(') {
            break
          }
          postfix += this.#tokenSeparator + popped + this.#tokenSeparator
        }

        continue
      }

      while (true) {
        postfix += this.#tokenSeparator
        const operator = this.#operators.find((value) => value.token === token)
        const lastOperator = this.#operators.find((value) => value.token === stack.at(-1))

        if (!lastOperator) {
          stack.push(operator.token)
          break
        }

        if (operator && lastOperator && operator.precedence > lastOperator.precedence) {
          stack.push(operator.token)
          break
        }

        if (operator && lastOperator && operator.precedence < lastOperator.precedence) {
          if (this.#operators.find((value) => value.token === stack.at(-1)).precedence >= operator.precedence) {
            postfix += this.#tokenSeparator + stack.pop() + this.#tokenSeparator
            continue
          }

          stack.push(operator.token)
          break
        }

        if (operator && lastOperator && operator.precedence === lastOperator.precedence) {
          if (operator.associativity === 'lr') {
            postfix += this.#tokenSeparator + stack.pop() + this.#tokenSeparator
          }
          stack.push(operator.token)
          break
        }
      }
    }

    while (stack.length > 0) {
      postfix += this.#tokenSeparator + stack.pop() + this.#tokenSeparator
    }

    return postfix
  }

  get operandPattern () {
    return this.#operandPattern
  }

  get operators () {
    return this.#operators
  }

  get tokenSeparator () {
    return this.#operators
  }
}
