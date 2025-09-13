import json
import os
from typing import Dict, List, Any
import pandas as pd
from pathlib import Path

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
        """Load frontend data from the comprehensive_analysis.json file"""
        if frontend_data_path is None:
            # Try to find the frontend_data folder
            current_dir = Path(__file__).parent
            possible_paths = [
                current_dir / "../../frontend_data/comprehensive_analysis.json",
                current_dir / "../../../frontend_data/comprehensive_analysis.json",
                Path("./frontend_data/comprehensive_analysis.json"),
                Path("../frontend_data/comprehensive_analysis.json")
            ]
            
            for path in possible_paths:
                if path.exists():
                    frontend_data_path = str(path)
                    break
        
        if not frontend_data_path or not os.path.exists(frontend_data_path):
            print(f"Warning: Frontend data file not found at {frontend_data_path}")
            return {}
        
        try:
            with open(frontend_data_path, 'r', encoding='utf-8') as f:
                self.frontend_data = json.load(f)
            
            # Extract key metrics for easy access
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
                "topic_distribution": self.frontend_data.get("topic_statistics", {}).get("distribution", [])
            }
            
            return self.frontend_data
            
        except Exception as e:
            print(f"Error loading frontend data: {e}")
            return {}
    
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
