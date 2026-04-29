export default function SplashScreen() {
  return(
    <div data-testid="splash-screen"
      className="flex flex-col items-center justify-center h-screen bg-indigo-600 "
    >
      <h1 className="text-4xl font-bold text-white">Habit Tracker</h1>
      <p className="text-indigo-200 mt-2">Build better habits everyday</p>
    </div>
  )
}