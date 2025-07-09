document.addEventListener("DOMContentLoaded", () => {
  // Config
  const hoverDelay = 200; // ms before moving avatar
  const resetInterval = 3000; // ms to reset avatar after move
  const confettiCount = 100; // number of confetti pieces

  // Elements and state
  const avatar = document.getElementById("draggable-avatar");
  const img = avatar.querySelector("img");
  const originalX = avatar.offsetLeft;
  const originalY = avatar.offsetTop;
  let timerId = null;
  let isFullscreen = false;
  let fullscreenTimerId = null;
  let hoverTimer = null;

  function moveToRandomPosition() {
    if (isFullscreen) return;

    const avatarRect = avatar.getBoundingClientRect();
    const maxX = window.innerWidth - avatarRect.width;
    const maxY = window.innerHeight - avatarRect.height;

    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    avatar.style.transform = `translate(${randomX - originalX}px, ${randomY - originalY}px)`;

    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(resetAvatarPosition, resetInterval);
  }

  function resetAvatarPosition() {
    avatar.style.transition = "transform 1s cubic-bezier(0.68, -0.55, 0.27, 1.55)";
    avatar.style.transform = "translate(0, 0)";
    timerId = null;

    setTimeout(() => {
      avatar.style.transition = "transform 0.5s ease";
    }, 1000);
  }

  function simpleConfetti() {
    for (let i = 0; i < confettiCount; i++) {
      const confetto = document.createElement("div");
      confetto.style.position = "fixed";
      confetto.style.width = "6px";
      confetto.style.height = "6px";
      confetto.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
      confetto.style.left = Math.random() * window.innerWidth + "px";
      confetto.style.top = "-10px";
      confetto.style.opacity = "0.8";
      confetto.style.borderRadius = "50%";
      confetto.style.pointerEvents = "none";
      confetto.style.zIndex = "9999";
      document.body.appendChild(confetto);

      const fall = confetto.animate(
        [
          { transform: "translateY(0px) rotate(0deg)" },
          { transform: `translateY(${window.innerHeight + 20}px) rotate(${Math.random() * 720}deg)` }
        ],
        {
          duration: 2000 + Math.random() * 1000,
          easing: "ease-out",
          fill: "forwards"
        }
      );

      fall.onfinish = () => confetto.remove();
    }
  }

  function toggleFullscreen() {
    if (!isFullscreen) {
      isFullscreen = true;
      simpleConfetti();

      Object.assign(avatar.style, {
        position: "fixed",
        top: "50%",
        left: "50%",
        width: "50vmin",
        height: "50vmin",
        transform: "translate(-50%, -50%)",
        transition: "all 0.5s ease",
        zIndex: "9999",
        borderRadius: "50%"
      });

      Object.assign(img.style, {
        width: "100%",
        height: "100%",
        objectFit: "cover"
      });

      fullscreenTimerId = setTimeout(toggleFullscreen, resetInterval);
    } else {
      isFullscreen = false;
      if (fullscreenTimerId) clearTimeout(fullscreenTimerId);

      Object.assign(avatar.style, {
        position: "fixed",
        top: originalY + "px",
        left: originalX + "px",
        width: "",
        height: "",
        transition: "transform 0.5s ease",
        zIndex: "",
        borderRadius: "50%",
        transform: "translate(0,0)"
      });

      Object.assign(img.style, {
        width: "40px",
        height: "40px",
        objectFit: "cover"
      });
    }
  }

  // Event listeners
  avatar.addEventListener("mouseenter", () => {
    if (hoverTimer) clearTimeout(hoverTimer);
    hoverTimer = setTimeout(moveToRandomPosition, hoverDelay);
  });

  avatar.addEventListener("click", toggleFullscreen);
});