import { useEffect, useState } from "react";
import ImageColors from "react-native-image-colors";

export function useGetColors(
  uri: string,
  height: number,
  width: number,
  headerHeight: number
) {
  const [state, setState] = useState<{
    background: string;
    gradients: { color: string; center: [number, number] }[];
    loading: boolean;
  }>({ background: "", gradients: [], loading: true });

  useEffect(() => {
    setState({ background: "", gradients: [], loading: true });
    async function getColors() {
      const result = await ImageColors.getColors(uri, {
        fallback: "#228B22",
        // cache: true,
        key: "unique_key",
      });
      console.log("result", result);
      setState({
        background: result.background,
        gradients: [
          {
            color: result.primary,
            center: [0.21 * width, 0.33 * height - headerHeight],
          },
          {
            color: result.secondary,
            center: [0.79 * width, 0.32 * height - headerHeight],
          },
          {
            color: result.detail,
            center: [0.26 * width, 0.83 * height - headerHeight],
          },
        ],
        loading: false,
      });
    }
    getColors();
  }, [uri, height, width, headerHeight]);

  return state;
}
