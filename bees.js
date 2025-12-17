// Lightweight local dataset. You can expand/replace with your own research later.
// Fields: name, scientificName, type, from, whatItIs, funFact, flowerTips
window.BEE_DATA = [
  {
    id: "honeybee",
    name: "Western Honey Bee",
    scientificName: "Apis mellifera",
    type: "Social bee",
    from: "Originally Europe, Africa, and Western Asia (now worldwide)",
    whatItIs: "A famous hive-living bee kept by beekeepers for honey and pollination.",
    funFact: "A worker honey bee can visit thousands of flowers in one day.",
    flowerTips: "Loves clover, lavender, and fruit blossoms."
  },
  {
    id: "bumblebee",
    name: "Bumble Bee",
    scientificName: "Bombus spp.",
    type: "Social bee (small colonies)",
    from: "Mostly temperate regions (North America, Europe, Asia)",
    whatItIs: "Fuzzy, strong pollinators that can fly in cooler weather.",
    funFact: "They can ‘buzz pollinate’ by vibrating flowers to release pollen.",
    flowerTips: "Great with tomatoes, blueberries, and wildflowers."
  },
  {
    id: "carpenter",
    name: "Carpenter Bee",
    scientificName: "Xylocopa spp.",
    type: "Mostly solitary bee",
    from: "Worldwide (especially warm regions)",
    whatItIs: "A large bee that nests by tunneling into wood (it doesn’t eat the wood).",
    funFact: "Males often hover and ‘guard’ territory but don’t have stingers.",
    flowerTips: "Likes open-faced flowers; often seen on sages."
  },
  {
    id: "mason",
    name: "Mason Bee",
    scientificName: "Osmia spp.",
    type: "Solitary bee",
    from: "North America, Europe, Asia",
    whatItIs: "A gentle bee that nests in hollow stems and uses mud to seal chambers.",
    funFact: "Excellent early-spring pollinators for orchards.",
    flowerTips: "Loves fruit tree blossoms in spring."
  },
  {
    id: "leafcutter",
    name: "Leafcutter Bee",
    scientificName: "Megachile spp.",
    type: "Solitary bee",
    from: "Worldwide",
    whatItIs: "Cuts neat circles from leaves to build nest cells (totally normal, not harmful).",
    funFact: "Some carry pollen under their abdomen instead of on their legs.",
    flowerTips: "Often visits roses, asters, and legumes."
  },
  {
    id: "sweat",
    name: "Sweat Bee",
    scientificName: "Halictidae family",
    type: "Mostly solitary (some social)",
    from: "Worldwide",
    whatItIs: "Small metallic or striped bees; some are attracted to salty sweat.",
    funFact: "They’re important native pollinators in many ecosystems.",
    flowerTips: "Likes daisies and small clustered blooms."
  }
];

window.FLOWERS = [
  { id: "f1", name: "Blush Bloom", beeIds: ["bumblebee", "honeybee", "mason"] }
];


