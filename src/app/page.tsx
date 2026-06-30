import { redirect } from "next/navigation";

// himage has no marketing landing page — unauthenticated users are sent to
// hifamily SSO by middleware; authenticated users land on the albums hub.
export default function Home() {
  redirect("/hub");
}
