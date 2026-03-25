export default function Loader({ info }) {
  return (
    <div className="flex flex-col items-center justify-center mt-10">
      {/* Glass Card */}
      <div className="backdrop-blur-xl bg-white/40 border border-white/30 rounded-2xl shadow-xl px-10 py-8 flex flex-col items-center">
        {/* Animated Gradient Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>

          {/* Inner Glow */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 blur-md opacity-40"></div>
        </div>

        {/* Text */}
        <p className="mt-4 text-gray-700 font-medium animate-pulse">{info}</p>

        {/* Progress Dots */}
        <div className="flex gap-1 mt-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
          <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-150"></span>
          <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-300"></span>
        </div>
      </div>
    </div>
  );
}
