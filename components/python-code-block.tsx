import type { ReactNode } from "react";

type TokenType =
  | "keyword"
  | "builtin"
  | "string"
  | "comment"
  | "number"
  | "decorator"
  | "class-name"
  | "func-name"
  | "operator"
  | "punctuation"
  | "identifier";

type Token = {
  text: string;
  type?: TokenType;
};

type PythonCodeBlockProps = {
  code: string;
  className?: string;
};

const KEYWORDS = new Set([
  "and",
  "as",
  "assert",
  "async",
  "await",
  "break",
  "case",
  "class",
  "continue",
  "def",
  "del",
  "elif",
  "else",
  "except",
  "False",
  "finally",
  "for",
  "from",
  "global",
  "if",
  "import",
  "in",
  "is",
  "lambda",
  "match",
  "None",
  "nonlocal",
  "not",
  "or",
  "pass",
  "raise",
  "return",
  "True",
  "try",
  "while",
  "with",
  "yield"
]);

const BUILTINS = new Set([
  "ABC",
  "Exception",
  "NotImplementedError",
  "Protocol",
  "abstractmethod",
  "all",
  "any",
  "bool",
  "dataclass",
  "dict",
  "enumerate",
  "field",
  "float",
  "int",
  "isinstance",
  "len",
  "list",
  "map",
  "max",
  "min",
  "object",
  "print",
  "range",
  "set",
  "str",
  "sum",
  "super",
  "tuple",
  "type",
  "zip"
]);

const OPERATOR_RE = /^(==|!=|<=|>=|:=|\*\*|\/\/|->|[+\-*/%=&|^~<>])/;
const PUNCTUATION_RE = /^[:;,.\[\]{}()]/;
const IDENTIFIER_RE = /^[A-Za-z_][A-Za-z0-9_]*/;
const NUMBER_RE = /^\d+(?:\.\d+)?/;
const WHITESPACE_RE = /^\s+/;
const DECORATOR_RE = /^@[A-Za-z_][A-Za-z0-9_.]*/;

function readQuoted(line: string, quote: "'" | '"'): string | null {
  if (!line.startsWith(quote)) return null;
  let i = 1;
  while (i < line.length) {
    const ch = line[i];
    if (ch === "\\") {
      i += 2;
      continue;
    }
    if (ch === quote) {
      return line.slice(0, i + 1);
    }
    i += 1;
  }
  return line;
}

function readTripleQuoted(line: string, quote: "'''" | '"""'): string | null {
  if (!line.startsWith(quote)) return null;
  const idx = line.indexOf(quote, 3);
  if (idx === -1) return line;
  return line.slice(0, idx + 3);
}

function pushToken(tokens: Token[], text: string, type?: TokenType): void {
  if (!text) return;
  tokens.push({ text, type });
}

function tokenizePythonLine(line: string): Token[] {
  const tokens: Token[] = [];
  let rest = line;

  while (rest.length > 0) {
    const ws = rest.match(WHITESPACE_RE)?.[0];
    if (ws) {
      pushToken(tokens, ws);
      rest = rest.slice(ws.length);
      continue;
    }

    if (rest.startsWith("#")) {
      pushToken(tokens, rest, "comment");
      break;
    }

    const tripleSingle = readTripleQuoted(rest, "'''");
    if (tripleSingle) {
      pushToken(tokens, tripleSingle, "string");
      rest = rest.slice(tripleSingle.length);
      continue;
    }

    const tripleDouble = readTripleQuoted(rest, '"""');
    if (tripleDouble) {
      pushToken(tokens, tripleDouble, "string");
      rest = rest.slice(tripleDouble.length);
      continue;
    }

    const single = readQuoted(rest, "'");
    if (single) {
      pushToken(tokens, single, "string");
      rest = rest.slice(single.length);
      continue;
    }

    const double = readQuoted(rest, '"');
    if (double) {
      pushToken(tokens, double, "string");
      rest = rest.slice(double.length);
      continue;
    }

    const decorator = rest.match(DECORATOR_RE)?.[0];
    if (decorator) {
      pushToken(tokens, decorator, "decorator");
      rest = rest.slice(decorator.length);
      continue;
    }

    const number = rest.match(NUMBER_RE)?.[0];
    if (number) {
      pushToken(tokens, number, "number");
      rest = rest.slice(number.length);
      continue;
    }

    const op = rest.match(OPERATOR_RE)?.[0];
    if (op) {
      pushToken(tokens, op, "operator");
      rest = rest.slice(op.length);
      continue;
    }

    const punct = rest.match(PUNCTUATION_RE)?.[0];
    if (punct) {
      pushToken(tokens, punct, "punctuation");
      rest = rest.slice(punct.length);
      continue;
    }

    const ident = rest.match(IDENTIFIER_RE)?.[0];
    if (ident) {
      if (ident === "class" || ident === "def") {
        pushToken(tokens, ident, "keyword");
        rest = rest.slice(ident.length);

        const afterKeywordWs = rest.match(WHITESPACE_RE)?.[0] ?? "";
        pushToken(tokens, afterKeywordWs);
        rest = rest.slice(afterKeywordWs.length);

        const name = rest.match(IDENTIFIER_RE)?.[0];
        if (name) {
          pushToken(tokens, name, ident === "class" ? "class-name" : "func-name");
          rest = rest.slice(name.length);
        }
        continue;
      }

      if (KEYWORDS.has(ident)) {
        pushToken(tokens, ident, "keyword");
      } else if (BUILTINS.has(ident)) {
        pushToken(tokens, ident, "builtin");
      } else {
        pushToken(tokens, ident, "identifier");
      }
      rest = rest.slice(ident.length);
      continue;
    }

    pushToken(tokens, rest[0], "punctuation");
    rest = rest.slice(1);
  }

  return tokens;
}

function renderPythonCode(code: string): ReactNode[] {
  const lines = code.split("\n");
  return lines.map((line, lineIndex) => {
    const tokens = tokenizePythonLine(line);
    return (
      <span className="py-line" key={`line-${lineIndex}`}>
        {tokens.map((token, tokenIndex) =>
          token.type ? (
            <span className={`py-token ${token.type}`} key={`tok-${lineIndex}-${tokenIndex}`}>
              {token.text}
            </span>
          ) : (
            <span key={`tok-${lineIndex}-${tokenIndex}`}>{token.text}</span>
          )
        )}
        {lineIndex < lines.length - 1 ? "\n" : null}
      </span>
    );
  });
}

export function PythonCodeBlock({ code, className }: PythonCodeBlockProps) {
  return (
    <pre className={className}>
      <code className="python-code">{renderPythonCode(code)}</code>
    </pre>
  );
}

