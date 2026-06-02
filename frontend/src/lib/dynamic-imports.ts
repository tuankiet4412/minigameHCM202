/** Safe default export for next/dynamic — avoids webpack "moduleId is not a function" in dev */
export function loadDefault<T>(loader: () => Promise<{ default: T }>) {
  return loader().then((mod) => mod.default);
}
