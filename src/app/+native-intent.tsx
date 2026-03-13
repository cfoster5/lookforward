function normalizePath(path: string) {
  try {
    // Handle both universal links and custom scheme links.
    const url = new URL(path, "lookforward://app");
    const pathname = url.pathname.replace(/^\/+/, "");

    if (url.protocol === "lookforward:" && url.host && url.host !== "app") {
      return pathname ? `${url.host}/${pathname}` : url.host;
    }

    return pathname;
  } catch {
    return path.replace(/^\/+/, "");
  }
}

function remapSharedItemPath(path: string) {
  const normalizedPath = normalizePath(path);

  if (normalizedPath === "countdown") {
    return "/(tabs)/(countdown)";
  }

  const countdownMovieMatch = normalizedPath.match(/^countdown\/movie\/([^/?#]+)/);
  if (countdownMovieMatch) {
    return `/(tabs)/(countdown)?openType=movie&openId=${encodeURIComponent(
      countdownMovieMatch[1],
    )}`;
  }

  const countdownPersonMatch = normalizedPath.match(
    /^countdown\/person\/([^/?#]+)/,
  );
  if (countdownPersonMatch) {
    return `/(tabs)/(countdown)?openType=person&openId=${encodeURIComponent(
      countdownPersonMatch[1],
    )}`;
  }

  const countdownGameMatch = normalizedPath.match(/^countdown\/game\/([^/?#]+)/);
  if (countdownGameMatch) {
    return `/(tabs)/(countdown)?openType=game&openId=${encodeURIComponent(
      countdownGameMatch[1],
    )}`;
  }

  const movieMatch = normalizedPath.match(/^movie\/([^/?#]+)/);
  if (movieMatch) {
    return `/(tabs)/(find)/movie/${movieMatch[1]}`;
  }

  const personMatch = normalizedPath.match(/^person\/([^/?#]+)/);
  if (personMatch) {
    return `/(tabs)/(find)/person/${personMatch[1]}`;
  }

  const gameMatch = normalizedPath.match(/^game\/([^/?#]+)/);
  if (gameMatch) {
    return `/(tabs)/(find)/game/${gameMatch[1]}`;
  }

  const collectionMatch = normalizedPath.match(/^movie-collection\/([^/?#]+)/);
  if (collectionMatch) {
    return `/(tabs)/(find)/movie-collection/${collectionMatch[1]}`;
  }

  return path;
}

export function redirectSystemPath({ path }: { path: string }) {
  return remapSharedItemPath(path);
}
