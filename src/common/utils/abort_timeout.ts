export default function timeoutSignalController(timeoutInMS: number) {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutInMS);

  // Allow Node.js processes to exit early if only the timeout is running
  timeoutId?.unref?.();

  return controller;
}

