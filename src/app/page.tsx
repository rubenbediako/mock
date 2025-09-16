import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-200 flex flex-col items-center justify-center">
      {/* Welcome Section */}
      <section className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-blue-700 mb-4 drop-shadow-lg">
          Welcome to DAS MOCK
        </h1>
        <p className="max-w-xl mx-auto text-xl sm:text-2xl text-gray-700 mb-6">
          Revolutionize exams with AI. Set, edit, and mark exams. Students take
          exams, view results, and earn certificates & rewards. Powered by the
          JHS NACCA curriculum.
        </p>
        <a
          href="/examiner"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-lg shadow hover:bg-blue-700 transition"
        >
          Get Started
        </a>
      </section>

      {/* Feature Highlights */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
          <span className="text-4xl mb-4">🤖</span>
          <h3 className="text-xl font-bold mb-2 text-blue-700">
            AI Exam Creation
          </h3>
          <p className="text-gray-600">
            Generate exams instantly using AI or set them manually.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
          <span className="text-4xl mb-4">📝</span>
          <h3 className="text-xl font-bold mb-2 text-purple-700">
            Smart Marking
          </h3>
          <p className="text-gray-600">
            Mark answers with detailed feedback and criteria.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
          <span className="text-4xl mb-4">🎓</span>
          <h3 className="text-xl font-bold mb-2 text-green-700">
            Certificates & Rewards
          </h3>
          <p className="text-gray-600">
            Students receive certificates and can earn rewards.
          </p>
        </div>
      </section>

      {/* Portals */}
      <div className="flex flex-wrap items-center justify-center gap-8 mb-16">
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

      {/* Hero Image */}
      <div className="mb-16">
        <Image
          src="/hero-exam.svg"
          alt="Exam Hero"
          width={480}
          height={320}
          className="mx-auto drop-shadow-2xl"
        />
      </div>

      {/* Footer */}
      <footer className="w-full py-8 bg-white border-t flex flex-col items-center mt-12">
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
