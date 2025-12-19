/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PACKAGE_ID: string
  // Add other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

