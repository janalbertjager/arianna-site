(function () {
  var quickReplies = [
    { key: "demo", answer: "You can book a demo here: book-a-demo.html" },
    { key: "trial", answer: "For a trial request, use: free-trial.html" },
    { key: "partner", answer: "Partner details are here: partners.html" },
    { key: "compliance", answer: "Compliance information: compliance.html" },
    { key: "industr", answer: "Industry coverage: industries.html" },
    { key: "resource", answer: "Resources page: resources.html" },
    { key: "newsletter", answer: "You can find newsletter content in resources.html under Newsletters." },
    { key: "blog", answer: "Blog post space is available in resources.html under Blog Posts." },
    { key: "article", answer: "Article space is available in resources.html under Articles." },
    { key: "career", answer: "Careers section: company.html#careers" },
    { key: "about", answer: "About ARIANNA: company.html#about" },
    { key: "contact", answer: "Contact form: contact.html\nDirect email: hello@ariannateam.ai" }
  ];

  function botReply(input) {
    var text = (input || "").toLowerCase();
    if (!text.trim()) return "Please type a question, for example: demo, compliance, partners, resources, or contact.";

    for (var i = 0; i < quickReplies.length; i++) {
      if (text.indexOf(quickReplies[i].key) !== -1) return quickReplies[i].answer;
    }

    return "I can help with demos, compliance, industries, partners, resources, careers, and contact. Try one of those keywords.";
  }

  function createWidget() {
    var launcher = document.createElement("button");
    launcher.type = "button";
    launcher.className = "chatbot-launcher";
    launcher.textContent = "Chat with ARIANNA";

    var panel = document.createElement("section");
    panel.className = "chatbot-panel";
    panel.setAttribute("aria-label", "Chatbot panel");

    panel.innerHTML = [
      '<div class="chatbot-header">',
      '  <div>',
      '    <h3 class="chatbot-header-title">ARIANNA Assistant</h3>',
      '    <p class="chatbot-header-subtitle">Ask about platform pages and links</p>',
      "  </div>",
      '  <button type="button" class="chatbot-close" aria-label="Close chat">×</button>',
      "</div>",
      '<div class="chatbot-messages" id="chatbotMessages"></div>',
      '<form class="chatbot-input-wrap" id="chatbotForm">',
      '  <input class="chatbot-input" id="chatbotInput" type="text" placeholder="Type your question..." />',
      '  <button class="chatbot-send" type="submit">Send</button>',
      "</form>"
    ].join("");

    document.body.appendChild(launcher);
    document.body.appendChild(panel);

    var closeBtn = panel.querySelector(".chatbot-close");
    var messages = panel.querySelector("#chatbotMessages");
    var form = panel.querySelector("#chatbotForm");
    var input = panel.querySelector("#chatbotInput");

    function addMessage(kind, text) {
      var msg = document.createElement("div");
      msg.className = "chatbot-msg " + (kind === "user" ? "chatbot-msg-user" : "chatbot-msg-bot");
      msg.textContent = text;
      messages.appendChild(msg);
      messages.scrollTop = messages.scrollHeight;
    }

    function openPanel() {
      panel.classList.add("is-open");
      if (!messages.dataset.started) {
        addMessage("bot", "Hello. I can help you navigate ARIANNA pages. Ask me about demos, compliance, partners, resources, careers, or contact.");
        messages.dataset.started = "true";
      }
      input.focus();
    }

    function closePanel() {
      panel.classList.remove("is-open");
    }

    launcher.addEventListener("click", function () {
      if (panel.classList.contains("is-open")) closePanel();
      else openPanel();
    });

    closeBtn.addEventListener("click", closePanel);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var userText = input.value.trim();
      if (!userText) return;
      addMessage("user", userText);
      addMessage("bot", botReply(userText));
      input.value = "";
      input.focus();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createWidget);
  } else {
    createWidget();
  }
})();
