import { notFound } from "next/navigation";
import FeedbackManager from "./feedback-manager";

export const metadata = {
  title: "Feedback manager",
  robots: { index: false, follow: false },
};

export default function FeedbackPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return <FeedbackManager />;
}
