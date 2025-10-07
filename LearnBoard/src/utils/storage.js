export const loadData = async () => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(null, resolve);
  });
};

export const saveData = (data) => {
  chrome.storage.sync.set(data);
};
