class SyntaxHighlighter extends HTMLElement {
  private originalCode: string = "";

  connectedCallback() {
    this.originalCode =
      this.getAttribute("data-code") || this.textContent || "";
    this.render();

    // Escuchar eventos de actualización
    this.addEventListener("update", () => {
      this.render();
    });
  }

  render() {
    const code = this.getAttribute("data-replacement") || this.originalCode;
    this.innerHTML = this.highlight(code);
  }

  highlight(code: string): string {
    const keywords = [
      "import",
      "from",
      "export",
      "const",
      "let",
      "var",
      "function",
      "class",
      "if",
      "else",
      "return",
      "new",
      "async",
      "await",
    ];
    const tokens: Array<{
      type: string;
      value: string;
      isReplacement?: boolean;
    }> = [];
    let i = 0;

    while (i < code.length) {
      // Check for {{cron-expression}} placeholder
      if (code.slice(i, i + 19) === "{{cron-expression}}") {
        tokens.push({
          type: "replacement",
          value: "{{cron-expression}}",
          isReplacement: true,
        });
        i += 19;
        continue;
      }

      // Strings
      if (code[i] === '"' || code[i] === "'" || code[i] === "`") {
        const quote = code[i];
        let str = quote;
        i++;
        while (i < code.length && code[i] !== quote) {
          if (code[i] === "\\") {
            str += code[i] + (code[i + 1] || "");
            i += 2;
          } else {
            str += code[i];
            i++;
          }
        }
        str += code[i] || "";
        tokens.push({ type: "string", value: str });
        i++;
        continue;
      }

      // Identifiers and keywords
      if (/[a-zA-Z_]/.test(code[i])) {
        let word = "";
        while (i < code.length && /[a-zA-Z0-9_]/.test(code[i])) {
          word += code[i];
          i++;
        }
        if (keywords.includes(word)) {
          tokens.push({ type: "keyword", value: word });
        } else if (/^[A-Z]/.test(word)) {
          tokens.push({ type: "class", value: word });
        } else {
          tokens.push({ type: "text", value: word });
        }
        continue;
      }

      // Operators and punctuation
      if (/[{}()\[\];,=]/.test(code[i])) {
        tokens.push({ type: "operator", value: code[i] });
        i++;
        continue;
      }

      // Whitespace and other characters
      tokens.push({ type: "text", value: code[i] });
      i++;
    }

    const highlighted = tokens
      .map((token) => {
        if (token.isReplacement) {
          return `<span class="string" data-testid="remplaze-cron-expresion">${token.value}</span>`;
        }
        if (token.type === "text") return token.value;
        return `<span class="${token.type}">${token.value}</span>`;
      })
      .join("");

    return `<pre><code>${highlighted}</code></pre>`;
  }
}

customElements.define("syntax-highlighter", SyntaxHighlighter);
