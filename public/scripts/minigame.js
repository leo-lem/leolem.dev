document.addEventListener("DOMContentLoaded", () => {
  const delay = 50; // ms before moving avatar
  const timeout = 2500; // ms to reset avatar after move
  const confetti = 50; // number of confetti pieces
  const isMobile = window.innerWidth < 640;

  // Elements and state
  const avatar = document.getElementById("draggable-avatar");
  const img = avatar.querySelector("img");
  const originalX = avatar.offsetLeft;
  const originalY = avatar.offsetTop;

  let timerId = null;
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
    timerId = setTimeout(resetAvatarPosition, timeout);
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
    for (let i = 0; i < confetti; i++) {
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

  let isFullscreen = false;
  let fullscreenTimerId = null;
  function toggleFullscreen() {
    if (isMobile) return;
    isFullscreen = !isFullscreen;

    Object.assign(avatar.style, {
      position: "fixed",
      top: isFullscreen ? "50%" : originalY + "px",
      left: isFullscreen ? "50%" : originalX + "px",
      width: isFullscreen ? "50vmin" : "",
      height: isFullscreen ? "50vmin" : "",
      transform: isFullscreen ? "translate(-50%, -50%)" : "translate(0, 0)",
      transition: "all 0.5s ease",
      zIndex: isFullscreen ? "9999" : "",
      borderRadius: "50%"
    });

    Object.assign(img.style, {
      width: isFullscreen ? "100%" : "40px",
      height: isFullscreen ? "100%" : "40px",
      objectFit: "cover"
    });

    if (isFullscreen) {
      fullscreenTimerId = setTimeout(toggleFullscreen, timeout);
      simpleConfetti();
    } else clearTimeout(fullscreenTimerId);
  }

  avatar.addEventListener("touchstart", () => {
    if (hoverTimer) clearTimeout(hoverTimer);
    hoverTimer = setTimeout(moveToRandomPosition, delay);
  });
  avatar.addEventListener("mouseenter", () => {
    if (hoverTimer) clearTimeout(hoverTimer);
    hoverTimer = setTimeout(moveToRandomPosition, delay);
  });
  avatar.addEventListener("click", toggleFullscreen);
});