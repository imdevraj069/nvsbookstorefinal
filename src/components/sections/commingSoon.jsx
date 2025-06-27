export default function ComingSoon() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="text-center px-6 max-w-xl">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
          Coming Soon
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          We're working hard on something awesome. Drop your email to get notified when we launch.
        </p>

        <form className="w-full">
          <div className="flex items-center border rounded-lg overflow-hidden dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none"
            />
            <button
              type="submit"
              className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 font-medium hover:opacity-90 transition"
            >
              Notify Me
            </button>
          </div>
        </form>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
