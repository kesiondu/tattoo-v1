/**
 * PVUV traffic analytics loader. Rendered by the root document so the
 * provider receives a page view from every public and authenticated route.
 */
export function PvuvAnalytics() {
  return (
    <script
      id="pvuv-loader"
      defer
      src="https://www.pvuv.ai/f.js"
      data-site="mL3afY7b"
      data-api="https://in.pvuv.ai"
    />
  );
}
