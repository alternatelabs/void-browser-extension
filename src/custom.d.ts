type IBrowserTab = {
  url: string;
};
interface IBrowserTabs {
  query: (options: {
    active: boolean;
    currentWindow: boolean;
  }) => Promise<IBrowserTab[]>;
}
interface IBrowser {
  tabs: IBrowserTabs;
}

// declare var browser: IBrowser;

declare module "webextension-polyfill" {
  const browser: IBrowser;
  export default browser;
}
