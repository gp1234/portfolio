import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

const attributes = document.querySelectorAll(".attributes-elements");

const hero = gsap.to(".word", { opacity: 1, duration: 1, stagger: 1 });
const mainTimeline = gsap.timeline();
const attributesTimeline = gsap.timeline({ repeat: -1 });

mainTimeline.add(hero);
for (let i = 0; i < attributes.length; i++) {
  const split = new SplitText(attributes[i], {
    type: "words,chars",
    preserveSpaces: true,
  });
  const individualWordTimeline = gsap.timeline();
  individualWordTimeline.from(split.chars, {
    y: "-100%",
    opacity: 0,
    stagger: 0.05,
  });
  individualWordTimeline.to(split.chars, {
    y: "100%",
    opacity: 0,
    stagger: 0.05,
  });
  individualWordTimeline.duration(3);
  attributesTimeline.add(individualWordTimeline);
}
mainTimeline.add(attributesTimeline);
