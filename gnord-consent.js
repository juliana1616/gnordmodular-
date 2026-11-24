(function () {
  "use strict";
  var STORAGE_KEY = "gnord_analytics_consent_v1";
  var GA_ID = "G-YR3MFNH755";
  var consent = null;
  var loaded = false;

  // Before a visitor opts in, analytics functions do not collect or queue events.
  window.gtag = function () {};
  try {
    consent = window.localStorage.getItem(STORAGE_KEY);
  } catch (ignore) {}

  function loadAnalytics() {
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
    window.gtag("consent", "update", { analytics_storage: "granted" });
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);
    var tag = document.createElement("script");
    tag.async = true;
    tag.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
    document.head.appendChild(tag);
  }

  if (consent === "allowed") loadAnalytics();

  function saveChoice(value) {
    var hadAnalytics = loaded;
    consent = value;
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch (ignore) {}
    var current = document.getElementById("gnord-cookie-prompt");
    if (current) current.remove();
    if (value === "allowed") {
      loadAnalytics();
    } else if (hadAnalytics) {
      // Reload to stop all analytics scripts following a withdrawn consent.
      window.location.reload();
    }
  }

  function showChoices() {
    if (document.getElementById("gnord-cookie-prompt")) return;
    var prompt = document.createElement("section");
    prompt.id = "gnord-cookie-prompt";
    prompt.className = "gnord-cookie-prompt";
    prompt.setAttribute("aria-label", "Website analytics choices");
    prompt.innerHTML = '<p><strong>Website analytics</strong></p>' +
      '<p>We use optional Google Analytics cookies to understand website visits. ' +
      'You can accept or decline; the website works either way. ' +
      '<a href="privacy.html">Privacy &amp; cookies</a>.</p>' +
      '<div class="gnord-cookie-actions">' +
      '<button type="button" class="gnord-cookie-decline">Decline</button>' +
      '<button type="button" class="gnord-cookie-accept">Allow analytics</button></div>';
    document.body.appendChild(prompt);
    prompt.querySelector(".gnord-cookie-decline").addEventListener("click", function () { saveChoice("declined"); });
    prompt.querySelector(".gnord-cookie-accept").addEventListener("click", function () { saveChoice("allowed"); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (consent !== "allowed" && consent !== "declined") showChoices();
    document.querySelectorAll("[data-gnord-cookie-settings]").forEach(function (control) {
      control.addEventListener("click", function () { showChoices(); });
    });
  });
}());
