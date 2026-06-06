'use client';

import { useExercises } from '@/hooks';
import Image from 'next/image';

export default function WorkoutsPage() {
  const { exercises, loading } = useExercises();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-400">Loading exercises...</p>
        </div>
      </div>
    );
  }

  const categories = [...new Set(exercises.map((e) => e.category?.name))];

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Workouts 💪</h1>
          <p className="text-gray-400">
            Browse {exercises.length} exercises and build your perfect routine
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-8 pb-2">
          <button className="px-4 py-2 bg-purple-500 text-white rounded-lg whitespace-nowrap">
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg whitespace-nowrap transition"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Exercises Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise) => (
            <div key={exercise.id} className="card-hover cursor-pointer">
              {exercise.imageUrl && (
                <div className="mb-4 h-48 relative overflow-hidden rounded-lg">
                  <Image
                    src={exercise.imageUrl}
                    alt={exercise.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <h3 className="text-xl font-bold text-white mb-2">{exercise.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{exercise.nameAr}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="bg-black/30 rounded p-2">
                  <p className="text-gray-400">Difficulty</p>
                  <p className="text-purple-400 font-semibold">{exercise.difficulty}</p>
                </div>
                <div className="bg-black/30 rounded p-2">
                  <p className="text-gray-400">Calories</p>
                  <p className="text-green-400 font-semibold">{exercise.caloriesBurned}/10min</p>
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-4">{exercise.description}</p>
              
              <button className="w-full btn-primary py-2 text-sm">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
