export function debounce(func: Function, timeout = 300) {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    // @ts-ignore
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
