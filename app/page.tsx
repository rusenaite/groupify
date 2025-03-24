"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shuffle, Plus, Minus, ChevronDown, ChevronUp } from "lucide-react"

export function generateGroupName(): string {
  const adjectives = ["Dynamic", "Creative", "Brilliant", "Energetic", "Innovative", "Visionary", "Courageous", "Fearless", "Bombastic", "Epic", "Legendary", "Mighty", "Fierce", "Savage", "Radical", "Awesome"];
  const nouns = ["Team", "Squad", "Group", "Crew", "Alliance", "Gang", "Pack", "Tribe", "Clan"];
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${randomAdjective} ${randomNoun}`;
}

// Initial student list
const initialStudents = ["RČ", "AČ", "DK", "RL", "TL", "KL", "KN", "VO", "TP", "DR", "MR"]

export default function GroupGenerator() {
  // State for students and their attendance
  const [students, setStudents] = useState(initialStudents.map((name) => ({ name, isPresent: true })))

  // State for group size
  const [groupSize, setGroupSize] = useState(3)

  // State for generated groups
  const [groups, setGroups] = useState<string[][]>([])

  // State for error message
  const [error, setError] = useState("")

  // State for animation
  const [isGenerating, setIsGenerating] = useState(false)

  // State for settings expanded
  const [settingsExpanded, setSettingsExpanded] = useState(false)

  // Toggle student presence
  const toggleStudentPresence = (index: number) => {
    const updatedStudents = [...students]
    updatedStudents[index].isPresent = !updatedStudents[index].isPresent
    setStudents(updatedStudents)
  }

  // Increment group size
  const incrementGroupSize = () => {
    setGroupSize((prev) => prev + 1)
  }

  // Decrement group size
  const decrementGroupSize = () => {
    if (groupSize > 1) {
      setGroupSize((prev) => prev - 1)
    }
  }

  // Generate groups
  const generateGroups = () => {
    // Start animation
    setIsGenerating(true)
    setGroups([])

    // Validate group size
    if (groupSize <= 0) {
      setError("Group size must be greater than 0")
      setIsGenerating(false)
      return
    }

    // Get present students
    const presentStudents = students.filter((student) => student.isPresent).map((student) => student.name)

    if (presentStudents.length === 0) {
      setError("No students are present")
      setIsGenerating(false)
      return
    }

    if (groupSize > presentStudents.length) {
      setError(`Group size (${groupSize}) is larger than the number of present students (${presentStudents.length})`)
      setIsGenerating(false)
      return
    }

    // Clear any previous errors
    setError("")

    // Shuffle students
    const shuffledStudents = [...presentStudents].sort(() => Math.random() - 0.5)

    // Create groups
    const newGroups: string[][] = []

    // Calculate how many groups we need
    const numberOfGroups = Math.ceil(shuffledStudents.length / groupSize)

    // Distribute students evenly across groups
    for (let i = 0; i < numberOfGroups; i++) {
      newGroups.push([])
    }

    // Assign students to groups
    shuffledStudents.forEach((student, index) => {
      const groupIndex = index % numberOfGroups
      newGroups[groupIndex].push(student)
    })

    // Delay setting groups to allow for animation
    setTimeout(() => {
      setGroups(newGroups)
      setIsGenerating(false)
      setSettingsExpanded(false) // Collapse settings after generating
    }, 800)
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl">
        <motion.h1
          className="text-3xl font-medium text-center mb-8 tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          Group Generator
        </motion.h1>

        <div className="grid gap-6 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-1"
          >
            <div className="backdrop-blur-xl bg-zinc-900/90 rounded-3xl border border-zinc-800 overflow-hidden">
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Settings</h2>
                  <button
                    onClick={() => setSettingsExpanded(!settingsExpanded)}
                    className="md:hidden w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400"
                  >
                    {settingsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {(settingsExpanded || window.innerWidth >= 768) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-5">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-medium text-zinc-400">Group Size</label>
                            <div className="flex items-center">
                              <button
                                onClick={decrementGroupSize}
                                disabled={groupSize <= 1}
                                className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-zinc-700 transition-colors disabled:opacity-50"
                              >
                                <Minus size={14} />
                              </button>
                              <div className="w-8 text-center text-sm font-medium">{groupSize}</div>
                              <button
                                onClick={incrementGroupSize}
                                className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-zinc-700 transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>

                          <motion.button
                            onClick={generateGroups}
                            disabled={isGenerating}
                            className="w-full py-2.5 rounded-full bg-blue-600 text-white text-sm font-medium flex items-center justify-center space-x-2 hover:bg-blue-500 transition-colors disabled:opacity-70"
                            whileTap={{ scale: 0.97 }}
                          >
                            <Shuffle size={14} />
                            <span>Generate Groups</span>
                          </motion.button>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-medium text-zinc-400">Students</label>
                            <span className="text-xs text-zinc-500">
                              {students.filter((s) => s.isPresent).length}/{students.length}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 gap-1.5 max-h-[280px] overflow-y-auto pr-1">
                            {students.map((student, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.02 }}
                              >
                                <div
                                  onClick={() => toggleStudentPresence(index)}
                                  className={`px-3 py-2 rounded-lg cursor-pointer transition-all flex items-center ${
                                    student.isPresent
                                      ? "bg-zinc-800 border border-zinc-700"
                                      : "bg-zinc-900 border border-zinc-800 opacity-50"
                                  }`}
                                >
                                  <div
                                    className={`w-3 h-3 rounded-full mr-2 flex-shrink-0 ${
                                      student.isPresent ? "bg-blue-500" : "bg-zinc-700"
                                    }`}
                                  />
                                  <span
                                    className={`text-xs font-medium ${
                                      student.isPresent ? "text-white" : "text-zinc-500 line-through"
                                    }`}
                                  >
                                    {student.name}
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-2"
          >
            <div className="backdrop-blur-xl bg-zinc-900/90 rounded-3xl border border-zinc-800 overflow-hidden h-full">
              <div className="p-5">
                <h2 className="text-lg font-medium mb-4">Generated Groups</h2>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 px-3 py-2 rounded-lg bg-red-900/20 border border-red-900/30 text-red-400 text-xs"
                  >
                    {error}
                  </motion.div>
                )}

                <AnimatePresence mode="wait">
                  {isGenerating ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center h-60"
                    >
                      <div className="relative">
                        <motion.div
                          className="w-10 h-10 rounded-full border-2 border-zinc-800 border-t-blue-500"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        />
                      </div>
                    </motion.div>
                  ) : groups.length > 0 ? (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid gap-3 sm:grid-cols-2 overflow-y-auto max-h-[400px] pr-1"
                    >
                      {groups.map((group, groupIndex) => (
                        <motion.div
                          key={groupIndex}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: groupIndex * 0.08 }}
                        >
                          <div className="bg-zinc-800/80 rounded-2xl border border-zinc-700 overflow-hidden">
                            <div className="px-3 py-2 bg-zinc-800 border-b border-zinc-700">
                              <h3 className="text-xs font-medium">Group {groupIndex + 1}: {generateGroupName()}</h3>
                            </div>
                            <div className="p-3">
                              <div className="grid gap-1.5">
                                {group.map((student, studentIndex) => (
                                  <motion.div
                                    key={studentIndex}
                                    initial={{ opacity: 0, x: 5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.2, delay: 0.1 + studentIndex * 0.03 }}
                                    className="flex items-center"
                                  >
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
                                    <span className="text-xs text-zinc-300">{student}</span>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-60 text-zinc-500"
                    >
                      <Shuffle size={24} className="mb-3 opacity-30" />
                      <p className="text-xs">Click "Generate Groups" to begin</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

