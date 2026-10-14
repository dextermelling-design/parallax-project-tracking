/**
 * Parallax fiber agreement PDF.
 * Agreement clauses are the Telecommunications Service Agreement text,
 * word for word. Do not "correct" source quirks marked below.
 *
 * The last page is a Service Order laid out like a quote: navy header with
 * the Parallax logo, a customer block, a line-item table (description, qty,
 * unit, amount), and separate NRC and MRC totals.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.FiberPdf = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const COMPANY = {
    name: "Parallax Systems",
    parent: "A department of Richmond Power & Light",
    agreementDept: "Department of Richmond Power & Light",
    website: "RP-L.com/Parallax",
    phone: "765-962-3770",
    address: "2000 US Highway 27 South, Richmond, IN 47374",
    noticeLines: [
      "Parallax Systems:",
      "Director of Accounts and Compliance",
      "2000 US Highway 27 South",
      "P.O. Box 908",
      "Richmond, IN 47374-0908",
    ],
  };

  const FIBER_LEVELS = [
    { level: 1, speed: "120 Mbps", mrc: 120 },
    { level: 2, speed: "200 Mbps", mrc: 200 },
    { level: 3, speed: "500 Mbps", mrc: 500 },
    { level: 4, speed: "750 Mbps", mrc: 1000 },
    { level: 5, speed: "1 Gig", mrc: 2500 },
  ];

  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  /** Source agreement is missing the opening quote before Service Period. */
  const SERVICE_PERIOD_AS_WRITTEN = "(Service Period\u201D)";

  const CLAUSES = [
    {
      n: "1",
      paras: [
        "Customer hereby requests and Parallax agrees, subject to the terms and conditions herein, to provide the facilities and service(s) as described in the Service Order Attachment (which is attached hereto and incorporated by reference). The term of this agreement " +
          SERVICE_PERIOD_AS_WRITTEN +
          " shall be as set forth on such Attachment, which may be a period of one or multiple years. In some instances, a no-contract rate may apply.",
        "Any amendment or supplementation to the Service Order Attachment shall be in writing signed by the parties, which references this Service Agreement.",
      ],
    },
    {
      n: "2",
      paras: [
        "In consideration for the facilities and services, Customer shall pay the monthly and non-recurring (one-time) charges as also set forth within the Attachment. Customer shall pay the recurring charges monthly, in advance of the month in which service is provided. All non-recurring charges for the service(s) included in the Service Order Attachment will be invoiced separately and paid by Customer before service is activated.",
        "When a service does not begin on the first day of the month, or end on the last day of the month, the charge for the portion of the month in which services were furnished will be calculated on a pro-rated basis with every month considered to have 30 days.",
        "If Customer fails to pay any amounts owed to Parallax when due, Parallax may discontinue or suspend service without incurring any liability to Customer. In addition, Parallax shall be entitled to all other remedies allowable by law.",
      ],
    },
    {
      n: "3",
      paras: [
        "If Customer cancels a service ordered pursuant to a Service Order Attachment prior to the completed installation of the service, but after the execution of the Service Order Attachment, Customer shall pay all reasonable costs incurred by Parallax in the implementation of the service included in the Service Order Attachment prior to receipt by Parallax of written notice of cancellation.",
      ],
    },
    {
      n: "4",
      paras: [
        "If customer cancels a service included in a Service Order Attachment at any time after the completion of the service installation, but prior to the expiration of the service-period set forth in the Service Order Attachment, Customer shall incur a termination liability equal to 50% of the balance of all recurring charges remaining due during the term of this Agreement. Non-recurring fees will be assessed 100% of charges as referenced in paragraph 2 above.",
      ],
    },
    {
      n: "5",
      paras: [
        "Parallax shall use reasonable efforts to complete the installation of the service(s) on or before the date specified in the Service Order Attachment, subject to the completion of the Customer's responsibilities set out in Sections 8(a), 8(b), 8(c), and 8(d) below, or in the Service Order Attachment.",
      ],
    },
    {
      n: "6",
      paras: [
        "The service period shall be as specified in the Service Order Attachment(s). The service period shall commence on the first day following the date that the installation of service is completed.",
      ],
    },
    {
      n: "7",
      paras: [
        "At the expiration of the service period for the service(s) outlined in the Service Order Attachment(s), the initial term shall be automatically extended for successive one (1) year periods unless either party gives written notice of termination 30 days prior to expiration of the initial term. After expiration of the initial term either party may terminate this Agreement upon thirty (30) days written notice without termination liability.",
      ],
    },
    {
      n: "8",
      paras: [
        "The Service(s) outlined in the Service Order Attachment shall include any drop wiring to the point where provision is made for termination of Parallax's facilities at a suitable location inside the Customer premises. The Customer shall provide to Parallax and maintain at Customer's cost:",
      ],
      items: [
        "a) all internal building conduits necessary for Parallax to install its wiring from the building service entrance to the point of termination;",
        "b) suitable space (i.e., a room, or a portion if acceptable to Parallax), for Parallax facilities and equipment specified in the Service Order Attachment;",
        "c) sufficient electric power to operate the Parallax facilities and equipment specified in the Service Order Attachment;",
        "d) access to (a) and (b) above for installation, maintenance, operation, and removal of the services(s); and",
        "e) proper operating environment for all Parallax facilities and equipment located on the Customer's premises.",
      ],
    },
    {
      n: "9",
      paras: [
        "Parallax shall retain ownership of all equipment, up to and including the demarcation point. Parallax shall use reasonable efforts to maintain the facilities and equipment that it furnishes to the Customer. Parallax shall respond within two hours to the Customer's location and restore any interruption of the service(s) included in the Service Order Attachment as soon as practicable after Parallax receives notice of the interruption from Customer. A service is interrupted when it becomes unusable by the Customer because of a failure of Parallax telecommunication facilities or equipment. An interruption begins when an inoperable service is reported to Parallax and ends when the service is operable. Access to Parallax equipment on Customer's property may be required to restore service and Customer shall receive no interruption credit on charges for service for any delay occasioned by such lack of access. Except as otherwise provided herein, Customer shall be entitled to a credit for any interruption in service, if such interruption is not due to the act or omission of the Customer or the failure of equipment of Customer or equipment of others, as follows:",
      ],
      tables: true,
    },
    {
      n: "10",
      paras: [
        "The Customer will not, nor will Customer permit others, to rearrange, disconnect, remove, and attempt to repair, or otherwise interfere with any of the facilities or equipment installed by Parallax except upon Parallax prior written consent. Parallax shall not be responsible for the installation, testing, operation, maintenance, repair and replacement of any Customer-provided equipment required for the Customer's interconnection with or use of the service(s) described in the Service Order Attachment. While Customer is responsible for ensuring that Customer provided equipment is compatible with Parallax equipment and facilities, Parallax will provide Customer with any required information and reasonable technical assistance to facilitate such compatibility. The responsibility of Parallax shall be limited to the furnishing, operation and maintenance of facilities and equipment furnished by Parallax for the service(s) outlined in the Service Order Attachment. It is understood that Parallax may provide assistance beyond Parallax-owned facilities as a matter of customer service, but that Parallax is not required to do so and assumes no responsibility for such other facilities or equipment.",
      ],
    },
    {
      n: "11",
      paras: [
        "Notices required to be given under this Agreement shall be given in writing, hand delivered or mailed, postage prepaid, or sent by facsimile transmission addressed to the appropriate party at the address set forth below. Either party may change the name and address at any time by giving written notice to the other party.",
      ],
      notices: true,
    },
    {
      n: "12",
      paras: [
        "Customer may not assign or otherwise transfer this Agreement without the prior written consent of Parallax. Subject to the foregoing, this Agreement shall be fully binding upon, inure to the benefit of, and be enforceable by the parties and their respective successors and assigns. Customer shall not resell, sublet or provide to others any of the services provided by Parallax under the Service Order Attachment in whole or in part.",
      ],
    },
    {
      n: "13",
      paras: [
        "Customer agrees that it will not use the services or facilities provided by Parallax for any unlawful or illegal purpose and agrees to indemnify and hold Parallax harmless from any loss or damage arising from such use.",
      ],
    },
    {
      n: "14",
      paras: [
        "EXCEPT AS EXPRESSLY PROVIDED IN THIS AGREEMENT, PARALLAX MAKES NO WARRANTIES, EXPRESSED OR IMPLIED, RELATING TO PARALLAX'S SERVICES AND FACILITIES AND EXPRESSLY DISCLAIMS ANY IMPLIED WARRANTIES OR WARRANTIES IMPOSED BY LAW, INCLUDING, BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.",
      ],
    },
    {
      n: "15",
      paras: [
        "EXCEPT AS OTHERWISE EXPRESSLY PROVIDED FOR IN THIS AGREEMENT, THE REMEDIES SET FORTH HEREIN SHALL BE CUSTOMER'S SOLE REMEDIES FOR ANY LOSS OR DAMAGE SUSTAINED AS A RESULT OF ANY INTERRUPTION OF THE SERVICES OR ANY FACILITIES USED IN PROVIDING THE SERVICES, HOWEVER LONG IT SHALL LAST AND REGARDLESS OF THE CAUSE, UNLESS SUCH LOSS OR DAMAGE IS DUE TO PARALLAX'S WILLFUL ACTS OR OMISSIONS.",
      ],
    },
    {
      n: "16",
      paras: [
        "IN NO EVENT SHALL EITHER PARTY BE LIABLE TO THE OTHER OR TO ANY THIRD PARTIES FOR ANY INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL OR EXEMPLARY DAMAGES RELATING TO OR ARISING FROM THE PROVISION OF THE SERVICES TO BE PROVIDED HEREUNDER, OR OTHERWISE RELATING TO THE PERFORMANCE BY EITHER PARTY OF ITS OBLIGATIONS HEREUNDER, INCLUDING, WITHOUT LIMITATION, DAMAGES BASED ON LOSS OF REVENUES, PROFITS OR BUSINESS OPPORTUNITIES, WHETHER OR NOT PARALLAX OR CUSTOMER HAS OR SHOULD HAVE HAD ANY KNOWLEDGE, ACTUAL OR CONSTRUCTIVE, THAT SUCH DAMAGES MIGHT BE INCURRED.",
      ],
    },
    {
      n: "17",
      paras: [
        "Customer agrees to pay all taxes, fees, or impositions which may be levied by any authority on the service and facilities which may be provided hereunder, including taxes, fees, or impositions which may be imposed after the date of this Agreement and any taxes which may be imposed on Parallax (such as gross receipts taxes), and further agrees that Parallax may include such or amounts equivalent to such in its billings to Customer for services.",
      ],
    },
    {
      n: "18",
      paras: [
        "Customer agrees to indemnify and hold Parallax harmless for any loss or expense, including attorney fees, arising from damage to Parallax equipment or injury to persons related to the services and facilities provided under this Agreement, except any loss, damage, or expense arising directly from the act or omission of Parallax.",
      ],
    },
    {
      n: "19",
      paras: [
        "If Customer shall breach any material provision of this Agreement and fail to cure said breach within 10 days after receipt of notice of default for such breach, then Parallax, at its option, may terminate this Agreement. Such termination shall be treated as if it were a cancellation by Customer for the purpose of determining any amounts due to Parallax from Customer as \u201Ctermination charges\u201D, as those are defined in Section 4 of this Agreement.",
      ],
    },
    {
      n: "20",
      paras: [
        "Upon customer's failure to pay when due any sum required herein, or upon any other customer default arising under this Agreement, Parallax shall be entitled to allocate all monies owed for the service period and shall be entitled to utilize all collection efforts to collect such sum. If suit is required for such collection and/or to enforce the terms of this Agreement, Parallax shall also be entitled to collect all costs of collection, including reasonable attorney fees.",
      ],
    },
    {
      n: "21",
      paras: [
        "This Agreement shall be interpreted, construed, and enforceable in all respects under the laws of the State of Indiana and may only be amended by an agreement signed by both parties.",
      ],
    },
  ];

  const INTERRUPT_SHORT = [
    ["Length of Interruption", "Interruption Period Credit"],
    ["Less than 2 hours", "None"],
    ["2 hours up to, but not including 3 hours", "1/10 day"],
    ["3 hours up to, but not including 6 hours", "1/4 day"],
    ["6 hours up to, but not including 12 hours", "1/2 day"],
    ["12 hours up to, but not including 24 hours", "One day"],
  ];

  const INTERRUPT_LONG = [
    ["Length of Interruption", "Interruption Period Credit"],
    ["Each 24 hour period", "One day"],
    ["A fraction of a 24-hour period", "See table above"],
  ];

  const PO_SENTENCE =
    "For Customer execution to indicate quote acceptance, Customer issued Purchase Order will be accepted in lieu of execution.";

  const WITNESS =
    "IN WITNESS WHEREOF, the parties hereto have caused this Agreement to be executed by their duly authorized representatives on the date first written above.";

  function ordinal(n) {
    const j = n % 10;
    const k = n % 100;
    if (j === 1 && k !== 11) return n + "st";
    if (j === 2 && k !== 12) return n + "nd";
    if (j === 3 && k !== 13) return n + "rd";
    return n + "th";
  }

  function parseISODate(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ""));
    if (!m) return null;
    const year = Number(m[1]);
    const month = Number(m[2]);
    const day = Number(m[3]);
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    return { year, month, day };
  }

  function agreementDateLabel(iso) {
    const d = parseISODate(iso);
    if (!d) return "____ day of ______________, ______";
    return ordinal(d.day) + " day of " + MONTHS[d.month - 1] + ", " + d.year;
  }

  function serviceDateLabel(iso) {
    const d = parseISODate(iso);
    if (!d) return "";
    return MONTHS[d.month - 1] + " " + ordinal(d.day) + ", " + d.year;
  }

  function joinAddress(street, city, state, zip) {
    const line1 = String(street || "").trim();
    const cityPart = [String(city || "").trim(), [String(state || "").trim(), String(zip || "").trim()].filter(Boolean).join(" ")]
      .filter(Boolean)
      .join(", ");
    return [line1, cityPart].filter(Boolean).join(", ");
  }

  function money(n) {
    const v = Number(n);
    const safe = Number.isFinite(v) ? v : 0;
    return safe.toLocaleString("en-US", { style: "currency", currency: "USD" });
  }

  function serviceTitle(speed) {
    const s = String(speed || "").trim();
    if (!s) return "Fiber Internet";
    if (/fiber/i.test(s)) return s;
    return s + " Fiber Internet";
  }

  function levelByNumber(level) {
    return FIBER_LEVELS.find((row) => row.level === Number(level)) || null;
  }

  function preamblePlain(model) {
    const name = model.customerName || "____________________";
    const addr = model.serviceAddress || "____________________";
    return (
      "This Telecommunications Service Agreement (\u201CAgreement\u201D) is made this " +
      model.agreementDateLabel +
      " by and between Parallax Systems (Parallax), " +
      COMPANY.address +
      " and " +
      name +
      " (Customer), " +
      addr +
      " (Customer Address)."
    );
  }

  function fileBase(model) {
    const kind = model.docKind === "order" ? "Service-Order" : "Fiber-Agreement";
    const cust = String(model.customerName || "Customer")
      .replace(/[^\w\- ]+/g, "")
      .trim()
      .replace(/\s+/g, "-") || "Customer";
    const num = model.agreementNumber
      ? "-" + String(model.agreementNumber).replace(/[^\w\-]+/g, "")
      : "";
    return "Parallax-" + kind + "-" + cust + num;
  }

  function buildPdf(jsPDF, logo, model) {
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 48;
    const contentW = pageW - margin * 2;
    const headerH = 78;
    const footerH = 36;
    const maxY = pageH - footerH - 16;
    const headerFill = [15, 30, 48];
    const navy = [15, 40, 70];
    const accent = [0, 102, 153];
    const muted = [90, 100, 110];
    const body = [30, 35, 40];
    const lineGray = [210, 218, 226];
    const headRow = [232, 240, 246];
    let y = 0;
    let pageKind = "agreement";
    let firstPage = true;

    function newPage(kind) {
      if (!firstPage) doc.addPage();
      firstPage = false;
      pageKind = kind || pageKind;
      drawHeader(pageKind);
      y = headerH + 22;
    }

    function drawHeader(kind) {
      doc.setFillColor(...headerFill);
      doc.rect(0, 0, pageW, headerH, "F");
      let brandX = margin;
      if (logo && logo.dataUrl) {
        const logoH = 52;
        const logoW = logo.width && logo.height ? (logo.width / logo.height) * logoH : 78;
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(margin - 4, 13, logoW + 10, logoH + 8, 4, 4, "F");
        try {
          doc.addImage(logo.dataUrl, "PNG", margin + 1, 17, logoW, logoH);
          brandX = margin + logoW + 18;
        } catch (e) {
          brandX = margin;
        }
      }
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.text(COMPANY.name, brandX, 32);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(180, 200, 220);
      doc.text(COMPANY.parent, brandX, 48);
      doc.text(COMPANY.website + "  |  " + COMPANY.phone, brandX, 62);

      const title = kind === "order" ? "SERVICE ORDER" : "SERVICE AGREEMENT";
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.text(title, pageW - margin, 34, { align: "right" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(180, 200, 220);
      let rightY = 50;
      if (model.agreementNumber) {
        doc.text("No. " + model.agreementNumber, pageW - margin, rightY, { align: "right" });
        rightY = 64;
      }
      if (model.serviceDateLabel) {
        doc.text(model.serviceDateLabel, pageW - margin, rightY, { align: "right" });
      }
    }

    function drawFooters() {
      const total = doc.getNumberOfPages();
      for (let i = 1; i <= total; i++) {
        doc.setPage(i);
        const top = pageH - footerH;
        doc.setFillColor(...headerFill);
        doc.rect(0, top, pageW, footerH, "F");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(180, 200, 220);
        doc.text(
          COMPANY.name + "  |  " + COMPANY.website + "  |  " + COMPANY.phone,
          margin,
          top + 22
        );
        doc.text("Page " + i + " of " + total, pageW - margin, top + 22, { align: "right" });
      }
    }

    function ensure(height) {
      if (y + height > maxY) newPage(pageKind);
    }

    function drawWrapped(text, opt) {
      const font = opt.font || "times";
      const style = opt.style || "normal";
      const size = opt.size || 10;
      const color = opt.color || body;
      const x = opt.x != null ? opt.x : margin;
      const width = opt.width || contentW;
      const leading = opt.leading || size + 3;
      const gap = opt.gap != null ? opt.gap : 0;
      doc.setFont(font, style);
      doc.setFontSize(size);
      const lines = doc.splitTextToSize(String(text || ""), width);
      for (let i = 0; i < lines.length; i++) {
        ensure(leading);
        doc.setFont(font, style);
        doc.setFontSize(size);
        doc.setTextColor(...color);
        doc.text(lines[i], x, y);
        y += leading;
      }
      y += gap;
    }

    function drawRich(runs, opt) {
      const font = opt.font || "times";
      const size = opt.size || 10.5;
      const color = opt.color || body;
      const width = opt.width || contentW;
      const leading = opt.leading || 14;
      const words = [];
      runs.forEach((run) => {
        String(run.t || "").split(/(\s+)/).forEach((part) => {
          if (part) words.push({ t: part, b: !!run.b });
        });
      });
      const lines = [];
      let line = [];
      let widthUsed = 0;
      const measure = (word) => {
        doc.setFont(font, word.b ? "bold" : "normal");
        doc.setFontSize(size);
        return doc.getTextWidth(word.t);
      };
      words.forEach((word) => {
        const ww = measure(word);
        if (line.length && widthUsed + ww > width && word.t.trim()) {
          lines.push(line);
          line = [];
          widthUsed = 0;
        }
        if (!word.t.trim() && !line.length) return;
        line.push(word);
        widthUsed += ww;
      });
      if (line.length) lines.push(line);
      lines.forEach((ln) => {
        ensure(leading);
        let x = margin;
        ln.forEach((word) => {
          doc.setFont(font, word.b ? "bold" : "normal");
          doc.setFontSize(size);
          doc.setTextColor(...color);
          doc.text(word.t, x, y);
          x += doc.getTextWidth(word.t);
        });
        y += leading;
      });
      y += opt.gap != null ? opt.gap : 8;
    }

    function drawClause(clause) {
      const hang = 20;
      const size = clause.n === "14" || clause.n === "15" || clause.n === "16" ? 9 : 10;
      const leading = size + 3;
      clause.paras.forEach((para, idx) => {
        doc.setFont("times", "normal");
        doc.setFontSize(size);
        const lines = doc.splitTextToSize(para, contentW - hang);
        if (y + Math.min(lines.length, 3) * leading > maxY) newPage("agreement");
        lines.forEach((line, lineIdx) => {
          ensure(leading);
          if (idx === 0 && lineIdx === 0) {
            doc.setFont("times", "bold");
            doc.setFontSize(size);
            doc.setTextColor(...body);
            doc.text(clause.n + ".", margin, y);
          }
          doc.setFont("times", "normal");
          doc.setFontSize(size);
          doc.setTextColor(...body);
          doc.text(line, margin + hang, y);
          y += leading;
        });
        y += 6;
      });
      (clause.items || []).forEach((item) => {
        doc.setFont("times", "normal");
        doc.setFontSize(10);
        const lines = doc.splitTextToSize(item, contentW - 42);
        lines.forEach((line) => {
          ensure(13);
          doc.setFont("times", "normal");
          doc.setFontSize(10);
          doc.setTextColor(...body);
          doc.text(line, margin + 36, y);
          y += 13;
        });
        y += 2;
      });
      if (clause.items) y += 4;
      if (clause.tables) drawInterruptTables();
      if (clause.notices) drawNoticeBlock();
    }

    function drawInterruptTables() {
      drawCaptionTable("Interruptions of 24 hours or less", INTERRUPT_SHORT);
      y += 12;
      drawCaptionTable("Interruptions over 24 hours", INTERRUPT_LONG);
      y += 16;
      drawWrapped("No more than 30 days credit will be allowed for any one-month period", {
        font: "times",
        size: 10,
        gap: 8,
      });
    }

    function drawCaptionTable(title, rows) {
      ensure(36);
      doc.setFont("times", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...body);
      doc.text(title, pageW / 2, y, { align: "center" });
      y += 16;
      const colW = [contentW * 0.62, contentW * 0.38];
      rows.forEach((row, idx) => {
        doc.setFont("times", idx === 0 ? "bold" : "normal");
        doc.setFontSize(9);
        const h1 = doc.splitTextToSize(row[0], colW[0] - 12);
        const h2 = doc.splitTextToSize(row[1], colW[1] - 12);
        const rowH = Math.max(h1.length, h2.length) * 12 + 8;
        ensure(rowH);
        if (idx === 0) {
          doc.setFillColor(...headRow);
          doc.rect(margin, y, contentW, rowH, "F");
        }
        doc.setDrawColor(...lineGray);
        doc.setLineWidth(0.6);
        doc.rect(margin, y, colW[0], rowH, "S");
        doc.rect(margin + colW[0], y, colW[1], rowH, "S");
        doc.setTextColor(...body);
        doc.text(h1, margin + 6, y + 14);
        doc.text(h2, margin + colW[0] + 6, y + 14);
        y += rowH;
      });
    }

    function drawNoticeBlock() {
      const colGap = 24;
      const colW = (contentW - colGap) / 2;
      const left = COMPANY.noticeLines;
      const right = ["Customer:"].concat(model.noticeLines || []);
      const rows = Math.max(left.length, right.length);
      ensure(rows * 13 + 8);
      y += 2;
      for (let i = 0; i < rows; i++) {
        const style = i === 0 ? "bold" : "normal";
        doc.setFont("times", style);
        doc.setFontSize(10);
        doc.setTextColor(...body);
        if (left[i]) doc.text(left[i], margin + 20, y);
        if (right[i]) doc.text(right[i], margin + colW + colGap, y);
        y += 13;
      }
      y += 8;
    }

    let lineFont = "times";

    function labeledLine(x, width, label, value, tag) {
      ensure(20);
      doc.setFont(lineFont, "normal");
      doc.setFontSize(10);
      doc.setTextColor(...body);
      doc.text(label, x, y);
      const lw = doc.getTextWidth(label);
      const start = x + lw + 4;
      const end = x + width;
      if (value) {
        doc.setFont(lineFont, "bold");
        const lines = doc.splitTextToSize(String(value), Math.max(40, end - start));
        doc.text(lines[0], start, y);
        y += 16;
        for (let i = 1; i < lines.length; i++) {
          ensure(14);
          doc.setFont(lineFont, "bold");
          doc.setFontSize(10);
          doc.text(lines[i], x, y);
          y += 14;
        }
        return;
      }
      doc.setDrawColor(120, 130, 140);
      doc.setLineWidth(0.7);
      doc.line(start, y + 2, end, y + 2);
      if (tag) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text(tag, start + 1, y);
      }
      y += 18;
    }

    function drawExecution() {
      lineFont = "times";
      ensure(150);
      y += 6;
      drawWrapped(WITNESS, { font: "times", size: 10.5, leading: 14, gap: 16 });
      const gap = 28;
      const colW = (contentW - gap) / 2;
      const leftX = margin;
      const rightX = margin + colW + gap;
      const top = y;
      doc.setFont("times", "bold");
      doc.setFontSize(12);
      doc.setTextColor(...navy);
      const custName = model.customerName || "Customer";
      doc.text(doc.splitTextToSize(custName, colW), leftX, y);
      doc.text("Parallax Systems", rightX, y);
      y += 22;

      const leftStart = y;
      labeledLine(leftX, colW, "By:", "", signTag("CustSig1", 1, "signature"));
      labeledLine(leftX, colW, "Title:", model.contactTitle, model.contactTitle ? "" : signTag("CustTitle1", 1, "title"));
      labeledLine(leftX, colW, "Federal Tax ID # or SS#:", model.taxId, model.taxId ? "" : signTag("CustTax1", 1, "text"));
      labeledLine(leftX, colW, "Contact person:", model.contactName, model.contactName ? "" : signTag("CustContact1", 1, "text"));
      labeledLine(leftX, colW, "E-mail address:", model.email, model.email ? "" : signTag("CustEmail1", 1, "email"));
      labeledLine(leftX, colW, "Date:", "", signTag("CustDate1", 1, "date"));
      const leftEnd = y;

      y = leftStart;
      const parallaxByTag = model.signerCount >= 2 ? signTag("PxSig1", 2, "signature") : "";
      const parallaxDateTag = model.signerCount >= 2 ? signTag("PxDate1", 2, "date") : "";
      const parallaxTitleTag =
        model.parallaxSignerTitle || model.signerCount < 2 ? "" : signTag("PxTitle1", 2, "title");
      labeledLine(rightX, colW, "By:", "", parallaxByTag);
      labeledLine(rightX, colW, "Title:", model.parallaxSignerTitle, parallaxTitleTag);
      labeledLine(rightX, colW, "Date:", "", parallaxDateTag);
      y = Math.max(leftEnd, y, top + 20);
    }

    /**
     * Acrobat Sign text-tag hook.
     * TODO(acrobat-sign): Ben will add Adobe Acrobat Sign later. Return the
     * tag below so signature, date, title, and email lines become Sign fields.
     * Tags are omitted for now; the lines stay blank for a wet signature.
     *
     *   if (signer > (model.signerCount || 1)) return "";
     *   if (type === "text") return "{{" + name + "_es_:signer" + signer + "}}";
     *   return "{{" + name + "_es_:signer" + signer + ":" + type + "}}";
     */
    function signTag(name, signer, type) {
      void name;
      void signer;
      void type;
      return "";
    }

    function orderLineItems() {
      const src = Array.isArray(model.lineItems) ? model.lineItems : [];
      const rows = src.map((row) => {
        const qty = Number(row.qty);
        const unit = Number(row.unit);
        const q = Number.isFinite(qty) ? qty : 0;
        const u = Number.isFinite(unit) ? unit : 0;
        const amount = Number.isFinite(Number(row.amount)) ? Number(row.amount) : q * u;
        return {
          description: String(row.description || "").trim() || "—",
          qty: q,
          unit: u,
          amount: Math.round(amount * 100) / 100,
          kind: row.kind === "mrc" ? "mrc" : "nrc",
        };
      }).filter((row) => row.description !== "—" || row.amount || row.unit);
      if (rows.length) return rows;
      const speedLine = (model.levelLabel ? model.levelLabel + " — " : "") + (model.serviceDescription || "Fiber Internet");
      const nrcNote = String(model.nrcDescription || "").trim();
      return [
        {
          description: speedLine,
          qty: 1,
          unit: Number(model.mrc) || 0,
          amount: Number(model.mrc) || 0,
          kind: "mrc",
        },
        {
          description: nrcNote ? "Installation — " + nrcNote : "Installation",
          qty: 1,
          unit: Number(model.nrc) || 0,
          amount: Number(model.nrc) || 0,
          kind: "nrc",
        },
      ];
    }

    function formatQty(qty) {
      const n = Number(qty);
      if (!Number.isFinite(n)) return "0";
      const rounded = Math.round(n * 100) / 100;
      return String(rounded);
    }

    function drawServiceOrder() {
      const rows = orderLineItems();
      const colW = [contentW * 0.5, contentW * 0.12, contentW * 0.19, contentW * 0.19];

      newPage("order");
      ensure(26);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(...navy);
      doc.text("Service Order", margin, y);
      y += 8;
      doc.setDrawColor(...accent);
      doc.setLineWidth(2);
      doc.line(margin, y, margin + 122, y);
      y += 16;

      drawPreparedFor();
      y += 16;
      drawOrderLineTable(rows, colW);
      y += 10;
      drawOrderTotals(rows);

      y += 8;
      doc.setDrawColor(...lineGray);
      doc.setLineWidth(0.8);
      doc.line(margin, y, pageW - margin, y);
      y += 16;
      sectionHead("TERM");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(...body);
      doc.text(model.termLabel || "—", margin, y);
      y += 16;
      if (model.installDateLabel) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(...muted);
        doc.text("Requested installation date: " + model.installDateLabel, margin, y);
        y += 16;
      }

      if (String(model.notes || "").trim()) {
        y += 4;
        doc.setDrawColor(...lineGray);
        doc.line(margin, y, pageW - margin, y);
        y += 16;
        sectionHead("NOTES");
        drawWrapped(String(model.notes).trim(), {
          font: "helvetica",
          size: 10,
          leading: 13,
          gap: 6,
          color: body,
        });
      }

      y += 6;
      drawWrapped(PO_SENTENCE, {
        font: "helvetica",
        size: 9,
        leading: 12,
        gap: 12,
        color: muted,
      });

      drawOrderSignatures();
    }

    function drawPreparedFor() {
      const innerW = contentW - 20;
      const chunks = [];
      function push(text, style, size, color, lead) {
        doc.setFont("helvetica", style);
        doc.setFontSize(size);
        doc.splitTextToSize(String(text || ""), innerW).forEach((line) => {
          chunks.push({ line, style, size, color, lead });
        });
      }
      push("PREPARED FOR", "bold", 8, accent, 12);
      push(model.customerName || "Customer", "bold", 13, navy, 17);
      if (model.serviceAddress) push(model.serviceAddress, "normal", 10, body, 13);
      const bits = [model.contactName, model.contactTitle, model.phone, model.email].filter(Boolean);
      if (bits.length) push(bits.join("   ·   "), "normal", 9, muted, 12);
      if (model.preparedBy) push("Prepared by " + model.preparedBy, "normal", 9, muted, 12);
      if (model.quoteSheet) push("Quote sheet: " + model.quoteSheet, "normal", 8, accent, 11);

      const height = 14 + chunks.reduce((sum, chunk) => sum + chunk.lead, 0);
      ensure(height + 4);
      doc.setFillColor(...headRow);
      doc.roundedRect(margin, y, contentW, height, 4, 4, "F");
      let ty = y + 16;
      chunks.forEach((chunk) => {
        doc.setFont("helvetica", chunk.style);
        doc.setFontSize(chunk.size);
        doc.setTextColor(...chunk.color);
        doc.text(chunk.line, margin + 10, ty);
        ty += chunk.lead;
      });
      y += height;
    }

    function drawOrderLineTable(rows, colW) {
      function drawItemsHeader() {
        const headerH = 20;
        ensure(headerH + 16);
        doc.setFillColor(...headerFill);
        doc.rect(margin, y, contentW, headerH, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        const labels = ["Description", "Qty", "Unit", "Amount"];
        let x = margin;
        labels.forEach((label, i) => {
          if (i === 0) doc.text(label, x + 6, y + 13);
          else doc.text(label, x + colW[i] - 6, y + 13, { align: "right" });
          x += colW[i];
        });
        y += headerH;
      }

      ensure(64);
      sectionHead("LINE ITEMS");
      drawItemsHeader();
      rows.forEach((row, idx) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        const descLines = doc.splitTextToSize(row.description, colW[0] - 12);
        const kind = row.kind === "mrc" ? "Monthly recurring" : "Non-recurring";
        const rowH = 8 + descLines.length * 11 + 13;
        if (y + rowH > maxY) {
          newPage("order");
          drawItemsHeader();
        }
        if (idx % 2 === 1) {
          doc.setFillColor(245, 248, 252);
          doc.rect(margin, y, contentW, rowH, "F");
        }
        doc.setDrawColor(...lineGray);
        doc.setLineWidth(0.4);
        doc.line(margin, y + rowH, margin + contentW, y + rowH);
        doc.setTextColor(...body);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(descLines, margin + 6, y + 13);
        doc.setFontSize(7.5);
        doc.setTextColor(...accent);
        doc.text(kind, margin + 6, y + 13 + descLines.length * 11);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...body);
        const baseY = y + 14;
        doc.text(formatQty(row.qty), margin + colW[0] + colW[1] - 6, baseY, { align: "right" });
        doc.text(money(row.unit), margin + colW[0] + colW[1] + colW[2] - 6, baseY, { align: "right" });
        doc.setFont("helvetica", "bold");
        doc.text(money(row.amount), margin + contentW - 6, baseY, { align: "right" });
        y += rowH;
      });
    }

    function drawOrderTotals(rows) {
      const mrcTotal = rows.filter((row) => row.kind === "mrc").reduce((sum, row) => sum + row.amount, 0);
      const nrcTotal = rows.filter((row) => row.kind !== "mrc").reduce((sum, row) => sum + row.amount, 0);
      const boxW = 268;
      const boxX = pageW - margin - boxW;
      ensure(72);
      y += 8;
      function totalRow(label, value) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(...muted);
        doc.text(label, boxX, y);
        doc.setTextColor(...body);
        doc.setFont("helvetica", "bold");
        doc.text(money(value), pageW - margin, y, { align: "right" });
        y += 16;
      }
      totalRow("Non-recurring total (NRC)", nrcTotal);
      totalRow("Monthly recurring total (MRC)", mrcTotal);
      y += 2;
      doc.setFillColor(...headerFill);
      doc.roundedRect(boxX, y - 12, boxW, 22, 3, 3, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text("MONTHLY", boxX + 10, y + 3);
      doc.text(money(mrcTotal), pageW - margin - 8, y + 3, { align: "right" });
      y += 20;
    }

    function sectionHead(text) {
      ensure(18);
      doc.setTextColor(...accent);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(text, margin, y);
      y += 16;
    }

    function drawOrderSignatures() {
      lineFont = "helvetica";
      const boxH = model.docKind === "order" ? 168 : 132;
      ensure(boxH + 8);
      const gap = 16;
      const colW = (contentW - gap) / 2;
      const top = y;
      strokeSignBox(margin, top, colW, boxH, "CUSTOMER");
      strokeSignBox(margin + colW + gap, top, colW, boxH, "PARALLAX SYSTEMS");
      const saved = y;
      y = top + 36;
      const leftX = margin + 10;
      const rightX = margin + colW + gap + 10;
      const innerW = colW - 20;
      labeledLine(leftX, innerW, "By:", "", signTag("CustSig2", 1, "signature"));
      labeledLine(leftX, innerW, "Title:", model.contactTitle, model.contactTitle ? "" : signTag("CustTitle2", 1, "title"));
      labeledLine(leftX, innerW, "Date:", "", signTag("CustDate2", 1, "date"));
      if (model.docKind === "order") {
        labeledLine(leftX, innerW, "E-mail address:", model.email, model.email ? "" : signTag("CustEmail2", 1, "email"));
        labeledLine(leftX, innerW, "Federal Tax ID # or SS#:", model.taxId, model.taxId ? "" : signTag("CustTax2", 1, "text"));
      }
      const leftEnd = y;
      y = top + 36;
      labeledLine(rightX, innerW, "By:", "", model.signerCount >= 2 ? signTag("PxSig2", 2, "signature") : "");
      labeledLine(rightX, innerW, "Title:", model.parallaxSignerTitle, model.parallaxSignerTitle || model.signerCount < 2 ? "" : signTag("PxTitle2", 2, "title"));
      labeledLine(rightX, innerW, "Date:", "", model.signerCount >= 2 ? signTag("PxDate2", 2, "date") : "");
      y = Math.max(saved, leftEnd, top + boxH) + 8;
    }

    function strokeSignBox(x, top, w, h, title) {
      doc.setDrawColor(...lineGray);
      doc.setLineWidth(0.8);
      doc.roundedRect(x, top, w, h, 4, 4, "S");
      doc.setFillColor(...headRow);
      doc.rect(x, top, w, 22, "F");
      doc.setDrawColor(...lineGray);
      doc.line(x, top + 22, x + w, top + 22);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...accent);
      doc.text(title, x + 10, top + 15);
    }

    if (model.docKind !== "order") {
      newPage("agreement");
      doc.setFont("times", "bold");
      doc.setFontSize(13);
      doc.setTextColor(...navy);
      ["PARALLAX SYSTEMS", "TELECOMMUNICATIONS", "SERVICE AGREEMENT"].forEach((line) => {
        doc.text(line, pageW / 2, y, { align: "center" });
        y += 16;
      });
      doc.setFont("times", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...muted);
      doc.text(COMPANY.agreementDept, pageW / 2, y, { align: "center" });
      y += 22;

      const name = model.customerName || "____________________";
      const addr = model.serviceAddress || "____________________";
      drawRich(
        [
          { t: "This Telecommunications Service Agreement (\u201CAgreement\u201D) is made this " },
          { t: model.agreementDateLabel, b: true },
          { t: " by and between Parallax Systems (Parallax), " + COMPANY.address + " and " },
          { t: name + " (Customer), " + addr + " (Customer Address).", b: true },
        ],
        { gap: 12 }
      );
      drawWrapped("In consideration of the terms set forth herein, Parallax and Customer hereby agree as follows:", {
        font: "times",
        size: 10.5,
        leading: 14,
        gap: 10,
      });
      CLAUSES.forEach(drawClause);
      drawExecution();
    }

    drawServiceOrder();
    drawFooters();

    const docTitle = (model.docKind === "order" ? "Fiber Service Order — " : "Telecommunications Service Agreement — ") +
      (model.customerName || "Customer");
    doc.setProperties({
      title: docTitle,
      author: COMPANY.name,
      subject: docTitle,
      creator: "Parallax Fiber Agreements",
    });
    return doc;
  }

  return {
    COMPANY,
    FIBER_LEVELS,
    CLAUSES,
    PO_SENTENCE,
    SERVICE_PERIOD_AS_WRITTEN,
    ordinal,
    agreementDateLabel,
    serviceDateLabel,
    joinAddress,
    money,
    serviceTitle,
    levelByNumber,
    preamblePlain,
    fileBase,
    buildPdf,
  };
});
