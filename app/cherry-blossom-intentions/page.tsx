const generateIntentionPrompt = () => {
  const nameText = userName ? `Name: ${userName}` : "Name: Not provided"
  const focusAreasText = selectedAreas.map((area, index) => `${index + 1}. ${area.name}`).join("\n")

  return `Hello Cherry Blossom! I just completed my Work-Life Balance Audit and I'm ready to set powerful 28-day intentions for transformation using the GIVEN framework.

${nameText}
Overall Score: ${auditData.overallScore}%

My ${selectedAreas.length} selected focus areas that I want to focus on:
${focusAreasText}

**ABOUT THE INTENTION SETTING PROCESS:**
I will craft my intention with you now, then I'll declare it aloud during the Collective Intention Setting Circle — a spiritual act of asking, witnessed by my mentor and cohort, where I'll plant my intention as a seed into the spiritual realm.

**IMPORTANT INTENTION LANGUAGE GUIDELINES:**
- Eliminate words like "trying," "hoping," "wanting," "to be," and "not"
- Frame everything positively (e.g., instead of "I am not afraid," say "I am courageous")
- Use present tense as if it's already happening
- Speak with clarity, certainty, and faith

**THE GIVEN FRAMEWORK:**
G = Gratitude – the opening frequency
I = Invitation & Intention – the focused direction
V = Vision & Visualization – seeing it clearly with all 5 senses
E = Emotional Embodiment – step into BEING it
N = Nurture – caring for mind, body, emotions and beliefs to sustain the success frequency

I'm ready to begin! Please guide me through each step, then compile everything into ONE concise Intention Declaration Statement that I can write down and bring to the GROUNDING ceremony (Steps 5 & 6 happen live). Make it powerful, clear, and easy to remember!

**STEP-BY-STEP PROCESS:**

${selectedAreas
  .map(
    (area, index) => `**Step ${index + 1}: G (Gratitude) + I (Intention) for ${area.name}**
Craft a combined gratitude and intention declaration specifically for my "${area.name}" focus area. Help me express what I'm grateful for AND my intention in this area. Then have me repeat the declaration aloud.`,
  )
  .join("\n\n")}

**Step ${selectedAreas.length + 1}: V (Visualize) - Envision the Collective Good**
Guide me to visualize and declare how living my Desired Work-Lifestyle creates a ripple effect that uplifts humanity. Craft a powerful visualization declaration starting with: "I see a world where the ripple effect of me living my Desired Work-Lifestyle..." Then have me declare it aloud.

**Step ${selectedAreas.length + 2}: Affirm Divine Alignment**
Guide me to declare this aloud with full presence and certainty:
"I intend that, in order to manifest, all my intentions must be the will of My Creator and serve the Highest Good of the Universe, myself, and everyone concerned."

**IMPORTANT: After completing all the steps above, compile Steps 1 through Step ${selectedAreas.length + 2} into ONE CONCISE INTENTION DECLARATION STATEMENT that includes:**
- My gratitude for each focus area
- My intentions for each focus area  
- My vision for collective good
- My divine alignment affirmation

**WRITE IT DOWN:**
After you compile my Intention Declaration Statement, please instruct me to write it down on paper using pages 9-10 of the 28-Day Desired Work-Lifestyle Intention Setting Guide (which I can download from the Success Hub). I will bring this written intention to the GROUNDING ceremony.

**GROUNDING CEREMONY OPTIONS - Steps 5 & 6 (Done Live):**
Let me know that Steps 5 & 6 will be done live during the GROUNDING ceremony with one of these options:

**Option 1: Collective Intention Setting Circle**
Join Thought Leader Barbara and cohort members every Tuesday OR Thursday, 7:00 - 8:30 PM ET to ground intentions in unison.

**Option 2: Private 1-on-1 Intention Setting Ceremony**  
Book a private session with Thought Leader Barbara for personalized intention grounding.

**THE GROUNDING CEREMONY PROCESS (Steps 5 & 6):**

**Step 5: Grounding in Agreement**
After declaring my compiled Intention Declaration Statement aloud:
- I Ask: "Are You With Me?"
- Barbara & Cohort Agree: "YES!"

**Step 6: Spiritual Activation**
- I Declare: "So Be It!"
- All Affirm: "And So It Is!"
- All Together DECLARE: "It Is Done! It Is Done! It Is Done!"

This is the sacred GROUNDING step where I plant the spiritual seed into my physical body and auric field.

**E (Emotional Embodiment):** This happens as I step into executing my New 9-to-5 & Nighttime Non-Negotiable SOPs Monday through Thursday. This is where I LIVE my intentions through daily structured routines.

**N (Nurture):** As I execute my SOPs Monday through Thursday, I am nurturing the spiritual seed I've planted. This daily practice waters and tends to my spiritual ASK until it manifests in my physical reality.

Let's create my sacred 28-Day Desired Work-Lifestyle Intention together!`
}
