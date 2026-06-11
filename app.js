// Replace with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyC2oVO4c9y2UHve-PSkUMsrJpQVLtT_sl8",
  authDomain: "splitwise-free-277e2.firebaseapp.com",
  projectId: "splitwise-free-277e2",
  storageBucket: "splitwise-free-277e2.firebasestorage.app",
  messagingSenderId: "865350056921",
  appId: "1:865350056921:web:eb7ef29c3e84abd23f77c8",
  measurementId: "G-TRF0J1PQRQ"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();
const FieldValue = firebase.firestore.FieldValue;

const CURRENCIES = ["GBP", "USD", "EUR", "MYR", "JPY", "THB", "AUD", "CAD", "SGD"];

const state = {
  user: null,
  trips: [],
  expenses: [],
  memberProfiles: {},
  selectedTripId: null,
  activeTab: "expenses",
  expenseSplitMode: "equal",
  editingExpenseId: null,
  editingExpenseLastEditedMillis: null,
  settlementDebt: null,
  settlementMode: "full",
  tripsLoading: false,
  expensesLoading: false,
  unsubscribeTrips: null,
  unsubscribeExpenses: null,
  pendingInviteTripId: new URLSearchParams(window.location.search).get("tripId")
};

const els = {
  landing: document.getElementById("landing"),
  app: document.getElementById("app"),
  googleSignInBtn: document.getElementById("googleSignInBtn"),
  signOutBtn: document.getElementById("signOutBtn"),
  userPhoto: document.getElementById("userPhoto"),
  userName: document.getElementById("userName"),
  userEmail: document.getElementById("userEmail"),
  mobileUserPhoto: document.getElementById("mobileUserPhoto"),
  mobileUserName: document.getElementById("mobileUserName"),
  mobileUserEmail: document.getElementById("mobileUserEmail"),
  mobileSignOutBtn: document.getElementById("mobileSignOutBtn"),
  tripList: document.getElementById("tripList"),
  emptyState: document.getElementById("emptyState"),
  tripDashboard: document.getElementById("tripDashboard"),
  tripName: document.getElementById("tripName"),
  tripCurrency: document.getElementById("tripCurrency"),
  mobileTripTitle: document.getElementById("mobileTripTitle"),
  memberCount: document.getElementById("memberCount"),
  detailMemberCount: document.getElementById("detailMemberCount"),
  detailOwner: document.getElementById("detailOwner"),
  tripStatus: document.getElementById("tripStatus"),
  creatorLabel: document.getElementById("creatorLabel"),
  detailMemberList: document.getElementById("detailMemberList"),
  balanceStats: document.getElementById("balanceStats"),
  balanceEmptyState: document.getElementById("balanceEmptyState"),
  balanceEmptyMessage: document.getElementById("balanceEmptyMessage"),
  settleFirstDebtBtn: document.getElementById("settleFirstDebtBtn"),
  debtList: document.getElementById("debtList"),
  summaryCurrencyLabel: document.getElementById("summaryCurrencyLabel"),
  personSummaryList: document.getElementById("personSummaryList"),
  baseCurrencySetting: document.getElementById("baseCurrencySetting"),
  closeTripBtn: document.getElementById("closeTripBtn"),
  reopenTripBtn: document.getElementById("reopenTripBtn"),
  memberManagementPanel: document.getElementById("memberManagementPanel"),
  settingsMemberList: document.getElementById("settingsMemberList"),
  inviteLink: document.getElementById("inviteLink"),
  desktopInviteLink: document.getElementById("desktopInviteLink"),
  mobileTripSelect: document.getElementById("mobileTripSelect"),
  bottomTripSelect: document.getElementById("bottomTripSelect"),
  deleteTripBtn: document.getElementById("deleteTripBtn"),
  leaveTripBtn: document.getElementById("leaveTripBtn"),
  mobileActionsBtn: document.getElementById("mobileActionsBtn"),
  headerActionsMenu: document.querySelector(".header-actions-menu"),
  copyInviteBtn: document.getElementById("copyInviteBtn"),
  exportCsvBtn: document.getElementById("exportCsvBtn"),
  copyBalanceSummaryBtn: document.getElementById("copyBalanceSummaryBtn"),
  settingsCopyInviteBtn: document.getElementById("settingsCopyInviteBtn"),
  desktopCopyInviteBtn: document.getElementById("desktopCopyInviteBtn"),
  newTripBtn: document.getElementById("newTripBtn"),
  mobileNewTripBtn: document.getElementById("mobileNewTripBtn"),
  emptyCreateBtn: document.getElementById("emptyCreateBtn"),
  tripModal: document.getElementById("tripModal"),
  tripForm: document.getElementById("tripForm"),
  tripNameInput: document.getElementById("tripNameInput"),
  currencyInput: document.getElementById("currencyInput"),
  tripFormError: document.getElementById("tripFormError"),
  closeTripModalBtn: document.getElementById("closeTripModalBtn"),
  cancelTripBtn: document.getElementById("cancelTripBtn"),
  addExpenseBtn: document.getElementById("addExpenseBtn"),
  expenseLoadStatus: document.getElementById("expenseLoadStatus"),
  expenseEmptyState: document.getElementById("expenseEmptyState"),
  expenseList: document.getElementById("expenseList"),
  expenseModal: document.getElementById("expenseModal"),
  expenseForm: document.getElementById("expenseForm"),
  expenseModalTitle: document.getElementById("expenseModalTitle"),
  expenseDescriptionInput: document.getElementById("expenseDescriptionInput"),
  expenseDateInput: document.getElementById("expenseDateInput"),
  expenseAmountInput: document.getElementById("expenseAmountInput"),
  expenseCurrencyInput: document.getElementById("expenseCurrencyInput"),
  expensePaidByInput: document.getElementById("expensePaidByInput"),
  includePayerInput: document.getElementById("includePayerInput"),
  equalSplitBtn: document.getElementById("equalSplitBtn"),
  customSplitBtn: document.getElementById("customSplitBtn"),
  participantList: document.getElementById("participantList"),
  customSplitPanel: document.getElementById("customSplitPanel"),
  customSplitTotal: document.getElementById("customSplitTotal"),
  customSplitList: document.getElementById("customSplitList"),
  expenseFormError: document.getElementById("expenseFormError"),
  closeExpenseModalBtn: document.getElementById("closeExpenseModalBtn"),
  cancelExpenseBtn: document.getElementById("cancelExpenseBtn"),
  saveExpenseBtn: document.getElementById("saveExpenseBtn"),
  settlementModal: document.getElementById("settlementModal"),
  settlementForm: document.getElementById("settlementForm"),
  settlementParties: document.getElementById("settlementParties"),
  settlementOutstanding: document.getElementById("settlementOutstanding"),
  settlementOutstandingLabel: document.getElementById("settlementOutstandingLabel"),
  fullSettlementBtn: document.getElementById("fullSettlementBtn"),
  partialSettlementBtn: document.getElementById("partialSettlementBtn"),
  settlementAmountInput: document.getElementById("settlementAmountInput"),
  settlementFormError: document.getElementById("settlementFormError"),
  closeSettlementModalBtn: document.getElementById("closeSettlementModalBtn"),
  cancelSettlementBtn: document.getElementById("cancelSettlementBtn"),
  confirmSettlementBtn: document.getElementById("confirmSettlementBtn"),
  closeTripModal: document.getElementById("closeTripModal"),
  closeTripProgress: document.getElementById("closeTripProgress"),
  closeTripProgressDetail: document.getElementById("closeTripProgressDetail"),
  closeTripDebtList: document.getElementById("closeTripDebtList"),
  closeCloseTripModalBtn: document.getElementById("closeCloseTripModalBtn"),
  toast: document.getElementById("toast")
};

els.googleSignInBtn.addEventListener("click", signInWithGoogle);
els.signOutBtn.addEventListener("click", () => auth.signOut());
els.mobileSignOutBtn.addEventListener("click", () => auth.signOut());
els.newTripBtn.addEventListener("click", openTripModal);
els.mobileNewTripBtn.addEventListener("click", openTripModal);
els.emptyCreateBtn.addEventListener("click", openTripModal);
els.closeTripModalBtn.addEventListener("click", closeTripModal);
els.cancelTripBtn.addEventListener("click", closeTripModal);
els.tripForm.addEventListener("submit", createTrip);
els.deleteTripBtn.addEventListener("click", deleteSelectedTrip);
els.leaveTripBtn.addEventListener("click", leaveSelectedTrip);
els.mobileActionsBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  els.headerActionsMenu.classList.toggle("is-open");
});
els.headerActionsMenu.addEventListener("click", () => {
  els.headerActionsMenu.classList.remove("is-open");
});
document.addEventListener("click", () => {
  els.headerActionsMenu.classList.remove("is-open");
});
els.copyInviteBtn.addEventListener("click", copyCurrentInviteLink);
els.exportCsvBtn.addEventListener("click", exportTripCsv);
els.copyBalanceSummaryBtn.addEventListener("click", copyBalanceSummary);
els.settingsCopyInviteBtn.addEventListener("click", copyCurrentInviteLink);
els.desktopCopyInviteBtn.addEventListener("click", copyCurrentInviteLink);
els.mobileTripSelect.addEventListener("change", (event) => selectTrip(event.target.value));
els.bottomTripSelect.addEventListener("change", (event) => selectTrip(event.target.value));
els.baseCurrencySetting.addEventListener("change", changeBaseCurrency);
els.closeTripBtn.addEventListener("click", openCloseTripModal);
els.reopenTripBtn.addEventListener("click", reopenTrip);
els.settleFirstDebtBtn.addEventListener("click", settleFirstOutstandingDebt);
els.addExpenseBtn.addEventListener("click", () => openExpenseModal());
els.closeExpenseModalBtn.addEventListener("click", closeExpenseModal);
els.cancelExpenseBtn.addEventListener("click", closeExpenseModal);
els.expenseForm.addEventListener("submit", saveExpense);
els.expensePaidByInput.addEventListener("change", syncPayerParticipant);
els.includePayerInput.addEventListener("change", syncPayerParticipant);
els.expenseAmountInput.addEventListener("input", updateCustomSplitTotal);
els.equalSplitBtn.addEventListener("click", () => setExpenseSplitMode("equal"));
els.customSplitBtn.addEventListener("click", () => setExpenseSplitMode("custom"));
els.settlementForm.addEventListener("submit", confirmSettlement);
els.closeSettlementModalBtn.addEventListener("click", closeSettlementModal);
els.cancelSettlementBtn.addEventListener("click", closeSettlementModal);
els.fullSettlementBtn.addEventListener("click", () => setSettlementMode("full"));
els.partialSettlementBtn.addEventListener("click", () => setSettlementMode("partial"));
els.closeCloseTripModalBtn.addEventListener("click", closeCloseTripModal);

document.querySelectorAll("[data-tab]").forEach((button) => {
  button.addEventListener("click", () => setActiveTab(button.dataset.tab));
});

auth.onAuthStateChanged(async (user) => {
  state.user = user;
  if (state.unsubscribeTrips) {
    state.unsubscribeTrips();
    state.unsubscribeTrips = null;
  }
  if (state.unsubscribeExpenses) {
    state.unsubscribeExpenses();
    state.unsubscribeExpenses = null;
  }

  if (!user) {
    state.trips = [];
    state.expenses = [];
    state.memberProfiles = {};
    state.selectedTripId = null;
    state.tripsLoading = false;
    state.expensesLoading = false;
    showLanding();
    render();
    return;
  }

  await saveUserProfile(user);
  showApp(user);
  await joinPendingInvite();
  subscribeToTrips(user.uid);
});

async function signInWithGoogle() {
  try {
    await auth.signInWithPopup(googleProvider);
  } catch (error) {
    showToast(error.message || "Google sign-in failed.");
  }
}

async function saveUserProfile(user) {
  const userRef = db.collection("users").doc(user.uid);
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    await userRef.set({
      displayName: user.displayName || "",
      email: user.email || "",
      photoURL: user.photoURL || "",
      createdAt: FieldValue.serverTimestamp()
    });
  }
}

async function joinPendingInvite() {
  if (!state.pendingInviteTripId || !state.user) return;

  const tripRef = db.collection("trips").doc(state.pendingInviteTripId);

  try {
    const tripDoc = await tripRef.get();

    if (!tripDoc.exists) {
      showToast("That invite link does not match an active trip.");
      state.pendingInviteTripId = null;
      clearInviteParam();
      return;
    }

    await tripRef.update({
      memberUids: FieldValue.arrayUnion(state.user.uid)
    });

    // Keep pendingInviteTripId set so subscribeToTrips can select the trip
    // once the snapshot confirms membership. clearInviteParam removes it from
    // the URL only — state.pendingInviteTripId is cleared in the snapshot handler.
    clearInviteParam();
    showToast("You joined the trip.");
  } catch (error) {
    state.pendingInviteTripId = null;
    clearInviteParam();
    showToast(error.message || "Could not join trip.");
  }
}

function subscribeToTrips(uid) {
  state.tripsLoading = true;
  renderTripList();
  state.unsubscribeTrips = db
    .collection("trips")
    .where("memberUids", "array-contains", uid)
    .onSnapshot(
      async (snapshot) => {
        state.tripsLoading = false;
        const previousTripId = state.selectedTripId;
        state.trips = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => getCreatedMillis(b) - getCreatedMillis(a));

        if (state.pendingInviteTripId && state.trips.some((trip) => trip.id === state.pendingInviteTripId)) {
          state.selectedTripId = state.pendingInviteTripId;
          state.pendingInviteTripId = null;
        } else if (!state.trips.some((trip) => trip.id === state.selectedTripId)) {
          state.selectedTripId = state.trips[0]?.id || null;
        }

        if (previousTripId !== state.selectedTripId || !state.unsubscribeExpenses) {
          subscribeToExpenses();
        }

        await loadMemberProfiles();
        render();
      },
      (error) => {
        state.tripsLoading = false;
        renderTripList();
        showToast(error.message || "Could not load trips.");
      }
    );
}

function subscribeToExpenses() {
  if (state.unsubscribeExpenses) {
    state.unsubscribeExpenses();
    state.unsubscribeExpenses = null;
  }

  state.expenses = [];
  if (!state.selectedTripId) {
    state.expensesLoading = false;
    renderExpenses();
    renderBalancesAndSummary();
    return;
  }

  state.expensesLoading = true;
  renderExpenses();
  renderBalancesAndSummary();

  state.unsubscribeExpenses = db
    .collection("trips")
    .doc(state.selectedTripId)
    .collection("expenses")
    .onSnapshot(
      (snapshot) => {
        state.expensesLoading = false;
        state.expenses = snapshot.docs
          .map((doc) => normalizeEntry({ id: doc.id, ...doc.data() }))
          .sort(sortEntriesNewestFirst);
        renderExpenses();
        renderBalancesAndSummary();
      },
      (error) => {
        state.expensesLoading = false;
        state.expenses = [];
        renderExpenses();
        renderBalancesAndSummary();
        showToast(error.message || "Could not load expenses.");
        if (els.expenseLoadStatus) {
          els.expenseLoadStatus.textContent = `Could not load entries: ${error.message || "Firestore rejected the read."}`;
        }
      }
    );
}

async function loadMemberProfiles() {
  const trip = getSelectedTrip();
  const uids = trip?.memberUids || [];
  const profiles = {};

  await Promise.all(
    uids.map(async (uid) => {
      if (uid === state.user?.uid) {
        profiles[uid] = userProfileFromAuth(state.user);
      }

      try {
        const doc = await db.collection("users").doc(uid).get();
        if (doc.exists) {
          profiles[uid] = { uid, ...doc.data() };
        } else if (!profiles[uid]) {
          profiles[uid] = fallbackProfile(uid);
        }
      } catch (error) {
        if (!profiles[uid]) profiles[uid] = fallbackProfile(uid);
      }
    })
  );

  state.memberProfiles = profiles;
}

async function createTrip(event) {
  event.preventDefault();
  if (!state.user) return;
  hideTripError();
  clearTripValidation();

  const name = els.tripNameInput.value.trim();
  const baseCurrency = els.currencyInput.value;

  if (!name) {
    markInvalid(els.tripNameInput);
    showTripError("Enter a trip name.");
    return;
  }

  if (!CURRENCIES.includes(baseCurrency)) {
    markInvalid(els.currencyInput);
    showTripError("Choose a supported currency.");
    return;
  }

  try {
    const docRef = await db.collection("trips").add({
      name,
      baseCurrency,
      createdBy: state.user.uid,
      createdAt: FieldValue.serverTimestamp(),
      memberUids: [state.user.uid],
      status: "active"
    });

    state.selectedTripId = docRef.id;
    closeTripModal();
    showToast("Trip created.");
  } catch (error) {
    showToast(error.message || "Could not create trip.");
  }
}

async function deleteSelectedTrip() {
  const trip = getSelectedTrip();
  if (!trip || !state.user || trip.createdBy !== state.user.uid) return;

  const { debts } = getCurrentBalanceResult();
  if (debts.length > 0) {
    const baseCurrency = trip.baseCurrency || "GBP";
    const lines = debts
      .map((d) => `• ${displayName(getMemberProfile(d.debtorUid))} owes ${displayName(getMemberProfile(d.creditorUid))} ${formatMoney(d.amount)} ${baseCurrency}`)
      .join("\n");
    window.alert(`Cannot delete "${trip.name}" — ${debts.length} unsettled debt${debts.length === 1 ? "" : "s"} remain:\n\n${lines}\n\nSettle all balances before deleting the trip.`);
    return;
  }

  const confirmed = window.confirm(`Delete "${trip.name}"? This removes the trip for every member.`);
  if (!confirmed) return;

  try {
    await db.collection("trips").doc(trip.id).delete();
    showToast("Trip deleted.");
  } catch (error) {
    showToast(error.message || "Could not delete trip.");
  }
}

async function leaveSelectedTrip() {
  const trip = getSelectedTrip();
  if (!trip || !state.user || trip.createdBy === state.user.uid) return;

  const { summary } = getCurrentBalanceResult();
  const myNet = roundMoney(summary[state.user.uid]?.net || 0);
  const baseCurrency = trip.baseCurrency || "GBP";

  if (toCents(Math.abs(myNet)) > 0) {
    const direction = myNet > 0 ? `you are owed ${formatMoney(myNet)} ${baseCurrency}` : `you owe ${formatMoney(Math.abs(myNet))} ${baseCurrency}`;
    window.alert(`Cannot leave "${trip.name}" — ${direction}. Settle all balances before leaving.`);
    return;
  }

  const confirmed = window.confirm(`Leave "${trip.name}"?`);
  if (!confirmed) return;

  try {
    await db.collection("trips").doc(trip.id).update({
      memberUids: FieldValue.arrayRemove(state.user.uid)
    });
    showToast("You left the trip.");
  } catch (error) {
    showToast(error.message || "Could not leave trip.");
  }
}

async function changeBaseCurrency(event) {
  const trip = getSelectedTrip();
  if (!trip || !state.user) return;

  const nextCurrency = event.target.value;
  const currentCurrency = trip.baseCurrency || "GBP";

  if (nextCurrency === currentCurrency) return;
  if (!CURRENCIES.includes(nextCurrency)) {
    event.target.value = currentCurrency;
    showToast("Choose a supported currency.");
    return;
  }

  const confirmed = window.confirm(
    "This will recalculate all balances. Converted amounts already locked to expenses will not change, only the balance display currency will shift."
  );

  if (!confirmed) {
    event.target.value = currentCurrency;
    return;
  }

  try {
    await db.runTransaction(async (transaction) => {
      const tripRef = db.collection("trips").doc(trip.id);
      const tripSnap = await transaction.get(tripRef);
      if (!tripSnap.exists) throw new Error("Trip no longer exists.");
      if (!(tripSnap.data().memberUids || []).includes(state.user.uid)) {
        throw new Error("You are no longer a member of this trip.");
      }

      transaction.update(tripRef, { baseCurrency: nextCurrency });
    });

    showToast("Base currency updated.");
  } catch (error) {
    event.target.value = currentCurrency;
    showToast(error.message || "Could not update base currency.");
  }
}

async function saveExpense(event) {
  event.preventDefault();
  hideExpenseError();
  clearExpenseValidation();

  const trip = getSelectedTrip();
  if (!trip || !state.user) return;

  const expenseInput = readExpenseForm(trip);
  if (!expenseInput.ok) {
    showExpenseError(expenseInput.message);
    return;
  }

  els.saveExpenseBtn.disabled = true;
  els.saveExpenseBtn.textContent = state.editingExpenseId ? "Saving..." : "Adding...";

  try {
    const conversion = await getExpenseConversion(
      expenseInput.amount,
      trip.baseCurrency,
      expenseInput.originalCurrency
    );
    const splits = buildBaseCurrencySplits(expenseInput, conversion);
    const expenseData = {
      description: expenseInput.description,
      date: expenseInput.date,
      amount: expenseInput.amount,
      originalCurrency: expenseInput.originalCurrency,
      rateUsed: conversion.rateUsed,
      convertedAmount: conversion.convertedAmount,
      paidBy: expenseInput.paidBy,
      splitMode: expenseInput.splitMode,
      splits,
      isSettlement: false,
      lastEditedBy: state.user.uid,
      lastEditedAt: FieldValue.serverTimestamp()
    };

    await db.runTransaction(async (transaction) => {
      const tripRef = db.collection("trips").doc(trip.id);
      const tripSnap = await transaction.get(tripRef);

      if (!tripSnap.exists) throw new Error("Trip no longer exists.");

      const liveTrip = tripSnap.data();
      const liveMembers = liveTrip.memberUids || [];
      const participantUids = Object.keys(expenseData.splits);

      if (!liveMembers.includes(state.user.uid)) throw new Error("You are no longer a member of this trip.");
      if (!liveMembers.includes(expenseData.paidBy)) throw new Error("The payer is no longer a trip member.");
      if (participantUids.some((uid) => !liveMembers.includes(uid))) {
        throw new Error("One or more split members are no longer in this trip.");
      }

      if (state.editingExpenseId) {
        const expenseRef = tripRef.collection("expenses").doc(state.editingExpenseId);
        const expenseSnap = await transaction.get(expenseRef);
        if (!expenseSnap.exists) throw new Error("edit-conflict");
        const liveEditedMillis = getTimestampMillis(expenseSnap.data().lastEditedAt);
        if (state.editingExpenseLastEditedMillis !== null && liveEditedMillis !== state.editingExpenseLastEditedMillis) {
          throw new Error("edit-conflict");
        }
        transaction.update(expenseRef, expenseData);
      } else {
        const expenseRef = tripRef.collection("expenses").doc();
        transaction.set(expenseRef, {
          ...expenseData,
          createdAt: FieldValue.serverTimestamp()
        });
      }
    });

    closeExpenseModal();
    showToast("Expense saved.");
  } catch (error) {
    const message =
      error.message === "exchange-rate-failed"
        ? "Could not fetch exchange rate. Check your connection and try again."
        : error.message === "edit-conflict"
          ? "Edit conflict detected. This entry changed while you were editing."
        : error.message || "Could not save expense.";
    showExpenseError(message);
    if (error.message === "exchange-rate-failed") {
      showToast(message);
    }
    if (error.message === "edit-conflict") {
      showToast("Edit conflict detected.");
    }
  } finally {
    els.saveExpenseBtn.disabled = false;
    els.saveExpenseBtn.textContent = "Save expense";
  }
}

async function deleteExpense(expenseId) {
  const trip = getSelectedTrip();
  if (!trip || !state.user) return;

  const expense = state.expenses.find((item) => item.id === expenseId);
  if (!expense) return;

  if (expense.isSettlement && !isSettlementParty(expense, state.user.uid)) {
    showToast("Only either party involved can delete this settlement.");
    return;
  }

  const confirmed = window.confirm(`Delete "${expense.description || "this entry"}"?`);
  if (!confirmed) return;

  try {
    await db.runTransaction(async (transaction) => {
      const tripRef = db.collection("trips").doc(trip.id);
      const tripSnap = await transaction.get(tripRef);
      if (!tripSnap.exists) throw new Error("Trip no longer exists.");
      if (!(tripSnap.data().memberUids || []).includes(state.user.uid)) {
        throw new Error("You are no longer a member of this trip.");
      }
      transaction.delete(tripRef.collection("expenses").doc(expenseId));
    });

    showToast("Expense deleted.");
  } catch (error) {
    showToast(error.message || "Could not delete expense.");
  }
}

function readExpenseForm(trip) {
  const description = els.expenseDescriptionInput.value.trim();
  const date = els.expenseDateInput.value;
  const amount = roundMoney(Number(els.expenseAmountInput.value));
  const originalCurrency = els.expenseCurrencyInput.value;
  const paidBy = els.expensePaidByInput.value;
  const selectedParticipants = getSelectedParticipants();
  const splitMode = state.expenseSplitMode;

  if (!description) {
    markInvalid(els.expenseDescriptionInput);
    return { ok: false, message: "Enter a description." };
  }
  if (!date) {
    markInvalid(els.expenseDateInput);
    return { ok: false, message: "Choose a date." };
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    markInvalid(els.expenseAmountInput);
    return { ok: false, message: "Enter a valid amount." };
  }
  if (!CURRENCIES.includes(originalCurrency)) {
    markInvalid(els.expenseCurrencyInput);
    return { ok: false, message: "Choose a supported currency." };
  }
  if (!(trip.memberUids || []).includes(paidBy)) {
    markInvalid(els.expensePaidByInput);
    return { ok: false, message: "Choose a trip member as payer." };
  }
  if (selectedParticipants.length < 2) {
    return { ok: false, message: "Choose at least 2 members to split among." };
  }

  let originalCurrencySplits;
  if (splitMode === "custom") {
    originalCurrencySplits = readCustomSplits(selectedParticipants);
    if (!originalCurrencySplits.ok) return originalCurrencySplits;
  } else {
    originalCurrencySplits = {
      ok: true,
      splits: splitEqualCents(toCents(amount), selectedParticipants)
    };
  }

  return {
    ok: true,
    description,
    date,
    amount,
    originalCurrency,
    paidBy,
    splitMode,
    participantUids: selectedParticipants,
    originalCurrencySplits: originalCurrencySplits.splits,
    baseCurrency: trip.baseCurrency || "GBP"
  };
}

function readCustomSplits(participantUids) {
  const totalCents = toCents(Number(els.expenseAmountInput.value));
  const splits = {};
  let runningCents = 0;

  for (const uid of participantUids) {
    const input = els.customSplitList.querySelector(`[data-custom-share="${cssEscape(uid)}"]`);
    const cents = toCents(Number(input?.value || 0));
    if (cents < 0) {
      markInvalid(input);
      return { ok: false, message: "Custom split amounts cannot be negative." };
    }
    splits[uid] = fromCents(cents);
    runningCents += cents;
  }

  if (runningCents !== totalCents) {
    els.customSplitList.querySelectorAll("[data-custom-share]").forEach((input) => markInvalid(input));
    return { ok: false, message: "Custom split amounts must sum to the total." };
  }

  return { ok: true, splits };
}

async function getExpenseConversion(amount, baseCurrency, originalCurrency) {
  if (baseCurrency === originalCurrency) {
    return {
      rateUsed: 1,
      convertedAmount: amount
    };
  }

  try {
    const url = `https://api.frankfurter.app/latest?from=${encodeURIComponent(baseCurrency)}&to=${encodeURIComponent(originalCurrency)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("exchange-rate-failed");

    const data = await response.json();
    const rate = Number(data?.rates?.[originalCurrency]);
    if (!Number.isFinite(rate) || rate <= 0) throw new Error("exchange-rate-failed");

    return {
      rateUsed: rate,
      convertedAmount: roundMoney(amount / rate)
    };
  } catch (error) {
    throw new Error("exchange-rate-failed");
  }
}

function buildBaseCurrencySplits(expenseInput, conversion) {
  const splitEntries = Object.entries(expenseInput.originalCurrencySplits);
  const convertedTotalCents = toCents(conversion.convertedAmount);

  if (expenseInput.originalCurrency === expenseInput.baseCurrency) {
    return Object.fromEntries(splitEntries.map(([uid, value]) => [uid, roundMoney(value)]));
  }

  if (expenseInput.splitMode === "equal") {
    return splitEqualCents(convertedTotalCents, expenseInput.participantUids);
  }

  const baseSplits = {};
  let assignedCents = 0;

  splitEntries.forEach(([uid, originalShare], index) => {
    let cents = toCents(roundMoney(originalShare / conversion.rateUsed));
    if (index === splitEntries.length - 1) {
      cents = convertedTotalCents - assignedCents;
    }
    baseSplits[uid] = fromCents(cents);
    assignedCents += cents;
  });

  return baseSplits;
}

function splitEqualCents(totalCents, participantUids) {
  const baseShare = Math.floor(totalCents / participantUids.length);
  const remainder = totalCents - baseShare * participantUids.length;
  const winnerIndex = remainder > 0 ? Math.floor(Math.random() * participantUids.length) : -1;
  const splits = {};

  participantUids.forEach((uid, index) => {
    splits[uid] = fromCents(baseShare + (index === winnerIndex ? remainder : 0));
  });

  return splits;
}

function render() {
  const trip = getSelectedTrip();

  renderTripList();
  renderTripSelects();
  renderDashboard(trip);
  renderExpenses();
  renderBalancesAndSummary();
  setActiveTab(state.activeTab);
}

function renderTripList() {
  els.tripList.innerHTML = "";

  if (state.tripsLoading) {
    els.tripList.append(createSkeletonStack(3, "skeleton-row"));
    return;
  }

  state.trips.forEach((trip) => {
    const button = document.createElement("button");
    button.className = `trip-item${trip.id === state.selectedTripId ? " is-active" : ""}`;
    button.type = "button";
    button.addEventListener("click", () => selectTrip(trip.id));

    const name = document.createElement("strong");
    name.textContent = trip.name || "Untitled trip";

    const meta = document.createElement("span");
    meta.textContent = `${trip.baseCurrency || ""} - ${(trip.memberUids || []).length} member${(trip.memberUids || []).length === 1 ? "" : "s"}`;

    button.append(name, meta);
    els.tripList.append(button);
  });
}

function renderTripSelects() {
  [els.mobileTripSelect, els.bottomTripSelect].forEach((select) => {
    select.innerHTML = "";

    if (!state.trips.length) {
      const option = document.createElement("option");
      option.textContent = "No trips";
      option.value = "";
      select.append(option);
      return;
    }

    state.trips.forEach((trip) => {
      const option = document.createElement("option");
      option.value = trip.id;
      option.textContent = trip.name || "Untitled trip";
      option.selected = trip.id === state.selectedTripId;
      select.append(option);
    });
  });
}

function renderDashboard(trip) {
  if (!trip) {
    els.emptyState.classList.remove("is-hidden");
    els.tripDashboard.classList.add("is-hidden");
    els.mobileTripTitle.textContent = "Dashboard";
    return;
  }

  const inviteUrl = getInviteUrl(trip.id);
  const isCreator = trip.createdBy === state.user?.uid;
  const memberTotal = (trip.memberUids || []).length;

  els.emptyState.classList.add("is-hidden");
  els.tripDashboard.classList.remove("is-hidden");
  els.tripName.textContent = trip.name || "Untitled trip";
  els.tripCurrency.textContent = `${trip.baseCurrency || "GBP"} base currency`;
  els.mobileTripTitle.textContent = trip.name || "Dashboard";
  els.memberCount.textContent = String(memberTotal);
  els.detailMemberCount.textContent = `${memberTotal} ${memberTotal === 1 ? "person" : "people"}`;
  els.detailOwner.textContent = isCreator ? "You created this trip." : "You are a member of this trip.";
  els.tripStatus.textContent = trip.status || "active";
  const statusLower = String(trip.status || "").toLowerCase();
  els.tripStatus.classList.toggle("status-badge", statusLower === "settled" || statusLower === "closing");
  els.creatorLabel.textContent = isCreator ? "Creator" : "Member";
  els.baseCurrencySetting.value = trip.baseCurrency || "GBP";
  els.closeTripBtn.classList.toggle("is-hidden", !isCreator || statusLower !== "active");
  els.reopenTripBtn.classList.toggle("is-hidden", !isCreator || (statusLower !== "settled" && statusLower !== "closing"));
  els.memberManagementPanel.classList.toggle("is-hidden", !isCreator);
  els.inviteLink.value = inviteUrl;
  els.desktopInviteLink.value = inviteUrl;
  els.deleteTripBtn.classList.toggle("is-hidden", !isCreator);
  els.leaveTripBtn.classList.toggle("is-hidden", isCreator);
  renderMemberManagement(trip, isCreator);
}

function renderExpenses() {
  if (!els.expenseList || !els.expenseEmptyState) return;

  els.expenseList.innerHTML = "";
  if (state.expensesLoading) {
    els.expenseEmptyState.classList.add("is-hidden");
    if (els.expenseLoadStatus) {
      els.expenseLoadStatus.textContent = "Loading trip entries...";
    }
    els.expenseList.append(createSkeletonStack(3, "skeleton-card"));
    return;
  }

  els.expenseEmptyState.classList.toggle("is-hidden", state.expenses.length > 0);
  if (els.expenseLoadStatus) {
    els.expenseLoadStatus.textContent = "";
  }

  state.expenses.forEach((expense) => {
    els.expenseList.append(createExpenseCard(expense));
  });
}

function createSkeletonStack(count, className) {
  const stack = document.createElement("div");
  stack.className = "skeleton-stack";

  for (let index = 0; index < count; index += 1) {
    const item = document.createElement("div");
    item.className = className;
    stack.append(item);
  }

  return stack;
}

function normalizeEntry(entry) {
  const normalized = { ...entry };

  if (normalized.isSettlement) {
    normalized.payer = normalized.payer || normalized.paidBy;
    normalized.recipient =
      normalized.recipient ||
      normalized.receivedBy ||
      normalized.creditorUid ||
      normalized.settledWith ||
      Object.keys(normalized.splits || {})[0] ||
      "";
    normalized.amount = roundMoney(normalized.amount || normalized.convertedAmount || 0);
    normalized.convertedAmount = roundMoney(normalized.convertedAmount || normalized.amount || 0);
    normalized.date = normalized.date || dateStringFromTimestamp(normalized.createdAt);
    normalized.settlementType = normalized.settlementType || "partial";
  }

  return normalized;
}

function sortEntriesNewestFirst(a, b) {
  return getEntryTime(b) - getEntryTime(a);
}

function getEntryTime(entry) {
  if (entry.date) return new Date(`${entry.date}T00:00:00`).getTime() || 0;
  if (entry.createdAt?.toMillis) return entry.createdAt.toMillis();
  return 0;
}

function renderBalancesAndSummary() {
  if (!els.debtList || !els.personSummaryList) return;

  const trip = getSelectedTrip();
  const result = getCurrentBalanceResult();
  const baseCurrency = trip?.baseCurrency || "GBP";

  renderDebtList(result.debts, baseCurrency);
  renderPersonSummary(result.summary, baseCurrency);
  if (!els.closeTripModal.classList.contains("is-hidden")) {
    renderCloseTripModal();
  }
}

function getCurrentBalanceResult(expenses = state.expenses, trip = getSelectedTrip()) {
  return calculateBalances(trip, expenses);
}

function renderMemberManagement(trip, isCreator) {
  [els.detailMemberList, els.settingsMemberList].forEach((list) => {
    list.innerHTML = "";

    (trip.memberUids || []).forEach((uid) => {
      const profile = getMemberProfile(uid);
      const row = document.createElement("div");
      row.className = "member-management-row";
      row.append(createAvatar(profile, "payer-avatar"));

      const copy = document.createElement("div");
      const name = document.createElement("strong");
      name.textContent = displayName(profile);
      const email = document.createElement("span");
      email.textContent = uid === trip.createdBy ? "Creator" : profile.email || "Trip member";
      copy.append(name, email);
      row.append(copy);

      if (isCreator && uid !== trip.createdBy) {
        const removeButton = document.createElement("button");
        removeButton.className = "small-btn danger";
        removeButton.type = "button";
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", () => removeMember(uid));
        row.append(removeButton);
      } else {
        const marker = document.createElement("span");
        marker.textContent = uid === state.user?.uid ? "You" : "";
        row.append(marker);
      }

      list.append(row);
    });
  });
}

function calculateBalances(trip, documents) {
  const memberUids = trip?.memberUids || [];
  const summary = {};

  memberUids.forEach((uid) => {
    summary[uid] = {
      uid,
      paidOut: 0,
      shareOwed: 0,
      settled: 0,
      net: 0
    };
  });

  documents.forEach((doc) => {
    if (doc.isSettlement) {
      applySettlement(summary, doc);
      return;
    }

    const amount = getBaseAmountForDocument(doc, trip);
    if (summary[doc.paidBy]) {
      summary[doc.paidBy].paidOut = roundMoney(summary[doc.paidBy].paidOut + amount);
      summary[doc.paidBy].net = roundMoney(summary[doc.paidBy].net + amount);
    }

    Object.entries(doc.splits || {}).forEach(([uid, share]) => {
      const value = roundMoney(share);
      if (!summary[uid]) return;
      summary[uid].shareOwed = roundMoney(summary[uid].shareOwed + value);
      summary[uid].net = roundMoney(summary[uid].net - value);
    });
  });

  const debts = simplifyDebts(summary);
  return { summary, debts };
}

function applySettlement(summary, settlement) {
  const paidBy = settlement.payer || settlement.paidBy;
  const amount = roundMoney(settlement.convertedAmount || settlement.amount || 0);
  const recipients = settlement.splits && Object.keys(settlement.splits).length
    ? Object.entries(settlement.splits)
    : settlement.recipient || settlement.receivedBy || settlement.creditorUid || settlement.settledWith
      ? [[settlement.recipient || settlement.receivedBy || settlement.creditorUid || settlement.settledWith, amount]]
      : [];

  if (summary[paidBy]) {
    const totalPaid = recipients.reduce((sum, [, value]) => sum + roundMoney(value), 0) || amount;
    summary[paidBy].settled = roundMoney(summary[paidBy].settled + totalPaid);
    summary[paidBy].net = roundMoney(summary[paidBy].net + totalPaid);
  }

  recipients.forEach(([uid, value]) => {
    const settlementAmount = roundMoney(value);
    if (!summary[uid]) return;
    summary[uid].settled = roundMoney(summary[uid].settled + settlementAmount);
    summary[uid].net = roundMoney(summary[uid].net - settlementAmount);
  });
}

function simplifyDebts(summary) {
  const creditors = [];
  const debtors = [];

  Object.values(summary).forEach((member) => {
    const cents = toCents(member.net);
    if (cents > 0) creditors.push({ uid: member.uid, cents });
    if (cents < 0) debtors.push({ uid: member.uid, cents: Math.abs(cents) });
  });

  creditors.sort((a, b) => b.cents - a.cents);
  debtors.sort((a, b) => b.cents - a.cents);

  const debts = [];
  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];
    const amountCents = Math.min(debtor.cents, creditor.cents);

    if (amountCents > 0) {
      debts.push({
        debtorUid: debtor.uid,
        creditorUid: creditor.uid,
        amount: fromCents(amountCents)
      });
    }

    debtor.cents -= amountCents;
    creditor.cents -= amountCents;

    if (debtor.cents === 0) debtorIndex += 1;
    if (creditor.cents === 0) creditorIndex += 1;
  }

  return debts;
}

function getBaseAmountForDocument(doc, trip) {
  if (Number.isFinite(Number(doc.convertedAmount))) {
    return roundMoney(doc.convertedAmount);
  }

  const splitTotal = Object.values(doc.splits || {}).reduce((sum, value) => sum + roundMoney(value), 0);
  if (splitTotal > 0) return roundMoney(splitTotal);

  if (doc.originalCurrency === (trip?.baseCurrency || "GBP")) {
    return roundMoney(doc.amount || 0);
  }

  return 0;
}

function renderDebtList(debts, baseCurrency) {
  els.debtList.innerHTML = "";
  if (state.expensesLoading) {
    els.balanceEmptyState.classList.add("is-hidden");
    els.settleFirstDebtBtn.classList.add("is-hidden");
    els.balanceStats.textContent = "Loading balances...";
    els.debtList.append(createSkeletonStack(2, "skeleton-card"));
    return;
  }

  els.balanceEmptyState.classList.toggle("is-hidden", debts.length > 0);
  els.settleFirstDebtBtn.classList.toggle("is-hidden", debts.length === 0);
  els.balanceStats.textContent = `${state.expenses.length} expense${state.expenses.length === 1 ? "" : "s"} included - ${(getSelectedTrip()?.memberUids || []).length} member${(getSelectedTrip()?.memberUids || []).length === 1 ? "" : "s"}`;
  els.balanceEmptyMessage.textContent =
    state.expenses.length > 0
      ? "Everyone is settled up based on the current expenses."
      : "No balances yet for this trip.";

  debts.forEach((debt) => {
    const row = document.createElement("article");
    row.className = "debt-row";

    row.append(
      createDebtPerson(debt.debtorUid, "owes"),
      createDebtAmount(debt.amount, baseCurrency),
      createDebtPerson(debt.creditorUid, "receives"),
      createDebtAction(debt)
    );

    els.debtList.append(row);
  });
}

function settleFirstOutstandingDebt() {
  const { debts } = getCurrentBalanceResult();
  if (!debts.length) {
    showToast("There are no outstanding debts to settle.");
    return;
  }

  openSettlementModal(debts[0], "full");
}

function createDebtAction(debt) {
  const button = document.createElement("button");
  button.className = "primary-btn";
  button.type = "button";
  button.textContent = "Settle up";
  button.addEventListener("click", () => openSettlementModal(debt));
  return button;
}

function openSettlementModal(debt, preferredMode = "full") {
  const trip = getSelectedTrip();
  if (!trip) return;

  state.settlementDebt = { ...debt };
  renderSettlementParties(debt);
  els.settlementOutstanding.textContent = `${formatMoney(debt.amount)} ${trip.baseCurrency || "GBP"}`;
  els.settlementOutstandingLabel.textContent = `${displayName(getMemberProfile(debt.debtorUid))} owes ${displayName(getMemberProfile(debt.creditorUid))}`;
  els.settlementAmountInput.max = String(debt.amount);
  els.settlementAmountInput.value = formatMoney(debt.amount);
  hideSettlementError();
  setSettlementMode(preferredMode);
  els.settlementModal.classList.remove("is-hidden");
}

function closeSettlementModal() {
  els.settlementModal.classList.add("is-hidden");
  state.settlementDebt = null;
}

function renderSettlementParties(debt) {
  els.settlementParties.innerHTML = "";
  els.settlementParties.append(
    createSettlementParty(debt.debtorUid, "payer"),
    createSettlementArrow(),
    createSettlementParty(debt.creditorUid, "recipient")
  );
}

function createSettlementParty(uid, label) {
  const profile = getMemberProfile(uid);
  const party = document.createElement("div");
  party.className = "settlement-party";
  party.append(createAvatar(profile, "payer-avatar"));

  const copy = document.createElement("div");
  const name = document.createElement("strong");
  name.textContent = displayName(profile);
  const role = document.createElement("span");
  role.textContent = label;
  copy.append(name, role);
  party.append(copy);
  return party;
}

function createSettlementArrow() {
  const arrow = document.createElement("div");
  arrow.className = "settlement-arrow";
  arrow.textContent = "pays";
  return arrow;
}

function setSettlementMode(mode) {
  const debt = state.settlementDebt;
  state.settlementMode = mode;
  els.fullSettlementBtn.classList.toggle("is-active", mode === "full");
  els.partialSettlementBtn.classList.toggle("is-active", mode === "partial");
  els.settlementAmountInput.readOnly = mode === "full";
  if (mode === "full" && debt) {
    els.settlementAmountInput.value = formatMoney(debt.amount);
  }
}

async function confirmSettlement(event) {
  event.preventDefault();
  hideSettlementError();
  clearSettlementValidation();

  const trip = getSelectedTrip();
  const debt = state.settlementDebt;
  if (!trip || !debt || !state.user) return;

  const amount = roundMoney(Number(els.settlementAmountInput.value));
  const outstanding = roundMoney(debt.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    markInvalid(els.settlementAmountInput);
    showSettlementError("Enter a valid settlement amount.");
    return;
  }

  if (amount > outstanding) {
    markInvalid(els.settlementAmountInput);
    showSettlementError("Settlement amount cannot exceed the outstanding amount.");
    return;
  }

  els.confirmSettlementBtn.disabled = true;
  els.confirmSettlementBtn.textContent = "Confirming...";

  try {
    await writeSettlementWithCheck(trip, debt, amount, state.settlementMode);
    closeSettlementModal();
    showToast("Settlement confirmed.");
    if (!els.closeTripModal.classList.contains("is-hidden")) {
      await markTripSettledIfNeeded(getSelectedTrip());
    }
  } catch (error) {
    if (error.message?.startsWith("already-settled|")) {
      const name = error.message.split("|")[1] || "someone";
      showSettlementError(`This debt was already settled by ${name}.`);
    } else {
      showSettlementError(error.message || "Could not record settlement.");
    }
  } finally {
    els.confirmSettlementBtn.disabled = false;
    els.confirmSettlementBtn.textContent = "Confirm settlement";
  }
}

async function writeSettlementWithCheck(trip, debt, amount, requestedType) {
  const expenseSnapshot = await db.collection("trips").doc(trip.id).collection("expenses").get();
  const expenseRefs = expenseSnapshot.docs.map((doc) => doc.ref);
  const debtorName = displayName(getMemberProfile(debt.debtorUid));

  await db.runTransaction(async (transaction) => {
    const tripRef = db.collection("trips").doc(trip.id);
    const tripSnap = await transaction.get(tripRef);
    if (!tripSnap.exists) throw new Error("Trip no longer exists.");

    const liveTrip = { id: trip.id, ...tripSnap.data() };
    const liveMembers = liveTrip.memberUids || [];
    if (!liveMembers.includes(state.user.uid)) throw new Error("You are no longer a member of this trip.");
    if (!liveMembers.includes(debt.debtorUid) || !liveMembers.includes(debt.creditorUid)) {
      throw new Error("One of these members is no longer in this trip.");
    }

    const liveExpenses = [];
    for (const ref of expenseRefs) {
      const doc = await transaction.get(ref);
      if (doc.exists) liveExpenses.push({ id: doc.id, ...doc.data() });
    }

    const currentDebt = findDebtBetween(calculateBalances(liveTrip, liveExpenses).debts, debt.debtorUid, debt.creditorUid);
    if (!currentDebt || toCents(currentDebt.amount) <= 0) {
      throw new Error(`already-settled|${debtorName}`);
    }

    const amountCents = Math.min(toCents(amount), toCents(currentDebt.amount));
    const settlementType = amountCents >= toCents(currentDebt.amount) ? "full" : requestedType;
    const settlementAmount = fromCents(amountCents);
    const settlementRef = tripRef.collection("expenses").doc();
    const today = new Date().toISOString().slice(0, 10);

    transaction.set(settlementRef, {
      description: `${settlementType === "full" ? "Full" : "Partial"} settlement`,
      isSettlement: true,
      settlementType,
      payer: debt.debtorUid,
      recipient: debt.creditorUid,
      paidBy: debt.debtorUid,
      amount: settlementAmount,
      convertedAmount: settlementAmount,
      originalCurrency: liveTrip.baseCurrency || "GBP",
      rateUsed: 1,
      date: today,
      splits: { [debt.creditorUid]: settlementAmount },
      createdAt: FieldValue.serverTimestamp(),
      lastEditedBy: state.user.uid,
      lastEditedAt: FieldValue.serverTimestamp()
    });
  });
}

function findDebtBetween(debts, debtorUid, creditorUid) {
  return debts.find((debt) => debt.debtorUid === debtorUid && debt.creditorUid === creditorUid) || null;
}

function isSettlementParty(entry, uid) {
  return entry.payer === uid || entry.recipient === uid || entry.paidBy === uid;
}

async function openCloseTripModal() {
  renderCloseTripModal();
  els.closeTripModal.classList.remove("is-hidden");

  const trip = getSelectedTrip();
  if (!trip || trip.createdBy !== state.user?.uid) return;
  const statusLower = String(trip.status || "").toLowerCase();
  if (statusLower === "settled") return;

  const { debts } = getCurrentBalanceResult();

  try {
    if (debts.length === 0 && statusLower !== "settled") {
      await db.collection("trips").doc(trip.id).update({ status: "Settled" });
    } else if (debts.length > 0 && statusLower !== "closing") {
      await db.collection("trips").doc(trip.id).update({ status: "closing" });
    }
  } catch {
    // non-critical — status display only
  }
}

async function reopenTrip() {
  const trip = getSelectedTrip();
  if (!trip || trip.createdBy !== state.user?.uid) return;

  const confirmed = window.confirm(`Reopen "${trip.name}"? The status will be reset to active.`);
  if (!confirmed) return;

  try {
    await db.collection("trips").doc(trip.id).update({ status: "active" });
    showToast("Trip reopened.");
  } catch (error) {
    showToast(error.message || "Could not reopen trip.");
  }
}

function closeCloseTripModal() {
  els.closeTripModal.classList.add("is-hidden");
}

function renderCloseTripModal() {
  const trip = getSelectedTrip();
  if (!trip) return;

  const { debts } = getCurrentBalanceResult();
  const baseCurrency = trip.baseCurrency || "GBP";
  els.closeTripDebtList.innerHTML = "";
  els.closeTripProgress.textContent = `${debts.length} debt${debts.length === 1 ? "" : "s"} remaining`;
  els.closeTripProgressDetail.textContent =
    debts.length === 0 ? "All balances are settled." : "Members confirm their own payments one by one.";

  if (debts.length === 0) {
    const empty = document.createElement("div");
    empty.className = "inline-empty";
    const strong = document.createElement("strong");
    strong.textContent = "Trip settled";
    const span = document.createElement("span");
    span.textContent = "There are no outstanding balances.";
    empty.append(strong, span);
    els.closeTripDebtList.append(empty);
    return;
  }

  debts.forEach((debt) => {
    const row = document.createElement("article");
    row.className = "close-debt-row";
    row.append(
      createDebtPerson(debt.debtorUid, "payer"),
      createDebtAmount(debt.amount, baseCurrency),
      createDebtPerson(debt.creditorUid, "recipient"),
      createCloseDebtActions(debt)
    );
    els.closeTripDebtList.append(row);
  });
}

function createCloseDebtActions(debt) {
  const actions = document.createElement("div");
  actions.className = "close-debt-actions";

  const full = document.createElement("button");
  full.className = "primary-btn";
  full.type = "button";
  full.textContent = "Full";
  full.addEventListener("click", () => openSettlementModal(debt, "full"));

  const partial = document.createElement("button");
  partial.className = "secondary-btn";
  partial.type = "button";
  partial.textContent = "Partial";
  partial.addEventListener("click", () => openSettlementModal(debt, "partial"));

  actions.append(full, partial);
  return actions;
}

async function markTripSettledIfNeeded(trip) {
  if (!trip || trip.createdBy !== state.user?.uid) return;
  if (String(trip.status || "").toLowerCase() !== "closing") return;

  const { debts } = getCurrentBalanceResult();
  if (debts.length > 0) return;

  try {
    await db.runTransaction(async (transaction) => {
      const tripRef = db.collection("trips").doc(trip.id);
      const tripSnap = await transaction.get(tripRef);
      if (!tripSnap.exists) throw new Error("Trip no longer exists.");
      if (tripSnap.data().createdBy !== state.user.uid) return;
      if (String(tripSnap.data().status || "").toLowerCase() !== "closing") return;
      transaction.update(tripRef, { status: "Settled" });
    });
  } catch (error) {
    showToast(error.message || "Could not mark trip as settled.");
  }
}

async function removeMember(uid) {
  const trip = getSelectedTrip();
  if (!trip || trip.createdBy !== state.user?.uid || uid === trip.createdBy) return;

  const { summary } = getCurrentBalanceResult();
  const outstanding = Math.abs(roundMoney(summary[uid]?.net || 0));
  const profile = getMemberProfile(uid);

  if (toCents(outstanding) > 0) {
    showToast(`Cannot remove ${displayName(profile)} -- they have an outstanding balance of ${formatMoney(outstanding)} ${trip.baseCurrency || "GBP"}. Settle all debts first.`);
    return;
  }

  const confirmed = window.confirm(`Remove ${displayName(profile)} from "${trip.name}"?`);
  if (!confirmed) return;

  try {
    await db.runTransaction(async (transaction) => {
      const tripRef = db.collection("trips").doc(trip.id);
      const tripSnap = await transaction.get(tripRef);
      if (!tripSnap.exists) throw new Error("Trip no longer exists.");
      if (tripSnap.data().createdBy !== state.user.uid) throw new Error("Only the creator can remove members.");
      transaction.update(tripRef, {
        memberUids: FieldValue.arrayRemove(uid)
      });
    });
    showToast(`${displayName(profile)} removed.`);
  } catch (error) {
    showToast(error.message || "Could not remove member.");
  }
}

function createDebtPerson(uid, label) {
  const profile = getMemberProfile(uid);
  const person = document.createElement("div");
  person.className = "debt-person";
  person.append(createAvatar(profile, "payer-avatar"));

  const copy = document.createElement("div");
  const name = document.createElement("strong");
  name.textContent = displayName(profile);
  const sub = document.createElement("span");
  sub.textContent = label;
  copy.append(name, sub);
  person.append(copy);

  return person;
}

function createDebtAmount(amount, baseCurrency) {
  const wrapper = document.createElement("div");
  wrapper.className = "debt-amount";
  const label = document.createElement("span");
  label.textContent = "owes";
  const value = document.createElement("strong");
  value.textContent = `${formatMoney(amount)} ${baseCurrency}`;
  wrapper.append(label, value);
  return wrapper;
}

function renderPersonSummary(summary, baseCurrency) {
  const trip = getSelectedTrip();
  els.summaryCurrencyLabel.textContent = baseCurrency;
  els.personSummaryList.innerHTML = "";

  (trip?.memberUids || []).forEach((uid) => {
    const member = summary[uid] || { uid, paidOut: 0, shareOwed: 0, settled: 0, net: 0 };
    const profile = getMemberProfile(uid);
    const card = document.createElement("article");
    card.className = "person-summary-card";

    const person = document.createElement("div");
    person.className = "summary-person";
    person.append(createAvatar(profile, "payer-avatar"));
    const personCopy = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = displayName(profile);
    const email = document.createElement("span");
    email.textContent = profile.email || "Trip member";
    personCopy.append(name, email);
    person.append(personCopy);

    card.append(
      person,
      createSummaryMetric("Paid out", member.paidOut, baseCurrency),
      createSummaryMetric("Share owed", member.shareOwed, baseCurrency),
      createSummaryMetric("Settled", member.settled, baseCurrency),
      createSummaryMetric("Outstanding", member.net, baseCurrency, true)
    );

    els.personSummaryList.append(card);
  });
}

function createSummaryMetric(label, value, baseCurrency, signed = false) {
  const wrapper = document.createElement("div");
  wrapper.className = "summary-metric";
  const labelEl = document.createElement("span");
  labelEl.textContent = label;
  const valueEl = document.createElement("strong");
  valueEl.textContent = `${signed ? formatSignedMoney(value) : formatMoney(value)} ${baseCurrency}`;
  valueEl.classList.toggle("positive", signed && toCents(value) > 0);
  valueEl.classList.toggle("negative", signed && toCents(value) < 0);
  wrapper.append(labelEl, valueEl);
  return wrapper;
}

function createExpenseCard(expense) {
  if (expense.isSettlement) {
    return createSettlementCard(expense);
  }

  const trip = getSelectedTrip();
  const baseCurrency = trip?.baseCurrency || "GBP";
  const payer = getMemberProfile(expense.paidBy);
  const participants = Object.keys(expense.splits || {}).map(getMemberProfile);
  const card = document.createElement("article");
  card.className = "expense-card";

  const header = document.createElement("div");
  header.className = "expense-card-header";

  const titleBlock = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = expense.description || "Untitled expense";
  const date = document.createElement("div");
  date.className = "expense-date";
  date.textContent = formatDate(expense.date);
  titleBlock.append(title, date);

  const amountBlock = document.createElement("div");
  amountBlock.className = "expense-amounts";
  const original = document.createElement("strong");
  original.textContent = `${formatMoney(expense.amount)} ${expense.originalCurrency}`;
  const converted = document.createElement("span");
  converted.textContent = `${formatMoney(expense.convertedAmount)} ${baseCurrency}`;
  amountBlock.append(original, converted);
  header.append(titleBlock, amountBlock);

  const meta = document.createElement("div");
  meta.className = "expense-meta-row";
  const payerLine = document.createElement("div");
  payerLine.className = "payer-line";
  payerLine.append(createAvatar(payer, "payer-avatar"));
  const payerText = document.createElement("span");
  payerText.textContent = `Paid by ${displayName(payer)}`;
  payerLine.append(payerText);
  meta.append(payerLine);

  const rate = document.createElement("div");
  rate.className = "expense-rate";
  rate.textContent =
    expense.originalCurrency === baseCurrency
      ? `Rate locked: 1 ${baseCurrency} = 1 ${expense.originalCurrency} at time of entry`
      : `Rate locked: 1 ${baseCurrency} = ${formatRate(expense.rateUsed)} ${expense.originalCurrency} at time of entry`;

  const participantWrap = document.createElement("div");
  participantWrap.className = "participant-chips";
  participants.forEach((profile) => {
    const chip = document.createElement("span");
    chip.className = "participant-chip";
    chip.append(createAvatar(profile, "participant-avatar"));
    const label = document.createElement("span");
    label.textContent = displayName(profile);
    chip.append(label);
    participantWrap.append(chip);
  });

  const edited = document.createElement("div");
  edited.className = "expense-edited";
  edited.textContent = `Last edited by ${displayName(getMemberProfile(expense.lastEditedBy))} at ${formatTimestamp(expense.lastEditedAt)}`;

  const actions = document.createElement("div");
  actions.className = "expense-actions";
  const editButton = document.createElement("button");
  editButton.className = "small-btn";
  editButton.type = "button";
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => openExpenseModal(expense));
  const deleteButton = document.createElement("button");
  deleteButton.className = "small-btn danger";
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => deleteExpense(expense.id));
  actions.append(editButton, deleteButton);

  card.append(header, meta, rate, participantWrap, edited, actions);
  return card;
}

function createSettlementCard(settlement) {
  const trip = getSelectedTrip();
  const baseCurrency = trip?.baseCurrency || "GBP";
  const payer = getMemberProfile(settlement.payer || settlement.paidBy);
  const recipient = getMemberProfile(
    settlement.recipient ||
      settlement.receivedBy ||
      settlement.creditorUid ||
      settlement.settledWith ||
      Object.keys(settlement.splits || {})[0]
  );
  const card = document.createElement("article");
  card.className = `expense-card settlement-${settlement.settlementType === "partial" ? "partial" : "full"}`;

  const header = document.createElement("div");
  header.className = "expense-card-header";

  const titleBlock = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = settlement.settlementType === "partial" ? "Partial settlement" : "Full settlement";
  const date = document.createElement("div");
  date.className = "expense-date";
  date.textContent = formatDate(settlement.date);
  titleBlock.append(title, date);

  const amountBlock = document.createElement("div");
  amountBlock.className = "expense-amounts";
  const amount = document.createElement("strong");
  amount.textContent = `${formatMoney(settlement.amount)} ${baseCurrency}`;
  const type = document.createElement("span");
  type.textContent = settlement.settlementType === "partial" ? "partial payment" : "settled";
  amountBlock.append(amount, type);
  header.append(titleBlock, amountBlock);

  const meta = document.createElement("div");
  meta.className = "expense-meta-row";
  const payerLine = document.createElement("div");
  payerLine.className = "payer-line";
  payerLine.append(createAvatar(payer, "payer-avatar"));
  const payerText = document.createElement("span");
  payerText.textContent = `${displayName(payer)} paid ${displayName(recipient)}`;
  payerLine.append(payerText);
  meta.append(payerLine);

  const edited = document.createElement("div");
  edited.className = "expense-edited";
  edited.textContent = `Recorded by ${displayName(getMemberProfile(settlement.lastEditedBy))} at ${formatTimestamp(settlement.lastEditedAt)}`;

  const actions = document.createElement("div");
  actions.className = "expense-actions";
  if (isSettlementParty(settlement, state.user?.uid)) {
    const deleteButton = document.createElement("button");
    deleteButton.className = "small-btn danger";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteExpense(settlement.id));
    actions.append(deleteButton);
  }

  card.append(header, meta, edited, actions);
  return card;
}

function selectTrip(tripId) {
  if (!tripId) return;
  state.selectedTripId = tripId;
  state.expenses = [];
  subscribeToExpenses();
  loadMemberProfiles().then(render);
  render();
}

function setActiveTab(tabName) {
  state.activeTab = tabName;

  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("is-hidden", panel.dataset.panel !== tabName);
  });

  document.querySelectorAll(".bottom-tab, .dashboard-tab").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tab === tabName);
  });
}

function openTripModal() {
  els.tripForm.reset();
  hideTripError();
  clearTripValidation();
  els.currencyInput.value = "GBP";
  els.tripModal.classList.remove("is-hidden");
  window.setTimeout(() => els.tripNameInput.focus(), 0);
}

function closeTripModal() {
  els.tripModal.classList.add("is-hidden");
}

function openExpenseModal(expense = null) {
  const trip = getSelectedTrip();
  if (!trip) return;

  state.editingExpenseId = expense?.id || null;
  state.editingExpenseLastEditedMillis = expense ? getTimestampMillis(expense.lastEditedAt) : null;
  state.expenseSplitMode = expense?.splitMode || "equal";

  els.expenseForm.reset();
  hideExpenseError();
  els.expenseModalTitle.textContent = expense ? "Edit expense" : "Add expense";
  els.expenseDescriptionInput.value = expense?.description || "";
  els.expenseDateInput.value = expense?.date || new Date().toISOString().slice(0, 10);
  els.expenseAmountInput.value = expense?.amount || "";
  els.expenseCurrencyInput.value = expense?.originalCurrency || trip.baseCurrency || "GBP";
  els.includePayerInput.checked = expense ? Boolean(expense.splits?.[expense.paidBy]) : true;

  renderMemberInputs(expense);
  setExpenseSplitMode(state.expenseSplitMode);
  els.expenseModal.classList.remove("is-hidden");
  window.setTimeout(() => els.expenseDescriptionInput.focus(), 0);
}

function closeExpenseModal() {
  els.expenseModal.classList.add("is-hidden");
  state.editingExpenseId = null;
  state.editingExpenseLastEditedMillis = null;
}

function renderMemberInputs(expense = null) {
  const trip = getSelectedTrip();
  const memberUids = trip?.memberUids || [];

  els.expensePaidByInput.innerHTML = "";
  memberUids.forEach((uid) => {
    const profile = getMemberProfile(uid);
    const option = document.createElement("option");
    option.value = uid;
    option.textContent = displayName(profile);
    option.selected = expense ? expense.paidBy === uid : uid === state.user?.uid;
    els.expensePaidByInput.append(option);
  });

  els.participantList.innerHTML = "";
  const selectedUids = expense ? Object.keys(expense.splits || {}) : memberUids;

  memberUids.forEach((uid) => {
    const profile = getMemberProfile(uid);
    const label = document.createElement("label");
    label.className = "member-option";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = uid;
    checkbox.checked = selectedUids.includes(uid);
    checkbox.addEventListener("change", () => {
      syncPayerParticipant();
      renderCustomShareInputs(expense);
    });

    const avatar = createAvatar(profile, "participant-avatar");
    const copy = document.createElement("div");
    copy.className = "member-copy";
    const nameEl = document.createElement("span");
    nameEl.className = "member-name";
    nameEl.textContent = displayName(profile);
    const email = document.createElement("span");
    email.className = "member-email";
    email.textContent = profile.email || "";
    copy.append(nameEl, email);

    label.append(checkbox, avatar, copy);
    els.participantList.append(label);
  });

  syncPayerParticipant();
  renderCustomShareInputs(expense);
}

function syncPayerParticipant() {
  els.participantList.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
    checkbox.disabled = false;
    checkbox.closest(".member-option")?.removeAttribute("aria-disabled");
  });

  const payerUid = els.expensePaidByInput.value;
  const payerCheckbox = participantCheckbox(payerUid);
  const payerOption = payerCheckbox?.closest(".member-option");

  if (payerCheckbox && els.includePayerInput.checked) {
    payerCheckbox.checked = true;
    payerCheckbox.disabled = true;
    payerOption?.setAttribute("aria-disabled", "true");
  } else if (payerCheckbox) {
    payerCheckbox.disabled = false;
    payerOption?.removeAttribute("aria-disabled");
  }

  renderCustomShareInputs();
  updateCustomSplitTotal();
}

function setExpenseSplitMode(mode) {
  state.expenseSplitMode = mode;
  els.equalSplitBtn.classList.toggle("is-active", mode === "equal");
  els.customSplitBtn.classList.toggle("is-active", mode === "custom");
  els.customSplitPanel.classList.toggle("is-hidden", mode !== "custom");
  renderCustomShareInputs();
  updateCustomSplitTotal();
}

function renderCustomShareInputs(expense = null) {
  const previousValues = {};
  els.customSplitList.querySelectorAll("[data-custom-share]").forEach((input) => {
    previousValues[input.dataset.customShare] = input.value;
  });

  els.customSplitList.innerHTML = "";
  getSelectedParticipants().forEach((uid) => {
    const profile = getMemberProfile(uid);
    const row = document.createElement("label");
    row.className = "custom-share-row";

    const label = document.createElement("span");
    label.className = "member-name";
    label.textContent = displayName(profile);

    const input = document.createElement("input");
    input.className = "text-input";
    input.type = "number";
    input.min = "0";
    input.step = "0.01";
    input.dataset.customShare = uid;
    input.value = previousValues[uid] || customOriginalShareValue(expense, uid);
    input.addEventListener("input", updateCustomSplitTotal);

    row.append(label, input);
    els.customSplitList.append(row);
  });
}

function customOriginalShareValue(expense, uid) {
  if (!expense || expense.splitMode !== "custom" || !expense.splits?.[uid]) return "";

  if (expense.originalCurrency === getSelectedTrip()?.baseCurrency) {
    return expense.splits[uid];
  }

  return roundMoney(expense.splits[uid] * expense.rateUsed);
}

function updateCustomSplitTotal() {
  const amount = roundMoney(Number(els.expenseAmountInput.value || 0));
  const running = Array.from(els.customSplitList.querySelectorAll("[data-custom-share]")).reduce(
    (sum, input) => sum + toCents(Number(input.value || 0)),
    0
  );
  const matches = running === toCents(amount);
  els.customSplitTotal.textContent = `${formatMoney(fromCents(running))} / ${formatMoney(amount)}`;
  els.customSplitTotal.classList.toggle("is-mismatch", !matches && running > 0);
}

async function copyCurrentInviteLink() {
  const trip = getSelectedTrip();
  if (!trip) return;

  const inviteUrl = getInviteUrl(trip.id);

  try {
    await navigator.clipboard.writeText(inviteUrl);
    showToast("Invite link copied.");
  } catch (error) {
    els.inviteLink.select();
    document.execCommand("copy");
    showToast("Invite link copied.");
  }
}

function exportTripCsv() {
  const trip = getSelectedTrip();
  if (!trip) return;

  const columns = [
    "date",
    "description",
    "paid by",
    "original amount",
    "original currency",
    "rate used",
    "converted amount",
    "split mode",
    "participants",
    "settlement type"
  ];

  const rows = state.expenses.map((entry) => {
    const payerUid = entry.isSettlement ? entry.payer || entry.paidBy : entry.paidBy;
    const participants = entry.isSettlement
      ? [entry.payer || entry.paidBy, entry.recipient].filter(Boolean)
      : Object.keys(entry.splits || {});

    return [
      entry.date || "",
      entry.description || "",
      displayName(getMemberProfile(payerUid)),
      formatMoney(entry.amount || 0),
      entry.originalCurrency || trip.baseCurrency || "",
      entry.rateUsed ?? "",
      formatMoney(entry.convertedAmount || 0),
      entry.splitMode || "",
      participants.map((uid) => displayName(getMemberProfile(uid))).join("; "),
      entry.isSettlement ? entry.settlementType || "settlement" : ""
    ];
  });

  const csv = [columns, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slugify(trip.name || "trip")}-expenses.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("CSV exported.");
}

async function copyBalanceSummary() {
  const trip = getSelectedTrip();
  if (!trip) return;

  const { debts } = getCurrentBalanceResult();
  const baseCurrency = trip.baseCurrency || "GBP";
  const text = debts.length
    ? debts
        .map(
          (debt) =>
            `${displayName(getMemberProfile(debt.debtorUid))} owes ${displayName(getMemberProfile(debt.creditorUid))}: ${formatMoney(debt.amount)} ${baseCurrency}`
        )
        .join("\n")
    : "Everyone is settled up.";

  try {
    await navigator.clipboard.writeText(text);
    showToast("Balance summary copied.");
  } catch (error) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    showToast("Balance summary copied.");
  }
}

function csvCell(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function slugify(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "trip";
}

function getSelectedParticipants() {
  return Array.from(els.participantList.querySelectorAll("input[type='checkbox']:checked")).map((input) => input.value);
}

function participantCheckbox(uid) {
  return els.participantList.querySelector(`input[value="${cssEscape(uid)}"]`);
}

function getSelectedTrip() {
  return state.trips.find((trip) => trip.id === state.selectedTripId) || null;
}

function getInviteUrl(tripId) {
  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set("tripId", tripId);
  return url.toString();
}

function getCreatedMillis(trip) {
  if (trip.createdAt?.toMillis) return trip.createdAt.toMillis();
  return 0;
}

function clearInviteParam() {
  const url = new URL(window.location.href);
  url.searchParams.delete("tripId");
  window.history.replaceState({}, document.title, url.toString());
}

function showLanding() {
  els.landing.classList.remove("is-hidden");
  els.app.classList.add("is-hidden");
}

function showApp(user) {
  els.landing.classList.add("is-hidden");
  els.app.classList.remove("is-hidden");
  const photo = user.photoURL || "";
  const alt = user.displayName ? `${user.displayName} profile photo` : "Profile photo";
  const name = user.displayName || "Signed-in user";
  const email = user.email || "";
  els.userPhoto.src = photo;
  els.userPhoto.alt = alt;
  els.userName.textContent = name;
  els.userEmail.textContent = email;
  els.mobileUserPhoto.src = photo;
  els.mobileUserPhoto.alt = alt;
  els.mobileUserName.textContent = name;
  els.mobileUserEmail.textContent = email;
}

function getMemberProfile(uid) {
  return state.memberProfiles[uid] || fallbackProfile(uid);
}

function userProfileFromAuth(user) {
  return {
    uid: user.uid,
    displayName: user.displayName || "",
    email: user.email || "",
    photoURL: user.photoURL || ""
  };
}

function fallbackProfile(uid) {
  return {
    uid,
    displayName: uid === state.user?.uid ? state.user.displayName || "You" : "Trip member",
    email: uid === state.user?.uid ? state.user.email || "" : "",
    photoURL: uid === state.user?.uid ? state.user.photoURL || "" : ""
  };
}

function displayName(profile) {
  return profile?.displayName || profile?.email || "Trip member";
}

function createAvatar(profile, className) {
  const img = document.createElement("img");
  img.className = className;
  img.alt = "";
  img.src =
    profile?.photoURL ||
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='32' fill='%23dfe8e4'/%3E%3Ccircle cx='32' cy='26' r='12' fill='%2392a19b'/%3E%3Cpath d='M14 58c3-11 12-18 18-18s15 7 18 18' fill='%2392a19b'/%3E%3C/svg%3E";
  return img;
}

function formatMoney(value) {
  return Number(value || 0).toFixed(2);
}

function formatSignedMoney(value) {
  const cents = toCents(value);
  if (cents === 0) return "0.00";
  return `${cents > 0 ? "+" : "-"}${formatMoney(Math.abs(value))}`;
}

function formatRate(value) {
  return Number(value || 0).toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
}

function formatDate(value) {
  if (!value) return "No date";
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function dateStringFromTimestamp(timestamp) {
  const date = timestamp?.toDate ? timestamp.toDate() : new Date();
  return date.toISOString().slice(0, 10);
}

function formatTimestamp(timestamp) {
  const date = timestamp?.toDate ? timestamp.toDate() : null;
  if (!date) return "just now";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function getTimestampMillis(timestamp) {
  if (!timestamp) return null;
  if (timestamp.toMillis) return timestamp.toMillis();
  if (timestamp.toDate) return timestamp.toDate().getTime();
  return null;
}

function toCents(value) {
  return Math.round(Number(value || 0) * 100);
}

function fromCents(cents) {
  return roundMoney(cents / 100);
}

function roundMoney(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function cssEscape(value) {
  if (window.CSS?.escape) return window.CSS.escape(value);
  return String(value).replace(/"/g, '\\"');
}

function showExpenseError(message) {
  els.expenseFormError.textContent = message;
  els.expenseFormError.classList.remove("is-hidden");
}

function hideExpenseError() {
  els.expenseFormError.textContent = "";
  els.expenseFormError.classList.add("is-hidden");
}

function showTripError(message) {
  els.tripFormError.textContent = message;
  els.tripFormError.classList.remove("is-hidden");
}

function hideTripError() {
  els.tripFormError.textContent = "";
  els.tripFormError.classList.add("is-hidden");
}

function markInvalid(input) {
  input?.classList.add("is-invalid");
}

function clearTripValidation() {
  [els.tripNameInput, els.currencyInput].forEach((input) => input?.classList.remove("is-invalid"));
}

function clearExpenseValidation() {
  [
    els.expenseDescriptionInput,
    els.expenseDateInput,
    els.expenseAmountInput,
    els.expenseCurrencyInput,
    els.expensePaidByInput
  ].forEach((input) => input?.classList.remove("is-invalid"));

  els.customSplitList?.querySelectorAll(".is-invalid").forEach((input) => input.classList.remove("is-invalid"));
}

function showSettlementError(message) {
  els.settlementFormError.textContent = message;
  els.settlementFormError.classList.remove("is-hidden");
}

function hideSettlementError() {
  els.settlementFormError.textContent = "";
  els.settlementFormError.classList.add("is-hidden");
}

function clearSettlementValidation() {
  els.settlementAmountInput?.classList.remove("is-invalid");
}

let toastTimer = null;

function showToast(message) {
  window.clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.remove("is-hidden");
  toastTimer = window.setTimeout(() => els.toast.classList.add("is-hidden"), 3200);
}
