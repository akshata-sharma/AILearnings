import { siteContent } from "@/content/learnings";
import PageShell from "@/components/layout/PageShell";

export default function Home() {
  return <PageShell content={siteContent} />;
}
