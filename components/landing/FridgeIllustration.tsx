"use client";

import type { ReactNode } from "react";

type FridgeIllustrationProps = {
  isFridgeOpen: boolean;
  isFreezerOpen: boolean;
  doorContent?: ReactNode;
  freezerContent?: ReactNode;
};

export function FridgeIllustration({
  isFridgeOpen,
  isFreezerOpen,
  doorContent,
  freezerContent,
}: FridgeIllustrationProps) {
  return (
    <div className="fridge-stage relative mx-auto flex h-[745px] w-full max-w-[620px] items-center justify-center sm:h-[805px]">
      <div className="relative h-[656px] w-[414px] sm:h-[713px] sm:w-[460px]">
        {/* Refrigerator body */}
        <div className="absolute inset-x-1 bottom-0 top-0 rounded-[3rem] border border-line-strong bg-surface shadow-soft">
          {/* Fridge interior */}
          <div className="absolute left-[25px] right-[25px] top-[25px] h-[446px] overflow-hidden rounded-[2rem] border border-line bg-accent-soft sm:h-[488px]">
            <div
              className={[
                "fridge-contents absolute inset-0",
                isFridgeOpen
                  ? "fridge-contents-open"
                  : "",
              ].join(" ")}
            >
              {/* Back wall */}
              <div
                aria-hidden="true"
                className="absolute inset-x-4 bottom-4 top-4 rounded-[1.5rem] border border-white/50"
              />

              {/* Interior light */}
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-4 h-2 w-20 -translate-x-1/2 rounded-full bg-white/80"
              />

              {/* Side shelf rails */}
              <div
                aria-hidden="true"
                className="absolute bottom-[96px] left-5 top-12 w-px bg-accent/15"
              />

              <div
                aria-hidden="true"
                className="absolute bottom-[96px] right-5 top-12 w-px bg-accent/15"
              />

              {/* Top shelf */}
              <div className="absolute left-7 right-7 top-[38px] h-[112px]">
                {/* Milk */}
                <div className="absolute bottom-3 left-3 h-[76px] w-[45px] rounded-[9px] border border-line bg-surface shadow-soft">
                  <div className="absolute -top-[7px] left-[8px] h-[12px] w-[29px] rounded-t-[6px] border border-line bg-surface" />

                  <div className="absolute left-[7px] right-[7px] top-[18px] h-[17px] rounded-[4px] bg-[#edf3f6]" />

                  <div className="absolute bottom-[9px] left-[12px] right-[12px] h-[22px] rounded-[5px] bg-accent-soft" />
                </div>

                {/* Eggs */}
                <div className="absolute bottom-3 left-[76px] h-[39px] w-[92px] rounded-[10px] border border-line bg-[#f3efe5] shadow-soft">
                  <div className="absolute left-[9px] top-[8px] size-[15px] rounded-full bg-surface" />
                  <div className="absolute left-[29px] top-[8px] size-[15px] rounded-full bg-surface" />
                  <div className="absolute left-[49px] top-[8px] size-[15px] rounded-full bg-surface" />
                  <div className="absolute left-[69px] top-[8px] size-[15px] rounded-full bg-surface" />
                </div>

                {/* Yogurt */}
                <div className="absolute bottom-3 right-3 h-[55px] w-[52px] rounded-[10px] border border-line bg-surface shadow-soft">
                  <div className="absolute left-[6px] right-[6px] top-[7px] h-[8px] rounded-full bg-[#edf3f6]" />

                  <div className="absolute bottom-[8px] left-[11px] right-[11px] h-[24px] rounded-[6px] bg-[#f3ece8]" />
                </div>

                {/* Glass shelf */}
                <div
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 right-0 h-[5px] rounded-full border border-line bg-white/75"
                />
              </div>

              {/* Middle shelf */}
              <div className="absolute left-7 right-7 top-[158px] h-[118px]">
                {/* Greens */}
                <div className="absolute bottom-3 left-3 h-[56px] w-[82px] rounded-[11px] border border-line bg-surface/90 shadow-soft">
                  <div className="absolute bottom-[10px] left-[13px] size-[27px] rotate-[-18deg] rounded-full bg-accent/40" />

                  <div className="absolute bottom-[13px] left-[32px] size-[29px] rotate-[14deg] rounded-full bg-accent/50" />

                  <div className="absolute bottom-[10px] right-[10px] size-[23px] rounded-full bg-accent/30" />
                </div>

                {/* Berries */}
                <div className="absolute bottom-3 left-[112px] h-[50px] w-[70px] rounded-[12px] border border-line bg-surface/85 shadow-soft">
                  <div className="absolute bottom-[10px] left-[11px] size-[16px] rounded-full bg-[#c98278]" />
                  <div className="absolute bottom-[16px] left-[26px] size-[17px] rounded-full bg-[#bf746c]" />
                  <div className="absolute bottom-[9px] left-[41px] size-[16px] rounded-full bg-[#c98278]" />
                </div>

                {/* Juice */}
                <div className="absolute bottom-3 right-3 h-[78px] w-[42px] rounded-[10px] border border-line bg-surface shadow-soft">
                  <div className="absolute -top-[5px] left-[11px] h-[9px] w-[20px] rounded-t-[5px] bg-line-strong" />

                  <div className="absolute bottom-[8px] left-[7px] right-[7px] h-[45px] rounded-[6px] bg-warning-soft" />

                  <div className="absolute left-[10px] right-[10px] top-[15px] h-[7px] rounded-full bg-white/75" />
                </div>

                {/* Glass shelf */}
                <div
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 right-0 h-[5px] rounded-full border border-line bg-white/75"
                />
              </div>

              {/* Lower shelf */}
              <div className="absolute left-7 right-7 top-[284px] h-[86px]">
                {/* Leftovers */}
                <div className="absolute bottom-3 left-3 h-[47px] w-[102px] rounded-[10px] border border-line bg-surface shadow-soft">
                  <div className="absolute left-[8px] right-[8px] top-[7px] h-[5px] rounded-full bg-line" />

                  <div className="absolute bottom-[8px] left-[12px] h-[18px] w-[54px] rounded-[5px] bg-[#f5ece8]" />
                </div>

                {/* Cheese */}
                <div className="absolute bottom-3 left-[130px] h-[45px] w-[58px] rotate-[-3deg] rounded-[8px] border border-line bg-[#f3efe5] shadow-soft">
                  <div className="absolute left-[12px] top-[10px] size-[6px] rounded-full bg-warning/20" />

                  <div className="absolute right-[11px] top-[21px] size-[5px] rounded-full bg-warning/20" />
                </div>

                {/* Bottle */}
                <div className="absolute bottom-3 right-3 h-[62px] w-[31px] rounded-[9px] border border-line bg-[#eaf2f3] shadow-soft">
                  <div className="absolute -top-[5px] left-[8px] h-[9px] w-[15px] rounded-t-[4px] bg-line-strong" />

                  <div className="absolute bottom-[9px] left-[6px] right-[6px] h-[27px] rounded-[5px] bg-white/60" />
                </div>

                {/* Glass shelf */}
                <div
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 right-0 h-[5px] rounded-full border border-line bg-white/75"
                />
              </div>

              {/* Crisper drawer */}
              <div className="absolute bottom-6 left-7 right-7 h-[82px] overflow-hidden rounded-[14px] border border-line bg-surface/60">
                <div className="absolute left-1/2 top-[9px] h-[5px] w-[52px] -translate-x-1/2 rounded-full bg-line-strong/70" />

                <div className="absolute bottom-[13px] left-[19px] size-[31px] rounded-full bg-accent/35" />

                <div className="absolute bottom-[12px] left-[46px] h-[29px] w-[38px] rotate-[8deg] rounded-[45%] bg-accent/45" />

                <div className="absolute bottom-[12px] left-[92px] size-[29px] rounded-full bg-warning-soft" />

                <div className="absolute bottom-[13px] right-[61px] h-[27px] w-[41px] rotate-[-8deg] rounded-[45%] bg-accent/30" />

                <div className="absolute bottom-[13px] right-[21px] size-[28px] rounded-full bg-[#c98278]/70" />
              </div>
            </div>
          </div>

          {/* Freezer interior */}
          <div
            aria-hidden="true"
            className={[
              "freezer-cavity absolute bottom-[23px] left-[23px] right-[23px] h-[140px]",
              "overflow-hidden rounded-[1.95rem] border border-line bg-[#e7ece9]",
              "sm:h-[161px]",
              isFreezerOpen
                ? "freezer-cavity-open"
                : "",
            ].join(" ")}
          >
            <div className="absolute inset-x-4 bottom-4 top-4 rounded-[1.35rem] border border-white/60 bg-[#edf2f1]">
              {/* Back basket rail */}
              <div className="absolute left-4 right-4 top-[18px] h-[4px] rounded-full bg-white/90" />

              {/* Frozen vegetables */}
              <div className="absolute bottom-[18px] left-[18px] h-[58px] w-[72px] -rotate-2 rounded-[12px] border border-line bg-[#edf3e8] shadow-soft">
                <div className="absolute left-[11px] top-[11px] size-[14px] rounded-full bg-accent/35" />
                <div className="absolute left-[27px] top-[18px] size-[13px] rounded-full bg-accent/45" />
                <div className="absolute right-[10px] top-[10px] size-[15px] rounded-full bg-accent/30" />

                <div className="absolute bottom-[8px] left-[10px] right-[10px] h-[7px] rounded-full bg-white/70" />
              </div>

              {/* Frozen berries */}
              <div className="absolute bottom-[18px] left-[105px] h-[55px] w-[65px] rotate-2 rounded-[12px] border border-line bg-[#edf3f6] shadow-soft">
                <div className="absolute left-[10px] top-[12px] size-[12px] rounded-full bg-[#899aae]" />
                <div className="absolute left-[25px] top-[18px] size-[13px] rounded-full bg-[#7f91a6]" />
                <div className="absolute right-[9px] top-[10px] size-[12px] rounded-full bg-[#899aae]" />

                <div className="absolute bottom-[8px] left-[10px] right-[10px] h-[7px] rounded-full bg-white/70" />
              </div>

              {/* Frozen protein */}
              <div className="absolute bottom-[18px] right-[75px] h-[52px] w-[72px] rounded-[11px] border border-line bg-surface/85 shadow-soft">
                <div className="absolute bottom-[9px] left-[10px] right-[10px] top-[9px] rounded-[8px] bg-[#f5ece8]" />
              </div>

              {/* Ice cream */}
              <div className="absolute bottom-[18px] right-[17px] h-[65px] w-[46px] rounded-[12px] border border-line bg-surface shadow-soft">
                <div className="absolute left-[6px] right-[6px] top-[8px] h-[8px] rounded-full bg-[#edf3f6]" />

                <div className="absolute bottom-[9px] left-[9px] right-[9px] h-[34px] rounded-[7px] bg-[#f3efe5]" />
              </div>
            </div>
          </div>
        </div>

        {/* Freezer drawer face */}
        <div
          className={[
            "freezer-drawer absolute bottom-[23px] left-[23px] right-[23px] h-[145px]",
            "rounded-[2rem] border border-line-strong bg-surface-subtle shadow-soft",
            "sm:h-[161px]",
            isFreezerOpen
              ? "z-30 freezer-drawer-open"
              : "z-10",
          ].join(" ")}
        >
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-[18px] h-[7px] w-[74px] -translate-x-1/2 rounded-full bg-line-strong"
          />

          <div className="flex h-full flex-col justify-center px-8 pb-5 pt-8">
            {freezerContent}
          </div>
        </div>

        {/* Fridge door */}
        <div
          className={[
            "fridge-door absolute left-[23px] right-[23px] top-[23px] h-[451px]",
            "rounded-[2.1rem] border border-line-strong bg-surface",
            "sm:h-[492px]",
            isFridgeOpen
              ? "z-30 fridge-door-open"
              : "z-20",
          ].join(" ")}
        >
          <div
            aria-hidden="true"
            className="absolute bottom-12 right-6 top-28 w-[9px] rounded-full bg-line-strong"
          />

          <div className="relative flex h-full flex-col px-10 pb-11 pt-11">
            {doorContent}
          </div>
        </div>

        {/* Feet */}
        <div
          aria-hidden="true"
          className="absolute -bottom-2 left-[51px] h-[18px] w-[51px] rounded-b-md bg-line-strong"
        />

        <div
          aria-hidden="true"
          className="absolute -bottom-2 right-[51px] h-[18px] w-[51px] rounded-b-md bg-line-strong"
        />
      </div>

      <style jsx>{`
        .fridge-stage {
          perspective: 1200px;
        }

        .fridge-door {
          transform-origin: left center;
          transform:
            perspective(1200px)
            rotateY(0deg);
          transform-style: preserve-3d;
          backface-visibility: hidden;
          transition:
            transform 1500ms ease-in-out;
          will-change: transform;
        }

        .fridge-door-open {
          transform:
            perspective(1200px)
            rotateY(-82deg);
        }

        .fridge-contents {
          opacity: 0.25;
          transform: translateX(-6px);
          transition:
            opacity 650ms ease 200ms,
            transform 750ms ease 200ms;
        }

        .fridge-contents-open {
          opacity: 1;
          transform: translateX(0);
        }

        .freezer-cavity {
          opacity: 0;
          transform: translateY(4px);
          transition:
            opacity 500ms ease 150ms,
            transform 700ms ease 150ms;
        }

        .freezer-cavity-open {
          opacity: 1;
          transform: translateY(0);
        }

        .freezer-drawer {
          transform:
            translateY(0)
            scale(1);
          transform-origin: center top;
          transition:
            transform 1500ms ease-in-out,
            box-shadow 700ms ease;
          will-change: transform;
        }

        .freezer-drawer-open {
          transform:
            translateY(44px)
            scale(1.045);
          box-shadow:
            0 18px 30px rgb(32 37 31 / 10%),
            0 35px 70px rgb(32 37 31 / 14%);
        }

        @media (prefers-reduced-motion: reduce) {
          .fridge-door {
            transform:
              perspective(1200px)
              rotateY(0deg);
            transition: none;
          }

          .fridge-door-open {
            transform:
              perspective(1200px)
              rotateY(-82deg);
          }

          .fridge-contents {
            opacity: 0.25;
            transform: none;
            transition: none;
          }

          .fridge-contents-open {
            opacity: 1;
          }

          .freezer-cavity,
          .freezer-cavity-open {
            opacity: 1;
            transform: none;
            transition: none;
          }

          .freezer-drawer {
            transition: none;
          }

          .freezer-drawer-open {
            transform:
              translateY(35px)
              scale(1.03);
          }
        }
      `}</style>
    </div>
  );
}
