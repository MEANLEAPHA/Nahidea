 import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faHeart,
  faSmile,
  faSadTear,
} from "@fortawesome/free-regular-svg-icons";

export const content_options = [
  { value: "advice", label: "Advice" },
  { value: "experience", label: "Experience" },
  { value: "story", label: "Story" },
  { value: "educational", label: "Educational" },
  { value: "relationship", label: "Relationship" },
  { value: "religion", label: "Religion" },
  { value: "general", label: "General" },
  { value: "news", label: "News" },
  { value: "entertainment", label: "Entertainment" },
  { value: "technology", label: "Technology" },
  { value: "health", label: "Health" },
  { value: "finance", label: "Finance" },
  { value: "travel", label: "Travel" },
  { value: "food", label: "Food" },
  { value: "sports", label: "Sports" },
  { value: "art", label: "Art" },
  { value: "science", label: "Science" },
  { value: "politics", label: "Politics" },
  { value: "career", label: "Career" },
  { value: "lifestyle", label: "Lifestyle" },

  // ➕ Added categories
  { value: "gaming", label: "Gaming" },
  { value: "environment", label: "Environment" },
  { value: "history", label: "History" },
  { value: "parenting", label: "Parenting" },
  { value: "philosophy", label: "Philosophy" },
  { value: "diy", label: "DIY" },
  { value: "fashion", label: "Fashion" },
  { value: "motivation", label: "Motivation" },
];

export const confession_options = [
  // ❤️ Relationship & Crush
  { value: "secret_crush", label: "Secret Crush" },
  { value: "in_love", label: "In Love" },
  { value: "heartbreak", label: "Heartbreak" },
  { value: "situationship", label: "Situationship" },
  { value: "dating_drama", label: "Dating Drama" },

  // 🧠 Feelings & Emotions
  { value: "lonely", label: "Feeling Lonely" },
  { value: "overthinking", label: "Overthinking" },
  { value: "anxiety", label: "Anxiety/Stress" },
  { value: "happy_vibes", label: "Happy Vibes" },
  { value: "mood_swing", label: "Mood Swing" },

  // 🎓 School & Work Life
  { value: "exam_struggles", label: "Exam Struggles" },
  { value: "teacher_story", label: "Teacher Story" },
  { value: "workplace_secret", label: "Workplace Secret" },
  { value: "boss_drama", label: "Boss/Colleague Drama" },
  { value: "student_life", label: "Student Life" },

  // 👀 Personal & Past
  { value: "embarrassing", label: "Embarrassing Moment" },
  { value: "funny_experience", label: "Funny Experience" },
  { value: "childhood_memory", label: "Childhood Memory" },
  { value: "regret", label: "Regret" },
  { value: "life_lesson", label: "Life Lesson" },

  // 🔥 Spicy & Fun
  { value: "party_story", label: "Party Story" },
  { value: "wild_night", label: "Wild Night" },
  { value: "confession_dare", label: "Confession Dare" },
  { value: "gossip", label: "Gossip" },
  { value: "unpopular_opinion", label: "Unpopular Opinion" },

  // 🧩 Identity & Self
  { value: "secret_talent", label: "Secret Talent" },
  { value: "hidden_habit", label: "Hidden Habit" },
  { value: "personal_growth", label: "Personal Growth" },
  { value: "dreams_goals", label: "Dreams & Goals" },
  { value: "random_thought", label: "Random Thought" },
];

export const question_options = [
  // ❤️ Relationship & Crush
  { value: "secret_crush", label: "Secret Crush" },
  { value: "in_love", label: "In Love" },
  { value: "heartbreak", label: "Heartbreak" },
  { value: "situationship", label: "Situationship" },
  { value: "dating_drama", label: "Dating Drama" },

  // 🧠 Feelings & Emotions
  { value: "lonely", label: "Feeling Lonely" },
  { value: "overthinking", label: "Overthinking" },
  { value: "anxiety", label: "Anxiety/Stress" },
  { value: "happy_vibes", label: "Happy Vibes" },
  { value: "mood_swing", label: "Mood Swing" },

  // 🎓 School & Work Life
  { value: "exam_struggles", label: "Exam Struggles" },
  { value: "teacher_story", label: "Teacher Story" },
  { value: "workplace_secret", label: "Workplace Secret" },
  { value: "boss_drama", label: "Boss/Colleague Drama" },
  { value: "student_life", label: "Student Life" },

  // 👀 Personal & Past
  { value: "embarrassing", label: "Embarrassing Moment" },
  { value: "funny_experience", label: "Funny Experience" },
  { value: "childhood_memory", label: "Childhood Memory" },
  { value: "regret", label: "Regret" },
  { value: "life_lesson", label: "Life Lesson" },

  // 🔥 Spicy & Fun
  { value: "party_story", label: "Party Story" },
  { value: "wild_night", label: "Wild Night" },
  { value: "confession_dare", label: "Confession Dare" },
  { value: "gossip", label: "Gossip" },
  { value: "unpopular_opinion", label: "Unpopular Opinion" },

  // 🧩 Identity & Self
  { value: "secret_talent", label: "Secret Talent" },
  { value: "hidden_habit", label: "Hidden Habit" },
  { value: "personal_growth", label: "Personal Growth" },
  { value: "dreams_goals", label: "Dreams & Goals" },
  { value: "random_thought", label: "Random Thought" },
];

export const iconOptions = [
  { id: 1, name: "star", icon: faStar },
  { id: 2, name: "heart", icon: faHeart },
  { id: 3, name: "happy", icon: faSmile },
  { id: 4, name: "crying", icon: faSadTear },
];


export const question_type = [
  {id:1, label:"Open End", value:"openend"},
  {id:2, label:"Closed End", value:"closedend"},
  {id:3, label:"Single Choice", value:"singlechoice"},
  {id:4, label:"Multiple Choice", value:"multiplechoice"},
  {id:5, label:"Range", value:"range"},
  {id:6, label:"Rating", value:"rating"},
  {id:7, label:"Ranking Order", value:"rankingorder"}
];



export const gif_category = [
  // 🎭 Core Reactions
  { value: "thank_you", label: "🙏 Thank You" },
  { value: "love", label: "❤️ Love" },
  { value: "funny", label: "🤣 Funny" },
  { value: "yes", label: "✅ Yes" },
  { value: "no", label: "❌ No" },
  { value: "excited", label: "🤩 Excited" },
  { value: "kiss", label: "😘 Kiss" },
  { value: "hello", label: "👋 Hello" },
  { value: "bye", label: "👋 Bye / Wave" },
  { value: "welcome", label: "🙌 Welcome" },
  { value: "ok", label: "👌 OK" },
  { value: "thinking", label: "🤔 Thinking" },
  { value: "eye_roll", label: "🙄 Eye Roll" },
  { value: "side_eye", label: "👀 Side Eye" },
  { value: "crazy", label: "🤪 Crazy" },
  { value: "fire", label: "🔥 Fire" },
  { value: "scared", label: "😨 Scared" },
  { value: "huh", label: "😕 Huh / What" },

  // 😀 Emotions
  { value: "happy", label: "😊 Happy" },
  { value: "sad", label: "😢 Sad" },
  { value: "crying", label: "😭 Crying" },
  { value: "angry", label: "😡 Angry / Rage" },
  { value: "shocked", label: "😱 Shocked / OMG" },
  { value: "tired", label: "🥱 Tired" },
  { value: "sleepy", label: "😴 Sleepy" },
  { value: "cute", label: "🥰 Cute" },
  { value: "miss_you", label: "💔 Miss You" },
  { value: "hug", label: "🤗 Hug" },
  { value: "confused", label: "🤔 Confused" },

  // 🎉 Celebrations & Activities
  { value: "birthday", label: "🎂 Happy Birthday" },
  { value: "congrats", label: "🎉 Congratulations / Cheers" },
  { value: "celebrate", label: "🥳 Celebrate" },
  { value: "party", label: "🕺 Party / Dancing" },
  { value: "applause", label: "👏 Applause / Clapping" },
  { value: "yay", label: "🙌 Yay" },
  { value: "do_it", label: "💪 Do It" },

  // 👍 Gestures
  { value: "thumbs_up", label: "👍 Thumbs Up" },
  { value: "nope", label: "🙅 Nope" },
  { value: "wtf", label: "🤯 WTF" },
  { value: "lol", label: "😂 LOL" },
  { value: "facepalm", label: "🤦 Facepalm" },

  // 🐱 Meme & Pop Culture
  { value: "meme", label: "😂 Meme" },
  { value: "funny", label: "😆 Funny Meme" },
  { value: "cat_meme", label: "🐱 Cat Meme" },
  { value: "dog_meme", label: "🐶 Dog Meme" },
  { value: "gaming", label: "🎮 Gaming Meme" },
  { value: "spongebob", label: "🟨 SpongeBob Meme" },
  { value: "simpsons", label: "💛 Simpsons Meme" },
  { value: "shrek", label: "👹 Shrek Meme" },
  { value: "jackson", label: "🕺 Michael Jackson Meme" },
  { value: "genz", label: "🌐 Gen Z Meme" },
  { value: "dance_meme", label: "💃 Dance Meme" },

  // 🧩 Utility / Misc
  { value: "waiting", label: "⏳ Waiting" },
  { value: "please", label: "🙇 Please / Sorry" },
  { value: "wow", label: "😲 Wow" },
  { value: "omg", label: "😱 OMG" },

  //general
  { value: "general", label: "General" },
];
