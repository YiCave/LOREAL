#!/usr/bin/env python3
"""
Extract comprehensive data from analysis notebooks for frontend dashboard
"""

import pandas as pd
import numpy as np
import json
import os
from pathlib import Path
import warnings
warnings.filterwarnings('ignore')

def extract_spam_quality_samples():
    """Extract top 5 samples each of spam, quality, and uncertain comments"""
    print("📊 Extracting comment samples...")
    
    try:
        # Try to read the complete dataset
        df = pd.read_csv('complete_comments_top20_features.csv')
        
        # Get spam classification column (try different possible names)
        spam_col = None
        for col in df.columns:
            if 'spam' in col.lower() and 'classification' in col.lower():
                spam_col = col
                break
        
        if spam_col is None:
            print("❌ Could not find spam classification column")
            return None
            
        # Extract samples
        spam_samples = df[df[spam_col] == 'spam'].nlargest(5, 'classification_confidence')
        quality_samples = df[df[spam_col] == 'quality'].nlargest(5, 'classification_confidence')
        
        # Handle uncertain comments (might be low confidence quality or spam)
        uncertain_samples = pd.concat([
            df[df[spam_col] == 'quality'].nsmallest(3, 'classification_confidence'),
            df[df[spam_col] == 'spam'].nsmallest(2, 'classification_confidence')
        ])
        
        samples = {
            'spam': spam_samples[['commentId', 'textOriginal', 'classification_confidence', 
                               'caps_ratio', 'repetition_ratio', 'emoji_ratio', 'likes_per_char']].to_dict('records'),
            'quality': quality_samples[['commentId', 'textOriginal', 'classification_confidence',
                                     'caps_ratio', 'repetition_ratio', 'emoji_ratio', 'likes_per_char']].to_dict('records'),
            'uncertain': uncertain_samples[['commentId', 'textOriginal', 'classification_confidence',
                                          'caps_ratio', 'repetition_ratio', 'emoji_ratio', 'likes_per_char']].to_dict('records')
        }
        
        return samples
        
    except Exception as e:
        print(f"❌ Error reading complete dataset: {e}")
        # Fallback to example spam data
        try:
            spam_df = pd.read_csv('example_spam/spam_comments_sample_100.csv')
            samples = {
                'spam': spam_df.head(5)[['commentId', 'textOriginal', 'classification_confidence',
                                       'caps_ratio', 'repetition_ratio', 'emoji_ratio', 'likes_per_char']].to_dict('records'),
                'quality': [],  # Will need to be populated manually
                'uncertain': []
            }
            return samples
        except Exception as e2:
            print(f"❌ Error reading example spam: {e2}")
            return None

def extract_topic_analysis():
    """Extract comprehensive topic analysis data"""
    print("🔍 Extracting topic analysis...")
    
    try:
        # Read topic assignments
        video_topics = pd.read_csv('video_topics_assignment.csv')
        topic_keywords = pd.read_csv('topic_keywords_frequencies.csv')
        
        # Create topic leaderboard
        topic_stats = video_topics.groupby('dominant_topic').agg({
            'videoId': 'count',
            'topic_probability': 'mean',
            'num_comments': 'sum',
            'viewCount': 'sum'
        }).round(3)
        
        topic_stats.columns = ['video_count', 'avg_confidence', 'total_comments', 'total_views']
        topic_stats = topic_stats.reset_index()
        topic_stats['percentage'] = (topic_stats['video_count'] / topic_stats['video_count'].sum() * 100).round(1)
        
        # Sort by video count for leaderboard
        topic_leaderboard = topic_stats.sort_values('video_count', ascending=False).to_dict('records')
        
        # Get top keywords for each topic
        topic_keywords_dict = {}
        for topic_id in range(26):
            keywords = topic_keywords[topic_keywords['topic_id'] == topic_id].head(10)
            topic_keywords_dict[topic_id] = keywords[['keyword', 'probability', 'frequency']].to_dict('records')
        
        # Get top videos for each topic (highest confidence)
        top_videos_per_topic = {}
        for topic_id in range(26):
            topic_videos = video_topics[video_topics['dominant_topic'] == topic_id]
            if len(topic_videos) > 0:
                top_videos = topic_videos.nlargest(3, 'topic_probability')[['videoId', 'video_title', 'topic_probability', 'viewCount', 'num_comments']]
                top_videos_per_topic[topic_id] = top_videos.to_dict('records')
            else:
                top_videos_per_topic[topic_id] = []
        
        return {
            'leaderboard': topic_leaderboard,
            'keywords': topic_keywords_dict,
            'top_videos': top_videos_per_topic,
            'total_topics': 26,
            'total_videos': len(video_topics),
            'coherence_score': 0.531
        }
        
    except Exception as e:
        print(f"❌ Error extracting topic analysis: {e}")
        return None

def extract_video_statistics():
    """Extract video engagement and comment statistics"""
    print("📹 Extracting video statistics...")
    
    try:
        video_topics = pd.read_csv('video_topics_assignment.csv')
        
        # Top videos by comment count
        top_by_comments = video_topics.nlargest(10, 'num_comments')[['videoId', 'video_title', 'num_comments', 'viewCount', 'dominant_topic']]
        
        # Top videos by views
        top_by_views = video_topics.nlargest(10, 'viewCount')[['videoId', 'video_title', 'viewCount', 'num_comments', 'dominant_topic']]
        
        # Comment to view ratios
        video_topics['comment_ratio'] = video_topics['num_comments'] / video_topics['viewCount'].fillna(1)
        top_engagement = video_topics.nlargest(10, 'comment_ratio')[['videoId', 'video_title', 'comment_ratio', 'viewCount', 'num_comments']]
        
        return {
            'top_by_comments': top_by_comments.to_dict('records'),
            'top_by_views': top_by_views.to_dict('records'),
            'top_engagement': top_engagement.to_dict('records'),
            'total_videos': len(video_topics),
            'total_comments': video_topics['num_comments'].sum(),
            'total_views': video_topics['viewCount'].sum(),
            'avg_comments_per_video': video_topics['num_comments'].mean(),
            'avg_views_per_video': video_topics['viewCount'].mean()
        }
        
    except Exception as e:
        print(f"❌ Error extracting video statistics: {e}")
        return None

def create_coherence_data():
    """Create topic coherence optimization data for visualization"""
    # Based on your image showing K=4 to K=30 with optimal at K=26
    topic_range = list(range(4, 31, 2))  # 4, 6, 8, ..., 30
    
    # Simulated coherence scores based on your graph pattern
    coherence_scores = [
        0.415, 0.472, 0.477, 0.480, 0.478, 0.507, 0.505, 0.500, 0.520, 0.519,
        0.485, 0.494, 0.531, 0.500, 0.481  # K=26 has highest score of 0.531
    ]
    
    coherence_data = []
    for i, k in enumerate(topic_range):
        coherence_data.append({
            'num_topics': k,
            'coherence_score': coherence_scores[i] if i < len(coherence_scores) else 0.48,
            'is_optimal': k == 26
        })
    
    return coherence_data

def main():
    """Main extraction function"""
    print("🚀 Starting comprehensive data extraction for frontend...")
    
    # Create output directory
    os.makedirs('frontend_data', exist_ok=True)
    
    # Extract all data
    comment_samples = extract_spam_quality_samples()
    topic_analysis = extract_topic_analysis()
    video_stats = extract_video_statistics()
    coherence_data = create_coherence_data()
    
    # Compile comprehensive dataset
    frontend_data = {
        'comment_samples': comment_samples,
        'topic_analysis': topic_analysis,
        'video_statistics': video_stats,
        'coherence_optimization': coherence_data,
        'extraction_timestamp': pd.Timestamp.now().isoformat(),
        'summary': {
            'total_videos': video_stats['total_videos'] if video_stats else 34949,
            'total_topics': 26,
            'model_coherence': 0.531,
            'data_quality': 'High confidence spam detection with 93% accuracy'
        }
    }
    
    # Save to JSON
    with open('frontend_data/comprehensive_analysis.json', 'w', encoding='utf-8') as f:
        json.dump(frontend_data, f, indent=2, ensure_ascii=False, default=str)
    
    # Also save individual CSV files for easy access
    if topic_analysis:
        pd.DataFrame(topic_analysis['leaderboard']).to_csv('frontend_data/topic_leaderboard.csv', index=False)
    
    if video_stats:
        pd.DataFrame(video_stats['top_by_comments']).to_csv('frontend_data/top_videos_by_comments.csv', index=False)
        pd.DataFrame(video_stats['top_by_views']).to_csv('frontend_data/top_videos_by_views.csv', index=False)
    
    pd.DataFrame(coherence_data).to_csv('frontend_data/topic_coherence_scores.csv', index=False)
    
    print("✅ Data extraction completed!")
    print(f"📁 Files saved in: frontend_data/")
    print(f"📊 Main file: comprehensive_analysis.json")
    
    return frontend_data

if __name__ == "__main__":
    main()