# Content is synced at build time

This repository does not store real site content.

`src/content/` is populated automatically during development and CI by copying from a separate private content repository (and/or local fixtures). It is intentionally empty in git.

If you are developing locally, run the sync script or use the default dev command which syncs fixtures.

Do not commit articles or other content to this folder.