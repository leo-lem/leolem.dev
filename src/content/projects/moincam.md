---
title: MoinCam – Remote-Controlled Livestream from the Elbe
tags: ["IoT", "Raspberry Pi", "Node.js", "React", "DevOps"]
---


This project involved building a mobile livestream camera system for the Hamburg office, offering a live view of the Elbe river to the company’s internal network. The setup included a Raspberry Pi with a camera module mounted on servos, enclosed in a 3D-printed case and placed on a tripod. In addition to the live video stream, the system fetched real-time ship data from public maritime APIs and displayed it in the UI.

The frontend is a React web app hosted on the Raspberry Pi and served via NGINX. It features a central livestream view and an interactive overlay. Users can request control of the camera and are queued server-side to avoid conflicts. When first in queue, they can pan the camera using UI controls overlaid on the stream. Queue status is updated continuously, and sessions expire after 120 seconds or when released. A dark mode toggle enables switching between light and dark themes.

The backend is a Node.js + TypeScript Express API that manages the queue and directly controls the camera’s servos using the `pigpio` module. It also validates session ownership. The video stream itself is provided by the Motion daemon on port 8081 and reverse proxied by NGINX along with the API. Both the frontend and backend were deployed with GitLab CI pipelines supporting linting, testing, and delivery to the Raspberry Pi.

### My Contributions

1. Designed and assembled the hardware setup: Raspberry Pi, camera module, servos for movement, and a 3D-printed case mounted on a tripod.
2. Developed an API to control the camera over the network. Started in Python but transitioned to Node.js with TypeScript for better maintainability.
3. Introduced a queueing mechanism to handle concurrent access cleanly and ensure a smooth user experience.
4. Built a frontend web app using React, initially prototyped in plain HTML.
5. Configured hosting on the Raspberry Pi via NGINX with reverse proxy, local DNS routing, and HTTPS encryption.
6. Set up CI/CD pipelines in GitLab for both the frontend and backend (build, lint, test, and deploy to the Pi).