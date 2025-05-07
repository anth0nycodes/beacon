import { BeaconIcon } from "@/svgs/project-icons";
import React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import WaitlistForm from "@/components/WaitlistForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beacon - AI-Powered Code Comprehension",
  description:
    "Understand large codebases instantly. Beacon analyzes your code, shows you what each file does, and helps you learn, search, and chat with your code.",
  openGraph: {
    title: "Beacon - AI-Powered Code Comprehension",
    description:
      "Understand large codebases instantly. Beacon analyzes your code, shows you what each file does, and helps you learn, search, and chat with your code.",
    type: "website",
    url: "https://www.trybeacon.app",
    images: [
      {
        url: "/assets/banner.png",
        width: 1200,
        height: 630,
        alt: "Beacon - AI-Powered Code Comprehension",
      },
    ],
  },
};

const Home = () => {
  return (
    <main className="flex px-4 flex-col items-center justify-center h-screen gap-8 max-w-lg mx-auto">
      <div className="flex flex-col gap-3">
        <section className="flex justify-start items-center gap-2.5">
          <BeaconIcon className="text-black dark:text-white size-6" />
          <p className="text-lg font-medium">Beacon</p>
        </section>
        <section className="flex flex-col gap-4">
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            Large and complicated codebases? No problem.
          </p>
          <p className="text-base text-gray-600 dark:text-gray-300">
            Beacon lets you search, explore, and chat with your codebase while
            answering your questions, and helps you learn through interactive
            quizzes.
          </p>
          <p className="text-base text-gray-600 dark:text-gray-300">
            Connect your GitHub, upload any repo, and unlock instant
            understanding.
          </p>
          <p className="text-base text-gray-600 dark:text-gray-300">
            No more getting lost—just clear, AI-powered code comprehension.
          </p>
          <p className="text-base text-gray-900 dark:text-white font-medium">
            A version of Beacon is coming soon within the next few months.
            <br />
            Interested? Stay tuned and join the waitlist.
          </p>
          <WaitlistForm />
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-gray-400">
              We'll only send you important stuff. No spam, no noise.
            </p>
            <ThemeToggle />
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;
