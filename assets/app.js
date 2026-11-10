(function () {
  "use strict";

  var DATA = window.ECORECIPES;
  var ORG = DATA.org;
  var GH = "https://github.com/" + ORG + "/";
  var DOCS = "https://" + ORG + ".github.io/";

  var byName = {};
  DATA.PACKAGES.forEach(function (p) { byName[p.name] = p; });
  var roleById = {};
  DATA.ROLES.forEach(function (r, i) { roleById[r.id] = { label: r.label, order: i, hint: r.hint }; });

  var state = { q: "", family: null, role: null };

  /* ---------- tiny DOM helpers ---------- */
  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v == null || v === false) return;
        if (k === "class") el.className = v;
        else if (k === "text") el.textContent = v;
        else if (k.slice(0, 2) === "on") el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v === true ? "" : v);
      });
    }
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i];
      if (c == null || c === false) continue;
      el.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    }
    return el;
  }
  function $(id) { return document.getElementById(id); }
  function anchorId(name) { return "pkg-" + name.replace(/[^A-Za-z0-9]+/g, "-"); }
  function icon(path) {
    var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("width", "14"); s.setAttribute("height", "14");
    s.setAttribute("aria-hidden", "true");
    var p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", path); p.setAttribute("fill", "none"); p.setAttribute("stroke", "currentColor");
    p.setAttribute("stroke-width", "2"); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round");
    s.appendChild(p);
    return s;
  }
  var ICON = {
    book: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Zm0 16a2 2 0 0 0 2 2h13",
    code: "m8 8-4 4 4 4m8-8 4 4-4 4M14 5l-4 14",
    copy: "M9 9h11v11H9zM5 15H4V4h11v1",
  };

  function installCommand(p) {
    return 'using Pkg; Pkg.add(url="' + GH + p.name + '")';
  }

  function copyText(text, btn, done) {
    var original = btn.lastChild.textContent;
    function ok() {
      btn.lastChild.textContent = done || "Copied";
      setTimeout(function () { btn.lastChild.textContent = original; }, 1400);
    }
    function fallback() {
      var ta = h("textarea", { style: "position:fixed;opacity:0" });
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); ok(); } catch (e) {}
      ta.remove();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok, fallback);
    } else fallback();
  }

  /* ---------- package link (used by tasks, chooser, see-also) ---------- */
  function pkgLink(name) {
    var p = byName[name];
    return h("a", {
      class: "pkg-link", href: "#" + anchorId(name), "data-family": p ? p.family : null,
      onclick: function (e) { e.preventDefault(); reveal(name); },
      text: name,
    });
  }

  function reveal(name) {
    if (!byName[name]) return;
    // Make sure the target is not filtered out, then scroll to it.
    state.q = ""; state.family = null; state.role = null;
    $("q").value = "";
    applyFilters();
    var el = $(anchorId(name));
    if (!el) return;
    history.replaceState(null, "", "#" + el.id);
    el.scrollIntoView({ block: "center" });
    el.classList.remove("flash");
    void el.offsetWidth;
    el.classList.add("flash");
  }

  /* ---------- cards ---------- */
  function card(p) {
    var isJulia = !p.lang || p.lang === "Julia";
    var base = p.name.replace(/\.jl$/, "");
    var title = h("a", { href: p.docs ? DOCS + p.name + "/" : GH + p.name }, base,
      /\.jl$/.test(p.name) ? h("span", { class: "ext", text: ".jl" }) : null);

    var actions = h("div", { class: "card-actions" },
      p.docs
        ? h("a", { href: DOCS + p.name + "/" }, icon(ICON.book), "Docs")
        : h("span", { class: "no-docs", text: "README only" }),
      h("a", { href: GH + p.name }, icon(ICON.code), "Source"),
      isJulia
        ? h("button", {
            type: "button", class: "copy-install", title: installCommand(p),
            onclick: function (e) { copyText(installCommand(p), e.currentTarget); },
          }, icon(ICON.copy), "Copy install")
        : null
    );

    return h("article", { class: "card", id: anchorId(p.name), "data-family": p.family, "data-name": p.name },
      h("div", { class: "card-top" },
        h("span", { class: "role", text: roleById[p.role].label, title: roleById[p.role].hint }),
        !isJulia ? h("span", { class: "badge", text: p.lang }) : null,
        p.fork ? h("span", { class: "badge", text: "Fork" }) : null
      ),
      h("h4", null, title),
      p.pkg ? h("p", { class: "aka" }, "Package name: ", h("code", { text: p.pkg })) : null,
      h("p", { class: "blurb", text: p.blurb }),
      actions
    );
  }

  function chooser(c) {
    var table = h("table", null,
      h("tr", null, h("td", null), h("th", { scope: "col", text: c.cols[0] }), h("th", { scope: "col", text: c.cols[1] }))
    );
    c.rows.forEach(function (r) {
      var tr = h("tr", null, h("th", { scope: "row", text: r.label }));
      if (r.span) tr.appendChild(h("td", { colspan: "2" }, pkgLink(r.span)));
      else r.cells.forEach(function (n) { tr.appendChild(h("td", null, pkgLink(n))); });
      table.appendChild(tr);
    });
    return h("figure", { class: "chooser" }, h("figcaption", { text: c.caption }), table);
  }

  /* ---------- render ---------- */
  function renderFamilies() {
    var root = $("families");
    DATA.FAMILIES.forEach(function (f) {
      var pkgs = DATA.PACKAGES.filter(function (p) { return p.family === f.id; })
        .sort(function (a, b) { return roleById[a.role].order - roleById[b.role].order; });
      var grid = h("div", { class: "grid" });
      pkgs.forEach(function (p) { grid.appendChild(card(p)); });

      var head = h("header", { class: "family-head" },
        h("h3", null, f.title, h("span", { class: "count", text: pkgs.length + (pkgs.length === 1 ? " repository" : " repositories") })),
        h("p", { text: f.blurb })
      );
      if (f.seeAlso) {
        var sa = h("p", { class: "see-also" }, "See also ");
        f.seeAlso.forEach(function (n, i) { if (i) sa.appendChild(document.createTextNode(" ")); sa.appendChild(pkgLink(n)); });
        head.appendChild(sa);
      }
      root.appendChild(h("section", { class: "family", id: "family-" + f.id, "data-family": f.id },
        head, f.chooser ? chooser(f.chooser) : null, grid));
    });
  }

  function renderTasks() {
    var ul = $("tasks");
    DATA.TASKS.forEach(function (t) {
      var use = h("span", { class: "use" });
      t.use.forEach(function (n) { use.appendChild(pkgLink(n)); });
      ul.appendChild(h("li", null, h("span", { class: "want", text: t.want }), use));
    });
  }

  function renderChips() {
    var fam = $("family-chips");
    function famChip(id, label, n) {
      return h("button", {
        type: "button", class: "chip", "data-family": id, "data-value": id || "", "aria-pressed": id ? "false" : "true",
        onclick: function () { state.family = id; applyFilters(); },
      }, id ? h("span", { class: "dot" }) : null, label, h("span", { class: "n", text: String(n) }));
    }
    fam.appendChild(famChip(null, "All", DATA.PACKAGES.length));
    DATA.FAMILIES.forEach(function (f) {
      var n = DATA.PACKAGES.filter(function (p) { return p.family === f.id; }).length;
      fam.appendChild(famChip(f.id, f.short, n));
    });

    var roles = $("role-chips");
    DATA.ROLES.forEach(function (r) {
      roles.appendChild(h("button", {
        type: "button", class: "chip", "data-value": r.id, "aria-pressed": "false", title: r.hint,
        onclick: function () { state.role = state.role === r.id ? null : r.id; applyFilters(); },
        text: r.label,
      }));
    });
  }

  function renderStats() {
    var n = DATA.PACKAGES.length;
    var docs = DATA.PACKAGES.filter(function (p) { return p.docs; }).length;
    var stats = [[n, "repositories"], [DATA.FAMILIES.length, "families"], [docs, "with online docs"]];
    var dl = $("stats");
    stats.forEach(function (s) {
      dl.appendChild(h("div", null, h("dt", { text: s[1] }), h("dd", { text: String(s[0]) })));
    });
    document.querySelectorAll('[data-stat="packages"]').forEach(function (el) { el.textContent = n; });
  }

  /* ---------- filtering ---------- */
  function matches(p, terms) {
    if (state.family && p.family !== state.family) return false;
    if (state.role && p.role !== state.role) return false;
    if (!terms.length) return true;
    var hay = (p.name + " " + (p.pkg || "") + " " + p.blurb + " " + (p.tags || "") + " " +
      roleById[p.role].label + " " + (p.lang || "Julia")).toLowerCase();
    return terms.every(function (t) { return hay.indexOf(t) !== -1; });
  }

  function applyFilters() {
    var terms = state.q.toLowerCase().split(/\s+/).filter(Boolean);
    var shown = 0;
    DATA.FAMILIES.forEach(function (f) {
      var sec = $("family-" + f.id), any = false;
      sec.querySelectorAll(".card").forEach(function (el) {
        var ok = matches(byName[el.dataset.name], terms);
        el.hidden = !ok;
        if (ok) { any = true; shown++; }
      });
      sec.hidden = !any;
      var ch = sec.querySelector(".chooser");
      if (ch) ch.hidden = !!(terms.length || state.role);
    });
    document.querySelectorAll("#family-chips .chip").forEach(function (c) {
      c.setAttribute("aria-pressed", String((c.dataset.value || null) === state.family));
    });
    document.querySelectorAll("#role-chips .chip").forEach(function (c) {
      c.setAttribute("aria-pressed", String(c.dataset.value === state.role));
    });
    var filtered = !!(terms.length || state.family || state.role);
    $("empty").hidden = shown > 0;
    $("result-count").textContent = filtered
      ? "Showing " + shown + " of " + DATA.PACKAGES.length + " repositories"
      : "";
  }

  /* ---------- repositories not yet in the catalogue ---------- */
  function checkUncatalogued() {
    var KEY = "ecorecipes-repos-v1";
    function show(repos) {
      var extra = repos.filter(function (r) { return !byName[r.name] && r.name !== ORG + ".github.io" && r.name !== ".github"; });
      if (!extra.length) return;
      var grid = $("uncatalogued-grid");
      extra.forEach(function (r) {
        grid.appendChild(h("article", { class: "card" },
          h("h4", null, h("a", { href: GH + r.name, text: r.name })),
          h("p", { class: "blurb", text: r.description || "No description yet." })
        ));
      });
      $("uncatalogued").hidden = false;
    }
    try {
      var cached = sessionStorage.getItem(KEY);
      if (cached) return show(JSON.parse(cached));
    } catch (e) {}
    if (!window.fetch || location.protocol === "file:") return;
    fetch("https://api.github.com/orgs/" + ORG + "/repos?type=public&per_page=100&sort=created")
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (list) {
        var repos = list.filter(function (r) { return !r.archived; })
          .map(function (r) { return { name: r.name, description: r.description }; });
        try { sessionStorage.setItem(KEY, JSON.stringify(repos)); } catch (e) {}
        show(repos);
      })
      .catch(function () {});
  }

  /* ---------- hero: forest-fire cellular automaton ---------- */
  function heroCA() {
    var canvas = $("hero-ca");
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    var CELL = 11, P_GROW = 0.012, P_SPARK = 0.00012;
    var cols, rows, grid, next, dpr, timer = null, visible = true;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function colors() {
      var cs = getComputedStyle(document.documentElement);
      return { tree: cs.getPropertyValue("--accent").trim(), fire: cs.getPropertyValue("--fire").trim() };
    }
    var col = colors();

    function resize() {
      var r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
      cols = Math.ceil(r.width / CELL); rows = Math.ceil(r.height / CELL);
      grid = new Uint8Array(cols * rows); next = new Uint8Array(cols * rows);
      for (var i = 0; i < grid.length; i++) grid[i] = Math.random() < 0.45 ? 1 : 0;
      for (var k = 0; k < 40; k++) step();
      draw();
    }

    function step() {
      for (var y = 0; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
          var i = y * cols + x, s = grid[i], n = 0;
          if (s === 2) n = 0;
          else if (s === 0) n = Math.random() < P_GROW ? 1 : 0;
          else {
            var burning =
              (x > 0 && grid[i - 1] === 2) || (x < cols - 1 && grid[i + 1] === 2) ||
              (y > 0 && grid[i - cols] === 2) || (y < rows - 1 && grid[i + cols] === 2);
            n = burning || Math.random() < P_SPARK ? 2 : 1;
          }
          next[i] = n;
        }
      }
      var t = grid; grid = next; next = t;
    }

    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cols * CELL, rows * CELL);
      for (var pass = 1; pass <= 2; pass++) {
        ctx.fillStyle = pass === 1 ? col.tree : col.fire;
        ctx.globalAlpha = pass === 1 ? 0.22 : 0.9;
        ctx.beginPath();
        for (var y = 0; y < rows; y++) {
          for (var x = 0; x < cols; x++) {
            if (grid[y * cols + x] !== pass) continue;
            var cx = x * CELL + CELL / 2, cy = y * CELL + CELL / 2;
            ctx.moveTo(cx + 3, cy);
            ctx.arc(cx, cy, 3, 0, 6.2832);
          }
        }
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function tick() { step(); draw(); }
    function run() {
      var should = visible && !document.hidden && !reduce;
      if (should && !timer) timer = setInterval(tick, 110);
      else if (!should && timer) { clearInterval(timer); timer = null; }
    }

    resize();
    var rt;
    window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(resize, 150); });
    document.addEventListener("visibilitychange", run);
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; run(); }).observe(canvas);
    }
    document.addEventListener("ecorecipes:theme", function () { col = colors(); draw(); });
    run();
  }

  /* ---------- theme ---------- */
  function initTheme() {
    $("theme-toggle").addEventListener("click", function () {
      var root = document.documentElement;
      var dark = root.dataset.theme
        ? root.dataset.theme === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.dataset.theme = dark ? "light" : "dark";
      try { localStorage.setItem("ecorecipes-theme", root.dataset.theme); } catch (e) {}
      document.dispatchEvent(new Event("ecorecipes:theme"));
    });
  }

  /* ---------- init ---------- */
  renderStats();
  renderTasks();
  renderChips();
  renderFamilies();
  applyFilters();
  initTheme();
  heroCA();
  checkUncatalogued();

  var q = $("q");
  q.addEventListener("input", function () { state.q = q.value; applyFilters(); });
  $("clear-filters").addEventListener("click", function () {
    state.q = ""; state.family = null; state.role = null; q.value = ""; applyFilters(); q.focus();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName) && !e.metaKey && !e.ctrlKey) {
      e.preventDefault(); q.focus();
    } else if (e.key === "Escape" && document.activeElement === q) {
      q.value = ""; state.q = ""; applyFilters(); q.blur();
    }
  });
  document.querySelectorAll("[data-copy-from]").forEach(function (btn) {
    btn.addEventListener("click", function () { copyText($(btn.dataset.copyFrom).textContent, btn); });
  });

  // Deep links: #pkg-Name highlights the card once rendered.
  if (/^#pkg-/.test(location.hash)) {
    var target = document.getElementById(location.hash.slice(1));
    if (target) { target.scrollIntoView({ block: "center" }); target.classList.add("flash"); }
  }
})();
