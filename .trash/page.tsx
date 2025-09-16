import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-200 flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-20 text-center">
        <h1 className="text-6xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 mb-6 drop-shadow-lg">
          Revolutionize Exams with{" "}
          <span className="underline decoration-pink-400">AI</span>
        </h1>
        <p className="max-w-2xl mx-auto text-2xl sm:text-3xl text-gray-700 mb-8">
          Set, edit, and mark exams with AI. Students take exams, view results, and
          earn certificates & rewards. Powered by the JHS NACCA curriculum.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 mt-6">
          <a
            href="/examiner"
            className="group relative p-8 w-80 rounded-2xl bg-white shadow-xl border-2 border-blue-200 hover:border-blue-500 transition-all hover:scale-105"
          >
            <span className="absolute top-4 right-4 text-blue-400 text-2xl">
              🎓
            </span>
            <h3 className="text-2xl font-bold text-blue-700 group-hover:text-blue-900">
              Examiner Portal &rarr;
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              Set exams, manage marking, and release results with ease.
            </p>
          </a>
          <a
            href="/student"
            className="group relative p-8 w-80 rounded-2xl bg-white shadow-xl border-2 border-purple-200 hover:border-purple-500 transition-all hover:scale-105"
          >
            <span className="absolute top-4 right-4 text-purple-400 text-2xl">
              🧑‍🎓
            </span>
            <h3 className="text-2xl font-bold text-purple-700 group-hover:text-purple-900">
              Student Portal &rarr;
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              Write exams, view your results, and get rewards instantly.
            </p>
          </a>
        </div>
        <div className="mt-12">
          <Image
            src="/hero-exam.svg"
            alt="Exam Hero"
            width={480}
            height={320}
            className="mx-auto drop-shadow-2xl"
          />
        </div>
      </main>
      <footer className="w-full py-8 bg-white border-t flex flex-col items-center">
        <p className="text-lg text-gray-600">
          Powered by{" "}
          <span className="font-bold text-blue-600">AI</span> &{" "}
          <span className="font-bold text-purple-600">Flutterwave</span>
        </p>
        <div className="flex gap-4 mt-2">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener"
            className="text-gray-400 hover:text-blue-600"
          >
            GitHub
          </a>
          <a
            href="/about"
            className="text-gray-400 hover:text-purple-600"
          >
            About
          </a>
        </div>
      </footer>
    </div>
  );
}
