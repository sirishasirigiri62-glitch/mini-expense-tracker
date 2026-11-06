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
    let nextCoinIndex = 8;

    const coins = coinRefs.current.map((element, index) => ({
      element,
      x: track.clientWidth + 30 + index * 55 +
        Math.floor(index / 3) * 35,
      collected: false,
    }));

    const animate = (time) => {
      const delta = lastTime
        ? Math.min((time - lastTime) / 1000, 0.04)
        : 0;

      lastTime = time;

      const width = track.clientWidth;
      const characterWidth = character.offsetWidth;

      characterX += 65 * delta;

      if (characterX >= width - characterWidth) {
        characterX = 0;
      }

      character.style.left = `${characterX}px`;

      coins.forEach((coin) => {
        coin.x -= 150 * delta;

        coin.element.style.left = `${coin.x}px`;

        if (!coin.collected) {
          const characterRect = character.getBoundingClientRect();
          const coinRect = coin.element.getBoundingClientRect();

          const overlaps =
            characterRect.left < coinRect.right - 5 &&
            characterRect.right > coinRect.left + 5 &&
            characterRect.top < coinRect.bottom &&
            characterRect.bottom > coinRect.top;

          if (overlaps) {
            coin.collected = true;
            coin.element.style.opacity = "0";
            coin.element.style.transform = "scale(0)";
          }
        }

        if (coin.x < -40) {
          const otherCoins = coins
            .filter((item) => item !== coin)
            .map((item) => item.x);

          const gap = nextCoinIndex % 3 === 0 ? 90 : 55;

          coin.x = Math.max(width, ...otherCoins) + gap;
          coin.collected = false;

          coin.element.style.opacity = "1";
          coin.element.style.transform = "scale(1)";
          nextCoinIndex++;
        }
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