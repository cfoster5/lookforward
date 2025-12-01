// TODO: Use Intl.DurationFormat when available in React Native
export function composeRuntime(runtime?: number): string | undefined {
  if (runtime) {
    const minutes = runtime % 60;
    const hours = (runtime - minutes) / 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }
}
