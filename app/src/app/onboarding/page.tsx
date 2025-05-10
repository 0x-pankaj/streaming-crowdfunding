import { OnboardingSteps } from "@/components/onboarding-steps";
import { BackButton } from "@/components/back-button";

export default function OnboardingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton href="/" className="mb-6" />
      <h1 className="mb-8 text-3xl font-bold">
        Getting Started with SolStream
      </h1>
      <OnboardingSteps />
    </div>
  );
}
