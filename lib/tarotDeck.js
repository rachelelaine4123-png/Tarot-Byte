// TarotByte — Tarot Deck Data Model
// Base deck: 78-card Rider–Waite–Smith structure.
// NOTE: RWS card NAMES and structure are public domain (US). All meaning text
// below is ORIGINAL, written for TarotByte in a warm, insight-oriented voice.
// Edit freely — this is placeholder-quality but launch-usable copy.

export const MAJOR_ARCANA = [
  { id: "the-fool", name: "The Fool", number: 0, arcana: "major",
    upright: "A fresh beginning, open roads, and the courage to leap. Trust the unknown.",
    reversedMeaning: "Hesitation, reckless timing, or ignoring good advice before you jump." },
  { id: "the-magician", name: "The Magician", number: 1, arcana: "major",
    upright: "You have every tool you need. Focused will turns intention into reality.",
    reversedMeaning: "Scattered energy, untapped talent, or manipulation to watch for." },
  { id: "the-high-priestess", name: "The High Priestess", number: 2, arcana: "major",
    upright: "Inner knowing speaks. Trust intuition and the wisdom beneath the surface.",
    reversedMeaning: "Ignored instincts or secrets kept even from yourself." },
  { id: "the-empress", name: "The Empress", number: 3, arcana: "major",
    upright: "Abundance, nurturing, and creative fertility. Let good things grow.",
    reversedMeaning: "Creative block, self-neglect, or smothering rather than nurturing." },
  { id: "the-emperor", name: "The Emperor", number: 4, arcana: "major",
    upright: "Structure, leadership, and steady authority build lasting foundations.",
    reversedMeaning: "Rigidity, control issues, or a structure that no longer serves." },
  { id: "the-hierophant", name: "The Hierophant", number: 5, arcana: "major",
    upright: "Tradition, mentorship, and shared belief offer grounding guidance.",
    reversedMeaning: "Questioning the rules, or freedom from convention that no longer fits." },
  { id: "the-lovers", name: "The Lovers", number: 6, arcana: "major",
    upright: "Connection, alignment, and a values-based choice made from the heart.",
    reversedMeaning: "Misalignment, avoidance, or a decision made against your truth." },
  { id: "the-chariot", name: "The Chariot", number: 7, arcana: "major",
    upright: "Willpower and direction. Harness opposing forces and drive forward.",
    reversedMeaning: "Loss of control, competing urges, or a stalled momentum." },
  { id: "strength", name: "Strength", number: 8, arcana: "major",
    upright: "Quiet courage, patience, and gentle mastery over fear.",
    reversedMeaning: "Self-doubt, depleted reserves, or force where softness is needed." },
  { id: "the-hermit", name: "The Hermit", number: 9, arcana: "major",
    upright: "Solitude and reflection light the way. Seek the answer within.",
    reversedMeaning: "Isolation, or avoiding the introspection you actually need." },
  { id: "wheel-of-fortune", name: "Wheel of Fortune", number: 10, arcana: "major",
    upright: "Cycles turn, luck shifts, and change arrives. Ride the momentum.",
    reversedMeaning: "Resistance to change or a run of bad timing that will pass." },
  { id: "justice", name: "Justice", number: 11, arcana: "major",
    upright: "Truth, fairness, and cause meeting effect. Accountability brings balance.",
    reversedMeaning: "Imbalance, avoided consequences, or an unfair situation." },
  { id: "the-hanged-man", name: "The Hanged Man", number: 12, arcana: "major",
    upright: "A pause with purpose. Surrender your grip to see a new angle.",
    reversedMeaning: "Stalling, martyrdom, or resisting a needed release." },
  { id: "death", name: "Death", number: 13, arcana: "major",
    upright: "Endings that make room for renewal. Let what's done be done.",
    reversedMeaning: "Clinging to the past or fearing a transformation already underway." },
  { id: "temperance", name: "Temperance", number: 14, arcana: "major",
    upright: "Balance, blending, and patient moderation create harmony.",
    reversedMeaning: "Excess, imbalance, or impatience throwing things off." },
  { id: "the-devil", name: "The Devil", number: 15, arcana: "major",
    upright: "Attachment, shadow, and the chains we choose. Name what binds you.",
    reversedMeaning: "Breaking free, reclaiming power, and releasing an unhealthy pattern." },
  { id: "the-tower", name: "The Tower", number: 16, arcana: "major",
    upright: "Sudden upheaval clears false foundations. Truth breaks through.",
    reversedMeaning: "A crisis averted or delayed, or clinging to what's already crumbling." },
  { id: "the-star", name: "The Star", number: 17, arcana: "major",
    upright: "Hope, healing, and renewed faith. The light returns after the dark.",
    reversedMeaning: "Discouragement or a temporary dimming of hope." },
  { id: "the-moon", name: "The Moon", number: 18, arcana: "major",
    upright: "Intuition, dreams, and the unseen. Trust the tide of the subconscious.",
    reversedMeaning: "Confusion lifting, or fears revealed as illusions." },
  { id: "the-sun", name: "The Sun", number: 19, arcana: "major",
    upright: "Joy, clarity, and vitality. Success and warmth shine on you.",
    reversedMeaning: "A cloud over the joy, or optimism that needs grounding." },
  { id: "judgement", name: "Judgement", number: 20, arcana: "major",
    upright: "Awakening, reckoning, and a call to rise into who you're becoming.",
    reversedMeaning: "Self-judgment or ignoring a call that keeps returning." },
  { id: "the-world", name: "The World", number: 21, arcana: "major",
    upright: "Completion, wholeness, and arrival. A cycle fulfilled with grace.",
    reversedMeaning: "Loose ends or a finish line that's closer than it feels." },
];

const SUITS = [
  { suit: "wands", theme: "energy, passion, drive, and creativity" },
  { suit: "cups", theme: "emotion, relationships, intuition, and the heart" },
  { suit: "swords", theme: "thought, truth, conflict, and communication" },
  { suit: "pentacles", theme: "work, money, body, and the material world" },
];

// Original short meanings for each rank within a suit (kept concise; editable).
const RANK_MEANINGS = {
  wands: {
    Ace: ["A spark of inspiration and raw potential.", "A delayed start or misfired enthusiasm."],
    Two: ["Planning, vision, and a world of options.", "Fear of the unknown or a stalled plan."],
    Three: ["Expansion and progress toward a goal.", "Delays or a plan that needs revisiting."],
    Four: ["Celebration, home, and a stable milestone.", "A shaky foundation or postponed joy."],
    Five: ["Friction, competition, and lively conflict.", "Avoiding a fight or inner tension released."],
    Six: ["Victory, recognition, and public success.", "A win that feels hollow or delayed."],
    Seven: ["Standing your ground against pressure.", "Feeling overwhelmed or giving up too soon."],
    Eight: ["Swift movement, news, and momentum.", "Delays, scattered energy, or slowing down."],
    Nine: ["Resilience and one last push before the finish.", "Depletion or defensiveness worn thin."],
    Ten: ["A heavy load carried toward completion.", "Overburdened — time to set something down."],
    Page: ["Curious energy and an exciting message.", "Restlessness or a delayed opportunity."],
    Knight: ["Bold action and adventurous drive.", "Recklessness or scattered ambition."],
    Queen: ["Confident warmth and magnetic vitality.", "Burnout or self-doubt dimming your fire."],
    King: ["Visionary leadership and natural charisma.", "Impulsiveness or a domineering streak."],
  },
  cups: {
    Ace: ["An overflowing heart and new emotional beginning.", "Blocked feelings or self-love withheld."],
    Two: ["Mutual connection and heartfelt partnership.", "A rift or imbalance in a bond."],
    Three: ["Friendship, celebration, and community.", "Overindulgence or a fading circle."],
    Four: ["Contemplation and quiet dissatisfaction.", "Reawakening interest or accepting an offer."],
    Five: ["Grief over loss — but not all is gone.", "Acceptance, healing, and moving forward."],
    Six: ["Nostalgia, innocence, and kind memories.", "Stuck in the past or ready to move on."],
    Seven: ["Choices, daydreams, and tempting illusions.", "Clarity cutting through fantasy."],
    Eight: ["Walking away to seek something deeper.", "Fear of leaving or aimless drifting."],
    Nine: ["Contentment and a wish fulfilled.", "Chasing pleasure that doesn't satisfy."],
    Ten: ["Emotional harmony and lasting joy.", "A rupture in home or a rift to mend."],
    Page: ["A tender message and creative feeling.", "Emotional immaturity or a blocked muse."],
    Knight: ["Romance, charm, and following the heart.", "Moodiness or unrealistic promises."],
    Queen: ["Compassion, intuition, and emotional depth.", "Over-giving or feelings turned inward."],
    King: ["Emotional balance and calm generosity.", "Suppressed feelings or moodiness masked."],
  },
  swords: {
    Ace: ["A breakthrough of clarity and truth.", "Confusion, or clarity misused."],
    Two: ["A stalemate needing an honest choice.", "Indecision breaking or truth avoided."],
    Three: ["Heartache and a painful but clearing truth.", "Healing begins, or grief held too long."],
    Four: ["Rest, recovery, and needed stillness.", "Restlessness or avoiding necessary rest."],
    Five: ["Conflict, winning at a cost, or tension.", "Reconciliation or releasing resentment."],
    Six: ["Transition toward calmer waters.", "Resistance to moving on or unfinished baggage."],
    Seven: ["Strategy, cunning, or acting alone.", "Coming clean or a scheme unraveling."],
    Eight: ["Feeling trapped by your own thinking.", "Freeing yourself from a self-made cage."],
    Nine: ["Anxiety, worry, and sleepless nights.", "Fears easing as light returns."],
    Ten: ["A painful ending that clears the way.", "Recovery, survival, and the worst behind you."],
    Page: ["Sharp curiosity and a truth to speak.", "Gossip, haste, or scattered thinking."],
    Knight: ["Fast, focused action and bold ideas.", "Impatience or charging in without a plan."],
    Queen: ["Clear-eyed honesty and independent wisdom.", "Coldness or overly harsh judgment."],
    King: ["Intellectual authority and fair reason.", "Rigidity or truth wielded without heart."],
  },
  pentacles: {
    Ace: ["A new opportunity for prosperity and stability.", "A missed chance or shaky start."],
    Two: ["Juggling priorities with adaptable balance.", "Overwhelm or dropping too many balls."],
    Three: ["Collaboration and skilled early success.", "Discord or work that lacks direction."],
    Four: ["Security, saving, and holding what you have.", "Loosening a tight grip or fear of loss."],
    Five: ["Hardship, but support is nearer than it seems.", "Recovery and finding help at last."],
    Six: ["Generosity, fair exchange, and support.", "Strings attached or imbalance in giving."],
    Seven: ["Patience as your efforts slowly ripen.", "Impatience or reassessing your investment."],
    Eight: ["Diligence, skill-building, and craft.", "Cutting corners or losing motivation."],
    Nine: ["Independent comfort and earned luxury.", "Overwork or self-worth tied to things."],
    Ten: ["Legacy, wealth, and lasting family security.", "Financial strain or fleeting stability."],
    Page: ["A promising opportunity to learn and build.", "Distraction or a plan left on the shelf."],
    Knight: ["Steady, reliable, methodical progress.", "Stagnation or getting stuck in routine."],
    Queen: ["Practical nurturing and grounded abundance.", "Overwhelm between work and self-care."],
    King: ["Prosperous mastery and dependable success.", "Materialism or control over security."],
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
