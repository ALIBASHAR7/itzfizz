// "use client";

// import { useLayoutEffect, useRef } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// const STATS = [
//   { value: 58, label: "Increase in pick up point use" },
//   { value: 23, label: "Decrease in customer phone calls" },
//   { value: 27, label: "Increase in pick up point use" },
//   { value: 40, label: "Decrease in customer phone calls" },
// ];

// const TITLE = "WELCOME ITZFIZZ".split("");

// export default function Hero() {
//   const root = useRef<HTMLDivElement>(null);

//   useLayoutEffect(() => {
//     const ctx = gsap.context(() => {
//       const mm = gsap.matchMedia();

//       mm.add("(prefers-reduced-motion: no-preference)", () => {
//         // ---- Intro (time-based, runs once) ----
//         gsap.set(".car", { yPercent: -50 });
//         gsap.set(".cards", { clipPath: "inset(0 100% 0 0)" });
//         const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
//         intro
//           .from(".char", { y: 40, opacity: 0, duration: 0.9, stagger: 0.04 })
//           .from(".car", { opacity: 0, duration: 1.1 }, "-=1");

//         // ---- Scroll (progress-based, smoothed via scrub) ----
//         const scrollTl = gsap
//           .timeline({
//             scrollTrigger: {
//               trigger: ".hero",
//               start: "top top",
//               end: "+=150%",
//               pin: true,
//               scrub: 1, // 1s of catch-up = eased, fluid motion
//               invalidateOnRefresh: true,
//             },
//           })
//           .to(".car", { x: () => window.innerWidth * 0.95, ease: "none" }, 0)
//           .to(".title", { y: -60, opacity: 0.15, ease: "none" }, 0);

//         // cards are uncovered exactly where the car has been (wipe follows car centre)
//         const car = root.current!.querySelector<HTMLElement>(".car")!;
//         scrollTl.eventCallback("onUpdate", () => {
//           const W = window.innerWidth;
//           const edge = 0.04 * W + (gsap.getProperty(car, "x") as number) + car.offsetWidth / 2;
//           gsap.set(".cards", { clipPath: `inset(0 ${Math.max(0, 100 - (edge / W) * 100)}% 0 0)` });
//         });
//       });
//     }, root);

//     return () => ctx.revert();
//   }, []);

//   return (
//     <div ref={root}>
//       <section className="hero relative h-screen overflow-hidden bg-neutral-950 text-white">
//         <h1 className="title absolute inset-x-0 top-[12vh] flex justify-center px-4 text-[clamp(1.5rem,5vw,4.5rem)] font-light">
//           {TITLE.map((c, i) => (
//             <span key={i} className="char inline-block will-change-transform">
//               {c === " " ? "\u00A0\u00A0" : c}
//               <span className="inline-block w-[0.35em]" />
//             </span>
//           ))}
//         </h1>

//         {/* Road */}
//         <div className="absolute inset-x-0 top-1/2 h-[min(14rem,30vh)] -translate-y-1/2 border-y border-white/10 bg-neutral-900" />

//         {/* Car (place top-view PNG at /public/car.png) */}
//         {/* eslint-disable-next-line @next/next/no-img-element */}
//         <img
//           src="/car.png"
//           alt="Car top view"
//           className="car absolute z-10 left-[4vw] top-1/2 w-[min(24rem,45vw)] will-change-transform"
//         />

//         <ul className="cards absolute inset-x-0 top-1/2 grid -translate-y-1/2 grid-cols-4 gap-2 px-[2vw] md:gap-4">
//           {STATS.map((s, i) => (
//             <li key={i} className="stat flex h-[min(11rem,24vh)] flex-col justify-center rounded-2xl bg-orange-500 p-2 text-neutral-950 will-change-transform md:p-5">
//               <p className="text-2xl font-semibold md:text-5xl">{s.value}%</p>
//               <p className="mt-1 text-[10px] leading-tight text-neutral-900/80 md:text-sm">{s.label}</p>
//             </li>
//           ))}
//         </ul>
//       </section>

//       <section className="grid h-screen place-items-center bg-white text-neutral-900">
//         <p className="text-2xl">Next section</p>
//       </section>
//     </div>
//   );
// }









"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LETTERS = "WELCOME ITZFIZZ".split("");

const BOXES = [
  { value: "58%", text: "Increase in pick up point use", cls: "bg-[#def54f] text-[#111]", pos: { top: "5%", right: "30%" } },
  { value: "23%", text: "Decreased in customer phone calls", cls: "bg-[#6ac9ff] text-[#111]", pos: { bottom: "5%", right: "35%" } },
  { value: "27%", text: "Increase in pick up point use", cls: "bg-[#333] text-white", pos: { top: "5%", right: "10%" } },
  { value: "40%", text: "Decreased in customer phone calls", cls: "bg-[#fa7328] text-[#111]", pos: { bottom: "5%", right: "12.5%" } },
];

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current!;
    const car = el.querySelector<HTMLElement>(".car")!;
    const road = el.querySelector<HTMLElement>(".road")!;
    const valueEl = el.querySelector<HTMLElement>(".value-add")!;
    const letters = gsap.utils.toArray<HTMLElement>(".value-letter", el);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // cached measurements (refreshed by ScrollTrigger on resize/load) -> no layout reads per frame
        let roadW = 0, carW = 0, lefts: number[] = [];
        const shown = letters.map(() => false);
        const measure = () => {
          roadW = road.offsetWidth;
          carW = car.offsetWidth;
          lefts = letters.map((l) => valueEl.offsetLeft + l.offsetLeft);
        };
        measure();
        ScrollTrigger.addEventListener("refresh", measure);

        gsap.set(".trail", { scaleX: 0 });
        gsap.set(letters, { opacity: 0 });
        gsap.set(".box", { opacity: 0, y: 20 });

        // intro (time-based)
        gsap.from(".car", { opacity: 0, duration: 1, ease: "power3.out" });

        // scroll (progress-based, one timeline)
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".section",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            invalidateOnRefresh: true,
          },
          onUpdate: () => {
            const carX = (gsap.getProperty(car, "x") as number) + carW / 2;
            gsap.set(".trail", { scaleX: Math.min(1, Math.max(0, carX / roadW)) });
            letters.forEach((l, i) => {
              const on = carX >= lefts[i];
              if (on !== shown[i]) {
                shown[i] = on;
                l.style.opacity = on ? "1" : "0";
              }
            });
          },
        });

        tl.to(car, { x: () => road.offsetWidth - car.offsetWidth, ease: "none", duration: 1 }, 0);

        // boxes fade in one after another (after the car has crossed most of the road)
        gsap.utils.toArray<HTMLElement>(".box", el).forEach((b, i) => {
          tl.to(b, { opacity: 1, y: 0, ease: "none", duration: 0.12 }, 0.35 + i * 0.15);
        });

        return () => ScrollTrigger.removeEventListener("refresh", measure);
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="bg-[#121212] text-white">
      <section className="section relative h-[300vh]">
        <div className="sticky top-0 flex h-screen w-full items-center justify-center bg-[#d1d1d1]">
          {/* Road */}
          <div className="road relative h-[200px] w-screen overflow-hidden bg-[#1e1e1e]">
            <div className="trail absolute left-0 top-0 z-[1] h-full w-full origin-left bg-[#45db7d]" />

            <div className="value-add absolute left-[5%] top-1/2 z-[5] flex -translate-y-1/2 gap-[0.3rem] text-[clamp(2rem,8vw,8rem)] font-bold leading-none text-[#111]">
              {LETTERS.map((c, i) => (
                <span key={i} className="value-letter">
                  {c === " " ? "\u00A0" : c}
                </span>
              ))}
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/car.png"
              alt="Car top view"
              className="car absolute left-0 top-0 z-10 h-[200px] w-auto max-w-none will-change-transform"
            />
          </div>

          {/* Stat boxes: upper / lower right of the page */}
          {BOXES.map((b) => (
            <div
              key={b.value}
              style={b.pos}
              className={`box absolute z-[5] m-2 flex flex-col items-start justify-center gap-1 rounded-[10px] p-4 text-xs will-change-transform md:m-4 md:p-[30px] md:text-lg ${b.cls}`}
            >
              <span className="text-3xl font-semibold md:text-[58px]">{b.value}</span>
              {b.text}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}