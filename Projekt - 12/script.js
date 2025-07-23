document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 100) {
      navbar.style.background =
        "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)";
      navbar.style.boxShadow = "0 4px 30px rgba(102, 126, 234, 0.4)";
    } else {
      navbar.style.background =
        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
      navbar.style.boxShadow = "0 4px 25px rgba(102, 126, 234, 0.3)";
    }
  });

  const budgetForm = document.getElementById("budgetForm");
  const budgetResults = document.getElementById("budgetResults");

  if (budgetForm) {
    budgetForm.addEventListener("submit", function (e) {
      e.preventDefault();
      calculateBudget();
    });
  }

  function calculateBudget() {
    const monthlyIncome =
      parseFloat(document.getElementById("monthlyIncome").value) || 0;
    const housing = parseFloat(document.getElementById("housing").value) || 0;
    const utilities =
      parseFloat(document.getElementById("utilities").value) || 0;
    const food = parseFloat(document.getElementById("food").value) || 0;
    const transportation =
      parseFloat(document.getElementById("transportation").value) || 0;
    const entertainment =
      parseFloat(document.getElementById("entertainment").value) || 0;

    const needsAmount = monthlyIncome * 0.5;
    const wantsAmount = monthlyIncome * 0.3;
    const savingsAmount = monthlyIncome * 0.2;

    const actualNeeds = housing + utilities + food + transportation;
    const actualWants = entertainment;
    const actualSavings = monthlyIncome - actualNeeds - actualWants;

    document.getElementById("needsAmount").textContent =
      formatCurrency(needsAmount);
    document.getElementById("wantsAmount").textContent =
      formatCurrency(wantsAmount);
    document.getElementById("savingsAmount").textContent =
      formatCurrency(savingsAmount);

    budgetResults.style.display = "block";

    createBudgetChart(needsAmount, wantsAmount, savingsAmount);

    budgetResults.scrollIntoView({ behavior: "smooth" });

    addBudgetAnalysis(monthlyIncome, actualNeeds, actualWants, actualSavings);
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  function createBudgetChart(needs, wants, savings) {
    const chartContainer = document.getElementById("budgetChart");
    if (!chartContainer) return;

    chartContainer.innerHTML = "";

    const total = needs + wants + savings;
    const needsPercent = (needs / total) * 100;
    const wantsPercent = (wants / total) * 100;
    const savingsPercent = (savings / total) * 100;

    const chart = document.createElement("div");
    chart.style.cssText = `
            width: 200px;
            height: 200px;
            border-radius: 50%;
            background: conic-gradient(
                #ef4444 0deg ${needsPercent * 3.6}deg,
                #3b82f6 ${needsPercent * 3.6}deg ${
      (needsPercent + wantsPercent) * 3.6
    }deg,
                #22c55e ${(needsPercent + wantsPercent) * 3.6}deg 360deg
            );
            margin: 0 auto;
            position: relative;
        `;

    const center = document.createElement("div");
    center.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 120px;
            height: 120px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            color: #1f2937;
            font-size: 0.875rem;
            text-align: center;
        `;
    center.textContent = "Budget Breakdown";

    chart.appendChild(center);
    chartContainer.appendChild(chart);
  }

  function addBudgetAnalysis(income, actualNeeds, actualWants, actualSavings) {
    const resultsContainer = document.getElementById("budgetResults");

    const existingAnalysis = resultsContainer.querySelector(".budget-analysis");
    if (existingAnalysis) {
      existingAnalysis.remove();
    }

    const analysis = document.createElement("div");
    analysis.className = "budget-analysis";
    analysis.style.cssText = `
            margin-top: 2rem;
            padding: 1.5rem;
            background: #f8fafc;
            border-radius: 8px;
            border-left: 4px solid #2563eb;
        `;

    const needsDiff = actualNeeds - income * 0.5;
    const wantsDiff = actualWants - income * 0.3;
    const savingsDiff = actualSavings - income * 0.2;

    let analysisHTML =
      '<h4 style="margin-bottom: 1rem; color: #1f2937;">Budget Analysis</h4>';

    if (needsDiff > 0) {
      analysisHTML += `<p style="color: #dc2626; margin-bottom: 0.5rem;">⚠️ Your needs spending is ${formatCurrency(
        Math.abs(needsDiff)
      )} over the recommended 50%.</p>`;
    } else {
      analysisHTML += `<p style="color: #059669; margin-bottom: 0.5rem;">✅ Your needs spending is within the recommended 50%.</p>`;
    }

    if (wantsDiff > 0) {
      analysisHTML += `<p style="color: #dc2626; margin-bottom: 0.5rem;">⚠️ Your wants spending is ${formatCurrency(
        Math.abs(wantsDiff)
      )} over the recommended 30%.</p>`;
    } else {
      analysisHTML += `<p style="color: #059669; margin-bottom: 0.5rem;">✅ Your wants spending is within the recommended 30%.</p>`;
    }

    if (savingsDiff < 0) {
      analysisHTML += `<p style="color: #dc2626; margin-bottom: 0.5rem;">⚠️ Your savings is ${formatCurrency(
        Math.abs(savingsDiff)
      )} below the recommended 20%.</p>`;
    } else {
      analysisHTML += `<p style="color: #059669; margin-bottom: 0.5rem;">✅ Your savings is meeting or exceeding the recommended 20%.</p>`;
    }

    analysisHTML +=
      '<h5 style="margin: 1rem 0 0.5rem; color: #1f2937;">Recommendations:</h5>';

    if (needsDiff > 0) {
      analysisHTML +=
        '<p style="color: #6b7280; margin-bottom: 0.5rem;">• Look for ways to reduce housing, utilities, or transportation costs</p>';
    }

    if (wantsDiff > 0) {
      analysisHTML +=
        '<p style="color: #6b7280; margin-bottom: 0.5rem;">• Consider reducing entertainment and discretionary spending</p>';
    }

    if (savingsDiff < 0) {
      analysisHTML +=
        '<p style="color: #6b7280; margin-bottom: 0.5rem;">• Prioritize building your emergency fund and retirement savings</p>';
    }

    analysis.innerHTML = analysisHTML;
    resultsContainer.appendChild(analysis);
  }

  const newsletterForm = document.querySelector(".newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]').value;
      if (email) {
        alert(
          "Thank you for subscribing! You'll receive weekly budgeting tips and financial insights."
        );
        this.reset();
      }
    });
  }

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(
      ".toc-item, .method-card, .tool-card, .resource-card, .guide-chapter"
    )
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(el);
    });

  const chartSegments = document.querySelectorAll(".chart-segment");
  chartSegments.forEach((segment) => {
    segment.addEventListener("mouseenter", function () {
      this.style.transform = "translate(-50%, -50%) scale(1.05)";
      this.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.15)";
    });

    segment.addEventListener("mouseleave", function () {
      this.style.transform = "translate(-50%, -50%) scale(1)";
      this.style.boxShadow = "none";
    });
  });

  const guideChapters = document.querySelectorAll(".guide-chapter");
  guideChapters.forEach((chapter, index) => {
    const progressIndicator = document.createElement("div");
    progressIndicator.style.cssText = `
            position: absolute;
            left: -20px;
            top: 0;
            width: 4px;
            height: 100%;
            background: #e5e7eb;
            border-radius: 2px;
        `;

    const progressDot = document.createElement("div");
    progressDot.style.cssText = `
            position: absolute;
            left: -6px;
            top: 0;
            width: 16px;
            height: 16px;
            background: #2563eb;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
        `;

    chapter.style.position = "relative";
    chapter.appendChild(progressIndicator);
    chapter.appendChild(progressDot);
  });

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search guide content...";
  searchInput.style.cssText = `
        width: 100%;
        max-width: 400px;
        padding: 12px 16px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        font-size: 1rem;
        margin-bottom: 2rem;
        display: block;
        margin-left: auto;
        margin-right: auto;
    `;

  const guideContent = document.querySelector(".guide-content");
  if (guideContent) {
    guideContent.insertBefore(searchInput, guideContent.firstChild);

    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase();
      const chapters = document.querySelectorAll(".guide-chapter");

      chapters.forEach((chapter) => {
        const text = chapter.textContent.toLowerCase();
        if (text.includes(searchTerm) || searchTerm === "") {
          chapter.style.display = "block";
          chapter.style.opacity = "1";
        } else {
          chapter.style.display = "none";
          chapter.style.opacity = "0";
        }
      });
    });
  }

  const printButton = document.createElement("button");
  printButton.textContent = "Print Guide";
  printButton.className = "btn btn-secondary";
  printButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    `;

  printButton.addEventListener("click", function () {
    window.print();
  });

  document.body.appendChild(printButton);

  const backToTopButton = document.createElement("button");
  backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
  backToTopButton.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #2563eb;
        color: white;
        border: none;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 4px 20px rgba(37, 99, 235, 0.3);
        transition: all 0.3s ease;
        opacity: 0;
        visibility: hidden;
    `;

  backToTopButton.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  document.body.appendChild(backToTopButton);

  window.addEventListener("scroll", function () {
    if (window.scrollY > 500) {
      backToTopButton.style.opacity = "1";
      backToTopButton.style.visibility = "visible";
    } else {
      backToTopButton.style.opacity = "0";
      backToTopButton.style.visibility = "hidden";
    }
  });

  backToTopButton.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-3px)";
    this.style.boxShadow = "0 6px 25px rgba(37, 99, 235, 0.4)";
  });

  backToTopButton.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0)";
    this.style.boxShadow = "0 4px 20px rgba(37, 99, 235, 0.3)";
  });

  window.addEventListener("load", function () {
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.5s ease";

    setTimeout(() => {
      document.body.style.opacity = "1";
    }, 100);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    }
  });

  const formInputs = document.querySelectorAll(".form-group input");
  formInputs.forEach((input) => {
    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.style.cssText = `
            position: absolute;
            background: #1f2937;
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.875rem;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            pointer-events: none;
            white-space: nowrap;
        `;

    const formGroup = input.parentElement;
    formGroup.style.position = "relative";

    input.addEventListener("focus", function () {
      const label = this.previousElementSibling.textContent;
      tooltip.textContent = `Enter your monthly ${label.toLowerCase()}`;
      tooltip.style.opacity = "1";
      tooltip.style.visibility = "visible";
    });

    input.addEventListener("blur", function () {
      tooltip.style.opacity = "0";
      tooltip.style.visibility = "hidden";
    });

    formGroup.appendChild(tooltip);
  });
});

const printStyles = document.createElement("style");
printStyles.textContent = `
    @media print {
        .navbar, .hero, .toc-section, .tools-section, .resources-section, .footer,
        .hamburger, .btn, .hero-cta, .hero-stats, .hero-visual {
            display: none !important;
        }
        
        .guide-content {
            box-shadow: none !important;
            padding: 0 !important;
        }
        
        .guide-chapter {
            page-break-inside: avoid;
            margin-bottom: 2rem !important;
        }
        
        body {
            font-size: 12pt !important;
            line-height: 1.4 !important;
        }
        
        h1, h2, h3, h4 {
            page-break-after: avoid;
        }
    }
`;
document.head.appendChild(printStyles);
