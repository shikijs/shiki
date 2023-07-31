declare global {
  var __BROWSER__: boolean

  // These will not be defined for Node which don't have "DOM" in their lib.
  // So declare the minimal interface we need.
  // They are defined here and not in `loader.ts` to avoid getting injected in the built code.
  interface Window {
    WorkerGlobalScope: any
  }

  var self: Window & typeof globalThis
  function fetch(url: string): Promise<Response>
}

// This export is here so that all variables above would be added to the global scope
export {}
