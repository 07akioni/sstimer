import { createTimer } from "../src";

const timer = createTimer(
  () => {
    alert("Stop");
  },
  {
    duration: 5000,
  }
);

document.querySelector("button")?.addEventListener("click", () => {
  if (timer.active) {
    timer.stop();
  } else {
    timer.start();
  }
});
