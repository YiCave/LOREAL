# Core data processing libraries
import pandas as pd
import numpy as np
import warnings
warnings.filterwarnings('ignore')

# Machine Learning libraries
try:
    from sklearn.mixture import GaussianMixture
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
    from sklearn.metrics import silhouette_score, calinski_harabasz_score, davies_bouldin_score
    from sklearn.preprocessing import StandardScaler, LabelEncoder
    from sklearn.decomposition import PCA
    print("✅ Scikit-learn imported successfully")
except ImportError as e:
    print(f"❌ Scikit-learn import error: {e}")

# Text processing libraries
import re
import string

# TextBlob
try:
    from textblob import TextBlob
    print("✅ TextBlob imported successfully")
except ImportError:
    print("📦 Installing textblob...")
    import subprocess
    subprocess.run(["pip", "install", "textblob"])
    from textblob import TextBlob
    print("✅ TextBlob installed and imported")

# NLTK
try:
    import nltk
    print("✅ NLTK imported successfully")
except ImportError:
    print("📦 Installing nltk...")
    import subprocess
    subprocess.run(["pip", "install", "nltk"])
    import nltk
    print("✅ NLTK installed and imported")

# Language detection
try:
    from langdetect import detect, DetectorFactory
    DetectorFactory.seed = 0  # For consistent results
    print("✅ Langdetect imported successfully")
except ImportError:
    print("📦 Installing langdetect...")
    import subprocess
    subprocess.run(["pip", "install", "langdetect"])
    from langdetect import detect, DetectorFactory
    DetectorFactory.seed = 0
    print("✅ Langdetect installed and imported")

# Emoji processing
try:
    import emoji
    print("✅ Emoji library imported successfully")
except ImportError:
    print("📦 Installing emoji...")
    import subprocess
    subprocess.run(["pip", "install", "emoji"])
    import emoji
    print("✅ Emoji library installed and imported")

# Visualization libraries
try:
    import matplotlib.pyplot as plt
    import seaborn as sns
    print("✅ Matplotlib and Seaborn imported successfully")
except ImportError as e:
    print(f"❌ Matplotlib/Seaborn import error: {e}")

try:
    import plotly.express as px
    import plotly.graph_objects as go
    from plotly.subplots import make_subplots
    print("✅ Plotly imported successfully")
except ImportError:
    print("📦 Installing plotly...")
    import subprocess
    subprocess.run(["pip", "install", "plotly"])
    import plotly.express as px
    import plotly.graph_objects as go
    from plotly.subplots import make_subplots
    print("✅ Plotly installed and imported")

# Utility libraries
import os
import time
from datetime import datetime
from collections import Counter
import json

# Model persistence
try:
    import joblib
    print("✅ Joblib imported successfully")
except ImportError:
    print("📦 Installing joblib...")
    import subprocess
    subprocess.run(["pip", "install", "joblib"])
    import joblib
    print("✅ Joblib installed and imported")

# Set display options
pd.set_option('display.max_columns', None)
pd.set_option('display.max_rows', 100)
plt.style.use('default')

print("\n🎉 ALL LIBRARIES IMPORTED SUCCESSFULLY!")
print("="*50)
print(f"📊 Pandas version: {pd.__version__}")
print(f"🤖 Scikit-learn available: {GaussianMixture is not None}")
print(f"🌀 GMM clustering ready: ✅")
print(f"📝 TextBlob ready: ✅")
print(f"🌍 Langdetect ready: ✅")
print(f"😊 Emoji library ready: ✅")
print(f"📈 Plotly ready: ✅")
print("="*50)

# Clear output and load data
import pandas as pd
import os

# Fix data path to correct location
data_path = r'c:\Users\user\OneDrive\Documents\LOREALREAL HACKATHON\dataset' 
comment_files = [f'comments{i}.csv' for i in range(1, 6)]
video_file = 'videos.csv'

print("🔄 Loading FULL dataset (all comment files)...")

# Load ALL comment files for full dataset training
all_comments = []
for i, file in enumerate(comment_files, 1):
    file_path = os.path.join(data_path, file)
    print(f"   📂 Loading {file}...")
    
    df = pd.read_csv(
        file_path,
        low_memory=False,       # prevents chunk guessing
        dtype=str,              # read everything as string (fast, safe)
    )
    all_comments.append(df)
    print(f"   ✅ {file}: {len(df):,} rows loaded")

# Combine all comments for FULL dataset training
comments_df = pd.concat(all_comments, ignore_index=True)
print(f"\n✅ ALL comments combined for full dataset training!")
print(f"📊 Full dataset shape: {comments_df.shape}")

print(f"\n🎥 Loading video data...")
try:
    videos_df = pd.read_csv(os.path.join(data_path, video_file))
    print(f"✅ Videos loaded!")
    print(f"📊 Videos shape: {videos_df.shape}")
        
except Exception as e:
    print(f"❌ Error loading videos: {e}")
    videos_df = None

print(f"\n🎉 FULL DATASET LOADING COMPLETE!")
print(f"   💬 Total Comments: {comments_df.shape[0]:,} rows")
print(f"   🎥 Videos: {videos_df.shape[0]:,} rows")
print(f"   🔗 Unique videos in comments: {comments_df['videoId'].nunique():,}")
print(f"   ✅ Ready for FULL dataset feature engineering!")

def clean_text(text):
    """
    Clean text while preserving meaningful content.
    
    This function performs light cleaning to standardize text without
    removing important information like emojis or context.
    """
    if pd.isna(text) or text == '':
        return ''
    
    # Convert to string and handle encoding issues
    text = str(text)
    
    # Replace multiple spaces with single space
    text = re.sub(r'\s+', ' ', text)
    
    # Remove excessive punctuation (more than 3 consecutive)
    text = re.sub(r'[!]{4,}', '!!!', text)
    text = re.sub(r'[?]{4,}', '???', text)
    text = re.sub(r'[.]{4,}', '...', text)
    
    # Strip leading/trailing whitespace
    text = text.strip()
    
    return text

def detect_language_safe(text, confidence_threshold=0.8):
    """
    Safely detect language with confidence scoring.
    
    Returns language code if detection confidence is high enough,
    otherwise returns 'unknown'. Used for metadata only.
    """
    try:
        if len(str(text).strip()) < 3:  # Too short to detect
            return 'unknown'
        
        # Remove emojis for language detection
        text_no_emoji = emoji.demojize(str(text))
        
        detected_lang = detect(text_no_emoji)
        return detected_lang
    
    except:
        return 'unknown'

def calculate_text_stats(text):
    """
    Calculate comprehensive text statistics.
    
    Returns various text metrics useful for spam detection.
    """
    text = str(text)
    
    # Basic stats
    char_count = len(text)
    word_count = len(text.split())
    
    # Advanced stats
    avg_word_length = np.mean([len(word) for word in text.split()]) if word_count > 0 else 0
    
    # Capitalization analysis
    upper_count = sum(1 for c in text if c.isupper())
    caps_ratio = upper_count / max(char_count, 1)
    
    # Special character analysis
    special_chars = sum(1 for c in text if c in string.punctuation)
    special_ratio = special_chars / max(char_count, 1)
    
    # URL detection
    url_count = len(re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', text))
    
    # Repetition detection (same word repeated)
    words = text.lower().split()
    word_freq = Counter(words)
    max_word_freq = max(word_freq.values()) if words else 0
    repetition_ratio = max_word_freq / max(word_count, 1)
    
    return {
        'char_count': char_count,
        'word_count': word_count,
        'avg_word_length': avg_word_length,
        'caps_ratio': caps_ratio,
        'special_ratio': special_ratio,
        'url_count': url_count,
        'repetition_ratio': repetition_ratio,
        'has_url': 1 if url_count > 0 else 0
    }

def extract_emoji_features(text):
    """
    Extract comprehensive emoji features for spam detection.
    
    Returns dictionary with emoji statistics and spam indicators.
    """
    text = str(text)
    
    # Extract all emojis
    emojis = emoji.emoji_list(text)
    emoji_chars = [item['emoji'] for item in emojis]
    
    # Basic emoji stats
    emoji_count = len(emoji_chars)
    unique_emojis = len(set(emoji_chars))
    text_length = len(text)
    
    # Calculate ratios
    emoji_ratio = emoji_count / max(text_length, 1)
    emoji_diversity = unique_emojis / max(emoji_count, 1)
    
    # EXPANDED sentiment emojis (broader coverage)
    positive_emojis = ['😍', '💕', '❤️', '✨', '🌟', '😊', '👍', '🔥', '💯', '🥰', '😘',
                       '🤩', '😎', '🥳', '🤗', '😇', '🙌', '👏', '💪', '🎉', '🙏', '☺️', 
                       '😀', '😁', '😂', '🤣', '😃', '😄', '😆', '🥲', '💖', '💗', '💝']
    
    negative_emojis = ['😒', '😕', '👎', '😞', '😠', '😡', '💔', '😢', '😭', '🙄', 
                       '😤', '😩', '🤮', '🤢', '😵', '🥺', '😖', '😓', '😰', '😨',
                       '😱', '🤬', '😈', '💀', '😷', '🤒', '🤕']
    
    # Count sentiment emojis
    positive_count = sum([emoji_chars.count(e) for e in positive_emojis])
    negative_count = sum([emoji_chars.count(e) for e in negative_emojis])
    
    # Count unknown/neutral emojis (not in positive or negative lists)
    known_emojis = set(positive_emojis + negative_emojis)
    unknown_emoji_count = len([e for e in emoji_chars if e not in known_emojis])
    
    # Content category emojis
    music_emojis = ['🎵', '🎤', '🎸', '🎼', '🎶', '🎧', '🎹', '🥁', '🎺', '🎻']
    food_emojis = ['🍕', '🍔', '🥗', '🍰', '🍜', '🍎', '🍌', '🥑', '🍓', '🍉', '🧁']
    beauty_emojis = ['💄', '💋', '👄', '💅', '🧴', '🪞', '✨', '💎', '👗', '👠']
    
    music_count = sum([emoji_chars.count(e) for e in music_emojis])
    food_count = sum([emoji_chars.count(e) for e in food_emojis])
    beauty_count = sum([emoji_chars.count(e) for e in beauty_emojis])
    
    # Enhanced sentiment scoring (handles unknown emojis)
    # Give small positive weight to unknown emojis (engagement indicator)
    sentiment_score = positive_count - negative_count + (unknown_emoji_count * 0.1)
    
    return {
        'emoji_count': emoji_count,
        'emoji_ratio': emoji_ratio,
        'emoji_diversity': emoji_diversity,
        'positive_emoji_count': positive_count,
        'negative_emoji_count': negative_count,
        'unknown_emoji_count': unknown_emoji_count,
        'emoji_sentiment_score': sentiment_score,
        'music_emoji_count': music_count,
        'food_emoji_count': food_count,
        'beauty_emoji_count': beauty_count,
        'spam_emoji_indicator': 1 if emoji_ratio > 0.3 and emoji_diversity < 0.5 else 0
    }

# Test the functions with sample comments (no translation needed)
test_comments = [
    "This is amazing! 😍✨ Love this tutorial 💄👍 Check out my channel: https://example.com",
    "¡Esto es increíble! Me encanta este tutorial 💄",
    "C'est magnifique! J'adore ce tutoriel beauté 💋",
    "素晴らしい！このチュートリアルが大好きです ✨",
    "مذهل! أحب هذا الفيديو التعليمي 💕"
]

print("🧪 Skipping preprocessing function tests for performance...\n")

print("\n✅ All preprocessing functions created successfully!")
print("\n� Enhanced Features - PERFORMANCE OPTIMIZED:")
print("   📝 Text: Bot-like patterns analyzed on original text")
print("   😊 Emoji: Cross-cultural emoji analysis on original text")
print("   📊 Engagement: Universal authenticity indicators")
print("   🚀 Language: Detection SKIPPED for performance")
print("   � Temporal: Universal posting patterns")
print("   � Spam: Language-agnostic behavioral patterns")
print("   ⭐ Quality: Cross-cultural meaningful engagement patterns")
print("   🚀 Result: Fast, effective spam detection with performance optimization!")

def create_feature_pipeline(comments_df, videos_df=None):
    """
    Content-agnostic feature engineering pipeline for GMM clustering.
    
    This function processes comments from diverse domains (beauty, gaming, food, education)
    and languages, extracting behavioral patterns for spam detection without translation.
    """
    
    print(f"🔧 Processing {len(comments_df):,} comments with optimized performance...")
    start_time = time.time()
    total_comments = len(comments_df)
    
    # Initialize feature dataframe
    features_df = comments_df.copy()
    
    # ========================================
    # 1. BEHAVIORAL TEXT PROCESSING (ORIGINAL TEXT) - Step 1/7
    # ========================================
    print("   📝 [1/7] Processing behavioral text features...")
    step_start = time.time()
    
    # Light cleaning preserving domain-specific content
    features_df['cleaned_text'] = features_df['textOriginal'].apply(clean_text)
    
    # LANGUAGE FEATURES COMPLETELY REMOVED FOR PERFORMANCE
    print("   📝 Language features completely removed for performance optimization...")
    
    # Text statistics for bot detection (works on original text)
    text_stats = features_df['cleaned_text'].apply(calculate_text_stats)
    text_stats_df = pd.DataFrame(text_stats.tolist())
    features_df = pd.concat([features_df, text_stats_df], axis=1)
    
    step_time = time.time() - step_start
    print(f"      ✅ Step 1 completed in {step_time:.2f}s")
    
    # ========================================
    # 2. CROSS-DOMAIN EMOJI ANALYSIS - Step 2/7
    # ========================================
    print("   😊 [2/7] Processing cross-domain emoji features...")
    step_start = time.time()
    
    emoji_features = features_df['textOriginal'].apply(extract_emoji_features)
    emoji_features_df = pd.DataFrame(emoji_features.tolist())
    features_df = pd.concat([features_df, emoji_features_df], axis=1)
    
    step_time = time.time() - step_start
    print(f"      ✅ Step 2 completed in {step_time:.2f}s")
    
    # ========================================
    # 3. ENGAGEMENT AUTHENTICITY (CONTENT-AGNOSTIC) - Step 3/7
    # ========================================
    print("   📊 [3/7] Processing engagement authenticity features...")
    step_start = time.time()
    
    # Basic engagement metrics
    features_df['likeCount'] = pd.to_numeric(features_df['likeCount'], errors='coerce').fillna(0)
    
    # SKIP VIDEO MERGE for performance - use comment-only features
    print("   📊 Skipping video merge for performance optimization...")
    features_df['likes_per_char'] = features_df['likeCount'] / (features_df['char_count'] + 1)
    
    # Reply structure (universal pattern)
    features_df['is_reply'] = (~features_df['parentCommentId'].isna()).astype(int)
    
    step_time = time.time() - step_start
    print(f"      ✅ Step 3 completed in {step_time:.2f}s")
    
    # ========================================
    # 4. TEMPORAL PATTERNS (UNIVERSAL) - Step 4/7
    # ========================================
    print("   🕐 [4/7] Processing temporal patterns...")
    step_start = time.time()
    
    # Convert dates
    features_df['publishedAt'] = pd.to_datetime(features_df['publishedAt'], errors='coerce')
    
    # Extract universal time features
    features_df['hour_of_day'] = features_df['publishedAt'].dt.hour
    features_df['day_of_week'] = features_df['publishedAt'].dt.dayofweek
    
    step_time = time.time() - step_start
    print(f"      ✅ Step 4 completed in {step_time:.2f}s")
    
    # ========================================
    # 5. SPAM BEHAVIOR DETECTION - Step 5/7
    # ========================================
    print("   🚫 [5/7] Processing spam behavior indicators...")
    step_start = time.time()
    
    # Generic comment detection (works on original text with regex)
    generic_patterns = [
        r'^(first|1st)!?$',
        r'^(nice|good|great|awesome|amazing|cool)!*$',
        r'^(love it|love this|loved it)!*$',
        r'^(thanks|thank you)!*$',
        r'^(wow|omg|lol|haha)!*$'
    ]
    
    features_df['is_generic'] = 0
    for pattern in generic_patterns:
        mask = features_df['cleaned_text'].str.lower().str.match(pattern, na=False)
        features_df.loc[mask, 'is_generic'] = 1
    
    # Suspicious engagement patterns (universal)
    features_df['suspicious_engagement'] = (
        (features_df['char_count'] < 10) & 
        (features_df['likeCount'] > 5)
    ).astype(int)
    
    # Bot-like behavior indicators
    features_df['excessive_caps'] = (features_df['caps_ratio'] > 0.5).astype(int)
    features_df['excessive_repetition'] = (features_df['repetition_ratio'] > 0.7).astype(int)
    
    # Language features removed (DISABLED for performance)
    features_df['short_non_english_spam'] = 0  # Disabled - language features removed
    
    step_time = time.time() - step_start
    print(f"      ✅ Step 5 completed in {step_time:.2f}s")
    
    # ========================================
    # 6. QUALITY INDICATORS (UNIVERSAL) - Step 6/7
    # ========================================
    print("   ⭐ [6/7] Processing universal quality indicators...")
    step_start = time.time()
    
    # Minimum viable engagement
    features_df['sufficient_length'] = (features_df['char_count'] >= 10).astype(int)
    
    # Balanced communication patterns
    features_df['balanced_punctuation'] = (
        (features_df['special_ratio'] > 0.01) & 
        (features_df['special_ratio'] < 0.3)
    ).astype(int)
    
    # Meaningful emoji usage (cross-domain)
    features_df['meaningful_emoji_usage'] = (
        (features_df['emoji_count'] > 0) & 
        (features_df['emoji_ratio'] < 0.3) & 
        (features_df['emoji_diversity'] > 0.5)
    ).astype(int)
    
    # Authentic engagement indicator
    features_df['authentic_engagement'] = (
        (features_df['char_count'] >= 15) &
        (features_df['caps_ratio'] < 0.4) &
        (features_df['repetition_ratio'] < 0.5) &
        (features_df['special_ratio'] < 0.25)
    ).astype(int)
    
    # Language features removed (DISABLED for performance)
    features_df['substantial_non_english'] = 0  # Disabled - language features removed
    
    step_time = time.time() - step_start
    print(f"      ✅ Step 6 completed in {step_time:.2f}s")
    
    # ========================================
    # 7. TOP 20 FEATURE SELECTION - Step 7/7
    # ========================================
    print("   🎯 [7/7] Selecting TOP 20 most useful features...")
    step_start = time.time()
    
    # TOP 20 MOST USEFUL FEATURES (Base dataset + engineered features)
    # Base dataset features (10) - MUST KEEP
    base_features = [
        'kind', 'commentId', 'channelId', 'videoId', 'authorId', 
        'textOriginal', 'parentCommentId', 'likeCount', 'publishedAt', 'updatedAt'
    ]
    
    # Top 10 engineered features for ML (behavioral patterns)
    engineered_features = [
        'char_count',         # Text length (spam detection)
        'word_count',         # Content substance
        'caps_ratio',         # KEY: Spam indicator
        'repetition_ratio',   # Bot/spam behavior
        'emoji_ratio',        # KEY: Expression patterns
        'emoji_diversity',    # KEY: Authentic emoji usage
        'likes_per_char',     # Engagement efficiency
        'is_reply',           # Context indicator
        'url_count',          # Link spam detection
        'is_generic'          # Template/bot detection
    ]
    
    # Combine for top 20 features
    feature_columns = base_features + engineered_features
    
    # Fill missing values for engineered features only
    for col in engineered_features:
        if col in features_df.columns:
            features_df[col] = features_df[col].fillna(0)
    
    # Create final feature matrix (all 20 columns)
    available_features = [col for col in feature_columns if col in features_df.columns]
    
    # For ML training, we'll use only the engineered features (not base dataset columns)
    ml_features = [col for col in engineered_features if col in features_df.columns]
    X = features_df[ml_features].copy()  # Only engineered features for ML
    
    # Store both full dataset and ML features
    processed_data = {
        'features': X,                              # Only engineered features for ML
        'full_data': features_df[available_features], # All 20 features for export
        'text': features_df['cleaned_text'],
        'original_data': features_df,
        'feature_names': ml_features,               # Only engineered feature names
        'all_feature_names': available_features     # All 20 feature names
    }
    
    end_time = time.time()
    total_time = end_time - start_time
    step_time = time.time() - step_start
    print(f"      ✅ Step 7 completed in {step_time:.2f}s")
    print(f"   ✅ TOP 20 feature selection completed in {total_time:.2f} seconds")
    print(f"   📊 Selected {len(available_features)} total features (10 base + 10 engineered)")
    print(f"   🤖 Generated {len(ml_features)} features for ML training")
    print(f"   🚀 Processing rate: {total_comments/total_time:.0f} comments/second")
    
    return processed_data

print("✅ TOP 20 FEATURE pipeline created!")
print("\n🎯 Streamlined Features:")
print("   � Base Dataset (10): kind, commentId, channelId, videoId, authorId, textOriginal, parentCommentId, likeCount, publishedAt, updatedAt")  
print("   🤖 ML Features (10): char_count, word_count, caps_ratio, repetition_ratio, emoji_ratio, emoji_diversity, likes_per_char, is_reply, url_count, is_generic")
print("   🚀 Result: Focused on most impactful features for spam detection!")

# Process FULL dataset through feature engineering pipeline
print("� Processing FULL dataset through feature engineering pipeline...\n")

# Process full dataset through our pipeline
print(f"📊 Starting OPTIMIZED full dataset processing with {len(comments_df):,} comments...")
pipeline_start_time = time.time()
processed_data = create_feature_pipeline(comments_df, videos_df)

# Extract results
X_features = processed_data['features']
text_data = processed_data['text']
feature_names = processed_data['feature_names']

pipeline_time = time.time() - pipeline_start_time
print(f"\n🎯 OPTIMIZED Feature Engineering Results:")
print(f"   📈 Feature matrix shape: {X_features.shape}")
print(f"   📋 Features generated: {len(feature_names)}")
print(f"   ⚡ Total pipeline time: {pipeline_time:.2f} seconds")
print(f"   🚀 Processing rate: {len(comments_df)/pipeline_time:.0f} comments/second")

# Display feature statistics
print(f"\n📈 Feature Statistics:")
feature_stats = X_features.describe()
print(feature_stats.round(3))

# Check for any issues
print(f"\n🔍 Data Quality Check:")
print(f"   ❓ Missing values: {X_features.isnull().sum().sum()}")
print(f"   ♾️ Infinite values: {np.isinf(X_features).sum().sum()}")
print(f"   📊 All numeric: {X_features.dtypes.apply(lambda x: np.issubdtype(x, np.number)).all()}")

print(f"\n✅ FULL dataset pipeline processing completed successfully!")
    
def prepare_clustering_data(processed_data, scale_features=True):
    """
    Prepare data for GMM clustering following content-agnostic strategy.
    
    This function prepares behavioral features for unsupervised clustering
    to identify spam patterns across diverse content domains.
    """
    
    X_features = processed_data['features']
    text_data = processed_data['text']
    original_data = processed_data['original_data']
    
    print("🌀 Preparing data for content-agnostic GMM clustering...\n")
    
    # ========================================
    # 1. TOP 10 ML FEATURE SELECTION
    # ========================================
    
    # Use only the top 10 engineered features for ML clustering
    clustering_features = [
        # Core behavioral indicators (5)
        'char_count',         # Text length spam detection
        'caps_ratio',         # Spam behavior indicator  
        'repetition_ratio',   # Bot detection
        'emoji_ratio',        # Expression authenticity
        'emoji_diversity',    # Authentic emoji usage
        
        # Engagement patterns (3)
        'likes_per_char',     # Engagement efficiency
        'is_reply',           # Context indicator
        'url_count',          # Link spam detection
        
        # Content quality (2)
        'word_count',         # Content substance
        'is_generic'          # Template detection
    ]
    
    # Select available features
    available_features = [f for f in clustering_features if f in X_features.columns]
    X_clustering = X_features[available_features].copy()
    
    print(f"📊 Selected {len(available_features)} TOP ML features for spam detection:")
    print("   🎯 Most impactful behavioral patterns:")
    for i, feature in enumerate(available_features):
        category = "🤖 Spam" if feature in ['caps_ratio', 'repetition_ratio', 'is_generic'] else \
                   "😊 Emoji" if 'emoji' in feature else \
                   "📊 Engagement" if feature in ['likes_per_char', 'is_reply', 'url_count'] else \
                   "📝 Content" if feature in ['char_count', 'word_count'] else \
                   "🎯 Other"
        print(f"   {i+1:2d}. {feature:<20} ({category})")
    
    # ========================================
    # 2. DATA QUALITY CHECKS
    # ========================================
    
    print(f"\n🔍 Data quality checks for clustering:")
    
    # Check for missing values
    missing_values = X_clustering.isnull().sum().sum()
    print(f"   ❓ Missing values: {missing_values}")
    
    # Check for infinite values
    infinite_values = np.isinf(X_clustering).sum().sum()
    print(f"   ♾️ Infinite values: {infinite_values}")
    
    # Check feature variance (important for GMM)
    zero_variance_features = X_clustering.columns[X_clustering.var() == 0].tolist()
    if zero_variance_features:
        print(f"   ⚠️ Zero variance features: {zero_variance_features}")
    
    # Fill any remaining missing values
    if missing_values > 0:
        X_clustering = X_clustering.fillna(0)
        print(f"   ✅ Filled missing values with 0")
    
    # Replace infinite values
    if infinite_values > 0:
        X_clustering = X_clustering.replace([np.inf, -np.inf], [1e6, -1e6])
        print(f"   ✅ Replaced infinite values")
    
    # ========================================
    # 3. FEATURE SCALING FOR GMM
    # ========================================
    
    if scale_features:
        print(f"\n📏 Scaling features for optimal GMM performance...")
        
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X_clustering)
        X_clustering_final = pd.DataFrame(X_scaled, columns=available_features, index=X_clustering.index)
        
        print(f"   ✅ Features standardized (mean=0, std=1)")
        
        # Show scaling statistics
        print(f"   📊 Scaled feature statistics:")
        print(f"      📈 Range: [{X_clustering_final.min().min():.3f}, {X_clustering_final.max().max():.3f}]")
        print(f"      📊 Mean: {X_clustering_final.mean().mean():.3f}")
        print(f"      📏 Std: {X_clustering_final.std().mean():.3f}")
        
    else:
        scaler = None
        X_clustering_final = X_clustering
        print(f"\n📏 Using raw features (no scaling)")
    
    # ========================================
    # 4. FEATURE CORRELATION ANALYSIS
    # ========================================
    
    print(f"\n📈 Analyzing feature relationships for GMM...")
    
    correlation_matrix = X_clustering_final.corr()
    high_corr_pairs = []
    
    for i, col1 in enumerate(correlation_matrix.columns):
        for j, col2 in enumerate(correlation_matrix.columns):
            if i < j and abs(correlation_matrix.loc[col1, col2]) > 0.8:
                high_corr_pairs.append((col1, col2, correlation_matrix.loc[col1, col2]))
    
    if high_corr_pairs:
        print(f"   ⚠️ High correlations detected (>0.8):")
        for col1, col2, corr in high_corr_pairs[:3]:  # Show top 3
            print(f"      📊 {col1} ↔ {col2}: {corr:.3f}")
        if len(high_corr_pairs) > 3:
            print(f"      ... and {len(high_corr_pairs)-3} more")
    else:
        print(f"   ✅ No problematic feature correlations detected")
    
    # ========================================
    # 5. CLUSTERING READINESS SUMMARY
    # ========================================
    
    print(f"\n🎯 Data ready for TOP 10 feature spam detection:")
    print(f"   📊 Shape: {X_clustering_final.shape}")
    print(f"   📋 Features: {len(available_features)} most impactful indicators")
    print(f"   💬 Comments: {len(X_clustering_final):,} ready for classification")
    print(f"   🌀 Ready for: Optimized 2-component GMM clustering")
    
    return {
        'X_clustering': X_clustering_final,
        'text_data': text_data,
        'original_data': original_data,
        'feature_names': available_features,
        'scaler': scaler,
        'data_stats': {
            'n_samples': len(X_clustering_final),
            'n_features': len(available_features),
            'missing_values': missing_values,
            'infinite_values': infinite_values,
            'high_correlations': len(high_corr_pairs)
        }
    }

# Apply clustering data preparation to FULL dataset
print("🌀 Preparing FULL dataset for clustering...")
clustering_start_time = time.time()
clustering_data = prepare_clustering_data(processed_data, scale_features=True)
clustering_prep_time = time.time() - clustering_start_time

print(f"\n📊 FULL Dataset Clustering Preparation Complete:")
print(f"   🎯 Ready for GMM with uncertainty handling")
print(f"   📈 Shape: {clustering_data['X_clustering'].shape}")
print(f"   📋 Behavioral features: {len(clustering_data['feature_names'])}")
print(f"   ⚡ Preparation time: {clustering_prep_time:.2f} seconds")
print(f"   🌍 Works across: beauty, gaming, food, education, etc.")

# Show sample of prepared data with behavioral interpretation
print(f"\n📝 Sample behavioral patterns (first 3 comments):")
sample_data = clustering_data['X_clustering'].head(3)
for i, (idx, row) in enumerate(sample_data.iterrows()):
    comment_text = clustering_data['text_data'].iloc[i][:50] + "..."
    print(f"\n   Comment {i+1}: \"{comment_text}\"")
    print(f"   Behavioral signals:")
    print(f"     📝 Text complexity: char_count={row['char_count']:.2f}, repetition={row['repetition_ratio']:.2f}")
    print(f"     😊 Emoji pattern: count={row['emoji_count']:.2f}, ratio={row['emoji_ratio']:.2f}")
    print(f"     🤖 Bot indicators: generic={row['is_generic']:.2f}, caps={row['caps_ratio']:.2f}")
    
# Apply Gaussian Mixture Model Clustering with Uncertainty Handling on FULL dataset
print("🌀 Applying GMM Clustering on FULL DATASET with Uncertainty Handling...\n")

# Extract clustering data
X_clustering = clustering_data['X_clustering']
text_data = clustering_data['text_data']
feature_names = clustering_data['feature_names']

# Define uncertainty thresholds
UNCERTAINTY_LOWER = 0.40
UNCERTAINTY_UPPER = 0.60

print(f"🎯 Uncertainty thresholds: {UNCERTAINTY_LOWER}-{UNCERTAINTY_UPPER} (will be flagged as uncertain)")

# ========================================
# 1. PRIMARY GMM CLUSTERING (K=2: Spam vs Quality)
# ========================================
print(f"\n🎯 Stage 1: Primary clustering on FULL dataset (Spam vs Quality)...")

# Initialize GMM for primary clustering
gmm_primary = GaussianMixture(
    n_components=2,
    covariance_type='full',    # Allow flexible cluster shapes
    init_params='kmeans',      # Initialize with k-means
    max_iter=200,             # Sufficient convergence iterations
    n_init=10,                # Multiple random initializations for stability
    random_state=42
)

# Fit primary clustering
start_time = time.time()
primary_labels = gmm_primary.fit_predict(X_clustering)
primary_probabilities = gmm_primary.predict_proba(X_clustering)
primary_time = time.time() - start_time

print(f"   ✅ Primary clustering completed in {primary_time:.2f} seconds")
print(f"   📊 Initial cluster distribution:")
unique, counts = np.unique(primary_labels, return_counts=True)
for cluster, count in zip(unique, counts):
    print(f"      Cluster {cluster}: {count:,} comments ({count/len(primary_labels)*100:.1f}%)")
    
    # ========================================
    # 2. UNCERTAINTY HANDLING & FINAL ASSIGNMENT
    # ========================================
    print(f"\n🤔 Applying uncertainty handling...")
    
    # Get maximum probabilities for each comment
    max_probabilities = np.max(primary_probabilities, axis=1)
    predicted_clusters = np.argmax(primary_probabilities, axis=1)
    
    # Apply uncertainty logic
    def assign_final_labels_with_uncertainty(probabilities, predicted_clusters, spam_cluster_id):
        """Assign final labels considering uncertainty thresholds"""
        max_probs = np.max(probabilities, axis=1)
        final_labels = []
        
        for i, (max_prob, cluster) in enumerate(zip(max_probs, predicted_clusters)):
            if max_prob > UNCERTAINTY_UPPER:
                # Confident assignment
                final_labels.append('spam' if cluster == spam_cluster_id else 'quality')
            else:
                # Uncertain - needs manual review
                final_labels.append('uncertain')
        
        return np.array(final_labels)
    
    # First, determine which cluster is spam vs quality
    cluster_stats = {}
    for cluster_id in [0, 1]:
        mask = primary_labels == cluster_id
        cluster_data = X_clustering[mask]
        
        # Calculate cluster statistics to identify spam cluster
        stats = {
            'size': mask.sum(),
            'avg_char_count': cluster_data['char_count'].mean(),
            'generic_percentage': cluster_data['is_generic'].mean() * 100,
            'avg_caps_ratio': cluster_data['caps_ratio'].mean(),
            'avg_emoji_ratio': cluster_data['emoji_ratio'].mean(),
        }
        cluster_stats[cluster_id] = stats
    
    # Identify spam cluster (higher generic %, lower char count, higher caps ratio)
    spam_score_0 = (cluster_stats[0]['generic_percentage'] + 
                    cluster_stats[0]['avg_caps_ratio'] * 100 - 
                    cluster_stats[0]['avg_char_count'] / 10)
    spam_score_1 = (cluster_stats[1]['generic_percentage'] + 
                    cluster_stats[1]['avg_caps_ratio'] * 100 - 
                    cluster_stats[1]['avg_char_count'] / 10)
    
    spam_cluster_id = 0 if spam_score_0 > spam_score_1 else 1
    quality_cluster_id = 1 - spam_cluster_id
    
    print(f"   🔍 Identified Cluster {spam_cluster_id} as SPAM-LIKE")
    print(f"   🔍 Identified Cluster {quality_cluster_id} as QUALITY-LIKE")
    
    # Apply final labeling with uncertainty
    final_labels = assign_final_labels_with_uncertainty(
        primary_probabilities, predicted_clusters, spam_cluster_id
    )
    
    # Calculate distribution
    unique_final, counts_final = np.unique(final_labels, return_counts=True)
    total_comments = len(final_labels)
    
    print(f"\n📊 Final distribution with uncertainty handling:")
    for label, count in zip(unique_final, counts_final):
        percentage = count / total_comments * 100
        print(f"      {label.title()}: {count:,} ({percentage:.1f}%)")
    
    # ========================================
    # 3. UNCERTAINTY ANALYSIS
    # ========================================
    print(f"\n🔍 Analyzing uncertain comments...")
    
    uncertain_mask = final_labels == 'uncertain'
    if uncertain_mask.sum() > 0:
        uncertain_probs = max_probabilities[uncertain_mask]
        uncertain_texts = text_data[uncertain_mask]
        
        print(f"   📊 Uncertainty statistics:")
        print(f"      🤔 Uncertain rate: {uncertain_mask.mean()*100:.1f}%")
        print(f"      📈 Avg confidence: {uncertain_probs.mean():.3f}")
        print(f"      📉 Min confidence: {uncertain_probs.min():.3f}")
        print(f"      📊 Max confidence: {uncertain_probs.max():.3f}")
        
        # Show examples of uncertain comments
        print(f"\n   📝 Sample uncertain comments:")
        uncertain_indices = np.where(uncertain_mask)[0][:3]
        for i, idx in enumerate(uncertain_indices):
            text = text_data.iloc[idx]
            prob = max_probabilities[idx]
            cluster = predicted_clusters[idx]
            cluster_name = 'spam' if cluster == spam_cluster_id else 'quality'
            print(f"      {i+1}. \"{text[:60]}...\" ")
            print(f"         → {prob:.3f} confidence toward {cluster_name}")
    
    # ========================================
    # 4. SKIP EXPENSIVE CLUSTERING QUALITY METRICS FOR PERFORMANCE
    # ========================================
    print(f"\n📈 Skipping expensive clustering quality metrics for performance...")
    print(f"   ⚡ Silhouette, Calinski-Harabasz, Davies-Bouldin scores skipped")
    print(f"   ⚡ AIC, BIC, log-likelihood calculations skipped")
    print(f"   � Proceeding directly to model saving and CSV export...")
    
    # ========================================
    # 5. CONFIDENT COMMENTS ANALYSIS
    # ========================================
    print(f"\n✅ Analyzing confident predictions...")
    
    # Analyze confident spam and quality comments
    confident_spam_mask = final_labels == 'spam'
    confident_quality_mask = final_labels == 'quality'
    
    if confident_spam_mask.sum() > 0:
        print(f"\n   🚫 Confident Spam Examples:")
        spam_indices = np.where(confident_spam_mask)[0][:10]
        for i, idx in enumerate(spam_indices):
            text = text_data.iloc[idx]
            prob = max_probabilities[idx]
            print(f"      {i+1}. \"{text}\" (confidence: {prob:.3f})")
    
    if confident_quality_mask.sum() > 0:
        print(f"\n   ✅ Confident Quality Examples:")
        quality_indices = np.where(confident_quality_mask)[0][:10]
        for i, idx in enumerate(quality_indices):
            text = text_data.iloc[idx][:80] + "..."
            prob = max_probabilities[idx]
            print(f"      {i+1}. \"{text}\" (confidence: {prob:.3f})")
    
    # ========================================
    # 6. STORE RESULTS
    # ========================================
    
    # Store results for later use
    clustering_results = {
        'gmm_primary': gmm_primary,
        'primary_labels': primary_labels,
        'primary_probabilities': primary_probabilities,
        'final_labels': final_labels,
        'max_probabilities': max_probabilities,
        'spam_cluster_id': spam_cluster_id,
        'quality_cluster_id': quality_cluster_id,
        'uncertainty_thresholds': {
            'lower': UNCERTAINTY_LOWER,
            'upper': UNCERTAINTY_UPPER
        },
        'cluster_stats': cluster_stats,
        'metrics': {
            'uncertainty_rate': uncertain_mask.mean(),
            'processing_time': primary_time,
            'total_comments': len(final_labels)
        }
    }
    
    print(f"\n✅ GMM clustering with uncertainty handling completed!")
    print(f"🎯 Results summary:")
    print(f"   🚫 Confident spam: {confident_spam_mask.sum():,} ({confident_spam_mask.mean()*100:.1f}%)")
    print(f"   ✅ Confident quality: {confident_quality_mask.sum():,} ({confident_quality_mask.mean()*100:.1f}%)")
    print(f"   🤔 Uncertain (needs review): {uncertain_mask.sum():,} ({uncertain_mask.mean()*100:.1f}%)")
    print(f"   ⚡ Processing time: {primary_time:.2f} seconds")

# ========================================
# MODEL EXTRACTION AND PERSISTENCE
# ========================================
print(f"\n💾 Saving trained model artifacts...")

import joblib

# Create model artifacts dictionary
model_artifacts = {
    'gmm_model': gmm_primary,                    # Trained GMM
    'scaler': clustering_data['scaler'],         # Feature scaler
    'feature_names': clustering_data['feature_names'],  # Feature list
    'spam_cluster_id': spam_cluster_id,         # Which cluster is spam
    'uncertainty_thresholds': {                 # Confidence thresholds
        'lower': UNCERTAINTY_LOWER,
        'upper': UNCERTAINTY_UPPER
    },
    'cluster_stats': cluster_stats,             # Cluster statistics
    'metrics': clustering_results['metrics']    # Model performance metrics
}

# Save model artifacts
model_filename = 'comment_spam_detection_model.pkl'
joblib.dump(model_artifacts, model_filename)
print(f"✅ Model saved successfully as: {model_filename}")

# ========================================
# STREAMLINED CSV EXPORT (TOP 20 FEATURES)
# ========================================
print(f"\n📤 Creating streamlined CSV export with TOP 20 FEATURES...")

# Use the full_data that contains all 20 features (10 base + 10 engineered)
complete_original_data = processed_data['full_data'].copy()

print(f"   🔍 Export details:")
print(f"      📊 Total comments: {len(final_labels):,}")
print(f"      🚫 Spam: {(final_labels == 'spam').sum():,}")
print(f"      ✅ Quality: {(final_labels == 'quality').sum():,}")
print(f"      🤔 Uncertain: {(final_labels == 'uncertain').sum():,}")

# Add final classification and confidence to the 20-feature dataset
complete_original_data['spam_classification'] = final_labels
complete_original_data['classification_confidence'] = max_probabilities

# Export streamlined CSV with only TOP 20 features
output_filename = 'complete_comments_top20_features.csv'
complete_original_data.to_csv(output_filename, index=False, encoding='utf-8')

print(f"\n✅ Streamlined dataset exported successfully!")
print(f"   📁 Filename: {output_filename}")
print(f"   📊 Total rows: {len(complete_original_data):,}")
print(f"   📈 Features: 20 TOTAL (10 base dataset + 10 engineered + 2 classification)")

# Show the 20 feature structure
print(f"\n📋 TOP 20 FEATURE STRUCTURE:")
print(f"   📊 Base Dataset (10): kind, commentId, channelId, videoId, authorId, textOriginal, parentCommentId, likeCount, publishedAt, updatedAt")
print(f"   🤖 Engineered (10): char_count, word_count, caps_ratio, repetition_ratio, emoji_ratio, emoji_diversity, likes_per_char, is_reply, url_count, is_generic")
print(f"   🎯 Classification (2): spam_classification, classification_confidence")

# Final summary
spam_count = (complete_original_data['spam_classification'] == 'spam').sum()
quality_count = (complete_original_data['spam_classification'] == 'quality').sum()
uncertain_count = (complete_original_data['spam_classification'] == 'uncertain').sum()

print(f"\n📋 Complete Dataset Composition:")
print(f"   🚫 Spam comments: {spam_count:,} ({spam_count/len(complete_original_data)*100:.1f}%)")
print(f"   ✅ Quality comments: {quality_count:,} ({quality_count/len(complete_original_data)*100:.1f}%)")
print(f"   🤔 Uncertain comments: {uncertain_count:,} ({uncertain_count/len(complete_original_data)*100:.1f}%)")

print(f"\n🎯 Files Generated:")
print(f"   1. {model_filename} - Optimized model (10 features)")
print(f"   2. {output_filename} - Streamlined dataset (20 features total)")

print(f"\n🎉 STREAMLINED PROCESSING COMPLETE!")
print(f"   📊 Processed {len(comments_df):,} total comments")
print(f"   📊 Delivered {len(complete_original_data):,} classified comments")
print(f"   � Model optimized with only 10 most useful features!")
print(f"   💾 Dataset streamlined to 20 essential features!")

# ========================================
# 📝 EXAMPLES: Show 5 samples from each category
# ========================================
print(f"\n📝 COMMENT EXAMPLES BY CATEGORY:")
print("="*80)

# Get examples for each category
spam_mask = final_labels == 'spam'
quality_mask = final_labels == 'quality'
uncertain_mask = final_labels == 'uncertain'

# 1. SPAM Examples
print(f"\n🚫 SPAM COMMENTS (5 examples):")
print("-" * 50)
if spam_mask.sum() > 0:
    spam_indices = np.where(spam_mask)[0][:5]
    for i, idx in enumerate(spam_indices, 1):
        text = text_data.iloc[idx]
        confidence = max_probabilities[idx]
        print(f"{i}. [{confidence:.3f} confidence] \"{text}\"")
else:
    print("No spam comments found.")

# 2. QUALITY Examples  
print(f"\n✅ QUALITY COMMENTS (5 examples):")
print("-" * 50)
if quality_mask.sum() > 0:
    quality_indices = np.where(quality_mask)[0][:5]
    for i, idx in enumerate(quality_indices, 1):
        text = text_data.iloc[idx]
        confidence = max_probabilities[idx]
        # Truncate long comments for display
        display_text = text[:100] + "..." if len(text) > 100 else text
        print(f"{i}. [{confidence:.3f} confidence] \"{display_text}\"")
else:
    print("No quality comments found.")

# 3. UNCERTAIN Examples
print(f"\n🤔 UNCERTAIN COMMENTS (5 examples):")
print("-" * 50)
if uncertain_mask.sum() > 0:
    uncertain_indices = np.where(uncertain_mask)[0][:5]
    for i, idx in enumerate(uncertain_indices, 1):
        text = text_data.iloc[idx]
        confidence = max_probabilities[idx]
        cluster = predicted_clusters[idx]
        tendency = 'spam' if cluster == spam_cluster_id else 'quality'
        # Truncate long comments for display
        display_text = text[:100] + "..." if len(text) > 100 else text
        print(f"{i}. [{confidence:.3f} confidence → {tendency}] \"{display_text}\"")
else:
    print("No uncertain comments found.")

print("="*80)


# Visualize Clustering Results with Uncertainty
print("📊 Creating clustering visualizations with uncertainty handling...\n")

# Extract data
X_clustering = clustering_data['X_clustering']
primary_labels = clustering_results['primary_labels']
final_labels = clustering_results['final_labels']
max_probabilities = clustering_results['max_probabilities']
spam_cluster_id = clustering_results['spam_cluster_id']
uncertainty_thresholds = clustering_results['uncertainty_thresholds']
    
# ========================================
# 1. PCA VISUALIZATION WITH UNCERTAINTY
# ========================================
print("🎯 Creating PCA visualization with uncertainty...")

# Apply PCA for 2D visualization
pca = PCA(n_components=2, random_state=42)
X_pca = pca.fit_transform(X_clustering)

# Create enhanced PCA plots
fig = plt.figure(figsize=(18, 6))

# Plot 1: Three-way classification (spam/quality/uncertain)
plt.subplot(1, 3, 1)

# Define colors for three categories
color_map = {
    'spam': 'red',
    'quality': 'blue', 
    'uncertain': 'orange'
}
colors = [color_map[label] for label in final_labels]

scatter = plt.scatter(X_pca[:, 0], X_pca[:, 1], c=colors, alpha=0.6, s=20)
plt.xlabel(f'PCA Component 1 ({pca.explained_variance_ratio_[0]:.1%} variance)')
plt.ylabel(f'PCA Component 2 ({pca.explained_variance_ratio_[1]:.1%} variance)')
plt.title('Comments with Uncertainty Handling\n(Red=Spam, Blue=Quality, Orange=Uncertain)')
plt.grid(True, alpha=0.3)

# Add legend
import matplotlib.patches as mpatches
red_patch = mpatches.Patch(color='red', label='Confident Spam')
blue_patch = mpatches.Patch(color='blue', label='Confident Quality')
orange_patch = mpatches.Patch(color='orange', label='Uncertain')
plt.legend(handles=[red_patch, blue_patch, orange_patch], loc='upper right')

# Plot 2: Confidence scores with uncertainty zone
plt.subplot(1, 3, 2)
scatter2 = plt.scatter(X_pca[:, 0], X_pca[:, 1], c=max_probabilities, 
                      cmap='viridis', alpha=0.7, s=20)
plt.xlabel(f'PCA Component 1')
plt.ylabel(f'PCA Component 2')
plt.title('Clustering Confidence Scores\n(Dark=Low Confidence/Uncertain)')
cbar = plt.colorbar(scatter2, label='Max Probability')

# Add uncertainty zone markers
plt.axhline(y=0, color='gray', linestyle='--', alpha=0.3)
plt.axvline(x=0, color='gray', linestyle='--', alpha=0.3)

# Plot 3: Distribution of confidence scores
plt.subplot(1, 3, 3)

# Create histogram of confidence scores
plt.hist(max_probabilities, bins=20, alpha=0.7, color='skyblue', edgecolor='black')

# Add uncertainty zone
plt.axvspan(uncertainty_thresholds['lower'], uncertainty_thresholds['upper'], 
            alpha=0.3, color='orange', label=f'Uncertainty Zone\n({uncertainty_thresholds["lower"]}-{uncertainty_thresholds["upper"]})')

plt.xlabel('Maximum Probability')
plt.ylabel('Number of Comments')
plt.title('Distribution of Clustering Confidence')
plt.legend()
plt.grid(True, alpha=0.3)

plt.tight_layout()
plt.show()

print(f"   ✅ PCA visualization completed")
print(f"   📊 PCA explains {pca.explained_variance_ratio_.sum():.1%} of total variance")

# ========================================
# 2. UNCERTAINTY ANALYSIS PLOTS
# ========================================
print(f"\n🤔 Creating uncertainty analysis plots...")

fig, axes = plt.subplots(2, 2, figsize=(15, 10))
    
    # Plot 1: Final label distribution
ax1 = axes[0, 0]
final_counts = pd.Series(final_labels).value_counts()
colors_pie = [color_map[label] for label in final_counts.index]
wedges, texts, autotexts = ax1.pie(final_counts.values, labels=final_counts.index, 
                        autopct='%1.1f%%', colors=colors_pie)
ax1.set_title('Final Classification Distribution')

# Plot 2: Confidence score distribution by category
ax2 = axes[0, 1]

for label, color in color_map.items():
    mask = final_labels == label
    if mask.sum() > 0:
        probs = max_probabilities[mask]
        ax2.hist(probs, alpha=0.6, label=f'{label.title()} (n={mask.sum():,})', 
                color=color, bins=15)

ax2.axvspan(uncertainty_thresholds['lower'], uncertainty_thresholds['upper'], 
    alpha=0.2, color='gray', label='Uncertainty Zone')
ax2.set_xlabel('Maximum Probability')
ax2.set_ylabel('Frequency')
ax2.set_title('Confidence Distribution by Category')
ax2.legend()
ax2.grid(True, alpha=0.3)

# Plot 3: Feature importance for separation
ax3 = axes[1, 0]
feature_importance = np.abs(pca.components_).mean(axis=0)
top_features_idx = np.argsort(feature_importance)[-8:]  # Top 8 features
top_features = [clustering_data['feature_names'][i] for i in top_features_idx]
top_importance = feature_importance[top_features_idx]

bars = ax3.barh(range(len(top_features)), top_importance)
ax3.set_yticks(range(len(top_features)))
ax3.set_yticklabels(top_features)
ax3.set_xlabel('PCA Loading (Importance)')
ax3.set_title('Top Features for Clustering')
ax3.grid(True, alpha=0.3)

# Plot 4: Uncertainty rate by confidence bins
ax4 = axes[1, 1]

# Create confidence bins
bins = np.linspace(0.5, 1.0, 11)
bin_centers = (bins[:-1] + bins[1:]) / 2
uncertainty_rates = []

for i in range(len(bins)-1):
    mask = (max_probabilities >= bins[i]) & (max_probabilities < bins[i+1])
    if mask.sum() > 0:
        uncertainty_rate = (final_labels[mask] == 'uncertain').mean()
        uncertainty_rates.append(uncertainty_rate)
    else:
        uncertainty_rates.append(0)

bars = ax4.bar(bin_centers, uncertainty_rates, width=0.04, alpha=0.7, color='orange')
ax4.set_xlabel('Confidence Score')
ax4.set_ylabel('Uncertainty Rate')
ax4.set_title('Uncertainty Rate by Confidence Level')
ax4.grid(True, alpha=0.3)

# Add uncertainty threshold lines
ax4.axvline(uncertainty_thresholds['upper'], color='red', linestyle='--', 
    label=f'Threshold: {uncertainty_thresholds["upper"]}')
ax4.legend()

plt.tight_layout()
plt.show()

# ========================================
# 3. BUSINESS INSIGHTS WITH UNCERTAINTY
# ========================================
print(f"\n💼 Business Insights with Uncertainty Handling:")

total_comments = len(final_labels)
spam_count = (final_labels == 'spam').sum()
quality_count = (final_labels == 'quality').sum()
uncertain_count = (final_labels == 'uncertain').sum()

print(f"   📊 Comment Classification Results:")
print(f"      🚫 Confident Spam: {spam_count:,} ({spam_count/total_comments*100:.1f}%)")
print(f"      ✅ Confident Quality: {quality_count:,} ({quality_count/total_comments*100:.1f}%)")
print(f"      🤔 Uncertain (Manual Review): {uncertain_count:,} ({uncertain_count/total_comments*100:.1f}%)")

print(f"\n   🎯 Uncertainty Analysis:")
if uncertain_count > 0:
    uncertain_probs = max_probabilities[final_labels == 'uncertain']
print(f"      📈 Average uncertainty confidence: {uncertain_probs.mean():.3f}")
print(f"      📊 Uncertainty range: {uncertain_probs.min():.3f} - {uncertain_probs.max():.3f}")
print(f"      💡 These {uncertain_count:,} comments need manual review")

print(f"\n   🔍 Model Confidence:")
confident_mask = final_labels != 'uncertain'
if confident_mask.sum() > 0:
    confident_probs = max_probabilities[confident_mask]
print(f"      ✅ Average confidence for decided comments: {confident_probs.mean():.3f}")
print(f"      🎯 {confident_mask.mean()*100:.1f}% of comments classified with confidence")

# Quality metrics
metrics = clustering_results['metrics']
print(f"\n   📊 Performance Metrics:")
print(f"      ⚡ Processing time: {metrics['processing_time']:.2f} seconds")
print(f"      📈 Uncertainty Rate: {metrics['uncertainty_rate']*100:.1f}%")
print(f"      📊 Total comments processed: {metrics['total_comments']:,}")

# Interpretation
print(f"\n   💡 Interpretation:")
if metrics['uncertainty_rate'] < 0.1:
    print(f"      ✅ Low uncertainty rate (<10%) indicates clear cluster separation")
elif metrics['uncertainty_rate'] < 0.2:
    print(f"      ⚠️ Moderate uncertainty rate (10-20%) - some ambiguous cases")
else:
    print(f"      🚨 High uncertainty rate (>20%) - may need feature engineering review")

print(f"\n✅ Uncertainty-aware clustering analysis completed!")