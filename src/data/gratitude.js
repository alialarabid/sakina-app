// Gentle, reflective shukr prompts. These are reflection nudges written for
// the app — NOT scripture, hadith, or attributed religious text. They simply
// invite a moment of gratitude. One is shown per day.
export const GRATITUDE_PROMPTS = [
  'Name one thing you woke up to today that you didn’t have to earn.',
  'Recall a difficulty that quietly passed. Say Alhamdulillah for the ease that followed.',
  'Think of one person whose presence is a mercy in your life.',
  'Notice your breath for a moment — a blessing renewed thousands of times a day.',
  'What is something small today that went right? Pause and be thankful for it.',
  'Remember a door that closed, and the better one that opened after it.',
  'Consider the food you ate today and the unseen hands that brought it to you.',
  'Recall a worry from last year that no longer troubles you.',
  'Look around the room. Name three comforts you usually overlook.',
  'Think of a skill or strength you were given, not one you chose.',
  'Remember a moment of kindness shown to you that you did not ask for.',
  'Reflect on your health today, and the parts of your body that served you silently.',
  'What is one thing you have that someone else is praying for tonight?',
  'Recall the last time you felt truly at peace. Be grateful that you can feel it.',
]

// Stable index for a given day so the prompt is consistent through the day.
export function promptForToday() {
  const d = new Date()
  const dayOfYear = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000)
  return GRATITUDE_PROMPTS[dayOfYear % GRATITUDE_PROMPTS.length]
}
