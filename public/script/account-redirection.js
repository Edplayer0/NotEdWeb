"use strict";

const counter = document.getElementById("counter");

const count = () => {
  counter.textContent -= 1;
}

setInterval(count, 1000);

const redirect = () => {
  window.location.href = process.env.URL + "/login";

}

setTimeout(redirect, parseInt(counter.textContent) * 1000);
