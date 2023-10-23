import "../scss/main.scss";
import { gsap } from "gsap";

const attributes = document.querySelectorAll(".attributes-elements");

const hero = gsap.to(".word", { opacity: 1, duration: 1, stagger: 1 });
const mainTimeline = gsap.timeline();
const attributesTimeline = gsap.timeline({ repeat: -1 });

mainTimeline.add(hero);
for (let i = 0; i < attributes.length; i++) {
  const individualWordTimeline = gsap.timeline();
  individualWordTimeline.from(attributes[i], { y: "-100%", opacity: 0 });
  individualWordTimeline.to(attributes[i], {
    y: "100%",
    opacity: 0,
  });
  individualWordTimeline.duration(2);
  attributesTimeline.add(individualWordTimeline);
}
mainTimeline.add(attributesTimeline);
