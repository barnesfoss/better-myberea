window.be_patches = [
  {
    key: "betterAppImages",
    name: "Better App Images",
    description: "Makes the logins section's icons match better with themes.",
    author: "Kameron Barnes",
    reference: window.betterAppImages,
  },
];

chrome.storage.local.get(
  window.be_patches.reduce((acc, p) => ((acc[p.key] = false), acc), {}),
  (saved) => {
    window.be_patches.forEach((p) => {
      if (saved[p.key] && p.reference.init) p.reference.init();
    });
  },
);
