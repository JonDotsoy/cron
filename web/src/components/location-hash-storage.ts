import { atom } from "nanostores";

const isWindow = () => typeof globalThis.window !== "undefined";
const isEnableLocationHash = () => isWindow() && !!globalThis.window.location;
const location = () =>
  isEnableLocationHash() ? globalThis.window.location : null;

const loadLocationHash = () => {
  const hash = location()?.hash.slice(1); // Remover el #
  const params = new URLSearchParams(hash);
  return params;
};

const locationHash = atom(loadLocationHash());

locationHash.subscribe((v) => {
  console.log(v);
});

if (isEnableLocationHash()) {
  globalThis.window.addEventListener("hashchange", () => {
    locationHash.set(loadLocationHash());
  });
}

export class LocationHashStorage {
  static getItem = (key: string) => {
    return locationHash.get().get(key) ?? null;
  };
  static setItem = (key: string, value: string) => {
    locationHash.get().set(key, value);
    if (isEnableLocationHash()) {
      window.location.hash = locationHash.get().toString();
    }
  };
  static removeItem = (key: string) => {
    locationHash.get().delete(key);
    if (isEnableLocationHash()) {
      window.location.hash = locationHash.get().toString();
    }
  };
}
