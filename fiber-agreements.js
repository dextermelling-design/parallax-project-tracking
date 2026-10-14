/**
 * Fiber agreements inside Parallax Project Tracking.
 * Agreements live in this browser (localStorage). PDFs download locally.
 *
 * TODO(acrobat-sign): Ben will add Adobe Acrobat Sign later.
 * sendForSignature() is the hook — do not send from here yet.
 */
(() => {
  const LIBRARY_KEY = "parallax-fiber-agreements-v1";
  const SETTINGS_KEY = "parallax-fiber-agreement-settings-v1";
  const PROJECTS_KEY = "parallax-project-tracking-v3";

  const $ = (id) => document.getElementById(id);

  let library = [];
  let activeId = null;
  let dirty = false;
  let linesManual = false;
  let linkedProjectId = "";
  let logo = null;
  let previewUrl = "";
  let toastTimer = 0;

  function todayISO() {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  function uid() {
    return "a-" + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function loadSettings() {
    try {
      const raw = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "null");
      return {
        preparedBy: raw && raw.preparedBy ? String(raw.preparedBy) : "",
        parallaxSignerTitle: raw && raw.parallaxSignerTitle ? String(raw.parallaxSignerTitle) : "",
      };
    } catch {
      return { preparedBy: "", parallaxSignerTitle: "" };
    }
  }

  function rememberSettings(state) {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({
        preparedBy: state.preparedBy || "",
        parallaxSignerTitle: state.parallaxSignerTitle || "",
      })
    );
  }

  function blankState() {
    const settings = loadSettings();
    return {
      docKind: "full",
      projectId: "",
      customerName: "",
      street: "",
      city: "",
      state: "IN",
      zip: "",
      noticeSame: true,
      noticeStreet: "",
      noticeCity: "",
      noticeState: "IN",
      noticeZip: "",
      contactName: "",
      contactTitle: "",
      email: "",
      phone: "",
      taxId: "",
      agreementDate: todayISO(),
      agreementNumber: "",
      termMonths: 36,
      termMtm: false,
      installDate: "",
      fiberLevel: null,
      customSpeed: "",
      customMrc: 0,
      nrcAmount: 0,
      nrcDescription: "",
      notes: "",
      quoteSheet: "",
      preparedBy: settings.preparedBy,
      parallaxSignerTitle: settings.parallaxSignerTitle,
      lineItems: [],
      linesManual: false,
    };
  }

  function getProjects() {
    if (window.ParallaxTracking && typeof window.ParallaxTracking.getProjects === "function") {
      return window.ParallaxTracking.getProjects();
    }
    try {
      const data = JSON.parse(localStorage.getItem(PROJECTS_KEY) || "[]");
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  function parseMoney(raw) {
    const s = String(raw || "").trim();
    if (!s) return { amount: null, uncertain: false, raw: "" };
    const uncertain = /[?]/.test(s);
    const numeric = s.replace(/[^0-9.-]/g, "");
    if (!numeric || numeric === "-" || numeric === "." || numeric === "-.") {
      return { amount: null, uncertain: true, raw: s };
    }
    const n = Number(numeric);
    if (!Number.isFinite(n)) return { amount: null, uncertain: true, raw: s };
    return { amount: n, uncertain, raw: s };
  }

  function parseAddress(raw) {
    const s = String(raw || "").replace(/\s+/g, " ").trim();
    const empty = { street: "", city: "", state: "IN", zip: "" };
    if (!s) return empty;
    const stateZip = "([A-Za-z]{2})\\s+(\\d{5}(?:-\\d{4})?)";
    const parts = s.split(",").map((part) => part.trim()).filter(Boolean);
    if (parts.length >= 3) {
      const tail = parts[parts.length - 1].match(new RegExp("^" + stateZip + "$"));
      if (tail) {
        return {
          street: parts.slice(0, -2).join(", "),
          city: parts[parts.length - 2],
          state: tail[1].toUpperCase(),
          zip: tail[2],
        };
      }
    }
    if (parts.length === 2) {
      const tail = parts[1].match(new RegExp("^(.*?)\\s+" + stateZip + "$"));
      if (tail && tail[1].trim()) {
        return {
          street: parts[0],
          city: tail[1].trim(),
          state: tail[2].toUpperCase(),
          zip: tail[3],
        };
      }
      const only = parts[1].match(new RegExp("^" + stateZip + "$"));
      if (only) {
        return { street: parts[0], city: "", state: only[1].toUpperCase(), zip: only[2] };
      }
    }
    const end = s.match(new RegExp("^(.*)\\s+" + stateZip + "$"));
    if (end && end[1].trim()) {
      return { street: end[1].trim(), city: "", state: end[2].toUpperCase(), zip: end[3] };
    }
    return { street: s, city: "", state: "IN", zip: "" };
  }

  function parseContact(contact, contactPhone) {
    let raw = String(contact || "").trim();
    let phone = String(contactPhone || "").trim();
    let email = "";
    const emailMatch = raw.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    if (emailMatch) {
      email = emailMatch[0];
      raw = (raw.slice(0, emailMatch.index) + " " + raw.slice(emailMatch.index + emailMatch[0].length)).trim();
    }
    const phoneRe = /(?:\+?1[\s.-]*)?(?:\(?\d{3}\)?[\s.-]*)\d{3}[\s.-]*\d{4}/;
    if (!phone) {
      const phoneMatch = raw.match(phoneRe);
      if (phoneMatch) {
        phone = phoneMatch[0].trim();
        raw = (raw.slice(0, phoneMatch.index) + " " + raw.slice(phoneMatch.index + phoneMatch[0].length)).trim();
      }
    } else if (raw.includes(phone)) {
      raw = raw.replace(phone, " ");
    }
    const name = raw
      .replace(/[|]+/g, " ")
      .replace(/\s+/g, " ")
      .replace(/^[\s\-–—,:]+|[\s\-–—,:]+$/g, "")
      .trim();
    return { contactName: name, phone, email };
  }

  function customerNameFromJob(job) {
    const project = String(job.project || "").trim();
    const address = String(job.address || "").trim();
    if (!project) return "";
    if (address && project.toLowerCase().endsWith(address.toLowerCase())) {
      const cut = project.slice(0, project.length - address.length).replace(/[\s\-–—,:]+$/g, "").trim();
      if (cut) return cut;
    }
    return project;
  }

  function levelForAmount(amount) {
    if (amount == null) return { fiberLevel: null, customMrc: 0 };
    const match = FiberPdf.FIBER_LEVELS.find((row) => Math.abs(row.mrc - amount) < 0.001);
    if (match) return { fiberLevel: match.level, customMrc: 0 };
    if (amount > 0) return { fiberLevel: 0, customMrc: amount };
    return { fiberLevel: null, customMrc: 0 };
  }

  function httpUrl(raw) {
    const s = String(raw || "").trim();
    if (!/^https?:\/\//i.test(s)) return "";
    try {
      const url = new URL(s);
      if (url.protocol !== "http:" && url.protocol !== "https:") return "";
      return url.href;
    } catch {
      return "";
    }
  }

  function serviceFromState(state) {
    const level = state.fiberLevel ? FiberPdf.levelByNumber(state.fiberLevel) : null;
    const custom = state.fiberLevel === 0;
    const speed = custom ? String(state.customSpeed || "").trim() : level ? level.speed : "";
    const mrc = custom ? Number(state.customMrc) || 0 : level ? level.mrc : 0;
    return {
      level,
      custom,
      speed,
      mrc,
      description: FiberPdf.serviceTitle(speed),
    };
  }

  function defaultLineItems(state) {
    const svc = serviceFromState(state);
    const nrcNote = String(state.nrcDescription || "").trim();
    const levelPrefix = svc.level ? "Fiber Level " + svc.level.level + " — " : "";
    return [
      {
        id: uid(),
        kind: "mrc",
        description: levelPrefix + svc.description,
        qty: 1,
        unit: svc.mrc,
      },
      {
        id: uid(),
        kind: "nrc",
        description: nrcNote ? "Installation — " + nrcNote : "Installation",
        qty: 1,
        unit: Number(state.nrcAmount) || 0,
      },
    ];
  }

  function noticeCityLine(city, state, zip) {
    const region = [state, zip].filter(Boolean).join(" ");
    return [city, region].filter(Boolean).join(", ");
  }

  function readLineItems() {
    return [...document.querySelectorAll("#fa-lines-body tr")].map((tr) => ({
      id: tr.dataset.id || uid(),
      kind: tr.querySelector("[data-field=kind]").value === "mrc" ? "mrc" : "nrc",
      description: tr.querySelector("[data-field=description]").value.trim(),
      qty: Number(tr.querySelector("[data-field=qty]").value) || 0,
      unit: Number(tr.querySelector("[data-field=unit]").value) || 0,
    }));
  }

  function lineRowHtml(row) {
    const qty = Number(row.qty);
    const unit = Number(row.unit);
    const q = Number.isFinite(qty) ? qty : 1;
    const u = Number.isFinite(unit) ? unit : 0;
    const amount = Math.round(q * u * 100) / 100;
    const kind = row.kind === "mrc" ? "mrc" : "nrc";
    return (
      '<tr data-id="' + escapeHtml(row.id) + '">' +
      '<td><input data-field="description" type="text" value="' + escapeHtml(row.description || "") + '" aria-label="Description" /></td>' +
      '<td><select data-field="kind" aria-label="Charge type">' +
      '<option value="mrc"' + (kind === "mrc" ? " selected" : "") + ">Monthly</option>" +
      '<option value="nrc"' + (kind === "nrc" ? " selected" : "") + ">One-time</option>" +
      "</select></td>" +
      '<td><input data-field="qty" type="number" min="0" step="any" value="' + escapeHtml(String(q)) + '" aria-label="Quantity" /></td>' +
      '<td><input data-field="unit" type="number" min="0" step="0.01" value="' + escapeHtml(String(u)) + '" aria-label="Unit price" /></td>' +
      '<td class="amt" data-field="amount">' + escapeHtml(FiberPdf.money(amount)) + "</td>" +
      '<td><button type="button" class="btn btn-ghost btn-sm" data-remove-line="' + escapeHtml(row.id) + '" aria-label="Remove line">Remove</button></td>' +
      "</tr>"
    );
  }

  function writeLineItems(items) {
    $("fa-lines-body").innerHTML = (items || []).map(lineRowHtml).join("");
  }

  function readForm() {
    const kind = document.querySelector('input[name="fa-doc-kind"]:checked');
    const levelRaw = $("fa-level-grid").dataset.level;
    return {
      docKind: kind && kind.value === "order" ? "order" : "full",
      projectId: $("fa-job").value || "",
      customerName: $("fa-customer").value.trim(),
      street: $("fa-street").value.trim(),
      city: $("fa-city").value.trim(),
      state: $("fa-state").value.trim().toUpperCase() || "IN",
      zip: $("fa-zip").value.trim(),
      noticeSame: $("fa-notice-same").checked,
      noticeStreet: $("fa-notice-street").value.trim(),
      noticeCity: $("fa-notice-city").value.trim(),
      noticeState: $("fa-notice-state").value.trim().toUpperCase() || "IN",
      noticeZip: $("fa-notice-zip").value.trim(),
      contactName: $("fa-contact").value.trim(),
      contactTitle: $("fa-title").value.trim(),
      email: $("fa-email").value.trim(),
      phone: $("fa-phone").value.trim(),
      taxId: $("fa-tax").value.trim(),
      agreementDate: $("fa-date").value || todayISO(),
      agreementNumber: $("fa-number").value.trim(),
      termMonths: Math.max(1, Number($("fa-term").value) || 36),
      termMtm: $("fa-term-mtm").checked,
      installDate: $("fa-install").value,
      fiberLevel: levelRaw == null || levelRaw === "" ? null : Number(levelRaw),
      customSpeed: $("fa-custom-speed").value.trim(),
      customMrc: Number($("fa-custom-mrc").value) || 0,
      nrcAmount: Number($("fa-nrc").value) || 0,
      nrcDescription: $("fa-nrc-desc").value.trim(),
      notes: $("fa-notes").value.trim(),
      quoteSheet: httpUrl($("fa-quote-link").getAttribute("href")),
      preparedBy: $("fa-prepared").value.trim(),
      parallaxSignerTitle: $("fa-signer-title").value.trim(),
      lineItems: readLineItems(),
      linesManual,
    };
  }

  function selectLevel(level) {
    const grid = $("fa-level-grid");
    const selected = level == null || level === "" || Number.isNaN(Number(level)) ? null : Number(level);
    if (selected == null) delete grid.dataset.level;
    else grid.dataset.level = String(selected);
    grid.querySelectorAll(".level-card").forEach((btn) => {
      const on = selected != null && Number(btn.dataset.level) === selected;
      btn.classList.toggle("is-selected", on);
      btn.setAttribute("aria-checked", on ? "true" : "false");
    });
    $("fa-custom-fields").hidden = selected !== 0;
  }

  function clearAttention() {
    ["fa-customer", "fa-street", "fa-city", "fa-zip", "fa-custom-speed"].forEach((id) => {
      $(id).classList.remove("is-attention");
    });
  }

  function setNote(text) {
    const note = $("fa-source");
    if (!text) {
      note.hidden = true;
      note.textContent = "";
      return;
    }
    note.hidden = false;
    note.textContent = text;
  }

  function writeForm(state) {
    const s = Object.assign(blankState(), state || {});
    linesManual = !!s.linesManual;
    linkedProjectId = s.projectId || "";
    $("fa-doc-full").checked = s.docKind !== "order";
    $("fa-doc-order").checked = s.docKind === "order";
    $("fa-job").value = linkedProjectId;
    if ($("fa-job").value !== linkedProjectId) {
      $("fa-job").value = "";
      linkedProjectId = "";
    }
    $("fa-customer").value = s.customerName || "";
    $("fa-street").value = s.street || "";
    $("fa-city").value = s.city || "";
    $("fa-state").value = s.state || "IN";
    $("fa-zip").value = s.zip || "";
    $("fa-notice-same").checked = s.noticeSame !== false;
    $("fa-notice-street").value = s.noticeStreet || "";
    $("fa-notice-city").value = s.noticeCity || "";
    $("fa-notice-state").value = s.noticeState || "IN";
    $("fa-notice-zip").value = s.noticeZip || "";
    $("fa-contact").value = s.contactName || "";
    $("fa-title").value = s.contactTitle || "";
    $("fa-email").value = s.email || "";
    $("fa-phone").value = s.phone || "";
    $("fa-tax").value = s.taxId || "";
    $("fa-date").value = s.agreementDate || todayISO();
    $("fa-number").value = s.agreementNumber || "";
    $("fa-term").value = s.termMonths || 36;
    $("fa-term-mtm").checked = !!s.termMtm;
    $("fa-install").value = s.installDate || "";
    $("fa-custom-speed").value = s.customSpeed || "";
    $("fa-custom-mrc").value = s.customMrc || 0;
    $("fa-nrc").value = s.nrcAmount || 0;
    $("fa-nrc-desc").value = s.nrcDescription || "";
    $("fa-notes").value = s.notes || "";
    $("fa-prepared").value = s.preparedBy || "";
    $("fa-signer-title").value = s.parallaxSignerTitle || "";
    const quote = httpUrl(s.quoteSheet);
    const link = $("fa-quote-link");
    if (quote) {
      link.hidden = false;
      link.href = quote;
    } else {
      link.hidden = true;
      link.removeAttribute("href");
    }
    selectLevel(s.fiberLevel == null ? null : Number(s.fiberLevel));
    writeLineItems(Array.isArray(s.lineItems) ? s.lineItems : []);
    syncNotice();
    syncTerm();
    clearAttention();
    setNote("");
    updateBanner();
    renderSummary();
  }

  function syncNotice() {
    $("fa-notice-fields").hidden = $("fa-notice-same").checked;
  }

  function syncTerm() {
    $("fa-term").disabled = $("fa-term-mtm").checked;
  }

  function syncAutoLines() {
    if (linesManual) return;
    const state = readForm();
    if (state.fiberLevel == null || Number.isNaN(state.fiberLevel)) return;
    writeLineItems(defaultLineItems(state));
  }

  function buildModel(state) {
    const svc = serviceFromState(state);
    const serviceAddress = FiberPdf.joinAddress(state.street, state.city, state.state, state.zip);
    let noticeLines;
    if (state.noticeSame) {
      noticeLines = [state.customerName, state.street, noticeCityLine(state.city, state.state, state.zip)].filter(Boolean);
    } else {
      noticeLines = [
        state.customerName,
        state.noticeStreet,
        noticeCityLine(state.noticeCity, state.noticeState, state.noticeZip),
      ].filter(Boolean);
    }
    const lineItems = (state.lineItems || []).map((row) => {
      const qty = Number(row.qty) || 0;
      const unit = Number(row.unit) || 0;
      return {
        description: row.description,
        qty,
        unit,
        amount: Math.round(qty * unit * 100) / 100,
        kind: row.kind === "mrc" ? "mrc" : "nrc",
      };
    });
    const summedMrc = lineItems.filter((row) => row.kind === "mrc").reduce((sum, row) => sum + row.amount, 0);
    const summedNrc = lineItems.filter((row) => row.kind !== "mrc").reduce((sum, row) => sum + row.amount, 0);
    return {
      docKind: state.docKind,
      customerName: state.customerName,
      serviceAddress,
      noticeLines,
      contactName: state.contactName,
      contactTitle: state.contactTitle,
      email: state.email,
      phone: state.phone,
      taxId: state.taxId,
      agreementDateLabel: FiberPdf.agreementDateLabel(state.agreementDate),
      serviceDateLabel: FiberPdf.serviceDateLabel(state.agreementDate),
      installDateLabel: state.installDate ? FiberPdf.serviceDateLabel(state.installDate) : "",
      agreementNumber: state.agreementNumber,
      preparedBy: state.preparedBy,
      parallaxSignerTitle: state.parallaxSignerTitle,
      levelLabel: svc.level ? "Fiber Level " + svc.level.level : state.fiberLevel === 0 ? "Custom" : "",
      speed: svc.speed,
      serviceDescription: svc.description,
      mrc: lineItems.length ? summedMrc : svc.mrc,
      nrc: lineItems.length ? summedNrc : Number(state.nrcAmount) || 0,
      nrcDescription: state.nrcDescription,
      termLabel: state.termMtm ? "Month-to-month" : state.termMonths + " Months",
      notes: state.notes,
      quoteSheet: state.quoteSheet,
      lineItems,
      signerCount: 2,
    };
  }

  function renderSummary() {
    const state = readForm();
    const model = buildModel(state);
    $("fa-summary-title").textContent = state.docKind === "order" ? "Service order only" : "Agreement + service order";
    $("fa-summary-mrc").textContent = FiberPdf.money(model.mrc);
    $("fa-summary-speed").textContent = model.levelLabel
      ? model.levelLabel + " · " + (model.serviceDescription || "Fiber Internet")
      : "Choose a fiber level";
    const rows = [
      ["Document", state.docKind === "order" ? "Service order" : "Full agreement"],
      ["Term", model.termLabel],
      ["Non-recurring", FiberPdf.money(model.nrc)],
      ["Agreement date", model.serviceDateLabel || "—"],
    ];
    if (model.installDateLabel) rows.push(["Install date", model.installDateLabel]);
    if (linesManual) rows.push(["Line items", "Custom"]);
    const job = state.projectId ? getProjects().find((p) => p.id === state.projectId) : null;
    if (job) rows.push(["Job", job.project || "Linked job"]);
    $("fa-summary-lines").innerHTML = rows
      .map((row) => '<div class="line"><span class="k">' + escapeHtml(row[0]) + "</span><span>" + escapeHtml(row[1]) + "</span></div>")
      .join("");
    $("fa-preamble").textContent = state.docKind === "order"
      ? "Service order only. The contract pages are left out of this PDF."
      : FiberPdf.preamblePlain(model);
    const hint = $("fa-lines-hint");
    if (linesManual) {
      hint.textContent = "Line items are customized. Reset to rebuild them from the fiber level and installation charge.";
    } else if (state.fiberLevel == null) {
      hint.textContent = "Choose a fiber level to pre-fill the monthly row and the installation row. You can also add rows yourself.";
    } else {
      hint.textContent = "These rows follow the fiber level and installation charge until you edit them. Monthly rows total the MRC. One-time rows total the NRC.";
    }
    $("fa-refresh-job").hidden = !state.projectId;
    $("fa-term").disabled = state.termMtm;
  }

  function renderLevels() {
    const cards = FiberPdf.FIBER_LEVELS.map((row) => {
      return (
        '<button type="button" class="level-card" role="radio" aria-checked="false" data-level="' + row.level + '">' +
        '<span class="lvl">Level ' + row.level + "</span>" +
        '<span class="spd">' + escapeHtml(row.speed) + "</span>" +
        '<span class="prc">' + escapeHtml(FiberPdf.money(row.mrc)) + " / mo</span>" +
        "</button>"
      );
    }).join("");
    const custom =
      '<button type="button" class="level-card" role="radio" aria-checked="false" data-level="0">' +
      '<span class="lvl">Custom</span><span class="spd">Other speed</span><span class="prc">Set price</span></button>';
    const grid = $("fa-level-grid");
    grid.innerHTML = cards + custom;
    grid.querySelectorAll(".level-card").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectLevel(Number(btn.dataset.level));
        dirty = true;
        syncAutoLines();
        renderSummary();
      });
    });
  }

  function renderClauses() {
    $("fa-clauses").innerHTML = FiberPdf.CLAUSES.map((clause) => {
      const paras = clause.paras.map((p) => "<p>" + escapeHtml(p) + "</p>").join("");
      const items = (clause.items || []).map((p) => '<p class="item">' + escapeHtml(p) + "</p>").join("");
      let extra = "";
      if (clause.tables) extra += "<p>Interruption credit tables follow this section in the PDF.</p>";
      if (clause.notices) extra += "<p>Notice addresses for Parallax and the customer follow this section.</p>";
      return '<div class="clause"><p><strong>' + escapeHtml(clause.n) + ".</strong></p>" + paras + items + extra + "</div>";
    }).join("");
  }

  function refreshJobPicker() {
    const current = $("fa-job").value || linkedProjectId || "";
    const projects = getProjects()
      .slice()
      .sort((a, b) => String(a.project || "").localeCompare(String(b.project || "")));
    const options = ['<option value="">Manual entry</option>'].concat(
      projects.map((project) => {
        const label = (project.project || "Untitled") + (project.status ? " · " + project.status : "");
        return '<option value="' + escapeHtml(project.id) + '">' + escapeHtml(label) + "</option>";
      })
    );
    $("fa-job").innerHTML = options.join("");
    $("fa-job").value = current;
    if ($("fa-job").value !== current) $("fa-job").value = "";
  }

  function projectToState(job) {
    const addr = parseAddress(job.address);
    const contact = parseContact(job.contact, job.contactPhone);
    const nrc = parseMoney(job.nrc);
    const mrc = parseMoney(job.mrc);
    const level = levelForAmount(mrc.amount);
    const scheduled = String(job.scheduled || "");
    const state = Object.assign(blankState(), {
      projectId: job.id || "",
      customerName: customerNameFromJob(job),
      street: addr.street,
      city: addr.city,
      state: addr.state || "IN",
      zip: addr.zip,
      contactName: contact.contactName,
      phone: contact.phone,
      email: contact.email,
      agreementNumber: String(job.wo || "").trim(),
      installDate: /^\d{4}-\d{2}-\d{2}$/.test(scheduled) ? scheduled : "",
      notes: String(job.notes || "").trim(),
      quoteSheet: httpUrl(job.quoteSheet),
      nrcAmount: nrc.amount == null ? 0 : nrc.amount,
      fiberLevel: level.fiberLevel,
      customMrc: level.customMrc,
      linesManual: false,
    });
    if (state.fiberLevel != null) state.lineItems = defaultLineItems(state);
    const warnings = [];
    warnings.push("Filled from “" + (job.project || "this job") + "”. Review it before downloading.");
    if (!addr.street) warnings.push("This job has no street address.");
    if (!addr.city || !addr.zip) warnings.push("City or ZIP was not in the job address — add them before the PDF.");
    if (nrc.uncertain) warnings.push("Job NRC was “" + nrc.raw + "”. Confirm the installation charge.");
    if (mrc.uncertain) warnings.push("Job MRC was “" + mrc.raw + "”. Confirm the fiber level.");
    if (mrc.amount == null) warnings.push("This job has no monthly charge. Choose a fiber level.");
    state.warnings = warnings;
    return state;
  }

  function applyProject(project) {
    activeId = null;
    const state = projectToState(project);
    const warnings = state.warnings || [];
    delete state.warnings;
    refreshJobPicker();
    writeForm(state);
    if (!state.street) $("fa-street").classList.add("is-attention");
    if (!state.city) $("fa-city").classList.add("is-attention");
    if (!state.zip) $("fa-zip").classList.add("is-attention");
    setNote(warnings.join(" "));
    dirty = true;
    updateBanner();
  }

  function confirmDiscard(message) {
    if (!dirty) return true;
    return confirm(message || "Discard unsaved agreement changes?");
  }

  function latestForProject(projectId) {
    return library
      .filter((row) => row.projectId && row.projectId === projectId)
      .sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")))[0] || null;
  }

  function startFromProject(project) {
    const existing = latestForProject(project.id);
    if (existing) {
      const openSaved = confirm(
        "A saved agreement for this job already exists.\n\nOK opens the saved agreement. Cancel starts a new draft from the current job."
      );
      if (openSaved) {
        if (!confirmDiscard("Discard unsaved changes and open the saved agreement?")) return;
        openAgreement(existing.id, true);
        return;
      }
    }
    if (!confirmDiscard("Discard unsaved changes and start a draft from this job?")) return;
    applyProject(project);
    const head = document.querySelector("#view-agreements .view-head");
    if (head) head.scrollIntoView({ block: "start" });
  }

  function showSection(name) {
    const agreements = name === "agreements";
    $("view-projects").hidden = agreements;
    $("view-agreements").hidden = !agreements;
    document.querySelector(".app").dataset.section = agreements ? "agreements" : "projects";
    $("tab-projects").classList.toggle("is-active", !agreements);
    $("tab-agreements").classList.toggle("is-active", agreements);
    $("tab-projects").setAttribute("aria-selected", agreements ? "false" : "true");
    $("tab-agreements").setAttribute("aria-selected", agreements ? "true" : "false");
    $("brand-kicker").textContent = agreements ? "Fiber Agreements" : "Project Tracking";
    if (agreements) refreshJobPicker();
  }

  function loadLibrary() {
    try {
      const parsed = JSON.parse(localStorage.getItem(LIBRARY_KEY) || "[]");
      library = Array.isArray(parsed) ? parsed.filter((row) => row && row.id && row.state) : [];
    } catch {
      library = [];
    }
  }

  function persistLibrary(list) {
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(list));
    library = list;
  }

  function updateBanner() {
    const row = library.find((item) => item.id === activeId);
    const banner = $("fa-banner");
    if (!row) {
      banner.hidden = true;
      banner.textContent = "";
      return;
    }
    const when = row.updatedAt ? new Date(row.updatedAt).toLocaleString() : "";
    banner.hidden = false;
    banner.innerHTML = "Editing saved agreement <strong>" + escapeHtml(row.name || "Untitled") + "</strong>" +
      (when ? " · saved " + escapeHtml(when) : "");
  }

  function toast(message) {
    const node = $("fa-toast");
    node.textContent = message;
    node.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      node.hidden = true;
    }, 2800);
  }

  function renderLibrary(query) {
    const q = String(query || "").trim().toLowerCase();
    const rows = library
      .slice()
      .sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")))
      .filter((row) => {
        if (!q) return true;
        const blob = [
          row.name,
          row.state && row.state.email,
          row.state && row.state.street,
          row.state && row.state.city,
          row.state && row.state.customerName,
          row.summary && row.summary.speed,
        ].join(" ").toLowerCase();
        return blob.includes(q);
      });
    if (!rows.length) {
      $("fa-library-list").innerHTML = '<p class="fa-empty">No saved agreements yet.</p>';
      return;
    }
    $("fa-library-list").innerHTML = rows.map((row) => {
      const when = row.updatedAt ? new Date(row.updatedAt).toLocaleString() : "";
      const kind = row.docKind === "order" ? "Service order" : "Full agreement";
      const speed = row.summary && row.summary.speed ? row.summary.speed : "";
      const mrc = row.summary ? FiberPdf.money(row.summary.mrc) : "";
      return (
        '<article class="fa-library-row' + (row.id === activeId ? " is-active" : "") + '">' +
        "<div><strong>" + escapeHtml(row.name || "Untitled") + "</strong>" +
        '<div class="meta">' + escapeHtml([kind, speed, when].filter(Boolean).join(" · ")) + "</div></div>" +
        '<div class="fa-library-actions">' +
        '<span class="meta">' + escapeHtml(mrc) + "</span>" +
        '<button type="button" class="btn btn-ghost btn-sm" data-fa-open="' + escapeHtml(row.id) + '">Open</button>' +
        '<button type="button" class="btn btn-danger btn-sm" data-fa-del="' + escapeHtml(row.id) + '">Delete</button>' +
        "</div></article>"
      );
    }).join("");
  }

  function requireReady(state) {
    if (!state.customerName) {
      $("fa-customer").classList.add("is-attention");
      $("fa-customer").focus();
      alert("Enter the customer or business name.");
      return false;
    }
    if (!state.street) {
      $("fa-street").classList.add("is-attention");
      $("fa-street").focus();
      alert("Enter the service street.");
      return false;
    }
    if (!state.city) {
      $("fa-city").classList.add("is-attention");
      $("fa-city").focus();
      alert("Enter the service city.");
      return false;
    }
    if (!state.zip) {
      $("fa-zip").classList.add("is-attention");
      $("fa-zip").focus();
      alert("Enter the service ZIP.");
      return false;
    }
    if (state.fiberLevel == null || Number.isNaN(state.fiberLevel)) {
      const first = $("fa-level-grid").querySelector(".level-card");
      if (first) first.focus();
      alert("Choose a fiber level, or Custom.");
      return false;
    }
    if (state.fiberLevel === 0 && !state.customSpeed) {
      $("fa-custom-speed").classList.add("is-attention");
      $("fa-custom-speed").focus();
      alert("Enter the custom speed, or pick fiber level 1 through 5.");
      return false;
    }
    const described = (state.lineItems || []).filter((row) => String(row.description || "").trim());
    if (!described.length) {
      alert("Add at least one service order line with a description.");
      return false;
    }
    return true;
  }

  function loadLogo() {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const w = img.naturalWidth || img.width;
          const h = img.naturalHeight || img.height;
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0);
          resolve({ dataUrl: canvas.toDataURL("image/png"), width: w, height: h });
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = "assets/parallax-logo.jpg";
    });
  }

  function makePdf(model) {
    const ns = window.jspdf;
    if (!ns || !ns.jsPDF) {
      alert("PDF library failed to load. Refresh the page.");
      return null;
    }
    return FiberPdf.buildPdf(ns.jsPDF, logo, model);
  }

  function currentPdf() {
    const state = readForm();
    if (!linesManual && state.fiberLevel != null && !(state.lineItems || []).some((row) => String(row.description || "").trim())) {
      state.lineItems = defaultLineItems(state);
      writeLineItems(state.lineItems);
    }
    if (!requireReady(state)) return null;
    return { state, model: buildModel(state), doc: makePdf(buildModel(state)) };
  }

  function downloadPdf() {
    const packed = currentPdf();
    if (!packed || !packed.doc) return;
    packed.doc.save(FiberPdf.fileBase(packed.model) + ".pdf");
    // TODO(acrobat-sign): send packed.doc.output("blob") through sendForSignature.
  }

  /**
   * TODO(acrobat-sign): Ben will connect Adobe Acrobat Sign.
   * Intentionally a no-op. Later this should accept the PDF blob plus the
   * agreement model (customer email, Parallax countersigner, message).
   */
  function sendForSignature(_pdfBlob, _model) {
    return null;
  }

  function showPreview() {
    const packed = currentPdf();
    if (!packed || !packed.doc) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = URL.createObjectURL(packed.doc.output("blob"));
    $("fa-preview-frame").src = previewUrl;
    $("fa-preview-modal").hidden = false;
  }

  function closePreview() {
    $("fa-preview-modal").hidden = true;
    $("fa-preview-frame").removeAttribute("src");
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      previewUrl = "";
    }
  }

  function saveCurrent(asNew) {
    const state = readForm();
    if (!requireReady(state)) return;
    const model = buildModel(state);
    const now = new Date().toISOString();
    const existing = !asNew && activeId ? library.find((row) => row.id === activeId) : null;
    const id = existing ? existing.id : uid();
    const rec = {
      id,
      name: state.customerName,
      projectId: state.projectId || "",
      savedAt: existing ? existing.savedAt : now,
      updatedAt: now,
      docKind: state.docKind,
      summary: {
        speed: model.speed,
        mrc: model.mrc,
        nrc: model.nrc,
        term: model.termLabel,
        level: model.levelLabel,
      },
      state,
    };
    const next = library.filter((row) => row.id !== id);
    next.push(rec);
    try {
      persistLibrary(next);
      rememberSettings(state);
    } catch (err) {
      alert("Could not save the agreement in this browser.");
      return;
    }
    activeId = id;
    dirty = false;
    updateBanner();
    renderLibrary($("fa-library-search").value);
    toast("Saved " + state.customerName);
  }

  function openAgreement(id, force) {
    const row = library.find((item) => item.id === id);
    if (!row) return;
    if (!force && !confirmDiscard("Discard unsaved changes and open this agreement?")) return;
    activeId = id;
    refreshJobPicker();
    writeForm(row.state);
    dirty = false;
    $("fa-library-modal").hidden = true;
    updateBanner();
  }

  function deleteAgreement(id) {
    const row = library.find((item) => item.id === id);
    if (!row) return;
    if (!confirm('Delete "' + (row.name || "this agreement") + '"?')) return;
    try {
      persistLibrary(library.filter((item) => item.id !== id));
    } catch {
      alert("Could not delete that agreement.");
      return;
    }
    if (activeId === id) {
      activeId = null;
      updateBanner();
    }
    renderLibrary($("fa-library-search").value);
  }

  function resetForm() {
    if (!confirmDiscard("Start a new agreement? Unsaved changes will be cleared.")) return;
    activeId = null;
    writeForm(blankState());
    dirty = false;
  }

  function refreshFromJob() {
    const id = $("fa-job").value;
    const project = getProjects().find((item) => item.id === id);
    if (!project) {
      alert("That job is no longer in the project list.");
      return;
    }
    if (!confirm("Replace customer, charges, notes, and line items with the current job?")) return;
    const keepId = activeId;
    applyProject(project);
    activeId = keepId;
    dirty = true;
    updateBanner();
  }

  function addLine() {
    linesManual = true;
    dirty = true;
    const items = readLineItems();
    items.push({ id: uid(), kind: "nrc", description: "", qty: 1, unit: 0 });
    writeLineItems(items);
    renderSummary();
    const last = $("fa-lines-body").querySelector("tr:last-child [data-field=description]");
    if (last) last.focus();
  }

  function removeLine(id) {
    linesManual = true;
    dirty = true;
    writeLineItems(readLineItems().filter((row) => row.id !== id));
    renderSummary();
  }

  function resetLines() {
    const state = readForm();
    if (state.fiberLevel == null || Number.isNaN(state.fiberLevel)) {
      alert("Choose a fiber level first.");
      return;
    }
    linesManual = false;
    dirty = true;
    writeLineItems(defaultLineItems(state));
    renderSummary();
  }

  function updateAmount(tr) {
    if (!tr) return;
    const qty = Number(tr.querySelector("[data-field=qty]").value) || 0;
    const unit = Number(tr.querySelector("[data-field=unit]").value) || 0;
    tr.querySelector("[data-field=amount]").textContent = FiberPdf.money(Math.round(qty * unit * 100) / 100);
  }

  function bind() {
    $("tab-projects").addEventListener("click", () => showSection("projects"));
    $("tab-agreements").addEventListener("click", () => showSection("agreements"));

    $("fa-new").addEventListener("click", resetForm);
    $("fa-save").addEventListener("click", () => saveCurrent(false));
    $("fa-save-as").addEventListener("click", () => saveCurrent(true));
    $("fa-pdf").addEventListener("click", downloadPdf);
    $("fa-pdf-side").addEventListener("click", downloadPdf);
    $("fa-preview").addEventListener("click", showPreview);
    $("fa-preview-side").addEventListener("click", showPreview);
    $("fa-preview-close").addEventListener("click", closePreview);
    $("fa-library").addEventListener("click", () => {
      renderLibrary($("fa-library-search").value);
      $("fa-library-modal").hidden = false;
      $("fa-library-search").focus();
    });
    $("fa-library-close").addEventListener("click", () => {
      $("fa-library-modal").hidden = true;
    });
    $("fa-library-modal").addEventListener("click", (e) => {
      if (e.target === $("fa-library-modal")) $("fa-library-modal").hidden = true;
    });
    $("fa-preview-modal").addEventListener("click", (e) => {
      if (e.target === $("fa-preview-modal")) closePreview();
    });
    $("fa-library-search").addEventListener("input", () => renderLibrary($("fa-library-search").value));
    $("fa-library-list").addEventListener("click", (e) => {
      const openId = e.target.closest("[data-fa-open]")?.getAttribute("data-fa-open");
      if (openId) {
        openAgreement(openId, false);
        return;
      }
      const delId = e.target.closest("[data-fa-del]")?.getAttribute("data-fa-del");
      if (delId) deleteAgreement(delId);
    });
    $("fa-add-line").addEventListener("click", addLine);
    $("fa-reset-lines").addEventListener("click", resetLines);
    $("fa-refresh-job").addEventListener("click", refreshFromJob);
    $("fa-lines-body").addEventListener("click", (e) => {
      const id = e.target.closest("[data-remove-line]")?.getAttribute("data-remove-line");
      if (id) removeLine(id);
    });

    $("fa-job").addEventListener("change", () => {
      const id = $("fa-job").value;
      if (id === linkedProjectId) return;
      if (!id) {
        linkedProjectId = "";
        dirty = true;
        renderSummary();
        return;
      }
      const project = getProjects().find((item) => item.id === id);
      if (!project) return;
      if (!confirmDiscard("Replace this agreement with the selected job?")) {
        $("fa-job").value = linkedProjectId;
        return;
      }
      const keepId = activeId;
      applyProject(project);
      activeId = null;
      if (keepId) dirty = true;
    });

    $("view-agreements").addEventListener("input", (e) => {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      dirty = true;
      if (t.classList) t.classList.remove("is-attention");
      if (t.closest("#fa-lines-body")) {
        linesManual = true;
        updateAmount(t.closest("tr"));
        renderSummary();
        return;
      }
      if (t.matches("#fa-custom-speed, #fa-custom-mrc, #fa-nrc, #fa-nrc-desc")) syncAutoLines();
      renderSummary();
    });

    $("view-agreements").addEventListener("change", (e) => {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      dirty = true;
      if (t.id === "fa-notice-same") syncNotice();
      if (t.id === "fa-term-mtm") syncTerm();
      if (t.closest("#fa-lines-body")) {
        linesManual = true;
        updateAmount(t.closest("tr"));
      }
      if (t.name === "fa-doc-kind") renderSummary();
      else renderSummary();
    });

    document.addEventListener("parallax:create-agreement", (event) => {
      const project = event.detail && event.detail.project;
      if (!project) return;
      showSection("agreements");
      startFromProject(project);
    });

    document.addEventListener("parallax:projects-changed", () => {
      if (!$("view-agreements").hidden) refreshJobPicker();
    });

    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s" && !$("view-agreements").hidden) {
        e.preventDefault();
        saveCurrent(false);
      }
      if (e.key === "Escape") {
        if (!$("fa-preview-modal").hidden) closePreview();
        else if (!$("fa-library-modal").hidden) $("fa-library-modal").hidden = true;
      }
    });
  }

  function init() {
    if (!window.FiberPdf || !window.jspdf) {
      console.error("Fiber agreement scripts failed to load.");
      return;
    }
    loadLibrary();
    renderLevels();
    renderClauses();
    refreshJobPicker();
    writeForm(blankState());
    dirty = false;
    bind();
    loadLogo().then((img) => {
      logo = img;
    });
  }

  window.FiberAgreements = {
    sendForSignature,
  };

  init();
})();
