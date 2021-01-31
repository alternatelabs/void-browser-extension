const LS_KEY = "voidAppData";

export const get = async () => {
  if (typeof browser !== "undefined") {
    return await browser.storage.local.get();
  } else {
    const data = localStorage.getItem(LS_KEY);

    if (!data) return {};

    return JSON.parse(data);
  }
};

export const set = async (data: any) => {
  if (typeof browser !== "undefined") {
    await browser.storage.local.set(data);
  } else {
    return localStorage.setItem(LS_KEY, JSON.stringify(data));
  }
};

export const clear = async () => {
  if (typeof browser !== "undefined") {
    await browser.storage.local.clear();
  } else {
    return localStorage.removeItem(LS_KEY);
  }
};

export default {
  get,
  set,
  clear,
};
