
import { useEffect, useRef } from "react";

import "./ShinchanAnimation.css";

export default function ShinchanAnimation() {
  const trackRef = useRef(null);
  const characterRef = useRef(null);
  const coinRefs = useRef([]);

  useEffect(() => {
    const track = trackRef.current;
    const character = characterRef.current;

    if (!track || !character) return;

    let animationId;
    let lastTime = 0;
    let characterX = 0;
    let coins = [];

    const setupCoins = () => {
      const width = track.clientWidth;

      coins = coinRefs.current.map((element, index) => ({
        element,
        x: width + 30 + (index * 55) + (Math.floor(index / 3) * 35),
        collected: false,
      }));
    };

    setupCoins();

    const animate = (time) => {
      const delta = lastTime
        ? Math.min((time - lastTime) / 1000, 0.04)
        : 0;

      lastTime = time;

      const width = track.clientWidth;
      const characterWidth = character.offsetWidth;

      // Shinchan walks from left to right
      characterX += 65 * delta;

      if (characterX >= width - characterWidth) {
        characterX = 0;
      }

      character.style.left = `${characterX}px`;

      // Coins continuously move from right to left
      coins.forEach((coin) => {
        if (coin.collected) return;

        coin.x -= 150 * delta;

        const coinCenter = coin.x + 15;
        const characterFront = characterX + characterWidth * 0.8;

        // Collect each coin when Shinchan reaches it
        if (
          coinCenter >= characterX &&
          coinCenter <= characterFront
        ) {
          coin.collected = true;
          coin.element.style.opacity = "0";
          coin.element.style.transform = "scale(0)";
          return;
        }

        // Send the coin back to the right for another round
        if (coin.x < -40) {
          const otherCoins = coins
            .filter((item) => item !== coin)
            .map((item) => item.x);

          coin.x = Math.max(width, ...otherCoins) + 55;
          coin.collected = false;
          coin.element.style.opacity = "1";
          coin.element.style.transform = "scale(1)";
        }

        coin.element.style.left = `${coin.x}px`;
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="shinchan-runner" ref={trackRef}>
      <img
        ref={characterRef}
        className="shinchan-character"
        src="/images/shinchan-run-cycle.gif"
        alt=""
      />

      {Array.from({ length: 8 }, (_, index) => (
        <span
          className="moving-coin"
          key={index}
          ref={(element) => {
            coinRefs.current[index] = element;
          }}
        >
          ₹
        </span>
      ))}
    </div>
  );
}
