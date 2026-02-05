import Groq from "groq-sdk";
import { systemPrompt } from "./prompt.js";
import { getAllMovies, addToWishlist } from "./tools.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function runAgent({ message, token }) {
  // 1️⃣ Ask Groq to understand intent + movie title
  const completion = await groq.chat.completions.create({
    model: "llama3-8b-8192",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ],
  });

  const parsed = JSON.parse(
    completion.choices[0].message.content
  );

  if (parsed.intent !== "add_to_wishlist") {
    throw new Error("Unsupported intent");
  }

  if (!parsed.movieTitle) {
    throw new Error("Movie title missing");
  }

  // 2️⃣ Get all movies from your backend
  const movies = await getAllMovies(token);

  // 3️⃣ Match movie title (case-insensitive)
  const movie = movies.find(
    (m) =>
      m.title.toLowerCase().includes(
        parsed.movieTitle.toLowerCase()
      )
  );

  if (!movie) {
    throw new Error("Movie not found");
  }

  // 4️⃣ Add movie to wishlist
  return await addToWishlist(movie._id, token);
}
