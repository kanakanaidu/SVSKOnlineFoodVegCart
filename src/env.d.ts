/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_API_ENDPOINT: string;
    REACT_APP_VERSION: string;
  }
}
