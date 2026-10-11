/* ============================================================================
   main.js - Shared engine for "Java Code Review"
   Responsibilities:
     1. CURRICULUM  - the authoritative navigation map (all 18 topics).
     2. buildSidebar()   - renders the left menu on every page.
     3. initAccordion()  - expands/collapses topic groups.
     4. initScrollSpy()  - highlights the section currently in view.
     5. highlightAll()   - custom Java syntax highlighter (no libraries).
     6. initCopyButtons()- copy-to-clipboard for code blocks.
     7. initMobileNav()  - off-canvas drawer toggle on small screens.
   Everything runs on DOMContentLoaded. No dependencies, works over file://.
   ========================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     1. CURRICULUM
     Single source of truth for navigation. The `file` of each entry equals the
     topic page's file name; each item's `id` matches a <section id="..."> on
     that page. Add/remove topics here and the whole site menu updates.
     ------------------------------------------------------------------------ */
  var CURRICULUM = [
    { file: "what-is-java.html", title: "What is Java?", items: [
      { id: "overview", label: "What is Java?" },
      { id: "features", label: "Key Features" },
      { id: "how-it-runs", label: "How Java Runs (JDK/JRE/JVM)" },
      { id: "first-program", label: "Your First Program" }
    ]},
    { file: "installation.html", title: "Installation", items: [
      { id: "download", label: "Download the JDK" },
      { id: "install", label: "Installing the JDK" },
      { id: "path", label: "Setting the PATH" },
      { id: "verify", label: "Verify Installation" },
      { id: "ide", label: "Choosing an IDE" }
    ]},
    { file: "data-types.html", title: "Data Types", items: [
      { id: "overview", label: "Primitive Types Overview" },
      { id: "integers", label: "Integer Types" },
      { id: "floating", label: "Floating-Point Types" },
      { id: "boolean", label: "boolean" },
      { id: "char", label: "char and ASCII" },
      { id: "summary", label: "Type Summary Table" }
    ]},
    { file: "variables.html", title: "Variables", items: [
      { id: "declaring", label: "Declaring Variables" },
      { id: "initializing", label: "Initializing Variables" },
      { id: "naming", label: "Naming Conventions" },
      { id: "examples", label: "Examples" }
    ]},
    { file: "keyboard-input.html", title: "Keyboard Input", items: [
      { id: "overview", label: "Why Keyboard Input?" },
      { id: "import", label: "Step 1: Import Scanner" },
      { id: "setup", label: "Step 2: Create a Scanner" },
      { id: "read", label: "Step 3: Read Input" },
      { id: "gotchas", label: "nextInt vs nextLine" }
    ]},
    { file: "arithmetic-operators.html", title: "Arithmetic Operators", items: [
      { id: "basic", label: "Basic Operators" },
      { id: "division", label: "Integer vs Float Division" },
      { id: "modulus", label: "Modulus %" },
      { id: "compound", label: "Compound Assignment" },
      { id: "incdec", label: "Increment and Decrement" },
      { id: "casting", label: "Casting" }
    ]},
    { file: "errors.html", title: "Errors", items: [
      { id: "overview", label: "Types of Errors" },
      { id: "syntax", label: "Syntax Errors" },
      { id: "runtime", label: "Runtime Errors" },
      { id: "logic", label: "Logic Errors" },
      { id: "debugging", label: "Debugging" }
    ]},
    { file: "styling.html", title: "Styling", items: [
      { id: "names", label: "Meaningful Variable Names" },
      { id: "comments", label: "Comments" },
      { id: "whitespace", label: "White Space" },
      { id: "example", label: "Before and After" }
    ]},
    { file: "statements-expressions.html", title: "Statements & Expressions", items: [
      { id: "statements", label: "Statements" },
      { id: "expressions", label: "Expressions" },
      { id: "numerical", label: "Numerical Expressions" },
      { id: "logical", label: "Logical Expressions" },
      { id: "precedence", label: "Operator Precedence" }
    ]},
    { file: "if-else.html", title: "Selection: if / else", items: [
      { id: "relational", label: "Relational Operators" },
      { id: "if", label: "The if Statement" },
      { id: "else", label: "if / else" },
      { id: "elseif", label: "else if" },
      { id: "logical", label: "Logical Operators" },
      { id: "example", label: "Putting It Together" }
    ]},
    { file: "nested-if-else.html", title: "Nested if / else", items: [
      { id: "what", label: "What Is Nesting?" },
      { id: "syntax", label: "Syntax and Example" },
      { id: "hasnext", label: "Checking Input with hasNext" },
      { id: "hasnextint", label: "Using hasNextInt" }
    ]},
    { file: "while-loop.html", title: "While Loop", items: [
      { id: "overview", label: "What Is a Loop?" },
      { id: "flowchart", label: "Flowchart of a Loop" },
      { id: "syntax", label: "Syntax and Example" },
      { id: "when", label: "When to Use a while Loop" },
      { id: "break", label: "Using break" }
    ]},
    { file: "do-while-loop.html", title: "Do/While Loop", items: [
      { id: "overview", label: "Overview" },
      { id: "syntax", label: "Syntax" },
      { id: "example", label: "Example" },
      { id: "compare", label: "do/while vs while" },
      { id: "when", label: "When to Use" }
    ]},
    { file: "for-loops.html", title: "For Loops", items: [
      { id: "overview", label: "Start, Stop, Keep Going" },
      { id: "syntax", label: "Syntax (init; condition; update)" },
      { id: "example", label: "Example" },
      { id: "zero", label: "Loop That Never Runs" },
      { id: "infinite", label: "Infinite Loop" },
      { id: "nested", label: "Nested for Loops" }
    ]},
    { file: "switch.html", title: "Switch", items: [
      { id: "overview", label: "Overview and When to Use" },
      { id: "syntax", label: "Syntax with ->" },
      { id: "multiple", label: "Multiple Labels" },
      { id: "default", label: "The default Statement" },
      { id: "flowchart", label: "Flowchart" },
      { id: "limitations", label: "Limitations" }
    ]},
    { file: "exceptions.html", title: "Exceptions", items: [
      { id: "overview", label: "What Is an Exception?" },
      { id: "structure", label: "try-catch Structure" },
      { id: "example", label: "Example" },
      { id: "multiple", label: "Multiple catch Blocks" },
      { id: "finally", label: "The finally Block" },
      { id: "common", label: "Common Exceptions" }
    ]},
    { file: "methods.html", title: "Methods", items: [
      { id: "overview", label: "Purpose of Methods" },
      { id: "structure", label: "Structure and Syntax" },
      { id: "declaring", label: "Declaring a Method" },
      { id: "parameters", label: "Parameters" },
      { id: "return", label: "Return Types" },
      { id: "calling", label: "Calling Methods" },
      { id: "example", label: "Full Example" }
    ]},
    { file: "strings.html", title: "Strings", items: [
      { id: "what", label: "What Is a String?" },
      { id: "create", label: "Creating Strings" },
      { id: "methods", label: "String Methods Overview" },
      { id: "detailed", label: "Method Details" },
      { id: "loop", label: "Looping Through a String" }
    ]}
  ];

  /* Helper: base file name of the page we're on (set via <body data-page="...">). */
  function currentPage() {
    return (document.body && document.body.dataset.page) || "";
  }

  /* ------------------------------------------------------------------------
     2. buildSidebar()
     Renders the left menu into #sidebar. The current topic is auto-expanded and
     its first/matching anchor is marked active. Links are plain relative hrefs
     so they also work as cross-page deep links (e.g. arithmetic-operators.html#casting).
     ------------------------------------------------------------------------ */
  function buildSidebar() {
    var sidebar = document.getElementById("sidebar");
    if (!sidebar) return;

    var page = currentPage();
    var hash = (location.hash || "").replace(/^#/, "");
    var frag = document.createDocumentFragment();

    // Small "Curriculum" heading + Home shortcut
    var heading = document.createElement("div");
    heading.className = "sidebar-heading";
    heading.textContent = "Curriculum";
    frag.appendChild(heading);

    var home = document.createElement("a");
    home.className = "home-link";
    home.href = "index.html";
    home.textContent = "Home";
    frag.appendChild(home);

    // One collapsible group per topic
    CURRICULUM.forEach(function (topic) {
      var base = topic.file.replace(/\.html$/, "");
      var isCurrent = base === page;

      var group = document.createElement("div");
      group.className = "nav-group" + (isCurrent ? " open" : "");

      var title = document.createElement("button");
      title.type = "button";
      title.className = "nav-group-title" + (isCurrent ? " current" : "");
      title.textContent = topic.title;
      group.appendChild(title);

      var list = document.createElement("div");
      list.className = "nav-list";

      topic.items.forEach(function (item, idx) {
        var a = document.createElement("a");
        a.href = topic.file + "#" + item.id;
        a.textContent = item.label;
        // Mark active when on the matching page and at the current (or first) section.
        if (isCurrent && ((hash && hash === item.id) || (!hash && idx === 0))) {
          a.classList.add("active");
        }
        list.appendChild(a);
      });

      group.appendChild(list);
      frag.appendChild(group);
    });

    sidebar.appendChild(frag);
  }

  /* ------------------------------------------------------------------------
     3. initAccordion()
     Clicking a topic title toggles its section list open/closed.
     ------------------------------------------------------------------------ */
  function initAccordion() {
    document.querySelectorAll(".nav-group-title").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var group = btn.closest(".nav-group");
        if (group) group.classList.toggle("open");
      });
    });
  }

  /* ------------------------------------------------------------------------
     4. initScrollSpy()
     Highlights the sidebar anchor for the section currently in view (current
     page only). Uses IntersectionObserver for smooth, cheap tracking.
     ------------------------------------------------------------------------ */
  function initScrollSpy() {
    var sections = document.querySelectorAll(".content section[id]");
    if (!sections.length || !("IntersectionObserver" in window)) return;

    var page = currentPage();
    var links = {};

    document.querySelectorAll("#sidebar .nav-list a").forEach(function (a) {
      var href = a.getAttribute("href") || "";
      var parts = href.split("#");
      if (parts[0].replace(/\.html$/, "") === page && parts[1]) {
        links[parts[1]] = a;
      }
    });

    function activate(id) {
      Object.keys(links).forEach(function (k) { links[k].classList.remove("active"); });
      if (links[id]) links[id].classList.add("active");
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) activate(entry.target.id);
      });
    }, { rootMargin: "-70px 0px -70% 0px", threshold: 0 });

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ------------------------------------------------------------------------
     5. highlightAll() + Java syntax highlighter
     Reads each <code data-lang="java"> block's text, tokenizes it, escapes
     every token for safe HTML, and wraps it in <span class="tok-...">.
     ------------------------------------------------------------------------ */
  var JAVA_KEYWORDS = {};
  ("abstract assert boolean break byte case catch char class const continue " +
   "default do double else enum extends final finally float for goto if " +
   "implements import instanceof int interface long native new package private " +
   "protected public return short static strictfp super switch synchronized " +
   "this throw throws transient try void volatile while true false null var record")
    .split(" ").forEach(function (k) { JAVA_KEYWORDS[k] = true; });

  /* Escape text so it is safe to inject as HTML. */
  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* One combined regex; alternatives are ordered MOST SPECIFIC FIRST so that
     comments and strings win over keyword/identifier matching. */
  var TOKEN_RE = new RegExp(
    "(/\\*[\\s\\S]*?\\*/)" +          /* 1 block comment */
    "|(//[^\\n]*)" +                   /* 2 line comment  */
    "|(\"(?:\\\\.|[^\"\\\\])*\")" +    /* 3 string literal */
    "|('(?:\\\\.|[^'\\\\])*')" +       /* 4 char literal   */
    "|(@[A-Za-z_]\\w*)" +              /* 5 annotation     */
    "|(\\b\\d+(?:\\.\\d+)?[fFdDlL]?\\b)" + /* 6 number    */
    "|([A-Za-z_]\\w*)" +               /* 7 word           */
    "|([+\\-*/%=<>!&|^~?:]+)" +        /* 8 operator       */
    "|([{}\\[\\]();,.])",              /* 9 punctuation    */
    "g"
  );

  /* Tokenize a raw Java string and return highlighted HTML. */
  function highlightJava(raw) {
    var out = "";
    var last = 0;
    var m;
    TOKEN_RE.lastIndex = 0;

    while ((m = TOKEN_RE.exec(raw)) !== null) {
      if (m.index > last) out += escapeHtml(raw.slice(last, m.index)); // gaps/whitespace
      var text = m[0];
      var cls = "";

      if (m[1] || m[2]) cls = "tok-com";
      else if (m[3] || m[4]) cls = "tok-str";
      else if (m[5]) cls = "tok-anno";
      else if (m[6]) cls = "tok-num";
      else if (m[7]) {
        var w = m[7];
        if (JAVA_KEYWORDS[w]) cls = "tok-kw";
        else {
          // A word immediately followed by "(" is treated as a method call.
          var j = m.index + w.length;
          while (j < raw.length && (raw[j] === " " || raw[j] === "\t")) j++;
          if (raw[j] === "(") cls = "tok-fn";
          else if (/^[A-Z]/.test(w)) cls = "tok-type";
        }
      }
      else if (m[8]) cls = "tok-op";
      else if (m[9]) cls = "tok-punc";

      out += cls ? '<span class="' + cls + '">' + escapeHtml(text) + "</span>"
                 : escapeHtml(text);
      last = m.index + text.length;
      if (text.length === 0) TOKEN_RE.lastIndex++; // guard against zero-width loop
    }
    if (last < raw.length) out += escapeHtml(raw.slice(last));
    return out;
  }

  function highlightAll() {
    document.querySelectorAll('pre code[data-lang="java"]').forEach(function (el) {
      el.innerHTML = highlightJava(el.textContent); // textContent decodes entities first
    });
  }

  /* ------------------------------------------------------------------------
     6. initCopyButtons()
     Copy the sibling code block to the clipboard. Falls back to a hidden
     textarea for file:// / insecure contexts where the Clipboard API is absent.
     ------------------------------------------------------------------------ */
  function fallbackCopy(text) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch (e) {
      return false;
    }
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text)
        .then(function () { return true; })
        .catch(function () { return fallbackCopy(text); });
    }
    return Promise.resolve(fallbackCopy(text));
  }

  function initCopyButtons() {
    document.querySelectorAll(".copy-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var fig = btn.closest(".code-block");
        var code = fig ? fig.querySelector("code") : null;
        copyText(code ? code.textContent : "").then(function (ok) {
          var original = btn.textContent;
          btn.textContent = ok ? "Copied!" : "Ctrl+C";
          setTimeout(function () { btn.textContent = original; }, 1200);
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     7. initMobileNav()
     Toggle the off-canvas sidebar on small screens; close it after a link tap.
     ------------------------------------------------------------------------ */
  function initMobileNav() {
    var toggle = document.getElementById("menuToggle");
    var sidebar = document.getElementById("sidebar");
    if (toggle && sidebar) {
      toggle.addEventListener("click", function () {
        sidebar.classList.toggle("open");
      });
      sidebar.addEventListener("click", function (e) {
        if (e.target && e.target.tagName === "A") sidebar.classList.remove("open");
      });
    }
  }

  /* ---- Bootstrap everything once the DOM is ready ---- */
  document.addEventListener("DOMContentLoaded", function () {
    buildSidebar();
    initAccordion();
    initScrollSpy();
    initMobileNav();
    highlightAll();
    initCopyButtons();
  });
})();
