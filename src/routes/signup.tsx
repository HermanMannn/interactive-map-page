import { createFileRoute } from "@tanstack/react-router";
import Signup from "../components/Signup.jsx";

export const Route = createFileRoute("/signup")({
  component: Signup,
  head: () => ({
    meta: [
      { title: "Palestine Recorded — Sign Up" },
      {
        name: "description",
        content: "Create an account on Palestine Recorded to join our community.",
      },
    ],
  }),
});
