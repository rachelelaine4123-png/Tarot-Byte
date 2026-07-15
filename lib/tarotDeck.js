// TarotByte — Tarot Deck Data Model
// Base deck: 78-card Rider–Waite–Smith structure.
// NOTE: RWS card NAMES and structure are public domain (US). All meaning text
// below is ORIGINAL, written for TarotByte in a warm, insight-oriented voice.

export const MAJOR_ARCANA = [
  { id: "the-fool", name: "The Fool", number: 0, arcana: "major",
    upright: "A fresh start calls — pack light and leap. The Fool is pure potential before fear sets in. Trust the path even when you can't see where it leads. Beginnings, open roads, spontaneous courage.",
    reversedMeaning: "You're hesitating at the edge. Fear of the unknown or ignoring solid advice is costing you momentum. The leap is right — the timing may not be." },
  { id: "the-magician", name: "The Magician", number: 1, arcana: "major",
    upright: "Every tool you need is already in your hands. Focused will turns intention into reality right now. This is the card of resourcefulness, skill, and making things happen through concentrated effort.",
    reversedMeaning: "Scattered energy or untapped potential. You may be trying to manifest from a place of doubt, or someone around you is using influence in ways that don't serve you." },
  { id: "the-high-priestess", name: "The High Priestess", number: 2, arcana: "major",
    upright: "Inner knowing speaks beneath the noise. The answer you're seeking lives in your intuition, not in more research. Pause, listen inward, and trust what rises. Stillness is its own kind of action.",
    reversedMeaning: "Ignored instincts. You know something that you're not letting yourself know — secrets kept even from yourself, or wisdom buried under what you think you 'should' feel." },
  { id: "the-empress", name: "The Empress", number: 3, arcana: "major",
    upright: "Abundance and creative fertility are in full flow. Let good things grow without forcing them. The Empress asks you to nurture — your work, your body, your relationships. Beauty and prosperity follow patience.",
    reversedMeaning: "Creative block or self-neglect. You may be smothering rather than nurturing, or giving so much outward that your own well has run dry. Tend yourself first." },
  { id: "the-emperor", name: "The Emperor", number: 4, arcana: "major",
    upright: "Structure, authority, and steady leadership build foundations that last. This is a time to organize, commit to a plan, and lead with discipline. Stability comes from setting clear boundaries.",
    reversedMeaning: "Rigidity or control issues. A structure that once served you may have become a cage. Examine where inflexibility is blocking growth — yours or someone else's." },
  { id: "the-hierophant", name: "The Hierophant", number: 5, arcana: "major",
    upright: "Tradition, mentorship, and shared belief offer a grounding path. A trusted teacher, institution, or established practice holds genuine wisdom. Working within the system may serve you now.",
    reversedMeaning: "Questioning convention — or needing to. Rules that no longer fit are asking to be examined. You may be called to forge your own spiritual or professional path." },
  { id: "the-lovers", name: "The Lovers", number: 6, arcana: "major",
    upright: "A values-based choice made from the heart. Deep alignment — in relationship or in direction. This is about choosing what is truly yours, not what looks right from the outside.",
    reversedMeaning: "Misalignment between what you choose and what you actually want. Avoidance, inner conflict, or a decision made against your own truth. The real choice is still waiting." },
  { id: "the-chariot", name: "The Chariot", number: 7, arcana: "major",
    upright: "Willpower and determined direction. Harness the opposing forces in your life and drive forward. Victory is available — but only if you stay in command. Focus is the wheel that steers you.",
    reversedMeaning: "Loss of control or competing drives pulling in opposite directions. Aggression, lack of direction, or momentum spent without a clear destination." },
  { id: "strength", name: "Strength", number: 8, arcana: "major",
    upright: "Quiet courage and gentle mastery over what frightens you. Strength here isn't force — it's the patient, heart-led taming of fear and instinct. Inner fortitude outlasts any external battle.",
    reversedMeaning: "Self-doubt depleting your reserves. Forcing where softness is needed, or lacking the confidence to act from your true core. Your strength is still there — it's asking to be trusted." },
  { id: "the-hermit", name: "The Hermit", number: 9, arcana: "major",
    upright: "Solitude and deep reflection light the way. The answer you need isn't out there — it's found in stepping back, going quiet, and trusting your own inner lantern. Wisdom requires space.",
    reversedMeaning: "Isolation without purpose, or avoiding the very introspection you need. You may be retreating from the world as a distraction rather than a path to clarity." },
  { id: "wheel-of-fortune", name: "Wheel of Fortune", number: 10, arcana: "major",
    upright: "The wheel turns. Cycles shift, luck moves, and change is already in motion. Ride the momentum — this is a moment of opportunity within a larger turning. What goes down comes back up.",
    reversedMeaning: "Resistance to change, or a run of bad timing that is already passing. You may be clinging to what's ending instead of positioning yourself for what's next." },
  { id: "justice", name: "Justice", number: 11, arcana: "major",
    upright: "Truth, fairness, and cause meeting effect. Accountability leads to balance. A situation is being weighed fairly — the outcome will reflect what was actually put in, not what was hoped for.",
    reversedMeaning: "Imbalance or avoided consequences. An unfair outcome, or a refusal to look honestly at your own role in a situation. The scales will eventually correct." },
  { id: "the-hanged-man", name: "The Hanged Man", number: 12, arcana: "major",
    upright: "A purposeful pause. Surrender your grip on how things 'should' go and you'll see a completely different angle. This delay isn't a setback — it's an invitation to radically shift your perspective.",
    reversedMeaning: "Stalling without purpose, or clinging to a sacrifice that has already cost you enough. A needed release is being resisted. Martyrdom serves no one here." },
  { id: "death", name: "Death", number: 13, arcana: "major",
    upright: "Endings that make room for what's actually next. Let what's done be done. Death in tarot almost never means literal death — it means transformation, the closing of a chapter, and the clearing that comes after.",
    reversedMeaning: "Clinging to what's already over. A transformation that is underway whether you accept it or not. Fear of endings may be the only thing keeping you stuck." },
  { id: "temperance", name: "Temperance", number: 14, arcana: "major",
    upright: "Balance, blending, and patient moderation create harmony from extremes. Something that seemed incompatible is finding its middle way. Flow with the process — you're being alchemized.",
    reversedMeaning: "Excess, imbalance, or impatience throwing things off. You may be forcing an outcome rather than allowing the natural blending process to work." },
  { id: "the-devil", name: "The Devil", number: 15, arcana: "major",
    upright: "Attachment, shadow, and the chains we choose. Something is binding you — and part of you is keeping it that way. Name what holds you. The chains often aren't as locked as they look.",
    reversedMeaning: "Breaking free. You're reclaiming your power and releasing an unhealthy pattern, addiction, or binding that has kept you smaller than you are." },
  { id: "the-tower", name: "The Tower", number: 16, arcana: "major",
    upright: "Sudden upheaval clears what was built on false foundations. A lightning bolt of truth. The Tower is disruptive but honest — what falls needed to fall. What remains after is real.",
    reversedMeaning: "A crisis averted or delayed — or the crumbling happening more slowly, which can feel worse. Clinging to what's already structurally unsound prolongs the fall." },
  { id: "the-star", name: "The Star", number: 17, arcana: "major",
    upright: "Hope, healing, and renewed faith after difficulty. The light returns, quietly and genuinely. The Star doesn't shout — it simply shines. You are being restored. Trust the gentle pull forward.",
    reversedMeaning: "Discouragement, or a temporary dimming of hope and faith. The light is still there — it may just be obscured by accumulated exhaustion or disappointment." },
  { id: "the-moon", name: "The Moon", number: 18, arcana: "major",
    upright: "Intuition, dreams, and the unseen world. Something is not what it appears to be — but your gut already knows. Trust the tide of your subconscious. Navigate by feel, not logic, for now.",
    reversedMeaning: "Confusion lifting or fears being revealed as illusions. What felt uncertain may be clarifying. False fears are losing their grip." },
  { id: "the-sun", name: "The Sun", number: 19, arcana: "major",
    upright: "Joy, clarity, vitality, and success. Things are working. This is one of the most purely positive cards in the deck — warmth, confidence, and genuine happiness are available to you now.",
    reversedMeaning: "A cloud over the joy, or optimism that needs a little more grounding in reality. The warmth is still there — it may just need a moment to fully break through." },
  { id: "judgement", name: "Judgement", number: 20, arcana: "major",
    upright: "Awakening, reckoning, and a call to rise into who you're actually becoming. Something wants to be heard, integrated, or forgiven. Answer the call — it won't stop until you do.",
    reversedMeaning: "Self-judgment or ignoring a call that keeps returning. You may be avoiding a reckoning or refusing to forgive — yourself most of all." },
  { id: "the-world", name: "The World", number: 21, arcana: "major",
    upright: "Completion, wholeness, and arrival. A cycle has fulfilled itself with grace. You did it. Take a moment to acknowledge what's been accomplished before you move on to what's next.",
    reversedMeaning: "Loose ends or a finish line that's closer than it feels. You may be withholding your own sense of completion. The cycle is nearly done — let it close." },
];

const SUITS = [
  { suit: "wands",    theme: "energy, passion, drive, and creativity" },
  { suit: "cups",     theme: "emotion, relationships, intuition, and the heart" },
  { suit: "swords",   theme: "thought, truth, conflict, and communication" },
  { suit: "pentacles", theme: "work, money, body, and the material world" },
];

// Richer original meanings — concise but atmospheric, voice-consistent.
const RANK_MEANINGS = {
  wands: {
    Ace:    ["A spark of pure creative fire. New inspiration, a business idea, a passion project — something wants to begin. The energy is here; the question is whether you'll act on it.", "The spark fizzled or arrived at the wrong moment. Enthusiasm that hasn't found its outlet yet. Creative delays or a passion without direction."],
    Two:    ["You're standing at the edge of something bigger. Plans forming, horizon scanning — a world of options is laid out before you. Vision comes before movement; this card says look before you leap.", "Fear of the unknown is keeping you in place. A bold plan that hasn't launched. Hesitation dressed up as caution."],
    Three:  ["Your ships have sailed and you're watching for them to return. Expansion is already in motion — follow-through is what's needed now. Progress toward a meaningful goal.", "Delays, unexpected obstacles, or a plan that needs revisiting. Anticipation turning to frustration. The ships may be late, but they haven't sunk."],
    Four:   ["Celebration, homecoming, and a genuine milestone. Something worth marking is here — an achievement, a belonging, a stable foundation to stand on.", "A shaky foundation, or joy that's being deferred. Instability at home, or postponed celebration waiting for permission that's already been granted."],
    Five:   ["Creative friction, lively competition, and the productive tension of ideas in conflict. Not all conflict is destructive — this fire can refine. Embrace the sparring.", "Conflict avoided or turned inward. Suppressed competition, inner tension, or a argument finally dying down."],
    Six:    ["A public win. Recognition arrives — earned applause, a deserved promotion, momentum gathered. Enjoy the victory lap, but stay grounded in why you started.", "A win that feels hollow, delayed, or unacknowledged. Success without the satisfaction. Recognition overdue or misdirected."],
    Seven:  ["You're outnumbered but holding your ground — and that takes real courage. Standing firm in your position against pressure, competing interests, or a crowd who disagrees.", "Feeling overwhelmed, giving up too soon, or fighting a battle that no longer needs fighting. Defensiveness where compromise might actually serve."],
    Eight:  ["Swift movement, exciting news, and a rush of momentum. Things are finally moving fast — communications flying, travel possible, ideas sparking into action. Go with it.", "Delays, scattered energy, or speed turning to chaos. Things moving too fast to track, or motion that's lost its direction."],
    Nine:   ["One more push before you reach the finish. Resilience wearing thin but still holding. You've come a long way — the battle-weariness is earned. Don't stop when you're this close.", "Depletion, defensiveness worn through, or stubbornness where flexibility would serve. The wall you've built may be protecting you from something that's actually safe now."],
    Ten:    ["A heavy load carried toward completion. This is ambition meeting responsibility — you chose this, and it matters. The weight is real, but so is what you'll deliver.", "Overburdened and possibly headed for collapse. Time to set something down. Delegation, boundaries, or simply admitting you can't carry all of this alone anymore."],
    Page:   ["Curious, enthusiastic energy arriving — or a message that lights something up. New possibilities, an invitation to explore, the first chapter of an exciting direction.", "Restlessness without focus, or a promising start that fizzled. Exciting news delayed or distorted. Scattered enthusiasm needing a container."],
    Knight: ["Bold, fast, and decisive action. This energy moves first and asks questions later — in the best possible way. Adventure, drive, and the willingness to burn bridges for the right cause.", "Recklessness, scattered ambition, or charging so fast that important details get left behind. Bravado masking anxiety. The fire is real; the aim needs work."],
    Queen:  ["Confident, magnetic, and full of creative vitality. She leads from her warmth and knows exactly who she is. Fiercely independent and generous with her light.", "Burnout, or confidence flickering under accumulated pressure. Self-doubt masking a fire that's still there. Jealousy or insecurity showing up where there's usually ease."],
    King:   ["Visionary, charismatic, and naturally in command. He inspires as much as he directs. Creative mastery at its peak — an entrepreneur, an artist at the height of their game.", "Impulsiveness dressed up as leadership, or a domineering streak blocking genuine connection. The vision is real; the execution needs more patience."],
  },
  cups: {
    Ace:    ["An overflowing heart and a genuine new beginning emotionally. Love offered or received, creativity flooding in, emotional renewal. Something feels possible again in a way it didn't before.", "Blocked feelings, self-love withheld, or an emotional opportunity not yet accepted. The cup is full — but the hand hasn't reached for it yet."],
    Two:    ["A real connection forming — mutual attraction, partnership, a bond built on reciprocity. Something is clicking between two people or two parts of yourself. Deep recognition.", "A rift, imbalance, or disconnection in a valued relationship. A bond strained or a connection not yet reciprocated. The feeling may be real; the timing may not be aligned."],
    Three:  ["Joyful celebration, friendship, and community. This is the card of chosen family, of toasting good news, of taking genuine delight in each other. Let the moment be what it is.", "Overindulgence, a fading social circle, or celebration with a hollow centre. Third-wheel energy, or joy being performed rather than genuinely felt."],
    Four:   ["Sitting with what is, noticing what's missing, and perhaps overlooking an offer being extended your way. Contemplation that can tip into dissatisfaction. Something is being held out to you.", "Reawakening interest, an offer being accepted, or shaking loose from emotional stagnation. The fog is lifting and something that was invisible is now in view."],
    Five:   ["Grief over what's been lost — and there is real loss here, worth acknowledging. But not everything is gone. Two cups remain standing behind you. Mourn what you must; don't miss what's still here.", "Acceptance, healing, and the first steps of moving forward. The hardest moment has passed. Forgiveness — of circumstances, of others, of yourself — is becoming possible."],
    Six:    ["Nostalgia, innocence, and the warmth of genuine kindness. A memory revisited, a connection from the past, or a gift given without expectation. The past has something tender to offer.", "Stuck in what was, or romanticizing a past that's keeping you from the present. Nostalgia as avoidance. Ready — or needing — to move on from what's been."],
    Seven:  ["A swirl of choices, daydreams, and tempting illusions. Not everything on offer is real — discernment is needed. Fantasy is seductive; clarity is required before you choose.", "The fog is clearing. Fantasy giving way to practical reality. You can now see which vision is worth pursuing and which was always just wishful thinking."],
    Eight:  ["Walking away from something that no longer feeds you — even if you built it, even if it still looks fine from the outside. A deep inner shift toward something more meaningful.", "Fear of leaving, or aimless wandering without the clarity of purpose. You may be drifting rather than walking toward something real. The leaving is right; the direction needs sharpening."],
    Nine:   ["A wish fulfilled, contentment earned, and the quiet satisfaction of having what you actually wanted. The emotional wealth card. Pleasure, comfort, and a wish that came true.", "Chasing pleasure that doesn't satisfy, or contentment that stays just out of reach. Emotional overindulgence, or happiness contingent on more than you actually need."],
    Ten:    ["Emotional harmony, lasting happiness, and the deep satisfaction of genuine belonging. Home, family, and love that has proven it's real over time. A joyful chapter arriving.", "A rupture in the home or family circle, or a rift needing mending. Happiness that looks ideal on the outside but has cracks underneath. The harmony is worth repairing."],
    Page:   ["A tender, heartfelt message or a creative invitation. Gentle intuition nudging you toward something beautiful. Imaginative, sensitive energy — pay attention to what moves you.", "Emotional immaturity, a blocked creative flow, or a muse that's gone quiet. Oversensitivity, or feelings communicated in ways that confuse rather than connect."],
    Knight: ["Romance, charm, and following the heart's signal. An emotionally available, creative presence — in a person, or an energy that's sweeping you off your feet. Beautiful, if a little idealistic.", "Moodiness, unrealistic promises, or a romantic gesture that doesn't translate to follow-through. The heart is full; the commitment wavers."],
    Queen:  ["Deep compassion, finely tuned intuition, and a calm emotional intelligence that steadies everyone in the room. She feels everything — and holds it beautifully. A healer, a counsellor, a knowing presence.", "Over-giving until the well runs dry. Feelings turned inward until they become anxiety. Emotional walls disguised as self-protection."],
    King:   ["Emotional mastery and generous, stable warmth. He leads from the heart without losing his head — a rare and valuable combination. Calm authority in emotional matters.", "Suppressed feelings or moodiness hidden under a composed surface. Emotional manipulation dressed as guidance. The waters run deeper and less peacefully than they appear."],
  },
  swords: {
    Ace:    ["A clean cut of clarity. Truth arriving, a breakthrough of understanding, a decision finally made with clear eyes. The sharpest start in the deck — use this blade carefully.", "Clarity misused, or confusion persisting despite your best effort to think through it. A truth that cuts the wrong thing, or a decision made before the fog fully lifted."],
    Two:    ["A stalemate. You're standing between two options with your eyes blindfolded, not quite ready to choose. Both paths have weight. The choice waits — and so does everything else.", "The blindfold coming off. Indecision finally breaking, or an evasion of truth that can no longer hold. A difficult conversation becoming necessary. The choice is being forced."],
    Three:  ["Heartache and the sharp, clarifying sting of a painful truth. Grief is real here — but so is the release that comes with naming what hurts. Sometimes the sword through the heart is the only thing that brings clarity.", "Healing beginning, or grief that's been held too long finally starting to move. The wound is real, but it is no longer fresh. Recovery is underway."],
    Four:   ["Rest, retreat, and the deep recovery that only stillness provides. A needed pause — strategic, not passive. Let the nervous system settle. You will fight better after you sleep.", "Restlessness preventing the rest you actually need, or avoidance disguised as recovery. The pause is necessary — the resistance to it is the problem."],
    Five:   ["A conflict where someone wins — but at what cost? The victory may be hollow, the aftermath messy. Tension, rivalry, and a reminder that winning isn't always the same as being right.", "Reconciliation becoming possible, or resentment finally releasing its grip. The conflict is cooling. Both sides are tired. Peace — or at least a truce — is within reach."],
    Six:    ["Moving away from turbulence toward calmer water. The transition is real — things are genuinely getting better, even if the journey isn't over yet. Relief is ahead.", "Resistance to moving on, or unfinished emotional baggage making the crossing heavier than it needs to be. The calmer waters are there — the resistance is what slows arrival."],
    Seven:  ["Strategy, independence, and acting without announcing it. A calculated move, a tactical retreat, or someone operating on their own agenda. Intelligence in action — or something to watch for in another.", "A scheme coming undone, or the moment to come clean before it unravels on its own. Deception returning to the honest surface. A solo move that backfired."],
    Eight:  ["Feeling trapped by the stories in your own mind. The cage is largely mental — the bonds are tighter in your thinking than in reality. But the blindfold makes it hard to see that.", "The blindfold removed. Freeing yourself from a self-created prison of thought. The trap is loosening because you can finally see through it. Liberation through perspective."],
    Nine:   ["Anxiety, sleepless nights, and the particular darkness of 3am thinking. The worry may feel like fact — but the sword are fears, not certainties. Morning offers a different view.", "Fear beginning to ease as light returns. The worst has either passed or never quite materialized in the way the mind insisted it would. Sleep finally comes."],
    Ten:    ["A painful ending — dramatic, definitive, and final. But notice: in the image, the sun is rising. The absolute worst is actually behind you now. The ending is real; so is the dawn.", "Recovery, survival, and the slow return of strength after collapse. The crisis has passed. You made it through the thing you were most afraid of. Something new can now begin."],
    Page:   ["Sharp, curious, intellectual energy. New ideas arriving fast, a truth to be spoken, information that changes the picture. Alert and ready to cut through the noise.", "Gossip, hasty conclusions, or scattered thinking that outpaces wisdom. A sharp tongue used carelessly. The ideas are good — the delivery needs care."],
    Knight: ["Fast, focused, and intellectually relentless. This energy cuts through everything that slows it down. Bold ideas and decisive action — when aimed well, unstoppable.", "Impatience, or charging in without reading the room. Brilliant but blunt. The momentum is there — it just needs direction, not just speed."],
    Queen:  ["Clear-eyed, honest, and independently minded. She has been through enough to see through illusion. Her truth-telling is a gift, even when it's sharp. Wisdom that comes from having survived.", "Coldness, or a harshness that mistakes cruelty for honesty. Cutting words without softness, or distance used as armor. The clarity is real — it just needs more warmth to land right."],
    King:   ["Intellectual authority, fair reasoning, and the ability to hold multiple perspectives without losing sight of truth. A judge, a strategist, a mind that commands respect.", "Rigidity, or truth wielded as a weapon. An authority that has forgotten the human element. Logic that's technically correct and emotionally absent."],
  },
  pentacles: {
    Ace:    ["A new opportunity for tangible prosperity, physical wellbeing, or material security. The seed of something real is being placed in your hand. Plant it with care.", "A missed opportunity or a shaky start to something that could have been solid. Money or resources not yet grounded into form. The seed is good; the soil needs tending."],
    Two:    ["Juggling priorities with remarkable grace. Two things that seem incompatible are being managed — but it takes constant adjustment. Adaptability is both your skill and your task right now.", "The juggling act failing, or overwhelm finally tipping into dropped balls. Too many commitments, or a financial balance too precarious to hold. Something has to give."],
    Three:  ["Skilled work recognized and collaboration bearing fruit. Early professional success built on craft and cooperation. The blueprint is working — the team is actually good.", "Discord beneath the surface of a project, or work that lacks the direction or acknowledgment it deserves. Teamwork breaking down, or talent going unrecognized."],
    Four:   ["Holding onto what you have with careful hands. Security built through saving, structure, and knowing what you value. Healthy stewardship — or the beginning of a hoarding tendency.", "Loosening a grip that has become fear. Financial anxiety or possessiveness that no longer serves. The security you're protecting may actually be blocking what could grow."],
    Five:   ["Hardship, financial strain, or feeling left out in the cold. But look: the warm light through the stained glass is right there. Support is closer than it feels. Ask.", "Recovery, finding help at last, or the long-awaited arrival of material stability after a difficult stretch. The hard season is ending."],
    Six:    ["Generosity flowing freely and fairly. A gift, a salary, a loan, a favour returned. The energy of fair exchange — giving and receiving in balance. Abundance shared is abundance multiplied.", "Strings attached to the generosity, or an imbalance between what's given and what's kept. Charity with conditions, or receiving without being able to give back — yet."],
    Seven:  ["Your efforts are taking root, but the harvest isn't here yet. Patience as the work slowly ripens. This card asks you to trust the process when results feel invisible.", "Impatience, or a fundamental reassessment of whether what you've invested in is actually growing. A pivot may be wiser than further waiting."],
    Eight:  ["Diligence, craft, and the devotion to doing it well. This is the card of focused, skilled practice — the artisan at the workbench. The work is the reward as much as the result.", "Cutting corners, or losing motivation for work that once mattered. A skill underutilised, or perfection blocking completion. The craft is there — the engagement has slipped."],
    Nine:   ["Independent, earned prosperity and the luxury of having built something for yourself. Self-sufficiency at its most beautiful. The fruit of your own labour, enjoyed without apology.", "Overwork tipping into self-neglect, or self-worth dangerously entangled with material success. The abundance is real — the identity cost is worth examining."],
    Ten:    ["Legacy, lasting wealth, and the deep satisfaction of family or communal security built to outlast you. Something is being established for the long term.", "Financial strain beneath a prosperous surface, or instability threatening what was supposed to be solid. The legacy matters — the foundation needs checking."],
    Page:   ["A promising new opportunity knocking — a course, a job, a practical skill to develop. Diligent, earnest energy. Show up, do the work, and something real will grow.", "Distraction pulling you away from something that needed your steady attention. A good plan left on the shelf. The opportunity is real — the follow-through is missing."],
    Knight: ["Reliable, methodical, patient progress. This energy moves slowly and builds solidly. Not glamorous — but trustworthy. Consistent effort accumulates into something lasting.", "Stagnation disguised as caution, or getting so locked into routine that genuine progress stops. The reliability is a strength — but the resistance to change has become a cost."],
    Queen:  ["Practical, nurturing abundance. She tends her people and her resources with equal care. Grounded wisdom, financial common sense, and a warmth that makes things grow.", "Overwhelm at the intersection of work and self-care. Neglecting your own needs while tending everyone else's. The abundance is real — but so is the exhaustion."],
    King:   ["Prosperous mastery, dependable success, and the calm authority of someone who has built something real. Practical leadership at its most assured.", "Materialism crowding out other values, or using control over resources as a substitute for genuine connection. The wealth is there — the wisdom about what it's actually for is needed."],
  },
};

const RANKS = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];

function buildMinorArcana() {
  const cards = [];
  for (const { suit } of SUITS) {
    for (const rank of RANKS) {
      const [up, rev] = RANK_MEANINGS[suit][rank];
      cards.push({
        id: `${rank.toLowerCase()}-of-${suit}`,
        name: `${rank} of ${suit.charAt(0).toUpperCase() + suit.slice(1)}`,
        rank,
        suit,
        arcana: "minor",
        upright: up,
        reversedMeaning: rev,
      });
    }
  }
  return cards;
}

export const MINOR_ARCANA = buildMinorArcana();

export const TAROT_DECK = [...MAJOR_ARCANA, ...MINOR_ARCANA];

export default TAROT_DECK;
