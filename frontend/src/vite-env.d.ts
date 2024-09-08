/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_REACT_APP_GOOGLE_API_TOKEN: string;

  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
