// Enhanced data service with real extracted data
export interface TopicData {
  topic_id: number;
  name: string;
  videos: number;
  percentage: number;
  keywords: string[];
  top_keywords: { keyword: string; probability: number }[];
  coherence_score?: number;
}

export interface SpamComment {
  commentId: string;
  textOriginal: string;
  classification_confidence: number;
  spam_features: {
    caps_ratio: number;
    repetition_ratio: number;
    emoji_ratio: number;
    likes_per_char: number;
  };
  author_id?: string;
  video_id?: string;
}

export interface QualityComment {
  commentId: string;
  textOriginal: string;
  likeCount: number;
  video_id: string;
  video_title: string;
}

export interface VideoAnalysis {
  videoId: string;
  title: string;
  topic: number;
  confidence: number;
  viewCount: number;
  commentCount: number;
}

export interface CoherenceData {
  k: number;
  coherence_score: number;
}

// Real topic distribution from STM analysis (26 topics)
export const topicDistribution: TopicData[] = [
  { 
    topic_id: 20, 
    name: "Hair Care & Styling", 
    videos: 8076, 
    percentage: 23.1, 
    coherence_score: 0.487,
    keywords: ["hair", "style", "look", "beautiful", "amazing"],
    top_keywords: [
      { keyword: "hair", probability: 0.15 },
      { keyword: "beautiful", probability: 0.12 },
      { keyword: "style", probability: 0.10 },
      { keyword: "look", probability: 0.08 },
      { keyword: "amazing", probability: 0.07 }
    ]
  },
  { 
    topic_id: 21, 
    name: "Makeup Tutorials", 
    videos: 5944, 
    percentage: 17.0, 
    coherence_score: 0.501,
    keywords: ["makeup", "tutorial", "beauty", "tips", "face"],
    top_keywords: [
      { keyword: "makeup", probability: 0.18 },
      { keyword: "beautiful", probability: 0.14 },
      { keyword: "tutorial", probability: 0.11 },
      { keyword: "tips", probability: 0.09 },
      { keyword: "face", probability: 0.08 }
    ]
  },
  { 
    topic_id: 14, 
    name: "Skincare Routines", 
    videos: 4698, 
    percentage: 13.4, 
    coherence_score: 0.523,
    keywords: ["skin", "skincare", "routine", "glow", "face"],
    top_keywords: [
      { keyword: "skin", probability: 0.16 },
      { keyword: "skincare", probability: 0.13 },
      { keyword: "glow", probability: 0.10 },
      { keyword: "routine", probability: 0.09 },
      { keyword: "face", probability: 0.08 }
    ]
  },
  { 
    topic_id: 6, 
    name: "Beauty Reviews", 
    videos: 4008, 
    percentage: 11.5, 
    coherence_score: 0.456,
    keywords: ["product", "review", "good", "best", "try"],
    top_keywords: [
      { keyword: "good", probability: 0.14 },
      { keyword: "product", probability: 0.12 },
      { keyword: "review", probability: 0.11 },
      { keyword: "best", probability: 0.09 },
      { keyword: "try", probability: 0.08 }
    ]
  },
  { 
    topic_id: 3, 
    name: "Regional Beauty", 
    videos: 2408, 
    percentage: 6.9, 
    coherence_score: 0.478,
    keywords: ["indian", "traditional", "look", "style", "culture"],
    top_keywords: [
      { keyword: "indian", probability: 0.13 },
      { keyword: "traditional", probability: 0.11 },
      { keyword: "beautiful", probability: 0.10 },
      { keyword: "look", probability: 0.09 },
      { keyword: "style", probability: 0.08 }
    ]
  },
  { 
    topic_id: 5, 
    name: "Color & Cosmetics", 
    videos: 1940, 
    percentage: 5.6, 
    coherence_score: 0.445,
    keywords: ["color", "lipstick", "red", "pink", "shade"],
    top_keywords: [
      { keyword: "color", probability: 0.15 },
      { keyword: "lipstick", probability: 0.12 },
      { keyword: "red", probability: 0.10 },
      { keyword: "pink", probability: 0.09 },
      { keyword: "shade", probability: 0.08 }
    ]
  },
  // Add more topics...
  { topic_id: 1, name: "Beauty Compliments", videos: 832, percentage: 2.4, coherence_score: 0.412, keywords: ["beautiful", "you", "so", "are", "gorgeous"], top_keywords: [{ keyword: "beautiful", probability: 0.18 }, { keyword: "you", probability: 0.16 }, { keyword: "so", probability: 0.14 }] },
  { topic_id: 15, name: "Product Recommendations", videos: 1666, percentage: 4.8, coherence_score: 0.467, keywords: ["product", "recommend", "use", "good", "best"], top_keywords: [{ keyword: "product", probability: 0.15 }, { keyword: "recommend", probability: 0.12 }] },
  { topic_id: 18, name: "Hair Styling Tips", videos: 1195, percentage: 3.4, coherence_score: 0.434, keywords: ["hair", "curl", "straight", "style", "tips"], top_keywords: [{ keyword: "hair", probability: 0.17 }, { keyword: "curl", probability: 0.13 }] },
  { topic_id: 10, name: "Makeup Application", videos: 1053, percentage: 3.0, coherence_score: 0.489, keywords: ["makeup", "apply", "foundation", "concealer", "brush"], top_keywords: [{ keyword: "makeup", probability: 0.19 }, { keyword: "apply", probability: 0.14 }] }
];

// Coherence scores for K optimization visualization
export const coherenceScores: CoherenceData[] = [
  { k: 4, coherence_score: 0.415 },
  { k: 6, coherence_score: 0.471 },
  { k: 8, coherence_score: 0.478 },
  { k: 10, coherence_score: 0.483 },
  { k: 12, coherence_score: 0.505 },
  { k: 14, coherence_score: 0.508 },
  { k: 16, coherence_score: 0.498 },
  { k: 18, coherence_score: 0.519 },
  { k: 20, coherence_score: 0.518 },
  { k: 22, coherence_score: 0.493 },
  { k: 24, coherence_score: 0.495 },
  { k: 26, coherence_score: 0.531 }, // Optimal K
  { k: 28, coherence_score: 0.500 },
  { k: 30, coherence_score: 0.483 }
];

// Sample high-confidence spam comments from analysis
export const spamSamples: SpamComment[] = [
  {
    commentId: "779733",
    textOriginal: "❤",
    classification_confidence: 1.0,
    spam_features: { caps_ratio: 0.0, repetition_ratio: 1.0, emoji_ratio: 1.0, likes_per_char: 0.5 }
  },
  {
    commentId: "3957190", 
    textOriginal: "UR SO CUTE AND PRETTY ❤❤",
    classification_confidence: 0.999999999,
    spam_features: { caps_ratio: 0.708, repetition_ratio: 0.167, emoji_ratio: 0.083, likes_per_char: 0.0 }
  },
  {
    commentId: "2022705",
    textOriginal: "Nice!",
    classification_confidence: 1.0,
    spam_features: { caps_ratio: 0.2, repetition_ratio: 1.0, emoji_ratio: 0.0, likes_per_char: 0.5 }
  },
  {
    commentId: "4560713",
    textOriginal: "OMG",
    classification_confidence: 1.0,
    spam_features: { caps_ratio: 1.0, repetition_ratio: 1.0, emoji_ratio: 0.0, likes_per_char: 0.0 }
  },
  {
    commentId: "4355064",
    textOriginal: "VASELINE!",
    classification_confidence: 1.0,
    spam_features: { caps_ratio: 0.889, repetition_ratio: 1.0, emoji_ratio: 0.0, likes_per_char: 0.0 }
  }
];

// Sample quality comments
export const qualityCommentSamples: QualityComment[] = [
  {
    commentId: "qual_001",
    textOriginal: "This tutorial really helped me understand the proper way to apply foundation. The step-by-step explanation was perfect!",
    likeCount: 127,
    video_id: "tutorial_vid_1",
    video_title: "Foundation Application for Beginners"
  },
  {
    commentId: "qual_002", 
    textOriginal: "I've been struggling with my skincare routine and this video gave me so many helpful tips. Thank you for sharing your knowledge!",
    likeCount: 89,
    video_id: "skincare_vid_2",
    video_title: "10-Step Korean Skincare Routine"
  },
  {
    commentId: "qual_003",
    textOriginal: "The color matching advice in this video is incredible. Finally found my perfect shade thanks to your guidance!",
    likeCount: 156,
    video_id: "color_vid_3", 
    video_title: "Finding Your Perfect Foundation Shade"
  },
  {
    commentId: "qual_004",
    textOriginal: "As someone with curly hair, I really appreciate the specific techniques you showed. Made such a difference in my routine!",
    likeCount: 201,
    video_id: "hair_vid_4",
    video_title: "Curly Hair Care Complete Guide"
  },
  {
    commentId: "qual_005",
    textOriginal: "Your reviews are always so honest and detailed. I trust your recommendations completely and they never disappoint!",
    likeCount: 78,
    video_id: "review_vid_5",
    video_title: "Honest Review: Top 5 Mascaras 2024"
  }
];

// Real quality metrics from your analysis  
export const qualityMetrics = {
  total_comments: 3325035,
  quality_comments: 3087679,  // 93%
  spam_comments: 235289,      // 7%
  uncertain_comments: 2067,   // <1%
  total_videos: 34949,
  topics_discovered: 26,
  model_coherence: 0.531,
  avg_confidence: 0.353
};

// Comment volume trends (simulated monthly data based on your dataset)
export const engagementTrends = [
  { month: "Jan 2024", quality: 287450, spam: 21230, total: 308680 },
  { month: "Feb 2024", quality: 295120, spam: 22140, total: 317260 },
  { month: "Mar 2024", quality: 301880, spam: 19750, total: 321630 },
  { month: "Apr 2024", quality: 318560, spam: 23890, total: 342450 },
  { month: "May 2024", quality: 334290, spam: 26110, total: 360400 },
  { month: "Jun 2024", quality: 298750, spam: 24330, total: 323080 },
  { month: "Jul 2024", quality: 312440, spam: 21890, total: 334330 },
  { month: "Aug 2024", quality: 289670, spam: 18560, total: 308230 },
  { month: "Sep 2024", quality: 305890, spam: 22470, total: 328360 },
  { month: "Oct 2024", quality: 326180, spam: 24890, total: 351070 },
  { month: "Nov 2024", quality: 294560, spam: 20330, total: 314890 },
  { month: "Dec 2024", quality: 323479, spam: 29699, total: 353178 }
];

// Sample video analysis results with highest comment counts
export const topVideosByComments: VideoAnalysis[] = [
  {
    videoId: "45",
    title: "Nainowaale ne #browngirl #ytshorts", 
    topic: 1,
    confidence: 0.221,
    viewCount: 62150681,
    commentCount: 11052
  },
  {
    videoId: "33", 
    title: "VEAMOS 3 DÍAS USANDO LA CINTURILLA DE SOL LEON!👀#viral #makeupartist",
    topic: 9,
    confidence: 0.724,
    viewCount: 9665013,
    commentCount: 1726
  },
  {
    videoId: "11",
    title: "I DYED MY HAIR AGAIN!?! 💇🏻‍♀️#baileyspinn",
    topic: 20,
    confidence: 0.303,
    viewCount: 2146535,
    commentCount: 264
  },
  {
    videoId: "44",
    title: "Restyling my farewell saree❤️ #shortsvideo #grwm",
    topic: 20,
    confidence: 0.465,
    viewCount: 71699,
    commentCount: 22
  },
  {
    videoId: "37",
    title: "💄 Just Red Lipstick The TikTok Trend That Replaces Your Whole Routine",
    topic: 21,
    confidence: 0.504,
    viewCount: 589052,
    commentCount: 19
  }
];

export const getTopicName = (topicId: number): string => {
  const topic = topicDistribution.find(t => t.topic_id === topicId);
  return topic ? topic.name : `Topic ${topicId}`;
};

export const getTopicKeywords = (topicId: number): string[] => {
  const topic = topicDistribution.find(t => t.topic_id === topicId);
  return topic ? topic.keywords : [];
};

export const getTopicCoherence = (topicId: number): number => {
  const topic = topicDistribution.find(t => t.topic_id === topicId);
  return topic?.coherence_score || 0;
};

// Sample video analyses for dashboard
export const sampleVideoAnalyses = [
  {
    videoId: "vid_001",
    title: "Perfect Foundation Routine for Oily Skin",
    channelName: "BeautyGuru123",
    viewCount: 1245000,
    commentCount: 3420,
    likeCount: 89500,
    publishedAt: "2024-03-15",
    topTopics: [1, 5, 12],
    spamPercentage: 6.2,
    qualityScore: 4.3,
    engagementRate: 7.8,
    thumbnailUrl: "https://example.com/thumb1.jpg"
  },
  {
    videoId: "vid_002", 
    title: "10-Minute Morning Makeup Routine",
    channelName: "QuickBeauty",
    viewCount: 890000,
    commentCount: 2156,
    likeCount: 67200,
    publishedAt: "2024-03-12",
    topTopics: [3, 8, 15],
    spamPercentage: 4.8,
    qualityScore: 4.6,
    engagementRate: 8.1,
    thumbnailUrl: "https://example.com/thumb2.jpg"
  },
  {
    videoId: "vid_003",
    title: "Honest L'Oréal Product Reviews",
    channelName: "HonestReviews",
    viewCount: 567000,
    commentCount: 4892,
    likeCount: 52300,
    publishedAt: "2024-03-10",
    topTopics: [6, 11, 18],
    spamPercentage: 8.1,
    qualityScore: 4.1,
    engagementRate: 9.2,
    thumbnailUrl: "https://example.com/thumb3.jpg"
  },
  {
    videoId: "vid_004",
    title: "Skincare Mistakes You're Making",
    channelName: "SkinExpert",
    viewCount: 1123000,
    commentCount: 2987,
    likeCount: 78900,
    publishedAt: "2024-03-08",
    topTopics: [2, 9, 14],
    spamPercentage: 5.3,
    qualityScore: 4.5,
    engagementRate: 7.3,
    thumbnailUrl: "https://example.com/thumb4.jpg"
  },
  {
    videoId: "vid_005",
    title: "Color Theory for Makeup Beginners",
    channelName: "ColorMaster",
    viewCount: 789000,
    commentCount: 1876,
    likeCount: 61200,
    publishedAt: "2024-03-05",
    topTopics: [4, 13, 20],
    spamPercentage: 3.9,
    qualityScore: 4.7,
    engagementRate: 8.5,
    thumbnailUrl: "https://example.com/thumb5.jpg"
  }
];