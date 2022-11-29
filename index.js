const infixInput = document.getElementById('infix-input')

const postfixer = new Postfixer({
  operandPattern: /[t|f]/,
  operators: [
    { token: 'R', precedence: 1 },
    { token: 'A', precedence: 2 },
    { token: 'N', precedence: 3 },
    { token: 'I', precedence: 3 },
    { token: 'O', precedence: 3 }
  ]
})

function calculate () {
  const expr = postfixer.get(infixInput.value)

  const stack = []

  for (const token of expr.split(' ')) {
    if (postfixer.operandPattern.test(token)) {
      switch (token) {
        case 't': stack.push(true); break
        case 'f': stack.push(false); break
      }
      continue
    }

    switch (token) {
      case 'R': {
        const a = stack.pop()
        const b = stack.pop()
        stack.push(b || a)
        break
      }
      case 'A': {
        const a = stack.pop()
        const b = stack.pop()
        stack.push(b && a)
        break
      }
      case 'N': {
        const a = stack.pop()
        stack.push(!a)
        break
      }
      case 'I': {
        const a = stack.pop()
        const b = stack.pop()
        stack.push(!b || a)
        break
      }
      case 'O': {
        const a = stack.pop()
        const b = stack.pop()
        stack.push((!b || a) && (!a || b))
        break
      }
    }
  }

  const popped = stack.pop()
  infixInput.value = popped === true ? 't' : popped === false ? 'f' : 'Invalid Expression'
}

const buttons = {
  OPEN: document.getElementById('btn-open'),
  CLOSE: document.getElementById('btn-close'),

  TRUE: document.getElementById('btn-true'),
  FALSE: document.getElementById('btn-false'),

  OR: document.getElementById('btn-or'),
  AND: document.getElementById('btn-and'),
  NOT: document.getElementById('btn-not'),
  IF: document.getElementById('btn-if'),
  IFF: document.getElementById('btn-iff'),

  ERASE: document.getElementById('btn-erase'),
  CALCULATE: document.getElementById('btn-calculate')
}

buttons.OPEN.onclick = () => (infixInput.value += '(')
buttons.CLOSE.onclick = () => (infixInput.value += ')')

buttons.NOT.onclick = () => (infixInput.value += 'N')
buttons.AND.onclick = () => (infixInput.value += 'A')
buttons.OR.onclick = () => (infixInput.value += 'R')
buttons.IF.onclick = () => (infixInput.value += 'I')
buttons.IFF.onclick = () => (infixInput.value += 'O')

buttons.TRUE.onclick = () => (infixInput.value += 't')
buttons.FALSE.onclick = () => (infixInput.value += 'f')

buttons.ERASE.onclick = () => (infixInput.value = infixInput.value.slice(0, -1))
buttons.CALCULATE.onclick = () => (calculate())
