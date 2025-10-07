const isExtensionContext = typeof chrome !== "undefined" && chrome.storage;

export const loadData = async () => {
  return new Promise((resolve) => {
    if (isExtensionContext) {
      chrome.storage.sync.get(null, resolve);
    } else {
      // Dev fallback: localStorage (stringify/parse for sync simulation)
      const stored = localStorage.getItem("unidashData");
      resolve(stored ? JSON.parse(stored) : {});
    }
  });
};

export const saveData = (data) => {
  if (isExtensionContext) {
    chrome.storage.sync.set(data);
  } else {
    // Dev fallback
    localStorage.setItem("unidashData", JSON.stringify(data));
  }
};
