import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-400 via-green-600 to-green-800 text-white h-screen flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fadeIn">
          Track Your SDG Goals
        </h1>
        <p className="text-xl md:text-2xl mb-6 max-w-2xl animate-fadeIn delay-200">
          Stay motivated, build habits, and contribute to the Sustainable Development Goals!
        </p>
        <div className="flex gap-4 animate-fadeIn delay-400">
          <Link
            to="/register"
            className="bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="bg-transparent border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-700 transition transform hover:scale-105"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 text-gray-800">
        <h2 className="text-3xl font-bold text-center mb-12">Why SDG Tracker?</h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105">
            <div className="text-green-600 text-4xl mb-4">📊</div>
            <h3 className="font-bold mb-2">Analytics</h3>
            <p>Track your habits and see progress over time with charts and stats.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105">
            <div className="text-green-600 text-4xl mb-4">🏆</div>
            <h3 className="font-bold mb-2">Achievements</h3>
            <p>Unlock badges as you complete more habits and stay motivated!</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105">
            <div className="text-green-600 text-4xl mb-4">📅</div>
            <h3 className="font-bold mb-2">Habit Tracking</h3>
            <p>Keep track of daily habits and see your consistency over time.</p>
          </div>
        </div>
      </section>

      {/* Weekly Progress Section */}
      <section className="bg-green-100 p-8 rounded-lg max-w-4xl mx-auto my-12 text-center">
        <h3 className="text-2xl font-semibold mb-6">Your Weekly Progress</h3>
        <div className="grid grid-cols-7 gap-4 justify-center">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="w-12 h-12 rounded-full bg-green-300 flex items-center justify-center text-white font-bold transform hover:scale-110 transition"
            >
              {i + 1}
            </div>
          ))}
        </div>
        <p className="mt-4 text-gray-700">Each circle represents a day you completed at least one habit.</p>
      </section>
    </div>
  );
}
