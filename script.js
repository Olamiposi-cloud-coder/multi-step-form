"use strict";

const nextStep = document.querySelector(".next-step");
const prevStep = document.querySelector(".prev-step"); // Fix typo here
const steps = document.querySelectorAll(".stp");
const circleSteps = document.querySelectorAll(".step");
const formInput = document.querySelectorAll(".step-1 form input");
const plans = document.querySelectorAll(".plan-card");
const switcher = document.querySelector(".switch");
const addons = document.querySelectorAll(".box");
const total = document.querySelector(".total b");
const planPrice = document.querySelector(".plan-price");
const globalPlansName = document.querySelector(".plan-name"); // Rename to avoid conflict
const selectedPlan = document.querySelector(".selected");

let currentStep = 1;
let currentStepCount = 0;

const detailsObject = {
  plan: null,
  kind: null,
  price: null,
};

prevStep.addEventListener("click", function () {
  // Move event listener attachment here
  if (currentStep > 1) {
    document.querySelector(`.step-${currentStep}`).style.display = "none";
    currentStep--;
    document.querySelector(`.step-${currentStep}`).style.display = "flex";
    circleSteps[currentStepCount].classList.remove("active");
    currentStepCount--;
  }
});

nextStep.addEventListener("click", function () {
  document.querySelector(`.step-${currentStep}`).style.display = "none";
  if (currentStep < steps.length && formValidation()) {
    // Add parentheses to function call
    currentStep++;
    currentStepCount++;
    setTotal();
  }
  document.querySelector(`.step-${currentStep}`).style.display = "flex";
  circleSteps[currentStepCount].classList.add("active");
  summary(detailsObject);
});

const summary = function (obj) {
  planPrice.textContent = `${obj.price}`;
  globalPlansName.textContent = `${obj.plan} (${
    obj.kind ? "yearly" : "monthly"
  })`; // Change variable name here
};

const formValidation = function () {
  let valid = true;
  for (let i = 0; i < formInput.length; i++) {
    if (!formInput[i].value) {
      valid = false;
      formInput[i].classList.add("err");
      label(formInput[i]).nextElementSibling.style.display = "flex";
    } else {
      valid = true;
      formInput[i].classList.remove("err");
      label(formInput[i]).nextElementSibling.style.display = "none";
    }
  }
  return valid;
};

const label = function (e) {
  const identity = e.id;
  const labels = document.getElementsByTagName("label");
  for (let i = 0; i < labels.length; i++) {
    if (labels[i].htmlFor == identity) return labels[i];
  }
};

plans.forEach(function (plan) {
  // Rename variable to avoid conflict
  plan.addEventListener("click", function () {
    selectedPlan.classList.remove("selected");
    plan.classList.add("selected");
    const planName = plan.querySelector("b"); // Rename variable to avoid conflict
    const planPrice = plan.querySelector(".plan-priced"); // Rename variable to avoid conflict

    detailsObject.plan = planName.textContent; // Access textContent of the element
    detailsObject.price = planPrice.textContent; // Access textContent of the element
  });
});

switcher.addEventListener("click", function () {
  const value = switcher.querySelector("input").checked;
  if (value) {
    document.querySelector(".monthly").classList.remove("sw-active");
    document.querySelector(".yearly").classList.add("sw-active");
  }
  switchPrices(value);
  detailsObject.kind = value;
});

addons.forEach(function (addon) {
  addon.addEventListener("click", function (e) {
    const selectAddon = addon.querySelector("input");
    const id = addon.getAttribute("data-id");
    if (selectAddon.checked) {
      selectAddon.checked = false;
      addon.classList.remove("ad-selected");
      showAddons(id, false); // Pass id instead of ad
    } else {
      selectAddon.checked = true;
      addon.classList.add("ad-selected"); // Fix typo in class name
      showAddons(id, true); // Pass id instead of ad
      e.preventDefault();
    }
  });
});

const switchPrices = function (checked) {
  const yearlyPrices = [90, 120, 150]; // Fix syntax here
  const monthlyPrices = [9, 12, 15]; // Fix syntax here
  const prices = document.querySelectorAll(".plan-priced");
  if (checked) {
    prices[0].innerHTML = `$${yearlyPrices[0]}/yr`;
    prices[1].innerHTML = `$${yearlyPrices[1]}/yr`;
    prices[2].innerHTML = `$${yearlyPrices[2]}/yr`;
    setTime(true);
  } else {
    prices[0].innerHTML = `$${monthlyPrices[0]}/mo`; // Fix assignment here
    prices[1].innerHTML = `$${monthlyPrices[1]}/mo`; // Fix assignment here
    prices[2].innerHTML = `$${monthlyPrices[2]}/mo`; // Fix assignment here
    setTime(false);
  }
};

const showAddons = function (id, value) {
  const template = document.getElementsByTagName("template")[0];
  const clone = template.content.cloneNode(true);
  const serviceName = clone.querySelector(".service-name");
  const servicePrice = clone.querySelector(".service-price");
  const serviceId = clone.querySelector(".service-addon");

  if (id && value) {
    // Use id instead of ad
    const addon = document.querySelector(`.box[data-id="${id}"]`); // Find the corresponding addon
    serviceName.innerText = addon.querySelector("label").innerText;
    servicePrice.innerText = addon.querySelector(".price").innerText;
    serviceId.setAttribute("data-id", id); // Use id instead of ad
    document.querySelector(".addons").appendChild(clone);
  } else {
    const addons = document.querySelectorAll(".selected-addons");
    addons.forEach(function (addon) {
      const attribute = addon.getAttribute("data-id");
      if (attribute === id) {
        addon.remove();
      }
    });
  }
};

const setTotal = function () {
  const string = planPrice.innerHTML;
  const result = string.replace(/\D/g, "");
  const addonPrices = document.querySelectorAll(
    ".selected-addon .service-price"
  );

  let value = 0;
  for (let i = 0; i < addonPrices.length; i++) {
    const string = addonPrices[i].innerHTML;
    const result = string.replace(/\D/g, "");

    value += Number(result);
  }

  total.innerHTML = `$${value + Number(result)}/${time ? "yr" : "mo"}`;
};

let time = true; // Initialize time variable

const setTime = (t) => {
  return (time = t);
};
