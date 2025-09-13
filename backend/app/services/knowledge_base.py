import json
import os
from typing import Dict, List, Any
from pathlib import Path

# Temporarily disable pandas for deployment
try:
    import pandas as pd
    PANDAS_AVAILABLE = True
except ImportError:
    PANDAS_AVAILABLE = False

class KnowledgeBaseService:
    """Service to manage the RAG knowledge base with frontend data and analysis documentation"""
    
    def __init__(self):
        self.knowledge_base = {}
        self.analysis_documentation = self._load_analysis_documentation()
        self.frontend_data = {}
        
    def _load_analysis_documentation(self) -> Dict[str, Any]:
        """Load the analysis documentation provided by the user"""
        return {
            "video_performance_analysis": {
                "average_views_by_duration": [
                    {"rank": 1, "duration": "1-5min", "performance": "highest"},
                    {"rank": 2, "duration": "16-60s(shorts)", "performance": "second_highest"},
                    {"rank": 3, "duration": "15-30min", "performance": "third_highest"},
                    {"rank": 4, "duration": "0-15s", "performance": "fourth"},
                    {"rank": 5, "duration": "5-15min", "performance": "fifth"},
                    {"rank": 6, "duration": "30+min", "performance": "lowest"}
                ],
                "most_common_topics": [
                    {"rank": 1, "topic": "Lifestyle(sociology)", "frequency": "highest"},
                    {"rank": 2, "topic": "Physical attractiveness", "frequency": "second_highest"}
                ],
                "most_common_tags": [
                    {"rank": 1, "tag": "makeup", "frequency": "highest"},
                    {"rank": 2, "tag": "shorts", "frequency": "second_highest"},
                    {"rank": 3, "tag": "makeup tutorial", "frequency": "third_highest"},
                    {"rank": 4, "tag": "beauty", "frequency": "fourth"},
                    {"rank": 5, "tag": "hair", "frequency": "fifth"},
                    {"rank": 6, "tag": "skincare", "frequency": "sixth"}
                ]
            },
            "engagement_correlations": {
                "like_count_view_count": {"correlation": 0.86, "strength": "very_strong"},
                "comment_count_like_count": {"correlation": 0.53, "strength": "moderate"},
                "comment_count_view_count": {"correlation": 0.42, "strength": "moderate"},
                "duration_engagement": {"correlation": 0.0, "strength": "no_correlation"}
            },
            "median_views_by_duration": [
                {"rank": 1, "duration": "15-30min", "performance": "highest_median"},
                {"rank": 2, "duration": "16-60s(shorts)", "performance": "second_highest"},
                {"rank": 3, "duration": "0-15s", "performance": "third"},
                {"rank": 4, "duration": "5-15min", "performance": "fourth"},
                {"rank": 5, "duration": "1-5min", "performance": "lowest_median"}
            ],
            "like_to_view_ratio_by_day": [
                {"rank": 1, "day": "Saturday", "ratio": "highest"},
                {"rank": 2, "day": "Friday", "ratio": "second_highest"},
                {"rank": 3, "day": "Thursday", "ratio": "third"},
                {"rank": 4, "day": "Monday", "ratio": "fourth"},
                {"rank": 5, "day": "Sunday", "ratio": "fifth"},
                {"rank": 6, "day": "Wednesday", "ratio": "sixth"},
                {"rank": 7, "day": "Tuesday", "ratio": "lowest"}
            ],
            "top_channels": [
                {"rank": 1, "channel_id": "45729", "performance": "dominant_first"},
                {"rank": 2, "channel_id": "26428", "performance": "second"},
                {"rank": 3, "channel_id": "34895", "performance": "third"},
                {"rank": 4, "channel_id": "29048", "performance": "fourth"},
                {"rank": 5, "channel_id": "18073", "performance": "fifth"}
            ],
            "view_distribution_by_language": [
                {"rank": 1, "language": "en", "performance": "highest"},
                {"rank": 2, "language": "en-IN", "performance": "second"},
                {"rank": 3, "language": "hi", "performance": "third"},
                {"rank": 4, "language": "unknown", "performance": "fourth"},
                {"rank": 5, "language": "en-US", "performance": "fifth"}
            ],
            "view_distribution_by_topic": [
                {"rank": 1, "topic": "Fashion", "performance": "highest"},
                {"rank": 2, "topic": "Lifestyle", "performance": "second"},
                {"rank": 3, "topic": "Physical Attractiveness", "performance": "third"},
                {"rank": 4, "topic": "Hobby", "performance": "fourth"},
                {"rank": 5, "topic": "Health", "performance": "fifth"}
            ],
            "high_performing_title_words": [
                {"rank": 1, "word": "makeup", "frequency": "highest"},
                {"rank": 2, "word": "hair", "frequency": "second"},
                {"rank": 3, "word": "shorts", "frequency": "third"},
                {"rank": 4, "word": "beauty", "frequency": "fourth"},
                {"rank": 5, "word": "look", "frequency": "fifth"}
            ],
            "optimal_publishing_hours": [
                {"rank": 1, "hour": 15, "performance": "highest_median_views"},
                {"rank": 2, "hour": 12, "performance": "second_highest"},
                {"rank": 3, "hour": 14, "performance": "third"},
                {"rank": 4, "hour": 16, "performance": "fourth"},
                {"rank": 5, "hour": 17, "performance": "fifth"}
            ],
            "viral_videos": [
                {"rank": 1, "video_id": "25465", "performance": "dominant_viral"},
                {"rank": 2, "video_id": "42479", "performance": "second_viral"},
                {"rank": 3, "video_id": "19273", "performance": "third_viral"},
                {"rank": 4, "video_id": "53418", "performance": "fourth_viral"},
                {"rank": 5, "video_id": "12963", "performance": "fifth_viral"}
            ]
        }
    
    def load_frontend_data(self, frontend_data_path: str = None) -> Dict[str, Any]:
        """Load frontend data from the comprehensive_analysis.json file - EXACT same data as frontend"""
        if frontend_data_path is None:
            # Try to find the frontend data folder (where it actually is)
            current_dir = Path(__file__).parent
            possible_paths = [
                current_dir / "../../frontend/src/data/comprehensive_analysis.json",
                current_dir / "../../../frontend/src/data/comprehensive_analysis.json",
                Path("./frontend/src/data/comprehensive_analysis.json"),
                Path("../frontend/src/data/comprehensive_analysis.json"),
                # Fallback to old path
                current_dir / "../../frontend_data/comprehensive_analysis.json",
                current_dir / "../../../frontend_data/comprehensive_analysis.json"
            ]
            
            for path in possible_paths:
                if path.exists():
                    frontend_data_path = str(path)
                    print(f"✅ Found frontend data at: {path}")
                    break
        
        if not frontend_data_path or not os.path.exists(frontend_data_path):
            print(f"Warning: Frontend data file not found at {frontend_data_path}")
            return {}
        
        try:
            with open(frontend_data_path, 'r', encoding='utf-8') as f:
                self.frontend_data = json.load(f)
            
            # Extract key metrics for easy access - EXACT same data as frontend
            self.knowledge_base = {
                "total_comments": self.frontend_data.get("comment_statistics", {}).get("total_comments", 0),
                "total_videos": self.frontend_data.get("video_statistics", {}).get("total_videos", 0),
                "quality_comments": self.frontend_data.get("comment_statistics", {}).get("quality_comments", 0),
                "spam_comments": self.frontend_data.get("comment_statistics", {}).get("spam_comments", 0),
                "uncertain_comments": self.frontend_data.get("comment_statistics", {}).get("uncertain_comments", 0),
                "coherence_score": self.frontend_data.get("topic_modeling", {}).get("coherence_score", 0),
                "optimal_topics": self.frontend_data.get("topic_modeling", {}).get("optimal_topics", 0),
                "top_topics": self.frontend_data.get("topic_statistics", {}).get("top_topics", []),
                "top_videos": self.frontend_data.get("video_statistics", {}).get("top_by_comments", []),
                "comment_samples": self.frontend_data.get("comment_samples", {}),
                "topic_distribution": self.frontend_data.get("topic_statistics", {}).get("distribution", []),
                # Add ALL frontend component data
                "frontend_topic_distribution": self._get_frontend_topic_data(),
                "quality_metrics": self._get_quality_metrics(),
                "top_videos_by_comments": self._get_top_videos_data(),
                "spam_comments_detailed": self._get_spam_comments_data(),
                "quality_comments_detailed": self._get_quality_comments_data(),
                "engagement_trends": self._get_engagement_trends(),
                "model_performance_data": self._get_model_performance_data(),
                "technical_architecture": self._get_technical_architecture()
            }
            
            return self.frontend_data
            
        except Exception as e:
            print(f"Error loading frontend data: {e}")
            return {}
    
    def _get_frontend_topic_data(self) -> List[Dict]:
        """Get the EXACT topic distribution data with detailed keywords that frontend displays"""
        # This is the EXACT same data from your frontend dataService.ts with ALL keywords and probabilities
        return [
            {
                "topic_id": 20, "name": "Hair Care & Styling", "videos": 8076, "percentage": 23.1, "coherence_score": 0.487,
                "keywords": ["hair", "style", "look", "beautiful", "amazing"],
                "top_keywords": [
                    {"keyword": "hair", "probability": 0.15},
                    {"keyword": "beautiful", "probability": 0.12},
                    {"keyword": "style", "probability": 0.10},
                    {"keyword": "look", "probability": 0.08},
                    {"keyword": "amazing", "probability": 0.07}
                ]
            },
            {
                "topic_id": 21, "name": "Makeup Tutorials", "videos": 5944, "percentage": 17.0, "coherence_score": 0.501,
                "keywords": ["makeup", "tutorial", "beauty", "tips", "face"],
                "top_keywords": [
                    {"keyword": "makeup", "probability": 0.18},
                    {"keyword": "beautiful", "probability": 0.14},
                    {"keyword": "tutorial", "probability": 0.11},
                    {"keyword": "tips", "probability": 0.09},
                    {"keyword": "face", "probability": 0.08}
                ]
            },
            {
                "topic_id": 14, "name": "Skincare Routines", "videos": 4698, "percentage": 13.4, "coherence_score": 0.523,
                "keywords": ["skin", "skincare", "routine", "glow", "face"],
                "top_keywords": [
                    {"keyword": "skin", "probability": 0.16},
                    {"keyword": "skincare", "probability": 0.13},
                    {"keyword": "glow", "probability": 0.10},
                    {"keyword": "routine", "probability": 0.09},
                    {"keyword": "face", "probability": 0.08}
                ]
            },
            {
                "topic_id": 6, "name": "Beauty Reviews", "videos": 4008, "percentage": 11.5, "coherence_score": 0.456,
                "keywords": ["product", "review", "good", "best", "try"],
                "top_keywords": [
                    {"keyword": "good", "probability": 0.14},
                    {"keyword": "product", "probability": 0.12},
                    {"keyword": "review", "probability": 0.11},
                    {"keyword": "best", "probability": 0.09},
                    {"keyword": "try", "probability": 0.08}
                ]
            },
            {
                "topic_id": 3, "name": "Regional Beauty", "videos": 2408, "percentage": 6.9, "coherence_score": 0.478,
                "keywords": ["indian", "traditional", "look", "style", "culture"],
                "top_keywords": [
                    {"keyword": "indian", "probability": 0.13},
                    {"keyword": "traditional", "probability": 0.11},
                    {"keyword": "beautiful", "probability": 0.10},
                    {"keyword": "look", "probability": 0.09},
                    {"keyword": "style", "probability": 0.08}
                ]
            },
            {
                "topic_id": 5, "name": "Color & Cosmetics", "videos": 1940, "percentage": 5.6, "coherence_score": 0.445,
                "keywords": ["color", "lipstick", "red", "pink", "shade"],
                "top_keywords": [
                    {"keyword": "color", "probability": 0.15},
                    {"keyword": "lipstick", "probability": 0.12},
                    {"keyword": "red", "probability": 0.10},
                    {"keyword": "pink", "probability": 0.09},
                    {"keyword": "shade", "probability": 0.08}
                ]
            },
            {
                "topic_id": 15, "name": "Product Recommendations", "videos": 1666, "percentage": 4.8, "coherence_score": 0.467,
                "keywords": ["product", "recommend", "use", "good", "best"],
                "top_keywords": [
                    {"keyword": "product", "probability": 0.15},
                    {"keyword": "recommend", "probability": 0.12},
                    {"keyword": "use", "probability": 0.10}
                ]
            }
        ]
    
    def _get_quality_metrics(self) -> Dict:
        """Get quality metrics data from frontend"""
        return {
            "total_comments": 3325035,
            "quality_comments": 3087679,  # 93%
            "spam_comments": 235289,      # 7%
            "uncertain_comments": 2067,   # <1%
            "total_videos": 34949,
            "topics_discovered": 26,
            "model_coherence": 0.531,
            "avg_confidence": 0.353
        }
    
    def _get_top_videos_data(self) -> List[Dict]:
        """Get top videos data from frontend"""
        return [
            {"videoId": "25465", "title": "Which is your favortie? #hairstyle #shortvideo #shorts #short", "viewCount": 83582866, "commentCount": 47437},
            {"videoId": "42479", "title": "BALD, Blonde, or Ginger???", "viewCount": 8440332, "commentCount": 31591},
            {"videoId": "19273", "title": "Easy makeup tutorial for beginners", "viewCount": 7200000, "commentCount": 28900},
            {"videoId": "53418", "title": "5 minute skincare routine", "viewCount": 6500000, "commentCount": 25400},
            {"videoId": "12963", "title": "Best hair products 2024", "viewCount": 5800000, "commentCount": 22100}
        ]
    
    def _get_spam_comments_data(self) -> List[Dict]:
        """Get detailed spam comments data"""
        return [
            {"commentId": "spam_001", "text": "FOLLOW ME FOR MORE BEAUTY TIPS!!! 💄💄💄", "confidence": 0.95, "features": {"caps_ratio": 0.8, "emoji_ratio": 0.3}},
            {"commentId": "spam_002", "text": "check out my channel pls subscribe like share", "confidence": 0.92, "features": {"caps_ratio": 0.0, "repetition_ratio": 0.2}},
            {"commentId": "spam_003", "text": "Nice!", "confidence": 0.87, "features": {"caps_ratio": 0.0, "emoji_ratio": 0.0}},
            {"commentId": "spam_004", "text": "SO BEAUTIFUL!!!!!!!!! ❤❤❤❤❤❤❤❤❤❤", "confidence": 0.91, "features": {"caps_ratio": 0.7, "emoji_ratio": 0.4}},
            {"commentId": "spam_005", "text": "first first first first", "confidence": 0.89, "features": {"repetition_ratio": 0.8}},
            {"commentId": "spam_006", "text": "OMG SO PRETTY OMG SO PRETTY OMG SO PRETTY", "confidence": 0.93, "features": {"caps_ratio": 1.0, "repetition_ratio": 0.6}}
        ]
    
    def _get_quality_comments_data(self) -> List[Dict]:
        """Get detailed quality comments data"""
        return [
            {"commentId": "2677046", "text": "Skinny jeans with knee-high boots and a cute cropped sweater looks adorable! That's an idea for my beautiful girlies who likes/feel comfy with them~ We all have a personal style and thats totally okay!", "likeCount": 0, "video_title": "Fashion Styling Tips"},
            {"commentId": "2339655", "text": "Il serait plus intéressant de te sublimer en tant que femme noire plutôt que d'essayer de ressembler à kylie jenner...", "likeCount": 0, "video_title": "Beauty Representation"},
            {"commentId": "625296", "text": "How do you achieve that slick back? 🧐", "likeCount": 0, "video_title": "Hair Styling Tutorial"},
            {"commentId": "qual_001", "text": "This tutorial really helped me understand the proper way to apply foundation. The step-by-step explanation was perfect!", "likeCount": 0, "video_title": "Foundation Application for Beginners"},
            {"commentId": "qual_002", "text": "I've been struggling with my skincare routine and this video gave me so many helpful tips. Thank you for sharing your knowledge!", "likeCount": 0, "video_title": "Skincare Routine Guide"}
        ]
    
    def _get_engagement_trends(self) -> List[Dict]:
        """Get engagement trends data"""
        return [
            {"month": "Jan 2024", "quality": 287450, "spam": 21230, "total": 308680},
            {"month": "Feb 2024", "quality": 295120, "spam": 22140, "total": 317260},
            {"month": "Mar 2024", "quality": 301880, "spam": 19750, "total": 321630},
            {"month": "Apr 2024", "quality": 318560, "spam": 23890, "total": 342450},
            {"month": "May 2024", "quality": 334290, "spam": 26110, "total": 360400},
            {"month": "Jun 2024", "quality": 298750, "spam": 24330, "total": 323080},
            {"month": "Jul 2024", "quality": 312440, "spam": 21890, "total": 334330},
            {"month": "Aug 2024", "quality": 289670, "spam": 18560, "total": 308230},
            {"month": "Sep 2024", "quality": 305890, "spam": 22470, "total": 328360},
            {"month": "Oct 2024", "quality": 326180, "spam": 24890, "total": 351070},
            {"month": "Nov 2024", "quality": 294560, "spam": 20330, "total": 314890},
            {"month": "Dec 2024", "quality": 323479, "spam": 29699, "total": 353178}
        ]
    
    def _get_model_performance_data(self) -> Dict:
        """Get model performance data"""
        return {
            "coherence_optimization": [
                {"k": 10, "coherence_score": 0.45},
                {"k": 15, "coherence_score": 0.48},
                {"k": 20, "coherence_score": 0.51},
                {"k": 25, "coherence_score": 0.53},
                {"k": 26, "coherence_score": 0.531, "optimal": True},
                {"k": 30, "coherence_score": 0.52}
            ],
            "spam_detection_accuracy": 0.929,  # 92.9%
            "gmm_clusters": 2,
            "lda_topics": 26,
            "total_comments_analyzed": 3325035
        }
    
    def _get_technical_architecture(self) -> Dict:
        """Get technical architecture information from README"""
        return {
            "frontend_tech_stack": {
                "framework": "React 19.1.1",
                "language": "TypeScript 4.9.5",
                "ui_library": "Material-UI 7.3.2",
                "styling": "Emotion 11.14.0",
                "charts": "Recharts 3.2.0",
                "data_fetching": "React Query 5.87.4",
                "http_client": "Axios 1.12.0"
            },
            "backend_tech_stack": {
                "framework": "FastAPI 0.104.1",
                "language": "Python 3.9+",
                "ai_framework": "LangChain 0.1.0",
                "ai_model": "Google Gemini 2.0 Flash",
                "vector_db": "ChromaDB 0.4.18",
                "embeddings": "Sentence Transformers 2.2.2",
                "data_processing": "Pandas 2.1.4, NumPy 1.24.3"
            },
            "ai_capabilities": {
                "business_intelligence": "Marketing insights and performance analysis",
                "dashboard_explanations": "Interactive guidance for understanding metrics",
                "rag_system": "Retrieval-Augmented Generation with knowledge base",
                "real_data_integration": "Powered by actual analysis from ngai_analysis.ipynb"
            },
            "data_sources": {
                "primary": "ngai_analysis.ipynb - Comprehensive Jupyter notebook with complete analysis",
                "frontend_data": "comprehensive_analysis.json - Processed real data",
                "comments_analyzed": "3.3M+ comments with quality/spam classification",
                "videos_analyzed": "500K+ videos with engagement patterns",
                "topics_discovered": "26 optimal topics using LDA analysis"
            }
        }
    
    def get_context_for_query(self, query: str, current_dashboard_state: Dict[str, Any] = None) -> Dict[str, Any]:
        """Get relevant context for a user query"""
        context = {
            "analysis_documentation": self.analysis_documentation,
            "frontend_metrics": self.knowledge_base,
            "current_state": current_dashboard_state or {}
        }
        
        # Add specific context based on query keywords
        query_lower = query.lower()
        
        if any(word in query_lower for word in ["engagement", "views", "likes", "comments"]):
            context["engagement_insights"] = self.analysis_documentation["engagement_correlations"]
            context["performance_data"] = self.analysis_documentation["video_performance_analysis"]
        
        if any(word in query_lower for word in ["topic", "content", "category"]):
            context["topic_insights"] = {
                "top_topics": self.analysis_documentation["video_performance_analysis"]["most_common_topics"],
                "topic_performance": self.analysis_documentation["view_distribution_by_topic"]
            }
        
        if any(word in query_lower for word in ["duration", "length", "time"]):
            context["duration_insights"] = {
                "average_views": self.analysis_documentation["video_performance_analysis"]["average_views_by_duration"],
                "median_views": self.analysis_documentation["median_views_by_duration"]
            }
        
        if any(word in query_lower for word in ["publish", "timing", "schedule", "day", "hour"]):
            context["timing_insights"] = {
                "best_days": self.analysis_documentation["like_to_view_ratio_by_day"],
                "best_hours": self.analysis_documentation["optimal_publishing_hours"]
            }
        
        return context
    
    def analyze_engagement_performance(self, user_engagement_claim: str, current_metrics: Dict[str, Any] = None) -> Dict[str, Any]:
        """Analyze user's engagement claims against real data benchmarks"""
        analysis = {
            "user_claim": user_engagement_claim,
            "benchmarks": {},
            "assessment": {},
            "recommendations": []
        }
        
        # Get benchmark data
        benchmarks = self.analysis_documentation["engagement_correlations"]
        analysis["benchmarks"] = benchmarks
        
        # Analyze against benchmarks
        if "correlation" in user_engagement_claim.lower():
            analysis["assessment"]["correlation_analysis"] = "Based on our data analysis, like count has 86% correlation with view count, comment count has 53% correlation with like count, and 42% correlation with view count."
        
        if any(word in user_engagement_claim.lower() for word in ["low", "poor", "bad", "declining"]):
            analysis["assessment"]["performance_status"] = "concerning"
            analysis["recommendations"].extend([
                "Consider optimizing video duration to 1-5 minutes or 16-60 seconds for better performance",
                "Focus on makeup, hair, and beauty content which performs best",
                "Publish on Saturdays and Fridays for optimal engagement",
                "Use keywords like 'makeup', 'hair', 'beauty' in titles"
            ])
        elif any(word in user_engagement_claim.lower() for word in ["good", "high", "great", "excellent"]):
            analysis["assessment"]["performance_status"] = "positive"
            analysis["recommendations"].extend([
                "Maintain current strategies that are working well",
                "Consider scaling successful content patterns",
                "Analyze what specific elements are driving your success"
            ])
        
        return analysis
    
    def get_benchmark_data(self) -> Dict[str, Any]:
        """Get all benchmark data for comparison"""
        return {
            "engagement_benchmarks": self.analysis_documentation["engagement_correlations"],
            "performance_benchmarks": self.analysis_documentation["video_performance_analysis"],
            "timing_benchmarks": {
                "best_days": self.analysis_documentation["like_to_view_ratio_by_day"],
                "best_hours": self.analysis_documentation["optimal_publishing_hours"]
            },
            "content_benchmarks": {
                "top_topics": self.analysis_documentation["view_distribution_by_topic"],
                "top_tags": self.analysis_documentation["video_performance_analysis"]["most_common_tags"],
                "top_words": self.analysis_documentation["high_performing_title_words"]
            }
        }
