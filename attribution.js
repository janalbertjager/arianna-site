(function () {
  var STORAGE_KEY = "arianna_attribution_v1";
  var PARAM_KEYS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "gclid",
    "msclkid",
    "fbclid"
  ];

  function safeParse(value) {
    if (!value) return {};
    try {
      return JSON.parse(value) || {};
    } catch (error) {
      return {};
    }
  }

  function safeLoad() {
    try {
      return safeParse(window.localStorage.getItem(STORAGE_KEY));
    } catch (error) {
      return {};
    }
  }

  function safeSave(data) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      // Ignore storage failures; tracking still works in-memory.
    }
  }

  function getUrlAttribution() {
    var params = new URLSearchParams(window.location.search);
    var data = {};
    PARAM_KEYS.forEach(function (key) {
      var value = params.get(key);
      if (value) data[key] = value;
    });
    return data;
  }

  function mergeAttribution(existing, incoming) {
    var nowIso = new Date().toISOString();
    var merged = Object.assign({}, existing);

    if (!merged.first_seen_at) merged.first_seen_at = nowIso;
    if (!merged.first_landing_page) merged.first_landing_page = window.location.href;
    if (!merged.first_referrer) merged.first_referrer = document.referrer || "";

    merged.last_seen_at = nowIso;
    merged.last_landing_page = window.location.href;
    merged.last_referrer = document.referrer || "";

    PARAM_KEYS.forEach(function (key) {
      if (incoming[key]) {
        if (!merged["first_" + key]) merged["first_" + key] = incoming[key];
        merged[key] = incoming[key];
      }
    });

    return merged;
  }

  function upsertHiddenInput(form, name, value) {
    if (!value) return;
    var selector = 'input[type="hidden"][name="' + name + '"]';
    var input = form.querySelector(selector);
    if (!input) {
      input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      form.appendChild(input);
    }
    input.value = value;
  }

  function applyAttributionToForm(form, data) {
    if (!form || !data) return;

    PARAM_KEYS.forEach(function (key) {
      upsertHiddenInput(form, key, data[key] || "");
      upsertHiddenInput(form, "first_" + key, data["first_" + key] || "");
    });

    upsertHiddenInput(form, "first_landing_page", data.first_landing_page || "");
    upsertHiddenInput(form, "last_landing_page", data.last_landing_page || "");
    upsertHiddenInput(form, "first_referrer", data.first_referrer || "");
    upsertHiddenInput(form, "last_referrer", data.last_referrer || "");
    upsertHiddenInput(form, "first_seen_at", data.first_seen_at || "");
    upsertHiddenInput(form, "last_seen_at", data.last_seen_at || "");
    var intent = formIntent(form);
    if (intent) upsertHiddenInput(form, "lead_intent", intent);
  }

  function formIntent(form) {
    var container = form.closest('[id^="nutshell-form-"]');
    var containerId = container ? container.id : "";

    if (containerId.indexOf("book-trial") !== -1) return "trial";
    if (containerId.indexOf("book-demo") !== -1 || containerId.indexOf("home") !== -1) return "demo";
    if (containerId.indexOf("contact") !== -1) return "contact";
    if (containerId.indexOf("support") !== -1) return "support";
    if (containerId.indexOf("partner") !== -1) return "partner";
    if (form.classList.contains("newsletter-form")) return "newsletter";
    return "";
  }

  function eventNameForForm(form) {
    var intent = formIntent(form);
    if (intent === "trial") return "trial_form_submit";
    if (intent === "demo") return "demo_form_submit";
    if (intent === "contact") return "contact_form_submit";
    if (intent === "support") return "support_form_submit";
    if (intent === "partner") return "partner_form_submit";
    if (intent === "newsletter") return "newsletter_form_submit";
    return "form_submit";
  }

  function pushTrackingEvent(form) {
    var intent = formIntent(form) || "unknown";
    var dataLayer = window.dataLayer = window.dataLayer || [];
    dataLayer.push({
      event: eventNameForForm(form),
      page_path: window.location.pathname,
      lead_intent: intent
    });
  }

  function bindForm(form, dataRef) {
    if (!form || form.dataset.ariannaTrackingBound === "true") return;
    form.dataset.ariannaTrackingBound = "true";

    applyAttributionToForm(form, dataRef());

    form.addEventListener("submit", function () {
      var data = dataRef();
      applyAttributionToForm(form, data);
      pushTrackingEvent(form);
    }, true);
  }

  function bindFormsInNode(node, dataRef) {
    if (!node) return;
    if (node.tagName === "FORM") bindForm(node, dataRef);
    var forms = node.querySelectorAll ? node.querySelectorAll("form") : [];
    forms.forEach(function (form) { bindForm(form, dataRef); });
  }

  var stored = safeLoad();
  var merged = mergeAttribution(stored, getUrlAttribution());
  safeSave(merged);

  function currentAttribution() {
    return safeLoad();
  }

  bindFormsInNode(document, currentAttribution);

  document.querySelectorAll('[id^="nutshell-form-"]').forEach(function (container) {
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          bindFormsInNode(node, currentAttribution);
        });
      });
    });

    observer.observe(container, { childList: true, subtree: true });
  });
})();
