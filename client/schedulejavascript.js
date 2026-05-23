/* ════════════════════════════════════════
   SkillSwap — Schedule Page Logic
   schedule.js
════════════════════════════════════════ */

/* ─── Data ─── */
var credits = 7;
var activeDay = 4; // Friday (0=Mon … 6=Sun)
var selectedSlot = null;
var currentBookingSkill = null;

var calendarDays  = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
var calendarDates = [19, 20, 21, 22, 23, 24, 25];

var timeSlots = ["7:00 AM", "9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM", "7:00 PM"];

/* Preset sessions mapped by dayIndex → slotIndex */
var presetSessions = {
  1: { // Tuesday
    5: { name: "Spanish Conversation", teacher: "Sofia Reyes", cat: "Language",
         color: "#E8F5E9", textColor: "#2E7D32" }
  },
  4: { // Friday
    2: { name: "Yoga & Breathing", teacher: "Maya Chen", cat: "Wellness",
         color: "#F3E5F5", textColor: "#6A1B9A" }
  }
};

/* Days that have a dot indicator */
var dotDays = [1, 4];

/* Confirmed bookings list */
var confirmedBookings = [
  { name: "Python for Beginners", teacher: "Dev Kapoor", date: "Mon May 19 · 8:00 PM", credits: 2, cat: "Tech",  dotColor: "#42A5F5" },
  { name: "Acoustic Guitar",      teacher: "Arjun Mehta", date: "Wed May 21 · 5:00 PM", credits: 2, cat: "Music", dotColor: "#FF9800" }
];

/* Available skills to book (shown in add-session modal) */
var availableSkills = [
  { id: 1,  name: "Acoustic Guitar",        teacher: "Arjun Mehta",  credits: 2, cat: "Music",   available: ["Mon 6pm", "Wed 5pm", "Sat 10am"] },
  { id: 2,  name: "Spanish Conversation",   teacher: "Sofia Reyes",  credits: 1, cat: "Language", available: ["Tue 7pm", "Thu 6pm", "Sun 11am"] },
  { id: 3,  name: "Python for Beginners",   teacher: "Dev Kapoor",   credits: 2, cat: "Tech",     available: ["Mon 8pm", "Fri 5pm", "Sat 2pm"]  },
  { id: 4,  name: "Indian Cooking",         teacher: "Priya Nair",   credits: 1, cat: "Cooking",  available: ["Sat 12pm", "Sun 3pm"]            },
  { id: 5,  name: "Yoga & Breathing",       teacher: "Maya Chen",    credits: 1, cat: "Wellness", available: ["Mon 7am", "Wed 7am", "Fri 7am"]  },
  { id: 6,  name: "Photo Editing (Lr)",     teacher: "Rahul Das",    credits: 2, cat: "Design",   available: ["Thu 7pm", "Sat 4pm"]             },
  { id: 7,  name: "Chess Strategy",         teacher: "Anika Sharma", credits: 1, cat: "Mind",     available: ["Tue 6pm", "Thu 5pm", "Sun 2pm"]  },
  { id: 8,  name: "Sourdough Baking",       teacher: "Lena Fischer", credits: 1, cat: "Cooking",  available: ["Sat 9am", "Sun 10am"]            }
];

var categoryDotColors = {
  Music: "#FF9800", Language: "#66BB6A", Tech: "#42A5F5",
  Cooking: "#EC407A", Wellness: "#AB47BC", Design: "#26C6DA", Mind: "#FFCA28"
};

/* ════════════════════════════════════════
   INIT
════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", function () {
  renderWeekStrip();
  renderTimeSlots();
  renderConfirmedBookings();
  renderAddSkillGrid();
  updateCreditDisplay();
});

/* ════════════════════════════════════════
   WEEK STRIP
════════════════════════════════════════ */
function renderWeekStrip() {
  var container = document.getElementById("weekStrip");
  container.innerHTML = "";

  calendarDays.forEach(function (day, i) {
    var card = document.createElement("div");
    card.className = "day-card" + (i === activeDay ? " active" : "");
    card.onclick = function () { selectDay(i); };

    var hasDot = dotDays.indexOf(i) !== -1;

    card.innerHTML =
      '<span class="day-name">' + day + '</span>' +
      '<span class="day-num">'  + calendarDates[i] + '</span>' +
      '<div class="day-dot' + (hasDot ? '' : ' hidden-dot') + '"></div>';

    container.appendChild(card);
  });
}

function selectDay(dayIndex) {
  activeDay = dayIndex;
  renderWeekStrip();
  renderTimeSlots();
}

/* ════════════════════════════════════════
   TIME SLOTS
════════════════════════════════════════ */
function renderTimeSlots() {
  var container = document.getElementById("timeSlots");
  container.innerHTML = "";

  /* Update label */
  var label = document.getElementById("slotLabel");
  label.textContent = "Available Sessions — " + calendarDays[activeDay] + " May " + calendarDates[activeDay];

  var dayPresets = presetSessions[activeDay] || {};

  timeSlots.forEach(function (time, i) {
    var row = document.createElement("div");
    row.className = "time-row";

    /* Time label */
    var lbl = document.createElement("span");
    lbl.className = "time-label";
    lbl.textContent = time;

    /* Block */
    var block = document.createElement("div");
    var preset = dayPresets[i];

    if (preset) {
      block.className = "time-block booked";
      block.style.background = preset.color;

      var span = document.createElement("span");
      span.className = "session-name";
      span.style.color = preset.textColor;
      span.textContent = preset.name + " · " + preset.teacher;
      block.appendChild(span);
    } else {
      block.className = "time-block empty";
      block.title = "Click to book a session at " + time;
      block.onclick = function () { openAddModal(time); };

      var addLbl = document.createElement("span");
      addLbl.className = "add-label";
      addLbl.textContent = "+ Book a session";
      block.appendChild(addLbl);
    }

    row.appendChild(lbl);
    row.appendChild(block);
    container.appendChild(row);
  });
}

/* ════════════════════════════════════════
   CONFIRMED BOOKINGS
════════════════════════════════════════ */
function renderConfirmedBookings() {
  var container = document.getElementById("confirmedList");
  container.innerHTML = "";

  confirmedBookings.forEach(function (b, idx) {
    var dot = categoryDotColors[b.cat] || "#888";

    var card = document.createElement("div");
    card.className = "booking-card";
    card.innerHTML =
      '<div class="booking-top">' +
        '<div>' +
          '<div class="booking-name">' + b.name + '</div>' +
          '<div class="booking-teacher">with ' + b.teacher + '</div>' +
        '</div>' +
        '<span class="credit-tag">⏱ ' + b.credits + ' cr</span>' +
      '</div>' +
      '<div class="booking-date">' +
        '<div class="booking-cat-dot" style="background:' + dot + '"></div>' +
        '📅 ' + b.date +
      '</div>' +
      '<button class="btn-cancel" onclick="cancelBooking(' + idx + ')">Cancel</button>';

    container.appendChild(card);
  });
}

function cancelBooking(idx) {
  var booking = confirmedBookings[idx];
  credits += booking.credits;
  confirmedBookings.splice(idx, 1);
  renderConfirmedBookings();
  updateCreditDisplay();
  showToast("Session cancelled. +" + booking.credits + " credit(s) refunded.");
}

/* ════════════════════════════════════════
   ADD SESSION MODAL
════════════════════════════════════════ */
var selectedTimeForBooking = "";

function openAddModal(time) {
  selectedTimeForBooking = time;
  document.getElementById("addSessionBackdrop").classList.remove("hidden");
}

function closeAddModal() {
  document.getElementById("addSessionBackdrop").classList.add("hidden");
}

function renderAddSkillGrid() {
  var grid = document.getElementById("addSkillGrid");
  grid.innerHTML = "";

  availableSkills.forEach(function (skill) {
    var card = document.createElement("div");
    card.className = "add-skill-card";
    card.innerHTML =
      '<div class="sk-name">' + skill.name + '</div>' +
      '<div class="sk-teacher">by ' + skill.teacher + '</div>' +
      '<span class="sk-credits">⏱ ' + skill.credits + ' cr/hr</span>';

    card.onclick = function () {
      closeAddModal();
      openBookingModal(skill);
    };

    grid.appendChild(card);
  });
}

/* ════════════════════════════════════════
   BOOKING MODAL
════════════════════════════════════════ */
function openBookingModal(skill) {
  currentBookingSkill = skill;
  selectedSlot = null;

  /* Info bar */
  document.getElementById("bookingInfoBar").innerHTML =
    '<div class="bname">' + skill.name + '</div>' +
    '<div class="bsub">with ' + skill.teacher + ' · ⏱ ' + skill.credits + ' credit' + (skill.credits > 1 ? 's' : '') + '</div>';

  /* Slot options */
  var opts = document.getElementById("slotOptions");
  opts.innerHTML = "";
  skill.available.forEach(function (slot) {
    var btn = document.createElement("button");
    btn.className = "slot-opt";
    btn.innerHTML = '<span class="slot-radio">○</span>📅 ' + slot;
    btn.onclick = function () { pickSlot(slot, btn); };
    opts.appendChild(btn);
  });

  /* Credit summary */
  updateCreditSummaryUI();

  /* Confirm button */
  var confirmBtn = document.getElementById("confirmBtn");
  confirmBtn.textContent = "Select a time slot first";
  confirmBtn.disabled = true;

  document.getElementById("bookingBackdrop").classList.remove("hidden");
}

function closeBookingModal() {
  document.getElementById("bookingBackdrop").classList.add("hidden");
  currentBookingSkill = null;
  selectedSlot = null;
}

function pickSlot(slot, btn) {
  selectedSlot = slot;

  /* Update radio buttons */
  document.querySelectorAll(".slot-opt").forEach(function (b) {
    b.classList.remove("selected");
    b.querySelector(".slot-radio").textContent = "○";
  });
  btn.classList.add("selected");
  btn.querySelector(".slot-radio").textContent = "●";

  updateCreditSummaryUI();

  var confirmBtn = document.getElementById("confirmBtn");
  confirmBtn.disabled = false;
  var cr = currentBookingSkill.credits;
  confirmBtn.textContent = "Confirm & Spend ⏱ " + cr + " Credit" + (cr > 1 ? "s" : "");
}

function updateCreditSummaryUI() {
  if (!currentBookingSkill) return;
  var after = credits - currentBookingSkill.credits;
  var summary = document.getElementById("creditSummary");
  summary.innerHTML =
    '<span class="cs-label">Your balance after booking</span>' +
    '<span class="cs-val">' + after + ' credits</span>';
}

function confirmBooking() {
  if (!selectedSlot || !currentBookingSkill) return;

  var newCredits = credits - currentBookingSkill.credits;
  if (newCredits < 0) {
    showToast("Not enough Time Credits! 😬");
    return;
  }

  /* Deduct credits */
  credits = newCredits;
  updateCreditDisplay();

  /* Add to confirmed list */
  var dot = categoryDotColors[currentBookingSkill.cat] || "#888";
  confirmedBookings.push({
    name:     currentBookingSkill.name,
    teacher:  currentBookingSkill.teacher,
    date:     selectedSlot,
    credits:  currentBookingSkill.credits,
    cat:      currentBookingSkill.cat,
    dotColor: dot
  });

  renderConfirmedBookings();
  closeBookingModal();
  showToast("✓ Booked! " + currentBookingSkill.credits + " credit(s) deducted.");
}

/* ════════════════════════════════════════
   CREDIT DISPLAY
════════════════════════════════════════ */
function updateCreditDisplay() {
  document.getElementById("creditCount").textContent = credits;
}

/* ════════════════════════════════════════
   TOAST
════════════════════════════════════════ */
function showToast(msg) {
  var t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(function () { t.classList.remove("show"); }, 3200);
}

/* ════════════════════════════════════════
   NAV (demo – just shows toast)
════════════════════════════════════════ */
function navigate(tab) {
  var labels = { explore: "🗺 Explore", calendar: "📅 Schedule", wallet: "💰 Wallet" };
  if (tab !== "calendar") {
    showToast("Navigating to " + labels[tab] + " — demo only");
  }
  /* Highlight active nav */
  document.querySelectorAll(".nav-btn").forEach(function (b) {
    b.classList.remove("active");
    if (b.textContent.trim().toLowerCase().includes(tab === "calendar" ? "schedule" : tab)) {
      b.classList.add("active");
    }
  });
  return false;
}