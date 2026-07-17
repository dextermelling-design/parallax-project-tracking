(() => {
  const STORAGE_KEY = "parallax-project-tracking-v3";
  const HIDE_COMPLETE_KEY = "parallax-hide-complete";
  const AUTH_SESSION_KEY = "parallax-delete-auth";
  const SEED_FLAG_KEY = "parallax-seed-v3-loaded";
  // SHA-256 of default password "parallax" — change by generating a new hash
  const DELETE_PASSWORD_HASH =
    "25d3e422e9a0730c40e6cdf60a841702bcb76c76acf948dc5671a3b8742441fa";

  const FIELDS = [
    "openDate",
    "completedDate",
    "project",
    "address",
    "update",
    "scheduled",
    "status",
    "user",
    "wo",
    "nrc",
    "mrc",
    "contact",
    "notes",
  ];

  const HEADERS = {
    openDate: "Open Date",
    completedDate: "Completed Date",
    project: "Project",
    address: "Address",
    update: "Update",
    scheduled: "Scheduled",
    status: "Status",
    user: "Assigned",
    wo: "WO",
    nrc: "NRC",
    mrc: "MRC",
    contact: "Contact",
    notes: "Notes",
  };

  /** @type {Array<Record<string, string>>} */
  let projects = load();
  let sortKey = "project";
  let sortDir = 1;
  let editingId = null;
  /** @type {string | null} */
  let expandedId = null;
  /** @type {string | null} */
  let pendingDeleteId = null;
  let hideCompleted = localStorage.getItem(HIDE_COMPLETE_KEY) === "1";

  const els = {
    body: document.getElementById("projects-body"),
    empty: document.getElementById("empty-state"),
    stats: document.getElementById("stats"),
    search: document.getElementById("search"),
    filterStatus: document.getElementById("filter-status"),
    filterUser: document.getElementById("filter-user"),
    modal: document.getElementById("modal"),
    form: document.getElementById("project-form"),
    modalTitle: document.getElementById("modal-title"),
    btnNew: document.getElementById("btn-new"),
    btnClose: document.getElementById("btn-close"),
    btnCancel: document.getElementById("btn-cancel"),
    btnExport: document.getElementById("btn-export"),
    btnHideComplete: document.getElementById("btn-hide-complete"),
    passwordModal: document.getElementById("password-modal"),
    passwordForm: document.getElementById("password-form"),
    passwordInput: document.getElementById("delete-password"),
    passwordError: document.getElementById("password-error"),
    passwordRemember: document.getElementById("password-remember"),
    passwordClose: document.getElementById("password-close"),
    passwordCancel: document.getElementById("password-cancel"),
  };

  function getSeedProjects() {
    const seed = window.PARALLAX_SEED_PROJECTS;
    if (!Array.isArray(seed) || seed.length === 0) return [];
    // Clone so we never mutate the seed constants
    return seed.map((p) => ({ ...p, id: p.id || uid() }));
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {
      /* fall through to seed */
    }
    const seed = getSeedProjects();
    if (seed.length) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
        localStorage.setItem(SEED_FLAG_KEY, "1");
      } catch {
        /* ignore quota errors */
      }
      return seed;
    }
    return [];
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }

  function uid() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function formatDate(value) {
    if (!value) return "—";
    // Keep ISO yyyy-mm-dd readable without timezone shift
    const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!m) return value;
    return `${m[2]}/${m[3]}/${m[1]}`;
  }

  const STATUSES = [
    "Not Yet Started",
    "In Progress",
    "Scheduled",
    "On Hold",
    "Waiting on other",
    "Port Submitted",
    "Parts Ordered",
    "Needs Quoted",
    "Ready for Billing",
    "Billing Complete",
    "Complete",
    "Disregard",
  ];

  const USERS = [
    "Dexter",
    "Ben",
    "Jason",
    "Cooper",
    "Everyone",
    "Mike",
    "Ben/Dexter",
    "Mike & Cooper",
    "Dexter/Cooper",
    "Kyler",
    "Dexter/Kyler",
    "Ben/Dexter/Kyler",
  ];

  function statusClass(status) {
    return String(status || "not-yet-started")
      .toLowerCase()
      .replace(/\s+/g, "-");
  }

  function isCompletedStatus(status) {
    return status === "Complete" || status === "Billing Complete";
  }

  function statusSelectHtml(projectId, current) {
    const value = current || "Not Yet Started";
    const options = STATUSES.map(
      (s) =>
        `<option value="${escapeAttr(s)}"${s === value ? " selected" : ""}>${escapeHtml(s)}</option>`
    ).join("");
    return `<select class="status-select badge-select ${statusClass(value)}" data-status-change="${escapeAttr(projectId)}" aria-label="Change status">${options}</select>`;
  }

  function updateJobStatus(id, newStatus) {
    if (!STATUSES.includes(newStatus)) return;
    const idx = projects.findIndex((p) => p.id === id);
    if (idx < 0) return;
    const job = { ...projects[idx], status: newStatus };
    if (newStatus === "Complete" && !job.completedDate) {
      job.completedDate = today();
    }
    projects[idx] = job;
    save();
    render();
  }

  function syncHideCompleteButton() {
    if (!els.btnHideComplete) return;
    els.btnHideComplete.setAttribute("aria-pressed", hideCompleted ? "true" : "false");
    els.btnHideComplete.classList.toggle("is-active", hideCompleted);
    els.btnHideComplete.textContent = hideCompleted ? "Show completed" : "Hide completed";
  }

  function getFiltered() {
    const q = els.search.value.trim().toLowerCase();
    const status = els.filterStatus.value;
    const user = els.filterUser ? els.filterUser.value : "";

    let list = projects.slice();

    if (hideCompleted) {
      list = list.filter((p) => !isCompletedStatus(p.status));
    }

    if (status) {
      list = list.filter((p) => p.status === status);
    }

    if (user) {
      list = list.filter((p) => p.user === user);
    }

    if (q) {
      list = list.filter((p) =>
        FIELDS.some((key) => String(p[key] || "").toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      const av = (a[sortKey] || "").toString().toLowerCase();
      const bv = (b[sortKey] || "").toString().toLowerCase();
      if (av < bv) return -1 * sortDir;
      if (av > bv) return 1 * sortDir;
      return 0;
    });

    return list;
  }

  function renderStats(list) {
    const all = projects;
    const active = all.filter(
      (p) => p.status !== "Complete" && p.status !== "Disregard" && p.status !== "Billing Complete"
    ).length;
    const complete = all.filter((p) => p.status === "Complete").length;
    const inProgress = all.filter((p) => p.status === "In Progress").length;
    const onHold = all.filter((p) => p.status === "On Hold").length;
    const counts = {
      Total: all.length,
      Active: active,
      "In Progress": inProgress,
      "On Hold": onHold,
      Complete: complete,
      Showing: list.length,
    };

    els.stats.innerHTML = Object.entries(counts)
      .map(
        ([label, value]) => `
        <div class="stat">
          <div class="label">${label}</div>
          <div class="value">${value}</div>
        </div>`
      )
      .join("");
  }

  function render() {
    const list = getFiltered();
    renderStats(list);

    els.body.innerHTML = "";
    els.empty.hidden = list.length > 0 || projects.length === 0 ? list.length > 0 : false;
    if (projects.length === 0) {
      els.empty.hidden = false;
      els.empty.innerHTML = 'No projects yet. Click <strong>New project</strong> to add one.';
    } else if (list.length === 0) {
      els.empty.hidden = false;
      els.empty.innerHTML = "No projects match your search or filter.";
    } else {
      els.empty.hidden = true;
    }

    const frag = document.createDocumentFragment();
    const colCount = 4;

    for (const p of list) {
      const isOpen = expandedId === p.id;
      const tr = document.createElement("tr");
      tr.className = `job-row${isOpen ? " is-expanded" : ""}`;
      tr.dataset.id = p.id;
      tr.setAttribute("tabindex", "0");
      tr.setAttribute("role", "button");
      tr.setAttribute("aria-expanded", isOpen ? "true" : "false");
      tr.title = "Click to expand details";
      tr.innerHTML = `
        <td>
          <span class="job-name">
            <span class="chevron" aria-hidden="true">${isOpen ? "▼" : "▶"}</span>
            <strong>${escapeHtml(p.project || "—")}</strong>
          </span>
        </td>
        <td class="assignee-col">
          ${
            p.user
              ? `<span class="assignee-badge">${escapeHtml(p.user)}</span>`
              : `<span class="assignee-empty">Unassigned</span>`
          }
        </td>
        <td class="status-col">
          <span class="badge ${statusClass(p.status)}">${escapeHtml(p.status || "Not Yet Started")}</span>
        </td>
        <td class="date-col">${formatDate(p.openDate)}</td>
      `;
      frag.appendChild(tr);

      if (isOpen) {
        const detail = document.createElement("tr");
        detail.className = "detail-row";
        detail.innerHTML = `
          <td colspan="${colCount}">
            <div class="detail-panel">
              <div class="detail-header">
                <h3>${escapeHtml(p.project || "Untitled project")}</h3>
                ${statusSelectHtml(p.id, p.status)}
              </div>
              <div class="detail-grid">
                ${FIELDS.map((key) => {
                  if (key === "status") {
                    return `
                  <div class="detail-item">
                    <span class="detail-label">${HEADERS[key]}</span>
                    <div class="detail-value">${statusSelectHtml(p.id, p.status)}</div>
                  </div>`;
                  }
                  return `
                  <div class="detail-item${key === "notes" || key === "update" || key === "address" ? " span-2" : ""}">
                    <span class="detail-label">${HEADERS[key]}</span>
                    <span class="detail-value${key === "notes" ? " detail-notes" : ""}">${
                      key.includes("Date") || key === "scheduled"
                        ? formatDate(p[key])
                        : escapeHtml(p[key] || "—")
                    }</span>
                  </div>`;
                }).join("")}
              </div>
              <div class="detail-actions">
                <button type="button" class="btn btn-ghost btn-sm" data-collapse="${p.id}">Collapse</button>
                <button type="button" class="btn btn-primary btn-sm" data-edit="${p.id}">Edit project</button>
                <button type="button" class="btn btn-danger btn-sm" data-delete="${p.id}">Delete</button>
              </div>
            </div>
          </td>
        `;
        frag.appendChild(detail);
      }
    }

    els.body.appendChild(frag);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/'/g, "&#39;");
  }

  function openModal(project) {
    editingId = project ? project.id : null;
    els.modalTitle.textContent = project ? "Edit project" : "New project";
    els.form.reset();

    document.getElementById("field-id").value = project?.id || "";
    for (const key of FIELDS) {
      const el = document.getElementById(`field-${key}`);
      if (!el) continue;
      el.value = project?.[key] || (key === "status" ? "Not Yet Started" : "");
    }
    if (!project) {
      document.getElementById("field-openDate").value = today();
      document.getElementById("field-status").value = "Not Yet Started";
    }

    els.modal.hidden = false;
    document.getElementById("field-project").focus();
  }

  function closeModal() {
    els.modal.hidden = true;
    editingId = null;
    els.form.reset();
  }

  function readForm() {
    /** @type {Record<string, string>} */
    const data = { id: document.getElementById("field-id").value || uid() };
    for (const key of FIELDS) {
      const el = document.getElementById(`field-${key}`);
      data[key] = el ? el.value.trim() : "";
    }
    if (!data.status || !STATUSES.includes(data.status)) {
      data.status = "Not Yet Started";
    }
    if (data.user && !USERS.includes(data.user)) {
      data.user = "";
    }
    return data;
  }

  async function sha256Hex(text) {
    const data = new TextEncoder().encode(text);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  function isDeleteAuthorized() {
    return sessionStorage.getItem(AUTH_SESSION_KEY) === "1";
  }

  function setDeleteAuthorized(remember) {
    if (remember) sessionStorage.setItem(AUTH_SESSION_KEY, "1");
  }

  function openPasswordModal(deleteId) {
    pendingDeleteId = deleteId;
    els.passwordError.hidden = true;
    els.passwordForm.reset();
    els.passwordRemember.checked = true;
    els.passwordModal.hidden = false;
    els.passwordInput.focus();
  }

  function closePasswordModal() {
    pendingDeleteId = null;
    els.passwordModal.hidden = true;
    els.passwordForm.reset();
    els.passwordError.hidden = true;
  }

  function deleteProject(id) {
    const project = projects.find((p) => p.id === id);
    const label = project?.project || "this project";
    if (!confirm(`Delete "${label}"? This cannot be undone.`)) return;
    projects = projects.filter((p) => p.id !== id);
    save();
    render();
  }

  async function requestDelete(id) {
    if (isDeleteAuthorized()) {
      deleteProject(id);
      return;
    }
    openPasswordModal(id);
  }

  function exportCsv() {
    const list = getFiltered();
    const cols = FIELDS;
    const lines = [
      cols.map((c) => csvEscape(HEADERS[c])).join(","),
      ...list.map((p) => cols.map((c) => csvEscape(p[c] || "")).join(",")),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `parallax-projects-${today()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function csvEscape(value) {
    const s = String(value);
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  }

  // Events
  els.btnNew.addEventListener("click", () => openModal(null));
  els.btnClose.addEventListener("click", closeModal);
  els.btnCancel.addEventListener("click", closeModal);
  els.btnExport.addEventListener("click", exportCsv);
  els.search.addEventListener("input", render);
  els.filterStatus.addEventListener("change", render);
  if (els.filterUser) els.filterUser.addEventListener("change", render);

  if (els.btnHideComplete) {
    els.btnHideComplete.addEventListener("click", () => {
      hideCompleted = !hideCompleted;
      localStorage.setItem(HIDE_COMPLETE_KEY, hideCompleted ? "1" : "0");
      syncHideCompleteButton();
      render();
    });
    syncHideCompleteButton();
  }

  // Inline status change from expanded detail (stop row toggle)
  els.body.addEventListener("change", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLSelectElement)) return;
    const id = t.getAttribute("data-status-change");
    if (!id) return;
    e.stopPropagation();
    updateJobStatus(id, t.value);
  });

  els.body.addEventListener("click", (e) => {
    const t = e.target;
    if (t instanceof HTMLElement && t.closest("select[data-status-change]")) {
      e.stopPropagation();
    }
  }, true);

  els.modal.addEventListener("click", (e) => {
    if (e.target === els.modal) closeModal();
  });

  els.passwordModal.addEventListener("click", (e) => {
    if (e.target === els.passwordModal) closePasswordModal();
  });
  els.passwordClose.addEventListener("click", closePasswordModal);
  els.passwordCancel.addEventListener("click", closePasswordModal);

  els.passwordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const entered = els.passwordInput.value;
    const hash = await sha256Hex(entered);
    if (hash !== DELETE_PASSWORD_HASH) {
      els.passwordError.hidden = false;
      els.passwordInput.select();
      return;
    }
    const id = pendingDeleteId;
    const remember = els.passwordRemember.checked;
    closePasswordModal();
    if (remember) setDeleteAuthorized(true);
    if (id) deleteProject(id);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!els.passwordModal.hidden) closePasswordModal();
      else if (!els.modal.hidden) closeModal();
    }
  });

  els.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = readForm();
    if (!data.project) return;

    const idx = projects.findIndex((p) => p.id === data.id);
    if (idx >= 0) projects[idx] = data;
    else projects.unshift(data);

    // Auto-set completed date when status becomes Complete
    if (data.status === "Complete" && !data.completedDate) {
      data.completedDate = today();
      const i = projects.findIndex((p) => p.id === data.id);
      if (i >= 0) projects[i] = data;
    }

    save();
    closeModal();
    render();
  });

  els.body.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;

    const editId = t.getAttribute("data-edit") || t.closest("[data-edit]")?.getAttribute("data-edit");
    if (editId && (t.matches("[data-edit]") || t.closest("[data-edit]"))) {
      e.stopPropagation();
      const project = projects.find((p) => p.id === editId);
      if (project) openModal(project);
      return;
    }

    const deleteId = t.getAttribute("data-delete") || t.closest("[data-delete]")?.getAttribute("data-delete");
    if (deleteId && (t.matches("[data-delete]") || t.closest("[data-delete]"))) {
      e.stopPropagation();
      requestDelete(deleteId);
      return;
    }

    const collapseId = t.getAttribute("data-collapse");
    if (collapseId) {
      expandedId = null;
      render();
      return;
    }

    // Click row (or inside detail panel empty area) to toggle expand
    const row = t.closest("tr.job-row");
    if (row && row.dataset.id) {
      const id = row.dataset.id;
      expandedId = expandedId === id ? null : id;
      render();
      // Keep expanded row in view
      if (expandedId) {
        requestAnimationFrame(() => {
          const open = els.body.querySelector(`tr.job-row[data-id="${expandedId}"]`);
          open?.scrollIntoView({ block: "nearest", behavior: "smooth" });
        });
      }
    }
  });

  els.body.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const row = e.target instanceof HTMLElement ? e.target.closest("tr.job-row") : null;
    if (!row?.dataset.id) return;
    e.preventDefault();
    const id = row.dataset.id;
    expandedId = expandedId === id ? null : id;
    render();
  });

  document.querySelectorAll(".data-table th[data-sort]").forEach((th) => {
    th.addEventListener("click", () => {
      const key = th.getAttribute("data-sort");
      if (!key) return;
      if (sortKey === key) sortDir *= -1;
      else {
        sortKey = key;
        sortDir = 1;
      }
      render();
    });
  });

  // If storage empty but seed available, load seed (also covers first visit)
  if (projects.length === 0) {
    projects = getSeedProjects();
    if (projects.length) save();
  }

  render();
})();
